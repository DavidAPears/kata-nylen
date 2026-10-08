import { describe, it, expect, afterEach } from "vitest";
import { eventDateTime } from "../event-time";
import { attendeeConfirmation } from "../messages/rsvp";
import { launchEvent, resolved } from "@/content/facts";
import type { RsvpRecord } from "../rsvp-store";

/**
 * The launch is at 17.00 in Stockholm. Every surface has to say so, whatever
 * clock the code is running on.
 *
 * The confirmation email used to format with the runtime's timezone. On
 * Vercel that is UTC, so guests were invited at 17.00 and then told 16.00 in
 * writing. Nobody saw it in development because this project is written on a
 * machine in Stockholm, where the two agree. These tests force UTC so the
 * difference is visible here instead of in someone's inbox.
 */

const original = process.env.TZ;
afterEach(() => {
  process.env.TZ = original;
});

const record: RsvpRecord = {
  name: "Test Gäst",
  email: "gast@example.com",
  guests: 0,
  marketingConsent: false,
  submittedAt: "2026-10-08T12:00:00.000Z",
};

describe("eventDateTime", () => {
  it("uses the event's clock, not the server's", () => {
    const iso = "2026-11-11T17:00:00+01:00";
    process.env.TZ = "UTC";
    expect(eventDateTime(iso, "sv")).toContain("17:00");
    process.env.TZ = "America/Los_Angeles";
    expect(eventDateTime(iso, "sv")).toContain("17:00");
    process.env.TZ = "Australia/Sydney";
    expect(eventDateTime(iso, "en")).toContain("17:00");
  });

  it("names the right day wherever it runs", () => {
    // Sydney is far enough ahead that a naive formatter rolls the date over.
    process.env.TZ = "Australia/Sydney";
    expect(eventDateTime("2026-11-11T17:00:00+01:00", "sv")).toContain("11 november");
  });
});

describe("the confirmation email", () => {
  it("tells the guest the same time the invitation does", () => {
    // The actual bug, as a guest experienced it: invitation 17.00, email 16.00.
    process.env.TZ = "UTC";
    for (const locale of ["sv", "en"] as const) {
      const { text } = attendeeConfirmation(record, locale);
      const startsAt = resolved(launchEvent.startsAt);
      if (!startsAt) continue;
      const expected = eventDateTime(startsAt, locale);
      expect(text, `${locale} confirmation`).toContain(expected);
      expect(text, `${locale} must not say 16`).not.toMatch(/\b16[:.]00\b/);
    }
  });
});
