/* ============================================================
   BOOT
   ============================================================ */
function fit(){
  const pad=matchMedia('(hover:hover) and (pointer:fine)').matches?60:14;
  const aw=innerWidth-12,ah=Math.max(1,innerHeight-pad);
  setView(Math.round(224*aw/ah));
  const s=Math.max(1,Math.min(aw/LW,ah/224));
  const si=s>=2?Math.floor(s*2)/2:s;$('screen').style.setProperty('--s',si);setBacking(si);
}
addEventListener('resize',fit);fit();
(function(){
  const d=document.documentElement,b=$('fsbtn');if(!b)return;
  const can=d.requestFullscreen||d.webkitRequestFullscreen;
  const standalone=navigator.standalone||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches;
  if(!can||standalone)return;
  b.style.display='block';
  const on=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  const tog=()=>{try{if(on()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{can.call(d)}}catch(e){}};
  b.onclick=tog;
  const ch=()=>{b.textContent=on()?'⊡':'⛶';setTimeout(fit,60)};
  document.addEventListener('fullscreenchange',ch);document.addEventListener('webkitfullscreenchange',ch);
  addEventListener('keydown',e=>{if((e.key==='f'||e.key==='F')&&!e.repeat)tog()});
})();
if([1,2,3].some(n=>loadSave(n)))$('bCont').style.display='';
/* install options on the title screen (hidden inside the installed app or the Android APK) */
let PWAQ=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();PWAQ=e});
(function(){const ua=navigator.userAgent,inApp=navigator.standalone||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||!!window.Capacitor||/; wv\)/.test(ua);
  if(inApp)return;$('instRow').style.display='';
  const APK='https://github.com/brogers36/Kuyfi-Mapu/releases/download/android/KuyfiMapu.apk';
  $('bAnd').onclick=()=>{const h=$('andhint');h.style.display=h.style.display==='none'?'block':'none';$('ioshint').style.display='none';$('title').classList.toggle('inst',h.style.display==='block')};
  $('bPWA').onclick=()=>{if(PWAQ){PWAQ.prompt();PWAQ=null}else $('andtxt').innerHTML=LANG==='es'?'En Chrome: menú ⋮ → «Instalar app».':'In Chrome: ⋮ menu → "Install app".'};
  $('bIOS').onclick=()=>{const h=$('ioshint');h.style.display=h.style.display==='block'?'none':'block';$('andhint').style.display='none';$('title').classList.toggle('inst',h.style.display==='block')};
})();
function updLang(){$('copy').textContent=LANG==='es'?'© 2026 Brandon M. A. Rogers · Todos los derechos reservados. Prohibido usar este sitio para entrenar inteligencia artificial.':'© 2026 Brandon M. A. Rogers · All rights reserved. No use of this site to train artificial intelligence.';$('bLang').textContent=LANG==='es'?'Glosa: Español':'Gloss: English';$('skip').textContent=LANG==='es'?'Saltar ▶▶':'Skip ▶▶';gfxLabel();musLabel();
  document.querySelectorAll('[data-en]').forEach(e=>{e.innerHTML=e.getAttribute(LANG==='es'?'data-es':'data-en')});document.querySelectorAll('[data-ten]').forEach(e=>{e.title=e.getAttribute(LANG==='es'?'data-tes':'data-ten')})}
function musLabel(){$('bMus').textContent=AU.muted?(LANG==='es'?'♪ Música: no':'♪ Music: off'):(LANG==='es'?'♪ Música: sí':'♪ Music: on');$('pN').textContent=AU.muted?'♪×':'♪'}
function gfxLabel(){const b=$('bGfx');if(b)b.textContent=LANG==='es'?(GEM_ON?'Gráficos: nuevos':'Gráficos: clásicos (beta)'):(GEM_ON?'Graphics: new':'Graphics: classic (beta)')}
$('bLang').onclick=()=>{LANG=LANG==='es'?'en':'es';updLang()};
$('bMus').onclick=()=>toggleMute();
$('bGfx').onclick=()=>{gemSet(!GEM_ON);gfxLabel();sfx('ok')};gfxLabel();
musLabel();
const HEROBTN=[['hM','millaray'],['hA','ayelen'],['hL','llanka'],['hK','kallfurungi']];
for(const [id,lk] of HEROBTN){const cvs=$(id).querySelector('canvas'),c=cvs.getContext('2d');c.imageSmoothingEnabled=false;
  let t=0;setInterval(()=>{t++;c.clearRect(0,0,32,48);const fr=HERO===lk?Math.floor(t)%4:0;
    if(GEM_ON&&GEM_READY&&GEMI.ttl[lk]){const s=GEMI.ttl[lk][fr];c.drawImage(s,Math.round((32-s.width)/2),48-s.height-1)}   /* drawn 1:1 at title size, so every pixel stays square */
    else c.drawImage(charSprite(lk,'down',fr),0,0,32,48)},180);
  $(id).onclick=()=>{HERO=lk;for(const [i2,l2] of HEROBTN)$(i2).classList.toggle('on',l2===lk);sfx('ok')}}
$('title').addEventListener('pointerdown',()=>{auInit();if(!AU.name)playSong('intro')});
playSong('intro');
function slotLabel(n){const v=loadSave(n);if(!v)return LANG==='es'?'vacío':'empty';
  const mp=(typeof MAPS!=='undefined'&&MAPS[v.map]&&MAPS[v.map].name)||'';
  return (v.name||'')+(v.flags&&v.flags.kimche?' · kimche':'')+(v.hm?' · weichafe'+(v.hm>1?' ×'+v.hm:''):'')+' · kimün '+(v.lvl||1)+(mp?' · '+mp:'')}
function slotPick(forNew,cb){
  choose({es:forNew?'Nueva partida, ¿en qué espacio?':'¿Qué partida sigues?',en:forNew?'New game: which slot?':'Continue which save?'},
    [1,2,3].map(n=>({m:(loadSave(n)?'■':'□')+' '+n,g:slotLabel(n),v:n,dis:!forNew&&!loadSave(n)}))
    .concat([{m:LANG==='es'?'Volver':'Back',v:'x'}]),v=>{
      if(!v||v==='x')return;
      if(forNew&&loadSave(v)){
        choose({es:'Ese espacio tiene una partida. ¿Borrarla y empezar de nuevo?',en:'That slot has a save. Erase it and start over?'},
          [{m:LANG==='es'?'Sí, empezar de nuevo':'Yes, start over',v:1},{m:LANG==='es'?'No, volver':'No, go back',v:0}],
          k=>{if(k)cb(v);else slotPick(forNew,cb)},true);
        return}
      cb(v)},true)}
function contSlot(n){
  setSlot(n);const sv=loadSave(n);if(!sv)return;gcEvent('continuar','Continuar partida');
  S=Object.assign(newState(sv.hero||'llanka'),sv);S.items.diwen=S.items.diwen||0;S.gear=S.gear||{};S.gloss=LANG;S.pw={speed:0,pewen:0,gold:0};S.roots=S.roots.map(r=>r==='amu'?'amutu':r==='wiñotu'?'wüñotreka':r==='nag'?'nagtu':r).filter(r=>ROOTS[r]);if(S.last)S.last=null;$('title').style.display='none';mode='map';AU.name=null;loadMap(MAPS[S.map]?S.map:'rupu',S.x,S.y);
}
function newGo(src){slotPick(true,n=>{setSlot(n);S=src?heroState(src,HERO):newState(HERO);persist();gcEvent('nuevo-'+(S.hero||HERO),'Juego nuevo: '+((HEROES[S.hero]||{}).name||S.hero));$('title').style.display='none';startCut()})}
$('bNew').onclick=()=>{auInit();const won=[1,2,3].filter(n=>{const v=loadSave(n);return v&&v.flags&&v.flags.won});
  if(!won.length)return newGo(null);
  const en=LANG==='en';
  choose({es:'¿Cómo quieres empezar?',en:'How do you want to start?'},[
    {m:en?'Normal game':'Partida normal',g:en?'From the beginning, kimün 1':'Desde el principio, kimün 1',v:'n'},
    {m:'Weichafe',g:en?'Hero mode: keep your kimün and things; the wekufü and the trials get harder':'Modo héroe: conservas tu kimün y tus cosas; los wekufü y las pruebas se ponen más difíciles',v:'h'},
    {m:en?'Back':'Volver',v:'x'}],v=>{
    if(v==='n')return newGo(null);if(v!=='h')return;
    if(won.length===1)return newGo(loadSave(won[0]));
    choose({es:'¿De qué partida viene tu weichafe?',en:'Which save does your weichafe come from?'},
      won.map(n=>({m:'■ '+n,g:slotLabel(n),v:n})).concat([{m:en?'Back':'Volver',v:'x'}]),k=>{if(k&&k!=='x')newGo(loadSave(k))},true)},true)};
$('bCont').onclick=()=>{auInit();if([1,2,3].filter(n=>loadSave(n)).length===1)return contSlot([1,2,3].find(n=>loadSave(n)));slotPick(false,contSlot)};
if(CT){const st=document.createElement('style');st.textContent=`.box{background:linear-gradient(180deg,#5a6a9e 0%,#2a3468 50%,#141a3c 100%)!important;border:3px solid #e8ecf8!important;border-radius:4px!important;box-shadow:inset 0 0 0 1px #9aa2c8,inset -2px -2px 0 1px #5a5e74,0 0 0 2px #000!important}
.opt{background:linear-gradient(#3a4680,#1e2652)!important;border:2px solid #8890b8!important}.opt.sel{border-color:#fff!important;background:linear-gradient(#5a68b0,#2e3a78)!important}.opt.sel .om::before{content:'▶ ';color:#ffe060}
#dlg .who{color:#ffe890!important}`;document.head.appendChild(st);}
updLang();
requestAnimationFrame(loop);
</script>
</body>
</html>

/* the title logo: stepped letters like woven trarikan, a ñimin band of red and white diamonds and two wünelfe stars; a light sweeps across now and then */
(function(){const h=document.querySelector('#title h1');if(!h)return;const im=new Image();im.onload=()=>{
  const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;cv.className='logo';cv.setAttribute('role','img');cv.setAttribute('aria-label','Kewün Newen');
  h.textContent='';h.appendChild(cv);const g=cv.getContext('2d');let t=0;
  const draw=()=>{if($('title').style.display==='none'){requestAnimationFrame(draw);return}
    t++;g.clearRect(0,0,cv.width,cv.height);g.drawImage(im,0,0);
    const ph=t%300;if(ph<70){const x=-30+ph*(cv.width+60)/70;g.save();g.globalCompositeOperation='source-atop';
      const gr=g.createLinearGradient(x-14,0,x+14,cv.height);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,240,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);g.restore()}
    const tw=.5+.5*Math.sin(t/22);g.save();g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,240,200,'+(tw*.35)+')';g.fillRect(0,0,16,cv.height);g.fillRect(cv.width-16,0,16,cv.height);g.restore();
    requestAnimationFrame(draw)};draw()};im.src='data:image/png;base64,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'})();

/* reveal: wait until the screen has its real size and the title art is ready (at most 3 s), then fade the menu in */
(function(){const t0=Date.now();const go=()=>{fit();requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.remove('boot')))};
  const wait=()=>{const ok=(typeof GEM_READY==='undefined'||GEM_READY)&&(typeof paintedBG!=='function'||paintedBG('cut_dusk'));
    if(ok||Date.now()-t0>3000)go();else setTimeout(wait,60)};wait()})();
