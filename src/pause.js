/* ============================================================
   PAUSE MENU
   ============================================================ */
function openPause(){
  const en=S.gloss==='en';
  choose({es:'Menú',en:'Menu'},[
    {m:'Chemkün',g:en?'Items':'Cosas',v:'items'},
    {m:'Kimün',g:en?'Status':'Estado',v:'stats'},
    {m:'Chillka',g:en?'Conjugation book':'Libro de conjugación',v:'book'},
    {m:'Dungun',g:en?'Words learned':'Palabras aprendidas',v:'words'},
    {m:'Küdaw',g:en?'Quest log':'Misiones y pistas',v:'kudaw'},
    {m:'Mapa',g:en?'Progress by land':'Avance por tierra',v:'mapa'},
    {m:'Kimeltun'+(missList().length?' · '+missList().length:''),g:en?'Practice, wekufü chillka, learning report':'Repaso, wekufü chillka, informe de aprendizaje',v:'kim'},
    {m:'Trariwe · '+(S.pieces||[]).length+'/5',g:en?'Pieces of the ancient sash':'Pedazos del trariwe antiguo',v:'trariwe'},
    {m:en?'Settings':'Configuración',g:en?'Glosses, hints, grafemario, music':'Glosas, pistas, grafemario, música',v:'cfg'},
    {m:en?'Title screen':'Volver al inicio',g:en?'Your progress is saved':'Se guarda tu avance',v:'title'},
    {m:en?'Close':'Cerrar',v:'x'}],v=>{
    if(v==='title')return goTitle();
    if(v==='items'){choose({es:'Chemkün',en:'Items'},itemOpts().concat([{m:en?'Back':'Volver',v:'x'}]),k=>{if(!k||k==='x')return;const l=useItem(k);persist();say([l])},true)}
    else if(v==='stats'){const g=Object.keys(GEAR).filter(k=>S.gear[k]).map(k=>GEAR[k].m).join(', ')||'∅';
      say([N(`${S.name} · kimün ${S.lvl} (${S.xp}/${xpNeed()}) · newen ${S.hp}/${maxHP()} · fuerza ${atk()} · defensa ${def()} · ngülliw ${numP(S.gold)} · piwke ${S.piwke%4}/4 · llaves ${S.keys||0}`+(S.curse?' · MALDICIÓN':'')+(S.kutran?' · WEDA KUTRAN':''),
        `${S.name} · kimün ${S.lvl} (${S.xp}/${xpNeed()}) · newen ${S.hp}/${maxHP()} · strength ${atk()} · defense ${def()} · ngülliw ${numP(S.gold)} · piwke ${S.piwke%4}/4 · keys ${S.keys||0}`+(S.curse?' · CURSED':'')+(S.kutran?' · WEDA KUTRAN':'')),
        N('Equipo: '+g,'Gear: '+g)])}
    else if(v==='words'){const ls=S.roots.map(r=>L('',ROOTS[r].m,ROOTS[r].es,ROOTS[r].en));
      ls.push(L('','-nge · -mu · -mün','a uno · a dos · a tres o más','to one · to two · to three or more'));
      if(S.runes.includes('kil'))ls.push(L('','-kil-','prohibición: "¡no...!"','prohibition: "don\'t...!"'));
      const vl=vocabLines();if(vl.length){ls.push(N('— Pu dungu —','— Words —'));ls.push(...vl)}say(ls)}
    else if(v==='trariwe'){const R5=[['lafkenche','Lafkenche'],['nagche','Nagche'],['pewenche','Pewenche'],['williche','Williche'],['puelche','Puelmapu']];
      say([L('','Trariwe trokiñ · '+(S.pieces||[]).length+'/5',R5.map(([k,n])=>((S.pieces||[]).includes(k)?'■ ':'□ ')+n).join('   '),R5.map(([k,n])=>((S.pieces||[]).includes(k)?'■ ':'□ ')+n).join('   ')),
        N('Con los cinco trokiñ, el trariwe completo podrá atravesar la niebla de Ti Fütra Ngoymatulfe, al oeste del camino del mar.','With all five trokiñ, the complete trariwe will be able to pass through the fog of Ti Fütra Ngoymatulfe, west of the sea road.')])}
    else if(v==='kudaw')say(questLines());
    else if(v==='mapa')openAtlas(()=>openPause());
    else if(v==='kim')openKim();
    else if(v==='cfg')openCfg();
    else if(v==='book')openBook(()=>openPause());
  },true);
}


function openCfg(){const en=S.gloss==='en';
  choose({es:'Configuración',en:'Settings'},[    {m:en?'Hints: '+(S.hints?'on':'off'):'Pistas: '+(S.hints?'sí':'no'),g:en?'Show how many each ending addresses':'Mostrar a cuántos se dirige cada terminación',v:'hints'},
    {m:en?'Gloss: English':'Glosa: Español',g:en?'Switch to Spanish':'Cambiar a inglés',v:'lang'},
    {m:'Re mapudungun: '+(S.nogloss?(en?'yes':'sí'):'no'),g:en?'Hide the translation of Mapudungun lines':'Ocultar la traducción de las líneas en mapudungun',v:'nogloss'},
    {m:'Grafemario: '+GRAF_NAME[GRAF],g:en?'Unificado → Azümchefe → Ragileo':'Unificado → Azümchefe → Ragileo',v:'graf'},
    {m:AU.muted?(en?'Music: off':'Música: no'):(en?'Music: on':'Música: sí'),g:en?'Turn the music on or off':'Encender o apagar la música',v:'mus'},
    {m:en?'Back':'Volver',v:'x'}],v=>{
    if(v==='hints'){S.hints=!S.hints;persist();openCfg()}
    else if(v==='lang'){S.gloss=S.gloss==='en'?'es':'en';LANG=S.gloss;persist();openCfg()}
    else if(v==='nogloss'){S.nogloss=S.nogloss?0:1;persist();openCfg()}
    else if(v==='graf'){setGraf({u:'a',a:'r',r:'u'}[GRAF]);openCfg()}
    else if(v==='mus'){toggleMute();openCfg()}
    else openPause()},true)}
function openKim(){const en=S.gloss==='en',n=missList().length,b=Object.keys(S.beaten||{}).length;
  choose({m:'Kimeltun',es:'Aprender',en:'Learning'},[
    {m:'Wiñochillkatun',g:(en?'Practice: 10 questions':'Repaso: 10 preguntas')+(n?(en?', '+n+' you have missed':', '+n+' que te han costado'):''),v:'p'},
    {m:'Wekufü chillka · '+b,g:en?'The wekufü you have beaten':'Los wekufü que has vencido',v:'b'},
    {m:en?'Learning report':'Informe de kimün',g:en?'For you or your teacher: copy or print':'Para ti o tu profe: copiar o imprimir',v:'r'},
    {m:en?'Back':'Volver',v:'x'}],v=>{
    if(v==='p')practice();else if(v==='b')openBestiary(openKim);else if(v==='r')openReport(openKim);else openPause()},true)}

/* ---------- Küdaw: quest log ---------- */
function questLines(){
  const F=S.flags,ls=[],pcs=(S.pieces||[]).length;
  const Q=(t,done,es,en)=>ls.push(L('',(done?'■ ':'▶ ')+t,(done?'(hecho) ':'')+es,(done?'(done) ':'')+en));
  if(!F.pentukun)Q('Chalin',0,'Preséntate con el lonko del lof lafkenche.','Introduce yourself to the lonko of the Lafkenche lof.');
  if(F.sbAll&&!F.epu_won)Q('Epunamun',0,'El Epunamun espera a quien venció a los cinco males escondidos de las cinco tierras: un kona de dos caras, en el umbral de la niebla.','The Epunamun awaits the one who defeated the five hidden evils of the five lands: a two-faced warrior at the threshold of the fog.');
  if(F.pentukun&&!F.won){
    if(pcs<5)Q('Trariwe trokiñ '+pcs+'/5',0,'Reúne los cinco trokiñ del trariwe antiguo, uno por cada tierra.','Gather the five trokiñ of the ancient sash, one from each land.');
    else Q('Ti Fütra Ngoymatulfe',0,'Con el trariwe completo, cruza la niebla al oeste del camino del mar.','With the complete sash, cross the fog west of the sea road.');
  }else{
    const sbs=['sb1','sb2','sb3','sb4','sb5','sb6'].filter(k=>F[k]).length;
    if(!F.chboss)Q('Münche lafken',0,'Una voz débil suena bajo el islote de las piedras del agua, en Willi mapu.','A faint voice sounds beneath the islet of the water stones, in Willi mapu.');
    if(sbs<6)Q('Pu llum wekufü '+sbs+'/6',0,'Seis males antiguos siguen escondidos en los rincones del mapu; el terreno los delata.','Six ancient evils remain hidden in the corners of the land; the ground gives them away.');
    if(F.stgo_call&&!F.stgo_seen)Q('Kuku ñi ruka',0,'Tu kuku te llama desde su ruka, en el lof lafkenche. Allí te espera una puerta de luz.','Your kuku calls you from her ruka, in the Lafkenche lof. A door of light awaits you there.');
    if(F.stgo_seen&&!F.stgo_done){
      {const r=F.feria_ok&&F.radio_ok;Q('Ngoyngoyün',!!F.sw1,r?'El ruido se amontona en medio de la feria. Cálmalo.':'En la feria, al oeste de la plaza: ayuda a la casera con los precios y a la radio de la ruka con la señal.',r?'The noise is piling up in the middle of the market. Calm it.':'In the market, west of the plaza: help the stallholder with prices and the ruka radio with its signal.')}
      Q('Ngamleftripael',!!F.sw2,F.spk_all?'Los tres hablantes se encontraron. Algo los separa en las cocheras.':'En el metro (entrada en la calle): encuentra a los hablantes perdidos ('+['spk1','spk2','spk3'].filter(k=>F[k]).length+'/3).',F.spk_all?'The three speakers have found each other. Something keeps them apart in the depot.':'In the metro (entrance on the street): find the lost speakers ('+['spk1','spk2','spk3'].filter(k=>F[k]).length+'/3).');
      {const r=F.cena_ok&&F.tel_ok;Q('Mapudungukenoael fillantü',!!F.sw3,r?'Algo gris bosteza en el patio de los blocks.':'En los blocks, al este de la población: ayuda a una familia en la cena y a una chuchu con el teléfono.',r?'Something grey is yawning in the courtyard of the blocks.':'In the blocks, east of the población: help a family at dinner and a chuchu with the phone.')}
      Q('Santiago waria',0,'Ayuda a los wariache a hablar sin vergüenza ('+['st1','st2','st3','st4','st5'].filter(k=>F[k]).length+'/5). Cuando caigan los tres silencios, enfrenta al Yewen.','Help the wariache speak without shame ('+['st1','st2','st3','st4','st5'].filter(k=>F[k]).length+'/5). When the three silences fall, face the Yewen.')}
    if(F.llaw_seen&&!F.llaw_won)Q('Llawfeñ',0,'Tu sombra ya no te sigue: se metió en una grieta gris en el camino del mar, donde empezó tu viaje.','Your shadow no longer follows you: it stepped into a grey crack on the sea road, where your journey began.');
    if(F.epu_won&&F.chboss&&sbs>=6)Q('Mapu',1,'La tierra respira. Lo que queda es caminar y aprender.','The land breathes. What remains is to walk and to learn.');
  }
  const MQ=[['laf','Machi (Lafkenche)','pentukun','Saca hojas del foye solo de Fotra mapu, por el lado norte.','Take leaves from the lone foye of Fotra mapu, on the north side.'],
    ['nag','Machi (Nagche)','nag_lonko','Llena el metawe en el ojo de agua del nororiente del menoko.','Fill the metawe at the north-east pool of the menoko.'],
    ['pew','Machi (Pewenche)','pew_lonko','Recoge ngülliw bajo la abuela pewen, en lo más tupido del bosque de abajo.','Gather ngülliw under the grandmother pewen, in the thickest lower forest.'],
    ['wil','Machi (Williche)','wil_lonko','Llena el yiwe al pie del salto de Trayen mapu, donde el agua golpea la piedra.','Fill the yiwe at the foot of the falls in Trayen mapu.'],
    ['puel','Machi (Puelmapu)','puel_lonko','Escarba junto al chacay solo del lelfün de abajo, donde el suelo se pone blanco.','Dig beside the lone chacay of the lower lelfün, where the ground turns white.']];
  for(const [r,t,gate,hes,hen] of MQ){
    if(F['mq_done_'+r])Q(t,1,'La machi te sanará cuando la visites.','The machi will heal you when you visit.');
    else if(F['mqd_'+r])Q(t,0,'Vuelve con la machi: ya tienes lo que pidió.','Return to the machi: you carry what she asked for.');
    else if(F['mql_'+r])Q(t,0,hes,hen);
    else if(F['mq_'+r])Q(t,0,'Habla con el lonko: él tiene su parte.','Speak with the lonko: he has his part.');
  }
  if(F.nico_d)Q('Nico',1,'Nico se presentó con el lonko lafkenche.','Nico introduced himself to the Lafkenche lonko.');
  else if(F.nico_t)Q('Nico',0,'Nico te espera en el lof lafkenche, junto al lonko.','Nico is waiting for you in the Lafkenche lof, beside the lonko.');
  else if(F.nico_q)Q('Nico',0,'Ayuda a Nico a ensayar su presentación, en el camino del mar.','Help Nico practise his introduction, on the sea road.');
  if(F.seba_d)Q('Seba',1,'El Kiltro volvió con Seba.','Kiltro is back with Seba.');
  else if(F.seba_dog)Q('Seba',0,'El Kiltro volvió al lof nagche: ve a ver a Seba.','Kiltro ran back to the Nagche lof: go and see Seba.');
  else if(F.seba_q)Q('Seba',0,'El perro de Seba anda por los campos de los animales. Llámalo en mapudungun.','Seba\'s dog is out in the animal fields. Call him in Mapudungun.');
  if(F.carmen_d)Q('Carmen Lienkura',1,'El mushay de Carmen está listo para el trawün.','Carmen\'s mushay is ready for the trawün.');
  else if(F.carmen_q)Q('Carmen Lienkura',0,'Llévale tres külon (maqui) a Carmen, en el lof williche ('+(S.items.kulon||0)+'/3).','Take three külon (maqui) to Carmen, in the Williche lof ('+(S.items.kulon||0)+'/3).');
  if(F.nacho_d)Q('Nacho',1,'La chuchu de Nacho recibió su audio.','Nacho\'s chuchu got his voice message.');
  if(F.l_diwd)Q('Diweñ',1,'El diweñfe quedó contento.','The diweñ gatherer is happy.');
  else if(F.l_diwq)Q('Diweñ',0,'Junta tres diweñes en Fotra mapu para el diweñfe.','Gather three diweñ in Fotra mapu for the diweñfe.');
  if(F.n_lawd)Q('Lawen kachu',1,'La lawentuchefe tiene sus hierbas.','The healer has her herbs.');
  else if(F.n_lawq)Q('Lawen kachu',0,'Junta tres matas de lawen en el borde del agua del menoko.','Gather three lawen plants at the water edge of the menoko.');
  {const tn=TAB_IDS.filter(t=>S.flags['tab_'+t]).length;if(S.gear.trarilongko)Q('Kuyfi chillka',1,'Las seis piedras despertaron: el trarilongko es tuyo (defensa +3).','All six stones are awake: the trarilongko is yours (defense +3).');
   else if(S.flags.intro)Q('Kuyfi chillka '+tn+'/6',0,'Piedras antiguas talladas con lecciones de mapudungun, una en cada tierra. Despierta las seis.','Ancient stones carved with Mapudungun lessons, one in each land. Wake all six.')}
  {const tn=TRW_IDS.filter(k=>S.flags['trw_'+k]).length;if(S.flags.intro)Q('Trawün '+tn+'/5',tn>=5,'En cada lof hay una ruka del trawün (con su cartel) donde un kimeltuchefe da una lección de mapudungun.','In every lof there is a trawün ruka (with its sign) where a kimeltuchefe gives a Mapudungun lesson.')}
  {const nk=['lof','n_lof','p_lof','w_lof','e_lof'].filter(k=>S.flags['ntk_'+k]).length;if(nk)Q('Nütramkan '+nk+'/5',nk>=5,'En cada lof hay alguien joven que quiere conversar contigo.','In every lof there is a young person who wants to talk with you.')}
  if(S.gear.trutruka)Q('Trutruka',1,'La trutruka es tuya: tócala en las peleas.','The trutruka is yours: blow it in battle.');
  else if(F.n_trut_q)Q('Trutruka',0,'Cayó entre los juncos, junto al agua del medio del menoko.','It fell among the reeds, beside the middle pool of the menoko.');
  if(F.herd)Q('Kulliñ',1,'Los animales volvieron al corral.','The animals are back in the pen.');
  else if(F.herd_task)Q('Kulliñ',0,'Arrea las ovejas y la waka de vuelta al corral del campo.','Herd the sheep and the waka back to the field pen.');
  if(F.pew_llawe)Q('Chaiwe',1,'El chachay Nawel tiene su canasto.','Chachay Nawel has his basket.');
  else if(F.pew_basket)Q('Chaiwe',0,'Llévale el chaiwe al chachay Nawel.','Take the chaiwe back to chachay Nawel.');
  else if(F.pew_chaiwe)Q('Chaiwe',0,'El chaiwe del chachay se perdió entre los árboles de Mawida mapu.','The chachay\'s basket was lost among the trees of Mawida mapu.');
  if(F.puel_pichd)Q('Choyke pichuñ',1,'El niño recuperó su pluma.','The boy has his plume back.');
  else if(F.puel_kidq)Q('Choyke pichuñ',0,'La pluma del niño anda perdida por el lelfün.','The boy\'s plume is lost somewhere on the lelfün.');
  if(!ls.length)ls.push(N('No tienes küdaw pendientes.','You have no pending tasks.'));
  return ls}
/* ---------- Mapa: progress overview ---------- */
function mapaLines(){
  const F=S.flags,pcs=S.pieces||[];
  const RG=[['Lafkenche','pentukun','laf','lafkenche'],['Nagche','nag_lonko','nag','nagche'],
    ['Pewenche','pew_lonko','pew','pewenche'],['Williche','wil_lonko','wil','williche'],['Puelmapu','puel_lonko','puel','puelche']];
  const bx=v=>v?'■':'□';
  const ls=RG.map(([n,lk,mr,pk])=>L('',n,
    bx(F[lk])+' lonko   '+bx(F['mq_done_'+mr])+' machi   '+bx(pcs.includes(pk))+' trokiñ',
    bx(F[lk])+' lonko   '+bx(F['mq_done_'+mr])+' machi   '+bx(pcs.includes(pk))+' trokiñ'));
  const ng=['ngen','ngen2','ngen3','ngen4','ngen5'].filter(k=>F[k]).length;
  const sbs=['sb1','sb2','sb3','sb4','sb5','sb6'].filter(k=>F[k]).length;
  ls.push(L('','Mapu',
    'Ngen despiertos '+ng+'/5 · Llum wekufü '+sbs+'/6 · '+(F.chboss?'■':'□')+' Münche lafken · '+(F.won?'■':'□')+' Fütra Ngoymatulfe · '+(F.epu_won?'■':'□')+' Epunamun · '+(F.yewen_won?'■':'□')+' Yewen'+(F.llaw_seen?' · '+(F.llaw_won?'■':'□')+' Upewtuwün mapu':''),
    'Ngen awakened '+ng+'/5 · Hidden wekufü '+sbs+'/6 · '+(F.chboss?'■':'□')+' Münche lafken · '+(F.won?'■':'□')+' Fütra Ngoymatulfe · '+(F.epu_won?'■':'□')+' Epunamun · '+(F.yewen_won?'■':'□')+' Yewen'+(F.llaw_seen?' · '+(F.llaw_won?'■':'□')+' Upewtuwün mapu':'')));
  if(S.hm)ls.push(L('','Weichafe'+(S.hm>1?' ×'+S.hm:''),'Modo héroe: conservas tu kimün y tus cosas, pero los wekufü crecen contigo y las pruebas no dan pistas.','Hero mode: you keep your kimün and your things, but the wekufü grow with you and the trials give no hints.'));
  return ls}
/* ---------- vocabulary unlocked outside battle roots ---------- */
function vocabLines(){
  const F=S.flags,ls=[];
  const V=[[()=>F.lawW,'Lawentuwün','palabra de sanación: te cura en batalla','healing word: heals you in battle'],
    [()=>S.gear.trutruka,'trutruka','corneta larga de colihue con cuerno','long colihue horn'],
    [()=>S.gear.trarilongko,'trarilongko','cinta tejida que se amarra en la frente','woven band tied around the forehead'],
    [()=>F.mq_done_laf||F.mq_laf,'foye · tapül','canelo, árbol sagrado de la machi · hoja','canelo, the machi\'s sacred tree · leaf'],
    [()=>F.mq_done_nag||F.mq_nag,'metawe · menoko','cántaro de greda · ojo de agua','clay jug · spring pool'],
    [()=>F.mq_done_pew||F.mq_pew,'ngülliw · llellipun','piñón del pewen · rogativa','pewen nut · rogation ceremony'],
    [()=>F.mq_done_wil||F.mq_wil,'trayen · yiwe','cascada · vaso de madera','waterfall · wooden cup'],
    [()=>F.mq_done_puel||F.mq_puel,'chadi','sal de la tierra','salt of the earth'],
    [()=>F.mq_done_laf,'rewe','el altar escalonado de la machi','the machi\'s stepped altar'],
    [()=>S.items.mate>0||F.mq_done_nag,'mate','infusión caliente que repone newen','hot infusion that restores newen']];
  for(const [cond,m,es,en] of V)if(cond())ls.push(L('',m,es,en));
  return ls}
/* ---------- Chillka: conjugation book ---------- */
const BOOK={
  pers:{m:'Iñche, eymi, fey...',es:'Personas (presente)',en:'Persons (present)',lines:[
    N('Ejemplo con pe- ("ver"), que termina en vocal:','Example with pe- ("see"), which ends in a vowel:'),
    L('','iñche pen · eymi peymi · fey pey','yo veo · tú ves · él/ella ve','I see · you see · he/she sees'),
    L('','iñchiu peyu · eymu peymu · feyengu peyngu','nosotros dos vemos · ustedes dos ven · ellos dos ven','we two see · you two see · they two see'),
    L('','iñchiñ peiñ · eymün peymün · feyengün peyngün','nosotros vemos · ustedes ven · ellos ven','we see · you all see · they see'),
    N('Si la raíz termina en consonante, se agrega -i- o -ü-. Ejemplo con kon- ("entrar"):','If the root ends in a consonant, -i- or -ü- is added. Example with kon- ("enter"):'),
    L('','iñche konün · eymi konimi · fey koni','yo entro · tú entras · él/ella entra','I enter · you enter · he/she enters'),
    L('','feyengu koningu · feyengün koningün','ellos dos entran · ellos entran','they two enter · they enter')]},
  poss:{m:'Tañi, tami, ñi',es:'¿De quién es?',en:'Whose is it?',lines:[
    N('Estas palabras van antes del sustantivo y dicen de quién es.','These words go before the noun and say whose it is.'),
    L('','tañi chillka · tami chillka · ñi chillka','mi libro · tu libro · su libro (de él o de ella)','my book · your book · his / her book'),
    L('','taiñ chillka · tamün chillka','nuestro libro · el libro de ustedes','our book · your (plural) book')]},
  plur:{m:'Pu ...',es:'Dos y muchos',en:'Two and many',lines:[
    N('pu va antes del sustantivo cuando son muchas personas o animales.','pu goes before the noun when there are many people or animals.'),
    L('','pu che · pu domo · pu kawellu','la gente · las mujeres · los caballos','the people · the women · the horses'),
    N('Y el verbo cambia: -ngu para dos, -ngün para tres o más. Ejemplo con pe- ("ver"):','And the verb changes: -ngu for two, -ngün for three or more. Example with pe- ("see"):'),
    L('','epu wentru peyngu · pu wentru peyngün','dos hombres ven · los hombres ven','two men see · the men see')]},
  dir:{m:'Pikun, puel...',es:'Los rumbos',en:'Directions',lines:[
    N('Los cuatro rumbos. Con püle se dice «hacia»: pikun püle, «hacia el norte».','The four directions. With püle you say «toward»: pikun püle, «toward the north».'),
    L('','pikun · willi · puel · ngulu','norte · sur · este · oeste','north · south · east · west'),
    N('Por eso la gente del sur es williche y la tierra del este es Puelmapu.','That is why the people of the south are williche and the land of the east is Puelmapu.')]},
  kin:{m:'Pu che',es:'La familia',en:'The family',lines:[
    L('','chaw · ñuke','papá · mamá','father · mother'),
    L('','kuku · laku','la mamá y el papá de tu papá','your father\'s mother and father'),
    L('','chuchu · cheche','la mamá y el papá de tu mamá','your mother\'s mother and father'),
    N('Con tañi y ñi se dice de quién: tañi chaw ñi ñuke, «la mamá de mi papá».','With tañi and ñi you say whose: tañi chaw ñi ñuke, «my father\'s mother».')]},
  time:{m:'Wiya, fachantü, wüle',es:'Ayer, hoy, mañana',en:'Yesterday, today, tomorrow',lines:[
    L('','wiya · fachantü · wüle','ayer · hoy · mañana','yesterday · today · tomorrow'),
    N('Sin -a-, el verbo puede contar lo que pasa o lo que ya pasó; con -a-, lo que todavía no pasa.','Without -a-, the verb can tell what happens or what already happened; with -a-, what has not happened yet.')]},
  quest:{m:'Chem, iney, chew...',es:'Preguntas',en:'Questions',lines:[
    L('','chem · iney · chew · chumül · chumten','qué · quién · dónde · cuándo · cuánto','what · who · where · when · how much'),
    L('','Chem pimi? · Iney eymi? · Chew amuaymi?','¿Qué dijiste? · ¿Quién eres? · ¿A dónde irás?','What did you say? · Who are you? · Where will you go?')]},
  fe:{m:'-fe',es:'Los oficios',en:'Trades and doers',lines:[
    N('-fe convierte una acción en la persona que la hace, como «-dor» en español:','-fe turns an action into the person who does it, like "-er" in English:'),
    L('','challwan → challwafe','pescar → pescador(a)','to fish → fisher'),
    L('','ngillakan → ngillakafe','comprar y vender → comerciante','to trade → trader'),
    L('','ngüren → ngürekafe','tejer → tejedor(a)','to weave → weaver'),
    L('','trutrukatun → trutrukatufe','tocar la trutruka → trutruquero',"to play the trutruka → trutruka player"),
    L('','lawentun → lawentuchefe','dar remedios → persona que sana con lawen','to heal with remedies → healer')]},
  ke:{m:'-ke-',es:'Lo que se hace siempre',en:'What is always done',lines:[
    N('-ke- va antes de la terminación de persona y dice lo que se hace siempre, por costumbre. Ejemplo con pe- ("ver"):','-ke- goes before the person ending and says what is always done, as a habit. Example with pe- ("see"):'),
    L('','peken · pekeymi · pekey','yo veo siempre · tú ves siempre · él/ella ve siempre','I always see · you always see · he/she always sees'),
    L('','pekeyngu · pekeyngün','ellos dos ven siempre · ellos ven siempre','they two always see · they always see')]},
  seasons:{m:'Pewü, walüng...',es:'Las estaciones',en:'The seasons',lines:[
    L('','pewü · walüng · rimü · pukem','primavera · verano · otoño · invierno','spring · summer · autumn · winter'),
    N('El año empieza a florecer en pewü; en rimü caen los ngülliw de los pewenes, y en pukem llega la nieve.','The year begins to bloom in pewü; in rimü the nuts fall from the pewen trees, and in pukem the snow arrives.')]},
  fu:{m:'Kuyfi · -fu-',es:'Lo que pasaba antes',en:'What used to happen',lines:[
    N('En los relatos, -fu- marca algo que pasaba o que había antes, y que ya no es así.','In stories, -fu- marks something that happened or existed before, and is no longer so.'),
    L('','mülefuy · pefun · konfuy','había, estaba · vi, había visto · entró, había entrado','there was · I saw, had seen · he/she went in, had gone in'),
    N('Con -ke- se dice lo que pasaba siempre: pekefun, «yo veía».','With -ke- you say what always happened: pekefun, «I used to see».')]},
  neg:{m:'-la-',es:'Negación',en:'Negation',lines:[
    N('-la- va antes de la terminación de persona y niega el verbo.','-la- goes before the person ending and negates the verb.'),
    L('','pelan · pelaymi · pelay','no veo · no ves · no ve','I do not see · you do not see · he/she does not see'),
    L('','konlan · konlaymi · konlay','no entro · no entras · no entra','I do not enter · you do not enter · he/she does not enter')]},
  fut:{m:'-a-',es:'Futuro',en:'Future',lines:[
    N('-a- marca lo que todavía no pasa: lo que vas a hacer.','-a- marks what has not happened yet: what you are going to do.'),
    L('','pean · peaymi · peay','veré · verás · verá','I will see · you will see · he/she will see'),
    L('','ngillayafiñ · ngillalayafiñ','lo voy a comprar · no lo voy a comprar','I will buy it · I will not buy it')]},
  imp:{m:'-nge, -mu, -mün, -kil-',es:'Órdenes (imperativo)',en:'Commands (imperative)',lines:[
    L('','amutunge · amutumu · amutumün','¡vete! (a uno) · (a dos) · (a tres o más)','go away! (to one) · (to two) · (to three or more)'),
    L('','küpakilnge · küpakilmu · küpakilmün','¡no vengas! · ¡no vengan (dos)! · ¡no vengan!','don\'t come! · (to two) · (to three or more)'),
    N('A uno solo siempre -nge, aunque haya más wekufü. A todos juntos: -mu si son dos, -mün si son tres o más.','To just one, always -nge, even if there are more wekufü. To all together: -mu if there are two, -mün if three or more.')]},
  num:{m:'Kiñe, epu, küla...',es:'Números',en:'Numbers',lines:[
    L('','kiñe 1 · epu 2 · küla 3 · meli 4 · kechu 5','',''),
    L('','kayu 6 · regle 7 · pura 8 · aylla 9 · mari 10','',''),
    L('','epu mari 20 · küla mari 30 · kechu mari 50 · pataka 100','','')]},
  col:{m:'Kelü, kallfü, lig...',es:'Colores',en:'Colors',lines:[
    L('','kelü · kallfü · lig · kurü · karü · chod','rojo · azul · blanco · negro · verde · amarillo','red · blue · white · black · green · yellow')]}};
function openBook(back){
  const en=S.gloss==='en';
  choose(L('','Chillka',en?'Your book of words. What do you want to look up?':'Tu libro de palabras. ¿Qué quieres consultar?',''),
    Object.keys(BOOK).filter(k=>!BOOK[k].req||S.flags[BOOK[k].req]).map(k=>({m:BOOK[k].m,g:G(BOOK[k]),v:k})).concat([{m:en?'Close':'Cerrar',v:'x'}]),k=>{
      if(!k||k==='x')return back&&back();
      say(BOOK[k].lines,()=>openBook(back))},true);
}
/* the kuyfi chillka lessons go into the book once their stone is awake */
for(const id of TAB_IDS){const T=TABLETS[id];BOOK['tab_'+id]={m:'Kuyfi chillka',es:T.t.es,en:T.t.en,req:'tab_'+id,lines:T.lines}}
BOOK.wx={m:'Antü, mawün, pire',es:'El tiempo: sol, nube, lluvia, nieve, viento',en:'Weather: sun, cloud, rain, snow, wind',req:'wx_book',lines:[L('','Antü · Tromü · Mawün','sol · nube · lluvia','sun · cloud · rain'),L('','Pire · Kürüf','nieve · viento','snow · wind'),L('','Fütra mawün! · Fütra kürüf!','¡Mucha lluvia! · ¡Mucho viento!','Heavy rain! · Strong wind!')]};
for(const id of TRW_IDS){const T=TRAWUN[id];BOOK['trw_'+id]={m:'Trawün',es:T.t.es,en:T.t.en,req:'trw_'+id,lines:T.sum}}
