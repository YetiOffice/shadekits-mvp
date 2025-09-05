import React from "react";

export default function SnapshotButton({ canvasRef }) {
  const handleDownload = () => {
    const canvas = canvasRef?.current || document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "pergola_snapshot.png";
      a.click();
    }
  };
  return (
    <button
      aria-label="Download snapshot"
      style={{
        position: "absolute", top: 12, left: 12,
        background: "#e11d48", color: "white", border: 0, borderRadius: 8,
        padding: "8px 16px", fontWeight: "bold", cursor: "pointer", zIndex: 2
      }}
      onClick={handleDownload}
    >
      Snapshot
    </button>
  );
}