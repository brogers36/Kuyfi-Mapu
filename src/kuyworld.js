/* ============================================================
   KUYFI MAPU: the world (vertical slice: Pukem)
   The Game 1 maps are borrowed as placeholders (same tile grids,
   new people, snow, new exits) until Pukem's own maps are drawn.
   ============================================================ */
if(typeof GEMD!=='undefined'&&GEMD.en&&GEMD.en.kolokolo)GEMD.en.kolokolo_b=GEMD.en.kolokolo;   // the new art for the boss Kolokolo
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
kyMap('k_lof',Object.assign({},KYOUT,{name:'Pukem lof',g:{es:'El lof del pasado, en pukem (invierno)',en:'The lof of the past, in pukem (winter)'},song:'pewLof',
  doors:{'3,3':{to:'k_ruka1',x:6,y:7},'9,3':{to:'k_ruka3',x:6,y:7},'27,11':{to:'k_ruka2',x:6,y:7}},
  edges:{left:{req:'_never',reqMsg:[N('Hacia el oeste solo hay niebla. Por ahí llegaste; por ahí no se vuelve.','To the west there is only fog. That is how you came; that is not the way back.')]},up:{to:'k_mawida',x:16,y:13,req:'liwen',reqMsg:[N('Liwen te llama desde su ruka. Mejor habla con ella antes de ir al monte.','Liwen calls to you from her ruka. Better talk to her before going into the forest.')]},right:{to:'k_menoko',x:1,y:6,req:'liwen',reqMsg:[N('Liwen te llama desde su ruka. Mejor habla con ella primero.','Liwen calls to you from her ruka. Better talk to her first.')]}},
  ents:[
   {id:'ky_liwen',kind:'npc',look:'liwen',fem:1,x:4,y:5,dir:'down',fixed:1,req:'ky_arrive',talk:()=>kyLiwenTalk(),bub:['Amuyu!','Mari mari!']},
   {id:'ky_kimche',kind:'npc',look:'kuku',fem:1,x:13,y:5,dir:'right',fixed:1,req:'ky_arrive',talk:()=>kyKimcheTalk(),bub:['Küpange...','Pukem mew...']},
   {id:'ky_weaver',kind:'npc',look:'weaver',fem:1,x:6,y:4,dir:'up',act:'weave',fixed:1,talk:()=>kyWeaverTalk(),bub:['Ngürekalen.']},
   {id:'ky_cook',kind:'npc',look:'cook',fem:1,x:21,y:10,act:'cook',fixed:1,talk:()=>kyCookTalk(),bub:['Iyael!']},
   {id:'ky_lonko',kind:'npc',look:'lonko',x:25,y:5,path:[[25,5],[29,5]],pause:160,talk:()=>kyLonkoTalk(),bub:['Mari mari!']},
   {id:'ky_kona',kind:'npc',look:'kona',x:8,y:9,path:[[8,9],[13,9]],pause:120,talk:()=>kyKonaTalk(),bub:['Wütreley!']},
   {id:'ky_child',kind:'npc',look:'child',x:18,y:12,path:[[18,12],[23,12]],pause:90,talk:()=>kyChildTalk(),bub:['Pire!','Awkantuyu!']}]}));
kyMap('k_mawida',Object.assign({},KYOUT,{name:'Pire mawida',g:{es:'El monte nevado',en:'The snowy forest'},song:'pew',
  
  edges:{down:{to:'k_lof',x:16,y:1,req:'ky_meet',reqMsg:[N('Alguien sigue cantando entre los árboles, al oeste. Y gritó pidiendo ayuda.','Someone is still singing among the trees, to the west. And cried out for help.')]},right:{to:'k_winkul',x:1,y:7,req:'ky_meet',reqMsg:[N('Alguien sigue cantando entre los árboles, al oeste. Y gritó pidiendo ayuda.','Someone is still singing among the trees, to the west. And cried out for help.')]}},chests:{'4,6':'lawen1','28,2':'piwke'},konew:{'28,4':KYK1},
  ents:[{id:'ky_liwen_m',kind:'npc',look:'liwen',fem:1,x:8,y:7,dir:'right',fixed:1,flag:'ky_meet',talk:()=>kyLiwenMeet(),bub:['♪ ...','Kellumuchi!']},
    {kind:'enemy',x:19,y:5,party:['laftrache','pire'],req:'ky_meet'},{kind:'enemy',x:12,y:8,party:['chonchon','chonchon'],req:'ky_meet'},
    {kind:'enemy',x:24,y:8,party:['pire','pire'],req:'ky_meet'},{kind:'enemy',x:6,y:13,party:['anchi','laftrache'],req:'ky_meet'}]}));
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
  ents:[{id:'kolo',kind:'enemy',x:8,y:4,party:['kolokolo_b'],fixed:1,boss:1,flag:'ky_kolo',
    pre:[N('En el fondo de la madriguera algo chilla, bajito. Dos ojitos rojos brillan junto a un montón de lana robada.','At the bottom of the burrow something squeaks, softly. Two little red eyes glint beside a heap of stolen wool.'),
         L('Liwen','Kolokolo! Kintuyu!','¡El Kolokolo! ¡Busquémoslo, tú y yo!','The Kolokolo! Let\'s look for it, you and I!')],
    post:()=>kyKoloWon()}]}));

/* ---------- the present: Game 1's places, seen in the present day, as the start of the story ---------- */
const KPR=(id,ov)=>{const d=Object.assign({},MAPS[id],{region:'kpres',sbt:null,dive:null,tablets:null,konew:null,digs:null,chests:{},stones:{},signs:{},scenes:[]},ov);d.rows=MAPS[id].rows.slice();d.w=d.rows[0].length;d.h=d.rows.length;return d};
SONGSET.kpres=SONGSET.lafkenche||SONGSET.pewenche;
MAPS.kp_rupu=KPR('rupu',{name:'Lafken rüpü',g:{es:'El camino del mar, hoy',en:'The sea road, today'},
  edges:{right:{to:'kp_lof',x:1,y:9},left:{to:'kp_ngoyman',x:16,y:6,req:'kp_sent',reqMsg:[N('Al oeste, la niebla vuelve a juntarse donde estaba Ngoyman mapu. Tu kuku te está llamando desde el lof (al este).','To the west, the fog is gathering again where Ngoyman mapu was. Your kuku is calling you from the lof (to the east).')]}},
  ents:[{kind:'enemy',x:11,y:4,party:['laftrache']},{kind:'enemy',x:20,y:7,party:['laftrache']}]});
MAPS.kp_lof=KPR('lof',{name:'Lof',g:{es:'El lof, hoy',en:'The lof, today'},doors:{},
  edges:{left:{to:'kp_rupu',x:28,y:6},right:{req:'_never',reqMsg:[N('Tu kuku te pidió ir hacia el oeste, a Ngoyman mapu.','Your kuku asked you to go west, to Ngoyman mapu.')]},up:{req:'_never',reqMsg:[N('Tu kuku te pidió ir hacia el oeste, a Ngoyman mapu.','Your kuku asked you to go west, to Ngoyman mapu.')]}},
  ents:[{id:'kp_kuku',kind:'npc',look:'kuku',fem:1,x:18,y:7,dir:'left',fixed:1,talk:()=>kpKukuTalk(),bub:['Küpange!','♪ ...']},
    {id:'kp_weaver',kind:'npc',look:'weaver',fem:1,x:6,y:3,dir:'up',act:'weave',fixed:1,talk:()=>say([L('Ngürekafe','Mari mari!','¡Hola!','Hello!'),N('«Tu kuku te anda buscando», te dice sin dejar de tejer.','"Your kuku is looking for you," she says without stopping her weaving.')]),bub:['Mari mari!']},
    {id:'kp_cook',kind:'npc',look:'cook',fem:1,x:24,y:8,act:'cook',fixed:1,talk:()=>say([L('Papay','Iyael!','¡Comida!','Food!')]),bub:['Iyael!']},
    {id:'kp_kids',kind:'npc',look:'child',x:14,y:12,path:[[14,12],[20,12]],pause:90,talk:()=>say([L('Pichi che','Mari mari!','¡Hola!','Hello!')]),bub:['Awkantuaiñ!']}]});
MAPS.kp_ngoyman=KPR('ngoyman',{name:'Ngoyman mapu',g:{es:'La tierra del olvido, hoy: la niebla vuelve',en:'The land of forgetting, today: the fog is back'},
  edges:{right:{to:'kp_rupu',x:1,y:6},left:{to:'kp_glafken',x:30,y:7}},
  signs:{'8,5':[L('','Kiñe wirintungechi kura pi: «Faw müley Ti Fütra Ngoymatulfe ñi wülngiñ».','La piedra tallada del umbral sigue aquí, pero alguien rayó encima, con letras torcidas: «...mu ...chi ...yu...».','The carved stone of the threshold is still here, but someone has scratched over it in crooked letters: «...mu ...chi ...yu...».')]},
  ents:[{kind:'enemy',x:12,y:3,party:['ngoyam']},{kind:'enemy',x:5,y:9,party:['ngoyam','ngoyam']}]});
MAPS.kp_glafken=KPR('g_lafken',{name:'Ngoyman lafken',g:{es:'La costa robada, en ruinas',en:'The stolen coast, in ruins'},
  edges:{right:{to:'kp_ngoyman',x:1,y:6},left:{to:'kp_wulngin',x:16,y:7}},
  signs:{'24,3':[N('Entre las piedras hay una hoja arrancada de una chillka. Las palabras se borran mientras la miras: «...küpa... -yu... kuyfi...»','Among the stones lies a page torn from a chillka. The words fade as you look at it: «...küpa... -yu... kuyfi...»')]},
  ents:[{kind:'enemy',x:16,y:3,party:['ngoyam','nidol']},{kind:'enemy',x:24,y:8,party:['piwichen','ngoyam']},{kind:'enemy',x:8,y:8,party:['ngoyam','ngoyam','piwichen']}]});
MAPS.kp_glafken.rows=MAPS.kp_glafken.rows.map(r=>r.replace(/K/g,'I'));
MAPS.kp_wulngin=KPR('g_wulngin',{name:'Ngoyman ñi wülngiñ',g:{es:'La puerta del gran olvido, rota',en:'The gate of the great forgetting, broken'},
  edges:{right:{to:'kp_glafken',x:1,y:7}},stairs:{to:'kp_heart',x:8,y:9},
  signs:{'8,5':[N('La puerta de niebla sólida ya no existe: queda un arco quebrado. Desde abajo sube un zumbido, como muchas voces hablando a la vez.','The door of solid fog is gone: only a broken arch is left. From below rises a hum, like many voices talking at once.')]},ents:[]});
MAPS.kp_heart=KPR('g_ngoyman',{name:'Ti Fütra Ngoymatulfe ñi ruka',g:{es:'Donde peleaste con el gran olvido: en ruinas',en:'Where you fought the great forgetting: in ruins'},ruin:1,
  stairs:{to:'kp_wulngin',x:8,y:3},ents:[]});
{const r=MAPS.kp_heart.rows.map(x=>x.split(''));
  for(const [x,y] of [[4,3],[12,2],[5,8],[13,9],[10,4],[4,6],[14,5],[7,10],[11,7]])if(r[y][x]==='_')r[y][x]='#';
  r[5][8]='@';MAPS.kp_heart.rows=r.map(x=>x.join(''))}
/* the ruin is drawn grey and cold */
{const _et=kyEraTint;kyEraTint=function(c){if(M&&M.ruin){c.save();c.globalCompositeOperation='saturation';c.fillStyle='rgba(128,128,128,.55)';c.fillRect(0,0,LW,LH);c.globalCompositeOperation='source-over';c.fillStyle='rgba(20,24,40,.18)';c.fillRect(0,0,LW,LH);c.restore();return}return _et(c)}}

{const _lm=loadMap;loadMap=function(id){const r=_lm.apply(this,arguments);
  if(id==='kp_heart'&&!S.flags.kp_heart){const w=()=>{if(active)return setTimeout(w,200);kpHeartEnter()};setTimeout(w,400)}return r}}
function kyOpening(){
  $('title').style.display='none';mode='map';S.wtime=Math.round(.15*43200);
  loadMap('kp_rupu',26,6,true);P.dir='left';playSong('coast');const n=nm();
  say([N('Pasó un tiempo desde que cayó Ti Fütra Ngoyman. Caminas solo por el camino del mar.','Some time has passed since Ti Fütra Ngoyman fell. You walk alone along the sea road.'),
    L('Kuku','Küpange, '+n+'!','¡Ven, '+n+'!','Come here, '+n+'!'),
    N('Es la voz de tu kuku, desde el lof (al este).','It is your kuku\'s voice, from the lof (to the east).')]);
  S.flags.ky_open=1;persist()}
function kpKukuTalk(){const n=nm();
  if(S.flags.kp_sent)return say([L('Kuku','Amunge Ngoyman mapu mew.','Ve a Ngoyman mapu.','Go to Ngoyman mapu.'),N('Tu kuku apunta al oeste, más allá del camino del mar.','Your kuku points west, beyond the sea road.')]);
  S.flags.kp_sent=1;persist();
  say([L('Kuku','Mari mari, '+n+'.','Hola, '+n+'.','Hello, '+n+'.'),
    N('Tu kuku está junto al kütral. Tararea una canción vieja, pero a mitad del verso se detiene: se le fue la palabra.','Your kuku sits by the kütral. She hums an old song, but halfway through the verse she stops: the word has slipped away.'),
    N('«Desde hace días se me van las palabras», te dice. «Y anoche la niebla volvió a juntarse allá donde estaba Ngoyman mapu.»','"For days now the words have been slipping away from me," she tells you. "And last night the fog gathered again over there, where Ngoyman mapu was."'),
    L('Kuku','Amunge Ngoyman mapu mew. Kintunge chem rupay.','Ve a Ngoyman mapu. Busca qué pasó.','Go to Ngoyman mapu. Find out what happened.'),
    N('Ngoyman mapu está al oeste, pasando el camino del mar.','Ngoyman mapu lies to the west, past the sea road.')])}
/* entering the ruined heart: the voice */
function kpHeartEnter(){if(S.flags.kp_heart)return;S.flags.kp_heart=1;persist();
  say([N('La sala donde peleaste con el gran olvido está en ruinas: piedras caídas, la niebla gris y quieta. Pero en el centro algo gira.','The hall where you fought the great forgetting lies in ruins: fallen stones, the fog grey and still. But in the middle something is turning.'),
    N('Una voz repite tus propias palabras... mal. «Amutu-mu... küpa-chi... -yu... -mu...» Las terminaciones cambiadas, los pedazos sueltos. No es un eco: se las está llevando.','A voice repeats your own words... wrong. "Amutu-mu... küpa-chi... -yu... -mu..." The endings swapped, the pieces loose. It is not an echo: it is carrying them away.')])}
{const _pm=portalMenu;portalMenu=function(){if(CUR!=='kp_heart')return _pm.apply(this,arguments);
  say([N('Te acercas al remolino. Las palabras que pasan volando tienen la voz de tu kuku.','You step up to the whirl. The words flying past have your kuku\'s voice.'),
    N('El remolino te jala hacia adentro.','The whirl pulls you in.')],
    ()=>kyTimeTravel(()=>{S.wtime=0;loadMap('k_mawida',16,12,true);P.dir='up';setTimeout(kyArrival,600)}))}}

/* the past: you wake in the snow forest and hear the song */
function kyArrival(){if(S.flags.ky_woke)return;S.flags.ky_woke=1;persist();
  const go=()=>{if(document.getElementById('kytt')||active)return setTimeout(go,200);
    say([N('Despiertas en la nieve, en un monte que no conoces. Hace frío: es pukem, el invierno.','You wake in the snow, in a forest you do not know. It is cold: it is pukem, winter.'),
      N('Entre los árboles alguien canta... la misma canción que tu kuku. Y alguien grita.','Somewhere among the trees someone is singing... the same song as your kuku. And someone cries out.')])};go()}
function kyLiwenMeet(){const n=nm();
  say([L('Liwen','Kellumuchi!','¡Ayúdame!','Help me!'),
    N('Una muchacha con un atado de leña está rodeada de dos pire wekufü. Toma una rama y se pone a tu lado.','A girl with a bundle of firewood is surrounded by two pire wekufü. She grabs a branch and stands beside you.'),
    Object.assign(N('En esta pelea no estás solo: aparece «Iñchiw». Elige un verbo y ponle -yu: «tú y yo».','In this fight you are not alone: «Iñchiw» appears. Choose a verb and add -yu: "you and I".'),{fx:()=>{S.flags.liwen=1;persist()}})],
    ()=>startBattle(['pire','pire'],{ent:{post:()=>kyAfterMeet()}}))}
function kyAfterMeet(){const n=nm();S.flags.ky_meet=1;persist();
  say([L('Liwen','Chaltu may! Iney pingeymi?','¡Gracias! ¿Cómo te llamas?','Thank you! What is your name?'),
    L(n,'Iñche '+n+' pingen.','Me llamo '+n+'.','My name is '+n+'.'),
    L('Liwen','Iñche Liwen pingen.','Yo me llamo Liwen.','My name is Liwen.'),
    N('Recoge su leña y vuelve a tararear. Es la canción de tu kuku, entera, con todas sus palabras.','She picks up her firewood and starts humming again. It is your kuku\'s song, whole, with all its words.'),
    N('Liwen. Nunca supiste cómo se llamaba tu kuku de joven.','Liwen. You never knew what your kuku was called when she was young.'),
    N('Amu-yu: «vamos, los dos». En Kewün Newen aprendiste a darles órdenes a los wekufü (-nge, -mu, -mün). Aquí aprenderás a hablar CON otros: -yu es «tú y yo».','Amu-yu: "let\'s go, the two of us". In Kewün Newen you learned to give orders to the wekufü (-nge, -mu, -mün). Here you will learn to speak WITH others: -yu is "you and I".'),
    Object.assign(L('','Liwen kellueyu!','Liwen se une a ti.','Liwen joins you.'),{fx:()=>sfx('lvl')}),
    L('Liwen','Amuyu, tañi lof mew!','¡Vamos, tú y yo, a mi lof!','Let\'s go, you and I, to my lof!')],
    ()=>{loadMap('k_lof',16,2,true);P.dir='down';setTimeout(kyElders,500)})}
function kyElders(){
  say([N('En el lof, los mayores se acercan, te escuchan y conversan entre ellos. Hablas raro, les dicen sus ojos.','In the lof the elders come close, listen to you and talk among themselves. You speak strangely, their eyes say.'),
    N('Al final la más vieja, la kimche papay, decide: quien habla tan poco tiene que quedarse un año entero, y escuchar.','In the end the oldest, the kimche papay, decides: someone who speaks so little must stay a whole year, and listen.')],
    ()=>{S.flags.ky_arrive=1;persist();loadMap('k_lof',P.x,P.y,true)})}
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

/* ---------- the people of the kuyfi lof ---------- */
function kyLiwenTalk(){const n=nm(),en=S.gloss==='en';
  if(!S.flags.ky_lw1){S.flags.ky_lw1=1;S.flags.liwen=1;persist();
    return say([L('Liwen','Kimche papay mew amuyu.','Vamos donde la papay sabia.','Let\'s go to the wise papay.')])}
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

/* ---------- Liwen looks the same on the map as in battle: the heroine the player did not choose, re-dyed teal ---------- */
{const _kyCS=ctCharSprite;ctCharSprite=function(look,dir,fr){if(look!=='liwen')return _kyCS.apply(this,arguments);
  const base=heroLook()==='ayelen'?'millaray':'ayelen',key='KYL'+base+dir+fr+(arguments[3]?'s':'');if(CCACHE[key])return CCACHE[key];
  const a=[...arguments];a[0]=base;return CCACHE[key]=kyDye(_kyCS.apply(this,a))}}

/* ---------- side quests of the Pukem lof ---------- */
function kyChildTalk(){
  if(S.flags.ky_q_child)return say([L('Pichi che','Awkantuyu!','¡Juguemos, tú y yo!','Let\'s play, you and I!'),N('El niño se ríe y te tira otra bola de nieve.','The child laughs and throws another snowball at you.')]);
  const opts=kyShuf(['awkantuyu','awkantumu','awkantunge']).map(o=>({m:o,v:o}));
  say([L('Pichi che','Awkantu...?','¿Jugamos...?','Shall we play...?'),N('El niño te mira con una bola de nieve en la mano. ¿Cómo le dices «juguemos, tú y yo»?','The child looks at you, a snowball in hand. How do you say "let\'s play, you and I"?')],()=>
    choose({m:'awkantu___',es:'Juguemos, tú y yo:',en:'Let\'s play, you and I:'},opts,v=>{
      if(v!=='awkantuyu'){sfx('bad');return say([N(v==='awkantumu'?'-mu les habla a otros dos. El niño mira a su alrededor buscando a quién le hablas.':'-nge es una orden a otro. El niño se cruza de brazos: «¿Y tú no juegas?»',v==='awkantumu'?'-mu speaks to two others. The child looks around for whoever you are talking to.':'-nge is an order to someone else. The child crosses his arms: "And you don\'t play?"')])}
      S.flags.ky_q_child=1;S.gold+=20;persist();sfx('lvl');
      say([L(nm(),'Awkantuyu!','¡Juguemos, tú y yo!','Let\'s play, you and I!'),
        N('Se tiran nieve hasta quedar sin aliento. Al final el niño te da algo que encontró en la nieve: epu mari (20) ngülliw.','You throw snow at each other until you are out of breath. At the end the child gives you something he found in the snow: epu mari (20) ngülliw.')])},true))}
function kyWeaverTalk(){
  if(S.flags.ky_kolo&&!S.flags.ky_q_wool){S.flags.ky_q_wool=1;persist();
    return gainPiwke([N('Liwen le trae a la tejedora la lana que el Kolokolo se había robado.','Liwen brings the weaver the wool the Kolokolo had stolen.'),
      L('Ngürekafe','Chaltu may!','¡Gracias!','Thank you!'),
      N('Esa misma noche teje un trarilonko y te lo pone en la frente. Te sientes más fuerte.','That same night she weaves a trarilonko and ties it around your forehead. You feel stronger.')])}
  if(!S.flags.ky_kolo)return say([L('Ngürekafe','Ngürekalen... welu ñamüy tañi ufisa kal.','Estoy tejiendo... pero se me perdió la lana.','I am weaving... but my wool is lost.'),N('«Algo se la lleva de noche», dice, y mira hacia la ruka vacía.','"Something takes it at night," she says, and glances at the empty ruka.')]);
  say([L('Ngürekafe','Ngürekalen.','Estoy tejiendo.','I am weaving.'),N('Teje junto al fuego; en invierno se teje mucho.','She weaves by the fire; in winter there is much weaving.')])}
function kyLonkoTalk(){
  if(S.flags.ky_pukem_done&&!S.flags.ky_q_lonko){S.flags.ky_q_lonko=1;S.items.lawen=(S.items.lawen||0)+2;persist();sfx('lvl');
    return say([L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),N('Ahora el lonko te saluda por tu nombre. Te regala dos lawen «para el camino que viene».','Now the lonko greets you by name. He gives you two lawen "for the road ahead".')])}
  say([L('Lonko','Mari mari.','Hola.','Hello.'),N(S.flags.ky_pukem_done?'El lonko asiente: ya eres parte del lof.':'El lonko te saluda serio. Todavía no sabe qué hacer contigo.',S.flags.ky_pukem_done?'The lonko nods: you are part of the lof now.':'The lonko greets you gravely. He does not yet know what to make of you.')])}

/* ---------- Pukem's secret wekufü: a great Anchimalleñ on the hill, after the Kolokolo ---------- */
ET.anchi_b={name:'Fütra Anchimalleñ',hp:170,atk:13,xp:150,gold:[80,80],boss:true,bs:72,secret:1,fly:1,spres:1};
if(typeof SPR2!=='undefined'&&SPR2.anchi){SPR2.anchi_b=SPR2.anchi;if(SPR2['anchi@b'])SPR2['anchi_b@b']=SPR2['anchi@b']}
if(typeof GEMD!=='undefined'&&GEMD.en&&GEMD.en.anchi)GEMD.en.anchi_b=GEMD.en.anchi;
MAPS.k_winkul.sbt={t:['12,2','13,2','12,3'],boss:'anchi_b',flag:'ky_sb1',req:'ky_pukem_done'};
{const _sbw=sbossWake;sbossWake=function(sb){if(sb.boss!=='anchi_b')return _sbw.apply(this,arguments);
  say([N('En lo alto de la loma, entre las piedras, una lucecita salta de roca en roca... y de pronto son cien. Se juntan en una sola llama que se ríe con voz de niño: ¡un Fütra Anchimalleñ!','At the top of the hill, among the stones, a little light hops from rock to rock... and suddenly there are a hundred. They gather into a single flame that laughs with a child\'s voice: a great Anchimalleñ!'),
       L('Liwen','Kintuyu! Nagpay!','¡Busquémoslo, tú y yo! ¡Ya baja!','Let\'s look for it, you and I! It is coming down!')],()=>startBattle(['anchi_b'],{boss:1,sflag:sb.flag}))}}
