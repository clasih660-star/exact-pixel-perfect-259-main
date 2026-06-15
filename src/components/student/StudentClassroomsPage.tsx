import { Link } from "@tanstack/react-router";
import {
  Accessibility,
  BookOpen,
  ChevronRight,
  Clock,
  Compass,
  Eye,
  Flame,
  Headphones,
  Monitor,
  Notebook,
  PlayCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { dashboardConfigs } from "@/lib/dashboard-config";

const config = dashboardConfigs.learner;

const highlightedClassroom = {
  title: "Solving Quadratic Equations by Factoring",
  subject: "Mathematics Form 2",
  institution: "Klassruum Demo Academy",
  progress: 42,
  currentStep: "Worked Example",
  durationLeft: "18 min left",
  lessonId: "demo",
};

const classroomGroups = [
  {
    title: "Continue now",
    subtitle: "Classrooms already in progress and ready to resume.",
    items: [
      {
        name: "Mathematics Form 2",
        topic: "Quadratic Equations",
        institution: "Klassruum Demo Academy",
        progress: 42,
        nextAction: "Continue worked example",
        timeEstimate: "18 min left",
        lastOpened: "Opened 12 min ago",
        support: "Captions on · Voice ready",
        href: "/classroom/demo",
        tone: "primary" as const,
      },
      {
        name: "Science Form 3",
        topic: "Chemical Bonding",
        institution: "Klassruum Demo Academy",
        progress: 28,
        nextAction: "Resume concept explanation",
        timeEstimate: "24 min left",
        lastOpened: "Opened yesterday",
        support: "Focus mode available",
        href: "/classroom/demo_chemistry",
        tone: "neutral" as const,
      },
    ],
  },
  {
    title: "Ready next",
    subtitle: "Suggested classrooms based on your learning plan.",
    items: [
      {
        name: "English Form 2",
        topic: "Parts of Speech",
        institution: "Klassruum Demo Academy",
        progress: 65,
        nextAction: "Review summary and quick quiz",
        timeEstimate: "12 min review",
        lastOpened: "Practised 2 days ago",
        support: "Revision ready",
        href: "/classroom/demo_english",
        tone: "success" as const,
      },
      {
        name: "Computer Studies Basics",
        topic: "HTML Introduction",
        institution: "Klassruum Demo Academy",
        progress: 14,
        nextAction: "Start guided lesson",
        timeEstimate: "30 min lesson",
        lastOpened: "New for today",
        support: "Beginner friendly",
        href: "/classroom/demo",
        tone: "warning" as const,
      },
    ],
  },
];

const quickSupports = [
  { label: "Captions", value: "On", icon: Eye },
  { label: "Teacher voice", value: "On", icon: Headphones },
  { label: "Focus mode", value: "Available", icon: Target },
  { label: "Accessibility", value: "Ready", icon: Accessibility },
];

const todayPlan = [
  {
    label: "Continue factoring lesson",
    meta: "Current classroom · 18 min left",
    state: "Active now",
  },
  {
    label: "Review notes before quiz",
    meta: "Mathematics Form 2",
    state: "After class",
  },
  {
    label: "Start English revision",
    meta: "Recommended next classroom",
    state: "Later today",
  },
];

const recentActivity = [
  {
    title: "Chemical Reactions",
    meta: "38 min session · Yesterday",
    status: "Completed",
  },
  {
    title: "HTML Introduction",
    meta: "41 min session · 3 days ago",
    status: "Reviewed",
  },
];

const learningSignals = [
  {
    label: "Best next move",
    value: "Finish factoring today",
    meta: "Completing this lesson keeps your 7-day streak active.",
    icon: Target,
  },
  {
    label: "Recommended after that",
    value: "English revision",
    meta: "Short review session ready once maths is complete.",
    icon: Compass,
  },
];

const quietTools = [
  "Captions are on for active lessons",
  "Teacher voice is ready when needed",
  "Focus mode is available for distraction-free study",
];

function getProgressTone(progress: number) {
  if (progress >= 60) return "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]";
  if (progress >= 30) return "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]";
  return "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
}

function getSubjectMark(name: string) {
  if (name.includes("Mathematics")) return "x²";
  if (name.includes("Science")) return "Lab";
  if (name.includes("English")) return "Eng";
  return "ICT";
}

export function StudentClassroomsPage() {
  return (
    <DashboardShell
      config={config}
      activePath="/student/classrooms"
      title="My Classrooms"
      subtitle="A cleaner classroom hub to resume lessons, track progress, and enter the right session faster."
    >
      <section className="mb-6 grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
        <div className="rounded-[28px] border border-[#E7EEF5] bg-[#FFFEFC] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6EEF5] bg-[#F8FBFD] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5C7285]">
            <Sparkles className="h-3.5 w-3.5 text-[#7A8FA3]" />
            Today&apos;s lesson
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#132033] sm:text-[2rem]">
                Continue learning in a calm, focused classroom space.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#61758A] sm:text-base">
                Pick up exactly where you stopped, keep your progress moving, and keep the screen
                simple enough for every learner from early grades to university level.
              </p>

              <div className="mt-6 rounded-[24px] border border-[#E7EEF5] bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7A8FA3]">
                      Current classroom
                    </p>
                    <h1 className="mt-2 text-xl font-extrabold tracking-tight text-[#132033] sm:text-2xl">
                      {highlightedClassroom.title}
                    </h1>
                    <p className="mt-2 text-sm text-[#61758A]">
                      {highlightedClassroom.subject} · {highlightedClassroom.institution}
                    </p>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F4F8FB] text-sm font-black text-[#31516E] ring-1 ring-[#E3EBF3]">
                    x²
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#FAFCFE] p-3 ring-1 ring-[#EDF3F8]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8FA3]">
                      Current step
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#132033]">
                      {highlightedClassroom.currentStep}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAFCFE] p-3 ring-1 ring-[#EDF3F8]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8FA3]">
                      Progress
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#132033]">
                      {highlightedClassroom.progress}% complete
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAFCFE] p-3 ring-1 ring-[#EDF3F8]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8FA3]">
                      Time left
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#132033]">
                      {highlightedClassroom.durationLeft}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#41556A]">Lesson progress</p>
                    <p className="text-sm font-bold text-[#23415D]">
                      {highlightedClassroom.progress}%
                    </p>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EAF0F5]">
                    <div
                      className="h-full rounded-full bg-[#86A9C9]"
                      style={{ width: `${highlightedClassroom.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/classroom/$lessonId"
                    params={{ lessonId: highlightedClassroom.lessonId }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1D3E5C] px-5 text-sm font-bold text-white transition-all hover:bg-[#17324A]"
                  >
                    Continue learning
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/student/notes"
                    className="text-sm font-semibold text-[#365978] transition-colors hover:text-[#1D3E5C]"
                  >
                    View notes
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#6D8093]">
                  <span className="rounded-full bg-[#F6FAFC] px-3 py-1 ring-1 ring-[#E8EEF4]">
                    Captions on
                  </span>
                  <span className="rounded-full bg-[#F6FAFC] px-3 py-1 ring-1 ring-[#E8EEF4]">
                    Voice ready
                  </span>
                  <span className="rounded-full bg-[#F6FAFC] px-3 py-1 ring-1 ring-[#E8EEF4]">
                    Focus mode available
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[300px] rounded-[24px] border border-[#EBF1F6] bg-[#FCFDFC] p-5">
              <div className="flex items-center gap-2 text-[#365978]">
                <Compass className="h-4 w-4" />
                <p className="text-sm font-bold">Up next</p>
              </div>
              <div className="mt-4 space-y-3">
                {todayPlan.map((item, index) => (
                  <div key={item.label} className="rounded-2xl bg-white p-3 ring-1 ring-[#EDF2F7]">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2F6FA] text-[11px] font-bold text-[#365978]">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#132033]">{item.label}</p>
                        <p className="mt-1 text-xs leading-5 text-[#66798C]">{item.meta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[24px] border border-[#E7EEF5] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#365978]">
              <Target className="h-4 w-4" />
              <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Learning guidance</h2>
            </div>

            <div className="mt-4 space-y-3">
              {learningSignals.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-[#FBFCFE] p-4 ring-1 ring-[#EEF3F7]"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7A8FA3]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-extrabold text-[#132033]">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-[#66798C]">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E7EEF5] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#365978]">
              <Zap className="h-4 w-4" />
              <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Learning tools</h2>
            </div>
            <div className="mt-4 space-y-3">
              {quietTools.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#FBFCFE] px-4 py-3 text-sm text-[#54677A] ring-1 ring-[#EEF3F7]"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/student/access"
              className="mt-4 inline-flex text-sm font-semibold text-[#365978] transition-colors hover:text-[#1D3E5C]"
            >
              Review learning access
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          title="Active classrooms"
          value="4"
          subtitle="Sessions available now"
          href="/student/classrooms"
          icon={Monitor}
        />
        <KpiCard
          title="Continue today"
          value="2"
          subtitle="Already in progress"
          href="/student/lessons"
          icon={PlayCircle}
        />
        <KpiCard
          title="Study streak"
          value="7 days"
          subtitle="Keep the momentum"
          href="/student/progress"
          icon={Flame}
          trend="+2 days"
        />
        <KpiCard
          title="Access support"
          value="Ready"
          subtitle="Captions and focus tools"
          href="/student/access"
          icon={Accessibility}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_.9fr]">
        <div className="space-y-5">
          {classroomGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-[24px] border border-[#E7EEF5] bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#132033]">{group.title}</h2>
                  <p className="text-sm text-[#66798C]">{group.subtitle}</p>
                </div>
                <Link
                  to="/student/courses"
                  className="text-sm font-semibold text-[#365978] hover:text-[#1D3E5C]"
                >
                  Browse courses
                </Link>
              </div>

              <div className="space-y-3">
                {group.items.map((classroom) => (
                  <Link
                    key={classroom.name + classroom.topic}
                    to={classroom.href}
                    className="grid gap-4 rounded-[22px] border border-[#E8EEF4] bg-[#FFFEFD] p-4 transition-all hover:-translate-y-0.5 hover:border-[#D5E2EE] hover:bg-white md:grid-cols-[56px_1fr] md:items-center"
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F3F7FA] text-sm font-black text-[#31516E] ring-1 ring-[#E3EBF3]">
                      {getSubjectMark(classroom.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#132033] sm:text-base">
                          {classroom.name}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${getProgressTone(classroom.progress)}`}
                        >
                          {classroom.progress}% complete
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#66798C]">
                        {classroom.institution} · {classroom.topic}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#708294]">
                        <span className="rounded-full bg-[#F7FAFC] px-2.5 py-1 ring-1 ring-[#E8EEF4]">
                          {classroom.timeEstimate}
                        </span>
                        <span className="rounded-full bg-[#F7FAFC] px-2.5 py-1 ring-1 ring-[#E8EEF4]">
                          {classroom.lastOpened}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3">
                        <div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#EAF0F5]">
                            <div
                              className="h-full rounded-full bg-[#86A9C9]"
                              style={{ width: `${classroom.progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#708294]">
                            <span className="rounded-full bg-[#F7FAFC] px-2.5 py-1 ring-1 ring-[#E8EEF4]">
                              {group.title === "Continue now" ? "In progress" : "Recommended"}
                            </span>
                            <span className="rounded-full bg-[#F7FAFC] px-2.5 py-1 ring-1 ring-[#E8EEF4]">
                              {classroom.support}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <p className="text-xs font-bold text-[#365978]">{classroom.nextAction}</p>
                          <span className="text-sm font-semibold text-[#1D3E5C]">
                            {group.title === "Continue now"
                              ? "Open lesson"
                              : classroom.progress > 0
                                ? "Resume"
                                : "Start"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="rounded-[24px] border border-[#E7EEF5] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F4F8FB] text-[#365978]">
                <Notebook className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#132033]">Recent work</h2>
                <p className="text-sm text-[#66798C]">
                  A light history of what you have completed or reviewed.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl bg-[#FBFCFE] p-3 ring-1 ring-[#EEF3F7]"
                >
                  <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-[#F4F8FB] text-[#365978]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-[#132033]">{item.title}</p>
                      <StatusBadge variant={item.status === "Completed" ? "success" : "neutral"}>
                        {item.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#66798C]">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/student/sessions"
              className="mt-4 inline-flex text-sm font-semibold text-[#365978] transition-colors hover:text-[#1D3E5C]"
            >
              View session history
            </Link>
          </div>

          <div className="rounded-[24px] border border-[#E7EEF5] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#132033]">Simple routine</h2>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Resume lesson", meta: "Right where you stopped", icon: PlayCircle },
                { label: "Review notes", meta: "Before re-entering", icon: Clock },
                { label: "Enable support", meta: "Captions, focus, voice", icon: Accessibility },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-[#EEF3F7] bg-[#FBFCFE] p-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F4F8FB] text-[#365978]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#132033]">{item.label}</p>
                    <p className="text-xs text-[#66798C]">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
