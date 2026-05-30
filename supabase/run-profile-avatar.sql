-- Profile photo storage for dios.health
-- Run in Supabase → SQL Editor (safe to re-run)

alter table public.profiles
  add column if not exists avatar_path text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;

drop policy if exists "Users manage own avatar files" on storage.objects;

create policy "Users manage own avatar files"
on storage.objects for all
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.save_avatar_path(p_avatar_path text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set avatar_path = p_avatar_path
  where id = auth.uid();

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.save_avatar_path(text) from public;
grant execute on function public.save_avatar_path(text) to authenticated;

notify pgrst, 'reload schema';

-- Verify
select id, name, public from storage.buckets where id = 'avatars';

select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name = 'avatar_path';

select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name = 'save_avatar_path';
