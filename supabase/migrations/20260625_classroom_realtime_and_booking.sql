-- Migration: Add weekly teacher availability + session board state
-- NOTE: teacher_availability already exists (live presence). We use
-- teacher_weekly_availability for recurring weekly time slots.
-- session_events already exists from phase1 classroom foundation.
-- This migration is IDEMPOTENT — safe to re-run.

-- ============================================================================
-- 1. teacher_weekly_availability — recurring weekly time slots per teacher
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teacher_weekly_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT teacher_weekly_slot_order CHECK (start_time < end_time)
);

-- Index for fast lookups by teacher+institution
CREATE INDEX IF NOT EXISTS idx_teacher_weekly_avail_teacher
  ON public.teacher_weekly_availability(teacher_id, institution_id)
  WHERE is_active = true;

-- Index for student-facing slot queries (by day)
CREATE INDEX IF NOT EXISTS idx_teacher_weekly_avail_day
  ON public.teacher_weekly_availability(day_of_week, institution_id)
  WHERE is_active = true;

-- RLS: teachers see their own slots, institution staff can read all slots
ALTER TABLE public.teacher_weekly_availability ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Teachers can manage their weekly availability"
    ON public.teacher_weekly_availability
    FOR ALL
    USING (teacher_id = auth.uid())
    WITH CHECK (teacher_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Institution staff can read weekly availability"
    ON public.teacher_weekly_availability
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.institution_members im
        WHERE im.institution_id = teacher_weekly_availability.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('admin', 'owner', 'teacher')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_weekly_availability TO authenticated;
GRANT ALL ON public.teacher_weekly_availability TO service_role;

-- ============================================================================
-- 2. session_board_state — one row per session, the live shared whiteboard
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.session_board_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  board_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_index integer NOT NULL DEFAULT 0,
  section_key text,
  teacher_note text,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: anyone in the session can read, only the host can write
ALTER TABLE public.session_board_state ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Session participants can read board state"
    ON public.session_board_state
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.session_participants sp
        WHERE sp.session_id = session_board_state.session_id
          AND sp.user_id = auth.uid()
          AND sp.left_at IS NULL
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Session host can write board state"
    ON public.session_board_state
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.classroom_sessions cs
        WHERE cs.id = session_board_state.session_id
          AND cs.host_user_id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.classroom_sessions cs
        WHERE cs.id = session_board_state.session_id
          AND cs.host_user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_board_state TO authenticated;
GRANT ALL ON public.session_board_state TO service_role;

-- ============================================================================
-- 3. Enable Realtime (ignore errors if already added)
-- ============================================================================

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_board_state;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.classroom_sessions;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
