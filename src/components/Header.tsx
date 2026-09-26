import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { Container } from "./primitives";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavLinks } from "./NavLinks";
import { Logo } from "./Logo";

/**
 * Brief §8/§9: restrained navigation — wordmark, four links, language switch.
 * Server component; only the interactive parts below are client-side.
 */
export function Header({ locale }: { locale: Locale }) {
  const { nav } = getContent(locale);

  return (
    <header className="border-b border-[var(--color-line)]">
      {/*
        On a phone: logo and language switcher share the top row, and the four
        nav links take a full-width row beneath — rather than wrapping raggedly
        around the switcher. From `sm` up it collapses to a single row.

        DOM order is logo → switcher → nav, with `order` restoring the
        conventional logo → nav → switcher reading order on wider screens. That
        leaves a small mismatch between tab order and visual order on desktop,
        where the two sit side by side; the alternative — rendering NavLinks
        twice — would put two identically-labelled <nav> landmarks in the page,
        which is worse for anyone navigating by landmark.
      */}
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
        <Logo className="mr-auto" />
        <LanguageSwitcher
          locale={locale}
          label={nav.languageLabel}
          className="order-2 sm:order-3"
        />
        <NavLinks
          locale={locale}
          className="order-3 w-full sm:order-2 sm:w-auto"
        />
      </Container>
    </header>
  );
}
