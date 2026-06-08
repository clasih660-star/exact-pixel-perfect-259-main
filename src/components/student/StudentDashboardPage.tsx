import { useState, type ComponentType } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, BookOpen, Calendar, CircleCheck as CheckCircle2, ChevronRight, Clock3, Folder, Lightbulb, Monitor, Notebook, CirclePlay as PlayCircle, Search, Sparkles, Star, Target, Trophy, Zap, Bell, Circle as HelpCircle, MessageSquare, Settings, Accessibility, LayoutDashboard, TrendingUp } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-[220px] pt-16">
        <div className="mx-auto max-w-[1200px] p-6">
          {/* Hero Continue Learning */}
          {continueLearning && (
            <ContinueLearningHero
              data={continueLearning}
              onStart={() => startOrGo.mutate()}
              isLoading={startOrGo.isPending}
            />
          )}

          {/* Stats Row */}
          <StatsGrid stats={data} />

          {/* Main Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Left Column */}
            <div className="space-y-6">
              <MyClassroomsPanel courses={classes} onEnter={(course) =>
                startOrGo.mutate({
                  courseId: course.id,
                  lessonId: course.lessonId,
                  sessionId: course.sessionId,
                })
              } />
              <RecentSessionsPanel sessions={recentSessions} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <LearningPlanPanel
                plan={data?.learningPlan ?? []}
                planStarted={planStarted}
                onStart={() => {
                  setPlanStarted(true);
                  startOrGo.mutate();
                }}
              />
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
              <UpcomingSessionsPanel />
            </div>
          </div>

          {/* Achievements Row */}
          <AchievementsRow />
        </div>
      </div>
    </div>
  );
}

function TopNavBar() {
  return (
    <header className="topnav fixed top-0 right-0 left-[220px] z-40 flex h-16 items-center justify-between border-b border-[var(--gray-200)] bg-white/95 px-6 backdrop-blur">
      <div className="flex flex-1 items-center gap-4">
        <div className="search-box flex max-w-md flex-1 items-center gap-3 rounded-lg border border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-2.5">
          <Search className="h-4 w-4 text-[var(--gray-400)]" />
          <input
            type="text"
            placeholder="Search lessons, notes, resources..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--gray-400)]"
          />
        </div>
      </div>
      <div className="topnav-actions flex items-center gap-3">
        <Link to="/student/notifications">
          <IconCircle icon={Bell} badge />
        </Link>
        <Link to="/student/settings">
          <IconCircle icon={HelpCircle} />
        </Link>
        <Link to="/student/settings/profile">
          <IconCircle label="DS" />
        </Link>
      </div>
    </header>
  );
}

function Sidebar() {
  const items = [
    { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/classrooms", label: "My Classrooms", icon: Monitor },
    { to: "/student/courses", label: "My Courses", icon: BookOpen },
    { to: "/student/lessons", label: "Lessons", icon: BookOpen },
    { to: "/student/calendar", label: "Calendar", icon: Calendar },
    { to: "/student/resources", label: "Resources", icon: Folder },
    { to: "/student/assignments", label: "Assignments", icon: Clipboard },
    { to: "/student/quizzes", label: "Quizzes", icon: Target },
    { to: "/student/progress", label: "Progress", icon: TrendingUp },
    { to: "/student/messages", label: "Messages", icon: MessageSquare },
    { to: "/student/notes", label: "Notes", icon: Notebook },
    { to: "/student/achievements", label: "Achievements", icon: Trophy },
    { to: "/student/access", label: "Learning Access", icon: Accessibility },
  ] as const;

  return (
    <aside className="sidebar fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[var(--gray-200)] bg-white">
      {/* Logo */}
      <div className="sidebar-logo flex items-center gap-3 border-b border-[var(--gray-100)] px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
            <Star className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-[var(--gray-900)]">
            Klassruum
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-0.5">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="nav-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--gray-600)] transition-all duration-150 hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
              activeProps={{
                className:
                  "nav-item active flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-[var(--primary)] text-white shadow-sm",
              }}
            >
              <i.icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{i.label}</span>
              <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer border-t border-[var(--gray-100)] px-4 py-4">
        <Link
          to="/student/access"
          className="learning-access-card mb-3 block rounded-lg border border-transparent bg-[var(--primary-light)] p-3 transition-all duration-150 hover:border-[var(--primary)]"
        >
          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-semibold text-[var(--primary)]">Learning Access</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--gray-500)]">
            Manage captions, focus mode, and more
          </p>
        </Link>

        <div className="user-card flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--gray-50)]">
          <div className="avatar flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
            DS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--gray-800)]">Demo Student</p>
            <p className="text-[11px] text-[var(--gray-400)]">Standard access</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function IconCircle({
  icon: Icon,
  label,
  badge,
}: {
  icon?: ComponentType<{ className?: string }>;
  label?: string;
  badge?: boolean;
}) {
  return (
    <div className="relative">
      <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gray-200)] bg-white text-[var(--gray-600)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        {label ? (
          <span className="text-xs font-bold">{label}</span>
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : null}
      </button>
      {badge && <span className="notif-dot absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />}
    </div>
  );
}

function ContinueLearningHero({
  data,
  onStart,
  isLoading,
}: {
  data: NonNullable<StudentDashboardV2["continueLearning"]>;
  onStart: () => void;
  isLoading: boolean;
}) {
  return (
    <Card className="overflow-hidden border-[var(--gray-200)] shadow-lg">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="bg-gradient-to-br from-[var(--primary-light)] via-white to-blue-50/50 p-8">
          <div className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)] shadow-sm">
            Continue Learning
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--gray-900)]">
            {data.courseTitle}
          </h2>
          <p className="mt-2 text-lg font-medium text-[var(--gray-700)]">{data.lessonTitle}</p>
          <p className="mt-3 text-sm text-[var(--gray-600)]">
            You are on Step 3 of 8:{" "}
            <span className="font-semibold text-[var(--gray-900)]">{data.currentStep}</span>
          </p>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--gray-600)]">Progress</span>
              <span className="font-bold text-[var(--gray-900)]">{data.progressPercentage}%</span>
            </div>
            <Progress value={data.progressPercentage} className="h-2.5" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onStart} disabled={isLoading} size="lg" className="shadow-lg shadow-[var(--primary)]/25">
              <Sparkles className="mr-2 h-4 w-4" />
              Enter Classroom
            </Button>
            <Button variant="outline" size="lg">
              Review Last Summary
            </Button>
            <Button variant="outline" size="lg">
              Take Quick Quiz
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--gray-500)]">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>
              Live progress tracking. Your classroom experience updates in real-time.
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--gray-200)] bg-white p-6 lg:border-l lg:border-t-0">
          <div className="rounded-xl border border-[var(--gray-200)] bg-gradient-to-br from-white to-[var(--primary-light)] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-400)]">
              Quick Stats
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                <span className="text-sm text-[var(--gray-600)]">Time Today</span>
                <span className="font-bold text-[var(--gray-900)]">45m</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                <span className="text-sm text-[var(--gray-600)]">Quizzes Passed</span>
                <span className="font-bold text-[var(--gray-900)]">12</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                <span className="text-sm text-[var(--gray-600)]">Current Streak</span>
                <span className="font-bold text-[var(--primary)]">7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
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
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed Lessons",
      value: "18",
      sub: "This month",
      icon: BookOpen,
      to: "/student/progress",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Study Time",
      value: "12h 45m",
      sub: "This week",
      icon: Clock3,
      to: "/student/progress",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Quiz Average",
      value: "86%",
      sub: "This month",
      icon: Target,
      to: "/student/quizzes",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Current Streak",
      value: "7",
      sub: "Days in a row",
      icon: Zap,
      to: "/student/progress",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="stats-row mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <Link key={card.label} to={card.to} className="group">
          <Card className="stat-card h-full border-[var(--gray-200)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-5">
              <div className={`stat-icon ${card.color} rounded-lg`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div className="stat-label mt-3 text-xs text-[var(--gray-500)]">{card.label}</div>
              <div className="stat-value mt-1 text-2xl font-bold text-[var(--gray-900)]">
                {card.value}
              </div>
              <div className="stat-sub text-[11px] text-[var(--gray-400)]">{card.sub}</div>
              <div className="stat-link mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)]">
                Open <ArrowRight className="h-3.5 w-3.5" />
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
  onEnter,
}: {
  courses: StudentDashboardV2["courses"];
  onEnter: (course: StudentDashboardV2["courses"][number]) => void;
}) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="section-header flex items-center justify-between border-b border-[var(--gray-100)] px-5 py-4">
          <div>
            <h3 className="section-title text-base font-bold text-[var(--gray-900)]">
              My Classrooms
            </h3>
            <p className="text-xs text-[var(--gray-500)]">Enter your next classroom fast</p>
          </div>
          <Link to="/student/classrooms" className="section-link text-xs font-medium text-[var(--primary)]">
            View all
          </Link>
        </div>

        <div className="divide-y divide-[var(--gray-100)]">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="classroom-item flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--gray-50)]">
              <div className="class-icon flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-light)] text-sm font-bold text-[var(--primary)]">
                {course.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="class-info min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="class-name truncate text-sm font-semibold text-[var(--gray-800)]">
                    {course.title}
                  </h4>
                  <span className="badge badge-blue text-[10px]">AI Teacher</span>
                </div>
                <p className="class-sub mt-0.5 text-xs text-[var(--gray-400)]">
                  {course.subject} • {course.level}
                </p>
                <div className="class-progress mt-2">
                  <div className="progress-bar h-1.5 flex-1 rounded-full bg-[var(--gray-100)]">
                    <div
                      className="progress-fill h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                  <span className="class-pct text-xs font-semibold">{course.progressPercentage}%</span>
                </div>
              </div>
              <Button size="sm" onClick={() => onEnter(course)}>
                Enter
              </Button>
            </div>
          ))}
        </div>

        {/* Start AI Classroom Card */}
        <div className="start-ai-card mx-4 my-4 flex items-center justify-between rounded-lg border border-transparent bg-[var(--primary-light)] p-4 transition-colors hover:border-[var(--primary)]">
          <div>
            <p className="ai-title text-sm font-semibold text-[var(--gray-800)]">
              Start a new AI lesson
            </p>
            <p className="ai-desc mt-1 text-xs text-[var(--gray-500)]">
              Begin any lesson with your AI teacher
            </p>
          </div>
          <Button size="sm">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentSessionsPanel({ sessions }: { sessions: StudentDashboardV2["recentSessions"] }) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="section-header flex items-center justify-between border-b border-[var(--gray-100)] px-5 py-4">
          <div>
            <h3 className="section-title text-base font-bold text-[var(--gray-900)]">
              Recent Sessions
            </h3>
            <p className="text-xs text-[var(--gray-500)]">Pick up from history</p>
          </div>
          <Link to="/student/sessions" className="section-link text-xs font-medium text-[var(--primary)]">
            View all
          </Link>
        </div>

        <div className="session-list px-4 py-3">
          {sessions.slice(0, 4).map((session) => (
            <div key={session.id} className="session-item flex items-center gap-3 py-3 transition-colors hover:bg-[var(--gray-50)]">
              <div className="session-thumb flex h-12 w-16 items-center justify-center rounded bg-[var(--gray-800)] text-white">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div className="session-info min-w-0 flex-1">
                <p className="session-name text-sm font-semibold text-[var(--gray-800)]">
                  {session.lessonTitle}
                </p>
                <p className="session-class text-xs text-[var(--gray-400)]">{session.courseTitle}</p>
                <div className="session-meta mt-1 flex gap-3 text-xs text-[var(--gray-400)]">
                  <span>{session.startedAt}</span>
                </div>
              </div>
              <span
                className={`badge ${session.status === "completed" ? "badge-green" : "badge-blue"}`}
              >
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LearningPlanPanel({
  plan,
  planStarted,
  onStart,
}: {
  plan: StudentDashboardV2["learningPlan"];
  planStarted: boolean;
  onStart: () => void;
}) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="section-header flex items-center justify-between border-b border-[var(--gray-100)] px-5 py-4">
          <div>
            <h3 className="section-title text-base font-bold text-[var(--gray-900)]">
              Today's Learning Plan
            </h3>
            <p className="text-xs text-[var(--gray-500)]">Your personalized roadmap</p>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {plan.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                  planStarted && index === 0
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--gray-200)] bg-white"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--gray-100)] text-[var(--gray-600)]"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--gray-900)]">{item.title}</p>
                  <p className="text-xs text-[var(--gray-500)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" size="sm" onClick={onStart}>
              Start Plan
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              Skip
            </Button>
          </div>
          <div className="mt-3">
            <Link
              to="/student/learning-plan"
              className="text-xs font-medium text-[var(--primary)] hover:underline"
            >
              Customize learning plan
            </Link>
          </div>
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
      <CardContent className="p-0">
        <div className="section-header flex items-center justify-between border-b border-[var(--gray-100)] px-5 py-4">
          <div>
            <h3 className="section-title text-base font-bold text-[var(--gray-900)]">
              Learning Access
            </h3>
            <p className="text-xs text-[var(--gray-500)]">Accessibility-first by default</p>
          </div>
          <Link to="/student/access" className="section-link text-xs font-medium text-[var(--primary)]">
            Adjust
          </Link>
        </div>

        <div className="p-4">
          <div className="rounded-lg border border-[var(--gray-200)] bg-gradient-to-br from-white to-[var(--primary-light)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                <Accessibility className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--gray-500)]">Current profile</p>
                <p className="text-lg font-bold text-[var(--gray-900)]">
                  {profile?.currentMode ?? "Standard"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <AccessPill label="Captions" enabled={profile?.captionsEnabled ?? true} />
              <AccessPill label="Voice" enabled={profile?.audioEnabled ?? true} />
              <AccessPill label="Shortcuts" enabled={profile?.keyboardShortcutsEnabled ?? true} />
              <AccessPill label="Focus" enabled={focusMode || (profile?.focusModeEnabled ?? false)} />
            </div>

            <div className="mt-4 flex gap-2">
              <Link to="/student/access" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Adjust Access
                </Button>
              </Link>
              <Button size="sm" onClick={onToggleFocusMode}>
                {focusMode ? "Exit Focus" : "Focus Mode"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccessPill({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
        enabled
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-[var(--gray-200)] bg-white text-[var(--gray-500)]"
      }`}
    >
      {label}: {enabled ? "On" : "Off"}
    </div>
  );
}

function UpcomingSessionsPanel() {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="section-header flex items-center justify-between border-b border-[var(--gray-100)] px-5 py-4">
          <div>
            <h3 className="section-title text-base font-bold text-[var(--gray-900)]">
              Upcoming Sessions
            </h3>
            <p className="text-xs text-[var(--gray-500)]">What's next today</p>
          </div>
          <Link to="/student/calendar" className="section-link text-xs font-medium text-[var(--primary)]">
            Calendar
          </Link>
        </div>

        <div className="p-4">
          {/* Mini Calendar */}
          <div className="rounded-lg border border-[var(--gray-200)] bg-white p-4">
            <div className="calendar-nav mb-3 flex items-center justify-between">
              <span className="cal-month text-sm font-bold text-[var(--gray-800)]">June 2026</span>
              <div className="flex gap-1">
                <button className="cal-btn flex h-6 w-6 items-center justify-center rounded text-[var(--gray-400)] hover:bg-[var(--gray-100)]">
                  <ChevronRight className="h-3 w-3 rotate-180" />
                </button>
                <button className="cal-btn flex h-6 w-6 items-center justify-center rounded text-[var(--gray-400)] hover:bg-[var(--gray-100)]">
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="cal-grid grid grid-cols-7 gap-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d} className="cal-day-label py-1 text-[10px] font-semibold text-[var(--gray-400)]">
                  {d}
                </div>
              ))}
              {Array.from({ length: 14 }, (_, i) => i + 1).map((d) => (
                <div
                  key={d}
                  className={`cal-day mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                    d === 8
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--gray-600)] hover:bg-[var(--gray-100)]"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Items */}
          <div className="upcoming-list mt-4 space-y-2">
            <div className="upcoming-item flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--gray-50)]">
              <div className="upcoming-icon flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-600">
                <Target className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="upcoming-name text-xs font-semibold text-[var(--gray-800)]">
                  Quadratic Equations
                </p>
                <p className="upcoming-class text-[10px] text-[var(--gray-400)]">Math Form 2</p>
              </div>
              <span className="upcoming-time text-xs font-semibold text-[var(--gray-500)]">10:30 AM</span>
            </div>
            <div className="upcoming-item flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--gray-50)]">
              <div className="upcoming-icon flex h-8 w-8 items-center justify-center rounded bg-green-50 text-green-600">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="upcoming-name text-xs font-semibold text-[var(--gray-800)]">
                  Speaking Drill
                </p>
                <p className="upcoming-class text-[10px] text-[var(--gray-400)]">English Practice</p>
              </div>
              <span className="upcoming-time text-xs font-semibold text-[var(--gray-500)]">2:00 PM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementsRow() {
  const achievements = [
    { icon: "🔥", name: "7-Day Streak", sub: "Keep it up!", tag: "This week", color: "bg-orange-50 border-orange-100" },
    { icon: "📚", name: "18 Lessons", sub: "Completed this month", tag: "On track", color: "bg-blue-50 border-blue-100" },
    { icon: "🎯", name: "86% Quiz Avg", sub: "Excellent performance", tag: "Top 10%", color: "bg-green-50 border-green-100" },
  ];

  return (
    <div className="mt-6">
      <div className="section-header mb-4 flex items-center justify-between">
        <div>
          <h3 className="section-title text-base font-bold text-[var(--gray-900)]">Achievements</h3>
          <p className="text-xs text-[var(--gray-500)]">Your learning milestones</p>
        </div>
        <Link to="/student/achievements" className="section-link text-xs font-medium text-[var(--primary)]">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {achievements.map((ach) => (
          <div
            key={ach.name}
            className={`achievement-card rounded-xl border p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md ${ach.color}`}
          >
            <span className="ach-icon block text-3xl">{ach.icon}</span>
            <p className="mt-2 text-sm font-bold text-[var(--gray-800)]">{ach.name}</p>
            <p className="mt-0.5 text-[11px] text-[var(--gray-500)]">{ach.sub}</p>
            <p className="mt-2 text-[10px] font-semibold text-[var(--gray-400)]">{ach.tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
