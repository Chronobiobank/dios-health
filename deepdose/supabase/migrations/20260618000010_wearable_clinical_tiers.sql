-- Allow TipTraQ as a wearable provider (clinical tier)

ALTER TABLE public.wearable_connections
  DROP CONSTRAINT IF EXISTS wearable_connections_provider_check;

ALTER TABLE public.wearable_connections
  ADD CONSTRAINT wearable_connections_provider_check
  CHECK (provider IN ('tiptraq', 'oura', 'whoop', 'apple_health'));
