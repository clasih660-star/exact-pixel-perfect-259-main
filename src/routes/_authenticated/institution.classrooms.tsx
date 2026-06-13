import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, School } from "lucide-react";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { CreateClassroomDialog } from "@/components/institution/CreateClassroomDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyInstitutions } from "@/lib/institutions.functions";
import { listClassrooms } from "@/lib/classrooms.functions";
import { requireInstitutionAdmin } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/classrooms")({
  beforeLoad: (ctx) => requireInstitutionAdmin(ctx.context),
  component: ClassroomsPage,
});

function ClassroomsPage() {
  const myFn = useServerFn(getMyInstitutions);
  const my = useQuery({ queryKey: ["my-institutions"], queryFn: () => myFn() });
  const institutionId = my.data?.memberships?.[0]?.institution?.id;

  const listFn = useServerFn(listClassrooms);
  const q = useQuery({
    queryKey: ["classrooms", institutionId],
    queryFn: () => listFn({ data: { institution_id: institutionId! } }),
    enabled: !!institutionId,
  });

  return (
    <InstitutionShell
      title="Classrooms"
      actions={
        institutionId && (
          <CreateClassroomDialog
            institutionId={institutionId}
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                Create Classroom
              </Button>
            }
          />
        )
      }
    >
      {!institutionId || q.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (q.data?.classrooms.length ?? 0) === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <School className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h2 className="mt-3 text-lg font-semibold">No classrooms yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create your first virtual classroom.</p>
          <div className="mt-6">
            <CreateClassroomDialog institutionId={institutionId} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {q.data!.classrooms.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    {c.subject && (
                      <p className="text-xs text-muted-foreground">
                        {c.subject}
                        {c.level ? ` · ${c.level}` : ""}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {c.status}
                  </Badge>
                </div>
                {c.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{c.mode.replace("_", " ")}</span>
                  {c.capacity && <span>Capacity: {c.capacity}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </InstitutionShell>
  );
}
