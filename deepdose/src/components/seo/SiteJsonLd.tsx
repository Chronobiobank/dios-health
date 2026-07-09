import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.unmed.net'

export function SiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: DEEPDOSE_NAME,
        url: BASE,
        slogan: DEEPDOSE_TAGLINE,
        description: 'Medicine for non-conformers. Max your medication with timing that fits your life.',
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: DEEPDOSE_NAME,
        description: DEEPDOSE_TAGLINE,
        publisher: { '@id': `${BASE}/#organization` },
        inLanguage: 'en-GB',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
