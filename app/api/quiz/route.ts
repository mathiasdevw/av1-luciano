import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {database,databaseConfigured} from '@/lib/database';
import {createExam,grade,validateAnswers,BANK_VERSION} from '@/lib/quiz-core';
import data from '@/lib/content/study.json';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
function validIds(ids:unknown):ids is number[]{return Array.isArray(ids)&&ids.length===25&&new Set(ids).size===25&&ids.every(id=>Number.isInteger(id)&&data.questions.some(q=>q.id===id));}
export async function POST(request:Request){
 try{
  const origin=request.headers.get('origin');
  if(origin&&new URL(origin).origin!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
  if(Number(request.headers.get('content-length')||0)>12000)return json({error:'Solicitação muito grande.'},413);
  const raw=await request.text();if(raw.length>12000)return json({error:'Solicitação muito grande.'},413);
  let p;try{p=JSON.parse(raw);}catch{return json({error:'Dados inválidos.'},400);}
  if(!p||typeof p!=='object')return json({error:'Dados inválidos.'},400);
  const ranked=databaseConfigured();
  if(p.action==='start'){
   const nickname=typeof p.nickname==='string'?p.nickname.trim():'';
   if(nickname.length<2||nickname.length>24||/[\u0000-\u001f]/.test(nickname))return json({error:'Use um apelido de 2 a 24 caracteres.'},400);
   const chosen=createExam(data.questions);const id=randomUUID(),secret=randomBytes(32).toString('hex');
   if(ranked){const sql=database();await sql`INSERT INTO av1_attempts (id,secret_hash,nickname,bank_version,question_ids) VALUES (${id},${createHash('sha256').update(secret).digest('hex')},${nickname},${BANK_VERSION},${JSON.stringify(chosen.map(q=>q.id))}::jsonb)`;}
   return json({id,secret:ranked?secret:undefined,mode:ranked?'ranked':'practice',nickname,questions:chosen.map(q=>({id:q.id,topic:q.topic,prompt:q.prompt,code:q.code,options:q.options,difficulty:q.difficulty,kind:q.kind}))});
  }
  if(p.action!=='finish'||!validateAnswers(p.answers))return json({error:'Responda às 25 questões antes de finalizar.'},400);
  if(!ranked){
   if(p.mode!=='practice'||!validIds(p.ids))return json({error:'Tentativa inválida. Inicie um novo simulado.'},400);
   const review=grade(data.questions,p.ids,p.answers);return json({score:review.filter(q=>q.correct).length,total:25,review,saved:false,mode:'practice'});
  }
  if(typeof p.id!=='string'||!/^[0-9a-f-]{36}$/.test(p.id)||typeof p.secret!=='string'||!/^[0-9a-f]{64}$/.test(p.secret))return json({error:'Tentativa inválida.'},400);
  const sql=database();const hash=createHash('sha256').update(p.secret).digest('hex');
  const rows=await sql`SELECT * FROM av1_attempts WHERE id=${p.id}::uuid AND secret_hash=${hash}`;const row=rows[0];
  if(!row)return json({error:'Tentativa não encontrada.'},404);
  if(row.bank_version!==BANK_VERSION)return json({error:'O banco de questões mudou. Inicie outro simulado.'},409);
  if(!row.finished_at&&Date.now()-new Date(row.started_at).getTime()>86400000)return json({error:'Tentativa expirada. Inicie outro simulado.'},410);
  const ids=row.question_ids as number[];
  if(!row.finished_at){const score=grade(data.questions,ids,p.answers).filter(q=>q.correct).length;
   await sql`UPDATE av1_attempts SET finished_at=NOW(),score=${score},answers=${JSON.stringify(p.answers)}::jsonb WHERE id=${p.id}::uuid AND finished_at IS NULL`;
  }
  const final=(await sql`SELECT score,answers FROM av1_attempts WHERE id=${p.id}::uuid AND secret_hash=${hash}`)[0];
  return json({score:final.score,total:25,review:grade(data.questions,ids,final.answers as number[]),saved:true,mode:'ranked'});
 }catch{console.error('quiz_request_failed');return json({error:'Não foi possível concluir agora. Suas respostas foram mantidas. Tente novamente.'},503);}
}
