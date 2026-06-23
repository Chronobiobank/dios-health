-- 033_dios_platform_rls_hardening.sql
-- DIOS-Platform: enable RLS on any public table missing it; replace prototype USING(true) policies.

-- ─── 1. Catch-all: enable RLS on public base tables ───────────────────────────

do $$
declare
  r record;
begin
  for r in
    select c.relname as tablename
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and not c.relrowsecurity
  loop
    execute format('alter table public.%I enable row level security', r.tablename);
    raise notice 'Enabled RLS on public.%', r.tablename;
  end loop;
end $$;

-- ─── 2. Drop prototype open-read policies (anon/authenticated could read all) ─

drop policy if exists "Prototype read practitioners" on public.practitioners;
drop policy if exists "Prototype read patients" on public.patients;
drop policy if exists "Prototype read bti_readings" on public.bti_readings;
drop policy if exists "Prototype read lab_results" on public.lab_results;
drop policy if exists "Prototype read dose_events" on public.dose_events;
drop policy if exists "Prototype read safety_gates" on public.safety_gates;
drop policy if exists "Prototype read mel_sessions" on public.mel_sessions;

do $$
begin
  if to_regclass('public.cohort_dose_events_prototype') is not null then
    execute 'drop policy if exists "Prototype read dose_events" on public.cohort_dose_events_prototype';
    execute 'alter table public.cohort_dose_events_prototype enable row level security';
  end if;
end $$;

-- ─── 3. Scoped policies for prototype clinical OS (clinician_triage_dashboard) ─

drop policy if exists "Clinicians read practitioners" on public.practitioners;
create policy "Clinicians read practitioners"
  on public.practitioners for select to authenticated
  using (
    exists (
      select 1 from public.clinician_profiles cp
      where cp.id = auth.uid()
    )
  );

drop policy if exists "Clinicians read linked cohort patients" on public.patients;
create policy "Clinicians read linked cohort patients"
  on public.patients for select to authenticated
  using (
    exists (
      select 1
      from public.profiles pr
      inner join public.clinician_patients cp
        on cp.patient_id = pr.id and cp.status = 'active'
      where pr.full_name = patients.name
        and cp.clinician_id = auth.uid()
    )
  );

drop policy if exists "Clinicians read linked cohort bti readings" on public.bti_readings;
create policy "Clinicians read linked cohort bti readings"
  on public.bti_readings for select to authenticated
  using (
    exists (
      select 1
      from public.patients p
      inner join public.profiles pr on pr.full_name = p.name
      inner join public.clinician_patients cp
        on cp.patient_id = pr.id and cp.status = 'active'
      where p.id = bti_readings.patient_id
        and cp.clinician_id = auth.uid()
    )
  );

drop policy if exists "Clinicians read linked cohort lab results" on public.lab_results;
create policy "Clinicians read linked cohort lab results"
  on public.lab_results for select to authenticated
  using (
    exists (
      select 1
      from public.patients p
      inner join public.profiles pr on pr.full_name = p.name
      inner join public.clinician_patients cp
        on cp.patient_id = pr.id and cp.status = 'active'
      where p.id = lab_results.patient_id
        and cp.clinician_id = auth.uid()
    )
  );

drop policy if exists "Clinicians read linked cohort safety gates" on public.safety_gates;
create policy "Clinicians read linked cohort safety gates"
  on public.safety_gates for select to authenticated
  using (
    exists (
      select 1
      from public.patients p
      inner join public.profiles pr on pr.full_name = p.name
      inner join public.clinician_patients cp
        on cp.patient_id = pr.id and cp.status = 'active'
      where p.id = safety_gates.patient_id
        and cp.clinician_id = auth.uid()
    )
  );

drop policy if exists "Clinicians read linked cohort mel sessions" on public.mel_sessions;
create policy "Clinicians read linked cohort mel sessions"
  on public.mel_sessions for select to authenticated
  using (
    exists (
      select 1
      from public.patients p
      inner join public.profiles pr on pr.full_name = p.name
      inner join public.clinician_patients cp
        on cp.patient_id = pr.id and cp.status = 'active'
      where p.id = mel_sessions.patient_id
        and cp.clinician_id = auth.uid()
    )
  );

do $$
begin
  if to_regclass('public.cohort_dose_events_prototype') is not null then
    execute 'drop policy if exists "Clinicians read linked cohort dose events prototype" on public.cohort_dose_events_prototype';
    execute $policy$
      create policy "Clinicians read linked cohort dose events prototype"
        on public.cohort_dose_events_prototype for select to authenticated
        using (
          exists (
            select 1
            from public.patients p
            inner join public.profiles pr on pr.full_name = p.name
            inner join public.clinician_patients cp
              on cp.patient_id = pr.id and cp.status = 'active'
            where p.id = cohort_dose_events_prototype.patient_id
              and cp.clinician_id = auth.uid()
          )
        )
    $policy$;
  end if;
end $$;

-- ─── 4. Webhook tables: RLS on, service_role only (edge functions ingest) ─────

alter table if exists public.siloton_webhook_events enable row level security;
alter table if exists public.tiptraq_webhook_events enable row level security;

drop policy if exists "Service role manages siloton webhooks" on public.siloton_webhook_events;
create policy "Service role manages siloton webhooks"
  on public.siloton_webhook_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role manages tiptraq webhooks" on public.tiptraq_webhook_events;
create policy "Service role manages tiptraq webhooks"
  on public.tiptraq_webhook_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
