'use client'

import { useState, type FormEvent } from 'react'

import { BODY, BTN_PRIMARY, CARD, LABEL, LANDING_COLUMN, SECTION, SECTION_TITLE } from './layout'

import { GeometricBg } from './landing/GeometricBg'

const inputClassName =
  'type-body w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-black outline-none transition-colors placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10'

const ROLES = [
  'Patient',
  'GP',
  'Pharmacist',
  'Care home',
  'Employer',
  'Insurer',
] as const

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
    <section id="demo" className={`${SECTION} relative bg-white`}>
      <GeometricBg variant="light" />
      <div className={`${LANDING_COLUMN} relative`}>
        <h2 className={`${SECTION_TITLE} max-w-lg`}>See DIʘS in 20 minutes.</h2>

        {success ? (
          <p className={`${CARD} type-body mt-10 rounded-2xl p-6 text-black/80`} role="status">
            We&apos;ll be in touch within one business day.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`${CARD} mt-10 space-y-4 rounded-2xl p-6 sm:p-8`}
          >
            <div>
              <label htmlFor="full_name" className={`${LABEL} mb-2 block`}>
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email" className={`${LABEL} mb-2 block`}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@example.com"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="role" className={`${LABEL} mb-2 block`}>
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className={inputClassName}
                disabled={loading}
                defaultValue=""
              >
                <option value="" disabled>
                  Select your role
                </option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message" className={`${LABEL} mb-2 block`}>
                Message <span className="text-black/40">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Tell us what you'd like to see"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            {error ? (
              <p className={`${BODY} text-sm text-red-600`} role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className={`${BTN_PRIMARY} h-12 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8`}
            >
              {loading ? 'Sending…' : 'Book my demo →'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
