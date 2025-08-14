// components/Builder/Viewer3D.js
import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";

// 1 unit = 1 foot. 4x4 post = 4 in = 0.333 ft
const POST_SIZE = 0.333;

function useFinishMaterial(finish) {
  return useMemo(() => {
    let color = "#1f2937"; // charcoal/black
    let metalness = 0.1;
    let roughness = 0.6;
    if (finish === "HDG") {
      color = "#9aa0a6";
      metalness = 0.6;
      roughness = 0.35;
    }
    if (finish === "White") color = "#f3f4f6";
    if (finish === "Bronze") color = "#4a3a2a";
    return { color, metalness, roughness };
  }, [finish]);
}

function bayLines(length, bays) {
  const arr = [0];
  for (let i = 1; i < bays; i++) arr.push((length * i) / bays);
  arr.push(length);
  return arr;
}

function Pergola({ config }) {
  const { style, span, depth, height, bays, infill, finish } = config;
  const matProps = useFinishMaterial(finish);

  const frontX = span;
  const backX = 0;
  const yLines = bayLines(depth, bays);

  const posts = useMemo(() => {
    const arr = [];
    for (let i = 0; i < yLines.length; i++) arr.push({ x: frontX, z: yLines[i] });
    if (style !== "AttachedMono") {
      for (let i = 0; i < yLines.length; i++) arr.push({ x: backX, z: yLines[i] });
    }
    return arr;
  }, [style, frontX, backX, yLines]);

  const beams = useMemo(() => {
    const arr = [];
    arr.push({ type: "line", from: { x: frontX, z: 0 }, to: { x: frontX, z: depth }, thickness: POST_SIZE * 1.2 });
    if (style !== "AttachedMono") {
      arr.push({ type: "line", from: { x: backX, z: 0 }, to: { x: backX, z: depth }, thickness: POST_SIZE * 1.2 });
    }
    for (let i = 0; i < yLines.length; i++) {
      const z = yLines[i];
      const startX = style === "AttachedMono" ? frontX - span * 0.5 : backX;
      arr.push({ type: "line", from: { x: startX, z }, to: { x: frontX, z }, thickness: POST_SIZE * 1.1 });
    }
    return arr;
  }, [style, frontX, backX, depth, yLines]);

  const slats = useMemo(() => {
    if (!infill || !infill.startsWith("Slats")) return [];
    let spacing = 3;
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

  const gableRidge = useMemo(() => {
    if (style !== "Gable") return null;
    const ridgeX = (frontX + backX) / 2;
    return { from: { x: ridgeX, z: 0 }, to: { x: ridgeX, z: depth } };
  }, [style, frontX, backX, depth]);

  const beamLen = (a, b) => Math.hypot(b.x - a.x, b.z - a.z);
  const midPoint = (a, b) => ({ x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 });
  const angleXZ = (a, b) => Math.atan2(b.z - a.z, b.x - a.x);

  return (
    <group position={[-span / 2, 0, -depth / 2]}>
      {posts.map((p, i) => (
        <mesh key={`post-${i}`} position={[p.x, height / 2, p.z]} castShadow receiveShadow>
          <boxGeometry args={[POST_SIZE, height, POST_SIZE]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      ))}

      {beams.map((b, i) => {
        const L = beamLen(b.from, b.to);
        const m = midPoint(b.from, b.to);
        const ang = angleXZ(b.from, b.to);
        return (
          <mesh key={`beam-${i}`} position={[m.x, height, m.z]} rotation={[0, ang, 0]} castShadow receiveShadow>
            <boxGeometry args={[L, POST_SIZE * 0.7, b.thickness]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        );
      })}

      {slats.map((s, i) => {
        const L = beamLen(s.from, s.to);
        const m = midPoint(s.from, s.to);
        const ang = angleXZ(s.from, s.to);
        return (
          <mesh key={`slat-${i}`} position={[m.x, s.height, m.z]} rotation={[0, ang, 0]} castShadow receiveShadow>
            <boxGeometry args={[L, POST_SIZE * 0.35, s.thickness]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        );
      })}

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

function Scene({ config, expose }) {
  const controlsRef = useRef();
  const { camera, gl, invalidate } = useThree();
  const { span, depth, height } = config;

  // Expose tiny API to parent (capture + camera presets)
  useEffect(() => {
    if (!expose) return;
    const radius = Math.max(span, depth);
    const centerY = Math.max(height * 0.6, 5);

    const setView = (preset = "corner") => {
      if (preset === "front") camera.position.set(radius * 1.2, centerY, 0.01);
      if (preset === "corner") camera.position.set(radius * 1.2, centerY, radius * 1.2);
      if (preset === "top") camera.position.set(0.01, radius * 2, 0.01);
      if (preset === "reset") camera.position.set(radius * 1.2, centerY, radius * 1.2);
      controlsRef.current?.target.set(0, height * 0.5, 0);
      controlsRef.current?.update();
      invalidate();
    };

    const capture = async () => {
      // ensure a frame is rendered
      invalidate();
      return gl.domElement.toDataURL("image/jpeg", 0.9);
    };

    expose({ setView, capture });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expose, span, depth, height]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 18, 12]} intensity={0.9} castShadow shadow-mapSize={1024} />
      <Environment preset="city" />
      <Pergola config={config} />
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={Math.max(span, depth) * 2} blur={2.4} far={6} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        minDistance={6}
        maxDistance={Math.max(span, depth) * 3}
        maxPolarAngle={Math.PI * 0.48}
      />
    </>
  );
}

export default function Viewer3D({ config, expose }) {
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
      <Scene config={config} expose={expose} />
    </Canvas>
  );
}
