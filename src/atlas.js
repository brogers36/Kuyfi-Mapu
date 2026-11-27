/* ---------- Mapa: an illustrated map of Wallmapu that shows how far you have come ---------- */
const ATW=400,ATH=224;
const coastX=y=>70+9*Math.sin(y/19)+5*Math.sin(y/7.3)+3*Math.sin(y/3.1);
const andW=y=>204+5*Math.sin(y/21),andE=y=>266+6*Math.sin(y/17+1);
const southY=x=>194+6*Math.sin(x/11)+3*Math.sin(x/4.7);
function _h(x,y){let n=(x*374761393+y*668265263)|0;n=(n^(n>>>13))*1274126177|0;return((n^(n>>>16))>>>0)/4294967296}
function _vn(x,y,s){const X=Math.floor(x/s),Y=Math.floor(y/s),fx=x/s-X,fy=y/s-Y,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const a=_h(X,Y),b=_h(X+1,Y),c=_h(X,Y+1),d=_h(X+1,Y+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function atZone(x,y){
  const cx=coastX(y),aw=andW(y),ae=andE(y);
  if(Math.hypot((x-95)/15,(y-206)/8)<1)return 'wil';                      // Chiloé
  if(x<cx)return 'sea';
  if(x<aw&&y>southY(x))return 'sea';
  if(y<34&&x<ae)return 'pikun';
  if(x>=ae)return 'puel';
  if(x>=aw)return 'pew';
  if(y>=172||(y>=150&&x>=cx+34))return 'wil';
  if(x<cx+34)return 'laf';
  return 'nag';
}
const AT_LAKES=[[150,174,9,5],[178,184,7,4],[120,160,6,3],[196,166,5,3]];
const AT_RIVERS=[[[212,62],[180,66],[150,58],[118,64],[84,60]],[[212,118],[176,124],[140,116],[104,122],[80,118]],[[214,150],[186,148],[160,156]]];
const AT_VOLC=[[222,70],[230,120],[214,164],[236,44]];
let ATBASE=null;
function atlasBase(){if(ATBASE)return ATBASE;
  const cv=document.createElement('canvas');cv.width=ATW;cv.height=ATH;const g=cv.getContext('2d'),im=g.createImageData(ATW,ATH),d=im.data;
  const put=(x,y,c)=>{const i=(y*ATW+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255};
  const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  for(let y=0;y<ATH;y++)for(let x=0;x<ATW;x++){
    const z=atZone(x,y),n=_vn(x,y,9),n2=_vn(x+40,y,3),r=_h(x,y);let c;
    if(z==='sea'){const dist=Math.min(Math.abs(x-coastX(y)),y>150?Math.abs(y-southY(x)):99);
      c=mix([18,46,84],[46,104,140],Math.max(0,1-dist/22));c=mix(c,[30,60,100],n*.3);
      if(dist<2.2)c=[222,234,236];else if((y+Math.floor(x/7))%9===0&&n2>.62)c=mix(c,[120,170,200],.5)}
    else{const cd=x-coastX(y);
      if(z==='laf')c=cd<3?[226,206,150]:mix([112,160,80],[150,180,96],n);
      else if(z==='nag'){c=mix([126,168,78],[96,140,62],n);if(_vn(x+9,y,4)>.68)c=mix(c,[64,104,50],.8);if(_vn(x,y,14)<.3&&(Math.floor(x/7)+Math.floor(y/5))%2)c=mix(c,[178,184,96],.3)}
      else if(z==='wil'){c=mix([58,104,60],[44,86,52],n);if(n2>.6)c=[34,70,44];if(cd<3&&y<200)c=[204,194,150]}
      else if(z==='pew'){const mid=(andW(y)+andE(y))/2,e=1-Math.abs(x-mid)/((andE(y)-andW(y))/2);
        const pk=e+(_vn(x,y,6)-.5)*.7+(_vn(x,y,2.5)-.5)*.18;c=mix([112,128,88],[124,110,96],n);if(pk>.35)c=mix(c,[146,134,124],Math.min(1,(pk-.35)*2.2));if(pk>.78)c=mix([214,222,230],[244,246,250],_vn(x,y,4));
        const lt=_vn(x-2,y,6)-_vn(x+2,y,6);c=c.map(v=>v+lt*70)}
      else if(z==='puel'){c=mix([212,184,116],[180,150,88],n*.8+_vn(x,y,24)*.4);if(_vn(x,y,5)>.72)c=mix(c,[158,130,78],.6);if(r<.04)c=[150,140,70]}
      else if(z==='pikun')c=mix([176,160,112],[150,136,96],n);
      if(cd>=3&&z!=='sea'){const sh=_vn(x-1,y-1,9)-n;c=c.map(v=>v+sh*90)}}
    put(x,y,c.map(v=>Math.max(0,Math.min(255,Math.round(v)))));
  }
  g.putImageData(im,0,0);
  // lakes, rivers
  for(const [x,y,rx,ry] of AT_LAKES){g.fillStyle='#2a6290';g.beginPath();g.ellipse(x,y,rx,ry,0,0,6.283);g.fill();g.fillStyle='#5a9ac0';g.fillRect(x-rx+3,y-1,rx,1)}
  g.strokeStyle='#3a78a8';g.lineWidth=1.4;for(const r of AT_RIVERS){g.beginPath();r.forEach(([x,y],i)=>{const yy=y+Math.sin(x/5)*1.5;i?g.lineTo(x,yy):g.moveTo(x,yy)});g.stroke()}
  // volcanoes
  for(const [x,y] of AT_VOLC){g.fillStyle='#6e6258';g.beginPath();g.moveTo(x-9,y+7);g.lineTo(x,y-8);g.lineTo(x+9,y+7);g.fill();
    g.fillStyle='#4e443e';g.beginPath();g.moveTo(x,y-8);g.lineTo(x+9,y+7);g.lineTo(x+3,y+7);g.fill();
    g.fillStyle='#f2f4f6';g.beginPath();g.moveTo(x-3.5,y-2);g.lineTo(x,y-8);g.lineTo(x+3.5,y-2);g.lineTo(x+1,y-3);g.lineTo(x-1,y-1);g.fill()}
  // pewen trees in the cordillera, forest tufts in the south
  for(let k=0;k<44;k++){const y=40+k*4,x=andW(y)+4+_h(k,3)*12+(k%2)*44;if(atZone(x,y)!=='pew')continue;
    g.fillStyle='#5a3e26';g.fillRect(x,y,1,4);g.fillStyle='#2c4a2c';g.fillRect(x-2,y-1,5,1);g.fillRect(x-1,y-2,3,1);g.fillRect(x-2,y+1,5,1)}
  for(let k=0;k<70;k++){const x=coastX(180)+10+_h(k,9)*130,y=152+_h(k,11)*44;if(atZone(x,y)!=='wil')continue;g.fillStyle='#24502e';g.beginPath();g.arc(x,y,2.2,0,6.283);g.fill();g.fillStyle='#3e7444';g.fillRect(x-1,y-2,2,1)}
  // salt flat and mesa in Puelmapu
  g.fillStyle='#ece6d6';g.beginPath();g.ellipse(332,150,16,6,.2,0,6.283);g.fill();g.fillStyle='#d8d0bc';g.fillRect(322,150,18,1);
  g.fillStyle='#9a7448';g.fillRect(300,74,26,6);g.fillStyle='#7a5a38';g.fillRect(300,80,26,3);
  // the city in the north
  g.fillStyle='#8c8e96';g.fillRect(126,8,52,20);for(let x=128;x<178;x+=5)for(let y=10;y<28;y+=4){g.fillStyle=_h(x,y)>.5?'#b4b6bc':'#6a6c74';g.fillRect(x,y,3,2)}
  g.strokeStyle='rgba(90,80,70,.8)';g.lineWidth=1;g.setLineDash([2,2]);g.beginPath();g.moveTo(152,28);g.lineTo(150,40);g.lineTo(156,54);g.stroke();g.setLineDash([]);
  // islands of forgetting (drawn faint; fog covers them until seen)
  g.fillStyle='#7c8c80';g.beginPath();g.ellipse(34,80,12,7,0,0,6.283);g.fill();g.beginPath();g.ellipse(36,188,15,9,.3,0,6.283);g.fill();
  // a frame like a woven border
  for(let x=0;x<ATW;x++){const c=(Math.floor(x/4)%2)?'#7a1c1c':'#1a1012';g.fillStyle=c;g.fillRect(x,0,1,2);g.fillRect(x,ATH-2,1,2)}
  for(let y=0;y<ATH;y++){const c=(Math.floor(y/4)%2)?'#7a1c1c':'#1a1012';g.fillStyle=c;g.fillRect(0,y,2,1);g.fillRect(ATW-2,y,2,1)}
  ATBASE=cv;return cv}
/* the places on the map */
function atRegions(){const F=S.flags,pcs=S.pieces||[],en=S.gloss==='en',sr=S.seenR||{};
  const bx=v=>v?'■':'□',enm=t=>(ET[t]&&ET[t].name)||t;
  const main=(id,name,es,eng,x,y,lk,mr,pk,ng,sb,before)=>({id,name,g:en?eng:es,x,y,seen:!!(sr[id]||before),
    rows:[bx(F[lk])+' lonko',bx(F['mq_done_'+mr])+' machi',bx(pcs.includes(pk))+' trokiñ',bx(F[ng])+' ngen',bx(F[sb])+' llum wekufü']});
  const R=[
    main('lafkenche','Lafkenche','La gente del mar','The people of the sea',98,96,'pentukun','laf','lafkenche','ngen','sb1',1),
    main('nagche','Nagche','La gente de los llanos','The people of the lowlands',152,92,'nag_lonko','nag','nagche','ngen2','sb2',F.ngen||F.boss),
    main('pewenche','Pewenche','La gente del pewen','The people of the pewen',236,92,'pew_lonko','pew','pewenche','ngen3','sb3',F.ngen2),
    main('williche','Williche','La gente del sur','The people of the south',118,170,'wil_lonko','wil','williche','ngen4','sb4',F.ngen3),
    main('puelmapu','Puelmapu','La tierra del este','The land of the east',318,110,'puel_lonko','puel','puelche','ngen5','sb5',F.ngen4),
    {id:'santiago',name:'Santiago',g:en?'The city':'La waria, la ciudad',x:152,y:18,seen:!!(sr.santiago||F.sw1||F.sw2||F.sw3||F.yewen_won),
      rows:[bx(F.sw1)+' '+enm('ngoyngoyun'),bx(F.sw2)+' '+enm('ngamlef'),bx(F.sw3)+' '+enm('fillantu'),bx(F.yewen_won)+' Yewen']},
    {id:'chumpall',name:'Münche lafken',g:en?'The world beneath the lake':'El mundo bajo el lago',x:178,y:184,seen:!!(sr.chumpall||F.chboss),
      rows:[bx(F.chboss)+' '+enm('llufu1')]},
    {id:'ngoyun',name:'Upewtuwün lof',g:en?'The community of forgetting':'La comunidad del olvido',x:34,y:80,seen:!!(sr.ngoyun||F.llaw_seen),
      rows:[bx(F.llaw_won)+' '+(typeof llawName==='function'?llawName():'llawfeñ')]},
    {id:'ngoyman',name:'Ngoyman mapu',g:en?'The land of forgetting':'La tierra del olvido',x:36,y:188,seen:!!(sr.ngoyman||F.won||F.bossF),
      rows:[bx(F.won||F.bossF)+' Fütra Ngoymatulfe',bx(F.epu_won)+' Epunamun',bx(F.sb6)+' '+enm('kalku')]}];
  return R}
function atRegionNow(){const r=M&&M.region;return r==='lafkenche'||r==='nagche'||r==='pewenche'||r==='williche'||r==='puelmapu'||r==='santiago'||r==='chumpall'||r==='ngoyun'||r==='ngoyman'?r:null}
function openAtlas(back){const en=S.gloss==='en';
  let ov=document.getElementById('atlas');
  if(!ov){ov=document.createElement('div');ov.id='atlas';document.body.appendChild(ov)}
  ov.innerHTML='<div class="ab"><div class="aw"><canvas width="'+ATW+'" height="'+ATH+'"></canvas><div class="al"></div></div><div class="af"><div class="ai"></div><button class="ax">✕ '+(en?'Close':'Cerrar')+'</button></div></div>';
  const cv=ov.querySelector('canvas'),g=cv.getContext('2d'),lab=ov.querySelector('.al'),info=ov.querySelector('.ai');
  const R=atRegions(),vis=R.filter(r=>r.seen),here=atRegionNow();
  let sel=Math.max(0,vis.findIndex(r=>r.id===here));
  for(const r of R){if(!r.seen&&['santiago','chumpall','ngoyun','ngoyman'].includes(r.id))continue;
    const s=document.createElement('span');s.textContent=r.seen?GR(r.name):'?';s.style.left=(r.x/ATW*100)+'%';s.style.top=((r.y+(r.id==='santiago'?14:9))/ATH*100)+'%';
    if(r.seen)s.onpointerup=e=>{e.stopPropagation();sel=vis.indexOf(r);sfx('move');show()};s.dataset.id=r.id;lab.appendChild(s)}
  const show=()=>{const r=vis[sel];if(!r)return;lab.querySelectorAll('span').forEach(s=>s.classList.toggle('on',s.dataset.id===r.id));
    info.innerHTML='<b></b><i></i><div></div>';info.querySelector('b').textContent=GR(r.name)+(r.id===here?(en?'  · you are here':'  · estás aquí'):'');
    info.querySelector('i').textContent=r.g;info.querySelector('div').textContent=r.rows.join('   ')};
  cv.onpointerup=e=>{const b=cv.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*ATW,y=(e.clientY-b.top)/b.height*ATH;
    let best=-1,bd=1e9;vis.forEach((r,i)=>{const d=Math.hypot(r.x-x,r.y-y);if(d<bd){bd=d;best=i}});if(best>=0&&bd<70){sel=best;sfx('move');show()}};
  let t=0,on=true;const base=atlasBase();
  const draw=()=>{if(!on)return;t++;g.drawImage(base,0,0);
    // fog over the lands not yet reached
    for(const r of R){if(r.seen)continue;const big=['lafkenche','nagche','pewenche','williche','puelmapu','santiago'].includes(r.id)?1:.6;
      for(let k=0;k<7;k++){const a=k*0.9+t/240,rx=r.x+Math.cos(a)*16*big+Math.sin(t/90+k)*3,ry=r.y+Math.sin(a*1.3)*10*big;
        g.fillStyle='rgba(222,226,234,'+(.5+.1*Math.sin(t/50+k))+')';g.beginPath();g.ellipse(rx,ry,22*big,12*big,0,0,6.283);g.fill()}}
    // sea glints
    for(let k=0;k<14;k++){const y=20+((k*31)%190),x=coastX(y)-8-((k*13+t/3)%40);if(x>4&&(t+k*17)%60<30){g.fillStyle='rgba(200,230,250,.7)';g.fillRect(Math.round(x),y,3,1)}}
    // lof markers: a little ruka; gold spark where the ngen is awake
    for(const r of R){if(!r.seen)continue;const x=Math.round(r.x),y=Math.round(r.y);
      g.fillStyle='#3a2414';g.beginPath();g.ellipse(x,y,6,4.5,0,Math.PI,0);g.fill();g.fillStyle='#8a6034';g.beginPath();g.ellipse(x,y,5,3.6,0,Math.PI,0);g.fill();
      g.fillStyle='#1a0e08';g.fillRect(x-1,y-2,2,2);
      if(r.rows.length&&r.rows.every(z=>z[0]==='■')){const s=.5+.5*Math.sin(t/12);g.fillStyle='rgba(255,220,120,'+(.5+s*.5)+')';g.fillRect(x+5,y-8,1,5);g.fillRect(x+3,y-6,5,1)}}
    // the selection ring and "you are here"
    const r=vis[sel];if(r){const p=1+.15*Math.sin(t/8);g.strokeStyle='rgba(255,236,160,.95)';g.lineWidth=1.5;g.beginPath();g.ellipse(r.x,r.y-1,12*p,8*p,0,0,6.283);g.stroke()}
    const h=R.find(z=>z.id===here);if(h&&h.seen){const bob=Math.round(Math.sin(t/7)*2),x=Math.round(h.x),y=Math.round(h.y)-12+bob;
      g.fillStyle='#c8202a';g.beginPath();g.moveTo(x-4,y-4);g.lineTo(x+4,y-4);g.lineTo(x,y+3);g.fill();g.fillStyle='#fff0d0';g.fillRect(x-1,y-3,2,2)}
    requestAnimationFrame(draw)};
  const close=()=>{on=false;ov.style.display='none';active=null;sfx('move');back&&back()};
  const ax=ov.querySelector('.ax');ax.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});ax.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();close()});
  ov.onpointerdown=e=>{if(e.target===ov){e.preventDefault();close()}};
  active={kind:'atlas',a(){},b(){close()},mv(d){if(!vis.length)return;sel=(sel+d+vis.length)%vis.length;sfx('move');show()}};
  ov.style.display='flex';show();draw();
}
