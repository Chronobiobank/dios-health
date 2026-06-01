import type { GpReportData } from '@/lib/dashboard/gp-report-data'

type GpReportViewProps = {
  report: GpReportData
}

export function GpReportView({ report }: GpReportViewProps) {
  return (
    <article className="gp-report mx-auto max-w-[48rem] bg-white px-6 py-10 text-[#0d0d0d] sm:px-10 sm:py-12">
      <header className="border-b border-black/10 pb-6">
        <p className="text-lg font-medium text-black">DIOS Health</p>
        <h1 className="mt-4 text-2xl font-medium text-black">Body clock summary for GP review</h1>
        <p className="mt-2 text-sm text-black/60">
          Generated {report.generatedAt} · dios.health
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Patient</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-black/50">Name</dt>
            <dd className="font-medium text-black">{report.patientName}</dd>
          </div>
          {report.age ? (
            <div>
              <dt className="text-black/50">Age</dt>
              <dd className="font-medium text-black">{report.age}</dd>
            </div>
          ) : null}
          {report.biologicalSex ? (
            <div>
              <dt className="text-black/50">Biological sex</dt>
              <dd className="font-medium text-black">{report.biologicalSex}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {report.hasTipTraqData ? (
        <>
          <section className="mt-8 rounded-2xl border border-black/10 bg-[#fafaf7] p-5">
            <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
              Key finding
            </h2>
            <p className="mt-3 text-lg font-medium text-black">
              Estimated melatonin onset (proxy DLMO): <strong>{report.dlmoTime}</strong>
            </p>
            <p className="mt-2 text-sm text-black/60">
              Chronotype: {report.chronotype ?? 'Not determined'}
            </p>
            <p className="mt-2 font-mono text-xs text-black/50">
              Confidence: {report.confidenceScore ?? '—'}% ({report.confidenceLabel ?? 'Low'}) · ±{' '}
              {report.confidenceBandMinutes ?? '—'} min · Based on {report.nightsCount} TipTraQ night
              {report.nightsCount === 1 ? '' : 's'}
            </p>
          </section>

          {report.doseWindows.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
                Suggested timing windows
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Derived from the patient&apos;s body clock estimate. For discussion only — not
                prescribing advice.
              </p>
              <table className="mt-4 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left">
                    <th className="py-2 pr-4 font-medium text-black/50">Medication / intervention</th>
                    <th className="py-2 font-medium text-black/50">Suggested time</th>
                  </tr>
                </thead>
                <tbody>
                  {report.doseWindows.map((window) => (
                    <tr key={window.label} className="border-b border-black/5">
                      <td className="py-2.5 pr-4 text-black">{window.label}</td>
                      <td className="py-2.5 font-mono text-black">{window.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {report.nights.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
                TipTraQ recordings analysed
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {report.nights.map((night) => (
                  <li key={night.report_date} className="flex justify-between gap-4 border-b border-black/5 py-2">
                    <span className="text-black">{night.report_date}</span>
                    <span className="font-mono text-black/60">DLMO {night.proxy_dlmo_time}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-medium">No TipTraQ data yet</p>
          <p className="mt-2">
            Upload at least one TipTraQ recording (.edf) on the Data streams page before printing
            this report for your GP.
          </p>
        </section>
      )}

      <section className="mt-10 border-t border-black/10 pt-6 text-xs leading-relaxed text-black/55">
        <p className="font-medium text-black/70">Important</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>
            This summary is generated by DIOS Health from wearable sleep data and a proxy DLMO
            algorithm. It is not a medical diagnosis.
          </li>
          <li>
            Intended to support a conversation with your GP about circadian timing and medication
            scheduling — not to replace clinical judgement.
          </li>
          <li>
            TipTraQ is an FDA-cleared home sleep apnoea test; DIOS interprets timing signals for
            chronotherapy research purposes.
          </li>
          {report.dataShareGpEnabled ? (
            <li>Electronic GP sharing is enabled in this patient&apos;s DIOS data controls.</li>
          ) : (
            <li>
              Electronic GP sharing is not enabled. The patient may share this printed summary
              directly with their GP.
            </li>
          )}
        </ul>
      </section>
    </article>
  )
}
