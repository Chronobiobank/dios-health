import type { SupabaseClient } from '@supabase/supabase-js'

export const AVATAR_BUCKET = 'avatars'
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024

const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

export type AvatarExtension = 'jpg' | 'png' | 'webp' | 'heic'

export function isAllowedAvatarFile(file: File): boolean {
  if (file.type && ALLOWED_AVATAR_TYPES.has(file.type)) return true
  const lower = file.name.toLowerCase()
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.heic') ||
    lower.endsWith('.heif')
  )
}

export function avatarExtensionForFile(file: File): AvatarExtension {
  const lower = file.name.toLowerCase()
  if (file.type === 'image/png' || lower.endsWith('.png')) return 'png'
  if (file.type === 'image/webp' || lower.endsWith('.webp')) return 'webp'
  if (file.type === 'image/heic' || file.type === 'image/heif' || lower.endsWith('.heic') || lower.endsWith('.heif')) {
    return 'heic'
  }
  return 'jpg'
}

export function avatarContentTypeForFile(file: File, extension: AvatarExtension): string {
  if (file.type) return file.type
  if (extension === 'jpg') return 'image/jpeg'
  if (extension === 'heic') return 'image/heic'
  return `image/${extension}`
}

export function buildAvatarStoragePath(userId: string, extension: AvatarExtension): string {
  return `${userId}/avatar.${extension}`
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export async function getProfileAvatarUrl(
  supabase: SupabaseClient,
  avatarPath: string | null | undefined,
  expiresInSeconds = 3600
): Promise<string | null> {
  if (!avatarPath) return null

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarPath, expiresInSeconds)

  if (error || !data?.signedUrl) return null
  return data.signedUrl
}
