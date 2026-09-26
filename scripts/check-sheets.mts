/**
 * Google Sheets connection check.
 *
 * Run: npm run check:sheets
 *
 * Walks the setup one step at a time and says exactly which step failed and
 * how to fix it, instead of leaving you with a bare 403 from the API. Uses the
 * real adapter, so a pass here means the RSVP route will work.
 *
 * It writes one test row and then tells you to delete it, rather than deleting
 * it automatically: proving the write worked is the entire point, and silently
 * removing it would leave you unsure whether it ever happened.
 */
import { createRequire } from "node:module";
import { JWT } from "google-auth-library";

// @next/env is CommonJS, so it is required rather than imported. It applies
// Next's own .env precedence rules, so this script sees exactly the same
// values the running app would.
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true, { info: () => {}, error: console.error });

const { sheetsConfigFromEnv, createSheetsStore } = await import(
  "../src/lib/rsvp-store-sheets"
);

const tick = "✓";
const cross = "✗";
const pass = (msg: string) => console.log(`  ${tick} ${msg}`);
const fail = (msg: string, fix?: string) => {
  console.log(`  ${cross} ${msg}`);
  if (fix) console.log(`\n    Fix: ${fix}\n`);
};

console.log("\nGoogle Sheets RSVP check\n");

// ── 1. Configuration ──────────────────────────────────────────────────────
const config = sheetsConfigFromEnv();

if (!config) {
  fail(
    "Environment variables are not set.",
    "Add GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and\n" +
      "    GOOGLE_PRIVATE_KEY to .env.local. See docs/google-sheets-setup.md.\n\n" +
      "    Without these the site still works: RSVPs are logged and emailed\n" +
      "    instead of written to a sheet.",
  );
  process.exit(1);
}

pass(`Spreadsheet id: ${config.spreadsheetId}`);
pass(`Service account: ${config.clientEmail}`);
pass(`Tab name: ${config.tabName}`);
if (config.capacity !== undefined) pass(`Capacity: ${config.capacity} places`);

// ── 2. Private key shape ──────────────────────────────────────────────────
if (!config.privateKey.includes("BEGIN PRIVATE KEY")) {
  fail(
    "GOOGLE_PRIVATE_KEY does not look like a private key.",
    "Copy the whole `private_key` value from the service account JSON,\n" +
      "    including the BEGIN/END lines, in double quotes.",
  );
  process.exit(1);
}
if (!config.privateKey.includes("\n")) {
  fail(
    "GOOGLE_PRIVATE_KEY has no line breaks.",
    "Keep the literal \\n sequences from the JSON file. In .env.local:\n" +
      '    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"',
  );
  process.exit(1);
}
pass("Private key looks well formed");

// ── 3. Authentication ─────────────────────────────────────────────────────
let token: string;
try {
  const client = new JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const credentials = await client.authorize();
  token = credentials.access_token ?? "";
  if (!token) throw new Error("no access token returned");
  pass("Authenticated with Google");
} catch (cause) {
  const message = cause instanceof Error ? cause.message : String(cause);
  fail(
    `Could not authenticate: ${message}`,
    message.includes("invalid_grant") || message.includes("DECODER")
      ? "The private key is malformed. Re-copy it from the JSON file, keeping\n" +
        "    the \\n sequences and wrapping the value in double quotes."
      : "Check GOOGLE_SERVICE_ACCOUNT_EMAIL matches `client_email` in the JSON.",
  );
  process.exit(1);
}

// ── 4. Reading the sheet ──────────────────────────────────────────────────
const base = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`;
const meta = await fetch(`${base}?fields=properties.title,sheets.properties.title`, {
  headers: { Authorization: `Bearer ${token}` },
});

if (!meta.ok) {
  const body = await meta.text();
  fail(
    `Could not open the spreadsheet (${meta.status}).`,
    meta.status === 403
      ? body.includes("has not been used") || body.includes("disabled")
        ? "Enable the Google Sheets API for your project:\n" +
          "    console.cloud.google.com -> APIs & Services -> Library -> Google Sheets API"
        : `Share the sheet with the service account as an Editor:\n    ${config.clientEmail}`
      : meta.status === 404
        ? "GOOGLE_SHEETS_SPREADSHEET_ID is wrong. It is the long id in the sheet\n" +
          "    URL: docs.google.com/spreadsheets/d/<THIS PART>/edit"
        : body.slice(0, 300),
  );
  process.exit(1);
}

const info = (await meta.json()) as {
  properties: { title: string };
  sheets: { properties: { title: string } }[];
};
pass(`Opened spreadsheet: "${info.properties.title}"`);

const tabs = info.sheets.map((s) => s.properties.title);
if (!tabs.includes(config.tabName)) {
  fail(
    `No tab named "${config.tabName}". Found: ${tabs.map((t) => `"${t}"`).join(", ")}`,
    `Rename a tab to "${config.tabName}", or set GOOGLE_SHEETS_TAB_NAME to one\n` +
      "    of the names above.",
  );
  process.exit(1);
}
pass(`Found tab: "${config.tabName}"`);

// ── 5. Writing a real RSVP through the adapter ────────────────────────────
const store = createSheetsStore(config);
const stamp = new Date().toISOString();

try {
  const result = await store.save({
    name: "CONNECTION TEST (delete me)",
    email: `connection-test+${Date.now()}@example.com`,
    guests: 1,
    marketingConsent: false,
    website: "",
    submittedAt: stamp,
    dedupeKey: `connection-test+${Date.now()}@example.com`,
  });

  if (result.status === "saved") {
    pass("Wrote a test row");
  } else if (result.status === "full") {
    fail(
      "The sheet reports the event as full.",
      "RSVP_CAPACITY is set below the number of places already recorded.",
    );
    process.exit(1);
  } else {
    fail(`Unexpected result: ${result.status}`);
    process.exit(1);
  }
} catch (cause) {
  const message = cause instanceof Error ? cause.message : String(cause);
  fail(
    `Could not write to the sheet: ${message}`,
    message.includes("403")
      ? `Share the sheet with the service account as an EDITOR (not Viewer):\n    ${config.clientEmail}`
      : message.slice(0, 300),
  );
  process.exit(1);
}

console.log(`
All checks passed. RSVPs will be written to the sheet.

  https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit

One test row named "CONNECTION TEST (delete me)" was added. Delete it now.
`);
