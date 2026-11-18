import { defineRouting } from "next-intl/routing";

export const locales = ["sv", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sv";

/**
 * Localised pathnames. The key is the internal route (the folder under
 * `src/app/[locale]/`); the value is the public URL per language.
 *
 * Brief §7 / §8: Swedish and English are both first-class, and switching
 * language must land on the equivalent page — which this mapping gives us
 * for free via next-intl's <Link> and usePathname.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix, so there is no ambiguous un-prefixed duplicate of any page
  // competing for the same content in search results.
  localePrefix: "always",
  pathnames: {
    "/": "/",
    /*
      Was "/book-release" ("/bokrelease"). The launch happened in November and
      the page is becoming Kata's resilience page: the book plus exercises and
      other resources. The old path was wrong twice over.

      The old URLs permanently redirect here, in next.config.ts. They were sent
      to 110 guests, they are in every confirmation email and in the sharing
      cards, so they have to keep working.
    */
    "/resilience": {
      sv: "/psykologisk-resiliens",
      en: "/psychological-resilience",
    },
    "/publications": {
      sv: "/publikationer",
      en: "/publications",
    },
    "/speaking": {
      sv: "/forelasningar",
      en: "/speaking",
    },
    "/contact": {
      sv: "/kontakt",
      en: "/contact",
    },
    "/media": {
      sv: "/media",
      en: "/media",
    },
    "/about": {
      sv: "/om-kata",
      en: "/about",
    },
    "/privacy": {
      sv: "/integritetspolicy",
      en: "/privacy",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
