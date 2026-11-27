/* ============================================================
   KUYFI MAPU: the time-travel sequence
   Drawn on its own pixel canvas laid over the game (same 256-wide resolution), skippable.
   1. the present-day lof at night: fog rolls in and the voice pulls the letters of the kuku's song toward it
   2. whiteout
   3. the fall through time: rings of light rushing past, the chillka's words flying by, the colours
      turning from the cold blue of now to the warm sepia of the past; the hero tumbles in the middle
   4. snow, and the warm light of the past fades in
   ============================================================ */
function kyTimeTravel(done){
  const cvG=document.getElementById('cv'),rc=cvG.getBoundingClientRect();
  const ov=document.createElement('canvas');ov.width=LW;ov.height=LH;ov.id='kytt';
  ov.style.cssText='position:fixed;left:'+rc.left+'px;top:'+rc.top+'px;width:'+rc.width+'px;height:'+rc.height+'px;image-rendering:pixelated;z-index:9000;pointer-events:auto';
  document.body.appendChild(ov);const c=ov.getContext('2d');c.imageSmoothingEnabled=false;
  const en=(S&&S.gloss==='en')||LANG==='en';
  const sk=document.createElement('button');sk.textContent=en?'Skip ▶':'Saltar ▶';
  sk.style.cssText='position:fixed;right:14px;bottom:14px;z-index:9001;padding:8px 14px;font:600 14px sans-serif;color:#f3ead2;background:rgba(0,0,0,.55);border:1px solid rgba(243,234,210,.5);border-radius:6px;opacity:.7';
  document.body.appendChild(sk);
  let t=0,fin=false,loaded=false;const FPS=60;
  const P1=6*FPS,P2=P1+1.2*FPS,P3=P2+8.5*FPS,P4=P3+2.6*FPS;
  const end=()=>{if(fin)return;fin=true;ov.remove();sk.remove();if(!loaded){loaded=true;done()}};
  sk.onclick=e=>{e.stopPropagation();end()};
  /* the kuku's place on screen, for the letters */
  const kk=(typeof ents!=='undefined'&&ents.find(e=>e.id==='ky_kuku0'))||{fx:19,fy:7};
  const kx=Math.round(kk.fx*T-CAM.x+8),ky=Math.round(kk.fy*T-CAM.y);
  const SONG='ül ülkantun kimün mapu kütral ruka pewma'.split(' ');   // letters that drift away (just letters, not the song itself)
  const letters=[];
  const WORDS=['pukem','pewün','walüng','rimü','kütral','ruka','chillka','kuku','cheche','lof','mapu','kewün','nemül','dungun','ül','pire','mawün','antü','küyen','wünelfe','ngen','kimün'];
  const fly=[];for(let i=0;i<26;i++)fly.push({w:WORDS[i%WORDS.length],a:Math.random()*Math.PI*2,z:Math.random(),sp:.004+Math.random()*.004});
  const flakes=[];for(let i=0;i<90;i++)flakes.push({x:Math.random()*LW,y:Math.random()*LH,v:.2+Math.random()*.5,d:Math.random()*6});
  const fog=[];for(let i=0;i<34;i++)fog.push({x:-60-Math.random()*200,y:Math.random()*LH,r:20+Math.random()*36,v:.35+Math.random()*.5});
  const heroCv=(()=>{try{return ctCharSprite(heroLook(),'down',0)}catch(e){return null}})();
  const lerp=(a,b,k)=>a+(b-a)*k,mix=(a,b,k)=>'rgb('+a.map((v,i)=>Math.round(lerp(v,b[i],k))).join(',')+')';
  if(typeof sfx==='function')sfx('cast');
  function frame(){if(fin)return;t++;
    c.clearRect(0,0,LW,LH);
    if(t<P1){ /* 1. fog and letters over the live game */
      const k=t/P1;
      for(const f of fog){f.x+=f.v;const g=c.createRadialGradient(f.x,f.y,2,f.x,f.y,f.r);g.addColorStop(0,'rgba(220,228,240,'+(.30*Math.min(1,k*2))+')');g.addColorStop(1,'rgba(220,228,240,0)');c.fillStyle=g;c.fillRect(f.x-f.r,f.y-f.r,f.r*2,f.r*2)}
      if(t%9===0&&t<P1-60){const w=SONG[(t/9|0)%SONG.length];for(const ch of w)letters.push({ch,x:kx+Math.random()*10-5,y:ky-6+Math.random()*6,vx:-.2-Math.random()*.6,vy:-.3-Math.random()*.4,a:1})}
      c.font='bold 9px monospace';c.textBaseline='middle';
      for(const L of letters){L.vx-=.035;L.vy+=.006;L.x+=L.vx;L.y+=L.vy;L.a-=.004;if(L.a<=0)continue;
        c.fillStyle='rgba(20,10,30,'+L.a*.7+')';c.fillText(L.ch,L.x+1,L.y+1);c.fillStyle='rgba(255,232,170,'+L.a+')';c.fillText(L.ch,L.x,L.y)}
      if(t===Math.round(P1*.45)&&typeof sfx==='function')sfx('bad');
      if(k>.75){c.fillStyle='rgba(255,255,255,'+((k-.75)/.25)*.85+')';c.fillRect(0,0,LW,LH)}
    }else if(t<P2){ /* 2. whiteout */
      c.fillStyle='#fff';c.fillRect(0,0,LW,LH);
      if(t===P1+2&&typeof sfx==='function')sfx('cast');
    }else if(t<P3){ /* 3. the fall through time */
      const k=(t-P2)/(P3-P2);
      const bg0=[12,18,52],bg1=[58,34,16];c.fillStyle=mix(bg0,bg1,k);c.fillRect(0,0,LW,LH);
      const cx=LW/2+Math.sin(t*.02)*10,cy=LH/2+Math.cos(t*.017)*7;
      /* rings rushing outward */
      for(let i=0;i<14;i++){const ph=((t*.012+i/14)%1),r=4+ph*ph*260;c.strokeStyle=k<.5?'rgba(120,190,255,'+(.55*(1-ph))+')':'rgba(255,214,140,'+(.55*(1-ph))+')';
        c.lineWidth=1+ph*3;c.beginPath();for(let a=0;a<=Math.PI*2+.01;a+=Math.PI/3){const x=cx+Math.cos(a+i*.4)*r,y=cy+Math.sin(a+i*.4)*r*.8;a?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}
      /* streaks */
      for(let i=0;i<60;i++){const a=i*2.39996,ph=((t*.02+i*.137)%1),r0=10+ph*ph*220,r1=r0+6+ph*20;c.strokeStyle=k<.5?'rgba(190,230,255,'+(.5*ph)+')':'rgba(255,236,190,'+(.5*ph)+')';c.lineWidth=1;
        c.beginPath();c.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);c.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);c.stroke()}
      /* the chillka's words flying by */
      c.textAlign='center';c.textBaseline='middle';
      for(const f of fly){f.z+=f.sp;if(f.z>1){f.z=0;f.a=Math.random()*Math.PI*2}const r=10+f.z*f.z*200,x=cx+Math.cos(f.a)*r,y=cy+Math.sin(f.a)*r*.8,sz=Math.round(5+f.z*12);
        c.font='bold '+sz+'px monospace';c.fillStyle=k<.5?'rgba(220,240,255,'+(f.z*.9)+')':'rgba(255,240,200,'+(f.z*.9)+')';c.fillText(f.w,x,y)}
      c.textAlign='start';
      /* the hero, tumbling */
      if(heroCv){c.save();c.translate(cx,cy);c.rotate(Math.sin(t*.05)*.5+t*.01);const s=2*(1+.15*Math.sin(t*.08));c.scale(s,s);c.drawImage(heroCv,-heroCv.width/2,-heroCv.height/2);c.restore()}
      /* the year turning: the seasons, oldest last */
      const lab=k<.25?'':k<.5?'…':k<.75?'kuyfi…':'kuyfi mew';if(lab){c.font='bold 10px monospace';c.fillStyle='rgba(255,236,190,.85)';c.textAlign='center';c.fillText(lab,LW/2,LH-18);c.textAlign='start'}
      if(t%50===0&&typeof sfx==='function')sfx('move');
      if(k>.88){c.fillStyle='rgba(255,250,240,'+((k-.88)/.12)+')';c.fillRect(0,0,LW,LH)}
    }else if(t<P4){ /* 4. snow, and the past fades in */
      if(!loaded){loaded=true;done()}
      const k=(t-P3)/(P4-P3);
      c.fillStyle='rgba(255,250,240,'+(1-k)+')';c.fillRect(0,0,LW,LH);
      for(const f of flakes){f.y+=f.v;f.x+=Math.sin((t+f.d*40)*.03)*.3;if(f.y>LH)f.y=-2;c.fillStyle='rgba(255,255,255,'+(.8*(1-k*.6))+')';c.fillRect(Math.round(f.x),Math.round(f.y),1,1)}
    }else return end();
    requestAnimationFrame(frame)}
  requestAnimationFrame(frame)}
