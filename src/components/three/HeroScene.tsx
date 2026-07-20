"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import * as THREE from "three";
import Barbell from "./Barbell";
import Particles from "./Particles";
import Lighting from "./Lighting";

// ============================================
// Scroll Stage — 4 cinematic acts
// ============================================
// Act 1 (0.00–0.20): Barbell floats in darkness, red rim, deep fog
// Act 2 (0.20–0.45): Plates assemble, camera dollies, particles intensify
// Act 3 (0.45–0.70): Object tilts forward, camera orbits, sparks peak
// Act 4 (0.70–1.00): Scene resolves, fog eases, CTA moment

// ============================================
// Camera Rig — scroll-mapped 4-act movement
// ============================================

function CameraRig({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5));

  useFrame((state) => {
    const scroll = scrollRef.current ?? 0;
    const scene = state.scene;

    // Act 1: distant, dramatic → Act 2: close dolly → Act 3: orbit angle → Act 4: resolve
    let targetZ: number;
    let targetY: number;
    let targetX: number;

    if (scroll < 0.2) {
      // Act 1: slow float-in as scroll starts
      const t1 = scroll / 0.2;
      targetZ = 6.0 - t1 * 0.8; // from 6.0 → 5.2
      targetY = pointer.y * 0.6;
      targetX = pointer.x * 1.2;
    } else if (scroll < 0.45) {
      // Act 2: dramatic dolly push forward
      const t2 = (scroll - 0.2) / 0.25;
      targetZ = 5.2 - t2 * 1.8; // from 5.2 → 3.4
      targetY = pointer.y * 0.5 - t2 * 0.8;
      targetX = pointer.x * 1.0 + t2 * 0.5;
    } else if (scroll < 0.7) {
      // Act 3: orbit to a dramatic angle
      const t3 = (scroll - 0.45) / 0.25;
      targetZ = 3.4 + t3 * 0.6; // ease back slightly 3.4 → 4.0
      targetY = -0.8 - t3 * 0.4;
      targetX = 0.5 + t3 * 0.8;
    } else {
      // Act 4: resolve to center, clean moment
      const t4 = (scroll - 0.7) / 0.3;
      targetZ = 4.0 + t4 * 1.2; // drift back 4.0 → 5.2
      targetY = -1.2 + t4 * 1.0;
      targetX = 1.3 - t4 * 1.3;
    }

    targetPos.current.set(targetX, targetY, targetZ);
    camera.position.lerp(targetPos.current, 0.035);
    camera.lookAt(0, -scroll * 0.3, 0);

    // Fog: very tight in Act 1 → opens up in Act 4
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      let fogNear: number;
      let fogFar: number;

      if (scroll < 0.2) {
        fogNear = 6;
        fogFar = 18;
      } else if (scroll < 0.45) {
        const t = (scroll - 0.2) / 0.25;
        fogNear = THREE.MathUtils.lerp(6, 3, t);
        fogFar = THREE.MathUtils.lerp(18, 10, t);
      } else if (scroll < 0.7) {
        const t = (scroll - 0.45) / 0.25;
        fogNear = THREE.MathUtils.lerp(3, 4, t);
        fogFar = THREE.MathUtils.lerp(10, 14, t);
      } else {
        const t = (scroll - 0.7) / 0.3;
        fogNear = THREE.MathUtils.lerp(4, 8, t);
        fogFar = THREE.MathUtils.lerp(14, 22, t);
      }

      scene.fog.near = fogNear;
      scene.fog.far = fogFar;
    }
  });

  return null;
}

// ============================================
// Scroll-Reactive Ground Grid
// ============================================

function GroundGrid({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const scroll = scrollRef.current ?? 0;
    const t = state.clock.getElapsedTime();

    // Grid only appears from Act 2 onward
    const visibility = Math.max(0, (scroll - 0.15) / 0.2);
    (gridRef.current.material as THREE.Material).opacity = visibility * 0.12;
    gridRef.current.position.z = Math.sin(t * 0.3) * 0.1 - scroll * 0.5;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[30, 30, "#dc2626", "#dc2626"]}
      position={[0, -2.5, 0]}
    >
      <lineBasicMaterial
        attach="material"
        color="#dc2626"
        transparent
        opacity={0}
      />
    </gridHelper>
  );
}

// ============================================
// Ambient Sparks — tiny emissive sparks at Act 2+
// ============================================

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function AmbientSparks({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const SPARK_COUNT = 24;

  const [positions] = useState(() => {
    const rand = seededRandom(1013);
    return Array.from({ length: SPARK_COUNT }, (_, i) => {
      const angle = (i / SPARK_COUNT) * Math.PI * 2;
      return {
        angle,
        radius: 1.8 + rand() * 1.2,
        yOffset: (rand() - 0.5) * 1.5,
        speed: 0.4 + rand() * 0.6,
        phase: rand() * Math.PI * 2,
      };
    });
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    const scroll = scrollRef.current ?? 0;
    const t = state.clock.getElapsedTime();

    // Only spark during Act 2 + 3
    const sparkIntensity = Math.min(1, Math.max(0, (scroll - 0.2) / 0.25));

    for (let i = 0; i < SPARK_COUNT; i++) {
      const { angle, radius, yOffset, speed, phase } = positions[i];
      const orbit = angle + t * speed;
      const x = Math.cos(orbit) * radius;
      const z = Math.sin(orbit) * radius;
      const y = yOffset + Math.sin(t * 1.5 + phase) * 0.3;

      dummy.current.position.set(x, y, z);
      dummy.current.scale.setScalar(sparkIntensity * (0.015 + Math.sin(t * 3 + i) * 0.008));
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.visible = sparkIntensity > 0.05;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARK_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#ff4444"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ============================================
// HeroScene — Main 3D Canvas
// ============================================

export default function HeroScene() {
  const scrollRef = useRef<number>(0);

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
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.35,
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
        {/* Deep cinematic fog — tightens in Act 1-2 */}
        <fog attach="fog" args={["#050505", 6, 18]} />

        {/* Environment for chrome reflections */}
        <Environment preset="night" />

        {/* Cinematic lighting */}
        <Lighting scrollProgress={scrollRef} mode="hero" />

        {/* === HERO OBJECT: Olympic Barbell === */}
        <Barbell
          scale={1.05}
          position={[0, 0.1, 0]}
          scrollRef={scrollRef}
          assemblyProgress={1} // plates always assembled in hero (assembly in PerformanceStory)
          isHero={true}
        />

        {/* Cinematic particle system */}
        <Particles
          count={320}
          scrollRef={scrollRef}
          color="#ff3333"
          spread={6}
        />

        {/* Secondary silver particles for depth */}
        <Particles
          count={80}
          scrollRef={scrollRef}
          color="#c7c7c7"
          spread={9}
          intensity={0.3}
        />

        {/* Orbiting sparks from Act 2 onward */}
        <AmbientSparks scrollRef={scrollRef} />

        {/* Ground grid appears from Act 2 */}
        <GroundGrid scrollRef={scrollRef} />

        {/* 4-act scroll camera rig */}
        <CameraRig scrollRef={scrollRef} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
