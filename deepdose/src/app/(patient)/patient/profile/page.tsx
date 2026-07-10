import { redirect } from 'next/navigation'

/** Consumer account settings live at /account (gear on Profile). */
export default function PatientProfileRedirectPage() {
  redirect('/account')
}
