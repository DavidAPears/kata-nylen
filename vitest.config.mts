import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // next-intl imports "next/navigation" without an extension, which
      // vitest's ESM resolver rejects. Next itself resolves it fine; this
      // just points the resolver at the real file.
      "next/navigation": fileURLToPath(
        new URL("./node_modules/next/navigation.js", import.meta.url),
      ),
    },
  },
  test: {
    // Node by default — the libraries and API routes are server code. Component
    // tests opt into jsdom with a `@vitest-environment jsdom` docblock.
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        // next-intl ships ESM that imports "next/navigation" without an
        // extension. Processing it through vite lets the alias above resolve
        // that; left external, node's resolver rejects it.
        inline: ["next-intl"],
      },
    },
    restoreMocks: true,
  },
});
