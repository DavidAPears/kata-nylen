import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { book, launchEvent, isResolved } from "@/content/facts";
import { getCalendarEvent, googleCalendarUrl, directionsUrl } from "@/lib/ics";
import { Container, Section, Prose, ExternalAnchor } from "@/components/primitives";
import { TodoNote } from "@/components/TodoNote";
import { RsvpForm } from "@/components/RsvpForm";
import { BookJsonLd, EventJsonLd } from "@/components/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { bookRelease } = getContent(locale);
  return {
    title: bookRelease.seo.title,
    description: bookRelease.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/book-release" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/book-release" }),
        en: getPathname({ locale: "en", href: "/book-release" }),
        "x-default": getPathname({ locale: "sv", href: "/book-release" }),
      },
    },
    openGraph: {
      title: bookRelease.seo.title,
      description: bookRelease.seo.description,
      type: "website",
    },
  };
}

/** Formats a confirmed ISO date for display, or returns null. */
function formatDate(iso: string | undefined, locale: Locale): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    dateStyle: "full",
    timeZone: launchEvent.timeZone,
  }).format(new Date(iso));
}

function formatTime(iso: string | undefined, locale: Locale): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    timeStyle: "short",
    timeZone: launchEvent.timeZone,
  }).format(new Date(iso));
}

export default async function BookReleasePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  const { bookRelease } = content;

  const startsAt = isResolved(launchEvent.startsAt) ? launchEvent.startsAt : undefined;
  const endsAt = isResolved(launchEvent.endsAt) ? launchEvent.endsAt : undefined;
  const venueName = isResolved(launchEvent.venueName) ? launchEvent.venueName : null;
  const guestsAllowed =
    isResolved(launchEvent.guestsAllowed) && launchEvent.guestsAllowed;

  const calendarEvent = getCalendarEvent(locale);
  const calendar = calendarEvent
    ? {
        icsHref: `/api/calendar?locale=${locale}`,
        googleHref: googleCalendarUrl(calendarEvent),
      }
    : null;

  const address = [
    venueName,
    isResolved(launchEvent.addressLine) ? launchEvent.addressLine : null,
    isResolved(launchEvent.postalCode) ? launchEvent.postalCode : null,
    isResolved(launchEvent.city) ? launchEvent.city : null,
  ].filter(Boolean) as string[];

  return (
    // The book's own colourway, scoped to this page. Everything else on the
    // site keeps the green/brown palette; the leaf and the typeface carry
    // across so the two still read as one identity.
    <div className="theme-book">
      {/* Event hero */}
      <Container className="py-16 sm:py-24">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
          {bookRelease.hero.eyebrow}
        </p>
        <h1 className="text-4xl sm:text-5xl">
          {isResolved(book.title) ? book.title : bookRelease.hero.heading}
        </h1>
        {isResolved(book.subtitle) ? (
          <p className="mt-3 text-sm uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            {book.subtitle}
          </p>
        ) : null}

        <dl className="mt-8 grid gap-4 sm:grid-cols-3 sm:max-w-2xl">
          <div>
            <dt className="text-sm uppercase tracking-wide text-[var(--color-ink-muted)]">
              {bookRelease.hero.dateLabel}
            </dt>
            <dd>{formatDate(startsAt, locale) ?? bookRelease.hero.toBeConfirmed}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-wide text-[var(--color-ink-muted)]">
              {bookRelease.hero.timeLabel}
            </dt>
            <dd>
              {formatTime(startsAt, locale)
                ? `${formatTime(startsAt, locale)}${
                    formatTime(endsAt, locale) ? `-${formatTime(endsAt, locale)}` : ""
                  }`
                : bookRelease.hero.toBeConfirmed}
            </dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-wide text-[var(--color-ink-muted)]">
              {bookRelease.hero.venueLabel}
            </dt>
            <dd>{venueName ?? bookRelease.hero.toBeConfirmed}</dd>
          </div>
        </dl>

        {!startsAt || !venueName ? (
          <TodoNote>
            Event date, time and venue (<code>launchEvent.*</code>). Until these
            are confirmed the page shows a to-be-confirmed placeholder rather
            than invented details, and no Event structured data or calendar
            file is emitted.
          </TodoNote>
        ) : null}

        <p className="mt-8">
          <a
            href="#rsvp"
            className="inline-block border border-[var(--color-ink)] px-5 py-2.5 font-medium"
          >
            {bookRelease.hero.rsvpCta}
          </a>
        </p>
      </Container>

      {/* Invitation */}
      <Section id="invitation" heading={bookRelease.invitation.heading}>
        <Prose>
          {bookRelease.invitation.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>
        <TodoNote>
          A personal invitation in Kata&apos;s own words would sit here (§10).
        </TodoNote>
      </Section>

      {/* About the book */}
      <Section id="book" heading={bookRelease.aboutBook.heading} tone="sunken">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
          <div className="flex aspect-[2/3] items-center justify-center border border-dashed border-[var(--color-line)] bg-white text-sm text-[var(--color-ink-muted)]">
            {isResolved(book.cover) ? "cover" : "Book cover"}
          </div>
          <div>
            <h3 className="text-lg">{bookRelease.aboutBook.synopsisHeading}</h3>
            {isResolved(book.synopsis[locale]) ? (
              <Prose>
                <p>{book.synopsis[locale]}</p>
              </Prose>
            ) : (
              <TodoNote>
                Book synopsis (<code>book.synopsis.{locale}</code>).
              </TodoNote>
            )}

            {book.themes[locale].length > 0 ? (
              <>
                <h3 className="mt-6 text-lg">{bookRelease.aboutBook.themesHeading}</h3>
                <ul className="mt-2 list-disc pl-5 text-[var(--color-ink-muted)]">
                  {book.themes[locale].map((theme) => (
                    <li key={theme}>{theme}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {isResolved(book.purchaseUrl) ? (
              <p className="mt-6">
                <ExternalAnchor href={book.purchaseUrl}>
                  {bookRelease.aboutBook.purchaseLabel}
                </ExternalAnchor>
              </p>
            ) : (
              <TodoNote>
                Publisher / purchase link (<code>book.purchaseUrl</code>). No
                on-site shop for MVP (§21.14).
              </TodoNote>
            )}
          </div>
        </div>
      </Section>

      {/* Programme — only when there genuinely is one (§10) */}
      {launchEvent.programme.length > 0 ? (
        <Section id="programme" heading={bookRelease.programme.heading}>
          <ol className="max-w-xl">
            {launchEvent.programme.map((item) => (
              <li
                key={item.time}
                className="flex gap-6 border-b border-[var(--color-line)] py-3"
              >
                <span className="w-16 shrink-0 tabular-nums">{item.time}</span>
                <span>{item.description[locale]}</span>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* Location */}
      <Section id="location" heading={bookRelease.location.heading}>
        {address.length > 0 ? (
          <>
            <address className="not-italic">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-4">
              {/* A plain directions link — no Maps JS API, no key in the
                  browser, and it opens the user's own maps app. */}
              <ExternalAnchor href={directionsUrl(address.join(", "))}>
                {bookRelease.location.directionsLabel}
              </ExternalAnchor>
            </p>
          </>
        ) : (
          <TodoNote>
            Venue name and address (<code>launchEvent.venueName</code>,
            <code>launchEvent.addressLine</code>).
          </TodoNote>
        )}

        {isResolved(launchEvent.accessibility[locale]) ? (
          <>
            <h3 className="mt-6 text-lg">
              {bookRelease.location.accessibilityHeading}
            </h3>
            <Prose>
              <p>{launchEvent.accessibility[locale]}</p>
            </Prose>
          </>
        ) : (
          <TodoNote>
            Accessibility information for the venue
            (<code>launchEvent.accessibility.{locale}</code>).
          </TodoNote>
        )}
      </Section>

      {/* RSVP */}
      <Section id="rsvp" heading={bookRelease.rsvp.heading} tone="sunken">
        <Prose>
          <p>{bookRelease.rsvp.intro}</p>
        </Prose>
        <div className="mt-8">
          <RsvpForm
            locale={locale}
            forms={content.forms}
            labels={bookRelease.rsvp}
            guestsAllowed={guestsAllowed}
            maxGuests={launchEvent.maxPlacesPerRsvp}
            calendar={calendar}
          />
        </div>
        {!isResolved(launchEvent.guestsAllowed) ? (
          <TodoNote>
            Whether +1s are permitted (<code>launchEvent.guestsAllowed</code>).
            Until confirmed, the guests field is hidden and every RSVP counts as
            one person.
          </TodoNote>
        ) : null}
      </Section>

      <BookJsonLd locale={locale} />
      <EventJsonLd locale={locale} />
    </div>
  );
}
