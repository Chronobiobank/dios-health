import { Eyebrow } from '@/components/ui/Layout'

const STEPS = ['Consent', 'Meds', 'Rhythm'] as const

export function OnboardingProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Onboarding progress" className="dios-step-rail">
      <ol className="flex w-full items-center gap-2">
        {STEPS.map((label, i) => {
          const step = i + 1
          const done = step < current
          const active = step === current
          return (
            <li key={label} className="dios-step-rail__item">
              <span
                className={`dios-step-rail__dot ${
                  active
                    ? 'dios-step-rail__dot--active'
                    : done
                      ? 'dios-step-rail__dot--done'
                      : 'dios-step-rail__dot--pending'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? '✓' : step}
              </span>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  active ? 'text-ink' : done ? 'text-ink-muted' : 'text-ink-faint'
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`dios-step-rail__line ${done ? 'bg-aubergine-mid/30' : ''}`}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

interface OnboardingHeaderProps {
  step: 1 | 2 | 3
  eyebrow?: string
  title: string
  description?: string
}

export function OnboardingHeader({ step, eyebrow, title, description }: OnboardingHeaderProps) {
  return (
    <>
      <OnboardingProgress current={step} />
      <header className="mb-5 space-y-2 md:mb-8 md:space-y-3">
        <Eyebrow>{eyebrow ?? `Step ${step} of 3`}</Eyebrow>
        <h1 className="dios-heading">{title}</h1>
        {description && (
          <p className="max-w-prose text-ink-muted md:text-base">{description}</p>
        )}
      </header>
    </>
  )
}
