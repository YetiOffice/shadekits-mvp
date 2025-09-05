import React from "react";

export default function TooltipOverlay({ hovered }) {
  if (!hovered) return null;
  const { tooltip } = hovered.userData || {};
  if (!tooltip) return null;
  return (
    <div style={{
      position: "absolute", left: 24, bottom: 24,
      background: "#f8fafc", padding: "8px 14px", borderRadius: 10, color: "#334155",
      fontSize: 15, boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
    }}>
      {tooltip}
    </div>
  );
}