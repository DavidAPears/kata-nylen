import { test, expect, type Page } from "@playwright/test";

/**
 * Every public page, at every width that matters, must not scroll sideways.
 *
 * 320 is the narrowest phone still in real use; 390 is a current iPhone; 768
 * and 1024 are iPad portrait and landscape — Kata uses an iPad, and the launch
 * invitation will mostly be opened on phones.
 */

const PATHS = [
  "/sv",
  "/en",
  "/sv/bokrelease",
  "/en/book-release",
  "/sv/forelasningar",
  "/en/speaking",
  "/sv/kontakt",
  "/en/contact",
  "/sv/integritetspolicy",
  "/en/privacy",
];

const WIDTHS = [
  { name: "small phone", width: 320, height: 800 },
  { name: "phone", width: 390, height: 844 },
  { name: "iPad portrait", width: 768, height: 1024 },
  { name: "iPad landscape", width: 1024, height: 768 },
];

/** Returns any element whose right edge escapes the viewport. */
async function overflowingElements(page: Page) {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    return [...document.querySelectorAll("body *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return false;
        if (rect.right <= viewport + 1) return false;
        // Elements clipped by an ancestor (the honeypot lives inside a 1px
        // overflow:hidden wrapper) do not actually widen the page.
        return !el.closest(".sr-only");
      })
      .map((el) => `${el.tagName}.${el.className} → ${Math.round(el.getBoundingClientRect().right)}px`);
  });
}

for (const viewport of WIDTHS) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PATHS) {
      test(`${path} does not scroll horizontally`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        const offenders = await overflowingElements(page);
        expect(offenders, `elements escaping the viewport on ${path}`).toEqual([]);

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth, `${path} is wider than the viewport`).toBeLessThanOrEqual(
          clientWidth,
        );
      });
    }
  });
}

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the RSVP form can be completed on a phone", async ({ page }) => {
    // The path a WhatsApp recipient actually takes.
    await page.goto("/sv/bokrelease");

    // Scoped by role: the consent checkbox's label also contains "e-post".
    await page.getByRole("textbox", { name: "Namn" }).fill("Test Gäst");
    await page.getByRole("textbox", { name: "E-post" }).fill("gast@example.com");
    await page.getByRole("button", { name: "Anmäl mig" }).click();

    await expect(page.getByRole("status")).toContainText("Du står på listan.");
  });

  test("every nav destination is reachable without horizontal scrolling", async ({
    page,
  }) => {
    await page.goto("/sv");
    for (const label of ["Bokrelease", "Föreläsningar", "Kontakt"]) {
      await page.getByRole("navigation", { name: "Meny" }).getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(/\/sv\//);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      await page.goto("/sv");
    }
  });

  test("interactive controls meet the 24px minimum touch target", async ({ page }) => {
    await page.goto("/sv/bokrelease");

    const undersized = await page.evaluate(() => {
      return [...document.querySelectorAll("a, button, select, textarea")]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          // Links inside running text are exempt under WCAG 2.5.8.
          return rect.width > 0 && rect.height < 24 && !el.closest("p") && !el.closest(".sr-only");
        })
        .map((el) => `${el.tagName}: ${(el.textContent ?? "").trim().slice(0, 30)}`);
    });

    expect(undersized).toEqual([]);
  });
});
