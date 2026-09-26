/**
 * Where this deployment actually lives, and whether search engines may index it.
 *
 * While the site is on a temporary kata-nylen.vercel.app address it must stay
 * out of search results: it carries Kata's name against placeholder copy, and
 * an indexed staging URL would later compete with the real domain for her own
 * name.
 *
 * This lifts itself automatically. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
 * to the project's production domain, which becomes katanylen.com the moment
 * that domain is attached. So indexing switches on when the real domain does,
 * with no code change and nothing to remember.
 */

/** The domain that is allowed to be indexed. */
const CANONICAL_HOST = "katanylen.com";

export function resolveSiteUrl(): string {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (host) return `https://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function isIndexable(): boolean {
  // Escape hatch, either direction, for cases the rule below cannot see.
  if (process.env.SITE_INDEXABLE === "true") return true;
  if (process.env.SITE_INDEXABLE === "false") return false;

  // Preview and development deployments are never indexable.
  if (process.env.VERCEL_ENV !== "production") return false;

  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "";
  return host === CANONICAL_HOST || host.endsWith(`.${CANONICAL_HOST}`);
}
