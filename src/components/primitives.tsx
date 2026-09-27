import type { ReactNode } from "react";
import { LeafMark } from "./Logo";

/**
 * Layout primitives for the wireframe stage.
 *
 * These exist so the design pass has obvious seams to work on — changing
 * rhythm, measure or section treatment happens here, not in every page.
 * Brief §21.10: reusable components without turning four pages into a
 * design-system project.
 */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  heading,
  id,
  tone = "default",
  ornament = false,
}: {
  children: ReactNode;
  heading?: string;
  id?: string;
  tone?: "default" | "sunken";
  /** Marks the heading with the leaf, echoing the book's chapter openers. */
  ornament?: boolean;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-t border-[var(--color-line)] py-12 sm:py-16 ${
        tone === "sunken" ? "bg-[var(--color-surface-sunken)]" : ""
      }`}
    >
      <Container>
        {heading ? (
          <h2
            id={headingId}
            className="mb-6 flex items-center gap-3 text-2xl sm:text-3xl"
          >
            {/*
              The REAL leaf from the book, not the simplified silhouette. The
              shape is the book's central metaphor, so it has to be the same
              one the header uses; only the colour changes. The simplified
              variant exists for the 16px favicon and nothing else.
            */}
            {ornament ? (
              <LeafMark className="h-8 w-auto shrink-0 text-[var(--color-accent)]" />
            ) : null}
            {heading}
          </h2>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

/** Constrains body text to a readable measure (brief §6). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[var(--measure)] space-y-4 text-[var(--color-ink-muted)]">
      {children}
    </div>
  );
}

export function ExternalAnchor({
  href,
  children,
  description,
  underline = true,
}: {
  href: string;
  children: ReactNode;
  description?: string;
  /** Icon-only links should not carry a text underline. */
  underline?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      // noopener/noreferrer: never let an external page reach back into ours.
      rel="noopener noreferrer"
      className={`inline-flex min-h-6 items-center ${
        underline ? "underline underline-offset-4 hover:no-underline" : "hover:opacity-70"
      }`}
    >
      {children}
      {description ? <span className="sr-only"> ({description})</span> : null}
    </a>
  );
}
