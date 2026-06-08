import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { StudentShell } from "@/components/student/StudentShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLesson } from "@/lib/lessons.functions";
import { startSession } from "@/lib/sessions.functions";

export const Route = createFileRoute("/_authenticated/student/lessons/$lessonId")({
  component: StudentLessonPage,
});

function StudentLessonPage() {
  const { lessonId } = Route.useParams();
  const router = useRouter();
  const fn = useServerFn(getLesson);
  const q = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => fn({ data: { lesson_id: lessonId } }),
  });

  const startFn = useServerFn(startSession);
  const start = useMutation({
    mutationFn: () => startFn({ data: { lesson_id: lessonId } }),
    onSuccess: (res) =>
      router.navigate({
        to: "/classroom/session/$sessionId",
        params: { sessionId: res.session.id },
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading)
    return (
      <StudentShell title="Lesson">
        <p className="text-muted-foreground">Loading…</p>
      </StudentShell>
    );
  const lesson = q.data?.lesson;
  if (!lesson)
    return (
      <StudentShell title="Lesson">
        <p className="text-muted-foreground">Lesson not found.</p>
      </StudentShell>
    );

  return (
    <StudentShell title={lesson.title}>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {lesson.status}
            </Badge>
            {lesson.difficulty && (
              <Badge variant="outline" className="capitalize">
                {lesson.difficulty}
              </Badge>
            )}
            {lesson.duration_minutes && (
              <Badge variant="outline">{lesson.duration_minutes} min</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {lesson.description || "No description for this lesson yet."}
          </p>
          <Button size="lg" onClick={() => start.mutate()} disabled={start.isPending}>
            <Play className="h-4 w-4" />
            {start.isPending ? "Starting…" : "Start lesson"}
          </Button>
        </CardContent>
      </Card>
    </StudentShell>
  );
}
