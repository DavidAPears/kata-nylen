import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import {
  book,
  launchEvent,
  isResolved,
  resolved,
  bookTitleFor,
  bookTitlePlainFor,
  bookSubtitleFor,
  launchEventNameFor,
} from "@/content/facts";
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

  const cover = resolved(book.cover);
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
      {/*
        Event hero, built to echo the book's chapter openers: the nested leaf
        motif on navy, with the content sitting in the leaf's calm centre.
        The pattern is a background image rather than inline SVG so its 21KB
        of path data is cached separately instead of bloating every request.
      */}
      {/*
        The chapter-opener motif is portrait; a wide hero fights it. So rather
        than stretching or over-zooming it, the pattern gets its own panel at
        its natural proportions on wide screens and the content sits beside it
        on flat navy, which also makes contrast a non-issue.

        On a phone the viewport is already portrait, so the pattern works
        full-bleed behind the content exactly as it does in the book.
      */}
      <div className="relative isolate overflow-hidden bg-[var(--color-book-navy)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-center bg-no-repeat sm:hidden"
          style={{
            backgroundImage: "url(/leaf-pattern.svg)",
            backgroundSize: "auto 155%",
          }}
        />
        {cover ? (
          <div className="absolute inset-y-0 left-0 hidden w-[44%] items-center justify-center sm:flex">
            <Image
              src={cover.src}
              alt={cover.alt[locale]}
              width={cover.width}
              height={cover.height}
              priority
              sizes="(min-width: 640px) 30vw, 0px"
              className="max-h-[78%] w-auto rounded-sm shadow-2xl shadow-black/40"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[44%] bg-cover bg-center sm:block"
            style={{ backgroundImage: "url(/leaf-pattern.svg)" }}
          />
        )}

        <Container className="relative py-24 text-center sm:py-28 sm:text-left">
          <div className="sm:ml-[46%]">
          {/*
            The book title stays the headline: this is a book launch, and the
            title is what people search for. The evening's own name sits above
            it so the page still matches the invitation, which leads with it.
          */}
          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-[var(--color-book-orange-text)]">
            {/*
              The event's own name alone read as "some evening event". This is
              a book launch, and saying so is the point of the page, so both
              sit here. The bracketed English gloss of "Resilienssalong" is
              dropped: at this size it made the line unreadable, and "Book
              launch" now carries the meaning anyway.
            */}
            {resolved(launchEvent.name[locale]) ?? launchEventNameFor(locale)}
            <span aria-hidden="true" className="mx-2 opacity-60">
              /
            </span>
            {bookRelease.hero.launchLabel}
          </p>
          {/*
            Two renderings of the same title, one shown at a time.

            On wide screens the cover sits beside this and already shows the
            Swedish title, so repeating it in brackets is clutter: English
            pages get the English title alone. On a phone the cover is not in
            the hero, so the Swedish title leads with the translation in
            brackets, keeping the real, searchable title visible.

            Both use `hidden`, which is display:none, so assistive technology
            reads whichever one is actually shown and never both.
          */}
          <h1 className="max-w-xl text-4xl text-[var(--color-book-cream-light)] sm:text-5xl">
            <span className="sm:hidden">
              {bookTitleFor(locale) ?? bookRelease.hero.heading}
            </span>
            <span className="hidden sm:inline">
              {bookTitlePlainFor(locale) ?? bookRelease.hero.heading}
            </span>
          </h1>
          {bookSubtitleFor(locale) ? (
            <p className="mt-4 max-w-xl text-sm uppercase tracking-[0.12em] text-[var(--color-book-cream)]/80">
              {bookSubtitleFor(locale)}
            </p>
          ) : null}

          <dl className="mt-10 grid max-w-lg gap-6 text-[var(--color-book-cream-light)] sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-book-orange-text)]">
                {bookRelease.hero.dateLabel}
              </dt>
              <dd className="mt-1">
                {formatDate(startsAt, locale) ?? bookRelease.hero.toBeConfirmed}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-book-orange-text)]">
                {bookRelease.hero.timeLabel}
              </dt>
              <dd className="mt-1">
                {formatTime(startsAt, locale)
                  ? `${formatTime(startsAt, locale)}${
                      formatTime(endsAt, locale) ? `-${formatTime(endsAt, locale)}` : ""
                    }`
                  : bookRelease.hero.toBeConfirmed}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-book-orange-text)]">
                {bookRelease.hero.venueLabel}
              </dt>
              <dd className="mt-1">{venueName ?? bookRelease.hero.toBeConfirmed}</dd>
            </div>
          </dl>

          <p className="mt-10">
            <a
              href="#rsvp"
              className="inline-block bg-[var(--color-book-orange)] px-7 py-3 font-medium text-[var(--color-book-navy-deep)] hover:brightness-95"
            >
              {bookRelease.hero.rsvpCta}
            </a>
          </p>
          </div>
        </Container>
      </div>

      {!startsAt || !venueName ? (
        <Container className="pt-6">
          <TodoNote>
            Event date, time and venue (<code>launchEvent.*</code>). Until these
            are confirmed the page shows a to-be-confirmed placeholder rather
            than invented details, and no Event structured data or calendar
            file is emitted.
          </TodoNote>
        </Container>
      ) : null}

      {/* Invitation */}
      <Section ornament id="invitation" heading={bookRelease.invitation.heading}>
        <Prose>
          {bookRelease.invitation.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>

        {/*
          What the evening holds, as the invitation lists it. Middots between
          items on screen, but a real <ul> underneath, so a screen reader
          announces it as a list of six things rather than one run-on line.
        */}
        {launchEvent.includes[locale].length > 0 ? (
          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              {bookRelease.invitation.includesHeading}
            </h3>
            <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
              {launchEvent.includes[locale].map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-[var(--color-accent)]">
                      ·
                    </span>
                  ) : null}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* The people appearing. Real people, so named properly. */}
        {launchEvent.guests.length > 0 ? (
          <p className="mt-8 text-[var(--color-ink-muted)]">
            <span className="text-[var(--color-ink)]">Kata Nylén</span>{" "}
            {bookRelease.invitation.withLabel}{" "}
            {launchEvent.guests.map((guest, index) => (
              <span key={guest.name}>
                {index > 0 ? ", " : ""}
                <span className="text-[var(--color-ink)]">{guest.name}</span>{" "}
                ({guest.role[locale]})
              </span>
            ))}
          </p>
        ) : null}
      </Section>

      {/* About the book */}
      <Section ornament id="book" heading={bookRelease.aboutBook.heading} tone="sunken">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt[locale]}
              width={cover.width}
              height={cover.height}
              sizes="(min-width: 640px) 200px, 60vw"
              className="w-full rounded-sm shadow-lg shadow-black/15"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center border border-dashed border-[var(--color-line)] bg-white text-sm text-[var(--color-ink-muted)]">
              Book cover
            </div>
          )}
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
        <Section ornament id="programme" heading={bookRelease.programme.heading}>
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
      <Section ornament id="location" heading={bookRelease.location.heading}>
        {address.length > 0 ? (
          <>
            <address className="not-italic">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {/*
              The map is rendered only when a Maps key is configured. Without
              one the address and the directions link stand on their own,
              which is a perfectly good experience, so this never blocks.
              The image is proxied through our own route so the key stays
              server-side.
            */}
            {/*
              Plain <img> on purpose. The source is our own route, which
              already returns a correctly sized, long-cached PNG. next/image
              would add a second optimisation pass over an already optimised
              image, for no benefit and extra cost.
            */}
            {process.env.GOOGLE_MAPS_API_KEY ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/api/venue-map"
                alt=""
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className="mt-6 w-full max-w-2xl rounded-xl border border-[var(--color-line)]"
              />
            ) : null}

            <p className="mt-4">
              {/* A plain directions link: no Maps JS API, no key in the
                  browser, and it opens the visitor's own maps app. */}
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
      <Section ornament id="rsvp" heading={bookRelease.rsvp.heading} tone="sunken">
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
