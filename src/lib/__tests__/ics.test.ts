import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * The calendar helpers read from `facts.ts`, where everything is still TODO.
 * Each test therefore mocks the facts module with confirmed values — which
 * doubles as a check that the "not confirmed yet" path really does refuse to
 * emit anything.
 */

const confirmedFacts = {
  TODO: "__TODO__",
  isResolved: (v: unknown) => v !== "__TODO__",
  launchEvent: {
    startsAt: "2026-04-16T18:00:00+02:00",
    endsAt: "2026-04-16T21:00:00+02:00",
    timeZone: "Europe/Stockholm",
    venueName: "Example Venue",
    addressLine: "Exempelgatan 1",
    postalCode: "111 22",
    city: "Stockholm",
    country: "SE",
  },
  book: { title: "Example Title" },
  site: { url: "https://katanylen.com", domain: "katanylen.com" },
};

afterEach(() => vi.resetModules());

describe("with confirmed event details", () => {
  async function load() {
    vi.doMock("@/content/facts", () => confirmedFacts);
    return import("../ics");
  }

  it("builds a calendar event", async () => {
    const { getCalendarEvent } = await load();
    const event = getCalendarEvent("en");
    expect(event).not.toBeNull();
    expect(event!.title).toBe("Book release: Example Title");
    expect(event!.location).toBe("Example Venue, Exempelgatan 1, 111 22, Stockholm");
  });

  it("titles the event in Swedish for the sv locale", async () => {
    const { getCalendarEvent } = await load();
    expect(getCalendarEvent("sv")!.title).toBe("Bokrelease: Example Title");
  });

  it("emits a valid VCALENDAR wrapper with CRLF line endings", async () => {
    const { getCalendarEvent, buildIcs } = await load();
    const ics = buildIcs(getCalendarEvent("en")!);

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });

  it("converts the local start time to UTC", async () => {
    const { getCalendarEvent, buildIcs } = await load();
    // 18:00 +02:00 is 16:00 UTC.
    expect(buildIcs(getCalendarEvent("en")!)).toContain("DTSTART:20260416T160000Z");
  });

  it("escapes commas in the location, as RFC 5545 requires", async () => {
    const { getCalendarEvent, buildIcs } = await load();
    expect(buildIcs(getCalendarEvent("en")!)).toContain(
      "LOCATION:Example Venue\\, Exempelgatan 1\\, 111 22\\, Stockholm",
    );
  });

  it("builds a Google Calendar link with a UTC date range", async () => {
    const { getCalendarEvent, googleCalendarUrl } = await load();
    const url = new URL(googleCalendarUrl(getCalendarEvent("en")!));

    expect(url.origin + url.pathname).toBe(
      "https://calendar.google.com/calendar/render",
    );
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("dates")).toBe("20260416T160000Z/20260416T190000Z");
  });

  it("builds a directions link without needing a Maps API key", async () => {
    const { directionsUrl } = await load();
    const url = new URL(directionsUrl("Example Venue, Stockholm"));
    expect(url.searchParams.get("destination")).toBe("Example Venue, Stockholm");
    expect(url.search).not.toContain("key=");
  });
});

describe("with unconfirmed event details", () => {
  it("refuses to produce a calendar event", async () => {
    vi.doMock("@/content/facts", () => ({
      ...confirmedFacts,
      launchEvent: { ...confirmedFacts.launchEvent, startsAt: "__TODO__" },
    }));
    const { getCalendarEvent } = await import("../ics");
    // Brief §21.3 — never invent event details, not even in a calendar file.
    expect(getCalendarEvent("en")).toBeNull();
  });

  it("refuses when the venue is unconfirmed", async () => {
    vi.doMock("@/content/facts", () => ({
      ...confirmedFacts,
      launchEvent: { ...confirmedFacts.launchEvent, venueName: "__TODO__" },
    }));
    const { getCalendarEvent } = await import("../ics");
    expect(getCalendarEvent("sv")).toBeNull();
  });
});
