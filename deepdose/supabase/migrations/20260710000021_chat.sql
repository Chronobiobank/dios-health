-- Lean 1:1 chat: conversations, members, messages + Deepdose Guide demo peer.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  source_match_id TEXT
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  body            TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
  ON public.messages (conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS conversation_members_user_idx
  ON public.conversation_members (user_id);

-- ── Deepdose Guide (system peer for first-inbox demo DM) ─────────────────────

-- Fixed UUID referenced by app code (src/lib/chat/constants.ts)
DO $$
DECLARE
  guide_id UUID := 'a0000000-0000-4000-8000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = guide_id) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      COALESCE(
        (SELECT id FROM auth.instances LIMIT 1),
        '00000000-0000-0000-0000-000000000000'
      ),
      guide_id,
      'authenticated',
      'authenticated',
      'guide@deepdose.internal',
      extensions.crypt('disabled-no-login', extensions.gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Deepdose Guide"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.identities
    WHERE user_id = guide_id AND provider = 'email'
  ) THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      guide_id,
      guide_id,
      jsonb_build_object('sub', guide_id::text, 'email', 'guide@deepdose.internal'),
      'email',
      guide_id::text,
      NOW(),
      NOW(),
      NOW()
    );
  END IF;

  UPDATE public.user_profiles
  SET display_name = 'Deepdose Guide',
      tier = 'patient'
  WHERE id = guide_id;
END $$;

-- ── Helpers ──────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_conversation_member(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_members
    WHERE conversation_id = p_conversation_id
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.touch_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_touch_conversation ON public.messages;
CREATE TRIGGER messages_touch_conversation
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_conversation_last_message();

-- Find existing 1:1 DM between two users (exactly two members).
CREATE OR REPLACE FUNCTION public.find_dm_conversation(a UUID, b UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id
  FROM public.conversations c
  WHERE EXISTS (
    SELECT 1 FROM public.conversation_members m
    WHERE m.conversation_id = c.id AND m.user_id = a
  )
  AND EXISTS (
    SELECT 1 FROM public.conversation_members m
    WHERE m.conversation_id = c.id AND m.user_id = b
  )
  AND (
    SELECT COUNT(*) FROM public.conversation_members m
    WHERE m.conversation_id = c.id
  ) = 2
  ORDER BY c.created_at ASC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.create_or_get_dm(
  peer_user_id UUID,
  p_source_match_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  me UUID := auth.uid();
  existing UUID;
  new_id UUID;
BEGIN
  IF me IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF peer_user_id IS NULL OR peer_user_id = me THEN
    RAISE EXCEPTION 'Invalid peer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = peer_user_id) THEN
    RAISE EXCEPTION 'Peer not found';
  END IF;

  existing := public.find_dm_conversation(me, peer_user_id);
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;

  INSERT INTO public.conversations (source_match_id)
  VALUES (p_source_match_id)
  RETURNING id INTO new_id;

  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES (new_id, me), (new_id, peer_user_id);

  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_guide_dm()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  guide_id UUID := 'a0000000-0000-4000-8000-000000000001';
  conv_id UUID;
  me UUID := auth.uid();
BEGIN
  IF me IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF me = guide_id THEN
    RAISE EXCEPTION 'Guide cannot open demo DM';
  END IF;

  conv_id := public.create_or_get_dm(guide_id, 'deepdose-guide');

  IF NOT EXISTS (
    SELECT 1 FROM public.messages WHERE conversation_id = conv_id
  ) THEN
    INSERT INTO public.messages (conversation_id, sender_id, body)
    VALUES (
      conv_id,
      guide_id,
      'Welcome to Deepdose chat. When you match with someone on your chemistry, message them here — lean, private, no feed.'
    );
  END IF;

  RETURN conv_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_conversation_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_dm_conversation(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_or_get_dm(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_guide_dm() TO authenticated;

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_read_conversations" ON public.conversations;
CREATE POLICY "member_read_conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (public.is_conversation_member(id));

DROP POLICY IF EXISTS "member_read_members" ON public.conversation_members;
CREATE POLICY "member_read_members" ON public.conversation_members
  FOR SELECT TO authenticated
  USING (public.is_conversation_member(conversation_id));

DROP POLICY IF EXISTS "member_read_messages" ON public.messages;
CREATE POLICY "member_read_messages" ON public.messages
  FOR SELECT TO authenticated
  USING (public.is_conversation_member(conversation_id));

DROP POLICY IF EXISTS "member_send_messages" ON public.messages;
CREATE POLICY "member_send_messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND public.is_conversation_member(conversation_id)
  );

-- Chat peers: read display_name for users who share a conversation with you
DROP POLICY IF EXISTS "chat_peer_read_profiles" ON public.user_profiles;
CREATE POLICY "chat_peer_read_profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT cm2.user_id
      FROM public.conversation_members cm1
      JOIN public.conversation_members cm2
        ON cm2.conversation_id = cm1.conversation_id
      WHERE cm1.user_id = auth.uid()
    )
  );

-- ── Realtime ─────────────────────────────────────────────────────────────────

ALTER TABLE public.messages REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;
