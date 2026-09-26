import { Link } from "@/i18n/navigation";

/**
 * Leaf mark + wordmark.
 *
 * Redrawn from the leaf on Kata's own book-launch flyer rather than traced —
 * it needs to hold up at 24px in a header, which the flyer's version (sized for
 * a poster) would not.
 *
 * Drawn as inline SVG, not an image file, so that it:
 *   • inherits `currentColor` and works on any background, light or dark
 *   • stays crisp at every size with no @2x assets
 *   • costs no extra network request
 *
 * The veins use a slightly lighter stroke than the outline so the mark reads as
 * a leaf at large sizes but collapses to a clean silhouette at small ones.
 */

export function LeafMark({
  className = "",
  title,
}: {
  className?: string;
  /** Only pass a title when the mark stands alone; inside the logo lockup the
   *  wordmark already names it, and a title here would be read out twice. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* Blade: ovate — pointed at the tip, tapering back to a point at the
          base, widest just below centre. */}
      <path
        d="M50 6c18 20 36 40 36 56 0 18-16 32-36 34-20-2-36-16-36-34 0-16 18-36 36-56Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M50 6c18 20 36 40 36 56 0 18-16 32-36 34-20-2-36-16-36-34 0-16 18-36 36-56Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Midrib, continuing past the blade as a short stem. */}
      <path
        d="M50 14v94"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Side veins. Angled up towards the tip, as real venation runs —
          horizontal veins are what made the first attempt read as a tree. */}
      <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <path d="M50 78c-9-1-17-7-23-16" />
        <path d="M50 78c9-1 17-7 23-16" />
        <path d="M50 60c-8-1-15-7-20-15" />
        <path d="M50 60c8-1 15-7 20-15" />
        <path d="M50 42c-6-1-11-6-14-12" />
        <path d="M50 42c6-1 11-6 14-12" />
      </g>
    </svg>
  );
}

/**
 * The header lockup: mark + name, wrapped in a link home.
 *
 * One <a>, not two, and the accessible name comes from the visible text — so a
 * screen reader announces "Kata Nylén, link" rather than "image, link, link".
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <LeafMark className="h-7 w-auto shrink-0 text-[var(--color-leaf)]" />
      <span className="font-[family-name:var(--font-display)] text-lg leading-none tracking-[0.08em] uppercase">
        Kata Nylén
      </span>
    </Link>
  );
}
