import { z } from "zod";

/**
 * Validation schemas shared by the client form and the server route.
 *
 * Error messages are *codes*, not human text — the UI maps each code onto
 * `forms.errors.<code>` in the active language. That keeps validation logic
 * monolingual and the messages bilingual.
 */

const MAX_SHORT = 200;
const MAX_MESSAGE = 4000;

const name = z
  .string()
  .trim()
  .min(1, { message: "nameRequired" })
  .max(MAX_SHORT, { message: "tooLong" });

const email = z
  .string()
  .trim()
  .min(1, { message: "emailRequired" })
  .max(MAX_SHORT, { message: "tooLong" })
  .pipe(z.email({ message: "emailInvalid" }));

/**
 * Honeypot: a field hidden from humans. Bots fill every input they find, so a
 * non-empty value here means "not a human". Cheap, keyless, and no third-party
 * script — which also keeps us clear of the cookie-consent question (§16).
 *
 * Note this schema ACCEPTS a filled honeypot. It must: if validation rejected
 * it, the bot would get a 422 naming `website` and learn exactly which field
 * is the trap. Instead the value passes through and the route returns a fake
 * success while discarding the submission.
 */
const honeypot = z.string().max(MAX_SHORT).optional().default("");

export const rsvpSchema = z.object({
  name,
  email,
  guests: z.coerce
    .number()
    .int({ message: "guestsRange" })
    .min(1, { message: "guestsRange" })
    .max(10, { message: "guestsRange" })
    .default(1),
  marketingConsent: z.boolean().default(false),
  website: honeypot,
});

export const contactSchema = z.object({
  name,
  email,
  organisation: z.string().trim().max(MAX_SHORT, { message: "tooLong" }).optional().default(""),
  reason: z.enum(["speaking", "media", "collaboration", "general"], {
    message: "reasonRequired",
  }),
  message: z
    .string()
    .trim()
    .min(1, { message: "messageRequired" })
    .max(MAX_MESSAGE, { message: "tooLong" }),
  website: honeypot,
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/** Field name → error code, for rendering inline messages. */
export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
