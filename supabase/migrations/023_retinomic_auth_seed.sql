-- Retinomic auth signup — integration token slots

alter table public.patient_profiles
  add column if not exists siloton_integration jsonb not null default '{"linked":false,"accessToken":null}'::jsonb;

comment on column public.patient_profiles.siloton_integration is
  'Siloton GiraffeOCT API linkage — populated after hub pairing';
