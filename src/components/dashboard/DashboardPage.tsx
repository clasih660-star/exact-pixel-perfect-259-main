/**
 * DashboardPage.tsx — Learner dashboard with real data and proper empty states.
 */

import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { RecentSessionCard } from "@/components/dashboard/RecentSessionCard";
import { useDashboard } from "@/hooks/useDashboard";
import { Link } from "@tanstack/react-router";
import {
  Users,
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  Calendar,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Play,
} from "lucide-react";

export function DashboardPage() {
  const { data, isLoading, error, refresh, isUsingDemoData } = useDashboard();

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-academic-blue mx-auto mb-4" />
            <p className="text-muted">Loading your dashboard...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const stats = data?.stats ?? {
    activeCourses: 0,
    completedLessons: 0,
    totalTimeMinutes: 0,
    avgQuizScore: 0,
    recentSessionsCount: 0,
  };

  const courses = data?.courses ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const continueLearning = data?.continueLearning;
  const recommendations = data?.recommendations ?? [];

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <AppShell>
      <div>
        {/* Error indicator */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-2 text-sm text-red-700">
            <span>Failed to load dashboard data. Please try again.</span>
            <button onClick={refresh} className="text-xs font-medium text-red-800 underline">Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!error && isUsingDemoData && courses.length === 0 && (
          <div className="mb-6 p-8 bg-gradient-to-br from-soft-green to-white border border-border rounded-xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-academic-blue/10">
              <Sparkles size={28} className="text-academic-blue" />
            </div>
            <h2 className="text-xl font-bold text-heading mb-2">Welcome to Klassruum</h2>
            <p className="text-sm text-body mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Browse available courses to start your learning journey.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/student/courses" className="inline-flex items-center gap-2 rounded-lg bg-academic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light transition-colors">
                <BookOpen size={16} /> Browse Courses
              </Link>
              <button onClick={refresh} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-body hover:bg-page-background-alt transition-colors">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-heading">Welcome back</h1>
            <p className="text-sm text-body mt-0.5">
              {continueLearning
                ? "Continue where you left off, or start something new."
                : "You're making great progress. Keep it up."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-body hover:bg-page-background-alt transition-colors" onClick={refresh}>
              <RefreshCw size={13} />
            </button>
            {continueLearning ? (
              <Link to="/student/classrooms" className="inline-flex items-center gap-2 rounded-lg bg-academic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light transition-colors">
                <Play size={15} /> Continue
              </Link>
            ) : (
              <Link to="/student/courses" className="inline-flex items-center gap-2 rounded-lg bg-academic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light transition-colors">
                <Sparkles size={15} /> Start lesson
              </Link>
            )}
          </div>
        </div>

        {/* Continue Learning Hero */}
        {continueLearning && (
          <div className="rounded-xl p-6 mb-6 bg-gradient-to-r from-academic-blue to-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Continue Learning</h2>
                <p className="text-white/70 mb-2 text-sm">{continueLearning.courseTitle}</p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>Step: {continueLearning.currentStep}</span>
                  <span>{continueLearning.progressPercentage}% complete</span>
                </div>
              </div>
              <Link to="/student/classrooms" className="inline-flex items-center gap-2 rounded-lg bg-white text-academic-blue px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
                <Play size={15} /> Resume
              </Link>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-1.5">
              <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${continueLearning.progressPercentage}%` }} />
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard title="Classrooms" value={stats.activeCourses} subtitle="Active courses" color="blue" icon={<Users size={18} />} link="/student/courses" linkText="View all" />
          <StatCard title="Completed" value={stats.completedLessons} subtitle="Lessons finished" color="green" icon={<BookOpen size={18} />} link="/student/sessions" linkText="View" />
          <StatCard title="Study time" value={formatStudyTime(stats.totalTimeMinutes)} subtitle="Total" color="purple" icon={<Clock size={18} />} link="/student/sessions" linkText="View" />
          <StatCard title="Quiz avg" value={`${stats.avgQuizScore}%`} subtitle="Last 10" color="orange" icon={<Target size={18} />} link="/student/quizzes" linkText="View" />
          <StatCard title="Sessions" value={stats.recentSessionsCount} subtitle="Recent" color="cyan" icon={<TrendingUp size={18} />} link="/student/sessions" linkText="View" />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="rounded-xl border border-border bg-white p-4 mb-6">
            <h2 className="text-sm font-bold text-heading mb-3">Recommended for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 bg-page-background-alt rounded-lg">
                  <div className="font-medium text-sm text-heading mb-1">{rec.title}</div>
                  <div className="text-xs text-body mb-2">{rec.description}</div>
                  {rec.targetUrl && (
                    <Link to={rec.targetUrl} className="text-xs text-academic-blue hover:underline font-medium">
                      Go
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Courses Section */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-heading">My Courses</h2>
              <Link to="/student/courses" className="text-xs text-academic-blue font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="p-4">
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses.slice(0, 4).map((course) => (
                    <CourseCard key={course.id ?? Math.random()} course={course as any} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted">
                  <BookOpen size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No courses yet</p>
                  <Link to="/student/courses" className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-academic-blue px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light transition-colors">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="rounded-xl border border-border bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-heading">Schedule</h2>
              <Link to="/student/calendar" className="text-xs text-academic-blue font-medium hover:underline flex items-center gap-1">
                Calendar <ArrowRight size={11} />
              </Link>
            </div>
            <div className="p-4">
              <MiniCalendar />
              <div className="mt-4 space-y-2">
                {recentSessions.length > 0 ? (
                  recentSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-page-background-alt transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-soft-blue flex items-center justify-center text-academic-blue shrink-0">
                        <Calendar size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-heading truncate">{session.lessonTitle}</div>
                        <div className="text-[11px] text-muted truncate">{session.courseTitle}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted text-xs">No upcoming sessions</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-heading">Recent Sessions</h2>
              <Link to="/student/sessions" className="text-xs text-academic-blue font-medium hover:underline flex items-center gap-1">
                View history <ArrowRight size={11} />
              </Link>
            </div>
            <div className="p-4">
              {recentSessions.length > 0 ? (
                <div className="space-y-2">
                  {recentSessions.slice(0, 5).map((session) => (
                    <RecentSessionCard
                      key={session.id}
                      session={{
                        id: session.id,
                        title: session.lessonTitle,
                        courseTitle: session.courseTitle,
                        status: session.status as "completed" | "in_progress" | "scheduled",
                        timestamp: session.startedAt ?? "",
                        duration: session.durationMinutes ? `${session.durationMinutes} min` : "—",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted">
                  <Clock size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No sessions yet. Start your first lesson.</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-xl border border-border bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-heading">Achievements</h2>
              <Link to="/student/achievements" className="text-xs text-academic-blue font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <AchievementCard name="First Steps" sub="Complete first lesson" earned={stats.completedLessons > 0} />
              <AchievementCard name="Week Warrior" sub="7-day streak" earned={false} />
              <AchievementCard name="Perfect Score" sub="100% on a quiz" earned={stats.avgQuizScore === 100} inProgress />
              <AchievementCard name="Quiz Master" sub="10 quizzes done" earned={false} inProgress />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function AchievementCard({
  name,
  sub,
  earned,
  inProgress,
}: {
  name: string;
  sub: string;
  earned: boolean;
  inProgress?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 text-center ${
      earned ? "bg-soft-green border-green-200" : inProgress ? "bg-soft-blue border-blue-200" : "bg-page-background-alt border-border"
    }`}>
      <div className="text-sm font-bold text-heading">{name}</div>
      <div className="text-[11px] text-body mt-0.5">{sub}</div>
      <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
        earned ? "bg-education-green text-white" : inProgress ? "bg-academic-blue text-white" : "bg-border text-muted"
      }`}>
        {earned ? "Earned" : inProgress ? "In progress" : "Locked"}
      </div>
    </div>
  );
}

function MiniCalendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = new Date();
  const today = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-heading">{month}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day) => (
          <div key={day} className="text-[10px] font-semibold text-muted pb-1">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const dayNum = i - 2;
          const isToday = dayNum === today;
          const isOtherMonth = dayNum <= 0 || dayNum > 31;
          return (
            <div
              key={i}
              className={`text-xs py-1 rounded ${
                isToday ? "bg-academic-blue text-white font-bold" : isOtherMonth ? "text-border" : "text-body"
              }`}
            >
              {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
