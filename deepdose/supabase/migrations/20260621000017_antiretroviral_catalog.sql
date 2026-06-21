-- PrEP and HAART — common UK antiretroviral regimens

INSERT INTO public.medications
  (code, display_name, drug_class, evidence_grade, optimal_window_start, optimal_window_end, bnf_section, timing_tier, cluster_id, item_type, search_terms, dose_unit, rationale)
VALUES
  ('prep_truvada', 'PrEP (Truvada)', 'HIV pre-exposure prophylaxis', 'C', '08:00', '10:00', '5.3.1', 'optimised', 'hiv', 'prescription', ARRAY['prep', 'truvada', 'tenofovir', 'emtricitabine', 'hiv prevention'], 'mg', 'Same time every day — window follows your body-clock routine.'),
  ('prep_descovy', 'PrEP (Descovy)', 'HIV pre-exposure prophylaxis', 'C', '08:00', '10:00', '5.3.1', 'optimised', 'hiv', 'prescription', ARRAY['prep', 'descovy', 'tenofovir alafenamide', 'hiv prevention'], 'mg', 'Same time every day — window follows your body-clock routine.'),
  ('haart_biktarvy', 'Biktarvy', 'Antiretroviral (integrase-based)', 'C', '08:00', '10:00', '5.3.2', 'optimised', 'hiv', 'prescription', ARRAY['biktarvy', 'haart', 'hiv', 'antiretroviral', 'art'], 'mg', 'Once-daily ART on a stable daily clock cue.'),
  ('haart_triumeq', 'Triumeq', 'Antiretroviral (integrase-based)', 'C', '08:00', '10:00', '5.3.2', 'optimised', 'hiv', 'prescription', ARRAY['triumeq', 'haart', 'hiv', 'antiretroviral', 'art'], 'mg', 'Once-daily ART on a stable daily clock cue.'),
  ('haart_dovato', 'Dovato', 'Antiretroviral (integrase-based)', 'C', '08:00', '10:00', '5.3.2', 'optimised', 'hiv', 'prescription', ARRAY['dovato', 'haart', 'hiv', 'antiretroviral', 'art'], 'mg', 'Once-daily ART on a stable daily clock cue.'),
  ('haart_atripla', 'Atripla', 'Antiretroviral (NNRTI-based)', 'C', '20:00', '22:00', '5.3.2', 'optimised', 'hiv', 'prescription', ARRAY['atripla', 'haart', 'hiv', 'efavirenz'], 'mg', 'Often taken at bedtime to limit efavirenz side effects.'),
  ('dolutegravir', 'Dolutegravir', 'Integrase inhibitor', 'C', '08:00', '10:00', '5.3.2', 'optimised', 'hiv', 'prescription', ARRAY['dolutegravir', 'tivicay', 'haart', 'hiv'], 'mg', 'Same time daily — with or without food.'),
  ('emtricitabine_tenofovir_generic', 'PrEP (generic)', 'HIV pre-exposure prophylaxis', NULL, NULL, NULL, '5.3.1', 'tracked', 'hiv', 'prescription', ARRAY['prep', 'generic prep', 'emtricitabine', 'tenofovir'], 'mg', NULL),
  ('rilpivirine', 'Rilpivirine', 'Antiretroviral (NNRTI)', NULL, NULL, NULL, '5.3.2', 'tracked', 'hiv', 'prescription', ARRAY['rilpivirine', 'edurant', 'haart', 'hiv'], 'mg', NULL),
  ('tenofovir_alafenamide', 'Tenofovir alafenamide', 'NRTI', NULL, NULL, NULL, '5.3.1', 'tracked', 'hiv', 'prescription', ARRAY['tenofovir alafenamide', 'taf', 'vemlidy'], 'mg', NULL)
ON CONFLICT (code) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  drug_class = EXCLUDED.drug_class,
  evidence_grade = EXCLUDED.evidence_grade,
  optimal_window_start = EXCLUDED.optimal_window_start,
  optimal_window_end = EXCLUDED.optimal_window_end,
  timing_tier = EXCLUDED.timing_tier,
  cluster_id = EXCLUDED.cluster_id,
  search_terms = EXCLUDED.search_terms,
  dose_unit = EXCLUDED.dose_unit,
  rationale = EXCLUDED.rationale,
  updated_at = NOW();
