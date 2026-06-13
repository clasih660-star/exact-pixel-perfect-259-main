import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { generateTeacherSpeech } from "./teacher-voice-service";

const GenerateTeacherSpeechSchema = z.object({
  sessionId: z.string().min(1),
  lessonId: z.string().min(1),
  teachingItemId: z.string().optional(),
  teacherProfileId: z.string().min(1).default("mr_klass"),
  voiceProfileId: z.string().min(1).default("mr_klass_voice"),
  text: z.string().min(1).max(3000),
  speechType: z.enum([
    "welcome",
    "board_reading",
    "explanation",
    "question",
    "answer",
    "clarification",
    "encouragement",
    "summary",
  ]),
});

export const generateTeacherSpeechServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => GenerateTeacherSpeechSchema.parse(data))
  .handler(async ({ data }) => {
    return generateTeacherSpeech(data, { supabase: createServerSupabase() });
  });

function createServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return undefined;

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: undefined,
    },
  });
}
