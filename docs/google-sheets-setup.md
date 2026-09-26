# RSVP attendee sheet — setup

RSVPs are appended to a Google Sheet that Kata can open, sort and export
herself. This avoids building an admin screen, and keeps attendee data out of
the codebase entirely.

The site works **without** any of this — RSVPs are logged and emailed instead —
so you can defer it. Nothing below needs to be done to develop locally.

## What you're building

```
Visitor submits RSVP
        │
        ▼
  /api/rsvp  ──► validates, checks honeypot + rate limit
        │
        ├──► appends a row to the Google Sheet   ← this document
        ├──► confirmation email to the attendee
        └──► notification email to the organiser
```

The server authenticates as a **service account** — a robot Google account that
signs its own token. There is no OAuth consent screen and no human in the loop.
You grant it access by sharing the sheet with its email address, exactly as you
would with a person.

## 1. Create the sheet

1. Create a new Google Sheet. Name it something like *Kata Nylén — book launch RSVPs*.
2. Rename the first tab to **RSVPs** (or set `GOOGLE_SHEETS_TAB_NAME` to whatever you call it).
3. Leave it empty — the app writes the header row on the first RSVP.
4. Copy the spreadsheet id from the URL:

   ```
   https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit
                                          ^^^^^^^^^^^^  this part
   ```

## 2. Create the service account

In the [Google Cloud Console](https://console.cloud.google.com/):

1. Create a project (or pick an existing one).
2. **APIs & Services → Library** → search *Google Sheets API* → **Enable**.
3. **APIs & Services → Credentials → Create credentials → Service account**.
   - Name: `katanylen-rsvp`
   - No roles are needed — project roles are irrelevant here. Access comes from
     sharing the sheet, in step 3.
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A `.json` file downloads. **Treat it like a password.**

   Do not put it in the repo at all. Copy the two values you need into
   `.env.local` (step 4), then delete the file. `.gitignore` has patterns for
   the common names as a backstop, but Google names the download after your
   project id, so don't rely on them. If you want to keep it, store it outside
   the repo or in a password manager.

## 3. Share the sheet with the service account

Open the JSON file and find `client_email` — something like
`katanylen-rsvp@your-project.iam.gserviceaccount.com`.

In the Google Sheet: **Share** → paste that address → give it **Editor** →
untick "Notify people" → **Share**.

This is the step that grants access. Without it you'll get a `403 caller lacks
permission` error, even with valid credentials.

## 4. Set the environment variables

From the JSON file:

| JSON field | Environment variable |
| --- | --- |
| `client_email` | `GOOGLE_SERVICE_ACCOUNT_EMAIL` |
| `private_key` | `GOOGLE_PRIVATE_KEY` |
| — (from the URL) | `GOOGLE_SHEETS_SPREADSHEET_ID` |

Locally, in `.env.local`:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=1AbC...XyZ
GOOGLE_SERVICE_ACCOUNT_EMAIL=katanylen-rsvp@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

> **The private key is the one thing people get wrong.** Environment variables
> cannot contain real newlines, so keep the value in double quotes with its
> literal `\n` sequences exactly as they appear in the JSON file. The app
> unescapes them at runtime. A key pasted with real line breaks produces
> `error:1E08010C:DECODER routines::unsupported` or `invalid_grant`.

On Vercel, add the same three under **Project → Settings → Environment
Variables**. Paste the private key value *including* the quotes.

## 5. Check it works

Start the dev server and submit an RSVP — or:

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H 'content-type: application/json' \
  -d '{"name":"Test","email":"test@example.com","locale":"en"}'
```

A row should appear in the sheet. If not, check the server logs — the adapter
reports the Sheets API status code and message verbatim.

| Symptom | Cause |
| --- | --- |
| `403 caller lacks permission` | Sheet not shared with the service account (step 3) |
| `403 Google Sheets API has not been used` | API not enabled (step 2.2) |
| `invalid_grant` / `DECODER routines` | Private key newlines mangled (step 4) |
| `404 Requested entity was not found` | Wrong spreadsheet id |
| Rows appear on the wrong tab | `GOOGLE_SHEETS_TAB_NAME` doesn't match the tab |

## Behaviour worth knowing

**A sheet outage never costs someone their place.** If the Sheets API is down,
misconfigured or rate-limited, the RSVP is still accepted: the visitor gets
their confirmation, and the organiser notification email — which contains every
field — becomes the recoverable record. The email subject is prefixed
`NOT SAVED TO SHEET` so it's obvious the row needs adding by hand.

The reasoning: a guest at a book launch is not a database transaction. Failing
the request would turn a spreadsheet hiccup into a lost attendee, which is
worse than a row you have to paste in later.

**Duplicate emails are not re-added.** Submitting twice returns success and
re-sends the confirmation, but writes only one row. The organiser is not
notified a second time.

**Capacity is optional.** Set `RSVP_CAPACITY` to a number and RSVPs that would
push the guest total past it are refused. Note this counts *guests*, not rows.
Two simultaneous submissions could in principle both pass the check — at this
scale that's an acceptable trade for not needing a locking mechanism.

**Data protection.** The sheet holds names and email addresses, so it is
personal data: keep sharing tight, and delete it after the event unless the
attendee ticked the separate marketing consent (which is recorded in its own
column). The privacy page already promises exactly this.
