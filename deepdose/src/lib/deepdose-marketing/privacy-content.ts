import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Draft Privacy Policy — counsel review required before relying on in production. */
export const PRIVACY_PAGE = {
  title: 'Privacy Policy',
  updated: '10 July 2026',
  lede: 'How Deepdose collects, uses, and protects your data.',
  contactEmail: 'privacy@deepdose.org',
  sections: [
    {
      heading: 'Who we are',
      body: `${DEEPDOSE_NAME} is a chemistry soul-matching network. We help you understand your rhythm and chemistry, share what you choose, and connect with people on a similar clock. The controller for personal data is the operator of deepdose.org. Contact: privacy@deepdose.org.`,
    },
    {
      heading: 'What we collect',
      body: 'Account data (email, display name, password credentials via our auth provider). Profile details you enter (rhythm, preferences, optional medications). Optional wearable data you authorise. Chat and Connect content you send. Technical logs for security and reliability. Support and safety reports you submit.',
    },
    {
      heading: 'Special category (health) data',
      body: `Rhythm, sleep, optional medication lists, and wearable biometrics are health-related. We process them only when you provide them or connect a device, to run matching, profile, and related features you request. We do not sell this data. ${DEEPDOSE_NAME} is not emergency care or a clinic.`,
    },
    {
      heading: 'Why we use your data (purposes & legal bases)',
      body: 'Provide and secure the service (contract / legitimate interests). Create your account and authenticate you (contract). Personalise chemistry matching and connection features (contract / consent where required). Optional research contributions only if you opt in (consent). Safety, abuse prevention, and legal compliance (legitimate interests / legal obligation). Product analytics in aggregate or with privacy-preserving methods where possible (legitimate interests; consent for non-essential cookies if used).',
    },
    {
      heading: 'Wearables and third parties',
      body: 'If you connect a wearable, we receive data under your OAuth consent with that provider. Their privacy policy also applies. We use infrastructure providers (for example hosting, database, and authentication such as Supabase) as processors under contract. We do not allow processors to use your data for their own marketing.',
    },
    {
      heading: 'Chat, Connect, and visibility',
      body: `Messages and match interactions are visible to people in that conversation and to ${DEEPDOSE_NAME} for safety, abuse review, and service operation. Do not share someone else’s private health or identity information without permission.`,
    },
    {
      heading: 'Cookies and similar tech',
      body: 'We use essential cookies/storage for sign-in and security. If we add analytics or marketing cookies, we will ask for consent where required and list them here. You can control cookies in your browser; blocking essential cookies may break sign-in.',
    },
    {
      heading: 'How long we keep data',
      body: 'We keep account and service data while your account is active and for a reasonable period afterward for security, disputes, and legal duties. You may request deletion; we will erase or anonymise unless we must retain something (for example fraud prevention or legal claims). Wearable tokens are removed when you disconnect or delete your account.',
    },
    {
      heading: 'Your rights (UK GDPR)',
      body: 'You can request access, correction, erasure, restriction, portability, and object to certain processing. Where we rely on consent, you can withdraw it. You can complain to the UK Information Commissioner’s Office (ICO). To exercise rights, email privacy@deepdose.org. We may need to verify your identity.',
    },
    {
      heading: 'International transfers',
      body: 'Our processors may store data outside the UK/EEA. Where that happens, we use appropriate safeguards (such as standard contractual clauses) required by UK GDPR.',
    },
    {
      heading: 'Children',
      body: `${DEEPDOSE_NAME} is for adults 18+. We do not knowingly collect data from anyone under 18. If we learn an account belongs to a minor, we will delete it.`,
    },
    {
      heading: 'Security',
      body: 'We use industry-standard measures (encryption in transit, access controls, row-level security on user data where applicable). No method is perfect; protect your password and device.',
    },
    {
      heading: 'Changes',
      body: 'We may update this policy. Material changes will be posted on this page with a new “Last updated” date. Continued use after changes means you accept the updated policy where permitted by law.',
    },
  ],
} as const
