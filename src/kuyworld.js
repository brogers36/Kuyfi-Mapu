/* ============================================================
   KUYFI MAPU: the world (vertical slice: Pukem)
   The Game 1 maps are borrowed as placeholders (same tile grids,
   new people, snow, new exits) until Pukem's own maps are drawn.
   ============================================================ */
WXT.pukem=[['pire',6],['tromu',3],['kuruf',1]];
{const _wk=wxKey;wxKey=function(){if(M&&M.wxk&&!M.interior)return M.wxk;return _wk()}}
SONGSET.pukem=SONGSET.pewenche;
WARPS.pukem=[{m:'Kolokolo ñi lolo',es:'Entrada de la madriguera (la ruka vacía)',en:'Burrow entrance (the empty ruka)',to:['k_ruka2',7,5]},{m:'Pukem lof',es:'El lof de los antiguos',en:'The ancestors\' lof',to:['k_lof',14,6]}];
const KYK1={q:L('Konew','Pukem mew küpakey; lig ngey, wütreley. Chem am ta tatey?','Suele venir en invierno; es blanca, está fría. ¿Qué será?','It usually comes in winter; it is white, it is cold. What could it be?'),
  o:['pire','kütral','antü'],a:'pire',reward:'piwke'};
STONES.ke={intro:[L('Kura','Kiñe wirintungechi kura pi: «Chem dungu rumel femkey?»','Una piedra tallada pregunta: «¿Qué es lo que pasa siempre?»','A carved stone asks: "What is it that always happens?"'),
    N('-ke- dice lo que pasa siempre, la costumbre: küpakey «suele venir».','-ke- says what always happens, the habit: küpakey "it usually comes".')],
  qs:[{q:N('Pukem mew, pire ___ (suele venir la nieve).','In winter, the snow ___ (usually comes).'),o:['küpay','küpakey','küpaken'],a:'küpakey'},
      {q:N('Pun mew iñche umawtu___ (de noche suelo dormir).','At night I ___ sleep (I usually sleep).'),o:['umawtukey','umawtukeymi','umawtuken'],a:'umawtuken'},
      {q:N('Eymi pukem mew wütre___ (en invierno sueles tener frío).','In winter you usually ___ cold.'),o:['wütreken','wütrekey','wütrekeymi'],a:'wütrekeymi'}]};
STONES.yu={intro:[L('Kura','Kiñe wirintungechi kura pi: «Epu che ñi dungun.»','Una piedra tallada dice: «La palabra de dos personas.»','A carved stone says: "The word of two people."'),
    N('-yu es «tú y yo, los dos». amuyu: «vamos, los dos».','-yu is "you and I, the two of us". amuyu: "let\'s go, the two of us".')],
  qs:[{q:N('Liwen y tú quieren cantar juntos: ¡ülkantu___!','Liwen and you want to sing together: ülkantu___!'),o:['ülkantumu','ülkantunge','ülkantuyu'],a:'ülkantuyu'},
      {q:N('¿Cuál es «busquemos, los dos»?','Which one is "let\'s look for it, the two of us"?'),o:['kintuiñ','kintuyu','kintumu'],a:'kintuyu'},
      {q:N('-mu le habla a...','-mu speaks to...'),o:['tú y yo','dos personas (ustedes dos)','todos nosotros'],a:'dos personas (ustedes dos)'}]};
function kyMap(id,def){def.region=def.region||'pukem';def.rows=KYROWS[id];def.w=def.rows[0].length;def.h=def.rows.length;MAPS[id]=def}
const KYOUT={floor:'.',bg:'mount',pal:'pewenche',wxk:'pukem',trees:'pewen'};
kyMap('k_rupu',Object.assign({},MAPS.rupu,{name:'Kuyfi rüpü',g:{es:'El camino en la niebla',en:'The road in the fog'},fog:1,song:'pew',
  edges:{right:{to:'k_lof',x:1,y:8},left:{need:99,reqMsg:[N('La niebla se cierra detrás de ti. Por ahora no hay camino de vuelta.','The fog closes behind you. For now there is no way back.')]}},
  ents:[{kind:'enemy',x:12,y:4,party:['laftrache']},{kind:'enemy',x:20,y:7,party:['pire','laftrache']},{kind:'enemy',x:16,y:10,party:['chonchon']},{kind:'enemy',x:25,y:3,party:['pire','pire']}]}));
kyMap('k_lof',Object.assign({},KYOUT,{name:'Pukem lof',g:{es:'El lof de los antiguos, en pukem (invierno)',en:'The ancestors\' lof, in pukem (winter)'},song:'pewLof',
  doors:{'3,3':{to:'k_ruka1',x:6,y:7},'9,3':{to:'k_ruka3',x:6,y:7},'27,11':{to:'k_ruka2',x:6,y:7}},
  edges:{left:{to:'k_rupu',x:28,y:6},up:{to:'k_mawida',x:16,y:13,req:'liwen',reqMsg:[N('Liwen te llama desde su ruka. Mejor habla con ella antes de ir al monte.','Liwen calls to you from her ruka. Better talk to her before going into the forest.')]},right:{to:'k_menoko',x:1,y:6,req:'liwen',reqMsg:[N('Liwen te llama desde su ruka. Mejor habla con ella primero.','Liwen calls to you from her ruka. Better talk to her first.')]}},
  ents:[
   {id:'ky_liwen',kind:'npc',look:'gatherer',fem:1,x:4,y:5,dir:'down',fixed:1,req:'ky_arrive',talk:()=>kyLiwenTalk(),bub:['Amuyu!','Mari mari!']},
   {id:'ky_kimche',kind:'npc',look:'kuku',fem:1,x:13,y:5,dir:'right',fixed:1,req:'ky_arrive',talk:()=>kyKimcheTalk(),bub:['Küpange...','Pukem mew...']},
   {id:'ky_weaver',kind:'npc',look:'weaver',fem:1,x:6,y:4,dir:'up',act:'weave',fixed:1,talk:()=>kyWeaverTalk(),bub:['Ngürekalen.']},
   {id:'ky_cook',kind:'npc',look:'cook',fem:1,x:21,y:10,act:'cook',fixed:1,talk:()=>kyCookTalk(),bub:['Iyael!']},
   {id:'ky_lonko',kind:'npc',look:'lonko',x:25,y:5,path:[[25,5],[29,5]],pause:160,talk:()=>kyLonkoTalk(),bub:['Mari mari!']},
   {id:'ky_kona',kind:'npc',look:'kona',x:8,y:9,path:[[8,9],[13,9]],pause:120,talk:()=>kyKonaTalk(),bub:['Wütreley!']},
   {id:'ky_child',kind:'npc',look:'child',x:18,y:12,path:[[18,12],[23,12]],pause:90,talk:()=>kyChildTalk(),bub:['Pire!','Awkantuyu!']}]}));
kyMap('k_mawida',Object.assign({},KYOUT,{name:'Pire mawida',g:{es:'El monte nevado',en:'The snowy forest'},song:'pew',
  edges:{down:{to:'k_lof',x:16,y:1},right:{to:'k_winkul',x:1,y:7}},chests:{'4,6':'lawen1','28,2':'piwke'},konew:{'28,4':KYK1},
  ents:[{kind:'enemy',x:7,y:6,party:['pire']},{kind:'enemy',x:19,y:5,party:['laftrache','pire']},{kind:'enemy',x:12,y:8,party:['chonchon','chonchon']},
    {kind:'enemy',x:24,y:8,party:['pire','pire']},{kind:'enemy',x:6,y:13,party:['anchi','laftrache']}]}));
kyMap('k_menoko',Object.assign({},KYOUT,{name:'Pukem menoko',g:{es:'El humedal helado',en:'The frozen wetland'},song:'pew',
  edges:{left:{to:'k_lof',x:32,y:8},up:{to:'k_winkul',x:26,y:13}},chests:{'16,2':'rune'},stones:{'12,5':'ke'},
  ents:[{kind:'enemy',x:9,y:5,party:['chonchon']},{kind:'enemy',x:20,y:8,party:['pire','anchi']},{kind:'enemy',x:29,y:4,party:['pire','pire','pire']},{kind:'enemy',x:5,y:7,party:['laftrache','laftrache']}]}));
kyMap('k_winkul',Object.assign({},KYOUT,{name:'Winkul',g:{es:'La loma',en:'The hill'},song:'pew',
  edges:{left:{to:'k_mawida',x:30,y:7},down:{to:'k_menoko',x:26,y:1}},chests:{'11,2':'piwke'},
  ents:[{kind:'enemy',x:8,y:5,party:['pire','chonchon']},{kind:'enemy',x:22,y:9,party:['anchi','anchi']},{kind:'enemy',x:5,y:12,party:['pire','pire']}]}));
kyMap('k_ruka1',Object.assign({},MAPS.l_ruka1,{region:'pukem',name:'Liwen ñi ruka',g:{es:'La ruka de Liwen',en:'Liwen\'s ruka'},chests:{},edges:{down:{to:'k_lof',x:3,y:4}},ents:[]}));
kyMap('k_ruka3',Object.assign({},MAPS.l_trawun,{region:'pukem',name:'Kimche ñi ruka',g:{es:'La ruka de la kuku sabia',en:'The wise kuku\'s ruka'},chests:{},signs:{},edges:{down:{to:'k_lof',x:9,y:4}},ents:[]}));
kyMap('k_ruka2',Object.assign({},MAPS.l_ruka2,{region:'pukem',name:'Ñamkülechi ruka',g:{es:'La ruka vacía',en:'The empty ruka'},
  edges:{down:{to:'k_lof',x:27,y:12}},stairs:{to:'kd1',x:1,y:6,req:'kimke',reqMsg:[N('Un hoyo en el piso baja a la oscuridad. Se oye un chillido. Mejor hablar primero con la kuku sabia.','A hole in the floor goes down into the dark. A squeak comes from below. Better speak with the wise kuku first.')]},ents:[]}));
const KYD={floor:'_',bg:'cave',song:'pewCave',pal:'wilcave',dungeon:1};
kyMap('kd1',Object.assign({},KYD,{name:'Kolokolo ñi lolo · 1',g:{es:'La madriguera del Kolokolo (piso 1)',en:'The Kolokolo\'s burrow (floor 1)'},
  edges:{left:{to:'k_ruka2',x:7,y:5}},stairs:{to:'kd2',x:1,y:6},chests:{'2,8':'lawen1','20,1':'piwke'},konew:{'7,3':K1},
  pz:{kind:'J',tiles:{'17,4':{lab:'pukem',col:'#e8f0ff',i:0},'20,4':{lab:'pewün',col:'#60d070',i:1},'14,4':{lab:'walüng',col:'#f0b030',i:2}}},
  signs:{'18,7':[L('Kura','Kiñe wirintungechi kura pi: «Pukem, pewün, walüng.»','Una piedra tallada: «invierno, primavera, verano». El año camina en orden. Tres braseros esperan su fuego.','A carved stone: «winter, spring, summer». The year walks in order. Three braziers wait for their fire.')]},
  ents:[{kind:'enemy',x:3,y:2,party:['laftrache','laftrache']},{kind:'enemy',x:4,y:8,party:['anchi']},{kind:'enemy',x:16,y:2,party:['chonchon','laftrache']},{kind:'enemy',x:16,y:7,party:['pire','chonchon']}]}));
kyMap('kd2',Object.assign({},KYD,{name:'Kolokolo ñi lolo · 2',g:{es:'La madriguera del Kolokolo (piso 2)',en:'The Kolokolo\'s burrow (floor 2)'},
  edges:{left:{to:'kd1',x:19,y:9}},stairs:{to:'kd3',x:1,y:6},chests:{'13,5':'lawen1'},konew:{'17,3':K2},stones:{'12,2':'ke'},
  ents:[{kind:'enemy',x:3,y:5,party:['laftrache','laftrache','laftrache']},{kind:'enemy',x:12,y:2,party:['anchi','chonchon']},
    {id:'kymini2',kind:'enemy',x:16,y:3,party:['nidol','pire'],fixed:1,mini:1,flag:'kymini2',
     pre:[N('Un laftrache grande, el ñidol, cuida el paso con un pire wekufü. Liwen te mira: «Trawüyu!»','A big laftrache, the ñidol, guards the way with a pire wekufü. Liwen looks at you: "Trawüyu!"')]}]}));
kyMap('kd3',Object.assign({},KYD,{name:'Kolokolo ñi lolo · 3',g:{es:'La madriguera del Kolokolo (piso 3)',en:'The Kolokolo\'s burrow (floor 3)'},
  pz:{kind:'N',tiles:{'4,1':{lab:'pukem',i:0},'8,4':{lab:'pewün',i:1},'13,5':{lab:'walüng',i:2}},hint:N('Pista: otra vez el año en orden: pukem, pewün, walüng.','Hint: the year in order again: pukem, pewün, walüng.')},
  edges:{left:{to:'kd2',x:19,y:3}},stairs:{to:'kd_den',x:8,y:9},stones:{},
  ents:[{kind:'enemy',x:2,y:5,party:['laftrache','anchi']},
    {id:'kymini3',kind:'enemy',x:19,y:3,party:['chonchon','chonchon','pire'],fixed:1,mini:1,flag:'kymini3',
     pre:[N('Tres sombras cuidan la bajada a la cueva del Kolokolo.','Three shadows guard the way down to the Kolokolo\'s den.')]}]}));
kyMap('kd_den',Object.assign({},KYD,{name:'Kolokolo ñi ruka',g:{es:'La cueva del Kolokolo',en:'The Kolokolo\'s den'},
  stairs:{to:'kd3',x:19,y:4},
  ents:[{id:'kolo',kind:'enemy',x:8,y:4,party:['kolokolo'],fixed:1,boss:1,flag:'ky_kolo',
    pre:[N('En el fondo de la madriguera algo chilla, bajito. Dos ojitos rojos brillan junto a un montón de lana robada.','At the bottom of the burrow something squeaks, softly. Two little red eyes glint beside a heap of stolen wool.'),
         L('Liwen','Kolokolo! Kintuyu!','¡El Kolokolo! ¡Busquémoslo, tú y yo!','The Kolokolo! Let\'s look for it, you and I!')],
    post:()=>kyKoloWon()}]}));
MAPS.k_menoko.stones=MAPS.k_menoko.stones;   // the -ke- stone outside; the -yu- stone waits below
MAPS.kd2.stones={'12,2':'yu'};

/* ---------- the opening: through the fog ---------- */
function kyOpening(){
  $('title').style.display='none';mode='map';loadMap('k_rupu',2,6,true);playSong('epew');
  const n=nm();
  say([N('Pasó un tiempo desde que cayó Ti Fütra Ngoyman. En el lof se vuelve a oír mapudungun.','Some time has passed since Ti Fütra Ngoyman fell. Mapudungun is heard in the lof again.'),
    L('Kuku','Mari mari, '+n+'.','Hola, '+n+'.','Hello, '+n+'.'),
    N('Tu kuku abre la chillka junto al kütral. Hay páginas en blanco. «Venciste al olvido», te dice, «pero las palabras que se perdieron antes no vuelven peleando. Hay que ir a buscarlas.»','Your kuku opens the chillka by the kütral. Some pages are blank. "You defeated the forgetting," she tells you, "but the words lost before it fell do not come back by fighting. They have to be sought."'),
    N('Esa noche, en la niebla del borde del lof, una voz repite tus propias palabras... mal. «Amutu-mu... küpa-chi... -yu... -mu...» Las terminaciones cambiadas, los pedazos sueltos.','That night, in the fog at the edge of the lof, a voice repeats your own words... wrong. "Amutu-mu... küpa-chi... -yu... -mu..." The endings swapped, the pieces loose.'),
    N('Es un eco del Ngoyman, que llama desde un tiempo donde no fue vencido. Lo sigues.','It is an echo of the Ngoyman, calling from a time where it was not defeated. You follow it.'),
    N('Cuando la niebla se abre, el camino sigue ahí... pero no hay cercos, ni caminos anchos. Las ruka son más viejas. Hace frío: es pukem, el invierno.','When the fog opens, the road is still there... but there are no fences, no wide roads. The ruka are older. It is cold: it is pukem, winter.'),
    N('Camina hacia el este, hacia el humo de un lof.','Walk east, toward the smoke of a lof.')]);
  S.flags.ky_open=1;persist()}
/* the intro film plays once at the start of a new game (skippable), then the opening */
function kyPlayFilm(src,done){
  let fin=false;const end=()=>{if(fin)return;fin=true;try{v.pause()}catch(e){}ov.remove();mode='map';done()};
  const ov=document.createElement('div');ov.id='kyfilm';ov.style.cssText='position:fixed;inset:0;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center';
  const v=document.createElement('video');v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto';v.style.cssText='width:100%;height:100%;object-fit:contain;background:#000';
  for(const u of [src,'../www/'+src]){const so=document.createElement('source');so.src=u;so.type='video/mp4';v.appendChild(so)}
  v.lastElementChild.addEventListener('error',end);v.addEventListener('ended',end);
  const sk=document.createElement('button');sk.textContent=((S&&S.gloss==='en')||LANG==='en')?'Skip ▶':'Saltar ▶';
  sk.style.cssText='position:absolute;right:14px;bottom:14px;padding:8px 14px;font:600 14px sans-serif;color:#f3ead2;background:rgba(0,0,0,.55);border:1px solid rgba(243,234,210,.5);border-radius:6px;opacity:.75';
  sk.onclick=e=>{e.stopPropagation();end()};
  ov.appendChild(v);ov.appendChild(sk);document.body.appendChild(ov);$('title').style.display='none';
  if(typeof playSong==='function')playSong(null);if(typeof stopAmb==='function')stopAmb();mode='credits';
  const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{v.muted=true;v.play().catch(end)})}
startCut=function(){kyPlayFilm('intro.mp4',kyOpening)};

/* arriving at the kuyfi lof for the first time: Liwen */
{const _lm=loadMap;loadMap=function(id){const r=_lm.apply(this,arguments);
  if(id==='k_lof'&&!S.flags.ky_arrive)setTimeout(()=>{if(!active)kyArrival()},700);return r}}
function kyArrival(){const n=nm();
  say([N('Una muchacha que cuida el fuego de una ruka te ve llegar de la niebla y se queda mirándote.','A girl tending the fire of a ruka sees you come out of the fog and stares at you.'),
    L('Liwen','Mari mari! Iney pingeymi?','¡Hola! ¿Cómo te llamas?','Hello! What is your name?'),
    L(n,'Iñche '+n+' pingen.','Me llamo '+n+'.','My name is '+n+'.'),
    L('Liwen','Iñche Liwen pingen.','Yo me llamo Liwen.','My name is Liwen.'),
    N('Hablas raro, te dice con los ojos. Los mayores del lof se acercan, te escuchan, y conversan entre ellos. Al final la más vieja decide: quien habla tan poco tiene que quedarse un año entero, y escuchar.','You speak strangely, her eyes tell you. The elders of the lof come close, listen to you, and talk among themselves. In the end the oldest decides: someone who speaks so little must stay a whole year, and listen.')],
    ()=>{S.flags.ky_arrive=1;persist();loadMap('k_lof',P.x,P.y,true)})}

/* ---------- the people of the kuyfi lof ---------- */
function kyLiwenTalk(){const n=nm(),en=S.gloss==='en';
  if(!S.flags.liwen){S.flags.liwen=1;persist();sfx('lvl');
    return say([L('Liwen','Kellueyu.','Te ayudo.','I will help you.'),
      L('Liwen','Amuyu!','¡Vamos, tú y yo!','Let\'s go, you and I!'),
      N('Amu-yu: «vamos, los dos». En Kewün Newen aprendiste a darles órdenes a los wekufü (-nge, -mu, -mün). Aquí aprenderás a hablar CON otros: -yu es «tú y yo».','Amu-yu: "let\'s go, the two of us". In Kewün Newen you learned to give orders to the wekufü (-nge, -mu, -mün). Here you will learn to speak WITH others: -yu is "you and I".'),
      Object.assign(L('','Liwen kellueyu!','Liwen se une a ti. En las peleas aparece «Iñchiw»: eligen juntos un verbo y le ponen -yu.','Liwen joins you. In battle «Iñchiw» appears: you choose a verb together and add -yu.'),{fx:()=>sfx('lvl')}),
      L('Liwen','Kimche kuku mew amuyu.','Vamos donde la kuku sabia.','Let\'s go to the wise kuku.')])}
  if(!S.flags.ky_kolo)return say([L('Liwen','Kolokolo... pun mew küpakey.','El Kolokolo... viene de noche.','The Kolokolo... it comes at night.'),N('Liwen mira hacia la ruka vacía, abajo a la izquierda.','Liwen glances at the empty ruka, down on the left.')]);
  say([L('Liwen','Chaltu may, '+n+'!','¡Gracias, '+n+'!','Thank you, '+n+'!')])}
function kyKimcheTalk(){
  if(!S.flags.liwen)return say([L('Kuku','Mari mari, weche.','Hola, joven.','Hello, young one.'),N('La kuku sabia te mira de arriba abajo y apunta con la barbilla hacia Liwen.','The wise kuku looks you up and down and points her chin toward Liwen.')]);
  if(!S.flags.kimke){S.flags.kimke=1;persist();sfx('lvl');
    return say([L('Kuku','Pukem mew, pire küpakey.','En invierno suele venir la nieve.','In winter, the snow usually comes.'),
      N('-ke- es lo que pasa siempre, la costumbre. Küpa-ke-y: «suele venir». Quien sabe lo que el otro hace siempre, sabe lo que va a hacer.','-ke- is what always happens, the habit. Küpa-ke-y: "it usually comes". Whoever knows what the other always does knows what it will do.'),
      Object.assign(L('','Kimün!','En las peleas aparece «Kimün»: dices lo que un wekufü hace siempre (…key) y le ves venir los golpes.','In battle «Kimün» appears: you say what a wekufü always does (…key) and you see its blows coming.'),{fx:()=>sfx('lvl')}),
      L('Kuku','Kolokolo pun mew küpakey.','El Kolokolo suele venir de noche.','The Kolokolo usually comes at night.'),
      N('«Se mete en esa ruka vacía y les roba el aliento a los que duermen. Búsquenlo los dos.»','"It creeps into that empty ruka and steals the breath of those who sleep. Seek it out, the two of you."')])}
  say([L('Kuku','Pukem mew, pire küpakey.','En invierno suele venir la nieve.','In winter, the snow usually comes.')])}
function kyWeaverTalk(){say([L('Ngürekafe','Ngürekalen.','Estoy tejiendo.','I am weaving.'),N('Teje junto al fuego; en invierno se teje mucho.','She weaves by the fire; in winter there is much weaving.')])}
function kyCookTalk(){say([L('Papay','Iyael!','¡Comida!','Food!'),N('Revuelve una olla de mültrün y poñü.','She stirs a pot of mültrün and poñü.')])}
function kyLonkoTalk(){say([L('Lonko','Mari mari.','Hola.','Hello.'),N('El lonko te saluda serio. Todavía no sabe qué hacer contigo.','The lonko greets you gravely. He does not yet know what to make of you.')])}
function kyKonaTalk(){say([L('Weche','Wütreley!','¡Hace frío!','It is cold!'),N('Se frota las manos y sigue caminando.','He rubs his hands and keeps walking.')])}
function kyChildTalk(){say([L('Pichi che','Awkantuyu!','¡Juguemos, tú y yo!','Let\'s play, you and I!'),N('Un niño te tira nieve y se ríe. Awkantu-yu: «juguemos, los dos».','A child throws snow at you and laughs. Awkantu-yu: "let\'s play, the two of us".')])}
function kyKoloWon(){sfx('lvl');S.flags.ky_pukem_done=1;persist();
  say([N('El Kolokolo chilla una última vez y se escurre por un hoyo de la roca. Deja atrás la lana robada, y el aire de la madriguera se vuelve tibio.','The Kolokolo squeaks one last time and slips away through a crack in the rock. It leaves the stolen wool behind, and the air of the burrow grows warm.'),
    L('Liwen','Chaltu may!','¡Gracias!','Thank you!'),
    N('Liwen recoge la lana para las tejedoras. Esa noche, en el lof, todos duermen tranquilos.','Liwen gathers the wool for the weavers. That night, in the lof, everyone sleeps in peace.')],
    ()=>{loadMap('k_lof',14,6,true);setTimeout(()=>say([
      L('Kuku','Pukem mew, pire küpakey. Welu pewün ka küpakey.','En invierno suele venir la nieve. Pero la primavera también suele llegar.','In winter the snow usually comes. But spring usually comes too.'),
      N('La kuku sabia mira hacia el este, donde la nieve empieza a ceder.','The wise kuku looks east, where the snow is starting to give way.'),
      N('(Fin de Pukem. Pewün, la primavera, se está construyendo.)','(End of Pukem. Pewün, spring, is being built.)')]),500)})}
