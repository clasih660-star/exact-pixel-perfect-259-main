import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Video,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { FeaturedActionCard } from "@/components/dashboard/shared/FeaturedActionCard";
import { CourseCard } from "@/components/dashboard/shared/CourseCard";
import { SessionCard } from "@/components/dashboard/shared/SessionCard";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { ActivityFeed } from "@/components/dashboard/shared/ActivityFeed";
import { RealtimeMetricCard } from "@/components/dashboard/shared/RealtimeMetricCard";
import { OnlineStatusDot } from "@/components/dashboard/shared/OnlineStatusDot";
import { AlertBanner } from "@/components/dashboard/shared/AlertBanner";

const config = dashboardConfigs.teacher;

const mockUpcomingSession = {
  title: "Solving Quadratic Equations by Factoring",
  course: "Mathematics Form 2",
  time: "Today at 10:30 AM",
  mode: "AI-Assisted",
  expectedStudents: 32,
  sessionId: "demo",
};

const mockCourses = [
  {
    title: "Mathematics Form 2",
    institution: "Klassruum Demo Academy",
    stats: [
      { label: "Students", value: "32" },
      { label: "Lessons", value: "12/28" },
    ],
    progress: 65,
    href: "/classroom/demo",
  },
  {
    title: "Science Form 3",
    institution: "Klassruum Demo Academy",
    stats: [
      { label: "Students", value: "45" },
      { label: "Lessons", value: "18/24" },
    ],
    progress: 42,
    href: "/classroom/demo_chemistry",
  },
  {
    title: "English Form 2",
    institution: "Klassruum Demo Academy",
    stats: [
      { label: "Students", value: "28" },
      { label: "Lessons", value: "9/15" },
    ],
    progress: 78,
    href: "/classroom/demo_english",
  },
];

const mockUpcomingSessions = [
  {
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    time: "Today at 10:30 AM",
    participantCount: 32,
    status: "scheduled" as const,
    href: "/classroom/demo",
  },
  {
    title: "Chemical Bonding",
    course: "Science Form 3",
    time: "Today at 2:00 PM",
    participantCount: 45,
    status: "scheduled" as const,
    href: "/classroom/demo_chemistry",
  },
  {
    title: "Parts of Speech",
    course: "English Form 2",
    time: "Tomorrow at 9:00 AM",
    participantCount: 28,
    status: "scheduled" as const,
    href: "/classroom/demo_english",
  },
];

const mockLessonReview = [
  {
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    status: "completed" as const,
    description: "Ready for teaching",
    href: "/classroom/demo",
  },
  {
    title: "Chemical Bonding",
    course: "Science Form 3",
    status: "completed" as const,
    description: "Ready for teaching",
    href: "/classroom/demo_chemistry",
  },
  {
    title: "Parts of Speech",
    course: "English Form 2",
    status: "completed" as const,
    description: "Ready for teaching",
    href: "/classroom/demo_english",
  },
];

const mockActivity = [
  {
    id: "1",
    action: "Lesson published",
    description: "Quadratic Equations lesson is live",
    timestamp: "Today at 9:30 AM",
    variant: "success" as const,
  },
  {
    id: "2",
    action: "Student question",
    description: "3 students asked for help with factoring",
    timestamp: "Today at 8:45 AM",
    variant: "default" as const,
  },
  {
    id: "3",
    action: "Session completed",
    description: "32 students completed Chemical Reactions lesson",
    timestamp: "Yesterday at 4:15 PM",
    variant: "success" as const,
  },
  {
    id: "4",
    action: "Quiz graded",
    description: "Reviewed 45 quiz submissions from Math Form 2",
    timestamp: "Yesterday at 3:00 PM",
    variant: "default" as const,
  },
];

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardShell config={config} activePath="/teacher/dashboard">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell config={config} activePath="/teacher/dashboard">
        <DashboardLoadingState type="error" message={error} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/teacher/dashboard">
      <PageHeader
        label="Teaching workspace"
        title="Prepare, teach, and support learners"
        subtitle="Manage your courses, review lessons, and monitor student progress across all assigned classes."
      />

      {/* Alert for pending reviews */}
      <AlertBanner
        variant="warning"
        title="2 lessons need your review"
        description="Chemical Bonding and HTML Forms lessons have pending caption and quiz updates."
        action={{ label: "Review Now", onClick: () => console.log("Review") }}
        closeable
      />

      {/* Featured Upcoming Session */}
      <FeaturedActionCard
        title={mockUpcomingSession.title}
        description={`${mockUpcomingSession.course} · ${mockUpcomingSession.time}`}
        badge={<StatusBadge variant="info">Next Session</StatusBadge>}
        content={
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Mode</p>
                <p className="mt-1 text-base font-bold text-[#0F172A]">{mockUpcomingSession.mode}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Expected Students</p>
                <div className="mt-1 flex items-center gap-2">
                  <OnlineStatusDot online={true} animate={false} />
                  <p className="text-base font-bold text-[#0F172A]">{mockUpcomingSession.expectedStudents}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Accessibility</p>
                <p className="mt-1 text-base font-bold text-[#0F172A]">Captions on</p>
              </div>
            </div>
          </div>
        }
        actions={[
          {
            label: "Start Class",
            href: `/classroom/demo`,
            variant: "primary",
          },
          {
            label: "Preview Lesson",
            href: "/teacher/lessons/lesson_quadratic/preview",
            variant: "secondary",
          },
          {
            label: "View Students",
            href: "/teacher/courses/course_math/students",
            variant: "secondary",
          },
        ]}
      />

      {/* KPI Cards */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          title="Assigned Courses"
          value="3"
          subtitle="Active courses"
          href="/teacher/courses"
          icon={BookOpen}
        />
        <KpiCard
          title="Total Students"
          value="105"
          subtitle="Across all courses"
          href="/teacher/students"
          icon={Users}
        />
        <KpiCard
          title="Lessons Ready"
          value="12"
          subtitle="Approved lessons"
          href="/teacher/lessons"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Pending Review"
          value="2"
          subtitle="Needs your action"
          href="/teacher/lessons"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Sessions Today"
          value="3"
          subtitle="Teaching sessions"
          href="/teacher/sessions"
          icon={Video}
        />
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Courses and Lessons */}
        <div className="space-y-8 lg:col-span-2">
          {/* My Courses */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">My Courses</h2>
                <p className="mt-0.5 text-sm text-[#64748B]">Courses you are responsible for</p>
              </div>
              <Link
                to="/teacher/courses"
                className="text-sm font-bold text-[#1F7C80] hover:text-[#1A5256]"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mockCourses.map((course) => (
                <CourseCard
                  key={course.title}
                  title={course.title}
                  institution={course.institution}
                  progress={course.progress}
                  stats={course.stats}
                  href={course.href}
                />
              ))}
            </div>
          </div>

          {/* Lessons Needing Review */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Lesson Review Queue</h2>
                <p className="mt-0.5 text-sm text-[#64748B]">Lessons awaiting your approval</p>
              </div>
              <Link
                to="/teacher/lessons"
                className="text-sm font-bold text-[#1F7C80] hover:text-[#1A5256]"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockLessonReview.map((lesson) => (
                <Link
                  key={lesson.title}
                  to={lesson.href}
                  className="block rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all hover:border-[#1F7C80]/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-[#0F172A]">{lesson.title}</h3>
                        <StatusBadge variant="success">Ready</StatusBadge>
                      </div>
                      <p className="text-sm text-[#64748B]">{lesson.course}</p>
                      <p className="text-xs text-[#94A3B8] mt-1">{lesson.description}</p>
                    </div>
                    <Eye className="h-5 w-5 text-[#1F7C80] flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sessions and Activity */}
        <div className="space-y-6 lg:col-span-1">
          {/* Upcoming Sessions */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0F172A]">Today's Schedule</h3>
              <Link
                to="/teacher/sessions"
                className="text-xs font-bold text-[#1F7C80] hover:text-[#1A5256]"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockUpcomingSessions.map((session) => (
                <SessionCard
                  key={session.title}
                  title={session.title}
                  course={session.course}
                  time={session.time}
                  participantCount={session.participantCount}
                  status={session.status}
                  href={session.href}
                />
              ))}
            </div>
          </div>

          {/* Active Metrics */}
          <RealtimeMetricCard
            title="Students Online"
            value="87"
            subtitle="In my courses right now"
            isLive={true}
            status="up"
            change="+12 this hour"
            icon={Users}
          />

          {/* Activity Feed */}
          <ActivityFeed title="Recent Activity" items={mockActivity} maxItems={4} />
        </div>
      </section>
    </DashboardShell>
  );
}
