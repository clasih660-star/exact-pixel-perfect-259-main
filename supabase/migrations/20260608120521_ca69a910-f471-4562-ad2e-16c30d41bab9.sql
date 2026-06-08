
-- Files stored as: <institution_id>/<rest-of-path>
CREATE POLICY "resources_storage_select" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'resources'
    AND public.is_institution_member((string_to_array(name, '/'))[1]::uuid, auth.uid())
  );
CREATE POLICY "resources_storage_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'resources'
    AND public.has_institution_role((string_to_array(name, '/'))[1]::uuid, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[])
  );
CREATE POLICY "resources_storage_update" ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'resources'
    AND public.has_institution_role((string_to_array(name, '/'))[1]::uuid, auth.uid(), ARRAY['owner','admin','teacher']::public.member_role[])
  );
CREATE POLICY "resources_storage_delete" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'resources'
    AND public.has_institution_role((string_to_array(name, '/'))[1]::uuid, auth.uid(), ARRAY['owner','admin']::public.member_role[])
  );
