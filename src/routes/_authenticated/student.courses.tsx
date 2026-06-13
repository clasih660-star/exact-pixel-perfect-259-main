import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StudentShell } from "@/components/student/StudentShell";
import { Card, CardContent } from "@/components/ui/card";
import { getMyEnrolledCourses } from "@/lib/student.functions";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/courses")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentCourses,
});

function StudentCourses() {
  const fn = useServerFn(getMyEnrolledCourses);
  const q = useQuery({ queryKey: ["my-enrollments"], queryFn: () => fn() });
  const enrollments = q.data?.enrollments ?? [];
  return (
    <StudentShell title="My Courses">
      {q.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : enrollments.length === 0 ? (
        <p className="text-muted-foreground">You aren't enrolled in any courses yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map(
            (e) =>
              e.course && (
                <Link key={e.id} to="/student/courses/$courseId" params={{ courseId: e.course.id }}>
                  <Card>
                    <CardContent className="space-y-2 p-5">
                      <p className="text-xs uppercase text-muted-foreground">
                        {e.course.institutions?.name}
                      </p>
                      <h3 className="text-lg font-semibold">{e.course.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {e.course.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ),
          )}
        </div>
      )}
    </StudentShell>
  );
}
