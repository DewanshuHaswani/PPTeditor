import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { validatePresentation } from '../src/utils/presentationFile.js';

export function localPresentationPlugin(root) {
  const directory = path.join(root, '.local');
  const filename = path.join(directory, 'presentation.json');
  let writes = Promise.resolve();
  const middleware = async (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/presentation') return next();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
    // Disk writes are restricted to the local app, including on the preview server.
    const host = req.headers.host || '';
    const origin = req.headers.origin;
    if (!/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(host) || (origin && origin !== `http://${host}`) || req.headers['sec-fetch-site'] === 'cross-site') {
      return reply(403, { message: 'Local saves are available only from the local editor.' });
    }
    try {
      if (req.method === 'GET') {
        await writes;
        let data = null;
        try { data = validatePresentation(JSON.parse(await readFile(filename, 'utf8'))); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
        return reply(200, { data, path: '.local/presentation.json' });
      }
      if (req.method !== 'PUT') return reply(405, { message: 'Method not allowed.' });
      if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { message: 'Expected JSON.' });
      req.setEncoding('utf8');
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
        if (Buffer.byteLength(body) > 100 * 1024 * 1024) return reply(413, { message: 'Presentation exceeds the 100 MB save limit.' });
      }
      const data = validatePresentation(JSON.parse(body));
      const operation = writes.catch(() => {}).then(async () => {
        await mkdir(directory, { recursive: true });
        await writeFile(`${filename}.tmp`, JSON.stringify(data, null, 2), 'utf8');
        await rename(`${filename}.tmp`, filename);
      });
      writes = operation.catch(() => {});
      await operation;
      return reply(200, { path: '.local/presentation.json' });
    } catch (error) { return reply(500, { message: error.message || 'Unable to save presentation on disk.' }); }
  };
  return {
    name: 'local-presentation',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); }
  };
}
