// Fog is configured in HeroScene's onCreated callback (scene is a callback
// parameter there, which avoids the react/immutability lint constraint on
// hook-returned values).

export function VfxEnvironment() {
  return (
    <>
      {/* Minimal ambient — just enough to reveal ground silhouette in darkness */}
      <ambientLight intensity={0.06} color="#1c0e06" />

      {/* Ground plane — large, very dark, StandardMaterial so the explosion
          PointLight illuminates it visibly without pre-baked lighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#080604" roughness={0.92} metalness={0.05} />
      </mesh>
    </>
  )
}
