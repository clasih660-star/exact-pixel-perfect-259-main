import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, BookOpen, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { CreateLessonDialog } from "@/components/institution/CreateLessonDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourse } from "@/lib/courses.functions";
import { updateLessonStatus } from "@/lib/lessons.functions";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/lessons")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: InstitutionCourseLessonsPage,
});

function InstitutionCourseLessonsPage() {
  const { courseId } = Route.useParams();
  const fn = useServerFn(getCourse);
  const q = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fn({ data: { course_id: courseId } }),
  });

  const course = q.data?.course;
  const lessons = q.data?.lessons ?? [];

  return (
    <InstitutionShell
      title={course?.title ? `${course.title} lessons` : "Course Lessons"}
      actions={
        <Link to="/institution/courses/$courseId" params={{ courseId }}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Course overview
          </Button>
        </Link>
      }
    >
      {q.isLoading ? (
        <p className="text-muted-foreground">Loading lessons...</p>
      ) : !course ? (
        <p className="text-muted-foreground">Course not found.</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap justify-end gap-2">
            <CreateLessonDialog courseId={courseId} />
            <Link to="/institution/courses/$courseId/materials" params={{ courseId }}>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4" />
                Materials
              </Button>
            </Link>
            <Link to="/institution/courses/$courseId/generate-lessons" params={{ courseId }}>
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4" />
                Generate
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Lessons" value={lessons.length} />
            <Stat
              label="Published"
              value={lessons.filter((lesson: any) => lesson.status === "published").length}
            />
            <Stat
              label="Drafts"
              value={lessons.filter((lesson: any) => lesson.status === "draft").length}
            />
          </div>

          {lessons.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <h2 className="mt-3 font-semibold">No lessons yet</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a lesson manually or generate lessons from course materials.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson: any) => (
                <LessonRow key={lesson.id} lesson={lesson} courseId={courseId} />
              ))}
            </div>
          )}
        </div>
      )}
    </InstitutionShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function LessonRow({ lesson, courseId }: { lesson: any; courseId: string }) {
  const qc = useQueryClient();
  const fn = useServerFn(updateLessonStatus);
  const m = useMutation({
    mutationFn: (status: "draft" | "published" | "archived") =>
      fn({ data: { lesson_id: lesson.id, status } }),
    onSuccess: () => {
      toast.success("Lesson updated");
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">
            {lesson.difficulty ?? "No difficulty"} - {lesson.duration_minutes ?? "?"} min
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {lesson.status}
          </Badge>
          <Link to="/teacher/lessons/$lessonId/edit" params={{ lessonId: lesson.id }}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>
          {lesson.status === "draft" ? (
            <Button size="sm" onClick={() => m.mutate("published")}>
              Publish
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => m.mutate("draft")}>
              Move to draft
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
