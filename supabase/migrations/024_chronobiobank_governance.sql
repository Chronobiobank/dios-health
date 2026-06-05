-- Chronobiobank Phase 1: granular consent dimensions + immutable audit log + governance weight cache

alter table public.chronobiobank_consent
  add column if not exists consent_academic_research boolean not null default false,
  add column if not exists consent_pharma_discovery boolean not null default false,
  add column if not exists consent_ai_training boolean not null default false,
  add column if not exists consent_open_source_challenges boolean not null default false,
  add column if not exists governance_weight integer not null default 10;

create table if not exists public.chronobiobank_consent_audit (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  dimension text not null,
  previous_value boolean,
  new_value boolean not null,
  consent_version text not null default 'v2.0',
  changed_at timestamptz not null default now()
);

create index if not exists chronobiobank_consent_audit_patient_idx
  on public.chronobiobank_consent_audit (patient_id, changed_at desc);

alter table public.chronobiobank_consent_audit enable row level security;

drop policy if exists "Patients can read own chronobiobank consent audit" on public.chronobiobank_consent_audit;
drop policy if exists "Patients can insert own chronobiobank consent audit" on public.chronobiobank_consent_audit;

create policy "Patients can read own chronobiobank consent audit"
  on public.chronobiobank_consent_audit for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own chronobiobank consent audit"
  on public.chronobiobank_consent_audit for insert
  with check (auth.uid() = patient_id);

-- Clinicians with linked patients may read consent state (demo: service role / future RLS)
comment on table public.chronobiobank_consent_audit is
  'Immutable log of Chronobiobank consent dimension changes — Phase 1 centralised custodian.';
