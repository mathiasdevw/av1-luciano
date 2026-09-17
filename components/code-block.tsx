import {Code2} from 'lucide-react';
export function CodeBlock({code,label='Java',compact=false}:{code:string;label?:string;compact?:boolean}){
 function highlight(line:string){
  const pieces=line.split(/(\/\/.*$|#[^\n]*$|"(?:[^"\\]|\\.)*"|@[A-Za-z][A-Za-z0-9.]*|\b(?:public|private|class|record|return|new|void|var|interface|enum|throw|final|if|true|false|null|extends|int|long)\b|\b\d+\b)/g);
  return pieces.map((p,i)=><span key={i} className={p.startsWith('//')||p.startsWith('#')?'syntax-comment':p.startsWith('"')?'syntax-string':p.startsWith('@')?'syntax-annotation':/^\d+$/.test(p)?'syntax-number':/^(public|private|class|record|return|new|void|var|interface|enum|throw|final|if|true|false|null|extends|int|long)$/.test(p)?'syntax-keyword':undefined}>{p}</span>);
 }
 return <div className={'code-window '+(compact?'compact':'')}><div className="code-title"><span><i/><i/><i/></span><span><Code2 size={13}/>{label}</span></div><pre tabIndex={0} aria-label={`Trecho de código ${label}`}><code>{code.split('\n').map((line,i)=><span className="code-line" key={i}><span aria-hidden="true" className="line-number">{i+1}</span><span>{highlight(line)}</span></span>)}</code></pre></div>
}
