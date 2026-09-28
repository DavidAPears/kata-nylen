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

describe("voice: the site does not speak as a company", () => {
  /*
    Kata asked us to look at "Kata/hon" versus "vi", especially around the
    contact form. The site describes her in the third person but every
    transactional string used to say "vi", which implies an organisation that
    does not exist. Someone using the contact form is writing to her.

    The launch invitation keeps its "vi" on purpose: an event has hosts, and
    "hur många vi blir" counts the reader in. It is allowed by id rather than
    by a loose pattern, so a new "vi" somewhere else still fails.
  */
  const ALLOWED = ["Anmäl dig gärna så att vi vet", "so we know how many to expect"];

  function offenders(node: unknown, path = ""): string[] {
    if (typeof node === "string") {
      if (ALLOWED.some((phrase) => node.includes(phrase))) return [];
      return /\b(vi|vår|vårt|våra|oss|we|we'll|we've|we're|our|us)\b/i.test(node)
        ? [`${path}: ${node}`]
        : [];
    }
    if (Array.isArray(node)) return node.flatMap((v, i) => offenders(v, `${path}[${i}]`));
    if (node && typeof node === "object") {
      return Object.entries(node).flatMap(([k, v]) =>
        offenders(v, path ? `${path}.${k}` : k),
      );
    }
    return [];
  }

  it.each([
    ["Swedish", sv],
    ["English", en],
  ])("%s form and contact copy names Kata or nobody", (_label, content) => {
    expect(offenders(content.forms, "forms")).toEqual([]);
    expect(offenders(content.contact, "contact")).toEqual([]);
  });

  it.each([
    ["Swedish", sv],
    ["English", en],
  ])("%s speaking call to action names Kata", (_label, content) => {
    expect(offenders(content.speaking.cta, "speaking.cta")).toEqual([]);
  });
});
