-- Retinomic Protocol — tier state, hardware baseline, biochemical fuel, webhook telemetry

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
