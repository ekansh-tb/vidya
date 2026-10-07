# Welcome motion delivery

Verified on 7 October 2026 using HyperFrames 0.8.140 and Node 24.18.0.

## Delivered assets

- `public/learning/vidya-welcome.mp4`: 6.000 seconds, 720 x 360, H.264, 30 fps, 180 frames, 64,666 bytes. No audio stream. SHA256 `073ddb0f4dd06763a573fd2354088cdf71b3e8311053a11f7279a35f7ee46076`.
- `public/learning/vidya-welcome.svg`: 720 x 360 viewBox, 1,550 bytes, original locale-neutral artwork. SHA256 `8efa228198c2c6f3ab9ced5493e0ae62615f2f0d5effaaa7baf8a492caabc735`.

The original book, investigation lens and geometric creation appear in sequence and share a drawn path. Motion ends at 3.85 seconds; the final arrangement holds through the encoded final frame. No old intro or companion celebration is reused. Introductory copy and mission navigation belong to accessible page HTML outside the video.

## Verification

- Lint: 0 errors, 0 warnings.
- Final `hyperframes check`: successful browser runtime and layout sweep. Motion assertions enabled across 121 samples, covering appearance, order, individual frame bounds and the intentional final hold. No findings.
- The first motion check did not discover the nested sidecar. It was moved to `index.motion.json`. One plural frame-bound selector was then split into three unique IDs; the final check evaluated and passed every assertion.
- Proof snapshots inspected at 0, 0.6, 2.25, 3.8, 5.5 and 5.966 seconds. Contact sheet and focused creation reveal inspected.
- Encoded MP4 frames at 0.6, 2.25 and 5.9 seconds extracted for inspection. Opening and final hold match the composition and static fallback.
- Render completed in 9.4 seconds using drawElement capture with hardware GPU. A deterministic small-frame warning was re-captured and accepted by the renderer; encoded frames verified correctly.
- FFprobe confirms the actual dimensions, duration, frame rate, frame count and absence of audio.
- Doctor found Chrome, FFmpeg and Node available. Its overall false result came from unused optional narration and music generators; no installation was needed.
- Usage snapshot before rendering: weekly 16% used, 84% remaining. This is an account snapshot, not a cost estimate.

App playback, reduced-motion and failed-media behavior require browser acceptance of the integrated application. This asset report does not establish developmental effectiveness or retention improvement.

## Reproduce

From this project directory:

```sh
npm run check
npx hyperframes snapshot --at 0,0.6,2.25,3.8,5.5,5.966
npx hyperframes render . --quality delivery --workers 1 --output ../../public/learning/vidya-welcome.mp4
```

The project pins HyperFrames 0.8.140. The `flowchart` source is adapted in place and retains its provenance and Apache 2.0 license. All learning objects are original SVG geometry; no external media or fonts are needed.

Studio: `http://localhost:7318/#project/vidya-welcome-motion`. The running editor permits direct changes. Its Edit with Framey button offers the HyperFrames desktop app for chat-based changes: https://hyperframes.dev/studio/download

Proof artifacts are kept outside Git in the task's `vidya-balanced-landing-oct7` visualization folder as `welcome-motion-contact-sheet.jpg` and `welcome-motion-encoded-hold.png`. Intermediate renders, snapshots, generated guides and check logs are not delivery source.
