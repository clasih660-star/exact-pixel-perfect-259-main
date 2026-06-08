import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus,
  School,
  Users,
  FolderUp,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Calendar,
  TrendingUp,
  Video,
  Clock,
  CheckCircle2,
  PlayCircle,
  UserPlus,
} from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { CreateClassroomDialog } from "@/components/institution/CreateClassroomDialog";
import { UploadResourceDialog } from "@/components/institution/UploadResourceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getMyInstitutions, getInstitutionOverview } from "@/lib/institutions.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/institution/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const myFn = useServerFn(getMyInstitutions);
  const myQuery = useQuery({ queryKey: ["my-institutions"], queryFn: () => myFn() });

  if (myQuery.isLoading) {
    return (
      <InstitutionShell title="Dashboard">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent mx-auto" />
            <p className="mt-4 text-sm text-[var(--gray-500)]">Loading your institution...</p>
          </div>
        </div>
      </InstitutionShell>
    );
  }

  const memberships = myQuery.data?.memberships ?? [];
  const owned = memberships[0];

  if (!owned) {
    return (
      <InstitutionShell title="Dashboard">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--gray-900)]">No institution yet</h2>
            <p className="mt-3 text-[var(--gray-500)]">
              Register your institution to create courses, enroll students, and run virtual
              classrooms.
            </p>
            <div className="mt-8">
              <Link to="/institutions/register">
                <Button size="lg" className="shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Register Your Institution
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </InstitutionShell>
    );
  }

  return <InstitutionDashboardInner institutionId={owned.institution!.id} />;
}

function InstitutionDashboardInner({ institutionId }: { institutionId: string }) {
  const overviewFn = useServerFn(getInstitutionOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["institution-overview", institutionId],
    queryFn: () => overviewFn({ data: { institution_id: institutionId } }),
  });

  const stats = data?.stats;
  const inst = data?.institution;

  return (
    <InstitutionShell
      title="Dashboard"
      actions={
        <>
          <Link to="/institution/courses/new">
            <Button variant="outline" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Create Course
            </Button>
          </Link>
          <UploadResourceDialog institutionId={institutionId} />
          <CreateClassroomDialog
            institutionId={institutionId}
            trigger={
              <Button size="sm">
                <Video className="mr-1.5 h-4 w-4" />
                Start Classroom
              </Button>
            }
          />
        </>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent mx-auto" />
            <p className="mt-3 text-sm text-[var(--gray-500)]">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <InstitutionOverviewCard inst={inst} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <StatCard
              icon={BookOpen}
              label="Courses"
              value={stats?.courses ?? 0}
              sub={`${stats?.active_courses ?? 0} published`}
            />
            <StatCard
              icon={School}
              label="Classrooms"
              value={stats?.classrooms ?? 0}
              sub={`${stats?.active_classrooms ?? 0} active`}
            />
            <StatCard icon={GraduationCap} label="Teachers" value={stats?.teachers ?? 0} />
            <StatCard icon={Users} label="Students" value={stats?.students ?? 0} />
            <StatCard icon={FolderUp} label="Resources" value={stats?.resources ?? 0} />
            <StatCard icon={TrendingUp} label="Avg Progress" value={stats?.average_progress ?? 0} suffix="%" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <CoursesSection institutionId={institutionId} />
              <ActiveSessionsSection />
            </div>

            <div className="space-y-6">
              <QuickActionsSection institutionId={institutionId} />
              <ResourcesPreviewSection />
            </div>
          </div>
        </div>
      )}
    </InstitutionShell>
  );
}

function InstitutionOverviewCard({ inst }: { inst: any }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{
                background: inst?.brand_color || "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              }}
            >
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--gray-900)]">{inst?.name}</h2>
              <p className="text-sm text-[var(--gray-500)]">
                {inst?.city}
                {inst?.country ? `, ${inst.country}` : ""} · {inst?.type?.replace("_", " ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={`rounded-full px-3 py-1 ${inst?.status === "active" ? "bg-green-100 text-green-700" : ""}`}
            >
              {inst?.status}
            </Badge>
            <Link to="/institution/settings">
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CoursesSection({ institutionId }: { institutionId: string }) {
  const demoCourses = [
    { id: "1", title: "Mathematics Form 2", subject: "Mathematics", level: "Form 2", students: 45, lessons: 12, status: "published" },
    { id: "2", title: "KCSE Chemistry Revision", subject: "Chemistry", level: "KCSE", students: 38, lessons: 8, status: "published" },
    { id: "3", title: "English Speaking Practice", subject: "English", level: "All Levels", students: 52, lessons: 6, status: "draft" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Courses Overview</CardTitle>
        <Link to="/institution/courses" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-[var(--gray-200)] bg-white p-4 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-[var(--gray-900)]">{course.title}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${course.status === "published" ? "border-green-300 text-green-600" : "border-gray-300 text-gray-500"}`}
                  >
                    {course.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--gray-500)]">
                  {course.subject} · {course.level}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--gray-600)]">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.lessons}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link to="/institution/courses/$courseId" params={{ courseId: course.id }}>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                Start Session
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ActiveSessionsSection() {
  const demoSessions = [
    { id: "1", lesson: "Quadratic Equations", course: "Mathematics Form 2", mode: "AI Teacher", students: 12, status: "live" },
    { id: "2", lesson: "Chemical Reactions", course: "KCSE Chemistry", mode: "AI Teacher", students: 8, status: "scheduled" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Active Sessions</CardTitle>
        <Link to="/institution/sessions" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {demoSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Video className="h-10 w-10 text-[var(--gray-300)]" />
            <p className="mt-3 text-sm text-[var(--gray-500)]">
              No active sessions. Start a classroom to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {demoSessions.map((session) => (
              <div
                key={session.id}
                className={`rounded-xl border p-4 ${session.status === "live" ? "border-green-200 bg-green-50" : "border-[var(--gray-200)] bg-white"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {session.status === "live" && (
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                      <h3 className="truncate font-semibold text-[var(--gray-900)]">
                        {session.lesson}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-[var(--gray-500)]">{session.course}</p>
                  </div>
                  <Badge variant={session.status === "live" ? "default" : "outline"}>
                    {session.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[var(--gray-500)]">
                    <span>{session.mode}</span>
                    <span>·</span>
                    <span>{session.students} students</span>
                  </div>
                  <Button size="sm" variant={session.status === "live" ? "default" : "outline"}>
                    {session.status === "live" ? "Join" : "Start"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionsSection({ institutionId }: { institutionId: string }) {
  const actions = [
    { icon: BookOpen, label: "Create Course", hint: "Build a new learning program", to: "/institution/courses/new" },
    { icon: Video, label: "Start Classroom", hint: "Launch a live session", dialog: "classroom" },
    { icon: FolderUp, label: "Upload Resource", hint: "Add learning materials", dialog: "resource" },
    { icon: UserPlus, label: "Invite Students", hint: "Enroll learners", to: "/institution/enrollments" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          if (action.dialog === "classroom") {
            return (
              <CreateClassroomDialog
                key={action.label}
                institutionId={institutionId}
                trigger={
                  <button className="w-full rounded-xl border border-[var(--gray-200)] p-3 text-left transition hover:bg-[var(--gray-50)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--gray-900)]">{action.label}</p>
                        <p className="text-xs text-[var(--gray-500)]">{action.hint}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--gray-400)]" />
                    </div>
                  </button>
                }
              />
            );
          }
          if (action.dialog === "resource") {
            return (
              <UploadResourceDialog
                key={action.label}
                institutionId={institutionId}
                trigger={
                  <button className="w-full rounded-xl border border-[var(--gray-200)] p-3 text-left transition hover:bg-[var(--gray-50)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--gray-900)]">{action.label}</p>
                        <p className="text-xs text-[var(--gray-500)]">{action.hint}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--gray-400)]" />
                    </div>
                  </button>
                }
              />
            );
          }
          return (
            <Link key={action.label} to={action.to || "/"}>
              <button className="w-full rounded-xl border border-[var(--gray-200)] p-3 text-left transition hover:bg-[var(--gray-50)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--gray-900)]">{action.label}</p>
                    <p className="text-xs text-[var(--gray-500)]">{action.hint}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--gray-400)]" />
                </div>
              </button>
            </Link>
          );
        })}

        <Link to="/dashboard" className="block">
          <button className="w-full rounded-xl border border-dashed border-[var(--primary)] bg-[var(--primary-light)]/50 p-3 text-left transition hover:bg-[var(--primary-light)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--primary)]">Try Demo classroom</p>
                <p className="text-xs text-[var(--gray-500)]">Experience the AI teacher</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
            </div>
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ResourcesPreviewSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Resource Library</CardTitle>
        <Link to="/institution/resources" className="text-sm font-semibold text-[var(--primary)]">
          Browse all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {["PDF", "Video", "Link", "Slides"].map((type) => (
            <div
              key={type}
              className="rounded-xl border border-[var(--gray-200)] bg-white p-3 text-center transition hover:bg-[var(--gray-50)]"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gray-400)]">
                {type}
              </div>
              <div className="mt-1 text-lg font-bold text-[var(--gray-900)]">0</div>
            </div>
          ))}
        </div>
        <Link to="/institution/resources/upload" className="mt-3 block">
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Upload Resource
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  suffix,
}: {
  icon: typeof School;
  label: string;
  value: number;
  sub?: string;
  suffix?: string;
}) {
  return (
    <Card className="transition hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gray-400)]">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--gray-900)]">
              {value}{suffix}
            </p>
            {sub && <p className="mt-0.5 text-xs text-[var(--gray-500)]">{sub}</p>}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

