/* ============================================================
   BATTLE
   ============================================================ */
let B=null;
const SUMMONP=Object.keys(ET).filter(k=>!ET[k].boss);
function engage(e){
  if(grace>0||active)return;
  const go=()=>startBattle(e.party,{ent:e,boss:e.boss,mini:e.mini,final:e.final,chain:e.chain,song:e.song});
  {const pre=(e.pre||[]).concat(e.prex?e.prex():[]);if(pre.length)say(pre,go);else go()}
}
function relabel(){const cnt={},seen={};B.en.forEach(e=>cnt[e.t]=(cnt[e.t]||0)+1);
  B.en.forEach(e=>{seen[e.t]=(seen[e.t]||0)+1;if(e.label)return;e.label=GR(ET[e.t].name)+(cnt[e.t]>1||ET[e.t].name==='laftrache'&&B.en.length>1?' '+'ABCDE'[seen[e.t]-1]:'')})}
function progK(){const F=S.flags||{};return ['ngen','ngen2','ngen3','ngen4','ngen5'].filter(k=>F[k]).length+(F.won?1:0)}
const YEWEN_KIN=['wenangkun','illkun','llukalfe','ayentufe','profe'];
const YEWEN_CALL={wenangkun:['la pena que se queda callada. Despiértala (nepe-).','the sorrow that keeps quiet. Wake it (nepe-).'],
  illkun:['la rabia de que te hagan callar. Arde: enfríala (wütre-) o cálmala (llako-).','the rage at being silenced. It burns: cool it (wütre-) or calm it (llako-).'],
  llukalfe:['el miedo que se agranda. Es altísimo: hazlo retroceder (wüñotreka-).','the fear that grows bigger. It towers: make it step back (wüñotreka-).'],
  ayentufe:['la burla del patio. Se esconde entre la gente: hazlo salir (tripa-).','the schoolyard mockery. It hides in the crowd: make it come out (tripa-).'],
  profe:['la escuela que prohibió la lengua. Su regla es dura como piedra: quiébrala (trafo-).','the school that banned the language. Its rule is hard as stone: break it (trafo-).'],
  ngoysum:['el gran olvido en persona, que vuelve cuando la palabra se te escapa. Te roba las palabras: ¡háblale fuerte!','the great forgetting itself, back because the word slipped away. It steals your words: speak to it loudly!']};
function mkEnemy(t){const k=progK(),bs=ET[t].boss?.5:1,hp0=Math.round(ET[t].hp*(1+.07*k*bs)*(S.hm?1+(heroMul()*Math.max(1,atk()/heroExp().atk)-1)*(ET[t].boss?.75:1):1));return{t,hp:hp0,max:hp0,gr:0,sl:0,hit:0,dead:false,fadeT:0,fear:0,stun:0,tall:t==='witranalwe'||ET[t].tower?1:0,armor:ET[t].armor?1:0,burn:ET[t].fire?1:0,hidden:ET[t].hide?1:0,dreaming:ET[t].dream?1:0,dreamT:0,down:0,seals:ET[t].seals?ET[t].seals.slice():null}}
function startBattle(party,o){o=o||{};const bwx=(typeof wxNow==='function'&&M)?wxNow():null;
  let snap=null;try{snap=document.createElement('canvas');snap.width=LW;snap.height=LH;const sg=snap.getContext('2d');sg.imageSmoothingEnabled=false;sg.drawImage(cv,0,0,LW,LH)}catch(e){snap=null}
  if(typeof stopAmb==='function')stopAmb();
  if(typeof playAmb==='function'&&(M.urban||M.bg==='metro')){playAmb(typeof wxAmbKey==='function'&&wxKey()?wxAmbKey():ambFor(M.bg));ambVol(.2)}   // the city keeps going, quieter, under the fight
  mode='battle';banner.style.display='none';held.up=held.down=held.left=held.right=0;
  const vph={day:'day',dusk:'dusk',night:'night',dawn:'dusk'}[typeof dayPhase==='function'?dayPhase().name:'day'],mbg=o.bg||M.bg,mfog=o.bg?o.fog:M.fog,bgv=(typeof PAINTBG!=='undefined'&&PAINTBG[mbg+'@'+vph])?mbg+'@'+vph:mbg;   // the city backdrops are painted for each time of day
  B={wx:bwx,snap,wipe:snap?22:0,en:party.map(mkEnemy),o,tele:false,teleHint:false,shake:0,area:(mfog&&mbg!=='fjord'?'fog:':'')+bgv,turn:0,cursor:null,pops:[],parts:[],flash:0,red:0,intro:24,blocked:null,rush:null,shownHP:S.hp};
  if(o.tut){B.en[0].hp=B.en[0].max=20}
  if(typeof kyStart==='function')kyStart();
  relabel();sfx('enc');if(snap)sfx('swirl');playSong(o.song||(o.final?'ngoyFinal':rsong(o.boss?'boss':'battle')));
  const alive=B.en.length,bt=party.find(t=>ET[t].boss);
  if(bt){const bn=ET[bt].name;say([L('','Wefürkey '+bn+'!','¡Apareció '+bn+'!',bn+' appeared!')],battleMenu);return}
  const grp=[];for(const t of party){const g=grp.find(x=>x.t===t);if(g)g.n++;else grp.push({t,n:1})}
  const jn=(a,k)=>a.length<2?a[0]:a.slice(0,-1).join(', ')+' '+k+' '+a[a.length-1];
  const mw=jn(grp.map(g=>numW(g.n)+' '+ET[g.t].name),'ka'),me=jn(grp.map(g=>g.n+' '+ET[g.t].name),'y'),mn=jn(grp.map(g=>g.n+' '+ET[g.t].name),'and');
  const vb=alive===1?'Wefi':alive===2?'Wefyngu':'Wefyngün';
  say([L('',vb+' '+mw+'!',(alive>1?'¡Aparecieron ':'¡Apareció ')+me+'!',mn+' appeared!')],battleMenu);
}
const aliveE=()=>B.en.filter(e=>!e.dead);
function bossBlock(e){const T=ET[e.t];if(!T.boss)return false;if(e.down||e.sl||e.stag||e.dreaming||e.hidden||e.hp<=0)return false;
  if(e.parry){e.parry=0;return true}
  return Math.random()<(T.blk||.22)+(S.hm?.08:0)}
const quizPend=e=>!!B&&ET[e.t].boss&&!B.qok&&!/^ngoyman[1-4]$/.test(e.t)&&!(B.o.chain==='llufu'&&e.t!=='llufu5');
function battleMenu(){
  if(B&&B.ngenA&&!B.ngenA.done)return;
  if(B&&B.defA&&!B.defA.done)return;
  if(B&&B.o.tut&&tutStep())return;
  if(B&&B.lanPending){const le=B.lanPending;B.lanPending=null;if(!le.dead)return lanKewun(le)}
  if(B&&B.llawPending){const le=B.llawPending;B.llawPending=null;if(!le.dead&&le.hp>0)return llawKewun(le)}
  const en=S.gloss==='en';B.cursor=null;
  choose({es:'¿Qué haces? (Hay '+aliveE().length+')',en:'What do you do? ('+aliveE().length+' left)'},[
    ...(B.lanBoon?[{m:'Epu wiño!',g:en?'Gift of the lof: a double wiño strike, no newen needed (this turn only)':'Regalo del lof: doble golpe de wiño, sin gastar newen (solo este turno)',v:'ww'}]:[]),
    {m:'Dungun',g:en?'Speak (build a command)':'Hablar (armar una orden)',v:'d'},
    ...(typeof kyMenuOpts==='function'?kyMenuOpts(en):[]),
    {m:'Newen ('+(S.sp||0)+'/'+SPMAX+')',g:en?'Special ability':'Habilidad especial',v:'s',dis:(S.sp||0)<2},
    {m:'Chemkün',g:en?'Items':'Cosas',v:'i'}].concat(S.gear.trutruka?[{m:'Trutruka',g:en?'Blow the horn: stuns all (once per fight)':'Tocar la trutruka: aturde a todos (1 vez por pelea)',v:'t',dis:!!B.trut}]:[]).concat([
    {m:'Lef',g:en?'Run away':'Huir',v:'r'}]).concat(B.last?[{m:'Ka kiñe rupa: '+ROOTS[B.last.r].m.replace('-','')+(B.last.k?'kil':'')+'-',g:en?'Once more (same verb)':'Otra vez (el mismo verbo)',v:'again'}]:[]),v=>{
    if(v!=='ww')B.lanBoon=0;
    if(typeof kyMenuPick==='function'&&kyMenuPick(v))return;
    if(v==='ww'){B.lanBoon=0;const tg=aliveE().find(x=>/^ngoyman/.test(x.t))||aliveE()[0];return doSpecial('wino2',tg)}
    if(v==='d')pickRoot();
    else if(v==='again')pickTarget(B.last.r,B.last.k);
    else if(v==='s')pickSpecial();
    else if(v==='t'){B.trut=1;sfx('trut');
      const ls=[L('','Trutruka!','¡El sonido largo de la trutruka retumba por todas partes!','The long blast of the trutruka booms all around!')];
      for(const e of aliveE()){const T=ET[e.t];e.fear=Math.max(e.fear,2);if(!T.boss)e.stun=1}
      ls.push(N('Los wekufü se tapan los oídos: pierden su turno y quedan asustados. Los más grandes solo se asustan.','The wekufü cover their ears: they lose their turn and are left scared. The biggest ones are only scared.'));
      return say(ls,enemyPhase)}
    else if(v==='i')choose({es:'Chemkün',en:'Items'},itemOpts().concat([{m:en?'Back':'Volver',v:'x'}]),k=>{if(!k||k==='x')return battleMenu();const l=useItem(k);say([l],enemyPhase)},true);
    else if(v==='r'&&B.o.tut){return say([L('Kuku','Petu, '+nm()+'!','¡Todavía no, '+nm()+'! Primero aprende a hablarles. (En las peleas normales, «Lef» sirve para huir; de los jefes no se puede huir.)','Not yet, '+nm()+'! First learn to speak to them. (In ordinary fights «Lef» lets you run away; you cannot run from bosses.)')],battleMenu)}
    else if(v==='r'&&B.o.arena){return say([L('','Lef!','Sales del Weichawe.','You leave the Weichawe.')],()=>endBattle('flee'))}
    else if(v==='r'){if(B.o.boss||B.o.mini){sfx('bad');return say([N('¡No puedes huir de esta pelea!','You cannot run from this fight!')],battleMenu)}
      if(Math.random()<.65)return say([L('','Lef!','Huyes corriendo.','You run away.')],()=>endBattle('flee'));
      sfx('bad');say([N('¡No pudiste escapar!','You could not get away!')],enemyPhase)}
  },false);
}
/* the kuku's guided first fight (o.tut): she steps in at each new idea */
function tutStep(){
  const T=B.tut||(B.tut={});const k=(es,en,m)=>L('Kuku',m||'',es,en);
  if(!T.a){T.a=1;return say([
    k('"Mira: un laftrache, un wekufü chico. A los wekufü no se les pega con los puños: se les habla, en mapudungun."','"Look: a laftrache, a small wekufü. You do not hit wekufü with your fists: you speak to them, in Mapudungun."','Adkintunge!'),
    k('"En cada turno eliges qué hacer. Elige «Dungun», hablar, y arma una orden con tus palabras."','"Each turn you choose what to do. Choose «Dungun», speak, and build a command with your words."')],battleMenu),true}
  if(B.turn>=1&&!T.b&&aliveE().length===1){T.b=1;const ne=mkEnemy('laftrache');B.en.push(ne);relabel();sfx('enc');return say([
    k('"¡Mira, viene otro! Ahora son epu, dos."','"Look, another one is coming! Now there are epu, two."','Ka kiñe laftrache!'),
    k('"Puedes hablarle a uno solo, y le pega más fuerte. O elegir «Kom» y hablarles a los dos juntos: más suave, pero a los dos. Para dos, la terminación es -mu."','"You can speak to just one, and it hits harder. Or choose «Kom» and speak to both together: softer, but to both. For two, the ending is -mu."')],battleMenu),true}
  if(T.b&&!T.c&&S.hp<maxHP()){T.c=1;return say([
    k('"¡Ay! Te alcanzó. Cuida tus piwke, esos corazones de arriba: si se acaban, pierdes la pelea."','"Ouch! It got you. Watch your piwke, those hearts up top: if they run out, you lose the fight."','Adkintufinge mi pu piwke!'),
    k('"Si te pegan mucho, abre «Chemkün», tus cosas, y come un külon (maqui): te devuelve piwke. Junto a cada kütral te recuperas entero."','"If they hit you a lot, open «Chemkün», your things, and eat a külon (maqui): it gives you piwke back. By every kütral you recover completely."')],battleMenu),true}
  if(!T.d&&(S.sp||0)>=2){T.d=1;return say([
    k('"Cada orden bien dicha carga tu newen: la barrita verde. Con dos, ya puedes usar «Newen»: el golpe de wiño pega el triple."','"Every command said correctly charges your newen: the little green bar. With two you can already use «Newen»: the wiño strike hits three times as hard."','Newentuleymi!')],battleMenu),true}
  return false}
function pickRoot(){
  const en=S.gloss==='en';
  if(B.o.tut&&!B.tut.r){B.tut.r=1;return say([L('Kuku','Amutu- pingey.','"amutu- quiere decir «irse de aquí». Es la primera raíz de tu chillka. Elígela."','"amutu- means «go away from here». It is the first root in your chillka. Choose it."')],pickRoot)}
  const opts=S.roots.map(r=>({m:ROOTS[r].m,g:G(ROOTS[r]),v:r}));opts.push({m:en?'Back':'Volver',v:'x'});
  choose({m:'___',es:'Elige la raíz del verbo.',en:'Choose the verb root.'},opts,r=>{
    if(!r||r==='x')return battleMenu();
    if(S.runes.includes('kil'))choose({m:ROOTS[r].m+'___',es:'¿Agregas -kil- (prohibición)?',en:'Add -kil- (prohibition)?'},
      [{m:'∅',g:en?'no -kil-':'sin -kil-',v:0},{m:'-kil-',g:en?"don't...!":'¡no...!',v:1}],k=>{if(k===null)return pickRoot();pickTarget(r,k)},true);
    else pickTarget(r,0);
  },true);
}
function pickTarget(r,k){
  const en=S.gloss==='en',al=aliveE(),base=r+(k?'kil':'');
  if(al.length===1)return pickEnd(r,k,B.en.indexOf(al[0]));
  const opts=[{m:'Kom · '+al.length,g:en?'all of them (collective)':'todos (colectivo)',v:'all'}].concat(al.map(e=>({m:e.label,g:en?'just this one (individual)':'solo este (individual)',v:B.en.indexOf(e)})));
  choose({m:base+'-___',es:'¿A quién le hablas? ¿A todos juntos o a uno solo?',en:'Who are you speaking to? All of them together, or just one?'},opts,v=>{
    if(v===null){B.cursor=null;return pickRoot()}pickEnd(r,k,v)},true,false,(i,o)=>{B.cursor=o.v});
}
function pickEnd(r,k,tg){
  const en=S.gloss==='en',base=r+(k?'kil':''),coll=tg==='all',n=coll?aliveE().length:1;B.cursor=tg;
  if(B.o.tut&&!B.tut['e'+n]){B.tut['e'+n]=1;const one=n===1;
    return say([L('Kuku',one?'Kiñe: amutunge.':'Epu: amutumu.',one?'"Le hablas a uno solo: '+base+'-nge. La terminación dice a cuántos les hablas."':'"Les hablas a los dos juntos: '+base+'-mu. Si fueran tres o más: -mün."',one?'"You are speaking to just one: '+base+'-nge. The ending says how many you are speaking to."':'"You are speaking to the two together: '+base+'-mu. If there were three or more: -mün."')],()=>pickEnd(r,k,tg))}
  const hint=S.hints?[en?'to one':'a uno',en?'to two':'a dos',en?'to three or more':'a tres o más']:['','',''];
  const who=coll?{es:'Les hablas a todos juntos. ¿Cuántos son?',en:'You are speaking to all of them together. How many are there?'}:{es:'Le hablas solo a '+B.en[tg].label+'.',en:'You are speaking only to '+B.en[tg].label+'.'};
  choose({m:base+'-___',es:who.es,en:who.en},ENDS.map((e,i)=>({m:'-'+e,g:hint[i],v:i})),i=>{
    if(i===null){if(aliveE().length===1){B.cursor=null;return pickRoot()}return pickTarget(r,k)}resolve(r,k,tg,i)},true);
  void n;
}
const SPECIALS={
  kuruf:{m:'Kürüf',cost:3,es:'Viento: golpea fuerte a todos y baja a los que vuelan',en:'Wind: hits everyone hard and brings flyers down'},
  wino2:{m:'Epu wiño',cost:0,hide:1,es:'Dos golpes de wiño con el newen del lof',en:'Two wiño strikes with the lof\'s newen'},
  wino:{m:'Wiño',cost:2,es:'Golpe de wiño: daño triple a uno',en:'Wiño strike: triple damage to one'},
  lawen:{m:'Lawentun',cost:2,es:'Sanar: +2 piwke y quita la maldición',en:'Heal: +2 hearts and lifts the curse'},
  laww:{m:'Lawentuwün',cost:1,es:'Sanarse entero: recupera newen (cada uso sana 25% menos)',en:'Heal yourself whole: restores newen (each use heals 25% less)'}};
function spark(x,y,col,n){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=.6+Math.random()*1.6;B.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,t:30+rnd(15),col})}}
function pickSpecial(){
  const en=S.gloss==='en';
  choose({es:'Newen: '+(S.sp||0)+'/'+SPMAX+'. Cada orden bien dicha carga uno.',en:'Newen: '+(S.sp||0)+'/'+SPMAX+'. Every command said correctly charges one.'},
    Object.keys(SPECIALS).filter(k=>!SPECIALS[k].hide&&(k!=='laww'||S.flags.lawW)).map(k=>({m:SPECIALS[k].m+' · '+SPECIALS[k].cost,g:G(SPECIALS[k]),v:k,dis:(S.sp||0)<SPECIALS[k].cost})).concat([{m:en?'Back':'Volver',v:'x'}]),k=>{
    if(!k||k==='x')return battleMenu();
    if(k==='wino'){const al=aliveE();if(al.length===1)return doSpecial(k,al[0]);
      return choose({es:'¿A cuál?',en:'Which one?'},al.map(e=>({m:e.label,v:B.en.indexOf(e)})),i=>{B.cursor=null;if(i===null)return pickSpecial();doSpecial(k,B.en[i])},true,false,(i,o)=>{B.cursor=o.v})}
    doSpecial(k)},true);
}
function doSpecial(k,tgt){
  const sp=SPECIALS[k];S.sp-=sp.cost;B.cursor=null;const fx=[],fxe=[];let targets=[];
  const head=L(S.name,sp.m+'!',G(sp),G(sp));head.fx=()=>{sfx('cast');B.flash=12;B.shake=8};
  if(k==='laww'){const pct=Math.max(25,100-25*(S.lawuses||0));S.lawuses=(S.lawuses||0)+1;persist();
    const amt=Math.ceil(maxHP()*pct/100);S.hp=Math.min(maxHP(),S.hp+amt);
    fx.push('La palabra te recorre entera: recuperas el '+pct+'% de tu newen.'+(pct>25?' (La próxima vez sanará menos.)':''));
    fxe.push('The word runs through your whole body: you recover '+pct+'% of your newen.'+(pct>25?' (It will heal less next time.)':''));
    head.fx=()=>{sfx('heal');spark(60,30,'#aef2c0',24)}}
  else if(k==='lawen'){const hadK=S.kutran;S.hp=Math.min(maxHP(),S.hp+8);S.curse=0;S.kutran=0;fx.push('Recuperas dos piwke.'+(hadK?' El weda kutran te suelta.':''));fxe.push('You recover two hearts.'+(hadK?' The weda kutran lets you go.':''));head.fx=()=>{sfx('heal');spark(60,30,'#80ff90',16)}}
  else{targets=k==='wino'||k==='wino2'?[tgt]:aliveE();
    let burnT=0;for(const e of targets){if(e.hidden&&k!=='wino2'){fx.push(e.label+' está escondido en la niebla: no lo alcanzas.');fxe.push(e.label+' is hidden in the fog: you cannot reach it.');continue}if(k!=='wino2'&&bossBlock(e)){fx.push(e.label+' se cubre: ¡bloquea tu newen!');fxe.push(e.label+' guards: it blocks your newen!');continue}let d=k==='wino2'?(atk()*3+rnd(3))*2:k==='wino'?atk()*3+rnd(3):Math.round(atk()*1.5)+rnd(3);if(k!=='wino2'){if(e.tall)d=Math.max(1,Math.round(d/3));if(e.armor)d=Math.max(1,Math.round(d/2));if(ET[e.t].spres){d=Math.max(1,Math.round(d/2));fx.push(e.label+' resiste tu newen.');fxe.push(e.label+' resists your newen.')}}if(ET[e.t].thick)d=Math.max(1,Math.round(d/2));if(e.seals&&e.seals.length)d=Math.min(2,d);if(e.dreaming){d=Math.min(1,d);fx.push(e.label+' duerme caminando: hay que despertarlo.');fxe.push(e.label+' sleeps as it walks: it must be woken.')}if(e.down){d+=4;e.down=0}if(e.burn)burnT+=2;if(k==='kuruf'&&ET[e.t].fly)e.gr=3;e.pend=d;e.hp-=d;
      fx.push(e.label+' −'+d+(e.hp<=0?(quizPend(e)?' (se tambalea)':(B.o.chain==='llufu'&&ET[e.t].boss?' (cambia de forma)':' (se va)')):'')+'.');fxe.push(e.label+' −'+d+(e.hp<=0?(quizPend(e)?' (staggers)':(B.o.chain==='llufu'&&ET[e.t].boss?' (shifts form)':' (gone)')):'')+'.')}
    if(burnT){S.hp=Math.max(1,S.hp-burnT);fx.push('¡Te quemas! (−'+burnT+')');fxe.push('You get burned! (−'+burnT+')')}}
  const eff=N(fx.join(' '),fxe.join(' '));
  eff.fx=()=>{for(const e of targets){const p=epos(e);spark(p.x,p.y,k==='kuruf'?'#e8f4ff':'#ffd060',16);if(e.pend){e.hit=14;pop(p.x,p.y-10,'-'+e.pend,'#ffffff');sfx('hit');if(e.hp<=0&&!quizPend(e)){e.dead=true;e.fadeT=20}e.pend=0}}};
  say([head,eff],()=>{for(const e of targets)if(e.hp<=0&&!e.dead&&!quizPend(e)){e.dead=true;e.fadeT=20}bossSweep();if(!aliveE().some(x=>x.hp>0))return victory();enemyPhase()});
}
function epos(e){return{x:e.px||128,y:e.py||100}}
function pop(x,y,txt,col){B.pops.push({x,y,txt,col,t:50})}
function sealGloss(code,lg){
  const kil=code.endsWith('kil'),r=kil?code.slice(0,-3):code,vg=VG[r],g2=(kil?(lg==='en'?vg.nen:vg.nes):(lg==='en'?vg.en:vg.es))[0];
  return lg==='en'?'The next seal whispers: «'+g2+'»':'El siguiente sello susurra: «'+g2+'»';
}
function resolve(r,kil,tg,ei){
  const al=aliveE(),coll=tg==='all',targets=coll?al:[B.en[tg]],n=targets.length,need=coll?endFor(n):0;
  B.cursor=null;
  const form=r+(kil?'kil':'')+ENDS[ei];
  const vg=VG[r],gl={es:(kil?vg.nes:vg.es)[ei],en:(kil?vg.nen:vg.en)[ei]};
  const lines=[L(S.name,form+'!',gl.es,gl.en)];
  if(!coll||n>1)track('-nge / -mu / -mün',ei===need);
  if(ei!==need){
    sfx('bad');
    if(coll)lines.push(N('Los wekufü se miran confundidos. Les hablas a todos y son '+numP(n)+': para '+(n===2?'dos':'tres o más')+' se usa -'+ENDS[need]+'.',
      'The wekufü look at each other, confused. You are speaking to all of them and there are '+numP(n)+': for '+(n===2?'two':'three or more')+' you use -'+ENDS[need]+'.'));
    else lines.push(N(B.en[tg].label+' no entiende. Le hablas a uno solo: se usa -nge.',B.en[tg].label+' does not understand. You are speaking to just one: you use -nge.'));
    if(B.o.tut){lines.push(L('Kuku','Ka kiñe rupa!','"¡Otra vez! Cuenta a quién le hablas y elige la terminación."','"Once more! Count who you are speaking to and choose the ending."'));return say(lines,battleMenu)}
    return say(lines,enemyPhase);
  }
  const pr=praise();B.last={r,k:kil};if(!(B.noSp&&!B.noSp.dead&&B.en.includes(B.noSp)))S.sp=Math.min(SPMAX,(S.sp||0)+1);
  {const e0=targets[0];
  if((!coll||n===1)&&e0.seals&&e0.seals.length&&(r+(kil?'kil':''))===e0.seals[0]){
    e0.seals.shift();lines[0].fx=()=>{sfx('lvl');B.flash=14;B.shake=6};
    if(e0.seals.length)lines.push(N('¡CRAC! Un sello de luz se quiebra sobre '+e0.label+'. Quedan '+e0.seals.length+'. '+sealGloss(e0.seals[0],'es'),
      'CRACK! A seal of light shatters over '+e0.label+'. '+e0.seals.length+' left. '+sealGloss(e0.seals[0],'en')));
    else lines.push(N('¡CRAC! ¡El último sello se quiebra sobre '+e0.label+'! Ahora tus palabras y tu newen sí pueden herirlo.',
      'CRACK! The last seal shatters over '+e0.label+'! Now your words and your newen can truly hurt it.'));
    return say(lines,enemyPhase);
  }}
  const fx=[],fxe=[];
  const castFx=()=>{sfx('cast');B.flash=8};
  lines[0].fx=castFx;
  let burnT=0;
  if(r==='amutu'&&!kil){
    for(const e of targets){const T=ET[e.t];
      if(T.fly&&e.gr<=0){fx.push(e.label+' vuela muy alto: no te alcanza.');fxe.push(e.label+' flies too high: it does not reach.');e.miss=1;continue}
      if(e.hidden){fx.push(e.label+' está escondido en la niebla: tus palabras se pierden.');fxe.push(e.label+' is hidden in the fog: your words are lost.');e.miss=1;continue}
      if(e.tall){fx.push(e.label+' está erguido, altísimo: tus palabras le pasan por debajo.');fxe.push(e.label+' stands tall, towering: your words pass beneath it.');e.miss=1;continue}
      if(bossBlock(e)){e.miss=1;fx.push(e.label+' se cubre: ¡bloquea tu golpe!'+(B.blkHint?'':' (En el suelo no podría cubrirse...)'));fxe.push(e.label+' guards: it blocks your blow!'+(B.blkHint?'':' (On the ground it could not guard...)'));B.blkHint=1;continue}
      let d=coll?Math.max(1,Math.round((atk()+rnd(4))*.75)):atk()+rnd(4)+2;if(e.burn)burnT+=2;
      if(e.armor){d=Math.max(1,Math.round(d*.25));fx.push(e.label+': el golpe rebota en su coraza de piedra.');fxe.push(e.label+': the blow bounces off its stone crust.')}
      if(ET[e.t].thick){d=Math.max(1,Math.round(d/2));fx.push(e.label+': su cuerpo de niebla espesa amortigua el golpe.');fxe.push(e.label+': its body of thick fog softens the blow.')}
      if(e.seals&&e.seals.length){d=Math.min(2,d);fx.push(e.label+': la barrera de luz desvía casi todo el golpe.');fxe.push(e.label+': the barrier of light turns aside most of the blow.')}
      if(e.dreaming){d=Math.min(1,d);fx.push(e.label+' duerme caminando: tus golpes se pierden en su sueño gris. Algo te dice que hay que despertarlo.');fxe.push(e.label+' sleeps as it walks: your blows are lost in its grey dream. Something tells you it must be woken.')}
      if(e.down){d+=4;e.down=0;fx.push(e.label+' está en el suelo: el golpe entra con todo (+4).');fxe.push(e.label+' is on the ground: the blow lands full force (+4).')}
      e.pend=d;e.hp-=d;
      if(e.hp<=0&&quizPend(e)){fx.push(e.label+' se tambalea (−'+d+')...');fxe.push(e.label+' staggers (−'+d+')...')}else if(e.hp<=0){const sh=B.o.chain==='llufu'&&ET[e.t].boss;fx.push(e.label+(sh?' cambia de forma (−':' se va (−')+d+(sh?')...':').'));fxe.push(e.label+(sh?' shifts form (−':' goes away (−')+d+(sh?')...':').'))}else{fx.push(e.label+' −'+d+'.');fxe.push(e.label+' −'+d+'.')}}
  }else if(r==='amutu'){fx.push('Les dijiste que no se fueran... y se quedan, felices.');fxe.push('You told them not to leave... so they stay, happily.')}
  else if(r==='küpa'&&!kil){fx.push('¡Les dijiste que vinieran! Se lanzan sobre ti.');fxe.push('You told them to come! They rush at you.');B.rush=new Set(targets)}
  else if(r==='küpa'){B.blocked=new Set(targets);fx.push(coll?'Los wekufü se detienen: este turno no pueden alcanzarte.':targets[0].label+' se detiene: este turno no puede alcanzarte.');fxe.push(coll?'The wekufü stop: this turn they cannot reach you.':targets[0].label+' stops: this turn it cannot reach you.')}
  else if(r==='umawtu'&&!kil){for(const e of targets){const T=ET[e.t];if(T.boss){fx.push(e.label+' no se duerme.');fxe.push(e.label+' does not fall asleep.');continue}
      if(Math.random()<(coll?.7:.9)){e.sl=2;fx.push(e.label+' se duerme.');fxe.push(e.label+' falls asleep.')}else{fx.push(e.label+' bosteza, pero no se duerme.');fxe.push(e.label+' yawns, but stays awake.')}}}
  else if(r==='umawtu'){let w=0;for(const e of targets)if(e.sl){e.sl=0;w=1}fx.push(w?'¡Los despertaste!':'Ninguno dormía.');fxe.push(w?'You woke them up!':'None of them was asleep.')}
  else if(r==='nagtu'&&!kil){let any=0;for(const e of targets)if(ET[e.t].fly){e.gr=3;any=1;fx.push(e.label+' baja al suelo.');fxe.push(e.label+' comes down to the ground.')}
      if(!any){fx.push('No vuela: ya está abajo.');fxe.push('It does not fly: it is already down.')}}
  else if(r==='nagtu'){fx.push('Les dijiste que no bajaran. Siguen donde estaban.');fxe.push('You told them not to come down. They stay where they were.')}
  else if(r==='lef'&&!kil){for(const e of targets){const T=ET[e.t];
      if(T.boss||T.mini){fx.push(e.label+' no tiene miedo: no va a correr.');fxe.push(e.label+' is not afraid: it will not run.');continue}
      if(e.hp<=e.max*.5){e.hp=0;e.pend=0;e.dead=true;e.fadeT=20;fx.push(e.label+' sale corriendo y no vuelve.');fxe.push(e.label+' runs off and does not come back.')}
      else{fx.push(e.label+' todavía tiene fuerzas: no quiere correr.');fxe.push(e.label+' still has strength: it does not want to run.')}}}
  else if(r==='lef'){fx.push('Les dijiste que no corrieran. Se quedan.');fxe.push('You told them not to run. They stay.')}
  else if(r==='ñam'&&!kil){for(const e of targets){const T=ET[e.t];
      if(T.boss){fx.push(e.label+' es demasiado fuerte para perderse.');fxe.push(e.label+' is too strong to get lost.');continue}
      if(e.hp<=Math.ceil(e.max/3)){e.hp=0;e.pend=0;e.dead=true;e.fadeT=20;fx.push(e.label+' se desvanece en el aire... ¡y no vuelve!');fxe.push(e.label+' fades into the air... and does not come back!')}
      else{fx.push(e.label+' todavía tiene fuerzas: no se pierde.');fxe.push(e.label+' still has strength: it does not get lost.')}}}
  else if(r==='ñam'){fx.push('Les dijiste que no se perdieran. Ahí siguen.');fxe.push('You told them not to get lost. There they stay.')}
  else if(r==='tripa'&&!kil){for(const e of targets){if(e.hidden){e.hidden=0;e.hideT=3;fx.push(e.label+' sale de la niebla: ¡ahora sí lo ves!');fxe.push(e.label+' comes out of the fog: now you can see it!')}else{fx.push(e.label+' ya está a la vista.');fxe.push(e.label+' is already in sight.')}}}
  else if(r==='tripa'){fx.push('Les dijiste que no salieran. Nada cambia.');fxe.push('You told them not to come out. Nothing changes.')}
  else if(r==='trafo'&&!kil){for(const e of targets){if(e.armor){e.armor=0;e.armorT=ET[e.t].boss?4:0;fx.push(e.label+': ¡se le quiebra la coraza de piedra!');fxe.push(e.label+': its stone crust cracks apart!')}else{fx.push(e.label+' no tiene coraza que quebrar.');fxe.push(e.label+' has no crust to break.')}}}
  else if(r==='trafo'){fx.push('Les dijiste que no se quebraran. Nada cambia.');fxe.push('You told them not to break. Nothing changes.')}
  else if(r==='wütre'&&!kil){for(const e of targets){const T=ET[e.t];
      if(T.snow){e.hp=Math.min(e.max,e.hp+4);fx.push(e.label+' es de nieve: ¡le encanta el frío! (+4)');fxe.push(e.label+' is made of snow: it loves the cold! (+4)')}
      else if(e.burn){e.burn=0;e.cool=T.boss?3:0;if(!T.boss)e.stun=1;fx.push(e.label+': ¡su fuego se apaga!');fxe.push(e.label+': its fire goes out!')}
      else if(!T.boss&&Math.random()<(coll?.4:.6)){e.stun=1;fx.push(e.label+' tirita de frío y pierde su turno.');fxe.push(e.label+' shivers with cold and loses its turn.')}
      else{fx.push(e.label+' tirita, pero sigue ahí.');fxe.push(e.label+' shivers, but stays put.')}}}
  else if(r==='wütre'){fx.push('Les dijiste que no tuvieran frío. Se ven contentos.');fxe.push('You told them not to be cold. They look pleased.')}
  else if(r==='llüka'&&!kil){for(const e of targets){const T=ET[e.t];
      if(T.boss&&e.tall){fx.push(e.label+' no siente miedo mientras está erguido.');fxe.push(e.label+' feels no fear while it stands tall.');continue}
      if(T.boss||Math.random()<(coll?.75:.92)){e.fear=3;fx.push(e.label+' tiembla de miedo: golpeará más débil.');fxe.push(e.label+' trembles with fear: it will hit weaker.')}else{fx.push(e.label+' no se asusta.');fxe.push(e.label+' is not scared.')}}}
  else if(r==='llüka'){let w=0;for(const e of targets)if(e.fear){e.fear=0;w=1}fx.push(w?'Les quitaste el miedo... ¡vuelven con toda su fuerza!':'Ninguno tenía miedo.');fxe.push(w?'You took away their fear... they come back at full strength!':'None of them was afraid.')}
  else if(r==='trana'&&!kil){for(const e of targets){const T=ET[e.t];
      if(T.fly&&e.gr<=0){fx.push(e.label+' está volando: no tiene dónde caerse.');fxe.push(e.label+' is flying: it has nowhere to fall.');continue}
      if(T.boss){e.down=2;fx.push(e.label+' se tambalea e hinca una rodilla: el próximo golpe le dolerá más.');fxe.push(e.label+' staggers and drops to one knee: the next blow will hurt it more.');continue}
      e.stun=1;e.down=2;fx.push(e.label+' cae al suelo: pierde su turno, y el próximo golpe le dolerá más.');fxe.push(e.label+' falls to the ground: it loses its turn, and the next blow will hurt it more.')}}
  else if(r==='trana'){fx.push('Les dijiste que no se cayeran. Se quedan bien parados.');fxe.push('You told them not to fall. They stay firmly on their feet.')}
  else if(r==='llako'&&!kil){for(const e of targets){const T=ET[e.t];
      if(e.hidden){fx.push(e.label+' está escondido: tu canto se pierde en el agua oscura.');fxe.push(e.label+' is hidden: your song is lost in the dark water.');e.miss=1;continue}
      const ulk=B.o.chain==='llufu'&&T.boss;
      if(ulk){
        let d=atk()+rnd(4)+3;
        if(e.armor){d=Math.max(1,Math.round(d*.25));fx.push(e.label+': la coraza de huesos apaga el canto.');fxe.push(e.label+': the bone breastplate muffles the song.')}
        if(e.seals&&e.seals.length){d=Math.min(2,d);fx.push(e.label+': la barrera de luz apaga casi todo el canto.');fxe.push(e.label+': the barrier of light smothers most of the song.')}
        if(e.down){d+=4;e.down=0}
        e.pend=d;e.hp-=d;
        fx.push('El ül envuelve a '+e.label+': su furia se enfría, más cerca de la calma (−'+d+').');fxe.push('The ül wraps around '+e.label+': his fury cools, closer to calm (−'+d+').');
      }else if(T.boss){fx.push(e.label+' no se aquieta con palabras.');fxe.push(e.label+' is not stilled by words.')}
      else{const d=e.seals&&e.seals.length?Math.min(2,2):2;e.pend=d;e.hp-=d;if(!ET[e.t].fly&&Math.random()<.35)e.sl=1;
        fx.push(e.label+' se aquieta un poco (−'+d+').');fxe.push(e.label+' settles a little (−'+d+').');}}}
  else if(r==='llako'){fx.push('Les dijiste que no se calmaran. Se agitan, pero nada más pasa.');fxe.push('You told them not to calm down. They stir, but nothing more happens.')}
  else if(r==='nepe'&&!kil){for(const e of targets){
      if(e.sl){e.sl=0;const d=8;e.pend=d;e.hp-=d;fx.push(e.label+' despierta de golpe: ¡el susto lo sacude! (−'+d+')');fxe.push(e.label+' wakes with a start: the shock rattles it! (−'+d+')');continue}
      if(e.dreaming){e.dreaming=0;e.dreamT=4;e.stun=1;fx.push(e.label+' abre los ojos: su sueño gris se deshace y pierde el turno. ¡Ahora tus golpes sí le llegan!');fxe.push(e.label+' opens its eyes: its grey dream falls apart and it loses its turn. Now your blows can reach it!');continue}
      fx.push(e.label+' no dormía: te mira extrañado.');fxe.push(e.label+' was not asleep: it gives you a puzzled look.')}}
  else if(r==='nepe'){fx.push('Les dijiste que no despertaran. Nada cambia.');fxe.push('You told them not to wake up. Nothing changes.')}
  else if(r==='wüñotreka'&&!kil){for(const e of targets){const T=ET[e.t];
      if(e.tall){e.tall=0;e.low=3;e.stun=1;fx.push(e.label+' retrocede, se encoge y queda a tu alcance.');fxe.push(e.label+' steps back, shrinks down and is within your reach.');continue}
      if(T.boss&&B.tele){B.tele=false;fx.push(e.label+' retrocede y pierde el impulso: ya no se lanza.');fxe.push(e.label+' steps back and loses its momentum: it no longer lunges.');continue}
      if(!T.boss&&Math.random()<(coll?.6:.85)){e.stun=1;fx.push(e.label+' retrocede y pierde su turno.');fxe.push(e.label+' steps back and loses its turn.')}else{fx.push(e.label+' se tambalea, pero sigue ahí.');fxe.push(e.label+' staggers, but stays put.')}}}
  else if(r==='wüñotreka'){fx.push('Les dijiste que no retrocedieran. Se quedan firmes.');fxe.push('You told them not to go back. They hold their ground.')}
  if(burnT){S.hp=Math.max(1,S.hp-burnT);fx.push('¡Te quemas con su fuego! (−'+burnT+')');fxe.push('You get burned by its fire! (−'+burnT+')')}
  const eff=L('',pr.m+(S.sp>=2?'  ✦'+S.sp:''),fx.join(' '),fxe.join(' '));
  eff.fx=()=>{for(const e of targets){const p=epos(e);spark(p.x,p.y,r==='amutu'?'#fff6a0':r==='umawtu'?'#a0c8ff':r==='nagtu'?'#ffe080':'#ffffff',10);
      if(e.pend){e.hit=12;pop(p.x,p.y-10,'-'+e.pend,'#ffffff');sfx('hit');if(e.hp<=0&&!quizPend(e)){e.dead=true;e.fadeT=20}e.pend=0}
      else if(e.miss){pop(p.x,p.y-10,'MISS','#a0c0ff');e.miss=0}
      else if(r==='umawtu'&&e.sl){pop(p.x,p.y-10,'zZ','#c0e0ff');sfx('sleep')}
      else if(r==='nagtu'&&e.gr===3){pop(p.x,p.y-10,'↓','#ffe080')}
      else if(r==='küpa'&&kil){pop(p.x,p.y-10,'✋','#ffe080');sfx('block')}}};
  lines.push(eff);
  say(lines,()=>{for(const e of targets)if(e.hp<=0&&!e.dead&&!quizPend(e)){e.dead=true;e.fadeT=20}bossSweep();if(!aliveE().some(x=>x.hp>0))return victory();enemyPhase()});
}
function enemyPhase(){
  const fx=[],fxe=[];let dmgTotal=0;const hitsFx=[];
  if(B.o.chain==='llufu'&&B.turn%3===2&&S.hp<maxHP()){S.hp=Math.min(maxHP(),S.hp+6);fx.push('Los chumpall cantan a tu alrededor: su ül te devuelve fuerzas (+6).');fxe.push('The chumpall sing around you: their ül gives you strength back (+6).');hitsFx.push(()=>{spark(60,30,'#7ae0c0',10);sfx('heal')})}
  if(typeof kyEnemyPre==='function')kyEnemyPre(fx,fxe,hitsFx);
  const hitP=(e,mult,tag)=>{
    if(B.blocked&&B.blocked.has(e)){fx.push(e.label+': ¡bloqueado!');fxe.push(e.label+': blocked!');hitsFx.push(()=>{const p=epos(e);pop(p.x,p.y-10,'✋','#ffe080');sfx('block')});return}
    const T=ET[e.t],rush=B.rush&&B.rush.has(e);
    let d=Math.max(1,Math.round((T.atk+Math.floor(progK()*(T.boss?.3:.6))+rnd(3)-1)*(mult||1)*(rush?1.5:1)*(e.fear>0?.5:1))-(S.hm?heroExp().def:def()));if(S.hm){const X=heroExp();if(S.hmDef0==null)S.hmDef0=def();d=Math.max(1,Math.round(Math.max(1.5,d)*heroMul()*maxHP()/X.hp*Math.min(1,Math.max(.4,1-.04*(def()-S.hmDef0)))))}/* weichafe: each defense point gained since the mode began takes 4% off (up to 60%) */if(B.o.tut)d=Math.min(3,Math.max(1,Math.round(d*.4)));if(typeof kyRedirect==='function'){const kr=kyRedirect(e,d,fx,fxe,hitsFx);if(kr.skip)return;d=kr.d}S.hp-=d;dmgTotal+=d;
    fx.push(e.label+(tag?tag.es:' te golpea')+' (−'+d+').');fxe.push(e.label+(tag?tag.en:' hits you')+' (−'+d+').');
    if(T.drain){const hl=Math.ceil(d/2);e.hp=Math.min(e.max,e.hp+hl);fx.push(e.label+' bebe tu fuerza (+'+hl+').');fxe.push(e.label+' drinks your strength (+'+hl+').');hitsFx.push(()=>{const p=epos(e);pop(p.x,p.y-10,'+'+hl,'#80ff90')})}
    hitsFx.push(()=>{const g=!ET[e.t].fly&&!ET[e.t].boss&&GEM_ON;e.lunge=g?22:16;e.lunge0=e.lunge;pop(60,30,'-'+d,'#ff6050')})};
  for(const e of aliveE()){const T=ET[e.t];
    if(e.hp<=0)continue; // staggered by the ngen's question: it does not act
    if(B.o.final&&/^ngoyman[1-5]$/.test(e.t)){e.ft=(e.ft||0)+1;const ln=e.lanN||0,lim=e.t==='ngoyman5'?2:1;
      if(ln<lim&&!B.lanPending&&((ln===0&&e.ft===2)||(ln===1&&e.ft>=4&&e.hp<e.max*.6))){e.lanN=ln+1;e.hidden=0;B.lanPending=e;
        fx.push(e.label+' alza los brazos y la niebla se vuelve palabras muertas...');fxe.push(e.label+' raises its arms and the fog turns into dead words...');hitsFx.push(()=>{sfx('cast');B.flash=14;B.shake=10;B.lanFx={e,t:0,cast:0}});continue}}
    if(e.sl>0){e.sl--;fx.push(e.label+' duerme.');fxe.push(e.label+' is asleep.');continue}
    if(e.stun>0){e.stun--;fx.push(e.label+' todavía retrocede.');fxe.push(e.label+' is still backing away.');continue}
    if(e.t==='ngoyam'&&Math.random()<.3&&(S.sp||0)>0){S.sp--;fx.push(e.label+' te susurra el olvido: pierdes un punto de newen (✦).');fxe.push(e.label+' whispers forgetting to you: you lose one newen point (✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')});continue}
    if(e.t==='ngoyman1'||e.t==='llufu1'){const wat=e.t==='llufu1';
      if(!e.hidden&&e.hideT>0){e.hideT--;if(e.hideT<=0){e.hidden=1;fx.push(wat?'El agua oscura vuelve a tragarse al Millalobo.':'La niebla vuelve a tragarse a Ti Fütra Ngoymatulfe.');fxe.push(wat?'The dark water swallows the Millalobo again.':'The fog swallows Ti Fütra Ngoymatulfe again.');continue}}
      if(!e.hidden&&!e.hideT&&B.turn===0){e.hidden=1;fx.push(wat?'El Millalobo se hunde en el agua oscura: no ves dónde golpear.':'El velo de niebla se cierra sobre el gran olvido: no ves dónde golpear.');fxe.push(wat?'The Millalobo sinks into the dark water: you cannot see where to strike.':'The veil of fog closes over the great forgetting: you cannot see where to strike.');continue}
      if(!wat&&B.turn>0&&B.turn%3===2){hitP(e,2.0,{es:': dos garras de niebla salen del velo y te cruzan el pecho',en:': two claws of fog lash out of the veil and rake your chest'});hitsFx.push(()=>B.shake=10);continue}
      hitP(e,e.hidden?1:1.3,wat?{es:' te golpea con una aleta desde lo oscuro',en:' strikes you with a flipper from the dark'}:{es:' te azota con un jirón de niebla',en:' lashes you with a shred of fog'});continue}
    if(e.t==='llufu2'){
      if(!e.armor){e.armorT=(e.armorT||0)-1;if(e.armorT<=0){e.armor=1;fx.push('La coraza de huesos de ballena del Millalobo vuelve a cerrarse.');fxe.push('The Millalobo\'s whalebone breastplate closes again.');continue}}
      hitP(e,B.turn%3===2?1.5:1,{es:' golpea con sus puños',en:' strikes with his fists'});continue}
    if(e.t==='llufu4'){
      if(!e.seals)e.seals=[];
      if(!e.seals.length&&B.turn>0&&B.turn%3===0){const pool=S.roots.slice();let code=pool[rnd(pool.length)];if(Math.random()<.4)code+='kil';e.seals=[code];
        fx.push('¡El piwke del Millalobo alza una barrera de luz! '+sealGloss(code,'es'));fxe.push('The Millalobo\'s heart raises a barrier of light! '+sealGloss(code,'en'));hitsFx.push(()=>{sfx('cast');B.flash=10});continue}
      hitP(e,1.1,{es:' late con fuerza y el agua te golpea',en:' beats hard and the water slams you'});continue}
    if(e.t==='llufu5'){
      if(B.en.length<4&&Math.random()<.3){const t2=Math.random()<.5?'kowek':'mawek',ne=mkEnemy(t2);B.en.push(ne);relabel();
        fx.push('El Millalobo llama a las aguas: ¡'+ne.label+' aparece!');fxe.push('The Millalobo calls the waters: '+ne.label+' appears!');continue}
      if(B.turn%3===2){hitP(e,1.9,{es:' se deja caer entero sobre ti',en:' crashes his whole body down on you'});continue}
      hitP(e,.9);hitP(e,.9,{es:' barre con las aletas',en:' sweeps with his flippers'});continue}
    if(e.t==='ngoyman3'){
      if(B.turn>0&&B.turn%4===3){if((S.sp||0)>0)S.sp--;hitP(e,1.9,{es:': un latido de losa te aplasta contra el suelo (−✦)',en:': a stone-slab beat crushes you to the ground (−✦)'});hitsFx.push(()=>{B.shake=12;pop(60,30,'−✦','#c0b8ff');sfx('bad')});continue}
      if(!e.armor){e.armorT=(e.armorT||0)-1;if(e.armorT<=0){e.armor=1;fx.push('La coraza gris del piwke vuelve a cerrarse.');fxe.push('The grey crust of the heart closes again.');continue}}
      if(B.turn%2===1&&(S.sp||0)>0){S.sp--;fx.push('El piwke del olvido late: una palabra tuya se borra (−✦).');fxe.push('The heart of forgetting beats: one of your words is erased (−✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')});hitP(e,.7,{es:' te golpea con su latido',en:' strikes you with its beat'});continue}
      hitP(e);continue}
    if(e.t==='ngoyman2'){
      if(B.tele){B.tele=false;hitP(e,2.6,{es:': el puño de piedra, cargado con toda la niebla de la sala, cae entero sobre ti',en:': the stone fist, laden with all the fog in the hall, comes down whole upon you'});hitsFx.push(()=>B.shake=14);continue}
      if(B.turn>0&&B.turn-(e.lastTele||-9)>3&&Math.random()<.3){B.tele=true;e.lastTele=B.turn;fx.push('Fütra Ngoymatulfe junta toda la niebla de la sala sobre su puño...');fxe.push('Fütra Ngoymatulfe gathers all the fog in the hall over its fist...');continue}
      if(!e.seals)e.seals=[];
      if(!e.seals.length&&B.turn>0&&B.turn%4===0){const pool=S.roots.slice();let code=pool[rnd(pool.length)];if(Math.random()<.4)code+='kil';e.seals=[code];
        fx.push('¡Fütra Ngoymatulfe alza una barrera de luz robada! '+sealGloss(code,'es'));fxe.push('Fütra Ngoymatulfe raises a barrier of stolen light! '+sealGloss(code,'en'));hitsFx.push(()=>{sfx('cast');B.flash=10});continue}
      if(B.en.length<4&&Math.random()<.3){const t2=SUMMONP[rnd(SUMMONP.length)],ne=mkEnemy(t2);B.en.push(ne);relabel();
        fx.push('El olvido recuerda a tus enemigos: ¡'+ne.label+' sale de la niebla!');fxe.push('The forgetting remembers your enemies: '+ne.label+' steps out of the fog!');continue}
      if(B.turn%3===2){hitP(e,2.0,{es:' descarga el golpe del olvido',en:' brings down the blow of forgetting'});continue}
      if(Math.random()<.25&&(S.sp||0)>0){S.sp--;fx.push('Fütra Ngoymatulfe aspira tus palabras (−✦).');fxe.push('Fütra Ngoymatulfe breathes in your words (−✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')})}
      hitP(e,.8);hitP(e,.8,{es:' golpea otra vez',en:' strikes again'});continue}
    if(e.t==='ngoyman4'){
      if(B.turn>0&&B.turn%4===2&&!S.curse){S.curse=1;hitP(e,1.6,{es:': los seis ojos arden a la vez y su mirada te marca (maldición: fuerza −2)',en:': all six eyes blaze at once and their gaze marks you (curse: strength −2)'});hitsFx.push(()=>sfx('bad'));continue}
      if(!e.armor){e.armorT=(e.armorT||0)-1;if(e.armorT<=0){e.armor=1;fx.push('La oscuridad se espesa alrededor de Füta Dumiñ: su coraza de sombra se rehace.');fxe.push('The darkness thickens around Füta Dumiñ: its crust of shadow reforms.');continue}}
      if(B.turn>0&&B.turn%3===0){hitP(e,2.0,{es:': la noche entera se te viene encima',en:': the whole night comes down on you'});hitsFx.push(()=>B.shake=10);continue}
      if(Math.random()<.25&&(S.sp||0)>0){S.sp--;fx.push('Seis ojos apagados te miran a la vez: una palabra se te borra (−✦).');fxe.push('Six burnt-out eyes look at you at once: one of your words is erased (−✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')})}
      hitP(e,.85);hitP(e,.85,{es:' golpea con un brazo de humo',en:' strikes with an arm of smoke'});continue}
    if(e.t==='ngoyman5'){
      if(B.turn>0&&B.turn%4===2){const st2=Math.min(2,S.sp||0);S.sp-=st2;const hl=Math.min(e.max||ET[e.t].hp,e.hp+12)-e.hp;e.hp+=hl;
        hitP(e,1.2,{es:': la boca sin fondo aspira: te roba palabras (−'+st2+'✦) y recupera fuerzas (+'+hl+')',en:': the bottomless mouth inhales: it steals your words (−'+st2+'✦) and recovers strength (+'+hl+')'});
        hitsFx.push(()=>{sfx('bad');const p2=epos(e);pop(p2.x,p2.y-10,'+'+hl,'#80ff90')});continue}
      if(!e.seals)e.seals=[];
      if(!e.seals.length&&B.turn>0&&B.turn%3===0){const pool=S.roots.slice();let code=pool[rnd(pool.length)];if(Math.random()<.4)code+='kil';e.seals=[code];
        fx.push('¡Rüf Fütra Ngoymatulfe alza una barrera de luz robada! '+sealGloss(code,'es'));fxe.push('Rüf Fütra Ngoymatulfe raises a barrier of stolen light! '+sealGloss(code,'en'));hitsFx.push(()=>{sfx('cast');B.flash=10});continue}
      if(B.en.length<4&&Math.random()<.3){const t2=SUMMONP[rnd(SUMMONP.length)],ne=mkEnemy(t2);B.en.push(ne);relabel();
        fx.push('El olvido recuerda a tus enemigos: ¡'+ne.label+' sale de la niebla!');fxe.push('The forgetting remembers your enemies: '+ne.label+' steps out of the fog!');continue}
      if(B.turn%3===2){hitP(e,2.3,{es:': la boca sin fondo se cierra sobre ti',en:': the bottomless mouth closes over you'});hitsFx.push(()=>B.shake=12);continue}
      if(Math.random()<.3&&(S.sp||0)>0){S.sp--;fx.push('Rüf Fütra Ngoymatulfe aspira tus palabras (−✦).');fxe.push('Rüf Fütra Ngoymatulfe breathes in your words (−✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')})}
      hitP(e,.85);hitP(e,.85,{es:' golpea otra vez',en:' strikes again'});continue}
    if(e.t==='walichu'){
      if(!e.dreaming&&e.dreamT>0){e.dreamT--;
        if(e.dreamT<=0){e.dreaming=1;fx.push('El Walichu vuelve a envolverse en su sueño gris.');fxe.push('The Walichu wraps itself in its grey dream again.');continue}}
      if(e.dreaming&&B.turn%2===0&&(S.sp||0)>0){S.sp--;fx.push('El Walichu te susurra el olvido: pierdes un punto de newen (✦).');fxe.push('The Walichu whispers forgetting to you: you lose one newen point (✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')});hitP(e,.6,{es:' te roza con sus dedos de polvo',en:' brushes you with its dust fingers'});continue}
      hitP(e,e.dreaming?.8:1.3,e.dreaming?{es:' te golpea entre sueños',en:' strikes you from inside its dream'}:{es:' te desgarra con sus garras, bien despierto',en:' tears at you with its claws, wide awake'});continue}
    if(e.t==='kaleuche'){
      if(B.tele){B.tele=false;hitP(e,2.2,{es:' te embiste con su proa',en:' rams you with its prow'});continue}
      if(!e.hidden&&e.hideT>0){e.hideT--;if(e.hideT<=0){e.hidden=1;fx.push('La niebla se cierra: el Kaleuche desaparece en ella.');fxe.push('The fog closes in: the Kaleuche disappears into it.');continue}}
      if(!e.hidden&&!e.hideT&&B.turn===0){e.hidden=1;fx.push('El Kaleuche se esconde en la niebla.');fxe.push('The Kaleuche hides in the fog.');continue}
      const roll=Math.random(),mc=aliveE().filter(x=>x.t==='mawek').length;
      if(roll<.28&&B.turn>0&&B.turn-(e.lastTele||-9)>2){B.tele=true;e.lastTele=B.turn;fx.push('El Kaleuche despliega sus velas: el viento muerto lo empuja hacia ti.');fxe.push('The Kaleuche unfurls its sails: a dead wind pushes it toward you.');continue}
      if(roll<.45&&mc<1&&B.en.length<5){const ne=mkEnemy('mawek');B.en.push(ne);relabel();fx.push('¡Del barco baja '+ne.label+'!');fxe.push(ne.label+' comes down from the ship!');continue}
      hitP(e);continue}
    if(e.t==='cherrufe'){
      if(B.tele){B.tele=false;hitP(e,2.2,{es:' te cae encima como un río de lava',en:' falls on you like a river of lava'});continue}
      if(!e.armor&&e.armorT>0){e.armorT--;if(e.armorT<=0){e.armor=1;fx.push('La lava se endurece: la coraza del Cherufe vuelve.');fxe.push("The lava hardens: the Cherufe's crust comes back.");continue}}
      if(!e.burn&&e.cool>0){e.cool--;if(e.cool<=0){e.burn=1;fx.push('El Cherufe vuelve a arder.');fxe.push('The Cherufe bursts into flame again.');continue}}
      const roll=Math.random(),kc=aliveE().filter(x=>x.t==='kutral').length;
      if(roll<.28&&B.turn>0&&B.turn-(e.lastTele||-9)>2){B.tele=true;e.lastTele=B.turn;fx.push('El Cherufe levanta los brazos: la lava hierve a sus pies.');fxe.push('The Cherufe raises its arms: the lava boils at its feet.');continue}
      if(roll<.45&&kc<1&&B.en.length<5){const ne=mkEnemy('kutral');B.en.push(ne);relabel();fx.push('¡El Cherufe lanza una chispa: aparece '+ne.label+'!');fxe.push('The Cherufe throws a spark: '+ne.label+' appears!');continue}
      hitP(e);continue}
    if(e.t==='witranalwe'){
      if(B.tele){B.tele=false;hitP(e,2.2,{es:' se lanza sobre ti',en:' lunges at you'});continue}
      if(!e.tall&&e.low>0){e.low--;if(e.low<=0){e.tall=1;fx.push('Witranalwe vuelve a erguirse, altísimo.');fxe.push('The Witranalwe rises up again, towering.');continue}}
      const roll=Math.random(),kc=aliveE().filter(x=>x.t==='kolokolo').length;
      if(roll<.3&&B.turn>0&&B.turn-(e.lastTele||-9)>2){B.tele=true;e.lastTele=B.turn;fx.push('Witranalwe se agacha y junta fuerza para lanzarse.');fxe.push('The Witranalwe crouches and gathers strength to lunge.');continue}
      if(roll<.48&&kc<1&&B.en.length<5){const ne=mkEnemy('kolokolo');B.en.push(ne);relabel();fx.push('¡Witranalwe llama a '+ne.label+'!');fxe.push('The Witranalwe calls '+ne.label+'!');continue}
      hitP(e);continue}
    if(e.t==='trelke'){
      if(B.tele){B.tele=false;hitP(e,2.2,{es:' te envuelve',en:' wraps around you'});continue}
      const roll=Math.random(),laf=aliveE().filter(x=>x.t==='laftrache').length;
      if(roll<.32&&B.turn>0){B.tele=true;fx.push('Trelke-wekufü se estira, listo para envolverte.');fxe.push('Trelke-wekufü stretches out, ready to wrap you up.');continue}
      if(roll<.52&&laf<1&&B.en.length<5){const ne=mkEnemy('laftrache');B.en.push(ne);relabel();fx.push('¡Trelke-wekufü llama a '+ne.label+'!');fxe.push('Trelke-wekufü calls up '+ne.label+'!');continue}
      hitP(e);continue}
    if(e.t==='llawfen'){llawTurn(e,hitP,fx,fxe,hitsFx);continue}
    const SBK={chinifilu:['El Chiñifilu te salpica con el barro podrido del fondo','The Chiñifilu splashes you with the rotten mud of the deep'],
      piwuchen:['El Piwüchen alcanza a rozarte el cuello con su boca de aguja','The Piwüchen grazes your neck with its needle mouth'],
      wallipen:['La sombra torcida del Wallepeñ te pasa por encima','The Wallepeñ\'s crooked shadow passes over you'],
      trawko:['El Trawko te lanza un puñado de astillas envenenadas','The Trawko flings a handful of poisoned splinters at you'],
      chadikura:['El polvo de sal del Elëngasëm te entra en la boca y los ojos','The Elëngasëm\'s salt dust gets into your mouth and eyes'],
      kalku:['El Fütra Kalku sopla un aliento de enfermedad sobre ti','The Fütra Kalku breathes a sickness over you']};
    if(SBK[e.t]&&!S.kutran&&B.turn>0&&Math.random()<.22){S.kutran=1;
      fx.push(SBK[e.t][0]+': te entra un weda kutran (fuerza −3, defensa −2). Solo el Lawentun lo cura.');
      fxe.push(SBK[e.t][1]+': a weda kutran takes hold of you (strength −3, defense −2). Only Lawentun can cure it.');
      hitsFx.push(()=>sfx('bad'));continue}
    if(e.t==='chinifilu'){
      if(B.turn>0&&B.turn%3===0){hitP(e,2.1,{es:' te envuelve en sus anillos y aprieta hasta crujir',en:' wraps you in its coils and squeezes until something creaks'});continue}
      if(!S.curse&&Math.random()<.3){S.curse=1;fx.push('El Chiñifilu escupe un chorro de agua helada: quedas con maldición (fuerza −2). El lawen la quita.');fxe.push('The Chiñifilu spits a jet of icy water: you are cursed (strength −2). Lawen lifts it.');hitsFx.push(()=>sfx('bad'));continue}
      hitP(e);continue}
    if(e.t==='piwuchen'){
      if(B.turn>0&&B.turn%3===0&&(S.sp||0)>0){S.sp--;fx.push('El silbido agudo del Piwüchen te aturde: pierdes un punto de newen (✦).');fxe.push('The Piwüchen\'s shrill whistle rattles you: you lose one newen point (✦).');hitsFx.push(()=>{pop(60,30,'−✦','#c0b8ff');sfx('bad')});continue}
      hitP(e,Math.random()<.35?1.8:1,{es:' baja en picada y te muerde',en:' dives and bites you'});continue}
    if(e.t==='wallipen'){
      if(B.turn>0&&B.turn%3===0){hitP(e,1.8,{es:' exhala un aliento de escarcha que te golpea como una ola',en:' breathes out a frost that slams into you like a wave'});hitsFx.push(()=>B.shake=8);continue}
      if(!S.chill&&Math.random()<.3){S.chill=3;fx.push('El Wallepeñ te clava su mirada torcida: te tiemblan las manos (fuerza −2 por unos turnos).');fxe.push('The Wallepeñ fixes you with its crooked gaze: your hands shake (strength −2 for a few turns).');hitsFx.push(()=>sfx('bad'));continue}
      if(!e.armor&&e.armorT>0){e.armorT--;if(e.armorT<=0){e.armor=1;fx.push('El agua se congela sobre el Wallepeñ: su coraza de hielo vuelve.');fxe.push('Water freezes over the Wallepeñ: its ice crust returns.');continue}}
      hitP(e);continue}
    if(e.t==='trawko'){
      if(B.tele){B.tele=false;hitP(e,2.6,{es:' descarga su hacha con las dos manos',en:' brings its axe down with both hands'});continue}
      if(Math.random()<.3&&B.turn>0&&B.turn-(e.lastTele||-9)>2){B.tele=true;e.lastTele=B.turn;fx.push('El Trawko levanta su hacha sobre la cabeza...');fxe.push('The Trawko raises its axe over its head...');continue}
      hitP(e);continue}
    if(e.t==='chadikura'){
      if(B.turn>0&&B.turn%3===0){hitP(e,2.1,{es:' golpea el suelo: una ola de sal te sacude',en:' pounds the ground: a wave of salt rocks you'});hitsFx.push(()=>{B.shake=10});continue}
      if(!e.armor&&e.armorT>0){e.armorT--;if(e.armorT<=0){e.armor=1;fx.push('La sal vuelve a cristalizar: la coraza del Elëngasëm se rehace.');fxe.push('The salt crystallizes again: the Elëngasëm\'s crust reforms.');continue}}
      hitP(e);continue}
    if(e.t==='epunamun'){
      if(!e.parry&&Math.random()<.3){e.parry=1;fx.push('El Epunamun cruza sus dos lanzas y espera tu golpe.');fxe.push('The Epunamun crosses his two spears and waits for your blow.');continue}
      hitP(e,.85);hitP(e,.85,{es:' gira y golpea con la segunda lanza',en:' spins and strikes with the second spear'});continue}
    if(e.t==='yewen'){
      // it calls up what shame is made of: sorrow, anger, fear, mockery, the school that forbade the language
      const YK=B.ngoyCall?YEWEN_KIN.concat(['ngoysum']):YEWEN_KIN,mins=aliveE().filter(x=>YK.includes(x.t)).length;
      // it keeps calling them for the whole fight: on the first turn, every third turn, and every other turn once the field is clear
      if(mins<2&&(B.turn===0||B.turn%3===0||(mins===0&&B.turn%2===0))){
        B.en=B.en.filter(x=>!x.dead||x.fadeT>0);   // clear out the fallen so the line never fills up
        const have=new Set(aliveE().map(x=>x.t)),pool=YK.filter(t=>!have.has(t));let t=pool[rnd(pool.length)]||YK[rnd(YK.length)];
        if(B.ngoyCall===1&&!have.has('ngoysum')){t='ngoysum';B.ngoyCall=2}
        const ne=mkEnemy(t);B.en.push(ne);relabel();const L2=YEWEN_CALL[t];
        fx.push('El Yewen abre la capucha y de adentro sale '+ne.label+': '+L2[0]);fxe.push('The Yewen opens its hood and out comes '+ne.label+': '+L2[1]);hitsFx.push(()=>{sfx('bad');B.shake=6});continue}
      if(B.turn>0&&B.turn%4===1&&(S.sp||0)>0){S.sp--;hitP(e,1.0,{es:' susurra desde la capucha: «lo dices mal, mejor cállate». Las palabras se te atascan (−✦)',en:' whispers from inside the hood: "you say it wrong, better stay quiet". The words stick in your throat (−✦)'});hitsFx.push(()=>pop(60,30,'−✦','#c0b8ff'));continue}
      if(B.turn>0&&B.turn%4===3){hitP(e,2.4,{es:' te mira por fin, y la mirada pesa como una mochila de piedras: se te hunden los hombros',en:' finally looks at you, and the look weighs like a backpack of stones: your shoulders sink'});hitsFx.push(()=>B.shake=10);continue}
      if(Math.random()<.3){hitP(e,1.5,{es:' descarga el bastón del candado contra ti',en:' brings the padlock staff down on you'});hitsFx.push(()=>B.shake=7);continue}
      if(!S.curse&&Math.random()<.25){S.curse=1;fx.push('El Yewen se ríe bajito, sin boca. Te arde la cara: quedas con maldición (fuerza −2). El lawen la quita.');fxe.push('The Yewen laughs quietly, without a mouth. Your face burns: you are cursed (strength −2). Lawen lifts it.');hitsFx.push(()=>sfx('bad'));continue}
      hitP(e,1.15);continue}
    if(e.t==='wenangkun'){
      if((S.sp||0)>0&&Math.random()<.3){S.sp--;fx.push(e.label+' llora en silencio, y la pena se te contagia: pierdes un punto de newen (✦).');fxe.push(e.label+' weeps in silence, and the sorrow spreads to you: you lose one newen point (✦).');hitsFx.push(()=>pop(60,30,'−✦','#9ad0ff'));continue}
      hitP(e,1,{es:' te deja caer encima su lluvia gris',en:' lets its grey rain fall on you'});continue}
    if(e.t==='llukalfe'){
      if(e.tall&&Math.random()<.4){hitP(e,1.6,{es:' se inclina sobre ti, enorme, y te aplasta con su sombra',en:' leans over you, huge, and crushes you with its shadow'});continue}
      hitP(e);continue}
    if(e.t==='ayentufe'){
      if(!e.hidden&&e.hideT>0){e.hideT--;if(e.hideT<=0){e.hidden=1;fx.push(e.label+' se vuelve a esconder entre la gente, riéndose.');fxe.push(e.label+' hides in the crowd again, laughing.');continue}}
      hitP(e,1,{es:' te apunta y se ríe: «¡Ja! ¿Y eso qué idioma es? ¡Habla bien!»',en:' points at you and laughs: "Ha! What language is that even? Talk properly!"'});continue}
    if(e.t==='ngoysum'){
      if((S.sp||0)>0&&Math.random()<.35){S.sp--;hitP(e,.8,{es:' te sopla su niebla en la boca: se te olvida una palabra (−✦)',en:' breathes its fog into your mouth: a word is forgotten (−✦)'});hitsFx.push(()=>pop(60,30,'−✦','#c0b8ff'));continue}
      hitP(e,1.3,{es:' te cubre con la niebla del gran olvido',en:' wraps you in the fog of the great forgetting'});continue}
    if(e.t==='profe'){
      if(Math.random()<.35){hitP(e,1.7,{es:' te golpea la mano con la regla: «¡En esta sala se habla castellano!»',en:' cracks the ruler across your hand: "In this classroom we speak Spanish!"'});hitsFx.push(()=>B.shake=6);continue}
      if(!S.curse&&Math.random()<.3){S.curse=1;fx.push(e.label+' te manda al rincón con las orejas rojas: quedas con maldición (fuerza −2). El lawen la quita.');fxe.push(e.label+' sends you to the corner with burning ears: you are cursed (strength −2). Lawen lifts it.');hitsFx.push(()=>sfx('bad'));continue}
      hitP(e);continue}
    if(e.t==='kalku'){
      const ac=aliveE().filter(x=>x.t==='anchi').length;
      if(ac<1&&B.en.length<5&&Math.random()<.35){const ne=mkEnemy('anchi');B.en.push(ne);relabel();fx.push('El Fütra Kalku llama a su creación: ¡aparece '+ne.label+'!');fxe.push('The Fütra Kalku calls his creation: '+ne.label+' appears!');continue}
      if(!S.curse&&Math.random()<.3){S.curse=1;fx.push('El Fütra Kalku te apunta con el dedo y susurra: quedas con maldición (fuerza −2). El lawen la quita.');fxe.push('The Fütra Kalku points at you and whispers: you are cursed (strength −2). Lawen lifts it.');hitsFx.push(()=>sfx('bad'));continue}
      if(B.turn>0&&B.turn%3===0){hitP(e,2.0,{es:' descarga un latigazo de sombra',en:' lashes you with a whip of shadow'});continue}
      hitP(e);continue}
    if(T.boss){
      if(B.turn>0&&B.turn%3===0)hitP(e,1.6,{es:' te embiste con todas sus fuerzas',en:' charges you with all its strength'});
      else hitP(e);continue}
    if(e.t==='anchi'&&Math.random()<.3){const hurt=aliveE().filter(x=>x!==e&&x.hp<x.max);if(hurt.length){const h=hurt[0];h.hp=Math.min(h.max,h.hp+5);fx.push(e.label+' brilla y cura a '+h.label+' (+5).');fxe.push(e.label+' glows and heals '+h.label+' (+5).');hitsFx.push(()=>{const p=epos(h);pop(p.x,p.y-10,'+5','#80ff90');sfx('heal')});continue}}
    if(T.twice){hitP(e,.7);hitP(e,.7,{es:' vuelve a morder',en:' bites again'});continue}
    if((e.t==='chonchon'||T.curse)&&!S.curse&&Math.random()<.25&&!(B.blocked&&B.blocked.has(e))){S.curse=1;fx.push(e.label+' grita "¡tue, tue!": quedas con maldición (fuerza −2). El lawen la quita.');fxe.push(e.label+' cries "tue, tue!": you are cursed (strength −2). Lawen lifts it.');hitsFx.push(()=>sfx('bad'));continue}
    hitP(e)}
  for(const e of aliveE()){if(e.gr>0)e.gr--;if(e.fear>0)e.fear--}
  if(S.chill>0)S.chill--;
  if(S.gear.lafkenkura&&S.hp>0&&S.hp<maxHP()){S.hp=Math.min(maxHP(),S.hp+2)}
  B.blocked=null;B.rush=null;B.turn++;if(typeof kyEnemyPost==='function')kyEnemyPost();
  const lines=[];
  if(fx.length){const l=N(fx.join(' '),fxe.join(' '));l.fx=()=>{hitsFx.forEach(f=>f());if(dmgTotal){B.pendHurt=aliveE().some(e=>e.lunge0===22&&e.lunge>0)?10:1}};lines.push(l)}
  const bossE=aliveE().find(x=>ET[x.t].boss),bn=bossE?ET[bossE.t].name:'';
  if(B.tele&&bossE)lines.push(L(bn,'Küpaley '+bn+'!','¡'+bn+' viene!',bn+' is coming!'));
  if(bossE&&bossE.hidden&&!B.hideHint&&B.turn>=1&&S.roots.includes('tripa')){B.hideHint=1;lines.push(N('Pista: escondido en la niebla, nada lo alcanza. Quizás si le dices que salga...','Hint: hidden in the fog, nothing reaches it. Maybe if you tell it to come out...'))}
  if(aliveE().some(x=>x.armor)&&!B.armorHint&&B.turn>=1){B.armorHint=1;lines.push(N('Pista: los golpes rebotan en la coraza de piedra. Quizás si le dices que se quiebre...','Hint: blows bounce off the stone crust. Maybe if you tell it to break...'))}
  if(bossE&&bossE.t==='cherrufe'&&bossE.burn&&!B.fireHint&&B.turn>=2&&S.roots.includes('wütre')){B.fireHint=1;lines.push(N('Pista: su fuego te quema cada vez que lo atacas. El frío podría apagarlo.','Hint: its fire burns you every time you attack it. The cold could put it out.'))}
  if(bossE&&bossE.t==='witranalwe'&&bossE.tall&&!B.tallHint&&B.turn>=1){B.tallHint=1;lines.push(N('Pista: erguido así, nada lo alcanza. Quizás si le dices que vuelva atrás...','Hint: standing tall like that, nothing reaches it. Maybe if you tell it to go back...'))}
  if(bossE&&bossE.seals&&bossE.seals.length&&B.turn%3===1){lines.push(N('Los sellos de luz giran alrededor de '+bossE.label+'. '+sealGloss(bossE.seals[0],'es'),'The seals of light spin around '+bossE.label+'. '+sealGloss(bossE.seals[0],'en')))}
  if(B.tele&&!B.teleHint&&bossE){B.teleHint=1;lines.push(N('Pista: dile que no venga (küpa- con -kil-), a él solo o a todos, con la terminación correcta.','Hint: tell it not to come (küpa- with -kil-), to it alone or to all of them, with the right ending.'))}
  say(lines,()=>{
    if(S.hp<=0&&B.o.tut)S.hp=1;
    if(S.hp<=0){S.hp=0;return defeat()}
    battleMenu()});
}
const LLSING=[['Kallfüko','de pelo como agua quieta','with hair like still water'],['Milla ül','que canta con dos voces','who sings with two voices'],['Lafkenray','coronada de espuma','crowned with foam'],['Kürüko','el más viejo de todos','the oldest of them all']];
function llufuStage(nx){
  const e=mkEnemy(nx);B.en=[e];relabel();B.tele=false;B.blocked=null;B.rush=null;sfx('lvl');B.flash=16;B.shake=10;
  S.hp=maxHP();S.sp=SPMAX;e.hp-=12;
  const k={llufu2:0,llufu3:1,llufu4:2,llufu5:3}[nx],[snm,sd,sde]=LLSING[k];
  const forms={llufu2:[N('¡Las aguas se abren! El Millalobo se alza hasta la cintura: lleva una coraza de huesos de ballena atada con cochayuyo.','The waters part! The Millalobo rises to the waist, wearing a breastplate of whale bones lashed with kelp.')],
    llufu3:[N('¡Al Millalobo le brotan alas! Salta del agua en un gran arco, con las alas abiertas y las aletas tendidas: el agua entera se vuelve un remolino.','The Millalobo sprouts wings! He leaps from the water in a great arc, wings spread and flippers out: the whole water becomes a whirlpool.')],
    llufu4:[N('Su pecho se abre y aparece su piwke: un corazón de oro que late luz robada, protegido por barreras.','His chest opens and his piwke appears: a heart of gold beating with stolen light, guarded by barriers.')],
    llufu5:[N('El Millalobo entero se alza sobre una ola, más grande que la ruka más grande: Rüf Millalobo, el rey del mar.','The whole Millalobo rises on a swell, bigger than the biggest ruka: Rüf Millalobo, the king of the sea.')]}[nx];
  forms.push(N('El chumpall '+snm+', '+sd+', canta a tu lado: tu piwke y tu newen se llenan de nuevo, y su ül alcanza al Millalobo (−12).','The chumpall '+snm+', '+sde+', sings at your side: your hearts and your newen fill again, and their ül reaches the Millalobo (−12).'));
  say(forms,battleMenu);
}
function postLlufu(){
  S.flags.chboss=1;S.gear.lafkenkura=1;persist();sfx('lvl');
  say([N('El Rüf Millalobo deja de luchar: el ül de los chumpall lo envuelve y le enfría la furia. En paz, inclina la corona ante ti y se hunde despacio hacia su palacio, tan hondo que ni los chumpall lo conocen. El agua queda limpia y quieta.','The Rüf Millalobo stops fighting: the chumpall\'s ül wraps around him and cools his fury. At peace, he bows his crown to you and sinks slowly toward his palace, so deep not even the chumpall know it. The water is left clean and still.'),
    L('Ñidol chumpall','Chaltu may, '+nm()+'. Taiñ lafken montulürkey.','Gracias, '+nm()+'. Nuestro mar se salvó.','Thank you, '+nm()+'. Our sea has been saved.'),
    N('Los cinco cantores chumpall te rodean y cantan juntos una sola vez. El agua entera brilla.','The five chumpall singers surround you and sing together, just once. The whole water glows.'),
    Object.assign(L('','Lafkenkura!','La ñidol chumpall te regala una lafkenkura, una piedra del mar: desde ahora recuperas 2 de newen en cada turno de pelea.','The chumpall leader gives you a lafkenkura, a sea stone: from now on you recover 2 newen every battle turn.'),{fx:()=>sfx('lvl')})],
    ()=>gainPiwke([N('Y entre las algas, algo rojo brilla...','And among the kelp, something red glints...')]));
}
function ngoyStage(n){
  const e=mkEnemy('ngoyman'+n);B.en=[e];relabel();B.tele=false;B.blocked=null;B.rush=null;sfx('lvl');B.flash=16;B.shake=10;
  const ls=n===2?[N('El velo de niebla se rasga de arriba abajo... y detrás se levanta un coloso de piedra, bloque sobre bloque, sostenido solo por la luz del olvido que brilla entre las junturas. Dos ojos como lunas apagadas te buscan.','The veil of fog tears from top to bottom... and behind it rises a colossus of stone, block on block, held together only by the light of the forgetting shining between the joints. Two eyes like burnt-out moons search for you.'),
      N('Fütra Ngoymatulfe: el gran olvido tiene cuerpo.','Fütra Ngoymatulfe: the great forgetting has a body.')]
    :n===3?[L('','Kalewetuy!','¡Cambió de forma!','It has changed form!'),N('¡El coloso se desmorona, bloque por bloque! Entre las piedras caídas queda lo único que lo sostenía: un piwke enorme de piedra, envuelto en raíces y en una coraza de olvido, latiendo despacio.','The colossus crumbles, block by block! Among the fallen stones is left the only thing that held it up: a huge heart of stone, wrapped in roots and in a crust of forgetting, beating slowly.'),
      N('Es el corazón del gran olvido. Cada latido borra una palabra en alguna parte.','It is the heart of the great forgetting. Every beat erases a word somewhere.')]
    :n===4?[L('','Kalewetuy!','¡Cambió de forma!','It has changed form!'),N('¡El piwke de piedra se parte en dos... y no deja de latir! Lo que sale de la grieta es noche pura: la niebla entera se dobla hacia adentro y se levanta una figura más vasta todavía, con seis ojos apagados y cuernos de humo.','The stone heart splits in two... and does not stop beating! What pours from the crack is pure night: the whole fog folds inward and a vaster figure yet rises, with six burnt-out eyes and horns of smoke.'),
      N('Füta Dumiñ: la gran oscuridad del olvido. Hasta el suelo parece olvidar que existe.','Füta Dumiñ: the great darkness of the forgetting. Even the ground seems to forget it exists.')]
    :[L('','Wefürkey rüf Fütra Ngoymatulfe, awem!','¡Apareció el verdadero Fütra Ngoymatulfe! ¡Rayos!','The true Fütra Ngoymatulfe has appeared. Awem!'),N('La noche se parte como un telón podrido. Detrás estaba esperando lo que el olvido es de verdad: una corona de niebla como astas, una boca como cueva sin fondo, un ojo enorme que ya no recuerda la luz.','The night splits like a rotten curtain. Behind it waited what the forgetting truly is: a crown of fog like antlers, a mouth like a bottomless cave, one enormous eye that no longer remembers the light.'),
      N('Rüf Fütra Ngoymatulfe: el verdadero gran olvido. Ya no quedan velos.','Rüf Fütra Ngoymatulfe: the true great forgetting. There are no veils left.')];
  if(n===5&&S.flags.epu_won){S.hp=maxHP();S.sp=SPMAX;e.hp-=15;
    ls.push(N('Entonces una lanza cruza la niebla y se clava en el coloso (−15). El Epunamun aparece a tu lado, con las dos caras de frente al olvido.','Then a spear crosses the fog and sinks into the colossus (−15). The Epunamun appears at your side, both faces turned to the forgetting.'),
      L('Epunamun','Feypieyu tañi kelluntukafiel eymi tami weichan mu!','¡Te dije que te ayudaría en tu pelea!','I told you I would help you in your fight!'),
      N('Su newen te llena de nuevo: piwke y palabras al máximo.','His newen fills you again: hearts and words restored.'))}
  say(ls,battleMenu);
}
function bossSweep(){
  if((B.o.final||B.o.chain==='llufu'||B.o.sflag==='yewen_won')&&aliveE().length&&!aliveE().some(x=>ET[x.t].boss)){
    for(const x of aliveE()){x.hp=0;x.pend=0;x.dead=true;x.fadeT=20}}}

/* La voz del ngen: pregunta final (no imperativa) antes de que caiga un jefe.
   Bien respondida, el jefe cae; mal respondida, recupera fuerzas. */
const NGENQ=[
  {m:'Amun.',es:'¿Quién fue?',en:'Who went?',o:['iñche','eymi','fey'],a:0},
  {m:'Amuymi.',es:'¿Quién fue?',en:'Who went?',o:['iñche','eymi','fey'],a:1},
  {m:'Umawtuy.',es:'¿Quién durmió?',en:'Who slept?',o:['iñche','eymi','fey'],a:2},
  {m:'Amuan.',es:'¿Qué dice?',en:'What does it say?',o:[['voy a ir','I will go'],['fui','I went'],['suelo ir','I usually go']],a:0},
  {m:'Amuken.',es:'¿Qué dice?',en:'What does it say?',o:[['suelo ir','I usually go'],['voy a ir','I will go'],['no voy','I do not go']],a:0},
  {m:'Umawtukefun.',es:'¿Qué dice?',en:'What does it say?',o:[['antes solía dormir','I used to sleep'],['voy a dormir','I will sleep'],['estoy durmiendo','I am sleeping']],a:0},
  {m:'Amurkey.',es:'¿Qué dice el -rke-?',en:'What does -rke- say?',o:[['dicen que fue','they say it went'],['fue dos veces','it went twice'],['quiere ir','it wants to go']],a:0},
  {m:'Amulan.',es:'¿Qué dice?',en:'What does it say?',o:[['no voy / no fui','I do not go / did not go'],['voy a ir','I will go'],['ve tú','you go']],a:0},
  {m:'Küpalay.',es:'¿Qué dice?',en:'What does it say?',o:[['no viene / no vino','it does not come / did not come'],['ya viene','it is coming'],['ven tú','you come']],a:0},
  {m:'ñi ruka',es:'¿Qué significa?',en:'What does it mean?',o:[['mi casa','my house'],['tu casa','your house'],['nuestra casa','our house']],a:0},
  {m:'mi chaw',es:'¿Qué significa?',en:'What does it mean?',o:[['tu padre','your father'],['mi padre','my father'],['su padre','their father']],a:0},
  {m:'taiñ mapu',es:'¿Qué significa?',en:'What does it mean?',o:[['nuestra tierra','our land'],['mi tierra','my land'],['tu tierra','your land']],a:0},
  {m:'pu che',es:'¿Qué significa?',en:'What does it mean?',o:[['las personas','the people'],['una persona','one person'],['la tierra','the land']],a:0},
  {m:'Chem am ta "challwa"?',es:'',en:'',o:[['el pez','fish'],['el fuego','fire'],['la lluvia','rain']],a:0},
  {m:'Chem am ta "kütral"?',es:'',en:'',o:[['el fuego','fire'],['la piedra','stone'],['el viento','wind']],a:0},
  {m:'Chem am ta "mawün"?',es:'',en:'',o:[['la lluvia','rain'],['la nieve','snow'],['el mar','the sea']],a:0},
  {m:'Chem am ta "kürüf"?',es:'',en:'',o:[['el viento','wind'],['el sol','the sun'],['el canto','the song']],a:0},
  {m:'Chem am ta "wangülen"?',es:'',en:'',o:[['la estrella','star'],['la luna','moon'],['la noche','night']],a:0},
  {m:'Chem am ta "piwke"?',es:'',en:'',o:[['el corazón','the heart'],['la cabeza','the head'],['la mano','the hand']],a:0},
  {m:'Chem am ta "newen"?',es:'',en:'',o:[['la fuerza','strength'],['el miedo','fear'],['el sueño','sleep']],a:0},
  {m:'Chem am ta "kimün"?',es:'',en:'',o:[['el conocimiento','knowledge'],['el olvido','forgetting'],['la comida','food']],a:0},
  {m:'epu mari kiñe',es:'¿Qué número es?',en:'Which number is it?',o:['21','12','31'],a:0},
  {m:'küla mari',es:'¿Qué número es?',en:'Which number is it?',o:['30','13','33'],a:0},
  {m:'kiñe pataka',es:'¿Qué número es?',en:'Which number is it?',o:['100','10','1000'],a:0}];
function ngenQuiz(qb){
  const en=S.gloss==='en';
  const Q=NGENQ[rnd(NGENQ.length)];
  const who=B.o.chain==='llufu'?['las voces de los chumpall',"the chumpall's voices"]:B.o.final?['las cinco voces de los ngen','the five voices of the ngen']:['la voz del ngen de esta tierra',"the voice of this land's ngen"];
  say([N(qb.label+' se tambalea, a punto de caer... y el tiempo se detiene. En tu cabeza suena, honda como la tierra, '+who[0]+'.',qb.label+' staggers, about to fall... and time stops. Deep as the earth, '+who[1]+' sounds inside your head.'),
    L('','Kiñe ramtun.','«Una pregunta. Si respondes bien, tu palabra será el golpe final.»','"One question. Answer well, and your word will be the final blow."')],()=>{
    const opts=Q.o.map((o,i)=>({m:Array.isArray(o)?(en?o[1]:o[0]):o,v:i}));
    for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose({m:'«'+Q.m+'»',es:Q.es,en:Q.en},opts,v=>{
      {const op=Q.o.map(o=>Array.isArray(o)?(en?o[1]:o[0]):o);track('pregunta del ngen',v===Q.a,{m:'«'+Q.m+'»',es:Q.es,en:Q.en},op,op[Q.a])}
      if(v===Q.a){sfx('lvl');B.flash=16;B.shake=10;qb.hp=0;B.qok=1;
        say([N('Respondes, y la palabra sale de ti como un golpe de luz. '+qb.label+' cae.','You answer, and the word leaves you like a blow of light. '+qb.label+' falls.')],victory);}
      else{sfx('bad');qb.stag=0;const rg=Math.max(4,Math.round(ET[qb.t].hp*(.15+Math.random()*.25)));qb.hp=Math.min(ET[qb.t].hp,qb.hp+rg);
        say([N('La palabra se te escapa... El tiempo vuelve a correr y '+qb.label+' se endereza, recuperando fuerzas (+'+rg+'). La respuesta era: '+(Array.isArray(Q.o[Q.a])?(en?Q.o[Q.a][1]:Q.o[Q.a][0]):Q.o[Q.a])+'.','The word slips away... Time runs again and '+qb.label+' straightens, recovering strength (+'+rg+'). The answer was: '+(Array.isArray(Q.o[Q.a])?(en?Q.o[Q.a][1]:Q.o[Q.a][0]):Q.o[Q.a])+'.')].concat(B.o.sflag==='yewen_won'&&!B.ngoyCall?[N('El Yewen se ríe bajito dentro de la capucha. Tu silencio le dio fuerzas: ahora puede llamar también al Fütra Ngoymatulfe.','The Yewen laughs quietly inside its hood. Your silence gave it strength: now it can also call up the Fütra Ngoymatulfe.')]:[]),()=>{if(B.o.sflag==='yewen_won'&&!B.ngoyCall)B.ngoyCall=1;battleMenu()});}
    },false,true);
  });
}
function victory(){
  S.beaten=S.beaten||{};S.beatW=S.beatW||{};B.en.forEach(e=>{S.beaten[e.t]=(S.beaten[e.t]||0)+1;if(typeof M!=='undefined'&&M&&M.name&&!S.beatW[e.t])S.beatW[e.t]=M.name});
  if(B.o.final){const st=B.en[0].t;
    if(st==='ngoyman1')return ngoyStage(2);
    if(st==='ngoyman2')return ngoyStage(3);
    if(st==='ngoyman3')return ngoyStage(4);
    if(st==='ngoyman4')return ngoyStage(5);}
  if(B.o.chain==='llufu'){const st=B.en.find(e=>ET[e.t].boss);
    const nx={llufu1:'llufu2',llufu2:'llufu3',llufu3:'llufu4',llufu4:'llufu5'}[st&&st.t];
    if(nx)return llufuStage(nx);}
  {const qb=B.en.find(e=>ET[e.t].boss);
   if(qb&&!B.qok){qb.dead=false;qb.fadeT=0;qb.hit=0;qb.hp=1;qb.stag=1;return qb.t==='llawfen'?llawLast(qb):ngenQuiz(qb)}}
  {const yb=B.en.find(e=>ET[e.t].boss);   // not wekufü: Epunamun and the Millalobo yield in their painted frames instead of breaking
   if(yb&&!B.defA&&(yb.t==='epunamun'||(yb.t==='llufu5'&&B.o.chain==='llufu'))&&typeof dseqOK==='function'&&dseqOK(yb.t)){yb.stag=1;dseqStart(yb,null,{yld:1,keep:yb.t==='epunamun'});return}}
  {const vb=B.en.find(e=>ET[e.t].boss);
   if(vb&&!B.defA&&typeof DEFEAT!=='undefined'&&DEFEAT[vb.t]){defStart(vb);return}   // the Santiago wardens and the Yewen come apart on screen
   if(vb&&!B.ngenA&&!B.defA&&B.o.chain!=='llufu'&&vb.t!=='epunamun'){
     if(vb.t==='ngoyman5'){vb.stag=1;B.ngenA={t:0,e:vb,kind:'final'};document.getElementById('dlg').style.display='none';active=null;sfx('cast');return}
     if(!/^ngoyman/.test(vb.t)){
       const v=(B.o.arena&&'av' in B.o)?B.o.av:{lafkenche:'lafken',nagche:'mawida',pewenche:'pewen',williche:'kuruf',puelmapu:'lelfun',ngoyman:'lelfun'}[M.region];
       if(v&&typeof dseqOK==='function'&&dseqOK(vb.t)){vb.stag=1;dseqStart(vb,v);return}   // the ngen wakes (heard, not seen) and the wekufü breaks apart in its painted frames
       if(v){vb.stag=1;B.ngenA={t:0,e:vb,v};document.getElementById('dlg').style.display='none';active=null;sfx('cast');return}}}
   if(vb&&vb.hp<=0&&!vb.dead){vb.dead=true;vb.fadeT=20}}
  if(B.ngenA&&!B.ngenA.done)return;
  if(B.defA&&!B.defA.done)return;
  const xp=B.en.reduce((a,e)=>a+ET[e.t].xp,0);let gold=B.en.reduce((a,e)=>{const g=ET[e.t].gold;return a+g[0]+rnd(g[1]-g[0]+1)},0);
  if(S.pw.gold){gold*=2;S.pw.gold=0}
  S.xp+=xp;S.gold+=gold;
  const wn=(B.o.boss||B.o.final||B.o.chain)?'win':'winS';const after=SONGS[wn];after.after=()=>mapSong();playSong(wn);
  const NGN={lafken:'Ngen-lafken',mawida:'Ngen-mawida',pewen:'Ngen-pewen',kuruf:'Ngen-kürüf',lelfun:'Ngen-lelfün'};
  const ls=[(B.ngenA&&B.ngenA.kind==='final')?N('¡Los cinco ngen del mapu responden a la vez! Mar, monte, pewen, viento y pampa descargan su newen, uno tras otro... y Ti Fütra Ngoymatulfe se quiebra en mil pedazos que la luz deshace.','The five ngen of the land answer as one! Sea, forest, pewen, wind and plain unleash their newen, one after another... and Ti Fütra Ngoymatulfe shatters into a thousand pieces that the light unmakes.'):B.o.chain==='llufu'?N('El ül se cierra como una marea mansa: el Millalobo se aquieta y su furia se apaga en el fondo del mar.','The ül closes like a gentle tide: the Millalobo grows calm and his fury dies away at the bottom of the sea.'):(B.defA&&B.defA.D&&B.defA.D.v)?N('Bajo el newen de '+NGN[B.defA.D.v]+', el wekufü se quiebra y se deshace, y la luz se lleva lo que queda. La tierra respira de nuevo.','Under the newen of '+NGN[B.defA.D.v]+', the wekufü cracks and comes apart, and the light carries away what is left. The land breathes again.'):(B.ngenA&&B.ngenA.v)?N('¡'+NGN[B.ngenA.v]+' despierta y descarga su newen sobre el wekufü: el maligno estalla en mil pedazos que la luz deshace! La tierra respira de nuevo.',NGN[B.ngenA.v]+' awakens and unleashes its newen upon the wekufü: the evil one shatters into a thousand pieces that the light unmakes! The land breathes again.'):(B.en.some(e=>e.t==='epunamun'))?N('El Epunamun baja sus dos lanzas y asiente con las dos caras: la prueba terminó, y la pasaste.','The Epunamun lowers his two spears and nods with both faces: the trial is over, and you have passed it.'):(B.en.some(e=>e.t==='llawfen'))?N('Tu sombra deja de pelear. No huye ni se deshace: se queda quieta, mirándote con tus propios ojos.','Your shadow stops fighting. It does not flee or break apart: it stands still, looking at you with your own eyes.'):N('¡Los wekufü se van!','The wekufü are gone!'),L('','+'+numW(gold)+' ngülliw','Ganas '+numP(gold)+' ngülliw y '+numP(xp)+' de kimün.','You gain '+numP(gold)+' ngülliw and '+numP(xp)+' kimün.')];
  if(B.ngenA&&B.ngenA.kind==='final'&&S.flags.epu_won)ls.push(N('Y al final, entre los ngen, el Epunamun: sus dos caras arden en rojo y sus lanzas disparan el último fuego contra el olvido.','And last, among the ngen, the Epunamun: both his faces burn red and his spears fire the last blaze against the forgetting.'));
  while(S.xp>=xpNeed()){S.xp-=xpNeed();S.lvl++;S.baseMax+=HPQ;S.hp+=HPQ;S.baseAtk+=1;if(S.lvl%2===0||S.hm)S.baseDef+=1;
    const l=L('','Doy kimün! Akuymi kimün nivel '+S.lvl+'. Llowfimi ka piwke ka doy newentuymi.','¡Más conocimiento! Llegas a kimün '+S.lvl+': ganas un corazón y más fuerza.','More knowledge! You reach kimün '+S.lvl+': you gain a heart and more strength.');l.fx=()=>sfx('lvl');ls.push(l)}
  say(ls,()=>endBattle('win'));
}
function defeat(){
  if(B&&B.o&&B.o.arena)return arenaLose();
  const lost=Math.floor(S.gold/4);S.gold-=lost;playSong('intro');
  const gm=MAPS[CUR].region==='nagche'?'chuchu':MAPS[CUR].region==='pewenche'?'laku':MAPS[CUR].region==='williche'?'cheche':'kuku';
  say([N('Te quedas sin fuerzas... Tu '+gm+' te encuentra y te lleva junto al kütral.'+(lost?' Pierdes '+numP(lost)+' ngülliw.':''),'You collapse... Your '+gm+' finds you and carries you back to the fire.'+(lost?' You lose '+numP(lost)+' ngülliw.':''))],()=>{
    S.curse=0;S.hp=maxHP();mode='map';B=null;const sv=S.save;AU.name=null;loadMap(sv.map,sv.x,sv.y)});
}
function endBattle(how){
  const o=B.o;mode='map';grace=how==='flee'?90:30;
  if(how==='win'&&o.ent){ents=ents.filter(e=>e!==o.ent);if(o.ent.flag)S.flags[o.ent.flag]=1}
  B=null;persist();
  if(o.arena){if(how!=='win'||!AU.song||(AU.name!=='win'&&AU.name!=='winS'))playSong(mapSong());
    if(typeof playAmb==='function'){playAmb(typeof wxAmbKey==='function'?wxAmbKey():ambFor(M.bg));ambVol(.5)}
    return arenaEnd(how)}
  const entPost=how==='win'&&o.ent&&o.ent.post;
  if(how!=='win'||!AU.song||(AU.name!=='win'&&AU.name!=='winS'))playSong(mapSong());
  if(typeof playAmb==='function'){playAmb(typeof wxAmbKey==='function'?wxAmbKey():ambFor(M.bg));ambVol(.5)}
  if(entPost)return o.ent.post();
  if(how==='win'&&o.sflag==='epu_won'){S.flags.epu_won=1;S.gear.waiki=1;persist();sfx('lvl');
    return say([N('El Epunamun baja las dos lanzas a la vez. No se deshace, no huye: te saluda, con las dos caras sonriendo.','The Epunamun lowers both spears at once. He does not break apart, he does not flee: he salutes you, both faces smiling.'),
      L('Epunamun','Tutelu llemay! Newentuleymi. Kimün may nieymi tati.','¡Lo lograste! Tienes fuerza. Y conocimiento, sí que tienes.','You did it! You are strong. And knowledge, you truly have.'),
      L('Epunamun','Tüfa tañi waiki. Yenge.','Esta es mi lanza. Llévala.','This is my spear. Carry it.'),
      Object.assign(L('','Epunamun ñi waiki!','El Epunamun te regala una de sus lanzas: tu fuerza sube +2 para siempre. Dice que la otra la guardará para pelear a tu lado, algún día, al otro lado de la niebla.','The Epunamun gives you one of his spears: your strength rises +2 for good. He says he will keep the other, to fight at your side one day, on the far side of the fog.'),{fx:()=>sfx('lvl')})],
      ()=>gainPiwke([N('Donde golpearon sus lanzas, algo rojo brilla en el suelo...','Where his spears struck, something red glints on the ground...')]));}
  if(how==='win'&&o.sflag==='yewen_won'){S.flags.yewen_won=1;S.flags.stgo_done=1;persist();sfx('lvl');
    return say([N('El Yewen no se deshace: se encoge. Las manos bajan de la boca, la capucha cae, y abajo hay una cara cualquiera, de cualquier esquina de Santiago. Te mira, y por primera vez no baja los ojos.','The Yewen does not break apart: it shrinks. The hands come down from the mouth, the hood falls back, and underneath there is an ordinary face, from any corner of Santiago. It looks at you, and for the first time it does not lower its eyes.'),
      L('','Mari mari.','Lo dice bajito, mal pronunciado, y con todo el cuerpo. Después se va caminando por la calle, y en cada esquina alguien se lo devuelve.','It says it quietly, badly pronounced, and with its whole body. Then it walks off down the street, and on every corner someone says it back.'),
      N('Y entonces lo notas: en la plaza, en la feria, en la población, en la ruka urbana... la gente se saluda en mapudungun. Chiquillos contando en el paradero. Una abuela enseñando. Un mural que dice MAPU.','And then you notice it: in the plaza, at the market, in the neighborhood, in the urban ruka... people greet each other in Mapudungun. Kids counting at the bus stop. A grandmother teaching. A mural that says MAPU.'),
      L('','Waria mew ka mongeley taiñ dungun!','¡También en la ciudad vive nuestra lengua!','In the city, too, our language lives!'),
      N('Santiago también es Wallmapu cuando se habla mapudungun. Tu viaje empezó aquí... y aquí vuelve a empezar, cada vez que alguien dice "mari mari". Yewelkilnge: no tengas vergüenza.','Santiago is Wallmapu too when Mapudungun is spoken. Your journey began here... and here it begins again, every time someone says "mari mari". Yewelkilnge: do not be ashamed.')],()=>gainPiwke([N('Donde estaba parado el Yewen, algo rojo brilla en el suelo...','Where the Yewen stood, something red glints on the ground...')]));}
  if(how==='win'&&o.sflag==='llaw_won')return llawWon();
  if(how==='win'&&o.sflag){S.flags[o.sflag]=1;persist();sfx('lvl');
    return say([N('El wekufü secreto se deshace en jirones de sombra que el viento se lleva.','The secret wekufü breaks apart into shreds of shadow that the wind carries away.'),
      L('','Newen!','Venciste a uno de los wekufü escondidos. Pocos pueden contarlo.','You defeated one of the hidden wekufü. Few can say the same.')],()=>gainPiwke([N('Donde estaba, algo rojo brilla en el suelo...','Where it stood, something red glints on the ground...')]));}
  if(how==='win'&&o.tut&&o.after)return o.after();
  if(how==='win'&&o.final)return postFinal();
  if(how==='win'&&o.chain==='llufu')return postLlufu();
  if(how==='win'&&o.boss)postBoss();
}
function stepBackFromNgen(){
  const [sx2,sy2]=placeNear(8,9);P.x=sx2;P.y=sy2;P.fx=sx2;P.fy=sy2;P.ox=sx2;P.oy=sy2;P.moving=false;P.dir='up';
}
function postBoss(){
  if(CUR==='ngen2')return postBoss2();
  if(CUR==='ngen3')return postBoss3();
  if(CUR==='ngen4')return postBoss4();
  if(CUR==='ngen5')return postBoss5();
  say([N('El cuero de Trelke-wekufü se hunde y el agua se aclara. Una figura de espuma y luz se levanta de la laguna.','Trelke-wekufü\'s hide sinks and the water clears. A figure of foam and light rises from the lagoon.')],()=>{
    S.flags.ngen=1;S.flags.dive=1;S.pieces=S.pieces||[];if(!S.pieces.includes('lafkenche'))S.pieces.push('lafkenche');S.flags.awake_lafkenche=1;if(CUR==='ngen')grid[7][8]='A';S.hp=Math.min(maxHP(),S.hp+HPQ);AU.name=null;playSong('ngen');
    stepBackFromNgen();const e=Object.assign({},MAPS.ngen.ents[1]);e.fx=e.x;e.fy=e.y;ents.push(e);persist();sfx('lvl');
    say([L('Ngen-lafken','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),
      N('Hacía mucho tiempo que nadie me hablaba en mapudungun.','It had been a long time since anyone spoke to me in Mapudungun.'),
      L('Ngen-lafken','Chaltu may.','Gracias.','Thank you.'),
      N('Ngen-lafken te da su newen: ahora puedes sumergirte en los remolinos oscuros del agua. Además ganas un corazón nuevo.','Ngen-lafken gives you its newen: now you can dive into the dark whirlpools in the water. You also gain a new heart.'),
      L('Ngen-lafken','Mapudungukeaiñ!','¡Hablemos mapudungun!',"Let's speak Mapudungun!"),
      Object.assign(L('','Kiñe trariwe trokiñ!','Entre la espuma queda algo tejido: un trokiñ (pedazo) de un trariwe antiguo, con figuras del mar. Tienes 1 de 5.','Something woven is left in the foam: a trokiñ (piece) of an ancient trariwe, with figures of the sea. You have 1 of 5.'),{fx:()=>{sfx('lvl')}}),
      N('Dicen que un trariwe completo, con un trokiñ de cada tierra, es lo único que puede atravesar la niebla del olvido y llegar hasta su origen: Ti Fütra Ngoymatulfe, el gran olvido.','They say a complete trariwe, with one trokiñ from each land, is the only thing that can pass through the fog of forgetting and reach its source: Ti Fütra Ngoymatulfe, the great forgetting.'),
      N('Un círculo de luz aparece en el islote: pisándolo puedes volver a la entrada de la cueva o al lof.','A circle of light appears on the islet: step on it to return to the cave entrance or to the lof.'),
      N('Fin de la región lafkenche (prototipo). Puedes volver a los remolinos de las dunas y de la orilla: ahora sí puedes explorarlos. Las demás regiones esperan: Nagche, Pewenche, Williche y Puelmapu.','End of the Lafkenche region (prototype). You can go back to the whirlpools in the dunes and on the shore: now you can explore them. The other regions are waiting: Nagche, Pewenche, Williche and Puelmapu.')]);
  });
}


function postBoss2(){
  say([N('El Witranalwe se deshace en una luz fría que se apaga entre los árboles. El claro se llena de olor a tierra mojada, y del tronco más viejo sale una figura verde y dorada.','The Witranalwe breaks apart into a cold light that fades among the trees. The clearing fills with the smell of wet earth, and a green and golden figure steps out of the oldest trunk.')],()=>{
    S.flags.ngen2=1;S.flags.bramble=1;S.pieces=S.pieces||[];if(!S.pieces.includes('nagche'))S.pieces.push('nagche');
    grid[7][8]='A';for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(grid[y][x]==='Ñ')grid[y][x]=M.floor;
    S.hp=Math.min(maxHP(),S.hp+HPQ);AU.name=null;playSong(rsong('ngen'));
    stepBackFromNgen();const e=Object.assign({},MAPS.ngen2.ents[1]);e.fx=e.x;e.fy=e.y;ents.push(e);persist();sfx('lvl');
    say([L('Ngen-mawida','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),
      L('Ngen-mawida','Alün umawtun. Tami dungun mew nepen.','Dormí mucho tiempo. Con tus palabras desperté.','I slept a long time. With your words I woke up.'),
      N('Ngen-mawida es el ngen del monte: cuida los árboles, el lawen y los animales que viven entre ellos.','Ngen-mawida is the ngen of the forest: it looks after the trees, the medicine plants, and the animals that live among them.'),
      N('Ngen-mawida te da su newen: ahora los zarzales espinudos se apartan cuando pasas. Además ganas un corazón nuevo.','Ngen-mawida gives you its newen: now the thorny brambles move aside when you pass. You also gain a new heart.'),
      Object.assign(L('','Epu trariwe trokiñ!','Entre las raíces queda otro trokiñ del trariwe antiguo, tejido en verde y amarillo. Tienes 2 de 5.','Among the roots lies another trokiñ of the ancient trariwe, woven in green and yellow. You have 2 of 5.'),{fx:()=>sfx('pick')}),
      N('Un círculo de luz aparece en el claro: pisándolo puedes volver a la entrada de la guarida, al lof nagche o a las tierras lafkenche.','A circle of light appears in the clearing: step on it to return to the lair entrance, the Nagche lof, or the Lafkenche lands.'),
      N('Fin de la región nagche (prototipo). Vuelve a los zarzales que viste en el camino: ahora puedes pasar. Faltan Pewenche, Williche y Puelmapu.','End of the Nagche region (prototype). Go back to the brambles you saw on the road: now you can get through. Pewenche, Williche and Puelmapu remain.')]);
  });
}

function postBoss3(){
  say([N('La coraza del Cherufe se parte en mil pedazos y su fuego se hunde en la lava, que se enfría y se vuelve piedra. Desde una grieta brota una semilla, y en un instante crece un pewen joven y dorado.','The Cherufe\'s crust splits into a thousand pieces and its fire sinks into the lava, which cools and turns to stone. A seed sprouts from a crack, and in an instant a young golden pewen grows.')],()=>{
    S.flags.ngen3=1;S.flags.snow=1;S.pieces=S.pieces||[];if(!S.pieces.includes('pewenche'))S.pieces.push('pewenche');
    grid[7][8]='A';for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(grid[y][x]==='^')grid[y][x]=M.floor;
    S.hp=Math.min(maxHP(),S.hp+HPQ);AU.name=null;playSong(rsong('ngen'));
    stepBackFromNgen();const e=Object.assign({},MAPS.ngen3.ents[1]);e.fx=e.x;e.fy=e.y;ents.push(e);persist();sfx('lvl');
    say([L('Ngen-pewen','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),
      L('Ngen-pewen','Tami dungun mew nepen.','Con tus palabras desperté.','With your words I woke up.'),
      N('Ngen-pewen es el ngen de los pewenes: cuida los árboles, sus ngülliw y a la gente que vive de ellos.','Ngen-pewen is the ngen of the pewen trees: it looks after the trees, their nuts, and the people who live from them.'),
      N('Ngen-pewen te da su newen: ahora la nieve dura se abre cuando pasas. Además ganas un corazón nuevo.','Ngen-pewen gives you its newen: now the hard snow opens when you pass. You also gain a new heart.'),
      Object.assign(L('','Küla trariwe trokiñ!','Entre la piedra todavía tibia queda otro trariwe trokiñ, tejido en café y blanco. Tienes 3 de 5.','In the still-warm stone lies another trariwe trokiñ, woven in brown and white. You have 3 of 5.'),{fx:()=>sfx('pick')}),
      N('Un círculo de luz aparece en el cráter: pisándolo puedes volver a la entrada de la morada, al lof pewenche o a las otras tierras.','A circle of light appears in the crater: step on it to return to the lair entrance, the Pewenche lof, or the other lands.'),
      N('Fin de la región pewenche (prototipo). Vuelve a los montones de nieve que viste en el camino: ahora puedes pasar. Faltan Williche y Puelmapu.','End of the Pewenche region (prototype). Go back to the snow heaps you saw on the road: now you can get through. Williche and Puelmapu remain.')]);
  });
}

function postBoss4(){
  say([N('Las velas del Kaleuche se rasgan y sus luces se apagan una a una. El barco se hunde en la niebla... y entonces sopla un viento fresco que la deshace por completo. Sobre el agua aparece una figura de aire, blanca y celeste.','The Kaleuche\'s sails tear and its lights go out one by one. The ship sinks into the fog... and then a fresh wind blows and scatters it completely. Above the water appears a figure made of air, white and sky blue.')],()=>{
    S.flags.ngen4=1;S.flags.wind=1;S.pieces=S.pieces||[];if(!S.pieces.includes('williche'))S.pieces.push('williche');
    grid[7][8]='A';for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(grid[y][x]==='X')grid[y][x]=M.floor;
    S.hp=Math.min(maxHP(),S.hp+HPQ);AU.name=null;playSong(rsong('ngen'));
    stepBackFromNgen();const e=Object.assign({},MAPS.ngen4.ents[1]);e.fx=e.x;e.fy=e.y;ents.push(e);persist();sfx('lvl');
    say([L('Ngen-kürüf','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),
      L('Ngen-kürüf','Tami dungun mew nepen.','Con tus palabras desperté.','With your words I woke up.'),
      N('Ngen-kürüf es el ngen del viento: lleva la lluvia, mueve el mar y despeja la niebla.','Ngen-kürüf is the ngen of the wind: it carries the rain, moves the sea and clears away the fog.'),
      N('Ngen-kürüf te da su newen: ahora los remolinos de viento ya no te empujan. Los que viste en la costa lafkenche y en el sur se abren. Además ganas un corazón nuevo.','Ngen-kürüf gives you its newen: now the whirls of wind no longer push you back. The ones you saw on the Lafkenche coast and in the south open up. You also gain a new heart.'),
      Object.assign(L('','Meli trariwe trokiñ!','Entre la espuma queda otro trariwe trokiñ, tejido en morado y blanco. Tienes 4 de 5.','In the foam lies another trariwe trokiñ, woven in purple and white. You have 4 of 5.'),{fx:()=>sfx('pick')}),
      N('Un círculo de luz aparece en el muelle: pisándolo puedes volver a los acantilados, al lof williche o a las otras tierras.','A circle of light appears on the pier: step on it to return to the cliffs, the Williche lof, or the other lands.'),
      N('Fin de la región williche (prototipo). Solo falta Puelmapu, al otro lado de la cordillera.','End of the Williche region (prototype). Only Puelmapu remains, on the other side of the mountains.')]);
  });
}

function postBoss5(){
  say([N('El Walichu se deshace en polvo gris que el viento se lleva lejos, hacia el oeste. El pasto vuelve a ponerse dorado, y de la tierra misma se levanta una figura alta de pasto, semilla y luz.','The Walichu crumbles into grey dust that the wind carries far away, to the west. The grass turns golden again, and out of the earth itself rises a tall figure of grass, seed and light.')],()=>{
    S.flags.ngen5=1;S.flags.lelfun=1;S.pieces=S.pieces||[];if(!S.pieces.includes('puelche'))S.pieces.push('puelche');
    grid[7][8]='A';for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(grid[y][x]==='D')grid[y][x]=M.floor;
    S.hp=Math.min(maxHP(),S.hp+HPQ);AU.name=null;playSong(rsong('ngen'));
    stepBackFromNgen();const e=Object.assign({},MAPS.ngen5.ents[1]);e.fx=e.x;e.fy=e.y;ents.push(e);persist();sfx('lvl');
    say([L('Ngen-lelfün','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),
      L('Ngen-lelfün','Tami dungun mew nepen. Afpun mapu mew akuymi.','Con tus palabras desperté. Llegaste hasta el fin de la tierra.','With your words I woke up. You have come to the end of the land.'),
      N('Ngen-lelfün es el ngen de la pampa abierta: cuida el pasto, los luan, los choyke y a la gente que vive del campo.','Ngen-lelfün is the ngen of the open plain: it looks after the grass, the guanacos, the rheas, and the people who live from the land.'),
      N('Ngen-lelfün te da su newen: ahora los cercos de espino seco se apartan cuando pasas. Además ganas un corazón nuevo.','Ngen-lelfün gives you its newen: now the fences of dry thorn move aside when you pass. You also gain a new heart.'),
      Object.assign(L('','Kechu trariwe trokiñ!','Entre el pasto dorado queda el último trokiñ, tejido en amarillo y negro. ¡Tienes los 5: el trariwe antiguo está COMPLETO!','In the golden grass lies the last trokiñ, woven in yellow and black. You have all 5: the ancient trariwe is COMPLETE!'),{fx:()=>{sfx('lvl')}}),
      N('Los cinco trokiñ se tejen solos entre tus manos: mar, monte, pewen, viento y pampa, una sola faja. El Walichu era un sirviente de Ti Fütra Ngoymatulfe: el gran olvido te espera al oeste del primer camino, donde todo empezó.','The five trokiñ weave themselves together in your hands: sea, forest, pewen, wind and plain, one single sash. The Walichu was a servant of Ti Fütra Ngoymatulfe: the great forgetting awaits you west of the first road, where everything began.'),
      N('Un círculo de luz aparece en el círculo de piedras: pisándolo puedes volver a la meseta, al lof puelche o a las otras tierras.','A circle of light appears in the stone circle: step on it to return to the meseta, the Puelche lof, or the other lands.'),
      N('Fin de la región puelche (prototipo). Con el trariwe completo, la niebla del oeste ya puede abrirse...','End of the Puelche region (prototype). With the trariwe complete, the fog in the west can now be opened...')]);
  });
}

function postFinal(){
  S.flags.won=1;persist();
  say([N('El coloso se detiene... y suspira. La niebla entera tiembla, se afina, se deshace en hilos de plata que el viento se lleva hacia arriba.','The colossus stops... and sighs. The whole fog trembles, thins, and comes apart into silver threads that the wind carries upward.'),
    N('Y en el silencio nuevo te llega algo más: una voz muy bajita, como un canto bajo el agua, que te llama desde abajo de la isla del lago williche...','And in the new silence something else reaches you: a faint voice, like a song beneath the water, calling you from under the island in the williche lake...')],
    ()=>startEndCut());
}

/* ---------- Lan kewün: Ti Fütra Ngoymatulfe's spell of language death (once per form, twice in the last).
   A quiz on what the player has learned; a miss makes one lof forget Mapudungun, a pass makes it send its newen. ---------- */
const LAN_LOFS=[['lof','Lafkenche lof'],['n_lof','Nagche lof'],['p_lof','Pewenche lof'],['w_lof','Williche lof'],['e_lof','Puelche lof']];
function lanPool(){const en=S.gloss==='en',P=[],sh=o=>{const a=o.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
  for(const Q of NGENQ){const op=Q.o.map(o=>Array.isArray(o)?(en?o[1]:o[0]):o);P.push({q:{m:'«'+Q.m+'»',es:Q.es,en:Q.en},o:sh(op),a:op[Q.a]})}
  if(typeof STONES!=='undefined')for(const k in STONES)for(const q of STONES[k].qs.concat(STONES[k].hq?[STONES[k].hq]:[]))P.push({q:q.q,o:sh(q.o),a:q.a});
  if(typeof TABLETS!=='undefined')for(const k in TABLETS)for(const q of TABLETS[k].qs)P.push({q:q.q,o:sh(q.o),a:q.a});
  if(typeof NUTK!=='undefined'){const f=s=>s.replace('@',S.name);for(const k in NUTK)for(const q of NUTK[k].set.concat(S.flags['ntk2_'+k]?NUTK2[k]:[]))P.push({q:Object.assign({},q.q,{m:f(q.q.m)}),o:sh(q.o.map(f)),a:f(q.a)})}
  return P}
function lanForm(e){return +e.t.slice(-1)}
function lanKewun(e){
  const en=S.gloss==='en',form=lanForm(e),n=S.hm?2+form:3;
  B.lanUsed=B.lanUsed||[];const left=LAN_LOFS.filter(l=>!B.lanUsed.includes(l[0])),lofP=(left.length?left:LAN_LOFS)[rnd((left.length?left:LAN_LOFS).length)];
  const pool=lanPool(),qs=[];for(const m of missList()){if(qs.length>=Math.ceil(n/2))break;if(m.q.m&&m.q.m[0]!=='⧉'&&m.t!=='palin'&&m.t!=='trafkintu (números)')qs.push({q:m.q,o:m.o.slice().sort(()=>Math.random()-.5),a:m.a})}
  while(qs.length<n&&pool.length){const p=pool.splice(rnd(pool.length),1)[0];if(!qs.some(x=>x.q.m===p.q.m&&x.q.es===p.q.es))qs.push(p)}
  say([Object.assign(L(e.label,'Lan kewün!','¡Muerte de la lengua!','Death of the language!'),{fx:()=>{sfx('bad');B.flash=18;B.shake=14;if(!B.lanFx||B.lanFx.e!==e)B.lanFx={e,t:40,cast:0};B.lanFx.cast=1}}),
    N(e.label+' lanza el lan kewün sobre '+lanName({lof:lofP},false)+'. Si fallas una sola de sus '+n+' preguntas, ese lof olvidará todo su mapudungun: perderás 6 piwke y tu newen (la barra verde) no se cargará más contra esta forma.',
      e.label+' casts lan kewün on '+lanName({lof:lofP},true)+'. Miss even one of its '+n+' questions and that lof will forget all its Mapudungun: you will lose 6 hearts, and your newen (the green bar) will not charge again against this form.'),
    N('Responde con lo que has aprendido en tu viaje.','Answer with what you have learned on your journey.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length)return win();
    const q=qs[i];
    choose(Object.assign({},q.q,{es:'('+(i+1)+'/'+qs.length+') '+(q.q.es||''),en:'('+(i+1)+'/'+qs.length+') '+(q.q.en||'')}),q.o.map(o=>({m:o,v:o})),v=>{
      track('lan kewün',v===q.a,q.q,q.o,q.a);if(v===q.a){sfx('ok');ask(i+1)}else{sfx('bad');lose(q.a)}},false,true)}
  function lose(ans){
    B.lanUsed.push(lofP[0]);B.noSp=e;const d=6*HPQ;S.hp=Math.max(1,S.hp-d);
    B.lanScene={lof:lofP,good:0,t:0};
    say([N('La respuesta era: '+ans+'.','The answer was: '+ans+'.'),
      N('La niebla entra por las puertas de las ruka en '+lanName({lof:lofP},false)+'. La gente se mira, asustada, buscando palabras que ya no están.','The fog seeps through the doors of the rukas in '+lanName({lof:lofP},true)+'. People look at each other, frightened, searching for words that are no longer there.'),
      N('«¿Cómo se decía...? No me acuerdo», susurra un niño. «Mi chuchu me hablaba en mapudungun... y ya no le entiendo nada», llora una mujer.','"How did you say...? I can\'t remember," a child whispers. "My chuchu used to talk to me in Mapudungun... and now I don\'t understand a thing," a woman weeps.'),
      N('El lonko abre la boca para saludar como saludaban sus antepasados, y no le sale ni una palabra.','The lonko opens his mouth to greet the way his ancestors greeted, and not a single word comes out.'),
      Object.assign(N('Pierdes 6 piwke (−'+d+'). Tu newen ya no se carga contra esta forma.','You lose 6 hearts (−'+d+'). Your newen no longer charges against this form.'),{fx:()=>{B.lanScene=null;sfx('bad');B.red=12;pop(60,30,'-'+d,'#ff6050')}})],()=>{B.lanScene=null;battleMenu()})}
  function win(){
    B.lanScene={lof:lofP,good:1,t:0};
    say([N('La última palabra sale de ti clara y fuerte. El hechizo se quiebra.','The last word leaves you clear and strong. The spell shatters.'),
      N('Lejos, en '+lanName({lof:lofP},false)+', la gente sale de sus ruka. Las ruka, el kütral y las personas empiezan a brillar.','Far away, in '+lanName({lof:lofP},true)+', people come out of their rukas. The rukas, the kütral and the people begin to glow.'),
      N('«¡Sentimos que estás venciendo a Ti Fütra Ngoymatulfe!», gritan todos.','"We can feel you overcoming Ti Fütra Ngoymatulfe!" they all shout.'),
      L('Pu che','Llownge taiñ newen!','¡Recibe nuestra fuerza!','Receive our strength!'),
      Object.assign(N('El newen del lof te llega en un río de luz: recuperas todos tus piwke, y tus manos sostienen dos wiño a la vez.','The lof\'s newen reaches you in a river of light: all your hearts return, and your hands hold two wiño at once.'),{fx:()=>{B.lanScene=null;S.hp=maxHP();sfx('heal');spark(60,30,'#ffe890',30)}})],
      ()=>{B.lanScene=null;S.hp=maxHP();B.lanBoon=1;battleMenu()})}
}
