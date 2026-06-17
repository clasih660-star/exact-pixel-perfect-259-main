import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import {
  MessageSquare,
  PenLine,
  Key,
  Eye,
  Palette,
  Film,
  Brain,
  Volume2,
  MessageCircle,
} from "lucide-react";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — AI Virtual Classroom for Every Learner | Klassruum" },
      {
        name: "description",
        content:
          "Klassruum accessibility features: live captions, transcripts, keyboard navigation, screen reader support, high contrast, large text, reduced motion, focus mode, and dedicated learner modes for deaf, low-vision, dyslexia, and ADHD.",
      },
      {
        name: "keywords",
        content:
          "accessible classroom, live captions, transcript, keyboard navigation, screen reader, WCAG, inclusive learning, deaf accessibility, ADHD focus mode, dyslexia support",
      },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Accessibility — Built for Every Learner | Klassruum" },
      {
        property: "og:description",
        content:
          "Accessibility is built into Klassruum from day one — captions, transcripts, keyboard nav, screen reader support, and dedicated modes for diverse learners.",
      },
      { property: "og:url", content: `${SITE_URL}/accessibility` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klassruum Accessibility" },
      {
        name: "twitter:description",
        content:
          "A classroom designed for every learner — deaf, low-vision, neurodivergent, and more.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/accessibility` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Klassruum Accessibility",
          url: `${SITE_URL}/accessibility`,
          description:
            "Accessibility features built into Klassruum: live captions, transcripts, keyboard navigation, screen reader support, and dedicated learner modes.",
        }),
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Accessibility"
      title="Built for every learner"
      intro="Accessibility is a core part of the classroom, not an add-on. Klassruum adapts how a lesson is delivered so more learners can take part — built with WCAG-aligned design principles."
      cta={{ label: "Try the accessible classroom", to: "/demo/classroom" }}
      sections={[
        {
          icon: <MessageSquare size={20} />,
          title: "Live captions",
          body: "Every spoken line is captioned in real time — essential for deaf and hard-of-hearing learners, and useful for everyone.",
        },
        {
          icon: <PenLine size={20} />,
          title: "Full transcript",
          body: "A complete, searchable transcript is saved after every session for review and study.",
        },
        {
          icon: <Key size={20} />,
          title: "Keyboard navigation",
          body: "The entire classroom is navigable by keyboard — no mouse required.",
        },
        {
          icon: <Eye size={20} />,
          title: "Screen reader support",
          body: "ARIA labels, semantic HTML, and focus management ensure screen readers can navigate the classroom.",
        },
        {
          icon: <Palette size={20} />,
          title: "High contrast & large text",
          body: "Visual adjustments for learners who need stronger contrast or larger text sizes.",
        },
        {
          icon: <Film size={20} />,
          title: "Reduced motion",
          body: "Animations and transitions can be reduced for learners with motion sensitivity.",
        },
        {
          icon: <Brain size={20} />,
          title: "Focus mode",
          body: "Minimizes distractions and concentrates attention on the current whiteboard item.",
        },
        {
          icon: <Volume2 size={20} />,
          title: "Adjustable speech speed",
          body: "Control the pace of the AI teacher's speech to match comprehension needs.",
        },
        {
          icon: <MessageCircle size={20} />,
          title: "Text-first questions",
          body: "Learners who can't speak can ask questions entirely by typing.",
        },
      ]}
    >
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8">
        <h2 className="text-2xl font-bold text-[#0F172A]">Learner modes</h2>
        <p className="mt-3 leading-7 text-[#475569]">
          Klassruum includes dedicated modes that adapt the classroom for specific needs:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Standard learners",
            "Deaf & hard-of-hearing",
            "Blind & low-vision",
            "Dyslexia support",
            "ADHD focus mode",
            "Motor support",
            "Speech difficulty support",
            "Extra support mode",
            "Challenge mode",
          ].map((m) => (
            <span
              key={m}
              className="rounded-[999px] border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm text-[#475569]"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </InfoPage>
  ),
});
