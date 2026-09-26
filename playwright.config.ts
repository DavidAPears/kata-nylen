import { defineConfig, devices } from "@playwright/test";

/**
 * Layout regression tests.
 *
 * These exist because the book-release link gets shared over WhatsApp, so most
 * visitors meet this site on a phone. A single overflowing element there breaks
 * the whole page, and it is exactly the kind of bug that creeps back in
 * silently during a design pass.
 *
 * Browser note: Playwright cannot install its bundled Chromium on macOS 12, so
 * locally we drive the system Chrome via `channel`. CI runs on Linux where the
 * bundled browser installs normally.
 */
const useSystemChrome = process.platform === "darwin" && !process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    ...(useSystemChrome ? { channel: "chrome" } : {}),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // Dev rather than production on purpose: dev additionally renders the
        // TODO placeholders, whose long unbreakable code strings are a genuine
        // overflow risk. Testing dev is a superset of testing production.
        // Next 16 permits only one dev server per project directory, so we
        // reuse one if it is already running rather than starting a second.
        command: "npm run dev",
        url: "http://localhost:3000/sv",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
