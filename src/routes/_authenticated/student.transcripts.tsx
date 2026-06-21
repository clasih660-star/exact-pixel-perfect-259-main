import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StudentShell } from "@/components/student/StudentShell";
import { ScrollText, Clock, Trophy, CheckCircle2, Video } from "lucide-react";
import { requireStudent } from "@/lib/route-guards";
import { getStudentTranscript } from "@/lib/student.functions";

export const Route = createFileRoute("/_authenticated/student/transcripts")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentTranscripts,
});

function StatCard({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string | number }) {
  return (
    <div className="kr-pcard flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f5f5] text-[#1F7C80]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-[var(--gray-900)]">{value}</div>
        <div className="text-xs text-[var(--gray-500)]">{label}</div>
      </div>
    </div>
  );
}

function StudentTranscripts() {
  const fn = useServerFn(getStudentTranscript);
  const q = useQuery({ queryKey: ["student-transcript"], queryFn: () => fn() });
  const t = q.data;

  const studyHours = t ? Math.round((t.totalStudyMinutes / 60) * 10) / 10 : 0;

  return (
    <StudentShell title="Transcripts">
      {q.isLoading ? (
        <p className="text-sm text-[var(--gray-500)]">Loading transcript…</p>
      ) : !t ? (
        <p className="text-sm text-[var(--gray-500)]">No transcript data yet.</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Video} label="Sessions" value={t.totalSessions} />
            <StatCard icon={CheckCircle2} label="Lessons completed" value={t.lessonsCompleted} />
            <StatCard icon={Trophy} label="Avg quiz score" value={`${t.avgQuiz}%`} />
            <StatCard icon={Clock} label="Study hours" value={studyHours} />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--gray-400)]">
              By course
            </h2>
            {t.byCourse.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--gray-200)] bg-white p-10 text-center">
                <ScrollText className="mx-auto mb-2 h-8 w-8 text-[var(--gray-400)]" />
                <p className="text-sm text-[var(--gray-500)]">
                  No course activity recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {t.byCourse.map((c: any, i: number) => (
                  <div key={i} className="kr-pcard p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--gray-900)]">{c.courseTitle}</h3>
                      <span className="text-xs font-semibold text-[var(--gray-500)]">
                        {c.lessonsCompleted} lessons · {c.avgProgress}% avg
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--gray-100)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1F7C80] to-[#1A5256]"
                        style={{ width: `${c.avgProgress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </StudentShell>
  );
}
