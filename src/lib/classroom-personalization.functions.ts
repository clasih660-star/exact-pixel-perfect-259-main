/**
 * classroom-personalization.functions.ts
 *
 * Cross-lesson personalization for the AI classroom.
 *
 * 1. `loadLearnerProfile`: Loads the student's cognitive profile and topic
 *    mastery when the classroom mounts, so the AI teacher can adapt from
 *    minute one (not just after the first question).
 *
 * 2. `saveLearnerSessionSummary`: Persists the session's learning evidence
 *    back to the cognitive profile and topic mastery tables when the lesson
 *    ends, so the next lesson benefits from what was learned.
 *
 * Reuses the exact same Supabase patterns proven in
 * autonomous-teaching.functions.ts (lines 45–100 for loading, 261–274 and
 * 455–489 for saving/upserting).
 *
 * Graceful: both functions silently return empty data when Supabase or the
 * profile tables are unavailable — the classroom teaches with defaults.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type LearnerProfile = {
  preferredStyle: string;
  optimalPace: number;
  weakTopics: string[];
  strongTopics: string[];
  lastEmotion: string;
  baselineLoad: number;
  totalLessons: number;
};

export type TopicMasteryEntry = {
  topic: string;
  level: string;
  score: number;
  timesPresented: number;
  timesCorrect: number;
};

export type ProfileLoadResult = {
  profile: LearnerProfile | null;
  mastery: TopicMasteryEntry[];
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Load learner profile
// ─────────────────────────────────────────────────────────────────────────────

export const loadLearnerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      course_id: z.string().optional(),
      lesson_id: z.string().optional(),
    }),
  )
  .handler(async ({ data, context }: any): Promise<ProfileLoadResult> => {
    const supabase = context.supabase;
    if (!supabase) return { profile: null, mastery: [] };

    const userId = context.userId;

    // Load cognitive profile — try course-specific first, then global
    let profileQuery = supabase
      .from("student_cognitive_profiles")
      .select("*")
      .eq("student_id", userId);

    if (data.course_id) {
      profileQuery = profileQuery.eq("course_id", data.course_id);
    }

    const { data: cogProfile } = await profileQuery.maybeSingle();

    // If no course-specific profile, try to get a global one
    let profile = cogProfile;
    if (!profile && data.course_id) {
      const { data: globalProfile } = await supabase
        .from("student_cognitive_profiles")
        .select("*")
        .eq("student_id", userId)
        .is("course_id", null)
        .maybeSingle();
      profile = globalProfile;
    }

    // Load topic mastery for the course
    let mastery: TopicMasteryEntry[] = [];
    if (data.course_id) {
      const { data: masteryRows } = await supabase
        .from("topic_mastery")
        .select("topic_name, mastery_level, mastery_score, times_presented, times_correct")
        .eq("student_id", userId)
        .eq("course_id", data.course_id);

      if (masteryRows) {
        mastery = masteryRows.map((m: any) => ({
          topic: m.topic_name,
          level: m.mastery_level ?? "novice",
          score: Number(m.mastery_score ?? 0),
          timesPresented: m.times_presented ?? 0,
          timesCorrect: m.times_correct ?? 0,
        }));
      }
    }

    if (!profile) {
      return { profile: null, mastery };
    }

    return {
      profile: {
        preferredStyle: profile.preferred_learning_style ?? "visual",
        optimalPace: Number(profile.optimal_pace ?? 1.0),
        weakTopics: profile.weak_topics ?? [],
        strongTopics: profile.strong_topics ?? [],
        lastEmotion: profile.last_emotion_state ?? "curious",
        baselineLoad: Number(profile.baseline_cognitive_load ?? 0.3),
        totalLessons: profile.total_lessons_completed ?? 0,
      },
      mastery,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 2. Save session summary
// ─────────────────────────────────────────────────────────────────────────────

const SaveSessionSchema = z.object({
  course_id: z.string().optional(),
  lesson_id: z.string().optional(),
  score: z.number(),
  time_minutes: z.number(),
  questions_asked: z.number(),
  practice_correct: z.number(),
  practice_attempts: z.number(),
  confusion_score: z.number().optional(),
  weak_topics: z.array(z.string()).optional(),
  strong_topics: z.array(z.string()).optional(),
});

export const saveLearnerSessionSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => SaveSessionSchema.parse(input))
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;
    if (!supabase) return { ok: false };

    const userId = context.userId;

    // Resolve institution membership
    const { data: membership } = await supabase
      .from("institution_members")
      .select("institution_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const institutionId = membership?.institution_id;
    if (!institutionId) return { ok: false };

    // Derive emotion from confusion + score
    const confusion = data.confusion_score ?? 0;
    let emotion = "engaged";
    if (confusion > 0.7) emotion = "frustrated";
    else if (confusion > 0.4) emotion = "confused";
    else if (data.score >= 80) emotion = "confident";

    // Derive cognitive load from confusion and practice performance
    const practiceRate =
      data.practice_attempts > 0 ? data.practice_correct / data.practice_attempts : 0.5;
    const cognitiveLoad = Math.min(1, confusion * 0.6 + (1 - practiceRate) * 0.4);

    // Upsert cognitive profile
    const profileData = {
      institution_id: institutionId,
      student_id: userId,
      course_id: data.course_id || null,
      last_emotion_state: emotion,
      avg_engagement_score: Math.min(1, data.score / 100),
      preferred_learning_style: "visual", // Will be refined over time
      optimal_pace: cognitiveLoad > 0.6 ? 0.8 : cognitiveLoad < 0.3 ? 1.2 : 1.0,
      baseline_cognitive_load: cognitiveLoad,
      current_cognitive_load: cognitiveLoad,
      strong_topics: data.strong_topics ?? [],
      weak_topics: data.weak_topics ?? [],
      total_lessons_completed: 1, // Incremented via SQL
      total_time_spent_minutes: data.time_minutes,
      updated_at: new Date().toISOString(),
    };

    // Try to find existing profile first
    let existingQuery = supabase
      .from("student_cognitive_profiles")
      .select("id, total_lessons_completed, total_time_spent_minutes")
      .eq("student_id", userId);

    if (data.course_id) {
      existingQuery = existingQuery.eq("course_id", data.course_id);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      // Update existing profile, accumulating totals
      await supabase
        .from("student_cognitive_profiles")
        .update({
          ...profileData,
          total_lessons_completed: (existing.total_lessons_completed ?? 0) + 1,
          total_time_spent_minutes: (existing.total_time_spent_minutes ?? 0) + data.time_minutes,
        })
        .eq("id", existing.id);
    } else {
      // Insert new profile
      await supabase.from("student_cognitive_profiles").insert(profileData);
    }

    // Update topic mastery for the lesson
    if (data.lesson_id && data.course_id) {
      const { data: lessonRow } = await supabase
        .from("lessons")
        .select("title")
        .eq("id", data.lesson_id)
        .maybeSingle();

      if (lessonRow?.title) {
        const { data: existingMastery } = await supabase
          .from("topic_mastery")
          .select(
            "id, times_presented, times_practiced, times_correct, times_incorrect, mastery_score",
          )
          .eq("student_id", userId)
          .eq("topic_name", lessonRow.title)
          .maybeSingle();

        if (existingMastery) {
          await supabase
            .from("topic_mastery")
            .update({
              times_practiced: (existingMastery.times_practiced ?? 0) + data.practice_attempts,
              times_correct: (existingMastery.times_correct ?? 0) + data.practice_correct,
              times_incorrect:
                (existingMastery.times_incorrect ?? 0) +
                Math.max(0, data.practice_attempts - data.practice_correct),
              mastery_score:
                data.practice_attempts > 0
                  ? Math.min(
                      1,
                      (data.practice_correct / data.practice_attempts) * 0.5 +
                        Number(existingMastery.mastery_score ?? 0) * 0.5,
                    )
                  : Number(existingMastery.mastery_score ?? 0),
              last_presented_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingMastery.id);
        } else {
          await supabase.from("topic_mastery").insert({
            institution_id: institutionId,
            student_id: userId,
            course_id: data.course_id,
            topic_name: lessonRow.title,
            times_presented: 1,
            times_practiced: data.practice_attempts,
            times_correct: data.practice_correct,
            times_incorrect: Math.max(0, data.practice_attempts - data.practice_correct),
            mastery_score:
              data.practice_attempts > 0 ? data.practice_correct / data.practice_attempts : 0.5,
            last_presented_at: new Date().toISOString(),
          });
        }
      }
    }

    return { ok: true };
  });
