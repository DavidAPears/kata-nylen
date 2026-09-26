import { outstandingFacts } from "@/content/facts";

/**
 * Development-only marker for content that Kata has not supplied yet
 * (brief §21.4 — use placeholders, never invent).
 *
 * Renders NOTHING in production. That is the important part: an unconfirmed
 * fact can never reach a real visitor looking like real content.
 */
export function TodoNote({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p className="my-2 border border-dashed border-neutral-400 bg-neutral-100 px-3 py-2 text-sm text-neutral-700">
      <strong className="font-semibold">TODO: </strong>
      {children}
    </p>
  );
}

/** Dev-only summary of everything still outstanding, shown in the footer. */
export function OutstandingContent() {
  if (process.env.NODE_ENV === "production") return null;
  const missing = outstandingFacts();
  if (missing.length === 0) return null;

  return (
    <details className="mt-8 border border-dashed border-neutral-400 bg-neutral-100 p-4 text-sm">
      <summary className="cursor-pointer font-semibold">
        {missing.length} unconfirmed facts (dev only)
      </summary>
      <ul className="mt-2 list-disc pl-5 text-neutral-700">
        {missing.map((item) => (
          <li key={item}>
            <code>{item}</code>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-neutral-600">
        Fill these in <code>src/content/facts.ts</code>. Brief §23 lists what to
        ask Kata for.
      </p>
    </details>
  );
}
