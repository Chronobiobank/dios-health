/** Demo dashboard — keeps global site nav; dash styles loaded globally via globals.css */
export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="how-it-works-route min-h-screen">
      <div className="how-it-works-route__inner mx-auto w-full pb-8 pt-[calc(var(--dios-site-nav-height)+1rem)] sm:pt-[calc(var(--dios-site-nav-height)+1.25rem)]">
        {children}
      </div>
    </div>
  )
}
