"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

/**
 * SV | EN switcher.
 *
 * Brief §7: switching must land on the *equivalent* page, not the homepage.
 * `usePathname` from next-intl returns the internal route (e.g. "/book-release"),
 * and <Link locale="sv"> resolves it to that language's public URL
 * ("/sv/bokrelease"). So equivalence is structural rather than a lookup table
 * we have to remember to update.
 */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {locales.map((code, index) => {
        const isActive = code === locale;
        return (
          <span key={code} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden="true" className="text-[var(--color-line)]">
                |
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={code}
              hrefLang={code}
              aria-current={isActive ? "true" : undefined}
              className={`px-1 uppercase ${
                isActive
                  ? "font-semibold text-[var(--color-ink)]"
                  : "text-[var(--color-ink-muted)] underline underline-offset-4"
              }`}
            >
              {code}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
