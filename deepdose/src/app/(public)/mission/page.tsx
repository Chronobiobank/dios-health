import { redirect } from 'next/navigation'

/** Mission story now lives on /how (Why Medmaxxing?). */
export default function MissionPage() {
  redirect('/how')
}
