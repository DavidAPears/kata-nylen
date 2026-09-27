import { describe, it, expect } from "vitest";
import { publications } from "@/content/facts";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The publications list is real bibliographic data about real books, several
 * co-written with named people. Wrong details here misrepresent their work as
 * well as Kata's.
 */

describe("publications data", () => {
  it("has a unique id per entry", () => {
    const ids = publications.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every entry a title, publisher and working URL", () => {
    for (const p of publications) {
      expect(p.title, `${p.id} title`).toBeTruthy();
      expect(p.publisher, `${p.id} publisher`).toBeTruthy();
      expect(() => new URL(p.url), `${p.id} url`).not.toThrow();
      expect(p.url.startsWith("https://"), `${p.id} must be https`).toBe(true);
    }
  });

  it("distinguishes authorship from a chapter contribution", () => {
    // Listing a chapter alongside her own books would overstate what she did.
    const chapters = publications.filter((p) => p.role === "chapter");
    expect(chapters.length).toBeGreaterThan(0);
    for (const p of chapters) {
      expect(p.editors?.length, `${p.id} should name its editors`).toBeGreaterThan(0);
    }
  });

  it("marks exactly one publication as current", () => {
    expect(publications.filter((p) => p.isCurrent)).toHaveLength(1);
  });

  it("points the current one at the book the launch is for", () => {
    const current = publications.find((p) => p.isCurrent)!;
    expect(current.title).toBe("Psykologisk resiliens");
  });

  it("references cover files that actually exist, at the stated size", () => {
    for (const p of publications) {
      if (!p.cover) continue;
      const file = join(process.cwd(), "public", p.cover.src);
      expect(existsSync(file), `${p.id} cover file ${p.cover.src}`).toBe(true);

      // A wrong width/height makes Next reserve the wrong space and the page
      // jumps as images load.
      const bytes = readFileSync(file);
      expect(bytes.byteLength, `${p.id} cover is not empty`).toBeGreaterThan(1000);
      expect(p.cover.width).toBeGreaterThan(0);
      expect(p.cover.height).toBeGreaterThan(0);
      expect(
        p.cover.height / p.cover.width,
        `${p.id} cover should be portrait`,
      ).toBeGreaterThan(1);
    }
  });

  it("writes every summary in both languages", () => {
    for (const p of publications) {
      if (!p.summary) continue;
      expect(p.summary.sv, `${p.id} sv summary`).toBeTruthy();
      expect(p.summary.en, `${p.id} en summary`).toBeTruthy();
      expect(p.summary.sv).not.toBe(p.summary.en);
    }
  });

  it("names co-authors without listing Kata among them", () => {
    for (const p of publications) {
      for (const name of p.withAuthors ?? []) {
        expect(name).not.toMatch(/Kata/);
      }
    }
  });

  it("gives every entry an English title, so an English reader knows what it is", () => {
    for (const p of publications) {
      expect(p.titleEn, `${p.id} needs an English title`).toBeTruthy();
      // The English is a rendering, not a different book.
      expect(p.titleEn).not.toBe(p.title);
    }
  });

  it("keeps a Swedish subtitle paired with an English one", () => {
    for (const p of publications) {
      if (p.subtitle) {
        expect(p.subtitleEn, `${p.id} has a subtitle but no English one`).toBeTruthy();
      }
      if (p.subtitleEn) {
        expect(p.subtitle, `${p.id} has an English subtitle but no Swedish one`).toBeTruthy();
      }
    }
  });

  it("orders the authored books newest first", () => {
    const years = publications
      .filter((p) => p.role === "author" && p.year)
      .map((p) => Number(p.year));
    expect([...years].sort((a, b) => b - a)).toEqual(years);
  });
});
