"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { flagFor } from "./FlagIcons";

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
  className = "",
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={`flex items-center gap-1 text-sm ${className}`}>
      {locales.map((code, index) => {
        const isActive = code === locale;
        const Flag = flagFor[code];
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
              className={`flex min-h-6 items-center gap-1.5 px-1 py-1 uppercase ${
                isActive
                  ? "font-semibold text-[var(--color-ink)]"
                  : "text-[var(--color-ink-muted)] underline underline-offset-4"
              }`}
            >
              {/* Dimmed when inactive so the current language reads as current
                  without relying on colour alone — the weight and underline
                  carry it too. */}
              {/*
                Flags are hidden on a phone. The header is tight there and
                "SV | EN" is unambiguous on its own; the flags are recognition
                aids, not the label. They return from `sm` up.
              */}
              <Flag
                className={`hidden h-3.5 w-5 shrink-0 rounded-[1.5px] sm:block ${
                  isActive ? "" : "opacity-60"
                }`}
              />
              {code}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
