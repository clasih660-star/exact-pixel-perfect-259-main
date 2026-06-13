import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — AI Virtual Classroom Platform | Klassruum" },
      {
        name: "description",
        content:
          "Explore Klassruum features: AI teacher-led lessons, interactive whiteboard, live captions, transcripts, accessibility modes, lesson generation, progress tracking, and institution dashboards.",
      },
      { name: "keywords", content: "AI teacher features, virtual classroom features, interactive whiteboard, live captions, accessibility modes, lesson generation, progress tracking" },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Features — AI Virtual Classroom Platform | Klassruum" },
      { property: "og:description", content: "AI teacher-led lessons, interactive whiteboard, captions, transcripts, accessibility, and progress tracking — all in one classroom." },
      { property: "og:url", content: `${SITE_URL}/features` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klassruum Features" },
      { name: "twitter:description", content: "Everything a real lesson needs, in one AI-powered classroom." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/features` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Klassruum Features",
          url: `${SITE_URL}/features`,
          description:
            "AI teacher-led lessons, interactive whiteboard, live captions, transcripts, accessibility modes, lesson generation, progress tracking, and institution dashboards.",
        }),
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Platform features"
      title="Everything a real lesson needs, in one classroom"
      intro="Klassruum is classroom infrastructure — not a chatbot, a video player, or a content library. Each feature is built around delivering and recording a complete, accessible lesson."
      cta={{ label: "Try the demo classroom", to: "/demo/classroom" }}
      sections={[
        { icon: "🎓", title: "AI teacher-led lessons", body: "A virtual teacher follows a structured lesson plan — introducing, demonstrating, and explaining each step like a real educator." },
        { icon: "📝", title: "Interactive whiteboard", body: "Lesson content is written out step by step on a real-feeling whiteboard, with everything spoken also typed for reading." },
        { icon: "🎤", title: "Voice and text questions", body: "Learners ask questions by speaking or typing at any point during the lesson, without breaking the flow." },
        { icon: "🧠", title: "Context-aware answers", body: "Answers are grounded in the current lesson and the institution's own course materials — not generic web responses." },
        { icon: "💬", title: "Live captions & transcript", body: "Every spoken line is captioned in real time and saved to a full, reviewable transcript." },
        { icon: "♿", title: "Accessibility modes", body: "Dedicated modes for deaf, low-vision, dyslexia, ADHD focus, and more adapt the classroom to each learner." },
        { icon: "📒", title: "Notes & lesson replay", body: "Clean, revision-ready notes are generated as the lesson runs, and learners can replay any step." },
        { icon: "📊", title: "Learner progress tracking", body: "Track lessons started and completed, questions asked, checkpoints reached, and areas needing review." },
        { icon: "🖥️", title: "Institution dashboards", body: "Admins manage programmes, courses, teachers, and learners, and monitor active classrooms in one place." },
        { icon: "📁", title: "Materials to lessons", body: "Upload PDFs, slides, documents, syllabi, and images, and generate ready-to-review structured lessons." },
        { icon: "🔒", title: "Security & data control", body: "Role-based access, encrypted data, audit logging, and institution-controlled retention and deletion." },
        { icon: "🌍", title: "Works everywhere", body: "Browser-based, low-bandwidth friendly, and runs on modest devices — built for real classrooms." },
      ]}
    />
  ),
});
