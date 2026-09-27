import { test, expect } from "@playwright/test";

/**
 * The media page is long and sectioned, so the jump links are how someone
 * finds the kind of coverage they came for.
 */

test.describe("media jump links", () => {
  test("every link points at a section that exists", async ({ page }) => {
    await page.goto("/en/media");
    const links = page.getByRole("navigation", { name: "Jump to" }).getByRole("link");
    const hrefs = await links.evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute("href")),
    );

    expect(hrefs.length).toBe(5);
    for (const href of hrefs) {
      const id = href!.replace("#", "");
      // A jump link to a missing id silently does nothing.
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("clicking one scrolls to its section", async ({ page }) => {
    await page.goto("/en/media");
    await page.getByRole("navigation", { name: "Jump to" })
      .getByRole("link", { name: /Podcasts/ })
      .click();

    await expect(page).toHaveURL(/#podcast$/);
    const top = await page.locator("#podcast").evaluate((el) => el.getBoundingClientRect().top);
    expect(top, "the podcast section is in view").toBeLessThan(200);
  });

  test("counts match the number of items in each section", async ({ page }) => {
    await page.goto("/en/media");
    const nav = page.getByRole("navigation", { name: "Jump to" });

    for (const kind of ["tv", "radio", "print", "podcast", "web"]) {
      const shown = await nav.locator(`a[href="#${kind}"] span span`).last().innerText();
      const actual = await page.locator(`#${kind} li`).count();
      expect(Number(shown), `${kind} count`).toBe(actual);
    }
  });

  test("the icons are hidden from assistive technology", async ({ page }) => {
    await page.goto("/en/media");
    const icons = page.getByRole("navigation", { name: "Jump to" }).locator("svg");
    expect(await icons.count()).toBe(5);
    for (let i = 0; i < 5; i++) {
      // The label sits right beside each icon; naming it twice is noise.
      await expect(icons.nth(i)).toHaveAttribute("aria-hidden", "true");
    }
  });
});
