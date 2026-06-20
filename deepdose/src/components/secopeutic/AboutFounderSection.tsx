import Image from 'next/image'
import Link from 'next/link'

import { GRANT_MUNRO_PROFILE } from '@/lib/secopeutic/grant-munro-founder'

export function AboutFounderSection() {
  const founder = GRANT_MUNRO_PROFILE

  return (
    <section className="about-founder seco-app-card mt-10 p-5 md:p-6">
      <div className="about-founder__layout">
        <div className="about-founder__portrait">
          <Image
            src={founder.image}
            alt={founder.imageAlt}
            width={128}
            height={128}
            className="about-founder__photo"
            priority={false}
          />
        </div>

        <div className="about-founder__copy">
          <p className="seco-page__eyebrow mb-2">Founder</p>
          <h2 className="about-founder__name">{founder.name}</h2>
          <p className="about-founder__affiliation">
            <Link
              href={founder.nihiUrl}
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {founder.affiliation}
            </Link>
          </p>
          <p className="about-founder__headline">{founder.headline}</p>
          <div className="about-founder__body">
            {founder.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
