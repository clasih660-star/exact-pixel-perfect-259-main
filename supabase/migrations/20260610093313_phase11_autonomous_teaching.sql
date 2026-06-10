-- Phase 11: Autonomous Teaching Infrastructure
-- Creates tables for persistent cognitive models, mastery tracking, and teaching sessions

-- Student Cognitive Profile (persistent learning model)

CREATE TABLE public.student_cognitive_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,

  -- Emotional/engagement state
  last_emotion_state text NOT NULL DEFAULT 'curious',
  avg_engagement_score numeric(3,2) NOT NULL DEFAULT 0.50,

  -- Learning preferences (auto-detected)
  preferred_learning_style text NOT NULL DEFAULT 'visual' CHECK (preferred_learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading')),
  optimal_pace numeric(3,2) NOT NULL DEFAULT 1.00 CHECK (optimal_pace >= 0.5 AND optimal_pace <= 2.0),

  -- Cognitive load baseline
  baseline_cognitive_load numeric(3,2) NOT NULL DEFAULT 0.30,
  current_cognitive_load numeric(3,2) NOT NULL DEFAULT 0.30,

  -- Mastery tracking
  total_lessons_completed int NOT NULL DEFAULT 0,
  total_time_spent_minutes int NOT NULL DEFAULT 0,
  avg_session_duration_minutes numeric(6,2),

  -- Strengths and weaknesses (JSON arrays)
  strong_topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  weak_topics jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Learning patterns
  best_time_of_day text,
  typical_session_length_minutes int,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(student_id, course_id)
);

GRANT SELECT, INSERT, UPDATE ON public.student_cognitive_profiles TO authenticated;
GRANT ALL ON public.student_cognitive_profiles TO service_role;
ALTER TABLE public.student_cognitive_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cognitive_profiles_read_own" ON public.student_cognitive_profiles FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

CREATE POLICY "cognitive_profiles_insert_own" ON public.student_cognitive_profiles FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "cognitive_profiles_update_own" ON public.student_cognitive_profiles FOR UPDATE TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Mastery Records (per-topic tracking)

CREATE TABLE public.topic_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,

  topic_name text NOT NULL,
  topic_category text,

  mastery_level text NOT NULL DEFAULT 'novice' CHECK (mastery_level IN ('novice', 'learning', 'practicing', 'proficient', 'mastered')),
  mastery_score numeric(4,3) NOT NULL DEFAULT 0.0 CHECK (mastery_score >= 0 AND mastery_score <= 1),

  times_presented int NOT NULL DEFAULT 0,
  times_practiced int NOT NULL DEFAULT 0,
  times_correct int NOT NULL DEFAULT 0,
  times_incorrect int NOT NULL DEFAULT 0,

  last_presented_at timestamptz,
  last_mastered_at timestamptz,

  estimated_retention numeric(4,3) DEFAULT 1.0,
  next_review_due timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_topic_mastery_unique ON public.topic_mastery(student_id, topic_name, course_id);

GRANT SELECT, INSERT, UPDATE ON public.topic_mastery TO authenticated;
GRANT ALL ON public.topic_mastery TO service_role;
ALTER TABLE public.topic_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topic_mastery_read_own" ON public.topic_mastery FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

CREATE POLICY "topic_mastery_write_own" ON public.topic_mastery FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "topic_mastery_update_own" ON public.topic_mastery FOR UPDATE TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- AI Teaching Decisions Log

CREATE TABLE public.ai_teaching_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  current_step text NOT NULL,

  emotion_state text NOT NULL,
  understanding_score numeric(3,2) NOT NULL,
  cognitive_load numeric(3,2) NOT NULL,
  streak_count int NOT NULL DEFAULT 0,

  teaching_strategy text NOT NULL,
  ai_reasoning text,
  spoken_text text NOT NULL,
  board_update_json jsonb,
  question_asked text,
  waited_for_student boolean NOT NULL DEFAULT false,
  encouragement_level text NOT NULL DEFAULT 'medium',

  should_escalate boolean NOT NULL DEFAULT false,
  escalate_reason text,
  was_escalated_to_human boolean NOT NULL DEFAULT false,

  response_generation_ms int,
  model_used text,
  fallback_used boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.ai_teaching_decisions TO authenticated;
GRANT ALL ON public.ai_teaching_decisions TO service_role;
ALTER TABLE public.ai_teaching_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_decisions_read_institution" ON public.ai_teaching_decisions FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

CREATE POLICY "ai_decisions_insert_system" ON public.ai_teaching_decisions FOR INSERT TO authenticated
WITH CHECK (true);

-- Teacher Availability & Handoff

CREATE TABLE public.teacher_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  is_online boolean NOT NULL DEFAULT false,
  is_available_for_handoff boolean NOT NULL DEFAULT false,
  current_session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,

  max_concurrent_sessions int NOT NULL DEFAULT 5,
  current_session_count int NOT NULL DEFAULT 0,

  can_teach_subjects jsonb NOT NULL DEFAULT '[]'::jsonb,

  last_heartbeat_at timestamptz,
  online_since timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.teacher_availability TO authenticated;
GRANT ALL ON public.teacher_availability TO service_role;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_availability_read" ON public.teacher_availability FOR SELECT TO authenticated
USING (
  teacher_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
);

CREATE POLICY "teacher_availability_write_own" ON public.teacher_availability FOR INSERT TO authenticated
WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "teacher_availability_update_own" ON public.teacher_availability FOR UPDATE TO authenticated
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- Session Handoff Requests

CREATE TABLE public.session_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,

  requested_by text NOT NULL CHECK (requested_by IN ('ai_teacher', 'student', 'system')),
  reason text NOT NULL,
  urgency text NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'critical')),

  assigned_teacher_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at timestamptz,

  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'accepted', 'rejected', 'completed', 'cancelled')),

  handoff_context_json jsonb NOT NULL DEFAULT '{}'::jsonb,

  accepted_at timestamptz,
  completed_at timestamptz,
  resolution_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.session_handoffs TO authenticated;
GRANT ALL ON public.session_handoffs TO service_role;
ALTER TABLE public.session_handoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "handoffs_read_institution" ON public.session_handoffs FOR SELECT TO authenticated
USING (
  assigned_teacher_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

CREATE POLICY "handoffs_insert" ON public.session_handoffs FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "handoffs_update" ON public.session_handoffs FOR UPDATE TO authenticated
USING (
  assigned_teacher_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

-- Indexes

CREATE INDEX idx_cognitive_profiles_student ON public.student_cognitive_profiles(student_id);
CREATE INDEX idx_topic_mastery_student ON public.topic_mastery(student_id);
CREATE INDEX idx_ai_decisions_session ON public.ai_teaching_decisions(session_id, created_at DESC);
CREATE INDEX idx_teacher_avail_institution ON public.teacher_availability(institution_id, is_available_for_handoff);
CREATE INDEX idx_handoffs_pending ON public.session_handoffs(institution_id, status) WHERE status IN ('pending', 'assigned');

-- Triggers

CREATE TRIGGER cognitive_profiles_updated BEFORE UPDATE ON public.student_cognitive_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER topic_mastery_updated BEFORE UPDATE ON public.topic_mastery
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER teacher_availability_updated BEFORE UPDATE ON public.teacher_availability
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER handoffs_updated BEFORE UPDATE ON public.session_handoffs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();