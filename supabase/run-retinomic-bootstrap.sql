-- Retinomic Protocol bootstrap — run once in Supabase SQL Editor
-- Supabase project: dios-health-dev (see supabase/GREENFIELD-SETUP.md)
--
-- Greenfield (new empty database): run migrations 001–019 first, then this file.
-- Existing project (signup already works): run this after 001–021 are applied.
--
-- After this file:
--   npm run seed:retinomic-demo   (creates demo-free + demo-premium test users)
--
-- Source migrations (same content, version-controlled):
--   supabase/migrations/022_retinomic_protocol.sql
--   supabase/migrations/023_retinomic_auth_seed.sql

-- ═══════════════════════════════════════════════════════════════════════════
-- 1) Retinomic tier, hardware baseline, biochemical fuel, webhook telemetry
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.patient_profiles
  add column if not exists retinomic_tier text not null default 'FREE_SCREENING'
    check (retinomic_tier in ('FREE_SCREENING', 'PREMIUM_VERIFICATION')),
  add column if not exists hardware_baseline jsonb,
  add column if not exists biochemical_fuel jsonb,
  add column if not exists hardware_bandwidth_coefficient numeric(6,3) not null default 1.0,
  add column if not exists morning_mlux_target_duration_minutes int not null default 90;

comment on column public.patient_profiles.retinomic_tier is
  'FREE_SCREENING = passive phone + Siloton; PREMIUM_VERIFICATION = quarterly labs + TipTraQ webhooks';
comment on column public.patient_profiles.hardware_baseline is
  'irisPigment, skinITA, gclIplThicknessMicrons from Siloton GiraffeOCT';
comment on column public.patient_profiles.biochemical_fuel is
  'vitaminD3 and vitaminB5 from quarterly labs (ng/mL and µmol/L in app layer)';

alter table public.mlux_profiles
  add column if not exists morning_mlux_target_duration_minutes int,
  add column if not exists hardware_bandwidth_coefficient numeric(6,3);

alter table public.tiptraq_nights
  add column if not exists rem_sleep_efficiency_pct numeric(5,2),
  add column if not exists micro_arousals_count int,
  add column if not exists webhook_source text,
  add column if not exists webhook_received_at timestamptz;

create unique index if not exists tiptraq_nights_patient_report_date_uidx
  on public.tiptraq_nights (patient_id, report_date);

create table if not exists public.siloton_webhook_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  hardware_bandwidth_coefficient numeric(6,3),
  received_at timestamptz not null default now()
);

create index if not exists siloton_webhook_events_patient_idx
  on public.siloton_webhook_events (patient_id, received_at desc);

alter table public.siloton_webhook_events enable row level security;

create table if not exists public.tiptraq_webhook_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  tiptraq_night_id uuid references public.tiptraq_nights(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

create index if not exists tiptraq_webhook_events_patient_idx
  on public.tiptraq_webhook_events (patient_id, received_at desc);

alter table public.tiptraq_webhook_events enable row level security;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2) Auth signup — Siloton integration token slots
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.patient_profiles
  add column if not exists siloton_integration jsonb not null default '{"linked":false,"accessToken":null}'::jsonb;

comment on column public.patient_profiles.siloton_integration is
  'Siloton GiraffeOCT API linkage — populated after hub pairing';

-- ═══════════════════════════════════════════════════════════════════════════
-- 3) Verification (expect one row per column / table)
-- ═══════════════════════════════════════════════════════════════════════════

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'patient_profiles'
  and column_name in (
    'retinomic_tier',
    'hardware_baseline',
    'biochemical_fuel',
    'siloton_integration',
    'hardware_bandwidth_coefficient',
    'morning_mlux_target_duration_minutes'
  )
order by column_name;

select to_regclass('public.siloton_webhook_events') as siloton_webhook_events;
select to_regclass('public.tiptraq_webhook_events') as tiptraq_webhook_events;
