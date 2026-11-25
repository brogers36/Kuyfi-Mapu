/* ============================================================
   RENDER (everything drawn at 256x224 into LO, then blitted at 2x; text drawn crisp on top)
   ============================================================ */
let OV=[];
function bands(c,y0,y1,cols){const n=cols.length,h=(y1-y0)/n;
  for(let i=0;i<n;i++){const ya=Math.round(y0+i*h),yb=Math.round(y0+(i+1)*h);R(c,0,ya,LW,yb-ya,cols[i]);
    if(i<n-1){c.fillStyle=cols[i+1];for(let x=0;x<LW;x+=2)c.fillRect(x+((yb>>0)%2),yb-2,1,1);c.fillStyle=cols[i];for(let x=1;x<LW;x+=2)c.fillRect(x,yb,1,1)}}}
function ridge(c,y0,amp,seed,fill,rim){const pts=[];for(let x=0;x<=LW;x+=2)pts.push([x,Math.round(y0-amp*(.55+.3*Math.sin(x*.022+seed)+.2*Math.sin(x*.062+seed*2)+.12*Math.sin(x*.166+seed*3)))]);
  c.fillStyle=fill;c.beginPath();c.moveTo(0,LH);for(const [x,y] of pts)c.lineTo(x,y);c.lineTo(LW,LH);c.closePath();c.fill();if(rim)for(const [x,y] of pts)R(c,x,y,2,1,rim)}
function araucaria(c,x,y,h,col){R(c,x,y-h,1,h,col);for(let k=0;k<4;k++){const w=Math.round(h*.4*(1-k*.15)),yy=y-h+k*3;R(c,x-w,yy+1,w*2+1,1,col);R(c,x-w,yy+2,1,1,col);R(c,x+w,yy+2,1,1,col)}}
function condor(c,x,y,fl){c.fillStyle='#16101a';const f=fl>0?-1:1;R(c,x-1,y,3,1,'#16101a');for(let i=1;i<7;i++)R(c,x-1-i,y+(i>3?f:0),1,1,'#16101a');for(let i=1;i<7;i++)R(c,x+1+i,y+(i>3?f:0),1,1,'#16101a');R(c,x,y,1,1,'#f0f0f0')}
function paintLand(c,t,dim){
  bands(c,0,140,dim?['#3a3a4a','#46465a','#55556a','#646478','#727286','#808094']:['#18204a','#283078','#4048a0','#7a58a0','#c06c98','#f09078','#ffc890']);
  if(!dim){for(let k=0;k<26;k++)if((t+k*7)%50<40)R(c,(k*97)%LW,(k*53)%40,1,1,'#fff');ell(c,LW-60,128,13,13,'#ffd8a0');ell(c,LW-60,128,10,10,'#fff0c0')}
  ridge(c,98,46,1.3,dim?'#5a5a6c':'#5058a0',dim?'#7a7a8c':'#8a96cc');
  c.fillStyle=dim?'#6a6a7c':'#6870b8';c.beginPath();c.moveTo(116,136);c.lineTo(165,48);c.lineTo(176,48);c.lineTo(226,136);c.closePath();c.fill();
  c.fillStyle=dim?'#4a4a5c':'#4a5294';c.beginPath();c.moveTo(170,48);c.lineTo(176,48);c.lineTo(226,136);c.lineTo(185,136);c.closePath();c.fill();
  c.fillStyle=dim?'#a8a8b4':'#f4f8ff';c.beginPath();c.moveTo(163,52);c.lineTo(178,52);c.lineTo(184,62);c.lineTo(179,59);c.lineTo(175,64);c.lineTo(171,59);c.lineTo(167,63);c.lineTo(164,58);c.lineTo(158,62);c.closePath();c.fill();
  for(let k=0;k<5;k++){const p=((t*.3+k*36)%180)/180;ell(c,171+p*16+Math.sin(p*5+k)*3,46-p*30,3+p*7,2+p*5,dim?'#9a9aa8':'#d8d8e4')}
  ridge(c,128,16,4.2,dim?'#3e4840':'#2c5a34',dim?'#56605a':'#4a8a4a');
  for(let i=0;i<13;i++)araucaria(c,10+i*20+(i%2)*5,134+(i%3)*2,14+(i*7)%7,dim?'#2a302c':'#163a1e');
  ridge(c,138,8,7.1,dim?'#363e3a':'#1f4628');
  bands(c,138,168,dim?['#56667e','#4a5a72','#3e4e66']:['#4a8ad4','#3a70c0','#2858a8','#1e4a96']);
  for(let k=0;k<26;k++){const x=(k*53+Math.floor(t*.3))%LW,y=140+(k*17)%26;R(c,x,y,4+(k%3)*3,1,dim?'#8a9ab0':'#a8d0f8')}
  for(let x=0;x<LW;x++){const y=Math.round(167+Math.sin(x*.04+t/50)*2.5+Math.sin(x*.14));R(c,x,y,1,LH-y,dim?'#8a846e':'#ecd498');R(c,x,y,1,1,dim?'#c8c8c8':'#ffffff');if((x+y)%7===0)R(c,x,y+6+(x%20),1,1,dim?'#6e6a5a':'#d0b070')}
  if(!dim)for(let i=0;i<3;i++){const bx=Math.round((t*.25+i*85)%(LW+40)-20),by=Math.round(30+i*11+Math.sin(t/25+i)*3);condor(c,bx,by,Math.sin(t/12+i))}
}
let VIGNC=null;
let DARKC=null;
function darkMask(){
  // cave darkness dither, prerendered once (player at the center) and blitted per frame
  if(DARKC&&DARKC.width===LW*2&&DARKC.height===LH*2)return DARKC;
  DARKC=document.createElement('canvas');DARKC.width=LW*2;DARKC.height=LH*2;
  const d=DARKC.getContext('2d'),mx=LW,my=LH;
  for(let y=0;y<DARKC.height;y+=2)for(let x=0;x<DARKC.width;x+=2){
    const dist=Math.hypot(x-mx,y-my);
    if(dist>70){const a=Math.min(.7,(dist-70)/140);if(a>.05){d.fillStyle='rgba(0,0,0,'+a.toFixed(2)+')';d.fillRect(x,y,2,2)}}
  }
  return DARKC;
}
function cutFx(c,dark){
  if(!VIGNC){VIGNC=document.createElement('canvas');VIGNC.width=LW;VIGNC.height=LH;const v=VIGNC.getContext('2d');
    const id=v.createImageData(LW,LH),d=id.data;
    for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){const i=(y*LW+x)*4;
      const dx=(x-128)/128,dy=(y-104)/112,q=dx*dx+dy*dy*.8;
      let a=q>.5?Math.min(120,(q-.5)*170):0;
      const n=h2(x,y,77);if(n<.05)a+=10;else if(n>.96)a-=8;
      d[i]=0;d[i+1]=0;d[i+2]=8;d[i+3]=Math.max(0,a)}
    v.putImageData(id,0,0)}
  c.globalAlpha=dark?1:.8;c.drawImage(VIGNC,0,0);c.globalAlpha=1;
}
function renderEndCut(){
  if(!ECUT)return;const t=++ECUT.t,i=ECUT.i,c=lx;
  if(i===0){paintLand(c,frame,true);
    const a=Math.min(1,t/200);
    c.fillStyle='rgba(190,190,205,'+Math.max(0,.3-a*.3)+')';c.fillRect(0,0,LW,LH);
    for(let k=0;k<14;k++){const x=(k*47+Math.sin(k*3)*20)%LW,y=LH-((t*.8+k*37)%(LH+40));R(c,x,y,1,9,'rgba(230,236,248,'+(.5-y/LH*.3)+')');R(c,x,y+7,1,2,'#ffffff')}
    const gr=c.createLinearGradient(0,0,0,LH);gr.addColorStop(0,'rgba(255,214,130,'+(a*.18)+')');gr.addColorStop(1,'rgba(255,170,90,'+(a*.06)+')');c.fillStyle=gr;c.fillRect(0,0,LW,LH)}
  else if(i===1){paintLand(c,frame,false);
    const names=[undefined,'mawida','pewen','kuruf','lelfun'];
    for(let k=0;k<5;k++){const x=28+k*50,bob=Math.sin(frame/22+k)*3;drawNgen(c,x,160+bob,1.6,frame+k*7,names[k])}
    for(let k=0;k<10;k++){const a2=((frame*.5+k*29)%160)/160;ell(c,20+(k*53)%(LW-30),150-a2*120,1.5,1.5,'rgba(255,240,180,'+(1-a2)+')')}
    for(let k=0;k<3;k++){const bx=((frame*.3+k*90)%(LW+40))-20,by=30+k*12,w2=Math.sin(frame/6+k)>0?2:3;R(c,bx-w2,by,w2,1,'#2a2030');R(c,bx+1,by,w2,1,'#2a2030')}}
  else if(i===2){bands(c,0,170,['#1a1030','#241a44','#2e2254','#3a2c64','#463672']);
    for(let k=0;k<40;k++)if((frame+k*11)%60<50)R(c,(k*97)%LW,(k*37)%90,1,1,'#fff');
    ell(c,210,32,11,11,'#f8f4e0');
    for(let k=0;k<16;k++){const bw=13+(k*13)%15,bx=k*17-5,bh=50+((k*53)%70),by=180-bh;R(c,bx,by,bw,bh+50,k%2?'#241e3e':'#2e2850');R(c,bx+bw-2,by,2,bh+50,'#1a1430');
      for(let wy=by+4;wy<175;wy+=6)for(let wx=bx+2;wx<bx+bw-3;wx+=4)if(h2(wx,wy,3)<.6)R(c,wx,wy,2,3,h2(wx,wy,4)<.5?'#ffe080':'#f0b860')}
    R(c,0,180,LW,44,'#2a2444');
    for(let k=0;k<7;k++){const a2=((frame/90+k*.14)%1);const sx2=20+k*34+Math.sin(a2*4+k)*6;OV.push(()=>txt(['mari mari','chaltu','küpange','newen','kümey','pewkayal','mapu'][k],sx2,20+a2*150,'rgba(255,240,190,'+(1-a2)*.9+')',12,'center'))}}
  else{paintLand(c,frame,false);
    const gr2=c.createLinearGradient(0,0,0,LH);gr2.addColorStop(0,'rgba(255,170,90,.18)');gr2.addColorStop(1,'rgba(90,40,70,.2)');c.fillStyle=gr2;c.fillRect(0,0,LW,LH);
    const rk=rukaCanvas(3,2),rox=(LW-256)>>1;ell(c,195+rox,175,40,5,'rgba(0,0,0,.3)');c.drawImage(rk.cvs,150+rox,120,rk.cvs.width*1.7,rk.cvs.height*1.7);
    {const hs=ctCharSprite(heroLook(),'down',0);c.drawImage(hs,84,96,54,96)}
    {const ks=ctCharSprite('kuku','down',0);c.drawImage(ks,130,100,50,90)}
    for(let k=0;k<9;k++){const a2=((frame+k*18)%130)/130;ell(c,40+(k*31)%180,190-a2*90,1.5,1.5,'rgba(255,230,150,'+(1-a2)*.8+')')}
    const gl=.5+.3*Math.sin(frame/18);for(const [rr,al] of [[26,.10],[18,.16],[10,.22]])ell(c,110,170,rr,rr*.4,'rgba(255,226,130,'+(al*gl)+')')}
  cutFx(c,false);
}
function renderCut(){
  if(ECUT)return renderEndCut();
  if(!CUT)return;const t=++CUT.t,i=CUT.i,c=lx;
  if(i===0){paintLand(c,frame,false);
    const gr=c.createLinearGradient(0,0,0,LH);gr.addColorStop(0,'rgba(255,190,110,.16)');gr.addColorStop(.5,'rgba(255,160,90,.05)');gr.addColorStop(1,'rgba(40,20,60,.18)');c.fillStyle=gr;c.fillRect(0,0,LW,LH);
    for(let k=0;k<4;k++){const x=180+k*22-frame*.015%10;c.fillStyle='rgba(255,230,170,'+(.05+.02*Math.sin(frame/40+k))+')';c.beginPath();c.moveTo(x,0);c.lineTo(x+14,0);c.lineTo(x-40,LH);c.lineTo(x-58,LH);c.closePath();c.fill()}
    for(let k=0;k<3;k++){const bx=((frame*.22+k*90)%(LW+40))-20,by=36+k*12+Math.sin(frame/22+k)*3,w2=Math.sin(frame/6+k)>0?2:3;R(c,bx-w2,by,w2,1,'#2a2030');R(c,bx+1,by,w2,1,'#2a2030')}}
  else if(i===1){paintLand(c,frame,true);const a=Math.min(1,t/240);
    for(let k=0;k<6;k++){const x=LW-((t*.55+k*45)%(LW+150))+75,y=40+k*26;for(const [r,al] of [[60,.12],[42,.14],[26,.16]])ell(c,x,y,r,r*.55,'rgba(215,215,228,'+(al*a+.05)+')')}
    c.fillStyle='rgba(190,190,205,'+(a*.28)+')';c.fillRect(0,0,LW,LH)}
  else if(i===2){bands(c,0,170,['#060414','#0c0a24','#141034','#1c1644','#261e54']);
    for(let k=0;k<50;k++)if((frame+k*11)%60<48)R(c,(k*97)%LW,(k*37)%100,1,1,'#fff');
    ell(c,210,35,11,11,'#f4f0d8');ell(c,214,32,9,9,'#0c0a24');
    for(let k=0;k<16;k++){const bw=13+(k*13)%15,bx=k*17-5,bh=50+((k*53)%70),by=180-bh;R(c,bx,by,bw,bh+50,k%2?'#1c1a32':'#242240');R(c,bx+bw-2,by,2,bh+50,'#16142a');if(k%3===0)R(c,bx+bw/2,by-7,1,7,'#242240');
      for(let wy=by+4;wy<175;wy+=6)for(let wx=bx+2;wx<bx+bw-3;wx+=4)if(h2(wx,wy,3)<.42)R(c,wx,wy,2,3,h2(wx,wy,4)<.5?'#f8d870':'#c8a850')}
    R(c,0,180,LW,44,'#22203a');R(c,60,160,136,3,'#4a4668');for(let k=0;k<17;k++)R(c,62+k*8,163,1,17,'#3a3656');R(c,60,180,136,2,'#4a4668');
    {const hs=ctCharSprite(heroLook(),'up',0);c.drawImage(hs,101,66,54,96)}
    for(let k=0;k<44;k++){const rx=(k*53+frame*2.6)%(LW+30)-15,ry=(k*91+frame*5.2)%LH;R(c,rx,ry,1,7,'rgba(170,190,230,.33)');R(c,rx,ry+5,1,2,'rgba(210,225,250,.45)')}
    if(frame%300<4)c.fillStyle='rgba(205,215,255,.22)',c.fillRect(0,0,LW,LH);
    for(let k=0;k<5;k++){const a=((frame/60+k*.2)%1);OV.push(()=>txt(['ü','ñ','ng','tr','ll'][k],113+k*8+Math.sin(a*6+k)*4,86-a*45,'rgba(255,240,200,'+(1-a)*.85+')',16,'center'))}}
  else if(i===3){bands(c,0,LH,['#123a66','#0e3058','#0a2648','#081e3a','#06162c','#040c1c']);
    for(let k=0;k<5;k++){const x=18+k*54+Math.round(Math.sin(frame/50+k)*12);c.fillStyle='rgba(130,190,255,'+(0.06+0.04*Math.sin(frame/35+k*2))+')';c.beginPath();c.moveTo(x,0);c.lineTo(x+20,0);c.lineTo(x+60,LH);c.lineTo(x+20,LH);c.closePath();c.fill()}
    for(let k=0;k<24;k++){const y=LH-((frame*.3+k*31)%LH);ell(c,(k*67)%LW+Math.sin(frame/20+k)*2,y,1+(k%2),1+(k%2),'#8ac0f0')}
    const gl=Math.max(.15,.6+.25*Math.sin(frame/30)-Math.min(.35,t/400));c.globalAlpha=gl;drawNgen(c,128,200,3.5,frame);c.globalAlpha=1;
    [[30,60,'chonchon'],[200,45,'chonchon'],[55,165,'laftrache'],[210,160,'anchi']].forEach(([x,y,tp],k)=>{if(t>k*30){c.globalAlpha=.4;c.drawImage(enemyCanvas(tp,24,Math.floor(frame/12)%2),x-15,y-15);c.globalAlpha=1}});
    [[40,100],[190,85],[75,190],[230,200],[20,150]].forEach(([x,y],k)=>{if(t>k*25&&(frame+k*13)%90<75){R(c,x,y,3,2,'#ff3a2a');R(c,x+7,y,3,2,'#ff3a2a')}})}
  else{paintLand(c,frame,false);
    const gr2=c.createLinearGradient(0,0,0,LH);gr2.addColorStop(0,'rgba(255,130,60,.2)');gr2.addColorStop(.6,'rgba(200,90,70,.1)');gr2.addColorStop(1,'rgba(60,20,50,.22)');c.fillStyle=gr2;c.fillRect(0,0,LW,LH);
    for(let k=0;k<7;k++){const fx2=30+(k*37)%200+Math.sin(frame/30+k*2)*8,fy2=120+(k*23)%80+Math.sin(frame/19+k)*5;if((frame+k*25)%80<55){R(c,fx2,fy2,1,1,'#ffe9a0');ell(c,fx2,fy2,2.5,2.5,'rgba(255,230,140,.18)')}}
    const rk=rukaCanvas(3,2),rox=(LW-256)>>1;ell(c,195+rox,175,40,5,'rgba(0,0,0,.3)');c.drawImage(rk.cvs,150+rox,120,rk.cvs.width*1.7,rk.cvs.height*1.7);
    for(let k=0;k<6;k++){const a=((frame+k*22)%140)/140;ell(c,150+(rk.smoke[0]+rk.ox)*1.7+Math.sin(a*6+k)*3,120+(rk.smoke[1]+rk.oy)*1.7-a*45,2+a*6,2+a*5,'rgba(210,210,220,'+(.5-a*.45)+')')}
    ell(c,96,186,12,3,'rgba(0,0,0,.3)');{const ks=ctCharSprite('kuku','down',0);c.drawImage(ks,69,90,54,96)}}
  cutFx(c,i===2||i===3);
}
/* ---------- map ---------- */
const CAM={x:0,y:0};
const DYN=new Set(['Ł','@','^','Ñ','D','F','C','K','S','I','X','v','P','m','g','p','k','L','G','B','O','q','Q','N','J','H','E','A','j']);
const BOB=new Set(['P','m','g','p','k']);
function bubble(x,y,text){text=GRm(text);OV.push(()=>{ctx.font='bold 13px ui-monospace,Menlo,Consolas,monospace';const w=ctx.measureText(text).width+12,bx=Math.round(x*2-w/2),by=Math.round(y*2-26);
  ctx.fillStyle='#181018';ctx.fillRect(bx-2,by-2,w+4,24);ctx.fillStyle='#fffaf0';ctx.fillRect(bx,by,w,20);ctx.fillStyle='#181018';ctx.fillRect(x*2-3,by+20,6,4);ctx.fillStyle='#fffaf0';ctx.fillRect(x*2-1,by+20,2,2);
  ctx.fillStyle='#2a1a3a';ctx.textAlign='center';ctx.fillText(text,x*2,by+15);ctx.textAlign='left'})}
function renderMap(){
  const c=lx;R(c,0,0,LW,LH,'#000');
  const mw=M.w*T,mh=M.h*T;
  let cx=Math.round(P.fx*T+8-LW/2),cy=Math.round(P.fy*T+8-VH/2);
  cx=mw<=LW?-Math.floor((LW-mw)/2):Math.max(0,Math.min(mw-LW,cx));cy=mh<=VH?-Math.floor((VH-mh)/2):Math.max(0,Math.min(mh-VH,cy));
  CAM.x=cx;CAM.y=cy;
  const wf=Math.floor(frame/18)%3,f4=Math.floor(frame/8)%4;
  c.drawImage(LAYERS[wf],-cx,VY-cy);
  const x0=Math.max(0,Math.floor(cx/T)-1),y0=Math.max(0,Math.floor(cy/T)-1),x1=Math.min(M.w-1,Math.ceil((cx+LW)/T)),y1=Math.min(M.h-1,Math.ceil((cy+VH)/T)+1);
  const glows=[];
  // pulsing markers on real map exits, so openings read through the scenery
  {const pulse=.45+.3*Math.sin(frame/14);c.fillStyle='rgba(255,236,140,'+pulse+')';
   const tri=(tx2,ty2,d)=>{const X=tx2*T-cx+8,Y=ty2*T-cy+VY+8;c.save();c.translate(X,Y);
     c.rotate(d==='left'?Math.PI:d==='up'?-Math.PI/2:d==='down'?Math.PI/2:0);
     const o2=5+Math.sin(frame/9)*1.5;c.beginPath();c.moveTo(o2+3,0);c.lineTo(o2-2,-4);c.lineTo(o2-2,4);c.closePath();c.fill();c.restore()};
   if(M.edges)for(const d in M.edges){
     if(d==='left'||d==='right'){const x2=d==='left'?0:M.w-1;for(let y2=0;y2<M.h;y2++)if(WALK.has(grid[y2][x2]))tri(x2,y2,d)}
     else{const y2=d==='up'?0:M.h-1;for(let x2=0;x2<M.w;x2++)if(WALK.has(grid[y2][x2]))tri(x2,y2,d)}}}
  const sbA=M.sbt&&!S.flags[M.sbt.flag]&&(!M.sbt.req||S.flags[M.sbt.req]);
  if(sbA)for(const k of M.sbt.t){const [tx,ty]=k.split(',');const X=tx*T-cx,Y=ty*T-cy+VY;
    if(X>-T&&X<LW&&Y>VY-T&&Y<VY+VH)c.drawImage(sbtCanvas(Math.floor(frame/14)%2),X,Y)}
  if(M.marks)for(const k of M.marks){const [tx,ty]=k.split(',');const X=tx*T-cx,Y=ty*T-cy+VY;
    if(X>-T&&X<LW&&Y>VY-T&&Y<VY+VH)c.drawImage(sbtCanvas(Math.floor(frame/14)%2),X,Y)}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const ch=grid[y][x];if(!DYN.has(ch))continue;
    const X=x*T-cx,Y=y*T-cy+VY,anim=ch==='F'||ch==='X'||ch==='v'||ch==='A';
    if((ch==='N'||ch==='J')&&M.pz){const kk=x+','+y,t=M.pz.tiles[kk];if(t){const lit=PZ.lit.has(kk);ell(c,X+8,Y+15,6,2,'rgba(0,0,0,.28)');
      c.drawImage(dynCanvas(ch,ch==='N'?(lit?1:0):t.col+'|'+(lit?1:0)),X,Y);if(lit)glows.push([X+8,Y+6]);
      if(Math.abs(x-P.x)+Math.abs(y-P.y)<7)OV.push(()=>txt(t.lab,X+8,Y-2,ch==='J'?t.col:'#e0f4ff',12,'center'));continue}}
    if(ch==='A'){drawWarpRing(c,X+8,Y+9);continue}
    if(ch==='I'&&M.metroGate&&x===M.metroGate.x+M.metroGate.w&&y===M.metroGate.y)continue;
    if(ch==='Ł'){const id=M.tablets&&M.tablets[x+','+y],lit=id&&S.flags['tab_'+id];drawTablet(c,X,Y,lit);if(lit)glows.push([X+8,Y-2]);continue}
    if(ch==='@'){drawPortal(c,X+8,Y+9);continue}
    if(BOB.has(ch)){const b=Math.round(Math.sin(frame/10+x)*1.5);ell(c,X+8,Y+14,4,1.5,'rgba(0,0,0,.25)');c.drawImage(dynCanvas(ch,0),X,Y-3+b);if(frame%40<6)R(c,X+13,Y+1+b,1,1,'#ffffff')}
    else{if('CIK'.includes(ch))ell(c,X+8,Y+15,7,2,'rgba(0,0,0,.28)');c.drawImage(dynCanvas(ch,anim?f4:0),X,Y)}
    if(ch==='F')glows.push([X+8,Y+8])}
  const list=[];
  for(const p of PROPS){const sx=p.dx-cx,sy=p.dy-cy+VY;if(sx>LW+40||sy>LH+40||sx<-80||sy<-80)continue;
    list.push({y:p.y,d:()=>{if(CT){ell(c,p.sh[0]-cx+4,p.sh[1]-cy+VY+1,p.sh[2]*1.7,p.sh[3]*2.4,'rgba(0,10,20,.2)');ell(c,p.sh[0]-cx+2,p.sh[1]-cy+VY,p.sh[2]*1.1,p.sh[3]*1.4,'rgba(0,10,20,.22)')}else ell(c,p.sh[0]-cx+1,p.sh[1]-cy+VY,p.sh[2],p.sh[3],'rgba(0,0,0,.28)');
      if(p.loom)c.drawImage(loomCanvas((frame/50)%15),sx,sy);
      else if(p.door){c.drawImage(doorwayCanvas(frame%44<6?1:0),sx,sy);ell(c,sx+5,sy+13,7,3,'rgba(255,200,110,'+(.10+.05*Math.sin(frame/9))+')')}
      else if(p.pot){c.drawImage(potCanvas(f4),sx,sy);for(let k=0;k<4;k++){const a=((frame+k*18)%72)/72;R(c,sx+6+Math.round(Math.sin(a*6+k)*2),sy+2-a*12,2,2,'rgba(240,240,240,'+(.7-a*.7)+')')}}
      else c.drawImage(p.cvs,sx,sy);
      if(p.board)OV.push(()=>{ctx.font='bold 11px ui-monospace,monospace';ctx.fillStyle='#f0f0e0';ctx.textAlign='center';ctx.fillText('Mari mari',(sx+12)*2,(sy+7)*2);ctx.fillText('kiñe epu küla',(sx+12)*2,(sy+12)*2+1);ctx.textAlign='left'})}})}
  for(const sc of SCN)if(sc.type==='palin'){
    sc.pl.forEach((p,i)=>list.push({y:p.y/T+.4,d:()=>{const sx=Math.round(p.x-8-cx),sy=Math.round(p.y-8-cy+VY);drawChar(c,i<2?'palinA':'palinB',sx,sy,p.dir,p.mv?Math.floor(frame/7+i)%4:0,false,i%5,[0,1,5,3][i%4],[0,2,0,3][i%4]);
      const d=p.dir==='left'?-1:1,near=Math.hypot(p.x-sc.bx,p.y-sc.by)<22,sw=near?Math.sin(frame/5+i*1.7):Math.sin(frame/40+i)*.3;
      const hx=sx+8+d*(CT?2:2),hy=sy+(CT?6:9),tx=sx+8+d*((CT?15:10)+Math.round(sw*(CT?4:3))),ty=sy+16-Math.round(Math.max(0,-sw)*(CT?3:2));drawWino(c,hx,hy,tx,ty,d)}}));
    list.push({y:sc.by/T+.45,d:()=>{const bx=Math.round(sc.bx-cx),by=Math.round(sc.by-cy+VY);ell(c,bx,by+3,2,1,'rgba(0,0,0,.3)');ell(c,bx,by,2,2,'#3a2a1a');R(c,bx-1,by-1,1,1,'#8a6a4a')}});
    if(typeof PAL!=='undefined'&&PAL&&PAL.on){
      const X=sc.x*T-cx,Y2=sc.y*T-cy+VY,w2=sc.w*T,h2=sc.h*T;
      for(const gx of [X+1,X+w2-2])for(const gy of [Y2+2,Y2+h2-4]){R(c,gx,gy-8,2,10,'#6a4a28');R(c,gx,gy-8,1,10,'#8a6a40');R(c,gx,gy-9,2,2,'#c03030')}
      OV.push(()=>{ctx.font='bold 13px ui-monospace,monospace';ctx.fillStyle='#fff8d0';ctx.textAlign='center';
        ctx.fillText('Eymi '+PAL.s[0]+'  ·  '+PAL.s[1]+' '+(S.gloss==='en'?'Them':'Ellos'),(X+w2/2)*2,(Y2-6)*2);ctx.textAlign='left'})}
    else if((frame%300)<90){const p=sc.pl[Math.floor(frame/300)%4];bubble(p.x-cx,p.y-cy+VY-14,['Palin!','Kümey!','Pali!','Ya!'][Math.floor(frame/300)%4])}
  }
  for(const e of ents)list.push({y:e.fy+.5,d:()=>{const sx=Math.round(e.fx*T-cx),sy=Math.round(e.fy*T-cy+VY);
    if(e.kind==='npc'){
      if(e.look==='ngen')drawNgen(c,sx+8,sy+15,1,frame);
      else if(e.look==='ngen2')drawNgen(c,sx+8,sy+15,1,frame,'mawida');
      else if(e.look==='ngen3')drawNgen(c,sx+8,sy+15,1,frame,'pewen');
      else if(e.look==='ngen4')drawNgen(c,sx+8,sy+15,1,frame,'kuruf');
      else if(e.look==='ngen5')drawNgen(c,sx+8,sy+15,1,frame,'lelfun');
      else if(e.look==='yewen'){const yc=enemyCanvas('yewen',34,Math.floor(frame/16)%2);ell(c,sx+8,sy+15,13,3,'rgba(0,0,0,.35)');
        for(let k=0;k<3;k++){const ph=((frame+k*40)%120)/120;ell(c,sx+8+Math.sin(ph*6+k)*6,sy+8-ph*22,2+ph*3,(2+ph*3)*.7,'rgba(120,110,140,'+(.25*(1-ph)).toFixed(2)+')')}
        c.drawImage(yc,sx+8-(yc.width>>1),sy+17-yc.height)}
      else if(e.look==='rewe'){ell(c,sx+8,sy+14,6,2,'rgba(0,0,0,.3)');const rc=reweCanvas();c.drawImage(rc,sx-1,sy+16-rc.height)}
      else if(e.look==='llawfen'||e.look==='llawcrack')drawLlawMap(c,e,sx,sy);
      else if(e.obj)drawObj(c,e.obj,sx,sy,e);
      else if(e.look==='dog'){ell(c,sx+8,sy+14,6,2,'rgba(0,0,0,.3)');c.drawImage(dogSprite(e.mv?Math.floor(frame/6)%2:0,e.dir),sx,sy+4)}
      else{let fr=e.mv?Math.floor(frame/7)%4:0;if(e.act==='weave'||e.act==='teach')fr=Math.floor(frame/24)%2?1:0;
        drawChar(c,e.look,sx,sy,e.dir||'down',fr,e.seated,e.tn,e.ey2,e.hr2);
        if(e.act==='wood'){R(c,sx+(e.dir==='left'?9:1),sy-6,6,3,'#7a4a22');R(c,sx+(e.dir==='left'?9:1),sy-6,6,1,'#a87040')}}
      if(e.bub&&(frame+e.bt)%600<400&&Math.abs(e.x-P.x)+Math.abs(e.y-P.y)<9)bubble(sx+8,sy-(e.seated?2:8),wxBubble(e,e.bub[Math.floor((frame+e.bt)/600)%e.bub.length]))}
    else if(e.kind==='animal'){const ac=animalCanvas(e.look,e.mv?Math.floor(frame/8)%2:0,e.dir==='right'?'right':'left');ell(c,sx+8,sy+15,ac.width*.36,2,'rgba(0,0,0,.3)');c.drawImage(ac,sx+8-(ac.width>>1),sy+17-ac.height)}
    else{const t=e.party[0],sz=e.final?72:e.boss?30:e.mini?22:16,cvs=enemyCanvas(t,sz,Math.floor(frame/10)%2);
      const fly=ET[t].fly?6+Math.round(Math.sin(frame/8)*1.5):0;
      ell(c,sx+8,sy+14,sz/3,2,'rgba(0,0,0,.3)');
      if(e.final){const cxp=sx+8,cyp=sy+16-Math.round(cvs.height/2),loom=Math.round(Math.sin(frame/34)*2);
        ell(c,cxp,sy+15,cvs.width*.75,7,'rgba(14,18,8,.55)');ell(c,cxp,sy+15,cvs.width*.5,4,'rgba(26,32,14,.5)');
        for(const [r,a] of [[1.35,.34],[1.0,.24],[.68,.16]])ell(c,cxp,cyp+loom,cvs.width*.72*r,cvs.height*.58*r,'rgba(3,5,2,'+a+')');
        for(let k=0;k<8;k++){const a2=frame/44+k*.785,rr=cvs.width*.6+Math.sin(frame/18+k)*4;
          ell(c,cxp+Math.cos(a2)*rr,cyp+loom+Math.sin(a2)*cvs.height*.46,3.5,2,'rgba(112,152,92,.34)')}
        for(let k=0;k<7;k++){const ph=((frame*.7+k*43)%180)/180;
          const vx=cxp+Math.sin(frame/50+k*2.1)*cvs.width*.42+Math.sin(ph*6.28+k)*5,vy=sy+12-ph*cvs.height*1.05,vr=(5+(k%3)*3)*(.6+ph*.8);
          ell(c,vx,vy,vr,vr*.55,'rgba(108,150,88,'+(.18*(1-ph)).toFixed(2)+')');
          ell(c,vx+2,vy+1,vr*.6,vr*.35,'rgba(140,184,108,'+(.12*(1-ph)).toFixed(2)+')')}
        for(let k=0;k<4;k++){R(c,Math.round(cxp+Math.sin(frame/7+k*3)*cvs.width*.4),Math.round(cyp+Math.cos(frame/9+k*2)*cvs.height*.3),1,1,'rgba(14,18,8,.85)')}}
      if(S.pw.pewen>0&&frame%10<5)c.globalAlpha=.55;
      c.drawImage(cvs,Math.round(sx+8-cvs.width/2),Math.round(sy+16-cvs.height-fly+2));c.globalAlpha=1;
      if(e.party.length>1)OV.push(()=>txt('×'+e.party.length,sx+13,sy+3,'#ffffff',12))}}});
  list.push({y:P.fy+.5,d:()=>drawChar(c,heroLook(),Math.round(P.fx*T-cx),Math.round(P.fy*T-cy+VY),P.dir,P.moving?Math.floor(frame/6)%4:0)});
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.d());
  // enemies behind a tree canopy stay faintly visible
  for(const e of ents){if(e.kind!=='enemy'||!e.party)continue;
    const bx=e.x,by=e.y+1;
    if(by<M.h&&grid[by][bx]==='T'){
      const t=e.party[0],sz=e.boss?30:e.mini?22:16,cvs=enemyCanvas(t,sz,Math.floor(frame/10)%2);
      const sx=Math.round(e.fx*T-cx),sy=Math.round(e.fy*T-cy+VY);
      const fly=ET[t].fly?6+Math.round(Math.sin(frame/8)*1.5):0;
      c.globalAlpha=.5;c.drawImage(cvs,Math.round(sx+8-cvs.width/2),Math.round(sy+16-cvs.height-fly+2));c.globalAlpha=1;
    }}
  for(const [rx,ry] of RUKAS)for(let k=0;k<5;k++){const ph=((frame+k*28)%140)/140;ell(c,rx-cx+Math.sin(ph*6+k)*3*ph,ry-cy+VY-ph*28,2+ph*5,(2+ph*5)*.8,'rgba(225,225,235,'+(.4*(1-ph))+')')}
  for(let k=0;k<26;k++){const wx=Math.floor(h2(k,frame>>3,91)*LW),wy=Math.floor(h2(k,frame>>3,92)*LH),mx=Math.floor((wx+cx)/T),my=Math.floor((wy-VY+cy)/T);
    if(inB(mx,my)&&grid[my][mx]==='~'&&WD[my][mx]>1){const a=(frame%8)<4;R(c,wx,wy,1,1,M.lava?'#fff0a0':'#f4faff');if(a){R(c,wx-1,wy,1,1,'rgba(220,240,255,.7)');R(c,wx+1,wy,1,1,'rgba(220,240,255,.7)')}}}
  for(const [gx,gy] of glows)for(const [r,a] of [[24,.05],[16,.07],[10,.08]])ell(c,gx,gy,r,r*.8,'rgba(255,170,80,'+a+')');
  if(CUR==='w_trayen'){ // the trayen: water falling down the gorge, not a river
    for(let ty=0;ty<grid.length;ty++)for(let tx=9;tx<=13;tx++){if(grid[ty][tx]!=='~')continue;
      const X=tx*T-cx,Y=ty*T-cy+VY;if(X<-T||X>LW||Y<VY-T||Y>VY+VH)continue;
      const lower=ty>=9;
      if(!lower){ // falling sheet: fast streaks, pale spray edges
        c.fillStyle='rgba(225,240,255,.18)';c.fillRect(X,Y,T,T);
        for(let k=0;k<5;k++){const sx=X+1+((k*3+tx*2)%14),ph=((frame*3+k*17+tx*5)%24);
          R(c,sx,Y+((ph)%16),1,5,'rgba(255,255,255,'+(k%2?.75:.5)+')');
          if(ph<6)R(c,sx,Y,1,2,'rgba(255,255,255,.35)')}
        if(grid[ty][tx-1]!=='~'){R(c,X,Y,1,T,'rgba(255,255,255,.45)');R(c,X-3,Y,3,T,'rgba(20,28,24,.45)');R(c,X-5,Y,2,T,'rgba(20,28,24,.2)');for(let k=0;k<3;k++)R(c,X-4+(k%2),Y+2+k*5,2,1,'rgba(120,130,120,.5)')}
        if(grid[ty][tx+1]!=='~'){R(c,X+T-1,Y,1,T,'rgba(255,255,255,.45)');R(c,X+T,Y,3,T,'rgba(20,28,24,.45)');R(c,X+T+3,Y,2,T,'rgba(20,28,24,.2)');for(let k=0;k<3;k++)R(c,X+T+1+(k%2),Y+4+k*5,2,1,'rgba(120,130,120,.5)')}
      }else{ // plunge: churning foam and rising spray
        c.fillStyle='rgba(235,245,255,.14)';c.fillRect(X,Y,T,T);
        for(let k=0;k<4;k++){const ph=((frame*2+k*23+tx*7+ty*11)%40)/40;
          ell(c,X+3+((k*5+ty)%11),Y+2+((k*7+tx)%12),2+ph*2,1.2+ph,'rgba(255,255,255,'+(.55*(1-ph)).toFixed(2)+')')}
        if(ty===9){for(let k=0;k<3;k++){const ph=((frame*2+k*29+tx*3)%60)/60;
          ell(c,X+8+Math.sin(ph*6+k)*6,Y-ph*14,1.5+ph*2,1+ph,'rgba(230,245,255,'+(.35*(1-ph)).toFixed(2)+')')}}
      }
    }
    // the lip of the fall at the top of the gorge
    {const X=10*T-cx,Y=1*T-cy+VY;c.fillStyle='rgba(255,255,255,.5)';c.fillRect(X,Y-1,3*T,2)}
  }
  // trawün rukas carry a small woven banner over the door so players find the lesson
  if(M.doors)for(const k in M.doors){if(!/_trawun$/.test(M.doors[k].to))continue;const [qx,qy]=k.split(',').map(Number),X=qx*T-cx+8,Y=(qy-1)*T-cy+VY-6;
    if(X<-30||X>LW+30||Y<-20||Y>LH)continue;const sw=Math.sin(frame/30)*.6;
    R(c,X-13,Y-1,26,9,'#2a1a10');R(c,X-12,Y,24,7,'#c8402a');for(let j=0;j<12;j++)R(c,X-12+j*2,Y+(j%2?1:5),1,1,'#f4e8c8');R(c,X-12,Y+3,24,1,'#2a1a10');
    R(c,X-12+Math.round(sw),Y+7,1,3,'#c8402a');R(c,X+11+Math.round(sw),Y+7,1,3,'#c8402a');
    OV.push(()=>txt('trawün',X,Y-3,'#ffe8a0',11,'center'))}
  // the metro entrance: a soft red glow on the totem, and a bobbing arrow with a label until the player has gone down once
  if(M.metroGate){const g=M.metroGate,X=(g.x+g.w)*T-cx+8,Y=g.y*T-cy+VY-28;if(X>-40&&X<LW+40&&Y>-60&&Y<LH+40){
    const a=(.18+.12*Math.sin(frame/12)).toFixed(2);c.fillStyle='rgba(255,60,80,'+a+')';c.beginPath();c.ellipse(X,Y+8,12,11,0,0,6.283);c.fill();
    if(!S.flags.metro_seen){const hx=g.x*T-cx+g.w*8,b=Math.round(Math.sin(frame/8)*2),ay=g.y*T-cy+VY-14+b;
      R(c,hx-3,ay,6,4,'#ffffff');R(c,hx-5,ay+4,10,1,'#ffffff');R(c,hx-4,ay+5,8,1,'#ffffff');R(c,hx-3,ay+6,6,1,'#ffffff');R(c,hx-2,ay+7,4,1,'#ffffff');R(c,hx-1,ay+8,2,1,'#ffffff');
      OV.push(()=>txt('Metro',hx,ay-3,'#ffd0d8',11,'center'))}}}
  // quest dig spots (the ones an NPC has told you about): a faint shimmer in the ground until you dig there
  if(M.digs)for(const k in M.digs){const dv=M.digs[k];if(!dv.req||!S.flags[dv.req]||S.flags['dig:'+CUR+':'+k])continue;
    const [qx,qy]=k.split(',').map(Number),X=qx*T-cx+8,Y=qy*T-cy+VY+10;if(X<-20||X>LW+20||Y<-20||Y>LH+20)continue;
    for(let r2=0;r2<2;r2++){const ph=((frame+r2*60)%120)/120;c.strokeStyle='rgba(255,250,220,'+(.75*(1-ph)).toFixed(2)+')';c.lineWidth=1;c.beginPath();c.ellipse(X,Y,2+ph*8,1+ph*3,0,0,6.283);c.stroke()}
    R(c,X-1,Y,3,1,'rgba(255,250,220,'+(.35+.25*Math.sin(frame/8)).toFixed(2)+')');
    for(let j=0;j<4;j++){const t2=(frame+j*30)%120;if(t2<22){const sx=X-5+((j*7+Math.floor(frame/120)*3)%11),sy=Y-3-(j%2)*3;R(c,sx,sy,1,1,'#ffffff');if(t2>4&&t2<16){R(c,sx-1,sy,1,1,'rgba(255,255,255,.7)');R(c,sx+1,sy,1,1,'rgba(255,255,255,.7)');R(c,sx,sy-1,1,1,'rgba(255,255,255,.7)');R(c,sx,sy+1,1,1,'rgba(255,255,255,.7)')}}}}
  // machi-quest landmarks: quiet environmental cues at the five dig spots
  {const MQC={l_wapi:[12,9,'foye'],n_menoko:[22,3,'pool'],p_pewen:[16,13,'pewen'],w_trayen:[12,9,'mist'],e_lelfun:[10,11,'salt']}[CUR];
   if(MQC){const [qx,qy,kind]=MQC,ox=qx*T+8-cx,oy=qy*T+8-cy+VY;
    if(ox>-40&&ox<LW+40&&oy>-40&&oy<LH+40){
      if(kind==='foye'){ // the canelo in bloom: pale blossoms drifting around the lone tree
        for(let k=0;k<6;k++){const ph=((frame+k*23)%140)/140;const fx2=ox+Math.sin(ph*6.28+k*1.3)*11,fy2=oy-16-ph*18;
          R(c,Math.round(fx2),Math.round(fy2),1,1,'rgba(255,250,240,'+(.75*(1-ph)).toFixed(2)+')')}
        for(let k=0;k<5;k++)R(c,ox-7+((k*5)%15),oy-14+((k*3)%7),1,1,'#f4f0e4')}
      else if(kind==='pool'){ // the stillest water: a slow, perfect ring of light
        const ph=((frame)%180)/180;c.strokeStyle='rgba(225,248,255,'+(.7*(1-ph)).toFixed(2)+')';c.lineWidth=1;
        c.beginPath();c.ellipse(ox+8,oy,3+ph*13,1.5+ph*5,0,0,6.283);c.stroke();
        R(c,ox+8,oy-1,1,1,'rgba(255,255,255,'+(.5+.4*Math.sin(frame/15)).toFixed(2)+')')}
      else if(kind==='pewen'){ // ngülliw scattered on the ground at the grandmother's feet
        for(let k=0;k<9;k++){const sx2=ox-12+((k*7)%24),sy2=oy-14+((k*5)%9);R(c,sx2,sy2,2,1,'#7a4a22');R(c,sx2,sy2-1,1,1,'#b07a44')}
        R(c,ox-9,oy-8,1,1,'#c89a60');R(c,ox+10,oy-5,1,1,'#c89a60')}
      else if(kind==='mist'){ // spray at the foot of the fall catching the light
        for(let k=0;k<7;k++){const ph=((frame*2+k*31)%110)/110;const fx2=ox+10+Math.sin(ph*5+k)*8,fy2=oy+6-ph*22;
          ell(c,fx2,fy2,2+ph*2,1.2+ph,'rgba(235,248,255,'+(.5*(1-ph)).toFixed(2)+')')}
        if(frame%90<45)R(c,ox+12,oy-10,1,1,'rgba(255,220,240,.8)');else R(c,ox+14,oy-12,1,1,'rgba(200,255,220,.8)')}
      else if(kind==='salt'){ // the ground turns white beside the lone chacay
        for(let k=0;k<10;k++){const sx2=ox-20+((k*9)%22),sy2=oy-6+((k*4)%11);R(c,sx2,sy2,3,1,'rgba(245,242,230,.75)');R(c,sx2+1,sy2+1,1,1,'rgba(255,255,250,.6)')}
        for(let k=0;k<4;k++)R(c,ox-18+k*6,oy+2+(k%2),2,1,'rgba(250,248,240,.55)')}
    }}}
  if(CUR==='w_wapi'&&grid[10]&&grid[10][16]==='v'){const wx=16*T+8-cx,wy=10*T+8-cy+VY;
    for(let k=0;k<3;k++){const ph=(frame/46+k/3)%1;ell(c,wx,wy,6+ph*17,(6+ph*17)*.45,'rgba(140,255,230,'+(.55*(1-ph)).toFixed(2)+')')}
    c.globalAlpha=.22+.1*Math.sin(frame/9);const wg=c.createLinearGradient(0,wy-44,0,wy);wg.addColorStop(0,'rgba(140,255,230,0)');wg.addColorStop(1,'rgba(140,255,230,.55)');c.fillStyle=wg;c.fillRect(wx-7,wy-44,14,44);c.globalAlpha=1;
    for(let k=0;k<5;k++){const ph=((frame+k*23)%115)/115;ell(c,wx+Math.sin(ph*8+k)*6,wy-ph*38,1.5,1.5,'rgba(190,255,240,'+(.7*(1-ph)).toFixed(2)+')')}
    ell(c,wx,wy,4,2,'rgba(230,255,250,'+(.5+.3*Math.sin(frame/7)).toFixed(2)+')')}
  if(M.bg==='crater'){c.fillStyle=awake(M.region)?'rgba(255,200,120,.05)':'rgba(120,20,0,.18)';c.fillRect(0,VY,LW,VH)}
  if(M.region==='williche'&&!awake('williche')&&!M.dungeon){for(let k=0;k<9;k++){const fx=((k*61+frame*(.15+(k%3)*.08))%(LW+120))-60,fy=VY+((k*47)%LH);ell(c,fx,fy,46+(k%3)*14,14+(k%2)*6,'rgba(220,228,236,.16)')}c.fillStyle='rgba(200,210,220,.10)';c.fillRect(0,VY,LW,VH)}
  if(M.bg==='fjord'){c.fillStyle=awake(M.region)?'rgba(255,240,200,.05)':'rgba(10,20,44,.38)';c.fillRect(0,VY,LW,VH)}
  if(M.under){c.fillStyle='rgba(20,90,120,.18)';c.fillRect(0,VY,LW,VH);
    for(let k=0;k<10;k++){const bx=(k*53+Math.floor(Math.sin(k*7)*9))%LW,by=VY+VH-((frame*.8+k*47)%(VH+20));c.strokeStyle='rgba(190,240,250,.35)';c.beginPath();c.arc(bx+Math.sin((frame+k*30)/22)*3,by,1+(k%2),0,6.283);c.stroke()}
    for(let k=0;k<3;k++){const sx2=40+k*80+Math.sin(frame/90+k)*10;c.fillStyle='rgba(180,240,255,.05)';c.beginPath();c.moveTo(sx2,VY);c.lineTo(sx2+26,VY);c.lineTo(sx2+60,VY+VH);c.lineTo(sx2+20,VY+VH);c.closePath();c.fill()}}
  if(M.fog){c.fillStyle=S.flags.won?'rgba(255,244,210,.06)':'rgba(148,158,174,.16)';c.fillRect(0,VY,LW,VH);
    if(!S.flags.won)for(let k=0;k<5;k++){const wx=((k*83+frame)%(LW+80))-40,wy=24+k*((VH-30)/5);c.fillStyle='rgba(190,198,210,.08)';c.beginPath();c.ellipse(wx,VY+wy,46,8,0,0,6.283);c.fill()}}
  if(M.bg==='cave'||M.bg==='cave2'||M.bg==='cave3'||M.bg==='cave4'){const px=Math.round(P.fx*T-cx+8),py=Math.round(P.fy*T-cy+VY+8);const dm=darkMask();c.drawImage(dm,px-dm.width/2,py-dm.height/2)}
  if(CUR==='rupu'){for(let k=0;k<7;k++){const fx=-cx+Math.round(Math.sin(frame/60+k)*6)+6,fy=k*30+((frame/3+k*17)%30)-cy+VY;for(const [rr,al] of [[26,.18],[16,.22],[9,.25]])ell(c,fx,fy,rr,rr*.7,'rgba(200,200,212,'+al+')')}}
  if(M.bg==='forest'){c.fillStyle=awake(M.region)?'rgba(255,240,160,.06)':'rgba(10,30,20,.3)';c.fillRect(0,VY,LW,VH)}
  if(M.bg==='lagoon'){c.fillStyle=S.flags.ngen?'rgba(120,200,255,.08)':'rgba(60,30,90,.22)';c.fillRect(0,VY,LW,VH)}
  atmos(c);
  if(CT)ctLight(c,glows);
  if(typeof ngOverlay==='function')ngOverlay(c,cx,cy);   // Upewtuwün mapu: the grey goes over the light too
  drawHUD(c);
}
// palin wiño: a long wooden stick held at the hip, its curved head sweeping the ground
function drawWino(c,hx,hy,tx,ty,d){
  const n=Math.max(Math.abs(tx-hx),Math.abs(ty-hy)),pts=[];for(let k=0;k<=n;k++)pts.push([Math.round(hx+(tx-hx)*k/n),Math.round(hy+(ty-hy)*k/n)]);
  const big=CT,hook=big?[[1,0],[2,0],[3,0],[4,-1],[4,-2]]:[[1,0],[2,0],[3,-1]];for(const [a,b] of hook)pts.push([tx+d*a,ty+b]);
  for(const [x,y] of pts)R(c,x-1,y-1,big?4:3,big?4:3,'#2a1608');
  for(const [x,y] of pts)R(c,x,y,big?2:1,big?2:1,'#9a6430');
  for(const [x,y] of pts)R(c,x,y,1,1,'#d09a58');
  R(c,hx-1,hy-1,big?4:3,big?4:3,'#f0c8a0');R(c,hx-1,hy+(big?2:1),big?4:3,1,'#b07850');
}
function ctLight(c,glows){
  const dark=M.dungeon||M.bg==='forest'||M.trees==='mawida'||M.bg==='crater'||M.bg==='fjord';
  c.save();
  const g=dLin(0,VY,0,LH);g.addColorStop(0,dark?'rgba(10,20,50,.18)':'rgba(255,236,190,.10)');g.addColorStop(1,dark?'rgba(0,0,20,.28)':'rgba(40,30,80,.10)');g.fill(c,0,VY,LW,VH);
  const v=dRad(LW/2,LH/2,LH*.35,LW/2,LH/2,LH*.85);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,dark?'rgba(0,0,16,.55)':'rgba(0,0,20,.32)');v.fill(c,0,VY,LW,VH);
  c.globalCompositeOperation='lighter';
  for(const [gx,gy] of glows){const fl=Math.floor(frame/10+gx)%3,rg=dRad(56,56,2,56,56,46+fl*2);rg.addColorStop(0,'rgba(255,190,90,.45)');rg.addColorStop(.4,'rgba(255,140,50,.16)');rg.addColorStop(1,'rgba(255,120,40,0)');c.save();c.translate(Math.round(gx-56),Math.round(gy-56));rg.fill(c,0,0,112,112);c.restore()}
  c.restore()}
function ctWin(c,x,y,w,h){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#5a6a9e');g.addColorStop(.5,'#2a3468');g.addColorStop(1,'#141a3c');
  R(c,x-1,y-1,w+2,h+2,'#000');c.fillStyle=g;c.fillRect(x,y,w,h);R(c,x,y,w,1,'#e8ecf8');R(c,x,y,1,h,'#e8ecf8');R(c,x+w-1,y,1,h,'#7a7e94');R(c,x,y+h-1,w,1,'#7a7e94');
  R(c,x+1,y+1,w-2,1,'#9aa2c8');for(let yy=y+2;yy<y+h-1;yy+=2)for(let xx=x+2+((yy>>1)%2);xx<x+w-1;xx+=4)R(c,xx,yy,1,1,'rgba(255,255,255,.05)')}
/* small 5x5 heart for the compact HUD; q = quarters filled (0..4), filled left to right */
const MHS=['.X.X.','XXXXX','XXXXX','.XXX.','..X..'];
function drawMiniHeart(c,x,y,q){
  for(let r=0;r<5;r++)for(let k=0;k<5;k++)if(MHS[r][k]==='X'){R(c,x+k-1,y+r,1,1,'#120a14');R(c,x+k+1,y+r,1,1,'#120a14');R(c,x+k,y+r-1,1,1,'#120a14');R(c,x+k,y+r+1,1,1,'#120a14')}
  const fill=Math.round(5*q/4);
  for(let r=0;r<5;r++)for(let k=0;k<5;k++)if(MHS[r][k]==='X')R(c,x+k,y+r,1,1,k<fill?(r<2&&k<2?'#ff9a8a':r>2?'#b81c2c':'#e83a3a'):'#3e2638');
  if(fill)R(c,x+1,y+1,1,1,'#ffe0d8')}
function drawHUD(c){
  // compact overlay: newen meter and counters top-left; a thin heart strip tucked into the top-right corner.
  // Either panel fades when the player walks underneath it, so nothing on the map stays hidden.
  const mx=maxHP(),hearts=Math.min(40,Math.ceil(mx/HPQ)),hp=Math.max(0,S.hp),PER=14,rows=Math.ceil(hearts/PER),hw=Math.min(hearts,PER)*6+3;
  const tw=5*12,pw=Math.max(hw,tw+4)+4,ph=rows*6+3+8,px=LW-pw-19,py=1,LX=19;   // clear of the ☰ and ⛶ buttons
  const pxs=P.fx*T-CAM.x+8,pys=P.fy*T-CAM.y+VY+8,under=(x,y,w,h)=>pxs>x-10&&pxs<x+w+10&&pys>y-6&&pys<y+h+16;
  const lw=M&&M.dungeon?118:108,lh=30,lfade=under(LX+2,1,lw,lh),rfade=under(px,py,pw,ph);
  const plate=(x,y,w,h)=>{c.fillStyle='rgba(12,10,30,.5)';c.fillRect(x+1,y,w-2,h);c.fillRect(x,y+1,w,h-2);
      c.fillStyle='rgba(232,236,248,.4)';c.fillRect(x+1,y,w-2,1);c.fillRect(x+1,y+h-1,w-2,1);c.fillRect(x,y+1,1,h-2);c.fillRect(x+w-1,y+1,1,h-2)};
  // ---- left: newen bar + ngülliw, kulon, keys, kimün
  c.save();c.globalAlpha=lfade?.3:1;c.translate(LX,0);
  plate(2,1,lw,lh);
  R(c,5,3,9,26,'#181018');R(c,6,4,7,24,'#f8f8f8');R(c,7,5,5,22,'#181018');
  const sp=S.sp||0,fh=Math.round(22*sp/SPMAX);if(fh>0){R(c,7,27-fh,5,fh,'#30b030');R(c,7,27-fh,2,fh,'#70e070')}
  for(let k=1;k<SPMAX;k++)R(c,7,5+Math.round(22*k/SPMAX),5,1,'#000');
  ell(c,22,8,2,3.2,'#c88a18');ell(c,21.6,7.6,1.4,2.6,'#f0c040');R(c,21,6,1,2,'#fff4b0');
  ell(c,46,8,2.6,2.6,'#5a1a6a');ell(c,45.2,7.2,1.6,1.6,'#8a3aa0');R(c,46,4,1,2,'#2a7a2a');
  if(M&&M.dungeon)c.drawImage(dynCanvas('k',0),62,0);
  c.restore();
  // ---- right: hearts in rows of 14, the trariwe strip underneath
  c.save();c.globalAlpha=rfade?.3:1;
  plate(px,py,pw,ph);
  for(let i=0;i<hearts;i++){const q=Math.max(0,Math.min(4,hp-i*HPQ)),col=i%PER,row=Math.floor(i/PER);drawMiniHeart(c,px+4+col*6,py+3+row*6,q)}
  {const ty=py+3+rows*6+1,tx=px+4,pcs=S.pieces||[];const RG=['lafkenche','nagche','pewenche','williche','puelche'];
    const PAT={lafkenche:['#2a64c8','#f0f0f0'],nagche:['#2f8d4a','#f0d060'],pewenche:['#6a3a1a','#e8e0d0'],williche:['#8a2458','#f0f0f0'],puelche:['#c87a20','#202020']};
    R(c,tx-1,ty-1,RG.length*12+2,6,'#181018');
    RG.forEach((k,i)=>{const x=tx+i*12;if(pcs.includes(k)){const [a,b]=PAT[k];R(c,x,ty,12,4,a);for(let j=0;j<6;j++){R(c,x+j*2,ty+(j%2?1:2),1,1,b)}R(c,x,ty,12,1,'rgba(255,255,255,.35)')}
      else{R(c,x,ty,12,4,'#2a2238');for(let j=0;j<12;j+=3)R(c,x+j,ty+1,2,1,'#4a3d5c')}
      if(i)R(c,x,ty,1,4,'#181018')})}
  c.restore();
  const la=lfade?.35:1;
  OV.push(()=>{ctx.save();ctx.globalAlpha=la;txt(String(S.gold).padStart(3,'0'),LX+22,22,'#ffffff',12,'center');txt(String(S.items.kulon||0).padStart(2,'0'),LX+46,22,'#ffffff',12,'center');
    if(M&&M.dungeon)txt(String(S.keys||0).padStart(2,'0'),LX+70,22,'#ffffff',12,'center');
    txt('kimün '+S.lvl,LX+(M&&M.dungeon?80:60),12,'#bfe3d0',11);
    if(S.curse)txt('☠',LX+(M&&M.dungeon?84:64),24,'#d0a0ff',12);if(S.kutran)txt('✖',LX+(M&&M.dungeon?96:76),24,'#9fe870',12);ctx.restore();
    const pw2=[];if(S.pw.speed>0)pw2.push('mañke');if(S.pw.pewen>0)pw2.push('pewen');if(S.pw.gold)pw2.push('milla');if(pw2.length)txt(pw2.join(' '),LW-6,py+ph+8,'#ffe27a',11,'right')});
}
/* ---------- battle ---------- */
const BG={},FG={};
const NK=n=>Math.max(n,Math.round(n*LW/256));
function lavify(cvs){const c=cvs.getContext('2d'),d=c.getImageData(0,0,cvs.width,cvs.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],l=(r+g+b)/3;if(b>r+20&&b>g){a[i]=Math.min(255,l*1.9+40);a[i+1]=Math.round(l*.9);a[i+2]=Math.round(l*.3)}else{a[i]=Math.round(r*.7+l*.15);a[i+1]=Math.round(g*.45);a[i+2]=Math.round(b*.45)}}c.putImageData(d,0,0);return cvs}
function fogify(cvs){const c=cvs.getContext('2d'),d=c.getImageData(0,0,cvs.width,cvs.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],l=(r+g+b)/3;if(r>g+6&&r>b){a[i]=Math.round(l*.7);a[i+1]=Math.round(l*.95+6);a[i+2]=Math.round(l*1.15+12)}}c.putImageData(d,0,0);return cvs}
function dustify(cvs){const c=cvs.getContext('2d'),d=c.getImageData(0,0,cvs.width,cvs.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],l=(r+g+b)/3;a[i]=Math.min(255,Math.round(l*1.15+30));a[i+1]=Math.round(l*.95+16);a[i+2]=Math.round(l*.55)}c.putImageData(d,0,0);return cvs}
function deepBG(){const [cvs,c]=mk(LW,LH);
  bands(c,0,LH,['#06303e','#07394a','#084256','#0a4c62','#0c566e','#0e607a','#0f6a86','#117492']);
  for(let k=0;k<NK(4);k++){const x=30+k*62;c.fillStyle='rgba(180,240,255,.06)';c.beginPath();c.moveTo(x,0);c.lineTo(x+22,0);c.lineTo(x+70,LH);c.lineTo(x+28,LH);c.closePath();c.fill()}
  for(let k=0;k<NK(9);k++){const kx=8+k*30+(k%3)*5,kh=60+((k*31)%70);
    for(let i=0;i<kh;i+=3){const sw=Math.sin(i*.2+k)*4;R(c,kx+sw,LH-i,3,3,k%2?'#0a4a3a':'#0e5a46');if(i%9===0)R(c,kx+sw+3,LH-i,2,2,'#1a7a5e')}}
  R(c,0,LH-18,LW,18,'#0a3240');for(let x=0;x<LW;x+=3)if(h2(x,1,9)<.4)R(c,x,LH-16+(x%5),2,2,'#154a5c');
  for(const [px,py] of [[50,LH-14],[130,LH-10],[210,LH-16]]){ell(c,px,py,7,3,'#083040');ell(c,px-2,py-2,3,2,'#ff8a9a');ell(c,px+3,py-1,2,2,'#ffd84a')}
  for(let k=0;k<26;k++){const x=(k*37)%LW,y=(k*53)%(LH-30);R(c,x,y,1,1,'rgba(190,240,250,.4)')}
  return cvs}
function pampaBG(){const [cvs,c]=mk(LW,LH);
  bands(c,0,88,['#4a86d8','#5a94de','#6ea4e4','#86b6ea','#a2c8f0','#c2dcf4']);
  for(const [x,y,sc] of [[36,18,1.2],[120,10,.8],[205,24,1],[168,34,.7]]){ell(c,x,y+3,17*sc,5*sc,'#c8dcf0');ell(c,x,y,15*sc,5*sc,'#ffffff');ell(c,x-6*sc,y-3*sc,7*sc,5*sc,'#ffffff');ell(c,x+6*sc,y-2*sc,6*sc,4*sc,'#ffffff')}
  for(let k=0;k<NK(30);k++){const px=k*9,hg=4+Math.round(Math.sin(k*1.7)*2+((k*13)%5));for(let i=0;i<hg;i++){const w=Math.max(2,10-i*2);R(c,px-w/2,88-i,w,1,i>hg-3?'#e8f0f8':'#7e94bc')}}
  R(c,0,88,LW,2,'#5a7aa8');
  for(let x=0;x<LW;x++){const y=Math.round(92+Math.sin(x*.03)*2);R(c,x,y,1,LH-y,'#c0a444');R(c,x,y,1,1,'#e8d478')}
  for(let y=96;y<LH;y+=2)for(let x=(y%7);x<LW;x+=5)if(h2(x,y,61)<.5)R(c,x,y,1,2,h2(x,y,62)<.5?'#d8bc58':'#a8883a');
  for(let k=0;k<NK(7);k++){const px=12+k*38+(k%3)*7,ph=6+(k*5)%7;for(let i=0;i<ph;i++)R(c,px+Math.round(Math.sin(i*.9+k)*1.5),118-i-k*2,1,2,'#8a6a2a');R(c,px-2,118-ph-k*2,5,2,'#6a8a3a');R(c,px-1,119-ph-k*2,3,1,'#8aa84e')}
  for(const [lx,ly] of [[52,150],[196,166]]){ell(c,lx,ly-10,5,7,'#b09a6a');ell(c,lx,ly-15,2.5,3,'#c8b283');R(c,lx-1,ly-21,2,6,'#b09a6a');ell(c,lx,ly-22,2,1.6,'#8a7448');R(c,lx-3,ly-4,2,5,'#9a845a');R(c,lx+2,ly-4,2,5,'#9a845a')}
  birds(c,[[70,30],[84,26],[96,33]]);
  return cvs}
function wariaBG(){const [cvs,c]=mk(LW,LH);
  // smoggy Santiago sky, cooler and clearer overhead
  bands(c,0,92,['#7ea6d0','#92b4d8','#a6c2de','#b8cee2','#c8d6e2','#d6dcdc','#e0dccc']);
  for(const [x,y,sc] of [[44,16,1],[150,10,.8],[214,26,.9],[300,14,1.1],[372,22,.8]]){ell(c,x,y+3,17*sc,5*sc,'#c4d4e4');ell(c,x,y,15*sc,5*sc,'#eef4fa');ell(c,x-6*sc,y-3*sc,7*sc,5*sc,'#f6f9fc');ell(c,x+6*sc,y-2*sc,6*sc,4*sc,'#f6f9fc')}
  // the cordillera: two ranges, snow caps with a lit left flank
  ridge(c,66,30,5.1,'#a3a2b4');ridge(c,72,20,2.3,'#8f8ea4');
  for(let x=0;x<LW;x+=1){const y=Math.round(66-30*(.55+.3*Math.sin(x*.022+5.1)+.2*Math.sin(x*.062+10.2)+.12*Math.sin(x*.166+15.3)));
    const yl=Math.round(66-30*(.55+.3*Math.sin((x-1)*.022+5.1)+.2*Math.sin((x-1)*.062+10.2)+.12*Math.sin((x-1)*.166+15.3)));
    if(y>50)continue;const lit=y<yl,sn=Math.round((50-y)*.45)+2;R(c,x,y,1,sn,lit?'#f6f8fc':'#ccd0de');if((x+y)&1)R(c,x,y+sn,1,1,lit?'#dfe2ec':'#b4b8c8')}
  // haze band between the range and the city
  for(let y=70;y<86;y++){c.fillStyle='rgba(222,220,206,'+(.05+(y-70)*.012).toFixed(3)+')';c.fillRect(0,y,LW,1)}
  // a block with depth: lit front, shaded right side, roof edge, dithered facade
  const block=(x,y,w,base,col,dep,far)=>{
    const sideW=far?2:5,front=col,side=shadeHex(col,.68),roof=shadeHex(col,1.18);
    for(let yy=y;yy<base;yy++)for(let xx=x;xx<x+w;xx++){const t=(yy-y)/(base-y);let k=1+(.5-(xx-x)/w)*.10-Math.max(0,t-.5)*.22;
      if(h2(xx,yy,31)<.06)k-=.05;if(((xx+yy)&1)&&t>.75)k-=.03;R(c,xx,yy,1,1,shadeHex(front,k))}
    R(c,x+w,y+2,sideW,base-y-2,side);for(let yy=y+2;yy<base;yy+=2)R(c,x+w+((yy>>1)&1),yy,1,1,shadeHex(side,.9));
    R(c,x,y,w,2,roof);R(c,x+w,y+1,sideW,1,shadeHex(roof,.8));R(c,x,y+2,w,1,shadeHex(front,.78));
    if(far){for(let yy=y+4;yy<base-2;yy+=5)for(let xx=x+2;xx<x+w-2;xx+=4)R(c,xx,yy,2,2,shadeHex(front,.72));return}
    for(let yy=y+5;yy<base-5;yy+=8)for(let xx=x+3;xx<x+w-5;xx+=7){
      const lit=h2(xx,yy,5)<.18;R(c,xx-1,yy-1,6,7,shadeHex(front,.55));
      R(c,xx,yy,4,5,lit?'#f4d474':'#8fb0c8');R(c,xx,yy,4,1,lit?'#fff2b8':'#d8eaf6');R(c,xx+2,yy+2,2,3,lit?'#d8a840':'#5e7e96');R(c,xx,yy+4,1,1,'#3a4a58');
      R(c,xx-1,yy+6,6,1,shadeHex(front,1.12));
      if(((xx>>3)+(yy>>3))%3===0){R(c,xx-2,yy+7,8,1,'#2e2c2e');for(let k=0;k<4;k++)R(c,xx-2+k*2,yy+7,1,2,'#2e2c2e')}}
    if(h2(x,y,6)<.55){const tx=x+w-10;R(c,tx,y-6,7,6,'#38424c');R(c,tx,y-6,7,1,'#5e6a76');R(c,tx,y-6,2,6,'#4c5864');R(c,tx+1,y-7,5,1,'#4c5864')}
    if(h2(x,y,7)<.5){const ax=x+4;R(c,ax,y-9,1,9,'#26262c');R(c,ax-3,y-8,7,1,'#26262c');R(c,ax-2,y-6,5,1,'#26262c')}};
  // far row (hazy, cool)
  const FARC=['#b4b6c4','#c0b4c0','#aeb8c6','#c4c0b4','#b4c4bc','#c8c2b6','#c2b0ac','#b6b2c8','#c6b8a8'],NEARC=['#b9b5b1','#c89ba2','#93b2c9','#d7c47e','#9fc3a3','#e4d7b6','#c57d63','#a8a0c8','#d9b48c'];
  for(let x=-4,i=0;x<LW;i++){const w=16+Math.floor(h2(i,3,41)*16);block(x,68+Math.floor(h2(i,4,41)*10),w,98,FARC[i%FARC.length],0,1);x+=w+2+Math.floor(h2(i,5,41)*4)}
  for(let y=66;y<98;y++){c.fillStyle='rgba(214,214,206,.10)';c.fillRect(0,y,LW,1)}
  // near row
  for(let x=0,i=0;x<LW;i++){const w=22+Math.floor(h2(i,6,43)*12);block(x,50+Math.floor(h2(i,7,43)*16),w,98,NEARC[i%NEARC.length],0,0);x+=w+6+Math.floor(h2(i,8,43)*6)}
  // the concrete wall with murals, lit top, stains, then the sidewalk and the cancha
  for(let y=96;y<106;y++)for(let x=0;x<LW;x++){let k=1-(y-96)*.02;if(h2(x,y,33)<.07)k-=.06;if(h2(x>>2,y>>1,34)<.05)k-=.08;R(c,x,y,1,1,shadeHex('#8e8e98',k))}
  R(c,0,96,LW,1,'#c2c2cc');R(c,0,105,LW,1,'#4a4a56');
  const wc=['#3870b8','#38a058','#e0a030','#c84848'];
  for(let k=0;k<Math.floor((LW-60)/36);k++){const mx=58+k*36;if(mx>LW*.45&&mx<LW*.45+30)continue;for(let y=98;y<104;y++)for(let x=mx;x<mx+24;x++)R(c,x,y,1,1,shadeHex(wc[k%4],1+(.5-(x-mx)/24)*.2-(y-98)*.03));
    R(c,mx+2,99,7,2,'#f3e9c8');R(c,mx+12,100,8,1,shadeHex(wc[k%4],.6))}
  R(c,18,97,12,8,'#e8dcbc');R(c,20,99,8,1,'#c84848');R(c,20,101,8,1,'#3870b8');R(c,200,98,18,6,'#2e2c2e');R(c,202,99,14,1,'#f0e040');R(c,204,101,9,1,'#e03c8c');
  for(let x=0;x<LW;x++){const y0=106;let k=1;if((x&15)===0)k=.86;R(c,x,y0,1,1,'#dadade');for(let y=y0+1;y<112;y++)R(c,x,y,1,1,shadeHex('#b4b4ba',k-(y-y0)*.015+((x+y)&1?.01:-.01)))}
  R(c,0,111,LW,1,'#76767e');R(c,0,112,LW,1,'#5a4c3a');
  R(c,0,113,LW,LH-113,'#b89868');
  for(let y=114;y<LH;y+=2)for(let x=(y%7);x<LW;x+=5)if(h2(x,y,71)<.5)R(c,x,y,1,2,h2(x,y,72)<.5?'#c8a878':'#9a7c50');
  for(let x=0;x<LW;x+=6)R(c,x,150,4,1,'#ece4d0');
  // lamppost with a rounded, lit pole, and a goal frame
  for(const lx of [Math.round(LW*.58),LW-24]){R(c,lx,76,3,37,'#3a3c44');R(c,lx,76,1,37,'#6a6c76');R(c,lx+2,76,1,37,'#24262c');R(c,lx-3,71,9,5,'#4a4c56');R(c,lx-3,71,9,1,'#6a6c76');R(c,lx-2,73,7,2,'#ffe9a0');ell(c,lx+1,112,5,1.5,'rgba(0,0,0,.25)')}
  for(const gx of [6,30]){R(c,gx,118,2,22,'#e8e8e8');R(c,gx+1,118,1,22,'#a8a8b0')}R(c,6,117,26,2,'#e8e8e8');R(c,6,118,26,1,'#b0b0b8');
  for(let y=120;y<140;y+=3)for(let x=8;x<30;x+=3)R(c,x,y,1,1,'#d0d0d4');ell(c,19,141,14,2,'rgba(0,0,0,.18)');
  birds(c,[[150,24],[164,20]]);
  return cvs}
function shadeHex(hex,k){const [r,g,b]=hex[0]==='#'?hexRGB(hex):hex.match(/\d+/g).map(Number);const f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return'rgb('+f(r)+','+f(g)+','+f(b)+')'}
function mossify(cvs){const c=cvs.getContext('2d'),d=c.getImageData(0,0,cvs.width,cvs.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2];if(r>g+6&&r>b){a[i]=Math.round(g*.85);a[i+1]=Math.round(r*.92+4);a[i+2]=Math.round(b*.8+r*.18)}}c.putImageData(d,0,0);return cvs}
function lushBG(cvs,area){
  const CF={
    field:{bands:[[99,107],[123,LH]],base:['#48a048','#68c058','#307c34','#58a848','#80c868','#48983c'],lite:'#64bc54',dark:'#2c7230',tuft:'#78d064',fl:['#f0e07a','#e8788a','#f8f8f8'],dap:1},
    waria:{bands:[[113,LH]],base:['#b89868','#c8a878','#9a7c50'],lite:'#d0b080',dark:'#8a6c44',tuft:null,fl:null,peb:['#8a8a90','#e8e0d0','#6a6a70'],dap:.4},
    coast:{bands:[[121,LH]],base:['#ecd498','#d8bc80','#d0b070'],lite:'#f6e2ac',dark:'#c6a868',tuft:null,fl:null,peb:['#b89868','#f8ecd0','#9a8458'],dap:.6},
    forest:{bands:[[126,LH]],base:['#2a4a24','#3a6a30','#1c3418'],lite:'#3e7232',dark:'#17301a',tuft:'#548c40',fl:['#d85858','#f0f0e0'],dap:1.3},
    mount:{bands:[[101,LH]],base:['#e6edf6','#c4d0e2','#ffffff'],lite:'#ffffff',dark:'#c2cfdf',tuft:null,fl:null,peb:['#9aa8bc','#7a8aa0'],dap:.5},
    rainforest:{bands:[[102,LH]],base:['#2a5a3a','#3a7a4e','#1c4428'],lite:'#3f8752',dark:'#1a3c24',tuft:'#55a05e',fl:['#e8b040'],dap:.9},
    pampa:{bands:[[96,LH]],base:['#c0a444','#d8bc58','#a8883a','#e8d478','#8a6a2a'],lite:'#e4cc64',dark:'#9a7c32',tuft:'#f0dc80',fl:['#e87a4a'],dap:.8}};
  const cf=CF[area];if(!cf)return;
  const c=cvs.getContext('2d');
  const id=c.getImageData(0,0,LW,LH),d=id.data;
  const bs=cf.base.map(hx=>[parseInt(hx.slice(1,3),16),parseInt(hx.slice(3,5),16),parseInt(hx.slice(5,7),16)]);
  const li=[parseInt(cf.lite.slice(1,3),16),parseInt(cf.lite.slice(3,5),16),parseInt(cf.lite.slice(5,7),16)];
  const dk=[parseInt(cf.dark.slice(1,3),16),parseInt(cf.dark.slice(3,5),16),parseInt(cf.dark.slice(5,7),16)];
  const isBase=q=>{for(const b of bs){if(Math.abs(d[q]-b[0])+Math.abs(d[q+1]-b[1])+Math.abs(d[q+2]-b[2])<54)return 1}return 0};
  // organic light/dark patches, horizontally stretched like sun-dappled meadow
  for(const [y0,y1] of cf.bands)for(let y=y0;y<y1;y++)for(let x=0;x<LW;x++){
    const q=(y*LW+x)*4;if(!isBase(q))continue;
    const v=Math.sin(x*.043+y*.15+Math.sin(y*.33)*1.5)+Math.sin(x*.013+y*.052)*1.35+(h2(x,y,31)-.5)*.9;
    if(v>1.28){d[q]=li[0];d[q+1]=li[1];d[q+2]=li[2]}
    else if(v<-1.38){d[q]=dk[0];d[q+1]=dk[1];d[q+2]=dk[2]}}
  c.putImageData(id,0,0);
  // light shafts / dapple streaks on the ground
  for(let k=0;k<6;k++){const x=20+((k*89)%(LW-40)),y=cf.bands[cf.bands.length-1][0]+10+((k*37)%(LH-cf.bands[cf.bands.length-1][0]-24));
    ell(c,x,y,26+(k%3)*14,4+(k%2)*2,'rgba(255,250,215,'+(.05*cf.dap).toFixed(3)+')');
    ell(c,x,y,17+(k%3)*9,3,'rgba(255,250,215,'+(.05*cf.dap).toFixed(3)+')')}
  for(let k=0;k<4;k++){const x=50+((k*113)%(LW-60)),y=cf.bands[cf.bands.length-1][0]+16+((k*53)%(LH-cf.bands[cf.bands.length-1][0]-30));
    ell(c,x,y,24,5,'rgba(8,24,10,'+(.08*cf.dap).toFixed(3)+')')}
  // tufts, flowers, pebbles (only on matching ground)
  const id2=c.getImageData(0,0,LW,LH),d2=id2.data;
  const ok=(x,y)=>{if(x<4||x>LW-5||y<cf.bands[0][0]||y>LH-4)return 0;const q=(y*LW+x)*4;
    for(const b of bs){if(Math.abs(d2[q]-b[0])+Math.abs(d2[q+1]-b[1])+Math.abs(d2[q+2]-b[2])<80)return 1}
    return Math.abs(d2[q]-li[0])+Math.abs(d2[q+1]-li[1])+Math.abs(d2[q+2]-dk[2])<120?1:0};
  if(cf.tuft)for(let k=0;k<NK(26);k++){const x=6+((k*97)%(LW-12)),y=cf.bands[cf.bands.length-1][0]+4+((k*61)%(LH-cf.bands[cf.bands.length-1][0]-10));
    if(!ok(x,y))continue;
    for(let i=0;i<4;i++){const off=i-1.5,hgt=3+((k+i)%3);
      for(let j=0;j<hgt;j++){const t=j/hgt;R(c,x+Math.round(off*1.6)+Math.round(off*t*t*1.6),y-j,1,1,j===hgt-1?cf.tuft:(i%2?cf.dark:cf.base[0]))}}}
  if(cf.fl)for(let k=0;k<NK(10);k++){const x=10+((k*131)%(LW-20)),y=cf.bands[cf.bands.length-1][0]+8+((k*83)%(LH-cf.bands[cf.bands.length-1][0]-14));
    if(!ok(x,y))continue;const col=cf.fl[k%cf.fl.length];
    R(c,x,y-3,1,3,'#3a6a30');R(c,x-1,y-4,3,1,col);R(c,x,y-5,1,1,col);R(c,x,y-4,1,1,'#f8e860')}
  if(cf.peb)for(let k=0;k<NK(14);k++){const x=8+((k*109)%(LW-16)),y=cf.bands[0][0]+6+((k*71)%(LH-cf.bands[0][0]-12));
    if(!ok(x,y))continue;const col=cf.peb[k%cf.peb.length];
    R(c,x,y,2,1,col);R(c,x,y-1,1,1,col)}
}
function polishBG(cvs,area){
  const c=cvs.getContext('2d'),hor=({field:96,coast:118,mount:98,crater:98,forest:122,cave:122,rainforest:100,fjord:100,pampa:92,deep:150,waria:106}[area])||106;
  const id=c.getImageData(0,0,LW,LH),d=id.data;
  // de-band the sky: checker-blend rows whose colour step is small
  for(let y=1;y<hor-1;y++)for(let x=0;x<LW;x++){
    if(!((x+y)&1))continue;
    const i=(y*LW+x)*4,j=((y+1)*LW+x)*4,df=Math.abs(d[i]-d[j])+Math.abs(d[i+1]-d[j+1])+Math.abs(d[i+2]-d[j+2]);
    if(df>5&&df<56){d[i]=d[j];d[i+1]=d[j+1];d[i+2]=d[j+2]}
  }
  // ground grain, denser toward the bottom
  for(let y=hor;y<LH;y++){const t=(y-hor)/(LH-hor);
    for(let x=0;x<LW;x++){const n=h2(x,y,99);let f=0;
      if(n<.05+t*.06)f=.87;else if(n>.975-t*.015)f=1.12;
      if(f){const i=(y*LW+x)*4;d[i]=Math.min(255,d[i]*f);d[i+1]=Math.min(255,d[i+1]*f);d[i+2]=Math.min(255,d[i+2]*f)}
    }}
  // vignette
  for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){const dx=(x-128)/128,dy=(y-100)/112,q=dx*dx*.9+dy*dy*.55;
    if(q>.55){const f=1-Math.min(.24,(q-.55)*.38),i=(y*LW+x)*4;d[i]*=f;d[i+1]*=f;d[i+2]*=f}}
  c.putImageData(id,0,0);
  // soft stage light where the fight happens
  for(const [r,a] of [[1.5,.028],[1.15,.028],[.8,.028],[.5,.028]])ell(c,120,168,118*r,54*r,'rgba(255,250,225,'+a+')');
}
function birds(c,list){for(const [x,y] of list){R(c,x-2,y,2,1,'#24304a');R(c,x+1,y,2,1,'#24304a');R(c,x,y-1,1,1,'#24304a')}}
function greyify(cvs){const c=cvs.getContext('2d'),d=c.getImageData(0,0,cvs.width,cvs.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const r0=a[i],g0=a[i+1],b0=a[i+2],l=(r0+g0+b0)/3;
    a[i]=Math.round(r0*.3+l*.62+14);a[i+1]=Math.round(g0*.3+l*.66+16);a[i+2]=Math.round(b0*.3+l*.74+22)}
  c.putImageData(d,0,0);
  c.fillStyle='rgba(150,160,175,.14)';c.fillRect(0,0,cvs.width,cvs.height);
  return cvs}
/* hand-painted backdrops (src/paintbg.js): load once, crop the middle to the current screen width */
const PBGI={};if(typeof PAINTBG!=='undefined')for(const k in PAINTBG){const im=new Image();im.src=PAINTBG[k].src;PBGI[k]=im}
const paintedBG=a=>!!(PBGI[a]&&PBGI[a].complete&&PBGI[a].naturalWidth);
function buildBG(area){
  if(paintedBG(area)){const [cv,c]=mk(LW,LH),im=PBGI[area];c.drawImage(im,Math.round((LW-im.naturalWidth)/2),0);return cv}
  if(area.startsWith&&area.startsWith('fog:'))return greyify(buildBG(area.slice(4)));
  if(area==='cave2'||area==='cave3'||area==='cave4'||area==='cave5')return buildBGraw(area);
  const cvs=buildBGraw(area);lushBG(cvs,area);polishBG(cvs,area);return cvs;
}
function buildBGraw(area){
  if(area==='cave2')return mossify(buildBG('cave'));
  if(area==='cave3')return lavify(buildBG('cave'));
  if(area==='cave4')return fogify(buildBG('cave'));
  if(area==='cave5')return dustify(buildBG('cave'));
  if(area==='pampa')return pampaBG();
  if(area==='waria')return wariaBG();
  if(area==='deep')return deepBG();
  if(area==='rainforest'||area==='fjord'){const [cvs,c]=mk(LW,LH),fj=area==='fjord';
    bands(c,0,100,fj?['#141c26','#1a2430','#222e3a','#2a3846','#344452','#3e505e']:['#5a6a78','#66788a','#728696','#8094a2','#8ea0ac','#9aaab4']);
    ridge(c,86,22,4.2,fj?'#1a2430':'#4a5e60');ridge(c,94,14,1.7,fj?'#121a22':'#2e4a3e','#4a5e60');
    if(fj){R(c,0,100,LW,LH-100,'#0e1620');for(let y=102;y<LH;y+=3)for(let x=(y%7);x<LW;x+=17)R(c,x,y,6,1,'#1e2c3a');ell(c,LW-56,30,10,10,'#c8d0d8');ell(c,LW-59,28,3,2,'#a8b0b8')}
    else{R(c,0,100,LW,LH-100,'#2a5a3a');for(let y=102;y<LH;y+=3)for(let x=(y%5);x<LW;x+=9)if(h2(x,y,8)<.4)R(c,x,y,2,1,h2(x,y,9)<.5?'#3a7a4e':'#1c4428');
      for(let k=0;k<5;k++){const tr=treeCanvas(k%3,'lawal');c.drawImage(tr,k<3?-4+k*16:LW-22-(k-3)*18,58)}
      for(const [px,py] of [[60,150],[190,160],[120,196]]){grassClump(c,px,py,9,['#2a6a3a','#3a8a4a','#64b86e'],1.5)}}
    for(let k=0;k<6;k++)ell(c,(k*53)%LW,90+(k%3)*6,40,7,fj?'rgba(160,170,180,.18)':'rgba(220,226,232,.25)');
    return cvs}
  if(area==='mount'||area==='crater'){const [cvs,c]=mk(LW,LH),cr=area==='crater';
    bands(c,0,96,cr?['#1a0606','#2a0a08','#3a100a','#4a160c','#5a1e10','#6a2814']:['#4a78c0','#5a88cc','#6c98d6','#86acdf','#a2c0e8','#c0d6f0']);
    if(!cr){for(const [x,y,s] of [[50,20,1],[170,14,.9]]){ell(c,x,y+3,17*s,5*s,'#c8dcf0');ell(c,x,y,15*s,5*s,'#ffffff');ell(c,x-6*s,y-3*s,7*s,5*s,'#ffffff')}}
    for(let i=0;i<50;i++){const w=Math.round(6+i*2.2);R(c,140-w/2,40+i,w,1,i<10?(cr?'#5a2a24':'#f8fbff'):i<13?(cr?'#4a2420':'#c8d4e8'):(cr?'#2a1414':'#6a7a98'));if(i>=10&&i%3===0&&!cr)R(c,140-w/2,40+i,Math.round(w/3),1,'#8494b0')}
    ell(c,140,38,6,3,cr?'#f86018':'#9a9aa8');
    ridge(c,86,16,1.4,cr?'#2a1010':'#7a90b8');ridge(c,92,10,3.7,cr?'#1a0a08':'#5a7a9a',cr?'#2a1010':'#7a90b8');
    if(!cr)for(let k=0;k<NK(9);k++){const px=10+k*29+(k%3)*5,ph=7+(k*5)%6;for(let i=0;i<ph;i++){const w=Math.max(1,Math.round((ph-i)*.8));R(c,px-(w>>1),96-i,w,1,'#46688c')}R(c,px,96-ph-1,1,2,'#46688c')}
    R(c,0,98,LW,LH-98,cr?'#2a1410':'#e6edf6');for(let x=0;x<LW;x++){const y=Math.round(98+Math.sin(x*.04)*3);R(c,x,y,1,3,cr?'#3a1a14':'#ffffff')}
    for(let y=104;y<LH;y+=3)for(let x=(y%6);x<LW;x+=13)if(h2(x,y,5)<.35)R(c,x,y,2,1,cr?'#4a2018':'#c4d0e2');
    if(cr){for(let y=150;y<LH;y+=2)for(let x=0;x<LW;x++)if(Math.sin(x*.05+y*.2)>.9)R(c,x,y,1,1,'#f86018')}
    else for(let k=0;k<4;k++){const tr=treeCanvas(k%3,'pewen');c.drawImage(tr,k<2?-2+k*22:LW-26-(k-2)*24,62+(k%2)*6)}
    return cvs}
  const [cvs,c]=mk(LW,LH);
  if(area==='coast'){bands(c,0,96,['#2858b8','#3a70d0','#5a90e0','#80b0ec','#a8ccf4','#c8e0f8']);
    ell(c,214,26,9,9,'#fffbe8');for(const [x,y,s] of [[46,26,1],[140,16,1.3],[234,44,.8]]){ell(c,x,y+3,17*s,5*s,'#c8dcf0');ell(c,x,y,15*s,5*s,'#ffffff');ell(c,x-6*s,y-3*s,7*s,5*s,'#ffffff');ell(c,x+6*s,y-2*s,6*s,4*s,'#ffffff')}
    ridge(c,88,22,2.2,'#7d98c8');ridge(c,92,16,5.1,'#5c7aac','#7d98c8');
    bands(c,90,118,['#4a86d4','#3a74c4','#2e62b0','#2452a0']);
    for(let x=0;x<LW;x++){const y=Math.round(116+Math.sin(x*.06)*1.5);R(c,x,y,1,LH-y,'#ecd498');if(h2(x,0,3)<.3)R(c,x,y+3+Math.floor(h2(x,1,3)*80),1,1,'#d0b070')}
    for(let y=120;y<LH;y+=3)for(let x=(y%6);x<LW;x+=17)if(h2(x,y,5)<.3)R(c,x,y,2,1,'#d8bc80');
    for(let k=0;k<5;k++){const r=rockCanvas(k%2);c.drawImage(r,k<3?2+k*14:LW-18-(k-3)*16,186+(k%3)*9)}
    birds(c,[[150,52],[166,47],[184,55],[60,60]])}
  else if(area==='field'){bands(c,0,92,['#3a78d0','#4a88d8','#5c98e0','#78acea','#98c4f0','#b8d8f4']);
    for(const [x,y,s] of [[40,22,1.1],[150,14,.9],[226,34,1]]){ell(c,x,y+3,17*s,5*s,'#c8dcf0');ell(c,x,y,15*s,5*s,'#ffffff');ell(c,x-6*s,y-3*s,7*s,5*s,'#ffffff');ell(c,x+6*s,y-2*s,6*s,4*s,'#ffffff')}
    for(let i=0;i<36;i++){const w=Math.round(4+i*1.6);R(c,186-w/2,48+i,w,1,i<9?'#f4f8ff':i<12?'#c8d4e8':'#7a8cb0');if(i>=9&&i%3===0)R(c,186-w/2,48+i,Math.round(w/3),1,'#94a6c6')}
    ridge(c,82,14,2.4,'#6a8cb8');ridge(c,88,10,4.6,'#4a7aa0','#6a8cb8');
    for(let x=0;x<LW;x++){const y=Math.round(96+Math.sin(x*.03)*4+Math.sin(x*.11)*1.5);R(c,x,y,1,LH-y,'#58a848');R(c,x,y,1,1,'#80c868')}
    for(let x=0;x<LW;x++){const y=Math.round(108+Math.sin(x*.02+2)*3);R(c,x,y,1,14,x>70&&x<190?'#d8b040':'#48983c');if(x>70&&x<190&&h2(x,1,7)<.5)R(c,x,y,1,2,'#f0d060')}
    R(c,0,122,LW,LH-122,'#48a048');for(let y=124;y<LH;y+=3)for(let x=(y%6);x<LW;x+=11)if(h2(x,y,5)<.35)R(c,x,y,1,2,h2(x,y,6)<.5?'#68c058':'#307c34');
    for(let x=6;x<LW;x+=22){R(c,x,112,2,12,'#5a3818');R(c,x+1,112,1,12,'#8a5a30')}R(c,0,115,LW,1,'#8a5a30');R(c,0,119,LW,1,'#8a5a30');
    for(let k=0;k<4;k++){const tr=treeCanvas(k%2,'koyam');c.drawImage(tr,k<2?-4+k*20:LW-28-(k-2)*22,64+(k%2)*6)}
    birds(c,[[70,36],[82,32],[92,38]])}
  else if(area==='forest'){bands(c,0,LH,['#0a1a10','#10241a','#163020','#1c3a24','#22442a']);
    for(let k=0;k<NK(9);k++){const px=k*31-6+(k%2)*6,w=10+(k*7)%8;R(c,px,0,w,140,'#2a1e14');R(c,px,0,3,140,'#3e2e20');R(c,px+w-2,0,2,140,'#160e08');for(let y=8;y<140;y+=13)R(c,px+3,y+(k%3),w-5,1,'#22180e')}
    for(let k=0;k<26;k++){const x=(k*41)%LW,y=(k*17)%40;
      ell(c,x,y+2,22,14,'#132e18');ell(c,x,y,21,13,k%2?'#1c4424':'#24522c');
      ell(c,x-7,y-5,11,6,k%2?'#275a2c':'#2f6636');ell(c,x-10,y-8,5.5,3,'#38763e');
      for(let i2=0;i2<8;i2++){const lx2=x-18+((i2*67+k*13)%36),ly2=y-10+((i2*41+k*7)%20);R(c,lx2,ly2,1,1,(i2+k)%2?'#3f8040':'#152e18')}}
    c.fillStyle='rgba(255,250,200,.07)';for(const [x0,x1] of [[70,110],[150,175]]){c.beginPath();c.moveTo(x0,0);c.lineTo(x1,0);c.lineTo(x1+40,140);c.lineTo(x0+20,140);c.closePath();c.fill()}
    R(c,0,125,LW,LH-125,'#2a4a24');for(let y=126;y<LH;y+=3)for(let x=(y%5);x<LW;x+=9)if(h2(x,y,8)<.4)R(c,x,y,2,1,h2(x,y,9)<.5?'#3a6a30':'#1c3418');
    for(const [px,py] of [[30,140],[226,150],[120,200]]){ell(c,px,py,14,4,'#1a2a14');grassClump(c,px,py+2,8,['#2a5424','#3e7a34','#6ab052'],1.6)}
    for(const [px,py] of [[50,175],[205,185]]){R(c,px,py-6,2,6,'#e8e0d0');ell(c,px+1,py-7,4,2,'#c83030');R(c,px-1,py-8,1,1,'#f8f8f8');R(c,px+2,py-7,1,1,'#f8f8f8')}}
  else if(area==='cave'){bands(c,0,LH,['#0a0605','#120c08','#1a120c','#221812','#2a1e16']);
    for(let k=0;k<NK(5);k++){const px=k*60-10;R(c,px,30,22,110,'#2a2018');R(c,px,30,4,110,'#3a2c22');R(c,px+18,30,4,110,'#140e0a')}
    for(let k=0;k<NK(18);k++){const sx=k*15+2,len=15+(k*17)%30;for(let i=0;i<len;i++){const w=Math.max(1,Math.round(8*(1-i/len)));R(c,sx+4-w/2,i,w,1,i%3?'#4a3a2c':'#5a4636')}}
    c.fillStyle='rgba(255,236,190,.10)';c.beginPath();c.moveTo(110,0);c.lineTo(150,0);c.lineTo(190,140);c.lineTo(80,140);c.closePath();c.fill();
    R(c,0,125,LW,LH-125,'#3a2c20');for(let y=125;y<LH;y+=4)for(let x=((y>>2)%2)*8;x<LW;x+=16)R(c,x,y,15,1,'#2e2218');for(let y=125;y<LH;y+=4)R(c,0,y,LW,1,'#463428');
    for(const [px,py,rx] of [[60,150,20],[200,160,28],[130,190,15]]){ell(c,px,py,rx,4,'#1c2a34');ell(c,px,py-1,rx-2,3,'#2c4458');R(c,px-rx/2,py-2,rx/2,1,'#7ab0d0')}
    for(const [px,py] of [[20,125],[235,120],[45,100],[220,90]]){ell(c,px,py,10,8,'rgba(90,230,200,.15)');for(let k=0;k<3;k++){R(c,px-4+k*3,py-6+k,2,8-k,k%2?'#7af0d8':'#3ab8a8')}}}
  else{bands(c,0,110,['#0c0820','#160e32','#22144a','#341c5c','#4c2868','#6a3474','#7a3c78']);
    for(let k=0;k<40;k++)R(c,(k*61)%LW,(k*23)%70,1,1,'#ffffff');ell(c,LW-56,40,15,15,'#f4f0d8');ell(c,LW-60,36,3,2,'#dcd6b8');ell(c,LW-51,45,2,2,'#dcd6b8');
    ridge(c,95,30,3.1,'#22184a');ridge(c,103,17,6.3,'#160f34');
    for(let k=0;k<50;k++){const rx=(k*29)%LW,h=6+(k*7)%10;R(c,rx,107-h,1,h,'#100a26')}
    bands(c,106,LH,['#24366a','#1c2c5c','#142450','#0e1c40','#0a1430','#08102c'])}
  return cvs;
}
function grassClump(c,x,y,h,cols,lean){
  const nb=h>13?6:4;
  ell(c,x,y,nb+1.5,2,cols[0]);
  for(let i=0;i<nb;i++){
    const off=i-(nb-1)/2;
    const bh=Math.max(3,Math.round(h*(0.55+0.45*(1-Math.abs(off)/(nb/2))))+((i*7)%3)-1);
    const col=i%2?cols[1]:cols[0];
    for(let j=0;j<bh;j++){const t=j/bh,dx=Math.round(off*lean*t*t*3);
      R(c,x+Math.round(off*2)+dx,y-j,1,1,j>bh-3?cols[2]:col)}
  }
}
function fgEdge(c,cols,lean){
  for(const sd of [0,1])for(let k=0;k<4;k++){
    const bx=sd?LW-8-k*13:8+k*13,hg=16-k*3+((k*7)%3);
    grassClump(c,bx,LH-1,hg,cols,sd?-lean:lean)}
}
function buildFG(area){
  if(area.startsWith&&area.startsWith('fog:'))return greyify(buildFG(area.slice(4)));
  if(area==='cave2')return mossify(buildFG('cave'));
  if(area==='cave3'||area==='crater')return lavify(buildFG('cave'));
  if(area==='cave4')return fogify(buildFG('cave'));
  if(area==='rainforest'||area==='fjord'){const [cvs,c]=mk(LW,LH);fgEdge(c,area==='fjord'?['#14242a','#22343a','#3a545c']:['#143c22','#2a7a40','#52a860'],1.4);return cvs}
  if(area==='deep'){const [cvs,c]=mk(LW,LH);for(const sd of [0,1])for(let k=0;k<8;k++){const bx=sd?LW-6-k*6:6+k*6,hg=16+((k*13)%18);for(let i=0;i<hg;i+=2){const sw=Math.sin(i*.25+k)*3;R(c,bx+sw,LH-i,3,2,k%2?'#0a4a3a':'#12604c');R(c,bx+sw,LH-i,1,2,k%2?'#1a6a52':'#2a8a6a');if(i>hg-4)R(c,bx+sw,LH-i,2,1,'#3aa87a')}}return cvs}
  if(area==='pampa'){const [cvs,c]=mk(LW,LH);fgEdge(c,['#8a6e2c','#c8a844','#eeda84'],1.6);return cvs}
  if(area==='mount'){const [cvs,c]=mk(LW,LH);for(const sd of [0,1])for(let k=0;k<12;k++){const bx=sd?LW-4-k*5:4+k*5,hg=8+((k*13)%10);for(let i=0;i<hg;i++)R(c,bx+(sd?-1:1)*Math.floor(i/5),LH-i,3,1,k%2?'#ffffff':'#d8e2f0')}return cvs}
  const [cvs,c]=mk(LW,LH);
  if(area==='coast'){fgEdge(c,['#1e5a24','#3e9444','#74c45c'],1.3)}
  else if(area==='field'){fgEdge(c,['#1e5a24','#2f7a34','#6cc258'],1.3);for(const sd of [0,1])grassClump(c,sd?LW-34:34,LH-1,9,['#8a6e2c','#c8a040','#ecd880'],sd?-1.5:1.5)}
  else if(area==='forest'){fgEdge(c,['#123618','#1c4a20','#3f8040'],1.5)}
  else if(area==='cave'){for(const [bx,w,hg] of [[0,36,56],[30,20,30],[LW-36,36,60],[LW-56,22,34]])for(let i=0;i<hg;i++){const ww=Math.round(w*(1-i/hg));R(c,bx+(w-ww)/2,LH-i,ww,1,i%3?'#3a2c22':'#4a3a2c')}}
  else{for(let k=0;k<30;k++){const sd=k<15,bx=sd?k*4:LW-(k-15)*4,hg=20+((k*17)%30);R(c,bx,LH-hg,1,hg,k%3?'#0e1a12':'#162a1a');ell(c,bx,LH-hg,1,3,'#3a2a1a')}}
  return cvs;
}
function animBG(area){const c=lx;
  if(area==='coast'){for(let k=0;k<3;k++){const x=((frame*.08*(k+1)+k*110)%(LW+80))-40,y=20+k*14;ell(c,x,y+2,14,4,'#c8dcf0');ell(c,x,y,12,4,'#ffffff');ell(c,x-5,y-2,6,4,'#ffffff');ell(c,x+5,y-1,5,3,'#ffffff')}
    for(let k=0;k<24;k++){const x=(k*47+Math.floor(frame*.35))%LW,y=92+(k*13)%22;if((frame+k*9)%40<28)R(c,x,y,4+(k%4)*2,1,'#d8ecff')}
    for(let x=0;x<LW;x+=2){const y=Math.round(115+Math.sin(x*.1+frame/18)*1.5);R(c,x,y,2,1,'#ffffff')}
    for(let i=0;i<2;i++){const bx=Math.round((frame*.3+i*130)%(LW+30)-15),by=Math.round(35+i*15+Math.sin(frame/20+i)*3),f=Math.sin(frame/6+i)>0?1:0;R(c,bx-1,by,3,1,'#f8f8f8');R(c,bx-4,by-f,3,1,'#f8f8f8');R(c,bx+2,by-f,3,1,'#f8f8f8')}}
  else if(area==='field'){for(let k=0;k<3;k++){const x=((frame*.06*(k+1)+k*100)%(LW+80))-40,y=18+k*12;ell(c,x,y+2,14,4,'#c8dcf0');ell(c,x,y,12,4,'#ffffff');ell(c,x-5,y-2,6,4,'#ffffff')}
    for(let x=72;x<190;x+=3){const y=Math.round(108+Math.sin(x*.02+2)*3);if(Math.sin(x*.2+frame/14)>.6)R(c,x,y,1,2,'#fff0a0')}
    const bx=Math.round((frame*.4)%(LW+30)-15),by=Math.round(40+Math.sin(frame/25)*4),f=Math.sin(frame/5)>0?1:0;R(c,bx-1,by,3,1,'#202020');R(c,bx-4,by-f,3,1,'#202020');R(c,bx+2,by-f,3,1,'#202020')}
  else if(area==='forest'){for(let k=0;k<14;k++){const x=Math.round(10+k*18+Math.sin(frame/35+k)*8),y=Math.round(60+Math.sin(frame/27+k*2)*30+(k%4)*16);if((frame+k*11)%50<36){R(c,x,y,1,1,awake('nagche')?'#f8f0a0':'#a0e8ff');ell(c,x,y,2,2,'rgba(200,255,160,.2)')}}
    for(let k=0;k<4;k++){const lx2=(k*67+Math.floor(frame*.2))%LW,ly2=Math.floor((k*43+frame*.35)%130);R(c,lx2,ly2,2,1,'#6aa040')}}
  else if(area==='mount'||area==='crater'){for(let k=0;k<5;k++){const ph=((frame*.4+k*30)%120)/120;ell(c,140+Math.sin(ph*6+k)*4*ph,36-ph*30,3+ph*6,(3+ph*6)*.7,area==='crater'?'rgba(80,40,30,'+(.5*(1-ph))+')':'rgba(200,200,210,'+(.5*(1-ph))+')')}
    if(area==='mount')for(let k=0;k<30;k++){const x=(k*37+Math.floor(frame*.3))%LW,y=Math.floor((k*53+frame*.6)%LH);R(c,x,y,1,1,'#ffffff')}
    else for(let k=0;k<20;k++){const x=(k*41+Math.floor(Math.sin(frame/30+k)*6))%LW,y=LH-Math.floor((k*29+frame*.5)%140);R(c,x,y,1,1,'#ffb040')}}
  else if(area==='deep'){for(let k=0;k<16;k++){const x=(k*41+Math.floor(frame*.4))%LW,y=LH-((frame*1.2+k*43)%(LH+20));c.strokeStyle='rgba(190,240,250,.4)';c.beginPath();c.arc(x+Math.sin((frame+k*20)/18)*3,y,1+(k%2),0,6.283);c.stroke()}}
  else if(area==='pampa'){for(let k=0;k<26;k++){const x=(k*37+Math.floor(frame*1.4))%LW,y=Math.floor(30+((k*53+Math.floor(frame*.7))%130)+Math.sin(frame/9+k)*4);R(c,x,y,2,1,k%3?'rgba(248,228,140,.55)':'rgba(255,250,220,.7)')}}
  else if(area==='rainforest'||area==='fjord'){for(let k=0;k<40;k++){const x=(k*29+Math.floor(frame*.6))%LW,y=Math.floor((k*47+frame*3)%LH);R(c,x,y,1,3,area==='fjord'?'rgba(180,200,220,.5)':'rgba(200,220,240,.6)')}
    for(let k=0;k<4;k++){const x=((frame*.2+k*80)%(LW+100))-50;ell(c,x,110+k*8,50,8,'rgba(220,226,232,.12)')}}
  else if(area==='cave'||area==='cave2'||area==='cave3'||area==='cave4'){for(let k=0;k<18;k++){const x=95+((k*37+Math.floor(frame*.15))%90)+Math.round(Math.sin(frame/40+k)*5),y=Math.floor((k*29+frame*.2)%140);if((frame+k)%30<22)R(c,x,y,1,1,'#ffeec8')}
    const dy=Math.floor(frame*1.5)%130;R(c,62,dy,1,3,'#9ad0f0');R(c,201,(dy+65)%130,1,3,'#9ad0f0')}
  else{for(let k=0;k<40;k++)if((frame+k*13)%50<38)R(c,(k*61)%LW,(k*23)%70,1,1,'#ffffff');
    for(let i=0;i<10;i++){const w=30-i*2;R(c,200-w/2+Math.round(Math.sin(frame/15+i)*4),112+i*7,w,1,i%2?'#f4e8c0':'#d8c8a0')}
    for(let k=0;k<10;k++){const x=Math.round(20+k*24+Math.sin(frame/30+k)*10),y=Math.round(130+Math.sin(frame/22+k*2)*15+(k%3)*10);if((frame+k*7)%40<30){R(c,x,y,1,1,'#e8ffb0');ell(c,x,y,2,2,'rgba(200,255,140,.25)')}}}
}
function drawWarpRing(c,cx,cy){
  const t=frame/14,pu=.8+.2*Math.sin(frame/9);
  for(const [r,al] of [[30,.12],[22,.15],[14,.2]])ell(c,cx,cy+3,r*pu+4,(r*pu+4)*.42,'rgba(110,205,255,'+al+')');
  const bw=12+Math.round(Math.sin(frame/7)*3);
  for(let i=0;i<5;i++){const w=bw-i*2;if(w<=0)continue;R(c,cx-(w>>1),cy-84+i*5,w,84-i*5,'rgba('+(160+i*22)+','+(222+i*8)+',255,'+(0.07+i*.025)+')')}
  R(c,cx-1,cy-84,3,84,'rgba(245,252,255,.3)');
  c.save();c.translate(cx,cy+3);
  for(const [rx,ry,lw,col,dash,sp] of [[24,10,3,'rgba(120,215,255,.85)',[10,7],1],[18,7.6,2,'rgba(220,245,255,.9)',[6,5],-1.5],[11,4.6,2,'rgba(255,255,255,.95)',[3,4],2.2]]){
    c.strokeStyle=col;c.lineWidth=lw;c.setLineDash(dash);c.lineDashOffset=frame*sp*.6;
    c.beginPath();c.ellipse(0,0,rx*pu,ry*pu,0,0,6.283);c.stroke()}
  c.setLineDash([]);c.restore();
  ell(c,cx,cy+3,5.5,2.6,'rgba(235,250,255,.95)');ell(c,cx,cy+3,3,1.4,'#ffffff');
  for(let k=0;k<14;k++){const ph=((frame*1.1+k*41)%120)/120,an=k*1.7+t*.5;
    const px2=cx+Math.cos(an)*(16-ph*7),py2=cy+2-ph*62;
    R(c,px2,py2,k%3?1:2,k%3?2:3,'rgba('+(190+k*4)+',238,255,'+((1-ph)*.9)+')')}
  for(let k=0;k<4;k++){const an=t*1.6+k*1.571,px2=cx+Math.cos(an)*21*pu,py2=cy+3+Math.sin(an)*8.6*pu;
    ell(c,px2,py2,3,3,'rgba(150,225,255,.45)');R(c,px2-1,py2-1,3,3,'rgba(220,245,255,.8)');R(c,px2,py2,1,1,'#ffffff')}
}
function renderBattle(){
  const c=lx;R(c,0,0,LW,LH,'#000');
  const sh=B.shake>0?(B.shake--%2?2:-2):0;
  c.save();c.translate(sh,0);
  const pa=B.area.replace('fog:',''),painted=!!PBGI[pa];
  if(!BG[B.area]||BG[B.area].width!==LW){const bg=buildBG(B.area);if(!painted||paintedBG(pa))BG[B.area]=bg;else{c.drawImage(bg,0,0)}}
  if(BG[B.area])c.drawImage(BG[B.area],0,0);if(painted&&paintedBG(pa)){animPainted(c,pa.split('@')[0]);if(B.area!==pa)for(let k=0;k<6;k++){const fx=((k*83+frame*.4)%(LW+120))-60;for(let d=0;d<5;d++)R(c,Math.round(fx+d*7),70+k*16+(d%2),46-d*8,2,'rgba(200,206,216,.14)')}}else animBG(B.area);
  if(B.wx)wxBattle(c,B.wx);
  if(B.grey)ngBattleGrey(c);
  {// battle grade: soft-light contrast on the backdrop, a little haze where sky meets land, so the fighters pop off it
   const ar=B.area,dark=/cave|deep|crater|fog:|waria/.test(ar);if(!painted){c.save();c.globalCompositeOperation='soft-light';
   const g=dLin(0,0,0,LH);g.addColorStop(0,dark?'rgba(80,90,130,.5)':'rgba(150,140,120,.4)');g.addColorStop(.55,'rgba(128,128,128,0)');g.addColorStop(1,'rgba(50,40,80,.5)');g.fill(c,0,0,LW,LH);
   c.globalCompositeOperation='source-over';if(!dark){const hz=dLin(0,LH*.36,0,LH*.56);hz.addColorStop(0,'rgba(235,240,255,0)');hz.addColorStop(.5,'rgba(235,240,255,.12)');hz.addColorStop(1,'rgba(235,240,255,0)');hz.fill(c,0,LH*.36,LW,LH*.2)}
   c.restore()}}
  const ngoyUp=B.en.some(e=>/^ngoyman/.test(e.t)&&!e.dead);
  if(ngoyUp){const br=.34+.07*Math.sin(frame/37);
    c.fillStyle='rgba(4,6,4,'+br.toFixed(2)+')';c.fillRect(0,0,LW,LH);
    const vg=dRad(LW/2,LH*.45,LH*.3,LW/2,LH*.45,LW*.7);
    vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,14,8,.5)');
    vg.fill(c,0,0,LW,LH)}
  if(B.intro>0)B.intro--;
  const al=B.en.filter(e=>!e.dead||e.fadeT>0),n=al.length,base=138;
  al.forEach((e,i)=>{const Tt=ET[e.t],sz=Tt.bs,cvs=enemyCanvas(e.t,sz,Math.floor(frame/12)%2);
    const bossI=al.findIndex(x=>ET[x.t].boss),others=al.filter(x=>!ET[x.t].boss),oi=others.indexOf(e);
    // enemies line up in a diagonal column on the left, all facing the hero
    let cx,bse;
    const tall=al.some(x=>!ET[x.t].boss&&ET[x.t].bs>48);
    const flyer=x=>!!ET[x.t].fly&&!ET[x.t].boss;
    const grd=al.filter(x=>!ET[x.t].boss&&!flyer(x)),fls=al.filter(flyer),gi=grd.indexOf(e),fi=fls.indexOf(e);
    if(bossI<0&&tall){cx=Math.round(8+(LW-78)*(i+1)/(n+1));bse=138}
    else if(bossI<0&&fls.length&&grd.length){ // triangle: ground stack low-left, flyers up and to the right
      if(fi>=0){cx=112+fi*Math.max(34,sz+10);bse=100}
      else{const m=Math.max(1,grd.length-1),sp=Math.min(28,Math.round(44/m));cx=40+gi*12;bse=(grd.length===1?138:112)+gi*sp}}
    else if(bossI<0&&fls.length){cx=36+fi*Math.max(34,sz+10);bse=122+(fi%2)*22} // all airborne: a V across the sky
    else if(bossI<0){const m=Math.max(1,n-1),sp=Math.min(30,Math.round(52/m));cx=(n===1?60:40)+i*14;bse=(n===1?138:104)+i*sp}
    else if(ET[e.t].boss){cx=Math.max(72,Math.round(cvs.width/2)-(e.t==='llufu3'?18:/^llufu/.test(e.t)&&cvs.width>150?4:12));bse=138}   // very wide bosses step in so their far edge stays on screen
    else if(tall){cx=Math.round(104+(oi+1)*(LW-184)/(others.length+1));bse=138}
    else if(fi>=0){cx=150+fi*Math.max(30,sz+8);bse=98}
    else{const gm=grd.length,m=Math.max(1,gm-1),sp=Math.min(26,Math.round(46/m));cx=152+gi*12;bse=(gm===1?136:108)+gi*sp}
    let y=bse-cvs.height+4+Math.round(Math.sin(frame/16+i));if(y<4)y=4+Math.round(Math.sin(frame/16+i));
    if(Tt.fly&&e.gr<=0)y-=(Tt.boss?10:26)+Math.round(Math.sin(frame/9+i)*3);
    if(B.intro>0)y+=Math.round(B.intro*1.5);
    e.px=cx;e.py=y+cvs.height/3;
    if(/^ngoyman/.test(e.t)&&!e.dead){
      ell(c,cx,bse,sz/2.1,5,'rgba(16,26,12,.5)');ell(c,cx,bse,sz/2.8,3,'rgba(32,48,20,.45)');
      for(let k=0;k<7;k++){const ph=((frame*.7+k*53)%200)/200;
        const vx=cx+Math.sin(frame/50+k*2.1)*sz*.5+Math.sin(ph*6.28+k)*6,vy=bse-2-ph*cvs.height*1.05,vr=(6+(k%3)*3)*(.6+ph*.8);
        ell(c,vx,vy,vr,vr*.55,'rgba(108,150,88,'+(.17*(1-ph)).toFixed(2)+')');
        ell(c,vx+2,vy+1,vr*.6,vr*.35,'rgba(140,184,108,'+(.11*(1-ph)).toFixed(2)+')')}
      for(let k=0;k<4;k++){R(c,Math.round(cx+Math.sin(frame/7+k*3)*sz*.4),Math.round(y+20+Math.cos(frame/9+k*2)*14),1,1,'rgba(16,24,10,.8)')}}
    ell(c,cx,bse+1,sz/1.95,4,'rgba(0,0,14,.22)');ell(c,cx,bse+1,sz/2.6,2.6,'rgba(0,0,14,.3)');
    if(e.dead){e.fadeT--;c.globalAlpha=Math.max(0,e.fadeT/20)}
    if(e.hit>0&&e.hit--%4<2)c.globalAlpha=.25;
    let ly=0,ls=1;if(e.lunge>0){e.lunge--;ly=Math.round(Math.sin(e.lunge/16*Math.PI)*10);}
    c.save();c.scale(-1,1);c.drawImage(cvs,-(cx+Math.ceil(cvs.width/2)),y+ly);c.restore();c.globalAlpha=1;
    if(e.sl>0){c.fillStyle='rgba(40,40,120,.25)';c.fillRect(cx-sz/2,y,sz,cvs.height)}
    if(!B.ngenA&&e.hit===13)B.heroA=16;
    if(!B.ngenA&&e.hit>6&&e.hit<=14){const sp=(14-e.hit)/8,cyS=y+cvs.height/2;
      c.save();c.globalCompositeOperation='lighter';c.globalAlpha=1-sp;
      c.strokeStyle='#ffffff';c.lineWidth=2.5;
      c.beginPath();c.moveTo(cx-sz*.55+sp*sz*.25,cyS-sz*.5+sp*sz*.2);c.lineTo(cx+sz*.45,cyS+sz*.42);c.stroke();
      c.strokeStyle='rgba(255,240,180,.9)';c.lineWidth=1.5;
      c.beginPath();c.moveTo(cx-sz*.5,cyS+sz*.3-sp*sz*.1);c.lineTo(cx+sz*.5-sp*sz*.2,cyS-sz*.35);c.stroke();
      for(let k2=0;k2<4;k2++)R(c,Math.round(cx+Math.cos(k2*1.7+sp*5)*sz*.4),Math.round(cyS+Math.sin(k2*2.3+sp*4)*sz*.3),2,2,'#fff8d0');
      c.restore()}
    if(!e.dead&&(e.stag||(e.hp<=0&&typeof quizPend==='function'&&quizPend(e)))){
      // staggered, waiting for the ngen's question: pulse red/orange
      const ph=Math.floor(frame/7)%2,[tcv,tg]=mk(cvs.width,cvs.height);
      tg.drawImage(cvs,0,0);tg.globalCompositeOperation='source-atop';
      tg.fillStyle=ph?'rgba(255,150,40,.55)':'rgba(255,55,25,.55)';tg.fillRect(0,0,cvs.width,cvs.height);
      c.save();c.scale(-1,1);c.drawImage(tcv,-(cx+Math.ceil(cvs.width/2)),y+ly);c.restore();
    }
    if(e.dead)return;
    if(e.seals){const cyS=y+cvs.height/2;
      if(e._sn!=null&&e.seals.length<e._sn){for(let q=0;q<3;q++)spark(cx+(q-1)*sz*.3,cyS,['#fff0a0','#b8e4ff','#ffc0e0'][e._sn%3],14);B.flash=Math.max(B.flash||0,6)}
      e._sn=e.seals.length;
      if(e.seals.length)drawWard(c,cx,cyS,sz,e.seals.length,frame,e.t);}
    if(e.sl>0)OV.push(()=>txt('z'+(frame%40<20?'Z':''),cx+sz/2-3,y+6,'#e0f0ff',16));
    const bw=Math.max(32,Math.min(76,sz*.8)),bx=Math.round(cx-bw/2),by=/^llufu/.test(e.t)?Math.max(bse+4,Math.max(4,bse-cvs.height+4)+cvs.height-1):bse+4;   // a boss taller than the stage keeps its bar below its feet
    const col=!tall&&!ET[e.t].boss&&(bossI<0?n>1:others.length>1)&&!(fi>=0&&bossI<0&&!grd.length);
    const bw2=col?28:bw,bx2=col?Math.round(cx+sz/2+6):bx,by2=col?bse-10:by;
    if(!window.FILM){R(c,bx2-1,by2-1,bw2+2,5,'#181018');R(c,bx2,by2,bw2,3,'#4a1a1f');R(c,bx2,by2,Math.max(0,Math.round(bw2*e.hp/e.max)),3,'#f07028');R(c,bx2,by2,Math.max(0,Math.round(bw2*e.hp/e.max)),1,'#ffb070');}
    if(!window.FILM){if(col)OV.push(()=>txt(e.label,bx2,by2-3,'#ffffff',e.label.length>11?9:12,'left'));else OV.push(()=>txt(e.label,cx,by2+13,'#ffffff',13,'center'))}
    const tg=B.cursor==='all'||B.cursor===B.en.indexOf(e);
    if(tg&&frame%20<15){const ay=y-8+Math.round(Math.sin(frame/5)*2);for(let k=0;k<5;k++){R(c,cx-5+k,ay+k,11-k*2,1,'#ffe040');R(c,cx-6+k,ay+k,1,1,'#181018');R(c,cx+5-k,ay+k,1,1,'#181018')}R(c,cx-6,ay-1,13,1,'#181018')}
  });
  if(!B.ngenA){
    const hsc=2,hb=0;   // feet stay planted (no idle bob)
    let hx=LW-52,hfr=0;
    if(B.heroA>0){B.heroA--;const ph=Math.sin((16-B.heroA)/16*Math.PI);hx-=Math.round(ph*16);hfr=Math.floor(frame/5)%4}
    if(B.intro>0)hx+=Math.round(B.intro*1.2);
    const hurt=B.red>0;
    if(!(hurt&&frame%6<3)){
      const hcv=ctCharSpriteBig(heroLook(),'left',hfr);
      const hw=hcv.width*hsc/2,hh=hcv.height*hsc/2;
      ell(c,hx+hw/2,138,hw*.46,3.2,'rgba(0,0,14,.38)');ell(c,hx+hw/2,138,hw*.3,2,'rgba(0,0,14,.25)');
      c.save();if(hurt){c.translate(hx+2,0)}
      c.drawImage(hcv,0,0,hcv.width,hcv.height,hx,Math.round(138+hb-hh),hw,hh);
      c.restore();
      if(B.heroA>10){c.save();c.globalCompositeOperation='lighter';
        c.strokeStyle='rgba(255,250,210,'+((B.heroA-10)/6*.8).toFixed(2)+')';c.lineWidth=2;
        c.beginPath();c.arc(hx-4,132+hb,10,Math.PI-0.9,Math.PI+1.2);c.stroke();c.restore()}
    }
  }
  if(typeof kyDrawPartner==='function'&&!B.ngenA)kyDrawPartner(c);
  if(!(PBGI[B.area.replace('fog:','')]&&paintedBG(B.area.replace('fog:','')))){if(!FG[B.area])FG[B.area]=buildFG(B.area);c.drawImage(FG[B.area],0,0)}
  c.restore();
  for(const p of B.parts){p.t--;p.x+=p.vx;p.y+=p.vy;p.vy+=.06;R(c,p.x,p.y,p.t>15?2:1,p.t>15?2:1,p.col)}B.parts=B.parts.filter(p=>p.t>0);
  if(!B.en.some(e=>/^ngoyman/.test(e.t)&&!e.dead)&&!/^(waria|feria|blocks)/.test(B.area))dayTint(c);   // the city backdrops already carry their hour
  else if(/@night$/.test(B.area)){c.fillStyle='rgba(14,18,48,.16)';c.fillRect(0,0,LW,LH)}   // ...but the fighters still stand in the dark
  if(B.wipe>0&&B.snap){B.wipe--;
    const k=1-(B.wipe/22),rr=k*k*Math.max(LW,LH)*0.85;
    c.save();
    c.beginPath();c.rect(0,0,LW,LH);c.ellipse(LW/2,LH/2,Math.max(.01,rr),Math.max(.01,rr*.78),0,0,6.283);
    c.clip('evenodd');
    c.translate(LW/2,LH/2);c.rotate(k*.22);c.scale(1+k*.3,1+k*.3);c.translate(-LW/2,-LH/2);
    c.drawImage(B.snap,0,0);
    c.restore();
    c.strokeStyle='rgba(255,255,255,'+(.5*(1-k)).toFixed(2)+')';c.lineWidth=3;
    c.beginPath();c.ellipse(LW/2,LH/2,Math.max(.01,rr),Math.max(.01,rr*.78),0,0,6.283);c.stroke();c.lineWidth=1;
    if(B.wipe<=0)B.snap=null}
  if(!window.FILM){   // FILM: the credits recorder hides the HUD
  // hero panel (LttP-style box)
  const hrows=Math.ceil(Math.min(40,Math.ceil(maxHP()/HPQ))/8);
  const pw=100,ph=Math.max(32,hrows*8+18),px=LW-pw-4,py=4; // compact, top-right above the hero; grows with the heart rows
  R(c,px-1,py-1,pw+2,ph+2,'#000');ctWin(c,px,py,pw,ph);
  {const sp=S.sp||0;R(c,px+pw-10,py+4,6,ph-8,'#f8f8f8');R(c,px+pw-9,py+5,4,ph-10,'#000');const fh=Math.round((ph-10)*sp/SPMAX);if(fh)R(c,px+pw-9,py+ph-5-fh,4,fh,'#30c030');}
  R(c,px+3,py+3,21,21,'#e8ecf8');{const pt=typeof portraitFor==='function'&&S.name?portraitFor({who:S.name}):null;if(pt)c.drawImage(pt,0,0,44,40,px+4,py+4,19,19);else c.drawImage(ctCharSprite(heroLook(),'down',0),0,1,18,18,px+4,py+4,19,19)}if(0){}else c.drawImage(charSprite(heroLook(),'down',0),0,0,16,14,px+3,py+3,20,17.5);
  const mx=maxHP(),hearts=Math.min(40,Math.ceil(mx/HPQ));let hp=Math.max(0,S.hp);
  for(let i=0;i<hearts;i++){const q=Math.max(0,Math.min(4,hp-i*HPQ)),col=i%8,row=Math.floor(i/8);drawHeart(c,px+26+col*8,py+13+row*8,q)}
  OV.push(()=>{txt(S.name,px+26,py+10,'#ffffff',11);txt(Math.max(0,S.hp)+'/'+mx,px+pw-13,py+10,'#c8d0ff',10,'right')});
  if(S.hp/mx<=.25&&frame%30<15){R(c,px,py,pw,1,'#ff4040');R(c,px,py+ph-1,pw,1,'#ff4040')}
  }
  B.pops=B.pops.filter(p=>p.t>0);for(const p of B.pops){p.t--;const pp=p;OV.push(()=>txt(pp.txt,pp.x,pp.y-(50-pp.t)*.45,pp.col,20,'center'))}
  if(B.flash>0){c.fillStyle='rgba(255,255,255,'+(B.flash/16)+')';c.fillRect(0,0,LW,LH);B.flash--}
  if(B.red>0){c.fillStyle='rgba(255,0,0,'+(B.red/30)+')';c.fillRect(0,0,LW,LH);B.red--}
  if(B.ngenA&&!B.ngenA.done&&B.ngenA.kind==='final'){const A=B.ngenA;A.t++;
    const NG=[[undefined,'120,220,255'],['mawida','120,255,150'],['pewen','255,200,110'],['kuruf','225,240,255'],['lelfun','255,230,120']];
    if(S.flags.epu_won)NG.push(['epunamun','255,48,40']);   // the Epunamun joins the five ngen, with red fire
    const SEG=68,T0=24,e=A.e,NS=NG.length;
    const seg=Math.floor((A.t-T0)/SEG),st=(A.t-T0)%SEG;
    const dark=Math.min(1,A.t/30),SH=T0+SEG*NS;
    c.fillStyle='rgba(0,0,14,'+(.55*dark*(A.t>SH+55?Math.max(0,(SH+85-A.t)/30):1)).toFixed(2)+')';c.fillRect(0,0,LW,LH);
    const bx=e.px||72,by=e.py||100;
    if(A.t>=T0&&seg<NS){
      const vr=NG[seg][0],col=NG[seg][1],epu=vr==='epunamun';
      const nx=Math.round(LW*.68),ny=170;
      const ap=Math.min(1,st/14),strike=st>=26&&st<50;
      if(st===1)sfx('cast');
      if(st===18)sfx('charge');
      if(st===26){B.shake=12;e.hit=26;sfx('beam')}
      if(st===40)B.shake=8;
      const rise=Math.round((1-ap)*40);
      c.save();c.beginPath();c.rect(0,0,LW,ny+9);c.clip();
      c.globalAlpha=ap*(st>58?Math.max(0,(SEG-st)/10):1);
      c.translate(nx,ny+rise);const s2=1.08+ap*.3+(strike?.1:0);c.scale(s2,s2);
      if(epu){const ec=enemyCanvas('epunamun',ET.epunamun.bs,Math.floor(frame/16)%2);ell(c,0,4,ec.width*.38,4,'rgba(255,60,40,.25)');c.drawImage(ec,-Math.round(ec.width/2),-ec.height+6)}
      else drawNgen(c,0,0,1,frame,vr);c.restore();c.globalAlpha=1;
      {const eh=epu?enemyCanvas('epunamun',ET.epunamun.bs,0).height:0;
       const eyY=epu?ny+rise+(6-eh*.80)*s2:ny+rise-80*s2,mY=epu?ny+rise+(6-eh*.70)*s2:ny+rise-71*s2,ex1=nx-3*s2,ex2=nx+3*s2;
       if(st>=18&&st<26){const gl=(st-18)/8;  // the eyes kindle before the blast
         ell(c,ex1,eyY,1.5+gl*1.5,1.5+gl*1.5,'rgba('+col+','+(.9*gl).toFixed(2)+')');
         ell(c,ex2,eyY,1.5+gl*1.5,1.5+gl*1.5,'rgba('+col+','+(.9*gl).toFixed(2)+')')}
       if(strike){const t2=Math.min(1,(st-26)/20);
        c.save();c.globalCompositeOperation='lighter';
        for(const [gx,gy,lw] of [[ex1,eyY,5],[ex2,eyY,5],[nx,mY,9]]){
          const grad=c.createLinearGradient(gx,gy,bx,by);
          grad.addColorStop(0,'rgba('+col+',.95)');grad.addColorStop(1,'rgba('+col+',.25)');
          const wob=1+Math.sin(frame/2+gx)*.18;c.strokeStyle=grad;c.lineWidth=Math.max(2.5,lw*(1-t2*.45))*wob;c.beginPath();c.moveTo(gx,gy);c.lineTo(bx,by);c.stroke()}
        c.lineWidth=2;c.strokeStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(nx,mY);c.lineTo(bx,by);c.stroke();
        ell(c,ex1,eyY,2.5,2.5,'rgba(255,255,255,.9)');ell(c,ex2,eyY,2.5,2.5,'rgba(255,255,255,.9)');
        for(let k=0;k<7;k++){const a=k/7*6.283+st;ell(c,bx+Math.cos(a)*(st-26)*2.2,by+Math.sin(a)*(st-26)*1.5,2,2,'rgba('+col+','+(1-t2).toFixed(2)+')')}
        c.restore()}}
      if(st>=26&&st<58){c.strokeStyle='rgba('+col+','+((58-st)/32*.7).toFixed(2)+')';c.lineWidth=2;
        c.beginPath();c.ellipse(bx,by,(st-26)*2.2,(st-26)*1.2,0,0,6.283);c.stroke();c.lineWidth=1}
    }
    if(A.t>=SH){
      if(!A.shards){A.shards=[];e.dead=true;e.fadeT=0;B.flash=14;B.shake=22;sfx('shatter');
        const cvs=enemyCanvas(e.t,ET[e.t].bs,0),topy=by-Math.round(cvs.height/3);
        try{const tc2=document.createElement('canvas');tc2.width=cvs.width;tc2.height=cvs.height;
          const tg2=tc2.getContext('2d');tg2.drawImage(cvs,0,0);
          const d=tg2.getImageData(0,0,tc2.width,tc2.height).data;
          for(let k=0;k<140;k++){const sx2=rnd(tc2.width),sy2=rnd(tc2.height),i4=(sy2*tc2.width+sx2)*4;
            if(d[i4+3]<60)continue;
            const a=Math.random()*6.283,sp=.8+Math.random()*2.8;
            A.shards.push({x:bx+Math.round(tc2.width/2)-sx2,y:topy+sy2,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.6,col:'rgb('+d[i4]+','+d[i4+1]+','+d[i4+2]+')',sz:1+rnd(2)})}
        }catch(err){}
        if(!A.shards.length)for(let k=0;k<48;k++){const a=Math.random()*6.283,sp=1+Math.random()*2.6;
          A.shards.push({x:bx,y:by,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.6,col:'#cfd8e8',sz:2})}}
      const sf=Math.max(0,1-(A.t-SH)/70);
      for(const sh2 of A.shards){sh2.x+=sh2.vx;sh2.y+=sh2.vy;sh2.vy+=.07;
        c.globalAlpha=sf;R(c,Math.round(sh2.x),Math.round(sh2.y),sh2.sz,sh2.sz,sh2.col)}
      c.globalAlpha=1;
      if(A.t-SH<24){c.strokeStyle='rgba(235,245,255,'+((24-(A.t-SH))/24*.8).toFixed(2)+')';c.lineWidth=3;
        c.beginPath();c.ellipse(bx,by,(A.t-SH)*4,(A.t-SH)*2.4,0,0,6.283);c.stroke();c.lineWidth=1}
    }
    if(A.t>SH+85){A.done=1;victory()}
  }
  else if(B.ngenA&&!B.ngenA.done){const A=B.ngenA;A.t++;
    const SS=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
    const p=SS(A.t/50),SH=96;
    const col=({mawida:'120,255,150',pewen:'255,200,110',kuruf:'225,240,255',lelfun:'255,230,120'})[A.v]||'120,220,255';
    if(A.t===2)B.shake=10;
    const fadeOut=A.t>152?Math.max(0,(177-A.t)/25):1;
    c.fillStyle='rgba(0,0,12,'+(.5*p*fadeOut).toFixed(2)+')';c.fillRect(0,0,LW,LH);
    const nx=Math.round(LW*.62),ny=168;
    c.save();c.globalAlpha=.26*p*fadeOut;c.globalCompositeOperation='lighter';
    for(let k=0;k<9;k++){const a=k/9*6.283+frame/60;c.beginPath();c.moveTo(nx,ny-44);
      c.lineTo(nx+Math.cos(a)*LW,ny-44+Math.sin(a)*LW);c.lineTo(nx+Math.cos(a+.09)*LW,ny-44+Math.sin(a+.09)*LW);
      c.closePath();c.fillStyle='rgba(190,255,220,.5)';c.fill()}
    c.restore();
    // the ngen climbs out of the earth: clipped at the ground line, dust at its feet
    const strike=A.t>=62&&A.t<94;
    const rise=Math.round((1-p)*58);
    const breathe=1+Math.sin(frame/11)*.015;
    const sc=(0.92+p*.6+Math.sin(Math.min(1,A.t/50)*3.14)*.05)*breathe+(strike?.08:0);
    c.save();c.beginPath();c.rect(0,0,LW,ny+9);c.clip();
    c.globalAlpha=Math.min(1,p*1.4);c.translate(nx,ny+rise);c.scale(sc,sc);
    drawNgen(c,0,0,1,frame,A.v==='lafken'?undefined:A.v);
    c.restore();c.globalAlpha=1;
    if(p<1)for(let k=0;k<7;k++){const ph=((frame*2+k*31)%60)/60;
      ell(c,nx-20+k*7+Math.sin(k*5)*3,ny+6-ph*9,2.5*(1-ph)+1,1.5,'rgba(120,100,80,'+(.5*(1-ph)).toFixed(2)+')')}
    const e=A.e,Tt=ET[e.t],cvs=enemyCanvas(e.t,Tt.bs,Math.floor(frame/12)%2);
    const bx=e.px||72,by=e.py||100;
    // eyes kindle, then the ngen strikes with beams from eyes and mouth
    const eyY=ny+rise-80*sc,mY=ny+rise-71*sc,ex1=nx-3*sc,ex2=nx+3*sc;
    if(A.t===52)sfx('charge');
    if(A.t===62){B.shake=12;e.hit=26;sfx('beam')}
    if(A.t===78)B.shake=8;
    if(A.t>=52&&A.t<62){const gl=(A.t-52)/10;
      ell(c,ex1,eyY,1.5+gl*1.5,1.5+gl*1.5,'rgba('+col+','+(.9*gl).toFixed(2)+')');
      ell(c,ex2,eyY,1.5+gl*1.5,1.5+gl*1.5,'rgba('+col+','+(.9*gl).toFixed(2)+')')}
    if(strike){const t2=Math.min(1,(A.t-62)/20);
      c.save();c.globalCompositeOperation='lighter';
      for(const [gx,gy,lw] of [[ex1,eyY,5],[ex2,eyY,5],[nx,mY,9]]){
        const grad=c.createLinearGradient(gx,gy,bx,by);
        grad.addColorStop(0,'rgba('+col+',.95)');grad.addColorStop(1,'rgba('+col+',.25)');
        const wob=1+Math.sin(frame/2+gx)*.18;c.strokeStyle=grad;c.lineWidth=Math.max(2.5,lw*(1-t2*.45))*wob;c.beginPath();c.moveTo(gx,gy);c.lineTo(bx,by);c.stroke()}
      c.lineWidth=2;c.strokeStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(nx,mY);c.lineTo(bx,by);c.stroke();
      ell(c,ex1,eyY,2.5,2.5,'rgba(255,255,255,.9)');ell(c,ex2,eyY,2.5,2.5,'rgba(255,255,255,.9)');
      for(let k=0;k<7;k++){const a=k/7*6.283+A.t;ell(c,bx+Math.cos(a)*(A.t-62)*2.2,by+Math.sin(a)*(A.t-62)*1.5,2,2,'rgba('+col+','+(1-t2).toFixed(2)+')')}
      c.restore()}
    if(A.t>=62&&A.t<94){c.strokeStyle='rgba('+col+','+((94-A.t)/32*.7).toFixed(2)+')';c.lineWidth=2;
      c.beginPath();c.ellipse(bx,by,(A.t-62)*2.2,(A.t-62)*1.2,0,0,6.283);c.stroke();c.lineWidth=1}
    // the wekufü shatters
    if(A.t>=SH){
      if(!A.shards){A.shards=[];e.dead=true;e.fadeT=0;B.flash=14;B.shake=22;sfx('shatter');
        const topy=by-Math.round(cvs.height/3);
        try{const tc2=document.createElement('canvas');tc2.width=cvs.width;tc2.height=cvs.height;
          const tg2=tc2.getContext('2d');tg2.drawImage(cvs,0,0);
          const d=tg2.getImageData(0,0,tc2.width,tc2.height).data;
          for(let k=0;k<120;k++){const sx2=rnd(tc2.width),sy2=rnd(tc2.height),i4=(sy2*tc2.width+sx2)*4;
            if(d[i4+3]<60)continue;
            const a=Math.random()*6.283,sp=.8+Math.random()*2.6;
            A.shards.push({x:bx+Math.round(tc2.width/2)-sx2,y:topy+sy2,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,col:'rgb('+d[i4]+','+d[i4+1]+','+d[i4+2]+')',sz:1+rnd(2)})}
        }catch(err){}
        if(!A.shards.length)for(let k=0;k<48;k++){const a=Math.random()*6.283,sp=1+Math.random()*2.4;
          A.shards.push({x:bx,y:by,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,col:'#cfd8e8',sz:2})}}
      const sf=Math.max(0,1-(A.t-SH)/64);
      for(const sh2 of A.shards){sh2.x+=sh2.vx;sh2.y+=sh2.vy;sh2.vy+=.07;
        c.globalAlpha=sf;R(c,Math.round(sh2.x),Math.round(sh2.y),sh2.sz,sh2.sz,sh2.col)}
      c.globalAlpha=1;
      if(A.t-SH<22){c.strokeStyle='rgba(235,245,255,'+((22-(A.t-SH))/22*.8).toFixed(2)+')';c.lineWidth=3;
        c.beginPath();c.ellipse(bx,by,(A.t-SH)*4,(A.t-SH)*2.4,0,0,6.283);c.stroke();c.lineWidth=1}
    }
    if(A.t>176){A.done=1;victory()}
  }
}
/* fixed 60 Hz timestep: game speed is the same at any frame rate.
   A slow phone catches up (up to 4 updates per paint, so it gets choppy,
   not slow); a 120 Hz screen paints twice per update instead of running
   the game at double speed. */
let _lt=0,_acc=0;
function loop(ts){requestAnimationFrame(loop);try{loopBody(ts)}catch(e){console.error(e)}}
function loopBody(ts){
  const now=ts||performance.now();
  if(!_lt)_lt=now;
  _acc+=Math.min(100,now-_lt);_lt=now;
  let steps=0;
  while(_acc>=1000/60&&steps<4){_acc-=1000/60;steps++;
    frame++;
    if(mode==='map'&&M)updateMap();
    else if(mode==='palin'&&PG)updatePalin();
  }
  if(!steps)return;
  OV=[];
  if(mode==='map'&&M)renderMap();
  else if(mode==='battle'&&B){renderBattle();if(B.lanScene){OV=[];drawLanScene(lx,B.lanScene)}}
  else if(mode==='palin'&&PG)renderPalin(lx);
  else if(mode==='cut')renderCut();
  else if(mode==='title'){paintLand(lx,frame,false);if(typeof titleKimche==='function')titleKimche(lx,frame)}
  if(mode==='map'&&M){dayTint(lx);if(M.urban&&typeof urbanNight==='function')urbanNight(lx,CAM.x,CAM.y)}
  if(fade>0&&mode==='map'){lx.fillStyle='rgba(0,0,0,'+(fade/16)+')';lx.fillRect(0,0,LW,LH);fade=Math.max(0,fade-steps)}
  present();
  for(const f of OV)f();
}


/* ---------- boss light barrier: a layered ward of stolen light, one shell per seal ---------- */
const WARD_COL=[[255,226,120],[150,214,255],[255,160,214],[190,255,200]];
const WARD_GLYPH=[[0x04,0x0e,0x1f,0x0e,0x04],[0x11,0x0a,0x04,0x0a,0x11],[0x1f,0x11,0x15,0x11,0x1f],[0x04,0x15,0x1f,0x15,0x04],[0x0e,0x11,0x15,0x11,0x0e],[0x1b,0x0a,0x04,0x0a,0x1b]];
function drawWard(c,cx,cy,sz,n,frame,seed){
  const RX0=sz*.6,RY0=sz*.36;
  for(let k=n-1;k>=0;k--){
    const [r,g,b]=WARD_COL[k%WARD_COL.length],rx=RX0+k*7,ry=RY0+k*5,pulse=.5+.5*Math.sin(frame/14+k*1.9);
    c.save();
    // soft dome body
    c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,6.283);c.clip();
    const gr=c.createRadialGradient(cx,cy-ry*.35,ry*.1,cx,cy,rx);
    const fa=sz>=100?.3:1;   // big bosses keep their own dark painting; the shell reads from its rim and runes
    gr.addColorStop(0,'rgba('+r+','+g+','+b+','+(.01+.015*pulse)*fa+')');gr.addColorStop(.72,'rgba('+r+','+g+','+b+','+(.035+.03*pulse)*fa+')');gr.addColorStop(1,'rgba('+r+','+g+','+b+','+(.1+.05*pulse)*fa+')');
    c.fillStyle=gr;c.fillRect(cx-rx,cy-ry,rx*2,ry*2);
    // drifting hex lattice of light
    if(k===0){c.globalAlpha=(.045+.035*pulse)*(sz>=100?.5:1);c.fillStyle='rgb('+r+','+g+','+b+')';const hs=9,off=(frame*.25)%(hs*2);
      for(let yy=-ry-hs;yy<ry+hs;yy+=hs*.87)for(let xx=-rx-hs*2;xx<rx+hs*2;xx+=hs*1.5){const row=Math.round((yy+ry)/(hs*.87));const px=Math.round(cx+xx+(row%2?hs*.75:0)+off-hs),py=Math.round(cy+yy);
        c.fillRect(px,py,4,1);c.fillRect(px-1,py+1,1,3);c.fillRect(px+4,py+1,1,3);c.fillRect(px,py+4,4,1)}
      c.globalAlpha=1}
    // refraction sweep
    const sw=((frame*1.6+k*40)%(rx*4))-rx*1.5;c.globalAlpha=sz>=100?.12:.22;c.fillStyle='#ffffff';
    for(let d=0;d<6;d++)c.fillRect(Math.round(cx+sw+d-(d>2?1:0)),cy-ry,1+(d>1&&d<4?1:0),ry*2);
    c.globalAlpha=1;c.restore();
    // crisp pixel rim with a travelling highlight
    const steps=Math.round((rx+ry)*2.2),hl=(frame/40+k*.33)%1;
    for(let q=0;q<steps;q++){const a=q/steps*6.283,px=Math.round(cx+Math.cos(a)*rx),py=Math.round(cy+Math.sin(a)*ry);
      const dh=Math.abs(((q/steps-hl+1.5)%1)-.5),bright=dh<.06?1:dh<.14?.6:.28;
      const back=Math.sin(a)<0;   // far side of the shell is dimmer
      c.fillStyle='rgba('+Math.min(255,r+60*bright)+','+Math.min(255,g+60*bright)+','+Math.min(255,b+60*bright)+','+((back?.45:.85)*(.55+.45*bright))+')';
      c.fillRect(px,py,1,1);if(!back&&q%2===0)c.fillRect(px,py+1,1,1)}
    // orbiting rune glyphs (woven motifs), one ring per shell
    const ng=6+k*2,sp=(k%2?-1:1)*frame/(90+k*30);
    for(let q=0;q<ng;q++){const a=q/ng*6.283+sp,gx=Math.round(cx+Math.cos(a)*rx)-2,gy=Math.round(cy+Math.sin(a)*ry)-2,G=WARD_GLYPH[(q+k)%WARD_GLYPH.length],fr=Math.sin(a)<0?.5:1;
      c.fillStyle='rgba('+r+','+g+','+b+','+(.18*fr)+')';c.fillRect(gx-1,gy,7,5);c.fillRect(gx,gy-1,5,7);
      for(let yy=0;yy<5;yy++)for(let xx=0;xx<5;xx++)if(G[yy]>>(4-xx)&1){c.fillStyle='rgba(30,16,50,'+(.55*fr)+')';c.fillRect(gx+xx+1,gy+yy+1,1,1);c.fillStyle=(xx+yy+(frame>>3))%5===0?'rgba(255,255,255,'+fr+')':'rgba('+r+','+g+','+b+','+fr+')';c.fillRect(gx+xx,gy+yy,1,1)}}
  }
  // motes of light climbing the ward
  for(let q=0;q<8;q++){const t=(frame*.7+q*37)%90,a=q*.785+frame/120,px=Math.round(cx+Math.cos(a)*RX0*.9),py=Math.round(cy+RY0*.8-t*.9);
    if(t<80){c.fillStyle=q%2?'#fff6c8':'#ffffff';c.fillRect(px,py,1,1);if(t%20<10)c.fillRect(px,py-1,1,1)}}
}

/* ---------- atmosphere pass (overworld): light shafts, weather by region, and a gentle colour grade ---------- */
function atmos(c){
  const indoor=M.interior||M.dungeon||/^cave/.test(M.bg)||M.under,urban=M.region==='santiago';
  const gloom=!!(M.fog&&!S.flags.won);
  const ox=CAM.x,oy=CAM.y,W=LW,H=VH;
  wxTick();const wx=wxNow();
  c.save();
  // 1. sun shafts through open sky (they drift slowly; none indoors or in the fog)
  if(!indoor&&!gloom&&!urban&&M.bg!=='fjord'&&(!wx||wx==='antu')){
    c.globalCompositeOperation='lighter';
    for(let k=0;k<4;k++){const bx=((k*97-ox*.3+frame*.05)%(W+140)+W+140)%(W+140)-70,w=18+(k%3)*10,al=.035+.02*Math.sin(frame/70+k*2);
      const g=dLin(0,VY,0,VY+H);g.addColorStop(0,'rgba(255,240,190,'+(Math.round(al*1.6*40)/40)+')');g.addColorStop(1,'rgba(255,240,190,0)');
      c.save();c.beginPath();c.moveTo(Math.round(bx),VY);c.lineTo(Math.round(bx+w),VY);c.lineTo(Math.round(bx+w-60),VY+H);c.lineTo(Math.round(bx-60-w*.4),VY+H);c.closePath();c.clip();g.fill(c,0,VY,W,H);c.restore()}
    c.globalCompositeOperation='source-over'}
  // 2. weather and drifting life
  const P=(n,fn)=>{for(let k=0;k<n;k++)fn(k,((k*9301+49297)%233280)/233280)};
  const wrapX=x=>((x%W)+W)%W,wrapY=y=>((y%H)+H)%H;
  if(wx&&wx!=='antu'&&wx!=='tromu'){drawWxMap(c,wx,ox,oy,W,H)}
  else if(indoor){ // dust motes turning in the still air
    P(M.interior?10:14,(k,r)=>{const x=wrapX(r*W*3+Math.sin(frame/80+k)*10-ox*.5),y=VY+wrapY(k*37+Math.sin(frame/60+k*2)*8-frame*.06*(1+r)-oy*.5);
      c.fillStyle='rgba(255,240,210,'+(.18+.18*Math.sin(frame/25+k))+')';c.fillRect(Math.round(x),Math.round(y),1,1)})}
  else if(urban){ // smog high up, scraps of paper skittering on the wind
    const g=dLin(0,VY,0,VY+H*.6);g.addColorStop(0,'rgba(150,130,120,.22)');g.addColorStop(1,'rgba(150,130,120,0)');g.fill(c,0,VY,W,H*.6);
    P(5,(k,r)=>{const x=wrapX(r*W*4+frame*(.5+r)-ox),y=VY+wrapY(k*53+Math.sin(frame/12+k)*6-oy*.8);c.fillStyle=k%2?'#e8e4da':'#c8c2b4';c.fillRect(Math.round(x),Math.round(y),2,1);if((frame+k*7)%20<10)c.fillRect(Math.round(x)+1,Math.round(y)-1,1,1)})}
  else if(gloom){ // ash of the forgetting, drifting up
    P(22,(k,r)=>{const x=wrapX(r*W*5+Math.sin(frame/40+k)*12-ox),y=VY+wrapY(H-((frame*.25*(1+r))+k*29)-oy);c.fillStyle='rgba(200,204,214,'+(.25+.2*r)+')';c.fillRect(Math.round(x),Math.round(y),1,1)})}
  else if(M.bg==='mount'){ // light snow in the high country
    P(34,(k,r)=>{const x=wrapX(r*W*7+Math.sin(frame/50+k)*14-ox),y=VY+wrapY(frame*(.35+r*.4)+k*31-oy);c.fillStyle='rgba(90,110,150,.45)';c.fillRect(Math.round(x)+1,Math.round(y)+1,1,1);c.fillStyle=r>.6?'#ffffff':'rgba(240,246,255,.85)';c.fillRect(Math.round(x),Math.round(y),r>.8?2:1,r>.8?2:1)})}
  else if(M.bg==='rainforest'||M.bg==='fjord'){ // drizzle and the odd falling leaf
    c.fillStyle='rgba(200,220,240,.28)';P(30,(k,r)=>{const x=wrapX(r*W*9-frame*.6-ox),y=VY+wrapY(frame*3+k*47-oy);c.fillRect(Math.round(x),Math.round(y),1,3)});
    P(4,(k,r)=>{const t=frame*.4+k*60,x=wrapX(r*W*3+Math.sin(t/20)*14-ox),y=VY+wrapY(t-oy);c.fillStyle=k%2?'#c88a30':'#6aa040';c.fillRect(Math.round(x),Math.round(y),2,1)})}
  else if(M.bg==='pampa'){ // wind-blown dust and grass seed
    P(26,(k,r)=>{const x=wrapX(frame*(1+r*1.4)+r*W*6-ox),y=VY+wrapY(k*23+Math.sin(frame/9+k)*3-oy*.9);c.fillStyle=k%3?'rgba(240,220,150,.5)':'rgba(255,250,224,.65)';c.fillRect(Math.round(x),Math.round(y),2,1)})}
  else{ // fields and coast: pollen, and a couple of butterflies
    P(16,(k,r)=>{const x=wrapX(r*W*5+Math.sin(frame/45+k)*16+frame*.12-ox),y=VY+wrapY(k*41+Math.sin(frame/33+k*2)*10-oy);if((frame+k*13)%60<46){c.fillStyle=M.bg==='coast'?'rgba(240,250,255,.7)':'rgba(255,248,180,.75)';c.fillRect(Math.round(x),Math.round(y),1,1)}});
    if(M.bg==='field')P(2,(k,r)=>{const t=frame*.5+k*200,x=wrapX(r*W*2+t*.6+Math.sin(t/13)*20-ox),y=VY+wrapY(40+k*70+Math.sin(t/7)*8-oy),f=Math.floor(frame/4+k)%2;c.fillStyle=k?'#f0d040':'#f4f4ff';
      c.fillRect(Math.round(x)-1-f,Math.round(y),1+f,1);c.fillRect(Math.round(x)+1,Math.round(y),1+f,1);c.fillStyle='#302010';c.fillRect(Math.round(x),Math.round(y),1,1)})}
  if(wx==='antu'||wx==='tromu')drawWxMap(c,wx,ox,oy,W,H);
  // 3. colour grade: a soft-light pass that deepens shadows and warms highlights, tuned per place
  c.globalCompositeOperation='soft-light';
  const tint=gloom?'rgba(96,104,128,.55)':indoor?'rgba(140,118,96,.35)':urban?'rgba(128,122,130,.4)':M.bg==='mount'?'rgba(112,124,150,.35)':M.bg==='pampa'?'rgba(156,128,96,.38)':'rgba(146,132,104,.32)';
  const g2=dLin(0,VY,0,VY+H);g2.addColorStop(0,tint);g2.addColorStop(1,'rgba(60,50,90,.35)');g2.fill(c,0,VY,W,H);
  c.restore();
}
/* ---------- kuyfi chillka: an ancient carved stone stele, mossy when asleep, glowing when awake ---------- */
function drawTablet(c,X,Y,lit){
  ell(c,X+8,Y+15,8,2.5,'rgba(0,0,0,.32)');
  const top=Y-12;
  // stone body: rounded top, darker right side for depth
  c.fillStyle='#1a1418';c.fillRect(X+1,top+2,14,26);c.fillRect(X+2,top+1,12,1);c.fillRect(X+4,top,8,1);
  c.fillStyle='#6e6a66';c.fillRect(X+2,top+2,12,24);c.fillRect(X+3,top+1,10,1);c.fillRect(X+5,top+1,6,1);
  c.fillStyle='#8a8580';c.fillRect(X+2,top+2,4,24);c.fillRect(X+3,top+1,3,1);
  c.fillStyle='#55504c';c.fillRect(X+11,top+3,3,23);
  c.fillStyle='#a49e96';c.fillRect(X+3,top+2,1,22);
  // base plinth
  c.fillStyle='#1a1418';c.fillRect(X,Y+11,16,4);c.fillStyle='#5a5652';c.fillRect(X+1,Y+11,14,3);c.fillStyle='#7a7670';c.fillRect(X+1,Y+11,14,1);
  // carved rows of signs (stepped trariwe-like motifs)
  const gc=lit?(frame%60<30?'#ffe68a':'#fff2b8'):'#3e3a38',gl=lit?'#b07a20':'#8e8a84';
  for(let r=0;r<5;r++){const yy=top+5+r*4;for(let k=0;k<3;k++){const xx=X+3+k*4,m=(r*3+k)%4;
    c.fillStyle=gc;if(m===0){c.fillRect(xx,yy,3,1);c.fillRect(xx+1,yy+1,1,1)}else if(m===1){c.fillRect(xx,yy+1,1,1);c.fillRect(xx+1,yy,1,2);c.fillRect(xx+2,yy+1,1,1)}else if(m===2){c.fillRect(xx,yy,1,2);c.fillRect(xx+2,yy,1,2)}else{c.fillRect(xx,yy,2,1);c.fillRect(xx+1,yy+1,2,1)}
    c.fillStyle=gl;c.fillRect(xx,yy+2,1,1)}}
  if(!lit){ // moss
    c.fillStyle='#4a7a30';c.fillRect(X+2,top+2,5,2);c.fillRect(X+10,top+12,4,3);c.fillRect(X+2,top+20,3,5);c.fillRect(X+8,top+23,6,3);
    c.fillStyle='#6aa040';c.fillRect(X+3,top+2,2,1);c.fillRect(X+11,top+12,2,1);c.fillRect(X+2,top+21,2,1);c.fillRect(X+9,top+23,3,1);
    if(Math.abs(Math.round(P.fx)-((X+CAM.x)>>4))+Math.abs(Math.round(P.fy)-((Y+CAM.y-VY)>>4))<4&&frame%50<25){c.fillStyle='rgba(255,240,170,.8)';c.fillRect(X+7,top+9,1,1)}}
  else{ // awake: soft halo and motes rising
    c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(X+8,top+12,2,X+8,top+12,20);g.addColorStop(0,'rgba(255,220,120,'+(.28+.08*Math.sin(frame/12))+')');g.addColorStop(1,'rgba(255,200,80,0)');c.fillStyle=g;c.fillRect(X-14,top-10,44,44);c.restore();
    for(let k=0;k<3;k++){const t=((frame+k*33)%100)/100;c.fillStyle='rgba(255,236,160,'+(1-t).toFixed(2)+')';c.fillRect(Math.round(X+4+k*4+Math.sin(t*6+k)*2),Math.round(top+4-t*16),1,1)}}
}

/* light animation on top of a painted backdrop, in the painting's own colours */
function animPainted(c,a){const G2=PAINTBG[a].geo||{},ox=Math.round((LW-400)/2),F=frame;
  const motes=(n,col,y0,y1,vx,vy,blink)=>{for(let k=0;k<n;k++){const x=(((k*73+F*vx*(1+(k%3)*.3))%(LW+20))+LW+20)%(LW+20)-10,y=y0+((((k*37+F*vy*(1+(k%4)*.2))%(y1-y0))+(y1-y0))%(y1-y0));if(!blink||(F+k*13)%blink<blink*.7)R(c,Math.round(x),Math.round(y),1,1,col)}};
  if(a==='coast'){const sx=G2.sun[0]+ox;
    for(let k=0;k<22;k++){const y=G2.hz+3+((k*7)%(G2.sh-G2.hz-8)),sp=6+(y-G2.hz)*1.4,x=Math.round(sx+Math.sin(k*2.3+F/40)*sp);if((F+k*11)%34<14){R(c,x,y,2+(k%3),1,k%2?'#fff4d8':'#e6f6ff')}}
    for(let k=0;k<30;k++){const x=((k*53+Math.floor(F*.35))%LW),y=G2.hz+6+((k*29)%(G2.sh-G2.hz-10));if((F+k*9)%60<10)R(c,x,y,3,1,'#a8daf0')}
    for(let x=0;x<LW;x+=2){const y=G2.sh-1+Math.round(Math.sin((x-ox)/9+F/24)*1.4);R(c,x,y,2,1,(x>>1)%3?'#eef9ff':'#c8e4f0')}
    for(let i=0;i<2;i++){const bx=Math.round((F*.25+i*170)%(LW+30)-15),by=Math.round(30+i*14+Math.sin(F/20+i)*3),f=Math.sin(F/6+i)>0?1:0;R(c,bx-1,by,3,1,'#f4f4f8');R(c,bx-4,by-f,3,1,'#f4f4f8');R(c,bx+2,by-f,3,1,'#f4f4f8')}}
  else if(a==='field'){motes(18,'#fff4b0',90,200,.15,-.08,60);
    for(let i=0;i<2;i++){const bx=Math.round((F*.3+i*190)%(LW+30)-15),by=Math.round(36+i*16+Math.sin(F/22+i)*3),f=Math.sin(F/6+i)>0?1:0;R(c,bx-1,by,3,1,'#24304a');R(c,bx-4,by-f,3,1,'#24304a');R(c,bx+2,by-f,3,1,'#24304a')}}
  else if(a==='forest'){motes(16,'#fff6b8',30,170,.06,-.05,50);motes(6,'#7aa848',0,200,.2,.45,0)}
  else if(a==='mount'){motes(40,'#ffffff',0,224,.25,.6,0);motes(14,'#d8e4f4',0,224,.15,.4,0)}
  else if(a==='crater'||a==='cave3'){motes(26,'#ffb040',0,200,.1,-.5,40);motes(10,'#ff7020',0,200,.15,-.35,30);
    if(a==='crater')for(let k=0;k<26;k++){const x=((k*61+Math.floor(F*.4))%LW),y=104+((k*5)%14);if((F+k*7)%40<14)R(c,x,y,3,1,'#ffe08a')}}
  else if(a==='rainforest'||a==='fjord'){for(let k=0;k<46;k++){const x=((k*29-Math.floor(F*.7))%LW+LW)%LW,y=Math.floor((k*47+F*3.2)%LH);R(c,x,y,1,3,a==='fjord'?'rgba(170,190,210,.55)':'rgba(200,220,236,.55)')}
    for(let k=0;k<3;k++){const x=((F*.18+k*140)%(LW+120))-60;for(let d=0;d<4;d++)R(c,Math.round(x+d*9),96+k*6+(d%2),40-d*8,1,'rgba(200,210,220,.18)')}}
  else if(a==='pampa'){motes(30,'#f4e2a0',100,210,1.3,.05,0);motes(10,'#fff8dc',100,210,1.8,.02,0)}
  else if(a==='lagoon'){const mx=(G2.moon?G2.moon[0]:280)+ox;for(let k=0;k<20;k++){const y=94+((k*3)%28),x=Math.round(mx+Math.sin(k*1.7+F/30)*(2+(y-92)/3));if((F+k*9)%30<12)R(c,x,y,2,1,'#e0e8ff')}
    for(let k=0;k<30;k++)if((F+k*17)%90<8)R(c,(k*97)%LW,(k*31)%70,1,1,'#ffffff');motes(10,'#d8ff9a',100,200,.08,-.04,40)}
  else if(a==='deep'){for(let k=0;k<20;k++){const x=(k*41+Math.round(Math.sin((F+k*20)/18)*3))%LW,y=LH-((F*1.1+k*43)%(LH+20));c.fillStyle='rgba(200,240,250,.5)';c.fillRect(x,Math.round(y),1+(k%2),1+(k%2))}
    motes(12,'#9ad8e0',0,120,.1,.05,60)}
  else if(/^cave/.test(a)){motes(14,a==='cave4'?'#9ae0d0':'#e8d0a0',20,200,.05,-.04,50);
    for(const tx of [70,330]){const x=tx+ox,fl=(F>>2)%3;R(c,x-1,56-fl,4,2,'#ffb04a');R(c,x,54-fl,2,2,'#ffe08a')}
    const dy=Math.floor(F*1.4)%110;R(c,140+ox,dy,1,3,'#9ad0f0');R(c,262+ox,(dy+55)%110,1,3,'#9ad0f0')}
  else if(a==='metro'){if((F>>3)%37===0)R(c,0,0,LW,LH,'rgba(255,255,255,.05)');            // a tube that flickers now and then
    const tx=((F*3)%(LW*3))-LW;if(tx>-60&&tx<LW){c.fillStyle='rgba(255,240,190,.10)';c.fillRect(ox+18,34,56,46)}          // a train's lights sweeping the tunnel
    motes(10,'#c8ccd6',20,140,.06,.03,60)}
  else if(a==='feria'){motes(14,'#fff4d0',60,200,.12,-.04,50);
    for(let k=0;k<5;k++){const cx=[40,128,212,300,384][k]+ox,sw=Math.round(Math.sin(F/26+k)*1.2);R(c,cx-30,62+sw,60,1,'rgba(0,0,0,.18)')}}
  else if(a==='blocks'){for(let k=0;k<6;k++)if(((F>>5)+k*7)%23===0)R(c,ox+[30,74,300,344,322,52][k],[36,56,28,48,68,76][k],12,9,'rgba(255,214,130,.35)');
    motes(10,'#ffe0a0',80,200,.05,-.03,40)}
  else if(a==='waria'){for(let k=0;k<26;k++){const x=((k*37+Math.floor(F*.5))%LW),y=Math.floor((k*53+F*2.6)%LH);R(c,x,y,1,2,'rgba(190,200,220,.4)')}
    const hx2=((F*2)%(LW+80))-40;R(c,Math.round(hx2),152,4,2,'#fff4c0');R(c,Math.round(hx2)+18,152,4,2,'#fff4c0');R(c,Math.round(LW-hx2*.8),158,4,2,'#ff4030')}
}
