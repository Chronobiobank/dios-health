'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { BTN_PRIMARY, CARD } from '@/components/sections/layout'
import { isAllowedAvatarFile } from '@/lib/profile/avatar'

type ProfileAvatarUploadProps = {
  fullName: string
  initialAvatarUrl?: string | null
}

export function ProfileAvatarUpload({ fullName, initialAvatarUrl }: ProfileAvatarUploadProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAvatarUrl(initialAvatarUrl ?? null)
  }, [initialAvatarUrl])

  async function uploadFile(file: File) {
    if (!isAllowedAvatarFile(file)) {
      setError('Use a JPG, PNG, WebP, or HEIC image.')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as { error?: string; avatar_url?: string | null }

      if (!response.ok) {
        throw new Error(payload.error || 'Upload failed')
      }

      setAvatarUrl(payload.avatar_url ?? URL.createObjectURL(file))
      router.refresh()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function removePhoto() {
    setRemoving(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/avatar', { method: 'DELETE' })
      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'Could not remove photo')
      }

      setAvatarUrl(null)
      router.refresh()
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Could not remove photo')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className={`${CARD} rounded-2xl p-5 sm:p-6`}>
      <div className="flex items-center gap-4">
        <ProfileAvatar name={fullName} src={avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-black">{fullName}</p>
          <p className="mt-1 text-sm text-black/55">JPG, PNG, WebP, or HEIC · Max 5MB</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading || removing}
          onClick={() => inputRef.current?.click()}
          className={`${BTN_PRIMARY} h-10 px-5 disabled:opacity-60`}
        >
          {uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Upload photo'}
        </button>
        {avatarUrl ? (
          <button
            type="button"
            disabled={uploading || removing}
            onClick={removePhoto}
            className="h-10 rounded-full border border-black/10 px-5 text-sm font-medium text-black transition-colors hover:bg-black/5 disabled:opacity-60"
          >
            {removing ? 'Removing…' : 'Remove'}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void uploadFile(file)
        }}
      />

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
