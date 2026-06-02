"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// Kettlebell – 3D kettlebell from primitives
// ============================================

import React from "react";

interface KettlebellProps extends React.ComponentPropsWithoutRef<"group"> {
  scrollRef?: React.RefObject<number>;
}

export default function Kettlebell({ scrollRef, ...props }: KettlebellProps) {
  const groupRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<[number, number, number] | null>(null);

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a1a"),
        metalness: 0.9,
        roughness: 0.25,
        envMapIntensity: 0.9,
      }),
    []
  );

  const handleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#888888"),
        metalness: 0.95,
        roughness: 0.15,
      }),
    []
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff0000"),
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color("#ff0000"),
        emissiveIntensity: 0.2,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!initialPosition.current) {
      initialPosition.current = [
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z,
      ];
    }
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;
    const [bx, by, bz] = initialPosition.current;

    // Spin on scroll
    groupRef.current.rotation.y = t * 0.4 - scroll * 2.5;
    
    // Translate down, right, and deeper into the screen on scroll
    groupRef.current.position.y = by + Math.sin(t * 0.7) * 0.1 - scroll * 1.5;
    groupRef.current.position.x = bx + scroll * 1.5;
    groupRef.current.position.z = bz - scroll * 5;
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Main body – slightly squashed sphere */}
      <mesh position={[0, -0.15, 0]} material={bodyMaterial} scale={[1, 0.9, 1]}>
        <sphereGeometry args={[0.5, 48, 48]} />
      </mesh>

      {/* Flat bottom */}
      <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]} material={bodyMaterial}>
        <cylinderGeometry args={[0.22, 0.25, 0.08, 32]} />
      </mesh>

      {/* Handle – torus (the arch) */}
      <mesh position={[0, 0.35, 0]} material={handleMaterial}>
        <torusGeometry args={[0.28, 0.05, 16, 48, Math.PI]} />
      </mesh>

      {/* Handle connectors (vertical bars connecting body to handle) */}
      <mesh position={[-0.28, 0.15, 0]} material={handleMaterial}>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 16]} />
      </mesh>
      <mesh position={[0.28, 0.15, 0]} material={handleMaterial}>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 16]} />
      </mesh>

      {/* Red accent stripe on body */}
      <mesh position={[0, -0.15, 0]} material={accentMaterial} scale={[1.01, 0.91, 1.01]}>
        <torusGeometry args={[0.5, 0.015, 8, 48]} />
      </mesh>
    </group>
  );
}
