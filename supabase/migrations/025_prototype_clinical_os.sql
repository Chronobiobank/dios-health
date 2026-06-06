-- 025_prototype_clinical_os.sql — Prototype clinical OS schema (Coimbra/Gominak cohort sharing)
-- Safe to re-run where noted. Seed: Sean James SEAN-001.

-- ─── Practitioners ───────────────────────────────────────────────────────────

create table if not exists public.practitioners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  protocol_primary text check (protocol_primary in ('coimbra', 'gominak', 'circadian')),
  cohort_size int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Patients (cohort enrolment) ─────────────────────────────────────────────

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  name text not null,
  practitioner_id uuid references public.practitioners(id) on delete set null,
  protocol text not null check (protocol in ('coimbra', 'gominak', 'circadian')),
  enrolled_at timestamptz not null default now(),
  consent_chronobiobank boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists patients_practitioner_idx on public.patients (practitioner_id);
create index if not exists patients_ref_idx on public.patients (ref);

-- ─── BTI readings ────────────────────────────────────────────────────────────

create table if not exists public.bti_readings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  bti_clock text not null,
  bti_confidence text not null check (bti_confidence in ('ESTIMATED', 'PRECISION', 'CONFIRMED')),
  layer text not null check (layer in ('L1_MLUX', 'L2_TIPTRAQ', 'L3_LABS')),
  mlux_value numeric,
  sleep_efficiency numeric,
  rem_latency_min numeric,
  hrv numeric,
  recorded_at timestamptz not null default now()
);

create index if not exists bti_readings_patient_recorded_idx
  on public.bti_readings (patient_id, recorded_at desc);

-- ─── Lab results ─────────────────────────────────────────────────────────────

create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  pth_pgml numeric,
  vitamin_d_nmol numeric,
  calcium_mmol numeric,
  egfr numeric,
  b12_pmol numeric,
  ferritin_ug numeric,
  drawn_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists lab_results_patient_drawn_idx
  on public.lab_results (patient_id, drawn_at desc);

-- ─── Dose events ─────────────────────────────────────────────────────────────

create table if not exists public.dose_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  drug_name text not null,
  cluster text not null check (
    cluster in ('architect', 'sensitiser', 'modulator', 'opportunist', 'restorer')
  ),
  dose_mg numeric,
  confirmed_at timestamptz not null,
  bti_at_dose text,
  window_status text check (window_status in ('ON_WINDOW', 'EARLY', 'LATE', 'MISSED')),
  created_at timestamptz not null default now()
);

-- ─── Safety gates ────────────────────────────────────────────────────────────

create table if not exists public.safety_gates (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  gate_type text not null check (
    gate_type in ('CALCIUM_CASCADE', 'EGFR', 'URINARY_CA', 'HYDRATION')
  ),
  status text not null check (status in ('CLEAR', 'WARNING', 'HOLD')),
  value numeric,
  threshold numeric,
  checked_at timestamptz not null default now()
);

create index if not exists safety_gates_patient_checked_idx
  on public.safety_gates (patient_id, checked_at desc);

-- ─── Mel voice sessions ──────────────────────────────────────────────────────

create table if not exists public.mel_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  session_type text not null check (session_type in ('ONBOARDING', 'DAILY_CHECK', 'LAB_REVIEW')),
  transcript text,
  bti_at_session text,
  duration_sec numeric,
  created_at timestamptz not null default now()
);

create index if not exists mel_sessions_patient_created_idx
  on public.mel_sessions (patient_id, created_at desc);

-- ─── Prototype RLS (read-only anon for demo sharing — tighten before production) ─

alter table public.practitioners enable row level security;
alter table public.patients enable row level security;
alter table public.bti_readings enable row level security;
alter table public.lab_results enable row level security;
alter table public.dose_events enable row level security;
alter table public.safety_gates enable row level security;
alter table public.mel_sessions enable row level security;

drop policy if exists "Prototype read practitioners" on public.practitioners;
drop policy if exists "Prototype read patients" on public.patients;
drop policy if exists "Prototype read bti_readings" on public.bti_readings;
drop policy if exists "Prototype read lab_results" on public.lab_results;
drop policy if exists "Prototype read dose_events" on public.dose_events;
drop policy if exists "Prototype read safety_gates" on public.safety_gates;
drop policy if exists "Prototype read mel_sessions" on public.mel_sessions;

create policy "Prototype read practitioners" on public.practitioners for select using (true);
create policy "Prototype read patients" on public.patients for select using (true);
create policy "Prototype read bti_readings" on public.bti_readings for select using (true);
create policy "Prototype read lab_results" on public.lab_results for select using (true);
create policy "Prototype read dose_events" on public.dose_events for select using (true);
create policy "Prototype read safety_gates" on public.safety_gates for select using (true);
create policy "Prototype read mel_sessions" on public.mel_sessions for select using (true);

-- ─── Seed: demo practitioner + Sean James SEAN-001 ───────────────────────────

insert into public.practitioners (id, name, email, protocol_primary, cohort_size)
values (
  'a0000000-0000-4000-8000-000000000001',
  'Dr Grant Coimbra Cohort',
  'grant@dios.health',
  'coimbra',
  3
)
on conflict (email) do nothing;

insert into public.patients (id, ref, name, practitioner_id, protocol, enrolled_at, consent_chronobiobank)
values (
  'b0000000-0000-4000-8000-000000000001',
  'SEAN-001',
  'Sean James',
  'a0000000-0000-4000-8000-000000000001',
  'coimbra',
  '2025-11-01T00:00:00Z',
  true
)
on conflict (ref) do nothing;

insert into public.bti_readings (
  patient_id, bti_clock, bti_confidence, layer, mlux_value, sleep_efficiency, rem_latency_min, recorded_at
)
select
  'b0000000-0000-4000-8000-000000000001',
  '22:57',
  'ESTIMATED',
  'L1_MLUX',
  38,
  74,
  162,
  '2026-06-01T08:00:00Z'
where not exists (
  select 1 from public.bti_readings
  where patient_id = 'b0000000-0000-4000-8000-000000000001'
    and bti_clock = '22:57'
);

insert into public.lab_results (patient_id, pth_pgml, vitamin_d_nmol, drawn_at)
select 'b0000000-0000-4000-8000-000000000001', 52, 98, '2025-12-08T00:00:00Z'
where not exists (
  select 1 from public.lab_results
  where patient_id = 'b0000000-0000-4000-8000-000000000001' and drawn_at = '2025-12-08T00:00:00Z'
);

insert into public.lab_results (patient_id, pth_pgml, vitamin_d_nmol, drawn_at)
select 'b0000000-0000-4000-8000-000000000001', 44, 118, '2026-03-14T00:00:00Z'
where not exists (
  select 1 from public.lab_results
  where patient_id = 'b0000000-0000-4000-8000-000000000001' and drawn_at = '2026-03-14T00:00:00Z'
);

insert into public.lab_results (patient_id, pth_pgml, vitamin_d_nmol, drawn_at)
select 'b0000000-0000-4000-8000-000000000001', 38, 142, '2026-06-01T00:00:00Z'
where not exists (
  select 1 from public.lab_results
  where patient_id = 'b0000000-0000-4000-8000-000000000001' and drawn_at = '2026-06-01T00:00:00Z'
);

insert into public.safety_gates (patient_id, gate_type, status, checked_at)
select 'b0000000-0000-4000-8000-000000000001', gate_type, 'CLEAR', '2026-06-01T08:00:00Z'
from (values ('CALCIUM_CASCADE'), ('EGFR'), ('HYDRATION')) as g(gate_type)
where not exists (
  select 1 from public.safety_gates s
  where s.patient_id = 'b0000000-0000-4000-8000-000000000001'
    and s.gate_type = g.gate_type
    and s.checked_at = '2026-06-01T08:00:00Z'
);

insert into public.mel_sessions (patient_id, session_type, transcript, bti_at_session, duration_sec, created_at)
select * from (
  values
    (
      'b0000000-0000-4000-8000-000000000001'::uuid,
      'LAB_REVIEW',
      'PTH 38 pg/mL — lower third. All safety gates clear. Next lab 15 July.',
      '22:57',
      42,
      '2026-06-01T10:00:00Z'::timestamptz
    ),
    (
      'b0000000-0000-4000-8000-000000000001'::uuid,
      'DAILY_CHECK',
      'D3 window opens 21:40. Magnesium cofactor confirmed taken.',
      '22:57',
      28,
      '2026-05-30T21:00:00Z'::timestamptz
    ),
    (
      'b0000000-0000-4000-8000-000000000001'::uuid,
      'ONBOARDING',
      'Biological clock running 94 minutes behind wall clock. Medication windows mapped to your evening peak.',
      '22:57',
      95,
      '2025-11-02T09:00:00Z'::timestamptz
    )
) as v(patient_id, session_type, transcript, bti_at_session, duration_sec, created_at)
where not exists (
  select 1 from public.mel_sessions m
  where m.patient_id = v.patient_id and m.session_type = v.session_type and m.created_at = v.created_at
);
