import type { Metadata } from 'next'

import { Footer } from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — DIOS Health',
  description: 'How DIOS collects, uses, and protects personal and health data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <main className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 sm:py-20">
        <p className="type-label">Legal</p>
        <h1 className="type-section mt-4 max-w-3xl">Privacy policy</h1>
        <p className="type-body mt-4 max-w-3xl">
          This page will set out how DIOS Health collects, uses, stores, and protects personal and health-related
          information. Full policy text is being prepared.
        </p>
      </main>

      <Footer />
    </div>
  )
}
