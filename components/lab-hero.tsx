'use client';
import {useRef} from 'react';
import {ArrowDownRight,ArrowUpRight,Command} from 'lucide-react';

export function LabHero({onExplore}:{onExplore:()=>void}) {
 const scene=useRef<HTMLDivElement>(null);
 return <div className="lab-hero">
  <div className="hero-editorial"><div className="edition"><span className="live-dot"/>CADERNO DE ESTUDO Nº 01 <span>JAVA / SPRING</span></div>
   <h2>Menos decorar.<br/>Mais <em>entender.</em><span className="title-period">*</span></h2>
   <p>O código está na sua frente.<br/>Você sabe o que acontece depois?</p>
   <div className="hero-bottom"><button className="explore-link" onClick={onExplore}>Abrir o caderno de conceitos<ArrowUpRight size={19}/></button><span className="hand-note">É aqui que a ficha cai.<ArrowDownRight size={28}/></span></div>
  </div>
  <div className="lab-scene" aria-label="Ilustração de código Java em camadas tridimensionais" onPointerMove={e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();scene.current?.style.setProperty('--tilt-x',`${(e.clientY-r.top-r.height/2)/65}deg`);scene.current?.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/60}deg`);}} onPointerLeave={()=>{scene.current?.style.setProperty('--tilt-x','0deg');scene.current?.style.setProperty('--tilt-y','0deg');}}>
   <div className="scene-grid" aria-hidden="true"/><span className="scene-coordinate">FIG. 01 — DO CÓDIGO AO CONCEITO</span>
   <div className="scene-tilt" ref={scene}><div className="scene-float">
    <div className="layer-sheet sheet-back" aria-hidden="true"><span>03 / PERSISTÊNCIA</span><div/><div/></div>
    <div className="layer-sheet sheet-middle" aria-hidden="true"><span>02 / REGRA DE NEGÓCIO</span><div/><div/></div>
    <div className="editor-object"><div className="object-toolbar"><span><i/><i/><i/></span><b>primeiro-passo.java</b><Command size={13}/></div><div className="object-code"><span className="object-comment">{'// comece pelo que você sabe'}</span><div><small>01</small><b>record</b> Aluno(String nome) {'{}'}</div><div><small>02</small>&nbsp;</div><div><small>03</small><b>var</b> eu = <b>new</b> Aluno(<em>&quot;Você&quot;</em>);</div><div><small>04</small>System.out.println(eu.nome());</div><div className="object-output"><span>CONSOLE</span><strong>Você<span className="typing-caret"/></strong></div></div><div className="object-foot"><span className="live-dot"/>Java · leitura de código<span>UTF-8</span></div></div>
    <div className="java-cube" aria-hidden="true"><span className="cube-front">{'{ }'}</span><span className="cube-top">JAVA</span><span className="cube-side">17+</span></div>
    <div className="scene-sticker"><span>entendi!</span><svg viewBox="0 0 40 25" width="38" height="23" aria-hidden="true"><path d="m4 11 10 9L35 3" fill="none" stroke="currentColor" strokeWidth="3"/></svg></div>
   </div></div><div className="scene-caption"><span>LER → RACIOCINAR → TESTAR</span><span>01 / 11</span></div>
  </div>
 </div>
}
