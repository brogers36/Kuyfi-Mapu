/* ============================================================
   INTRO CUTSCENE
   ============================================================ */
let CUT=null;
function cutLines(){const n=S.name;return[
  [N('Hace mucho tiempo, en todo Wallmapu se escuchaba mapudungun: junto al lafken (el mar), en la mawida (el monte), arriba en la cordillera.','Long ago, Mapudungun was heard all over Wallmapu: beside the lafken (the sea), in the mawida (the forest), high up in the mountains.'),
   N('La gente le hablaba a los ngen, los dueños espirituales de cada lugar: del agua, del bosque, del viento, del mar. Y los ngen respondían.','People spoke to the ngen, the spirit owners of each place: of the water, the forest, the wind, the sea. And the ngen answered.')],
  [N('Pero el silencio fue entrando, despacio. Muchas familias tuvieron que irse a la waria, la ciudad. En las escuelas castigaban a los niños por hablar mapudungun, y muchos padres dejaron de enseñarlo.','But silence crept in, slowly. Many families had to move to the waria, the city. In schools children were punished for speaking Mapudungun, and many parents stopped teaching it.'),
   N('Con el silencio llegó una niebla de olvido: Ti Fütra Ngoymatulfe, el gran olvido. Donde pasa, las palabras se borran, los nütram (las conversaciones) se apagan y los nombres de las cosas se pierden.','With the silence came a fog of forgetting: Ti Fütra Ngoymatulfe, the great forgetting. Wherever it passes, words fade, the nütram (conversations) die out, and the names of things are lost.')],
  [N('Tú eres '+n+'. Naciste en Santiago: eres wariache, mapuche de la ciudad. Entiendes algunas palabras de tu kuku, pero casi no hablas la lengua.','You are '+n+'. You were born in Santiago: you are wariache, a Mapuche person of the city. You understand a few of your kuku\'s words, but you hardly speak the language.')],
  [N('Sin nadie que les hable, los ngen se quedaron dormidos y callados. Y en su silencio despertaron los wekufü: el chonchon, el laftrache, el anchümalleñ... y otros peores.','With no one to speak to them, the ngen fell asleep and went silent. And in their silence the wekufü awoke: the chonchon, the laftrache, the anchümalleñ... and worse.'),
   N('Los wekufü no le temen a la fuerza. Le temen a la lengua: solo se van cuando se les habla bien, en mapudungun.','The wekufü do not fear strength. They fear the language: they only leave when they are spoken to properly, in Mapudungun.')],
  [L('Kuku','Küpange, '+n+'!','"¡Ven, '+n+'!" Tu kuku te llama desde la costa lafkenche. (küpa- es "venir"; -nge le habla a una persona.)','"Come, '+n+'!" Your kuku calls you from the Lafkenche coast. (küpa- means "come"; -nge speaks to one person.)'),
   N('Es hora de volver. Aprende la lengua, despierta a los ngen uno por uno y devuélvele la voz a tu pueblo: a su lengua y a su cultura.','It is time to go back. Learn the language, wake the ngen one by one, and give your people back their voice: their language and their culture.')]
];}
function startCut(){$('ui').classList.add('cutm');mode='cut';CUT={i:0,t:0,L:cutLines()};$('skip').style.display='block';playSong('epew');nextCut()}
function nextCut(){if(!CUT)return;if(CUT.i>=CUT.L.length)return endCut();CUT.t=0;const ls=CUT.L[CUT.i];say(ls,()=>{if(!CUT)return;CUT.i++;nextCut()})}
function skipCut(){if(!CUT)return;dlg.style.display='none';active=null;endCut()}
function endCut(){$('ui').classList.remove('cutm');CUT=null;$('skip').style.display='none';mode='map';loadMap('rupu',1,6,true);showBanner(M.name,G(M.g));setTimeout(()=>{if(!active)introScript()},400)}
let ECUT=null;
function endCutLines(){const n=nm();return[
  [N('La niebla del gran olvido se deshace sobre Wallmapu. Donde pasaba borrando, ahora pasa el viento, limpio y liviano.','The fog of the great forgetting dissolves over Wallmapu. Where it once passed erasing, now the wind passes, clean and light.'),
   N('Y entonces las oyes: todas las palabras que se había tragado, volviendo como pájaros a sus tierras.','And then you hear them: all the words it had swallowed, returning like birds to their lands.')],
  [N('Los cinco ngen caminan juntos una última vez: agua, monte, pewen, viento y pasto. No dicen nada. Inclinan la cabeza, y eso lo dice todo.','The five ngen walk together one last time: water, forest, pewen, wind and grass. They say nothing. They bow their heads, and that says everything.'),
   L('','Kom mapu tukulpaturkey!','¡Toda la tierra vuelve a recordar!','All the land remembers again!')],
  [N('Y lejos, en la waria, en Santiago, las palabras también llegan: caen sobre las calles como lluvia tibia. En las cocinas, en las micros, en los patios de las escuelas, alguien dice "mari mari"... y otro responde.','And far away, in the waria, in Santiago, the words arrive too: they fall over the streets like warm rain. In kitchens, on buses, in schoolyards, someone says "mari mari"... and someone answers.')],
  [L('Kuku','Küme küdaw, '+n+'.','"Buen trabajo, '+n+'." Tu kuku te espera junto al kütral, como siempre.','"Good work, '+n+'." Your kuku waits for you by the fire, as always.'),
   N('El trariwe en tu cintura brilla una última vez: cinco tierras, una sola lengua viva. Mientras alguien la hable, el gran olvido no podrá volver.','The trariwe at your waist glows one last time: five lands, one living language. As long as someone speaks it, the great forgetting cannot return.'),
   N('AFPUY · FIN','AFPUY · THE END')]
];}
function startEndCut(){$('ui').classList.add('cutm');mode='cut';ECUT={i:0,t:0,L:endCutLines()};$('skip').style.display='block';AU.name=null;playSong('ending');nextEndCut()}
function nextEndCut(){if(!ECUT)return;if(ECUT.i>=ECUT.L.length)return endEndCut();ECUT.t=0;const ls=ECUT.L[ECUT.i];say(ls,()=>{if(!ECUT)return;ECUT.i++;nextEndCut()})}
/* the end credits: a film ("Kelluaeyu") that plays once the ending is over, with its own skip button */
function playCredits(done){gcEvent('creditos','Créditos finales');
  let fin=false;const end=()=>{if(fin)return;fin=true;try{v.pause()}catch(e){}ov.remove();done()};
  const ov=document.createElement('div');ov.id='credits';ov.style.cssText='position:fixed;inset:0;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center';
  const v=document.createElement('video');v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto';v.style.cssText='width:100%;height:100%;object-fit:contain;background:#000';
  for(const u of ['ending.mp4?v=4','../www/ending.mp4?v=4']){const so=document.createElement('source');so.src=u;so.type='video/mp4';v.appendChild(so)}
  v.lastElementChild.addEventListener('error',end);v.addEventListener('ended',end);
  const sk=document.createElement('button');sk.textContent=((S&&S.gloss==='en')||LANG==='en')?'Skip ▶':'Saltar ▶';
  sk.style.cssText='position:absolute;right:14px;bottom:14px;padding:8px 14px;font:600 14px sans-serif;color:#f3ead2;background:rgba(0,0,0,.55);border:1px solid rgba(243,234,210,.5);border-radius:6px;opacity:.75';
  sk.onclick=e=>{e.stopPropagation();end()};
  ov.appendChild(v);ov.appendChild(sk);document.body.appendChild(ov);
  if(typeof playSong==='function')playSong(null);if(typeof stopAmb==='function')stopAmb();mode='credits';
  const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{v.muted=true;v.play().catch(end)});   // if sound is refused, it still plays, silent
}
function endEndCut(){$('ui').classList.remove('cutm');ECUT=null;$('skip').style.display='none';
  playCredits(endEndCut2)}
function endEndCut2(){mode='map';AU.name=null;loadMap('ngoyman',8,8,true);showBanner(M.name,G(M.g));
  setTimeout(()=>{if(!active)say([N('Puedes seguir jugando: las tierras, los wekufü escondidos y el Epunamun siguen ahí... y dicen que el mundo todavía guarda secretos bajo el agua.','You can keep playing: the lands, the hidden wekufü and the Epunamun are still there... and they say the world still keeps secrets under the water.'),
    N('Chaltu may por jugar Kewün Newen.','Chaltu may for playing Kewün Newen.')])},400)}
$('skip').addEventListener('click',()=>{if(ECUT){dlg.style.display='none';active=null;endEndCut();return}skipCut()});
