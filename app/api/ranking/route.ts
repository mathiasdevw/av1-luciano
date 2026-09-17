import {database,databaseConfigured} from '@/lib/database';
import {BANK_VERSION} from '@/lib/quiz-core';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 if(!databaseConfigured())return Response.json({configured:false,rows:[]},{headers:{'Cache-Control':'no-store'}});
 try{const sql=database();const rows=await sql`SELECT nickname,score,finished_at FROM av1_attempts WHERE finished_at IS NOT NULL AND bank_version=${BANK_VERSION} ORDER BY score DESC,finished_at ASC,id ASC LIMIT 50`;
 return Response.json({configured:true,rows},{headers:{'Cache-Control':'no-store'}});
 }catch{console.error('ranking_request_failed');return Response.json({error:'Não foi possível carregar o ranking. Tente novamente.'},{status:503});}
}
