/**
 * Content audit: what is still unconfirmed in `src/content/facts.ts`.
 *
 * Run: npm run check:content
 *
 * The site never invents a fact. Anything still set to the TODO sentinel is
 * hidden from visitors and listed here instead, so this is the standing answer
 * to "what do we still need from Kata". Part B of LAUNCH-BLOCKERS.md is the
 * same list written out in prose.
 *
 * Exits 0 either way. It reports, it does not gate: shipping with facts still
 * outstanding is the normal state of this project, not a failure.
 */
const { outstandingFacts } = await import("../src/content/facts");

const missing = outstandingFacts();

if (missing.length === 0) {
  console.log("\nEverything in facts.ts is confirmed. Nothing outstanding.\n");
} else {
  const count = missing.length;
  console.log(`\n${count} unconfirmed ${count === 1 ? "fact" : "facts"}:\n`);
  for (const item of missing) console.log(`  - ${item}`);
  console.log(
    "\nThese are hidden from the site until they are filled in.\n" +
      "See LAUNCH-BLOCKERS.md Part B, and docs/build-brief.md section 23.\n",
  );
}
