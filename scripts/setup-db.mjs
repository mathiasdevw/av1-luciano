import {readFile} from 'node:fs/promises';
import {neon} from '@neondatabase/serverless';
const connection=process.env.DATABASE_URL||process.env.POSTGRES_URL;
if(!connection){console.error('Configure DATABASE_URL do Neon em .env.local antes de executar.');process.exit(1);}
const sql=neon(connection);
const migration=await readFile(new URL('../database/001_initial.sql',import.meta.url),'utf8');
try{
 for(const statement of migration.split(';').map(s=>s.trim()).filter(Boolean))await sql.query(statement);
 console.log('Banco do ranking preparado.');
}catch{console.error('Não foi possível preparar o banco. Confira a conexão e as permissões.');process.exit(1);}
