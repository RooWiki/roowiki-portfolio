# Hero VFX

The hero uses an AI-generated, compressed 1536 × 1024 WebP texture (190 KiB), animated with a single WebGL quad. Sinusoidal UV displacement and heat-masked brightness modulation provide continuous flame motion. This is a stylized animated texture, not a simulated explosion lifecycle or fluid volume. The legacy Three.js effects remain available in source, but are no longer imported by the hero or bundled into the application.

The renderer caps width at 1100 physical pixels and rendering at 30 Hz. IntersectionObserver and page visibility stop animation offscreen and in hidden tabs. Reduced motion skips WebGL; a normal image also provides the fallback when WebGL is unavailable or its context is lost. Context loss keeps the image visible until remount. GPU resources and observers are released on cleanup.

The hero layout alone changes to a left-to-right plume and cream script typography. Existing content sections are unchanged. The script font uses Google Fonts with a serif fallback.

Validation: npm run build and npm run lint pass. Chromium checks at 1600 × 900 and 390 × 844 produced no page errors or mobile horizontal overflow. Draw-call instrumentation measured 22 draws in one second under headless software rendering, zero draws offscreen and zero with reduced motion. This validates scheduling, not a hardware FPS benchmark or measured speedup over production. Production output: 211.18 kB JS (66.21 kB gzip).
