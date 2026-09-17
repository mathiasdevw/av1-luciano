import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connection) {
  console.error('Configure DATABASE_URL em .env.local antes de executar.');
  process.exit(1);
}
const sql = postgres(connection, { max: 1, connect_timeout: 10, prepare: false });
try {
  const migration = await readFile(new URL('../database/001_initial.sql', import.meta.url), 'utf8');
  // SQL estático versionado no projeto, sem conteúdo fornecido pelo usuário.
  await sql.begin(async transaction => {
    for (const statement of migration.split(';').map(s => s.trim()).filter(Boolean)) {
      await transaction.unsafe(statement);
    }
  });
  console.log('Banco do ranking preparado.');
} catch {
  console.error('Não foi possível preparar o banco. Confira conexão, TLS e permissões.');
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
