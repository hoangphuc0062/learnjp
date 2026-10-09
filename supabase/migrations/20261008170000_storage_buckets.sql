-- Public course resources and private per-user files.
insert into storage.buckets (id, name, public, file_size_limit)
values ('public', 'public', true, 10485760), ('private', 'private', false, 10485760)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

-- All users can read public course assets; uploads are performed by trusted admins.
drop policy if exists "LearnJP public assets read" on storage.objects;
create policy "LearnJP public assets read" on storage.objects
for select to anon, authenticated using (bucket_id = 'public');

-- Users own the objects under private/<auth.uid()>/..., never other users' folders.
drop policy if exists "LearnJP private assets read" on storage.objects;
create policy "LearnJP private assets read" on storage.objects
for select to authenticated using (bucket_id = 'private' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "LearnJP private assets insert" on storage.objects;
create policy "LearnJP private assets insert" on storage.objects
for insert to authenticated with check (bucket_id = 'private' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "LearnJP private assets update" on storage.objects;
create policy "LearnJP private assets update" on storage.objects
for update to authenticated using (bucket_id = 'private' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'private' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "LearnJP private assets delete" on storage.objects;
create policy "LearnJP private assets delete" on storage.objects
for delete to authenticated using (bucket_id = 'private' and (storage.foldername(name))[1] = (select auth.uid())::text);
