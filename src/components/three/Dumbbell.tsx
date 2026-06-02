"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

// ============================================
// Dumbbell - Realistic 3D dumbbell from primitives
// Built with: bar + weight plates + collars + grips
// ============================================

function WeightPlateStack({
  side,
  barMaterial,
  plateMaterial,
  plateEdgeMaterial,
}: {
  side: 1 | -1;
  barMaterial: THREE.MeshStandardMaterial;
  plateMaterial: THREE.MeshStandardMaterial;
  plateEdgeMaterial: THREE.MeshStandardMaterial;
}) {
  const baseX = side * 1.35;

  return (
    <group>
      <mesh position={[baseX, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateMaterial}>
        <cylinderGeometry args={[0.55, 0.55, 0.12, 48]} />
      </mesh>
      <mesh position={[baseX, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateEdgeMaterial}>
        <torusGeometry args={[0.55, 0.015, 8, 48]} />
      </mesh>
      <mesh position={[baseX - side * 0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateMaterial}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 48]} />
      </mesh>
      <mesh position={[baseX - side * 0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={plateMaterial}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 48]} />
      </mesh>
      <mesh position={[baseX + side * 0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={barMaterial}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 32]} />
      </mesh>
    </group>
  );
}

interface DumbbellProps extends React.ComponentPropsWithoutRef<"group"> {
  scrollRef?: React.RefObject<number>;
}

export default function Dumbbell({ scrollRef, ...props }: DumbbellProps) {
  const groupRef = useRef<THREE.Group>(null);

  const barMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c0c0c0"),
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 1.2,
      }),
    []
  );

  const plateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a1a"),
        metalness: 0.85,
        roughness: 0.3,
        envMapIntensity: 0.8,
      }),
    []
  );

  const plateEdgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff0000"),
        metalness: 0.9,
        roughness: 0.2,
        emissive: new THREE.Color("#ff0000"),
        emissiveIntensity: 0.3,
      }),
    []
  );

  const gripMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2a2a2a"),
        metalness: 0.3,
        roughness: 0.8,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    // Base rotation + scroll spin
    groupRef.current.rotation.y = t * 0.3 + scroll * 3.5;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.08 + scroll * 0.3;
    
    // Float + push down/left out of screen on scroll
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.15 - scroll * 2.2;
    groupRef.current.position.x = -scroll * 1.8;
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={barMaterial}>
        <cylinderGeometry args={[0.06, 0.06, 3.2, 32]} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 2]} material={gripMaterial}>
        <cylinderGeometry args={[0.075, 0.075, 0.8, 24]} />
      </mesh>

      <WeightPlateStack
        side={-1}
        barMaterial={barMaterial}
        plateMaterial={plateMaterial}
        plateEdgeMaterial={plateEdgeMaterial}
      />
      <WeightPlateStack
        side={1}
        barMaterial={barMaterial}
        plateMaterial={plateMaterial}
        plateEdgeMaterial={plateEdgeMaterial}
      />
    </group>
  );
}
