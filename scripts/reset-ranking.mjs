import postgres from 'postgres';

if (!process.argv.includes('--confirm')) {
  console.error('Este comando apaga todas as tentativas e notas do banco configurado. Para confirmar: npm run db:reset -- --confirm');
  process.exit(1);
}
const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connection) {
  console.error('Configure DATABASE_URL para o banco que deseja zerar.');
  process.exit(1);
}
const sql = postgres(connection, { max: 1, connect_timeout: 10, prepare: false });
try {
  await sql`TRUNCATE TABLE av1_attempts`;
  console.log('Tentativas e ranking zerados. Questões e migrations preservadas.');
} catch {
  console.error('Não foi possível zerar o ranking. Confira conexão e permissões.');
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
