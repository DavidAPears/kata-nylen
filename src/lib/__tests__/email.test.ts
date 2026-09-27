import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * Email must never throw into a request. A failed confirmation should cost a
 * guest a nice email, not their place at the launch, so this module reports
 * failure rather than raising it.
 */

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const original = { ...process.env };
beforeEach(() => {
  process.env = { ...original };
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.CONTACT_TO_EMAIL;
  send.mockReset();
  vi.resetModules();
});
afterEach(() => {
  process.env = { ...original };
});

const message = { to: "guest@example.com", subject: "Hello", text: "Body" };

describe("sendEmail", () => {
  it("skips, without throwing, when nothing is configured", async () => {
    const { sendEmail } = await import("../email");
    const result = await sendEmail(message);

    // Local dev and CI have no credentials; the whole flow still has to work.
    expect(result).toMatchObject({ sent: false, skipped: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("skips when a key exists but no sender does", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const { sendEmail } = await import("../email");
    expect(await sendEmail(message)).toMatchObject({ skipped: true });
  });

  it("sends once fully configured", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_FROM_EMAIL = "Kata <hej@example.com>";
    send.mockResolvedValue({ error: null });

    const { sendEmail } = await import("../email");
    expect(await sendEmail({ ...message, replyTo: "org@example.com" })).toEqual({ sent: true });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Kata <hej@example.com>",
        to: "guest@example.com",
        replyTo: "org@example.com",
      }),
    );
  });

  it("reports a provider error instead of throwing", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_FROM_EMAIL = "Kata <hej@example.com>";
    send.mockResolvedValue({ error: { name: "validation_error", message: "bad recipient" } });

    const { sendEmail } = await import("../email");
    const result = await sendEmail(message);
    expect(result.sent).toBe(false);
    expect(result.error).toBe("bad recipient");
  });

  it("reports a thrown error instead of letting it escape", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_FROM_EMAIL = "Kata <hej@example.com>";
    send.mockRejectedValue(new Error("network down"));

    const { sendEmail } = await import("../email");
    // A dropped connection must not become a 500 on a valid RSVP.
    await expect(sendEmail(message)).resolves.toMatchObject({ sent: false });
  });

  it("never writes the recipient address to the log", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendEmail } = await import("../email");
    await sendEmail(message);

    const logged = info.mock.calls.flat().join(" ");
    // Brief §16: collect and expose the minimum.
    expect(logged).not.toContain("guest@example.com");
    info.mockRestore();
  });
});

describe("isEmailConfigured / notificationRecipient", () => {
  it("reports configuration state honestly", async () => {
    const { isEmailConfigured } = await import("../email");
    expect(isEmailConfigured()).toBe(false);
  });

  it("returns null when no organiser address is set", async () => {
    const { notificationRecipient } = await import("../email");
    expect(notificationRecipient()).toBeNull();
  });

  it("returns the organiser address when set", async () => {
    process.env.CONTACT_TO_EMAIL = "kata@example.com";
    const { notificationRecipient } = await import("../email");
    expect(notificationRecipient()).toBe("kata@example.com");
  });
});
