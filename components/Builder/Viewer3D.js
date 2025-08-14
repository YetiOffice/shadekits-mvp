// components/Builder/Viewer3D.js
import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** ———> use your existing Frame/model component or geometry here <——— */
// If you already have a Frame component that renders posts/rails/slats, keep it.
// I'm showing a minimal shell so this file pastes cleanly.
function Frame({ config }) {
  // IMPORTANT: leave your working geometry code as-is.
  // (Only example geometry below—replace with your existing one if you have it.)
  const span = Math.max(4, Number(config?.span) || 12);
  const depth = Math.max(4, Number(config?.depth) || 12);
  const height = Math.max(6, Number(config?.height) || 10);

  const POST = 0.12;
  const RAIL = 0.08;

  const parts = [
    // posts
    { k: "p1", args: [POST, height, POST], pos: [0, height / 2, 0] },
    { k: "p2", args: [POST, height, POST], pos: [span, height / 2, 0] },
    { k: "p3", args: [POST, height, POST], pos: [0, height / 2, depth] },
    { k: "p4", args: [POST, height, POST], pos: [span, height / 2, depth] },
    // rails
    { k: "rf", args: [span, RAIL, RAIL], pos: [span / 2, height, 0] },
    { k: "rb", args: [span, RAIL, RAIL], pos: [span / 2, height, depth] },
    { k: "rl", args: [RAIL, RAIL, depth], pos: [0, height, depth / 2] },
    { k: "rr", args: [RAIL, RAIL, depth], pos: [span, height, depth / 2] },
  ];

  return (
    <group>
      {parts.map((m) => (
        <mesh key={m.k} position={m.pos}>
          <boxGeometry args={m.args} />
          <meshStandardMaterial color="#0f141a" roughness={0.7} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/** Fit camera nicely around the model */
function FitControls({ config }) {
  const controls = useRef();
  const camRef = useRef();

  useEffect(() => {
    const span = Math.max(4, Number(config?.span) || 12);
    const depth = Math.max(4, Number(config?.depth) || 12);
    const height = Math.max(6, Number(config?.height) || 10);

    const cam = camRef.current;
    if (!cam) return;

    const box = new THREE.Box3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(span, height + 0.6, depth)
    );
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fovRad = (cam.fov * Math.PI) / 180;
    const dist = (maxDim / 2) / Math.tan(fovRad / 2) + maxDim;

    cam.position.set(center.x + dist * 0.6, center.y + dist * 0.45, center.z + dist * 0.8);
    cam.near = 0.01;
    cam.far = dist * 10;
    cam.lookAt(center);
    cam.updateProjectionMatrix();

    if (controls.current) {
      controls.current.target.copy(center);
      controls.current.update();
    }
  }, [config]);

  return (
    <>
      {/* expose a camera element to grab a ref without custom canvas */}
      <perspectiveCamera ref={camRef} makeDefault fov={50} />
      <OrbitControls ref={controls} enablePan enableZoom enableRotate />
    </>
  );
}

export default function Viewer3D({ config, onFront, onCorner, onTop, onReset }) {
  return (
    <div className="viewer3d">
      <div className="viewer3d-canvas">
        <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={["#f7f8fa"]} />
          <hemisphereLight intensity={0.65} groundColor="#dfe3e6" />
          <directionalLight intensity={0.9} position={[5, 10, 5]} />
          <Frame config={config} />
          <FitControls config={config} />
        </Canvas>
      </div>

      <div className="viewer3d-controls">
        <button className="btn btn-sm" onClick={onFront}>Front</button>
        <button className="btn btn-sm" onClick={onCorner}>Corner</button>
        <button className="btn btn-sm" onClick={onTop}>Top</button>
        <button className="btn btn-sm" onClick={onReset}>Reset</button>
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        .viewer3d-canvas {
          width: 100%;
          height: 520px;      /* <-- give the canvas real space */
          border-radius: 14px;
          overflow: hidden;
          background: #f7f8fa;
        }
        @media (min-width: 1024px) {
          .viewer3d-canvas { height: 560px; }
        }
        .viewer3d-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          padding-top: 10px;
        }
        .btn.btn-sm {
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid #dfe3e6;
          background: #fff;
          cursor: pointer;
        }
        .btn.btn-sm:hover { background: #f3f4f6; }
      `}</style>
    </div>
  );
}
