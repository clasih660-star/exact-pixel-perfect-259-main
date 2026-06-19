-- Automated notification generation for the main learning workflows.
-- These triggers keep notifications connected to real data changes even when
-- writes happen outside the dashboard UI.

CREATE OR REPLACE FUNCTION public.create_notification_once(
  p_user_id uuid,
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
BEGIN
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.notifications (
    user_id,
    institution_id,
    notification_type,
    title,
    body,
    target_url,
    payload_json
  )
  SELECT
    p_user_id,
    p_institution_id,
    COALESCE(p_notification_type, 'system'),
    p_title,
    COALESCE(p_body, ''),
    p_target_url,
    COALESCE(p_payload_json, '{}'::jsonb)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.notifications n
    WHERE n.user_id = p_user_id
      AND n.notification_type = COALESCE(p_notification_type, 'system')
      AND n.title = p_title
      AND n.read_at IS NULL
      AND n.payload_json @> COALESCE(p_payload_json, '{}'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_institution_staff(
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
  staff record;
BEGIN
  IF p_institution_id IS NULL THEN
    RETURN;
  END IF;

  FOR staff IN
    SELECT user_id
    FROM public.institution_members
    WHERE institution_id = p_institution_id
      AND status = 'active'
      AND role::text IN ('owner', 'admin', 'teacher')
  LOOP
    PERFORM public.create_notification_once(
      staff.user_id,
      p_institution_id,
      p_notification_type,
      p_title,
      p_body,
      p_target_url,
      p_payload_json
    );
  END LOOP;
END;
$$;

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

CREATE OR REPLACE FUNCTION public.notify_generated_lesson_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(to_jsonb(NEW)->>'generation_mode', '') = 'auto' THEN
    PERFORM public.create_notification_once(
      NEW.created_by,
      NEW.institution_id,
      'lesson_update',
      'Lesson draft generated',
      COALESCE(NEW.title, 'A lesson draft') || ' was generated and is ready for review.',
      '/teacher/lessons',
      jsonb_build_object('lessonId', NEW.id, 'courseId', NEW.course_id)
    );

    PERFORM public.notify_institution_staff(
      NEW.institution_id,
      'lesson_update',
      'Generated lesson ready for review',
      COALESCE(NEW.title, 'A generated lesson') || ' is ready for review.',
      '/institution/lesson-generation',
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

DROP TRIGGER IF EXISTS notifications_course_enrollment_created ON public.course_enrollments;
CREATE TRIGGER notifications_course_enrollment_created
  AFTER INSERT ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_enrollment_created();

DROP TRIGGER IF EXISTS notifications_quiz_result_created ON public.quiz_results;
CREATE TRIGGER notifications_quiz_result_created
  AFTER INSERT ON public.quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_quiz_result_created();

DROP TRIGGER IF EXISTS notifications_lesson_published ON public.lessons;
CREATE TRIGGER notifications_lesson_published
  AFTER UPDATE OF status ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_lesson_published();

DROP TRIGGER IF EXISTS notifications_generated_lesson_created ON public.lessons;
CREATE TRIGGER notifications_generated_lesson_created
  AFTER INSERT ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_generated_lesson_created();

DROP TRIGGER IF EXISTS notifications_session_completed ON public.classroom_sessions;
CREATE TRIGGER notifications_session_completed
  AFTER UPDATE OF status ON public.classroom_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_session_completed();
