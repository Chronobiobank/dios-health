-- Seed Connect discovery peers so Sync Chat can create_or_get_dm with real UUIDs.
-- Fixed IDs match src/lib/chat/connect-demo-peers.ts

DO $$
DECLARE
  peer RECORD;
BEGIN
  FOR peer IN
    SELECT *
    FROM (
      VALUES
        (
          'a0000000-0000-4000-8000-000000000011'::uuid,
          'Ash R.',
          'ash.r@deepdose.internal'
        ),
        (
          'a0000000-0000-4000-8000-000000000012'::uuid,
          'Kai T.',
          'kai.t@deepdose.internal'
        ),
        (
          'a0000000-0000-4000-8000-000000000013'::uuid,
          'River M.',
          'river.m@deepdose.internal'
        ),
        (
          'a0000000-0000-4000-8000-000000000014'::uuid,
          'Sage L.',
          'sage.l@deepdose.internal'
        ),
        (
          'a0000000-0000-4000-8000-000000000015'::uuid,
          'Rowan K.',
          'rowan.k@deepdose.internal'
        ),
        (
          'a0000000-0000-4000-8000-000000000016'::uuid,
          'Sol A.',
          'sol.a@deepdose.internal'
        )
    ) AS t(id, display_name, email)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = peer.id) THEN
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
        peer.id,
        'authenticated',
        'authenticated',
        peer.email,
        extensions.crypt('disabled-no-login', extensions.gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('display_name', peer.display_name),
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
      WHERE user_id = peer.id AND provider = 'email'
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
        peer.id,
        peer.id,
        jsonb_build_object('sub', peer.id::text, 'email', peer.email),
        'email',
        peer.id::text,
        NOW(),
        NOW(),
        NOW()
      );
    END IF;

    INSERT INTO public.user_profiles (id, display_name, tier)
    VALUES (peer.id, peer.display_name, 'patient')
    ON CONFLICT (id) DO UPDATE
      SET display_name = EXCLUDED.display_name;
  END LOOP;
END $$;
