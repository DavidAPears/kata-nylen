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
