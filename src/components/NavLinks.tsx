"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import type { AppPathname } from "@/i18n/routing";

/**
 * Client component purely so the current page can be marked with
 * `aria-current` — which matters for screen readers and gives the design pass
 * an obvious hook for an active state.
 */
export function NavLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { nav } = getContent(locale);

  const items: { href: AppPathname; label: string }[] = [
    { href: "/", label: nav.home },
    { href: "/book-release", label: nav.bookRelease },
    { href: "/speaking", label: nav.speaking },
    { href: "/contact", label: nav.contact },
  ];

  return (
    <nav aria-label={nav.menuLabel}>
      <ul className="flex flex-wrap items-center gap-4 text-sm">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "font-semibold text-[var(--color-ink)]"
                    : "text-[var(--color-ink-muted)] underline underline-offset-4 hover:no-underline"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
