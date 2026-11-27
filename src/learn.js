/* ======================================================================
   Learning layer: grafemarios, tracking what each player misses, the
   Wiñochillkatun practice page, verb building, the wekufü chillka, the
   learning report for teachers, palin and trafkintu.
   ====================================================================== */

/* ---------- 1. grafemarios: the game is written in Unificado; Azümchefe and Ragileo are converted on display ---------- */
let GRAF=(()=>{try{return localStorage.getItem('ky_graf')||'u'}catch(e){return 'u'}})();
const GRAF_NAME={u:'Unificado',a:'Azümchefe',r:'Ragileo'};
function setGraf(g){GRAF=g;try{localStorage.setItem('ky_graf',g)}catch(e){}}
const _isEsp=s=>/[áéíóúÁÉÍÓÚ¿¡]/.test(s)||/\b(volver|cerrar|partida|normal|pistas|glosa|español|english|música|music|hints|gloss|title|close|back|desde|inicio|nuevo|juego|cancelar|salir|después|later|yes|on|off|sí|modo|consultar|libro|tomar|lección|todos|solo|menú|menu|cosas|items|go|map|mapa|ir|heal|sanar|learn|aprender|palabras|every|word|report|informe|game|start|empezar|region|ganar|pelea|win|battle|grafemario|play|jugar|continuar|continue|new|nueva|partida|the|to|of|de|la|el|del|un|una|y|you|your|tu|status|estado|quest|log|progress|avance|settings)\b/i.test(s);
function _cv(s,pairs){let o='';for(let i=0;i<s.length;){let hit=null;for(const [a,b] of pairs){if(s.substr(i,a.length).toLowerCase()===a){hit=[a,b];break}}
  if(hit){const src=s.substr(i,hit[0].length),up=src[0]!==src[0].toLowerCase();o+=up?hit[1][0].toUpperCase()+hit[1].slice(1):hit[1];i+=hit[0].length}else{o+=s[i];i++}}return o}
const GRAF_RULES={a:[['tr','tx'],['ng','g'],['g','q'],['d','z']],
  r:[['tr','x'],['ch','c'],['ll','j'],['ng','g'],['g','q'],['ñ','h'],['ü','v'],['d','z'],['f','b']]};
function GR(s){if(!s||GRAF==='u'||typeof s!=='string')return s;const nm=S&&S.name;if(nm&&s.includes(nm))return s.split(nm).map(x=>_cv(x,GRAF_RULES[GRAF])).join(nm);return _cv(s,GRAF_RULES[GRAF])}
function GRm(s){return s&&!_isEsp(s)?GR(s):s}   // for menu options and bubbles, which can be Spanish UI text

/* ---------- 2. tracking: accuracy by topic and the questions each player misses ---------- */
function trk(t,v,q){const ok=v===q.a;track(t,ok,q.q,q.o,q.a);return ok}
function _qkey(q){return (q.m||'')+'|'+(q.es||'')}
function track(topic,ok,q,opts,ans){
  S.acc=S.acc||{};const A=S.acc[topic]=S.acc[topic]||{c:0,t:0};A.t++;if(ok)A.c++;
  if(!q||!opts||ans===undefined)return;S.miss=S.miss||{};const k=_qkey(q);
  if(ok){const m=S.miss[k];if(m){m.n--;if(m.n<=0)delete S.miss[k]}}
  else{const m=S.miss[k]||{q:{m:q.m||'',es:q.es||'',en:q.en||'',who:q.who||''},o:opts.slice(),a:ans,n:0,t:topic};m.n=Math.min(5,m.n+2);m.last=Date.now();S.miss[k]=m;
    const ks=Object.keys(S.miss);if(ks.length>80){ks.sort((a,b)=>S.miss[a].last-S.miss[b].last);delete S.miss[ks[0]]}}}
function missList(){return Object.values(S.miss||{}).sort((a,b)=>b.n-a.n||b.last-a.last)}

/* ---------- 3. verb building: put a word together from its pieces ---------- */
const VOW='aeiouü';
function joinM(parts){let s=parts[0]||'';
  for(let i=1;i<parts.length;i++){const m=parts[i];if(!m)continue;const cons=!VOW.includes(s[s.length-1]);
    if(m==='a'&&/la$/.test(s))s+='ya';
    else if(cons&&m==='n')s+='ün';
    else if(cons&&m==='yu')s+='iyu';
    else if(cons&&m[0]==='y')s+='i'+m.slice(1);
    else s+=m}
  return s}
function buildVerb(Bq,cb){   // Bq: {q:{es,en}, slots:[[ {m,v} ...]...], target, words?:1}
  const parts=[];const en=S.gloss==='en';
  const show=()=>{const shown=Bq.words?parts.filter(Boolean).join(' '):joinM(parts);return shown?shown+'…':'___'};
  const step=i=>{if(i>=Bq.slots.length){const got=Bq.words?parts.filter(Boolean).join(' '):joinM(parts);const ok=got===Bq.target;
      track('armar verbos',ok,{m:'⧉ '+Bq.target,es:Bq.q.es,en:Bq.q.en},[Bq.target],Bq.target);
      return cb(ok,got)}
    choose({m:show(),es:Bq.q.es+(en?'':' Arma la palabra pieza por pieza.'),en:Bq.q.en+(en?' Build the word piece by piece.':'')},
      Bq.slots[i].map(o=>({m:o.m,g:o.g,v:o.v})),v=>{parts[i]=v;sfx('move');step(i+1)},false,true)};
  step(0)}

/* ---------- 4. Wiñochillkatun: a 10-question practice built from the player's own misses ---------- */
const BUILDERS=[
  {q:{es:'Arma «tú trabajas».',en:'Build "you work".'},slots:[[{m:'küdaw-',v:'küdaw'},{m:'amu-',v:'amu'},{m:'iya-',v:'iya'}],[{m:'-n',v:'n'},{m:'-ymi',v:'ymi'},{m:'-y',v:'y'}]],target:'küdawimi'},
  {q:{es:'Arma «ellos dos van».',en:'Build "the two of them go".'},slots:[[{m:'amu-',v:'amu'},{m:'küdaw-',v:'küdaw'}],[{m:'-yu',v:'yu'},{m:'-iñ',v:'iñ'},{m:'-ymu',v:'ymu'},{m:'-yngu',v:'yngu'},{m:'-yngün',v:'yngün'}]],target:'amuyngu'},
  {q:{es:'Arma «no iré».',en:'Build "I will not go".'},slots:[[{m:'amu-',v:'amu'}],[{m:'—',g:'nada',v:''},{m:'-la-',g:'no',v:'la'}],[{m:'—',g:'nada',v:''},{m:'-a-',g:'futuro',v:'a'}],[{m:'-n',v:'n'},{m:'-ymi',v:'ymi'},{m:'-y',v:'y'}]],target:'amulayan'},
  {q:{es:'Arma «tú sueles ir».',en:'Build "you usually go".'},slots:[[{m:'amu-',v:'amu'},{m:'iya-',v:'iya'}],[{m:'—',g:'nada',v:''},{m:'-ke-',g:'costumbre',v:'ke'}],[{m:'-n',v:'n'},{m:'-ymi',v:'ymi'},{m:'-y',v:'y'}]],target:'amukeymi'},
  {q:{es:'Arma «no comemos (muchos)».',en:'Build "we (many) do not eat".'},slots:[[{m:'iya-',v:'iya'},{m:'amu-',v:'amu'}],[{m:'—',g:'nada',v:''},{m:'-la-',g:'no',v:'la'}],[{m:'-iñ',v:'iñ'},{m:'-yu',v:'yu'},{m:'-ymün',v:'ymün'}]],target:'iyalaiñ'},
  {q:{es:'Arma la pregunta «¿cuándo vas a ir?».',en:'Build the question "when will you go?".'},words:1,slots:[[{m:'Chumül',v:'Chumül'},{m:'Chew',v:'Chew'},{m:'Iney',v:'Iney'}],[{m:'amuaymi?',v:'amuaymi?'},{m:'amuan?',v:'amuan?'},{m:'mülimi?',v:'mülimi?'}]],target:'Chumül amuaymi?'}];
function practice(back){
  const en=S.gloss==='en',ms=missList();const qs=[];
  for(const m of ms){if(qs.length>=7)break;if(!m.q.m||m.q.m[0]!=='⧉')qs.push({q:m.q,o:m.o,a:m.a,from:'miss'})}
  const pool=typeof lanPool==='function'?lanPool():[];while(qs.length<8&&pool.length){const p=pool.splice(rnd(pool.length),1)[0];if(!qs.some(x=>_qkey(x.q)===_qkey(p.q)))qs.push(p)}
  const bl=BUILDERS.slice();for(let k=0;k<2;k++)qs.splice(rnd(qs.length+1),0,{b:bl.splice(rnd(bl.length),1)[0]});
  let ok=0;
  say([L('','Wiñochillkatun',ms.length?'Repaso: primero lo que te ha costado ('+ms.length+' pendientes), después un poco de todo.':'Repaso de lo aprendido en tu viaje.',ms.length?'Review: first what has been hard for you ('+ms.length+' pending), then a bit of everything.':'A review of what you have learned on your journey.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){const n=qs.length;S.xp+=ok;persist();return say([N(ok+'/'+n+' · +'+ok+' kimün.',ok+'/'+n+' · +'+ok+' kimün.'),L('',ok>=n-1?'Kümey!':'Kimnierpuken!',ok>=n-1?'¡Muy bien!':'¡Voy aprendiendo!',ok>=n-1?'Very good!':'I am learning!')],()=>{if(S.xp>=xpNeed())levelUpCheck();else back&&back()})}
    const Q=qs[i];
    if(Q.b)return buildVerb(Q.b,(good,got)=>{if(good){ok++;sfx('ok');say([L('','Kümey!',Q.b.target,Q.b.target)],()=>ask(i+1))}else{sfx('bad');say([N('Armaste «'+got+'». Era: '+Q.b.target+'.','You built "'+got+'". It was: '+Q.b.target+'.')],()=>ask(i+1))}});
    const opts=Q.o.map(o=>({m:o,v:o}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(Object.assign({},Q.q,{es:'('+(i+1)+'/'+qs.length+') '+(Q.q.es||''),en:'('+(i+1)+'/'+qs.length+') '+(Q.q.en||'')}),opts,v=>{
      const good=v===Q.a;track('wiñochillkatun',good,Q.q,Q.o,Q.a);
      if(good){ok++;sfx('ok');ask(i+1)}else{sfx('bad');say([N('Era: '+Q.a+'.','It was: '+(OPT_EN[Q.a]||Q.a)+'.')],()=>ask(i+1))}},false,true)}
}

/* ---------- 5. wekufü chillka: a page for every creature you have beaten ---------- */
const BEST={
  laftrache:['Pequeños seres de la costa, del tamaño de una mano, que se esconden entre las rocas y molestan a quien pasa.','Little coastal beings, the size of a hand, who hide among the rocks and pester whoever passes.'],
  chonchon:['Una cabeza que vuela con las orejas como alas, gritando «tue tue» de noche. Para muchos, es un kalku transformado.','A head that flies using its ears as wings, crying "tue tue" at night. Many say it is a kalku in disguise.'],
  anchi:['El anchümalleñ: una lucecita con forma de niño que acompaña a los kalku y engaña a los caminantes.','The anchümalleñ: a little light shaped like a child that serves the kalku and leads walkers astray.'],
  nidol:['El más grande de los laftrache, el que manda a los demás.','The biggest of the laftrache, the one who bosses the others.'],
  piwichen:['Una culebra alada pequeña que chupa la sangre de los animales. Su grito asusta en la noche.','A small winged serpent that drinks the blood of animals. Its cry frightens people at night.'],
  trelke:['Un cuero estirado que vive en el agua y envuelve a quien se acerca a la orilla.','A stretched hide that lives in the water and wraps up whoever comes near the shore.'],
  kolokolo:['Un ratón o lagartija que nace de un huevo maldito y enferma a la gente de la casa.','A mouse or lizard hatched from a cursed egg that makes the people of the house fall ill.'],
  fkolokolo:['Un kolokolo viejo y grande; su maldición pesa más.','An old, big kolokolo; its curse weighs heavier.'],
  nguruvilu:['El ngürüfilu, «zorro-culebra»: vive en los ríos y arrastra al fondo a quien cruza.','The ngürüfilu, "fox-serpent": it lives in rivers and drags those who cross down to the bottom.'],
  kutral:['Una chispa del volcán con ganas de quemar.','A spark from the volcano eager to burn.'],
  pire:['Nieve que se levanta y camina: el frío de la cordillera hecho wekufü.','Snow that rises up and walks: the cold of the cordillera turned wekufü.'],
  kura:['Una piedra con mala voluntad. Su cuerpo de roca aguanta los golpes.','A stone with ill will. Its rocky body takes a beating.'],
  fkura:['La piedra grande de la que se desprenden los kura wekufü.','The big rock the kura wekufü break off from.'],
  nirivilu:['El ñirifilu, culebra de los ñirres de la cordillera, rápida y venenosa.','The ñirifilu, serpent of the cordillera ñirre trees, fast and venomous.'],
  cherrufe:['El Cherufe vive dentro de los volcanes. Hecho de lava y roca, lanza piedras de fuego.','The Cherufe lives inside volcanoes. Made of lava and rock, it hurls stones of fire.'],
  kowek:['Agua que no corre por donde debe.','Water that does not run where it should.'],
  mawek:['La lluvia cuando se enoja: viene con el mal tiempo.','The rain when it gets angry: it comes with bad weather.'],
  kamawetu:['Un ternero con un cuerno brillante que nace en los ríos y corre hacia el mar, desbordando las aguas.','A calf with a shining horn born in the rivers that runs to the sea, flooding the waters.'],
  basilisko:['Un gallo-culebra nacido de un huevo raro; con su aliento seca a la gente de la casa.','A rooster-serpent hatched from a strange egg; its breath withers the people of the house.'],
  kaleuche:['El Kaleuche, barco fantasma que navega de noche entre la niebla, lleno de luces y música.','The Kaleuche, a ghost ship sailing at night in the fog, full of lights and music.'],
  witranalwe:['Un espíritu alto y huesudo a caballo, que cuida los animales del kalku y castiga a quien se acerca.','A tall, bony spirit on horseback who guards the kalku\'s animals and punishes those who approach.'],
  chinifilu:['La culebra de la ceniza: se enrosca en lo que se olvida.','The serpent of ash: it coils around what is forgotten.'],
  piwuchen:['El gran piwüchen, culebra alada de los ríos del sur. Su silbido seca a los animales.','The great piwüchen, winged serpent of the southern rivers. Its whistle dries the animals.'],
  wallipen:['El Wallepeñ: cabeza de ternero, cuerpo de oveja. Si una mujer encinta lo ve, el niño nace con sus marcas.','The Wallepeñ: calf\'s head, sheep\'s body. If a pregnant woman sees it, the child is born with its marks.'],
  trawko:['El Trawko, hombre pequeño del bosque del sur, con hacha de piedra. Su mirada encanta.','The Trawko, a small man of the southern forest with a stone axe. His gaze enchants.'],
  mewlen:['El remolino de viento que levanta polvo y se lleva lo que encuentra.','The whirlwind that raises dust and carries off what it finds.'],
  kurutrewa:['El perro negro que aparece en los caminos de noche.','The black dog that appears on the roads at night.'],
  fmewlen:['Un remolino grande, de los que se ven en la pampa.','A big whirlwind, the kind you see on the pampa.'],
  kurutoro:['El toro negro, animal de los kalku.','The black bull, an animal of the kalku.'],
  walichu:['El Walichu, espíritu del mal en tierras puelche. Trae enfermedad y mala suerte.','The Walichu, evil spirit of the Puelche lands. It brings sickness and bad luck.'],
  chadikura:['Elëngasëm, gigante de piedra y sal de las tierras del este.','Elëngasëm, giant of stone and salt of the eastern lands.'],
  wenangkun:['La pena que se queda callada.','The sorrow that keeps quiet.'],
  illkun:['La rabia de que te hagan callar.','The rage at being silenced.'],
  llukalfe:['El miedo que se agranda.','The fear that grows bigger.'],
  ayentufe:['La burla del patio de la escuela.','The schoolyard mockery.'],
  profe:['La escuela que prohibió la lengua.','The school that banned the language.'],
  yewen:['La vergüenza de hablar la propia lengua. Es el último enemigo, y el más cercano.','The shame of speaking your own language. It is the last enemy, and the closest one.'],
  epunamun:['El Epunamun, ngen de la guerra, de dos caras. No es malo: pone a prueba a los weichafe.','The Epunamun, ngen of war, with two faces. It is not evil: it tests the weichafe.'],
  ngoyam:['Un alma perdida en la niebla, que ya no recuerda su nombre.','A soul lost in the fog, who no longer remembers its name.'],
  kalku:['El Fütra Kalku, el gran brujo que trabaja para el olvido.','The Fütra Kalku, the great sorcerer who works for the forgetting.'],
  ngoyman1:['Ti Fütra Ngoymatulfe, el gran olvido, el que hace olvidar las palabras.','Ti Fütra Ngoymatulfe, the great forgetting, the one who makes words be forgotten.'],
  llufu1:['El Millalobo, rey del mar en los relatos williche de Chiloé: mitad hombre, mitad lobo marino, con oro (milla) en el pelo y en la corona. No es un wekufü: el olvido le quitó el canto que lo calmaba, y necesita volver a oírlo.','The Millalobo, king of the sea in the Williche tellings of Chiloé: half man, half sea lion, with gold (milla) in his hair and his crown. He is not a wekufü: the forgetting took the song that calmed him, and he needs to hear it again.']};
['ngoyman2','ngoyman3','ngoyman4','ngoyman5','ngoysum'].forEach(k=>BEST[k]=BEST.ngoyman1);['llufu2','llufu3','llufu4','llufu5'].forEach(k=>BEST[k]=BEST.llufu1);
function bestWhere(t){if(S.beatW&&S.beatW[t])return S.beatW[t];for(const id in MAPS){const m=MAPS[id];for(const e of m.ents||[])if(e.kind==='enemy'&&e.party&&e.party.includes(t))return m.name}return null}
function bestTips(t){const e=ET[t],es=[],en=[];
  if(e.fly){es.push('vuela alto: primero bájalo con nagtu-');en.push('flies high: bring it down first with nagtu-')}
  if(e.armor){es.push('su cuerpo duro aguanta los golpes');en.push('its hard body takes hits well')}
  if(e.curse){es.push('maldice: lleva lawen');en.push('it curses: carry lawen')}
  if(e.drain){es.push('te roba newen');en.push('it steals your newen')}
  if(e.twice){es.push('ataca dos veces');en.push('it attacks twice')}
  if(e.hide){es.push('se esconde');en.push('it hides')}
  if(e.spres){es.push('resiste los golpes especiales');en.push('it resists special strikes')}
  if(e.seals){es.push('barrera de luz: se rompe con '+e.seals.map(r=>r+'-').join(', '));en.push('light barrier: broken with '+e.seals.map(r=>r+'-').join(', '))}
  if(typeof YEWEN_CALL!=='undefined'&&YEWEN_CALL[t]){const h=YEWEN_CALL[t];es.push(h[0]);en.push(h[1])}
  return [es.join('; '),en.join('; ')]}
function openBestiary(back){
  const en=S.gloss==='en',seen=Object.keys(S.beaten||{}).filter(t=>ET[t]&&!/^ngoyman[2-5]$|^llufu[2-5]$/.test(t));
  const total=Object.keys(ET).filter(t=>!/^ngoyman[2-5]$|^llufu[2-5]$|^ngoysum$/.test(t)).length;
  if(!seen.length)return say([N('Todavía no has vencido a ningún wekufü. Cada uno que venzas tendrá su página aquí.','You have not beaten any wekufü yet. Each one you beat will get its page here.')],back);
  choose({m:'Wekufü chillka · '+seen.length+'/'+total,es:'¿Qué página quieres leer?',en:'Which page do you want to read?'},
    seen.map(t=>({m:ET[t].name,g:(ET[t].boss?'★ ':'')+'×'+S.beaten[t],v:t})).concat([{m:en?'Back':'Volver',v:'x'}]),t=>{
    if(!t||t==='x')return back&&back();
    const b=BEST[t]||['Un wekufü de estas tierras.','A wekufü of these lands.'],w=bestWhere(t),tp=bestTips(t);
    const ls=[L('',GR('Fey ta '+ET[t].name+'.'),'Este es '+ET[t].name+'.','This is '+ET[t].name+'.')];
    if(w)ls.push(L('',w+' mew müley.','Vive en '+w+'.','It lives in '+w+'.'));
    ls.push(N(b[0],b[1]));if(tp[0])ls.push(N('Cómo vencerlo: '+tp[0]+'.','How to beat it: '+tp[1]+'.'));
    ls.push(N('Lo has vencido '+S.beaten[t]+(S.beaten[t]>1?' veces.':' vez.'),'You have beaten it '+S.beaten[t]+' time'+(S.beaten[t]>1?'s.':'.')));
    say(ls,()=>openBestiary(back))},true)}

/* ---------- 6. learning report (for the player and for teachers) ---------- */
function reportText(){
  const en=S.gloss==='en',F=S.flags,yes=k=>F[k]?'✓':'·',acc=S.acc||{},mins=Math.round((S.wtime||0)/3600);
  const rows=Object.keys(acc).sort().map(k=>{const a=acc[k];return '  '+k.padEnd(26)+String(a.c).padStart(4)+' / '+String(a.t).padEnd(4)+(a.t?Math.round(100*a.c/a.t)+'%':'')});
  const ml=missList().slice(0,12).map(m=>'  '+(m.q.m||m.q.es||'').replace(/^⧉ /,'').slice(0,40).padEnd(42)+'→ '+m.a);
  const trw=TRW_IDS.filter(k=>F['trw_'+k]).length+'/'+TRW_IDS.length+' + '+TRW_IDS.filter(k=>F['trw2_'+k]).length+'/'+TRW_IDS.length;
  const tabs=typeof TAB_IDS!=='undefined'?TAB_IDS.filter(t=>F['tab_'+t]).length:0;
  const ntk=Object.keys(NUTK).filter(k=>F['ntk_'+k]).length+Object.keys(NUTK2).filter(k=>F['ntk2_'+k]).length;
  const L1=en?['KIMÜN REPORT · Kewün Newen','Player','Level','Play time','min','Ngen awakened','Verb roots','Trawün lessons','Kuyfi chillka','Nütramkan','Wekufü beaten','Accuracy by topic (correct / attempts)','Still to practise (most missed first)','Nothing pending: well done!']
    :['INFORME DE KIMÜN · Kewün Newen','Jugador/a','Nivel','Tiempo de juego','min','Ngen despertados','Raíces verbales','Lecciones del trawün','Kuyfi chillka','Nütramkan','Wekufü vencidos','Precisión por tema (aciertos / intentos)','Por practicar (lo más fallado primero)','Nada pendiente: ¡bien hecho!'];
  return [L1[0],'',L1[1]+': '+S.name+(S.flags.kimche?' · kimche':'')+(S.hm?' (weichafe)':''),L1[2]+': kimün '+S.lvl,L1[3]+': '+mins+' '+L1[4],
    L1[5]+': '+['ngen','ngen2','ngen3','ngen4','ngen5'].filter(k=>F[k]).length+'/5'+(F.won?'  · Ti Fütra Ngoymatulfe ✓':''),
    L1[6]+' ('+S.roots.length+'): '+S.roots.map(r=>r+'-').join(', '),L1[7]+': '+trw,L1[8]+': '+tabs+'/6',L1[9]+': '+ntk+'/'+(Object.keys(NUTK).length+Object.keys(NUTK2).length),
    L1[10]+': '+Object.keys(S.beaten||{}).length,(en?'Translations peeked at (Mapudungun-only mode)':'Traducciones consultadas (modo re mapudungun)')+': '+(S.peek||0)+(S.nogloss?'':(en?' · mode off':' · modo apagado')),'',L1[11]+':',...(rows.length?rows:['  —']),'',L1[12]+':',...(ml.length?ml:['  '+L1[13]]),'',new Date().toLocaleString()].join('\n')}
function openReport(back){
  const t=reportText(),en=S.gloss==='en';let ov=document.getElementById('report');
  if(!ov){ov=document.createElement('div');ov.id='report';document.body.appendChild(ov)}
  ov.innerHTML='<div class="rb"><pre></pre><div class="rr"><button data-a="copy"></button><button data-a="print"></button><button data-a="close"></button></div></div>';
  ov.querySelector('pre').textContent=t;const bs=ov.querySelectorAll('button');
  bs[0].textContent=en?'Copy':'Copiar';bs[1].textContent=en?'Print / PDF':'Imprimir / PDF';bs[2].textContent=en?'Close':'Cerrar';
  ov.style.display='flex';active={kind:'report',a(){},b(){close()}};
  const close=()=>{ov.style.display='none';active=null;back&&back()};
  bs[0].onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{bs[0].textContent='✓'},()=>{const r=document.createRange();r.selectNodeContents(ov.querySelector('pre'));const sl=getSelection();sl.removeAllRanges();sl.addRange(r)})};
  bs[1].onclick=()=>{const w=window.open('','_blank');if(!w){bs[1].textContent='✗';return}
    w.document.write('<!DOCTYPE html><meta charset="utf-8"><title>Kimün report</title><pre style="font:14px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap">'+esc(t)+'</pre><script>print()<\/script>');w.document.close()};
  bs[2].onclick=close}

/* ---------- 7. palin: a real match on its own field. You run and strike the pali with your wiño;
   every few seconds the play stops and you call it to your team in Mapudungun. ---------- */
let PG=null;
const PF={w:520,h:146,top:50};
const PALIN_OPTS=['Pikun püle!','Willi püle!','Puel püle!','Lafken püle!','Lefnge!','Lefmu!','Küpange!','Amutunge!'];
function palinTalk(){
  const en=S.gloss==='en';
  say([L('Palife','Mari mari! Palituaiñ?','¡Hola! ¿Jugamos palin? Nos falta una persona en el equipo.','Hello! Shall we play palin? Our team is one player short.')],()=>
    choose({m:'Palituaiñ?',es:'¿Juegas palin?',en:'Play palin?'},[{m:'May',g:en?'Play a match':'Jugar un partido',v:1}].concat(S.flags.palin_won?[{m:'Füta palin',g:en?'The tournament between the lofs':'El torneo entre los lof',v:2}]:[]).concat([{m:'Wüla müten',g:en?'Later':'Después',v:0}]),v=>{if(!v)return;if(v===2)return palinTourTalk();
      say([N('El palin se juega con el wiño (el palo curvo) y la pali (la bola). Tu equipo empuja la pali hacia el puel, el este; el otro equipo, hacia el lafken, el oeste. Si la pali cruza la raya del fondo, es tripal o raya. Tres ganan.','Palin is played with the wiño (the curved stick) and the pali (the ball). Your team drives the pali toward the puel, the east; the other team toward the lafken, the west. When the pali crosses the end line it is a tripal, or raya. Three win.'),
        N('Muévete con las flechas. Cuando alcanzas la pali, la golpeas sola (o con Z o Espacio). De vez en cuando el juego se detiene: grita la jugada a tu equipo en mapudungun. Si aciertas, te ayudan.','Move with the arrows. When you reach the pali you strike it automatically (or press Z or Space). Every so often play stops: shout the call to your team in Mapudungun. Call it right and they help you.')],palinStart)},true,true));
}
function palinStart(tour){
  const mk=(team,look,x,y,me)=>({team,look,x,y,hx:x,hy:y,me:!!me,dir:team?'left':'right',fr:0,an:0,sw:0,cd:0,boost:0,stun:0,conf:0});
  const cx=PF.w/2,cy=PF.h/2,hm=S.hm?1.12:1;
  PG={t:0,us:0,them:0,ball:{x:cx,y:cy,vx:0,vy:0},cam:cx-LW/2,intro:48,next:420,zone:0,fx:[],hm,
    pl:[mk(0,heroLook(),cx-26,cy,1),mk(0,'walker',cx-70,cy-42),mk(0,'child',cx-70,cy+42),
        mk(1,'kona',cx+26,cy),mk(1,'fisher',cx+70,cy-42),mk(1,'lonko2',cx+70,cy+42)]};
  if(typeof tour==='number'&&PALT[tour]){PG.tour=tour;PG.hm=hm*PALT[tour].hm;PALT[tour].look.forEach((l,i)=>PG.pl[3+i].look=l)}
  held.up=held.down=held.left=held.right=0;banner.style.display='none';
  mode='palin';sfx('enc');playSong('palin');
}
function palinReset(){const cx=PF.w/2,cy=PF.h/2,b=PG.ball;b.x=cx;b.y=cy;b.vx=b.vy=0;
  for(const p of PG.pl){p.x=p.hx=p.x===undefined?cx:p.hx;p.y=p.hy;p.sw=p.cd=p.boost=p.stun=p.conf=0}
  const H=[[cx-26,cy],[cx-70,cy-42],[cx-70,cy+42],[cx+26,cy],[cx+70,cy-42],[cx+70,cy+42]];PG.pl.forEach((p,k)=>{p.x=H[k][0];p.y=H[k][1]});PG.intro=36}
function palinFx(x,y,t,col){PG.fx.push({x,y,t,col:col||'#ffe8a0',life:70})}
function palinSwing(){const me=PG.pl[0];if(me.sw||PG.intro)return;me.sw=14;sfx('move')}
function palinQuit(){const en=S.gloss==='en';
  choose({es:'¿Dejar el partido?',en:'Leave the match?'},[{m:en?'Keep playing':'Seguir jugando',v:0},{m:en?'Leave the match':'Salir del partido',v:1}],v=>{if(v)palinEnd(true)},true,true)}
function palinHit(p,dx,dy,pow){const b=PG.ball,l=Math.hypot(dx,dy)||1;b.vx=dx/l*pow;b.vy=dy/l*pow;p.cd=26;sfx('hit')}
function updatePalin(){
  if(!PG||active)return;const b=PG.ball,me=PG.pl[0];PG.t++;
  for(const f of PG.fx)f.life--;PG.fx=PG.fx.filter(f=>f.life>0);
  PG.cam+=(Math.max(0,Math.min(PF.w-LW,b.x-LW/2))-PG.cam)*.08;
  if(PG.intro>0){PG.intro--;if(PG.intro===1)palinFx(b.x,b.y-30,'Palin!','#ffffff');return}
  // the player
  let dx=(held.right?1:0)-(held.left?1:0),dy=(held.down?1:0)-(held.up?1:0);
  if(dx||dy){const l=Math.hypot(dx,dy),sp=1.9;me.x+=dx/l*sp;me.y+=dy/l*sp;me.an++;me.dir=Math.abs(dx)>=Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')}
  /* the player swings by themself on reaching the pali, on every device (Z, Space or Enter also swing) */
  if(!me.sw&&me.cd===0&&b.x>me.x-3&&Math.hypot(b.x-me.x,b.y-me.y+2)<12)me.sw=14;
  if(me.sw>0){me.sw--;if(me.sw>6&&me.cd===0&&Math.hypot(b.x-me.x,b.y-me.y+2)<15){palinHit(me,3,(held.up?-1.4:0)+(held.down?1.4:0)+(b.y-me.y)*.06,4.6);palinFx(me.x,me.y-26,'Tak!','#fff6c8')}}
  // the others: one chaser per team goes for the pali, the rest keep their lanes
  for(let tm=0;tm<2;tm++){const mates=PG.pl.filter(p=>p.team===tm&&!p.me),dirX=tm?-1:1;
    const ch=mates.slice().sort((a,c)=>Math.hypot(a.x-b.x,a.y-b.y)-Math.hypot(c.x-b.x,c.y-b.y))[0];
    for(const p of mates){
      if(p.stun>0){p.stun--;continue}if(p.conf>0){p.conf--;continue}
      let tx,ty;if(p===ch||p.boost>0){tx=b.x-dirX*7;ty=b.y}else{tx=Math.max(20,Math.min(PF.w-20,b.x-dirX*44));ty=p.hy}
      const ddx=tx-p.x,ddy=ty-p.y,d=Math.hypot(ddx,ddy),sp=(tm?1.02*PG.hm:.98)*(p.boost>0?1.7:1);
      if(p.boost>0)p.boost--;
      if(d>1){p.x+=ddx/d*Math.min(sp,d);p.y+=ddy/d*Math.min(sp,d);p.an++;p.dir=Math.abs(ddx)>=Math.abs(ddy)?(ddx>0?'right':'left'):(ddy>0?'down':'up')}
      if(p.cd>0)p.cd--;
      if(p.cd===0&&Math.hypot(b.x-p.x,b.y-p.y)<11&&(tm?p.x>b.x-4:p.x<b.x+4)){p.sw=12;palinHit(p,dirX*3,(Math.random()-.5)*2+(PF.h/2-b.y)*.012,tm?3.6*PG.hm:3.5)}
      if(p.sw>0)p.sw--}}
  if(me.cd>0)me.cd--;
  for(const p of PG.pl){p.x=Math.max(4,Math.min(PF.w-4,p.x));p.y=Math.max(6,Math.min(PF.h-2,p.y))}
  // the pali
  b.x+=b.vx;b.y+=b.vy;b.vx*=.978;b.vy*=.978;
  if(b.y<4){b.y=4;b.vy=Math.abs(b.vy)*.7}if(b.y>PF.h-4){b.y=PF.h-4;b.vy=-Math.abs(b.vy)*.7}
  const z=b.x<PF.w*.3?-1:b.x>PF.w*.7?1:0;
  if(z!==PG.zone){PG.zone=z;if(z)palinFx(b.x,-6,z>0?'Puel püle!':'Lafken püle!',z>0?'#bfe3ff':'#ffb8a8')}
  if(b.x>PF.w-8||b.x<8){const ours=b.x>PF.w/2;if(ours)PG.us++;else PG.them++;sfx(ours?'lvl':'bad');
    const n=ours?PG.us:PG.them,nw=numW(n),w=(PG.us+PG.them)%2?' tripal!':' raya!',sc=PG.us+' – '+PG.them;
    const ls=[ours?L('Pu che',nw[0].toUpperCase()+nw.slice(1)+w,'¡Punto para tu equipo! '+sc+'.','A point for your team! '+sc+'.'):N('Punto para el otro equipo. '+sc+'.','A point for the other team. '+sc+'.')];
    if(PG.us>=3||PG.them>=3)return say(ls,()=>palinEnd());
    palinReset();return say(ls)}
  if(PG.t>12600)return palinEnd();
  if(--PG.next<=0)palinCall()}
function palinCall(){
  PG.next=420+rnd(300);const b=PG.ball,me=PG.pl[0],en=S.gloss==='en';
  const mates=PG.pl.filter(p=>p.team===0&&!p.me),riv=PG.pl.filter(p=>p.team===1);
  const far=mates.filter(p=>Math.hypot(p.x-b.x,p.y-b.y)>70),near=riv.filter(p=>Math.hypot(p.x-me.x,p.y-me.y)<34);
  let a,es,enq,act;
  if(near.length>=2){a='Küpange!';es='Te rodean dos rivales. Necesitas que un compañero venga a ti.';enq='Two rivals surround you. You need a teammate to come to you.';
    act=()=>{const m=mates.sort((p,q)=>Math.hypot(p.x-me.x,p.y-me.y)-Math.hypot(q.x-me.x,q.y-me.y))[0];m.boost=240;m.x=(m.x+me.x)/2;near.forEach(r=>r.stun=70)}}
  else if(near.length===1){a='Amutunge!';es='Un rival se te pega. ¡Que se vaya!';enq='A rival is sticking to you. Make him go away!';act=()=>{const r=near[0];r.stun=150;r.x+=r.x>me.x?26:-26}}
  else if(far.length===2){a='Lefmu!';es='Tus dos compañeros están lejos de la pali. ¡Que corran los dos!';enq='Both your teammates are far from the pali. Both must run!';act=()=>mates.forEach(m=>m.boost=300)}
  else if(far.length===1){a='Lefnge!';es='Un compañero está lejos de la pali. ¡Que corra!';enq='A teammate is far from the pali. He must run!';act=()=>far[0].boost=300}
  else if(b.y<PF.h*.3||b.y>PF.h*.7){const up=b.y<PF.h*.3;a=up?'Pikun püle!':'Willi püle!';es=up?'La pali se va hacia el norte, arriba. Avisa a tu equipo.':'La pali se va hacia el sur, abajo. Avisa a tu equipo.';enq=up?'The pali is heading north, up. Tell your team.':'The pali is heading south, down. Tell your team.';act=()=>mates.forEach(m=>m.boost=200)}
  else{const fw=b.vx>=0;a=fw?'Puel püle!':'Lafken püle!';es=fw?'La pali corre hacia el este, hacia la raya rival. ¡Avisa!':'La pali vuelve hacia el oeste, hacia tu raya. ¡Avisa!';enq=fw?'The pali runs east, toward the rival line. Call it!':'The pali is coming back west, toward your line. Call it!';act=()=>mates.forEach(m=>m.boost=200)}
  const o=[a],oth=PALIN_OPTS.filter(x=>x!==a);while(o.length<3)o.push(oth.splice(rnd(oth.length),1)[0]);
  for(let i=o.length-1;i>0;i--){const j=rnd(i+1);[o[i],o[j]]=[o[j],o[i]]}
  sfx('swirl');
  choose({es:es,en:enq},o.map(x=>({m:x,v:x})),v=>{const ok=v===a;track('palin',ok,{m:'',es,en:enq},o,a);
    if(ok){sfx('ok');act();palinFx(me.x,me.y-30,v,'#ffe8a0');palinFx(me.x,me.y-44,en?'They heard you!':'¡Te escucharon!','#b8ffb0')}
    else{sfx('bad');mates.forEach(m=>m.conf=100);palinFx(me.x,me.y-30,v,'#ffb0a0');palinFx(me.x,me.y-44,(en?'It was: ':'Era: ')+a,'#ffd0c0')}},false,true)}
function palinEnd(quit){
  const won=PG&&!quit&&PG.us>PG.them,tour=PG?PG.tour:undefined,first=!S.flags.palin_won&&tour===undefined,ls=[];
  if(!quit){if(won){ls.push(L('Palife','Iñchiñ wewiñ!','¡Ganamos!','We won!'));if(first){S.flags.palin_won=1;S.gold+=30;S.xp+=8;ls.push(N('+30 ngülliw · +8 kimün. Desde hoy te llaman palife, jugadora o jugador de palin.','+30 ngülliw · +8 kimün. From today they call you palife, a palin player.'))}}
    else ls.push(L('Palife','Ka antü!','¡Otro día será! El palin se aprende jugando.','Another day! You learn palin by playing.'))}
  if(tour!==undefined)palinTourEnd(tour,won,quit,ls);
  PG=null;mode='map';grace=30;held.up=held.down=held.left=held.right=0;AU.name=null;playSong(mapSong());
  if(typeof playAmb==='function')playAmb(typeof wxAmbKey==='function'?wxAmbKey():ambFor(M.bg));
  persist();if(ls.length)say(ls,()=>{if(S.xp>=xpNeed())levelUpCheck()})}
/* the field: mown grass, chalk lines, the crowd of the lof along the top, a fence along the bottom */
const PALC={};
function palinGround(){if(PALC.g)return PALC.g;const [cv,c]=mk(PF.w,PF.h);
  for(let x=0;x<PF.w;x++)for(let y=0;y<PF.h;y++){const st=Math.floor(x/26)%2,n=((x*7349+y*1931)%97)/97,v=(st?0:1)+(n>.82?1:n<.12?-1:0);
    c.fillStyle=['#2f5a22','#3a6a28','#44782e','#4f8636'][Math.max(0,Math.min(3,v+1))];c.fillRect(x,y,1,1)}
  for(let k=0;k<260;k++){const x=(k*131)%PF.w,y=(k*71)%PF.h;c.fillStyle=k%3?'#5a9440':'#28501c';c.fillRect(x,y,1,2)}
  c.fillStyle='rgba(244,236,210,.85)';c.fillRect(0,0,PF.w,1);c.fillRect(0,PF.h-1,PF.w,1);c.fillRect(8,0,2,PF.h);c.fillRect(PF.w-10,0,2,PF.h);
  c.fillStyle='rgba(244,236,210,.35)';for(let y=0;y<PF.h;y+=6)c.fillRect(PF.w/2,y,1,3);
  return PALC.g=cv}
const PAL_CROWD=['kuku','lonko','weaver','child','cook','childf','walker','elder','kona','child','weaver','lonko2'];
function renderPalin(c){
  const G=PG,cam=Math.round(G.cam),T=PF.top;
  c.fillStyle='#1c3414';c.fillRect(0,0,LW,LH);
  // crowd bank and trees beyond
  for(let x=-((cam*.5)%40);x<LW+40;x+=40){ell(c,x+20,14,26,16,'#16301a');ell(c,x+8,20,16,12,'#1e3c20')}
  R(c,0,28,LW,T-28,'#2a4a1e');
  for(let k=0;k<PAL_CROWD.length*3;k++){const wx=20+k*44-cam*.9,x=Math.round(wx);if(x<-20||x>LW+4)continue;
    const cheer=G.zone===1||G.fx.some(f=>f.t==='Palin!'),fr=cheer&&(frame>>3)%2?1:0,s=ctCharSprite(PAL_CROWD[k%PAL_CROWD.length],'down',fr);
    c.drawImage(s,x,T-s.height-2+(cheer&&(frame+k*5)%20<10?-1:0))}
  R(c,0,T-3,LW,3,'#6a4a2a');for(let x=-(cam%12);x<LW;x+=12)R(c,x,T-7,2,7,'#5a3c20');
  c.drawImage(palinGround(),cam,0,LW,PF.h,0,T,LW,PF.h);
  R(c,0,T+PF.h,LW,LH-T-PF.h,'#24401a');for(let x=-(cam%10);x<LW;x+=10){R(c,x,T+PF.h+3,2,10,'#6a4a2a');R(c,x,T+PF.h+5,10,1,'#5a3c20')}
  // pali shadow, players by depth, pali
  const b=G.ball,bx=Math.round(b.x-cam),by=Math.round(T+b.y);
  const L2=G.pl.slice().sort((p,q)=>p.y-q.y);let ballDrawn=false;
  const drawBall=()=>{ell(c,bx,by+1,3,1.5,'rgba(0,0,0,.35)');const sp=Math.hypot(b.vx,b.vy);if(sp>1.5){c.fillStyle='rgba(255,250,230,.35)';c.fillRect(Math.round(bx-b.vx*2)-1,Math.round(by-2-b.vy*2),2,2)}
    R(c,bx-2,by-7,4,1,'#2a1a10');R(c,bx-3,by-6,6,4,'#2a1a10');R(c,bx-2,by-2,4,1,'#2a1a10');R(c,bx-4,by-5,8,2,'#2a1a10');
    R(c,bx-2,by-6,4,4,'#e6d8b4');R(c,bx-3,by-5,6,2,'#e6d8b4');R(c,bx-2,by-6,2,1,'#ffffff');R(c,bx-3,by-5,1,1,'#fff6dc');R(c,bx+1,by-3,2,1,'#a8906a');R(c,bx+2,by-4,1,1,'#a8906a');ballDrawn=true};
  for(const p of L2){if(!ballDrawn&&b.y<p.y)drawBall();
    const x=Math.round(p.x-cam),y=Math.round(T+p.y);if(x<-20||x>LW+20)continue;
    const s=ctCharSprite(p.look,p.dir,p.sw?2:(p.an>>3)%4);ell(c,x,y,7,2.5,'rgba(0,0,0,.32)');
    c.drawImage(s,x-Math.round(s.width/2),y-s.height+1);
    R(c,x-4,y-s.height+5,8,1,p.team?'#d83a2a':'#3a6ad8');           // team headband colour
    // the wiño: a curved stick held low in front, swung through when striking
    const fd=p.dir==='left'?-1:p.dir==='right'?1:(p.team?-1:1),k=p.sw?Math.max(0,p.sw-6)/8:0,hx=x+fd*4,hy=y-8;
    const ex=hx+fd*Math.round(9-10*k),ey=hy+Math.round(7-9*k);
    for(let t=0;t<=1;t+=.1){const sx=Math.round(hx+(ex-hx)*t),sy=Math.round(hy+(ey-hy)*t);R(c,sx-1,sy-1,3,3,'#1e1008')}
    for(let t=0;t<=1;t+=.1){const sx=Math.round(hx+(ex-hx)*t),sy=Math.round(hy+(ey-hy)*t);R(c,sx,sy,1,1,t<.5?'#c08a48':'#9a6a34')}
    R(c,ex-(fd>0?0:3),ey-1,4,3,'#1e1008');R(c,ex-(fd>0?0:2),ey,3,1,'#b07a3c');
    if(p.me)txt('▼',x,y-s.height-3,'#ffe060',10,'center');
    if(p.conf>0&&(frame>>4)%2)txt('?',x,y-s.height-3,'#ffffff',10,'center');
    if(p.boost>0&&frame%6<3)R(c,x-fd*8,y-4,3,1,'rgba(255,255,255,.6)');
    if(p.stun>0)txt('…',x,y-s.height-3,'#dddddd',10,'center')}
  if(!ballDrawn)drawBall();
  // scoreboard and labels
  R(c,LW/2-34,2,68,15,'rgba(10,8,24,.75)');
  OV.push(()=>{txt(String(G.us),LW/2-14,13,'#8ab4ff',13,'center');txt('–',LW/2,13,'#ffffff',12,'center');txt(String(G.them),LW/2+14,13,'#ff9a8a',13,'center');
    if(cam<30)txt('◀ lafken',14-cam,T+PF.h+20,'#ffd0c0',9);if(cam>PF.w-LW-30)txt('puel ▶',PF.w-cam-14,T+PF.h+20,'#c8e0ff',9,'right');
    const left=Math.max(0,Math.ceil((12600-G.t)/3600));txt(left+"'",LW-8,13,'#ffffff',10,'right');
    if(G.t<420){const tc=matchMedia('(pointer:coarse)').matches,en2=S.gloss==='en';
      txt(tc?(en2?'Drag to run · tap to strike · hold to leave':'Arrastra para correr · toca para golpear · mantén para salir'):(en2?'Arrows: move · A: strike · B: leave':'Flechas: moverse · A: golpear · B: salir'),LW/2,LH-6,'#ffffff',9,'center')}
    for(const f of G.fx){const x=f.x-cam,y=T+f.y-(70-f.life)*.3;txt(f.t,x,y,f.col,11,'center')}});
  if(G.intro>0){const a=Math.min(1,G.intro/24);c.fillStyle='rgba(0,0,0,'+a.toFixed(2)+')';c.fillRect(0,0,LW,LH);
    if(G.intro>8)OV.push(()=>txt('Palituaiñ!',LW/2,LH/2,'#ffe8a0',16,'center'))}
}

/* ---------- 8. trafkintu: trading with numbers in Mapudungun ---------- */
function trafkintuTalk(){
  const en=S.gloss==='en',first=!S.flags.traf_done;
  say([L('Trafkintufe','Mari mari! Trafkintuayu?','¡Hola! ¿Hacemos trafkintu? Yo ofrezco, tú decides si el trato es justo.','Hello! Shall we do trafkintu? I make offers, you decide whether the deal is fair.'),
    N('En el trafkintu se cambian cosas. Ella te dirá el precio en mapudungun. Si el precio es justo (como en la tienda o menos), acepta con «May». Si es un abuso, di «No».','In trafkintu people exchange goods. She will tell you the price in Mapudungun. If it is fair (shop price or less), accept with "May". If it is a rip-off, say "No".')],()=>{
    let good=0,n=0;const items=['kulon','diwen','kofke','lawen','mate'];
    const offer=()=>{if(n>=5)return end();n++;const it=items[rnd(items.length)],base=ITEMS[it].p,fair=Math.random()<.55;
      const price=fair?Math.max(1,Math.round(base*(.5+Math.random()*.5))):Math.round(base*(2+Math.random()*2));
      choose({m:'Kiñe '+ITEMS[it].m+': '+numW(price)+' ngülliw.',es:'(Tienes '+S.gold+' ngülliw. En la tienda vale '+base+'.) ¿Aceptas?',en:'(You have '+S.gold+' ngülliw. In the shop it costs '+base+'.) Do you accept?'},
        [{m:'May',g:en?'Accept':'Acepto',v:1},{m:'No',g:en?'Decline':'No acepto',v:0}],v=>{
        const right=fair?v===1:v===0;track('trafkintu (números)',right,{m:'Kiñe '+ITEMS[it].m+': '+numW(price)+' ngülliw.',es:'¿Cuántos ngülliw pide?',en:'How many ngülliw does she ask?'},[...new Set([String(price),String(base*3),String(price+7),String(Math.max(1,price-3))])].slice(0,3),String(price));
        if(right)good++;
        if(v===1){if(S.gold<price){sfx('bad');return say([N('No te alcanza: pide '+price+' y tienes '+S.gold+'.','You cannot afford it: she asks '+price+' and you have '+S.gold+'.')],offer)}
          S.gold-=price;S.items[it]=(S.items[it]||0)+1;sfx(fair?'ok':'bad');
          return say([fair?L('Trafkintufe','Kümey!','Buen trato para los dos.','A good deal for both of us.'):L('Trafkintufe','Hehe...','(Se ríe.) Pagaste '+price+'. ¡En la tienda valía '+base+'!','(She laughs.) You paid '+price+'. In the shop it was '+base+'!')],offer)}
        sfx(fair?'bad':'ok');say([fair?N('Era un buen precio: '+price+' ('+numW(price)+').','That was a good price: '+price+' ('+numW(price)+').'):L('Trafkintufe','Kimimi!','¡No te dejas engañar! Pedía '+price+'.','You cannot be fooled! I was asking '+price+'.')],offer)},false,true)};
    const end=()=>{const ls=[L('Trafkintufe','Pewkayal!',good+'/5 tratos bien decididos.',good+'/5 deals judged right.')];
      if(good>=4&&first){S.flags.traf_done=1;S.items.lawen=(S.items.lawen||0)+2;sfx('lvl');ls.push(N('Te regala dos lawen: «Quien sabe contar en mapudungun no se deja engañar».','She gives you two lawen: "Whoever can count in Mapudungun is never fooled."'))}
      persist();say(ls)};
    offer()})}

/* builder steps added to the five trawün lessons */
[['lof',0,'küdaw- termina en consonante: -ymi se vuelve -imi. Küdawimi, tú trabajas.','küdaw- ends in a consonant: -ymi becomes -imi. Küdawimi, you work.'],
 ['n_lof',1,'-yngu: ellos dos. Amuyngu, ellos dos van.','-yngu: the two of them. Amuyngu, the two of them go.'],
 ['p_lof',2,'Primero -la- (no), después -a- (futuro): amu-la-a-n. Entre las dos a aparece una y: amulayan.','First -la- (not), then -a- (future): amu-la-a-n. Between the two a\'s a y appears: amulayan.'],
 ['w_lof',5,'Chumül pregunta «cuándo», y amuaymi es «irás»: Chumül amuaymi?','Chumül asks "when", and amuaymi is "you will go": Chumül amuaymi?'],
 ['e_lof',3,'-ke- va justo antes de la persona: amu-ke-ymi, amukeymi.','-ke- goes right before the person: amu-ke-ymi, amukeymi.']].forEach(([id,k,es,en])=>{
  const T=TRAWUN[id];if(!T)return;T.steps.push({b:BUILDERS[k],why:N(es,en)})});
