import { createFileRoute } from "@tanstack/react-router";
import { getBlogApiPayload } from "@/lib/blog-content";

export const Route = createFileRoute("/api/blog")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(getBlogApiPayload(), {
          headers: {
            "Cache-Control": "public, max-age=300",
          },
        }),
    },
  },
});
