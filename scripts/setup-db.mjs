import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import postgres from 'postgres';

const connection = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connection) {
  console.error('Configure DATABASE_URL antes de preparar o banco.');
  process.exit(1);
}
const sql = postgres(connection, { max: 1, connect_timeout: 15, prepare: false });
try {
  const directory = new URL('../database/', import.meta.url);
  const files = (await readdir(directory)).filter(name => /^\d+_.*\.sql$/.test(name)).sort();
  await sql.begin(async transaction => {
    // Serializa deploys concorrentes; o lock é liberado junto com a transação.
    await transaction`SELECT pg_advisory_xact_lock(734102591)`;
    await transaction`CREATE TABLE IF NOT EXISTS av1_schema_migrations (
      name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    for (const name of files) {
      const source = await readFile(new URL(name, directory), 'utf8');
      const checksum = createHash('sha256').update(source).digest('hex');
      const existing = await transaction`SELECT checksum FROM av1_schema_migrations WHERE name=${name}`;
      if (existing.length) {
        if (existing[0].checksum !== checksum) throw new Error('Migration aplicada foi alterada. Crie uma nova migration.');
        continue;
      }
      // SQL local versionado; nenhum texto recebido de visitantes é executado aqui.
      await transaction.unsafe(source).simple();
      await transaction`INSERT INTO av1_schema_migrations (name,checksum) VALUES (${name},${checksum})`;
      console.log(`Migration aplicada: ${name}`);
    }
  });
  console.log('Banco do ranking atualizado.');
} catch {
  console.error('Falha ao preparar banco. Verifique conexão, TLS, permissões e integridade das migrations aplicadas.');
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
