import { Link } from "@/i18n/navigation";

/**
 * Kata's leaf mark and wordmark.
 *
 * The outline is the ACTUAL vector from her book, extracted from the print
 * PDF rather than traced or redrawn: the chapter openers are built from seven
 * nested copies of this shape, so it is the book's core motif. Using the real
 * path means the site and the book are the same mark, not a lookalike.
 *
 * Filled with  so one path serves every context: muted green on
 * the site, book orange on the launch page, cream when it sits on navy. No
 * second asset, no recolouring at build time.
 *
 * Below roughly 28px the toothed edge and the thin stem stop reading. Use
 *  at small sizes, which keeps the silhouette and drops the detail.
 */

const LEAF_PATH =
  "M28.55 62.78C28.55 62.78 32.87 62.54 34.2 62.05C35.53 61.57 37.53 62.44 38.49 61.57C39.46 60.7 38.92 59.64 39.64 59.15C40.37 58.67 44.96 57.7 45.57 56.86C46.17 56.01 46.63 55.95 46.11 55.59C45.59 55.22 44.6 54.08 45.08 53.35C45.57 52.62 49.62 49.18 51.31 47.49C53.0 45.79 53.85 45.61 54.27 44.65C54.71 43.64 54.39 43.77 53.43 42.83C52.46 41.89 51.31 41.14 52.22 39.51C53.12 37.87 54.21 36.66 54.43 36.3C54.77 35.76 54.96 35.09 54.63 34.73C54.31 34.37 53.24 34.55 53.06 33.64C52.88 32.74 53.73 32.62 53.43 31.95C53.12 31.29 52.34 31.04 52.22 30.26C52.1 29.47 52.82 28.02 52.52 27.78C52.22 27.54 51.85 27.54 51.25 27.18C50.64 26.81 51.13 25.12 50.46 24.88C49.8 24.64 48.53 25.24 48.05 24.52C47.56 23.79 47.74 23.43 48.05 21.86C48.39 20.07 46.59 21.19 46.53 20.47C46.47 19.74 47.08 19.2 46.59 18.77C46.11 18.35 45.63 18.77 45.45 18.17C45.26 17.56 45.87 16.17 45.08 16.17C44.3 16.17 43.57 16.61 43.09 15.93C42.61 15.25 43.15 13.21 42.36 12.85C41.58 12.49 40.97 12.85 40.67 12.0C40.37 11.16 40.55 11.4 40.43 11.04C40.33 10.75 40.01 10.13 39.46 10.4C38.89 10.68 39.16 11.28 38.25 10.55C37.35 9.83 36.5 9.52 36.02 8.5C35.53 7.47 35.05 6.02 34.32 5.9C33.6 5.78 33.24 6.23 32.87 5.85C32.51 5.47 27.81 1.28 27.13 0.34C26.89 0.0 26.34 1.24 24.71 3.3C23.08 5.35 23.14 5.96 22.05 6.68C20.96 7.41 18.85 6.8 18.37 7.17C17.88 7.53 17.58 8.8 17.1 9.52C16.61 10.25 15.83 11.76 15.04 12.06C14.25 12.37 12.86 11.76 12.38 12.24C11.9 12.73 11.53 13.64 11.47 14.42C11.41 15.21 11.35 16.48 10.69 16.78C10.02 17.08 9.3 16.54 8.87 16.84C8.45 17.14 8.45 18.23 7.91 18.89C7.36 19.56 7.18 18.89 6.88 19.38C6.58 19.86 7.3 21.19 6.79 21.67C6.28 22.16 5.01 21.98 4.64 22.34C4.12 22.86 5.03 25.08 4.52 25.91C3.93 26.87 2.59 26.87 2.35 27.36C2.1 27.84 3.25 28.87 2.95 30.56C2.65 32.25 2.23 31.95 1.68 32.13C1.14 32.31 0.35 32.13 0.29 32.98C0.23 33.82 0.61 34.63 1.08 35.7C1.5 36.67 1.44 37.21 1.14 37.39C0.84 37.57 0.0 38.06 0.47 38.66C0.94 39.27 2.04 40.17 2.23 41.2C2.43 42.35 2.35 41.89 1.8 42.77C1.4 43.43 0.77 43.25 0.9 44.16C1.02 45.07 2.77 46.34 3.37 46.94C3.98 47.55 5.49 47.79 6.52 48.57C7.34 49.21 7.61 49.36 7.12 50.21C6.64 51.05 5.73 51.23 6.09 52.02C6.46 52.81 8.0 53.67 9.24 53.83C10.57 54.01 12.14 54.38 12.92 55.1C13.71 55.83 14.98 56.25 14.92 56.98C14.86 57.7 14.25 57.76 14.86 58.25C15.46 58.73 15.89 59.15 17.16 59.33C18.43 59.52 19.7 59.46 20.54 60.06C21.39 60.66 22.66 62.05 23.5 62.18C22.87 62.09 26.69 62.89 26.69 62.89C26.69 62.89 27.56 64.17 27.56 67.31C27.56 70.46 27.87 70.52 27.56 73.6C27.26 76.68 27.52 78.25 27.26 80.37C26.99 82.49 27.25 97.7 27.25 98.85C27.25 100.0 27.35 99.27 27.69 99.4C28.03 99.52 28.73 99.52 28.61 99.09C28.48 98.67 28.19 82.0 28.43 80.25C28.67 78.5 28.92 73.96 28.98 71.79C29.03 69.79 28.77 64.9 28.43 63.93C28.09 62.96 28.55 62.6 28.55 62.78Z";

/** Simplified silhouette for small sizes: same proportions, no serrations. */
const LEAF_SIMPLE =
  "M27.5 0C38 14 55 33 55 52.5 55 69 43 81 30.5 83.6V100h-6V83.6C12 81 0 69 0 52.5 0 33 17 14 27.5 0Z";

export function LeafMark({
  className = "",
  title,
  simplified = false,
}: {
  className?: string;
  /** Only pass a title when the mark stands alone. Inside the logo lockup the
   *  wordmark already names it, and a title here would be announced twice. */
  title?: string;
  simplified?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 54.96 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path fill="currentColor" d={simplified ? LEAF_SIMPLE : LEAF_PATH} />
    </svg>
  );
}

/**
 * Header lockup: mark plus name, wrapped in a link home.
 *
 * One <a>, not two, and the accessible name comes from the visible text, so a
 * screen reader announces "Kata Nylén, link" rather than "image, link, link".
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <LeafMark className="h-8 w-auto shrink-0 text-[var(--color-leaf)]" />
      <span className="font-[family-name:var(--font-display)] text-lg leading-none tracking-[0.08em] uppercase">
        Kata Nylén
      </span>
    </Link>
  );
}
