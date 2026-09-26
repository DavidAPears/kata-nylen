import type { MetadataRoute } from "next";
import { locales, routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { resolveSiteUrl } from "@/lib/site-url";

const routes = ["/", "/book-release", "/speaking", "/contact", "/privacy"] as const;

/**
 * Brief §13: XML sitemap, with each entry declaring its language alternates so
 * the two versions are understood as one page in two languages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = { url: resolveSiteUrl() };

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${site.url}${getPathname({ locale, href: route })}`,
      lastModified: new Date(),
      changeFrequency: route === "/book-release" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : route === "/book-release" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((alt: Locale) => [
            alt,
            `${site.url}${getPathname({ locale: alt, href: route })}`,
          ]),
          [
            "x-default",
            `${site.url}${getPathname({ locale: routing.defaultLocale, href: route })}`,
          ],
        ]),
      },
    })),
  );
}
