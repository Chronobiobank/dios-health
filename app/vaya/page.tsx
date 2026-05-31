import Link from 'next/link'
import type { Metadata } from 'next'

import { AUTH_ROUTES } from '@/lib/auth/routes'

export const metadata: Metadata = {
  title: 'Vaya — Know your light. Time your doses.',
  description:
    'A 60-second camera session that measures your Melanopic Lux score and delivers a personalised light and medication protocol. Free. Web-based. No download required.',
  openGraph: {
    title: 'Vaya — Know your light. Time your doses.',
    description:
      'Measure your body clock from your smartphone camera. No wearable. No app download. No clinic visit.',
  },
}

export default function VayaPage() {
  return (
    <main className="flex min-h-svh flex-col bg-black text-white">
      <section className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-6">
        <p
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: 'var(--color-brand)' }}
        >
          By DIʘS · Web-based · Free
        </p>

        <h1 className="mt-6 max-w-2xl text-[36px] font-medium leading-tight sm:text-[52px]">
          Know your light.
          <br />
          Time your doses.
        </h1>

        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/60 sm:text-lg">
          Vaya is a 60-second camera session that measures your Melanopic Lux score — the direct
          signal to your master body clock. Your personalised light targets and medication timing
          protocol arrive instantly.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={AUTH_ROUTES.signUpPatient}
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-[15px] font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-brand)', color: '#000' }}
          >
            Start your first Vaya session →
          </Link>
          <Link
            href="/signin"
            className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-[15px] font-medium text-white/70 transition-colors hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            Sign in
          </Link>
        </div>

        <p className="mt-6 font-mono text-[11px] text-white/30">
          No download required · Works in Safari and Chrome · Camera stays on your device
        </p>
      </section>

      <section
        className="border-t px-5 py-16 sm:px-6"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              label: '60 seconds',
              body: 'Front camera session. Vaya asks the questions. Your phone does the measuring.',
            },
            {
              label: 'Melanopic Lux',
              body: 'The biomarker validated in 89,000-person UK Biobank studies as the primary driver of cardiometabolic health.',
            },
            {
              label: 'Your protocol',
              body: 'Morning light targets. Evening dark windows. Chronodosing schedule for your medications.',
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-3">
              <p
                className="font-mono text-[13px] font-medium"
                style={{ color: 'var(--color-brand)' }}
              >
                {item.label}
              </p>
              <p className="text-[15px] leading-relaxed text-white/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border-t px-5 py-12 text-center sm:px-6"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
          Install to home screen
        </p>
        <p className="mt-3 text-[15px] text-white/50">
          On iPhone: tap Share → Add to Home Screen.
          <br />
          On Android: tap the browser menu → Install app.
        </p>
        <p className="mt-4 font-mono text-[11px] text-white/30">
          Vaya · dios.health/vaya · Powered by DIʘS Health
        </p>
      </section>
    </main>
  )
}
