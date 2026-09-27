import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * The route that serves the .ics file. The builder in lib/ics is tested
 * separately; this covers the HTTP behaviour around it, including the rule
 * that it must refuse to emit anything while the event is unconfirmed.
 */

const confirmed = {
  TODO: "__TODO__",
  isResolved: (v: unknown) => v !== "__TODO__",
  resolved: (v: unknown) => (v === "__TODO__" ? undefined : v),
  launchEventNameFor: () => "Resilienssalong",
  launchEvent: {
    name: { sv: "Resilienssalong", en: "Resilienssalong" },
    startsAt: "2026-11-11T17:00:00+01:00",
    endsAt: "__TODO__",
    timeZone: "Europe/Stockholm",
    venueName: "Djupet",
    addressLine: "Björngårdsgatan 1A",
    postalCode: "__TODO__",
    city: "Stockholm",
    country: "SE",
  },
  book: { title: "Psykologisk resiliens" },
  site: { url: "https://katanylen.com", domain: "katanylen.com" },
};

afterEach(() => vi.resetModules());

function request(url: string) {
  return new Request(url);
}

describe("GET /api/calendar", () => {
  it("serves a calendar file once the event is confirmed", async () => {
    vi.doMock("@/content/facts", () => confirmed);
    const { GET } = await import("../calendar/route");

    const response = await GET(request("https://katanylen.com/api/calendar?locale=sv"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/calendar");
    // Named so the download is recognisable in a downloads folder.
    expect(response.headers.get("Content-Disposition")).toContain(".ics");

    const body = await response.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("SUMMARY:Resilienssalong");
  });

  it("falls back to the default locale for an unknown one", async () => {
    vi.doMock("@/content/facts", () => confirmed);
    const { GET } = await import("../calendar/route");
    const response = await GET(request("https://katanylen.com/api/calendar?locale=de"));
    expect(response.status).toBe(200);
  });

  it("refuses to emit anything while the event is unconfirmed", async () => {
    vi.doMock("@/content/facts", () => ({
      ...confirmed,
      launchEvent: { ...confirmed.launchEvent, startsAt: "__TODO__" },
    }));
    const { GET } = await import("../calendar/route");

    // Brief §21.3: never publish an invented date, not even in a file a guest
    // saves into their own calendar.
    const response = await GET(request("https://katanylen.com/api/calendar"));
    expect(response.status).toBe(404);
  });
});
