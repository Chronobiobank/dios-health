import { CARD } from '@/components/sections/layout'
import type { DemoPatientTwin } from '@/lib/clinic/demo-patient-twin'

type PatientStreamsStatusProps = {
  streams: DemoPatientTwin['streams']
}

export function PatientStreamsStatus({ streams }: PatientStreamsStatusProps) {
  const rows = [
    { name: 'TipTraQ', status: streams.tiptraq ? 'Connected' : 'Not connected' },
    { name: 'City Labs', status: streams.cityLabs },
    { name: 'Siloton OCT', status: streams.siloton ? 'Connected' : 'Not connected' },
    { name: 'Smartphone', status: streams.smartphone ? 'Active' : 'Not active' },
  ]

  return (
    <section className="mt-10">
      <h2 className="type-caption font-mono uppercase tracking-widest text-black/45">Data streams</h2>
      <ul className={`${CARD} mt-4 divide-y divide-black/10 rounded-2xl`}>
        {rows.map((stream) => (
          <li key={stream.name} className="flex items-center justify-between gap-4 px-5 py-4">
            <p className="type-body text-sm font-medium text-black">{stream.name}</p>
            <p className="type-caption text-black/50">{stream.status}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
