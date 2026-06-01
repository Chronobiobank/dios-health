-- =============================================================================
-- 015_mlux_schema.sql — Prompt 2: MLux schema + Chronobiobank infrastructure
--
-- Aligns production Supabase with application code after DLMO → MLux rename.
-- Safe to re-run in SQL Editor (idempotent where possible).
--
-- Run after: 001, 005, 006+ (patient_profiles, tiptraq, legacy dlmo_profiles)
-- =============================================================================

-- ─── Chronobiobank consent (signup step 2) ───────────────────────────────────

create table if not exists public.chronobiobank_consent (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade unique,
  clinical_consent boolean not null default true,
  research_consent boolean not null default false,
  consent_version text not null default 'v1.0',
  consented_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chronobiobank_consent_patient_idx
  on public.chronobiobank_consent (patient_id);

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

-- ─── Vaya session log (dashboard first-open / engagement) ────────────────────

create table if not exists public.vaya_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now()
);

create index if not exists vaya_sessions_patient_started_idx
  on public.vaya_sessions (patient_id, started_at desc);

alter table public.vaya_sessions enable row level security;

drop policy if exists "Patients can read own vaya sessions" on public.vaya_sessions;
drop policy if exists "Patients can insert own vaya sessions" on public.vaya_sessions;

create policy "Patients can read own vaya sessions"
  on public.vaya_sessions for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own vaya sessions"
  on public.vaya_sessions for insert
  with check (auth.uid() = patient_id);

-- ─── Layer 1: smartphone observations ────────────────────────────────────────

create table if not exists public.smartphone_circadian_observations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  observed_at timestamptz not null default now(),
  mlux_phase_minutes int,
  confidence_score int check (confidence_score is null or (confidence_score between 0 and 100)),
  confidence_band_minutes int,
  confidence_label text,
  sensor_payload jsonb not null default '{}'::jsonb,
  algorithm_version text,
  created_at timestamptz not null default now()
);

-- Legacy column rename if 012 was applied with old names
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'smartphone_circadian_observations'
      and column_name = 'proxy_dlmo_minutes_from_midnight'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'smartphone_circadian_observations'
      and column_name = 'mlux_phase_minutes'
  ) then
    alter table public.smartphone_circadian_observations
      rename column proxy_dlmo_minutes_from_midnight to mlux_phase_minutes;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'smartphone_circadian_observations'
      and column_name = 'proxy_dlmo_time'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'smartphone_circadian_observations'
      and column_name = 'mlux_phase_time'
  ) then
    alter table public.smartphone_circadian_observations
      rename column proxy_dlmo_time to mlux_phase_time;
  end if;
end $$;

alter table public.smartphone_circadian_observations
  add column if not exists mlux_phase_minutes int,
  add column if not exists mlux_phase_time time,
  add column if not exists confidence_score int,
  add column if not exists confidence_band_minutes int,
  add column if not exists confidence_label text,
  add column if not exists sensor_payload jsonb not null default '{}'::jsonb,
  add column if not exists algorithm_version text;

create index if not exists smartphone_circadian_patient_observed_idx
  on public.smartphone_circadian_observations (patient_id, observed_at desc);

alter table public.smartphone_circadian_observations enable row level security;

drop policy if exists "Patients can read own smartphone circadian observations" on public.smartphone_circadian_observations;
drop policy if exists "Patients can insert own smartphone circadian observations" on public.smartphone_circadian_observations;
drop policy if exists "Patients can update own smartphone circadian observations" on public.smartphone_circadian_observations;
drop policy if exists "Clinicians can read linked patient smartphone circadian observations" on public.smartphone_circadian_observations;

create policy "Patients can read own smartphone circadian observations"
  on public.smartphone_circadian_observations for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own smartphone circadian observations"
  on public.smartphone_circadian_observations for insert
  with check (auth.uid() = patient_id);

create policy "Patients can update own smartphone circadian observations"
  on public.smartphone_circadian_observations for update
  using (auth.uid() = patient_id);

create policy "Clinicians can read linked patient smartphone circadian observations"
  on public.smartphone_circadian_observations for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = smartphone_circadian_observations.patient_id
        and cp.status = 'active'
    )
  );

-- ─── Layer 2: blood panels ───────────────────────────────────────────────────

create table if not exists public.blood_circadian_panels (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  collected_at timestamptz not null default now(),
  lab_source text not null default 'city_labs',
  vitamin_d3_nmoll numeric(8,2),
  vitamin_b12_pmoll numeric(8,2),
  ferritin_ugl numeric(8,2),
  vitamin_b5_umoll numeric(8,2),
  mlux_phase_minutes int,
  confidence_score int check (confidence_score is null or (confidence_score between 0 and 100)),
  confidence_band_minutes int,
  confidence_label text,
  raw_results jsonb not null default '{}'::jsonb,
  algorithm_version text,
  created_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blood_circadian_panels'
      and column_name = 'proxy_dlmo_minutes_from_midnight'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blood_circadian_panels'
      and column_name = 'mlux_phase_minutes'
  ) then
    alter table public.blood_circadian_panels
      rename column proxy_dlmo_minutes_from_midnight to mlux_phase_minutes;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blood_circadian_panels'
      and column_name = 'proxy_dlmo_time'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blood_circadian_panels'
      and column_name = 'mlux_phase_time'
  ) then
    alter table public.blood_circadian_panels
      rename column proxy_dlmo_time to mlux_phase_time;
  end if;
end $$;

alter table public.blood_circadian_panels
  add column if not exists mlux_phase_minutes int,
  add column if not exists confidence_score int,
  add column if not exists confidence_band_minutes int,
  add column if not exists confidence_label text;

create index if not exists blood_circadian_patient_collected_idx
  on public.blood_circadian_panels (patient_id, collected_at desc);

alter table public.blood_circadian_panels enable row level security;

drop policy if exists "Patients can read own blood circadian panels" on public.blood_circadian_panels;
drop policy if exists "Patients can insert own blood circadian panels" on public.blood_circadian_panels;
drop policy if exists "Patients can update own blood circadian panels" on public.blood_circadian_panels;
drop policy if exists "Clinicians can read linked patient blood circadian panels" on public.blood_circadian_panels;

create policy "Patients can read own blood circadian panels"
  on public.blood_circadian_panels for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own blood circadian panels"
  on public.blood_circadian_panels for insert
  with check (auth.uid() = patient_id);

create policy "Patients can update own blood circadian panels"
  on public.blood_circadian_panels for update
  using (auth.uid() = patient_id);

create policy "Clinicians can read linked patient blood circadian panels"
  on public.blood_circadian_panels for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = blood_circadian_panels.patient_id
        and cp.status = 'active'
    )
  );

-- ─── tiptraq_nights: per-night MLux phase columns ────────────────────────────

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tiptraq_nights'
      and column_name = 'proxy_dlmo_time'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tiptraq_nights'
      and column_name = 'mlux_phase_time'
  ) then
    alter table public.tiptraq_nights rename column proxy_dlmo_time to mlux_phase_time;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tiptraq_nights'
      and column_name = 'proxy_dlmo_minutes_from_midnight'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tiptraq_nights'
      and column_name = 'mlux_phase_minutes'
  ) then
    alter table public.tiptraq_nights
      rename column proxy_dlmo_minutes_from_midnight to mlux_phase_minutes;
  end if;
end $$;

alter table public.tiptraq_nights
  add column if not exists mlux_phase_time time,
  add column if not exists mlux_phase_minutes int;

-- ─── dlmo_profiles → mlux_profiles ───────────────────────────────────────────

do $$
begin
  if to_regclass('public.dlmo_profiles') is not null
     and to_regclass('public.mlux_profiles') is null then
    alter table public.dlmo_profiles rename to mlux_profiles;
  end if;
end $$;

-- Greenfield: create mlux_profiles if neither legacy nor new table exists
create table if not exists public.mlux_profiles (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade unique,
  nights_count int default 0,
  mlux_phase_time time,
  mlux_phase_minutes int,
  confidence_score int,
  confidence_band_minutes int,
  confidence_label text,
  chronotype text,
  non_dipper_confirmed boolean default false,
  last_updated timestamptz default now(),
  simvastatin_optimal_time time,
  ramipril_optimal_time time,
  prednisolone_optimal_time time,
  salmeterol_optimal_time time,
  light_dose_window_start time,
  light_dose_window_end time,
  created_at timestamptz default now()
);

-- Rename legacy profile columns when table still has old names
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mlux_profiles'
      and column_name = 'proxy_dlmo_rolling'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mlux_profiles'
      and column_name = 'mlux_phase_time'
  ) then
    alter table public.mlux_profiles rename column proxy_dlmo_rolling to mlux_phase_time;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mlux_profiles'
      and column_name = 'proxy_dlmo_minutes_from_midnight'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mlux_profiles'
      and column_name = 'mlux_phase_minutes'
  ) then
    alter table public.mlux_profiles
      rename column proxy_dlmo_minutes_from_midnight to mlux_phase_minutes;
  end if;
end $$;

-- Layer merge metadata (three-layer hierarchy)
alter table public.mlux_profiles
  add column if not exists mlux_score int,
  add column if not exists dominant_layer text check (
    dominant_layer is null or dominant_layer in ('smartphone', 'blood', 'tiptraq')
  ),
  add column if not exists layers_active smallint not null default 0,
  add column if not exists layer1_proxy_dlmo_minutes int,
  add column if not exists layer1_confidence_score int,
  add column if not exists layer1_observation_id uuid,
  add column if not exists layer1_updated_at timestamptz,
  add column if not exists layer2_proxy_dlmo_minutes int,
  add column if not exists layer2_confidence_score int,
  add column if not exists layer2_panel_id uuid,
  add column if not exists layer2_updated_at timestamptz,
  add column if not exists layer3_proxy_dlmo_minutes int,
  add column if not exists layer3_confidence_score int,
  add column if not exists layer3_updated_at timestamptz;

-- Re-attach FKs for layer observation ids (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'mlux_profiles_layer1_observation_id_fkey'
  ) then
    alter table public.mlux_profiles
      add constraint mlux_profiles_layer1_observation_id_fkey
      foreign key (layer1_observation_id)
      references public.smartphone_circadian_observations(id)
      on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'mlux_profiles_layer2_panel_id_fkey'
  ) then
    alter table public.mlux_profiles
      add constraint mlux_profiles_layer2_panel_id_fkey
      foreign key (layer2_panel_id)
      references public.blood_circadian_panels(id)
      on delete set null;
  end if;
end $$;

alter table public.mlux_profiles enable row level security;

-- Policies (recreate with mlux_profiles name if migrated from dlmo_profiles)
drop policy if exists "Patients can read own dlmo profile" on public.mlux_profiles;
drop policy if exists "Patients can insert own dlmo profile" on public.mlux_profiles;
drop policy if exists "Patients can update own dlmo profile" on public.mlux_profiles;
drop policy if exists "Clinicians can read linked patient dlmo profiles" on public.mlux_profiles;
drop policy if exists "Patients can read own mlux profile" on public.mlux_profiles;
drop policy if exists "Patients can insert own mlux profile" on public.mlux_profiles;
drop policy if exists "Patients can update own mlux profile" on public.mlux_profiles;
drop policy if exists "Clinicians can read linked patient mlux profiles" on public.mlux_profiles;

create policy "Patients can read own mlux profile"
  on public.mlux_profiles for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own mlux profile"
  on public.mlux_profiles for insert
  with check (auth.uid() = patient_id);

create policy "Patients can update own mlux profile"
  on public.mlux_profiles for update
  using (auth.uid() = patient_id);

create policy "Clinicians can read linked patient mlux profiles"
  on public.mlux_profiles for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = mlux_profiles.patient_id
        and cp.status = 'active'
    )
  );

comment on table public.mlux_profiles is
  'Per-patient merged MLux phase anchor and dose-timing outputs (Chronobiobank canonical row)';
comment on column public.mlux_profiles.mlux_phase_time is
  'Canonical merged MLux phase time (wall clock)';
comment on column public.mlux_profiles.mlux_phase_minutes is
  'Canonical merged MLux phase as minutes from midnight';
