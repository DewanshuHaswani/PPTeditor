# All Hands launch film — production notes

The film uses the Brag production workflow, with Hyperframes for deterministic animation and rendering. 92 seconds is an intentional exception to Brag’s teaser default because the requested film explains the editor and every major feature area.

## Reference and source integrity
The supplied Napkin launch film was reviewed as a 12-frame contact sheet: clean light space, large chapter headlines, dimensional screenshot movement and close feature demonstrations informed the pacing. Its footage, branding and soundtrack are not reused. The product footage is captured from this repository’s real production build using an isolated fictional workshop deck. Actual ZIP output was opened with network offline. No private local presentation data was read or exposed.

## Generated artwork
Built-in imagegen produced one demo slide asset, copied to `composition/assets/artwork/ideas-in-motion.png`. This is illustrative slide content, not fabricated interface. The prompt is below.

Create a premium presentation slide background for a fictional creative workshop titled Ideas in motion. This is purely an illustration/background, NO TEXT, NO letters, NO UI, NO logos. Wide 16:9 composition. A sculptural folded ivory paper ribbon forms an elegant rising arch and subtly transitions into translucent periwinkle glass, situated on a light warm ivory architectural stage with soft directional studio sunlight, gentle tactile shadows and a small saturated indigo accent. Sophisticated product-launch visual, photoreal 3D art direction, understated museum-like composition. Keep the left 45 percent almost empty with warm light neutral surface so the actual presentation app can overlay dark title text; sculpture primarily on the right. Clean premium material detail, calm, crisp, luminous. No generic neon, no particles, no technology circuitry.

## Sound provenance
Music: Brag bundled Happy Beats / Business Moves vol. 12 by ende.app, sourced from the Brag skill asset pack. Sound effects: selected Brag bundled Kenney CC0 library and keyboard pack (unicae_games CC0) where used. See `asset-licenses.md` for exact upstream terms. Narration: local Kokoro af_heart through Hyperframes, generated from the published scene script. Audio is mixed for intelligible voice, restrained effects and smooth fades.

## Feature boundaries
The app exports a live HTML ZIP, not a PPTX. Email is an attachment workflow; no automatic sending is claimed. Offline viewing begins after ZIP extraction and double-clicking Open Presentation.html. External quiz destinations require a network connection. Local disk autosave is demonstrated on the local Vite server; hosted static deployments save through a picker or JSON download.

## Final mastering
The final MP4 uses a two-pass EBU R128 loudness master targeting −16 LUFS with −1.5 dB true peak. The video stream remains unchanged after poster insertion. Exact output measurements are in audio-analysis.txt.
