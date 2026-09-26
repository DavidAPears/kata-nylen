import { Playfair_Display } from "next/font/google";

/**
 * Display face.
 *
 * Playfair Display is my best read of the serif on Kata's own book-launch
 * flyer — high-contrast, bracketed serifs, editorial rather than literary.
 * ⚠️ Unconfirmed: identified from a photo of a screen. If Kata made that flyer
 * in Canva, the real name is in the editor — swap this the moment we know.
 *
 * Loaded via next/font so the file is self-hosted, preloaded and subset at
 * build time: no render-blocking request to Google, no layout shift, and no
 * third-party connection to declare in the privacy notice (brief §16).
 *
 * `latin-ext` is required — Swedish needs å, ä, ö, and "Nylén" needs é.
 */
export const displayFont = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display-loaded",
  // Only the weights we actually use; every extra weight is bytes on the wire.
  weight: ["400", "600", "700"],
});
