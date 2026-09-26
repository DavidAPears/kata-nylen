import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import {
  person,
  book,
  launchEvent,
  collectives,
  site,
  isResolved,
} from "@/content/facts";

/**
 * JSON-LD. Brief §14: "Do not add schema simply because a type exists.
 * Structured data must accurately describe visible content."
 *
 * So every emitter below returns `null` unless the underlying facts are
 * confirmed. We would rather ship no Event schema than one containing an
 * invented date — a wrong date in structured data is worse than none, because
 * search engines and assistants will repeat it.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from our own typed facts, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd({ locale }: { locale: Locale }) {
  const jobTitle = isResolved(person.jobTitle[locale]) ? person.jobTitle[locale] : null;
  const description = isResolved(person.shortBio[locale]) ? person.shortBio[locale] : null;
  const portrait = isResolved(person.portrait) ? person.portrait : null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.fullName,
    url: site.url,
    ...(jobTitle ? { jobTitle } : {}),
    ...(description ? { description } : {}),
    ...(portrait ? { image: `${site.url}${portrait.src}` } : {}),
    ...(person.sameAs.length > 0 ? { sameAs: person.sameAs } : {}),
    // Affiliations are confirmed (brief §1 supplied these URLs).
    affiliation: collectives.map((c) => ({
      "@type": "Organization",
      name: c.name,
      url: c.url,
    })),
    ...(isResolved(book.title)
      ? {
          author: {
            "@type": "Book",
            name: book.title,
          },
        }
      : {}),
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Kata Nylén",
        url: site.url,
        description: content.home.seo.description,
        inLanguage: content.htmlLang,
        publisher: { "@type": "Person", name: person.fullName },
      }}
    />
  );
}

export function BookJsonLd({ locale }: { locale: Locale }) {
  // Needs at minimum a real title to be meaningful.
  if (!isResolved(book.title)) return null;

  const synopsis = isResolved(book.synopsis[locale]) ? book.synopsis[locale] : null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        author: { "@type": "Person", name: person.fullName, url: site.url },
        ...(synopsis ? { description: synopsis } : {}),
        ...(isResolved(book.publisher)
          ? { publisher: { "@type": "Organization", name: book.publisher } }
          : {}),
        ...(isResolved(book.publicationDate) ? { datePublished: book.publicationDate } : {}),
        ...(isResolved(book.isbn) ? { isbn: book.isbn } : {}),
        ...(isResolved(book.purchaseUrl) ? { url: book.purchaseUrl } : {}),
        ...(isResolved(book.cover) ? { image: `${site.url}${book.cover.src}` } : {}),
        inLanguage: locale === "sv" ? "sv" : "en",
      }}
    />
  );
}

export function EventJsonLd({ locale }: { locale: Locale }) {
  // An Event without a real start date or venue is worse than no Event at all.
  if (!isResolved(launchEvent.startsAt) || !isResolved(launchEvent.venueName)) {
    return null;
  }

  const pagePath = locale === "sv" ? "/sv/bokrelease" : "/en/book-release";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        name: isResolved(book.title)
          ? `${locale === "sv" ? "Bokrelease" : "Book release"}: ${book.title}`
          : locale === "sv"
            ? "Bokrelease — Kata Nylén"
            : "Book release — Kata Nylén",
        startDate: launchEvent.startsAt,
        ...(isResolved(launchEvent.endsAt) ? { endDate: launchEvent.endsAt } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: launchEvent.venueName,
          address: {
            "@type": "PostalAddress",
            ...(isResolved(launchEvent.addressLine)
              ? { streetAddress: launchEvent.addressLine }
              : {}),
            ...(isResolved(launchEvent.postalCode)
              ? { postalCode: launchEvent.postalCode }
              : {}),
            ...(isResolved(launchEvent.city) ? { addressLocality: launchEvent.city } : {}),
            addressCountry: launchEvent.country,
          },
        },
        performer: { "@type": "Person", name: person.fullName },
        organizer: { "@type": "Person", name: person.fullName, url: site.url },
        url: `${site.url}${pagePath}`,
      }}
    />
  );
}
