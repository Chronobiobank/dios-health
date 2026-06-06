-- 027_premium_tier_tiptraq.sql — Premium tier flags, integration tokens, TipTraQ telemetry fields

alter table public.patient_profiles
  add column if not exists is_premium_tier boolean not null default false,
  add column if not exists oura_oauth_token text,
  add column if not exists whoop_oauth_token text,
  add column if not exists tiptraq_api_key text,
  add column if not exists apple_health_connected boolean not null default false;

comment on column public.patient_profiles.is_premium_tier is
  'TipTraQ / medical hardware tier — renders Verified Clinical-Grade Data via TipTraQ badge (CLAUDE.md §1, §5).';

update public.patient_profiles
set is_premium_tier = true
where retinomic_tier = 'PREMIUM_VERIFICATION'
  and is_premium_tier = false;

alter table public.wearable_telemetry_logs
  add column if not exists ingestion_tier text not null default 'CORE'
    check (ingestion_tier in ('CORE', 'PREMIUM')),
  add column if not exists average_spo2 numeric,
  add column if not exists respiratory_disturbance_index numeric;

comment on column public.wearable_telemetry_logs.average_spo2 is
  'Premium TipTraQ — overnight mean SpO2 (%).';
comment on column public.wearable_telemetry_logs.respiratory_disturbance_index is
  'Premium TipTraQ — respiratory disturbance index (events/hour).';
