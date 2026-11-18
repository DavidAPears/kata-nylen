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
  "/sv/psykologisk-resiliens",
  "/en/psychological-resilience",
  "/sv/publikationer",
  "/en/publications",
  "/sv/forelasningar",
  "/en/speaking",
  "/sv/kontakt",
  "/en/contact",
  "/sv/media",
  "/en/media",
  "/sv/om-kata",
  "/en/about",
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

test.describe("desktop nav", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("shows all six links and the flags", async ({ page }) => {
    // Six since "I media" joined the menu in November.
    await page.goto("/sv");
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Meny" });
    expect(await nav.getByRole("link").all()).toHaveLength(6);

    const switcher = page.getByRole("banner").getByRole("navigation", { name: "Byt språk" });
    await expect(switcher.locator("svg").first()).toBeVisible();
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  /*
    The RSVP walkthrough lived here until 16 November 2026, when the launch was
    over and the page became a page about the book. There is no form on the
    site to drive any more.

    RsvpForm, the API route, the Sheets store and the waiting list are all
    still covered by unit tests and all still work. Restore this test, pointed
    at whichever page carries the form, when Kata next runs an event.

    It also wrote a live row to the attendee sheet on every local run, which
    is a second reason not to leave it pointed at nothing.
  */

  test("every nav destination is reachable without horizontal scrolling", async ({
    page,
  }) => {
    await page.goto("/sv");
    for (const label of ["Psykologisk resiliens", "I media", "Föreläsningar", "Kontakt"]) {
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

  test("the nav fits the phone without overflowing, even on two rows", async ({
    page,
  }) => {
    /*
      Home is hidden on a phone because the wordmark links home.

      This used to require a single row, and four links fitted: measured at
      371px for five against 350px available, and about 337px for four. In
      November Kata renamed "Boken" to "Psykologisk resiliens" and asked for
      "I media" in the menu, which together need roughly 490px. One row was no
      longer possible without a hamburger, so the nav wraps to two.

      What still matters is that nothing runs off the side, so that is what is
      asserted. Two rows is the budget: a third means the nav has outgrown
      this pattern and needs a real menu.
    */
    await page.goto("/sv");
    const nav = page.getByRole("navigation", { name: "Meny" });
    const links = await nav.getByRole("link").all();
    expect(links, "Home is hidden on mobile").toHaveLength(5);

    const viewport = await page.evaluate(() => document.documentElement.clientWidth);
    const tops = new Set<number>();
    for (const link of links) {
      const box = (await link.boundingBox())!;
      expect(box.x + box.width, "nav link stays inside the viewport")
        .toBeLessThanOrEqual(viewport + 1);
      tops.add(Math.round(box.y));
    }
    expect(tops.size, "nav uses at most two rows at 390px").toBeLessThanOrEqual(2);
  });

  test("the wordmark still leads home once Home is hidden", async ({ page }) => {
    // Removing a nav item is only safe because this remains.
    await page.goto("/sv/publikationer");
    await page.getByRole("banner").getByRole("link", { name: "Kata Nylén" }).click();
    await expect(page).toHaveURL(/\/sv$/);
  });

  test("the language switcher reads as text, with flags hidden", async ({ page }) => {
    await page.goto("/sv");
    // Scope to the header: the footer has its own switcher.
    const switcher = page.getByRole("banner").getByRole("navigation", { name: "Byt språk" });
    await expect(switcher.getByRole("link", { name: "en" })).toBeVisible();
    // The flags are still in the DOM for wider screens, just not shown here.
    expect(await switcher.locator("svg").count()).toBeGreaterThan(0);
    await expect(switcher.locator("svg").first()).toBeHidden();
  });

  test("no text is painted outside its own container", async ({ page }) => {
    /*
      A scrollWidth check misses text that overflows inside a clipped parent:
      the box reports the right size while the glyphs paint past it and are
      cut off. Measuring the text range catches that.
    */
    for (const path of ["/sv/psykologisk-resiliens", "/en/psychological-resilience", "/sv", "/en"]) {
      await page.goto(path);
      const clipped = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of document.querySelectorAll("main p, main h1, main h2, main h3")) {
          if (!el.firstChild || !el.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(el);
          const text = range.getBoundingClientRect();
          const box = el.getBoundingClientRect();
          // A couple of px of tolerance for antialiasing and italic overhang.
          if (text.width > box.width + 3) {
            bad.push(`${el.tagName}: "${el.textContent.trim().slice(0, 40)}"`);
          }
        }
        return bad;
      });
      expect(clipped, `text painted outside its container on ${path}`).toEqual([]);
    }
  });

  test("interactive controls meet the 24px minimum touch target", async ({ page }) => {
    await page.goto("/sv/psykologisk-resiliens");

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
