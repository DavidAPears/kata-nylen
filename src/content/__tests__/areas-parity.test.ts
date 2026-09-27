import { describe, it, expect } from "vitest";
import { en } from "../en";
import { sv } from "../sv";

/**
 * The same six fields describe Kata's work in three places: the home page,
 * the speaking page and the About page. They drifted once already, with the
 * home page still showing five after a sixth was added elsewhere.
 */

describe("areas of work stay in step across the site", () => {
  it.each([
    ["English", en],
    ["Swedish", sv],
  ])("%s lists the same ids on home, speaking and about", (_label, content) => {
    const home = content.home.areasOfWork.topics.map((t) => t.id).sort();
    const speaking = content.speaking.themes.topics.map((t) => t.id).sort();
    const about = content.about.fields.map((f) => f.id).sort();

    expect(home).toEqual(about);
    expect(speaking).toEqual(about);
  });

  it.each([
    ["English", en],
    ["Swedish", sv],
  ])("%s says how many fields there are, and is right", (_label, content) => {
    const count = content.home.areasOfWork.topics.length;
    expect(count).toBe(6);
    // The intro states the number in words; a stale number is exactly the bug
    // this file exists to catch.
    const written = content.locale === "sv" ? "Sex" : "Six";
    expect(content.home.areasOfWork.intro.startsWith(written)).toBe(true);
  });

  it("keeps the two languages aligned", () => {
    expect(sv.home.areasOfWork.topics.map((t) => t.id)).toEqual(
      en.home.areasOfWork.topics.map((t) => t.id),
    );
  });
});
