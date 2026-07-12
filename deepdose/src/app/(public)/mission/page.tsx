import { redirect } from 'next/navigation'

/** Mission story now lives on /how (Make chemistry work). */
export default function MissionPage() {
  redirect('/how')
}
