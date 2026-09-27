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
- ~~`launchEvent.venueName`, `addressLine`, `postalCode`, `city`~~ confirmed:
  Knackeriet, Sankt Paulsgatan 25, 118 48 Stockholm
- `launchEvent.programme` (only if there genuinely is one)
- `launchEvent.capacity` (only if the venue caps it)
- `launchEvent.accessibility`

Plus-ones are already enabled, capped at 4 places per booking
(`maxPlacesPerRsvp`).

## 🟢 A3. MAP OF THE VENUE — built, just needs a key

The venue is confirmed: **Knackeriet, Sankt Paulsgatan 25, 118 48 Stockholm**
(by Mariatorget). Their private event space is called *Djupet*; confirm with
Kata whether the launch is in Djupet specifically, in which case
`launchEvent.venueName` should read "Djupet, Knackeriet".

The address and a directions link already render. To add the map image:

1. **console.cloud.google.com** with the existing `katanylen` project.
2. Search **Maps Static API**, open it, **Enable**.
3. **APIs & Services -> Credentials -> Create credentials -> API key**.
4. Restrict it: **API restrictions -> Maps Static API** only.
5. Add `GOOGLE_MAPS_API_KEY` to `.env.local` AND Vercel.

The key never reaches the browser: the image is fetched by `/api/venue-map`
server-side and streamed back, cached for a day in the browser and a week at
the edge. Without the key that route returns 404 and the page shows the
address and directions link, so nothing breaks.

Deliberately NOT the Maps JavaScript API: for one fixed venue it ships a large
bundle, hurts Core Web Vitals, and exposes a key regardless.

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

## 🟠 A6b. NEXT UP (David's list, 27 Sep)

1. **Review the Publications page** at `/sv/publikationer`. Built but not yet
   looked at.
2. **Mobile hamburger nav.** Five items now fit and pass the overflow tests,
   but they wrap to two rows on a narrow phone. `MobileNavigation` is in the
   brief's component list (§22).
3. ~~**A deep "About Kata" page**~~ BUILT, first pass, at `/sv/om-kata` and
   `/en/about`, linked from the footer beside Privacy. Written to be read, not
   just crawled. Still needs from Kata:

   - Her professional title and qualifications, and where she trained
   - Organisational clients, **with their agreement**, before any can be named
   - Media coverage, articles and TV clips, with links
   - Anything she wants said about her standing in the field, phrased so it is
     checkable

   On (3), two things that shaped how it was written:

   - A page built *purely for bots* and hidden from navigation is what Google
     calls a doorway page, and it is penalised. The version that works is a
     genuinely good, thorough About page that people can also read. Same
     content, same SEO benefit, no risk. Depth is rewarded; concealment is not.
   - Brief §21.3 and §11 forbid inventing credentials and fabricating client
     logos. **"Sweden's leading climate psychologist" and "first book on the
     subject" need to be true and checkable**, and naming clients such as IKEA
     or Volvo needs their agreement plus Kata's confirmation that the work
     happened. Without that they cannot go on the page.

   What is safe and still strong: her real topics in depth, the real books with
   real publishers, the collectives she works with, her actual areas of
   practice, and verifiable facts about the field.

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
- ~~Synopsis, publication date, purchase URL, ISBN~~ all taken from the
  publisher's title page. Published **6 November 2026**, ISBN 9789127472730
  (paperback), 220pp.
  - The Swedish synopsis is Natur & Kultur's own copy. Confirm with Kata or
    their press contact (Mia Breitholtz, mia.breitholtz@nok.se) that they are
    happy for it to be used here.
  - The English is our translation and needs Kata's eye.
- **Cover asset**: the publisher has a press-image download on that page
  (credit: John Persson). That is the authoritative source.
- **Photo credit**: the press portraits of Kata are by **Karin Boo**. Check
  whether the portrait now on the site is one of hers, and whether a credit is
  required (§23, photography rights).
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
