-- Run this entire file in Supabase → SQL Editor (production project for dios.health)
-- Safe to re-run.

-- ─── 011: profiles base columns (required — fixes "column role does not exist") ─
alter table public.profiles
  add column if not exists role text,
  add column if not exists full_name text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists avatar_path text;

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

-- ─── 006: patient demographics ───────────────────────────────────────────────
alter table public.patient_profiles
  add column if not exists first_name text,
  add column if not exists family_name text,
  add column if not exists age int check (age is null or (age >= 13 and age <= 120)),
  add column if not exists biological_sex text check (
    biological_sex is null or biological_sex in ('female', 'male', 'intersex', 'prefer_not_to_say')
  );

-- ─── 009: onboarding + terms consent ─────────────────────────────────────────
alter table public.patient_profiles
  add column if not exists onboarding_complete boolean not null default false;

-- ─── 010: RPC (bypasses PostgREST stale column cache) ──────────────────────────
create or replace function public.save_patient_demographics(
  p_first_name text,
  p_family_name text,
  p_age integer,
  p_biological_sex text,
  p_accept_terms boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_full_name text;
  v_has_terms boolean;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_first_name is null or btrim(p_first_name) = '' then
    raise exception 'First and family name are required';
  end if;

  if p_family_name is null or btrim(p_family_name) = '' then
    raise exception 'First and family name are required';
  end if;

  if p_biological_sex is null or btrim(p_biological_sex) = '' then
    raise exception 'Biological sex is required';
  end if;

  if p_age is null or p_age < 13 or p_age > 120 then
    raise exception 'Enter a valid age between 13 and 120';
  end if;

  select terms_accepted_at is not null
  into v_has_terms
  from public.profiles
  where id = v_user_id;

  if coalesce(v_has_terms, false) = false and not coalesce(p_accept_terms, false) then
    raise exception 'You must accept the Terms of Service and Privacy Policy';
  end if;

  v_full_name := btrim(p_first_name) || ' ' || btrim(p_family_name);

  insert into public.profiles (id, role, full_name, terms_accepted_at)
  values (
    v_user_id,
    'patient',
    v_full_name,
    case when coalesce(p_accept_terms, false) then now() else null end
  )
  on conflict (id) do update
  set
    role = 'patient',
    full_name = excluded.full_name,
    terms_accepted_at = case
      when public.profiles.terms_accepted_at is not null then public.profiles.terms_accepted_at
      when coalesce(p_accept_terms, false) then now()
      else public.profiles.terms_accepted_at
    end;

  insert into public.patient_profiles (
    id,
    first_name,
    family_name,
    age,
    biological_sex
  )
  values (
    v_user_id,
    btrim(p_first_name),
    btrim(p_family_name),
    p_age,
    btrim(p_biological_sex)
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    family_name = excluded.family_name,
    age = excluded.age,
    biological_sex = excluded.biological_sex;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.save_patient_demographics(text, text, integer, text, boolean) from public;
grant execute on function public.save_patient_demographics(text, text, integer, text, boolean) to authenticated;

notify pgrst, 'reload schema';

-- ─── Verify columns ────────────────────────────────────────────────────────────
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'patient_profiles' and column_name in (
      'first_name', 'family_name', 'age', 'biological_sex', 'onboarding_complete'
    ))
    or (table_name = 'profiles' and column_name in (
      'role', 'full_name', 'terms_accepted_at'
    ))
  )
order by table_name, column_name;

-- ─── Verify RPC exists ─────────────────────────────────────────────────────────
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name = 'save_patient_demographics';
