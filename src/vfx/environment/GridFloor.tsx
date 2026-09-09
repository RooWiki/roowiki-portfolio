import { useMemo } from 'react'
import { PlaneGeometry, ShaderMaterial, NormalBlending } from 'three'
import { gridVertexShader, gridFragmentShader, GRID_UNIFORMS } from './GridFloorMaterial'

// Static geometry shared for the lifetime of the app.
const _geo = new PlaneGeometry(100, 100)

// ─── Component ────────────────────────────────────────────────────────────────
// No useFrame needed — all uniforms are static (fog params don't change).
// The grid shader handles distance fading internally via vFogDepth.

export function GridFloor() {
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader:   gridVertexShader,
    fragmentShader: gridFragmentShader,
    uniforms: {
      // Deep-copy of the static uniform descriptors so each mount gets its own objects
      uFogDensity: { value: GRID_UNIFORMS.uFogDensity.value },
      uFogColor:   { value: { ...GRID_UNIFORMS.uFogColor.value } },
    },
    transparent: true,
    depthWrite:  false,   // don't disturb depth buffer written by opaque ground
    depthTest:   true,
    blending:    NormalBlending,
    // fwidth() is a built-in in WebGL2 — no extension pragma needed
  }), [])

  return (
    // y = 0.003: 3 mm above opaque ground to prevent z-fighting.
    // renderOrder = -1: ensures the grid renders before all other transparent
    // objects (scorch, dust, sparks) so they appear on top of the grid.
    <mesh
      geometry={_geo}
      material={mat}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.003, 0]}
      renderOrder={-1}
    />
  )
}
