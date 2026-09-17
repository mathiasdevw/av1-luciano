import postgres from 'postgres';

const state = globalThis as typeof globalThis & {
  av1Postgres?: ReturnType<typeof postgres>;
};

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

export function database() {
  const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connection) throw new Error('Banco não configurado');
  // Reutiliza a conexão nesta instância. TLS segue as opções da URL do provedor.
  state.av1Postgres ??= postgres(connection, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  return state.av1Postgres;
}
