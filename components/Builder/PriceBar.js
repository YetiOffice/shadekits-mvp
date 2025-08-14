// components/Builder/PriceBar.js
import React from "react";

/**
 * Sticky bottom summary for mobile/tablet.
 * Pass budgetMin/budgetMax (numbers) and onQuoteClick handler.
 */
export default function PriceBar({ budgetMin, budgetMax, onQuoteClick }) {
  const fmt = (n) =>
    typeof n === "number" ? `$${n.toLocaleString()}` : "—";

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div className="mx-auto max-w-6xl px-3 pb-3">
        <div className="flex items-center justify-between rounded-2xl bg-white/95 shadow-lg ring-1 ring-neutral-200 backdrop-blur px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500">Budget Range</span>
            <span className="text-base font-semibold">
              {fmt(budgetMin)} – {fmt(budgetMax)}
            </span>
          </div>
          <button
            onClick={onQuoteClick}
            className="rounded-xl bg-red-600 px-4 py-2 text-white font-medium active:scale-[0.98] transition"
          >
            Request Concept & Price
          </button>
        </div>
      </div>
      {/* push page up slightly so the bar doesn’t cover content */}
      <div className="h-6" />
    </div>
  );
}
