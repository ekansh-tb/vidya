import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      // `server-only` throws on import outside a Server Component. Under
      // Vitest there is no RSC graph, so importing a server module (lib/db/**)
      // in a test fails on the guard rather than on anything real. Stub it —
      // the guard still protects the actual Next build, which is where it
      // matters.
      "server-only": fileURLToPath(new URL("./test/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules/**", ".next/**", "skills/**", ".agents/**", ".claude/**"],
  },
});
