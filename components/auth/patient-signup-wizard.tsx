'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { BTN_PRIMARY } from '@/components/sections/layout'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'

const TOTAL_STEPS = 2

export function PatientSignupWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [researchConsent, setResearchConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setError(null)
    setStep(2)
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const full_name = `${firstName.trim()} ${familyName.trim()}`.trim()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            first_name: firstName.trim(),
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      let user = authData.user

      if (!authData.session && user) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (signInError) {
          setError(signInError.message)
          setLoading(false)
          return
        }

        user = signInData.user
      }

      if (!user) {
        setError('Account creation failed. Please try again.')
        setLoading(false)
        return
      }

      await supabase.from('profiles').upsert(
        {
          id: user.id,
          role: 'patient',
          full_name,
        },
        { onConflict: 'id' }
      )

      await supabase.from('patient_profiles').upsert(
        {
          id: user.id,
          first_name: firstName.trim(),
          family_name: familyName.trim() || null,
          onboarding_complete: true,
        },
        { onConflict: 'id' }
      )

      await supabase.from('chronobiobank_consent').upsert({
        patient_id: user.id,
        clinical_consent: true,
        research_consent: researchConsent,
        consent_version: 'v1.0',
      })

      router.push(PATIENT_ROUTES.mel)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      {step === 1 ? (
        <form onSubmit={handleStep1} className="flex flex-col gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-black/40">
              Step 1 of {TOTAL_STEPS}
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-black">Create your account.</h1>
            <p className="mt-2 text-sm text-black/60">Your body clock data stays on your device.</p>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-black/70">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Grant"
                className={AUTH_INPUT_CLASS}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-black/70">Last name</label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Munro"
                className={AUTH_INPUT_CLASS}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black/70">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="grant@circadian.nz"
              className={AUTH_INPUT_CLASS}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black/70">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className={AUTH_INPUT_CLASS}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className={BTN_PRIMARY}>
            Continue →
          </button>

          <p className="text-center text-sm text-black/50">
            Already have an account?{' '}
            <Link href={AUTH_ROUTES.signIn} className="text-black underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleStep2} className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-black/40">
              Step 2 of {TOTAL_STEPS}
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-black">How your data works.</h1>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-neutral-50 p-5">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path
                    d="M10 3L5 8.5 2 5.5"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-medium text-black">Clinical use</p>
                <p className="mt-1 text-sm leading-relaxed text-black/60">
                  Your session data personalises your dose timing and light protocol. Required to use Mel.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`cursor-pointer rounded-2xl border p-5 transition-colors ${
              researchConsent ? 'border-black bg-black text-white' : 'border-black/[0.08] bg-white text-black'
            }`}
            onClick={() => setResearchConsent((r) => !r)}
            role="checkbox"
            aria-checked={researchConsent}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                setResearchConsent((r) => !r)
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  researchConsent ? 'border-white bg-white' : 'border-black/20'
                }`}
              >
                {researchConsent ? (
                  <svg className="h-3 w-3 text-black" fill="currentColor" viewBox="0 0 12 12">
                    <path
                      d="M10 3L5 8.5 2 5.5"
                      stroke="black"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </div>
              <div>
                <p className={`text-[15px] font-medium ${researchConsent ? 'text-white' : 'text-black'}`}>
                  Join the Chronobiobank
                </p>
                <p className={`mt-1 text-sm leading-relaxed ${researchConsent ? 'text-white/70' : 'text-black/60'}`}>
                  Anonymised data contributes to the world&apos;s first longitudinal melanopic lux dataset — helping
                  reshape how medications are prescribed globally. You can change this any time.
                </p>
                {researchConsent ? (
                  <p className="mt-2 font-mono text-[11px] text-white/50">You are not a patient. You are a founder.</p>
                ) : null}
              </div>
            </div>
          </div>

          <p className="text-[12px] leading-relaxed text-black/40">
            Anonymised research data may be licensed to academic and pharmaceutical research partners under strict
            governance. Your identifiable data is never shared.
          </p>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className={BTN_PRIMARY} disabled={loading}>
            {loading ? 'Creating account…' : 'Begin your first Mel session →'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-center text-sm text-black/50 hover:text-black"
          >
            ← Back
          </button>
        </form>
      )}
    </AuthShell>
  )
}
