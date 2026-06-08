import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Calendar, Clock3, GraduationCap, MessageSquare, Plus, Settings, Target, TrendingUp, Users, Video, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, CirclePlay as PlayCircle, Lightbulb, ChartBar as BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  component: TeacherDashboardPage,
});

function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <TeacherDashboardChrome />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <TeachingTodaySection />
          <TeacherStatsGrid />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <MyCoursesSection />
              <LessonPreparationSection />
            </div>

            <div className="space-y-6">
              <UpcomingSessionsSection />
              <StudentAlertsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboardChrome() {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--gray-200)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--gray-900)]">Teacher Dashboard</h1>
            <p className="text-xs text-[var(--gray-500)]">Manage your courses and sessions</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--gray-600)] md:flex">
          <Link to="/teacher/dashboard" className="text-[var(--primary)]">Dashboard</Link>
          <Link to="/teacher/courses">My Courses</Link>
          <Link to="/teacher/lessons">Lessons</Link>
          <Link to="/teacher/sessions">Sessions</Link>
          <Link to="/teacher/students">Students</Link>
          <Link to="/teacher/analytics">Analytics</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/teacher/lessons">
            <Button variant="outline" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Lesson
            </Button>
          </Link>
          <Link to="/teacher/settings">
            <Button variant="ghost" size="icon-sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function TeachingTodaySection() {
  const sessions = [
    { id: "1", time: "09:00 AM", course: "Mathematics Form 2", lesson: "Quadratic Equations", students: 28 },
    { id: "2", time: "11:30 AM", course: "Physics Form 3", lesson: "Newton's Laws", students: 24 },
    { id: "3", time: "02:00 PM", course: "Mathematics Form 2", lesson: "Practice Session", students: 28 },
  ];

  return (
    <Card className="overflow-hidden border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Teaching Today</p>
              <h2 className="mt-1 text-2xl font-bold">3 Sessions Scheduled</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20">
                View Calendar
              </Button>
              <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                Start First Class
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-[var(--gray-200)] bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary)]">
                <Clock3 className="h-4 w-4" />
                {session.time}
              </div>
              <h4 className="mt-2 font-semibold text-[var(--gray-900)]">{session.lesson}</h4>
              <p className="mt-0.5 text-sm text-[var(--gray-500)]">{session.course}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-[var(--gray-500)]">
                  <Users className="h-3.5 w-3.5" />
                  {session.students} students
                </div>
                <Button size="sm" variant="ghost">
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherStatsGrid() {
  const stats = [
    { icon: BookOpen, label: "My Courses", value: 4, color: "bg-blue-500" },
    { icon: Calendar, label: "This Week Sessions", value: 12, color: "bg-green-500" },
    { icon: Users, label: "My Students", value: 156, color: "bg-purple-500" },
    { icon: CheckCircle2, label: "Completed Lessons", value: 89, color: "bg-emerald-500" },
    { icon: Target, label: "Avg Quiz Score", value: "78%", color: "bg-amber-500" },
    { icon: TrendingUp, label: "Student Progress", value: "65%", color: "bg-teal-500" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-[var(--gray-200)] transition hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gray-400)]">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-bold text-[var(--gray-900)]">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MyCoursesSection() {
  const courses = [
    { id: "1", title: "Mathematics Form 2", subject: "Mathematics", level: "Form 2", students: 45, progress: 68, nextSession: "09:00 AM" },
    { id: "2", title: "Physics Form 3", subject: "Physics", level: "Form 3", students: 38, progress: 52, nextSession: "11:30 AM" },
    { id: "3", title: "KCSE Math Revision", subject: "Mathematics", level: "KCSE", students: 62, progress: 34, nextSession: "Tomorrow" },
  ];

  return (
    <Card className="border-[var(--gray-200)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">My Courses</CardTitle>
        <Link to="/teacher/courses" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-[var(--gray-200)] bg-white p-4 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-[var(--gray-900)]">{course.title}</h3>
                <p className="mt-1 text-sm text-[var(--gray-500)]">
                  {course.subject} · {course.level}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {course.students} students
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--gray-500)]">Class Progress</span>
                <span className="font-semibold text-[var(--gray-900)]">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="mt-2 h-2" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-[var(--gray-500)]">
                <Clock3 className="h-3.5 w-3.5" />
                Next: {course.nextSession}
              </div>
              <div className="flex gap-2">
                <Link to="/teacher/courses/$courseId" params={{ courseId: course.id }}>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  Start Session
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LessonPreparationSection() {
  const lessons = [
    { id: "1", title: "Introduction to Calculus", course: "Mathematics Form 2", status: "draft", progress: 60 },
    { id: "2", title: "Energy Conservation", course: "Physics Form 3", status: "draft", progress: 30 },
    { id: "3", title: "Practice: Quadratics", course: "KCSE Math Revision", status: "ready", progress: 100 },
  ];

  return (
    <Card className="border-[var(--gray-200)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Lesson Preparation</CardTitle>
        <Link to="/teacher/lessons" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center gap-4 rounded-xl border border-[var(--gray-200)] bg-white p-4 transition hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate font-semibold text-[var(--gray-900)]">{lesson.title}</h4>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${lesson.status === "ready" ? "border-green-300 text-green-600" : ""}`}
                >
                  {lesson.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-[var(--gray-500)]">{lesson.course}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/teacher/lessons/$lessonId/edit" params={{ lessonId: lesson.id }}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                Preview
              </Button>
              {lesson.status === "ready" && (
                <Button size="sm">
                  Publish
                </Button>
              )}
            </div>
          </div>
        ))}

        <Link to="/teacher/lessons">
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Create New Lesson
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function UpcomingSessionsSection() {
  const sessions = [
    { id: "1", lesson: "Quadratic Equations", course: "Math Form 2", date: "Today", time: "09:00 AM", type: "AI assisted" },
    { id: "2", lesson: "Chemical Reactions", course: "Chemistry", date: "Today", time: "02:00 PM", type: "Live session" },
    { id: "3", lesson: "Practice: Newton's Laws", course: "Physics Form 3", date: "Tomorrow", time: "10:00 AM", type: "AI assisted" },
  ];

  return (
    <Card className="border-[var(--gray-200)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <CardTitle className="text-base">Upcoming Sessions</CardTitle>
        <Link to="/teacher/sessions" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-xl border border-[var(--gray-200)] bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                <Video className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--gray-900)]">{session.lesson}</p>
                <p className="text-xs text-[var(--gray-500)]">{session.course}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[var(--gray-500)]">{session.date} · {session.time}</span>
              <Badge variant="outline" className="text-[10px]">{session.type}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StudentAlertsSection() {
  const alerts = [
    { id: "1", type: "struggling", student: "John Kamau", course: "Math Form 2", issue: "Low quiz scores (45%)", action: "Review session needed" },
    { id: "2", type: "missing", student: "Mary Wanjiku", course: "Physics Form 3", issue: "Missed 2 sessions", action: "Follow-up recommended" },
    { id: "3", type: "improving", student: "Peter Ochieng", course: "KCSE Math", issue: "Score improved by 20%", action: "Great progress!" },
  ];

  return (
    <Card className="border-[var(--gray-200)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <CardTitle className="text-base">Student Alerts</CardTitle>
        <Link to="/teacher/students" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border p-3 ${alert.type === "struggling" ? "border-red-200 bg-red-50" : alert.type === "missing" ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${alert.type === "struggling" ? "bg-red-100 text-red-600" : alert.type === "missing" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                {alert.type === "struggling" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : alert.type === "missing" ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--gray-900)]">{alert.student}</p>
                <p className="text-xs text-[var(--gray-600)]">{alert.course}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{alert.issue}</Badge>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--gray-500)]">Action: {alert.action}</p>
          </div>
        ))}

        <Link to="/teacher/analytics">
          <Button variant="outline" size="sm" className="w-full">
            <BarChart3 className="mr-1.5 h-4 w-4" />
            View Full Analytics
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
