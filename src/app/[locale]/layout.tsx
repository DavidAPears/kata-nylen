import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, locales, type Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { resolveSiteUrl, isIndexable } from "@/lib/site-url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/StructuredData";
import { displayFont, bodyFont } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Only "sv" and "en" are valid locale segments.
 *
 * Without this, a request for something like /sw.js or /favicon.ico matches
 * this segment with locale="sw.js". The layout's notFound() catches it, but
 * pages render CONCURRENTLY with the layout, so the page runs first with a
 * nonsense locale and crashes before the 404 lands.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const content = getContent(locale);

  return {
    metadataBase: new URL(resolveSiteUrl()),
    // Staging deployments must not reach search results at all.
    ...(isIndexable()
      ? {}
      : { robots: { index: false, follow: false, nocache: true } }),
    title: {
      default: content.home.seo.title,
      template: "%s | Kata Nylén",
    },
    description: content.home.seo.description,
    // Brief §7: every page needs hreflang + x-default so the two language
    // versions are understood as alternates rather than duplicates.
    alternates: {
      canonical: getPathname({ locale, href: "/" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/" }),
        en: getPathname({ locale: "en", href: "/" }),
        "x-default": getPathname({ locale: routing.defaultLocale, href: "/" }),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Kata Nylén",
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      title: content.home.seo.title,
      description: content.home.seo.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for every page in this segment.
  setRequestLocale(locale);

  const content = getContent(locale as Locale);

  return (
    <html lang={content.htmlLang} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3 focus:underline"
          >
            {content.nav.skipToContent}
          </a>
          <Header locale={locale as Locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale as Locale} />
          <PersonJsonLd locale={locale as Locale} />
          <WebSiteJsonLd locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
