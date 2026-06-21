import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Plus } from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { CreateLessonDialog } from "@/components/institution/CreateLessonDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourse } from "@/lib/courses.functions";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/lessons/new")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: NewInstitutionLessonPage,
});

function NewInstitutionLessonPage() {
  const { courseId } = Route.useParams();
  const fn = useServerFn(getCourse);
  const q = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fn({ data: { course_id: courseId } }),
  });

  const course = q.data?.course;

  return (
    <InstitutionShell
      title={course?.title ? `Create lesson for ${course.title}` : "Create Lesson"}
      actions={
        <Link to="/institution/courses/$courseId/lessons" params={{ courseId }}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Course lessons
          </Button>
        </Link>
      }
    >
      {q.isLoading ? (
        <p className="text-muted-foreground">Loading course...</p>
      ) : !course ? (
        <p className="text-muted-foreground">Course not found.</p>
      ) : (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="inline-flex rounded-2xl bg-[#E6F6F3] p-3 text-[#1F7C80]">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Add a manual lesson</h2>
              <p className="mt-2 text-sm leading-7 text-[#475569]">
                Create a lesson draft with title, description, difficulty, duration, and status.
                After creating it, open the lesson editor from the lesson list to refine sections
                and teaching items.
              </p>
            </div>
            <CreateLessonDialog
              courseId={courseId}
              trigger={
                <Button className="bg-[#1F7C80] hover:bg-[#1A5256]">
                  <Plus className="h-4 w-4" />
                  Add lesson
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </InstitutionShell>
  );
}
