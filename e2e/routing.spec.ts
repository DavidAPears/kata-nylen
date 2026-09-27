import { test, expect } from "@playwright/test";

/**
 * Paths that are not locales must 404 cleanly.
 *
 * Browsers and extensions request things like /sw.js and /favicon.ico
 * unprompted. Those match the /[locale] segment with a nonsense locale, and
 * because pages render concurrently with layouts, the page ran before the
 * layout's notFound() could stop it and crashed on undefined content. The
 * server log filled with TypeErrors on an otherwise healthy site.
 */

const NOT_LOCALES = ["/sw.js", "/favicon.ico", "/manifest.json", "/apple-touch-icon.png"];

for (const path of NOT_LOCALES) {
  test(`${path} 404s without a server error`, async ({ request }) => {
    // request, not page.goto: these are not HTML documents, and navigating to
    // a bodyless 404 does not reliably produce a response object.
    const response = await request.get(path);
    // A 500 here means a page rendered with a bad locale again.
    expect(response.status(), `${path} must not 500`).toBe(404);
  });
}

test("an unknown locale does not render a page", async ({ request }) => {
  expect((await request.get("/de")).status()).toBe(404);
});

test("the real locales still work", async ({ request }) => {
  for (const path of ["/sv", "/en", "/sv/publikationer", "/en/publications"]) {
    expect((await request.get(path)).status(), `${path} should be 200`).toBe(200);
  }
});
