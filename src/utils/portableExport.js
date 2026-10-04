import { zip, strToU8 } from 'fflate';
import { downloadFile, safeFilename } from './presentationFile';

async function embedRemoteImages(data) {
  const copy = structuredClone(data);
  const cache = new Map();
  async function visit(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      if (['src', 'heroImage'].includes(key) && typeof item === 'string' && item && !item.startsWith('data:') && !item.startsWith('/assets/')) {
        if (!cache.has(item)) cache.set(item, (async () => {
          const response = await fetch(item);
          if (!response.ok) throw new Error('An image could not be included. Upload it from your computer and retry.');
          const blob = await response.blob();
          if (!blob.type.startsWith('image/')) throw new Error('An image URL did not return an image. Upload the image and retry.');
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Unable to package an image.'));
            reader.readAsDataURL(blob);
          });
        })());
        value[key] = await cache.get(item);
      } else await visit(item);
    }
  }
  await visit(copy);
  return copy;
}

export async function exportPortable(data) {
  const response = await fetch('/portable-template.html', { cache: 'no-cache' });
  if (!response.ok) throw new Error('Offline viewer is missing. Run npm run build and restart the app.');
  const template = await response.text();
  if (!template.includes('__PRESENTATION_DATA__')) throw new Error('Offline viewer is unavailable. Run npm run build.');
  const packaged = await embedRemoteImages(data);
  const json = JSON.stringify(packaged).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const html = template.replace('__PRESENTATION_DATA__', () => json);
  const files = {
    'Open Presentation.html': strToU8(html),
    'presentation.json': strToU8(JSON.stringify(data, null, 2)),
    'READ ME.txt': strToU8('Extract this ZIP first. Double-click Open Presentation.html to open the complete live presentation in Chrome, Edge, Firefox or Safari. No server or internet connection is needed for slides, images, timer, story and movie views. Quiz links need internet. Use arrow keys or Space to navigate, Home/End to jump, and F for fullscreen. Use Notes for speaker notes and the session clock. Import presentation.json into the editor to continue editing. Attach the ZIP to your email; large files may need a file-sharing link. This is a web presentation, not a PowerPoint .pptx file.\n')
  };
  const bytes = await new Promise((resolve, reject) => zip(files, { level: 6 }, (error, result) => error ? reject(error) : resolve(result)));
  const blob = new Blob([bytes], { type: 'application/zip' });
  const name = `${safeFilename(data.eventTitle)}-web-presentation.zip`;
  downloadFile(blob, name);
  return { blob, name };
}
