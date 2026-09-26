import { getContent } from "@/content";
import { defaultLocale } from "@/i18n/routing";
import "./globals.css";

/**
 * Global 404 — reached only for paths outside any locale segment. The root
 * layout is a pass-through, so this page supplies its own <html>/<body>.
 */
export default function NotFound() {
  const { notFound, htmlLang } = getContent(defaultLocale);

  return (
    <html lang={htmlLang}>
      <body className="min-h-dvh">
        <main className="mx-auto max-w-5xl px-5 py-24">
          <h1 className="text-4xl">{notFound.heading}</h1>
          <p className="mt-4 text-[var(--color-ink-muted)]">{notFound.body}</p>
          <p className="mt-8">
            <a href={`/${defaultLocale}`} className="underline underline-offset-4">
              {notFound.cta.label}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
