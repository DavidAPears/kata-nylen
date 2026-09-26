# Brand notes

Working notes from Kata's own design direction. Everything here is
**provisional** until confirmed — see the open questions at the end.

## Source

A LinkedIn flyer Kata designed for the book launch (*"Tre frågor till höstens
första möte"*), seen only as a photo of a screen. That matters: both the
display and the camera shift colour and soften letterforms, so nothing sampled
from it is trustworthy as a spec.

## Direction it shows

- Deep navy ground with warm orange wavy lines, arched to suggest an organic /
  leaf form — the book's colours.
- Cream circles holding simple green plant illustrations at three growth stages
  (seedling → branch shedding leaves → root system). The growth metaphor is
  doing real work, not decoration.
- A single leaf mark above her name at the foot of the layout — the basis for
  the logo now in `src/components/Logo.tsx`.
- Editorial serif for headings, geometric sans in letterspaced caps for the
  kicker, humanist sans for body.

## Colours (APPROXIMATE — do not ship these)

| Role | Eyeballed | Confidence |
| --- | --- | --- |
| Book navy | `#152a4a` | Low — photo of a screen |
| Book orange | `#de8a3e` | Low |
| Cream | `#f3ecdd` | Low |
| Leaf green | `#6e8b4a` | Low |

Replace from Kata's Canva file or the book cover artwork before launch.

## Typefaces

Identified by eye from a photo, so treat as a starting point:

| Role | Best guess | Alternatives |
| --- | --- | --- |
| Display / headings | Playfair Display | DM Serif Display, Prata, Noto Serif Display |
| Kicker caps | Montserrat | Poppins, Archivo |
| Body | Lato | Open Sans, Source Sans 3 |

Currently loaded: Playfair Display only, via `src/app/fonts.ts`. Body text is
still system sans — that choice is deferred to the design pass.

**If the flyer was made in Canva, the real font names are visible in the editor
when Kata clicks each text box.** Ask her rather than guessing further.

## The brand-above-book question

Brief §6: the book cover is *"content to incorporate, not a master brand style
guide"*, her other books have different identities, and *"the personal brand
therefore needs to sit above any individual book."*

Navy + orange is this book's identity. Proposed split:

- **Site** — quieter palette per brief §6 (cream, charcoal, muted botanical
  green, restrained accent). Survives the next book.
- **Book-release page** — leans fully into navy and orange. That page *is* the
  campaign, and §21.11 wants it easy to update or remove afterwards.

The leaf mark already works either way: it is drawn with `currentColor`, so it
renders green on cream and cream on navy with no second asset.

**Not yet decided.** If Kata wants navy/orange throughout, that is a legitimate
choice — it just means accepting a reskin when book three arrives.

## Open questions for Kata

1. Font names from the Canva file (title, kicker, body).
2. Real hex values, or the source artwork / cover file.
3. Navy + orange sitewide, or reserved for the book-release campaign?
4. Does she want the wavy-line motif used on the site, or is it flyer-specific?
5. Is the leaf hers to keep as a permanent mark, or tied to this book?
