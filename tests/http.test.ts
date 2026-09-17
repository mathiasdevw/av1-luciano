import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLimitedBody, BodyTooLarge } from '../lib/http.ts';

test('lê JSON válido e preserva caracteres acentuados', async () => {
  const value = '{"nome":"João"}';
  assert.equal(await readLimitedBody(new Request('http://localhost', { method: 'POST', body: value })), value);
});
test('limita o corpo real mesmo sem Content-Length', async () => {
  await assert.rejects(readLimitedBody(new Request('http://localhost', { method: 'POST', body: 'a'.repeat(12001) })), BodyTooLarge);
});
test('o limite considera bytes UTF-8', async () => {
  await assert.rejects(readLimitedBody(new Request('http://localhost', { method: 'POST', body: 'á'.repeat(6001) })), BodyTooLarge);
});
