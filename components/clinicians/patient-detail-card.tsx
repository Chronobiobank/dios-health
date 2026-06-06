import { PthSparkline } from '@/components/clinicians/pth-sparkline'
import { TriageBadges } from '@/components/clinicians/triage-badges'
import type {
  BtiConfidence,
  SpectrumCluster,
  TriagePatient,
  TriageSafetyGate,
} from '@/lib/clinicians/triage-types'

const CONFIDENCE_CLASS: Record<BtiConfidence, string> = {
  ESTIMATED: 'clinicians-triage__confidence--estimated',
  PRECISION: 'clinicians-triage__confidence--precision',
  CONFIRMED: 'clinicians-triage__confidence--confirmed',
}

const GATE_CLASS: Record<TriageSafetyGate['status'], string> = {
  CLEAR: 'clinicians-triage__gate--clear',
  WARNING: 'clinicians-triage__gate--warning',
  HOLD: 'clinicians-triage__gate--hold',
}

const CLUSTER_CLASS: Record<SpectrumCluster, string> = {
  architect: 'clinicians-triage__cluster-dot--architect',
  sensitiser: 'clinicians-triage__cluster-dot--sensitiser',
  modulator: 'clinicians-triage__cluster-dot--modulator',
  opportunist: 'clinicians-triage__cluster-dot--opportunist',
  restorer: 'clinicians-triage__cluster-dot--restorer',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

type PatientDetailCardProps = {
  patient: TriagePatient
}

export function PatientDetailCard({ patient }: PatientDetailCardProps) {
  const pthStatus =
    patient.labs.pthPgMl <= 30
      ? 'lower third — ON_TRACK'
      : patient.labs.pthPgMl > 65
        ? 'above lower third — URGENT'
        : 'middle third — REVIEW'

  return (
    <article className="clinicians-triage__card">
      <header className="clinicians-triage__patient-header">
        <h2 className="clinicians-triage__patient-name">{patient.name}</h2>
        <div className="clinicians-triage__patient-meta">
          <span>{patient.ref}</span>
          <span>{patient.protocol.toUpperCase()}</span>
          <span>Enrolled {formatDate(patient.enrolledAt)}</span>
          {patient.consentChronobiobank ? <span>Chronobiobank consent</span> : null}
        </div>
        <div className="clinicians-triage__patient-badges">
          <TriageBadges
            variant="legacy"
            isPremiumTier={patient.is_premium_tier}
            deviceAlertTriggered={patient.device_alert_triggered}
            wearableSource={patient.is_premium_tier ? 'tiptraq' : 'oura'}
          />
        </div>
      </header>

      <section>
        <h3 className="clinicians-triage__section-title">BTI</h3>
        <div className="clinicians-triage__bti-strip">
          <div className="clinicians-triage__metric">
            <p className="clinicians-triage__metric-label">Biological</p>
            <p className="clinicians-triage__metric-value">{patient.bti.biologicalTime}</p>
          </div>
          <div className="clinicians-triage__metric">
            <p className="clinicians-triage__metric-label">Clock</p>
            <p className="clinicians-triage__metric-value">{patient.bti.clockTime}</p>
          </div>
          <div className="clinicians-triage__metric">
            <p className="clinicians-triage__metric-label">Delay</p>
            <p className="clinicians-triage__metric-value">{patient.bti.delayMinutes} min</p>
          </div>
          <div className="clinicians-triage__metric">
            <p className="clinicians-triage__metric-label">MLux</p>
            <p className="clinicians-triage__metric-value">{patient.bti.mluxPercent}%</p>
            <p
              className={`clinicians-triage__confidence ${CONFIDENCE_CLASS[patient.bti.confidence]}`}
            >
              {patient.bti.confidence} ({patient.bti.layer.replace('_', ' ')})
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="clinicians-triage__section-title">PTH trajectory</h3>
        <div className="clinicians-triage__pth-row">
          <PthSparkline history={patient.pthHistory} className="clinicians-triage__sparkline" />
          <div>
            <p className="clinicians-triage__pth-value">{patient.labs.pthPgMl} pg/mL</p>
            <p className="clinicians-triage__pth-status">{pthStatus}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="clinicians-triage__section-title">Latest labs (TipTraQ night)</h3>
        <div className="clinicians-triage__labs-grid">
          <div className="clinicians-triage__lab-chip">
            <strong>{patient.labs.vitaminDNmol} nmol/L</strong>
            25(OH)D
          </div>
          <div className="clinicians-triage__lab-chip">
            <strong>{patient.labs.sleepEfficiencyPct}%</strong>
            Sleep efficiency
          </div>
          <div className="clinicians-triage__lab-chip">
            <strong>{patient.labs.remLatencyMin} min</strong>
            REM latency
          </div>
          <div className="clinicians-triage__lab-chip">
            <strong>{patient.labs.ahi}</strong>
            AHI
          </div>
          <div className="clinicians-triage__lab-chip">
            <strong>{patient.labs.snsDominancePct}%</strong>
            SNS dominance
          </div>
          <div className="clinicians-triage__lab-chip">
            <strong>{patient.labs.wasoMin} min</strong>
            WASO
          </div>
        </div>
      </section>

      <section>
        <h3 className="clinicians-triage__section-title">Safety gates</h3>
        <div className="clinicians-triage__gates">
          {patient.safetyGates.map((gate) => (
            <span
              key={gate.type}
              className={`clinicians-triage__gate ${GATE_CLASS[gate.status]}`}
            >
              {gate.type.replace('_', ' ')} · {gate.status}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="clinicians-triage__section-title">Active protocol</h3>
        <ul className="clinicians-triage__protocol-list">
          {patient.protocolDrugs.map((drug) => (
            <li key={drug.name} className="clinicians-triage__protocol-item">
              <span
                className={`clinicians-triage__cluster-dot ${
                  drug.cluster ? CLUSTER_CLASS[drug.cluster] : 'clinicians-triage__cluster-dot--none'
                }`}
                aria-hidden
              />
              <span>
                <strong>{drug.name}</strong> — {drug.dose}
                {drug.note ? ` (${drug.note})` : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="clinicians-triage__section-title">Next action</h3>
        <p className="clinicians-triage__next-action">{patient.nextAction}</p>
      </section>

      <section>
        <h3 className="clinicians-triage__section-title">DiDi session log</h3>
        <ul className="clinicians-triage__mel-list">
          {patient.melSessions.map((session) => (
            <li key={`${session.type}-${session.at}`} className="clinicians-triage__mel-item">
              <p className="clinicians-triage__mel-type">
                {session.type.replace('_', ' ')} · {formatSessionDate(session.at)} ·{' '}
                {session.durationSec}s
              </p>
              <p>{session.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
