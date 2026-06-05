import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Clinical evidence — Retinomic Protocol · DIOS',
  description:
    'Oculomics, neurochemistry, and FDA-cleared TipTraQ telemetry — the clinical validation framework behind dios.health Dose Intelligence OS.',
}

function PillarBullet({
  accentClass,
  children,
}: {
  accentClass: string
  children: ReactNode
}) {
  return (
    <li className={`type-medical-dense flex items-start gap-2 text-xs text-slate-300`}>
      <span className={`font-bold ${accentClass}`} aria-hidden>
        •
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-photic-core selection:text-white">
      {/* Hero */}
      <section className="mx-auto max-w-4xl border-b border-slate-900 px-6 pb-16 pt-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-photic-muted/60 bg-photic-deep/50 px-3 py-1 text-xs font-semibold text-photic-core">
          <span aria-hidden>🔬</span>
          Clinical Validation Framework
        </div>
        <h1 className="mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          The Science Behind the Retinomic Protocol
        </h1>
        <p className="type-medical-dense mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
          dios.health eliminates subjective wellness guesswork. We bridge the gap between{' '}
          <strong className="font-semibold text-slate-200">
            ocular architecture, neurochemistry, and medical-grade telemetry
          </strong>{' '}
          to systematically repair human sleep.
        </p>
      </section>

      {/* 3-pillar grid */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-3">
        {/* Pillar 1: Oculomics */}
        <article className="evidence-retinomic-pillar--photic flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/40 p-8 transition-colors hover:border-photic-muted/50">
          <div>
            <div className="mb-4 text-2xl" aria-hidden>
              👁️
            </div>
            <h2 className="mb-4 text-xl font-bold text-photic-core">Pillar 1: Oculomics & Light</h2>
            <p className="type-medical-dense mb-6 text-sm leading-relaxed text-slate-400">
              Human circadian rhythms are anchored by intrinsically photosensitive Retinal Ganglion
              Cells (ipRGCs). These cells contain melanopsin, which possesses a narrow biophotic
              sensitivity peaking precisely between{' '}
              <strong className="text-slate-200">480–490 nm (blue-cyan spectrum)</strong>.
            </p>
            <ul className="space-y-3 border-t border-slate-900 pt-4">
              <PillarBullet accentClass="text-photic-core">
                <strong>Hardware Limits:</strong> Retinal structural thickness dictates light
                absorption bandwidth. Thinning of the Ganglion Cell-Inner Plexiform Layer (GCL-IPL)
                raises the physical Melanopic Lux (mLux) threshold required to sync the master
                clock.
              </PillarBullet>
              <PillarBullet accentClass="text-photic-core">
                <strong>Siloton GiraffeOCT Ingestion:</strong> By integrating native data from{' '}
                <a
                  href="https://siloton.com/"
                  className="ml-1 text-photic-core underline hover:text-sky-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Siloton&apos;s Quantum Photonic Integrated Circuit (PIC) eye scanners
                </a>
                , DIOS measures structural µm thickness to calculate your exact biological light
                dose.
              </PillarBullet>
            </ul>
          </div>
          <p className="type-medical-caption mt-6 border-t border-slate-900 pt-4 text-slate-500">
            Reference: Foster, R. G., et al. (2002). &quot;Melanopsin and Circadian
            Phototransduction.&quot; / Siloton Ltd. (2025). &quot;Ophthalmic PIC OCT.&quot;
          </p>
        </article>

        {/* Pillar 2: Biochemistry */}
        <article className="evidence-retinomic-pillar--fuel flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/40 p-8 transition-colors hover:border-fuel-muted/50">
          <div>
            <div className="mb-4 text-2xl" aria-hidden>
              🧪
            </div>
            <h2 className="mb-4 text-xl font-bold text-fuel-core">Pillar 2: Neurochemistry & Fuel</h2>
            <p className="type-medical-dense mb-6 text-sm leading-relaxed text-slate-400">
              Photic timing signals fail if the brainstem lacks the molecular building blocks to
              execute sleep state switching. Sustained, deep REM paralysis relies directly on
              acetylcholine synthesis.
            </p>
            <ul className="space-y-3 border-t border-slate-900 pt-4">
              <PillarBullet accentClass="text-fuel-core">
                <strong>The Microbiome Factory:</strong> Acetylcholine production is tied to a
                functioning gut microbiome, which serves as the primary manufacturer of critical B
                vitamins.
              </PillarBullet>
              <PillarBullet accentClass="text-fuel-core">
                <strong>The D3/B5 Loop:</strong> Based on clinical models from neurologists like Dr.
                Stasha Gominak and Dr. Cícero Coimbra, maintaining strict{' '}
                <strong className="text-slate-200">Vitamin D3 target levels (60–80 ng/mL)</strong>{' '}
                and targeted <strong className="text-slate-200">Vitamin B5 (pantothenic acid)</strong>{' '}
                titration serves as the master switch to reactivate this internal metabolic loop.
              </PillarBullet>
            </ul>
          </div>
          <p className="type-medical-caption mt-6 border-t border-slate-900 pt-4 text-slate-500">
            Reference: Gominak, S. C. (2016). &quot;The world epidemic of sleep fragmentation: A
            deficiency of vitamin D3 and pantothenic acid.&quot;
          </p>
        </article>

        {/* Pillar 3: Telemetry */}
        <article className="evidence-retinomic-pillar--telemetry flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/40 p-8 transition-colors hover:border-telemetry-muted/50">
          <div>
            <div className="mb-4 text-2xl" aria-hidden>
              💤
            </div>
            <h2 className="mb-4 text-xl font-bold text-telemetry-core">
              Pillar 3: Outcome Verification
            </h2>
            <p className="type-medical-dense mb-6 text-sm leading-relaxed text-slate-400">
              We do not track superficial movements or rely on subjective sleep questionnaires. We
              mathematically verify changes in sleep architecture through medical-grade sensor
              telemetry.
            </p>
            <ul className="space-y-3 border-t border-slate-900 pt-4">
              <PillarBullet accentClass="text-telemetry-core">
                <strong>PranaQ TipTraQ Integration:</strong> DIOS streams high-fidelity data directly
                from the{' '}
                <a
                  href="https://pranaq.com/tiptraq/"
                  className="ml-1 text-telemetry-core underline hover:text-indigo-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FDA 510(k) cleared TipTraQ fingertip sensor
                </a>
                .
              </PillarBullet>
              <PillarBullet accentClass="text-telemetry-core">
                <strong>Medical-Grade Metrics:</strong> By analyzing tri-wavelength
                photoplethysmography (PPG) and 3-axis motion gyroscopes, the platform evaluates
                true{' '}
                <strong className="text-slate-200">
                  REM Efficiency, Micro-Arousals, and Overnight SpO2 Min
                </strong>{' '}
                with clinical precision.
              </PillarBullet>
            </ul>
          </div>
          <p className="type-medical-caption mt-6 border-t border-slate-900 pt-4 text-slate-500">
            Reference: FDA K243268 Clearance Data (2025). PranaQ Pte. Ltd. Home Sleep Apnea
            Evaluation Guidelines.
          </p>
        </article>
      </section>

      {/* Operational loop */}
      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <div className="rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-900 to-slate-950 p-8">
          <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-100">
            Operationalizing the Loop
          </h3>
          <p className="type-medical-dense mx-auto max-w-xl text-sm leading-relaxed text-slate-400">
            By feeding non-invasive, free physical baselines (Iris color, Skin Melanin, and
            Geolocation Zenith mapping) into the platform, DIOS flags circadian phase displacement.
            It recommends premium biochemical intervention and wearable tracking only when a broken
            loop is detected.
          </p>
        </div>
      </section>

      <nav className="type-medical-dense border-t border-slate-900 py-10 text-center text-sm text-slate-400">
        <Link href="/" className="underline-offset-4 hover:text-photic-core hover:underline">
          ← Back to homepage
        </Link>
        <span className="mx-2 text-slate-600" aria-hidden>
          ·
        </span>
        <Link href="/onboarding" className="underline-offset-4 hover:text-photic-core hover:underline">
          Scan Retinomic baseline (free)
        </Link>
        <span className="mx-2 text-slate-600" aria-hidden>
          ·
        </span>
        <Link href="/contact" className="underline-offset-4 hover:text-photic-core hover:underline">
          Contact the team
        </Link>
      </nav>
    </div>
  )
}
