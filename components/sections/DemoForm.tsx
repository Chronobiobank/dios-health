'use client'

import { useState, type FormEvent } from 'react'

import { BTN_PRIMARY, BODY, CARD, CONTAINER, LABEL, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const inputClassName =
  'type-body w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-black outline-none transition-colors placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10'

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
          organisation: data.get('organisation'),
          email: data.get('email'),
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
    <section id="demo" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={`${CONTAINER} mx-auto max-w-lg text-center`}>
        <SectionLabel title="Book a demo" className="text-center" />
        <h2 className={`${SECTION_TITLE} mt-4`}>See DIOS in action</h2>
        <p className={`${BODY} mt-4`}>
          You get a live walkthrough with real timing data and no procurement process
        </p>

        {success ? (
          <p className={`${CARD} type-body mt-10 rounded-2xl p-6 text-black/80`}>
            Thank you — we will reply within one business day
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`${CARD} mt-8 space-y-4 rounded-2xl p-6 text-left sm:p-8`}
          >
            <div>
              <label htmlFor="full_name" className={`${LABEL} mb-2 block`}>
                Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Dr Jane Smith"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="organisation" className={`${LABEL} mb-2 block`}>
                Practice
              </label>
              <input
                id="organisation"
                name="organisation"
                type="text"
                required
                autoComplete="organization"
                placeholder="Auckland Medical Centre"
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
                placeholder="jane@practice.nz"
                className={inputClassName}
                disabled={loading}
              />
            </div>
            {error ? (
              <p className="type-body text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className={`${BTN_PRIMARY} h-11 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? 'Sending…' : 'Book a demo'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
