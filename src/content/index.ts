import type { Locale } from "@/i18n/routing";
import type { SiteContent } from "./types";
import { en } from "./en";
import { sv } from "./sv";

const content: Record<Locale, SiteContent> = { sv, en };

/** Returns all copy for a locale. Both locales satisfy the same type, so a
 *  missing translation is a type error rather than a runtime surprise. */
export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

export type { SiteContent };
