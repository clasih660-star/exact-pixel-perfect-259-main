
-- =============================================
-- courses
-- =============================================
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  subject text,
  level text,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(institution_id, slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'teacher',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, teacher_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_teachers TO authenticated;
GRANT ALL ON public.course_teachers TO service_role;
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','completed','removed')),
  enrolled_by uuid REFERENCES auth.users(id),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(course_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  difficulty text,
  duration_minutes int,
  order_index int NOT NULL DEFAULT 0,
  source_resource_id uuid REFERENCES public.classroom_resources(id) ON DELETE SET NULL,
  lesson_data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  accessibility_data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  questions_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_points int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.classroom_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  host_user_id uuid REFERENCES auth.users(id),
  mode text NOT NULL DEFAULT 'ai_teacher' CHECK (mode IN ('ai_teacher','human_teacher','hybrid')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','completed','cancelled')),
  scheduled_start_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_sessions TO authenticated;
GRANT ALL ON public.classroom_sessions TO service_role;
ALTER TABLE public.classroom_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('teacher','student','observer','ai_teacher')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  left_at timestamptz,
  UNIQUE(session_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_participants TO authenticated;
GRANT ALL ON public.session_participants TO service_role;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step text,
  progress_percentage int NOT NULL DEFAULT 0,
  confusion_score numeric NOT NULL DEFAULT 0,
  student_level text NOT NULL DEFAULT 'intermediate',
  teacher_state text NOT NULL DEFAULT 'idle',
  time_spent_minutes int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  sender text NOT NULL CHECK (sender IN ('student','teacher','ai_teacher','system')),
  message text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score numeric NOT NULL,
  percentage numeric NOT NULL,
  answers_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  feedback_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_results TO authenticated;
GRANT ALL ON public.quiz_results TO service_role;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lesson_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_text text NOT NULL,
  key_points_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  homework text,
  whiteboard_notes_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_summaries TO authenticated;
GRANT ALL ON public.lesson_summaries TO service_role;
ALTER TABLE public.lesson_summaries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.learner_access_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  accessibility_modes_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  captions_enabled boolean NOT NULL DEFAULT true,
  transcript_enabled boolean NOT NULL DEFAULT true,
  audio_enabled boolean NOT NULL DEFAULT true,
  board_descriptions_enabled boolean NOT NULL DEFAULT false,
  screen_reader_optimized boolean NOT NULL DEFAULT false,
  high_contrast boolean NOT NULL DEFAULT false,
  large_text boolean NOT NULL DEFAULT false,
  reduced_motion boolean NOT NULL DEFAULT false,
  keyboard_shortcuts_enabled boolean NOT NULL DEFAULT true,
  voice_input_enabled boolean NOT NULL DEFAULT true,
  speech_rate numeric NOT NULL DEFAULT 1.0,
  font_scale numeric NOT NULL DEFAULT 1.0,
  lesson_pace text NOT NULL DEFAULT 'normal',
  explanation_style text NOT NULL DEFAULT 'standard',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, institution_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_access_profiles TO authenticated;
GRANT ALL ON public.learner_access_profiles TO service_role;
ALTER TABLE public.learner_access_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Helper functions (now that tables exist)
-- =============================================
CREATE OR REPLACE FUNCTION public.is_course_teacher(_course_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.course_teachers WHERE course_id = _course_id AND teacher_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled(_course_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.course_enrollments WHERE course_id = _course_id AND student_id = _user_id AND status = 'active');
$$;

CREATE OR REPLACE FUNCTION public.course_institution(_course_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT institution_id FROM public.courses WHERE id = _course_id;
$$;

CREATE OR REPLACE FUNCTION public.session_course(_session_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT course_id FROM public.classroom_sessions WHERE id = _session_id;
$$;

-- =============================================
-- Policies
-- =============================================
CREATE POLICY "course read by members or enrolled" ON public.courses FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(id, auth.uid()));
CREATE POLICY "course manage by admins" ON public.courses FOR ALL TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));

CREATE POLICY "course_teachers read by institution" ON public.course_teachers FOR SELECT TO authenticated
USING (public.is_institution_member(public.course_institution(course_id), auth.uid()));
CREATE POLICY "course_teachers manage by admins" ON public.course_teachers FOR ALL TO authenticated
USING (public.has_institution_role(public.course_institution(course_id), auth.uid(), ARRAY['owner','admin']::member_role[]))
WITH CHECK (public.has_institution_role(public.course_institution(course_id), auth.uid(), ARRAY['owner','admin']::member_role[]));

CREATE POLICY "enrollment read self or admin" ON public.course_enrollments FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);
CREATE POLICY "enrollment manage by admin" ON public.course_enrollments FOR ALL TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));

CREATE POLICY "lesson read by members or enrolled" ON public.lessons FOR SELECT TO authenticated
USING (
  public.is_institution_member(institution_id, auth.uid())
  OR (status = 'published' AND public.is_enrolled(course_id, auth.uid()))
);
CREATE POLICY "lesson manage by admin or teacher" ON public.lessons FOR ALL TO authenticated
USING (
  public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
)
WITH CHECK (
  public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
);

CREATE POLICY "quiz read by members or enrolled" ON public.quizzes FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
CREATE POLICY "quiz manage by admin/teacher" ON public.quizzes FOR ALL TO authenticated
USING (
  public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
)
WITH CHECK (
  public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
);

CREATE POLICY "session read by members or enrolled" ON public.classroom_sessions FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
CREATE POLICY "session insert by admin/teacher/enrolled" ON public.classroom_sessions FOR INSERT TO authenticated
WITH CHECK (
  public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
  OR public.is_enrolled(course_id, auth.uid())
);
CREATE POLICY "session update by admin/teacher/host" ON public.classroom_sessions FOR UPDATE TO authenticated
USING (
  public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
  OR host_user_id = auth.uid()
);
CREATE POLICY "session delete by admin" ON public.classroom_sessions FOR DELETE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));

CREATE POLICY "participants read by enrolled/member" ON public.session_participants FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_enrolled(public.session_course(session_id), auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.classroom_sessions s
    WHERE s.id = session_id AND public.is_institution_member(s.institution_id, auth.uid())
  )
);
CREATE POLICY "participants insert self or admin" ON public.session_participants FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.classroom_sessions s
    WHERE s.id = session_id
      AND public.has_institution_role(s.institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  )
);

CREATE POLICY "progress self or admin/teacher" ON public.lesson_progress FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
);
CREATE POLICY "progress insert self" ON public.lesson_progress FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());
CREATE POLICY "progress update self" ON public.lesson_progress FOR UPDATE TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "chat read by members/enrolled" ON public.chat_messages FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
CREATE POLICY "chat insert by member/enrolled" ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));

CREATE POLICY "quiz_results read self or admin/teacher" ON public.quiz_results FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
);
CREATE POLICY "quiz_results insert self" ON public.quiz_results FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "summary read self or admin/teacher" ON public.lesson_summaries FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[])
  OR public.is_course_teacher(course_id, auth.uid())
);
CREATE POLICY "summary insert self" ON public.lesson_summaries FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "lap self" ON public.learner_access_profiles FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Triggers
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER lessons_updated BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER quizzes_updated BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sessions_updated BEFORE UPDATE ON public.classroom_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER progress_updated BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER lap_updated BEFORE UPDATE ON public.learner_access_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX idx_courses_institution ON public.courses(institution_id);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_sessions_lesson ON public.classroom_sessions(lesson_id);
CREATE INDEX idx_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_chat_session ON public.chat_messages(session_id);
