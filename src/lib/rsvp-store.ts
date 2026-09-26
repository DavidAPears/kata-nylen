import type { RsvpInput } from "./validation";
import { createSheetsStore, sheetsConfigFromEnv } from "./rsvp-store-sheets";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  RSVP storage
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The rest of the app talks to the `RsvpStore` interface and nothing else, so
 * changing where attendees are recorded is a change to this file alone.
 *
 * Default selection:
 *   • Google Sheets when GOOGLE_SHEETS_* env vars are present
 *   • otherwise log-only, so the whole flow works locally with no credentials
 */

export type RsvpRecord = RsvpInput & {
  submittedAt: string;
  /** Lower-cased email, used for de-duplication. */
  dedupeKey: string;
};

export type SaveResult =
  | { status: "saved" }
  | { status: "duplicate" }
  | { status: "full" }
  /** The store failed. The RSVP is still honoured — see `saveRsvp` below. */
  | { status: "error"; reason: string };

export interface RsvpStore {
  readonly name: string;
  /** True when this adapter keeps a durable, exportable list. */
  readonly durable: boolean;
  save(record: RsvpRecord): Promise<SaveResult>;
}

/** No durable storage: the RSVP is logged and the notification email is the record. */
const logOnlyStore: RsvpStore = {
  name: "log-only",
  durable: false,
  async save(record) {
    // Deliberately does not log the email address — collect and expose the
    // minimum (brief §16). The notification email carries the full details.
    console.info(
      `[rsvp] received guests=${record.guests} consent=${record.marketingConsent} at=${record.submittedAt}`,
    );
    return { status: "saved" };
  },
};

let activeStore: RsvpStore | null = null;

function createDefaultStore(): RsvpStore {
  const sheets = sheetsConfigFromEnv();
  if (sheets) return createSheetsStore(sheets);
  return logOnlyStore;
}

export function getRsvpStore(): RsvpStore {
  if (!activeStore) activeStore = createDefaultStore();
  return activeStore;
}

/** Used by tests, and available if a different adapter is ever wired in. */
export function setRsvpStore(store: RsvpStore): void {
  activeStore = store;
}

export function resetRsvpStore(): void {
  activeStore = null;
}

/**
 * Saves an RSVP without ever letting a storage outage cost someone their place.
 *
 * If the Sheets API is down, misconfigured or rate-limited, we do NOT return an
 * error to the visitor. They are a guest at a book launch, not a database
 * transaction: they get their confirmation, and the organiser notification
 * email — which contains every field — becomes the recoverable record of the
 * submission. The failure is logged loudly so it can be reconciled afterwards.
 *
 * The alternative (failing the request) would turn a spreadsheet hiccup into a
 * lost attendee, which is strictly worse for the thing this site exists to do.
 */
export async function saveRsvp(record: RsvpRecord): Promise<SaveResult> {
  const store = getRsvpStore();
  try {
    return await store.save(record);
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    console.error(
      `[rsvp:store-failed] store=${store.name}: RSVP accepted anyway; ` +
        `recover it from the organiser notification email. Reason: ${reason}`,
    );
    return { status: "error", reason };
  }
}

export function toRecord(input: RsvpInput): RsvpRecord {
  return {
    ...input,
    submittedAt: new Date().toISOString(),
    dedupeKey: input.email.trim().toLowerCase(),
  };
}
