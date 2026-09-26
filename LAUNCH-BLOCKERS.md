# ⚠️ LAUNCH BLOCKERS

Things that MUST be done before this site goes live. Nothing here is optional.

---

## 🔴 1. VERIFY THE DOMAIN IN RESEND — OR NOBODY GETS THEIR RSVP EMAIL

**This is the big one. Getting RSVPs is the entire point of the site right now.**

### The problem

Right now emails are sent from `onboarding@resend.dev`, which is Resend's
shared loaner address. It has one hard rule:

> **It only delivers to the email address the Resend account was created with.**

So today:

| | Works? |
| --- | --- |
| Test RSVP to davidapears@gmail.com | ✅ yes |
| Real guest RSVPs to their own email | ❌ **NO** |
| Organiser notification to Kata | ❌ **NO** |

**If the site launched today, guests would fill in the form, see "You're on the
list", and receive nothing.** The RSVP is still recorded, but the person gets
no confirmation. That is a broken launch.

### The fix

1. Buy **katanylen.com** (or use another domain you already own).
2. In Resend: **Domains → Add Domain** → enter the domain.
3. Resend shows several DNS records (SPF, DKIM, and usually a DMARC record).
4. Add those records at whoever hosts the domain's DNS (GoDaddy / Namecheap /
   Cloudflare / etc).
5. Back in Resend, click **Verify**. Usually minutes, occasionally a few hours.
6. Update `.env.local` AND the production environment variables:

   ```
   CONTACT_FROM_EMAIL="Kata Nylén <hej@katanylen.com>"
   CONTACT_TO_EMAIL=kata.nylen@gmail.com
   ```

7. Test with an address that is NOT your own, to prove the restriction is gone.

### Interim option

If katanylen.com is not bought yet but you own another domain, verify that one
instead and send from it today. Swap to katanylen.com later. It is one
environment variable.

---

## 🟢 SEARCH INDEXING — handled automatically

While the site is on `kata-nylen.vercel.app` it serves `Disallow: /` and a
`noindex` meta tag, so it stays out of Google. It would otherwise put Kata's
name against placeholder copy, and later compete with the real domain.

This lifts itself: Vercel sets `VERCEL_PROJECT_PRODUCTION_URL` to the project's
production domain, so indexing switches on the moment katanylen.com is attached
**and the project is redeployed**. Nothing to remember, but do trigger a
redeploy after adding the domain.

Override either way with `SITE_INDEXABLE=true` / `SITE_INDEXABLE=false`.

---

## 🔴 2. EVENT DETAILS

Until these are in `src/content/facts.ts`, the book-release page shows
"To be confirmed", emits no Event structured data, and serves no calendar file:

- date and start time
- end time
- venue name and full address

---

## 🟠 3. BEFORE PUBLISHING

- [ ] Kata reads `src/content/sv.ts` end to end (the Swedish is an unreviewed draft)
- [ ] Kata approves the English copy in `src/content/en.ts`
- [ ] Real book title, cover image, synopsis
- [ ] Approved portrait and short bio
- [ ] Confirmed speaking topics and formats
- [ ] Privacy page reviewed for legal accuracy
- [ ] Google Sheet connected (`npm run check:sheets`)

---

See `docs/google-sheets-setup.md` for the attendee list, and
`docs/build-brief.md` for the full brief.
