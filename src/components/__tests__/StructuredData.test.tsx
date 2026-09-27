// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  PersonJsonLd,
  WebSiteJsonLd,
  BookJsonLd,
  EventJsonLd,
} from "../StructuredData";
import { person, book, launchEvent, isResolved } from "@/content/facts";
import { getContent } from "@/content";

/**
 * Structured data is read by machines, so a mistake here is silent: nothing
 * looks broken, the site just tells Google and AI assistants something wrong
 * about a real person, a real book, or a real event.
 *
 * Brief §14: schema must describe what is actually on the page, and nothing
 * may be emitted for facts that are not confirmed.
 */

function parse(markup: ReturnType<typeof render>): Record<string, unknown> | null {
  const script = markup.container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.innerHTML) : null;
}

describe("PersonJsonLd", () => {
  it("identifies Kata as the site's person, with the canonical URL", () => {
    const data = parse(render(<PersonJsonLd locale="sv" />))!;
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Kata Nylén");
    expect(String(data.url)).toContain("katanylen.com");
  });

  it("lists only confirmed profiles in sameAs", () => {
    const data = parse(render(<PersonJsonLd locale="en" />))!;
    const sameAs = (data.sameAs ?? []) as string[];
    // sameAs is how a search engine confirms these profiles are one person.
    // A wrong URL here attaches someone else's identity to her.
    expect(sameAs).toEqual(person.sameAs);
    for (const url of sameAs) expect(() => new URL(url)).not.toThrow();
  });

  it("claims only the affiliations the brief supplied", () => {
    const data = parse(render(<PersonJsonLd locale="sv" />))!;
    const names = (data.affiliation as { name: string }[]).map((a) => a.name);
    expect(names).toEqual(["Klimatpsykologerna", "Climate Psyched"]);
  });

  it("emits valid JSON for both languages", () => {
    for (const locale of ["sv", "en"] as const) {
      expect(parse(render(<PersonJsonLd locale={locale} />))).toBeTruthy();
    }
  });
});

describe("WebSiteJsonLd", () => {
  it("declares the language of the page it is on", () => {
    expect(parse(render(<WebSiteJsonLd locale="sv" />))!.inLanguage).toBe("sv");
    expect(parse(render(<WebSiteJsonLd locale="en" />))!.inLanguage).toBe("en");
  });
});

describe("BookJsonLd", () => {
  it("carries the confirmed publishing details", () => {
    const data = parse(render(<BookJsonLd locale="sv" />))!;
    expect(data["@type"]).toBe("Book");
    expect(data.name).toBe(book.title);
    expect(data.isbn).toBe(book.isbn);
    expect(data.datePublished).toBe(book.publicationDate);
    expect((data.publisher as { name: string }).name).toBe(book.publisher);
  });

  it("attributes the book to Kata", () => {
    const data = parse(render(<BookJsonLd locale="en" />))!;
    expect((data.author as { name: string }).name).toBe("Kata Nylén");
  });
});

describe("EventJsonLd", () => {
  it("uses the evening's own name, not a generic book-release title", () => {
    const data = parse(render(<EventJsonLd locale="sv" />))!;
    expect(data.name).toBe("Resilienssalong");
  });

  it("puts the guest at the right door", () => {
    // Djupet has its own entrance; Knackeriet's office address would send
    // people to the wrong building.
    const location = parse(render(<EventJsonLd locale="sv" />))!.location as {
      name: string;
      address: Record<string, string>;
    };
    expect(location.name).toBe("Djupet");
    expect(location.address.streetAddress).toBe("Björngårdsgatan 1A");
    expect(location.address.addressLocality).toBe("Stockholm");
  });

  it("credits everyone performing, not just Kata", () => {
    const performers = parse(render(<EventJsonLd locale="en" />))!.performer as {
      name: string;
    }[];
    expect(performers.map((p) => p.name)).toContain("Kata Nylén");
    for (const guest of launchEvent.guests) {
      expect(performers.map((p) => p.name)).toContain(guest.name);
    }
  });

  it("omits the end date while none is published, rather than inventing one", () => {
    const data = parse(render(<EventJsonLd locale="sv" />))!;
    if (!isResolved(launchEvent.endsAt)) {
      expect(data.endDate).toBeUndefined();
    }
  });

  it("uses a start date that parses to a real moment in time", () => {
    const data = parse(render(<EventJsonLd locale="sv" />))!;
    expect(Number.isNaN(Date.parse(String(data.startDate)))).toBe(false);
  });
});

describe("PersonJsonLd: being findable as a speaker", () => {
  it("names the subjects she can be booked to talk about", () => {
    const data = parse(render(<PersonJsonLd locale="en" />))!;
    const knowsAbout = data.knowsAbout as string[];
    expect(knowsAbout.length).toBeGreaterThan(0);
    expect(knowsAbout).toContain("Climate psychology");
    expect(knowsAbout).toContain("Psychological resilience");
  });

  it("says she is bookable, and in which formats", () => {
    // Without makesOffer the site says she is a psychologist and an author,
    // but never that she can be engaged to speak. That is the query we want
    // to be found for.
    const data = parse(render(<PersonJsonLd locale="en" />))!;
    const offers = data.makesOffer as {
      "@type": string;
      itemOffered: { "@type": string; name: string; description: string };
    }[];
    expect(offers.length).toBeGreaterThan(0);
    const names = offers.map((o) => o.itemOffered.name);
    expect(names).toContain("Keynote");
    expect(names).toContain("Workshop");
    for (const offer of offers) {
      expect(offer["@type"]).toBe("Offer");
      expect(offer.itemOffered["@type"]).toBe("Service");
      expect(offer.itemOffered.description).toBeTruthy();
    }
  });

  it("mirrors the speaking page exactly, in both languages", () => {
    // Brief §14: structured data must describe visible content. Building these
    // from the rendered copy is what keeps that true, so a theme dropped from
    // the page disappears from the schema in the same commit.
    for (const locale of ["sv", "en"] as const) {
      const data = parse(render(<PersonJsonLd locale={locale} />))!;
      const { speaking } = getContent(locale);
      expect(data.knowsAbout).toEqual(speaking.themes.topics.map((t) => t.title));
      expect((data.makesOffer as { itemOffered: { name: string } }[]).map(
        (o) => o.itemOffered.name,
      )).toEqual(speaking.formats.items.map((f) => f.title));
    }
  });
});

describe("search result copy", () => {
  const pages = ["home", "speaking", "publications", "about", "media", "contact"] as const;

  it("keeps every title short enough to survive Google's truncation", () => {
    // Titles render as "<title> | Kata Nylén". Past roughly 60 characters
    // Google cuts them off, and a speaker listing that ends in an ellipsis
    // reads as careless.
    for (const locale of ["sv", "en"] as const) {
      const content = getContent(locale);
      for (const page of pages) {
        // Home is the one page that does not go through the "%s | Kata Nylén"
        // template: it sets the title outright, so it already carries her name.
        const full =
          page === "home"
            ? content[page].seo.title
            : `${content[page].seo.title} | Kata Nylén`;
        expect(full.length, `${locale}/${page}: "${full}"`).toBeLessThanOrEqual(60);
        // And no page should say "Kata Nylén" twice in one title.
        expect(full.match(/Kata Nyl/g)?.length ?? 0, `${locale}/${page}: "${full}"`)
          .toBeLessThanOrEqual(1);
      }
    }
  });

  it("gives every page a description long enough to be useful", () => {
    for (const locale of ["sv", "en"] as const) {
      const content = getContent(locale);
      for (const page of pages) {
        const description = content[page].seo.description;
        expect(description.length, `${locale}/${page} too short`).toBeGreaterThan(70);
        expect(description.length, `${locale}/${page} too long`).toBeLessThanOrEqual(175);
      }
    }
  });

  it("does not ship the same description on two pages", () => {
    // Duplicate descriptions make Google pick its own, usually worse.
    for (const locale of ["sv", "en"] as const) {
      const content = getContent(locale);
      const descriptions = pages.map((p) => content[p].seo.description);
      expect(new Set(descriptions).size).toBe(descriptions.length);
    }
  });
});
