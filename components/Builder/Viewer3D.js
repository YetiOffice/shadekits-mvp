import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";

// 1 unit = 1 foot. 4x4 post ~= 4" = 0.333 ft
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

/** Procedural pergola */
function Pergola({ config }) {
  const { style, span, depth, height, bays, infill, finish } = config;
  const matProps = useFinishMaterial(finish);

  const frontX = span;
  const backX = 0;
  const yLines = bayLines(depth, bays);

  // Posts
  const posts = useMemo(() => {
    const arr = [];
    // Front line
    for (let i = 0; i < yLines.length; i++) {
      arr.push({ x: frontX, z: yLines[i] });
    }
    // Back line (skip for attached mono)
    if (style !== "AttachedMono") {
      for (let i = 0; i < yLines.length; i++) {
        arr.push({ x: backX, z: yLines[i] });
      }
    }
    return arr;
  }, [style, frontX, backX, yLines]);

  // Beams (perimeter + side beams on each bay line)
  const beams = useMemo(() => {
    const arr = [];
    // Front perimeter
    arr.push({
      type: "line",
      from: { x: frontX, z: 0 },
      to: { x: frontX, z: depth },
      thickness: POST_SIZE * 1.2,
    });
    // Back perimeter (if freestanding)
    if (style !== "AttachedMono") {
      arr.push({
        type: "line",
        from: { x: backX, z: 0 },
        to: { x: backX, z: depth },
        thickness: POST_SIZE * 1.2,
      });
    }
    // Side beams on each bay line
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
  }, [style, frontX, backX, depth, yLines, span]);

  // Optional slats
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

  // Optional gable ridge
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
      {/* Posts */}
      {posts.map((p, i) => (
        <mesh key={`post-${i}`} position={[p.x, height / 2, p.z]} castShadow receiveShadow>
          <boxGeometry args={[POST_SIZE, height, POST_SIZE]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      ))}

      {/* Beams */}
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

      {/* Slats */}
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

      {/* Gable ridge */}
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

  // Expose setView() + capture(), and frame nicely
  useEffect(() => {
    if (!expose) return;

    const target = new THREE.Vector3(0, height * 0.5, 0);
    const fovRad = (camera.fov * Math.PI) / 180;
    const size = Math.max(span, depth);
    const baseFit = ((size / 2) / Math.tan(fovRad / 2)) * 1.25; // 25% padding

    const setView = (preset = "corner") => {
      controlsRef.current?.target.copy(target);

      if (preset === "top") {
        camera.position.set(0.01, baseFit + height, 0.01);
      } else if (preset === "front") {
        // A bit lower for an eye-level feel and tiny Z offset to avoid singularity.
        camera.position.set(baseFit * 1.05, Math.max(4, target.y * 0.7), 0.25);
      } else if (preset === "corner" || preset === "reset") {
        const d = baseFit * 1.15;
        camera.position.set(d, Math.max(4, target.y), d);
      }

      camera.near = 0.1;
      camera.far = Math.max(500, size * 50);
      camera.updateProjectionMatrix();

      controlsRef.current?.update();
      invalidate();
    };

    const capture = async () => {
      invalidate();
      return gl.domElement.toDataURL("image/jpeg", 0.9);
    };

    expose({ setView, capture });

    // Nice initial frame
    setView("corner");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expose, span, depth, height, camera, gl, invalidate]);

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
        minDistance={Math.max(6, Math.max(span, depth) * 0.8)}
        maxDistance={Math.max(span, depth) * 3.5}
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
      camera={{
        position: [span * 0.9, Math.max(span, depth) * 0.9, camZ],
        fov: 45,
      }}
      style={{ width: "100%", height: "520px", borderRadius: "16px" }}
    >
      <color attach="background" args={["#f8fafc"]} />
      <Scene config={config} expose={expose} />
    </Canvas>
  );
}
