import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { createSeoHead, faqSchema, webPageSchema } from "@/lib/seo";

const DESCRIPTION =
  "See how Klassruum runs from institution setup to course materials, AI lesson generation, teacher review, learner classrooms, parent visibility, and progress evidence.";

const FAQ_ITEMS = [
  {
    question: "How does an institution start using Klassruum?",
    answer:
      "An institution registers, creates programmes and courses, invites teachers and learners, uploads approved course materials, then generates and reviews lessons before publishing them to classrooms.",
  },
  {
    question: "What does the teacher do if the AI teaches the lesson?",
    answer:
      "Teachers remain in control. They review lesson content, attach resources, preview sessions, supervise learner activity, answer follow-up messages, and intervene where progress evidence shows learners need support.",
  },
  {
    question: "What does a learner experience?",
    answer:
      "A learner enters a structured classroom where the AI teacher explains aloud, writes on the whiteboard, captions every step, accepts voice or text questions, saves notes and transcripts, and tracks progress.",
  },
];

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    createSeoHead({
      title: "How Klassruum Works — From Course Materials to AI Virtual Classrooms",
      description: DESCRIPTION,
      path: "/how-it-works",
      keywords:
        "how AI virtual classrooms work, course materials to AI lessons, AI teacher workflow, institution LMS workflow, accessible online classroom process",
      jsonLd: [
        webPageSchema("How Klassruum Works", "/how-it-works", DESCRIPTION),
        faqSchema(FAQ_ITEMS),
      ],
    }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <InfoPage
      eyebrow="How it works"
      title="From approved course material to a complete AI-led classroom"
      intro="Klassruum is designed as an institution workflow. Admins organise the academic structure, teachers review delivery, learners experience a real classroom flow, parents see progress, and platform admins keep the whole ecosystem reliable."
      cta={{ label: "Register your institution", to: "/institutions/register" }}
      sections={[
        {
          icon: "🏫",
          title: "1. Set up the institution",
          body: "Create the institution profile, define programmes, invite institution admins, teachers, learners, and parents, and configure billing, privacy, accessibility, and role access.",
        },
        {
          icon: "📚",
          title: "2. Build programmes and courses",
          body: "Group learning into programmes, create courses under each programme, assign teachers, enrol learners, and define the subject, level, timeline, and learning outcomes.",
        },
        {
          icon: "📁",
          title: "3. Upload approved materials",
          body: "Add syllabi, PDFs, slides, worksheets, documents, links, and images. Klassruum extracts text and visual context so lessons stay grounded in institutional content.",
        },
        {
          icon: "✨",
          title: "4. Generate structured lessons",
          body: "AI transforms materials into lesson sections, whiteboard teaching items, spoken explanations, accessible descriptions, learner notes, checkpoints, and summaries.",
        },
        {
          icon: "🧑‍🏫",
          title: "5. Teacher reviews and publishes",
          body: "Teachers preview the lesson, adjust examples, attach resources, validate accuracy, and choose whether the session runs as AI teacher-led, human-led, or hybrid.",
        },
        {
          icon: "🎓",
          title: "6. Learners enter the classroom",
          body: "Learners follow the teacher, whiteboard, captions, notes, transcript, practice checks, accessibility settings, and ask questions by text or voice without losing the lesson flow.",
        },
        {
          icon: "📊",
          title: "7. Evidence is captured",
          body: "The platform records session events, questions, board snapshots, notes, time spent, progress percentage, confidence checks, weak areas, and recommendations.",
        },
        {
          icon: "👪",
          title: "8. Parents and staff support progress",
          body: "Parents view linked learner reports while teachers and institution admins use analytics to plan intervention, messaging, resources, and next lessons.",
        },
        {
          icon: "🛡️",
          title: "9. Platform admins keep it reliable",
          body: "Platform admins manage institutions, usage, support, plans, AI settings, audit logs, system health, and reusable KingPin course content.",
        },
      ]}
    >
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#D1ECEB] bg-white p-8 shadow-[0_18px_54px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1F22]">
            The relationship model
          </h2>
          <p className="mt-3 leading-7 text-[#526779]">
            Platform admins manage many institutions. Each institution owns programmes, courses,
            materials, users, sessions, and learning data. Programmes contain courses. Courses
            contain materials and lessons. Lessons contain sections and teaching items. Sessions
            connect learners, teachers, AI teaching events, notes, transcripts, questions, progress
            evidence, and reports.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Database-backed",
              "Programmes, courses, materials, lessons, sections, teaching items, sessions, notes, questions, results, recommendations, and notifications map directly to the platform workflow.",
            ],
            [
              "Role-aware",
              "Admin, institution, teacher, learner, and parent dashboards expose different actions while sharing the same academic data model.",
            ],
            [
              "Accessibility-first",
              "Captions, transcripts, descriptions, keyboard use, text scale, contrast, and pace controls are part of the classroom flow, not optional decoration.",
            ],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl bg-[#F7FAFA] p-6 ring-1 ring-[#DDE8EE]">
              <h3 className="font-bold text-[#10212B]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#526779]">{body}</p>
            </article>
          ))}
        </section>
      </div>
    </InfoPage>
  );
}
