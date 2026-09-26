import { describe, it, expect } from "vitest";
import { en } from "../en";
import { sv } from "../sv";
import {
  attendeeConfirmation,
  organiserNotification,
  contactNotification,
} from "@/lib/messages/rsvp";
import type { RsvpRecord } from "@/lib/rsvp-store";

/**
 * No em dashes or en dashes in anything a person reads.
 *
 * They are a recognisable tell of machine-written copy, and this site's whole
 * proposition is a real person's voice. Commas, colons and full stops do the
 * same work without the signature.
 *
 * Covers site copy and outgoing email. Rendered pages are checked separately
 * in `e2e/no-dashes.spec.ts`, which also catches copy written inline in a
 * component rather than in the content files.
 */

const FORBIDDEN = /[—–]/;

function walk(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => walk(item, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      walk(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

describe("site copy contains no em or en dashes", () => {
  it.each([
    ["English", en],
    ["Swedish", sv],
  ])("%s", (_label, content) => {
    const offenders = walk(content)
      .filter(([, text]) => FORBIDDEN.test(text))
      .map(([path, text]) => `${path}: ${text}`);

    expect(offenders).toEqual([]);
  });
});

describe("outgoing email contains no em or en dashes", () => {
  const record: RsvpRecord = {
    name: "Test Gäst",
    email: "gast@example.com",
    guests: 2,
    marketingConsent: true,
    website: "",
    submittedAt: "2026-04-01T10:00:00.000Z",
    dedupeKey: "gast@example.com",
  };

  const messages = [
    ["attendee confirmation (sv)", attendeeConfirmation(record, "sv")],
    ["attendee confirmation (en)", attendeeConfirmation(record, "en")],
    ["organiser notification", organiserNotification(record)],
    ["organiser notification, store failed", organiserNotification(record, true)],
    [
      "contact notification",
      contactNotification({
        name: "Organiser",
        email: "org@example.com",
        organisation: "",
        reason: "speaking",
        message: "Hello",
      }),
    ],
  ] as const;

  it.each(messages)("%s", (_label, message) => {
    expect(message.subject).not.toMatch(FORBIDDEN);
    expect(message.text).not.toMatch(FORBIDDEN);
  });
});
