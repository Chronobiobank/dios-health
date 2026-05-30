-- Repair public.profiles when base columns from 001_auth_dashboard.sql were never applied.
-- Run in Supabase SQL Editor BEFORE or as part of run-patient-signup-fields.sql

alter table public.profiles
  add column if not exists role text,
  add column if not exists full_name text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists avatar_path text;

-- Backfill role for any existing rows (adjust manually if you have clinician accounts)
update public.profiles
set role = 'patient'
where role is null;

do $$
begin
  alter table public.profiles
    add constraint profiles_role_check check (role in ('patient', 'clinician'));
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  alter column role set not null;

-- Ensure RLS + self-service policies exist (safe if already present)
alter table public.profiles enable row level security;

do $$
begin
  create policy "Users can read own profile"
    on public.profiles for select
    using (auth.uid() = id);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can insert own profile"
    on public.profiles for insert
    with check (auth.uid() = id);
exception
  when duplicate_object then null;
end $$;

-- Verify profiles columns
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
order by ordinal_position;
