import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";

// 1 unit = 1 foot. 4x4 post = 4 in = 0.333 ft
const POST_SIZE = 0.333;

/** Material by finish */
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

/** Evenly spaced Z lines (bays) */
function bayLines(length, bays) {
  const arr = [0];
  for (let i = 1; i < bays; i++) arr.push((length * i) / bays);
  arr.push(length);
  return arr;
}

/** Procedural pergola (posts, beams, optional slats, optional ridge) */
function Pergola({ config }) {
  const { style, span, depth, height, bays, infill, finish } = config;
  const matProps = useFinishMaterial(finish);

  const frontX = span;
  const backX = 0;
  const yLines = bayLines(depth, bays);

  // Posts
  const posts = useMemo(() => {
    const arr = [];
    for (let i = 0; i < yLines.length; i++) arr.push({ x: frontX, z: yLines[i] });
    if (style !== "AttachedMono") {
      for (let i = 0; i < yLines.length; i++) arr.push({ x: backX, z: yLines[i] });
    }
    return arr;
  }, [style, frontX, backX, yLines]);

  // Perimeter/front/back beams + side beams on each bay line
  const beams = useMemo(() => {
    const arr = [];
    arr.push({ type: "line", from: { x: frontX, z: 0 }, to: { x: frontX, z: depth }, thickness: POST_SIZE * 1.2 });
    if (style !== "AttachedMono") {
      arr.push({ type: "line", from: { x: backX, z: 0 }, to: { x: backX, z: depth }, thickness: POST_SIZE * 1.2 });
    }
    for (let i = 0; i < yLines
