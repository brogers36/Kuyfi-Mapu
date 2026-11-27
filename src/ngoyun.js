/* ======================================================================
   UPEWTUWÜN MAPU, the secret level (opens once every secret is done:
   the six hidden wekufü, Münche lafken, Ti Fütra Ngoymatulfe, the
   Epunamun and the Yewen). Your shadow walks away from you on the sea
   road and into a grey crack: inside is the land where everything you
   forgot goes. Its places are grey copies of the first ones (the sea
   road, the Lafkenche lof, your kuku's ruka). Each word you put back
   brings colour back around it; at the end your shadow fights you with
   the questions you missed most.
   All new Mapudungun is listed in docs/review.md (Tanda 26) with ⚠.
   ====================================================================== */
ET.llawfen={name:'llawfeñ',hp:320,atk:22,xp:300,gold:[300,300],boss:true,bs:110,spres:1,seals:['umawtu','nepe','tripakil']};
function allSecrets(){const F=S&&S.flags;return !!(F&&['sb1','sb2','sb3','sb4','sb5','sb6'].every(k=>F[k])&&F.chboss&&F.won&&F.epu_won&&F.yewen_won)}
const llawName=()=>S.name+' ñi llawfeñ';

/* ---------- the three grey places: copies of where the journey began ---------- */
// the stones of the sea road stand on open sand above the road, clear of the tree canopies
{const cp=(id,src,fix)=>{const rows=MAPROWS[src].map(r=>r.split(''));fix(rows);MAPROWS[id]=rows.map(r=>r.join(''))};
 cp('y_rupu','rupu',r=>{r[10][0]=',';r[11][9]=',';for(const [x,y] of [[4,4],[13,5],[20,4],[27,4]])r[y][x]='I'});
 cp('y_lof','lof',r=>{r[1][32]=','});
 cp('y_ruka','l_ruka2',r=>{});}
const NGY={floor:',',bg:'coast',region:'ngoyun',ngoyun:1,fog:1};
function addNgMap(id,def){def.rows=MAPROWS[id];def.w=def.rows[0].length;def.h=def.rows.length;MAPS[id]=def}
const LLAW_LOCK=[N('Una niebla gris, fina como ceniza, cierra el camino. Detrás de ella todo está borrado: primero hay que devolverle sus palabras a este lugar.','A grey mist, fine as ash, closes the road. Beyond it everything is erased: first this place needs its words back.')];
addNgMap('y_rupu',Object.assign({},NGY,{floor:'.',name:'Upewtuwün rüpü',g:{es:'El camino del olvido',en:'The road of forgetting'},song:'coast',
 edges:{left:{to:'rupu',x:5,y:5},right:{to:'y_lof',x:1,y:9,req:'yfull:y_rupu',reqMsg:LLAW_LOCK}},
 signs:{'4,4':()=>ngSign('4,4'),'13,5':()=>ngSign('13,5'),'20,4':()=>ngSign('20,4'),'27,4':()=>ngSign('27,4')},
 ngspots:{'4,4':[4,4],'13,5':[13,5],'20,4':[20,4],'27,4':[27,4]},
 ents:[{id:'ykuku',kind:'npc',look:'kuku',fem:1,x:3,y:5,dir:'right',fixed:1,talk:()=>yKukuTalk()},
   {kind:'enemy',x:15,y:9,party:['ngoyam','ngoyam']},{kind:'enemy',x:22,y:3,party:['ngoyam','ngoyam','ngoyam']}]}));
addNgMap('y_lof',Object.assign({},NGY,{name:'Upewtuwün lof',g:{es:'La comunidad del olvido',en:'The community of forgetting'},song:'lof',pave:1,
 doors:{'3,8':{to:'y_ruka',x:6,y:7,req:'yfull:y_lof',reqMsg:[N('La puerta de la ruka de tu kuku está tapada con niebla gris. Adentro, alguien respira con tu mismo ritmo.','The door of your kuku\'s ruka is stopped up with grey mist. Inside, someone is breathing at your own pace.'),
   N('Primero devuélvele sus palabras a la gente del lof.','First give the people of the lof their words back.')]}},
 edges:{left:{to:'y_rupu',x:28,y:6}},
 ngspots:{yteach:[13,13],ycook:[24,8],yweave:[6,3],ylonko:[18,7],ymom:[30,13]},
 ents:[{id:'yteach',kind:'npc',look:'teacher',fem:1,x:13,y:12,dir:'down',act:'teach',fixed:1,talk:()=>ngPerson('yteach')},
   {id:'ykid1',kind:'npc',look:'child',x:12,y:14,dir:'up',seated:1,fixed:1,talk:()=>ngKid()},
   {id:'ykid2',kind:'npc',look:'childf',fem:1,x:13,y:14,dir:'up',seated:1,fixed:1,talk:()=>ngKid()},
   {id:'ykid3',kind:'npc',look:'child',x:14,y:14,dir:'up',seated:1,fixed:1,talk:()=>ngKid()},
   {id:'ycook',kind:'npc',look:'cook',fem:1,x:24,y:8,dir:'down',act:'cook',fixed:1,talk:()=>ngPerson('ycook')},
   {id:'yweave',kind:'npc',look:'weaver',fem:1,x:6,y:3,dir:'up',act:'weave',fixed:1,talk:()=>ngPerson('yweave')},
   {id:'ylonko',kind:'npc',look:'lonko',x:18,y:7,dir:'down',fixed:1,talk:()=>ngPerson('ylonko')},
   {id:'ymom',kind:'npc',look:'fisherw',fem:1,x:30,y:13,dir:'left',fixed:1,talk:()=>ngPerson('ymom')},
   {id:'ypichi1',kind:'npc',look:'child',x:28,y:13,dir:'right',fixed:1,talk:()=>ngKid()},
   {id:'ypichi2',kind:'npc',look:'childf',fem:1,x:28,y:14,dir:'right',fixed:1,talk:()=>ngKid()},
   {kind:'enemy',x:20,y:13,party:['ngoyam','ngoyam','ngoyam']}]}));
addNgMap('y_ruka',Object.assign({},NGY,{floor:'_',name:'Upewtuwün ruka',g:{es:'La ruka del olvido',en:'The ruka of forgetting'},song:'lof',pal:'rukain',wall:'ruka',interior:1,
 edges:{down:{to:'y_lof',x:3,y:9}},ngspots:{},
 ents:[{id:'yllaw',kind:'npc',look:'llawfen',x:5,y:4,dir:'down',fixed:1,flag:'llaw_won',talk:()=>llawTalk()}]}));
// the crack on the real sea road, once the shadow has walked off
MAPS.rupu.ents.push({id:'llawcrack',kind:'npc',look:'llawcrack',x:5,y:4,fixed:1,req:'llaw_seen',talk:()=>crackTalk()});
SONGSET.ngoyun={battle:'ngoyBattle',boss:'ngoyBoss'};

/* ---------- state: which words are back ---------- */
const ngKey=(id,k)=>'yw:'+id+':'+k;
const ngDone=(id,k)=>!!S.flags[ngKey(id,k)];
const ngFull=id=>!!S.flags['yfull:'+id];
const YWT={};   // when each spot got its word back (frame), for the colour animation; spots already back when a map loads show in full
let YWF=null;   // {t, x, y}: the whole map turning back to colour
function ngRestore(k,after){
  S.flags[ngKey(CUR,k)]=1;YWT[CUR+':'+k]=frame;sfx('lvl');
  const sp=Object.keys(M.ngspots);
  if(sp.every(q=>ngDone(CUR,q))&&!ngFull(CUR)){S.flags['yfull:'+CUR]=1;const p=M.ngspots[k];YWF={t:frame+40,x:p[0],y:p[1],id:CUR}}
  persist();
  if(ngFull(CUR)&&YWF&&YWF.id===CUR)return say(after,()=>ngMapDone(CUR));
  say(after)}
function ngMapDone(id){
  setTimeout(()=>playSong(mapSong()),900);
  if(id==='y_rupu')return say([N('La última letra vuelve a su lugar... y el color corre por el camino como agua: el mar se pone azul, la arena dorada, el fuego naranja.','The last letter returns to its place... and colour runs down the road like water: the sea turns blue, the sand golden, the fire orange.'),
    N('La niebla del este se abre. Allá, gris todavía, está el lof donde aprendiste a presentarte.','The mist to the east opens. Over there, still grey, is the lof where you learned to introduce yourself.')]);
  if(id==='y_lof')return say([N('Toda la gente del lof se mira, como despertando de un sueño largo. Alguien se ríe. Alguien dice «mari mari», y otro le contesta.','All the people of the lof look at one another, as if waking from a long sleep. Someone laughs. Someone says «mari mari», and someone else answers.'),
    N('La niebla de la puerta de la ruka de tu kuku se deshace. Adentro, tu sombra te espera.','The mist over the door of your kuku\'s ruka dissolves. Inside, your shadow is waiting for you.')]);
}

/* ---------- the carved stones of the sea road: a letter is missing ---------- */
const NGSIGN={
  '4,4':{pre:'ant',gap:'ü',suf:'',o:['ü','u','e','i'],es:'el sol',en:'the sun',
    note:['La ü es la sexta vocal del mapudungun: no es u, ni i, ni e.','ü is the sixth vowel of Mapudungun: it is not u, or i, or e.']},
  '13,5':{pre:'',gap:'tr',suf:'ewa',o:['tr','ch','t','r'],es:'el perro',en:'the dog',
    note:['tr es un solo sonido, como en trewa y en trariwe: no es ch ni t.','tr is a single sound, as in trewa and trariwe: it is not ch or t.']},
  '20,4':{pre:'la',gap:'f',suf:'ken',o:['f','p','w','ng'],es:'el mar',en:'the sea',note:null},
  '27,4':{pre:'',gap:'ll',suf:'awfeñ',o:['ll','l','y','ch'],es:'la sombra',en:'the shadow',
    note:['Llawfeñ: la sombra. La tuya pasó por aquí y siguió hacia el este.','Llawfeñ: the shadow. Yours came this way and went on east.']}};
function ngShuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function ngSign(k){const D=NGSIGN[k],w=D.pre+D.gap+D.suf,en=S.gloss==='en';
  if(ngDone(CUR,k))return say([L('Kura',w,'Una piedra tallada: «'+w+'», '+D.es+'. Las letras brillan.','A carved stone: «'+w+'», '+D.en+'. The letters glow.')]);
  const q={m:D.pre+'_'+D.suf,es:'Una piedra tallada, gris, borrada por el olvido. Falta una letra. ('+D.es+')',en:'A grey carved stone, worn away by forgetting. One letter is missing. ('+D.en+')'};
  const opts=D.o.map(g=>D.pre+g+D.suf);
  const ask=()=>choose(q,ngShuf(opts).map(o=>({m:o,v:o})),v=>{
    const ok=v===w;track('upewtuwün mapu (letras)',ok,q,opts,w);
    if(ok)return ngRestore(k,[Object.assign(L('',w,'«'+D.es+'». La letra vuelve a su lugar, y alrededor de la piedra el mundo recupera su color.','"'+D.en+'". The letter returns to its place, and around the stone the world gets its colour back.'),{fx:()=>sfx('cast')})]
      .concat(D.note?[N(D.note[0],D.note[1])]:[]));
    sfx('bad');say([N('Las letras se deshacen como ceniza. No era esa.','The letters crumble like ash. That was not it.')],ask)},false,true);
  ask()}
function yKukuTalk(){
  if(ngFull('y_rupu'))return say([L('Kuku','Mari mari, '+nm()+'!','Te reconoce. Sonríe como el primer día, cuando te esperaba en este mismo camino.','She recognizes you. She smiles like on the first day, when she waited for you on this same road.'),
    N('«Anda, anda. Tu sombra se fue hacia el lof.»','"Go on, go on. Your shadow went toward the lof."')]);
  say([N('Una figura gris, igual a tu kuku, mira el mar donde la viste por primera vez. No te ve. Mueve los labios, pero no le sale ninguna palabra.','A grey figure, just like your kuku, looks at the sea where you first saw her. She does not see you. Her lips move, but no word comes out.'),
    N('Alrededor, las piedras talladas del camino están borradas. Quizás si les devuelves sus letras...','All around, the carved stones of the road are worn away. Perhaps if you give them back their letters...')])}

/* ---------- the people of the grey lof: each has lost one word ---------- */
const NGPEOPLE={
  yteach:{who:'Kimeltufe',pre:'Kiñe, epu, ',post:', meli!',a:'küla',o:['küla','kechu','mari','epu'],es:'«¡Uno, dos, ___, cuatro!» La profesora cuenta con los niños, y en el tercer número se quedan todos callados.',en:'"One, two, ___, four!" The teacher counts with the children, and at the third number they all fall silent.',
    full:'Kiñe, epu, küla, meli!',fes:'¡Uno, dos, tres, cuatro!',fen:'One, two, three, four!',
    after:[N('Los niños repiten el número a gritos, felices, y siguen contando hasta mari.','The children shout the number back, happily, and keep counting up to mari.')]},
  ycook:{who:'Iyaelfe',pre:'Elumuen ',post:'.',a:'kofke',o:['kofke','kütral','lafken','ruka'],es:'Tiene la masa en las manos y te mira con los ojos vacíos: «Dame ___». No se acuerda de cómo se llama lo que está haciendo.',en:'She has the dough in her hands and looks at you with empty eyes: "Give me ___". She does not remember what the thing she is making is called.',
    full:'Elumuen kofke.',fes:'Dame pan.',fen:'Give me bread.',
    after:[N('Se ríe de sí misma y te pasa un pedazo caliente. Huele a horno de barro.','She laughs at herself and hands you a warm piece. It smells of the clay oven.')]},
  yweave:{who:'Ngürekafe',pre:'Iney ',post:' am?',a:'pingeymi',o:['pingeymi','pingen','pingey','pingeyu'],es:'La tejedora levanta la vista del witral: «¿Cómo ___?». Quiere preguntarte tu nombre, pero la palabra se le quedó en el telar.',en:'The weaver looks up from the witral: "What ___?" She wants to ask your name, but the word got caught in the loom.',
    full:'Iney pingeymi am?',fes:'¿Cómo te llamas?',fen:'What is your name?',
    after:[L(null,'Iñche @ pingen.','Le dices tu nombre.','You tell her your name.'),N('Lo repite despacio, y lo teje en una esquina de la faja.','She repeats it slowly, and weaves it into a corner of the sash.')]},
  ylonko:{who:'Lonko',pre:'Fewla mapudungun mew ',post:'!',a:'nütramkayaiñ',o:['nütramkayaiñ','nütramkayan','nütramkaymi','nütramkay'],es:'El lonko abre los brazos para hablarle a todo el lof: «¡Ahora vamos a ___ en mapudungun!»... y el verbo no le sale.',en:'The lonko opens his arms to speak to the whole lof: "Now let us all ___ in Mapudungun!"... and the verb will not come.',
    full:'Fewla mapudungun mew nütramkayaiñ!',fes:'¡Ahora vamos a conversar en mapudungun!',fen:'Now let us talk in Mapudungun!',
    after:[N('Le habla a todos, no a uno: -iñ, «nosotros». El lof entero contesta a la vez.','He is speaking to everyone, not to one: -iñ, "we". The whole lof answers at once.')]},
  ymom:{who:'Ñuke',pre:'Iyael! ',post:'',a:'Küpamu!',o:['Küpamu!','Küpange!','Küpamün!','Küpan!'],es:'La mamá llama a sus dos hijos a comer: «¡A comer! ¡___!» Los niños esperan, quietos, a que termine la frase.',en:'The mother calls her two children to eat: "Food! ___!" The children wait, still, for her to finish.',
    full:'Iyael! Küpamu!',fes:'¡A comer! ¡Vengan (ustedes dos)!',fen:'Food! Come (you two)!',
    after:[N('Son dos: -mu. Los niños corren hacia ella riéndose.','There are two of them: -mu. The children run to her, laughing.')]}};
function ngPerson(id){const D=NGPEOPLE[id],en=S.gloss==='en';
  if(ngDone('y_lof',id))return say([L(D.who,D.full,D.fes,D.fen)]);
  const q={m:D.pre+'___'+D.post,es:D.es,en:D.en,who:D.who};
  const ask=()=>choose(q,ngShuf(D.o).map(o=>({m:o,v:o})),v=>{
    const ok=v===D.a;track('upewtuwün mapu (palabras)',ok,q,D.o,D.a);
    if(ok)return ngRestore(id,[Object.assign(L(D.who,D.full,D.fes,D.fen),{fx:()=>sfx('cast')}),N('El color le vuelve a la cara, a la ropa, al suelo que pisa.','Colour comes back to their face, their clothes, the ground they stand on.')]
      .concat(D.after.map(l=>l.m&&l.m.includes('@')?Object.assign({},l,{who:S.name,m:l.m.replace('@',S.name)}):l)));
    sfx('bad');say([N('La palabra no encaja: la frase se queda gris.','The word does not fit: the sentence stays grey.')],ask)},false,true);
  say([N(D.es,D.en)],ask)}
function ngKid(){
  if(ngFull('y_lof'))return say([L('Pichiche','Mari mari!','¡Hola!','Hello!')]);
  say([N('Un niño gris, quieto, esperando que alguien termine de hablar.','A grey child, still, waiting for someone to finish speaking.')])}

/* ---------- the crack on the sea road ---------- */
function crackTalk(){const en=S.gloss==='en';
  say([N(S.flags.llaw_won?'La grieta sigue ahí, pero ya no es gris: adentro se ve el color del camino y del lof.':'Una grieta gris en el aire, del alto de una persona. Por ella se fue tu sombra. Adentro no hay color, y las palabras flotan como ceniza.',
    S.flags.llaw_won?'The crack is still there, but it is no longer grey: inside you can see the colours of the road and the lof.':'A grey crack in the air, the height of a person. Your shadow went through it. Inside there is no colour, and words drift like ash.')],()=>
    choose({m:'Upewtuwün mapu',es:'¿Entras?',en:'Go in?'},[{m:en?'Go in':'Entrar',v:1},{m:en?'Not yet':'Todavía no',v:0}],v=>{
      if(!v)return;sfx('swirl');loadMap('y_rupu',1,6)},true,true))}
function llawIntro(){
  S.flags.llaw_seen=1;persist();
  const def=MAPS.rupu.ents.find(e=>e.id==='llawcrack');
  say([N('Algo es distinto en el camino del mar, donde empezó tu viaje. Miras al suelo: tu sombra no está a tus pies.','Something is different on the sea road, where your journey began. You look down: your shadow is not at your feet.'),
    N('Está unos pasos más allá, parada al borde del camino. Te mira con tus propios ojos... y se mete en una grieta gris que se abre en el aire.','It stands a few steps away, at the edge of the road. It looks at you with your own eyes... and steps into a grey crack that opens in the air.'),
    Object.assign(N('Venciste a todos los wekufü escondidos, bajaste al fondo del lago, pasaste la prueba del Epunamun y le devolviste la voz a Santiago. Pero hay un lugar donde todavía no has estado: el lugar adonde se va todo lo que se te olvidó.','You defeated every hidden wekufü, went down to the bottom of the lake, passed the Epunamun\'s trial and gave Santiago its voice back. But there is one place you have not been yet: the place where everything you forgot goes.'),
      {fx:()=>{if(CUR==='rupu'&&!ents.some(e=>e.id==='llawcrack')){const e=Object.assign({},def,{fx:def.x,fy:def.y,ox:def.x,oy:def.y,cd:60,wait:0,pi:0,bt:0,dir:'down'});ents.push(e)}sfx('swirl')}})])}
const _ngLoadMap=loadMap;
loadMap=function(id){const r=_ngLoadMap.apply(this,arguments);
  if(id==='rupu'&&allSecrets()&&!S.flags.llaw_seen)setTimeout(()=>{if(!active&&mode==='map'&&CUR==='rupu')llawIntro()},700);
  if(MAPS[id]&&MAPS[id].ngoyun&&!S.flags['ng_in:'+id]){S.flags['ng_in:'+id]=1;persist();
    const T={y_rupu:[N('Todo es gris. El mar no se mueve, el fuego no da calor. Es el camino del mar, el primero... pero alguien le borró los colores y las letras.','Everything is grey. The sea does not move, the fire gives no warmth. It is the sea road, the very first one... but someone has erased its colours and its letters.'),
        N('Por el aire flotan letras sueltas, como ceniza. Estás en Upewtuwün mapu: aquí viene a parar todo lo que se olvida.','Loose letters drift through the air like ash. You are in Upewtuwün mapu: everything that is forgotten ends up here.')],
      y_lof:[N('El lof de siempre, en gris. La gente está en sus lugares, pero quieta, con la boca abierta a medio decir algo. A cada uno le falta una palabra.','The same old lof, in grey. The people are in their places, but still, their mouths open halfway through saying something. Each of them is missing a word.')],
      y_ruka:[]}[id];
    if(T&&T.length)setTimeout(()=>{if(!active&&mode==='map')say(T)},650)}
  return r};
const _ngMapSong=mapSong;
mapSong=function(){if(M&&M.ngoyun)return ngFull(CUR)?(M.song==='coast'?'coast':'lof'):'ngoy';return _ngMapSong()};
const _ngStart=startBattle;
startBattle=function(){const r=_ngStart.apply(this,arguments);if(B&&M&&M.ngoyun&&!ngFull(CUR))B.grey=1;return r};

/* ---------- the shadow ---------- */
function llawTalk(){const en=S.gloss==='en',lw=llawName();
  say([N('Junto al fuego apagado, donde tu kuku te contó la primera historia, está sentada tu sombra. Se levanta cuando entras. Tiene tu altura, tu manera de pararte, tu pelo.','By the dead fire, where your kuku told you the first story, your shadow is sitting. It stands up as you come in. It has your height, your way of standing, your hair.'),
    L(lw,'Mari mari, '+S.name+'.','Lo dice con tu voz.','It says it in your voice.'),
    L(lw,'Iñche tami llawfeñ.','Soy tu sombra.','I am your shadow.'),
    N('«Aquí guardé todo lo que se te olvidó en el camino: cada palabra que se te escapó, cada respuesta que fallaste. Las fui juntando una por una mientras tú seguías caminando.»','"Here I kept everything you forgot along the way: every word that slipped away, every answer you missed. I gathered them one by one while you kept walking."'),
    N('«No soy un wekufü. Soy lo que todavía te falta aprender. Si quieres que vuelva contigo, demuéstrame que ya no me necesitas para acordarte.»','"I am not a wekufü. I am what you still have to learn. If you want me back with you, show me you no longer need me to remember."')],()=>
    choose(L(lw,'Weychayayu?','¿Peleamos tú y yo?','Shall we fight, you and I?'),
      [{m:'May, weychayayu!',g:en?'Yes, let us fight!':'¡Sí, peleemos!',v:1},{m:'Pepikawkülelan petu',g:en?'I am not prepared yet':'Todavía no estoy preparado',v:0}],v=>{
      if(!v)return say([N('Tu sombra se vuelve a sentar junto al fuego apagado. «Aquí voy a estar», dice. «Siempre estoy.»','Your shadow sits back down by the dead fire. "I will be here," it says. "I always am."')]);
      ET.llawfen.name=lw;
      say([N('Tu sombra levanta los brazos igual que tú. A su alrededor se encienden tres sellos de luz: tus propias palabras.','Your shadow raises its arms just as you do. Three seals of light kindle around it: your own words.')],()=>{
        startBattle(['llawfen'],{boss:1,sflag:'llaw_won',song:'ngoyFinal'});llawSetup()})},true,true))}
function llawSetup(){const e=B&&B.en[0];if(!e||e.t!=='llawfen')return;
  // it mirrors you: as tough as about eight of your blows, hitting about as hard as you can take
  const hp=Math.max(300,Math.round((atk()+4)*8));e.hp=e.max=hp;
  ET.llawfen.atk=Math.max(22,def()+Math.round(maxHP()/13));   // about thirteen of its plain blows to bring you down
  const R=ngShuf(S.roots.filter(r=>VG[r]));const pick=R.slice(0,3);while(pick.length<3)pick.push(['umawtu','nepe','tripa'][pick.length]);
  pick[2]+='kil';e.seals=pick;
  e.label=GR(llawName())}
function llawTurn(e,hitP,fx,fxe,hitsFx){
  const t=B.turn;
  if(t>0&&t%4===2&&!B.llawPending){B.llawPending=e;
    fx.push(e.label+' abre la boca, y de adentro salen, una por una, las palabras que se te olvidaron...');fxe.push(e.label+' opens its mouth, and out come, one by one, the words you forgot...');
    hitsFx.push(()=>{sfx('cast');B.flash=12;B.shake=8});return}
  if(e.seals&&!e.seals.length&&t>0&&t%5===0){const pool=S.roots.filter(r=>VG[r]);let code=pool[rnd(pool.length)];if(Math.random()<.4)code+='kil';e.seals=[code];
    fx.push('¡Tu sombra alza una barrera con tus propias palabras! '+sealGloss(code,'es'));fxe.push('Your shadow raises a barrier made of your own words! '+sealGloss(code,'en'));hitsFx.push(()=>{sfx('cast');B.flash=10});return}
  if(B.last&&ROOTS[B.last.r]&&Math.random()<.4){const f=B.last.r+(B.last.k?'kil':'')+'nge';
    hitP(e,1.5,{es:' te devuelve tu última orden, con tu misma voz: «'+f+'!»',en:' throws your last command back at you, in your own voice: "'+f+'!"'});hitsFx.push(()=>B.shake=8);return}
  if(t>0&&t%4===0){hitP(e,1.9,{es:' se lanza contra ti con todos tus movimientos a la vez',en:' hurls itself at you with all your moves at once'});hitsFx.push(()=>B.shake=10);return}
  hitP(e,1.1,{es:' te golpea igual que tú golpeas',en:' strikes you the way you strike'})}
function llawPool(n){const qs=[];
  for(const m of missList()){if(qs.length>=n)break;if(m.q.m&&m.q.m[0]!=='⧉'&&m.t!=='palin'&&!/trafkintu/.test(m.t)&&m.o&&m.o.length>1)qs.push({q:m.q,o:ngShuf(m.o),a:m.a,mine:1})}
  const pool=lanPool();while(qs.length<n&&pool.length){const p=pool.splice(rnd(pool.length),1)[0];if(!qs.some(x=>x.q.m===p.q.m&&x.q.es===p.q.es))qs.push(p)}
  return qs}
function llawKewun(e){
  const qs=llawPool(3),mine=qs.filter(q=>q.mine).length;
  say([Object.assign(L(e.label,'Upewtuwün!','¡Olvido!','Forgetting!'),{fx:()=>{sfx('bad');B.flash=14;B.shake=10}}),
    N(mine?'Tu sombra te devuelve '+(mine===qs.length?'las preguntas':mine+' de las preguntas')+' que fallaste en tu viaje. Cada respuesta correcta la hiere; cada error la alimenta y te cuesta 2 piwke.':'Tu sombra casi no tiene olvidos tuyos que devolverte: te pregunta lo que aprendiste. Cada respuesta correcta la hiere; cada error la alimenta y te cuesta 2 piwke.',
      mine?'Your shadow hands back '+(mine===qs.length?'the questions':mine+' of the questions')+' you missed on your journey. Every right answer wounds it; every mistake feeds it and costs you 2 hearts.':'Your shadow has almost none of your forgettings to hand back: it asks you what you learned. Every right answer wounds it; every mistake feeds it and costs you 2 hearts.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length)return battleMenu();
    const q=qs[i];
    choose(Object.assign({},q.q,{es:'('+(i+1)+'/'+qs.length+') '+(q.q.es||''),en:'('+(i+1)+'/'+qs.length+') '+(q.q.en||'')}),q.o.map(o=>({m:o,v:o})),v=>{
      const ok=v===q.a;track('llawfeñ',ok,q.q,q.o,q.a);
      if(ok){const d=Math.round(e.max*.07);e.hp=Math.max(1,e.hp-d);
        return say([Object.assign(N('La palabra te sale clara: tu sombra se encoge (−'+d+').','The word comes out clear: your shadow shrinks (−'+d+').'),{fx:()=>{sfx('ok');e.hit=12;const p=epos(e);pop(p.x,p.y-10,'-'+d,'#ffffff');spark(p.x,p.y,'#e8e0ff',12)}})],()=>ask(i+1))}
      const d=2*HPQ,hl=Math.round(e.max*.04);S.hp=Math.max(1,S.hp-d);e.hp=Math.min(e.max,e.hp+hl);
      say([Object.assign(N('Se te escapa otra vez. La respuesta era: '+q.a+'. Tu sombra la guarda y crece (+'+hl+'); tú pierdes 2 piwke (−'+d+').','It slips away again. The answer was: '+(OPT_EN[q.a]||q.a)+'. Your shadow keeps it and grows (+'+hl+'); you lose 2 hearts (−'+d+').'),
        {fx:()=>{sfx('bad');B.red=10;pop(60,30,'-'+d,'#ff6050');const p=epos(e);pop(p.x,p.y-10,'+'+hl,'#80ff90')}})],()=>ask(i+1))},false,true)}}
function llawLast(qb){const en=S.gloss==='en';
  const q=llawPool(1)[0]||{q:{m:'«Amun.»',es:'¿Quién fue?',en:'Who went?'},o:['iñche','eymi','fey'],a:'iñche'};
  say([N(qb.label+' cae de rodillas. Levanta la cara, que es tu cara, y te hace una última pregunta: '+(q.mine?'la que más veces se te olvidó.':'una de las primeras que aprendiste.'),
      qb.label+' drops to its knees. It lifts its face, which is your face, and asks you one last question: '+(q.mine?'the one you forgot most often.':'one of the first ones you learned.'))],()=>
    choose(q.q,ngShuf(q.o).map(o=>({m:o,v:o})),v=>{const ok=v===q.a;track('llawfeñ',ok,q.q,q.o,q.a);
      if(ok){sfx('lvl');B.flash=16;B.shake=10;qb.hp=0;B.qok=1;
        return say([N('Esta vez no se te olvida. Tu sombra cierra los ojos y sonríe.','This time you do not forget. Your shadow closes its eyes and smiles.')],victory)}
      sfx('bad');qb.stag=0;const rg=Math.round(qb.max*.2);qb.hp=Math.min(qb.max,qb.hp+rg);
      say([N('Otra vez se te escapa. La respuesta era: '+q.a+'. Tu sombra se levanta, más fuerte (+'+rg+').','It slips away again. The answer was: '+(OPT_EN[q.a]||q.a)+'. Your shadow gets up, stronger (+'+rg+').')],battleMenu)},false,true))}
let LLAWFX=null;   // the shadow fading and coming back to you, after the fight: {t0, sx, sy} (frame it began, the shadow's tile)
function llawWon(){const lw=llawName();
  S.flags.llaw_won=1;S.flags.kimche=1;persist();sfx('lvl');KIMCHE=undefined;
  const sh=ents.find(e=>e.id==='yllaw');
  say([N('Te mira un largo rato, respirando a tu mismo ritmo... y por primera vez sonríe.','It looks at you for a long while, breathing at your own pace... and for the first time it smiles.'),
    L(lw,'Ka iñche eymi.','Yo también soy tú.','I am you, too.'),
    L(S.name,'Amuayu, tañi llawfeñ.','Vámonos los dos, sombra mía.','Let us go, the two of us, my shadow.'),
    N('Le tiendes la mano.','You hold out your hand.')],()=>{
    // the shadow fades slowly, drifts across the floor as a wisp of dark, and settles back at your feet
    LLAWFX={t0:frame,sx:sh?sh.x:5,sy:sh?sh.y:4};active={kind:'wait',a(){},b(){}};sfx('swirl');
    setTimeout(()=>sfx('cast'),2700);
    setTimeout(()=>{active=null;ents=ents.filter(e=>e.id!=='yllaw');
      for(const id of ['y_rupu','y_lof','y_ruka'])S.flags['yfull:'+id]=1;YWF={t:frame,x:P.x,y:P.y,id:CUR};persist();sfx('lvl');
      setTimeout(()=>playSong(mapSong()),600);
      say([N('Tu sombra vuelve a tus pies, donde siempre estuvo. Las palabras que guardaba vuelven contigo: ya no son olvidos, son cosas que aprendiste dos veces.','Your shadow comes back to your feet, where it always was. The words it kept come back with you: they are no longer things you forgot, they are things you learned twice.'),
        N('El color vuelve a la ruka, al lof y al camino del mar. Afuera, la gente del lof se saluda: «Mari mari!»','Colour comes back to the ruka, the lof and the sea road. Outside, the people of the lof greet one another: «Mari mari!»'),
        Object.assign(L('','Kimche!','Desde hoy te llaman kimche: la persona que sabe. No porque nunca olvide, sino porque vuelve a aprender lo que olvida.','From today they call you kimche: the one who knows. Not because they never forget, but because they learn again what they forget.'),{fx:()=>sfx('lvl')}),
        N('Tu sombra te sigue a todas partes. Ahora también en la pantalla de inicio.','Your shadow follows you everywhere. Now on the title screen, too.')],()=>{LLAWFX=null;gainPiwke([N('Donde estaba tu sombra, algo rojo brilla en el suelo...','Where your shadow stood, something red glints on the ground...')])})},5200)})}
function drawLlawReturn(c){// called from the shadow's own draw: fade (0-150), the wisp crossing to you (150-240), settling at your feet (240-310)
  const e=frame-LLAWFX.t0,ox=LLAWFX.sx*T+8-CAM.x,oy=LLAWFX.sy*T+14-CAM.y+VY,px=Math.round(P.fx*T+8-CAM.x),py=Math.round(P.fy*T+15-CAM.y+VY);
  if(e>=150&&e<240){const t=(e-150)/90,k=t*t*(3-2*t),x=ox+(px-ox)*k,y=oy+(py-oy)*k-Math.sin(k*Math.PI)*10;
    for(let i=0;i<12;i++){const tt=Math.max(0,k-i*.03),xx=ox+(px-ox)*tt,yy=oy+(py-oy)*tt-Math.sin(tt*Math.PI)*18;ell(c,xx,yy,6-i*.4,4.5-i*.3,'rgba(20,12,34,'+(.6-i*.045).toFixed(2)+')')}
    ell(c,x,y-Math.sin(k*Math.PI)*8,10,8,'rgba(150,120,230,.28)');ell(c,x,y-Math.sin(k*Math.PI)*8,6,5,'rgba(16,10,28,.9)');ell(c,x-1.5,y-1.5-Math.sin(k*Math.PI)*8,2,1.6,'rgba(200,180,255,.75)')}
  if(e>=240){const t=Math.min(1,(e-240)/70),src=ctCharSprite(heroLook(),P.dir||'down',0),sil=silhouette(src,'R'+heroLook()+(P.dir||'down'),'rgba(18,10,30,1)');
    // the shadow lies down on the floor behind you, long at first, then shortens to an ordinary shadow
    if(t<1){const r=4+t*16;c.strokeStyle='rgba(180,150,255,'+(.7*(1-t)).toFixed(2)+')';c.lineWidth=1.5;c.beginPath();c.ellipse(px,py,r,r*.45,0,0,6.283);c.stroke()}   // a ring of light where it lands
    c.save();c.globalAlpha=.85*(1-t*.5);c.translate(px,py);c.transform(1,0,-.9*(1-t)-.3,-.32-.25*(1-t),0,0);c.drawImage(sil,-sil.width/2,-sil.height);c.restore();
    if(t<1)for(let k=0;k<5;k++){const a=k*1.26+e/9;R(c,Math.round(px+Math.cos(a)*(9-t*6)),Math.round(py-2+Math.sin(a)*(4-t*2)),1,1,'rgba(190,170,250,'+(.7*(1-t)).toFixed(2)+')')}}}
/* ---------- drawing: the grey, the colour coming back, the crack and the shadow ---------- */
let NGOC=null;
function ngOverlay(c,cx,cy){
  if(!M||!M.ngoyun)return;
  const full=ngFull(CUR),anim=YWF&&YWF.id===CUR?frame-YWF.t:null;
  if(full&&(anim===null||anim>150))return;
  if(!NGOC||NGOC[0].width!==LW||NGOC[0].height!==LH)NGOC=mk(LW,LH);
  const [ov,o]=NGOC;o.globalCompositeOperation='source-over';o.clearRect(0,0,LW,LH);o.fillStyle='#808080';o.fillRect(0,VY,LW,VH);
  o.globalCompositeOperation='destination-out';
  const hole=(X,Y,r)=>{if(r<=1)return;const g=o.createRadialGradient(X,Y,r*.55,X,Y,r);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');o.fillStyle=g;o.beginPath();o.arc(X,Y,r,0,6.283);o.fill()};
  const RR=T*5.2;
  for(const k in (M.ngspots||{})){if(!ngDone(CUR,k))continue;const [x,y]=M.ngspots[k],t0=YWT[CUR+':'+k];
    const a=t0==null?1:Math.min(1,(frame-t0)/55),e2=1-Math.pow(1-a,3);hole(x*T+8-cx,y*T+8-cy+VY,RR*e2)}
  if(anim!==null&&anim>0)hole(YWF.x*T+8-cx,YWF.y*T+8-cy+VY,anim*7);
  hole(Math.round(P.fx*T+8-cx),Math.round(P.fy*T+4-cy+VY),15);   // you are the one thing here that keeps its colour
  c.save();c.globalCompositeOperation='saturation';c.drawImage(ov,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=.16;c.drawImage(ov,0,0);c.restore();
  for(const k in (M.ngspots||{}))if(!ngDone(CUR,k)&&M.signs&&M.signs[k]){const [x,y]=M.ngspots[k],X=x*T+8-cx,Y=y*T-cy+VY-3,al=(.55+.4*Math.sin(frame/14+x)).toFixed(2);
    OV.push(()=>ash('?',X,Y,al,11))}   // a soft glint over each stone that still has a letter missing
  if(!full){// loose letters drifting up like ash
    const LET=['a','e','i','o','u','ü','ng','tr','ch','ll','ñ','w','f','k','l','m','p','y'];
    for(let k=0;k<12;k++){const ph=((frame*.5+k*61)%240)/240,X=((k*97+Math.floor(k*k*13))%LW),Y=VY+VH-ph*VH*1.1;
      const mx=Math.floor((X+cx)/T),my=Math.floor((Y-VY+cy)/T);let lit=false;
      for(const q in (M.ngspots||{}))if(ngDone(CUR,q)){const [sx2,sy2]=M.ngspots[q];if(Math.hypot(sx2-mx,sy2-my)<4.5)lit=true}
      if(lit)continue;const al=(Math.sin(ph*Math.PI)*.55).toFixed(2),ch=LET[k%LET.length],xx=X+Math.sin(frame/40+k)*6;
      OV.push(()=>ash(ch,xx,Y,al,10))}}}
function ash(ch,x,y,al,size){// a soft letter, no outline: it should read as ash, not as a label
  ctx.font=size*2+'px Georgia,serif';ctx.textAlign='center';ctx.fillStyle='rgba(40,40,44,'+(al*.5).toFixed(2)+')';ctx.fillText(ch,x*2+1,y*2+1);
  ctx.fillStyle='rgba(236,236,240,'+al+')';ctx.fillText(ch,x*2,y*2);ctx.textAlign='left'}
function silhouette(src,key,col,rim){const k2='SIL'+key;if(ECACHE[k2])return ECACHE[k2];
  const [cv,c]=mk(src.width+2,src.height+2);
  if(rim){const [rc,rx]=mk(src.width,src.height);rx.drawImage(src,0,0);rx.globalCompositeOperation='source-atop';rx.fillStyle=rim;rx.fillRect(0,0,src.width,src.height);
    for(const [dx,dy] of [[0,1],[2,1],[1,0],[1,2]])c.drawImage(rc,dx,dy)}
  c.drawImage(src,1,1);c.globalCompositeOperation='source-atop';c.fillStyle=col;c.fillRect(1,1,src.width,src.height);
  return ECACHE[k2]=cv}
function llawEyes(c,src,ox,oy,sc){// the shadow keeps the whites of your eyes: find the near-white pixels in the head and light them
  const w=src.width,h=src.height,d=src.getContext('2d').getImageData(0,0,w,Math.round(h*.45)).data;
  c.fillStyle='#e8e2ff';
  for(let y=0;y<Math.round(h*.45);y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>200&&d[i]>215&&d[i+1]>215&&d[i+2]>215)c.fillRect(ox+x*sc,oy+y*sc,sc,sc)}}
function llawCanvas(size,fr){const key='LLAWB'+heroLook()+size+fr;if(ECACHE[key])return ECACHE[key];
  // the same sprite as the hero (facing left); enemies are drawn mirrored, so it faces you like a reflection
  const src=ctCharSpriteBig(heroLook(),'left',fr?1:0),sc=1.5,w=Math.round(src.width*sc),h=Math.round(src.height*sc);
  const sil=silhouette(src,'B'+heroLook()+fr,'rgba(18,10,30,.86)','#8a74c4');
  const [cv,c]=mk(w+16,h+12);
  for(const [r,al] of [[1,.09],[.75,.11],[.5,.13]]){c.fillStyle='rgba(110,90,170,'+al+')';c.beginPath();c.ellipse(cv.width/2,cv.height*.5,cv.width/2*r,cv.height/2*r,0,0,6.283);c.fill()}
  c.imageSmoothingEnabled=false;c.drawImage(sil,0,0,sil.width,sil.height,8,6,Math.round(sil.width*sc),Math.round(sil.height*sc));
  llawEyes(c,src,8+sc,6+sc,sc);
  return ECACHE[key]=cv}
function drawLlawMap(c,e,sx,sy){
  if(e.look==='llawcrack'){const X=sx+8,Y=sy+16,fl=Math.sin(frame/9)*.5+.5;
    ell(c,X,Y-1,6,2,'rgba(0,0,0,.25)');
    for(const [w,col] of [[5,'rgba(120,120,128,.35)'],[3,'rgba(200,200,206,.75)'],[1,'rgba(250,250,255,'+(.7+fl*.3).toFixed(2)+')']]){
      c.fillStyle=col;c.beginPath();c.moveTo(X,Y-26);for(let k=0;k<=6;k++){const yy=Y-26+k*4.2;c.lineTo(X+((k%2)?w:-w*.6)+Math.round(Math.sin(frame/13+k)*.6),yy)}
      for(let k=6;k>=0;k--){const yy=Y-26+k*4.2;c.lineTo(X+((k%2)?w*.4:-w)-1,yy)}c.closePath();c.fill()}
    for(let k=0;k<4;k++){const ph=((frame*.6+k*30)%120)/120;OV.push(()=>ash(['ng','ü','tr','ll'][k],X+Math.sin(ph*5+k)*8,Y-14-ph*22,(.75*(1-ph)).toFixed(2),9))}
    return}
  if(LLAWFX&&e.id==='yllaw'){const el=frame-LLAWFX.t0;drawLlawReturn(c);if(el>=150)return;c.save();c.globalAlpha=Math.max(0,1-el/150);}
  const src=ctCharSprite(heroLook(),e.dir||'down',0),sil=silhouette(src,'M'+heroLook()+(e.dir||'down'),'rgba(16,10,26,.9)','#6a5a9a');
  ell(c,sx+9,sy+15,7,2.4,'rgba(0,0,0,.35)');
  for(let k=0;k<3;k++){const ph=((frame+k*40)%120)/120;ell(c,sx+8+Math.sin(ph*6+k)*5,sy+6-ph*18,1.5+ph*2,(1.5+ph*2)*.7,'rgba(110,96,150,'+(.3*(1-ph)).toFixed(2)+')')}
  c.drawImage(sil,sx-2,sy+15-src.height);if(LLAWFX&&e.id==='yllaw')c.restore()}
// battle backdrop in the grey: drained of colour (the fighters keep theirs)
function ngBattleGrey(c){if(!B||!B.grey)return;c.save();c.globalCompositeOperation='saturation';c.fillStyle='#808080';c.fillRect(0,0,LW,LH);c.globalCompositeOperation='source-over';c.fillStyle='rgba(60,60,70,.18)';c.fillRect(0,0,LW,LH);c.restore()}

/* ---------- the title screen: once any save has its shadow back, a walker crosses the beach at sunset with a long shadow ---------- */
let KIMCHE;
function titleKimche(c,t){
  if(KIMCHE===undefined){KIMCHE=null;for(const n of [1,2,3]){const v=loadSave(n);if(v&&v.flags&&v.flags.llaw_won){KIMCHE=HEROES[v.hero]?v.hero:'llanka';break}}}
  if(!KIMCHE)return;
  const x=Math.round(((t*.18)%(LW+60))-30),fr=Math.floor(t/9)%4,sp=ctCharSprite(KIMCHE,'right',[0,1,0,2][fr]?fr:0),y=176;
  const sil=silhouette(sp,'T'+KIMCHE+fr,'rgba(30,20,40,1)');
  c.save();c.globalAlpha=.4;c.translate(x+1,y);c.transform(1,0,-2.2,-.32,0,0);c.drawImage(sil,-sil.width/2,-sil.height);c.restore();
  c.drawImage(sp,x-Math.round(sp.width/2),y-sp.height)}
