import data from './content/study.json';
export const lessons=data.lessons;
export const questions=data.questions;
export function grade(answers:number[], ids:number[]){return ids.map((id,i)=>{const q=questions.find(q=>q.id===id)!;return {...q,selected:answers[i]??-1,correct:answers[i]===q.answer};});}
