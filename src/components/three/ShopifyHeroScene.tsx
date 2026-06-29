"use client";

import { useMemo, useRef, type ComponentProps } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three/webgpu";

/**
 * Unified WebGPU renderer with automatic WebGL fallback.
 * WebGPURenderer uses a WebGL2 backend when WebGPU is unavailable,
 * so older browsers keep working without any code changes.
 */
function createRenderer(props: { canvas: HTMLCanvasElement }) {
  const renderer = new THREE.WebGPURenderer({
    canvas: props.canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  return renderer.init().then(() => renderer);
}

type GLFactory = NonNullable<ComponentProps<typeof Canvas>["gl"]>;

// ── Shared "shot cycle" so flash → tracer → impact stay in sync ──
const SHOT_PERIOD = 3.6; // full loop, seconds
const FLASH_DUR = 0.14; // muzzle flash window
const TRAVEL_DUR = 0.42; // bullet flight time
const RIPPLE_DUR = 0.75; // impact ripple time

const MUZZLE = new THREE.Vector3(-0.45, 0.0, 0.12);
const IMPACT = new THREE.Vector3(2.3, -0.4, -0.6);

const smooth = (current: number, target: number, f: number) => current + (target - current) * f;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const gunMetal = "#9499a6";
const polymer = "#2c2f36";
const polymerDark = "#212329";

/** Concentric target rings with a synced impact ripple. */
function Target() {
  const spin = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (spin.current) spin.current.rotation.y = Math.sin(t * 0.25) * 0.12;

    const phase = t % SHOT_PERIOD;
    const hit = phase - TRAVEL_DUR;
    const active = hit > 0 && hit < RIPPLE_DUR;
    const ht = active ? easeOut(clamp01(hit / RIPPLE_DUR)) : 0;

    if (ripple.current) {
      const mat = ripple.current.material as THREE.MeshBasicMaterial;
      ripple.current.visible = active;
      const s = 0.3 + ht * 1.6;
      ripple.current.scale.set(s, s, s);
      mat.opacity = active ? (1 - ht) * 0.85 : 0;
    }
    if (core.current) {
      core.current.emissiveIntensity = 1.4 + (active ? (1 - ht) * 2.5 : 0);
    }
  });

  const rings = [1.25, 1.0, 0.75, 0.5];
  return (
    <group position={[2.4, -0.4, -0.6]} scale={0.85}>
      <group ref={spin}>
        {rings.map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, i * 0.015]}>
            <torusGeometry args={[r, 0.018, 20, 80]} />
            <meshStandardMaterial
              color={i === 0 ? "#e0aa4e" : "#c9ccd2"}
              emissive={i === 0 ? "#e0aa4e" : "#1a1c20"}
              emissiveIntensity={i === 0 ? 0.9 : 0.15}
              metalness={0.95}
              roughness={0.25}
            />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.08]}>
          <circleGeometry args={[0.16, 48]} />
          <meshStandardMaterial ref={core} color="#e0aa4e" emissive="#e0aa4e" emissiveIntensity={1.4} metalness={1} roughness={0.15} />
        </mesh>
      </group>
      {/* impact ripple */}
      <mesh ref={ripple} position={[0, 0, 0.12]} visible={false}>
        <ringGeometry args={[0.16, 0.2, 64]} />
        <meshBasicMaterial color="#ffd98a" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Stylised rifle silhouette with recoil and muzzle flash. */
function Rifle() {
  const recoil = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Group>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const flashLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const phase = clock.elapsedTime % SHOT_PERIOD;
    const amt = phase < FLASH_DUR ? 1 - phase / FLASH_DUR : 0;

    if (recoil.current) recoil.current.position.x = -amt * 0.14;
    if (flash.current) {
      flash.current.visible = amt > 0.01;
      const s = 0.4 + amt * 1.1;
      flash.current.scale.set(s * (1 + Math.random() * 0.15), s, s);
    }
    if (flashMat.current) flashMat.current.opacity = amt;
    if (flashLight.current) flashLight.current.intensity = amt * 7;
  });

  return (
    <group position={[-2.0, -0.2, 0.2]} rotation={[0, 0, 0.1]} scale={1.1}>
      <group ref={recoil}>
        {/* ── upper receiver ── */}
        <mesh position={[-0.05, 0.06, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.17]} />
          <meshStandardMaterial color={gunMetal} metalness={0.65} roughness={0.42} emissive="#3a3d46" emissiveIntensity={0.35} />
        </mesh>
        {/* lower receiver / mag well */}
        <mesh position={[-0.12, -0.09, 0]}>
          <boxGeometry args={[0.5, 0.17, 0.155]} />
          <meshStandardMaterial color="#7a7f8c" metalness={0.6} roughness={0.45} emissive="#2a2d33" emissiveIntensity={0.3} />
        </mesh>
        {/* picatinny top rail */}
        <mesh position={[0.0, 0.18, 0]}>
          <boxGeometry args={[1.05, 0.035, 0.075]} />
          <meshStandardMaterial color="#6a6f7b" metalness={0.6} roughness={0.5} />
        </mesh>
        {[-0.4, -0.25, -0.1, 0.05, 0.2, 0.35, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.205, 0]}>
            <boxGeometry args={[0.02, 0.03, 0.08]} />
            <meshStandardMaterial color="#2b2e34" metalness={0.8} roughness={0.5} />
          </mesh>
        ))}

        {/* handguard (matte polymer) */}
        <mesh position={[0.62, 0.05, 0]}>
          <boxGeometry args={[0.62, 0.17, 0.16]} />
          <meshStandardMaterial color={polymer} metalness={0.2} roughness={0.8} emissive="#15161a" emissiveIntensity={0.25} />
        </mesh>
        {/* handguard vent slots */}
        {[0.45, 0.6, 0.75].map((x) => (
          <mesh key={x} position={[x, 0.05, 0.082]}>
            <boxGeometry args={[0.05, 0.1, 0.01]} />
            <meshStandardMaterial color="#0c0d10" metalness={0.2} roughness={0.9} />
          </mesh>
        ))}

        {/* barrel */}
        <mesh position={[1.15, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.034, 0.034, 0.5, 28]} />
          <meshStandardMaterial color="#b4b9c4" metalness={0.7} roughness={0.3} emissive="#2a2d33" emissiveIntensity={0.25} />
        </mesh>
        {/* gas block */}
        <mesh position={[0.98, 0.12, 0]}>
          <boxGeometry args={[0.1, 0.12, 0.1]} />
          <meshStandardMaterial color="#8a8f9c" metalness={0.65} roughness={0.4} />
        </mesh>
        {/* front sight post */}
        <mesh position={[0.98, 0.22, 0]}>
          <boxGeometry args={[0.03, 0.1, 0.05]} />
          <meshStandardMaterial color="#6a6f7b" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* muzzle device / flash hider */}
        <mesh position={[1.46, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.052, 0.052, 0.14, 20]} />
          <meshStandardMaterial color="#44474f" metalness={0.7} roughness={0.45} />
        </mesh>

        {/* charging handle */}
        <mesh position={[-0.42, 0.16, 0]}>
          <boxGeometry args={[0.12, 0.05, 0.12]} />
          <meshStandardMaterial color="#6a6f7b" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* rear sight */}
        <mesh position={[-0.3, 0.2, 0]}>
          <boxGeometry args={[0.06, 0.07, 0.09]} />
          <meshStandardMaterial color="#5a5f6b" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* ejection port */}
        <mesh position={[0.1, 0.06, 0.088]}>
          <boxGeometry args={[0.2, 0.09, 0.012]} />
          <meshStandardMaterial color={polymerDark} metalness={0.5} roughness={0.5} />
        </mesh>

        {/* trigger guard */}
        <mesh position={[-0.1, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.016, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#5a5f6b" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* trigger */}
        <mesh position={[-0.1, -0.18, 0]}>
          <boxGeometry args={[0.025, 0.07, 0.03]} />
          <meshStandardMaterial color={polymerDark} metalness={0.5} roughness={0.6} />
        </mesh>

        {/* pistol grip (polymer) */}
        <mesh position={[-0.28, -0.3, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.13, 0.36, 0.13]} />
          <meshStandardMaterial color={polymer} metalness={0.2} roughness={0.85} emissive="#15161a" emissiveIntensity={0.25} />
        </mesh>

        {/* curved magazine (two angled segments) */}
        <mesh position={[0.0, -0.42, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.2, 0.42, 0.14]} />
          <meshStandardMaterial color={polymer} metalness={0.2} roughness={0.85} emissive="#15161a" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.12, -0.72, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.2, 0.34, 0.14]} />
          <meshStandardMaterial color={polymer} metalness={0.2} roughness={0.85} emissive="#15161a" emissiveIntensity={0.25} />
        </mesh>

        {/* buttstock */}
        <mesh position={[-0.62, 0.02, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.14]} />
          <meshStandardMaterial color="#6a6f7b" metalness={0.55} roughness={0.5} />
        </mesh>
        <mesh position={[-0.85, -0.04, 0]}>
          <boxGeometry args={[0.28, 0.26, 0.14]} />
          <meshStandardMaterial color={polymer} metalness={0.2} roughness={0.85} emissive="#15161a" emissiveIntensity={0.25} />
        </mesh>
        {/* cheek riser */}
        <mesh position={[-0.82, 0.12, 0]}>
          <boxGeometry args={[0.34, 0.05, 0.12]} />
          <meshStandardMaterial color={polymerDark} metalness={0.3} roughness={0.8} />
        </mesh>

        {/* subtle gold accent on receiver */}
        <mesh position={[-0.05, 0.155, 0.088]}>
          <boxGeometry args={[0.5, 0.018, 0.005]} />
          <meshStandardMaterial color="#e0aa4e" emissive="#e0aa4e" emissiveIntensity={0.7} metalness={1} roughness={0.2} />
        </mesh>

        {/* muzzle flash */}
        <group ref={flash} position={[1.6, 0.06, 0]} visible={false}>
          <pointLight ref={flashLight} color="#ffd07a" intensity={0} distance={4} />
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.22, 0.5, 12]} />
            <meshBasicMaterial ref={flashMat} color="#ffe6a8" transparent opacity={0} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#fff2cc" transparent opacity={0.85} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Brass cartridge — tumbling accent in the upper-left. */
function Cartridge() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.9;
    group.current.rotation.x = Math.sin(t * 0.6) * 0.5;
    group.current.rotation.z = -0.4 + Math.cos(t * 0.7) * 0.25;
    group.current.position.y = 1.0 + Math.sin(t * 0.8) * 0.12;
    group.current.position.x = -2.95 + Math.sin(t * 0.4) * 0.06;
  });

  return (
    <group ref={group} position={[-2.95, 1.05, 0.5]} scale={0.72}>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.95, 48]} />
        <meshStandardMaterial color="#f0c560" metalness={0.85} roughness={0.2} emissive="#6e521a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.73, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.06, 48]} />
        <meshStandardMaterial color="#b8923f" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.28, 48]} />
        <meshStandardMaterial color="#caa24a" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 48]} />
        <meshStandardMaterial color="#c87b46" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <coneGeometry args={[0.18, 0.28, 48]} />
        <meshStandardMaterial color="#d98a52" metalness={1} roughness={0.2} emissive="#7a3c12" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

/** Tracer round travelling from muzzle to target, synced to the shot cycle. */
function Tracer() {
  const dot = useRef<THREE.Mesh>(null);
  const trailMat = useRef<THREE.MeshBasicMaterial>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        MUZZLE.clone(),
        new THREE.Vector3(0.2, 0.05, -0.2),
        new THREE.Vector3(1.3, -0.1, -0.4),
        IMPACT.clone(),
      ]),
    [],
  );

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.012, 8, false), [curve]);

  useFrame(({ clock }) => {
    const phase = clock.elapsedTime % SHOT_PERIOD;
    const flying = phase < TRAVEL_DUR;
    const p = clamp01(phase / TRAVEL_DUR);

    if (dot.current) {
      dot.current.visible = flying;
      if (flying) {
        const pos = curve.getPointAt(easeOut(p));
        dot.current.position.copy(pos);
        const s = 0.07 + Math.sin(p * Math.PI) * 0.05;
        dot.current.scale.setScalar(s);
      }
    }
    if (trailMat.current) {
      trailMat.current.opacity = flying ? 0.12 + (1 - p) * 0.4 : 0.08;
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial ref={trailMat} color="#ffce7a" transparent opacity={0.1} />
      </mesh>
      <mesh ref={dot} visible={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#fff0c2" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

/** Lightweight drifting particle field (portable across WebGPU/WebGL). */
function Particles({ count = 110 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.elapsedTime * 0.02;
      const m = points.current.material as THREE.PointsMaterial;
      m.opacity = 0.22 + Math.sin(clock.elapsedTime * 0.5) * 0.07;
    }
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial size={0.03} color="#e0aa4e" transparent opacity={0.28} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Camera parallax driven by pointer and scroll. */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const scroll = useRef(0);

  useFrame(() => {
    if (typeof window !== "undefined") {
      scroll.current = window.scrollY || 0;
    }
    if (!group.current) return;
    const targetY = pointer.x * 0.22;
    const targetX = -pointer.y * 0.1 + Math.min(scroll.current / 4000, 0.25);
    group.current.rotation.y = smooth(group.current.rotation.y, targetY, 0.05);
    group.current.rotation.x = smooth(group.current.rotation.x, targetX, 0.05);
  });

  return <group ref={group}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight color="#dfe6ff" groundColor="#3a2f18" intensity={0.85} />
      {/* main front fill near camera so faces are clearly lit */}
      <pointLight position={[0, 0.6, 5.5]} intensity={2.6} color="#ffffff" distance={14} />
      <spotLight position={[5, 6, 6]} angle={0.5} penumbra={1} intensity={2.6} color="#fff4e0" />
      <spotLight position={[-5, 2, 4]} angle={0.6} intensity={1.4} color="#e0aa4e" />
      <pointLight position={[0, 0, 3]} intensity={1.3} color="#e0aa4e" />
      <pointLight position={[2, -2, 2]} intensity={0.7} color="#88aaff" />
      {/* key + rim lights for the rifle / cartridge on the left */}
      <pointLight position={[-2.2, 0.7, 3.2]} intensity={4.2} color="#fff2dc" distance={11} />
      <pointLight position={[-3.6, -0.5, -1.4]} intensity={3.2} color="#e0aa4e" distance={9} />
      <pointLight position={[-2.6, 1.6, 1.5]} intensity={2.4} color="#cfe0ff" distance={9} />
      <spotLight position={[-3.5, 2.5, 3]} angle={0.7} penumbra={1} intensity={2.2} color="#ffffff" />
      <ParallaxRig>
        <Rifle />
        <Target />
        <Tracer />
        <Cartridge />
        <Particles />
      </ParallaxRig>
    </>
  );
}

export function ShopifyHeroScene() {
  return (
    <div className="hero-3d-canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.75]}
        gl={createRenderer as unknown as GLFactory}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
