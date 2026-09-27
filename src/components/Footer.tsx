import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { collectives, person, isResolved } from "@/content/facts";
import { Container, ExternalAnchor } from "./primitives";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OutstandingContent, TodoNote } from "./TodoNote";
import { iconForProfile, labelForProfile } from "./SocialIcons";

export function Footer({ locale }: { locale: Locale }) {
  const { footer, nav } = getContent(locale);
  const email = isResolved(person.email) ? person.email : null;

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface-sunken)] py-10 text-sm">
      <Container>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h2 className="mb-2 font-semibold">{footer.contactHeading}</h2>
            {email ? (
              <a href={`mailto:${email}`} className="underline underline-offset-4">
                {email}
              </a>
            ) : (
              <TodoNote>
                Professional email. Confirm with Kata whether she wants it
                public (<code>person.email</code>).
              </TodoNote>
            )}
          </div>

          <div>
            <h2 className="mb-2 font-semibold">{footer.collectiveHeading}</h2>
            <ul className="space-y-1">
              {collectives.map((c) => (
                <li key={c.id}>
                  <ExternalAnchor href={c.url}>{c.name}</ExternalAnchor>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 font-semibold">{footer.followHeading}</h2>
            {person.sameAs.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-4">
                {person.sameAs.map((url) => {
                  const Icon = iconForProfile(url);
                  const label = labelForProfile(url);
                  return (
                    <li key={url}>
                      {/*
                        Icon alone, with the name visually hidden. The link
                        still needs an accessible name, so the text is present
                        for screen readers rather than removed. The link keeps
                        a 24px target even though the glyph is smaller.
                      */}
                      <ExternalAnchor href={url} underline={!Icon}>
                        {Icon ? (
                          <>
                            <Icon className="h-[18px] w-auto shrink-0" />
                            <span className="sr-only">{label}</span>
                          </>
                        ) : (
                          label
                        )}
                      </ExternalAnchor>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <TodoNote>
                Verified social/professional profiles (<code>person.sameAs</code>).
                These also feed the JSON-LD, so only add confirmed URLs.
              </TodoNote>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-6">
          <p className="text-[var(--color-ink-muted)]">
            {footer.copyright.replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="inline-flex min-h-6 items-center underline underline-offset-4"
            >
              {footer.privacyLabel}
            </Link>
            <LanguageSwitcher locale={locale} label={nav.languageLabel} />
          </div>
        </div>

        <OutstandingContent />
      </Container>
    </footer>
  );
}
