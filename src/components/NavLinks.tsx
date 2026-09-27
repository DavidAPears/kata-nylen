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
export function NavLinks({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const { nav } = getContent(locale);

  const items: { href: AppPathname; label: string }[] = [
    { href: "/", label: nav.home },
    { href: "/book-release", label: nav.bookRelease },
    { href: "/publications", label: nav.publications },
    { href: "/speaking", label: nav.speaking },
    { href: "/contact", label: nav.contact },
  ];

  return (
    <nav aria-label={nav.menuLabel} className={className}>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-6 items-center py-1 ${
                  isActive
                    ? "font-semibold text-[var(--color-ink)]"
                    : "text-[var(--color-ink-muted)] underline underline-offset-4 hover:no-underline"
                }`}
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
