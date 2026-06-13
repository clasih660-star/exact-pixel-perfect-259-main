import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Klassruum — AI-Powered Virtual Classrooms" },
      {
        name: "description",
        content:
          "Learn about Klassruum's mission to transform education with AI-powered virtual classrooms that teach like real teachers — accessible, structured, and institution-ready.",
      },
      { name: "keywords", content: "about Klassruum, AI classroom company, education technology, virtual classroom platform, accessible education" },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "About Klassruum — AI-Powered Virtual Classrooms" },
      { property: "og:description", content: "Klassruum helps institutions deliver structured, accessible, AI teacher-led learning experiences at scale." },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Klassruum" },
      { name: "twitter:description", content: "AI-powered virtual classrooms that teach like real teachers." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Klassruum",
          url: `${SITE_URL}/about`,
          description:
            "Klassruum is an AI-powered virtual classroom platform that helps institutions deliver structured, accessible, teacher-led learning experiences.",
        }),
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="About us"
      title="Teaching that scales without losing the teacher"
      intro="Klassruum exists because online learning lost the one thing that matters most: an actual teacher delivering the lesson. We're building the classroom infrastructure that brings it back."
      cta={{ label: "Try the demo", to: "/demo/classroom" }}
      sections={[
        { icon: "🎯", title: "Our mission", body: "Make structured, accessible, teacher-led learning available to every institution — regardless of size, budget, or location." },
        { icon: "🧑‍🏫", title: "What we believe", body: "A real lesson needs a real teaching loop: introduction, demonstration, explanation, practice, and response. Not a chat window, not a document library." },
        { icon: "♿", title: "Accessibility first", body: "We believe every learner deserves access to quality teaching. Accessibility is built into the classroom from day one — not bolted on later." },
        { icon: "🏫", title: "Institution control", body: "Schools and organizations should own their content, manage their teachers and learners, and control their data. Klassruum provides the infrastructure." },
        { icon: "🌍", title: "Built for the real world", body: "Classrooms run on modest devices and patchy connections. We design for the constraints institutions actually face." },
        { icon: "📊", title: "Evidence over assumption", body: "Learning activity — not just completion rates — shows where learners engage and where they need support." },
      ]}
    >
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8">
        <h2 className="text-2xl font-bold text-[#0F172A]">Our story</h2>
        <p className="mt-4 leading-7 text-[#475569]">
          Klassruum was born from a simple observation: existing online learning tools solve pieces of the puzzle — content storage, video conferencing, Q&A chatbots — but none deliver a complete, structured lesson with a teacher who writes, explains, checks understanding, and responds in real time.
        </p>
        <p className="mt-4 leading-7 text-[#475569]">
          We set out to build the classroom itself: an AI teacher that follows a structured lesson plan, writes on an interactive whiteboard, speaks clearly, answers learner questions in context, and records everything — notes, transcripts, progress — for review.
        </p>
        <p className="mt-4 leading-7 text-[#475569]">
          Accessibility was never an afterthought. From the beginning, Klassruum was designed for deaf learners, low-vision learners, neurodivergent learners, and everyone in between. Because a classroom that doesn't include everyone isn't really a classroom.
        </p>
        <p className="mt-4 leading-7 text-[#475569]">
          Today, Klassruum serves schools, universities, tutoring centers, NGOs, and training providers — anywhere structured, accessible teaching needs to scale.
        </p>
      </div>
    </InfoPage>
  ),
});
