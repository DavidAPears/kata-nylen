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
  /** Optional cap on total guests; when set, RSVPs beyond it are refused. */
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
    const response = await fetchFn(`${API}/${config.spreadsheetId}/${path}`, {
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

  /** Existing email + guest columns, used for de-duplication and capacity. */
  async function readExisting(): Promise<{ emails: string[]; guests: number }> {
    const data = (await call(`values/${range(config.tabName, "C2:D")}`)) as {
      values?: string[][];
    };
    const rows = data.values ?? [];
    return {
      emails: rows.map((row) => (row[0] ?? "").trim().toLowerCase()).filter(Boolean),
      guests: rows.reduce((total, row) => total + (Number(row[1]) || 0), 0),
    };
  }

  let headersEnsured = false;

  /** Writes the header row once, if the sheet is empty. */
  async function ensureHeaders(): Promise<void> {
    if (headersEnsured) return;
    const data = (await call(`values/${range(config.tabName, "A1:E1")}`)) as {
      values?: string[][];
    };
    if (!data.values || data.values.length === 0) {
      await call(
        `values/${range(config.tabName, "A1")}?valueInputOption=RAW`,
        {
          method: "PUT",
          body: JSON.stringify({ values: [SHEET_HEADERS] }),
        },
      );
    }
    headersEnsured = true;
  }

  return {
    name: "google-sheets",
    durable: true,

    async save(record: RsvpRecord): Promise<SaveResult> {
      await ensureHeaders();
      const existing = await readExisting();

      if (existing.emails.includes(record.dedupeKey)) {
        return { status: "duplicate" };
      }

      if (
        config.capacity !== undefined &&
        existing.guests + record.guests > config.capacity
      ) {
        return { status: "full" };
      }

      await call(
        `values/${range(config.tabName, "A:E")}:append` +
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

      return { status: "saved" };
    },
  };
}
