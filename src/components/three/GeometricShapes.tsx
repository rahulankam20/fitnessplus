"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// GeometricShapes - Abstract floating shapes
// Used as transition/decoration elements
// ============================================

function ShapeGeometry({
  geometry,
}: {
  geometry: "octahedron" | "icosahedron" | "torus" | "tetrahedron";
}) {
  switch (geometry) {
    case "octahedron":
      return <octahedronGeometry args={[0.5, 0]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.5, 0]} />;
    case "torus":
      return <torusGeometry args={[0.4, 0.15, 8, 16]} />;
    case "tetrahedron":
      return <tetrahedronGeometry args={[0.5, 0]} />;
    default:
      return null;
  }
}

function FloatingShape({
  geometry,
  position,
  color = "#ff0000",
  speed = 0.3,
  scale = 1,
  wireframe = true,
  scrollRef,
}: {
  geometry: "octahedron" | "icosahedron" | "torus" | "tetrahedron";
  position: [number, number, number];
  color?: string;
  speed?: number;
  scale?: number;
  wireframe?: boolean;
  scrollRef?: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    // Base rotation + scroll spin
    meshRef.current.rotation.x = t * speed + scroll * 1.5;
    meshRef.current.rotation.y = t * speed * 0.7 + scroll * 1.2;

    // Wave float + scroll translation
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.3 - scroll * 3.5;
    meshRef.current.position.z = position[2] - scroll * 6;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <ShapeGeometry geometry={geometry} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={0.25}
        emissive={color}
        emissiveIntensity={0.15}
        metalness={0.8}
        roughness={0.3}
      />
    </mesh>
  );
}

export default function GeometricShapes({
  scrollRef,
}: {
  scrollRef?: React.RefObject<number>;
}) {
  return (
    <group>
      <FloatingShape geometry="octahedron" position={[-6, 2, -5]} speed={0.2} scale={0.8} color="#ff0000" scrollRef={scrollRef} />
      <FloatingShape geometry="icosahedron" position={[6, -1, -7]} speed={0.15} scale={0.6} color="#ff2222" scrollRef={scrollRef} />
      <FloatingShape geometry="torus" position={[-4, -3, -4]} speed={0.25} scale={0.7} color="#ff1111" scrollRef={scrollRef} />
      <FloatingShape geometry="tetrahedron" position={[5, 3, -6]} speed={0.18} scale={0.5} color="#ff3333" scrollRef={scrollRef} />
      <FloatingShape geometry="octahedron" position={[0, -4, -8]} speed={0.12} scale={0.4} color="#cc0000" scrollRef={scrollRef} />
    </group>
  );
}
