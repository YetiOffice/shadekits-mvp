// components/Layout.js
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import useScrollHeader from "../hooks/useScrollHeader";

export default function Layout({
  children,
  title = "ShadeKits",
  description = "Commercial-grade steel shade structures — DIY-friendly bolt-together kits. Live configurator, instant budget, PE-stamped drawings available, ships nationwide.",
}) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollHeader(8);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  // Close on Esc
  const onKeyDown = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] rounded bg-black px-3 py-2 text-white"
      >
        Skip to content
      </a>

      {/* Header */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition",
          scrolled ? "glass border-b border-neutral-200 shadow-sm" : "bg-transparent",
        ].join(" ")}
      >
        <div className="container-7xl flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="text-lg font-bold tracking-tight">
            ShadeKits
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <Link href="/shop" className="hover:text-neutral-900">
              Shop
            </Link>
            <Link href="/builder" className="hover:text-neutral-900">
              Builder
            </Link>
            <Link href="/resources" className="hover:text-neutral-900">
              Resources
            </Link>
            <Link href="/contact" className="hover:text-neutral-900">
              Contact
            </Link>
          </nav>

          {/* CTA (desktop) */}
          <div className="hidden md:flex">
            <Link href="/builder" className="btn-primary btn-lg">
              Build &amp; Price
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Open Menu"
            aria-expanded={open ? "true" : "false"}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Mobile menu (overlay + slide-in panel) */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60]"
        >
          {/* Backdrop */}
          <button
            aria-label="Close Menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-white shadow-xl ring-1 ring-black/5">
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

            <nav className="px-4 py-4 flex flex-col gap-2 text-base">
              <Link href="/shop" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-neutral-50">
                Shop
              </Link>
              <Link href="/builder" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-neutral-50">
                Builder
              </Link>
              <Link href="/resources" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-neutral-50">
                Resources
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-neutral-50">
                Contact
              </Link>

              <Link
                href="/builder"
                onClick={() => setOpen(false)}
                className="btn-primary btn-lg mt-3 w-full text-center"
              >
                Build &amp; Price
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main id="main" className="pt-14">
        <div className="container-7xl px-4 md:px-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200 bg-white">
        <div className="container-7xl py-8 px-4 md:px-6 text-sm text-neutral-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>© {new Date().getFullYear()} ShadeKits — Fabricated in the USA</div>
            <div className="flex items-center gap-5">
              <Link href="/terms" className="hover:text-neutral-900">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-neutral-900">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-neutral-900">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
