import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createExam,grade,validateAnswers,type Question} from '../lib/quiz-core.ts';
const {questions}:{questions:Question[]}=JSON.parse(readFileSync(new URL('../lib/content/study.json',import.meta.url),'utf8'));
test('cada sorteio tem 25 questões únicas e cobre os 11 assuntos',()=>{
 for(let run=0;run<100;run++){const exam=createExam(questions);assert.equal(exam.length,25);assert.equal(new Set(exam.map(q=>q.id)).size,25);assert.equal(new Set(exam.map(q=>q.topic)).size,11);for(let topic=0;topic<11;topic++)assert.ok(exam.filter(q=>q.topic===topic).length>=2);}
});
test('correção distingue 25 acertos, zero e respostas alteradas',()=>{const exam=createExam(questions),ids=exam.map(q=>q.id),right=exam.map(q=>q.answer);assert.equal(grade(questions,ids,right).filter(q=>q.correct).length,25);const wrong=right.map(a=>(a+1)%4);assert.equal(grade(questions,ids,wrong).filter(q=>q.correct).length,0);right[3]=(right[3]+1)%4;assert.equal(grade(questions,ids,right).filter(q=>q.correct).length,24);});
test('rejeita resposta incompleta, valor inválido e questão repetida',()=>{assert.equal(validateAnswers(Array(24).fill(0)),false);assert.equal(validateAnswers(Array(25).fill(-1)),false);assert.equal(validateAnswers(Array(25).fill('0')),false);assert.throws(()=>grade(questions,Array(25).fill(1),Array(25).fill(0)));});
test('todo assunto tem cinco questões, explicações e gabarito válido',()=>{assert.equal(questions.length,55);for(let topic=0;topic<11;topic++)assert.equal(questions.filter(q=>q.topic===topic).length,5);for(const q of questions){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>30);}assert.ok(questions.filter(q=>q.code).length>=30);});
