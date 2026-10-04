# All Hands — Ideas in motion

A finished product launch film showcasing the real presentation editor, editable objects, image controls, layouts, presentation shortcuts, Story and Movie modes, timer, local saves, and offline web ZIP sharing.

- **Video:** [brag.mp4](brag.mp4) — 1920×1080, 16:9, 30 fps, 92 seconds, H.264 MP4 with narration, music and motion-matched sound design.
- **Poster:** [brag.jpg](brag.jpg) — also baked into frame zero of the MP4.
- **Creative plan:** [brag-plan.md](brag-plan.md).
- **Editable composition:** [composition/index.html](composition/index.html).
- **Source and image-generation prompt:** [production-notes.md](production-notes.md).
- **Music and asset credits:** [asset-licenses.md](asset-licenses.md).
- **Canonical launch caption:** [share-copy.txt](share-copy.txt).

## Edit and render

Use Node.js 22 or newer, FFmpeg, and the pinned Hyperframes CLI. Assets and runtime files are local. From `composition/`:

```sh
npm install
npm run check
npx --yes hyperframes@0.8.125 preview --background
npm run render -- --quality delivery --fps 30 --output ../brag.mp4
cd ..
node finish-export.mjs
node master-audio.mjs
```

Open the printed Studio project URL to inspect or edit the timeline. The film uses simulated pointer motion over real captured interface states; its fictional workshop deck avoids personal or organization data. The offline screenshot was captured from the actual ZIP's extracted HTML with the browser network disabled.

`capture-product.mjs` reproduces the UI screenshots against this repository's production build in an isolated temporary data directory; run `npm run build` in the repository first. `generate-voice.mjs` regenerates narration using Kokoro af_heart through Hyperframes; set `HYPERFRAMES_PYTHON` to a Python environment with `kokoro-onnx` and `soundfile`. Model and virtual-environment caches are not shipped.

When publishing the MP4 elsewhere, include the music attribution from `asset-licenses.md` in the description. No creator or source attribution is displayed inside the product film.
