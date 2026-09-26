import { describe, it, expect, beforeEach } from "vitest";
import { resolveSiteUrl, isIndexable } from "../site-url";

/**
 * The important case is the first one: while the site is on a vercel.app
 * address it must stay out of search results, because it carries Kata's name
 * against placeholder copy.
 */

const original = { ...process.env };

beforeEach(() => {
  process.env = { ...original };
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.SITE_INDEXABLE;
  delete process.env.NEXT_PUBLIC_SITE_URL;
});

describe("isIndexable", () => {
  it("refuses indexing on the temporary vercel.app domain", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "kata-nylen.vercel.app";
    expect(isIndexable()).toBe(false);
  });

  it("allows indexing once the real domain is attached", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com";
    expect(isIndexable()).toBe(true);
  });

  it("allows a subdomain of the real domain", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.katanylen.com";
    expect(isIndexable()).toBe(true);
  });

  it("is not fooled by a lookalike domain", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com.evil.example";
    expect(isIndexable()).toBe(false);
  });

  it("refuses preview deployments even on the real domain", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com";
    expect(isIndexable()).toBe(false);
  });

  it("refuses local development", () => {
    expect(isIndexable()).toBe(false);
  });

  it("honours an explicit override in both directions", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "kata-nylen.vercel.app";
    process.env.SITE_INDEXABLE = "true";
    expect(isIndexable()).toBe(true);

    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com";
    process.env.SITE_INDEXABLE = "false";
    expect(isIndexable()).toBe(false);
  });
});

describe("resolveSiteUrl", () => {
  it("uses the Vercel production domain when deployed", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "katanylen.com";
    expect(resolveSiteUrl()).toBe("https://katanylen.com");
  });

  it("follows the domain automatically when it changes", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "kata-nylen.vercel.app";
    expect(resolveSiteUrl()).toBe("https://kata-nylen.vercel.app");
  });

  it("falls back to localhost in development", () => {
    expect(resolveSiteUrl()).toBe("http://localhost:3000");
  });
});
