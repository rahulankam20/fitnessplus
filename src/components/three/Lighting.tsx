"use client";

// ============================================
// Lighting – Cinematic scene lighting setup
// Red rim light + soft white key light
// ============================================

export default function Lighting() {
  return (
    <>
      {/* Ambient – very low, to keep shadows dramatic */}
      <ambientLight intensity={0.15} color="#ffeedd" />

      {/* Key light – soft white from upper right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Red rim light – from behind/left for dramatic red edge */}
      <pointLight
        position={[-4, 2, -3]}
        intensity={30}
        color="#ff0000"
        distance={20}
        decay={2}
      />

      {/* Secondary red accent light – from upper right */}
      <pointLight
        position={[3, 4, -2]}
        intensity={15}
        color="#ff2200"
        distance={15}
        decay={2}
      />

      {/* Fill light – subtle from below to show underside detail */}
      <pointLight
        position={[0, -3, 2]}
        intensity={5}
        color="#330000"
        distance={10}
        decay={2}
      />

      {/* Spot light – dramatic top-down highlight */}
      <spotLight
        position={[0, 10, 0]}
        intensity={20}
        angle={0.4}
        penumbra={0.8}
        color="#ffffff"
        distance={25}
        decay={2}
      />
    </>
  );
}
