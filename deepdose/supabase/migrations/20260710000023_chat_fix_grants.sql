-- Fix chat permission denied: RLS policies call is_conversation_member,
-- but 20260710000022 revoked EXECUTE from authenticated and never restored it.
-- Also grant table privileges required by the PostgREST role.

GRANT EXECUTE ON FUNCTION public.is_conversation_member(UUID) TO authenticated;

GRANT SELECT ON TABLE public.conversations TO authenticated;
GRANT SELECT ON TABLE public.conversation_members TO authenticated;
GRANT SELECT, INSERT ON TABLE public.messages TO authenticated;

-- Guide profile must exist for create_or_get_dm peer check
INSERT INTO public.user_profiles (id, display_name, tier)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Deepdose Guide',
  'patient'
)
ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name;
