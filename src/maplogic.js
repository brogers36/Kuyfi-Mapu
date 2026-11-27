/* ============================================================
   INPUT
   ============================================================ */
const held={up:0,down:0,left:0,right:0};
const DK={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  auInit();
  const d=DK[e.key];
  if(d){e.preventDefault();held[d]=1;if(active&&active.mv&&(!e.repeat||frame%3===0))active.mv(d==='up'||d==='left'?-1:1);return}
  if(e.repeat)return;
  if(['z','Z','Enter',' '].includes(e.key)){e.preventDefault();pressA()}
  else if(['x','X','Escape','Backspace'].includes(e.key)){e.preventDefault();pressB()}
  else if(e.key==='m'||e.key==='M'){if(mode==='map'&&!active)openPause()}
  else if(e.key==='n'||e.key==='N')toggleMute();
});
addEventListener('keyup',e=>{const d=DK[e.key];if(d)held[d]=0});
addEventListener('pointerdown',()=>auInit(),{capture:true});
function pressA(){if(mode==='battle'&&B&&B.defA&&!B.defA.done)return defSkip();if(active)active.a();else if(mode==='map')interact();else if(mode==='palin'&&PG)palinSwing()}
function pressB(){if(mode==='battle'&&B&&B.defA&&!B.defA.done)return defSkip();if(mode==='cut'){skipCut();return}if(active){active.b&&active.b()}else if(mode==='map')openPause();else if(mode==='palin'&&PG)palinQuit()}
document.querySelectorAll('#dpad button').forEach(b=>{const d=b.dataset.d;
  b.addEventListener('pointerdown',e=>{e.preventDefault();held[d]=1;if(active&&active.mv)active.mv(d==='up'||d==='left'?-1:1)});
  for(const ev of ['pointerup','pointerleave','pointercancel'])b.addEventListener(ev,()=>held[d]=0)});
$('pA').addEventListener('pointerdown',e=>{e.preventDefault();pressA()});
$('pB').addEventListener('pointerdown',e=>{e.preventDefault();pressB()});
$('pM').addEventListener('pointerdown',e=>{e.preventDefault();if(mode==='map'&&!active)openPause()});
$('pN').addEventListener('pointerdown',e=>{e.preventDefault();toggleMute()});
$('mbtn').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();auInit();if(mode==='map'&&!active)openPause()});
function heldDir(){for(const d of ['up','down','left','right'])if(held[d])return d;return null}
const DV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const OPP={up:'down',down:'up',left:'right',right:'left'};

/* ============================================================
   MAP LOGIC
   ============================================================ */
function tryMove(d){
  P.dir=d;const [dx,dy]=DV[d],nx=P.x+dx,ny=P.y+dy;
  if(!inB(nx,ny))return edge(d);
  const e=entAt(nx,ny);
  if(e){if(e.kind==='enemy')engage(e);return}
  {const bb=ents.find(b=>b.kind==='enemy'&&b.boss&&Math.abs(nx-b.x)<=(ET[b.party[0]]&&ET[b.party[0]].bs>=120?2:1)&&ny<=b.y&&ny>=b.y-2);if(bb){engage(bb);return}}   // big bosses: their whole body, not just one tile
  const c=grid[ny][nx];
  if(M.metroGate){const g=M.metroGate;if(ny===g.y&&nx>=g.x&&nx<g.x+g.w){sfx('door');loadMap(g.to,g.tx,g.ty);return}}
  if(M.doors&&M.doors[nx+','+ny]&&d==='up'){const D=M.doors[nx+','+ny];if(D.req&&!S.flags[D.req]){if(!P.bump){P.bump=1;say(D.reqMsg)}return}sfx('door');loadMap(D.to,D.x,D.y);return}
  if(c==='B')return pushBlock(nx,ny,dx,dy);
  if(c==='L')return unlock(nx,ny);
  if(c==='E'){if(!P.bump){P.bump=1;say([N('Una puerta de piedra tallada. No se mueve: algo cerca debe abrirla.','A carved stone door. It will not move: something nearby must open it.')])}return}
  if(c==='G'){if(!P.bump){P.bump=1;sfx('bad');say([N('Una reja de hierro cierra el paso. Quizás alguna losa del suelo la abre.','An iron gate blocks the way. Perhaps a stone plate on the floor opens it.')])}return}
  P.bump=0;
  if(!walk(nx,ny))return;
  P.ox=P.x;P.oy=P.y;P.x=nx;P.y=ny;P.t=0;P.moving=true;P.spd=S.pw.speed>0?.22:.125;
}
function pushBlock(bx,by,dx,dy){
  const tx=bx+dx,ty=by+dy;if(!inB(tx,ty)||entAt(tx,ty))return;const t=grid[ty][tx];
  if(!(t===M.floor||t==='O'))return;
  grid[by][bx]=M.floor;grid[ty][tx]=t==='O'?'Q':'B';sfx('drag');
  if(t==='O'){sfx('door');let left=0;for(const r of grid)for(const ch of r)if(ch==='O')left++;
    if(!left){S.flags['gate:'+CUR]=1;for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(grid[y][x]==='G')grid[y][x]=M.floor;sfx('lvl');persist();
      say([N('¡Clac! Se oye cómo se levanta una reja de hierro.','Clack! You hear an iron gate rising.')])}
    else say([N('La losa se hunde con un ruido sordo. Falta otra.','The plate sinks with a dull thud. Another one is still missing.')])}
}
function pullBlock(bx,by,dx,dy){
  const px2=P.x-dx,py2=P.y-dy;
  if(!inB(px2,py2)||!walk(px2,py2)||entAt(px2,py2)||grid[P.y][P.x]!==M.floor)
    return say([N('Un bloque de piedra. Puedes empujarlo caminando contra él, o tirar de él con (A) si tienes espacio detrás de ti.','A stone block. Push it by walking into it, or pull it with (A) if there is room behind you.')]);
  grid[by][bx]=M.floor;grid[P.y][P.x]='B';sfx('drag');
  P.ox=P.x;P.oy=P.y;P.x=px2;P.y=py2;P.t=0;P.moving=true;P.spd=.125;
}
function unlock(x,y){
  if(S.keys>0){S.keys--;setTileFlag(x,y);sfx('door');persist();say([N('Usas una llave. La puerta se abre.','You use a key. The door opens.')])}
  else if(!P.bump){P.bump=1;sfx('bad');say([N('Una puerta con cerradura. Necesitas una llave pequeña.','A locked door. You need a small key.')])}
}
function edge(d){
  const E=M.edges&&M.edges[d];if(!E)return;
  if(E.need){const n=(S.pieces||[]).length;
    if(n<E.need){if(P.bump)return;P.bump=1;
      return say([N('Una niebla gris y espesa cubre el camino hacia el oeste. Ahí las palabras se borran: es la niebla de Ti Fütra Ngoymatulfe, el gran olvido.','A thick grey fog covers the road west. Words fade inside it: it is the fog of Ti Fütra Ngoymatulfe, the great forgetting.'),
        L('','Trariwe trokiñ: '+n+'/'+E.need,'Solo un trariwe completo puede atravesarla. Tienes '+n+' de '+E.need+' trokiñ: uno por cada tierra (Lafkenche, Nagche, Pewenche, Williche, Puelmapu).','Only a complete trariwe can pass through it. You have '+n+' of '+E.need+' trokiñ: one for each land (Lafkenche, Nagche, Pewenche, Williche, Puelmapu).')])}
    if(!S.flags.ngoy_open){S.flags.ngoy_open=1;persist();
      return say([N('Te pones el trariwe completo. Los cinco trokiñ brillan a la vez... y la niebla gris se abre ante ti como una cortina.','You put on the completed trariwe. The five trokiñ glow all at once... and the grey fog parts before you like a curtain.')],()=>loadMap(E.to,E.x,E.y))}}
  if(E.req&&!S.flags[E.req]){say(E.reqMsg);return}
  loadMap(E.to,E.x,E.y);
}
function setTileFlag(x,y){S.flags['t:'+CUR+':'+x+','+y]=1;grid[y][x]=M.floor}
function onStep(){
  const sb=M.sbt;
  if(typeof arenaHere==='function'&&arenaHere()&&onArena(P.x,P.y))return arenaMenu();
  if(sb&&!S.flags[sb.flag]&&!(sb.req&&!S.flags[sb.req])&&sb.t.indexOf(P.x+','+P.y)>=0)return sbossWake(sb);
  const c=grid[P.y][P.x];P.bump=0;
  if(c==='A'){if(LOFIDS.includes(CUR))lofWarpMenu();else warpMenu();return}
  if(c==='@'){portalMenu();return}
  if(c==='S'){const st=M.stairs;if(!st)return;if(st.req&&!S.flags[st.req]){say(st.reqMsg);return}sfx('door');loadMap(st.to,st.x,st.y);return}
  if(c==='P'){setTileFlag(P.x,P.y);gainPiwke([]);return}
  if(c==='k'){setTileFlag(P.x,P.y);S.keys++;sfx('pick');persist();say([N('¡Encontraste una llave pequeña!','You found a small key!')]);return}
  if(c==='m'){grid[P.y][P.x]=M.floor;S.pw.speed=60*25;sfx('pick');say([L('','Mañke','Una pluma de mañke (cóndor): corres más rápido por un rato.','A mañke (condor) feather: you run faster for a while.')]);return}
  if(c==='g'){grid[P.y][P.x]=M.floor;S.pw.gold=1;sfx('pick');say([L('','Milla ngülliw','Un ngülliw de oro (milla): la próxima pelea da el doble de ngülliw.','A golden ngülliw (milla): your next fight pays double ngülliw.')]);return}
  if(c==='p'){grid[P.y][P.x]=M.floor;S.pw.pewen=60*20;sfx('pick');say([L('','Pewen','Un cono de pewen: por un rato, los wekufü se apartan de ti.','A pewen cone: for a while, the wekufü keep away from you.')]);return}
}
function gainPiwke(pre){
  S.piwke++;const full=S.piwke%4===0;sfx(full?'lvl':'pick');
  if(full)S.hp=Math.min(maxHP(),S.hp+HPQ);
  persist();
  say(pre.concat([L('','Piwke!',full?'¡Juntaste cuatro pedazos de piwke! Ganas un corazón nuevo.':'Encontraste un pedazo de piwke ('+(S.piwke%4)+'/4). Con cuatro ganas un corazón.',
    full?'You gathered four piwke pieces! You gain a new heart.':'You found a piwke piece ('+(S.piwke%4)+'/4). Four make a new heart.')]));
}
function interact(){
  if(typeof PAL!=='undefined'&&PAL&&PAL.on&&palKick())return;
  const [dx,dy]=DV[P.dir],tx=P.x+dx,ty=P.y+dy;
  const e=entAt(tx,ty);
  if(e){if(e.kind==='npc'){e.dir=OPP[P.dir];e.wait=Math.max(e.wait,90);sfx('ok');TALKER=e;e.talk()}else if(e.kind==='animal'){e.wait=120;sfx('ok');animalTalk(e)}else engage(e);return}
  const dk=P.x+','+P.y,dv=M.digs&&M.digs[dk];
  if(dv&&!(dv.req&&!S.flags[dv.req])&&!S.flags['dig:'+CUR+':'+dk]&&(!inB(tx,ty)||WALK.has(grid[ty][tx])||grid[ty][tx]==='T'||grid[ty][tx]==='#'||grid[ty][tx]==='~'))return digFind(dk,dv);
  if(!inB(tx,ty))return;
  const c=grid[ty][tx],k=tx+','+ty;
  if(c==='F')return fireSave();
  if(c==='I'&&M.signs&&M.signs[k])return typeof M.signs[k]==='function'?M.signs[k]():say(M.signs[k]);
  if(c==='C')return openChest(tx,ty,M.chests&&M.chests[k]);
  if(c==='K'&&M.konew&&M.konew[k])return konew(tx,ty,M.konew[k]);
  if(c==='Ł'&&M.tablets&&M.tablets[k])return tabletTalk(M.tablets[k]);
  if(c==='L')return unlock(tx,ty);
  if((c==='N'||c==='J')&&M.pz&&M.pz.tiles[k])return pzTouch(tx,ty);
  if(c==='H'&&M.stones&&M.stones[k])return stoneTalk(M.stones[k]);
  if(c==='E')return say([N('Una puerta de piedra tallada. Algo cerca debe abrirla.','A carved stone door. Something nearby must open it.')]);
  if(c==='B')return pullBlock(tx,ty,dx,dy);
  if(c==='V')return say([L('','Mari mari · Kiñe, epu, küla','Una pizarra con palabras en mapudungun: "hola" y "uno, dos, tres".','A board with words in Mapudungun: "hello" and "one, two, three".')]);
  if(c==='Z')return say([L('','Witral','Un witral, el telar mapuche. El tejido muestra figuras escalonadas en rojo, negro y blanco.','A witral, the Mapuche loom. The weaving shows stepped figures in red, black and white.')]);
  if(c==='U')return say([L('','Iyael','La olla hierve sobre el fuego. Huele a comida.','The pot simmers over the fire. It smells like food.')]);
  if(c==='^')return say([N('Un montón de nieve dura te cierra el paso. Necesitas el newen de Ngen-pewen.','A heap of hard snow blocks your way. You need the newen of Ngen-pewen.')]);
  if(c==='Ñ')return say([N('Un zarzal lleno de espinas te cierra el paso. Necesitas el newen de Ngen-mawida.','A bramble full of thorns blocks your way. You need the newen of Ngen-mawida.')]);
  if(c==='D')return say([N('Un cerco de espino seco, duro como el fierro, te cierra el paso. Necesitas el newen de Ngen-lelfün.','A fence of dry thorn, hard as iron, blocks your way. You need the newen of Ngen-lelfün.')]);
  if(c==='M')return kulonBush(tx,ty);
  if(c==='x')return pickSpot(tx,ty);
  if(c==='W')return say([L('','Kachilla','Un campo de kachilla (trigo) dorado, listo para cosechar.','A field of golden kachilla (wheat), ready for harvest.')]);
  if(c==='f')return say([N('Una cerca de palos.','A wooden fence.')]);
  if(c==='Y')return say([N('El paliwe, la cancha de palin. Mejor no interrumpir el partido.','The paliwe, the palin field. Better not interrupt the game.')]);
  if(c==='X')return say([N('Un remolino de viento te empuja hacia atrás. Necesitas el newen de Ngen-kürüf'+(M.region==='williche'?'.':' (otra región).'),'A whirl of wind pushes you back. You need the newen of Ngen-kürüf'+(M.region==='williche'?'.':' (another region).'))]);
  if(c==='v'){const what=M.dive&&M.dive[k];
    if(what==='chumpall'){
      if(!S.flags.won)return say([N('Un remolino quieto y muy hondo. Desde el fondo sube un canto bajito... pero el agua todavía no te deja entrar.','A still, very deep whirlpool. From the bottom rises a soft singing... but the water will not let you in yet.')]);
      return say([N('El remolino canta. Con el newen de Ngen-lafken te sumerges, bajas y bajas... y el lago se abre en un mundo de luz verde: Münche lafken, la tierra de los chumpall.','The whirlpool sings. With the newen of Ngen-lafken you dive, down and down... and the lake opens into a world of green light: Münche lafken, the land of the chumpall.')],()=>{sfx('cast');loadMap('u_grotto',5,3)});}
    if(!S.flags.dive)return say([N('Un remolino oscuro en el agua. Es muy profundo para bajar... por ahora.','A dark whirlpool in the water. It is too deep to go down... for now.')]);
    if(S.flags['dive:'+CUR])return say([N('El agua está tranquila.','The water is calm.')]);
    S.flags['dive:'+CUR]=1;persist();
    const pre=[N('Con el newen de Ngen-lafken te sumerges en el remolino...','With the newen of Ngen-lafken you dive into the whirlpool...')];
    if(what==='piwke')return gainPiwke(pre);
    S.gold+=50;sfx('lvl');return say(pre.concat([L('','Kechu mari ngülliw!','Encontraste un tesoro escondido: kechu mari (50) ngülliw.','You found a hidden treasure: kechu mari (50) ngülliw.')]))}
}
function npcStep(e){
  if(!e.path)return;
  if(e.wait>0){e.wait--;e.mv=false;return}
  const [tx,ty]=e.path[e.pi];
  if(e.x===tx&&e.y===ty){e.pi=(e.pi+1)%e.path.length;e.wait=e.pause||30;e.mv=false;if(e.act==='cook'&&e.pi===1)e.dir='right';return}
  if(--e.cd>0)return;e.cd=e.spd||16;
  const d=e.x!==tx?(tx>e.x?'right':'left'):(ty>e.y?'down':'up');const [dx,dy]=DV[d],nx=e.x+dx,ny=e.y+dy;
  e.dir=d;
  if((nx===P.x&&ny===P.y)||entAt(nx,ny,e)){e.mv=false;return}
  e.x=nx;e.y=ny;e.mv=true;
}
function updateMap(){
  S.wtime=(S.wtime||0)+1;
  if(S.wtime%45===0&&!S.flags.stgo_call&&!active&&!P.moving&&typeof stgoOpen==='function'&&stgoOpen()&&M.region!=='santiago'){
    S.flags.stgo_call=1;persist();sfx('lvl');
    say([L('Kuku','Küpange, '+nm()+'! Küpatunge!','"¡Ven, '+nm()+'! ¡Vuelve!"','"Come, '+nm()+'! Come back!"'),
      N('La voz de tu kuku cruza todo el mapu y te encuentra donde estás. No es un sueño: te llama desde su ruka, en el lof lafkenche.','Your kuku\'s voice crosses the whole land and finds you where you stand. It is no dream: she calls you from her ruka, in the Lafkenche lof.'),
      N('(küpa-tu-nge: «ven de vuelta». -tu- marca la vuelta, -nge le habla a una persona.) El gran olvido cayó y la tierra respira. Algo más te espera: vuelve donde todo empezó.','(küpa-tu-nge: "come back". -tu- marks the return, -nge speaks to one person.) The great forgetting has fallen and the land breathes. Something more awaits you: go back to where it all began.')]);
    return}
  if(S.wtime%150===0&&typeof playAmb==='function'){
    const d=dayPhase();playAmb(OUTBG[M.bg]&&d.name==='night'&&!M.urban?'night':(typeof wxAmbKey==='function'?wxAmbKey():ambFor(M.bg)))}
  if(S.pw.speed>0)S.pw.speed--;if(S.pw.pewen>0)S.pw.pewen--;if(grace>0)grace--;
  if(P.moving){P.t+=P.spd;if(P.t>=1){P.moving=false;P.fx=P.x;P.fy=P.y;onStep()}else{P.fx=P.ox+(P.x-P.ox)*P.t;P.fy=P.oy+(P.y-P.oy)*P.t}}
  if(!P.moving&&!active&&mode==='map'){const d=heldDir();if(d)tryMove(d)}
  for(const e of ents){const sp=e.kind==='enemy'?.25:.18;e.fx+=(e.x-e.fx)*sp;e.fy+=(e.y-e.fy)*sp;if(Math.abs(e.x-e.fx)<.02)e.fx=e.x;if(Math.abs(e.y-e.fy)<.02)e.fy=e.y}
  if(active||mode!=='map')return;
  for(const e of ents){
    if(e.kind==='npc'){npcStep(e);continue}
    if(e.kind==='animal'){animalStep(e);continue}
    if(e.fixed)continue;
    if(--e.cd>0)continue;e.cd=24+rnd(36);
    const dist=Math.abs(e.x-P.x)+Math.abs(e.y-P.y);let d;
    const toward=()=>Math.abs(P.x-e.x)>Math.abs(P.y-e.y)?(P.x>e.x?'right':'left'):(P.y>e.y?'down':'up');
    if(S.pw.pewen>0&&dist<=5)d=OPP[toward()];
    else if(dist<=4&&Math.random()<.65)d=toward();else d=['up','down','left','right'][rnd(4)];
    const [dx,dy]=DV[d],nx=e.x+dx,ny=e.y+dy;
    if(nx===P.x&&ny===P.y){if(S.pw.pewen<=0&&grace<=0&&!P.moving){engage(e);return}continue}
    if(walk(nx,ny)&&!entAt(nx,ny,e)&&grid[ny][nx]!=='S'&&!(P.moving&&nx===P.x&&ny===P.y)){e.x=nx;e.y=ny}
  }
  for(const sc of SCN)if(sc.type==='palin'){
    if(PAL&&PAL.on){palUpdate(sc);continue}
    if(sc.am&&typeof GEM_ON!=='undefined'&&GEM_ON&&GEM_READY)continue;   // the new graphics run their own match (palAmbient)
    const X=sc.x*T,Y=sc.y*T,w=sc.w*T,h=sc.h*T;
    sc.bx=X+w/2+Math.sin(frame/70)*(w/2-14)+Math.sin(frame/23)*8;sc.by=Y+h/2+Math.sin(frame/41)*(h/2-8);
    sc.pl.forEach((p,i)=>{const tx=sc.bx+(i<2?-1:1)*(CT?16:10)+Math.sin(frame/30+i)*6,ty=sc.by+(i%2?1:-1)*(CT?11:8);const dx=tx-p.x,dy=ty-p.y;p.x+=dx*.035;p.y+=dy*.035;p.mv=Math.abs(dx)+Math.abs(dy)>3;if(Math.abs(dx)>1)p.dir=dx>0?'right':'left'});
  }
}

/* ================= PALIN MATCH ================= */
let PAL=null;
function palStart(){
  const sc=SCN.find(s2=>s2.type==='palin');if(!sc)return;
  PAL={on:1,s:[0,0],cool:40,kc:[0,0,0,0],endT:0};
  const X=sc.x*T,Y=sc.y*T,w=sc.w*T,h=sc.h*T;
  sc.bx=X+w/2;sc.by=Y+h/2;PAL.bvx=0;PAL.bvy=0;
  P.x=sc.x+1;P.y=sc.y+1;P.fx=P.x;P.fy=P.y;P.px=P.x*T;P.py=P.y*T;P.dir='right';
  sc.pl[0].x=X+w*.25;sc.pl[0].y=Y+h*.7;   // teammate
  sc.pl[1].x=X+w*.4;sc.pl[1].y=Y+h*.3;    // teammate
  sc.pl[2].x=X+w*.65;sc.pl[2].y=Y+h*.3;   // rival
  sc.pl[3].x=X+w*.75;sc.pl[3].y=Y+h*.7;   // rival
  sfx('enc');showBanner('Palin!',S.gloss==='en'?'First to 3. Kick the pali with A/Z!':'El primero a 3. ¡Golpea la pali con A/Z!');
}
function palUpdate(sc){
  const X=sc.x*T,Y=sc.y*T,w=sc.w*T,h=sc.h*T;
  if(PAL.cool>0){PAL.cool--;PAL.bvx=0;PAL.bvy=0}
  // ball physics
  sc.bx+=PAL.bvx;sc.by+=PAL.bvy;PAL.bvx*=.955;PAL.bvy*=.955;
  if(sc.by<Y+5){sc.by=Y+5;PAL.bvy=Math.abs(PAL.bvy)*.7}
  if(sc.by>Y+h-4){sc.by=Y+h-4;PAL.bvy=-Math.abs(PAL.bvy)*.7}
  // dribble: walking into the ball nudges it
  const hx=P.fx*T+8,hy=P.fy*T+8,hd=Math.hypot(hx-sc.bx,hy-sc.by);
  if(hd<11&&PAL.cool<=0){const a=Math.atan2(sc.by-hy,sc.bx-hx);PAL.bvx=Math.cos(a)*1.5;PAL.bvy=Math.sin(a)*1.2}
  // AI
  sc.pl.forEach((p,i)=>{if(PAL.kc[i]>0)PAL.kc[i]--;
    const atkR=i<2,gx=atkR?X+w:X; // teammates shoot right, rivals left
    const behind=atkR?-7:7;
    let tx=sc.bx+behind,ty=sc.by+(i%2?5:-5);
    const dx=tx-p.x,dy=ty-p.y,dd=Math.hypot(dx,dy);
    const sp=i<2?.75:.85;
    if(dd>2){p.x+=dx/dd*sp;p.y+=dy/dd*sp;p.mv=1;if(Math.abs(dx)>1)p.dir=dx>0?'right':'left'}else p.mv=0;
    const bd=Math.hypot(p.x-sc.bx,p.y-sc.by);
    if(bd<12&&PAL.kc[i]<=0&&PAL.cool<=0){
      const a=Math.atan2((Y+h/2+(Math.random()-.5)*h*.6)-sc.by,gx-sc.bx);
      PAL.bvx=Math.cos(a)*2.1;PAL.bvy=Math.sin(a)*1.6;PAL.kc[i]=55+rnd(30);sfx('move')}
  });
  p_clampBall(sc,X,Y,w,h);
  if(PAL.endT>0){PAL.endT--;if(PAL.endT<=0)palEnd()}
}
function p_clampBall(sc,X,Y,w,h){
  if(PAL.endT>0)return;
  if(sc.bx<X+3){palGoal(sc,1,X,Y,w,h)}
  else if(sc.bx>X+w-3){palGoal(sc,0,X,Y,w,h)}
}
function palGoal(sc,team,X,Y,w,h){
  PAL.s[team]++;sfx('lvl');
  showBanner('Tripay pali!',(S.gloss==='en'?'Goal! ':'¡Gol! ')+'Eymi '+PAL.s[0]+' · '+PAL.s[1]+(S.gloss==='en'?' Them':' Ellos'));
  sc.bx=X+w/2;sc.by=Y+h/2;PAL.bvx=0;PAL.bvy=0;PAL.cool=55;
  if(PAL.s[team]>=3)PAL.endT=70;
}
function palKick(){
  if(!PAL||!PAL.on)return false;
  const sc=SCN.find(s2=>s2.type==='palin');if(!sc)return false;
  const hx=P.fx*T+8,hy=P.fy*T+8;
  if(Math.hypot(hx-sc.bx,hy-sc.by)>16)return false;
  if(PAL.cool>0)return true;
  const DV2={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[P.dir];
  PAL.bvx=DV2[0]*3.1+(Math.random()-.5)*.6;PAL.bvy=DV2[1]*2.4+(Math.random()-.5)*.6;
  sfx('hit');return true;
}
function palEnd(){
  const won=PAL.s[0]>PAL.s[1];PAL=null;
  if(won){
    const first=!S.flags.palin_won;if(first)S.flags.palin_won=1;
    const g=first?40:10;S.gold+=g;persist();sfx('lvl');
    say([L('Kona','Kümey! Wewiñ!','¡Bien! ¡Ganamos!','Well done! We won!'),
      praise(),
      N('Los jugadores te golpean el hombro, riéndose. Ganas '+g+' ngülliw.'+(first?' «Palin püle, pu che püle»: el palin junta a la gente.':''),'The players clap you on the shoulder, laughing. You earn '+g+' ngülliw.'+(first?' Palin brings the people together.':''))]);
  }else{
    say([L('Kona','Küme awkantun! Ka antü wewaiñ.','¡Buen partido! Otro día ganaremos.','Good game! Another day we will win.'),
      N('Los jugadores se despiden con el wiño en alto. Puedes pedir la revancha cuando quieras.','The players salute you with their wiños raised. You can ask for a rematch any time.')]);
  }
}

/* ---- touch controls (phone): no on-screen buttons ----
   tap = talk / confirm / advance speech
   hold + drag = walk (keep holding to keep walking; release to stop)
   swipe on a menu = scroll it (native)   two-finger tap = back (B)
   long press = pause menu */
(function(){
  const wrap=$('wrap');
  const onUI=e=>e.target.closest&&e.target.closest('#menu,#dlg,#title,#skip,#pad,button');
  let tid=null,x0=0,y0=0,t0=0,moved=0,two=0,lp=null;
  let lastA=0;
  const stop=()=>{held.up=held.down=held.left=held.right=0};
  wrap.addEventListener('touchstart',e=>{
    auInit();
    if(mode==='palin'&&PG&&!active&&tid!==null&&!onUI(e)){e.preventDefault();palinSwing();return}   // second finger while running = strike
    if(e.touches.length>=2){two=1;stop();if(lp){clearTimeout(lp);lp=null}return}
    if(onUI(e))return;
    e.preventDefault();
    const t=e.changedTouches[0];tid=t.identifier;x0=t.clientX;y0=t.clientY;t0=Date.now();moved=0;two=0;
    lp=setTimeout(()=>{lp=null;if(!moved&&!two&&!active){if(mode==='map'){tid=null;stop();openPause()}else if(mode==='palin'&&PG){tid=null;stop();palinQuit()}}},600);
  },{passive:false});
  const DEAD=24,SWITCH=1.4;   // bigger dead zone + hysteresis so small wobbles don't steer
  wrap.addEventListener('touchmove',e=>{
    if(tid===null)return;
    let t=null;for(const u of e.changedTouches)if(u.identifier===tid)t=u;
    if(!t)return;
    e.preventDefault();
    const dx=t.clientX-x0,dy=t.clientY-y0,dist=Math.hypot(dx,dy);
    if(mode==='palin'&&PG&&!active){   // on the palin field: free 8-way running, like a joystick
      if(dist>12){moved=1;if(lp){clearTimeout(lp);lp=null}stop();
        if(Math.abs(dx)>dist*.38)held[dx>0?'right':'left']=1;if(Math.abs(dy)>dist*.38)held[dy>0?'down':'up']=1}
      if(dist>60){const k=40/dist;x0=t.clientX-dx*k;y0=t.clientY-dy*k}
      return}
    if(dist>DEAD){moved=1;if(lp){clearTimeout(lp);lp=null}
      if(mode==='map'&&!active){
        const ax=Math.abs(dx),ay=Math.abs(dy);
        let d=ax>ay?(dx>0?'right':'left'):(dy>0?'down':'up');
        const cur=heldDir();
        if(cur&&d!==cur){
          const curH=(cur==='left'||cur==='right'),dH=(d==='left'||d==='right');
          if(dH!==curH&&!((dH?ax:ay)>(dH?ay:ax)*SWITCH))d=cur; // switching axis takes a clear move
        }
        stop();held[d]=1}
      if(dist>80){const k=48/dist;x0=t.clientX-dx*k;y0=t.clientY-dy*k}}
  },{passive:false});
  const end=e=>{
    let fin=null;for(const u of e.changedTouches)if(u.identifier===tid)fin=u;
    if(e.touches.length===0){
      if(lp){clearTimeout(lp);lp=null}
      const dt=Date.now()-t0;
      if(two){two=0;tid=null;stop();if(dt<500)pressB();return}
      if(fin&&tid!==null&&!moved&&dt<350&&Date.now()-lastA>150){
        lastA=Date.now();
        // handled here: cancel the click the browser would synthesize afterwards, which could land on a
        // menu that has just opened under the finger and pick an option before the player sees it
        if(active){if(active.kind==='say'){if(e.cancelable)e.preventDefault();active.a()}}
        else if(mode==='map'){if(e.cancelable)e.preventDefault();interact()}
        else if(mode==='palin'&&PG){if(e.cancelable)e.preventDefault();palinSwing()}
      }
      tid=null;stop();moved=0;
    }else if(fin){tid=null;stop()}
  };
  wrap.addEventListener('touchend',end);
  wrap.addEventListener('touchcancel',end);
})();
