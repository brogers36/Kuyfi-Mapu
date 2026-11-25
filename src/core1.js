/* ============================================================
   Kewün Newen (working title) · Lafkenche region
   ============================================================ */
let W=512,H=448,LW=256;const LH=224,T=16,VY=0,VH=LH;
const cv=document.getElementById('cv'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
/* crisp scaling: the back buffer matches the real screen pixels; the low-res frame is blown up by a whole number
   with no smoothing, then fitted once ("sharp bilinear"), so every game pixel comes out the same size */
let UPK=2;const UP=document.createElement('canvas'),upx=UP.getContext('2d');
function setBacking(si){const dpr=Math.min(3,window.devicePixelRatio||1),bw=Math.max(W,Math.round(LW*si*dpr)),bh=Math.max(H,Math.round(LH*si*dpr));
  if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh}
  UPK=Math.max(1,Math.ceil(bw/LW-1e-6));if(UP.width!==LW*UPK||UP.height!==LH*UPK){UP.width=LW*UPK;UP.height=LH*UPK}upx.imageSmoothingEnabled=false}
function present(){
  if(cv.width===LW*UPK&&cv.height===LH*UPK){ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(LO,0,0,cv.width,cv.height)}
  else{upx.imageSmoothingEnabled=false;upx.drawImage(LO,0,0,UP.width,UP.height);ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='low';ctx.drawImage(UP,0,0,cv.width,cv.height)}
  ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);ctx.imageSmoothingEnabled=false}
const LO=document.createElement('canvas');LO.width=LW;LO.height=LH;const lx=LO.getContext('2d');lx.imageSmoothingEnabled=false;
function setView(lw){
  lw=Math.max(256,Math.min(400,Math.round(lw/2)*2));
  if(lw===LW)return false;
  LW=lw;W=LW*2;
  LO.width=LW;LO.height=LH;lx.imageSmoothingEnabled=false;
  cv.width=W;cv.height=H;ctx.imageSmoothingEnabled=false;
  document.getElementById('screen').style.setProperty('--lw',LW);
  if(typeof VIGNC!=='undefined'&&VIGNC)VIGNC=null;
  if(typeof BG!=='undefined')for(const k in BG)delete BG[k];
  if(typeof FG!=='undefined')for(const k in FG)delete FG[k];
  return true;
}
const $=id=>document.getElementById(id);
const CT=true;
const SAVE_KEY='kuyfi_mapu_v1'+(window.KEWUN_MASTER?'_maestro':''),MUTE_KEY='kuyfi_mapu_mute';
let SLOT=1;try{SLOT=Math.max(1,Math.min(3,+(localStorage.getItem(SAVE_KEY+'_slot')||1)||1))}catch(e){}
const slotKey=n=>SAVE_KEY+(n>1?'_s'+n:'');
function setSlot(n){SLOT=n;try{localStorage.setItem(SAVE_KEY+'_slot',''+n)}catch(e){}}
let LANG='es',S=null,mode='title',frame=0,active=null,grace=0,fade=0,HERO='millaray';
const rnd=n=>Math.floor(Math.random()*n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const OUTBG={coast:1,field:1,forest:1,mount:1,pampa:1,rainforest:1,fjord:1,waria:1,feria:1,blocks:1};
function dayPhase(){
  const CYC=43200,t=(((S&&S.wtime)||0)%CYC)/CYC; // 12-minute cycle of play time
  const ramp=(a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
  let dark=0,warm=0,name='day';
  if(t<.60){name='day'}
  else if(t<.70){name='dusk';warm=.14*ramp(.60,.66);dark=.34*ramp(.63,.70)}
  else if(t<.92){name='night';dark=.34;warm=0}
  else{name='dawn';dark=.34*(1-ramp(.92,.97));warm=.12*(1-ramp(.95,1))}
  return {name,dark,warm,t}}
function dayTint(c){
  if(!M||!OUTBG[M.bg])return;
  const d=dayPhase();if(!d.dark&&!d.warm)return;
  if(d.warm){c.fillStyle='rgba(255,150,70,'+d.warm.toFixed(3)+')';c.fillRect(0,0,LW,LH)}
  if(d.dark){c.fillStyle='rgba(8,14,42,'+d.dark.toFixed(3)+')';c.fillRect(0,0,LW,LH);
    c.fillStyle='rgba(4,6,24,'+(d.dark*.5).toFixed(3)+')';c.fillRect(0,0,LW,34)}
}
/* dithered gradients: same API shape as canvas gradients, but painted as stepped bands with a 4x4 ordered
   dither, so lighting reads as pixel art instead of a smooth digital blur. Cached by shape and stops. */
const BAYER16=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16),DGC=new Map();
function _rgba(s){const m=s.match(/[\d.]+/g).map(Number);if(s[0]==='#'){const h=s.slice(1);return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]}return[m[0],m[1],m[2],m[3]===undefined?1:m[3]]}
function _dg(kind,geo){const st=[];return{addColorStop(p,col){st.push([p,_rgba(col)])},fill(c,x,y,w,h){
  x=Math.round(x);y=Math.round(y);w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));
  const key=kind+geo.map(v=>Math.round(v-(kind==='l'?0:0))).join(',')+'|'+x+','+y+','+w+','+h+'|'+st.map(s=>s[0].toFixed(2)+s[1].slice(0,3).join('.')+'.'+Math.round(s[1][3]*40)).join(';');
  let cv=DGC.get(key);
  if(!cv){if(DGC.size>260)DGC.clear();st.sort((a,b)=>a[0]-b[0]);cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d'),id=g.createImageData(w,h),d=id.data,L=10;
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const X=x+xx,Y=y+yy;let t;
      if(kind==='l'){const [x0,y0,x1,y1]=geo,dx=x1-x0,dy=y1-y0,l2=dx*dx+dy*dy||1;t=((X-x0)*dx+(Y-y0)*dy)/l2}
      else{const [cx,cy,r0,,,r1]=geo;t=(Math.hypot(X-cx,Y-cy)-r0)/((r1-r0)||1)}
      t=Math.max(0,Math.min(1,t));let i=0;while(i<st.length-1&&st[i+1][0]<t)i++;
      const A=st[i],Bs=st[Math.min(st.length-1,i+1)],f=Bs[0]>A[0]?Math.max(0,Math.min(1,(t-A[0])/(Bs[0]-A[0]))):0,ca=A[1],cb=Bs[1];
      const a=ca[3]+(cb[3]-ca[3])*f,th=BAYER16[(Y&3)*4+(X&3)],aq=Math.min(1,Math.floor(a*L+th)/L),o=(yy*w+xx)*4;
      d[o]=ca[0]+(cb[0]-ca[0])*f;d[o+1]=ca[1]+(cb[1]-ca[1])*f;d[o+2]=ca[2]+(cb[2]-ca[2])*f;d[o+3]=aq*255}
    g.putImageData(id,0,0);DGC.set(key,cv)}
  c.drawImage(cv,x,y)}}}
const dLin=(x0,y0,x1,y1)=>_dg('l',[x0,y0,x1,y1]),dRad=(cx,cy,r0,cx1,cy1,r1)=>_dg('r',[cx,cy,r0,cx1,cy1,r1]);
function G(o){if(!o)return'';const l=S?S.gloss:LANG;const t=o[l]!==undefined?o[l]:(o.es||'');return typeof t==='string'&&t.indexOf('\u2063')>=0?rootHint(t):t}
/* a fill-in question's root rides in its hint between invisible marks: shown in normal mode, removed in Weichafe mode */
function rh(r){return ' \u2063('+r+'-)\u2063'}
function rootHint(t){return (S&&S.hm)?t.replace(/ ?\u2063[^\u2063]*\u2063/g,''):t.replace(/\u2063/g,'')}
const h2=(x,y,s)=>{let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s|0)+7,982451653))|0;n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;return (n>>>0)/4294967296};
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const GA=(m,f)=>S&&S.fem?f:m;
const addr=npcFem=>(S&&S.fem)||npcFem?'lamngen':'peñi';

/* GoatCounter (same account as the other apps): page views and a few game events, only on the public site */
function gcCount(path,title,ev){if(location.protocol!=='https:'||location.hostname!=='brogers36.github.io'||window.KEWUN_MASTER)return;
  try{new Image().src='https://brogers36.goatcounter.com/count?p='+encodeURIComponent(path)+'&t='+encodeURIComponent(title||'')+(ev?'&e=true':'&r='+encodeURIComponent(document.referrer||''))+
    '&s='+encodeURIComponent(screen.width+','+screen.height+','+(window.devicePixelRatio||1))+'&rnd='+Math.random().toString(36).slice(2)}catch(e){}}
function gcEvent(name,title){gcCount('kewun-'+name,title||name,true)}
gcCount(location.pathname||'/',document.title,false);
window.addEventListener('appinstalled',()=>gcEvent('app-instalada','Kewün Newen: app instalada'));
