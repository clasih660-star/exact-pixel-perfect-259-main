import { Link } from "@tanstack/react-router";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { 
  Users, 
  BarChart3, 
  Video, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  ArrowUpRight,
  BookOpen,
  Star
} from "lucide-react";

export function ParentDashboard() {
  const config = dashboardConfigs.parent;

  return (
    <DashboardShell config={config} activePath="/parent/dashboard">
      {/* Dashboard Header */}
      <section className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            Parent Portal
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gray-900)] lg:text-4xl">
          Monitor Your Child's Progress
        </h1>
        <p className="mt-2 text-sm text-[var(--gray-500)]">
          Track learning activities, review performance, and stay connected with teachers
        </p>
      </section>

      {/* Featured hero — latest learner activity */}
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-white via-[var(--primary-light)] to-white p-7 shadow-lg">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-[var(--primary)]/5 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active today
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--gray-900)] lg:text-3xl">
              John is learning Quadratic Equations
            </h2>
            <p className="mt-1 text-sm text-[var(--gray-500)]">
              Mathematics Form 2 · Klassruum Demo Academy
            </p>
            <div className="mt-5 flex items-center gap-6">
              <div>
                <p className="text-xs text-[var(--gray-400)]">Current Step</p>
                <p className="font-bold text-[var(--gray-900)]">Step 3 of 8 · Worked Example</p>
              </div>
              <div className="h-8 w-px bg-[var(--gray-200)]" />
              <div>
                <p className="text-xs text-[var(--gray-400)]">Progress</p>
                <p className="text-2xl font-extrabold text-[var(--primary)]">42%</p>
              </div>
              <div className="h-8 w-px bg-[var(--gray-200)]" />
              <div>
                <p className="text-xs text-[var(--gray-400)]">This Week</p>
                <p className="font-bold text-[var(--gray-900)]">18h 30m</p>
              </div>
            </div>
            <div className="mt-4 h-2.5 w-full max-w-md rounded-full bg-[var(--primary)]/10">
              <div className="h-full w-[42%] rounded-full bg-[var(--primary)] transition-all" />
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <Link
              to="/parent/progress"
              className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:bg-[var(--primary-dark)] lg:w-auto"
            >
              <TrendingUp className="h-4 w-4" />
              View Progress
            </Link>
            <Link
              to="/parent/sessions"
              className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 bg-white px-6 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)] lg:w-auto"
            >
              <Video className="h-4 w-4" />
              Recent Sessions
            </Link>
            <Link
              to="/parent/messages"
              className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--primary)]/20 bg-white px-6 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)] lg:w-auto"
            >
              <MessageSquare className="h-4 w-4" />
              Message Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* Parent KPI Cards */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard 
          title="Learners" 
          value="2" 
          subtitle="Children enrolled" 
          href="/parent/learners" 
          icon={Users}
        />
        <KpiCard 
          title="Average Score" 
          value="87%" 
          subtitle="Quiz performance" 
          href="/parent/progress" 
          icon={BarChart3}
          trend="+5%"
        />
        <KpiCard 
          title="Sessions Attended" 
          value="24" 
          subtitle="This month" 
          href="/parent/sessions" 
          icon={Video}
          trend="+3"
        />
        <KpiCard 
          title="Study Time" 
          value="18h 30m" 
          subtitle="This week" 
          href="/parent/progress" 
          icon={Clock}
        />
        <KpiCard 
          title="Assignments" 
          value="8" 
          subtitle="Completed this week" 
          href="/parent/reports" 
          icon={CheckCircle2}
        />
        <KpiCard 
          title="Achievements" 
          value="12" 
          subtitle="Badges earned" 
          href="/parent/reports" 
          icon={Award}
        />
      </section>

      {/* Learner Overview */}
      <section className="mb-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Learner 1 */}
          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                  JD
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)]">John Doe</h3>
                  <p className="text-sm text-[var(--gray-500)]">Mathematics Form 2</p>
                  <p className="text-xs text-[var(--gray-400)]">Klassruum Demo Academy</p>
                </div>
              </div>
              <span className="status-pill bg-green-100 text-green-700">Active</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[var(--gray-50)] p-3 text-center">
                <p className="text-2xl font-bold text-[var(--gray-900)]">86%</p>
                <p className="text-xs text-[var(--gray-500)]">Quiz Avg</p>
              </div>
              <div className="rounded-lg bg-[var(--gray-50)] p-3 text-center">
                <p className="text-2xl font-bold text-[var(--gray-900)]">12</p>
                <p className="text-xs text-[var(--gray-500)]">Lessons</p>
              </div>
              <div className="rounded-lg bg-[var(--gray-50)] p-3 text-center">
                <p className="text-2xl font-bold text-[var(--gray-900)]">7</p>
                <p className="text-xs text-[var(--gray-500)]">Day Streak</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gray-900)]">Course Progress</span>
                <span className="text-xs text-[var(--gray-500)]">65% complete</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-200)]">
                <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/parent/progress"
                className="flex-1 rounded-lg border border-[var(--gray-200)] bg-white px-3 py-2 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--gray-50)]"
              >
                View Progress
              </Link>
              <Link
                to="/parent/sessions"
                className="flex-1 rounded-lg border border-[var(--gray-200)] bg-white px-3 py-2 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--gray-50)]"
              >
                View Sessions
              </Link>
            </div>
          </div>

          {/* Learner 2 */}
          <div className="dashboard-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-600 text-xl font-bold text-white">
                  SD
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)]">Sarah Doe</h3>
                  <p className="text-sm text-[var(--gray-500)]">Science Form 1</p>
                  <p className="text-xs text-[var(--gray-400)]">Klassruum Demo Academy</p>
                </div>
              </div>
              <span className="status-pill bg-green-100 text-green-700">Active</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[var(--gray-50)] p-3 text-center">
                <p className="text-2xl font-bold text-[var(--gray-900)]">92%</p>
                <p className="text-xs text-[var(--gray-500)]">Quiz Avg</p>
              </div>
              <div className="rounded-lg bg-[var(--gray-50)] p-3 text-center">
                <p className="text-2xl font-bold text-[var(--gray-900)]">8</p>
                <p className="text-xs text-[var(--gray-500)]">Lessons</p>
              </div>
              <div className="rounded-lg bg-[var(--gray-50)] p-3 text-center">
                <p className="text-2xl font-bold text-[var(--gray-900)]">5</p>
                <p className="text-xs text-[var(--gray-500)]">Day Streak</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gray-900)]">Course Progress</span>
                <span className="text-xs text-[var(--gray-500)]">42% complete</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-200)]">
                <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: '42%' }} />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/parent/progress"
                className="flex-1 rounded-lg border border-[var(--gray-200)] bg-white px-3 py-2 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--gray-50)]"
              >
                View Progress
              </Link>
              <Link
                to="/parent/sessions"
                className="flex-1 rounded-lg border border-[var(--gray-200)] bg-white px-3 py-2 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--gray-50)]"
              >
                View Sessions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Recent Sessions */}
        <div className="dashboard-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Sessions</h2>
            <Link to="/parent/sessions" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Quadratic Equations</p>
                <p className="text-xs text-[var(--gray-500)]">John Doe · Mathematics · 45 min</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="status-pill bg-green-100 text-green-700">Completed</span>
                  <span className="text-xs text-[var(--gray-400)]">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Chemical Reactions</p>
                <p className="text-xs text-[var(--gray-500)]">Sarah Doe · Science · 38 min</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="status-pill bg-green-100 text-green-700">Completed</span>
                  <span className="text-xs text-[var(--gray-400)]">Yesterday</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Video className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Introduction to Biology</p>
                <p className="text-xs text-[var(--gray-500)]">Sarah Doe · Science · 42 min</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="status-pill bg-green-100 text-green-700">Completed</span>
                  <span className="text-xs text-[var(--gray-400)]">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="dashboard-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Quiz Performance</h2>
            <Link to="/parent/reports" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View details
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--gray-900)]">John Doe</p>
                  <p className="text-xs text-[var(--gray-500)]">Mathematics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-lg font-bold text-[var(--gray-900)]">86%</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-600 text-sm font-bold text-white">
                  SD
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--gray-900)]">Sarah Doe</p>
                  <p className="text-xs text-[var(--gray-500)]">Science</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-lg font-bold text-[var(--gray-900)]">92%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-[var(--gray-50)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--gray-900)]">Overall Average</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold text-[var(--gray-900)]">89%</span>
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[var(--gray-200)]">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '89%' }} />
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="dashboard-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Upcoming Sessions</h2>
            <Link to="/parent/sessions" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Linear Equations</p>
                <p className="text-xs text-[var(--gray-500)]">John Doe · Mathematics</p>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[var(--gray-400)]" />
                  <span className="text-xs text-[var(--gray-500)]">Tomorrow at 10:00 AM</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Introduction to Physics</p>
                <p className="text-xs text-[var(--gray-500)]">Sarah Doe · Science</p>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[var(--gray-400)]" />
                  <span className="text-xs text-[var(--gray-500)]">Friday at 2:00 PM</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Quiz Review Session</p>
                <p className="text-xs text-[var(--gray-500)]">John Doe · Mathematics</p>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[var(--gray-400)]" />
                  <span className="text-xs text-[var(--gray-500)]">Next Monday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Messages */}
        <div className="dashboard-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Teacher Messages</h2>
            <Link to="/parent/messages" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                SM
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--gray-900)]">Ms. Mary</p>
                  <span className="text-xs text-[var(--gray-400)]">2h ago</span>
                </div>
                <p className="mt-1 text-xs text-[var(--gray-500)]">
                  John is doing great! His algebra skills have improved significantly this week.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                JK
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--gray-900)]">Mr. James</p>
                  <span className="text-xs text-[var(--gray-400)]">1d ago</span>
                </div>
                <p className="mt-1 text-xs text-[var(--gray-500)]">
                  Sarah showed excellent participation in today's chemistry lab.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="dashboard-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Reports</h2>
            <Link to="/parent/reports" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Weekly Progress Report</p>
                <p className="text-xs text-[var(--gray-500)]">John Doe · Mathematics</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-[var(--gray-400)]">Generated 3 days ago</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--gray-400)]" />
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Performance Analysis</p>
                <p className="text-xs text-[var(--gray-500)]">Sarah Doe · Science</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-[var(--gray-400)]">Generated 5 days ago</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--gray-400)]" />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="dashboard-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Achievements</h2>
            <Link to="/parent/reports" className="text-sm font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Math Champion</p>
                <p className="text-xs text-[var(--gray-500)]">John Doe · 100% on algebra quiz</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-[var(--gray-400)]">Earned today</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-gradient-to-r from-purple-50 to-pink-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Science Explorer</p>
                <p className="text-xs text-[var(--gray-500)]">Sarah Doe · Completed 10 science lessons</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-[var(--gray-400)]">Earned yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}