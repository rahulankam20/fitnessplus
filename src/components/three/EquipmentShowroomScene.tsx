"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import Dumbbell from "./Dumbbell";
import Kettlebell from "./Kettlebell";
import Barbell from "./Barbell";

// ============================================
// Equipment Showroom Scene — Premium Upgrade
// Per-equipment lighting, transition animations,
// animated spec rings, training mode badges
// ============================================

// ============================================
// Pedestal
// ============================================

function ShowroomPedestal({ color }: { color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    const mat = ringRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.2 + Math.sin(t * 1.8) * 0.5;
  });

  return (
    <group position={[0, -0.68, 0]}>
      {/* Dark base disc */}
      <mesh>
        <cylinderGeometry args={[1.55, 1.65, 0.1, 56]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.88} roughness={0.32} />
      </mesh>

      {/* Outer edge bevel */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[1.65, 1.7, 0.04, 56]} />
        <meshStandardMaterial color="#141414" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Pulsing neon ring */}
      <mesh ref={ringRef} position={[0, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.53, 0.022, 8, 56]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ============================================
// Spec Orbit Rings — animated callout rings
// ============================================

function SpecRings({ color }: { color: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.y = t * 0.25;
      const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(t * 1.5) * 0.06;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.z = t * 0.35;
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.2 + 1) * 0.04;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.2;
      ring3Ref.current.rotation.z = -t * 0.28;
      const mat = ring3Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(t * 0.9 + 2) * 0.03;
    }
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.008, 6, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.2, 0.006, 6, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.6, 0.005, 6, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ============================================
// Per-equipment dynamic lighting
// ============================================

function EquipmentLighting({ type }: { type: "dumbbell" | "kettlebell" | "barbell" }) {
  const rimRef = useRef<THREE.PointLight>(null);
  const copperRef = useRef<THREE.PointLight>(null);

  const configs = {
    barbell: {
      // Industrial white + intense red
      key: { color: "#f5f5f5", intensity: 30, pos: [4, 6, 4] as [number, number, number] },
      rim: { color: "#ff0000", intensity: 35, pos: [-5, 3, -3] as [number, number, number] },
      copper: { color: "#b87333", intensity: 8, pos: [0, -2, 3] as [number, number, number] },
      ambient: "#220000" as const,
    },
    dumbbell: {
      // Chrome cool-white + low red glow
      key: { color: "#d0e8ff", intensity: 22, pos: [3, 5, 4] as [number, number, number] },
      rim: { color: "#cc2200", intensity: 18, pos: [-4, 2, -3] as [number, number, number] },
      copper: { color: "#6688ff", intensity: 5, pos: [0, -2, 3] as [number, number, number] },
      ambient: "#111122" as const,
    },
    kettlebell: {
      // Functional training amber/red light
      key: { color: "#ffe0aa", intensity: 24, pos: [3, 5, 4] as [number, number, number] },
      rim: { color: "#ff6600", intensity: 28, pos: [-4, 2, -3] as [number, number, number] },
      copper: { color: "#d97706", intensity: 12, pos: [0, -2, 3] as [number, number, number] },
      ambient: "#221100" as const,
    },
  }[type];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (rimRef.current) {
      // Pulsing rim
      rimRef.current.intensity = configs.rim.intensity * (0.85 + Math.sin(t * 1.8) * 0.2);
    }
    if (copperRef.current) {
      copperRef.current.intensity = configs.copper.intensity * (0.8 + Math.sin(t * 1.2) * 0.25);
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} color={configs.ambient} />
      <directionalLight
        position={configs.key.pos}
        intensity={configs.key.intensity}
        color={configs.key.color}
      />
      <pointLight
        ref={rimRef}
        position={configs.rim.pos}
        intensity={configs.rim.intensity}
        color={configs.rim.color}
        distance={18}
        decay={2}
      />
      <pointLight
        ref={copperRef}
        position={configs.copper.pos}
        intensity={configs.copper.intensity}
        color={configs.copper.color}
        distance={10}
        decay={2}
      />
      {/* Top spotlight */}
      <spotLight
        position={[0, 8, 0]}
        intensity={16}
        angle={0.38}
        penumbra={0.9}
        color="#ffffff"
        distance={20}
        decay={2}
      />
    </>
  );
}

// ============================================
// Equipment color config
// ============================================

const EQUIPMENT_CONFIG = {
  barbell: { ringColor: "#dc2626", accentColor: "#ff0000" },
  dumbbell: { ringColor: "#4488ff", accentColor: "#3366cc" },
  kettlebell: { ringColor: "#f59e0b", accentColor: "#d97706" },
};

// ============================================
// Main Scene
// ============================================

interface ShowroomSceneProps {
  activeItem: "dumbbell" | "kettlebell" | "barbell";
}

export default function EquipmentShowroomScene({ activeItem }: ShowroomSceneProps) {
  const config = EQUIPMENT_CONFIG[activeItem];

  return (
    <div className="w-full h-full relative aspect-square md:aspect-video rounded-2xl overflow-hidden border border-white/5"
      style={{ background: "#030303" }}
    >
      <Canvas
        camera={{ position: [0, 0.6, 3.8], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 5, 14]} />

          {/* Dynamic per-equipment lighting */}
          <EquipmentLighting type={activeItem} />

          {/* Pedestal — glows with equipment color */}
          <ShowroomPedestal color={config.ringColor} />

          {/* Animated orbit spec rings */}
          <SpecRings color={config.accentColor} />

          {/* Equipment — keyed by activeItem for remount transition */}
          {activeItem === "dumbbell" && (
            <Dumbbell key="dumbbell" scale={1.35} position={[0, 0.28, 0]} />
          )}
          {activeItem === "kettlebell" && (
            <Kettlebell key="kettlebell" scale={1.45} position={[0, 0.38, 0]} />
          )}
          {activeItem === "barbell" && (
            <Barbell key="barbell" scale={0.88} position={[0, 0.3, 0]} isHero={false} />
          )}

          {/* Orbit controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2.0}
            maxDistance={6.5}
            maxPolarAngle={Math.PI / 2 - 0.04}
            autoRotate={true}
            autoRotateSpeed={0.65}
          />

          <Preload all />
        </Suspense>
      </Canvas>

      {/* HUD corner decorations */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/10 pointer-events-none z-10" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/10 pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/10 pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/10 pointer-events-none z-10" />

      {/* Equipment label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-white/20">
          3D_{activeItem.toUpperCase()}_RENDER
        </span>
      </div>

      {/* Glow ring accent on canvas edge matching equipment color */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
        style={{
          boxShadow: `inset 0 0 40px ${config.ringColor}10, 0 0 30px ${config.ringColor}08`,
        }}
      />
    </div>
  );
}
