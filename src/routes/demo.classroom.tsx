import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AIVideoClassroom } from "@/components/classroom/AIVideoClassroom";
import { DEMO_LESSON_LIST, getDemoLessonContent } from "@/lib/demo-lessons/demo-lesson-registry";
import {
  CirclePlay as PlayCircle,
  Sparkles,
  Accessibility,
  Volume2,
  Brain,
  Video,
  Clock,
  GraduationCap,
} from "lucide-react";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/demo/classroom")({
  head: () => ({
    meta: [
      { title: "Try the AI Classroom Demo — Voice, Whiteboard & Accessibility | Klassruum" },
      {
        name: "description",
        content:
          "Try Klassruum's AI classroom demo with live teacher voice, interactive whiteboard, captions, lesson transcript, notes, accessibility modes, learner questions, and progress evidence — no account needed.",
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
          "Experience AI teacher-led lessons with whiteboard, voice, captions, transcript, notes, and accessibility — no account needed.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/demo/classroom` }],
  }),
  component: DemoClassroomPage,
});

function DemoClassroomPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const navigate = useNavigate();

  if (selectedLesson) {
    const content = getDemoLessonContent(selectedLesson);
    if (!content) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
          <div className="text-center">
            <p className="text-[#64748B]">Lesson not found.</p>
            <Button onClick={() => setSelectedLesson(null)} className="mt-4">
              Back to lessons
            </Button>
          </div>
        </div>
      );
    }
    return (
      <AIVideoClassroom
        content={content}
        onExit={() => setSelectedLesson(null)}
        autoPlay={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-4 py-1.5 text-sm font-medium text-[#1F7C80]">
            <Sparkles className="h-4 w-4" />
            Try the demo — no account needed
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
            Choose a{" "}
            <span className="bg-gradient-to-r from-[#1F7C80] to-[#1F7C80] bg-clip-text text-transparent">
              Demo Lesson
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#64748B]">
            Pick a subject and experience a live AI classroom. Your teacher will write on the whiteboard,
            explain concepts, and guide you through the lesson — all automated.
          </p>
        </div>

        {/* Lesson Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {DEMO_LESSON_LIST.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLesson(lesson.id)}
              className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 text-left transition-all hover:border-[#1F7C80] hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${lesson.color} text-2xl text-white shadow-md`}>
                  {lesson.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#1F7C80] transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {lesson.subject} · {lesson.course}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                {lesson.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {lesson.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.duration}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#1F7C80] group-hover:text-[#1A5256] transition-colors">
                  <PlayCircle className="h-4 w-4" />
                  Start
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Video} title="AI Teacher" desc="Voice-first teaching with a real teacher persona" />
          <FeatureCard icon={Brain} title="Smart Whiteboard" desc="Step-by-step explanations written in real time" />
          <FeatureCard icon={Accessibility} title="Accessibility" desc="Captions, focus mode, pace control, screen reader" />
          <FeatureCard icon={Volume2} title="Voice Interaction" desc="Speak or type your questions during the lesson" />
        </div>

        {/* What to expect */}
        <div className="mt-16 rounded-2xl border border-[#E2E8F0] bg-white p-8 text-left">
          <h2 className="text-xl font-semibold text-[#0F172A]">What to expect</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Meet your AI teacher", "Each subject has a dedicated teacher who guides you through the lesson."],
              ["Watch the whiteboard", "Concepts, equations, and examples appear step by step as the teacher explains."],
              ["Ask questions anytime", "Type or speak your question — the teacher responds using the lesson context."],
              ["Learn at your pace", "The lesson flows automatically. Captions and notes are always available."],
            ].map(([title, desc], i) => (
              <div key={title} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1F7C80]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium text-[#0F172A]">{title}</h3>
                  <p className="text-sm text-[#64748B]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#94A3B8]">
            This demo runs entirely in your browser. No account or installation required.
          </p>
        </div>
      </main>
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
    <Card className="border-[#E2E8F0] bg-white">
      <CardContent className="p-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1F7C80]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-semibold text-[#0F172A]">{title}</h3>
        <p className="mt-1 text-sm text-[#64748B]">{desc}</p>
      </CardContent>
    </Card>
  );
}
