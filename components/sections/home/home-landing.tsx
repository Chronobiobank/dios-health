import Link from 'next/link'

import { HomeHeroVideo } from '@/components/sections/home/home-hero-video'
import { HomeLandingReveal } from '@/components/sections/home/home-landing-reveal'
import {
  HOME_BLIND,
  HOME_CHRONOBIOBANK,
  HOME_CLINICAL_DISCLAIMER,
  HOME_CLINICIAN_TYPES,
  HOME_DASHBOARD,
  HOME_DINA,
  HOME_HERO,
  HOME_SLEEP,
  HOME_SOLTRIOL,
  HOME_START,
  HOME_UNTIL_NOW,
  HOME_VISIBILITY,
} from '@/lib/pitch/home-landing-content'

function ProseSection({
  id,
  eyebrow,
  headline,
  emphasisLine,
  paragraphs,
  variant = 'paper',
  dark = false,
}: {
  id: string
  eyebrow: string
  headline: string | readonly [string, string]
  emphasisLine?: number
  paragraphs: readonly string[]
  variant?: 'paper' | 'muted'
  dark?: boolean
}) {
  const isSplit = Array.isArray(headline)
  const sectionClass = dark
    ? 'home-landing__idea home-landing__idea--from-top dios-surface-dark home-landing__idea--edu'
    : `home-landing__idea home-landing__idea--${variant} home-landing__idea--edu`

  return (
    <section className={sectionClass} data-nav-surface={dark ? 'dark' : undefined} id={id}>
      <div className="home-landing__inner home-landing__inner--prose">
        <p className={dark ? 'dios-on-dark-eyebrow' : 'home-landing__kicker'}>{eyebrow}</p>
        <h2 className={dark ? 'home-landing__title dios-on-dark-title' : 'home-landing__title'}>
          {isSplit ? (
            <>
              {headline.map((line, i) => (
                <span key={line}>
                  {i === emphasisLine ? <em>{line}</em> : line}
                  {i < headline.length - 1 ? <br /> : null}
                </span>
              ))}
            </>
          ) : (
            headline
          )}
        </h2>
        <div className="home-landing__prose">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeLanding() {
  return (
    <div className="marketing-layout home-landing dios-nav-tone-paper">
      <HomeLandingReveal />

      <section
        className="home-landing__hero home-landing__hero--edu dios-page-top-bleed dios-surface-dark"
        data-nav-surface="dark"
        id="hero"
      >
        <HomeHeroVideo />
        <div className="home-landing__hero-scrim" aria-hidden />
        <div className="home-landing__inner home-landing__inner--prose home-landing__hero-content">
          <p className="home-landing__kicker home-landing__kicker--on-dark">{HOME_HERO.eyebrow}</p>
          <h1 className="home-landing__hero-edu-title">
            {HOME_HERO.lines[0]}
            <br />
            <em>{HOME_HERO.lines[1]}</em>
          </h1>
          <p className="home-landing__hero-edu-lede">{HOME_HERO.emphasisLine}</p>
          <p className="home-landing__pull-quote home-landing__pull-quote--on-dark">
            {HOME_HERO.pullQuote}
          </p>
          <div className="home-landing__hero-actions home-landing__hero-actions--wide">
            <Link
              className="home-landing__btn-on-dark home-landing__btn-on-dark--solid"
              href={HOME_HERO.primaryCta.href}
            >
              {HOME_HERO.primaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <ProseSection
        id="soltriol"
        eyebrow={HOME_SOLTRIOL.eyebrow}
        headline={HOME_SOLTRIOL.headline}
        paragraphs={HOME_SOLTRIOL.paragraphs}
      />

      <ProseSection
        id="blind"
        eyebrow={HOME_BLIND.eyebrow}
        headline={HOME_BLIND.headline}
        emphasisLine={HOME_BLIND.emphasisLine}
        paragraphs={HOME_BLIND.paragraphs}
        variant="muted"
      />

      <ProseSection
        id="sleep"
        eyebrow={HOME_SLEEP.eyebrow}
        headline={HOME_SLEEP.headline}
        paragraphs={HOME_SLEEP.paragraphs}
      />

      <section
        className="home-landing__idea home-landing__idea--from-top dios-surface-dark home-landing__idea--edu"
        data-nav-surface="dark"
        id="until-now"
      >
        <div className="home-landing__inner home-landing__inner--prose">
          <p className="dios-on-dark-eyebrow">{HOME_UNTIL_NOW.eyebrow}</p>
          <h2 className="home-landing__title dios-on-dark-title">
            {HOME_UNTIL_NOW.headline}{' '}
            <em>{HOME_UNTIL_NOW.headlineEmphasis}</em>
          </h2>
          <div className="home-landing__prose home-landing__prose--on-dark">
            {HOME_UNTIL_NOW.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="home-landing__metric-band" id="dashboard" aria-label="Clinical dashboard readouts">
        <div className="home-landing__inner home-landing__inner--prose">
          <p className="home-landing__kicker">{HOME_DASHBOARD.eyebrow}</p>
          <h2 className="home-landing__metric-question">{HOME_DASHBOARD.headline}</h2>
          <p className="home-landing__metric-intro">{HOME_DASHBOARD.intro}</p>
          <div className="home-landing__metric-grid">
            {HOME_DASHBOARD.columns.map((col) => (
              <div key={col.id} className="home-landing__metric-cell">
                <p className="home-landing__metric-label">{col.label}</p>
                <p className="home-landing__metric-target">{col.target}</p>
              </div>
            ))}
          </div>
          <p className="home-landing__metric-cta">
            <Link className="home-landing__metric-link" href={HOME_DASHBOARD.cta.href}>
              {HOME_DASHBOARD.cta.label} ↗
            </Link>
          </p>
        </div>
      </section>

      <ProseSection
        id="dina"
        eyebrow={HOME_DINA.eyebrow}
        headline={HOME_DINA.headline}
        paragraphs={HOME_DINA.paragraphs}
        variant="paper"
      />

      <ProseSection
        id="visibility"
        eyebrow={HOME_VISIBILITY.eyebrow}
        headline={HOME_VISIBILITY.headline}
        paragraphs={HOME_VISIBILITY.paragraphs}
        variant="muted"
      />

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--edu" id="clinicians">
        <div className="home-landing__inner home-landing__inner--prose">
          <p className="home-landing__kicker">{HOME_CLINICIAN_TYPES.eyebrow}</p>
          <h2 className="home-landing__title">{HOME_CLINICIAN_TYPES.headline}</h2>
          <ul className="home-landing__audience-list">
            {HOME_CLINICIAN_TYPES.types.map((type) => (
              <li key={type.id} className="home-landing__audience-item">
                <h3 className="home-landing__audience-title">{type.title}</h3>
                <p className="home-landing__audience-body">{type.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--muted home-landing__idea--edu" id="chronobiobank">
        <div className="home-landing__inner home-landing__inner--prose">
          <p className="home-landing__kicker">{HOME_CHRONOBIOBANK.eyebrow}</p>
          <h2 className="home-landing__title">{HOME_CHRONOBIOBANK.headline}</h2>
          <div className="home-landing__prose">
            {HOME_CHRONOBIOBANK.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="home-landing__proof-more">
            <Link href={HOME_CHRONOBIOBANK.cta.href}>{HOME_CHRONOBIOBANK.cta.label} ↗</Link>
          </p>
        </div>
      </section>

      <section className="home-landing__idea home-landing__idea--paper home-landing__idea--edu home-landing__idea--start" id="start">
        <div className="home-landing__inner home-landing__inner--prose">
          <p className="home-landing__kicker">{HOME_START.eyebrow}</p>
          <h2 className="home-landing__title">{HOME_START.headline}</h2>
          <p className="home-landing__prose-lead">{HOME_START.body}</p>
          <div className="home-landing__cta-stack">
            {HOME_START.ctas.map((cta) => (
              <div key={cta.id} className="home-landing__cta-stack-item">
                <Link
                  className={
                    cta.variant === 'primary'
                      ? 'home-landing__btn-solid home-landing__btn-solid--block'
                      : cta.variant === 'secondary'
                        ? 'home-landing__btn-ghost home-landing__btn-ghost--block'
                        : 'home-landing__btn-tertiary'
                  }
                  href={cta.href}
                >
                  {cta.label}
                </Link>
                {'detail' in cta && cta.detail ? (
                  <p className="home-landing__cta-detail">{cta.detail}</p>
                ) : null}
              </div>
            ))}
          </div>
          <p className="home-landing__steps-disclaimer">{HOME_CLINICAL_DISCLAIMER}</p>
        </div>
      </section>
    </div>
  )
}
