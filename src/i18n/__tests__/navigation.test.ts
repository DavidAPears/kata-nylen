import { describe, it, expect } from "vitest";
import { getPathname } from "../navigation";
import { routing, locales } from "../routing";

/**
 * Brief §7: switching language must land on the EQUIVALENT page, not the home
 * page. That equivalence lives in the pathnames map, so it is worth asserting
 * directly rather than only through the UI.
 */

const ROUTES = Object.keys(routing.pathnames) as (keyof typeof routing.pathnames)[];

describe("localised pathnames", () => {
  it.each([
    ["/", "sv", "/sv"],
    ["/", "en", "/en"],
    ["/book-release", "sv", "/sv/bokrelease"],
    ["/book-release", "en", "/en/book-release"],
    ["/publications", "sv", "/sv/publikationer"],
    ["/publications", "en", "/en/publications"],
    ["/speaking", "sv", "/sv/forelasningar"],
    ["/speaking", "en", "/en/speaking"],
    ["/contact", "sv", "/sv/kontakt"],
    ["/contact", "en", "/en/contact"],
    ["/privacy", "sv", "/sv/integritetspolicy"],
    ["/privacy", "en", "/en/privacy"],
  ] as const)("%s in %s is %s", (href, locale, expected) => {
    expect(getPathname({ locale, href })).toBe(expected);
  });

  it("gives every route a path in every language", () => {
    for (const href of ROUTES) {
      for (const locale of locales) {
        const path = getPathname({ locale, href });
        expect(path, `${href} in ${locale}`).toMatch(new RegExp(`^/${locale}(/|$)`));
      }
    }
  });

  it("never leaves a Swedish reader on an English path, or the reverse", () => {
    // The whole point of the mapping: a Swedish URL should read as Swedish.
    expect(getPathname({ locale: "sv", href: "/book-release" })).not.toContain("book-release");
    expect(getPathname({ locale: "en", href: "/book-release" })).not.toContain("bokrelease");
    expect(getPathname({ locale: "sv", href: "/speaking" })).not.toContain("speaking");
    expect(getPathname({ locale: "en", href: "/speaking" })).not.toContain("forelasningar");
  });

  it("produces a distinct URL per language for every route", () => {
    for (const href of ROUTES) {
      const paths = locales.map((locale) => getPathname({ locale, href }));
      expect(new Set(paths).size, `${href} should differ per language`).toBe(locales.length);
    }
  });

  it("always prefixes the locale, so there is no unprefixed duplicate", () => {
    // Two URLs serving the same content would compete in search results.
    for (const href of ROUTES) {
      for (const locale of locales) {
        expect(getPathname({ locale, href }).startsWith(`/${locale}`)).toBe(true);
      }
    }
  });
});
