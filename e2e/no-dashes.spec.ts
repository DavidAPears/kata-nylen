import { test, expect } from "@playwright/test";

/**
 * No em or en dashes anywhere a visitor can read them.
 *
 * The unit test covers the content files; this covers what actually reaches
 * the page, including copy written inline in a component, placeholder values,
 * and the <title> shown in the browser tab and search results.
 */

const PATHS = [
  "/sv",
  "/en",
  "/sv/bokrelease",
  "/en/book-release",
  "/sv/publikationer",
  "/en/publications",
  "/sv/forelasningar",
  "/en/speaking",
  "/sv/kontakt",
  "/en/contact",
  "/sv/integritetspolicy",
  "/en/privacy",
];

for (const path of PATHS) {
  test(`${path} renders no em or en dashes`, async ({ page }) => {
    await page.goto(path);

    const title = await page.title();
    expect(title, `<title> on ${path}`).not.toMatch(/[—–]/);

    // Walk visible text nodes and report the sentence each offender sits in,
    // so a failure names the copy to fix rather than just the page.
    const offenders = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const found: string[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent ?? "";
        if (!/[—–]/.test(text)) continue;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style")) continue;
        found.push(text.trim().slice(0, 120));
      }
      return found;
    });

    expect(offenders, `visible text on ${path}`).toEqual([]);
  });
}
