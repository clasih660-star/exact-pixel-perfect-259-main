import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import {
  BookOpen,
  Search,
  Eye,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Filter,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher/lessons")({
  component: TeacherLessons,
});

type LessonStatus = "ready" | "review" | "draft" | "live";

type Lesson = {
  id: string;
  title: string;
  course: string;
  subject: string;
  status: LessonStatus;
  duration: string;
  steps: number;
  lastUpdated: string;
  description: string;
  quizReady: boolean;
  captionsReady: boolean;
};

const LESSONS: Lesson[] = [
  {
    id: "lesson_quad",
    title: "Introduction to Quadratic Equations",
    course: "Mathematics Form 2",
    subject: "Mathematics",
    status: "ready",
    duration: "30 min",
    steps: 8,
    lastUpdated: "Jun 9, 2026",
    description: "Solve quadratic equations by factoring, completing the square, and using the formula.",
    quizReady: true,
    captionsReady: true,
  },
  {
    id: "lesson_chem",
    title: "Chemical Bonding",
    course: "KCSE Chemistry Revision",
    subject: "Chemistry",
    status: "review",
    duration: "35 min",
    steps: 9,
    lastUpdated: "Jun 8, 2026",
    description: "Ionic and covalent bonds, electronegativity, and Lewis structures.",
    quizReady: true,
    captionsReady: false,
  },
  {
    id: "lesson_html",
    title: "HTML Forms and Inputs",
    course: "Computer Studies Basics",
    subject: "Computer Science",
    status: "review",
    duration: "25 min",
    steps: 7,
    lastUpdated: "Jun 7, 2026",
    description: "Building accessible forms with labels, inputs, textareas, and validation.",
    quizReady: false,
    captionsReady: true,
  },
  {
    id: "lesson_factor",
    title: "Factoring Polynomials",
    course: "Mathematics Form 2",
    subject: "Mathematics",
    status: "draft",
    duration: "28 min",
    steps: 6,
    lastUpdated: "Jun 6, 2026",
    description: "Common factors, grouping, and factoring trinomials.",
    quizReady: false,
    captionsReady: false,
  },
  {
    id: "lesson_react",
    title: "Chemical Reactions",
    course: "KCSE Chemistry Revision",
    subject: "Chemistry",
    status: "ready",
    duration: "40 min",
    steps: 10,
    lastUpdated: "Jun 5, 2026",
    description: "Types of reactions, balancing equations, rate of reaction.",
    quizReady: true,
    captionsReady: true,
  },
  {
    id: "lesson_css",
    title: "CSS Flexbox & Grid",
    course: "Computer Studies Basics",
    subject: "Computer Science",
    status: "draft",
    duration: "32 min",
    steps: 8,
    lastUpdated: "Jun 4, 2026",
    description: "Responsive layouts with modern CSS Flexbox and Grid systems.",
    quizReady: false,
    captionsReady: false,
  },
];

const STATUS_CONFIG: Record<LessonStatus, { label: string; variant: "success" | "warning" | "info" | "neutral"; icon: typeof CheckCircle2 }> = {
  ready: { label: "Ready", variant: "success", icon: CheckCircle2 },
  review: { label: "Review Needed", variant: "warning", icon: AlertTriangle },
  draft: { label: "Draft", variant: "neutral", icon: FileText },
  live: { label: "Live", variant: "info", icon: Play },
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "from-blue-600 to-blue-400",
  Chemistry: "from-green-600 to-emerald-400",
  "Computer Science": "from-purple-600 to-violet-400",
};

const config = dashboardConfigs.teacher;

function TeacherLessons() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LessonStatus | "all">("all");

  const filtered = LESSONS.filter((l) => {
    const matchesQuery =
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.course.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || l.status === filter;
    return matchesQuery && matchesFilter;
  });

  const counts = {
    all: LESSONS.length,
    ready: LESSONS.filter((l) => l.status === "ready").length,
    review: LESSONS.filter((l) => l.status === "review").length,
    draft: LESSONS.filter((l) => l.status === "draft").length,
  };

  return (
    <DashboardShell config={config} activePath="/teacher/lessons">
      <PageHeader
        label="Content management"
        title="Lesson Library"
        subtitle="Review AI-generated lessons, approve them for classroom delivery, and manage your content queue."
      />

      {/* Search + Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons or courses…"
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#64748B]" />
          {(["all", "ready", "review", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-[#2563EB] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]/40"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Banner */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[#22C55E]">{counts.ready}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">Ready to Teach</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{counts.review}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">Need Review</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[#94A3B8]">{counts.draft}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">In Draft</p>
        </div>
      </div>

      {/* Lesson Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-[#CBD5E1]" />
          <p className="mt-3 font-semibold text-[#64748B]">No lessons match your search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lesson) => {
            const sc = STATUS_CONFIG[lesson.status];
            const gradClass = SUBJECT_COLORS[lesson.subject] ?? "from-slate-600 to-slate-400";
            return (
              <article
                key={lesson.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 transition-all hover:border-[#2563EB]/30 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradClass} text-sm font-bold text-white`}
                  >
                    {lesson.subject.slice(0, 2)}
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#0F172A]">{lesson.title}</h3>
                      <StatusBadge variant={sc.variant}>{sc.label}</StatusBadge>
                    </div>
                    <p className="mt-0.5 text-sm text-[#64748B]">
                      {lesson.course}
                    </p>
                    <p className="mt-1 text-xs text-[#94A3B8] line-clamp-1">{lesson.description}</p>

                    {/* Meta row */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {lesson.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {lesson.steps} steps
                      </span>
                      <span>Updated {lesson.lastUpdated}</span>
                      <span className={`font-semibold ${lesson.captionsReady ? "text-green-600" : "text-amber-500"}`}>
                        {lesson.captionsReady ? "✓ Captions" : "⚠ Captions missing"}
                      </span>
                      <span className={`font-semibold ${lesson.quizReady ? "text-green-600" : "text-amber-500"}`}>
                        {lesson.quizReady ? "✓ Quiz" : "⚠ Quiz missing"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to="/classroom/preview/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Link>
                    {lesson.status === "ready" && (
                      <Link
                        to="/classroom/$lessonId"
                        params={{ lessonId: lesson.id }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start Class
                      </Link>
                    )}
                    <ChevronRight className="h-4 w-4 text-[#CBD5E1]" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
