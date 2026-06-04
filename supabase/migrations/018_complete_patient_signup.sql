-- Patient signup bootstrap: schema repair + atomic account completion RPC.
-- Run in Supabase SQL Editor if signup shows "Database error" or profile rows fail to save.

-- ─── profiles (fixes auth/signup when role column missing) ───────────────────
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

alter table public.profiles enable row level security;

-- ─── patient_profiles columns ─────────────────────────────────────────────────
alter table public.patient_profiles
  add column if not exists first_name text,
  add column if not exists family_name text,
  add column if not exists age int check (age is null or (age >= 13 and age <= 120)),
  add column if not exists biological_sex text check (
    biological_sex is null or biological_sex in ('female', 'male', 'intersex', 'prefer_not_to_say')
  ),
  add column if not exists onboarding_complete boolean not null default false,
  add column if not exists date_of_birth date;

-- ─── chronobiobank consent ───────────────────────────────────────────────────
create table if not exists public.chronobiobank_consent (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade unique,
  clinical_consent boolean not null default true,
  research_consent boolean not null default false,
  consent_version text not null default 'v1.0',
  consented_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chronobiobank_consent enable row level security;

drop policy if exists "Patients can read own chronobiobank consent" on public.chronobiobank_consent;
drop policy if exists "Patients can insert own chronobiobank consent" on public.chronobiobank_consent;
drop policy if exists "Patients can update own chronobiobank consent" on public.chronobiobank_consent;

create policy "Patients can read own chronobiobank consent"
  on public.chronobiobank_consent for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own chronobiobank consent"
  on public.chronobiobank_consent for insert
  with check (auth.uid() = patient_id);

create policy "Patients can update own chronobiobank consent"
  on public.chronobiobank_consent for update
  using (auth.uid() = patient_id)
  with check (auth.uid() = patient_id);

-- ─── Atomic signup (bypasses PostgREST column cache + RLS edge cases) ────────
create or replace function public.complete_patient_signup(
  p_first_name text,
  p_family_name text default null,
  p_research_consent boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_full_name text;
  v_family text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_first_name is null or btrim(p_first_name) = '' then
    raise exception 'First name is required';
  end if;

  v_family := nullif(btrim(coalesce(p_family_name, '')), '');
  v_full_name := btrim(p_first_name) || case
    when v_family is not null then ' ' || v_family
    else ''
  end;

  insert into public.profiles (id, role, full_name, terms_accepted_at)
  values (v_user_id, 'patient', v_full_name, now())
  on conflict (id) do update
  set
    role = 'patient',
    full_name = excluded.full_name,
    terms_accepted_at = coalesce(public.profiles.terms_accepted_at, now());

  insert into public.patient_profiles (
    id,
    first_name,
    family_name,
    onboarding_complete
  )
  values (
    v_user_id,
    btrim(p_first_name),
    v_family,
    false
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    family_name = excluded.family_name;

  insert into public.chronobiobank_consent (
    patient_id,
    clinical_consent,
    research_consent,
    consent_version
  )
  values (
    v_user_id,
    true,
    coalesce(p_research_consent, false),
    'v1.0'
  )
  on conflict (patient_id) do update
  set
    clinical_consent = true,
    research_consent = excluded.research_consent,
    consent_version = excluded.consent_version,
    updated_at = now();

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.complete_patient_signup(text, text, boolean) from public;
grant execute on function public.complete_patient_signup(text, text, boolean) to authenticated;

-- Demographics RPC should mark onboarding complete when profile is saved later
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
    biological_sex,
    onboarding_complete
  )
  values (
    v_user_id,
    btrim(p_first_name),
    btrim(p_family_name),
    p_age,
    btrim(p_biological_sex),
    true
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    family_name = excluded.family_name,
    age = excluded.age,
    biological_sex = excluded.biological_sex,
    onboarding_complete = true;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.save_patient_demographics(text, text, integer, text, boolean) from public;
grant execute on function public.save_patient_demographics(text, text, integer, text, boolean) to authenticated;

notify pgrst, 'reload schema';
