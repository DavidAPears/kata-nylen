import { describe, it, expect } from "vitest";
import { getContent } from "../index";
import { locales } from "@/i18n/routing";

/**
 * getContent returning undefined for an unknown locale caused a production
 * 500: browsers request /favicon.ico, that matched the /[locale] segment with
 * locale="favicon.ico", and the page destructured undefined before the
 * layout's notFound() could stop it.
 */

describe("getContent", () => {
  it.each([...locales])("returns a full content tree for %s", (locale) => {
    const content = getContent(locale);
    expect(content.locale).toBe(locale);
    // Spot-check every top-level section exists, since a partial object would
    // fail later and somewhere unrelated.
    for (const key of [
      "nav",
      "home",
      "bookRelease",
      "speaking",
      "publications",
      "contact",
      "forms",
      "footer",
      "notFound",
    ] as const) {
      expect(content[key], `${locale}.${key}`).toBeTruthy();
    }
  });

  it.each([
    "favicon.ico",
    "sw.js",
    "de",
    "",
    "EN",
    "../en",
  ])("throws a named error for the invalid locale %j", (bad) => {
    // Loud failure beats undefined. TypeScript cannot help: the locale comes
    // from the URL, so at runtime it can be any string at all.
    expect(() => getContent(bad as never)).toThrow(/No content for locale/);
  });

  it("names the valid locales in the error, so the fix is obvious", () => {
    expect(() => getContent("nope" as never)).toThrow(/sv, en/);
  });
});
