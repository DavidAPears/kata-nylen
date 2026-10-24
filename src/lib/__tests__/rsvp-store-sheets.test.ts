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
  waitlistTabName: "Waitlist",
  waitingList: false,
};

/** The encoded form a tab name takes inside a Sheets A1 range URL. */
const tabRange = (tabName: string) => encodeURIComponent(`'${tabName}'`);

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
  waiting = [] as [string, number][],
  tabs = ["RSVPs", "Waitlist"],
  headers = SHEET_HEADERS as readonly string[],
  failOn,
}: {
  existing?: [string, number][];
  /** Rows already on the waiting-list tab. */
  waiting?: [string, number][];
  /** Tabs the spreadsheet currently has, so a missing one can be tested. */
  tabs?: string[];
  headers?: readonly string[] | null;
  failOn?: (url: string) => { status: number; body: string } | undefined;
} = {}) {
  const calls: { url: string; method: string; body?: unknown }[] = [];
  // Tabs the spreadsheet has, which grows when addSheet creates one.
  const live = [...tabs];

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

    // A range naming a tab that does not exist is a 400, exactly as Sheets
    // responds. This is how a missing tab is discovered.
    if (href.includes(":batchUpdate")) {
      const requests = (init?.body ? JSON.parse(init.body as string) : {}) as {
        requests?: { addSheet?: { properties?: { title?: string } } }[];
      };
      for (const request of requests.requests ?? []) {
        const title = request.addSheet?.properties?.title;
        if (title) live.push(title);
      }
      return Response.json({});
    }

    const named = live.find((title) => href.includes(tabRange(title)));
    if (href.includes("values/") && !named) {
      return new Response(
        JSON.stringify({ error: { message: "Unable to parse range" } }),
        { status: 400 },
      );
    }
    // Header probe (A1:E1)
    if (method === "GET" && href.includes("A1%3AE1")) {
      return Response.json(headers ? { values: [headers] } : {});
    }
    // Existing rows probe (C2:D), per tab.
    if (method === "GET" && href.includes("C2%3AD")) {
      const rows = href.includes(tabRange("Waitlist")) ? waiting : existing;
      return Response.json({ values: rows.map(([e, g]) => [e, String(g)]) });
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

    it("waitlists an RSVP that would exceed capacity", async () => {
      // Being over capacity is no longer a refusal. The place is gone, but
      // the person is recorded, which is the whole point of a waiting list.
      const { fetchFn } = fakeSheets({ existing: [["a@example.com", 40]] });
      const store = createSheetsStore(capped, { fetchFn, getToken });
      await expect(store.save(record)).resolves.toEqual({ status: "waitlisted" });
    });

    it("counts guests, not rows", async () => {
      const { fetchFn } = fakeSheets({
        existing: [["a@example.com", 20], ["b@example.com", 19]],
      });
      const store = createSheetsStore(capped, { fetchFn, getToken });
      // 39 existing + 2 requested = 41 > 40
      await expect(store.save({ ...record, guests: 2 })).resolves.toEqual({
        status: "waitlisted",
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


  describe("the waiting list", () => {
    const waitlisting: SheetsConfig = { ...config, waitingList: true };

    it("writes to the waiting-list tab, not the guest list", async () => {
      const { fetchFn, calls } = fakeSheets();
      const store = createSheetsStore(waitlisting, { fetchFn, getToken });

      await expect(store.save(record)).resolves.toEqual({ status: "waitlisted" });

      const appends = calls.filter((c) => c.url.includes(":append"));
      expect(appends).toHaveLength(1);
      expect(appends[0].url).toContain(encodeURIComponent("'Waitlist'"));
      expect(appends[0].url).not.toContain(encodeURIComponent("'RSVPs'"));
    });

    it("still confirms someone who already holds a place", async () => {
      /*
        The outcome worse than doing nothing: a confirmed guest submits again,
        and we quietly move them off the guest list and onto the waiting list.
        They stay a duplicate, and nothing is written anywhere.
      */
      const { fetchFn, calls } = fakeSheets({ existing: [["guest@example.com", 1]] });
      const store = createSheetsStore(waitlisting, { fetchFn, getToken });

      await expect(store.save(record)).resolves.toEqual({ status: "duplicate" });
      expect(calls.filter((c) => c.url.includes(":append"))).toHaveLength(0);
    });

    it("does not add the same person to the waiting list twice", async () => {
      const { fetchFn, calls } = fakeSheets({ waiting: [["guest@example.com", 1]] });
      const store = createSheetsStore(waitlisting, { fetchFn, getToken });

      await expect(store.save(record)).resolves.toEqual({ status: "duplicate" });
      expect(calls.filter((c) => c.url.includes(":append"))).toHaveLength(0);
    });

    it("addresses batchUpdate without a slash, as the API requires", async () => {
      // ".../{id}/:batchUpdate" 404s. It would have failed only the first time
      // the waiting list needed its tab, and the store swallows its own errors,
      // so the guest would have seen a confirmation and the row gone nowhere.
      const { fetchFn, calls } = fakeSheets({ tabs: ["RSVPs"] });
      const store = createSheetsStore(waitlisting, { fetchFn, getToken });
      await store.save(record);

      const batch = calls.find((c) => c.url.includes("batchUpdate"))!;
      expect(batch).toBeDefined();
      expect(batch.url).toContain("sheet-123:batchUpdate");
      expect(batch.url).not.toContain("sheet-123/:batchUpdate");
    });

    it("creates the waiting-list tab when the spreadsheet has none", async () => {
      // Otherwise this needs a tab added by hand with exactly the right name,
      // and a typo fails silently: the guest sees a confirmation and the row
      // goes nowhere.
      const { fetchFn, calls } = fakeSheets({ tabs: ["RSVPs"] });
      const store = createSheetsStore(waitlisting, { fetchFn, getToken });

      await expect(store.save(record)).resolves.toEqual({ status: "waitlisted" });

      const created = calls.find((c) => c.url.includes(":batchUpdate"));
      expect(created, "the waiting-list tab was never created").toBeDefined();
      expect(JSON.stringify(created!.body)).toContain("Waitlist");
    });

    it("costs no extra request when the tabs are already there", async () => {
      /*
        Creating the tab used to mean listing every tab in the spreadsheet
        before each save, an extra Google round trip to answer a question
        whose answer is almost always yes. It pushed the endpoint past five
        seconds often enough for the browser test to catch it.
      */
      const { fetchFn, calls } = fakeSheets();
      const store = createSheetsStore(config, { fetchFn, getToken });
      await store.save(record);
      expect(calls.filter((c) => c.method === "GET")).toHaveLength(2);
    });

    it("does not recreate a tab that already exists", async () => {
      const { fetchFn, calls } = fakeSheets({ tabs: ["RSVPs", "Waitlist"] });
      const store = createSheetsStore(waitlisting, { fetchFn, getToken });
      await store.save(record);
      expect(calls.find((c) => c.url.includes(":batchUpdate"))).toBeUndefined();
    });

    it("leaves the guest list alone when waiting-list mode is off", async () => {
      const { fetchFn, calls } = fakeSheets();
      const store = createSheetsStore(config, { fetchFn, getToken });
      await expect(store.save(record)).resolves.toEqual({ status: "saved" });
      const appends = calls.filter((c) => c.url.includes(":append"));
      expect(appends[0].url).toContain(encodeURIComponent("'RSVPs'"));
    });
  });

  it("quotes the tab name so names with spaces work", async () => {
    const { fetchFn, calls } = fakeSheets({ tabs: ["Book launch RSVPs"] });
    const store = createSheetsStore(
      { ...config, tabName: "Book launch RSVPs" },
      { fetchFn, getToken },
    );
    await store.save(record);
    // Not calls[0]: the first request now lists the tabs, so that a missing
    // one can be created before anything is written to it.
    const ranged = calls.find((c) => c.url.includes(encodeURIComponent("'Book launch RSVPs'")));
    expect(ranged, "no call addressed the configured tab").toBeDefined();
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
