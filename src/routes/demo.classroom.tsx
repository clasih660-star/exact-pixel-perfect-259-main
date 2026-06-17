import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { AIVideoClassroom } from "@/components/classroom/AIVideoClassroom";
import { DEMO_LESSON_LIST, getDemoLessonContent } from "@/lib/demo-lessons/demo-lesson-registry";
import {
  Accessibility,
  Brain,
  CirclePlay as PlayCircle,
  Clock,
  GraduationCap,
  Sparkles,
  Video,
  Volume2,
} from "lucide-react";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/demo/classroom")({
  head: () => ({
    meta: [
      { title: "Try the AI Classroom Demo - Voice, Whiteboard & Accessibility | Klassruum" },
      {
        name: "description",
        content:
          "Try Klassruum's AI classroom demo with live teacher voice, interactive whiteboard, captions, lesson transcript, notes, accessibility modes, learner questions, and progress evidence - no account needed.",
      },
      {
        name: "keywords",
        content:
          "AI classroom demo, virtual classroom demo, AI teacher demo, interactive whiteboard demo, accessible online learning, live captions, classroom transcript, lesson notes, education technology demo",
      },
      { name: "author", content: "Klassruum" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Try the Klassruum AI Classroom Demo" },
      {
        property: "og:description",
        content:
          "Pick a demo lesson and experience a real AI teacher-led classroom with voice, whiteboard, captions, notes, transcript, accessibility modes, and learner support.",
      },
      { property: "og:url", content: `${SITE_URL}/demo/classroom` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klassruum AI Classroom Demo" },
      {
        name: "twitter:description",
        content:
          "Experience AI teacher-led lessons with whiteboard, voice, captions, transcript, notes, and accessibility - no account needed.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/demo/classroom` }],
  }),
  component: DemoClassroomPage,
});

function DemoClassroomPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  if (selectedLesson) {
    const content = getDemoLessonContent(selectedLesson);
    if (!content) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
          <div className="text-center">
            <p className="text-[#64748B]">Lesson not found.</p>
            <button
              type="button"
              onClick={() => setSelectedLesson(null)}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#07111f] px-4 text-sm font-semibold text-white"
            >
              Back to lessons
            </button>
          </div>
        </div>
      );
    }
    return (
      <AIVideoClassroom content={content} onExit={() => setSelectedLesson(null)} autoPlay={true} />
    );
  }

  return (
    <div className="demo-classroom-shell min-h-screen bg-[#F6F8FB] text-[#07111f]">
      <header className="border-b border-[#D8E0EA] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#D8E0EA] bg-white px-4 text-sm font-semibold text-[#10233F] transition-colors hover:border-[#B8C7D9] hover:bg-[#F6F8FB]"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#07111F] bg-[#07111F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#10233F]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-12">
        <section className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#D8E0EA] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#10233F]">
              <Sparkles className="h-3.5 w-3.5" />
              No account needed
            </div>

            <h1 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-[#07111F] sm:text-3xl">
              Enter a guided teaching demo.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#475569]">
              Choose one lesson and see how Klassruum teaches: guided voice, whiteboard steps,
              captions, notes, and learner support working together.
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-[#D8E0EA] bg-white p-4 sm:grid-cols-3">
            <Metric label="Lesson flow" value="Guided" />
            <Metric label="Access tools" value="On" />
            <Metric label="Setup time" value="0 min" />
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Demo lessons">
          {DEMO_LESSON_LIST.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLesson(lesson.id)}
              className="group relative overflow-hidden rounded-lg border border-[#D8E0EA] bg-white p-5 text-left shadow-[0_10px_28px_rgba(7,17,31,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#B8C7D9] hover:shadow-[0_18px_42px_rgba(7,17,31,0.1)]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${lesson.color} text-xl text-white shadow-sm`}
                >
                  {lesson.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#07111F] transition-colors group-hover:text-[#10233F]">
                    {lesson.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {lesson.subject} / {lesson.course}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#475569]">{lesson.description}</p>

              <div className="mt-5 border-t border-[#E8EEF5] pt-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {lesson.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.duration}
                  </span>
                </div>
                <span className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#07111F] bg-[#07111F] text-sm font-bold text-white transition-colors group-hover:bg-[#10233F]">
                  <PlayCircle className="h-4 w-4" />
                  Start lesson
                </span>
              </div>
            </button>
          ))}
        </section>

        <section
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Classroom features"
        >
          <FeatureCard
            icon={Video}
            title="AI Teacher"
            desc="Voice-first teaching with a real teacher persona"
          />
          <FeatureCard
            icon={Brain}
            title="Smart Whiteboard"
            desc="Step-by-step explanations written in real time"
          />
          <FeatureCard
            icon={Accessibility}
            title="Accessibility"
            desc="Captions, focus mode, pace control, screen reader"
          />
          <FeatureCard
            icon={Volume2}
            title="Voice Interaction"
            desc="Speak or type your questions during the lesson"
          />
        </section>

        <section className="mt-8 rounded-lg border border-[#D8E0EA] bg-white p-5 text-left shadow-[0_10px_28px_rgba(7,17,31,0.06)] sm:p-6">
          <h2 className="text-lg font-bold text-[#07111F]">What to expect</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              [
                "Meet your AI teacher",
                "Each subject has a dedicated teacher who guides you through the lesson.",
              ],
              [
                "Watch the whiteboard",
                "Concepts, equations, and examples appear step by step as the teacher explains.",
              ],
              [
                "Ask questions anytime",
                "Type or speak your question. The teacher responds using the lesson context.",
              ],
              [
                "Learn at your pace",
                "The lesson flows automatically. Captions and notes are always available.",
              ],
            ].map(([title, desc], i) => (
              <div key={title} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#D8E0EA] bg-[#F6F8FB] text-sm font-bold text-[#10233F]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-[#07111F]">{title}</h3>
                  <p className="text-sm text-[#64748B]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <p className="text-sm text-[#94A3B8]">
            This demo runs entirely in your browser. No account or installation required.
          </p>
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#E8EEF5] bg-[#F6F8FB] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className="mt-2 text-lg font-bold tracking-tight text-[#07111F]">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Video;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-[#D8E0EA] bg-white p-4 shadow-[0_10px_28px_rgba(7,17,31,0.05)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#D8E0EA] bg-[#F6F8FB] text-[#10233F]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-semibold text-[#07111F]">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#64748B]">{desc}</p>
    </div>
  );
}
