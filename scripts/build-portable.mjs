import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = await build({
  configFile: false, root, publicDir: false, plugins: [react()],
  resolve: { alias: { '@': path.join(root, 'src') } },
  build: {
    write: false, minify: true, cssCodeSplit: false, reportCompressedSize: false,
    rollupOptions: { input: path.join(root, 'src/portable.jsx'), output: { format: 'iife', inlineDynamicImports: true, name: 'AHMPresentation' } }
  }
});
const assets = {};
async function collect(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    if (item.isDirectory()) await collect(filename);
    else {
      const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }[path.extname(filename)];
      if (mime) assets['/' + path.relative(path.join(root, 'public'), filename).split(path.sep).join('/')] = `data:${mime};base64,${(await readFile(filename)).toString('base64')}`;
    }
  }
}
await collect(path.join(root, 'public/assets'));
const js = result.output.filter((item) => item.type === 'chunk').map((item) => item.code).join('\n').replace(/<\/script/gi, '<\\/script');
const css = result.output.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css')).map((item) => item.source).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Live Presentation</title><style>${css}</style></head><body><div id="root"></div><script type="application/json" id="presentation-data">__PRESENTATION_DATA__</script><script>window.__AHM_ASSETS__=${JSON.stringify(assets)};</script><script>${js}</script></body></html>`;
await mkdir(path.join(root, 'public'), { recursive: true });
await writeFile(path.join(root, 'public/portable-template.html'), html);
console.log(`Offline viewer generated (${(html.length / 1024 / 1024).toFixed(1)} MB).`);
