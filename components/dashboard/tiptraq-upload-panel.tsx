'use client'

import { useRouter } from 'next/navigation'

import { TipTraqEdfUpload } from '@/components/dashboard/tiptraq-edf-upload'

export function TipTraQUploadPanel() {
  const router = useRouter()

  return (
    <TipTraqEdfUpload
      onComplete={() => {
        router.refresh()
      }}
    />
  )
}
