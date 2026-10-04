import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { validatePresentation, safeFilename } from '../src/utils/presentationFile.js';
import { localPresentationPlugin } from '../server/localPresentation.js';

const deck = (title = 'Text') => ({ eventTitle: 'All Hands', slides: [{ id: 'one', type: 'content', title, sections: [{ id: 'section', text: 'First\n\nSecond ', bullets: ['One', '', 'Two '], images: [], blocks: [] }] }] });
test('imports reject malformed decks and preserve whitespace', () => {
  assert.equal(validatePresentation(deck()).slides[0].sections[0].bullets[2], 'Two ');
  for (const invalid of [null, {}, { slides: [] }, { slides: [{ id: 'x', type: 'unknown' }] }, { slides: [{ id: 'x', type: 'content', sections: {} }] }, { slides: [{ id: 'x', type: 'content', title: {} }] }, { slides: [{ id: 'x', type: 'content', sections: [{ id: 's', bullets: [4] }] }] }]) assert.throws(() => validatePresentation(invalid));
  assert.throws(() => validatePresentation({ slides: [deck().slides[0], deck().slides[0]] }));
  for (const image of [[], 5, 'image', { src: 'x', fit: {} }, { details: ['Unexpected array'] }]) {
    const invalid = deck();
    invalid.slides[0].sections[0].blocks = [{ id: 'image-block', type: 'image', image }];
    assert.throws(() => validatePresentation(invalid));
  }
  const executable = deck(); executable.slides[0].link = 'javascript:alert(1)';
  assert.throws(() => validatePresentation(executable));
  assert.equal(safeFilename('All Hands / <Meet>'), 'All-Hands-Meet');
});
test('local server commits to disk, reloads and rejects invalid or cross-origin writes', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'ahm-unit-'));
  let middleware;
  localPresentationPlugin(directory).configureServer({ middlewares: { use: (value) => { middleware = value; } } });
  const server = http.createServer((req, res) => middleware(req, res, () => { res.statusCode = 404; res.end(); }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/presentation`;
  const put = (data, headers = {}) => fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(data) });
  try {
    assert.equal((await (await fetch(url)).json()).data, null);
    const savedReply = await put(deck('हिंदी 😀'));
    assert.equal(savedReply.status, 200);
    assert.ok((await savedReply.json()).savedAt > 0);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, '.local/presentation.json'), 'utf8')), deck('हिंदी 😀'));
    assert.equal((await (await fetch(url)).json()).data.slides[0].title, 'हिंदी 😀');
    assert.equal((await put({ slides: [] })).status, 400);
    assert.equal((await put(deck('Bad'), { Origin: 'https://untrusted.example' })).status, 403);
    assert.equal((await (await fetch(url)).json()).data.slides[0].title, 'हिंदी 😀');
    await Promise.all(Array.from({ length: 5 }, (_, index) => put(deck(`Save ${index}`))));
    const saved = JSON.parse(await readFile(path.join(directory, '.local/presentation.json'), 'utf8'));
    assert.match(saved.slides[0].title, /^Save [0-4]$/);
  } finally { await new Promise((resolve) => server.close(resolve)); await rm(directory, { recursive: true, force: true }); }
});
