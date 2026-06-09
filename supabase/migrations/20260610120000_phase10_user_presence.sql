-- Phase 10: User Presence & Lesson Generation Jobs
--
-- Realtime presence tracking for online users, active sessions.
-- Lesson generation job tracking for AI-powered lesson creation.
-- KingPin course source type for platform-owned courses.
--
-- This migration is ADDITIVE and idempotent.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. User Presence (realtime online tracking)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'student'
    CHECK (role IN ('platform_admin','institution_admin','teacher','student','parent')),
  status text NOT NULL DEFAULT 'online'
    CHECK (status IN ('online','away','offline')),
  current_session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  current_lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  current_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  last_heartbeat timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_presence TO authenticated;
GRANT ALL ON public.user_presence TO service_role;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- RLS: users can see presence in their institution; platform admin sees all
DROP POLICY IF EXISTS "user_presence read own institution" ON public.user_presence;
CREATE POLICY "user_presence read own institution" ON public.user_presence FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR institution_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.institution_members
    WHERE institution_members.institution_id = user_presence.institution_id
    AND institution_members.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "user_presence upsert self" ON public.user_presence;
CREATE POLICY "user_presence upsert self" ON public.user_presence FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_presence update self" ON public.user_presence;
CREATE POLICY "user_presence update self" ON public.user_presence FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Lesson Generation Jobs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  programme_id uuid REFERENCES public.programmes(id) ON DELETE SET NULL,
  triggered_by uuid NOT NULL REFERENCES auth.users(id),
  source_material_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','processing','completed','failed','cancelled')),
  total_lessons_requested int,
  total_lessons_generated int DEFAULT 0,
  generation_settings jsonb NOT NULL DEFAULT '{
    "mode": "auto",
    "minimumDurationMinutes": 25,
    "maximumDurationMinutes": 60,
    "defaultDurationMinutes": 35,
    "teachingDepth": "standard",
    "includeImages": true,
    "includeGuidedPractice": true,
    "includeIndependentPractice": true,
    "includeNotes": true,
    "includeTranscriptStructure": true
  }'::jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_generation_jobs TO authenticated;
GRANT ALL ON public.lesson_generation_jobs TO service_role;
ALTER TABLE public.lesson_generation_jobs ENABLE ROW LEVEL SECURITY;

-- RLS: institution members can read; staff can manage
DROP POLICY IF EXISTS "lesson_generation_jobs read members" ON public.lesson_generation_jobs;
CREATE POLICY "lesson_generation_jobs read members" ON public.lesson_generation_jobs FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()));

DROP POLICY IF EXISTS "lesson_generation_jobs write staff" ON public.lesson_generation_jobs;
CREATE POLICY "lesson_generation_jobs write staff" ON public.lesson_generation_jobs FOR INSERT TO authenticated
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

DROP POLICY IF EXISTS "lesson_generation_jobs update staff" ON public.lesson_generation_jobs;
CREATE POLICY "lesson_generation_jobs update staff" ON public.lesson_generation_jobs FOR UPDATE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Add KingPin source type to courses
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'source_type'
  ) THEN
    ALTER TABLE public.courses
      ADD COLUMN source_type text NOT NULL DEFAULT 'institution'
        CHECK (source_type IN ('institution','kingpin'));
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Platform Settings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_settings read authenticated" ON public.platform_settings;
CREATE POLICY "platform_settings read authenticated" ON public.platform_settings FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "platform_settings write platform_admin" ON public.platform_settings;
CREATE POLICY "platform_settings write platform_admin" ON public.platform_settings FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin'
  )
);

-- Seed default AI settings
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('ai_provider', '{"primary": "openai", "fallback": "deepseek"}', 'AI provider configuration'),
  ('lesson_generation_defaults', '{
    "minimumDurationMinutes": 25,
    "maximumDurationMinutes": 60,
    "defaultDurationMinutes": 35,
    "teachingDepth": "standard",
    "includeImages": true,
    "includeGuidedPractice": true
  }', 'Default lesson generation settings'),
  ('realtime_tracking', '{"enabled": true, "heartbeatIntervalSeconds": 30}', 'Realtime presence settings')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Audit Logs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id),
  actor_role text,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  institution_id uuid REFERENCES public.institutions(id),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs read platform_admin" ON public.audit_logs;
CREATE POLICY "audit_logs read platform_admin" ON public.audit_logs FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'platform_admin'
  )
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Triggers
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS user_presence_updated ON public.user_presence;
CREATE TRIGGER user_presence_updated BEFORE UPDATE ON public.user_presence
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS lesson_generation_jobs_updated ON public.lesson_generation_jobs;
CREATE TRIGGER lesson_generation_jobs_updated BEFORE UPDATE ON public.lesson_generation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS platform_settings_updated ON public.platform_settings;
CREATE TRIGGER platform_settings_updated BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_presence_institution ON public.user_presence(institution_id, status);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status) WHERE status = 'online';
CREATE INDEX IF NOT EXISTS idx_user_presence_last_heartbeat ON public.user_presence(last_heartbeat DESC);

CREATE INDEX IF NOT EXISTS idx_lesson_generation_jobs_course ON public.lesson_generation_jobs(course_id, status);
CREATE INDEX IF NOT EXISTS idx_lesson_generation_jobs_institution ON public.lesson_generation_jobs(institution_id, status);
CREATE INDEX IF NOT EXISTS idx_lesson_generation_jobs_status ON public.lesson_generation_jobs(status) WHERE status IN ('queued','processing');

CREATE INDEX IF NOT EXISTS idx_courses_source_type ON public.courses(source_type) WHERE source_type = 'kingpin';

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_institution ON public.audit_logs(institution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);