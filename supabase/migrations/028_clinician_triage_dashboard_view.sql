-- 028_clinician_triage_dashboard_view.sql — Clinician triage view + device alert rules (CLAUDE.md §5)

drop view if exists public.clinician_triage_dashboard;

create view public.clinician_triage_dashboard
with (security_invoker = true)
as
with latest_telemetry as (
  select
    patient_id,
    max(synced_at) as last_telemetry_sync_at
  from public.wearable_telemetry_logs
  group by patient_id
),
latest_lab as (
  select distinct on (pr.id)
    pr.id as patient_id,
    lr.pth_pgml,
    lr.drawn_at
  from public.profiles pr
  inner join public.patients p on p.name = pr.full_name
  inner join public.lab_results lr on lr.patient_id = p.id
  order by pr.id, lr.drawn_at desc
)
select
  pp.id as patient_id,
  coalesce(pr.full_name, 'Unnamed patient') as patient_name,
  coalesce(clinical.ref, upper(substring(pp.id::text, 1, 8))) as patient_ref,
  coalesce(clinical.protocol, 'coimbra') as protocol,
  (coalesce(pp.is_premium_tier, false) or pp.retinomic_tier = 'PREMIUM_VERIFICATION') as is_premium_tier,
  case
    when lt.last_telemetry_sync_at is null
      and pp.oura_oauth_token is null
      and pp.whoop_oauth_token is null
      and pp.tiptraq_api_key is null
      and coalesce(pp.apple_health_connected, false) = false
      then true
    when lt.last_telemetry_sync_at is null then true
    when lt.last_telemetry_sync_at < (now() - interval '36 hours') then true
    else false
  end as device_alert_triggered,
  case
    when coalesce(ll.pth_pgml, 999) > 65 then 'URGENT'
    when coalesce(ll.pth_pgml, 999) > 30 then 'REVIEW'
    else 'ON_TRACK'
  end as triage_status,
  ll.pth_pgml,
  'flat'::text as pth_trend,
  (current_date + interval '90 days')::date as next_lab_due,
  lt.last_telemetry_sync_at,
  coalesce(clinical.enrolled_at, pp.created_at) as enrolled_at,
  'vitamin-d3'::text as primary_medication_id,
  cp.clinician_id
from public.patient_profiles pp
inner join public.profiles pr on pr.id = pp.id
left join public.clinician_patients cp
  on cp.patient_id = pp.id and cp.status = 'active'
left join latest_telemetry lt on lt.patient_id = pp.id
left join latest_lab ll on ll.patient_id = pp.id
left join lateral (
  select p.ref, p.protocol, p.enrolled_at
  from public.patients p
  where p.name = pr.full_name
  limit 1
) clinical on true
where pr.role = 'patient';

comment on view public.clinician_triage_dashboard is
  'Clinician triage panel — is_premium_tier drives Verified Clinical-Grade Data via TipTraQ badge; device_alert_triggered when tokens empty or last sync >36h (CLAUDE.md §5).';

grant select on public.clinician_triage_dashboard to authenticated;

drop policy if exists "Clinicians read linked patient telemetry" on public.wearable_telemetry_logs;

create policy "Clinicians read linked patient telemetry"
  on public.wearable_telemetry_logs for select
  using (
    exists (
      select 1
      from public.clinician_patients cp
      where cp.patient_id = wearable_telemetry_logs.patient_id
        and cp.clinician_id = auth.uid()
        and cp.status = 'active'
    )
  );
