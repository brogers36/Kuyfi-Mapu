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
  $('bPWA').onclick=()=>{if(PWAQ){PWAQ.prompt();PWAQ=null}else $('andtxt').innerHTML='En Chrome: menú ⋮ → «Instalar app».<br>In Chrome: ⋮ menu → "Install app".'};
  $('bIOS').onclick=()=>{const h=$('ioshint');h.style.display=h.style.display==='block'?'none':'block';$('andhint').style.display='none';$('title').classList.toggle('inst',h.style.display==='block')};
})();
function updLang(){$('copy').textContent=LANG==='es'?'© 2026 Brandon M. A. Rogers · Todos los derechos reservados. Prohibido usar este sitio para entrenar inteligencia artificial.':'© 2026 Brandon M. A. Rogers · All rights reserved. No use of this site to train artificial intelligence.';$('bLang').textContent=LANG==='es'?'Glosa: Español':'Gloss: English';$('skip').textContent=LANG==='es'?'Saltar ▶▶':'Skip ▶▶'}
$('bLang').onclick=()=>{LANG=LANG==='es'?'en':'es';updLang()};
$('bMus').onclick=()=>toggleMute();
$('bMus').textContent=AU.muted?'♪ Música: no':'♪ Música: sí';$('pN').textContent=AU.muted?'♪×':'♪';
const HEROBTN=[['hM','millaray'],['hA','ayelen'],['hL','llanka'],['hK','kallfurungi']];
for(const [id,lk] of HEROBTN){const cvs=$(id).querySelector('canvas'),c=cvs.getContext('2d');c.imageSmoothingEnabled=false;
  let t=0;setInterval(()=>{t++;c.clearRect(0,0,32,48);c.drawImage(charSprite(lk,'down',HERO===lk?Math.floor(t)%4:0),0,0,32,48)},180);
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
function newGo(src){slotPick(true,n=>{setSlot(n);S=src?heroState(src):newState(HERO);persist();gcEvent('nuevo-'+(S.hero||HERO),'Juego nuevo: '+((HEROES[S.hero]||{}).name||S.hero));$('title').style.display='none';startCut()})}
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
