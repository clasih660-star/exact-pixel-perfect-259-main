import { useState, type ComponentType } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Folder,
  Lightbulb,
  Monitor,
  Notebook,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
  Bell,
  HelpCircle,
  MessageSquare,
  Settings,
  Accessibility,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getStudentDashboard,
  updateLearnerAccessProfile,
  type StudentDashboardV2,
} from "@/lib/student.functions";
import { startOrResumeClassroom } from "@/lib/sessions.functions";

export function StudentDashboardPage() {
  const router = useRouter();
  const dashboardFn = useServerFn(getStudentDashboard);
  const startFn = useServerFn(startOrResumeClassroom);
  const accessFn = useServerFn(updateLearnerAccessProfile);

  const q = useQuery({
    queryKey: ["student-dashboard-v2"],
    queryFn: () => dashboardFn(),
  });

  const data = q.data as StudentDashboardV2 | undefined;
  const [planStarted, setPlanStarted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  const classes = data?.courses ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const continueLearning = data?.continueLearning;

  const startOrGo = useMutation({
    mutationFn: async (payload?: { courseId: string; lessonId: string; sessionId?: string }) => {
      const target = payload ?? continueLearning;
      if (!target) return null;
      if (target.sessionId) {
        return { sessionId: target.sessionId };
      }
      return startFn({
        data: {
          courseId: target.courseId,
          lessonId: target.lessonId,
        },
      });
    },
    onSuccess: async (res) => {
      const sessionId = (res as any)?.sessionId ?? (res as any)?.redirectUrl?.split("/").pop();
      if (sessionId) {
        await router.navigate({
          to: "/classroom/session/$sessionId",
          params: { sessionId },
        });
      }
    },
  });

  const quickQuiz = recentSessions[0]?.quizId ?? "quiz-demo";
  const lastSummary = recentSessions[0]?.summaryId ?? "summary-demo";

  const hero = continueLearning ? (
    <Card className="overflow-hidden border-[var(--gray-200)] shadow-[0_20px_60px_rgba(37,99,235,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_60%,#f8fbff_100%)] p-6 sm:p-8">
          <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gray-500)] shadow-sm">
            Continue Learning
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--gray-900)] sm:text-4xl">
            {continueLearning.courseTitle}
          </h2>
          <p className="mt-2 text-lg font-medium text-[var(--gray-700)]">
            {continueLearning.lessonTitle}
          </p>
          <p className="mt-3 text-sm text-[var(--gray-600)]">
            You are on Step 3 of 8:{" "}
            <span className="font-semibold text-[var(--gray-900)]">
              {continueLearning.currentStep}
            </span>
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--gray-600)]">Progress</span>
              <span className="font-semibold text-[var(--gray-900)]">
                {continueLearning.progressPercentage}%
              </span>
            </div>
            <Progress value={continueLearning.progressPercentage} className="h-2.5" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => startOrGo.mutate()}
              disabled={startOrGo.isPending}
              className="shadow-[0_12px_28px_rgba(37,99,235,0.25)]"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Enter Classroom
            </Button>
            <Link to="/student/sessions/$sessionId/summary" params={{ sessionId: lastSummary }}>
              <Button variant="outline">Review Last Summary</Button>
            </Link>
            <Link to="/student/quizzes/$quizId" params={{ quizId: quickQuiz }}>
              <Button variant="outline">Take Quick Quiz</Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--gray-500)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--green)]" />
            <span>
              Everything here is live. Entering class updates your progress, notes, and next
              recommendation.
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--gray-200)] bg-white p-6 lg:border-l lg:border-t-0">
          <div className="rounded-2xl border border-[var(--gray-200)] bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_100%)] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-400)]">
              Today&apos;s Learning Plan
            </div>
            <ol className="mt-4 space-y-3">
              {(data?.learningPlan ?? []).map((item, index) => (
                <li
                  key={item.id}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition ${planStarted && index === 0 ? "border-[var(--primary)] bg-[var(--primary-light)]" : "border-[var(--gray-200)] bg-white"}`}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? "bg-[var(--primary)] text-white" : "bg-[var(--gray-100)] text-[var(--gray-600)]"}`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--gray-900)]">{item.title}</p>
                    <p className="text-xs text-[var(--gray-500)]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  setPlanStarted(true);
                  startOrGo.mutate();
                }}
              >
                Start Plan
              </Button>
              <Button variant="outline" className="flex-1">
                Skip for now
              </Button>
            </div>
            <div className="mt-2">
              <Link
                to="/student/learning-plan"
                className="text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                Customize learning plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  ) : null;

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <DashboardChrome />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {hero}

          <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <StatsGrid stats={data} />
            <LearningAccessWidget
              profile={data?.accessProfile}
              focusMode={focusMode}
              onToggleFocusMode={async () => {
                const next = !focusMode;
                setFocusMode(next);
                await accessFn({
                  data: {
                    focusModeEnabled: next,
                    captionsEnabled: data?.accessProfile.captionsEnabled,
                    audioEnabled: data?.accessProfile.audioEnabled,
                    keyboardShortcutsEnabled: data?.accessProfile.keyboardShortcutsEnabled,
                    speechRate: data?.accessProfile.speechRate,
                    currentMode: next ? "Focus" : "Standard",
                  },
                });
              }}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <MyClassroomsPanel
              courses={classes}
              hoveredCourse={hoveredCourse}
              onHoverCourse={setHoveredCourse}
              onEnter={(course) =>
                startOrGo.mutate({
                  courseId: course.id,
                  lessonId: course.lessonId,
                  sessionId: course.sessionId,
                })
              }
            />
            <RecentSessionsPanel sessions={recentSessions} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <UpcomingSessionsPanel />
            <RecommendedNextLesson />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardChrome() {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--gray-200)] bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/student/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)]">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-xl font-extrabold tracking-tight text-[var(--gray-900)]">
              Klassruum
            </div>
            <div className="text-xs text-[var(--gray-500)]">Learning command center</div>
          </div>
        </Link>

        <div className="hidden flex-1 items-center gap-2 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3 md:flex">
          <Search className="h-4 w-4 text-[var(--gray-400)]" />
          <input
            type="text"
            placeholder="Search lessons, notes, resources..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--gray-400)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/student/notifications">
            <IconCircle icon={Bell} />
          </Link>
          <Link to="/student/settings">
            <IconCircle icon={HelpCircle} />
          </Link>
          <Link to="/student/settings/profile">
            <IconCircle icon={Settings} label="DS" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function IconCircle({
  icon: Icon,
  label,
}: {
  icon?: ComponentType<{ className?: string }>;
  label?: string;
}) {
  return (
    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gray-200)] bg-white text-[var(--gray-600)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {label ? (
        <span className="text-xs font-bold">{label}</span>
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
    </button>
  );
}

function StatsGrid({ stats }: { stats?: StudentDashboardV2 }) {
  const cards = [
    {
      label: "My Classrooms",
      value: stats?.courses.length ?? 0,
      sub: "Active classrooms",
      icon: Monitor,
      to: "/student/classrooms",
    },
    {
      label: "Completed Lessons",
      value: "18",
      sub: "This month",
      icon: BookOpen,
      to: "/student/progress",
    },
    {
      label: "Study Time",
      value: "12h 45m",
      sub: "This week",
      icon: Clock3,
      to: "/student/progress",
    },
    {
      label: "Quiz Average",
      value: "86%",
      sub: "This month",
      icon: Target,
      to: "/student/quizzes",
    },
    {
      label: "Current Streak",
      value: "7",
      sub: "Days in a row",
      icon: Zap,
      to: "/student/progress",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Link key={card.label} to={card.to} className="group">
          <Card className="h-full border-[var(--gray-200)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
            <CardContent className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                {card.label}
              </div>
              <div className="mt-1 text-3xl font-black tracking-tight text-[var(--gray-900)]">
                {card.value}
              </div>
              <div className="mt-1 text-sm text-[var(--gray-500)]">{card.sub}</div>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function MyClassroomsPanel({
  courses,
  hoveredCourse,
  onHoverCourse,
  onEnter,
}: {
  courses: StudentDashboardV2["courses"];
  hoveredCourse: string | null;
  onHoverCourse: (id: string | null) => void;
  onEnter: (course: StudentDashboardV2["courses"][number]) => void;
}) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              My Classrooms
            </div>
            <h3 className="mt-1 text-xl font-bold text-[var(--gray-900)]">
              Enter your next classroom fast
            </h3>
          </div>
          <Link to="/student/classrooms" className="text-sm font-semibold text-[var(--primary)]">
            View all
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {courses.map((course) => {
            const isHovered = hoveredCourse === course.id;
            return (
              <div
                key={course.id}
                onMouseEnter={() => onHoverCourse(course.id)}
                onMouseLeave={() => onHoverCourse(null)}
                className="group rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-sm font-black text-[var(--primary)]">
                    {course.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-base font-bold text-[var(--gray-900)]">
                        {course.title}
                      </h4>
                      <span className="rounded-full bg-[var(--gray-100)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gray-500)]">
                        AI Teacher
                      </span>
                    </div>
                    <p className="text-sm text-[var(--gray-500)]">
                      {course.institutionName} • {course.subject} • {course.level}
                    </p>
                    <p className="mt-1 text-sm text-[var(--gray-600)]">
                      Current Lesson: {course.currentLessonTitle}
                    </p>
                    <p className="text-sm text-[var(--gray-600)]">
                      Current Step: {course.currentStep}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-xs text-[var(--gray-500)]">
                          <span>Progress</span>
                          <span>{course.progressPercentage}%</span>
                        </div>
                        <Progress value={course.progressPercentage} className="h-2.5" />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--gray-600)]">
                      <Pill icon={Accessibility} text={course.accessibilityStatus} />
                      <Pill icon={Monitor} text={course.teacherMode} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl bg-[var(--gray-50)] p-4 sm:grid-cols-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                      Last activity
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[var(--gray-900)]">
                      {course.lastActivity}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                      Next action
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[var(--gray-900)]">
                      {course.nextRecommendedAction}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                      Time left
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[var(--gray-900)]">
                      {course.estimatedTimeLeft}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => onEnter(course)} className="shadow-sm">
                    Enter Classroom
                  </Button>
                  <Link to="/student/courses/$courseId" params={{ courseId: course.id }}>
                    <Button variant="outline">View Course</Button>
                  </Link>
                  <Link to="/student/courses/$courseId/lessons" params={{ courseId: course.id }}>
                    <Button variant="outline">Lessons</Button>
                  </Link>
                </div>

                {isHovered && (
                  <div className="mt-4 rounded-2xl border border-dashed border-[var(--primary)] bg-[var(--primary-light)] p-3 text-sm text-[var(--gray-700)]">
                    Hover insight: you have one fast route into class. Entering will resume progress
                    and refresh your dashboard.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentSessionsPanel({ sessions }: { sessions: StudentDashboardV2["recentSessions"] }) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              Recent Sessions
            </div>
            <h3 className="mt-1 text-xl font-bold text-[var(--gray-900)]">Pick up from history</h3>
          </div>
          <Link to="/student/sessions" className="text-sm font-semibold text-[var(--primary)]">
            View all
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--gray-100)] text-[var(--gray-700)]">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-[var(--gray-900)]">
                    {session.lessonTitle}
                  </h4>
                  <p className="text-sm text-[var(--gray-500)]">{session.courseTitle}</p>
                  <p className="mt-1 text-xs text-[var(--gray-500)]">{session.startedAt}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${session.status === "completed" ? "bg-[var(--green-light)] text-[var(--green)]" : "bg-[var(--primary-light)] text-[var(--primary)]"}`}
                >
                  {session.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/student/sessions/$sessionId/summary"
                  params={{ sessionId: session.summaryId ?? session.id }}
                >
                  <Button variant="outline" size="sm">
                    Review Summary
                  </Button>
                </Link>
                <Link to="/classroom/session/$sessionId" params={{ sessionId: session.id }}>
                  <Button variant="outline" size="sm">
                    Replay Explanation
                  </Button>
                </Link>
                <Link
                  to="/student/quizzes/$quizId"
                  params={{ quizId: session.quizId ?? "quiz-demo" }}
                >
                  <Button variant="outline" size="sm">
                    Retake Quiz
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LearningAccessWidget({
  profile,
  focusMode,
  onToggleFocusMode,
}: {
  profile?: StudentDashboardV2["accessProfile"];
  focusMode: boolean;
  onToggleFocusMode: () => void;
}) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              Learning Access
            </div>
            <h3 className="mt-1 text-xl font-bold text-[var(--gray-900)]">
              Accessibility-first by default
            </h3>
          </div>
          <Link to="/student/access" className="text-sm font-semibold text-[var(--primary)]">
            Adjust Access
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--gray-200)] bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_100%)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
              <Accessibility className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--gray-500)]">Current profile</div>
              <div className="text-lg font-black text-[var(--gray-900)]">
                {profile?.currentMode ?? "Standard"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <AccessPill label="Captions" enabled={profile?.captionsEnabled ?? true} />
            <AccessPill label="Teacher voice" enabled={profile?.audioEnabled ?? true} />
            <AccessPill
              label="Keyboard shortcuts"
              enabled={profile?.keyboardShortcutsEnabled ?? true}
            />
            <AccessPill
              label="Focus mode"
              enabled={focusMode || (profile?.focusModeEnabled ?? false)}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/student/access">
              <Button variant="outline" size="sm">
                Adjust Access
              </Button>
            </Link>
            <Button size="sm" onClick={onToggleFocusMode}>
              {focusMode ? "Disable Focus Mode" : "Enable Focus Mode"}
            </Button>
          </div>

          <p className="mt-3 text-xs text-[var(--gray-500)]">
            Toggling focus mode updates the dashboard immediately and carries into the classroom
            before you open it.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingSessionsPanel() {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              Upcoming Sessions
            </div>
            <h3 className="mt-1 text-xl font-bold text-[var(--gray-900)]">
              What&apos;s next today
            </h3>
          </div>
          <Link to="/student/calendar" className="text-sm font-semibold text-[var(--primary)]">
            View calendar
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--gray-900)]">Mini calendar</p>
              <p className="text-xs text-[var(--gray-500)]">This week&apos;s learning rhythm</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[var(--gray-200)] p-2">
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
              <button className="rounded-full border border-[var(--gray-200)] p-2">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-[var(--gray-400)]">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d}>{d}</div>
            ))}
            {Array.from({ length: 14 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                className={`rounded-full py-2 ${d === 8 ? "bg-[var(--primary)] text-white" : "bg-[var(--gray-50)] text-[var(--gray-600)]"}`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <UpcomingItem
            title="Quadratic Equations Practice"
            course="Mathematics Form 2"
            time="10:30 AM"
          />
          <UpcomingItem title="Speaking Drill" course="English Speaking Practice" time="2:00 PM" />
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingItem({ title, course, time }: { title: string; course: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--gray-200)] bg-white p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[var(--gray-900)]">{title}</p>
        <p className="text-sm text-[var(--gray-500)]">{course}</p>
      </div>
      <div className="text-sm font-semibold text-[var(--gray-700)]">{time}</div>
    </div>
  );
}

function RecommendedNextLesson() {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
          Recommended Next
        </div>
        <h3 className="mt-1 text-xl font-bold text-[var(--gray-900)]">
          Continue with the lesson that fits your progress
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--gray-600)]">
          Klassruum uses your last session, weak topics, and quiz results to keep the next move
          obvious.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ActionCard
            icon={Lightbulb}
            title="Continue Lesson"
            desc="Return to the active classroom"
          />
          <ActionCard icon={Notebook} title="Review Previous" desc="Open the last summary" />
          <ActionCard icon={Trophy} title="Take Quiz" desc="Check understanding now" />
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-4">
      <Icon className="h-5 w-5 text-[var(--primary)]" />
      <div className="mt-3 font-semibold text-[var(--gray-900)]">{title}</div>
      <div className="mt-1 text-xs text-[var(--gray-500)]">{desc}</div>
    </div>
  );
}

function Pill({ icon: Icon, text }: { icon: ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gray-50)] px-3 py-1.5 text-xs font-semibold text-[var(--gray-700)]">
      <Icon className="h-3.5 w-3.5 text-[var(--primary)]" />
      {text}
    </div>
  );
}

function AccessPill({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div
      className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${enabled ? "border-[var(--green)] bg-[var(--green-light)] text-[var(--green)]" : "border-[var(--gray-200)] bg-white text-[var(--gray-500)]"}`}
    >
      {label}: {enabled ? "On" : "Off"}
    </div>
  );
}
