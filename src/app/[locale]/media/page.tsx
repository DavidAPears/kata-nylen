import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import Image from "next/image";
import {
  media,
  person,
  resolved,
  type MediaKind,
  type MediaItem,
} from "@/content/facts";
import { Container, Section, ExternalAnchor } from "@/components/primitives";
import { MEDIA_KIND_ICONS } from "@/components/MediaKindIcons";

/**
 * Where Kata's work has been covered.
 *
 * Its own page rather than a section of About: nineteen items would have
 * swamped that page, and a press list is something a journalist looks for
 * directly. Linked from the footer, not the main navigation.
 */

/** Television first, then radio, press, podcasts and the rest. */
const ORDER: MediaKind[] = ["tv", "radio", "print", "podcast", "web"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getContent(locale).media;
  return {
    title: copy.seo.title,
    description: copy.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/media" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/media" }),
        en: getPathname({ locale: "en", href: "/media" }),
        "x-default": getPathname({ locale: "sv", href: "/media" }),
      },
    },
    openGraph: { title: copy.seo.title, description: copy.seo.description },
  };
}

export function MediaEntry({
  item,
  locale,
  roles,
}: {
  item: MediaItem;
  locale: Locale;
  roles: ReturnType<typeof getContent>["media"]["roles"];
}) {
  // Moderating, running a workshop and being interviewed are different
  // things. Only the exceptions are labelled; an interview is the default.
  const role = item.role === "interview" ? null : roles[item.role];

  return (
    <li className="border-t border-[var(--color-line)] py-4">
      <ExternalAnchor href={item.url}>
        <span lang={locale === "sv" ? "sv" : undefined}>{item.title[locale]}</span>
      </ExternalAnchor>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        {[item.source, item.year, role].filter(Boolean).join(" · ")}
      </p>
    </li>
  );
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getContent(locale).media;
  // The monochrome shot: this page is effectively a press kit.
  const portrait = resolved(person.portraitMono);

  return (
    <>
      <Container className="py-14 sm:py-20">
        <div className="grid items-start gap-10 sm:grid-cols-[1.3fr_0.7fr] sm:gap-14">
          <div>
            <h1 className="text-4xl sm:text-5xl">{copy.hero.heading}</h1>
            <p className="mt-6 max-w-[var(--measure)] text-lg text-[var(--color-ink-muted)]">
              {copy.hero.standfirst}
            </p>

            {/*
              Jump links, sitting in the space under the copy rather than in a
              row of their own. The list below is long and sectioned, so this
              says what is here and takes you straight to it. Plain anchors:
              they work without JavaScript and are linkable in their own right.
            */}
            <nav aria-label={copy.jumpIntro} className="mt-10">
              <ul className="flex flex-wrap gap-2.5">
                {ORDER.map((kind) => {
                  if (!media.some((item) => item.kind === kind)) return null;
                  const Icon = MEDIA_KIND_ICONS[kind];
                  return (
                    <li key={kind}>
                      <a
                        href={`#${kind}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-3.5 py-2 text-sm transition-colors hover:border-[var(--color-leaf)] hover:bg-[var(--color-surface-sunken)]"
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--color-leaf)]" />
                        {copy.kinds[kind]}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {portrait ? (
            <Image
              src={portrait.src}
              alt={portrait.alt[locale]}
              width={portrait.width}
              height={portrait.height}
              priority
              sizes="(min-width: 640px) 32vw, 100vw"
              className="max-h-[46vh] w-full rounded-xl object-cover object-top sm:max-h-none"
            />
          ) : null}
        </div>

      </Container>

      {ORDER.map((kind, index) => {
        const items = media.filter((item) => item.kind === kind);
        if (items.length === 0) return null;
        return (
          <Section
            ornament
            key={kind}
            id={kind}
            heading={copy.kinds[kind]}
            tone={index % 2 === 1 ? "sunken" : "default"}
          >
            <ul className="max-w-3xl">
              {items.map((item) => (
                <MediaEntry key={item.id} item={item} locale={locale} roles={copy.roles} />
              ))}
            </ul>
          </Section>
        );
      })}
    </>
  );
}
