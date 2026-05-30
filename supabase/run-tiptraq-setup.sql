-- TipTraQ PDF upload + DLMO tables for dios.health
-- Run in Supabase → SQL Editor (safe to re-run)

-- ─── PDF storage bucket ───────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('tiptraq-reports', 'tiptraq-reports', false)
on conflict (id) do nothing;

drop policy if exists "Users access own reports" on storage.objects;

create policy "Users access own reports"
on storage.objects for all
to authenticated
using (
  bucket_id = 'tiptraq-reports'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'tiptraq-reports'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- ─── Nightly report extractions ───────────────────────────────────────────────
create table if not exists public.tiptraq_nights (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  report_date date not null,
  pdf_path text,
  recording_start time,
  recording_end time,
  trt_minutes int,
  signal_quality_pct int,
  sleep_onset time,
  sleep_offset time,
  sleep_latency_minutes int,
  tst_minutes int,
  waso_minutes int,
  sleep_efficiency_pct int,
  rem_duration_minutes int,
  rem_pct_tst numeric(5,2),
  nrem_duration_minutes int,
  first_rem_onset time,
  ahi numeric(5,2),
  ahi_severity text,
  rdi numeric(5,2),
  odi_3pct numeric(5,2),
  odi_4pct numeric(5,2),
  t90_pct numeric(5,2),
  min_spo2 int,
  mean_spo2 int,
  hypoxic_burden numeric(6,2),
  event_count int,
  mean_pr int,
  min_pr int,
  max_pr int,
  sns_pct int,
  pns_pct int,
  snoring_minutes int,
  algorithm_version text,
  proxy_dlmo_time time,
  proxy_dlmo_minutes_from_midnight int,
  dlmo_baseline_estimate time,
  dlmo_rem_correction_min int,
  dlmo_ans_correction_min int,
  dlmo_ahi_modifier_min int,
  confidence_score int,
  confidence_band_minutes int,
  confidence_label text,
  chronotype_signal text,
  non_dipper_flag boolean default false,
  high_sympathetic_flag boolean default false,
  rem_delay_flag boolean default false,
  apnea_confound_flag boolean default false,
  extraction_model text,
  created_at timestamptz default now()
);

create index if not exists tiptraq_nights_patient_date_idx
  on public.tiptraq_nights (patient_id, report_date desc);

alter table public.tiptraq_nights enable row level security;

drop policy if exists "Patients can read own tiptraq nights" on public.tiptraq_nights;
drop policy if exists "Patients can insert own tiptraq nights" on public.tiptraq_nights;

create policy "Patients can read own tiptraq nights"
  on public.tiptraq_nights for select
  to authenticated
  using (auth.uid() = patient_id);

create policy "Patients can insert own tiptraq nights"
  on public.tiptraq_nights for insert
  to authenticated
  with check (auth.uid() = patient_id);

-- ─── Rolling DLMO summary per patient ─────────────────────────────────────────
create table if not exists public.dlmo_profiles (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade unique,
  nights_count int default 0,
  proxy_dlmo_rolling time,
  proxy_dlmo_minutes_from_midnight int,
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

alter table public.dlmo_profiles enable row level security;

drop policy if exists "Patients can read own dlmo profile" on public.dlmo_profiles;
drop policy if exists "Patients can insert own dlmo profile" on public.dlmo_profiles;
drop policy if exists "Patients can update own dlmo profile" on public.dlmo_profiles;

create policy "Patients can read own dlmo profile"
  on public.dlmo_profiles for select
  to authenticated
  using (auth.uid() = patient_id);

create policy "Patients can insert own dlmo profile"
  on public.dlmo_profiles for insert
  to authenticated
  with check (auth.uid() = patient_id);

create policy "Patients can update own dlmo profile"
  on public.dlmo_profiles for update
  to authenticated
  using (auth.uid() = patient_id);

notify pgrst, 'reload schema';

-- ─── Verify ───────────────────────────────────────────────────────────────────
select id, name, public from storage.buckets where id = 'tiptraq-reports';

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('tiptraq_nights', 'dlmo_profiles')
order by table_name;
