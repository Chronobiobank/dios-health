import { redirect } from 'next/navigation'

/** Legacy Real post → Log Dose. */
export default function RealPostRedirectPage() {
  redirect('/dose')
}
