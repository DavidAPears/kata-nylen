import type { RsvpInput } from "./validation";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  RSVP storage adapter
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Where the attendee list lives is still an open decision, so the rest of the
 * app talks to this interface and nothing else. Swapping the backing store is
 * a change to this file alone — routes, forms, emails and tests are unaffected.
 *
 * Options on the table:
 *   • Google Sheet (service account) — Kata sees and exports the list herself
 *   • Postgres — needs an admin UI built before anyone can read it
 *   • Email-only   — no durable list, weak against brief §10
 *
 * Until that is settled, the default adapter records the RSVP in the server
 * log and relies on the notification email as the record. That is honest about
 * what it does: it does NOT claim to persist anything durably.
 */

export type RsvpRecord = RsvpInput & {
  submittedAt: string;
  /** Lower-cased email, used for de-duplication. */
  dedupeKey: string;
};

export type SaveResult =
  | { status: "saved" }
  | { status: "duplicate" }
  | { status: "full" };

export interface RsvpStore {
  readonly name: string;
  /** True when this adapter keeps a durable, exportable list. */
  readonly durable: boolean;
  save(record: RsvpRecord): Promise<SaveResult>;
}

/**
 * Default: no durable storage. The RSVP is logged and emailed onward.
 * Replace with a real adapter once the storage decision is made.
 */
const logOnlyStore: RsvpStore = {
  name: "log-only",
  durable: false,
  async save(record) {
    // Deliberately does not log the email address — see brief §16, collect and
    // expose the minimum. The notification email carries the full details.
    console.info(
      `[rsvp] received guests=${record.guests} consent=${record.marketingConsent} at=${record.submittedAt}`,
    );
    return { status: "saved" };
  },
};

let activeStore: RsvpStore = logOnlyStore;

export function getRsvpStore(): RsvpStore {
  return activeStore;
}

/** Used by tests and by the eventual real adapter's registration. */
export function setRsvpStore(store: RsvpStore): void {
  activeStore = store;
}

export function resetRsvpStore(): void {
  activeStore = logOnlyStore;
}

export function toRecord(input: RsvpInput): RsvpRecord {
  return {
    ...input,
    submittedAt: new Date().toISOString(),
    dedupeKey: input.email.trim().toLowerCase(),
  };
}
