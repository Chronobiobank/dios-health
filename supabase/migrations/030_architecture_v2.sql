-- =============================================================================
-- 030_architecture_v2.sql — DIOS architecture v2: diagnostic tiers, naming, OCT removal
-- Safe to re-run (idempotent where possible).
-- =============================================================================

-- ─── vaya_sessions → dina_sessions ─────────────────────────────────────────

do $$
begin
  if to_regclass('public.vaya_sessions') is not null
     and to_regclass('public.dina_sessions') is null then
    alter table public.vaya_sessions rename to dina_sessions;
  end if;
end $$;

create table if not exists public.dina_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now()
);

create index if not exists dina_sessions_patient_started_idx
  on public.dina_sessions (patient_id, started_at desc);

alter table public.dina_sessions enable row level security;

drop policy if exists "Patients can read own vaya sessions" on public.dina_sessions;
drop policy if exists "Patients can insert own vaya sessions" on public.dina_sessions;
drop policy if exists "Patients can read own dina sessions" on public.dina_sessions;
drop policy if exists "Patients can insert own dina sessions" on public.dina_sessions;

create policy "Patients can read own dina sessions"
  on public.dina_sessions for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own dina sessions"
  on public.dina_sessions for insert
  with check (auth.uid() = patient_id);

comment on table public.dina_sessions is
  'DINA engagement sessions — append-only logs for audit and model improvement governance.';

-- ─── conflict_alerts column renames (if table exists) ────────────────────────

do $$
begin
  if to_regclass('public.conflict_alerts') is not null then
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'conflict_alerts' and column_name = 'mel_text'
    ) then
      alter table public.conflict_alerts rename column mel_text to dina_text;
    end if;
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'conflict_alerts' and column_name = 'mel_message'
    ) then
      alter table public.conflict_alerts rename column mel_message to dina_message;
    end if;
  end if;
end $$;

-- ─── mlux_profiles: tier fields + renames + OCT removal ──────────────────────

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'mlux_profiles' and column_name = 'proxy_dlmo'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'mlux_profiles' and column_name = 'dlmo_proxy'
  ) then
    alter table public.mlux_profiles rename column proxy_dlmo to dlmo_proxy;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'mlux_profiles' and column_name = 'circadian_age'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'mlux_profiles' and column_name = 'chronopathic_age'
  ) then
    alter table public.mlux_profiles rename column circadian_age to chronopathic_age;
  end if;
end $$;

alter table public.mlux_profiles
  add column if not exists diagnostic_tier text default 'L3'
    check (diagnostic_tier in ('L1', 'L2', 'L3')),
  add column if not exists has_tipraq boolean default false,
  add column if not exists has_blood_panel boolean default false,
  add column if not exists tiptraq_device_id text,
  add column if not exists tiptraq_paired_at timestamptz,
  add column if not exists dlmo_proxy text,
  add column if not exists dlmo_offset_mins int,
  add column if not exists chronopathic_age numeric(5,2),
  add column if not exists sleep_efficiency numeric(5,2),
  add column if not exists rem_latency_mins int,
  add column if not exists ahi numeric(6,2);

alter table public.mlux_profiles
  drop column if exists oct_data,
  drop column if exists oct_score,
  drop column if exists retinal_score,
  drop column if exists retinal_index,
  drop column if exists optic_nerve_index,
  drop column if exists optic_nerve_score;

-- Generated column for window precision (add only if missing)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mlux_profiles'
      and column_name = 'window_precision_mins'
  ) then
    alter table public.mlux_profiles
      add column window_precision_mins int generated always as (
        case diagnostic_tier
          when 'L1' then 18
          when 'L2' then 60
          when 'L3' then 90
        end
      ) stored;
  end if;
end $$;

comment on column public.mlux_profiles.diagnostic_tier is
  'L1 TipTraQ · L2 Gominak blood panel · L3 smartphone proxy';

-- ─── Remove Siloton / OCT integration artifacts ──────────────────────────────

alter table public.patient_profiles
  drop column if exists siloton_integration;

drop table if exists public.siloton_webhook_events;

-- ─── mel_sessions prototype: document deprecation ────────────────────────────

do $$
begin
  if to_regclass('public.mel_sessions') is not null then
    comment on table public.mel_sessions is
      'Deprecated prototype voice transcripts — use dina_sessions for engagement logs.';
  end if;
end $$;
