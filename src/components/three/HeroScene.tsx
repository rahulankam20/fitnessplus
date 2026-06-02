"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import * as THREE from "three";
import Dumbbell from "./Dumbbell";
import Kettlebell from "./Kettlebell";
import Particles from "./Particles";
import Lighting from "./Lighting";
import GeometricShapes from "./GeometricShapes";

// ============================================
// Camera Rig – Mouse-based parallax movement & scroll zoom
// ============================================

function CameraRig({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { camera, pointer, scene } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    const scroll = scrollRef.current ?? 0;
    
    // Smooth lerp camera position based on mouse and scroll depth
    const targetZ = 5 + scroll * 3.5;
    const targetX = pointer.x * 1.5;
    const targetY = pointer.y * 0.8 - scroll * 1.5;
    
    target.current.set(targetX, targetY, targetZ);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, -scroll * 0.5, 0);

    // Dynamic fog adjustment to fade scene on scroll
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.near = THREE.MathUtils.lerp(8, 2.5, scroll);
      scene.fog.far = THREE.MathUtils.lerp(25, 7.5, scroll);
    }
  });

  return null;
}

// ============================================
// HeroScene – Main 3D Canvas for hero section
// ============================================

export default function HeroScene() {
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      scrollRef.current = Math.min(Math.max(scrollY / height, 0), 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]} // Limit pixel ratio for performance
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
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
        {/* Scene fog for depth */}
        <fog attach="fog" args={["#050505", 8, 25]} />

        {/* Cinematic lighting */}
        <Lighting />

        {/* Environment map for reflections */}
        <Environment preset="night" />

        {/* 3D Objects with scrollRef */}
        <Dumbbell scale={1.2} position={[0, 0, 0]} scrollRef={scrollRef} />
        <Kettlebell scale={0.9} position={[3, -1.5, -2]} scrollRef={scrollRef} />
        <GeometricShapes scrollRef={scrollRef} />

        {/* Particle system */}
        <Particles count={250} scrollRef={scrollRef} />

        {/* Mouse-based camera parallax & scroll control */}
        <CameraRig scrollRef={scrollRef} />

        {/* Preload resources */}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
