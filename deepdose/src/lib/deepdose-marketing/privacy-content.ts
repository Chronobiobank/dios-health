import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Draft Privacy Policy — counsel review required before relying on in production. */
export const PRIVACY_PAGE = {
  title: 'Privacy Policy',
  updated: '10 July 2026',
  lede: `This policy explains how ${DEEPDOSE_NAME} collects, uses, and protects your information when you use our website and services. It is written for UK GDPR. If you are in another country, local rules may also apply.`,
  contactEmail: 'privacy@deepdose.org',
  sections: [
    {
      heading: 'Who we are',
      body: `${DEEPDOSE_NAME} provides chronotherapy decision support and chemistry-based social matching. The controller for personal data is the operator of deepdose.org. Contact: privacy@deepdose.org.`,
    },
    {
      heading: 'What we collect',
      body: 'Account data (email, display name, password credentials via our auth provider). Profile and onboarding data you enter (medications, sleep–wake rhythm, preferences). Optional wearable data you authorise (for example Oura or Whoop tokens and synced sleep/HRV summaries). Chat and Connect content you send. Technical logs (IP address, device/browser type, approximate location from IP, pages visited) for security and reliability. Support and safety reports you submit.',
    },
    {
      heading: 'Special category (health) data',
      body: `Medication lists, sleep timing, wearable biometrics, and related chronotherapy outputs are health-related data. We process them only where you provide them or connect a device, to deliver the service you request (timing guidance, matching, and related features). We do not sell this data. Do not use ${DEEPDOSE_NAME} for emergencies; it is decision support, not clinical care.`,
    },
    {
      heading: 'Why we use your data (purposes & legal bases)',
      body: 'Provide and secure the service (contract / legitimate interests). Create your account and authenticate you (contract). Personalise dosage timing and chemistry matching (contract / consent where required). Optional research or Chronobiobank-style contributions only if you opt in (consent). Safety, abuse prevention, and legal compliance (legitimate interests / legal obligation). Product analytics in aggregate or with privacy-preserving methods where possible (legitimate interests; consent for non-essential cookies if used).',
    },
    {
      heading: 'Wearables and third parties',
      body: 'If you connect a wearable, we receive data under your OAuth consent with that provider. Their privacy policy also applies. We use infrastructure providers (for example hosting, database, and authentication such as Supabase) as processors under contract. We do not allow processors to use your data for their own marketing.',
    },
    {
      heading: 'Chat, Connect, and visibility',
      body: 'Messages and match interactions are visible to the people in that conversation and to ${DEEPDOSE_NAME} for safety, abuse review, and service operation. Do not share someone else’s private health or identity information without permission.',
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
