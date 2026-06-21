import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, BookOpen, FileText, Sparkles } from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { LessonGenerationModal } from "@/components/institution/LessonGenerationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourse } from "@/lib/courses.functions";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute(
  "/_authenticated/institution/courses/$courseId/generate-lessons",
)({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: InstitutionGenerateLessonsPage,
});

function InstitutionGenerateLessonsPage() {
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
      title={course?.title ? `Generate lessons for ${course.title}` : "Generate Lessons"}
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
        <p className="text-muted-foreground">Loading generation workspace...</p>
      ) : !course ? (
        <p className="text-muted-foreground">Course not found.</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="inline-flex rounded-2xl bg-[#E6F6F3] p-3 text-[#1F7C80]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">Generate structured lessons</h2>
                <p className="mt-2 text-sm leading-7 text-[#475569]">
                  Use ready course materials to create lesson drafts with sections, teaching items,
                  guided practice, and review steps. Upload materials first if this course has no
                  ready source content.
                </p>
              </div>
              <Button
                className="bg-[#1F7C80] hover:bg-[#1A5256]"
                onClick={() => setGenModalOpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                Open generator
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Link to="/institution/courses/$courseId/materials" params={{ courseId }}>
              <Card className="transition hover:border-[#1F7C80]/40">
                <CardContent className="flex items-start gap-3 p-4">
                  <FileText className="mt-1 h-5 w-5 text-[#1F7C80]" />
                  <div>
                    <h3 className="font-semibold">Course materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload files or text that the generator can use.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/institution/courses/$courseId/lessons" params={{ courseId }}>
              <Card className="transition hover:border-[#1F7C80]/40">
                <CardContent className="flex items-start gap-3 p-4">
                  <BookOpen className="mt-1 h-5 w-5 text-[#1F7C80]" />
                  <div>
                    <h3 className="font-semibold">Course lessons</h3>
                    <p className="text-sm text-muted-foreground">
                      Review, edit, publish, or move generated lessons back to draft.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <LessonGenerationModal
            courseId={courseId}
            courseTitle={course.title}
            isOpen={genModalOpen}
            onOpenChange={setGenModalOpen}
            onSuccess={() => setGenModalOpen(false)}
          />
        </div>
      )}
    </InstitutionShell>
  );
}
