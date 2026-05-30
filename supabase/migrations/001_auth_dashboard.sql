-- DIOS Auth + Dashboard schema (v1)
-- Run in Supabase SQL Editor or via: supabase db push

-- ─── profiles ───────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('patient', 'clinician')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── patient_profiles ───────────────────────────────────────────────────────

create table if not exists public.patient_profiles (
  id uuid references public.profiles on delete cascade primary key,
  fitzpatrick_type int check (fitzpatrick_type between 1 and 6),
  location_city text,
  location_country text,
  shift_worker boolean not null default false,
  shift_pattern text,
  chronotype_q1 text,
  chronotype_q2 text,
  chronotype_q3 text,
  wearable_connected text,
  data_share_gp boolean not null default false,
  data_share_research boolean not null default false,
  data_share_policy boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.patient_profiles enable row level security;

create policy "Patients can read own patient profile"
  on public.patient_profiles for select
  using (auth.uid() = id);

create policy "Patients can insert own patient profile"
  on public.patient_profiles for insert
  with check (auth.uid() = id);

create policy "Patients can update own patient profile"
  on public.patient_profiles for update
  using (auth.uid() = id);

-- ─── clinician_profiles ─────────────────────────────────────────────────────

create table if not exists public.clinician_profiles (
  id uuid references public.profiles on delete cascade primary key,
  practice_name text,
  practice_address text,
  registration_number text,
  registration_body text check (registration_body in ('GMC', 'MCNZ', 'AHPRA', 'OTHER')),
  verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.clinician_profiles enable row level security;

create policy "Clinicians can read own clinician profile"
  on public.clinician_profiles for select
  using (auth.uid() = id);

create policy "Clinicians can insert own clinician profile"
  on public.clinician_profiles for insert
  with check (auth.uid() = id);

create policy "Clinicians can update own clinician profile"
  on public.clinician_profiles for update
  using (auth.uid() = id);

-- ─── insights ─────────────────────────────────────────────────────────────────

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles on delete cascade,
  drug_name text,
  insight_type text,
  insight_headline text,
  insight_body text,
  recommended_time text,
  confidence_score int,
  status text not null default 'active' check (status in ('active', 'dismissed', 'acted')),
  created_at timestamptz not null default now()
);

create index if not exists insights_patient_id_idx on public.insights (patient_id);
create index if not exists insights_status_idx on public.insights (status);

alter table public.insights enable row level security;

create policy "Patients can read own insights"
  on public.insights for select
  using (auth.uid() = patient_id);

create policy "Patients can update own insights"
  on public.insights for update
  using (auth.uid() = patient_id);

-- ─── clinician_patients (supports invites + panel) ────────────────────────────

create table if not exists public.clinician_patients (
  id uuid primary key default gen_random_uuid(),
  clinician_id uuid not null references public.profiles on delete cascade,
  patient_id uuid references public.profiles on delete cascade,
  invite_email text,
  status text not null default 'pending' check (status in ('pending', 'active', 'declined')),
  created_at timestamptz not null default now(),
  unique (clinician_id, patient_id),
  unique (clinician_id, invite_email)
);

create index if not exists clinician_patients_clinician_idx on public.clinician_patients (clinician_id);
create index if not exists clinician_patients_patient_idx on public.clinician_patients (patient_id);

alter table public.clinician_patients enable row level security;

create policy "Clinicians can manage own patient links"
  on public.clinician_patients for all
  using (auth.uid() = clinician_id)
  with check (auth.uid() = clinician_id);

create policy "Patients can read own clinician links"
  on public.clinician_patients for select
  using (auth.uid() = patient_id);

-- ─── cross-role read policies (after clinician_patients exists) ───────────────

create policy "Clinicians can read linked patient profiles row"
  on public.profiles for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = profiles.id
        and cp.status = 'active'
    )
  );

create policy "Clinicians can read linked patient_profiles"
  on public.patient_profiles for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = patient_profiles.id
        and cp.status = 'active'
    )
  );

create policy "Clinicians can read linked patient insights"
  on public.insights for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = insights.patient_id
        and cp.status = 'active'
    )
  );

-- ─── consultation_audit_log (consultation mode) ─────────────────────────────

create table if not exists public.consultation_audit_log (
  id uuid primary key default gen_random_uuid(),
  clinician_id uuid not null references public.profiles on delete cascade,
  patient_id uuid not null references public.profiles on delete cascade,
  drug_name text,
  recommendation text,
  action_taken text,
  created_at timestamptz not null default now()
);

alter table public.consultation_audit_log enable row level security;

create policy "Clinicians can insert own audit entries"
  on public.consultation_audit_log for insert
  with check (auth.uid() = clinician_id);

create policy "Clinicians can read own audit entries"
  on public.consultation_audit_log for select
  using (auth.uid() = clinician_id);
