import type { RsvpRecord } from "../rsvp-store";
import { getCalendarEvent } from "../ics";
import { eventDateTime } from "../event-time";
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
        `  ${eventDateTime(event.startsAt, locale)}`,
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

/**
 * Sent when the guest list is full and the person has gone onto the waiting
 * list instead.
 *
 * Says so plainly in the first line. The form, the button and the fields are
 * deliberately unchanged, so this email is the first moment anyone learns the
 * evening is full: burying that under pleasantries would be unkind, and they
 * would find out anyway when no place arrived.
 */
export function attendeeWaitlist(record: RsvpRecord, locale: Locale) {
  const event = getCalendarEvent(locale);
  const details = event
    ? [
        "",
        locale === "sv" ? "Det gäller:" : "The event:",
        `  ${event.title}`,
        `  ${eventDateTime(event.startsAt, locale)}`,
        `  ${event.location}`,
        "",
        event.url,
      ].join("\n")
    : "";

  if (locale === "sv") {
    return {
      subject: "Du står på väntelistan: bokrelease med Kata Nylén",
      text: [
        `Hej ${record.name},`,
        "",
        "Tack för din anmälan. Kvällen är fullbokad, så du står nu på väntelistan.",
        "Om en plats blir ledig får du ett mejl.",
        details,
        "",
        "Tack för ditt intresse,",
        "Kata Nylén",
      ].join("\n"),
    };
  }

  return {
    subject: "You are on the waiting list: Kata Nylén book release",
    text: [
      `Hello ${record.name},`,
      "",
      "Thank you for registering. The evening is fully booked, so you are now on the waiting list.",
      "If a place becomes available you will get an email.",
      details,
      "",
      "Thank you for your interest,",
      "Kata Nylén",
    ].join("\n"),
  };
}

export function organiserNotification(
  record: RsvpRecord,
  /** True when the attendee list could not be written — see `saveRsvp`. */
  storeFailed = false,
  /** True when the guest list was full and this went to the waiting list. */
  waitlisted = false,
) {
  const kind = waitlisted ? "Waiting list" : "New RSVP";
  return {
    subject: storeFailed
      ? `${kind} (NOT SAVED TO SHEET): ${record.name}`
      : `${kind}: ${record.name}`,
    text: [
      waitlisted
        ? "Guest list is full, so this person went onto the waiting list."
        : "New RSVP for the book release.",
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
