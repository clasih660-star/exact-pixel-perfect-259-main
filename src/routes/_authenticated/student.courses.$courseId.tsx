import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { StudentShell } from "@/components/student/StudentShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCourseForStudent } from "@/lib/student.functions";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/courses/$courseId")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentCoursePage,
});

function StudentCoursePage() {
  const { courseId } = Route.useParams();
  const fn = useServerFn(getCourseForStudent);
  const q = useQuery({
    queryKey: ["student-course", courseId],
    queryFn: () => fn({ data: { course_id: courseId } }),
  });

  if (q.isLoading)
    return (
      <StudentShell title="Course">
        <p className="text-muted-foreground">Loading…</p>
      </StudentShell>
    );
  if (!q.data?.course)
    return (
      <StudentShell title="Course">
        <p className="text-muted-foreground">Course not found.</p>
      </StudentShell>
    );

  const { course, lessons } = q.data;
  return (
    <StudentShell title={course.title}>
      <p className="mb-6 text-sm text-muted-foreground">{course.description}</p>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Lessons
      </h2>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">No lessons published yet.</p>
      ) : (
        <div className="space-y-2">
          {lessons.map((l) => {
            const status = l.progress?.status ?? "not_started";
            const Icon =
              status === "completed"
                ? CheckCircle2
                : status === "in_progress"
                  ? PlayCircle
                  : Circle;
            return (
              <Link key={l.id} to="/student/lessons/$lessonId" params={{ lessonId: l.id }}>
                <Card className="transition hover:border-primary/40">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{l.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.duration_minutes ?? "?"} min
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {status.replace("_", " ")}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      <div className="mt-6">
        <Link to="/student/courses">
          <Button variant="ghost" size="sm">
            Back to courses
          </Button>
        </Link>
      </div>
    </StudentShell>
  );
}
