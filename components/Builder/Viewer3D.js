import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import * as ReactDOM from "react-dom";

// ====== Tunables ======
const POST_SIZE = 0.333;          // 4" ~ 0.333 ft
const BEAM_SIZE = 0.333;          // 4" beams
const SLAT_THICK = 0.125;         // ~1.5"
const SLAT_SPACING = {
  None: Infinity,
  SlatsOpen: 0.25 * 4,            // ~3" -> in ft
  SlatsMedium: 0.125 * 12,        // ~1.5"
  SlatsTight: 0.0833 * 12,        // ~1"
};
const COLORS = {
  Black: "#111111",
  White: "#f4f4f4",
  Bronze: "#3a2a1d",
  HDG: "#a8b1b6",                 // galvanized steel look
};

function materialForFinish(finish) {
  const color = COLORS[finish] || COLORS.Black;
  const metal = finish === "HDG" ? 0.9 : 0.1;
  const rough = finish === "HDG" ? 0.35 : 0.6;
  return new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough });
}

// ====== Geometry ======
function Posts({ config }) {
  const { span, depth, bays, height, style } = config;
  const mat = useMemo(() => materialForFinish(config.finish), [config.finish]);

  const positions = [];
  const bayCount = Math.max(1, bays || 1);
  const zSteps = bayCount === 1 ? [] : Array.from({ length: bayCount - 1 }, (_, i) => ((i + 1) * depth) / bayCount);

  if (style !== "AttachedMono") {
    positions.push([0, 0, 0], [span, 0, 0], [0, 0, depth], [span, 0, depth]);
    for (const z of zSteps) positions.push([0, 0, z], [span, 0, z]);
  } else {
    positions.push([0, 0, 0], [span, 0, 0]);
    for (const z of zSteps) positions.push([0, 0, z], [span, 0, z]);
  }

  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, POST_SIZE / 2 + y, z]} material={mat} castShadow receiveShadow>
          <boxGeometry args={[POST_SIZE, height, POST_SIZE]} />
        </mesh>
      ))}
    </group>
  );
}

function Frame({ config }) {
  const { span, depth, height } = config;
  const mat = useMemo(() => materialForFinish(config.finish), [config.finish]);
  const y = height + BEAM_SIZE / 2;

  const beams = [
    { pos: [span / 2, y, 0],     args: [span + BEAM_SIZE, BEAM_SIZE, BEAM_SIZE] },
    { pos: [span / 2, y, depth], args: [span + BEAM_SIZE, BEAM_SIZE, BEAM_SIZE] },
    { pos: [0, y, depth / 2],    args: [BEAM_SIZE, BEAM_SIZE, depth + BEAM_SIZE] },
    { pos: [span, y, depth / 2], args: [BEAM_SIZE, BEAM_SIZE, depth + BEAM_SIZE] },
  ];

  return (
    <group>
      {beams.map((b, i) => (
        <mesh key={i} position={b.pos} material={mat} castShadow receiveShadow>
          <boxGeometry args={b.args} />
        </mesh>
      ))}
    </group>
  );
}

function Slats({ config }) {
  const { span, depth, height, infill } = config;
  if (infill === "None") return null;
  const spacing = SLAT_SPACING[infill] ?? SLAT_SPACING.SlatsMedium;
  const mat = useMemo(() => materialForFinish(config.finish), [config.finish]);
  const y = height + BEAM_SIZE + SLAT_THICK / 2;

  const slats = [];
  for (let x = 0; x <= span; x += spacing) {
    slats.push(
      <mesh key={`s${x}`} position={[x, y, depth / 2]} material={mat} castShadow receiveShadow>
        <boxGeometry args={[SLAT_THICK, SLAT_THICK, depth - BEAM_SIZE * 1.25]} />
      </mesh>
    );
  }
  return <group>{slats}</group>;
}

// ====== Camera fit & API ======
function useFitCamera(config, controlsRef) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(config.span / 2, config.height / 2, config.depth / 2), [config]);

  useEffect(() => {
    const margin = 1.4;
    const fov = THREE.MathUtils.degToRad(Number(camera.fov || 50)); // <-- JS-safe
    const box = new THREE.Box3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(config.span, config.height + 2, config.depth)
    );
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);
    const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
    const dist = (maxDim / (2 * Math.tan(fov / 2))) * margin;

    const dir = new THREE.Vector3(-0.8, 0.6, 1.0).normalize();
    const newPos = target.clone().add(dir.multiplyScalar(dist));
    camera.position.copy(newPos);
    camera.near = 0.01;
    camera.far = Math.max(500, dist * 10);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.span, config.depth, config.height, size.width, size.height]);

  return target;
}

function ControlsExposed({ expose, controlsRef, targetRef }) {
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    const api = {
      setView: (view) => {
        const t = targetRef.current;
        const boxSize = Math.max(10, camera.position.distanceTo(t));
        if (view === "front") camera.position.set(t.x, t.y, t.z + boxSize);
        else if (view === "top") camera.position.set(t.x, t.y + boxSize, t.z);
        else if (view === "corner") camera.position.set(t.x + boxSize, t.y + boxSize * 0.6, t.z + boxSize);
        else if (view === "reset") { /* useFitCamera already frames */ }
        controlsRef.current?.target.copy(t);
        controlsRef.current?.update();
      },
      capture: async () => {
        // ensure the latest frame is drawn
        gl.render(scene, camera);
        return gl.domElement.toDataURL("image/jpeg", 0.92);
      },
    };
    if (typeof expose === "function") expose(api);
    return () => { if (typeof expose === "function") expose(null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expose]);

  return null;
}

// ====== Scene ======
function Scene({ config, expose }) {
  const controlsRef = useRef();
  const targetRef = useRef(new THREE.Vector3(config.span / 2, config.height / 2, config.depth / 2));
  const [interacted, setInteracted] = useState(false);

  const target = useFitCamera(config, controlsRef);
  useEffect(() => { targetRef.current.copy(target); }, [target]);

  useFrame(() => { controlsRef.current && controlsRef.current.update(); });

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#fafafa" roughness={1} metalness={0} />
      </mesh>

      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 15]} intensity={0.7} castShadow />
      <Environment preset="city" />

      {/* Model */}
      <group position={[0, POST_SIZE / 2, 0]}>
        <Posts config={config} />
        <Frame config={config} />
        <Slats config={config} />
      </group>

      <ContactShadows
        position={[config.span / 2, 0, config.depth / 2]}
        opacity={0.25}
        scale={Math.max(20, config.span + config.depth + 10)}
        blur={1.5}
        far={20}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={200}
        maxPolarAngle={Math.PI * 0.499}
        onStart={() => setInteracted(true)}
      />

      <ControlsExposed expose={expose} controlsRef={controlsRef} targetRef={targetRef} />

      {!interacted && (
        <HtmlOverlay>
          <div className="text-xs md:text-sm bg-white/90 backdrop-blur rounded-md border border-neutral-200 px-3 py-2 text-neutral-700 shadow-sm">
            Drag to rotate • Scroll to zoom • Right-click to pan
          </div>
        </HtmlOverlay>
      )}
    </>
  );
}

// Minimal HTML overlay helper using a portal
function HtmlOverlay({ children }) {
  const { gl } = useThree();
  const [el] = useState(() => document.createElement("div"));
  useEffect(() => {
    const parent = gl.domElement.parentNode;
    if (!parent) return;
    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "12px";
    el.style.transform = "translateX(-50%)";
    el.style.pointerEvents = "none";
    parent.appendChild(el);
    return () => { parent.removeChild(el); };
  }, [gl, el]);
  return ReactDOM.createPortal(children, el);
}

// ====== Public component ======
export default function Viewer3D({ config, expose }) {
  const safeConfig = useMemo(() => ({
    style: config?.style || "Mono",
    span: Number(config?.span || 12),
    depth: Number(config?.depth || 12),
    height: Number(config?.height || 10),
    bays: Number(config?.bays || 1),
    infill: config?.infill || "None",
    finish: config?.finish || "Black",
    anchor: config?.anchor || "Slab",
  }), [config]);

  const [ready, setReady] = useState(false);

  return (
    <div className="w-full h-full relative">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-neutral-500 text-sm">
          Loading 3D…
        </div>
      )}
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}   // helps reliable snapshots
        onCreated={() => setReady(true)}
        camera={{ fov: 50, near: 0.01, far: 1000 }}
      >
        <Scene config={safeConfig} expose={expose} />
      </Canvas>
    </div>
  );
}
