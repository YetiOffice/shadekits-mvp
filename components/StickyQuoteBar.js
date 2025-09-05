// components/StickyQuoteBar.js
import React from "react";

export default function StickyQuoteBar({ fromUsd, onClick }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-3 py-2 flex items-center gap-3">
        <div className="text-sm">
          <div className="text-neutral-500 leading-none">From</div>
          <div className="font-semibold leading-tight">{fromUsd} • 3–5 weeks</div>
        </div>
        <button
          className="ml-auto px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold shadow-sm hover:bg-rose-700 active:bg-rose-800"
          onClick={onClick}
        >
          Request Concept & Price
        </button>
      </div>
    </div>
  );
}
