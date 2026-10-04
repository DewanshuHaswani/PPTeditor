import test from 'node:test';
import assert from 'node:assert/strict';
import { localRequest } from '../src/utils/localPersistence.js';

test('an absent local API can use browser recovery even when a host returns JSON for 404', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"message":"Not found"}', { status: 404, headers: { 'Content-Type': 'application/json' } }));
  assert.equal(await localRequest(), null);
});
test('a timed out local save is reported as a failure, not a cancelled file picker', async (t) => {
  t.mock.method(globalThis, 'fetch', (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  await assert.rejects(localRequest('PUT', { slides: [] }, 5), (error) => error.name !== 'AbortError' && error.message.includes('browser backup is kept'));
});
test('save requests preserve server failure messages', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"message":"Disk is full"}', { status: 500, headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(localRequest('PUT', { slides: [] }), /Disk is full/);
});
