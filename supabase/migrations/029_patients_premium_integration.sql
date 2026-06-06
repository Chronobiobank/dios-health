-- 029_patients_premium_integration.sql — CLAUDE.md §3 tier + integration tokens on cohort patients

alter table public.patients
  add column if not exists is_premium_tier boolean not null default false,
  add column if not exists oura_oauth_token text,
  add column if not exists whoop_oauth_token text,
  add column if not exists tiptraq_api_key text,
  add column if not exists apple_health_connected boolean not null default false;

comment on column public.patients.is_premium_tier is
  'TipTraQ / medical hardware tier — clinical-grade ingestion (CLAUDE.md §1, §3).';

update public.patients
set
  is_premium_tier = true,
  tiptraq_api_key = coalesce(tiptraq_api_key, 'mock-tiptraq-sean-001')
where ref = 'SEAN-001'
  and is_premium_tier = false;
