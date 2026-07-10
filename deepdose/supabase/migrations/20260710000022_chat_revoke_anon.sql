-- Harden chat RPCs: revoke anon/public execute; keep only intentional authenticated grants.

REVOKE ALL ON FUNCTION public.is_conversation_member(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.find_dm_conversation(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_conversation_last_message() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_or_get_dm(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.ensure_guide_dm() FROM PUBLIC, anon;

-- Internal helpers stay callable from policies/triggers (owner), not via PostgREST.
-- App RPCs: authenticated only.
GRANT EXECUTE ON FUNCTION public.create_or_get_dm(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_guide_dm() TO authenticated;
