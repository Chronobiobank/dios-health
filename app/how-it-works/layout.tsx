import '@/app/dashboard/retinomic-dashboard.css'

/** Demo dashboard — keeps global site nav; Retinomic panel styles + globals theme tokens. */
export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="how-it-works-route min-h-screen">
      <div className="how-it-works-route__inner mx-auto w-full pb-8">
        {children}
      </div>
    </div>
  )
}
