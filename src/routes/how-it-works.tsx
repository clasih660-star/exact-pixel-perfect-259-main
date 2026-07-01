import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ClipboardCheck, FileUp, Presentation, UserSearch, Waypoints } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Klassruum Works | From Course Material to AI-Taught Lesson" },
      {
        name: "description",
        content:
          "See how Klassruum turns institutional course materials into structured AI-taught lessons with learner interaction, accessibility support, and reviewable evidence.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="How it works"
      title="From uploaded materials to a taught lesson"
      intro="Klassruum follows a practical education workflow: prepare course material, structure the lesson, teach interactively, support learners, and review what happened afterwards."
      cta={{ label: "Explore features", to: "/features" }}
      sections={[
        {
          icon: <FileUp size={20} />,
          title: "1. Upload course material",
          body: "Teachers or institutions provide lesson resources, notes, policy documents, or curriculum content that ground the class.",
        },
        {
          icon: <Waypoints size={20} />,
          title: "2. Turn content into a lesson path",
          body: "Klassruum transforms source material into a clearer teaching sequence instead of leaving delivery to a single generic prompt.",
        },
        {
          icon: <Presentation size={20} />,
          title: "3. Teach inside the classroom",
          body: "The AI teacher explains, writes, captions, and guides the learner through a more classroom-like flow.",
        },
        {
          icon: <BookOpen size={20} />,
          title: "4. Answer learner questions",
          body: "Students can ask for clarification in context while staying anchored to the active lesson.",
        },
        {
          icon: <ClipboardCheck size={20} />,
          title: "5. Capture evidence and participation",
          body: "The platform records completion signals, activity, and question patterns that help teams understand learner engagement.",
        },
        {
          icon: <UserSearch size={20} />,
          title: "6. Review and intervene",
          body: "Teachers and institutions can follow up where learners struggled or where more support is needed.",
        },
      ]}
    >
      <section className="grid gap-6 md:grid-cols-3">
        {[
          ["Before the lesson", "Prepare approved content and decide which learners or groups the session is for."],
          ["During the lesson", "Guide explanation, give accessible support, and allow real-time questions and clarification."],
          ["After the lesson", "Review evidence, identify gaps, and plan intervention or reinforcement."],
        ].map(([title, body]) => (
          <div key={title} className="lp-premium-card p-6">
            <h2 className="text-heading text-xl font-bold">{title}</h2>
            <p className="text-body mt-2 text-sm leading-7">{body}</p>
          </div>
        ))}
      </section>
    </InfoPage>
  ),
});
