import { JWT } from "google-auth-library";
import type { RsvpStore, RsvpRecord, SaveResult } from "./rsvp-store";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Google Sheets RSVP store
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Appends each RSVP as a row in a spreadsheet Kata can open, read and export
 * herself. Chosen over a database specifically so that nobody has to build an
 * admin screen for her to see who is coming.
 *
 * Auth is a service account (JWT), which means no OAuth consent screen and no
 * human in the loop — the server signs its own token. The service account is
 * given access by sharing the sheet with its email address, exactly like
 * sharing with a person.
 *
 * We talk to the REST API directly rather than pulling in `googleapis`, which
 * is a very large dependency for the two calls we make.
 */

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const API = "https://sheets.googleapis.com/v4/spreadsheets";

export const SHEET_HEADERS = [
  "Submitted at",
  "Name",
  "Email",
  "Guests",
  "Marketing consent",
] as const;

export type SheetsConfig = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
  /** Tab name within the spreadsheet. */
  tabName: string;
  /** Tab that holds people who applied after the event filled up. */
  waitlistTabName: string;
  /**
   * Forces every new RSVP onto the waiting list, regardless of capacity.
   *
   * Set when the guest list is full and counting rows is beside the point:
   * the organiser already knows. Capacity still works and has the same
   * effect, so either route reaches the waiting list rather than a refusal.
   */
  waitingList: boolean;
  /** Optional cap on total places; beyond it, RSVPs go to the waiting list. */
  capacity?: number;
};

/** Reads config from the environment, or returns null if it isn't configured. */
export function sheetsConfigFromEnv(): SheetsConfig | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !rawKey) return null;

  const capacity = process.env.RSVP_CAPACITY
    ? Number(process.env.RSVP_CAPACITY)
    : undefined;

  return {
    spreadsheetId,
    clientEmail,
    // Env vars cannot hold real newlines, so the key is stored with literal
    // "\n" sequences and unescaped here.
    privateKey: rawKey.replace(/\\n/g, "\n"),
    tabName: process.env.GOOGLE_SHEETS_TAB_NAME || "RSVPs",
    waitlistTabName: process.env.GOOGLE_SHEETS_WAITLIST_TAB_NAME || "Waitlist",
    // Any of the usual truthy spellings, because this gets typed into a
    // Vercel form by hand under time pressure.
    waitingList: /^(1|true|yes|on)$/i.test(process.env.RSVP_WAITING_LIST ?? ""),
    capacity: Number.isFinite(capacity) ? capacity : undefined,
  };
}

/** Quotes a tab name for use in an A1 range (Sheets requires ' around names). */
function range(tabName: string, cells: string): string {
  return `${encodeURIComponent(`'${tabName.replace(/'/g, "''")}'!${cells}`)}`;
}

export function createSheetsStore(
  config: SheetsConfig,
  // Injectable for tests.
  deps: {
    getToken?: () => Promise<string>;
    fetchFn?: typeof fetch;
  } = {},
): RsvpStore {
  const fetchFn = deps.fetchFn ?? fetch;

  const getToken =
    deps.getToken ??
    (async () => {
      const client = new JWT({
        email: config.clientEmail,
        key: config.privateKey,
        scopes: [SCOPE],
      });
      const { access_token: token } = await client.authorize();
      if (!token) throw new Error("Google auth returned no access token");
      return token;
    });

  async function call(path: string, init?: RequestInit): Promise<unknown> {
    const token = await getToken();
    /*
      Most paths hang off the spreadsheet id with a slash, but two do not:
      ":batchUpdate" attaches directly to the id, and a bare "?fields=..."
      queries the spreadsheet itself. Joining those with a slash gives
      ".../id/:batchUpdate", which 404s.

      That would have failed only when the waiting list first needed its tab
      created, and `saveRsvp` deliberately swallows store errors so an outage
      never costs a guest their place. The visitor would have been told they
      were on the list while nothing was written anywhere.
    */
    const url = /^[:?]/.test(path)
      ? `${API}/${config.spreadsheetId}${path}`
      : `${API}/${config.spreadsheetId}/${path}`;
    const response = await fetchFn(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Sheets API ${response.status} ${response.statusText}: ${body.slice(0, 300)}`,
      );
    }
    return response.json();
  }

  /** Existing email + places columns, used for de-duplication and capacity. */
  async function readExisting(
    tabName: string,
  ): Promise<{ emails: string[]; guests: number }> {
    const data = (await call(`values/${range(tabName, "C2:D")}`)) as {
      values?: string[][];
    };
    const rows = data.values ?? [];
    return {
      emails: rows.map((row) => (row[0] ?? "").trim().toLowerCase()).filter(Boolean),
      guests: rows.reduce((total, row) => total + (Number(row[1]) || 0), 0),
    };
  }

  /**
   * True when an error is Sheets saying the tab does not exist.
   *
   * A missing tab comes back as 400 "Unable to parse range", because the tab
   * name is part of the range.
   */
  function isMissingTab(cause: unknown): boolean {
    const message = cause instanceof Error ? cause.message : String(cause);
    return message.includes("Sheets API 400") && /Unable to parse range/i.test(message);
  }

  async function createTab(tabName: string): Promise<void> {
    await call(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: tabName } } }],
      }),
    });
  }

  const headersEnsured = new Set<string>();

  /**
   * Writes the header row once per tab, creating the tab if it is missing.
   *
   * Deliberately probes first and creates only on failure, rather than listing
   * the spreadsheet's tabs up front. Listing cost an extra Google round trip
   * on every single RSVP, for a question whose answer is almost always yes,
   * and it pushed the endpoint past five seconds often enough for the browser
   * test to catch it.
   *
   * The waiting-list tab still gets created on first use, which is the point:
   * nobody has to add it by hand with exactly the right name.
   */
  async function ensureHeaders(tabName: string): Promise<void> {
    if (headersEnsured.has(tabName)) return;

    let data: { values?: string[][] };
    try {
      data = (await call(`values/${range(tabName, "A1:E1")}`)) as {
        values?: string[][];
      };
    } catch (cause) {
      if (!isMissingTab(cause)) throw cause;
      await createTab(tabName);
      data = {};
    }

    if (!data.values || data.values.length === 0) {
      await call(`values/${range(tabName, "A1")}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [SHEET_HEADERS] }),
      });
    }
    headersEnsured.add(tabName);
  }

  async function append(tabName: string, record: RsvpRecord): Promise<void> {
    await call(
      `values/${range(tabName, "A:E")}:append` +
        "?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS",
      {
        method: "POST",
        body: JSON.stringify({
          values: [
            [
              record.submittedAt,
              record.name,
              record.email,
              record.guests,
              record.marketingConsent ? "yes" : "no",
            ],
          ],
        }),
      },
    );
  }

  return {
    name: "google-sheets",
    durable: true,

    async save(record: RsvpRecord): Promise<SaveResult> {
      await ensureHeaders(config.tabName);
      const confirmed = await readExisting(config.tabName);

      // Someone already holding a place who submits again is still confirmed.
      // Falling through here would quietly move a guest to the waiting list,
      // which is the one outcome worse than doing nothing.
      if (confirmed.emails.includes(record.dedupeKey)) {
        return { status: "duplicate" };
      }

      const full =
        config.waitingList ||
        (config.capacity !== undefined &&
          confirmed.guests + record.guests > config.capacity);

      if (!full) {
        await append(config.tabName, record);
        return { status: "saved" };
      }

      await ensureHeaders(config.waitlistTabName);
      const waiting = await readExisting(config.waitlistTabName);
      if (waiting.emails.includes(record.dedupeKey)) {
        return { status: "duplicate" };
      }

      await append(config.waitlistTabName, record);
      return { status: "waitlisted" };
    },
  };
}
