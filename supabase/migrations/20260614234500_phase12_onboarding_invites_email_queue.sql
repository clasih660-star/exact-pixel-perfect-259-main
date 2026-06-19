-- Phase 12: institution onboarding, invite lifecycle, and outbound email queue.
-- Additive and idempotent foundation for Milestone 1 backend workflows.

ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS onboarding_status text NOT NULL DEFAULT 'completed';

ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS onboarding_started_at timestamptz;

ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

COMMENT ON COLUMN public.institutions.onboarding_status IS
  'Operational onboarding status: pending_setup, owner_created, invites_sent, active, completed, suspended.';

CREATE TABLE IF NOT EXISTS public.institution_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role public.member_role NOT NULL,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'revoked', 'expired')),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz,
  accepted_at timestamptz,
  accepted_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.outbound_email_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE,
  related_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  related_invite_id uuid REFERENCES public.institution_invites(id) ON DELETE SET NULL,
  kind text NOT NULL,
  provider text NOT NULL DEFAULT 'internal_queue',
  template_key text,
  to_email text NOT NULL,
  to_name text,
  subject text NOT NULL,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempt_count integer NOT NULL DEFAULT 0,
  last_error text,
  scheduled_for timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.institution_invites TO authenticated;
GRANT ALL ON public.institution_invites TO service_role;
ALTER TABLE public.institution_invites ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.outbound_email_jobs TO authenticated;
GRANT ALL ON public.outbound_email_jobs TO service_role;
ALTER TABLE public.outbound_email_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "institution_invites read members" ON public.institution_invites;
CREATE POLICY "institution_invites read members" ON public.institution_invites
  FOR SELECT TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()));

DROP POLICY IF EXISTS "institution_invites manage admins" ON public.institution_invites;
CREATE POLICY "institution_invites manage admins" ON public.institution_invites
  FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

DROP POLICY IF EXISTS "email_jobs read institution_staff" ON public.outbound_email_jobs;
CREATE POLICY "email_jobs read institution_staff" ON public.outbound_email_jobs
  FOR SELECT TO authenticated
  USING (
    institution_id IS NOT NULL
    AND public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[])
  );

DROP POLICY IF EXISTS "email_jobs manage admins" ON public.outbound_email_jobs;
CREATE POLICY "email_jobs manage admins" ON public.outbound_email_jobs
  FOR ALL TO authenticated
  USING (
    institution_id IS NOT NULL
    AND public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[])
  )
  WITH CHECK (
    institution_id IS NOT NULL
    AND public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[])
  );

DROP TRIGGER IF EXISTS institution_invites_updated ON public.institution_invites;
CREATE TRIGGER institution_invites_updated
  BEFORE UPDATE ON public.institution_invites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS outbound_email_jobs_updated ON public.outbound_email_jobs;
CREATE TRIGGER outbound_email_jobs_updated
  BEFORE UPDATE ON public.outbound_email_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_institutions_onboarding_status
  ON public.institutions(onboarding_status);

CREATE INDEX IF NOT EXISTS idx_institution_invites_institution_status
  ON public.institution_invites(institution_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_institution_invites_email
  ON public.institution_invites(lower(email));

CREATE INDEX IF NOT EXISTS idx_outbound_email_jobs_status_schedule
  ON public.outbound_email_jobs(status, scheduled_for);

CREATE INDEX IF NOT EXISTS idx_outbound_email_jobs_institution
  ON public.outbound_email_jobs(institution_id, created_at DESC);