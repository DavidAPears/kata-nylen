"use client";

import type { ReactNode } from "react";

/**
 * Accessible field primitives.
 *
 * Every field gets: a real <label> bound by id, `aria-describedby` pointing at
 * its error, and `aria-invalid` when it fails. Brief §15 asks for form labels
 * and useful error messages; this is where that is guaranteed rather than
 * remembered per form.
 */

export function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (props: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    required: boolean | undefined;
  }) => ReactNode;
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-1 block font-medium">
        {label}
        {hint ? (
          <span className="ml-2 font-normal text-[var(--color-ink-muted)]">
            ({hint})
          </span>
        ) : null}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
        required: required || undefined,
      })}
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full border border-[var(--color-line)] bg-white px-3 py-2 " +
  "aria-[invalid=true]:border-red-700";

/**
 * Honeypot. Hidden from sighted users and from screen readers (aria-hidden +
 * tabIndex -1), but present in the DOM for bots to fill. If it arrives
 * non-empty the server silently discards the submission.
 */
export function Honeypot({ label }: { label: string }) {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="website">{label}</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

/** Announced error summary shown above a failed form. */
export function ErrorSummary({
  title,
  errors,
}: {
  title: string;
  errors: string[];
}) {
  if (errors.length === 0) return null;
  return (
    <div
      role="alert"
      tabIndex={-1}
      className="mb-6 border border-red-700 bg-red-50 p-4"
    >
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
