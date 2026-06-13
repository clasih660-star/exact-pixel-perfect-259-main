import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  MessageSquare,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { requireTeacher } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/teacher/analytics")({
  beforeLoad: (ctx) => requireTeacher(ctx.context),
  component: TeacherAnalytics,
});

const config = dashboardConfigs.teacher;

const quizScoreTrend = [
  { week: "Wk 1", Math: 72, Chemistry: 68, CS: 79 },
  { week: "Wk 2", Math: 76, Chemistry: 71, CS: 82 },
  { week: "Wk 3", Math: 80, Chemistry: 74, CS: 85 },
  { week: "Wk 4", Math: 78, Chemistry: 77, CS: 88 },
  { week: "Wk 5", Math: 84, Chemistry: 80, CS: 91 },
  { week: "Wk 6", Math: 87, Chemistry: 83, CS: 93 },
];

const completionData = [
  { course: "Math F2", completed: 65, incomplete: 35 },
  { course: "Chemistry", completed: 42, incomplete: 58 },
  { course: "CS Basics", completed: 78, incomplete: 22 },
];

const engagementData = [
  { name: "Questions Asked", value: 87, color: "#1F7C80" },
  { name: "Notes Created", value: 243, color: "#22C55E" },
  { name: "Replays Watched", value: 56, color: "#A855F7" },
  { name: "Quizzes Taken", value: 312, color: "#F59E0B" },
];

const topPerformers = [
  { name: "Daniel Mwangi", course: "CS Basics", score: 95, trend: "+3" },
  { name: "Amara Diallo", course: "Math F2", score: 91, trend: "+5" },
  { name: "Halima Mussa", course: "CS Basics", score: 82, trend: "+2" },
  { name: "Fatima Bello", course: "Chemistry", score: 78, trend: "+4" },
];

const COLORS = ["#1F7C80", "#22C55E", "#A855F7", "#F59E0B"];

function TeacherAnalytics() {
  return (
    <DashboardShell config={config} activePath="/teacher/analytics">
      <PageHeader
        label="Performance insights"
        title="Teaching Analytics"
        subtitle="Track quiz scores, completion rates, and student engagement across all your courses."
      />

      {/* KPI Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Avg Quiz Score", value: "81%", change: "+3% this month", icon: Star, color: "text-[#1F7C80]" },
          { label: "Completion Rate", value: "62%", change: "+8% this month", icon: CheckCircle2, color: "text-green-600" },
          { label: "Active Learners", value: "87", change: "+12 this week", icon: Users, color: "text-purple-600" },
          { label: "Questions Answered", value: "87", change: "Last 30 days", icon: MessageSquare, color: "text-amber-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#64748B]">{kpi.label}</p>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <p className={`mt-2 text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" /> {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quiz Score Trend */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-[#1F7C80]" />
            <h3 className="font-bold text-[#0F172A]">Quiz Score Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={quizScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="Math" stroke="#1F7C80" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Chemistry" stroke="#22C55E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="CS" stroke="#A855F7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-4 text-xs">
            {[{ label: "Math F2", color: "#1F7C80" }, { label: "Chemistry", color: "#22C55E" }, { label: "CS Basics", color: "#A855F7" }].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[#64748B]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Lesson Completion */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="font-bold text-[#0F172A]">Lesson Completion by Course</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={completionData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="course" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="completed" name="Completed" fill="#1F7C80" radius={[6, 6, 0, 0]} />
              <Bar dataKey="incomplete" name="In Progress" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement + Top Performers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement Breakdown */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
          <h3 className="mb-4 font-bold text-[#0F172A]">Engagement Breakdown</h3>
          <div className="flex items-center gap-6">
            <PieChart width={140} height={140}>
              <Pie
                data={engagementData}
                cx={65}
                cy={65}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-3">
              {engagementData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-[#64748B]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[idx] }} />
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-[#0F172A]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
          <h3 className="mb-4 font-bold text-[#0F172A]">Top Performers This Month</h3>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1F7C80] to-[#3fa8ab] text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">{p.name}</p>
                  <p className="text-xs text-[#94A3B8]">{p.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0F172A]">{p.score}%</p>
                  <p className="text-xs font-semibold text-green-600">{p.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
