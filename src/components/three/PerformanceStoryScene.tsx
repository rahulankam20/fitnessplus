"use client";

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Preload, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import Lighting from "./Lighting";

// ============================================
// PerformanceStoryScene — 5-Act Cinematic 3D Canvas
// Canonical R3F pattern: JSX materials + mesh refs in useFrame
// ============================================

function lerpVal(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function stageProgress(scroll: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}

// Seeded random — avoids Math.random() in useMemo (react-hooks/purity)
function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ============================================
// Floor Grid
// ============================================

function GymFloor({ scroll }: { scroll: React.RefObject<number> }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame(() => {
    if (!gridRef.current) return;
    const s = scroll.current ?? 0;
    const mat = gridRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = stageProgress(s, 0, 0.15) * 0.18;
  });

  return (
    <gridHelper ref={gridRef} args={[20, 20, "#dc2626", "#330000"]} position={[0, -2.2, 0]}>
      <lineBasicMaterial attach="material" color="#dc2626" transparent opacity={0} />
    </gridHelper>
  );
}

// ============================================
// Gym Platform
// ============================================

function GymPlatform({ scroll }: { scroll: React.RefObject<number> }) {
  const discRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!discRef.current || !glowRef.current) return;
    const s = scroll.current ?? 0;
    const t = state.clock.getElapsedTime();
    const visible = stageProgress(s, 0, 0.2);
    // Access material via meshRef.current.material — safe in useFrame
    (discRef.current.material as THREE.MeshStandardMaterial).opacity = visible * 0.9;
    (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      (0.5 + Math.sin(t * 1.5) * 0.3) * visible;
  });

  return (
    <group position={[0, -2.2, 0]}>
      <mesh ref={discRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.8} roughness={0.3} transparent opacity={0} />
      </mesh>
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[2.45, 0.025, 8, 64]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ============================================
// Assembling Barbell — Act 1 (0.20–0.40)
// ============================================

function AssemblingBarbell({ scroll }: { scroll: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  // Ref to the ring mesh so we can pulse emissive in useFrame
  const ringMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !leftRef.current || !rightRef.current) return;
    const s = scroll.current ?? 0;
    const t = state.clock.getElapsedTime();

    const assemblyProg = stageProgress(s, 0.2, 0.4);
    const overallVisible = stageProgress(s, 0.18, 0.28);
    const fadeOut = 1 - stageProgress(s, 0.78, 0.92);
    groupRef.current.visible = overallVisible * fadeOut > 0.01;

    leftRef.current.position.x = -lerpVal(4.5, 0, assemblyProg);
    rightRef.current.position.x = lerpVal(4.5, 0, assemblyProg);

    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08 - 0.3;
    groupRef.current.rotation.y = t * 0.25;

    // Pulse ring emissive — safe: accessing meshRef.current.material in useFrame
    if (ringMeshRef.current) {
      (ringMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(t * 2.2) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 3.6, 32]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.97} roughness={0.07} />
      </mesh>

      {/* Left plates */}
      <group ref={leftRef} position={[-4.5, 0, 0]}>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.44, 0.1, 48]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh ref={ringMeshRef} position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.44, 0.012, 8, 48]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} metalness={0.85} roughness={0.18} />
        </mesh>
        <mesh position={[-1.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 48]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh position={[-1.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.065, 48]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
        </mesh>
      </group>

      {/* Right plates */}
      <group ref={rightRef} position={[4.5, 0, 0]}>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.44, 0.1, 48]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.44, 0.012, 8, 48]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} metalness={0.85} roughness={0.18} />
        </mesh>
        <mesh position={[1.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 48]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
        </mesh>
        <mesh position={[1.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.065, 48]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.28} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================
// Holographic Body Scan — Act 2 (0.40–0.60)
// Canonical pattern: JSX materials, cached mesh refs in useFrame
// ============================================

// Helper wrappers to tag meshes via userData
const H = ({ children, pos, rot, scale: s }: { children: React.ReactNode; pos?: [number,number,number]; rot?: [number,number,number]; scale?: [number,number,number] }) => (
  <mesh
    position={pos}
    rotation={rot}
    scale={s}
    onUpdate={(m) => { m.userData.isHolo = true; }}
  >
    {children}
    <meshBasicMaterial color="#dc2626" wireframe transparent opacity={0.3} />
  </mesh>
);

const J = ({ pos }: { pos?: [number,number,number] }) => (
  <mesh
    position={pos}
    onUpdate={(m) => { m.userData.isJoint = true; }}
  >
    <sphereGeometry args={[0.045, 8, 8]} />
    <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1.4} transparent opacity={0.9} />
  </mesh>
);

function HologramFigure({ scroll }: { scroll: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const visRef = useRef(0);

  // Cached mesh references per category
  const cachedRef = useRef(false);
  const holoMeshesRef = useRef<THREE.Mesh[]>([]);
  const jointMeshesRef = useRef<THREE.Mesh[]>([]);
  const scanMeshesRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Collect and categorize meshes ONCE instead of walking tree every frame
    if (!cachedRef.current) {
      const holo: THREE.Mesh[] = [];
      const joint: THREE.Mesh[] = [];
      const scan: THREE.Mesh[] = [];

      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (child.userData.isHolo) {
            holo.push(child);
          } else if (child.userData.isJoint) {
            joint.push(child);
          } else if (child.userData.isScan) {
            scan.push(child);
          }
        }
      });

      holoMeshesRef.current = holo;
      jointMeshesRef.current = joint;
      scanMeshesRef.current = scan;
      cachedRef.current = true;
    }

    const s = scroll.current ?? 0;
    const t = state.clock.getElapsedTime();

    const appearProg = stageProgress(s, 0.38, 0.55);
    const fadeOut = 1 - stageProgress(s, 0.78, 0.92);
    const vis = appearProg * fadeOut;
    visRef.current = vis;

    groupRef.current.visible = vis > 0.01;
    groupRef.current.rotation.y = t * 0.45;

    // Update holo meshes
    for (let i = 0; i < holoMeshesRef.current.length; i++) {
      const mat = holoMeshesRef.current[i].material as THREE.Material;
      mat.opacity = vis * 0.3;
    }

    // Update joint meshes
    const jointEmissive = 1.2 + Math.sin(t * 3) * 0.5;
    for (let i = 0; i < jointMeshesRef.current.length; i++) {
      const mat = jointMeshesRef.current[i].material as THREE.MeshStandardMaterial;
      mat.opacity = vis * 0.9;
      mat.emissiveIntensity = jointEmissive;
    }

    // Update scan meshes
    for (let i = 0; i < scanMeshesRef.current.length; i++) {
      const mat = scanMeshesRef.current[i].material as THREE.Material;
      mat.opacity = vis * 0.8;
    }

    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 1.6) * 1.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={[0.95, 0.95, 0.95]}>
      <H pos={[0, 1.25, 0]}><sphereGeometry args={[0.18, 12, 12]} /></H>
      <J pos={[0, 1.25, 0]} />

      <H pos={[0, 0.7, 0]}><cylinderGeometry args={[0.22, 0.16, 0.45, 14]} /></H>
      <J pos={[0, 0.7, 0]} />

      <H pos={[0, 0.38, 0]}><cylinderGeometry args={[0.16, 0.2, 0.3, 14]} /></H>
      <H pos={[0, 0.18, 0]}><cylinderGeometry args={[0.2, 0.18, 0.17, 14]} /></H>
      <J pos={[-0.16, 0.18, 0]} />
      <J pos={[0.16, 0.18, 0]} />

      {/* Left arm */}
      <group position={[-0.28, 0.85, 0]}>
        <J />
        <H pos={[-0.15, -0.2, 0]} rot={[0, 0, Math.PI / 10]}>
          <cylinderGeometry args={[0.04, 0.035, 0.42, 10]} />
        </H>
        <J pos={[-0.22, -0.42, 0]} />
        <H pos={[-0.27, -0.67, 0]} rot={[0, 0, Math.PI / 12]}>
          <cylinderGeometry args={[0.035, 0.025, 0.4, 10]} />
        </H>
      </group>

      {/* Right arm */}
      <group position={[0.28, 0.85, 0]}>
        <J />
        <H pos={[0.15, -0.2, 0]} rot={[0, 0, -Math.PI / 10]}>
          <cylinderGeometry args={[0.04, 0.035, 0.42, 10]} />
        </H>
        <J pos={[0.22, -0.42, 0]} />
        <H pos={[0.27, -0.67, 0]} rot={[0, 0, -Math.PI / 12]}>
          <cylinderGeometry args={[0.035, 0.025, 0.4, 10]} />
        </H>
      </group>

      {/* Left leg */}
      <group position={[-0.15, 0.1, 0]}>
        <H pos={[0, -0.33, 0]}><cylinderGeometry args={[0.09, 0.07, 0.56, 10]} /></H>
        <J pos={[0, -0.62, 0]} />
        <H pos={[0, -0.96, 0]}><cylinderGeometry args={[0.07, 0.04, 0.56, 10]} /></H>
        <J pos={[0, -1.26, 0]} />
      </group>

      {/* Right leg */}
      <group position={[0.15, 0.1, 0]}>
        <H pos={[0, -0.33, 0]}><cylinderGeometry args={[0.09, 0.07, 0.56, 10]} /></H>
        <J pos={[0, -0.62, 0]} />
        <H pos={[0, -0.96, 0]}><cylinderGeometry args={[0.07, 0.04, 0.56, 10]} /></H>
        <J pos={[0, -1.26, 0]} />
      </group>

      {/* Scanning ring */}
      <mesh
        ref={scanRef}
        rotation={[Math.PI / 2, 0, 0]}
        onUpdate={(m) => { m.userData.isScan = true; }}
      >
        <torusGeometry args={[0.65, 0.015, 8, 36]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.75} />
      </mesh>

      <gridHelper args={[3.5, 12, "#dc2626", "#dc2626"]} position={[0, -1.4, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.15} color="#dc2626" />
      </gridHelper>
    </group>
  );
}

// ============================================
// Orbital Particles — Act 3 (0.60–0.80)
// ============================================

function OrbitalParticles({ scroll }: { scroll: React.RefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const rand = seededRandom(count * 31337);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const layer = Math.floor(i / 60);
      const radius = 1.6 + layer * 0.6;
      const ySpread = (rand() - 0.5) * 3;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = ySpread;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const s = scroll.current ?? 0;
    const t = state.clock.getElapsedTime();
    const vis = stageProgress(s, 0.58, 0.72) * (1 - stageProgress(s, 0.82, 0.95));
    pointsRef.current.visible = vis > 0.01;
    pointsRef.current.rotation.y = t * 0.5;
    pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    // Accessing via pointsRef.current.material is safe in useFrame
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = vis * 0.7;
    mat.size = 0.025 + Math.sin(t * 2) * 0.008;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff3333"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ============================================
// Story Camera Rig
// ============================================

function StoryCameraRig({ scroll }: { scroll: React.RefObject<number> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 5.5));

  useFrame(() => {
    const s = scroll.current ?? 0;
    let tz: number, ty: number, tx: number;

    if (s < 0.2) {
      tz = 5.5; ty = 0.5; tx = 0;
    } else if (s < 0.4) {
      const p = stageProgress(s, 0.2, 0.4);
      tz = lerpVal(5.5, 4.0, p); ty = lerpVal(0.5, -0.2, p); tx = lerpVal(0, 0.5, p);
    } else if (s < 0.6) {
      const p = stageProgress(s, 0.4, 0.6);
      tz = lerpVal(4.0, 4.8, p); ty = lerpVal(-0.2, 0.2, p); tx = lerpVal(0.5, -0.3, p);
    } else if (s < 0.8) {
      const p = stageProgress(s, 0.6, 0.8);
      tz = lerpVal(4.8, 5.2, p); ty = lerpVal(0.2, -0.3, p); tx = lerpVal(-0.3, 0.8, p);
    } else {
      const p = stageProgress(s, 0.8, 1.0);
      tz = lerpVal(5.2, 7.0, p); ty = lerpVal(-0.3, 0.5, p); tx = lerpVal(0.8, 0, p);
    }

    target.current.set(tx, ty, tz);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, -0.2, 0);
  });

  return null;
}

// ============================================
// Main Scene Export
// ============================================

interface PerformanceStorySceneProps {
  scrollProgress: React.RefObject<number>;
}

export default function PerformanceStoryScene({ scrollProgress }: PerformanceStorySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        camera={{ position: [0, 0.5, 5.5], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 8, 22]} />
          <Environment preset="night" />
          <Lighting scrollProgress={scrollProgress} mode="story" />
          <GymFloor scroll={scrollProgress} />
          <GymPlatform scroll={scrollProgress} />
          <AssemblingBarbell scroll={scrollProgress} />
          <HologramFigure scroll={scrollProgress} />
          <OrbitalParticles scroll={scrollProgress} />
          <StoryCameraRig scroll={scrollProgress} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
