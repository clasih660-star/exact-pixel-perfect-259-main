import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/LandingPage";
import { createSeoHead, faqSchema, organizationSchema, softwareApplicationSchema } from "@/lib/seo";

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
