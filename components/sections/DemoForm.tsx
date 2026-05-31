'use client'

import { useState, type FormEvent } from 'react'

import { BTN_HERO, CONTAINER, LABEL, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const ROLES = [
  'GP',
  'Care home manager',
  'NHS commissioner',
  'Pharmacist',
  'Employer',
  'Insurer',
  'Researcher',
  'Other',
] as const

const inputClassName =
  'type-body w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-black outline-none transition-colors placeholder:text-black/40 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20'

const selectClassName =
  'type-body w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-black outline-none focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20'

export function DemoForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.get('full_name'),
          email: data.get('email'),
          role: data.get('role'),
          organisation: data.get('organisation'),
          patient_count: data.get('patient_count'),
          message: data.get('message'),
        }),
      })

      const result = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      form.reset()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="demo" className="scroll-mt-[calc(var(--dios-site-nav-height)+1rem)] bg-black py-14 text-white sm:py-20">
      <div className={`${CONTAINER} mx-auto max-w-lg`}>
        <SectionLabel title="Book a demo" light className="text-center" />
        <h2 className={`${SECTION_TITLE} mt-4 text-center text-white`}>20 minutes. Live demo.</h2>
        <p className="type-hero-meta mt-4 text-center text-white/75">
          See a real patient body clock report.
        </p>

        {success ? (
          <p className="type-body mt-10 rounded-2xl border border-white/15 bg-white/10 p-6 text-center text-white">
            Thank you. One business day.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
            <div>
              <label htmlFor="full_name" className={`${LABEL} mb-2 block text-white/80`}>
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email" className={`${LABEL} mb-2 block text-white/80`}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="role" className={`${LABEL} mb-2 block text-white/80`}>
                Role
              </label>
              <select id="role" name="role" required className={selectClassName} disabled={loading}>
                <option value="">Select role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="organisation" className={`${LABEL} mb-2 block text-white/80`}>
                Organisation
              </label>
              <input
                id="organisation"
                name="organisation"
                type="text"
                required
                autoComplete="organization"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="patient_count" className={`${LABEL} mb-2 block text-white/80`}>
                Number of patients or residents (optional)
              </label>
              <input
                id="patient_count"
                name="patient_count"
                type="text"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="message" className={`${LABEL} mb-2 block text-white/80`}>
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className={inputClassName}
                disabled={loading}
              />
            </div>
            {error ? (
              <p className="type-body text-sm text-red-300" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className={`${BTN_HERO} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? 'Sending…' : 'Book a clinical demo →'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
