-- Phase 1: canonical classroom data model foundation
-- Existing core tables already in place:
-- institutions, courses, lessons, course_enrollments, classroom_sessions,
-- session_participants, chat_messages, lesson_progress, quiz_results,
-- lesson_summaries, learner_access_profiles.
-- This migration adds the missing event/history tables needed for replay,
-- summary generation, recommendations, and notifications.

CREATE TABLE public.session_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role text NOT NULL CHECK (actor_role IN ('student', 'teacher', 'ai_teacher', 'system')),
  event_type text NOT NULL,
  event_source text,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_events TO authenticated;
GRANT ALL ON public.session_events TO service_role;
ALTER TABLE public.session_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.board_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  source_event_id uuid REFERENCES public.session_events(id) ON DELETE SET NULL,
  step_key text,
  mode text NOT NULL DEFAULT 'lesson',
  title text NOT NULL,
  lines_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text,
  active_line_index int NOT NULL DEFAULT 0,
  highlight text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.board_snapshots TO authenticated;
GRANT ALL ON public.board_snapshots TO service_role;
ALTER TABLE public.board_snapshots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.session_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Session Notes',
  body text NOT NULL DEFAULT '',
  notes_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_type text NOT NULL DEFAULT 'manual',
  is_board_export boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_notes TO authenticated;
GRANT ALL ON public.session_notes TO service_role;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  recommendation_type text NOT NULL,
  title text NOT NULL,
  description text,
  reason_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  target_url text,
  priority int NOT NULL DEFAULT 0,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  target_url text,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Canonical lesson content model already lives in public.lessons.lesson_data_json
-- No separate lesson_steps table is required for Phase 1.

CREATE POLICY "session_events read by members/enrolled" ON public.session_events FOR SELECT TO authenticated
USING (
  public.is_institution_member(institution_id, auth.uid())
  OR public.is_enrolled(course_id, auth.uid())
  OR student_id = auth.uid()
);
CREATE POLICY "session_events insert by member/enrolled" ON public.session_events FOR INSERT TO authenticated
WITH CHECK (
  public.is_institution_member(institution_id, auth.uid())
  OR public.is_enrolled(course_id, auth.uid())
  OR student_id = auth.uid()
);

CREATE POLICY "board_snapshots read by members/enrolled" ON public.board_snapshots FOR SELECT TO authenticated
USING (
  public.is_institution_member(institution_id, auth.uid())
  OR public.is_enrolled(course_id, auth.uid())
);
CREATE POLICY "board_snapshots insert by member/enrolled" ON public.board_snapshots FOR INSERT TO authenticated
WITH CHECK (
  public.is_institution_member(institution_id, auth.uid())
  OR public.is_enrolled(course_id, auth.uid())
);

CREATE POLICY "session_notes read self or staff" ON public.session_notes FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
  OR public.is_enrolled(course_id, auth.uid())
);
CREATE POLICY "session_notes insert self or staff" ON public.session_notes FOR INSERT TO authenticated
WITH CHECK (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);
CREATE POLICY "session_notes update self or staff" ON public.session_notes FOR UPDATE TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
)
WITH CHECK (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

CREATE POLICY "recommendations read self or staff" ON public.recommendations FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);
CREATE POLICY "recommendations write self or staff" ON public.recommendations FOR INSERT TO authenticated
WITH CHECK (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);
CREATE POLICY "recommendations update self or staff" ON public.recommendations FOR UPDATE TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
)
WITH CHECK (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

CREATE POLICY "notifications read own" ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());
CREATE POLICY "notifications write own or staff" ON public.notifications FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR (institution_id IS NOT NULL AND public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
);
CREATE POLICY "notifications update own" ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE TRIGGER session_notes_updated BEFORE UPDATE ON public.session_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER recommendations_updated BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER notifications_updated BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_session_events_session ON public.session_events(session_id, created_at DESC);
CREATE INDEX idx_session_events_student ON public.session_events(student_id, created_at DESC);
CREATE INDEX idx_board_snapshots_session ON public.board_snapshots(session_id, created_at DESC);
CREATE INDEX idx_session_notes_student ON public.session_notes(student_id, created_at DESC);
CREATE INDEX idx_session_notes_session ON public.session_notes(session_id, created_at DESC);
CREATE INDEX idx_recommendations_student ON public.recommendations(student_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read_at, created_at DESC);
