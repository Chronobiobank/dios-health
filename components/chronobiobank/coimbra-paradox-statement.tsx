import {
  CHRONOBIOBANK_FOUNDING_MISSION,
  CHRONOBIOBANK_GOVERNANCE_SUMMARY,
  CHRONOBIOBANK_PHASE_NOTE,
  COIMBRA_PARADOX_STATEMENT,
} from '@/lib/chronobiobank/coimbra-paradox'

type CoimbraParadoxStatementProps = {
  compact?: boolean
  showPhaseNote?: boolean
}

export function CoimbraParadoxStatement({
  compact = false,
  showPhaseNote = true,
}: CoimbraParadoxStatementProps) {
  return (
    <article className="chronobiobank-mission">
      <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
        The Coimbra Paradox — solved
      </p>
      <blockquote className="mt-2 text-sm font-medium leading-relaxed text-black/85">
        {CHRONOBIOBANK_FOUNDING_MISSION}
      </blockquote>
      {!compact ? (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-black/65">
          {COIMBRA_PARADOX_STATEMENT}
        </p>
      ) : null}
      {!compact ? (
        <p className="mt-3 text-sm leading-relaxed text-black/55">{CHRONOBIOBANK_GOVERNANCE_SUMMARY}</p>
      ) : null}
      {showPhaseNote ? (
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-black/40">{CHRONOBIOBANK_PHASE_NOTE}</p>
      ) : null}
    </article>
  )
}
