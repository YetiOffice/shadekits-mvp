// components/Builder/Viewer3D.js
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Frame({ config }) {
  const group = useRef();

  const { span, depth, height, style, infill } = config;

  // Simple frame model: posts & perimeter rails + optional slats
  const parts = useMemo(() => {
    const POST = 0.12; // ~4x4”
    const RAIL = 0.08; // ~3”
    const pieces = [];

    // Posts (mono or attached mono has 3 posts; gable would be similar)
    const postPositions =
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

    postPositions.forEach(([x, y, z], i) => {
      pieces.push({
        key: `post-${i}`,
        type: "box",
        args: [POST, height, POST],
        position: [x, height / 2, z],
      });
    });

    // Perimeter rails
    pieces.push(
      {
        key: "rail-front",
        type: "box",
        args: [span, RAIL, RAIL],
        position: [span / 2, height, 0],
      },
      {
        key: "rail-back",
        type: "box",
        args: [span, RAIL, RAIL],
        position: [span / 2, height, depth],
      },
      {
        key: "rail-left",
        type: "box",
        args: [RAIL, RAIL, depth],
        position: [0, height, depth / 2],
      },
      {
        key: "rail-right",
        type: "box",
        args: [RAIL, RAIL, depth],
        position: [span, height, depth / 2],
      }
    );

    // Slats
    if (infill !== "none") {
      const slat = 0.04; // ~1.5"
      const gap =
        infill === "slats-open" ? 0.12 : infill === "slats-medium" ? 0.08 : 0.05;
      const avail = span - RAIL * 2;
      const pitch = slat + gap;
      const count = Math.max(1, Math.floor(avail / pitch));
      const start = (span - (count * slat + (count - 1) * gap)) / 2;

      for (let i = 0; i < count; i++) {
        const x = start + i * (slat + gap) + slat / 2;
        pieces.push({
          key: `slat-${i}`,
          type: "box",
          args: [slat, 0.03, depth - RAIL * 2],
          position: [x, height + 0.015, depth / 2],
        });
      }
    }

    return pieces;
  }, [config]);

  return (
    <group ref={group}>
      {parts.map((p) => (
        <mesh key={p.key} position={p.position}>
          <boxGeometry args={p.args} />
          {/* simple dark finish */}
          <meshStandardMaterial color="#0f141a" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function FitCamera({ config }) {
  const { camera, size } = useThree();
  const controls = useRef();

  useEffect(() => {
    // Frame the structure
    const box = new THREE.Box3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(config.span, config.height + 0.5, config.depth)
    );
    const center = new THREE.Vector3();
    box.getCenter(center);

    const diag = box.getSize(new THREE.Vector3()).length();
    const distance = diag * 0.9;

    // set camera for an isometric-ish angle
    camera.position.set(config.span * 0.8, config.height * 0.9, config.depth * 1.2);
    camera.near = 0.01;
    camera.far = Math.max(500, distance * 5);
    camera.updateProjectionMatrix();
  }, [camera, size, config]);

  // Orbit controls for inspection
  return <OrbitControls ref={controls} enablePan enableZoom enableRotate />;
}

export default function Viewer3D({
  config,
  onFront,
  onCorner,
  onTop,
  onReset,
}) {
  return (
    <div>
      <Canvas camera={{ fov: 50 }}>
        <color attach="background" args={["#f9fafb"]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 10, 5]} intensity={0.9} />
        <Frame config={config} />
        <FitCamera config={config} />
      </Canvas>

      {/* These are NORMAL HTML buttons OUTSIDE the Canvas */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button onClick={onFront} className="btn btn-sm">Front</button>
        <button onClick={onCorner} className="btn btn-sm">Corner</button>
        <button onClick={onTop} className="btn btn-sm">Top</button>
        <button onClick={onReset} className="btn btn-sm">Reset</button>
      </div>
    </div>
  );
}
