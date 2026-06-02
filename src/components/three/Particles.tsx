"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// Particles - Floating dust/sweat particles
// ============================================

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function Particles({
  count = 300,
  scrollRef,
}: {
  count?: number;
  scrollRef?: React.RefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const random = createSeededRandom(count * 7919);
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 5 + random() * 8;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    // Normal slow rotation + scroll spin
    pointsRef.current.rotation.y = t * 0.02 + scroll * 0.25;
    pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05 + scroll * 0.1;

    // Displace points container down and forward (warp speed effect)
    pointsRef.current.position.y = -scroll * 4.5;
    pointsRef.current.position.z = -scroll * 3.5;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff4444"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
