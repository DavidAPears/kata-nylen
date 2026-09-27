# ⚠️ LAUNCH BLOCKERS & NEXT STEPS

Live wireframe: **https://kata-nylen.vercel.app** (noindexed, see §4)
Attendee sheet: `docs/google-sheets-setup.md`

Status as of 26 Sep 2026: RSVP pipeline works end to end in production. Form →
Google Sheet → confirmation email. Event details, design and the domain are
outstanding.

---

# PART A — THINGS WE DO (David + Claude)

## 🔴 A1. DOMAIN + EMAIL — the one that blocks launch

**Today, RSVP confirmation emails only reach davidapears@gmail.com.** Emails
send from Resend's shared `onboarding@resend.dev`, which by design delivers
only to the Resend account owner. A real guest would submit the form, see
"Du står på listan", and receive nothing.

Once **katanylen.com** is bought, in order:

1. **Resend → Domains → Add Domain** → `katanylen.com`.
2. Copy the DNS records Resend shows (SPF, DKIM, usually DMARC).
3. Add them wherever the domain's DNS is hosted.
4. Back in Resend, click **Verify**. Minutes, occasionally hours.
5. Update **both** places, they are separate:
   - `.env.local` (local dev)
   - **Vercel → Project → Settings → Environment Variables** (production)

   ```
   CONTACT_FROM_EMAIL=Kata Nylén <hej@katanylen.com>
   CONTACT_TO_EMAIL=kata.nylen@gmail.com
   ```

   In Vercel, paste values WITHOUT surrounding quotes.
6. **Vercel → Domains → Add** `katanylen.com`, and point the domain's DNS at
   Vercel.
7. **Redeploy.** Required: it lifts the noindex (§A4) and updates canonical
   URLs.
8. Test with an address that is NOT davidapears@gmail.com, to prove the
   restriction is gone. This is the actual proof that launch is unblocked.

## 🔴 A2. EVENT DETAILS → `src/content/facts.ts`

Until these are filled in, the book-release page shows "Meddelas snart",
emits no Event structured data, and serves no calendar file. Nothing is
invented, by design.

- `launchEvent.startsAt` / `endsAt` (ISO 8601 with timezone)
- `launchEvent.venueName`, `addressLine`, `postalCode`, `city`
- `launchEvent.programme` (only if there genuinely is one)
- `launchEvent.capacity` (only if the venue caps it)
- `launchEvent.accessibility`

Plus-ones are already enabled, capped at 4 places per booking
(`maxPlacesPerRsvp`).

## 🟠 A3. MAP / DIRECTIONS ON THE BOOK-RELEASE PAGE

Currently a plain "Vägbeskrivning" text link, which needs no API key and opens
the visitor's own maps app.

To add a visual map, use the **Google Static Maps API**: the page renders a map
image generated server-side, so the key never reaches the browser. Do NOT use
the Maps JavaScript API for a single fixed venue — it ships a large bundle,
hurts Core Web Vitals, and exposes a key that must then be referrer-restricted.

- Needs `GOOGLE_MAPS_API_KEY` (server-side only, no `NEXT_PUBLIC_` prefix)
- Restrict the key to the Static Maps API in Google Cloud Console
- Keep the text directions link alongside it for accessibility
- Blocked on A2: there is no venue to plot yet

## 🟢 A4. SEARCH INDEXING — already handled, but know how it works

On `kata-nylen.vercel.app` the site serves `Disallow: /` plus a `noindex` meta
tag, so Kata's name is not indexed against placeholder copy.

It lifts itself: Vercel sets `VERCEL_PROJECT_PRODUCTION_URL` to the project's
production domain, so indexing switches on once katanylen.com is attached
**and the project is redeployed**. Override either way with `SITE_INDEXABLE`.

## 🟠 A5. ROTATE THE RESEND API KEY

The current key was visible in a screenshot during setup. Low risk (it can only
send email as this account) but it should be replaced: Resend → API Keys →
delete → create new → update `.env.local` AND Vercel.

## 🟠 A6. DESIGN PASS

The wireframe is deliberately white/grey. See `docs/brand-notes.md` for the
direction taken from Kata's own book-launch flyer, and the open question of
whether navy/orange is the site's identity or only the book campaign's.

Seams to work on: tokens in `src/app/globals.css`, primitives in
`src/components/primitives.tsx`. Blocked on B2 and B3 below.

## 🟠 A7. SMALLER ITEMS

- The phone RSVP e2e test submits a real RSVP, so running it locally writes a
  `Test Gäst / gast@example.com` row to the live sheet. De-duplication keeps it
  to one row, and CI has no credentials so it never writes there. Delete that
  row before the launch, or point local e2e runs at a server without the
  Sheets variables.

- Privacy page reviewed for legal accuracy (retention periods are assumptions)
- Proper mobile navigation if the design calls for it (four links currently
  wrap onto their own row)
- Confirmation email wording is a draft; Kata should rewrite it
  (`src/lib/messages/rsvp.ts`)
- Consider an `apple-touch-icon` if the site gets saved to home screens

---

# PART B — THINGS KATA OWES US

## B1. Read the Swedish copy

`src/content/sv.ts` is a draft I wrote to get the site working. It has not been
read by a native speaker. Swedish is a first-class language here, not a
translation, so she should correct tone as well as wording.

## B2. Brand assets

- Font names from the Canva file (title, kicker, body) — see `docs/brand-notes.md`
- Real hex values, or the book cover artwork file
- Decision: navy + orange sitewide, or reserved for the book-release page?
- Is the wavy-line motif for the site, or flyer-only?
- Is the leaf mark permanent, or tied to this book?

## B3. Images and factual content

- Approved portrait
- Book cover asset
- Approved short bio (SV + EN)
- Preferred professional title
- ~~Book title, publisher~~ — confirmed from the book file: *Psykologisk
  resiliens*, Att möta motgång i en osäker värld, Natur & Kultur
- **Synopsis**: a draft is in place, written from the book's own structure. It
  is NOT approved. Natur & Kultur will have official back-cover and catalogue
  copy; use that instead.
- Publication date, purchase URL, cover asset
- Confirmed speaking topics and formats — **do not publish unapproved ones**
- Verified credentials, previous events, approved testimonials if any
- Social/professional profile URLs (these feed the JSON-LD, confirmed only)
- Whether she wants a public email address on the site

See `docs/build-brief.md` §23 for the full list.

---

## Reference

- `docs/build-brief.md` — the brief; code comments cite its sections
- `docs/google-sheets-setup.md` — attendee list, and `npm run check:sheets`
- `docs/brand-notes.md` — visual direction and open questions
- `AGENTS.md` — hard rules (never invent facts, no em dashes, etc.)
