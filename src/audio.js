/* ============================================================
   AUDIO: chiptune sequencer + sound effects (all original)
   ============================================================ */
const AU={c:null,m:null,mus:null,sfx:null,noise:null,muted:false,song:null,name:null,timer:null,next:0,step:0};
try{AU.muted=localStorage.getItem(MUTE_KEY)==='1'}catch(e){}
function auInit(){
  try{
    if(!AU.c){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{AU.c=new AC({latencyHint:'balanced'})}catch(e){AU.c=new AC()}   /* bigger audio buffer: the dense kultrun boss songs stop stuttering on phones */
      
      AU.m=AU.c.createGain();AU.m.connect(AU.c.destination);
      AU.mus=AU.c.createGain();AU.mus.gain.value=.2;AU.mus.connect(AU.m);
      AU.dist=AU.c.createWaveShaper();{const n=1024,cv=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;cv[i]=Math.tanh(x*6)*.8}AU.dist.curve=cv}
      AU.distG=AU.c.createGain();AU.distG.gain.value=.55;AU.dist.connect(AU.distG);AU.distG.connect(AU.mus);
      mkDist2(AU.c);
      AU.sfx=AU.c.createGain();AU.sfx.gain.value=.3;AU.sfx.connect(AU.m);
      const b=AU.c.createBuffer(1,AU.c.sampleRate,AU.c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=b;
      if(AU.song){AU.next=AU.c.currentTime+.08}
      AU.timer=setInterval(tick,25)}
    if(AU.c.state==='suspended')AU.c.resume();
    AU.m.gain.value=AU.muted?0:1;
  }catch(e){}
}
/* heavy amp: input drive into a hard, slightly asymmetric clipper, then a speaker-cabinet style EQ
   (low cut, a mid push, a steep high cut) so the fuzz growls instead of fizzing */
function mkDist2(c){
  const pre=c.createGain();pre.gain.value=3.2;
  const ws=c.createWaveShaper();{const n=2048,cv=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;cv[i]=Math.tanh(x*22+.18)*.85-Math.tanh(.18)*.85}ws.curve=cv;ws.oversample='2x'}
  const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=95;
  const mid=c.createBiquadFilter();mid.type='peaking';mid.frequency.value=900;mid.Q.value=.9;mid.gain.value=5;
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4200;lp.Q.value=.8;
  const lp2=c.createBiquadFilter();lp2.type='lowpass';lp2.frequency.value=6500;
  const out=c.createGain();out.gain.value=.2;
  pre.connect(ws);ws.connect(hp);hp.connect(mid);mid.connect(lp);lp.connect(lp2);lp2.connect(out);out.connect(AU.mus);
  AU.dist2=pre;
  // the battle songs' amps, driven a little less: the same cabinet EQ, a gentler clip
  const pS=c.createGain();pS.gain.value=2.3;
  const wS=c.createWaveShaper();{const n=2048,cv=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;cv[i]=Math.tanh(x*15+.14)*.85-Math.tanh(.14)*.85}wS.curve=cv;wS.oversample='2x'}
  pS.connect(wS);wS.connect(hp);AU.dist2s=pS;
  const d1=c.createWaveShaper();{const n=1024,cv=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;cv[i]=Math.tanh(x*4.2)*.8}d1.curve=cv}
  const d1g=c.createGain();d1g.gain.value=.6;d1.connect(d1g);d1g.connect(AU.mus);AU.dists=d1}
function toggleMute(){AU.muted=!AU.muted;try{localStorage.setItem(MUTE_KEY,AU.muted?'1':'0')}catch(e){}auInit();if(AU.m)AU.m.gain.value=AU.muted?0:1;if(typeof musLabel==='function')musLabel()}
const NOTE={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
function nf(s){const m=/^([A-G][#b]?)(\d)$/.exec(s);if(!m)return 0;return 440*Math.pow(2,(NOTE[m[1]]+(+m[2]+1)*12-69)/12)}
function parseTrack(str){const toks=str.replace(/\|/g,' ').trim().split(/\s+/);const at={};let cur=null;
  toks.forEach((t,i)=>{if(t==='-'){if(cur)cur.len++}else if(t==='.'){cur=null}else{cur={n:t,len:1};(at[i]=at[i]||[]).push(cur)}});return{len:toks.length,at}}
function mkSong(o){o.ch=o.ch.map(c=>Object.assign(c,parseTrack(c.t)));o.len=Math.max(...o.ch.map(c=>c.len));return o}
const DR1='k . h . s . h . | k . h k s . h h';
const SONGS={
 epew:mkSong({bpm:58,loop:1,ch:[
  {w:'triangle',v:.55,t:'A2 - - - - - - - | A2 - - - - - - - | F2 - - - - - - - | E2 - - - - - - - | A2 - - - - - - - | G2 - - - - - - - | F2 - - - - - - - | E2 - - - E2 - - - | A2 - - - - - - - | A2 - - - - - - - | F2 - - - - - - - | G2 - - - - - - - | A2 - - - - - - - | F2 - - - - - - - | E2 - - - - - - - | A2 - - - - - - -'},
  {w:'triangle',v:.5,t:'A3 - - - - - - - | C4 - - - B3 - A3 - | F3 - - - A3 - - - | E3 - - - - - - - | A3 - - - C4 - D4 - | E4 - - - D4 - B3 - | C4 - - - A3 - - - | B3 - - - - - - - | A3 - - - E4 - - - | F4 - - - E4 - C4 - | D4 - - - C4 - A3 - | B3 - - - - - - - | A4 - - - G4 - E4 - | F4 - - - D4 - C4 - | B3 - - - E4 - - - | A3 - - - - - - -'},
  {w:'square',v:.045,t:'. - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | A4 - E4 - A4 - E4 - | G4 - D4 - G4 - D4 - | F4 - C4 - F4 - C4 - | E4 - B3 - E4 - B3 - | A4 - E4 - A4 - E4 - | F4 - C4 - F4 - C4 - | D4 - A3 - D4 - A3 - | E4 - B3 - E4 - B3 - | A4 - E5 - A4 - E5 - | F4 - C5 - F4 - C5 - | E4 - B4 - E4 - B4 - | A4 - E4 - A4 - - -'},
  {w:'sine',v:.3,t:'. - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | E5 - - - - - - - | C5 - - - - - - - | A4 - - - - - - - | B4 - - - - - - - | C5 - - - - - - - | D5 - - - - - - - | E5 - - - - - - - | E5 - - - - - - -'},
  {d:1,v:.5,t:'k . . . . . . . | k . . . k . . . | k . . . . . . . | k . . k . . k . | k . . . k . . . | k . . . k . . . | k . . . k . k . | k . k . k . k . | k . . . k . . . | k . . . k . . . | k . . . k . k . | k . k . k . k . | k . . h k . . h | k . . h k . . h | k . k . k . k k | k . . . . . . .'}]}),
 intro:mkSong({bpm:66,loop:1,ch:[
  {w:'triangle',v:.5,t:'E5 - - - D5 - C5 - | A4 - - - - - - - | G4 - - - A4 - C5 - | D5 - - - E5 - - - | E5 - - - G5 - E5 - | D5 - C5 - A4 - - - | C5 - D5 - E5 - G5 - | A5 - - - - - - -'},
  {w:'square',v:.06,t:'A3 - E4 - A4 - E4 - | F3 - C4 - F4 - C4 - | G3 - D4 - G4 - D4 - | E3 - B3 - E4 - B3 - | A3 - E4 - A4 - E4 - | F3 - C4 - F4 - C4 - | G3 - D4 - G4 - D4 - | A3 - E4 - A4 - - -'},
  {w:'triangle',v:.45,t:'A2 - - - - - - - | F2 - - - - - - - | G2 - - - - - - - | E2 - - - - - - - | A2 - - - - - - - | F2 - - - - - - - | G2 - - - - - - - | A2 - - - - - - -'}]}),
 coast:mkSong({bpm:104,loop:1,ch:[
  {w:'square',v:.13,t:'D5 - F#5 A5 B5 - A5 - | F#5 - E5 D5 E5 - - - | D5 - F#5 A5 D6 - B5 A5 | B5 - - - A5 - - - | G5 - F#5 E5 F#5 - A5 - | B5 - A5 F#5 E5 - - - | D5 E5 F#5 A5 B5 - A5 F#5 | E5 - - - D5 - - -'},
  {w:'triangle',v:.5,t:'D3 . A3 . D3 . A3 . | B2 . F#3 . B2 . F#3 . | G2 . D3 . G2 . D3 . | A2 . E3 . A2 . E3 . | G2 . D3 . G2 . D3 . | B2 . F#3 . B2 . F#3 . | G2 . D3 . A2 . E3 . | D3 . A2 . D3 - - .'},
  {w:'square',v:.04,t:'F#4 A4 D5 A4 F#4 A4 D5 A4 | D4 F#4 B4 F#4 D4 F#4 B4 F#4 | D4 G4 B4 G4 D4 G4 B4 G4 | E4 A4 C#5 A4 E4 A4 C#5 A4'},
  {d:1,v:.5,t:DR1}]}),
 nag:mkSong({bpm:112,loop:1,ch:[
  {w:'square',v:.12,t:'A4 - C5 E5 - D5 | C5 - A4 G4 - - | A4 - C5 E5 - G5 | A5 - - G5 - - | F5 - E5 D5 - C5 | D5 - E5 C5 - A4 | G4 - A4 C5 - D5 | E5 - - - - -'},
  {w:'triangle',v:.5,t:'A2 . E3 A2 . E3 | F2 . C3 F2 . C3 | A2 . E3 A2 . E3 | G2 . D3 G2 . D3 | F2 . C3 F2 . C3 | D2 . A2 D2 . A2 | G2 . D3 G2 . D3 | A2 . E3 A2 - -'},
  {w:'square',v:.04,t:'E4 A4 C5 E4 A4 C5 | F4 A4 C5 F4 A4 C5 | E4 A4 C5 E4 A4 C5 | D4 G4 B4 D4 G4 B4'},
  {d:1,v:.4,t:'k . h k h . | k . h s h h'}]}),
 nagG:mkSong({bpm:70,loop:1,ch:[
  {w:'triangle',v:.5,t:'A4 - - C5 - B4 | A4 - - E4 - - | F4 - - E4 - D4 | E4 - - - - - | A4 - - C5 - D5 | E5 - - D5 - C5 | B4 - - G#4 - - | A4 - - - - -'},
  {w:'square',v:.04,t:'A3 C4 E4 A3 C4 E4 | F3 A3 C4 F3 A3 C4 | D3 F3 A3 D3 F3 A3 | E3 G#3 B3 E3 G#3 B3'},
  {w:'triangle',v:.4,t:'A2 - - - - - | F2 - - - - - | D2 - - - - - | E2 - - - - -'},
  {d:1,v:.2,t:'k . . . . . | . . . h . .'}]}),
 lof:mkSong({bpm:84,loop:1,ch:[
  {w:'triangle',v:.55,t:'G4 - B4 D5 E5 - D5 - | B4 - A4 G4 A4 - - - | G4 - B4 D5 G5 - E5 D5 | E5 - - - D5 - - - | C5 - B4 A4 B4 - D5 - | E5 - D5 B4 A4 - - - | G4 A4 B4 D5 E5 - D5 B4 | A4 - - - G4 - - -'},
  {w:'square',v:.05,t:'B3 D4 G4 D4 B3 D4 G4 D4 | B3 E4 G4 E4 B3 E4 G4 E4 | C4 E4 G4 E4 C4 E4 G4 E4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4'},
  {w:'triangle',v:.4,t:'G2 - D3 - G2 - D3 - | E2 - B2 - E2 - B2 - | C3 - G2 - C3 - G2 - | D3 - A2 - D3 - A2 -'},
  {d:1,v:.3,t:'k . . . h . . . | k . . . h . h .'}]}),
 cave:mkSong({bpm:76,loop:1,ch:[
  {w:'square',v:.09,t:'A4 - - - C5 - - - | B4 - - - E4 - - - | A4 - - - E5 - D5 - | C5 - - - - - - - | F4 - - - A4 - - - | G4 - - - E4 - - - | A4 - C5 - B4 - G4 - | A4 - - - - - - -'},
  {w:'triangle',v:.5,t:'A2 - - - A2 - - - | G2 - - - G2 - - - | F2 - - - F2 - - - | E2 - - - E2 - - - | F2 - - - F2 - - - | G2 - - - G2 - - - | F2 - - - E2 - - - | A2 - - - A2 - - -'},
  {d:1,v:.35,t:'k . . . . . h . | . . h . . . . .'}]}),
 battle:mkSong({bpm:150,loop:1,ch:[
  {w:'square',v:.12,t:'E5 - G5 - B5 - A5 G5 | F#5 - E5 - D5 - E5 - | E5 - G5 - B5 - D6 - | C6 - B5 - A5 - B5 - | C6 - B5 - A5 - G5 - | A5 - G5 - F#5 - D5 - | E5 G5 B5 G5 E5 G5 B5 D6 | E6 - - - B5 - - -'},
  {w:'triangle',v:.55,t:'E2 E3 E2 E3 E2 E3 E2 E3 | D2 D3 D2 D3 D2 D3 D2 D3 | C2 C3 C2 C3 C2 C3 C2 C3 | A2 A3 A2 A3 A2 A3 A2 A3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3 | B2 B3 B2 B3 B2 B3 B2 B3'},
  {w:'square',v:.04,t:'B4 . B4 . B4 . B4 . | A4 . A4 . A4 . A4 . | G4 . G4 . G4 . G4 . | E4 . E4 . E4 . E4 .'},
  {d:1,v:.55,t:'k h s h k k s h'}]}),
 boss:mkSong({bpm:160,loop:1,ch:[
  {w:'square',v:.12,t:'D5 - F5 - A5 - G#5 - | A5 - - - D5 - - - | C5 - E5 - G5 - F5 - | E5 - - - A4 - - - | Bb4 - D5 - F5 - E5 - | F5 - G5 - A5 - - - | D6 - C6 - A5 - F5 - | E5 - - - A5 - - -'},
  {w:'sawtooth',v:.07,t:'D2 D2 D3 D2 D2 D3 D2 D3 | D2 D2 D3 D2 D2 D3 D2 D3 | C2 C2 C3 C2 C2 C3 C2 C3 | A1 A1 A2 A1 A1 A2 A1 A2 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb2 Bb1 Bb2 | F2 F2 F3 F2 F2 F3 F2 F3 | D2 D2 D3 D2 D2 D3 D2 D3 | A1 A1 A2 A1 A1 A2 C#3 E3'},
  {w:'triangle',v:.45,t:'D3 - - - D3 - - - | D3 - - - D3 - - - | C3 - - - C3 - - - | A2 - - - A2 - - - | Bb2 - - - Bb2 - - - | F2 - - - F2 - - - | D3 - - - D3 - - - | A2 - - - A2 - - -'},
  {d:1,v:.6,t:'k k s h k k s s'}]}),
 ngen:mkSong({bpm:72,loop:1,ch:[
  {w:'triangle',v:.55,t:'C5 - - - F5 - - - | A5 - G5 - F5 - - - | D5 - - - F5 - - - | E5 - - - C5 - - - | C5 - - - F5 - A5 - | C6 - - - A5 - - - | G5 - F5 - D5 - E5 - | F5 - - - - - - -'},
  {w:'square',v:.045,t:'F4 A4 C5 A4 F4 A4 C5 A4 | F4 A4 C5 A4 F4 A4 C5 A4 | D4 F4 Bb4 F4 D4 F4 Bb4 F4 | E4 G4 C5 G4 E4 G4 C5 G4'},
  {w:'triangle',v:.4,t:'F2 - - - F2 - - - | F2 - - - F2 - - - | Bb2 - - - Bb2 - - - | C3 - - - C3 - - - | F2 - - - F2 - - - | A2 - - - A2 - - - | Bb2 - - - C3 - - - | F2 - - - F2 - - -'}]}),
 coastG:mkSong({bpm:80,loop:1,ch:[
  {w:'triangle',v:.5,t:'D5 - - - F5 - E5 - | D5 - - - A4 - - - | Bb4 - - - C5 - D5 - | A4 - - - - - - - | D5 - - - F5 - G5 - | A5 - - - F5 - E5 - | D5 - C5 - Bb4 - A4 - | D5 - - - - - - -'},
  {w:'square',v:.035,t:'D4 F4 A4 F4 D4 F4 A4 F4 | D4 F4 A4 F4 D4 F4 A4 F4 | Bb3 D4 F4 D4 Bb3 D4 F4 D4 | A3 C#4 E4 C#4 A3 C#4 E4 C#4'},
  {w:'triangle',v:.42,t:'D2 - - - A2 - - - | D2 - - - A2 - - - | Bb1 - - - F2 - - - | A1 - - - E2 - - - | D2 - - - A2 - - - | F2 - - - C3 - - - | Bb1 - - - A1 - - - | D2 - - - - - - -'},
  {d:1,v:.28,t:'k . . . . . h . | k . . . . . . .'}]}),
 lofG:mkSong({bpm:76,loop:1,ch:[
  {w:'triangle',v:.5,t:'C5 - A4 - F4 - A4 - | Bb4 - - - A4 - G4 - | A4 - C5 - F5 - E5 - | D5 - - - C5 - - - | Bb4 - D5 - C5 - A4 - | G4 - - - F4 - G4 - | A4 - G4 - F4 - E4 - | F4 - - - - - - -'},
  {w:'square',v:.028,t:'F4 A4 C5 A4 F4 A4 C5 A4 | D4 F4 Bb4 F4 D4 F4 Bb4 F4 | F4 A4 C5 A4 F4 A4 C5 A4 | E4 G4 C5 G4 E4 G4 C5 G4'},
  {w:'triangle',v:.36,t:'F2 - - - C3 - - - | Bb2 - - - F2 - - - | F2 - - - A2 - - - | Bb2 - - - C3 - - - | Bb2 - - - F2 - - - | C3 - - - C3 - - - | D3 - - - C3 - - - | F2 - - - - - - -'},
  {d:1,v:.16,t:'k . h . . . h . | k . h . . . h h'}]}),
 nagLof:mkSong({bpm:96,loop:1,ch:[
  {w:'triangle',v:.55,t:'D5 - F#5 - A5 - | B5 - A5 - F#5 - | G5 - F#5 - E5 - | F#5 - - - - - | D5 - F#5 - A5 - | D6 - B5 - A5 - | G5 - E5 - C#5 - | D5 - - - - -'},
  {w:'square',v:.05,t:'A3 D4 F#4 D4 A3 D4 | G3 B3 D4 B3 G3 B3 | A3 C#4 E4 C#4 A3 C#4 | A3 D4 F#4 D4 A3 D4'},
  {w:'triangle',v:.4,t:'D3 - - A2 - - | G2 - - D3 - - | A2 - - E3 - - | D3 - - A2 - -'},
  {d:1,v:.35,t:'k . . k . h'}]}),
 nagLofG:mkSong({bpm:72,loop:1,ch:[
  {w:'triangle',v:.5,t:'E5 - - D5 C5 - | D5 - - - - - | C5 - - B4 A4 - | B4 - - - - - | A4 - C5 - E5 - | D5 - C5 - B4 - | C5 - - B4 - - | A4 - - - - -'},
  {w:'square',v:.04,t:'A3 C4 E4 C4 A3 C4 | G3 B3 D4 B3 G3 B3 | F3 A3 C4 A3 F3 A3 | E3 G#3 B3 G#3 E3 G#3'},
  {w:'triangle',v:.4,t:'A2 - - - - - | G2 - - - - - | F2 - - - - - | E2 - - - - -'},
  {d:1,v:.22,t:'k . . . . .'}]}),
 nagCave:mkSong({bpm:72,loop:1,ch:[
  {w:'triangle',v:.42,t:'D5 - - - F5 - E5 - | D5 - - - A4 - - - | C5 - - - D5 - E5 - | F5 - E5 - D5 - - - | A5 - - - G5 - F5 - | E5 - - - D5 - - - | C#5 - - - E5 - - - | D5 - - - - - - -'},
  {w:'square',v:.04,t:'D4 A4 F4 A4 D4 A4 F4 A4 | C4 G4 E4 G4 C4 G4 E4 G4 | Bb3 F4 D4 F4 Bb3 F4 D4 F4 | A3 E4 C#4 E4 A3 E4 C#4 E4'},
  {w:'triangle',v:.45,t:'D2 - - - - - - - | C2 - - - - - - - | Bb1 - - - - - - - | A1 - - - - - - -'},
  {d:1,v:.25,t:'k . . . . . h . | . . k . . . . .'}]}),
 nagBattle:mkSong({bpm:168,loop:1,ch:[
  {w:'square',v:.12,t:'A5 - E5 A5 - C6 | B5 - G5 E5 - - | A5 - E5 A5 - C6 | D6 - C6 B5 - - | C6 - B5 A5 - G5 | F5 - E5 D5 - - | E5 - G#5 B5 - D6 | E6 - - E5 - -'},
  {w:'triangle',v:.55,t:'A2 A3 A2 A2 A3 A2 | G2 G3 G2 G2 G3 G2 | F2 F3 F2 F2 F3 F2 | E2 E3 E2 E2 E3 E2'},
  {w:'square',v:.04,t:'A4 C5 E5 A4 C5 E5 | G4 B4 D5 G4 B4 D5 | F4 A4 C5 F4 A4 C5 | E4 G#4 B4 E4 G#4 B4'},
  {d:1,v:.55,t:'k . h k s h | k . h k s s'}]}),
 palin:mkSong({bpm:152,loop:1,ch:[   // palin match: bright, driving, kultrun-and-trutruka feel (not the battle theme)
  {w:'square',v:.11,t:'D5 - F#5 A5 B5 A5 F#5 - | E5 - D5 E5 F#5 - - - | A5 - B5 A5 F#5 E5 D5 - | E5 - F#5 - A5 - - - | B5 - A5 B5 D6 - B5 A5 | F#5 - E5 F#5 A5 - - - | B5 A5 F#5 E5 D5 E5 F#5 A5 | D5 - - - D6 - - -'},
  {w:'triangle',v:.55,t:'D2 D3 D2 D3 D2 D3 A2 D3 | E2 E3 E2 E3 A2 A3 A2 A3 | D2 D3 D2 D3 G2 G3 G2 G3 | A2 A3 A2 A3 A2 A3 E2 A2 | G2 G3 G2 G3 D2 D3 D2 D3 | A2 A3 A2 A3 E2 E3 E2 E3 | G2 G3 A2 A3 B2 B3 A2 A3 | D2 D3 D2 D3 A2 - - -'},
  {w:'sawtooth',v:.05,t:'. - - - - - - - | . - - - - - - - | . - - - - - - - | A3 - - - - - - - | . - - - - - - - | . - - - - - - - | . - - - - - - - | D4 - - - D4 - - -'},
  {w:'square',v:.035,t:'F#4 A4 D5 A4 F#4 A4 D5 A4 | E4 A4 C#5 A4 E4 A4 C#5 A4 | D4 G4 B4 G4 D4 G4 B4 G4 | E4 A4 C#5 A4 E4 A4 C#5 A4'},
  {d:1,v:.55,t:'k . h k s . h . | k . h k s . k s'}]}),
 nagBoss:mkSong({bpm:138,loop:1,ch:[
  {w:'sawtooth',v:.06,t:'E5 - F5 - E5 - D5 - | E5 - - - B4 - - - | E5 - F5 - G5 - F5 - | E5 - D5 - C5 - B4 - | C5 - D5 - E5 - F5 - | G5 - F5 - E5 - D5 - | F5 - - - E5 - - - | E5 - - - - - - -'},
  {w:'triangle',v:.55,t:'E2 E2 E3 E2 F2 F2 F3 F2 | E2 E2 E3 E2 D2 D2 D3 D2 | C2 C2 C3 C2 D2 D2 D3 D2 | E2 E2 E3 E2 F2 E2 D2 E2'},
  {w:'square',v:.05,t:'E4 . . G4 . . B4 . | F4 . . A4 . . C5 .'},
  {d:1,v:.55,t:'k h s h k k s h | k h s h k s s s'}]}),
 nagNgen:mkSong({bpm:88,loop:1,ch:[
  {w:'triangle',v:.5,t:'G5 - D5 - B4 - D5 - | E5 - - - D5 - - - | C5 - E5 - G5 - E5 - | D5 - - - - - - - | G5 - A5 - B5 - G5 - | A5 - - - F#5 - D5 - | E5 - F#5 - G5 - A5 - | G5 - - - - - - -'},
  {w:'square',v:.05,t:'B3 D4 G4 D4 B3 D4 G4 D4 | C4 E4 G4 E4 C4 E4 G4 E4 | A3 C4 E4 C4 A3 C4 E4 C4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4'},
  {w:'triangle',v:.4,t:'G2 - - - D3 - - - | C3 - - - G2 - - - | A2 - - - E3 - - - | D3 - - - A2 - - -'},
  {d:1,v:.3,t:'k . h . s . h . | k . h k s . h h'}]}),
 pew:mkSong({bpm:100,loop:1,ch:[
  {w:'triangle',v:.5,t:'E5 - G5 A5 B5 - A5 G5 | E5 - - - D5 - - - | E5 - G5 A5 B5 - D6 B5 | A5 - - - - - - - | B5 - A5 G5 E5 - G5 A5 | B5 - - - A5 G5 E5 - | D5 - E5 G5 A5 - G5 E5 | E5 - - - - - - -'},
  {w:'square',v:.05,t:'E4 B4 E5 B4 E4 B4 E5 B4 | D4 A4 D5 A4 D4 A4 D5 A4 | C4 G4 C5 G4 C4 G4 C5 G4 | D4 A4 D5 A4 B3 F#4 B4 F#4'},
  {w:'triangle',v:.45,t:'E2 - - - E3 - - - | D2 - - - D3 - - - | C2 - - - C3 - - - | D2 - - - B1 - - -'},
  {d:1,v:.4,t:'k . . h k . s . | k . h . k . s h'}]}),
 pewG:mkSong({bpm:64,loop:1,ch:[
  {w:'triangle',v:.5,t:'E5 - - - D5 - B4 - | A4 - - - - - - - | B4 - - - D5 - E5 - | B4 - - - - - - - | G4 - - - A4 - B4 - | D5 - - - B4 - A4 - | G4 - - - F#4 - - - | E4 - - - - - - -'},
  {w:'square',v:.04,t:'E3 B3 E4 B3 E3 B3 E4 B3 | A2 E3 A3 E3 A2 E3 A3 E3 | C3 G3 C4 G3 C3 G3 C4 G3 | B2 F#3 B3 F#3 B2 F#3 B3 F#3'},
  {w:'triangle',v:.4,t:'E2 - - - - - - - | A1 - - - - - - - | C2 - - - - - - - | B1 - - - - - - -'},
  {d:1,v:.2,t:'k . . . . . . . | . . . . h . . .'}]}),
 pewLof:mkSong({bpm:92,loop:1,ch:[
  {w:'triangle',v:.55,t:'G5 - E5 D5 - E5 | G5 - A5 B5 - - | A5 - G5 E5 - D5 | E5 - - - - - | G5 - E5 D5 - B4 | D5 - E5 G5 - - | A5 - G5 E5 - D5 | G5 - - - - -'},
  {w:'square',v:.05,t:'B3 D4 G4 B3 D4 G4 | C4 E4 G4 C4 E4 G4 | A3 C4 E4 A3 C4 E4 | D4 G4 B4 D4 G4 B4'},
  {w:'triangle',v:.4,t:'G2 - - D3 - - | C3 - - G2 - - | A2 - - E3 - - | D3 - - G2 - -'},
  {d:1,v:.32,t:'k . h k . h'}]}),
 pewLofG:mkSong({bpm:70,loop:1,ch:[
  {w:'triangle',v:.5,t:'D5 - - B4 - A4 | G4 - - - - - | E4 - G4 A4 - B4 | A4 - - - - - | D5 - - B4 - A4 | G4 - E4 D4 - - | E4 - G4 A4 - G4 | G4 - - - - -'},
  {w:'square',v:.04,t:'B3 D4 G4 D4 B3 D4 | C4 E4 G4 E4 C4 E4 | A3 C4 E4 C4 A3 C4 | D4 F#4 A4 F#4 D4 F#4'},
  {w:'triangle',v:.4,t:'G2 - - - - - | C3 - - - - - | A2 - - - - - | D3 - - - - -'},
  {d:1,v:.2,t:'k . . . . .'}]}),
 pewCave:mkSong({bpm:80,loop:1,ch:[
  {w:'triangle',v:.42,t:'C5 - - - Eb5 - D5 - | C5 - - - G4 - - - | Ab4 - - - Bb4 - C5 - | G4 - - - - - - - | C5 - Eb5 - F5 - G5 - | Ab5 - - - G5 - F5 - | Eb5 - D5 - B4 - - - | C5 - - - - - - -'},
  {w:'square',v:.045,t:'C3 G3 C4 G3 C3 G3 C4 G3 | Ab2 Eb3 Ab3 Eb3 Ab2 Eb3 Ab3 Eb3 | F2 C3 F3 C3 F2 C3 F3 C3 | G2 D3 G3 D3 G2 B2 D3 G3'},
  {w:'sawtooth',v:.04,t:'C2 - - - - - - - | Ab1 - - - - - - - | F1 - - - - - - - | G1 - - - - - - -'},
  {d:1,v:.3,t:'k . . k . . s . | k . . . . k s h'}]}),
 pewBattle:mkSong({bpm:160,loop:1,ch:[
  {w:'square',v:.12,t:'D5 F5 G5 A5 - G5 F5 D5 | C5 - D5 - F5 - - - | D5 F5 G5 A5 - C6 A5 G5 | A5 - - - - - - - | Bb5 - A5 - G5 - F5 - | G5 - F5 - D5 - C5 - | D5 F5 A5 D6 - C6 A5 G5 | D5 - - - D6 - - -'},
  {w:'triangle',v:.55,t:'D2 D3 D2 D3 D2 D3 D2 D3 | C2 C3 C2 C3 C2 C3 C2 C3 | Bb1 Bb2 Bb1 Bb2 Bb1 Bb2 Bb1 Bb2 | C2 C3 C2 C3 A1 A2 A1 A2'},
  {w:'square',v:.04,t:'F4 A4 D5 A4 F4 A4 D5 A4 | E4 G4 C5 G4 E4 G4 C5 G4 | D4 F4 Bb4 F4 D4 F4 Bb4 F4 | E4 G4 C5 G4 C#4 E4 A4 E4'},
  {d:1,v:.55,t:'k h s h k h s s'}]}),
 pewBoss:mkSong({bpm:150,loop:1,ch:[
  {w:'sawtooth',v:.06,t:'C5 - Db5 - C5 - G4 - | Ab4 - G4 - F4 - G4 - | C5 - Db5 - Eb5 - F5 - | G5 - - - F5 - Eb5 - | Db5 - - - C5 - Bb4 - | C5 - - - G4 - - - | Ab4 - Bb4 - C5 - Db5 - | C5 - - - - - - -'},
  {w:'triangle',v:.55,t:'C2 C2 C3 C2 C2 C2 C3 C2 | Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 | C2 C2 C3 C2 Db2 Db2 Db3 Db2'},
  {w:'square',v:.05,t:'C4 . . Eb4 . . G4 . | Db4 . . F4 . . Ab4 .'},
  {d:1,v:.55,t:'k k s h k k s s | k h s h k k s k'}]}),
 pewNgen:mkSong({bpm:84,loop:1,ch:[
  {w:'triangle',v:.5,t:'A5 - F#5 - D5 - E5 - | F#5 - - - E5 - - - | D5 - E5 - F#5 - A5 - | B5 - - - - - - - | A5 - B5 - A5 - F#5 - | E5 - - - D5 - E5 - | F#5 - E5 - D5 - B4 - | D5 - - - - - - -'},
  {w:'square',v:.05,t:'F#4 A4 D5 A4 F#4 A4 D5 A4 | E4 A4 C#5 A4 E4 A4 C#5 A4 | D4 G4 B4 G4 D4 G4 B4 G4 | E4 A4 C#5 A4 F#4 A4 D5 A4'},
  {w:'triangle',v:.4,t:'D3 - - - A2 - - - | A2 - - - E3 - - - | G2 - - - D3 - - - | A2 - - - D3 - - -'},
  {d:1,v:.3,t:'k . h . s . h . | k . h k s . h h'}]}),
 wil:mkSong({bpm:108,loop:1,ch:[
  {w:'triangle',v:.5,t:'A4 - D5 - F#5 - | E5 - - - D5 - | B4 - D5 - G5 - | F#5 - - - - - | A4 - D5 - F#5 - | A5 - G5 - F#5 - | E5 - C#5 - E5 - | D5 - - - - -'},
  {w:'square',v:.04,t:'F#4 A4 D5 F#4 A4 D5 | G4 B4 D5 G4 B4 D5 | A4 C#5 E5 A4 C#5 E5 | F#4 A4 D5 F#4 A4 D5'},
  {w:'triangle',v:.42,t:'D3 - - A2 - - | G2 - - D3 - - | A2 - - E3 - - | D3 - - A2 - -'},
  {d:1,v:.3,t:'k . h . h .'}]}),
 wilG:mkSong({bpm:66,loop:1,ch:[
  {w:'triangle',v:.5,t:'F#5 - - E5 D5 - | C#5 - - - B4 - | D5 - - C#5 B4 - | A#4 - - - - - | B4 - D5 - F#5 - | G5 - - F#5 E5 - | D5 - C#5 - A#4 - | B4 - - - - -'},
  {w:'square',v:.04,t:'D4 F#4 B4 D4 F#4 B4 | E4 G4 B4 E4 G4 B4 | F#4 A#4 C#5 F#4 A#4 C#5 | D4 F#4 B4 D4 F#4 B4'},
  {w:'triangle',v:.4,t:'B2 - - - - - | E2 - - - - - | F#2 - - - - - | B2 - - - - -'},
  {d:1,v:.2,t:'k . . . . .'}]}),
 wilLof:mkSong({bpm:112,loop:1,ch:[
  {w:'triangle',v:.55,t:'D5 - B4 G4 - B4 | D5 - E5 D5 - - | C5 - A4 F#4 - A4 | C5 - D5 C5 - - | B4 - G4 D4 - G4 | B4 - C5 D5 - E5 | D5 - C5 B4 - A4 | G4 - - - - -'},
  {w:'square',v:.05,t:'B3 D4 G4 B3 D4 G4 | A3 D4 F#4 A3 D4 F#4 | A3 C4 F#4 A3 C4 F#4 | B3 D4 G4 B3 D4 G4'},
  {w:'triangle',v:.4,t:'G2 - - D3 - - | D2 - - A2 - - | D2 - - A2 - - | G2 - - D3 - -'},
  {d:1,v:.32,t:'k . h k h .'}]}),
 wilLofG:mkSong({bpm:76,loop:1,ch:[
  {w:'triangle',v:.5,t:'B4 - - E5 - G5 | F#5 - - E5 - - | D5 - - C5 - B4 | A4 - - - - - | B4 - - E5 - G5 | B5 - - A5 - G5 | F#5 - D5 - E5 - | E5 - - - - -'},
  {w:'square',v:.04,t:'E4 G4 B4 E4 G4 B4 | D4 F#4 A4 D4 F#4 A4 | C4 E4 G4 C4 E4 G4 | B3 D#4 F#4 B3 D#4 F#4'},
  {w:'triangle',v:.4,t:'E2 - - - - - | D2 - - - - - | C2 - - - - - | B1 - - - - -'},
  {d:1,v:.2,t:'k . . h . .'}]}),
 wilCave:mkSong({bpm:70,loop:1,ch:[
  {w:'triangle',v:.42,t:'A4 - - - C5 - B4 - | A4 - - - E4 - - - | F4 - - - G4 - A4 - | E4 - - - - - - - | A4 - C5 - E5 - D5 - | C5 - - - B4 - - - | G#4 - - - B4 - - - | A4 - - - - - - -'},
  {w:'square',v:.04,t:'A3 E4 A4 E4 A3 E4 A4 E4 | F3 C4 F4 C4 F3 C4 F4 C4 | D3 A3 D4 A3 D3 A3 D4 A3 | E3 B3 E4 B3 E3 G#3 B3 E4'},
  {w:'sawtooth',v:.04,t:'A1 - - - - - - - | F1 - - - - - - - | D2 - - - - - - - | E1 - - - - - - -'},
  {d:1,v:.25,t:'k . . . . . h . | . . . . k . . .'}]}),
 wilBattle:mkSong({bpm:164,loop:1,ch:[
  {w:'square',v:.12,t:'B5 - F#5 B5 - D6 | C#6 - A5 F#5 - - | B5 - F#5 B5 - D6 | E6 - D6 C#6 - - | D6 - C#6 B5 - A5 | G5 - F#5 E5 - - | F#5 - A#5 C#6 - E6 | F#6 - - F#5 - -'},
  {w:'triangle',v:.55,t:'B2 B3 B2 B2 B3 B2 | A2 A3 A2 A2 A3 A2 | G2 G3 G2 G2 G3 G2 | F#2 F#3 F#2 F#2 F#3 F#2'},
  {w:'square',v:.04,t:'B4 D5 F#5 B4 D5 F#5 | A4 C#5 E5 A4 C#5 E5 | G4 B4 D5 G4 B4 D5 | F#4 A#4 C#5 F#4 A#4 C#5'},
  {d:1,v:.55,t:'k . h k s h | k . h k s s'}]}),
 wilBoss:mkSong({bpm:144,loop:1,ch:[
  {w:'sawtooth',v:.06,t:'B4 - D5 - F5 - Ab5 - | G5 - - - F5 - - - | E5 - G5 - Bb5 - Db6 - | C6 - - - B5 - - - | B4 - C5 - D5 - Eb5 - | F5 - - - Eb5 - D5 - | C5 - B4 - Ab4 - G4 - | B4 - - - - - - -'},
  {w:'triangle',v:.55,t:'B1 B1 B2 B1 B1 B1 B2 B1 | G1 G1 G2 G1 G1 G1 G2 G1 | E1 E1 E2 E1 E1 E1 E2 E1 | F1 F1 F2 F1 F#1 F#1 F#2 F#1'},
  {w:'square',v:.05,t:'D4 . . F4 . . Ab4 . | Db4 . . E4 . . G4 .'},
  {d:1,v:.55,t:'k h s h k k s h | k h s h k s s c'}]}),
 wilNgen:mkSong({bpm:92,loop:1,ch:[
  {w:'triangle',v:.5,t:'E5 - A5 - C#6 - B5 - | A5 - - - E5 - - - | F#5 - A5 - D6 - C#6 - | B5 - - - - - - - | E5 - A5 - C#6 - E6 - | D6 - - - C#6 - B5 - | A5 - B5 - C#6 - B5 - | A5 - - - - - - -'},
  {w:'square',v:.05,t:'C#4 E4 A4 E4 C#4 E4 A4 E4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4 | E4 G#4 B4 G#4 E4 G#4 B4 G#4 | C#4 E4 A4 E4 E4 G#4 B4 G#4'},
  {w:'triangle',v:.4,t:'A2 - - - E3 - - - | D3 - - - A2 - - - | E3 - - - B2 - - - | A2 - - - E2 - - -'},
  {d:1,v:.3,t:'k . h . s . h . | k . h k s . h h'}]}),
 puel:mkSong({bpm:96,loop:1,ch:[
  {w:'triangle',v:.5,t:'D5 - - A4 - - | C5 - D5 - E5 - | D5 - - A4 - - | G4 - - - - - | D5 - - E5 - G5 | A5 - G5 - E5 - | D5 - C5 - E5 - | D5 - - - - -'},
  {w:'square',v:.04,t:'D4 F#4 A4 D4 F#4 A4 | C4 E4 G4 C4 E4 G4 | D4 F#4 A4 D4 F#4 A4 | G3 B3 D4 G3 B3 D4'},
  {w:'triangle',v:.42,t:'D3 - - A2 - - | C3 - - G2 - - | D3 - - A2 - - | G2 - - D3 - -'},
  {d:1,v:.3,t:'k . h . h .'}]}),
 puelG:mkSong({bpm:62,loop:1,ch:[
  {w:'triangle',v:.5,t:'D5 - - C5 A4 - | A#4 - - - G4 - | A4 - - G4 F4 - | E4 - - - - - | D5 - - C5 - A4 | A#4 - - A4 G4 - | F4 - E4 - C#4 - | D4 - - - - -'},
  {w:'square',v:.04,t:'D4 F4 A4 D4 F4 A4 | A#3 D4 F4 A#3 D4 F4 | A3 C#4 E4 A3 C#4 E4 | D4 F4 A4 D4 F4 A4'},
  {w:'triangle',v:.4,t:'D2 - - - - - | A#1 - - - - - | A1 - - - - - | D2 - - - - -'},
  {d:1,v:.2,t:'k . . . . .'}]}),
 puelLof:mkSong({bpm:104,loop:1,ch:[
  {w:'triangle',v:.55,t:'G4 - B4 D5 - B4 | G5 - A5 G5 - - | E5 - C5 A4 - C5 | E5 - D5 C5 - - | D5 - B4 G4 - B4 | D5 - E5 G5 - A5 | G5 - E5 D5 - B4 | G4 - - - - -'},
  {w:'square',v:.05,t:'G3 B3 D4 G3 B3 D4 | C4 E4 G4 C4 E4 G4 | A3 D4 F#4 A3 D4 F#4 | G3 B3 D4 G3 B3 D4'},
  {w:'triangle',v:.4,t:'G2 - - D3 - - | C3 - - G2 - - | D2 - - A2 - - | G2 - - D3 - -'},
  {d:1,v:.32,t:'k . h k h .'}]}),
 puelLofG:mkSong({bpm:72,loop:1,ch:[
  {w:'triangle',v:.5,t:'E5 - - D5 B4 - | C5 - - B4 A4 - | B4 - - A4 G4 - | F#4 - - - - - | E5 - - G5 - F#5 | E5 - - D5 - B4 | C5 - B4 - F#4 - | E4 - - - - -'},
  {w:'square',v:.04,t:'E4 G4 B4 E4 G4 B4 | A3 C4 E4 A3 C4 E4 | B3 D#4 F#4 B3 D#4 F#4 | E4 G4 B4 E4 G4 B4'},
  {w:'triangle',v:.4,t:'E2 - - - - - | A1 - - - - - | B1 - - - - - | E2 - - - - -'},
  {d:1,v:.2,t:'k . . h . .'}]}),
 puelCave:mkSong({bpm:74,loop:1,ch:[
  {w:'triangle',v:.42,t:'D5 - - - D#5 - D5 - | C5 - - - A4 - - - | A#4 - - - C5 - D5 - | A4 - - - - - - - | D5 - F5 - D#5 - D5 - | C5 - - - A#4 - - - | A4 - - - C5 - - - | D5 - - - - - - -'},
  {w:'square',v:.04,t:'D3 A3 D4 A3 D3 A3 D4 A3 | A#2 F3 A#3 F3 A#2 F3 A#3 F3 | C3 G3 C4 G3 C3 G3 C4 G3 | D3 A3 D4 A3 D3 A3 D4 A3'},
  {w:'sawtooth',v:.04,t:'D1 - - - - - - - | A#1 - - - - - - - | C2 - - - - - - - | D1 - - - - - - -'},
  {d:1,v:.25,t:'k . . . h . . . | . . k . . . h .'}]}),
 puelBattle:mkSong({bpm:166,loop:1,ch:[
  {w:'square',v:.12,t:'D6 - A5 D6 - F6 | E6 - C6 A5 - - | D6 - A5 D6 - F6 | G6 - F6 E6 - - | F6 - E6 D6 - C6 | A#5 - A5 G5 - - | A5 - C#6 E6 - G6 | A6 - - A5 - -'},
  {w:'triangle',v:.55,t:'D3 D4 D3 D3 D4 D3 | C3 C4 C3 C3 C4 C3 | A#2 A#3 A#2 A#2 A#3 A#2 | A2 A3 A2 A2 A3 A2'},
  {w:'square',v:.04,t:'D5 F5 A5 D5 F5 A5 | C5 E5 G5 C5 E5 G5 | A#4 D5 F5 A#4 D5 F5 | A4 C#5 E5 A4 C#5 E5'},
  {d:1,v:.55,t:'k . h k s h | k . h k s s'}]}),
 puelBoss:mkSong({bpm:148,loop:1,ch:[
  {w:'sawtooth',v:.06,t:'D5 - F5 - G#5 - B5 - | A5 - - - G5 - - - | C5 - D#5 - F#5 - A5 - | G#5 - - - G5 - - - | D5 - D#5 - F5 - F#5 - | G#5 - - - G5 - F5 - | D#5 - D5 - B4 - A#4 - | D5 - - - - - - -'},
  {w:'triangle',v:.55,t:'D2 D2 D3 D2 D2 D2 D3 D2 | A#1 A#1 A#2 A#1 A#1 A#1 A#2 A#1 | C2 C2 C3 C2 C2 C2 C3 C2 | A1 A1 A2 A1 G#1 G#1 G#2 G#1'},
  {w:'square',v:.05,t:'F4 . . G#4 . . B4 . | D#4 . . F#4 . . A4 .'},
  {d:1,v:.55,t:'k h s h k k s h | k h s h k s s c'}]}),
 puelNgen:mkSong({bpm:88,loop:1,ch:[
  {w:'triangle',v:.5,t:'D5 - G5 - B5 - A5 - | G5 - - - D5 - - - | E5 - G5 - C6 - B5 - | A5 - - - - - - - | D5 - G5 - B5 - D6 - | C6 - - - B5 - A5 - | G5 - A5 - B5 - A5 - | G5 - - - - - - -'},
  {w:'square',v:.05,t:'B3 D4 G4 D4 B3 D4 G4 D4 | C4 E4 G4 E4 C4 E4 G4 E4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4 | B3 D4 G4 D4 D4 F#4 A4 F#4'},
  {w:'triangle',v:.4,t:'G2 - - - D3 - - - | C3 - - - G2 - - - | D3 - - - A2 - - - | G2 - - - D2 - - -'},
  {d:1,v:.3,t:'k . h . s . h . | k . h k s . h h'}]}),
 ending:mkSong({bpm:76,loop:1,ch:[
  {w:'triangle',v:.5,t:'G4 - B4 - D5 - E5 - | D5 - - - B4 - - - | C5 - E5 - G5 - A5 - | G5 - - - D5 - - - | E5 - G5 - B5 - A5 - | G5 - - - E5 - D5 - | C5 - D5 - E5 - D5 - | G4 - - - - - - -'},
  {w:'square',v:.05,t:'G3 B3 D4 B3 G3 B3 D4 B3 | C4 E4 G4 E4 C4 E4 G4 E4 | A3 C4 E4 C4 A3 C4 E4 C4 | G3 B3 D4 B3 G3 B3 D4 B3'},
  {w:'triangle',v:.4,t:'G2 - - - D3 - - - | C3 - - - G2 - - - | A2 - - - E3 - - - | G2 - - - D2 - - -'},
  {d:1,v:.22,t:'k . . . h . . . | k . h . s . . .'}]}),
// Santiago: the city while its silences stand (urgent, gloomy), and a metal fight for each of the three silences
 wariaG:mkSong({bpm:138,loop:1,ch:[
  {w:'square',v:0.065,t:'D5 - - - F5 - E5 - | D5 - - - Bb4 - - - | G4 - A4 - Bb4 - D5 - | C#5 - - - - - - - | D5 - - - F5 - G5 - | Ab5 - - - G5 - Eb5 - | E5 - - - C5 - G4 - | A4 - - - C#5 - E5 - | F5 - E5 - D5 - C5 - | Bb4 - - - A4 - G4 - | Eb5 - D5 - C5 - Bb4 - | A4 - - - - - - - | D5 - - - Eb5 - D5 - | C5 - - - Bb4 - A4 - | G4 - Bb4 - D5 - Eb5 - | D5 - - - C#5 - - -'},
  {w:'triangle',v:0.5,t:'D2 D2 D2 D2 D2 D2 D3 D2 | Bb1 Bb1 Bb1 Bb1 Bb1 Bb1 Bb2 Bb1 | G1 G1 G1 G1 G1 G1 G2 G1 | A1 A1 A1 A1 C#2 C#2 E2 E2 | D2 D2 D2 D2 D2 D2 D3 D2 | Eb2 Eb2 Eb2 Eb2 Eb2 Eb2 Eb3 Eb2 | C2 C2 C2 C2 C2 C2 C3 C2 | A1 A1 A1 A1 A1 A1 A2 A1'},
  {w:'sawtooth',v:0.032,dist:1,t:'D2 - - - - - - - | Bb1 - - - - - - - | G1 - - - - - - - | A1 - - - - - - - | D2 - - - - - - - | Eb2 - - - - - - - | C2 - - - - - - - | A1 - - - - - - -'},
  {w:'square',v:0.024,t:'D4 F4 A4 F4 D4 F4 A4 F4 | D4 F4 Bb4 F4 D4 F4 Bb4 F4 | D4 G4 Bb4 G4 D4 G4 Bb4 G4 | C#4 E4 A4 E4 C#4 E4 A4 E4 | D4 F4 A4 F4 D4 F4 A4 F4 | Eb4 G4 Bb4 G4 Eb4 G4 Bb4 G4 | C4 E4 G4 E4 C4 E4 G4 E4 | C#4 E4 A4 E4 C#4 E4 A4 E4'},
  {w:'sine',v:0.06,t:'D6 - - - . . . . | . . . . . . . . | A5 - - - . . . . | . . . . . . . .'},
  {d:1,v:0.46,t:'k . k h s . k h | k . k h s h k k | k . k h s . k h | k k s k s s s s'}]}),
 stgoBoss1:mkSong({bpm:186,loop:1,ch:[
  {w:'sawtooth',v:0.11,dist:2,det:9,t:'E2 E2 . E2 E2 . E2 E2 | E2 E2 . E2 F2 . E2 E2 | E2 E2 . E2 E2 . E2 E2 | A#1 - - - . . B1 B1 | E2 E2 . E2 E2 . E2 E2 | E2 E2 . E2 F2 . E2 E2 | G2 G2 . G2 F2 . E2 E2 | A#1 A#1 A#1 A#1 B1 B1 B1 B1 | E2 E2 E2 E2 E2 E2 E2 E2 | F2 F2 F2 F2 F2 F2 F2 F2 | E2 E2 E2 E2 E2 E2 E2 E2 | A#1 A#1 A#1 A#1 A#1 A#1 A#1 A#1 | C2 C2 C2 C2 C2 C2 C2 C2 | B1 B1 B1 B1 B1 B1 B1 B1 | A#1 A#1 A#1 A#1 B1 B1 B1 B1 | E2 - - - - - - -'},
  {w:'sawtooth',v:0.07,dist:2,det:-7,t:'B2 B2 . B2 B2 . B2 B2 | B2 B2 . B2 C3 . B2 B2 | B2 B2 . B2 B2 . B2 B2 | E2 - - - . . F#2 F#2 | B2 B2 . B2 B2 . B2 B2 | B2 B2 . B2 C3 . B2 B2 | D3 D3 . D3 C3 . B2 B2 | E2 E2 E2 E2 F#2 F#2 F#2 F#2 | B2 B2 B2 B2 B2 B2 B2 B2 | C3 C3 C3 C3 C3 C3 C3 C3 | B2 B2 B2 B2 B2 B2 B2 B2 | E2 E2 E2 E2 E2 E2 E2 E2 | G2 G2 G2 G2 G2 G2 G2 G2 | F#2 F#2 F#2 F#2 F#2 F#2 F#2 F#2 | E2 E2 E2 E2 F#2 F#2 F#2 F#2 | B2 - - - - - - -'},
  {w:'square',v:0.06,dist:1,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | E5 A#5 E5 A#5 E5 A#5 E5 A#5 | F5 B5 F5 B5 F5 B5 F5 B5 | E5 A#5 E5 A#5 G5 C#6 G5 C#6 | A#5 - - - B5 - - - | E5 - F5 - G5 - A#5 - | B5 - A#5 - G5 - F5 - | E5 - G5 - A#5 - C#6 - | B5 - - - A#5 - - - | C6 B5 A#5 G5 F5 E5 D5 C#5 | B4 C5 C#5 D5 E5 F5 G5 A#5 | B5 C6 B5 A#5 G5 F5 E5 F5 | E5 - - - - - - -'},
  {w:'triangle',v:0.42,t:'E2 . E2 . E2 . E2 . | E2 . E2 . F2 . E2 . | E2 . E2 . E2 . E2 . | A#1 . A#1 . B1 . B1 .'},
  {d:1,v:0.64,t:'c k s k k k s k | k k s k k k s k | k k s k k k s k | k s k s s s s s | c s k s k s k s | k s k s k s k s | k s k s k s k s | k s k s s s s s | c k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k s s s s | c s k s k s k s | k s k s k s k s | k s k s k s k s | c . . . s s s s'}]}),
 stgoBoss2:mkSong({bpm:172,loop:1,ch:[
  {w:'sawtooth',v:0.11,dist:2,det:8,t:'D2 D2 D#2 D2 F2 D2 G#2 | D2 D2 D#2 D2 F2 G#2 A2 | D2 D2 D#2 D2 F2 D2 G#2 | C2 C2 C#2 C2 D#2 C2 F#2 | D2 D2 D#2 D2 F2 D2 G#2 | D2 D2 D#2 D2 F2 G#2 A2 | A#1 A#1 B1 A#1 C#2 A#1 E2 | A1 A1 A1 A#1 A#1 B1 C2 | D2 D2 D2 D2 D2 D2 D2 | D#2 D#2 D#2 D#2 D#2 D#2 D#2 | D2 D2 D2 D2 D2 D2 D2 | G#1 G#1 G#1 G#1 A1 A1 A1'},
  {w:'sawtooth',v:0.07,dist:2,det:-6,t:'A2 A2 A#2 A2 C3 A2 D#3 | A2 A2 A#2 A2 C3 D#3 E3 | G2 G2 G#2 G2 A#2 G2 C#3 | F2 F2 F#2 F2 G#2 F2 B2 | A2 A2 A#2 A2 C3 A2 D#3 | A2 A2 A#2 A2 C3 D#3 E3 | F2 F2 F#2 F2 G#2 F2 B2 | E2 E2 E2 F2 F2 F#2 G2 | A2 A2 A2 A2 A2 A2 A2 | A#2 A#2 A#2 A#2 A#2 A#2 A#2 | A2 A2 A2 A2 A2 A2 A2 | D#2 D#2 D#2 D#2 E2 E2 E2'},
  {w:'square',v:0.055,dist:1,t:'. . . . . . . | . . . . . . . | . . . . . . . | . . . . . . . | D5 F5 G#5 B5 D6 B5 G#5 | F5 D5 B4 G#4 F4 D4 F4 | D#5 F#5 A5 C6 D#6 C6 A5 | F#5 D#5 C5 A4 F#4 D#4 F#4 | D6 C#6 C6 B5 A#5 A5 G#5 | G5 F#5 F5 E5 D#5 D5 C#5 | D5 - - D#5 - - E5 | F5 - - - G#5 - -'},
  {w:'triangle',v:0.42,t:'D2 . D2 . F2 . G#2 | D2 . D2 . F2 G#2 A2 | C2 . C2 . D#2 . F#2 | A#1 . A#1 . C#2 . E2'},
  {w:'sine',v:0.04,t:'D6 - - - - - - | . . . . . . . | G#5 - - - - - - | . . . . . . .'},
  {d:1,v:0.62,t:'c . s k . s s | k . s k . s k | k . s k . s s | k k s k s s s | c k s k k s k | k k s k k s k | k k s k k s k | s s s s s s s | c s k s k s k | k s k s k s k | k s k s k s k | c . . s s s s'}]}),
 stgoBoss3:mkSong({bpm:156,loop:1,ch:[
  {w:'sawtooth',v:0.12,dist:2,det:10,t:'C2 - - - - - - - | C2 - - - Db2 - - - | C2 - - - - - G1 - | Ab1 - - - G1 - - - | C2 - - - - - - - | Eb2 - - - D2 - Db2 - | C2 - - - - - G1 - | G1 - - - G1 G1 G1 G1 | C2 C2 C2 C2 C2 C2 Eb2 C2 | C2 C2 C2 C2 Db2 Db2 C2 C2 | Ab1 Ab1 Ab1 Ab1 Ab1 Ab1 Bb1 Ab1 | G1 G1 G1 G1 B1 B1 D2 D2 | C2 C2 C2 C2 C2 C2 Eb2 C2 | F2 F2 F2 F2 Eb2 Eb2 Db2 Db2 | C2 C2 C2 C2 Ab1 Ab1 G1 G1 | C2 C2 C2 C2 C2 - - -'},
  {w:'sawtooth',v:0.075,dist:2,det:-8,t:'G2 - - - - - - - | G2 - - - Ab2 - - - | G2 - - - - - D2 - | Eb2 - - - D2 - - - | G2 - - - - - - - | Bb2 - - - A2 - Ab2 - | G2 - - - - - D2 - | D2 - - - D2 D2 D2 D2 | G2 G2 G2 G2 G2 G2 Bb2 G2 | G2 G2 G2 G2 Ab2 Ab2 G2 G2 | Eb2 Eb2 Eb2 Eb2 Eb2 Eb2 F2 Eb2 | D2 D2 D2 D2 F#2 F#2 A2 A2 | G2 G2 G2 G2 G2 G2 Bb2 G2 | C3 C3 C3 C3 Bb2 Bb2 Ab2 Ab2 | G2 G2 G2 G2 Eb2 Eb2 D2 D2 | G2 G2 G2 G2 G2 - - -'},
  {w:'square',v:0.06,dist:1,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | C5 - - - Eb5 - G5 - | Ab5 - - - G5 - Eb5 - | D5 - - - Eb5 - F5 - | G5 - - - B4 - - - | C5 D5 Eb5 F5 G5 - Ab5 - | G5 - F5 - Eb5 - D5 - | Eb5 F5 G5 Ab5 Bb5 - Ab5 - | G5 - - - B5 - D6 - | C6 B5 Ab5 G5 F5 Eb5 D5 C5 | B4 C5 D5 Eb5 F5 G5 Ab5 B5 | C6 - G5 - Eb5 - D5 - | C5 - - - - - - -'},
  {w:'sine',v:0.07,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | G6 - . Eb6 - . . .'},
  {w:'triangle',v:0.44,t:'C2 - - - - - - - | C2 - - - Db2 - - - | C2 - - - - - G1 - | Ab1 - - - G1 - - - | C2 - - - - - - - | Eb2 - - - D2 - Db2 - | C2 - - - - - G1 - | G1 - - - G1 G1 G1 G1 | C2 C2 C2 C2 C2 C2 Eb2 C2 | C2 C2 C2 C2 Db2 Db2 C2 C2 | Ab1 Ab1 Ab1 Ab1 Ab1 Ab1 Bb1 Ab1 | G1 G1 G1 G1 B1 B1 D2 D2 | C2 C2 C2 C2 C2 C2 Eb2 C2 | F2 F2 F2 F2 Eb2 Eb2 Db2 Db2 | C2 C2 C2 C2 Ab1 Ab1 G1 G1 | C2 C2 C2 C2 C2 - - -'},
  {d:1,v:0.64,t:'c . . . . . . . | k . . . s . . . | k . . k . . . . | s . . . s . k k | c . . . s . . . | k . . . s . . . | k . . k s . . . | k k s k s s s s | c k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k s s s s | c k s k k k s k | k k s k k k s k | k k s k s s s s | c . . . c . . .'},
  {d:1,v:0.3,t:'h . h . h . h .'}]}),
 waria:mkSong({bpm:112,loop:1,ch:[
  {w:'square',v:.08,t:'C5 - E5 G5 - E5 | A5 - G5 E5 - - | F5 - A5 C6 - A5 | G5 - E5 C5 - - | C5 - E5 G5 - A5 | B5 - A5 G5 - E5 | F5 - E5 D5 - B4 | C5 - - - - -'},
  {w:'triangle',v:.45,t:'C3 - G3 - C3 - | A2 - E3 - A2 - | F2 - C3 - F2 - | G2 - D3 - G2 -'},
  {w:'square',v:.04,t:'E4 G4 C5 E4 G4 C5 | C4 E4 A4 C4 E4 A4 | C4 F4 A4 C4 F4 A4 | B3 D4 G4 B3 D4 G4'},
  {d:1,v:.3,t:'k . h k h . | k . h k s .'}]}),
 deep:mkSong({bpm:66,loop:1,ch:[
  {w:'triangle',v:.46,t:'E4 - - - G4 - B4 - | A4 - - - - - E4 - | F#4 - - - A4 - C5 - | B4 - - - - - - - | E4 - - - G4 - B4 - | D5 - - - C5 - B4 - | A4 - G4 - F#4 - G4 - | E4 - - - - - - -'},
  {w:'sine',v:.22,t:'E3 - B3 - E3 - B3 - | A2 - E3 - A2 - E3 - | F#2 - C#3 - F#2 - C#3 - | B2 - F#3 - B2 - F#3 -'},
  {w:'sine',v:.12,t:'B5 - - - - - - - | . - - - G5 - - - | A5 - - - - - - - | . - - - F#5 - - -'},
  {d:1,v:.14,t:'k . . . h . . . | . . . . h . . .'}]}),
 deepBattle:mkSong({bpm:152,loop:1,ch:[
  {w:'square',v:.10,t:'E5 - G5 E5 - B5 | A5 - F#5 D5 - - | E5 - G5 E5 - B5 | C6 - B5 A5 - - | B5 - A5 G5 - E5 | F#5 - G5 A5 - - | G5 - B5 D6 - F#6 | E6 - - E5 - -'},
  {w:'triangle',v:.52,t:'E2 E3 E2 E2 E3 E2 | A2 A3 A2 A2 A3 A2 | F#2 F#3 F#2 F#2 F#3 F#2 | B2 B3 B2 B2 B3 B2'},
  {w:'sine',v:.1,t:'E4 G4 B4 E4 G4 B4 | A3 C4 E4 A3 C4 E4 | F#3 A3 C#4 F#3 A3 C#4 | B3 D#4 F#4 B3 D#4 F#4'},
  {d:1,v:.5,t:'k . h k s h | k . h k s s'}]}),
 deepBoss:mkSong({bpm:140,loop:1,ch:[
  {w:'sawtooth',v:.07,dist:1,t:'E2 E2 . E2 G2 . Bb2 Bb2 | A2 A2 . A2 E2 . A2 A2 | C2 C2 . C2 Eb2 . G2 G2 | B1 B1 . B1 D2 . F#2 F#2'},
  {w:'triangle',v:.5,t:'E5 - - - D5 - Bb4 - | A4 - - - C5 - E5 - | G4 - Bb4 - Eb5 - D5 - | B4 - - - F#4 - - - | E5 - G5 - Bb5 - A5 - | G5 - - - E5 - - - | Eb5 - D5 - C5 - Bb4 - | B4 - - - - - - -'},
  {w:'sine',v:.14,t:'E4 Bb4 E5 Bb4 E4 Bb4 E5 Bb4 | A3 E4 A4 E4 A3 E4 A4 E4'},
  {d:1,v:.55,t:'k h s h k k s h | k h s h k s s c'}]}),
 ngoy:mkSong({bpm:138,loop:1,ch:[
  {w:'sawtooth',v:.085,dist:1,t:'E2 E2 . E2 G2 . E2 E2 | D2 D2 . D2 A2 . D2 D2 | C2 C2 . C2 G2 . C2 C2 | B1 B1 . B1 D2 . B1 B1 | E2 E2 . E2 G2 . E2 E2 | D2 D2 . D2 A2 . D2 D2 | C2 C2 . C2 G2 . C2 C2 | B1 B1 B1 B1 B2 B2 B2 B2'},
  {w:'sawtooth',v:.055,dist:1,t:'E4 - G4 - B4 - A4 G4 | D4 - F#4 - A4 - G4 F#4 | C4 - E4 - G4 - A4 B4 | B3 - D4 - F#4 - A4 B4 | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . .'},
  {w:'sawtooth',v:.07,dist:1,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | E5 G5 B5 E6 D6 B5 G5 E5 | F#5 A5 D6 F#6 E6 D6 A5 F#5 | G5 A5 B5 C6 B5 A5 G5 E5 | F#5 G5 A5 B5 A#5 B5 D#6 F#6'},
  {w:'square',v:.035,t:'. . E5 . . . G5 . | . . D5 . . . F#5 . | . . C5 . . . E5 . | . . B4 . . . D#5 .'},
  {d:1,v:.5,t:'k k h k s k h k | k k h k s k h h | k k h k s k h k | k k h k s s h h'}]}),
 ngoyBattle:mkSong({bpm:184,loop:1,ch:[
  {w:'sawtooth',v:.09,dist:1,t:'E2 E2 E2 G2 E2 E2 | C2 C2 C2 D2 C2 C2 | E2 E2 E2 G2 E2 E2 | A2 A2 G2 F#2 F2 F2 | E2 E2 E2 G2 E2 E2 | C2 C2 C2 D2 C2 C2 | D2 D2 D2 F2 D2 D2 | B1 B1 B2 B1 B2 B2'},
  {w:'square',v:.11,t:'E6 - B5 E6 - G6 | F#6 - D6 B5 - - | E6 - B5 E6 - G6 | A6 - G6 F#6 - - | . . . . . . | . . . . . . | . . . . . . | . . . . . .'},
  {w:'sawtooth',v:.075,dist:1,t:'. . . . . . | . . . . . . | . . . . . . | . . . . . . | E5 G5 B5 D6 B5 G5 | A5 C6 E6 G6 E6 C6 | D6 F6 A6 F6 D6 A5 | B5 D#6 F#6 A6 B6 D#7'},
  {w:'sawtooth',v:.05,dist:1,t:'E4 G4 B4 E4 G4 B4 | C4 E4 G4 C4 E4 G4 | E4 G4 B4 E4 G4 B4 | A3 C4 E4 B3 D#4 F#4'},
  {d:1,v:.6,t:'k k s k k k | k k s k k s | k k s k k k | k s k s k s'}]}),
 ngoyBoss:mkSong({bpm:150,loop:1,ch:[
  {w:'sawtooth',v:.09,dist:1,t:'E2 E2 . E2 Bb2 . E2 E2 | E2 E2 . E2 A2 . G2 G2 | C2 C2 . C2 F#2 . C2 C2 | B1 B1 . B1 Bb1 . B1 B1 | E2 E2 . E2 Bb2 . E2 E2 | E2 E2 . E2 A2 . G2 G2 | F2 F2 . F2 B2 . F2 F2 | B1 B1 B1 Bb1 B1 B1 Bb1 B1'},
  {w:'sawtooth',v:.06,dist:1,t:'E5 - - Bb4 - - G4 - | A4 - - - G4 - F4 - | E4 - G4 - Bb4 - Db5 - | C5 - - B4 - - - - | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . .'},
  {w:'sawtooth',v:.075,dist:1,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | E5 F5 E5 Bb4 E5 G5 F#5 G5 | A5 Bb5 A5 G5 F5 E5 Db5 C5 | B4 C5 Db5 D5 Eb5 E5 F5 F#5 | G5 F#5 F5 E5 Bb4 B4 E5 E5'},
  {w:'square',v:.04,t:'E4 Bb4 E5 Bb4 E4 Bb4 E5 Bb4 | C4 G4 C5 G4 C4 G4 C5 G4'},
  {d:1,v:.6,t:'k h s h k k s h | k h s h k s s c'}]}),
 yewenBoss:mkSong({bpm:176,loop:1,ch:[
  {w:'sawtooth',v:.11,dist:2,det:9,t:'E2 - - - . . E2 E2 | F2 - - - . . F2 F2 | E2 - - - . . G2 G2 | F2 - - - D#2 - - - | E2 E2 . E2 E2 . E2 F2 | E2 E2 . E2 G2 . F2 E2 | E2 E2 . E2 E2 . E2 F2 | A#1 - . A#1 B1 - . B1 | E2 E2 . E2 E2 . E2 F2 | E2 E2 . E2 G2 . F2 E2 | E2 E2 . E2 E2 . E2 F2 | C2 C2 . C2 D2 D2 D#2 - | E2 E2 E2 E2 E2 E2 E2 E2 | C2 C2 C2 C2 C2 C2 C2 C2 | D2 D2 D2 D2 D2 D2 D2 D2 | B1 B1 B1 B1 B1 B1 B1 B1 | E2 E2 E2 E2 E2 E2 E2 E2 | C2 C2 C2 C2 C2 C2 C2 C2 | A1 A1 A1 A1 A1 A1 A1 A1 | B1 B1 B1 B1 B1 B1 B1 B1 | E2 E2 E2 E2 E2 E2 E2 E2 | E2 E2 E2 E2 E2 E2 E2 E2 | C2 C2 C2 C2 C2 C2 C2 C2 | C2 C2 C2 C2 C2 C2 C2 C2 | A1 A1 A1 A1 A1 A1 A1 A1 | A1 A1 A1 A1 A1 A1 A1 A1 | B1 B1 B1 B1 B1 B1 B1 B1 | B1 B1 B1 B1 B1 B1 B1 B1'},
  {w:'sawtooth',v:.07,dist:2,det:-7,t:'B2 - - - . . B2 B2 | C3 - - - . . C3 C3 | B2 - - - . . D3 D3 | C3 - - - A#2 - - - | B2 B2 . B2 B2 . B2 C3 | B2 B2 . B2 D3 . C3 B2 | B2 B2 . B2 B2 . B2 C3 | F2 - . F2 F#2 - . F#2 | B2 B2 . B2 B2 . B2 C3 | B2 B2 . B2 D3 . C3 B2 | B2 B2 . B2 B2 . B2 C3 | G2 G2 . G2 A2 A2 A#2 - | B2 B2 B2 B2 B2 B2 B2 B2 | G2 G2 G2 G2 G2 G2 G2 G2 | A2 A2 A2 A2 A2 A2 A2 A2 | F#2 F#2 F#2 F#2 F#2 F#2 F#2 F#2 | B2 B2 B2 B2 B2 B2 B2 B2 | G2 G2 G2 G2 G2 G2 G2 G2 | E2 E2 E2 E2 E2 E2 E2 E2 | F#2 F#2 F#2 F#2 F#2 F#2 F#2 F#2 | B2 B2 B2 B2 B2 B2 B2 B2 | B2 B2 B2 B2 B2 B2 B2 B2 | G2 G2 G2 G2 G2 G2 G2 G2 | G2 G2 G2 G2 G2 G2 G2 G2 | E2 E2 E2 E2 E2 E2 E2 E2 | E2 E2 E2 E2 E2 E2 E2 E2 | F#2 F#2 F#2 F#2 F#2 F#2 F#2 F#2 | F#2 F#2 F#2 F#2 F#2 F#2 F#2 F#2'},
  {w:'sawtooth',v:.075,dist:2,det:5,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | B4 C5 D#5 E5 F5 G5 A5 B5 | E4 - - - F4 - E4 - | D#4 - - - B3 - - - | E4 - - - G4 - F4 - | E4 - - - - - - - | B4 - - - C5 - B4 - | A#4 - - - F4 - - - | G4 - F4 - E4 - D#4 - | E4 - - - - - - - | B4 - E5 - G5 - - F#5 | E5 - - - D5 - C5 - | D5 - F#5 - A5 - - G5 | F#5 - - - D#5 - - - | E5 - G5 - B5 - - A5 | G5 - - - E5 - G5 - | A5 - G5 - F#5 - E5 - | D#5 - - - F#5 - B5 - | E5 G5 B5 E6 B5 G5 E5 B4 | E5 G5 B5 E6 G6 E6 B5 G5 | C5 E5 G5 C6 G5 E5 C5 G4 | C5 E5 G5 C6 E6 C6 G5 E5 | A4 C5 E5 A5 E5 C5 A4 E4 | A4 C5 E5 A5 C6 A5 E5 C5 | B4 D#5 F#5 B5 F#5 D#5 B4 F#4 | B5 A5 G5 F#5 E5 D#5 E5 F5'},
  {w:'sawtooth',v:.05,dist:2,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | B3 - - - C4 - B3 - | B3 - - - G3 - - - | B3 - - - D4 - C4 - | B3 - - - - - - - | G4 - - - A4 - G4 - | F#4 - - - D4 - - - | E4 - D4 - C4 - B3 - | B3 - - - - - - - | G4 - B4 - E5 - - D5 | C5 - - - B4 - A4 - | A4 - D5 - F#5 - - E5 | D#5 - - - B4 - - - | B4 - E5 - G5 - - F#5 | E5 - - - C5 - E5 - | E5 - E5 - D#5 - C5 - | B4 - - - D#5 - F#5 - | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . .'},
  {w:'triangle',v:.42,t:'E2 - - - - - - - | F2 - - - - - - - | E2 - - - - - - - | F2 - - - D#2 - - - | E2 . E2 . E2 . E2 . | E2 . E2 . E2 . E2 . | E2 . E2 . E2 . E2 . | A#1 . A#1 . B1 . B1 . | E2 . E2 . E2 . E2 . | E2 . E2 . E2 . E2 . | E2 . E2 . E2 . E2 . | C2 . C2 . D2 . D#2 . | E3 E2 E3 E2 E3 E2 E3 E2 | C3 C2 C3 C2 C3 C2 C3 C2 | D3 D2 D3 D2 D3 D2 D3 D2 | B2 B1 B2 B1 B2 B1 B2 B1 | E3 E2 E3 E2 E3 E2 E3 E2 | C3 C2 C3 C2 C3 C2 C3 C2 | A2 A1 A2 A1 A2 A1 A2 A1 | B2 B1 B2 B1 B2 B1 B2 B1 | E2 E2 E2 E2 E2 E2 E2 E2 | E2 E2 E2 E2 E2 E2 E2 E2 | C2 C2 C2 C2 C2 C2 C2 C2 | C2 C2 C2 C2 C2 C2 C2 C2 | A1 A1 A1 A1 A1 A1 A1 A1 | A1 A1 A1 A1 A1 A1 A1 A1 | B1 B1 B1 B1 B1 B1 B1 B1 | B1 B1 B1 B1 B1 B1 B1 B1'},
  {w:'square',v:.032,t:'E4 - - - - - - - | F4 - - - - - - - | G4 - - - - - - - | F#4 - - - - - - - | E3 - - - - - - - | E3 - - - - - - - | G3 - - - - - - - | F#3 - - - - - - - | E3 - - - - - - - | F3 - - - - - - - | G3 - - - - - - - | B3 - - - - - - - | G4 - - - - - - - | G4 - - - - - - - | F#4 - - - - - - - | F#4 - - - - - - - | G4 - - - - - - - | G4 - - - - - - - | E4 - - - - - - - | D#4 - - - - - - - | E4 - - - - - - - | B4 - - - - - - - | E4 - - - - - - - | G4 - - - - - - - | E4 - - - - - - - | C5 - - - - - - - | D#4 - - - - - - - | F#4 - - - - - - -'},
  {d:1,v:.62,t:'c . . . . . k k | c . . . . . k k | c . . . . . k k | k k s k k s s s | c k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k s s s s | c k s k k k s k | k k s k k k s k | k k s k k k s k | k k s k k s k s | c k s k k k s k | k k s k k k s k | k k s k k k s k | k s k s s s s s | c s k s k s k s | k s k s k s k s | k s k s k s k s | k s k s k s k s | k s k s k s k s | k s k s k s k s | k s k s k s k s | s s s s s s s s'}]}),
 ngoyFinal:mkSong({bpm:164,loop:1,ch:[
  {w:'sawtooth',v:.085,dist:1,t:'E2 E2 . E2 C2 C2 . C2 | D2 D2 . D2 B1 B1 . B1 | A1 A1 . A1 C2 C2 . C2 | D2 D2 D2 D2 B1 B1 B1 B1 | E2 E2 . E2 C2 C2 . C2 | D2 D2 . D2 B1 B1 . B1 | A1 A1 . A1 C2 C2 . C2 | D2 D2 D2 D2 B1 B1 B1 B1 | E2 . . . E2 . . . | C2 . . . C2 . . . | A1 A1 . A1 B1 B1 . B1 | E2 E2 E2 E2 E2 E2 E2 E2'},
  {w:'sawtooth',v:.06,dist:1,t:'B4 - E5 - G5 - F#5 E5 | D5 - - C5 B4 - - - | A4 - C5 - E5 - G5 F#5 | F#5 - - - B4 - - - | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | G5 - - - F#5 - - - | E5 - - - D5 - - - | C5 - B4 - A4 - B4 - | B4 - - - - - - -'},
  {w:'sawtooth',v:.075,dist:1,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | E5 G5 B5 E6 G6 E6 B5 G5 | F#5 A5 D6 F#6 A6 F#6 D6 A5 | A5 C6 E6 A6 G6 E6 C6 A5 | B5 D#6 F#6 B6 A6 F#6 D#6 B5 | E6 - D6 E6 G6 - F#6 G6 | B6 - A6 G6 F#6 - E6 D6 | C6 D6 E6 G6 A6 B6 C7 E7 | B6 - - - - - - -'},
  {w:'sawtooth',v:.055,dist:1,t:'. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | G5 B5 D6 G6 B6 G6 D6 B5 | A5 C6 F6 A6 C7 A6 F6 C6 | C6 E6 G6 C7 B6 G6 E6 C6 | D#6 F#6 B6 D#7 C7 B6 F#6 D#6 | G6 - F#6 G6 B6 - A6 B6 | D7 - C7 B6 A6 - G6 F6 | E6 F6 G6 B6 C7 D7 E7 G7 | D#7 - - - - - - -'},
  {w:'triangle',v:.4,t:'E3 - - - C3 - - - | D3 - - - B2 - - - | A2 - - - C3 - - - | D3 - - - B2 - - -'},
  {d:1,v:.6,t:'k k h k s k h k | k k h k s k s s | k k h k s k h k | k s s k s s k s'}]}),
  winS:mkSong({bpm:190,loop:0,ch:[
  {w:'sawtooth',v:.09,dist:1,t:'E4 - E4 - G4 A4 B4 - | E5 - B4 C5 E5 - - - | . . . .'},
  {w:'sawtooth',v:.07,dist:1,t:'B3 - B3 - D4 E4 F#4 - | G4 - F#4 G4 B4 - - - | . . . .'},
  {w:'square',v:.08,t:'. . . . . . . . | E6 - B5 C6 E6 - - - | . . . .'},
  {w:'triangle',v:.5,t:'E2 - E2 - G2 A2 B2 - | E3 - B2 C3 E3 - - - | . . . .'},
  {d:1,v:.6,t:'c k s k k k s s | c . k . c . . . | . . . .'}]}),
 win:mkSong({bpm:190,loop:0,ch:[
  {w:'sawtooth',v:.09,dist:1,t:'E3 E3 E3 E3 E3 E3 G3 A3 | C4 C4 C4 C4 B3 B3 A3 B3 | E3 E3 E3 E3 E3 E3 G3 A3 | D4 D4 D4 D4 C4 C4 B3 C4 | A3 A3 B3 B3 C4 C4 D4 D4 | E4 - C4 - D4 - B3 - | E4 - - - - - - - | . . . .'},
  {w:'sawtooth',v:.08,dist:1,t:'B3 B3 B3 B3 B3 B3 D4 E4 | G4 G4 G4 G4 F#4 F#4 E4 F#4 | B3 B3 B3 B3 B3 B3 D4 E4 | A4 A4 A4 A4 G4 G4 F#4 G4 | E4 E4 F#4 F#4 G4 G4 A4 A4 | B4 - G4 - A4 - F#4 - | B4 - - - - - - - | . . . .'},
  {w:'sawtooth',v:.06,dist:1,t:'. . . . . . . . | E5 - D5 E5 G5 - E5 - | B4 - - - C5 D5 E5 G5 | A5 - G5 A5 B5 - A5 G5 | E5 F#5 G5 A5 B5 C6 D6 B5 | E6 - C6 - D6 - B5 - | E6 - - - - - - - | . . . .'},
  {w:'square',v:.1,t:'E6 - - - . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . E6 F#6 G6 A6 | B6 - G6 - A6 - F#6 - | B6 - - - - - - - | . . . .'},
  {w:'triangle',v:.55,t:'E2 E2 E2 E2 E2 E2 G2 A2 | C3 C3 C3 C3 B2 B2 A2 B2 | E2 E2 E2 E2 E2 E2 G2 A2 | D3 D3 D3 D3 C3 C3 B2 C3 | A2 A2 B2 B2 C3 C3 D3 D3 | E3 - C3 - D3 - B2 - | E2 - - - - - - - | . . . .'},
  {d:1,v:.6,t:'c k s k k k s k | c k s k k k s s | c k s k k k s k | c k s k s k s s | c s k s k s k s | c k s k c k s k | c . . . k . k k | . . . .'}]})
};

/* ---------- region ambience: quiet loops under the music ---------- */
const AMB={cur:null,nodes:[],timers:[]};
function stopAmb(){for(const t of AMB.timers)clearInterval(t);AMB.timers=[];
  for(const n of AMB.nodes){try{n.stop&&n.stop()}catch(e){}try{n.disconnect&&n.disconnect()}catch(e){}}
  AMB.nodes=[];AMB.cur=null}
const _nt=()=>(typeof dayPhase==='function'&&dayPhase().name==='night')?'-n':'';   // the city sounds different after dark
function ambVol(v){if(AMB.g&&AU.c)AMB.g.gain.setTargetAtTime(v,AU.c.currentTime,.4)}
function ambFor(bg){if(bg==='coast'&&typeof CUR!=='undefined'&&(CUR==='lof'||(M&&M.interior)))return 'wavesSoft';return({coast:'waves',field:'meadow',forest:'forest',rainforest:'forest',mawida:'forest',
  mount:'wind',fjord:'wind',pampa:'pampa',waria:'city'+_nt(),feria:'feria'+_nt(),blocks:'blocks'+_nt(),metro:'metro',deep:'under',cave:'cave',cave2:'cave',cave3:'cave',cave4:'cave',cave5:'cave'})[bg]||'night'}
function playAmb(kind){
  if(AMB.cur===kind)return;stopAmb();if(!kind)return;const full=kind,wxl=kind.split('|')[1];kind=kind.split('|')[0];
  if(!AU.c)return; // starts once audio is unlocked; next map change retries
  AMB.cur=full;const c=AU.c,g=c.createGain();g.connect(AU.m);AMB.nodes.push(g);AMB.g=g;
  const night=/-n$/.test(kind);kind=kind.replace(/-n$/,'');
  const noise=(fq,q,vol,lfoHz,lfoAmt)=>{const src=c.createBufferSource();src.buffer=AU.noise;src.loop=true;
    const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fq;f.Q.value=q;
    const ng=c.createGain();ng.gain.value=vol;src.connect(f);f.connect(ng);ng.connect(g);
    if(lfoHz){const lf=c.createOscillator(),lg=c.createGain();lf.frequency.value=lfoHz;lg.gain.value=vol*lfoAmt;
      lf.connect(lg);lg.connect(ng.gain);lf.start();AMB.nodes.push(lf,lg)}
    src.start();AMB.nodes.push(src,f,ng);return ng};
  const chirp=(f0,f1,dur,vol)=>{try{const o=c.createOscillator(),og=c.createGain();o.type='sine';
    const t=c.currentTime;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
    og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(vol,t+dur*.3);og.gain.linearRampToValueAtTime(0,t+dur);
    o.connect(og);og.connect(g);o.start(t);o.stop(t+dur+.02)}catch(e){}};
  g.gain.value=.5;
  if(wxl==='mawun'){noise(2600,.5,.018,.2,.3);noise(800,.7,.012,.1,.4)}
  else if(wxl==='kuruf'){noise(320,.9,.028,.07,.9);noise(1000,1.2,.008,.17,.9)}
  if(kind==='waves'){noise(420,.6,.028,.11,.8);noise(1400,.8,.012,.07,.9)}
  else if(kind==='wavesSoft'){noise(420,.6,.014,.11,.8);noise(1400,.8,.004,.07,.9)}   // the Lafkenche lof: the sea further off, the wind softer
  else if(kind==='wind'){noise(300,.9,.03,.05,.85);noise(900,1.4,.008,.13,.9)}
  else if(kind==='meadow'){noise(1100,1.2,.006,.09,.7);
    AMB.timers.push(setInterval(()=>{if(Math.random()<.5){const b=2200+Math.random()*1200;
      chirp(b,b*1.3,.09,.05);setTimeout(()=>chirp(b*1.15,b*.9,.07,.04),120)}},1700))}
  else if(kind==='forest'){noise(700,1.1,.012,.06,.8);
    AMB.timers.push(setInterval(()=>{if(Math.random()<.4){const b=1800+Math.random()*1500;
      chirp(b,b*1.25,.1,.045);setTimeout(()=>chirp(b*1.1,b*.85,.08,.035),140)}},2300))}
  else if(kind==='pampa'){noise(380,.8,.022,.06,.85);
    AMB.timers.push(setInterval(()=>{if(Math.random()<.3){const b=2400+Math.random()*900;chirp(b,b*1.2,.08,.035)}},2900))}
  else if(kind==='under'){noise(260,1.6,.03,.05,.9);
    AMB.timers.push(setInterval(()=>{if(Math.random()<.6){chirp(140+Math.random()*120,380+Math.random()*220,.25,.03)}},1400))}
  else if(kind==='cave'){noise(140,1.2,.03,.04,.8);
    AMB.timers.push(setInterval(()=>{if(Math.random()<.4){chirp(900+Math.random()*500,300,.12,.04)}},3100))}
  else if(kind==='city'||kind==='feria'||kind==='blocks'){
    // ---- Santiago: traffic, horns, buses, dogs, a far siren; the feria's crowd and pregones; music from a flat in the blocks
    const t0=()=>c.currentTime,R_=Math.random;
    const swoosh=(dur,vol,f0,f1)=>{try{const src=c.createBufferSource();src.buffer=AU.noise;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;
      const og=c.createGain(),t=t0();f.frequency.setValueAtTime(f0,t);f.frequency.linearRampToValueAtTime(f1,t+dur*.55);f.frequency.linearRampToValueAtTime(f0*.8,t+dur);
      og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(vol,t+dur*.5);og.gain.linearRampToValueAtTime(0,t+dur);src.connect(f);f.connect(og);og.connect(g);src.start(t);src.stop(t+dur+.05)}catch(e){}};
    const tone=(type,fq,dur,vol,lp,at)=>{try{const o=c.createOscillator(),og=c.createGain(),f=c.createBiquadFilter();o.type=type;f.type='lowpass';f.frequency.value=lp||1800;const t=t0()+(at||0);
      o.frequency.setValueAtTime(fq,t);og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(vol,t+.02);og.gain.setValueAtTime(vol,t+dur*.8);og.gain.linearRampToValueAtTime(0,t+dur);
      o.connect(f);f.connect(og);og.connect(g);o.start(t);o.stop(t+dur+.05)}catch(e){}};
    const glide=(type,f0,f1,dur,vol,lp,at)=>{try{const o=c.createOscillator(),og=c.createGain(),f=c.createBiquadFilter();o.type=type;f.type='lowpass';f.frequency.value=lp||1600;const t=t0()+(at||0);
      o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(vol,t+dur*.15);og.gain.linearRampToValueAtTime(0,t+dur);
      o.connect(f);f.connect(og);og.connect(g);o.start(t);o.stop(t+dur+.05)}catch(e){}};
    const hiss=(dur,vol,at)=>{try{const src=c.createBufferSource();src.buffer=AU.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=3200;const og=c.createGain(),t=t0()+(at||0);
      og.gain.setValueAtTime(vol,t);og.gain.exponentialRampToValueAtTime(.0005,t+dur);src.connect(f);f.connect(og);og.connect(g);src.start(t);src.stop(t+dur+.05)}catch(e){}};
    const horn=()=>{const b=360+R_()*140,n=R_()<.4?2:1;for(let i=0;i<n;i++){tone('square',b,.22,.014,1400,i*.3);tone('square',b*1.26,.22,.01,1400,i*.3)}};
    const bark=()=>{const n=1+Math.floor(R_()*3),b=260+R_()*160;for(let i=0;i<n;i++){glide('sawtooth',b*1.3,b*.8,.11,.02,900,i*.22);hiss(.06,.004,i*.22)}};
    const siren=()=>{try{const o=c.createOscillator(),og=c.createGain(),t=t0(),f=c.createBiquadFilter();o.type='triangle';f.type='lowpass';f.frequency.value=1200;
      for(let i=0;i<4;i++){o.frequency.setValueAtTime(640,t+i*1.6);o.frequency.linearRampToValueAtTime(900,t+i*1.6+.8);o.frequency.linearRampToValueAtTime(640,t+i*1.6+1.6)}
      og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(.008,t+2);og.gain.linearRampToValueAtTime(0,t+6.4);o.connect(f);f.connect(og);og.connect(g);o.start(t);o.stop(t+6.5)}catch(e){}};
    const moto=()=>{glide('sawtooth',70,150,2.2,.012,500)};
    const bus=()=>{swoosh(3.2,.03,120,320);hiss(.7,.012,2.4)};
    // the bed: a low rumble of traffic that swells and fades, and the hum of the city
    noise(110,.6,night?.012:.024,.05,.8);noise(420,.8,night?.004:.01,.09,.9);noise(2600,1.3,.003,.15,.9);
    if(kind==='feria'&&!night){noise(700,.5,.016,.13,.9);noise(1500,.9,.006,.21,.9)}       // the crowd: many voices, no words
    AMB.timers.push(setInterval(()=>{const r=R_();
      if(r<(night?.12:.32))swoosh(1.8+R_()*1.4,night?.014:.024,260+R_()*120,700+R_()*500);   // a car going by
      else if(r<(night?.15:.40))horn();
      else if(r<(night?.18:.45))bus();
      else if(r<(night?.30:.52))bark();
      else if(r<(night?.34:.56))moto();
      else if(r<(night?.37:.58))siren()},1500));
    if(kind==='feria'&&!night)AMB.timers.push(setInterval(()=>{if(R_()<.55){   // a vendor's pregón: a sing-song call rising and falling
      const b=220+R_()*90,seq=[[1,.22],[1.33,.18],[1.5,.3],[1.33,.18],[1,.4]];let at=0;for(const [m,d] of seq){glide('triangle',b*m,b*m*.98,d,.018,1400,at);at+=d*.9}}},2600));
    if(kind==='blocks')AMB.timers.push(setInterval(()=>{if(R_()<(night?.6:.35)){   // cumbia leaking from an open window: a thump, a güiro, a bass line
      const bpm=.42,bass=[98,98,123,110];for(let i=0;i<8;i++){glide('sine',90,45,.12,.03,300,i*bpm);if(i%2)hiss(.08,.004,i*bpm+bpm*.5);tone('triangle',bass[i%4],bpm*.8,.012,500,i*bpm)}}},4200));
    if(night)AMB.timers.push(setInterval(()=>{if(R_()<.5){const b=3300+R_()*500;chirp(b,b*1.04,.06,.015);setTimeout(()=>chirp(b,b*1.04,.06,.012),110)}},1300))}
  else if(kind==='metro'){noise(70,.8,.03,.03,.8);noise(240,1.1,.008,.06,.9);
    // the Metro: the tunnel breathing, a train coming in with its rumble and squeal, the door chime, footsteps
    AMB.timers.push(setInterval(()=>{if(Math.random()<.45){const t=c.currentTime;try{const src=c.createBufferSource();src.buffer=AU.noise;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(120,t);f.frequency.linearRampToValueAtTime(600,t+3);f.frequency.linearRampToValueAtTime(150,t+6);
        const og=c.createGain();og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(.05,t+3);og.gain.linearRampToValueAtTime(0,t+6);src.connect(f);f.connect(og);og.connect(g);src.start(t);src.stop(t+6.1)}catch(e){}
      setTimeout(()=>{chirp(2600,2400,.4,.012)},2600);
      setTimeout(()=>{for(const [i,fq] of [[0,880],[1,698],[2,587]].map(a=>a)){setTimeout(()=>chirp(fq,fq*.995,.35,.025),i*260)}},3600)}},9000));
    AMB.timers.push(setInterval(()=>{if(Math.random()<.5)for(let i=0;i<4;i++)setTimeout(()=>chirp(180,120,.04,.02),i*280)},2300))}
  else if(kind==='night'){AMB.timers.push(setInterval(()=>{if(Math.random()<.7){const b=3300+Math.random()*500;
    chirp(b,b*1.04,.06,.03);setTimeout(()=>chirp(b,b*1.04,.06,.025),110);setTimeout(()=>chirp(b,b*1.04,.06,.02),220)}},900))}
}
/* ---------- the battle songs in a Mapuche cadence: each pair of steps swings long-short (a ternary pulse),
   the kultrun beats that gallop under everything, kaskawilla on the beat, and the trutruka calls at the top of each loop.
   The tune itself is the same; the drum kit steps back. ---------- */
// only the boss songs: the ordinary battle songs went back to their original versions (Brandon, Nov 2026)
const KULTRUN_SONGS=['boss','nagBoss','pewBoss','wilBoss','puelBoss','deepBoss','ngoyBoss','ngoyFinal','yewenBoss','stgoBoss1','stgoBoss2','stgoBoss3'];
(function kultrunize(){
  // every beat of the old 4/4 tunes (two steps) becomes one kultrun beat of six fast subdivisions: the tune lands long-short (4+2),
  // the kultrun strikes long-short under it, and new layers fill the six: a galloping distorted guitar, a running arpeggio, a shaker, kaskawilla
  const pos=i=>Math.floor(i/2)*6+(i%2?4:0);
  const conv=c=>{const at={};for(const k in c.at){const i=+k;at[pos(i)]=c.at[k].map(e=>({n:e.n,len:Math.max(1,pos(i+e.len)-pos(i))}))}return{at,len:c.len/2*6}};
  const FIF={C:'G',Db:'Ab','C#':'G#',D:'A',Eb:'Bb','D#':'A#',E:'B',F:'C',Gb:'Db','F#':'C#',G:'D',Ab:'Eb','G#':'D#',A:'E',Bb:'F','A#':'F',B:'F#'};
  const oct=(n,d)=>{const m=/^([A-G][#b]?)(\d)$/.exec(n);return m?m[1]+Math.max(1,Math.min(6,+m[2]+d)):n};
  for(const n of KULTRUN_SONGS){const so=SONGS[n];if(!so||so.kul)continue;so.kul=1;
    const odd=so.ch.some(c=>c.t.split('|')[0].trim().split(/\s+/).length%2);
    if(n==='stgoBoss3'||odd){                       // the chonchón keeps the swung version Brandon liked; the 7/8 spider keeps its limp
      if(n==='stgoBoss3'){so.tern=1;so.bpm=Math.round(so.bpm*.85)}else so.bpm=Math.round(so.bpm*.92);
      for(const c of so.ch)if(c.d)c.v*=.7;
      const bars=Math.max(1,Math.round(so.len/(odd?7:8))),bl=odd?7:8;
      const add=(o,t)=>so.ch.push(Object.assign(o,parseTrack(t)));
      add({d:1,v:.62},Array(bars).fill(odd?'K . u K . u u':'K u K u K u K u').join(' | '));add({d:1,v:.5},Array(bars).fill(odd?'j . . j . . .':'j . j . j . j .').join(' | '));
      so.len=Math.max(...so.ch.map(c=>c.len));continue}
    const bass=so.ch.find(c=>c.w==='triangle')||so.ch.find(c=>!c.d);
    const L=so.len/2*6;
    // the bass note under each beat, from the old bass line
    const beats=so.len/2,roots=[];let last=(bass.t.match(/[A-G][#b]?\d/)||['E2'])[0];
    for(let b=0;b<beats;b++){for(const i of [2*b,2*b+1]){const ev=bass.at[i%bass.len];if(ev&&ev[0])last=ev[0].n;if(i===2*b)roots[b]=last}}
    const hadGtr=so.ch.some(c=>c.dist===2);
    so.ch=so.ch.filter(c=>!(c.d&&false)).map(c=>{const k=conv(c);if(c.d){for(const q in k.at)k.at[q]=k.at[q].filter(e=>e.n!=='h');c.v*=.7}return Object.assign(c,k)});
    for(const c of so.ch)if(!c.d&&(c.w==='square'||c.w==='sawtooth')&&!c.dist)c.dist=1;
    const mk=(o,fn)=>{const at={};for(let i=0;i<L;i++){const e=fn(i);if(e)at[i]=[e]}so.ch.push(Object.assign(o,{at,len:L}))};
    const R=i=>roots[Math.floor(i/6)%beats];
    const nb=nn=>nn.replace(/\d/,''),r2=i=>{const r=R(i);return /\d/.test(r)&&+r.slice(-1)>=3?oct(r,-1):r};
    if(!hadGtr){const G=[0,1,2,4,5];   // a metal gallop, palm-muted: da-da-da . da-da, on a power chord (root, fifth, octave)
      mk({w:'sawtooth',v:.095,dist:2},i=>G.includes(i%6)?{n:r2(i),len:1}:null);
      mk({w:'sawtooth',v:.065,dist:2},i=>G.includes(i%6)?{n:FIF[nb(r2(i))]+(+r2(i).slice(-1)),len:1}:null);
      mk({w:'sawtooth',v:.045,dist:2,det:4},i=>i%6===0?{n:oct(r2(i),1),len:3}:null)}
    for(const c of so.ch)if(!c.d&&c.dist===1&&c.w==='square'){c.dist=2;c.v*=.8}            // the lead through the same heavy amp
    mk({d:1,v:.28},i=>i%6===1||i%6===2?{n:'k',len:1}:null);                             // double kick in the gaps, so the kultrun keeps its long-short
    mk({d:1,v:.5},i=>i%24===0?{n:'c',len:1}:null);                                     // a crash on every bar
    const AR=[0,7,12,7,12,19];      // a running arpeggio on every other subdivision (lighter for phones): root, octave, octave
    mk({w:'square',v:.026,dist:1},i=>{if(i%2)return null;const r=R(i),m=/^([A-G][#b]?)(\d)$/.exec(r);if(!m)return null;const f=nf(m[1]+(+m[2]+2))*Math.pow(2,AR[i%6]/12);
      const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],mi=Math.round(12*Math.log2(f/440))+69;return{n:names[mi%12]+(Math.floor(mi/12)-1),len:1}});
    const KV=n==='battle'?.85:1.25;                                                     // where guitars and bass crowd it, the kultrun comes forward
    mk({d:1,v:KV,kul:1,lite:1},i=>i%6===0?{n:'K',len:1}:i%6===4?{n:'u',len:1}:null);             // kultrun: long-short
    if(n!=='battle')for(const c of so.ch)if(c.dist===2)c.v*=.85;
    mk({d:1,v:.5,lite:1},i=>i%6===0||i%6===3?{n:'j',len:1}:null);                            // kaskawilla
    mk({d:1,v:.26},i=>i%2?{n:'h',len:1}:null);                                      // shaker on the subdivisions
    const bars=Math.max(1,Math.round(L/24)),root=nb(roots[0]||'E2');
    mk({w:'trut',v:.075},i=>{const b=Math.floor(i/24),k=i%24;if(b===0&&k===0)return{n:root+'3',len:16};if(b===0&&k===16)return{n:FIF[root]+'3',len:8};if(b===1&&k===0)return{n:root+'4',len:20};
      if(b===Math.floor(bars/2)&&k===0)return{n:FIF[root]+'3',len:10};if(b===Math.floor(bars/2)&&k===12)return{n:root+'4',len:12};return null});
    mk({d:1,v:.5},i=>Math.floor(i/24)%4===3&&(i%24===20||i%24===22)?{n:'p',len:1}:null);   // pifilka
    const isBoss=n==='boss'||/Boss|Final/.test(n);so.bpm=n==='wilBattle'?376:isBoss?399:409;   // the approved speeds: battles 409 (a kultrun beat every 0.44 s), bosses 399, the Williche battle 376          // a kultrun beat of about 0.9 s (battles) / 0.8 s (bosses), six notes in each
    so.len=L}})();
for(const n of KULTRUN_SONGS)if(SONGS[n])for(const c of SONGS[n].ch)if(c.dist)c.soft=1;   // every boss song plays through the gentler amps
function playSong(name){
  if(AU.name===name)return;AU.name=name;AU.song=SONGS[name]||null;AU.step=0;
  if(AU.c)AU.next=AU.c.currentTime+.06;
}
function tick(){
  const so=AU.song;if(!so||!AU.c)return;const sd=60/so.bpm/2;
  if(AU.next<AU.c.currentTime-.05)AU.next=AU.c.currentTime+.05;
  while(AU.next<AU.c.currentTime+.35){
    for(const ch of so.ch){const ev=ch.at[AU.step%ch.len];if(ev)for(const e of ev)playNote(ch,e,AU.next,sd)}
    AU.step++;AU.next+=so.tern?sd*(AU.step%2?4/3:2/3):sd;   // tern: each pair of steps becomes long-short, the kultrun's gallop
    if(!so.loop&&AU.step>=so.len){AU.song=null;AU.name=null;if(so.after){const n=so.after;so.after=null;playSong(n())}return}
  }
}
function playNote(ch,e,t,sd){
  const c=AU.c;
  if(ch.d){
    if(e.n==='K'||e.n==='u'){   // kultrun: a deep skin struck with a stick, the bowl ringing under it
      const st=e.n==='K'?1:.5,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(e.n==='K'?110:150,t);o.frequency.exponentialRampToValueAtTime(e.n==='K'?58:95,t+.18);
      g.gain.setValueAtTime(ch.v*1.25*st,t);g.gain.exponentialRampToValueAtTime(.001,t+(e.n==='K'?.3:.14));o.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+.34);
      if(!ch.lite){const o2=c.createOscillator(),g2=c.createGain();o2.type='triangle';o2.frequency.setValueAtTime(230,t);o2.frequency.exponentialRampToValueAtTime(150,t+.12);
      g2.gain.setValueAtTime(ch.v*.35*st,t);g2.gain.exponentialRampToValueAtTime(.001,t+.16);o2.connect(g2);g2.connect(AU.mus);o2.start(t);o2.stop(t+.2)}
      const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=e.n==='K'?700:1100;f.Q.value=1.4;const gn=c.createGain();
      gn.gain.setValueAtTime(ch.v*(ch.kul?.9:.55)*st,t);gn.gain.exponentialRampToValueAtTime(.001,t+.05);s.connect(f);f.connect(gn);gn.connect(AU.mus);s.start(t,Math.random()*.5);s.stop(t+.07);return}
    if(e.n==='j'){              // kaskawilla: little bronze bells shaken on the beat
      for(let q=0;q<(ch.lite?1:3);q++){const tt=t+q*.022,fq=[5400,6900,8300][q];const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=fq*(1+Math.random()*.02);
        g.gain.setValueAtTime(ch.v*.16,tt);g.gain.exponentialRampToValueAtTime(.001,tt+.09);o.connect(g);g.connect(AU.mus);o.start(tt);o.stop(tt+.1)}
      const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=6500;const gn=c.createGain();
      gn.gain.setValueAtTime(ch.v*.22,t);gn.gain.exponentialRampToValueAtTime(.001,t+.08);s.connect(f);f.connect(gn);gn.connect(AU.mus);s.start(t,Math.random()*.5);s.stop(t+.09);return}
    if(e.n==='p'){              // pifilka: one shrill breath
      const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.setValueAtTime(2350,t);o.frequency.linearRampToValueAtTime(2450,t+.1);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3600;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(ch.v*.09,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(lp);lp.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+.18);return}
    if(e.n==='k'){const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(40,t+.12);g.gain.setValueAtTime(ch.v,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);o.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+.15)}
    else{const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=e.n==='h'?7000:e.n==='c'?4200:1600;const g=c.createGain();const dur=e.n==='h'?.04:e.n==='c'?.9:.12;
      g.gain.setValueAtTime(ch.v*(e.n==='h'?.35:e.n==='c'?.6:.7),t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(AU.mus);s.start(t,Math.random()*.5);s.stop(t+dur+.01)}
    return}
  if(ch.w==='trut'){           // trutruka: a long horn, a brassy buzz that scoops up into the note
    const o=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter(),lp=c.createBiquadFilter(),dur=e.len*sd,fq=nf(e.n);o.type='sawtooth';
    o.frequency.setValueAtTime(fq*.94,t);o.frequency.exponentialRampToValueAtTime(fq,t+.09);bp.type='peaking';bp.frequency.value=fq*3;bp.Q.value=1.2;bp.gain.value=8;lp.type='lowpass';lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(2200,t+.2);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(ch.v,t+.06);g.gain.setValueAtTime(ch.v*.9,t+dur*.8);g.gain.linearRampToValueAtTime(0,t+dur);
    o.connect(bp);bp.connect(lp);lp.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+dur+.02);return}
  const o=c.createOscillator(),g=c.createGain();o.type=ch.w;o.frequency.value=nf(e.n);
  const dur=e.len*sd;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(ch.v,t+.008);g.gain.linearRampToValueAtTime(ch.v*.65,t+Math.min(.12,dur*.5));
  g.gain.setValueAtTime(ch.v*.65,t+dur*.85);g.gain.linearRampToValueAtTime(0,t+dur*.98);
  if(e.len>=3&&ch.w==='square'){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.5;lg.gain.value=nf(e.n)*.008;l.connect(lg);lg.connect(o.frequency);l.start(t+.15);l.stop(t+dur)}
  if(ch.dist===2&&AU.dist2&&ch.det){const o2=c.createOscillator();o2.type=ch.w;o2.frequency.value=nf(e.n)*Math.pow(2,ch.det/1200);o2.connect(g);o2.start(t);o2.stop(t+dur)}
  const D2=ch.soft&&AU.dist2s||AU.dist2,D1=ch.soft&&AU.dists||AU.dist;
  o.connect(g);g.connect(ch.dist===2&&D2?D2:ch.dist&&D1?D1:AU.mus);o.start(t);o.stop(t+dur);
}
function tone(type,f0,f1,dur,vol,delay){
  if(!AU.c||AU.muted)return;const c=AU.c,t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type;
  o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+dur+.02)}
function noiseBurst(dur,vol,hp,delay){if(!AU.c||AU.muted)return;const c=AU.c,t=c.currentTime+(delay||0),s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=hp||800;const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(AU.sfx);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
function sfx(n){
  if(!AU.c||AU.muted)return;
  switch(n){
  case 'move':tone('square',880,880,.03,.12);break;
  case 'ok':tone('square',660,660,.05,.15);tone('square',990,990,.07,.15,.05);break;
  case 'bad':tone('square',240,110,.22,.2);break;
  case 'hit':noiseBurst(.1,.5,600);tone('square',420,70,.14,.25);break;
  case 'hurt':tone('sawtooth',200,50,.28,.28);noiseBurst(.12,.4,300);break;
  case 'block':tone('triangle',1400,1400,.06,.4);tone('triangle',1900,1900,.1,.35,.05);break;
  case 'heal':['C5','E5','G5','C6'].forEach((x,i)=>tone('triangle',nf(x),nf(x),.09,.35,i*.06));break;
  case 'pick':tone('square',nf('E6'),nf('E6'),.06,.18);tone('square',nf('B6'),nf('B6'),.1,.18,.06);break;
  case 'lvl':['C5','E5','G5','C6','E6','G6'].forEach((x,i)=>tone('square',nf(x),nf(x),.1,.16,i*.07));break;
  case 'cast':tone('square',300,1200,.22,.14);tone('triangle',600,2400,.22,.2,.02);break;
  case 'enc':noiseBurst(.35,.3,2000);['A5','E5','A4','E4'].forEach((x,i)=>tone('square',nf(x),nf(x),.07,.15,i*.06));break;
  case 'swirl':
    // the world is pulled away: rising whoosh, spinning wobble, then a deep slam
    noiseBurst(.5,.22,500);noiseBurst(.42,.2,1200,.08);noiseBurst(.3,.16,2600,.2);
    tone('sawtooth',110,980,.46,.12);tone('square',165,1400,.44,.08,.02);
    tone('sine',70,340,.4,.16,.04);
    for(let i=0;i<6;i++)tone('triangle',500+i*140,340+i*90,.08,.1,.05+i*.065);
    tone('sine',200,42,.3,.22,.4);tone('sawtooth',120,30,.28,.1,.42);
    noiseBurst(.22,.26,150,.42);
    break;
  case 'door':tone('triangle',nf('G4'),nf('G4'),.12,.35);tone('triangle',nf('C5'),nf('C5'),.2,.35,.1);break;
  case 'sleep':tone('sine',800,300,.5,.25);break;
  case 'step':noiseBurst(.03,.06,3000);break;
  case 'drag':{if(!AU.c||AU.muted)break;const c=AU.c,t=c.currentTime;
    const sN=c.createBufferSource();sN.buffer=AU.noise;sN.loop=true;
    const f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(420,t);f.frequency.linearRampToValueAtTime(180,t+.3);
    const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.5,t+.04);g.gain.setValueAtTime(.5,t+.2);g.gain.exponentialRampToValueAtTime(.001,t+.34);
    sN.connect(f);f.connect(g);g.connect(AU.sfx);sN.start(t,Math.random()*.4);sN.stop(t+.4);
    tone('sawtooth',70,52,.3,.22);tone('square',46,40,.3,.12);break}
  case 'charge':tone('sine',180,1500,.42,.22);tone('square',360,2300,.4,.1,.04);break;
  case 'beam':{
    // searing blast with a deep impact body
    tone('sawtooth',1700,320,.55,.3);tone('square',2300,520,.5,.17,.02);
    noiseBurst(.5,.45,2500);noiseBurst(.42,.3,900,.08);
    tone('sine',72,32,.5,.5,.05);tone('sawtooth',130,58,.42,.3,.07);
    break}
  case 'shatter':{
    // crack, deep detonation, long rumble, and a rain of glassy shards
    noiseBurst(.18,.65,2600);
    tone('sine',95,24,1.3,.7);tone('sawtooth',64,20,1.1,.45,.02);tone('sine',42,16,.7,.6,.06);
    noiseBurst(.9,.55,1400,.04);noiseBurst(1.4,.32,380,.1);
    for(let i=0;i<12;i++){const f=1950-i*130+Math.random()*90;tone('square',f,f*.5,.09,.11,.12+i*.055)}
    tone('sine',30,14,.9,.4,.5);
    break}
  case 'trut':{['G3','G3','D4'].forEach((x,i)=>{tone('sawtooth',nf(x)*.99,nf(x),.3,.3,i*.22);tone('sawtooth',nf(x)*1.008,nf(x)*1.01,.3,.2,i*.22)});tone('sawtooth',nf('G4'),nf('G4')*1.01,.55,.3,.66);noiseBurst(.1,.12,900,.66);break}
  }
}


/* stop the music when the app goes to the background (phone home button, app switch) */
document.addEventListener('visibilitychange',()=>{try{if(!AU.c)return;if(document.hidden)AU.c.suspend();else if(!AU.muted)AU.c.resume()}catch(e){}});
addEventListener('pagehide',()=>{try{AU.c&&AU.c.suspend()}catch(e){}});
