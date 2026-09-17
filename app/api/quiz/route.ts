import {database} from '@/lib/database';
import {questions,grade} from '@/lib/quiz';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 try{
  if(request.headers.get('origin') && new URL(request.headers.get('origin')!).origin!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
  const raw=await request.text();if(raw.length>10000)return json({error:'Solicitação muito grande.'},400);
  const p=JSON.parse(raw);const db=database();
  if(p.action==='start'){
   const nickname=typeof p.nickname==='string'?p.nickname.trim():'';
   if(nickname.length<2||nickname.length>24)return json({error:'Use um apelido entre 2 e 24 caracteres.'},400);
   const chosen=[...questions];for(let i=chosen.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[chosen[i],chosen[j]]=[chosen[j],chosen[i]];}
   const id=crypto.randomUUID(),secret=crypto.randomUUID(),started=Date.now();
   await db.prepare('INSERT INTO attempts (id,secret,nickname,ids,started) VALUES (?,?,?,?,?)').bind(id,secret,nickname,JSON.stringify(chosen.map(q=>q.id)),started).run();
   return json({id,secret,questions:chosen.map(({answer,explanation,...q})=>q)});
  }
  if(p.action!=='finish'||typeof p.id!=='string'||typeof p.secret!=='string')return json({error:'Solicitação inválida.'},400);
  const row=await db.prepare('SELECT * FROM attempts WHERE id=? AND secret=?').bind(p.id,p.secret).first<any>();
  if(!row)return json({error:'Tentativa não encontrada.'},404);
  const ids=JSON.parse(row.ids) as number[];
  if(!Array.isArray(p.answers)||p.answers.length!==ids.length||!p.answers.every((a:unknown)=>Number.isInteger(a)&&Number(a)>=-1&&Number(a)<=3))return json({error:'Respostas inválidas.'},400);
  if(!row.finished){const score=grade(p.answers,ids).filter(q=>q.correct).length;await db.prepare('UPDATE attempts SET finished=?, score=?, answers=? WHERE id=? AND finished IS NULL').bind(Date.now(),score,JSON.stringify(p.answers),p.id).run();}
  const final=await db.prepare('SELECT * FROM attempts WHERE id=?').bind(p.id).first<any>();
  return json({score:final.score,total:ids.length,review:grade(JSON.parse(final.answers),ids)});
 }catch(e){console.error(e);return json({error:'Não foi possível salvar agora. Suas respostas continuam na tela; tente novamente.'},500);}
}
