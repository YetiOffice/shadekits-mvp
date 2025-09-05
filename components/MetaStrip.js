// components/MetaStrip.js
export default function MetaStrip({
  children = "Lead time 3–5 weeks • PE-stamped drawings • Nationwide freight",
}) {
  return (
    <div className="container-7xl">
      <div className="mt-4 mb-6 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">
        {children}
      </div>
    </div>
  );
}
