-- TipTraQ baseline completion → clinical-grade patient badge (clinicians cannot UPDATE patient_profiles via RLS)

CREATE OR REPLACE FUNCTION public.set_premium_tier_on_tiptraq_baseline()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'baseline_complete'
    AND NEW.baseline_completed_at IS NOT NULL
    AND (
      OLD.status IS DISTINCT FROM NEW.status
      OR OLD.baseline_completed_at IS NULL
    )
  THEN
    UPDATE public.patient_profiles
    SET is_premium_tier = TRUE,
        updated_at = NOW()
    WHERE id = NEW.patient_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tiptraq_baseline_premium_tier ON public.tiptraq_assessments;

CREATE TRIGGER tiptraq_baseline_premium_tier
  AFTER UPDATE ON public.tiptraq_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_premium_tier_on_tiptraq_baseline();
