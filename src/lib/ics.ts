import { launchEvent, book, site, isResolved } from "@/content/facts";

/**
 * Calendar output for the book launch.
 *
 * This is the useful half of "put it in Google Calendar": the guest adds the
 * event to whatever calendar they already use. It needs no API, no OAuth and
 * no key — an .ics file is just text, and the Google Calendar link is a plain
 * URL. Nobody's email address is exposed to anybody else.
 */

function toIcsStamp(iso: string): string {
  // 2026-04-16T18:00:00+02:00 → 20260416T160000Z
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string): string {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

/** Folds long lines to 75 octets as required by RFC 5545. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    chunks.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) chunks.push(" " + rest);
  return chunks.join("\r\n");
}

export type CalendarEvent = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  url: string;
};

/** Returns the event only when the real details are confirmed (brief §21.3). */
export function getCalendarEvent(locale: "sv" | "en"): CalendarEvent | null {
  if (!isResolved(launchEvent.startsAt) || !isResolved(launchEvent.venueName)) {
    return null;
  }

  const bookTitle = isResolved(book.title) ? book.title : null;
  const title = bookTitle
    ? locale === "sv"
      ? `Bokrelease: ${bookTitle}`
      : `Book release: ${bookTitle}`
    : locale === "sv"
      ? "Bokrelease — Kata Nylén"
      : "Book release — Kata Nylén";

  const addressParts = [
    launchEvent.venueName,
    isResolved(launchEvent.addressLine) ? launchEvent.addressLine : null,
    isResolved(launchEvent.postalCode) ? launchEvent.postalCode : null,
    isResolved(launchEvent.city) ? launchEvent.city : null,
  ].filter(Boolean);

  const endsAt = isResolved(launchEvent.endsAt)
    ? launchEvent.endsAt
    : // Default to a two-hour event when no end time is confirmed.
      new Date(new Date(launchEvent.startsAt).getTime() + 2 * 60 * 60 * 1000).toISOString();

  return {
    title,
    description:
      locale === "sv"
        ? "Bokrelease med Kata Nylén."
        : "Book release with Kata Nylén.",
    startsAt: launchEvent.startsAt,
    endsAt,
    location: addressParts.join(", "),
    url: `${site.url}/${locale}/${locale === "sv" ? "bokrelease" : "book-release"}`,
  };
}

export function buildIcs(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//katanylen.com//Book release//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:book-release-${toIcsStamp(event.startsAt)}@katanylen.com`,
    `DTSTAMP:${toIcsStamp(new Date().toISOString())}`,
    `DTSTART:${toIcsStamp(event.startsAt)}`,
    `DTEND:${toIcsStamp(event.endsAt)}`,
    fold(`SUMMARY:${escapeIcsText(event.title)}`),
    fold(`DESCRIPTION:${escapeIcsText(event.description)}`),
    fold(`LOCATION:${escapeIcsText(event.location)}`),
    fold(`URL:${event.url}`),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

/** A plain link that opens Google Calendar's "add event" form, pre-filled. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toIcsStamp(event.startsAt)}/${toIcsStamp(event.endsAt)}`,
    details: `${event.description}\n\n${event.url}`,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Directions link — no Maps API key needed, works on iOS and Android. */
export function directionsUrl(location: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
}
