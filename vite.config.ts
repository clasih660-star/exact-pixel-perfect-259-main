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
      // Silence the >500kB warning after splitting; the manualChunks below keeps
      // the initial JS payload lean while letting data-viz / 3-D load on demand.
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            // React core — stable, shared by every route
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
              return "vendor-react";
            }
            // TanStack router/query/start — also on the critical path
            if (id.includes("@tanstack")) return "vendor-tanstack";
            // Supabase client — needed for auth + data
            if (id.includes("@supabase")) return "vendor-supabase";
            // Radix primitives — used across the shadcn/ui components
            if (id.includes("@radix-ui")) return "vendor-radix";
            // Heavy charting library — only used on analytics/reports pages
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
            // 3D engine — only used by the marketing hero / classroom preview
            if (id.includes("three") || id.includes("@types/three")) return "vendor-three";
            // Animation libs
            if (id.includes("gsap")) return "vendor-gsap";
            // AI SDK — only used inside classroom / lesson-gen flows
            if (id.includes("@ai-sdk") || id.includes("/ai/")) return "vendor-ai";
          },
        },
      },
    },
  },
});
