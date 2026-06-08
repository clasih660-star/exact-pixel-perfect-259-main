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
import { createClassroom } from "@/lib/classrooms.functions";

export function CreateClassroomDialog({
  institutionId,
  trigger,
}: {
  institutionId: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    subject: "",
    level: "",
    mode: "ai_teacher" as "ai_teacher" | "human_teacher" | "hybrid",
    capacity: "",
    status: "draft" as "draft" | "active" | "archived",
  });
  const qc = useQueryClient();
  const fn = useServerFn(createClassroom);
  const mut = useMutation({
    mutationFn: () =>
      fn({
        data: {
          institution_id: institutionId,
          name: form.name,
          description: form.description || undefined,
          subject: form.subject || undefined,
          level: form.level || undefined,
          mode: form.mode,
          capacity: form.capacity ? Number(form.capacity) : undefined,
          status: form.status,
        },
      }),
    onSuccess: () => {
      toast.success("Classroom created");
      qc.invalidateQueries({ queryKey: ["classrooms", institutionId] });
      qc.invalidateQueries({ queryKey: ["institution-overview", institutionId] });
      setOpen(false);
      setForm({
        name: "",
        description: "",
        subject: "",
        level: "",
        mode: "ai_teacher",
        capacity: "",
        status: "draft",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button>Create Classroom</Button>}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create virtual classroom</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="cname">Name *</Label>
            <Input
              id="cname"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Math Form 2 Classroom"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cdesc">Description</Label>
            <Textarea
              id="cdesc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="csubject">Subject</Label>
              <Input
                id="csubject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clevel">Level</Label>
              <Input
                id="clevel"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                placeholder="Form 2"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mode</Label>
              <Select
                value={form.mode}
                onValueChange={(v) => setForm({ ...form, mode: v as typeof form.mode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_teacher">AI Teacher</SelectItem>
                  <SelectItem value="human_teacher">Human Teacher</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ccap">Capacity</Label>
              <Input
                id="ccap"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending ? "Creating…" : "Create classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
