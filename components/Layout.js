import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">ShadeKits</Link>
          <nav className="hidden md:flex gap-6 text-sm text-neutral-700">
            <Link href="/shop" className="hover:text-black">Shop</Link>
            <Link href="/resources" className="hover:text-black">Install Resources</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
          </nav>
          <Link href="/contact" className="rounded-2xl px-4 py-2 border border-neutral-300 shadow-sm hover:shadow text-sm">Get a Quote</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ShadeKits — Fabricated in the USA</div>
          <div className="flex gap-4">
            <a className="hover:text-black" href="#">Terms</a>
            <a className="hover:text-black" href="#">Privacy</a>
            <a className="hover:text-black" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
