# Repository instructions

Personal website for Kata Nylén. Read `README.md` first, then
`docs/build-brief.md` — the brief is the source of truth for scope, tone and
constraints, and code comments reference its sections (`§10`, `§21.3`…).

## Hard rules

1. **Never invent facts about Kata.** No biography, credentials, clients,
   quotes, talks, testimonials or event details. If a fact is not in
   `src/content/facts.ts` as a confirmed value, it does not get rendered.
   Add a `TODO` sentinel instead and let `isResolved()` gate the output.
2. **No user-visible text in components.** All copy lives in
   `src/content/sv.ts` and `src/content/en.ts`. Both must change together —
   the shared type enforces it.
3. **Swedish is first-class**, not a translation of English.
4. **Never emit structured data for unconfirmed facts.** A wrong date in
   JSON-LD propagates into search results and AI answers.
5. **Marketing consent is separate, explicit and never pre-checked.**
6. Do not add analytics, embeds or third-party scripts without checking the
   cookie-consent consequences in brief §16.

## Current stage

Wireframe. Styling is intentionally minimal white/grey; behaviour,
accessibility and tests are real. Do not spend effort on visual polish until
the design pass is explicitly started — but do not regress accessibility,
semantics or reduced-motion support in the meantime.

## Before committing

```bash
npm run typecheck && npm test && npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
