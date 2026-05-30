import { NextRequest, NextResponse } from 'next/server'

import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  avatarExtensionForFile,
  buildAvatarStoragePath,
  isAllowedAvatarFile,
} from '@/lib/profile/avatar'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

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
    return NextResponse.json({ error: 'Use a JPG, PNG, or WebP image' }, { status: 400 })
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
  }

  const extension = avatarExtensionForFile(file)
  const avatarPath = buildAvatarStoragePath(user.id, extension)
  const fileBytes = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(avatarPath, fileBytes, {
    contentType: file.type || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
    upsert: true,
  })

  if (uploadError) {
    console.error('Avatar upload error:', uploadError)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_path: avatarPath })
    .eq('id', user.id)

  if (updateError) {
    console.error('Avatar profile update error:', updateError)
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 })
  }

  return NextResponse.json({ success: true, avatar_path: avatarPath })
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

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_path: null })
    .eq('id', user.id)

  if (updateError) {
    console.error('Avatar clear error:', updateError)
    return NextResponse.json({ error: 'Failed to remove photo' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
