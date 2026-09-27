import type { Locale } from "@/i18n/routing";
import type { SiteContent } from "./types";
import { en } from "./en";
import { sv } from "./sv";

const content: Record<Locale, SiteContent> = { sv, en };

/**
 * Returns all copy for a locale. Both locales satisfy the same type, so a
 * missing translation is a type error rather than a runtime surprise.
 *
 * Throws on an unknown locale rather than returning undefined. TypeScript
 * cannot help here: the locale arrives from the URL, so at runtime it can be
 * any string. Returning undefined pushed the failure to whichever caller
 * destructured it first, which surfaced as an unrelated crash in a page.
 */
export function getContent(locale: Locale): SiteContent {
  const site = content[locale];
  if (!site) {
    throw new Error(
      `No content for locale "${locale}". Valid locales: ${Object.keys(content).join(", ")}.`,
    );
  }
  return site;
}

export type { SiteContent };
