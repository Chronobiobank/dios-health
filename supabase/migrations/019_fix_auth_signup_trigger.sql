-- Fixes "Database error saving new user" on patient signup (auth.signUp).
-- Run in Supabase SQL Editor AFTER 018_complete_patient_signup.sql.

-- ─── profiles must exist with role before any auth trigger runs ──────────────
alter table public.profiles
  add column if not exists role text,
  add column if not exists full_name text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists avatar_path text;

update public.profiles set role = 'patient' where role is null;

do $$
begin
  alter table public.profiles
    add constraint profiles_role_check check (role in ('patient', 'clinician'));
exception
  when duplicate_object then null;
end $$;

-- ─── Replace broken auth.users triggers (common cause of signup failure) ───
drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_first text;
  v_family text;
begin
  v_first := coalesce(new.raw_user_meta_data->>'first_name', '');
  v_family := coalesce(new.raw_user_meta_data->>'family_name', '');
  v_full_name := coalesce(
    nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(btrim(v_first || ' ' || v_family), ''),
    nullif(btrim(v_first), ''),
    split_part(coalesce(new.email, ''), '@', 1)
  );

  insert into public.profiles (id, role, full_name)
  values (new.id, 'patient', v_full_name)
  on conflict (id) do update
  set
    role = coalesce(public.profiles.role, 'patient'),
    full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
exception
  when others then
    -- Do not block auth.users insert — complete_patient_signup RPC finishes setup
    raise warning 'handle_new_user skipped for %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

notify pgrst, 'reload schema';
