/**
 * lesson-generation.functions.ts
 *
 * Generates teachable classroom lessons from course materials and saves them as
 * DRAFTS, following the hierarchy:
 *   Course (+ materials, timeline, requested count) → Lessons → Sections → Teaching Items
 *
 * Each generated lesson is a full classroom experience: what appears on the
 * board, what the teacher reads, what the teacher explains, learner notes,
 * accessibility text, question checkpoints, practice, summary, and reflection.
 *
 * Uses the Lovable AI gateway when LOVABLE_API_KEY is set; otherwise falls back
 * to a deterministic generator so the flow still works without AI.
 *
 * Auth: requires a signed-in staff user (RLS on lessons/lesson_sections/
 * teaching_items enforces owner/admin/teacher on insert).
 */

import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiGatewayProvider } from "./ai-gateway.server";

// ── AI output schema (one batch of lessons) ──────────────────────────────────

const TeachingItemSchema = z.object({
  type: z.enum([
    "heading", "bullet", "equation", "calculation", "image", "diagram",
    "question", "answer", "correction", "instruction", "concept",
  ]),
  boardText: z.string().describe("Short board text. Bullets 5–26 words. Never long paragraphs."),
  exactSpokenText: z.string().describe("Verbatim text the teacher reads after writing."),
  teacherExplanation: z.string().describe("Deeper explanation the teacher gives."),
  learnerNotes: z.string().describe("Cleaned note saved for revision."),
  accessibleDescription: z.string().describe("Screen-reader description."),
  whyThisMatters: z.string().nullable(),
  commonMistake: z.string().nullable(),
});

const SectionSchema = z.object({
  title: z.string(),
  type: z.enum([
    "welcome", "objective", "why_it_matters", "prerequisite_check", "concept",
    "worked_example", "question_checkpoint", "required_middle_question",
    "guided_practice", "independent_practice", "correction", "summary",
    "exit_reflection", "homework",
  ]),
  estimatedMinutes: z.number().int().min(1).max(20),
  teachingItems: z.array(TeachingItemSchema).min(1).max(12),
});

const LessonSchema = z.object({
  title: z.string(),
  objective: z.string(),
  syllabusReference: z.string().nullable(),
  estimatedDurationMinutes: z.number().int().min(25).max(60),
  sections: z.array(SectionSchema).min(4).max(14),
});

const BatchSchema = z.object({
  lessons: z.array(LessonSchema).min(1).max(20),
  note: z.string().nullable().describe("If content was too limited for the requested count, explain here."),
});

type GeneratedBatch = z.infer<typeof BatchSchema>;

// ── Input ─────────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  course_id: z.string().uuid(),
  requested_count: z.number().int().min(1).max(20).default(6),
  level: z.string().max(80).optional(),
  timeline_weeks: z.number().int().min(1).max(52).optional(),
  /** Optional override; if omitted, the course's ready materials are concatenated. */
  material_text: z.string().max(60000).optional(),
});

function generationSystemPrompt(args: {
  programme?: string;
  course: string;
  subject?: string;
  level?: string;
  timelineWeeks?: number;
  requestedCount: number;
}): string {
  return `You generate structured Klassruum classroom lessons from institution-provided course materials.

PROGRAMME: ${args.programme ?? "—"}
COURSE: ${args.course} (subject: ${args.subject ?? "—"}, level: ${args.level ?? "school level"})
TIMELINE: ${args.timelineWeeks ? `${args.timelineWeeks} weeks` : "not specified"}
REQUESTED LESSONS: ${args.requestedCount}

Create exactly ${args.requestedCount} lessons unless the content is too limited. If content is limited, create the closest reasonable number and explain what is missing in "note".

Each lesson MUST include, via sections in this order where sensible:
welcome, objective/why_it_matters, prerequisite_check, concept, worked_example,
question_checkpoint, required_middle_question, guided_practice, independent_practice,
correction, summary, exit_reflection, homework.

Each lesson MUST have an estimated duration of at least 25 minutes.

Whiteboard rules:
- Use SHORT board text: calculations, equations, short bullets, examples.
- Do NOT put long paragraphs on the board. Bullets should be 5–26 words.
- Every teaching item must have exactSpokenText, a detailed teacherExplanation, learnerNotes, and accessibleDescription.

Do NOT create exams, grading, or certification. Focus on teaching, interaction, practice, notes, and reflection.
Return valid JSON matching the schema.`;
}

// ── Deterministic fallback (no AI key) ────────────────────────────────────────

function fallbackBatch(materialText: string, requestedCount: number, courseTitle: string): GeneratedBatch {
  const clean = materialText.replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).filter((s) => s.length > 12);
  const chunkSize = Math.max(1, Math.ceil(sentences.length / requestedCount));
  const lessons: GeneratedBatch["lessons"] = [];

  for (let i = 0; i < requestedCount; i++) {
    const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    const topic = chunk[0]?.split(" ").slice(0, 6).join(" ") || `${courseTitle} — part ${i + 1}`;
    const concepts = (chunk.length ? chunk : [`Key ideas for ${courseTitle}.`]).slice(0, 5);
    lessons.push({
      title: `Lesson ${i + 1}: ${topic}`,
      objective: `By the end of this lesson, you should understand: ${topic}.`,
      syllabusReference: null,
      estimatedDurationMinutes: 25,
      sections: [
        {
          title: "Welcome and lesson goal",
          type: "welcome",
          estimatedMinutes: 2,
          teachingItems: [
            {
              type: "heading",
              boardText: `Lesson goal: ${topic}`,
              exactSpokenText: `Lesson goal: ${topic}.`,
              teacherExplanation: `Today we focus on ${topic}. We will build the idea step by step.`,
              learnerNotes: `This lesson covers ${topic}.`,
              accessibleDescription: `Heading on the board: lesson goal, ${topic}.`,
              whyThisMatters: "Knowing the goal helps you focus on what success looks like.",
              commonMistake: null,
            },
          ],
        },
        {
          title: "Concept",
          type: "concept",
          estimatedMinutes: 6,
          teachingItems: concepts.map((c) => ({
            type: "bullet" as const,
            boardText: c.split(" ").slice(0, 18).join(" "),
            exactSpokenText: c,
            teacherExplanation: c,
            learnerNotes: c,
            accessibleDescription: c,
            whyThisMatters: null,
            commonMistake: null,
          })),
        },
        {
          title: "Guided practice",
          type: "guided_practice",
          estimatedMinutes: 5,
          teachingItems: [
            {
              type: "question",
              boardText: "Try together: apply today's idea to an example.",
              exactSpokenText: "Let's try one together.",
              teacherExplanation: "We solve a similar problem together, step by step.",
              learnerNotes: "Practice the method with teacher guidance.",
              accessibleDescription: "Guided practice prompt on the board.",
              whyThisMatters: null,
              commonMistake: null,
            },
          ],
        },
        {
          title: "Summary and reflection",
          type: "summary",
          estimatedMinutes: 2,
          teachingItems: [
            {
              type: "bullet",
              boardText: `Today you learned: ${topic}.`,
              exactSpokenText: `Today you learned about ${topic}.`,
              teacherExplanation: `We covered ${topic}. Review your notes and ask if anything is unclear.`,
              learnerNotes: `Summary: ${topic}.`,
              accessibleDescription: `Summary bullet on the board about ${topic}.`,
              whyThisMatters: null,
              commonMistake: null,
            },
          ],
        },
      ],
    });
  }

  return {
    lessons,
    note:
      sentences.length < requestedCount
        ? `Course material was limited; generated ${requestedCount} lessons by dividing available content evenly.`
        : null,
  };
}

// ── Server function ───────────────────────────────────────────────────────────

export const generateLessonsForCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Load course (RLS-scoped to the caller)
    const { data: course, error: cErr } = await context.supabase
      .from("courses")
      .select("id, title, subject, level, institution_id, programme_id")
      .eq("id", data.course_id)
      .single();
    if (cErr) throw new Error(cErr.message);

    // Gather material text
    let materialText = data.material_text ?? "";
    let sourceMaterialIds: string[] = [];
    if (!materialText) {
      const { data: materials } = await context.supabase
        .from("course_materials")
        .select("id, extracted_text")
        .eq("course_id", data.course_id)
        .eq("processing_status", "ready");
      if (materials?.length) {
        sourceMaterialIds = materials.map((m) => m.id);
        materialText = materials.map((m) => m.extracted_text ?? "").join("\n\n").trim();
      }
    }
    if (!materialText) {
      materialText = `Course: ${course.title}. Subject: ${course.subject ?? ""}. Generate foundational lessons for this course.`;
    }

    // Generate (AI when available, otherwise deterministic fallback)
    let batch: GeneratedBatch;
    let usedAI = false;
    const gateway = createAiGatewayProvider();
    if (gateway) {
      try {
        const modelName = process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "deepseek/lesson-gen-1";
        const { object } = await generateObject({
          model: gateway(modelName),
          schema: BatchSchema,
          system: generationSystemPrompt({
            course: course.title,
            subject: course.subject ?? undefined,
            level: data.level ?? course.level ?? undefined,
            timelineWeeks: data.timeline_weeks,
            requestedCount: data.requested_count,
          }),
          prompt: `COURSE MATERIALS:\n${materialText.slice(0, 24000)}\n\nGenerate the lessons now as JSON.`,
        });
        batch = object;
        usedAI = true;
      } catch {
        batch = fallbackBatch(materialText, data.requested_count, course.title);
      }
    } else {
      batch = fallbackBatch(materialText, data.requested_count, course.title);
    }

    // Find current lesson count for ordering
    const { count: existing } = await context.supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("course_id", data.course_id);

    // Persist as drafts: lessons → sections → teaching items
    const created: { lessonId: string; title: string; sections: number; items: number }[] = [];
    let order = existing ?? 0;

    for (const lesson of batch.lessons) {
      const { data: lessonRow, error: lErr } = await context.supabase
        .from("lessons")
        .insert({
          institution_id: course.institution_id,
          course_id: course.id,
          programme_id: course.programme_id,
          title: lesson.title,
          objective: lesson.objective,
          syllabus_reference: lesson.syllabusReference,
          order_index: order++,
          minimum_duration_minutes: 25,
          estimated_duration_minutes: lesson.estimatedDurationMinutes,
          duration_minutes: lesson.estimatedDurationMinutes,
          source_material_ids: sourceMaterialIds,
          generation_mode: "auto",
          status: "draft",
          created_by: context.userId,
          lesson_data_json: {},
        })
        .select("id")
        .single();
      if (lErr) throw new Error(lErr.message);

      let sectionOrder = 0;
      let itemTotal = 0;
      for (const section of lesson.sections) {
        const { data: sectionRow, error: sErr } = await context.supabase
          .from("lesson_sections")
          .insert({
            institution_id: course.institution_id,
            course_id: course.id,
            lesson_id: lessonRow.id,
            title: section.title,
            type: section.type,
            order_index: sectionOrder++,
            estimated_minutes: section.estimatedMinutes,
          })
          .select("id")
          .single();
        if (sErr) throw new Error(sErr.message);

        const itemRows = section.teachingItems.map((item, idx) => ({
          institution_id: course.institution_id,
          course_id: course.id,
          lesson_id: lessonRow.id,
          section_id: sectionRow.id,
          order_index: idx,
          type: item.type,
          board_text: item.boardText,
          exact_spoken_text: item.exactSpokenText,
          teacher_explanation: item.teacherExplanation,
          learner_notes: item.learnerNotes,
          accessible_description: item.accessibleDescription,
          why_this_matters: item.whyThisMatters,
          common_mistake: item.commonMistake,
          estimated_seconds: 8,
        }));
        const { error: iErr } = await context.supabase.from("teaching_items").insert(itemRows);
        if (iErr) throw new Error(iErr.message);
        itemTotal += itemRows.length;
      }

      created.push({
        lessonId: lessonRow.id,
        title: lesson.title,
        sections: lesson.sections.length,
        items: itemTotal,
      });
    }

    return {
      usedAI,
      note: batch.note ?? null,
      requestedCount: data.requested_count,
      createdCount: created.length,
      created,
    };
  });
