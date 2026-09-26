"use client";

import { useState } from "react";
import type { FormsContent } from "@/content/types";

type State = "idle" | "submitting" | "success" | "error";

/**
 * Shared submit behaviour for both forms.
 *
 * Maps server-returned error *codes* onto localised strings, so the API stays
 * language-agnostic and the UI stays translated.
 */
export function useFormSubmit(endpoint: string, forms: FormsContent) {
  const [state, setState] = useState<State>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const errorText = (code: string): string =>
    forms.errors[code as keyof typeof forms.errors] as string | undefined ??
    forms.errors.server;

  async function submit(payload: Record<string, unknown>): Promise<boolean> {
    setState("submitting");
    setFieldErrors({});
    setFormError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (response.ok && data.ok) {
        setState("success");
        return true;
      }

      if (data.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const [field, code] of Object.entries(data.fieldErrors)) {
          mapped[field] = errorText(code);
        }
        setFieldErrors(mapped);
      } else {
        setFormError(errorText(data.error ?? "server"));
      }

      setState("error");
      return false;
    } catch {
      setFormError(forms.errors.server);
      setState("error");
      return false;
    }
  }

  return {
    state,
    fieldErrors,
    formError,
    submit,
    isSubmitting: state === "submitting",
    isSuccess: state === "success",
  };
}
