
-- Enums
CREATE TYPE public.institution_type AS ENUM (
  'school','university','college','tuition_center','online_tutor',
  'ngo','company_training','religious_institution','government_program','other'
);
CREATE TYPE public.institution_status AS ENUM ('pending','active','suspended');
CREATE TYPE public.preferred_use_case AS ENUM (
  'ai_classroom','human_teacher_classroom','hybrid_classroom',
  'training_program','exam_preparation','accessibility_focused'
);
CREATE TYPE public.member_role AS ENUM ('owner','admin','teacher','student');
CREATE TYPE public.member_status AS ENUM ('active','invited','suspended');
CREATE TYPE public.classroom_mode AS ENUM ('ai_teacher','human_teacher','hybrid');
CREATE TYPE public.classroom_status AS ENUM ('draft','active','archived');
CREATE TYPE public.resource_type AS ENUM ('pdf','text','image','link','video','audio','slides','document');
CREATE TYPE public.resource_status AS ENUM ('processing','ready','failed');

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- institutions
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.institution_type NOT NULL DEFAULT 'other',
  country TEXT,
  city TEXT,
  logo_url TEXT,
  brand_color TEXT,
  contact_email TEXT,
  phone TEXT,
  learner_count INTEGER,
  preferred_use_case public.preferred_use_case,
  status public.institution_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_institutions_updated BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- institution_members
CREATE TABLE public.institution_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.member_role NOT NULL DEFAULT 'student',
  status public.member_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (institution_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institution_members TO authenticated;
GRANT ALL ON public.institution_members TO service_role;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_members_updated BEFORE UPDATE ON public.institution_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper functions (SECURITY DEFINER avoids recursive RLS on institution_members)
CREATE OR REPLACE FUNCTION public.is_institution_member(_institution_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.institution_members
    WHERE institution_id = _institution_id AND user_id = _user_id AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_institution_role(_institution_id UUID, _user_id UUID, _roles public.member_role[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.institution_members
    WHERE institution_id = _institution_id
      AND user_id = _user_id
      AND status = 'active'
      AND role = ANY(_roles)
  );
$$;

-- institutions policies
CREATE POLICY "institutions_select_members" ON public.institutions FOR SELECT TO authenticated
  USING (public.is_institution_member(id, auth.uid()));
CREATE POLICY "institutions_insert_authenticated" ON public.institutions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "institutions_update_admins" ON public.institutions FOR UPDATE TO authenticated
  USING (public.has_institution_role(id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));
CREATE POLICY "institutions_delete_owners" ON public.institutions FOR DELETE TO authenticated
  USING (public.has_institution_role(id, auth.uid(), ARRAY['owner']::public.member_role[]));

-- members policies
CREATE POLICY "members_select_self_or_same_inst" ON public.institution_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_institution_member(institution_id, auth.uid()));
CREATE POLICY "members_insert_admin_or_self_owner" ON public.institution_members FOR INSERT TO authenticated
  WITH CHECK (
    public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[])
    OR (user_id = auth.uid() AND role = 'owner')
  );
CREATE POLICY "members_update_admins" ON public.institution_members FOR UPDATE TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));
CREATE POLICY "members_delete_admins" ON public.institution_members FOR DELETE TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

-- virtual_classrooms
CREATE TABLE public.virtual_classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  level TEXT,
  mode public.classroom_mode NOT NULL DEFAULT 'ai_teacher',
  capacity INTEGER,
  status public.classroom_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.virtual_classrooms TO authenticated;
GRANT ALL ON public.virtual_classrooms TO service_role;
ALTER TABLE public.virtual_classrooms ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_classrooms_updated BEFORE UPDATE ON public.virtual_classrooms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "classrooms_select_members" ON public.virtual_classrooms FOR SELECT TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()));
CREATE POLICY "classrooms_insert_staff" ON public.virtual_classrooms FOR INSERT TO authenticated
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));
CREATE POLICY "classrooms_update_staff" ON public.virtual_classrooms FOR UPDATE TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));
CREATE POLICY "classrooms_delete_admins" ON public.virtual_classrooms FOR DELETE TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

-- classroom_resources
CREATE TABLE public.classroom_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.virtual_classrooms(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type public.resource_type NOT NULL,
  file_url TEXT,
  external_url TEXT,
  subject TEXT,
  grade_level TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  status public.resource_status NOT NULL DEFAULT 'ready',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_resources TO authenticated;
GRANT ALL ON public.classroom_resources TO service_role;
ALTER TABLE public.classroom_resources ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON public.classroom_resources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "resources_select_members" ON public.classroom_resources FOR SELECT TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()));
CREATE POLICY "resources_insert_staff" ON public.classroom_resources FOR INSERT TO authenticated
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));
CREATE POLICY "resources_update_staff" ON public.classroom_resources FOR UPDATE TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[]));
CREATE POLICY "resources_delete_admins" ON public.classroom_resources FOR DELETE TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin']::public.member_role[]));

CREATE INDEX idx_members_user ON public.institution_members(user_id);
CREATE INDEX idx_members_institution ON public.institution_members(institution_id);
CREATE INDEX idx_classrooms_institution ON public.virtual_classrooms(institution_id);
CREATE INDEX idx_resources_institution ON public.classroom_resources(institution_id);
