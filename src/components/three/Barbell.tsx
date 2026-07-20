"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

// ============================================
// Barbell — Cinematic Olympic Barbell
// Canonical R3F: JSX materials, mesh refs for animation in useFrame
// ============================================

interface PlateStackProps {
  side: 1 | -1;
  assemblyOffset?: number; // 0 = assembled, 1 = plates displaced off-screen
}

function PlateStack({ side, assemblyOffset = 0 }: PlateStackProps) {
  const groupRef = useRef<THREE.Group>(null);
  // Ref to the ring mesh so we can animate emissive in useFrame
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Plate assembly: lerp to target position
    const targetX = side * assemblyOffset * 5.0;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.08
    );

    // Pulse emissive — safe: meshRef.current.material in useFrame
    if (ringRef.current) {
      const t = state.clock.getElapsedTime();
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.sin(t * 2.2) * 0.25;
    }
  });

  const baseX = side * 1.5;

  return (
    <group ref={groupRef}>
      {/* Inner collar */}
      <mesh position={[baseX - side * 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.055, 32]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.96} roughness={0.1} envMapIntensity={1.2} />
      </mesh>

      {/* Plate 1 — 20kg heavy */}
      <mesh position={[baseX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.46, 0.46, 0.11, 56]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} envMapIntensity={1.0} />
      </mesh>

      {/* Plate 1 red ring — emissive glow */}
      <mesh ref={ringRef} position={[baseX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.46, 0.013, 8, 56]} />
        <meshStandardMaterial color="#dc2626" metalness={0.85} roughness={0.18} emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>

      {/* Plate 2 — 15kg */}
      <mesh position={[baseX + side * 0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.09, 48]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
      </mesh>

      {/* Plate 3 — 10kg */}
      <mesh position={[baseX + side * 0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.07, 48]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
      </mesh>

      {/* Outer lock collar */}
      <mesh position={[baseX + side * 0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 0.065, 32]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.96} roughness={0.1} />
      </mesh>

      {/* End cap — red dot */}
      <mesh position={[baseX + side * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 32]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ============================================
// Main Barbell export
// ============================================

interface BarbellProps extends React.ComponentPropsWithoutRef<"group"> {
  scrollRef?: React.RefObject<number>;
  assemblyProgress?: number; // 0 = plates scattered, 1 = fully assembled
  isHero?: boolean;
}

export default function Barbell({
  scrollRef,
  assemblyProgress = 1,
  isHero = false,
  ...props
}: BarbellProps) {
  const groupRef = useRef<THREE.Group>(null);
  // Ref to neon mesh for pulsing emissive in useFrame
  const neonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    if (isHero) {
      const baseY = ((props.position as number[])?.[1] ?? 0);
      const floatAmp = Math.max(0, 1 - scroll * 4) * 0.18;
      groupRef.current.position.y =
        baseY + Math.sin(t * 0.7) * floatAmp - scroll * 0.5;

      const rotSpeed = 0.18 + scroll * 0.6;
      groupRef.current.rotation.y = t * rotSpeed;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.04 + scroll * 0.25;
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;

      const resolveScale = 1 - Math.max(0, (scroll - 0.7) * 0.3);
      groupRef.current.scale.setScalar(resolveScale);
    } else {
      // Showroom hover
      groupRef.current.position.y =
        ((props.position as number[])?.[1] ?? 0) + Math.sin(t * 0.8) * 0.05;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    }

    // Neon pulse — safe: meshRef.current.material in useFrame
    if (neonRef.current) {
      const scroll2 = scrollRef?.current ?? 0;
      (neonRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.6 + Math.sin(t * 2.5) * 0.35 + scroll2 * 0.8;
    }
  });

  const plateOffset = Math.max(0, 1 - assemblyProgress);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* ===== Bar ===== */}
      <group>
        {/* Main chrome shaft */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.046, 0.046, 3.8, 36]} />
          <meshStandardMaterial color="#e8ecf0" metalness={0.97} roughness={0.08} envMapIntensity={1.5} />
        </mesh>

        {/* Center knurl grip */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.052, 0.052, 0.9, 36]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.55} />
        </mesh>

        {/* Left sleeve */}
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 32]} />
          <meshStandardMaterial color="#e8ecf0" metalness={0.97} roughness={0.08} />
        </mesh>

        {/* Right sleeve */}
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 32]} />
          <meshStandardMaterial color="#e8ecf0" metalness={0.97} roughness={0.08} />
        </mesh>
      </group>

      {/* ===== Plates ===== */}
      <PlateStack side={-1} assemblyOffset={plateOffset} />
      <PlateStack side={1} assemblyOffset={plateOffset} />

      {/* ===== Support Rack (showroom only) ===== */}
      {!isHero && (
        <group position={[0, -0.65, 0]}>
          <mesh>
            <boxGeometry args={[2.4, 0.08, 0.42]} />
            <meshStandardMaterial color="#111111" metalness={0.82} roughness={0.38} />
          </mesh>

          {/* Left stand */}
          <mesh position={[-0.95, 0.32, 0]}>
            <boxGeometry args={[0.08, 0.65, 0.08]} />
            <meshStandardMaterial color="#111111" metalness={0.82} roughness={0.38} />
          </mesh>
          <mesh position={[-0.95, 0.65, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.13, 0.045, 0.13]} />
            <meshStandardMaterial color="#111111" metalness={0.82} roughness={0.38} />
          </mesh>

          {/* Right stand */}
          <mesh position={[0.95, 0.32, 0]}>
            <boxGeometry args={[0.08, 0.65, 0.08]} />
            <meshStandardMaterial color="#111111" metalness={0.82} roughness={0.38} />
          </mesh>
          <mesh position={[0.95, 0.65, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.13, 0.045, 0.13]} />
            <meshStandardMaterial color="#111111" metalness={0.82} roughness={0.38} />
          </mesh>

          {/* Neon brand line */}
          <mesh ref={neonRef} position={[0, 0, 0.215]}>
            <boxGeometry args={[2.2, 0.016, 0.006]} />
            <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}
