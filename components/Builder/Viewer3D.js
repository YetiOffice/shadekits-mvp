import React, { Suspense, useMemo, useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import SentryBoundary from "../SentryBoundary";
import DimensionLines from "./DimensionLines";
import MaterialPreview from "./MaterialPreview";
import TooltipOverlay from "./TooltipOverlay";
import SnapshotButton from "./SnapshotButton";

// Model constants
const POST = 0.333; // 4"
const BEAM = 0.333;
const SLAT_THICK = 0.15;
const SLAT_HEIGHT = 0.12;

function finishToColor(finish) {
  switch ((finish || "").toLowerCase()) {
    case "white": return "#f8f8f8";
    case "bronze": return "#3b2a20";
    case "hdg":    return "#9aa0a6";
    default:       return "#17181a";
  }
}
function spacingFeet(infill) {
  switch ((infill || "").toLowerCase()) {
    case "open":   return 1.0;
    case "medium": return 0.5;
    case "tight":  return 0.33;
    default:       return 0;
  }
}

// Error boundary for geometry
function GeometryBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return <div role="alert" aria-live="assertive" style={{ color: "#b91c1c", padding: 18, background: "#fff4f4", borderRadius: 12 }}>
      <div><b>3D Model Error</b></div>
      <div>{error.message}</div>
    </div>;
  }
  return (
    <React.Suspense fallback={null}>
      {React.cloneElement(children, { onError: setError })}
    </React.Suspense>
  );
}

// Modular pergola
function Pergola({ config, onError, onHover }) {
  const group = useRef();
  try {
    const { nodes, dimensions } = useMemo(() => {
      const nodes = [];
      const span = Math.max(4, Number(config.span || 12));
      const depth = Math.max(4, Number(config.depth || 12));
      const height = Math.max(7, Number(config.height || 10));
      const color = new THREE.Color(finishToColor(config.finish));
      const metalness = config.finish?.toLowerCase() === "hdg" ? 0.0 : 0.3;
      const roughness = config.finish?.toLowerCase() === "hdg" ? 0.7 : 0.45;
      const mat = new THREE.MeshStandardMaterial({ color, metalness, roughness });

      const postGeo = new THREE.BoxGeometry(POST, height, POST);
      const yPost = height / 2;
      const addMesh = (geo, x, y, z, rotY = 0, material = mat, tooltip = null) => {
        const m = new THREE.Mesh(geo, material);
        m.position.set(x, y, z);
        if (rotY) m.rotation.y = rotY;
        m.castShadow = m.receiveShadow = true;
        if (tooltip) m.userData.tooltip = tooltip;
        m.userData.type = tooltip ? tooltip : "structure";
        nodes.push(m);
      };
      const isAttached = (config.style || "").toLowerCase().includes("attached");
      if (isAttached) {
        addMesh(postGeo, span - POST / 2, yPost, POST / 2, 0, mat, "Post (Attached)");
        addMesh(postGeo, POST / 2, yPost, POST / 2, 0, mat, "Post (Attached)");
      } else {
        addMesh(postGeo, POST / 2, yPost, POST / 2, 0, mat, "Post (Corner)");
        addMesh(postGeo, span - POST / 2, yPost, POST / 2, 0, mat, "Post (Corner)");
        addMesh(postGeo, POST / 2, yPost, depth - POST / 2, 0, mat, "Post (Corner)");
        addMesh(postGeo, span - POST / 2, yPost, depth - POST / 2, 0, mat, "Post (Corner)");
      }
      const beamXGeo = new THREE.BoxGeometry(span, BEAM, BEAM);
      const beamZGeo = new THREE.BoxGeometry(BEAM, BEAM, depth);
      const yBeam = height + BEAM / 2;
      addMesh(beamXGeo, span / 2, yBeam, POST / 2, 0, mat, "Front Beam");
      if (!isAttached) addMesh(beamXGeo, span / 2, yBeam, depth - POST / 2, 0, mat, "Back Beam");
      addMesh(beamZGeo, POST / 2, yBeam, depth / 2, 0, mat, "Left Beam");
      addMesh(beamZGeo, span - POST / 2, yBeam, depth / 2, 0, mat, "Right Beam");
      if ((config.style || "").toLowerCase().includes("gable")) {
        const ridgeGeo = new THREE.BoxGeometry(span, BEAM, BEAM);
        addMesh(ridgeGeo, span / 2, yBeam + BEAM, depth / 2, 0, mat, "Gable Ridge");
      }
      const gap = spacingFeet(config.infill);
      if (gap > 0) {
        const slatGeo = new THREE.BoxGeometry(span - POST, SLAT_HEIGHT, SLAT_THICK);
        const zStart = POST + gap / 2;
        for (let z = zStart; z <= depth - POST; z += gap) {
          addMesh(slatGeo, span / 2, yBeam + SLAT_HEIGHT / 2, z, 0, mat, "Slat");
        }
      }
      // Dimensions for overlays
      return { nodes, dimensions: { span, depth, height } };
    }, [config]);
    // Hover interaction for tooltips/material preview
    return <group ref={group} dispose={null}>
      {nodes.map((n, i) => (
        <primitive
          key={i}
          object={n}
          onPointerOver={e => onHover && onHover(n)}
          onPointerOut={e => onHover && onHover(null)}
        />
      ))}
      <DimensionLines {...dimensions} />
    </group>;
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
}

// Camera fit logic and presets (returns preset functions)
function useCameraPresets(groupRef) {
  const { camera, controls } = useThree();
  const preset = useCallback((pos, target) => {
    camera.position.set(...pos);
    controls.target.set(...target);
    camera.updateProjectionMatrix();
    controls.update();
  }, [camera, controls]);
  return preset;
}

// Scene with overlays and error boundaries
function SceneWithOverlays({ config, onHover }) {
  const groupRef = useRef();
  const [error, setError] = useState(null);

  // ARIA for canvas
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "3D pergola preview");
      canvas.setAttribute("tabIndex", "0");
    }
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 80, 50]} intensity={0.9} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <group ref={groupRef}>
        <GeometryBoundary>
          <Pergola config={config} onError={setError} onHover={onHover} />
        </GeometryBoundary>
        {/* Ground shadow catcher */}
        <mesh position={[ (config.span||12)/2, 0, (config.depth||12)/2 ]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
        </mesh>
      </group>
    </>
  );
}

export default function Viewer3D({ config }) {
  const safeConfig = {
    span: Number(config?.span || 12),
    depth: Number(config?.depth || 12),
    height: Number(config?.height || 10),
    style: config?.style || "FreestandingMono",
    finish: config?.finish || "black",
    infill: config?.infill || "none",
  };

  const [hovered, setHovered] = useState(null);
  const canvasRef = useRef(null);

  // Camera preset logic for overlay buttons
  const cameraPresets = [
    { label: "Front", pos: [safeConfig.span / 2, safeConfig.height * 0.75, safeConfig.depth + Math.max(safeConfig.span, safeConfig.depth) * 1.2], target: [safeConfig.span / 2, safeConfig.height * 0.5, safeConfig.depth / 2] },
    { label: "Corner", pos: [-Math.max(safeConfig.span, safeConfig.depth) * 1.4, safeConfig.height * 0.8, Math.max(safeConfig.span, safeConfig.depth) * 1.4], target: [safeConfig.span / 2, safeConfig.height * 0.5, safeConfig.depth / 2] },
    { label: "Top", pos: [safeConfig.span / 2, Math.max(safeConfig.span, safeConfig.depth) * 2.0, safeConfig.depth / 2], target: [safeConfig.span / 2, safeConfig.height / 2, safeConfig.depth / 2] },
    { label: "Side", pos: [0, safeConfig.height / 2, safeConfig.depth * 2], target: [safeConfig.span / 2, safeConfig.height / 2, safeConfig.depth / 2] },
    { label: "Isometric", pos: [safeConfig.span, safeConfig.height, safeConfig.depth], target: [safeConfig.span / 2, safeConfig.height / 2, safeConfig.depth / 2] }
  ];

  // Overlay buttons outside Canvas
  function CameraPresetOverlay() {
    // Use imperative API for camera movement
    const presetFns = [];
    cameraPresets.forEach((preset, idx) => {
      presetFns.push(() => {
        const canvas = canvasRef.current;
        if (canvas && canvas.__r3f && canvas.__r3f.root) {
          const state = canvas.__r3f.root.getState();
          state.camera.position.set(...preset.pos);
          state.controls.target.set(...preset.target);
          state.camera.updateProjectionMatrix();
          state.controls.update();
        }
      });
    });
    return (
      <div aria-label="Camera Presets" style={{
        position: "absolute", bottom: 8, left: 8, display: "flex", gap: 8, zIndex: 2
      }}>
        {cameraPresets.map((preset, i) => (
          <button type="button" key={preset.label} onClick={presetFns[i]}>{preset.label}</button>
        ))}
      </div>
    );
  }

  return (
    <SentryBoundary>
      <div style={{ position: "relative", width: "100%", height: 520, borderRadius: 12, overflow: "hidden", background: "#f7f8fa" }}>
        {/* Overlay UI OUTSIDE Canvas */}
        <CameraPresetOverlay />
        <MaterialPreview hovered={hovered} />
        <TooltipOverlay hovered={hovered} />
        <SnapshotButton canvasRef={canvasRef} />
        {/* 3D Canvas */}
        <Canvas
          ref={canvasRef}
          shadows
          dpr={[1, 2]}
          camera={{ fov: 45, near: 0.1, far: 5000, position: [safeConfig.span, safeConfig.height, safeConfig.depth * 1.5] }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={null}>
            <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
            <Environment preset="city" />
            <SceneWithOverlays config={safeConfig} onHover={setHovered} />
          </Suspense>
        </Canvas>
      </div>
    </SentryBoundary>
  );
}
