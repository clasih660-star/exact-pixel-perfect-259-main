-- Phase 0: Course-level USD pricing, student course purchases, and backing tables
-- for student.assignments / student.messages. All changes are additive & idempotent.

-- ============================================================================
-- 1. Course pricing columns
-- ============================================================================
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS price_usd numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS pricing_label text,
  ADD COLUMN IF NOT EXISTS compare_at_price_usd numeric(10,2);

COMMENT ON COLUMN public.courses.price_usd IS 'Course price in major USD units (e.g. 15.00). 0 = free.';
COMMENT ON COLUMN public.courses.pricing_label IS 'Optional display label, e.g. "$15 one-time" or "Free".';

-- ============================================================================
-- 2. Enrollment source on course_enrollments (so self-purchases are traceable)
-- ============================================================================
ALTER TABLE public.course_enrollments
  ADD COLUMN IF NOT EXISTS enrollment_source text NOT NULL DEFAULT 'institution';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_enrollment_source_check'
  ) THEN
    ALTER TABLE public.course_enrollments
      ADD CONSTRAINT course_enrollments_enrollment_source_check
      CHECK (enrollment_source IN ('institution','self_registered'));
  END IF;
END$$;

-- ============================================================================
-- 3. course_purchases — student-level USD course purchases (Paystack)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  amount_usd numeric(10,2) NOT NULL DEFAULT 0,
  amount_minor integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'initialized'
    CHECK (status IN ('initialized','pending','success','failed','abandoned')),
  paystack_reference text UNIQUE,
  provider_reference text,
  paid_at timestamptz,
  enrolled_at timestamptz,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON public.course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course ON public.course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_reference ON public.course_purchases(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_course_purchases_status ON public.course_purchases(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_purchases TO authenticated;
GRANT ALL ON public.course_purchases TO service_role;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

-- is_platform_admin may already exist (paystack billing migration). Redefine safely.
CREATE OR REPLACE FUNCTION public.is_platform_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'platform_admin'
  );
$$;

DROP POLICY IF EXISTS "course_purchases read own or admin" ON public.course_purchases;
CREATE POLICY "course_purchases read own or admin" ON public.course_purchases
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_platform_admin(auth.uid()));

DROP POLICY IF EXISTS "course_purchases insert own" ON public.course_purchases;
CREATE POLICY "course_purchases insert own" ON public.course_purchases
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "course_purchases update own" ON public.course_purchases;
CREATE POLICY "course_purchases update own" ON public.course_purchases
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS course_purchases_updated ON public.course_purchases;
CREATE TRIGGER course_purchases_updated BEFORE UPDATE ON public.course_purchases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 4. assignments — backs student.assignments
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_at timestamptz,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','submitted','graded','overdue')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignments_student ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON public.assignments(due_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assignments read own or institution staff" ON public.assignments;
CREATE POLICY "assignments read own or institution staff" ON public.assignments
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[])
    OR public.is_platform_admin(auth.uid())
  );

DROP POLICY IF EXISTS "assignments manage institution staff" ON public.assignments;
CREATE POLICY "assignments manage institution staff" ON public.assignments
  FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));

DROP POLICY IF EXISTS "assignments update own student" ON public.assignments;
CREATE POLICY "assignments update own student" ON public.assignments
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

DROP TRIGGER IF EXISTS assignments_updated ON public.assignments;
CREATE TRIGGER assignments_updated BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 5. messages — backs student.messages (minimal student<->staff threads)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id, read_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_pair ON public.messages(least(sender_id,recipient_id), greatest(sender_id,recipient_id), created_at);

GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages read own conversations" ON public.messages;
CREATE POLICY "messages read own conversations" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid()
    OR recipient_id = auth.uid()
    OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[])
    OR public.is_platform_admin(auth.uid())
  );

DROP POLICY IF EXISTS "messages insert participant" ON public.messages;
CREATE POLICY "messages insert participant" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "messages update recipient mark read" ON public.messages;
CREATE POLICY "messages update recipient mark read" ON public.messages
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- ============================================================================
-- 6. Seed platform owner institution + KingPin courses (idempotent)
-- ============================================================================
INSERT INTO public.institutions (slug, name, type, status, contact_email, created_at, updated_at)
VALUES ('kingpin-academy', 'KingPin Academy', 'other', 'active', 'hello@kingpin.co.ke', now(), now())
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  contact_email = EXCLUDED.contact_email,
  updated_at = now();

-- Seed the 4 KingPin marketplace courses as published rows with USD pricing.
INSERT INTO public.courses
  (institution_id, slug, title, description, subject, level, status, source_type, price_usd, currency, pricing_label, created_at, updated_at)
SELECT
  i.id,
  x.slug,
  x.title,
  x.description,
  'AI Productivity',
  'All Levels',
  'published',
  'kingpin',
  x.price_usd,
  'USD',
  x.pricing_label,
  now(),
  now()
FROM public.institutions i
CROSS JOIN (VALUES
  ('kingpin-ai-productivity-masterclass', 'KingPin AI Productivity Masterclass',
   '40+ AI tools for work, research, analysis, automation, and department use.', 15.00, '$15 one-time'),
  ('kingpin-ai-research-and-analysis-specialist', 'KingPin AI Research & Analysis Specialist',
   'Evidence, literature, data, reasoning, and structured analytical workflows.', 19.00, '$19 one-time'),
  ('kingpin-ai-marketing-and-content-systems', 'KingPin AI Marketing & Content Systems',
   'Content, campaigns, visuals, presentations, and customer-facing AI workflows.', 19.00, '$19 one-time'),
  ('kingpin-ai-automation-and-operations-builder', 'KingPin AI Automation & Operations Builder',
   'Operations, workflow orchestration, admin systems, and AI productivity design.', 19.00, '$19 one-time')
) AS x(slug, title, description, price_usd, pricing_label)
WHERE i.slug = 'kingpin-academy'
ON CONFLICT (institution_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  source_type = 'kingpin',
  status = 'published',
  currency = 'USD',
  price_usd = EXCLUDED.price_usd,
  pricing_label = EXCLUDED.pricing_label,
  updated_at = now();
