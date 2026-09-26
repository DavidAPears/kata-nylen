import { contactSchema, toFieldErrors } from "@/lib/validation";
import { sendEmail, notificationRecipient } from "@/lib/email";
import { contactNotification } from "@/lib/messages/rsvp";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, "contact"), {
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: "rateLimited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "server" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, fieldErrors: toFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  if (parsed.data.website) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const to = notificationRecipient();
  if (!to) {
    // No recipient configured — surface it as a server error rather than
    // silently swallowing someone's enquiry.
    console.error("[contact] CONTACT_TO_EMAIL is not configured");
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  const message = contactNotification(parsed.data);
  const result = await sendEmail({ to, replyTo: parsed.data.email, ...message });

  if (!result.sent && !result.skipped) {
    return Response.json({ ok: false, error: "server" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
