import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connection) throw new Error('Configure o banco de teste em .env.local.');
const base = process.env.TEST_BASE_URL || 'http://localhost:5173';
const sql = postgres(connection, { max: 1, connect_timeout: 10 });
const bank = JSON.parse(await readFile(new URL('../lib/content/study.json', import.meta.url), 'utf8'));
let attemptId;
async function post(body) {
  const response = await fetch(`${base}/api/quiz`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}
try {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(health.headers.get('cache-control'), 'no-store');
  const oversized = await post({ action: 'start', nickname: 'a'.repeat(13000) });
  assert.equal(oversized.status, 413);
  const invalidId = await post({ action: 'finish', id: '-'.repeat(36), secret: '0'.repeat(64), answers: Array(25).fill(0) });
  assert.equal(invalidId.status, 400);
  const started = await post({ action: 'start', nickname: 'Teste integração' });
  assert.equal(started.status, 200);
  assert.equal(started.data.mode, 'ranked');
  const exam = started.data;
  attemptId = exam.id;
  assert.equal(exam.questions.length, 25);
  const rows = await sql`SELECT * FROM av1_attempts WHERE id=${attemptId}::uuid`;
  assert.equal(rows.length, 1);
  assert.ok(Array.isArray(rows[0].question_ids));
  assert.equal(rows[0].finished_at, null);
  assert.notEqual(rows[0].secret_hash, exam.secret);
  const answers = exam.questions.map(q => bank.questions.find(item => item.id === q.id).answer);
  const payload = { action: 'finish', id: attemptId, secret: exam.secret, answers };
  const finished = await post(payload);
  assert.equal(finished.status, 200);
  assert.equal(finished.data.score, 25);
  assert.equal(finished.data.saved, true);
  // Um novo envio não pode sobrescrever uma tentativa já concluída.
  const duplicate = await post({ ...payload, answers: answers.map(a => (a + 1) % 4) });
  assert.equal(duplicate.data.score, 25);
  const unauthorized = await post({ ...payload, secret: '0'.repeat(64) });
  assert.equal(unauthorized.status, 404);
  const saved = await sql`SELECT score,answers,finished_at FROM av1_attempts WHERE id=${attemptId}::uuid`;
  assert.equal(saved[0].score, 25);
  assert.deepEqual(saved[0].answers, answers);
  assert.ok(saved[0].finished_at);
  const ranking = await (await fetch(`${base}/api/ranking`)).json();
  assert.equal(ranking.configured, true);
  assert.ok(ranking.rows.some(row => row.nickname === 'Teste integração' && row.score === 25));
  console.log('PostgreSQL: criação, persistência JSON, correção, reenvio idempotente, segredo e ranking validados.');
} finally {
  // Remove exclusivamente a tentativa criada por esta execução.
  if (attemptId) await sql`DELETE FROM av1_attempts WHERE id=${attemptId}::uuid AND nickname='Teste integração'`;
  await sql.end({ timeout: 5 });
}
