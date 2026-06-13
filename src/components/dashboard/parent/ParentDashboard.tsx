import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  BarChart3,
  Video,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  BookOpen,
  Eye,
} from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { FeaturedActionCard } from "@/components/dashboard/shared/FeaturedActionCard";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { SessionCard } from "@/components/dashboard/shared/SessionCard";
import { RealtimeMetricCard } from "@/components/dashboard/shared/RealtimeMetricCard";
import { OnlineStatusDot } from "@/components/dashboard/shared/OnlineStatusDot";
import { ActivityFeed } from "@/components/dashboard/shared/ActivityFeed";

const config = dashboardConfigs.parent;

const mockLearners = [
  {
    id: "learner_1",
    name: "John Doe",
    course: "Mathematics Form 2",
    institution: "Klassruum Demo Academy",
    progress: 65,
    quizAverage: 86,
    lessonsCompleted: 12,
    streak: 7,
    online: true,
  },
  {
    id: "learner_2",
    name: "Sarah Doe",
    course: "KCSE Chemistry Revision",
    institution: "Klassruum Demo Academy",
    progress: 42,
    quizAverage: 81,
    lessonsCompleted: 8,
    streak: 4,
    online: false,
  },
];

const mockSessions = [
  {
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    time: "Today at 2:30 PM",
    duration: "45 min",
    status: "completed" as const,
    href: "/parent/sessions/sess_1",
  },
  {
    title: "Chemical Reactions",
    course: "KCSE Chemistry Revision",
    time: "Yesterday at 4:00 PM",
    duration: "38 min",
    status: "completed" as const,
    href: "/parent/sessions/sess_2",
  },
  {
    title: "HTML Introduction",
    course: "Computer Studies Basics",
    time: "3 days ago at 9:30 AM",
    duration: "41 min",
    status: "completed" as const,
    href: "/parent/sessions/sess_3",
  },
];

const mockActivity = [
  {
    id: "1",
    action: "Completed lesson",
    description: 'John finished "Quadratic Equations" lesson',
    timestamp: "Today at 2:45 PM",
    variant: "success" as const,
  },
  {
    id: "2",
    action: "Quiz completed",
    description: "John scored 92% on Quadratic Equations quiz",
    timestamp: "Today at 2:42 PM",
    variant: "success" as const,
  },
  {
    id: "3",
    action: "New assignment",
    description: "Teacher assigned homework for Chemical Reactions",
    timestamp: "Today at 1:30 PM",
    variant: "default" as const,
  },
  {
    id: "4",
    action: "Progress update",
    description: "Sarah completed 8 lessons this month",
    timestamp: "Yesterday at 5:00 PM",
    variant: "success" as const,
  },
];

export function ParentDashboard() {
  const [selectedLearner, setSelectedLearner] = useState(mockLearners[0]);

  return (
    <DashboardShell config={config} activePath="/parent/dashboard">
      <PageHeader
        label="Parent Portal"
        title="Monitor your child's progress"
        subtitle="Track learning activities, review performance, and stay connected with teachers."
      />

      {/* Featured Current Activity */}
      <FeaturedActionCard
        title={`${selectedLearner.name} is learning ${selectedLearner.course}`}
        description={selectedLearner.institution}
        badge={<StatusBadge variant="success">Active Today</StatusBadge>}
        content={
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Progress</p>
                <p className="mt-1 text-3xl font-bold text-[#1F7C80]">
                  {selectedLearner.progress}%
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Quiz Average</p>
                <p className="mt-1 text-3xl font-bold text-[#0F172A]">
                  {selectedLearner.quizAverage}%
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Lessons Done</p>
                <p className="mt-1 text-3xl font-bold text-[#0F172A]">
                  {selectedLearner.lessonsCompleted}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Study Streak</p>
                <p className="mt-1 text-3xl font-bold text-[#0F172A]">
                  {selectedLearner.streak}
                </p>
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full bg-[#1F7C80] transition-all"
                style={{ width: `${selectedLearner.progress}%` }}
              />
            </div>
          </div>
        }
        actions={[
          {
            label: "View Full Progress",
            href: "/parent/progress",
            variant: "primary",
          },
          {
            label: "View Reports",
            href: "/parent/reports",
            variant: "secondary",
          },
          {
            label: "Message Teacher",
            href: "/parent/messages",
            variant: "secondary",
          },
        ]}
      />

      {/* KPI Cards */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          title="Children"
          value={mockLearners.length.toString()}
          subtitle="Enrolled learners"
          href="/parent/learners"
          icon={Users}
        />
        <KpiCard
          title="Avg Score"
          value="86%"
          subtitle="Quiz performance"
          href="/parent/progress"
          icon={BarChart3}
          trend="+5%"
        />
        <KpiCard
          title="Sessions"
          value="24"
          subtitle="This month"
          href="/parent/sessions"
          icon={Video}
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
          subtitle="Completed"
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

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Learners and Sessions */}
        <div className="space-y-8 lg:col-span-2">
          {/* My Learners */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">My Learners</h2>
                <p className="mt-0.5 text-sm text-[#64748B]">Children enrolled in Klassruum</p>
              </div>
            </div>
            <div className="space-y-3">
              {mockLearners.map((learner) => (
                <button
                  key={learner.id}
                  onClick={() => setSelectedLearner(learner)}
                  className={`w-full text-left rounded-2xl border transition-all p-5 ${
                    selectedLearner.id === learner.id
                      ? "border-[#1F7C80] bg-[#EFF6FF] shadow-md"
                      : "border-[#E2E8F0] bg-white hover:border-[#1F7C80]/30 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#0F172A]">{learner.name}</h3>
                        {learner.online && <OnlineStatusDot online={true} />}
                      </div>
                      <p className="text-sm text-[#64748B] mt-0.5">{learner.course}</p>
                      <p className="text-xs text-[#94A3B8]">{learner.institution}</p>
                    </div>
                    <StatusBadge variant={learner.online ? "success" : "warning"}>
                      {learner.online ? "Online" : "Offline"}
                    </StatusBadge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-lg bg-[#F8FAFC] p-2 text-center">
                      <p className="text-xs font-bold text-[#1F7C80]">{learner.progress}%</p>
                      <p className="text-[10px] text-[#64748B]">Progress</p>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-2 text-center">
                      <p className="text-xs font-bold text-[#0F172A]">{learner.quizAverage}%</p>
                      <p className="text-[10px] text-[#64748B]">Quiz Avg</p>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-2 text-center">
                      <p className="text-xs font-bold text-[#0F172A]">{learner.lessonsCompleted}</p>
                      <p className="text-[10px] text-[#64748B]">Lessons</p>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-2 text-center">
                      <p className="text-xs font-bold text-[#0F172A]">{learner.streak}</p>
                      <p className="text-[10px] text-[#64748B]">Streak</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-full rounded-full bg-[#1F7C80] transition-all"
                        style={{ width: `${learner.progress}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Recent Sessions</h2>
                <p className="mt-0.5 text-sm text-[#64748B]">Learning activity history</p>
              </div>
              <Link
                to="/parent/sessions"
                className="text-sm font-bold text-[#1F7C80] hover:text-[#1A5256]"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockSessions.map((session) => (
                <SessionCard
                  key={session.title}
                  title={session.title}
                  course={session.course}
                  time={session.time}
                  duration={session.duration}
                  status={session.status}
                  href={session.href}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Learner Status */}
          <RealtimeMetricCard
            title={`${selectedLearner.name}'s Status`}
            value={selectedLearner.online ? "Online" : "Offline"}
            subtitle="Learning now"
            isLive={selectedLearner.online}
            icon={Eye}
          />

          {/* Recommended Actions */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <h3 className="font-bold text-[#0F172A] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/parent/progress"
                className="block rounded-lg bg-[#EFF6FF] px-3 py-2.5 text-sm font-bold text-[#1F7C80] transition-all hover:bg-[#DBEAFE]"
              >
                View Progress Report
              </Link>
              <Link
                to="/parent/reports"
                className="block rounded-lg bg-[#F8FAFC] px-3 py-2.5 text-sm font-bold text-[#0F172A] border border-[#E2E8F0] transition-all hover:bg-[#EFF6FF]"
              >
                Download Report
              </Link>
              <Link
                to="/parent/messages"
                className="block rounded-lg bg-[#F8FAFC] px-3 py-2.5 text-sm font-bold text-[#0F172A] border border-[#E2E8F0] transition-all hover:bg-[#EFF6FF]"
              >
                Message Teacher
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <ActivityFeed title="Recent Activity" items={mockActivity} maxItems={4} />
        </div>
      </section>
    </DashboardShell>
  );
}
