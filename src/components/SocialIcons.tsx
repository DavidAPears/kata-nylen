/**
 * Icons for the profile links in the footer.
 *
 * Inline SVG rather than an icon library: we need exactly one or two glyphs,
 * and a library would ship a whole font or component tree for them. They
 * inherit `currentColor` so they work in either colourway.
 *
 * Each is decorative; the adjacent link text carries the accessible name.
 */

export function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      // Explicit dimensions as a floor: without them, an SVG with only a
      // viewBox falls back to 300x150 if the sizing class is ever missing.
      width="18"
      height="18"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** Maps a profile URL to its icon, when we have one. */
export function iconForProfile(url: string) {
  if (url.includes("linkedin.com")) return LinkedInIcon;
  return null;
}

/** A readable label for a profile URL. */
export function labelForProfile(url: string): string {
  if (url.includes("linkedin.com")) return "LinkedIn";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
