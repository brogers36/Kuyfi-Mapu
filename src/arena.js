/* ---------- Weichawe: a ruka in every lof with a red circle inside, to fight again any wekufü already beaten ---------- */
// the door-less ruka on the east side of each lof's road becomes the Weichawe; inside it, the red circle
const ARDOOR={lof:[29,8,'l'],n_lof:[28,8,'n'],p_lof:[28,8,'p'],w_lof:[28,8,'w'],e_lof:[28,8,'e']};
for(const lid in ARDOOR){const [dx,dy,pre]=ARDOOR[lid],id=pre+'_weichawe',L0=MAPS[lid];
  MAPROWS[id]=['%%%%%%%%%%%%%%','%____________%','%____________%','%____________%','%____________%','%____________%','%____________%','%____________%','%%%%%%__%%%%%%'];
  MAPS[id]={name:'Weichawe',g:{es:'La ruka del círculo rojo: aquí se vuelve a pelear con los wekufü ya vencidos',en:'The ruka of the red circle: here you fight again the wekufü you have already defeated'},
    region:L0.region,floor:'_',bg:L0.bg,song:'cave',pal:'rukain',wall:'ruka',interior:1,arena:{x:6,y:3,w:2},
    edges:{down:{to:lid,x:dx,y:dy+1}},ents:[],rows:MAPROWS[id],w:14,h:9};
  L0.doors=L0.doors||{};L0.doors[dx+','+dy]={to:id,x:6,y:7,req:'boss',
    reqMsg:[N('La puerta está amarrada con boqui negro. Desde adentro se oye un zumbido sordo, como de algo que espera.','The door is lashed shut with black vine. From inside comes a dull hum, like something waiting.')]}}
const ARENA=[
  {g:0,t:'trelke',f:'boss',bg:'lagoon',av:'lafken'},
  {g:0,t:'witranalwe',f:'boss2',bg:'forest',av:'mawida'},
  {g:0,t:'cherrufe',f:'boss3',bg:'crater',av:'pewen'},
  {g:0,t:'kaleuche',f:'boss4',bg:'fjord',av:'kuruf'},
  {g:0,t:'walichu',f:'boss5',bg:'pampa',av:'lelfun'},
  {g:0,t:'ngoyman1',f:'bossF',bg:'fjord',fog:1,o:{final:1}},
  {g:1,t:'chinifilu',f:'sb1',bg:'coast',av:'lafken'},
  {g:1,t:'piwuchen',f:'sb2',bg:'field',av:'mawida'},
  {g:1,t:'wallipen',f:'sb3',bg:'mount',av:'pewen'},
  {g:1,t:'trawko',f:'sb4',bg:'rainforest',av:'kuruf'},
  {g:1,t:'chadikura',f:'sb5',bg:'pampa',av:'lelfun'},
  {g:1,t:'kalku',f:'sb6',bg:'pampa',av:'lelfun'},
  {g:1,t:'epunamun',f:'epu_won',bg:'fjord',fog:1,o:{sflag:'epu_won'}},
  {g:1,t:'llufu1',f:'chboss',bg:'deep',o:{chain:'llufu'}},
  {g:1,t:'llawfen',f:'llaw_won',bg:'coast',fog:1,av:null,o:{sflag:'llaw_won',song:'ngoyFinal'},setup:()=>{ET.llawfen.name=llawName();llawSetup()}},
  {g:2,t:'ngoyngoyun',f:'sw1',bg:'feria'},
  {g:2,t:'ngamlef',f:'sw2',bg:'metro'},
  {g:2,t:'fillantu',f:'sw3',bg:'blocks'},
  {g:2,t:'yewen',f:'yewen_won',bg:'waria',o:{sflag:'yewen_won',song:'yewenBoss'}}];
function arenaOpen(){return !!(S&&S.flags&&(S.flags.boss||S.flags.ngen))}
function arenaHere(){return !!(M&&M.arena)&&arenaOpen()}
function onArena(x,y){const a=M&&M.arena;return !!a&&y===a.y&&x>=a.x&&x<a.x+(a.w||1)}
function arenaName(a){return a.t==='llawfen'?llawName():(ET[a.t]&&ET[a.t].name)||a.t}
function arenaIntro(){if(S.flags.arena_hint||!LOFIDS.includes(CUR)||!arenaOpen()||!ARDOOR[CUR])return;S.flags.arena_hint=1;persist();
  say([N('Junto al camino, sobre la puerta de una ruka, ahora cuelga un letrero: WEICHAWE. Adentro late un círculo rojo. Entra cuando quieras volver a pelear con los wekufü que ya venciste.','By the road, over the door of a ruka, a sign now hangs: WEICHAWE. Inside, a red circle throbs. Go in whenever you want to fight the wekufü you have already defeated again.')])}
function arenaMenu(){const en=S.gloss==='en';
  const have=ARENA.filter(a=>S.flags[a.f]);
  const GRP=[['Jefes de los ngen','The ngen bosses'],['Wekufü secretos','Secret wekufü'],['Santiago','Santiago']];
  const first=!S.flags.arena_seen;S.flags.arena_seen=1;
  const intro=first?[N('El círculo rojo late bajo tus pies como un piwke enfermo. No lleva a ningún lugar del mapu: lleva al Weichawe, donde los wekufü que ya venciste siguen esperando.','The red circle throbs under your feet like a sick piwke. It leads nowhere in the mapu: it leads to the Weichawe, where the wekufü you already defeated are still waiting.'),
      N('Aquí puedes volver a pelear con ellos para repasar tus palabras. Si pierdes, despiertas junto al círculo sin perder nada.','Here you can fight them again to review your words. If you lose, you wake by the circle without losing anything.')]
    :[N('El círculo rojo late bajo tus pies. Desde el Weichawe te llaman los wekufü que ya venciste.','The red circle throbs under your feet. From the Weichawe, the wekufü you already defeated are calling you.')];
  const pickGrp=()=>{const gs=[0,1,2].filter(g=>have.some(a=>a.g===g));
    if(gs.length===1)return pickBoss(gs[0]);
    choose({m:'Chem wekufü?',es:'¿Con qué wekufü quieres volver a pelear?',en:'Which wekufü do you want to fight again?'},
      gs.map(g=>({m:GRP[g][en?1:0],v:g})).concat([{m:en?'Leave':'Salir',v:-1}]),g=>{if(g<0||g===undefined)return;pickBoss(g)},true)};
  const pickBoss=g=>{const L2=have.filter(a=>a.g===g);
    choose({m:'Chem wekufü?',es:'¿Con qué wekufü quieres volver a pelear?',en:'Which wekufü do you want to fight again?'},
      L2.map(a=>({m:arenaName(a),v:ARENA.indexOf(a)})).concat([{m:en?'Back':'Volver',v:-1}]),k=>{if(k<0||k===undefined)return pickGrp();arenaFight(ARENA[k])},true)};
  say(intro,pickGrp);
}
function arenaFight(a){
  const o=Object.assign({boss:1,arena:{from:CUR,x:P.x,y:P.y},bg:a.bg,fog:a.fog||0},a.o||{});
  o.av=('av' in a)?a.av:null;
  S.hp=maxHP();S.sp=SPMAX;
  say([N('El círculo rojo se cierra sobre ti. Cuando se abre de nuevo, '+arenaName(a)+' ya está esperando.','The red circle closes over you. When it opens again, '+arenaName(a)+' is already waiting.')],()=>{
    startBattle([a.t],o);if(a.setup)a.setup()});
}
/* back from the Weichawe: no story, no reward beyond the fight itself */
function arenaEnd(how){
  S.hp=Math.max(S.hp,1);persist();
  if(how==='win')return say([N('El círculo rojo te devuelve a la ruka. La pelea se queda en tu memoria; las palabras, en tu boca.','The red circle sets you back in the ruka. The fight stays in your memory; the words, in your mouth.')]);
  if(how==='flee')return say([N('Sales del círculo rojo y vuelves a la ruka.','You step out of the red circle and return to the ruka.')]);
}
function arenaLose(){
  S.curse=0;S.hp=maxHP();S.sp=SPMAX;mode='map';B=null;AU.name=null;playSong(mapSong());grace=30;
  if(typeof playAmb==='function'){playAmb(typeof wxAmbKey==='function'?wxAmbKey():ambFor(M.bg));ambVol(.5)}
  persist();
  say([N('Te quedas sin fuerzas... y despiertas junto al círculo rojo, en la ruka. En el Weichawe no se pierde nada: solo se aprende.','You collapse... and wake beside the red circle, in the ruka. In the Weichawe nothing is lost: you only learn.')]);
}
function drawArenaRing(c,cx,cy){
  const t=frame/16,pu=.82+.18*Math.sin(frame/11);
  for(const [r,al] of [[30,.14],[22,.17],[14,.22]])ell(c,cx,cy+3,r*pu+4,(r*pu+4)*.42,'rgba(150,10,20,'+al+')');
  const bw=10+Math.round(Math.sin(frame/8)*2);
  for(let i=0;i<5;i++){const w=bw-i*2;if(w<=0)continue;R(c,cx-(w>>1),cy-70+i*5,w,70-i*5,'rgba('+(120+i*22)+','+(10+i*6)+','+(20+i*4)+','+(0.07+i*.025)+')')}
  R(c,cx-1,cy-70,3,70,'rgba(255,120,110,.22)');
  c.save();c.translate(cx,cy+3);
  for(const [rx,ry,lw,col,dash,sp] of [[24,10,3,'rgba(190,20,30,.9)',[9,6],-1],[18,7.6,2,'rgba(255,80,60,.85)',[5,6],1.4],[11,4.6,2,'rgba(40,0,6,.9)',[3,3],-2]]){
    c.strokeStyle=col;c.lineWidth=lw;c.setLineDash(dash);c.lineDashOffset=frame*sp*.6;
    c.beginPath();c.ellipse(0,0,rx*pu,ry*pu,0,0,6.283);c.stroke()}
  c.setLineDash([]);c.restore();
  ell(c,cx,cy+3,6,2.8,'rgba(20,0,4,.95)');ell(c,cx,cy+3,3,1.3,'rgba(255,40,30,.9)');
  for(let k=0;k<12;k++){const ph=((frame*.8+k*47)%140)/140,an=k*1.9+t*.4;
    const px2=cx+Math.cos(an)*(15-ph*6),py2=cy+2-ph*50;
    R(c,px2,py2,k%3?1:2,k%3?2:2,'rgba(255,'+(60+k*8)+',40,'+((1-ph)*.85)+')')}
  for(let k=0;k<3;k++){const an=-t*1.3+k*2.094,px2=cx+Math.cos(an)*21*pu,py2=cy+3+Math.sin(an)*8.6*pu;
    ell(c,px2,py2,3,3,'rgba(200,20,20,.4)');R(c,px2-1,py2-1,3,3,'rgba(255,90,70,.8)');R(c,px2,py2,1,1,'#ffd0c0')}
}

/* ---------- Füta palin: the tournament between the lofs ---------- */
const PALT=[
  {lof:'Lafkenche',hm:1.06,look:['fisher','walker','kona']},
  {lof:'Pewenche',hm:1.14,look:['lonko2','kona','elder']},
  {lof:'Williche',hm:1.22,look:['weaver','fisher','lonko']},
  {lof:'Puelche',hm:1.32,look:['lonko','kona','lonko2']}];
function palinTourTalk(){const en=S.gloss==='en',k=Math.min(PALT.length-1,+S.flags.palT||0),done=!!S.gear.newenwino;
  const ls=(!S.flags.palT_seen?[L('Palife','Füta palin müley!','¡Hay un füta palin, un gran torneo! Juegan los equipos de todos los lof. Cada partido es más difícil que el anterior.','There is a füta palin, a great tournament! The teams of every lof play. Each match is harder than the last.'),
      L('Palife','','Quien gana los cuatro partidos se lleva el newen wiño, el wiño de los campeones. Pega mucho más fuerte que un fütra wiño.','Whoever wins all four matches takes the newen wiño, the champions\' stick. It hits much harder than a fütra wiño.')]:[])
    .concat([done?L('Palife','','Tú ya eres campeona o campeón del füta palin. ¿Juegas otra vuelta, por el gusto?','You are already a füta palin champion. Play another round, just for the fun of it?')
      :L('Palife','','Te toca jugar contra el equipo '+PALT[k].lof+' (partido '+(k+1)+' de '+PALT.length+').','Your next match is against the '+PALT[k].lof+' team (match '+(k+1)+' of '+PALT.length+').')]);
  S.flags.palT_seen=1;
  say(ls,()=>choose({m:'Palituaiñ?',es:'¿Juegas?',en:'Play?'},[{m:'May',g:en?'Play the match':'Jugar el partido',v:1},{m:'Wüla müten',g:en?'Later':'Después',v:0}],v=>{
    if(!v)return;say([N('Los jugadores del lof '+PALT[done?0:k].lof+' entran a la cancha con sus wiño al hombro.','The players of the '+PALT[done?0:k].lof+' lof walk onto the field, sticks on their shoulders.')],()=>palinStart(done?0:k))},true,true));
}
function palinTourEnd(k,won,quit,ls){const en=S.gloss==='en';
  if(quit)return ls;
  if(!won){ls.push(L('Palife','','El equipo '+PALT[k].lof+' nos ganó esta vez. Cuando quieras, volvemos a desafiarlo.','The '+PALT[k].lof+' team beat us this time. Whenever you like, we will challenge them again.'));return ls}
  if(S.gear.newenwino){S.flags.palT=0;return ls}
  S.gold+=15;S.flags.palT=k+1;
  if(k+1<PALT.length){ls.push(N('+15 ngülliw. Próximo partido: el equipo '+PALT[k+1].lof+'.','+15 ngülliw. Next match: the '+PALT[k+1].lof+' team.'));return ls}
  S.flags.palT=0;S.gear.newenwino=1;S.xp+=20;sfx('lvl');
  const l=L('Palife','Newen wiño!','¡Ganamos el füta palin! Los cuatro lof te entregan el newen wiño: fuerza +6 (reemplaza al fütra wiño).','We won the füta palin! The four lofs hand you the newen wiño: strength +6 (it replaces the fütra wiño).');l.fx=()=>sfx('lvl');
  ls.push(l,N('+15 ngülliw · +20 kimün.','+15 ngülliw · +20 kimün.'));return ls;
}
