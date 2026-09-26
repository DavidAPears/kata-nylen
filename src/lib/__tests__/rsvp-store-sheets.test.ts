import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSheetsStore,
  sheetsConfigFromEnv,
  SHEET_HEADERS,
  type SheetsConfig,
} from "../rsvp-store-sheets";
import type { RsvpRecord } from "../rsvp-store";

const config: SheetsConfig = {
  spreadsheetId: "sheet-123",
  clientEmail: "svc@project.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nfake\n-----END PRIVATE KEY-----",
  tabName: "RSVPs",
};

const record: RsvpRecord = {
  name: "Guest",
  email: "Guest@Example.com",
  guests: 1,
  marketingConsent: false,
  website: "",
  submittedAt: "2026-04-01T10:00:00.000Z",
  dedupeKey: "guest@example.com",
};

/**
 * Fakes the two Sheets endpoints we use. `existing` seeds the email/guest
 * columns; `calls` records every request so tests can assert on what was sent.
 */
function fakeSheets({
  existing = [] as [string, number][],
  headers = SHEET_HEADERS as readonly string[],
  failOn,
}: {
  existing?: [string, number][];
  headers?: readonly string[] | null;
  failOn?: (url: string) => { status: number; body: string } | undefined;
} = {}) {
  const calls: { url: string; method: string; body?: unknown }[] = [];

  const fetchFn = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const href = String(url);
    const method = init?.method ?? "GET";
    calls.push({
      url: href,
      method,
      body: init?.body ? JSON.parse(init.body as string) : undefined,
    });

    const failure = failOn?.(href);
    if (failure) {
      return new Response(failure.body, { status: failure.status });
    }

    // Header probe (A1:E1)
    if (method === "GET" && href.includes("A1%3AE1")) {
      return Response.json(headers ? { values: [headers] } : {});
    }
    // Existing rows probe (C2:D)
    if (method === "GET" && href.includes("C2%3AD")) {
      return Response.json({ values: existing.map(([e, g]) => [e, String(g)]) });
    }
    return Response.json({});
  }) as unknown as typeof fetch;

  return { fetchFn, calls };
}

const getToken = async () => "fake-token";

describe("createSheetsStore", () => {
  it("reports itself as a durable store", () => {
    const { fetchFn } = fakeSheets();
    const store = createSheetsStore(config, { fetchFn, getToken });
    expect(store.durable).toBe(true);
    expect(store.name).toBe("google-sheets");
  });

  it("appends a new RSVP as a row", async () => {
    const { fetchFn, calls } = fakeSheets();
    const store = createSheetsStore(config, { fetchFn, getToken });

    await expect(store.save(record)).resolves.toEqual({ status: "saved" });

    const append = calls.find((c) => c.url.includes(":append"));
    expect(append).toBeDefined();
    expect((append!.body as { values: unknown[][] }).values[0]).toEqual([
      "2026-04-01T10:00:00.000Z",
      "Guest",
      "Guest@Example.com",
      1,
      "no",
    ]);
  });

  it("records marketing consent as a readable yes/no", async () => {
    const { fetchFn, calls } = fakeSheets();
    const store = createSheetsStore(config, { fetchFn, getToken });

    await store.save({ ...record, marketingConsent: true });

    const append = calls.find((c) => c.url.includes(":append"));
    expect((append!.body as { values: unknown[][] }).values[0][4]).toBe("yes");
  });

  it("authenticates every request with a bearer token", async () => {
    const fetchFn = vi.fn(async () => Response.json({})) as unknown as typeof fetch;
    const store = createSheetsStore(config, { fetchFn, getToken });
    await store.save(record).catch(() => {});

    const init = vi.mocked(fetchFn).mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer fake-token",
    );
  });

  it("treats a repeat email as a duplicate, case-insensitively", async () => {
    const { fetchFn, calls } = fakeSheets({ existing: [["guest@example.com", 1]] });
    const store = createSheetsStore(config, { fetchFn, getToken });

    await expect(store.save(record)).resolves.toEqual({ status: "duplicate" });
    // Nothing was appended.
    expect(calls.some((c) => c.url.includes(":append"))).toBe(false);
  });

  it("writes the header row when the sheet is empty", async () => {
    const { fetchFn, calls } = fakeSheets({ headers: null });
    const store = createSheetsStore(config, { fetchFn, getToken });

    await store.save(record);

    const put = calls.find((c) => c.method === "PUT");
    expect(put).toBeDefined();
    expect((put!.body as { values: string[][] }).values[0]).toEqual([...SHEET_HEADERS]);
  });

  it("does not rewrite headers when they already exist", async () => {
    const { fetchFn, calls } = fakeSheets();
    const store = createSheetsStore(config, { fetchFn, getToken });

    await store.save(record);

    expect(calls.some((c) => c.method === "PUT")).toBe(false);
  });

  it("only probes for headers once per process", async () => {
    const { fetchFn, calls } = fakeSheets();
    const store = createSheetsStore(config, { fetchFn, getToken });

    await store.save(record);
    await store.save({ ...record, email: "other@example.com", dedupeKey: "other@example.com" });

    expect(calls.filter((c) => c.url.includes("A1%3AE1"))).toHaveLength(1);
  });

  describe("capacity", () => {
    const capped: SheetsConfig = { ...config, capacity: 40 };

    it("accepts an RSVP that fits", async () => {
      const { fetchFn } = fakeSheets({ existing: [["a@example.com", 39]] });
      const store = createSheetsStore(capped, { fetchFn, getToken });
      await expect(store.save(record)).resolves.toEqual({ status: "saved" });
    });

    it("refuses an RSVP that would exceed capacity", async () => {
      const { fetchFn } = fakeSheets({ existing: [["a@example.com", 40]] });
      const store = createSheetsStore(capped, { fetchFn, getToken });
      await expect(store.save(record)).resolves.toEqual({ status: "full" });
    });

    it("counts guests, not rows", async () => {
      const { fetchFn } = fakeSheets({
        existing: [["a@example.com", 20], ["b@example.com", 19]],
      });
      const store = createSheetsStore(capped, { fetchFn, getToken });
      // 39 existing + 2 requested = 41 > 40
      await expect(store.save({ ...record, guests: 2 })).resolves.toEqual({
        status: "full",
      });
    });

    it("ignores capacity when it is not configured", async () => {
      const { fetchFn } = fakeSheets({ existing: [["a@example.com", 9999]] });
      const store = createSheetsStore(config, { fetchFn, getToken });
      await expect(store.save(record)).resolves.toEqual({ status: "saved" });
    });
  });

  it("throws with a readable message when the API rejects the call", async () => {
    const { fetchFn } = fakeSheets({
      failOn: (url) =>
        url.includes("C2%3AD")
          ? { status: 403, body: '{"error":"caller lacks permission"}' }
          : undefined,
    });
    const store = createSheetsStore(config, { fetchFn, getToken });

    // The route wraps this — see `saveRsvp` — so the visitor still gets their
    // place. The message needs to be diagnosable in the logs.
    await expect(store.save(record)).rejects.toThrow(/403/);
    await expect(store.save(record)).rejects.toThrow(/caller lacks permission/);
  });

  it("quotes the tab name so names with spaces work", async () => {
    const { fetchFn, calls } = fakeSheets();
    const store = createSheetsStore(
      { ...config, tabName: "Book launch RSVPs" },
      { fetchFn, getToken },
    );
    await store.save(record);
    expect(calls[0].url).toContain(encodeURIComponent("'Book launch RSVPs'!"));
  });
});

describe("sheetsConfigFromEnv", () => {
  const original = { ...process.env };
  beforeEach(() => {
    process.env = { ...original };
    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_PRIVATE_KEY;
    delete process.env.GOOGLE_SHEETS_TAB_NAME;
    delete process.env.RSVP_CAPACITY;
  });

  it("returns null when nothing is configured", () => {
    expect(sheetsConfigFromEnv()).toBeNull();
  });

  it("returns null when the configuration is incomplete", () => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "abc";
    expect(sheetsConfigFromEnv()).toBeNull();
  });

  it("unescapes the literal \\n sequences in the private key", () => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "abc";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "svc@example.iam.gserviceaccount.com";
    process.env.GOOGLE_PRIVATE_KEY = "line1\\nline2";

    // This is the single most common cause of "invalid_grant" when deploying:
    // env vars cannot carry real newlines, so the key arrives escaped.
    expect(sheetsConfigFromEnv()!.privateKey).toBe("line1\nline2");
  });

  it("defaults the tab name to RSVPs", () => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "abc";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "svc@example.iam.gserviceaccount.com";
    process.env.GOOGLE_PRIVATE_KEY = "key";
    expect(sheetsConfigFromEnv()!.tabName).toBe("RSVPs");
  });

  it("reads an optional capacity", () => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "abc";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "svc@example.iam.gserviceaccount.com";
    process.env.GOOGLE_PRIVATE_KEY = "key";
    process.env.RSVP_CAPACITY = "60";
    expect(sheetsConfigFromEnv()!.capacity).toBe(60);
  });

  it("ignores a non-numeric capacity rather than capping at NaN", () => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "abc";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "svc@example.iam.gserviceaccount.com";
    process.env.GOOGLE_PRIVATE_KEY = "key";
    process.env.RSVP_CAPACITY = "lots";
    expect(sheetsConfigFromEnv()!.capacity).toBeUndefined();
  });
});
