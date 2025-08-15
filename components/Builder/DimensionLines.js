import React from "react";
import { Html } from "@react-three/drei";

export default function DimensionLines({ span, depth, height }) {
  // Simple lines with HTML overlays for dimension values
  return (
    <>
      {/* Span line (X axis) */}
      <mesh position={[span / 2, 0.1, 0]}>
        <boxGeometry args={[span, 0.04, 0.04]} />
        <meshBasicMaterial color="#3b82f6" />
        <Html position={[span / 2, 0.2, 0]} center>
          <span style={{ background: "#e0e7ff", padding: "3px 8px", borderRadius: 6, fontSize: 12, color: "#2563eb" }}>
            {span}′ span
          </span>
        </Html>
      </mesh>
      {/* Depth line (Z axis) */}
      <mesh position={[0, 0.1, depth / 2]}>
        <boxGeometry args={[0.04, 0.04, depth]} />
        <meshBasicMaterial color="#10b981" />
        <Html position={[0.2, 0.2, depth / 2]} center>
          <span style={{ background: "#d1fae5", padding: "3px 8px", borderRadius: 6, fontSize: 12, color: "#059669" }}>
            {depth}′ depth
          </span>
        </Html>
      </mesh>
      {/* Height line (Y axis) */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.04, height, 0.04]} />
        <meshBasicMaterial color="#f59e42" />
        <Html position={[0.2, height, 0]} center>
          <span style={{ background: "#ffedd5", padding: "3px 8px", borderRadius: 6, fontSize: 12, color: "#b45309" }}>
            {height}′ height
          </span>
        </Html>
      </mesh>
    </>
  );
}