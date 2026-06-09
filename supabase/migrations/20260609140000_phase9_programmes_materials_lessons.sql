-- Phase 9: Academic hierarchy for AI-generated, teachable classroom experiences.
--
-- Institution → Programme → Course → Course Materials → Lessons
--   → Lesson Sections → Teaching Items → Classroom Sessions
--   → Progress / Notes / Transcript / Learner Questions / Learning Results
--
-- This migration is ADDITIVE and idempotent. It introduces the Programme layer
-- above Courses, course material ingestion (with extracted images), a structured
-- lesson content model (sections + teaching items), recorded learner questions
-- (answered from course context), and per-session learning results.
--
-- Conventions reused from earlier phases:
--   helpers  : public.is_institution_member / public.is_enrolled / public.has_institution_role
--   roles    : public.member_role ('owner','admin','teacher','student')
--   trigger  : public.set_updated_at()
--   grants   : authenticated (CRUD) + service_role (ALL); RLS enabled per table.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Programmes  (Institution → Programmes)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.programmes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  level text,
  subject_area text,
  target_learners text,
  learning_outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  start_date date,
  end_date date,
  timeline_weeks int,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programmes TO authenticated;
GRANT ALL ON public.programmes TO service_role;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Courses gain a Programme parent + generation settings (kept nullable so
--    existing courses remain valid).
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS programme_id uuid REFERENCES public.programmes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS timeline_weeks int,
  ADD COLUMN IF NOT EXISTS lesson_generation_mode text
    DEFAULT 'manual' CHECK (lesson_generation_mode IN ('auto','manual','mixed')),
  ADD COLUMN IF NOT EXISTS target_lesson_count int;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Course Materials  (Course → Materials)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'text'
    CHECK (type IN ('pdf','document','slide','image','text','link','worksheet','syllabus')),
  file_url text,
  link_url text,
  extracted_text text,
  syllabus_reference text,
  processing_status text NOT NULL DEFAULT 'pending'
    CHECK (processing_status IN ('pending','processing','ready','failed')),
  processing_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_materials TO authenticated;
GRANT ALL ON public.course_materials TO service_role;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Material Images  (extracted from materials, placed on the whiteboard)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.material_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_material_id uuid NOT NULL REFERENCES public.course_materials(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  extracted_context text,
  suggested_lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.material_images TO authenticated;
GRANT ALL ON public.material_images TO service_role;
ALTER TABLE public.material_images ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Lessons gain Programme link + structured generation metadata.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS programme_id uuid REFERENCES public.programmes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS objective text,
  ADD COLUMN IF NOT EXISTS syllabus_reference text,
  ADD COLUMN IF NOT EXISTS minimum_duration_minutes int NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS estimated_duration_minutes int,
  ADD COLUMN IF NOT EXISTS source_material_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS generation_mode text
    DEFAULT 'manual' CHECK (generation_mode IN ('auto','manual','mixed'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Lesson Sections  (Lesson → Sections)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN (
    'welcome','objective','why_it_matters','prerequisite_check','concept',
    'worked_example','question_checkpoint','required_middle_question',
    'guided_practice','independent_practice','correction','summary',
    'exit_reflection','homework'
  )),
  order_index int NOT NULL DEFAULT 0,
  estimated_minutes int NOT NULL DEFAULT 2,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_sections TO authenticated;
GRANT ALL ON public.lesson_sections TO service_role;
ALTER TABLE public.lesson_sections ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Teaching Items  (Section → Items shown on the board, with what the
--    teacher reads, explains, and what is saved to learner notes)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teaching_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.lesson_sections(id) ON DELETE CASCADE,
  order_index int NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN (
    'heading','bullet','equation','calculation','image','diagram',
    'question','answer','correction','instruction','concept'
  )),
  board_text text,
  image_url text,
  image_alt text,
  exact_spoken_text text NOT NULL DEFAULT '',
  teacher_explanation text NOT NULL DEFAULT '',
  learner_notes text NOT NULL DEFAULT '',
  accessible_description text NOT NULL DEFAULT '',
  why_this_matters text,
  common_mistake text,
  writing_speed text DEFAULT 'normal' CHECK (writing_speed IN ('slow','normal','fast')),
  estimated_seconds int NOT NULL DEFAULT 8,
  source_material_id uuid REFERENCES public.course_materials(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teaching_items TO authenticated;
GRANT ALL ON public.teaching_items TO service_role;
ALTER TABLE public.teaching_items ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Learner Questions  (asked in class, answered from course/lesson context)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learner_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_type text,
  board_item_ref text,
  question_text text NOT NULL,
  answer_text text,
  answer_word_count int,
  context_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  answer_source text NOT NULL DEFAULT 'ai' CHECK (answer_source IN ('ai','teacher','fallback')),
  learning_mode text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_questions TO authenticated;
GRANT ALL ON public.learner_questions TO service_role;
ALTER TABLE public.learner_questions ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Learning Results  (per session: activity & evidence — no grading/exams)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learning_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('not_started','in_progress','paused','needs_review','completed','replayed')),
  progress_percentage int NOT NULL DEFAULT 0,
  time_spent_seconds int NOT NULL DEFAULT 0,
  current_section text,
  resume_point_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  questions_asked int NOT NULL DEFAULT 0,
  raised_hands int NOT NULL DEFAULT 0,
  practice_attempts int NOT NULL DEFAULT 0,
  practice_correct int NOT NULL DEFAULT 0,
  hints_used int NOT NULL DEFAULT 0,
  middle_question_correct boolean,
  confidence_checks_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  misconceptions_detected int NOT NULL DEFAULT 0,
  weak_areas jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes_saved boolean NOT NULL DEFAULT false,
  transcript_saved boolean NOT NULL DEFAULT false,
  events_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_results TO authenticated;
GRANT ALL ON public.learning_results TO service_role;
ALTER TABLE public.learning_results ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS POLICIES (drop-then-create so the migration is re-runnable)
-- ─────────────────────────────────────────────────────────────────────────────

-- Programmes: readable by institution members; authored by owner/admin.
DROP POLICY IF EXISTS "programmes read members" ON public.programmes;
CREATE POLICY "programmes read members" ON public.programmes FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()));
DROP POLICY IF EXISTS "programmes write staff" ON public.programmes;
CREATE POLICY "programmes write staff" ON public.programmes FOR INSERT TO authenticated
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));
DROP POLICY IF EXISTS "programmes update staff" ON public.programmes;
CREATE POLICY "programmes update staff" ON public.programmes FOR UPDATE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));
DROP POLICY IF EXISTS "programmes delete staff" ON public.programmes;
CREATE POLICY "programmes delete staff" ON public.programmes FOR DELETE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::member_role[]));

-- Course materials: readable by members/enrolled; authored by owner/admin/teacher.
DROP POLICY IF EXISTS "course_materials read" ON public.course_materials;
CREATE POLICY "course_materials read" ON public.course_materials FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
DROP POLICY IF EXISTS "course_materials insert staff" ON public.course_materials;
CREATE POLICY "course_materials insert staff" ON public.course_materials FOR INSERT TO authenticated
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "course_materials update staff" ON public.course_materials;
CREATE POLICY "course_materials update staff" ON public.course_materials FOR UPDATE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "course_materials delete staff" ON public.course_materials;
CREATE POLICY "course_materials delete staff" ON public.course_materials FOR DELETE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

-- Material images: same access shape as materials.
DROP POLICY IF EXISTS "material_images read" ON public.material_images;
CREATE POLICY "material_images read" ON public.material_images FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
DROP POLICY IF EXISTS "material_images write staff" ON public.material_images;
CREATE POLICY "material_images write staff" ON public.material_images FOR INSERT TO authenticated
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "material_images update staff" ON public.material_images;
CREATE POLICY "material_images update staff" ON public.material_images FOR UPDATE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "material_images delete staff" ON public.material_images;
CREATE POLICY "material_images delete staff" ON public.material_images FOR DELETE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

-- Lesson sections: readable by members/enrolled; authored by staff.
DROP POLICY IF EXISTS "lesson_sections read" ON public.lesson_sections;
CREATE POLICY "lesson_sections read" ON public.lesson_sections FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
DROP POLICY IF EXISTS "lesson_sections write staff" ON public.lesson_sections;
CREATE POLICY "lesson_sections write staff" ON public.lesson_sections FOR INSERT TO authenticated
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "lesson_sections update staff" ON public.lesson_sections;
CREATE POLICY "lesson_sections update staff" ON public.lesson_sections FOR UPDATE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "lesson_sections delete staff" ON public.lesson_sections;
CREATE POLICY "lesson_sections delete staff" ON public.lesson_sections FOR DELETE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

-- Teaching items: same as sections.
DROP POLICY IF EXISTS "teaching_items read" ON public.teaching_items;
CREATE POLICY "teaching_items read" ON public.teaching_items FOR SELECT TO authenticated
USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_enrolled(course_id, auth.uid()));
DROP POLICY IF EXISTS "teaching_items write staff" ON public.teaching_items;
CREATE POLICY "teaching_items write staff" ON public.teaching_items FOR INSERT TO authenticated
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "teaching_items update staff" ON public.teaching_items;
CREATE POLICY "teaching_items update staff" ON public.teaching_items FOR UPDATE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]))
WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));
DROP POLICY IF EXISTS "teaching_items delete staff" ON public.teaching_items;
CREATE POLICY "teaching_items delete staff" ON public.teaching_items FOR DELETE TO authenticated
USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[]));

-- Learner questions: a learner manages their own; staff can read.
DROP POLICY IF EXISTS "learner_questions read self or staff" ON public.learner_questions;
CREATE POLICY "learner_questions read self or staff" ON public.learner_questions FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);
DROP POLICY IF EXISTS "learner_questions insert self" ON public.learner_questions;
CREATE POLICY "learner_questions insert self" ON public.learner_questions FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());
DROP POLICY IF EXISTS "learner_questions update self" ON public.learner_questions;
CREATE POLICY "learner_questions update self" ON public.learner_questions FOR UPDATE TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Learning results: a learner manages their own; staff can read.
DROP POLICY IF EXISTS "learning_results read self or staff" ON public.learning_results;
CREATE POLICY "learning_results read self or staff" ON public.learning_results FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);
DROP POLICY IF EXISTS "learning_results insert self" ON public.learning_results;
CREATE POLICY "learning_results insert self" ON public.learning_results FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());
DROP POLICY IF EXISTS "learning_results update self" ON public.learning_results;
CREATE POLICY "learning_results update self" ON public.learning_results FOR UPDATE TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS programmes_updated ON public.programmes;
CREATE TRIGGER programmes_updated BEFORE UPDATE ON public.programmes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS course_materials_updated ON public.course_materials;
CREATE TRIGGER course_materials_updated BEFORE UPDATE ON public.course_materials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS lesson_sections_updated ON public.lesson_sections;
CREATE TRIGGER lesson_sections_updated BEFORE UPDATE ON public.lesson_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS teaching_items_updated ON public.teaching_items;
CREATE TRIGGER teaching_items_updated BEFORE UPDATE ON public.teaching_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS learning_results_updated ON public.learning_results;
CREATE TRIGGER learning_results_updated BEFORE UPDATE ON public.learning_results
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_programmes_institution ON public.programmes(institution_id, status);
CREATE INDEX IF NOT EXISTS idx_courses_programme ON public.courses(programme_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course ON public.course_materials(course_id, processing_status);
CREATE INDEX IF NOT EXISTS idx_material_images_material ON public.material_images(course_material_id);
CREATE INDEX IF NOT EXISTS idx_material_images_course ON public.material_images(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_programme ON public.lessons(programme_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lesson_sections_lesson ON public.lesson_sections(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_teaching_items_section ON public.teaching_items(section_id, order_index);
CREATE INDEX IF NOT EXISTS idx_teaching_items_lesson ON public.teaching_items(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_learner_questions_student ON public.learner_questions(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learner_questions_lesson ON public.learner_questions(lesson_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_results_student ON public.learning_results(student_id, last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_results_lesson ON public.learning_results(lesson_id);
