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
  Captions,
  HelpCircle,
} from "lucide-react";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/lessons")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
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
    description:
      "Solve quadratic equations by factoring, completing the square, and using the formula.",
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

const STATUS_CONFIG: Record<
  LessonStatus,
  { label: string; variant: "success" | "warning" | "info" | "neutral"; icon: typeof CheckCircle2 }
> = {
  ready: { label: "Ready", variant: "success", icon: CheckCircle2 },
  review: { label: "Review Needed", variant: "warning", icon: AlertTriangle },
  draft: { label: "Draft", variant: "neutral", icon: FileText },
  live: { label: "Live", variant: "info", icon: Play },
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "from-[#1F7C80] to-[#3fa8ab]",
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

      {/* Search + Filter Bar — wraps cleanly on mobile */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons or courses…"
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1F7C80] focus:outline-none focus:ring-2 focus:ring-[#1F7C80]/20"
          />
        </div>
        {/* Filter pills — wrap on narrow widths */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-[#64748B]" />
          {(["all", "ready", "review", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-[#1F7C80] text-white shadow-sm"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#1F7C80]/40 hover:text-[#1F7C80]"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} (
              {counts[f as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Banner — responsive 2-up on mobile, 3-up on desktop */}
      <div className="kr-stat-strip kr-stat-strip--3 mb-6">
        <div className="kr-stat-card-item kr-stat-card-item--success">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <p className="kr-stat-value text-green-700">{counts.ready}</p>
          <p className="kr-stat-label">Ready to Teach</p>
        </div>
        <div className="kr-stat-card-item kr-stat-card-item--warning">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="kr-stat-value text-amber-700">{counts.review}</p>
          <p className="kr-stat-label">Need Review</p>
        </div>
        <div className="kr-stat-card-item">
          <div className="flex items-center justify-center mb-2">
            <FileText className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <p className="kr-stat-value text-[#94A3B8]">{counts.draft}</p>
          <p className="kr-stat-label">In Draft</p>
        </div>
      </div>

      {/* Lesson Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white">
          <div className="kr-empty-state">
            <div className="kr-empty-state-icon">
              <FileText className="h-6 w-6 text-[#1F7C80]" />
            </div>
            <h3>No lessons found</h3>
            <p>{query ? `No lessons match "${query}".` : "No lessons in this category yet."}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lesson) => {
            const sc = STATUS_CONFIG[lesson.status];
            const gradClass = SUBJECT_COLORS[lesson.subject] ?? "from-slate-600 to-slate-400";
            return (
              <article
                key={lesson.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 transition-all hover:border-[#1F7C80]/30 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Subject icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradClass} text-sm font-bold text-white shadow-sm`}
                  >
                    {lesson.subject.slice(0, 2)}
                  </div>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#0F172A]">{lesson.title}</h3>
                      <StatusBadge variant={sc.variant}>{sc.label}</StatusBadge>
                    </div>
                    <p className="mt-0.5 text-sm text-[#64748B]">{lesson.course}</p>
                    <p className="mt-1 text-xs text-[#94A3B8] line-clamp-1">{lesson.description}</p>

                    {/* Meta row — wraps on mobile */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {lesson.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {lesson.steps} steps
                      </span>
                      <span className="text-[#94A3B8]">Updated {lesson.lastUpdated}</span>

                      {/* Captions indicator */}
                      <span
                        className={`flex items-center gap-1 font-semibold ${lesson.captionsReady ? "text-green-600" : "text-amber-500"}`}
                      >
                        <Captions className="h-3.5 w-3.5" />
                        {lesson.captionsReady ? "Captions" : "Captions missing"}
                      </span>

                      {/* Quiz indicator */}
                      <span
                        className={`flex items-center gap-1 font-semibold ${lesson.quizReady ? "text-green-600" : "text-amber-500"}`}
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        {lesson.quizReady ? "Quiz ready" : "Quiz missing"}
                      </span>
                    </div>
                  </div>

                  {/* Actions — stack on mobile, row on desktop */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:shrink-0">
                    <Link
                      to="/classroom/preview/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#1F7C80]/30 transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Link>
                    {lesson.status === "ready" && (
                      <Link
                        to="/classroom/$lessonId"
                        params={{ lessonId: lesson.id }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#1F7C80] to-[#1A5256] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start Class
                      </Link>
                    )}
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" />
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
