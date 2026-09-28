import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import {
  person,
  book,
  launchEvent,
  organisations,
  site,
  isResolved,
  resolved,
  launchEventNameFor,
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
  const { speaking } = getContent(locale);
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
    // Affiliations are confirmed. Kata named these herself, 28 Sep 2026.
    affiliation: organisations.map((c) => ({
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
    /*
      The two properties that answer "who can I book to talk about X".

      `knowsAbout` ties this Person entity to her subjects, and `makesOffer`
      says she can be engaged to speak on them. Someone searching for a
      climate psychology speaker is asking exactly that question, and without
      these the site says she is a psychologist and an author but never that
      she is bookable.

      Both are built from the visible speaking page rather than written
      separately, which is what keeps them honest: brief section 14 requires
      structured data to describe content a visitor can actually see, so a
      theme removed from the page disappears from the schema in the same
      commit. Nothing here is a claim we are not already making in public.
    */
    knowsAbout: speaking.themes.topics.map((topic) => topic.title),
    makesOffer: speaking.formats.items.map((format) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: format.title,
        description: format.description,
        serviceType: locale === "sv" ? "Föreläsning" : "Speaking engagement",
      },
    })),
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
        // The evening has its own name, "Resilienssalong". Falls back to a
        // generic book-release name only if that is ever unset.
        name: launchEventNameFor(locale),
        ...(resolved(launchEvent.tagline[locale])
          ? { description: launchEvent.tagline[locale] }
          : {}),
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
        // Kata plus anyone performing with her. Real people, properly credited.
        performer: [
          { "@type": "Person", name: person.fullName },
          ...launchEvent.guests.map((g) => ({ "@type": "Person", name: g.name })),
        ],
        organizer: { "@type": "Person", name: person.fullName, url: site.url },
        url: `${site.url}${pagePath}`,
      }}
    />
  );
}
