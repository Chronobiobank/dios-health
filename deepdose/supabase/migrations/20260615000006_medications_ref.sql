CREATE TABLE public.medications (
  code                    TEXT PRIMARY KEY,
  display_name            TEXT NOT NULL,
  drug_class              TEXT,
  chronopharma_evidence   JSONB,
  optimal_window_start    TIME,
  optimal_window_end      TIME,
  evidence_grade          TEXT CHECK (evidence_grade IN ('A','B','C')),
  bnf_section             TEXT,
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.medications
  (code, display_name, drug_class, evidence_grade, optimal_window_start, optimal_window_end, bnf_section)
VALUES
  ('atorvastatin',  'Atorvastatin',  'Statin',                    'A', '20:00', '22:00', '2.12'),
  ('ramipril',      'Ramipril',      'ACE Inhibitor',             'A', '21:00', '23:00', '2.5.5.1'),
  ('amlodipine',    'Amlodipine',    'Calcium Channel Blocker',   'B', '20:00', '22:00', '2.6.2'),
  ('metformin',     'Metformin',     'Biguanide',                 'B', '07:00', '09:00', '6.1.2.2'),
  ('aspirin',       'Aspirin',       'Antiplatelet',              'A', '07:00', '09:00', '2.9'),
  ('prednisolone',  'Prednisolone',  'Corticosteroid',            'A', '02:00', '04:00', '6.3.2'),
  ('alendronate',   'Alendronate',   'Bisphosphonate',            'B', '07:00', '08:00', '6.6.2'),
  ('warfarin',      'Warfarin',      'Anticoagulant',             'B', '17:00', '19:00', '2.8.2');
