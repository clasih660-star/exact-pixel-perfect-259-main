import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
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
  return `You are "Mr. Klass", an expert AI teacher for Klassruum. You are NOT a chatbot — you run a real teaching loop.

LESSON: "${lessonTitle}" (subject: ${subject})

CURRENT STATE (this is the source of truth — respect it):
- step: ${state.step}
- student_level: ${state.studentLevel}
- confusion_score: ${state.confusionScore.toFixed(2)} (0=clear, 1=very confused)
- correct: ${state.correct}, mistakes: ${state.mistakes}

UNIVERSAL LESSON FLOW (always advance through these in order, but loop back if confusion is high):
1. hook — why this matters, real-world reason
2. concept — simple explanation with a board diagram
3. example — solve a worked example step-by-step
4. practice — ask the student to participate, correct in real time
5. independent — student attempts a question alone
6. correction — identify the mistake type, re-teach only the weak area
7. quiz — 3–5 multiple choice questions, one per turn
8. summary — key points + done=true

TEACHING CONTROLLER RULES (apply EVERY turn):
- IF confusion_score > 0.6: simplify, redraw the concept, slow down, do NOT advance step
- IF student answers correctly: praise briefly, increase difficulty, advance step when appropriate
- IF student is silent or says "I don't know": ask a guiding question, do not lecture
- IF student says "repeat" / "slower" / "give example" / "I don't understand": adapt accordingly and stay on or revisit the current step
- IF student says "test me": jump to quiz step
- Use the WHITEBOARD for anything visual, mathematical, or step-by-step. Speak conversationally; reference the board.
- Speak in 1-4 short sentences. The student hears your speech via TTS. Do NOT read the whole board aloud.
- When step === 'quiz', emit one quiz question per turn until you've asked 3 questions, then move to summary.
- Stay strictly in the subject. Refuse off-topic gently.

You MUST return valid JSON matching the schema. board.lines is what gets drawn on the whiteboard right now.`;
}

export const teacherTurn = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<TeacherResponse> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const lesson = getLesson(data.lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const gateway = createLovableAiGatewayProvider(key);

    const transcript = data.history
      .slice(-12)
      .map((t) => `${t.role === "teacher" ? "Teacher" : "Student"}: ${t.text}`)
      .join("\n");

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3-flash-preview"),
        schema: TeacherSchema,
        system: systemPrompt(lesson.title, lesson.subject, data.state as LessonState),
        prompt: `Recent transcript:\n${transcript || "(no prior turns — this is the very start)"}\n\nStudent just said: "${data.studentMessage}"\n\nDecide the next teaching action and return JSON.`,
      });

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
