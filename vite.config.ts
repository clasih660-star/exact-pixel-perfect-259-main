// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split recharts into its own chunk (it pulls in d3 which is large)
            if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-") || id.includes("node_modules/victory-")) {
              return "vendor-charts";
            }
            // Split all @radix-ui/* into one chunk
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix";
            }
            // Split the heavy classroom engine files into their own chunk
            if (
              id.includes("AIVideoClassroom") ||
              id.includes("VideoClassroomPage") ||
              id.includes("InteractiveClassroomPage") ||
              id.includes("classroom.engine") ||
              id.includes("classroom.reducer")
            ) {
              return "classroom-engine";
            }
            // Supabase client
            if (id.includes("node_modules/@supabase")) {
              return "vendor-supabase";
            }
          },
        },
      },
    },
  },
});
