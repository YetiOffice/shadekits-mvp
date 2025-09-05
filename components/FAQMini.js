// components/FAQMini.js
export default function FAQMini({
  items = [
    ["Permits & engineering", "PE-stamped drawings available. Check local requirements for your site."],
    ["Wind / snow", "Kits are engineered for typical US loads. Share your ZIP and we’ll confirm."],
    ["Slab vs. footings", "Both supported. We’ll specify anchors based on your site prep."],
    ["Lead time", "Most kits ship in 3–5 weeks."],
    ["Delivery", "Freight nationwide on pallets, with liftgate options."],
    ["Install", "DIY-friendly with 2–3 people and common power tools."],
  ],
  title = "Common questions",
}) {
  return (
    <div className="card p-4">
      <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">{title}</div>
      <ul className="space-y-2">
        {items.map(([q, a], i) => (
          <li key={i}>
            <div className="font-medium">{q}</div>
            <div className="text-sm text-neutral-700">{a}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
