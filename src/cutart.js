/* ============================================================
   CUTSCENES, upgraded: full-width scenes painted in layers (cached), parallax drift,
   letterbox bars, cross-fades between shots, high-resolution 3D characters and creatures.
   Replaces renderCut / renderEndCut from render.js.
   ============================================================ */
const CA={};
function caLayer(key,w,h,paint){const k=key+':'+w+'x'+h;if(CA[k])return CA[k];const [cv,c]=mk(w,h);paint(c,w,h);return CA[k]=cv}
/* a character at double resolution with the 3D repaint (front 'down', back 'up', side 'left'/'right') */
function cutChar(look,dir,fr){const k='cc'+look+dir+(fr||0);if(CA[k])return CA[k];
  if(dir==='left'&&SPR2['hero_'+look])return CA[k]=tplCanvas('hero_'+look,fr||0,1);
  if(dir==='right'&&SPR2['hero_'+look])return CA[k]=mirror(tplCanvas('hero_'+look,fr||0,1));
  let raw=ctCharSpriteRaw(look,dir==='left'?'right':dir,fr||0,false);let big=scale2xCanvas(raw);if(dir==='left')big=mirror(big);
  return CA[k]=repaintSmall(big,{amp:.95,capG:9,capP:5,lift:.14,sh:.7})}
function caVolcano(c,x,base,top,cols){
  c.fillStyle=cols[0];c.beginPath();c.moveTo(x-62,base);c.lineTo(x-6,top);c.lineTo(x+6,top);c.lineTo(x+62,base);c.closePath();c.fill();
  c.fillStyle=cols[1];c.beginPath();c.moveTo(x+1,top);c.lineTo(x+6,top);c.lineTo(x+62,base);c.lineTo(x+18,base);c.closePath();c.fill();
  c.fillStyle=cols[2];c.beginPath();c.moveTo(x-8,top+4);c.lineTo(x+8,top+4);c.lineTo(x+15,top+16);c.lineTo(x+9,top+12);c.lineTo(x+4,top+18);c.lineTo(x,top+12);c.lineTo(x-4,top+17);c.lineTo(x-8,top+11);c.lineTo(x-15,top+16);c.closePath();c.fill()}
function caLand(c,w,h,P){ // P: palette for one mood
  bands(c,0,140,P.sky);
  if(P.stars)for(let k=0;k<60;k++)R(c,(k*97)%w,(k*53)%70,1,1,k%5?'#ffffffaa':'#fff');
  if(P.sun){for(const [r,a] of [[46,.06],[30,.10],[18,.18]])ell(c,P.sun[0],P.sun[1],r,r,'rgba(255,220,160,'+a+')');ell(c,P.sun[0],P.sun[1],13,13,P.sunC||'#ffd8a0');ell(c,P.sun[0],P.sun[1],10,10,'#fff2c8')}
  ridge(c,96,44,1.3,P.far,P.farRim);ridge(c,104,30,3.1,P.far2);
  caVolcano(c,Math.round(w*.64),136,48,P.volc);
  ridge(c,128,16,4.2,P.hill,P.hillRim);
  for(let i=0;i<Math.ceil(w/18);i++)araucaria(c,6+i*18+(i%2)*5,134+(i%3)*2,14+(i*7)%8,P.tree);
  ridge(c,138,8,7.1,P.hill2);
  bands(c,138,168,P.sea);
  for(let x=0;x<w;x++){const y=Math.round(167+Math.sin(x*.04)*2.5+Math.sin(x*.14));R(c,x,y,1,h-y,P.sand);R(c,x,y,1,1,P.foam);if((x*7+y)%9===0)R(c,x,y+5+(x%22),1,1,P.sand2)}
  for(let y=176;y<h;y+=2)for(let x=(y%5);x<w;x+=6)if(h2(x,y,9)<.35)R(c,x,y,1,1,P.sand2)}
const MOOD={
  dawn:{sky:['#1a2050','#2c3680','#4a50a8','#8a5ca4','#c86e98','#f29078','#ffcc92'],sun:null,far:'#5058a0',farRim:'#8a96cc',far2:'#3e4688',volc:['#6870b8','#4a5294','#f4f8ff'],hill:'#2c5a34',hillRim:'#4a8a4a',tree:'#163a1e',hill2:'#1f4628',sea:['#4a8ad4','#3a70c0','#2858a8','#1e4a96'],sand:'#ecd498',foam:'#ffffff',sand2:'#d0b070'},
  grey:{sky:['#30303c','#3a3a48','#464656','#525264','#5e5e70','#6a6a7c','#76768a'],far:'#5a5a6c',farRim:'#7a7a8c',far2:'#4a4a5a',volc:['#6a6a7c','#4a4a5c','#a8a8b4'],hill:'#3e4840',hillRim:'#56605a',tree:'#2a302c',hill2:'#363e3a',sea:['#56667e','#4a5a72','#3e4e66','#34445a'],sand:'#8a846e',foam:'#c8c8c8',sand2:'#6e6a5a'},
  dusk:{sky:['#140e30','#2a1648','#4a2058','#7a2c60','#b44a5c','#e8744e','#ffae58'],sun:null,far:'#3e2c66',farRim:'#7a5c9a',far2:'#2e2050',volc:['#4e3a7a','#382a5e','#e8d8f0'],hill:'#1e3424',hillRim:'#3a5a3a',tree:'#0e2014',hill2:'#14281a',sea:['#7a4a8a','#5a3a7a','#3e2a66','#2c1e52'],sand:'#c8a070',foam:'#ffe0c0',sand2:'#a07a50'},
  gold:{sky:['#2a3a78','#3c5a9e','#5a86c0','#8ab0d4','#d8c8a8','#f8d890','#ffe8b0'],sun:null,far:'#5a6eac',farRim:'#a8b8e0',far2:'#4a5a98',volc:['#7a88c4','#5a68a8','#ffffff'],hill:'#3a7040',hillRim:'#68a85a',tree:'#1e4a26',hill2:'#2a5a30',sea:['#5aa0e4','#4a88d4','#3a70c0','#2c5aa8'],sand:'#f4dca0',foam:'#ffffff',sand2:'#d8bc80'}};
MOOD.dusk.stars=1;
/* painted backdrops (tools/cut_paint.py) when they have loaded; the flat layers stay as the fallback */
function paintedLayer(pk){const im=PBGI[pk];return caLayer('p_'+pk,LW,LH,(c,w)=>c.drawImage(im,Math.round((w-im.naturalWidth)/2),0))}
function landLayer(mood){if(typeof paintedBG==='function'&&paintedBG('cut_'+mood))return paintedLayer('cut_'+mood);return caLayer('land_'+mood,LW,LH,(c,w,h)=>{const P=Object.assign({},MOOD[mood]);if(mood==='dawn')P.sun=[w-60,128];if(mood==='gold')P.sun=[w-70,118];if(mood==='dusk')P.sun=[w-50,132];caLand(c,w,h,P)})}
function caRukas(c,list,t,smoke){for(const [x,y,s] of list){const rk=rukaCanvas(3,2);const W2=rk.cvs.width*s,H2=rk.cvs.height*s;ell(c,x+W2/2,y+H2-2,W2*.45,4,'rgba(0,0,0,.28)');c.drawImage(rk.cvs,x,y,W2,H2);
  if(smoke)for(let k=0;k<6;k++){const a=((t+k*22+x)%150)/150;ell(c,x+(rk.smoke[0]+rk.ox)*s+Math.sin(a*6+k)*3,y+(rk.smoke[1]+rk.oy)*s-a*40,2+a*6,2+a*5,'rgba(215,215,225,'+(.45-a*.42)+')')}}}
function caFire(c,x,y,t,s){s=s||1;
  for(const [r,a] of [[46,.06],[30,.09],[18,.14]])ell(c,x,y-6*s,r*s,r*.55*s,'rgba(255,180,80,'+(a*(.85+.15*Math.sin(t/7)))+')');
  // logs and stones
  for(let k=0;k<5;k++){const a=k/5*6.283;ell(c,x+Math.cos(a)*9*s,y+1+Math.sin(a)*2*s,2.2*s,1.4*s,'#5a5660')}
  R(c,x-8*s,y-2*s,16*s,3*s,'#3a2010');R(c,x-7*s,y-2*s,14*s,1,'#7a4a24');R(c,x-3*s,y-4*s,6*s,3*s,'#4a2a14');
  // flame tongues: dark red outside, orange, yellow core
  for(let k=0;k<5;k++){const ph=t/5+k*1.7,hh=(9+3*Math.sin(ph)+2*Math.sin(ph*2.3))*s,fx=x+(k-2)*2.6*s+Math.sin(ph*.8)*s;
    ell(c,fx,y-2*s-hh*.45,2.6*s,hh*.55,'#c8341a');ell(c,fx,y-2*s-hh*.38,1.8*s,hh*.42,'#f88a26');ell(c,fx,y-2*s-hh*.28,1*s,hh*.26,'#ffe27a')}
  ell(c,x,y-3*s,4*s,2*s,'#fff2b8');
  for(let k=0;k<6;k++){const a=((t+k*23)%80)/80;R(c,x+Math.sin(a*9+k)*7*s,y-14*s-a*40,1,1,'rgba(255,200,120,'+(1-a)+')')}}
function caFog(c,t,a,dir){for(let k=0;k<9;k++){const x=((t*(.25+k%3*.12)*(dir||1)+k*97)%(LW+260))-130,y=60+((k*41)%130);for(const [r,al] of [[90,.10],[64,.12],[40,.14]])ell(c,x,y,r,r*.42,'rgba(214,214,226,'+(al*a)+')')}}
function cityLayer(kind){if(typeof paintedBG==='function'&&paintedBG('cutcity_'+kind))return paintedLayer('cutcity_'+kind);return caLayer('city_'+kind,LW,LH,(c,w,h)=>{
  const night=kind==='night';
  bands(c,0,180,night?['#05040f','#0a0a20','#120f30','#1a1640','#221c4e','#2c2458']:['#24204e','#4a3a78','#8a5a8a','#d07a7a','#f4a070','#ffd090','#fff0c0']);
  if(night)for(let k=0;k<70;k++)R(c,(k*97)%w,(k*37)%90,1,1,k%4?'#ffffff99':'#fff');
  // cordillera behind the city
  ridge(c,120,40,5.1,night?'#1c1a36':'#8a6a8e');ridge(c,128,26,2.3,night?'#15132c':'#6e5a80');
  if(!night)for(let x=0;x<w;x++){const y=Math.round(120-40*(.55+.3*Math.sin(x*.022+5.1)+.2*Math.sin(x*.062+10.2)+.12*Math.sin(x*.166+15.3)));if(y<96)R(c,x,y,1,Math.round((96-y)*.4)+2,'#f8e8e8')}
  // far towers
  for(let x=-4,i=0;x<w;i++){const bw=10+Math.floor(h2(i,1,61)*14),bh=50+Math.floor(h2(i,2,61)*60);R(c,x,180-bh,bw,bh,night?'#151330':'#6a5478');x+=bw+1}
  // near blocks with side faces and windows
  for(let x=-6,i=0;x<w;i++){const bw=16+Math.floor(h2(i,3,62)*18),bh=40+Math.floor(h2(i,4,62)*52),by=184-bh,fc=night?(i%2?'#221e40':'#2a2650'):(i%2?'#8a6a7a':'#a07a7c');
    R(c,x,by,bw,bh,fc);R(c,x+bw,by+2,4,bh-2,night?'#16142c':'#6a5060');R(c,x,by,bw,1,night?'#3a3660':'#d0a8a0');
    if(i%3===0){R(c,x+bw-6,by-6,5,6,night?'#1a1832':'#5a4658');R(c,x+3,by-9,1,9,night?'#1a1832':'#4a3a48');R(c,x+1,by-8,5,1,night?'#1a1832':'#4a3a48')}
    for(let wy=by+4;wy<180;wy+=6)for(let wx=x+2;wx<x+bw-3;wx+=4){const on=h2(wx,wy,3)<(night?.45:.2);R(c,wx,wy,2,3,on?(h2(wx,wy,4)<.5?'#ffe080':'#f0b860'):(night?'#121028':'#5a4a5a'))}
    x+=bw+5}
  // street, sidewalk, a low wall with a mural
  R(c,0,180,w,4,night?'#3a3656':'#b4a4a4');R(c,0,184,w,h-184,night?'#1c1a30':'#5a5060');
  for(let x=0;x<w;x+=18)R(c,x,203,9,1,night?'#6a6040':'#e8d070');
})}
function caLetterbox(c,t,max){if(window.FILM)return;const b=Math.min(12,Math.round(t/3)),bb=Math.min(38,Math.round(t/1.2));R(c,0,0,LW,b,'#000');R(c,0,LH-bb,LW,bb,'#000');R(c,0,LH-bb,LW,1,'rgba(226,194,122,.45)')}
let CUTSNAP=null,CUTKEY=null,CUTFADE=0;
function caXfade(c,key){ // cross-fade from the previous shot
  if(key!==CUTKEY){if(CUTKEY!==null){CUTSNAP=CUTSNAP||document.createElement('canvas');CUTSNAP.width=LW;CUTSNAP.height=LH;CUTSNAP.getContext('2d').drawImage(LO,0,0);CUTFADE=36}CUTKEY=key}}
function caXfadeDraw(c){if(CUTFADE>0&&CUTSNAP){c.globalAlpha=CUTFADE/36;c.drawImage(CUTSNAP,0,0);c.globalAlpha=1;CUTFADE--}}
function caWords(list,t,y0,spread,col,size){for(let k=0;k<list.length;k++){const a=((t/110+k/list.length)%1),x=LW*(.1+.8*((k*37)%list.length)/list.length)+Math.sin(a*5+k)*spread;
  OV.push(()=>txt(list[k],x,y0-a*y0*.85,'rgba('+col+','+((a<.15?a/.15:1-a)*.95).toFixed(2)+')',size||12,'center'))}}

function renderCut(){
  if(ECUT)return renderEndCut();
  if(!CUT)return;const t=++CUT.t,i=CUT.i,c=lx,ox=(LW-256)>>1;caXfade(c,'i'+i);
  if(i===0){ // the old Wallmapu: smoke over the rukas, people around a fire, the ngen faintly watching
    c.drawImage(landLayer('dawn'),0,0);
    for(let k=0;k<4;k++){const x=LW*.55+k*22-(frame*.015)%10;c.fillStyle='rgba(255,230,170,'+(.05+.02*Math.sin(frame/40+k))+')';c.beginPath();c.moveTo(x,0);c.lineTo(x+14,0);c.lineTo(x-40,LH);c.lineTo(x-58,LH);c.closePath();c.fill()}
    c.globalAlpha=.2+.06*Math.sin(frame/30);drawNgen(c,LW*.2,142,1.4,frame);drawNgen(c,LW*.84,112,1.1,frame+20,'pewen');c.globalAlpha=1;
    caRukas(c,[[LW*.08,150,1.1],[LW*.62,152,1]],frame,true);
    caFire(c,LW*.42,180,frame,1.2);
    const ppl=[['kuku','right',LW*.42-34],['lonko','right',LW*.42-20],['weaver','left',LW*.42+12],['child','left',LW*.42+24]];
    for(const [lk,d,x] of ppl){const s=ctCharSprite(lk,d,0,true);ell(c,x+9,181,7,2,'rgba(0,0,0,.3)');c.drawImage(s,x,182-s.height)}
    for(let k=0;k<3;k++){const bx=((frame*.22+k*90)%(LW+40))-20,by=36+k*12+Math.sin(frame/22+k)*3;condor(c,bx,by,Math.sin(frame/12+k))}
    caWords(['mari mari','lafken','mawida','ngen','kümey'],frame,120,6,'255,240,200',11)}
  else if(i===1){ // silence: the colour drains, people leave toward the city's glow, the fog rolls in
    const a=Math.min(1,t/260);c.drawImage(landLayer('dawn'),0,0);c.globalAlpha=a;c.drawImage(landLayer('grey'),0,0);c.globalAlpha=1;
    const gl=c.createRadialGradient(LW-10,150,4,LW-10,150,80);gl.addColorStop(0,'rgba(255,210,140,.35)');gl.addColorStop(1,'rgba(255,210,140,0)');c.fillStyle=gl;c.fillRect(LW-100,70,110,160);
    caRukas(c,[[LW*.08,150,1.1],[LW*.62,152,1]],frame,a<.5);
    for(let k=0;k<4;k++){const x=LW*.3+((t*.35+k*26)%(LW*.75)),s=ctCharSprite(['walker','cook','child','kona'][k],'right',Math.floor(frame/8+k)%4);c.globalAlpha=Math.max(0,1-(x-LW*.3)/(LW*.72));c.drawImage(s,x,183-s.height);c.globalAlpha=1}
    caFog(c,frame,.4+a*.6);
    if(t>120){c.globalAlpha=Math.min(.35,(t-120)/400);const ng=enemyCanvas('ngoyman1',100,Math.floor(frame/20)%2);c.drawImage(ng,LW*.15,40,ng.width*1.4,ng.height*1.4);c.globalAlpha=1}}
  else if(i===2){ // Santiago at night: you, on a balcony in the rain, with a few words of your kuku's
    c.drawImage(cityLayer('night'),0,0);if(!paintedBG('cutcity_night')){ell(c,LW*.82,35,11,11,'#f4f0d8');ell(c,LW*.82+4,32,9,9,'#0c0a24')}
    for(let k=0;k<3;k++){const x=((frame*1.2+k*170)%(LW+60))-30;R(c,x,196,10,3,'#f0e0a0');R(c,x+10,197,2,1,'#fff');R(c,x-2,197,2,1,'#e04040')}
    {const hs=cutChar(heroLook(),'up',0);ell(c,ox+128,178,hs.width*.5,3,'rgba(0,0,0,.35)');c.drawImage(hs,ox+128-hs.width/2,178-hs.height)}
    R(c,ox+60,160,136,3,'#4a4668');R(c,ox+60,160,136,1,'#6a6690');for(let k=0;k<17;k++)R(c,ox+62+k*8,163,1,17,'#3a3656');R(c,ox+60,180,136,2,'#4a4668');
    for(let k=0;k<70;k++){const rx=(k*53+frame*2.6)%(LW+30)-15,ry=(k*91+frame*5.2)%LH;R(c,rx,ry,1,7,'rgba(170,190,230,.33)');R(c,rx,ry+5,1,2,'rgba(210,225,250,.45)')}
    if(frame%300<4){c.fillStyle='rgba(205,215,255,.22)';c.fillRect(0,0,LW,LH)}
    for(let k=0;k<5;k++){const a=((frame/60+k*.2)%1);OV.push(()=>txt(['ü','ñ','ng','tr','ll'][k],ox+113+k*8+Math.sin(a*6+k)*4,60-a*40,'rgba(255,240,200,'+(1-a)*.85+')',16,'center'))}}
  else if(i===3){ // the ngen sleep; the wekufü wake
    if(paintedBG('deep')){c.drawImage(paintedLayer('deep'),0,0);c.fillStyle='rgba(6,20,48,.35)';c.fillRect(0,0,LW,LH)}else bands(c,0,LH,['#123a66','#0e3058','#0a2648','#081e3a','#06162c','#040c1c']);
    for(let k=0;k<Math.ceil(LW/50);k++){const x=18+k*54+Math.round(Math.sin(frame/50+k)*12);c.fillStyle='rgba(130,190,255,'+(0.06+0.04*Math.sin(frame/35+k*2))+')';c.beginPath();c.moveTo(x,0);c.lineTo(x+20,0);c.lineTo(x+60,LH);c.lineTo(x+20,LH);c.closePath();c.fill()}
    for(let k=0;k<40;k++){const y=LH-((frame*.3+k*31)%LH);ell(c,(k*67)%LW+Math.sin(frame/20+k)*2,y,1+(k%2),1+(k%2),'#8ac0f0')}
    const gl=Math.max(.15,.6+.25*Math.sin(frame/30)-Math.min(.35,t/400));c.globalAlpha=gl;drawNgen(c,LW/2,206,3.5,frame);c.globalAlpha=1;
    for(let k=0;k<5;k++){const a=((frame+k*40)%200)/200;OV.push(()=>txt('z',LW/2+18+k*3+a*10,90-a*40,'rgba(200,230,255,'+(1-a)*.7+')',12+a*6,'center'))}
    const wk=[['chonchon',.12,.24],['chonchon',.86,.2],['laftrache',.16,.78],['anchi',.84,.74],['kolokolo',.3,.5],['kutral',.7,.46]];
    wk.forEach(([tp,fx,fy],k)=>{if(t>k*24){const e=enemyCanvas(tp,52,Math.floor(frame/12)%2);c.globalAlpha=Math.min(.75,(t-k*24)/60);c.drawImage(e,LW*fx-e.width/2,LH*fy-e.height/2);c.globalAlpha=1}});
    for(let k=0;k<8;k++){const x=LW*((k*.13+.05)%1),y=40+(k*37)%150;if(t>k*20&&(frame+k*13)%90<75){R(c,x,y,3,2,'#ff3a2a');R(c,x+7,y,3,2,'#ff3a2a')}}}
  else{ // the kuku calls from the coast at dusk
    c.drawImage(landLayer('dusk'),0,0);
    for(let k=0;k<12;k++){const fx2=20+(k*37)%(LW-40)+Math.sin(frame/30+k*2)*8,fy2=120+(k*23)%80+Math.sin(frame/19+k)*5;if((frame+k*25)%80<55){R(c,fx2,fy2,1,1,'#ffe9a0');ell(c,fx2,fy2,2.5,2.5,'rgba(255,230,140,.18)')}}
    caRukas(c,[[LW*.6,112,1.6]],frame,true);caFire(c,LW*.5,180,frame,1.8);
    const ks=cutChar('kuku','down',0);ell(c,LW*.3+ks.width,182,ks.width*.7,4,'rgba(0,0,0,.3)');c.drawImage(ks,LW*.3,182-ks.height*2,ks.width*2,ks.height*2);
    OV.push(()=>txt('Küpange!',LW*.3+ks.width,44+Math.sin(frame/12)*2,'rgba(255,236,180,.9)',16,'center'))}
  cutFx(c,i===2||i===3);caXfadeDraw(c);caLetterbox(c,t);
}
function renderEndCut(){
  if(!ECUT)return;const t=++ECUT.t,i=ECUT.i,c=lx,ox=(LW-256)>>1;caXfade(c,'e'+i);
  if(i===0){ // the fog of forgetting tears apart; light and words return to every land
    const a=Math.min(1,t/220);c.drawImage(landLayer('grey'),0,0);c.globalAlpha=a;c.drawImage(landLayer('gold'),0,0);c.globalAlpha=1;
    caFog(c,frame*3,Math.max(0,1-a*1.1),t%2?1:-1);
    const gr=c.createLinearGradient(0,0,0,LH);gr.addColorStop(0,'rgba(255,214,130,'+(a*.2)+')');gr.addColorStop(1,'rgba(255,170,90,'+(a*.06)+')');c.fillStyle=gr;c.fillRect(0,0,LW,LH);
    for(let k=0;k<6;k++){const x=LW*(.15+k*.14);c.fillStyle='rgba(255,236,180,'+(a*.07)+')';c.beginPath();c.moveTo(x,0);c.lineTo(x+16,0);c.lineTo(x-30,LH);c.lineTo(x-50,LH);c.closePath();c.fill()}
    caWords(['mari mari','chaltu may','küpange','newen','kümey','pewkayal','mapu','lafken','mawida','pewen','kürüf','kimün'],frame,150,14,'255,244,200',11)}
  else if(i===1){ // the five ngen bow together
    c.drawImage(landLayer('gold'),0,0);const names=[undefined,'mawida','pewen','kuruf','lelfun'],epu=S&&S.flags.epu_won,sp=epu?.155:.19,x0=epu?.09:.12;
    if(epu){const x=LW*(x0+5*sp),ec=enemyCanvas('epunamun',ET.epunamun.bs,Math.floor(frame/20)%2),bow=Math.max(0,Math.sin((frame-50)/40))>.9?3:0;
      for(const [r,al] of [[30,.08],[20,.12]])ell(c,x,150,r,r*.4,'rgba(255,120,100,'+al+')');ell(c,x,167,ec.width*.35,3,'rgba(0,0,0,.25)');c.drawImage(ec,Math.round(x-ec.width/2),167-ec.height+bow)}
    for(let k=0;k<5;k++){const x=LW*(x0+k*sp),bow=Math.max(0,Math.sin((frame-k*10)/40))>.9?3:0,bob=Math.sin(frame/22+k)*2;
      for(const [r,al] of [[30,.08],[20,.12]])ell(c,x,150,r,r*.4,'rgba(255,240,190,'+al+')');drawNgen(c,x,166+bob+bow,1.8,frame+k*7,names[k])}
    for(let k=0;k<18;k++){const a2=((frame*.5+k*29)%160)/160;ell(c,20+(k*53)%(LW-30),160-a2*130,1.5,1.5,'rgba(255,240,180,'+(1-a2)+')')}
    for(let k=0;k<3;k++){const bx=((frame*.3+k*90)%(LW+40))-20,by=30+k*12;condor(c,bx,by,Math.sin(frame/12+k))}}
  else if(i===2){ // Santiago at dawn: the words arrive like warm rain
    c.drawImage(cityLayer('dawn'),0,0);if(!paintedBG('cutcity_dawn')){for(const [r,a] of [[60,.08],[36,.14],[20,.22]])ell(c,LW*.78,92,r,r,'rgba(255,220,150,'+a+')');ell(c,LW*.78,92,12,12,'#fff0c0')}
    // the mural on the street wall
    const mx=Math.round(LW*.12),mw=Math.round(LW*.36);R(c,mx,166,mw,14,'#e8dcc0');R(c,mx,166,mw,1,'#fff6e0');
    const cols=['#3870b8','#38a058','#e0a030','#c84848'];for(let k=0;k<4;k++)R(c,mx+4+k*(mw-8)/4,169,(mw-8)/4-3,8,cols[k]);
    OV.push(()=>txt('MAPU',mx+mw/2,175,'#ffffff',12,'center'));
    const ppl=[['walker','left',.62],['childf','left',.68],['cook','right',.5],['kona','right',.9]];
    for(const [lk,d,fx] of ppl){const s=ctCharSprite(lk,d,Math.floor(frame/9)%4);c.drawImage(s,LW*fx,183-s.height)}
    caWords(['mari mari','chaltu','küpange','newen','kümey','pewkayal','mapu','che'],frame,180,8,'255,240,190',12)}
  else{ // home, by the fire, with the kuku
    c.drawImage(landLayer('dusk'),0,0);
    const fade=Math.min(1,t/400);c.fillStyle='rgba(8,6,24,'+(fade*.35)+')';c.fillRect(0,0,LW,LH);
    for(let k=0;k<50;k++)if((frame+k*11)%70<60)R(c,(k*97)%LW,(k*37)%80,1,1,'rgba(255,255,255,'+(fade*.9)+')');
    caRukas(c,[[LW*.70,104,1.6]],frame,true);caFire(c,LW*.47,180,frame,2);
    const hs=cutChar(heroLook(),'right',0),ks=cutChar('kuku','left',0),hx2=Math.round(LW*.47-28-hs.width*2),kx2=Math.round(LW*.47+28);
    ell(c,hx2+hs.width,182,hs.width*.7,4,'rgba(0,0,0,.3)');c.drawImage(hs,hx2,182-hs.height*2,hs.width*2,hs.height*2);
    ell(c,kx2+ks.width,182,ks.width*.7,4,'rgba(0,0,0,.3)');c.drawImage(ks,kx2,182-ks.height*2,ks.width*2,ks.height*2);
    for(let k=0;k<9;k++){const a2=((frame+k*18)%130)/130;ell(c,LW*.47+Math.sin(a2*7+k)*10,168-a2*110,1.5,1.5,'rgba(255,230,150,'+(1-a2)*.8+')')}
    if(t>60){const al=Math.min(1,(t-60)/120);OV.push(()=>{txt('Kewün Newen',LW/2,34,'rgba(255,233,176,'+al+')',22,'center');txt('AFPUY',LW/2,52,'rgba(232,236,248,'+(al*.8)+')',13,'center')})}}
  cutFx(c,false);caXfadeDraw(c);caLetterbox(c,t);
}

/* vignette sized to the real screen width (the old one assumed 256) */
let VIGNW=0;
function cutFx(c,dark){
  if(!VIGNC||VIGNW!==LW){VIGNW=LW;VIGNC=document.createElement('canvas');VIGNC.width=LW;VIGNC.height=LH;const v=VIGNC.getContext('2d'),id=v.createImageData(LW,LH),d=id.data;
    for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){const i=(y*LW+x)*4,dx=(x-LW/2)/(LW/2),dy=(y-104)/112,q=dx*dx+dy*dy*.8;let a=q>.5?Math.min(120,(q-.5)*170):0;const n=h2(x,y,77);if(n<.05)a+=10;else if(n>.96)a-=8;d[i]=0;d[i+1]=0;d[i+2]=8;d[i+3]=Math.max(0,a)}
    v.putImageData(id,0,0)}
  c.globalAlpha=dark?1:.8;c.drawImage(VIGNC,0,0);c.globalAlpha=1}

/* ---------- Lan kewün vignette (drawn over the battle): one lof, either losing its language or sending its newen.
   Each lof has its own land (the region's battle backdrop), graded grey and fogged or warm and glowing. ---------- */
const LAN_LAND={lof:{area:'coast',pe:'lafkenche',an:null},n_lof:{area:'field',pe:'nagche',an:'kawellu'},p_lof:{area:'mount',pe:'pewenche',an:null},
  w_lof:{area:'rainforest',pe:'williche',an:null},e_lof:{area:'pampa',pe:'puelche',an:'luan'}};
const LANC={};
function lanBG(id,good){const k=id+good;if(LANC[k])return LANC[k];const src=buildBG(LAN_LAND[id].area),[cv,c]=mk(src.width,src.height);c.drawImage(src,0,0);
  const d=c.getImageData(0,0,cv.width,cv.height),a=d.data;
  for(let p=0;p<a.length;p+=4){const r=a[p],g=a[p+1],b=a[p+2],l=.3*r+.59*g+.11*b;
    if(good){a[p]=Math.min(255,r*1.03+8);a[p+1]=Math.min(255,g*1.0+4);a[p+2]=Math.max(0,b*.92)}
    else{const m=.85;a[p]=(r*(1-m)+l*m)*.62+8;a[p+1]=(g*(1-m)+l*m)*.64+10;a[p+2]=(b*(1-m)+l*m)*.70+18}}
  c.putImageData(d,0,0);return LANC[k]=cv}
function lanGrey(cvs){const k='g'+(cvs.__id||(cvs.__id=Math.random()));if(LANC[k])return LANC[k];const [cv,c]=mk(cvs.width,cvs.height);c.drawImage(cvs,0,0);
  const d=c.getImageData(0,0,cv.width,cv.height),a=d.data;for(let p=0;p<a.length;p+=4){const l=.3*a[p]+.59*a[p+1]+.11*a[p+2];a[p]=l*.78+12;a[p+1]=l*.8+14;a[p+2]=l*.88+22}
  c.putImageData(d,0,0);return LANC[k]=cv}
function lanName(L,en){const pe=LAN_LAND[L.lof[0]].pe;return en?'the '+pe[0].toUpperCase()+pe.slice(1)+' lof':'el lof de los '+pe}
/* the lof people in the lan kewün scenes use the same painted, battle-size bodies as the battle screen */
const LANBIG={};
function lanBig(lk,d,fr){fr=fr||0;const k=lk+d+fr;if(LANBIG[k])return LANBIG[k];
  if(typeof SPR2!=='undefined'&&SPR2['hero_'+lk]){const t=tplCanvas('hero_'+lk,fr%SPR2['hero_'+lk].f.length,1);return LANBIG[k]=d==='left'?t:mirror(t)}
  return LANBIG[k]=ctCharSpriteBig(lk,d,0)}
function drawLanScene(c,L){
  const t=++L.t,good=L.good,a=Math.min(1,t/24),en=S.gloss==='en',LD=LAN_LAND[L.lof[0]];
  c.save();c.globalAlpha=a;
  c.drawImage(lanBG(L.lof[0],good),0,0);
  if(good){c.save();c.globalAlpha=a*.85;animBG(LD.area);c.restore()}
  // god rays when the lof wakes, a low sky of fog when it forgets
  c.save();
  if(good){c.globalCompositeOperation='lighter';for(let k=0;k<5;k++){const bx=LW*(.12+k*.2)+Math.sin(frame/90+k)*10,w=16+(k%3)*10,al=.045+.025*Math.sin(frame/40+k);
      const g=c.createLinearGradient(0,0,0,LH*.8);g.addColorStop(0,'rgba(255,236,170,'+al*2+')');g.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=g;
      c.beginPath();c.moveTo(bx,0);c.lineTo(bx+w,0);c.lineTo(bx+w+40,LH*.8);c.lineTo(bx+30-w*.3,LH*.8);c.closePath();c.fill()}}
  else{const g=c.createLinearGradient(0,0,0,LH*.55);g.addColorStop(0,'rgba(60,64,84,.55)');g.addColorStop(1,'rgba(60,64,84,0)');c.fillStyle=g;c.fillRect(0,0,LW,LH*.55)}
  c.restore();
  caRukas(c,[[LW*.04,92,1.2],[LW*.70,96,1.1]],frame,!!good);
  if(!good){c.save();c.globalAlpha=a*.55;caRukas(c,[[LW*.04,92,1.2],[LW*.70,96,1.1]],frame,false);c.restore();caFog(c,frame*2,.38)}
  if(LD.an){const ac=animalCanvas(LD.an,good?Math.floor(frame/14)%2:0,'right'),ag=good?ac:lanGrey(ac),ax=LW*.82,ay=146;ell(c,ax+ac.width,ay,ac.width*.7,3,'rgba(0,0,0,.25)');c.drawImage(ag,ax,ay-ac.height*2,ac.width*2,ac.height*2)}
  caFire(c,LW*.5,138,frame,good?1.5:.45);
  if(!good){for(let k=0;k<3;k++)ell(c,LW*.5+Math.sin(frame/20+k)*3,128-k*7-(frame/3+k*9)%14,2+k,2+k,'rgba(150,150,160,.35)')}
  // the people of the lof around the fire
  const ppl=[['lof_kuku','right',-114],['lof_lonko','right',-80],['lof_weaver','right',-46],['lof_wentru','left',44],['lof_cook','left',78],['lof_ulcha','left',112]];
  for(let k=0;k<ppl.length;k++){const [lk,d,dx]=ppl[k];let x;
    // when the lof wakes they cheer: fists raised and pumped in the air, each to their own beat
    const pump=good?(L.t<30?0:1+(Math.floor((frame+k*5)/(7+k%3))%2)):0;
    let s=lanBig(lk,d,pump);if(!good)s=lanGrey(s);
    const sw=s.width,shh=s.height,x2=Math.round(LW*.5+dx-sw/2);x=x2;
    const by=144+(good?0:(k%2)),shake=!good&&(frame+k*13)%50<6?((frame%2)?1:-1):0;
    if(good){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x+16,by-22,3,x+16,by-22,40);g.addColorStop(0,'rgba(255,226,130,'+(.42+.12*Math.sin(frame/8+k))+')');g.addColorStop(1,'rgba(255,200,90,0)');c.fillStyle=g;c.fillRect(x-26,by-64,84,74);c.restore()}
    ell(c,x+sw/2,by-1,12,3,'rgba(0,0,0,.3)');c.drawImage(s,x+shake,by-shh,sw,shh);
    if(good){ // rim of light on each body
      c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.16+.08*Math.sin(frame/7+k);c.drawImage(s,x-1,by-shh-1,sw,shh);c.restore();
      if((frame+k*17)%40<20)R(c,x+sw/2+Math.round(Math.sin(frame/6+k)*8),by-shh-4-((frame/2+k*5)%14),1,1,'#fff6c8')}
    else{
      if(k%2===0&&(frame+k*20)%80<60){const qx=x+sw/2,qy=by-shh-6+Math.round(Math.sin(frame/10+k));OV.push(()=>txt('?',qx,qy,'rgba(235,235,245,.95)',16,'center'))}
      else if((frame+k*30)%90<50)R(c,x+sw/2-5,by-shh+16+((frame/4+k)%8),1,3,'#a8d8ff')}}
  if(good){ // words and light rising from the lof toward the hero
    caWords(['mari mari','newen','kümey','mapudungun','chaltu may','kimün'],frame,110,7,'255,240,180',12);
    c.save();c.globalCompositeOperation='lighter';
    for(let k=0;k<30;k++){const p=((frame*1.4+k*29)%160)/160;R(c,Math.round(LW*.5+Math.sin(k*1.3+p*5)*90*(1-p)+p*LW*.42),Math.round(136-p*124),k%3?2:1,k%3?2:1,'rgba(255,236,160,'+(1-p).toFixed(2)+')')}
    const g2=c.createRadialGradient(LW*.5,130,10,LW*.5,130,LW*.7);g2.addColorStop(0,'rgba(255,220,140,.18)');g2.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=g2;c.fillRect(0,0,LW,LH);c.restore()}
  else{ // Mapudungun words crumbling and falling into the fog, ash in the air
    const W=['mari mari','chumleymi','kümelen','chaltu may','pewkayal','newen','ruka','lafken','mapu'];
    for(let k=0;k<W.length;k++){const p=((frame*.6+k*37)%180)/180,x=LW*(.1+.8*((k*41)%W.length)/W.length)+Math.sin(p*9+k)*3,y=24+p*90;
      const cut=Math.floor(W[k].length*Math.max(0,p-.35)/.65),w=W[k].slice(0,W[k].length-cut);   // the words lose their letters as they fall
      if(w)OV.push(()=>txt(w,x,y,'rgba(220,224,236,'+(Math.max(0,.85-p)).toFixed(2)+')',11,'center'))}
    for(let k=0;k<26;k++){const x=((k*53+frame*.3)%LW),y=((k*37+frame*.5)%(LH*.7));R(c,Math.round(x),Math.round(y),1,1,'rgba(200,204,214,.45)')}}
  // vignette and letterbox
  const v=c.createRadialGradient(LW/2,LH*.45,LH*.3,LW/2,LH*.45,LW*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,good?'rgba(40,20,0,.35)':'rgba(0,0,12,.6)');c.fillStyle=v;c.fillRect(0,0,LW,LH);
  c.globalAlpha=1;R(c,0,0,LW,15,'rgba(0,0,0,.82)');R(c,0,15,LW,1,good?'rgba(255,220,130,.6)':'rgba(170,176,196,.4)');
  const ttl=(en?(good?'Newen · ':'Lan kewün · '):(good?'Newen · ':'Lan kewün · '))+lanName(L,en);
  OV.push(()=>txt(ttl,LW/2,11,good?'#ffe890':'#c8ccd8',12,'center'));
  c.restore();
}
/* the title screen: the painted Lafkenche dusk (volcano, lake, beach) with a little life in it */
function titleLand(c,F){
  if(!(typeof paintedBG==='function'&&paintedBG('cut_dusk')))return paintLand(c,F,false);
  const im=PBGI.cut_dusk,ox=Math.round(Math.max(LW-400,Math.min(0,LW/2-255)));c.drawImage(im,ox,0);   // the volcano in the middle of the screen
  c.save();c.globalCompositeOperation='screen';c.fillStyle='rgba(70,52,70,.22)';c.fillRect(0,0,LW,LH);c.restore();   // a little more light
  for(let k=0;k<22;k++)if((F+k*23)%70<9)R(c,(k*89+13)%LW,(k*37)%44+2,1,1,'#fff8e8');                 // stars blinking
  for(let k=0;k<9;k++){const a=((F*.5+k*26)%230)/230,x=255+ox+a*34+Math.sin(a*5+k)*3,y=44-a*44;          // the volcano breathes a thin plume
    ell(c,x,y,2+a*7,1.5+a*4,'rgba(150,120,150,'+(.38-a*.34)+')')}
  for(let k=0;k<26;k++){const y=141+((k*5)%22),x=((k*67+Math.floor(F*.3))%LW);if((F+k*11)%48<10)R(c,x,y,2+(k%3),1,k%2?'#ffd0a0':'#c8b0e8')}   // light on the water
  for(let x=0;x<LW;x+=2){const y=165+Math.round(Math.sin(x/11+F/26)*1.3);R(c,x,y,2,1,(x>>1)%3?'rgba(240,220,230,.7)':'rgba(200,180,210,.6)')}  // the lake lapping the sand
  for(let i=0;i<2;i++){const bx=Math.round((F*.22+i*190)%(LW+30)-15),by=Math.round(70+i*13+Math.sin(F/21+i)*3),f=Math.sin(F/6+i)>0?1:0;
    R(c,bx-1,by,3,1,'#1a1428');R(c,bx-4,by-f,3,1,'#1a1428');R(c,bx+2,by-f,3,1,'#1a1428')}
}
