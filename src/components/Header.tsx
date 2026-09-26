import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { Container } from "./primitives";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavLinks } from "./NavLinks";

/**
 * Brief §8/§9: restrained navigation — wordmark, four links, language switch.
 * Server component; only the interactive parts below are client-side.
 */
export function Header({ locale }: { locale: Locale }) {
  const { nav } = getContent(locale);

  return (
    <header className="border-b border-[var(--color-line)]">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-wide uppercase"
        >
          Kata Nylén
        </Link>
        <div className="flex items-center gap-6">
          <NavLinks locale={locale} />
          <LanguageSwitcher locale={locale} label={nav.languageLabel} />
        </div>
      </Container>
    </header>
  );
}
