-- ============================================================================
-- Migration: Session lifecycle (auto-transition + recurring), teacher payouts,
-- classroom rentals. IDEMPOTENT — safe to re-run.
-- ============================================================================

-- ============================================================================
-- 1. Recurring session support on classroom_sessions
-- ============================================================================
ALTER TABLE public.classroom_sessions
  ADD COLUMN IF NOT EXISTS recurrence_pattern text,
  ADD COLUMN IF NOT EXISTS recurrence_end_date date,
  ADD COLUMN IF NOT EXISTS parent_session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS virtual_classroom_id uuid REFERENCES public.virtual_classrooms(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_parent
  ON public.classroom_sessions(parent_session_id)
  WHERE parent_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_start
  ON public.classroom_sessions(scheduled_start_at)
  WHERE status = 'scheduled';

-- ============================================================================
-- 2. teacher_payouts — compensation for teaching sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teacher_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed','cancelled')),
  period_start date,
  period_end date,
  session_count integer NOT NULL DEFAULT 1,
  learner_hours numeric(10,2) NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payouts_teacher
  ON public.teacher_payouts(teacher_id, institution_id)
  WHERE status IN ('pending','processing');

CREATE INDEX IF NOT EXISTS idx_payouts_session
  ON public.teacher_payouts(session_id)
  WHERE session_id IS NOT NULL;

ALTER TABLE public.teacher_payouts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Teachers can view their payouts"
    ON public.teacher_payouts
    FOR SELECT
    USING (teacher_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Institution staff can view payouts"
    ON public.teacher_payouts
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.institution_members im
        WHERE im.institution_id = teacher_payouts.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('admin','owner')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Institution admins manage payouts"
    ON public.teacher_payouts
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.institution_members im
        WHERE im.institution_id = teacher_payouts.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('admin','owner')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.institution_members im
        WHERE im.institution_id = teacher_payouts.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('admin','owner')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_payouts TO authenticated;
GRANT ALL ON public.teacher_payouts TO service_role;

-- ============================================================================
-- 3. classroom_rentals — institutions renting virtual classrooms
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.classroom_rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  virtual_classroom_id uuid NOT NULL REFERENCES public.virtual_classrooms(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  renter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rental_type text NOT NULL DEFAULT 'per_session' CHECK (rental_type IN ('per_session','hourly','daily','monthly')),
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','active','completed','cancelled')),
  paystack_reference text,
  paystack_status text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rental_time_order CHECK (end_at > start_at)
);

CREATE INDEX IF NOT EXISTS idx_rentals_institution
  ON public.classroom_rentals(institution_id)
  WHERE status IN ('pending','confirmed','active');

CREATE INDEX IF NOT EXISTS idx_rentals_classroom
  ON public.classroom_rentals(virtual_classroom_id, start_at)
  WHERE status IN ('confirmed','active');

ALTER TABLE public.classroom_rentals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Institution staff can manage rentals"
    ON public.classroom_rentals
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.institution_members im
        WHERE im.institution_id = classroom_rentals.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('admin','owner')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.institution_members im
        WHERE im.institution_id = classroom_rentals.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('admin','owner')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_rentals TO authenticated;
GRANT ALL ON public.classroom_rentals TO service_role;

-- ============================================================================
-- 4. session_reminder_sent — track which sessions already sent "going live" notif
-- ============================================================================
ALTER TABLE public.classroom_sessions
  ADD COLUMN IF NOT EXISTS live_notification_sent boolean NOT NULL DEFAULT false;

-- ============================================================================
-- 5. updated_at triggers for new tables
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_teacher_payouts_updated ON public.teacher_payouts;
CREATE TRIGGER trg_teacher_payouts_updated
  BEFORE UPDATE ON public.teacher_payouts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_classroom_rentals_updated ON public.classroom_rentals;
CREATE TRIGGER trg_classroom_rentals_updated
  BEFORE UPDATE ON public.classroom_rentals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 6. Enable realtime for new tables
-- ============================================================================
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.teacher_payouts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.classroom_rentals;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;