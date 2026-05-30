import { CARD } from '@/components/sections/layout'
import type { DemoPatientTwin } from '@/lib/clinic/demo-patient-twin'

type PatientTwinHeaderProps = {
  patient: DemoPatientTwin
}

export function PatientTwinHeader({ patient }: PatientTwinHeaderProps) {
  return (
    <section className={`${CARD} rounded-2xl p-5 sm:p-6`}>
      <h1 className="type-section text-xl">
        {patient.name} · {patient.age}
      </h1>
      <p className="type-body mt-2 text-sm text-black/70">
        Fitzpatrick type {patient.fitzpatrickType}
      </p>

      <div className="mt-5">
        <p className="type-caption font-mono uppercase tracking-wider text-black/45">Current medications</p>
        <ul className="type-body mt-2 space-y-1 text-sm text-black/80">
          {patient.medications.map((medication) => (
            <li key={medication}>{medication}</li>
          ))}
        </ul>
      </div>

      <p className="type-mono mt-5 text-xs text-black/50">Last data sync · {patient.lastDataSync}</p>
    </section>
  )
}
