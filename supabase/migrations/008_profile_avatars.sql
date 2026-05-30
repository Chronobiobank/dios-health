-- Profile photos for patients and clinicians (stored on shared profiles row)
-- Run in Supabase SQL Editor or via: supabase db push

alter table public.profiles
  add column if not exists avatar_path text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;

create policy "Users manage own avatar files"
on storage.objects for all
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
