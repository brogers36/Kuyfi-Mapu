/* ============================================================
   NUMERALS, TEXT, UI
   ============================================================ */
const UN=['','kiñe','epu','küla','meli','kechu','kayu','regle','pura','aylla'];
function numW(n){
  if(n<=0)return'0';
  if(n<10)return UN[n];
  if(n<100){const t=Math.floor(n/10),u=n%10;return (t>1?UN[t]+' ':'')+'mari'+(u?' '+UN[u]:'')}
  if(n<1000){const h=Math.floor(n/100),r=n%100;return (h>1?UN[h]+' ':'')+'pataka'+(r?' '+numW(r):'')}
  return String(n);
}
const numP=n=>numW(n)+' ('+n+')';
const L=(who,m,es,en)=>({who,m,es,en});
const N=(es,en)=>({es,en});
const PRAISE=[{m:'Kümey!',es:'¡Bien!',en:'Good!'},{m:'Tuteley!',es:'¡Muy bien hecho!',en:'Well done!'}];
let praiseI=0;const praise=()=>{const p=PRAISE[praiseI++%2];return L('',p.m,p.es,p.en)};
const dlg=$('dlg'),menu=$('menu'),hud=$('hud'),banner=$('banner');
let TALKER=null;
const WHOLOOK={Kuku:'kuku',Lonko:'lonko',Machi:'machi',Papay:'kuku'};
const PORT={};
function portraitFor(l){
  if(!l.who||typeof ctCharSpriteBig!=='function'||!S)return null;
  let look=null,tn,ey,hr;
  if(S.name&&l.who.indexOf(S.name)===0){look=heroLook()}
  else if(WHOLOOK[l.who]&&(!TALKER||TALKER.look!==WHOLOOK[l.who])){look=WHOLOOK[l.who]}
  else if(TALKER&&TALKER.kind==='npc'&&typeof LOOKS!=='undefined'&&LOOKS[TALKER.look]){look=TALKER.look;tn=TALKER.tn;ey=TALKER.ey2;hr=TALKER.hr2}
  if(!look||!LOOKS[look])return null;
  const key=look+':'+tn+ey+hr;if(PORT[key])return PORT[key];
  const raw=ctCharSpriteRaw(look,'down',0,false,tn,ey,hr),big=repaintSmall(scale2xCanvas(raw),{amp:.95,capG:9,capP:5,lift:.16,sh:.7});
  const [cv,c]=mk(44,40);const g=c.createLinearGradient(0,0,0,40);g.addColorStop(0,'#5a6a9e');g.addColorStop(1,'#1a2250');c.fillStyle=g;c.fillRect(0,0,44,40);
  c.fillStyle='rgba(255,230,160,.10)';c.beginPath();c.ellipse(16,12,18,14,0,0,6.283);c.fill();
  c.drawImage(big,0,0,big.width,40,(44-big.width)/2,2,big.width,40);
  return PORT[key]=cv}
function say(lines,cb){
  lines=lines.filter(Boolean);
  if(!lines.length){active=null;cb&&cb();return}
  let i=0;
  const show=()=>{const l=lines[i];
    const w=dlg.querySelector('.who'),m=dlg.querySelector('.m'),g=dlg.querySelector('.g'),pc=dlg.querySelector('.por');
    const pt=portraitFor(l);if(pt&&pc){pc.width=pt.width;pc.height=pt.height;pc.getContext('2d').drawImage(pt,0,0);dlg.classList.add('hasp')}else dlg.classList.remove('hasp');
    w.textContent=l.who||'';w.style.display=l.who?'':'none';
    m.textContent=GR(l.m)||'';m.style.display=l.m?'':'none';
    const full=G(l),hid=!!(S&&S.nogloss&&l.m&&full);g.textContent=hid?'':full;g.style.display=full&&!hid?'':'none';
    let rv=dlg.querySelector('.rv');if(!rv){rv=document.createElement('button');rv.className='rv';rv.textContent='?';dlg.appendChild(rv)}
    rv.style.display=hid?'':'none';rv.onclick=e=>{e.stopPropagation();g.textContent=full;g.style.display='';rv.style.display='none';S.peek=(S.peek||0)+1};
    let ds=dlg.querySelector('.ds');if(!ds){ds=document.createElement('button');ds.className='ds';ds.textContent='÷';dlg.appendChild(ds)}
    const dw=desgWords(l.m);ds.style.display=dw.length?'':'none';ds.title=LANG==='es'?'Desglose de palabras':'Word breakdown';ds.onclick=e=>{e.stopPropagation();desgOpen(dw)};
    dlg.style.display='block';SAYT=performance.now();if(l.fx)l.fx();};
  active={kind:'say',a(){i++;if(i>=lines.length){dlg.style.display='none';active=null;cb&&cb()}else{sfx('move');show()}},b(){this.a()}};
  show();
}
let SAYT=0;
/* word breakdown: approved rows of docs/Kewun_desglose.xlsx (src/desglose.js); the master build also shows unreviewed ones with ⚠ */
function desgWords(m){if(!m||typeof DESG==='undefined')return[];const out=[],seen=new Set();
  for(const t of String(m).split(/\s+/)){const k=t.toLowerCase().replace(/^[^\p{L}']+|[^\p{L}']+$/gu,'');const d=DESG[k];
    if(!d||seen.has(k)||d.p.length<2||!(d.ok||window.KEWUN_MASTER))continue;seen.add(k);out.push([t.replace(/[¡!¿?.,;:«»"“”()…]/g,''),d])}return out}
function desgOpen(list){let pn=$('desgp');if(!pn){pn=document.createElement('div');pn.id='desgp';pn.className='box';dlg.parentNode.appendChild(pn)}
  const en=LANG!=='es',h=[];
  for(const [w,d] of list){const gl=[d.r[en?1:0]].concat(d.m.map(x=>x[en?1:0]));
    h.push('<div class="dw"><b>'+esc(GR(w))+(d.ok?'':' <span class="dwarn">⚠</span>')+'</b><div class="dilg">'+d.p.map((p,i)=>'<span><em>'+(i?'-':'')+esc(GR(p))+'</em><i>'+esc(gl[i]||'')+'</i></span>').join('')+'</div></div>')}
  if(list.some(x=>!x[1].ok))h.push('<div class="dnote">⚠ '+(en?'not yet reviewed':'sin revisar todavía')+'</div>');
  pn.innerHTML=h.join('');pn.style.display='block';sfx('move');
  const prev=active,close=()=>{pn.style.display='none';active=prev};
  active={kind:'desg',a:close,b:close};pn.onclick=e=>{e.stopPropagation();close()}}
dlg.addEventListener('click',()=>{if(active&&active.kind==='say'&&performance.now()-SAYT>180)active.a()});
/* answer options written in Spanish (meaning quizzes): shown in English when the gloss is English; the value stays the same */
const OPT_EN={"Estoy en la casa.": "I am at home.", "Voy a la casa.": "I am going home.", "Mi casa es grande.": "My house is big.", "el pie": "the foot", "la mano": "the hand", "la oreja": "the ear", "ayer": "yesterday", "mañana": "tomorrow", "ahora": "now", "antiguo": "long ago", "Ayer fui.": "I went yesterday.", "Mañana iré.": "I will go tomorrow.", "Ahora voy.": "I am going now.", "el puma": "the puma", "el ñandú": "the rhea", "el cóndor": "the condor", "Estoy triste.": "I am sad.", "Estoy feliz.": "I am happy.", "Estoy cansado.": "I am tired.", "Yo canto.": "I sing.", "Tú cantas.": "You sing.", "Él o ella canta.": "He or she sings.", "Mi mamá y yo trabajamos.": "My mom and I work.", "Mi mamá trabaja.": "My mom works.", "Ellas dos trabajan.": "The two of them work.", "¿Cuántos años tienes?": "How old are you?", "¿Dónde vives?": "Where do you live?", "¿Cómo te llamas?": "What is your name?", "¿Dónde?": "Where?", "¿Cuándo?": "When?", "¿Quién?": "Who?", "De noche suelo dormir.": "I usually sleep at night.", "Anoche dormí.": "I slept last night.", "Esta noche dormiré.": "I will sleep tonight.", "Solía hablar mapudungun.": "He or she used to speak Mapudungun.", "Habla mapudungun ahora.": "He or she speaks Mapudungun now.", "Hablará mapudungun.": "He or she will speak Mapudungun.", "Nuestro lof.": "Our lof.", "Tu lof.": "Your lof.", "Su lof.": "His or her lof.", "Está durmiendo.": "He or she is sleeping.", "Va a dormir.": "He or she is going to sleep.", "Duerme siempre.": "He or she always sleeps.", "Ayer vi un ñandú.": "I saw a rhea yesterday.", "Mañana veré un ñandú.": "I will see a rhea tomorrow.", "Hoy veo dos ñandúes.": "Today I see two rheas."};
const optTxt=m=>{const en=(typeof S!=='undefined'&&S&&S.gloss)?S.gloss==='en':(typeof LANG!=='undefined'&&LANG==='en');return en&&OPT_EN[m]?OPT_EN[m]:GRm(m)};
function choose(prompt,opts,cb,cancel,one,onSel){
  const pe=menu.querySelector('.p'),le=menu.querySelector('.list');
  pe.innerHTML='';le.innerHTML='';le.classList.toggle('one',!!one);
  if(prompt){if(prompt.mh){const d=document.createElement('div');d.innerHTML=prompt.mh;d.style.lineHeight='1.7';pe.appendChild(d)}
    if(prompt.m){const d=document.createElement('div');d.className='m';d.textContent=GR(prompt.m);pe.appendChild(d)}
    const g=G(prompt);if(g){const d=document.createElement('div');d.className='g';d.textContent=g;pe.appendChild(d)}}
  const ng=!!(S&&S.nogloss);
  let idx=opts.findIndex(o=>!o.dis);if(idx<0)idx=0;const t0=performance.now();
  const pick=k=>{menu.style.display='none';active=null;sfx('ok');cb(opts[k].v!==undefined?opts[k].v:k)};
  const btns=opts.map((o,k)=>{const b=document.createElement('button');b.className='opt';
    const mp=o.m&&!_isEsp(o.m);b.innerHTML='<span class="om">'+esc(optTxt(o.m||''))+'</span>'+(o.g?'<span class="og'+(ng&&mp?' hid':'')+'">'+esc(o.g)+'</span>':'');
    if(o.dis)b.disabled=true;b.onclick=()=>{if(!o.dis&&performance.now()-t0>250)pick(k)};
    b.onmouseenter=()=>{if(!o.dis&&idx!==k){idx=k;hl()}};le.appendChild(b);return b});
  if(ng){const hide=[...pe.querySelectorAll('.g')].filter(()=>prompt&&prompt.m);hide.forEach(d=>d.classList.add('hid'));
    if(hide.length||le.querySelector('.og.hid')){const rv=document.createElement('button');rv.className='rv';rv.textContent='?';
      rv.onclick=e=>{e.stopPropagation();menu.querySelectorAll('.hid').forEach(d=>d.classList.remove('hid'));rv.remove();S.peek=(S.peek||0)+1};pe.appendChild(rv)}}
  const hl=()=>{btns.forEach((b,k)=>b.classList.toggle('sel',k===idx));if(onSel)onSel(idx,opts[idx])};
  active={kind:'menu',a(){if(!opts[idx].dis)pick(idx)},
    b(){if(cancel){menu.style.display='none';active=null;sfx('move');cb(null)}},
    mv(d){let n=idx;for(let t=0;t<opts.length;t++){n=(n+d+opts.length)%opts.length;if(!opts[n].dis)break}idx=n;sfx('move');hl();btns[idx].scrollIntoView({block:'nearest'})}};
  menu.style.display='flex';le.scrollTop=0;pe.scrollTop=0;hl();
}
function showBanner(m,g){if(S&&S.nogloss&&m)g='';banner.querySelector('b').textContent=GR(m);banner.querySelector('span').textContent=g;banner.style.display='block';clearTimeout(showBanner.t);showBanner.t=setTimeout(()=>banner.style.display='none',2200)}

