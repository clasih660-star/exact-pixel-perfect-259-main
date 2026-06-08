
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_institution_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_institution_role(uuid, uuid, public.member_role[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_institution_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_institution_role(uuid, uuid, public.member_role[]) TO authenticated;
