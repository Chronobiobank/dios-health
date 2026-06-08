'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'
import { createClient } from '@/lib/supabase/client'

const scenarios = {
  morning: {
    label: 'Morning',
    caption: 'Right time for each medicine — no reminder',
    messages: [
      {
        role: 'dina' as const,
        text: 'Window opens 7:15. Thyroid first, fasting. D3 and K2 at 7:45 with fat. Magnesium at 9pm.',
      },
      {
        role: 'user' as const,
        text: 'Why thyroid before D3?',
      },
      {
        role: 'dina' as const,
        text: 'Empty gut only. Magnesium blocks absorption. Thirty minutes keeps the window clean.',
      },
    ],
    suggestions: ['Take together?', 'D3 window?', 'Eat before thyroid?'],
  },
  conflict: {
    label: 'Conflict',
    caption: 'Unsafe timing caught before your clinic sees it',
    messages: [
      {
        role: 'user' as const,
        text: 'Magnesium now? It is 8am.',
      },
      {
        role: 'dina' as const,
        text: 'Not yet — thyroid window open. Magnesium at 9pm. Six pm works after 10am close.',
      },
      {
        role: 'user' as const,
        text: 'What about calcium?',
      },
      {
        role: 'dina' as const,
        text: 'Stopped on Coimbra. D3 and K2 handle bone. Extra calcium risks hypercalcaemia.',
      },
    ],
    suggestions: ['Why no calcium?', 'Window close?', 'In my notes?'],
  },
  missed: {
    label: 'Missed dose',
    caption: 'Nuance — not guilt',
    messages: [
      {
        role: 'user' as const,
        text: 'Forgot D3. It is 2pm.',
      },
      {
        role: 'dina' as const,
        text: 'Take now — correction window open. Next dose tomorrow 7:45am. Take with fat.',
      },
      {
        role: 'user' as const,
        text: 'Does exact time matter?',
      },
      {
        role: 'dina' as const,
        text: 'Fat and daily rhythm beat the hour. Six of seven days on window. REM improving.',
      },
    ],
    suggestions: ['REM latency?', 'Adherence?', 'Missed dose?'],
  },
} as const

type ScenarioKey = keyof typeof scenarios

const stack = [
  { name: 'Levothyroxine 75mcg', window: '7:15 · fasting', status: 'open' as const },
  { name: 'Vitamin D3 10,000 IU', window: '7:45 · with fat', status: 'open' as const },
  { name: 'Vitamin K2 200mcg', window: '7:45 · with D3', status: 'open' as const },
  { name: 'Magnesium glycinate', window: '9:00 pm', status: 'later' as const },
  { name: 'Vitamin B2', window: '1:00 pm', status: 'later' as const },
  { name: 'Calcium', window: 'Coimbra — stopped', status: 'stopped' as const },
]

const features = [
  {
    title: 'Right timing',
    body: 'Each dose matched to your sleep and wake rhythm.',
  },
  {
    title: 'Clash alerts',
    body: 'Spots unsafe mixes — calcium, magnesium, iron.',
  },
  {
    title: 'Your protocol',
    body: 'Follows Coimbra and Gominak plans your clinician set.',
  },
  {
    title: 'Progress',
    body: 'Sleep changes show up before your next blood test.',
  },
]

const genericItems = [
  'Take vitamin D',
  'Ramipril 8:00am',
  'You missed a dose',
  'Log medication',
]

const dinaItems = [
  '7:15 — thyroid first',
  'Clock shifted — Ramipril moved',
  'Missed 2h — take now',
  'D3 logged to Chronobiobank',
]

function stackBadgeClass(status: (typeof stack)[number]['status']) {
  if (status === 'open') return 'dina-product__stack-badge dina-product__stack-badge--open'
  if (status === 'stopped') return 'dina-product__stack-badge dina-product__stack-badge--stopped'
  return 'dina-product__stack-badge dina-product__stack-badge--later'
}

function stackBadgeLabel(status: (typeof stack)[number]['status']) {
  if (status === 'open') return 'Open'
  if (status === 'stopped') return 'Stopped'
  return 'Later'
}

function useDinaLinks() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(Boolean(session))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  const coachHref = isAuthenticated
    ? PATIENT_ROUTES.coach
    : `${AUTH_ROUTES.authSignIn}?next=${encodeURIComponent(PATIENT_ROUTES.coach)}`

  const primaryCta = isAuthenticated
    ? { label: 'Open DINA', href: PATIENT_ROUTES.coach }
    : { label: PATIENT_PREVIEW_ENTRY.ctaLabel, href: PATIENT_PREVIEW_ENTRY.href }

  return { isAuthenticated, coachHref, primaryCta }
}

const SCENARIO_KEYS = Object.keys(scenarios) as ScenarioKey[]

export default function DinaPage() {
  const [active, setActive] = useState<ScenarioKey>('morning')
  const { isAuthenticated, coachHref, primaryCta } = useDinaLinks()

  return (
    <div className="calm-landing dios-nav-tone-paper">
      <main className="marketing-main marketing-detail kz-narrative dina-product">
        <section className="dina-product__hero">
          <p className="type-pitch-eyebrow">Patients</p>
          <h1 className="dina-product__title type-section">
            Knows your <em>meds</em>.
          </h1>
          <p className="kz-lead dina-product__lead">
            Tells you when to take each medicine. Warns you if the timing is unsafe.
          </p>
        </section>

        <section className="dina-product__section">
          <div className="dina-product__tabs" role="tablist" aria-label="DINA conversation scenarios">
            {SCENARIO_KEYS.map((key) => {
              const tabId = `dina-tab-${key}`
              const panelId = `dina-panel-${key}`
              return (
                <button
                  key={key}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={active === key}
                  aria-controls={panelId}
                  tabIndex={active === key ? 0 : -1}
                  className={
                    active === key ? 'dina-product__tab dina-product__tab--active' : 'dina-product__tab'
                  }
                  onClick={() => setActive(key)}
                >
                  {scenarios[key].label}
                </button>
              )
            })}
          </div>

          {SCENARIO_KEYS.map((key) => {
            const scenario = scenarios[key]
            const tabId = `dina-tab-${key}`
            const panelId = `dina-panel-${key}`
            const isActive = active === key

            return (
              <div
                key={key}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                hidden={!isActive}
                tabIndex={isActive ? 0 : undefined}
                className="dina-product__chat"
              >
                <div className="dina-product__chat-header">
                  <div className="dina-product__chat-avatar" aria-hidden>
                    D
                  </div>
                  <div>
                    <p className="dina-product__chat-name">DINA</p>
                    <p className="dina-product__chat-role">Dose Intelligence</p>
                  </div>
                  <span className="dina-product__chat-status" aria-label="Online" />
                </div>

                <div className="dina-product__chat-body">
                  <div className="dina-product__context-pill">Sean · DLMO 22:57 · D3 10k</div>

                  <div className="dina-product__thread chat-messages">
                    {scenario.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={
                          msg.role === 'user'
                            ? 'dina-product__message dina-product__message--user'
                            : 'dina-product__message dina-product__message--dina'
                        }
                      >
                        <span className="dina-product__message-label">
                          {msg.role === 'dina' ? 'DINA' : 'Sean'}
                        </span>
                        <div
                          className={
                            msg.role === 'dina'
                              ? 'dina-product__bubble--dina'
                              : 'dina-product__bubble--user'
                          }
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dina-product__suggestions">
                  {scenario.suggestions.map((q) => (
                    <Link key={q} href={coachHref} className="dina-product__suggestion">
                      {q} →
                    </Link>
                  ))}
                </div>

                <p className="type-caption dina-product__chat-caption">{scenario.caption}</p>
              </div>
            )
          })}

          <p className="type-caption dina-product__footnote">
            {isAuthenticated
              ? 'You are signed in — open DINA on your stack.'
              : 'Sign in to run DINA on your stack.'}
          </p>

          <div className="dina-product__cta-section dina-product__cta-section--mid" aria-label="Get DINA">
            <p className="type-body dina-product__cta-copy">Free for patients. Clinician sees every dose.</p>
            <div className="dina-product__cta-actions">
              <Link href={primaryCta.href} className="btn-primary dina-product__btn-primary">
                {primaryCta.label}
              </Link>
              <Link href={MARKETING_ROUTES.technology} className="dina-product__btn-ghost">
                How it works →
              </Link>
            </div>
          </div>
        </section>

        <hr className="dina-product__divider" />

        <section className="dina-product__section">
          <p className="type-pitch-eyebrow">What it does</p>
          <div className="dina-product__grid">
            {features.map((f) => (
              <div key={f.title} className="dina-product__card">
                <p className="dina-product__card-title">{f.title}</p>
                <p className="type-body dina-product__card-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dina-product__section">
          <div className="dina-product__contrast">
            <p className="type-pitch-eyebrow">DINA vs generic</p>
            <div className="dina-product__contrast-grid">
              <div>
                <p className="dina-product__contrast-label">Generic</p>
                {genericItems.map((t) => (
                  <p key={t} className="dina-product__contrast-item">
                    {t}
                  </p>
                ))}
              </div>
              <div>
                <p className="dina-product__contrast-label dina-product__contrast-label--dina">
                  DINA
                </p>
                {dinaItems.map((t) => (
                  <p key={t} className="dina-product__contrast-item dina-product__contrast-item--dina">
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dina-product__section">
          <p className="type-pitch-eyebrow">Stack today</p>
          <div className="dina-product__stack">
            {stack.map((row) => (
              <div key={row.name} className="dina-product__stack-row">
                <span className="dina-product__stack-name">{row.name}</span>
                <span className="dina-product__stack-window">{row.window}</span>
                <span className={stackBadgeClass(row.status)}>{stackBadgeLabel(row.status)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dina-product__cta-section" aria-label="Get DINA">
          <p className="type-body dina-product__cta-copy">
            Free for patients. Clinician sees every dose.
          </p>
          <div className="dina-product__cta-actions">
            <Link href={primaryCta.href} className="btn-primary dina-product__btn-primary">
              {primaryCta.label}
            </Link>
            <Link href={MARKETING_ROUTES.technology} className="dina-product__btn-ghost">
              How it works →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
