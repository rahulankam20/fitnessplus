"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// Particles — Cinematic scroll-reactive particle system
// Supports: intensity (0-1), convergence burst, color
// ============================================

function createSeededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

interface ParticlesProps {
  count?: number;
  scrollRef?: React.RefObject<number>;
  intensity?: number; // 0-1 multiplier for opacity/size boost
  color?: string;
  spread?: number;
}

export default function Particles({
  count = 300,
  scrollRef,
  intensity = 1,
  color = "#ff4444",
  spread = 6,
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, origPositions } = useMemo(() => {
    const random = createSeededRandom(count * 7919);
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = spread + random() * 8;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }

    return { positions: pos, origPositions: orig };
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    // Scale effective intensity by prop + scroll
    const effectiveIntensity = Math.min(1, intensity + scroll * 0.8);

    // Base rotation
    pointsRef.current.rotation.y = t * 0.02 + scroll * 0.3;
    pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05 + scroll * 0.08;

    // Scroll-driven displacement: push down + forward (warp-speed)
    pointsRef.current.position.y = -scroll * 3.5;
    pointsRef.current.position.z = -scroll * 2.5;

    // Convergence burst: at high scroll, particles pull toward origin
    if (scroll > 0.4 && pointsRef.current.geometry) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const burstStrength = (scroll - 0.4) / 0.6; // 0–1 as scroll goes 0.4–1.0

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const ox = origPositions[ix];
        const oy = origPositions[ix + 1];
        const oz = origPositions[ix + 2];

        // Lerp toward center then back outward in a pulsing spiral
        const pulse = Math.sin(t * 2 + i * 0.05) * 0.5 + 0.5;
        const converge = burstStrength * pulse * 0.65;

        posAttr.setXYZ(
          i,
          ox * (1 - converge),
          oy * (1 - converge),
          oz * (1 - converge)
        );
      }
      posAttr.needsUpdate = true;
    }

    // Dynamic material opacity & size via effectiveIntensity
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.25, 0.75, effectiveIntensity);
    mat.size = THREE.MathUtils.lerp(0.018, 0.04, effectiveIntensity);
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
