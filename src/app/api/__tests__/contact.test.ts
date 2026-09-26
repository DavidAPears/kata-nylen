import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../contact/route";
import { resetRateLimits } from "@/lib/rate-limit";
import { sendEmail, notificationRecipient } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(async () => ({ sent: true })),
  notificationRecipient: vi.fn(() => "kata@example.com"),
}));

const sendEmailMock = vi.mocked(sendEmail);
const recipientMock = vi.mocked(notificationRecipient);

let ipCounter = 0;
function post(body: unknown, ip?: string) {
  ipCounter += 1;
  return POST(
    new Request("https://katanylen.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip ?? `198.51.100.${ipCounter}`,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Organiser",
  email: "org@example.com",
  reason: "speaking",
  message: "Would you speak at our conference in May?",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    resetRateLimits();
    sendEmailMock.mockClear();
    sendEmailMock.mockResolvedValue({ sent: true });
    recipientMock.mockReturnValue("kata@example.com");
  });

  it("accepts a valid enquiry", async () => {
    const response = await post(valid);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it("sets reply-to so replying reaches the sender, not the site", async () => {
    await post(valid);
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "kata@example.com", replyTo: "org@example.com" }),
    );
  });

  it("includes the reason and message in the notification", async () => {
    await post(valid);
    const [message] = sendEmailMock.mock.calls[0];
    expect(message.subject).toContain("speaking");
    expect(message.text).toContain("Would you speak at our conference in May?");
  });

  it("returns 422 with field codes for invalid input", async () => {
    const response = await post({ ...valid, email: "bad", message: "" });
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      fieldErrors: { email: "emailInvalid", message: "messageRequired" },
    });
  });

  it("rejects an unknown enquiry reason", async () => {
    const response = await post({ ...valid, reason: "elsewhere" });
    expect(response.status).toBe(422);
  });

  it("silently discards a honeypot submission without emailing", async () => {
    const response = await post({ ...valid, website: "spam" });
    expect(response.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from one address", async () => {
    const ip = "203.0.113.200";
    for (let i = 0; i < 5; i++) await post(valid, ip);
    const blocked = await post(valid, ip);
    expect(blocked.status).toBe(429);
  });

  it("fails loudly rather than silently dropping an enquiry with no recipient configured", async () => {
    recipientMock.mockReturnValue(null);
    const response = await post(valid);
    expect(response.status).toBe(500);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns 502 when the email provider rejects the send", async () => {
    sendEmailMock.mockResolvedValue({ sent: false, error: "provider down" });
    const response = await post(valid);
    expect(response.status).toBe(502);
  });

  it("treats a skipped send (no API key in dev) as success", async () => {
    sendEmailMock.mockResolvedValue({ sent: false, skipped: true });
    const response = await post(valid);
    expect(response.status).toBe(200);
  });

  it("rejects malformed JSON", async () => {
    expect((await post("{{")).status).toBe(400);
  });
});
