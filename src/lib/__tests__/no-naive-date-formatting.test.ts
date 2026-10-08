import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * No date or time may be formatted without an explicit timeZone.
 *
 * Without one, the runtime's own timezone is used. Vercel runs in UTC and this
 * project is written on a machine in Stockholm, so the two disagree by exactly
 * the hour the launch starts: the confirmation email said 16.00 while every
 * other surface said 17.00, and it looked perfectly correct in development.
 *
 * Catching the single call that caused it is not enough. This is the class of
 * bug, so this test scans the source instead: anyone adding a formatter has to
 * say which clock it belongs to.
 */

const PATTERN =
  /\.toLocaleString\(|\.toLocaleDateString\(|\.toLocaleTimeString\(|new Intl\.DateTimeFormat\(/g;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return entry === "__tests__" || entry === "node_modules" ? [] : sourceFiles(path);
    }
    return /\.(ts|tsx|mts)$/.test(entry) ? [path] : [];
  });
}

describe("date formatting", () => {
  it("always names the timezone it means", () => {
    const offenders: string[] = [];

    for (const file of [...sourceFiles("src"), ...sourceFiles("scripts")]) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(PATTERN)) {
        const start = match.index ?? 0;
        // The options object follows the call, so look at the rest of the
        // statement rather than only the matched text.
        const call = source.slice(start, start + 400);
        if (!call.includes("timeZone")) {
          const line = source.slice(0, start).split("\n").length;
          offenders.push(`${file}:${line} ${match[0]}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
