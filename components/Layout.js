import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import useScrollHeader from '../hooks/useScrollHeader';

export default function Layout({
  children,
  title = 'ShadeKits',
  description = 'Commercial-grade steel shade structures — DIY-friendly bolt-together kits. Live configurator, instant budget, PE-stamped drawings available, ships nationwide.'
}) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollHeader(8);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] bg-white border border-neutral-300 rounded-xl px-3 py-2 text-sm"
      >
        Skip to content
      </a>

      {/* Header */}
      <header
        className={[
          "sticky top-0 z-30 transition-colors",
          scrolled
            ? "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200"
            : "bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200"
        ].join(" ")}
      >
        <div className="container-7xl flex items-center justify-between py-3 px-4 md:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-tight">
              ShadeKits
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <Link href="/shop" className="hover:text-neutral-900">Shop</Link>
            <Link href="/builder" className="hover:text-neutral-900">Builder</Link>
            <Link href="/resources" className="hover:text-neutral-900">Resources</Link>
            <Link href="/contact" className="hover:text-neutral-900">Contact</Link>
          </nav>

          {/* CTA (desktop) */}
          <div className="hidden md:flex">
            <Link href="/builder" className="btn-primary">Get a Quote</Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Open Menu"
            aria-expanded={open ? "true" : "false"}
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
              <Link href="/" onClick={() => setOpen(false)} className="text-lg font-bold">
                ShadeKits
              </Link>
              <button
                aria-label="Close Menu"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div className="px-4 py-4 flex flex-col gap-2 text-base">
              <Link href="/shop" onClick={() => setOpen(false)} className="nav-mobile-link">Shop</Link>
              <Link href="/builder" onClick={() => setOpen(false)} className="nav-mobile-link">Builder</Link>
              <Link href="/resources" onClick={() => setOpen(false)} className="nav-mobile-link">Resources</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="nav-mobile-link">Contact</Link>

              <Link
                href="/builder"
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
      <main id="main" className="container-7xl px-4 md:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200 bg-white">
        <div className="container-7xl py-8 px-4 md:px-6 text-sm text-neutral-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>© {new Date().getFullYear()} ShadeKits — Fabricated in the USA</div>
            <div className="flex items-center gap-5">
              <Link href="/terms" className="hover:text-neutral-900">Terms</Link>
              <Link href="/privacy" className="hover:text-neutral-900">Privacy</Link>
              <Link href="/contact" className="hover:text-neutral-900">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
