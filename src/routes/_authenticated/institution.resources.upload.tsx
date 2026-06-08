import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InstitutionShell } from "@/components/institution/InstitutionShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMyInstitutions } from "@/lib/institutions.functions";
import { listCourses } from "@/lib/courses.functions";
import { createResource } from "@/lib/resources.functions";
import { supabase } from "@/integrations/supabase/client";

type ResType = "pdf" | "text" | "image" | "link" | "video" | "audio" | "slides" | "document";

export const Route = createFileRoute("/_authenticated/institution/resources/upload")({
  component: UploadResourcePage,
});

function UploadResourcePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Get institution
  const instFn = useServerFn(getMyInstitutions);
  const instQ = useQuery({ queryKey: ["my-institutions"], queryFn: () => instFn() });
  const institutionId = instQ.data?.memberships?.[0]?.institution?.id;

  // Get courses for this institution
  const coursesFn = useServerFn(listCourses);
  const coursesQ = useQuery({
    queryKey: ["institution-courses", institutionId],
    queryFn: () => coursesFn({ data: { institution_id: institutionId! } }),
    enabled: !!institutionId,
  });

  // Form state
  const [type, setType] = useState<ResType>("link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const createFn = useServerFn(createResource);

  const mut = useMutation({
    mutationFn: async () => {
      if (!institutionId) throw new Error("No institution found");

      let file_url: string | undefined;
      let external_url: string | undefined;

      if (type === "link") {
        if (!externalUrl.trim()) throw new Error("URL is required");
        external_url = externalUrl;
      } else if (type === "text") {
        if (!textContent.trim()) throw new Error("Content is required");
        external_url = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(textContent)))}`;
      } else if (file) {
        setUploading(true);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${institutionId}/${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("resources").upload(path, file);
        setUploading(false);
        if (upErr) throw new Error(upErr.message);
        file_url = path;
      } else {
        throw new Error("Please choose a file.");
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 20);

      return createFn({
        data: {
          institution_id: institutionId,
          course_id: courseId || undefined,
          title,
          description: description || undefined,
          type,
          file_url,
          external_url,
          subject: subject || undefined,
          grade_level: grade || undefined,
          tags,
        },
      });
    },
    onSuccess: () => {
      toast.success("Resource uploaded successfully");
      qc.invalidateQueries({ queryKey: ["resources"] });
      navigate({ to: "/institution/resources" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const courses = coursesQ.data?.courses ?? [];

  return (
    <InstitutionShell
      title="Upload Resource"
      actions={
        <Link to="/institution/resources">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Resources
          </Button>
        </Link>
      }
    >
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Upload Learning Resource</h2>
                <p className="text-sm text-muted-foreground">
                  Add resources to your institution library and optionally attach them to courses.
                </p>
              </div>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                mut.mutate();
              }}
            >
              {/* Resource type */}
              <div className="space-y-1.5">
                <Label>Resource type *</Label>
                <Select value={type} onValueChange={(v) => setType(v as ResType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="text">Text / Notes</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="slides">Slides / Presentation</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Algebra - Chapter 1"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  maxLength={2000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the resource…"
                  rows={3}
                />
              </div>

              {/* Attach to course */}
              <div className="space-y-1.5">
                <Label>Attach to course (optional)</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No specific course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No specific course</SelectItem>
                    {courses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Resources attached to a course will be visible to enrolled students.
                </p>
              </div>

              {/* Type-specific input */}
              {type === "link" && (
                <div className="space-y-1.5">
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    required
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              )}
              {type === "text" && (
                <div className="space-y-1.5">
                  <Label htmlFor="text">Content *</Label>
                  <Textarea
                    id="text"
                    required
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={8}
                    placeholder="Paste or type your notes here…"
                  />
                </div>
              )}
              {["pdf", "image", "video", "audio", "slides", "document"].includes(type) && (
                <div className="space-y-1.5">
                  <Label htmlFor="file">File *</Label>
                  <Input
                    id="file"
                    type="file"
                    required
                    accept={
                      type === "pdf"
                        ? "application/pdf"
                        : type === "image"
                          ? "image/*"
                          : type === "video"
                            ? "video/*"
                            : type === "audio"
                              ? "audio/*"
                              : type === "slides"
                                ? ".ppt,.pptx,.odp,application/vnd.oasis.opendocument.presentation"
                                : undefined
                    }
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {file && (
                    <p className="text-xs text-muted-foreground">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Mathematics"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade">Grade level</Label>
                  <Input
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Grade 8"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="algebra, exam-prep, chapter-1"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link to="/institution/resources">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={mut.isPending || uploading}
                  className="shadow-[var(--shadow-brand)]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading file…
                    </>
                  ) : mut.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resource
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </InstitutionShell>
  );
}
