import { rsvpSchema, toFieldErrors } from "@/lib/validation";
import { saveRsvp, toRecord } from "@/lib/rsvp-store";
import { sendEmail, notificationRecipient } from "@/lib/email";
import { attendeeConfirmation, organiserNotification } from "@/lib/messages/rsvp";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { locales, defaultLocale, type Locale } from "@/i18n/routing";

export const runtime = "nodejs";

function parseLocale(value: unknown): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, "rsvp"), {
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

  const payload = body as Record<string, unknown>;
  const locale = parseLocale(payload?.locale);
  const parsed = rsvpSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { ok: false, fieldErrors: toFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  // Honeypot tripped: respond exactly like success so a bot learns nothing,
  // but record nothing and send nothing.
  if (parsed.data.website) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const record = toRecord(parsed.data);
  const result = await saveRsvp(record);

  if (result.status === "full") {
    return Response.json({ ok: false, error: "full" }, { status: 409 });
  }

  // A duplicate is not an error for the person submitting — they are already
  // on the list, which is exactly what they wanted. Re-send the confirmation.
  //
  // When the store failed we still notify the organiser: that email is the
  // only remaining record of the submission, so it must not be skipped.
  await Promise.all([
    (async () => {
      const message = attendeeConfirmation(record, locale);
      await sendEmail({ to: record.email, ...message });
    })(),
    (async () => {
      const to = notificationRecipient();
      if (!to || result.status === "duplicate") return;
      const message = organiserNotification(record, result.status === "error");
      await sendEmail({ to, replyTo: record.email, ...message });
    })(),
  ]);

  return Response.json({ ok: true, duplicate: result.status === "duplicate" });
}
