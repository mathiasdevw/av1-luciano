import { spawnSync } from 'node:child_process';
const configured = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
if (process.env.VERCEL_ENV === 'production' && !configured) {
  console.error('Deploy de produção exige DATABASE_URL. Configure o PostgreSQL hospedado nas variáveis da Vercel.');
  process.exit(1);
}
if (configured) {
  const result = spawnSync(process.execPath, ['scripts/setup-db.mjs'], { stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) process.exit(1);
} else {
  console.log('Preview sem banco: somente modo treino.');
}
