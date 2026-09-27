import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

/**
 * The venue map route exists to keep the Maps key server-side. These tests
 * exist mainly to prove that: if the key ever reached the response, it would
 * be published to every visitor.
 */

const facts = {
  TODO: "__TODO__",
  isResolved: (v: unknown) => v !== "__TODO__",
  resolved: (v: unknown) => (v === "__TODO__" ? undefined : v),
  launchEvent: {
    venueName: "Djupet",
    addressLine: "Björngårdsgatan 1A",
    postalCode: "__TODO__",
    city: "Stockholm",
  },
};

const original = { ...process.env };
beforeEach(() => {
  process.env = { ...original };
  delete process.env.GOOGLE_MAPS_API_KEY;
});
afterEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  process.env = { ...original };
});

describe("GET /api/venue-map", () => {
  it("404s when no key is configured, so the page falls back to directions", async () => {
    vi.doMock("@/content/facts", () => facts);
    const { GET } = await import("../venue-map/route");
    expect((await GET()).status).toBe(404);
  });

  it("404s when the venue is unconfirmed, even with a key", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    vi.doMock("@/content/facts", () => ({
      ...facts,
      launchEvent: { ...facts.launchEvent, venueName: "__TODO__" },
    }));
    const { GET } = await import("../venue-map/route");
    expect((await GET()).status).toBe(404);
  });

  it("never lets the key reach the response", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "super-secret-key";
    vi.doMock("@/content/facts", () => facts);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response("PNGDATA", { status: 200, headers: { "content-type": "image/png" } }),
      ),
    );
    const { GET } = await import("../venue-map/route");

    const response = await GET();
    expect(response.status).toBe(200);

    // The key must appear in the OUTBOUND request and nowhere else.
    const body = await response.text();
    expect(body).not.toContain("super-secret-key");
    for (const [, value] of response.headers.entries()) {
      expect(value).not.toContain("super-secret-key");
    }
  });

  it("asks Google for the venue address and marks it", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    vi.doMock("@/content/facts", () => facts);
    // Typed as the real fetch so mock.calls carries its argument types.
    const fetchMock = vi.fn((async () =>
      new Response("PNGDATA", { status: 200, headers: { "content-type": "image/png" } })
    ) as unknown as typeof fetch);
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await import("../venue-map/route");
    await GET();

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.host).toBe("maps.googleapis.com");
    expect(url.searchParams.get("center")).toContain("Björngårdsgatan 1A");
    expect(url.searchParams.get("markers")).toContain("Björngårdsgatan 1A");
    expect(url.searchParams.get("key")).toBe("test-key");
  });

  it("caches hard, since the venue does not move", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    vi.doMock("@/content/facts", () => facts);
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response("PNGDATA", { status: 200, headers: { "content-type": "image/png" } }),
    ));
    const { GET } = await import("../venue-map/route");

    const cacheControl = (await GET()).headers.get("Cache-Control") ?? "";
    expect(cacheControl).toContain("max-age=");
    expect(cacheControl).toContain("s-maxage=");
  });

  it("returns 502 rather than a broken image when Google fails", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    vi.doMock("@/content/facts", () => facts);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 403 })));
    const { GET } = await import("../venue-map/route");

    expect((await GET()).status).toBe(502);
  });
});
