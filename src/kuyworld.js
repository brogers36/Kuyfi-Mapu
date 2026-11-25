/* ============================================================
   KUYFI MAPU: the world (vertical slice: Pukem)
   The Game 1 maps are borrowed as placeholders (same tile grids,
   new people, snow, new exits) until Pukem's own maps are drawn.
   ============================================================ */
WXT.pukem=[['pire',6],['tromu',3],['kuruf',1]];
{const _wk=wxKey;wxKey=function(){if(M&&M.wxk&&!M.interior)return M.wxk;return _wk()}}
const kyClone=(id,ov)=>Object.assign({},MAPS[id],ov);
MAPS.k_rupu=kyClone('rupu',{name:'Kuyfi rüpü',g:{es:'El camino en la niebla',en:'The road in the fog'},fog:1,wxk:null,
  edges:{right:{to:'k_lof',x:1,y:9},left:{need:99,reqMsg:[N('La niebla se cierra detrás de ti. Por ahora no hay camino de vuelta.','The fog closes behind you. For now there is no way back.')]}},
  ents:[{kind:'enemy',x:12,y:4,party:['laftrache']},{kind:'enemy',x:20,y:7,party:['pire','laftrache']},{kind:'enemy',x:16,y:10,party:['chonchon']},{kind:'enemy',x:25,y:3,party:['pire','pire']}]});
MAPS.k_lof=kyClone('lof',{name:'Kuyfi lof',g:{es:'El lof de los antiguos, en pukem (invierno)',en:'The ancestors\' lof, in pukem (winter)'},wxk:'pukem',scenes:[],
  doors:{'3,3':{to:'k_ruka1',x:6,y:7},'3,8':{to:'k_ruka2',x:6,y:7}},
  edges:{left:{to:'k_rupu',x:28,y:6},right:{need:99,reqMsg:[N('El camino del este está tapado de nieve. (Pewün, la primavera, todavía se está construyendo.)','The road east is buried in snow. (Pewün, spring, is still being built.)')]}},
  ents:[
   {id:'ky_liwen',kind:'npc',look:'gatherer',fem:1,x:5,y:5,dir:'down',fixed:1,req:'ky_arrive',talk:()=>kyLiwenTalk(),bub:['Amuyu!','Mari mari!']},
   {id:'ky_kimche',kind:'npc',look:'kuku',fem:1,x:9,y:9,dir:'left',fixed:1,req:'ky_arrive',talk:()=>kyKimcheTalk(),bub:['Küpange...','Pukem mew...']},
   {id:'ky_weaver',kind:'npc',look:'weaver',fem:1,x:6,y:3,dir:'up',act:'weave',fixed:1,talk:()=>kyWeaverTalk(),bub:['Ngürekalen.']},
   {id:'ky_cook',kind:'npc',look:'cook',fem:1,x:24,y:8,act:'cook',path:[[24,8],[24,10],[28,10],[24,10]],pause:160,talk:()=>kyCookTalk(),bub:['Iyael!']},
   {id:'ky_lonko',kind:'npc',look:'lonko',x:18,y:7,talk:()=>kyLonkoTalk(),bub:['Mari mari!']},
   {id:'ky_kona',kind:'npc',look:'kona',x:14,y:12,path:[[14,12],[20,12]],pause:120,talk:()=>kyKonaTalk(),bub:['Wütreley!']},
   {kind:'enemy',x:26,y:13,party:['pire'],req:'liwen'}]});
MAPS.k_ruka1=kyClone('l_ruka1',{name:'Liwen ñi ruka',g:{es:'La ruka de Liwen, junto al kütral',en:'Liwen\'s ruka, by the kütral'},chests:{},
  edges:{down:{to:'k_lof',x:3,y:4}},ents:[]});
MAPS.k_ruka2=kyClone('l_ruka2',{name:'Kolokolo ñi ruka',g:{es:'La ruka vacía donde entra el Kolokolo',en:'The empty ruka the Kolokolo creeps into'},
  edges:{down:{to:'k_lof',x:3,y:9}},
  ents:[{id:'kolo',kind:'enemy',x:6,y:3,party:['kolokolo'],fixed:1,boss:1,flag:'ky_kolo',req:'kimke',
    pre:[N('En la oscuridad de la ruka algo chilla, bajito. Dos ojitos rojos brillan junto al fogón apagado.','In the dark of the ruka something squeaks, softly. Two little red eyes glint by the dead hearth.'),
         L('Liwen','Kolokolo! Kintuyu!','¡El Kolokolo! ¡Busquémoslo, tú y yo!','The Kolokolo! Let\'s look for it, you and I!')],
    post:()=>kyKoloWon()}]});
for(const k of ['k_rupu','k_lof','k_ruka1','k_ruka2'])MAPS[k].rows=MAPS[k].rows.slice();
MAPS.k_lof.rows=MAPS.k_lof.rows.map(r=>r.replace(/V/g,MAPS.k_lof.floor));   // no school board in kuyfi time
MAPS.k_lof.pal=MAPS.k_rupu.pal='pewenche';

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
startCut=function(){kyOpening()};

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
function kyKoloWon(){sfx('lvl');S.flags.ky_pukem1=1;persist();
  say([N('El Kolokolo chilla una última vez y se escurre por un hoyo de la pared. La ruka queda en silencio, y por primera vez en días alguien duerme tranquilo.','The Kolokolo squeaks one last time and slips out through a hole in the wall. The ruka goes quiet, and for the first time in days someone sleeps in peace.'),
    L('Liwen','Chaltu may!','¡Gracias!','Thank you!'),
    N('(Fin de la primera prueba de Pukem. Lo que sigue de Kuyfi Mapu se está construyendo.)','(End of the first Pukem test. The rest of Kuyfi Mapu is being built.)')])}
