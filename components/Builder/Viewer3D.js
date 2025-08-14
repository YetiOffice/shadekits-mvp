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
          <mesh key={`beam-${i}`} positio
