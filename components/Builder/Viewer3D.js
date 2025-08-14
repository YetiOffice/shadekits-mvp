// components/Builder/Viewer3D.js
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/** Coerce and sanitize numbers from config */
function useDims(raw) {
  const span = Math.max(4, Number(raw?.span) || 12);     // feet
  const depth = Math.max(4, Number(raw?.depth) || 12);   // feet
  const height = Math.max(6, Number(raw?.height) || 10); // feet
  const style = raw?.style || "FreestandingMono";
  const infill = raw?.infill || "none";
  return { span, depth, height, style, infill };
}

function Frame({ rawConfig }) {
  const { span, depth, height, style, infill } = useDims(rawConfig);
  const POST = 0.12; // ~4x4" (feet-ish units)
  const RAIL = 0.08; // ~3"
  const SLAT_T = 0.03; // slat thickness (~1")

  const meshes = useMemo(() => {
    const parts = [];

    // Posts (3 for attached, 4 for freestanding)
    const posts =
      style === "AttachedMono"
        ? [
            [0, 0, 0],
            [span, 0, 0],
            [span, 0, depth],
          ]
        : [
            [0, 0, 0],
            [span, 0, 0],
            [0, 0, depth],
            [span, 0, depth],
          ];

    posts.forEach(([x, y, z], i) => {
      parts.push({
        key: `post-${i}`,
        args: [POST, height, POST],
        pos: [x, height / 2, z],
      });
    });

    // Perimeter rails (top)
    parts.push(
      { key: "rail-front", args: [span, RAIL, RAIL], pos: [span / 2, height, 0] },
      { key: "rail-back", args: [span, RAIL, RAIL], pos: [span / 2, height, depth] },
      { key: "rail-left", args: [RAIL, RAIL, depth], pos: [0, height, depth / 2] },
      { key: "rail-right", args: [RAIL, RAIL, depth], pos: [span, height, depth / 2] }
    );

    // Slats (optional)
    if (infill !== "none") {
      const slatW = 0.04; // ~1.5"
      const gap =
        infill === "slats-open" ? 0.12 : infill === "slats-medium" ? 0.08 : 0.05;

      const avail = span - RAIL * 2;
      const pitch = slatW + gap;
      const count = Math.max(1, Math.floor(avail / pitch));
      const total = count * slatW + (count - 1) * gap;
      const start = (span - total) / 2;

      for (let i = 0; i < count; i++) {
        const x = start + i * (slatW + gap) + slatW / 2;
        parts.push({
          key: `slat-${i}`,
          args: [slatW, SLAT_T, depth - RAIL * 2],
          pos: [x, height + SLAT_T / 2, depth / 2],
        });
      }
    }

    return parts;
  }, [rawConfig]);

  return (
    <group>
      {meshes.map((m) => (
        <mesh key={m.key} position={m.pos}>
          <boxGeometry args={m.args} />
          <meshStandardMaterial color="#0f141a" roughness={0.7} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function FitAndControls({ rawConfig }) {
  const { span, depth, height } = useDims(rawConfig);
  const { camera } = useThree();
  const controls = useRef();

  useEffect(() => {
    // Bounding box for the structure
    const box = new THREE.Box3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(span, height + 0.6, depth)
    );
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Reasonable camera distance based on fov and the largest dimension
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera.fov * Math.PI) / 180;
    const distance = (maxDim / 2) / Math.tan(fov / 2) + maxDim;

    // Isometric-ish angle
    camera.position.set(center.x + distance * 0.6, center.y + distance * 0.45, center.z + distance * 0.8);
    camera.near = 0.01;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();

    // Point orbit target at the center
    if (controls.current) {
      controls.current.target.copy(center);
      controls.current.update();
    }
  }, [span, depth, height, camera]);

  return <OrbitControls ref={controls} enablePan enableZoom enableRotate />;
}

export default function Viewer3D({ config, onFront, onCorner, onTop, onReset }) {
  return (
    <div>
      <Canvas camera={{ fov: 50 }}>
        <color attach="background" args={["#f7f8fa"]} />
        <hemisphereLight intensity={0.65} groundColor="#dfe3e6" />
        <directionalLight intensity={0.9} position={[5, 10, 5]} />
        <Frame rawConfig={config} />
        <FitAndControls rawConfig={config} />
      </Canvas>

      {/* OUTSIDE Canvas == normal HTML */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button className="btn btn-sm" onClick={onFront}>Front</button>
        <button className="btn btn-sm" onClick={onCorner}>Corner</button>
        <button className="btn btn-sm" onClick={onTop}>Top</button>
        <button className="btn btn-sm" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
