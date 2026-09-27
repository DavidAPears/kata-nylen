# Brand notes

Design facts taken from Kata's own material. Unlike the first pass, most of
this is now **confirmed**, extracted from the print PDF of the book rather than
eyeballed from a photo.

> ⚠️ The book PDF is unpublished and confidential. It is deliberately **not**
> in this repo and must not be committed. Everything below was extracted from
> it and the file itself stays out.

## Colours — CONFIRMED

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

## Typeface — CONFIRMED, and it is commercial

The book is set in:

| Font | Weights present | Role |
| --- | --- | --- |
| **TT Jenevers** | Regular, Medium, Bold, ExtraBold, + italics | Everything |
| **Rita Smith** | — | Secondary/display |

My earlier guess of Playfair Display was wrong.

**TT Jenevers is a commercial face from TypeType.** The print licence Kata
already holds does not cover web use. Two options:

1. **Buy a TT Jenevers webfont licence** from TypeType. Gives exact continuity
   between book and site. Recommended if the budget allows, since the whole
   point is that they read as one object.
2. **Substitute a free face.** Closest in character (sturdy wedge serifs,
   moderate contrast, warm and bookish): **Literata**, then **Fraunces** or
   **Newsreader**. None is a match; they are a family resemblance.

Currently loaded: Playfair Display, as a stand-in from the earlier pass. It is
noticeably higher-contrast and more Didone than TT Jenevers, so it should be
swapped once the decision is made. One line in `src/app/fonts.ts`.

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
