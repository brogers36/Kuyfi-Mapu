// usage: node cap.js spec.json [name,name]  -> cap/<name>/0000.png ...
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const spec=JSON.parse(fs.readFileSync(process.argv[2]));const only=process.argv[3]?process.argv[3].split(','):null;
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
for(const sh of spec){if(only&&!only.includes(sh.name))continue;
  const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///home/claude/kewun/master/index.html');await p.waitForTimeout(1200);
  await p.evaluate(()=>{window.__raf=window.requestAnimationFrame;window.requestAnimationFrame=()=>0;window.__ts=performance.now();
    window.__step=n=>{for(let i=0;i<n;i++){window.__ts+=1000/30;loopBody(window.__ts)}}});
  await p.evaluate(()=>{_lt=0;_acc=0});
  if(sh.pre)await p.evaluate(sh.pre);await p.evaluate(()=>__step(4));
  await p.evaluate(sh.setup);await p.evaluate(n=>__step(n),sh.warm||0);
  if(sh.after)await p.evaluate(sh.after);
  const dir='/home/claude/film/cap/'+sh.name;fs.mkdirSync(dir,{recursive:true});
  for(let i=0;i<sh.n;i++){await p.evaluate(()=>__step(1));if(sh.each)await p.evaluate(sh.each);
    const d=await p.evaluate(()=>document.getElementById('cv').toDataURL('image/png'));fs.writeFileSync(dir+'/'+String(i).padStart(4,'0')+'.png',Buffer.from(d.split(',')[1],'base64'))}
  console.log(sh.name,sh.n,errs.slice(0,3).join(' | '));await p.close()}
await b.close()})();
