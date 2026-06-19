import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, FolderUp, Image as ImageIcon, Link as LinkIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { UploadResourceDialog } from "@/components/institution/UploadResourceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyInstitutions } from "@/lib/institutions.functions";
import { listResources } from "@/lib/resources.functions";
import { requireInstitutionStaff } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/resources")({
  beforeLoad: (ctx) => requireInstitutionStaff(ctx.context),
  component: ResourcesPage,
});

const ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  text: FileText,
  image: ImageIcon,
  link: LinkIcon,
  video: FileText,
  audio: FileText,
  slides: FileText,
  document: FileText,
};

function ResourcesPage() {
  const myFn = useServerFn(getMyInstitutions);
  const my = useQuery({ queryKey: ["my-institutions"], queryFn: () => myFn() });
  const institutionId = my.data?.memberships?.[0]?.institution?.id;

  const listFn = useServerFn(listResources);
  const q = useQuery({
    queryKey: ["resources", institutionId],
    queryFn: () => listFn({ data: { institution_id: institutionId! } }),
    enabled: !!institutionId,
  });

  return (
    <InstitutionShell
      title="Resources"
      actions={
        institutionId && (
          <UploadResourceDialog
            institutionId={institutionId}
            trigger={<Button>Upload Resource</Button>}
          />
        )
      }
    >
      {!institutionId || q.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (q.data?.resources.length ?? 0) === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FolderUp className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h2 className="mt-3 text-lg font-semibold">No resources yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload PDFs, notes, images, or links to build your library.
          </p>
          <div className="mt-6">
            <UploadResourceDialog institutionId={institutionId} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {q.data!.resources.map((r: any) => {
            const Icon = ICONS[r.type] ?? FileText;
            return (
              <Card key={r.id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{r.title}</h3>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                        {r.type}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {r.status}
                    </Badge>
                  </div>
                  {r.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {r.description}
                    </p>
                  )}
                  {Array.isArray(r.tags) && r.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(r.tags as string[]).map((t: any) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        toast.info(
                          "AI lesson generation from uploaded resources will be added next.",
                        )
                      }
                    >
                      <Sparkles className="h-4 w-4" /> Generate Lesson from Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </InstitutionShell>
  );
}
