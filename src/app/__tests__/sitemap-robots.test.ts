import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * The sitemap and robots.txt are how the site tells search engines what exists
 * and whether to index it. While the site lives on a vercel.app address it
 * must stay out of Google: it carries Kata's name against unfinished copy.
 */

const original = { ...process.env };
beforeEach(() => {
  process.env = { ...original };
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.SITE_INDEXABLE;
  vi.resetModules();
});
afterEach(() => {
  process.env = { ...original };
});

async function loadRobots() {
  return (await import("../robots")).default;
}
async function loadSitemap() {
  return (await import("../sitemap")).default;
}

describe("robots.txt", () => {
  it("blocks every crawler on the temporary domain", async () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "kata-nylen.vercel.app";
    const rules = (await loadRobots())().rules as { disallow?: string };
    expect(rules.disallow).toBe("/");
  });

  it("opens up once the real domain is attached", async () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com";
    const robots = (await loadRobots())();
    const rules = robots.rules as { allow?: string; disallow?: string | string[] };
    expect(rules.allow).toBe("/");
    expect(rules.disallow).toContain("/api/");
    expect(robots.sitemap).toBe("https://katanylen.com/sitemap.xml");
  });

  it("blocks crawlers during local development", async () => {
    const rules = (await loadRobots())().rules as { disallow?: string };
    expect(rules.disallow).toBe("/");
  });
});

describe("sitemap", () => {
  beforeEach(() => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com";
  });

  it("lists every public page in both languages", async () => {
    const entries = (await loadSitemap())();
    const urls = entries.map((e) => e.url);

    for (const path of [
      "/sv", "/sv/bokrelease", "/sv/publikationer", "/sv/forelasningar",
      "/sv/kontakt", "/sv/integritetspolicy",
      "/en", "/en/book-release", "/en/publications", "/en/speaking",
      "/en/contact", "/en/privacy",
    ]) {
      expect(urls, `sitemap should list ${path}`).toContain(`https://katanylen.com${path}`);
    }
  });

  it("uses the localised URL for each language, not the internal route", async () => {
    const urls = (await loadSitemap())().map((e) => e.url);
    // A Swedish reader should never be pointed at /sv/book-release.
    expect(urls).not.toContain("https://katanylen.com/sv/book-release");
    expect(urls).not.toContain("https://katanylen.com/en/bokrelease");
  });

  it("declares language alternates, so the two versions are not duplicates", async () => {
    const home = (await loadSitemap())().find((e) => e.url === "https://katanylen.com/sv");
    const languages = home?.alternates?.languages ?? {};
    expect(languages.sv).toBe("https://katanylen.com/sv");
    expect(languages.en).toBe("https://katanylen.com/en");
    expect(languages["x-default"]).toBeTruthy();
  });

  it("gives the book release page more weight than the rest", async () => {
    const entries = (await loadSitemap())();
    const release = entries.find((e) => e.url.endsWith("/sv/bokrelease"))!;
    const privacy = entries.find((e) => e.url.endsWith("/sv/integritetspolicy"))!;
    expect(release.priority!).toBeGreaterThan(privacy.priority!);
  });

  it("emits no duplicate URLs", async () => {
    const urls = (await loadSitemap())().map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
