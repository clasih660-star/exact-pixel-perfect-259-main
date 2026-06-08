-- Phase 8: Analytics, Notifications, and Retention
-- Adds notifications table and analytics support functions

-- ============================================================================
-- Notifications table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  notification_type VARCHAR(40) NOT NULL DEFAULT 'system',
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  target_url TEXT,
  payload_json JSONB NOT NULL DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(user_id, notification_type);

-- ============================================================================
-- RLS for notifications
-- ============================================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can insert (for server functions)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Also allow authenticated users' server functions to insert
CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- Recommendations table (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  recommendation_type VARCHAR(40) NOT NULL DEFAULT 'next_lesson',
  title VARCHAR(200) NOT NULL,
  description TEXT,
  reason_json JSONB NOT NULL DEFAULT '{}',
  target_url TEXT,
  priority INTEGER NOT NULL DEFAULT 50,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_student ON public.recommendations(student_id, is_read, priority DESC);

-- RLS for recommendations
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own recommendations"
  ON public.recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can update own recommendations"
  ON public.recommendations FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Service role can insert recommendations"
  ON public.recommendations FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Students can insert own recommendations"
  ON public.recommendations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- ============================================================================
-- Analytics helper: upsert study_goals table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.study_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  goal_type VARCHAR(40) NOT NULL DEFAULT 'daily_minutes',
  target_value NUMERIC NOT NULL DEFAULT 30,
  current_value NUMERIC NOT NULL DEFAULT 0,
  period VARCHAR(20) NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_goals_student ON public.study_goals(student_id, is_active);

ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own study goals"
  ON public.study_goals FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

-- ============================================================================
-- Achievements table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  achievement_type VARCHAR(60) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(20) DEFAULT '🏆',
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata_json JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_achievements_student ON public.achievements(student_id, achievement_type);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "System can insert achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());