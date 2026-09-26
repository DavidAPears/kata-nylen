/**
 * Flag icons for the language switcher.
 *
 * ⚠️ Flags denote countries, not languages — which is why they are paired here
 * with the "SV" / "EN" text rather than replacing it. The text carries the
 * meaning and is what assistive technology announces; the flag is decorative
 * and adds the at-a-glance recognisability.
 *
 * Both are drawn in the same 20×14 box so they line up in the nav. That means
 * neither is at its official ratio (Sweden is 8:5, the UK 2:1) — a deliberate
 * trade for a tidy row of equal-sized affordances.
 *
 * Inline SVG rather than emoji: flag emoji do not render at all on Windows,
 * which would silently turn the switcher into blank squares for a large slice
 * of visitors.
 */

const BOX = "0 0 20 14";

export function SwedishFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden="true" focusable="false">
      <rect width="20" height="14" rx="1.5" fill="#006AA7" />
      {/* Nordic cross: vertical arm set left of centre. */}
      <path d="M6 0h3v14H6z" fill="#FECC00" />
      <path d="M0 5.5h20v3H0z" fill="#FECC00" />
    </svg>
  );
}

export function BritishFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="uk-flag-clip">
          <rect width="20" height="14" rx="1.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="20" height="14" fill="#012169" />
        {/* Saltire: white first, red laid over it, thinner. */}
        <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="3.2" />
        <path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" strokeWidth="1.5" />
        {/* Cross of St George. */}
        <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.6" />
        <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.6" />
      </g>
    </svg>
  );
}

/** Maps a locale to its flag. Keep in step with `locales` in i18n/routing. */
export const flagFor = {
  sv: SwedishFlag,
  en: BritishFlag,
} as const;
