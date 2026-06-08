import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createResource } from "@/lib/resources.functions";
import { supabase } from "@/integrations/supabase/client";

type ResType = "pdf" | "text" | "image" | "link";

export function UploadResourceDialog({
  institutionId,
  courseId,
  trigger,
}: {
  institutionId: string;
  courseId?: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ResType>("link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const qc = useQueryClient();
  const fn = useServerFn(createResource);

  const reset = () => {
    setType("link");
    setTitle("");
    setDescription("");
    setSubject("");
    setGrade("");
    setTagsInput("");
    setExternalUrl("");
    setTextContent("");
    setFile(null);
  };

  const mut = useMutation({
    mutationFn: async () => {
      let file_url: string | undefined;
      let external_url: string | undefined;

      if (type === "link") {
        external_url = externalUrl;
      } else if (type === "text") {
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

      return fn({
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
      toast.success("Resource added");
      qc.invalidateQueries({ queryKey: ["resources", institutionId] });
      qc.invalidateQueries({ queryKey: ["institution-overview", institutionId] });
      setOpen(false);
      reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Upload Resource</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add learning resource</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label>Resource type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ResType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rtitle">Title *</Label>
            <Input id="rtitle" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rdesc">Description</Label>
            <Textarea
              id="rdesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {type === "link" && (
            <div className="space-y-1.5">
              <Label htmlFor="rurl">URL *</Label>
              <Input
                id="rurl"
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
              <Label htmlFor="rtext">Content *</Label>
              <Textarea
                id="rtext"
                required
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
              />
            </div>
          )}
          {(type === "pdf" || type === "image") && (
            <div className="space-y-1.5">
              <Label htmlFor="rfile">File *</Label>
              <Input
                id="rfile"
                type="file"
                required
                accept={type === "pdf" ? "application/pdf" : "image/*"}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rsubject">Subject</Label>
              <Input id="rsubject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rgrade">Grade level</Label>
              <Input id="rgrade" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="rtags">Tags (comma-separated)</Label>
              <Input
                id="rtags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="algebra, exam"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mut.isPending || uploading}>
              {uploading ? "Uploading…" : mut.isPending ? "Saving…" : "Add resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
