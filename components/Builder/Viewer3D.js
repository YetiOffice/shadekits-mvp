// components/Builder/Viewer3D.js
import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";

// 1 unit = 1 foot. 4x4 post = 4 in = 0.333 ft
const POST_SIZE = 0.333;

// simple materials for finish choices
function useFinishMaterial(finish) {
  return useMemo(() => {
    // defaults
    let color = "#1f2937"; // charcoal/black
    let metalness = 0.1;
    let roughness = 0.6;

    if (finish === "HDG") {
      color = "#9aa0a6"; // galvanized vibe
      metalness = 0.6;
      roughness = 0.35;
    }
    if (finish === "White") color = "#f3f4f6";
    if (finish === "Bronze") color = "#4a3a2a";

    return { color, metalness, roughness };
  }, [finish]);
}

// Utility: create positions along a dimension (0..len) for N bays
function bayLines(length, bays) {
  // include 0 and length; internal bay divisions between
  const arr = [0];
  for (let i = 1; i < bays; i++) arr.push((length * i) / bays);
  arr.push(length);
  return arr;
}

/**
 * Procedural pergola:
 * - styles: 'Mono', 'Gable', 'AttachedMono'
 * - span (ft), depth (ft), height (ft), bays (int)
 * - infill: 'None' | 'SlatsOpen' | 'SlatsMedium' | 'SlatsTight' | 'PanelsPerforated' | 'PanelsSolid'
 * - finish: 'HDG' | 'Black' | 'White' | 'Bronze'
 */
function Pergola({ config }) {
  const { style, span, depth, height, bays, infill, finish } = config;

  const matProps = useFinishMaterial(finish);

  // Posts: for freestanding, rows at x=0 and x=span; for attached, only front row
  const frontX = span;
  const backX = 0;
  const yLines = bayLines(depth, bays); // positions along depth

  const posts = useMemo(() => {
    const arr = [];

    // front row (always)
    for (let i = 0; i < yLines.length; i++) {
      arr.push({ x: frontX, z: yLines[i] });
    }

    // back row only if not attached
    if (style !== "AttachedMono") {
      for (let i = 0; i < yLines.length; i++) {
        arr.push({ x: backX, z: yLines[i] });
      }
    }
    return arr;
  }, [style, frontX, backX, yLines]);

  // Perimeter beams at top (height)
  const beams = useMemo(() => {
    const arr = [];

    // longitudinal beams (along depth) at x = backX and x = frontX (unless attached)
    arr.push({
      type: "line",
      from: { x: frontX, z: 0 },
      to: { x: frontX, z: depth },
      thickness: POST_SIZE * 1.2,
    });
    if (style !== "AttachedMono") {
      arr.push({
        type: "line",
        from: { x: backX, z: 0 },
        to: { x: backX, z: depth },
        thickness: POST_SIZE * 1.2,
      });
    }

    // cross beams between front and back at each bay division (skip if attached? keep shorter beam from wall)
    for (let i = 0; i < yLines.length; i++) {
      const z = yLines[i];
      const startX = style === "AttachedMono" ? frontX - span * 0.5 : backX;
      arr.push({
        type: "line",
        from: { x: startX, z },
        to: { x: frontX, z },
        thickness: POST_SIZE * 1.1,
      });
    }
    return arr;
  }, [style, frontX, backX, depth, yLines]);

  // Slats across depth (run parallel to span)
  const slats = useMemo(() => {
    if (!infill || !infill.startsWith("Slats")) return [];

    let spacing = 3; // ft
    if (infill === "SlatsMedium") spacing = 1.5;
    if (infill === "SlatsTight") spacing = 1;

    const count = Math.max(1, Math.floor(depth / spacing));
    const arr = [];
    for (let i = 0; i <= count; i++) {
      const z = (i / count) * depth;
      const startX = style === "AttachedMono" ? frontX - span * 0.5 : backX;
      arr.push({
        from: { x: startX, z },
        to: { x: frontX, z },
        thickness: POST_SIZE * 0.6,
        height: height - POST_SIZE * 0.5,
      });
    }
    return arr;
  }, [infill, depth, span, style, frontX, backX, height]);

  // Simple gable ridge hint (cosmetic)
  const gableRidge = useMemo(() => {
    if (style !== "Gable") return null;
    const ridgeX = (frontX + backX) / 2;
    return { from: { x: ridgeX, z: 0 }, to: { x: ridgeX, z: depth } };
  }, [style, frontX, backX, depth]);

  // helpers
  const beamLen = (a, b) => Math.hypot(b.x - a.x, b.z - a.z);
  const midPoint = (a, b) => ({ x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 });
  const angleXZ = (a, b) => Math.atan2(b.z - a.z, b.x - a.x);

  return (
    <group position={[-span / 2, 0, -depth / 2]}>
      {/* Posts */}
      {posts.map((p, i) => (
        <mesh
          key={`post-${i}`}
          position={[p.x, height / 2, p.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[POST_SIZE, height, POST_SIZE]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      ))}

      {/* Beams (top) */}
      {beams.map((b, i) => {
        const L = beamLen(b.from, b.to);
        const m = midPoint(b.from, b.to);
        const ang = angleXZ(b.from, b.to);
        return (
          <mesh
            key={`beam-${i}`}
            position={[m.x, height, m.z]}
            rotation={[0, ang, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[L, POST_SIZE * 0.7, b.thickness]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        );
      })}

      {/* Slats */}
      {slats.map((s, i) => {
        const L = beamLen(s.from, s.to);
        const m = midPoint(s.from, s.to);
        const ang = angleXZ(s.from, s.to);
        return (
          <mesh
            key={`slat-${i}`}
            position={[m.x, s.height, m.z]}
            rotation={[0, ang, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[L, POST_SIZE * 0.35, s.thickness]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        );
      })}

      {/* Gable ridge hint */}
      {gableRidge && (
        <mesh
          position={[
            (gableRidge.from.x + gableRidge.to.x) / 2,
            height + POST_SIZE * 0.8,
            (gableRidge.from.z + gableRidge.to.z) / 2,
          ]}
          rotation={[0, angleXZ(gableRidge.from, gableRidge.to), 0]}
        >
          <boxGeometry args={[depth, POST_SIZE * 0.4, POST_SIZE * 0.4]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      )}
    </group>
  );
}

export default function Viewer3D({ config }) {
  const { span, depth } = config;
  const camZ = Math.max(span, depth) * 1.6;

  return (
    <Canvas
      shadows
      frameloop="demand"
      camera={{ position: [span * 0.9, Math.max(span, depth) * 0.9, camZ], fov: 40 }}
      style={{ width: "100%", height: "520px", borderRadius: "16px" }}
    >
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 18, 12]}
        intensity={0.9}
        castShadow
        shadow-mapSize={1024}
      />
      <Environment preset="city" />
      <Pergola config={config} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.35}
        scale={Math.max(span, depth) * 2}
        blur={2.4}
        far={6}
      />
      <OrbitControls
        minDistance={6}
        maxDistance={Math.max(span, depth) * 3}
        maxPolarAngle={Math.PI * 0.48}
      />
    </Canvas>
  );
}
