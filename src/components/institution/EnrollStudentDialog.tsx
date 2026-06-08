import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enrollStudent } from "@/lib/enrollments.functions";

export function EnrollStudentDialog({
  courseId,
  trigger,
}: {
  courseId: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const qc = useQueryClient();
  const fn = useServerFn(enrollStudent);
  const m = useMutation({
    mutationFn: () => fn({ data: { course_id: courseId, email } }),
    onSuccess: () => {
      toast.success("Student enrolled");
      qc.invalidateQueries({ queryKey: ["course", courseId] });
      qc.invalidateQueries({ queryKey: ["enrollments", courseId] });
      setOpen(false);
      setEmail("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <UserPlus className="h-4 w-4" />
            Enroll Student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll a student</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Student email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              The student must already have a Klassruum account.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => m.mutate()} disabled={!email || m.isPending}>
            {m.isPending ? "Enrolling…" : "Enroll"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
