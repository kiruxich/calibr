"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars, MeshDistortMaterial, Environment } from "@react-three/drei";
import type { Group, Mesh } from "three";

function useMouseParallax(factor = 0.15) {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.x * factor - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-pointer.y * factor * 0.5 - group.current.rotation.x) * 0.05;
  });

  return group;
}

function TargetRings() {
  const group = useMouseParallax(0.2);

  return (
    <group ref={group} position={[0.8, 0, 0]}>
      {[1.2, 0.95, 0.7, 0.45].map((scale, i) => (
        <mesh key={scale} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, i * 0.02]}>
          <torusGeometry args={[scale, 0.012, 16, 64]} />
          <meshStandardMaterial
            color={i === 0 ? "#d4a853" : "#888"}
            emissive={i === 0 ? "#d4a853" : "#333"}
            emissiveIntensity={i === 0 ? 0.8 : 0.1}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#d4a853" emissive="#d4a853" emissiveIntensity={1.2} metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

function CoreSphere() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={ref} position={[-0.6, 0.1, 0]}>
        <icosahedronGeometry args={[0.55, 4]} />
        <MeshDistortMaterial
          color="#1a1a1a"
          emissive="#d4a853"
          emissiveIntensity={0.15}
          metalness={0.95}
          roughness={0.15}
          distort={0.25}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  return (
    <>
      <Sparkles count={80} scale={8} size={1.5} speed={0.3} opacity={0.35} color="#d4a853" />
      <Sparkles count={40} scale={6} size={1} speed={0.2} opacity={0.2} color="#ffffff" />
      <Stars radius={50} depth={30} count={1200} factor={2} saturation={0} fade speed={0.5} />
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4, 14]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[5, 5, 5]} angle={0.4} penumbra={1} intensity={1.2} color="#fff8ee" />
      <spotLight position={[-4, 2, 3]} angle={0.5} intensity={0.6} color="#d4a853" />
      <pointLight position={[0, 0, 2]} intensity={0.4} color="#d4a853" />
      <Environment preset="city" />
      <CoreSphere />
      <TargetRings />
      <ParticleField />
    </>
  );
}

export function ShopifyHeroScene() {
  return (
    <div className="hero-3d-canvas" aria-hidden>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}

export function ScrollScene3D() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--bg-elevated)] sm:h-[480px]">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            Загрузка…
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
          <Scene />
        </Canvas>
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-transparent to-transparent" />
    </div>
  );
}
