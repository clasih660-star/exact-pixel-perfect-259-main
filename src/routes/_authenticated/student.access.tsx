import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/access")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="Learning Access"
      description="Accessibility preferences, captions, transcripts, voice input, focus mode, and lesson pace settings."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open settings", to: "/student/settings" }}
      items={[
        {
          label: "Captions and transcript",
          to: "/student/access",
          description: "Show text support during lessons and sessions.",
        },
        {
          label: "Focus mode and reduced motion",
          to: "/student/access",
          description: "Cut distractions and keep the lesson calm.",
        },
        {
          label: "Voice and keyboard shortcuts",
          to: "/student/access",
          description: "Stay productive with alternative input options.",
        },
      ]}
    />
  ),
});
