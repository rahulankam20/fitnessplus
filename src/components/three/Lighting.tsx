"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// Lighting – Cinematic dynamic scroll-driven lights
// Key light + Red rim + Copper warmth + Animated spot
// ============================================

interface LightingProps {
  scrollProgress?: React.RefObject<number>;
  mode?: "hero" | "barbell" | "dumbbell" | "kettlebell" | "story";
}

function AnimatedRimLight({ scrollRef }: { scrollRef?: React.RefObject<number> }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    // Pulse intensity + amplify on scroll
    const basePulse = 1 + Math.sin(t * 1.8) * 0.35;
    const scrollBoost = 1 + scroll * 2.5;
    lightRef.current.intensity = 28 * basePulse * scrollBoost;

    // Orbit slightly around the scene for dynamic rim effect
    lightRef.current.position.x = -4 + Math.sin(t * 0.4) * 0.8;
    lightRef.current.position.y = 2 + Math.sin(t * 0.6) * 0.5;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[-4, 2, -3]}
      intensity={28}
      color="#dc2626"
      distance={22}
      decay={2}
    />
  );
}

function AnimatedSpotLight({ scrollRef }: { scrollRef?: React.RefObject<number> }) {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (!spotRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef?.current ?? 0;

    // Sweep spot slowly, intensity drops off on deep scroll
    spotRef.current.position.x = Math.sin(t * 0.25) * 2;
    spotRef.current.intensity = Math.max(8, 22 - scroll * 10);
    spotRef.current.angle = 0.35 + scroll * 0.1;
  });

  return (
    <spotLight
      ref={spotRef}
      position={[0, 10, 0]}
      intensity={22}
      angle={0.35}
      penumbra={0.85}
      color="#ffffff"
      distance={28}
      decay={2}
    />
  );
}

export default function Lighting({ scrollProgress, mode = "hero" }: LightingProps) {

  const modeConfig = {
    hero: {
      ambient: { intensity: 0.12, color: "#ffeedd" },
      key: { color: "#ffffff", intensity: 1.0 },
      rim2: { color: "#ff2200", intensity: 12 },
      fill: { color: "#330000", intensity: 4 },
      copper: { color: "#b87333", intensity: 6 },
    },
    barbell: {
      ambient: { intensity: 0.08, color: "#ffffff" },
      key: { color: "#f0f0f0", intensity: 1.4 },
      rim2: { color: "#ff0000", intensity: 18 },
      fill: { color: "#440000", intensity: 5 },
      copper: { color: "#b87333", intensity: 4 },
    },
    dumbbell: {
      ambient: { intensity: 0.1, color: "#e0e8ff" },
      key: { color: "#d0e0ff", intensity: 1.2 },
      rim2: { color: "#cc2200", intensity: 10 },
      fill: { color: "#220011", intensity: 3 },
      copper: { color: "#8888ff", intensity: 4 },
    },
    kettlebell: {
      ambient: { intensity: 0.12, color: "#ffe8cc" },
      key: { color: "#ffeecc", intensity: 1.0 },
      rim2: { color: "#ff6600", intensity: 14 },
      fill: { color: "#441100", intensity: 5 },
      copper: { color: "#d97706", intensity: 8 },
    },
    story: {
      ambient: { intensity: 0.06, color: "#ffeedd" },
      key: { color: "#ffffff", intensity: 0.8 },
      rim2: { color: "#ff2200", intensity: 14 },
      fill: { color: "#220000", intensity: 3 },
      copper: { color: "#b87333", intensity: 5 },
    },
  }[mode];

  return (
    <>
      {/* Ambient — very low, preserve drama */}
      <ambientLight
        intensity={modeConfig.ambient.intensity}
        color={modeConfig.ambient.color}
      />

      {/* Key light — upper right soft fill */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={modeConfig.key.intensity}
        color={modeConfig.key.color}
      />

      {/* Animated red rim light — primary cinematic signature */}
      <AnimatedRimLight scrollRef={scrollProgress} />

      {/* Secondary red accent — upper right */}
      <pointLight
        position={[3, 4, -2]}
        intensity={modeConfig.rim2.intensity}
        color={modeConfig.rim2.color}
        distance={16}
        decay={2}
      />

      {/* Copper/amber warm fill — used sparingly for luxury */}
      <pointLight
        position={[2, -1, 3]}
        intensity={modeConfig.copper.intensity}
        color={modeConfig.copper.color}
        distance={12}
        decay={2}
      />

      {/* Under-fill — show metallic underside detail */}
      <pointLight
        position={[0, -3, 2]}
        intensity={modeConfig.fill.intensity}
        color={modeConfig.fill.color}
        distance={10}
        decay={2}
      />

      {/* Animated top spot */}
      <AnimatedSpotLight scrollRef={scrollProgress} />
    </>
  );
}
