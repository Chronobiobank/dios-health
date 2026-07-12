import { redirect } from 'next/navigation'

/** Legacy Score hub — now unified at /profile. */
export default function BankPage() {
  redirect('/profile')
}
