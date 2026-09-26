import { Resend } from "resend";

/**
 * Transactional email via Resend.
 *
 * Degrades safely: with no API key configured (local dev, CI, tests) it logs
 * what it *would* have sent and reports success, so the whole form flow is
 * exercisable without credentials. It never throws into the request path — a
 * failed confirmation email must not lose an RSVP that was otherwise valid.
 */

export type SendResult = { sent: boolean; skipped?: boolean; error?: string };

type Message = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

let client: Resend | null = null;

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
}

export async function sendEmail(message: Message): Promise<SendResult> {
  const resend = getClient();
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!resend || !from) {
    console.info(
      `[email:skipped] to=<redacted> subject="${message.subject}" (no RESEND_API_KEY/CONTACT_FROM_EMAIL configured)`,
    );
    return { sent: false, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error) {
      console.error(`[email:failed] ${error.name}: ${error.message}`);
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (cause) {
    console.error("[email:threw]", cause);
    return { sent: false, error: "send_failed" };
  }
}

/** Where organiser notifications go. */
export function notificationRecipient(): string | null {
  return process.env.CONTACT_TO_EMAIL ?? null;
}
