import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const textureUrl = '/vfx/hero-explosion.webp'
const vertex = `
attribute vec2 position;
varying vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
`
// One texture lookup, no raymarching, particle simulation or postprocessing.
const fragment = `
precision mediump float;
uniform sampler2D fire;
uniform float time;
uniform float aspect;
varying vec2 uv;
void main() {
  vec2 p = uv;
  float imageAspect = 1.5;
  if (aspect > imageAspect) p.x = (p.x-.5)*aspect/imageAspect+.5;
  else p.y = (p.y-.5)*imageAspect/aspect+.5;
  if (p.x < 0. || p.x > 1. || p.y < 0. || p.y > 1.) { gl_FragColor=vec4(0.); return; }
  float envelope = sin(p.x*3.14159)*sin(p.y*3.14159);
  p.x += sin(p.y*25.-time*1.7+sin(p.x*15.+time))*.007*envelope;
  p.y += sin(p.x*32.-time*2.1+sin(p.y*19.-time))*.009*envelope;
  vec4 sampleColor = texture2D(fire, p);
  vec3 color = sampleColor.rgb;
  float heat = smoothstep(.12,.65,color.r-color.b);
  color *= 1.+heat*.055*sin(time*3.2+p.x*18.+p.y*11.);
  float edge = smoothstep(0.,.07,min(min(p.x,1.-p.x),min(p.y,1.-p.y)));
  float alpha = sampleColor.a * edge;
  gl_FragColor = vec4(color * alpha, alpha);
}
`

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const [artwork, setArtwork] = useState<{ texture: HTMLCanvasElement; url: string } | null>(null)

  useEffect(() => {
    let disposed = false
    const image = new Image()
    image.fetchPriority = 'high'
    image.onload = () => {
      if (disposed) return
      const texture = document.createElement('canvas')
      texture.width = image.naturalWidth
      texture.height = image.naturalHeight
      const context = texture.getContext('2d', { willReadFrequently: true })
      if (!context) return
      context.drawImage(image, 0, 0)
      const pixels = context.getImageData(0, 0, texture.width, texture.height)
      // Remove the baked charcoal background once, for both rendering paths.
      // Recover foreground color so compositing on the page preserves the VFX.
      for (let i = 0; i < pixels.data.length; i += 4) {
        const red = Math.max(0, pixels.data[i] - 29)
        const green = Math.max(0, pixels.data[i + 1] - 29)
        const blue = Math.max(0, pixels.data[i + 2] - 29)
        const alpha = Math.min(1, Math.max(red, green, blue) / 32)
        pixels.data[i] = alpha ? 20 + red / alpha : 0
        pixels.data[i + 1] = alpha ? 20 + green / alpha : 0
        pixels.data[i + 2] = alpha ? 22 + blue / alpha : 0
        pixels.data[i + 3] = Math.round(alpha * 255)
      }
      context.putImageData(pixels, 0, 0)
      setArtwork({ texture, url: texture.toDataURL() })
    }
    image.src = textureUrl
    return () => { disposed = true; image.onload = null }
  }, [])

  useEffect(() => {
    const intro = document.getElementById('top')
    if (!intro) return
    // On narrow screens dim the fixed artwork once text sections reach it.
    const observer = new IntersectionObserver(([entry]) => {
      if (host.current) host.current.dataset.scrolled = String(!entry.isIntersecting)
    }, { rootMargin: '-52px 0px 0px 0px' })
    observer.observe(intro)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = canvas.current
    const container = host.current
    if (!node || !container || reducedMotion || !artwork) return
    const gl = node.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: 'low-power' })
    if (!gl) return
    let frame = 0
    let ready = false
    let visible = false
    let disposed = false
    let elapsed = 0
    let previous = 0
    let lastDraw = 0
    const shaders: WebGLShader[] = []
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    const texture = gl.createTexture()
    if (!program || !buffer || !texture) return
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type)
      if (!shader) continue
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      gl.attachShader(program, shader)
      shaders.push(shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader))
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
      gl.deleteTexture(texture)
      return
    }
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const time = gl.getUniformLocation(program, 'time')
    const aspect = gl.getUniformLocation(program, 'aspect')
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    const draw = () => {
      gl.uniform1f(time, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    const tick = (now: number) => {
      frame = 0
      if (!ready || !visible || document.hidden || disposed) return
      if (previous) elapsed += Math.min((now - previous) / 1000, .1)
      previous = now
      if (now - lastDraw >= 1000 / 30) { draw(); lastDraw = now }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      previous = 0
      frame = 0
      if (ready && visible && !document.hidden && !disposed) frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      // At most 1100 pixels wide, independent of high-DPI device scale.
      const scale = Math.min(1, 1100 / Math.max(width, 1))
      node.width = Math.max(1, Math.round(width * scale))
      node.height = Math.max(1, Math.round(height * scale))
      gl.viewport(0, 0, node.width, node.height)
      gl.uniform1f(aspect, width / Math.max(height, 1))
      if (ready) draw()
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, artwork.texture)
    ready = true
    resize()
    node.style.opacity = '1'
    container.dataset.animated = 'true'
    sync()
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(container)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(container)
    const contextLost = (event: Event) => {
      event.preventDefault()
      ready = false
      node.style.opacity = '0'
      delete container.dataset.animated
      sync()
    }
    node.addEventListener('webglcontextlost', contextLost)
    document.addEventListener('visibilitychange', sync)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      node.removeEventListener('webglcontextlost', contextLost)
      node.style.opacity = '0'
      delete container.dataset.animated
      shaders.forEach(shader => gl.deleteShader(shader))
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [reducedMotion, artwork])

  return (
    <div ref={host} className="rw-explosion-visual" aria-hidden="true">
      {artwork && <img src={artwork.url} alt="" width="1536" height="1024" />}
      <canvas ref={canvas} style={{ opacity: 0 }} />
    </div>
  )
}
