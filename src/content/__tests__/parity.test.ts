import { describe, it, expect } from "vitest";
import { en } from "../en";
import { sv } from "../sv";
import { locales } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

/**
 * Structural parity between languages.
 *
 * TypeScript already guarantees both locales satisfy `SiteContent`, but it
 * cannot catch an *empty* string or an array that gained an item in one
 * language and not the other. These tests close that gap, so Swedish can never
 * quietly fall behind English (brief §21.5).
 */

function shapeOf(value: unknown, path = ""): Record<string, string> {
  const out: Record<string, string> = {};

  if (typeof value === "string") {
    out[path] = "string";
    return out;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    out[path] = typeof value;
    return out;
  }
  if (Array.isArray(value)) {
    out[path] = `array(${value.length})`;
    value.forEach((item, index) => {
      Object.assign(out, shapeOf(item, `${path}[${index}]`));
    });
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      Object.assign(out, shapeOf(child, path ? `${path}.${key}` : key));
    }
  }
  return out;
}

function collectStrings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      collectStrings(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

describe("content parity", () => {
  it("has the identical structure in both languages", () => {
    const enShape = shapeOf(en);
    const svShape = shapeOf(sv);

    // Ignore the two keys that are *meant* to differ.
    const ignore = new Set(["locale", "htmlLang"]);
    const keys = (shape: Record<string, string>) =>
      Object.keys(shape).filter((k) => !ignore.has(k)).sort();

    expect(keys(svShape)).toEqual(keys(enShape));
  });

  it("has no empty strings in either language", () => {
    for (const [locale, content] of [
      ["en", en],
      ["sv", sv],
    ] as const) {
      const empty = collectStrings(content)
        .filter(([, value]) => value.trim() === "")
        .map(([path]) => `${locale}.${path}`);
      expect(empty).toEqual([]);
    }
  });

  it("keeps the copyright template's {year} token in both languages", () => {
    expect(en.footer.copyright).toContain("{year}");
    expect(sv.footer.copyright).toContain("{year}");
  });

  it("points every CTA at a route that actually exists", () => {
    const known = new Set(Object.keys(routing.pathnames));
    const ctas = [
      ...[en, sv].flatMap((c) => [
        c.home.hero.primaryCta.href,
        c.home.hero.secondaryCta.href,
        c.home.featuredBook.cta.href,
        c.home.speakingTeaser.cta.href,
        c.speaking.cta.cta.href,
        c.notFound.cta.href,
      ]),
    ];
    for (const href of ctas) expect(known).toContain(href);
  });

  it("offers the same contact reasons in both languages", () => {
    expect(sv.contact.reasons.map((r) => r.value)).toEqual(
      en.contact.reasons.map((r) => r.value),
    );
  });

  it("covers every configured locale", () => {
    expect([...locales].sort()).toEqual(["en", "sv"]);
  });
});
