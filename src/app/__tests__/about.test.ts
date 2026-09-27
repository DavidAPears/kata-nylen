import { describe, it, expect } from "vitest";
import { en } from "@/content/en";
import { sv } from "@/content/sv";
import { routing } from "@/i18n/routing";

/**
 * The About page exists to be found and to be read. Its value is depth, so
 * these tests guard depth: thin sections would quietly turn it into the thing
 * we were trying not to build.
 */

const LOCALES = [
  ["English", en.about],
  ["Swedish", sv.about],
] as const;

describe("About page content", () => {
  it.each(LOCALES)("%s covers every subject she works on", (_label, about) => {
    // Six fields, matching the speaking themes. If one is dropped the page
    // stops describing her work.
    expect(about.fields).toHaveLength(6);
    const ids = about.fields.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(LOCALES)("%s writes each subject at real length", (_label, about) => {
    for (const field of about.fields) {
      expect(field.title.length, `${field.id} title`).toBeGreaterThan(3);
      // A one-line description is a list entry, not a page worth finding.
      expect(field.description.length, `${field.id} needs substance`).toBeGreaterThan(180);
    }
  });

  it.each(LOCALES)("%s spells out the LÄKA framework in full", (_label, about) => {
    expect(about.framework.steps).toHaveLength(5);
    const initials = about.framework.steps.map((s) => s.title[0]).join("");
    // L-Ä-K-A-S: the acronym plus Stöd at the centre.
    expect(initials).toBe("LÄKAS");
  });

  it.each(LOCALES)("%s links onward rather than dead-ending", (_label, about) => {
    const known = new Set(Object.keys(routing.pathnames));
    expect(known).toContain(about.booksCta.href);
    expect(known).toContain(about.speakingCta.href);
  });

  it("keeps the two languages structurally identical", () => {
    expect(sv.about.fields.map((f) => f.id)).toEqual(en.about.fields.map((f) => f.id));
    expect(sv.about.framework.steps.map((s) => s.title)).toEqual(
      en.about.framework.steps.map((s) => s.title),
    );
  });

  it("gives the page a description long enough to be useful in search results", () => {
    for (const [, about] of LOCALES) {
      expect(about.seo.description.length).toBeGreaterThan(120);
      expect(about.seo.description.length).toBeLessThan(320);
    }
  });

  it("claims nothing that has not been verified", () => {
    // Brief §21.3 and §11. These are the specific claims David wants to make
    // and cannot yet: they need to be true and checkable first.
    const everything = JSON.stringify([en.about, sv.about]).toLowerCase();
    for (const claim of [
      "leading climate psychologist",
      "sveriges ledande",
      "first book",
      "första boken",
      "ikea",
      "volvo",
    ]) {
      expect(everything, `unverified claim: ${claim}`).not.toContain(claim);
    }
  });

  it("is reachable from the footer but not the main navigation", () => {
    // Deliberate: it should not pollute the header, but it must be linked or
    // nothing will find it.
    expect(en.footer.aboutLabel).toBeTruthy();
    expect(sv.footer.aboutLabel).toBeTruthy();
    expect(Object.values(en.nav)).not.toContain(en.footer.aboutLabel);
  });
});
