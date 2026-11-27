/* ---------- weather: each kind of land has its own sky that changes every few minutes.
   Light on screen (never enough to hide secrets), named in Mapudungun when it changes, heard, talked about,
   and some wekufü only come out in it. Heavy fog stays reserved for Ngoyman. ---------- */
const WXT={coast:[['antu',4],['tromu',3],['mawun',2],['kuruf',1]],field:[['antu',45],['tromu',30],['mawun',20],['kuruf',5]],
  forest:[['antu',40],['tromu',30],['mawun',30]],mount:[['antu',35],['pire',35],['kuruf',20],['tromu',10]],
  rainforest:[['mawun',5],['tromu',3],['antu',2]],fjord:[['mawun',5],['tromu',3],['kuruf',2]],pampa:[['antu',45],['kuruf',45],['tromu',10]],
  waria:[['antu',4],['tromu',3],['mawun',3]]};
const WXL={antu:['Antü','Sale el sol','The sun is out'],tromu:['Tromü','Se nubla','Clouds roll in'],mawun:['Mawün','Llueve','It is raining'],
  pire:['Pire','Nieva','It is snowing'],kuruf:['Kürüf','Sopla el viento','The wind is blowing']};
const WXB={antu:['Küme antüngey!','Küme antüngey.'],tromu:['Tromüley.','Tromüley...'],mawun:['Mawünküley!','Alün mawi!'],pire:['Pireley!','Pireley...'],kuruf:['Kürüfküley!','Kürüfküley...']};
const WXE={mawun:'mawek',pire:'pire',kuruf:'chonchon'};   // wekufü that ride this weather
const WXS={last:null,key:null,toast:0,txt:null};
const WXALIAS={feria:'waria',blocks:'waria'};   // the whole of Santiago shares one sky
function wxKey(){if(!M||M.interior||M.dungeon||M.under||M.fog)return null;const k=WXALIAS[M.bg]||M.bg;return WXT[k]?k:null}
function wxNow(){const key=wxKey();if(!key)return null;S.wx=S.wx||{};let w=S.wx[key];const now=Date.now();
  if(!w||now>w.u){const tb=WXT[key],tot=tb.reduce((a,b)=>a+b[1],0);let r=Math.random()*tot,k=tb[0][0];for(const [n,p] of tb){if((r-=p)<0){k=n;break}}
    w={k,u:now+(180+Math.random()*240)*1000};S.wx[key]=w}
  return w.k}
function wxAmbKey(){const w=wxNow();return ambFor(M.bg)+(w==='mawun'||w==='kuruf'?'|'+w:'')}
function wxTick(){const key=wxKey(),w=wxNow();
  if(key!==WXS.key||w!==WXS.last){const changed=key===WXS.key&&WXS.last&&w;WXS.key=key;WXS.last=w;
    if(w&&(changed||!S.flags['wxs_'+key+w])){S.flags['wxs_'+key+w]=1;S.flags.wx_book=1;WXS.txt=WXL[w];WXS.toast=200}
    if(typeof playAmb==='function'&&mode==='map')playAmb(wxAmbKey())}
  if(WXS.toast>0)WXS.toast--}
function wxSpawn(){const w=wxNow(),t=w&&WXE[w];if(!t||!ET[t]||!ents.some(e=>e.kind==='enemy'))return;if(ET[t].fly&&!S.roots.includes('nagtu'))return;
  for(let k=0;k<60;k++){const x=1+rnd(M.w-2),y=1+rnd(M.h-2);if(!WALK.has(grid[y][x])||Math.abs(x-P.x)+Math.abs(y-P.y)<6||ents.some(e=>e.x===x&&e.y===y))continue;
    ents.push({kind:'enemy',x,y,fx:x,fy:y,ox:x,oy:y,party:t==='chonchon'?['chonchon','chonchon']:[t],cd:30+rnd(60),dir:'down',pi:0,wait:0,bt:rnd(400),wx:1});return}}
function wxBubble(e,txt){const w=WXS.last;if(!w||!WXB[w]||e.kind!=='npc')return txt;return(Math.floor((frame+e.bt)/600)+e.bt)%3===0?WXB[w][e.bt%2]:txt}
/* overworld: drawn inside atmos() in the map's own coordinates */
function drawWxMap(c,w,ox,oy,W,H){
  const wrapX=x=>((x%W)+W)%W,wrapY=y=>((y%H)+H)%H,P2=(n,fn)=>{for(let k=0;k<n;k++)fn(k,((k*9301+49297)%233280)/233280)};
  if(w==='mawun'){c.fillStyle='rgba(190,210,235,.5)';P2(70,(k,r)=>{const x=wrapX(r*W*9-frame*1.2-ox),y=VY+wrapY(frame*4.2+k*37-oy);c.fillRect(Math.round(x),Math.round(y),1,4)});
    P2(14,(k,r)=>{const t=(frame+k*23)%40;if(t<10){const x=wrapX(r*W*5-ox*1),y=VY+wrapY(k*61-oy);c.fillStyle='rgba(210,225,245,'+(.6-t*.05)+')';c.fillRect(Math.round(x)-Math.floor(t/3),Math.round(y),1+Math.floor(t/3)*2,1)}})}
  else if(w==='pire'){P2(46,(k,r)=>{const x=wrapX(r*W*7+Math.sin(frame/50+k)*14-ox),y=VY+wrapY(frame*(.35+r*.4)+k*31-oy);c.fillStyle='rgba(90,110,150,.45)';c.fillRect(Math.round(x)+1,Math.round(y)+1,1,1);c.fillStyle=r>.6?'#ffffff':'rgba(240,246,255,.9)';c.fillRect(Math.round(x),Math.round(y),r>.8?2:1,r>.8?2:1)})}
  else if(w==='kuruf'){P2(22,(k,r)=>{const x=wrapX(frame*(2.6+r*2)+r*W*6-ox),y=VY+wrapY(k*29+Math.sin(frame/14+k)*4-oy);c.fillStyle='rgba(235,240,250,.32)';c.fillRect(Math.round(x),Math.round(y),8+Math.round(r*10),1)});
    P2(8,(k,r)=>{const x=wrapX(frame*(3+r*2)+r*W*4-ox),y=VY+wrapY(k*53+Math.sin(frame/7+k)*6-oy);c.fillStyle=k%2?'#9a7a30':'#6a9a40';c.fillRect(Math.round(x),Math.round(y),2,1);c.fillRect(Math.round(x)+1,Math.round(y)-((frame>>2)+k)%2,1,1)})}
  else if(w==='tromu'){for(let k=0;k<3;k++){const cx=wrapX(frame*.18+k*W/3-ox*.6),cy=VY+40+k*55-((oy*.6)%60);
    const g=dRad(0,0,10,0,0,60);g.addColorStop(0,'rgba(20,24,40,.16)');g.addColorStop(1,'rgba(20,24,40,0)');c.save();c.translate(Math.round(cx-70),Math.round(cy-40));c.scale(1,.6);g.fill(c,-60,-60,140,140);c.restore()}}
  if(w==='mawun'||w==='tromu'){c.fillStyle=w==='mawun'?'rgba(30,40,60,.16)':'rgba(30,36,52,.08)';c.fillRect(0,VY,W,H)}
  if(w==='pire'){c.fillStyle='rgba(220,230,250,.06)';c.fillRect(0,VY,W,H)}
  if(WXS.toast>0&&WXS.txt){const a=Math.min(1,WXS.toast/30),t2=WXS.txt,y=VY+52;
    OV.push(()=>{ctx.save();ctx.globalAlpha=a;txt(t2[0],LW/2,y,'#ffffff',18,'center');txt(S.gloss==='en'?t2[2]:t2[1],LW/2,y+11,'#d4f0e2',12,'center');ctx.restore()})}
}
/* battle: over the painted backdrop */
function wxBattle(c,w){
  if(w==='mawun'){for(let k=0;k<60;k++){const x=((k*29-Math.floor(frame*1.2))%LW+LW)%LW,y=Math.floor((k*47+frame*4.2)%LH);R(c,x,y,1,4,'rgba(190,210,235,.5)')}c.fillStyle='rgba(30,40,60,.16)';c.fillRect(0,0,LW,LH)}
  else if(w==='pire'){for(let k=0;k<44;k++){const x=((k*53+Math.round(Math.sin(frame/40+k)*10))%LW+LW)%LW,y=Math.floor((k*31+frame*(.5+(k%5)*.1))%LH);R(c,x,y,k%4?1:2,k%4?1:2,'#ffffff')}}
  else if(w==='kuruf'){for(let k=0;k<20;k++){const x=((frame*(3+(k%4))+k*61)%(LW+40))-20,y=(k*37)%(LH-40);R(c,Math.round(x),y,10+(k%3)*4,1,'rgba(235,240,250,.3)')}}
  else if(w==='tromu'){c.fillStyle='rgba(30,36,52,.1)';c.fillRect(0,0,LW,LH)}
  if(B&&/^(waria|feria|blocks)/.test(B.area))wxCity(c,w);
}
/* the city's own weather on top: smog under a grey sky, rain splashing on the asphalt and running in the gutters */
function wxCity(c,w){
  if(w==='tromu'){const g=dLin(0,0,0,LH*.7);g.addColorStop(0,'rgba(120,104,96,.22)');g.addColorStop(.6,'rgba(140,120,100,.12)');g.addColorStop(1,'rgba(140,120,100,0)');g.fill(c,0,0,LW,Math.round(LH*.7))
    for(let k=0;k<5;k++){const x=((k*97+frame*.15)%(LW+160))-80;c.fillStyle='rgba(150,134,120,.06)';c.fillRect(Math.round(x),30+k*14,120,6)}}
  else if(w==='mawun'){for(let k=0;k<26;k++){const ph=(frame+k*13)%24,x=(k*71+Math.floor((frame+k*13)/24)*37)%LW,y=112+((k*29)%40);
      if(ph<6){const r=1+ph/2;c.fillStyle='rgba(200,214,236,'+(.5-ph*.07).toFixed(2)+')';c.fillRect(Math.round(x-r),y,Math.round(r*2),1);if(ph<2){c.fillRect(x,y-2,1,1);c.fillRect(x-2,y-1,1,1);c.fillRect(x+2,y-1,1,1)}}}
    const g=dLin(0,LH*.5,0,LH);g.addColorStop(0,'rgba(120,140,180,0)');g.addColorStop(1,'rgba(120,140,180,.12)');g.fill(c,0,LH/2,LW,LH/2)}
  else if(w==='antu'&&dayPhase().name==='day'){c.save();c.globalCompositeOperation='lighter';const g=dRad(LW*.85,-20,10,LW*.85,-20,LW*.8);g.addColorStop(0,'rgba(255,236,190,.16)');g.addColorStop(1,'rgba(255,236,190,0)');g.fill(c,0,0,LW,LH);c.restore()}
}
