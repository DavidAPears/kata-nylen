import type { RsvpRecord } from "../rsvp-store";
import { getCalendarEvent } from "../ics";
import type { Locale } from "@/i18n/routing";

/**
 * Plain-text email bodies. Deliberately text-only for now: they render
 * everywhere, never trip spam filters on image-heavy HTML, and cost nothing to
 * maintain. §23 lists "confirmation-email wording" as still needed from Kata —
 * these are drafts for her to rewrite.
 */

export function attendeeConfirmation(record: RsvpRecord, locale: Locale) {
  const event = getCalendarEvent(locale);
  const details = event
    ? [
        "",
        locale === "sv" ? "Detaljer:" : "Details:",
        `  ${event.title}`,
        `  ${new Date(event.startsAt).toLocaleString(locale === "sv" ? "sv-SE" : "en-GB")}`,
        `  ${event.location}`,
        "",
        event.url,
      ].join("\n")
    : "";

  if (locale === "sv") {
    return {
      subject: "Din plats är bokad: bokrelease med Kata Nylén",
      text: [
        `Hej ${record.name},`,
        "",
        "Tack för din anmälan. Du står på listan.",
        details,
        "",
        "Varmt välkommen,",
        "Kata Nylén",
      ].join("\n"),
    };
  }

  return {
    subject: "You're on the list: Kata Nylén book release",
    text: [
      `Hello ${record.name},`,
      "",
      "Thank you for registering. Your place is reserved.",
      details,
      "",
      "Warm wishes,",
      "Kata Nylén",
    ].join("\n"),
  };
}

export function organiserNotification(
  record: RsvpRecord,
  /** True when the attendee list could not be written — see `saveRsvp`. */
  storeFailed = false,
) {
  return {
    subject: storeFailed
      ? `New RSVP (NOT SAVED TO SHEET): ${record.name}`
      : `New RSVP: ${record.name}`,
    text: [
      "New RSVP for the book release.",
      ...(storeFailed
        ? [
            "",
            "⚠️  This RSVP could NOT be written to the attendee sheet.",
            "    Add it manually. This email is the only record.",
          ]
        : []),
      "",
      `Name:      ${record.name}`,
      `Email:     ${record.email}`,
      `Guests:    ${record.guests}`,
      `Marketing: ${record.marketingConsent ? "yes, consented" : "no"}`,
      `Submitted: ${record.submittedAt}`,
    ].join("\n"),
  };
}

export function contactNotification(input: {
  name: string;
  email: string;
  organisation: string;
  reason: string;
  message: string;
}) {
  return {
    subject: `Enquiry (${input.reason}): ${input.name}`,
    text: [
      `Reason:       ${input.reason}`,
      `Name:         ${input.name}`,
      `Email:        ${input.email}`,
      `Organisation: ${input.organisation || "(none)"}`,
      "",
      input.message,
    ].join("\n"),
  };
}
