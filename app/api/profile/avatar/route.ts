import { NextRequest, NextResponse } from 'next/server'

import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  avatarContentTypeForFile,
  avatarExtensionForFile,
  buildAvatarStoragePath,
  getProfileAvatarUrl,
  isAllowedAvatarFile,
} from '@/lib/profile/avatar'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

function mapAvatarUploadError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('bucket not found') || lower.includes('invalid bucket')) {
    return 'Photo storage is not set up yet. Run supabase/run-profile-avatar.sql in Supabase SQL Editor.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Photo storage permissions are missing. Run supabase/run-profile-avatar.sql in Supabase SQL Editor.'
  }

  if (lower.includes('avatar_path') || lower.includes('schema cache') || lower.includes('column')) {
    return 'Profile photo column is missing. Run supabase/run-patient-signup-fields.sql in Supabase SQL Editor.'
  }

  if (lower.includes('save_avatar_path') || lower.includes('could not find the function')) {
    return 'Profile photo save function missing. Run supabase/run-profile-avatar.sql in Supabase SQL Editor.'
  }

  if (lower.includes('payload too large') || lower.includes('entity too large')) {
    return 'Image must be under 5MB.'
  }

  return 'Failed to upload photo. Please try a JPG, PNG, or WebP image under 5MB.'
}

function mapAvatarSaveError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('avatar_path') || lower.includes('schema cache') || lower.includes('column')) {
    return 'Profile photo column is missing. Run supabase/run-patient-signup-fields.sql in Supabase SQL Editor.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Could not save your photo. Sign out and sign in again, then retry.'
  }

  return mapAvatarUploadError(message)
}

async function saveAvatarPath(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  avatarPath: string | null
): Promise<{ error: string | null }> {
  const { error: rpcError } = await supabase.rpc('save_avatar_path', {
    p_avatar_path: avatarPath,
  })

  if (!rpcError) {
    return { error: null }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_path: avatarPath })
    .eq('id', userId)

  if (updateError) {
    return { error: mapAvatarSaveError(rpcError.message || updateError.message) }
  }

  return { error: null }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('avatar')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  if (!isAllowedAvatarFile(file)) {
    return NextResponse.json({ error: 'Use a JPG, PNG, WebP, or HEIC image' }, { status: 400 })
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
  }

  const extension = avatarExtensionForFile(file)
  const avatarPath = buildAvatarStoragePath(user.id, extension)
  const fileBytes = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(avatarPath, fileBytes, {
    contentType: avatarContentTypeForFile(file, extension),
    upsert: true,
  })

  if (uploadError) {
    console.error('Avatar upload error:', uploadError)
    return NextResponse.json({ error: mapAvatarUploadError(uploadError.message) }, { status: 500 })
  }

  const { error: saveError } = await saveAvatarPath(supabase, user.id, avatarPath)

  if (saveError) {
    console.error('Avatar profile update error:', saveError)
    return NextResponse.json({ error: saveError }, { status: 500 })
  }

  const avatar_url = await getProfileAvatarUrl(supabase, avatarPath)

  return NextResponse.json({ success: true, avatar_path: avatarPath, avatar_url })
}

export async function DELETE() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_path')
    .eq('id', user.id)
    .maybeSingle<{ avatar_path: string | null }>()

  if (profile?.avatar_path) {
    const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove([profile.avatar_path])
    if (removeError) {
      console.error('Avatar remove error:', removeError)
    }
  }

  const { error: saveError } = await saveAvatarPath(supabase, user.id, null)

  if (saveError) {
    console.error('Avatar clear error:', saveError)
    return NextResponse.json({ error: saveError }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
