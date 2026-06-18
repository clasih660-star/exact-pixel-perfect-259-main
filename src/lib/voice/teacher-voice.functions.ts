import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { generateTeacherSpeech } from "./teacher-voice-service";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ForbiddenError } from "@/lib/security-errors";
import { assertActorCanAccessSession } from "@/lib/server-authorization";

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
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => GenerateTeacherSpeechSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const session = await assertActorCanAccessSession(context, data.sessionId);
    if (session.lesson_id && session.lesson_id !== data.lessonId) {
      throw new ForbiddenError("The requested lesson does not match the active classroom session.");
    }

    return generateTeacherSpeech(data, { supabase: createServerSupabase(context.supabase) });
  });

function createServerSupabase(authenticatedSupabase?: any) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return undefined;

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: undefined,
    },
  });
}
