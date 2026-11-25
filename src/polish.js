/* ============================================================
   GRAPHICS POLISH: overworld props get the same 3D repaint as characters and creatures
   ============================================================ */
(function(){
  const P2={};
  const wrap=(name,opt,keyf)=>{const f=window[name];if(typeof f!=='function')return;
    window[name]=function(){const k=name+':'+(keyf?keyf.apply(null,arguments):[...arguments].join(','));if(P2[k])return P2[k];const r=f.apply(this,arguments);
      if(r&&r.cvs){return P2[k]=Object.assign({},r,{cvs:repaintSmall(r.cvs,opt)})}
      return P2[k]=r&&r.getContext?repaintSmall(r,opt):r}};
  wrap('rockCanvas',{amp:1,capG:5,capP:4});
  wrap('kulonCanvas',{amp:.8,capG:6});
  wrap('pickCanvas',{amp:.8});
  wrap('rukaCanvas',{amp:.75,capG:10,capP:6,lift:.2});
  wrap('boardCanvas',{amp:.8});
  wrap('potCanvas',{amp:.8});
  wrap('reweCanvas',{amp:.85});
  wrap('sbtCanvas',{amp:.6});
  const DYNP=new Set(['C','K','B','L','H','N','J','I','G','O','Q','q','S','E','D','P','k','g','p','m']);
  const fdyn=window.dynCanvas;if(typeof fdyn==='function'){const DC={};
    window.dynCanvas=function(ch,f){if(!DYNP.has(ch))return fdyn(ch,f);const k=ch+'|'+f;if(DC[k])return DC[k];return DC[k]=repaintSmall(fdyn(ch,f),{amp:.85,capG:5,capP:4})}}
})();

/* the Yewen can call the Fütra Ngoymatulfe as a minion: borrow its first form's sprite */
if(typeof SPR2!=='undefined'&&SPR2.ngoyman1){SPR2.ngoysum=SPR2.ngoyman1;if(SPR2['ngoyman1@b'])SPR2['ngoysum@b']=SPR2['ngoyman1@b']}
{const _ec=enemyCanvas,NSC={};enemyCanvas=function(t,size,fr){if(t!=='ngoysum')return _ec(t,size,fr);
  const k='n'+fr;if(NSC[k])return NSC[k];const src=_ec('ngoyman1',104,fr),w=Math.round(src.width*.7),h=Math.round(src.height*.7);
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(src,0,0,w,h);
  const id=g.getImageData(0,0,w,h),d=id.data;for(let i=3;i<d.length;i+=4)d[i]=d[i]>110?255:0;g.putImageData(id,0,0);return NSC[k]=c}}
