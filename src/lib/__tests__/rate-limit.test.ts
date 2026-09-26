import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit, resetRateLimits, clientKey } from "../rate-limit";

describe("rateLimit", () => {
  beforeEach(() => resetRateLimits());
  afterEach(() => vi.useRealTimers());

  it("allows requests up to the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit("a", { limit: 5 }).allowed).toBe(true);
    }
  });

  it("blocks the request after the limit is exceeded", () => {
    for (let i = 0; i < 5; i++) rateLimit("a", { limit: 5 });
    const result = rateLimit("a", { limit: 5 });
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps separate buckets per key", () => {
    for (let i = 0; i < 5; i++) rateLimit("a", { limit: 5 });
    expect(rateLimit("a", { limit: 5 }).allowed).toBe(false);
    expect(rateLimit("b", { limit: 5 }).allowed).toBe(true);
  });

  it("lets the caller through again once the window has passed", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i++) rateLimit("a", { limit: 5, windowMs: 1000 });
    expect(rateLimit("a", { limit: 5, windowMs: 1000 }).allowed).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(rateLimit("a", { limit: 5, windowMs: 1000 }).allowed).toBe(true);
  });
});

describe("clientKey", () => {
  it("uses the first address in x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.1, 70.41.3.18" });
    expect(clientKey(headers, "rsvp")).toBe("rsvp:203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "203.0.113.9" });
    expect(clientKey(headers, "contact")).toBe("contact:203.0.113.9");
  });

  it("degrades to a shared 'unknown' bucket with no proxy headers", () => {
    expect(clientKey(new Headers(), "rsvp")).toBe("rsvp:unknown");
  });

  it("scopes the two forms separately so one cannot exhaust the other", () => {
    const headers = new Headers({ "x-real-ip": "203.0.113.9" });
    expect(clientKey(headers, "rsvp")).not.toBe(clientKey(headers, "contact"));
  });
});
