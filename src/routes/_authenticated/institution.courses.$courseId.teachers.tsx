import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap, Plus, Trash2, UserPlus } from "lucide-react";
import { requireInstitutionAdmin } from "@/lib/route-guards";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCourse } from "@/lib/courses.functions";
import {
  assignTeacherToCourse,
  listInstitutionTeachers,
  removeTeacherFromCourse,
} from "@/lib/institution-invites.functions";

type TeacherRow = {
  userId: string;
  fullName: string | null;
  email: string | null;
  assignments: Array<{ courseId: string; courseTitle: string }>;
};

export const Route = createFileRoute("/_authenticated/institution/courses/$courseId/teachers")({
  beforeLoad: (ctx) => requireInstitutionAdmin(ctx.context),
  component: CourseTeachersRoute,
});

function CourseTeachersRoute() {
  const { courseId } = Route.useParams();
  const routeContext = Route.useRouteContext() as Record<string, unknown>;
  const institutionId = (routeContext.institutionId as string | null) ?? "demo-institution";
  const queryClient = useQueryClient();

  const getCourseFn = useServerFn(getCourse);
  const listTeachersFn = useServerFn(listInstitutionTeachers);
  const assignFn = useServerFn(assignTeacherToCourse);
  const removeFn = useServerFn(removeTeacherFromCourse);

  const courseQuery = useQuery({
    queryKey: ["institution-course", courseId],
    queryFn: () => getCourseFn({ data: { course_id: courseId } }),
  });
  const teachersQuery = useQuery({
    queryKey: ["institution-teachers", institutionId],
    queryFn: () => listTeachersFn({ data: { institution_id: institutionId } }),
    enabled: Boolean(institutionId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["institution-teachers", institutionId] });
  };

  const assignMutation = useMutation({
    mutationFn: (teacherId: string) =>
      assignFn({
        data: { institution_id: institutionId, teacher_id: teacherId, course_id: courseId, role: "teacher" },
      }),
    onSuccess: () => {
      toast.success("Teacher assigned to this course.");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: (teacherId: string) =>
      removeFn({ data: { institution_id: institutionId, teacher_id: teacherId, course_id: courseId } }),
    onSuccess: () => {
      toast.success("Teacher removed from this course.");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const teachers = (teachersQuery.data?.teachers ?? []) as TeacherRow[];
  const assignedTeachers = teachers.filter((teacher) =>
    teacher.assignments.some((assignment) => assignment.courseId === courseId),
  );
  const availableTeachers = teachers.filter(
    (teacher) => !teacher.assignments.some((assignment) => assignment.courseId === courseId),
  );
  const courseTitle = courseQuery.data?.course?.title ?? "Course";

  return (
    <InstitutionShell
      title="Course teachers"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to="/institution/courses/$courseId" params={{ courseId }}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to course
          </Link>
        </Button>
      }
    >
      <div className="mb-6 rounded-lg border bg-card p-5">
        <div className="text-sm text-muted-foreground">Managing teachers for</div>
        <h2 className="mt-1 text-2xl font-bold">{courseTitle}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Assigned teachers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachersQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading teachers…</p>
            ) : assignedTeachers.length ? (
              assignedTeachers.map((teacher) => (
                <div key={teacher.userId} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="font-medium">{teacher.fullName ?? teacher.email ?? "Teacher"}</div>
                    <div className="text-sm text-muted-foreground">{teacher.email ?? "No email"}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={removeMutation.isPending}
                    onClick={() => removeMutation.mutate(teacher.userId)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="font-semibold">No teacher assigned yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Assign a teacher so they can manage this course's lessons and live sessions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add teacher
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTeachers.length ? (
              <Select disabled={assignMutation.isPending} onValueChange={(teacherId) => assignMutation.mutate(teacherId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose teacher" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher.userId} value={teacher.userId}>
                      {teacher.fullName ?? teacher.email ?? "Teacher"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                All active teachers are already assigned, or no teachers have accepted invites yet.
              </div>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link to="/institution/teachers/invite">
                <UserPlus className="mr-2 h-4 w-4" /> Invite another teacher
              </Link>
            </Button>

            <div className="pt-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-2">
                Tip
              </Badge>
              Course teachers inherit permission to create/review lessons and run supervised sessions
              for this course.
            </div>
          </CardContent>
        </Card>
      </div>
    </InstitutionShell>
  );
}
