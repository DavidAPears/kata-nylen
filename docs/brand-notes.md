# Brand notes

Design facts taken from Kata's own material. Unlike the first pass, most of
this is now **confirmed**, extracted from the print PDF of the book rather than
eyeballed from a photo.

> ⚠️ The book PDF is unpublished and confidential. It is deliberately **not**
> in this repo and must not be committed. Everything below was extracted from
> it and the file itself stays out.

## Colours — CONFIRMED, and there are TWO sets

The printed cover and the book's interior do not use the same palette. This
matters: the cover is the object people recognise, and the cover image sits on
the book-release page, so the site follows the **cover**. Using the interior
values made the page fight the cover sitting on it.

### Cover (what the site uses)

Sampled from the cover artwork itself.

| Token | Value |
| --- | --- |
| `--color-book-navy` | `#0c2e4e` |
| `--color-book-sand` | `#f7c17b` |
| `--color-book-sand-deep` | `#f4a960` |
| `--color-book-green` | `#76b06c` (her name and the subtitle) |
| `--color-book-cream` | `#fef3e1` |

The cover using green is worth noticing: it is the bridge between the site's
green palette and the book's navy, which is why the two colourways sit
together rather than clashing.

Contrast is also much healthier here. Every pair we use clears WCAG AA
comfortably, where the interior palette had two failures needing worked
around.

`public/leaf-pattern.svg` has been recoloured from the interior values to
these, so the motif and the cover match.

### Interior (reference only)

Exact values from the vector art in the book's interior.

| Token | Value | Where it comes from |
| --- | --- | --- |
| `--color-book-orange` | `#fc9a2d` | The leaf, chapter openers |
| `--color-book-orange-soft` | `#ffa951` | Outer bands of the chapter motif |
| `--color-book-navy` | `#444f69` | Chapter grounds, body text |
| `--color-book-cream` | `#fff0e0` | Callout boxes |
| `--color-book-cream-light` | `#fff7ee` | Page ground |
| `--color-book-grey` | `#ebecef` | Diagram fills |
| `--color-book-red` | `#e52237` | Rare accent |
| `--color-book-yellow` | `#ffd100` | Rare accent |

Earlier guesses of `#152a4a` / `#de8a3e`, sampled from a photo of a screen,
were wrong. These replace them.

## Typefaces — CONFIRMED, two of them, both commercial

Checked against which text spans actually use each face, not just the font
list, because the two do very different jobs:

| Font | Role |
| --- | --- |
| **Rita Smith** | Book title, chapter titles, orange section headings. The distinctive one: rounded, chunky, warm, slightly quirky. |
| **TT Jenevers** | Body text, subheads, page numbers. Sturdy wedge serifs, moderate contrast. |

Both are commercial and Kata's print licences do not cover web use.

**Recommended: licence the real pair.** The design's premise is that the site
and the book read as one object, and only the real faces deliver that.

### Stand-ins currently loaded

Chosen by rendering the book's own words against candidates side by side.

| Role | Stand-in | Rejected |
| --- | --- | --- |
| Display (for Rita Smith) | **Fraunces**, SOFT 70 / WONK 1 | Crete Round (too evenly rounded), Bitter (too rigid a slab) |
| Body (for TT Jenevers) | **Literata** | Source Serif 4 (too neutral), Newsreader (too much contrast) |

Fraunces is variable; the SOFT and WONK axes are what get it near Rita Smith's
warmth, tuned in `globals.css`. Playfair Display, used in the first pass, was
wrong on both counts: far too high-contrast and Didone.

Swapping either is a few lines in `src/app/fonts.ts`.

## Why an aspen leaf

Worth knowing before anyone "improves" it: the mark is not generic nature
decoration. The book's closing chapter is addressed to those who *"ibland
känner er som ett darrande asplöv"* — who sometimes feel like a trembling
aspen leaf. The leaf is the book's central metaphor, and the chapter openers
are built from seven nested copies of it.

## The book — CONFIRMED from its own title page

| | |
| --- | --- |
| Title | **Psykologisk resiliens** |
| Subtitle | Att möta motgång i en osäker värld |
| Publisher | Natur & Kultur |

Structure: an introduction, *"När du och världen behöver LÄKA"*, then five
chapters — Lyssna, Älska, Kollektivisera, Agera, and Ge och ta emot stöd.
**LÄKA** is both an acronym of the first four and the Swedish for *to heal*,
with *Stöd* (support) at the centre. That framework is the book's spine and
should shape how the book-release page is written.

## The leaf — EXTRACTED, not traced

`src/components/Logo.tsx` contains the **actual vector path** from the book.
The chapter openers are seven nested copies of this outline, so it is the
book's core motif rather than decoration.

- Filled with `currentColor`, so one path serves every colourway
- `simplified` prop swaps in a clean silhouette below ~28px, where the toothed
  edge and thin stem stop reading. The favicon uses it.
- `public/leaf-pattern.svg` is the full seven-layer chapter motif, extracted
  with its nesting intact, ready to use as a hero background on the
  book-release page.

## Two colourways, one system

Agreed direction: the leaf and the typeface run through the whole site; only
the colours change.

| | Palette | Rationale |
| --- | --- | --- |
| **Site** (default) | Muted green, warm brown, cream | Must outlive any single book (brief §6) |
| **Book release** (`.theme-book`) | The book's orange and navy | That page and the book should feel like one object |

`.theme-book` is a scoped class on the book-release page, not a global mode, so
removing the campaign after the launch is a one-line deletion (brief §21.11).

## Interior design language, worth borrowing

From the book's own pages:

- Callout boxes: cream ground, generous radius (~12px), no border
- Section headings: orange, letterspaced caps, above a bold navy subhead
- Diagrams: soft overlapping circles in orange and cool grey
- Body: navy on cream, generously leaded
- Chapter openers: the nested leaf motif, full bleed

## Still open

1. TT Jenevers webfont licence, or substitute?
2. Should the nested-leaf motif appear on the site, or stay book-only?
3. Does the site header keep the green leaf on the book page, or adopt the
   book colourway too? Currently it stays green, since the header is site
   chrome.
