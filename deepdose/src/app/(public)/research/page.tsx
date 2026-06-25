import { redirect } from 'next/navigation'

/** Legacy route — published research lives on /science#evidence */
export default function ResearchRedirectPage() {
  redirect('/science')
}
