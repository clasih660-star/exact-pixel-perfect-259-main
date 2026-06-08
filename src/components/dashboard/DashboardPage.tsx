import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { RecentSessionCard } from "@/components/dashboard/RecentSessionCard";
import { DEMO_DASHBOARD_DATA } from "@/lib/demo-data";
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
} from "lucide-react";

export function DashboardPage() {
  const { studentName, stats, courses, recentSessions, upcomingSessions } = DEMO_DASHBOARD_DATA;

  return (
    <AppShell>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Welcome back, {studentName}!</h1>
            <p className="page-subtitle">
              You're making great progress. Keep up the fantastic work!
            </p>
          </div>
          <button className="btn btn-primary">
            <Sparkles size={16} />
            Start new lesson
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <StatCard
            title="Classrooms"
            value={stats.classrooms}
            subtitle="Active courses"
            color="blue"
            icon={<Users size={20} />}
            link="/courses"
            linkText="View all"
          />
          <StatCard
            title="Completed"
            value={stats.completedLessons}
            subtitle="Lessons finished"
            color="green"
            icon={<BookOpen size={20} />}
            link="/progress"
            linkText="View progress"
          />
          <StatCard
            title="Study time"
            value={stats.studyTime}
            subtitle="This week"
            color="purple"
            icon={<Clock size={20} />}
            link="/progress"
            linkText="View details"
          />
          <StatCard
            title="Quiz average"
            value={`${stats.quizAverage}%`}
            subtitle="Last 10 quizzes"
            color="orange"
            icon={<Target size={20} />}
            link="/progress"
            linkText="View quizzes"
          />
          <StatCard
            title="Streak"
            value={stats.streak}
            subtitle="Days in a row"
            color="cyan"
            icon={<Flame size={20} />}
            link="/progress"
            linkText="Keep it up!"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Courses Section */}
          <div className="card" style={{ gridColumn: "span 2" }}>
            <div className="section-header">
              <h2 className="section-title">My Courses</h2>
              <a href="/courses" className="section-link">
                View all <ArrowRight size={12} />
              </a>
            </div>
            <div className="classroom-list">
              {courses.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Start AI Learning Card */}
            <div className="start-ai-card">
              <div className="flex-1">
                <div className="ai-title">Start AI Learning Session</div>
                <div className="ai-desc">
                  Begin an interactive lesson with Mr. Klass, your AI teacher
                </div>
              </div>
              <button className="btn btn-primary">
                <Sparkles size={16} />
                Start
              </button>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Schedule</h2>
              <a href="/schedule" className="section-link">
                Full calendar <ArrowRight size={12} />
              </a>
            </div>
            <MiniCalendar />
            <div className="upcoming-list">
              {upcomingSessions?.slice(0, 3).map((session) => (
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
              <a href="/progress" className="section-link">
                View history <ArrowRight size={12} />
              </a>
            </div>
            <div className="session-list">
              {recentSessions.slice(0, 5).map((session) => (
                <RecentSessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Achievements</h2>
              <a href="/progress" className="section-link">
                View all <ArrowRight size={12} />
              </a>
            </div>
            <div className="achievements-row">
              <div className="achievement-card green">
                <span className="ach-icon">🎯</span>
                <div className="ach-name">First Steps</div>
                <div className="ach-sub">Complete your first lesson</div>
                <div className="ach-tag badge badge-green">Earned</div>
              </div>
              <div className="achievement-card green">
                <span className="ach-icon">🔥</span>
                <div className="ach-name">Week Warrior</div>
                <div className="ach-sub">7-day learning streak</div>
                <div className="ach-tag badge badge-green">Earned</div>
              </div>
              <div className="achievement-card blue">
                <span className="ach-icon">💯</span>
                <div className="ach-name">Perfect Score</div>
                <div className="ach-sub">Score 100% on a quiz</div>
                <div className="ach-tag badge badge-orange">In progress</div>
              </div>
              <div className="achievement-card blue">
                <span className="ach-icon">🏆</span>
                <div className="ach-name">Quiz Master</div>
                <div className="ach-sub">Complete 10 quizzes</div>
                <div className="ach-tag badge badge-orange">In progress</div>
              </div>
              <div className="achievement-card purple">
                <span className="ach-icon">🧮</span>
                <div className="ach-name">Math Whiz</div>
                <div className="ach-sub">Complete all algebra lessons</div>
                <div className="ach-tag badge badge-blue">In progress</div>
              </div>
              <div className="achievement-card purple">
                <span className="ach-icon">⚡</span>
                <div className="ach-name">Quick Learner</div>
                <div className="ach-sub">5 lessons in one day</div>
                <div className="ach-tag badge badge-blue">In progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
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
