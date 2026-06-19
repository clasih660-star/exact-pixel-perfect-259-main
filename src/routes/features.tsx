import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { createSeoHead, webPageSchema } from "@/lib/seo";
import {
  GraduationCap,
  PenLine,
  Mic,
  Brain,
  MessageSquare,
  Accessibility,
  BookOpen,
  BarChart3,
  Monitor,
  FolderOpen,
  Lock,
  Globe,
} from "lucide-react";

const DESCRIPTION =
  "Explore Klassruum features for institutions: AI teacher-led lessons, interactive whiteboard, materials-to-lessons generation, live captions, transcripts, accessibility modes, learner progress evidence, and role-based dashboards.";

export const Route = createFileRoute("/features")({
  head: () =>
    createSeoHead({
      title: "Features — AI Virtual Classroom Platform for Institutions | Klassruum",
      description: DESCRIPTION,
      path: "/features",
      keywords:
        "AI classroom features, virtual classroom platform features, AI teacher-led lessons, interactive whiteboard, lesson generation, accessibility modes, institution dashboards, learner progress analytics",
      jsonLd: [webPageSchema("Klassruum Features", "/features", DESCRIPTION)],
    }),
  component: () => (
    <InfoPage
      eyebrow="Platform features"
      title="Everything a real lesson needs, in one classroom"
      intro="Klassruum is classroom infrastructure — not a chatbot, a video player, or a content library. Each feature is built around delivering and recording a complete, accessible lesson."
      cta={{ label: "Try the demo classroom", to: "/demo/classroom" }}
      sections={[
        {
          icon: <GraduationCap size={20} />,
          title: "AI teacher-led lessons",
          body: "A virtual teacher follows a structured lesson plan — introducing, demonstrating, and explaining each step like a real educator.",
        },
        {
          icon: <PenLine size={20} />,
          title: "Interactive whiteboard",
          body: "Lesson content is written out step by step on a real-feeling whiteboard, with everything spoken also typed for reading.",
        },
        {
          icon: <Mic size={20} />,
          title: "Voice and text questions",
          body: "Learners ask questions by speaking or typing at any point during the lesson, without breaking the flow.",
        },
        {
          icon: <Brain size={20} />,
          title: "Context-aware answers",
          body: "Answers are grounded in the current lesson and the institution's own course materials — not generic web responses.",
        },
        {
          icon: <MessageSquare size={20} />,
          title: "Live captions & transcript",
          body: "Every spoken line is captioned in real time and saved to a full, reviewable transcript.",
        },
        {
          icon: <Accessibility size={20} />,
          title: "Accessibility modes",
          body: "Dedicated modes for deaf, low-vision, dyslexia, ADHD focus, and more adapt the classroom to each learner.",
        },
        {
          icon: <BookOpen size={20} />,
          title: "Notes & lesson replay",
          body: "Clean, revision-ready notes are generated as the lesson runs, and learners can replay any step.",
        },
        {
          icon: <BarChart3 size={20} />,
          title: "Learner progress tracking",
          body: "Track lessons started and completed, questions asked, checkpoints reached, and areas needing review.",
        },
        {
          icon: <Monitor size={20} />,
          title: "Institution dashboards",
          body: "Admins manage programmes, courses, teachers, and learners, and monitor active classrooms in one place.",
        },
        {
          icon: <FolderOpen size={20} />,
          title: "Materials to lessons",
          body: "Upload PDFs, slides, documents, syllabi, and images, and generate ready-to-review structured lessons.",
        },
        {
          icon: <Lock size={20} />,
          title: "Security & data control",
          body: "Role-based access, encrypted data, audit logging, and institution-controlled retention and deletion.",
        },
        {
          icon: <Globe size={20} />,
          title: "Works everywhere",
          body: "Browser-based, low-bandwidth friendly, and runs on modest devices — built for real classrooms.",
        },
      ]}
    >
      <div className="rounded-[28px] border border-[#D1ECEB] bg-white p-8 shadow-[0_18px_54px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1F22]">
          Built around complete learning workflows, not isolated tools
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            [
              "For admins",
              "Create programmes, upload institutional materials, invite staff and learners, monitor usage, and control settings from role-based dashboards.",
            ],
            [
              "For teachers",
              "Review generated lessons, preview the AI classroom, supervise sessions, answer learner questions, and use progress evidence for intervention.",
            ],
            [
              "For learners",
              "Enter structured lessons, ask by voice or text, follow captions, save notes, replay difficult sections, and track personal progress.",
            ],
            [
              "For parents",
              "See linked learner reports, progress trends, session summaries, and teacher messages without changing academic delivery.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-[#F7FAFA] p-5 ring-1 ring-[#DDE8EE]">
              <h3 className="font-bold text-[#10212B]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#526779]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </InfoPage>
  ),
});
