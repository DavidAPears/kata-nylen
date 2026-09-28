import { describe, it, expect } from "vitest";
import {
  TODO,
  isResolved,
  resolved,
  book,
  launchEvent,
  bookTitleFor,
  bookTitlePlainFor,
  bookSubtitleFor,
  launchEventNameFor,
  outstandingFacts,
  speakingCredentials,
  media,
  publications,
  publicationCounts,
  booksIntroFor,
  numberWord,
} from "@/content/facts";
import { getContent } from "@/content";
import { en } from "@/content/en";
import { sv } from "@/content/sv";

describe("the TODO sentinel", () => {
  it("treats a real value as resolved and the sentinel as not", () => {
    expect(isResolved("Kata")).toBe(true);
    expect(isResolved(TODO)).toBe(false);
    expect(resolved("Kata")).toBe("Kata");
    expect(resolved(TODO)).toBeUndefined();
  });

  it("does not mistake an empty string or zero for the sentinel", () => {
    // These are falsy but genuinely supplied, so they must survive the gate.
    expect(isResolved("")).toBe(true);
    expect(isResolved(0)).toBe(true);
  });
});

describe("book titles", () => {
  it("leads with the Swedish title on Swedish pages", () => {
    expect(bookTitleFor("sv")).toBe(resolved(book.title));
    expect(bookTitlePlainFor("sv")).toBe(resolved(book.title));
  });

  it("keeps the real Swedish title on English pages, with the translation in brackets", () => {
    const sv = resolved(book.title);
    const en = resolved(book.titleEnglish);
    if (sv && en) {
      expect(bookTitleFor("en")).toBe(`${sv} (${en})`);
    } else if (sv) {
      expect(bookTitleFor("en")).toBe(sv);
    }
  });

  it("drops the bracketed translation where the cover is already visible", () => {
    const plain = bookTitlePlainFor("en");
    expect(plain).not.toContain("(");
  });

  it("falls back to the Swedish subtitle if there is no English one", () => {
    expect(bookSubtitleFor("en")).toBe(
      resolved(book.subtitleEnglish) ?? resolved(book.subtitle),
    );
    expect(bookSubtitleFor("sv")).toBe(resolved(book.subtitle));
  });
});

describe("launchEventNameFor", () => {
  it("uses the confirmed event name in each language", () => {
    for (const locale of ["sv", "en"] as const) {
      const confirmed = resolved(launchEvent.name[locale]);
      if (confirmed) expect(launchEventNameFor(locale)).toBe(confirmed);
    }
  });

  it("never returns an empty string, whatever is confirmed", () => {
    for (const locale of ["sv", "en"] as const) {
      expect(launchEventNameFor(locale).trim().length).toBeGreaterThan(0);
    }
  });
});

describe("outstandingFacts", () => {
  it("returns a list of plain labels we can read at a glance", () => {
    const missing = outstandingFacts();
    expect(Array.isArray(missing)).toBe(true);
    for (const item of missing) {
      expect(typeof item).toBe("string");
      expect(item.trim()).not.toBe("");
    }
  });

  it("has no duplicates", () => {
    const missing = outstandingFacts();
    expect(new Set(missing).size).toBe(missing.length);
  });

  it("does not list the things David has decided we do not need", () => {
    // endsAt, capacity, postalCode and accessibility are deliberate omissions,
    // not gaps. Listing them would make the audit cry wolf.
    const joined = outstandingFacts().join(" ");
    for (const ignored of ["endsAt", "capacity", "postalCode", "accessibility"]) {
      expect(joined).not.toContain(ignored);
    }
  });

  it("flags the synopsis until the publisher has signed it off", () => {
    // It has a value, so a plain sentinel check would miss it.
    expect(outstandingFacts().some((m) => m.startsWith("book.synopsis"))).toBe(true);
  });
});

describe("speakingCredentials", () => {
  it("leads with what Kata ran, not what she was asked about", () => {
    // An organiser is booking a chair or a workshop, so those credits have to
    // come first. An interview shows she is asked for her view, which earns a
    // place but not the top of the list.
    const roles = speakingCredentials().map((item) => item.role);
    expect(roles[0]).toBe("moderator");
    expect(roles).toContain("workshop");
  });

  it("is a short selection, not the whole media list", () => {
    expect(speakingCredentials()).toHaveLength(3);
    expect(speakingCredentials(2)).toHaveLength(2);
    expect(speakingCredentials().length).toBeLessThan(media.length);
  });

  it("never repeats an item", () => {
    const ids = speakingCredentials(media.length).map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns real items, each with a role label we can render", () => {
    for (const item of speakingCredentials()) {
      expect(item.url.startsWith("https://")).toBe(true);
      expect(en.speaking.credibility.roles[item.role]).toBeTruthy();
      expect(sv.speaking.credibility.roles[item.role]).toBeTruthy();
    }
  });

  it("does not mutate the underlying media list", () => {
    // It sorts a copy. Sorting `media` in place would silently reorder the
    // Media page, which is meant to stay in the order we curated.
    const before = media.map((item) => item.id);
    speakingCredentials();
    expect(media.map((item) => item.id)).toEqual(before);
  });
});

describe("the book's own details", () => {
  it("uses the plural motgångar in the subtitle", () => {
    // The real subtitle is "Att möta motgångar i en osäker värld". The site
    // shipped the singular in four places, including inside both synopsis
    // strings. Corrected by Kata, 28 Sep 2026.
    expect(resolved(book.subtitle)).toBe("Att möta motgångar i en osäker värld");
    for (const locale of ["sv", "en"] as const) {
      const synopsis = resolved(book.synopsis[locale]);
      if (synopsis?.includes("Psykologisk resiliens:")) {
        expect(synopsis, `${locale} synopsis`).toContain("motgångar");
        expect(synopsis, `${locale} synopsis`).not.toMatch(/motgång\b(?!ar)/);
      }
    }
  });

  it("has four movements, because LÄKA has four letters", () => {
    for (const locale of ["sv", "en"] as const) {
      expect(book.themes[locale], locale).toHaveLength(4);
    }
    // The Swedish list is where the acronym is legible.
    expect(book.themes.sv.map((t) => t[0]).join("")).toBe("LÄKA");
  });
});

describe("publicationCounts and booksIntroFor", () => {
  it("counts what is actually in the list, split by what she did", () => {
    const { authored, chapters } = publicationCounts();
    expect(authored).toBe(publications.filter((p) => p.role === "author").length);
    expect(chapters).toBe(publications.filter((p) => p.role === "chapter").length);
    expect(authored + chapters).toBe(publications.length);
  });

  it("keeps at least two authored books, so the prose stays plural", () => {
    // booksIntroFor writes "{authored} egna böcker" / "books of her own".
    // At one, both languages would need a singular form. This is the
    // assumption that lets the sentence stay simple: if it ever breaks, the
    // copy needs rewording rather than the count fudging.
    expect(publicationCounts().authored).toBeGreaterThanOrEqual(2);
  });

  it("fills the placeholder with a word, not a digit", () => {
    for (const locale of ["sv", "en"] as const) {
      const filled = booksIntroFor(locale, getContent(locale).about.booksIntro);
      expect(filled).not.toContain("{authored}");
      expect(filled).not.toMatch(/\d/);
    }
    expect(numberWord(4, "sv")).toBe("fyra");
    expect(numberWord(4, "en")).toBe("four");
  });

  it("cannot contradict the list printed underneath it", () => {
    // The whole point of deriving it. "Fem titlar" was wrong by one and
    // counted a chapter contribution as a book she wrote.
    const { authored } = publicationCounts();
    for (const locale of ["sv", "en"] as const) {
      const filled = booksIntroFor(locale, getContent(locale).about.booksIntro);
      // Case-insensitive: the count opens the sentence, so it is capitalised.
      expect(filled.toLowerCase()).toContain(numberWord(authored, locale));
    }
  });
});

describe("booksIntroFor: sentence shape", () => {
  it("starts the sentence with a capital, even though the count opens it", () => {
    for (const locale of ["sv", "en"] as const) {
      const filled = booksIntroFor(locale, getContent(locale).about.booksIntro);
      expect(filled[0], `${locale}: "${filled.slice(0, 24)}"`).toBe(
        filled[0].toUpperCase(),
      );
    }
  });

  it("ends as a sentence", () => {
    for (const locale of ["sv", "en"] as const) {
      expect(booksIntroFor(locale, getContent(locale).about.booksIntro)).toMatch(/\.$/);
    }
  });
});
