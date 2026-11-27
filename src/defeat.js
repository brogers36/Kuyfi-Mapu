/* ============================================================
   DEFEAT ANIMATIONS of the Santiago wardens and the Yewen
   After the boss falls and before the victory text, its own painted sprite breaks apart with physics:
   cracks run across it, it shatters into fragments (a Voronoi fracture of the sprite's pixels), and the
   fragments fall, tumble, bounce and pile up on the ground under gravity, raising dust, smoke and sparks.
   A or B skips to the end.
   ============================================================ */
const DEFEAT={
  // the fillantü: the clock on its chain races to catch up, the ear-wings tear into shreds that drift down,
  // the head drops and smashes, the zipper opens on one quiet word, and the skull crumbles to rubble and dust
  fillantu:{T:360,base:()=>tplCanvas('fillantu@b',0,1),mouth:[102,93],clock:[100,135],wingX:[72,130],wingY:100},
  // Ngoyngoyün: feedback, the speaker-eye bursts, cracks run over the hull, the legs crumple, the hull slams down
  // and breaks apart, and from inside comes warm light, music and voices speaking Mapudungun
  ngoyngoyun:{T:380,base:()=>tplCanvas('ngoyngoyun@b',0,1),eye:[78,58],stacks:[[57,22],[97,22]],legY:104},
  // Ngamleftripael: the legs break off at the joints one by one, the body crashes down,
  // and the carapace and the skull crack open and crumble
  ngamlef:{T:360,base:()=>tplCanvas('ngamlef@b',0,1),head:[75,80,23,23],abd:[121,62,31,39],eyes:[[64,74],[86,74]]},
  // Yewen: the people of Santiago come in and call it away, piece by piece, until an ordinary person stands there
  yewen:{T:690,base:()=>tplCanvas('yewen@b',0,1)}
};
function defStart(e){const D=(typeof defAlt==='function'&&defAlt(e.t))||DEFEAT[e.t];B.defA={t:0,e,k:e.t,T:D.T,D};const d=document.getElementById('dlg');if(d)d.style.display='none';active=null}
function defSkip(){const A=B.defA;if(A&&!A.done&&A.t<A.T-20)A.t=A.T-20}
const SSd=x=>x<=0?0:x>=1?1:x*x*(3-2*x);

/* ---------- sound: thuds, cracks, rumbles, ticks (a short cooldown keeps a pile-up a rumble, not noise) ---------- */
const DSND={t:0};
function dThud(v){if(frame-DSND.t<4)return;DSND.t=frame;tone('sine',110,38,.22,.28*v);noiseBurst(.18,.14*v,180)}
function dCrack(v){tone('square',1400+Math.random()*900,300,.05,.09*v);noiseBurst(.07,.12*v,2400)}
function dRumble(d,v){noiseBurst(d,v,120);tone('sine',70,40,d,v)}
function dTick(f,v){tone('square',f,f,.018,v||.07)}

/* ---------- the sprite, mirrored the way battle draws it (facing the hero), with its pixels ---------- */
function defBase(D){
  const base=D.base(),W=base.width,H=base.height,[mir,mg]=mk(W,H);mg.translate(W,0);mg.scale(-1,1);mg.drawImage(base,0,0);mg.setTransform(1,0,0,1,0,0);
  let px=null;try{px=mg.getImageData(0,0,W,H).data}catch(err){}
  return {mir,W,H,px,used:new Uint8Array(W*H),MX:x=>W-1-x};
}
// cut the pixels that pass a rule into one piece, kept whole
function dCut(Q,rule){const {W,H,px}=Q,[k,g]=mk(W,H);if(!px)return k;const im=g.createImageData(W,H),o=im.data;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,j=y*W+x;if(px[i+3]<10||Q.used[j])continue;if(!rule(x,y,px[i],px[i+1],px[i+2]))continue;
    o[i]=px[i];o[i+1]=px[i+1];o[i+2]=px[i+2];o[i+3]=px[i+3];Q.used[j]=1}
  g.putImageData(im,0,0);return k}
// a Voronoi fracture: n seeds scattered over the pixels that pass the rule (denser where dens() is high); every pixel goes
// to its nearest seed, with a little noise so the edges come out jagged like real breaks. Returns the fragments.
function dFrac(Q,rule,n,dens){
  const {W,H,px}=Q;if(!px)return [];const pts=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,j=y*W+x;if(px[i+3]<10||Q.used[j])continue;if(rule(x,y,px[i],px[i+1],px[i+2]))pts.push(j)}
  if(!pts.length)return [];
  const seeds=[];let guard=0;while(seeds.length<n&&guard++<n*40){const j=pts[Math.floor(Math.random()*pts.length)],x=j%W,y=(j/W)|0;if(!dens||Math.random()<dens(x,y))seeds.push([x,y])}
  if(!seeds.length)seeds.push([pts[0]%W,(pts[0]/W)|0]);
  const own=new Int16Array(pts.length),bb=seeds.map(()=>[1e9,1e9,-1,-1,0,0,0]);
  for(let q=0;q<pts.length;q++){const j=pts[q],x=j%W,y=(j/W)|0,nz=((x*73856093^y*19349663)>>>0)%100/100*6;
    let bi=0,bd=1e18;for(let s=0;s<seeds.length;s++){const dx=x-seeds[s][0],dy=y-seeds[s][1],d2=dx*dx+dy*dy,d=d2+nz*Math.sqrt(d2);if(d<bd){bd=d;bi=s}}
    own[q]=bi;const b=bb[bi];if(x<b[0])b[0]=x;if(y<b[1])b[1]=y;if(x>b[2])b[2]=x;if(y>b[3])b[3]=y;b[4]+=x;b[5]+=y;b[6]++;Q.used[j]=1}
  const fr=bb.map(b=>{if(!b[6])return null;const w=b[2]-b[0]+1,h=b[3]-b[1]+1,[cv,g]=mk(w,h);return {cv,g,im:g.createImageData(w,h),ox:b[0],oy:b[1],w,h,cx:b[4]/b[6],cy:b[5]/b[6],n:b[6],r:Math.max(1.5,Math.sqrt(b[6]/Math.PI))}});
  for(let q=0;q<pts.length;q++){const f=fr[own[q]],j=pts[q],x=j%W,y=(j/W)|0,i=j*4,o=((y-f.oy)*f.w+(x-f.ox))*4;f.im.data[o]=px[i];f.im.data[o+1]=px[i+1];f.im.data[o+2]=px[i+2];f.im.data[o+3]=px[i+3]}
  return fr.filter(Boolean).map(f=>{f.g.putImageData(f.im,0,0);delete f.im;delete f.g;return {f,rel:0,rest:0,x:0,y:0,vx:0,vy:0,a:0,va:0,drag:0,flut:0}})}

/* ---------- the world: fragments under gravity, a ground that piles up, dust, smoke, sparks ---------- */
let _dDust=null;
function dDustSprite(){if(_dDust)return _dDust;const [k,g]=mk(32,32);const gr=g.createRadialGradient(16,16,1,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.45,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);return _dDust=k}
// tinted copies of the soft puff, one per colour
const _dTint={};
function dPuff(col){if(_dTint[col])return _dTint[col];const [k,g]=mk(32,32);g.drawImage(dDustSprite(),0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,32,32);return _dTint[col]=k}
function dWorld(A){A.frags=[];A.fx=[];A.pile=new Float32Array(LW+40)}
// release a fragment from where it sits in the sprite (plus the object's offset), with a push
function dRel(A,F,vx,vy,va,o){if(F.rel)return;F.rel=1;F.x=A.x0+A.ox+F.f.cx;F.y=A.y0+A.oy+F.f.cy;F.vx=vx;F.vy=vy;F.va=va;if(o){F.drag=o.drag||0;F.flut=o.flut||0}}
function dBurst(A,F,cx,cy,sp,up){const dx=F.f.cx-cx,dy=F.f.cy-cy,d=Math.max(1,Math.hypot(dx,dy)),m=sp*(.6+Math.random()*.8)/Math.sqrt(Math.max(1,F.f.n/40));
  dRel(A,F,dx/d*m+(Math.random()-.5)*.6,dy/d*m-(up||0)*(.5+Math.random()*.6),(Math.random()-.5)*.25)}
function dGround(A,x){const i=Math.max(0,Math.min(A.pile.length-1,Math.round(x)+20));return A.gy-A.pile[i]}
function dStep(A){
  for(const F of A.frags){if(!F.rel||F.rest)continue;const f=F.f;
    F.vy+=.3*(1-F.drag*.85);
    if(F.drag){F.vx*=1-F.drag*.08;F.vy*=1-F.drag*.08;F.vx+=Math.sin(A.t*.18+f.cx)*F.flut;F.va+=Math.sin(A.t*.11+f.cy)*F.flut*.02}
    F.x+=F.vx;F.y+=F.vy;F.a+=F.va;
    const ext=Math.min(f.w,f.h)*.45,gnd=dGround(A,F.x);
    if(F.y+ext>=gnd){F.y=gnd-ext;
      if(F.vy>1.6){const sp=F.vy;F.vy=-sp*(F.drag?.05:.24);F.vx*=.55;F.va=F.va*.4+(Math.random()-.5)*.1;
        if(f.n>25&&!F.drag){dThud(Math.min(1,f.n/600+sp/12));dDust(A,F.x,gnd,Math.min(6,1+f.n/120),sp*.25);dCrumbs(A,F.x,gnd,f,Math.min(8,2+f.n/80))}}
      else{F.vy=0;F.vx*=.7;F.va*=.6;
        if(Math.abs(F.vx)<.12){F.rest=1;
          const rr=Math.max(2,Math.round(f.r*.9)),add=Math.min(f.h*.6,f.n/(rr*2*1.6));
          for(let q=-rr;q<=rr;q++){const i=Math.round(F.x)+q+20;if(i>=0&&i<A.pile.length)A.pile[i]=Math.min(70,A.pile[i]+add*(1-Math.abs(q)/(rr+1)))}}}}}
  for(const p of A.fx){p.l--;p.x+=p.vx;p.y+=p.vy;p.vy+=p.g||0;p.vx*=p.dr||1;p.vy*=p.dr||1;if(p.gr)p.r+=p.gr;if(p.floor&&p.y>p.floor){p.y=p.floor;p.vy*=-.3;p.vx*=.6}}
  A.fx=A.fx.filter(p=>p.l>0);
}
function dDust(A,x,y,n,sp){for(let k=0;k<n;k++)A.fx.push({k:'d',x:x+(Math.random()-.5)*8,y:y-2,vx:(Math.random()-.5)*(1+sp),vy:-Math.random()*(.4+sp*.4),dr:.96,r:3+Math.random()*4,gr:.22+Math.random()*.15,a:.5,col:'#b8b0a4',l:50+Math.random()*30,fl:40})}
function dSmoke(A,x,y,dark,n){for(let k=0;k<(n||1);k++)A.fx.push({k:'d',x:x+(Math.random()-.5)*4,y,vx:(Math.random()-.5)*.4+.15,vy:-.5-Math.random()*.5,dr:.99,r:2+Math.random()*2,gr:.12,a:dark?.55:.4,col:dark?'#2a2628':'#d8dce2',l:70+Math.random()*30,fl:50})}
function dSparks(A,x,y,n,col,sp){for(let k=0;k<n;k++){const a=Math.random()*6.283,v=(sp||2)*(.4+Math.random());A.fx.push({k:'s',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,g:.12,dr:.98,col:col||(Math.random()<.5?'#fff2b0':'#ffb040'),l:18+Math.random()*20,fl:12,floor:A.gy})}}
function dCrumbs(A,x,y,f,n){for(let k=0;k<n;k++)A.fx.push({k:'c',x:x+(Math.random()-.5)*f.w*.6,y:y-2,vx:(Math.random()-.5)*2.2,vy:-1-Math.random()*1.6,g:.25,col:'rgba(60,56,60,.9)',l:40+Math.random()*30,fl:20,floor:y})}
// cracks: random-walk branches that grow out from a point
function dCracks(cx,cy,n,len,seed){let s=seed||1;const r2=()=>{s=(s*16807)%2147483647;return s/2147483647};const out=[];
  for(let k=0;k<n;k++){let a=k/n*6.283+r2()*.6,x=cx,y=cy;const pts=[[x,y]];const L=len*(.6+r2()*.6);
    for(let d=0;d<L;d+=3){a+=(r2()-.5)*.9;x+=Math.cos(a)*3;y+=Math.sin(a)*3;pts.push([x,y]);
      if(r2()<.08){const b=[[x,y]];let bx=x,by=y,ba=a+(r2()<.5?.9:-.9);for(let e=0;e<L*.3;e+=3){ba+=(r2()-.5)*.8;bx+=Math.cos(ba)*3;by+=Math.sin(ba)*3;b.push([bx,by])}out.push({p:b,d0:d})}}
    out.push({p:pts,d0:0})}return out}
// cracks are drawn only over what is still standing: masked by the fragments that have not broken loose yet
function drawCracks(c,cr,prog,X,Y,glow,A){
  if(A){if(!A.ck)A.ck=mk(LW,LH);const [k,g]=A.ck;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,LW,LH);
    drawCracks(g,cr,prog,X,Y,glow);g.globalCompositeOperation='destination-in';
    for(const F of A.frags)if(!F.rel)g.drawImage(F.f.cv,Math.round(A.x0+A.ox+F.f.ox),Math.round(A.y0+A.oy+F.f.oy));
    g.globalCompositeOperation='source-over';c.drawImage(k,0,0);return}
  c.save();c.lineCap='round';
  for(const k of cr){const n=Math.floor(k.p.length*Math.max(0,Math.min(1,prog*1.4-k.d0/60)));if(n<2)continue;
    c.beginPath();c.moveTo(X+k.p[0][0],Y+k.p[0][1]);for(let i=1;i<n;i++)c.lineTo(X+k.p[i][0],Y+k.p[i][1]);
    c.strokeStyle=glow?'rgba(255,214,140,.9)':'rgba(10,8,10,.9)';c.lineWidth=1;c.stroke();
    if(!glow){c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=.6;c.translate(-.8,-.8);c.stroke();c.translate(.8,.8)}}
  c.restore()}
function drawFrags(c,A,alpha){c.save();c.imageSmoothingEnabled=false;
  for(const F of A.frags){const f=F.f;c.globalAlpha=alpha;
    if(!F.rel){c.drawImage(f.cv,Math.round(A.x0+A.ox+f.ox),Math.round(A.y0+A.oy+f.oy));continue}
    c.save();c.translate(F.x,F.y);c.rotate(F.a);c.drawImage(f.cv,-(f.cx-f.ox),-(f.cy-f.oy));c.restore()}
  c.restore();c.globalAlpha=1}
function drawFX(c,A,alpha){
  for(const p of A.fx){const a=Math.min(1,p.l/(p.fl||20))*alpha;if(a<=0)continue;
    if(p.k==='d'){c.globalAlpha=a*p.a;const s=p.r*2;c.drawImage(dPuff(p.col),p.x-s/2,p.y-s/2,s,s)}
    else if(p.k==='s'){c.globalAlpha=a;c.strokeStyle=p.col;c.lineWidth=1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*1.6,p.y-p.vy*1.6);c.stroke()}
    else if(p.k==='c'){c.globalAlpha=a;R(c,Math.round(p.x),Math.round(p.y),1+(p.l%3===0?1:0),1,p.col)}}
  c.globalAlpha=1}
const defNote=(c,x,y,col)=>{R(c,x,y,2,2,col);R(c,x+1,y-5,1,5,col);R(c,x+2,y-5,2,1,col)};

/* ---------- the driver ---------- */
function drawDefeat(c){
  const A=B.defA;if(!A||A.done)return;const D=A.D||DEFEAT[A.k],e=A.e;
  const S2={fillantu:[setFill,stepFill,drawFill],ngoyngoyun:[setNgoy,stepNgoy,drawNgoy],ngamlef:[setNgam,stepNgam,drawNgam],yewen:[setYew,stepYew,drawYew]}[A.k];
  if(!A.Q){A.Q=defBase(D);dWorld(A);A.x0=(e._cx||72)-Math.round(A.Q.W/2);A.y0=e._y!=null?e._y:12;A.gy=(e._bse||138)+4;A.ox=0;A.oy=0;A.f=frame;S2[0](A,D)}
  // advance on the game's 60 Hz clock, not on screen refreshes, so a slow phone sees the same timing
  const n=Math.max(0,Math.min(6,frame-A.f));A.f=frame;
  for(let i=0;i<n&&A.t<A.T;i++){A.t++;S2[1](A,D);dStep(A)}
  if(A.k==='ngamlef'&&A.t<148&&typeof ngamThread==='function')ngamThread(c,(e._cx||72)+A.ox,A.y0+A.oy,enemyCanvas('ngamlef',ET.ngamlef.bs,0));   // still hanging from its strand until the strand snaps
  S2[2](c,A,D);
  if(A.t>=A.T){A.done=1;A.e.dead=true;A.e.fadeT=0;victory()}
}
const dFade=A=>A.t<A.T-45?1:Math.max(0,(A.T-A.t)/45);

/* ---------- Fillantü ---------- */
function setFill(A,D){const Q=A.Q,U=Q.MX;
  const wl=U(D.wingX[1]),wr=U(D.wingX[0]);
  A.wings=dFrac(Q,(x,y)=>y<D.wingY&&(x<wl||x>wr),46);
  A.clockP=dFrac(Q,(x,y)=>y>=D.clock[1]-8&&Math.abs(x-U(D.clock[0]))<9,3);
  A.head=dFrac(Q,()=>true,70,(x,y)=>.35+.65*Math.max(0,1-Math.abs(y-D.mouth[1])/60));
  A.frags=A.wings.concat(A.head,A.clockP);
  A.wings.sort((a,b)=>Math.abs(b.f.cx-Q.W/2)-Math.abs(a.f.cx-Q.W/2));
  A.cr=dCracks(Q.W/2,Q.H*.78,9,55,7)}
function stepFill(A,D){const Q=A.Q,t=A.t;
  if(t<70){const sp=Math.pow(t/70,2.2);if(t%Math.max(3,Math.round(14-sp*11))===0)dTick(1800+sp*900,.05+sp*.06)}
  // 60-130: the ear-wings tear away in shreds, from the tips in, and drift down
  if(t>=60&&t<130){const i=Math.floor((t-60)/70*A.wings.length);for(let k=0;k<=i&&k<A.wings.length;k++){const F=A.wings[k];if(!F.rel){dRel(A,F,(F.f.cx<Q.W/2?-1:1)*(.3+Math.random()*.8),-.4-Math.random()*.6,(Math.random()-.5)*.15,{drag:.55,flut:.12});if(k%6===0)noiseBurst(.12,.08,3000)}}}
  // 125: the head falls, and smashes into the ground
  if(t>=125&&!A.landed){A.vy=(A.vy||0)+.32;A.oy+=A.vy;const bottom=A.y0+A.oy+Q.H*.9;if(bottom>=A.gy){A.oy-=bottom-A.gy;A.landed=t;B.shake=16;B.flash=6;dThud(1);dRumble(.6,.18);dDust(A,A.x0+Q.W/2,A.gy,26,3)}}
  if(A.landed&&t===A.landed+2)dCrack(1);
  if(t===190)sfx('heal');
  // 235-300: the skull crumbles from the top down
  if(t>=235&&t<300){const tops=A.head.filter(F=>!F.rel).sort((a,b)=>a.f.cy-b.f.cy);
    for(let k=0;k<3&&k<tops.length;k++){const F=tops[k];dRel(A,F,(Math.random()-.5)*1.2,-Math.random()*.8,(Math.random()-.5)*.2);if(Math.random()<.3)dDust(A,F.x,F.y,1,.3)}
    if(t%10===0)dRumble(.2,.07)}
  if(t===236)for(const F of A.clockP)dRel(A,F,(Math.random()-.5)*.8,-.5,(Math.random()-.5)*.2);
}
function drawFill(c,A,D){const Q=A.Q,t=A.t,al=dFade(A),U=Q.MX;
  A.ox=t<70&&t>20?(t%4<2?1:-1):0;
  drawFrags(c,A,al);
  const X=A.x0+A.ox,Y=A.y0+A.oy;
  if(A.landed&&t<240)drawCracks(c,A.cr,SSd((t-A.landed)/35),X,Y,0,A);
  // the clock comes back to life, racing round
  if(t<236&&!D.noClock){const cx=X+U(D.clock[0]),cy=Y+D.clock[1],turns=t<70?Math.pow(t/70,2.4)*10:10+(t-70)*.02,a=turns*6.283-Math.PI/2;
    c.fillStyle='rgba(255,236,170,'+(t<70?.22+.22*Math.sin(t/3):.18).toFixed(2)+')';c.beginPath();c.arc(cx,cy,6,0,6.283);c.fill();
    c.strokeStyle='#1a1010';c.lineWidth=1;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*4,cy+Math.sin(a)*4);c.stroke()}
  // the zipper opens, light leaks out, and one quiet word
  if(t>=190&&t<250){const mx=X+U(D.mouth[0]),my=Y+D.mouth[1],op=SSd((t-190)/25)*24,fd=t>232?Math.max(0,1-(t-232)/18):1;
    c.fillStyle='rgba(255,246,214,'+(.85*fd).toFixed(2)+')';c.fillRect(Math.round(mx-op),Math.round(my-1),Math.round(op*2),2);
    if(t>=200){const wt=t-200,wa=Math.min(1,wt/12)*fd;OV.push(()=>{ctx.save();ctx.globalAlpha=wa;txt('Mari mari.',mx,my-12-wt*.3,'#fff6d8',13,'center');ctx.restore()})}}
  drawFX(c,A,al)}

/* ---------- Ngoyngoyün ---------- */
function setNgoy(A,D){const Q=A.Q,U=Q.MX,ex=U(D.eye[0]),ey=D.eye[1];
  A.glass=dFrac(Q,(x,y)=>Math.hypot(x-ex,y-ey)<11,14);
  A.legs=dFrac(Q,(x,y)=>y>=D.legY,40);
  A.hull=dFrac(Q,()=>true,95,(x,y)=>.3+.7*Math.max(0,1-Math.hypot(x-ex,y-ey)/70));
  A.frags=A.legs.concat(A.hull,A.glass);A.ex=ex;A.ey=ey;
  A.cr=dCracks(ex,ey,11,70,3)}
function stepNgoy(A,D){const Q=A.Q,t=A.t,U=Q.MX;
  const ex=A.x0+A.ox+A.ex,ey=A.y0+A.oy+A.ey;
  if(t<75&&t%3===0)tone('sine',420+t*32,470+t*34,.06,.03+t/75*.06);
  if(t>30&&t<75&&t%4===0)dSparks(A,ex,ey,2,null,1.6);
  // 75: the eye bursts
  if(t===75){B.flash=12;B.shake=12;sfx('shatter');dCrack(1);for(const F of A.glass)dBurst(A,F,A.ex,A.ey,3.2,1.2);dSparks(A,ex,ey,30,null,3.4)}
  if(t>=75&&t%3===0){for(const [sx,sy] of D.stacks)if(t<250)dSmoke(A,A.x0+A.ox+U(sx),A.y0+A.oy+sy,Math.random()<.6);if(t<230)dSmoke(A,ex+(Math.random()-.5)*6,ey,true)}
  // 100-140: the legs crumple one after another and the hull sinks on them
  for(const [k,dy] of [[100,6],[118,7],[136,8]])if(t===k){A.sinkT=dy;dCrack(.8);dRumble(.25,.12);B.shake=6;
    const side=k===118?1:-1;for(const F of A.legs)if(!F.rel&&((F.f.cx-Q.W/2)*side>0||k===136))dRel(A,F,(F.f.cx-Q.W/2)*.02+(Math.random()-.5),-.5-Math.random(),(Math.random()-.5)*.3)}
  if(A.sinkT){const s=Math.min(A.sinkT,1.2);A.oy+=s;A.sinkT-=s}
  // 150: the hull drops the rest of the way and slams the ground
  if(t>=150&&!A.landed){A.vy=(A.vy||0)+.35;A.oy+=A.vy;const bottom=A.y0+A.oy+D.legY;if(bottom>=A.gy){A.oy-=bottom-A.gy;A.landed=t;B.shake=20;B.flash=8;dThud(1);dRumble(.9,.25);dDust(A,A.x0+Q.W/2,A.gy,34,3.4);
    for(const F of A.legs)if(!F.rel)dRel(A,F,(F.f.cx-Q.W/2)*.03,-1,(Math.random()-.5)*.3)}}
  // 185-260: the hull breaks apart, outward from the cracks at the eye, and piles up
  if(t>=185&&t<260){const lim=(t-185)/75*110;for(const F of A.hull)if(!F.rel&&Math.hypot(F.f.cx-A.ex,F.f.cy-A.ey)<lim){dBurst(A,F,A.ex,A.ey,1.6,.8);if(Math.random()<.12)dSparks(A,A.x0+A.ox+F.f.cx,A.y0+A.oy+F.f.cy,4)}
    if(t%8===0)dCrack(.6);if(t%14===0)dRumble(.3,.12)}
  if(t===260)for(const F of A.hull)if(!F.rel)dRel(A,F,(Math.random()-.5),-.3,(Math.random()-.5)*.2);
  if(t>=200&&t<340&&t%16===0){A.fx.push({k:'n',x:A.x0+Q.W/2+(Math.random()-.5)*36,y:A.gy-30,vx:(Math.random()-.5)*.3,vy:-.45,col:['#ffe9a0','#fff6d8','#ffd0a0'][t%3],l:80,fl:30});
    const sc=[523,587,659,784,880,1047],f=sc[(t/16|0)%6];tone('triangle',f,f,.4,.06)}
}
function drawNgoy(c,A,D){const Q=A.Q,t=A.t,al=dFade(A);
  A.ox=t<75?(t%4<2?1:-1)*Math.round(t/35):0;
  const X=A.x0+A.ox,Y=A.y0+A.oy;
  // what was inside: a warm light where the machine stood
  if(t>=185){const p=SSd((t-185)/50)*al,cx=A.x0+Q.W/2,cy=A.gy-26;const g=c.createRadialGradient(cx,cy,2,cx,cy,60);g.addColorStop(0,'rgba(255,236,170,'+(.7*p).toFixed(2)+')');g.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=g;c.fillRect(cx-62,cy-62,124,124)}
  drawFrags(c,A,al);
  if(t>=40&&t<200)drawCracks(c,A.cr,SSd((t-40)/120),X,Y,t>=75,A);
  if(t<80){const a=t/75,r=4+a*12+Math.sin(t)*1.5,ex=X+A.ex,ey=Y+A.ey;const g=c.createRadialGradient(ex,ey,0,ex,ey,r);g.addColorStop(0,'rgba(255,255,240,.95)');g.addColorStop(.4,'rgba(255,120,60,'+(.5+a*.4)+')');g.addColorStop(1,'rgba(255,60,30,0)');c.fillStyle=g;c.beginPath();c.arc(ex,ey,r,0,6.283);c.fill()}
  drawFX(c,A,al);
  for(const p of A.fx)if(p.k==='n'){c.globalAlpha=Math.min(1,p.l/30)*al;defNote(c,Math.round(p.x),Math.round(p.y),p.col);c.globalAlpha=1}
  if(t>=230&&t<330){const w=t<280?'Mari mari':'Pewkayal',tt=(t-230)%50,wa=Math.min(1,tt/10)*Math.max(0,1-(tt-34)/16);
    OV.push(()=>{ctx.save();ctx.globalAlpha=wa*al;txt(w,A.x0+Q.W/2+(t<280?-16:16),A.gy-44-tt*.35,'#fff6d8',12,'center');ctx.restore()})}}

/* ---------- Ngamleftripael ---------- */
function setNgam(A,D){const Q=A.Q,U=Q.MX,[hx,hy,hr,hr2]=D.head,[bx,by,brx,bry]=D.abd;
  const inBody=(x,y)=>{const ux=U(x);return ((ux-hx)/hr)**2+((y-hy)/hr2)**2<1||((ux-bx)/brx)**2+((y-by)/bry)**2<1};
  A.cx=U((D.c||[88,74])[0]);A.cy=(D.c||[88,74])[1];
  // eight legs, each broken into segments, snapped in an order that walks round the body
  A.legs=[];for(let k=0;k<8;k++){const a0=-Math.PI+k*Math.PI/4,a1=a0+Math.PI/4;A.legs.push(dFrac(Q,(x,y)=>{if(inBody(x,y))return false;const a=Math.atan2(y-A.cy,x-A.cx);return a>=a0&&a<a1},6))}
  A.body=dFrac(Q,()=>true,90,(x,y)=>.35+.65*Math.max(0,1-Math.abs(y-(D.c?D.c[1]+6:80))/50));
  A.frags=[].concat(...A.legs,A.body);A.order=[0,4,2,6,1,5,3,7];
  A.cr=dCracks(U(D.head[0]),D.head[1]+12,10,60,5)}
function stepNgam(A,D){const t=A.t;
  const LC=['#d6342e','#ecbe28','#36a04c','#3a70d2','#964ec4','#d6342e','#ecbe28','#36a04c'];
  for(let j=0;j<8;j++){const t0=30+j*14;if(t===t0){const L=A.legs[A.order[j]];dCrack(1);B.shake=5;
      // the joint nearest the body snaps: sparks in the line's colour, the segments fall and tumble
      const near=L.reduce((b,F)=>!b||Math.hypot(F.f.cx-A.cx,F.f.cy-A.cy)<Math.hypot(b.f.cx-A.cx,b.f.cy-A.cy)?F:b,null);
      if(near)dSparks(A,A.x0+near.f.cx,A.y0+A.oy+near.f.cy,14,LC[A.order[j]],2.4);
      for(const F of L)dRel(A,F,(F.f.cx-A.cx)*.025+(Math.random()-.5)*.8,-.6-Math.random()*1.2,(Math.random()-.5)*.35)}}
  // 148: with no legs under it the body drops and crashes down
  if(t>=148&&!A.landed){A.vy=(A.vy||0)+.34;A.oy+=A.vy;const bottom=A.y0+A.oy+(D.bot||108);if(bottom>=A.gy){A.oy-=bottom-A.gy;A.landed=t;B.shake=18;B.flash=6;dThud(1);dRumble(.8,.22);dDust(A,A.x0+A.cx,A.gy,30,3);dCrack(1)}}
  // 190-270: the carapace and the skull crumble, from the top down, into the pile
  if(t>=190&&t<270){const tops=A.body.filter(F=>!F.rel).sort((a,b)=>a.f.cy-b.f.cy);
    for(let k=0;k<2&&k<tops.length;k++){const F=tops[k];dRel(A,F,(F.f.cx-A.cx)*.02+(Math.random()-.5),-Math.random()*.9,(Math.random()-.5)*.25)}
    if(t%12===0){dRumble(.25,.1);dDust(A,A.x0+A.cx+(Math.random()-.5)*60,A.gy,3,1)}}
}
function drawNgam(c,A,D){const Q=A.Q,t=A.t,al=dFade(A),U=Q.MX;
  A.ox=t<30?(t%4<2?1:-1):0;const X=A.x0+A.ox,Y=A.y0+A.oy;
  drawFrags(c,A,al);
  if(A.landed&&t<200)drawCracks(c,A.cr,SSd((t-A.landed)/40),X,Y,0,A);
  // the eyes burn on, then go out
  const eg=t<150?1:Math.max(0,1-(t-150)/70);
  if(eg>0)for(const [ex0,ey0] of D.eyes){const ex=X+U(ex0),ey=Y+ey0,r=4+Math.sin(t/4);const g=c.createRadialGradient(ex,ey,0,ex,ey,r*2);g.addColorStop(0,'rgba(255,240,120,'+(.6*eg*al).toFixed(2)+')');g.addColorStop(1,'rgba(255,200,60,0)');c.fillStyle=g;c.fillRect(ex-r*2,ey-r*2,r*4,r*4)}
  drawFX(c,A,al)}

/* ---------- Yewen ---------- */
// The people of Santiago, no longer ashamed, walk in and surround the Yewen. Then, one after another, they raise a fist
// and call out «¡Amutunge!» or «¡Yewentuwelayaiñ!»; each call hits like a blow and blasts a piece off it, until at the
// last call all of them shout together, the last of it is gone, and an ordinary person stands there and says «Mañumwiyiñ».
// [painted sprite, feet x, feet y, side]: side 'L' stands left of the Yewen and faces right; y<136 stands behind it
const YEW_CROWD=[['joven',16,126,'L'],['estud',120,124,'R'],['mujer',6,148,'L'],['obrero',130,148,'R'],['abuelo',44,120,'L'],['lamngen',96,119,'R']];
const YEW_SAY=['¡Amutunge!','¡Yewentuwelayaiñ!'];
function yCut(Q,rule){const {W,H,px}=Q,[k,g]=mk(W,H),pts=[];if(!px)return null;const im=g.createImageData(W,H),o=im.data;let sx=0,sy=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,j=y*W+x;if(px[i+3]<10||Q.used[j])continue;if(!rule(x,y,px[i],px[i+1],px[i+2]))continue;
    o[i]=px[i];o[i+1]=px[i+1];o[i+2]=px[i+2];o[i+3]=px[i+3];Q.used[j]=1;sx+=x;sy+=y;pts.push([x,y,px[i],px[i+1],px[i+2]])}
  if(!pts.length)return null;g.putImageData(im,0,0);return {cv:k,cx:sx/pts.length,cy:sy/pts.length,pts,t0:-1}}
let _yMir={};
function yPerson(n,fr,faceRight){const key=n+fr+(faceRight?'r':'l');if(_yMir[key])return _yMir[key];const cv=tplCanvas('hero_stg_'+n,fr,1);
  if(!faceRight)return _yMir[key]=cv;const [k,g]=mk(cv.width,cv.height);g.translate(cv.width,0);g.scale(-1,1);g.drawImage(cv,0,0);return _yMir[key]=k}
function setYew(A,D){const Q=A.Q,U=Q.MX;
  const isFire=(r,g,b)=>r>40&&b>=r*.6&&r>=b*.8&&g<r*.75&&g<b*.8;
  const P=D.y||{mid:48,core:[28,66],staff:[60,80,20,66,74],bot:80,top:12,side:[33,58],chest:36};
  const core=ux=>ux>=P.core[0]&&ux<=P.core[1];
  const isCloak=(r,g,b,ux)=>(r>g*1.6&&r>b*1.15&&!(g>r*.6))||(r+g+b<150&&!core(ux));
  const st=P.staff,rules=[(x,y,r,g,b)=>isFire(r,g,b)&&U(x)>P.mid, (x,y,r,g,b)=>isFire(r,g,b),
    (x,y,r,g,b)=>U(x)>P.mid&&isCloak(r,g,b,U(x)), (x,y,r,g,b)=>isCloak(r,g,b,U(x)),
    (x,y)=>{const ux=U(x);return (ux>=st[0]&&ux<=st[1]&&y<st[2])||(ux>=st[3]&&ux<=st[4])},
    (x,y)=>y>=P.bot, (x,y)=>y<P.top, (x,y)=>{const ux=U(x);return ux<P.side[0]||ux>P.side[1]}, (x,y)=>y>=P.chest, ()=>true];
  A.pcs=rules.map(r=>yCut(Q,r)).filter(Boolean);
  const cxY=A.x0+Q.W/2;   // the Yewen's centre on screen; the crowd stands round it
  A.crowd=YEW_CROWD.map(([n,dx,y,side],i)=>({n,tx:A.x0+dx,y,side,x:LW+24+i*30,start:6+i*14,face:'l'}));
  A.motes=[];A.rings=[];A.says=[];A.kick=[0,0];
  // one call per piece, the speakers taking turns; the last call is everyone together
  A.calls=A.pcs.map((p,i)=>({t:230+i*34,who:i===A.pcs.length-1?-1:i%A.crowd.length,w:i===A.pcs.length-1?YEW_SAY[0]:YEW_SAY[i%2],p}));
  A.endT=A.calls[A.calls.length-1].t+40;
  // afterwards the freed boy and the people of Santiago walk off together to the left
  A.bx=A.x0+Q.W/2;A.exitD=Math.max(A.bx,...A.crowd.map(m=>m.tx))+40;A.T=A.endT+150+Math.ceil(A.exitD/1.7)+4}
function stepYew(A,D){const Q=A.Q,t=A.t;
  // walk in round the Yewen
  for(const m of A.crowd){if(t<m.start)continue;const d=m.tx-m.x;if(Math.abs(d)>.6){m.x+=Math.sign(d)*Math.min(1.7,Math.abs(d));m.walk=1;m.face=d<0?'l':'r'}else{m.x=m.tx;m.walk=0;m.face=m.side==='L'?'r':'l'}}
  for(const cl of A.calls){
    const who=cl.who<0?A.crowd:[A.crowd[cl.who]];
    if(t===cl.t){for(const m of who)m.shout=t;
      if(cl.who<0)A.says.push({x:A.x0+Q.W/2,y:A.y0+14,w:cl.w,t0:t,l:70,big:1});else A.says.push({m:who[0],w:cl.w,t0:t,l:46})
      tone('sawtooth',220,300,.12,cl.who<0?.12:.07);tone('triangle',330,440,.14,cl.who<0?.1:.06,.02)}
    // the words land: a heavy blow, a flash, a shockwave, the piece blasted off
    if(t===cl.t+6){const p=cl.p;p.t0=t;const px=A.x0+p.cx,py=A.y0+p.cy;let sx=0,sy=0;for(const m of who){sx+=m.x;sy+=m.y-46}sx/=who.length;sy/=who.length;
      const dx=px-sx,dy=py-sy,d=Math.hypot(dx,dy)||1;p.dx=dx/d;p.dy=dy/d;p.rot=(Math.random()<.5?-1:1)*(.5+Math.random()*.5);p.sp=cl.who<0?5.5:4.2;
      const big=cl.who<0;B.shake=big?22:12;B.flash=big?14:7;A.kick=[p.dx*(big?7:4),p.dy*(big?4:2)];A.hitT=t;
      tone('sine',120,40,.3,big?.4:.28);noiseBurst(.35,big?.3:.2,160);dCrack(1);noiseBurst(.12,.16,3000);
      A.rings.push({x:px,y:py,t0:t,big});dSparks(A,px,py,big?40:18,'#fff2c8',big?4:3);
      for(let q=0;q<(big?6:3);q++)A.fx.push({k:'d',x:px+(Math.random()-.5)*10,y:py+(Math.random()-.5)*10,vx:p.dx*(1+Math.random()),vy:p.dy*(1+Math.random())-.3,dr:.94,r:4+Math.random()*4,gr:.3,a:.45,col:'#e8dcd0',l:30,fl:25})}}
  A.kick[0]*=.82;A.kick[1]*=.82;
  // blasted pieces fly off fast, slowing as they burn away into motes of light
  for(const p of A.pcs){if(p.t0<0)continue;const k=t-p.t0;if(k>40)continue;
    p.ox=(p.ox||0)+p.dx*p.sp*Math.pow(.9,k);p.oy=(p.oy||0)+p.dy*p.sp*Math.pow(.9,k)-.08*k*.2;
    for(let q=0;q<(k<14?14:k<30?5:2);q++){const s2=p.pts[Math.floor(Math.random()*p.pts.length)];
      const r=Math.round(s2[2]*.35+255*.65),g=Math.round(s2[3]*.35+228*.65),b=Math.round(s2[4]*.35+170*.65),v=k<10?2.2:1;
      A.motes.push({x:A.x0+s2[0]+p.ox,y:A.y0+s2[1]+p.oy,vx:p.dx*v*(.5+Math.random())+(Math.random()-.5)*.8,vy:p.dy*v*(.5+Math.random())-.3-Math.random()*.5,l:30+Math.random()*30,col:'rgb('+r+','+g+','+b+')',ph:Math.random()*6})}}
  for(const m of A.motes){m.l--;m.x+=m.vx;m.y+=m.vy;m.vx*=.95;m.vy=m.vy*.95-.02}A.motes=A.motes.filter(m=>m.l>0);
  if(t===A.endT){B.flash=12;sfx('heal')}
  if(t===A.endT+40){tone('triangle',523,523,.5,.06);A.says.push({person:1,x:A.bx+2,y:A.gy-yBoy(0,true).height-8,w:'Mañumwiyiñ.',t0:t,l:100})}
  if(t===A.endT+150){A.exit=1;for(const m of A.crowd)m.tx=m.x-A.exitD;A.btx=A.bx-A.exitD}
  if(A.exit&&A.bx>A.btx)A.bx=Math.max(A.btx,A.bx-1.7)
}
/* the freed boy, drawn in the same style as the Santiago people and stretched to their height
   (a few torso and leg rows doubled, never the face) so he stands as one of them */
let _yBoy={};
function yBoy(fr,faceRight){const key=fr+(faceRight?'r':'l');if(_yBoy[key])return _yBoy[key];const s=yPerson('persona',fr,faceRight),H=s.height,T=yPerson('joven',0,true).height,add=Math.max(0,T-H);
  const [k,g]=mk(s.width,H+add),r0=Math.round(H*.42),r1=Math.round(H*.95),dup=new Set();for(let i=0;i<add;i++)dup.add(Math.round(r0+(i+.5)*(r1-r0)/add));
  let y=0;for(let r=0;r<H;r++){g.drawImage(s,0,r,s.width,1,0,y,s.width,1);y++;if(dup.has(r)){g.drawImage(s,0,r,s.width,1,0,y,s.width,1);y++}}return _yBoy[key]=k}
function drawYew(c,A,D){const Q=A.Q,t=A.t,al=1;   // nobody fades: at the end they all walk off together
  const X=A.x0+A.kick[0]+(A.hitT&&t-A.hitT<10?(t%2?1:-1):0),Y=A.y0+A.kick[1];
  const gone=A.pcs.filter(p=>p.t0>=0).length,tot=A.pcs.length;
  // the crowd: back row first (behind the Yewen), then the Yewen, then the front row
  const drawM=m=>{const sh=m.shout!=null&&t-m.shout<26?(t-m.shout<6?3:4):null;
    const fr=sh!=null?sh:m.walk?(Math.floor(t/8)%2?1:2):0,cv=yPerson(m.n,fr,m.face==='r'),bob=m.walk&&!(typeof GEM_ON!=='undefined'&&GEM_ON)?(Math.floor(t/8)%2):0;
    const hop=t>A.endT+50&&t<A.endT+100?Math.round(Math.abs(Math.sin((t-A.endT)/7+m.tx))*3):0,lean=sh!=null&&t-m.shout<10?(m.face==='r'?2:-2):0;
    ell(c,m.x,m.y,cv.width*.32,3,'rgba(0,0,14,'+(.32*al).toFixed(2)+')');c.globalAlpha=al;c.drawImage(cv,Math.round(m.x-cv.width/2+lean),Math.round(m.y-cv.height+2-bob-hop));c.globalAlpha=1};
  const back=A.crowd.filter(m=>m.y<136).sort((a,b)=>a.y-b.y),front=A.crowd.filter(m=>m.y>=136).sort((a,b)=>a.y-b.y);
  back.forEach(drawM);
  // the person who was under the shame all along, showing through as it is blasted away
  const SQ=typeof dseqOK==='function'&&dseqOK('yewen')&&gone>0;   // painted frames: the calls move the Yewen through them, and frame four is the boy
  const bwk=A.exit&&A.bx>A.btx,pcv=yBoy(bwk?(Math.floor(t/8)%2?1:2):0,!A.exit),pw=pcv.width,ph=pcv.height,ppx=Math.round(A.bx-pw/2),ppy=A.gy-2-ph-(bwk&&!(typeof GEM_ON!=='undefined'&&GEM_ON)?Math.floor(t/8)%2:0);
  const pa=SQ?(t>=A.endT?1:0):SSd((gone-tot*.4)/(tot*.5))*al;
  if(pa>0){ell(c,ppx+pw/2,A.gy-3,pw*.32,3,'rgba(0,0,14,'+(.35*pa).toFixed(2)+')');c.globalAlpha=pa;c.drawImage(pcv,ppx,ppy);c.globalAlpha=1}
  if(t>=A.endT){const p=SSd((t-A.endT)/30)*al*(1-SSd((t-A.endT-60)/90)),cx=ppx+pw/2,cy=ppy+ph*.45;const g=c.createRadialGradient(cx,cy,2,cx,cy,56);g.addColorStop(0,'rgba(255,240,190,'+(.55*p).toFixed(2)+')');g.addColorStop(1,'rgba(255,220,150,0)');c.fillStyle=g;c.fillRect(cx-58,cy-58,116,116)}
  // what is left of the Yewen, and the pieces blasted off it, burning away
  if(SQ&&t<A.endT){const fr=gone/tot,k=fr<.34?0:fr<.75?1:2,F=DSEQ.yewen[k],cv=enemyCanvas('yewen',ET.yewen.bs,0),lf=(A.e._cx||72)+Math.ceil(cv.width/2)-cv.width;
    let fx=Math.round(lf+F.dx+X-A.x0),fy=Math.round(Y+F.dy),fw=F.im.width,fh=F.im.height;
    if(k===2){const sc=ph*1.22/fh;fw=Math.round(fw*sc);fh=Math.round(fh*sc);fx=Math.round(A.bx-fw/2+X-A.x0);fy=A.gy-2-fh}   // the boy breaking free is already his own size
    c.globalAlpha=al;c.drawImage(F.im,fx,fy,fw,fh);
    if(A.hitT&&t-A.hitT<6){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=(1-(t-A.hitT)/6)*.7*al;c.drawImage(F.im,fx,fy,fw,fh);c.restore()}c.globalAlpha=1}
  for(const p of A.pcs){if(p.t0<0){if(SQ)continue;c.globalAlpha=al;c.drawImage(p.cv,Math.round(X),Math.round(Y));continue}
    const k=t-p.t0;if(k>34)continue;const a=1-SSd(k/30);if(a<=0)continue;
    c.save();c.globalAlpha=a*al;c.imageSmoothingEnabled=true;c.translate(X+p.cx+p.ox,Y+p.cy+p.oy);c.rotate(p.rot*SSd(k/30));c.drawImage(p.cv,-p.cx,-p.cy);
    if(k<12){c.globalCompositeOperation='lighter';c.globalAlpha=(1-k/12)*al;c.drawImage(p.cv,-p.cx,-p.cy);c.drawImage(p.cv,-p.cx,-p.cy)}c.restore()}
  c.globalAlpha=1;
  front.forEach(drawM);
  // shockwaves where the words land
  for(const r of A.rings){const k=t-r.t0;if(k>22)continue;const q=k/22,R2=(r.big?10:6)+q*(r.big?70:44);
    c.save();c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,236,190,'+((1-q)*.9*al).toFixed(2)+')';c.lineWidth=(1-q)*4+1;c.beginPath();c.arc(r.x,r.y,R2,0,6.283);c.stroke();
    if(k<6){const g=c.createRadialGradient(r.x,r.y,0,r.x,r.y,R2*.8);g.addColorStop(0,'rgba(255,255,240,'+((1-k/6)*al).toFixed(2)+')');g.addColorStop(1,'rgba(255,220,150,0)');c.fillStyle=g;c.fillRect(r.x-R2,r.y-R2,R2*2,R2*2)}
    c.restore()}
  c.save();c.globalCompositeOperation='lighter';for(const m of A.motes){c.globalAlpha=Math.min(1,m.l/20)*.9*al;c.fillStyle=m.col;c.fillRect(m.x,m.y,1.4,1.4)}c.restore();c.globalAlpha=1;
  drawFX(c,A,al);
  // what they call out, in bubbles over their heads
  for(const sb of A.says){const k=t-sb.t0;if(k<0||k>sb.l)continue;const a=Math.min(1,k/4)*Math.min(1,(sb.l-k)/8)*al,sc=k<5?.6+.4*SSd(k/5):1;
    const bx0=sb.m?sb.m.x:sb.x,by0=sb.m?sb.m.y-80:sb.y,jit=!sb.person&&k<8?(k%2?(sb.big?2:1):-(sb.big?2:1)):0;
    OV.push(()=>{ctx.save();ctx.globalAlpha=a;const fs=Math.round((sb.big?15:13)*sc);ctx.font='bold '+fs+'px ui-monospace,Menlo,Consolas,monospace';const text=GRm(sb.w);
      const w=ctx.measureText(text).width+12,cx=Math.max(w/2+4,Math.min(LW*2-w/2-4,bx0*2+jit)),bx=Math.round(cx-w/2),by=Math.round(by0*2-26-(sb.person?0:k*.25));
      ctx.fillStyle='#181018';ctx.fillRect(bx-2,by-2,w+4,fs+11);ctx.fillStyle=sb.person?'#fff6d8':'#fffaf0';ctx.fillRect(bx,by,w,fs+7);
      ctx.fillStyle='#181018';ctx.fillRect(Math.round(bx0*2)-3,by+fs+7,6,4);ctx.fillStyle=sb.big?'#7a1020':'#2a1a3a';ctx.textAlign='center';ctx.fillText(text,cx,by+fs+1);ctx.textAlign='left';ctx.restore()})}
}
