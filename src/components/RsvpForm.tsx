"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { FormsContent, BookReleaseContent } from "@/content/types";
import { Field, inputClass, Honeypot, ErrorSummary } from "./form-fields";
import { useFormSubmit } from "./useFormSubmit";

/**
 * RSVP form. Brief §10: low friction, minimum data, explicit and separate
 * marketing consent that is never pre-checked.
 *
 * Fields are deliberately few — name, email, and guests only when +1s are
 * actually permitted. We do not ask for anything we have no use for (§16).
 */
export function RsvpForm({
  locale,
  forms,
  labels,
  guestsAllowed,
  maxGuests,
  calendar,
}: {
  locale: Locale;
  forms: FormsContent;
  labels: BookReleaseContent["rsvp"];
  guestsAllowed: boolean;
  maxGuests: number;
  calendar: { icsHref: string; googleHref: string } | null;
}) {
  const { state, fieldErrors, formError, submit, isSubmitting, isSuccess } =
    useFormSubmit("/api/rsvp", forms);
  const [marketingConsent, setMarketingConsent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({
      locale,
      name: data.get("name"),
      email: data.get("email"),
      guests: guestsAllowed ? Number(data.get("guests") ?? 1) : 1,
      marketingConsent,
      website: data.get("website") ?? "",
    });
  }

  if (isSuccess) {
    return (
      <div role="status" className="border border-[var(--color-line)] p-6">
        <h3 className="text-xl">✓ {forms.success.rsvpHeading}</h3>
        <p className="mt-2 text-[var(--color-ink-muted)]">
          {forms.success.rsvpBody}
        </p>
        {calendar ? (
          <div className="mt-6">
            <h4 className="font-medium">{labels.addToCalendarLabel}</h4>
            <div className="mt-2 flex flex-wrap gap-4">
              <a href={calendar.icsHref} className="underline underline-offset-4">
                {labels.downloadIcsLabel}
              </a>
              <a
                href={calendar.googleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {labels.googleCalendarLabel}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const summaryErrors = [
    ...Object.values(fieldErrors),
    ...(formError ? [formError] : []),
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <ErrorSummary title={forms.errors.summary} errors={summaryErrors} />

      <Field
        id="name"
        label={forms.fields.name}
        error={fieldErrors.name}
        required
      >
        {(props) => (
          <input
            {...props}
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass}
          />
        )}
      </Field>

      <Field
        id="email"
        label={forms.fields.email}
        error={fieldErrors.email}
        required
      >
        {(props) => (
          <input
            {...props}
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
          />
        )}
      </Field>

      {guestsAllowed ? (
        <Field id="guests" label={forms.fields.guests} error={fieldErrors.guests}>
          {(props) => (
            <input
              {...props}
              name="guests"
              type="number"
              min={1}
              max={maxGuests}
              defaultValue={1}
              className={`${inputClass} max-w-24`}
            />
          )}
        </Field>
      ) : null}

      {/* Brief §10: separate, explicit, never pre-checked. */}
      {/* The default 13px checkbox is below the 24px minimum touch target
          (WCAG 2.5.8) — and this is the control that records consent, so it
          has to be easy to hit deliberately and easy to leave alone. The label
          is part of the target, since clicking it toggles the box. */}
      <div className="mb-5 flex items-start gap-3">
        <input
          id="marketingConsent"
          name="marketingConsent"
          type="checkbox"
          checked={marketingConsent}
          onChange={(event) => setMarketingConsent(event.target.checked)}
          className="mt-0.5 size-5 shrink-0"
        />
        <label
          htmlFor="marketingConsent"
          className="flex min-h-6 items-center text-sm"
        >
          {forms.fields.marketingConsent}
        </label>
      </div>

      <Honeypot label={forms.honeypot} />

      <p className="mb-5 max-w-[var(--measure)] text-sm text-[var(--color-ink-muted)]">
        {forms.privacyNotice.rsvp}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-[var(--color-ink)] px-5 py-2.5 font-medium disabled:opacity-60"
      >
        {isSubmitting ? forms.submit.pending : forms.submit.rsvp}
      </button>

      {/* Politely announce state changes to assistive tech. */}
      <span aria-live="polite" className="sr-only">
        {state === "submitting" ? forms.submit.pending : ""}
      </span>
    </form>
  );
}
