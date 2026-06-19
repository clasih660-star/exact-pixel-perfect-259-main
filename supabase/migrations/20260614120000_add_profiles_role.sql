-- Add role column to profiles for OAuth and role-based routing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

COMMENT ON COLUMN public.profiles.role IS 'User role: student, teacher, parent, institution_admin, platform_admin, owner';
