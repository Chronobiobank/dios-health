-- Expand medications catalog: search terms, clusters, timing tiers, supplements

ALTER TABLE public.medications
  ADD COLUMN IF NOT EXISTS timing_tier TEXT NOT NULL DEFAULT 'optimised'
    CHECK (timing_tier IN ('optimised', 'tracked')),
  ADD COLUMN IF NOT EXISTS cluster_id TEXT,
  ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'prescription'
    CHECK (item_type IN ('prescription', 'supplement')),
  ADD COLUMN IF NOT EXISTS search_terms TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dose_unit TEXT NOT NULL DEFAULT 'mg',
  ADD COLUMN IF NOT EXISTS rationale TEXT;

-- Backfill existing rows
UPDATE public.medications SET
  timing_tier = 'optimised',
  item_type = 'prescription',
  cluster_id = CASE code
    WHEN 'atorvastatin' THEN 'cholesterol'
    WHEN 'ramipril' THEN 'heart'
    WHEN 'amlodipine' THEN 'heart'
    WHEN 'metformin' THEN 'glucose'
    WHEN 'aspirin' THEN 'blood_thinning'
    WHEN 'prednisolone' THEN 'inflammation'
    WHEN 'alendronate' THEN 'bones'
    WHEN 'warfarin' THEN 'coagulation'
    ELSE 'other'
  END,
  search_terms = CASE code
    WHEN 'atorvastatin' THEN ARRAY['atorvastatin', 'lipitor', 'statin']
    WHEN 'ramipril' THEN ARRAY['ramipril', 'ace inhibitor', 'titrace']
    WHEN 'amlodipine' THEN ARRAY['amlodipine', 'istin', 'calcium channel']
    WHEN 'metformin' THEN ARRAY['metformin', 'glucophage', 'diabetes']
    WHEN 'aspirin' THEN ARRAY['aspirin', 'dispirin', 'antiplatelet']
    WHEN 'prednisolone' THEN ARRAY['prednisolone', 'steroid', 'corticosteroid']
    WHEN 'alendronate' THEN ARRAY['alendronate', 'fosamax', 'bisphosphonate']
    WHEN 'warfarin' THEN ARRAY['warfarin', 'anticoagulant', 'inr']
    ELSE ARRAY[code]
  END
WHERE cluster_id IS NULL;

INSERT INTO public.medications
  (code, display_name, drug_class, evidence_grade, optimal_window_start, optimal_window_end, bnf_section, timing_tier, cluster_id, item_type, search_terms, dose_unit, rationale)
VALUES
  ('simvastatin', 'Simvastatin', 'Statin', 'A', '20:00', '22:00', '2.12', 'optimised', 'cholesterol', 'prescription', ARRAY['simvastatin', 'zocor', 'statin'], 'mg', 'Evening dosing aligns with nocturnal hepatic cholesterol synthesis.'),
  ('melatonin_supplement', 'Melatonin (supplement)', 'Sleep onset signal', 'B', '20:00', '21:00', NULL, 'optimised', 'sleep', 'supplement', ARRAY['melatonin', 'sleep aid', 'circadin'], 'mg', 'Anchored to your melatonin switch, not a fixed clock time.'),
  ('magnesium', 'Magnesium', 'Nervous system calm', 'C', '21:00', '22:30', NULL, 'optimised', 'sleep', 'supplement', ARRAY['magnesium', 'mag', 'glycinate', 'citrate'], 'mg', 'Evening wind-down timed to your lights-off anchor.'),
  ('vitamin_d3', 'Vitamin D3', 'Daylight biology', 'C', '07:00', '10:00', NULL, 'optimised', 'sleep', 'supplement', ARRAY['vitamin d', 'vitamin d3', 'd3', 'cholecalciferol'], 'iu', 'Morning with food — not at bedtime.'),
  ('vitamin_b6', 'Vitamin B6', 'Sleep chemistry', 'C', '18:00', '20:00', NULL, 'optimised', 'sleep', 'supplement', ARRAY['vitamin b6', 'b6', 'pyridoxine'], 'mg', 'Evening timing for sleep-formula use.'),
  ('vitamin_b12', 'Vitamin B12', 'Morning activation', 'C', '07:00', '09:00', NULL, 'optimised', 'sleep', 'supplement', ARRAY['vitamin b12', 'b12', 'cobalamin'], 'mcg', 'Morning dosing avoids sleep disruption.'),
  ('omeprazole', 'Omeprazole', 'Proton pump inhibitor', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['omeprazole', 'losec', 'ppi'], 'mg', NULL),
  ('lansoprazole', 'Lansoprazole', 'Proton pump inhibitor', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['lansoprazole', 'zoton', 'ppi'], 'mg', NULL),
  ('levothyroxine', 'Levothyroxine', 'Thyroid hormone', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['levothyroxine', 'thyroxine', 'thyrox'], 'mcg', NULL),
  ('sertraline', 'Sertraline', 'SSRI antidepressant', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['sertraline', 'lustral'], 'mg', NULL),
  ('citalopram', 'Citalopram', 'SSRI antidepressant', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['citalopram', 'cipramil'], 'mg', NULL),
  ('bisoprolol', 'Bisoprolol', 'Beta blocker', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['bisoprolol', 'cardicor'], 'mg', NULL),
  ('gliclazide', 'Gliclazide', 'Sulfonylurea', NULL, NULL, NULL, NULL, 'tracked', 'glucose', 'prescription', ARRAY['gliclazide', 'diamicron'], 'mg', NULL),
  ('losartan', 'Losartan', 'ARB', NULL, NULL, NULL, NULL, 'tracked', 'heart', 'prescription', ARRAY['losartan', 'cozaar'], 'mg', NULL),
  ('zopiclone', 'Zopiclone', 'Hypnotic', NULL, NULL, NULL, NULL, 'tracked', 'sleep', 'prescription', ARRAY['zopiclone', 'zimovane'], 'mg', NULL),
  ('amitriptyline', 'Amitriptyline', 'Tricyclic antidepressant', NULL, NULL, NULL, NULL, 'tracked', 'sleep', 'prescription', ARRAY['amitriptyline'], 'mg', NULL),
  ('gabapentin', 'Gabapentin', 'Anticonvulsant', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['gabapentin', 'neurontin'], 'mg', NULL),
  ('furosemide', 'Furosemide', 'Loop diuretic', NULL, NULL, NULL, NULL, 'tracked', 'heart', 'prescription', ARRAY['furosemide', 'lasix', 'diuretic'], 'mg', NULL),
  ('salbutamol', 'Salbutamol', 'Bronchodilator', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['salbutamol', 'ventolin', 'inhaler'], 'mcg', NULL),
  ('paracetamol', 'Paracetamol', 'Analgesic', NULL, NULL, NULL, NULL, 'tracked', 'other', 'prescription', ARRAY['paracetamol', 'panadol'], 'mg', NULL),
  ('insulin_glargine', 'Insulin glargine', 'Basal insulin', NULL, NULL, NULL, NULL, 'tracked', 'glucose', 'prescription', ARRAY['insulin glargine', 'lantus', 'insulin'], 'units', NULL)
ON CONFLICT (code) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  drug_class = EXCLUDED.drug_class,
  evidence_grade = EXCLUDED.evidence_grade,
  optimal_window_start = EXCLUDED.optimal_window_start,
  optimal_window_end = EXCLUDED.optimal_window_end,
  timing_tier = EXCLUDED.timing_tier,
  cluster_id = EXCLUDED.cluster_id,
  item_type = EXCLUDED.item_type,
  search_terms = EXCLUDED.search_terms,
  dose_unit = EXCLUDED.dose_unit,
  rationale = EXCLUDED.rationale,
  updated_at = NOW();

CREATE INDEX IF NOT EXISTS medications_search_terms_gin ON public.medications USING GIN (search_terms);
