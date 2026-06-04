/** Demo dashboard — keeps global site nav; dash styles loaded globally via globals.css */
export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="how-it-works-route min-h-screen">
      <div className="how-it-works-route__inner mx-auto w-full pb-8">
        {children}
      </div>
    </div>
  )
}
