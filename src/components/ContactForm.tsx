"use client";

import type { FormsContent, ContactContent } from "@/content/types";
import { Field, inputClass, Honeypot, ErrorSummary } from "./form-fields";
import { useFormSubmit } from "./useFormSubmit";

/** Brief §12: keep it simple — name, organisation, email, reason, message. */
export function ContactForm({
  forms,
  reasons,
  defaultReason,
}: {
  forms: FormsContent;
  reasons: ContactContent["reasons"];
  defaultReason?: string;
}) {
  const { fieldErrors, formError, submit, isSubmitting, isSuccess } =
    useFormSubmit("/api/contact", forms);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({
      name: data.get("name"),
      email: data.get("email"),
      organisation: data.get("organisation") ?? "",
      reason: data.get("reason"),
      message: data.get("message"),
      website: data.get("website") ?? "",
    });
  }

  if (isSuccess) {
    return (
      <div role="status" className="border border-[var(--color-line)] p-6">
        <h3 className="text-xl">{forms.success.contactHeading}</h3>
        <p className="mt-2 text-[var(--color-ink-muted)]">
          {forms.success.contactBody}
        </p>
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

      <Field id="name" label={forms.fields.name} error={fieldErrors.name} required>
        {(props) => (
          <input {...props} name="name" type="text" autoComplete="name" className={inputClass} />
        )}
      </Field>

      <Field
        id="organisation"
        label={forms.fields.organisation}
        hint={forms.optional}
        error={fieldErrors.organisation}
      >
        {(props) => (
          <input
            {...props}
            name="organisation"
            type="text"
            autoComplete="organization"
            className={inputClass}
          />
        )}
      </Field>

      <Field id="email" label={forms.fields.email} error={fieldErrors.email} required>
        {(props) => (
          <input {...props} name="email" type="email" autoComplete="email" className={inputClass} />
        )}
      </Field>

      <Field id="reason" label={forms.fields.reason} error={fieldErrors.reason} required>
        {(props) => (
          <select {...props} name="reason" defaultValue={defaultReason ?? ""} className={inputClass}>
            <option value="" disabled>
              {forms.chooseOption}
            </option>
            {reasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field id="message" label={forms.fields.message} error={fieldErrors.message} required>
        {(props) => (
          <textarea {...props} name="message" rows={6} className={inputClass} />
        )}
      </Field>

      <Honeypot label={forms.honeypot} />

      <p className="mb-5 max-w-[var(--measure)] text-sm text-[var(--color-ink-muted)]">
        {forms.privacyNotice.contact}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-[var(--color-ink)] px-5 py-2.5 font-medium disabled:opacity-60"
      >
        {isSubmitting ? forms.submit.pending : forms.submit.contact}
      </button>
    </form>
  );
}
