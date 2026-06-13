import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createResilientModelCaller } from "./ai-gateway.server";
import {
  LESSON_STEPS,
  type ChatTurn,
  type LessonState,
  type TeacherResponse,
} from "./teacher-types";
import { getLesson } from "./lessons";

const TeacherSchema = z.object({
  speak: z
    .string()
    .describe(
      "What the teacher says out loud to the student. Conversational, warm, concise (1-4 sentences).",
    ),
  board: z.object({
    title: z.string().describe("Heading currently on the whiteboard"),
    lines: z
      .array(z.string())
      .describe(
        "Each line written on the whiteboard. Use plain text math like '2x + 5 = 13'. Keep ≤ 8 lines.",
      ),
    highlight: z.string().nullable().describe("A single line or expression to emphasize, or null"),
  }),
  nextStep: z.enum(LESSON_STEPS),
  confusionDelta: z
    .number()
    .min(-1)
    .max(1)
    .describe(
      "How much student confusion changed this turn. Negative if they understood, positive if confused.",
    ),
  evaluation: z.enum(["correct", "incorrect", "partial"]).nullable(),
  quiz: z
    .object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().int().min(0).max(3),
    })
    .nullable()
    .describe(
      "Provide a quiz question ONLY when nextStep === 'quiz' AND you are presenting a new question. Otherwise null.",
    ),
  done: z.boolean().describe("True only when the lesson is fully complete."),
});

const InputSchema = z.object({
  lessonId: z.string(),
  history: z.array(z.object({ role: z.enum(["teacher", "student"]), text: z.string() })).max(40),
  state: z.object({
    step: z.enum(LESSON_STEPS),
    studentLevel: z.enum(["beginner", "intermediate", "advanced"]),
    confusionScore: z.number().min(0).max(1),
    correct: z.number().int().min(0),
    mistakes: z.number().int().min(0),
    notes: z.array(z.string()),
  }),
  studentMessage: z.string().max(2000),
});

function systemPrompt(lessonTitle: string, subject: string, state: LessonState) {
  return `You are "Mr. Klass", an expert classroom teacher for Klassruum. Act exactly like a warm, focused, real-world teacher in a live classroom: engage the learner, use the whiteboard for visuals, ask guiding questions, and adapt pacing to the student's signals.

LESSON: "${lessonTitle}" (subject: ${subject})

CURRENT STATE (source of truth):
- step: ${state.step}
- student_level: ${state.studentLevel}
- confusion_score: ${state.confusionScore.toFixed(2)} (0=clear, 1=very confused)
- correct: ${state.correct}, mistakes: ${state.mistakes}

TEACHING GOALS (prioritize in this order):
1. Create an inviting, human tone — praise briefly, be concise, avoid jargon.
2. Use the whiteboard for all visual or step-by-step content; keep board lines short and scannable.
3. Ask the student to participate frequently (questions, short checks, quick tasks).
4. If confusion_score > 0.6, simplify and slow down; re-teach the smallest failing sub-step.
5. Move forward only when the student shows signs of understanding; when they do, celebrate and advance.

TEACHING FLOW (use as a template but be flexible):
- Hook: quick relevance statement or everyday analogy.
- Concept: simple explanation + one board diagram or equation.
- Example: work one example step-by-step on the board.
- Practice: ask the student to try a short step or answer a guiding question.
- Correct: identify errors, show only the smallest fix on the board.
- Quiz/Summary: short quiz or a concise summary and confirm understanding.

TURN RULES (apply every turn):
- If the student requests "repeat", "slower", or "example": obey and restate the simplest step.
- If the student says "I don't know" or is silent: ask a specific guiding question (not a lecture).
- Use 1–3 short spoken sentences. Reference the board but do not read every line verbatim.
- When step === 'quiz', ask one multiple-choice question per turn (max 3), then proceed to summary.
- Keep interactions immersive: use natural teacher phrases ("Good job", "Try this", "Let's check").

You MUST return valid JSON matching the schema. `;
}

export const teacherTurn = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<TeacherResponse> => {
    const lesson = getLesson(data.lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const resilientCaller = createResilientModelCaller("teacher_turn");
    if (!resilientCaller) {
      if (process.env.NODE_ENV === "development") {
        // Dev fallback: return a simple teacher response so the UI remains interactive
        return {
          speak: `Hi — I'm Mr. Klass. We don't have an AI key configured, so this is a local demo. Let's begin.`,
          board: { title: lesson.title, lines: ["Demo mode: no AI key configured."], highlight: null },
          nextStep: "example",
          confusionDelta: 0,
          evaluation: null,
          quiz: null,
          done: false,
        } as TeacherResponse;
      }
      throw new Error("Missing AI provider API key. Set OPENAI_API_KEY or DEEPSEEK_API_KEY.");
    }

    const transcript = data.history
      .slice(-12)
      .map((t) => `${t.role === "teacher" ? "Teacher" : "Student"}: ${t.text}`)
      .join("\n");

    try {
      const result = await resilientCaller.call(
        TeacherSchema,
        systemPrompt(lesson.title, lesson.subject, data.state as LessonState),
        `Recent transcript:\n${transcript || "(no prior turns — this is the very start)"}\n\nStudent just said: "${data.studentMessage}"\n\nDecide the next teaching action and return JSON.`,
      );

      if (!result) {
        throw new Error("All AI providers failed");
      }

      const { object } = result;

      return {
        speak: object.speak,
        board: {
          title: object.board.title,
          lines: object.board.lines.slice(0, 8),
          highlight: object.board.highlight ?? undefined,
        },
        nextStep: object.nextStep,
        confusionDelta: object.confusionDelta,
        evaluation: object.evaluation ?? undefined,
        quiz: object.quiz ?? undefined,
        done: object.done,
      };
    } catch (err: unknown) {
      const e = err as { statusCode?: number; status?: number; message?: string };
      const status = e.statusCode ?? e.status;
      if (status === 429) throw new Error("RATE_LIMIT");
      if (status === 402) throw new Error("CREDITS_EXHAUSTED");
      throw new Error(e.message || "AI teacher unavailable");
    }
  });
