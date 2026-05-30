'use client'

import { useState, type FormEvent } from 'react'

import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { createClient } from '@/lib/supabase/client'

type InvitePatientFormProps = {
  clinicianId: string
}

export function InvitePatientForm({ clinicianId }: InvitePatientFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { error: inviteError } = await supabase.from('clinician_patients').insert({
      clinician_id: clinicianId,
      invite_email: email.trim().toLowerCase(),
      status: 'pending',
    })

    if (inviteError) {
      setError('Could not send invite. Check the email and try again.')
      setLoading(false)
      return
    }

    setMessage('Invite sent.')
    setEmail('')
    setLoading(false)
  }

  return (
    <section id="invite-patient" className="mt-10 scroll-mt-24">
      <h2 className="type-caption font-mono uppercase tracking-widest text-black/45">Invite a patient</h2>

      <form onSubmit={handleSubmit} className={`${CARD} mt-4 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-end`}>
        <div className="flex-1">
          <label htmlFor="invite_email" className={`${LABEL} mb-2 block`}>
            Patient email
          </label>
          <input
            id="invite_email"
            type="email"
            required
            placeholder="Patient email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={AUTH_INPUT_CLASS}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${BTN_PRIMARY} h-11 shrink-0 px-5 disabled:opacity-60 sm:mb-0.5`}
        >
          {loading ? 'Sending…' : 'Send invite →'}
        </button>
      </form>

      {message ? <p className="type-body mt-3 text-sm text-black/70">{message}</p> : null}
      {error ? (
        <p className="type-body mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
