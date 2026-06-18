import { useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  Clock3,
  MessageSquare,
  Mic,
  MonitorUp,
  PlayCircle,
  Radio,
  Send,
  Square,
  Users,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";

type TeacherLiveClassroomPageProps = {
  sessionId: string;
  classroomContext: any;
  onEndSession: () => Promise<void> | void;
  onBroadcast: (message: string) => Promise<void> | void;
};

type RosterState = "ready" | "needs_help" | "hand_raised" | "quiet";

function formatStatus(status?: string) {
  switch (status) {
    case "live":
      return { label: "Live now", variant: "info" as const };
    case "scheduled":
      return { label: "Scheduled", variant: "neutral" as const };
    case "completed":
      return { label: "Completed", variant: "success" as const };
    default:
      return { label: "Session", variant: "neutral" as const };
  }
}

function formatMode(mode?: string) {
  switch (mode) {
    case "human_teacher":
      return "Human teacher";
    case "hybrid":
      return "Hybrid live";
    case "ai_teacher":
      return "AI teacher";
    default:
      return "Live classroom";
  }
}

function buildRoster(questionCount: number): Array<{ name: string; state: RosterState; signal: string }> {
  const base = [
    { name: "Amina", state: "ready" as const, signal: "Following lesson" },
    { name: "Brian", state: questionCount > 0 ? ("hand_raised" as const) : ("ready" as const), signal: questionCount > 0 ? "Asked a question" : "Ready" },
    { name: "Chloe", state: "needs_help" as const, signal: "Needs slower pace" },
    { name: "David", state: "quiet" as const, signal: "Listening quietly" },
    { name: "Esther", state: "ready" as const, signal: "Captions enabled" },
  ];
  return base;
}

function rosterTone(state: RosterState) {
  switch (state) {
    case "ready":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "needs_help":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "hand_raised":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function TeacherLiveClassroomPage({
  sessionId,
  classroomContext,
  onEndSession,
  onBroadcast,
}: TeacherLiveClassroomPageProps) {
  const [announcement, setAnnouncement] = useState("");
  const [sending, setSending] = useState(false);

  const session = classroomContext?.session ?? {};
  const lesson = classroomContext?.lesson ?? {};
  const course = classroomContext?.course ?? {};
  const institution = classroomContext?.institution ?? {};
  const messages = Array.isArray(classroomContext?.messages) ? classroomContext.messages : [];
  const learnerQuestions = messages.filter((m: any) => m.sender === "student");
  const teacherMessages = messages.filter((m: any) => m.sender === "teacher" || m.sender === "ai_teacher");
  const sessionStatus = formatStatus(session.status);
  const roster = useMemo(() => buildRoster(learnerQuestions.length), [learnerQuestions.length]);

  const quickActions = [
    "Let’s slow down and review the last idea together.",
    "Everyone, answer in chat: what is the next step?",
    "Pause here and write the key formula in your notes.",
    "Raise your hand if you want me to repeat this example.",
  ];

  const sendMessage = async (message: string) => {
    const content = message.trim();
    if (!content) return;
    setSending(true);
    try {
      await onBroadcast(content);
      setAnnouncement("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#D9E7EE] bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge variant={sessionStatus.variant}>{sessionStatus.label}</StatusBadge>
              <span className="rounded-full border border-[#D9E7EE] bg-[#F8FBFD] px-3 py-1 text-xs font-semibold text-[#476277]">
                {formatMode(session.mode)}
              </span>
              <span className="rounded-full border border-[#D9E7EE] bg-[#F8FBFD] px-3 py-1 text-xs font-semibold text-[#476277]">
                Session #{sessionId.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#132033]">
              {lesson.title ?? "Live lesson"}
            </h1>
            <p className="mt-2 text-sm text-[#5D7285]">
              {course.title ?? "Course"} · {institution.name ?? "Institution"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <div className="rounded-2xl border border-[#E4ECF3] bg-[#FAFCFE] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                <Users className="h-3.5 w-3.5" /> Learners
              </div>
              <p className="mt-3 text-2xl font-black text-[#132033]">{roster.length}</p>
            </div>
            <div className="rounded-2xl border border-[#E4ECF3] bg-[#FAFCFE] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                <Clock3 className="h-3.5 w-3.5" /> Status
              </div>
              <p className="mt-3 text-sm font-bold text-[#132033]">
                {session.status === "scheduled" ? "Ready to start" : "Teaching in progress"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E4ECF3] bg-[#FAFCFE] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                <MessageSquare className="h-3.5 w-3.5" /> Questions
              </div>
              <p className="mt-3 text-2xl font-black text-[#132033]">{learnerQuestions.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="bg-[#1F7C80] hover:bg-[#1A5256]">
            <PlayCircle className="mr-2 h-4 w-4" /> {session.status === "live" ? "Resume live teaching" : "Open live classroom"}
          </Button>
          <Button variant="outline" className="border-[#D7E4EC] text-[#27465F]">
            <MonitorUp className="mr-2 h-4 w-4" /> Share board
          </Button>
          <Button variant="outline" className="border-[#D7E4EC] text-[#27465F]">
            <Mic className="mr-2 h-4 w-4" /> Open microphone
          </Button>
          <Button variant="destructive" onClick={() => void onEndSession()}>
            <Square className="mr-2 h-4 w-4" /> End class
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.95fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#D9E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                  Teacher stage
                </p>
                <h2 className="mt-2 text-xl font-black text-[#132033]">What the teacher sees live</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF8F7] px-3 py-1 text-xs font-semibold text-[#1F7C80]">
                <Radio className="h-3.5 w-3.5" /> Broadcasting
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
              <div className="rounded-[24px] border border-[#E6EEF5] bg-[#0F172A] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">Live delivery</p>
                    <h3 className="mt-2 text-lg font-bold">Teacher camera / voice area</h3>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
                    Human teacher
                  </div>
                </div>
                <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_top,#27465F,transparent_55%),linear-gradient(135deg,#111827,#0B1220)]">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                      <Volume2 className="h-9 w-9 text-white" />
                    </div>
                    <p className="mt-4 text-lg font-semibold">Teacher is presenting live</p>
                    <p className="mt-1 text-sm text-white/65">
                      Video, voice, and captions stream from here for learners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#E6EEF5] bg-[#FAFCFE] p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                  <BookOpen className="h-3.5 w-3.5" /> Teaching notes
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#132033]">Lesson control panel</h3>
                <ul className="mt-4 space-y-3 text-sm text-[#52687C]">
                  <li className="rounded-2xl border border-[#E6EEF5] bg-white p-3">Current topic: {lesson.title ?? "Live lesson"}</li>
                  <li className="rounded-2xl border border-[#E6EEF5] bg-white p-3">Teacher can move between explanation, demonstration, and questions.</li>
                  <li className="rounded-2xl border border-[#E6EEF5] bg-white p-3">Teacher sees alerts when learners need support or raise hands.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#E6EEF5] bg-[#FBFDFC] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                    Shared board
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-[#132033]">Teacher board and lesson flow</h3>
                </div>
                <span className="rounded-full border border-[#DDE8EF] bg-white px-3 py-1 text-xs font-semibold text-[#537086]">
                  Learners see this in sync
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  "Reveal next example",
                  "Highlight key formula",
                  "Open quick check",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#E2EBF2] bg-white p-4 text-sm font-semibold text-[#27465F]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#D9E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                  Quick teacher actions
                </p>
                <h2 className="mt-2 text-xl font-black text-[#132033]">What the teacher can trigger instantly</h2>
              </div>
              <WandSparkles className="h-5 w-5 text-[#1F7C80]" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => void sendMessage(action)}
                  className="rounded-2xl border border-[#DDE8EF] bg-[#FAFCFE] p-4 text-left text-sm font-semibold text-[#244059] transition hover:border-[#1F7C80]/35 hover:bg-[#F4FBFA]"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#D9E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                  Learner roster
                </p>
                <h2 className="mt-2 text-xl font-black text-[#132033]">Who the teacher sees</h2>
              </div>
              <Users className="h-5 w-5 text-[#1F7C80]" />
            </div>
            <div className="mt-5 space-y-3">
              {roster.map((learner) => (
                <div key={learner.name} className="flex items-center justify-between rounded-2xl border border-[#E4ECF3] bg-[#FAFCFE] p-3">
                  <div>
                    <p className="font-semibold text-[#132033]">{learner.name}</p>
                    <p className="text-xs text-[#61758A]">{learner.signal}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${rosterTone(learner.state)}`}>
                    {learner.state.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#D9E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                  Live questions
                </p>
                <h2 className="mt-2 text-xl font-black text-[#132033]">Question and signal queue</h2>
              </div>
              <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
            </div>

            <div className="mt-5 space-y-3">
              {learnerQuestions.length > 0 ? (
                learnerQuestions.slice(-4).reverse().map((message: any) => (
                  <div key={message.id} className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                      Learner question
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#233B52]">{message.message}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D9E7EE] bg-[#FBFDFC] p-5 text-sm text-[#63788D]">
                  No live learner questions yet. When learners ask in chat or raise a hand, the teacher
                  sees them here.
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-[#E6EEF5] bg-[#FBFDFC] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
                Broadcast to class
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Type a live announcement for learners"
                  className="h-11 flex-1 rounded-xl border border-[#D9E7EE] bg-white px-4 text-sm outline-none transition focus:border-[#1F7C80]"
                />
                <Button
                  onClick={() => void sendMessage(announcement)}
                  disabled={sending || !announcement.trim()}
                  className="h-11 bg-[#1F7C80] hover:bg-[#1A5256]"
                >
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#D9E7EE] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7B8EA2]">
              <BadgeCheck className="h-4 w-4 text-[#1F7C80]" /> Teacher support snapshot
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[#53697D]">
              <li className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] p-3">
                Captions and transcript can run live alongside the teacher.
              </li>
              <li className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] p-3">
                AI assistant can later insert confusion alerts, polls, and summary prompts.
              </li>
              <li className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] p-3">
                Latest teacher-side message count: {teacherMessages.length}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}