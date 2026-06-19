-- Phase 13: admissions, scheduling, certification, audit, and export foundation.
-- Additive and idempotent to extend Milestone 1 into the remaining backend phases.

CREATE TABLE IF NOT EXISTS public.admission_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'archived')),
  opens_at timestamptz,
  closes_at timestamptz,
  default_programme_id uuid REFERENCES public.programmes(id) ON DELETE SET NULL,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admission_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  admission_cycle_id uuid REFERENCES public.admission_cycles(id) ON DELETE SET NULL,
  target_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewing', 'accepted', 'rejected', 'waitlisted', 'enrolled')),
  application_notes text,
  internal_notes text,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at timestamptz,
  decision_at timestamptz,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  timezone text NOT NULL DEFAULT 'UTC',
  audience text NOT NULL DEFAULT 'institution' CHECK (audience IN ('institution', 'teacher', 'student', 'public')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  location text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  calendar_event_id uuid REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'sent', 'cancelled', 'failed')),
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_job_id uuid REFERENCES public.outbound_email_jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.completion_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  min_progress_percentage numeric NOT NULL DEFAULT 100,
  require_active_enrollment boolean NOT NULL DEFAULT true,
  require_quiz_pass boolean NOT NULL DEFAULT false,
  min_quiz_percentage numeric NOT NULL DEFAULT 0,
  auto_issue_certificate boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completion_rule_id uuid REFERENCES public.completion_rules(id) ON DELETE SET NULL,
  certificate_number text NOT NULL UNIQUE,
  verification_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'revoked', 'expired')),
  issued_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  issued_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  artifact_url text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  summary text,
  details_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.data_export_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  export_type text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  filters_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  artifact_url text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admission_cycles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admission_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_reminders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completion_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_export_jobs TO authenticated;

GRANT ALL ON public.admission_cycles TO service_role;
GRANT ALL ON public.admission_applications TO service_role;
GRANT ALL ON public.calendar_events TO service_role;
GRANT ALL ON public.session_reminders TO service_role;
GRANT ALL ON public.completion_rules TO service_role;
GRANT ALL ON public.certificates TO service_role;
GRANT ALL ON public.audit_logs TO service_role;
GRANT ALL ON public.data_export_jobs TO service_role;

ALTER TABLE public.admission_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completion_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admission_cycles read members" ON public.admission_cycles;
CREATE POLICY "admission_cycles read members" ON public.admission_cycles FOR SELECT TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()));

DROP POLICY IF EXISTS "admission_cycles manage admins" ON public.admission_cycles;
CREATE POLICY "admission_cycles manage admins" ON public.admission_cycles FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

DROP POLICY IF EXISTS "admission_applications read staff" ON public.admission_applications;
CREATE POLICY "admission_applications read staff" ON public.admission_applications FOR SELECT TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "admission_applications manage staff" ON public.admission_applications;
CREATE POLICY "admission_applications manage staff" ON public.admission_applications FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "calendar_events read members" ON public.calendar_events;
CREATE POLICY "calendar_events read members" ON public.calendar_events FOR SELECT TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()));

DROP POLICY IF EXISTS "calendar_events manage staff" ON public.calendar_events;
CREATE POLICY "calendar_events manage staff" ON public.calendar_events FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "session_reminders read staff" ON public.session_reminders;
CREATE POLICY "session_reminders read staff" ON public.session_reminders FOR SELECT TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "session_reminders manage staff" ON public.session_reminders;
CREATE POLICY "session_reminders manage staff" ON public.session_reminders FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "completion_rules read members" ON public.completion_rules;
CREATE POLICY "completion_rules read members" ON public.completion_rules FOR SELECT TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()));

DROP POLICY IF EXISTS "completion_rules manage staff" ON public.completion_rules;
CREATE POLICY "completion_rules manage staff" ON public.completion_rules FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "certificates read self_or_staff" ON public.certificates;
CREATE POLICY "certificates read self_or_staff" ON public.certificates FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[])
  );

DROP POLICY IF EXISTS "certificates manage staff" ON public.certificates;
CREATE POLICY "certificates manage staff" ON public.certificates FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "audit_logs read admins" ON public.audit_logs;
CREATE POLICY "audit_logs read admins" ON public.audit_logs FOR SELECT TO authenticated
  USING (
    institution_id IS NULL
    OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[])
  );

DROP POLICY IF EXISTS "audit_logs insert staff" ON public.audit_logs;
CREATE POLICY "audit_logs insert staff" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (
    institution_id IS NULL
    OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[])
  );

DROP POLICY IF EXISTS "data_export_jobs read admins" ON public.data_export_jobs;
CREATE POLICY "data_export_jobs read admins" ON public.data_export_jobs FOR SELECT TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

DROP POLICY IF EXISTS "data_export_jobs manage admins" ON public.data_export_jobs;
CREATE POLICY "data_export_jobs manage admins" ON public.data_export_jobs FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

DROP TRIGGER IF EXISTS admission_cycles_updated ON public.admission_cycles;
CREATE TRIGGER admission_cycles_updated BEFORE UPDATE ON public.admission_cycles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS admission_applications_updated ON public.admission_applications;
CREATE TRIGGER admission_applications_updated BEFORE UPDATE ON public.admission_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS calendar_events_updated ON public.calendar_events;
CREATE TRIGGER calendar_events_updated BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS session_reminders_updated ON public.session_reminders;
CREATE TRIGGER session_reminders_updated BEFORE UPDATE ON public.session_reminders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS completion_rules_updated ON public.completion_rules;
CREATE TRIGGER completion_rules_updated BEFORE UPDATE ON public.completion_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS certificates_updated ON public.certificates;
CREATE TRIGGER certificates_updated BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS data_export_jobs_updated ON public.data_export_jobs;
CREATE TRIGGER data_export_jobs_updated BEFORE UPDATE ON public.data_export_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_admission_cycles_institution_status
  ON public.admission_cycles(institution_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admission_applications_institution_status
  ON public.admission_applications(institution_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admission_applications_email
  ON public.admission_applications(lower(email));

CREATE INDEX IF NOT EXISTS idx_calendar_events_institution_starts_at
  ON public.calendar_events(institution_id, starts_at);

CREATE INDEX IF NOT EXISTS idx_session_reminders_status_scheduled_for
  ON public.session_reminders(status, scheduled_for);

CREATE INDEX IF NOT EXISTS idx_completion_rules_course_status
  ON public.completion_rules(course_id, status);

CREATE INDEX IF NOT EXISTS idx_certificates_student_issued_at
  ON public.certificates(student_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_institution_created_at
  ON public.audit_logs(institution_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_data_export_jobs_institution_status
  ON public.data_export_jobs(institution_id, status, created_at DESC);