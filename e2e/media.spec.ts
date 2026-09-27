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

  test("sits beside the portrait rather than below it", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/media");

    const nav = page.getByRole("navigation", { name: "Jump to" });
    const portrait = page.locator("main img").first();
    const navBox = (await nav.boundingBox())!;
    const imgBox = (await portrait.boundingBox())!;

    // It belongs in the gap under the copy, not in a row of its own.
    expect(navBox.x, "nav is in the left column").toBeLessThan(imgBox.x);
    expect(navBox.y, "nav is alongside the portrait, not under it")
      .toBeLessThan(imgBox.y + imgBox.height);
  });

  test("labels have no counts attached", async ({ page }) => {
    await page.goto("/en/media");
    const labels = await page
      .getByRole("navigation", { name: "Jump to" })
      .getByRole("link")
      .allInnerTexts();
    for (const label of labels) {
      expect(label.trim(), `"${label}" should be a plain label`).not.toMatch(/\d/);
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
