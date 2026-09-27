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
} from "@/content/facts";
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
