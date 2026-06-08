import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InteractiveClassroomPage } from "@/components/classroom/InteractiveClassroomPage";
import { CirclePlay as PlayCircle, Sparkles, Accessibility, Captions as CaptionIcon, Volume2, Brain, Video } from "lucide-react";

export const Route = createFileRoute("/demo/classroom")({
  head: () => ({
    meta: [
      { title: "Demo Classroom — Klassruum" },
      {
        name: "description",
        content:
          "Try Klassruum's AI-powered virtual classroom with voice, whiteboard, captions, and interactive lessons.",
      },
    ],
  }),
  component: DemoClassroomPage,
});

function DemoClassroomPage() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <ClassroomWrapper onEnd={() => setStarted(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
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
            <Link to="/institutions/register">
              <Button size="sm">Register Institution</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          Try the demo — no account needed
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Experience the{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Classroom
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Step into a virtual classroom where an AI teacher guides you through lessons with voice,
          whiteboard, captions, quizzes, and accessibility tools.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="h-14 px-8 text-base shadow-lg"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Launch Demo Classroom
          </Button>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="h-14 px-8 text-base">
              Full Dashboard Demo
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Video} title="AI Teacher" desc="Voice-first teaching with visuals" />
          <FeatureCard
            icon={Brain}
            title="Smart Whiteboard"
            desc="Step-by-step explanations & diagrams"
          />
          <FeatureCard icon={Accessibility} title="Accessibility" desc="Captions, focus mode, pace control" />
          <FeatureCard icon={Volume2} title="Voice Interaction" desc="Speak or type your responses" />
        </div>

        <div className="mt-16">
          <Card className="overflow-hidden border-slate-200">
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-4 text-sm opacity-70">
                      Click "Launch Demo Classroom" to start the interactive experience
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-left">
          <h2 className="text-xl font-semibold text-slate-900">What to expect</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                1
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Meet Mr. Klass</h3>
                <p className="text-sm text-slate-600">
                  Your AI teacher will greet you and start the lesson.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                2
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Watch the whiteboard</h3>
                <p className="text-sm text-slate-600">
                  Steps appear as the teacher explains each concept.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                3
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Ask questions</h3>
                <p className="text-sm text-slate-600">Type or speak — Mr. Klass responds naturally.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                4
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Take a quiz</h3>
                <p className="text-sm text-slate-600">Test your understanding with instant feedback.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            This demo runs in your browser. No account or installation required.
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
    <Card className="border-slate-200 bg-white">
      <CardContent className="p-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </CardContent>
    </Card>
  );
}

function ClassroomWrapper({ onEnd }: { onEnd: () => void }) {
  const demoContext = {
    session: {
      id: "demo-session",
      institution_id: "demo-institution",
      course_id: "demo-course",
      lesson_id: "demo-lesson",
      status: "live",
      mode: "ai_teacher",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    institution: {
      id: "demo-institution",
      name: "Klassruum Demo Academy",
      slug: "demo-academy",
      type: "school",
      status: "active",
      country: "Kenya",
      city: "Nairobi",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    course: {
      id: "demo-course",
      institution_id: "demo-institution",
      title: "Mathematics Form 2",
      slug: "math-form-2",
      subject: "Mathematics",
      level: "Form 2",
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    lesson: {
      id: "demo-lesson",
      institution_id: "demo-institution",
      course_id: "demo-course",
      title: "Introduction to Quadratic Equations",
      description: "Learn to solve quadratic equations by factoring",
      subject: "Mathematics",
      difficulty: "intermediate",
      duration_minutes: 30,
      order_index: 1,
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lesson_data_json: {},
      steps: [
        { key: "hook", title: "Hook", spokenScript: "Welcome! Today we'll learn about quadratic equations.", simpleExplanation: "An introduction to the topic" },
        { key: "concept", title: "Concept", spokenScript: "A quadratic equation has the form ax² + bx + c = 0.", simpleExplanation: "Standard form of a quadratic" },
        { key: "worked_example", title: "Worked Example", spokenScript: "Let's solve x² - 5x + 6 = 0 by factoring.", simpleExplanation: "Step-by-step factoring" },
        { key: "guided_practice", title: "Guided Practice", spokenScript: "Now let's try x² + 7x + 12 = 0 together.", simpleExplanation: "Practice with guidance" },
        { key: "independent_question", title: "Your Turn", spokenScript: "Solve x² - 8x + 15 = 0 on your own.", simpleExplanation: "Independent practice" },
        { key: "correction", title: "Review", spokenScript: "Let's review the solution together.", simpleExplanation: "Reviewing solutions" },
        { key: "quiz", title: "Quiz", spokenScript: "Time to test your understanding!", simpleExplanation: "Knowledge check" },
        { key: "summary", title: "Summary", spokenScript: "Great job! Let's recap what we learned.", simpleExplanation: "Lesson summary" },
      ],
    },
    enrollment: null,
    messages: [],
    progress: {
      student_id: "demo-student",
      lesson_id: "demo-lesson",
      course_id: "demo-course",
      institution_id: "demo-institution",
      current_step: "hook",
      student_level: "intermediate",
      confusion_score: 0,
      teacher_state: "listening",
      progress_percentage: 0,
      time_spent_minutes: 0,
      status: "in_progress",
    },
    learnerAccessProfile: {
      audioEnabled: true,
      captionsEnabled: true,
      keyboardShortcutsEnabled: true,
      focusModeEnabled: false,
      speechRate: 1,
      currentMode: "Standard",
    },
  };

  return (
    <div className="relative">
      <button
        onClick={onEnd}
        className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-lg hover:bg-slate-50"
      >
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Exit Demo
      </button>
      <InteractiveClassroomPage
        classroomContext={demoContext}
        sessionId="demo-session"
        onEndLesson={onEnd}
      />
    </div>
  );
}
