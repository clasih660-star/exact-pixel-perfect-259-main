import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, School, Users, FolderUp, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { CreateClassroomDialog } from "@/components/institution/CreateClassroomDialog";
import { UploadResourceDialog } from "@/components/institution/UploadResourceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <p className="text-muted-foreground">Loading…</p>
      </InstitutionShell>
    );
  }

  const memberships = myQuery.data?.memberships ?? [];
  const owned = memberships[0];

  if (!owned) {
    return (
      <InstitutionShell title="Dashboard">
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <h2 className="text-xl font-semibold">No institution yet</h2>
          <p className="mt-2 text-muted-foreground">Register your institution to get started.</p>
          <div className="mt-6">
            <Link to="/institutions/register">
              <Button>Register institution</Button>
            </Link>
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
          <UploadResourceDialog institutionId={institutionId} />
          <CreateClassroomDialog
            institutionId={institutionId}
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                Create Classroom
              </Button>
            }
          />
        </>
      }
    >
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{inst?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {inst?.city}
                    {inst?.country ? `, ${inst.country}` : ""} · {inst?.type}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="capitalize">
                {inst?.status}
              </Badge>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={School}
              label="Classrooms"
              value={stats?.classrooms ?? 0}
              sub={`${stats?.active_classrooms ?? 0} active`}
            />
            <StatCard icon={Users} label="Teachers" value={stats?.teachers ?? 0} />
            <StatCard icon={Users} label="Students" value={stats?.students ?? 0} />
            <StatCard icon={FolderUp} label="Resources" value={stats?.resources ?? 0} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Action
                  label="Create Classroom"
                  hint="Set up a new virtual space"
                  onClick="dialog-classroom"
                  institutionId={institutionId}
                />
                <Action
                  label="Upload Resource"
                  hint="Add learning material"
                  onClick="dialog-resource"
                  institutionId={institutionId}
                />
                <Action label="Invite Teacher" hint="Coming soon" onClick="toast" />
                <Action label="Invite Students" hint="Coming soon" onClick="toast" />
                <Link to="/dashboard">
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="text-left">
                      <span className="block text-sm font-medium">Start Demo Session</span>
                      <span className="block text-xs text-muted-foreground">
                        Try the AI classroom
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No sessions yet. Create a classroom and run your first lesson.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </InstitutionShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof School;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function Action({
  label,
  hint,
  onClick,
  institutionId,
}: {
  label: string;
  hint: string;
  onClick: "dialog-classroom" | "dialog-resource" | "toast";
  institutionId?: string;
}) {
  if (onClick === "dialog-classroom" && institutionId) {
    return (
      <CreateClassroomDialog
        institutionId={institutionId}
        trigger={<ActionButton label={label} hint={hint} />}
      />
    );
  }
  if (onClick === "dialog-resource" && institutionId) {
    return (
      <UploadResourceDialog
        institutionId={institutionId}
        trigger={<ActionButton label={label} hint={hint} />}
      />
    );
  }
  return <ActionButton label={label} hint={hint} onClick={() => toast.info("Coming soon")} />;
}

function ActionButton({
  label,
  hint,
  onClick,
}: {
  label: string;
  hint: string;
  onClick?: () => void;
}) {
  return (
    <Button variant="ghost" className="w-full justify-between" onClick={onClick}>
      <span className="text-left">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
