import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Clinical evidence — Dose Intelligence · DIOS',
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
    <li className={`type-medical-dense flex items-start gap-2 text-xs text-[#0D0D0D]/70`}>
      <span className={`font-bold ${accentClass}`} aria-hidden>
        •
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function EvidencePage() {
  return (
    <div className="font-sans text-[#0D0D0D]">
      <section className="mx-auto max-w-4xl border-b border-black/8 px-6 pb-16 pt-8 text-center">
        <div className="dios-glass-chip mb-6 text-[#0D0D0D]/80">
          <span aria-hidden>🔬</span>
          Clinical Validation Framework
        </div>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-[#0D0D0D] md:text-5xl">
          The Science Behind Dose Intelligence
        </h1>
        <p className="type-medical-dense mx-auto max-w-2xl text-lg leading-relaxed text-[#0D0D0D]/65">
          We bridge{' '}
          <strong className="font-semibold text-[#0D0D0D]/90">
            ocular architecture, neurochemistry, and medical-grade telemetry
          </strong>{' '}
          to personalise dose timing — not population schedules.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-3">
        <article className="dios-glass-pillar evidence-retinomic-pillar--photic">
          <div>
            <div className="mb-4 text-2xl" aria-hidden>
              👁️
            </div>
            <h2 className="mb-4 text-xl font-bold text-photic-muted">Pillar 1: Oculomics & Light</h2>
            <p className="type-medical-dense mb-6 text-sm leading-relaxed text-[#0D0D0D]/65">
              Human circadian rhythms are anchored by intrinsically photosensitive Retinal Ganglion
              Cells (ipRGCs). These cells contain melanopsin, which possesses a narrow biophotic
              sensitivity peaking precisely between{' '}
              <strong className="text-[#0D0D0D]/90">480–490 nm (blue-cyan spectrum)</strong>.
            </p>
            <ul className="dios-glass-pillar__divider space-y-3 pt-4">
              <PillarBullet accentClass="text-photic-muted">
                <strong>Hardware Limits:</strong> Retinal structural thickness dictates light
                absorption bandwidth. Thinning of the Ganglion Cell-Inner Plexiform Layer (GCL-IPL)
                raises the physical Melanopic Lux (mLux) threshold required to sync the master
                clock.
              </PillarBullet>
              <PillarBullet accentClass="text-photic-muted">
                <strong>Siloton GiraffeOCT Ingestion:</strong> By integrating native data from{' '}
                <a
                  href="https://siloton.com/"
                  className="ml-1 text-photic-muted underline hover:text-photic-core"
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
          <p className="type-medical-caption dios-glass-pillar__divider mt-6 pt-4 text-[#0D0D0D]/50">
            Reference: Foster, R. G., et al. (2002). &quot;Melanopsin and Circadian
            Phototransduction.&quot; / Siloton Ltd. (2025). &quot;Ophthalmic PIC OCT.&quot;
          </p>
        </article>

        <article className="dios-glass-pillar evidence-retinomic-pillar--fuel">
          <div>
            <div className="mb-4 text-2xl" aria-hidden>
              🧪
            </div>
            <h2 className="mb-4 text-xl font-bold text-fuel-muted">Pillar 2: Neurochemistry & Fuel</h2>
            <p className="type-medical-dense mb-6 text-sm leading-relaxed text-[#0D0D0D]/65">
              Photic timing signals fail if the brainstem lacks the molecular building blocks to
              execute sleep state switching. Sustained, deep REM paralysis relies directly on
              acetylcholine synthesis.
            </p>
            <ul className="dios-glass-pillar__divider space-y-3 pt-4">
              <PillarBullet accentClass="text-fuel-muted">
                <strong>The Microbiome Factory:</strong> Acetylcholine production is tied to a
                functioning gut microbiome, which serves as the primary manufacturer of critical B
                vitamins.
              </PillarBullet>
              <PillarBullet accentClass="text-fuel-muted">
                <strong>The D3/B5 Loop:</strong> Based on clinical models from neurologists like Dr.
                Stasha Gominak and Dr. Cícero Coimbra, maintaining strict{' '}
                <strong className="text-[#0D0D0D]/90">Vitamin D3 target levels (60–80 ng/mL)</strong>{' '}
                and targeted <strong className="text-[#0D0D0D]/90">Vitamin B5 (pantothenic acid)</strong>{' '}
                titration serves as the master switch to reactivate this internal metabolic loop.
              </PillarBullet>
            </ul>
          </div>
          <p className="type-medical-caption dios-glass-pillar__divider mt-6 pt-4 text-[#0D0D0D]/50">
            Reference: Gominak, S. C. (2016). &quot;The world epidemic of sleep fragmentation: A
            deficiency of vitamin D3 and pantothenic acid.&quot;
          </p>
        </article>

        <article className="dios-glass-pillar evidence-retinomic-pillar--telemetry">
          <div>
            <div className="mb-4 text-2xl" aria-hidden>
              💤
            </div>
            <h2 className="mb-4 text-xl font-bold text-telemetry-muted">
              Pillar 3: Outcome Verification
            </h2>
            <p className="type-medical-dense mb-6 text-sm leading-relaxed text-[#0D0D0D]/65">
              We do not track superficial movements or rely on subjective sleep questionnaires. We
              mathematically verify changes in sleep architecture through medical-grade sensor
              telemetry.
            </p>
            <ul className="dios-glass-pillar__divider space-y-3 pt-4">
              <PillarBullet accentClass="text-telemetry-muted">
                <strong>PranaQ TipTraQ Integration:</strong> DIOS streams high-fidelity data directly
                from the{' '}
                <a
                  href="https://pranaq.com/tiptraq/"
                  className="ml-1 text-telemetry-muted underline hover:text-telemetry-core"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FDA 510(k) cleared TipTraQ fingertip sensor
                </a>
                .
              </PillarBullet>
              <PillarBullet accentClass="text-telemetry-muted">
                <strong>Medical-Grade Metrics:</strong> By analyzing tri-wavelength
                photoplethysmography (PPG) and 3-axis motion gyroscopes, the platform evaluates
                true{' '}
                <strong className="text-[#0D0D0D]/90">
                  REM Efficiency, Micro-Arousals, and Overnight SpO2 Min
                </strong>{' '}
                with clinical precision.
              </PillarBullet>
            </ul>
          </div>
          <p className="type-medical-caption dios-glass-pillar__divider mt-6 pt-4 text-[#0D0D0D]/50">
            Reference: FDA K243268 Clearance Data (2025). PranaQ Pte. Ltd. Home Sleep Apnea
            Evaluation Guidelines.
          </p>
        </article>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <div className="dios-glass-card">
          <h3 className="mb-2 text-lg font-bold tracking-tight text-[#0D0D0D]">
            Operationalizing the Loop
          </h3>
          <p className="type-medical-dense mx-auto max-w-xl text-sm leading-relaxed text-[#0D0D0D]/65">
            By feeding non-invasive baselines — iris, skin melanin, and geolocation zenith — into the
            platform, DIOS flags circadian phase displacement and recommends biochemical intervention
            only when a broken loop is detected.
          </p>
        </div>
      </section>

      <nav className="type-medical-dense border-t border-black/8 py-10 text-center text-sm text-[#0D0D0D]/55">
        <Link href="/" className="underline-offset-4 hover:text-[#0D0D0D] hover:underline">
          ← Back to homepage
        </Link>
        <span className="mx-2 text-[#0D0D0D]/25" aria-hidden>
          ·
        </span>
        <Link href="/onboarding" className="underline-offset-4 hover:text-[#0D0D0D] hover:underline">
          Scan Retinomic baseline (free)
        </Link>
        <span className="mx-2 text-[#0D0D0D]/25" aria-hidden>
          ·
        </span>
        <Link href="/contact" className="underline-offset-4 hover:text-[#0D0D0D] hover:underline">
          Contact the team
        </Link>
      </nav>
    </div>
  )
}
