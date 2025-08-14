// components/Builder/Viewer3D.js
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { createPortal } from "react-dom";

/**
 * === Public API ===
 * <Viewer3D
 *   config={{
 *     span: 12,         // feet (X)
 *     depth: 12,        // feet (Z)
 *     height: 10,       // feet (Y)
 *     bays: 1,          // for future use; mono example keeps 4 posts
 *     style: "FreestandingMono", // "FreestandingGable" | "AttachedMono" (basic support)
 *     infill: "tight",  // "none" | "open" | "medium" | "tight"
 *     finish: "Black"   // "Black" | "White" | "Bronze" | "HDG"
 *   }}
 * />
 */

/* ---------------------------- Helper utilities ---------------------------- */

const POST_SIZE = 0.15; // ~ 3.5-4" (scene units ~= feet)
const BEAM_SIZE = 0.18;

const FINISH_COLORS = {
  Black: "#111418",
  White: "#EAEBEF",
  Bronze: "#6e5a4b",
  HDG: "#a5adb2",
};

function colorFromFinish(name) {
  return FINISH_COLORS[name] || FINISH_COLORS.Black;
}

/** Compute slat spacing by preset */
function spacingFromInfill(infill) {
  switch ((infill || "none").toLowerCase()) {
    case "open":
      return 1.2;
    case "medium":
      return 0.9;
    case "tight":
      return 0.6;
    default:
      return null; // none
  }
}

/** Fit camera to a box with margin (returns suggested distance) */
function fitCameraToBox(camera, controls, box3, margin = 1.35) {
  const size = new THREE.Vector3();
  box3.getSize(size);

  const center = new THREE.Vector3();
  box3.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera.fov * Math.PI) / 180.0;
  const dist = (maxDim * margin) / (2 * Math.tan(fov / 2));

  // Place camera at a corner-ish angle
  const dir = new THREE.Vector3(1, 0.8, 1).normalize();
  const newPos = center.clone().add(dir.multiplyScalar(dist));

  camera.position.copy(newPos);
  camera.near = Math.max(0.01, dist / 100);
  camera.far = dist * 100;
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.copy(center);
    controls.update();
  }

  return { center, dist };
}

/** Smooth fly animation helper */
function useFly(camera, controls) {
  const anim = useRef(null);

  useFrame((_, delta) => {
    if (!anim.current) return;
    const t = Math.min(1, (anim.current.t += delta / anim.current.dur));
    // smoothstep
    const s = t * t * (3 - 2 * t);

    camera.position.lerpVectors(anim.current.fromPos, anim.current.toPos, s);
    controls.target.lerpVectors(anim.current.fromTar, anim.current.toTar, s);
    controls.update();

    if (t >= 1) anim.current = null;
  });

  const flyTo = (toPos, toTar, dur = 0.8) => {
    anim.current = {
      fromPos: camera.position.clone(),
      fromTar: controls.target.clone(),
      toPos: toPos.clone(),
      toTar: toTar.clone(),
      t: 0,
      dur,
    };
  };

  return flyTo;
}

/* ---------------------------- Scene Components --------------------------- */

function Pergola({ config }) {
  const {
    span = 12,
    depth = 12,
    height = 10,
    style = "FreestandingMono",
    infill = "none",
    finish = "Black",
  } = config || {};

  const color = colorFromFinish(finish);
  const slatSpacing = spacingFromInfill(infill);

  /**
   * Geometry memo
   */
  const data = useMemo(() => {
    const posts = [];
    const beams = [];
    const slats = [];

    // Post positions (mono, 4-corners). AttachedMono omits the back row.
    const corners = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(span, 0, 0),
      ...(style === "AttachedMono" ? [] : [new THREE.Vector3(0, 0, depth), new THREE.Vector3(span, 0, depth)]),
    ];

    corners.forEach((p) => posts.push({ pos: new THREE.Vector3(p.x, height / 2, p.z), size: new THREE.Vector3(POST_SIZE, height, POST_SIZE) }));

    // Perimeter beams (top rectangle). AttachedMono omits the back beam.
    const Y = height;
    beams.push(
      { from: new THREE.Vector3(0, Y, 0), to: new THREE.Vector3(span, Y, 0) }, // front X
    );
    if (style !== "AttachedMono") {
      beams.push({ from: new THREE.Vector3(0, Y, depth), to: new THREE.Vector3(span, Y, depth) }); // back X
      beams.push({ from: new THREE.Vector3(0, Y, 0), to: new THREE.Vector3(0, Y, depth) }); // left Z
      beams.push({ from: new THREE.Vector3(span, Y, 0), to: new THREE.Vector3(span, Y, depth) }); // right Z
    } else {
      // for attached, still draw left/right beam from wall (z=0) to front (z=0)
      beams.push({ from: new THREE.Vector3(0, Y, 0), to: new THREE.Vector3(0, Y, POST_SIZE * 0.5) });
      beams.push({ from: new THREE.Vector3(span, Y, 0), to: new THREE.Vector3(span, Y, POST_SIZE * 0.5) });
    }

    // Slats along X, sitting on top, spanning front->back (Z)
    if (slatSpacing) {
      const pad = BEAM_SIZE * 0.5 + POST_SIZE * 0.5;
      for (let x = pad; x <= span - pad + 1e-5; x += slatSpacing) {
        const from = new THREE.Vector3(x, Y + BEAM_SIZE * 0.6, 0);
        const to = new THREE.Vector3(x, Y + BEAM_SIZE * 0.6, Math.max(depth, POST_SIZE * 0.8));
        slats.push({ from, to });
      }
    }

    return { posts, beams, slats };
  }, [config, span, depth, height, style, infill, finish]);

  return (
    <group>
      {/* posts */}
      {data.posts.map((p, i) => (
        <mesh key={`post-${i}`} position={p.pos} castShadow receiveShadow>
          <boxGeometry args={[p.size.x, p.size.y, p.size.z]} />
          <meshStandardMaterial color={color} roughness={0.75} metalness={finish === "HDG" ? 0.55 : 0.15} />
        </mesh>
      ))}

      {/* beams */}
      {data.beams.map((b, i) => {
        const dir = new THREE.Vector3().subVectors(b.to, b.from);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(b.from, b.to).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.clone().normalize());
        return (
          <mesh key={`beam-${i}`} position={mid} quaternion={quat} castShadow receiveShadow>
            <boxGeometry args={[len, BEAM_SIZE, BEAM_SIZE]} />
            <meshStandardMaterial color={color} roughness={0.75} metalness={finish === "HDG" ? 0.55 : 0.15} />
          </mesh>
        );
      })}

      {/* slats */}
      {data.slats.map((s, i) => {
        const dir = new THREE.Vector3().subVectors(s.to, s.from);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(s.from, s.to).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
        return (
          <mesh key={`slat-${i}`} position={mid} quaternion={quat} castShadow receiveShadow>
            <boxGeometry args={[BEAM_SIZE * 0.8, BEAM_SIZE * 0.45, len]} />
            <meshStandardMaterial color={color} roughness={0.8} metalness={finish === "HDG" ? 0.45 : 0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

/* -------- Safe client-only HTML overlay (no document on SSR) -------- */

function HtmlOverlay({ children }) {
  const { gl } = useThree();
  const [el, setEl] = useState(null);

  // Create the element only on the client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const div = document.createElement("div");
    setEl(div);
  }, []);

  // Attach to the canvas parent
  useEffect(() => {
    if (!el) return;
    const parent = gl.domElement.parentNode;
    if (!parent) return;

    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.bottom = "10px";
    el.style.transform = "translateX(-50%)";
    el.style.pointerEvents = "none";
    el.style.zIndex = "1";

    parent.appendChild(el);
    return () => {
      try {
        parent.removeChild(el);
      } catch {}
    };
  }, [gl, el]);

  if (!el) return null;
  return createPortal(children, el);
}

/* ------------------------------- R3F Scene ------------------------------- */

function Scene({ config }) {
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera, gl, size } = useThree();
  const flyTo = useFly(camera, controlsRef.current ?? { target: new THREE.Vector3(), update() {} });

  // Initial frame when ready or config changes
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    fitCameraToBox(camera, controlsRef.current, box, 1.4);
    gl.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  }, [camera, gl, size.width, size.height, config]);

  // Control buttons
  const onFront = () => {
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const { center, dist } = fitCameraToBox(camera, controlsRef.current, box, 1.2);
    const pos = center.clone().add(new THREE.Vector3(0, dist * 0.35, dist));
    flyTo(pos, center);
  };
  const onCorner = () => {
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const { center, dist } = fitCameraToBox(camera, controlsRef.current, box, 1.2);
    const pos = center.clone().add(new THREE.Vector3(dist, dist * 0.55, dist));
    flyTo(pos, center);
  };
  const onTop = () => {
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const { center, dist } = fitCameraToBox(camera, controlsRef.current, box, 1.2);
    const pos = center.clone().add(new THREE.Vector3(0.001, dist * 1.6, 0.001));
    flyTo(pos, center);
  };
  const onReset = () => {
    const box = new THREE.Box3().setFromObject(groupRef.current);
    fitCameraToBox(camera, controlsRef.current, box, 1.35);
  };

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        intensity={0.9}
        position={[15, 25, 20]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group ref={groupRef} position={[0, 0, 0]}>
        <Pergola config={config} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} />

      {/* Overlay buttons */}
      <HtmlOverlay>
        <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
          {[
            ["Front", onFront],
            ["Corner", onCorner],
            ["Top", onTop],
            ["Reset", onReset],
          ].map(([label, fn]) => (
            <button
              key={label}
              onClick={fn}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,.12)",
                background: "rgba(255,255,255,.9)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </HtmlOverlay>
    </>
  );
}

/* ------------------------------ Public Viewer ---------------------------- */

export default function Viewer3D({ config }) {
  // Safe defaults in case parent omits some fields
  const safe = {
    span: 12,
    depth: 12,
    height: 10,
    bays: 1,
    style: "FreestandingMono",
    infill: "none",
    finish: "Black",
    ...(config || {}),
  };

  return (
    <div style={{ width: "100%", height: 520, position: "relative", borderRadius: 12, overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ fov: 45, near: 0.1, far: 1000, position: [safe.span * 0.8, safe.height * 0.7, safe.depth * 1.4] }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#f7f8fa"]} />
        <Scene config={safe} />
      </Canvas>
    </div>
  );
}
