# Tara app asset verification

Rendered on 4 October 2026 with Node 24.18.0 and the project-pinned HyperFrames CLI. Source composition ID: `tara-celebration`.

- HyperFrames `check .`: 0 lint errors or warnings, 0 runtime errors or warnings, 0 layout issues across 9 samples, 0 motion errors or warnings. No text appears, so contrast text checks are 0/0.
- Proof snapshots: 0, 0.8, 1.5, 2.8 and 2.91 seconds. `snapshots/contact-sheet.jpg` visually inspected.
- Render: `hyperframes render . --skill=motion-graphics -q delivery -o renders/video.mp4` succeeded. Capture summary: drawelement capture, hardware GPU, 4.9 seconds wall time. Small-frame heuristic warned during calibration and recovered with one worker. Runtime self-verification passed at frames 23, 45, 68 and 86.
- FFprobe confirms H.264, 480x360, 30 fps, exactly 90 frames and 3.000 seconds, 176440 bytes. There is one video stream and no audio stream.
- Frames extracted from the actual MP4 at frames 0, 24, 45 and 84 were visually inspected in `renders/render-contact-sheet.jpg`. Original Tara silhouette, finite hop, confetti burst and final settled pose are visible without cropping or blank frames.

App deliverables: `public/learning/tara-celebration.mp4` and `public/learning/tara-celebration-poster.jpg`. App integration must play this once, obey reduced-motion and quiet preferences, and retain a static fallback. The clip itself contains no narration, music or sound effects.
