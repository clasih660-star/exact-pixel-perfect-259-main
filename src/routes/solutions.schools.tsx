import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/solutions/schools")({
  head: () => ({
    meta: [
      { title: "Klassruum for Schools" },
      {
        name: "description",
        content:
          "Structured, teacher-led online lessons for primary and secondary schools — aligned to your curriculum and accessible to every learner.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Schools"
      title="Every lesson, taught well — for every learner"
      intro="Give primary and secondary classes consistent, curriculum-aligned lessons that teach the way a great teacher would: clear explanations, worked examples, checks for understanding, and accessibility for every child in the room."
      cta={{ label: "Book a school demo", to: "/contact" }}
      sections={[
        {
          icon: "📚",
          title: "Curriculum-aligned",
          body: "Lessons follow your scheme of work, grounded in your own approved materials — not generic content.",
        },
        {
          icon: "👩‍🏫",
          title: "Supports your teachers",
          body: "Teachers stay in control: assign lessons, review evidence, and step in where learners need them most.",
        },
        {
          icon: "♿",
          title: "Inclusive by default",
          body: "Captions, audio, and learning modes mean a class with mixed needs can learn the same lesson together.",
        },
        {
          icon: "📈",
          title: "Real progress evidence",
          body: "See engagement, questions and practice per learner — useful for parents' evenings and interventions.",
        },
        {
          icon: "🌍",
          title: "Works on modest devices",
          body: "Runs in the browser on low-cost hardware and patchy connections — built for real classrooms.",
        },
        {
          icon: "🔒",
          title: "Safe & private",
          body: "Learner data stays protected, with clear data-protection controls for schools.",
        },
      ]}
    />
  ),
});
