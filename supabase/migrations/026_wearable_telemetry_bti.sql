-- 026_wearable_telemetry_bti.sql — Ingestion logs + anonymous Chronobiobank BTI telemetry

create table if not exists public.wearable_telemetry_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  synced_at timestamptz not null default now(),
  sleep_onset_timestamp timestamptz not null,
  wake_timestamp timestamptz not null,
  deep_sleep_duration_minutes numeric not null,
  rem_duration_minutes numeric not null,
  daily_average_hrv numeric not null,
  intra_night_hrv_series jsonb not null default '[]'::jsonb,
  lux_exposure_hours numeric not null,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists wearable_telemetry_logs_patient_synced_idx
  on public.wearable_telemetry_logs (patient_id, synced_at desc);

create table if not exists public.chronobiobank_telemetry (
  id uuid primary key default gen_random_uuid(),
  contributor_hash text not null,
  medication_id text not null,
  clock_time_utc timestamptz not null,
  biological_time_relative text not null,
  bti_status text not null check (bti_status in ('WINDOW_OPEN', 'WINDOW_CLOSED', 'CRITICAL_DRIFT')),
  dosing_window_start timestamptz not null,
  dosing_window_end timestamptz not null,
  display_instruction text not null,
  phase_delay_minutes int not null,
  daily_average_hrv numeric not null,
  lux_exposure_hours numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists chronobiobank_telemetry_created_idx
  on public.chronobiobank_telemetry (created_at desc);

alter table public.wearable_telemetry_logs enable row level security;
alter table public.chronobiobank_telemetry enable row level security;

drop policy if exists "Patients read own wearable telemetry" on public.wearable_telemetry_logs;
drop policy if exists "Patients insert own wearable telemetry" on public.wearable_telemetry_logs;
drop policy if exists "Patients insert chronobiobank telemetry" on public.chronobiobank_telemetry;

create policy "Patients read own wearable telemetry"
  on public.wearable_telemetry_logs for select
  using (auth.uid() = patient_id);

create policy "Patients insert own wearable telemetry"
  on public.wearable_telemetry_logs for insert
  with check (auth.uid() = patient_id);

create policy "Patients insert chronobiobank telemetry"
  on public.chronobiobank_telemetry for insert
  with check (auth.uid() is not null);

comment on table public.wearable_telemetry_logs is
  'Pull-based wearable ingestion — sleep, HRV, light streams per CLAUDE.md §1.';

comment on table public.chronobiobank_telemetry is
  'Anonymous BTI outcomes — contributor_hash only, no patient_id (CLAUDE.md §4).';
