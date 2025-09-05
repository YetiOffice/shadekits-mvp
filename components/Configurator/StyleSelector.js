import React from "react";

const pill = (active) =>
  `px-3 py-1 rounded-full border text-sm mr-2 mb-2 ${
    active ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-neutral-300"
  }`;

export default function StyleSelector({ style, onChange }) {
  return (
    <div>
      <div className="text-sm font-medium mb-1">Product</div>
      {['Mono', 'Gable', 'AttachedMono'].map((s) => (
        <button
          key={s}
          type="button"
          className={pill(style === s)}
          onClick={() => onChange(s)}
        >
          {s === "Mono" ? "Freestanding Mono" : s === "Gable" ? "Freestanding Gable" : "Attached Mono"}
        </button>
      ))}
    </div>
  );
}