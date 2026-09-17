export type Question = {
 id:number;topic:number;prompt:string;code:string;options:string[];answer:number;
 explanation:string;difficulty:string;kind:string;
};
export const EXAM_SIZE=25;
export const BANK_VERSION='av1-conceitos-v2';
export function shuffled<T>(items:readonly T[],random= Math.random):T[]{
 const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;
}
export function createExam(bank:Question[],random=Math.random):Question[]{
 const topics=[...new Set(bank.map(q=>q.topic))];
 if(topics.length!==11||bank.length<EXAM_SIZE)throw new Error('Banco insuficiente');
 const picked=topics.flatMap(topic=>shuffled(bank.filter(q=>q.topic===topic),random).slice(0,2));
 if(picked.length!==22)throw new Error('Assunto sem questões suficientes');
 const used=new Set(picked.map(q=>q.id));
 const extras=shuffled(bank.filter(q=>!used.has(q.id)),random).slice(0,EXAM_SIZE-picked.length);
 return shuffled([...picked,...extras],random);
}
export function validateAnswers(answers:unknown):answers is number[]{return Array.isArray(answers)&&answers.length===EXAM_SIZE&&answers.every(a=>Number.isInteger(a)&&a>=0&&a<=3);}
export function grade(bank:Question[],ids:number[],answers:number[]){
 if(ids.length!==EXAM_SIZE||new Set(ids).size!==EXAM_SIZE||!validateAnswers(answers))throw new Error('Respostas inválidas');
 return ids.map((id,i)=>{const q=bank.find(q=>q.id===id);if(!q)throw new Error('Questão inválida');return {...q,selected:answers[i],correct:answers[i]===q.answer};});
}
