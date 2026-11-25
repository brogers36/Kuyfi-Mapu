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
const KYOUT={floor:'.',bg:'mount',pal:'pewenche',wxk:'pukem',trees:'pewen',era:'past'};
RFLAG.pukem='ky_pukem_done';
kyMap('k_lof',Object.assign({},KYOUT,{name:'Pukem lof',g:{es:'El lof de los antiguos, en pukem (invierno)',en:'The ancestors\' lof, in pukem (winter)'},song:'pewLof',
  doors:{'3,3':{to:'k_ruka1',x:6,y:7},'9,3':{to:'k_ruka3',x:6,y:7},'27,11':{to:'k_ruka2',x:6,y:7}},
  edges:{left:{need:99,reqMsg:[N('Hacia el oeste solo hay niebla. Por ahí llegaste; por ahí no se vuelve.','To the west there is only fog. That is how you came; that is not the way back.')]},up:{to:'k_mawida',x:16,y:13,req:'liwen',reqMsg:[N('Liwen te llama desde su ruka. Mejor habla con ella antes de ir al monte.','Liwen calls to you from her ruka. Better talk to her before going into the forest.')]},right:{to:'k_menoko',x:1,y:6,req:'liwen',reqMsg:[N('Liwen te llama desde su ruka. Mejor habla con ella primero.','Liwen calls to you from her ruka. Better talk to her first.')]}},
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
kyMap('k_ruka1',Object.assign({},MAPS.l_ruka1,{region:'pukem',era:'past',name:'Liwen ñi ruka',g:{es:'La ruka de Liwen',en:'Liwen\'s ruka'},chests:{},edges:{down:{to:'k_lof',x:3,y:4}},ents:[]}));
kyMap('k_ruka3',Object.assign({},MAPS.l_trawun,{region:'pukem',era:'past',name:'Kimche ñi ruka',g:{es:'La ruka de la papay sabia',en:'The wise papay\'s ruka'},chests:{},signs:{},edges:{down:{to:'k_lof',x:9,y:4}},ents:[]}));
kyMap('k_ruka2',Object.assign({},MAPS.l_ruka2,{region:'pukem',era:'past',name:'Ñamkülechi ruka',g:{es:'La ruka vacía',en:'The empty ruka'},
  edges:{down:{to:'k_lof',x:27,y:12}},stairs:{to:'kd1',x:1,y:6,req:'kimke',reqMsg:[N('Un hoyo en el piso baja a la oscuridad. Se oye un chillido. Mejor hablar primero con la papay sabia.','A hole in the floor goes down into the dark. A squeak comes from below. Better speak with the wise papay first.')]},ents:[]}));
const KYD={floor:'_',bg:'cave',song:'pewCave',pal:'wilcave',dungeon:1,era:'past'};
kyMap('kd1',Object.assign({},KYD,{name:'Kolokolo ñi lolo · 1',g:{es:'La madriguera del Kolokolo (piso 1)',en:'The Kolokolo\'s burrow (floor 1)'},
  edges:{left:{to:'k_ruka2',x:7,y:5}},stairs:{to:'kd2',x:1,y:6},chests:{'8,9':'lawen1','20,1':'piwke'},
  pz:{kind:'J',tiles:{'14,2':{lab:'pukem',col:'#e8f0ff',i:0},'17,2':{lab:'pewün',col:'#60d070',i:1},'11,2':{lab:'walüng',col:'#f0b030',i:2}}},
  signs:{'13,8':[L('Kura','Kiñe wirintungechi kura pi: «Pukem, pewün, walüng.»','Una piedra tallada: «invierno, primavera, verano». El año camina en orden. Tres braseros esperan su fuego.','A carved stone: «winter, spring, summer». The year walks in order. Three braziers wait for their fire.')]},
  ents:[{kind:'enemy',x:4,y:3,party:['laftrache','laftrache']},{kind:'enemy',x:12,y:6,party:['anchi','pire']},{kind:'enemy',x:16,y:8,party:['chonchon','laftrache']}]}));
kyMap('kd2',Object.assign({},KYD,{name:'Kolokolo ñi lolo · 2',g:{es:'La madriguera del Kolokolo (piso 2)',en:'The Kolokolo\'s burrow (floor 2)'},
  edges:{left:{to:'kd1',x:19,y:9}},stairs:{to:'kd3',x:1,y:6},chests:{'13,2':'lawen1','19,1':'rune','16,9':'piwke'},konew:{'16,8':K2},stones:{'14,5':'yu'},
  signs:{},
  ents:[{kind:'enemy',x:5,y:2,party:['laftrache','laftrache','laftrache']},{kind:'enemy',x:12,y:8,party:['anchi','chonchon']},
    {id:'kymini2',kind:'enemy',x:16,y:3,party:['nidol','pire'],fixed:1,mini:1,flag:'kymini2',
     pre:[N('Un laftrache grande, el ñidol, cuida el paso con un pire wekufü. Liwen te mira: «Trawüyu!»','A big laftrache, the ñidol, guards the way with a pire wekufü. Liwen looks at you: "Trawüyu!"')]}]}));
kyMap('kd3',Object.assign({},KYD,{name:'Kolokolo ñi lolo · 3',g:{es:'La madriguera del Kolokolo (piso 3)',en:'The Kolokolo\'s burrow (floor 3)'},
  pz:{kind:'N',tiles:{'17,2':{lab:'pukem',i:0},'3,2':{lab:'pewün',i:1},'10,6':{lab:'walüng',i:2}},hint:N('Pista: otra vez el año en orden: pukem, pewün, walüng.','Hint: the year in order again: pukem, pewün, walüng.')},
  edges:{left:{to:'kd2',x:19,y:3}},stairs:{to:'kd_den',x:8,y:9},chests:{'11,1':'lawen1'},
  ents:[{kind:'enemy',x:4,y:5,party:['laftrache','anchi']},{kind:'enemy',x:11,y:3,party:['pire','pire']},
    {id:'kymini3',kind:'enemy',x:19,y:6,party:['chonchon','chonchon','pire'],fixed:1,mini:1,flag:'kymini3',
     pre:[N('Tres sombras cuidan la bajada a la cueva del Kolokolo.','Three shadows guard the way down to the Kolokolo\'s den.')]}]}));
kyMap('kd_den',Object.assign({},KYD,{name:'Kolokolo ñi ruka',g:{es:'La cueva del Kolokolo',en:'The Kolokolo\'s den'},
  stairs:{to:'kd3',x:19,y:6},
  ents:[{id:'kolo',kind:'enemy',x:8,y:4,party:['kolokolo'],fixed:1,boss:1,flag:'ky_kolo',
    pre:[N('En el fondo de la madriguera algo chilla, bajito. Dos ojitos rojos brillan junto a un montón de lana robada.','At the bottom of the burrow something squeaks, softly. Two little red eyes glint beside a heap of stolen wool.'),
         L('Liwen','Kolokolo! Kintuyu!','¡El Kolokolo! ¡Busquémoslo, tú y yo!','The Kolokolo! Let\'s look for it, you and I!')],
    post:()=>kyKoloWon()}]}));

/* ---------- the opening: the present-day lof (Game 1's, seen this once), your kuku and cheche, the voice ---------- */
function kyOpening(){
  $('title').style.display='none';mode='map';S.wtime=Math.round(.8*43200);
  loadMap('lof',17,7,true);P.dir='right';
  ents=ents.filter(e=>e.kind!=='enemy');
  ents.push({id:'ky_kuku0',kind:'npc',look:'kuku',fem:1,x:19,y:7,fx:19,fy:7,ox:19,oy:7,dir:'left',fixed:1,wait:9999,cd:9999,pi:0,bt:0,talk:()=>0});
  ents.push({id:'ky_cheche0',kind:'npc',look:'elder',x:18,y:6,fx:18,fy:6,ox:18,oy:6,dir:'down',fixed:1,wait:9999,cd:9999,pi:0,bt:0,talk:()=>0});
  playSong('epew');const n=nm();
  say([N('Pasó un tiempo desde que cayó Ti Fütra Ngoyman. En el lof se vuelve a oír mapudungun.','Some time has passed since Ti Fütra Ngoyman fell. Mapudungun is heard in the lof again.'),
    L('Kuku','Mari mari, '+n+'.','Hola, '+n+'.','Hello, '+n+'.'),
    L('Cheche','Mari mari, '+n+'.','Hola, '+n+'.','Hello, '+n+'.'),
    N('Tu kuku y tu cheche están junto al kütral. La kuku tararea una canción vieja, una que nunca le terminas de entender.','Your kuku and your cheche sit by the kütral. Your kuku hums an old song, one whose words you never quite catch.'),
    N('Tu cheche abre la chillka. Hay páginas en blanco. «Venciste al olvido», te dice, «pero las palabras que se perdieron antes no vuelven peleando. Esas hay que ir a buscarlas a donde todavía viven.»','Your cheche opens the chillka. Some pages are blank. "You defeated the forgetting," he tells you, "but the words lost before it fell do not come back by fighting. Those have to be sought where they still live."'),
    N('Entonces, desde la niebla del borde del lof, una voz repite tus propias palabras... mal. «Amutu-mu... küpa-chi... -yu... -mu...» Las terminaciones cambiadas, los pedazos sueltos.','Then, from the fog at the edge of the lof, a voice repeats your own words... wrong. "Amutu-mu... küpa-chi... -yu... -mu..." The endings swapped, the pieces loose.'),
    N('No es un eco: es una voz que se las lleva. A tu kuku se le escapan las palabras a mitad de la canción.','It is not an echo: it is a voice that carries them off. The words slip from your kuku halfway through her song.'),
    Object.assign(N('La niebla se cierra sobre el kütral. Todo se vuelve blanco.','The fog closes over the kütral. Everything turns white.'),{fx:()=>sfx('cast')})],
    ()=>{S.wtime=0;loadMap('k_lof',2,8,true);P.dir='right'});
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
  say([N('Despiertas en la nieve, junto a un lof que no conoces. No hay cercos ni caminos anchos; las ruka son más viejas. Una muchacha que cuida el fuego se acerca... tarareando la misma canción que tu kuku.','You wake in the snow beside a lof you do not know. There are no fences, no wide roads; the ruka are older. A girl tending a fire comes over... humming the same song as your kuku.'),
    L('Liwen','Mari mari! Iney pingeymi?','¡Hola! ¿Cómo te llamas?','Hello! What is your name?'),
    L(n,'Iñche '+n+' pingen.','Me llamo '+n+'.','My name is '+n+'.'),
    L('Liwen','Iñche Liwen pingen.','Yo me llamo Liwen.','My name is Liwen.'),
    N('Hablas raro, te dicen sus ojos. Los mayores del lof se acercan, te escuchan y conversan entre ellos. Al final la más vieja decide: quien habla tan poco tiene que quedarse un año entero, y escuchar.','You speak strangely, her eyes tell you. The elders of the lof come close, listen to you, and talk among themselves. In the end the oldest decides: someone who speaks so little must stay a whole year, and listen.'),
    N('Liwen. Nunca supiste cómo se llamaba tu kuku de joven.','Liwen. You never knew what your kuku was called when she was young.')],
    ()=>{S.flags.ky_arrive=1;persist();loadMap('k_lof',P.x,P.y,true)})}

/* ---------- the people of the kuyfi lof ---------- */
function kyLiwenTalk(){const n=nm(),en=S.gloss==='en';
  if(!S.flags.liwen){S.flags.liwen=1;persist();sfx('lvl');
    return say([L('Liwen','Kellueyu.','Te ayudo.','I will help you.'),
      L('Liwen','Amuyu!','¡Vamos, tú y yo!','Let\'s go, you and I!'),
      N('Amu-yu: «vamos, los dos». En Kewün Newen aprendiste a darles órdenes a los wekufü (-nge, -mu, -mün). Aquí aprenderás a hablar CON otros: -yu es «tú y yo».','Amu-yu: "let\'s go, the two of us". In Kewün Newen you learned to give orders to the wekufü (-nge, -mu, -mün). Here you will learn to speak WITH others: -yu is "you and I".'),
      Object.assign(L('','Liwen kellueyu!','Liwen se une a ti. En las peleas aparece «Iñchiw»: eligen juntos un verbo y le ponen -yu.','Liwen joins you. In battle «Iñchiw» appears: you choose a verb together and add -yu.'),{fx:()=>sfx('lvl')}),
      L('Liwen','Kimche kuku mew amuyu.','Vamos donde la papay sabia.','Let\'s go to the wise papay.')])}
  if(!S.flags.ky_kolo)return say([L('Liwen','Kolokolo... pun mew küpakey.','El Kolokolo... viene de noche.','The Kolokolo... it comes at night.'),N('Liwen mira hacia la ruka vacía, abajo a la izquierda.','Liwen glances at the empty ruka, down on the left.')]);
  say([L('Liwen','Chaltu may, '+n+'!','¡Gracias, '+n+'!','Thank you, '+n+'!')])}
function kyKimcheTalk(){
  if(!S.flags.liwen)return say([L('Kimche papay','Mari mari, weche.','Hola, joven.','Hello, young one.'),N('La papay sabia te mira de arriba abajo y apunta con la barbilla hacia Liwen.','The wise papay looks you up and down and points her chin toward Liwen.')]);
  if(!S.flags.kimke){S.flags.kimke=1;persist();sfx('lvl');
    return say([L('Kimche papay','Pukem mew, pire küpakey.','En invierno suele venir la nieve.','In winter, the snow usually comes.'),
      N('-ke- es lo que pasa siempre, la costumbre. Küpa-ke-y: «suele venir». Quien sabe lo que el otro hace siempre, sabe lo que va a hacer.','-ke- is what always happens, the habit. Küpa-ke-y: "it usually comes". Whoever knows what the other always does knows what it will do.'),
      Object.assign(L('','Kimün!','En las peleas aparece «Kimün»: dices lo que un wekufü hace siempre (…key) y le ves venir los golpes.','In battle «Kimün» appears: you say what a wekufü always does (…key) and you see its blows coming.'),{fx:()=>sfx('lvl')}),
      L('Kimche papay','Kolokolo pun mew küpakey.','El Kolokolo suele venir de noche.','The Kolokolo usually comes at night.'),
      N('«Se mete en esa ruka vacía y les roba el aliento a los que duermen. Búsquenlo los dos.»','"It creeps into that empty ruka and steals the breath of those who sleep. Seek it out, the two of you."')])}
  say([L('Kimche papay','Pukem mew, pire küpakey.','En invierno suele venir la nieve.','In winter, the snow usually comes.')])}
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
      L('Kimche papay','Pukem mew, pire küpakey. Welu pewün ka küpakey.','En invierno suele venir la nieve. Pero la primavera también suele llegar.','In winter the snow usually comes. But spring usually comes too.'),
      N('La papay sabia mira hacia el este, donde la nieve empieza a ceder.','The wise papay looks east, where the snow is starting to give way.'),
      N('(Fin de Pukem. Pewün, la primavera, se está construyendo.)','(End of Pukem. Pewün, spring, is being built.)')]),500)})}
