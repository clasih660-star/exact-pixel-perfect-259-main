import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  BookOpen,
  GraduationCap,
  Mail,
  Plus,
  RefreshCcw,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { requireInstitutionStaff } from "@/lib/route-guards";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  assignTeacherToCourse,
  listInstitutionTeachers,
  removeTeacherFromCourse,
} from "@/lib/institution-invites.functions";

type TeacherRow = {
  userId: string;
  fullName: string | null;
  email: string | null;
  teacherNumber: string | null;
  status: string;
  joinedAt: string | null;
  assignments: Array<{
    courseId: string;
    courseTitle: string;
    subject: string | null;
    role: string;
  }>;
};

type CourseRow = { id: string; title: string; subject: string | null; status: string | null };

export const Route = createFileRoute("/_authenticated/institution/teachers")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: InstitutionTeachersRoute,
});

function formatDate(input?: string | null) {
  if (!input) return "—";
  return new Date(input).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function InstitutionTeachersRoute() {
  const routeContext = Route.useRouteContext() as Record<string, unknown>;
  const institutionId = (routeContext.institutionId as string | null) ?? "demo-institution";
  const queryClient = useQueryClient();

  const listFn = useServerFn(listInstitutionTeachers);
  const assignFn = useServerFn(assignTeacherToCourse);
  const removeFn = useServerFn(removeTeacherFromCourse);

  const query = useQuery({
    queryKey: ["institution-teachers", institutionId],
    queryFn: () => listFn({ data: { institution_id: institutionId } }),
    enabled: Boolean(institutionId),
  });

  const assignMutation = useMutation({
    mutationFn: (input: { teacherId: string; courseId: string }) =>
      assignFn({
        data: {
          institution_id: institutionId,
          teacher_id: input.teacherId,
          course_id: input.courseId,
          role: "teacher",
        },
      }),
    onSuccess: () => {
      toast.success("Teacher assigned to course.");
      queryClient.invalidateQueries({ queryKey: ["institution-teachers", institutionId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: (input: { teacherId: string; courseId: string }) =>
      removeFn({
        data: {
          institution_id: institutionId,
          teacher_id: input.teacherId,
          course_id: input.courseId,
        },
      }),
    onSuccess: () => {
      toast.success("Teacher removed from course.");
      queryClient.invalidateQueries({ queryKey: ["institution-teachers", institutionId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const teachers = (query.data?.teachers ?? []) as TeacherRow[];
  const courses = (query.data?.courses ?? []) as CourseRow[];
  const pendingInvites = query.data?.pendingInvites ?? [];
  const stats = query.data?.stats ?? {
    activeTeachers: 0,
    pendingInvites: 0,
    assignedTeachers: 0,
    courses: 0,
  };

  return (
    <InstitutionShell
      title="Teachers"
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button asChild size="sm">
            <Link to="/institution/teachers/invite">
              <UserPlus className="mr-2 h-4 w-4" /> Invite teacher
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={GraduationCap} label="Active teachers" value={stats.activeTeachers} />
        <StatCard icon={Mail} label="Pending invites" value={stats.pendingInvites} />
        <StatCard icon={BookOpen} label="Assigned teachers" value={stats.assignedTeachers} />
        <StatCard icon={Users} label="Available courses" value={stats.courses} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Institution teacher roster
            </CardTitle>
          </CardHeader>
          <CardContent>
            {query.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading teachers…</p>
            ) : teachers.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Assign course</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.userId}>
                      <TableCell>
                        <div className="font-medium">{teacher.fullName ?? teacher.email ?? "Teacher"}</div>
                        <div className="text-xs text-muted-foreground">
                          {teacher.email ?? "No email on profile"}
                        </div>
                        {teacher.teacherNumber ? (
                          <Badge variant="outline" className="mt-2">
                            {teacher.teacherNumber}
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-sm flex-wrap gap-2">
                          {teacher.assignments.length ? (
                            teacher.assignments.map((assignment) => (
                              <Badge key={assignment.courseId} variant="secondary" className="gap-1">
                                {assignment.courseTitle}
                                <button
                                  type="button"
                                  aria-label={`Remove ${assignment.courseTitle}`}
                                  className="ml-1 rounded hover:text-destructive"
                                  disabled={removeMutation.isPending}
                                  onClick={() =>
                                    removeMutation.mutate({
                                      teacherId: teacher.userId,
                                      courseId: assignment.courseId,
                                    })
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No courses yet</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[220px]">
                        <Select
                          disabled={assignMutation.isPending || courses.length === 0}
                          onValueChange={(courseId) =>
                            assignMutation.mutate({ teacherId: teacher.userId, courseId })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(teacher.joinedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="font-semibold">No active teachers yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Invite teachers to join the institution, then assign them to courses so they can
                  supervise lessons and manage live or hybrid classrooms.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/institution/teachers/invite">
                    <Plus className="mr-2 h-4 w-4" /> Invite your first teacher
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Pending teacher invites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInvites.length ? (
              pendingInvites.map((invite: any) => (
                <div key={invite.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{invite.full_name ?? invite.email}</div>
                      <div className="text-xs text-muted-foreground">{invite.email}</div>
                    </div>
                    <Badge variant="outline">{invite.status}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Expires {formatDate(invite.expires_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                No pending teacher invitations. New invites will appear here until accepted.
              </div>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/institution/teachers/invite">
                <UserPlus className="mr-2 h-4 w-4" /> Send another invite
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </InstitutionShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
