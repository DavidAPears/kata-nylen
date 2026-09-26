import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../rsvp/route";
import { resetRateLimits } from "@/lib/rate-limit";
import { setRsvpStore, resetRsvpStore, type RsvpRecord } from "@/lib/rsvp-store";
import { sendEmail } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(async () => ({ sent: true })),
  notificationRecipient: vi.fn(() => "organiser@example.com"),
}));

const sendEmailMock = vi.mocked(sendEmail);

/** Each test gets its own IP so the rate limiter doesn't bleed between them. */
let ipCounter = 0;
function post(body: unknown, ip?: string) {
  ipCounter += 1;
  return POST(
    new Request("https://katanylen.com/api/rsvp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip ?? `203.0.113.${ipCounter}`,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const valid = { name: "Guest", email: "guest@example.com", locale: "en" };

describe("POST /api/rsvp", () => {
  beforeEach(() => {
    resetRateLimits();
    resetRsvpStore();
    sendEmailMock.mockClear();
    sendEmailMock.mockResolvedValue({ sent: true });
  });

  it("accepts a valid RSVP", async () => {
    const response = await post(valid);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it("stores the submission via the configured store", async () => {
    const saved: RsvpRecord[] = [];
    setRsvpStore({
      name: "test",
      durable: true,
      async save(record) {
        saved.push(record);
        return { status: "saved" };
      },
    });

    await post({ ...valid, guests: 2, marketingConsent: true });

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      name: "Guest",
      email: "guest@example.com",
      guests: 2,
      marketingConsent: true,
      dedupeKey: "guest@example.com",
    });
  });

  it("lower-cases the email into the dedupe key", async () => {
    const saved: RsvpRecord[] = [];
    setRsvpStore({
      name: "test",
      durable: true,
      async save(r) {
        saved.push(r);
        return { status: "saved" };
      },
    });
    await post({ ...valid, email: "Guest@Example.COM" });
    expect(saved[0].dedupeKey).toBe("guest@example.com");
  });

  it("sends a confirmation to the attendee and a notification to the organiser", async () => {
    await post(valid);
    const recipients = sendEmailMock.mock.calls.map(([message]) => message.to);
    expect(recipients).toContain("guest@example.com");
    expect(recipients).toContain("organiser@example.com");
  });

  it("writes the confirmation in the requested language", async () => {
    await post({ ...valid, locale: "sv" });
    const attendee = sendEmailMock.mock.calls.find(
      ([message]) => message.to === "guest@example.com",
    );
    expect(attendee?.[0].subject).toContain("Din plats");
  });

  it("falls back to the default language for an unknown locale", async () => {
    await post({ ...valid, locale: "de" });
    const attendee = sendEmailMock.mock.calls.find(
      ([m]) => m.to === "guest@example.com",
    );
    // Default locale is Swedish.
    expect(attendee?.[0].subject).toContain("Din plats");
  });

  it("returns 422 with field error codes for invalid input", async () => {
    const response = await post({ name: "", email: "nope" });
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      fieldErrors: { name: "nameRequired", email: "emailInvalid" },
    });
  });

  it("silently discards a submission that trips the honeypot", async () => {
    const saved: RsvpRecord[] = [];
    setRsvpStore({
      name: "test",
      durable: true,
      async save(r) {
        saved.push(r);
        return { status: "saved" };
      },
    });

    const response = await post({ ...valid, website: "http://spam.example" });

    // Looks like success to the bot...
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
    // ...but nothing was stored or emailed.
    expect(saved).toHaveLength(0);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("rate limits after 5 submissions from the same address", async () => {
    const ip = "198.51.100.7";
    for (let i = 0; i < 5; i++) {
      expect((await post(valid, ip)).status).toBe(200);
    }
    const blocked = await post(valid, ip);
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    await expect(blocked.json()).resolves.toMatchObject({ error: "rateLimited" });
  });

  it("rejects malformed JSON with 400", async () => {
    const response = await post("{not json");
    expect(response.status).toBe(400);
  });

  it("returns 409 when the event is full", async () => {
    setRsvpStore({ name: "full", durable: true, async save() { return { status: "full" }; } });
    const response = await post(valid);
    expect(response.status).toBe(409);
  });

  it("still confirms a duplicate RSVP, without re-notifying the organiser", async () => {
    setRsvpStore({
      name: "dupe",
      durable: true,
      async save() {
        return { status: "duplicate" };
      },
    });

    const response = await post(valid);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, duplicate: true });

    const recipients = sendEmailMock.mock.calls.map(([m]) => m.to);
    expect(recipients).toContain("guest@example.com");
    expect(recipients).not.toContain("organiser@example.com");
  });

  it("does not lose an RSVP when the confirmation email fails", async () => {
    // Email is best-effort. A mail outage must not cost someone their place.
    sendEmailMock.mockResolvedValue({ sent: false, error: "smtp down" });
    const saved: RsvpRecord[] = [];
    setRsvpStore({
      name: "test",
      durable: true,
      async save(r) {
        saved.push(r);
        return { status: "saved" };
      },
    });

    const response = await post(valid);
    expect(response.status).toBe(200);
    expect(saved).toHaveLength(1);
  });
});
