// components/Builder/Viewer3D.js
import React, { Suspense, useMemo, useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

/**
 * Assumptions:
 * - Units are feet.
 * - config = { span, depth, height, style, infill, finish }
 *   style: 'FreestandingMono' | 'AttachedMono' | 'FreestandingGable' (we render Mono & Gable here)
 *   infill: 'none' | 'open' | 'medium' | 'tight'
 *   finish: 'black' | 'white' | 'bronze' | 'hdg'
 *
 * This file restores the solid-mesh pergola you had earlier and adds a safe camera-fit
 * without changing geometry/materials.
 */

// 4x4 post size in feet (≈ 3.5")
const POST = 0.333;               // ~4"
const BEAM = 0.333;               // ~4" beam thickness
const SLAT_THICK = 0.15;          // ~1.8" slat thickness
const SLAT_HEIGHT = 0.12;         // ~1.4" slat height above beam

function finishToColor(finish) {
  switch ((finish || "").toLowerCase()) {
    case "white":
      return "#f8f8f8";
    case "bronze":
      return "#3b2a20";
    case "hdg":
      return "#9aa0a6";
    default:
    case "black":
      return "#17181a";
  }
}

function spacingFeet(infill) {
  switch ((infill || "").toLowerCase()) {
    case "open":
      return 1.0;   // 12"
    case "medium":
      return 0.5;   // 6"
    case "tight":
      return 0.33;  // 4"
    default:
      return 0;     // none
  }
}

/** Build the pergola geometry as meshes */
function Pergola({ config }) {
  const group = useRef();

  const { nodes } = useMemo(() => {
    const nodes = [];
    const span = Math.max(4, Number(config.span || 12));
    const depth = Math.max(4, Number(config.depth || 12));
    const height = Math.max(7, Number(config.height || 10));
    const color = new THREE.Color(finishToColor(config.finish));
    const metalness = config.finish?.toLowerCase() === "hdg" ? 0.0 : 0.3;
    const roughness = config.finish?.toLowerCase() === "hdg" ? 0.7 : 0.45;

    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness,
    });

    // Posts (4 corners for freestanding)
    const postGeo = new THREE.BoxGeometry(POST, height, POST);
    const yPost = height / 2;

    const addMesh = (geo, x, y, z, rotY = 0, material = mat) => {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x, y, z);
      if (rotY) m.rotation.y = rotY;
      m.castShadow = m.receiveShadow = true;
      nodes.push(m);
    };

    const isAttached = (config.style || "").toLowerCase().includes("attached");

    // Corners (0,0) to (span, depth)
    // Attached: two posts on front only
    if (isAttached) {
      addMesh(postGeo, span - POST / 2, yPost, POST / 2);
      addMesh(postGeo, POST / 2, yPost, POST / 2);
    } else {
      addMesh(postGeo, POST / 2, yPost, POST / 2);
      addMesh(postGeo, span - POST / 2, yPost, POST / 2);
      addMesh(postGeo, POST / 2, yPost, depth - POST / 2);
      addMesh(postGeo, span - POST / 2, yPost, depth - POST / 2);
    }

    // Top perimeter beams (front/back + left/right)
    const beamXGeo = new THREE.BoxGeometry(span, BEAM, BEAM);   // along X
    const beamZGeo = new THREE.BoxGeometry(BEAM, BEAM, depth);  // along Z
    const yBeam = height + BEAM / 2;

    // Front beam (z = POST/2)
    addMesh(beamXGeo, span / 2, yBeam, POST / 2);
    // Back beam (z = depth - POST/2) (only if freestanding)
    if (!isAttached) addMesh(beamXGeo, span / 2, yBeam, depth - POST / 2);

    // Left beam (x = POST/2)
    addMesh(beamZGeo, POST / 2, yBeam, depth / 2);
    // Right beam (x = span - POST/2)
    addMesh(beamZGeo, span - POST / 2, yBeam, depth / 2);

    // Gable center beam (optional simple representation)
    if ((config.style || "").toLowerCase().includes("gable")) {
      const ridgeGeo = new THREE.BoxGeometry(span, BEAM, BEAM);
      addMesh(ridgeGeo, span / 2, yBeam + BEAM, depth / 2);
    }

    // Slats (if any) run parallel to front beam (across X, spaced along Z)
    const gap = spacingFeet(config.infill);
    if (gap > 0) {
      const slatGeo = new THREE.BoxGeometry(span - POST, SLAT_HEIGHT, SLAT_THICK);
      const zStart = POST + gap / 2;
      for (let z = zStart; z <= depth - POST; z += gap) {
        addMesh(slatGeo, span / 2, yBeam + SLAT_HEIGHT / 2, z);
      }
    }

    return { nodes };
  }, [config]);

  return <group ref={group} dispose={null}>{nodes.map((n, i) => <primitive key={i} object={n} />)}</group>;
}

/** Safe camera fit that never changes geometry/materials */
function useFitCamera(groupRef, deps = []) {
  const { camera, controls, size } = useThree();

  const fit = useCallback(() => {
    const g = groupRef.current;
    if (!g) return;

    const box = new THREE.Box3().setFromObject(g);
    const sizeV = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(sizeV);
    box.getCenter(center);

    // set controls target to center
    if (controls) {
      controls.target.copy(center);
      controls.update();
    }

    // Compute distance for current fov & canvas height
    const margin = 1.25; // zoom out a bit
    const maxSize = Math.max(sizeV.x, sizeV.y, sizeV.z);
    const fov = (camera.fov || 50) * (Math.PI / 180);
    const dist = (maxSize * margin) / (2 * Math.tan(fov / 2));

    // place camera along diagonal
    camera.position.set(center.x + dist, center.y + dist * 0.6, center.z + dist);
    camera.near = Math.max(0.1, dist / 50);
    camera.far = dist * 200;
    camera.updateProjectionMatrix();

    if (controls) controls.update();
  }, [camera, controls, size]);

  useEffect(() => { fit(); }, [fit, ...deps]);
  return fit;
}

/** Internal overlay buttons (Front / Corner / Top / Reset) */
function ViewButtons({ onFront, onCorner, onTop, onReset }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 8,
        left: 8,
        display: "flex",
        gap: 8,
        zIndex: 2,
      }}
    >
      <button onClick={onFront} className="btn btn-sm">Front</button>
      <button onClick={onCorner} className="btn btn-sm">Corner</button>
      <button onClick={onTop} className="btn btn-sm">Top</button>
      <button onClick={onReset} className="btn btn-sm">Reset</button>
    </div>
  );
}

/** Snapshot helper (if you want a local button) */
function useSnapshot() {
  const { gl } = useThree();
  return useCallback(() => {
    try {
      const url = gl.domElement.toDataURL("image/png");
      return url;
    } catch {
      return null;
    }
  }, [gl]);
}

function Scene({ config, onRequestSnapshot }) {
  const groupRef = useRef();
  const { camera, controls } = useThree();

  // Fit camera whenever config changes
  const fit = useFitCamera(groupRef, [config.span, config.depth, config.height, config.infill, config.style]);

  const goFront = () => {
    const span = Number(config.span || 12);
    const depth = Number(config.depth || 12);
    const height = Number(config.height || 10);
    const dist = Math.max(span, depth) * 1.2;
    camera.position.set(span / 2, height * 0.75, depth + dist);
    controls.target.set(span / 2, height * 0.5, depth / 2);
    camera.updateProjectionMatrix();
    controls.update();
  };

  const goCorner = () => {
    const span = Number(config.span || 12);
    const depth = Number(config.depth || 12);
    const height = Number(config.height || 10);
    const dist = Math.max(span, depth) * 1.4;
    camera.position.set(-dist, height * 0.8, dist);
    controls.target.set(span / 2, height * 0.5, depth / 2);
    camera.updateProjectionMatrix();
    controls.update();
  };

  const goTop = () => {
    const span = Number(config.span || 12);
    const depth = Number(config.depth || 12);
    const height = Number(config.height || 10);
    const dist = Math.max(span, depth) * 2.0;
    camera.position.set(span / 2, dist, depth / 2);
    controls.target.set(span / 2, height / 2, depth / 2);
    camera.updateProjectionMatrix();
    controls.update();
  };

  const doReset = () => fit();

  const takeSnapshot = useSnapshot();

  useEffect(() => {
    if (!onRequestSnapshot) return;
    onRequestSnapshot.current = () => takeSnapshot();
  }, [onRequestSnapshot, takeSnapshot]);

  // Simple daylight
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[50, 80, 50]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <group ref={groupRef}>
        <Pergola config={config} />
        {/* Ground shadow catcher */}
        <mesh position={[ (config.span||12)/2, 0, (config.depth||12)/2 ]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
        </mesh>
      </group>

      <ViewButtons onFront={goFront} onCorner={goCorner} onTop={goTop} onReset={doReset} />
    </>
  );
}

export default function Viewer3D({ config, onSnapshotRef }) {
  // Make sure we have stable numeric values
  const safeConfig = {
    span: Number(config?.span || 12),
    depth: Number(config?.depth || 12),
    height: Number(config?.height || 10),
    style: config?.style || "FreestandingMono",
    finish: config?.finish || "black",
    infill: config?.infill || "none",
  };

  const snapRef = useRef();
  useEffect(() => {
    if (onSnapshotRef) onSnapshotRef.current = () => snapRef.current?.();
  }, [onSnapshotRef]);

  return (
    <div style={{ position: "relative", width: "100%", height: 520, borderRadius: 12, overflow: "hidden", background: "#f7f8fa" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 5000, position: [safeConfig.span, safeConfig.height, safeConfig.depth * 1.5] }}
        gl={{ preserveDrawingBuffer: true }}  // enables snapshots
      >
        <Suspense fallback={null}>
          <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
          <Environment preset="city" />
          <Scene config={safeConfig} onRequestSnapshot={snapRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
