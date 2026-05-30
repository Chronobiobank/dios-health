'use client'

import { useRouter } from 'next/navigation'

import TipTraQUpload from '@/components/TipTraQUpload'

export function TipTraQUploadPanel() {
  const router = useRouter()

  return (
    <TipTraQUpload
      onComplete={() => {
        router.refresh()
      }}
    />
  )
}
