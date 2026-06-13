import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/classroom")({
  head: () => ({
    meta: [
      { title: "The Classroom — Klassruum" },
      { name: "description", content: "A live, teacher-led virtual classroom with voice, whiteboard, captions and built-in accessibility." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Product"
      title="A real classroom, online"
      intro="Klassruum recreates the rhythm of a real lesson: a teacher who writes on the board, explains each step aloud, checks understanding, and adapts to every learner — with captions, voice, and accessibility built in from the start."
      cta={{ label: "Try the live demo", to: "/demo/classroom" }}
      sections={[
        { icon: "🧑‍🏫", title: "A teacher who teaches", body: "Lessons are taught step by step — written on the board and explained aloud, just like a classroom you'd walk into." },
        { icon: "📝", title: "Living whiteboard", body: "Concepts, equations and diagrams appear as the teacher writes them, with notes captured automatically for review." },
        { icon: "💬", title: "Ask anytime", body: "Raise your hand, ask by voice or text, and get a grounded answer without losing your place in the lesson." },
        { icon: "🎧", title: "Captions & audio", body: "Every word is captioned and spoken, with adjustable size and speed for the way each learner takes things in." },
        { icon: "♿", title: "Accessibility first", body: "Modes for low vision, deaf, dyslexia, ADHD focus and more reshape the lesson — not just the colours." },
        { icon: "📊", title: "Evidence, not exams", body: "Progress is captured as real learning activity — questions, practice and confidence — never a single high-stakes test." },
      ]}
    />
  ),
});
