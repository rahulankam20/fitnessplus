"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

// ============================================
// Barbell - Realistic 3D Olympic Barbell on a rack
// Built using primitives (cylinders + boxes)
// ============================================

function PlateStack({ side }: { side: 1 | -1 }) {
  const baseX = side * 1.5;
  const plateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1e1e1e"),
        metalness: 0.8,
        roughness: 0.35,
      }),
    []
  );

  const collarMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d0d0d0"),
        metalness: 0.95,
        roughness: 0.15,
      }),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff0000"),
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color("#ff0000"),
        emissiveIntensity: 0.3,
      }),
    []
  );

  return (
    <group>
      {/* Inner collar */}
      <mesh position={[baseX - side * 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={collarMaterial}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
      </mesh>

      {/* Plate 1 (Heavy 20kg) */}
      <mesh position={[baseX, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateMaterial}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 48]} />
      </mesh>
      {/* Plate 1 edge ring */}
      <mesh position={[baseX, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ringMaterial}>
        <torusGeometry args={[0.45, 0.012, 8, 48]} />
      </mesh>

      {/* Plate 2 (Medium 15kg) */}
      <mesh position={[baseX + side * 0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateMaterial}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 48]} />
      </mesh>

      {/* Plate 3 (Small 10kg) */}
      <mesh position={[baseX + side * 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateMaterial}>
        <cylinderGeometry args={[0.3, 0.3, 0.07, 48]} />
      </mesh>

      {/* Outer lock collar */}
      <mesh position={[baseX + side * 0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={collarMaterial}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 32]} />
      </mesh>

      {/* End cap red dot */}
      <mesh position={[baseX + side * 0.315, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ringMaterial}>
        <cylinderGeometry args={[0.055, 0.055, 0.01, 32]} />
      </mesh>
    </group>
  );
}

export default function Barbell(props: React.JSX.IntrinsicElements["group"]) {
  const groupRef = useRef<THREE.Group>(null);

  const barMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e2e8f0"),
        metalness: 0.95,
        roughness: 0.1,
      }),
    []
  );

  const rackMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#121212"),
        metalness: 0.8,
        roughness: 0.4,
      }),
    []
  );

  const neonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff0000"),
        emissive: new THREE.Color("#ff0000"),
        emissiveIntensity: 0.6,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow hovering animation in showroom
    groupRef.current.position.y = ((props.position as number[])?.[1] ?? 0) + Math.sin(t * 0.8) * 0.05;
    // Add subtle yaw/pitch rotations
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* 3D Barbell */}
      <group>
        {/* Main Shaft (Knurled Bar) */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={barMaterial}>
          <cylinderGeometry args={[0.045, 0.045, 3.6, 32]} />
        </mesh>

        {/* Weights on Left & Right */}
        <PlateStack side={-1} />
        <PlateStack side={1} />
      </group>

      {/* Sleek Support Rack */}
      <group position={[0, -0.6, 0]}>
        {/* Horizontal base */}
        <mesh material={rackMaterial}>
          <boxGeometry args={[2.2, 0.08, 0.4]} />
        </mesh>

        {/* Left vertical stand */}
        <mesh position={[-0.9, 0.3, 0]} material={rackMaterial}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
        </mesh>
        {/* Left hook */}
        <mesh position={[-0.9, 0.6, 0]} rotation={[0, 0, Math.PI / 4]} material={rackMaterial}>
          <boxGeometry args={[0.12, 0.04, 0.12]} />
        </mesh>

        {/* Right vertical stand */}
        <mesh position={[0.9, 0.3, 0]} material={rackMaterial}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
        </mesh>
        {/* Right hook */}
        <mesh position={[0.9, 0.6, 0]} rotation={[0, 0, -Math.PI / 4]} material={rackMaterial}>
          <boxGeometry args={[0.12, 0.04, 0.12]} />
        </mesh>

        {/* Glowing Neon Brand line along base */}
        <mesh position={[0, 0, 0.205]} material={neonMaterial}>
          <boxGeometry args={[2.0, 0.015, 0.005]} />
        </mesh>
      </group>
    </group>
  );
}
