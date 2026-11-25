const {chromium}=require('playwright');const fs=require('fs');
const SC=(process.argv[2]?null:0)||[
 {name:'a_night',n:180,setup:`S.wtime=0.8*43200;loadMap('lof',17,7,true);ents=ents.filter(e=>e.kind==='npc'&&/weaver|cook/.test(e.look));SCN=[];ents.push({id:'kk',kind:'npc',look:'kuku',fem:1,x:19,y:7,fx:19,fy:7,dir:'left',fixed:1,seated:0,wait:9999,cd:9999,pi:0,bt:0,ox:19,oy:7,talk:()=>0});P.dir='right';`},
 {name:'b_fog',n:180,setup:`loadMap('k_rupu',2,6,true);ents=[];P.dir='right';`,each:`held.right=(window.__i<92)?1:0;`},
 {name:'c_lof',n:210,setup:`S.wtime=0;S.wx={pukem:{k:'pire',u:9e15}};S.flags.ky_arrive=1;loadMap('k_lof',3,8,true);P.dir='right';`,each:`held.right=(window.__i<120)?1:0;`},
 {name:'d_battle',n:210,setup:`S.wtime=0;S.flags.liwen=1;loadMap('k_lof',10,8,true);startBattle(['kolokolo'],{boss:1});B.en[0].hidden=0;B.wipe=0;B.intro=0;B.snap=null;document.getElementById('dlg').style.display='none';active=null;`,
   each:`document.getElementById('dlg').style.display='none';const m=document.getElementById('menu');if(m)m.style.display='none';if(window.__i===70){B.flash=12;B.heroA=16;sfx&&0;spark(LW-40,110,'#ffe890',24);spark(LW-80,110,'#aef2c0',24)}if(window.__i===120){B.en[0].hit=14;pop(70,60,'-18','#ffffff')}`}];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
for(const sh of SC){if(process.argv[2]&&!process.argv[2].split(',').includes(sh.name))continue;const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///home/claude/Kuyfi-Mapu/www/index.html');await p.waitForTimeout(1200);
  await p.evaluate(()=>{window.FILM=1;localStorage.clear();S=newState('millaray');S.gloss='es';$('title').style.display='none';mode='map';
    window.__raf=window.requestAnimationFrame;window.requestAnimationFrame=()=>0;window.__ts=performance.now();
    window.__step=n=>{for(let i=0;i<n;i++){window.__ts+=1000/30;loopBody(window.__ts)}};_lt=0;_acc=0});
  await p.evaluate(sh.setup);await p.evaluate(n=>{drawHUD=()=>{};ents.forEach(e=>e.bub=null);if(n==='a_night'||n==='b_fog')dayPhase=()=>({name:'night',dark:n==='a_night'?.42:.3,warm:0,t:.8})},sh.name);await p.evaluate(()=>__step(30));
  const dir='/home/claude/film_ky/cap/'+sh.name;fs.mkdirSync(dir,{recursive:true});
  for(let i=0;i<sh.n;i++){await p.evaluate(i=>{window.__i=i},i);if(sh.each)await p.evaluate(sh.each);await p.evaluate(()=>{WXS.toast=0;ents.forEach(e=>e.bub=null)});await p.evaluate(()=>__step(1));
    const d=await p.evaluate(()=>document.getElementById('cv').toDataURL('image/png'));fs.writeFileSync(dir+'/'+String(i).padStart(4,'0')+'.png',Buffer.from(d.split(',')[1],'base64'))}
  console.log(sh.name,errs.slice(0,3).join(' | '));await p.close()}
await b.close()})();
