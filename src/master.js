/* ============================================================
   MASTER COPY (testing build only; never in the player build)
   Start at any region with the earlier ones already done,
   jump to any map, heal, skip battles.
   ============================================================ */
const MCHK=[
  {m:'Kuyfi · Pukem · lof',es:'Llegada al lof de los antiguos (Liwen te encuentra)',en:'Arrival at the ancestors\' lof (Liwen finds you)',lvl:4,at:['k_lof',1,8],set:['intro','pentu']},
  {m:'Kuyfi · Pukem · madriguera',es:'Entrada de la madriguera del Kolokolo, con Liwen y -ke-',en:'Entrance of the Kolokolo\'s burrow, with Liwen and -ke-',lvl:6,at:['kd1',1,6],set:['intro','pentu','liwen','kimke','kyarr']},
  {m:'Kuyfi · Pukem · Kolokolo',es:'Prueba: Liwen, «Iñchiw» (-yu) y «Kimün» (-ke-) contra el Kolokolo',en:'Test: Liwen, «Iñchiw» (-yu) and «Kimün» (-ke-) against the Kolokolo',lvl:8,at:['kd_den',8,9],set:['intro','pentu','liwen','kimke','kyarr'],fight:['kolokolo']},
  {m:'Lafkenche · inicio',es:'Desde el principio, sin la escena inicial',en:'From the start, skipping the opening scene',lvl:1,at:['rupu',1,6],set:[]},
  {m:'Lafkenche · lof',es:'Con el pentukuwün ya hecho',en:'With the pentukuwün already done',lvl:3,at:['lof',17,9],set:['intro','pentu']},
  {m:'Lafkenche · cueva',es:'Entrada de la cueva del trelke-wekufü',en:"Entrance of the trelke-wekufü's cave",lvl:4,at:['inaltu',21,5],set:['intro','pentu']},
  {m:'Lafkenche · jefe',es:'Frente a Trelke-wekufü',en:'Facing Trelke-wekufü',lvl:6,at:['ngen',8,9],set:['intro','pentu','lafcave']},
  {m:'Lafkenche · pantanos',es:'Fotra mapu: la diweñfe y la piedra -fe',en:'The marshes: the diweñfe and the -fe stone',lvl:5,at:['l_wapi',8,1],set:['intro','pentu','lafcave','lafdone']},
  {m:'Lafkenche · islotes (difícil)',es:'Külakura wapi: zona difícil, piedra -fu-',en:'The stone islets: hard area, the -fu- stone',lvl:12,at:['l_islote',5,1],set:['intro','pentu','lafcave','lafdone']},
  {m:'Lafkenche · wekufü secreto',es:'Junto al barro del Chiñifilu (pantanos): camina un paso al este para despertarlo',en:'Beside the Chiñifilu\'s mud (marshes): walk one step east to wake it',lvl:12,at:['l_wapi',19,11],set:['intro','pentu','lafcave','lafdone']},
  {m:'Nagche · inicio',es:'Lafkenche completa; camino a los llanos',en:'Lafkenche complete; road to the lowlands',lvl:7,at:['n_rupu',1,7],set:['intro','pentu','lafcave','lafdone']},
  {m:'Nagche · lof',es:'En el lof nagche, antes de hablar con el lonko',en:'In the Nagche lof, before talking to the lonko',lvl:7,at:['n_lof',17,9],set:['intro','pentu','lafcave','lafdone']},
  {m:'Nagche · guarida',es:'Entrada de la guarida del Witranalwe',en:"Entrance of the Witranalwe's lair",lvl:8,at:['n_mawida',28,4],set:['intro','pentu','lafcave','lafdone','naglof']},
  {m:'Nagche · jefe',es:'Frente al Witranalwe',en:'Facing the Witranalwe',lvl:10,at:['ngen2',8,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave']},
  {m:'Nagche · completa',es:'Dos trokiñ',en:'Two trokiñ',lvl:11,at:['n_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone']},
  {m:'Nagche · menoko',es:'El humedal: lawen y la trutruka',en:'The wetland: lawen and the trutruka',lvl:11,at:['n_menoko',5,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone']},
  {m:'Nagche · cerros (difícil)',es:'Winkul mapu: zona difícil, adjetivos en -ke',en:'The hill country: hard area, -ke adjectives',lvl:14,at:['n_winkul',16,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone']},
  {m:'Nagche · wekufü secreto',es:'Junto a la loma del Piwüchen (cerros): camina un paso al este para despertarlo',en:'Beside the Piwüchen\'s knoll (hills): walk one step east to wake it',lvl:15,at:['n_winkul',26,4],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone']},
  {m:'Pewenche · inicio',es:'Nagche completa; camino a la cordillera',en:'Nagche complete; road to the mountains',lvl:12,at:['p_rupu',1,7],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone']},
  {m:'Pewenche · lof',es:'En el lof pewenche, antes de hablar con el lonko',en:'In the Pewenche lof, before talking to the lonko',lvl:12,at:['p_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone']},
  {m:'Pewenche · morada',es:'Entrada de la morada del Cherufe',en:"Entrance of the Cherufe's lair",lvl:13,at:['p_pillan',28,4],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof']},
  {m:'Pewenche · jefe',es:'Frente al Cherufe',en:'Facing the Cherufe',lvl:15,at:['ngen3',8,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave']},
  {m:'Pewenche · completa',es:'Tres trokiñ',en:'Three trokiñ',lvl:16,at:['p_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone']},
  {m:'Pewenche · filo',es:'Wente degiñ: el konew del viento y ñam-',en:'The windy ridge: the wind konew and ñam-',lvl:16,at:['p_degin',6,11],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone']},
  {m:'Pewenche · riscos (difícil)',es:'Lil mapu: zona difícil, números grandes',en:'The lava crags: hard area, big numbers',lvl:18,at:['p_lil',16,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone']},
  {m:'Pewenche · wekufü secreto',es:'Junto al ojo de agua helado del Wallepeñ: camina un paso al oeste para despertarlo',en:'Beside the Wallepeñ\'s frozen pool: walk one step west to wake it',lvl:18,at:['p_pire',7,14],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone']},
  {m:'Williche · inicio',es:'Pewenche completa; camino al sur',en:'Pewenche complete; road south',lvl:17,at:['w_rupu',4,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone']},
  {m:'Williche · lof',es:'En el lof williche, antes de hablar con el lonko',en:'In the Williche lof, before talking to the lonko',lvl:17,at:['w_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone']},
  {m:'Williche · cueva',es:'Entrada de la cueva del Kaleuche',en:"Entrance of the Kaleuche's cave",lvl:18,at:['w_inaltu',24,6],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof']},
  {m:'Williche · jefe',es:'Frente al Kaleuche',en:'Facing the Kaleuche',lvl:20,at:['ngen4',8,10],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave']},
  {m:'Williche · isla',es:'Wapi: el kurantu y la piedra dual',en:'The island: the kurantu and the dual stone',lvl:18,at:['w_wapi',15,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave']},
  {m:'Williche · cascada (difícil)',es:'Trayen mapu: zona difícil, el konew de la cascada',en:'The waterfall gorge: hard area, the waterfall konew',lvl:20,at:['w_trayen',16,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone']},
  {m:'Williche · wekufü secreto',es:'Junto al puente del Trawko (cascada): camina un paso al oeste para despertarlo',en:'Beside the Trawko\'s bridge (waterfall gorge): walk one step west to wake it',lvl:21,at:['w_trayen',16,7],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone']},
  {m:'Williche · completa',es:'Cuatro trokiñ; listo para Puelmapu',en:'Four trokiñ; ready for Puelmapu',lvl:21,at:['w_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone']},
  {m:'Puelmapu · inicio',es:'Williche completa; la bajada al este de la cordillera',en:'Williche complete; the way down the east side',lvl:21,at:['e_rupu',1,7],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone']},
  {m:'Puelmapu · lof',es:'En el lof puelche, antes de hablar con el lonko',en:'In the Puelche lof, before talking to the lonko',lvl:21,at:['e_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone']},
  {m:'Puelmapu · mallín',es:'El humedal de la pampa: -me- y -pa-',en:'The wet meadow: -me- and -pa-',lvl:22,at:['e_mallin',16,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof']},
  {m:'Puelmapu · chenque',es:'Entrada del chenque del Walichu (meseta)',en:"Entrance of the Walichu's chenque (meseta)",lvl:22,at:['e_meseta',20,6],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof']},
  {m:'Puelmapu · jefe',es:'Frente al Walichu (lleva nepe-)',en:'Facing the Walichu (bring nepe-)',lvl:24,at:['ngen5',8,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave']},
  {m:'Puelmapu · salitral (difícil)',es:'Chadi mapu: zona difícil, la piedra -rke-',en:'The salt flat: hard area, the -rke- stone',lvl:24,at:['e_salitral',24,1],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone']},
  {m:'Puelmapu · wekufü secreto',es:'Junto a la poza sur del salitral: camina un paso al este, sobre la tierra agrietada',en:'Beside the southern salt-flat pool: walk one step east, onto the cracked ground',lvl:25,at:['e_salitral',14,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone']},
  {m:'Puelmapu · completa',es:'Kechu trokiñ: el trariwe COMPLETO',en:'Five trokiñ: the trariwe COMPLETE',lvl:25,at:['e_lof',17,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone']},
  {m:'Ngoyman mapu · umbral',es:'Con el trariwe completo, junto a la niebla del oeste',en:'With the complete trariwe, beside the western fog',lvl:26,at:['rupu',2,10],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone']},
  {m:'Ngoyman mapu · Epunamun',es:'La prueba del guerrero de dos caras, en el umbral de la niebla',en:"The two-faced warrior's trial, at the threshold of the fog",lvl:26,at:['ngoyman',6,8],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','sbosses']},
  {m:'Ngoyman mapu · tierras robadas',es:'Dentro de la niebla: cinco cautivos esperan en cinco tierras grises',en:'Inside the fog: five captives wait in five grey lands',lvl:26,at:['ngoyman',2,6],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone']},
  {m:'Ngoyman mapu · puerta',es:'Los cinco cautivos liberados; ante la puerta del gran olvido',en:'All five captives freed; before the gate of the great forgetting',lvl:27,at:['g_wulngin',8,7],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands']},
  {m:'Ngoyman mapu · kalku secreto',es:'La pampa robada: camina un paso al oeste, sobre la tierra agrietada',en:'The stolen plain: walk one step west, onto the cracked ground',lvl:27,at:['g_puel',25,8],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','sbosses']},
  {m:'Ngoyman mapu · jefe final',es:'El corazón de la niebla: Ti Fütra Ngoymatulfe (tres formas)',en:'The heart of the fog: Ti Fütra Ngoymatulfe (three forms)',lvl:28,at:['g_ngoyman',8,9],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','sbosses']},
  {m:'Münche lafken · jardines',es:'Bajo el lago: los chumpall y sus problemas',en:'Under the lake: the chumpall and their troubles',lvl:28,at:['u_garden',3,7],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon']},
  {m:'Münche lafken · jefe (5 formas)',es:'El salón de los chumpall: el Millalobo (cinco formas)',en:'The chumpall hall: the Millalobo (five forms)',lvl:29,at:['u_throne',8,5],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','chq']},
  {m:'Santiago · retorno',es:'Tras el jefe final: el portal a la waria',en:'After the final boss: the portal to the city',lvl:30,at:['l_ruka2',7,5],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','sbosses','kalkudone','epuwon','chq','chdone','stgocall']},
  {m:'Santiago · feria · jefe Ngoyngoyün',es:'Precios y radio resueltos: el ruido espera en la feria',en:'Prices and radio solved: the noise waits in the market',lvl:30,at:['s_feria',20,7],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','stgocall','stgoseen','sw1pre']},
  {m:'Santiago · metro · jefe Ngamleftripael',es:'Tres hablantes encontrados: las cocheras',en:'Three speakers found: the depot',lvl:30,at:['s_m3',10,5],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','stgocall','stgoseen','sw2pre']},
  {m:'Santiago · blocks · jefe Mapudungukenoael fillantü',es:'Cena y teléfono resueltos: el patio de los blocks',en:'Dinner and phone solved: the blocks courtyard',lvl:31,at:['s_blocks',16,6],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','stgocall','stgoseen','sw3pre']},
  {m:'Santiago · Yewen',es:'La waria: las cinco personas ayudadas; el Yewen espera en la cancha',en:'The city: the five people helped; the Yewen waits on the cancha',lvl:31,at:['s_poblacion',14,6],set:['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','sbosses','kalkudone','epuwon','chq','chdone','stgocall','stgofive','swall']}];
{const yw=['intro','pentu','lafcave','lafdone','naglof','nagcave','nagdone','pewlof','pewcave','pewdone','willof','wilcave','wildone','puellof','puelcave','pueldone','ngoylands','finalwon','sbosses','kalkudone','epuwon','chq','chdone','stgocall','stgofive','swall','yewenwon'];
 MCHK.push({m:'Upewtuwün mapu · secreto',es:'Todos los secretos hechos: tu sombra se va por una grieta en el camino del mar',en:'Every secret done: your shadow walks off through a crack on the sea road',lvl:32,at:['rupu',2,6],set:yw},
   {m:'Upewtuwün mapu · jefe secreto (tu sombra)',es:'Camino y lof restaurados: tu sombra espera en la ruka de tu kuku',en:'Road and lof restored: your shadow waits in your kuku\'s ruka',lvl:32,at:['y_ruka',6,7],set:yw.concat(['ngoyrest'])})}
const MSET={kyarr:s=>{s.flags.ky_arrive=1;s.flags.ky_open=1},liwen:s=>{s.flags.liwen=1},kimke:s=>{s.flags.kimke=1},
  yewenwon:s=>{Object.assign(s.flags,{yewen_won:1,stgo_done:1,stgo_seen:1})},
  ngoyrest:s=>{Object.assign(s.flags,{llaw_seen:1,'yfull:y_rupu':1,'yfull:y_lof':1,'ng_in:y_rupu':1,'ng_in:y_lof':1});for(const k of ['4,4','13,5','20,4','27,4'])s.flags['yw:y_rupu:'+k]=1;for(const k of ['yteach','ycook','yweave','ylonko','ymom'])s.flags['yw:y_lof:'+k]=1},
  intro:s=>{s.flags.intro=1;s.roots.push('küpa')},
  pentu:s=>{Object.assign(s.flags,{pentu_prac:1,pentukun:1});s.roots.push('umawtu','nagtu');s.items.kulon+=2},
  lafcave:s=>{Object.assign(s.flags,{rune_kil:1,mini1:1,mini2:1,mini3:1,'pz:d1':1,'pz:d2':1});s.runes.push('kil');s.items.lawen+=2;s.items.kofke+=2},
  lafdone:s=>{Object.assign(s.flags,{ngen:1,dive:1,boss:1,awake_lafkenche:1});s.pieces.push('lafkenche');s.gear.trariwe=1;s.gear.makun=1},
  naglof:s=>{Object.assign(s.flags,{chuchu:1,nag_lonko:1,herd_task:1,herd:1,awar:1,'pz:n_lewfu':1});s.roots.push('llüka');s.piwke+=1},
  nagcave:s=>{Object.assign(s.flags,{root_winotu:1,nmini1:1,nmini2:1,nmini3:1,'pz:nd1':1,'pz:nd2':1});s.roots.push('wüñotreka');s.items.lawen+=2},
  willof:s=>{Object.assign(s.flags,{cheche:1,wil_lonko:1,wil_time:1,'pz:w_mawida':1});s.roots.push('lef')},
  wilcave:s=>{Object.assign(s.flags,{root_tripa:1,wmini1:1,wmini2:1,wmini3:1,'pz:wd1':1,'pz:wd2':1});s.roots.push('tripa');s.items.lawen+=2},
  wildone:s=>{Object.assign(s.flags,{ngen4:1,wind:1,boss4:1});s.pieces.push('williche')},
  pewlof:s=>{Object.assign(s.flags,{laku:1,pew_lonko:1,pew_ke:1,'pz:p_pewen':1});s.roots.push('trafo')},
  pewcave:s=>{Object.assign(s.flags,{root_wutre:1,pmini1:1,pmini2:1,pmini3:1,'pz:pd1':1,'pz:pd2':1,pew_ngu1:1,pew_ngu2:1,pew_chaiwe:1,pew_basket:1,pew_llawe:1});s.roots.push('wütre');s.items.lawen+=2},
  pewdone:s=>{Object.assign(s.flags,{ngen3:1,snow:1,boss3:1,root_nam:1});s.pieces.push('pewenche');if(!s.roots.includes('ñam'))s.roots.push('ñam')},
  nagdone:s=>{Object.assign(s.flags,{ngen2:1,bramble:1,boss2:1});s.pieces.push('nagche')},
  puellof:s=>{Object.assign(s.flags,{weku:1,puel_lonko:1,puel_dir:1,'pz:e_lelfun':1});s.roots.push('trana')},
  puelcave:s=>{Object.assign(s.flags,{root_nepe:1,emini1:1,emini2:1,emini3:1,'pz:ed1':1,'pz:ed2':1});s.roots.push('nepe');s.items.lawen+=2},
  pueldone:s=>{Object.assign(s.flags,{ngen5:1,lelfun:1,boss5:1});s.pieces.push('puelche')},
  sbosses:s=>{Object.assign(s.flags,{sb1:1,sb2:1,sb3:1,sb4:1,sb5:1})},
  ngoylands:s=>{Object.assign(s.flags,{gm1:1,gm2:1,gm3:1,gm4:1,gm5:1,gm_all:1,ngoy_open:1});s.pieces=s.pieces},
  finalwon:s=>{Object.assign(s.flags,{won:1,bossF:1})},
  chq:s=>{Object.assign(s.flags,{ch1:1,ch2:1,ch3:1,ch2q:1,ch_pearl:1})},
  chdone:s=>{Object.assign(s.flags,{chboss:1});s.gear.lafkenkura=1;if(!s.roots.includes('llako'))s.roots.push('llako')},
  epuwon:s=>{Object.assign(s.flags,{epu_won:1});s.gear.waiki=1},
  kalkudone:s=>{Object.assign(s.flags,{sb6:1})},
  stgocall:s=>{Object.assign(s.flags,{stgo_call:1});if(!s.roots.includes('llako'))s.roots.push('llako')},   // Santiago teaches llako- at the radio for anyone who skipped the lake
  stgoseen:s=>{Object.assign(s.flags,{stgo_seen:1})},
  sw1pre:s=>{Object.assign(s.flags,{feria_ok:1,radio_ok:1,feria_ready:1})},
  sw2pre:s=>{Object.assign(s.flags,{torno1:1,torno2:1,spk1:1,spk2:1,spk3:1,spk_all:1})},
  sw3pre:s=>{Object.assign(s.flags,{cena_ok:1,tel_ok:1,blocks_ready:1})},
  swall:s=>{Object.assign(s.flags,{feria_ok:1,radio_ok:1,feria_ready:1,torno1:1,torno2:1,spk1:1,spk2:1,spk3:1,spk_all:1,cena_ok:1,tel_ok:1,blocks_ready:1,sw1:1,sw2:1,sw3:1,sw3all:1,sw_all:1})},
  stgofive:s=>{Object.assign(s.flags,{stgo_seen:1,st1:1,st2:1,st3:1,st4:1,st5:1,st_all:1})}};
function mBuild(c){
  const s=newState(HERO);s.pieces=[];
  for(const k of c.set)MSET[k](s);
  s.roots=[...new Set(s.roots)];
  for(let l=1;l<c.lvl;l++){s.lvl++;s.baseMax+=HPQ;s.baseAtk+=1;if(s.lvl%2===0)s.baseDef+=1}
  s.gold=60*c.lvl;s.save={map:c.at[0],x:c.at[1],y:c.at[2]};
  if(/jefe|secreto|Epunamun|Yewen/.test(c.m))s.items.mate=25;   // boss checkpoints: plenty of mate for testing
  return s}
function mStart(c){auInit();S=mBuild(c);S.gloss=LANG;S.hp=maxHP();S.sp=SPMAX;$('title').style.display='none';mode='map';AU.name=null;loadMap(c.at[0],c.at[1],c.at[2]);persist();if(c.fight)setTimeout(()=>startBattle(c.fight,{boss:1}),400)}
function mCheckpoints(back){
  choose({es:'Maestro · ¿Desde dónde empiezas?',en:'Master · Where do you start?'},MCHK.map((c,i)=>({m:c.m,g:G(c),v:i})).concat([{m:LANG==='en'?'Back':'Volver',v:'x'}]),v=>{
    if(v===null||v==='x')return back&&back();
    mStart(MCHK[v])},true);
}
/* Master saves made before a root was added to a checkpoint (or reached by 'go to a map') can lack words the
   region already taught. Backfill them from the story flags whenever a map loads or a battle starts. */
const MROOTFLAGS=[['intro','küpa'],['pentukun','umawtu'],['pentukun','nagtu'],['nag_lonko','llüka'],['root_winotu','wüñotreka'],
  ['pew_lonko','trafo'],['root_wutre','wütre'],['ngen3','ñam'],['root_nam','ñam'],['wil_lonko','lef'],['root_tripa','tripa'],
  ['puel_lonko','trana'],['root_nepe','nepe'],['chboss','llako'],['stgocall','llako']];
function mFixRoots(){if(!S||!S.roots)return;let add=0;for(const [f,r] of MROOTFLAGS)if(S.flags[f]&&!S.roots.includes(r)){S.roots.push(r);add=1}if(add)persist()}
const _mLoadMap=loadMap;loadMap=function(){mFixRoots();return _mLoadMap.apply(this,arguments)};
const _mStartBattle=startBattle;startBattle=function(){mFixRoots();return _mStartBattle.apply(this,arguments)};
let MNOENC=false;
const _mEngage=engage;
engage=function(e){if(MNOENC&&!e.boss&&!e.mini)return;_mEngage(e)};
function mMenu(){
  const en=S.gloss==='en';
  if(mode==='battle'){
    return choose({es:'Maestro',en:'Master'},[{m:en?'Win this battle':'Ganar esta pelea',v:'win'},{m:en?'Back':'Volver',v:'x'}],v=>{
      if(v==='win'&&B){B.en.forEach(e=>{e.hp=0;e.dead=true});victory()}else battleMenu()},true);
  }
  if(mode!=='map')return;
  choose({es:'Maestro',en:'Master'},[
    {m:en?'Start from a region':'Empezar desde una región',v:'chk'},
    {m:en?'Go to a map':'Ir a un mapa',v:'map'},
    {m:en?'Heal fully':'Sanar todo',v:'heal'},
    {m:'+100 ngülliw',v:'gold'},
    {m:en?'Learn every word':'Aprender todas las palabras',g:en?'All verb roots, for testing any fight':'Todas las raíces verbales, para probar cualquier pelea',v:'roots'},
    {m:'Lawentuwün',g:en?'Learn the self-heal word (resets its uses)':'Aprender la palabra de autocuración (reinicia sus usos)',v:'laww'},
    {m:(en?'Battles: ':'Peleas: ')+(MNOENC?(en?'off':'no'):(en?'on':'sí')),g:en?'Off: only minibosses and bosses fight':'No: solo pelean minijefes y jefes',v:'enc'},
    {m:en?'Close':'Cerrar',v:'x'}],v=>{
    if(v==='chk')return mCheckpoints(mMenu);
    if(v==='map')return choose({es:'¿A qué mapa?',en:'Which map?'},Object.keys(MAPS).map(k=>({m:MAPS[k].name,g:k,v:k})).concat([{m:en?'Back':'Volver',v:'x'}]),k=>{
      if(!k||k==='x')return mMenu();const m=MAPS[k];sfx('cast');loadMap(k,Math.floor(m.w/2),Math.floor(m.h/2))},true);
    if(v==='heal'){S.hp=maxHP();S.sp=SPMAX;S.curse=0;sfx('heal');persist();return mMenu()}
    if(v==='gold'){S.gold+=100;sfx('pick');persist();return mMenu()}
    if(v==='laww'){S.flags.lawW=1;S.lawuses=0;sfx('lvl');persist();return mMenu()}
    if(v==='roots'){for(const r of Object.keys(ROOTS))if(!S.roots.includes(r))S.roots.push(r);sfx('lvl');persist();return mMenu()}
    if(v==='enc'){MNOENC=!MNOENC;return mMenu()}
  },true);
}
(function(){
  menu.style.zIndex='20';
  const row=document.createElement('div');row.className='row';
  const b=document.createElement('button');b.id='bMaster';b.textContent='Maestro · Elegir región';row.appendChild(b);
  $('bNew').parentNode.after(row);
  b.onclick=()=>{auInit();mCheckpoints()};
  const pb=document.createElement('button');pb.className='sm';pb.id='pX';pb.textContent='MAE';$('ab').prepend(pb);
  const open=()=>{if(!S||!M)return;if(mode==='battle'&&active&&active.kind==='menu'){menu.style.display='none';active=null;return mMenu()}if(!active)mMenu()};
  pb.onclick=open;
  addEventListener('keydown',e=>{if(e.key==='g'||e.key==='G'){e.preventDefault();open()}});
  const tag=document.createElement('div');tag.textContent='MAESTRO';tag.style.cssText='position:fixed;top:4px;left:6px;font:bold 11px monospace;color:#ffd060;background:#000a;padding:2px 6px;border-radius:3px;z-index:99;pointer-events:none';document.body.appendChild(tag);
})();
