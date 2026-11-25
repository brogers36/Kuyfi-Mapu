import json, os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src','maprows.js')
M={}
M['rupu']=[
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~..~~~~~~~~~~...~~~~~~~..~",
"~~~.........~~~~.......~~~...~",
"#.......F................#...#",
"#....,,,..........,,,...,,,..#",
"==============================",
"#.,,,...........,,,,.....,,,.#",
",,TT,,....TT...,,TTT,,..,,TT,T",
",TTT,,..,TTT,,,,TTTT,,,,,TTT,T",
"P,,TT,,,,,,TT,,,,,TT,,,\"\",,,,T",
",,,,,,,,,g,,,,,,,,,,,,\"\"\",,,,T",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"]
M['lof']=[
"T"*34,
"T"+","*31+"PT",
"T,RRR,Z"+","*21+"RRR,,T",
"T,RRR"+","*6+"Y"*12+","*5+"RRR,,T",
"T"+","*10+"Y"*12+","*10+"T",
"T"+","*10+"Y"*12+","*10+"T",
"T"+","*32+"T",
"T,RRR"+","*12+"F"+","*10+"RRR,,T",
"T,RRR"+","*20+"U"+",,"+"RRR,,T",
"="*34,
"T"+","*32+"T",
"T,,RRR"+","*7+"V"+","*11+"RRR"+","*5+"T",
"T,,RRR"+","*19+"RRR"+","*5+"T",
"T"+","*32+"T",
"T"+","*32+"T",
"T"*34]
M['kuyum']=[
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
"T....\"\"\"\".......~~~~~~~~~~~....T",
"T..m.\"\"\"\"\"\"......~~~~~~~~~~....T",
"T....\"\"\"\"\"......~v~~~~~~~~~....T",
"T.....................XXXXX....T",
"T..T......\"\"\"\"......I.XC..X....T",
"T.........\"\"\"\"........XXXXX..F.T",
"================................",
"T....,,,,.....\"\"\"\"..............",
"T..p.,TT,.....\"\"\"\"........#....T",
"T....,,,,.........P.........,,,T",
"T.......\"\"\"\"..............,,,,,T",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"]
M['mawida']=[
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
"T,,,,TT,,,,,,,,\"\"\"\",,,,TT,,,,,PT",
"T,,,,TT,,,##,,,\"\"\"\",,,,TT,,,,,,T",
"T,,,,,,,,,##,,,,,,,,,,,,,,,,##,T",
"T,,\"\",,,,,,,,,,TTTT,,,,,,,,,##,T",
"T,,\"\",,F,,,,,,,TTTT,,,,\"\",,,,,,T",
"T,,,,,,,,,,,,,,,,,,,,,,\"\",,,,,,T",
"================================",
"T,,,,,,,,TT,,,,,,,,,,,,,,,,,,,,T",
"T,,##,,,,TT,,,,\"\"\"\",,,,TTT,,,,,T",
"T,,##,,,,,,,,,,\"\"\"\",,,,TTT,,F,,T",
"T,,,,,,TTT,,,,,,,,,,,,,,,,,,,g,T",
"T,,,,,,TTT,,,,,,,,,,##,,,,,,,,,T",
"T,,,,,,,,,,,,,,,,,,,,##,,,,,,,,T",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"]
M['inaltu']=[
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~...~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~.S.~~~~~~~~~",
"~~~~..~~~~~~~~~~~~~~...v~~~~~~~~",
"~~.......~~~~~~~~~~~.=.~~~~~~~~~",
"......\"\"\"......~~~~~.=.~~~~....~",
"=====================.=====.....",
"...RRR.....\"\"\"...F...........RRR",
"...RRR..,,,,,................RRR",
"P........,,,,,,....\"\"\"..........",
",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"]
M['d1']=[
"%%%%%%%%%%%%%%%%%%%%%%",
"%F_____%%%%%%%______C%",
"%______%%%%%%%_______%",
"%______K_____L_______%",
"%______%%%%%%%_______%",
"%__k___%%%%%%%__%%%__%",
"_______%%%%%%%__%%%__%",
"%______%%%%%%%_______%",
"%_C____%%%%%%%______%%",
"%______%%%%%%%______S%",
"%%%%%%%%%%%%%%%%%%%%%%"]
M['d2']=[
"%%%%%%%%%%%%%%%%%%%%%%",
"%F_____%%%_______%%%%%",
"%__B___%%%_______%%%%%",
"%______G_________K__S%",
"%____O_%%%_______%%%%%",
"%______%%%___C___%%%%%",
"_______%%%_______%%%%%",
"%______%%%%%%%%%%%%%%%",
"%%%%%%%%%%%%%%%%%%%%%%"]
M['d3']=[
"%%%%%%%%%%%%%%%%%%%%%%",
"%F____%________%%%%%%%",
"%_____%_B____B_%____%%",
"%__k__L________G____S%",
"%_____%__O__O__%____%%",
"%_____%________%_____%",
"______%%%%%%%%%%F____%",
"%%%%%%%%%%%%%%%%%%%%%%"]
M['ngen']=[
"~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~",
"~~~~~......~~~~~~~",
"~~~~..........~~~~",
"~~~............~~~",
"~~~............~~~",
"~~~~..........~~~~",
"~~~~~~......~~~~~~",
"~~~~~~~....~~~~~~~",
"~~~~~~~....~~~~~~~",
"~~~~~~~.F..~~~~~~~",
"~~~~~~~.S.~~~~~~~~",
"~~~~~~~~~~~~~~~~~~"]

M['kuyum']=[
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
"T....\"\"\"\".......~~~~~~~~~~~....T",
"T..m.\"\"\"\"\"\"......~~~~~~~~~~....T",
"T....\"\"\"\"\"......~v~~~~~~~~~....T",
"T.....N...............XXXXX.N..T",
"T..T......\"\"\"\"......I.XC..X....T",
"T.........\"\"\"\"........XXXXX..F.T",
"================................",
"T....,,,,.....\"\"\"\"..N...........",
"T..p.,TT,.....\"\"\"\"........#####T",
"T....,,,,...N.....P.......E,,C,T",
"T.......\"\"\"\".............I#,,,,T",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"]
M['mawida']=[
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
"T,,,,TT,,,,,,,,\"\"\"\",,,,TT,,,,,PT",
"T,,,,TT,,,##,,,\"\"\"\",,,,TT,,,,,,T",
"T,,,,,,,,,##,,,,,,,,,,,,,,,,##,T",
"T,,\"\",,,,,,,,,,TTTT,,,,,,,,,##,T",
"T,,\"\",,F,,,,,,,TTTT,,,,\"\",,,,,,T",
"T,,,,,,,,,,,,,,,,,,,,,,\"\",,,,,,T",
"================================",
"T,,,,,,,,TT,,,,,,,,,,,,,,,,,,,,T",
"T,,##,,,,TT,,,,\"\"\"\",,,,TTT,,,,,T",
"T,,##,,,,,,,,,,\"\"\"\",,,,TTT,H,F,T",
"T,,,,,,TTT,,,,,,,,,,,,,,,,TTETTT",
"T,,,,,,TTT,,,,,,,,,,##,,,,T,,,,T",
"T,,,,,,,,,,,,,,,,,,,,##,,,T,gC,T",
"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"]
M['d1']=[
"%%%%%%%%%%%%%%%%%%%%%%",
"%F_____%%%%%%%_____%C%",
"%______%%%%%%%______E%",
"%______K_____L_______%",
"%______%%%%%%%J__J__J%",
"%__k___%%%%%%%__%%%__%",
"_______%%%%%%%__%%%__%",
"%______%%%%%%%____I__%",
"%_C____%%%%%%%______%%",
"%______%%%%%%%______S%",
"%%%%%%%%%%%%%%%%%%%%%%"]
M['d2']=[
"%%%%%%%%%%%%%%%%%%%%%%",
"%F_____%%%_______%%%%%",
"%__B___%%%__H____%%%%%",
"%______G_________K__S%",
"%____O_%%%___E___%%%%%",
"%______%%%__%C%__%%%%%",
"_______%%%___%___%%%%%",
"%______%%%%%%%%%%%%%%%",
"%%%%%%%%%%%%%%%%%%%%%%"]
M['ngen'][7]="~~~~~~..A...~~~~~~"

WALK=set('.,"=_PmgpSqk')
for k,v in M.items():
    w=len(v[0])
    for i,r in enumerate(v):
        assert len(r)==w,(k,i,len(r),w,r)
    print(k,w,len(v))
# NPC paths to validate
paths={'lof':[[(24,8),(24,10),(28,10),(24,10)],[(6,10),(22,10)],[(17,13),(21,13),(21,14),(17,14)],[(8,13),(10,13),(10,14),(8,14)]]}
def walkable(m,x,y): return M[m][y][x] in WALK
for m,ps in paths.items():
    for p in ps:
        for (a,b),(c,d) in zip(p,p[1:]+p[:1]):
            # straight segments
            xs=range(min(a,c),max(a,c)+1);ys=range(min(b,d),max(b,d)+1)
            for x in xs:
                assert walkable(m,x,b),(m,x,b,M[m][b][x])
            for y in ys:
                assert walkable(m,c,y),(m,c,y)
print('paths ok')
open(OUT,'w',encoding='utf-8').write('const MAPROWS='+json.dumps(M,ensure_ascii=False)+';\n')

class C:
    def __init__(s,w,h,fill=','):
        s.w,s.h=w,h;s.g=[[fill]*w for _ in range(h)]
        for x in range(w):s.g[0][x]=s.g[h-1][x]='T'
        for y in range(h):s.g[y][0]=s.g[y][w-1]='T'
    def p(s,x,y,c):s.g[y][x]=c
    def r(s,x,y,w,h,c):
        for yy in range(y,y+h):
            for xx in range(x,x+w):s.g[yy][xx]=c
    def rows(s):return[''.join(r) for r in s.g]
def hh(x,y,k):
    import math;v=math.sin(x*12.9898+y*78.233+k*37.719)*43758.5453;return v-math.floor(v)
# --- l_wapi: marsh islets south of the dunes (Lafkenche) ---
L_={}
c=C(32,13,'.')
c.p(8,0,'.')
c.r(1,1,30,1,'~');c.p(8,1,'.')
c.r(2,4,4,2,'~');c.r(13,2,5,2,'~');c.r(22,8,4,2,'~');c.r(7,8,3,2,'~')
for y in range(2,12):
    for x in range(1,31):
        if c.g[y][x]=='.' and hh(x,y,31)<.16:c.g[y][x]='"'
        elif c.g[y][x]=='.' and hh(x,y,32)<.06:c.g[y][x]='T'
c.p(5,6,'x');c.p(19,3,'x');c.p(26,8,'x')
c.r(25,3,6,4,'T');c.r(26,4,4,2,'.');c.p(28,4,'C');c.p(27,6,'E');c.p(27,7,'.')
c.p(22,6,'H');c.p(22,7,'.');c.p(22,5,'.')
c.r(2,9,3,2,'.');c.p(3,9,'F')
c.p(10,5,'.');c.p(14,9,'.')
L_['l_wapi']=c.rows()
# --- l_islote: the sea stacks (advanced Lafkenche) ---
c=C(32,13,'.')
c.p(5,0,'.')
c.r(1,1,30,2,'~');c.p(5,1,'.');c.p(5,2,'.')
c.r(1,8,10,4,'~');c.r(20,9,11,3,'~')
for y in range(3,8):
    for x in range(1,31):
        if hh(x,y,71)<.10:c.g[y][x]='#'
c.r(12,8,6,4,'.')
c.r(24,3,6,4,'#');c.r(25,4,4,2,'.');c.p(27,4,'C');c.p(26,6,'E');c.p(26,7,'.')
c.p(21,6,'H');c.p(21,7,'.');c.p(21,5,'.')
c.r(2,4,3,2,'.');c.p(3,5,'F')
c.p(14,10,'.');c.p(8,6,'.')
L_['l_islote']=c.rows()
M['l_islote']=L_['l_islote']
# inaltu: south opening to the stacks
M['inaltu'][11]=M['inaltu'][11][:5]+','+M['inaltu'][11][6:]
M['inaltu'][12]=M['inaltu'][12][:5]+'.'+M['inaltu'][12][6:]
# kuyum: south opening to the marsh
M['kuyum'][11]=M['kuyum'][11][:8]+'.'+M['kuyum'][11][9:]
M['kuyum'][12]=M['kuyum'][12][:8]+'.'+M['kuyum'][12][9:]
M.update(L_)

# ================= NAGCHE =================
def mirror(rows): return [r[::-1] for r in rows]
N={}
N['n_rupu']=[
"T"*32,
"T"+","*10+"f"*10+","*5+"T"+","*4+"T",
"T,,\"\",,,,,,f"+"W"*8+"f,,,,,T,P,,T",
"T,,\"\",,F,,,f"+"W"*8+"f,,,,,T,,,,T",
"T"+","*10+"f"+"W"*8+"f"+","*5+"TÑTTTT",
"T"+","*10+"f"*10+","*10+"T",
"T,,TT"+","*21+"\"\""+",,,T",
"="*32,
"T,,,,,,\"\""+","*12+"TT"+","*8+"T",
"T,,##,,\"\",,,TT"+","*7+"TT,,,,##,,T",
"T,,##"+","*7+"TT"+","*13+"##,,T",
"T,,,,I"+","*9+"g"+","*15+"T",
"T"*32]
N['n_lof']=[
"T"*34,
"T"+","*31+"PT",
"T,RRR"+","*16+"f"*10+",,T",
"T,RRR"+","*16+"f"+","*8+"f,,T",
"T"+","*20+"f"+","*8+"f,,T",
"T"+","*8+"RRR"+","*9+"f"*10+",,T",
"T"+","*8+"RRR"+","*21+"T",
"T,,RRR"+","*11+"F"+","*9+"RRR,,,T",
"T,,RRR"+","*21+"RRR,,,T",
"="*34,
"T"+","*32+"T",
"T"+","*32+"T",
"T"+","*32+"T",
"T"*34]
def setr(rows,x,y,w,h,ch):
    for yy in range(y,y+h):rows[yy]=rows[yy][:x]+ch*w+rows[yy][x+w:]
for (x,y) in [(13,1),(10,11),(28,11)]:setr(N['n_lof'],x,y,3,2,'R')
setr(N['n_lof'],7,4,1,1,'Z');setr(N['n_lof'],25,7,1,1,'U')
N['n_kullin']=[
"T"*32,
"T"+","*8+"f"*8+","*14+"T",
"T"+","*8+"f"+","*6+"f"+","*14+"T",
"T"+","*8+"f"+","*6+"f"+","*6+"TTT"+","*5+"T",
"T,,F,,,,,ffff,fff"+","*6+"TTT"+","*5+"T",
"T"+","*30+"T",
"T,,,\"\""+","*20+"\"\",,,T",
"="*32,
"T"+","*14+"f"*8+","*8+"T",
"T,,TT"+","*7+"\"\""+",f"+","*6+"f,"+"##"+","*5+"T",
"T,,TT"+","*7+"\"\""+",f"+","*6+"f,"+"##"+","*5+"T",
"T"+","*14+"f"*8+","*6+"P,T",
"T"*32]
# --- n_menoko: the sacred wetland south of the animal fields ---
c=C(32,13)
c.p(5,0,',')
c.r(3,3,4,2,'~');c.r(12,5,5,3,'~');c.r(22,2,4,2,'~');c.r(25,8,4,2,'~')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,41)<.22:c.g[y][x]='"'
        elif c.g[y][x]==',' and hh(x,y,42)<.08:c.g[y][x]='T'
c.p(7,7,'x');c.p(17,3,'x');c.p(28,6,'x')
c.p(9,4,',');c.p(20,9,',');c.r(19,9,3,2,',')
c.p(13,9,',');c.p(2,10,'P');c.p(2,9,',')
# juncos (reeds) ring the trutruka dig spot south of the middle pool
for (jx,jy) in [(12,8),(13,8),(14,8),(11,9),(15,9),(12,10),(13,10),(14,10)]:c.p(jx,jy,'j')
c.r(28,10,3,2,',');c.p(29,10,'F')
N['n_menoko']=c.rows()
setr(N['n_kullin'],5,12,1,1,',')
N['n_lewfu']=[
"T"*32,
"T"+","*12+"~~~~"+","*9+"T,C,,T",
"T"+","*12+"~~~~"+","*9+"T,,,,T",
"T,,F"+","*9+"~~~~"+","*9+"T,,,,T",
"T"+","*12+"~~~~"+","*9+"TETTTT",
"T"+","*12+"~~~~"+","*8+"H,,,,,T",
"T"+","*12+"~~~~"+","*14+"T",
"="*13+"bbbb"+"="*15,
"T"+","*12+"~~~~"+","*14+"T",
"T,,##"+","*8+"~~~~"+","*14+"T",
"T"+","*12+"~~~~"+","*10+"T,,,T",
"T"+","*12+"~~~~"+","*10+"Ñ,P,T",
"T"*32]
N['n_mawida']=[
"T"*32,
"T,,,,TT,,,,,,,TT,,,,,,,,TT,,,,,T",
"T,\"\",TT,,TT,,,TT,,\"\",,,,TT,,,,,T",
"T"+","*8+"TT"+","*17+"S,,T",
"T,,F"+","*10+"TTT"+","*14+"T",
"T,,,,TT,,,,,,,TTT,,,,\"\",,,,TT,,T",
"T,,,,TT"+","*14+"\"\",,,,TT,,T",
"="*32,
"T"+","*10+"TT"+","*18+"T",
"T,,##,,,,,,TT,,,\"\",,,,,,,TTT,,,T",
"T,,##"+","*11+"\"\""+","*7+"TTT,,gT",
"T"+","*7+"TT"+","*21+"T",
"T"*32]
# --- n_winkul: the hill country (advanced Nagche) ---
c=C(32,13)
c.p(16,0,',')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,81)<.13:c.g[y][x]='#'
        elif c.g[y][x]==',' and hh(x,y,82)<.12:c.g[y][x]='T'
        elif c.g[y][x]==',' and hh(x,y,83)<.10:c.g[y][x]='"'
c.r(15,1,3,3,',');c.r(5,4,4,3,',')
c.r(23,7,7,5,'T');c.r(24,8,5,3,',');c.p(26,9,'C');c.p(24,10,'E');c.p(23,10,',')
c.p(20,10,'H');c.r(19,9,3,3,',')
c.p(20,10,'H')
c.r(3,9,3,2,',');c.p(4,9,'F')
c.r(5,5,3,2,',');c.p(6,6,',');c.p(6,5,'K');c.r(5,2,3,2,'#');c.r(6,3,1,2,',');c.p(6,2,'P')
c.p(12,7,',');c.p(28,3,',')
N['n_winkul']=c.rows()
setr(N['n_mawida'],16,11,1,1,',');setr(N['n_mawida'],16,12,1,1,',')
def carve0(g,x,y,w,h,ch='_'):
    for yy in range(y,y+h):
        for xx in range(x,x+w):g[yy][xx]=ch
# nd1: burrow with a flooded room; pz + E route and key + L route to the same pocket
g=[['%']*24 for _ in range(12)]
carve0(g,17,2,5,6)
carve0(g,22,4,2,1)
carve0(g,9,1,6,5)
carve0(g,11,2,2,2,'~')
carve0(g,1,1,6,5)
carve0(g,15,3,2,1)
carve0(g,7,3,2,1);g[3][8]='K'
carve0(g,1,7,5,3)
g[6][3]='E'
carve0(g,6,9,12,1);g[9][6]='L'
carve0(g,18,8,1,2)
g[2][18]='F'
g[1][10]='C';g[1][13]='k'
g[2][2]='N';g[2][4]='N';g[2][6]='N'
g[4][5]='I'
g[8][2]='C'
carve0(g,2,10,1,1);g[10][2]='S'
N['nd1']=[''.join(r) for r in g]
# nd2: hall with pond; stone quiz opens the west wing; konew side pocket; south corridor loop
g=[['%']*24 for _ in range(10)]
carve0(g,18,1,5,4)
carve0(g,23,2,1,1)
g[1][19]='F'
carve0(g,8,1,8,7)
carve0(g,10,3,3,3,'~')
carve0(g,16,2,2,1)
carve0(g,1,1,5,7)
g[4][6]='E';carve0(g,7,4,1,1)
g[7][14]='H'
g[2][2]='C'
g[5][19]='K';carve0(g,18,6,4,3);g[7][20]='C'
carve0(g,2,8,11,1)
g[8][4]='J'
carve0(g,2,8,1,1);g[8][2]='S'
N['nd2']=[''.join(r) for r in g]
# nd3: pillared hall before the clearing
g=[['%']*22 for _ in range(9)]
carve0(g,1,1,20,7)
carve0(g,8,2,2,2,'~')
for (x,y) in [(5,3),(6,3),(12,5),(13,5),(16,2),(16,3)]:g[y][x]='%'
carve0(g,21,4,1,1)
g[1][2]='F';g[1][12]='g'
carve0(g,2,7,1,1);g[7][2]='S'
N['nd3']=[''.join(r) for r in g]
N['nd2']=[r.replace('J','_') for r in N['nd2']]
N['ngen2']=[
"T"*18,
"TTTTT,,,,,,,,TTTTT",
"TTT,,,,,,,,,,,,TTT",
"TT,,,,,,,,,,,,,,TT",
"TT,,,,,,,,,,,,,,TT",
"TT,,,,,,,,,,,,,,TT",
"TTT,,,,,,,,,,,,TTT",
"TTTTT,,,A,,,TTTTTT",
"TTTTTT,,,,,TTTTTTT",
"TTTTTTT,,,,TTTTTTT",
"TTTTTTT,F,,TTTTTTT",
"TTTTTTT,S,TTTTTTTT",
"T"*18]

# ================= PEWENCHE =================
P_={}
# --- p_rupu: foothills road with a stream ---
c=C(32,13)
c.r(0,7,32,1,'=')
c.r(17,1,2,11,'~');c.r(17,7,2,1,'b')
for (x,y,w,h) in [(2,1,2,3),(24,2,3,2),(7,8,3,2),(21,9,3,2)]:c.r(x,y,w,h,'.')
for (x,y,w,h) in [(9,1,2,2),(3,5,2,2),(22,5,2,2),(13,9,2,2)]:c.r(x,y,w,h,'T')
for (x,y) in [(2,9),(3,9),(2,10),(3,10),(28,9),(29,9),(28,10),(29,10),(13,2),(13,4)]:c.p(x,y,'#')
c.p(6,3,'F')
c.r(27,1,5,4,'T');c.r(28,1,3,3,',');c.p(29,1,'P');c.p(29,4,'^')
P_['p_rupu']=c.rows()
# --- p_lof: pewenche community ---
c=C(34,14)
c.r(0,9,34,1,'=')
for (x,y,w,h) in [(2,2,3,2),(9,5,3,2),(27,7,3,2)]:c.r(x,y,w,h,'R')
for (x,y) in [(20,1),(23,1),(26,1),(21,3),(25,3),(30,4)]:c.p(x,y,'T')
for (x,y,w,h) in [(13,1,4,2),(6,11,3,2)]:c.r(x,y,w,h,'.')
c.p(17,7,'F');c.p(32,1,'P')
for (x,y) in [(2,6),(13,11),(28,11),(18,2)]:c.r(x,y,3,2,'R')
c.p(7,3,'Z');c.p(24,7,'U')
P_['p_lof']=c.rows()
# --- p_pewen: araucaria forest, seasons stones, hidden kulon grove ---
c=C(32,17)
c.r(0,7,32,1,'=')
for y in range(1,7):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,3)<.42 and not (7<=x<=21 and 1<=y<=6) and not (12<=x<=14 and y in (5,6)) and y!=6:c.g[y][x]='T'
c.r(7,1,15,5,',');c.r(13,5,1,2,',')
for x in (9,12,15,18):c.p(x,3,'N')
c.p(13,5,'I')
c.r(24,1,7,5,'T');c.r(25,1,5,3,',');c.p(27,4,'E');c.p(27,5,',');c.p(27,6,',');c.p(27,2,'C')
# south forest (rows 8-15): winding paths, twin pewen dig, hidden grove
for y in range(8,16):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,21)<.46:c.g[y][x]='T'
c.r(2,8,4,1,',');c.r(14,8,3,1,',');c.p(22,8,',')
c.r(2,9,4,3,',');c.p(3,10,'F')
c.r(15,9,1,3,',');c.r(10,11,6,1,',')
c.r(10,12,4,3,',');c.p(11,13,'P')
c.r(3,12,1,3,',');c.r(3,14,8,1,',')
c.p(7,9,'T');c.p(8,9,',');c.p(9,9,'T')
c.r(22,9,1,4,',');c.r(23,12,2,1,',')
c.r(24,12,7,4,',')
for (x,y) in [(26,13),(28,14),(25,14),(29,12)]:c.p(x,y,'M')
c.p(27,13,'C')
P_['p_pewen']=c.rows()
# --- p_pire: snowfield, ice-block puzzle, southern flats ---
c=C(32,17,'.')
c.r(0,7,32,1,'=')
c.r(20,1,7,5,'#');c.r(21,1,5,3,'.');c.p(23,2,'C');c.p(23,4,'G');c.p(23,5,'.')
for (x,y) in [(9,3),(14,2)]:c.p(x,y,'B')
for (x,y) in [(9,5),(16,4)]:c.p(x,y,'O')
for (x,y,w,h) in [(2,1,2,2),(12,9,2,2)]:c.r(x,y,w,h,'T')
for (x,y) in [(5,10),(6,10),(19,9),(20,9)]:c.p(x,y,'#')
c.r(1,9,3,1,',');c.p(2,10,'F')
c.r(26,8,5,4,'T');c.r(27,9,3,2,'.');c.p(28,10,'P');c.p(28,8,'^')
# southern flats: frozen tarn, pewen cluster, konew pocket
c.r(4,12,3,2,'~')
c.r(14,13,2,2,'T');c.r(24,14,2,2,'T');c.p(9,14,'T');c.p(2,14,'T')
c.r(17,12,7,1,'#');c.p(20,12,'K')
c.r(17,13,1,3,'#');c.r(23,13,1,3,'#')
c.p(20,14,'P');c.p(18,14,'g')
P_['p_pire']=c.rows()
# --- p_pillan: volcano slope ---
c=C(32,13)
c.r(0,7,28,1,'=')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and y!=7 and hh(x,y,5)<.12:c.g[y][x]='#'
        elif c.g[y][x]==',' and y!=7 and hh(x,y,6)<.2:c.g[y][x]='.'
c.r(25,1,6,6,'#');c.r(26,2,4,4,'.');c.p(28,3,'S');c.p(28,6,'.');c.r(27,4,3,3,'.')
c.r(25,5,1,2,'#');c.r(30,5,1,2,'#');c.r(26,6,1,1,'#');c.r(29,6,1,1,'#')
c.r(1,1,5,4,'T');c.r(2,1,3,3,',');c.p(3,1,'P');c.p(3,4,'K')
c.p(10,10,'F');c.r(9,9,3,3,',');c.p(10,10,'F')
for x in range(0,28):c.g[7][x]='='
c.g[8][27]=c.g[7][27]='=';c.r(27,6,1,2,'.')
P_['p_pillan']=c.rows()
# --- ruka interiors ---
def interior(w,h):
    g=[['_']*w for _ in range(h)]
    for x in range(w):g[0][x]=g[h-1][x]='%'
    for y in range(h):g[y][0]=g[y][w-1]='%'
    return g
def carve(g,x,y,w,h,ch='_'):
    for yy in range(y,y+h):
        for xx in range(x,x+w):g[yy][xx]=ch
rk=interior(14,9)
carve(rk,6,8,2,1)
rk1=[r[:] for r in rk];rk2=[r[:] for r in rk]
rk1[3][7]='F';rk1[2][3]='Z';rk1[5][4]='U';rk1[2][11]='C'
rk2[3][7]='F';rk2[5][11]='C';rk2[2][3]='V'
P_['p_ruka1']=[''.join(r) for r in rk1]
P_['p_ruka2']=[''.join(r) for r in rk2]
# --- p_degin: the windy high rim above the snowfields ---
c=C(32,13,'.')
c.p(6,12,'.')
for y in range(1,12):
    for x in range(1,31):
        if hh(x,y,51)<.10 and y not in (10,11):c.g[y][x]='#'
        elif hh(x,y,52)<.05:c.g[y][x]='T'
c.r(5,9,3,3,'.');c.r(6,1,2,11,'.')
c.r(10,4,12,1,'#');c.r(10,5,1,3,'#');c.r(15,2,1,3,'#')
c.r(22,3,7,5,'#');c.r(23,4,5,3,'.');c.p(25,4,'C');c.p(25,7,'K');c.p(25,8,'.')
c.p(3,2,'P');c.r(2,2,3,2,'.');c.p(3,2,'P')
c.p(16,9,'.');c.r(2,8,3,2,'.');c.p(2,9,'F')
P_['p_degin']=c.rows()
P_['p_pire'][0]=P_['p_pire'][0][:6]+'.'+P_['p_pire'][0][7:]
P_['p_pire'][1]=P_['p_pire'][1][:6]+'.'+P_['p_pire'][1][7:]
rkL=[r[:] for r in rk];rkN=[r[:] for r in rk];rkW=[r[:] for r in rk]
rkL[3][7]='F';rkL[2][3]='Z';rkL[5][4]='U';rkL[2][11]='C'
rkN[3][7]='F';rkN[4][4]='U';rkN[5][11]='C';rkN[2][11]='V'
rkW[3][7]='F';rkW[5][2]='C';rkW[2][11]='Z'
P_['l_ruka1']=[''.join(r) for r in rkL]
rkK=[r[:] for r in rk];rkK[5][3]='F';rkK[2][3]='Z';rkK[5][11]='U'
P_['l_ruka2']=[''.join(r) for r in rkK]
P_['n_ruka1']=[''.join(r) for r in rkN]
P_['w_ruka1']=[''.join(r) for r in rkW]
# trawün rukas: one per lof, the fire in the middle and room for everyone around it
for _tid in ('l_trawun','n_trawun','p_trawun','w_trawun','e_trawun'):
    _t=[r[:] for r in rk];_t[3][7]='F';_t[2][2]='U';_t[2][11]='U'
    P_[_tid]=[''.join(r) for r in _t]
# --- p_lil: the lava crags (advanced Pewenche) ---
c=C(32,13,'.')
c.p(16,0,'.')
for y in range(1,12):
    for x in range(1,31):
        if hh(x,y,91)<.14:c.g[y][x]='#'
c.r(15,1,3,3,'.')
c.r(3,3,4,2,'~');c.r(24,8,5,2,'~');c.r(12,9,4,2,'~')
c.r(6,7,5,4,'.');c.p(8,9,'F')
c.r(23,2,7,4,'#');c.r(24,3,5,2,'.');c.p(26,3,'C');c.p(25,5,'E');c.p(25,6,'.')
c.r(19,4,3,3,'.');c.p(20,5,'H')
c.p(3,10,'P');c.r(2,9,3,3,'.');c.p(3,10,'P')
c.p(17,6,'.');c.p(10,4,'.')
P_['p_lil']=c.rows()
P_['p_pillan'][11]=P_['p_pillan'][11][:16]+'.'+P_['p_pillan'][11][17:]
P_['p_pillan'][12]=P_['p_pillan'][12][:16]+'.'+P_['p_pillan'][12][17:]
# --- lair: Cherrufe ñi ruka, three unique branching floors ---
g=[['%']*26 for _ in range(12)]
carve(g,1,1,6,5)
carve(g,10,1,5,5);carve(g,11,2,2,3,'~')
carve(g,19,1,6,3)
carve(g,10,7,9,4)
carve(g,21,7,4,4)
carve(g,0,4,1,1)
carve(g,7,4,3,1)
carve(g,15,2,4,1)
carve(g,3,6,1,1);carve(g,3,7,7,1)
carve(g,12,6,1,1)
carve(g,22,4,1,3)
carve(g,19,9,2,1)
g[5][22]='K';g[2][19]='L';g[9][19]='E'
g[1][1]='F';g[3][3]='C';g[5][2]='k'
g[1][23]='C'
g[8][12]='N';g[8][15]='N';g[8][18]='N'
g[10][13]='I'
g[9][23]='S'
P_['pd1']=[''.join(r) for r in g]
g=[['%']*26 for _ in range(12)]
carve(g,1,1,5,4)
carve(g,8,1,6,4)
carve(g,16,1,9,4)
carve(g,6,6,17,5)
carve(g,1,7,4,3)
carve(g,0,2,1,1)
carve(g,6,2,2,1)
carve(g,15,2,1,1)
carve(g,21,5,1,1)
carve(g,12,5,1,1)
carve(g,10,7,1,3,'~');carve(g,15,8,1,3,'~')
g[2][14]='G';g[2][9]='B';g[3][11]='B';g[4][9]='O';g[3][13]='O'
g[1][20]='C';g[3][18]='H'
g[8][5]='K';g[7][2]='C'
g[9][22]='S'
P_['pd2']=[''.join(r) for r in g]
g=[['%']*24 for _ in range(10)]
carve(g,1,1,22,8)
carve(g,3,4,18,2,'~')
g[4][7]=g[5][7]='b';g[4][16]=g[5][16]='b'
for (x,y) in [(5,2),(11,2),(18,2),(6,7),(12,7)]:g[y][x]='%'
carve(g,0,1,1,1)
g[2][2]='F';g[2][20]='C'
g[7][21]='S'
P_['pd3']=[''.join(r) for r in g]
# --- crater arena ---
P_['ngen3']=[
"%"*18,
"%%%%%~~~~~~~~%%%%%",
"%%%~~~______~~~%%%",
"%%~~__________~~%%",
"%%~____________~%%",
"%%~____________~%%",
"%%%~__________~%%%",
"%%%%%___A____%%%%%",
"%%%%%%_____%%%%%%%",
"%%%%%%%____%%%%%%%",
"%%%%%%%_F__%%%%%%%",
"%%%%%%%_S_%%%%%%%%",
"%"*18]
# reachability check (walkable incl. puzzle tiles that open)
OPEN=set('.,"=_PmgpSqkAb')
def bfs(rows,start):
    H=len(rows);W=len(rows[0]);seen={start};st=[start]
    while st:
        x,y=st.pop()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            X,Y=x+dx,y+dy
            if 0<=X<W and 0<=Y<H and (X,Y) not in seen and rows[Y][X] in OPEN:seen.add((X,Y));st.append((X,Y))
    return seen
OPEN2=set('.,"=_PmgpSqkAbKLEGBONJHCFSIMZUVx^j')
def bfs2(rows,start):
    H=len(rows);W=len(rows[0]);seen={start};st=[start]
    while st:
        x,y=st.pop()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            X,Y=x+dx,y+dy
            if 0<=X<W and 0<=Y<H and (X,Y) not in seen and rows[Y][X] in OPEN2:seen.add((X,Y));st.append((X,Y))
    return seen
STARTS={'p_rupu':(0,7),'p_lof':(0,9),'p_pewen':(0,7),'p_pire':(0,7),'p_pillan':(3,1),'p_ruka1':(6,7),'p_ruka2':(6,7),'pd1':(1,4),'pd2':(1,2),'pd3':(1,1),'p_degin':(6,11),'l_ruka1':(6,7),'l_ruka2':(6,7),'n_ruka1':(6,7),'w_ruka1':(6,7),'l_trawun':(6,7),'n_trawun':(6,7),'p_trawun':(6,7),'w_trawun':(6,7),'e_trawun':(6,7)}
ALL=dict(P_);ALL['l_wapi']=L_['l_wapi']
for k,st in STARTS.items():
    v=ALL[k];R2=bfs2(v,st)
    missing=[(x,y,v[y][x]) for y in range(len(v)) for x in range(len(v[0])) if v[y][x] in set('PCKSFMNIkgHBOE') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)

N.update(P_)

# ================= WILLICHE =================
W_={}
# n_lewfu gets a south exit
r=N['n_lewfu'];r[12]=r[12][:20]+'='+r[12][21:]
# --- w_rupu: rainforest road ---
c=C(32,13)
c.r(4,0,1,8,'=');c.r(4,7,28,1,'=')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,11)<.30 and abs(x-4)>1 and abs(y-7)>1:c.g[y][x]='T'
        elif c.g[y][x]==',' and hh(x,y,12)<.18:c.g[y][x]='"'
c.r(7,2,3,3,',');c.p(8,3,'F')
c.r(25,1,6,4,'T');c.r(26,1,4,3,',');c.p(27,1,'P');c.p(27,4,'X');c.p(27,5,',');c.p(27,6,',')
c.r(12,9,5,2,',');c.r(20,2,4,3,',')
W_['w_rupu']=c.rows()
# --- w_lof: williche community by a lake ---
c=C(34,14)
c.r(0,9,34,1,'=')
for (x,y) in [(2,2),(9,5),(27,7),(14,1),(21,2),(2,6)]:c.r(x,y,3,2,'R')
c.r(1,11,32,2,'~');c.r(10,10,14,1,'.');c.r(14,11,3,1,'b')
c.p(17,7,'F');c.p(32,1,'P');c.p(7,3,'Z');c.p(24,7,'U')
for (x,y) in [(31,4),(29,2),(25,4)]:c.p(x,y,'T')
W_['w_lof']=c.rows()
# --- w_mawida: alerce forest, kinship stone, konew door ---
c=C(32,13)
c.r(0,7,32,1,'=')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,13)<.40 and y not in (6,8):c.g[y][x]='T'
c.r(8,1,13,5,',');c.r(13,5,1,2,',')
c.p(14,3,'H')
c.r(24,1,7,5,'T');c.r(25,1,5,3,',');c.p(27,2,'C');c.p(27,4,'E');c.p(27,5,',');c.p(27,6,',')
c.r(2,9,4,3,',');c.p(3,10,'F')
c.r(22,9,7,3,'T');c.r(23,10,5,1,',');c.p(27,10,'P');c.p(22,10,'K');c.p(21,10,',')
W_['w_mawida']=c.rows()
# --- w_lafken: southern beach ---
c=C(32,13,'.')
c.r(0,7,32,1,'=')
c.r(1,10,30,2,'~')
for y in range(1,7):
    for x in range(1,31):
        if hh(x,y,14)<.25 and y<5:c.g[y][x]=','
        elif hh(x,y,15)<.07:c.g[y][x]='#'
for (x,y) in [(3,2),(4,2),(12,1),(20,2),(28,3)]:c.p(x,y,'T')
c.r(24,1,7,5,'#');c.r(25,1,5,3,'.');c.p(27,1,'P');c.p(27,4,'X');c.r(27,5,1,2,'.')
c.r(6,8,3,2,'.');c.p(7,8,'F')
W_['w_lafken']=c.rows()
# --- w_inaltu: cliffs and the sea cave ---
c=C(32,13,'.')
c.r(0,7,24,1,'=')
c.r(26,1,5,11,'~');c.r(24,1,2,11,'#');c.r(24,6,2,1,'.');c.r(22,5,4,3,'.');c.p(25,5,'S')
c.r(24,4,2,1,'#');c.r(22,4,2,1,'#');c.r(22,8,4,1,'#')
for y in range(1,12):
    for x in range(1,22):
        if c.g[y][x]=='.' and y!=7 and hh(x,y,16)<.12:c.g[y][x]='#'
        elif c.g[y][x]=='.' and y!=7 and hh(x,y,17)<.25:c.g[y][x]=','
c.r(4,9,3,2,'.');c.p(5,10,'F')
W_['w_inaltu']=c.rows()
# --- w_wapi: the island in the lake (Williche) ---
c=C(32,13)
c.r(1,1,30,11,'~')
c.r(6,3,20,7,',')
c.p(15,0,'b');c.r(15,1,1,2,'b')
for y in range(3,10):
    for x in range(6,26):
        if c.g[y][x]==',' and hh(x,y,61)<.14:c.g[y][x]='"'
        elif c.g[y][x]==',' and hh(x,y,62)<.07:c.g[y][x]='T'
c.r(9,4,4,3,',');c.p(8,4,'F');c.p(8,5,',');c.p(10,5,'U')
c.p(20,4,'H');c.p(20,5,',');c.p(20,3,',')
c.r(21,5,5,4,'T');c.r(22,6,3,2,',');c.p(23,6,'C');c.p(23,8,'E');c.p(23,9,',')
c.p(12,8,',');c.p(10,5,'U')
W_['w_wapi']=c.rows()
# water-stone puzzle: three carved stones; the whirlpool stays hidden until they are touched in order
_r=[list(r) for r in W_['w_wapi']]
for (_x,_y),_ch in {(8,6):'N',(18,4):'N',(12,8):'N',(16,10):'~'}.items():
    assert _r[_y][_x] in ',~',(_x,_y,_r[_y][_x])
    _r[_y][_x]=_ch
W_['w_wapi']=[''.join(r) for r in _r]
# w_lof: bridge continues south off the map
r=W_['w_lof'];r[12]=r[12][:14]+'bbb'+r[12][17:];r[13]=r[13][:15]+'b'+r[13][16:]
# --- w_trayen: the waterfall gorge (advanced Williche) ---
c=C(32,13)
c.p(16,0,',')
c.r(10,1,3,11,'~');c.p(16,1,',');c.r(10,6,3,1,'b')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,95)<.16 and x not in (16,):c.g[y][x]='T'
        elif c.g[y][x]==',' and hh(x,y,96)<.10:c.g[y][x]='"'
c.r(14,1,5,4,',');c.r(4,5,4,3,',')
c.r(2,8,7,4,'#');c.r(3,9,5,2,',');c.p(4,10,'P');c.p(6,10,'g');c.p(5,8,'K');c.p(5,7,',')
c.r(23,3,4,3,',');c.p(24,4,'F')
c.r(22,8,6,3,',');c.p(24,9,'m')
c.p(20,6,',');c.p(28,6,',')
W_['w_trayen']=c.rows()
setr(W_['w_mawida'],16,11,1,1,',');setr(W_['w_mawida'],16,12,1,1,',')
# wd1: sea cave with a channel; brazier pz, locked shortcut and a konew gate
g=[['%']*24 for _ in range(12)]
carve0(g,16,1,6,5)
carve0(g,22,3,2,1)
carve0(g,8,2,6,8)
carve0(g,10,4,2,4,'~')
carve0(g,14,3,2,1)
carve0(g,1,1,6,5)
carve0(g,7,3,1,1)
carve0(g,2,7,4,2)
g[6][3]='E'
carve0(g,15,7,7,4)
carve0(g,17,6,1,1);g[6][17]='L'
carve0(g,14,8,1,1);g[8][14]='K'
g[1][17]='F'
g[2][2]='J';g[2][4]='J';g[4][2]='J'
g[4][5]='I'
g[8][3]='C'
g[8][20]='C'
g[5][13]='k'
g[10][20]='S'
W_['wd1']=[''.join(r) for r in g]
# wd2: hall with two pools; stone quiz opens the tripa wing, konew the treasure wing
g=[['%']*24 for _ in range(10)]
carve0(g,17,1,6,5)
carve0(g,23,2,1,1)
g[1][18]='F'
carve0(g,7,1,8,8)
carve0(g,9,4,2,2,'~');carve0(g,12,2,2,2,'~')
carve0(g,15,2,2,1)
carve0(g,1,1,4,3)
carve0(g,5,2,2,1);g[2][6]='E'
carve0(g,1,5,4,4)
carve0(g,5,6,2,1);g[6][6]='K'
g[7][11]='H'
g[2][2]='C'
g[7][2]='C'
g[8][13]='S'
W_['wd2']=[''.join(r) for r in g]
# wd3: tidal hall with pools before the pier
g=[['%']*22 for _ in range(9)]
carve0(g,1,1,20,7)
carve0(g,4,3,3,2,'~');carve0(g,9,1,2,3,'~');carve0(g,13,4,3,2,'~');carve0(g,17,2,2,2,'~')
for (x,y) in [(7,6),(12,2)]:g[y][x]='%'
carve0(g,21,3,1,1)
g[1][19]='F';g[6][10]='g'
g[7][2]='S'
W_['wd3']=[''.join(r) for r in g]
W_['ngen4']=[
"~"*18,
"~"*18,
"~"*18,
"~"*18,
"~"*18,
"~~~~~~~bbbb~~~~~~~",
"~~~~~~~bbbb~~~~~~~",
"~~~~~~~bAbb~~~~~~~",
"~~~~~~~~bb~~~~~~~~",
"~~~~~~~~bb~~~~~~~~",
"~~~~~~~bbbb~~~~~~~",
"~~~~~~~bSbb~~~~~~~",
"~"*18]
for k in ['w_rupu','w_lof','w_mawida','w_lafken','w_inaltu']:
    v=W_[k];sy=7 if k!='w_lof' else 9;start=(4,0) if k=='w_rupu' else (0,sy);R=bfs(v,start)
    right=[(len(v[0])-1,y) for y in range(len(v)) if (len(v[0])-1,y) in R]
    print(k,'reach',len(R),'right',right)
for k,st in {'l_wapi':(8,1),'n_menoko':(5,1),'w_wapi':(15,1),'nd1':(22,4),'nd2':(23,2),'nd3':(21,4),'wd1':(22,3),'wd2':(23,2),'wd3':(21,3),'l_islote':(5,1),'n_winkul':(16,1),'p_lil':(16,1),'w_trayen':(16,1)}.items():
    rows=(L_ if k.startswith('l_') else N if k.startswith('n') else P_ if k.startswith('p_') else W_)[k];R2=bfs2(rows,st)
    missing=[(x,y,rows[y][x]) for y in range(len(rows)) for x in range(len(rows[0])) if rows[y][x] in set('PCKSFMNIkgHBOExJ') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)
N.update(W_)
# ================= PUELMAPU =================
E_={}
# p_degin gets an east exit down the far side of the cordillera
setr(P_['p_degin'],31,9,1,1,'.')
# widen the opening to three tiles and clear a visible lane toward it, with a carved stone pointing east
setr(P_['p_degin'],31,8,1,3,'.')
setr(P_['p_degin'],27,8,4,3,'.')
setr(P_['p_degin'],26,10,1,1,'I')
# --- e_rupu: the eastern slopes, down from the ridge into the pampa ---
c=C(32,13)
c.r(0,7,32,1,'=')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and abs(y-7)>1:
            if x<15 and hh(x,y,101)<.26:c.g[y][x]='#'
            elif x>=15 and hh(x,y,102)<.24:c.g[y][x]='"'
            elif x<15 and hh(x,y,103)<.10:c.g[y][x]='T'
c.r(3,2,3,3,',');c.p(4,3,'F')
c.r(24,1,7,4,'#');c.r(25,1,5,3,',');c.p(27,1,'P');c.p(29,2,'C')
c.p(27,4,'D');c.p(27,5,',');c.p(27,6,',')
c.r(10,9,4,2,',');c.p(25,9,',')
E_['e_rupu']=c.rows()
# --- e_lof: the Puelche community on the open plain ---
c=C(34,14)
c.r(0,9,34,1,'=')
for (x,y) in [(2,2),(9,5),(27,7),(14,1),(2,6),(3,11),(26,11)]:c.r(x,y,3,2,'R')
c.r(20,2,10,4,'f');c.r(21,3,8,2,',');c.p(24,5,',')
c.p(17,7,'F');c.p(32,1,'P');c.p(7,3,'Z');c.p(24,7,'U');c.p(13,11,'V')
for (x,y) in [(31,4),(18,2),(12,6)]:c.p(x,y,'T')
E_['e_lof']=c.rows()
# --- e_lelfun: the open grassland ---
c=C(32,13)
c.r(0,7,32,1,'=')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and abs(y-7)>0:
            if hh(x,y,104)<.30:c.g[y][x]='"'
            elif hh(x,y,105)<.045:c.g[y][x]='T'
c.r(7,2,3,3,',');c.p(8,3,'H')
c.r(24,1,7,5,'#');c.r(25,2,5,2,',');c.r(27,4,1,2,',');c.p(27,2,'C');c.p(27,5,'E');c.p(27,6,',')
c.r(20,9,4,3,',');c.p(22,10,'K')
c.r(11,8,4,2,',')
c.r(3,9,3,2,',');c.p(4,9,'F')
c.p(16,12,',')
E_['e_lelfun']=c.rows()
# --- e_mallin: the wet meadow ---
c=C(32,13)
c.p(16,0,',')
c.r(5,3,4,2,'~');c.r(20,6,5,2,'~');c.r(12,8,3,2,'~')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and hh(x,y,106)<.26:c.g[y][x]='"'
        elif c.g[y][x]==',' and hh(x,y,107)<.05:c.g[y][x]='T'
c.r(11,4,5,3,',')
c.r(2,8,5,4,'#');c.r(3,9,3,2,',');c.p(4,10,'C');c.p(5,9,'D');c.r(6,9,1,1,',')
c.r(26,1,4,3,',');c.p(27,2,'F')
c.p(24,9,'m');c.r(23,9,4,2,',')
c.r(7,9,3,2,',')
E_['e_mallin']=c.rows()
# --- e_kura: the stone badlands ---
c=C(32,13,'.')
c.r(0,7,32,1,'=')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]=='.' and abs(y-7)>1 and hh(x,y,108)<.30:c.g[y][x]='#'
        elif c.g[y][x]=='.' and hh(x,y,109)<.10:c.g[y][x]=','
c.r(4,2,6,4,'#')
c.r(5,3,2,2,'.');c.p(7,3,'.');c.p(7,4,'B');c.p(7,5,'.')
c.p(5,3,'C')
c.r(18,1,4,3,'.');c.p(20,2,'C')
c.r(12,9,4,2,'.');c.r(24,9,3,3,'.');c.p(24,12,'.')
c.r(2,9,3,2,'.');c.p(3,10,'F')
E_['e_kura']=c.rows()
# --- e_salitral: the salt flat (hard area) ---
c=C(32,13,'.')
c.p(24,0,'.')
c.r(8,4,5,2,'~');c.r(17,8,4,2,'~')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]=='.' and hh(x,y,110)<.08:c.g[y][x]='#'
c.r(11,2,3,3,'.');c.p(12,3,'H')
c.r(24,9,5,3,'#');c.r(25,10,3,2,'.');c.p(26,10,'K');c.p(24,11,'.')
c.r(14,8,3,3,'.')
c.r(27,1,4,3,'.');c.p(28,2,'F')
c.p(20,3,'.')
E_['e_salitral']=c.rows()
# --- e_meseta: the rim of the meseta, with the Walichu's chenque ---
c=C(32,13,'.')
c.r(0,7,24,1,'=')
c.r(22,1,9,11,'#')
c.r(22,5,4,3,'.');c.r(24,6,2,1,'.');c.p(25,6,'S')
for y in range(1,12):
    for x in range(1,22):
        if c.g[y][x]=='.' and y!=7 and hh(x,y,111)<.14:c.g[y][x]='#'
        elif c.g[y][x]=='.' and y!=7 and hh(x,y,112)<.20:c.g[y][x]=','
c.r(4,9,3,2,'.');c.p(5,10,'F')
c.r(2,2,4,3,'.');c.p(3,3,'P')
E_['e_meseta']=c.rows()
# ed1: the chenque, a ring burrow around a central chamber
g=[['%']*24 for _ in range(12)]
carve0(g,2,2,20,8)
carve0(g,5,4,14,4,'%')
carve0(g,7,5,10,2)
carve0(g,5,5,2,1);carve0(g,17,6,2,1)
carve0(g,22,6,2,1)
carve0(g,10,5,2,2,'~')
g[2][3]='F'
g[2][8]='N';g[2][12]='N';g[2][16]='N'
g[3][6]='I'
g[9][3]='C';g[9][19]='C'
g[5][8]='K'
g[6][14]='_'  # (leftover key removed: the chenque's one lock is opened by the key on floor 2)
carve0(g,2,10,2,1);g[10][2]='E';g[10][3]='S'
E_['ed1']=[''.join(r) for r in g]
# ed2: the flooded gallery, two halls joined by a locked corridor
g=[['%']*24 for _ in range(10)]
carve0(g,1,1,9,8)
carve0(g,3,3,2,4,'~');carve0(g,6,1,2,3,'~')
carve0(g,10,4,4,1);g[4][11]='L'
carve0(g,14,1,9,8)
carve0(g,16,3,3,2,'~');carve0(g,20,6,2,2,'~')
carve0(g,0,2,1,1)
g[1][2]='F'
g[1][8]='C'
g[7][8]='k'
g[6][2]='H'
g[1][15]='C'
g[1][21]='C'
g[7][22]='S'
E_['ed2']=[''.join(r) for r in g]
# ed3: the spiral down to the open pampa
g=[['%']*22 for _ in range(11)]
carve0(g,1,1,20,2)
carve0(g,19,3,2,6)
carve0(g,5,7,16,2)
carve0(g,5,3,2,5)
carve0(g,7,4,9,1)
carve0(g,15,4,1,2)
carve0(g,10,7,2,1,'~');carve0(g,13,1,2,2,'~')
carve0(g,0,1,1,1)
g[2][1]='F'
g[4][9]='g'
g[8][6]='C'
g[7][19]='S'
E_['ed3']=[''.join(r) for r in g]
E_['ngen5']=[
"TTTTTTTTTTTTTTTTTT",
"TT\"\",,,,,,,,,,\"\"TT",
"T\",,,#,,,,,,#,,,\"T",
"T,,,,,,,,,,,,,,,,T",
"T,#,,,,,,,,,,,,#,T",
"T,,,,,,,,,,,,,,,,T",
"T\",#,,,,,,,,,#,,\"T",
"TT\",,,,,A,,,,,\"TTT",
"TTT,,#,,,,,#,,TTTT",
"TTTT,,,,,,,,,TTTTT",
"TTTT,,,,F,,,,TTTTT",
"TTTTT,,,S,,,TTTTTT",
"TTTTTTTTTTTTTTTTTT"]
E_['ngoyman']=[
"TTTTTTTTTTTTTTTTTT",
"TT\"\"\",,,\"\"\",,,\"\"TT",
"T\",,,,,,,,,,,,,\"\"T",
"T,,\"\",,,,,,,\"\",,,T",
"T,,,,,,,,,,,,,,,,T",
"T\",,,,,,I,,,,,,\",T",
",,,,,,,,,,,,,,,,,,",
"T,,\",,,,,,,,,\",,,T",
"T,,,,,,,,,F,,,,,,T",
"T\",,,,,,,,,,,,,\",T",
"TT\",,\"\",,,,\"\",,\"TT",
"TTTTTTTTTTTTTTTTTT",
"TTTTTTTTTTTTTTTTTT"]
# --- e_ruka1 interior ---
E_['e_ruka1']=[
"%%%%%%%%%%%%%%",
"%____________%",
"%__Z_______C_%",
"%______F_____%",
"%____________%",
"%________U___%",
"%____________%",
"%____________%",
"%%%%%%__%%%%%%"]
for k,st in {'e_rupu':(0,7),'e_lof':(0,9),'e_lelfun':(0,7),'e_mallin':(16,1),'e_kura':(0,7),'e_salitral':(24,1),'e_meseta':(0,7),'ed1':(22,6),'ed2':(22,7),'ed3':(19,7),'e_ruka1':(6,7)}.items():
    rows=[r.replace('D',',') for r in E_[k]];R2=bfs2(rows,st)
    missing=[(x,y,rows[y][x]) for y in range(len(rows)) for x in range(len(rows[0])) if rows[y][x] in set('PCKSFMNIkgHBOExJDm') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)

# ================= NGOYMAN: the stolen lands =================
# g_lafken: the drowned coast
c=C(32,13,'.')
c.r(1,10,30,2,'~')
for y in range(1,10):
    for x in range(1,31):
        if c.g[y][x]=='.' and y!=7:
            if hh(x,y,120)<.16:c.g[y][x]='"'
            elif hh(x,y,121)<.06:c.g[y][x]='T'
c.p(0,7,'.');c.p(31,7,'.')
c.r(3,2,3,3,'.');c.p(4,3,'F')
c.r(22,2,5,4,'#');c.r(23,3,3,2,'.');c.p(24,3,'K');c.p(24,5,'.');c.p(24,6,'.')
c.p(6,10,'v');c.p(6,9,'.')
c.r(9,3,3,3,'.')
c.r(14,8,3,2,'.')
E_['g_lafken']=c.rows()
# g_nag: the grey lowlands
c=C(32,13)
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and y!=7:
            if hh(x,y,122)<.10:c.g[y][x]='T'
            elif hh(x,y,123)<.08:c.g[y][x]='"'
c.p(0,7,',');c.p(31,7,',')
c.r(14,2,5,3,'W');c.r(13,2,1,3,'f');c.r(19,2,1,3,'f')
c.r(5,2,6,4,'#')
c.r(6,3,2,2,',');c.p(8,3,',');c.p(8,4,'B');c.p(8,5,',')
c.p(6,3,'C')
c.r(2,8,3,3,',');c.p(3,9,'F')
c.r(19,7,4,3,',')
c.p(28,2,'C');c.r(27,2,3,2,',')
c.p(28,2,'C')
c.r(23,9,3,2,',')
E_['g_nag']=c.rows()
# g_pewen: the frozen heights
c=C(32,13,'.')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]=='.' and y!=7:
            if hh(x,y,124)<.20:c.g[y][x]='#'
            elif hh(x,y,125)<.07:c.g[y][x]='T'
c.p(0,7,'.');c.p(31,7,'.')
c.r(20,1,10,6,'#')
c.r(21,2,8,4,'.')
c.p(22,3,'N');c.p(24,3,'N');c.p(26,3,'N')
c.p(22,5,'I')
c.p(28,2,'C');c.p(27,2,'E')
c.p(24,6,'.');c.r(24,7,1,1,'.')
c.r(6,7,4,3,'.')
c.r(3,2,3,3,'.');c.p(4,3,'F')
c.r(13,9,3,2,'.')
E_['g_pewen']=c.rows()
# g_wil: the silent rainforest
c=C(32,13)
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and y!=7:
            if hh(x,y,126)<.26:c.g[y][x]='T'
            elif hh(x,y,127)<.08:c.g[y][x]='"'
c.p(0,7,',');c.p(31,7,',')
c.r(14,9,4,2,'~')
c.r(5,2,7,4,',')
c.p(6,3,'J');c.p(8,3,'J');c.p(10,3,'J')
c.p(8,4,'I')
c.r(24,8,6,4,'#');c.r(25,9,4,2,',');c.p(27,9,'C');c.p(24,10,'E');c.p(23,10,',')
c.r(15,5,4,3,',')
c.r(2,8,3,3,',');c.p(3,9,'F')
E_['g_wil']=c.rows()
# g_puel: the ashen pampa
c=C(32,13)
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]==',' and y!=7:
            if hh(x,y,128)<.22:c.g[y][x]='"'
            elif hh(x,y,129)<.05:c.g[y][x]='T'
c.p(0,7,',');c.p(31,7,',')
c.r(21,7,5,4,',')
c.r(8,4,4,3,',')
c.r(26,1,4,3,',');c.p(27,2,'F')
c.r(5,8,3,2,',')
E_['g_puel']=c.rows()
# g_wulngin: the gate court
g=[['%']*18 for _ in range(13)]
carve0(g,3,2,12,9)
g[2][8]='S'
g[5][8]='I'
g[8][10]='F'
carve0(g,15,7,3,1)
E_['g_wulngin']=[''.join(r) for r in g]
# g_ngoyman: the heart of the fog
g=[['%']*18 for _ in range(13)]
carve0(g,3,2,12,10)
g[11][8]='S'
E_['g_ngoyman']=[''.join(r) for r in g]
for k,st in {'g_lafken':(0,7),'g_nag':(0,7),'g_pewen':(0,7),'g_wil':(0,7),'g_puel':(0,7),'g_wulngin':(16,7),'g_ngoyman':(8,10)}.items():
    rows=[r.replace('D',',') for r in E_[k]];R2=bfs2(rows,st)
    missing=[(x,y,rows[y][x]) for y in range(len(rows)) for x in range(len(rows[0])) if rows[y][x] in set('PCKSFMNIkgHBOExJD') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)


# ================= MÜNCHE LAFKEN: under the lake =================
# secret whirlpool on the Williche island
# whirlpool hidden until the water-stone puzzle (loadMap restores 'v' when pz:w_wapi is set)
# u_grotto: the entry grotto
g=[['%']*20 for _ in range(11)]
carve0(g,2,2,16,7)
g[2][4]='S'
g[3][4]='F'
carve0(g,18,5,2,1)
g[7][14]='I'
E_['u_grotto']=[''.join(r) for r in g]
# u_garden: the chumpall gardens
c=C(32,13,'.')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]=='.' and y!=7:
            if hh(x,y,140)<.16:c.g[y][x]='T'
            elif hh(x,y,141)<.22:c.g[y][x]='"'
c.r(0,7,1,1,'.');c.p(0,7,'.');c.p(31,7,'.')
c.r(10,3,4,3,'.')
c.r(18,8,4,3,'.')
c.r(24,1,6,4,'#');c.r(25,2,4,2,'.');c.p(27,2,'C');c.p(27,4,'.');c.p(27,5,'.')
c.r(3,9,3,2,'.');c.p(4,9,'F')
E_['u_garden']=c.rows()
# u_deep: the trench (hard)
c=C(32,13,'.')
c.r(8,3,3,7,'~');c.r(20,2,3,6,'~')
for y in range(1,12):
    for x in range(1,31):
        if c.g[y][x]=='.' and y!=7:
            if hh(x,y,142)<.12:c.g[y][x]='T'
            elif hh(x,y,143)<.18:c.g[y][x]='"'
            elif hh(x,y,144)<.05:c.g[y][x]='#'
c.p(0,7,'.');c.p(31,7,'.')
c.r(16,8,4,3,'.')
c.r(4,4,4,3,'.')
c.r(26,9,4,3,'.');c.p(27,10,'C')
c.r(2,9,3,2,'.');c.p(3,9,'F')
E_['u_deep']=c.rows()
# u_throne: the chumpall hall
g=[['%']*24 for _ in range(12)]
carve0(g,3,2,18,8)
carve0(g,0,7,3,1)
g[2][11]='F'
g[4][6]='I'
carve0(g,10,2,4,2,'~')
E_['u_throne']=[''.join(r) for r in g]
for k,st in {'u_grotto':(4,2),'u_garden':(0,7),'u_deep':(0,7),'u_throne':(0,7)}.items():
    rows=[r.replace('v','~') for r in E_[k]];R2=bfs2(rows,st)
    missing=[(x,y,rows[y][x]) for y in range(len(rows)) for x in range(len(rows[0])) if rows[y][x] in set('PCKSFMNIkgHBOExJD') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)


# ================= SANTIAGO: the return =================
# s_plaza: Plaza Wallmapu, the arrival (urban)
def U(w,h):
    c=C(w,h,',')
    for x in range(w):c.g[0][x]=c.g[h-1][x]=','
    for y in range(h):c.g[y][0]=c.g[y][w-1]=','
    return c
def blocks(c,y,h,spans,gapch='w'):
    # spans: list of (x,w); the tile between spans becomes a railing so nobody slips into the alley
    for (x,w) in spans:c.r(x,y,w,h,'h')
    xs=sorted(spans)
    for a,b in zip(xs,xs[1:]):
        gx=a[0]+a[1]
        if gx<b[0]:
            for yy in range(y,y+h-1):c.p(gx,yy,',')
            c.p(gx,y+h-1,gapch)
c=U(36,16)
blocks(c,0,3,[(0,5),(6,6),(13,4),(18,7),(26,5),(32,4)])
c.r(0,4,36,2,'=')
c.r(0,7,36,6,',')
c.r(9,7,6,2,'Y');c.r(21,7,6,2,'Y');c.r(9,11,6,2,'Y');c.r(21,11,6,2,'Y')
c.r(17,9,2,2,'~')
c.p(16,8,'z');c.p(19,8,'z');c.p(16,11,'z');c.p(19,11,'z')
for x in (4,12,24,31):c.p(x,6,'l')
for x in (7,28):c.p(x,13,'l')
c.p(15,7,'T');c.p(20,7,'T');c.p(15,12,'T');c.p(20,12,'T');c.p(3,9,'T');c.p(32,9,'T')
blocks(c,14,2,[(0,5),(6,5),(12,5),(18,5),(24,5),(30,6)])
c.p(3,10,'@')
c.p(13,10,'V');c.p(24,10,'I')
c.r(1,4,2,2,'c');c.r(30,4,2,2,'c')
E_['s_plaza']=c.rows()
# s_calle: the commercial street, feria and bus stop (urban)
c=U(40,14)
blocks(c,0,2,[(0,4),(5,5),(11,4),(16,6),(23,5),(29,4),(34,6)])
c.r(0,3,40,2,'=')
c.p(2,2,'l');c.p(14,2,'l');c.p(27,2,'l');c.p(37,2,'l')
c.r(5,3,2,1,'c');c.r(17,4,3,1,'c');c.r(31,3,2,1,'c')
c.r(9,5,2,1,'o')
c.p(20,5,'e');c.p(22,5,'e');c.p(24,5,'e');c.p(26,5,'e')
c.p(4,5,'l');c.p(34,5,'l');c.p(16,5,'z');c.p(29,5,'z')
c.r(2,7,15,6,'.');c.r(2,7,15,1,'w');c.r(2,12,15,1,'w');c.r(2,8,1,4,'w');c.r(16,8,1,4,'w');c.p(9,7,',');c.p(9,12,',')
blocks(c,8,5,[(20,5),(26,6),(33,7)])
c.r(18,13,22,1,',');c.p(19,10,'l');c.p(19,13,'T');c.p(1,13,'T');c.p(0,9,'T')
E_['s_calle']=c.rows()
# s_poblacion: the neighborhood, the urban ruka and the cancha (urban)
c=U(34,14)
blocks(c,0,2,[(0,5),(6,5),(12,5),(18,5),(24,5),(30,4)])
c.r(0,3,34,2,'=')
c.r(3,4,2,1,'c');c.r(22,3,2,1,'c')
c.p(1,5,'l');c.p(12,5,'l');c.p(27,5,'l');c.p(7,5,'z')
blocks(c,7,2,[(0,4),(5,4)])
c.r(10,7,8,6,'Y');c.r(11,8,6,4,',');c.r(13,9,3,2,'R')
c.r(10,7,8,1,'w');c.p(14,7,',');c.r(10,12,8,1,'w');c.p(14,12,',')
c.r(20,7,12,6,'.');c.r(20,7,12,1,'w');c.r(20,12,12,1,'w');c.r(19,8,1,4,'w');c.r(32,8,1,4,'w');c.p(25,7,',');c.p(25,12,',')
c.r(0,10,4,3,'h');c.r(5,10,4,3,'h');c.p(4,12,'w')
c.p(9,13,'l');c.p(18,13,'l');c.p(33,10,'T');c.p(33,13,'T')
E_['s_poblacion']=c.rows()
# s_centro: the urban ruka cultural center
g=[['%']*16 for _ in range(10)]
carve0(g,1,1,14,7)
g[2][3]='Z';g[2][12]='V';g[5][11]='U';g[1][7]='F'
carve0(g,7,8,2,1)
carve0(g,7,9,2,1)
E_['s_centro']=[''.join(r) for r in g]
# ---- the Santiago act: feria + radio (ngoyngoyün), Metro (ngamleftripael), blocks (fillantü)
# s_feria: the big street market, west of the plaza; the radio station is on the top row
c=U(40,14)
blocks(c,0,3,[(0,6),(7,7),(15,5),(21,8),(30,4),(35,5)])
c.r(0,4,40,2,'=')
for x in (3,13,27,37):c.p(x,6,'l')
for x in (5,7,9,11,13):c.p(x,8,'e')
for x in (22,24,26,28,30,32):c.p(x,8,'e')
for x in (6,9,12,25,28,31):c.p(x,11,'e')
c.p(17,10,'z');c.p(35,10,'z');c.p(2,12,'T');c.p(38,12,'T');c.p(19,12,'T')
c.r(1,4,2,1,'c');c.r(33,5,3,1,'c')
E_['s_feria']=c.rows()
# s_radio: the community radio booth
g=[['%']*16 for _ in range(10)]
carve0(g,1,1,14,7)
g[1][7]='V'
carve0(g,7,8,2,1);carve0(g,7,9,2,1)
E_['s_radio']=[''.join(r) for r in g]
# s_metro: the station concourse (entered from s_calle); a turnstile line splits it
g=[['%']*22 for _ in range(10)]
carve0(g,1,1,20,6)
for y in range(1,7):g[y][12]='%'
g[4][12]='_'
g[2][19]='S'
carve0(g,10,7,2,3)
E_['s_metro']=[''.join(r) for r in g]
# s_m1: the platform and the service tunnel
g=[['%']*26 for _ in range(10)]
carve0(g,1,1,24,3)
carve0(g,0,2,1,1)
carve0(g,3,4,2,4)
carve0(g,3,8,17,1)
carve0(g,12,5,5,3)
carve0(g,21,4,3,5)
for y in range(4,9):g[y][20]='%'
g[8][20]='_'
g[5][23]='C';g[7][22]='S'
E_['s_m1']=[''.join(r) for r in g]
# s_m2: the abandoned, half-flooded line
g=[['%']*26 for _ in range(10)]
carve0(g,1,1,4,8);carve0(g,0,4,1,1)
carve0(g,5,4,16,1)
carve0(g,6,1,14,3);carve0(g,9,1,8,2,'~')
carve0(g,8,6,6,3)
carve0(g,10,5,1,1)
carve0(g,21,1,4,8)
g[8][12]='C';g[7][23]='S'
E_['s_m2']=[''.join(r) for r in g]
# s_m3: the depot, where the line ends
g=[['%']*24 for _ in range(11)]
carve0(g,1,3,4,5);carve0(g,0,5,1,1)
carve0(g,5,5,3,1)
carve0(g,8,1,15,9)
for (x,y) in [(11,3),(11,7),(19,3),(19,7)]:g[y][x]='%'
g[1][21]='S'
E_['s_m3']=[''.join(r) for r in g]
# s_blocks: the apartment blocks, east of the población
c=U(34,14)
blocks(c,0,3,[(0,8),(9,8),(18,8),(27,7)])
c.r(0,4,34,2,'=')
c.r(3,7,6,3,'Y');c.r(25,7,6,3,'Y')
c.p(12,8,'z');c.p(21,8,'z');c.p(16,7,'l');c.p(1,7,'l');c.p(32,7,'l')
blocks(c,11,3,[(0,9),(10,6),(17,7),(25,9)])
c.r(1,5,2,1,'c')
E_['s_blocks']=c.rows()
# s_depto: a family's flat (dinner) ; s_chuchu: the grandmother's flat (the phone)
g=[['%']*14 for _ in range(9)]
carve0(g,1,1,12,6);carve0(g,6,7,2,2)
E_['s_depto']=[''.join(r) for r in g]
g=[['%']*12 for _ in range(9)]
carve0(g,1,1,10,6);carve0(g,5,7,2,2)
E_['s_chuchu']=[''.join(r) for r in g]
for k,st in {'s_feria':(39,4),'s_radio':(7,8),'s_metro':(10,8),'s_m1':(0,2),'s_m2':(0,4),'s_m3':(0,5),'s_blocks':(0,4),'s_depto':(6,8),'s_chuchu':(5,8)}.items():
    rows=[r.replace('@',',') for r in E_[k]];R2=bfs2(rows,st)
    missing=[(x,y,rows[y][x]) for y in range(len(rows)) for x in range(len(rows[0])) if rows[y][x] in set('PCKSFMNIkgHBOExJD') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)
for k,st in {'s_plaza':(3,11),'s_calle':(0,3),'s_poblacion':(0,3),'s_centro':(7,8)}.items():
    rows=[r.replace('@',',') for r in E_[k]];R2=bfs2(rows,st)
    missing=[(x,y,rows[y][x]) for y in range(len(rows)) for x in range(len(rows[0])) if rows[y][x] in set('PCKSFMNIkgHBOExJD') and (x,y) not in R2]
    print(k,'reach',len(R2),'MISSING' if missing else 'ok',missing)

N.update(E_)
for k,v in N.items():
    w=len(v[0])
    for i,r in enumerate(v): assert len(r)==w,(k,i,len(r),w,r)
    print(k,w,len(v))
M.update(N)
# inaltu right exit

# Floor-3 puzzles: ordered rune stones (N) and the rock (E) they move aside
PZPATCH={
 'd3':{(19,3):'E',(4,1):'N',(8,4):'N',(13,5):'N'},
 'nd3':{(3,7):'E',(2,6):'E',(1,7):'E',(16,1):'N',(5,5):'N',(19,6):'N'},
 'pd3':{(20,7):'E',(21,6):'E',(22,7):'E',(21,8):'E',(3,2):'N',(14,2):'N',(10,6):'N'},
 'wd3':{(3,7):'E',(2,6):'E',(1,7):'E',(6,2):'N',(12,4):'N',(18,6):'N'},
 'ed3':{(18,7):'E',(19,6):'E',(19,8):'E',(20,7):'E',(2,2):'N',(7,4):'N',(14,7):'N'},
}
for _mk,_cells in PZPATCH.items():
    _rows=[list(r) for r in M[_mk]]
    for (_x,_y),_ch in _cells.items():
        assert _rows[_y][_x] not in 'S%',(_mk,_x,_y,_rows[_y][_x])
        _rows[_y][_x]=_ch
    M[_mk]=[''.join(r) for r in _rows]

# Floor-3 puzzles: ordered rune stones (N) and the rock (E) they move aside
PZPATCH={
 'd3':{(19,3):'E',(4,1):'N',(8,4):'N',(13,5):'N'},
 'nd3':{(3,7):'E',(2,6):'E',(1,7):'E',(16,1):'N',(5,5):'N',(19,6):'N'},
 'pd3':{(20,7):'E',(21,6):'E',(22,7):'E',(21,8):'E',(3,2):'N',(14,2):'N',(10,6):'N'},
 'wd3':{(3,7):'E',(2,6):'E',(1,7):'E',(6,2):'N',(12,4):'N',(18,6):'N'},
 'ed3':{(18,7):'E',(19,6):'E',(19,8):'E',(20,7):'E',(2,2):'N',(7,4):'N',(14,7):'N'},
}
for _mk,_cells in PZPATCH.items():
    _rows=[list(r) for r in M[_mk]]
    for (_x,_y),_ch in _cells.items():
        assert _rows[_y][_x] not in 'S%',(_mk,_x,_y,_rows[_y][_x])
        _rows[_y][_x]=_ch
    M[_mk]=[''.join(r) for r in _rows]

# Subtle landscape tells at the six secret-boss patches: a few region-true
# scenery pieces (tufts or stones) ringing the trigger area with gaps.
SECRING={
 'l_wapi':((20,22,10,11),'"','.'),
 'n_winkul':((27,28,2,4),'#',','),
 'p_pire':((4,6,14,15),'#','.'),
 'w_trayen':((13,15,7,8),'"',','),
 'e_salitral':((15,16,8,10),'#','.'),
 'g_puel':((22,24,8,9),'"',','),
}
for _mk,((_x0,_x1,_y0,_y1),_ch,_fl) in SECRING.items():
    _rows=[list(r) for r in M[_mk]]
    _h=len(_rows);_w=len(_rows[0])
    _perim=[]
    for _x in range(_x0-1,_x1+2):
        _perim.append((_x,_y0-1));_perim.append((_x,_y1+1))
    for _y in range(_y0,_y1+1):
        _perim.append((_x0-1,_y));_perim.append((_x1+1,_y))
    _ok=[(_x,_y) for (_x,_y) in _perim if 0<_x<_w-1 and 0<_y<_h-1 and _rows[_y][_x]==_fl]
    _ok=sorted(set(_ok))
    _pick=_ok[::max(1,len(_ok)//5)][:5]
    for (_x,_y) in _pick:_rows[_y][_x]=_ch
    M[_mk]=[''.join(r) for r in _rows]
    print('SECRING',_mk,_pick)
open(OUT,'w',encoding='utf-8').write('const MAPROWS='+json.dumps(M,ensure_ascii=False)+';\n')
for k in ['nd1','nd2','nd3']:
    print(k);[print(i,r) for i,r in enumerate(N[k])]
