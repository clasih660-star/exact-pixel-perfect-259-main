ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('platform_admin','institution_admin','owner','teacher','student','parent'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS teacher_type text
    CHECK (teacher_type IN ('private','institution','kingpin')),
  ADD COLUMN IF NOT EXISTS learner_type text
    CHECK (learner_type IN ('institution','private','teacher_enrolled')),
  ADD COLUMN IF NOT EXISTS institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS public_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS student_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS teacher_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS institution_code text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_institution_id ON public.profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE FUNCTION public.generate_profile_public_id(
  _role text,
  _institution_id uuid DEFAULT NULL
)
RETURNS TABLE(public_id text, student_number text, teacher_number text, institution_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_part text := to_char(now(), 'YYYY');
  institution_slug text;
  inst_prefix text;
  next_value bigint;
BEGIN
  IF _institution_id IS NOT NULL THEN
    SELECT upper(left(regexp_replace(slug, '[^a-zA-Z0-9]', '', 'g'), 6))
    INTO institution_slug
    FROM public.institutions
    WHERE id = _institution_id;
  END IF;

  inst_prefix := COALESCE(NULLIF(institution_slug, ''), 'KLS');

  LOOP
    next_value := floor(random() * 900000 + 100000)::bigint;
    public_id := format('KLA-%s-%s', year_part, next_value);
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.public_id = generate_profile_public_id.public_id
    );
  END LOOP;

  student_number := NULL;
  teacher_number := NULL;
  institution_code := NULL;

  IF _role = 'student' THEN
    LOOP
      next_value := floor(random() * 900000 + 100000)::bigint;
      student_number := format('STU-%s-%s', inst_prefix, next_value);
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.student_number = generate_profile_public_id.student_number
      );
    END LOOP;
  ELSIF _role = 'teacher' THEN
    LOOP
      next_value := floor(random() * 900000 + 100000)::bigint;
      teacher_number := format('TCH-%s-%s', inst_prefix, next_value);
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.teacher_number = generate_profile_public_id.teacher_number
      );
    END LOOP;
  ELSIF _role IN ('institution_admin', 'owner') THEN
    LOOP
      next_value := floor(random() * 9000 + 1000)::bigint;
      institution_code := format('INS-%s-%s', inst_prefix, next_value);
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.institution_code = generate_profile_public_id.institution_code
      );
    END LOOP;
  END IF;

  RETURN NEXT;
END;
$$;
