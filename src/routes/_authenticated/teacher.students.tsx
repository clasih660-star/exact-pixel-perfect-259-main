import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import {
  Users,
  Search,
  BookOpen,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher/students")({
  component: TeacherStudents,
});

type StudentStatus = "on-track" | "at-risk" | "needs-help" | "excelling";

type Student = {
  id: string;
  name: string;
  avatar: string;
  course: string;
  progress: number;
  lastActive: string;
  quizAvg: number;
  status: StudentStatus;
  streak: number;
  questionsAsked: number;
};

const STUDENTS: Student[] = [
  {
    id: "s1", name: "Amara Diallo", avatar: "AD",
    course: "Mathematics Form 2",
    progress: 78, lastActive: "2 hours ago", quizAvg: 91, status: "excelling", streak: 12, questionsAsked: 8,
  },
  {
    id: "s2", name: "Brian Omondi", avatar: "BO",
    course: "Mathematics Form 2",
    progress: 52, lastActive: "Today", quizAvg: 73, status: "on-track", streak: 5, questionsAsked: 3,
  },
  {
    id: "s3", name: "Chidinma Eze", avatar: "CE",
    course: "KCSE Chemistry Revision",
    progress: 35, lastActive: "3 days ago", quizAvg: 58, status: "at-risk", streak: 0, questionsAsked: 1,
  },
  {
    id: "s4", name: "Daniel Mwangi", avatar: "DM",
    course: "Computer Studies Basics",
    progress: 90, lastActive: "1 hour ago", quizAvg: 95, status: "excelling", streak: 18, questionsAsked: 12,
  },
  {
    id: "s5", name: "Fatima Bello", avatar: "FB",
    course: "KCSE Chemistry Revision",
    progress: 42, lastActive: "Yesterday", quizAvg: 65, status: "on-track", streak: 3, questionsAsked: 5,
  },
  {
    id: "s6", name: "George Kamau", avatar: "GK",
    course: "Mathematics Form 2",
    progress: 18, lastActive: "5 days ago", quizAvg: 44, status: "needs-help", streak: 0, questionsAsked: 0,
  },
  {
    id: "s7", name: "Halima Mussa", avatar: "HM",
    course: "Computer Studies Basics",
    progress: 65, lastActive: "Today", quizAvg: 82, status: "on-track", streak: 7, questionsAsked: 6,
  },
  {
    id: "s8", name: "Ibrahim Juma", avatar: "IJ",
    course: "KCSE Chemistry Revision",
    progress: 28, lastActive: "2 days ago", quizAvg: 51, status: "at-risk", streak: 1, questionsAsked: 2,
  },
];

const STATUS_META: Record<StudentStatus, { label: string; variant: "success" | "warning" | "info" | "neutral" | "error"; icon: typeof CheckCircle2; color: string }> = {
  excelling: { label: "Excelling", variant: "success", icon: TrendingUp, color: "text-green-600" },
  "on-track": { label: "On Track", variant: "info", icon: CheckCircle2, color: "text-blue-600" },
  "at-risk": { label: "At Risk", variant: "warning", icon: TrendingDown, color: "text-amber-600" },
  "needs-help": { label: "Needs Help", variant: "error", icon: AlertTriangle, color: "text-red-600" },
};

const AVATAR_COLORS = [
  "from-blue-600 to-blue-400",
  "from-green-600 to-emerald-400",
  "from-purple-600 to-violet-400",
  "from-rose-600 to-pink-400",
  "from-amber-600 to-yellow-400",
  "from-cyan-600 to-sky-400",
  "from-teal-600 to-teal-400",
  "from-indigo-600 to-indigo-400",
];

const config = dashboardConfigs.teacher;

function TeacherStudents() {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("all");

  const courses = Array.from(new Set(STUDENTS.map((s) => s.course)));

  const filtered = STUDENTS.filter((s) => {
    const q = query.toLowerCase();
    const matchQ = s.name.toLowerCase().includes(q) || s.course.toLowerCase().includes(q);
    const matchCourse = courseFilter === "all" || s.course === courseFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchQ && matchCourse && matchStatus;
  });

  const needsHelp = STUDENTS.filter((s) => s.status === "needs-help" || s.status === "at-risk").length;

  return (
    <DashboardShell config={config} activePath="/teacher/students">
      <PageHeader
        label="Student management"
        title="My Students"
        subtitle="Monitor learner progress, identify at-risk students, and engage with questions across all your courses."
      />

      {/* Alert for at-risk */}
      {needsHelp > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-semibold text-amber-800">
            {needsHelp} student{needsHelp > 1 ? "s" : ""} may need your attention — low progress or inactive for 3+ days.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { label: "Total Students", value: STUDENTS.length, icon: Users, color: "text-[#0F172A]" },
          { label: "Excelling", value: STUDENTS.filter((s) => s.status === "excelling").length, icon: TrendingUp, color: "text-green-600" },
          { label: "At Risk", value: STUDENTS.filter((s) => s.status === "at-risk").length, icon: TrendingDown, color: "text-amber-600" },
          { label: "Need Help", value: STUDENTS.filter((s) => s.status === "needs-help").length, icon: AlertTriangle, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center">
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-[#64748B]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students…"
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StudentStatus | "all")}
          className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="excelling">Excelling</option>
          <option value="on-track">On Track</option>
          <option value="at-risk">At Risk</option>
          <option value="needs-help">Needs Help</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-[#CBD5E1]" />
            <p className="mt-3 font-semibold text-[#64748B]">No students match your filters</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">Student</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">Course</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">Progress</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">Quiz Avg</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">Last Active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((student, idx) => {
                const sm = STATUS_META[student.status];
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={student.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-xs font-bold text-white`}>
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0F172A]">{student.name}</p>
                          <p className="text-xs text-[#94A3B8]">🔥 {student.streak} day streak · {student.questionsAsked} questions</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-[#64748B]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span className="text-xs">{student.course}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-[#E2E8F0]">
                          <div
                            className="h-full rounded-full bg-[#2563EB] transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#64748B]">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${student.quizAvg >= 80 ? "text-green-600" : student.quizAvg >= 60 ? "text-amber-600" : "text-red-600"}`}>
                        {student.quizAvg}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge variant={sm.variant}>{sm.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                        <Clock className="h-3 w-3" /> {student.lastActive}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]">
                        <MessageSquare className="h-3 w-3" /> Message
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
