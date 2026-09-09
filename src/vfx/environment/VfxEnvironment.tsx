// Fog is configured in HeroScene's onCreated callback (scene is a callback
// parameter there, which avoids the react/immutability lint constraint on
// hook-returned values).

import { GridFloor } from './GridFloor'

export function VfxEnvironment() {
  return (
    <>
      {/* Ambient — cool-neutral tone, slightly brighter than before to reveal
          the grid floor in the static/aftermath state. Kept very dim so the
          explosion remains the dominant light source. */}
      <ambientLight intensity={0.10} color="#b8c0cc" />

      {/* Opaque ground plane — receives Three.js point-light illumination from
          the explosion so the blast lights up the floor area.  meshStandard
          handles fog automatically, dissolving the ground into the background
          at the horizon without a hard seam. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0d0f12"
          roughness={0.94}
          metalness={0.02}
        />
      </mesh>

      {/* Grid overlay — transparent ShaderMaterial with procedural lines.
          Floats 3 mm above the ground to avoid z-fighting. */}
      <GridFloor />
    </>
  )
}
