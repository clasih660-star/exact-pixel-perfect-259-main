import { createFileRoute } from "@tanstack/react-router";
import "@/styles/landing.css";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  HeroSection,
  TrustStrip,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  HowItWorksSection,
  ClassroomExperienceSection,
  AITeacherSection,
  SubjectsSection,
  AccessibilitySection,
  InstitutionSection,
  ComparisonSection,
  UseCasesSection,
  AnalyticsSection,
  TestimonialsSection,
  FAQSection,
  FinalCTA,
} from "@/components/landing/sections";

const SITE_URL = "https://klassruum.com";

/* SEO FAQ data mirrored for JSON-LD structured data (FAQPage). */
const FAQ_LD: [string, string][] = [
  ["What is Klassruum?", "Klassruum is an AI-powered virtual classroom platform. Institutions upload course materials, generate structured lessons, and let an AI teacher deliver those lessons inside a realistic classroom with a whiteboard, voice, captions, notes, transcripts, learner questions, accessibility modes, and progress tracking."],
  ["How does the AI teacher work?", "The AI teacher follows a pre-developed lesson plan, introduces the lesson, writes on the whiteboard, reads each item, explains it, and answers learner questions in real time using the current lesson and the institution's course materials."],
  ["Is Klassruum a chatbot?", "No. Klassruum delivers a complete, structured lesson from start to finish and tutors on demand within that lesson. The classroom is the product, not a chat window."],
  ["Can institutions upload their own course content?", "Yes. You can upload PDFs, slides, documents, syllabi, and images, and Klassruum generates structured lessons for a teacher or admin to review and publish."],
  ["How does Klassruum support learners with disabilities?", "Accessibility is built in: live captions, full transcripts, keyboard navigation, screen reader support, high contrast, large text, reduced motion, focus mode, adjustable speech speed, and text-first or voice-first questions, with dedicated learner modes."],
  ["How is learner progress tracked?", "Klassruum records learning activity such as lessons started and completed, time spent, questions asked, checkpoints reached, notes and transcripts generated, replay count, progress percentage, and areas needing review."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klassruum | AI-Powered Virtual Classrooms for Schools and Institutions" },
      {
        name: "description",
        content:
          "Klassruum helps institutions create AI-powered virtual classrooms with an AI teacher, interactive whiteboard, captions, notes, transcripts, accessibility modes, and learner progress tracking.",
      },
      {
        name: "keywords",
        content:
          "AI classroom, AI teacher, virtual classroom, online learning platform, AI tutor for schools, classroom AI, education technology, accessible learning platform, AI whiteboard, LMS alternative, AI lessons, school learning platform",
      },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#2563EB" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },

      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Klassruum" },
      { property: "og:title", content: "Klassruum | AI-Powered Virtual Classrooms for Schools and Institutions" },
      {
        property: "og:description",
        content:
          "Turn course materials into structured, AI-led lessons delivered by a virtual teacher — with whiteboard, captions, notes, transcripts, accessibility modes, and progress tracking.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: "/images/scenes/scene-1.png" },

      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klassruum | AI-Powered Virtual Classrooms" },
      {
        name: "twitter:description",
        content:
          "AI teacher-led classrooms for schools and institutions: whiteboard, captions, notes, transcripts, accessibility, and progress tracking.",
      },
      { name: "twitter:image", content: "/images/scenes/scene-1.png" },
    ],
    // TODO: set the real production canonical URL before launch.
    links: [{ rel: "canonical", href: SITE_URL }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Klassruum",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          url: SITE_URL,
          description:
            "AI-powered virtual classroom platform that lets institutions turn course materials into structured, AI-led lessons delivered by a virtual teacher with an interactive whiteboard, captions, notes, transcripts, accessibility modes, and learner progress tracking.",
          // NOTE: no aggregateRating is included — add one only with verified review data.
          offers: { "@type": "Offer", category: "Subscription" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Klassruum",
          url: SITE_URL,
          description:
            "Klassruum is an AI-powered virtual classroom platform that helps institutions deliver structured, accessible, teacher-led learning experiences.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_LD.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ClassroomExperienceSection />
        <AITeacherSection />
        <SubjectsSection />
        <AccessibilitySection />
        <InstitutionSection />
        <ComparisonSection />
        <UseCasesSection />
        <AnalyticsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
