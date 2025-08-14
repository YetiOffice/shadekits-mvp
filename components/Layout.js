import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children, title = 'ShadeKits', description = 'Commercial-grade steel shade structures — DIY-friendly bolt-together kits. Live configurator, instant budget, PE-stamped drawings available, ships nationwide.' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="container-7xl flex items-center justify-between py-3 px-4 md:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-tight">ShadeKits</Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <Link href="/" className="hover:text-red-600">Shop</Link>
            <Link href="/builder" className="hover:text-red-600">Build</Link>
            <Link href="/resources" className="hover:text-red-600">Install Resources</Link>
            <Link href="/contact" className="hover:text-red-600">Contact</Link>
          </nav>

          {/* CTA (desktop) */}
          <div className="hidden md:flex">
            <Link href="/contact" className="btn-primary">Get a Quote</Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Open Menu"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          >
            Menu
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <Link href="/" onClick={() => setOpen(false)} className="text-lg font-bold">ShadeKits</Link>
              <button
                aria-label="Close Menu"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div className="px-4 py-4 flex flex-col gap-2 text-base">
              <Link href="/" onClick={() => setOpen(false)} className="nav-mobile-link">Shop</Link>
              <Link href="/builder" onClick={() => setOpen(false)} className="nav-mobile-link">Build</Link>
              <Link href="/resources" onClick={() => setOpen(false)} className="nav-mobile-link">Install Resources</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="nav-mobile-link">Contact</Link>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-3 w-full text-center"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="container-7xl px-4 md:px-6">{children}</main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200">
        <div className="container-7xl py-8 px-4 md:px-6 text-sm text-neutral-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>© {new Date().getFullYear()} ShadeKits — Fabricated in the USA</div>
            <div className="flex items-center gap-5">
              <Link href="/terms" className="hover:text-red-600">Terms</Link>
              <Link href="/privacy" className="hover:text-red-600">Privacy</Link>
              <Link href="/contact" className="hover:text-red-600">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
