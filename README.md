# katanylen.com

Personal website for Kata Nylén — psychologist, author and speaker.

Bilingual (Swedish + English) MVP: **Home · Book Release · Speaking · Contact**.
The full brief lives in [`docs/build-brief.md`](docs/build-brief.md); section
references in the code (`§10`, `§21.3`…) point at it.

> **Current stage: wireframe.** Structure, behaviour, accessibility and tests
> are real. The visual design is deliberately white/grey and gets layered on
> afterwards — see [Design stage](#design-stage).

## Getting started

```bash
npm install
npm run dev
```

No environment variables are needed to run locally. Emails are logged to the
console instead of being sent, so the RSVP and contact flows work end to end
with no credentials.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Vitest suite |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## How it's put together

| Concern | Where | Notes |
| --- | --- | --- |
| Routing + i18n | `src/i18n/`, `src/proxy.ts` | next-intl with localised pathnames |
| Copy | `src/content/{sv,en}.ts` | Typed; both languages share one type |
| Unverified facts | `src/content/facts.ts` | **Everything Kata still owes us** |
| Forms | `src/components/*Form.tsx` | Client components, progressive errors |
| Server routes | `src/app/api/` | Validation, honeypot, rate limit |
| Calendar | `src/lib/ics.ts` | `.ics` + Google link, no API key |

### Copy lives in two typed files

`src/content/sv.ts` and `src/content/en.ts` both satisfy the `SiteContent` type
in `src/content/types.ts`. Adding a string to one language and forgetting the
other is a **type error**, not a production surprise. Tests additionally assert
structural parity and that no string is empty.

No component contains user-visible text. To change wording, edit those two
files only.

> ⚠️ The Swedish copy is a **draft written for scaffolding** and has not been
> reviewed by a native speaker. Kata should read `src/content/sv.ts` end to end.
> Swedish is a first-class language here (brief §21.5), not a translation.

### Facts are quarantined

Brief §21.3 forbids inventing biography, credentials, quotes, talks,
testimonials or event details. So every unverified fact sits in
`src/content/facts.ts` behind a `TODO` sentinel, and the code checks
`isResolved()` before rendering.

The consequence is deliberate: **an unconfirmed fact cannot be published.**
Until the event date is filled in, the book-release page shows em-dashes, the
`Event` structured data is not emitted, and `/api/calendar` returns 404 rather
than generating a calendar entry with a made-up date.

Run the dev server and look at the footer — it lists everything still
outstanding, with the exact key to fill in. That panel renders only in
development.

### RSVP storage is not decided yet

`src/lib/rsvp-store.ts` defines the interface the rest of the app talks to.
The current adapter logs the submission and relies on the notification email
as the record — it does **not** claim to persist anything durably.

Swapping in real storage is a change to that one file. Options considered:

| | Kata can see the list | Export | Setup |
| --- | --- | --- | --- |
| **Google Sheet** (service account) | Yes, live | Native | Moderate |
| Postgres (Neon/Vercel) | Only via a UI we'd build | We'd build it | Easy code |
| Email only | Inbox only | No | Trivial |

**Google Calendar auto-invite was considered and rejected**: it requires
invite-first OAuth flows, and every attendee on a Calendar event can see every
other attendee's email address — a GDPR problem for a public signup form. The
useful half of the idea ("add to calendar") is implemented without any API.

## Security & privacy

- **Honeypot** (`website` field) — hidden from humans and screen readers. A
  filled honeypot gets a *fake success* response, so a bot never learns which
  field caught it. Validation deliberately accepts the field for this reason.
- **Rate limiting** — 5 submissions per IP per minute, per form. In-memory, so
  a speed bump rather than a guarantee; swap for a shared store if scale ever
  demands it.
- **Marketing consent** is separate, explicit and never pre-checked (§10). A
  test asserts this — if it fails, that's a compliance bug.
- **No tracking cookies**, so no consent banner is required (§16).
- Security headers are set in `next.config.ts`.
- `RESEND_API_KEY` is server-side only and never reaches the browser.

## SEO

Per page: localised title/description, canonical, `hreflang` for both languages
plus `x-default`, and OpenGraph. Plus `sitemap.xml` with language alternates,
`robots.txt`, semantic landmarks and a single `h1`.

JSON-LD: `Person` and `WebSite` on every page; `Book` and `Event` on the book
release page **only once the underlying facts are confirmed**. A wrong date in
structured data is worse than no structured data, because search engines and
assistants repeat it.

## Design stage

The wireframe uses tokens in `src/app/globals.css` (`--color-*`, `--font-*`,
`--measure`) and the layout primitives in `src/components/primitives.tsx`.
Those are the seams the design pass works on — the palette and typography from
brief §6 should land there rather than in individual components.

Two things already wired in and worth keeping: `prefers-reduced-motion` is
honoured globally, and focus states are visible everywhere.

## Still needed from Kata

See brief §23 for the full list, and the dev-only footer panel for live status.
The blockers for launch are the event date/time/venue, the book title, cover
and synopsis, an approved bio and portrait, and confirmed speaking topics.
