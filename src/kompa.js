/* ======================================================================
   Three young men from the city with small favours to ask (Nov 2026):
     · Nico, on the sea road: wants to introduce himself properly to the Lafkenche lonko
     · Seba, in the Nagche lof: his dog ran off to the animal fields and only answers to Mapudungun
     · Nacho, in Santiago's plaza: wants to send his chuchu a voice message in Mapudungun
   Their Mapudungun reuses forms already reviewed; the new combinations are in docs/review.md (Tanda 27).
   ====================================================================== */
Object.assign(LOOKS,{
  nico:{t:'M',p:'#2a8a96',P:'#1a5e68',b:'#f0f0f0',r:'#f0c040',w:'#f0f0f0'},     // a teal surf jacket
  seba:{t:'M',p:'#a33a2a',P:'#6e2418',b:'#2a2a2a',r:'#2a2a2a',w:'#e8d8b0'},     // a red flannel shirt
  nacho:{t:'M',p:'#3a3c4a',P:'#24252e',b:'#e0b040',r:'#e0b040',w:'#c8c8d0'}});  // a dark hoodie
MAPS.rupu.ents.push({id:'nico',kind:'npc',look:'nico',x:16,y:5,dir:'down',fixed:1,flag:'nico_t',talk:()=>nicoTalk(),bub:['Mari mari... mari mari...','¿Cómo era?']});
MAPS.lof.ents.push({id:'nico2',kind:'npc',look:'nico',x:20,y:7,dir:'left',fixed:1,req:'nico_t',talk:()=>nicoLof(),bub:['Mari mari, lonko!']});
MAPS.n_lof.ents.push({id:'seba',kind:'npc',look:'seba',x:16,y:10,dir:'down',fixed:1,talk:()=>sebaTalk(),bub:['¡Kiltro! ¡Kiltroooo!','...']});
MAPS.n_lof.ents.push({id:'sebadog2',kind:'npc',look:'dog',x:17,y:10,dir:'left',req:'seba_dog',talk:()=>say([L('','Kiltro','El perro de Seba mueve la cola. No se le despega.','Seba\'s dog wags its tail. It will not leave his side.')])});
MAPS.n_kullin.ents.push({id:'sebadog',kind:'npc',look:'dog',x:26,y:5,dir:'left',req:'seba_q',flag:'seba_dog',talk:()=>sebaDog()});
MAPS.s_plaza.ents.push({id:'nacho',kind:'npc',look:'nacho',x:26,y:13,dir:'up',fixed:1,talk:()=>nachoTalk(),bub:['¿Cómo se dice...?','Mari mari...']});

/* ---------- Nico: introducing himself to the lonko ---------- */
function nicoTalk(){const en=S.gloss==='en';
  say([L('Nico','Mari mari!','«Hola. Soy Nico, de Santiago. Mi chuchu es de este lof, y vine a conocer a la familia.»','"Hi. I\'m Nico, from Santiago. My chuchu is from this lof, and I came to meet the family."'),
    N('«Quiero presentarme con el lonko como se debe, en mapudungun. Pero me pongo nervioso y se me olvida todo. ¿Me ayudas a ensayar?»','"I want to introduce myself to the lonko properly, in Mapudungun. But I get nervous and forget everything. Will you help me practise?"')],()=>
    choose(L('Nico','','¿Ensayan juntos?','Practise together?'),[{m:'May',g:en?'Yes, let us practise':'Sí, ensayemos',v:1},{m:'Wüla feman',g:en?'Later':'Después',v:0}],v=>{
      if(!v)return say([L('Nico','','«Ya, aquí te espero. Mari mari... mari mari...»','"OK, I\'ll wait here. Mari mari... mari mari..."')]);
      S.flags.nico_q=1;persist();
      convo([{q:N('Primero, el saludo al llegar donde el lonko.','First, the greeting when he reaches the lonko.'),o:['Mari mari, lonko.','Pewkayal, lonko.','Chaltu may, lonko.'],a:'Mari mari, lonko.',hint:['Pewkayal es para despedirse y chaltu may para dar las gracias. Al llegar se dice mari mari.','Pewkayal is for leaving and chaltu may is for thanking. On arriving you say mari mari.']},
        {q:N('Ahora su nombre: «Me llamo Nico».','Now his name: "My name is Nico".'),o:['Iñche Nico pingen.','Eymi Nico pingeymi.','Fey Nico pingey.'],a:'Iñche Nico pingen.',hint:['Habla de sí mismo: iñche ... pingen.','He is talking about himself: iñche ... pingen.']},
        {q:N('Y de dónde viene: «Soy de Santiago».','And where he comes from: "I am from Santiago".'),o:['Santiago tuwün.','Santiago pingen.','Santiago amuan.'],a:'Santiago tuwün.',hint:['tuwün dice de dónde vienes; pingen, cómo te llamas; amuan, adónde vas a ir.','tuwün says where you come from; pingen, what you are called; amuan, where you will go.']}],()=>{
        S.flags.nico_t=1;persist();sfx('lvl');ents=ents.filter(e=>e.id!=='nico');
        say([L('Nico','Mari mari, lonko. Iñche Nico pingen. Santiago tuwün.','Lo repite tres veces, cada vez más seguro.','He says it three times, more sure of himself each time.'),
          N('«¡Ya está! Me voy al lof antes de que se me olvide. Pasa a verme por allá.»','"That\'s it! I\'m off to the lof before I forget. Come and see me there."')])},'Nico (presentarse)')},true,true))}
function nicoLof(){
  if(S.flags.nico_d)return say([L('Nico','Mari mari, '+addr(false)+'!','«El lonko me invitó al próximo trawün. ¡Y me corrigió solo una cosa!»','"The lonko invited me to the next trawün. And he only corrected one thing!"')]);
  S.flags.nico_d=1;S.gold+=40;S.items.kofke=(S.items.kofke||0)+2;persist();sfx('lvl');
  say([N('Nico está junto al lonko, sonriendo de oreja a oreja. El lonko le pone una mano en el hombro.','Nico is beside the lonko, grinning from ear to ear. The lonko rests a hand on his shoulder.'),
    L('Nico','Chaltu may, '+addr(false)+'!','«¡Le dije todo, y me entendió! Mi chuchu va a llorar cuando le cuente. Toma, la tía me mandó con pan para el camino.»','"I said all of it, and he understood me! My chuchu is going to cry when I tell her. Here, my auntie sent me off with bread for the road."'),
    L('','+'+numW(40)+' ngülliw · epu kofke','Ganas '+numP(40)+' ngülliw y dos kofke.','You get '+numP(40)+' ngülliw and two kofke.')])}

/* ---------- Seba: the dog that only answers to Mapudungun ---------- */
function sebaTalk(){const en=S.gloss==='en';
  if(S.flags.seba_d)return say([L('Seba','Mari mari, '+addr(false)+'!','«Ahora le hablo en mapudungun todo el día. El Kiltro y yo estamos aprendiendo juntos.»','"Now I talk to him in Mapudungun all day. Kiltro and I are learning together."')]);
  if(S.flags.seba_dog){S.flags.seba_d=1;S.gold+=40;S.items.lawen=(S.items.lawen||0)+1;persist();sfx('lvl');
    return say([N('El perro corre derecho a Seba y casi lo bota de un salto.','The dog runs straight to Seba and nearly knocks him over with a jump.'),
      L('Seba','Chaltu may, '+addr(false)+'!','«¡Kiltro! ¿Viste? Mi laku tenía razón: entiende mapudungun mejor que yo. Toma, es el lawen que me dio mi laku para el camino; a ti te va a servir más.»','"Kiltro! See? My laku was right: he understands Mapudungun better than I do. Here, it\'s the lawen my laku gave me for the road; you\'ll need it more than me."'),
      L('','+'+numW(40)+' ngülliw · lawen','Ganas '+numP(40)+' ngülliw y un lawen.','You get '+numP(40)+' ngülliw and a lawen.')])}
  if(S.flags.seba_q)return say([L('Seba','','«Se fue hacia los campos de los animales, al sur del lof. Llámalo en mapudungun: en castellano no me hace caso.»','"He ran off toward the animal fields, south of the lof. Call him in Mapudungun: in Spanish he ignores me."')]);
  say([L('Seba','Mari mari!','«Soy Seba, de Temuko. Vine a ayudar a mi laku en el campo y me traje a mi perro, el Kiltro.»','"I\'m Seba, from Temuko. I came to help my laku on the farm and brought my dog, Kiltro."'),
    N('«Se me arrancó hacia los campos de los animales, y no viene cuando lo llamo. Mi laku dice que el Kiltro entiende mapudungun mejor que yo... y que por eso no me hace caso.»','"He ran off toward the animal fields, and he won\'t come when I call him. My laku says Kiltro understands Mapudungun better than I do... and that\'s why he ignores me."')],()=>
    choose(L('Seba','','¿Lo buscas?','Will you look for him?'),[{m:'May',g:en?'Yes, I will find him':'Sí, lo busco',v:1},{m:'Wüla feman',g:en?'Later':'Después',v:0}],v=>{
      if(!v)return say([L('Seba','','«Ya. ¡Kiltro! ¡Kiltroooo!»','"OK. Kiltro! Kiltrooooo!"')]);
      S.flags.seba_q=1;persist();say([L('Seba','','«¡Gracias! Está en los campos, al sur. Llámalo en mapudungun, que en castellano se hace el sordo.»','"Thanks! He\'s in the fields, to the south. Call him in Mapudungun; in Spanish he plays deaf."')])},true,true))}
function sebaDog(){
  const q={m:'',es:'El perro de Seba te mira moviendo la cola, pero no se acerca. Llámalo.',en:'Seba\'s dog looks at you, wagging its tail, but does not come closer. Call him.'};
  const {o,a}={o:['Küpange!','Küpamu!','Küpamün!','Amutunge!'],a:'Küpange!'};
  const ask=()=>choose(q,o.slice().sort(()=>Math.random()-.5).map(x=>({m:x,v:x})),v=>{track('Seba (llamar al perro)',v===a,q,o,a);
    if(v===a){sfx('lvl');S.flags.seba_dog=1;persist();ents=ents.filter(e=>e.id!=='sebadog');
      return say([L(S.name,'Küpange!','¡Ven!','Come!'),N('El Kiltro para las orejas, ladra una vez y sale corriendo hacia el lof. Ya sabe volver solo.','Kiltro pricks up his ears, barks once and races off toward the lof. He knows his way back now.')])}
    sfx('bad');
    say([N(v==='Amutunge!'?'El perro se aleja unos pasos, ofendido: le dijiste que se fuera.':'El perro inclina la cabeza, confundido. Es un solo perro: -mu es para dos y -mün para tres o más.',
      v==='Amutunge!'?'The dog backs off a few steps, offended: you told him to go away.':'The dog tilts his head, confused. It is a single dog: -mu is for two and -mün for three or more.')],ask)},false,true);
  ask()}

/* ---------- Nacho: a voice message for his chuchu ---------- */
function nachoTalk(){const en=S.gloss==='en';
  if(S.flags.nacho_d)return say([L('Nacho','Mari mari, '+addr(false)+'!','«Mi chuchu ahora me manda audios en mapudungun todos los días. Me demoro, pero los entiendo.»','"My chuchu sends me voice messages in Mapudungun every day now. They take me a while, but I understand them."')]);
  say([L('Nacho','Mari mari!','«Soy Nacho. Mi chuchu vive en Temuko y me mandó sopaipillas por encomienda. Le quiero dar las gracias con un audio en mapudungun... para que no me reclame que se lo hablo en castellano.»','"I\'m Nacho. My chuchu lives in Temuko and sent me sopaipillas by bus courier. I want to thank her with a voice message in Mapudungun... so she stops complaining that I talk to her in Spanish."'),
    N('«Tengo el celular listo. ¿Me dices qué decir?»','"I\'ve got my phone ready. Will you tell me what to say?"')],()=>
    choose(L('Nacho','','¿Lo ayudas con el audio?','Help him with the message?'),[{m:'May',g:en?'Yes, let us record it':'Sí, grabemos',v:1},{m:'Wüla feman',g:en?'Later':'Después',v:0}],v=>{
      if(!v)return say([L('Nacho','','«Ya, aquí sigo. ¿Cómo era... mari mari?»','"OK, I\'m still here. How did it go... mari mari?"')]);
      convo([{q:N('Primero, saludarla.','First, greet her.'),o:['Mari mari, chuchu!','Pewkayal, chuchu!','Chaltu may, chuchu!'],a:'Mari mari, chuchu!',hint:['Para saludar: mari mari.','To greet: mari mari.']},
        {q:N('Después, preguntarle cómo está.','Then, ask her how she is.'),o:['Chumleymi?','Kümelen.','Chew müleymi?'],a:'Chumleymi?',hint:['¿Cómo estás?: chumleymi. Kümelen es la respuesta.','How are you?: chumleymi. Kümelen is the answer.']},
        {q:N('Ahora, darle las gracias por las sopaipillas.','Now, thank her for the sopaipillas.'),o:['Chaltu may!','Mari mari!','Pewkayal!'],a:'Chaltu may!',hint:['Para agradecer: chaltu may.','To thank: chaltu may.']},
        {q:N('Y despedirse.','And say goodbye.'),o:['Pewkayal!','Chaltu may!','Kümelen.'],a:'Pewkayal!',hint:['Para despedirse: pewkayal.','To say goodbye: pewkayal.']}],()=>{
        S.flags.nacho_d=1;S.gold+=60;persist();sfx('lvl');
        say([L('Nacho','Mari mari, chuchu! Chumleymi? Chaltu may! Pewkayal!','Graba, escucha, borra, vuelve a grabar. A la tercera queda conforme y lo manda.','He records, listens, deletes, records again. On the third try he is happy and sends it.'),
          N('El celular vibra casi al tiro: la chuchu le contesta con un audio de cinco minutos. Nacho se ríe y se pone colorado.','The phone buzzes almost at once: his chuchu answers with a five-minute voice message. Nacho laughs and turns red.'),
          L('Nacho','Chaltu may, '+addr(false)+'!','«Toma, para ti: yo invito las sopaipillas la próxima vez.»','"Here, this is for you: the sopaipillas are on me next time."'),
          L('','+'+numW(60)+' ngülliw','Ganas '+numP(60)+' ngülliw.','You get '+numP(60)+' ngülliw.')])},'Nacho (audio)')},true,true))}

/* ---------- Carmen Lienkura (Williche lof): the külon for the mushay. Her first words are Brandon's own, shown without a translation on purpose. ---------- */
LOOKS.carmen={t:'F',c:'#2a4a8a',C:'#1a305e',r:'#d83030'};
MAPS.w_lof.ents.push({id:'carmen',kind:'npc',look:'carmen',fem:1,x:12,y:8,dir:'down',fixed:1,talk:()=>carmenTalk(),bub:['Mari mari!','Külon...']});

function carmenTalk(){const en=S.gloss==='en',have=S.items.kulon||0;
  if(S.flags.carmen_d){S.flags.carmen_r=((S.flags.carmen_r||0)+1)%2;   // after the quest she alternates: her thanks, then her own untranslated words
    return say([S.flags.carmen_r?L('Carmen Lienkura',"Feypienew fentreke che 'Rume küme adngerkey feychi dewmalfilu tüfachi awkantun' pingerken. Pewmangele pepi kimnieafiñ kiñe antü.",'',''):L('Carmen Lienkura','Mari mari, '+addr(true)+'!','«El mushay quedó rico. Esta noche, en el trawün, brindamos por ti.»','"The mushay turned out lovely. Tonight, at the trawün, we will drink to you."')])}
  if(S.flags.carmen_q){
    if(have<3)return say([L('Carmen Lienkura','Küla külon eluaen.','«Me vas a dar tres külon.» Tienes '+numP(have)+'. Hay külon en los arbustos del monte, y también se venden en las tiendas.','"You will give me three külon." You have '+numP(have)+'. There are külon on the bushes in the forest, and the shops sell them too.')]);
    const q={m:'',es:'Le pasas los tres külon a Carmen. ¿Qué le dices?',en:'You hand Carmen the three külon. What do you say?'},{o,a}={o:['Küla külon elueyu.','Küla külon eluaen.','Küla külon nien.'],a:'Küla külon elueyu.'};
    const ask=()=>choose(q,o.slice().sort(()=>Math.random()-.5).map(x=>({m:x,v:x})),v=>{track('Carmen (dar)',v===a,q,o,a);
      if(v!==a){sfx('bad');return say([N(v==='Küla külon eluaen.'?'Carmen se ríe: «¿Me los estás pidiendo a mí?». Eluaen es «me vas a dar»: lo dice quien pide. Quien da dice elueyu, «te doy».':'«Küla külon nien» es «tengo tres külon»: es verdad, pero se los estás dando. Quien da dice elueyu, «te doy».',
        v==='Küla külon eluaen.'?'Carmen laughs: "Are you asking me for them?" Eluaen is "you will give me": the one who asks says it. The one who gives says elueyu, "I give you".':'"Küla külon nien" is "I have three külon": true, but you are giving them to her. The one who gives says elueyu, "I give you".')],ask)}
      S.items.kulon-=3;S.flags.carmen_d=1;S.gold+=50;S.items.mate=(S.items.mate||0)+2;persist();sfx('lvl');
      say([L(S.name,'Küla külon elueyu.','Te doy tres külon.','I give you three külon.'),
        L('Carmen Lienkura','Chaltu may, '+addr(true)+'!','«¡Justo los que faltaban!» Muele los frutitos morados en una fuente de madera y el agua se pone color vino.','"Just the ones I was missing!" She grinds the little purple berries in a wooden bowl and the water turns the colour of wine.'),
        N('«Toma, para el camino: un poco de mate, y unos ngülliw que me sobraron del mercado.»','"Here, for the road: some mate, and a few ngülliw I had left over from the market."'),
        L('','+'+numW(50)+' ngülliw · epu mate','Ganas '+numP(50)+' ngülliw y dos mate.','You get '+numP(50)+' ngülliw and two mate.')])},false,true);
    return ask()}
  say([L('Carmen Lienkura',"Feypienew fentreke che 'Rume küme adngerkey feychi dewmalfilu tüfachi awkantun' pingerken. Pewmangele pepi kimnieafiñ kiñe antü.",'',''),
    N('Carmen se ríe sola y sigue revolviendo una olla vacía.','Carmen laughs to herself and keeps stirring an empty pot.'),
    N('«Perdona, mari mari. Soy Carmen. Estoy preparando mushay, la bebida de külon (maqui), para el trawün de esta noche... pero me faltan los külon.»','"Sorry, mari mari. I\'m Carmen. I\'m making mushay, the külon (maqui) drink, for tonight\'s trawün... but I\'m out of külon."'),
    L('Carmen Lienkura','Küla külon eluaen.','Me vas a dar tres külon (maqui).','You will give me three külon (maqui berries).')],()=>
    choose(L('Carmen Lienkura','','¿Le traes tres külon?','Will you bring her three külon?'),[{m:'May',g:en?'Yes, I will bring them':'Sí, se los traigo',v:1},{m:'Wüla feman',g:en?'Later':'Después',v:0}],v=>{
      if(!v)return say([L('Carmen Lienkura','','«Aquí estaré, con mi olla vacía.»','"I will be here, with my empty pot."')]);
      S.flags.carmen_q=1;persist();
      say([L('Carmen Lienkura','Chaltu may!','«Gracias. Hay külon en los arbustos del monte, y en las tiendas los venden.»','"Thank you. There are külon on the bushes in the forest, and the shops sell them."')])},true,true))}
