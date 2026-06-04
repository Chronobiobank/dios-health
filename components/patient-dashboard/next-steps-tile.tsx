'use client'

import { ListChecks } from 'lucide-react'
import Link from 'next/link'

import type { PatientNextStep, PatientNextSteps } from '@/lib/patient-dashboard/types'

type NextStepsTileProps = {
  nextSteps: PatientNextSteps
  onSendPrompt: (prompt: string) => void
}

function NextStepAction({
  step,
  onSendPrompt,
}: {
  step: PatientNextStep
  onSendPrompt: (prompt: string) => void
}) {
  if (step.href) {
    return (
      <Link href={step.href} className="next-steps-tile__action">
        Go
        <span aria-hidden> ↗</span>
      </Link>
    )
  }

  if (step.prompt) {
    return (
      <button type="button" className="next-steps-tile__action" onClick={() => onSendPrompt(step.prompt!)}>
        Ask coach
        <span aria-hidden> ↗</span>
      </button>
    )
  }

  return null
}

export function NextStepsTile({ nextSteps, onSendPrompt }: NextStepsTileProps) {
  if (nextSteps.steps.length === 0) return null

  return (
    <div className="glass-tile next-steps-tile w-full">
      <div className="next-steps-tile__header">
        <div className="next-steps-tile__icon" aria-hidden>
          <ListChecks strokeWidth={1.75} />
        </div>
        <h3 className="next-steps-tile__title">Your next steps</h3>
      </div>

      <p className="next-steps-tile__summary">{nextSteps.summary}</p>

      <ol className="next-steps-tile__list">
        {nextSteps.steps.map((step, index) => (
          <li key={step.id} className="next-steps-tile__item">
            <div className="next-steps-tile__item-head">
              <span className="next-steps-tile__index" aria-hidden>
                {index + 1}
              </span>
              <p className="next-steps-tile__item-title">{step.title}</p>
              <NextStepAction step={step} onSendPrompt={onSendPrompt} />
            </div>
            <p className="next-steps-tile__item-detail">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
