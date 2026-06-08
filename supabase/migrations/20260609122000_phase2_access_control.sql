-- Phase 2: Access control, session safety constraints, and helper functions

-- =============================================================================
-- 1. Session safety: prevent duplicate live sessions for the same student/lesson
-- =============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_classroom_sessions_live_student_lesson
  ON public.classroom_sessions (host_user_id, lesson_id)
  WHERE status = 'live';

-- =============================================================================
-- 2. Prevent duplicate "start lesson" events within short window
-- =============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_events_start_lesson_dedup
  ON public.session_events (session_id, event_type, actor_user_id)
  WHERE event_type = 'session_started';

-- =============================================================================
-- 3. Helper function: check if a user is a participant in a session
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_session_participant(
  p_session_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.session_participants
    WHERE session_id = p_session_id AND user_id = p_user_id
  )
  OR EXISTS (
    SELECT 1 FROM public.classroom_sessions
    WHERE id = p_session_id AND host_user_id = p_user_id
  );
$$;

-- =============================================================================
-- 4. Helper function: get the institution_id for a user's active membership
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_user_institution_id(
  p_user_id uuid
)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT institution_id FROM public.institution_members
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY created_at ASC
  LIMIT 1;
$$;

-- =============================================================================
-- 5. RLS policies for classroom_sessions
-- =============================================================================
ALTER TABLE public.classroom_sessions ENABLE ROW LEVEL SECURITY;

-- Students can see their own sessions (as host or participant)
CREATE POLICY "classroom_sessions read own" ON public.classroom_sessions
  FOR SELECT TO authenticated
  USING (
    host_user_id = auth.uid()
    OR public.is_session_participant(id, auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = classroom_sessions.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

-- Students can create sessions for their enrolled courses
CREATE POLICY "classroom_sessions insert enrolled" ON public.classroom_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    host_user_id = auth.uid()
    AND (
      public.is_enrolled(course_id, auth.uid())
      OR public.is_institution_member(institution_id, auth.uid())
    )
  );

-- Only host or staff can update sessions
CREATE POLICY "classroom_sessions update host_or_staff" ON public.classroom_sessions
  FOR UPDATE TO authenticated
  USING (
    host_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = classroom_sessions.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  )
  WITH CHECK (
    host_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = classroom_sessions.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

-- =============================================================================
-- 6. RLS policies for chat_messages
-- =============================================================================
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages read session_participant" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    public.is_session_participant(session_id, auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = chat_messages.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

CREATE POLICY "chat_messages insert session_participant" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_session_participant(session_id, auth.uid())
    OR user_id = auth.uid()
  );

-- =============================================================================
-- 7. RLS policies for lesson_progress
-- =============================================================================
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_progress read own_or_staff" ON public.lesson_progress
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = lesson_progress.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

CREATE POLICY "lesson_progress insert own" ON public.lesson_progress
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "lesson_progress update own" ON public.lesson_progress
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- =============================================================================
-- 8. RLS policies for quiz_results
-- =============================================================================
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_results read own_or_staff" ON public.quiz_results
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = quiz_results.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

CREATE POLICY "quiz_results insert own" ON public.quiz_results
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "quiz_results update own" ON public.quiz_results
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- =============================================================================
-- 9. RLS policies for lesson_summaries
-- =============================================================================
ALTER TABLE public.lesson_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_summaries read own_or_staff" ON public.lesson_summaries
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = lesson_summaries.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

CREATE POLICY "lesson_summaries insert own" ON public.lesson_summaries
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "lesson_summaries update own_or_staff" ON public.lesson_summaries
  FOR UPDATE TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_members
      WHERE user_id = auth.uid()
      AND institution_id = lesson_summaries.institution_id
      AND status = 'active'
      AND role IN ('owner', 'admin', 'teacher')
    )
  );

-- =============================================================================
-- 10. Indexes for performance
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_host ON public.classroom_sessions(host_user_id, status);
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_status ON public.classroom_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON public.quiz_results(student_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_summaries_student ON public.lesson_summaries(student_id, lesson_id);