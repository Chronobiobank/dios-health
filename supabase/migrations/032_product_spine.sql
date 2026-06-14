-- 032_product_spine.sql — Pilot capture, patient protocols, product dose_events
-- Fixes schema gaps blocking protocol fulfillment and dose confirmation.

-- ─── Pilot / demo requests (clinicians landing form) ─────────────────────────

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  organisation text not null,
  created_at timestamptz not null default now()
);

create index if not exists demo_requests_created_idx on public.demo_requests (created_at desc);

alter table public.demo_requests enable row level security;

drop policy if exists "Anyone can submit demo request" on public.demo_requests;
create policy "Anyone can submit demo request"
  on public.demo_requests for insert
  with check (true);

drop policy if exists "Service role reads demo requests" on public.demo_requests;
create policy "Service role reads demo requests"
  on public.demo_requests for select
  using (auth.role() = 'service_role');

-- ─── Patient protocols (drives requirements + insights) ─────────────────────

create table if not exists public.patient_protocols (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  protocol_type text not null check (
    protocol_type in (
      'coimbra',
      'coimbra_d3',
      'gominak',
      'gominak_d3',
      'gominak_b_vitamins',
      'circadian'
    )
  ),
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  review_at timestamptz,
  target_d3_nmoll numeric,
  current_d3_nmoll numeric,
  d3_dose_iu numeric,
  cofactors jsonb not null default '{}'::jsonb,
  b_vitamin_targets jsonb not null default '{}'::jsonb,
  requires_supervision boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patient_protocols_patient_status_idx
  on public.patient_protocols (patient_id, status);

alter table public.patient_protocols enable row level security;

drop policy if exists "Patients read own protocols" on public.patient_protocols;
create policy "Patients read own protocols"
  on public.patient_protocols for select
  using (auth.uid() = patient_id);

drop policy if exists "Clinicians read linked patient protocols" on public.patient_protocols;
create policy "Clinicians read linked patient protocols"
  on public.patient_protocols for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = patient_protocols.patient_id
        and cp.status = 'active'
    )
  );

-- ─── Product dose_events (auth patient_id — replaces prototype cohort table) ─

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'dose_events'
      and column_name = 'drug_name'
  ) then
    alter table public.dose_events rename to cohort_dose_events_prototype;
  end if;
end $$;

create table if not exists public.dose_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  medication_name text not null,
  recommended_time text,
  recommended_date date not null,
  patient_reported_time text,
  patient_reported_at timestamptz,
  adherence_delta_minutes int not null default 0,
  confirmed boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists dose_events_patient_date_idx
  on public.dose_events (patient_id, recommended_date desc);

alter table public.dose_events enable row level security;

drop policy if exists "Patients read own dose events" on public.dose_events;
create policy "Patients read own dose events"
  on public.dose_events for select
  using (auth.uid() = patient_id);

drop policy if exists "Patients insert own dose events" on public.dose_events;
create policy "Patients insert own dose events"
  on public.dose_events for insert
  with check (auth.uid() = patient_id);

drop policy if exists "Clinicians read linked dose events" on public.dose_events;
create policy "Clinicians read linked dose events"
  on public.dose_events for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = dose_events.patient_id
        and cp.status = 'active'
    )
  );
