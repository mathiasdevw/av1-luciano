import {neon} from '@neondatabase/serverless';
export function databaseConfigured(){return Boolean(process.env.DATABASE_URL||process.env.POSTGRES_URL);}
export function database(){
 const connection=process.env.DATABASE_URL||process.env.POSTGRES_URL;
 if(!connection)throw new Error('Banco não configurado');
 return neon(connection);
}
