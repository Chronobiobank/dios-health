'use client'

import { useState, type FormEvent } from 'react'

const ROLES = ['GP', 'Neurologist', 'Endocrinologist', 'Private practice', 'Other'] as const

export function SecopeuticPilotForm() {
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
          message: ['Secopeutic pilot request', data.get('message')].filter(Boolean).join(' — '),
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

  if (success) {
    return (
      <p className="seco-pilot__success">
        Thank you. We will confirm your pilot within one business day.
      </p>
    )
  }

  return (
    <form className="seco-pilot__form" onSubmit={handleSubmit}>
      <label className="seco-pilot__field">
        <span className="seco-pilot__label">Full name</span>
        <input className="seco-pilot__input" name="full_name" type="text" required autoComplete="name" />
      </label>
      <label className="seco-pilot__field">
        <span className="seco-pilot__label">Work email</span>
        <input className="seco-pilot__input" name="email" type="email" required autoComplete="email" />
      </label>
      <label className="seco-pilot__field">
        <span className="seco-pilot__label">Practice or organisation</span>
        <input className="seco-pilot__input" name="organisation" type="text" required />
      </label>
      <label className="seco-pilot__field">
        <span className="seco-pilot__label">Role</span>
        <select className="seco-pilot__input" name="role" required defaultValue="">
          <option value="" disabled>
            Select role
          </option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>
      <label className="seco-pilot__field">
        <span className="seco-pilot__label">Patients for pilot (optional)</span>
        <input className="seco-pilot__input" name="patient_count" type="text" placeholder="Up to 3" />
      </label>
      <label className="seco-pilot__field">
        <span className="seco-pilot__label">Notes (optional)</span>
        <textarea className="seco-pilot__input seco-pilot__input--area" name="message" rows={3} />
      </label>
      {error ? <p className="seco-pilot__error">{error}</p> : null}
      <button className="seco-landing__btn seco-landing__btn--primary" type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Claim free pilot →'}
      </button>
    </form>
  )
}
