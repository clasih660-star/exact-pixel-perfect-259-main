/**
 * autonomous-teaching.functions.ts
 *
 * Server functions for the autonomous AI teaching system.
 * Connects the teaching engine to the database and classroom sessions.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getAutonomousTeachingEngine,
  createInitialCognitiveState,
  type CognitiveState,
  type TeachingDecision,
  type StudentResponse,
  type TeachingContext,
} from "./autonomous-teaching-engine";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Initialize or Get Cognitive Profile
// ─────────────────────────────────────────────────────────────────────────────

export const getOrCreateCognitiveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { course_id?: string }) => data)
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Get institution membership
    const { data: membership } = await supabase
      .from("institution_members")
      .select("institution_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const institutionId = membership?.institution_id;

    // Try to get existing profile
    let query = supabase.from("student_cognitive_profiles").select("*").eq("student_id", userId);

    if (data.course_id) {
      query = query.eq("course_id", data.course_id);
    }

    const { data: existing, error } = await query.maybeSingle();

    if (existing) {
      return {
        id: existing.id,
        institutionId: existing.institution_id,
        cognitiveState: {
          emotionState: existing.last_emotion_state,
          understandingScore: Number(existing.avg_engagement_score),
          masteredConcepts: existing.strong_topics || [],
          weakConcepts: existing.weak_topics || [],
          preferredStyle: existing.preferred_learning_style,
          optimalPace: Number(existing.optimal_pace),
          streakCount: 0,
          idleSeconds: 0,
          cognitiveLoad: Number(existing.current_cognitive_load),
        } as CognitiveState,
      };
    }

    // Create new profile
    const initial = createInitialCognitiveState();
    const { data: created, error: createError } = await supabase
      .from("student_cognitive_profiles")
      .insert({
        institution_id: institutionId,
        student_id: userId,
        course_id: data.course_id || null,
        last_emotion_state: initial.emotionState,
        avg_engagement_score: initial.understandingScore,
        preferred_learning_style: initial.preferredStyle,
        optimal_pace: initial.optimalPace,
        baseline_cognitive_load: initial.cognitiveLoad,
        current_cognitive_load: initial.cognitiveLoad,
        strong_topics: initial.masteredConcepts,
        weak_topics: initial.weakConcepts,
      })
      .select("id")
      .single();

    if (createError) throw new Error(createError.message);

    return {
      id: created.id,
      institutionId,
      cognitiveState: initial,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 2. Process Student Message (Real-time AI Teaching)
// ─────────────────────────────────────────────────────────────────────────────

const ProcessMessageSchema = z.object({
  session_id: z.string().uuid(),
  message: z.string().min(1).max(5000),
  message_type: z
    .enum(["text", "voice", "multiple_choice", "skip", "hint_request", "repeat_request"])
    .default("text"),
  selected_option: z.number().optional(),
});

export const processStudentMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => ProcessMessageSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;
    const engine = getAutonomousTeachingEngine();

    // Get session info
    const { data: session, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, institution_id, course_id, lesson_id, status")
      .eq("id", data.session_id)
      .single();

    if (sessionError) throw new Error(sessionError.message);

    // Get lesson info
    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, title, objective, lesson_data_json")
      .eq("id", session.lesson_id)
      .single();

    // Get current progress
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("current_step, progress_percentage, confusion_score, student_level, teacher_state")
      .eq("lesson_id", session.lesson_id)
      .eq("student_id", context.userId)
      .maybeSingle();

    // Get recent interactions
    const { data: recentMessages } = await supabase
      .from("chat_messages")
      .select("sender, message, created_at")
      .eq("session_id", data.session_id)
      .order("created_at", { ascending: false })
      .limit(10);

    const interactions = (recentMessages || []).reverse().map((m: any) => ({
      role: m.sender as "student" | "teacher",
      content: m.message,
      timestamp: new Date(m.created_at),
    }));

    // Add current student message
    interactions.push({
      role: "student" as const,
      content: data.message,
      timestamp: new Date(),
    });

    // Get cognitive profile
    const { data: cogProfile } = await supabase
      .from("student_cognitive_profiles")
      .select("*")
      .eq("student_id", context.userId)
      .maybeSingle();

    const cognitiveState: CognitiveState = cogProfile
      ? {
          emotionState: cogProfile.last_emotion_state,
          understandingScore: Number(cogProfile.avg_engagement_score),
          masteredConcepts: cogProfile.strong_topics || [],
          weakConcepts: cogProfile.weak_topics || [],
          preferredStyle: cogProfile.preferred_learning_style as
            | "visual"
            | "auditory"
            | "kinesthetic"
            | "reading",
          optimalPace: Number(cogProfile.optimal_pace),
          streakCount: 0,
          idleSeconds: 0,
          cognitiveLoad: Number(cogProfile.current_cognitive_load),
        }
      : createInitialCognitiveState();

    // Build teaching context
    const teachingContext: TeachingContext = {
      lessonId: session.lesson_id,
      lessonTitle: lesson?.title || "Lesson",
      lessonObjective: lesson?.objective || "",
      currentStep: progress?.current_step || "hook",
      stepIndex: 0,
      totalSteps: 8,
      boardContent: [],
      topic: lesson?.title || "Learning",
      subject: "General",
    };

    // Analyze student state
    const analyzedState = await engine.analyzeStudentState(
      teachingContext,
      cognitiveState,
      interactions,
    );

    // Decide next action
    const startTime = Date.now();
    const decision = await engine.decideNextAction(teachingContext, analyzedState, interactions);
    const generationMs = Date.now() - startTime;

    // Save student message
    await supabase.from("chat_messages").insert({
      institution_id: session.institution_id,
      course_id: session.course_id,
      lesson_id: session.lesson_id,
      session_id: data.session_id,
      user_id: context.userId,
      sender: "student",
      message: data.message,
      message_type: data.message_type,
    });

    // Save teacher response
    const { data: teacherMsg } = await supabase
      .from("chat_messages")
      .insert({
        institution_id: session.institution_id,
        course_id: session.course_id,
        lesson_id: session.lesson_id,
        session_id: data.session_id,
        user_id: context.userId,
        sender: "ai_teacher",
        message: decision.spokenText,
        message_type: "teacher_response",
      })
      .select("id")
      .single();

    // Log AI decision
    await supabase.from("ai_teaching_decisions").insert({
      institution_id: session.institution_id,
      session_id: data.session_id,
      student_id: context.userId,
      lesson_id: session.lesson_id,
      current_step: teachingContext.currentStep,
      emotion_state: analyzedState.emotionState,
      understanding_score: analyzedState.understandingScore,
      cognitive_load: analyzedState.cognitiveLoad,
      streak_count: analyzedState.streakCount,
      teaching_strategy: decision.strategy,
      ai_reasoning: decision.reasoning,
      spoken_text: decision.spokenText,
      board_update_json: decision.boardUpdate || null,
      question_asked: decision.questionToAsk || null,
      waited_for_student: decision.waitForStudentResponse,
      encouragement_level: decision.encouragementLevel,
      should_escalate: decision.shouldEscalateToHuman,
      escalate_reason: decision.escalateReason || null,
      response_generation_ms: generationMs,
      model_used: "gemini-3-flash-preview",
      fallback_used: false,
    });

    // Update cognitive profile
    if (cogProfile) {
      await supabase
        .from("student_cognitive_profiles")
        .update({
          last_emotion_state: analyzedState.emotionState,
          avg_engagement_score: analyzedState.understandingScore,
          current_cognitive_load: analyzedState.cognitiveLoad,
          strong_topics: analyzedState.masteredConcepts,
          weak_topics: analyzedState.weakConcepts,
          optimal_pace: analyzedState.optimalPace,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cogProfile.id);
    }

    // Handle escalation if needed
    if (decision.shouldEscalateToHuman) {
      await supabase.from("session_handoffs").insert({
        session_id: data.session_id,
        institution_id: session.institution_id,
        requested_by: "ai_teacher",
        reason: decision.escalateReason || "Student needs human assistance",
        urgency: "high",
        status: "pending",
        handoff_context_json: {
          emotionState: analyzedState.emotionState,
          understandingScore: analyzedState.understandingScore,
          lastMessage: data.message,
          lastResponse: decision.spokenText,
        },
      });
    }

    return {
      teacherResponse: decision.spokenText,
      messageId: teacherMsg?.id,
      boardUpdate: decision.boardUpdate,
      questionToAsk: decision.questionToAsk,
      waitForStudent: decision.waitForStudentResponse,
      nextStep: decision.nextStepSuggested,
      shouldEscalate: decision.shouldEscalateToHuman,
      escalateReason: decision.escalateReason,
      cognitiveState: {
        emotionState: analyzedState.emotionState,
        understandingScore: analyzedState.understandingScore,
        cognitiveLoad: analyzedState.cognitiveLoad,
      },
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 3. Generate Practice Problem
// ─────────────────────────────────────────────────────────────────────────────

const GeneratePracticeSchema = z.object({
  session_id: z.string().uuid(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const generatePracticeProblem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => GeneratePracticeSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;
    const engine = getAutonomousTeachingEngine();

    // Get session info
    const { data: session } = await supabase
      .from("classroom_sessions")
      .select("id, lesson_id")
      .eq("id", data.session_id)
      .single();

    if (!session) throw new Error("Session not found");

    // Get lesson
    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, title, objective")
      .eq("id", session.lesson_id)
      .single();

    // Get cognitive state
    const { data: cogProfile } = await supabase
      .from("student_cognitive_profiles")
      .select("*")
      .eq("student_id", context.userId)
      .maybeSingle();

    const cognitiveState: CognitiveState = cogProfile
      ? {
          emotionState: cogProfile.last_emotion_state,
          understandingScore: Number(cogProfile.avg_engagement_score),
          masteredConcepts: cogProfile.strong_topics || [],
          weakConcepts: cogProfile.weak_topics || [],
          preferredStyle: cogProfile.preferred_learning_style as
            | "visual"
            | "auditory"
            | "kinesthetic"
            | "reading",
          optimalPace: Number(cogProfile.optimal_pace),
          streakCount: 0,
          idleSeconds: 0,
          cognitiveLoad: Number(cogProfile.current_cognitive_load),
        }
      : createInitialCognitiveState();

    const context_: TeachingContext = {
      lessonId: session.lesson_id,
      lessonTitle: lesson?.title || "Lesson",
      lessonObjective: lesson?.objective || "",
      currentStep: "practice",
      stepIndex: 4,
      totalSteps: 8,
      boardContent: [],
      topic: lesson?.title || "Learning",
      subject: "General",
    };

    const practice = await engine.generatePracticeProblem(
      context_,
      cognitiveState,
      data.difficulty,
    );

    return practice;
  });

// ─────────────────────────────────────────────────────────────────────────────
// 4. Evaluate Student Answer
// ─────────────────────────────────────────────────────────────────────────────

const EvaluateAnswerSchema = z.object({
  session_id: z.string().uuid(),
  problem: z.string().min(1),
  expected_answer: z.string().min(1),
  student_answer: z.string().min(1),
});

export const evaluateStudentAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => EvaluateAnswerSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;
    const engine = getAutonomousTeachingEngine();

    // Get cognitive state
    const { data: cogProfile } = await supabase
      .from("student_cognitive_profiles")
      .select("*")
      .eq("student_id", context.userId)
      .maybeSingle();

    const cognitiveState: CognitiveState = cogProfile
      ? {
          emotionState: cogProfile.last_emotion_state,
          understandingScore: Number(cogProfile.avg_engagement_score),
          masteredConcepts: cogProfile.strong_topics || [],
          weakConcepts: cogProfile.weak_topics || [],
          preferredStyle: cogProfile.preferred_learning_style as
            | "visual"
            | "auditory"
            | "kinesthetic"
            | "reading",
          optimalPace: Number(cogProfile.optimal_pace),
          streakCount: 0,
          idleSeconds: 0,
          cognitiveLoad: Number(cogProfile.current_cognitive_load),
        }
      : createInitialCognitiveState();

    // Get session for context
    const { data: session } = await supabase
      .from("classroom_sessions")
      .select("id, lesson_id, institution_id, course_id")
      .eq("id", data.session_id)
      .single();

    const { data: lesson } = await supabase
      .from("lessons")
      .select("title, objective")
      .eq("id", session?.lesson_id)
      .single();

    const teachingContext: TeachingContext = {
      lessonId: session?.lesson_id || "",
      lessonTitle: lesson?.title || "",
      lessonObjective: lesson?.objective || "",
      currentStep: "practice",
      stepIndex: 4,
      totalSteps: 8,
      boardContent: [],
      topic: lesson?.title || "Learning",
      subject: "General",
    };

    const evaluation = await engine.evaluateStudentAnswer(
      teachingContext,
      data.problem,
      data.expected_answer,
      data.student_answer,
      cognitiveState,
    );

    // Update topic mastery if we can identify the topic
    if (lesson?.title) {
      const { data: existingMastery } = await supabase
        .from("topic_mastery")
        .select("*")
        .eq("student_id", context.userId)
        .eq("topic_name", lesson.title)
        .maybeSingle();

      if (existingMastery) {
        await supabase
          .from("topic_mastery")
          .update({
            times_practiced: existingMastery.times_practiced + 1,
            times_correct: existingMastery.times_correct + (evaluation.isCorrect ? 1 : 0),
            times_incorrect: existingMastery.times_incorrect + (evaluation.isCorrect ? 0 : 1),
            mastery_score: evaluation.isCorrect
              ? Math.min(1, Number(existingMastery.mastery_score) + 0.1)
              : Math.max(0, Number(existingMastery.mastery_score) - 0.05),
            last_presented_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingMastery.id);
      } else if (session?.institution_id) {
        await supabase.from("topic_mastery").insert({
          institution_id: session.institution_id,
          student_id: context.userId,
          course_id: session.course_id,
          topic_name: lesson.title,
          times_presented: 1,
          times_practiced: 1,
          times_correct: evaluation.isCorrect ? 1 : 0,
          times_incorrect: evaluation.isCorrect ? 0 : 1,
          mastery_score: evaluation.isCorrect ? 0.6 : 0.45,
          last_presented_at: new Date().toISOString(),
        });
      }
    }

    return evaluation;
  });

// ─────────────────────────────────────────────────────────────────────────────
// 5. Request Human Teacher Handoff
// ─────────────────────────────────────────────────────────────────────────────

const RequestHandoffSchema = z.object({
  session_id: z.string().uuid(),
  reason: z.string().min(1).max(500),
  urgency: z.enum(["low", "normal", "high", "critical"]).default("normal"),
});

export const requestTeacherHandoff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => RequestHandoffSchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;

    // Get session info
    const { data: session } = await supabase
      .from("classroom_sessions")
      .select("id, institution_id, lesson_id, status")
      .eq("id", data.session_id)
      .single();

    if (!session) throw new Error("Session not found");

    // Create handoff request
    const { data: handoff, error } = await supabase
      .from("session_handoffs")
      .insert({
        session_id: data.session_id,
        institution_id: session.institution_id,
        requested_by: "student",
        reason: data.reason,
        urgency: data.urgency,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    // Try to auto-assign to an available teacher
    const { data: availableTeachers } = await supabase
      .from("teacher_availability")
      .select("id, teacher_id, current_session_count, max_concurrent_sessions")
      .eq("institution_id", session.institution_id)
      .eq("is_online", true)
      .eq("is_available_for_handoff", true)
      .lt("current_session_count", 5);

    if (availableTeachers && availableTeachers.length > 0) {
      // Find teacher with lowest load
      const bestTeacher = availableTeachers.sort(
        (a: any, b: any) => a.current_session_count - b.current_session_count,
      )[0];

      if (bestTeacher && bestTeacher.current_session_count < bestTeacher.max_concurrent_sessions) {
        await supabase
          .from("session_handoffs")
          .update({
            assigned_teacher_id: bestTeacher.teacher_id,
            assigned_at: new Date().toISOString(),
            status: "assigned",
          })
          .eq("id", handoff.id);

        return {
          handoffId: handoff.id,
          status: "assigned",
          message: "A teacher has been notified and will join shortly.",
        };
      }
    }

    return {
      handoffId: handoff.id,
      status: "pending",
      message:
        "Your request has been submitted. A teacher will join as soon as one becomes available.",
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 6. Update Teacher Availability
// ─────────────────────────────────────────────────────────────────────────────

const UpdateAvailabilitySchema = z.object({
  is_online: z.boolean().optional(),
  is_available_for_handoff: z.boolean().optional(),
  max_concurrent_sessions: z.number().int().min(1).max(20).optional(),
});

export const updateTeacherAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => UpdateAvailabilitySchema.parse(data))
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;

    // Get institution
    const { data: membership } = await supabase
      .from("institution_members")
      .select("institution_id")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .maybeSingle();

    if (!membership) throw new Error("No institution membership found");

    // Check if user is a teacher
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", context.userId)
      .maybeSingle();

    if (profile?.role !== "teacher" && profile?.role !== "admin" && profile?.role !== "owner") {
      throw new Error("Only teachers can update availability");
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.is_online !== undefined) {
      updates.is_online = data.is_online;
      if (data.is_online) {
        updates.online_since = new Date().toISOString();
      }
    }

    if (data.is_available_for_handoff !== undefined) {
      updates.is_available_for_handoff = data.is_available_for_handoff;
    }

    if (data.max_concurrent_sessions !== undefined) {
      updates.max_concurrent_sessions = data.max_concurrent_sessions;
    }

    updates.last_heartbeat_at = new Date().toISOString();

    // Upsert availability
    const { error } = await supabase.from("teacher_availability").upsert(
      {
        institution_id: membership.institution_id,
        teacher_id: context.userId,
        ...updates,
      },
      { onConflict: "teacher_id" },
    );

    if (error) throw new Error(error.message);

    return { ok: true };
  });

// ─────────────────────────────────────────────────────────────────────────────
// 7. Accept Handoff (for teachers)
// ─────────────────────────────────────────────────────────────────────────────

export const acceptHandoff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { handoff_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const supabase = context.supabase;

    // Get handoff
    const { data: handoff } = await supabase
      .from("session_handoffs")
      .select("id, session_id, status, assigned_teacher_id")
      .eq("id", data.handoff_id)
      .single();

    if (!handoff) throw new Error("Handoff not found");
    if (handoff.assigned_teacher_id !== context.userId) {
      throw new Error("This handoff is not assigned to you");
    }

    // Accept handoff
    await supabase
      .from("session_handoffs")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", data.handoff_id);

    // Update session to human mode
    await supabase
      .from("classroom_sessions")
      .update({ mode: "human_teacher" })
      .eq("id", handoff.session_id);

    return { ok: true, sessionId: handoff.session_id };
  });
