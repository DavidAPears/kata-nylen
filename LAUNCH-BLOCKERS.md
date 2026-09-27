# ⚠️ LAUNCH BLOCKERS & NEXT STEPS

Live site: **https://katanylen.com**
Attendee sheet: `docs/google-sheets-setup.md`

Status as of 27 Sep 2026: RSVP pipeline works end to end in production. Form →
Google Sheet → confirmation email. Event details are confirmed, the design pass
is done, and the site is live at the Vercel URL.

**27 Sep, evening: the domain is live and email is verified.** katanylen.com
is bought at one.com, DNS points at Vercel, Resend has verified the domain,
and the site is indexable. Nothing is blocking launch any more. What is left
is Kata's copy and a handful of improvements.

---

# PART A — THINGS WE DO (David + Claude)

## 🟢 A1. DOMAIN + EMAIL — DONE, 27 Sep

katanylen.com is registered at one.com and live. Confirmation emails now
send from `hej@katanylen.com` and reach anyone, not just David.

What was done, for reference if it ever needs redoing:

- one.com's two default `A` records (their parking page) toggled **off**.
  Leave them off: turning one back on adds a second `A` record for the same
  name and the site then loads one.com's holding page at random.
- Custom records added at one.com: `A @ 216.198.79.1` and
  `CNAME www 24417a89ebe22dc4.vercel-dns-017.com`.
- Vercel: both the apex and `www` added, with "redirect apex to www"
  **unticked** so katanylen.com is the real address. The code's
  `CANONICAL_HOST` assumes the apex.
- Resend: DKIM, two SPF CNAMEs and DMARC added at one.com, domain verified.
- `CONTACT_FROM_EMAIL` updated in Vercel and `.env.local`.

⚠️ The domain has a **null MX** record: it accepts no mail at all, because
she is on one.com's Domain-only plan. Nothing can receive at
`hej@katanylen.com`. The RSVP confirmation therefore sets a reply-to of
`CONTACT_TO_EMAIL`, so a guest hitting reply reaches Kata's gmail rather
than a bounce. If she ever buys a mailbox or forwarding, that reply-to can
go.

<details>
<summary>Original instructions, kept in case the domain ever moves</summary>

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

</details>

## 🟢 A2. EVENT DETAILS — DONE

Confirmed from the launch poster and Knackeriet's own Djupet page:

**Resilienssalong, Wednesday 11 November 2026, 17.00, Djupet,
Björngårdsgatan 1A, Stockholm.** Stage programme from 17.15.

Filling these in switched on the Event structured data and `/api/calendar`
automatically, because both are gated on the facts being resolved.

⚠️ **The venue is Djupet, at Björngårdsgatan 1A.** An earlier draft of this
file said Knackeriet, Sankt Paulsgatan 25 — that is Knackeriet's office
address, taken from their homepage. Djupet has its own door on
Björngårdsgatan. Do not "correct" it back.

Still TODO in `facts.ts`, deliberately: `endsAt`, `capacity`, `postalCode`
and `accessibility`. David has decided none are needed for this launch, so
the content audit does not flag them. The calendar file falls back to a
two-hour event and RSVPs are uncapped.

Plus-ones are enabled, capped at 4 places per booking
(`maxPlacesPerRsvp`).

## 🟢 A3. MAP OF THE VENUE — built, just needs a key

The venue is confirmed: **Djupet, Björngårdsgatan 1A, Stockholm** (by
Mariatorget). It is Knackeriet's event space but has its own entrance, which
is why the address is not Knackeriet's Sankt Paulsgatan one.

The address already renders and links straight out to directions. To add the map image:

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

## 🟢 A4. SEARCH INDEXING — now ON, 27 Sep

It lifted itself, as designed: Vercel promoted katanylen.com to the project's
production domain, `isIndexable()` flipped, and robots.txt now serves
`Allow: /` with a sitemap. The `noindex` meta tag is gone, and canonical URLs
and OG images all point at katanylen.com.

Override either way with `SITE_INDEXABLE` if that is ever needed.

**Still to do, and it needs David:** the site is crawlable but nobody has
told Google it exists. See A8.

## 🟠 A5. ROTATE THE RESEND API KEY

The current key was visible in a screenshot during setup. Low risk (it can only
send email as this account) but it should be replaced: Resend → API Keys →
delete → create new → update `.env.local` AND Vercel.

## 🟠 A6b. NEXT UP (David's list, 27 Sep)

1. ~~**Review the Publications page**~~ reviewed. Now links through to Media
   at the foot of the contributions list.
2. ~~**Mobile hamburger nav.**~~ Not needed. The nav fits one row on a phone
   by dropping Home, with the wordmark carrying that job instead. Locked by an
   e2e test, so a sixth link would fail rather than wrap silently.
3. ~~**A deep "About Kata" page**~~ BUILT, first pass, at `/sv/om-kata` and
   `/en/about`, linked from the footer beside Privacy. Written to be read, not
   just crawled. Still needs from Kata:

   - Her professional title and qualifications, and where she trained
   - Organisational clients, **with their agreement**, before any can be named
   - ~~Media coverage~~ started: the Klimatklubben interview is in, and
     `recognition` / `media` in facts.ts take more. Only items with a link.
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

## 🔵 A8. GETTING HER FOUND — the next real piece of work

Done on 27 Sep: the Person schema now carries `knowsAbout` (her themes) and
`makesOffer` (keynote, panel, workshop, moderated conversation), so the site
finally says she is *bookable* rather than only that she exists. The speaking
page is titled for the query a booker types, not for the page.

What needs David, roughly in order of value:

1. **Google Search Console.** Verify katanylen.com (the DNS TXT method is
   easiest, one more record at one.com), then submit
   `https://katanylen.com/sitemap.xml`. Until this happens, indexing relies
   on Google finding her on its own. This is the single highest-value thing
   left.
2. **Bing Webmaster Tools.** Same job, five minutes, and it also feeds
   ChatGPT search.
3. **Get the domain linked from somewhere real.** Her Natur & Kultur author
   page, MySpeaker profile, LinkedIn, Klimatpsykologerna and Climate Psyched
   all already exist and already carry authority. A link from each to
   katanylen.com is worth more than anything else on this list. Ask her to
   add it wherever she can.
4. **A speaker one-pager** is the natural next page: topics, formats,
   audience sizes, languages, travel, past engagements, a downloadable bio
   and photo. That is what a conference producer actually wants, and most of
   it already exists on the site.

What needs Kata: her job title and short bio are still TODO, so the Person
schema ships without `jobTitle` or `description`. Those are two of the
strongest fields on an entity. Run `npm run check:content`.

## 🟢 A6. DESIGN PASS — DONE, pending Kata's eye

Two colourways: the site in green/cream, the book-release page in the cover's
navy/sand under `.theme-book`. The leaf is the real vector from the book, not
a lookalike. See `docs/brand-notes.md`.

Seams if it needs changing: tokens in `src/app/globals.css`, primitives in
`src/components/primitives.tsx`.

Open question for Kata (B2): is navy/orange the site's identity, or only this
book's campaign?

## 🟠 A7. SMALLER ITEMS


- The phone RSVP e2e test submits a real RSVP, so running it locally writes a
  `Test Gäst / gast@example.com` row to the live sheet. De-duplication keeps it
  to one row, and CI has no credentials so it never writes there. Delete that
  row before the launch, or point local e2e runs at a server without the
  Sheets variables.

- Privacy page reviewed for legal accuracy (retention periods are assumptions)
- Confirmation email wording is a draft; Kata should rewrite it
  (`src/lib/messages/rsvp.ts`)
- The Sveriges Radio item's title is reconstructed from its URL slug: the site
  returns 403 to us, so nobody has read the real headline. Flagged in
  `facts.ts`. Check it before launch.
- Consider an `apple-touch-icon` if the site gets saved to home screens

---

# PART B — THINGS KATA OWES US

## B1. Read the Swedish copy

`src/content/sv.ts` is a draft I wrote to get the site working. It has not been
read by a native speaker. Swedish is a first-class language here, not a
translation, so she should correct tone as well as wording.

## B2. Brand assets

- ~~Font names from the Canva file~~ identified from the book itself:
  **Rita Smith** (display) and **TT Jenevers** (body), both commercial. The
  site currently uses Fraunces and Literata as stand-ins. What we need from
  Kata is whether she holds a **webfont licence** for the real two, or is
  happy with the stand-ins. See `docs/brand-notes.md`.
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
- **Photo credit**: the press portraits of Kata are by **Karin Boo**, credited
  both by Natur & Kultur and on the Klimatklubben interview. Two independent
  sources, so if the portrait on the site is one of hers it very likely needs
  that credit (§23, photography rights).
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

## Checks

```
npm test                  # 361 unit and component tests
npm run test:coverage     # same, with a coverage table
npm run test:e2e          # 99 Playwright tests, needs a dev server
npm run check:content     # what is still unconfirmed in facts.ts
npm run check:sheets      # can we reach the attendee sheet
```

Never run `npm run build` while a dev server is up; it writes to the same
`.next`. Use `NEXT_BUILD_DIR=.next-verify npm run build` instead.
