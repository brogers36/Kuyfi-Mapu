/* ============================================================
   NPC SCRIPTS
   ============================================================ */
const nm=()=>S.name;
function learnRoot(r){if(S.roots.includes(r))return;S.roots.push(r);
  if(r==='nagtu'&&typeof ents!=='undefined'){   // flyers held back before nagtu- come back now
    for(const e of ents)if(e.kind==='enemy'&&e.p0){e.party=e.p0.slice();delete e.p0}
    for(const e0 of FLYHELD){const [ex,ey]=placeNear(e0.x,e0.y,true);ents.push(Object.assign({},e0,{x:ex,y:ey,fx:ex,fy:ey,ox:ex,oy:ey,cd:30+rnd(60),dir:'down',pi:0,wait:0,bt:rnd(400)}))}
    FLYHELD=[]}}
function introScript(){
  say([
    L('Kuku','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!'),
    L('Kuku','Chumleymi?','¿Cómo estás?','How are you?'),
    L(nm(),'Kümelen, kuku. Eymi kay?','Estoy bien, kuku. ¿Y tú?','I am well, kuku. And you?'),
    L('Kuku','Iñche ka kümelen. Welu... müley wekufü!','Yo también estoy bien. Pero... ¡hay wekufü!','I am well too. But... there are wekufü!'),
    L('Kuku','Kimeltuaeyu!','¡Te voy a enseñar! Ven, peleemos juntos la primera vez. Yo te voy diciendo qué hacer.','I will teach you! Come, let us fight the first one together. I will tell you what to do.')
  ],()=>startBattle(['laftrache'],{tut:1,after:introAfterTut}));
}
function introAfterTut(){
  say([
    L('Kuku','Kümey, '+nm()+'! Tuteymi!','¡Muy bien, '+nm()+'! ¡Lo lograste!','Well done, '+nm()+'! You did it!'),
    L('Kuku','Kiñe: amutunge. Epu: amutumu. Küla: amutumün.','Uno: amutunge. Dos: amutumu. Tres (o más): amutumün.','One: amutunge. Two: amutumu. Three (or more): amutumün.'),
    N('Cuenta siempre a los wekufü antes de hablarles. Y tu newen no vuelve solo: descansa junto a cada kütral que encuentres.','Always count the wekufü before you speak to them. And your newen does not come back on its own: rest by every kütral you find.'),
    L('Kuku','Kiñe chillka elueyu.','Te doy un chillka, un libro.','I give you a chillka, a book.'),
    N('En el chillka están las terminaciones de los verbos, la negación, el futuro, los números y los colores. Ábrelo en el menú (M), y también cuando una piedra te haga una pregunta. No trae las respuestas: trae los patrones para que las descubras.','The chillka holds verb endings, negation, the future, numbers and colours. Open it from the menu (M), and also whenever a stone asks you a question. It does not hold the answers: it holds the patterns so you can discover them.'),
    L('Kuku','Lof mew amuaymi. Lonko mew dungunge.','Ve al lof. Habla con el lonko.','Go to the lof. Speak with the lonko.'),
    L('Kuku','Pewkayal!','¡Hasta luego!','See you later!')
  ],()=>{learnRoot('küpa');S.flags.intro=1;persist()});
}
function kukuRupu(){say([L('Kuku','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!'),
  L('Kuku','Kiñe: amutunge. Epu: amutumu. Küla: amutumün.','Uno: amutunge. Dos: amutumu. Tres (o más): amutumün.','One: amutunge. Two: amutumu. Three (or more): amutumün.'),
  N('Cuenta los wekufü antes de hablarles. Si le hablas a uno solo, siempre es -nge.','Count the wekufü before you speak to them. If you speak to just one, it is always -nge.'),
  N('Y no olvides tu chillka: ahí están los patrones de los verbos (menú, M).','And do not forget your chillka: the verb patterns are in it (menu, M).')])}
function rot(id,n){S.rotc=S.rotc||{};const i=(S.rotc[id]||0)%n;S.rotc[id]=i+1;return i}
function weaverTalk(){
  if(S.flags.weaver)return say([
    [L('Ngürekafe','Ngürekalen, '+addr(true)+'.','Estoy tejiendo, '+addr(true)+'.','I am weaving, '+addr(true)+'.'),L('Ngürekafe','Elangechi tami trarilonko!','¡Qué lindo tu trarilonko!','Your trarilonko is lovely!')],
    [L('Ngürekafe','Kelü ka kallfü engu ayüfiñ.','Me gustan el rojo y el azul.','I like red and blue.'),N('Te muestra los hilos teñidos, colgados al sol como un arcoíris chico.','She shows you the dyed threads, hung in the sun like a small rainbow.')],
    [L('Ngürekafe','Wüle ka ngürekayan.','Mañana sigo tejiendo.','Tomorrow I will keep weaving.'),L('Ngürekafe','Pichi küdaw, fütra küdaw!','¡Trabajo chico, trabajo grande!','Small work, big work!')]][rot('weaver',3)]);
  S.flags.weaver=1;
  say([L('Ngürekafe','Mari mari, '+addr(true)+'!','¡Hola, '+addr(true)+'!','Hello, '+addr(true)+'!'),
    L('Ngürekafe','Iñche ngürekaken. Tüfa witral pingey.','Yo tejo. Esto se llama witral.','I weave. This is called a witral.'),
    L('Ngürekafe','Kiñe makuñ ngürekalen.','Estoy tejiendo un makuñ (poncho).','I am weaving a makuñ (poncho).'),
    N('Cada figura del tejido se aprende mirando a las abuelas. Las manos también recuerdan.','Every figure in the weaving is learned by watching the grandmothers. Hands remember too.'),
    N('(Aprendiste: ngürekan = tejer, witral = telar, makuñ = poncho.)','(You learned: ngürekan = to weave, witral = loom, makuñ = poncho.)')]);
}
function cookTalk(){
  const lines=[L('Papay','Mari mari, '+addr(true)+'!','¡Hola, '+addr(true)+'!','Hello, '+addr(true)+'!'),
    L('Papay','Iyael dewmalen.','Estoy haciendo comida.','I am making food.')];
  if(!S.flags.cook){S.flags.cook=1;S.items.kofke++;persist();
    lines.push(L('Papay','Iaymi am? Kiñe kofke elueyu.','¿Vas a comer? Te doy un pan.','Will you eat? I give you a bread.'),
      L(nm(),'Chaltu may, papay!','¡Gracias, señora!','Thank you, ma\'am!'),N('Recibiste un kofke.','You received a kofke.'));sfx('pick')}
  else lines.push(...[
    [L('Papay','Kofke, ilo, poñü... Kümey!','Pan, carne, papas... ¡Qué rico!','Bread, meat, potatoes... Delicious!')],
    [L('Papay','Afümchallwalerken fachantü.','Hoy estoy preparando pescado.','Today I am making fish.')],
    [L('Papay','Müna kümey ti korü!','¡Qué rica está la sopa!','The soup is so good!')]][rot('cook',3)]);
  say(lines);
}
const LESSON=[{q:{es:'(Señala el pan.)',en:'(She points at the bread.)'},a:'kofke',o:['kofke','ko','kütral']},
  {q:{es:'(Señala el agua del cántaro.)',en:'(She points at the water in the jug.)'},a:'ko',o:['lafken','ko','kofke']},
  {q:{es:'(Señala el fuego.)',en:'(She points at the fire.)'},a:'kütral',o:['kütral','antü','ruka']},
  {q:{es:'(Señala una casa.)',en:'(She points at a house.)'},a:'ruka',o:['mawida','ruka','lof']},
  {q:{es:'(Señala un pescado.)',en:'(She points at a fish.)'},a:'challwa',o:['trewa','challwa','külon']},
  {q:{es:'(Señala al perro.)',en:'(She points at the dog.)'},a:'trewa',o:['trewa','mañke','pewen']}];
function teacherTalk(){
  const i=(S.flags.lesson||0)%LESSON.length,Ls=LESSON[i];
  const first=!S.flags.lesson;
  say([L('Kimeltuchefe','Mari mari, '+addr(true)+'!'+(first?' Iñche kimeltuchefe ngen.':''),'¡Hola, '+addr(true)+'!'+(first?' Soy profesora.':''),'Hello, '+addr(true)+'!'+(first?' I am a teacher.':'')),
    first?L('Kimeltuchefe','Mapudungun kimeltuken.','Enseño mapudungun.','I teach Mapudungun.'):null,
    L('Kimeltuchefe','Chem pingey tüfa?','¿Cómo se llama esto?','What is this called?')],()=>{
    choose(L('',G(Ls.q),'',''),Ls.o.map(o=>({m:o+' pingey.',v:o})),v=>{
      if(v===Ls.a){S.flags.lesson=(S.flags.lesson||0)+1;S.xp+=3;persist();
        say([praise(),L('Kimeltuchefe','Femngechi pingey. Tutelu may!',Ls.a+', así se llama. ¡Muy bien!','It is called '+Ls.a+'. Well done!'),N('+3 kimün.','+3 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
      else{sfx('bad');say([L('Kimeltuchefe','Fey no...','No, eso no...','No, not that...'),N('Escucha otra vez y vuelve a intentarlo.','Listen again and try once more.')])}
    },false,true)});
}
function levelUpCheck(){const ls=[];while(S.xp>=xpNeed()){S.xp-=xpNeed();S.lvl++;S.baseMax+=HPQ;S.hp+=HPQ;S.baseAtk+=1;if(S.lvl%2===0||S.hm)S.baseDef+=1;
  ls.push(L('','Doy kimün! Akuymi kimün nivel '+S.lvl+'. Llowfimi ka piwke ka doy newentuymi.','¡Más conocimiento! Llegas a kimün '+S.lvl+': ganas un corazón y más fuerza.','More knowledge! You reach kimün '+S.lvl+': you gain a heart and more strength.'))}
  if(ls.length){sfx('lvl');persist();say(ls)}}
function kidTalk(i){
  const T=[[L('Pichiche','Kiñe, epu, küla, meli!','¡Uno, dos, tres, cuatro!','One, two, three, four!'),L('Pichiche','Kechu, kayu... regle?','Cinco, seis... ¿siete?','Five, six... seven?')],
    [L('Pichiche','Mari mari, '+addr(false)+'!','¡Hola, '+addr(false)+'!','Hello, '+addr(false)+'!'),L('Pichiche','Mapudungun ayükefiñ!','¡Me gusta el mapudungun!','I love Mapudungun!')],
    [L('Pichiche','Iñche ka kimnien: "kofke", "ko", "kütral"!','Yo también sé: "pan", "agua", "fuego".','I know too: "bread", "water", "fire"!')]][i];
  say(T);
}
function walkerTalk(){say([
  [L('Wentru','Mari mari, '+addr(false)+'.','Hola, '+addr(false)+'.','Hello, '+addr(false)+'.'),L('Wentru','Mamüll yelen ruka mew.','Llevo leña a la casa.','I am carrying firewood home.'),L('Wentru','Mawünay.','Va a llover.','It is going to rain.')],
  [L('Wentru','Küdawken fachantü.','Hoy estoy trabajando.','Today I am working.'),L('Wentru','Pewkayal!','¡Hasta luego!','See you later!')],
  [L('Wentru','Mawün ayülafiñ.','No me gusta la lluvia.','I do not like the rain.'),L('Wentru','Ruka mew amutuan.','Me voy a la casa.','I am heading home.')]][rot('walker',3)])}
function runnerTalk(){say([L('Pichi domo','Ayüwün!','¡Qué contenta estoy!','I am so happy!'),N('La niña sigue corriendo en círculos, riéndose.','The girl keeps running in circles, laughing.')])}
function dogTalk(){sfx('ok');say([L('','Trewa','Un trewa (perro) mueve la cola y te huele la mano.','A trewa (dog) wags its tail and sniffs your hand.')])}
function konaTalk(){
  if(typeof PAL!=='undefined'&&PAL&&PAL.on)return say([L('Kona','Palintuleiñ! Pali mew inafinge!','¡Estamos jugando! ¡Ve por la pali!','We are playing! Go for the pali!')]);
  if(CUR==='lof')return choose(L('Kona','Palintuayu?','¿Jugamos un palin?','Shall we play palin?'),
    [{m:'May!',g:S.gloss==='en'?'Yes, let us play':'Sí, juguemos',v:1},
     {m:'Ka antü.',g:S.gloss==='en'?'Another day':'Otro día',v:0}],v=>{
      if(v)return say([N('Vamos a la cancha. Muévete con las flechas y al alcanzar la pali la golpeas sola (o con Z o Espacio); llévala hasta la raya del puel, a la derecha. De vez en cuando, grita la jugada a tu equipo en mapudungun. El primero a 3 gana.','Off to the field. Move with the arrows and reach the pali to strike it (or press Z or Space); take it to the puel line, on the right. Every so often, shout the call to your team in Mapudungun. First to 3 wins.')],()=>palinStart());
      konaIdle()},true);
  konaIdle()}
function konaIdle(){say([
  [L('Kona','Mari mari, '+addr(false)+'! Palin müley.','¡Hola, '+addr(false)+'! Hay palin.','Hello, '+addr(false)+'! There is a palin game.'),
   L('Kona','Iñche ka palin ayükefiñ.','A mí también me gusta el palin.','I like palin too.'),
   N('Dos equipos, cada jugador con su wiño (un palo curvo), buscan llevar la pali (la bola) hasta el final de la cancha, el paliwe.','Two teams, each player with a wiño (a curved stick), try to carry the pali (the ball) to the end of the field, the paliwe.')],
  [L('Kona','Küme wiño tüfa!','¡Buen wiño este!','This is a good wiño!'),
   L('Kona','Wüle fütra palin müley.','Mañana hay un gran palin.','Tomorrow there is a big palin game.')],
  [L('Kona','Matu lefken palin mew!','¡En el palin corro rápido!','In palin I run fast!'),
   N('Hace girar el wiño en la mano y sonríe, desafiante.','He spins the wiño in his hand and grins, daring you.')]][rot('kona',3)])}
function fisherTalk(){const fv=rot('fisher',3);
  if(fv===1)return say([L('Challwafe','Fachantü alün challwa müley!','¡Hoy hay mucho pescado!','Today there is so much fish!'),
    N('Te muestra el canasto: plateado y lleno hasta el borde.','He shows you the basket: silver and full to the brim.')]);
  if(fv===2)return say([L('Challwafe','Lafken llükakelafiñ.','No le temo al mar.','I do not fear the sea.'),
    L('Challwafe','Millalobo müley lafken mew.','El Millalobo está en el mar.','The Millalobo is in the sea.')]);
  say([L('Challwafe','Mari mari, '+addr(false)+'!','¡Hola, '+addr(false)+'! (challwafe: pescador)','Hello, '+addr(false)+'! (challwafe: fisherman)'),
  L('Challwafe','Challwatuken lafken mew.','Pesco en el mar.','I fish in the sea.'),
  N('Los ngülliw se cuentan en mapudungun. Escucha:','Ngülliw are counted in Mapudungun. Listen:'),
  L('Challwafe','Kiñe, epu, küla, meli, kechu.','Uno, dos, tres, cuatro, cinco.','One, two, three, four, five.'),
  L('Challwafe','Kayu, regle, pura, aylla, mari.','Seis, siete, ocho, nueve, diez.','Six, seven, eight, nine, ten.'),
  L('Challwafe','Epu mari, küla mari... kechu mari.','Veinte, treinta... cincuenta.','Twenty, thirty... fifty.')])}
function childTalk(){
  if(!S.flags.childk){
    say([L('Pichiche','Mari mari!','¡Hola! ¿Te digo un konew? (adivinanza)','Hello! Want a konew? (riddle)')],()=>{
      choose(L('Pichiche','Lafken mew müley; pu che nükefingün ka ikefingün. Chem am ta tatey?','Vive en el mar; la gente lo pesca y se lo come. ¿Qué será?','It lives in the sea; people catch it and eat it. What could it be?'),
        [{m:'challwa',g:'pez / fish',v:1},{m:'mañke',g:'cóndor / condor',v:0},{m:'pewen',g:'araucaria',v:0},{m:'kuyüm',g:'arena / sand',v:0}],v=>{
          if(v){S.flags.childk=1;S.items.kulon++;persist();sfx('pick');say([praise(),L('Pichiche','Challwa! Kiñe külon elueyu.','¡Pez! Te doy un külon.','Fish! I give you a külon.')])}
          else{sfx('bad');say([N('Mm, no. Piensa en el mar...','Hmm, no. Think of the sea...')])}},false,false)})
  }else say([L('Pichiche','Pewkayal!','¡Chao!','Bye!')]);
}
function pescadoraTalk(){
  if(!S.roots.includes('nagtu')){
    say([L('Challwafe','Mari mari, '+addr(true)+'.','Hola, '+addr(true)+'.','Hello, '+addr(true)+'.'),
      L('Challwafe','Wefi chonchon!','¡Apareció un chonchon!','A chonchon appeared!'),
      N('Los chonchon vuelan alto: amutu- no los alcanza. Primero diles nagtu- ("bajar"): nagtunge, nagtumu, nagtumün. Ya en el suelo, échalos.','Chonchon fly high: amutu- cannot reach them. First tell them nagtu- ("come down"): nagtunge, nagtumu, nagtumün. Once they are on the ground, drive them off.'),
      N('Aprendiste nagtu- (bajar).','You learned nagtu- (come down).')],()=>{learnRoot('nagtu');sfx('lvl');persist()});
  }else say([L('Challwafe','Newentuleaymi!','¡Ánimo!','Be strong!'),N('Los anchümalleñ brillan y curan a otros wekufü. Si los haces dormir con umawtu-, dejan de molestar.','The anchümalleñ glow and heal other wekufü. If you make them sleep with umawtu-, they stop helping.')]);
}
function gathererTalk(){
  const ls=[L('Domo','Mari mari, '+addr(true)+'!','¡Hola, '+addr(true)+'!','Hello, '+addr(true)+'!'),L('Domo','Külon kintuiawün.','Ando buscando maqui.','I am looking for maqui.')];
  if(!S.flags.gatherer){S.flags.gatherer=1;S.items.kulon+=2;persist();sfx('pick');ls.push(L('Domo','Epu külon elueyu.','Te doy dos külon.','I give you two külon.'),N('Recibiste dos külon.','You received two külon.'))}
  ls.push(L('Domo','Mawida mew müley lawen.','En el monte hay lawen (plantas que sanan).','In the forest there is lawen (healing plants).'));say(ls);
}
function fisher2Talk(){say([L('Challwafe','Mari mari, '+addr(false)+'.','Hola, '+addr(false)+'.','Hello, '+addr(false)+'.'),L('Challwafe','Challwatuken. Welu lafken mew müley Trelke-wekufü.','Pesco. Pero en la laguna está Trelke-wekufü.','I fish. But Trelke-wekufü is in the lagoon.'),
  N('Ya casi no hay peces. El agua está callada desde que el trelke-wekufü envolvió a Ngen-lafken.','There are hardly any fish now. The water has been silent since the trelke-wekufü wrapped up Ngen-lafken.')])}
function shoreWomanTalk(){say([L('Papay','Mari mari, '+addr(true)+'.','Hola, '+addr(true)+'.','Hello, '+addr(true)+'.'),
  N('Ese sendero lleva al islote. Ahí abajo está la cueva del trelke-wekufü: tres pisos de piedra, rejas y puertas cerradas.','That path leads to the islet. Down there is the trelke-wekufü\'s cave: three floors of stone, gates and locked doors.'),
  N('Empuja las piedras sobre las losas, busca llaves pequeñas y descansa en cada kütral.','Push the stones onto the plates, look for small keys, and rest at every kütral.'),
  L('Papay','Newentuleaymi!','¡Ánimo!','Be strong!')])}
function shop(where){
  say([L('Ngillakafe','Mari mari! Chem ngillayaymi?','¡Hola! ¿Qué vas a comprar?','Hello! What will you buy?')],list);
  function list(){
    const opts=[];
    for(const k in ITEMS)opts.push({m:ITEMS[k].m+'  ·  '+ITEMS[k].p,g:numW(ITEMS[k].p)+' ngülliw · '+G(ITEMS[k]),v:'i:'+k});
    for(const k in GEAR){if(GEAR[k].hide)continue;opts.push({m:GEAR[k].m+'  ·  '+GEAR[k].p,g:S.gear[k]&&!S.hm?(S.gloss==='en'?'(already yours)':'(ya lo tienes)'):numW(GEAR[k].p)+' ngülliw · '+G(GEAR[k])+(S.gear[k]?(S.gloss==='en'?' · you have ':' · tienes ')+numP(+S.gear[k]):''),v:'g:'+k,dis:!!S.gear[k]&&!S.hm})}   // master and weichafe mode: these can be bought again and stack
    opts.push({m:'Pewkayal',g:S.gloss==='en'?'See you later (leave)':'Hasta luego (salir)',v:'x'});
    choose({es:'Tienes '+numP(S.gold)+' ngülliw.',en:'You have '+numP(S.gold)+' ngülliw.'},opts,v=>{
      if(v===null||v==='x')return say([L('Ngillakafe','Pewkayal!','¡Hasta luego!','See you later!')]);
      const [t,k]=v.split(':'),it=t==='i'?ITEMS[k]:GEAR[k];
      if(S.gold<it.p){sfx('bad');return say([N('No te alcanzan los ngülliw. Te faltan '+numP(it.p-S.gold)+'.','You do not have enough ngülliw. You need '+numP(it.p-S.gold)+' more.')],list)}
      const en=S.gloss==='en';
      if(t==='i'){ // consumables: choose how many, counted in Mapudungun
        const most=Math.floor(S.gold/it.p),qs=[1,2,3,4,5,10].filter(n=>n<=most);if(most>5&&!qs.includes(most))qs.push(most);
        const qo=qs.map(n=>({m:numW(n)+(n===most&&n>5?(en?'  (all you can)':'  (todo lo que alcanza)'):''),g:n+' × '+it.m+' = '+(n*it.p)+' ngülliw',v:n}));
        qo.push({m:'Ngillalayafiñ',g:en?'I will not buy it (back)':'No lo voy a comprar (volver)',v:0});
        return choose(L('',it.m+' · '+numW(it.p)+' ngülliw','¿Cuántos compras? (tienes '+numP(S.items[k]||0)+')','How many will you buy? (you have '+numP(S.items[k]||0)+')'),qo,n=>{
          if(!n)return list();
          S.gold-=it.p*n;S.items[k]=(S.items[k]||0)+n;persist();sfx('pick');
          say([L('Ngillakafe','Chaltu may! '+numW(n)+' '+it.m+'.','¡Gracias! Te llevas '+n+'.','Thank you! You take '+n+'.')],list)},true,false);
      }
      choose(L('',it.m+' · '+numW(it.p)+' ngülliw','¿Lo compras?','Buy it?'),[{m:'Ngillayafiñ',g:en?'I will buy it':'Lo voy a comprar',v:1},{m:'Ngillalayafiñ',g:en?'I will not buy it':'No lo voy a comprar',v:0}],y=>{
        if(!y)return list();
        S.gold-=it.p;S.gear[k]=(+S.gear[k]||0)+1;if(k==='trariwe')S.hp+=HPQ;
        persist();sfx('pick');say([L('Ngillakafe','Chaltu may!','¡Gracias!','Thank you!')],list)},true,false)
    },true,true);
  }
}
function ngenTalk(){const ls=[L('Ngen-lafken','Mapudungukeaiñ!','¡Hablemos mapudungun!',"Let's speak Mapudungun!")];
  if(!S.flags.sb1)ls.push(N('«Una cosa más... En los pantanos del sur de las dunas duerme una fütra filu (una culebra gigante) peluda, con crin de kawellu (caballo). Camina por donde el barro burbujea, junto al agua del este. Pero ve preparado: solo las palabras justas rompen sus sellos.»','"One more thing... In the marshes south of the dunes sleeps a hairy futra filu (a giant snake) with a kawellu (horse) mane. Walk where the mud bubbles, by the eastern water. But go prepared: only the right words break its seals."'));
  say(ls)}
function fireSave(){
  S.hp=maxHP();S.sp=SPMAX;S.save={map:CUR,x:P.x,y:P.y};persist();sfx('heal');
  say([L('','Kütral mew ürkütun.','Descansas junto al kütral. Tus piwke y tu newen especial se recuperan por completo, y tu camino queda guardado.','You rest by the fire. Your hearts and your special newen are fully restored, and your journey is saved.')]);
}
function openChest(x,y,what){
  if(what==='locked'&&S.flags.wind){setTileFlag(x,y);S.gold+=100;persist();return gainPiwke([N('El viento te deja pasar. Dentro del cofre hay pataka (100) ngülliw y algo rojo...','The wind lets you through. Inside the chest are pataka (100) ngülliw and something red...')])}
  if(what==='locked')return say([N('Un cofre detrás del viento. Tendrás que volver con el newen de Ngen-kürüf.','A chest behind the wind. You will have to come back with the newen of Ngen-kürüf.')]);
  setTileFlag(x,y);sfx('pick');
  if(what==='numgift'){S.gold+=30;S.items.kofke++;persist();return say([L('','Küla mari ngülliw!','Dentro hay küla mari (30) ngülliw y un kofke.','Inside are küla mari (30) ngülliw and a kofke.')])}
  if(what==='mawgift'){S.gold+=40;S.items.lawen++;persist();return say([L('','Meli mari ngülliw!','Dentro hay meli mari (40) ngülliw y un lawen.','Inside are meli mari (40) ngülliw and a lawen.')])}
  if(what==='winotu'){learnRoot('wüñotreka');S.flags.root_winotu=1;persist();sfx('lvl');return say([
    L('','wüñotreka-','Encontraste una raíz nueva: wüñotreka-, «volver atrás, retroceder».','You found a new root: wüñotreka-, «step back».'),
    L('','wüñotrekange · wüñotrekamu · wüñotrekamün','¡Vuelve atrás! (a uno) · (a dos) · (a tres o más)','Go back! (to one) · (to two) · (to three or more)'),
    N('Un wekufü al que le dices que vuelva atrás retrocede y pierde su turno. Y dicen que hasta el Witranalwe se encoge cuando lo obligan a retroceder.','A wekufü you tell to go back steps away and loses its turn. And they say even the Witranalwe shrinks when it is forced back.')])}
  if(what==='tripa'){learnRoot('tripa');S.flags.root_tripa=1;persist();sfx('lvl');return say([
    L('','tripa-','Encontraste una raíz nueva: tripa-, «salir».','You found a new root: tripa-, «come out».'),
    L('','tripange · tripamu · tripamün','¡Sal! (a uno) · (a dos) · (a tres o más)','Come out! (to one) · (to two) · (to three or more)'),
    N('Lo que se esconde, sale cuando se le dice. Dicen que el Kaleuche se esconde en la niebla...','What hides comes out when it is told to. They say the Kaleuche hides in the fog...')])}
  if(what==='puelgift'){S.gold+=50;S.items.lawen++;persist();return say([L('','Kechu mari ngülliw!','Dentro hay kechu mari (50) ngülliw y un lawen.','Inside are kechu mari (50) ngülliw and a lawen.')])}
  if(what==='nepe'){learnRoot('nepe');S.flags.root_nepe=1;persist();sfx('lvl');return say([
    L('','nepe-','Encontraste una raíz nueva: nepe-, «despertar».','You found a new root: nepe-, «wake up».'),
    L('','nepenge · nepemu · nepemün','¡Despierta! (a uno) · (a dos) · (a tres o más)','Wake up! (to one) · (to two) · (to three or more)'),
    N('Lo que duerme, despierta de golpe cuando se le grita: el susto lo sacude. Y dicen que el Walichu pelea dormido, envuelto en un sueño gris que los golpes no atraviesan...','What sleeps wakes with a start when you shout at it: the shock rattles it. And they say the Walichu fights in its sleep, wrapped in a grey dream that blows cannot pass through...')])}
  if(what==='wutre'){learnRoot('wütre');S.flags.root_wutre=1;persist();sfx('lvl');return say([
    L('','wütre-','Encontraste una raíz nueva: wütre-, «tener frío».','You found a new root: wütre-, «be cold».'),
    L('','wütrenge · wütremu · wütremün','¡Ten frío! (a uno) · (a dos) · (a tres o más)','Be cold! (to one) · (to two) · (to three or more)'),
    N('El frío apaga el fuego de los wekufü de fuego, y hace tiritar a los demás. Pero a los wekufü de nieve... les encanta.','The cold puts out the fire of fire wekufü, and makes the others shiver. But snow wekufü... love it.')])}
  if(what==='pewgift'){S.gold+=60;S.items.lawen++;persist();return say([L('','Kayu mari ngülliw!','Dentro hay kayu mari (60) ngülliw y un lawen.','Inside are kayu mari (60) ngülliw and a lawen.')])}
  if(what==='lawen1'){S.items.lawen++;persist();return say([L('','Lawen!','Encontraste un lawen (remedio).','You found a lawen (medicine).')])}
  if(what==='nam'){learnRoot('ñam');S.flags.root_nam=1;persist();sfx('lvl');return say([
    L('','ñam-','Encontraste una raíz nueva: ñam-, «perderse, desaparecer».','You found a new root: ñam-, «get lost, vanish».'),
    L('','ñamnge · ñammu · ñammün','¡Piérdete! (a uno) · (a dos) · (a tres o más)','Get lost! (to one) · (to two) · (to three or more)'),
    N('Un wekufü muy herido (con un tercio de su fuerza o menos) que oye esta orden se desvanece para siempre... y hasta los wekufü grandes obedecen.','A badly hurt wekufü (a third of its strength or less) that hears this command fades away for good... and even the big wekufü obey.')])}
  if(what==='rukagift'){S.gold+=30;persist();return say([L('','Küla mari ngülliw!','Un saquito de ngülliw tostados: küla mari (30).','A little bag of toasted pewen nuts: küla mari (30).')])}
  if(what==='kulongift'){S.items.kulon+=2;persist();return say([L('','Epu külon!','Dentro hay dos külon (maqui).','Inside are two külon (maqui berries).')])}
  if(what==='piwke')return gainPiwke([N('Dentro del cofre brilla algo rojo...','Something red glows inside the chest...')]);
  if(what==='rune'){S.runes.push('kil');S.flags.rune_kil=1;persist();sfx('lvl');return say([
    L('','-kil-','Encontraste la runa -kil-: la prohibición. Pone el imperativo en negativo: "¡no...!"','You found the -kil- rune: prohibition. It turns a command negative: "don\'t...!"'),
    L('','küpakilnge · küpakilmu · küpakilmün','¡No vengas! (a uno) · ¡No vengan! (a dos) · ¡No vengan! (a tres o más)',"Don't come! (to one) · (to two) · (to three or more)"),
    N('Cuando un wekufü venga a atacarte, dile que no venga y bloquearás el golpe. Puedes decírselo solo a ese wekufü, o a todos.','When a wekufü comes at you, tell it not to come and you will block the blow. You can say it to just that wekufü, or to all of them.')])}
}
function konew(x,y,K){
  say([K.q],()=>ask());
  function ask(){
    const opts=K.opts.map((o,k)=>({m:o.m,g:G(o),v:k}));
    for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(L('','Chem am ta tatey?','¿Qué será?','What could it be?'),opts,v=>{
      if(v===null)return;
      if(K.opts[v].ok){setTileFlag(x,y);sfx('door');const ls=[praise(),N('La puerta del konew se abre.','The konew door opens.')];
        if(K.reward==='piwke')return gainPiwke(ls);
        persist();say(ls)}
      else{sfx('bad');say([N('La puerta no se mueve. Piensa otra vez.','The door does not move. Think again.')],ask)}
    },true,true);
  }
}

/* ---------- Mapudungun puzzles ---------- */
let PZ={n:0,lit:new Set()};
function pzSolved(){return !!S.flags['pz:'+CUR]}
function wapiReveal(){grid[10][16]='v';S.flags.wapiNpz=1;persist();
  say([N('Las tres piedras del agua cantan juntas: ko... lafken... münche... El lago tiembla frente a la playa del sur y el agua empieza a girar.','The three water stones sing together: ko... lafken... münche... The lake trembles off the southern beach and the water begins to turn.'),
    N('Un remolino hondo se abre entre las olas, cantando bajito. ¡La entrada al Münche lafken, el mundo bajo el lago, apareció!','A deep whirlpool opens among the waves, softly singing. The entrance to Münche lafken, the world beneath the lake, has appeared!'),praise()])}
function pzOpen(){for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(grid[y][x]==='E')grid[y][x]=M.floor}
function pzTouch(tx,ty){
  const k=tx+','+ty,t=M.pz.tiles[k],tot=Object.keys(M.pz.tiles).length;
  if(pzSolved())return say([L('',t.lab,M.pz.kind==='N'?'La piedra brilla en silencio.':'El brasero sigue encendido.',M.pz.kind==='N'?'The stone glows quietly.':'The brazier keeps burning.')]);
  if(PZ.lit.has(k))return;
  if(t.i===PZ.n){PZ.lit.add(k);PZ.n++;sfx('ok');
    if(PZ.n>=tot){S.flags['pz:'+CUR]=1;sfx('lvl');persist();
      if(M.pz.done)return M.pz.done();
      pzOpen();
      return say([L('',t.lab+'!',M.pz.kind==='N'?'La última piedra se enciende. ¡Se oye cómo se corre una roca!':'El último brasero se enciende. ¡La puerta de piedra se abre!',M.pz.kind==='N'?'The last stone lights up. You hear a rock sliding away!':'The last brazier lights up. The stone door opens!'),praise()])}
    return say([L('',t.lab,M.pz.kind==='N'?'La piedra se ilumina.':'El brasero se enciende.',M.pz.kind==='N'?'The stone lights up.':'The brazier lights up.')])}
  PZ.n=0;PZ.lit.clear();sfx('bad');
  if(S.hm){const d=heroHurt();return say([L('',t.lab,M.pz.kind==='N'?'Las piedras se apagan y te devuelven el golpe (−'+d+'). Ya no hay pistas para un weichafe.':'Los braseros se apagan y te queman (−'+d+'). Ya no hay pistas para un weichafe.',M.pz.kind==='N'?'The stones go dark and strike back (−'+d+'). No more hints for a weichafe.':'The braziers go out and burn you (−'+d+'). No more hints for a weichafe.')])}
  say([L('',t.lab,M.pz.kind==='N'?'La luz se apaga en todas las piedras. Ese no era el orden.':'Todos los braseros se apagan. Ese no era el orden.',M.pz.kind==='N'?'The light goes out in every stone. That was not the order.':'All the braziers go out. That was not the order.'),
    M.pz.hint?M.pz.hint:M.pz.kind==='N'?N('Pista: kiñe (1), epu (2), küla (3), meli (4).','Hint: kiñe (1), epu (2), küla (3), meli (4).'):N('Pista: lee la piedra tallada. Kallfü = azul, lig = blanco, kelü = rojo.','Hint: read the carved stone. Kallfü = blue, lig = white, kelü = red.')]);
}
const STONES={
  conj:{intro:[L('Kura','Mari mari! Kura ngen, welu dunguken.','¡Hola! Soy una piedra, pero hablo.','Hello! I am a stone, but I speak.'),N('Responde bien y te dejo pasar. Cambia el final del verbo según quién lo hace.','Answer well and I will let you through. Change the end of the verb depending on who does it.')],
    qs:[{q:L('Kura','Fey ___','Él / ella va. (fey = él, ella)'+rh('amu'),'He / she goes. (fey = he, she)'+rh('amu')),o:['amun','amuymi','amuy'],a:'amuy'},
        {q:L('Kura','Eymi ___','Tú vienes. (eymi = tú)'+rh('küpa'),'You come. (eymi = you)'+rh('küpa')),o:['küpan','küpaymi','küpay'],a:'küpaymi'},
        {q:L('Kura','Iñche ___','Yo sé. (iñche = yo)'+rh('kim'),'I know. (iñche = I)'+rh('kim')),o:['kimün','kimimi','kimi'],a:'kimün'}],hq:{q:L('Kura','Eymün ___','Ustedes (muchos) van.'+rh('amu'),'You (many) go.'+rh('amu')),o:['amuymu','amuymün','amuyngün'],a:'amuymün'}},
  neg:{intro:[L('Kura','Mari mari! Kimimi -la-?','¡Hola! ¿Conoces -la-?','Hello! Do you know -la-?'),N('-la- niega el verbo: amun "voy" → amulan "no voy". Responde bien y la puerta se abrirá.','-la- negates the verb: amun "I go" → amulan "I do not go". Answer well and the door will open.')],
    qs:[{q:N('¿Cómo se dice "no voy"?','How do you say "I do not go"?'),o:['amun','amulan','amulay'],a:'amulan'},
        {q:N('¿Cómo se dice "ella no viene"?','How do you say "she does not come"?'),o:['küpalay','küpay','küpalan'],a:'küpalay'},
        {q:N('¿Cómo se dice "no sé"?','How do you say "I do not know"?'),o:['kimün','kimlay','kimlan'],a:'kimlan'}],hq:{q:N('¿Cómo se dice "no vamos" (nosotros, muchos)?','How do you say "we do not go" (we, many)?'),o:['amuiñ','amulaiñ','amulayngün'],a:'amulaiñ'}},
  poss:{intro:[L('Kura','Mari mari! Kura ngen, welu dunguken.','¡Hola! Soy una piedra, pero hablo.','Hello! I am a stone, but I speak.'),N('¿De quién es? Completa con la palabra correcta y te abro el paso.','Whose is it? Fill in the right word and I will open the way.')],
    qs:[{q:L('Kura','___ ruka','Mi casa.','My house.'),o:['tami','ñi','tañi'],a:'tañi'},
        {q:L('Kura','___ kawellu','Tu caballo.','Your horse.'),o:['tañi','tami','ñi'],a:'tami'},
        {q:L('Kura','___ trewa','Su perro (de él o de ella).','His / her dog.'),o:['ñi','tañi','tami'],a:'ñi'}],hq:{q:L('Kura','___ ruka','Nuestra casa (de muchos).','Our house (of many).'),o:['tañi','tayiñ','tami'],a:'tayiñ'}},
  kin:{intro:[L('Kura','Mari mari! Kimniefimi tami pu che?','¡Hola! ¿Conoces a tu familia?','Hello! Do you know your family?'),N('Di quién es cada uno y te abro el paso.','Say who each one is and I will open the way.')],
    qs:[{q:L('Kura','Tañi chaw ñi ñuke: ___','La mamá de mi papá.','My father\'s mother.'),o:['chuchu','kuku','laku'],a:'kuku'},
        {q:L('Kura','Tañi ñuke ñi ñuke: ___','La mamá de mi mamá.','My mother\'s mother.'),o:['kuku','cheche','chuchu'],a:'chuchu'},
        {q:L('Kura','Tañi chaw ñi chaw: ___','El papá de mi papá.','My father\'s father.'),o:['laku','cheche','kuku'],a:'laku'},
        {q:L('Kura','Tañi ñuke ñi chaw: ___','El papá de mi mamá.','My mother\'s father.'),o:['laku','chuchu','cheche'],a:'cheche'}],hq:{q:L('Kura','Tañi chaw ñi peñi: ___','El hermano de mi papá.','My father\'s brother.'),o:['weku','palu','malle'],a:'malle'}},
  negfut:{intro:[L('Kura','Mari mari! Kimimi -la- ka -a-?','¡Hola! ¿Conoces -la- y -a-?','Hello! Do you know -la- and -a-?'),N('Junta lo que no pasa con lo que todavía no pasa. Responde bien y te abro el paso.','Put together what does not happen with what has not happened yet. Answer well and I will open the way.')],
    qs:[{q:N('¿Cómo se dice "no iré"?','How do you say "I will not go"?'),o:['amulan','amuan','amulayan'],a:'amulayan'},
        {q:N('¿Cómo se dice "ella no vendrá"?','How do you say "she will not come"?'),o:['küpalayay','küpalay','küpayay'],a:'küpalayay'},
        {q:N('¿Cómo se dice "no sabré"?','How do you say "I will not know"?'),o:['kiman','kimlayan','kimlan'],a:'kimlayan'}],hq:{q:N('¿Cómo se dice "no comeremos" (nosotros, muchos)?','How do you say "we will not eat" (we, many)?'),o:['iyalaiñ','iyalayaiñ','iyayaiñ'],a:'iyalayaiñ'}},
  dirmo:{intro:[L('Kura','Mari mari! Kimimi -me- ka -pa-?','¡Hola! ¿Conoces -me- y -pa-?','Hello! Do you know -me- and -pa-?'),
    N('-me- es ir a hacer algo allá (y volver): challwatun "pesqué" → challwatumen "fui a pescar allá". -pa- es hacia acá: küpan "vine" ya lo lleva adentro; umawtupay "vino a dormir acá". Responde bien y te abro el paso.','-me- is going to do something over there (and coming back): challwatun "I fished" → challwatumen "I went fishing there". -pa- is toward here: umawtupay "he came here to sleep". Answer well and I will open the way.')],
    qs:[{q:N('¿Cómo se dice "fui a pescar (allá)"?','How do you say "I went fishing (over there)"?'),o:['challwatun','challwatumen','challwatupan'],a:'challwatumen'},
        {q:N('¿Cómo se dice "vino a dormir (acá)"?','How do you say "he came here to sleep"?'),o:['umawtumey','umawtupay','umawtuy'],a:'umawtupay'},
        {q:N('¿Cómo se dice "iré a buscar (allá)"?','How do you say "I will go and look for it (over there)"?'),o:['kintuan','kintumean','kintupayan'],a:'kintumean'}],hq:{q:N('¿Cómo se dice "vine a comer (acá)"?','How do you say "I came here to eat"?'),o:['iyamen','iyapan','iyan'],a:'iyapan'}},
  rke:{intro:[L('Kura','Mari mari! Kimimi -rke-?','¡Hola! ¿Conoces -rke-?','Hello! Do you know -rke-?'),
    N('-rke- marca lo que uno supo por otros, o lo que lo sorprende: amuy "fue" → amurkey "dicen que fue / ¡resulta que fue!". Responde bien y te abro el paso.','-rke- marks what you learned from others, or what surprises you: amuy "he went" → amurkey "they say he went / it turns out he went!". Answer well and I will open the way.')],
    qs:[{q:N('¿Cómo se dice "dicen que él fue"?','How do you say "they say he went"?'),o:['amuy','amurkey','amuan'],a:'amurkey'},
        {q:N('¿Cómo se dice "dicen que aquí había un walichu"?','How do you say "they say there was a walichu here"?'),o:['müley','mülerkey','mülelay'],a:'mülerkey'},
        {q:N('¿Cómo se dice "¡resulta que tú sabías!"?','How do you say "it turns out you knew!"?'),o:['kimürkeymi','kimimi','kimaymi'],a:'kimürkeymi'}],hq:{q:N('¿Cómo se dice "dicen que ellos (muchos) se fueron"?','How do you say "they say they (many) left"?'),o:['amuyngün','amurkeyngu','amurkeyngün'],a:'amurkeyngün'}},
  quest:{intro:[L('Kura','Mari mari! Kimimi chem, iney, chew?','¡Hola! ¿Conoces chem, iney, chew?','Hello! Do you know chem, iney, chew?'),N('Completa mis preguntas con la palabra que pregunta y te abro el paso.','Complete my questions with the question word and I will open the way.')],
    qs:[{q:L('Kura','___ pingeymi?','¿Cómo te llamas?','What is your name?'),o:['Chew','Iney','Chem'],a:'Iney'},
        {q:L('Kura','___ tuwimi?','¿De dónde eres?','Where are you from?'),o:['Chew','Chumül','Iney'],a:'Chew'},
        {q:L('Kura','___ nieymi?','¿Qué tienes?','What do you have?'),o:['Chumten','Chem','Chew'],a:'Chem'},
        {q:L('Kura','___ ngülliw nieymi?','¿Cuántos piñones tienes?','How many pewen nuts do you have?'),o:['Chumten','Chumül','Iney'],a:'Chumten'}],hq:{q:L('Kura','___ amuaymi?','¿Cuándo te vas a ir?','When will you leave?'),o:['Chew','Chumül','Chem'],a:'Chumül'}},
  du:{intro:[L('Kura','Mari mari! Kimimi iñchiw, eymu, fey engu?','¡Hola! ¿Conoces iñchiw, eymu, fey engu?','Hello! Do you know iñchiw, eymu, fey engu?'),
    N('El mapudungun tiene formas especiales para DOS personas: iñchiw (nosotros dos), eymu (ustedes dos), fey engu (ellos dos). Tu chillka las muestra en «Iñche, eymi, fey...».','Mapudungun has special forms for TWO people: iñchiw (we two), eymu (you two), fey engu (they two). Your chillka shows them under «Iñche, eymi, fey...».')],
    qs:[{q:L('Kura','Iñchiw ___','Nosotros dos vamos.'+rh('amu'),'We two go.'+rh('amu')),o:['amuyu','amuiñ','amuymu'],a:'amuyu'},
        {q:L('Kura','Eymu ___','Ustedes dos vienen.'+rh('küpa'),'You two come.'+rh('küpa')),o:['küpaymün','küpaymu','küpayu'],a:'küpaymu'},
        {q:L('Kura','Fey engu ___','Ellos dos saben.'+rh('kim'),'They two know.'+rh('kim')),o:['kimingün','kimi','kimingu'],a:'kimingu'}],hq:{q:L('Kura','Iñchiw ___','Nosotros dos trabajamos.'+rh('küdaw'),'We two work.'+rh('küdaw')),o:['küdawiñ','küdawiyu','küdawimu'],a:'küdawiyu'}},
  fe:{intro:[L('Kura','Mari mari! Kimimi -fe?','¡Hola! ¿Conoces -fe?','Hello! Do you know -fe?'),
    N('-fe hace nombres de oficio: challwan «pescar» → challwafe «pescador». Responde bien y te abro el paso.','-fe makes names of trades: challwan «to fish» → challwafe «fisher». Answer well and I will open the way.')],
    qs:[{q:L('Kura','Challwa + -fe: ___','La persona que pesca.','The person who fishes.'),o:['challwawe','challwafe','challwan'],a:'challwafe'},
        {q:L('Kura','Ngillaka- («comprar y vender») + -fe: ___','La persona que vende.','The person who sells.'),o:['ngillakafe','ngillakan','ngillakawe'],a:'ngillakafe'},
        {q:L('Kura','Trutruka + -tu- + -fe: ___','La persona que toca la trutruka.','The person who plays the trutruka.'),o:['trutrukawe','trutrukan','trutrukatufe'],a:'trutrukatufe'}],hq:{q:L('Kura','Küdaw + -fe: ___','La persona que trabaja.','The person who works.'),o:['küdawün','küdawfe','küdawwe'],a:'küdawfe'}},
  fu:{intro:[L('Kura','Mari mari! Kimimi -fu-?','¡Hola! ¿Conoces -fu-?','Hello! Do you know -fu-?'),
    N('-fu- habla de lo que era antes y ya no es: kümelen «estoy bien» → kümelefun «estaba bien». Tu chillka lo explica en «Kuyfi · -fu-».','-fu- talks about what used to be: kümelen «I am well» → kümelefun «I was well». Your chillka explains it under «Kuyfi · -fu-».')],
    qs:[{q:L('Kura','Kuyfi iñche pichiche ___','Antes yo era niño.'+rh('nge'),'Long ago I was a child.'+rh('nge')),o:['ngen','ngefun','ngefuy'],a:'ngefun'},
        {q:L('Kura','Fey ___','Ella sabía.'+rh('kim'),'She used to know.'+rh('kim')),o:['kimfuy','kimi','kimfun'],a:'kimfuy'},
        {q:L('Kura','Iñchiñ lof mew ___','Nosotros vivíamos en el lof.'+rh('müle'),'We used to live in the lof.'+rh('müle')),o:['müleiñ','mülefuy','mülefuiñ'],a:'mülefuiñ'}],hq:{q:L('Kura','Eymi ___','Tú sabías.'+rh('kim'),'You used to know.'+rh('kim')),o:['kimfun','kimimi','kimfuymi'],a:'kimfuymi'}},
  kead:{intro:[L('Kura','Mari mari! Epu pichi ruka? Pichike ruka!','¡Hola! ¿Dos casas chicas? ¡Pichike ruka!','Hello! Two little houses? Pichike ruka!'),
    N('Cuando hay varios, el adjetivo lleva -ke: pichi ruka «casa chica» → pichike ruka «casas chicas».','When there are several, the adjective takes -ke: pichi ruka «small house» → pichike ruka «small houses».')],
    qs:[{q:L('Kura','Epu ___ trewa','Dos perros chicos.','Two small dogs.'),o:['pichike','pichi','pichiñma'],a:'pichike'},
        {q:L('Kura','Pu ___ pewen','Los pewenes grandes.','The big pewen trees.'),o:['fütra','fütrake','fütralen'],a:'fütrake'},
        {q:L('Kura','Küla ___ che','Tres buenas personas.','Three good people.'),o:['kümeke','küme','kümen'],a:'kümeke'}],hq:{q:L('Kura','Fentren ___ kawellu','Muchos caballos grandes.','Many big horses.'),o:['fütra','fütrake','fütralu'],a:'fütrake'}},
  num2:{intro:[L('Kura','Mari mari! Fütake rakin kimimi?','¡Hola! ¿Conoces los números grandes?','Hello! Do you know the big numbers?'),
    N('pataka = cien; warangka = mil. Se combinan igual que los chicos: epu pataka = 200.','pataka = one hundred; warangka = one thousand. They combine like the small ones: epu pataka = 200.')],
    qs:[{q:N('¿Cómo se dice «cien»?','How do you say «one hundred»?'),o:['pataka','warangka','mari mari'],a:'pataka'},
        {q:N('¿Cómo se dice «mil»?','How do you say «one thousand»?'),o:['pataka mari','warangka','mari pataka'],a:'warangka'},
        {q:L('Kura','Epu pataka kechu mari = ?','¿Qué número es?','Which number is it?'),o:['250','205','2050'],a:'250'}],hq:{q:L('Kura','Küla warangka epu pataka = ?','¿Qué número es?','Which number is it?'),o:['2300','3020','3200'],a:'3200'}},
  plur:{intro:[L('Kura','Mari mari! Kimimi pu?','¡Hola! ¿Conoces pu?','Hello! Do you know pu?'),N('Cuando son dos o muchos, el verbo también cambia. Completa los verbos.','When there are two or many, the verb changes too. Complete the verbs.')],
    qs:[{q:L('Kura','Pu wentru ___','Los hombres van.'+rh('amu'),'The men go.'+rh('amu')),o:['amuy','amuyngu','amuyngün'],a:'amuyngün'},
        {q:L('Kura','Epu domo ___','Dos mujeres vienen.'+rh('küpa'),'Two women come.'+rh('küpa')),o:['küpayngu','küpay','küpayngün'],a:'küpayngu'},
        {q:L('Kura','Pu pichikeche ___','Los niños saben.'+rh('kim'),'The children know.'+rh('kim')),o:['kimi','kimingün','kimingu'],a:'kimingün'}],hq:{q:L('Kura','Pu domo ___','Las mujeres trabajan.'+rh('küdaw'),'The women work.'+rh('küdaw')),o:['küdawi','küdawingu','küdawingün'],a:'küdawingün'}}};
function stoneTalk(id){
  const st=STONES[id],sf=M.pz?'pz:'+CUR+':st':'pz:'+CUR;
  if(S.flags[sf])return say([L('Kura','Kümey! Amunge.','¡Bien! Pasa.','Good! Go on through.')]);
  const qs=S.hm&&st.hq?st.qs.concat([st.hq]):st.qs;
  say(st.intro,()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags[sf]=1;pzOpen();sfx('lvl');S.xp+=4;persist();return say([praise(),L('Kura','Tuteley! Amunge.','¡Muy bien! Pasa.','Well done! Go on through.'),N('La puerta de piedra se abre. +4 kimün.','The stone door opens. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];choose(q.q,q.o.map(o=>({m:o,v:o})).concat(S.hm?[]:[{m:'Chillka',g:S.gloss==='en'?'Check the book':'Consultar el libro',v:'_book'}]),v=>{
      if(v==='_book')return openBook(()=>ask(i));
      if(trk('kura (piedras)',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');const hd=S.hm?heroHurt():0;say([L('Kura','Fey no...','Eso no...','Not that...'),N((hd?'La piedra te golpea (−'+hd+'). ':'')+'Vuelve a intentarlo desde el principio.',(hd?'The stone strikes you (−'+hd+'). ':'')+'Try again from the beginning.')],()=>ask(0))}},false,false)}
}
const WARPS={lafkenche:[{m:'Lafken inaltu',es:'Entrada de la cueva (orilla)',en:'Cave entrance (lagoon shore)',to:['inaltu',21,5]},{m:'Lafkenche lof',es:'El lof de la costa',en:'The coast lof',to:['lof',17,9]}],
  nagche:[{m:'Fütra mawida',es:'Entrada de la guarida (monte)',en:'Lair entrance (forest)',to:['n_mawida',28,4]},{m:'Nagche lof',es:'El lof de los llanos',en:'The lowland lof',to:['n_lof',17,9]}],
  pewenche:[{m:'Pillañ inaltu',es:'Entrada de la morada (volcán)',en:'Lair entrance (volcano)',to:['p_pillan',28,4]},{m:'Pewenche lof',es:'El lof de los pewenes',en:'The pewen lof',to:['p_lof',17,9]}],
  williche:[{m:'Willi lafken inaltu',es:'Entrada de la cueva (acantilados)',en:'Cave entrance (cliffs)',to:['w_inaltu',24,6]},{m:'Williche lof',es:'El lof del lago',en:'The lake lof',to:['w_lof',17,9]}],
  puelmapu:[{m:'Wingkul lelfün',es:'Entrada del chenque (meseta)',en:'Chenque entrance (meseta)',to:['e_meseta',24,6]},{m:'Puelche lof',es:'El lof del este',en:'The eastern lof',to:['e_lof',17,9]}]};
function warpMenu(){
  const opts=[];for(const r in WARPS)if(awake(r))for(const w of WARPS[r])opts.push({m:w.m,g:G(w),v:w.to});
  opts.push({m:'Mülekayan faw',g:S.gloss==='en'?'Stay here':'Quedarme aquí',v:'x'});
  choose(L('','Chew amuaymi?','¿A dónde vas?','Where will you go?'),opts,v=>{if(!v||v==='x')return;sfx('cast');loadMap(v[0],v[1],v[2])},true,true);
}

/* lof-to-lof fast travel: a ngen ring by the road in every awakened lof, once two ngen are awake */
function lofWarpMenu(){
  const en=S.gloss==='en',opts=[];
  for(const r of lofsOpen()){if(LOFS[r]===CUR)continue;const w=WARPS[r].find(x=>x.to[0]===LOFS[r])||WARPS[r][1];opts.push({m:w.m,g:G(w),v:[LOFS[r],20,9]})}
  opts.push({m:'Mülekayan faw',g:en?'Stay here':'Quedarme aquí',v:'x'});
  choose(L('','Chew lof mew amuaymi?','¿A qué lof vas? El anillo de los ngen une los lof que ya despertaste.','Which lof will you go to? The ngen ring links the lofs you have already awakened.'),opts,v=>{if(!v||v==='x')return;sfx('cast');loadMap(v[0],v[1],v[2])},true,true);
}
function lofWarpIntro(){if(S.flags.lofwarp_seen||!LOFIDS.includes(CUR)||lofsOpen().length<2||!awake(M.region))return;S.flags.lofwarp_seen=1;persist();
  say([N('Junto al camino del lof brilla un anillo nuevo. Los ngen que despertaste unieron sus tierras: desde aquí puedes ir a cualquier lof que ya haya despertado, y volver.','By the lof road a new ring glows. The ngen you awakened have joined their lands: from here you can travel to any lof that has already awakened, and back.')])}
function kukuLof(){
  if(!S.flags.pentukun){
    if(S.flags.pentu_prac)return say([L('Kuku','Lonko mew amunge. Kütral mew inaltuley.','Ve donde el lonko. Está junto al kütral.','Go to the lonko. He is by the fire.'),
      N('Si quieres, puedo ensayar contigo otra vez.','If you like, we can practice again.')],()=>choose({es:'¿Ensayamos otra vez?',en:'Practice again?'},[{m:'May',g:S.gloss==='en'?'Yes':'Sí',v:1},{m:'Dew kimfiñ',g:S.gloss==='en'?'I already know it (no, thanks)':'Ya lo sé (no, gracias)',v:0}],v=>{if(v)runPentukun(true)},true,true));
    return say([L('Kuku','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!'),
      N('Antes de hablar con el lonko, tienes que saber hacer el pentukuwün: el saludo formal mapuche. No es solo decir "hola": se saluda, se pregunta cómo está la persona, quién es, de dónde viene y cómo está su familia.','Before speaking with the lonko, you need to know how to do the pentukuwün: the formal Mapuche greeting. It is not just saying "hello": you greet, ask how the person is, who they are, where they come from, and how their family is.'),
      N('Ensayemos juntos. Yo hago de lonko; tú contestas.','Let us practice together. I will play the lonko; you answer.')],()=>runPentukun(true));
  }
  say([L('Kuku','Kümey, '+nm()+'!','¡Bien, '+nm()+'!','Good, '+nm()+'!'),L('Kuku','Inaltu kütral mew ürkütunge.','Descansa junto al kütral.','Rest by the fire.'),
    N('Mira el lof: aquí se teje, se cocina, se juega palin y los niños aprenden mapudungun. Habla con todos.','Look around the lof: people weave, cook, play palin, and the children learn Mapudungun here. Talk to everyone.')]);
}
function lonkoTalk(){
  if(S.flags.mql_laf&&!S.flags.mqd_laf)return say([L('Lonko','Machi ñi dungu.','Lo de la machi.','The machi\'s errand.'),N('«¿Las hojas? El foye viejo, en Fotra mapu: el árbol solo entre los dos brazos de agua, florecido. Párate a su pie por el norte y pídele permiso.»','"The leaves? The old foye, in Fotra mapu: the lone tree between the two arms of water, in bloom. Stand at its north foot and ask its leave."')]);
  if(S.flags.mq_laf&&!S.flags.mql_laf){S.flags.mql_laf=1;persist();sfx('lvl');
    return say([L('Lonko','Machi ñi dungu? Kümey.','¿Un encargo de la machi? Bien.','An errand from the machi? Good.'),
      N('«El foye viejo crece en Fotra mapu, los pantanos: un árbol solo, entre dos brazos de agua. Párate a su pie, por el lado norte, y pídele permiso antes de sacar una sola hoja. Llevas mi palabra.» La machi y el lonko cuidan juntos el lof: ella con el lawen, él con la palabra.','"The old foye grows in Fotra mapu, the marshes: a lone tree between two arms of water. Stand at its foot, on the north side, and ask its leave before taking a single leaf. You carry my word." The machi and the lonko look after the lof together: she with the remedies, he with the word.'),
      L('Lonko','Amupunge, '+nm()+'.','Ve, '+nm()+'.','Go, '+nm()+'.')]);}
  if(S.flags.pentukun){
    const ls=[L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.')];
    if(S.flags.ngen)ls.push(L('Lonko','Ngen-lafken nepey. Chaltu may!','Ngen-lafken despertó. ¡Gracias!','Ngen-lafken has woken up. Thank you!'),
      N('La niebla se levantó del camino que sale al este de la laguna: lleva a las tierras nagche, los llanos. Allá vive tu chuchu.','The fog has lifted from the road leading east from the lagoon: it goes to the Nagche lands, the lowlands. Your chuchu lives there.'),
      N('El camino: sal del lof hacia el este, cruza las dunas de Kuyüm y el camino del monte, bordea la laguna por Lafken inaltu y sigue al este por el Nagche rüpü hasta el lof nagche.','The way: leave the lof eastward, cross the Kuyüm dunes and the forest road, skirt the lagoon along Lafken inaltu and keep east along the Nagche rüpü to the Nagche lof.'),
      N('Ese trokiñ de trariwe que traes es muy antiguo. Dicen que el trariwe completo, con un trokiñ de cada tierra, es lo único que puede atravesar la niebla de Ti Fütra Ngoymatulfe, el gran olvido.','That trokiñ of trariwe you carry is very old. They say the complete trariwe, with one trokiñ from each land, is the only thing that can pass through the fog of Ti Fütra Ngoymatulfe, the great forgetting.'));
    else ls.push(L('Lonko','Ngen-lafken umawtuley. Trelke-wekufü müley lafken mew.','Ngen-lafken está dormido. Trelke-wekufü está en la laguna.','Ngen-lafken is asleep. Trelke-wekufü is in the lagoon.'),
      N('Sigue la costa hacia el este: las dunas, el monte y la orilla de la laguna.','Follow the coast east: the dunes, the forest, and the shore of the lagoon.'));
    return say(ls);
  }
  if(!S.flags.pentu_prac)return say([L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.'),L('Lonko','Tami kuku mew dungunge.','Habla con tu kuku.','Talk to your kuku.'),
    N('El lonko espera un pentukuwün como corresponde. Tu kuku está cerca de su ruka, al oeste del kütral: ella te ayudará a prepararte.','The lonko expects a proper pentukuwün. Your kuku is near her ruka, west of the fire: she will help you prepare.')]);
  runPentukun(false);
}
function runPentukun(practice){
  const en=S.gloss==='en',sp=practice?'Kuku':'Lonko';
  const steps=[
    {q:L(sp,'Mari mari!','¡Hola! (Contesta el saludo.)','Hello! (Answer the greeting.)'),
     ex:N('Primero, el saludo. Se contesta con el mismo saludo y el nombre o el título de la persona: "Mari mari, lonko!"','First, the greeting. You answer with the same greeting and the person\'s name or title: "Mari mari, lonko!"'),
     o:[{m:'Mari mari, lonko!',es:'¡Hola, lonko!',en:'Hello, lonko!',ok:1},{m:'Pewkayal!',es:'¡Hasta luego!',en:'See you later!'},{m:'Chaltu may!',es:'¡Gracias!',en:'Thank you!'}]},
    {q:L(sp,'Chumleymi?','¿Cómo estás?','How are you?'),
     ex:N('Luego te pregunta cómo estás. "Kümelen" es "estoy bien", y "Eymi kay?" devuelve la pregunta: "¿y tú?".','Then you are asked how you are. "Kümelen" means "I am well", and "Eymi kay?" returns the question: "and you?".'),
     o:[{m:'Kümelen. Eymi kay?',es:'Estoy bien. ¿Y tú?',en:'I am well. And you?',ok:1},{m:'Iñche pingen.',es:'Yo me llamo... (incompleto)',en:'My name is... (incomplete)'},{m:'Amunge!',es:'¡Vete!',en:'Go away!'}]},
    {q:L(sp,'Iñche ka kümelen. Iney pingeymi am?','Yo también estoy bien. ¿Cómo te llamas?','I am well too. What is your name?'),
     ex:N('Después, tu nombre. Se dice "Iñche ___ pingen": "yo me llamo ___".','Next, your name. You say "Iñche ___ pingen": "my name is ___".'),
     o:[{m:'Iñche '+nm()+' pingen.',es:'Me llamo '+nm()+'.',en:'My name is '+nm()+'.',ok:1},{m:nm()+' pingeymi.',es:'Tú te llamas '+nm()+'.',en:'Your name is '+nm()+'.'},{m:'Kümelen.',es:'Estoy bien.',en:'I am well.'}]},
    {q:L(sp,'Chew tuwimi?','¿De dónde eres?','Where are you from?'),
     ex:N('Te preguntará de dónde vienes. Se contesta con el lugar, "mew" y "tuwün": "Santiago waria mew tuwün", "vengo de la ciudad de Santiago". Ustedes son wariache, gente de la ciudad.','You will be asked where you come from. You answer with the place, "mew" and "tuwün": "Santiago waria mew tuwün", "I come from the city of Santiago". You are wariache, city people.'),
     o:[{m:'Santiago waria mew tuwün.',es:'Vengo de la ciudad de Santiago.',en:'I come from the city of Santiago.',ok:1},{m:'Chew tuwün?',es:'¿De dónde vengo?',en:'Where do I come from?'},{m:'Lafken mew amuan.',es:'Iré al mar.',en:'I will go to the sea.'}]},
    {q:L(sp,'Chumleyngün tami pu che?','¿Cómo está tu gente (tu familia)?','How are your people (your family)?'),
     ex:N('Al final pregunta por tu familia: son ellos, varias personas, así que se contesta "Kümeleyngün", "ellos están bien".','Finally you are asked about your family: they are several people, so you answer "Kümeleyngün", "they are well".'),
     o:[{m:'Kümeleyngün.',es:'Ellos están bien.',en:'They are well.',ok:1},{m:'Kümelen.',es:'Yo estoy bien.',en:'I am well.'},{m:'Kümeleymi.',es:'Tú estás bien.',en:'You are well.'}]}];
  say([practice?N('Ensayo de pentukuwün con tu kuku. Las respuestas muestran su traducción.','Pentukuwün practice with your kuku. The answers show their translation.'):N('El lonko se pone de pie. Es el momento del pentukuwün, el saludo formal.','The lonko stands up. It is time for the pentukuwün, the formal greeting.')],()=>step(0));
  function step(i){
    if(i>=steps.length)return practice?donePractice():done();
    const s=steps[i];const show=practice||S.hints;
    const go=()=>{const opts=s.o.map((o,k)=>({m:o.m,g:show?(en?o.en:o.es):'',v:k}));
      for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
      choose(s.q,opts,v=>{
        if(s.o[v].ok)say([praise()],()=>step(i+1));
        else{sfx('bad');say([L('Kuku','(…)',(practice?'':'Tu kuku te susurra: ')+s.ex.es,(practice?'':'Your kuku whispers: ')+s.ex.en)],()=>step(i))}
      },false,true)};
    if(practice)say([s.ex],go);else go();
  }
  function donePractice(){S.flags.pentu_prac=1;persist();sfx('lvl');
    say([L('Kuku','Kümey! Tuteley!','¡Bien! ¡Muy bien hecho!','Good! Well done!'),
      N('Ya sabes el pentukuwün. Recuerda el orden: saludo, cómo estás, tu nombre, de dónde vienes, tu familia.','Now you know the pentukuwün. Remember the order: greeting, how are you, your name, where you come from, your family.'),
      L('Kuku','Lonko mew amunge. Kütral mew inaltuley.','Ve donde el lonko. Está junto al kütral.','Go to the lonko. He is by the fire.')])}
  function done(){
    S.flags.pentukun=1;learnRoot('umawtu');S.items.kulon+=2;persist();sfx('lvl');
    say([L('Lonko','Kümey, '+nm()+'! Mapudungun mew dungukeymi.','¡Bien, '+nm()+'! Hablas en mapudungun.','Good, '+nm()+'! You speak in Mapudungun.'),
      L('Lonko','Ngen-lafken umawtuley. Trelke-wekufü müley lafken mew.','Ngen-lafken está dormido. Trelke-wekufü está en la laguna.','Ngen-lafken is asleep. Trelke-wekufü is in the lagoon.'),
      N('El trelke-wekufü lo tiene envuelto en el fondo de la laguna, más allá de las dunas y del monte. Por eso el mar está callado.','The trelke-wekufü has it wrapped up at the bottom of the lagoon, beyond the dunes and the forest. That is why the sea is silent.'),
      L('Lonko','Umawtu- kimeltueyu.','Te enseño umawtu- ("dormir").','I teach you umawtu- ("sleep").'),
      N('Con umawtunge, umawtumu o umawtumün haces dormir a los wekufü. Recibiste umawtu- y dos külon.','With umawtunge, umawtumu or umawtumün you put the wekufü to sleep. You received umawtu- and two külon.'),
      L('Lonko','Amupunge, '+nm()+'. Pewkayal!','Ve, '+nm()+'. ¡Hasta luego!','Go, '+nm()+'. See you later!')]);
  }
}

/* ================= NAGCHE ================= */
function chuchuTalk(){
  if(!S.flags.chuchu){S.flags.chuchu=1;S.items.kofke++;persist();sfx('pick');
    return say([L('Chuchu','Mari mari, '+nm()+'! Iñche tami chuchu.','¡Hola, '+nm()+'! Soy tu chuchu.','Hello, '+nm()+'! I am your chuchu.'),
      N('Tu chuchu es la mamá de tu mamá. La kuku, la mamá de tu papá, vive en el lof lafkenche.','Your chuchu is your mother\'s mother. Your kuku, your father\'s mother, lives in the Lafkenche lof.'),
      L('Chuchu','Na küme mi küpan!','¡Qué bien que viniste!','How good that you came!'),
      L('Chuchu','Tüfa tañi ruka.','Esta es mi casa.','This is my house.'),
      L('Chuchu','Tüfa tami kofke.','Este es tu pan.','This is your bread.'),
      N('Tu chuchu te da un kofke. Fíjate: tañi = mi, tami = tu. Y ñi = su (de él o de ella). Tu chillka lo explica en «Tañi, tami, ñi».','Your chuchu gives you a kofke. Notice: tañi = my, tami = your. And ñi = his / her. Your chillka explains it under «Tañi, tami, ñi».'),
      L('Chuchu','Lonko mew amunge. Kütral mew inaltuley.','Ve donde el lonko. Está junto al kütral.','Go to the lonko. He is by the fire.')]);}
  const ls=[L('Chuchu','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!')];
  if(S.flags.ngen2)ls.push(L('Chuchu','Ngen-mawida nepey! Ayüwün.','¡Ngen-mawida despertó! Estoy feliz.','Ngen-mawida has woken up! I am happy.'));
  else if(S.flags.nag_lonko)ls.push(N('El monte grande queda al este, pasando los campos de los animales y el río. Cuídate del Witranalwe.','The great forest lies to the east, past the animal fields and the river. Beware of the Witranalwe.'));
  else ls.push(L('Chuchu','Lonko mew amunge.','Ve donde el lonko.','Go to the lonko.'));
  say(ls);
}
function nLonkoTalk(){
  if(S.flags.mql_nag&&!S.flags.mqd_nag)return say([L('Lonko','Machi ñi dungu.','Lo de la machi.','The machi\'s errand.'),N('«¿El agua? Con el metawe, en el ojo de agua del rincón del amanecer, el del nororiente del menoko: verás la luz quieta sobre él.»','"The water? With the metawe, at the pool in the sunrise corner, the north-east of the menoko: you will see the still light upon it."')]);
  if(S.flags.mq_nag&&!S.flags.mql_nag){S.flags.mql_nag=1;persist();sfx('lvl');
    return say([L('Lonko','Machi ñi dungu? Kümey.','¿Un encargo de la machi? Bien.','An errand from the machi? Good.'),
      N('El lonko entra a su ruka y vuelve con un cántaro de greda oscura, brillante de viejo. «El metawe del lof. Con él se saca el agua del menoko: del ojo de agua del rincón del amanecer, el del nororiente, el más quieto. La machi sana y yo pongo lo que haga falta: así ha sido siempre.»','The lonko goes into his ruka and returns with a jug of dark clay, shiny with age. "The metawe of the lof. With it one draws water from the menoko: from the pool in the sunrise corner, the north-east one, the stillest. The machi heals and I provide what is needed: so it has always been."'),
      L('Lonko','Amupunge, '+nm()+'.','Ve, '+nm()+'.','Go, '+nm()+'.')]);}
  if(S.flags.nag_lonko){
    const ls=[L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.')];
    if(S.flags.ngen2)ls.push(L('Lonko','Ngen-mawida nepey. Chaltu may!','Ngen-mawida despertó. ¡Gracias!','Ngen-mawida has woken up. Thank you!'),
      N('Ya llevas dos trokiñ del trariwe. Dicen que más allá de las montañas, en tierras pewenche, hay otro ngen dormido.','You now carry two trokiñ of the trariwe. They say that beyond the mountains, in Pewenche lands, another ngen is asleep.'),
      N('El camino: desde este lof ve al este por Kulliñ mapu, cruza el Lewfü y el Fütra mawida, y sube por el Pewenche rüpü hasta el lof pewenche.','The way: from this lof go east through Kulliñ mapu, cross the Lewfü and the Fütra mawida, and climb the Pewenche rüpü to the Pewenche lof.'));
    else ls.push(L('Lonko','Fütra mawida mew amumenge.','Ve al monte grande.','Go to the great forest.'),N('Pasando los campos de los animales y el río está el monte. La guarida del Witranalwe está bajando por una escalera de piedra.','Past the animal fields and the river is the forest. The Witranalwe\'s lair is down a stone stairway.'));
    return say(ls);
  }
  const steps=[
    {q:L('Lonko','Mari mari, '+nm()+'. Chumleymi?','Hola, '+nm()+'. ¿Cómo estás?','Hello, '+nm()+'. How are you?'),
     o:[{m:'Kümelen. Eymi kay?',es:'Estoy bien. ¿Y tú?',en:'I am well. And you?',ok:1},{m:'Kümeleyngün.',es:'Ellos están bien.',en:'They are well.'},{m:'Amunge!',es:'¡Vete!',en:'Go away!'}]},
    {q:L('Lonko','Iñche ka kümelen. Chew tuwimi?','Yo también estoy bien. ¿De dónde eres?','I am well too. Where are you from?'),
     o:[{m:'Santiago waria mew tuwün.',es:'Vengo de la ciudad de Santiago.',en:'I come from the city of Santiago.',ok:1},{m:'Chew tuwimi?',es:'¿De dónde eres tú?',en:'Where are you from?'},{m:'Santiago waria mew tuwimi.',es:'Tú vienes de la ciudad de Santiago.',en:'You come from the city of Santiago.'}]}];
  say([N('El lonko nagche se levanta para saludarte. Recuerda el pentukuwün que ensayaste con tu kuku.','The Nagche lonko stands up to greet you. Remember the pentukuwün you practiced with your kuku.')],()=>step(0));
  function step(i){
    if(i>=steps.length)return done();
    const s=steps[i],en=S.gloss==='en';
    const opts=s.o.map((o,k)=>({m:o.m,g:S.hints?(en?o.en:o.es):'',v:k}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(s.q,opts,v=>{if(s.o[v].ok)say([praise()],()=>step(i+1));else{sfx('bad');say([N('El lonko espera, en silencio. Piensa en lo que te preguntó.','The lonko waits in silence. Think about what he asked you.')],()=>step(i))}},false,true);
  }
  function done(){
    S.flags.nag_lonko=1;learnRoot('llüka');S.items.kulon++;persist();sfx('lvl');
    say([L('Lonko','Kümey! Ngen-lafken nepey, pikeyngün.','¡Bien! Dicen que Ngen-lafken despertó.','Good! They say Ngen-lafken has woken up.'),
      L('Lonko','Welu Ngen-mawida umawtuley.','Pero Ngen-mawida está dormido.','But Ngen-mawida is asleep.'),
      N('Un Witranalwe, una figura altísima de luz fría que cuida los animales de un kalku, se adueñó del monte grande. Desde entonces los animales se pierden y los niños olvidan palabras.','A Witranalwe, a towering figure of cold light that guards a kalku\'s animals, has taken over the great forest. Since then the animals get lost and the children forget words.'),
      L('Lonko','Llüka- kimeltueyu.','Te enseño llüka- ("tener miedo").','I teach you llüka- ("be afraid").'),
      N('Con llükange, llükamu o llükamün asustas a los wekufü: por un rato golpean más débil. Recibiste llüka- y un külon.','With llükange, llükamu or llükamün you frighten the wekufü: for a while they hit weaker. You received llüka- and a külon.'),
      L('Lonko','Fütra mawida mew amumenge, '+nm()+'.','Ve al monte grande, '+nm()+'.','Go to the great forest, '+nm()+'.'),
      N('El camino sigue al este: los campos de los animales, el río y el monte.','The road goes on to the east: the animal fields, the river and the forest.')]);
  }
}
function nutramTalk(){
  const nv=rot('nutram',3);
  if(nv===1)return say([L('Nütramkafe','Ka kiñe nütram nien.','Tengo otro relato.','I have another tale.'),
    L('Nütramkafe','Pun mew mülefuy kiñe pichi kütral.','De noche había un fueguito.','At night there was a little fire.'),
    L('Nütramkafe','Anchimalleñ pingey.','Se llama anchimalleñ.','It is called an anchimalleñ.'),
    N('Una lucecita que salta por los campos de noche. Unos dicen que acompaña; otros, que extravía. Si la sigues, cuenta tus pasos para poder volver.','A little light that skips across the fields at night. Some say it keeps you company; others, that it leads you astray. If you follow it, count your steps so you can return.'),
    N('Otra vez -fu-: mülefuy, «había». Así se cuenta lo de antes.','Again -fu-: mülefuy, «there was». That is how the past is told.')]);
  if(nv===2)return say([L('Nütramkafe','Kuyfi, lafken mew mülefuy Millalobo.','Hace mucho tiempo, en el mar vivía el Millalobo.','Long ago, the Millalobo lived in the sea.'),
    L('Nütramkafe','Lafken ñi lonko ngefuy.','Era el lonko del mar.','He was the lonko of the sea.'),
    N('Mitad hombre, mitad lobo marino, con oro en el pelo y en la corona. Los williche de Chiloé cuentan que manda sobre los peces y las olas, y que se enoja con quien no respeta el mar.','Half man, half sea lion, with gold in his hair and his crown. The Williche of Chiloé tell that he rules the fish and the waves, and that he grows angry with anyone who does not respect the sea.'),
    N('Otra vez -fu-: mülefuy «vivía», ngefuy «era». Así se cuenta lo de antes.','Again -fu-: mülefuy «he lived», ngefuy «he was». That is how the past is told.')]);
  say([L('Nütramkafe','Mari mari, '+addr(false)+'. Nütramkayaiñ?','Hola. ¿Conversamos?','Hello. Shall we talk?'),
    N('Nütramkan es conversar y contar lo que pasó. El nütramkafe es quien cuenta.','Nütramkan means to converse and tell what happened. The nütramkafe is the one who tells.'),
    L('Nütramkafe','Kuyfi, mawida mew mülefuy kiñe Witranalwe.','Hace mucho tiempo, en el monte había un Witranalwe.','Long ago, in the forest, there was a Witranalwe.'),
    L('Nütramkafe','Pun mew kintukefuy kulliñ.','De noche andaba buscando animales.','At night it went around looking for animals.'),
    N('Dicen que es alto y delgado, que brilla como la luna, y que quien lo ve se queda tieso de miedo.','They say it is tall and thin, it glows like the moon, and whoever sees it freezes with fear.'),
    N('Pero los antiguos decían: cuando se alza muy alto, nada lo alcanza. Hay que decirle que vuelva atrás.','But the old ones said: when it rises up very tall, nothing reaches it. You have to tell it to go back.'),
    N('Fíjate en mülefuy y kintukefuy: ese -fu- aparece mucho al contar lo que pasaba antes. Tu chillka lo tiene en «Kuyfi».','Notice mülefuy and kintukefuy: that -fu- shows up a lot when telling what used to happen. Your chillka has it under «Kuyfi».')]);
}
function smithTalk(){
  say([L('Rütrafe','Mari mari, '+addr(false)+'. Rütrafe ngen.','Hola. Soy platero.','Hello. I am a silversmith.'),
    L('Rütrafe','Tüfa ta trapelakucha.','Esta es una trapelakucha.','This is a trapelakucha.'),
    N('Te muestra un adorno de plata para el pecho, con cadenas y figuras. El metal suena como lluvia fina.','He shows you a silver chest ornament with chains and figures. The metal rings like fine rain.'),
    N('Dicen que en el río hay una piedra que habla y pregunta por tañi, tami y ñi. Si no te acuerdas, mira tu chillka.','They say there is a talking stone by the river that asks about tañi, tami and ñi. If you do not remember, check your chillka.')]);
}
const AWN=['kiñe','epu','küla','meli','kechu','kayu'];
function awarTalk(){
  const en=S.gloss==='en';
  const bean=k=>'<span style="display:inline-block;width:.9em;height:.9em;border-radius:50%;margin:0 .12em;vertical-align:-.1em;'+(k?'background:#241a10;border:2px solid #e8d8b8':'background:#f4ecd8;border:2px solid #241a10')+'"></span>';
  say([L('Pichiche','Awarkuden! Awarkudeaiñ?','¡Awarkuden! ¿Jugamos?','Awarkuden! Shall we play?'),
    N('El awarkuden se juega con seis habas pintadas de negro por un lado. Se lanzan y se cuentan las que caen negras (kurü) y las blancas (lüq). Si todas caen iguales, ¡es Paro!','Awarkuden is played with six beans painted black on one side. You throw them and count how many land black (kurü) and how many white (lüq). If they all land the same, it is Paro!'),
    N('Jugaremos meli (4) lanzadas. Cada respuesta buena vale un punto; un Paro vale dos.','We will play meli (4) throws. Each right answer is worth a point; a Paro is worth two.')],()=>
    choose({es:'¿Juegas?',en:'Play?'},[{m:'May',g:en?'Yes':'Sí',v:1},{m:'Mülekayan faw',g:en?'Not now (stay here)':'Ahora no',v:0}],v=>{if(v)game()},true,true));
  function game(){let pts=0,t=0;toss();
    function toss(){
      if(t>=4)return fin();
      t++;
      const n=rnd(7),beans=[];for(let i=0;i<6;i++)beans.push(i<n?1:0);for(let a=5;a>0;a--){const b=rnd(a+1);[beans[a],beans[b]]=[beans[b],beans[a]]}
      const mh=beans.map(bean).join('');
      if(n===0||n===6){pts+=2;sfx('lvl');
        return say([L('Pichiche','Paro! Kom '+(n?'kurü':'lüq')+'!','¡Paro! Cayeron todas '+(n?'negras (kom kurü)':'blancas (kom lüq)')+': ¡dos puntos!','Paro! They all landed '+(n?'black (kom kurü)':'white (kom lüq)')+': two points!',)],toss);}
      const askK=rnd(2)===0,c=askK?n:6-n;
      const pool=[c];while(pool.length<4){const k=1+rnd(6);if(!pool.includes(k))pool.push(k)}
      const opts=pool.map(k=>({m:AWN[k-1],v:k}));for(let a=3;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
      sfx('ok');
      const pr={mh:mh,m:'Chumten '+(askK?'kurü':'lüq')+'?',es:'Lanzada '+t+' de 4. ¿Cuántas cayeron '+(askK?'negras (kurü)':'blancas (lüq)')+'?',en:'Throw '+t+' of 4. How many landed '+(askK?'black (kurü)':'white (lüq)')+'?'};
      choose(pr,opts,v=>{
        if(v===c){pts++;say([praise(),L('Pichiche',AWN[c-1]+'! Feley!','¡'+AWN[c-1]+'! ¡Así es!','¡'+AWN[c-1]+'! That is right!')],toss)}
        else{sfx('bad');say([L('Pichiche','Fey no! '+AWN[c-1]+' '+(askK?'kurü':'lüq')+'.','¡Eso no! Eran '+AWN[c-1]+' ('+c+') '+(askK?'negras':'blancas')+'.','Not that! There were '+AWN[c-1]+' ('+c+') '+(askK?'black':'white')+'.')],toss)}
      },false,true);
    }
    function fin(){
      const ls=[L('Pichiche',numW(Math.max(1,pts))+'!','Terminamos: hiciste '+pts+' punto'+(pts===1?'':'s')+'.','Done: you scored '+pts+' point'+(pts===1?'':'s')+'.')];
      if(!S.flags.awar){S.flags.awar=1;S.gold+=10;sfx('pick');ls.push(L('','Mari ngülliw!','Los niños te regalan mari (10) ngülliw por jugar.','The children give you mari (10) ngülliw for playing.'))}
      if(pts>=5&&!S.flags.awar2){S.flags.awar2=1;S.gold+=30;sfx('lvl');ls.push(L('Pichiche','Awarkudefe ngeymi!','¡Eres awarkudefe, campeón del awarkuden! Küla mari (30) ngülliw de premio.','You are an awarkudefe, an awarkuden champion! Küla mari (30) ngülliw as a prize.'))}
      persist();
      say(ls,()=>choose({es:'¿Otra vez?',en:'Again?'},[{m:'Ka kiñe rupa',g:en?'Once more':'Otra vez',v:1},{m:'Pewkayal',g:en?'See you later':'Hasta luego',v:0}],v=>{if(v)game()},true,true));
    }
  }
}
const herdN=t=>Object.keys(S.flags).filter(k=>k.startsWith('hd_')&&(MAPS.n_kullin.ents.find(e=>e.flag===k)||{}).look===t).length;
function farmerTalk(){
  const k=herdN('kawellu'),w=herdN('waka');
  if(S.flags.herd)return say([L('Wentru','Kom tañi kulliñ wiñoturkey. Chaltu may!','¡Volvieron todos mis animales! ¡Gracias!','All my animals came back! Thank you!')]);
  if(!S.flags.herd_task){S.flags.herd_task=1;persist();
    return say([L('Wentru','Mari mari, '+addr(false)+'. Ñamkiawküley tañi pu kulliñ!','Hola. ¡No están mis animales!','Hello. My animals are gone!'),
      L('Wentru','Küla kawellu ka epu waka nien.','Tengo tres caballos y dos vacas.','I have three horses and two cows.'),
      N('Kulliñ son los animales. Kawellu es caballo, waka es vaca y ofisa es oveja.','Kulliñ are the animals. Kawellu is horse, waka is cow and ofisa is sheep.'),
      N('Desde que llegó el Witranalwe se escapan por todo el campo. Háblales en mapudungun: dile «küpange» («¡ven!») a cada animal mío y te seguirá hasta mi corral.','Since the Witranalwe came, they run off all over the field. Speak to them in Mapudungun: say «küpange» («come!») to each of my animals and it will follow you to my pen.'),
      L('Wentru','Ofisa nielan.','No tengo ofisa (ovejas). Esas no son mías.','I have no ofisa (sheep). Those are not mine.')]);}
  if(k>=3&&w>=2){S.flags.herd=1;S.gold+=30;persist();
    return say([L('Wentru','Kom tañi kulliñ wiñoturkey. Chaltu may!','¡Volvieron todos mis animales! ¡Gracias!','All my animals came back! Thank you!'),
      L('','Küla mari ngülliw!','El wentru te da küla mari (30) ngülliw...','The man gives you küla mari (30) ngülliw...')],()=>gainPiwke([N('...y algo rojo que encontró en el pasto.','...and something red he found in the grass.')]));}
  say([L('Wentru',numW(k)+' kawellu, '+numW(w)+' waka.','Volvieron '+k+' caballos y '+w+' vacas. Faltan '+(3-k)+' caballos y '+(2-w)+' vacas.',k+' horses and '+w+' cows are back. '+(3-k)+' horses and '+(2-w)+' cows are still missing.')]);
}
const Ua=a=>a.u[0].toUpperCase()+a.u.slice(1);
const ANIM={kawellu:{es:'caballo',en:'horse',a:'el',u:'un'},waka:{es:'vaca',en:'cow',a:'la',u:'una'},ofisa:{es:'oveja',en:'sheep',a:'la',u:'una'},luan:{es:'guanaco',en:'guanaco',a:'el',u:'un'},choyke:{es:'ñandú',en:'rhea',a:'el',u:'un'}};
function animalTalk(e){
  const a=ANIM[e.look],en=S.gloss==='en';
  if(!e.herd||!S.flags.herd_task||S.flags.herd)return say([L('',e.look[0].toUpperCase()+e.look.slice(1),Ua(a)+' '+e.look+' ('+a.es+') te mira y sigue comiendo pasto.','A '+e.look+' ('+a.en+') looks at you and keeps grazing.')]);
  choose(L('',e.look,'¿Qué le dices '+(a.a==='el'?'al':'a la')+' '+e.look+'?','What do you say to the '+e.look+'?'),[{m:'Küpange!',g:S.hints?(en?'Come!':'¡Ven!'):'',v:'k'},{m:'Amutunge!',g:S.hints?(en?'Go away!':'¡Vete!'):'',v:'a'},{m:'Pewkayal',g:en?'(leave it)':'(dejarlo)',v:'x'}],v=>{
    if(v==='k'){
      if(e.look==='ofisa'){sfx('bad');return say([N('La ofisa te sigue un poco... pero el wentru dijo «Ofisa nielan»: no tiene ovejas. La dejas volver con su rebaño.','The sheep follows you a little... but the man said «Ofisa nielan»: he has no sheep. You let it go back to its flock.')])}
      S.flags[e.flag]=1;ents=ents.filter(x=>x!==e);persist();sfx('pick');
      {const n=herdN('kawellu')+herdN('waka'),sp=PENSPOT[n-1];ents.push({kind:'animal',look:e.look,x:sp[0],y:sp[1],fx:sp[0],fy:sp[1],ox:sp[0],oy:sp[1],pen:[10,2,15,3],cd:40,wait:0,dir:'right',home:1})}
      return say([praise(),N(Ua({u:a.a})+' '+e.look+' te sigue hasta el corral del wentru, al norte. ('+herdN('kawellu')+'/3 kawellu · '+herdN('waka')+'/2 waka)','The '+e.look+' follows you to the man\'s pen, to the north. ('+herdN('kawellu')+'/3 kawellu · '+herdN('waka')+'/2 waka)')])}
    if(v==='a'){sfx('bad');for(let i=0;i<3;i++){const d=['up','down','left','right'][rnd(4)],[dx,dy]=DV[d];if(walk(e.x+dx,e.y+dy)&&!entAt(e.x+dx,e.y+dy,e)&&!(e.x+dx===P.x&&e.y+dy===P.y)){e.x+=dx;e.y+=dy}}
      return say([N(Ua({u:a.a})+' '+e.look+' se asusta y se aleja corriendo. Así no vendrá.','The '+e.look+' gets scared and runs off. It will not come that way.')])}
  },true,true);
}
function animalStep(e){
  if(e.still)return;
  if(e.wait>0){e.wait--;e.mv=false;return}
  if(--e.cd>0)return;e.cd=40+rnd(80);if(Math.random()<.45){e.mv=false;return}
  const d=['up','down','left','right'][rnd(4)],[dx,dy]=DV[d],nx=e.x+dx,ny=e.y+dy;e.dir=dx<0?'left':dx>0?'right':e.dir;
  if(e.pen){const [x0,y0,x1,y1]=e.pen;if(nx<x0||nx>x1||ny<y0||ny>y1)return}
  else if(Math.abs(nx-e.ox)>3||Math.abs(ny-e.oy)>3)return;
  if(!walk(nx,ny)||entAt(nx,ny,e)||(nx===P.x&&ny===P.y)||grid[ny][nx]==='S')return;
  e.x=nx;e.y=ny;e.mv=true;
}
function kona2Talk(){
  if(S.flags.ngen2)return say([L('Kona','Witranalwe amutuy! Ayüwün!','¡Se fue el Witranalwe! ¡Qué feliz estoy!','The Witranalwe is gone! I am so happy!')]);
  say([L('Kona','Witranalwe müley mawida mew. Llükan!','El Witranalwe está en el monte. ¡Tengo miedo!','The Witranalwe is in the forest. I am afraid!'),
    N('Su guarida está bajando por la escalera de piedra, aquí al lado. Dicen que adentro hay piedras con números grandes y otra piedra que habla de muchas personas.','Its lair is down the stone stairway, right here. They say inside there are stones with big numbers and another stone that talks about many people.'),
    L('Kona','Iñche wüñoloftuan.','Yo voy a volver al lof.','I am going back to the lof.')]);
}

/* ---------- lof mini-quests ---------- */
function paliTalk(){
  if(S.flags.laf_palid)return say([L('Pichi domo','Palin! Palin!','¡A jugar palin!','Palin time!')]);
  if(S.flags.laf_paliq)return say([L('Pichi domo','Ñami ñi pali!','¡Se me perdió la pali (la bola)!','My pali (the ball) is lost!'),
    N('«Se me fue botando hasta las dunas... quedó entre el pasto alto, al oeste, cerca del agua. Escarba ahí.»','"It went bouncing off to the dunes... it ended up in the tall grass, to the west, near the water. Dig around there."')]);
  S.flags.laf_paliq=1;persist();
  say([L('Pichi domo','Mari mari! Ñami ñi pali!','¡Hola! ¡Se me perdió la pali!','Hello! My pali is lost!'),
    N('La pali es la bola de madera del palin. «Se me fue botando hasta las dunas, al pasto alto del oeste. ¿Me la buscas?»','The pali is the wooden palin ball. "It went bouncing off to the dunes, into the tall grass in the west. Will you find it for me?"')]);
}
function nweavTalk(){
  const en=S.gloss==='en';
  if(S.flags.n_weavd)return say([L('Domo','Makuñ ngürekalen. Mañumeyu tami kellufiel iñche mew!','Estoy tejiendo un makuñ. ¡Gracias por la ayuda!','I am weaving a makuñ. Thanks for the help!')]);
  const qs=[{q:L('Domo','Chem am ta tüfa? Kelü kal.','Lana de color rojo.','Wool of the red color.'),o:['kelü','kallfü','lig'],a:'kelü'},
    {q:L('Domo','Tüfa kay? Kallfü kal.','Y esta: lana azul.','And this: blue wool.'),o:['kurü','kallfü','chod'],a:'kallfü'},
    {q:L('Domo','Ka tüfa? Lig kal.','Y esta: lana blanca.','And this one: white wool.'),o:['lig','karü','kelü'],a:'lig'}];
  say([L('Domo','Mari mari! Makuñ ngürekalen. Kelluaen!','¡Hola! Estoy tejiendo un makuñ. ¡Ayúdame! (con la lana)','Hello! I am weaving a makuñ. Help me! (with the wool)'),
    N('Te muestra ovillos de colores. Dile el color de cada uno. Tu chillka tiene los colores.','She shows you balls of dyed wool. Name each color. Your chillka has the colors.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.n_weavd=1;S.gold+=20;S.items.lawen++;S.xp+=3;persist();sfx('lvl');
      return say([praise(),L('Domo','Kümey tami femün, chaltu may!','¡Qué buen ojo! ¡Gracias!','What a good eye! Thank you!'),
        N('Te da epu mari (20) ngülliw y un lawen. +3 kimün.','She gives you epu mari (20) ngülliw and a lawen. +3 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];choose(q.q,q.o.map(o=>({m:o,v:o})).concat([{m:'Chillka',g:en?'Check the book':'Consultar el libro',v:'_b'}]),v=>{
      if(v==='_b')return openBook(()=>ask(i));
      if(trk('tejido',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Domo','Fey no...','Eso no...','Not that one...')],()=>ask(0))}},false,false)}
}
function pewKidsTalk(){
  const en=S.gloss==='en';
  if(S.flags.pew_kidd)return say([L('Pichiche','Kümey kofke! Chaltu may!','¡Qué rico el pan! ¡Gracias!','The bread was so good! Thank you!')]);
  if(S.items.kofke>=2)return choose(L('Pichiche','Ngülliw kofke nieymi? Epu?','¿Tienes pan de piñón? ¿Dos? (para mi hermana y para mí)','Do you have pewen-nut bread? Two? (for my sister and me)'),
    [{m:'May, eluayu!',g:en?'Yes, I will give them to you':'Sí, te los doy',v:1},{m:'Petu no',g:en?'Not yet':'Todavía no',v:0}],v=>{
      if(!v)return;
      S.items.kofke-=2;S.flags.pew_kidd=1;persist();sfx('lvl');
      say([L('Pichiche','Chaltu may!','¡Gracias!','Thank you!'),
        N('Los dos niños comen felices. Después, en secreto: «Al lado de la ruka grande del este enterramos un tesoro. ¡Escarba ahí!»','The two children eat happily. Then, in a whisper: "Beside the big ruka in the east we buried a treasure. Dig there!"')])},true,true);
  say([L('Pichiche','Ngülliw ayükefiñ! Kofke kafey!','¡Me gustan los piñones! ¡Y el pan!','I love pewen nuts! And bread!'),
    L('Pichiche','Epu kofke nielmi, eluaen!','Si tienes dos panes, ¡dame!','If you have two breads, give them to us!'),
    N('Los kofke se compran donde el ngillakafe, o te los regala quien hace pan.','Kofke can be bought from the trader, or given by whoever is baking.')]);
}
function mushayTalk(){
  const en=S.gloss==='en';
  if(S.flags.w_mushd)return say([L('Papay','Kümey mushay! Ka antü ka dewmayan.','¡Qué rico el mushay! Otro día haré más.','The mushay was so good! Another day I will make more.')]);
  if(S.items.kulon>=2)return choose(L('Papay','Epu külon nieymi! Dewmayan mushay. Eluafen?','¡Tienes dos külon! Haré mushay. ¿Me los das?','You have two külon! I will make mushay. Will you give them to me?'),
    [{m:'May, eluayu!',g:en?'Yes, here you are':'Sí, aquí tiene',v:1},{m:'Petu no',g:en?'Not yet':'Todavía no',v:0}],v=>{
      if(!v)return;
      S.items.kulon-=2;S.flags.w_mushd=1;S.gold+=30;S.hp=maxHP();persist();sfx('lvl');
      say([N('La papay machaca los külon y prepara mushay, el jugo fermentado dulce del maqui.','The papay crushes the külon and makes mushay, the sweet fermented maqui drink.'),
        L('Papay','Pütunge! Kümey!','¡Toma! ¡Está rico!','Drink! It is good!'),
        N('Te recuperas por completo y te regala küla mari (30) ngülliw.','You fully recover and she gives you küla mari (30) ngülliw.')])},true,true);
  say([L('Papay','Mari mari, '+addr(true)+'. Mushay dewmayan, welu külon nielan.','Hola. Quiero hacer mushay, pero no tengo külon.','Hello. I want to make mushay, but I have no külon.'),
    N('El mushay se hace con külon (maqui). «Tráeme epu (2) külon y habrá mushay para las dos.» El ngillakafe los vende.','Mushay is made from külon (maqui). "Bring me epu (2) külon and there will be mushay for us both." The trader sells them.')]);
}

/* ---------- side quests: marsh, menoko, island, interiors ---------- */
const pickCount=m=>Object.keys(S.flags).filter(f=>f.indexOf('pick:'+m+':')===0).length;
function pickSpot(x,y){
  const st=M.pickStyle||'diwen',k='pick:'+CUR+':'+x+','+y;
  if(st==='diwen'){
    if(!S.flags.l_diwq)return say([L('','Diweñ','Un ñirre con diweñ: hongos redondos y anaranjados que crecen en sus ramas.','A ñirre tree with diweñ: round orange fungi growing on its branches.')]);
    setTileFlag(x,y);S.flags[k]=1;persist();sfx('pick');
    const n=pickCount('l_wapi');
    if(n>=3)return say([L('','Küla diweñ!','¡Juntaste los tres diweñ! Vuelve con la diweñfe.','You gathered all three diweñ! Go back to the diweñfe.')]);
    return say([L('',(n===1?'Kiñe':'Epu')+' diweñ!','Sacas diweñ de las ramas ('+n+'/3).','You pick diweñ from the branches ('+n+'/3).')]);
  }
  if(!S.flags.n_lawq)return say([L('','Lawen kachu','Hierbas de lawen crecen en el borde del agua. La lawentuchefe sabrá cuáles sirven.','Lawen herbs grow at the water\'s edge. The healer will know which ones are good.')]);
  setTileFlag(x,y);S.flags[k]=1;persist();sfx('pick');
  const n=pickCount('n_menoko');
  if(n>=3)return say([L('','Küla lawen!','¡Juntaste las tres hierbas! Vuelve con la lawentuchefe.','You gathered all three herbs! Go back to the healer.')]);
  say([L('',(n===1?'Kiñe':'Epu')+' lawen!','Cortas las hierbas con cuidado ('+n+'/3).','You carefully cut the herbs ('+n+'/3).')]);
}
function diwenfeTalk(){
  if(S.flags.l_diwd)return say([L('Diweñfe','Chaltu may, '+addr(true)+'! Kümey diweñ!','¡Gracias! ¡Qué ricos diweñes!','Thank you! What good diweñ!'),
    N('¿Ya hablaste con la piedra del este? Pregunta por los oficios en -fe: challwafe, diweñfe...','Have you talked with the stone to the east? It asks about the -fe trades: challwafe, diweñfe...')]);
  if(S.flags.l_diwq&&pickCount('l_wapi')>=3){S.flags.l_diwd=1;S.items.diwen+=2;S.gold+=30;persist();sfx('lvl');
    return say([L('Diweñfe','Küla diweñ! Chaltu may!','¡Tres diweñes! ¡Gracias!','Three diweñ! Thank you!'),
      N('Te regala dos diweñ para el camino y küla mari (30) ngülliw.','She gives you two diweñ for the road and küla mari (30) ngülliw.'),
      L('Diweñfe','Iñche diweñfe: diweñ kintuken. Eymi kay? Challwafe? Ngürekafe?','Yo soy diweñfe: busco digüeñes. ¿Y tú? ¿Pescador? ¿Tejedora?','I am a diweñfe: I gather diweñ. And you? A fisher? A weaver?'),
      N('-fe convierte un trabajo en la persona que lo hace. La piedra tallada del este pregunta justo por eso... y guarda algo rojo.','-fe turns a trade into the person who does it. The carved stone to the east asks exactly that... and it guards something red.')]);}
  if(S.flags.l_diwq)return say([L('Diweñfe','Küpaen küla diweñ!','¡Búscame tres diweñes!','Find me three diweñ!'),
    N('Crecen en los ñirres del pantano: bolitas anaranjadas en las ramas.','They grow on the marsh ñirre trees: little orange balls on the branches.')]);
  S.flags.l_diwq=1;persist();
  say([L('Diweñfe','Mari mari, '+addr(true)+'! Iñche diweñfe.','¡Hola! Yo soy recolectora de digüeñes.','Hello! I am a diweñ gatherer.'),
    N('El diweñ es un hongo redondo y dulce que crece en los ñirres. Se come crudo, en ensalada... ¡o en kurantu!','The diweñ is a round, sweet fungus that grows on ñirre trees. People eat it raw, in salads... or in kurantu!'),
    L('Diweñfe','Küpaen küla diweñ! Müna kushengen.','¡Búscame tres diweñes! Ya estoy vieja para trepar.','Find me three diweñ! I am too old to climb.'),
    N('Hay tres ñirres con diweñ en este pantano. Interactúa con ellos para sacarlos.','There are three ñirre trees with diweñ in this marsh. Interact with them to pick the fungi.')]);
}
function lawenfeTalk(){
  if(S.flags.n_lawd)return say([L('Lawentuchefe','Chaltu may! Kümelkaleaymi.','¡Gracias! Que estés bien.','Thank you! Be well.')]);
  if(S.flags.n_lawq&&pickCount('n_menoko')>=3){S.flags.n_lawd=1;S.items.lawen+=2;persist();sfx('lvl');
    return say([L('Lawentuchefe','Küme lawen! Chaltu may!','¡Buenas hierbas! ¡Gracias!','Good herbs! Thank you!'),
      N('Prepara dos lawen y te los regala.','She prepares two lawen and gives them to you.')],()=>gainPiwke([N('Y del fondo de su chaiwe saca algo rojo que encontró en el menoko...','And from the bottom of her basket she takes something red she found in the menoko...')]));}
  if(S.flags.n_lawq)return say([L('Lawentuchefe','Küla lawen kachu küpayaen!','¡Búscame tres matas de lawen!','Find me three lawen plants!'),
    N('Crecen al borde de las aguas del menoko.','They grow at the edge of the menoko waters.')]);
  S.flags.n_lawq=1;persist();
  say([L('Lawentuchefe','Mari mari. Iñche lawentuchefe.','Hola. Yo sano con lawen (remedios de plantas).','Hello. I heal with lawen (plant remedies).'),
    N('El menoko es un humedal sagrado: aquí crecen los lawen más fuertes. Se entra con respeto y se saca solo lo necesario.','The menoko is a sacred wetland: the strongest healing plants grow here. One enters with respect and takes only what is needed.'),
    L('Lawentuchefe','Küla lawen kachu küpayafen.','Búscame tres matas de lawen, por favor.','Find me three lawen plants, please.')]);
}
function trutfeTalk(){
  if(S.gear.trutruka)return say([L('Trutrukatufe','Pefimi ñi trutruka! Niekaymi müten: iñche ka nien tati.','¡La encontraste! Quédatela: yo tengo otra.','You found it! Keep it: I have another one.'),
    L('Trutrukatufe','Trutrukatufe ngeaymi!','¡Vas a ser trutruquero!','You are going to be a trutruka player!'),
    N('En las peleas, tócala: su sonido largo aturde a todos los wekufü una vez por pelea. Trutruka + -tu- + -fe = trutrukatufe, quien la toca.','In battle, blow it: its long blast stuns all the wekufü once per fight. Trutruka + -tu- + -fe = trutrukatufe, the one who plays it.')]);
  if(S.flags.n_trut_q)return say([L('Trutrukatufe','Ñami ñi trutruka kürüf mew!','¡El viento me botó la trutruka!','The wind knocked my trutruka away!'),
    N('«Cayó entre los juncos, al lado del agua del medio del menoko. Busca bien, pegado al agua.»','"It fell among the reeds, beside the pool in the middle of the menoko. Search carefully, right by the water."')]);
  S.flags.n_trut_q=1;persist();
  say([L('Trutrukatufe','Mari mari... Iñche trutrukatufe, welu...','Hola... Yo soy trutruquero, pero...','Hello... I am a trutruka player, but...'),
    L('Trutrukatufe','Ñami ñi trutruka!','¡Se me perdió la trutruka!','I lost my trutruka!'),
    N('La trutruka es una corneta larga de coligüe con un cuerno en la punta. «El viento la botó entre los juncos, al lado del agua del medio. ¿Me la buscas?»','The trutruka is a long colihue horn with a cow horn at the tip. "The wind knocked it into the reeds, beside the middle pool. Will you look for it?"')]);
}
function kurantuTalk(){
  const en=S.gloss==='en';
  if(S.flags.w_kur)return say([L('Kurantufe','Ka antü ka dewmayan kurantu. Wiñotuaymi!','Otro día haré otro kurantu. ¡Vuelve!','Another day I will make another kurantu. Come back!')]);
  if(S.items.diwen>=2&&S.items.kofke>=1){
    return choose(L('Kurantufe','Epu diweñ ka kiñe kofke nieymi! Dewmayu kurantu?','¡Tienes dos diweñes y un kofke! ¿Hacemos el kurantu?','You have two diweñ and a kofke! Shall we make the kurantu?'),
      [{m:'May!',g:en?'Yes! (hand over the food)':'¡Sí! (entregar la comida)',v:1},{m:'Petu no',g:en?'Not yet':'Todavía no',v:0}],v=>{
        if(!v)return;
        S.items.diwen-=2;S.items.kofke-=1;S.flags.w_kur=1;S.gold+=40;S.hp=maxHP();S.sp=SPMAX;persist();sfx('lvl');
        say([N('Sobre piedras calientes, entre hojas de pangue, se cocinan mariscos, papas, kofke y tus diweñes: ¡kurantu!','Over hot stones, wrapped in pangue leaves, shellfish, potatoes, kofke and your diweñ steam away: kurantu!'),
          L('Kurantufe','Kümey kurantu! Inge, inge!','¡Qué rico kurantu! ¡Come, come!','What a good kurantu! Eat, eat!'),
          N('Comes hasta quedar satisfecho: tus piwke y tu newen se recuperan por completo. Te regala meli mari (40) ngülliw por la ayuda.','You eat until you are full: your hearts and newen fully recover. She gives you meli mari (40) ngülliw for the help.')],()=>gainPiwke([N('Y envuelto en un paño, algo rojo que encontró en la arena de la isla...','And wrapped in a cloth, something red she found in the island sand...')]));
      },true,true);
  }
  say([L('Kurantufe','Mari mari, '+addr(true)+'! Kurantu dewmayan, welu...','¡Hola! Voy a hacer un kurantu, pero...','Hello! I am going to make a kurantu, but...'),
    L('Kurantufe','Epu diweñ ka kiñe kofke duamnien.','Necesito dos diweñes y un kofke.','I need two diweñ and one kofke.'),
    N('El kurantu se cocina en un hoyo con piedras calientes. Los diweñes crecen en los ñirres del norte (y a veces los venden los ngillakafe). Vuelve con ellos y habrá fiesta.','Kurantu is cooked in a pit over hot stones. Diweñ grow on ñirre trees up north (and traders sometimes sell them). Come back with everything and there will be a feast.')]);
}
function kallfurayTalk(){
  const first=!S.flags.l_kall;S.flags.l_kall=1;if(first)persist();
  say([L('Papay Kallfüray','Mari mari, '+addr(true)+'! Konpange.','¡Hola! Pasa.','Hello! Come in.'),
    L('Papay Kallfüray','Ngürekafe iñche: witral mew ngüreken.','Soy tejedora: tejo en el witral.','I am a weaver: I weave on the witral.'),
    N('Teje fajas y makuñ con figuras escalonadas. Ngüren «tejer» + -ke- + -fe = ngürekafe, la que teje.','She weaves sashes and ponchos with stepped patterns. Ngüren «to weave» + -ke- + -fe = ngürekafe, the one who weaves.'),
    N('«Cuando era niña, mi hermano enterró algo rojo en las dunas: donde el pasto crece entre la arena, cerca de la entrada del oeste. Nunca lo fue a buscar.»','"When I was a girl, my brother buried something red in the dunes: where the grass grows out of the sand, near the western entrance. He never went back for it."')]);
}
function sayenTalk(){
  if(S.flags.n_sayen)return say([L('Ñaña Sayen','Dewmamültrünkülen. Inge!','Estoy haciendo mültrün (catutos). ¡Come!','I am making mültrün. Eat!'),
    N('«¿Ya escarbaste en los campos de los animales? Justo al medio del pasto, lejos de los corrales, los niños esconden cántaros.»','"Did you dig in the animal fields yet? Right in the middle of the grass, away from the pens, the children hide little jars."')]);
  S.flags.n_sayen=1;S.items.kofke+=2;persist();sfx('pick');
  say([L('Ñaña Sayen','Mari mari, '+addr(true)+'! Konpange, inge!','¡Hola! ¡Pasa, come!','Hello! Come in, eat!'),
    N('Está moliendo trigo cocido para hacer mültrün, los catutos alargados. Te regala dos kofke calientes.','She is grinding boiled wheat to make mültrün. She gives you two warm kofke.'),
    N('«Y un secreto: en los campos de los animales, justo al medio del pasto, los niños esconden cántaros con sorpresas. Lleva algo para escarbar.»','"And a secret: in the animal fields, right in the middle of the grass, the children hide jars with surprises. Bring something to dig with."')]);
}
function kintulTalk(){
  say([L('Chachay Kintul','Mari mari. Challwafe iñche, kuyfi mew.','Hola. Fui pescador, hace tiempo.','Hello. I was a fisher, long ago.'),
    N('«He visto al Kaleuche dos veces, con mis propios ojos: un barco con música y luces, navegando bajo el agua.»','"I have seen the Kaleuche twice, with my own eyes: a ship with music and lights, sailing under the water."'),
    N('«En la costa del sur enterré mi vieja caja de anzuelos, al bajar a la playa, en medio de la arena. Si la encuentras, es tuya. Y en la isla del lago, dicen que la kurantufe paga bien la ayuda.»','"On the southern coast I buried my old hook box, down on the beach, in the middle of the sand. If you find it, it is yours. And on the island in the lake, they say the kurantufe pays well for help."')]);
}

/* ---------- Pewenche rukas ---------- */
function rayenTalk(){
  if(!S.flags.pew_ngu1){S.flags.pew_ngu1=1;S.gold+=10;persist();sfx('pick');
    return say([L('Papay Rayen','Mari mari, '+addr(true)+'! Konpange, konpange!','¡Hola! ¡Pasa, pasa!','Hello! Come in, come in!'),
      L('Papay Rayen','Kütral mew ngülliw kotülefiñ.','Estoy tostando ngülliw (piñones) al fuego.','I am toasting ngülliw (pewen nuts) on the fire.'),
      N('El ngülliw es la semilla del pewen: comida, harina y hasta moneda en estas tierras. Te convida un puñado tostado: mari (10) ngülliw.','The ngülliw is the seed of the pewen tree: food, flour, even money in these lands. She treats you to a toasted handful: mari (10) ngülliw.'),
      L('Papay Rayen','Yenge tüfachi ngülliw arriero mew. Rüpü mew müley ñi pu kawellu engün.','Lleva estos piñones al arriero. Está en el camino, con sus caballos.','Take these pewen nuts to the muleteer. He is on the road, with his horses.'),
      N('Fíjate en yenge: ye- es «llevar» y -nge la orden: «¡lleva!».','Notice yenge: ye- is «carry» and -nge the command: «carry!».')]);}
  if(!S.flags.pew_ngu2)return say([L('Papay Rayen','Arriero mew amunge! Rüpü mew müley.','¡Ve donde el arriero! Está en el camino.','Go to the muleteer! He is on the road.')]);
  say([L('Papay Rayen','Chaltu may, '+addr(true)+'!','¡Gracias!','Thank you!'),
    L('Papay Rayen','Ürkütunge inaltu kütral mew.','Descansa junto al fuego.','Rest by the fire.')]);
}
function nawelTalk(){
  if(S.flags.pew_llawe)return say([L('Chachay Nawel','Fewla kümelkalen. Chaltu may!','Ahora estoy mejor. ¡Gracias!','I am better now. Thank you!'),
    L('Chachay Nawel','Pillañ mew amunge, '+addr(false)+'.','Ve al volcán.','Go to the volcano.')]);
  if(S.flags.pew_basket){S.flags.pew_llawe=1;S.items.kulon+=2;persist();sfx('lvl');
    return say([N('Le entregas el chaiwe lleno de külon.','You hand him the chaiwe full of maqui berries.'),
      L('Chachay Nawel','Chaltu may! Külon lawen ngey.','¡Gracias! El maqui es remedio.','Thank you! Maqui is medicine.'),
      N('Prepara un remedio oscuro y se lo toma. Poco a poco deja de toser. Te regala dos külon.','He brews a dark remedy and drinks it. Little by little the cough fades. He gives you two külon.'),
      L('Chachay Nawel','Allkütunge. Kuyfi, pillañ rüpü mew amukefuiñ.','Escucha. Antiguamente íbamos por el paso del pillañ.','Listen. Long ago we used to travel the volcano pass.'),
      N('Te entrega una vieja llave de piedra: la llawe del paso. «La puerta de hielo, en los campos de nieve, se abre con esto.»','He hands you an old stone key: the llawe of the pass. "The ice door, in the snowfields, opens with this."'),
      L('','Llawe!','¡Conseguiste la llawe del paso del pillañ!','You got the llawe of the volcano pass!')]);}
  if(S.flags.pew_chaiwe)return say([L('Chachay Nawel','Kof kof... Ñami ñi chaiwe mawida mew.','Cof cof... Mi canasto se perdió en el bosque.','Cough cough... My basket got lost in the forest.'),
    N('«Al sur del camino del bosque hay un rincón escondido lleno de külon. Ahí quedó.»','"South of the forest road there is a hidden corner full of maqui. It was left there."')]);
  S.flags.pew_chaiwe=1;persist();
  say([L('Chachay Nawel','Mari mari... kof kof! Chafolen.','Hola... ¡cof cof! Estoy con tos.','Hello... cough, cough! I have a cough.'),
    N('El chachay Nawel es el hombre más viejo del lof. Se mejora con un remedio de külon (maqui), pero...','Chachay Nawel is the oldest man in the lof. A maqui remedy would help him, but...'),
    L('Chachay Nawel','Ñami ñi chaiwe! Fentren külon niefuy.','¡Se me perdió el chaiwe (canasto)! Tenía mucho maqui.','My chaiwe (basket) got lost! It had a lot of maqui.'),
    N('«Lo dejé en el bosque de pewenes, en un rincón escondido al sur del camino, donde crecen los külon. Mis piernas ya no me llevan hasta allá... ¿me lo buscas?»','"I left it in the pewen forest, in a hidden corner south of the road, where the maqui bushes grow. My legs will not carry me there any more... will you look for it?"')]);
}
function kulonBush(x,y){
  const found=S.flags.pew_basket;
  if(S.flags.pew_chaiwe&&!found&&x+','+y==='28,14'){S.flags.pew_basket=1;persist();sfx('lvl');
    return say([N('Entre las ramas del külon hay un chaiwe viejo, lleno de frutitos morados.','Among the maqui branches there is an old chaiwe, full of little purple berries.'),
      L('','Chaiwe!','¡Encontraste el chaiwe del chachay Nawel!','You found chachay Nawel\'s chaiwe!')]);}
  if(S.flags.pew_chaiwe&&!found)return say([N('Buscas entre las ramas... pero aquí no hay ningún chaiwe.','You search among the branches... but there is no chaiwe here.'),
    L('','Külon','Un külon (maqui) cargado de frutitos morados.','A külon (maqui) loaded with little purple berries.')]);
  say([L('','Külon','Un külon (maqui) cargado de frutitos morados. Con sus frutos se hace remedio y mushay.','A külon (maqui) loaded with little purple berries. Its fruit makes medicine and mushay.')]);
}

/* ---------- Secret wekufü (step on their ground to wake them) ---------- */
function sbossWake(sb){
  const pre={chinifilu:[N('El barro empieza a burbujear bajo tus pies... y una filu (culebra) gigantesca emerge chorreando lodo, cubierta de pelo áspero y con crin de kawellu: ¡el Chiñifilu!','The mud starts to bubble under your feet... and a gigantic filu (snake) rises dripping slime, covered in coarse hair, with a horse\'s mane: the Chiñifilu!'),
      N('Tres sellos de luz lo protegen. El primero susurra: «¡Duérmete!»','Three seals of light protect it. The first whispers: «Sleep!»')],
    piwuchen:[N('La loma tiembla bajo tus pasos y de la cima baja un silbido agudo. Una culebra con alas de murciélago cae del cielo: ¡el Piwüchen!','The knoll trembles under your steps and a shrill whistle comes down from the summit. A snake with bat wings drops from the sky: the Piwüchen!'),
      N('Tres sellos de luz lo protegen. El primero susurra: «¡Baja!»','Three seals of light protect it. The first whispers: «Come down!»')],
    wallipen:[N('Pisas la orilla helada y el agua del ojo de agua se agita. Una criatura deforme, mitad oveja y mitad ternero, sale arrastrando las patas: ¡el Wallepeñ!','You tread the icy edge and the pool stirs. A misshapen creature, half sheep and half calf, drags itself out: the Wallepeñ!'),
      N('Tres sellos de luz lo protegen. El primero susurra: «¡Ten frío!»','Three seals of light protect it. The first whispers: «Be cold!»')],
    trawko:[N('Un hacha de piedra se clava en un tronco, a un palmo de tu cabeza. Del helecho sale un hombrecito retorcido con sombrero de fibra: ¡el Trawko!','A stone axe thuds into a trunk, a hand\'s width from your head. Out of the ferns steps a twisted little man in a fiber hat: the Trawko!'),
      N('Tres sellos de luz lo protegen. El primero susurra: «¡Sal!»','Three seals of light protect it. The first whispers: «Come out!»')],
    chadikura:[N('La tierra blanda cruje bajo tus pies... y la sal entera se levanta y se arma sola: un gigante de cristal blanco con grietas que brillan verdes. El Elëngasëm, el gigante acorazado de las llanuras del este, despierta a medias.','The soft ground crunches under your feet... and the salt itself rises and assembles: a giant of white crystal with cracks that glow green. The Elëngasëm, the armored giant of the eastern plains, half-wakes.'),
      N('Tres sellos de luz lo protegen. El primero susurra: «¡Despierta!»','Three seals of light protect it. The first whispers: «Wake up!»')],
    kalku:[N('El pasto gris se abre y una figura flaca sale de la tierra agrietada, envuelta en un manto de plumas negras, con un bastón de hueso: el Fütra Kalku, el que vendió las tierras a la niebla.','The grey grass parts and a gaunt figure rises from the cracked earth, wrapped in a cloak of black feathers, carrying a bone staff: the Fütra Kalku, the one who sold the lands to the fog.'),
      L('Fütra Kalku','Ngoyman ñi duam mew küdawken. Eymi... ngoyaymi.','Trabajo para el olvido. Y tú... serás olvidado.','I work for the forgetting. And you... will be forgotten.'),
      N('Tres sellos de sombra lo protegen. El primero susurra: «¡Ten miedo!»','Three seals of shadow protect him. The first whispers: «Be afraid!»')]}[sb.boss];
  say(pre,()=>startBattle([sb.boss],{boss:1,sflag:sb.flag}));
}

/* ---------- Nagche overworld puzzles ---------- */

/* ================= MACHI QUESTS (one per lof, in tandem with the lonko) ================= */
const MACHIQ={
 laf:{gate:'pentukun',
  prob:[L('Machi','Kiñe pichiche kutranküley.','Un niño del lof está enfermo.','A child of the lof is sick.'),
   N('«Tiene un susto metido en el cuerpo y no duerme. Para su lawen necesito hojas de foye, el canelo, el árbol sagrado de las machi. El lonko conoce esta tierra mejor que nadie: él y yo cuidamos juntos el lof. Pídele que te diga dónde crece el foye viejo.»','"A fright has settled in his body and he cannot sleep. For his remedy I need leaves of the foye, the canelo, the sacred tree of the machi. The lonko knows this land better than anyone: he and I look after the lof together. Ask him where the old foye grows."')],
  ask:L('Machi','Kintulen foye tapül, chaltu may. Lonko mew dungunge.','Búscame hojas de foye, por favor. Habla con el lonko.','Find me foye leaves, please. Speak with the lonko.'),
  remind:N('«Las hojas del foye viejo, en Fotra mapu: el árbol solo entre los dos brazos de agua. Párate a su pie, por el lado norte, y pídele permiso.»','"The leaves of the old foye, in Fotra mapu: the lone tree between the two arms of water. Stand at its foot, on the north side, and ask its leave."'),
  thanks:L('Machi','Küme foye! Chaltu may.','¡Buen foye! Gracias.','Good foye! Thank you.'),
  after:N('Machuca las hojas, las hierve y le lleva el remedio al niño. Después vuelve y pone dos lawen en tus manos. «El lonko habló por ti y tú caminaste por el lof. Así se cuida una comunidad. Cuando estés herido, ven a verme.»','She crushes the leaves, boils them and takes the remedy to the child. Then she returns and puts two lawen in your hands. "The lonko spoke for you and you walked for the lof. That is how a community is cared for. When you are hurt, come and see me."'),
  give:L('Machi','Epu lawen eluaeyu.','Te doy dos lawen.','I give you two lawen.'),
  reward:()=>{S.items.lawen+=2}},
 nag:{gate:'nag_lonko',
  prob:[L('Machi','Kiñe papay kutranküley.','Una papay está enferma.','A papay is sick.'),
   N('«Tiene una tos vieja que no la suelta. Su lawen se prepara con agua del menoko, sacada con respeto. El lonko guarda el metawe antiguo del lof, el cántaro de greda: él y yo trabajamos juntos en esto. Pídeselo.»','"An old cough will not let her go. Her remedy is made with water from the menoko, drawn with respect. The lonko keeps the lof\'s old metawe, the clay jug: he and I work together in this. Ask him for it."')],
  ask:L('Machi','Kintulen menoko ko, chaltu may. Lonko mew dungunge.','Búscame agua del menoko, por favor. Habla con el lonko.','Find me menoko water, please. Speak with the lonko.'),
  remind:N('«Con el metawe del lonko, saca agua del ojo de agua del rincón del amanecer, el del nororiente del menoko: el agua más quieta.»','"With the lonko\'s metawe, draw water from the pool in the sunrise corner, the north-east of the menoko: the stillest water."'),
  thanks:L('Machi','Küme ko! Chaltu may.','¡Buena agua! Gracias.','Good water! Thank you.'),
  after:N('Prepara el remedio y se lo lleva a la papay. Al volver te da un mate caliente y un lawen. «El lonko puso el metawe y tú pusiste el camino. Así trabajamos la machi y el lonko. Cuando estés herido, ven a verme.»','She prepares the remedy and takes it to the papay. When she returns she hands you a hot mate and a lawen. "The lonko gave the metawe and you gave the walking. That is how machi and lonko work. When you are hurt, come and see me."'),
  give:L('Machi','Kiñe mate ka kiñe lawen eluaeyu.','Te doy un mate y un lawen.','I give you a mate and a lawen.'),
  reward:()=>{S.items.mate+=1;S.items.lawen+=1}},
 pew:{gate:'pew_lonko',
  prob:[L('Machi','Müley llellipun.','Viene una rogativa.','A rogation is coming.'),
   N('«Antes de las nieves grandes haremos un llellipun, una rogativa, para que el invierno pase liviano. Necesito ngülliw del pewen más viejo, la abuela de todos los pewenes. La familia del lonko la ha cuidado por generaciones: él sabe dónde está. Habla con él.»','"Before the great snows we will hold a llellipun, a rogation, so the winter passes lightly. I need ngülliw from the oldest pewen, the grandmother of all the pewen trees. The lonko\'s family has watched over her for generations: he knows where she stands. Speak with him."')],
  ask:L('Machi','Kintulen ngülliw, chaltu may. Lonko mew dungunge.','Búscame piñones, por favor. Habla con el lonko.','Find me pewen nuts, please. Speak with the lonko.'),
  remind:N('«La abuela pewen está en el bosque de abajo de Pewen mapu, en lo más tupido. Párate entre los árboles, donde apenas entra la luz, y recoge solo lo que está en el suelo.»','"The grandmother pewen is in the lower forest of Pewen mapu, where it grows thickest. Stand among the trees, where the light barely enters, and gather only what lies on the ground."'),
  thanks:L('Machi','Küme ngülliw! Chaltu may.','¡Buenos piñones! Gracias.','Good ngülliw! Thank you.'),
  after:N('Guarda los ngülliw para el llellipun y te da dos kofke recién hechos y un lawen. «La palabra del lonko abrió el bosque y tus pies hicieron el resto. Cuando estés herido, ven a verme.»','She sets the ngülliw aside for the llellipun and gives you two fresh kofke and a lawen. "The lonko\'s word opened the forest and your feet did the rest. When you are hurt, come and see me."'),
  give:L('Machi','Epu kofke ka kiñe lawen eluaeyu.','Te doy dos kofke y un lawen.','I give you two kofke and a lawen.'),
  reward:()=>{S.items.kofke+=2;S.items.lawen+=1}},
 wil:{gate:'wil_lonko',
  prob:[L('Machi','Kiñe papay kutranküley.','Una papay está enferma.','A papay is sick.'),
   N('«Le duelen los huesos con la lluvia. Su lawen pide trayenko: agua del salto, agua que cae con newen. La garganta de la cascada es brava; el lonko quiere ayudar y te prestará su yiwe, su vaso de madera, para traerla. Habla con él primero.»','"Her bones ache with the rain. Her remedy calls for trayenko: water of the waterfall, water that falls with newen. The gorge of the falls is fierce; the lonko wants to help and will lend you his yiwe, his wooden cup, to carry it. Speak with him first."')],
  ask:L('Machi','Kintulen trayen ko, chaltu may. Lonko mew dungunge.','Búscame agua del salto, por favor. Habla con el lonko.','Find me waterfall water, please. Speak with the lonko.'),
  remind:N('«Con el yiwe del lonko, llena agua al pie del salto de Trayen mapu, donde el agua golpea la piedra, por el lado derecho.»','"With the lonko\'s yiwe, fill water at the foot of the falls in Trayen mapu, where the water strikes the rock, on the right-hand side."'),
  thanks:L('Machi','Küme ko! Chaltu may.','¡Buena agua! Gracias.','Good water! Thank you.'),
  after:N('Prepara el remedio con el trayenko y le devuelve el yiwe al lonko. A ti te da dos lawen. «Él puso su yiwe, tú pusiste el valor. Así se cuida un lof. Cuando estés herido, ven a verme.»','She prepares the remedy with the trayenko and returns the yiwe to the lonko. To you she gives two lawen. "He gave his yiwe, you gave your courage. That is how a lof is cared for. When you are hurt, come and see me."'),
  give:L('Machi','Epu lawen eluaeyu.','Te doy dos lawen.','I give you two lawen.'),
  reward:()=>{S.items.lawen+=2}},
 puel:{gate:'puel_lonko',
  prob:[L('Machi','Chadi duamnien.','Necesito sal.','I need salt.'),
   N('«Para los remedios y para la comida del trawün hace falta chadi, sal de la tierra. Antes había un camino de la sal; el lonko lo caminó de joven y todavía lo recuerda. Pídele que te diga dónde queda.»','"For the remedies and for the food of the gathering we need chadi, salt of the earth. There used to be a salt path; the lonko walked it when he was young and still remembers it. Ask him to tell you where it lies."')],
  ask:L('Machi','Kintulen chadi, chaltu may. Lonko mew dungunge.','Búscame sal, por favor. Habla con el lonko.','Find me salt, please. Speak with the lonko.'),
  remind:N('«En el lelfün de abajo, junto al chacay solo, el suelo se pone blanco: ahí está la chadi. Escarba junto al árbol.»','"In the lower lelfün, by the lone chacay, the ground turns white: that is where the chadi lies. Dig beside the tree."'),
  thanks:L('Machi','Küme chadi! Chaltu may.','¡Buena sal! Gracias.','Good salt! Thank you.'),
  after:N('Guarda la chadi en bolsitas de cuero y te da dos kofke y epu mari (20) ngülliw por el trabajo. «La memoria del lonko y tus manos: con las dos cosas se hizo esto. Cuando estés herido, ven a verme.»','She stores the chadi in small leather pouches and gives you two kofke and epu mari (20) ngülliw for the work. "The lonko\'s memory and your hands: this was done with both. When you are hurt, come and see me."'),
  give:L('Machi','Epu kofke eluaeyu.','Te doy dos kofke.','I give you two kofke.'),
  reward:()=>{S.items.kofke+=2;S.gold+=20}}};
function machiTalk(r){
  const q=MACHIQ[r];
  if(S.flags['mq_done_'+r]){
    return choose(L('Machi','Lawentuaeyu?','¿Te sano?','Shall I heal you?'),
      [{m:'May, chaltu may.',g:S.gloss==='en'?'Yes, thank you.':'Sí, gracias.',v:1},{m:'Ka antü.',g:S.gloss==='en'?'Another day.':'Otro día.',v:0}],
      v=>{if(v){S.hp=maxHP();S.kutran=0;persist();sfx('heal');
        say([N('La machi canta bajito sobre ti con una rama de foye. El cansancio y los males se van: tu newen está completo.','The machi sings softly over you with a foye branch. Weariness and ills fall away: your newen is whole.')])}
      else say([L('Machi','Kümelkaleaymi.','Que estés bien.','Be well.')])},true,true);
  }
  if(!S.flags[q.gate])return say([L('Machi','Mari mari.','Hola.','Hello.'),
    N('La machi del lof te saluda con calma desde su rewe. Primero preséntate con el lonko, como corresponde; después ella tendrá algo que pedirte.','The machi of the lof greets you calmly from her rewe. First introduce yourself to the lonko, as is proper; then she will have something to ask of you.')]);
  if(S.flags['mqd_'+r]){
    S.flags['mq_done_'+r]=1;q.reward();persist();sfx('lvl');
    return say([q.thanks,q.after,q.give]);
  }
  if(S.flags['mql_'+r])return say([q.remind]);
  if(S.flags['mq_'+r])return say([q.ask]);
  S.flags['mq_'+r]=1;persist();
  say([L('Machi','Mari mari, '+nm()+'. Iñche machi.','Hola, '+nm()+'. Yo soy machi.','Hello, '+nm()+'. I am a machi.'),
    N('La machi es quien sana y quien guía las ceremonias del lof. Junto a ella se alza su rewe, el tronco tallado con escalones que la une con los espíritus.','The machi is the one who heals and who guides the ceremonies of the lof. Beside her rises her rewe, the carved stepped trunk that joins her to the spirits.')]
    .concat(q.prob,[q.ask]));
}
function reweTalk(){
  say([L('','Rewe','El rewe de la machi: un tronco tallado con escalones, plantado en la tierra, con ramas de foye amarradas. Es su altar y su escalera hacia los espíritus. Se le tiene respeto.','The machi\'s rewe: a carved trunk with steps, planted in the earth, with foye branches tied to it. It is her altar and her ladder to the spirits. It is treated with respect.')]);
}

function digFind(dk,dv){
  S.flags['dig:'+CUR+':'+dk]=1;
  if(dv&&dv.what==='pali'){S.flags.laf_palid=1;S.gold+=20;persist();sfx('lvl');
    return say([N('Entre el pasto alto aparece una bola de madera pulida: ¡la pali!','In the tall grass you find a polished wooden ball: the pali!'),
      L('','Pali!','La pali de la niña del lof. Te dará las gracias... y encuentras epu mari (20) ngülliw enterrados con ella.','The girl\'s pali. She will thank you... and you find epu mari (20) ngülliw buried with it.')]);}
  if(dv&&dv.what==='pichun'){S.flags.puel_pichd=1;S.gold+=20;persist();sfx('lvl');
    return say([N('Entre el pasto pisado aparece una pluma larga y gris, atada con un hilo rojo: ¡la pluma de choyke!','In the trampled grass you find a long grey feather tied with a red thread: the choyke plume!'),
      L('','Choyke pichuñ!','La pluma del niño del lof. Te dará las gracias... y encuentras epu mari (20) ngülliw enterrados debajo.','The boy\'s plume. He will thank you... and you find epu mari (20) ngülliw buried beneath it.')]);}
  if(dv&&dv.what==='pearl'){S.flags.ch_pearl=1;persist();sfx('lvl');
    return say([N('Escarbas en la arena del fondo... y una luz blanca y redonda te mira desde abajo: ¡la lüq kura, la perla del pequeño chumpall!','You dig in the sand of the deep... and a round white light looks up at you: the lüq kura, the little chumpall\'s pearl!'),
      L('','Lüq kura!','La perla canta bajito en tu mano. Llévasela a su dueño, en los jardines.','The pearl sings softly in your hand. Take it back to its owner, in the gardens.')]);}
  if(dv&&dv.what==='trutruka'){S.gear.trutruka=1;persist();sfx('lvl');
    return say([N('Entre los juncos mojados aparece una larga corneta de coligüe con un cuerno en la punta...','Among the wet reeds appears a long colihue horn with a cow horn at its tip...'),
      L('','Trutruka!','¡Encontraste la trutruka! En las peleas podrás tocarla: su sonido aturde a todos los wekufü (una vez por pelea). Cuéntale al trutrukatufe.','You found the trutruka! In battle you can blow it: its blast stuns all the wekufü (once per fight). Tell the trutrukatufe.')]);}
  if(dv&&dv.what==='foye'){S.flags.mqd_laf=1;persist();sfx('lvl');
    return say([N('Un árbol de hojas verdes claras y corteza clara. Al quebrar una hoja, el aire se llena de un olor picante y limpio: es el foye. Pides permiso, como te enseñaron, y sacas unas pocas hojas.','A tree with light green leaves and pale bark. When you snap a leaf, the air fills with a clean, peppery scent: it is the foye. You ask its leave, as you were taught, and take a few leaves.'),
      L('','Foye tapül!','Llevas hojas de foye para la machi.','You carry foye leaves for the machi.')]);}
  if(dv&&dv.what==='menokoko'){S.flags.mqd_nag=1;persist();sfx('lvl');
    return say([N('Hundes el metawe del lonko en el agua quieta del rincón del amanecer. El agua entra fría y clara, sin una hoja, sin un barro.','You sink the lonko\'s metawe into the still water of the sunrise corner. The water runs in cold and clear, without a leaf, without a trace of mud.'),
      L('','Menoko ko!','Llevas agua del menoko para la machi.','You carry menoko water for the machi.')]);}
  if(dv&&dv.what==='ngulliw'){S.flags.mqd_pew=1;persist();sfx('lvl');
    return say([N('Entre los troncos más viejos, donde apenas entra la luz, el suelo está alfombrado de ngülliw. Recoges solo los que están caídos, como pidió la machi, y le das las gracias a la abuela pewen.','Among the oldest trunks, where the light barely enters, the ground is carpeted with ngülliw. You gather only the fallen ones, as the machi asked, and thank the grandmother pewen.'),
      L('','Ngülliw!','Llevas piñones de la abuela pewen para la machi.','You carry ngülliw from the grandmother pewen for the machi.')]);}
  if(dv&&dv.what==='trayenko'){S.flags.mqd_wil=1;persist();sfx('lvl');
    return say([N('Al pie del salto el agua truena y la espuma te moja la cara. Llenas el yiwe del lonko donde el agua golpea la piedra: trayenko, agua que cae con newen.','At the foot of the falls the water thunders and the spray wets your face. You fill the lonko\'s yiwe where the water strikes the rock: trayenko, water that falls with newen.'),
      L('','Trayen ko!','Llevas agua del salto para la machi.','You carry waterfall water for the machi.')]);}
  if(dv&&dv.what==='chadi'){S.flags.mqd_puel=1;persist();sfx('lvl');
    return say([N('Junto al chacay solo, el suelo se quiebra en costras blancas. Escarbas y juntas chadi, la sal de la tierra, como la juntaban los antiguos en el camino de la sal.','By the lone chacay the ground breaks into white crusts. You dig and gather chadi, the salt of the earth, as the old people gathered it on the salt path.'),
      L('','Chadi!','Llevas sal de la tierra para la machi.','You carry salt of the earth for the machi.')]);}
  if(dv&&dv.what==='piwke'){persist();sfx('lvl');
    return gainPiwke([N('Escarbas la tierra justo aquí... ¡hay algo enterrado!','You dig right here... something is buried!'),praise()]);}
  S.gold+=50;S.items.kofke++;persist();sfx('lvl');
  say([N('Escarbas la tierra justo aquí... ¡hay algo enterrado!','You dig right here... something is buried!'),praise(),
    L('','Kechu mari ngülliw!','Un cántaro antiguo con kechu mari (50) ngülliw y un kofke.','An old jug with kechu mari (50) ngülliw and a kofke.')]);
}
function shepTalk(){
  const en=S.gloss==='en';
  if(S.flags.sheep)return say([L('Pichi domo','Kayu ofisa nien. Chaltu may!','Tengo seis ovejas. ¡Gracias!','I have six sheep. Thank you!')]);
  say([L('Pichi domo','Mari mari, '+addr(true)+'! Weñimkefiñ ofisa.','¡Hola! Yo cuido ovejas.','Hello! I take care of sheep.'),
    N('Desde que llegó el Witranalwe no me salen las cuentas. ¿Me ayudas a contarlas? Están todas en el corral.','Since the Witranalwe came I keep losing count. Will you help me count them? They are all in the pen.')],ask);
  function ask(){const o=['kechu','kayu','regle','pura'].map(m=>({m,v:m}));for(let a=3;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(L('Pichi domo','Chumten ofisa nien?','¿Cuántas ovejas tengo?','How many sheep do I have?'),o.concat([{m:'Pewkayal',g:en?'(count first)':'(contar primero)',v:'x'}]),v=>{
      if(!v||v==='x')return;
      if(v==='kayu'){S.flags.sheep=1;S.items.kulon+=2;S.gold+=20;persist();sfx('lvl');
        return say([praise(),L('Pichi domo','Kayu ofisa! Chaltu may!','¡Seis ovejas! ¡Gracias!','Six sheep! Thank you!'),L('','Epu külon · epu mari ngülliw','Te da dos külon y epu mari (20) ngülliw.','She gives you two külon and epu mari (20) ngülliw.')])}
      sfx('bad');say([L('Pichi domo','Fey no...','Eso no...','Not that...'),N('Mira bien el corral y cuenta otra vez.','Look carefully at the pen and count again.')])},true,true)}
}
function nFisherTalk(){
  const en=S.gloss==='en';
  if(S.flags.nfish)return say([L('Challwafe','Wüle ka challwatumean.','Mañana voy a pescar otra vez.','Tomorrow I will fish again.')]);
  const qs=[{q:L('Challwafe','Wüle iñche ___','Mañana yo iré.'+rh('amu'),'Tomorrow I will go.'+rh('amu')),o:['amun','amuan','amuay'],a:'amuan'},
    {q:L('Challwafe','Eymi ___','Tú sabrás.'+rh('kim'),'You will know.'+rh('kim')),o:['kimimi','kiman','kimaymi'],a:'kimaymi'},
    {q:L('Challwafe','Fey ___','Él va a pescar.'+rh('challwatu'),'He will fish.'+rh('challwatu')),o:['challwatuay','challwatuy','challwatuan'],a:'challwatuay'}];
  say([L('Challwafe','Mari mari, '+addr(false)+'. Challwatulen.','Hola. Estoy pescando.','Hello. I am fishing.'),
    N('El pescador quiere hablar de lo que vendrá, pero las palabras se le escapan como peces. Ayúdalo a terminar los verbos: todo lo que todavía no pasa.','The fisherman wants to talk about what is to come, but the words slip away from him like fish. Help him finish the verbs: everything that has not happened yet.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.nfish=1;S.items.lawen+=2;S.gold+=20;S.xp+=4;persist();sfx('lvl');
      return say([praise(),L('Challwafe','Chaltu may! Wüle ka challwatumean.','¡Gracias! Mañana voy a pescar otra vez.','Thank you! Tomorrow I will fish again.'),N('Te da dos lawen y epu mari (20) ngülliw. +4 kimün.','He gives you two lawen and epu mari (20) ngülliw. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];choose(q.q,q.o.map(o=>({m:o,v:o})).concat([{m:'Chillka',g:en?'Check the book':'Consultar el libro',v:'_book'}]),v=>{
      if(v==='_book')return openBook(()=>ask(i));
      if(trk('pasado y futuro',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Challwafe','Fey no...','Eso no...','Not that...'),N('Piensa: ¿ya pasó, o todavía no?','Think: has it already happened, or not yet?')],()=>ask(0))}},false,false)}
}
function goTitle(){
  persist();active=null;menu.style.display='none';dlg.style.display='none';banner.style.display='none';B=null;
  mode='title';$('title').style.display='';$('bCont').style.display='';AU.name=null;playSong('intro');
}

/* ================= PEWENCHE ================= */
function lakuTalk(){
  if(!S.flags.laku){S.flags.laku=1;S.gold+=20;persist();sfx('pick');
    return say([L('Laku','Mari mari, '+nm()+'! Iñche tami laku.','¡Hola, '+nm()+'! Soy tu laku.','Hello, '+nm()+'! I am your laku.'),
      N('Tu laku es el papá de tu papá. Subió a la cordillera para la cosecha de ngülliw.','Your laku is your father\'s father. He came up to the mountains for the ngülliw harvest.'),
      L('Laku','Tüfa ta ngülliw: pewen ñi fün.','Esto es ngülliw: el fruto del pewen.','This is ngülliw: the fruit of the pewen.'),
      N('Los ngülliw que has juntado en tu viaje son estos piñones. Con ellos se hace trafkintu: se intercambian cosas. Tu laku te regala epu mari (20).','The ngülliw you have gathered on your journey are these pewen nuts. With them people do trafkintu: they exchange things. Your laku gives you epu mari (20).'),
      L('Laku','Chem pimi? Iney eymi? Chew amuaymi?','¿Qué dijiste? ¿Quién eres tú? ¿A dónde irás?','What did you say? Who are you? Where will you go?'),
      N('Así se pregunta: chem (qué), iney (quién), chew (dónde), chumül (cuándo), chumten (cuánto). Tu chillka las tiene en «Chem, iney, chew».','This is how you ask: chem (what), iney (who), chew (where), chumül (when), chumten (how much). Your chillka has them under «Chem, iney, chew».'),
      L('Laku','Lonko mew amunge. Kütral mew inaltuley.','Ve donde el lonko. Está junto al kütral.','Go to the lonko. He is by the fire.')]);}
  const ls=[L('Laku','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!')];
  if(S.flags.ngen3)ls.push(L('Laku','Ngen-pewen nepey! Ayüwkülen.','¡Ngen-pewen despertó! Estoy feliz.','Ngen-pewen has woken up! I am happy.'));
  else ls.push(N('El pillañ (el volcán) queda al este, pasando el bosque de pewenes y los campos de nieve.','The pillañ (the volcano) lies to the east, past the pewen forest and the snowfields.'));
  say(ls);
}
function pLonkoTalk(){
  if(S.flags.mql_pew&&!S.flags.mqd_pew)return say([L('Lonko','Machi ñi dungu.','Lo de la machi.','The machi\'s errand.'),N('«¿La abuela pewen? En el bosque de abajo de Pewen mapu, en lo más tupido: el único pewen con ngülliw regados a sus pies.»','"The grandmother pewen? In the lower forest of Pewen mapu, where it grows thickest: the only pewen with ngülliw scattered at its feet."')]);
  if(S.flags.mq_pew&&!S.flags.mql_pew){S.flags.mql_pew=1;persist();sfx('lvl');
    return say([L('Lonko','Machi ñi dungu? Kümey.','¿Un encargo de la machi? Bien.','An errand from the machi? Good.'),
      N('«La abuela pewen. Mi familia la ha cuidado por generaciones: está en el bosque de abajo de Pewen mapu, en lo más tupido, donde apenas entra la luz. Recoge solo los ngülliw caídos y dale las gracias. Llevas mi palabra.» La machi guía el llellipun y el lonko abre el camino: los dos sostienen el lof.','"The grandmother pewen. My family has watched over her for generations: she stands in the lower forest of Pewen mapu, where it grows thickest, where the light barely enters. Gather only the fallen ngülliw and thank her. You carry my word." The machi guides the llellipun and the lonko opens the way: the two of them hold up the lof.'),
      L('Lonko','Amupunge, '+nm()+'.','Ve, '+nm()+'.','Go, '+nm()+'.')]);}
  if(S.flags.pew_lonko){
    const ls=[L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.')];
    if(S.flags.ngen3)ls.push(L('Lonko','Ngen-pewen nepey. Chaltu may!','Ngen-pewen despertó. ¡Gracias!','Ngen-pewen has woken up. Thank you!'),
      N('Ya llevas tres trariwe trokiñ. Dicen que en el sur, en tierras williche, y al otro lado de la cordillera, en Puelmapu, esperan los últimos.','You now carry three trariwe trokiñ. They say the last ones wait in the south, in Williche lands, and across the mountains, in Puelmapu.'),
      N('El camino al sur: baja de vuelta al oeste hasta el Lewfü, el río, y desde allí toma la salida del sur: el Williche rüpü lleva al este hasta el lof williche.','The way south: go back west down to the Lewfü, the river, and from there take the southern exit: the Williche rüpü leads east to the Williche lof.'));
    else ls.push(L('Lonko','Pillañ mew amunge.','Ve al volcán.','Go to the volcano.'),N('Pasando el bosque de pewenes y los campos de nieve está el pillañ. La morada del Cherufe está adentro.','Past the pewen forest and the snowfields is the pillañ. The Cherufe\'s lair is inside.'),
      N('Y en este lof las puertas están abiertas: entra en las rukas. La papay Rayen y el chachay Nawel siempre reciben visitas.','And in this lof the doors are open: go into the rukas. Papay Rayen and chachay Nawel always welcome visitors.'));
    return say(ls);
  }
  const steps=[
    {q:L('Lonko','Mari mari, '+nm()+'. Chumleymi?','Hola, '+nm()+'. ¿Cómo estás?','Hello, '+nm()+'. How are you?'),
     o:[{m:'Kümelen. Eymi kay?',es:'Estoy bien. ¿Y tú?',en:'I am well. And you?',ok:1},{m:'Kümeleyngün.',es:'Ellos están bien.',en:'They are well.'},{m:'Chumleymi?',es:'¿Cómo estás?',en:'How are you?'}]},
    {q:L('Lonko','Iñche ka kümelen. Chew tuwimi?','Yo también estoy bien. ¿De dónde eres?','I am well too. Where are you from?'),
     o:[{m:'Santiago waria mew tuwün.',es:'Vengo de la ciudad de Santiago.',en:'I come from the city of Santiago.',ok:1},{m:'Chew tuwimi?',es:'¿De dónde eres tú?',en:'Where are you from?'},{m:'Pewen mapu tuwimi.',es:'Tú vienes de la tierra de los pewenes.',en:'You come from the land of the pewen trees.'}]},
    {q:L('Lonko','Chumleyngün tami pu che?','¿Cómo está tu gente?','How are your people?'),
     o:[{m:'Kümeleyngün.',es:'Ellos están bien.',en:'They are well.',ok:1},{m:'Kümelen.',es:'Yo estoy bien.',en:'I am well.'},{m:'Kümeleymi.',es:'Tú estás bien.',en:'You are well.'}]}];
  say([N('El lonko pewenche se levanta para saludarte. Recuerda el pentukuwün.','The Pewenche lonko stands up to greet you. Remember the pentukuwün.')],()=>step(0));
  function step(i){
    if(i>=steps.length)return done();
    const s=steps[i],en=S.gloss==='en';
    const opts=s.o.map((o,k)=>({m:o.m,g:S.hints?(en?o.en:o.es):'',v:k}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(s.q,opts,v=>{if(s.o[v].ok)say([praise()],()=>step(i+1));else{sfx('bad');say([N('El lonko espera, en silencio. Piensa en lo que te preguntó.','The lonko waits in silence. Think about what he asked you.')],()=>step(i))}},false,true);
  }
  function done(){
    S.flags.pew_lonko=1;learnRoot('trafo');S.items.kulon++;persist();sfx('lvl');
    say([L('Lonko','Kümey! Ngen-lafken ka Ngen-mawida nepeyngu, pikeyngün.','¡Bien! Dicen que Ngen-lafken y Ngen-mawida despertaron.','Good! They say Ngen-lafken and Ngen-mawida have woken up.'),
      L('Lonko','Welu Ngen-pewen umawtuley.','Pero Ngen-pewen está dormido.','But Ngen-pewen is asleep.'),
      N('Un Cherufe, un gigante de roca y lava, salió del pillañ. Su calor seca los pewenes y la nieve se vuelve dura como piedra. Desde entonces hay menos ngülliw y la gente olvida las palabras.','A Cherufe, a giant of rock and lava, came out of the pillañ. Its heat dries the pewen trees and the snow turns hard as stone. Since then there are fewer ngülliw and people forget the words.'),
      L('Lonko','Trafo- kimeltueyu.','Te enseño trafo- ("quebrarse").','I teach you trafo- ("break").'),
      N('Con trafonge, trafomu o trafomün se quiebra la coraza de piedra de los wekufü. Recibiste trafo- y un külon.','With trafonge, trafomu or trafomün the stone crust of the wekufü cracks. You received trafo- and a külon.'),
      L('Lonko','Pillañ mew amunge, '+nm()+'.','Ve al volcán, '+nm()+'.','Go to the volcano, '+nm()+'.')]);
  }
}
function pNutramTalk(){
  say([L('Nütramkafe','Mari mari, '+addr(true)+'. Nütramkayaiñ?','Hola. ¿Conversamos?','Hello. Shall we talk?'),
    L('Nütramkafe','Kuyfi, pillañ mew mülefuy kiñe Cherufe.','Hace mucho tiempo, en el volcán había un Cherufe.','Long ago, in the volcano, there was a Cherufe.'),
    L('Nütramkafe','Kütral ka kura ngefuy.','Era de fuego y de piedra.','It was made of fire and stone.'),
    L('Nütramkafe','Pu che llükakefuy.','La gente le tenía miedo.','People used to fear it.'),
    N('Dicen que los golpes rebotan en su piedra, y que su fuego quema a quien lo toca. Pero la piedra se quiebra, y el fuego se apaga con el frío.','They say blows bounce off its stone, and its fire burns whoever touches it. But stone cracks, and fire goes out in the cold.')]);
}
function gathTalk(){
  say([L('Domo','Fentren ngülliw müley!','¡Hay muchos piñones!','There are lots of pewen nuts!'),
    N('Las mujeres juntan los ngülliw que caen de los pewenes. Este año caen pocos: el calor del Cherufe seca los árboles.','The women gather the nuts that fall from the pewen trees. This year few are falling: the Cherufe\'s heat dries the trees.')]);
}
function arrieroTalk(){
  const en=S.gloss==='en';
  if(S.flags.pew_ngu1&&!S.flags.pew_ngu2){S.flags.pew_ngu2=1;persist();sfx('lvl');
    return say([N('Le entregas los ngülliw tostados de la papay Rayen.','You hand him papay Rayen\'s toasted pewen nuts.'),
      L('Wentru','Chaltu may! Kümey ngülliw!','¡Gracias! ¡Qué ricos piñones!','Thank you! What good pewen nuts!'),
      L('Wentru','Allkütunge: pewen mapu mew, epu fütra pewen müley, willi püle rüpü mew.','Escucha: en el bosque hay dos pewenes gemelos, al sur del camino.','Listen: in the forest there are two twin pewen trees, south of the road.'),
      N('«Mis caballos siempre escarban justo entre esos dos árboles. Algo brilla ahí abajo. Busca justo en medio.»','"My horses always paw at the ground right between those two trees. Something shines down there. Search right in the middle."')]);}
  if(S.flags.pew_ke)return say([L('Wentru','Kawelltuken. Pewkayal!','Yo ando a caballo (siempre, de costumbre). ¡Hasta luego!','I ride on horseback (always, as a habit). See you later!')]);
  const qs=[{q:L('Wentru','Pu pewenche ___','Los pewenche comen piñones (siempre, de costumbre).'+rh('ngülliwtu'),'The Pewenche eat pewen nuts (always, as a habit).'+rh('ngülliwtu')),o:['ngülliwtuyngün','ngülliwtukeyngün','ngülliwtukey'],a:'ngülliwtukeyngün'},
    {q:L('Wentru','Iñche ___','Yo hablo mapudungun (siempre, de costumbre).'+rh('mapudungu'),'I speak Mapudungun (always, as a habit).'+rh('mapudungu')),o:['mapudungun','mapudunguken','mapudungukey'],a:'mapudunguken'},
    {q:L('Wentru','Eymi ___','Tú andas a caballo (siempre, de costumbre).'+rh('kawelltu'),'You ride on horseback (always, as a habit).'+rh('kawelltu')),o:['kawelltuymi','kawelltukeymi','kawelltuken'],a:'kawelltukeymi'}];
  say([L('Wentru','Mari mari, '+addr(false)+'. Kawelltuken.','Hola. Yo ando a caballo (siempre, de costumbre).','Hello. I ride on horseback (always, as a habit).'),
    N('-ke- dice lo que alguien hace siempre, por costumbre. El arriero quiere ver si lo entiendes. Tu chillka lo explica en «-ke-».','-ke- says what someone always does, as a habit. The muleteer wants to see if you understand. Your chillka explains it under «-ke-».')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.pew_ke=1;S.items.kofke+=2;S.gold+=30;S.xp+=4;persist();sfx('lvl');
      return say([praise(),L('Wentru','Kümey! Mapudungukeymi!','¡Bien! ¡Hablas mapudungun!','Good! You speak Mapudungun!'),N('Te da dos kofke y küla mari (30) ngülliw. +4 kimün.','He gives you two kofke and küla mari (30) ngülliw. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];choose(q.q,q.o.map(o=>({m:o,v:o})).concat([{m:'Chillka',g:en?'Check the book':'Consultar el libro',v:'_book'}]),v=>{
      if(v==='_book')return openBook(()=>ask(i));
      if(trk('personas y -ke-',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Wentru','Fey no...','Eso no...','Not that...'),N('Piensa: ¿quién lo hace, y lo hace siempre?','Think: who does it, and do they always do it?')],()=>ask(0))}},false,false)}
}
function papayTalk(){
  say([L('Papay','Mari mari, '+addr(true)+'. Chumleymi?','Hola. ¿Cómo estás?','Hello. How are you?'),L(nm(),'Kümelen. Eymi kay?','Estoy bien. ¿Y tú?','I am well. And you?'),L('Papay','Iñche ka kümelen.','Yo también estoy bien.','I am well too.')]);
}
function trutTalk(){
  say([L('Weche wentru','Trutruka ayüken.','Me gusta la trutruka.','I love the trutruka.'),N('La trutruka es un instrumento largo de colihue con un cuerno en la punta. Suena en las ceremonias y en las fiestas.','The trutruka is a long instrument made of colihue cane with a horn at the end. It sounds at ceremonies and celebrations.')]);
}
function kona3Talk(){
  if(S.flags.ngen3)return say([L('Kona','Amutuy Cherufe! Ayüwkülen!','¡Se fue el Cherufe! ¡Qué feliz estoy!','The Cherufe has gone! I am so happy!')]);
  say([L('Kona','Cherufe müley pillañ mew. Kütralngey ka kurangey!','El Cherufe está en el volcán. ¡Es fuego y es piedra!','The Cherufe is in the volcano. It is fire and it is stone!'),
    N('La entrada está entre las rocas, subiendo al este. Dicen que adentro hay piedras con números muy grandes y otra que hace preguntas.','The entrance is among the rocks, up to the east. They say inside there are stones with very big numbers and another one that asks questions.')]);
}

/* ================= WILLICHE ================= */
function checheTalk(){
  if(!S.flags.cheche){S.flags.cheche=1;S.gold+=30;persist();sfx('pick');
    return say([L('Cheche','Mari mari, '+nm()+'! Iñche tami cheche.','¡Hola, '+nm()+'! Soy tu cheche.','Hello, '+nm()+'! I am your cheche.'),
      N('Tu cheche es el papá de tu mamá. Vive aquí en el sur, junto al lago, donde nació.','Your cheche is your mother\'s father. He lives here in the south, by the lake, where he was born.'),
      L('Cheche','Kimniefimi tami pu che?','¿Conoces a tu familia?','Do you know your family?'),
      N('Por el lado de tu papá están tu kuku y tu laku; por el lado de tu mamá, tu chuchu y tu cheche. Ya conociste a los cuatro. Tu chillka lo tiene en «Pu che».','On your father\'s side are your kuku and your laku; on your mother\'s side, your chuchu and your cheche. Now you have met all four. Your chillka has it under «Pu che».'),
      N('Tu cheche te regala küla mari (30) ngülliw.','Your cheche gives you küla mari (30) ngülliw.'),
      L('Cheche','Lonko mew amunge. Kütral mew inaltuley.','Ve donde el lonko. Está junto al kütral.','Go to the lonko. He is by the fire.')]);}
  const ls=[L('Cheche','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!')];
  if(S.flags.ngen4)ls.push(L('Cheche','Ngen-kürüf nepey! Ayüwkülen.','¡Ngen-kürüf despertó! Estoy feliz.','Ngen-kürüf has woken up! I am happy.'));
  else ls.push(N('Los acantilados donde se esconde el Kaleuche quedan al este, pasando el bosque de alerces y la costa.','The cliffs where the Kaleuche hides lie to the east, past the alerce forest and the coast.'));
  say(ls);
}
function wLonkoTalk(){
  if(S.flags.mql_wil&&!S.flags.mqd_wil)return say([L('Lonko','Machi ñi dungu.','Lo de la machi.','The machi\'s errand.'),N('«¿El trayenko? Desde el Lawal mawida, la tierra agrietada del borde sur baja a la garganta. Llena el yiwe al pie del salto, por el lado derecho, donde el agua golpea la piedra.»','"The trayenko? From the Lawal mawida, the cracked ground at the southern edge leads down into the gorge. Fill the yiwe at the foot of the falls, on the right-hand side, where the water strikes the rock."')]);
  if(S.flags.mq_wil&&!S.flags.mql_wil){S.flags.mql_wil=1;persist();sfx('lvl');
    return say([L('Lonko','Machi ñi dungu? Kümey.','¿Un encargo de la machi? Bien.','An errand from the machi? Good.'),
      N('El lonko descuelga de su cinto un vaso de madera tallada, oscuro y liviano. «Mi yiwe. Llénalo al pie del salto de Trayen mapu, donde el agua golpea la piedra, por el lado derecho. La garganta es brava: ten cuidado. La machi pide y yo pongo: así cuidamos este lof entre los dos.»','The lonko unhooks from his belt a carved wooden cup, dark and light in the hand. "My yiwe. Fill it at the foot of the falls in Trayen mapu, where the water strikes the rock, on the right-hand side. The gorge is fierce: take care. The machi asks and I provide: that is how the two of us care for this lof."'),
      L('Lonko','Amupunge, '+nm()+'.','Ve, '+nm()+'.','Go, '+nm()+'.')]);}
  if(S.flags.wil_lonko){
    const ls=[L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.')];
    if(S.flags.ngen4)ls.push(L('Lonko','Ngen-kürüf nepey. Chaltu may!','Ngen-kürüf despertó. ¡Gracias!','Ngen-kürüf has woken up. Thank you!'),
      N('Ya llevas cuatro trariwe trokiñ. El último está en Puelmapu, al otro lado de la cordillera.','You now carry four trariwe trokiñ. The last one is in Puelmapu, on the other side of the mountains.'),
      N('El camino: vuelve al lof pewenche y sigue al este por Pewen mapu y Pire mapu; en los campos de nieve sube al norte hasta Wente degiñ, el paso, y baja al este por el Puel rüpü hasta el lof puelche.','The way: return to the Pewenche lof and keep east through Pewen mapu and Pire mapu; from the snowfields climb north to Wente degiñ, the pass, and descend east along the Puel rüpü to the Puelche lof.'));
    else ls.push(L('Lonko','Inaltu lafken amunge.','Ve a los acantilados de la costa.','Go to the cliffs by the sea.'),N('Pasando el bosque de alerces y la costa están los acantilados. La cueva del Kaleuche está bajando por las rocas.','Past the alerce forest and the coast are the cliffs. The Kaleuche\'s cave is down among the rocks.'));
    return say(ls);
  }
  const steps=[
    {q:L('Lonko','Mari mari, '+nm()+'. Chumleymi?','Hola, '+nm()+'. ¿Cómo estás?','Hello, '+nm()+'. How are you?'),
     o:[{m:'Kümelen. Eymi kay?',es:'Estoy bien. ¿Y tú?',en:'I am well. And you?',ok:1},{m:'Kümeleyngün.',es:'Ellos están bien.',en:'They are well.'},{m:'Iney eymi?',es:'¿Quién eres tú?',en:'Who are you?'}]},
    {q:L('Lonko','Iñche ka kümelen. Chew tuwimi?','Yo también estoy bien. ¿De dónde eres?','I am well too. Where are you from?'),
     o:[{m:'Santiago waria mew tuwün.',es:'Vengo de la ciudad de Santiago.',en:'I come from the city of Santiago.',ok:1},{m:'Chumül tuwimi?',es:'¿Cuándo vienes?',en:'When do you come?'},{m:'Willi mapu tuwimi.',es:'Tú vienes del sur.',en:'You come from the south.'}]},
    {q:L('Lonko','Chumleyngün tami pu che?','¿Cómo está tu gente?','How are your people?'),
     o:[{m:'Kümeleyngün.',es:'Ellos están bien.',en:'They are well.',ok:1},{m:'Kümelen.',es:'Yo estoy bien.',en:'I am well.'},{m:'Kümeleymi.',es:'Tú estás bien.',en:'You are well.'}]}];
  say([N('El lonko williche se levanta para saludarte. Recuerda el pentukuwün.','The Williche lonko stands up to greet you. Remember the pentukuwün.')],()=>step(0));
  function step(i){
    if(i>=steps.length)return done();
    const s=steps[i],en=S.gloss==='en';
    const opts=s.o.map((o,k)=>({m:o.m,g:S.hints?(en?o.en:o.es):'',v:k}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(s.q,opts,v=>{if(s.o[v].ok)say([praise()],()=>step(i+1));else{sfx('bad');say([N('El lonko espera, en silencio. Piensa en lo que te preguntó.','The lonko waits in silence. Think about what he asked you.')],()=>step(i))}},false,true);
  }
  function done(){
    S.flags.wil_lonko=1;learnRoot('lef');S.items.kulon++;persist();sfx('lvl');
    say([L('Lonko','Kümey! Küla ngen nepeyngün, pikeyngün.','¡Bien! Dicen que tres ngen despertaron.','Good! They say three ngen have woken up.'),
      L('Lonko','Welu Ngen-kürüf umawtuley.','Pero Ngen-kürüf está dormido.','But Ngen-kürüf is asleep.'),
      N('Sin viento, la niebla no se va. Dentro de ella navega el Kaleuche, un barco de kalku que se lleva a la gente. Desde entonces la niebla cubre el sur y la gente habla cada vez menos.','Without wind, the fog does not leave. Inside it sails the Kaleuche, a kalku ship that carries people away. Since then the fog covers the south and people speak less and less.'),
      L('Lonko','Lef- kimeltueyu.','Te enseño lef- ("correr").','I teach you lef- ("run").'),
      N('Con lefnge, lefmu o lefmün, los wekufü que ya están débiles (la mitad de su fuerza o menos) salen corriendo y no vuelven. Recibiste lef- y un külon.','With lefnge, lefmu or lefmün, wekufü that are already weak (half their strength or less) run off and do not come back. You received lef- and a külon.'),
      L('Lonko','Inaltu lafken amunge, '+nm()+'.','Ve a los acantilados, '+nm()+'.','Go to the cliffs, '+nm()+'.')]);
  }
}
function wNutramTalk(){
  say([L('Nütramkafe','Mari mari, '+addr(false)+'. Nütramkayaiñ?','Hola. ¿Conversamos?','Hello. Shall we talk?'),
    L('Nütramkafe','Kuyfi, lafken mew amukefuy kiñe Kaleuche.','Hace mucho tiempo, por el mar andaba un Kaleuche.','Long ago, a Kaleuche went about on the sea.'),
    L('Nütramkafe','Pun mew pengekefuy.','De noche se lo veía.','At night it could be seen.'),
    L('Nütramkafe','Fütra wampo ngefuy.','Era un barco grande.','It was a big boat.'),
    N('Dicen que va lleno de luces y de música, y que se esconde en la niebla cuando alguien lo mira. Pero lo que se esconde sale cuando se le dice.','They say it is full of lights and music, and that it hides in the fog when someone looks at it. But what hides comes out when it is told to.')]);
}
function wFisherTalk(){
  say([L('Challwafe','Wampo mew challwatuken.','Pesco en mi wampo (canoa).','I fish from my wampo (canoe).'),
    N('Desde que llegó la niebla, casi no hay peces. Dicen que el Kaleuche se los lleva.','Since the fog came there are hardly any fish. They say the Kaleuche takes them.')]);
}
function timeTalk(){
  const en=S.gloss==='en';
  if(S.flags.wil_time)return say([L('Challwafe','Wüle ka challwatumean. Pewkayal!','Mañana vuelvo a pescar. ¡Hasta luego!','Tomorrow I will fish again. See you later!')]);
  const qs=[{q:L('Challwafe','Wiya iñche ___','Ayer pesqué.'+rh('challwatu'),'Yesterday I fished.'+rh('challwatu')),o:['challwatuan','challwatun','challwatuy'],a:'challwatun'},
    {q:L('Challwafe','Wüle iñche ___','Mañana pescaré.'+rh('challwatu'),'Tomorrow I will fish.'+rh('challwatu')),o:['challwatun','challwatuy','challwatuan'],a:'challwatuan'},
    {q:L('Challwafe','Fachantü eymi ___','Hoy viniste.'+rh('küpa'),'Today you came.'+rh('küpa')),o:['küpaymi','küpayaymi','küpan'],a:'küpaymi'}];
  say([L('Challwafe','Mari mari, '+addr(true)+'. Wiya, fachantü, wüle...','Hola. Ayer, hoy, mañana...','Hello. Yesterday, today, tomorrow...'),
    N('La pescadora mezcla los días desde que llegó la niebla. Ayúdala: wiya es ayer, fachantü es hoy y wüle es mañana. Lo que ya pasó no lleva -a-; lo que todavía no pasa, sí.','The fisherwoman mixes up the days since the fog came. Help her: wiya is yesterday, fachantü is today and wüle is tomorrow. What already happened has no -a-; what has not happened yet does.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.wil_time=1;S.items.lawen++;S.items.kofke++;S.gold+=30;S.xp+=4;persist();sfx('lvl');
      return say([praise(),L('Challwafe','Chaltu may!','¡Gracias!','Thank you!'),N('Te da un lawen, un kofke y küla mari (30) ngülliw. +4 kimün.','She gives you a lawen, a kofke and küla mari (30) ngülliw. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];choose(q.q,q.o.map(o=>({m:o,v:o})).concat([{m:'Chillka',g:en?'Check the book':'Consultar el libro',v:'_book'}]),v=>{
      if(v==='_book')return openBook(()=>ask(i));
      if(trk('pasado y futuro',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Challwafe','Fey no...','Eso no...','Not that...'),N('Piensa: ¿ya pasó, o todavía no?','Think: has it already happened, or not yet?')],()=>ask(0))}},false,false)}
}
function kona4Talk(){
  if(S.flags.ngen4)return say([L('Kona','Amutuy Kaleuche! Ayüwkülen!','¡Se fue el Kaleuche! ¡Qué feliz estoy!','The Kaleuche has gone! I am so happy!')]);
  say([L('Kona','Kaleuche müley lafken mew! Pun mew pengekey.','¡El Kaleuche está en el mar! De noche se ve.','The Kaleuche is at sea! At night it can be seen.'),
    N('La cueva baja por las rocas, aquí al lado. Dicen que adentro hay braseros de colores y una piedra que habla de lo que no pasará.','The cave goes down through the rocks, right here. They say inside there are colored braziers and a stone that talks about what will not happen.')]);
}

/* ================= PUELMAPU ================= */
function werkenTalk(){
  if(S.flags.ngen5)return say([L('Werken','Ngen-lelfün nepey! Kom mapu ayüwküley.','¡Ngen-lelfün despertó! Toda la tierra está contenta.','Ngen-lelfün has woken up! The whole land is glad.')]);
  say([L('Werken','Mari mari, '+addr(false)+'! Iñche werken ngen.','¡Hola! Soy werken (mensajero).','Hello! I am a werken (messenger).'),
    N('Llevo mensajes entre las comunidades, a caballo. Esta bajada lleva a Puelmapu, la tierra del este, al otro lado de la cordillera: la pampa abierta.','I carry messages between the communities, on horseback. This slope leads down to Puelmapu, the land of the east, on the far side of the mountains: the open plain.'),
    L('Werken','Puel mapu mew müley tami weku.','En la tierra del este está tu weku.','In the eastern land is your weku.'),
    N('Tu weku es el hermano de tu mamá: un tío muy importante. Vive en el lof puelche, siguiendo el camino. Pero cuídate: el pasto se está secando y el ganado huye. Algo malo anda en la pampa.','Your weku is your mother\'s brother: a very important uncle. He lives in the Puelche lof, down the road. But be careful: the grass is drying out and the animals are fleeing. Something evil walks the plain.')]);
}
function wekuTalk(){
  if(!S.flags.weku){S.flags.weku=1;S.gold+=30;persist();sfx('pick');
    return say([L('Weku','Mari mari, '+nm()+'! Iñche tami weku.','¡Hola, '+nm()+'! Soy tu weku.','Hello, '+nm()+'! I am your weku.'),
      N('Tu weku es el hermano de tu mamá. En la cultura mapuche es un tío muy cercano: casi un segundo papá. Cruzó la cordillera hace años, con los arrieros.','Your weku is your mother\'s brother. In Mapuche culture he is a very close uncle: almost a second father. He crossed the mountains years ago, with the herders.'),
      N('Ya conociste a tu kuku, tu laku, tu chuchu y tu cheche. Tu chillka tiene a toda tu familia en «Pu che». Tu weku te regala küla mari (30) ngülliw.','You have already met your kuku, your laku, your chuchu and your cheche. Your chillka has your whole family under «Pu che». Your weku gives you küla mari (30) ngülliw.'),
      L('Weku','Lonko mew amunge. Kütral mew inaltuley.','Ve donde el lonko. Está junto al kütral.','Go to the lonko. He is by the fire.')]);}
  const ls=[L('Weku','Mari mari, '+nm()+'!','¡Hola, '+nm()+'!','Hello, '+nm()+'!')];
  if(S.flags.ngen5)ls.push(L('Weku','Trariwe dewi! Müna ayüwün.','¡El trariwe está terminado! Qué alegría.','The trariwe is finished! What a joy.'));
  else ls.push(N('El chenque del Walichu queda al este, pasando la pampa y el pedregal, en la meseta. Pero primero habla con el lonko.','The Walichu\'s chenque lies to the east, past the grassland and the stone barrens, on the meseta. But first speak with the lonko.'));
  say(ls);
}
function eLonkoTalk(){
  if(S.flags.mql_puel&&!S.flags.mqd_puel)return say([L('Lonko','Machi ñi dungu.','Lo de la machi.','The machi\'s errand.'),N('«¿La chadi? En el lelfün de abajo, junto al chacay solo: donde el suelo se pone blanco. Escarba al lado del árbol.»','"The chadi? In the lower lelfün, by the lone chacay: where the ground turns white. Dig beside the tree."')]);
  if(S.flags.mq_puel&&!S.flags.mql_puel){S.flags.mql_puel=1;persist();sfx('lvl');
    return say([L('Lonko','Machi ñi dungu? Kümey.','¿Un encargo de la machi? Bien.','An errand from the machi? Good.'),
      N('El lonko mira hacia el oriente un momento. «El camino de la sal. Lo caminé de joven con mi chaw. En el lelfün de abajo, junto al chacay solo, el suelo se pone blanco: ahí se junta la chadi. Escarba junto al árbol. La machi pide por el lof y yo recuerdo por el lof: dile que la sal va en camino.»','The lonko looks east for a moment. "The salt path. I walked it as a young man with my father. In the lower lelfün, by the lone chacay, the ground turns white: that is where the chadi gathers. Dig beside the tree. The machi asks for the lof and I remember for the lof: tell her the salt is on its way."'),
      L('Lonko','Amupunge, '+nm()+'.','Ve, '+nm()+'.','Go, '+nm()+'.')]);}
  if(S.flags.puel_lonko){
    const ls=[L('Lonko','Mari mari, '+nm()+'.','Hola, '+nm()+'.','Hello, '+nm()+'.')];
    if(S.flags.ngen5)ls.push(L('Lonko','Ngen-lelfün nepey. Trariwe dewi!','Ngen-lelfün despertó. ¡El trariwe está completo!','Ngen-lelfün has woken up. The trariwe is complete!'),
      N('Los cinco trokiñ brillan en tu cintura. Ahora vuelve al oeste, al primer camino junto al mar: la niebla de Ti Fütra Ngoymatulfe ya puede abrirse ante ti.','The five trokiñ glow at your waist. Now go back west, to the first road by the sea: the fog of Ti Fütra Ngoymatulfe can open before you now.'));
    else ls.push(L('Lonko','Wingkul lelfün mew amunge.','Ve a la meseta.','Go to the meseta.'),
      N('Pasando la pampa y el pedregal está la meseta. El chenque del Walichu baja entre las piedras.','Past the grassland and the stone barrens is the meseta. The Walichu\'s chenque goes down among the rocks.'));
    return say(ls);
  }
  const steps=[
    {q:L('Lonko','Mari mari. Chumleymi am?','Hola. ¿Cómo estás?','Hello. How are you?'),
     o:[{m:'Kümelen, chaltu. Eymi kay?',es:'Estoy bien, gracias. ¿Y usted?',en:'I am well, thank you. And you?',ok:1},{m:'Kümeleymi.',es:'Tú estás bien.',en:'You are well.'},{m:'Chew tuwimi?',es:'¿De dónde eres?',en:'Where are you from?'}]},
    {q:L('Lonko','Iñche ka kümelen. Iney pingeymi am?','Yo también estoy bien. ¿Cómo te llamas?','I am well too. What is your name?'),
     o:[{m:'0 pingen.',es:'Me llamo 0.',en:'My name is 0.',ok:1},{m:'0 pingeymi.',es:'Tú te llamas 0.',en:'Your name is 0.'},{m:'0 pingey.',es:'Él se llama 0.',en:'His name is 0.'}]},
    {q:L('Lonko','Chumngelu küpaymi faw?','¿Por qué viniste hasta acá?','Why did you come all this way?'),
     o:[{m:'Ngen kintupan.',es:'Vine (hacia acá) a buscar al ngen.',en:'I came here looking for the ngen.',ok:1},{m:'Ngen kintuy.',es:'Él busca al ngen.',en:'He is looking for the ngen.'},{m:'Ngen kintulan.',es:'No busco al ngen.',en:'I am not looking for the ngen.'}]}];
  say([N('El lonko puelche se levanta para saludarte. Recuerda el pentukuwün.','The Puelche lonko stands up to greet you. Remember the pentukuwün.')],()=>step(0));
  function step(i){
    if(i>=steps.length)return done();
    const st=steps[i],en=S.gloss==='en';
    const opts=st.o.map((o,k)=>({m:o.m.replace('0',nm()),g:S.hints?(en?o.en:o.es).replace('0',nm()):'',v:k}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(st.q,opts,v=>{if(st.o[v].ok)say([praise()],()=>step(i+1));else{sfx('bad');say([N('El lonko espera, en silencio. Piensa en lo que te preguntó.','The lonko waits in silence. Think about what he asked you.')],()=>step(i))}},false,true);
  }
  function done(){
    S.flags.puel_lonko=1;learnRoot('trana');S.items.kulon++;persist();sfx('lvl');
    say([L('Lonko','Kümey! Meli ngen nepeyngün, pikeyngün.','¡Bien! Dicen que cuatro ngen despertaron.','Good! They say four ngen have woken up.'),
      L('Lonko','Welu Ngen-lelfün umawtuley. Walichu miawmiawpai.','Pero Ngen-lelfün duerme. El Walichu anda dando vueltas por aquí.','But Ngen-lelfün sleeps. The Walichu is roaming around here.'),
      N('El Walichu es un wekufü de la pampa: seca el pasto, espanta a los luan y hace tropezar a los kawellu. Y lo peor: a la gente le va robando las palabras, una por una, para su patrón: Ti Fütra Ngoymatulfe.','The Walichu is a wekufü of the plains: it dries the grass, scares off the guanacos and makes the horses stumble. And worst of all: it steals people\'s words, one by one, for its master: Ti Fütra Ngoymatulfe.'),
      L('Lonko','Trana- kimeltueyu.','Te enseño trana- ("caerse").','I teach you trana- ("fall down").'),
      N('Con tranange, tranamu o tranamün, el wekufü cae al suelo: pierde su turno y el próximo golpe le duele más. Recibiste trana- y un külon.','With tranange, tranamu or tranamün, a wekufü falls to the ground: it loses its turn and the next blow hurts it more. You received trana- and a külon.'),
      L('Lonko','Wingkul lelfün mew amunge, '+nm()+'.','Ve a la meseta, '+nm()+'.','Go to the meseta, '+nm()+'.')]);
  }
}
function eNutramTalk(){
  say([L('Nütramkafe','Mari mari, '+addr(false)+'. Nütramkayaiñ?','Hola. ¿Conversamos?','Hello. Shall we talk?'),
    L('Nütramkafe','Kuyfi, puel mapu mew, kiñe walichu akurkey.','Hace mucho tiempo, dicen que a la tierra del este llegó un walichu.','Long ago, they say, a walichu came to the eastern land.'),
    L('Nütramkafe','Umawtulen miawkerkey.','Dicen que anda caminando dormido.','They say it walks about asleep.'),
    L('Nütramkafe','Pewma mew mülerkey.','Dicen que vive dentro de un sueño.','They say it lives inside a dream.'),
    N('¿Notaste el -rke-? Es la marca de "dicen que": lo que uno sabe por otros. La kushe Millaray, en su ruka, sabe más historias así. Y en el salitral hay una piedra que pregunta por -rke-.','Did you notice the -rke-? It marks "they say": what you know through others. Old Millaray, in her ruka, knows more stories like this. And in the salt flat there is a stone that asks about -rke-.')]);
}
function choykeKidTalk(){
  if(S.flags.puel_pichd){
    if(!S.flags.puel_kidthx){S.flags.puel_kidthx=1;persist();sfx('lvl');
      return gainPiwke([L('Pichiche','Ñi pichuñ! Chaltu may, chaltu may!','¡Mi pluma! ¡Gracias, gracias!','My plume! Thank you, thank you!'),
        N('El niño abraza su pluma de choyke y te da algo que encontró jugando...','The boy hugs his choyke plume and gives you something he found while playing...')]);}
    return say([L('Pichiche','Choyke reke lefken!','¡Corro como un choyke!','I run like a rhea!')]);}
  if(S.flags.puel_kidq)return say([L('Pichiche','Ñami ñi choyke pichuñ...','Se me perdió mi pluma de choyke...','I lost my choyke plume...'),
    N('«El viento se la llevó a la pampa, al este. Donde el pasto está pisado, junto al camino... ahí cayó. Escarba y la encontrarás.»','"The wind carried it to the grassland, to the east. Where the grass is trampled, beside the road... that is where it fell. Dig and you will find it."')]);
  S.flags.puel_kidq=1;persist();
  say([L('Pichiche','Mari mari! Choyke pichuñ nien... niefun.','¡Hola! Tengo una pluma de choyke... tenía.','Hello! I have a choyke plume... I had one.'),
    N('El niño bailaba el choyke purun, el baile del ñandú, con una pluma larga y gris. Pero el viento se la llevó a la pampa del este.','The boy was dancing the choyke purun, the rhea dance, with a long grey feather. But the wind carried it off to the eastern grassland.'),
    L('Pichiche','Kintulaen, chaltu! Llingüdkülechi kachu mew müley.','¡Búscamela, porfa! Está en el pasto aplastado.','Please find it for me! It is in the flattened grass.')]);
}
function malenTalk(){
  const en=S.gloss==='en';
  if(S.flags.puel_dir)return say([L('Domo','Meli witran mapu: puel, pikun, lafken, willi!','¡Los cuatro lados de la tierra: este, norte, mar, sur!','The four corners of the land: east, north, sea, south!')]);
  const qs=[{q:L('Domo','Chew tripakey antü?','¿Por dónde sale el sol?','Where does the sun rise?'),o:['puel','willi','lafken'],a:'puel'},
    {q:L('Domo','"Willi" ñi mapu, ¿chew müley?','La tierra "willi", ¿dónde queda?','The "willi" land, where is it?'),o:[en?'north':'norte',en?'south':'sur',en?'east':'este'],a:en?'south':'sur'},
    {q:L('Domo','Chew konkey antü? Lafken mew!','¿Dónde se pone el sol? ¡Por el mar!','Where does the sun set? By the sea!'),o:['lafken','puel','pikun'],a:'lafken'},
    {q:L('Domo','"Pikun", ¿chew müley?','¿Y "pikun", dónde queda?','And "pikun", where is it?'),o:[en?'south':'sur',en?'west':'oeste',en?'north':'norte'],a:en?'north':'norte'}];
  say([L('Domo','Mari mari, '+addr(true)+'! Trariwe ngürekalen.','¡Hola! Estoy tejiendo un trariwe.','Hello! I am weaving a trariwe.'),
    N('En el tejido van los meli witran mapu, los cuatro lados de la tierra: puel (este), pikun (norte), willi (sur) y lafken (el mar, el oeste). ¡Tú los caminaste todos! A ver si los conoces.','Woven into it are the meli witran mapu, the four corners of the land: puel (east), pikun (north), willi (south) and lafken (the sea, the west). You have walked them all! Let us see if you know them.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.puel_dir=1;S.items.lawen++;S.gold+=20;S.xp+=4;persist();sfx('lvl');
      return say([praise(),L('Domo','Kom kimimi! Chaltu may.','¡Los sabes todos! Gracias.','You know them all! Thank you.'),N('Te da un lawen y epu mari (20) ngülliw. +4 kimün.','She gives you a lawen and epu mari (20) ngülliw. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('direcciones',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Domo','Fey no...','Eso no...','Not that...'),N('Piensa: ¿por dónde sale el sol? ¿Dónde queda el mar?','Think: where does the sun rise? Where is the sea?')],()=>ask(0))}},true,false)}
}
function charkiTalk(){
  const en=S.gloss==='en';
  if(S.flags.puel_food)return say([L('Domo','Charki müley! Ilayaymi am?','¡Hay charki! ¿Vas a comer?','There is charki! Will you eat?')]);
  const qs=[{q:L('Domo','Chem am ta "ilo"?','¿Qué es "ilo"?','What is "ilo"?'),o:[en?'meat':'carne',en?'bread':'pan',en?'water':'agua'],a:en?'meat':'carne'},
    {q:L('Domo','Chem am ta "challwa"?','¿Qué es "challwa"?','What is "challwa"?'),o:[en?'potato':'papa',en?'fish':'pescado',en?'salt':'sal'],a:en?'fish':'pescado'},
    {q:L('Domo','Chem am ta "iyael"?','¿Qué es "iyael"?','What is "iyael"?'),o:[en?'food':'comida',en?'fire':'fuego',en?'house':'casa'],a:en?'food':'comida'}];
  say([L('Domo','Mari mari! Charki dewmalen: angkümka ilo.','¡Hola! Estoy haciendo charki: carne secada al sol.','Hello! I am making charki: sun-dried meat.'),
    N('En la pampa, la carne se seca al sol y al viento para que dure todo el año. Mientras corta, te pregunta palabras de comida.','On the plains, meat is dried in the sun and wind so it lasts all year. While she cuts, she asks you food words.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.puel_food=1;S.items.kofke+=2;persist();sfx('lvl');
      return say([praise(),L('Domo','Kümey! Charkitukeymi am?','¡Bien! ¿Sueles comer charki?','Good! Do you eat charki?'),N('Te da dos kofke para el camino.','She gives you two kofke for the road.')])}
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('comida',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Domo','Fey no...','Eso no...','Not that...')],()=>ask(0))}},true,false)}
}
function kusheTalk(){
  const ls=[L('Kushe Millaray','Konpange, konpange!','¡Pasa, pasa!','Come in, come in!'),
    L('Kushe Millaray','Kuyfi, tüfachi mapu mew, ngen mülerkefuy.','Dicen que hace tiempo, en esta tierra, había un ngen.','They say that long ago, in this land, there was a ngen.'),
    L('Kushe Millaray','Fütra pasto mülerkefuy. Luan mülerkefuy.','Dicen que había pasto alto. Que había guanacos.','They say there was tall grass. That there were guanacos.'),
    L('Kushe Millaray','Walichu akuy... fey kom ñamürpay.','Llegó el Walichu... y todo se vino perdiendo.','The Walichu came... and everything came to be lost.'),
    N('La kushe habla con -rke-: todo lo que cuenta lo supo de los más viejos. Así viajan los epew: de boca en boca, con -rke- adentro.','The old woman speaks with -rke-: everything she tells she learned from her elders. That is how epew travel: from mouth to mouth, with -rke- inside.')];
  if(!S.flags.puel_kushe){S.flags.puel_kushe=1;S.items.kofke++;persist();sfx('pick');
    ls.push(L('Kushe Millaray','Kofke eluayu. Inge, pichi weche!','Te doy un kofke. ¡Come!','I will give you a kofke. Eat!'));}
  say(ls);
}
function mallinTalk(){
  const en=S.gloss==='en';
  if(S.flags.puel_mallin)return say([L('Challwafe','Wüle ka yepayan ko. Pewkayal!','Mañana vengo a buscar agua otra vez. ¡Hasta luego!','Tomorrow I will come for water again. See you later!')]);
  const qs=[{q:L('Challwafe','Wiya ___','Ayer fui a pescar (allá, y volví).'+rh('challwatu'),'Yesterday I went fishing (over there, and came back).'+rh('challwatu')),o:['challwatun','challwatumen','challwatupan'],a:'challwatumen'},
    {q:L('Challwafe','Ko ___','Vine a buscar agua (hacia acá).'+rh('ye'),'I came here to fetch water.'+rh('ye')),o:['yemen','yepan','yen'],a:'yepan'},
    {q:L('Challwafe','Wüle ___','Mañana iré a buscar (allá).'+rh('kintu'),'Tomorrow I will go looking (over there).'+rh('kintu')),o:['kintupayan','kintumean','kintuan'],a:'kintumean'}];
  say([L('Challwafe','Mari mari, '+addr(false)+'. Malliñ mew küdawkülen.','Hola. Estoy trabajando en el mallín.','Hello. I am working in the wet meadow.'),
    N('El pescador va y viene entre el lof y el mallín, y sus verbos van y vienen con él: -me- es ir a hacer algo allá; -pa- es hacia acá. Ayúdalo a terminar los verbos.','The fisherman comes and goes between the lof and the meadow, and his verbs come and go with him: -me- is going to do something over there; -pa- is toward here. Help him finish the verbs.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.puel_mallin=1;S.items.lawen++;S.items.kofke++;S.gold+=30;S.xp+=4;persist();sfx('lvl');
      return say([praise(),L('Challwafe','Chaltu may!','¡Gracias!','Thank you!'),N('Te da un lawen, un kofke y küla mari (30) ngülliw. +4 kimün.','He gives you a lawen, a kofke and küla mari (30) ngülliw. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];choose(q.q,q.o.map(o=>({m:o,v:o})).concat([{m:'Chillka',g:en?'Check the book':'Consultar el libro',v:'_book'}]),v=>{
      if(v==='_book')return openBook(()=>ask(i));
      if(trk('küpa- y amu-',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Challwafe','Fey no...','Eso no...','Not that...'),N('Piensa: ¿fue allá, o vino acá?','Think: did he go there, or come here?')],()=>ask(0))}},false,false)}
}
function chadifeTalk(){
  const ls=[L('Chadife','Mari mari, '+addr(true)+'. Chadi ngillakan.','Hola. Junto sal.','Hello. I gather salt.'),
    N('Del salitral sale la chadi (sal) para todo Puelmapu: para el charki, para el kofke, para cambiar por ngülliw. El agua se va y la sal se queda.','From the salt flat comes the chadi (salt) for all Puelmapu: for the charki, for the bread, to trade for ngülliw. The water leaves and the salt stays.')];
  if(S.flags.sb5)ls.push(L('Chadife','Lifngey ti chadi! Chaltu may.','¡La sal quedó limpia! Gracias.','The salt is clean again! Thank you.'),
    N('«Al que dormía bajo la sal lo llamaban Elëngasëm. No es palabra de nuestra lengua: viene del günün a yajüch, la lengua de los günün a künä, la gente antigua de estas llanuras. Ellos tenían su propia lengua y sus propios relatos, y de tanto andar juntos por el puel, sus seres entraron también en los nuestros, como el walichu.»','"The one that slept under the salt was called Elëngasëm. That is not a word of our language: it comes from Günün a yajüch, the language of the Günün a künä, the old people of these plains. They had their own language and their own tellings, and from so much walking the puel together, their beings entered ours as well, like the walichu."'));
  else if(S.flags.ngen5)ls.push(N('«Pero algo pasa junto a las pozas blancas: de noche, la tierra blanda tiembla, y nadie se atreve a pisarla... Los antiguos de las llanuras, los günün a künä, que tenían su propia lengua, hablaban de un gigante acorazado que duerme bajo la tierra: el Elëngasëm.»','"But something is wrong beside the white pools: at night the soft ground trembles, and no one dares to walk on it... The old people of the plains, the Günün a künä, who had their own language, spoke of an armored giant that sleeps under the earth: the Elëngasëm."'));
  say(ls);
}
function kona5Talk(){
  if(S.flags.ngen5)return say([L('Kona','Amutuy Walichu! Lelfün karüngewetuay.','¡Se fue el Walichu! La pampa volverá a ser verde.','The Walichu has gone! The plain will be green again.')]);
  say([L('Kona','Walichu müley chenke mew! Umawtulen miawkey.','¡El Walichu está en el chenque! Anda caminando dormido.','The Walichu is in the chenque! It walks about asleep.'),
    N('El chenque baja entre las piedras, aquí al lado. Dicen que adentro hay piedras con números enormes, una puerta con llave, y otra piedra que pregunta de quién son las cosas. Y al fondo, el Walichu, envuelto en su sueño gris: a ese, dicen, primero hay que despertarlo.','The chenque goes down among the rocks, right here. They say inside there are stones with huge numbers, a locked door, and another stone that asks whose things are whose. And at the bottom, the Walichu, wrapped in its grey dream: that one, they say, must first be woken.')]);
}
function freedN(){return ['gm1','gm2','gm3','gm4','gm5'].filter(f=>S.flags[f]).length}
function ngoymanTalk(){
  if(S.flags.won)return say([L('Kushe ñi am','Kom mapu tukulpaturkey. Chaltu may, '+nm()+'.','Toda la tierra vuelve a recordar. Gracias, '+nm()+'.','All the land remembers again. Thank you, '+nm()+'.'),
    N('La figura de niebla ya casi no se ve: donde estaba, crece pasto nuevo. «Las tierras robadas siguen ahí, al oeste, si quieres volver a caminarlas. Y los que viven en ellas te recordarán siempre.»','The fog figure is barely visible now: where it stood, new grass is growing. "The stolen lands are still there, to the west, if you want to walk them again. And those who live in them will remember you always."')]
    .concat(!S.flags.chboss?[N('«Y escucha: en el lago williche, junto a la isla, hay un remolino que canta. Los chumpall, la gente del agua, necesitan ayuda. Baja con respeto.»','"And listen: in the Williche lake, beside the island, there is a whirlpool that sings. The chumpall, the water people, need help. Go down with respect."')]:[])
    .concat(stgoOpen()?[N('«¿Escuchaste esa voz? Tu kuku te llama desde su ruka, en el lof lafkenche. Ve: lo que te espera allá no está en estas tierras.»','"Did you hear that voice? Your kuku calls you from her ruka, in the Lafkenche lof. Go: what awaits you there is not in these lands."')]:[]));
  const n=freedN();
  const ls=[L('Kushe ñi am','Akuymi. Akuymi may pichi weche chew rüpü aflu.','Llegaste. Llegaste, pues, joven, a donde se acaba el camino.','You have come. You have come, young one, to where the road ends.'),
    N('La figura es apenas niebla con forma de persona. Pero te mira con un cariño muy viejo, y la niebla no se atreve a tocarla.','The figure is barely fog in the shape of a person. But it looks at you with a very old tenderness, and the fog does not dare touch it.'),
    L('Kushe ñi am','Kechu trokiñ, kechu mapu, kiñe trariwe.','Cinco trokiñ, cinco tierras, un solo trariwe.','Five trokiñ, five lands, one single trariwe.')];
  if(n===0)ls.push(N('«Hacia el oeste, la niebla guarda lo que ha robado: un pedazo de cada tierra, gris y callado. Y en cada pedazo tiene preso a alguien: un niño, un pescador, una recolectora, una pescadora, un werken. Libéralos con tus palabras: solo cuando los cinco hayan vuelto a sus tierras se abrirá la puerta del gran olvido.»','"To the west, the fog keeps what it has stolen: a piece of every land, grey and silent. And in every piece it holds someone captive: a child, a fisherman, a gatherer, a fisherwoman, a werken. Free them with your words: only when all five have returned to their lands will the gate of the great forgetting open."'));
  else if(!S.flags.gm_all)ls.push(N('«Ya volvieron '+n+' de 5 cautivos a sus tierras. La niebla se vuelve más delgada con cada uno... sigue hacia el oeste.»','"'+n+' of 5 captives have returned to their lands. The fog grows thinner with each one... keep going west."'));
  else ls.push(N('«Los cinco volvieron. La puerta del gran olvido está abierta, al fondo de la pampa robada. Tus palabras serán tu única arma... y serán suficientes.»','"All five have returned. The gate of the great forgetting is open, beyond the stolen plain. Your words will be your only weapon... and they will be enough."'));
  if(S.flags.gm_all&&!S.flags.lawW){S.flags.lawW=1;S.lawuses=0;persist();
    ls.push(L('Kushe ñi am','Kiñe dungu elueyu: Lawentuwün.','«Te dejo una última palabra: Lawentuwün, sanarse a uno mismo.»','"I leave you one last word: Lawentuwün, to heal oneself."'),
      Object.assign(L('','Lawentuwün!','Aprendes la palabra Lawentuwün: en batalla recupera tu newen entero la primera vez, y cada uso siguiente sana 25% menos (100% → 75% → 50% → 25%).','You learn the word Lawentuwün: in battle it restores all your newen the first time, and every later use heals 25% less (100% → 75% → 50% → 25%).'),{fx:()=>sfx('lvl')}))}
  if(S.flags.gm_all&&!S.flags.sb6)ls.push(N('«Una advertencia: el que vendió las tierras a la niebla todavía camina por la pampa robada. Un fütra kalku, con manto de plumas negras. La tierra agrietada lo delata... si te atreves a pisarla.»','"A warning: the one who sold the lands to the fog still walks the stolen plain. A great kalku, in a cloak of black feathers. The cracked earth betrays him... if you dare to tread it."'));
  if(S.flags.sb5&&!S.flags.epu_won)ls.push(N('Antes de irte, la figura señala el pasto junto al kütral: «Alguien te mira desde hace rato. Un guerrero de dos caras. No es wekufü: no le temas... pero si te habla, escúchalo con respeto.»','Before you go, the figure points to the grass by the fire: "Someone has been watching you for a while. A warrior with two faces. He is no wekufü: do not fear him... but if he speaks to you, listen with respect."'));
  say(ls);
}


function epunamunTalk(){
  const en=S.gloss==='en';
  if(S.flags.epu_won)return say([L('Epunamun','Newentuleymi. Kimün may nieymi tati. Amunge, weychafe.','Tienes fuerza. Y conocimiento, sí que tienes. Ve, guerrera o guerrero.','You are strong. And knowledge, you truly have. Go, warrior.'),
    N('Las dos caras del Epunamun miran a la vez hacia la niebla y hacia ti. Ambas sonríen.','Both of the Epunamun\'s faces look at once toward the fog and toward you. Both are smiling.')]);
  say([N('El kona se vuelve hacia ti... y por un momento ves que tiene dos caras: una mira hacia la niebla y la otra te mira a ti. No es un kona. Es un espíritu.','The warrior turns toward you... and for a moment you see that he has two faces: one looks toward the fog, and the other looks at you. He is no ordinary warrior. He is a spirit.'),
    L('Epunamun','Iñche Epunamun. Iñche ti weychan dungu ñi ngen nu, welu ngülamkefiñ ka ngütramken fill kümeke weichafe mu.','Yo soy el Epunamun. No soy el dueño de los asuntos de la guerra, pero aconsejo y converso con todos los buenos guerreros.','I am the Epunamun. I am not the master of the affairs of war, but I counsel and talk with all good warriors.'),
    N('El Epunamun es un espíritu al que los lonko y los weychafe consultaban antes de pelear. No es un wekufü: viene a probarte. Detrás de la niebla te espera el gran olvido, y quiere saber si tus palabras y tu newen alcanzan.','The Epunamun is a spirit that lonko and warriors consulted before battle. He is no wekufü: he has come to test you. Behind the fog the great forgetting awaits you, and he wants to know whether your words and your newen are enough.'),
    L('Epunamun','Weychayayu? Küla sello witrañpüramuan. Umawtulen, nepelen, ka tranakilpe.','¿Peleamos tú y yo? Levantaré tres sellos. Duérmeme, despiértame, y que yo no caiga.','Shall we fight, you and I? I will raise three seals. Put me to sleep, wake me, and let me not fall.'),
    N('Es una prueba, no una cacería: pelea con respeto y con todas tus palabras.','It is a trial, not a hunt: fight with respect and with all your words.')],()=>{
    choose(L('Epunamun','Weychayayu?','¿Aceptas la prueba?','Do you accept the trial?'),
      [{m:'May, weychayayu!',g:en?'Yes, let us fight!':'¡Sí, peleemos!',v:1},{m:'Pepikawkülelan petu',g:en?'I am not prepared yet':'Todavía no estoy preparado',v:0}],v=>{
      if(!v)return say([L('Epunamun','Küme rakiduamnge. Faw mülekean.','Piénsalo bien. Aquí estaré.','Think it over. I will be here.')]);
      say([N('El Epunamun golpea el suelo con las dos lanzas a la vez. Tres sellos de luz se encienden a su alrededor. El primero susurra: «¡Duérmete!»','The Epunamun strikes the ground with both spears at once. Three seals of light kindle around him. The first whispers: «Sleep!»')],()=>startBattle(['epunamun'],{boss:1,sflag:'epu_won'}));
    },true,true)});
}

/* ---------- Ngoyman captives ---------- */
function freeCaptive(id,gm,who,whoen,reward,rewardEn,give){
  give();S.flags[gm]=1;
  const all=['gm1','gm2','gm3','gm4','gm5'].every(f=>S.flags[f]);if(all)S.flags.gm_all=1;
  persist();sfx('lvl');
  const e=ents.find(x=>x.id===id);if(e)ents=ents.filter(x=>x!==e);
  return gainPiwke([praise(),
    N('La niebla alrededor de '+who+' se afloja, se deshace... y '+who+' se vuelve una luz tibia que vuela hacia el este, de regreso a su tierra.','The fog around '+whoen+' loosens, comes apart... and '+whoen+' becomes a warm light that flies east, back home.'),
    N(reward,rewardEn)].concat(all?[L('','Kechu che tami kellufiel wiñoturkey ñi pu mapu mew.','¡Las cinco personas que ayudaste volvieron a sus tierras! A lo lejos se oye un crujido enorme: la puerta del gran olvido se está abriendo.','The five people you helped have returned to their lands! Far away you hear a huge groan: the gate of the great forgetting is opening.')]:[]));
}
function capQuiz(id,gm,label,intro,qs,who,whoen,reward,rewardEn,give){
  const en=S.gloss==='en';
  say(intro,()=>ask(0));
  function ask(i){
    if(i>=qs.length)return freeCaptive(id,gm,who,whoen,reward,rewardEn,give);
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o.concat([{m:'Chillka',g:en?'Check the book':'Consultar el libro',v:'_book'}]),v=>{
      if(v==='_book')return openBook(()=>ask(i));
      if(trk('ngoyman (niebla)',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L(label,'Fey no...','Eso no...','Not that...'),N('La niebla se aprieta otra vez. Respira, y vuelve a empezar.','The fog tightens again. Breathe, and start over.')],()=>ask(0))}},false,false)}
}
function gLafTalk(){
  capQuiz('cap1','gm1','Pichiche',
    [L('Pichiche','K-kelluen...','A-ayúdame...','H-help me...'),
     N('Un niño lafkenche está envuelto en hilos de niebla. Sus palabras se están borrando: ayúdalo a recordarlas y la niebla lo soltará.','A Lafkenche child is wrapped in threads of fog. His words are being erased: help him remember them and the fog will let him go.')],
    [{q:L('Pichiche','Chumleymi? ...Chem pin?','Si te preguntan "¿cómo estás?", ¿qué respondes?','If they ask "how are you?", what do you answer?'),o:['Kümelen','Kümeleymi','Kümeley'],a:'Kümelen'},
     {q:L('Pichiche','Chumngechi pingekey "gracias"?','¿Cómo se dice "gracias"?','How do you say "thank you"?'),o:['chaltu may','mari mari','pewkayal'],a:'chaltu may'},
     {q:L('Pichiche','Chumngechi pingekey "hasta luego"?','¿Cómo se dice "hasta luego"?','How do you say "see you later"?'),o:['pewkayal','mari mari','fey no'],a:'pewkayal'}],
    'el niño','the child','Antes de irse te deja epu kofke y meli mari (40) ngülliw.','Before leaving he gives you two kofke and meli mari (40) ngülliw.',
    ()=>{S.items.kofke+=2;S.gold+=40});
}
function gNagTalk(){
  capQuiz('cap2','gm2','Challwafe',
    [L('Challwafe','Kelluen... Ponwitu Ngoyman mew mülen.','Ayúdame... Estoy dentro del olvido.','Help me... I am inside the forgetting.'),
     N('Un pescador nagche está atrapado en la niebla. Olvidó lo que viene: el futuro. Devuélvele el -a- y la niebla lo soltará.','A Nagche fisherman is trapped in the fog. He has forgotten what is to come: the future. Give him back the -a- and the fog will let him go.')],
    [{q:L('Challwafe','Wüle iñche ___','Mañana yo pescaré.'+rh('challwatu'),'Tomorrow I will fish.'+rh('challwatu')),o:['challwatun','challwatuan','challwatuy'],a:'challwatuan'},
     {q:L('Challwafe','Eymi ___','Tú irás.'+rh('amu'),'You will go.'+rh('amu')),o:['amuymi','amuaymi','amuan'],a:'amuaymi'},
     {q:L('Challwafe','Fey ___','Ella dormirá.'+rh('umawtu'),'She will sleep.'+rh('umawtu')),o:['umawtuy','umawtuay','umawtuan'],a:'umawtuay'}],
    'el pescador','the fisherman','Antes de irse te deja un lawen y meli mari (40) ngülliw.','Before leaving he gives you a lawen and meli mari (40) ngülliw.',
    ()=>{S.items.lawen++;S.gold+=40});
}
function gPewTalk(){
  capQuiz('cap3','gm3','Ngülliwfe',
    [L('Ngülliwfe','Kelluen... Rakin ngoyman.','Ayúdame... Olvidé los números.','Help me... I have forgotten the numbers.'),
     N('Una recolectora pewenche cuenta ngülliw que ya no sabe contar. Devuélvele los números y la niebla la soltará.','A Pewenche gatherer counts pine nuts she no longer knows how to count. Give her back the numbers and the fog will let her go.')],
    [{q:L('Ngülliwfe','Kechu mari... chumten am?','Kechu mari, ¿cuánto es?','Kechu mari, how many is that?'),o:['15','50','500'],a:'50'},
     {q:L('Ngülliwfe','Pataka... chumten am?','Pataka, ¿cuánto es?','Pataka, how many is that?'),o:['100','1000','40'],a:'100'},
     {q:L('Ngülliwfe','Warangka... chumten am?','Warangka, ¿cuánto es?','Warangka, how many is that?'),o:['100','500','1000'],a:'1000'}],
    'la recolectora','the gatherer','Antes de irse te deja epu külon y meli mari (40) ngülliw.','Before leaving she gives you two külon and meli mari (40) ngülliw.',
    ()=>{S.items.kulon+=2;S.gold+=40});
}
function gWilTalk(){
  const en=S.gloss==='en';
  capQuiz('cap4','gm4','Challwafe domo',
    [L('Challwafe domo','Kelluen... Chumül? Chumül am?','Ayúdame... ¿Cuándo? ¿Cuándo?','Help me... When? When?'),
     N('Una pescadora williche perdió los días en la niebla: ayer, hoy y mañana se le mezclan. Ordénaselos y la niebla la soltará.','A Williche fisherwoman has lost the days in the fog: yesterday, today and tomorrow blur together. Set them in order and the fog will let her go.')],
    [{q:L('Challwafe domo','"Wiya"... chem am?','"Wiya", ¿qué es?','"Wiya", what is it?'),o:[en?'yesterday':'ayer',en?'tomorrow':'mañana',en?'today':'hoy'],a:en?'yesterday':'ayer'},
     {q:L('Challwafe domo','"Wüle"... chem am?','"Wüle", ¿qué es?','"Wüle", what is it?'),o:[en?'today':'hoy',en?'tomorrow':'mañana',en?'yesterday':'ayer'],a:en?'tomorrow':'mañana'},
     {q:L('Challwafe domo','Wiya iñche ___','Ayer yo pesqué.'+rh('challwatu'),'Yesterday I fished.'+rh('challwatu')),o:['challwatun','challwatuan','challwatuay'],a:'challwatun'}],
    'la pescadora','the fisherwoman','Antes de irse te deja un kofke, un lawen y meli mari (40) ngülliw.','Before leaving she gives you a kofke, a lawen and meli mari (40) ngülliw.',
    ()=>{S.items.kofke++;S.items.lawen++;S.gold+=40});
}
function gPuelTalk(){
  capQuiz('cap5','gm5','Werken',
    [L('Werken','Kelluen... Ñi werken dungu ñamyawi.','Ayúdame... Mis mensajes de werken andan perdidos.','Help me... My werken messages have gone astray.'),
     N('Un werken puelche lleva mensajes que la niebla le borró. Son los más difíciles: ir y venir, y lo que dicen otros. Devuélveselos y la niebla lo soltará.','A Puelche messenger carries messages the fog erased. They are the hardest ones: going and coming, and what others say. Give them back and the fog will let him go.')],
    [{q:L('Werken','___ ("fui a buscar allá")','"Fui a buscar (allá y volví)".'+rh('kintu'),'"I went looking (over there and back)".'+rh('kintu')),o:['kintun','kintumen','kintupan'],a:'kintumen'},
     {q:L('Werken','___ ("vino a ayudar acá")','"Vino a ayudar (hacia acá)".'+rh('kellu'),'"He came here to help".'+rh('kellu')),o:['kellumey','kellupay','kelluy'],a:'kellupay'},
     {q:L('Werken','___ ("dicen que se fue")','"Dicen que se fue".'+rh('amutu'),'"They say he went away".'+rh('amutu')),o:['amutuy','amuturkey','amutuan'],a:'amuturkey'}],
    'el werken','the werken','Antes de irse te deja un lawen y kayu mari (60) ngülliw.','Before leaving he gives you a lawen and kayu mari (60) ngülliw.',
    ()=>{S.items.lawen++;S.gold+=60});
}


/* ================= MÜNCHE LAFKEN: the chumpall ================= */
function chGardenTalk(){
  const en=S.gloss==='en';
  if(S.flags.ch1)return say([L('Chumpall','Taiñ tukukawe mongeley. Chaltu may!','Nuestro jardín está vivo. ¡Gracias!','Our garden is alive. Thank you!')]);
  const qs=[{q:L('Chumpall','Chem am ta "ko"?','¿Qué es "ko"?','What is "ko"?'),o:[en?'water':'agua',en?'fire':'fuego',en?'stone':'piedra'],a:en?'water':'agua'},
    {q:L('Chumpall','Chem am ta "challwa"?','¿Qué es "challwa"?','What is "challwa"?'),o:[en?'bird':'pájaro',en?'fish':'pescado',en?'wave':'ola'],a:en?'fish':'pescado'},
    {q:L('Chumpall','Chem am ta "lafken"?','¿Qué es "lafken"?','What is "lafken"?'),o:[en?'the sea, the lake':'el mar, el lago',en?'the rain':'la lluvia',en?'the river':'el río'],a:en?'the sea, the lake':'el mar, el lago'}];
  say([L('Chumpall','Mari mari, wenüy. Iñche chumpall ngen.','Hola, amiga o amigo. Yo soy chumpall.','Hello, friend. I am a chumpall.'),
    N('La chumpall jardinera cuida huertas de algas y corales. Desde que se enfureció el Millalobo, sus plantas olvidan sus nombres... y sin nombre, se marchitan. Devuélveselos.','The chumpall gardener tends beds of kelp and coral. Since the Millalobo flew into his rage, her plants forget their names... and without a name, they wither. Give the names back.'),
    N('«No es un wekufü», te dice. «Es el Millalobo, el rey del mar: mitad hombre, mitad lobo marino. Así lo cuentan los williche de Chiloé. Vivía en paz en su palacio bajo el agua, oyendo el ül que le cantábamos. El olvido se llevó ese canto, y sin él su furia no se acaba.»','"He is not a wekufü," she tells you. "He is the Millalobo, the king of the sea: half man, half sea lion. That is how the Williche of Chiloé tell it. He lived in peace in his palace under the water, listening to the ül we sang him. The forgetting took that song, and without it his fury has no end."')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.ch1=1;S.items.lawen++;S.gold+=40;persist();sfx('lvl');
      return say([praise(),L('Chumpall','Kom mongetuy!','¡Todo revive!','Everything comes back to life!'),N('Las algas se enderezan y los corales vuelven a brillar. Te da un lawen y meli mari (40) ngülliw.','The kelp straightens and the coral glows again. She gives you a lawen and meli mari (40) ngülliw.')])}
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('chumpall',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Chumpall','Fey no...','Eso no...','Not that...')],()=>ask(0))}},true,false)}
}
function chChildTalk(){
  if(S.flags.ch2)return say([L('Pichi chumpall','Ñi lüq kura! Lelifinge!','¡Mi perla! ¡Mírala!','My pearl! Look at it!')]);
  if(S.flags.ch_pearl){S.flags.ch2=1;persist();sfx('lvl');
    return gainPiwke([L('Pichi chumpall','Ñi lüq kura! Chaltu may, chaltu may!','¡Mi perla! ¡Gracias, gracias!','My pearl! Thank you, thank you!'),
      N('El pequeño chumpall abraza su perla y da tres volteretas en el agua. De la alegría, suelta algo rojo que llevaba guardado...','The little chumpall hugs his pearl and turns three somersaults in the water. In his joy, he lets go of something red he had been keeping...')]);}
  if(S.flags.ch2q)return say([L('Pichi chumpall','Llufü mapu mew ñami... kuyum mew.','Se perdió en la fosa... en la arena.','It was lost in the trench... in the sand.'),
    N('«Donde la arena está blanda, entre los dos abismos. Escarba y la encontrarás.»','"Where the sand is soft, between the two chasms. Dig and you will find it."')]);
  S.flags.ch2q=1;persist();
  say([L('Pichi chumpall','Ngümaley... Ñi lüq kura ñami.','(Está llorando.) Se me perdió mi lüq kura, mi piedra blanca.','(He is crying.) I lost my lüq kura, my white stone.'),
    N('Es una perla que canta. Cuando el Millalobo pasó, la onda se la llevó a la fosa profunda, al este. Quedó enterrada en la arena blanda.','It is a pearl that sings. When the Millalobo passed, the wave carried it to the deep trench, to the east. It lies buried in the soft sand.'),
    L('Pichi chumpall','Kintulaen, chaltu!','¡Búscamela, porfa!','Please find it for me!'),
    N('Entre sollozos agrega: «El Millalobo no es malo... Antes se quedaba abajo, en su palacio, tranquilo, con el canto de los grandes. Cuando vuelva a oír su ül, se va a calmar y volverá a su casa.»','Between sobs he adds: "The Millalobo is not bad... He used to stay down there in his palace, so calm, with the grown-ups\' song. When he hears his ül again, he will calm down and go back home."')]);
}
function chSingerTalk(){
  const en=S.gloss==='en';
  if(S.flags.ch3)return say([L('Chumpall ülkantufe','Taiñ ül wüñomongeturkey. Chaltu may.','Nuestro canto revivió. Gracias.','Our song has come back to life. Thank you.')]);
  const qs=[{q:N('La ola tiene que VENIR hacia la orilla. Díselo:','The wave must COME toward the shore. Tell it:'),o:['küpange','amutunge','umawtunge'],a:'küpange'},
    {q:N('La ola tiene que IRSE de las huertas. Díselo:','The wave must GO AWAY from the gardens. Tell it:'),o:['küpange','amutunge','nepenge'],a:'amutunge'},
    {q:N('El agua brava tiene que DORMIRSE. Díselo:','The rough water must SLEEP. Tell it:'),o:['tripange','lefnge','umawtunge'],a:'umawtunge'}];
  say([L('Chumpall ülkantufe','Mari mari. Taiñ lafken ül ñamürkey.','Hola. El canto de nuestro mar se perdió.','Hello. The song of our sea has been lost.'),
    N('Los chumpall gobiernan el agua cantándole órdenes. Pero en su furia, el Millalobo desordenó el ül, el canto. Ayúdala a ordenar las palabras del agua.','The chumpall govern the water by singing commands to it. But in his fury, the Millalobo scrambled the ül, the song. Help her put the water\'s words back in order.'),
    N('«Este mismo ül era el que lo mantenía en calma», dice. «Ordenarlo de nuevo es el primer paso para devolvérsela.»','"This very ül was what kept him calm," she says. "Putting it back in order is the first step toward giving that calm back."')],()=>ask(0));
  function ask(i){
    if(i>=qs.length){S.flags.ch3=1;S.items.kofke++;S.gold+=40;S.xp+=4;persist();sfx('lvl');
      return say([praise(),L('Chumpall ülkantufe','Taiñ ül wüñomongeturkey. Chaltu may.','Nuestro canto revivió. Gracias.','Our song has come back to life. Thank you.'),N('El agua de la fosa se aquieta un momento, escuchando. Te da un kofke y meli mari (40) ngülliw. +4 kimün.','The water of the trench goes still for a moment, listening. She gives you a kofke and meli mari (40) ngülliw. +4 kimün.')],()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('chumpall',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Chumpall ülkantufe','Fey no...','Eso no...','Not that...')],()=>ask(0))}},true,false)}
}
function chQueenTalk(){
  const en=S.gloss==='en';
  if(S.flags.chboss)return say([L('Ñidol chumpall','Taiñ lafken montulürkey. Eymi iñchiñ rumel wenüyyeayiñ.','Nuestro mar se salvó. Tú y nosotros seremos amigos para siempre.','Our sea has been saved. You and we will be friends forever.'),
    N('Los chumpall nadan en círculos a tu alrededor, contentos. La lafkenkura brilla tibia en tu mano.','The chumpall swim circles around you, happy. The lafkenkura glows warm in your hand.')]);
  const ready=S.flags.ch1&&S.flags.ch2&&S.flags.ch3;
  const ls=[L('Ñidol chumpall','Mari mari, wenüy. Iñche ñidol chumpall ngen.','Hola. Yo guío a los chumpall.','Hello. I lead the chumpall.'),
    N('La ñidol de los chumpall tiene el pelo largo como corriente de agua. Habla despacio, con pena.','The chumpall leader has hair long as a water current. She speaks slowly, with sorrow.'),
    L('Ñidol chumpall','Millalobo nepey. Taiñ challwa, taiñ tukukawe, taiñ ül: kom apümnieyew.','Despertó el Millalobo, enfurecido por el olvido. Nuestros peces, nuestras huertas, nuestro canto: lo está destruyendo todo.','The Millalobo has woken, enraged by the forgetting. Our fish, our gardens, our song: he is destroying everything.')];
  if(!ready){ls.push(N('«Antes de enfrentarlo, ayuda a mi gente: la jardinera de las huertas, el pequeño de la perla y la cantora de la fosa. Cuando los tres estén bien, cantaremos contigo.»','"Before facing it, help my people: the gardener of the beds, the little one of the pearl, and the singer of the trench. When all three are well, we will sing with you."'));
    return say(ls);}
  ls.push(N('«Ayudaste a los tres. Ahora los chumpall cantaremos contigo. El olvido le quitó al Millalobo el ül que lo aquietaba, y se agita bajo este salón: tiene cinco formas, y con cada una que se aquiete, uno de nuestros cantores te levantará. No se le puede matar: es el rey del mar. Hay que devolverle la calma, verso a verso, hasta que vuelva a su palacio.»','"You helped all three. Now we chumpall will sing with you. The forgetting took from the Millalobo the ül that kept him calm, and he stirs beneath this hall: he has five forms, and as each one is stilled, one of our singers will lift you up. He cannot be killed: he is the king of the sea. His calm must be given back, verse by verse, until he returns to his palace."'));
  if(!S.roots.includes('llako')){S.roots.push('llako');persist();
    ls.push(N('La ñidol toma tus manos y te canta una palabra nueva, despacio, para que la aprendas: llako- («calmarse, aplacarse»). «Esta es la palabra del ül: llakonge, llakomu, llakomün. Dicha bien, aquieta.»','The ñidol takes your hands and sings you a new word, slowly, so you learn it: llako- ("to calm, to settle"). "This is the word of the ül: llakonge, llakomu, llakomün. Said well, it stills."'),
      N('«Allá abajo no pelearás para vencer: cada orden tuya será un verso del ül. Las otras palabras lo llaman y lo sujetan; llako- le enfría la furia.»','"Down there you will not fight to win: every order of yours will be a verse of the ül. The other words call him and hold him; llako- cools his fury."'));}
  say(ls,()=>choose(L('Ñidol chumpall','Eymi iñchiñ weychayafiyiñ?','¿Tú y nosotros lo enfrentamos?','Shall you and we face it?'),
    [{m:'May, weychayafiyiñ!',g:en?'Yes, let us face it!':'¡Sí, enfrentémoslo!',v:1},{m:'Pepikawkülelan petu',g:en?'Not yet':'Todavía no',v:0}],v=>{
    if(!v)return say([L('Ñidol chumpall','Küme rakiduamnge. Faw müleaiñ.','Piénsalo. Aquí estaremos.','Think it over. We will be here.')]);
    say([N('Los chumpall forman un círculo y golpean el agua con las palmas, todos a la vez. El suelo del salón tiembla... y de la fosa sube algo enorme: primero una corona de oro, después unos ojos furiosos.','The chumpall form a circle and strike the water with their palms, all at once. The floor of the hall trembles... and out of the trench rises something enormous: first a crown of gold, then two furious eyes.'),
      N('El Millalobo se esconde en el agua oscura. Lo que se esconde... sale cuando se le dice.','The Millalobo hides in the dark water. What hides... comes out when it is told to.')],
      ()=>startBattle(['llufu1'],{boss:1,chain:'llufu'}));
  },true,true));
}

/* ================= SANTIAGO: the return ================= */
function portalMenu(){
  const en=S.gloss==='en',toStgo=M.region!=='santiago';
  choose(L('','Wülngiñ','Un portal de luz tranquila, tejido como un trariwe.','A portal of calm light, woven like a trariwe.'),
    [{m:toStgo?'Santiago mew amuan':'Wallmapu mew amuan',g:toStgo?(en?'Cross to Santiago':'Cruzar a Santiago'):(en?'Return to Wallmapu':'Volver a Wallmapu'),v:1},
     {m:'Mülekayan faw',g:en?'Stay here':'Quedarme aquí',v:0}],v=>{
    if(!v)return;
    sfx('cast');
    if(toStgo){if(!S.flags.stgo_seen){S.flags.stgo_seen=1;persist();
      return say([N('Cruzas la luz... y el aire cambia: bocinas lejanas, olor a pan y a micro. Estás de vuelta donde naciste: Santiago, la waria.','You cross the light... and the air changes: distant horns, the smell of bread and buses. You are back where you were born: Santiago, the waria.'),
        N('Pero algo es distinto: en una plaza de la ciudad, alguien pintó un letrero en mapudungun. La lengua te siguió hasta acá. Ayuda a los wariache a hacerla crecer.','But something is different: in a city plaza, someone has painted a sign in Mapudungun. The language followed you here. Help the wariache make it grow.'),
        N('Pero en la ciudad la lengua tiene tres silencios: el ruido de la feria (ngoyngoyün), la gente dispersa por el metro (ngamleftripael) y la costumbre de dejarla para después (mapudungukenoael fillantü). Al oeste de la plaza está la feria; el metro, en la calle; los blocks, al este de la población.','But in the city the language has three silences: the noise of the market (ngoyngoyün), the people scattered through the metro (ngamleftripael) and the habit of leaving it for later (mapudungukenoael fillantü). West of the plaza is the market; the metro, on the street; the blocks, east of the población.')],()=>loadMap('s_plaza',3,11));}
      loadMap('s_plaza',3,11)}
    else loadMap('l_ruka2',7,4)},true,true);
}
function kukuHome(){
  const en=S.gloss==='en';
  if(S.flags.stgo_done)return say([L('Kuku','Waria mew ka mongeley taiñ dungun. Chaltu may, '+nm()+'.','También en la ciudad vive nuestra lengua. Gracias, '+nm()+'.','In the city, too, our language lives. Thank you, '+nm()+'.'),
    N('La kuku teje junto al kütral. «Cuando quieras, el portal sigue ahí. Las dos casas son tuyas.»','Your kuku weaves beside the fire. "Whenever you want, the portal is still there. Both homes are yours."')]);
  if(stgoOpen())return say([L('Kuku','Akuymi, '+nm()+'.','Llegaste, '+nm()+'.','You came, '+nm()+'.'),
    N('«Despertaste a los ngen y venciste al gran olvido. Pero el camino no termina aquí.»','"You woke the ngen and defeated the great forgetting. But the road does not end here."'),
    L('Kuku','Waria mew ka müley che. Yewelkülelu che.','En la ciudad también hay gente. Gente que tiene vergüenza.','In the city there are people too. People who feel ashamed.'),
    N('«Allá nadie se atreve a decir ni mari mari: la vergüenza (yewen) les cierra la boca. Lleva lo que aprendiste. Junto al kütral tejí un wülngiñ, una puerta de luz: te lleva a Santiago y te trae de vuelta cuando quieras.»','"There nobody dares to say even mari mari: shame (yewen) closes their mouths. Carry what you have learned. Beside the fire I wove a wülngiñ, a door of light: it takes you to Santiago and brings you back whenever you want."')]);
  say([L('Kuku','Konpange, '+nm()+'! Kümelen, eymi kay?','¡Pasa, '+nm()+'! Estoy bien, ¿y tú?','Come in, '+nm()+'! I am well, and you?'),
    N('La ruka de tu kuku huele a humo y a pan. «Camina el mapu, hijo de la waria. Cuando sea hora, yo te llamo.»','Your kuku\'s ruka smells of smoke and bread. "Walk the land, child of the city. When it is time, I will call you."')]);
}
function stDone(){return ['st1','st2','st3','st4','st5'].filter(f=>S.flags[f]).length}
function stReward(flag,give,lines){
  give();S.flags[flag]=1;
  const all=stDone()===5;if(all)S.flags.st_all=1;
  persist();sfx('lvl');
  if(all&&typeof swCheck==='function')swCheck();
  if(all&&!S.flags.sw_all)return say(lines.concat([N('Cinco personas de la waria hablaron sin vergüenza. Pero la ciudad todavía tiene sus tres silencios: '+(3-swDone())+' siguen en pie.','Five people of the city spoke without shame. But the city still has its three silences: '+(3-swDone())+' still stand.')]));
  return say(lines.concat(all?[
    N('Cinco personas de la waria hablaron sin vergüenza. Pero al fondo de la población, en la cancha, se juntó una sombra: todo el yewen que les quitaste tiene que ir a alguna parte.','Five people of the city spoke without shame. But at the back of the neighborhood, on the cancha, a shadow has gathered: all the yewen you took from them has to go somewhere.'),
    L('','Yewen','Vergüenza. Es la última prueba: ve a la cancha y enfréntalo.','Shame. It is the last trial: go to the cancha and face it.')]:[]));
}
function yewenTalk(){
  const en=S.gloss==='en';
  say([N('En medio de la cancha hay alguien parado, de capucha, con las manos tapándose la boca. Los niños dejaron de jugar. Nadie se le acerca.','In the middle of the cancha someone stands, hooded, hands clamped over the mouth. The kids have stopped playing. Nobody goes near.'),
    L('Yewen','...','No dice nada. Pero lo escuchas igual, adentro de tu cabeza: «lo hablas mal», «no eres de verdad», «te van a mirar raro», «mejor cállate».','It says nothing. But you hear it anyway, inside your head: "you speak it badly", "you are not a real one", "they will look at you funny", "better stay quiet".'),
    N('Es el Yewen: la vergüenza. No es un wekufü del sur: nació aquí, en la waria, de cada vez que alguien se tragó una palabra. Lleva tres sellos: hay que hacerlo salir, decirle que no tenga miedo, y que no se pierda.','It is the Yewen: shame. It is no wekufü from the south: it was born here, in the city, every time someone swallowed a word. It carries three seals: it must be made to come out, told not to be afraid, and told not to get lost.')],()=>{
    choose(L('','Yewen','¿Lo enfrentas?','Do you face it?'),
      [{m:'May. Yewelayan!',g:en?'Yes. I will not be ashamed!':'Sí. ¡No tendré vergüenza!',v:1},{m:'Pepikawkülelan petu',g:en?'Not yet':'Todavía no',v:0}],v=>{
      if(!v)return say([N('La sombra sigue ahí, esperando. Toda la población lo sabe.','The shadow stays there, waiting. The whole neighborhood knows it.')]);
      const miss=['tripa','llüka','ñam'].filter(r=>!S.roots.includes(r)),pre=[];
      for(const r of miss){learnRoot(r);const g=ROOTS[r];pre.push(L('Kuku',g.m,'La voz de tu kuku, desde lejos: «Te falta una palabra. '+g.m+' quiere decir "'+g.es+'". Llévala.»','Your kuku\'s voice, from far away: "You are missing a word. '+g.m+' means \''+g.en+'\'. Take it with you."'))}
      if(miss.length)persist();
      say(pre.concat([N('Das un paso al frente y dices «mari mari» en voz alta, en medio de la cancha. El Yewen levanta la cabeza.','You step forward and say "mari mari" out loud, in the middle of the cancha. The Yewen lifts its head.')]),()=>startBattle(['yewen'],{boss:1,sflag:'yewen_won',song:'yewenBoss'}))},true,false)});
}
function stPaseoTalk(){
  const en=S.gloss==='en',v=rot('spaseo',3);
  if(v===0)return say([L('Wariache','Mari mari... ¿se dice así? Me da no sé qué decirlo en la calle.','Mari mari... ¿se dice así? Me da no sé qué decirlo en la calle.','Mari mari... is that right? It feels odd saying it out loud in the street.'),N('Mira para los lados antes de decirlo. Eso también es el yewen.','He looks around before saying it. That, too, is the yewen.')]);
  if(v===1)return say([L('Wariache','Mi apellido es mapuche, pero yo nunca aprendí. Mi mamá decía que no servía para nada en Santiago.','Mi apellido es mapuche, pero yo nunca aprendí. Mi mamá decía que no servía para nada en Santiago.','My surname is Mapuche, but I never learned. My mom said it was no use in Santiago.'),N('«Ahora en la plaza hay un letrero... y me dieron ganas.»','"Now there is a sign in the plaza... and it made me want to."')]);
  return say([L('Wariache','Pewkayal!','¡Hasta luego! (pewkayal: nos vemos)','See you! (pewkayal: see you later)'),N('Lo dice rápido y sigue caminando, pero sonríe.','He says it fast and keeps walking, but he is smiling.')]);
}
function stFeriaTalk(){
  const en=S.gloss==='en',v=rot('sferia',3);
  if(v===0)return say([L('Casera','¡Casera, caserito! Poñü, kofke, kachilla... ¿cómo se dice tomate?','¡Casera, caserito! Poñü (papas), kofke (pan), kachilla (trigo)... ¿cómo se dice tomate?','Casera, caserito! Poñü (potatoes), kofke (bread), kachilla (wheat)... how do you say tomato?'),N('Se ríe: «¡tomate no más, pues! Esa llegó con los españoles... bueno, al revés.»','She laughs: "just tomate! That one came with the Spaniards... well, the other way round."')]);
  if(v===1)return say([L('Casera','Kiñe kilo, epu kilo, küla kilo... ¡así le cobro a los que saben!','Un kilo, dos kilos, tres kilos... ¡así le cobro a los que saben!','One kilo, two kilos, three kilos... that is how I charge the ones who know!'),N('Te regala una manzana. «Manshana. Esa sí es prestada.»','She gives you an apple. "Manshana. That one is borrowed, yes."')]);
  return say([L('Casera','Chaltu may, pichi weche. Vuelva el domingo.','Gracias, joven. Vuelva el domingo.','Thank you, young one. Come back on Sunday.')]);
}
function stChoferTalk(){
  const v=rot('schofer',2);
  if(v===0)return say([L('Chofer','¡Sube, sube! ...Oiga, ¿usted sabe cómo se dice «micro» en mapudungun?','¡Sube, sube! ...Oiga, ¿usted sabe cómo se dice «micro» en mapudungun?','Get on, get on! ...Hey, do you know how to say "bus" in Mapudungun?'),N('Se queda pensando. «Mi abuelo decía kareta para la carreta. Micro... micro no más, pues.»','He thinks about it. "My grandpa said kareta for the cart. Bus... just micro, I guess."')]);
  return say([L('Chofer','Amuayu! ...¿así? Vamos los dos. Me lo enseñó un pasajero.','¡Vamos (tú y yo)! ...¿así? Me lo enseñó un pasajero.','Let us go, you and I! ...like that? A passenger taught me.'),N('Toca la bocina dos veces, contento.','He honks twice, pleased.')]);
}
function stEstudTalk(){
  const v=rot('sestud',2);
  if(v===0)return say([L('Estudiante','Mañana tengo prueba de historia. Sale el «pueblo mapuche», dos páginas. Y de la lengua, nada.','Mañana tengo prueba de historia. Sale el «pueblo mapuche», dos páginas. Y de la lengua, nada.','Tomorrow I have a history test. The "Mapuche people" are in it, two pages. And nothing about the language.'),N('Cierra el cuaderno. «¿Tú lo hablas? ¿De verdad?»','She closes the notebook. "Do you speak it? Really?"')]);
  return say([L('Estudiante','Kimün... conocimiento. Eso sí lo anoté.','Kimün... conocimiento. Eso sí lo anoté.','Kimün... knowledge. That one I did write down.')]);
}
function stKidsTalk(){
  const en=S.gloss==='en';
  if(S.flags.st1)return say([L('Pichikeche','Kiñe, epu, küla, meli, kechu!','¡Uno, dos, tres, cuatro, cinco!','One, two, three, four, five!'),N('Los niños cuentan a gritos, saltando la cuerda.','The kids count at the top of their lungs, jumping rope.')]);
  const qs=[{q:L('Pichiche','"Epu"... ¿cuánto es?','"Epu", ¿cuánto es?','"Epu", how many is that?'),o:['2','3','5'],a:'2'},
    {q:L('Pichiche','¿Qué viene después de "küla"?','¿Qué viene después de "küla" (3)?','What comes after "küla" (3)?'),o:['meli','kechu','mari'],a:'meli'},
    {q:L('Pichiche','"Mari"... ¿cuánto es?','"Mari", ¿cuánto es?','"Mari", how many is that?'),o:['5','10','100'],a:'10'}];
  say([L('Pichiche','Tío, tía! ¿Sabí contar en mapudungun?','¡Tío, tía! ¿Sabí contar en mapudungun?','Hey! Do you know how to count in Mapudungun?'),
    N('Los niños de la plaza quieren saltar la cuerda contando en mapudungun, pero se les enredan los números. Enséñales.','The plaza kids want to jump rope counting in Mapudungun, but the numbers get tangled. Teach them.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length)return stReward('st1',()=>{S.gold+=20},[praise(),L('Pichikeche','Kiñe, epu, küla...!','¡Uno, dos, tres...!','One, two, three...!'),N('Los niños saltan la cuerda contando en mapudungun, cada vez más fuerte. Te dan epu mari (20) ngülliw de sus alcancías, muy serios.','The kids jump rope counting in Mapudungun, louder and louder. They give you epu mari (20) ngülliw from their piggy banks, very serious.')]);
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('Santiago',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Pichiche','¿Seguro?...','¿Seguro?...','Are you sure?...')],()=>ask(0))}},true,false)}
}
function stMuralTalk(){
  const en=S.gloss==='en';
  if(S.flags.st3)return say([L('Muralista','¡Quedó hermoso! Chaltu may.','¡Quedó hermoso! Chaltu may.','It turned out beautiful! Chaltu may.'),N('El mural brilla con palabras enormes: KO · MAPU · CHE · NEWEN.','The mural glows with huge words: KO · MAPU · CHE · NEWEN.')]);
  const qs=[{q:N('Para el agua del mural: ¿cuál es la palabra?','For the water in the mural: which is the word?'),o:['ko','kura','kütral'],a:'ko'},
    {q:N('Para la tierra: ¿cuál es la palabra?','For the land: which is the word?'),o:['mawün','mapu','manke'],a:'mapu'},
    {q:N('Para la gente: ¿cuál es la palabra?','For the people: which is the word?'),o:['che','chem','chew'],a:'che'}];
  say([L('Muralista','¡Hola! Estoy pintando un mural para la población.','¡Hola! Estoy pintando un mural para la población.','Hi! I am painting a mural for the neighborhood.'),
    N('Quiere escribir las palabras grandes en mapudungun, pero no está segura de cuáles son. Ayúdala a elegirlas.','She wants to paint the big words in Mapudungun, but she is not sure which ones they are. Help her choose.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length)return stReward('st3',()=>{S.gold+=30},[praise(),L('Muralista','¡Eso es! KO... MAPU... CHE...','¡Eso es! KO... MAPU... CHE...','That is it! KO... MAPU... CHE...'),N('Pinta las palabras enormes, de colores. La gente se para a mirarlas y las lee en voz alta. Te da küla mari (30) ngülliw.','She paints the words huge, in bright colors. People stop to look and read them out loud. She gives you küla mari (30) ngülliw.')]);
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('Santiago',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Muralista','Mmm, no me suena...','Mmm, no me suena...','Hmm, that does not sound right...')],()=>ask(0))}},true,false)}
}
function stAbuelaTalk(){
  if(S.flags.st2)return say([L('Papay','Tañi pu füchakeche ñi kewün, tañi pu püñeñ ñi kewün. Tañi pu püñeñ ñi pichike choyün ñi kewün.','La lengua de mis mayores, la lengua de mis hijos. La lengua de los pequeños brotes de mis hijos.','The language of my elders, the language of my children. The language of my children\'s little sprouts.'),N('La papay sonríe, tejiendo. Sus nietos practican el pentukuwün en un rincón de la ruka.','The papay smiles, weaving. Her grandchildren practice the pentukuwün in a corner of the ruka.')]);
  const steps=[
    {q:L('Papay','A ver: te pregunto "Chumleymi?". ¿Qué respondes?','A ver: te pregunto "¿cómo estás?". ¿Qué respondes?','Let me ask you: "How are you?". What do you answer?'),
     o:[{m:'Kümelen, chaltu. Eymi kay?',ok:1},{m:'Kümeleymi.'},{m:'Chew tuwimi?'}]},
    {q:L('Papay','"Chew tuwimi?" te pregunto ahora.','Ahora te pregunto: "¿De dónde vienes?"','Now I ask you: "Where are you from?"'),
     o:[{m:'Santiago waria mew tuwün.',ok:1},{m:'Santiago mew tuwimi.'},{m:'Kümelen.'}]},
    {q:L('Papay','Y al final: "Chumleyngün tami pu che?"','Y al final: "¿Cómo está tu gente?"','And last: "How are your people?"'),
     o:[{m:'Kümeleyngün.',ok:1},{m:'Kümelen.'},{m:'Kümeleymi.'}]}];
  say([L('Papay','Konpange! Quiero enseñarles el pentukuwün a mis nietos.','¡Pasa! Quiero enseñarles el pentukuwün a mis nietos.','Come in! I want to teach my grandchildren the pentukuwün.'),
    N('«Pero hace tanto que no lo hago... Practica conmigo, para que me salga de corrido y ellos lo escuchen bien hecho.»','"But it has been so long... Practice with me, so it flows and they hear it done right."')],()=>step(0));
  function step(i){
    if(i>=steps.length)return stReward('st2',()=>{S.items.kofke+=2},[praise(),L('Papay','Fey tüfey! Kümey, kümey.','¡Eso es! Bien, bien.','That is it! Good, good.'),N('Los nietos repiten el saludo, primero bajito, después a gritos. La papay te da epu kofke recién hechos.','The grandchildren repeat the greeting, first in a whisper, then at the top of their lungs. The papay gives you two fresh kofke.')]);
    const st2=steps[i];const opts=st2.o.map((o,k)=>({m:o.m,v:k}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(st2.q,opts,v=>{if(st2.o[v].ok){sfx('ok');step(i+1)}else{sfx('bad');say([L('Papay','Mmm... piensa otra vez, pichiche.','Mmm... piensa otra vez.','Hmm... think again.')],()=>step(i))}},true,false)}
}
function stLiderTalk(){
  const en=S.gloss==='en';
  if(S.flags.st4)return say([L('Longko waria','Trawün müley! Kom pu che küpay.','¡Hay encuentro! Viene toda la gente.','There is a gathering! Everyone is coming.'),N('La ruka urbana está llena: clases, telar, palin en la cancha de al lado. El werken anota nombres y nombres.','The urban ruka is full: classes, weaving, palin on the field next door. The werken writes down name after name.')]);
  const qs=[{q:N('Para abrir el trawün ante toda la gente, ¿qué se dice?','To open the gathering before everyone, what do you say?'),o:['Mari mari kom pu che','Pewkayal','Fey no'],a:'Mari mari kom pu che'},
    {q:N('Para dar las gracias a los que vinieron:','To thank those who came:'),o:['Chaltu may pu che','Amutunge','Kümelen'],a:'Chaltu may pu che'},
    {q:N('Para invitarlos a hablar, uno por uno:','To invite them to speak, one by one:'),o:['Dungunge, chaltu','Umawtunge','Lefnge'],a:'Dungunge, chaltu'}];
  say([L('Longko waria','Mari mari. Estamos organizando un trawün, un gran encuentro.','Mari mari. Estamos organizando un trawün, un gran encuentro.','Mari mari. We are organizing a trawün, a great gathering.'),
    N('El longko de la ruka urbana quiere abrir el encuentro en mapudungun, como corresponde. Ayúdalo con las palabras del trawün.','The leader of the urban ruka wants to open the gathering in Mapudungun, as is proper. Help him with the words of the trawün.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length)return stReward('st4',()=>{S.items.lawen++},[praise(),L('Longko waria','Mari mari kom pu che!','¡Mari mari a toda la gente!','Mari mari to all the people!'),N('Lo dice fuerte, de corrido, y la ruka entera responde. Te da un lawen del huerto del centro.','He says it loud and clear, and the whole ruka answers. He gives you a lawen from the garden of the center.')]);
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('Santiago',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Longko waria','Mmm, no es eso...','Mmm, no es eso...','Hmm, that is not it...')],()=>ask(0))}},true,false)}
}
function stTeenTalk(){
  const en=S.gloss==='en';
  if(S.flags.st5)return say([L('Weche','Mari mari! Iñche... iñche wariache mapuche ngen.','¡Mari mari! Yo... yo soy mapuche de la ciudad.','Mari mari! I... I am a Mapuche of the city.'),N('Lo dice fuerte, sin agachar la cabeza. Le queda bien.','He says it loud, without lowering his head. It suits him.')]);
  const qs=[{q:N('El weche dice: "me da vergüenza, lo hablo mal". ¿Qué palabra le recuerdas? La fuerza:','The teen says: "I am embarrassed, I speak it badly". Which word do you remind him of? Strength:'),o:['newen','ngoyman','wekufü'],a:'newen'},
    {q:N('"¿Y si me equivoco?" Le dices que equivocarse también es...','"What if I get it wrong?" You tell him that getting it wrong is also...'),o:[en?'learning (kimün)':'aprender (kimün)',en?'forgetting (ngoyman)':'olvidar (ngoyman)',en?'running (lef)':'correr (lef)'],a:en?'learning (kimün)':'aprender (kimün)'},
    {q:N('"¿Y yo puedo ser mapuche, si nací aquí?" Tú naciste aquí también. ¿Qué eres?','"Can I even be Mapuche, if I was born here?" You were born here too. What are you?'),o:[en?'wariache: Mapuche of the city':'wariache: mapuche de la ciudad',en?'a stranger':'un extraño',en?'a wekufü':'un wekufü'],a:en?'wariache: Mapuche of the city':'wariache: mapuche de la ciudad'}];
  say([L('Weche','...¿Tú hablas mapudungun? Yo quiero, pero...','...¿Tú hablas mapudungun? Yo quiero, pero...','...Do you speak Mapudungun? I want to, but...'),
    N('Un joven de la población te mira de reojo. Quiere aprender, pero le da vergüenza. Tú también empezaste sabiendo dos palabras. Dile lo que aprendiste en el camino.','A teenager from the neighborhood looks at you sideways. He wants to learn, but he is embarrassed. You also started knowing two words. Tell him what you learned on the road.')],()=>ask(0));
  function ask(i){
    if(i>=qs.length)return stReward('st5',()=>{S.piwke++;if(S.piwke%4===0)S.hp=Math.min(maxHP(),S.hp+HPQ)},[praise(),L('Weche','Ya... voy a ir a la ruka el jueves.','Ya... voy a ir a la ruka el jueves.','Okay... I will go to the ruka on Thursday.'),N('Sonríe por primera vez, y practica bajito: "mari mari... mari mari...". Te regala algo que encontró y guardaba: un pedazo de piwke, rojo y brillante.','He smiles for the first time and practices under his breath: "mari mari... mari mari...". He gives you something he found and kept: a piwke piece, red and shining.')]);
    const q=qs[i];const o=q.o.map(m=>({m,v:m}));for(let a=o.length-1;a>0;a--){const b=rnd(a+1);[o[a],o[b]]=[o[b],o[a]]}
    choose(q.q,o,v=>{if(trk('Santiago',v,q)){sfx('ok');ask(i+1)}else{sfx('bad');say([L('Weche','...no sé si eso me ayuda.','...no sé si eso me ayuda.','...I am not sure that helps.')],()=>ask(0))}},true,false)}
}

/* ---------- Kuyfi chillka: six ancient carved tablets, each a Mapudungun lesson. All six = the trarilongko ---------- */
const TABLETS={
  saludo:{t:N('Saludar y despedirse','Greeting and leaving'),lines:[
    L('','Mari mari!','Hola (a una persona o a muchas).','Hello (to one person or to many).'),
    L('','Chumleymi? · Kümelen, eymi kay?','¿Cómo estás? · Estoy bien, ¿y tú?','How are you? · I am well, and you?'),
    L('','Chaltu may! · Pewkayal!','¡Gracias! · ¡Hasta luego!','Thank you! · See you later!')],
   qs:[{q:L('','Chumleymi?','Te preguntan esto. ¿Qué respondes?','Someone asks you this. What do you answer?'),o:['Kümelen, eymi kay?','Pewkayal!','Mari mari pingen'],a:'Kümelen, eymi kay?'},
       {q:N('¿Cómo das las gracias?','How do you say thank you?'),o:['Chumleymi?','Chaltu may!','Pewkayal!'],a:'Chaltu may!'}]},
  mew:{t:N('Dónde: mew','Where: mew'),lines:[
    N('mew va después del nombre del lugar: dice dónde estás o adónde vas.','mew comes after the place: it says where you are or where you go.'),
    L('','ruka mew · lafken mew · mawida mew','en la casa · en el mar · en el monte','at home · at the sea · in the forest'),
    L('','Ruka mew mülen. · Lafken mew amuan.','Estoy en la casa. · Iré al mar.','I am at home. · I will go to the sea.')],
   qs:[{q:L('','Ruka mew mülen.','¿Qué significa?','What does it mean?'),o:['Estoy en la casa.','Voy a la casa.','Mi casa es grande.'],a:'Estoy en la casa.'},
       {q:N('¿Cómo se dice «iré al monte»?','How do you say «I will go to the forest»?'),o:['Mawida mülen.','Mawida mew amuan.','Mawida amun mew.'],a:'Mawida mew amuan.'}]},
  kalül:{t:N('El cuerpo','The body'),lines:[
    L('','lonko · nge · pilun · wün','cabeza · ojo · oreja · boca','head · eye · ear · mouth'),
    L('','kuwü · namun · piwke','mano · pie (pierna) · corazón','hand · foot (leg) · heart'),
    N('lonko también es el jefe del lof: la «cabeza» de la comunidad.','lonko is also the leader of the lof: the «head» of the community.')],
   qs:[{q:L('','kuwü','¿Qué es?','What is it?'),o:['el pie','la mano','la oreja'],a:'la mano'},
       {q:N('¿Cómo se dice «cabeza»?','How do you say «head»?'),o:['lonko','namun','pilun'],a:'lonko'}]},
  antu:{t:N('El tiempo: hoy, ayer, mañana','Time: today, yesterday, tomorrow'),lines:[
    L('','fewla · wiya · wüle','ahora · ayer · mañana','now · yesterday · tomorrow'),
    L('','liwen · antü · pun','la mañana temprano · el día (el sol) · la noche','early morning · day (the sun) · night'),
    L('','Wiya amun. · Wüle amuan.','Ayer fui. · Mañana iré.','Yesterday I went. · Tomorrow I will go.')],
   qs:[{q:L('','wüle','¿Qué significa?','What does it mean?'),o:['ayer','mañana','ahora'],a:'mañana'},
       {q:L('','Wiya amun.','¿Qué significa?','What does it mean?'),o:['Ayer fui.','Mañana iré.','Ahora voy.'],a:'Ayer fui.'}]},
  kulliñ:{t:N('Los animales del mapu','The animals of the land'),lines:[
    L('','kawellu · trewa · waka','caballo · perro · vaca','horse · dog · cow'),
    L('','choyke · luan · pangi · mañke','ñandú · guanaco · puma · cóndor','rhea · guanaco · puma · condor'),
    N('Muchas palabras para animales nuevos vienen del castellano (kawellu, waka); las de los animales de siempre son mapuche.','Many words for newly arrived animals come from Spanish (kawellu, waka); those for the animals that were always here are Mapuche.')],
   qs:[{q:L('','choyke','¿Qué animal es?','Which animal is it?'),o:['el puma','el ñandú','el cóndor'],a:'el ñandú'},
       {q:N('¿Cómo se dice «puma»?','How do you say «puma»?'),o:['pangi','luan','trewa'],a:'pangi'}]},
  rakizuam:{t:N('Cómo te sientes: -le-, -külen','How you feel: -le-, -külen'),lines:[
    N('-le- y -külen dicen cómo estás ahora mismo.','-le- and -külen say how you are right now.'),
    L('','Kümelen. · Ayiwkülen. · Weñankülen.','Estoy bien. · Estoy feliz. · Estoy triste.','I am well. · I am happy. · I am sad.'),
    N('El olvido se alimenta de la tristeza callada: decir cómo te sientes también es newen.','The forgetting feeds on silent sorrow: saying how you feel is newen too.')],
   qs:[{q:L('','Ayiwkülen.','¿Qué significa?','What does it mean?'),o:['Estoy triste.','Estoy feliz.','Estoy cansado.'],a:'Estoy feliz.'},
       {q:N('¿Cómo se dice «estoy triste»?','How do you say «I am sad»?'),o:['Weñankülen.','Kümelen.','Ayiwkülen.'],a:'Weñankülen.'}]}};
const TAB_IDS=Object.keys(TABLETS);
const tabCount=()=>TAB_IDS.filter(t=>S.flags['tab_'+t]).length;
function tabletTalk(id){
  const T=TABLETS[id],en=S.gloss==='en';
  if(S.flags['tab_'+id])return choose(L('','Kuyfi chillka','La piedra brilla tranquila. ¿Vuelves a leerla?','The stone glows quietly. Read it again?'),
    [{m:'May',g:en?'Read the lesson':'Leer la lección',v:1},{m:'Wüla feman',g:en?'Later':'Después',v:0}],v=>{if(v)say([T.t].concat(T.lines))},true,true);
  const first=!S.flags.tab_seen;S.flags.tab_seen=1;
  say((first?[N('Una piedra antigua, verde de musgo, tallada de arriba abajo con signos. Bajo el musgo se leen palabras en mapudungun: la dejaron los kuyfikeche, la gente de antes, para que nadie olvidara.','An ancient stone, green with moss, carved from top to bottom. Under the moss you can read words in Mapudungun: the kuyfikeche, the people of long ago, left it so that no one would forget.'),
      N('Dicen que quien despierta las seis kuyfi chillka recibe un trarilongko que protege como ningún otro.','They say whoever wakes all six kuyfi chillka receives a trarilongko that protects like no other.')]
    :[N('Otra kuyfi chillka, cubierta de musgo. Le quitas el musgo y lees.','Another kuyfi chillka, covered in moss. You brush the moss away and read.')]).concat([T.t],T.lines,[N('Los signos se apagan, esperando: la piedra quiere saber si aprendiste.','The signs dim, waiting: the stone wants to know if you learned.')]),()=>ask(0));
  function ask(i){
    if(i>=T.qs.length){S.flags['tab_'+id]=1;S.xp+=8;sfx('lvl');const n=tabCount();persist();
      const ls=[N('Los signos se encienden uno por uno, de abajo hacia arriba. La piedra está despierta. +8 kimün. ('+n+'/6)','The signs light up one by one, from the bottom up. The stone is awake. +8 kimün. ('+n+'/6)'),praise()];
      if(n>=6&&!S.gear.trarilongko){S.gear.trarilongko=1;persist();
        ls.push(Object.assign(L('','Trarilongko!','Las seis piedras cantan a la vez, lejos y cerca. Del musgo cae un trarilongko antiguo, tejido con hilo que brilla. Te lo amarras en la frente: tu defensa sube +3.','The six stones sing at once, near and far. An ancient trarilongko falls from the moss, woven with shining thread. You tie it around your forehead: defense +3.'),{fx:()=>sfx('lvl')}))}
      return say(ls,()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const q=T.qs[i],opts=q.o.map(o=>({m:o,v:o}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(q.q,opts,v=>{if(trk('kuyfi chillka',v,q)){sfx('ok');ask(i+1)}
      else{sfx('bad');const hd=S.hm?heroHurt():0;say([N((hd?'(−'+hd+') ':'')+'Los signos tiemblan y se apagan. La respuesta era: '+q.a+'. Lee la piedra otra vez.',(hd?'(−'+hd+') ':'')+'The signs tremble and go dark. The answer was: '+(OPT_EN[q.a]||q.a)+'. Read the stone again.')].concat(T.lines),()=>ask(0))}},false,true)}
}

/* ---------- Nütramkan: a young visitor in every lof who wants to practise talking ---------- */
const NUTK={
  lof:{who:'Rayen',set:[
    {q:L('Rayen','Mari mari!','Te saluda.','She greets you.'),o:['Mari mari!','Pewkayal!','Chaltu may!'],a:'Mari mari!'},
    {q:L('Rayen','Chumleymi?','¿Cómo estás?','How are you?'),o:['Kümelen, eymi kay?','Fewla.','Ruka mew.'],a:'Kümelen, eymi kay?'},
    {q:L('Rayen','Iney pingeymi am?','¿Cómo te llamas?','What is your name?'),o:['Iñche @ pingen.','Kümelen.','Lafken mew.'],a:'Iñche @ pingen.'}]},
  n_lof:{who:'Kallfü',set:[
    {q:L('Kallfü','Chew tuwimi?','¿De dónde eres?','Where are you from?'),o:['Lafken mew tuwün.','Lafken mew amuan.','Lafken pingen.'],a:'Lafken mew tuwün.'},
    {q:L('Kallfü','Chew amuaymi?','¿Adónde vas?','Where are you going?'),o:['Mawida mew amuan.','Mawida mew tuwün.','Mawida pingen.'],a:'Mawida mew amuan.'},
    {q:L('Kallfü','Kimimi mapudungun?','¿Sabes mapudungun?','Do you know Mapudungun?'),o:['Kimnierpuken.','Amuyngün.','Kiñe pataka.'],a:'Kimnierpuken.'}]},
  p_lof:{who:'Rayen',set:[
    {q:L('Rayen','Kofketuaymi?','¿Vas a comer pan?','Will you eat bread?'),o:['May, kofketuan.','May, kofketuay.','Iyael pingen.'],a:'May, kofketuan.'},
    {q:L('Rayen','Chem ayüymi?','¿Qué te gusta?','What do you like?'),o:['Ngülliw ayüfiñ.','Ngülliw pingen.','Ngülliw mew tuwün.'],a:'Ngülliw ayüfiñ.'},
    {q:L('Rayen','Wütreymi?','¿Tienes frío?','Are you cold?'),o:['May, wütren.','May, wütrey.','Wütre ruka.'],a:'May, wütren.'}]},
  w_lof:{who:'Millanao',set:[
    {q:L('Millanao','Chumngechi pingekey «lluvia»?','¿Cómo se dice «lluvia»?','How do you say «rain»?'),o:['Mawün.','Antü.','Kürüf.'],a:'Mawün.'},
    {q:L('Millanao','Chumngechi pingekey «sol»?','¿Cómo se dice «sol»?','How do you say «sun»?'),o:['Antü.','Küyen.','Wangülen.'],a:'Antü.'},
    {q:L('Millanao','Chumngechi pingekey «luna»?','¿Cómo se dice «luna»?','How do you say «moon»?'),o:['Küyen.','Antü.','Pire.'],a:'Küyen.'}]},
  e_lof:{who:'Nawel',set:[
    {q:L('Nawel','Chumngechi pingekey «caballo»?','¿Cómo se dice «caballo»?','How do you say «horse»?'),o:['Kawellu.','Trewa.','Choyke.'],a:'Kawellu.'},
    {q:L('Nawel','Epu ka küla: tunten?','Dos y tres: ¿cuánto es?','Two and three: how much?'),o:['Kechu.','Meli.','Kayu.'],a:'Kechu.'},
    {q:L('Nawel','Chew müley ta choyke?','¿Dónde está el ñandú?','Where is the rhea?'),o:['Lelfün mew.','Choyke pingen.','Kechu choyke.'],a:'Lelfün mew.'}]}};
/* second conversation with each nütramkan partner, once the first is done (Tanda 24) */
const NUTK2={
  lof:[
    {q:L('Rayen','Chew müley tami ruka?','¿Dónde está tu casa?','Where is your house?'),o:['Lafken mew müley.','Lafken mew amuan.','Lafken pingey.'],a:'Lafken mew müley.'},
    {q:L('Rayen','Lamngen nieymi?','¿Tienes hermanos?','Do you have siblings?'),o:['May, epu lamngen nien.','May, epu lamngen niey.','Epu lamngen pingen.'],a:'May, epu lamngen nien.'},
    {q:L('Rayen','Küdawkeymi?','¿Trabajas?','Do you work?'),o:['May, küdawken.','May, küdawkey.','Küdaw pingen.'],a:'May, küdawken.'}],
  n_lof:[
    {q:L('Kallfü','Tunten tripantu nieymi?','¿Cuántos años tienes?','How old are you?'),o:['Mari kechu tripantu nien.','Mari kechu tripantu niey.','Mari kechu pingen.'],a:'Mari kechu tripantu nien.'},
    {q:L('Kallfü','Tunten kawellu niey tami chaw?','¿Cuántos caballos tiene tu papá?','How many horses does your father have?'),o:['Küla kawellu niey.','Küla kawellu nien.','Küla kawellu pingey.'],a:'Küla kawellu niey.'},
    {q:L('Kallfü','Ayüymi ti palin?','¿Te gusta el palin?','Do you like palin?'),o:['May, ayüfiñ.','May, ayüy.','Palin pingen.'],a:'May, ayüfiñ.'},
    {q:L('Kallfü','Wüle palituaiñ?','¿Jugamos palin mañana?','Shall we play palin tomorrow?'),o:['May, wüle.','Wiya.','Kuyfi.'],a:'May, wüle.'}],
  p_lof:[
    {q:L('Rayen','Iney pingey tami ñuke?','¿Cómo se llama tu mamá?','What is your mother called?'),o:['Tañi ñuke Kallfüray pingey.','Tami ñuke Kallfüray pingey.','Tañi ñuke Kallfüray pingen.'],a:'Tañi ñuke Kallfüray pingey.'},
    {q:L('Rayen','Chew müley tami kuku?','¿Dónde está tu abuela (paterna)?','Where is your (paternal) grandmother?'),o:['Ruka mew müley.','Ruka mew amuan.','Ruka pingey.'],a:'Ruka mew müley.'},
    {q:L('Rayen','Iney am tami chuchu?','¿Quién es tu chuchu?','Who is your chuchu?'),o:['Tañi ñuke ñi ñuke.','Tañi chaw ñi ñuke.','Tañi ñuke ñi chaw.'],a:'Tañi ñuke ñi ñuke.'},
    {q:L('Rayen','Pewkayal, @!','¡Hasta luego!','See you later!'),o:['Pewkayal!','Mari mari!','Kümelen.'],a:'Pewkayal!'}],
  w_lof:[
    {q:L('Millanao','Mawünküley?','¿Está lloviendo?','Is it raining?'),o:['May, mawünküley.','May, mawünkülen.','Mawün pingey.'],a:'May, mawünküley.'},
    {q:L('Millanao','Anünge, @.','Siéntate.','Sit down.'),o:['Chaltu may.','Pewkayal.','Anüy.'],a:'Chaltu may.'},
    {q:L('Millanao','Küdawküleymi?','¿Estás trabajando?','Are you working?'),o:['May, küdawkülen.','May, küdawküley.','Küdaw pingen.'],a:'May, küdawkülen.'},
    {q:L('Millanao','Umawtuley tami kuku?','¿Tu abuela está durmiendo?','Is your grandmother sleeping?'),o:['May, umawtuley.','May, umawtulen.','Umawtu pingey.'],a:'May, umawtuley.'}],
  e_lof:[
    {q:L('Nawel','Chumül akuymi?','¿Cuándo llegaste?','When did you arrive?'),o:['Wiya akun.','Wüle akuan.','Wiya akuy.'],a:'Wiya akun.'},
    {q:L('Nawel','Chumül amuaymi?','¿Cuándo te vas?','When will you leave?'),o:['Wüle amuan.','Wiya amun.','Wüle amuay.'],a:'Wüle amuan.'},
    {q:L('Nawel','Fewla iyaymi?','¿Vas a comer ahora?','Will you eat now?'),o:['Wüla müten.','Wiya.','Kuyfi.'],a:'Wüla müten.'},
    {q:L('Nawel','Pewkayal, @!','¡Hasta luego!','See you later!'),o:['Pewkayal!','Mari mari!','Fewla.'],a:'Pewkayal!'}]};
function nutkTalk(lofId){
  const first=!!S.flags['ntk_'+lofId],two=first&&NUTK2[lofId];
  let D=NUTK[lofId],fl='ntk_'+lofId,done=first;const nm=S.name;
  if(two&&(!S.flags['ntk2_'+lofId]||Math.random()<.5)){D={who:D.who,set:NUTK2[lofId]};fl='ntk2_'+lofId;done=!!S.flags[fl]}
  if(D.who===S.name)D={who:'\u200b'+D.who,set:D.set};   // a namesake (a partner with the player's own name): a hidden mark so their lines keep their own portrait
  const sub=s=>s.replace('@',nm);
  say([L(D.who,'Mari mari! Nütramkayaiñ?','¡Hola! ¿Conversamos? Estoy aprendiendo y quiero practicar.','Hello! Shall we talk? I am learning and I want to practise.')],()=>{
    choose(L('','Nütramkayaiñ?','¿Conversas con '+D.who+'?','Talk with '+D.who+'?'),[{m:'May',g:S.gloss==='en'?'Yes, let us talk':'Sí, conversemos',v:1},{m:'Wüla feman',g:S.gloss==='en'?'Later':'Después',v:0}],v=>{if(v)step(0)},true,true)});
  function step(i){
    if(i>=D.set.length){const ls=[L(D.who,'Kümey! Pewkayal!','¡Muy bien! ¡Hasta luego!','Very good! See you later!')];
      if(!done){S.flags[fl]=1;S.gold+=15;S.xp+=6;sfx('lvl');ls.push(N('+15 ngülliw · +6 kimün.','+15 ngülliw · +6 kimün.'));
        if(fl.startsWith('ntk2_')&&Object.keys(NUTK2).every(k=>S.flags['ntk2_'+k])&&!S.flags.ntk2_all){S.flags.ntk2_all=1;S.items.mate=(S.items.mate||0)+3;ls.push(N('Conversaste dos veces en los cinco lof. Te regalan tres mate más.','You have talked twice in all five lof. They give you three more mate.'))}
        const all=Object.keys(NUTK).every(k=>S.flags['ntk_'+k]);
        if(all&&!S.flags.ntk_all){S.flags.ntk_all=1;S.items.mate=(S.items.mate||0)+3;ls.push(N('Conversaste en los cinco lof. La gente joven te regala tres mate para el camino.','You have talked in all five lof. The young people give you three mate for the road.'))}
        persist()}
      return say(ls,()=>{if(S.xp>=xpNeed())levelUpCheck()})}
    const s=D.set[i],opts=s.o.map(o=>({m:sub(o),v:o}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    const sq=Object.assign({},s.q,{m:sub(s.q.m)});choose(sq,opts,v=>{track('nütramkan',v===s.a,sq,s.o.map(sub),sub(s.a));if(v===s.a){sfx('ok');step(i+1)}
      else{sfx('bad');say([L(D.who,'Feyta chi no...','Eso no...','Not that...'),N('Se podía decir: «'+sub(s.a)+'». Probemos otra vez.','You could say: «'+sub(s.a)+'». Let us try again.')],()=>step(i))}},false,true)}
}

/* ---------- Trawün: in one ruka of every lof, a kimeltuchefe gives a real 2-3 minute Mapudungun lesson.
   Each lesson: explanation, the group repeating, three practice questions woven in, a summary for the chillka. ---------- */
const TRW_T={lof:'Ñanku',n_lof:'Küyen',p_lof:'Lienlaf',w_lof:'Liwen',e_lof:'Kallfükura'},TRW_F={lof:0,n_lof:1,p_lof:0,w_lof:1,e_lof:0};
const TRAWUN={
 lof:{t:N('Iñche, eymi, fey: quién hace la acción','Iñche, eymi, fey: who does the action'),steps:[
  N('El verbo mapuche dice quién hace la acción con su terminación. Hoy: yo, tú, él o ella.','The Mapuche verb says who acts through its ending. Today: I, you, he or she.'),
  L('@','Iñche amun.','Yo voy. La terminación -n es «yo».','I go. The ending -n is "I".'),
  L('@','Eymi amuymi.','Tú vas. -ymi es «tú».','You go. -ymi is "you".'),
  L('@','Fey amuy.','Él o ella va. -y es «él» o «ella».','He or she goes. -y is "he" or "she".'),
  L('Pu che','Iñche amun! Eymi amuymi! Fey amuy!','(Todos repiten juntos.)','(Everyone repeats together.)'),
  N('Si la raíz termina en consonante, se cuela una vocal: küdaw- (trabajar) da küdawün, küdawimi, küdawi.','If the root ends in a consonant, a vowel slips in: küdaw- (work) gives küdawün, küdawimi, küdawi.'),
  L('@','Iñche küdawün. Eymi küdawimi. Fey küdawi.','Yo trabajo. Tú trabajas. Él o ella trabaja.','I work. You work. He or she works.'),
  {q:L('@','Fey ___ (iya-, comer)','Él o ella come.','He or she eats.'),o:['iyan','iyaymi','iyay'],a:'iyay',why:N('-y es la tercera persona: iyay.','-y is the third person: iyay.')},
  N('El pronombre se puede omitir: «Amun» ya dice «voy». Y la misma forma sirve para algo que pasó hace poco: «Wiya amun», ayer fui.','You can drop the pronoun: "Amun" already means "I go". The same form also works for something just done: "Wiya amun", I went yesterday.'),
  {q:N('¿Cómo se dice «tú trabajas»?','How do you say "you work"?'),o:['küdawün','küdawimi','küdawi'],a:'küdawimi',why:N('küdaw- + -imi: küdawimi.','küdaw- + -imi: küdawimi.')},
  {q:L('@','Iñche ___ mapudungun (kim-, saber)','Yo sé mapudungun.','I know Mapudungun.'),o:['kimün','kimimi','kimi'],a:'kimün',why:N('kim- + -ün: kimün.','kim- + -ün: kimün.')},
  N('¿Viste? «Kimün» es también «el saber». Por eso tu nivel en este viaje se llama kimün: cada palabra que aprendes es kimün.','See? "Kimün" also means "knowledge". That is why your level on this journey is called kimün: every word you learn is kimün.'),
  N('Más verbos, la misma regla. Si la raíz termina en vocal, las terminaciones se pegan directo.','More verbs, same rule. If the root ends in a vowel, the endings attach directly.'),
  L('@','Pen. Peymi. Pey.','Veo (vi). Ves. Ve.','I see (saw). You see. He or she sees.'),
  L('@','Ülkantun. Ülkantuymi. Ülkantuy.','Canto. Cantas. Canta.','I sing. You sing. He or she sings.'),
  L('Pu che','Ülkantun! Ülkantuymi! Ülkantuy!','(Todos repiten, y alguien se pone a cantar de verdad.)','(Everyone repeats, and someone actually starts singing.)'),
  {q:L('@','Ülkantuymi.','¿Quién canta?','Who is singing?'),o:['Yo canto.','Tú cantas.','Él o ella canta.'],a:'Tú cantas.',why:N('-ymi es «tú».','-ymi is "you".')},
  N('Y para presentarte: pi- es «decir», -nge- lo vuelve «ser dicho». Pingen: «me dicen», es decir, me llamo.','And to introduce yourself: pi- is "say", -nge- turns it into "be said". Pingen: "I am called", that is, my name is.'),
  L('@','Iñche Ñanku pingen. Eymi kay?','Yo me llamo Ñanku. ¿Y tú?','My name is Ñanku. And you?'),
  {q:N('¿Cómo dices «yo converso» (nütramka-)?','How do you say "I talk" (nütramka-)?'),o:['nütramkan','nütramkaymi','nütramkay'],a:'nütramkan',why:N('Raíz en vocal + -n: nütramkan.','Vowel root + -n: nütramkan.')}],
  sum:[L('','iñche amun · eymi amuymi · fey amuy','yo voy · tú vas · él/ella va','I go · you go · he/she goes'),L('','küdawün · küdawimi · küdawi','yo trabajo · tú trabajas · él/ella trabaja','I work · you work · he/she works')]},
 n_lof:{t:N('Dos y muchos: el dual y el plural','Two and many: dual and plural'),steps:[
  N('El mapudungun cuenta a la gente: una persona, dos personas, o tres y más. Cada cuenta tiene su terminación.','Mapudungun counts people: one person, two, or three and more. Each count has its own ending.'),
  L('@','Iñchiw amuyu.','Nosotros dos vamos. -yu: «nosotros dos».','We two go. -yu: "we two".'),
  L('@','Iñchiñ amuiñ.','Nosotros (tres o más) vamos. -iñ.','We (three or more) go. -iñ.'),
  L('Pu che','Iñchiw amuyu! Iñchiñ amuiñ!','(Todos repiten.)','(Everyone repeats.)'),
  L('@','Eymu amuymu. Eymün amuymün.','Ustedes dos van. Ustedes (tres o más) van.','You two go. You (three or more) go.'),
  N('¿Te suenan -mu y -mün? Son las mismas que usas en las peleas: -nge a uno, -mu a dos, -mün a tres o más.','Do -mu and -mün sound familiar? They are the same ones you use in battle: -nge to one, -mu to two, -mün to three or more.'),
  L('@','Feyengu amuyngu. Feyengün amuyngün.','Ellos dos van. Ellos (tres o más) van.','The two of them go. They (three or more) go.'),
  {q:L('@','Iñchiw ___','Nosotros dos trabajamos.'+rh('küdaw'),'We two work.'+rh('küdaw')),o:['küdawiñ','küdawiyu','küdawimu'],a:'küdawiyu',why:N('Dos y yo dentro: -iyu después de consonante.','Two, including me: -iyu after a consonant.')},
  {q:N('¿Cómo se dice «ustedes (muchos) comen»?','How do you say "you (many) eat"?'),o:['iyaymu','iyaymün','iyayngün'],a:'iyaymün',why:N('Ustedes, tres o más: -ymün.','You, three or more: -ymün.')},
  {q:N('¿Cómo se dice «ellos dos van»?','How do you say "the two of them go"?'),o:['amuyngu','amuyngün','amuyu'],a:'amuyngu',why:N('Ellos dos: -yngu.','The two of them: -yngu.')},
  N('Contar bien a la gente es respeto: en mapudungun nunca da lo mismo si son dos o son muchos.','Counting people right is respect: in Mapudungun it never matters little whether there are two or many.'),
  N('Hay una forma muy mapuche de nombrar a quien va contigo: iñchiw y su nombre. «Iñchiw ñi chaw» es «mi papá y yo».','There is a very Mapuche way to name who goes with you: iñchiw plus their name. "Iñchiw ñi chaw" is "my father and I".'),
  L('@','Iñchiw ñi chaw amuyu.','Mi papá y yo vamos.','My father and I go.'),
  L('Pu che','Iñchiw ñi chaw amuyu!','(Todos repiten.)','(Everyone repeats.)'),
  {q:L('@','Iñchiw ñi ñuke küdawiyu.','¿Qué significa?','What does it mean?'),o:['Mi mamá y yo trabajamos.','Mi mamá trabaja.','Ellas dos trabajan.'],a:'Mi mamá y yo trabajamos.',why:N('Iñchiw + nombre: esa persona y yo. -iyu: nosotros dos.','Iñchiw + name: that person and I. -iyu: we two.')},
  N('Los nombres no cambian para el plural: se pone pu delante. Pu che, la gente. Pu domo, las mujeres. Pu wentru, los hombres.','Nouns do not change for the plural: you put pu in front. Pu che, the people. Pu domo, the women. Pu wentru, the men.'),
  {q:N('¿Cómo se dice «las mujeres»?','How do you say "the women"?'),o:['domoke','pu domo','domongün'],a:'pu domo',why:N('pu va delante del nombre.','pu goes in front of the noun.')},
  L('@','Pu domo ülkantuyngün.','Las mujeres cantan.','The women sing.')],
  sum:[L('','iñchiw amuyu · eymu amuymu · feyengu amuyngu','dos: nosotros · ustedes · ellos','two: we · you · they'),L('','iñchiñ amuiñ · eymün amuymün · feyengün amuyngün','muchos: nosotros · ustedes · ellos','many: we · you · they')]},
 p_lof:{t:N('No y mañana: -la- y -a-','Not and tomorrow: -la- and -a-'),steps:[
  N('Dentro del verbo caben piezas pequeñas. Hoy dos: -la- (no) y -a- (lo que vendrá).','Small pieces fit inside the verb. Today, two: -la- (not) and -a- (what is to come).'),
  L('@','Amun. Amulan.','Voy. No voy.','I go. I do not go.'),
  L('@','Amuymi. Amulaymi. · Amuy. Amulay.','Vas. No vas. · Va. No va.','You go. You do not go. · He goes. He does not go.'),
  L('Pu che','Amulan! Amulaymi! Amulay!','(Todos repiten.)','(Everyone repeats.)'),
  L('@','Wüle amuan. Wüle amuaymi.','Mañana iré. Mañana irás.','Tomorrow I will go. Tomorrow you will go.'),
  {q:N('¿Cómo se dice «no como»?','How do you say "I do not eat"?'),o:['iyalan','iyaan','iyan'],a:'iyalan',why:N('iya- + -la- + -n: iyalan.','iya- + -la- + -n: iyalan.')},
  {q:N('¿Cómo se dice «irás»?','How do you say "you will go"?'),o:['amuymi','amuaymi','amulaymi'],a:'amuaymi',why:N('amu- + -a- + -ymi: amuaymi.','amu- + -a- + -ymi: amuaymi.')},
  N('Y se pueden juntar, siempre en el mismo orden: primero -la-, después -a-.','And they combine, always in the same order: first -la-, then -a-.'),
  L('@','Amulayan.','No iré.','I will not go.'),
  {q:N('¿Cómo se dice «no iré»?','How do you say "I will not go"?'),o:['amualan','amulayan','amulan'],a:'amulayan',why:N('Primero -la-, después -a-: amu-la-ya-n.','First -la-, then -a-: amu-la-ya-n.')},
  N('El Ngoymatulfe quiere que digas «kimlan», no sé. El trawün enseña a decir «kimuan»: lo sabré.','The Ngoymatulfe wants you to say "kimlan", I do not know. The trawün teaches you to say "kimuan": I will know.'),
  N('Ojo: -la- dice lo que no pasa. Para pedir que alguien NO haga algo se usa otra pieza, -kil-, la misma de tus órdenes en las peleas.','Careful: -la- says what does not happen. To ask someone NOT to do something you use another piece, -kil-, the same one from your battle commands.'),
  L('@','Amukilnge!','¡No vayas! (a una persona)','Do not go! (to one person)'),
  L('Pu che','Amukilnge! Amukilmu! Amukilmün!','(Todos repiten: a uno, a dos, a muchos.)','(Everyone repeats: to one, to two, to many.)'),
  {q:N('¿Cómo le dices a alguien «¡no vayas!»?','How do you tell someone "do not go!"?'),o:['Amulaymi!','Amukilnge!','Amulan!'],a:'Amukilnge!',why:N('Pedir que no: -kil-, y -nge a una persona.','Asking not to: -kil-, and -nge to one person.')},
  N('Las mismas piezas sirven con nosotros y ustedes: iñchiñ amulaiñ (no vamos), iñchiñ amuaiñ (iremos).','The same pieces work with we and you: iñchiñ amulaiñ (we do not go), iñchiñ amuaiñ (we will go).'),
  {q:N('¿Cómo se dice «no iremos» (nosotros, muchos)?','How do you say "we will not go" (we, many)?'),o:['amulaiñ','amulayaiñ','amuaiñ'],a:'amulayaiñ',why:N('-la-, después -a-, después -iñ: amu-la-ya-iñ.','-la-, then -a-, then -iñ: amu-la-ya-iñ.')}],
  sum:[L('','amun · amulan · amuan · amulayan','voy · no voy · iré · no iré','I go · I do not go · I will go · I will not go')]},
 w_lof:{t:N('Preguntar: chem, iney, chew, chumül, tunten','Asking: chem, iney, chew, chumül, tunten'),steps:[
  N('Para conversar hay que saber preguntar. La palabra de pregunta va al principio.','To hold a conversation you have to know how to ask. The question word goes first.'),
  L('@','Chem? · Iney? · Chew?','¿Qué? · ¿Quién? · ¿Dónde?','What? · Who? · Where?'),
  L('@','Chumül? · Tunten? · Chumngechi?','¿Cuándo? · ¿Cuánto? · ¿Cómo?','When? · How much? · How?'),
  L('Pu che','Chem? Iney? Chew? Chumül? Tunten?','(Todos repiten.)','(Everyone repeats.)'),
  L('@','Iney pingeymi am? · Chew mülimi?','¿Cómo te llamas? (¿Quién te llaman?) · ¿Dónde estás?','What is your name? · Where are you?'),
  {q:N('¿Cómo preguntas «¿dónde estás?»?','How do you ask "where are you?"'),o:['Chem mülimi?','Chew mülimi?','Iney mülimi?'],a:'Chew mülimi?',why:N('Chew es «dónde».','Chew is "where".')},
  L('@','Tunten tripantu nieymi?','¿Cuántos años tienes?','How old are you?'),
  {q:L('@','Tunten tripantu nieymi?','¿Qué te están preguntando?','What are they asking you?'),o:['¿Cuántos años tienes?','¿Dónde vives?','¿Cómo te llamas?'],a:'¿Cuántos años tienes?',why:N('Tunten es «cuánto»; tripantu es «año».','Tunten is "how much"; tripantu is "year".')},
  L('@','Chumngechi pingekey «casa»? · Ruka pingekey.','¿Cómo se dice «casa»? · Se dice ruka.','How do you say "house"? · It is called ruka.'),
  N('Esta pregunta es tu mejor herramienta: con ella cualquier persona del lof te puede enseñar una palabra nueva.','This question is your best tool: with it, anyone in the lof can teach you a new word.'),
  {q:N('Quieres aprender a decir «agua». ¿Qué preguntas?','You want to learn how to say "water". What do you ask?'),o:['Chumngechi pingekey «agua»?','Chew mülimi «agua»?','Tunten «agua»?'],a:'Chumngechi pingekey «agua»?',why:N('Chumngechi pingekey…?: ¿cómo se dice…? (Y la respuesta es: ko pingekey.)','Chumngechi pingekey…?: how do you say…? (And the answer is: ko pingekey.)')},
  N('Ahora a responder. La respuesta usa el mismo verbo, con tu terminación.','Now to answer. The answer uses the same verb, with your ending.'),
  L('@','Chew mülimi? · Ruka mew mülen.','¿Dónde estás? · Estoy en la casa.','Where are you? · I am at home.'),
  L('@','Chumül amuaymi? · Wüle amuan.','¿Cuándo vas a ir? · Mañana iré.','When will you go? · I will go tomorrow.'),
  L('Pu che','Chew mülimi? Ruka mew mülen!','(Se preguntan y se responden en parejas.)','(They ask and answer each other in pairs.)'),
  {q:L('@','Chew mülimi?','¿Qué respondes?','What do you answer?'),o:['Ruka mew mülen.','Wüle amuan.','Kümelen.'],a:'Ruka mew mülen.',why:N('Te preguntan dónde: respondes con un lugar y mew.','They ask where: you answer with a place and mew.')},
  {q:N('¿Qué significa «chumül»?','What does "chumül" mean?'),o:['¿Dónde?','¿Cuándo?','¿Quién?'],a:'¿Cuándo?',why:N('Chumül: cuándo. Chew: dónde. Iney: quién.','Chumül: when. Chew: where. Iney: who.')}],
  sum:[L('','chem · iney · chew · chumül · tunten · chumngechi','qué · quién · dónde · cuándo · cuánto · cómo','what · who · where · when · how much · how'),L('','Chumngechi pingekey …?','¿Cómo se dice …?','How do you say …?')]},
 e_lof:{t:N('Lo de siempre: -ke-','What you always do: -ke-'),steps:[
  N('Con -ke- el verbo dice lo que se hace siempre, como costumbre.','With -ke- the verb says what you always do, as a habit.'),
  L('@','Amun. Amuken.','Voy. Suelo ir (siempre voy).','I go. I usually go (I always go).'),
  L('@','Liwen küdawken. Pun umawtuken.','En la mañana suelo trabajar. De noche suelo dormir.','In the morning I usually work. At night I usually sleep.'),
  L('Pu che','Liwen küdawken! Pun umawtuken!','(Todos repiten.)','(Everyone repeats.)'),
  {q:N('¿Cómo se dice «suelo comer»?','How do you say "I usually eat"?'),o:['iyan','iyaken','iyaan'],a:'iyaken',why:N('iya- + -ke- + -n: iyaken.','iya- + -ke- + -n: iyaken.')},
  L('@','Eymi amukeymi. Fey amukey.','Tú sueles ir. Él o ella suele ir.','You usually go. He or she usually goes.'),
  {q:N('¿Cómo se dice «tú sueles ir»?','How do you say "you usually go"?'),o:['amukeymi','amukey','amuken'],a:'amukeymi',why:N('-ke- y después -ymi: amukeymi.','-ke- and then -ymi: amukeymi.')},
  N('¿Recuerdas «Chumngechi pingekey»? Ahí también está -ke-: «cómo se suele decir». La lengua vive en lo que se repite todos los días.','Remember "Chumngechi pingekey"? -ke- is there too: "how is it usually said". A language lives in what is repeated every day.'),
  {q:L('@','Pun umawtuken.','¿Qué significa?','What does it mean?'),o:['De noche suelo dormir.','Anoche dormí.','Esta noche dormiré.'],a:'De noche suelo dormir.',why:N('-ke- es costumbre: lo que hago siempre.','-ke- is habit: what I always do.')},
  N('Si hablas mapudungun un poco cada día, «mapudunguken» deja de ser un sueño y se vuelve costumbre.','If you speak Mapudungun a little every day, "mapudunguken" stops being a dream and becomes a habit.'),
  N('Si a -ke- le sumas -fu-, hablas de lo que se hacía antes, de lo que fue costumbre.','If you add -fu- to -ke-, you talk about what used to be done, what was the custom.'),
  L('@','Kuyfi, kom che mapudungukefuy.','Antes, toda la gente solía hablar mapudungun.','Long ago, everyone used to speak Mapudungun.'),
  {q:L('@','Mapudungukefuy.','¿Qué significa?','What does it mean?'),o:['Solía hablar mapudungun.','Habla mapudungun ahora.','Hablará mapudungun.'],a:'Solía hablar mapudungun.',why:N('-ke- costumbre, -fu- lo que fue: solía.','-ke- habit, -fu- what was: used to.')},
  N('Pero la costumbre se puede recuperar. Kom antü: todos los días.','But a habit can be brought back. Kom antü: every day.'),
  L('@','Kom antü mapudunguken.','Todos los días hablo mapudungun.','Every day I speak Mapudungun.'),
  L('Pu che','Kom antü mapudunguken!','(Todos lo dicen juntos, fuerte.)','(Everyone says it together, loudly.)'),
  {q:N('¿Cómo se dice «todos los días hablo mapudungun»?','How do you say "every day I speak Mapudungun"?'),o:['Kom antü mapudunguken.','Kuyfi mapudungukefun.','Wüle mapudunguan.'],a:'Kom antü mapudunguken.',why:N('Kom antü + -ke-: lo que haces todos los días.','Kom antü + -ke-: what you do every day.')}],
  sum:[L('','amuken · amukeymi · amukey','suelo ir · sueles ir · suele ir','I usually go · you usually go · he/she usually goes'),L('','liwen küdawken · pun umawtuken','en la mañana suelo trabajar · de noche suelo dormir','in the morning I usually work · at night I usually sleep')]}};
/* ---------- second lesson in each trawün (all new Mapudungun flagged in docs/review.md, Tanda 24) ---------- */
const TRAWUN2={
 lof:{t:N('Tañi, tami, ñi: de quién es','Tañi, tami, ñi: whose it is'),steps:[
  N('Para decir de quién es algo, el mapudungun pone una palabrita antes del sustantivo.','To say whose something is, Mapudungun puts a little word before the noun.'),
  L('@','Tañi ruka.','Mi casa.','My house.'),
  L('@','Tami ruka.','Tu casa.','Your house.'),
  L('@','Ñi ruka.','Su casa (de él o de ella).','His or her house.'),
  L('Pu che','Tañi ruka! Tami ruka! Ñi ruka!','(Todos repiten.)','(Everyone repeats.)'),
  {q:N('¿Cómo se dice «tu casa»?','How do you say "your house"?'),o:['tañi ruka','tami ruka','ñi ruka'],a:'tami ruka',why:N('tami es «tu»: tami ruka.','tami is "your": tami ruka.')},
  N('Cuando hablan rápido, muchos acortan: «ñi ruka» por tañi ruka, «mi ruka» por tami ruka. Ojo: ñi puede ser «mi» o «su»; se entiende por el contexto.','When people talk fast, many shorten them: "ñi ruka" for tañi ruka, "mi ruka" for tami ruka. Careful: ñi can mean "my" or "his/her"; context makes it clear.'),
  N('Para «nosotros» y «ustedes» también cuenta el número de personas, como en los verbos.','For "we" and "you all" the number of people counts too, as with verbs.'),
  L('@','Taiñ lof. Tamün lof.','Nuestro lof (de tres o más). El lof de ustedes (tres o más).','Our lof (three or more). Your lof (three or more of you).'),
  N('¿Te acuerdas de lo que te dice la gente cuando te manda su newen? «Llownge taiñ newen»: recibe nuestra fuerza.','Remember what the people say when they send you their newen? "Llownge taiñ newen": receive our strength.'),
  {q:L('@','Taiñ lof.','¿Qué quiere decir?','What does it mean?'),o:['Nuestro lof.','Tu lof.','Su lof.'],a:'Nuestro lof.',why:N('taiñ es «nuestro» (de tres o más).','taiñ is "our" (of three or more).')},
  N('Con la familia se usa todo el tiempo. Chaw es «papá» y ñuke es «mamá».','It is used all the time with family. Chaw is "father" and ñuke is "mother".'),
  L('@','Tañi chaw Lienlaf pingey. Tañi ñuke Rayen pingey.','Mi papá se llama Lienlaf. Mi mamá se llama Rayen.','My father is called Lienlaf. My mother is called Rayen.'),
  {q:N('¿Cómo dices «tu mamá»?','How do you say "your mother"?'),o:['tami ñuke','tañi ñuke','taiñ ñuke'],a:'tami ñuke',why:N('tami + ñuke: tami ñuke.','tami + ñuke: tami ñuke.')},
  N('Y para preguntar el nombre, no se usa un posesivo: se pregunta «¿cómo te dicen?».','And to ask someone\'s name you do not use a possessive: you ask "what are you called?".'),
  L('@','Iney pingeymi am? Iñche Ñanku pingen.','¿Cómo te llamas? Yo me llamo Ñanku.','What is your name? My name is Ñanku.'),
  {q:L('@','Iney pingeymi am?','Te preguntan tu nombre.','They ask your name.'),o:['Iñche @ pingen.','Eymi @ pingeymi.','Fey @ pingey.'],a:'Iñche @ pingen.',why:N('Hablas de ti: iñche … pingen.','You are talking about yourself: iñche … pingen.')}],
  sum:[L('','tañi · tami · ñi · taiñ · tamün','mi · tu · su · nuestro · de ustedes','my · your · his/her · our · your (pl.)'),L('','Iney pingeymi am? · Iñche ... pingen','¿Cómo te llamas? · Yo me llamo ...','What is your name? · My name is ...')]},
 n_lof:{t:N('Tunten? Los números y nie- (tener)','Tunten? Numbers and nie- (to have)'),steps:[
  N('Hoy contamos. Del uno al diez:','Today we count. From one to ten:'),
  L('@','Kiñe, epu, küla, meli, kechu.','Uno, dos, tres, cuatro, cinco.','One, two, three, four, five.'),
  L('@','Kayu, regle, pura, aylla, mari.','Seis, siete, ocho, nueve, diez.','Six, seven, eight, nine, ten.'),
  L('Pu che','Kiñe, epu, küla, meli, kechu, kayu, regle, pura, aylla, mari!','(Todos cuentan juntos, y los niños gritan el mari.)','(Everyone counts together, and the children shout the mari.)'),
  {q:N('¿Qué número es «meli»?','Which number is "meli"?'),o:['3','4','7'],a:'4',why:N('kiñe 1, epu 2, küla 3, meli 4.','kiñe 1, epu 2, küla 3, meli 4.')},
  N('Después del diez, se suma: mari kiñe es 11, mari epu es 12. Para las decenas se multiplica: epu mari es 20, küla mari es 30. Y pataka es 100.','After ten, you add: mari kiñe is 11, mari epu is 12. For the tens you multiply: epu mari is 20, küla mari is 30. And pataka is 100.'),
  L('@','Epu mari kechu.','Veinticinco: dos dieces y cinco.','Twenty-five: two tens and five.'),
  {q:N('¿Cómo se dice 14?','How do you say 14?'),o:['mari meli','meli mari','meli'],a:'mari meli',why:N('Diez y cuatro: mari meli. «Meli mari» sería 40.','Ten and four: mari meli. "Meli mari" would be 40.')},
  {q:N('¿Qué número es «küla mari epu»?','Which number is "küla mari epu"?'),o:['32','23','52'],a:'32',why:N('Tres dieces y dos: 32.','Three tens and two: 32.')},
  N('Ahora el verbo nie-, «tener». Se conjuga como amu-: nien, nieymi, niey.','Now the verb nie-, "to have". It conjugates like amu-: nien, nieymi, niey.'),
  L('@','Epu kawellu nien.','Tengo dos caballos.','I have two horses.'),
  L('@','Tunten kawellu nieymi?','¿Cuántos caballos tienes?','How many horses do you have?'),
  N('Fíjate: con un número, el sustantivo no cambia. Epu kawellu, küla waka: no hace falta marcar el plural.','Notice: with a number, the noun does not change. Epu kawellu, küla waka: no plural marking is needed.'),
  {q:L('@','Küla waka ___ (él o ella)','Él o ella tiene tres vacas.','He or she has three cows.'),o:['nien','nieymi','niey'],a:'niey',why:N('-y es «él» o «ella»: niey.','-y is "he" or "she": niey.')},
  N('Y la edad se dice con años, tripantu: «¿cuántos años tienes?»','And age is said with years, tripantu: "how many years do you have?"'),
  L('@','Tunten tripantu nieymi? Mari aylla tripantu nien.','¿Cuántos años tienes? Tengo diecinueve años.','How old are you? I am nineteen.'),
  {q:N('«Tengo doce años.»','"I am twelve."'),o:['Mari epu tripantu nien.','Epu mari tripantu nien.','Mari epu tripantu niey.'],a:'Mari epu tripantu nien.',why:N('12 es mari epu, y «yo tengo» es nien.','12 is mari epu, and "I have" is nien.')}],
  sum:[L('','kiñe · epu · küla · meli · kechu · kayu · regle · pura · aylla · mari','1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10','1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10'),L('','mari kiñe 11 · epu mari 20 · pataka 100','','')
   ,L('','nien · nieymi · niey · Tunten tripantu nieymi?','tengo · tienes · tiene · ¿Cuántos años tienes?','I have · you have · he/she has · How old are you?')]},
 p_lof:{t:N('Chaw, ñuke, kuku: la familia','Chaw, ñuke, kuku: the family'),steps:[
  N('Hoy hablamos de la familia, que en el lof es casi todo.','Today we talk about family, which in the lof is almost everything.'),
  L('@','Chaw. Ñuke.','Papá. Mamá.','Father. Mother.'),
  N('Los abuelos tienen nombres distintos según el lado de la familia.','Grandparents have different names depending on the side of the family.'),
  L('@','Laku, kuku.','Por el lado del papá: el abuelo es laku, la abuela es kuku.','On the father\'s side: grandfather is laku, grandmother is kuku.'),
  L('@','Cheche, chuchu.','Por el lado de la mamá: el abuelo es cheche, la abuela es chuchu.','On the mother\'s side: grandfather is cheche, grandmother is chuchu.'),
  L('Pu che','Laku, kuku! Cheche, chuchu!','(Todos repiten, y una abuela se ríe.)','(Everyone repeats, and a grandmother laughs.)'),
  {q:N('La mamá de tu papá es tu...','Your father\'s mother is your...'),o:['kuku','chuchu','ñuke'],a:'kuku',why:N('Lado del papá, abuela: kuku.','Father\'s side, grandmother: kuku.')},
  {q:N('La mamá de tu mamá es tu...','Your mother\'s mother is your...'),o:['chuchu','kuku','laku'],a:'chuchu',why:N('Lado de la mamá, abuela: chuchu.','Mother\'s side, grandmother: chuchu.')},
  N('Y algo bonito: el nieto le dice laku al abuelo, y el abuelo también le dice laku al nieto. La palabra va y vuelve.','And something lovely: a grandson calls his grandfather laku, and the grandfather calls his grandson laku too. The word goes both ways.'),
  N('Entre hermanos: los hombres le dicen peñi a un hermano y lamngen a una hermana. Las mujeres les dicen lamngen a todos.','Between siblings: men call a brother peñi and a sister lamngen. Women call all of them lamngen.'),
  {q:N('Una mujer le habla a su hermano. Le dice...','A woman speaks to her brother. She calls him...'),o:['lamngen','peñi','chaw'],a:'lamngen',why:N('Las mujeres dicen lamngen a todos sus hermanos.','Women say lamngen to all their siblings.')},
  N('Y los hijos: el papá dice fotüm a su hijo y ñawe a su hija; la mamá dice püñeñ a su hijo o hija.','And children: a father calls his son fotüm and his daughter ñawe; a mother calls her son or daughter püñeñ.'),
  L('@','Tañi ñawe Rayen pingey.','(Dice el papá:) Mi hija se llama Rayen.','(The father says:) My daughter is called Rayen.'),
  {q:N('Una mamá habla de su hijo:','A mother speaks about her son:'),o:['tañi püñeñ','tañi fotüm','tañi ñawe'],a:'tañi püñeñ',why:N('Para la mamá, hijo o hija es püñeñ.','For a mother, son or daughter is püñeñ.')}],
  sum:[L('','chaw · ñuke · laku · kuku · cheche · chuchu','papá · mamá · abuelo y abuela paternos · abuelo y abuela maternos','father · mother · paternal grandparents · maternal grandparents'),L('','peñi · lamngen · fotüm · ñawe · püñeñ','hermano (de hombre) · hermana o hermano · hijo y hija (del papá) · hijo o hija (de la mamá)','brother (of a man) · sister or sibling · son and daughter (of a father) · child (of a mother)')]},
 w_lof:{t:N('-le- y -küle-: lo que está pasando','-le- and -küle-: what is going on'),steps:[
  N('Para decir que algo está pasando ahora, o que alguien está en un estado, se agrega -le- al verbo.','To say something is going on now, or that someone is in a state, you add -le- to the verb.'),
  L('@','Anülen.','Estoy sentado (anü-, sentarse).','I am sitting (anü-, sit down).'),
  L('@','Umawtulen.','Estoy durmiendo.','I am sleeping.'),
  N('Si la raíz termina en consonante, es -küle-:','If the root ends in a consonant, it is -küle-:'),
  L('@','Küdawkülen.','Estoy trabajando.','I am working.'),
  L('Pu che','Anülen! Küdawkülen!','(Todos repiten, sentados alrededor del fuego.)','(Everyone repeats, seated around the fire.)'),
  {q:N('«Estoy trabajando.»','"I am working."'),o:['Küdawkülen.','Küdawün.','Küdawlen.'],a:'Küdawkülen.',why:N('küdaw- termina en consonante: -küle-. Küdawkülen.','küdaw- ends in a consonant: -küle-. Küdawkülen.')},
  N('Las personas van al final, como siempre: anülen, anüleymi, anüley; anüleyu, nosotros dos.','The persons go at the end, as always: anülen, anüleymi, anüley; anüleyu, we two.'),
  {q:L('@','Fey umawtuley.','¿Qué quiere decir?','What does it mean?'),o:['Está durmiendo.','Va a dormir.','Duerme siempre.'],a:'Está durmiendo.',why:N('-le- es lo que está pasando: está durmiendo.','-le- is what is going on: he or she is sleeping.')},
  N('¿Has oído a la gente hablar del tiempo? Lo dicen así: mawünküley, está lloviendo; pireley, está nevando; kürüfküley, está corriendo viento.','Have you heard people talk about the weather? They say it like this: mawünküley, it is raining; pireley, it is snowing; kürüfküley, the wind is blowing.'),
  {q:N('Afuera llueve. La gente dice:','It is raining outside. People say:'),o:['Mawünküley.','Mawünkülen.','Mawün.'],a:'Mawünküley.',why:N('mawün + -küle- + -y: mawünküley.','mawün + -küle- + -y: mawünküley.')},
  {q:N('¿Cómo dices «estamos sentados» (nosotros dos)?','How do you say "we are sitting" (we two)?'),o:['Anüleyu.','Anülen.','Anüleymi.'],a:'Anüleyu.',why:N('-yu es «nosotros dos»: anüleyu.','-yu is "we two": anüleyu.')}],
  sum:[L('','anülen · umawtulen · küdawkülen','estoy sentado · estoy durmiendo · estoy trabajando','I am sitting · I am sleeping · I am working'),L('','mawünküley · pireley · kürüfküley','está lloviendo · está nevando · corre viento','it is raining · it is snowing · the wind is blowing')]},
 e_lof:{t:N('Wiya, fachantü, wüle: cuándo','Wiya, fachantü, wüle: when'),steps:[
  N('Hoy hablamos del tiempo que pasa: ayer, hoy, mañana.','Today we talk about time passing: yesterday, today, tomorrow.'),
  L('@','Wiya. Fachantü. Wüle.','Ayer. Hoy. Mañana.','Yesterday. Today. Tomorrow.'),
  L('@','Fewla.','Ahora.','Now.'),
  L('Pu che','Wiya, fachantü, wüle!','(Todos repiten.)','(Everyone repeats.)'),
  N('Recuerda: el verbo sin marca habla de lo que pasa o de lo que ya pasó. Para el futuro se agrega -a-.','Remember: an unmarked verb tells what happens or what already happened. For the future you add -a-.'),
  L('@','Wiya küdawün. Wüle küdawan.','Ayer trabajé. Mañana trabajaré.','Yesterday I worked. Tomorrow I will work.'),
  {q:N('«Mañana iré.»','"Tomorrow I will go."'),o:['Wüle amuan.','Wiya amun.','Wüle amun.'],a:'Wüle amuan.',why:N('wüle (mañana) y -a- (futuro): wüle amuan.','wüle (tomorrow) and -a- (future): wüle amuan.')},
  {q:L('@','Wiya pen kiñe choyke.','¿Qué quiere decir?','What does it mean?'),o:['Ayer vi un ñandú.','Mañana veré un ñandú.','Hoy veo dos ñandúes.'],a:'Ayer vi un ñandú.',why:N('wiya es «ayer» y pen es «vi».','wiya is "yesterday" and pen is "I saw".')},
  N('Y hay más palabras de tiempo. Wüla es «después»: por eso, cuando no quieres algo todavía, dices «wüla müten», después nomás.','And there are more time words. Wüla is "later": that is why, when you do not want something yet, you say "wüla müten", just later.'),
  N('Kuyfi es «hace mucho, antiguo». Las kuyfi chillka son las escrituras antiguas que brillan en las piedras.','Kuyfi is "long ago, ancient". The kuyfi chillka are the ancient writings that glow on the stones.'),
  {q:N('Te ofrecen mate, pero ahora no quieres. Dices:','They offer you mate, but you do not want it now. You say:'),o:['Wüla müten.','Wiya.','Kuyfi.'],a:'Wüla müten.',why:N('Wüla müten: después nomás.','Wüla müten: just later.')},
  {q:N('¿Qué quiere decir «fewla»?','What does "fewla" mean?'),o:['ahora','ayer','antiguo'],a:'ahora',why:N('Fewla es «ahora».','Fewla is "now".')},
  L('@','Chumül amuaymi? Wüle amuan.','¿Cuándo vas a ir? Iré mañana.','When will you go? I will go tomorrow.')],
  sum:[L('','wiya · fachantü · wüle · fewla','ayer · hoy · mañana · ahora','yesterday · today · tomorrow · now'),L('','wüla · kuyfi · wüla müten','después · hace mucho · después nomás','later · long ago · just later')]}};
const TRW_IDS=Object.keys(TRAWUN);
function trawunTalk(id){
  let D=TRAWUN[id],fl='trw_'+id,done=!!S.flags[fl];const who=TRW_T[id],en=S.gloss==='en',D2=TRAWUN2[id],done2=!!S.flags['trw2_'+id];
  const sub=l=>l&&l.who==='@'?Object.assign({},l,{who:who}):l;
  const tf=TRW_F[id],ad=addr(tf),fp=S.fem?'a':'o';
  say([done?L(who,'Mari mari, '+ad+'! Kimeltuaiñ.','¡Volviste! ¿Qué aprendemos hoy?','You came back! What shall we learn today?')
     :L(who,'Küme akunkonpayami fachi trawün, '+ad+'.','Bienvenid'+fp+' a este trawün, '+(ad==='peñi'?'hermano':S.fem?'hermana':'hermano')+'. Siéntate junto al kütral: hoy aprendemos juntos.','Welcome to this trawün, '+(S.fem?'sister':'brother')+'. Sit by the kütral: today we learn together.')],()=>
    !done?choose(Object.assign({},D.t,{m:'Trawüleaiñ?'}),[{m:'May',g:en?'Take the lesson (about 4 minutes)':'Tomar la lección (unos 4 minutos)',v:1},{m:'Wüla müten',g:en?'Later':'Después',v:0}],v=>{if(v)run(0)},true,true)
    :choose({m:'Trawüleaiñ?',es:'¿Qué lección tomas?',en:'Which lesson do you take?'},[
      {m:'Kiñe ✓',g:G(D.t),v:1},{m:'Epu'+(done2?' ✓':''),g:G(D2.t)+(done2?'':(en?' (new)':' (nueva)')),v:2},{m:'Wüla müten',g:en?'Later':'Después',v:0}],v=>{
      if(v===2){D=D2;fl='trw2_'+id;done=done2}if(v)run(0)},true,true));
  function run(i){
    const chunk=[];while(i<D.steps.length&&!D.steps[i].q&&!D.steps[i].b){chunk.push(sub(D.steps[i]));i++}
    const next=()=>{if(i>=D.steps.length)return finish();ask(D.steps[i],()=>run(i+1))};
    if(chunk.length)say(chunk,next);else next()}
  function ask(Q,cb){
    if(Q.b)return buildVerb(Q.b,(ok,got)=>{if(ok){sfx('ok');say([L(who,'Kümey!','¡Muy bien!','Very good!'),Q.why],cb)}
      else{sfx('bad');say([L(who,'Kangelu...','Casi...','Almost...'),N('Armaste «'+got+'».','You built "'+got+'".'),Q.why,N('Inténtalo de nuevo.','Try again.')],()=>ask(Q,cb))}});
    const opts=Q.o.map(o=>({m:o.replace('@',S.name),v:o}));for(let a=opts.length-1;a>0;a--){const b=rnd(a+1);[opts[a],opts[b]]=[opts[b],opts[a]]}
    choose(sub(Q.q),opts,v=>{track('trawün',v===Q.a,Q.q,Q.o.map(o=>o.replace('@',S.name)),Q.a.replace('@',S.name));if(v===Q.a){sfx('ok');say([L(who,'Kümey!','¡Muy bien!','Very good!'),Q.why],cb)}
      else{sfx('bad');say([L(who,'Kangelu...','Casi...','Almost...'),Q.why,N('Inténtalo de nuevo.','Try again.')],()=>ask(Q,cb))}},false,true)}
  function finish(){
    const ls=[L(who,'Fey tati. Pewkayal!','Eso es todo por hoy. ¡Hasta luego!','That is all for today. See you later!'),N('Lo que aprendiste quedó escrito en tu chillka:','What you learned is now written in your chillka:')].concat(D.sum);
    if(!done){S.flags[fl]=1;S.xp+=10;S.gold+=20;sfx('lvl');ls.push(N('+10 kimün · +20 ngülliw.','+10 kimün · +20 ngülliw.'));
      if(fl.startsWith('trw2_')&&TRW_IDS.every(k=>S.flags['trw2_'+k])&&!S.flags.trw2_all){S.flags.trw2_all=1;S.items.mate=(S.items.mate||0)+5;ls.push(N('Tomaste las segundas lecciones de los cinco trawün. Los kimeltuchefe te regalan cinco mate más.','You took the second lessons of all five trawün. The kimeltuchefe give you five more mate.'))}
      if(TRW_IDS.every(k=>S.flags['trw_'+k])&&!S.flags.trw_all){S.flags.trw_all=1;S.items.mate=(S.items.mate||0)+5;ls.push(N('Tomaste las lecciones de los cinco trawün. Los kimeltuchefe te regalan cinco mate: «Sigue aprendiendo, siempre».','You took the lessons of all five trawün. The kimeltuchefe give you five mate: "Keep learning, always."'))}
      persist()}
    say(ls,()=>{if(S.xp>=xpNeed())levelUpCheck()})}
}
function trawunListener(id,k){
  const lines=[[L('Pu che','Kimeltuaiñ kom iñchiñ. Dungufinge kimeltuchefe tati!','Aquí aprendemos juntos. ¡Habla con el kimeltuchefe!','Here we learn together. Talk to the kimeltuchefe!')],
    [L('Pu che','Kimnierpuken!','¡Voy aprendiendo!','I am learning!')],
    [L('Pu che','Chumngechi pingekey...?','(Repasa sus palabras en voz baja.)','(Quietly goes over their words.)')],
    [L('Pu che','Kümey ta trawün.','El trawün es bueno.','The trawün is good.')]];
  say(lines[k%lines.length])
}
