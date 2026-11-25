/* ============================================================
   URBAN TILES + PROPS (Santiago, the waria)
   Tiles (map chars, outdoor urban maps only, M.urban):
     ','  sidewalk slabs      '='  asphalt street     'Y' park lawn (fenced)
     '.'  packed-earth cancha '~'  fountain water
     'h'  building block (contiguous rectangles → one facade)
     'l'  lamppost  'z' bench  'w' iron railing  'c' parked vehicle (2 or 3 wide)
     'e'  feria stall  'o' bus stop shelter (2 wide)  'k' kiosk is NOT used (key tile)
   ============================================================ */
const UPAL={wall:['#d9b48c','#c99ba2','#93b2c9','#e4d7b6','#9fc3a3','#b9b5b1','#c57d63','#d7c47e','#a8a0c8'],
  roofz:['#7d8690','#98a1aa','#5c646c'],glass:'#a9c9e2',glassHi:'#e8f4ff',glassDk:'#5f7f98',frame:'#2d2a2a',doorc:'#4a3224',doorHi:'#7a5a40',
  aw:[['#c84848','#f0f0ea'],['#3870b8','#f0f0ea'],['#38a058','#f0f0ea'],['#e0a030','#f0f0ea']]};
const UCACHE={};
function shade(hex,k){const [r,g,b]=hexRGB(hex);const f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return'rgb('+f(r)+','+f(g)+','+f(b)+')'}
function buildingCanvas(bw,bh,seed,opt){
  opt=opt||{};const key='bld'+bw+'x'+bh+':'+seed+':'+(opt.door||'')+(opt.shop?'s':'')+(opt.mural?'m':'')+(opt.metro?'M':'');if(UCACHE[key])return UCACHE[key];
  const W0=bw*16,H0=bh*16,top=12,[cvs,c]=mk(W0+2,H0+top+2),ox=1,oy=top+1;
  const r=k=>h2(seed,k,91),tall=bh>=3,wall=UPAL.wall[Math.floor(r(1)*UPAL.wall.length)],dark=shade(wall,.72),lite=shade(wall,1.12);
  const house=!tall;
  // facade body
  R(c,ox,oy,W0,H0,wall);
  R(c,ox+W0-2,oy,2,H0,dark);R(c,ox,oy+H0-2,W0,2,dark);R(c,ox,oy,1,H0,lite);
  // roof
  if(house){const rz=UPAL.roofz[Math.floor(r(2)*3)];R(c,ox-1,oy-top+2,W0+2,top-2,rz);
    for(let x=ox-1;x<ox+W0+1;x+=3)R(c,x,oy-top+2,1,top-2,shade(rz,.82));
    R(c,ox-1,oy-top+2,W0+2,2,shade(rz,1.25));R(c,ox-1,oy-1,W0+2,1,shade(rz,.6));
    if(r(3)<.5){R(c,ox+W0-10,oy-top-1,4,5,'#6a6a70');R(c,ox+W0-10,oy-top-1,4,1,'#9a9aa0')}
    if(r(4)<.6){const ax=ox+4+Math.floor(r(5)*(W0-8));R(c,ax,oy-top-2,1,6,'#3a3a40');R(c,ax-2,oy-top-2,5,1,'#3a3a40');R(c,ax-1,oy-top,3,1,'#3a3a40')}}
  else{R(c,ox-1,oy-top+6,W0+2,6,shade(wall,.9));R(c,ox-1,oy-top+6,W0+2,1,'#f0ece4');R(c,ox-1,oy-top+11,W0+2,1,dark);
    // rooftop water tank + antenna
    if(r(3)<.7){const tx=ox+W0-14;R(c,tx,oy-top,8,6,'#3c4650');R(c,tx+1,oy-top-1,6,1,'#5a6670');R(c,tx+1,oy-top+2,1,3,'#2a3038')}
    if(r(4)<.7){const ax=ox+5;R(c,ax,oy-top-2,1,8,'#2a2a30');R(c,ax-2,oy-top-1,5,1,'#2a2a30');R(c,ax-3,oy-top+1,7,1,'#2a2a30')}}
  // windows
  const rows=house?1:bh,cols=Math.max(1,Math.floor((W0-6)/12));
  for(let ry=0;ry<rows;ry++){const wy=oy+(house?4:4+ry*16);
    for(let cx=0;cx<cols;cx++){const wx=ox+4+cx*12+(house?2:0);if(wx+7>ox+W0-3)continue;
      const isDoorCol=house&&opt.door!==undefined&&Math.abs(wx+3-(ox+opt.door*16+8))<9;if(isDoorCol)continue;
      const lit=r(10+ry*7+cx)<.14;
      R(c,wx-1,wy-1,8,9,UPAL.frame);R(c,wx,wy,6,7,lit?'#f6d878':UPAL.glass);R(c,wx,wy,6,1,lit?'#fff0b0':UPAL.glassHi);R(c,wx+3,wy+3,3,4,lit?'#e0b850':UPAL.glassDk);
      R(c,wx-1,wy+8,8,1,shade(wall,.8));
      if(house||ry===bh-1){for(let k=0;k<3;k++)R(c,wx+k*2,wy,1,7,'#3a3836')}  // rejas on the ground floor
      if(tall&&ry<bh-1&&(cx+ry+seed)%2===0){R(c,wx-2,wy+9,10,1,'#3a3836');for(let k=0;k<5;k++)R(c,wx-2+k*2,wy+9,1,3,'#3a3836');R(c,wx-2,wy+12,10,1,shade(wall,.6))}}}
  // door (+ awning for shops)
  if(opt.door!==undefined&&opt.metro){const dx=ox+opt.door*16+1,dy=oy+H0-14;   // a metro entrance: a stairway going down, rails, a lit sign
    R(c,dx-2,dy-1,18,15,'#2a2a30');R(c,dx,dy,14,14,'#08080c');
    for(let k=0;k<5;k++){const sy=dy+3+k*2;R(c,dx+1,sy,12,1,shade('#8a8a90',1-k*.15));R(c,dx+1,sy+1,12,1,'#1a1a20')}
    R(c,dx-2,dy-1,1,15,'#c8c8d0');R(c,dx+15,dy-1,1,15,'#c8c8d0');for(let k=0;k<4;k++){R(c,dx-2,dy+k*4,2,1,'#e8e8f0');R(c,dx+14,dy+k*4,2,1,'#e8e8f0')}
    const px=dx+3,py=dy-12;R(c,px-1,py-1,10,10,'#1a1a20');R(c,px,py,8,8,'#c8323a');R(c,px,py,8,1,'#e85a5a');
    R(c,px+1,py+2,1,4,'#ffffff');R(c,px+6,py+2,1,4,'#ffffff');R(c,px+2,py+3,1,1,'#ffffff');R(c,px+5,py+3,1,1,'#ffffff');R(c,px+3,py+4,2,1,'#ffffff');
    R(c,px+3,py+8,2,3,'#4a4a52')}
  else if(opt.door!==undefined){const dx=ox+opt.door*16+5,dy=oy+H0-13;
    R(c,dx-1,dy-1,8,14,UPAL.frame);R(c,dx,dy,6,13,UPAL.doorc);R(c,dx,dy,2,13,UPAL.doorHi);R(c,dx+4,dy+6,1,1,'#e8d070');
    if(opt.shop){const aw=UPAL.aw[Math.floor(r(6)*UPAL.aw.length)],ax=dx-9,aww=24;
      for(let x=0;x<aww;x++)R(c,ax+x,dy-6,1,4,((x>>2)&1)?aw[0]:aw[1]);
      R(c,ax,dy-2,aww,1,'#5a4a3a');for(let x=0;x<aww;x+=4)R(c,ax+x,dy-1,2,1,shade(aw[0],.7));
      R(c,ax+2,dy-10,aww-4,3,'#f4f0e4');R(c,ax+3,dy-9,2,1,aw[0]);R(c,ax+7,dy-9,5,1,'#4a4a52');R(c,ax+14,dy-9,4,1,'#4a4a52')}}
  // graffiti / mural patch
  if(opt.mural){const mx=ox+3,my=oy+H0-14;R(c,mx,my,Math.min(W0-6,38),10,'#f3e9c8');
    const cols2=['#3870b8','#38a058','#e0a030','#c84848'];for(let k=0;k<4;k++){R(c,mx+2+k*8,my+2,5,6,cols2[k]);R(c,mx+3+k*8,my+3,3,2,shade(cols2[k],1.3))}}
  else if(r(7)<.35){const gx=ox+2+Math.floor(r(8)*(W0-14)),gy=oy+H0-7;const gc=['#e03c8c','#38c8e8','#f0e040'][Math.floor(r(9)*3)];
    R(c,gx,gy,3,2,gc);R(c,gx+3,gy-1,3,2,gc);R(c,gx+6,gy+1,4,2,gc);R(c,gx+2,gy+2,5,1,shade(gc,.6))}
  // drainpipe
  if(r(12)<.6){R(c,ox+W0-4,oy-top+8,1,H0+top-8,'#4a4a50');R(c,ox+W0-5,oy-top+8,1,2,'#4a4a50')}
  facadeShade(cvs,ox,oy,W0,H0,top,house);
  outline(cvs,'#1a1a20');
  return UCACHE[key]=cvs;
}
/* Facade lighting, matching the rest of the game: light from the upper left, plaster grain,
   a lit cornice, soft vertical falloff, ambient occlusion at the foot and under the eaves,
   and dithered transitions instead of flat fills. */
function facadeShade(cvs,ox,oy,W0,H0,top,house){
  const c=cvs.getContext('2d'),w=cvs.width,h=cvs.height,img=c.getImageData(0,0,w,h),d=img.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const q=(y*w+x)*4;if(d[q+3]<40)continue;
    const r=d[q],g=d[q+1],b=d[q+2];if(r+g+b<60)continue;
    const fx=(x-ox)/W0,fy=(y-oy)/H0,onWall=y>=oy&&x>=ox&&x<ox+W0;
    let f=0;
    if(onWall){
      f+=(0.5-fx)*0.10;                         // lit from the left
      f-=Math.max(0,fy-0.55)*0.28;               // falloff toward the street
      if(y-oy<3)f-=0.16*(1-(y-oy)/3);            // shadow under the eaves / cornice
      if(oy+H0-y<4)f-=0.18*(1-(oy+H0-y)/4);      // AO at the foot of the wall
      const n=h2(x,y,77);if(n<.08)f-=0.06;else if(n>.93)f+=0.05;   // plaster grain
      if(h2(x>>2,y>>2,78)<.06)f-=0.05;           // weathering blotches
      if((y-oy)%16===15&&!house)f-=0.10;         // floor seams on blocks
    }else if(y<oy){                              // roof
      f+=(0.5-fx)*0.12+(y<oy-top+5?0.08:-0.04);
      if(h2(x,y,79)<.1)f-=0.06;
    }
    const v=f+(((x+y)&1)?0.018:-0.018);
    const k=v>0?v:v;
    if(k>0){d[q]=Math.min(255,r+(255-r)*k);d[q+1]=Math.min(255,g+(255-g)*k);d[q+2]=Math.min(255,b+(255-b)*k)}
    else{const m=1+k;d[q]=r*m;d[q+1]=g*m*0.98;d[q+2]=Math.min(255,b*m*1.06)}
  }
  c.putImageData(img,0,0);
  // a lit cornice line along the top of the wall
  c.fillStyle='rgba(255,250,235,.35)';c.fillRect(ox,oy,W0-2,1);
}
// a Santiago metro entrance on the sidewalk: a stairwell going down, steel rails on three sides, and a lit totem beside it
function metroHoleCanvas(w){const k='mhole'+w;if(UCACHE[k])return UCACHE[k];const W=w*16,[cvs,c]=mk(W,18);
  R(c,0,2,W,16,'#5a5e66');R(c,2,4,W-4,14,'#14161c');
  for(let i=0;i<5;i++){const y=5+i*3;R(c,3,y,W-6,2,['#8a8e96','#6e727a','#565a62','#40444c','#2c3038'][i]);R(c,3,y,W-6,1,['#b4b8c0','#9a9ea6','#7e828a','#62666e','#484c54'][i])}
  R(c,0,0,W,2,'#9aa0aa');R(c,0,0,W,1,'#d8dce2');R(c,0,0,2,18,'#9aa0aa');R(c,W-2,0,2,18,'#9aa0aa');R(c,0,0,1,18,'#d8dce2');
  for(let x=4;x<W-3;x+=5)R(c,x,0,1,2,'#e8ecf0');
  R(c,1,1,W-2,1,'#c8102e');
  outline(cvs,'#101014');return UCACHE[k]=repaintSmall(cvs,{amp:.6})}
function metroTotemCanvas(){const k='mtotem';if(UCACHE[k])return UCACHE[k];const [cvs,c]=mk(14,44);
  R(c,5,16,4,26,'#3a3c44');R(c,5,16,1,26,'#6a6c76');R(c,3,40,8,4,'#2a2c34');R(c,4,40,6,1,'#5a5c66');
  R(c,0,0,14,16,'#f0f2f4');R(c,1,1,12,14,'#c8102e');R(c,1,1,12,1,'#e8344e');
  // white M
  R(c,3,4,2,9,'#ffffff');R(c,9,4,2,9,'#ffffff');R(c,5,5,1,2,'#ffffff');R(c,6,6,2,3,'#ffffff');R(c,8,5,1,2,'#ffffff');
  outline(cvs,'#101014');return UCACHE[k]=repaintSmall(cvs,{amp:.5})}
function lampCanvas(){const k='lamp';if(UCACHE[k])return UCACHE[k];const [cvs,c]=mk(10,34);
  R(c,4,6,2,26,'#3a3c44');R(c,4,6,1,26,'#5a5c66');R(c,2,30,6,3,'#2a2c34');R(c,3,30,4,1,'#4a4c56');
  R(c,2,1,6,5,'#4a4c56');R(c,3,2,4,3,'#ffe9a0');R(c,3,2,2,1,'#fff8d8');R(c,1,0,8,1,'#2a2c34');outline(cvs,'#101014');return UCACHE[k]=repaintSmall(cvs,{amp:.8})}
function benchCanvas(){const k='bench';if(UCACHE[k])return UCACHE[k];const [cvs,c]=mk(16,10);
  R(c,1,0,14,2,'#9a6a3a');R(c,1,3,14,3,'#b07a44');R(c,1,3,14,1,'#c89058');R(c,2,6,2,4,'#3a3a40');R(c,12,6,2,4,'#3a3a40');R(c,1,2,14,1,'#5a3a1e');outline(cvs,'#1a1410');return UCACHE[k]=repaintSmall(cvs,{amp:.8})}
function railCanvas(){const k='rail';if(UCACHE[k])return UCACHE[k];const [cvs,c]=mk(16,12);
  R(c,0,3,16,1,'#2c2c34');R(c,0,9,16,1,'#2c2c34');for(let x=1;x<16;x+=3){R(c,x,2,1,9,'#3c3c46');R(c,x,1,1,1,'#d8b040')}outline(cvs,'#101014');return UCACHE[k]=repaintSmall(cvs,{amp:.8})}
function vehicleCanvas(n,seed){const k='veh'+n+':'+seed;if(UCACHE[k])return UCACHE[k];
  const W0=n*16,[cvs,c]=mk(W0,22),bus=n>=3,flip=h2(seed,1,77)<.5;
  if(bus){R(c,1,2,W0-2,16,'#f0c030');R(c,1,2,W0-2,2,'#f8dc70');R(c,1,16,W0-2,2,'#c08820');R(c,3,5,W0-6,6,'#6a8aa0');for(let x=4;x<W0-4;x+=8)R(c,x+6,5,1,6,'#f0c030');R(c,3,5,W0-6,1,'#c0d8e8');
    R(c,flip?2:W0-9,12,7,4,'#3a3a44');R(c,flip?W0-5:1,7,4,3,'#ffffff');}
  else{const col=['#c83838','#3858b8','#e8e8e8','#38a070','#808088'][Math.floor(h2(seed,2,77)*5)];
    R(c,2,6,W0-4,10,col);R(c,6,2,W0-12,5,col);R(c,6,2,W0-12,1,shade(col,1.3));R(c,8,3,W0-16,4,'#7a9ab0');R(c,8,3,W0-16,1,'#d0e4f0');R(c,2,14,W0-4,2,shade(col,.7));
    R(c,flip?2:W0-5,9,3,2,'#f8f0c0');R(c,flip?W0-5:2,9,3,2,'#e04040')}
  R(c,4,17,6,4,'#1a1a1e');R(c,W0-10,17,6,4,'#1a1a1e');R(c,6,18,2,2,'#6a6a70');R(c,W0-8,18,2,2,'#6a6a70');
  outline(cvs,'#101014');return UCACHE[k]=repaintSmall(cvs,{amp:.8})}
function stallCanvas(seed){const k='stall'+seed;if(UCACHE[k])return UCACHE[k];const [cvs,c]=mk(20,26),aw=UPAL.aw[seed%UPAL.aw.length];
  R(c,2,14,16,8,'#8a6a3a');R(c,2,14,16,1,'#b08a50');R(c,3,22,2,4,'#5a3a1e');R(c,15,22,2,4,'#5a3a1e');
  for(let x=0;x<20;x++)R(c,x,4,1,5,((x>>1)&1)?aw[0]:aw[1]);R(c,0,9,20,1,shade(aw[0],.6));R(c,1,2,18,2,aw[0]);R(c,1,9,1,13,'#5a3a1e');R(c,18,9,1,13,'#5a3a1e');
  const fr=[['#e03838','#38a040'],['#f0a020','#8a4a20'],['#48c048','#f0e040']][seed%3];
  R(c,4,11,4,3,fr[0]);R(c,9,11,4,3,fr[1]);R(c,14,11,3,3,fr[0]);R(c,5,11,1,1,shade(fr[0],1.4));R(c,10,11,1,1,shade(fr[1],1.4));
  outline(cvs,'#1a1410');return UCACHE[k]=repaintSmall(cvs,{amp:.8})}
function shelterCanvas(){const k='shelter';if(UCACHE[k])return UCACHE[k];const [cvs,c]=mk(32,26);
  R(c,0,2,32,4,'#3a5a7a');R(c,0,2,32,1,'#6a8aa8');R(c,2,6,1,18,'#3a3c44');R(c,29,6,1,18,'#3a3c44');R(c,3,6,26,10,'#a8c4d8');R(c,3,6,26,1,'#e0f0ff');
  R(c,4,8,10,3,'#f0f0ea');R(c,5,9,8,1,'#4a4a52');R(c,16,8,12,6,'#e8a030');R(c,17,9,10,1,'#3a3a44');R(c,17,11,6,1,'#3a3a44');
  R(c,4,17,24,2,'#8a6a3a');R(c,4,19,24,1,'#5a3a1e');R(c,5,20,2,4,'#3a3a40');R(c,25,20,2,4,'#3a3a40');outline(cvs,'#101418');return UCACHE[k]=repaintSmall(cvs,{amp:.8})}
/* night glow for lampposts, drawn after the day tint */
function urbanNight(c,cx,cy){
  if(!M||!M.urban||typeof dayPhase!=='function')return;const d=dayPhase();if(!d.dark)return;
  for(const p of PROPS)if(p.lamp){const sx=p.dx-cx+5,sy=p.dy-cy+VY+4;if(sx<-40||sx>LW+40||sy<-40||sy>LH+40)continue;
    const g=c.createRadialGradient(sx,sy,2,sx,sy,26);g.addColorStop(0,'rgba(255,225,140,'+(.55*d.dark).toFixed(2)+')');g.addColorStop(1,'rgba(255,225,140,0)');
    c.fillStyle=g;c.fillRect(sx-26,sy-26,52,52);R(c,sx-2,sy-2,4,3,'#fff4c0')}
}
