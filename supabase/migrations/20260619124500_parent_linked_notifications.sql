-- Parent-linked learner notifications.
-- Adds the relationship table needed for parent accounts to receive real,
-- automated updates about learners they are allowed to monitor.

CREATE TABLE IF NOT EXISTS public.parent_learner_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL,
  relationship text NOT NULL DEFAULT 'guardian'
    CHECK (relationship IN ('parent', 'guardian', 'sponsor', 'caregiver', 'other')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'revoked')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(parent_user_id, learner_user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_learner_links TO authenticated;
GRANT ALL ON public.parent_learner_links TO service_role;
ALTER TABLE public.parent_learner_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "parent links read related or staff" ON public.parent_learner_links;
CREATE POLICY "parent links read related or staff"
  ON public.parent_learner_links FOR SELECT TO authenticated
  USING (
    parent_user_id = auth.uid()
    OR learner_user_id = auth.uid()
    OR (
      institution_id IS NOT NULL
      AND public.has_institution_role(
        institution_id,
        auth.uid(),
        ARRAY['owner','admin','teacher']::member_role[]
      )
    )
  );

DROP POLICY IF EXISTS "parent links insert self pending or staff" ON public.parent_learner_links;
CREATE POLICY "parent links insert self pending or staff"
  ON public.parent_learner_links FOR INSERT TO authenticated
  WITH CHECK (
    (parent_user_id = auth.uid() AND status = 'pending')
    OR (
      institution_id IS NOT NULL
      AND public.has_institution_role(
        institution_id,
        auth.uid(),
        ARRAY['owner','admin']::member_role[]
      )
    )
  );

DROP POLICY IF EXISTS "parent links update related or staff" ON public.parent_learner_links;
CREATE POLICY "parent links update related or staff"
  ON public.parent_learner_links FOR UPDATE TO authenticated
  USING (
    parent_user_id = auth.uid()
    OR learner_user_id = auth.uid()
    OR (
      institution_id IS NOT NULL
      AND public.has_institution_role(
        institution_id,
        auth.uid(),
        ARRAY['owner','admin']::member_role[]
      )
    )
  )
  WITH CHECK (
    ((parent_user_id = auth.uid() OR learner_user_id = auth.uid()) AND status = 'revoked')
    OR (
      institution_id IS NOT NULL
      AND public.has_institution_role(
        institution_id,
        auth.uid(),
        ARRAY['owner','admin']::member_role[]
      )
    )
  );

CREATE TRIGGER parent_learner_links_updated
  BEFORE UPDATE ON public.parent_learner_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_parent_learner_links_parent
  ON public.parent_learner_links(parent_user_id, status);
CREATE INDEX IF NOT EXISTS idx_parent_learner_links_learner
  ON public.parent_learner_links(learner_user_id, status);
CREATE INDEX IF NOT EXISTS idx_parent_learner_links_institution
  ON public.parent_learner_links(institution_id, status);

CREATE OR REPLACE FUNCTION public.notify_linked_parents(
  p_learner_user_id uuid,
  p_institution_id uuid,
  p_notification_type text,
  p_title text,
  p_body text,
  p_target_url text DEFAULT NULL,
  p_payload_json jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  linked_parent record;
BEGIN
  IF p_learner_user_id IS NULL THEN
    RETURN;
  END IF;

  FOR linked_parent IN
    SELECT parent_user_id
    FROM public.parent_learner_links
    WHERE learner_user_id = p_learner_user_id
      AND status = 'active'
      AND (institution_id IS NULL OR institution_id = p_institution_id)
  LOOP
    PERFORM public.create_notification_once(
      linked_parent.parent_user_id,
      p_institution_id,
      p_notification_type,
      p_title,
      p_body,
      p_target_url,
      COALESCE(p_payload_json, '{}'::jsonb) ||
        jsonb_build_object('learnerId', p_learner_user_id, 'audience', 'parent')
    );
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_parent_link_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  should_notify boolean := false;
BEGIN
  IF NEW.status = 'active' THEN
    IF TG_OP = 'INSERT' THEN
      should_notify := true;
    ELSIF TG_OP = 'UPDATE' AND COALESCE(OLD.status, '') <> 'active' THEN
      should_notify := true;
    END IF;
  END IF;

  IF should_notify THEN
    PERFORM public.create_notification_once(
      NEW.parent_user_id,
      NEW.institution_id,
      'system',
      'Learner linked to your account',
      'You will now receive automated learning updates for this learner.',
      '/parent/learners',
      jsonb_build_object('learnerId', NEW.learner_user_id, 'linkId', NEW.id)
    );

    PERFORM public.create_notification_once(
      NEW.learner_user_id,
      NEW.institution_id,
      'system',
      'Parent access connected',
      'A parent or guardian has been linked to receive learning updates.',
      '/student/settings',
      jsonb_build_object('parentUserId', NEW.parent_user_id, 'linkId', NEW.id)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notifications_parent_link_created ON public.parent_learner_links;
CREATE TRIGGER notifications_parent_link_created
  AFTER INSERT OR UPDATE OF status ON public.parent_learner_links
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_parent_link_created();

CREATE OR REPLACE FUNCTION public.notify_enrollment_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_title text;
BEGIN
  SELECT title INTO course_title FROM public.courses WHERE id = NEW.course_id;

  PERFORM public.create_notification_once(
    NEW.student_id,
    NEW.institution_id,
    'course_update',
    'You were enrolled in a course',
    'You now have access to ' || COALESCE(course_title, 'a course') || '.',
    '/student/courses/' || NEW.course_id::text,
    jsonb_build_object('courseId', NEW.course_id, 'enrollmentId', NEW.id)
  );

  PERFORM public.notify_linked_parents(
    NEW.student_id,
    NEW.institution_id,
    'course_update',
    'Learner enrolled in a course',
    'A linked learner now has access to ' || COALESCE(course_title, 'a course') || '.',
    '/parent/learners',
    jsonb_build_object('courseId', NEW.course_id, 'studentId', NEW.student_id, 'enrollmentId', NEW.id)
  );

  PERFORM public.notify_institution_staff(
    NEW.institution_id,
    'course_update',
    'Student enrolled',
    'A learner was enrolled in ' || COALESCE(course_title, 'a course') || '.',
    '/institution/courses/' || NEW.course_id::text,
    jsonb_build_object('courseId', NEW.course_id, 'studentId', NEW.student_id, 'enrollmentId', NEW.id)
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_quiz_result_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lesson_title text;
BEGIN
  SELECT title INTO lesson_title FROM public.lessons WHERE id = NEW.lesson_id;

  PERFORM public.create_notification_once(
    NEW.student_id,
    NEW.institution_id,
    'quiz_ready',
    'Quiz feedback ready',
    'Your quiz result is ready' ||
      CASE WHEN NEW.percentage IS NOT NULL THEN ' with a score of ' || round(NEW.percentage)::text || '%.' ELSE '.' END,
    '/student/quizzes',
    jsonb_build_object('quizResultId', NEW.id, 'quizId', NEW.quiz_id, 'lessonId', NEW.lesson_id, 'lessonTitle', lesson_title)
  );

  PERFORM public.notify_linked_parents(
    NEW.student_id,
    NEW.institution_id,
    'quiz_ready',
    'Learner quiz feedback ready',
    'A linked learner has new quiz feedback' ||
      CASE WHEN NEW.percentage IS NOT NULL THEN ' with a score of ' || round(NEW.percentage)::text || '%.' ELSE '.' END,
    '/parent/progress',
    jsonb_build_object('quizResultId', NEW.id, 'quizId', NEW.quiz_id, 'lessonId', NEW.lesson_id, 'lessonTitle', lesson_title)
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_lesson_published()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  learner record;
BEGIN
  IF NEW.status = 'published' AND COALESCE(OLD.status, '') <> 'published' THEN
    FOR learner IN
      SELECT student_id
      FROM public.course_enrollments
      WHERE course_id = NEW.course_id
        AND status = 'active'
    LOOP
      PERFORM public.create_notification_once(
        learner.student_id,
        NEW.institution_id,
        'lesson_update',
        'New lesson available',
        COALESCE(NEW.title, 'A new lesson') || ' is now available.',
        '/student/lessons/' || NEW.id::text,
        jsonb_build_object('lessonId', NEW.id, 'courseId', NEW.course_id)
      );

      PERFORM public.notify_linked_parents(
        learner.student_id,
        NEW.institution_id,
        'lesson_update',
        'New learner lesson available',
        COALESCE(NEW.title, 'A new lesson') || ' is now available for a linked learner.',
        '/parent/learners',
        jsonb_build_object('lessonId', NEW.id, 'courseId', NEW.course_id)
      );
    END LOOP;

    PERFORM public.notify_institution_staff(
      NEW.institution_id,
      'lesson_update',
      'Lesson published',
      COALESCE(NEW.title, 'A lesson') || ' is now published.',
      '/teacher/lessons',
      jsonb_build_object('lessonId', NEW.id, 'courseId', NEW.course_id)
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_session_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  participant record;
BEGIN
  IF NEW.status = 'completed' AND COALESCE(OLD.status, '') <> 'completed' THEN
    FOR participant IN
      SELECT DISTINCT user_id
      FROM public.session_participants
      WHERE session_id = NEW.id
        AND user_id IS NOT NULL
    LOOP
      PERFORM public.create_notification_once(
        participant.user_id,
        NEW.institution_id,
        'summary_ready',
        'Session summary ready',
        'Your session summary and replay are ready to review.',
        '/classroom/session/' || NEW.id::text,
        jsonb_build_object('sessionId', NEW.id, 'lessonId', NEW.lesson_id, 'courseId', NEW.course_id)
      );

      PERFORM public.notify_linked_parents(
        participant.user_id,
        NEW.institution_id,
        'summary_ready',
        'Learner session summary ready',
        'A linked learner has a new classroom session summary ready to review.',
        '/parent/sessions',
        jsonb_build_object('sessionId', NEW.id, 'lessonId', NEW.lesson_id, 'courseId', NEW.course_id)
      );
    END LOOP;

    IF NEW.host_user_id IS NOT NULL THEN
      PERFORM public.create_notification_once(
        NEW.host_user_id,
        NEW.institution_id,
        'summary_ready',
        'Session completed',
        'Your classroom session has ended and the summary is ready.',
        '/classroom/session/' || NEW.id::text,
        jsonb_build_object('sessionId', NEW.id, 'lessonId', NEW.lesson_id, 'courseId', NEW.course_id)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
