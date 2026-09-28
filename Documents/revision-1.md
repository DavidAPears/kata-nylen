# Revision 1 — Kata's feedback, 28 Sep 2026

Source: Kata's review of **katanylen.com/sv**, sent 28 Sep. She has reviewed
the **Swedish only**. English is untouched and unverified by her.

**Status, 28 Sep: Groups A, B and C are done** on branch `revision-one`. Kata
supplied everything Group C was blocked on, so the only work left is Group D,
the language and voice pass, plus the few open questions in section 4.

Her framing, which should govern everything below:

> The site looks warm and personal. Please keep the current visual direction
> and the homepage headline "Psykologi för en värld i förändring."

So this is a **reweighting, not a rebuild**. No visual changes are requested.

---

## 1. What I verified in the code

Every item below was checked against the repository before being written down,
so the list separates real defects from things that are already fine.

| Her point | Verified? | Where |
|---|---|---|
| Subtitle should be plural `motgångar` | ✅ Confirmed wrong | `facts.ts:98`, `:123`, `:124`, `:286` and `subtitleEnglish` |
| LÄKA is four movements, not five | ✅ Confirmed wrong | `facts.ts:128`, `sv.ts:335`, `en.ts:336` |
| "Fem titlar" miscounts | ✅ Confirmed wrong | `sv.ts:348`, `en.ts:349` |
| Remove "Var på plats senast 17.15" | ✅ Confirmed present | `facts.ts:~208` |
| Contact form privacy text mentions the event | ✅ Confirmed | `sv.ts:425` — one shared string serves both forms |
| "Television" should be "TV" in Swedish | ✅ Confirmed | `sv.ts:375` |
| Areas of work in the wrong order | ✅ Confirmed | `sv.ts:60-99` — climate first, organisational last |
| Professional title missing | ✅ Confirmed | `facts.ts:36` — still `TODO` |
| SNAP and SHIFT absent | ✅ Confirmed | `collectives` holds only Klimatpsykologerna + Climate Psyched |

**One thing that is already fine:** the OG social cards do not bake in the
subtitle, so the `motgång → motgångar` fix needs no image regeneration.

**The LÄKA error is ours, and it was always internally inconsistent.** LÄKA has
four letters. The site listed five movements, the fifth being "Ge och ta emot
stöd" / "Stöd". A reader who looked at the acronym would have seen it.

---

## 2. To-do list

Grouped by the kind of work, because the groups have very different costs and
very different risks.

### Group A — Factual corrections

Cheap, unambiguous, no judgement required. These should go first and could all
ship in one pass.

- [x] **A1.** Subtitle to `Att möta motgångar i en osäker värld` everywhere.
      Touches `book.subtitle`, both synopsis strings, the publications entry.
      Add a test so the singular can never come back.
- [x] **A2.** LÄKA reduced to four movements: Lyssna, Älska, Kollektivisera,
      Agera. Remove "Ge och ta emot stöd" / "Stöd". Change "fem rörelser" to
      "fyra" in Swedish and English. Rework the About page section to match.
- [x] **A3.** Remove "Var på plats senast 17.15." from the launch programme,
      keeping "Dörrarna öppnar 17.00" and "Programmet börjar 17.15".
- [x] **A4.** Split the privacy notice so each form describes only its own
      handling. Currently one string mentions managing event places and is
      shown on the contact form too.
- [x] **A5.** Swedish media page: "Television" becomes "TV". Leave English as
      "Television" unless she says otherwise.
- [x] **A6.** Add her chapter in **Vad håller ni på med?** (Adlibris link
      supplied) as a contribution, not an authored book.
- [x] **A7.** Fix the publications count. See the note in section 5 — the
      number should be derived from the data, not typed into a sentence.

### Group B — Repositioning

The real work. This is where the site's proposition changes.

- [x] **B1.** Professional introduction becomes **legitimerad psykolog och
      specialist i organisationspsykologi, författare och föreläsare**. All
      four parts, wherever she is introduced.
- [x] **B2.** Fill `person.jobTitle` from B1. This is currently `TODO`, which
      means the Person structured data ships without a `jobTitle`. Filling it
      is a direct SEO gain, not just copy.
- [x] **B3.** Rewrite the homepage opening so it leads with helping
      organisations turn knowledge, ambition and decisions into action.
      Keep the headline exactly as it is.
- [x] **B4.** Reorder Arbetsområden: organisationspsykologi /
      förändringsledning / organisationsutveckling first, then implementering,
      then resilience, behaviour change, climate psychology.
- [x] **B5.** Fold **Klimatkänslor** into climate psychology. Her instruction,
      and it frees a slot so the section does not grow.
- [x] **B6.** Add **implementering** as an area, with the concrete examples she
      gave: SNAP in social services and schools; training and practical work on
      implementing evidence, methods and policy.
- [x] **B7.** Apply the same emphasis and ordering to the Speaking page, and
      add concrete examples of talks, workshops and implementation training.
      **Needs material from her** — see section 4.

### Group C — New content

Genuinely new, and the largest risk to readability.

- [x] **C1.** Replace the "Collective work" model. Kata is explicit that SNAP is
      a programme and an area of her work, not a psychologist collective, and
      asks for a heading that accommodates all four connections. This is a data
      model change, not just a heading: `collectives` is typed as a flat list
      of peer organisations.
- [x] **C2.** Write the four connections, each short, each linked:
      - **Kata Nylén** — her own practice: psychologist, author, speaker,
        facilitator, particularly organisational change and implementation
      - **SHIFT Collective** — organisational development and change leadership
      - **Klimatpsykologerna** — climate psychology
      - **SNAP** — implementation in social services and schools, linked to
        [snap.nu](https://snap.nu/)
- [x] **C3.** Give SNAP real coverage. She says the site "says very little
      about her work with SNAP, and that needs to change." **Needs material.**
- [x] **C4.** Add Dagens ETC (answering readers' questions) to Media.
      **Needs the link.**

### Group D — Language and voice

- [ ] **D1.** Audit "Kata / hon" versus "vi" across the site, especially around
      the contact form. Decide one rule and apply it.
- [ ] **D2.** Once Swedish is settled, bring English into line. The type system
      guarantees English *exists*, not that it is *good*.

---

## 3. What this costs

| Group | Scope | Risk |
|---|---|---|
| A | 7 edits, mostly one-line | Low. Ship first. |
| B | Copy across home, speaking, about + `facts.ts` | Medium. Changes the proposition. |
| C | New section, new data shape, new page content | High. Blocked on her material. |
| D | Audit + English pass | Medium. Slow, not hard. |

All three shipped on 28 Sep. She answered the same day with SHIFT's URL, the
Dagens ETC column, her SNAP role and its public pilots, six real speaking
engagements and a short bio, which unblocked everything.

**One structural note.** The area ids (`climate-psychology`,
`organisational`, and so on) are shared across the home, speaking and about
pages and locked by a parity test. Reordering and renaming them is a
coordinated change, but the test will catch any page left behind, so this is a
safety feature rather than a cost.

---

## 4. Still open

Items 1 to 6 of the original list are all answered and built. What remains:

1. **Founder or co-founder of SHIFT Collective?** She wrote "I founded SHIFT
   Collective", but her own bio says "medgrundare av Klimatpsykologerna, SNAP
   Sverige och SHIFT Collective". Climate Psyched's team page says she "runs"
   it. The site currently says co-founder, the more modest of the three,
   because the difference matters to whoever else founded it.
2. **Client names for the speaking examples.** She said the climate transition
   workshop and the moderation work have been described publicly but she wants
   to approve any names first. The examples run without them for now.
3. **The English.** Her bio, the SNAP description and the new areas of work are
   all our translations of her Swedish. She has not read any of it.
4. **Who edited "Vad håller ni på med?"** The Libris record names no editors,
   and the other anthology on the site credits its three.
5. **The book synopsis.** The last unconfirmed fact in `facts.ts`: it is Natur
   & Kultur's own copy and still needs their sign-off.

---

## 5. Notes, and two recommendations

### The count should be computed, not written

"Fem titlar" is wrong today and will go wrong again the moment another
publication is added. The publications data already distinguishes `author` from
`chapter`. The sentence should be generated from that data, so the number
cannot drift from the list beneath it. That turns A7 from a correction into a
class of bug we stop having.

### Implementation in social work and schools: an example, not an area

Her own instinct in the feedback is right. Making it a seventh area dilutes the
section and puts a very specific piece of work at the same level as
"organisationspsykologi". As the lead example *inside* implementation it is more
concrete and it does the same job. It also keeps Arbetsområden at six.

### The headline already does the new job

"Psykologi för en värld i förändring" reads as climate today only because
everything beneath it is climate. The same line reads as change leadership the
moment the supporting content shifts. Nothing needs to change at the top of the
page, which is convenient, because she asked us not to change it.

### Where this could get heavy

Almost everything above is correction, reordering or substitution. Only SNAP
and SHIFT are genuinely additive. The section that could turn into a wall of
text is C2, the four connections — that should be four short blocks with links
out, not explanatory prose. If someone wants the detail, the link is right
there.

The rule for this revision: **for every addition, find a subtraction.** Folding
Klimatkänslor into climate psychology is the model — one area in, one area out,
section length unchanged.
