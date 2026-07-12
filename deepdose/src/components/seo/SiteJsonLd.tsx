import {
  DEEPDOSE_HOME_HEADLINE,
  DEEPDOSE_NAME,
  DEEPDOSE_POSITIONING,
  DEEPDOSE_PROMISE,
} from '@/lib/brand/deepdose-brand'

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
        slogan: DEEPDOSE_HOME_HEADLINE,
        description: DEEPDOSE_PROMISE,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: DEEPDOSE_NAME,
        description: DEEPDOSE_POSITIONING,
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
