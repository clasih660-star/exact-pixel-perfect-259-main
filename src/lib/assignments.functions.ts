/**
 * assignments.functions.ts — Phase 2 assignments service.
 *
 * Learning-focused assignments attached to courses/lessons. Points are OFF by
 * default (this captures learning evidence, not grades). Staff (owner/admin/
 * teacher) author and review; enrolled learners view published assignments and
 * submit their work. Row-level security enforces all access; these functions add
 * the workflow on top.
 *
 * The Phase 2 tables are not yet in the generated Supabase `Database` types, so
 * the client is accessed loosely (`db`), matching the existing convention used
 * elsewhere in this codebase for post-migration tables.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ASSIGNMENT_TYPES = [
  "practice",
  "reading",
  "reflection",
  "short_answer",
  "file_upload",
  "worksheet",
  "coding",
  "project",
] as const;

const SUBMISSION_TYPES = ["text", "file_upload", "short_responses", "worksheet", "link", "code"] as const;

/* ── Create ───────────────────────────────────────────────────────────── */
const CreateSchema = z.object({
  course_id: z.string().uuid(),
  lesson_id: z.string().uuid().optional(),
  programme_id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  instructions: z.string().trim().max(8000).default(""),
  type: z.enum(ASSIGNMENT_TYPES).default("practice"),
  submission_type: z.enum(SUBMISSION_TYPES).default("text"),
  due_at: z.string().datetime().optional(),
  estimated_minutes: z.number().int().min(1).max(6000).optional(),
  allow_late: z.boolean().default(true),
  ai_assistance_allowed: z.boolean().default(true),
});

export const createAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;

    const { data: course, error: cErr } = await db
      .from("courses")
      .select("institution_id")
      .eq("id", data.course_id)
      .single();
    if (cErr) throw new Error(cErr.message);

    const { data: row, error } = await db
      .from("assignments")
      .insert({
        institution_id: course.institution_id,
        programme_id: data.programme_id ?? null,
        course_id: data.course_id,
        lesson_id: data.lesson_id ?? null,
        title: data.title,
        description: data.description ?? null,
        instructions: data.instructions ?? "",
        type: data.type,
        submission_type: data.submission_type,
        due_at: data.due_at ?? null,
        estimated_minutes: data.estimated_minutes ?? null,
        points_enabled: false, // learning evidence, not grading
        allow_late: data.allow_late,
        ai_assistance_allowed: data.ai_assistance_allowed,
        status: "draft",
        created_by: context.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { assignment: row };
  });

/* ── Update ───────────────────────────────────────────────────────────── */
const UpdateSchema = z.object({
  assignment_id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  instructions: z.string().trim().max(8000).optional(),
  type: z.enum(ASSIGNMENT_TYPES).optional(),
  submission_type: z.enum(SUBMISSION_TYPES).optional(),
  lesson_id: z.string().uuid().nullable().optional(),
  due_at: z.string().datetime().nullable().optional(),
  estimated_minutes: z.number().int().min(1).max(6000).nullable().optional(),
  allow_late: z.boolean().optional(),
  ai_assistance_allowed: z.boolean().optional(),
});

export const updateAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UpdateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const { assignment_id, ...fields } = data;
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v;
    }
    const { error } = await db.from("assignments").update(patch).eq("id", assignment_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ── Publish / set status ─────────────────────────────────────────────── */
export const setAssignmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        assignment_id: z.string().uuid(),
        status: z.enum(["draft", "published", "closed", "archived"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const { error } = await db.from("assignments").update({ status: data.status }).eq("id", data.assignment_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ── Lists ────────────────────────────────────────────────────────────── */
/** Staff view: all assignments for a course (any status). */
export const listCourseAssignments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id: string }) => data)
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const { data: rows, error } = await db
      .from("assignments")
      .select("*")
      .eq("course_id", data.course_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { assignments: rows ?? [] };
  });

/** Learner view: published assignments across the learner's enrolled courses,
 *  joined with this learner's submission status (if any). */
export const listMyAssignments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(() => ({}))
  .handler(async ({ context }) => {
    const db = context.supabase as any;
    // RLS already restricts assignments to published + enrolled for non-staff.
    const { data: rows, error } = await db
      .from("assignments")
      .select("*")
      .eq("status", "published")
      .order("due_at", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);

    const ids = (rows ?? []).map((r: { id: string }) => r.id);
    let subs: Record<string, unknown>[] = [];
    if (ids.length) {
      const { data: subRows } = await db
        .from("assignment_submissions")
        .select("*")
        .eq("learner_id", context.userId)
        .in("assignment_id", ids);
      subs = subRows ?? [];
    }
    const byAssignment = new Map(subs.map((s: any) => [s.assignment_id, s]));
    return {
      assignments: (rows ?? []).map((a: any) => ({ ...a, submission: byAssignment.get(a.id) ?? null })),
    };
  });

/** Single assignment + its resources + the caller's own submission. */
export const getAssignment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { assignment_id: string }) => data)
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const { data: assignment, error } = await db
      .from("assignments")
      .select("*")
      .eq("id", data.assignment_id)
      .single();
    if (error) throw new Error(error.message);

    const { data: resources } = await db
      .from("assignment_resources")
      .select("*")
      .eq("assignment_id", data.assignment_id)
      .order("created_at", { ascending: true });

    const { data: submission } = await db
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", data.assignment_id)
      .eq("learner_id", context.userId)
      .maybeSingle();

    return { assignment, resources: resources ?? [], submission: submission ?? null };
  });

/* ── Submit (learner) ─────────────────────────────────────────────────── */
const SubmitSchema = z.object({
  assignment_id: z.string().uuid(),
  content: z.record(z.string(), z.unknown()).default({}),
  /** Submit for review, or just save a draft. */
  submit: z.boolean().default(false),
});

export const submitAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => SubmitSchema.parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;

    // Determine if a submission is late (past due date).
    const { data: assignment } = await db
      .from("assignments")
      .select("due_at, allow_late")
      .eq("id", data.assignment_id)
      .single();
    const now = new Date();
    const isLate = data.submit && assignment?.due_at ? now > new Date(assignment.due_at) : false;
    const status = data.submit ? (isLate ? "late" : "submitted") : "in_progress";

    const { data: row, error } = await db
      .from("assignment_submissions")
      .upsert(
        {
          assignment_id: data.assignment_id,
          learner_id: context.userId,
          content: data.content,
          status,
          submitted_at: data.submit ? now.toISOString() : null,
        },
        { onConflict: "assignment_id,learner_id" },
      )
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { submission: row, late: isLate };
  });

/* ── Submissions list (staff) ─────────────────────────────────────────── */
export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { assignment_id: string }) => data)
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const { data: rows, error } = await db
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", data.assignment_id)
      .order("submitted_at", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return { submissions: rows ?? [] };
  });

/* ── Feedback (staff) ─────────────────────────────────────────────────── */
const FeedbackSchema = z.object({
  submission_id: z.string().uuid(),
  body: z.string().trim().min(1).max(4000),
  decision: z.enum(["comment", "reviewed", "needs_revision", "completed"]).default("comment"),
});

export const addAssignmentFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => FeedbackSchema.parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;

    const { data: feedback, error } = await db
      .from("assignment_feedback")
      .insert({
        submission_id: data.submission_id,
        author_user_id: context.userId,
        body: data.body,
        decision: data.decision,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    // Reflect the teacher's decision on the submission status where it maps.
    const statusMap: Record<string, string | undefined> = {
      reviewed: "returned",
      needs_revision: "needs_revision",
      completed: "completed",
      comment: undefined,
    };
    const newStatus = statusMap[data.decision];
    if (newStatus) {
      await db
        .from("assignment_submissions")
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq("id", data.submission_id);
    }
    return { feedback };
  });
