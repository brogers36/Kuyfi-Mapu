/* ============================================================
   RETRO GRAPHICS (drawn at 256x224, shown at 2x)
   ============================================================ */
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x]}
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function ell(c,cx,cy,rx,ry,col){if(rx<=0||ry<=0)return;c.fillStyle=col;for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){const dy=(y+.5-cy)/ry;if(Math.abs(dy)>1)continue;const hw=rx*Math.sqrt(1-dy*dy);const x0=Math.round(cx-hw),x1=Math.round(cx+hw);if(x1>x0)c.fillRect(x0,y,x1-x0,1)}}
function outline(cvs,col){const x=cvs.getContext('2d'),w=cvs.width,h=cvs.height,d=x.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);const [r,g,b]=hexRGB(col);
  for(let y=0;y<h;y++)for(let X=0;X<w;X++){const i=(y*w+X)*4;if(a[i+3]>40)continue;
    if((X+1<w&&a[i+7]>200)||(X>0&&a[i-1]>200)||(y+1<h&&a[i+w*4+3]>200)||(y>0&&a[i-w*4+3]>200)){o[i]=r;o[i+1]=g;o[i+2]=b;o[i+3]=255}}
  d.data.set(o);x.putImageData(d,0,0);return cvs}
function mirror(src){const [c,x]=mk(src.width,src.height);x.translate(src.width,0);x.scale(-1,1);x.drawImage(src,0,0);return c}
/* cel shading: three flat tones (highlight / base / shadow), light from the top-left */
function cel(cvs,str){
  const x=cvs.getContext('2d'),w=cvs.width,h=cvs.height,d=x.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);
  const op=(X,Y)=>X>=0&&Y>=0&&X<w&&Y<h&&a[(Y*w+X)*4+3]>128;let minY=h,maxY=0;
  for(let y=0;y<h;y++)for(let X=0;X<w;X++)if(a[(y*w+X)*4+3]>128){if(y<minY)minY=y;if(y>maxY)maxY=y}
  const span=Math.max(1,maxY-minY),k=Math.max(1,Math.round(w/24));
  for(let y=0;y<h;y++)for(let X=0;X<w;X++){const i=(y*w+X)*4;if(a[i+3]<=128)continue;
    let l=(.4-(y-minY)/span)*.5;if(!op(X-k,y-k))l+=.5;if(!op(X+k,y+k)||!op(X+2*k,y+2*k))l-=.5;l*=str||1;
    if(l>.25)for(let c=0;c<3;c++)o[i+c]=a[i+c]+(255-a[i+c])*.3;
    else if(l<-.2){o[i]=a[i]*.68;o[i+1]=a[i+1]*.68;o[i+2]=Math.min(255,a[i+2]*.78)}}
  d.data.set(o);x.putImageData(d,0,0);return cvs}
const lerp3=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
/* crisp text on the 2x canvas, positioned in 1x coordinates */
function txt(s,x,y,col,size,align){ctx.font='bold '+size+'px ui-monospace,Menlo,Consolas,monospace';ctx.textAlign=align||'left';ctx.fillStyle='#000';
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1]])ctx.fillText(s,x*2+dx,y*2+dy);ctx.fillStyle=col;ctx.fillText(s,x*2,y*2);ctx.textAlign='left'}

/* ---------- characters from hand-drawn 16x24 templates ---------- */
const SKINT=[['#ecb88c','#c48a5c'],['#e0a474','#b67a4a'],['#cc8c5a','#9e663a'],['#b0713e','#845026'],['#8f5730','#663c1e']];
const EYET=['#1c120e','#32200f','#4c3014','#6b4a1e','#3f4f2e','#3e6490'];
const HAIRT=[['#201820','#584860'],['#241a14','#5a4638'],['#33241a','#6e5440'],['#4a3524','#8a6a4c'],['#45261c','#7e4a38']];
const BASEP={o:'#181018',s:'#e8a878',S:'#c07850',h:'#201820',H:'#584860',b:'#d83030',B:'#f8d050',p:'#3050b0',P:'#203878',w:'#f0e8d0',r:'#d83030',l:'#5a4430',L:'#3a2a1c',f:'#6a3a1a',e:'#201018',W:'#ffffff',m:'#a04838',q:'#f09878',x:'#e0e0f0',X:'#9898b0',k:'#282438',K:'#14121e',c:'#8a2458',C:'#5a1838'};
const LOOKS={
  llanka:{t:'M',fixedSkin:1},
  millaray:{t:'F',r:'#2a64c8',c:'#8a2458',fixedSkin:1},
  ayelen:{t:'F',fixedSkin:1,c:'#2a2634',C:'#18151f',r:'#c83030',s:'#b47446',S:'#80492a',q:'#c4865a'},          // black küpam, red trariwe, darker skin than Millaray
  kallfurungi:{t:'M',fixedSkin:1,p:'#3e3c46',P:'#26252c',b:'#5a3ab8',B:'#c8b8ff',r:'#5a3ab8',w:'#e8e2f0',s:'#94603a',S:'#643820',q:'#a6704a'},   // charcoal makuñ, kallfü (violet-blue) trarilonko, darker skin than Llanka
  kuku:{t:'F',fixedSkin:1,h:'#c8c8d0',H:'#f4f4fa',s:'#d09868',S:'#a87048',c:'#4a2a5a',C:'#2e1a3a',r:'#c03030'},
  lonko:{t:'M',p:'#6a2818',P:'#481408',w:'#f0dca0',r:'#202020',b:'#c82828'},
  seller:{t:'M',p:'#9a6a30',P:'#6e4a1c',b:'#2f8d4a',r:'#2f8d4a',s:'#d8986a'},
  fisher:{t:'M',p:'#4a6a5a',P:'#30483c',b:'#2a64a8',r:'#2a64a8',s:'#c88858'},
  fisherw:{t:'F',c:'#2a64a8',C:'#1a4078',r:'#e0b040'},
  weaver:{t:'F',c:'#c06020',C:'#8a4010',r:'#d83030'},
  cook:{t:'F',c:'#2f8d4a',C:'#1c6030',r:'#e0b040'},
  teacher:{t:'F',c:'#d8a020',C:'#a07010',r:'#2a64c8'},
  gatherer:{t:'F',c:'#8a2458',C:'#5a1838',r:'#2f8d4a'},
  child:{t:'M',p:'#8e2c4c',P:'#661c34',b:'#e8641e',r:'#e8641e',small:1},
  childf:{t:'F',c:'#e8641e',C:'#a8440e',r:'#2f8d4a',small:1},
  palinA:{t:'M',p:'#c02828',P:'#801818',b:'#f8f8f8',r:'#f8f8f8',w:'#f8f8f8'},
  palinB:{t:'M',p:'#2a64c8',P:'#1a4088',b:'#f8f8f8',r:'#f8f8f8',w:'#f8f8f8'},
  walker:{t:'M',p:'#7a6a4a',P:'#5a4a30',b:'#c0a020',r:'#c0a020'},
  kona:{t:'M',p:'#2a5a3a',P:'#1a3a26',b:'#f0f0f0',r:'#e0b040'},
  lonko2:{t:'M',p:'#3a3a6a',P:'#24244a',w:'#e8d8a0',r:'#c82828',b:'#c82828',s:'#c47c4c',S:'#985830'},
  lonko4:{t:'M',p:'#2a4a6a',P:'#1a3048',w:'#e8e0c8',r:'#c82828',b:'#c82828',s:'#c08458',S:'#8e5c36'},
  lonko3:{t:'M',p:'#6a4a2a',P:'#4a3018',w:'#f0e0b0',r:'#2a64c8',b:'#2a64c8',s:'#c88050',S:'#9a5a30'},
  lonko5:{t:'M',p:'#6a2a2a',P:'#481a1a',w:'#f0ead0',r:'#e0b040',b:'#e0b040',s:'#b87848',S:'#8a5630'},
  chumpall:{t:'F',fixedSkin:1,h:'#2aa8b8',H:'#7ae0e8',c:'#145a74',C:'#0a3a50',r:'#7ae0c0',b:'#7ae0c0',s:'#9accc8',S:'#5e9a96'},
  chumpallm:{t:'M',p:'#145a74',P:'#0a3a50',w:'#7ae0e8',r:'#7ae0c0',b:'#2aa8b8',s:'#9accc8',S:'#5e9a96'},
  elder2:{t:'F',h:'#c8c8d0',H:'#f0f0f8',c:'#3a5a8a',C:'#24406a',r:'#e0b040',s:'#c08858',S:'#8a5a34'},
  machi:{t:'F',c:'#28386e',C:'#1a2650',r:'#ccd4e2'},
  elder:{t:'M',h:'#c8c8d0',H:'#f0f0f8',p:'#5a4a3a',P:'#3a2e24',b:'#8a2458',r:'#e8d8a0',s:'#b8784c',S:'#8a5634'}};
const CCACHE={};
function charSprite(look,dir,fr,tn,ey,hr){
  fr=[0,1,0,2][fr%4];const key=look+dir+fr+':'+(tn==null?'-':tn)+(ey==null?'-':ey)+(hr==null?'-':hr);if(CCACHE[key])return CCACHE[key];
  if(dir==='left')return CCACHE[key]=mirror(charSprite(look,'right',fr===1?1:fr===2?3:0,tn,ey,hr));
  const L0=LOOKS[look],pal=Object.assign({},BASEP,L0),F=L0.t==='F',d=dir==='up'?'U':dir==='right'?'R':'D';
  if(!L0.fixedSkin){if(tn!=null){pal.s=SKINT[tn][0];pal.S=SKINT[tn][1];pal.q=ctShade(SKINT[tn][0],.1)}if(ey!=null)pal.e=EYET[ey];if(hr!=null&&!L0.h){pal.h=HAIRT[hr][0];pal.H=HAIRT[hr][1]}}
  const head=SPR[(F?'HEAD_F_':'HEAD_M_')+d],body=SPR[(F?'BODY_F_':'BODY_M_')+d],legs=SPR[(F?'LEGSF_':'LEGS_')+(d==='R'?'R':'D')][fr];
  const rows=head.concat(body,legs),[cvs,c]=mk(16,24);
  rows.forEach((r,y)=>{for(let x=0;x<16;x++){const ch=r[x];if(ch!=='.'){c.fillStyle=pal[ch]||'#ff00ff';c.fillRect(x,y,1,1)}}});
  return CCACHE[key]=cvs;
}
/* ---------- Chrono Trigger-style characters (CT preview only) ---------- */
function ctShade(hex,t){const [r,g,b]=hexRGB(hex);const f=v=>Math.max(0,Math.min(255,Math.round(t<0?v*(1+t):v+(255-v)*t)));return 'rgb('+f(r)+','+f(g)+','+f(b)+')'}
function ctCharSprite(look,dir,fr,seated,tn,ey,hr){
  const key='S3'+look+dir+fr+(seated?'z':'')+':'+tn+ey+hr;if(CCACHE[key])return CCACHE[key];
  return CCACHE[key]=repaintSmall(ctCharSpriteRaw(look,dir,fr,seated,tn,ey,hr),{amp:.85})}
function ctCharSpriteRaw(look,dir,fr,seated,tn,ey,hr){
  const key='ct'+look+dir+fr+(seated?'z':'')+':'+(tn==null?'-':tn)+(ey==null?'-':ey)+(hr==null?'-':hr);if(CCACHE[key])return CCACHE[key];
  if(dir==='left')return CCACHE[key]=mirror(ctCharSpriteRaw(look,'right',fr,seated,tn,ey,hr));
  const L0=LOOKS[look],pal=Object.assign({},BASEP,L0),F=L0.t==='F',small=!!L0.small;
  if(!L0.fixedSkin){if(tn!=null){pal.s=SKINT[tn][0];pal.S=SKINT[tn][1];pal.q=ctShade(SKINT[tn][0],.1)}if(ey!=null)pal.e=EYET[ey];if(hr!=null&&!L0.h){pal.h=HAIRT[hr][0];pal.H=HAIRT[hr][1]}}
  const W=18,H=small?26:32,g=[...Array(H)].map(()=>Array(W).fill(null));
  const P=(x,y,m)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<W&&y>=0&&y<H)g[y][x]=m};
  const E=(cx,cy,rx,ry,m)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)g[y][x]=m};
  const Rr=(x,y,w,h,m)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)P(xx,yy,m)};
  const st=[0,1,0,2][fr%4];               // 0 stand, 1 left step, 2 right step
  const tY=14,tH=small?6:9,lY=tY+tH,lH=small?4:7;   // torso top/height, legs top/height
  const R=dir==='right',U=dir==='up';
  // ---- legs / feet ----
  if(seated){
    // folded legs: a lap in front, feet tucked at the sides
    const lc=F?'c':'l';
    if(R){Rr(6,lY,8,2,lc);Rr(12,lY+1,2,1,'f')}
    else{Rr(4,lY,10,2,lc);P(4,lY+2,'f');P(5,lY+2,'f');P(12,lY+2,'f');P(13,lY+2,'f')}
  } else if(!F||U||R){
    if(R){const a=st===1?-1:st===2?1:0;Rr(7+a,lY,3,lH-1,'l');Rr(9-a,lY,3,lH-1,'L');Rr(6+a*2,lY+lH-1,4,1,'f');Rr(9-a*2,lY+lH-1,4,1,'f')}
    else{const a=st===1?1:0,b=st===2?1:0;Rr(5,lY,3,lH-1-a,'l');Rr(10,lY,3,lH-1-b,'l');Rr(4,lY+lH-1-a,4,1,'f');Rr(10,lY+lH-1-b,4,1,'f')}
  } else {Rr(5,lY+lH-2,3,2,'f');Rr(10,lY+lH-2,3,2,'f')}
  // ---- torso ----
  const tc=F?'c':'p';
  if(R){Rr(6,tY,7,tH,tc);if(F&&!seated)for(let y=0;y<lH-1;y++)Rr(6-(y>>1),lY+y,7+(y>>1)+(y>>2),1,tc)}
  else{E(9,tY+2,5.2,2.6,tc);Rr(4,tY+1,10,tH-1,tc);if(F&&!seated)for(let y=0;y<lH-1;y++)Rr(4-(y>>2),lY+y,10+((y>>2)*2),1,tc)}
  // pattern band / belt
  const by=tY+tH-3;
  if(!U||F){if(R)Rr(6,by,7,1,'r');else Rr(4,by,10,1,'r');for(let x=(R?6:4);x<(R?13:14);x+=2)P(x,by+1,'w')}
  if(F&&!U){Rr(7,tY+1,4,1,'x');P(8,tY+2,'x');P(9,tY+2,'X')}   // trapelakucha
  // ---- arms & hands ----
  if(R){const a=st===1?-1:st===2?1:0;Rr(9+a,tY+1,2,tH-2,tc==='c'?'C':'P');Rr(9+a*2,tY+tH-1,2,2,'s')}
  else{const a=st===1?-1:st===2?1:0;Rr(2,tY+1+a,2,tH-2,tc==='c'?'C':'P');Rr(14,tY+1-a,2,tH-2,tc==='c'?'C':'P');Rr(2,tY+tH-1+a,2,2,'s');Rr(14,tY+tH-1-a,2,2,'s')}
  // ---- head ----
  const hx=R?8:9;
  if(U){E(9,7.4,7.4,7,'h');if(F){E(9,15,6.2,8,'h')}else E(9,12,5,2.6,'h')}
  else if(R){
    if(F)E(hx-2,14,4.2,7,'h');
    E(hx-.5,7.4,7,6.8,'h');E(hx+2.6,10.2,4.4,4.6,'s');P(hx+7,11,'s');P(hx+7,10,'s');
    Rr(hx,4,6,2,'h');Rr(hx+1,6,5,1,'h');P(hx+6,6,'h');P(hx+3,7,'h');
    Rr(hx-1,8,2,6,'h');P(hx+1,10,'S');P(hx+1,11,'S');
  } else {
    if(F){Rr(2,8,3,11,'h');Rr(13,8,3,11,'h');P(2,19,'.');P(15,19,'.')}
    E(9,7.4,7.4,6.8,'h');E(9,10.4,5.4,5,'s');
    for(let x=4;x<14;x++){const fy=6+(x%3===1?2:x%3===2?1:0);for(let y=4;y<=fy;y++)P(x,y,'h')}
    Rr(3,8,2,5,'h');Rr(13,8,2,5,'h');
  }
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.')g[y][x]=null;
  // headband (trarilonko) for men, band for women
  if(!small){if(!F){if(R)Rr(hx-6,5,13,1,'b');else if(!U)Rr(2,5,14,1,'b');else Rr(2,6,14,1,'b');for(let x=(R?hx-5:3);x<(R?hx+6:15);x+=3)P(x,U?6:5,'B')}
    else if(!U)Rr(R?hx-4:3,4,R?9:12,1,'b')}
  // ---- face ----
  if(!U){
    if(R){P(hx+4,8,'h');P(hx+5,8,'h');P(hx+4,9,'e');P(hx+5,9,'e');P(hx+4,10,'e');P(hx+5,10,'W');P(hx+4,11,'e');P(hx+5,11,'e');P(hx+6,13,'m');P(hx+3,12,'q')}
    else{P(6,8,'h');P(7,8,'h');P(11,8,'h');P(12,8,'h');
      for(const ex of [6,11]){P(ex,9,'e');P(ex+1,9,'e');P(ex,10,'e');P(ex+1,10,'e');P(ex,11,'e');P(ex+1,11,'e')}
      P(7,9,'W');P(12,9,'W');P(9,12,'S');P(8,13,'m');P(9,13,'m');P(5,12,'q');P(13,12,'q')}
  }
  // ---- render with shading + selective outline ----
  const [cvs,c]=mk(W,H),lit=(x,y,m)=>{const n=(xx,yy)=>xx<0||yy<0||xx>=W||yy>=H?null:g[yy][xx];return [n(x-1,y)!==m||n(x,y-1)!==m,n(x+1,y)!==m||n(x,y+1)!==m]};
  const base=m=>({h:pal.h,s:pal.s,S:pal.S,p:pal.p,P:pal.P,c:pal.c,C:pal.C,b:pal.b,B:pal.B,r:pal.r,w:pal.w,l:pal.l,L:pal.L,f:pal.f,e:pal.e,W:'#ffffff',m:pal.m,q:pal.q,x:pal.x,X:pal.X})[m]||'#ff00ff';
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const m=g[y][x];if(!m)continue;let col=base(m);
    if('hspPcCl'.includes(m)){const [tl,br]=lit(x,y,m);if(tl&&!br)col=ctShade(col,.22);else if(br&&!tl)col=ctShade(col,-.3);else if(br&&tl)col=ctShade(col,-.1)}
    if(m==='h'&&!U&&((x+y)%5===0)&&y<6)col=ctShade(pal.H||pal.h,.15);
    if(m==='h'&&y>=1&&y<=3&&x>=(R?hx-3:6)&&x<=(R?hx+1:10)&&(x+y)%2===0)col=ctShade(pal.H||pal.h,.25);
    if(m==='s'&&x>(R?hx+3:11)&&y>11)col=ctShade(pal.S,0);
    c.fillStyle=col;c.fillRect(x,y,1,1)}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x])continue;let nb=null;for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&g[yy][xx]){nb=g[yy][xx];break}}
    if(nb){c.fillStyle=ctShade(base(nb),-.72);c.fillRect(x,y,1,1)}}
  if(seated){const hh=lY+4,[cv2,c2]=mk(W,hh);c2.drawImage(cvs,0,0,W,hh,0,0,W,hh);return CCACHE[key]=cv2}
  return CCACHE[key]=cvs;
}
function drawChar(c,look,x,y,dir,fr,seated,tn,ey,hr){
  if(CT){const L0=LOOKS[look],s=ctCharSprite(look,dir,[0,1,0,2][fr%4]===0?0:fr%4,false,tn,ey,hr),Hh=s.height;
    ell(c,x+9,y+15,7,2.4,'rgba(0,10,20,.3)');
    if(seated){const ss=ctCharSprite(look,dir==='left'?'left':dir,0,true,tn,ey,hr);c.drawImage(ss,x-1,y+16-ss.height+1);return}
    c.drawImage(s,x-1,y+16-Hh);return}
  ell(c,x+8,y+14,6,2,'rgba(0,0,0,.3)');
  const s=charSprite(look,dir,fr,tn,ey,hr);
  if(seated){c.drawImage(s,0,0,16,19,x,y-5,16,19);return}
  if(LOOKS[look].small)c.drawImage(s,x+2,y-4,12,18);else c.drawImage(s,x,y-9);
}
const DOG=["................","..oo............",".obbo........o..",".obbboooooooobo.",".obebbbbbbbbbbo.","..oobbbbbbbbbo..","....obbbbbbbbo..","....oboo..obo...","....obo...obo...","....oo....oo...."];
const DOG2=["................","..oo............",".obbo.........o.",".obbbooooooooob.",".obebbbbbbbbbbo.","..oobbbbbbbbbo..","....obbbbbbbbo..","...obo.....obo..","...obo....obo...","...oo.....oo...."];
function dogSprite(fr,dir){const key='dog'+fr+dir;if(CCACHE[key])return CCACHE[key];const [cvs,c]=mk(16,10);
  (fr?DOG2:DOG).forEach((r,y)=>{for(let x=0;x<16;x++){const ch=r[x];if(ch!=='.'){c.fillStyle=ch==='o'?'#181018':ch==='e'?'#000':'#a06838';c.fillRect(x,y,1,1)}}});
  return CCACHE[key]=repaintSmall(dir==='right'?mirror(cvs):cvs,{amp:.85,capG:3})}
function drawPortal(c,x,y){
  const t=frame;
  // light pillar
  const grd=c.createLinearGradient(0,y-34,0,y+6);grd.addColorStop(0,'rgba(200,170,255,0)');grd.addColorStop(.6,'rgba(190,150,255,.22)');grd.addColorStop(1,'rgba(230,210,255,.38)');
  c.fillStyle=grd;c.fillRect(x-9,y-34,18,40);
  ell(c,x,y+4,12,4,'rgba(120,70,200,.35)');
  for(let ring=0;ring<3;ring++){
    c.save();c.strokeStyle=['rgba(220,180,255,.9)','rgba(150,190,255,.75)','rgba(255,255,255,.6)'][ring];c.lineWidth=1.6;
    c.setLineDash([5,7]);c.lineDashOffset=(t*(ring%2?1.5:-1.2))%12;
    c.beginPath();c.ellipse(x,y-6,11-ring*2.6,14-ring*3.2,Math.sin(t/40+ring)*.25,0,6.283);c.stroke();c.restore()}
  ell(c,x,y-6,3.5,6,'rgba(240,228,255,.9)');ell(c,x,y-6,1.8,3.4,'#ffffff');
  for(let k=0;k<8;k++){const a=t/14+k*.785;R(c,Math.round(x+Math.cos(a)*13),Math.round(y-6+Math.sin(a)*15),2,2,k%2?'#e8d0ff':'#9ad0ff')}
  if(t%50<4)ell(c,x,y-6,15,18,'rgba(255,255,255,.18)');
}
function drawNgen(c,x,y,s,t,v){
  const name=v==='mawida'?'ngen_mawida':v==='pewen'?'ngen_pewen':v==='kuruf'?'ngen_kuruf':v==='lelfun'?'ngen_lelfun':'ngen_lafken',au={ngen_lafken:'160,220,255',ngen_mawida:'200,240,140',ngen_pewen:'255,220,140',ngen_kuruf:'200,250,255',ngen_lelfun:'255,236,150'}[name];
  const k0=Math.max(1,Math.round(s)),fr=Math.floor(t/20)%2,hb=typeof SPR2!=='undefined'&&SPR2[name+'@b'];
  const k=hb?Math.max(1,Math.round(s/2)):k0,cvs=hb?tplCanvas(name+'@b',fr,k):tplCanvas(name,fr,k0),w=cvs.width,h=cvs.height,bob=Math.round(Math.sin(t/25)*Math.max(1,k));
  for(const [r,a] of [[1.15,.07],[.9,.1],[.7,.14]])ell(c,x,y-h/2+bob,w*.6*r,h*.55*r,'rgba('+au+','+a+')');
  c.drawImage(cvs,Math.round(x-w/2),Math.round(y-h+bob));
  for(let i=0;i<6;i++){const a=t/20+i*1.05,kk=Math.max(1,hb?k*2:k);R(c,x+Math.round(Math.cos(a)*w*.62),y-Math.round(h/2)+Math.round(Math.sin(a)*h*.45),kk,kk,'rgba('+au+',.9)')}
}

/* ---------- enemies (designed on a 16-unit grid, cel-shaded at any size) ---------- */
const ECACHE={};
function shade3d(src,o){
  o=o||{};
  const w=src.width,h=src.height;
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const c=cv.getContext('2d');c.drawImage(src,0,0);
  const img=c.getImageData(0,0,w,h),d=img.data,n=w*h;
  const A=new Float32Array(n);
  for(let i=0;i<n;i++)A[i]=d[i*4+3]>40?1e9:0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(!A[i])continue;let m=A[i];
    if(x>0)m=Math.min(m,A[i-1]+1);if(y>0)m=Math.min(m,A[i-w]+1);
    if(x>0&&y>0)m=Math.min(m,A[i-w-1]+1.4);if(x<w-1&&y>0)m=Math.min(m,A[i-w+1]+1.4);A[i]=m}
  for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x;if(!A[i])continue;let m=A[i];
    if(x<w-1)m=Math.min(m,A[i+1]+1);if(y<h-1)m=Math.min(m,A[i+w]+1);
    if(x<w-1&&y<h-1)m=Math.min(m,A[i+w+1]+1.4);if(x>0&&y<h-1)m=Math.min(m,A[i+w-1]+1.4);A[i]=m}
  const cap=o.cap||Math.max(5,Math.round(Math.min(w,h)/9)),str=o.str||1.9,dz=o.dith==null?0.1:o.dith;
  const H=i=>Math.min(A[i],cap);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,q=i*4;if(d[q+3]<=40)continue;
    const r=d[q],g=d[q+1],bl=d[q+2];
    if(r+g+bl<45)continue;
    const hl=H(x>1?i-2:i),hr=H(x<w-2?i+2:i),hu=H(y>1?i-2*w:i),hd=H(y<h-2?i+2*w:i);
    let lu=((hr-hl)*0.55+(hd-hu)*0.95)/4*str;
    lu-=Math.max(0,(y/h-0.5))*1.1*str;
    const v=lu+((x+y)&1?dz:-dz);
    let f=0;
    if(v>0.6)f=0.55;else if(v>0.3)f=0.3;else if(v>0.12)f=0.14;
    else if(v<-0.6)f=-0.45;else if(v<-0.3)f=-0.26;else if(v<-0.12)f=-0.13;
    if(o.rim!==0&&A[i]<=2&&lu>0.18)f=Math.max(f,0.7);
    if(o.k)f*=o.k;
    if(f>0&&o.mult){d[q]=Math.min(255,r*(1+f)+14*f);d[q+1]=Math.min(255,g*(1+f)+12*f);d[q+2]=Math.min(255,bl*(1+f*.9)+8*f)}
    else if(f>0){d[q]=Math.min(255,r+(255-r)*f+12*f);d[q+1]=Math.min(255,g+(255-g)*f+10*f);d[q+2]=Math.min(255,bl+(255-bl)*f)}
    else if(f<0){const k=1+f;d[q]=r*k;d[q+1]=g*k*0.96;d[q+2]=Math.min(255,bl*k*1.12)}
  }
  c.putImageData(img,0,0);return cv}
/* Small-sprite repaint: the same 3D method as the bosses (tools/repaint.py), ported for the
   runtime-built characters. Every colour is a part with its own 7-step ramp (cool shadows,
   warm lights); the height field mixes the whole silhouette with each part, lit from the upper
   left; bands are lightly dithered; seams between parts darken on their shadow side; a cool
   sky rim runs down the back edge. Near-black pixels (outline, pupils, mouths) stay crisp. */
function repaintSmall(src,o){
  o=o||{};const w=src.width,h=src.height,cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const c=cv.getContext('2d');c.drawImage(src,0,0);const img=c.getImageData(0,0,w,h),d=img.data,n=w*h;
  const key=new Int32Array(n),sol=new Uint8Array(n),dark=new Uint8Array(n);
  for(let i=0;i<n;i++){const q=i*4;if(d[q+3]>40){sol[i]=1;key[i]=(d[q]<<16)|(d[q+1]<<8)|d[q+2];if(d[q]+d[q+1]+d[q+2]<70)dark[i]=1}else key[i]=-1}
  const body=i=>sol[i]&&!dark[i];
  // global distance (whole figure, outline counts as figure) and per-part distance (same colour only)
  const G=new Float32Array(n),Pd=new Float32Array(n),INF=1e9;
  for(let i=0;i<n;i++){G[i]=sol[i]?INF:0;Pd[i]=body(i)?INF:0}
  const same=(i,j)=>key[i]===key[j];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;
    if(G[i]){let m=G[i];if(x>0)m=Math.min(m,G[i-1]+1);if(y>0)m=Math.min(m,G[i-w]+1);if(x>0&&y>0)m=Math.min(m,G[i-w-1]+1.4);if(x<w-1&&y>0)m=Math.min(m,G[i-w+1]+1.4);G[i]=m}
    if(Pd[i]){let m=Pd[i];if(x===0||!same(i,i-1))m=Math.min(m,1);else m=Math.min(m,Pd[i-1]+1);if(y===0||!same(i,i-w))m=Math.min(m,1);else m=Math.min(m,Pd[i-w]+1);Pd[i]=m}}
  for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x;
    if(G[i]){let m=G[i];if(x<w-1)m=Math.min(m,G[i+1]+1);if(y<h-1)m=Math.min(m,G[i+w]+1);if(x<w-1&&y<h-1)m=Math.min(m,G[i+w+1]+1.4);if(x>0&&y<h-1)m=Math.min(m,G[i+w-1]+1.4);G[i]=m}
    if(Pd[i]){let m=Pd[i];if(x===w-1||!same(i,i+1))m=Math.min(m,1);else m=Math.min(m,Pd[i+1]+1);if(y===h-1||!same(i,i+w))m=Math.min(m,1);else m=Math.min(m,Pd[i+w]+1);Pd[i]=m}}
  const cg=o.capG||Math.max(4,Math.min(w,h)/3.2),cp=o.capP||3,H=new Float32Array(n);
  for(let i=0;i<n;i++){if(!sol[i])continue;const g=Math.min(G[i],cg),p=Math.min(Pd[i]||0,cp);H[i]=Math.sqrt(g/cg)*cg*.62+Math.sqrt(p/cp)*cp*.5}
  const L=[-0.62,-0.62,0.48],ln=Math.hypot(...L);L[0]/=ln;L[1]/=ln;L[2]/=ln;
  const BY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],ST=[-.78,-.56,-.34,-.14,.06,.27,.48],amp=o.amp||1;
  const out=new Uint8ClampedArray(d);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,q=i*4;if(!body(i))continue;
    const hl=H[x>0?i-1:i],hr=H[x<w-1?i+1:i],hu=H[y>0?i-w:i],hd=H[y<h-1?i+w:i];
    let nx=-(hr-hl)/2,ny=-(hd-hu)/2,nz=1;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
    let lum=((nx*L[0]+ny*L[1]+nz*L[2])-.15)/.85-(y/h)*.10+(o.lift==null?.16:o.lift);
    const t=Math.max(0,Math.min(.999,lum))*6,k=Math.max(0,Math.min(6,Math.floor(t+(BY[y&3][x&3]/16-.5)*.4))),s=ST[k]*amp*(ST[k]<0?(o.sh||.6):1);
    const r=d[q],g=d[q+1],b=d[q+2];
    if(s<0){const sr=r*.30+6,sg=g*.32+6,sb=b*.42+22;out[q]=r+(sr-r)*-s;out[q+1]=g+(sg-g)*-s;out[q+2]=b+(sb-b)*-s}
    else{out[q]=r+(255-r)*s;out[q+1]=g+(244-g)*s;out[q+2]=b+(222-b)*s}}
  // seams on the shadow side between differently coloured parts
  const o2=new Uint8ClampedArray(out);
  for(let y=1;y<h;y++)for(let x=1;x<w;x++){const i=y*w+x,q=i*4;if(!body(i))continue;
    if((body(i-1)&&!same(i,i-1))||(body(i-w)&&!same(i,i-w))){o2[q]=out[q]*.8;o2[q+1]=out[q+1]*.8;o2[q+2]=out[q+2]*.84}}
  // rim light on the back edge (just inside the outline), cool sky light
  for(let y=0;y<h;y++)for(let x=1;x<w-1;x++){const i=y*w+x,q=i*4;if(!body(i))continue;
    if(x+1<w&&(!sol[i+1]||dark[i+1])&&(x+2>=w||!body(i+2))&&body(i-1)){o2[q]=o2[q]*.62+190*.38;o2[q+1]=o2[q+1]*.62+210*.38;o2[q+2]=o2[q+2]*.62+255*.38}}
  // outline: the lit (upper/left) contour warms slightly so the silhouette is not a flat black cut-out
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,q=i*4;if(!dark[i])continue;
    const outL=x===0||!sol[i-1],outU=y===0||!sol[i-w];if((outL||outU)&&(x<w-1&&body(i+1)||y<h-1&&body(i+w))){o2[q]=Math.min(255,d[q]+26);o2[q+1]=Math.min(255,d[q+1]+20);o2[q+2]=Math.min(255,d[q+2]+24)}}
  img.data.set(o2);c.putImageData(img,0,0);return cv}
/* EPX / scale2x on a canvas: doubles the resolution while keeping diagonals smooth */
function scale2xCanvas(src){const w=src.width,h=src.height,a=src.getContext('2d').getImageData(0,0,w,h).data,[cv,c]=mk(w*2,h*2),img=c.createImageData(w*2,h*2),o=img.data;
  const P=(x,y)=>{x=Math.max(0,Math.min(w-1,x));y=Math.max(0,Math.min(h-1,y));const q=(y*w+x)*4;return (a[q+3]>40?1:0)*0x1000000+(a[q]<<16)+(a[q+1]<<8)+a[q+2]};
  const put=(x,y,v)=>{const q=(y*w*2+x)*4;if(!(v>=0x1000000)){o[q+3]=0;return}o[q]=(v>>16)&255;o[q+1]=(v>>8)&255;o[q+2]=v&255;o[q+3]=255};
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const P0=P(x,y),A=P(x,y-1),B=P(x+1,y),C=P(x-1,y),D=P(x,y+1);
    put(x*2,y*2,(C===A&&C!==D&&A!==B)?A:P0);put(x*2+1,y*2,(A===B&&A!==C&&B!==D)?B:P0);
    put(x*2,y*2+1,(D===C&&D!==B&&C!==A)?C:P0);put(x*2+1,y*2+1,(B===D&&B!==A&&D!==C)?D:P0)}
  c.putImageData(img,0,0);return cv}
/* battle-size hero: scale2x then the full 3D repaint at the doubled resolution (finer volume, like the bosses) */
function ctCharSpriteBig(look,dir,fr){const key='BIG'+look+dir+fr;if(CCACHE[key])return CCACHE[key];
  if(dir==='left'&&typeof SPR2!=='undefined'&&SPR2['hero_'+look])return CCACHE[key]=tplCanvas('hero_'+look,fr%4,1);
  const raw=ctCharSpriteRaw(look,dir==='left'?'right':dir,fr,false);let big=withFeet(scale2xCanvas(raw),fr);if(dir==='left')big=mirror(big);
  return CCACHE[key]=repaintSmall(big,{amp:.95,capG:9,capP:5,lift:.14,sh:.7})}
/* side-view feet for the battle sprite: shoes planted under each leg (or peeking from under a long
   dress), pointing forward (right in the raw sprite; mirrored when facing left) */
function withFeet(src,fr){
  const w=src.width,h=src.height,a=src.getContext('2d').getImageData(0,0,w,h).data,al=(x,y)=>a[(y*w+x)*4+3]>40;
  let yb=h-1;while(yb>0&&![...Array(w).keys()].some(x=>al(x,yb)))yb--;
  const segs=[];for(let x=0;x<w;){if(al(x,yb)){let x1=x;while(x1+1<w&&al(x1+1,yb))x1++;segs.push([x,x1]);x=x1+1}else x++}
  const [cv,c]=mk(w+6,yb+1+6);c.drawImage(src,0,0);
  const shoe=(x0,x1,lift)=>{const y=yb+1-lift,len=x1-x0+1+4;
    R(c,x0-1,y-1,len+1,6,'#100a08');                 // outline
    R(c,x0,y,len-1,4,'#3c2618');R(c,x0,y,len-2,1,'#6a4630');R(c,x0+len-3,y+1,2,2,'#2a1a10');   // upper, lit top, toe
    R(c,x0,y+3,len,1,'#16100c');R(c,x0+1,y,1,1,'#8a6244')};       // sole, highlight
  const narrow=segs.filter(([x0,x1])=>x1-x0<=9);
  if(narrow.length&&segs.length>=2){segs.forEach(([x0,x1],k)=>shoe(x0,x1,fr===1&&k===0?1:fr===2&&k===1?1:0))}
  else{const [x0,x1]=segs.reduce((m,s2)=>s2[1]-s2[0]>m[1]-m[0]?s2:m,segs[0]||[0,0]),mid=(x0+x1)>>1;   // long dress: two feet peek out
    shoe(mid-6,mid-2,0);shoe(mid+1,mid+5,fr?1:0)}
  return cv}
function enemyCanvas(t,size,fr){
  if(t==='llawfen'&&typeof llawCanvas==='function')return llawCanvas(size,fr);
  const key='s3:'+t+size+'_'+fr;if(ECACHE[key])return ECACHE[key];
  const raw=enemyCanvasRaw(t,size,fr),sp=typeof SPR2!=='undefined'&&SPR2[t]?((size>=40&&SPR2[t+'@b'])||SPR2[t]):null;return ECACHE[key]=(sp&&sp.hand)?raw:repaintSmall(raw,{amp:.9,capG:Math.max(4,Math.min(raw.width,raw.height)/3.4),capP:4})}
function enemyCanvasRaw(t,size,fr){
  const key=t+size+'_'+fr;if(ECACHE[key])return ECACHE[key];
  if(typeof SPR2!=='undefined'&&SPR2[t]){const d=SPR2[t],hb=size>=40&&SPR2[t+'@b'],k=hb?1:size>=40?(d.big||1):1,base=hb?tplCanvas(t+'@b',fr,1):tplCanvas(t,fr,k);
    if(!d.aura)return ECACHE[key]=base;
    const pd=6*k,[cv,cc]=mk(base.width+pd*2,base.height+pd);
    for(const [r,al] of [[1,.10],[.8,.12],[.6,.14]]){cc.fillStyle='rgba('+d.aura+','+al+')';cc.beginPath();cc.ellipse(cv.width/2,cv.height*.45,cv.width/2*r,cv.height/2*r,0,0,6.283);cc.fill()}
    cc.drawImage(base,pd,pd);return ECACHE[key]=cv}
  const pad=3,s=size/16,[cvs,c]=mk(size+pad*2,size+pad*2);
  const E=(cx,cy,rx,ry,col)=>ell(c,pad+cx*s,pad+cy*s,rx*s,ry*s,col);
  const Q=(x,y,w,h,col)=>R(c,pad+x*s,pad+y*s,Math.max(1,w*s),Math.max(1,h*s),col);
  if(t==='laftrache'||t==='nidol'){const bob=fr?.3:0,big=t==='nidol';
    E(5.5,15,1.8,.8,'#24332a');E(10.5,15,1.8,.8,'#24332a');
    E(8,11.6+bob,4.4,3.6,big?'#2c4a5a':'#3e5a4c');Q(4.4,12.6+bob,7.2,.7,'#6a4a2a');Q(7.6,12.5+bob,.9,.9,'#d8b040');
    E(3.4,11.4+bob,1.3,2.2,'#6f8f7c');E(12.6,11.4+bob,1.3,2.2,'#6f8f7c');
    E(8,6.2+bob,4.7,4.3,'#7e9e8a');E(6.4,4.6+bob,1.6,1.1,'#a4c2ae');E(3.4,6.2+bob,.9,1.3,'#7e9e8a');E(12.6,6.2+bob,.9,1.3,'#7e9e8a');
    E(8,2.8+bob,4.6,1.9,'#244034');for(let i=0;i<5;i++)Q(4+i*1.7,3.2+bob,.6,1.4+(i%2),'#2e5040');
    if(big){for(let i=0;i<5;i++)E(4.5+i*1.75,1.6+bob-(i%2)*.6,.9,1.2,'#3a8a6a');Q(13,7+bob,1.2,7,'#6a4424');E(13.6,6.6+bob,1.5,1.3,'#8a8a96')}
    E(8,9.4+bob,3.6,2.7,'#eef0f2');E(8,11.2+bob,2.3,2.1,'#d4dae0');
    Q(5.6,5.8+bob,1.5,1.2,'#ff3a2a');Q(9,5.8+bob,1.5,1.2,'#ff3a2a');Q(5.9,5.8+bob,.6,.5,'#ffe0d0');Q(9.3,5.8+bob,.6,.5,'#ffe0d0')}
  else if(t==='chonchon'){const wy=fr?-2.6:1.4,w1='#6e4430',w2='#9a6a48',w3='#3e2216';
    for(const sd of [-1,1]){const cx=8+sd*5.2;E(cx,6.5+wy,3.7,2.2,w1);E(cx+sd*.8,7.6+wy,3.1,1.4,w2);E(cx+sd*2.2,6+wy,1.4,1.6,w3);for(let k=0;k<3;k++)Q(cx-.6+sd*(k*1.1),5.2+wy,.4,2.2,w3)}
    E(8,8.2,3.8,4.1,'#d8bf9c');E(8,5,3.8,1.9,'#1e1418');Q(4.4,5,1,3.4,'#1e1418');Q(10.6,5,1,3.4,'#1e1418');
    E(6.5,8.2,1,1,'#ffe040');E(9.5,8.2,1,1,'#ffe040');Q(6.35,7.8,.5,.9,'#000');Q(9.35,7.8,.5,.9,'#000');Q(5.4,7,2,.5,'#2a1a14');Q(8.6,7,2,.5,'#2a1a14');
    E(8,10.9,1.4,.9,'#5a1418');Q(7.3,10.5,.5,.6,'#fff');Q(8.3,10.5,.5,.6,'#fff')}
  else if(t==='anchi'){
    E(8,5.6,2.4,2.4,'#fff6c8');E(8,10.4,2.6,3.2,'#ffe27a');Q(6,13,1.2,2,'#ffe27a');Q(8.8,13,1.2,2,'#f0c040');Q(5,9,1,2.6,'#fff0a0');Q(10.6,9,1,2.6,'#f0c040');
    Q(7,5.4,.7,.8,'#8a5a10');Q(8.6,5.4,.7,.8,'#8a5a10')}
  else if(t==='piwichen'){const wy=fr?-1.6:1;
    for(const sd of [-1,1]){const cx=8+sd*5.4;E(cx,5+wy,3.6,2.4,'#5a2a5a');E(cx+sd*1.4,6.2+wy,2.4,1.2,'#8a4a8a');for(let k=0;k<3;k++)Q(cx-.4+sd*k,3.8+wy,.4,2.6,'#3a1a3a')}
    E(8,12,4.6,2.2,'#2a7a6a');E(10.5,10.4,2.6,1.6,'#3a9a80');E(6,13.4,3,1.2,'#3a9a80');E(8,8.4,2.4,3,'#3a9a80');
    for(let i=0;i<6;i++)Q(5+i*1.2,11.2+(i%2)*.6,.5,.5,'#a8e0c0');
    E(8,5.4,2.6,2.2,'#4ab090');Q(6.6,4.6,.9,.9,'#ff4040');Q(8.6,4.6,.9,.9,'#ff4040');Q(7.4,6.6,1.2,.5,'#200');Q(7.6,7,.3,.8,'#f0f0f0');Q(8.2,7,.3,.8,'#f0f0f0')}
  else if(t==='kolokolo'||t==='fkolokolo'){const big=t==='fkolokolo',bob=fr?.3:0;
    for(let i=0;i<8;i++)E(2.2+i*.5,13.2-Math.sin(i*.7+(fr?1:0))*1.2,.8,.8,'#6a5a4a');
    E(9,11+bob,4.2,3.2,big?'#5a4a5a':'#7a6a5a');E(9,12.4+bob,3,1.6,'#a89888');
    E(11.5,7.2+bob,3.2,2.8,big?'#6a5a6a':'#8a7a6a');E(10.4,4.6+bob,1.3,1.8,'#c09090');E(13,4.6+bob,1.3,1.8,'#c09090');E(10.4,4.8+bob,.6,1,'#704050');E(13,4.8+bob,.6,1,'#704050');
    Q(10.6,6.6+bob,1,1,'#ff3030');Q(12.6,6.6+bob,1,1,'#ff3030');E(14.6,8+bob,.8,.6,'#402828');Q(13.4,9+bob,.4,.8,'#f0f0f0');Q(14,9+bob,.4,.8,'#f0f0f0');
    for(let i=0;i<4;i++)Q(6+i*1.4,14+bob,.5,1,'#4a3a2a');if(big){for(let i=0;i<5;i++)Q(6+i*1.2,8.2+bob,.6,1.2,'#3a2a3a')}}
  else if(t==='nguruvilu'){const wv=fr?.4:0;
    E(4,13,3.6,1.6,'#2a6a5a');E(8,12+wv,3.4,1.8,'#3a8a6a');E(11.5,10-wv,2.4,2.4,'#3a8a6a');E(12,7,2,2.6,'#3a8a6a');for(let i=0;i<6;i++)Q(3+i*1.6,12.2+(i%2)*.5,.6,.6,'#9ad8b0');
    E(10.5,4.4,3.4,2.6,'#d8742a');E(9,2.4,1,1.8,'#d8742a');E(12,2.4,1,1.8,'#d8742a');E(10.5,5.4,2,1.4,'#f4e0c8');E(7.6,5,1.6,1,'#d8742a');Q(6.6,4.6,.8,.8,'#181018');
    Q(9.4,3.8,.8,.8,'#ffe040');Q(11.6,3.8,.8,.8,'#ffe040');Q(9.6,4,.4,.5,'#000');Q(11.8,4,.4,.5,'#000');E(1.4,14,1.4,1,'#d8742a')}
  else if(t==='witranalwe'){const sw=fr?.3:0;
    E(8,15,4,.8,'rgba(0,0,0,.3)');Q(6.4,10,1.2,5,'#1a1a2a');Q(8.6,10,1.2,5,'#1a1a2a');
    for(let y=4;y<11;y++){const hw=1.6+(y-4)*.35;Q(8-hw,y,hw*2,1,'#2a2a44')}Q(6.8,4,2.4,7,'#3a3a5a');
    Q(3.6+sw,5,1,6.5,'#2a2a44');Q(11.4-sw,5,1,6.5,'#2a2a44');Q(3.4+sw,11.4,1.4,1,'#c8d8f0');Q(11.2-sw,11.4,1.4,1,'#c8d8f0');
    E(8,2.6,1.8,1.8,'#c8d8f0');Q(5,1.2,6,.9,'#1a1a2a');Q(6.2,.2,3.6,1.2,'#1a1a2a');Q(7.2,2.4,.6,.5,'#40e0ff');Q(8.4,2.4,.6,.5,'#40e0ff');
    for(let i=0;i<5;i++)Q(5+i*1.5,7+(i%2),.4,.4,'#c8d8f0')}
  else if(t==='trelke'){const wb=fr?.25:0;
    E(8,9,7.6,5.4+wb,'#6c4020');E(4,8.2,3.4,4.2,'#6c4020');E(12,8.2,3.4,4.2,'#6c4020');E(8,9,6.6,4.4,'#8a5630');
    E(5.5,8,2,1.4,'#efe4d0');E(11,10.6,1.9,1.2,'#efe4d0');E(9.4,6.4,1.4,1,'#efe4d0');E(4.4,11,1.2,.9,'#efe4d0');
    for(let k=0;k<18;k++){const a=k/18*Math.PI*2,px=8+Math.cos(a)*7.9,py=9+Math.sin(a)*(5.9+wb);Q(px-.3,py-.3,.8,.8,'#f6f0e4')}
    E(6.2,8.6,1.5,1.2,'#ffd400');E(9.8,8.6,1.5,1.2,'#ffd400');Q(6.05,7.9,.4,1.4,'#200');Q(9.65,7.9,.4,1.4,'#200');
    Q(5,11.6,6,.5,'#2a1006');for(let i=0;i<6;i++)Q(5.2+i*1,11.95,.35,.5,'#efe4d0')}
  if(t!=='anchi')cel(cvs,1);
  outline(cvs,'#181018');
  if(t==='anchi'){const [g,gx]=mk(cvs.width,cvs.height),cx=cvs.width/2,cy=cvs.height/2;
    for(const [r,a] of [[7.8,.15],[6.4,.22],[5,.3]])ell(gx,cx,cy+s,r*s*(fr?1.06:1),r*s*(fr?1.06:1),'rgba(255,220,90,'+a+')');
    for(let i=0;i<4;i++){const a=i*1.57+(fr?.6:0);R(gx,cx+Math.cos(a)*6.6*s,cy+Math.sin(a)*6.6*s,Math.max(1,s*.6),Math.max(1,s*.6),'#fffbe0')}
    gx.drawImage(cvs,0,0);return ECACHE[key]=g}
  return ECACHE[key]=cvs;
}

/* ---------- props ---------- */
const PCACHE={};
const CTLEAF={kelp:['#063028','#0a4638','#106050','#1a7e66','#2aa080','#48c49a'],chacay:['#2e2c0a','#4c4812','#6a621c','#8a7e2e','#aca046','#d0c468'],lafken:['#0e2e14','#1a4a1e','#286a26','#3e8a30','#68ae42','#9ad060'],koyam:['#2a3208','#46520e','#646e16','#86882a','#acaa40','#d8cc64'],mawida:['#06221a','#0e3426','#184e36','#24684a','#3e8a62','#6ab48a']};
function ctTree(v,style){
  const k='cttree'+style+v;if(PCACHE[k])return PCACHE[k];
  const W=36,Hh=42,[cvs,c]=mk(W,Hh),ramp=CTLEAF[style],tr=['#2a1a0c','#4a2e16','#6a4422','#8a5a30'];
  R(c,15,24,6,17,tr[1]);R(c,15,24,2,17,tr[2]);R(c,19,24,2,17,tr[0]);for(let y=26;y<40;y+=3)R(c,16,y,2,1,tr[3]);R(c,12,39,12,2,tr[1]);R(c,11,40,3,1,tr[0]);R(c,22,40,3,1,tr[0]);
  const cl=[[18,15,12],[9,19,8],[27,19,8],[13,9,8],[23,9,8],[18,5,7],[7,12,5],[29,12,5]].map(([x,y,r])=>[x+(h2(v,x,5)-.5)*2,y+(h2(v,y,6)-.5)*2,r]);
  const id=c.getImageData(0,0,W,Hh),d=id.data,hx=hexRGB;
  for(let y=0;y<Hh;y++)for(let x=0;x<W;x++){let best=null,bl=-9;
    for(const [cx,cy,r] of cl){const dd=Math.hypot(x+.5-cx,y+.5-cy);if(dd<=r){const l=(-(x+.5-cx)*.6-(y+.5-cy)*.8)/r;const e=1-dd/r;const sc=l*1.6+e*.8;if(sc>bl){bl=sc;best=[cx,cy,r,dd,l]}}}
    if(!best)continue;const [cx,cy,r,dd,l]=best;
    let ti=Math.round(2+l*1.8);if(dd>r-1.2)ti=Math.min(ti,1);if(y>cy+r*.45)ti-=1;
    const lx=x%4,ly=y%3,off=((y/3|0)%2)*2,leafc=((x+off)>>2)*5+(y/3|0)*3+v;
    if(ly===0&&((lx+off)%4)===1)ti+=1;else if(ly===2&&((lx+off)%4)===3)ti-=2;else if(leafc%7===0)ti+=1;
    if(l>.5&&h2(x,y,v+91)<.25)ti+=1;
    if(h2(x,y,v+90)<.04)ti=0;
    ti=Math.max(0,Math.min(5,ti));const [rr,gg,bb]=hx(ramp[ti]),i=(y*W+x)*4;d[i]=rr;d[i+1]=gg;d[i+2]=bb;d[i+3]=255}
  c.putImageData(id,0,0);outline(cvs,'#061008');return PCACHE[k]=cvs}
function treeCanvas(v,style){
  style=style||'lafken';if(CT&&CTLEAF[style])return ctTree(v,style);const k='tree'+style+v;if(PCACHE[k])return PCACHE[k];
  if(style==='koyam'){const [cvs,c]=mk(24,30);
    R(c,10,17,4,11,'#5a3a1e');R(c,12,17,2,11,'#3e2612');R(c,9,27,6,1,'#4a2e16');R(c,7,15,4,2,'#5a3a1e');R(c,13,14,4,2,'#5a3a1e');R(c,11,20,1,3,'#7a5230');
    const lobes=[[7,11,5.5,4.5],[16,10,5.5,4.5],[11.5,6,7,5],[12,12,6,3.5],[5+v%2,7,3.5,3],[18-v%2,6,3.5,3]];
    for(const [x,y,rx,ry] of lobes)ell(c,x,y+1,rx,ry,'#4a6a1c');
    for(const [x,y,rx,ry] of lobes)ell(c,x,y,rx-.8,ry-.8,'#6e8e2a');
    for(const [x,y,rx,ry] of lobes)ell(c,x-1,y-1,rx*.5,ry*.5,'#9ab442');
    for(let i=0;i<18;i++){const px=2+Math.floor(h2(i,v,61)*20),py=2+Math.floor(h2(i,v,62)*12);if(h2(i,v,63)<.6)R(c,px,py,1,1,h2(i,v,64)<.5?'#c8d468':'#3a5414')}
    outline(cvs,'#1a2408');return PCACHE[k]=cvs}
  if(style==='lawal'){const [cvs,c]=mk(20,44);
    R(c,8,8,4,34,'#7a3a22');R(c,10,8,2,34,'#5a2414');for(let y=10;y<42;y+=2)R(c,8+(y%4?0:1),y,1,1,'#9a5a3a');R(c,6,41,8,2,'#4a2010');
    for(let i=0;i<7;i++){const y=4+i*4,rx=3+i*.8+(i%2);ell(c,10,y+1,rx+.6,2.2,'#0e2a1c');ell(c,10,y,rx,1.8,'#1c4a30');ell(c,10-rx*.32,y-.4,rx*.46,1.1,'#2e6a44');R(c,10-Math.round(rx)+1,y-1,2,1,'#3a7a52');R(c,10+Math.round(rx)-2,y+1,2,1,'#0e2a1c')}
    ell(c,10,2,2,2,'#1c4a30');
    for(let i=0;i<8;i++){const px=3+Math.floor(h2(i,v,91)*14),py=2+Math.floor(h2(i,v,92)*28);if(h2(i,v,93)<.5)R(c,px,py,1,1,'#5a9a6e')}
    outline(cvs,'#06120a');return PCACHE[k]=cvs}
  if(style==='pewen'){const [cvs,c]=mk(24,40);
    R(c,10,10,4,28,'#6a4a30');R(c,12,10,2,28,'#4a3020');for(let y=12;y<38;y+=3)R(c,10,y,4,1,'#5a3a24');R(c,8,37,8,2,'#4a3020');
    const tiers=[[12,4,11,2.4],[12,8,10,2.2],[12,12,8,2],[12,15,6,1.8]];
    for(const [x,y,rx,ry] of tiers){ell(c,x,y+1,rx,ry,'#16381f');ell(c,x,y,rx-.6,ry-.5,'#2e6a3a');ell(c,x-rx*.34,y-.7,rx*.44,Math.max(.8,ry*.55),'#3f8a4a');ell(c,x-rx*.5,y-1.1,rx*.2,.7,'#59a85e');R(c,x+Math.round(rx*.4),y,Math.max(1,Math.round(rx*.5)),1,'#1c4428');R(c,x-rx,y-2,2,2,'#2e6a3a');R(c,x+rx-2,y-2,2,2,'#1c4428');R(c,x-rx+1,y-3,1,1,'#4a8a52');R(c,x+rx-2,y-3,1,1,'#2e6a3a')}
    ell(c,12,2,5,1.6,'#2e6a3a');ell(c,10.5,1.6,2.4,.9,'#3f8a4a');R(c,9,1,6,1,'#4a8a52');
    for(let i=0;i<10;i++){const px=2+Math.floor(h2(i,v,81)*20),py=1+Math.floor(h2(i,v,82)*15);if(h2(i,v,83)<.5)R(c,px,py,1,1,'#5a9a5e')}
    outline(cvs,'#0a1a10');return PCACHE[k]=cvs}
  if(style==='mawida'){const [cvs,c]=mk(22,34);
    R(c,9,22,4,10,'#3a2a1a');R(c,11,22,2,10,'#24180e');R(c,8,31,6,1,'#2e2014');R(c,9,25,1,2,'#4a6a3a');R(c,12,28,1,2,'#4a6a3a');
    const tiers=[[11,20,9,4],[11,15,8,4],[11,10,6.5,4],[11,5.5,4.5,3.5],[11,2.5,2.5,2]];
    for(const [x,y,rx,ry] of tiers){ell(c,x,y+1,rx,ry,'#123a2e');ell(c,x-.5,y,rx-.8,ry-.9,'#1e5a44');ell(c,x-2,y-1,rx*.45,ry*.45,'#2e7a5a')}
    for(let i=0;i<12;i++){const px=3+Math.floor(h2(i,v,71)*16),py=3+Math.floor(h2(i,v,72)*20);if(h2(i,v,73)<.5)R(c,px,py,1,1,'#5aa078')}
    outline(cvs,'#06140e');return PCACHE[k]=cvs}
  const [cvs,c]=mk(20,26);
  R(c,8,17,4,7,'#6a4020');R(c,10,17,2,7,'#4a2a12');R(c,7,23,6,1,'#5a3418');
  ell(c,10,9.5,9.5,8.5,'#1c5c24');ell(c,9.5,9,8.2,7.4,'#287828');ell(c,8.5,7.5,6,5,'#40983c');
  for(let i=0;i<14;i++){const an=i/14*Math.PI*2;R(c,9.5+Math.cos(an)*5.6,8.5+Math.sin(an)*4.6,1,1,'#88d070')}
  ell(c,7,5.5,2,1.5,'#a8e088');R(c,12,12,3,1,'#14401c');R(c,4,11,2,1,'#14401c');
  outline(cvs,'#0c200c');return PCACHE[k]=cvs}
function sbtCanvas(f){
  const k='sbt'+f;if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(16,16);
  c.globalAlpha=.30;ell(c,8,8,7.5,7,'#241a10');c.globalAlpha=.42;ell(c,8,8,6,5.5,'#322414');c.globalAlpha=1;
  const cr=[[3,5,2,0],[5,5,0,2],[9,4,3,1],[12,7,0,3],[6,10,3,1],[9,11,2,2],[12,12,2,0],[4,12,0,2]];
  for(const [x,y,dx,dy] of cr){c.strokeStyle='rgba(16,10,6,.75)';c.lineWidth=1;c.beginPath();c.moveTo(x+.5,y+.5);c.lineTo(x+dx+.5,y+dy+.5);c.stroke()}
  for(const [x,y,dx,dy] of [[4,4,2,1],[10,5,2,0],[7,9,0,2],[11,11,2,1]]){c.strokeStyle='rgba(255,244,200,.35)';c.beginPath();c.moveTo(x+1.5,y+1.5);c.lineTo(x+dx+1.5,y+dy+1.5);c.stroke()}
  for(let i=0;i<6;i++){const x=2+((i*5+f*3)%12),y=2+((i*7+f*5)%12);R(c,x,y,1,1,f?'rgba(255,240,180,.9)':'rgba(255,224,150,.65)')}
  if(f){ell(c,8,4,2,1,'rgba(80,60,36,.5)');R(c,7,2,1,1,'rgba(60,44,26,.6)');R(c,9,1,1,1,'rgba(60,44,26,.4)')}
  return PCACHE[k]=cvs}
function rockCanvas(v){
  const k='rock'+v;if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(16,14);
  ell(c,8,8,7,5.5,'#686878');ell(c,7,7,5.5,4,'#9898a8');ell(c,5,5,2,1.4,'#d0d0dc');R(c,10,10,3,1,'#484858');R(c,2,9,2,1,'#484858');
  outline(cvs,'#202028');return PCACHE[k]=cvs}
function kulonCanvas(v){
  const k='kul'+v;if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(20,24);
  R(c,9,19,2,4,'#6a3a28');R(c,8,20,1,2,'#8a5038');
  const L=[[10,12,8,7,'#1e4a28'],[6,10,5,5,'#2a5e34'],[14,10,5,5,'#2a5e34'],[10,7,6,5,'#38763e'],[8,9,4,4,'#469048'],[13,8,3,3,'#469048']];
  for(const [x,y,rx,ry,col] of L)ell(c,x,y,rx,ry,col);
  for(let i=0;i<9;i++){const a=h2(i,v,1)*6.28,r=3+h2(i,v,2)*5,x=10+Math.cos(a)*r,y=11+Math.sin(a)*r*.7;R(c,x,y,1,1,'#58a858')}
  for(let i=0;i<7;i++){const x=4+Math.floor(h2(i,v,3)*13),y=6+Math.floor(h2(i,v,4)*9);
    R(c,x,y,2,2,'#3a1448');R(c,x,y,1,1,'#6a2a88');R(c,x+1,y+1,1,1,'#200830')}
  outline(cvs,'#122414');
  return PCACHE[k]=cvs}
function pickCanvas(style,v){
  const k='pk'+style+v;if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(20,26);
  if(style==='diwen'){
    R(c,9,16,2,9,'#5a4028');R(c,8,18,1,3,'#785838');
    R(c,5,10,5,1,'#5a4028');R(c,11,8,5,1,'#5a4028');R(c,6,13,4,1,'#5a4028');
    const L=[[10,8,7,6,'#3a5e30'],[6,6,4,4,'#4a7440'],[14,7,4,4,'#4a7440'],[10,4,5,3,'#5a8a4e']];
    for(const [x,y,rx,ry,col] of L)ell(c,x,y,rx,ry,col);
    for(let i=0;i<8;i++){const x=4+Math.floor(h2(i,v,11)*12),y=6+Math.floor(h2(i,v,12)*10);
      ell(c,x,y,1.6,1.6,'#f0a030');R(c,x-1,y-1,1,1,'#ffd880');R(c,x,y,1,1,'#c87818')}
    outline(cvs,'#1a2414');
  } else {
    for(let i=0;i<7;i++){const x=4+i*2,hh2=8+Math.floor(h2(i,v,13)*6);
      for(let y2=0;y2<hh2;y2++)R(c,x+(y2>hh2-4?(i%2?1:-1):0),24-y2,1,1,y2>hh2-3?'#8ac860':'#3e7e36')}
    for(let i=0;i<4;i++){const x=5+i*3+Math.floor(h2(i,v,14)*2);R(c,x,12-Math.floor(h2(i,v,15)*4),2,2,'#f8f8f0');R(c,x,11-Math.floor(h2(i,v,15)*4),1,1,'#ffe878')}
    outline(cvs,'#14240f');
  }
  return PCACHE[k]=cvs}
function doorwayCanvas(f){
  const k='dw'+f;if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(10,13);
  for(let y=0;y<12;y++)for(let x=1;x<9;x++){const d=Math.abs(x-4.5)/4+ (12-y)/14;
    c.fillStyle=d<.55?'#ffe9a8':d<.8?'#f8c060':d<1.05?'#c07828':'#5a3014';c.fillRect(x,y,1,1)}
  R(c,0,0,1,12,'#3a2410');R(c,9,0,1,12,'#3a2410');
  for(let y=1;y<11;y+=2){R(c,1,y,1,1,'#8a2a2a');R(c,8,y,1,1,'#1a1a3a')}
  if(f)R(c,4,2,2,7,'#fff4cc');
  R(c,0,12,10,1,'#7a5a34');
  return PCACHE[k]=cvs}
function rukaCanvas(bw,bh){
  const k='ruka'+bw+'x'+bh;if(PCACHE[k])return PCACHE[k];
  const W0=bw*16,H0=bh*16,ox=2,oy=10,[cvs,c]=mk(W0+4,H0+12),cx=ox+W0/2;
  const wallTop=oy+H0-12,wallBot=oy+H0-1;
  for(let x=ox+4;x<ox+W0-4;x++)for(let y=wallTop;y<wallBot;y++)R(c,x,y,1,1,(x%2)?'#8a6a40':'#6e5230');
  R(c,ox+4,wallTop+5,W0-8,1,'#4a3418');R(c,ox+3,wallBot-1,W0-6,2,'#5a3a1e');
  R(c,cx-4,wallTop+1,8,wallBot-wallTop-1,'#140a04');R(c,cx-5,wallTop,1,wallBot-wallTop,'#6a4424');R(c,cx+4,wallTop,1,wallBot-wallTop,'#6a4424');R(c,cx-3,wallTop+1,3,5,'#a07850');
  const top=oy-8,eave=wallTop+2,rw=W0/2+1,dcy=eave-6,dry=dcy-top;
  const TH=['#f0cc78','#d4a850','#b08434','#8a6424'];
  for(let y=top;y<=eave;y++){let half=rw;if(y<dcy){const t=(dcy-y)/dry;half=rw*Math.pow(Math.max(0,1-Math.pow(t,2.2)),1/2.2)}
    const v=(y-top)/(eave-top);
    for(let x=Math.round(cx-half);x<Math.round(cx+half);x++){
      let ti=v<.25?0:v<.55?1:v<.85?2:3;const xr=(x-(cx-half))/(2*half);if(xr>.78&&ti<3)ti++;if(xr<.18&&ti>0&&v<.7)ti--;
      if((y-top+((x>>1)%2))%4===0)ti=Math.min(3,ti+1);
      R(c,x,y,1,1,TH[ti])}}
  for(let x=Math.round(cx-rw);x<Math.round(cx+rw);x++){const len=1+Math.floor(h2(x,9,44)*3);R(c,x,eave,1,len,(x%2)?'#8a6424':'#6a4818')}
  ell(c,cx,top+2,W0*.18,2,'#c89a48');R(c,cx-2,top+1,4,2,'#3a2410');
  outline(cvs,'#2a1808');
  return PCACHE[k]={cvs,ox,oy,smoke:[cx-ox,top-oy+1]};
}
function tplCanvas(name,fr,k,pad){
  const key='tp'+name+fr+'_'+k+'_'+(pad||0);if(PCACHE[key])return PCACHE[key];
  const d=SPR2[name],rows=d.f[fr%d.f.length],h=rows.length,w=rows[0].length,p=pad||0,[cvs,c]=mk(w*k+p*2,h*k+p*2);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ch=rows[y][x];if(ch!=='.')R(c,p+x*k,p+y*k,k,k,d.pal[ch])}
  return PCACHE[key]=cvs}
function animalCanvas(t,fr,dir){
  const key='an'+t+fr+dir;if(PCACHE[key])return PCACHE[key];
  const base=tplCanvas(t,fr,1);return PCACHE[key]=repaintSmall(dir==='right'?mirror(base):base,{amp:.9})}
function reweCanvas(){
  const k='rewe';if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(18,30);
  R(c,7,6,4,24,'#8a6034');R(c,7,6,1,24,'#a87c48');R(c,10,6,1,24,'#5a3c1e');
  for(let i=0;i<4;i++){const y=9+i*5;R(c,6,y,6,2,'#8a6034');R(c,6,y,6,1,'#b08850');R(c,6,y+1,6,1,'#5a3c1e')}
  R(c,7,4,4,3,'#a87c48');R(c,8,5,1,1,'#3a2410');R(c,10,5,1,1,'#3a2410');R(c,8,7,3,1,'#5a3c1e');
  ell(c,4,8,3,4,'#2e6030');ell(c,3,7,2,2.5,'#3f7c3e');ell(c,14,8,3,4,'#2e6030');ell(c,15,7,2,2.5,'#3f7c3e');
  R(c,5,10,1,3,'#4a6a2a');R(c,13,10,1,3,'#4a6a2a');
  R(c,12,3,1,5,'#d8d8e4');R(c,13,3,3,2,'#e8e8f2');R(c,13,5,3,1,'#4a66b0');
  outline(cvs,'#1a1208');return PCACHE[k]=cvs}
function loomCanvas(prog){
  const [cvs,c]=mk(16,22);R(c,1,2,2,20,'#6a4020');R(c,13,2,2,20,'#6a4020');R(c,0,2,16,2,'#8a5a30');R(c,0,18,16,2,'#8a5a30');
  for(let x=3;x<13;x++)R(c,x,4,1,14,'#e8dcc0');
  const rows=Math.floor(prog);for(let y=0;y<rows&&y<14;y++)for(let x=3;x<13;x++){const d=Math.abs(((x-8)%6+6)%6-3)+Math.abs((y%6)-3);R(c,x,17-y,1,1,d<=1?'#c82828':d===2?'#181018':'#f0e8d0')}
  outline(cvs,'#181018');return cvs}
function potCanvas(f){const [cvs,c]=mk(16,16);
  for(let i=0;i<3;i++)ell(c,3+i*5,13,2,1.5,'#7a7a84');
  R(c,5,11+(f%2),2,2,'#ff9a2a');R(c,9,11+((f+1)%2),2,2,'#e04818');R(c,7,12,2,2,'#fff2a0');
  ell(c,8,8,6,4.5,'#2a2a30');ell(c,7,7,3,2,'#4a4a54');R(c,2,4,12,2,'#3a3a44');R(c,3,4,10,1,'#8a6a4a');
  outline(cvs,'#101014');return cvs}
function boardCanvas(){const k='board';if(PCACHE[k])return PCACHE[k];const [cvs,c]=mk(24,22);
  R(c,3,12,2,10,'#6a4020');R(c,19,12,2,10,'#6a4020');R(c,0,0,24,14,'#5a3418');R(c,1,1,22,12,'#2c4a34');
  outline(cvs,'#181018');return PCACHE[k]=cvs}

/* ---------- dynamic tile objects (16x16) ---------- */
const DCACHE={};
function dynCanvas(ch,f){
  const k=ch+f;if(DCACHE[k])return DCACHE[k];const [cvs,c]=mk(16,16);let ol='#181018';
  switch(ch){
  case 'C':R(c,1,4,14,11,'#8a5428');R(c,1,4,14,4,'#b07038');R(c,1,8,14,1,'#5a3416');R(c,1,4,1,11,'#e0b84a');R(c,14,4,1,11,'#e0b84a');R(c,1,4,14,1,'#f0d070');R(c,6,7,4,4,'#e0b84a');R(c,7,8,2,2,'#2a1408');break;
  case 'K':R(c,1,0,14,16,'#7e522c');for(let i=0;i<7;i++){R(c,1+i*2,3+(i%2),2,1,'#f0dca0');R(c,1+i*2,12-(i%2),2,1,'#c03a2e')}R(c,1,7,14,2,'#5a3a1e');ell(c,8,8,2.5,2.5,'#f0dca0');R(c,7,7,2,2,'#c03a2e');R(c,1,0,14,1,'#a8784a');break;
  case 'S':ol=null;R(c,0,0,16,16,'#0c0806');for(let i=0;i<5;i++){R(c,1+i,2+i*3,14-i*2,2,'#4a3a2e');R(c,1+i,2+i*3,14-i*2,1,'#7a6a58')}break;
  case 'I':R(c,7,8,2,8,'#5a3418');R(c,1,2,14,7,'#c99a5a');R(c,1,2,14,1,'#e8c088');R(c,3,4,9,1,'#6b4a2b');R(c,3,6,6,1,'#6b4a2b');break;
  case 'P':R(c,3,4,4,3,'#e83048');R(c,9,4,4,3,'#e83048');R(c,2,5,12,4,'#e83048');R(c,3,9,10,2,'#e83048');R(c,5,11,6,1,'#b81830');R(c,7,12,2,1,'#b81830');R(c,4,5,2,1,'#ffd0d8');R(c,12,7,1,2,'#b81830');break;
  case 'm':for(let i=0;i<9;i++){R(c,3+i,12-i,2,1,'#f6f6f6');R(c,3+i,13-i,1,1,'#8a8a96')}R(c,2,12,1,3,'#3a2a1a');break;
  case 'g':ell(c,8,8,3.4,5.4,'#c88a18');ell(c,7.5,7.5,2.6,4.6,'#f0c040');R(c,6,5,1,3,'#fff4b0');break;
  case 'p':ell(c,8,8,5.4,5.4,'#4a5a1e');for(let i=0;i<3;i++)for(let j=0;j<3;j++)R(c,4+i*3+(j%2),4+j*3,2,2,'#a8c050');break;
  case 'k':R(c,3,6,6,5,'#e0b030');R(c,5,7,2,3,'#7a5410');R(c,9,8,6,2,'#e0b030');R(c,12,10,1,2,'#e0b030');R(c,14,10,1,2,'#e0b030');R(c,3,6,6,1,'#fff0a0');break;
  case 'L':R(c,0,0,16,16,'#5a3a1e');R(c,1,1,14,15,'#7e522c');for(let i=0;i<4;i++)R(c,2+i*4,1,1,15,'#5a3a1e');R(c,1,5,14,2,'#8a8a96');R(c,1,11,14,2,'#8a8a96');ell(c,8,9,2.5,2.5,'#e0b030');R(c,7,9,2,3,'#181018');break;
  case 'G':ol=null;R(c,0,0,16,2,'#5a5a68');R(c,0,14,16,2,'#3a3a48');for(let i=0;i<4;i++){R(c,1+i*4,0,2,16,'#8a8a9a');R(c,1+i*4,0,1,16,'#c0c0d0')}break;
  case 'B':R(c,1,1,14,14,'#8a8a9a');R(c,1,1,14,2,'#c0c0d0');R(c,1,1,2,14,'#b0b0c0');R(c,1,13,14,2,'#5a5a68');R(c,13,1,2,14,'#5a5a68');R(c,6,6,4,4,'#6a6a7a');break;
  case 'O':ol=null;ell(c,8,8,6.5,6,'#3a3a48');ell(c,8,7.5,5.5,5,'#9a8a5a');ell(c,8,7.5,3,2.6,'#c8b878');break;
  case 'q':ol=null;ell(c,8,8,6.5,6,'#3a3a48');ell(c,8,8.5,5.5,4.5,'#6a7a4a');ell(c,8,8.5,3,2,'#9ac070');break;
  case 'Q':R(c,1,0,14,14,'#8a8a9a');R(c,1,0,14,2,'#c0c0d0');R(c,1,0,2,14,'#b0b0c0');R(c,1,12,14,2,'#5a5a68');R(c,13,0,2,14,'#5a5a68');R(c,5,5,6,4,'#9ac070');break;
  case 'F':for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ell(c,8+Math.cos(a)*5.5,11+Math.sin(a)*3,1.8,1.4,i%2?'#8a8a94':'#6a6a74')}ell(c,8,11,3.5,1.8,'#2a1408');R(c,5,10,6,1,'#6a3a18');
    outline(cvs,'#181018');{const fl=[[0,0],[1,-1],[-1,0],[0,1]][f];ell(c,8+fl[0]*.5,7+fl[1]*.5,3.2,4.6,'#e04818');ell(c,8,7.6,2.2,3.4,'#ff9a2a');ell(c,8,9,1.2,1.8,'#fff2a0');R(c,7+fl[0],2+fl[1],1,1,'#ffb43a');}return DCACHE[k]=cvs;
  case 'N':{R(c,3,2,10,13,'#7a7a8a');R(c,3,2,10,2,'#a8a8b8');R(c,3,2,2,13,'#9898a8');R(c,11,3,2,12,'#5a5a6a');R(c,2,14,12,2,'#5a5a6a');
    const g=f?'#80e0ff':'#4a4a5a';R(c,6,5,4,1,g);R(c,7,6,2,4,g);R(c,6,10,4,1,g);if(f){R(c,5,4,6,1,'#c0f0ff')}break}
  case 'j':{const sw=f?1:0;
    const stalks=[[3,6,sw],[5,4,1-sw],[7,7,sw],[9,3,1-sw],[11,6,sw],[13,5,1-sw]];
    for(const [x,h,o] of stalks){
      R(c,x,16-h-4,1,h+4,'#5aa848');R(c,x+o,16-h-6,1,2,'#7cc45e');
      R(c,x+o,16-h-10,2,4,'#8a5426');R(c,x+o,16-h-10,2,1,'#b4803c');
    }
    R(c,2,14,13,2,'#3c7a30');R(c,4,15,3,1,'#2c5a22');R(c,10,15,3,1,'#2c5a22');
    break;}
  case 'J':{const [col,lit]=String(f).split('|');R(c,3,9,10,3,'#6a6a7a');R(c,4,12,2,4,'#4a4a5a');R(c,10,12,2,4,'#4a4a5a');R(c,3,9,10,1,'#9a9aaa');R(c,4,8,8,2,'#2a1a10');
    if(lit==='1'){outline(cvs,'#181018');ell(c,8,5,3.2,4.4,col);ell(c,8,6,2,2.6,'#ffffff');R(c,7,0,2,2,col);return DCACHE[k]=cvs}
    R(c,6,7,4,1,'#4a3a2a');break}
  case 'H':ell(c,8,9,6.5,6.5,'#7a7a8a');ell(c,7,8,5,5,'#9a9aaa');R(c,5,7,2,2,'#2a2a3a');R(c,9,7,2,2,'#2a2a3a');R(c,6,11,4,1,'#2a2a3a');R(c,5,6,2,1,'#c0c0d0');R(c,3,12,4,2,'#3a8a3a');R(c,10,3,3,2,'#3a8a3a');break;
  case 'E':R(c,0,0,16,16,'#6a6a7a');R(c,0,0,16,2,'#a8a8b8');R(c,1,2,14,13,'#7e7e8e');R(c,7,3,2,10,'#3a3a4a');R(c,4,6,8,2,'#3a3a4a');R(c,5,10,6,2,'#3a3a4a');R(c,0,14,16,2,'#4a4a5a');break;
  case '@':ol=null;{const ph=f*.9;for(let ring=0;ring<3;ring++){const rr=6.5-ring*1.8;for(let a=0;a<14;a++){const an=a/14*Math.PI*2+ph*(ring%2?1:-1);if(a%3===ring%3)continue;R(c,8+Math.cos(an)*rr,8+Math.sin(an)*rr*.8,1,1,ring===0?'#c08aff':ring===1?'#7ab8ff':'#ffffff')}}ell(c,8,8,2,1.6,'#e8d8ff');R(c,7,1+(f%2),2,4,'rgba(200,170,255,.7)')}break;
  case 'A':ol=null;{const ph=f*.8;ell(c,8,9,7,4.5,'rgba(120,200,255,.35)');for(let a=0;a<16;a++){const an=a/16*Math.PI*2+ph;R(c,8+Math.cos(an)*6,9+Math.sin(an)*3.6,1,1,a%2?'#ffffff':'#9fd8ff')}ell(c,8,9,2.5,1.5,'#e8f8ff');R(c,7,1+(f%2),2,5,'rgba(220,245,255,.7)')}break;
  case '^':ell(c,8,11,7.8,5,'#b8c8dc');ell(c,8,9,7,5,'#e8f0f8');ell(c,6,7,4,3,'#ffffff');R(c,3,12,10,1,'#9aaac0');break;
  case 'D':{ell(c,8,10,7.5,5.5,'#5a4a22');ell(c,7,9,6,4.5,'#7a6632');for(let i=0;i<12;i++){const a=i/12*6.28;const x=8+Math.cos(a)*6.5,y=9.5+Math.sin(a)*4.8;R(c,x,y,1,1,'#3a3012');R(c,x+(i%2),y-1,1,1,'#d8cc90')}for(let i=0;i<7;i++){const x=3+i*2,y=4+(i%3)*2;R(c,x,y,1,3,'#8a7640');R(c,x,y,1,1,'#e8dca0')}R(c,2,13,12,1,'#3a3012');break}
  case 'Ñ':ell(c,8,9,7.5,6.5,'#2a4a1a');ell(c,7,8,6,5,'#3a6a24');for(let i=0;i<14;i++){const a=i/14*6.28;R(c,8+Math.cos(a)*6.5,9+Math.sin(a)*5.5,1,1,'#c8b070')}for(let i=0;i<6;i++)R(c,4+i*2,5+(i%3)*3,1,1,'#e04060');break;
  case 'X':ol=null;{const ph=f*1.57;ell(c,8,12,6,2,'rgba(0,0,0,.25)');for(let i=0;i<4;i++){const a=ph+i*1.57;ell(c,8+Math.cos(a)*4,8+Math.sin(a)*2-i,4.4-i*.5,1.5,i%2?'#ecf2fa':'#aab8c6')}for(let i=0;i<3;i++)R(c,1+((f+i)%4)*3,3+i*4,4,1,'#ffffff')}break;
  case 'v':ol=null;for(let r=0;r<3;r++){const rr=7-r*2;for(let a=0;a<20;a++){const an=a/20*Math.PI*2+f*.8*(r%2?1:-1);if(a%3===0)continue;R(c,8+Math.cos(an)*rr,8+Math.sin(an)*rr*.8,1,1,r===0?'#163e6e':r===1?'#9fd0ff':'#ffffff')}}ell(c,8,8,1.4,1.1,'#0a2448');break;
  }
  if(ol)outline(cvs,ol);return DCACHE[k]=cvs;
}
/* LttP-style heart, filled in quarters */
function drawHeart(c,x,y,q){
  const HP=[".oo.oo.","orroWro","orrrrro","orrrrro",".orrro.","..oro..","...o..."];
  for(let yy=0;yy<7;yy++)for(let xx=0;xx<7;xx++){const ch=HP[yy][xx];if(ch==='.')continue;
    let col=ch==='o'?'#181018':'#4a2028';
    if(ch!=='o'){const filled=q>=4||(q===3&&!(xx>=4&&yy>=3))||(q===2&&xx<4)||(q===1&&xx<4&&yy>=3);if(filled)col=ch==='W'?'#ffd0d0':'#e83048'}
    R(c,x+xx,y+yy,1,1,col)}
}
