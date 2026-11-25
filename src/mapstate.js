/* ============================================================
   MAP STATE + LAYER BUILDING
   ============================================================ */
const PENSPOT=[[10,2],[12,3],[14,2],[11,3],[15,3]];
let CUR='rupu',M=null,grid=null,ents=[],LAYERS=[],GT=null,PROPS=[],RUKAS=[],SCN=[];
const P={x:1,y:6,fx:1,fy:6,ox:1,oy:6,t:0,moving:false,dir:'down',spd:.125};
const WALK=new Set(['.',',','"','=','_','P','m','g','p','S','q','k','A','b','@','j']);
function inB(x,y){return x>=0&&y>=0&&x<M.w&&y<M.h}
function walk(x,y){return inB(x,y)&&WALK.has(grid[y][x])}
function entAt(x,y,skip){return ents.find(e=>e!==skip&&e.x===x&&e.y===y)}
const C3=h=>hexRGB(h);
const PL={G0:C3('#18481c'),G1:C3('#307c34'),G2:C3('#48a048'),G3:C3('#80c868'),GY:C3('#58b058'),GL:C3('#90d890'),GM:C3('#70b870'),
  S0:C3('#b08848'),S1:C3('#d8b878'),S2:C3('#ecd498'),S3:C3('#f8ecc0'),
  W0:C3('#182060'),W1:C3('#2c4c9c'),W2:C3('#4068b8'),W3:C3('#6890d8'),WF:C3('#a8c8f8'),
  D1:C3('#a87848'),D2:C3('#c89860'),D3:C3('#e0bc80'),
  C0:C3('#201810'),C1:C3('#3c2c20'),C2:C3('#5a4430'),C3:C3('#78604a'),CD:C3('#4a3828'),
  FW:C3('#f8f8f8'),FY:C3('#f8d848'),FR:C3('#e85868')};
const PL0=Object.assign({},PL);
const PALS={
  nagche:{G0:'#24461a',G1:'#3e7426',G2:'#5c9c34',G3:'#9ccc58',GY:'#6aa83c',GL:'#a4d070',GM:'#80b450',D1:'#9a6438',D2:'#b8844c',D3:'#d6aa68',FR:'#d83850',FY:'#f8d040',FW:'#fff8e8'},
  nagforest:{G0:'#10301e',G1:'#1e4e30',G2:'#2e6a3e',G3:'#5a9a5c',GY:'#3a7a46',GL:'#6aa070',GM:'#4a8a56',D1:'#5a4a30',D2:'#6e5a3a',D3:'#8a7450',FR:'#c8a0f0',FY:'#f0e890',FW:'#e8fff0'},
  pewenche:{G0:'#1e3a2a',G1:'#2e5a3e',G2:'#4a7a54',G3:'#7aa880',GY:'#5a8a62',GL:'#9ac0a0',GM:'#6a9a72',S0:'#8a98b0',S1:'#c4d0e2',S2:'#e6edf6',S3:'#ffffff',D1:'#7a6a5a',D2:'#948472',D3:'#b0a08c',FR:'#f0f0ff',FY:'#ffe0a0',FW:'#ffffff'},
  ash:{G0:'#2a2a24',G1:'#4a4a3a',G2:'#62624e',G3:'#8a8a70',GY:'#6a6a54',GL:'#9a9a80',GM:'#7a7a62',S0:'#3a3434',S1:'#5a5252',S2:'#6e6464',S3:'#8a8080',D1:'#4a3a32',D2:'#5a4a40',D3:'#74645a',FR:'#f86018',FY:'#ffb040',FW:'#d0c0b0'},
  williche:{G0:'#123a2a',G1:'#1e5a3c',G2:'#2e7a4c',G3:'#5aa870',GY:'#3a8a58',GL:'#7ab890',GM:'#4a9a66',S0:'#7a7a6a',S1:'#a8a894',S2:'#c4c2ac',S3:'#e0dec8',D1:'#5a4a3a',D2:'#6e5c48',D3:'#8a7860',FR:'#e04880',FY:'#f0e070',FW:'#ffffff'},
  wilcave:{C0:'#0a1214',C1:'#1e2e34',C2:'#2a3e46',C3:'#46606a',CD:'#22343a'},
  pewcave:{C0:'#140808',C1:'#3a1a14',C2:'#4a2620',C3:'#6a382c',CD:'#2c1410'},
  nagcave:{C0:'#0e1610',C1:'#26322a',C2:'#3a4a3c',C3:'#56685a',CD:'#2e3c30'},
  rukain:{C0:'#1a0e06',C1:'#38220e',C2:'#54381c',C3:'#74542e',CD:'#2a180a'},
  puelmapu:{G0:'#5a4a16',G1:'#8a7224',G2:'#b09434',G3:'#d8c05c',GY:'#c0a040',GL:'#e8d47c',GM:'#caa84c',S0:'#9a8456',S1:'#c4ac78',S2:'#dcc896',S3:'#f0e2b8',D1:'#8a6a3a',D2:'#aa8850',D3:'#c8a86c',FR:'#d84830',FY:'#f8e048',FW:'#fff8e0'},
  salar:{G0:'#6a6240',G1:'#8a8258',G2:'#a89e70',G3:'#c8c094',GY:'#b0a878',GL:'#d8d0a8',GM:'#beb484',S0:'#c0bcae',S1:'#dedacc',S2:'#efecdf',S3:'#fffdf2',D1:'#a89a7e',D2:'#c0b496',D3:'#d8ccb0',W0:'#4a6a62',W1:'#6a9a8a',W2:'#8ab8a6',W3:'#b0d8c6',WF:'#e0f4ea',FR:'#d84830',FY:'#f8e048',FW:'#ffffff'},
  puelcave:{C0:'#160f06',C1:'#3a2a12',C2:'#55401e',C3:'#74582c',CD:'#2c2010'},
  ngoylaf:{G0:'#2e3a30',G1:'#44544a',G2:'#5a6e60',G3:'#84988a',GY:'#68806e',GL:'#98ac9e',GM:'#788c7e',S0:'#8a887c',S1:'#aaa89a',S2:'#c2c0b2',S3:'#d8d6c8',W0:'#20303e',W1:'#32485a',W2:'#466078',W3:'#64809a',WF:'#9ab4c8',D1:'#7a7468',D2:'#948e80',D3:'#aca698',FR:'#9a8a90',FY:'#c0b890',FW:'#e8e8e0'},
  ngoynag:{G0:'#323a2c',G1:'#485444',G2:'#5e6c58',G3:'#869480',GY:'#6c7c66',GL:'#9aa894',GM:'#7c8c76',D1:'#78705e',D2:'#8e8674',D3:'#a8a08e',FR:'#9a8488',FY:'#bcb488',FW:'#e4e4da'},
  ngoypew:{G0:'#303a38',G1:'#46544e',G2:'#5c6c64',G3:'#84948c',GY:'#6a7c72',GL:'#98a8a0',GM:'#7a8c82',S0:'#8e96a2',S1:'#b2bac4',S2:'#ccd2da',S3:'#e4e8ee',D1:'#767270',D2:'#8c8886',D3:'#a6a2a0',FR:'#a0929a',FY:'#c2bca0',FW:'#f0f0f4'},
  ngoywil:{G0:'#243430',G1:'#384c44',G2:'#4a6056',G3:'#70877a',GY:'#587064',GL:'#84988c',GM:'#667c70',S0:'#767a72',S1:'#9aa096',S2:'#b4b8ac',S3:'#ccd0c4',D1:'#5e584c',D2:'#746e60',D3:'#8e887a',FR:'#8e8290',FY:'#b0ac84',FW:'#e2e6dc'},
  ngoypuel:{G0:'#4a4630',G1:'#645e42',G2:'#7c7654',G3:'#9e9878',GY:'#8a8462',GL:'#aea890',GM:'#948e6e',S0:'#8e887a',S1:'#aea896',S2:'#c4beac',S3:'#d8d4c4',D1:'#7e7662',D2:'#948c76',D3:'#aaa28c',FR:'#9a8a84',FY:'#beb48e',FW:'#e8e6da'},
  stgo:{C0:'#3a3a44',C1:'#5a5a66',C2:'#73737e',C3:'#8e8e98',CD:'#4a4a54',G0:'#1e4420',G1:'#2f6630',G2:'#428442',G3:'#6aa862',GY:'#4e8a4a',GL:'#80b878',GM:'#60a058',S0:'#7a7a80',S1:'#9a9aa2',S2:'#b2b2ba',S3:'#c8c8d0',D1:'#8a7050',D2:'#a28866',D3:'#bca380',FR:'#d84850',FY:'#f8d048',FW:'#ffffff'},
  munche:{C0:'#083038',C1:'#114a56',C2:'#1a5e6c',C3:'#2a7a88',CD:'#0c3a44',G0:'#0a3a42',G1:'#11525c',G2:'#1a6c76',G3:'#2e919a',GY:'#207a84',GL:'#48aab2',GM:'#2a8690',S0:'#1e5e74',S1:'#2a7a92',S2:'#3996ae',S3:'#52b2c8',W0:'#041824',W1:'#082836',W2:'#0e3a4c',W3:'#165064',WF:'#2a7a92',D1:'#1a5a6a',D2:'#247486',D3:'#3290a2',FR:'#ff8a9a',FY:'#ffe9a0',FW:'#d8fbff'},
  munchedeep:{C0:'#06242e',C1:'#0e3a48',C2:'#164c5c',C3:'#246478',CD:'#0a2e3a',G0:'#062830',G1:'#0a3a44',G2:'#104c58',G3:'#1c6874',GY:'#145866',GL:'#2a7e8c',GM:'#1a6472',S0:'#123e50',S1:'#1a5468',S2:'#246a80',S3:'#328298',W0:'#020e16',W1:'#041a26',W2:'#082634',W3:'#0e3444',WF:'#1a5468',D1:'#0e4050',D2:'#165264',D3:'#206678',FR:'#ff8a9a',FY:'#ffe9a0',FW:'#d8fbff'},
  metro:{C0:'#14161c',C1:'#2c3038',C2:'#3c424c',C3:'#5a626e',CD:'#22262e'},
  deptoin:{C0:'#2a1c12',C1:'#4a3420',C2:'#6a4c30',C3:'#8a6a44',CD:'#3a2818'},
  ngoycave:{C0:'#10141a',C1:'#242c38',C2:'#323c4a',C3:'#4c5868',CD:'#1c242e'},
  niebla:{G0:'#3a4440',G1:'#4e5a54',G2:'#64726a',G3:'#8a988e',GY:'#708076',GL:'#9aa89e',GM:'#7a8a80',D1:'#5a5a52',D2:'#6e6e64',D3:'#88887c',FR:'#a8b8c0',FY:'#c8d8d0',FW:'#e8f4f0'}};
const WALLS={ruka:['#6a4a26','#9a7444','#84603a','#3a2812','#140c04'],williche:['#34464e','#5e7a84','#4a626a','#1c2a30','#0a1214'],lafken:['#5a4430','#8a7058','#78604a','#3c2c20','#201810'],pewenche:['#2e2224','#5a4448','#463438','#1a1214','#0a0606'],puelmapu:['#4a3a22','#7a6240','#604c30','#2a2012','#120c04'],ngoyman:['#2e3a4a','#54667e','#425264','#1a222e','#0a0e14'],chumpall:['#0e4a56','#2a8a9a','#1a6a7a','#062a34','#02141a'],santiago:['#7e7e88','#b2b2bc','#9898a2','#44444e','#1c1c22'],nagche:['#3c4c3e','#6e8a68','#5a7058','#243026','#0e160e'],metro:['#c8ccd2','#e8ecf0','#d8dce2','#a0a6ae','#5a6068'],depto:['#d8c8a8','#efe4cc','#e2d4b8','#b8a688','#6a5a44']};
function applyPal(){Object.assign(PL,PL0);const p=PALS[M.pal];if(p)for(const k in p)PL[k]=C3(p[k])}
function gtype(ch){if(ch==='~'||ch==='v')return'~';if(ch==='.'||ch===','||ch==='='||ch==='_'||ch==='%'||ch==='"'||ch==='Y'||ch==='b')return ch;if(ch==='T'||ch==='W'||ch==='f')return',';return M.floor}
function gAt(x,y){if(x<0||y<0||x>=M.w||y>=M.h)return null;return GT[y][x]}
function edgeDist(tx,ty,lx,ly,pred){let d=99;const E=15.5;
  if(pred(gAt(tx-1,ty)))d=Math.min(d,lx+.5);if(pred(gAt(tx+1,ty)))d=Math.min(d,E-lx);
  if(pred(gAt(tx,ty-1)))d=Math.min(d,ly+.5);if(pred(gAt(tx,ty+1)))d=Math.min(d,E-ly);
  if(d<99)return d;
  if(pred(gAt(tx-1,ty-1)))d=Math.min(d,Math.hypot(lx+.5,ly+.5));if(pred(gAt(tx+1,ty-1)))d=Math.min(d,Math.hypot(E-lx,ly+.5));
  if(pred(gAt(tx-1,ty+1)))d=Math.min(d,Math.hypot(lx+.5,E-ly));if(pred(gAt(tx+1,ty+1)))d=Math.min(d,Math.hypot(E-lx,E-ly));
  return d}
const isLand=g=>g!==null&&g!=='~',isWater=g=>g==='~',isGrass=g=>g===','||g==='"'||g==='Y';
function vnoise(x,y,s,k){const gx=Math.floor(x/s),gy=Math.floor(y/s),fx=x/s-gx,fy=y/s-gy,a=h2(gx,gy,k),b=h2(gx+1,gy,k),c=h2(gx,gy+1,k),d=h2(gx+1,gy+1,k),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
function ditherRamp(ramp,n,gx,gy){const t=Math.max(0,Math.min(.999,n))*(ramp.length-1),i=Math.floor(t),f=t-i;return ramp[Math.min(ramp.length-1,f>(BAYER[gy&3][gx&3]+.5)/16?i+1:i)]}
function ctGrass(gx,gy){
  let n=vnoise(gx,gy,44,5)*.75+vnoise(gx,gy,14,6)*.25;n=Math.max(0,Math.min(1,(n-.22)/.56));
  const ramp=[lerp3(PL.G0,PL.G1,.35),PL.G1,lerp3(PL.G1,PL.G2,.5),PL.G2,lerp3(PL.G2,PL.G3,.4),lerp3(PL.G2,PL.G3,.7)];
  let col=ditherRamp(ramp,n,gx,gy);
  const cx=gx>>2,cy=gy>>2;if(h2(cx,cy,41)<.16){const lx=gx&3,ly=gy&3;if((lx===1&&ly<3)||(lx===2&&ly===1))col=lerp3(col,PL.G3,.6);else if(lx===1&&ly===3)col=lerp3(col,PL.G0,.5)}
  if(h2(gx>>4,gy>>4,11)<.07){const fx=3+Math.floor(h2(gx>>4,gy>>4,12)*10),fy=3+Math.floor(h2(gx>>4,gy>>4,13)*10),dx=(gx&15)-fx,dy=(gy&15)-fy;if(dx===0&&dy===0)return PL.FY;if(Math.abs(dx)+Math.abs(dy)===1)return PL.FW}
  return col}
function grassPix(gx,gy,base){
  if(CT)return ctGrass(gx,gy);
  const tx=gx>>4,ty=gy>>4,lx=gx&15,ly=gy&15;
  if(h2(tx,ty,11)<.18){const fx=3+Math.floor(h2(tx,ty,12)*10),fy=3+Math.floor(h2(tx,ty,13)*10),dx=lx-fx,dy=ly-fy;
    if(dx===0&&dy===0)return PL.FY;if(Math.abs(dx)+Math.abs(dy)===1)return h2(tx,ty,14)<.5?PL.FW:PL.FR}
  for(let k=0;k<3;k++){const fx=2+Math.floor(h2(tx,ty,20+k)*12),fy=3+Math.floor(h2(tx,ty,30+k)*11),dx=lx-fx,dy=ly-fy;
    if((dx===0&&dy===0)||(dy===1&&Math.abs(dx)===1))return PL.G1;if(dx===0&&dy===-1&&k===0)return PL.G3}
  return base}
function gpix(gx,gy,f){
  const tx=gx>>4,ty=gy>>4,lx=gx&15,ly=gy&15,g=GT[ty][tx];
  if(g==='~'){
    const dl=edgeDist(tx,ty,lx,ly,isLand);
    if(dl<1)return M.lava?[40,16,12]:PL.W0;
    if(dl<2.2+(((gx>>1)+f)%3===0?1:0))return M.lava?[255,236,150]:PL.WF;
    if(dl<3.6)return M.lava?[255,170,60]:PL.W3;
    let dep=dl<99?dl:wdep(gx,gy);dep+=Math.sin(gx*.09+gy*.05)*1.6+Math.sin(gx*.031-gy*.07)*2;
    const TIERS=M.lava?[[255,200,80],[250,150,40],[230,100,30],[200,70,24],[170,50,20],[140,36,16]]:[[104,152,228],[80,128,214],[64,108,198],[52,90,180],[42,74,160],[34,60,140]];
    let ti=dep<6?0:dep<10?1:dep<16?2:dep<24?3:dep<34?4:5;
    const nb=[6,10,16,24,34][ti];if(ti<5&&nb-dep<1.4&&(gx+gy)%2===0)ti++;
    let col=TIERS[ti];
    const ph=f*2.094,w1=Math.sin(gx*.21+gy*.62+ph)+Math.sin(gx*.07-gy*.33+ph*.5+1.3);
    if(M.lava){if(w1>1.5)col=lerp3(col,[255,240,170],.6);else if(w1<-1.5)col=lerp3(col,[60,20,10],.5);return col}
    if(w1>1.62)col=lerp3(col,[176,212,248],.65);else if(w1>1.45&&(gx&1))col=lerp3(col,[150,196,244],.45);else if(w1<-1.6)col=lerp3(col,[20,40,100],.3);
    const u=(gx+f*3+((gy>>3)%2)*6)%14,v=gy%9;
    if(ti<=2&&((v===3&&(u===0||u===3))||(v===4&&(u===1||u===2))))col=lerp3(col,[200,224,252],.6);
    if(h2(gx>>2,gy,f+50)<.012)return[236,246,255];
    return col}
  if(M.urban&&g!=='~'){
    // contact shadow cast by buildings and big props (light from the upper left: shade falls below and to the right)
    const hAbove=grid[ty-1]&&grid[ty-1][tx]==='h',hLeft=tx>0&&grid[ty][tx-1]==='h';
    let ao=0;if(hAbove&&ly<10)ao=Math.max(ao,ly<7?.42:(10-ly)/3*.42*(((gx+gy)&1)?1:.6));if(hLeft&&lx<5)ao=Math.max(ao,(5-lx)/5*.26);
    // broad dappled light, as in the other regions (passing cloud shade and the canopy of street trees)
    const dp=vnoise(gx,gy,38,81)*.7+vnoise(gx,gy,13,82)*.3,dap=dp>.62?.13:dp>.56&&((gx+gy)&1)?.07:dp<.3?-.06:0;
    const AO=col=>{let k=1-dap;if(ao)k*=1-ao*(((gx+gy)&1)?1:.85);return [col[0]*k,col[1]*k*.99,Math.min(255,col[2]*k*1.05)]};
    if(g==='='){ // asphalt: grain, patches, cracks, a lit curb with a shadowed face
      const dc=edgeDist(tx,ty,lx,ly,x=>x===','||x==='Y'||x==='.'||x==='h');
      if(dc<1)return AO([168,168,172]);if(dc<2)return AO([120,120,126]);if(dc<3)return AO([62,62,68]);
      const n=vnoise(gx,gy,10,51)*.6+vnoise(gx,gy,3,52)*.4;
      let col=ditherRamp([[62,62,69],[70,70,77],[78,78,85],[86,86,92]],n,gx,gy);
      if(h2(gx,gy,61)<.025)col=[96,96,102];else if(h2(gx,gy,63)<.02)col=[52,52,58];
      if(h2(gx>>3,gy>>3,64)<.05){const u=gx&7,v=gy&7;if(Math.abs(u-v)<1||(u+v===7&&h2(gx>>3,gy>>3,65)<.5))col=[46,46,52]}
      if(vnoise(gx,gy,18,66)>.78)col=lerp3(col,[40,40,48],.35);   // oil stains
      const hor=gAt(tx-1,ty)==='='&&gAt(tx+1,ty)==='=',ver=gAt(tx,ty-1)==='='&&gAt(tx,ty+1)==='=';
      const wide=hor&&(gAt(tx,ty-1)==='='||gAt(tx,ty+1)==='='),wideV=ver&&(gAt(tx-1,ty)==='='||gAt(tx+1,ty)==='=');
      if(wide&&gAt(tx,ty-1)==='='&&gAt(tx,ty+1)!=='='&&ly<=0&&(gx%12)<7)col=h2(gx,gy,67)<.2?[170,154,80]:[216,196,96];
      else if(wideV&&gAt(tx-1,ty)==='='&&gAt(tx+1,ty)!=='='&&lx<=0&&(gy%12)<7)col=[216,196,96];
      if(h2(tx,ty,68)<.04){const dx=lx-7.5,dy=ly-7.5,r=Math.hypot(dx,dy);if(r<4.2)col=r>3.3?[44,44,50]:((lx+ly)%2?[92,92,98]:[70,70,76])}  // manhole
      return AO(col)}
    if(g===','){ // sidewalk slabs, each slab bevelled and slightly different
      const u=gx&15,v=gy&15,sx2=gx>>4,sy2=gy>>4,tone=(h2(sx2,sy2,69)-.5)*10;
      let col;if(u===15||v===15)col=[118,114,112];else if(u===0||v===0)col=[188,184,178];else if(u===14||v===14)col=[138,134,130];
      else{const n=vnoise(gx,gy,7,70);col=ditherRamp([[150,146,142],[158,154,150],[166,162,157],[174,170,164]],n*.9+.05,gx,gy)}
      col=[col[0]+tone,col[1]+tone,col[2]+tone];
      if(h2(gx,gy,71)<.012)col=[150,150,156];
      if(h2(sx2,sy2,72)<.06&&Math.abs(u-v-2)<1&&u>2&&u<13)col=[132,132,138];   // a crack across some slabs
      if(gAt(tx,ty+1)==='='&&ly>=14)col=[110,110,116];                          // curb face toward the street
      return AO(col)}
    if(g==='.'){const n=vnoise(gx,gy,9,41)*.7+vnoise(gx,gy,3,42)*.3;let col=ditherRamp([PL.D1,lerp3(PL.D1,PL.D2,.5),PL.D2,lerp3(PL.D2,PL.D3,.5),PL.D3],n,gx,gy);
      if(h2(gx,gy,43)<.02)col=PL.D3;if(h2(gx>>1,gy>>1,44)<.012)col=[150,150,150];return AO(col)}
    if(g==='Y'){const de=edgeDist(tx,ty,lx,ly,x=>x!==null&&x!=='Y');if(de<1)return [150,140,110];if(de<2)return [98,90,64];return AO(ctGrass?ctGrass(gx,gy):grassPix(gx,gy,PL.G2))}
  }
  if(g==='.'||g==='='){
    const dg=edgeDist(tx,ty,lx,ly,isGrass),thr=1.6+((gx*7+gy*3)%3)*.7;
    if(dg<thr-1)return grassPix(gx,gy,PL.G2);if(dg<thr)return PL.G0;
    if(g==='.'&&CT){const dw=edgeDist(tx,ty,lx,ly,isWater);if(dw<2.2)return PL.S1;return ditherRamp([PL.S1,lerp3(PL.S1,PL.S2,.5),PL.S2,lerp3(PL.S2,PL.S3,.5)],vnoise(gx,gy,14,21)*.6+vnoise(gx,gy,5,22)*.4,gx,gy)}
    if(g==='.'){const dw=edgeDist(tx,ty,lx,ly,isWater);if(dw<2.2)return PL.S1;
      const n=h2(gx,gy,1);if(n<.03)return PL.S1;if(n>.992)return PL.S3;
      if(gy%4===0&&(gx+((gy>>2)%3)*5)%14<3&&h2(gx>>4,gy>>2,5)<.5)return PL.S1;return PL.S2}
    if(M.pave){const u=gx%8,v=gy%8;if(u===7||v===7)return PL.GM;if(u===0||v===0)return lerp3(PL.GL,[255,255,255],.25);return PL.GL}
    const ds=edgeDist(tx,ty,lx,ly,x=>x==='.');if(ds<1.5)return PL.S2;
    if(CT){if(h2(gx>>1,gy>>1,8)<.035)return (gy&1)?PL.D1:lerp3(PL.D3,[255,255,255],.25);return ditherRamp([PL.D1,lerp3(PL.D1,PL.D2,.5),PL.D2,lerp3(PL.D2,PL.D3,.5),PL.D3],vnoise(gx,gy,12,31)*.7+vnoise(gx,gy,4,32)*.3,gx,gy)}
    if(h2(gx>>1,gy>>1,8)<.07)return (gy&1)?PL.D1:PL.D3;return PL.D2}
  if(g==='b'){if(ly<2||ly>13)return ly===0||ly===15?[60,36,20]:[120,78,40];return (gx%4===0)?[90,58,30]:(h2(gx>>2,gy,3)<.2?[150,100,56]:[170,118,66])}
  if(g===',')return grassPix(gx,gy,PL.G2);
  if(g==='Y')return grassPix(gx,gy,PL.GY);
  if(g==='"'&&CT){const u=gx%8,v=gy%8,ox=(gx>>3)%2?1:0,d=Math.hypot(u-3.5-ox*.5,v-4);if(d>3.9)return ctGrass(gx,gy);if(d>3.2)return PL.G0;
    if(h2(gx,gy,77)<.07&&d<2.8)return PL.FY;const leaf=((u*2+v+((gx>>3)*3))%4);return leaf===0?PL.G0:(u+v<6?PL.G3:leaf===1?PL.G1:PL.G2)}
  if(g==='"'){const u=gx%8,v=gy%8,d=Math.hypot(u-3.5,v-3.5);if(d>3.6)return PL.G2;if(d>2.9)return PL.G0;if(u+v<5&&d<2.4)return PL.G3;if((u===3||u===4)&&(v===3||v===4))return PL.G0;return PL.G1}
  if(g==='_'){const u=gx%8,v=gy%8;let col=(u===7||v===7)?PL.C1:(u===0||v===0)?PL.C3:(h2(gx>>3,gy>>3,4)<.25?PL.CD:PL.C2);
    if(gAt(tx,ty-1)==='%'&&ly<4)col=lerp3(col,[10,6,4],.45);return col}
  if(g==='%'){return ((gx>>2)+(gy>>2))%2&&(gx%4===0||gy%4===0)?PL.C1:PL.C0}
  return PL.S2;
}
function wdep(gx,gy){const fx=(gx-8)/16,fy=(gy-8)/16,x0=Math.floor(fx),y0=Math.floor(fy),ax=fx-x0,ay=fy-y0;
  const W=(x,y)=>{x=Math.max(0,Math.min(M.w-1,x));y=Math.max(0,Math.min(M.h-1,y));return WD[y][x]};
  const v=(W(x0,y0)*(1-ax)+W(x0+1,y0)*ax)*(1-ay)+(W(x0,y0+1)*(1-ax)+W(x0+1,y0+1)*ax)*ay;return v*16-8}
let WD=null;
function buildLayers(){
  applyPal();GT=grid.map(r=>r.map(gtype));
  WD=GT.map(r=>r.map(g=>g==='~'?99:0));
  for(let it=0;it<40;it++){let ch=0;for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){if(WD[y][x]===0)continue;let m=WD[y][x];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;const n=(xx<0||yy<0||xx>=M.w||yy>=M.h)?6:WD[yy][xx];if(n+1<m)m=n+1}
    if(m!==WD[y][x]){WD[y][x]=m;ch=1}}if(!ch)break}
  const mw=M.w*T,mh=M.h*T;LAYERS=[];
  const [sc,sx]=mk(mw,mh);drawGroundStatics(sx);
  let base=null;
  for(let f=0;f<3;f++){
    const [cvs,c]=mk(mw,mh),id=c.createImageData(mw,mh),d=id.data;
    if(!base){for(let gy=0;gy<mh;gy++)for(let gx=0;gx<mw;gx++){const col=gpix(gx,gy,0),i=(gy*mw+gx)*4;d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2];d[i+3]=255}base=new Uint8ClampedArray(d)}
    else{d.set(base);for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){if(GT[ty][tx]!=='~')continue;
      for(let gy=ty*T;gy<ty*T+T;gy++)for(let gx=tx*T;gx<tx*T+T;gx++){const col=gpix(gx,gy,f),i=(gy*mw+gx)*4;d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2]}}}
    c.putImageData(id,0,0);c.drawImage(sc,0,0);LAYERS.push(cvs);
  }
  PROPS=[];RUKAS=[];
  for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){const ch=grid[y][x];
    if(ch==='T'){const tc=treeCanvas(Math.floor(h2(x,y,2)*3),M.trees);PROPS.push({y:y+.9,cvs:tc,dx:x*T+8-(tc.width>>1),dy:y*T+16-tc.height+(y===0?6:0),sh:[x*T+8,y*T+14,7,2]})}
    else if(ch==='#')PROPS.push({y:y+.8,cvs:rockCanvas(Math.floor(h2(x,y,2)*2)),dx:x*T,dy:y*T+2,sh:[x*T+8,y*T+14,7,2]});
    else if(ch==='V')PROPS.push({y:y+.9,cvs:boardCanvas(),dx:x*T-4,dy:y*T-6,sh:[x*T+8,y*T+15,10,2],board:1});
    else if(ch==='l')PROPS.push({y:y+.9,cvs:lampCanvas(),dx:x*T+3,dy:y*T-18,sh:[x*T+8,y*T+15,4,2],lamp:1});
    if(M.metroGate&&x===M.metroGate.x&&y===M.metroGate.y){const g=M.metroGate;PROPS.push({y:y-.45,cvs:metroHoleCanvas(g.w),dx:x*T,dy:y*T-1,sh:[x*T+g.w*8,y*T+15,1,1]});PROPS.push({y:y+.9,cvs:metroTotemCanvas(),dx:(x+g.w)*T+1,dy:y*T-28,sh:[(x+g.w)*T+8,y*T+15,5,2],mtotem:1})}
    else if(ch==='z')PROPS.push({y:y+.9,cvs:benchCanvas(),dx:x*T,dy:y*T+4,sh:[x*T+8,y*T+15,8,2]});
    else if(ch==='w')PROPS.push({y:y+.9,cvs:railCanvas(),dx:x*T,dy:y*T+3,sh:[x*T+8,y*T+15,8,1]});
    else if(ch==='e')PROPS.push({y:y+.9,cvs:stallCanvas(Math.floor(h2(x,y,9)*6)),dx:x*T-2,dy:y*T-10,sh:[x*T+8,y*T+15,9,2]});
    else if(ch==='o'&&(x===0||grid[y][x-1]!=='o'))PROPS.push({y:y+.9,cvs:shelterCanvas(),dx:x*T,dy:y*T-10,sh:[x*T+16,y*T+15,14,2]});
    else if(ch==='c'&&(x===0||grid[y][x-1]!=='c')){let n=0;while(x+n<M.w&&grid[y][x+n]==='c')n++;PROPS.push({y:y+.9,cvs:vehicleCanvas(n,x*31+y*7),dx:x*T,dy:y*T-6,sh:[x*T+n*8,y*T+15,n*7,2]})}
    else if(ch==='h'&&(x===0||grid[y][x-1]!=='h')&&(y===0||grid[y-1][x]!=='h')){
      let bw=0,bh=0;while(x+bw<M.w&&grid[y][x+bw]==='h')bw++;while(y+bh<M.h&&grid[y+bh][x]==='h')bh++;
      let door;if(M.doors)for(let k=0;k<bw;k++)if(M.doors[(x+k)+','+(y+bh-1)])door=k;
      const bd=M.bld&&M.bld[x+','+y]||{};if(bd.door!==undefined)door=bd.door;
      const bc=buildingCanvas(bw,bh,x*17+y*5+(M.seed||0),{door,shop:bd.shop,mural:bd.mural,metro:bd.metro});
      PROPS.push({y:y+bh-.1,cvs:bc,dx:x*T-1,dy:y*T+bh*16-bc.height+2,sh:[x*T+bw*8,y*T+bh*16-1,bw*8,2]})}
    else if(ch==='Z')PROPS.push({y:y+.9,loom:1,dx:x*T,dy:y*T-6,sh:[x*T+8,y*T+15,8,2]});
    else if(ch==='U')PROPS.push({y:y+.9,pot:1,dx:x*T,dy:y*T,sh:[x*T+8,y*T+14,7,2]});
    else if(ch==='M')PROPS.push({y:y+.9,cvs:kulonCanvas(Math.floor(h2(x,y,7)*2)),dx:x*T-2,dy:y*T-8,sh:[x*T+8,y*T+14,8,2]});
    else if(ch==='x')PROPS.push({y:y+.9,cvs:pickCanvas(M.pickStyle||'diwen',Math.floor(h2(x,y,7)*2)),dx:x*T-2,dy:y*T-10,sh:[x*T+8,y*T+14,7,2]});
    else if(ch==='R'&&(x===0||grid[y][x-1]!=='R')&&(y===0||grid[y-1][x]!=='R')){
      let bw=0,bh=0;while(x+bw<M.w&&grid[y][x+bw]==='R')bw++;while(y+bh<M.h&&grid[y+bh][x]==='R')bh++;
      const rk=rukaCanvas(bw,bh);PROPS.push({y:y+bh-.1,cvs:rk.cvs,dx:x*T-rk.ox,dy:y*T-rk.oy,sh:[x*T+bw*8+3,y*T+bh*16-1,bw*8+2,3]});
      RUKAS.push([x*T+rk.smoke[0],y*T+rk.smoke[1]]);
      const dtx=x+(bw>>1),dty=y+bh-1;
      if(M.doors&&M.doors[dtx+','+dty])PROPS.push({y:y+bh-.05,door:1,dx:dtx*T+3,dy:y*T+bh*16-13,sh:[dtx*T+8,dty*T+15,5,2]})}}
}
function drawGroundStatics(c){
  for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){const ch=grid[y][x],X=x*T,Y=y*T;
    if(ch==='%'){const below=y+1<M.h?grid[y+1][x]:'%';
      const WC=WALLS[M.wall||(M.region==='nagche'?'nagche':M.region==='pewenche'?'pewenche':M.region==='williche'?'williche':M.region==='puelmapu'?'puelmapu':M.region==='ngoyman'?'ngoyman':M.region==='chumpall'?'chumpall':M.region==='santiago'?'santiago':'lafken')];
      if(below!=='%'){R(c,X,Y+5,16,11,WC[0]);R(c,X,Y+4,16,1,WC[1]);R(c,X,Y+5,16,1,WC[2]);
        for(let r=0;r<3;r++){const yy=Y+6+r*3+ (r===2?1:0),off=((r+x)%2)*4;R(c,X,yy+2,16,1,WC[3]);for(let k=0;k<3;k++)R(c,X+((off+k*7)%16),yy,1,2,WC[3])}
        R(c,X,Y+15,16,1,WC[4]);
        if(M.region==='williche'){for(let k=0;k<3;k++){const mx=Math.floor(h2(x,y,80+k)*14);if(h2(x,y,90+k)<.6){R(c,X+mx,Y+5,2,1,'#3a8a5a');R(c,X+mx,Y+6+k*3,1,1,'#e8e0c8')}}}
        if(M.region==='pewenche'){for(let k=0;k<3;k++){const mx=Math.floor(h2(x,y,80+k)*14);if(h2(x,y,90+k)<.55){R(c,X+mx,Y+6+k*3,1,2,'#f86018');R(c,X+mx+1,Y+7+k*3,1,1,'#ffb040')}}}
        if(M.region==='nagche'){for(let k=0;k<4;k++){const mx=Math.floor(h2(x,y,80+k)*15);if(h2(x,y,90+k)<.6)R(c,X+mx,Y+5,2,1+Math.floor(h2(x,y,95+k)*3),'#4a7a3a')}
          if(h2(x,y,99)<.35){const rx=X+3+Math.floor(h2(x,y,98)*10);for(let i=0;i<6;i++)R(c,rx+(i%3===2?1:0),Y+6+i,1,1,'#5a3e22')}}}}
  }
  for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){const ch=grid[y][x],X=x*T,Y=y*T;
    if(ch==='W'){R(c,X,Y,16,16,'#a07a30');for(let r=0;r<4;r++)for(let k=0;k<5;k++){const sx=X+1+k*3+(r%2),sy=Y+1+r*4;R(c,sx,sy,1,3,'#e8c050');R(c,sx,sy,1,1,'#f8e090');R(c,sx+1,sy+2,1,1,'#806020')}}
    else if(ch==='f'){const L=x>0&&grid[y][x-1]==='f',Rr=x<M.w-1&&grid[y][x+1]==='f',U=y>0&&grid[y-1][x]==='f',D=y<M.h-1&&grid[y+1][x]==='f';
      R(c,X+6,Y+3,4,12,'#181018');R(c,X+7,Y+4,2,10,'#8a5a30');R(c,X+7,Y+4,1,10,'#b07a40');
      if(L||Rr){const x0=L?X:X+7,x1=Rr?X+16:X+9;R(c,x0,Y+5,x1-x0,3,'#181018');R(c,x0,Y+6,x1-x0,1,'#a86c38');R(c,x0,Y+10,x1-x0,3,'#181018');R(c,x0,Y+11,x1-x0,1,'#a86c38')}
      if(U)R(c,X+7,Y,2,4,'#8a5a30');if(D)R(c,X+7,Y+14,2,2,'#8a5a30')}}
  for(const sc of (M.scenes||[]))if(sc.type==='palin'){const X=sc.x*T+2,Y=sc.y*T+2,w=sc.w*T-4,h=sc.h*T-4;
    R(c,X,Y,w,1,'#f8f8f0');R(c,X,Y+h-1,w,1,'#f8f8f0');R(c,X,Y,1,h,'#f8f8f0');R(c,X+w-1,Y,1,h,'#f8f8f0');R(c,X+w/2,Y,1,h,'#e8e8e0');
    ell(c,X+w/2,Y+h/2,5,4,'#e8e8e0');ell(c,X+w/2,Y+h/2,4,3,'#64b850')}
}
function placeNear(x,y,isEnt){
  const seen=new Set(),q=[[x,y]];
  while(q.length){const [a,b]=q.shift();const k=a+','+b;if(seen.has(k))continue;seen.add(k);
    if(walk(a,b)&&!entAt(a,b)&&!(isEnt&&a===P.x&&b===P.y)&&grid[b][a]!=='S')return [a,b];
    if(seen.size>900)break;for(const [d,e] of [[1,0],[-1,0],[0,1],[0,-1]])if(inB(a+d,b+e))q.push([a+d,b+e])}
  return [x,y];
}
const RFLAG={lafkenche:'ngen',nagche:'ngen2',pewenche:'ngen3',williche:'ngen4',puelmapu:'ngen5'};
const LOFS={lafkenche:'lof',nagche:'n_lof',pewenche:'p_lof',williche:'w_lof',puelmapu:'e_lof'},LOFIDS=Object.values(LOFS);
const lofsOpen=()=>Object.keys(LOFS).filter(r=>S&&S.flags[RFLAG[r]]);
const awake=r=>!!S.flags[RFLAG[r]];
const SONGSET={chumpall:{battle:'deepBattle',boss:'deepBoss'},ngoyman:{battle:'ngoyBattle',boss:'ngoyBoss'},puelmapu:{puel:'puel',puelG:'puelG',lof:'puelLof',lofG:'puelLofG',cave:'puelCave',battle:'puelBattle',boss:'puelBoss',ngen:'puelNgen'},williche:{lof:'wilLof',lofG:'wilLofG',cave:'wilCave',battle:'wilBattle',boss:'wilBoss',ngen:'wilNgen'},pewenche:{nag:'pew',nagG:'pewG',lof:'pewLof',lofG:'pewLofG',cave:'pewCave',battle:'pewBattle',boss:'pewBoss',ngen:'pewNgen'},nagche:{lof:'nagLof',lofG:'nagLofG',cave:'nagCave',battle:'nagBattle',boss:'nagBoss',ngen:'nagNgen'}};
const rsong=n=>{const r=M&&M.region;return (SONGSET[r]&&SONGSET[r][n])||n};
function mapSong(){const m=MAPS[CUR];
  if(m.region==='santiago'&&!(S&&S.flags&&S.flags.yewen_won)&&(m.song==='waria'||m.song==='cave'))return 'wariaG';   // Santiago stays tense until every silence and Yewen have fallen
  if(m.ngenmap)return rsong(awake(m.region)?'ngen':'cave');const s=m.song;if(!awake(m.region)&&(s==='coast'||s==='lof'||s==='nag'||s==='pew'||s==='wil'||s==='puel'))return rsong(s+'G');return rsong(s)}
function loadMap(id,x,y,quiet){TALKER=null;
  CUR=id;M=MAPS[id];if(id==='s_metro'&&S&&S.flags)S.flags.metro_seen=1;
  if(S&&S.flags&&M&&M.region&&!S.flags['gc_'+M.region]){S.flags['gc_'+M.region]=1;gcEvent('region-'+M.region,'Región: '+M.region)}
  grid=M.rows.map(r=>r.split(''));
  for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++){const c=grid[yy][xx];
    if((c==='P'||c==='C'||c==='K'||c==='k'||c==='L'||c==='x')&&S.flags['t:'+id+':'+xx+','+yy])grid[yy][xx]=M.floor;}
  if(S.flags['gate:'+id])for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++){if(grid[yy][xx]==='G')grid[yy][xx]=M.floor;if(grid[yy][xx]==='O')grid[yy][xx]='q'}
  if(M.tablets)for(const k in M.tablets){const [tx,ty]=k.split(',').map(Number);grid[ty][tx]='Ł'}
  PZ={n:0,lit:new Set()};
  if(['sb1','sb2','sb3','sb4','sb5'].every(f=>S.flags[f]))S.flags.sbAll=1;
  if(['st1','st2','st3','st4','st5'].every(f=>S.flags[f]))S.flags.st_all=1;
  if(typeof swCheck==='function')swCheck();
  if(id==='g_ngoyman'&&S.flags.gm_all&&!S.flags.lawW){S.flags.lawW=1;S.lawuses=S.lawuses||0}
  if(id==='w_wapi'&&S.flags['pz:w_wapi']&&!S.flags.wapiNpz&&!S.flags['pz:w_wapi:st']){S.flags['pz:w_wapi:st']=1;delete S.flags['pz:w_wapi']}
  {const doorOpen=(M.pz&&M.pz.done)?S.flags['pz:'+id+':st']:S.flags['pz:'+id];
   if(doorOpen)for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++)if(grid[yy][xx]==='E')grid[yy][xx]=M.floor;
   if(S.flags['pz:'+id]&&M.pz){for(const k in M.pz.tiles)PZ.lit.add(k);if(M.pz.reveal)grid[M.pz.reveal.y][M.pz.reveal.x]=M.pz.reveal.ch}}
  if(!awake(M.region))for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++)if(grid[yy][xx]==='A')grid[yy][xx]=M.floor;
  if(LOFIDS.includes(id)&&awake(M.region)&&lofsOpen().length>=2)grid[10][20]='A';   // lof fast-travel ring, from the second ngen on
  if(S.flags.wind)for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++)if(grid[yy][xx]==='X')grid[yy][xx]=M.floor;
  if(S.flags.snow)for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++)if(grid[yy][xx]==='^')grid[yy][xx]=M.floor;
  if(S.flags.bramble)for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++)if(grid[yy][xx]==='Ñ')grid[yy][xx]=M.floor;
  if(S.flags.lelfun)for(let yy=0;yy<M.h;yy++)for(let xx=0;xx<M.w;xx++)if(grid[yy][xx]==='D')grid[yy][xx]=M.floor;
  if(id==='l_ruka2'&&typeof stgoOpen==='function'&&stgoOpen())grid[3][7]='@';
  buildLayers();
  ents=[];P.x=x;P.y=y;
  const [px0,py0]=placeNear(x,y);P.x=px0;P.y=py0;P.fx=P.x;P.fy=P.y;P.moving=false;
  for(const e0 of M.ents||[]){
    if(e0.flag&&S.flags[e0.flag])continue;
    if(e0.req&&!S.flags[e0.req])continue;
    const e=Object.assign({},e0);
    const [ex,ey]=e.fixed||e.path?[e.x,e.y]:placeNear(e.x,e.y,true);e.x=ex;e.y=ey;e.fx=ex;e.fy=ey;e.cd=30+rnd(60);e.dir=e.dir||'down';e.pi=0;e.wait=e.pause||0;e.bt=rnd(400);e.ox=e.x;e.oy=e.y;
    if(e.kind==='npc'){const sd=id+':'+(e.id||e0.x+','+e0.y)+':'+(e.look||'');let h=9;for(let i=0;i<sd.length;i++)h=(h*31+sd.charCodeAt(i))>>>0;
      e.tn=h%5;e.ey2=[0,0,1,1,2,3,4,5][(h>>>3)%8];e.hr2=[0,0,0,1,1,2,3,4][(h>>>6)%8]}
    ents.push(e)}
  if(id==='n_kullin'){let i=0;for(const e0 of M.ents)if(e0.herd&&e0.flag&&S.flags[e0.flag]){const sp=PENSPOT[i++];ents.push({kind:'animal',look:e0.look,x:sp[0],y:sp[1],fx:sp[0],fy:sp[1],ox:sp[0],oy:sp[1],pen:[10,2,15,3],cd:30+rnd(60),wait:0,dir:i%2?'left':'right',home:1})}}
  if(typeof PAL!=='undefined')PAL=null;
  SCN=(M.scenes||[]).map(s=>Object.assign({},s,{pl:[0,1,2,3].map(i=>({x:s.x*T+s.w*T*(i<2?.3:.7),y:s.y*T+s.h*T*(.3+.4*(i%2)),dir:'right'}))}));
  S.map=id;fade=16;grace=40;
  if(!quiet)showBanner(typeof placeName==='function'?placeName(id):M.name,G(typeof placeGloss==='function'?placeGloss(id):M.g));
  setTimeout(()=>{if(!active&&mode==='map'&&typeof lofWarpIntro==='function')lofWarpIntro()},600);
  playSong(mapSong());
  if(typeof wxSpawn==='function')wxSpawn();
  if(typeof playAmb==='function')playAmb(typeof wxAmbKey==='function'?wxAmbKey():ambFor(M.bg));
  persist();
}
