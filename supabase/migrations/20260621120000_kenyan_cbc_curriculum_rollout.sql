-- Kenyan CBC KingPin curriculum rollout.
--
-- This migration stores curriculum metadata and DB-backed KingPin course shells
-- without embedding copyrighted textbook text. Exact book titles, publisher
-- data, licensed excerpts, and strand/sub-strand mappings are ingested later
-- through course_materials and curriculum_scope_mappings.

-- ============================================================================
-- 1. Curriculum metadata on existing hierarchy
-- ============================================================================
ALTER TABLE public.programmes
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS curriculum_family text,
  ADD COLUMN IF NOT EXISTS grade int,
  ADD COLUMN IF NOT EXISTS curriculum_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS curriculum_family text,
  ADD COLUMN IF NOT EXISTS grade int,
  ADD COLUMN IF NOT EXISTS curriculum_subject text,
  ADD COLUMN IF NOT EXISTS curriculum_subject_slug text,
  ADD COLUMN IF NOT EXISTS curriculum_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.course_materials
  ADD COLUMN IF NOT EXISTS material_role text,
  ADD COLUMN IF NOT EXISTS book_title text,
  ADD COLUMN IF NOT EXISTS publisher text,
  ADD COLUMN IF NOT EXISTS edition_year text,
  ADD COLUMN IF NOT EXISTS material_rights_status text,
  ADD COLUMN IF NOT EXISTS rights_notes text,
  ADD COLUMN IF NOT EXISTS curriculum_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_materials_material_role_check'
  ) THEN
    ALTER TABLE public.course_materials
      ADD CONSTRAINT course_materials_material_role_check
      CHECK (
        material_role IS NULL OR material_role IN (
          'teacher_guide',
          'learner_book',
          'reference_text',
          'syllabus',
          'institution_excerpt',
          'other'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_materials_rights_status_check'
  ) THEN
    ALTER TABLE public.course_materials
      ADD CONSTRAINT course_materials_rights_status_check
      CHECK (
        material_rights_status IS NULL OR material_rights_status IN (
          'licensed',
          'institution_provided',
          'public_domain',
          'metadata_only',
          'pending_review'
        )
      );
  END IF;
END$$;

COMMENT ON COLUMN public.course_materials.book_title IS
  'Approved book/source title metadata. Do not seed raw copyrighted textbook text in migrations.';
COMMENT ON COLUMN public.course_materials.material_rights_status IS
  'Rights posture for extracted_text. Use licensed, institution_provided, or public_domain before generating lessons from text.';

CREATE INDEX IF NOT EXISTS idx_programmes_curriculum
  ON public.programmes(country, curriculum_family, grade);
CREATE INDEX IF NOT EXISTS idx_courses_curriculum
  ON public.courses(country, curriculum_family, grade, curriculum_subject_slug);
CREATE INDEX IF NOT EXISTS idx_course_materials_curriculum
  ON public.course_materials(course_id, material_role, material_rights_status);

-- ============================================================================
-- 2. Curriculum source-of-truth mapping table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.curriculum_scope_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  curriculum_family text NOT NULL,
  grade int NOT NULL,
  subject text NOT NULL,
  subject_slug text NOT NULL,
  curriculum_code text,
  strand text,
  sub_strand text,
  syllabus_reference text,
  expected_material_role text CHECK (
    expected_material_role IS NULL OR expected_material_role IN (
      'teacher_guide',
      'learner_book',
      'reference_text',
      'syllabus',
      'institution_excerpt',
      'other'
    )
  ),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  course_material_id uuid REFERENCES public.course_materials(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  coverage_status text NOT NULL DEFAULT 'unmapped'
    CHECK (coverage_status IN ('unmapped','material_mapped','lesson_drafted','published')),
  source_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_curriculum_scope_unique
  ON public.curriculum_scope_mappings(
    country,
    curriculum_family,
    grade,
    subject_slug,
    COALESCE(curriculum_code, ''),
    COALESCE(strand, ''),
    COALESCE(sub_strand, ''),
    COALESCE(syllabus_reference, '')
  );
CREATE INDEX IF NOT EXISTS idx_curriculum_scope_course
  ON public.curriculum_scope_mappings(course_id, coverage_status);
CREATE INDEX IF NOT EXISTS idx_curriculum_scope_lesson
  ON public.curriculum_scope_mappings(lesson_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.curriculum_scope_mappings TO authenticated;
GRANT ALL ON public.curriculum_scope_mappings TO service_role;
ALTER TABLE public.curriculum_scope_mappings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "curriculum scope read staff" ON public.curriculum_scope_mappings;
CREATE POLICY "curriculum scope read staff" ON public.curriculum_scope_mappings
  FOR SELECT TO authenticated
  USING (
    public.is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = course_id
        AND (
          public.is_institution_member(c.institution_id, auth.uid())
          OR public.is_enrolled(c.id, auth.uid())
        )
    )
  );

DROP POLICY IF EXISTS "curriculum scope write staff" ON public.curriculum_scope_mappings;
CREATE POLICY "curriculum scope write staff" ON public.curriculum_scope_mappings
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = course_id
        AND public.has_institution_role(
          c.institution_id,
          auth.uid(),
          ARRAY['owner','admin','teacher']::public.member_role[]
        )
    )
  );

DROP POLICY IF EXISTS "curriculum scope update staff" ON public.curriculum_scope_mappings;
CREATE POLICY "curriculum scope update staff" ON public.curriculum_scope_mappings
  FOR UPDATE TO authenticated
  USING (
    public.is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = course_id
        AND public.has_institution_role(
          c.institution_id,
          auth.uid(),
          ARRAY['owner','admin','teacher']::public.member_role[]
        )
    )
  )
  WITH CHECK (
    public.is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = course_id
        AND public.has_institution_role(
          c.institution_id,
          auth.uid(),
          ARRAY['owner','admin','teacher']::public.member_role[]
        )
    )
  );

DROP POLICY IF EXISTS "curriculum scope delete staff" ON public.curriculum_scope_mappings;
CREATE POLICY "curriculum scope delete staff" ON public.curriculum_scope_mappings
  FOR DELETE TO authenticated
  USING (
    public.is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = course_id
        AND public.has_institution_role(
          c.institution_id,
          auth.uid(),
          ARRAY['owner','admin','teacher']::public.member_role[]
        )
    )
  );

DROP TRIGGER IF EXISTS curriculum_scope_mappings_updated ON public.curriculum_scope_mappings;
CREATE TRIGGER curriculum_scope_mappings_updated BEFORE UPDATE ON public.curriculum_scope_mappings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 3. Seed Kenyan CBC programme shells and course shells
-- ============================================================================
INSERT INTO public.institutions (slug, name, type, status, contact_email, created_at, updated_at)
VALUES ('kingpin-academy', 'KingPin Academy', 'other', 'active', 'hello@kingpin.co.ke', now(), now())
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  contact_email = EXCLUDED.contact_email,
  updated_at = now();

WITH kp AS (
  SELECT id FROM public.institutions WHERE slug = 'kingpin-academy'
),
programme_seed(grade, title, level, source_url) AS (
  VALUES
    (6, 'Kenyan CBC Grade 6', 'Grade 6', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (7, 'Kenyan CBC Grade 7', 'Grade 7', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (8, 'Kenyan CBC Grade 8', 'Grade 8', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (9, 'Kenyan CBC Grade 9', 'Grade 9', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/')
)
INSERT INTO public.programmes (
  institution_id,
  title,
  description,
  level,
  subject_area,
  target_learners,
  learning_outcomes,
  status,
  country,
  curriculum_family,
  grade,
  curriculum_metadata,
  created_at,
  updated_at
)
SELECT
  kp.id,
  s.title,
  'KingPin-owned Kenyan CBC curriculum container for licensed source materials and curated Klassruum lessons.',
  s.level,
  'Kenyan CBC',
  s.level || ' learners',
  '["CBC-aligned lesson coverage","Licensed-material traceability","Classroom-ready structured lessons"]'::jsonb,
  'active',
  'Kenya',
  'CBC',
  s.grade,
  jsonb_build_object(
    'source_url', s.source_url,
    'rights_rule', 'Do not seed raw textbook text; ingest only licensed or institution-provided material.'
  ),
  now(),
  now()
FROM kp
CROSS JOIN programme_seed s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.programmes p
  WHERE p.institution_id = kp.id
    AND p.title = s.title
);

WITH kp AS (
  SELECT id FROM public.institutions WHERE slug = 'kingpin-academy'
),
programme_seed(grade, title, level, source_url) AS (
  VALUES
    (6, 'Kenyan CBC Grade 6', 'Grade 6', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (7, 'Kenyan CBC Grade 7', 'Grade 7', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (8, 'Kenyan CBC Grade 8', 'Grade 8', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (9, 'Kenyan CBC Grade 9', 'Grade 9', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/')
)
UPDATE public.programmes p
SET
  description = 'KingPin-owned Kenyan CBC curriculum container for licensed source materials and curated Klassruum lessons.',
  level = s.level,
  subject_area = 'Kenyan CBC',
  target_learners = s.level || ' learners',
  learning_outcomes = '["CBC-aligned lesson coverage","Licensed-material traceability","Classroom-ready structured lessons"]'::jsonb,
  status = 'active',
  country = 'Kenya',
  curriculum_family = 'CBC',
  grade = s.grade,
  curriculum_metadata = jsonb_build_object(
    'source_url', s.source_url,
    'rights_rule', 'Do not seed raw textbook text; ingest only licensed or institution-provided material.'
  ),
  updated_at = now()
FROM kp, programme_seed s
WHERE p.institution_id = kp.id
  AND p.title = s.title;

WITH kp AS (
  SELECT id FROM public.institutions WHERE slug = 'kingpin-academy'
),
subjects(grade, subject, subject_slug, source_url) AS (
  VALUES
    (6, 'Agriculture', 'agriculture', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Arabic', 'arabic', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Creative Arts', 'creative-arts', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'CRE', 'cre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'English', 'english', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'French', 'french', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'German', 'german', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'HRE', 'hre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Indigenous Language', 'indigenous-language', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'IRE', 'ire', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Kiswahili', 'kiswahili', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Mandarin', 'mandarin', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Mathematics', 'mathematics', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Science and Technology', 'science-and-technology', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (6, 'Social Studies', 'social-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/'),
    (7, 'Agriculture', 'agriculture', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Arabic', 'arabic', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Creative Arts', 'creative-arts', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'CRE', 'cre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'English', 'english', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'French', 'french', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'German', 'german', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'HRE', 'hre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Indigenous Language', 'indigenous-language', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Integrated Science', 'integrated-science', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'IRE', 'ire', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Kiswahili', 'kiswahili', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Mandarin', 'mandarin', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Mathematics', 'mathematics', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Pre-Technical Studies', 'pre-technical-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (7, 'Social Studies', 'social-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/'),
    (8, 'Agriculture', 'agriculture', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Arabic', 'arabic', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Creative Arts', 'creative-arts', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'CRE', 'cre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'English', 'english', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'French', 'french', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'German', 'german', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'HRE', 'hre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Indigenous Language', 'indigenous-language', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Integrated Science', 'integrated-science', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'IRE', 'ire', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Kiswahili', 'kiswahili', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Mandarin', 'mandarin', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Mathematics', 'mathematics', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Pre-Technical Studies', 'pre-technical-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (8, 'Social Studies', 'social-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/'),
    (9, 'Agriculture', 'agriculture', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Arabic', 'arabic', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Creative Arts', 'creative-arts', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'CRE', 'cre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'English', 'english', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'French', 'french', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'German', 'german', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'HRE', 'hre', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Indigenous Language', 'indigenous-language', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Integrated Science', 'integrated-science', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'IRE', 'ire', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Kiswahili', 'kiswahili', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Mandarin', 'mandarin', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Mathematics', 'mathematics', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Pre-Technical Studies', 'pre-technical-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/'),
    (9, 'Social Studies', 'social-studies', 'https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/')
),
programme_rows AS (
  SELECT DISTINCT ON (p.grade)
    p.id,
    p.grade
  FROM public.programmes p
  JOIN kp ON kp.id = p.institution_id
  WHERE p.country = 'Kenya'
    AND p.curriculum_family = 'CBC'
    AND p.grade IN (6, 7, 8, 9)
  ORDER BY p.grade, p.created_at
)
INSERT INTO public.courses (
  institution_id,
  programme_id,
  slug,
  title,
  description,
  subject,
  level,
  status,
  source_type,
  price_usd,
  currency,
  pricing_label,
  lesson_generation_mode,
  country,
  curriculum_family,
  grade,
  curriculum_subject,
  curriculum_subject_slug,
  curriculum_metadata,
  created_at,
  updated_at
)
SELECT
  kp.id,
  p.id,
  'kenyan-cbc-grade-' || s.grade || '-' || s.subject_slug,
  'Kenyan CBC Grade ' || s.grade || ' ' || s.subject || ' - Powered by KingPin',
  'Draft KingPin-owned Kenyan CBC course shell for ' || s.subject || '. Lessons must be generated from licensed or institution-provided materials and reviewed before publishing.',
  s.subject,
  'Grade ' || s.grade,
  'draft',
  'kingpin',
  0,
  'USD',
  'Institution pilot',
  'manual',
  'Kenya',
  'CBC',
  s.grade,
  s.subject,
  s.subject_slug,
  jsonb_build_object(
    'source_url', s.source_url,
    'release_policy', 'admin_or_institution_visible_until_qa',
    'rights_rule', 'Metadata may be seeded; source text must come from licensed or institution-provided materials.'
  ),
  now(),
  now()
FROM kp
JOIN subjects s ON true
JOIN programme_rows p ON p.grade = s.grade
ON CONFLICT (institution_id, slug) DO UPDATE SET
  programme_id = EXCLUDED.programme_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  level = EXCLUDED.level,
  source_type = 'kingpin',
  price_usd = EXCLUDED.price_usd,
  currency = EXCLUDED.currency,
  pricing_label = EXCLUDED.pricing_label,
  lesson_generation_mode = EXCLUDED.lesson_generation_mode,
  country = EXCLUDED.country,
  curriculum_family = EXCLUDED.curriculum_family,
  grade = EXCLUDED.grade,
  curriculum_subject = EXCLUDED.curriculum_subject,
  curriculum_subject_slug = EXCLUDED.curriculum_subject_slug,
  curriculum_metadata = EXCLUDED.curriculum_metadata,
  updated_at = now();

-- ============================================================================
-- 4. Completeness validation view for rollout checks
-- ============================================================================
CREATE OR REPLACE VIEW public.kingpin_kenyan_cbc_course_completeness AS
WITH expected_subjects(grade, subject, subject_slug) AS (
  VALUES
    (6, 'Agriculture', 'agriculture'),
    (6, 'Arabic', 'arabic'),
    (6, 'Creative Arts', 'creative-arts'),
    (6, 'CRE', 'cre'),
    (6, 'English', 'english'),
    (6, 'French', 'french'),
    (6, 'German', 'german'),
    (6, 'HRE', 'hre'),
    (6, 'Indigenous Language', 'indigenous-language'),
    (6, 'IRE', 'ire'),
    (6, 'Kiswahili', 'kiswahili'),
    (6, 'Mandarin', 'mandarin'),
    (6, 'Mathematics', 'mathematics'),
    (6, 'Science and Technology', 'science-and-technology'),
    (6, 'Social Studies', 'social-studies'),
    (7, 'Agriculture', 'agriculture'),
    (7, 'Arabic', 'arabic'),
    (7, 'Creative Arts', 'creative-arts'),
    (7, 'CRE', 'cre'),
    (7, 'English', 'english'),
    (7, 'French', 'french'),
    (7, 'German', 'german'),
    (7, 'HRE', 'hre'),
    (7, 'Indigenous Language', 'indigenous-language'),
    (7, 'Integrated Science', 'integrated-science'),
    (7, 'IRE', 'ire'),
    (7, 'Kiswahili', 'kiswahili'),
    (7, 'Mandarin', 'mandarin'),
    (7, 'Mathematics', 'mathematics'),
    (7, 'Pre-Technical Studies', 'pre-technical-studies'),
    (7, 'Social Studies', 'social-studies'),
    (8, 'Agriculture', 'agriculture'),
    (8, 'Arabic', 'arabic'),
    (8, 'Creative Arts', 'creative-arts'),
    (8, 'CRE', 'cre'),
    (8, 'English', 'english'),
    (8, 'French', 'french'),
    (8, 'German', 'german'),
    (8, 'HRE', 'hre'),
    (8, 'Indigenous Language', 'indigenous-language'),
    (8, 'Integrated Science', 'integrated-science'),
    (8, 'IRE', 'ire'),
    (8, 'Kiswahili', 'kiswahili'),
    (8, 'Mandarin', 'mandarin'),
    (8, 'Mathematics', 'mathematics'),
    (8, 'Pre-Technical Studies', 'pre-technical-studies'),
    (8, 'Social Studies', 'social-studies'),
    (9, 'Agriculture', 'agriculture'),
    (9, 'Arabic', 'arabic'),
    (9, 'Creative Arts', 'creative-arts'),
    (9, 'CRE', 'cre'),
    (9, 'English', 'english'),
    (9, 'French', 'french'),
    (9, 'German', 'german'),
    (9, 'HRE', 'hre'),
    (9, 'Indigenous Language', 'indigenous-language'),
    (9, 'Integrated Science', 'integrated-science'),
    (9, 'IRE', 'ire'),
    (9, 'Kiswahili', 'kiswahili'),
    (9, 'Mandarin', 'mandarin'),
    (9, 'Mathematics', 'mathematics'),
    (9, 'Pre-Technical Studies', 'pre-technical-studies'),
    (9, 'Social Studies', 'social-studies')
),
kp AS (
  SELECT id FROM public.institutions WHERE slug = 'kingpin-academy'
),
materials AS (
  SELECT
    course_id,
    COUNT(*)::int AS material_count,
    COUNT(*) FILTER (
      WHERE material_rights_status IN ('licensed','institution_provided','public_domain')
        AND processing_status = 'ready'
    )::int AS usable_material_count,
    COUNT(*) FILTER (WHERE book_title IS NOT NULL)::int AS book_metadata_count
  FROM public.course_materials
  GROUP BY course_id
),
lessons AS (
  SELECT
    l.course_id,
    COUNT(DISTINCT l.id)::int AS lesson_count,
    COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'published')::int AS published_lesson_count,
    COUNT(DISTINCT ls.id)::int AS section_count,
    COUNT(ti.id)::int AS teaching_item_count,
    COUNT(DISTINCT l.id) FILTER (
      WHERE ls.id IS NOT NULL
        AND ti.id IS NOT NULL
        AND NULLIF(BTRIM(COALESCE(ti.board_text, '')), '') IS NOT NULL
        AND NULLIF(BTRIM(COALESCE(ti.exact_spoken_text, '')), '') IS NOT NULL
        AND NULLIF(BTRIM(COALESCE(ti.teacher_explanation, '')), '') IS NOT NULL
        AND NULLIF(BTRIM(COALESCE(ti.learner_notes, '')), '') IS NOT NULL
        AND NULLIF(BTRIM(COALESCE(ti.accessible_description, '')), '') IS NOT NULL
    )::int AS detailed_lesson_count
  FROM public.lessons l
  LEFT JOIN public.lesson_sections ls ON ls.lesson_id = l.id
  LEFT JOIN public.teaching_items ti ON ti.lesson_id = l.id
  GROUP BY l.course_id
),
scopes AS (
  SELECT
    course_id,
    COUNT(*)::int AS scope_count,
    COUNT(*) FILTER (WHERE lesson_id IS NOT NULL)::int AS covered_scope_count
  FROM public.curriculum_scope_mappings
  GROUP BY course_id
)
SELECT
  e.grade,
  e.subject,
  e.subject_slug,
  p.id AS programme_id,
  c.id AS course_id,
  c.slug AS course_slug,
  c.status AS course_status,
  COALESCE(m.material_count, 0) AS material_count,
  COALESCE(m.usable_material_count, 0) AS usable_material_count,
  COALESCE(m.book_metadata_count, 0) AS book_metadata_count,
  COALESCE(l.lesson_count, 0) AS lesson_count,
  COALESCE(l.published_lesson_count, 0) AS published_lesson_count,
  COALESCE(l.section_count, 0) AS section_count,
  COALESCE(l.teaching_item_count, 0) AS teaching_item_count,
  COALESCE(l.detailed_lesson_count, 0) AS detailed_lesson_count,
  COALESCE(s.scope_count, 0) AS scope_count,
  COALESCE(s.covered_scope_count, 0) AS covered_scope_count,
  (c.id IS NOT NULL) AS has_course_shell,
  (COALESCE(m.usable_material_count, 0) > 0) AS has_usable_material,
  (COALESCE(l.lesson_count, 0) > 0) AS has_draft_lessons,
  (COALESCE(l.detailed_lesson_count, 0) > 0) AS has_detailed_lessons,
  (
    c.id IS NOT NULL
    AND COALESCE(m.usable_material_count, 0) > 0
    AND COALESCE(s.scope_count, 0) > 0
    AND COALESCE(s.scope_count, 0) = COALESCE(s.covered_scope_count, 0)
    AND COALESCE(l.published_lesson_count, 0) > 0
  ) AS ready_for_publish_review
FROM expected_subjects e
CROSS JOIN kp
LEFT JOIN public.programmes p
  ON p.institution_id = kp.id
  AND p.country = 'Kenya'
  AND p.curriculum_family = 'CBC'
  AND p.grade = e.grade
LEFT JOIN public.courses c
  ON c.institution_id = kp.id
  AND c.country = 'Kenya'
  AND c.curriculum_family = 'CBC'
  AND c.grade = e.grade
  AND c.curriculum_subject_slug = e.subject_slug
LEFT JOIN materials m ON m.course_id = c.id
LEFT JOIN lessons l ON l.course_id = c.id
LEFT JOIN scopes s ON s.course_id = c.id;

GRANT SELECT ON public.kingpin_kenyan_cbc_course_completeness TO authenticated;
