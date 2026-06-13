-- Local/no-paid-API AI teacher voice support.
-- Adds reusable teacher identity, local voice profiles, and speech asset cache.

CREATE TABLE IF NOT EXISTS public.ai_teacher_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES public.institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject_specialty text,
  image_url text,
  video_placeholder_url text,
  teaching_style text NOT NULL DEFAULT 'step_by_step',
  default_pace text NOT NULL DEFAULT 'normal',
  explanation_depth text NOT NULL DEFAULT 'standard',
  encouragement_style text NOT NULL DEFAULT 'gentle',
  is_builtin boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teacher_voice_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_profile_id uuid REFERENCES public.ai_teacher_profiles(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('browser', 'piper', 'kokoro')),
  local_voice_id text NOT NULL,
  display_name text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  accent text,
  tone text NOT NULL DEFAULT 'calm',
  default_speed numeric DEFAULT 0.95,
  pause_between_sentences_ms int DEFAULT 500,
  is_builtin boolean DEFAULT true,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teacher_speech_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
  teaching_item_id text,
  teacher_profile_id uuid REFERENCES public.ai_teacher_profiles(id),
  voice_profile_id uuid REFERENCES public.teacher_voice_profiles(id),
  speech_type text NOT NULL,
  text_hash text NOT NULL UNIQUE,
  caption_text text NOT NULL,
  spoken_text text NOT NULL,
  audio_url text,
  duration_ms int,
  provider text NOT NULL,
  local_voice_id text NOT NULL,
  from_cache boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_teacher_profiles_institution ON public.ai_teacher_profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_teacher_voice_profiles_teacher ON public.teacher_voice_profiles(teacher_profile_id);
CREATE INDEX IF NOT EXISTS idx_teacher_speech_assets_session ON public.teacher_speech_assets(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_teacher_speech_assets_hash ON public.teacher_speech_assets(text_hash);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_teacher_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_voice_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_speech_assets TO authenticated;
GRANT ALL ON public.ai_teacher_profiles TO service_role;
GRANT ALL ON public.teacher_voice_profiles TO service_role;
GRANT ALL ON public.teacher_speech_assets TO service_role;

ALTER TABLE public.ai_teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_speech_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_teacher_profiles read builtin or members" ON public.ai_teacher_profiles;
CREATE POLICY "ai_teacher_profiles read builtin or members" ON public.ai_teacher_profiles FOR SELECT TO authenticated
USING (
  is_builtin = true
  OR institution_id IS NULL
  OR public.is_institution_member(institution_id, auth.uid())
);

DROP POLICY IF EXISTS "ai_teacher_profiles manage staff" ON public.ai_teacher_profiles;
CREATE POLICY "ai_teacher_profiles manage staff" ON public.ai_teacher_profiles FOR ALL TO authenticated
USING (
  institution_id IS NULL
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
)
WITH CHECK (
  institution_id IS NULL
  OR public.has_institution_role(institution_id, auth.uid(), ARRAY['owner','admin','teacher']::member_role[])
);

DROP POLICY IF EXISTS "teacher_voice_profiles read active" ON public.teacher_voice_profiles;
CREATE POLICY "teacher_voice_profiles read active" ON public.teacher_voice_profiles FOR SELECT TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "teacher_voice_profiles manage staff" ON public.teacher_voice_profiles;
CREATE POLICY "teacher_voice_profiles manage staff" ON public.teacher_voice_profiles FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "teacher_speech_assets read participants" ON public.teacher_speech_assets;
CREATE POLICY "teacher_speech_assets read participants" ON public.teacher_speech_assets FOR SELECT TO authenticated
USING (
  session_id IS NULL
  OR public.is_session_participant(session_id, auth.uid())
);

DROP POLICY IF EXISTS "teacher_speech_assets insert authenticated" ON public.teacher_speech_assets;
CREATE POLICY "teacher_speech_assets insert authenticated" ON public.teacher_speech_assets FOR INSERT TO authenticated
WITH CHECK (true);

DROP TRIGGER IF EXISTS ai_teacher_profiles_updated ON public.ai_teacher_profiles;
CREATE TRIGGER ai_teacher_profiles_updated BEFORE UPDATE ON public.ai_teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS teacher_voice_profiles_updated ON public.teacher_voice_profiles;
CREATE TRIGGER teacher_voice_profiles_updated BEFORE UPDATE ON public.teacher_voice_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
