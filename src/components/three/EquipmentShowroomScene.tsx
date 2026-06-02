"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import Dumbbell from "./Dumbbell";
import Kettlebell from "./Kettlebell";
import Barbell from "./Barbell";
import Lighting from "./Lighting";

interface ShowroomSceneProps {
  activeItem: "dumbbell" | "kettlebell" | "barbell";
}

function ShowroomPedestal() {
  return (
    <group position={[0, -0.65, 0]}>
      {/* Dark base pedestal */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.6, 0.12, 48]} />
        <meshStandardMaterial color="#111111" metalness={0.85} roughness={0.35} />
      </mesh>
      
      {/* Neon glow ring */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.48, 0.02, 8, 48]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

export default function EquipmentShowroomScene({ activeItem }: ShowroomSceneProps) {
  return (
    <div className="w-full h-full relative aspect-square md:aspect-video rounded-xl overflow-hidden glass border border-white/5">
      <Canvas
        camera={{ position: [0, 0.6, 3.8], fov: 45 }}
        dpr={[1, 1.5]}
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
          <color attach="background" args={["#030303"]} />
          <fog attach="fog" args={["#030303", 4, 10]} />

          <Lighting />

          {/* Pedestal base */}
          <ShowroomPedestal />

          {/* Active Equipment */}
          {activeItem === "dumbbell" && (
            <Dumbbell scale={1.3} position={[0, 0.25, 0]} />
          )}
          {activeItem === "kettlebell" && (
            <Kettlebell scale={1.4} position={[0, 0.35, 0]} />
          )}
          {activeItem === "barbell" && (
            <Barbell scale={0.9} position={[0, 0.25, 0]} />
          )}

          {/* Controls – Drag to rotate, zoom */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2.2}
            maxDistance={6.0}
            maxPolarAngle={Math.PI / 2 - 0.05} // Lock camera from going below ground
            autoRotate={true}
            autoRotateSpeed={0.6}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
