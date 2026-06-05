import '@/app/shop/shop.css'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <div className="shop-shell min-h-screen bg-white text-[#0D0D0D]">{children}</div>
}
