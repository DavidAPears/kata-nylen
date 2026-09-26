import type { ReactNode } from "react";

/**
 * Root layout. Intentionally a pass-through: <html> and <body> are rendered by
 * `src/app/[locale]/layout.tsx`, which is the first place the active language
 * is known — and the `lang` attribute has to be correct (brief §7).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
