import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/classroom")({
  head: () => ({
    meta: [
      { title: "AI Virtual Classroom with Whiteboard, Voice & Accessibility | Klassruum" },
      {
        name: "description",
        content:
          "Explore Klassruum's AI virtual classroom: a teacher-led online lesson space with live whiteboard writing, voice explanations, captions, transcripts, learner questions, accessibility modes, and progress evidence.",
      },
      {
        name: "keywords",
        content:
          "AI virtual classroom, online classroom, AI teacher, interactive whiteboard, live captions, accessible learning platform, classroom transcript, lesson replay, learner progress evidence",
      },
      { name: "author", content: "Klassruum" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AI Virtual Classroom with Voice, Whiteboard & Captions | Klassruum" },
      {
        property: "og:description",
        content:
          "A real classroom online: AI teacher, live whiteboard, voice, captions, accessibility modes, notes, transcripts, and learner progress evidence.",
      },
      { property: "og:url", content: `${SITE_URL}/classroom` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klassruum AI Virtual Classroom" },
      {
        name: "twitter:description",
        content:
          "Experience a structured AI teacher-led classroom with whiteboard, voice, captions, transcript, notes, and accessibility built in.",
      },
    ],
  }),
  component: ClassroomRoute,
});

function ClassroomRoute() {
  const location = useLocation();

  // This route has nested children such as /classroom/demo,
  // /classroom/session/$sessionId and /classroom/preview/$lessonId. The parent
  // must render <Outlet /> for those routes; otherwise the marketing page masks
  // the actual classroom and makes demos look like they are not opening.
  if (location.pathname !== "/classroom") {
    return <Outlet />;
  }

  return (
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
  );
}
