import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { LessonGenerationModal } from "@/components/institution/LessonGenerationModal";
import { MaterialsTabContent } from "@/components/institution/MaterialsTabContent";
import { Button } from "@/components/ui/button";
import { getCourse } from "@/lib/courses.functions";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/materials")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: InstitutionCourseMaterialsPage,
});

function InstitutionCourseMaterialsPage() {
  const { courseId } = Route.useParams();
  const [genModalOpen, setGenModalOpen] = useState(false);
  const fn = useServerFn(getCourse);
  const q = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fn({ data: { course_id: courseId } }),
  });

  const course = q.data?.course;

  return (
    <InstitutionShell
      title={course?.title ? `${course.title} materials` : "Course Materials"}
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
        <p className="text-muted-foreground">Loading materials...</p>
      ) : !course ? (
        <p className="text-muted-foreground">Course not found.</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap justify-end gap-2">
            <Link to="/institution/courses/$courseId/lessons" params={{ courseId }}>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4" />
                Lessons
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setGenModalOpen(true)}>
              <Sparkles className="h-4 w-4" />
              Generate lessons
            </Button>
          </div>

          <MaterialsTabContent
            courseId={courseId}
            institutionId={course.institution_id}
            onGenerateLessons={() => setGenModalOpen(true)}
          />
          <LessonGenerationModal
            courseId={courseId}
            courseTitle={course.title}
            isOpen={genModalOpen}
            onOpenChange={setGenModalOpen}
            onSuccess={() => {
              setGenModalOpen(false);
              q.refetch();
            }}
          />
        </div>
      )}
    </InstitutionShell>
  );
}
