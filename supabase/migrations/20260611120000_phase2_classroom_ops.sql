-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 2: Classroom operations foundation
--
-- Turns the AI-teacher classroom into an institution-ready learning environment:
-- classroom settings & permissions, a multi-learner question queue, live/hybrid
-- participant state, attendance, polls, assignments (+submissions/feedback), and
-- scheduling (calendar events).
--
-- This migration is ADDITIVE and idempotent. It builds on the Phase 1/9/11
-- schema and reuses the existing conventions:
--   helpers  : public.is_institution_member / public.is_enrolled /
--              public.has_institution_role / public.is_session_participant
--   roles    : public.member_role ('owner','admin','teacher','student')
--   trigger  : public.set_updated_at()
--   user FKs : auth.users(id)
--   grants   : authenticated (CRUD) + service_role (ALL); RLS enabled per table.
--
-- It intentionally does NOT add recording/screen-share/WebRTC tables yet — those
-- come in a later increment once participant/session basics are stable (see the
-- Phase 2 build order).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Extend the live participant model (reuse existing session_participants,
--    which public.is_session_participant already references).
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.session_participants
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'joined',
  ADD COLUMN IF NOT EXISTS mic_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS camera_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS hand_raised boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS left_at timestamptz,
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Classroom settings  (per institution, optional per-course override)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.classroom_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  classroom_mode text NOT NULL DEFAULT 'ai_teacher'
    CHECK (classroom_mode IN ('ai_teacher','human_live','hybrid')),
  default_stage_mode text NOT NULL DEFAULT 'whiteboard',
  enable_ai_teacher boolean NOT NULL DEFAULT true,
  enable_human_video boolean NOT NULL DEFAULT false,
  enable_learner_camera boolean NOT NULL DEFAULT false,
  enable_learner_mic boolean NOT NULL DEFAULT false,
  enable_chat boolean NOT NULL DEFAULT true,
  enable_private_questions boolean NOT NULL DEFAULT true,
  enable_raise_hand boolean NOT NULL DEFAULT true,
  enable_captions boolean NOT NULL DEFAULT true,
  enable_transcript boolean NOT NULL DEFAULT true,
  enable_notes boolean NOT NULL DEFAULT true,
  enable_screen_sharing boolean NOT NULL DEFAULT false,
  enable_recording boolean NOT NULL DEFAULT false,
  enable_polls boolean NOT NULL DEFAULT true,
  enable_assignments boolean NOT NULL DEFAULT true,
  enable_attendance boolean NOT NULL DEFAULT true,
  enable_replay boolean NOT NULL DEFAULT true,
  -- AI teacher behaviour + free-form overrides
  ai_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (institution_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_settings TO authenticated;
GRANT ALL ON public.classroom_settings TO service_role;
ALTER TABLE public.classroom_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "classroom_settings read members" ON public.classroom_settings;
CREATE POLICY "classroom_settings read members" ON public.classroom_settings FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()));

DROP POLICY IF EXISTS "classroom_settings manage staff" ON public.classroom_settings;
CREATE POLICY "classroom_settings manage staff" ON public.classroom_settings FOR ALL TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));

DROP TRIGGER IF EXISTS classroom_settings_updated ON public.classroom_settings;
CREATE TRIGGER classroom_settings_updated BEFORE UPDATE ON public.classroom_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Question queue  (multi-learner, AI/human routable)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.classroom_question_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  learner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_name text,
  question_text text NOT NULL,
  reason text,
  visibility text NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public','private','anonymous')),
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','answered_by_ai','answered_by_teacher','needs_clarification','saved_to_notes','dismissed','speaking','resolved')),
  ai_suggested_answer text,
  answer_text text,
  answered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  save_to_transcript boolean NOT NULL DEFAULT true,
  queue_position int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_question_queue_session ON public.classroom_question_queue(session_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_question_queue TO authenticated;
GRANT ALL ON public.classroom_question_queue TO service_role;
ALTER TABLE public.classroom_question_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "question_queue read participants/staff" ON public.classroom_question_queue;
CREATE POLICY "question_queue read participants/staff" ON public.classroom_question_queue FOR SELECT TO authenticated
USING (
  learner_id = auth.uid()
  OR public.is_session_participant(session_id, auth.uid())
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "question_queue insert learner/participant" ON public.classroom_question_queue;
CREATE POLICY "question_queue insert learner/participant" ON public.classroom_question_queue FOR INSERT TO authenticated
WITH CHECK (
  learner_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "question_queue update staff/owner" ON public.classroom_question_queue;
CREATE POLICY "question_queue update staff/owner" ON public.classroom_question_queue FOR UPDATE TO authenticated
USING (
  learner_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
)
WITH CHECK (
  learner_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP TRIGGER IF EXISTS question_queue_updated ON public.classroom_question_queue;
CREATE TRIGGER question_queue_updated BEFORE UPDATE ON public.classroom_question_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Attendance  (live/hybrid sessions)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.classroom_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'present'
    CHECK (status IN ('present','late','left_early','absent','partial','excused')),
  joined_at timestamptz,
  left_at timestamptz,
  total_minutes int NOT NULL DEFAULT 0,
  late_join boolean NOT NULL DEFAULT false,
  early_leave boolean NOT NULL DEFAULT false,
  rejoin_count int NOT NULL DEFAULT 0,
  questions_asked int NOT NULL DEFAULT 0,
  assignments_submitted int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_attendance TO authenticated;
GRANT ALL ON public.classroom_attendance TO service_role;
ALTER TABLE public.classroom_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attendance read self/staff" ON public.classroom_attendance;
CREATE POLICY "attendance read self/staff" ON public.classroom_attendance FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "attendance upsert self/staff" ON public.classroom_attendance;
CREATE POLICY "attendance upsert self/staff" ON public.classroom_attendance FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "attendance update self/staff" ON public.classroom_attendance;
CREATE POLICY "attendance update self/staff" ON public.classroom_attendance FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
)
WITH CHECK (
  user_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP TRIGGER IF EXISTS attendance_updated ON public.classroom_attendance;
CREATE TRIGGER attendance_updated BEFORE UPDATE ON public.classroom_attendance
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Polls + responses  (live/hybrid quick checks)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.classroom_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'multiple_choice'
    CHECK (type IN ('multiple_choice','true_false','yes_no','confidence','short_answer','rating')),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','launched','closed')),
  results_visible boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_polls_session ON public.classroom_polls(session_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_polls TO authenticated;
GRANT ALL ON public.classroom_polls TO service_role;
ALTER TABLE public.classroom_polls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "polls read participants/staff" ON public.classroom_polls;
CREATE POLICY "polls read participants/staff" ON public.classroom_polls FOR SELECT TO authenticated
USING (
  public.is_session_participant(session_id, auth.uid())
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "polls manage staff" ON public.classroom_polls;
CREATE POLICY "polls manage staff" ON public.classroom_polls FOR ALL TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

DROP TRIGGER IF EXISTS polls_updated ON public.classroom_polls;
CREATE TRIGGER polls_updated BEFORE UPDATE ON public.classroom_polls
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.classroom_poll_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.classroom_polls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (poll_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_poll_responses TO authenticated;
GRANT ALL ON public.classroom_poll_responses TO service_role;
ALTER TABLE public.classroom_poll_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "poll_responses read own/staff" ON public.classroom_poll_responses;
CREATE POLICY "poll_responses read own/staff" ON public.classroom_poll_responses FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.classroom_polls p
    WHERE p.id = poll_id
      AND public.has_institution_role(p.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
  )
);

DROP POLICY IF EXISTS "poll_responses insert own" ON public.classroom_poll_responses;
CREATE POLICY "poll_responses insert own" ON public.classroom_poll_responses FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Assignments (+ resources, submissions, feedback) — learning-focused
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  programme_id uuid REFERENCES public.programmes(id) ON DELETE SET NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  instructions text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'practice'
    CHECK (type IN ('practice','reading','reflection','short_answer','file_upload','worksheet','coding','project')),
  submission_type text NOT NULL DEFAULT 'text'
    CHECK (submission_type IN ('text','file_upload','short_responses','worksheet','link','code')),
  due_at timestamptz,
  estimated_minutes int,
  -- Learning evidence, not grading: points are OFF by default.
  points_enabled boolean NOT NULL DEFAULT false,
  allow_late boolean NOT NULL DEFAULT true,
  ai_assistance_allowed boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','closed','archived')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON public.assignments(lesson_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Learners see published assignments for courses they're enrolled in; staff see all.
DROP POLICY IF EXISTS "assignments read enrolled/staff" ON public.assignments;
CREATE POLICY "assignments read enrolled/staff" ON public.assignments FOR SELECT TO authenticated
USING (
  (status = 'published' AND public.is_enrolled(course_id, auth.uid()))
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "assignments manage staff" ON public.assignments;
CREATE POLICY "assignments manage staff" ON public.assignments FOR ALL TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

DROP TRIGGER IF EXISTS assignments_updated ON public.assignments;
CREATE TRIGGER assignments_updated BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.assignment_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'link'
    CHECK (type IN ('link','file','pdf','image','document','reference')),
  url text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_resources TO authenticated;
GRANT ALL ON public.assignment_resources TO service_role;
ALTER TABLE public.assignment_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assignment_resources read via assignment" ON public.assignment_resources;
CREATE POLICY "assignment_resources read via assignment" ON public.assignment_resources FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.assignments a
  WHERE a.id = assignment_id
    AND ((a.status = 'published' AND public.is_enrolled(a.course_id, auth.uid()))
      OR public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
));

DROP POLICY IF EXISTS "assignment_resources manage staff" ON public.assignment_resources;
CREATE POLICY "assignment_resources manage staff" ON public.assignment_resources FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.assignments a
  WHERE a.id = assignment_id
    AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.assignments a
  WHERE a.id = assignment_id
    AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
));

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  learner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('not_started','in_progress','submitted','returned','needs_revision','completed','late')),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, learner_id)
);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.assignment_submissions(assignment_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_submissions TO authenticated;
GRANT ALL ON public.assignment_submissions TO service_role;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "submissions read own/staff" ON public.assignment_submissions;
CREATE POLICY "submissions read own/staff" ON public.assignment_submissions FOR SELECT TO authenticated
USING (
  learner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assignments a
    WHERE a.id = assignment_id
      AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
  )
);

DROP POLICY IF EXISTS "submissions insert own" ON public.assignment_submissions;
CREATE POLICY "submissions insert own" ON public.assignment_submissions FOR INSERT TO authenticated
WITH CHECK (learner_id = auth.uid());

DROP POLICY IF EXISTS "submissions update own/staff" ON public.assignment_submissions;
CREATE POLICY "submissions update own/staff" ON public.assignment_submissions FOR UPDATE TO authenticated
USING (
  learner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assignments a
    WHERE a.id = assignment_id
      AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
  )
)
WITH CHECK (
  learner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assignments a
    WHERE a.id = assignment_id
      AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
  )
);

DROP TRIGGER IF EXISTS submissions_updated ON public.assignment_submissions;
CREATE TRIGGER submissions_updated BEFORE UPDATE ON public.assignment_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.assignment_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.assignment_submissions(id) ON DELETE CASCADE,
  author_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  decision text NOT NULL DEFAULT 'comment'
    CHECK (decision IN ('comment','reviewed','needs_revision','completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_feedback TO authenticated;
GRANT ALL ON public.assignment_feedback TO service_role;
ALTER TABLE public.assignment_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedback read learner/staff" ON public.assignment_feedback;
CREATE POLICY "feedback read learner/staff" ON public.assignment_feedback FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.assignment_submissions s
  JOIN public.assignments a ON a.id = s.assignment_id
  WHERE s.id = submission_id
    AND (s.learner_id = auth.uid()
      OR public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
));

DROP POLICY IF EXISTS "feedback manage staff" ON public.assignment_feedback;
CREATE POLICY "feedback manage staff" ON public.assignment_feedback FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.assignment_submissions s
  JOIN public.assignments a ON a.id = s.assignment_id
  WHERE s.id = submission_id
    AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.assignment_submissions s
  JOIN public.assignments a ON a.id = s.assignment_id
  WHERE s.id = submission_id
    AND public.has_institution_role(a.institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
));

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Calendar events  (scheduling for AI lessons, live/hybrid sessions, due dates)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  assignment_id uuid REFERENCES public.assignments(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'live_session'
    CHECK (type IN ('ai_lesson','live_session','hybrid_session','assignment_due','teacher_review','institution_event')),
  title text NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_calendar_institution ON public.calendar_events(institution_id, start_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT ALL ON public.calendar_events TO service_role;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calendar read members" ON public.calendar_events;
CREATE POLICY "calendar read members" ON public.calendar_events FOR SELECT TO authenticated
USING (
  public.is_institution_member(institution_id, auth.uid())
  OR (course_id IS NOT NULL AND public.is_enrolled(course_id, auth.uid()))
);

DROP POLICY IF EXISTS "calendar manage staff" ON public.calendar_events;
CREATE POLICY "calendar manage staff" ON public.calendar_events FOR ALL TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

DROP TRIGGER IF EXISTS calendar_updated ON public.calendar_events;
CREATE TRIGGER calendar_updated BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
