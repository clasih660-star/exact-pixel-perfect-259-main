import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — Klassruum" },
      {
        name: "description",
        content:
          "Guides and reference for setting up institutions, courses, lessons and the Klassruum classroom.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Documentation"
      title="Everything you need to run Klassruum"
      intro="Step-by-step guides for administrators, teachers and developers — from registering your institution to authoring lessons and understanding learner evidence."
      cta={{ label: "Visit the Help Center", to: "/help" }}
      sections={[
        {
          icon: "🚀",
          title: "Getting started",
          body: "Register your institution, invite teachers and learners, and launch your first course.",
        },
        {
          icon: "📝",
          title: "Authoring lessons",
          body: "Turn your materials into structured, teacher-led lessons grounded in your own content.",
        },
        {
          icon: "🏫",
          title: "Running the classroom",
          body: "How lessons are taught, how questions work, and how learners move through a session.",
        },
        {
          icon: "♿",
          title: "Accessibility settings",
          body: "Configure learning modes, captions, audio and display for diverse learners.",
        },
        {
          icon: "📊",
          title: "Reading the evidence",
          body: "Interpret activity, practice and confidence data for each learner.",
        },
        {
          icon: "🔐",
          title: "Data & privacy",
          body: "How learner data is stored, protected and controlled.",
        },
      ]}
    />
  ),
});
