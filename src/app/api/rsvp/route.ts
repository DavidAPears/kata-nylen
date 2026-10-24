import { rsvpSchema, toFieldErrors } from "@/lib/validation";
import { saveRsvp, toRecord } from "@/lib/rsvp-store";
import { sendEmail, notificationRecipient } from "@/lib/email";
import {
  attendeeConfirmation,
  attendeeWaitlist,
  organiserNotification,
} from "@/lib/messages/rsvp";
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

  /*
    The guest list filled up, so this person is on the waiting list.

    Deliberately still a success: they did everything right, they are
    recorded, and the form is identical to the one that was taking bookings
    yesterday. The difference is carried by what they are told, on screen and
    in the email, not by an error.
  */
  const waitlisted = result.status === "waitlisted";

  // Only reachable from a store that refuses outright. The Sheets adapter no
  // longer does: over capacity now means the waiting list.
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
      const message = waitlisted
        ? attendeeWaitlist(record, locale)
        : attendeeConfirmation(record, locale);
      // Replies go to Kata, not into the void. The domain has a null MX
      // record, so nothing accepts mail at hej@katanylen.com -- a guest
      // asking "can I bring someone?" would hard-bounce and she would never
      // know they had asked. That matters more on the waiting list, where
      // people reply to ask where they stand.
      await sendEmail({
        to: record.email,
        replyTo: notificationRecipient() ?? undefined,
        ...message,
      });
    })(),
    (async () => {
      const to = notificationRecipient();
      if (!to || result.status === "duplicate") return;
      const message = organiserNotification(
        record,
        result.status === "error",
        waitlisted,
      );
      await sendEmail({ to, replyTo: record.email, ...message });
    })(),
  ]);

  return Response.json({
    ok: true,
    duplicate: result.status === "duplicate",
    waitlisted,
  });
}
