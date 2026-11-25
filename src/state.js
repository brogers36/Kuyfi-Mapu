/* ============================================================
   STATE
   ============================================================ */
const HPQ=4,SPMAX=3;
function maxHP(){return S.baseMax+(S.gear.trariwe?4:0)+Math.floor(S.piwke/4)*4+(S.flags.ngen?4:0)+(S.flags.ngen2?4:0)+(S.flags.ngen3?4:0)+(S.flags.ngen4?4:0)+(S.flags.ngen5?4:0)}
function atk(){return Math.max(1,S.baseAtk+(S.gear.futrawino?3:0)+(S.gear.waiki?2:0)-(S.curse?2:0)-(S.kutran?3:0)-(S.chill>0?2:0))}
function def(){return Math.max(0,S.baseDef+(S.gear.makun?2:0)+(S.gear.trarilongko?3:0)-(S.kutran?2:0))}
function xpNeed(){return 10+S.lvl*10}
/* the four heroes you can play: two women and two men, each with their own skin, clothes and battle sprite */
const HEROES={millaray:{name:'Millaray',fem:1},ayelen:{name:'Ayelen',fem:1},llanka:{name:'Llanka',fem:0},kallfurungi:{name:'Kallfürüngi',fem:0}};
function newState(hero){if(!HEROES[hero])hero='llanka';const fem=!!HEROES[hero].fem;return{hero,fem,name:HEROES[hero].name,gloss:LANG,map:'rupu',x:1,y:6,hp:24,baseMax:24,baseAtk:5,baseDef:1,lvl:1,xp:0,gold:0,
  items:{kulon:2,diwen:0,kofke:0,lawen:0,mate:0},gear:{},roots:['amutu'],runes:[],flags:{},piwke:0,keys:0,sp:0,curse:0,hints:true,
  pw:{speed:0,pewen:0,gold:0},save:{map:'rupu',x:1,y:6}}}
function persist(){try{if(M){S.map=CUR;S.x=P.x;S.y=P.y}localStorage.setItem(slotKey(SLOT),JSON.stringify(S))}catch(e){}}
function loadSave(n){try{const t=localStorage.getItem(slotKey(n||SLOT));return t?JSON.parse(t):null}catch(e){return null}}
/* hero mode (new game after beating Ti Fütra Ngoymatulfe): kimün and things carry over, enemies and trials scale up */
const heroMul=()=>Math.min(2.75,1.6+.25*((S.hm||1)-1));
function heroExp(){const k=progK(),L=[2,7,12,17,21,25,29][Math.min(6,k)];
  return{atk:L+4+(k>=2?3:0),def:1+Math.floor(L/2)+(k>=1?2:0),hp:24+HPQ*(L-1)+4*k+(k>=1?4:0)+4*Math.floor(k*.8)}}
function heroState(src){const s=newState(src.hero||'llanka');
  for(const k of ['lvl','xp','baseMax','baseAtk','baseDef','gold','hints'])if(src[k]!=null)s[k]=src[k];
  s.items=Object.assign(s.items,src.items||{});s.gear=Object.assign({},src.gear||{});s.hm=(src.hm||0)+1;
  s.hp=s.baseMax+(s.gear.trariwe?4:0);return s}
function heroHurt(){const d=Math.max(1,Math.round(maxHP()*.1));S.hp=Math.max(1,S.hp-d);sfx('bad');return d}
const heroLook=()=>HEROES[S.hero]?S.hero:'llanka';

/* ---------- verbs ---------- */
const ROOTS={
  amutu:{m:'amutu-',es:'irse (de aquí)',en:'go away (from here)'},
  'küpa':{m:'küpa-',es:'venir',en:'come'},
  umawtu:{m:'umawtu-',es:'dormir',en:'sleep'},
  nagtu:{m:'nagtu-',es:'bajar',en:'come down'},
  'llüka':{m:'llüka-',es:'tener miedo',en:'be afraid'},
  'wüñotreka':{m:'wüñotreka-',es:'volver atrás, retroceder',en:'step back'},
  trafo:{m:'trafo-',es:'quebrarse, romperse',en:'break'},
  'wütre':{m:'wütre-',es:'tener frío',en:'be cold'},
  lef:{m:'lef-',es:'correr, huir',en:'run away'},
  tripa:{m:'tripa-',es:'salir',en:'come out'},
  trana:{m:'trana-',es:'caerse',en:'fall down'},
  nepe:{m:'nepe-',es:'despertar',en:'wake up'},
  'ñam':{m:'ñam-',es:'perderse, desaparecer',en:'get lost, vanish'},
  llako:{m:'llako-',es:'calmarse, aplacarse',en:'calm down, settle'}};
const ENDS=['nge','mu','mün'];
const endFor=n=>n<=1?0:n===2?1:2;
const VG={
  amutu:{es:['¡Vete!','¡Váyanse (ustedes dos)!','¡Váyanse (todos)!'],en:['Go away!','Go away, you two!','Go away, all of you!'],
       nes:['¡No te vayas!','¡No se vayan (ustedes dos)!','¡No se vayan (todos)!'],nen:["Don't go!","Don't go, you two!","Don't go, all of you!"]},
  'küpa':{es:['¡Ven!','¡Vengan (ustedes dos)!','¡Vengan (todos)!'],en:['Come!','Come, you two!','Come, all of you!'],
       nes:['¡No vengas!','¡No vengan (ustedes dos)!','¡No vengan (todos)!'],nen:["Don't come!","Don't come, you two!","Don't come, all of you!"]},
  umawtu:{es:['¡Duerme!','¡Duerman (ustedes dos)!','¡Duerman (todos)!'],en:['Sleep!','Sleep, you two!','Sleep, all of you!'],
       nes:['¡No duermas!','¡No duerman (ustedes dos)!','¡No duerman (todos)!'],nen:["Don't sleep!","Don't sleep, you two!","Don't sleep, all of you!"]},
  nagtu:{es:['¡Baja!','¡Bajen (ustedes dos)!','¡Bajen (todos)!'],en:['Come down!','Come down, you two!','Come down, all of you!'],
       nes:['¡No bajes!','¡No bajen (ustedes dos)!','¡No bajen (todos)!'],nen:["Don't come down!","Don't come down, you two!","Don't come down, all of you!"]},
  'llüka':{es:['¡Ten miedo!','¡Tengan miedo (ustedes dos)!','¡Tengan miedo (todos)!'],en:['Be afraid!','Be afraid, you two!','Be afraid, all of you!'],
       nes:['¡No tengas miedo!','¡No tengan miedo (ustedes dos)!','¡No tengan miedo (todos)!'],nen:["Don't be afraid!","Don't be afraid, you two!","Don't be afraid, all of you!"]},
  lef:{es:['¡Corre!','¡Corran (ustedes dos)!','¡Corran (todos)!'],en:['Run!','Run, you two!','Run, all of you!'],
       nes:['¡No corras!','¡No corran (ustedes dos)!','¡No corran (todos)!'],nen:["Don't run!","Don't run, you two!","Don't run, all of you!"]},
  tripa:{es:['¡Sal!','¡Salgan (ustedes dos)!','¡Salgan (todos)!'],en:['Come out!','Come out, you two!','Come out, all of you!'],
       nes:['¡No salgas!','¡No salgan (ustedes dos)!','¡No salgan (todos)!'],nen:["Don't come out!","Don't come out, you two!","Don't come out, all of you!"]},
  'ñam':{es:['¡Piérdete!','¡Piérdanse (ustedes dos)!','¡Piérdanse (todos)!'],en:['Get lost!','Get lost, you two!','Get lost, all of you!'],
       nes:['¡No te pierdas!','¡No se pierdan (ustedes dos)!','¡No se pierdan (todos)!'],nen:["Don't get lost!","Don't get lost, you two!","Don't get lost, all of you!"]},
  trafo:{es:['¡Quiébrate!','¡Quiébrense (ustedes dos)!','¡Quiébrense (todos)!'],en:['Break!','Break, you two!','Break, all of you!'],
       nes:['¡No te quiebres!','¡No se quiebren (ustedes dos)!','¡No se quiebren (todos)!'],nen:["Don't break!","Don't break, you two!","Don't break, all of you!"]},
  'wütre':{es:['¡Ten frío!','¡Tengan frío (ustedes dos)!','¡Tengan frío (todos)!'],en:['Be cold!','Be cold, you two!','Be cold, all of you!'],
       nes:['¡No tengas frío!','¡No tengan frío (ustedes dos)!','¡No tengan frío (todos)!'],nen:["Don't be cold!","Don't be cold, you two!","Don't be cold, all of you!"]},
  trana:{es:['¡Cáete!','¡Cáiganse (ustedes dos)!','¡Cáiganse (todos)!'],en:['Fall down!','Fall down, you two!','Fall down, all of you!'],
       nes:['¡No te caigas!','¡No se caigan (ustedes dos)!','¡No se caigan (todos)!'],nen:["Don't fall!","Don't fall, you two!","Don't fall, all of you!"]},
  nepe:{es:['¡Despierta!','¡Despierten (ustedes dos)!','¡Despierten (todos)!'],en:['Wake up!','Wake up, you two!','Wake up, all of you!'],
       nes:['¡No despiertes!','¡No despierten (ustedes dos)!','¡No despierten (todos)!'],nen:["Don't wake up!","Don't wake up, you two!","Don't wake up, all of you!"]},
  'wüñotreka':{es:['¡Vuelve atrás!','¡Vuelvan atrás (ustedes dos)!','¡Vuelvan atrás (todos)!'],en:['Go back!','Go back, you two!','Go back, all of you!'],
       nes:['¡No vuelvas atrás!','¡No vuelvan (ustedes dos)!','¡No vuelvan (todos)!'],nen:["Don't go back!","Don't go back, you two!","Don't go back, all of you!"]},
  llako:{es:['¡Cálmate!','¡Cálmense (ustedes dos)!','¡Cálmense (todos)!'],en:['Calm down!','Calm down, you two!','Calm down, all of you!'],
       nes:['¡No te calmes!','¡No se calmen (ustedes dos)!','¡No se calmen (todos)!'],nen:["Don't calm down!","Don't calm down, you two!","Don't calm down, all of you!"]}};

/* ---------- enemies ---------- */
const ET={
  laftrache:{name:'laftrache',hp:10,atk:4,xp:4,gold:[2,4],bs:44},
  chonchon:{name:'chonchon',hp:9,atk:4,xp:5,gold:[3,5],fly:true,bs:44},
  anchi:{name:'anchümalleñ',hp:14,atk:5,xp:6,gold:[4,6],bs:40},
  nidol:{name:'ñidol laftrache',hp:30,atk:6,xp:16,gold:[10,14],bs:62,mini:1},
  piwichen:{name:'pichi piwüchen',hp:32,atk:6,xp:18,gold:[12,16],fly:true,drain:true,bs:66,mini:1},
  trelke:{name:'Trelke-wekufü',hp:125,atk:9,xp:50,gold:[40,40],boss:true,bs:104},
  kolokolo:{name:'kolokolo',hp:13,atk:6,xp:7,gold:[4,7],bs:42,curse:1},
  fkolokolo:{name:'fütra kolokolo',hp:38,atk:8,xp:20,gold:[12,16],bs:64,curse:1,mini:1},
  nguruvilu:{name:'ngürüfilu',hp:40,atk:8,xp:24,gold:[14,18],bs:70,twice:1,mini:1},
  kutral:{name:'kütral wekufü',hp:14,atk:6,xp:8,gold:[5,8],bs:40,fire:1},
  pire:{name:'pire wekufü',hp:12,atk:6,xp:8,gold:[5,8],bs:42,fly:true,snow:1},
  kura:{name:'kura wekufü',hp:18,atk:6,xp:9,gold:[6,9],bs:46,armor:1},
  fkura:{name:'fütra kura wekufü',hp:46,atk:9,xp:24,gold:[16,20],bs:66,armor:1,mini:1},
  nirivilu:{name:'ñirifilu',hp:44,atk:9,xp:26,gold:[16,20],bs:72,twice:1,mini:1},
  cherrufe:{name:'Cherufe',hp:150,atk:11,xp:90,gold:[80,80],boss:true,bs:110,armor:1,fire:1},
  kowek:{name:'ko wekufü',hp:20,atk:7,xp:10,gold:[7,10],bs:42},
  mawek:{name:'mawün wekufü',hp:17,atk:7,xp:10,gold:[7,10],bs:44,fly:true},
  kamawetu:{name:'kamawetu',hp:56,atk:10,xp:30,gold:[20,24],bs:70,twice:1,mini:1},
  basilisko:{name:'basilisko',hp:60,atk:10,xp:32,gold:[20,24],bs:70,drain:true,mini:1},
  kaleuche:{name:'Kaleuche',hp:175,atk:12,xp:110,gold:[100,100],boss:true,bs:112,hide:1},
  witranalwe:{name:'Witranalwe',hp:135,atk:10,xp:70,gold:[60,60],boss:true,bs:110},
  chinifilu:{name:'Chiñifilu',hp:150,atk:14,xp:120,gold:[150,150],boss:true,bs:96,spres:1,seals:['umawtu','küpakil','amutu']},
  piwuchen:{name:'Piwüchen',hp:170,atk:15,xp:140,gold:[170,170],boss:true,bs:100,fly:true,spres:1,seals:['nagtu','llüka','küpakil']},
  wallipen:{name:'Wallepeñ',hp:190,atk:15,xp:160,gold:[190,190],boss:true,bs:92,spres:1,armor:1,seals:['wütre','trafo','umawtu']},
  trawko:{name:'Trawko',hp:200,atk:16,xp:180,gold:[220,220],boss:true,bs:88,spres:1,seals:['tripa','lef','amutukil']},
  mewlen:{name:'mewlen wekufü',hp:22,atk:8,xp:12,gold:[8,12],bs:44,fly:true},
  kurutrewa:{name:'kurü trewa',hp:26,atk:8,xp:12,gold:[8,12],bs:44},
  fmewlen:{name:'fütra mewlen',hp:62,atk:11,xp:34,gold:[22,26],bs:70,fly:true,mini:1},
  kurutoro:{name:'kurü toro',hp:66,atk:11,xp:36,gold:[22,26],bs:72,armor:1,mini:1},
  walichu:{name:'Walichu',hp:200,atk:13,xp:130,gold:[120,120],boss:true,bs:112,dream:1},
  chadikura:{name:'Elëngasëm',hp:220,atk:17,xp:200,gold:[250,250],boss:true,bs:96,spres:1,armor:1,seals:['nepe','trafo','wüñotrekakil']},
  wenangkun:{name:'weñangkün',hp:34,atk:9,xp:20,gold:[10,14],bs:60,mini:1,dream:true},
  illkun:{name:'illkun',hp:38,atk:11,xp:22,gold:[12,16],bs:62,mini:1,fire:true,twice:true},
  llukalfe:{name:'llükalfe',hp:36,atk:12,xp:24,gold:[12,16],bs:64,mini:1,tower:true},
  ayentufe:{name:'ayentufe',hp:30,atk:10,xp:20,gold:[10,14],bs:58,mini:1,curse:true,hide:true},
  ngoysum:{name:'Fütra Ngoymatulfe',hp:70,atk:14,xp:40,gold:[20,30],bs:64,mini:1},
  profe:{name:'illamtufe kimeltulelu',hp:44,atk:12,xp:26,gold:[14,18],bs:64,mini:1,armor:true},
  yewen:{name:'Yewen',hp:300,atk:23,xp:300,gold:[400,400],boss:true,bs:100,spres:1,seals:['tripa','llükakil','ñamkil']},
  wirarun:{name:'wirarün',hp:40,atk:13,xp:24,gold:[12,16],bs:52},
  drone:{name:'pañilwe üñüm',hp:30,atk:13,xp:22,gold:[11,15],bs:40,fly:true},
  dewu:{name:'dewü',hp:34,atk:12,xp:22,gold:[11,15],bs:44,twice:1},
  ngoyngoyun:{name:'Ngoyngoyün',hp:230,atk:18,xp:220,gold:[250,250],boss:true,bs:140,spres:1,seals:['llako','umawtu','amutu']},
  ngamlef:{name:'Ngamleftripael',hp:250,atk:19,xp:240,gold:[260,260],boss:true,bs:132,spres:1,seals:['küpa','tripa','wüñotrekakil']},
  fillantu:{name:'Mapudungukenoael fillantü',hp:270,atk:20,xp:260,gold:[280,280],boss:true,bs:138,fly:true,spres:1,seals:['nepe','tripa','umawtukil']},
  epunamun:{name:'Epunamun',hp:240,atk:14,xp:220,gold:[300,300],boss:true,bs:100,spres:1,seals:['umawtu','nepe','tranakil']},
  ngoyam:{name:'ngoyman am',hp:34,atk:12,xp:22,gold:[12,16],bs:46},
  kalku:{name:'Fütra Kalku',hp:250,atk:18,xp:260,gold:[350,350],boss:true,bs:92,spres:1,seals:['llüka','wüñotreka','ñamkil']},
  ngoyman1:{name:'Ti Fütra Ngoymatulfe',hp:175,atk:13,xp:0,gold:[0,0],boss:true,bs:104},
  ngoyman2:{name:'Fütra Ngoymatulfe',hp:185,atk:14,xp:0,gold:[0,0],boss:true,bs:122,spres:1,thick:1},
  ngoyman3:{name:'Ngoymatulfe ñi piwke',hp:205,atk:16,xp:0,gold:[0,0],boss:true,bs:112,armor:1,spres:1},
  ngoyman4:{name:'Füta Dumiñ',hp:235,atk:18,xp:0,gold:[0,0],boss:true,bs:134,armor:1,spres:1},
  ngoyman5:{name:'Rüf Fütra Ngoymatulfe',hp:265,atk:20,xp:400,gold:[500,500],boss:true,bs:146,spres:1,thick:1},
  llufu1:{name:'Millalobo',hp:140,atk:14,xp:0,gold:[0,0],boss:true,bs:104},
  llufu2:{name:'Millalobo ñi foro',hp:150,atk:14,xp:0,gold:[0,0],boss:true,bs:106,armor:1},
  llufu3:{name:'Müpükülechi Millalobo',hp:160,atk:15,xp:0,gold:[0,0],boss:true,bs:108,twice:1},
  llufu4:{name:'Millalobo ñi piwke',hp:175,atk:15,xp:0,gold:[0,0],boss:true,bs:104,spres:1},
  llufu5:{name:'Rüf Millalobo',hp:185,atk:16,xp:380,gold:[500,500],boss:true,bs:112,thick:1}};

/* ---------- items ---------- */
const ITEMS={
  kulon:{m:'külon',es:'maqui: +8 newen (2 piwke)',en:'maqui berries: +8 newen (2 hearts)',p:5},
  diwen:{m:'diweñ',es:'digüeñes: +12 newen (3 piwke)',en:'diweñ fungi: +12 newen (3 hearts)',p:8},
  kofke:{m:'kofke',es:'pan: +16 newen (4 piwke)',en:'bread: +16 newen (4 hearts)',p:10},
  lawen:{m:'lawen',es:'remedio: quita la maldición, +4 newen',en:'medicine: lifts the curse, +4 newen',p:20},
  mate:{m:'mate',es:'mate caliente: recuperas la mitad de tu newen',en:'hot mate: restores half your newen',p:25}};
const GEAR={
  trutruka:{m:'trutruka',es:'corneta de coligüe: su sonido aturde a todos los wekufü (1 vez por pelea)',en:'colihue horn: its blast stuns all the wekufü (once per battle)',p:0,hide:1},
  makun:{m:'makuñ',es:'poncho: defensa +2',en:'poncho: defense +2',p:30},
  trariwe:{m:'trariwe',es:'faja tejida: +1 piwke máximo',en:'woven sash: +1 max heart',p:40},
  futrawino:{m:'fütra wiño',es:'wiño grande: fuerza +3',en:'big palin stick: strength +3',p:50},
  waiki:{m:'Epunamun ñi waiki',es:'la lanza del Epunamun: fuerza +2',en:"Epunamun's spear: strength +2",p:0,hide:1},
  trarilongko:{m:'trarilongko',es:'el trarilongko de las kuyfi chillka: defensa +3',en:'the trarilongko of the kuyfi chillka: defense +3',p:0,hide:1},
  lafkenkura:{m:'lafkenkura',es:'la piedra del mar de los chumpall: recuperas 2 de newen cada turno de pelea',en:'the chumpall sea stone: you recover 2 newen every battle turn',p:0,hide:1}};
function useItem(id){
  const it=ITEMS[id];if(!S.items[id])return null;S.items[id]--;const mx=maxHP();
  if(id==='kulon')S.hp=Math.min(mx,S.hp+8);
  if(id==='diwen')S.hp=Math.min(mx,S.hp+12);
  if(id==='kofke')S.hp=Math.min(mx,S.hp+16);
  if(id==='lawen'){S.hp=Math.min(mx,S.hp+4);S.curse=0}
  if(id==='mate')S.hp=Math.min(mx,S.hp+Math.ceil(mx/2));
  sfx('heal');
  return L('',it.m,'Usas '+it.m+'. '+it.es+'.','You use '+it.m+'. '+it.en+'.');
}
function itemOpts(){return Object.keys(ITEMS).map(k=>({m:ITEMS[k].m+' ×'+(S.items[k]||0),g:G(ITEMS[k]),v:k,dis:!S.items[k]}))}
