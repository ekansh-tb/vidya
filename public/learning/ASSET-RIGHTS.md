# Vidya learning assets

Tara's 3D mesh, original companion drawing and construction blocks are original Vidya artwork. The reproducible mesh source is `scripts/build-tara-model.mjs`. No downloaded stock models, textures or third-party character designs are used.

The current WebGL model is `tara-model-v2.json`. The previous mesh path remains available for older clients. GSAP 3.15.0 controls finite hover/focus/tap reactions; Three.js renders only while a reaction or resize needs a frame. Motion stops on hidden pages, teardown and context loss. Reduced motion uses the resting pose or original illustration.

The silent three-second celebration was rendered using HyperFrames from the original Tara drawing and its installed confetti component. Composition, dependency license and validation are recorded in `videos/tara-celebration/`. It is played once, with no audio stream and a static companion fallback for reduced motion or failed media loading.
