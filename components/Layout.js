import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="container-7xl py-3 flex items-center justify-between">
          <Link href="/" className="text-[22px] font-extrabold tracking-tight">ShadeKits</Link>
          <nav className="hidden md:flex gap-6 text-sm text-neutral-700">
            <Link href="/shop" className="hover:text-red-600">Shop</Link>
            <Link href="/resources" className="hover:text-red-600">Install Resources</Link>
            <Link href="/contact" className="hover:text-red-600">Contact</Link>
          </nav>
          <Link href="/contact" className="btn-primary">Get a Quote</Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="container-7xl py-8 text-sm text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ShadeKits — Fabricated in the USA</div>
          <div className="flex gap-4">
            <a className="hover:text-red-600" href="#">Terms</a>
            <a className="hover:text-red-600" href="#">Privacy</a>
            <a className="hover:text-red-600" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
