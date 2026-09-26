import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * We use next-intl for locale detection and localised routing only. All copy
 * lives in typed content modules under `src/content/` instead of message
 * catalogues, so that TypeScript can prove Swedish and English never drift
 * apart. Hence: no messages here.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return { locale, messages: {} };
});
