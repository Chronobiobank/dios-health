import type { Metadata } from 'next'

import { Footer } from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service — DIOS Health',
  description: 'Terms governing use of the DIOS dose intelligence platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <main className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 sm:py-20">
        <p className="type-label">Legal</p>
        <h1 className="type-section mt-4 max-w-3xl">Terms of service</h1>
        <p className="type-body mt-4 max-w-3xl">
          This page will set out the terms governing access to and use of the DIOS platform and related services. Full
          terms are being prepared.
        </p>
      </main>

      <Footer />
    </div>
  )
}
