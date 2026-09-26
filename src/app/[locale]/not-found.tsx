import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/primitives";

export default function LocaleNotFound() {
  const locale = useLocale() as Locale;
  const { notFound } = getContent(locale);

  return (
    <Container className="py-24">
      <h1 className="text-4xl">{notFound.heading}</h1>
      <p className="mt-4 text-[var(--color-ink-muted)]">{notFound.body}</p>
      <p className="mt-8">
        <Link href={notFound.cta.href} className="underline underline-offset-4">
          {notFound.cta.label}
        </Link>
      </p>
    </Container>
  );
}
