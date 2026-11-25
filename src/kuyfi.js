/* ============================================================
   KUYFI MAPU: the new battle layer (milestone 1)
   - the partner (Liwen) fights beside the hero
   - "Iñchiw": -yu combos built with the partner
   - "Kimün": the -ke- reading of an enemy's habit
   - the Kolokolo, Pukem's boss (placeholder art: the dewü sprite)
   ============================================================ */
const KY_COMBOS={
  'ülkantu':{m:'ülkantu-',hes:'¡Cantemos, tú y yo!',es:'cantar',en:'sing',fx:{es:'Sanan los dos y los wekufü se aquietan un poco.',en:'You both heal and the wekufü settle a little.'}},
  'trawü':{m:'trawü-',hes:'¡Juntémonos, tú y yo!',es:'juntarse',en:'come together',fx:{es:'Durante dos turnos se reparten los golpes.',en:'For two turns you share the blows.'}},
  'wüñotreka':{m:'wüñotreka-',hes:'¡Retrocedamos, tú y yo!',es:'retroceder',en:'step back',fx:{es:'Los dos pasan atrás: los que no vuelan pegan la mitad por dos turnos.',en:'You both step back: those that do not fly hit for half, two turns.'}},
  'awkantu':{m:'awkantu-',hes:'¡Juguemos, tú y yo!',es:'jugar',en:'play',fx:{es:'Los distraen: algunos pierden su turno.',en:'You distract them: some lose their turn.'}},
  'kintu':{m:'kintu-',hes:'¡Busquemos, tú y yo!',es:'buscar',en:'look for',fx:{es:'Encuentran a los escondidos y sus puntos débiles.',en:'You find the hidden ones and their weak points.'}},
  'nütramka':{m:'nütramka-',hes:'¡Conversemos, tú y yo!',es:'conversar',en:'talk it over',fx:{es:'Se cuentan lo que viene: este turno los golpes llegan a la mitad.',en:'You tell each other what is coming: this turn the blows land at half.'}}};
const KY_PERS={chi:{es:'solo yo («déjame...»)',en:'just me ("let me...")'},yu:{es:'tú y yo, los dos',en:'you and I, the two of us'},'iñ':{es:'todos nosotros (tres o más)',en:'all of us (three or more)'},
  nge:{es:'a otro, a uno solo',en:'to someone else, just one'},mu:{es:'a otros dos',en:'to two others'}};
const KY_WHY={chi:['-chi es solo para ti: «déjame...». Liwen no entra.','-chi is just you: "let me...". Liwen is left out.'],
  'iñ':['-iñ es «todos nosotros», tres o más. Ahora son dos: tú y Liwen.','-iñ is "all of us", three or more. Right now there are two: you and Liwen.'],
  nge:['-nge le habla a otro, a uno solo: es una orden, no algo que hacen juntos.','-nge speaks to someone else, just one: it is an order, not something you do together.'],
  mu:['-mu les habla a otros dos («ustedes dos»), no a ustedes dos.','-mu speaks to two others ("you two"), not to the two of you.']};
/* each enemy's habit, for the -ke- reading: a root it "usually" does */
const KY_HABIT={kolokolo:{r:'küpa',pre:'Pun mew ',es:'De noche suele venir.',en:'It usually comes at night.'}};
function kyHabit(t){const T=ET[t];if(KY_HABIT[t])return KY_HABIT[t];
  if(T.fly)return{r:'nagtu',pre:'',es:'Suele bajar en picada.',en:'It usually swoops down.'};
  if(T.hide)return{r:'tripa',pre:'',es:'Suele salir de pronto.',en:'It usually comes out all of a sudden.'};
  return{r:'küpa',pre:'',es:'Suele venirse encima.',en:'It usually comes right at you.'}}
const kyShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};

ET.kolokolo={name:'Kolokolo',hp:120,atk:9,xp:120,gold:[60,60],boss:true,bs:72,hide:1,drain:1};
if(typeof SPR2!=='undefined'&&SPR2.dewu){SPR2.kolokolo=SPR2.dewu;if(SPR2['dewu@b'])SPR2['kolokolo@b']=SPR2['dewu@b']}

function kyStart(){if(!B)return;B.back=0;B.warned=0;
  if(S.flags&&S.flags.liwen){const mx=Math.max(8,Math.round(maxHP()*.8));B.pt={name:'Liwen',look:'lof_ulcha',max:mx,hp:mx,guard:0,hit:0}}else B.pt=null}
function kyMenuOpts(en){const o=[];
  if(B.pt)o.push({m:'Iñchiw',g:en?'Speak together with '+B.pt.name+' (-yu)':'Hablar junto con '+B.pt.name+' (-yu)',v:'kyyu',dis:B.pt.hp<=0});
  if(S.flags&&S.flags.kimke)o.push({m:'Kimün',g:en?'Read what an enemy always does (-ke-)':'Leer lo que siempre hace un wekufü (-ke-)',v:'kyke'});
  return o}
function kyMenuPick(v){if(v==='kyyu'){kyPickCombo();return true}if(v==='kyke'){kyPickRead();return true}return false}

function kyPickCombo(){
  const en=S.gloss==='en',opts=Object.keys(KY_COMBOS).map(r=>({m:KY_COMBOS[r].m,g:G(KY_COMBOS[r]),v:r})).concat([{m:en?'Back':'Volver',v:'x'}]);
  choose({m:'___',es:'¿Qué hacen juntos, tú y '+B.pt.name+'?',en:'What do you and '+B.pt.name+' do together?'},opts,r=>{
    if(!r||r==='x')return battleMenu();
    const ends=kyShuf(['chi','yu','iñ','nge','mu']);
    choose({m:r+'___',es:'¿Quiénes lo hacen? Elige la terminación.',en:'Who does it? Choose the ending.'},ends.map(e=>({m:'-'+e,g:S.hints?G(KY_PERS[e]):'',v:e})),e=>{
      if(e===null)return kyPickCombo();
      if(e!=='yu'){sfx('bad');const w=KY_WHY[e];return say([L(S.name,r+e+'!','…','…'),N(B.pt.name+' te mira, sin entender. '+w[0],B.pt.name+' looks at you, puzzled. '+w[1])],enemyPhase)}
      kyCombo(r)},true)},true)}

function kyCombo(r){
  const c=KY_COMBOS[r],fx=[],fxe=[],al=aliveE(),pt=B.pt;
  const head=L(S.name+' · '+pt.name,r+'yu!',c.hes,'Let\'s '+c.en+', you and I!');
  head.fx=()=>{sfx('cast');B.flash=10;B.heroA=16;spark(LW-40,110,'#ffe890',14)};
  S.sp=Math.min(SPMAX,(S.sp||0)+1);
  if(r==='ülkantu'){const h1=Math.ceil(maxHP()*.25),h2=Math.ceil(pt.max*.25);S.hp=Math.min(maxHP(),S.hp+h1);pt.hp=Math.min(pt.max,pt.hp+h2);for(const e of al)e.fear=Math.max(e.fear||0,1);
    fx.push('El ül los envuelve: tú +'+h1+', '+pt.name+' +'+h2+'. Los wekufü se aquietan.');fxe.push('The ül wraps around you: you +'+h1+', '+pt.name+' +'+h2+'. The wekufü settle.')}
  else if(r==='trawü'){pt.guard=2;fx.push('Se ponen hombro con hombro: por dos turnos se reparten los golpes.');fxe.push('You stand shoulder to shoulder: for two turns you share the blows.')}
  else if(r==='wüñotreka'){B.back=2;fx.push('Los dos dan un paso atrás: los que no vuelan pegan la mitad por dos turnos.');fxe.push('You both step back: those that do not fly hit for half, for two turns.')}
  else if(r==='awkantu'){let n=0;for(const e of al){if(Math.random()<(ET[e.t].boss?.3:.6)){e.stun=1;n++}}
    fx.push(n?'Juegan y hacen ruido: '+n+' se distrae'+(n>1?'n':'')+' y pierde'+(n>1?'n':'')+' su turno.':'Juegan y hacen ruido, pero nadie se distrae.');fxe.push(n?'You play and make noise: '+n+' get'+(n>1?'':'s')+' distracted and lose'+(n>1?'':'s')+' a turn.':'You play and make noise, but no one is distracted.')}
  else if(r==='kintu'){let h=0;for(const e of al){if(e.hidden){e.hidden=0;e.hideT=0;h++}e.down=1}
    fx.push((h?'¡Los encuentran! ':'')+'Ahora ven sus puntos débiles: el próximo golpe a cada uno pega más.');fxe.push((h?'You find them! ':'')+'Now you see their weak points: the next blow on each one hits harder.')}
  else if(r==='nütramka'){B.warned=1;fx.push('Se cuentan en voz baja lo que viene: este turno los golpes llegan a la mitad.');fxe.push('You whisper to each other what is coming: this turn the blows land at half.')}
  const eff=N(fx.join(' '),fxe.join(' '));
  say([head,eff],enemyPhase)}

function kyPickRead(){
  const en=S.gloss==='en',al=aliveE().filter(e=>!e.hidden);
  if(!al.length){sfx('bad');return say([N('No ves a nadie a quien leer: están escondidos.','You see no one to read: they are hidden.')],battleMenu)}
  const go=e=>{const h=kyHabit(e.t),ok=h.r+'key',opts=kyShuf([h.r+'key',h.r+'ken',h.r+'keymi']);
    choose({m:h.pre+h.r+'___',es:'¿Qué hace siempre '+e.label+'? (raíz '+h.r+'-)',en:'What does '+e.label+' always do? (root '+h.r+'-)'},opts.map(o=>({m:h.pre+o,g:S.hints?(o.endsWith('key')?(en?'it usually...':'suele...'):o.endsWith('ken')?(en?'I usually...':'suelo...'):(en?'you usually...':'sueles...')):'',v:o})),v=>{
      B.cursor=null;if(v===null)return battleMenu();
      if(v!==ok){sfx('bad');return say([L(S.name,v+'.','…','…'),N(v.endsWith('ken')?'Eso dice lo que tú sueles hacer (-n, yo), no el wekufü.':'Eso le dice al wekufü lo que él suele hacer (-ymi, tú). Hablas de él: -y.',v.endsWith('ken')?'That says what you usually do (-n, I), not the wekufü.':'That tells the wekufü what it usually does (-ymi, you). You are talking about it: -y.')],enemyPhase)}
      e.read=3;S.sp=Math.min(SPMAX,(S.sp||0)+1);sfx('ok');
      say([L(S.name,h.pre+ok+'.',h.es,h.en),N('Ya le conoces la costumbre: durante tres turnos ves venir sus golpes (pegan la mitad) y no puede esconderse.','You know its habit now: for three turns you see its blows coming (they land at half) and it cannot hide.')],enemyPhase)},true)};
  if(al.length===1)return go(al[0]);
  choose({es:'¿A quién lees?',en:'Whom do you read?'},al.map(e=>({m:e.label,v:B.en.indexOf(e)})),i=>{B.cursor=null;if(i===null)return battleMenu();go(B.en[i])},true,false,(i,o)=>{B.cursor=o.v})}

/* called at the start of every enemy phase */
function kyEnemyPre(fx,fxe,hitsFx){
  B.warnNow=B.warned;B.warned=0;
  for(const e of aliveE()){if(e.read>0)e.read--;
    if(e.t==='kolokolo'&&e.hp>0){e.kt=(e.kt||0)+1;
      if(e.hidden){e.hk=(e.hk||0)+1;if(e.hk>=2){e.hidden=0;e.hk=0;fx.push('El Kolokolo vuelve a asomarse.');fxe.push('The Kolokolo peeks out again.')}}
      else if(e.kt%3===0&&!(e.read>0)){e.hidden=1;e.hk=0;fx.push('El Kolokolo se escurre entre las sombras de la ruka.');fxe.push('The Kolokolo slips away into the shadows of the ruka.')}}}}
/* called once at the end of every enemy phase */
function kyEnemyPost(){if(B.pt&&B.pt.guard>0)B.pt.guard--;if(B.back>0)B.back--;B.warnNow=0}
/* every enemy hit passes here first: the reading, the warning and stepping back soften it; the partner may take it */
function kyRedirect(e,d,fx,fxe,hitsFx){
  if(e.read>0)d=Math.max(1,Math.round(d/2));
  if(B.warnNow)d=Math.max(1,Math.round(d/2));
  if(B.back>0&&!ET[e.t].fly)d=Math.max(1,Math.round(d/2));
  const pt=B.pt;if(!pt||pt.hp<=0)return{d};
  const hitPt=k=>{pt.hp=Math.max(0,pt.hp-k);hitsFx.push(()=>{e.lunge=16;pt.hit=10;pop(LW-70,60,'-'+k,'#ff9070')});
    if(pt.hp<=0){fx.push(pt.name+' cae. (Junto al kütral se recupera.)');fxe.push(pt.name+' falls. (She recovers by the kütral.)')}};
  if(pt.guard>0){const a=Math.ceil(d/2);fx.push(e.label+' golpea: '+pt.name+' recibe la mitad (−'+a+').');fxe.push(e.label+' strikes: '+pt.name+' takes half (−'+a+').');hitPt(a);return{d:d-a}}
  if(Math.random()<.4){fx.push(e.label+' golpea a '+pt.name+' (−'+d+').');fxe.push(e.label+' hits '+pt.name+' (−'+d+').');hitPt(d);return{skip:true}}
  return{d}}

function kyDrawPartner(c){const pt=B&&B.pt;if(!pt)return;
  const cvs=ctCharSpriteBig(pt.look,'left',0),hw=cvs.width,hh=cvs.height,x=LW-88+(B.intro>0?Math.round(B.intro*1.2):0),base=130;
  if(pt.hit>0)pt.hit--;
  ell(c,x+hw/2,base,hw*.46,3,'rgba(0,0,14,.34)');
  c.save();if(pt.hp<=0)c.globalAlpha=.35;if(pt.hit&&frame%6<3)c.globalAlpha=.5;
  c.drawImage(cvs,0,0,hw,hh,x,Math.round(base-hh),hw,hh);c.restore();
  if(!window.FILM){const bw=26,bx=x+Math.round(hw/2)-13,by=base+3;R(c,bx-1,by-1,bw+2,4,'#181018');R(c,bx,by,bw,2,'#1a3a24');R(c,bx,by,Math.round(bw*pt.hp/pt.max),2,'#60d080');
    if(pt.guard>0)R(c,bx,by+3,bw,1,'#ffe080');}}
