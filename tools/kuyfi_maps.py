"""Pukem's own overworld maps for Kuyfi Mapu (the dungeon floors reuse Game 1's proven puzzle grids).
Run: python3 tools/kuyfi_maps.py  -> src/kuyrows.js"""
import json, os, random
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src','kuyrows.js')
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src','maprows.js'),encoding='utf-8').read()
G1=json.loads(src[len('const MAPROWS='):-2])
M={}
class Grid:
    def __init__(s,w,h,fill='.'):s.w,s.h=w,h;s.g=[[fill]*w for _ in range(h)]
    def border(s,ch='T'):
        for x in range(s.w):s.g[0][x]=s.g[s.h-1][x]=ch
        for y in range(s.h):s.g[y][0]=s.g[y][s.w-1]=ch
    def put(s,x,y,ch):
        if 0<=x<s.w and 0<=y<s.h:s.g[y][x]=ch
    def rect(s,x0,y0,x1,y1,ch):
        for y in range(y0,y1+1):
            for x in range(x0,x1+1):s.put(x,y,ch)
    def hline(s,y,x0,x1,ch):s.rect(x0,y,x1,y,ch)
    def vline(s,x,y0,y1,ch):s.rect(x,y0,x,y1,ch)
    def ruka(s,x,y):s.rect(x,y,x+2,y+1,'R')       # door at (x+1, y+1)
    def scatter(s,ch,n,seed,box=None,on='.'):
        r=random.Random(seed);x0,y0,x1,y1=box or (1,1,s.w-2,s.h-2);k=0;tries=0
        while k<n and tries<2000:
            tries+=1;x,y=r.randint(x0,x1),r.randint(y0,y1)
            if s.g[y][x]==on:s.g[y][x]=ch;k+=1
    def rows(s):return [''.join(r) for r in s.g]

# ---- Pukem lof: 34x15. exits: west (row 8) -> fog road, north (cols 16-17) -> snow forest, east (row 8) -> frozen wetland
g=Grid(34,15);g.border()
g.hline(8,0,33,'=')                      # the road through the lof
g.vline(16,1,7,'=');g.vline(17,1,7,'=');g.put(16,0,'.');g.put(17,0,'.')   # path north
g.ruka(2,2)                              # Liwen's ruka, door (3,3)
g.ruka(8,2)                              # the kimche kuku's ruka, door (9,3)
g.ruka(24,2)                             # the lonko's ruka (no door used)
g.ruka(26,10)                            # the empty ruka, door (27,11)
g.ruka(3,10)                             # a family ruka
g.put(14,5,'F')                          # the kütral of the lof
g.put(6,3,'Z')                           # a loom by Liwen's ruka
g.put(21,9,'U')                          # a cooking pot
g.rect(29,12,32,13,'T');g.rect(1,12,1,13,'T')
g.put(12,11,'#');g.put(20,12,'#');g.put(31,4,'#')
g.scatter('"',8,11,(1,9,33,13))
g.put(27,12,'.')
M['k_lof']=g.rows()

# ---- Pire mawida, the snow forest: 32x15. exits: south (cols 16-17) -> lof, east (row 7) -> the hill
g=Grid(32,15);g.border()
g.vline(16,8,14,'=');g.vline(17,8,14,'=');g.put(16,14,'.');g.put(17,14,'.')
g.hline(7,16,31,'=');g.put(31,7,'=')
for (x,y,w,h) in [(2,2,4,3),(9,1,3,4),(20,2,5,2),(3,9,5,3),(10,10,4,3),(21,10,6,3),(24,4,2,2)]:g.rect(x,y,x+w-1,y+h-1,'T')
g.rect(26,1,30,4,'#');g.rect(27,2,29,3,'.');g.put(28,4,'K');g.put(28,2,'C')     # a riddle door guards a nook
g.put(4,6,'C');g.put(13,6,'M');g.put(8,13,'M');g.put(29,12,'m')
g.scatter('"',10,21)
M['k_mawida']=g.rows()

# ---- Pukem menoko, the frozen wetland: 32x13. exits: west (row 6) -> lof, north (cols 26-27) -> the hill
g=Grid(32,13);g.border()
g.hline(6,0,20,'=');g.put(0,6,'=')
g.vline(26,0,6,'=');g.vline(27,0,6,'=');g.hline(6,20,27,'=')
for (x,y,w,h) in [(3,1,6,3),(11,8,7,3),(22,9,6,2),(2,9,4,2)]:g.rect(x,y,x+w-1,y+h-1,'~')
g.rect(13,1,19,4,'#');g.rect(14,2,18,3,'.');g.put(16,4,'E');g.put(16,2,'C')     # a stone door, opened by the -ke- stone
g.put(12,5,'H')
g.scatter('"',14,31)
g.put(29,10,'g');g.put(7,11,'M')
M['k_menoko']=g.rows()

# ---- Winkul, the hill: 32x15. exits: west (row 7) -> snow forest, south (cols 26-27) -> wetland
g=Grid(32,15);g.border()
g.hline(7,0,26,'=');g.put(0,7,'=')
g.vline(26,7,14,'=');g.vline(27,7,14,'=');g.put(26,14,'.');g.put(27,14,'.')
g.rect(8,1,23,3,'#');g.rect(10,2,21,2,'.')        # the ridge
g.put(15,5,'F')                                   # a kütral at the top: rest and save
g.put(11,2,'C');g.put(20,2,'p')
for (x,y,w,h) in [(2,10,4,3),(10,10,5,3),(18,11,4,2),(29,2,2,3)]:g.rect(x,y,x+w-1,y+h-1,'T')
g.rect(10,2,10,2,'.');g.put(15,3,'.');g.put(16,3,'.')   # a gap in the ridge, up to the chest walk
g.scatter('"',10,41)
M['k_winkul']=g.rows()

# ---- the Kolokolo's burrow: three new floors and the den
def dg(w,h):
    g=Grid(w,h,'%');return g
# floor 1: braziers in season order open the stone door; a key opens a side closet
g=dg(22,11)
g.rect(1,1,6,9,'_');g.hline(5,0,9,'_')                    # entry room + corridor (enter from the west, row 5)
g.rect(10,1,17,9,'_')                                     # brazier hall
g.rect(19,1,20,9,'_');g.put(18,5,'E')                     # behind the stone door: the stairs
g.rect(8,8,8,9,'_');g.put(8,7,'L');g.put(8,6,'_')         # locked closet under the corridor
g.put(1,1,'F');g.put(3,8,'k');g.put(8,9,'C');g.put(20,1,'C');g.put(20,9,'S')
g.put(11,2,'J');g.put(14,2,'J');g.put(17,2,'J');g.put(13,8,'I')
M['kd1']=g.rows()
# floor 2: push the two stone blocks onto the plates to lift the gate; the -yu- stone opens the last door
g=dg(22,11)
g.rect(1,1,9,9,'_');g.hline(5,0,1,'_')                    # block room (enter from the west, row 5)
g.put(3,3,'B');g.put(7,3,'B');g.put(3,7,'O');g.put(7,7,'O')
g.put(10,5,'G');g.rect(11,1,17,9,'_')                     # the gate, then the guard room
g.put(13,2,'C');g.put(16,8,'K')
g.put(14,5,'H');g.put(18,5,'E');g.rect(19,1,20,9,'_');g.put(20,9,'S');g.put(19,1,'C')
g.rect(15,9,17,9,'%');g.put(16,9,'C');g.put(16,8,'K')   # a riddle door guards a nook
M['kd2']=g.rows()
# floor 3: touch the season stones in order; the last guards wait at the bottom
g=dg(22,9)
g.rect(1,1,20,7,'_');g.hline(4,0,1,'_')
g.vline(7,1,5,'%');g.vline(14,3,7,'%')                    # two partitions make a winding hall
g.put(3,2,'N');g.put(10,6,'N');g.put(17,2,'N')
g.rect(18,5,20,7,'_');g.put(18,4,'E');g.rect(18,4,18,4,'E');g.put(19,4,'%');g.put(20,4,'%')
g.put(20,7,'S');g.put(1,7,'F');g.put(11,1,'C')
M['kd3']=g.rows()
den=[list(r) for r in G1['ngen']]
for y,r in enumerate(den):
    for x,c in enumerate(r):
        if c=='~':den[y][x]='%'
        elif c=='.':den[y][x]='_'
        elif c=='A':den[y][x]='_'
M['kd_den']=[''.join(r) for r in den]
M['k_ruka1']=G1['l_ruka1'];M['k_ruka3']=G1['l_trawun']
r2=[list(r) for r in G1['l_ruka2']]
r2[3][7]='S'   # a hole in the floor: down into the Kolokolo's burrow
M['k_ruka2']=[''.join(r) for r in r2]
open(OUT,'w',encoding='utf-8').write('const KYROWS='+json.dumps(M,ensure_ascii=False)+';\n')
for k in ['kd1','kd2','kd3']:
    print(k);[print('%2d'%i,r) for i,r in enumerate(M[k])]
