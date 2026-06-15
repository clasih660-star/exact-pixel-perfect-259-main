import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { HeliosCanvas } from "@/components/landing/HeliosCanvas";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CinematicSceneManager } from "@/components/landing/CinematicSceneManager";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { HeroSection } from "@/components/landing/sections";
import { createSeoHead, faqSchema, organizationSchema, softwareApplicationSchema } from "@/lib/seo";
import { CinematicCursor } from "@/components/landing/CinematicCursor";
import { InteractionLayer } from "@/components/landing/InteractionLayer";
import "@/styles/landing.css";

/* ── Lazy-loaded sections (everything after the hero) ── */
const InstitutionStrip = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.InstitutionStrip })));
const ProblemSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.ProblemSection })));
const ClassroomExperienceSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.ClassroomExperienceSection })));
const HowItWorksSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.HowItWorksSection })));
const FeaturesSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.FeaturesSection })));
const AccessibilitySection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.AccessibilitySection })));
const UseCasesSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.UseCasesSection })));
const InstitutionSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.InstitutionSection })));
const ComparisonSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.ComparisonSection })));
const PricingPreviewSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.PricingPreviewSection })));
const FAQSection = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.FAQSection })));
const FinalCTA = lazy(() => import("@/components/landing/sections").then(m => ({ default: m.FinalCTA })));

/* SEO FAQ data mirrored for JSON-LD structured data (FAQPage). */
const FAQ_ITEMS = [
  {
    question: "What is Klassruum?",
    answer:
      "Klassruum is an AI-powered virtual classroom platform. Institutions upload course materials, generate structured lessons, and let an AI teacher deliver those lessons inside a realistic classroom with a whiteboard, voice, captions, notes, transcripts, learner questions, accessibility modes, and progress tracking.",
  },
  {
    question: "How does the AI teacher work?",
    answer:
      "The AI teacher follows a pre-developed lesson plan, introduces the lesson, writes on the whiteboard, reads each item, explains it, and answers learner questions in real time using the current lesson and the institution's course materials.",
  },
  {
    question: "Is Klassruum a chatbot?",
    answer:
      "No. Klassruum delivers a complete, structured lesson from start to finish and tutors on demand within that lesson. The classroom is the product, not a chat window.",
  },
  {
    question: "Can institutions upload their own course content?",
    answer:
      "Yes. You can upload PDFs, slides, documents, syllabi, and images, and Klassruum generates structured lessons for a teacher or admin to review and publish.",
  },
  {
    question: "How does Klassruum support learners with disabilities?",
    answer:
      "Accessibility is built in: live captions, full transcripts, keyboard navigation, screen reader support, high contrast, large text, reduced motion, focus mode, adjustable speech speed, and text-first or voice-first questions, with dedicated learner modes.",
  },
  {
    question: "How is learner progress tracked?",
    answer:
      "Klassruum records learning activity such as lessons started and completed, time spent, questions asked, checkpoints reached, notes and transcripts generated, replay count, progress percentage, and areas needing review.",
  },
];

export const Route = createFileRoute("/")({
  head: () =>
    createSeoHead({
      title: "Klassruum | Premium AI Virtual Classrooms & Tutoring for Institutions",
      description:
        "Klassruum turns curriculum materials into structured, accessible, teacher-led AI classrooms. Fully equipped with an interactive whiteboard, live captions, transcripts, notes, and institutional progress tracking. GDPR-compliant and WCAG-ready.",
      path: "/",
      keywords:
        "AI virtual classroom platform, AI teacher, accessible online learning platform, LMS alternative for schools, AI tutor for institutions, course materials to lessons, AI whiteboard, learner progress tracking, GDPR compliant learning, WCAG virtual classroom",
      jsonLd: [softwareApplicationSchema(), organizationSchema(), faqSchema(FAQ_ITEMS)],
    }),
  component: LandingPage,
});

/** Minimal fallback for lazy-loaded sections */
function SectionFallback() {
  return <div className="min-h-[30vh] flex items-center justify-center text-slate text-xs font-semibold" aria-hidden>Loading section...</div>;
}

function LandingPage() {
  const { tier, config: tierConfig, reducedMotion } = useDeviceTier();

  return (
    <div
      className="landing-page min-h-screen antialiased selection:bg-learning-blue/20 selection:text-academic-navy bg-cloud-white text-deep-ink relative"
    >
      {/* Clean grid background backdrop */}
      <HeliosCanvas
        sceneState={{ sceneIndex: 0, sceneProgress: 0, scrollProgress: 0 }}
        tierConfig={tierConfig}
        reducedMotion={reducedMotion}
      />

      {/* Premium cinematic cursor and scroll interaction layers */}
      <CinematicCursor />
      <InteractionLayer />

      {/* Main header navigation */}
      <Header />

      {/* Clean content container with scroll entrance animations */}
      <main className="landing-main relative z-10 pt-[76px]">
        <CinematicSceneManager onSceneUpdate={() => {}} reducedMotion={reducedMotion}>
          {/* Section 1: Hero and classroom visual */}
          <HeroSection />

          {/* Section 2: Institution strip */}
          <Suspense fallback={<SectionFallback />}>
            <InstitutionStrip />
          </Suspense>

          {/* Section 3: Fragmented learning versus Klassruum */}
          <Suspense fallback={<SectionFallback />}>
            <ProblemSection />
          </Suspense>

          {/* Section 4: Live classroom demonstration */}
          <Suspense fallback={<SectionFallback />}>
            <ClassroomExperienceSection />
          </Suspense>

          {/* Section 5: Four-step workflow */}
          <Suspense fallback={<SectionFallback />}>
            <HowItWorksSection />
          </Suspense>

          {/* Section 6: Feature bento grid */}
          <Suspense fallback={<SectionFallback />}>
            <FeaturesSection />
          </Suspense>

          {/* Section 7: Accessibility experience */}
          <Suspense fallback={<SectionFallback />}>
            <AccessibilitySection />
          </Suspense>

          {/* Section 8: Institution use cases */}
          <Suspense fallback={<SectionFallback />}>
            <UseCasesSection />
          </Suspense>

          {/* Section 9: Administration and governance */}
          <Suspense fallback={<SectionFallback />}>
            <InstitutionSection />
          </Suspense>

          {/* Section 10: Comparison and learning evidence */}
          <Suspense fallback={<SectionFallback />}>
            <ComparisonSection />
          </Suspense>

          {/* Section 11: Pricing */}
          <Suspense fallback={<SectionFallback />}>
            <PricingPreviewSection />
          </Suspense>

          {/* Section 12: Focused FAQ */}
          <Suspense fallback={<SectionFallback />}>
            <FAQSection />
          </Suspense>

          {/* Section 13: Final CTA */}
          <Suspense fallback={<SectionFallback />}>
            <FinalCTA />
          </Suspense>
        </CinematicSceneManager>
      </main>

      <Footer />
    </div>
  );
}
