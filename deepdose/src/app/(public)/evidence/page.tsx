import { redirect } from 'next/navigation'

/** Legacy route — research lives on /science#evidence */
export default function EvidenceRedirectPage() {
  redirect('/science')
}
