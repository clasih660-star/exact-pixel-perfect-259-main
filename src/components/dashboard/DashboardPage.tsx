/**
 * DashboardPage.tsx
 *
 * Production-grade dashboard that fetches real data from the backend,
 * falling back to demo data when no real data exists.
 */

import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { RecentSessionCard } from "@/components/dashboard/RecentSessionCard";
import { useDashboard } from "@/hooks/useDashboard";
import { DEMO_DASHBOARD_DATA } from "@/lib/demo-data";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Users,
  BookOpen,
  Clock,
  Target,
  Award,
  ArrowRight,
  Calendar,
  TrendingUp,
  Sparkles,
  Trophy,
  Star,
  Flame,
  Brain,
  Zap,
  RefreshCw,
  Play,
} from "lucide-react";

export function DashboardPage() {
  const { data, isLoading, error, refresh, isUsingDemoData } = useDashboard();
  const navigate = useNavigate();

  // Fallback to demo data structure for sections not yet populated by real data
  const demo = DEMO_DASHBOARD_DATA;
  const { upcomingSessions } = demo;

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading your dashboard...</p>
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
        {/* Demo mode indicator */}
        {isUsingDemoData && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-amber-700">
            <Sparkles size={14} />
            <span>Showing demo data. Start a lesson to see your real progress!</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Welcome back!</h1>
            <p className="page-subtitle">
              {continueLearning
                ? "Continue where you left off, or start something new."
                : "You're making great progress. Keep up the fantastic work!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm" onClick={refresh}>
              <RefreshCw size={14} />
            </button>
            {continueLearning ? (
              <Link
                to="/student/classrooms"
                className="btn btn-primary"
              >
                <Play size={16} />
                Continue Learning
              </Link>
            ) : (
              <Link to="/student/courses" className="btn btn-primary">
                <Sparkles size={16} />
                Start new lesson
              </Link>
            )}
          </div>
        </div>

        {/* Continue Learning Hero */}
        {continueLearning && (
          <div className="card p-6 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Continue Learning</h2>
                <p className="text-blue-100 mb-2">
                  {continueLearning.courseTitle}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-blue-200">
                    <span>Step: {continueLearning.currentStep}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-blue-200">
                    <span>{continueLearning.progressPercentage}% complete</span>
                  </div>
                </div>
              </div>
              <Link
                to="/student/classrooms"
                className="btn bg-white text-blue-600 hover:bg-blue-50"
              >
                <Play size={16} />
                Resume
              </Link>
            </div>
            <div className="mt-4 bg-blue-500/30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${continueLearning.progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="stats-row">
          <StatCard
            title="Classrooms"
            value={stats.activeCourses}
            subtitle="Active courses"
            color="blue"
            icon={<Users size={20} />}
            link="/student/courses"
            linkText="View all"
          />
          <StatCard
            title="Completed"
            value={stats.completedLessons}
            subtitle="Lessons finished"
            color="green"
            icon={<BookOpen size={20} />}
            link="/student/sessions"
            linkText="View progress"
          />
          <StatCard
            title="Study time"
            value={formatStudyTime(stats.totalTimeMinutes)}
            subtitle="Total"
            color="purple"
            icon={<Clock size={20} />}
            link="/student/sessions"
            linkText="View details"
          />
          <StatCard
            title="Quiz average"
            value={`${stats.avgQuizScore}%`}
            subtitle="Last 10 quizzes"
            color="orange"
            icon={<Target size={20} />}
            link="/student/quizzes"
            linkText="View quizzes"
          />
          <StatCard
            title="Sessions"
            value={stats.recentSessionsCount}
            subtitle="Recent"
            color="cyan"
            icon={<Flame size={20} />}
            link="/student/sessions"
            linkText="View all"
          />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="card p-4 mb-6">
            <div className="section-header">
              <h2 className="section-title">
                <Brain size={16} className="inline mr-1" />
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">{rec.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{rec.description}</div>
                  {rec.targetUrl && (
                    <Link to={rec.targetUrl} className="text-xs text-blue-600 hover:underline">
                      Go →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Courses Section */}
          <div className="card" style={{ gridColumn: "span 2" }}>
            <div className="section-header">
              <h2 className="section-title">My Courses</h2>
              <Link to="/student/courses" className="section-link">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="classroom-list">
              {courses.length > 0 ? (
                courses.slice(0, 4).map((course) => (
                  <CourseCard key={course.id ?? Math.random()} course={course as any} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen size={32} className="mx-auto mb-2" />
                  <p>No courses yet. Browse available courses to get started!</p>
                  <Link to="/student/courses" className="btn btn-primary mt-3">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Start AI Learning Card */}
            <div className="start-ai-card">
              <div className="flex-1">
                <div className="ai-title">Start AI Learning Session</div>
                <div className="ai-desc">
                  Begin an interactive lesson with Mr. Klass, your AI teacher
                </div>
              </div>
              <Link to="/student/courses" className="btn btn-primary">
                <Sparkles size={16} />
                Start
              </Link>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Schedule</h2>
              <Link to="/student/calendar" className="section-link">
                Full calendar <ArrowRight size={12} />
              </Link>
            </div>
            <MiniCalendar />
            <div className="upcoming-list">
              {upcomingSessions?.slice(0, 3).map((session: any) => (
                <div key={session.id} className="upcoming-item">
                  <div
                    className={`upcoming-icon ${
                      session.type === "quiz"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {session.type === "quiz" ? <Target size={16} /> : <Calendar size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="upcoming-name">{session.title}</div>
                    <div className="upcoming-class">{session.courseTitle}</div>
                  </div>
                  <div className="upcoming-time">{session.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          {/* Recent Sessions */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Recent Sessions</h2>
              <Link to="/student/sessions" className="section-link">
                View history <ArrowRight size={12} />
              </Link>
            </div>
            <div className="session-list">
              {recentSessions.length > 0 ? (
                recentSessions.slice(0, 5).map((session) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock size={32} className="mx-auto mb-2" />
                  <p>No sessions yet. Start your first lesson!</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Achievements</h2>
              <Link to="/student/achievements" className="section-link">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="achievements-row">
              <AchievementCard icon="🎯" name="First Steps" sub="Complete your first lesson" earned={stats.completedLessons > 0} />
              <AchievementCard icon="🔥" name="Week Warrior" sub="7-day learning streak" earned={false} />
              <AchievementCard icon="💯" name="Perfect Score" sub="Score 100% on a quiz" earned={stats.avgQuizScore === 100} inProgress />
              <AchievementCard icon="🏆" name="Quiz Master" sub="Complete 10 quizzes" earned={false} inProgress />
              <AchievementCard icon="🧮" name="Math Whiz" sub="Complete all algebra lessons" earned={false} inProgress />
              <AchievementCard icon="⚡" name="Quick Learner" sub="5 lessons in one day" earned={false} inProgress />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function AchievementCard({ icon, name, sub, earned, inProgress }: {
  icon: string;
  name: string;
  sub: string;
  earned: boolean;
  inProgress?: boolean;
}) {
  return (
    <div className={`achievement-card ${earned ? "green" : inProgress ? "blue" : "purple"}`}>
      <span className="ach-icon">{icon}</span>
      <div className="ach-name">{name}</div>
      <div className="ach-sub">{sub}</div>
      <div className={`ach-tag badge ${earned ? "badge-green" : inProgress ? "badge-orange" : "badge-blue"}`}>
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
      <div className="calendar-nav">
        <button className="cal-btn">
          <TrendingUp size={14} />
        </button>
        <div className="cal-month">{month}</div>
        <button className="cal-btn">
          <TrendingUp size={14} />
        </button>
      </div>
      <div className="cal-grid">
        {days.map((day) => (
          <div key={day} className="cal-day-label">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const dayNum = i - 2;
          const isToday = dayNum === today;
          const isOtherMonth = dayNum <= 0 || dayNum > 31;

          return (
            <div
              key={i}
              className={`cal-day ${isToday ? "today" : ""} ${isOtherMonth ? "other-month" : ""}`}
            >
              {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}