"use client";

import { useMemo, useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

interface HologramModelProps {
  weight: number; // 40 - 150 (normal: 70)
  height: number; // 120 - 220 (normal: 175)
  goal: "muscle" | "fat" | "fitness";
}

export default function HologramModel({ weight, height, goal }: HologramModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);

  // Map inputs to scaling factors
  const heightScale = useMemo(() => height / 175, [height]);
  const baseWidthScale = useMemo(() => weight / 75, [weight]);

  // Goal modifiers
  const modifiers = useMemo(() => {
    switch (goal) {
      case "muscle":
        return {
          chest: 1.35 * baseWidthScale,
          waist: 0.95 * baseWidthScale,
          arms: 1.3 * baseWidthScale,
          color: "#ff2d2d",
          emissive: "#ff0000",
        };
      case "fat":
        return {
          chest: 1.15 * baseWidthScale,
          waist: 1.45 * baseWidthScale,
          arms: 1.05 * baseWidthScale,
          color: "#ff8c00",
          emissive: "#ff5500",
        };
      case "fitness":
      default:
        return {
          chest: 1.05 * baseWidthScale,
          waist: 1.02 * baseWidthScale,
          arms: 1.05 * baseWidthScale,
          color: "#00ffff",
          emissive: "#00aaaa",
        };
    }
  }, [goal, baseWidthScale]);

  // Hologram Material
  const holoMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(modifiers.color),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    [modifiers]
  );

  // Glowing Joint Material
  const jointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(modifiers.color),
        emissive: new THREE.Color(modifiers.emissive),
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
      }),
    [modifiers]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Slow rotate avatar
    if (modelRef.current) {
      modelRef.current.rotation.y = t * 0.5;
    }

    // Animate scanning ring up and down
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(t * 1.5) * 1.3 * heightScale;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Dynamic Humanoid Figure */}
      <group ref={modelRef} scale={[1, heightScale, 1]}>
        
        {/* Head */}
        <mesh position={[0, 1.2, 0]} material={holoMaterial}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>
        {/* Brain node (glowing center core) */}
        <mesh position={[0, 1.2, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.98, 0]} material={holoMaterial}>
          <cylinderGeometry args={[0.04, 0.05, 0.12, 12]} />
        </mesh>

        {/* Torso - Upper Chest */}
        <mesh position={[0, 0.7, 0]} scale={[modifiers.chest, 1, 1]} material={holoMaterial}>
          <cylinderGeometry args={[0.22, 0.16, 0.4, 16]} />
        </mesh>
        {/* Chest Center Node */}
        <mesh position={[0, 0.7, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>

        {/* Torso - Waist/Abs */}
        <mesh position={[0, 0.4, 0]} scale={[modifiers.waist, 1, 1]} material={holoMaterial}>
          <cylinderGeometry args={[0.16, 0.2, 0.3, 16]} />
        </mesh>

        {/* Hips */}
        <mesh position={[0, 0.18, 0]} scale={[baseWidthScale * 1.1, 1, 1]} material={holoMaterial}>
          <cylinderGeometry args={[0.2, 0.18, 0.16, 16]} />
        </mesh>
        {/* Hip Nodes */}
        <mesh position={[-0.15 * baseWidthScale, 0.18, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.045, 8, 8]} />
        </mesh>
        <mesh position={[0.15 * baseWidthScale, 0.18, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.045, 8, 8]} />
        </mesh>

        {/* Left Arm */}
        <group position={[-0.26 * modifiers.chest, 0.85, 0]}>
          {/* Shoulder joint */}
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.045, 8, 8]} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[-0.15, -0.2, 0]} rotation={[0, 0, Math.PI / 10]} scale={[modifiers.arms, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.04, 0.035, 0.4, 12]} />
          </mesh>
          {/* Elbow joint */}
          <mesh position={[-0.21, -0.4, 0]} material={jointMaterial}>
            <sphereGeometry args={[0.04, 8, 8]} />
          </mesh>
          {/* Forearm */}
          <mesh position={[-0.26, -0.65, 0]} rotation={[0, 0, Math.PI / 12]} scale={[modifiers.arms, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.035, 0.025, 0.4, 12]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[0.26 * modifiers.chest, 0.85, 0]}>
          {/* Shoulder joint */}
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.045, 8, 8]} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[0.15, -0.2, 0]} rotation={[0, 0, -Math.PI / 10]} scale={[modifiers.arms, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.04, 0.035, 0.4, 12]} />
          </mesh>
          {/* Elbow joint */}
          <mesh position={[0.21, -0.4, 0]} material={jointMaterial}>
            <sphereGeometry args={[0.04, 8, 8]} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.26, -0.65, 0]} rotation={[0, 0, -Math.PI / 12]} scale={[modifiers.arms, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.035, 0.025, 0.4, 12]} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group position={[-0.15 * baseWidthScale, 0.1, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.32, 0]} scale={[baseWidthScale, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.09, 0.07, 0.55, 12]} />
          </mesh>
          {/* Knee joint */}
          <mesh position={[0, -0.6, 0]} material={jointMaterial}>
            <sphereGeometry args={[0.045, 8, 8]} />
          </mesh>
          {/* Calf */}
          <mesh position={[0, -0.95, 0]} scale={[baseWidthScale, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.07, 0.04, 0.55, 12]} />
          </mesh>
          {/* Ankle joint */}
          <mesh position={[0, -1.25, 0]} material={jointMaterial}>
            <sphereGeometry args={[0.035, 8, 8]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.15 * baseWidthScale, 0.1, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.32, 0]} scale={[baseWidthScale, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.09, 0.07, 0.55, 12]} />
          </mesh>
          {/* Knee joint */}
          <mesh position={[0, -0.6, 0]} material={jointMaterial}>
            <sphereGeometry args={[0.045, 8, 8]} />
          </mesh>
          {/* Calf */}
          <mesh position={[0, -0.95, 0]} scale={[baseWidthScale, 1, 1]} material={holoMaterial}>
            <cylinderGeometry args={[0.07, 0.04, 0.55, 12]} />
          </mesh>
          {/* Ankle joint */}
          <mesh position={[0, -1.25, 0]} material={jointMaterial}>
            <sphereGeometry args={[0.035, 8, 8]} />
          </mesh>
        </group>
      </group>

      {/* Laser Scanning Ring (Translates Vertically) */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65 * baseWidthScale, 0.015, 8, 36]} />
        <meshBasicMaterial
          color={modifiers.color}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Futuristic scanning grid base */}
      <gridHelper args={[3, 10, modifiers.color, modifiers.color]} position={[0, -1.45, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.2} color={modifiers.color} />
      </gridHelper>
    </group>
  );
}

export function HologramCanvas({
  weight,
  height,
  goal,
}: {
  weight: number;
  height: number;
  goal: "muscle" | "fat" | "fitness";
}) {
  return (
    <div className="w-full h-full relative aspect-square md:aspect-video rounded-xl overflow-hidden glass border border-white/5">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <HologramModel weight={weight} height={height} goal={goal} />
        <Preload all />
      </Canvas>
      {/* Cyberpunk HUD Overlays */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-white/40 pointer-events-none space-y-1">
        <div>SYS_MODEL: HUMAN_GRID_v4.2</div>
        <div>STATUS: ONLINE</div>
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/40 pointer-events-none text-right">
        <div>SCANNING ACTIVE</div>
        <div className="text-red-500 animate-pulse">● REC_PROFILE</div>
      </div>
      {/* HUD Corner decors */}
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/10 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/10 pointer-events-none" />
    </div>
  );
}
