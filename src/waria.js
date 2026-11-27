/* ======================================================================
   THE SANTIAGO ACT (Waria mew): opens right after Ti Fütra Ngoymatulfe.
   Three pressures wear the language down in the city, each with a district,
   its puzzles and a warden; then Yewen, in the población cancha.
     · ngoyngoyün (noise): the feria and the community radio
     · pu mapuche ñi ngamleftripael (dispersion): the Metro
     · pu che ñi mapudungukenoael fillantü (no everyday use): the blocks
   All new Mapudungun is listed in docs/review.md (Tanda 25) with ⚠.
   ====================================================================== */
function stgoOpen(){return !!(S&&S.flags&&S.flags.won)}
function swCheck(){const F=S.flags;
  if(F.feria_ok&&F.radio_ok)F.feria_ready=1;
  if(F.spk1&&F.spk2&&F.spk3)F.spk_all=1;
  if(F.cena_ok&&F.tel_ok)F.blocks_ready=1;
  if(F.sw1&&F.sw2&&F.sw3)F.sw3all=1;
  if(F.st_all&&F.sw3all)F.sw_all=1}
function swDone(){return ['sw1','sw2','sw3'].filter(f=>S.flags[f]).length}
function addMap(id,def){def.region=def.region||'santiago';def.rows=MAPROWS[id];def.w=def.rows[0].length;def.h=def.rows.length;MAPS[id]=def}
const WARIA={floor:',',bg:'waria',song:'waria',pal:'stgo',urban:1,trees:'koyam'};
const METRO={floor:'_',bg:'metro',song:'cave',dungeon:1,pal:'metro',wall:'metro'};
const DEPTO={floor:'_',bg:'field',song:'waria',pal:'deptoin',wall:'depto',interior:1};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const subN=s=>String(s).replace(/@/g,S.name);

/* a short conversation: each line waits for the right answer; a wrong one gets a gentle retry */
function convo(items,done,topic){
  const ask=i=>{if(i>=items.length)return done&&done();const it=items[i];
    const q=Object.assign({},it.q,{m:subN(it.q.m||'')}),o=it.o.map(subN),a=subN(it.a);
    choose(q,shuf(o).map(x=>({m:x,v:x})),v=>{const ok=v===a;track(topic,ok,q,o,a);
      if(ok){sfx('ok');return it.after?say(it.after,()=>ask(i+1)):ask(i+1)}
      sfx('bad');say([N(it.hint?it.hint[0]:'Mmm... no es eso. Piénsalo otra vez.',it.hint?it.hint[1]:'Hmm... not that. Think again.')],()=>ask(i))},false,true)};
  ask(0)}

/* ---------- objects drawn on the map (turnstiles, the radio desk, the phone, the table, station signs) ---------- */
function drawObj(c,o,sx,sy,e){
  if(o==='torno'){R(c,sx+1,sy+4,14,11,'#2a2e36');R(c,sx+2,sy+5,12,4,'#8a929e');R(c,sx+2,sy+5,12,1,'#c4ccd6');R(c,sx+3,sy+10,10,1,'#c0c4cc');
    R(c,sx+12,sy+6,2,2,frame%40<20?'#e04040':'#601818');R(c,sx+7,sy+9,2,6,'#5a606a');ell(c,sx+8,sy+15,7,2,'rgba(0,0,0,.3)');return}
  if(o==='radio'){ell(c,sx+8,sy+15,8,2,'rgba(0,0,0,.3)');R(c,sx,sy+6,16,9,'#3a2a1e');R(c,sx,sy+6,16,1,'#6a4a30');R(c,sx+2,sy+2,12,6,'#1a1e24');R(c,sx+3,sy+3,10,4,'#2a4a54');
    for(let k=0;k<5;k++)R(c,sx+4+k*2,sy+7-((frame>>2)+k*3)%4,1,((frame>>2)+k*3)%4+1,'#7ae0c0');R(c,sx+3,sy+10,3,3,'#9aa0a8');R(c,sx+10,sy+10,3,3,'#9aa0a8');
    R(c,sx+7,sy-2,1,5,'#1a1a1a');R(c,sx+5,sy-3,5,2,'#2a2a2a');return}
  if(o==='tel'){ell(c,sx+8,sy+15,6,2,'rgba(0,0,0,.3)');R(c,sx+3,sy+8,10,7,'#5a3a24');R(c,sx+4,sy+5,8,4,'#c03030');R(c,sx+4,sy+5,8,1,'#e86060');R(c,sx+6,sy+7,4,1,'#2a0a0a');
    if(!S.flags.tel_ok&&frame%50<25)OV.push(()=>txt('♪',sx+14,sy+2,'#ffe8a0',9));return}
  if(o==='mesa'){ell(c,sx+8,sy+15,12,3,'rgba(0,0,0,.3)');R(c,sx-6,sy+6,28,6,'#8a5a32');R(c,sx-6,sy+6,28,1,'#b88050');R(c,sx-4,sy+12,2,4,'#5a3a1e');R(c,sx+18,sy+12,2,4,'#5a3a1e');
    R(c,sx-2,sy+4,5,2,'#f0e8d8');R(c,sx+4,sy+3,6,3,'#c8a060');R(c,sx+12,sy+4,5,2,'#f0e8d8');R(c,sx+13,sy+3,3,1,'#d05030');return}
  if(o==='letrero'){const nmd=S.names&&S.names[e.spot];R(c,sx-6,sy+2,28,9,'#d8dce4');R(c,sx-5,sy+3,26,7,nmd?'#1e3c78':'#3a4250');R(c,sx+7,sy+11,2,5,'#6a707a');
    if(nmd)OV.push(()=>txt(GR(nmd.m),sx+8,sy+9,'#ffffff',8,'center'));else if(frame%60<30)OV.push(()=>txt('?',sx+8,sy+9,'#ffe8a0',9,'center'));return}
}

/* ---------- naming places: build a name from words you know; if it is grammatical, it sticks ---------- */
const NW={  // k: kind (mod = colour/size word, n = noun, v = verb root)
  kallfü:{k:'mod',es:'azul',en:'blue'},kelü:{k:'mod',es:'rojo',en:'red'},karü:{k:'mod',es:'verde',en:'green'},kurü:{k:'mod',es:'negro',en:'black'},
  lig:{k:'mod',es:'blanco',en:'white'},chod:{k:'mod',es:'amarillo',en:'yellow'},füta:{k:'mod',es:'grande',en:'big'},pichi:{k:'mod',es:'chico',en:'small'},
  ko:{k:'n',es:'agua',en:'water'},lewfü:{k:'n',es:'río',en:'river'},mawida:{k:'n',es:'monte',en:'wooded hill'},kura:{k:'n',es:'piedra',en:'stone'},
  mapu:{k:'n',es:'tierra',en:'land'},rüpü:{k:'n',es:'camino',en:'road'},
  'trawü-':{k:'v',es:'reunirse',en:'gather'},'nütramka-':{k:'v',es:'conversar',en:'talk together'},'ülkantu-':{k:'v',es:'cantar',en:'sing'},'kimeltu-':{k:'v',es:'enseñar',en:'teach'}};
const NW1=['kallfü','kelü','karü','kurü','lig','chod','füta','pichi','ko','kura','mawida','trawü-','nütramka-','ülkantu-','kimeltu-'];
const NW2=['ko','lewfü','mawida','kura','mapu','rüpü','kallfü','karü','füta','-we'];
function nameCheck(a,b){const A=NW[a],B=b==='-we'?{k:'we'}:NW[b],en=S.gloss==='en';
  if(a===b)return {ok:0,why:['Repetiste la misma palabra.','You used the same word twice.']};
  if(B.k==='mod')return {ok:0,why:['En mapudungun lo que describe va antes de lo descrito: «'+b+' '+(A.k==='v'?'ko':a)+'», no «'+a.replace('-','')+' '+b+'».','In Mapudungun the describing word comes before what it describes: "'+b+' '+(A.k==='v'?'ko':a)+'", not "'+a.replace('-','')+' '+b+'".']};
  if(B.k==='we'){if(A.k!=='v')return {ok:0,why:['-we («lugar para») se pega a un verbo, como en paliwe (pali-we, donde se juega palin). '+a+' no es un verbo.','-we ("place for") attaches to a verb, as in paliwe (pali-we, where palin is played). '+a+' is not a verb.']};
    const r=a.replace('-',''),m=r+'we';return {ok:1,m:m[0].toUpperCase()+m.slice(1),es:'lugar para '+A.es,en:'place to '+A.en}}
  if(A.k==='v')return {ok:0,why:['Un verbo solo no nombra un lugar: necesita -we. Prueba «'+a.replace('-','')+'we».','A bare verb does not name a place: it needs -we. Try "'+a.replace('-','')+'we".']};
  const m=a+' '+b;
  if(A.k==='mod')return {ok:1,m:m[0].toUpperCase()+m.slice(1),es:B.es+' '+(A.es.endsWith('o')&&['agua','tierra','piedra'].includes(B.es)?A.es.slice(0,-1)+'a':A.es),en:A.en+' '+B.en};
  return {ok:1,m:m[0].toUpperCase()+m.slice(1),es:B.es+' de '+A.es,en:A.en+' '+B.en}}
function nameSpot(spot,back){
  const en=S.gloss==='en';S.names=S.names||{};const cur=S.names[spot];
  const start=()=>choose({m:'___ ___',es:'Primera palabra del nombre:',en:'First word of the name:'},NW1.map(w=>({m:w,g:en?NW[w].en:NW[w].es,v:w})),a=>{
    choose({m:a.replace(/-$/,'')+' ___',es:'Segunda palabra (o -we, «lugar para»):',en:'Second word (or -we, "place for"):'},NW2.map(w=>({m:w,g:w==='-we'?(en?'place for…':'lugar para…'):(en?NW[w].en:NW[w].es),v:w})),b=>{
      const r=nameCheck(a,b);track('nombres de lugares',!!r.ok);
      if(!r.ok){sfx('bad');return say([N(r.why[0],r.why[1])],()=>choose({es:'¿Otra vez?',en:'Try again?'},[{m:'May',v:1},{m:'Wüla müten',v:0}],v=>v?start():back&&back(),true,true))}
      sfx('lvl');S.names[spot]={m:r.m,es:r.es,en:r.en};persist();
      say([L('',r.m,'«'+r.es+'». Es un nombre bien formado: desde hoy este lugar se llama así.','"'+r.en+'". It is a well-formed name: from today this place is called that.')],back)},true)},true);
  if(cur)return say([L('',cur.m,'Este lugar ya se llama «'+cur.m+'» ('+(en?cur.en:cur.es)+').','This place is already called "'+cur.m+'" ('+(en?cur.en:cur.es)+').')],()=>
    choose({es:'¿Cambiar el nombre?',en:'Change the name?'},[{m:'May',g:en?'Build a new one':'Armar otro',v:1},{m:'Wüla müten',v:0}],v=>{if(v)start()},true,true));
  say([N('Un letrero en blanco. Aquí nadie recuerda cómo se llamaba este lugar. Arma un nombre con palabras que conoces: lo que describe va antes («kallfü ko», agua azul), y -we se pega a un verbo para decir «lugar para» («trawüwe»).','A blank sign. Nobody here remembers what this place was called. Build a name with words you know: the describing word goes first ("kallfü ko", blue water), and -we attaches to a verb to mean "place for" ("trawüwe").')],start)}
function placeGloss(id){const M2=MAPS[id],n=S.names&&S.names[M2&&M2.spot];return n?{es:'«'+n.es+'»',en:'+n.en+'}:M2.g}
function placeName(id){const n=S.names&&S.names[MAPS[id]&&MAPS[id].spot];return n?(MAPS[id].metroName?'Metro · ':'')+n.m:MAPS[id].name}

/* ---------- maps ---------- */
addMap('s_feria',Object.assign({},WARIA,{bg:'feria',name:'Santiago · feria',g:{es:'La feria grande, junto a la plaza',en:'The big street market, by the plaza'},seed:5,
 edges:{right:{to:'s_plaza',x:1,y:3}},doors:{'24,2':{to:'s_radio',x:7,y:7}},
 bld:{'0,0':{shop:1,door:3},'7,0':{shop:1,door:2},'15,0':{shop:1,door:2},'21,0':{door:3},'30,0':{shop:1,door:1},'35,0':{shop:1,door:2}},
 ents:[{id:'casera2',kind:'npc',look:'cook',fem:1,x:16,y:8,dir:'down',fixed:1,talk:()=>feriaTalk(),bub:['¡A luca, a luca!','¡Lleve, lleve!']},
   {id:'fgrito1',kind:'npc',look:'walker',x:8,y:9,dir:'down',fixed:1,flag:'sw1',talk:()=>noiseTalk(0),bub:['¡Oferta!','¡Barato, barato!']},
   {id:'fgrito2',kind:'npc',look:'kona',x:27,y:9,dir:'down',fixed:1,flag:'sw1',talk:()=>noiseTalk(1),bub:['¡Pasen, pasen!','¡Lleve tres!']},
   {id:'fabuela',kind:'npc',look:'kuku',fem:1,x:33,y:10,dir:'left',fixed:1,talk:()=>noiseTalk(2),bub:['Mari mari...','¿nadie?']},
   {id:'fkid',kind:'npc',look:'child',x:12,y:12,path:[[12,12],[24,12],[24,10],[12,10]],pause:40,talk:()=>noiseTalk(3),bub:['¡Mamá!']},
   {id:'fdog',kind:'npc',look:'dog',x:30,y:12,path:[[30,12],[36,12]],pause:60,talk:()=>dogTalk()},
   {kind:'enemy',x:5,y:10,party:['wirarun'],flag:'sw1'},{kind:'enemy',x:36,y:8,party:['drone','wirarun'],flag:'sw1'},{kind:'enemy',x:26,y:12,party:['drone','drone'],flag:'sw1'},
   {id:'ngoyngoyun',song:'stgoBoss1',kind:'enemy',x:20,y:10,party:['ngoyngoyun'],fixed:1,boss:1,req:'feria_ready',flag:'sw1',prex:()=>llakoPapay(),
    pre:[N('La radio, la feria, los parlantes, los gritos, las bocinas: todo el ruido se amontona en medio de la calle y se levanta como una torre que habla con mil bocas.','The radio, the market, the loudspeakers, the shouting, the horns: all the noise piles up in the middle of the street and rises like a tower talking with a thousand mouths.'),
      L('','Ngoyngoyün!','El ruido confuso, como de mucha gente junta. Ahí, entre tanto ruido, nadie escucha el mapudungun. Cálmalo (llako-), hazlo dormir (umawtu-) y que se vaya (amutu-).','Confused noise, like a crowd all talking at once. In so much noise, nobody hears Mapudungun. Calm it (llako-), put it to sleep (umawtu-) and make it go (amutu-).')],
    post:()=>postWarden(1)}]}));
addMap('s_radio',Object.assign({},DEPTO,{name:'Radio · Wallmapu Waria',g:{es:'La radio comunitaria de la ruka urbana',en:'The urban ruka\'s community radio'},
 edges:{down:{to:'s_feria',x:24,y:3}},
 ents:[{id:'radiofe',kind:'npc',look:'weaver',fem:1,x:4,y:3,dir:'right',fixed:1,talk:()=>radioTalk(),bub:['Mari mari kom pu che...','¿me escuchan?']},
   {id:'radio',kind:'npc',obj:'radio',x:7,y:3,fixed:1,talk:()=>radioTune()}]}));
addMap('s_metro',Object.assign({},METRO,{name:'Metro · estación',g:{es:'Una estación sin nombre',en:'A station with no name'},spot:'st_metro',metroName:1,
 edges:{down:{to:'s_calle',x:30,y:2}},stairs:{to:'s_m1',x:1,y:2},
 ents:[{id:'mworker',kind:'npc',look:'lonko2',x:4,y:3,dir:'right',fixed:1,talk:()=>metroWorkerTalk(),bub:['Ngamleftripael...','¿dónde están todos?']},
   {id:'msign',kind:'npc',obj:'letrero',spot:'st_metro',x:7,y:1,fixed:1,talk:()=>nameSpot('st_metro')},
   {id:'torno1',kind:'npc',obj:'torno',x:12,y:4,fixed:1,flag:'torno1',talk:()=>tornoTalk(1)},
   {id:'mpas',kind:'npc',look:'walker',x:16,y:5,path:[[16,5],[19,5],[19,3],[16,3]],pause:50,talk:()=>say([L('Pasajero','¡Permiso, permiso! Voy atrasado.','¡Permiso, permiso! Voy atrasado.','Excuse me, excuse me! I am late.')]),bub:['¡Permiso!']}]}));
addMap('s_m1',Object.assign({},METRO,{name:'Metro · andén',g:{es:'El andén y el túnel de servicio',en:'The platform and the service tunnel'},spot:'st_m1',metroName:1,
 edges:{left:{to:'s_metro',x:18,y:3}},stairs:{to:'s_m2',x:1,y:4},chests:{'23,5':'mawgift'},
 ents:[{id:'spk1',kind:'npc',look:'weaver',fem:1,x:14,y:6,dir:'down',fixed:1,talk:()=>speakerTalk(1),bub:['...','Mari mari, mari mari...']},
   {id:'m1sign',kind:'npc',obj:'letrero',spot:'st_m1',x:12,y:1,fixed:1,talk:()=>nameSpot('st_m1')},
   {id:'torno2',kind:'npc',obj:'torno',x:20,y:8,fixed:1,flag:'torno2',talk:()=>tornoTalk(2)},
   {kind:'enemy',x:8,y:8,party:['dewu','dewu']},{kind:'enemy',x:19,y:2,party:['drone','dewu']},{kind:'enemy',x:4,y:6,party:['dewu']}]}));
addMap('s_m2',Object.assign({},METRO,{name:'Metro · línea abandonada',g:{es:'Una línea vieja, medio inundada',en:'An old line, half flooded'},spot:'st_m2',metroName:1,
 edges:{left:{to:'s_m1',x:21,y:7}},stairs:{to:'s_m3',x:1,y:5},chests:{'12,8':'numgift'},
 ents:[{id:'spk2',kind:'npc',look:'elder',x:10,y:7,dir:'down',seated:1,fixed:1,talk:()=>speakerTalk(2),bub:['Kuyfi...','¿alguien?']},
   {id:'m2sign',kind:'npc',obj:'letrero',spot:'st_m2',x:3,y:1,fixed:1,talk:()=>nameSpot('st_m2')},
   {kind:'enemy',x:12,y:4,party:['dewu','dewu','wirarun']},{kind:'enemy',x:3,y:7,party:['wirarun','dewu']},{kind:'enemy',x:16,y:3,party:['drone','drone','dewu']},
   {id:'m2mini',kind:'enemy',x:20,y:4,party:['drone','wirarun','drone'],fixed:1,mini:1,flag:'m2mini',
    pre:[N('Desde la oscuridad del túnel llega un zumbido de hélices y gritos de parlante: drones y wekufü cuidan el paso.','From the dark of the tunnel comes a buzz of rotors and loudspeaker shouts: drones and wekufü guard the way.')]}]}));
addMap('s_m3',Object.assign({},METRO,{name:'Metro · cocheras',g:{es:'Donde la línea termina',en:'Where the line ends'},
 edges:{left:{to:'s_m2',x:22,y:7}},stairs:{to:'s_metro',x:17,y:3},
 ents:[{id:'spk3',kind:'npc',look:'kona',x:21,y:8,dir:'left',fixed:1,talk:()=>speakerTalk(3),bub:['♪ ...','Mapudungun mew...']},
   {kind:'enemy',x:3,y:4,party:['dewu','wirarun']},
   {id:'ngamlef',song:'stgoBoss2',kind:'enemy',x:15,y:5,party:['ngamlef'],fixed:1,boss:1,req:'spk_all',flag:'sw2',
    pre:[N('Cuando los tres hablantes se miran por fin, algo se interpone entre ellos: una figura hecha de líneas de metro que tiran cada una para su lado.','When the three speakers finally look at one another, something steps between them: a figure made of metro lines, each pulling its own way.'),
      L('','Pu mapuche ñi ngamleftripael!','La dispersión: la gente mapuche repartida por toda la ciudad, cada uno creyendo que está solo. Llámalos (küpa-), que salgan (tripa-), y que no retrocedan (wüñotreka-, en negativo).','The dispersion: the Mapuche people scattered across the whole city, each believing they are alone. Call them (küpa-), have them come out (tripa-), and do not let them step back (wüñotreka-, negated).')],
    post:()=>postWarden(2)}]}));
addMap('s_blocks',Object.assign({},WARIA,{bg:'blocks',name:'Santiago · los blocks',g:{es:'Los departamentos, al este de la población',en:'The apartment blocks, east of the población'},seed:13,
 edges:{left:{to:'s_poblacion',x:32,y:2}},doors:{'12,2':{to:'s_depto',x:6,y:6},'22,2':{to:'s_chuchu',x:5,y:6}},
 bld:{'0,0':{door:3},'9,0':{door:3},'18,0':{door:4},'27,0':{door:3},'0,11':{door:4},'10,11':{door:2},'17,11':{door:3},'25,11':{door:4}},
 ents:[{id:'bmama',kind:'npc',look:'cook',fem:1,x:6,y:6,path:[[6,6],[28,6]],pause:20,talk:()=>blocksTalk(0),bub:['¡Apúrate!','¡Llegamos tarde!']},
   {id:'bteen',kind:'npc',look:'childf',fem:1,x:21,y:9,dir:'left',fixed:1,talk:()=>blocksTalk(1),bub:['...','(audífonos)']},
   {id:'bkids',kind:'npc',look:'child',x:14,y:10,path:[[14,10],[20,10]],pause:30,talk:()=>blocksTalk(2),bub:['¡Pásamela!']},
   {id:'bviejo',kind:'npc',look:'elder',x:12,y:8,dir:'down',seated:1,fixed:1,talk:()=>blocksTalk(3),bub:['Mmm...']},
   {kind:'enemy',x:30,y:10,party:['drone','wirarun'],flag:'sw3'},{kind:'enemy',x:6,y:10,party:['drone'],flag:'sw3'},
   {id:'fillantu',song:'stgoBoss3',kind:'enemy',x:17,y:8,party:['fillantu'],fixed:1,boss:1,req:'blocks_ready',flag:'sw3',
    pre:[N('En el patio de los blocks, entre el ruido de las teles y los portazos, baja de la oscuridad una cabeza enorme que aletea con las orejas: un chonchón grande como una casa. Tiene la boca cerrada con un cierre; ni siquiera puede gritar «tue tue».','In the courtyard of the blocks, among the noise of TVs and slammed doors, a huge head drops out of the dark, beating its ears like wings: a chonchón as big as a house. Its mouth is closed with a zipper; it cannot even cry "tue tue".'),
      L('','Pu che ñi mapudungukenoael fillantü!','Que la gente no hable mapudungun todos los días. No odia la lengua: solo la deja para «después», siempre para después. Despiértalo (nepe-), sácalo afuera (tripa-) y que no se duerma (umawtu-, en negativo).','That people do not speak Mapudungun every day. It does not hate the language: it just leaves it for "later", always for later. Wake it (nepe-), bring it out (tripa-) and do not let it sleep (umawtu-, negated).')],
    post:()=>postWarden(3)}]}));
addMap('s_depto',Object.assign({},DEPTO,{name:'Santiago · departamento',g:{es:'El departamento de una familia',en:'A family\'s flat'},
 edges:{down:{to:'s_blocks',x:12,y:3}},
 ents:[{id:'dnuke',kind:'npc',look:'cook',fem:1,x:3,y:3,dir:'right',fixed:1,talk:()=>dinnerTalk(),bub:['¿Cómo era...?','Küpa... ¿küpamu?']},
   {id:'dchaw',kind:'npc',look:'walker',x:10,y:3,dir:'left',fixed:1,talk:()=>say([L('Chaw','Iñche ka kimnierpuken.','Yo también voy aprendiendo.','I am learning too.'),N('«En la pega todo es en castellano. Pero en la casa... en la casa podríamos.»','"At work everything is in Spanish. But at home... at home we could."')]),bub:['Iñche ka...']},
   {id:'dmesa',kind:'npc',obj:'mesa',x:6,y:3,fixed:1,talk:()=>say([N(S.flags.cena_ok?'La mesa está puesta. Huele a cazuela.':'La mesa está a medio poner. La cena se enfría.',S.flags.cena_ok?'The table is set. It smells of cazuela.':'The table is half set. Dinner is getting cold.')])},
   {id:'dk1',kind:'npc',look:'child',x:4,y:5,path:[[4,5],[9,5]],pause:30,talk:()=>say([L('Pichiche','¡Estoy jugando!','¡Estoy jugando!','I am playing!')]),bub:['¡Estoy jugando!']},
   {id:'dk2',kind:'npc',look:'childf',fem:1,x:10,y:5,dir:'left',fixed:1,talk:()=>say([L('Pichi domo','¿Qué hay de comer?','¿Qué hay de comer?','What is for dinner?')]),bub:['¿Qué hay?']}]}));
addMap('s_chuchu',Object.assign({},DEPTO,{name:'Santiago · departamento de la chuchu',g:{es:'El departamento de una abuela',en:'A grandmother\'s flat'},
 edges:{down:{to:'s_blocks',x:22,y:3}},
 ents:[{id:'chuchu',kind:'npc',look:'kuku',fem:1,x:3,y:3,dir:'right',seated:1,fixed:1,talk:()=>chuchuTalk(),bub:['Fillantü...','Mapudungun...']},
   {id:'tel',kind:'npc',obj:'tel',x:7,y:2,fixed:1,talk:()=>phoneTalk()}]}));

/* links into the existing city, and the new gates */
MAPS.s_plaza.edges.left={to:'s_feria',x:38,y:3};
MAPS.s_poblacion.edges.right={to:'s_blocks',x:1,y:3};
MAPS.s_calle.doors=Object.assign(MAPS.s_calle.doors||{},{'30,1':{to:'s_metro',x:10,y:8}});
MAPS.s_calle.bld['29,0']={metro:1,door:1};   // the metro entrance looks like one, not like a shop door
MAPS.s_calle.rows=MAPS.s_calle.rows.map((r,y)=>y===2?r.slice(0,32)+'I'+r.slice(33):y===6?r.slice(0,33)+'I'+r.slice(34):r);
MAPS.s_calle.metroGate={x:31,y:6,w:2,to:'s_metro',tx:10,ty:8};   // a sidewalk stairwell in the open, not hidden under the HUD in the top row
MAPS.s_calle.signs=Object.assign(MAPS.s_calle.signs||{},{'33,6':[L('','Metro','Una entrada del metro. Bajas por la escalera, al lado del tótem rojo.','A metro entrance. Go down the stairs, next to the red totem.')],'32,2':[L('','Metro','La entrada del metro. Abajo, alguien escribió con plumón: «¿y si le ponemos nombre en mapudungun?».','The metro entrance. Below it, someone wrote in marker: "what if we name it in Mapudungun?".')]});
for(const e of MAPS.s_poblacion.ents)if(e.id==='yewen')e.req='sw_all';

/* ---------- district 1: the feria and the radio (ngoyngoyün) ---------- */
function noiseTalk(i){const en=S.gloss==='en';
  if(S.flags.sw1)return say([[L('Feriante','Mari mari! Kiñe kilo poñü fali kechu pataka peso.','¡Hola! Un kilo de papas, quinientos pesos.','Hello! A kilo of potatoes, five hundred pesos.')],[L('Feriante','Kümey!','¡Bien!','Good!')],
    [L('Chachay','Mari mari! Fewla allkütungey.','¡Hola! Ahora sí se escucha.','Hello! Now it can be heard.'),N('La abuela se ríe: alguien, por fin, le devolvió el saludo.','The grandmother laughs: someone, at last, returned her greeting.')],[L('Pichiche','Mari mari!','¡Hola!','Hello!')]][i]);
  say([[L('Feriante','¡A luca, a luca, a luca la palta!','¡A luca, a luca, a luca la palta!','A luca, a luca, avocados for a luca!'),N('No te escucha: grita por encima de todos los demás.','He does not hear you: he shouts over everyone else.')],
    [L('Feriante','¡Pasen, pasen! ¡Lleve tres, pague dos!','¡Pasen, pasen! ¡Lleve tres, pague dos!','Come in, come in! Take three, pay for two!'),N('Su voz se mezcla con la radio, la bocina de una micro y un parlante con cumbia.','His voice mixes with the radio, a bus horn and a speaker playing cumbia.')],
    [L('Kuku','Mari mari... mari mari...','Hola... hola...','Hello... hello...'),N('Saluda en mapudungun a cada persona que pasa. Nadie la oye. «Antes, en esta feria, se escuchaba el mapudungun en cada puesto», te dice, «ahora el ruido se lo come todo».','She greets each passer-by in Mapudungun. Nobody hears her. "Before, in this market, you heard Mapudungun at every stall," she tells you, "now the noise swallows everything."')],
    [L('Pichiche','¿Qué? ¡No te escucho!','¿Qué? ¡No te escucho!','What? I cannot hear you!')]][i])}
const FERIA_Q=[
  {q:L('Casera','Kiñe kilo poñü: kechu pataka peso fali.','¿Cuánto cuesta el kilo de papas?','How much is a kilo of potatoes?'),o:['500','5000','105'],a:'500'},
  {q:L('Casera','Kiñe kilo tomate: kiñe waranka peso fali.','¿Cuánto cuesta el kilo de tomates?','How much is a kilo of tomatoes?'),o:['1000','100','10'],a:'1000'},
  {q:L('Casera','Epu sandia: epu waranka kechu pataka peso fali.','¿Cuánto cuestan las dos sandías?','How much are the two watermelons?'),o:['2500','2050','5200'],a:'2500'},
  {q:L('Casera','Kiñe atado kulantro: küla pataka peso fali.','¿Cuánto cuesta el atado de cilantro?','How much is the bunch of coriander?'),o:['300','30','3000'],a:'300'},
  {q:L('Casera','Kiñe kofke: pataka mari peso fali.','¿Cuánto cuesta un pan?','How much is one bread roll?'),o:['110','1010','200'],a:'110'}];
function feriaTalk(){const en=S.gloss==='en';
  if(S.flags.feria_ok)return say([L('Casera','Chaltu may, '+nm()+'.','Gracias, '+nm()+'.','Thank you, '+nm()+'.'),
    N(S.flags.sw1?'«Desde que se calmó el ruido, la mitad de la feria cobra en mapudungun. ¡Y la otra mitad está aprendiendo!»':S.flags.radio_ok?'«¿Sientes cómo se amontona el ruido en medio de la calle? Algo se está juntando ahí.»':'«Si quieres que se escuche el mapudungun, ve a la radio de la ruka, ahí arriba. Hace días que no se le entiende nada.»',
      S.flags.sw1?'"Since the noise calmed down, half the market charges in Mapudungun. And the other half is learning!"':S.flags.radio_ok?'"Can you feel the noise piling up in the middle of the street? Something is gathering there."':'"If you want Mapudungun to be heard, go to the ruka\'s radio, up there. For days nobody has understood a word of it."')]);
  say([L('Casera','Mari mari! Chem ayüymi?','¡Hola! ¿Qué quieres?','Hello! What would you like?'),
    N('«Yo quiero cobrar en mapudungun, como mi abuela. Pero con este ruido nadie me entiende los números... ¿Tú sí? A ver: te digo el precio y tú me dices cuánto es.»','"I want to charge in Mapudungun, like my grandmother. But with this noise nobody understands my numbers... Do you? Let us see: I say the price and you tell me how much it is."'),
    N('pataka es cien y waranka es mil. Se multiplica hacia la izquierda y se suma hacia la derecha: epu waranka kechu pataka = 2 × 1000 + 5 × 100.','pataka is a hundred and waranka is a thousand. You multiply to the left and add to the right: epu waranka kechu pataka = 2 × 1000 + 5 × 100.')],()=>{
    let ok=0;const qs=shuf(FERIA_Q).slice(0,4);
    const ask=i=>{if(i>=qs.length){if(ok>=3){S.flags.feria_ok=1;S.gold+=60;swCheck();persist();sfx('lvl');
        return say([L('Casera','Kümey! Kimimi!','¡Bien! ¡Sabes!','Good! You know it!'),N('+60 ngülliw. «Ahora falta que se escuche. Sube a la radio de la ruka, la puerta de arriba.»','+60 ngülliw. "Now it needs to be heard. Go up to the ruka\'s radio, the door up there."')])}
        sfx('bad');return say([N(ok+'/4. La casera se ríe: «Casi. Vuelve cuando quieras y lo intentamos de nuevo».',ok+'/4. The stallholder laughs: "Almost. Come back any time and we will try again."')])}
      const q=qs[i];choose(q.q,shuf(q.o).map(x=>({m:x,v:x})),v=>{const g=v===q.a;track('números grandes',g,q.q,q.o,q.a);if(g){ok++;sfx('ok');ask(i+1)}else{sfx('bad');say([N('Era '+q.a+'.','It was '+q.a+'.')],()=>ask(i+1))}},false,true)};
    ask(0)})}
/* llako- is first taught by the ñidol chumpall, in a lake that is optional: anyone who reaches Santiago without it
   learns it here, from the radio (or, as a last resort, from a papay of the feria just before Ngoyngoyün) */
function llakoRadio(){if(S.roots.includes('llako'))return[];S.roots.push('llako');persist();
  return [L('Radio','Llakonge! Llakomün!','¡Cálmate! ¡Cálmense!','Calm down! Calm down, all of you!'),
    N('«Esa es la palabra que el ruido no quiere oír: llako-, calmarse. Llakonge, a uno; llakomu, a dos; llakomün, a muchos. Llévatela: allá abajo la vas a necesitar.»','"That is the word the noise does not want to hear: llako-, to calm down. Llakonge, to one; llakomu, to two; llakomün, to many. Take it with you: down there you will need it."'),
    N('Aprendes llako- («calmarse, aplacarse»).','You learn llako- ("to calm down, to settle").')]}
function llakoPapay(){if(S.roots.includes('llako'))return[];S.roots.push('llako');persist();
  return [N('Una papay de la feria se planta a tu lado y le grita al ruido con toda su voz:','A papay from the market plants herself beside you and shouts at the noise with all her voice:'),
    L('Papay','Llakonge!','¡Cálmate!','Calm down!'),
    N('Aprendes llako- («calmarse, aplacarse»): llakonge, llakomu, llakomün.','You learn llako- ("to calm down, to settle"): llakonge, llakomu, llakomün.')]}
function radioTalk(){
  if(S.flags.radio_ok&&!S.roots.includes('llako'))return say([L('Radio','Mari mari kom pu che!','¡Hola a todos!','Hello, everyone!')].concat(llakoRadio()));
  if(S.flags.radio_ok)return say([L('Radio','Mari mari kom pu che!','¡Hola a todos!','Hello, everyone!'),N(S.flags.sw1?'«La señal llega a toda la ciudad. Cada mañana, un rato en mapudungun.»':'«Ya tenemos señal... pero allá abajo el ruido se está juntando. Si alguien lo calma, nos van a escuchar.»',S.flags.sw1?'"The signal reaches the whole city. Every morning, a while in Mapudungun."':'"We have signal now... but down there the noise is gathering. If someone calms it, they will hear us."')]);
  say([L('Radio','Mari mari, '+addr(true)+'. Allkütuymi?','Hola. ¿Me escuchas?','Hello. Can you hear me?'),
    N('«Esta es la radio de la ruka urbana. Transmitimos en mapudungun... o transmitíamos. Con tanto ruido la señal se pierde, y en el dial solo se oyen frases a medias.»','"This is the urban ruka\'s radio. We broadcast in Mapudungun... or we used to. With so much noise the signal gets lost, and on the dial you only hear half-formed sentences."'),
    N('«Ayúdame a sintonizar: en cada vuelta, solo una estación dice bien la frase. Esa es la nuestra. Usa la consola.»','"Help me tune in: on each turn, only one station says the sentence right. That one is ours. Use the console."')])}
const RADIO_R=[
  {es:'Busca la estación que dice «yo voy».',en:'Find the station that says "I go".',o:['88.1 · Iñche amun.','94.5 · Iñche amuymi.','101.3 · Iñche amuy.'],a:'88.1 · Iñche amun.'},
  {es:'Busca: «no iré».',en:'Find: "I will not go".',o:['90.3 · Amulan.','97.7 · Amulayan.','104.9 · Amuan.'],a:'97.7 · Amulayan.'},
  {es:'Busca: «¡vengan!» (a muchos).',en:'Find: "come!" (to many).',o:['89.9 · Küpange!','93.1 · Küpamu!','99.5 · Küpamün!'],a:'99.5 · Küpamün!'},
  {es:'Busca: «ella está durmiendo».',en:'Find: "she is sleeping".',o:['91.7 · Umawtuy.','95.3 · Umawtuley.','102.1 · Umawtulen.'],a:'95.3 · Umawtuley.'}];
function radioTune(){
  if(S.flags.radio_ok)return say([L('','Wallmapu Waria · 97.7','La aguja está fija en la estación de la ruka. Se escucha un ül, una canción, muy clara.','The needle is fixed on the ruka\'s station. A song, an ül, comes through very clearly.')]);
  const ask=i=>{if(i>=RADIO_R.length){S.flags.radio_ok=1;swCheck();persist();sfx('lvl');
      return say([L('Radio','Mari mari kom pu che! Fewla mapudungun mew nütramkayaiñ.','¡Hola a todos! Ahora vamos a conversar en mapudungun.','Hello, everyone! Now we will talk in Mapudungun.'),
        N('La señal entra limpia. Pero en la calle, en vez de bajar, el ruido sube: los gritos, las bocinas y los parlantes se amontonan en medio de la feria, como si algo no quisiera que se oyera la radio.','The signal comes in clean. But in the street, instead of dropping, the noise rises: the shouts, the horns and the speakers pile up in the middle of the market, as if something did not want the radio to be heard.').concat(llakoRadio())],()=>swCheck())}
    const r=RADIO_R[i];sfx('swirl');
    choose({m:'≈≈≈ '+(i+1)+'/'+RADIO_R.length+' ≈≈≈',es:r.es,en:r.en},shuf(r.o).map(x=>({m:x,v:x})),v=>{const g=v===r.a;track('radio (frases)',g,{m:'',es:r.es,en:r.en},r.o,r.a);
      if(g){sfx('ok');ask(i+1)}else{sfx('bad');say([N('Kshhhh... Solo estática. Esa frase no dice lo que buscas.','Kshhhh... Only static. That sentence does not say what you are looking for.')],()=>ask(i))}},false,true)};
  ask(0)}

/* ---------- district 2: the Metro (pu mapuche ñi ngamleftripael) ---------- */
function metroWorkerTalk(){
  if(S.flags.sw2)return say([L('Trabajador','Mari mari! Kiñekiñe akuyngün.','¡Hola! Van llegando de a uno.','Hello! They keep arriving one by one.'),N('«Los jueves, en la ruka urbana, se juntan los que encontraste. Y cada semana llega uno más.»','"On Thursdays, at the urban ruka, the people you found get together. And every week one more arrives."')]);
  say([L('Trabajador','Mari mari, '+addr(false)+'.','Hola.','Hello.'),
    N('«Trabajo en el metro hace treinta años. Por aquí pasa media ciudad, y en media ciudad hay gente que habla mapudungun. Pero cada uno cree que es el único.»','"I have worked in the metro for thirty years. Half the city passes through here, and in half the city there are people who speak Mapudungun. But each one believes they are the only one."'),
    N('«Allá abajo, en los andenes y en la línea vieja, hay hablantes perdidos entre la gente. Encuéntralos. Y si puedes, ponle nombre a las estaciones: aquí se nos olvidó cómo se llamaban.»','"Down there, on the platforms and the old line, there are speakers lost among the crowd. Find them. And if you can, name the stations: here we forgot what they were called."')])}
function tornoTalk(n){
  const B=n===1?{q:{es:'El torniquete pide una palabra para dejarte pasar: «nosotros dos iremos».',en:'The turnstile asks for a word to let you through: "we two will go".'},
      slots:[[{m:'amu-',v:'amu'},{m:'küpa-',v:'küpa'}],[{m:'—',g:'nada',v:''},{m:'-la-',g:'no',v:'la'}],[{m:'—',g:'nada',v:''},{m:'-a-',g:'futuro',v:'a'}],[{m:'-n',v:'n'},{m:'-yu',v:'yu'},{m:'-iñ',v:'iñ'},{m:'-ymi',v:'ymi'}]],target:'amuayu'}
    :{q:{es:'Otro torniquete: «no fui».',en:'Another turnstile: "I did not go".'},
      slots:[[{m:'amu-',v:'amu'},{m:'iya-',v:'iya'}],[{m:'—',g:'nada',v:''},{m:'-la-',g:'no',v:'la'}],[{m:'—',g:'nada',v:''},{m:'-a-',g:'futuro',v:'a'}],[{m:'-n',v:'n'},{m:'-yu',v:'yu'},{m:'-y',v:'y'}]],target:'amulan'};
  say([N('Un torniquete viejo. En la pantallita, en vez de «pase su tarjeta», dice: «arma la palabra».','An old turnstile. On its little screen, instead of "tap your card", it says: "build the word".')],()=>buildVerb(B,(ok,got)=>{
    if(!ok){sfx('bad');return say([N('Armaste «'+got+'». La luz sigue roja.','You built "'+got+'". The light stays red.')])}
    S.flags['torno'+n]=1;persist();sfx('door');ents=ents.filter(e=>e.id!=='torno'+n);
    say([L('',B.target,'Bip. La luz se pone verde y el torniquete gira.','Beep. The light turns green and the turnstile turns.')])}))}
const SPEAKERS={
 1:{who:'Domo',items:[
   {q:L('Domo','...Mari mari? Kim mapudungukeymi am?','...¿Hola? ¿Sabes hablar mapudungun?','...Hello? Can you speak Mapudungun?'),o:['May, pichin mapudungun.','Mapudungun pingen.','Amulan.'],a:'May, pichin mapudungun.'},
   {q:L('Domo','Iñche Temuko tuwün. Eymi kay, chew tuwimi?','Yo soy de Temuco. ¿Y tú, de dónde eres?','I am from Temuco. And you, where are you from?'),o:['Santiago tuwün.','Santiago pingen.','Santiago amuan.'],a:'Santiago tuwün.'}],
  end:[N('Se le llenan los ojos de agua y se ríe al mismo tiempo. «Veinte años en Santiago, y pensé que era la única que lo hablaba en esta línea.»','Her eyes fill with tears and she laughs at the same time. "Twenty years in Santiago, and I thought I was the only one who spoke it on this line."')]},
 2:{who:'Chachay',items:[
   {q:L('Chachay','Iney pingeymi am?','¿Cómo te llamas?','What is your name?'),o:['Iñche @ pingen.','Eymi @ pingeymi.','Fey @ pingey.'],a:'Iñche @ pingen.'},
   {q:L('Chachay','Kimimi mapudungun?','¿Sabes mapudungun?','Do you know Mapudungun?'),o:['May, pichin kimün.','May, pichin kimi.','Kimün pingen.'],a:'May, pichin kimün.'}],
  end:[N('El chachay deja la bolsa en el suelo. «Cuarenta años de micro y de metro, y nadie con quien hablarlo. Mis nietos me entienden, pero no me contestan.»','The old man sets his bag on the ground. "Forty years of buses and metro, and nobody to speak it with. My grandchildren understand me, but they do not answer."')]},
 3:{who:'Weche',items:[
   {q:L('Weche','Fey ta tañi ül. Ayüfimi am?','Esta es mi canción. ¿Te gusta?','This is my song. Do you like it?'),o:['May, ayüfiñ!','May, ayüy.','Ül pingen.'],a:'May, ayüfiñ!'},
   {q:L('Weche','Trawün mew ülkantuan. Küpayaymi?','Voy a cantar en el trawün. ¿Vas a venir?','I will sing at the gathering. Will you come?'),o:['May, küpayan.','May, küpay.','Küpa pingen.'],a:'May, küpayan.'}],
  end:[N('Se saca los audífonos. «Escribo canciones en mapudungun y las canto acá abajo, donde nadie me escucha. Pensé que a nadie le importaba.»','He takes off his headphones. "I write songs in Mapudungun and sing them down here, where nobody hears me. I thought nobody cared."')]}};
function speakerTalk(n){const D=SPEAKERS[n];
  if(S.flags['spk'+n])return say([L(D.who,'Trawün mew pewayiñ!','¡Nos vemos en el trawün!','See you at the gathering!')]);
  convo(D.items,()=>{S.flags['spk'+n]=1;swCheck();persist();sfx('lvl');
    const k=['spk1','spk2','spk3'].filter(f=>S.flags[f]).length;
    say(D.end.concat([L(D.who,'Trawüleaiñ!','¡Juntémonos!','Let us gather!'),N('Encontraste '+k+' de 3 hablantes.'+(k===3?' Algo se mueve en las cocheras, al final de la línea: algo que no quiere que se junten.':''),'You have found '+k+' of 3 speakers.'+(k===3?' Something stirs in the depot, at the end of the line: something that does not want them to meet.':''))]))},'hablantes del metro')}

/* ---------- district 3: the blocks (pu che ñi mapudungukenoael fillantü) ---------- */
function blocksTalk(i){
  if(S.flags.sw3)return say([[L('Ñuke','Küpamün, pu pichikeche!','¡Vengan, niños!','Come, children!'),N('Ahora la mamá llama a sus hijos en mapudungun. Ellos todavía contestan en castellano... pero vienen.','Now the mother calls her children in Mapudungun. They still answer in Spanish... but they come.')],
    [L('Weche domo','Mari mari! Ka iñche kimnierpuken.','¡Hola! Yo también voy aprendiendo.','Hello! I am learning too.')],[L('Pichikeche','Kiñe, epu, küla!','¡Uno, dos, tres!','One, two, three!')],[L('Chachay','Fillantü, fillantü.','Todos los días, todos los días.','Every day, every day.'),N('«Así se aprende: un poquito, todos los días.»','"That is how you learn: a little, every day."')]][i]);
  say([[L('Mamá','¡Apúrate, que llegamos tarde! Después, después...','¡Apúrate, que llegamos tarde! Después, después...','Hurry up, we are late! Later, later...'),N('Pasa corriendo con dos bolsas y un niño de la mano.','She runs past with two bags and a child by the hand.')],
    [L('Weche domo','Mi abuela me habla en mapudungun y yo le entiendo todo... pero le contesto en castellano. No sé por qué.','Mi abuela me habla en mapudungun y yo le entiendo todo... pero le contesto en castellano. No sé por qué.','My grandmother speaks to me in Mapudungun and I understand everything... but I answer in Spanish. I do not know why.')],
    [L('Pichiche','¡Pásamela, pásamela!','¡Pásamela, pásamela!','Pass it, pass it!')],
    [L('Chachay','Mapudungun... fillantü ka pichin kimnierpuken.','Mapudungun... cada día voy sabiendo un poquito más.','Mapudungun... every day I come to know a little more.'),N('«Así me lo enseñó mi madre. Pero aquí todos están apurados, y la lengua siempre queda para mañana. Pasa por el departamento de la familia de arriba, y por el de la chuchu: ellos quieren hablarlo en la casa.»','"That is how my mother taught it to me. But here everyone is in a hurry, and the language is always left for tomorrow. Stop by the family upstairs, and the chuchu\'s flat: they want to speak it at home."')]][i])}
function dinnerTalk(){
  if(S.flags.cena_ok)return say([L('Ñuke','Chaltu may, '+nm()+'. Fillantü mapudungukeaiñ.','Gracias. Vamos a hablar mapudungun todos los días.','Thank you. We will speak Mapudungun every day.')]);
  say([L('Ñuke','Mari mari! Konpange.','¡Hola! Pasa.','Hello! Come in.'),
    N('«Queremos hablar mapudungun en la casa. Lo aprendimos en la ruka urbana, pero en la casa se nos olvida: llegamos cansados y sale el castellano. ¿Nos ayudas con la cena? Tú dime qué decir.»','"We want to speak Mapudungun at home. We learned it at the urban ruka, but at home we forget: we come home tired and Spanish comes out. Will you help us with dinner? You tell me what to say."')],()=>
    convo([
      {q:N('La comida está lista. Llama a los dos niños a la mesa.','Dinner is ready. Call the two children to the table.'),o:['Küpamu!','Küpange!','Küpamün!'],a:'Küpamu!',hint:['Son dos niños: -mu.','There are two children: -mu.'],
        after:[L('Pichikeche','Küpayu!','¡Vamos!','Coming!')]},
      {q:N('Que se sienten los dos.','Tell the two of them to sit down.'),o:['Anümu!','Anünge!','Anümün!'],a:'Anümu!',hint:['A dos personas: -mu.','To two people: -mu.']},
      {q:N('Pide el pan.','Ask for the bread.'),o:['Elumuen kofke.','Kofke pingen.','Kofketuan.'],a:'Elumuen kofke.',hint:['Pides que te den algo: elumuen, «dame».','You are asking to be given something: elumuen, "give me".']},
      {q:N('La comida estaba rica. Da las gracias.','The food was good. Say thank you.'),o:['Chaltu may.','Pewkayal.','Mari mari.'],a:'Chaltu may.'}],()=>{
      S.flags.cena_ok=1;swCheck();persist();sfx('lvl');
      say([N('Los niños se ríen y repiten «küpamu, anümu» toda la cena, mandándose entre ellos. La mamá te guiña un ojo.','The children laugh and repeat "küpamu, anümu" all through dinner, bossing each other around. The mother winks at you.'),
        L('Ñuke','Fillantü!','¡Todos los días!','Every day!')].concat(S.flags.tel_ok?[N('Abajo, en el patio, algo enorme y gris se acomoda y bosteza.','Down in the courtyard, something huge and grey settles in and yawns.')]:[]))},'cena en mapudungun'))}
function chuchuTalk(){
  if(S.flags.tel_ok)return say([L('Chuchu','Kümelen, '+nm()+'. Fillantü mapudungun mew nütramkakeiñ tañi pu yall iñchiñ.','Estoy bien. Todos los días conversamos en mapudungun, mis nietos y yo.','I am well. Every day my grandchildren and I talk in Mapudungun.')]);
  say([L('Chuchu','Mari mari, pichi weche.','Hola, jovencito.','Hello, young one.'),
    N('«Mis nietos viven al lado y casi no me hablan en mapudungun. Yo tampoco insisto: pienso que les da vergüenza, o que no les sirve. ¿Me ayudas a llamar a alguien que todavía lo habla todos los días? El teléfono está ahí.»','"My grandchildren live next door and hardly ever speak Mapudungun to me. I do not insist either: I think they feel ashamed, or that it is no use to them. Will you help me call someone who still speaks it every day? The phone is right there."')])}
function phoneTalk(){
  if(S.flags.tel_ok)return say([N('El teléfono descansa. La chuchu dice que mañana llama otra vez.','The phone rests. The chuchu says she will call again tomorrow.')]);
  say([N('Marcas el único número que te sabes de memoria: el de la ruka de tu kuku, allá en el lof lafkenche. Suena una vez, dos...','You dial the only number you know by heart: your kuku\'s ruka, back in the Lafkenche lof. It rings once, twice...')],()=>convo([
    {q:L('Kuku','Mari mari, @! Chumleymi?','¡Hola! ¿Cómo estás?','Hello! How are you?'),o:['Kümelen, eymi kay?','Kümeley.','Chumleymi.'],a:'Kümelen, eymi kay?'},
    {q:L('Kuku','Chew müleymi?','¿Dónde estás?','Where are you?'),o:['Santiago mew mülen.','Santiago mew müley.','Santiago pingen.'],a:'Santiago mew mülen.'},
    {q:L('Kuku','Mapudungukeymi waria mew?','¿Hablas mapudungun en la ciudad?','Do you speak Mapudungun in the city?'),o:['May, fillantü mapudungukeiñ!','May, mapudungukey.','Mapudungun pingen.'],a:'May, fillantü mapudungukeiñ!'}],()=>{
    S.flags.tel_ok=1;swCheck();persist();sfx('lvl');
    say([N('La chuchu te pide el teléfono con las manos temblando. Y entonces pasa algo: dos abuelas que nunca se han visto, una en Santiago y otra junto al mar, conversan en mapudungun como si se conocieran de toda la vida.','The chuchu asks for the phone with trembling hands. And then it happens: two grandmothers who have never met, one in Santiago and one by the sea, talk in Mapudungun as if they had known each other all their lives.'),
      L('Chuchu','Wüle, tañi pu yall mew mapudungun mew nütramkayan. Fillantü.','Mañana les voy a hablar en mapudungun a mis nietos. Todos los días.','Tomorrow I will talk to my grandchildren in Mapudungun. Every day.')].concat(S.flags.cena_ok?[N('Abajo, en el patio, algo enorme y gris se acomoda y bosteza.','Down in the courtyard, something huge and grey settles in and yawns.')]:[]))},'teléfono con la kuku'))}

/* ---------- the wardens fall ---------- */
function postWarden(n){S.flags['sw'+n]=1;swCheck();persist();sfx('lvl');
  const left=3-swDone(),en=S.gloss==='en';
  const L1={1:[N('La torre de ruido se desarma: los parlantes se apagan uno a uno, la tele se queda en negro, y en el silencio que queda se oye, clarita, la radio de la ruka.','The tower of noise comes apart: the speakers fall silent one by one, the TV goes black, and in the silence that is left you hear, clear as day, the ruka\'s radio.'),
      L('Radio','Mari mari kom pu che! Fewla mapudungun mew nütramkayaiñ!','¡Hola a todos! ¡Ahora vamos a conversar en mapudungun!','Hello, everyone! Now we will talk in Mapudungun!'),
      N('La feria vuelve a gritar, pero ahora, entre los gritos, alguien cobra en mapudungun, y otro le contesta.','The market shouts again, but now, among the shouting, someone charges in Mapudungun, and someone else answers.')],
    2:[N('Las líneas que tiraban cada una para su lado se sueltan y vuelven a ser lo que eran: un mapa del metro. Un mapa donde todas las líneas se cruzan en algún lugar.','The lines that pulled each its own way let go and become what they were: a metro map. A map where every line crosses the others somewhere.'),
      N('La domo de Temuco, el chachay y el weche de las canciones se miran, se ríen y se saludan los tres a la vez.','The woman from Temuco, the old man and the young singer look at one another, laugh, and greet each other all at once.'),
      L('Pu che','Mari mari! Trawüleaiñ!','¡Hola! ¡Juntémonos!','Hello! Let us gather!'),
      N('Quedan en verse los jueves en la ruka urbana. «Y cada uno trae a alguien», dice el chachay.','They agree to meet on Thursdays at the urban ruka. "And each of us brings someone," says the old man.')],
    3:[N('La cosa gris bosteza una última vez... y el cierre de su boca se abre. No grita, no ruge: dice, bajito, «mari mari». Después se deshace en el aire del atardecer, como el sueño cuando por fin te levantas.','The grey thing yawns one last time... and the zipper on its mouth comes open. It does not shout, it does not roar: it says, quietly, "mari mari". Then it melts into the evening air, like sleep when you finally get up.'),
      N('En el patio de los blocks, una mamá llama a sus hijos en mapudungun, y desde una ventana la chuchu le contesta.','In the courtyard of the blocks, a mother calls her children in Mapudungun, and from a window the chuchu answers her.'),
      L('','Fillantü!','Todos los días.','Every day.')]}[n];
  const tail=left?[N('Quedan '+left+' de los tres silencios de la ciudad.','There are '+left+' of the city\'s three silences left.')]
    :S.flags.st_all?[N('Los tres silencios de la ciudad cayeron. Pero todo lo que les quitaste tiene que ir a alguna parte: en la cancha de la población, se junta una sombra que se tapa la boca. Yewen.','The city\'s three silences have fallen. But everything you took from them has to go somewhere: in the población cancha, a shadow that covers its mouth is gathering. Yewen.')]
    :[N('Los tres silencios de la ciudad cayeron. Todavía quedan wariache que necesitan una mano: en la plaza, la calle y la población.','The city\'s three silences have fallen. There are still people in the city who need a hand: in the plaza, the street and the población.')];
  say(L1.concat(tail))}

/* wekufü chillka pages for the city */
Object.assign(BEST,{
  wirarun:['Un grito con patas: un parlante viejo que repite lo que oye, más fuerte y peor. Nace del ruido de la ciudad.','A shout on legs: an old loudspeaker that repeats what it hears, louder and worse. It is born of the city\'s noise.'],
  drone:['Un dron: un pájaro de metal que zumba sobre la ciudad, mirando todo y repitiendo avisos por su parlante. Vuela alto: bájalo con nagtu-.','A drone: a metal bird buzzing over the city, watching everything and repeating announcements through its speaker. It flies high: bring it down with nagtu-.'],
  dewu:['El dewü (ratón) de los túneles del metro: rápido, mordedor, y siempre de a muchos.','The dewü (rat) of the metro tunnels: fast, biting, and always in numbers.'],
  ngoyngoyün:['Ngoyngoyün: el ruido confuso, como de mucha gente reunida. No odia el mapudungun: lo tapa.','Ngoyngoyün: confused noise, like a crowd all talking at once. It does not hate Mapudungun: it drowns it out.'],
  ngamlef:['Pu mapuche ñi ngamleftripael: la dispersión de la gente mapuche por la ciudad, cada uno creyéndose solo.','Pu mapuche ñi ngamleftripael: the scattering of the Mapuche people across the city, each one believing they are alone.'],
  fillantu:['Pu che ñi mapudungukenoael fillantü: que la gente no hable mapudungun todos los días. Siempre lo deja para después. Aquí vuela como un chonchón gigante, con la boca cerrada con un cierre y los días tachados en el cráneo.','Pu che ñi mapudungukenoael fillantü: people not speaking Mapudungun every day. It always leaves it for later. Here it flies as a giant chonchón, its mouth zipped shut and the days crossed out on its skull.']});
BEST.ngoyngoyun=BEST.ngoyngoyün;
// more kutral in Santiago: before, the only one was inside the urban ruka, so a long city stretch had nowhere to rest and save
for(const [k,x,y] of [['s_plaza',14,9],['s_calle',37,13],['s_feria',38,10],['s_metro',2,6],['s_m2',2,8],['s_m3',9,9],['s_blocks',33,9]])
  MAPS[k].rows=MAPS[k].rows.map((r,yy)=>yy===y?r.slice(0,x)+'F'+r.slice(x+1):r);
