import React from "react";

export default function MaterialPreview({ hovered }) {
  if (!hovered) return null;
  const { type } = hovered.userData || {};
  // Example: show a color swatch and label
  return (
    <div style={{
      position: "absolute", top: 12, right: 12,
      background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 10, minWidth: 120,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>
        {type || "Material"}
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: 6, background: hovered.material?.color?.getStyle?.() ?? "#17181a",
        border: "1px solid #e5e7eb", marginBottom: 6
      }} />
      <div style={{ fontSize: 12, color: "#64748b" }}>
        {hovered.material?.name || "Standard steel"}
      </div>
    </div>
  );
}