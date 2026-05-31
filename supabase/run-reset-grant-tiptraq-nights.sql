-- Reset Grant's TipTraQ nights (UTC timezone bug) — run in Supabase SQL Editor
-- Patient id prefix: 5e16b259

do $$
declare
  target_patient uuid;
  night_row record;
begin
  select id into target_patient
  from public.patient_profiles
  where id::text like '5e16b259%'
  limit 1;

  if target_patient is null then
    raise exception 'No patient found with id prefix 5e16b259';
  end if;

  raise notice 'Resetting tiptraq_nights for patient %', target_patient;

  for night_row in
    select id, pdf_path
    from public.tiptraq_nights
    where patient_id = target_patient
  loop
    raise notice 'Deleting night % (storage: %)', night_row.id, night_row.pdf_path;
  end loop;

  delete from public.tiptraq_nights
  where patient_id = target_patient;

  update public.dlmo_profiles
  set
    nights_count = 0,
    proxy_dlmo_rolling = null,
    proxy_dlmo_minutes_from_midnight = null,
    confidence_score = null,
    confidence_band_minutes = null,
    confidence_label = null,
    chronotype = null,
    simvastatin_optimal_time = null,
    ramipril_optimal_time = null,
    prednisolone_optimal_time = null,
    salmeterol_optimal_time = null,
    light_dose_window_start = null,
    light_dose_window_end = null,
    last_updated = now()
  where patient_id = target_patient;
end $$;

-- Storage: remove EDF files under tiptraq-reports/{patient_id}/ in Storage UI
-- or via dashboard after re-upload replaces paths.
