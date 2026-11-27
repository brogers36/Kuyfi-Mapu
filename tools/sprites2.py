"""Pixel templates for animals and the Witranalwe. Run to regenerate src/spr2.js."""
import json,os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src','spr2.js')
class G:
    def __init__(s,w,h):s.w,s.h=w,h;s.a=[['.']*w for _ in range(h)]
    def p(s,x,y,c):
        if 0<=x<s.w and 0<=y<s.h:s.a[y][x]=c
    def r(s,x,y,w,h,c):
        for yy in range(y,y+h):
            for xx in range(x,x+w):s.p(xx,yy,c)
    def e(s,cx,cy,rx,ry,c):
        for yy in range(s.h):
            for xx in range(s.w):
                if ((xx+.5-cx)/rx)**2+((yy+.5-cy)/ry)**2<=1:s.p(xx,yy,c)
    def get(s,x,y):return s.a[y][x] if 0<=x<s.w and 0<=y<s.h else '.'
    def outline(s,o='o'):
        add=[]
        for y in range(s.h):
            for x in range(s.w):
                if s.a[y][x]=='.' and any(s.get(x+dx,y+dy) not in '.o' for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):add.append((x,y))
        for x,y in add:s.a[y][x]=o
    def rows(s):return[''.join(r) for r in s.a]

def horse(fr):
    g=G(30,24)
    # body
    g.e(17.5,11.5,9,5,'b');g.r(10,9,15,6,'b')
    g.r(11,14,13,2,'B');g.e(17.5,15,8,1.6,'B')
    g.r(11,8,13,1,'h');g.r(12,9,9,1,'h')
    # neck + head (left)
    for i in range(7):g.r(5+i,3+i,4,4,'b')
    g.e(4,5.5,3.2,2.6,'b');g.r(1,5,4,3,'b');g.r(1,7,3,1,'n');g.p(0,6,'b')
    g.p(4,4,'e');g.p(2,5,'w');g.p(2,6,'w');g.p(3,4,'w')
    g.r(5,0,1,3,'b');g.r(7,0,1,3,'b');g.p(5,0,'B');g.p(7,0,'B')
    # mane
    for i in range(8):g.r(7+i,1+i,2,2,'m')
    # tail
    g.r(26,9,2,2,'m');g.r(27,10,2,6,'m');g.r(28,15,1,3,'m')
    # legs
    L=[(11,0),(14,1),(20,0),(23,1)]
    for x,ph in L:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,16,2,6-dy,'B' if ph else 'b');g.r(x,22-dy,2,1,'k')
    g.outline();return g.rows()
def cow(fr):
    g=G(30,22)
    g.e(17,10.5,9.5,5.5,'w');g.r(9,7,17,7,'w');g.r(10,14,15,1,'W')
    for (x,y,rx,ry) in [(13,9,3,2.4),(21,8,2.6,2),(23,12,2.4,1.8),(16,13,2,1)]:g.e(x,y,rx,ry,'k')
    # head
    g.e(5,8,3.6,3.6,'w');g.r(2,9,6,4,'w');g.r(1,10,6,3,'u');g.p(2,11,'n');g.p(5,11,'n')
    g.p(4,7,'e');g.p(7,7,'k');g.p(6,6,'k')
    g.r(1,4,2,1,'c');g.p(0,3,'c');g.r(7,4,2,1,'c');g.p(9,3,'c');g.r(0,6,2,1,'W');g.r(8,6,2,1,'W')
    g.r(26,8,1,6,'W');g.r(26,13,2,2,'k')
    g.r(19,15,3,2,'u')
    L=[(10,0),(13,1),(20,0),(23,1)]
    for x,ph in L:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,15,2,5-dy,'W' if ph else 'w');g.r(x,20-dy,2,1,'K')
    g.outline();return g.rows()
def sheep(fr):
    g=G(22,18)
    for (x,y,r) in [(8,7,3.2),(12,6,3.4),(16,7,3.2),(7,10,3),(11,11,3.4),(15,10.5,3.2),(18,9,2.4)]:g.e(x,y,r,r*0.9,'w')
    for (x,y) in [(9,5),(13,4),(16,6),(10,9),(14,9),(8,11),(17,10)]:g.p(x,y,'W')
    for (x,y) in [(12,8),(15,8),(9,8),(12,12)]:g.p(x,y,'s')
    g.e(4,8,2.6,2.4,'f');g.r(1,8,3,3,'f');g.p(3,7,'e');g.r(4,5,2,1,'f');g.p(1,10,'n')
    for x,ph in [(8,0),(10,1),(14,0),(16,1)]:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,13,1,4-dy,'f')
    g.outline();return g.rows()
def witranalwe(fr):
    W=26;g=G(W,56);c=W/2
    def sym(x,y,w,h,col):g.r(x,y,w,h,col);g.r(W-x-w,y,w,h,col)
    # glow aura left to render
    # hat
    sym(7,0,6,4,'H');sym(7,3,6,1,'h');sym(2,4,11,2,'H');sym(3,6,10,1,'q')
    # face
    sym(9,7,4,6,'F');sym(9,11,1,2,'f');sym(10,13,3,1,'f');sym(11,14,2,1,'F')
    g.p(10,9,'E');g.p(W-11,9,'E');g.p(10,10,'e');g.p(W-11,10,'e')
    sym(11,12,2,1,'f')
    # poncho
    for y in range(15,38):
        hw=5+int((y-15)*5/23)
        for x in range(int(c-hw),int(c)):
            col='P'
            if x<c-hw+2:col='q'
            elif x>c-3 and y>17:col='p'
            g.p(x,y,col);g.p(W-1-x,y,col)
    # silver step pattern rows
    for y0 in (22,30):
        for x in range(0,W):
            if g.get(x,y0+1) not in 'Ppq':continue
            k=x%6
            if k in (0,1,2):g.p(x,y0+2,'s')
            if k in (2,3,4):g.p(x,y0,'s')
            if k in (2,):g.p(x,y0+1,'s')
            if k==5:g.p(x,y0+1,'s')
    sym(12,15,1,22,'q')  # center fold line
    # arms (long, hanging, hugging the poncho)
    sym(5,15,3,2,'P')
    for y in range(16,44):
        hw=5+int((min(y,37)-15)*5/23);x0=int(c-hw)-2
        if y>=34:x0-=fr
        sym(x0,y,2,1,'A')
        if y<38:g.p(x0+1,y,'q');g.p(W-x0-2,y,'q')
    x0=int(c-10)-2-fr
    for y in range(44,47):sym(x0-1,y,3,1,'K')
    sym(x0-1,47,1,1,'K');sym(x0+1,47,1,1,'K')
    # legs
    for y in range(38,53):sym(9,y,2,1,'L')
    sym(8,53,3,1,'L')
    g.outline();return g.rows()

def line(g,x0,y0,x1,y1,c):
    n=max(abs(x1-x0),abs(y1-y0),1)
    for i in range(n+1):g.p(round(x0+(x1-x0)*i/n),round(y0+(y1-y0)*i/n),c)
def chonchon(fr):
    W=32;g=G(W,22);cx=W/2
    A=(11,10)
    T=[(2,0),(0,8),(4,15)] if fr==0 else [(1,5),(1,13),(6,19)]
    def tri(a,b,c,x,y):
        d=lambda p,q,r:(p[0]-r[0])*(q[1]-r[1])-(q[0]-r[0])*(p[1]-r[1])
        P=(x+.5,y+.5);d1,d2,d3=d(P,a,b),d(P,b,c),d(P,c,a)
        return not((d1<0 or d2<0 or d3<0) and (d1>0 or d2>0 or d3>0))
    for y in range(g.h):
        for x in range(0,12):
            if tri(A,T[0],T[1],x,y) or tri(A,T[1],T[2],x,y):
                g.p(x,y,'v' if abs(x-A[0])+abs(y-A[1])<5 else 'w')
    for a,b in [(T[0],T[1]),(T[1],T[2])]:
        mx,my=(a[0]+b[0])/2,(a[1]+b[1])/2;ox,oy=mx-A[0],my-A[1];L=(ox*ox+oy*oy)**.5
        r=((a[0]-b[0])**2+(a[1]-b[1])**2)**.5*.5;ccx,ccy=mx+ox/L*r*.55,my+oy/L*r*.55
        for y in range(g.h):
            for x in range(0,12):
                if (x+.5-ccx)**2+(y+.5-ccy)**2<r*r and g.a[y][x] in 'wv':g.a[y][x]='.'
    for t in T:line(g,A[0],A[1],t[0],t[1],'b')
    line(g,A[0],A[1]-1,T[0][0],T[0][1],'b')
    g.p(T[0][0],T[0][1],'c');g.p(T[0][0]+1,T[0][1],'c')
    for y in range(g.h):
        for x in range(0,12):g.a[y][W-1-x]=g.a[y][x]
    # head
    g.e(cx,11.5,5.6,6.6,'s')
    for y in range(4,19):
        for x in range(10,23):
            if g.a[y][x]=='s' and x>=cx+2:g.a[y][x]='S'
    g.e(cx,6.2,5.8,2.6,'h');g.r(10,6,2,5,'h');g.r(20,6,2,5,'h');g.r(15,7,2,1,'s')
    # brows
    for x,y in [(12,9),(13,9),(14,10),(17,10),(18,9),(19,9)]:g.p(x,y,'h')
    # eyes 2x2
    for x,c in [(12,'W'),(13,'r'),(18,'r'),(19,'W')]:g.p(x,11,c)
    for x,c in [(12,'W'),(13,'k'),(18,'k'),(19,'W')]:g.p(x,12,c)
    # nose, cheeks, mouth, fangs
    g.p(15,12,'S');g.p(15,13,'S');g.p(16,14,'S');g.p(15,14,'S')
    g.p(11,14,'q');g.p(20,14,'q')
    g.r(13,16,6,1,'m');g.p(13,15,'S');g.p(18,15,'S');g.p(14,17,'W');g.p(17,17,'W');g.r(15,17,2,1,'m')
    g.r(14,18,4,1,'S')
    g.outline();return g.rows()

def kutral(fr):
    g=G(16,19)
    g.e(8,12.5,6,6,'r');g.e(8,13,4.6,4.8,'O');g.e(8,14,3,3.4,'y');g.e(8,15,1.6,1.8,'w')
    tips=[(4,7,1.2,3),(8,4,1.6,4.5),(12,6,1.2,3.5)] if fr==0 else [(4,6,1.2,3.5),(8,5,1.6,4),(12,7,1.2,3)]
    for x,y,rx,ry in tips:g.e(x,y,rx,ry,'r');g.e(x,y+1.5,rx*.6,ry*.6,'O')
    g.p(6,12,'k');g.p(10,12,'k');g.p(6,11,'k');g.p(10,11,'k');g.r(7,15,3,1,'k')
    g.outline();return g.rows()
def pire(fr):
    g=G(18,18)
    g.e(9,8,6,5.5,'w');g.e(9,12,4.5,3,'w');g.e(8.5,13.5+fr*.5,2.6,3.2,'w')
    for y in range(3,15):
        for x in range(18):
            if g.a[y][x]=='w' and x>=11:g.a[y][x]='b'
    g.e(9,16+fr,1.4,1.2,'b')
    for (x,y) in [(2,4),(15,3),(1,10),(16,11)]:
        g.p(x,y,'c');g.p(x-1,y,'c');g.p(x+1,y,'c');g.p(x,y-1,'c');g.p(x,y+1,'c')
    g.r(6,7,2,2,'k');g.r(11,7,2,2,'k');g.p(6,7,'c');g.p(11,7,'c')
    g.r(8,11,2,1,'k')
    g.outline();return g.rows()
def kura(fr):
    g=G(20,17)
    g.e(10,9,7,6,'g');g.r(4,9,12,6,'g');g.e(10,5,5,3.5,'g')
    for y in range(17):
        for x in range(20):
            if g.a[y][x]=='g' and (x>12 or y>12):g.a[y][x]='G'
    g.r(1,8+fr,3,5,'G');g.r(16,8+(1-fr),3,5,'G')
    g.r(5,15,4,2,'G');g.r(11,15,4,2,'G')
    for (x,y) in [(7,9),(8,10),(8,11),(13,6),(12,7),(11,12),(12,13),(5,6)]:g.p(x,y,'k')
    g.r(7,5,2,1,'e');g.r(12,5,2,1,'e');g.p(10,3,'h');g.p(9,4,'h');g.p(6,8,'h')
    g.outline();return g.rows()
def ngurufilu(fr):
    g=G(40,26)
    sw=fr
    # thin tail sweeping along the ground to the right
    tail=[(16,21.2),(19.5,22.4),(23.5,22.8),(27.5,22.2),(30.8,20.8)]
    for i,(x,y) in enumerate(tail):
        rr=2.0-i*.14;g.e(x,y,rr,rr*.9,'B')
    # bushy black tail tip, flicking up
    tip=[(33.2,19.0),(35.2,17.0),(36.6,14.8),(37.6,12.8)] if sw else [(33.4,19.6),(35.6,18.2),(37.2,16.4),(38.2,14.6)]
    for i,(x,y) in enumerate(tip):
        g.e(x,y,2.4-i*.35,2.0-i*.3,'k')
        g.p(int(x)-1,int(y)-1,'K')
    # body coil (spine points, neck side first)
    pts=[(12,10.6),(14.6,8.4),(17.8,7.2),(21,7.0),(24.2,8.0),(26.6,10.2),(27.8,13.2),(27.2,16.2),(24.6,18.4),(21.2,19.3),(17.8,18.9),(15.2,17.2)]
    for i,(x,y) in enumerate(pts):
        rr=3.2 if i<8 else 3.2-(i-7)*.25
        g.e(x,y,rr,rr*.92,'b')
    # pale belly along the lower arc
    for (x,y) in pts[7:]:
        g.e(x-.2,y+1.0,1.9,1.0,'w')
    for (x,y) in pts[8:]:
        g.p(int(x),int(y)+2,'W')
    # dark-edged patches with light centres and glints
    for i,(x,y) in enumerate(pts):
        if i%2==0:
            g.e(x,y-.4,2.1,1.6,'B')
            g.e(x,y-.5,1.3,1.0,'g')
            g.p(int(x),int(y)-1,'y')
        else:
            g.p(int(x)+1,int(y),'B')
    # black spiked crest along the outer edge of the coil (clear of the head)
    crest={2:(0,-1),3:(0,-1),4:(.5,-.9),5:(.9,-.5),6:(1,0),7:(.9,.5),8:(.4,.9)}
    for i,(nx,ny) in crest.items():
        x,y=pts[i]
        bx,by=x+nx*3.1,y+ny*3.0
        ln=2+((i+sw)%2)
        for k in range(ln+1):
            g.p(int(bx+nx*k),int(by+ny*k),'k')
            g.p(int(bx+nx*k+(1 if abs(ny)>abs(nx) else 0)),int(by+ny*k+(1 if abs(nx)>=abs(ny) else 0)),'k')
        g.p(int(bx),int(by),'K')
    # neck joining head to coil
    g.e(10,11.6,2.8,2.6,'b')
    # black forelegs with claws
    for (lx,ph) in [(9,0),(12,1)]:
        dy=(ph+sw)%2
        g.r(lx,16+dy,2,7-dy,'k')
        g.p(lx-1,23,'k');g.p(lx,23,'k');g.p(lx+2,23,'k')
        g.p(lx-1,24,'k');g.p(lx+2,24,'k')
        g.p(lx,17+dy,'K')
    # head: long-snouted fox, low and watchful
    g.e(6.5,10.8,3.4,3.0,'b')
    g.r(2,9,4,2,'b')
    g.r(0,10,5,2,'b')
    g.r(0,12,3,1,'w')
    g.r(0,10,2,1,'B')
    g.r(0,12,1,1,'k');g.p(0,11,'k')
    g.e(6.4,12.8,2.8,1.2,'w')
    # tall dark ears, inner russet
    for ex in (4,8):
        g.p(ex+1,3,'k');g.r(ex,4,2,3,'k');g.r(ex,7,3,2,'k')
        g.p(ex+1,6,'r')
    # brow + eye: amber with dark pupil
    g.r(6,8,3,1,'B')
    g.p(6,10,'e');g.p(7,10,'e');g.p(7,11,'n')
    g.outline();return g.rows()
def cherrufe(fr):
    W=44;g=G(W,46);c=W/2
    def sym(x,y,w,h,col):g.r(x,y,w,h,col);g.r(W-x-w,y,w,h,col)
    # legs
    sym(13,36,6,8,'B');sym(12,43,8,2,'B')
    # torso
    g.e(c,27,12,11,'b');g.r(10,22,24,12,'b')
    # arms
    sw=fr
    sym(3,20+sw,7,6,'b');sym(2,25+sw,6,12,'B');sym(1,36+sw,8,4,'b')
    # head
    g.e(c,13,8,7,'b');g.r(15,13,14,6,'b')
    # flame hair
    flames=[(15,6,2,4),(19,3,2,5),(22,2,2.4,6),(25,3,2,5),(29,6,2,4)]
    for x,y,rx,ry in flames:
        yy=y+(fr if x%2 else -fr)*0
        g.e(x,yy+fr*.5,rx,ry,'r');g.e(x,yy+1.5,rx*.6,ry*.6,'O')
    # shading right side
    for y in range(46):
        for x in range(W):
            if g.a[y][x]=='b' and x>=c+5:g.a[y][x]='B'
    # lava cracks
    cracks=[(18,22),(19,23),(19,24),(20,25),(26,21),(25,22),(25,23),(24,24),(21,30),(22,31),(23,31),(24,32),(14,28),(15,29),(29,28),(30,29),(4,27),(5,28),(39,27),(38,28),(16,38),(27,38)]
    for x,y in cracks:g.p(x,y,'l')
    g.e(c,28,3.2,3,'L');g.e(c,28,1.8,1.6,'y')
    # face
    sym(17,12,3,2,'y');g.p(18,12,'w');g.p(W-19,12,'w')
    sym(16,10,4,1,'B')
    g.r(18,16,8,2,'k');sym(18,16,1,1,'l');g.r(20,16,4,1,'L')
    g.outline();return g.rows()

def thick(g,x0,y0,x1,y1,r,c):
    n=int(max(abs(x1-x0),abs(y1-y0))*2)+1
    for i in range(n+1):
        x=x0+(x1-x0)*i/n;y=y0+(y1-y0)*i/n
        for yy in range(int(y-r-1),int(y+r+2)):
            for xx in range(int(x-r-1),int(x+r+2)):
                if (xx+.5-x)**2+(yy+.5-y)**2<=r*r:g.p(xx,yy,c)
def kowek(fr):
    g=G(18,18);import math
    g.e(9,11,6.5,5.5,'b');g.e(9,7,3.6,4.6,'b');g.p(9,1+fr,'b');g.p(9,2,'b');g.r(8,3,3,2,'b')
    for y in range(18):
        for x in range(18):
            if g.a[y][x]=='b' and x>10:g.a[y][x]='B'
    g.e(6.5,9,1.6,2.6,'l');g.p(6,7,'w')
    g.r(6,11,2,2,'k');g.r(11,11,2,2,'k');g.p(6,11,'w');g.p(11,11,'w');g.r(8,14,3,1,'k')
    for (x,y) in [(2,15-fr),(15,14+fr),(3,6+fr)]:g.p(x,y,'l')
    g.outline();return g.rows()
def mawek(fr):
    g=G(24,20)
    for (x,y,r) in [(7,8,4.5),(12,6,5.5),(17,8,4.5),(12,10,6)]:g.e(x,y,r*1.1,r*.85,'c')
    for y in range(20):
        for x in range(24):
            if g.a[y][x]=='c' and y>9:g.a[y][x]='C'
    g.r(8,8,3,1,'k');g.r(14,8,3,1,'k');g.p(9,9,'y');g.p(15,9,'y');g.r(10,12,5,1,'k')
    for i,x in enumerate((6,10,14,18)):
        y0=15+((i+fr)%2)*2
        g.p(x,y0,'d');g.p(x,y0+1,'d')
    g.outline();return g.rows()
def kamawetu(fr):
    g=G(28,22)
    g.e(16,11,8,4.6,'b');g.r(9,9,14,6,'b')
    for y in range(22):
        for x in range(28):
            if g.a[y][x]=='b' and y>12:g.a[y][x]='B'
    g.e(6,9,4,3.6,'b');g.r(2,9,4,3,'b');g.r(1,10,3,2,'m');g.p(2,10,'k')
    g.p(5,8,'k');g.p(5,7,'e')
    for i in range(6):g.p(6+i//2,6-i,'y');g.p(7+i//2,6-i,'Y')
    g.r(8,6,2,2,'b');g.p(8,5,'b')
    g.r(24,9,1,5,'B');g.r(24,13,2,2,'k')
    for x,ph in [(10,0),(13,1),(19,0),(22,1)]:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,15,2,5-dy,'B');g.r(x,20-dy,2,1,'f')
    for (x,y) in [(9,21),(14,21),(20,21),(24,20)]:g.p(x,y,'f')
    g.outline();return g.rows()
def basilisko(fr):
    g=G(28,24);import math
    pts=[(10,14),(13,17),(17,18),(21,17),(23,14),(22,11),(19,10),(17,12),(18,15)] if fr==0 else [(10,14),(13,18),(17,19),(21,18),(24,15),(23,12),(20,10),(17,12),(18,15)]
    for i,(x,y) in enumerate(pts):
        r=3.2-i*.2;g.e(x,y,r,r,'s')
    for i,(x,y) in enumerate(pts):
        if i%2:g.p(x,y-1,'S');g.p(x+1,y,'S')
    # rooster head & neck
    g.e(8,10,3.4,4.6,'s');g.e(7,6,3.6,3.4,'w')
    g.r(5,1,1,3,'r');g.r(6,0,1,4,'r');g.r(7,1,1,3,'r');g.r(8,2,1,2,'r')
    g.r(1,6,3,2,'y');g.p(0,7,'y');g.p(3,9,'r');g.p(4,9,'r');g.p(4,10,'r')
    g.p(6,5,'e');g.p(6,6,'k')
    g.outline();return g.rows()
def kaleuche(fr):
    W=62;g=G(W,54);import math
    # rotting hull with gaps
    for y in range(32,46):
        x0=6+int((y-32)*.9);x1=56-int((y-32)*.6)
        for x in range(x0,x1):
            if 34<y<44 and (x*7+y*5)%23<2:continue
            g.p(x,y,'h' if y<40 else 'H')
    g.r(4,30,54,2,'H');g.r(2,28,8,4,'h');g.r(50,26,9,6,'h')
    # plank shadow lines
    for y in range(33,46,3):
        for x in range(8,54):
            if g.get(x,y)=='h':g.p(x,y,'k')
    # exposed pale ribs along the hull
    for rx in range(10,54,7):
        for i in range(11):
            x=rx+int(i*.35);y=33+i
            if g.get(x,y) in ('h','H','k'):g.p(x,y,'b')
    # slime dripping from the rail
    for x in range(8,56,5):
        ln=2+((x*13)%4)
        for i in range(ln):g.p(x,32+i,'Q')
    # skull figurehead at the prow
    g.r(1,23,5,5,'b');g.p(2,25,'k');g.p(4,25,'k');g.r(2,27,3,1,'k');g.p(3,22,'b')
    # masts, one splintered
    for mx,top in [(16,6),(30,2),(44,8)]:g.r(mx,top,2,28-top,'m')
    g.p(43,16,'m');g.p(42,17,'m');g.p(45,15,'k')
    # tattered sails: ragged holes and hanging shreds
    for mx,top,w,h in [(16,8,8,16),(30,4,9,20),(44,10,7,14)]:
        for y in range(top,top+h):
            bulge=int(1.4*math.sin((y-top)/h*math.pi))
            for x in range(mx-w//2-bulge,mx+w//2+2+bulge):
                if g.a[y][x]=='.':g.p(x,y,'s')
        for y in range(top,top+h,4):g.r(mx-w//2,y,w+2,1,'S')
        for k in range(7):
            x=mx-w//2+((k*5+fr*2)%(w+1));yy=top+h-2-(k%3)*2
            for y in range(yy,top+h):g.p(x,y,'.')
        for k in range(3):
            hx=mx-w//2+2+k*3;hy=top+3+(k*5+fr)% (h-6)
            g.p(hx,hy,'.');g.p(hx+1,hy,'.');g.p(hx,hy+1,'.')
        for x in range(mx-w//2,mx+w//2+2,3):
            ln=1+((x*7+fr)%3)
            for i in range(ln):
                if g.get(x,top+h+i)=='.':g.p(x,top+h+i,'S')
        for x in range(mx-w//2,mx+w//2+2,4):g.p(x,top+h//2,'S')
    # black tattered flag
    g.r(30,0,1,3,'m')
    for i in range(4-fr):g.p(31+i,0,'k');g.p(31+i,1,'k')
    # ghost flames on mast tops and lanterns
    for (x,y) in [(16,4),(30,0),(44,6)]:
        g.p(x,y+fr,'y');g.p(x+1,y+1,'y');g.p(x,y-1+fr,'e')
    for (x,y) in [(4,26),(58,22)]:g.r(x,y,2,3,'y');g.p(x,y-1,'e');g.p(x+1,y+3,'y')
    # shadow crew at the rail, eyes glowing
    for (cx2,cy2) in [(12,25),(24,24),(38,25),(49,23)]:
        g.r(cx2,cy2,2,5,'q');g.e(cx2+1,cy2-1,1.4,1.4,'q')
        g.p(cx2,cy2-1,'e')
    # thick green fog at the waterline
    for x in range(0,W):
        y=45+int(1.8*math.sin(x*.4+fr*1.5))
        for yy in range(y,min(54,y+4)):g.p(x,yy,'f' if (x+yy)%3 else 'F')
    g.outline();return g.rows()
# ---------- hand-drawn secret bosses ----------
def chinifilu(fr):
    import math
    g=G(52,38)
    # giant serpent: rear coils sweeping right, neck rising to a wedge head at left
    rows=[
     (32,8, "HHHH"),
     (29,9, "HHhhhhhHH"),
     (27,10,"HhhhhhhhhhHH"),
     (25,11,"HhhhhbbbhhhhhH"),
     (24,12,"HhhhbbbbbbhhhhhH"),
     (23,13,"HhhhbbbbbbbbhhhhhH"),
     (22,14,"HhhhbbbbbbbbbbhhhhhH"),
     (22,15,"HhhbbbbHHHHbbbbhhhhhH"),
     (21,16,"HhhbbbHH..HHbbbbhhhhhH"),
     (21,17,"HhhbbbH....HbbbbhhhhhH"),
     (21,18,"HhhbbbHH..HHbbbbhhhhhH"),
     (22,19,"HhhbbbbHHHHbbbbhhhhH"),
     (11,20,"HHhhhhhhhhhhhhhhbbbbbbbbbbbbhhhhH"),
     (8,21, "HHhhhhhhhhhhhhhhhhhhhbbbbbbbbbbbhhhH"),
     (6,22, "HHhhhhbbbbbbbbhhhhhhhhhhhhbbbbbbbhhhH"),
     (5,23, "HhhhbbbbbbbbbbbbhhhhhhhhhhhhhhhhhhhH"),
     (4,24, "HhhbbbbbbbbbbbbbbbhhhhhhhhhhhhhhhhH"),
     (4,25, "HhhbbbbbbbbbbbbbbbbhhhhhHHHHHHHHH"),
     (4,26, "HhhhbbbbbbbbbbbbbbbbhhhH"),
     (5,27, "HhhhbbbbbbbbbbbbbbhhhH"),
     (6,28, "HhhhhbbbbbbbbbbhhhHH"),
     (8,29, "HHhhhhhhhhhhhhhhHH"),
     (10,30,"HHHhhhhhhhhHH"),
    ]
    for (x0,y,st2) in rows:
        for i,ch in enumerate(st2):
            if ch!='.':g.p(x0+i,y,ch)
    # neck arching from the first coil down-left to the head
    neck=[
     (12,12,"Hhhhh"),(11,13,"Hhhhhh"),(10,14,"Hhhhhhh"),(9,15,"Hhhhhhhh"),
     (8,16,"Hhhhhhhh"),(8,17,"Hhhhhhh"),(8,18,"Hhhhhh"),(9,19,"Hhhhh"),
    ]
    for (x0,y,st2) in neck:
        for i,ch in enumerate(st2):g.p(x0+i,y,ch)
    # wedge head facing left
    head=[
     (5,10,"Hhhh"),
     (3,11,"Hhhhhhh"),
     (2,12,"Hhhhhhhhh"),
     (1,13,"Hhhhhhhhhh"),
     (1,14,"hhhhhhhhhhh"),
     (1,15,"hhhhhhhhhhh"),
     (1,16,"Hhhhhhhhhh"),
     (2,17,"kkhhhhhhh"),
     (3,18,"wHhhhhh"),
    ]
    for (x0,y,st2) in head:
        for i,ch in enumerate(st2):g.p(x0+i,y,ch)
    g.r(4,13,3,2,'e');g.p(4,13,'k');g.p(6,14,'k')
    if fr:g.r(4,13,3,2,'k');g.p(5,14,'e')
    g.p(3,18,'w');g.p(6,18,'w')
    if fr:g.p(0,16,'t');g.p(1,16,'t')
    else:g.p(0,17,'t')
    # coarse mane: shaggy hair spikes along every top edge of the body
    for x in range(1,50):
        ys=[y for y in range(38) if g.get(x,y) not in ('.','t')]
        if not ys:continue
        top=min(ys)
        ln=1+((x*5+fr)%3)
        if x<34:ln+=1
        for i in range(1,ln+1):
            g.p(x,top-i,'M' if i>1 else 'm')
    # hair texture strokes on the body
    for k in range(26):
        x=8+k*17%44 if False else 8+(k*17)%42
        y=12+(k*7)%17
        if g.get(x,y)=='h':g.p(x,y,'m')
        if g.get(x+1,y)=='h':g.p(x+1,y,'H')
    # raised hairy tail tip at the far right
    for (x0,y,st2) in [(44,13,"HH"),(45,11,"hH"),(46,9,"hH"),(47,7,"hH"),(46,6,"MM"),(47,5,"Mm")]:
        for i,ch in enumerate(st2):g.p(x0+i,y,ch)
    g.outline();return g.rows()
def piwuchen(fr):
    import math
    g=G(56,44)
    w=fr  # wing beat
    # wings: great bat membranes with finger bones
    for sd,xm in ((1,28),(-1,27)):
        for k in range(4):
            # finger bones radiating
            ln=[22,24,22,16][k]
            ang=[-0.9,-0.45,0.0,0.45][k]+ (0.12 if w else -0.12)
            for t in range(ln):
                x=xm+sd*int(t*math.cos(ang))
                y=14-int(t*math.sin(ang)*0.9)+ (2 if w else 0)
                if 0<=x<56 and 0<=y<44:g.p(x,y,'W')
        # membrane fill between bones (scan columns)
    for x in range(1,55):
        ys=[y for y in range(44) if g.get(x,y)=='W']
        if len(ys)>=2:
            for y in range(min(ys),max(ys)):
                if g.get(x,y)=='.':g.p(x,y,'w')
    # ragged wing trailing edges
    for x in range(2,54,3):
        ys=[y for y in range(44) if g.get(x,y) in 'wW']
        if ys:
            b=max(ys)
            for i in range(1+((x*5+fr)%3)):g.p(x,b+1+i,'w')
    # serpent body hanging vertically in the middle
    body=[
     (24,9, "SssssS"),
     (24,9, "SsbbsS"),
     (24,10,"SsbbsS"),
     (24,11,"SsbbssS"),
     (24,12,"SsbbssS"),
     (24,13,"SsbbsS"),
     (24,14,"SsbbsS"),
     (24,15,"SsbbssS"),
     (24,16,"SsbbssS"),
     (24,17,"SsbbsS"),
     (24,18,"SsbbsS"),
     (24,19,"SssssS"),
     (25,20,"SsssS"),
     (25,21,"SsssS"),
     (26,22,"SssS"),
     (26,23,"SssS"),
     (27,24,"SsS"),
     (27,25,"SsS"),
     (27,26,"SssS"),
     (28,27,"SsS"),
     (28,28,"SsS"),
     (29,29,"SsS"),
     (29,30,"SsS"),
     (30,31,"SsS"),
     (30,32,"SssS"),
     (31,33,"SsS"),
     (31,34,"sS"),
     (32,35,"sS"),
     (32,36,"s"),
    ]
    for (x0,y,st) in body:
        for i,ch in enumerate(st):
            if ch!='.':g.p(x0+i,y,ch)
    # big round lamprey mouth head at the top
    for (x0,y,st) in [(23,0,"SSSSSSSS"),(21,1,"SSsssssssSS"),(20,2,"SssMMMMMMssS"),(19,3,"SssMtMMtMMssS"),
                      (19,4,"SsMMMMMMMMMsS"),(19,5,"SssMtMMMtMssS"),(20,6,"SssMMMMMMssS"),(21,7,"SSsssssssSS"),(23,8,"SSSSSSSS")]:
        for i,ch in enumerate(st):g.p(x0+i,y,ch)
    g.p(24,2,'t');g.p(27,2,'t');g.p(23,4,'t');g.p(28,4,'t');g.p(25,6,'t');g.p(26,6,'t')
    g.r(24,4,3,1,'k')
    g.p(18,3,'e');g.p(31,3,'e')
    if fr:g.p(18,3,'k');g.p(31,4,'e')
    g.outline();return g.rows()

def wallipen(fr):
    import math
    g=G(46,38)
    # lumpy wool body
    rows=[
     (14,4, "wwwwwww"),
     (11,5, "wwwwwwwwwwwww"),
     (9,6,  "wwwwwwwwwwwwwwwwww"),
     (8,7,  "wwwwwwwwwwwwwwwwwwwwww"),
     (7,8,  "wwwwwWWwwwwwwwwwwwwwwwwww"),
     (6,9,  "wwwwwWWWwwwwwwwwwwWWwwwwwwww"),
     (5,10, "wwwwwwWWwwwwwwwwwwWWWwwwwwwwww"),
     (5,11, "wwwwwwwwwwwwwwwwwwwWWwwwwwwwwww"),
     (4,12, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"),
     (4,13, "wwwWWwwwwwwwwwwwwwwwwwwwwwwwwWWww"),
     (4,14, "wwWWWwwwwwwwwwwwWWwwwwwwwwwwwWWWw"),
     (4,15, "wwwWWwwwwwwwwwwWWWwwwwwwwwwwwwWww"),
     (4,16, "wwwwwwwwwwwwwwwwWWwwwwwwwwwwwwwww"),
     (5,17, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"),
     (5,18, "wwwwwdddwwwwwwwwwwwwwwdddwwwwww"),
     (6,19, "wwwwdddddwwwwwwwwwwwwdddddwwww"),
     (7,20, "wwwddwwddwwwwwwwwwwwddwwddwww"),
     (8,21, "wwwwwwwwwwwwwwwwwwwwwwwwwwww"),
     (9,22, "wwwwwwwwwwwwwwwwwwwwwwwww"),
    ]
    for (x0,y,st) in rows:
        for i,ch in enumerate(st):
            if ch!='.':g.p(x0+i,y,ch)
    # calf head on a low wrong-bent neck, facing left
    head=[
     (5,7, "hhhh"),
     (3,8, "hhhhhhh"),
     (2,9, "hhhhhhhh"),
     (1,10,"hhhhhhhhh"),
     (0,11,"hhhhhhhhhh"),
     (0,12,"hhhhhhhhhh"),
     (0,13,"hhhhhhhhhh"),
     (0,14,"Hhhhhhhhhh"),
     (0,15,"HHhhhhhhh"),
     (0,16,"HHHhhhhh"),
     (1,17,"HHhhhh"),
     (2,18,"Hhhh"),
    ]
    for (x0,y,st) in head:
        for i,ch in enumerate(st):g.p(x0+i,y,ch)
    g.r(2,11,3,2,'e');g.p(2,11,'w')
    if fr:g.r(2,11,3,2,'w');g.p(4,12,'e')
    g.r(0,15,2,1,'n');g.p(1,16,'n')
    g.p(5,10,'H')
    # drooping ears / stubby horns
    g.r(7,6,3,1,'H');g.p(6,7,'H');g.p(9,7,'h');g.p(10,6,'H')
    # backward-bent legs, hooves
    for (x0,top,bend) in [(11,23,-1),(19,24,1),(29,24,-1),(37,23,1)]:
        for i in range(8):
            x=x0+(bend if i>4 else 0)
            g.p(x,top+i,'H');g.p(x+1,top+i,'h');g.p(x+2,top+i,'H')
        g.r(x0+bend-1,top+8,5,2,'n')
    # matted drips of wet wool
    for (x,y) in [(10,22),(16,23),(26,23),(34,23),(42,21)]:
        for i in range(2+((x+fr)%2)):g.p(x,y+i,'W')
    g.outline();return g.rows()

def trawko(fr):
    # the Trawko: a small, hunched, heavily muscled forest man under a huge
    # rush hat, long black hair, burning red eyes in a brim-shadowed face, a
    # wide jagged grin, a ragged tunic, a tattered cape streaming behind and a
    # big stone toki gripped low. Drawn facing left (flipped in battle).
    g=G(48,56)
    art=[
    "..................hh............................",
    ".................hHhh...........................",
    "................hhHhhh..........................",
    "...............hhhHhhhh.........................",
    "..............hhhhHhhhhh........................",
    ".............hhhhhHhhhhhh.......................",
    "............hhhhhhHhhhhhhh......................",
    "...........hhhhhhhHhhhhhhhhh....................",
    "..........hhhhhhhhHhhhhhhhhhhhhh................",
    ".........hhhhhhhhhHhhhhhhhhhhhhhhhhhh...........",
    "........hhhhhhhhhhHhhhhhhhhhhhhhhhhhhhhhh.......",
    "........HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhh....",
    ".........HH..nnnnnnnnnnnnnnnnnnnnn...HHHH.......",
    "............nnnFFFFFFFFFnnnnnnnnnn..............",
    "...........nnnFFFFFFFFFFFnnnnnnnnnn.............",
    "...........nnFFeeFFFFFFeeFFnnnnnnnn.............",
    "...........nnFeeeFFFFFFeeeFFnnnnnnn.............",
    "...........nnFFeFFFFFFFFeFFFnnnnnnn.............",
    "...........nnNFFFFFFFFFFFFFFnnnnnnn.............",
    "...........nnNfFFFFFFFFFFFFfnnnnnnn.............",
    "...........nnfkkkkkkkkkkkkkkfnnnnnn.............",
    "...........nnffktktktktktkfffnnnnnn.............",
    "............nnffkrrrrrrrrkfffnnnnn..............",
    ".............nnfffkkkkkkffffnnnnrr..............",
    "..............nnfffffffffffnnnrrrr..............",
    "...............ccccccccccccccrrrrrr.............",
    "..............ccccccccccccccccrrrrrrr...........",
    ".............fcccccccccccccccccrrrrrrrr.........",
    "............ffFcccccccccccccccccrrrrrrrrr.......",
    "...........fffFFccccCcccccccccccrrrrrrkrrrr.....",
    "..........ffffFFccccCCccccccccCCrrrrrrkrrrrrr...",
    "............ffFFFcccccCcccccccCCrrrrrrrkrrrrrrr.",
    ".............ffFFcccccCCcccccccCrrrrrrrkrrrr.rr.",
    "..............fFFccccccCccccccCCrrrrrrrkrrr..r..",
    "...............fFFcccccccccccCCCrrrrrrrkrr......",
    "...............ffFFccccccccccCCCrrrrrrrkrr......",
    "................ffFFCccccccccCCC.rrrrrrkr.......",
    "................fffFFCCccccccCCC..rrrrrkr.......",
    "................ffffFFCCccccCCfF...rrrrkr.......",
    "................fffffFFFccccCFfFF...rrrkr.......",
    ".................fffffFFFfffffFFF....rrkr.......",
    ".................ffffffFF.fffffFF.....rr........",
    ".................fffffFF...ffffFF......r........",
    "................ffffffF....fffffF...............",
    "................ffffffF....fffffF...............",
    "...............fffffffF....ffffFF...............",
    "...............ffffffF......fffffF..............",
    "..............fffffffF......fffffF..............",
    "..............ffffffF.......fffffFF.............",
    ".............fffffffF........fffffF.............",
    ".............ffffffF.........fffffF.............",
    "............fffffffF.........ffffffF............",
    "............nnnnnnnn.........nnnnnnn............",
    "...........nnnnnnnnn.........nnnnnnnn...........",
    "...........nnnnnnnn...........nnnnnnn...........",
    "................................................",
    "................................................",
    ]
    for y,row in enumerate(art):
        for x,ch in enumerate(row):
            if ch!='.':g.p(x,y,ch)
    # hair strands across the brow and cheek
    for (x,y) in [(17,13),(20,13),(23,13),(15,17),(27,18)]:g.p(x,y,'n')
    # lit cheekbones and chin below the brim shadow
    for (x,y) in [(14,19),(15,19),(25,19),(26,19),(16,23),(17,23),(24,23)]:g.p(x,y,'f')
    # lashing on the toki head, grain on the handle
    # muscle highlights: shoulders, forearm, calves
    for (x,y) in [(11,29),(12,30),(18,44),(19,45),(29,44),(30,45),(17,48),(28,49),(16,50)]:g.p(x,y,'N')
    if fr:
        # crouching breath: eyes narrow to slits, cape tips flick
        for (x,y) in [(15,15),(16,15),(23,15),(24,15),(15,17),(24,17)]:g.p(x,y,'F')
        g.p(45,32,'r');g.p(46,31,'r')
    # forearm thrust forward, fist closed on the toki's haft
    for x in range(6,13):
        g.p(x,28,'f');g.p(x,29,'f');g.p(x,30,'F');g.p(x,31,'F')
    g.r(3,27,4,5,'f');g.p(3,31,'F');g.p(4,31,'F');g.p(5,31,'F');g.p(6,31,'F');g.p(3,27,'F')
    # haft: a long dark shaft rising from the fist
    for y in range(14,40):
        g.p(4,y,'s');g.p(5,y,'s' if y%3 else 'N')
    # stone head lashed to the top, blade edge forward (left)
    head=[
    (2,12,"aaaa"),
    (1,13,"aaaaaA"),
    (0,14,"aaaaaaAA"),
    (0,15,"aaaaaaAAA"),
    (0,16,"aaaaaaAAA"),
    (0,17,"aaaaaAAAA"),
    (1,18,"aaaaAAAA"),
    (2,19,"aaAAAA"),
    (3,20,"AAAA"),
    ]
    for (x0,y,st) in head:
        for k,ch in enumerate(st):g.p(x0+k,y,ch)
    for y in (15,16,17):g.p(4,y,'N');g.p(5,y,'N')
    g.p(0,15,'t');g.p(0,16,'t');g.p(1,14,'t')
    g.outline();return g.rows()

# ---------- hand-drawn bosses ----------
def witranalwe2(fr):
    g=G(30,60)
    seg={
     0:[(12,"hHHHHH")],
     1:[(11,"hHHHHHHH")],
     2:[(11,"hHHHHHHH")],
     3:[(11,"HHHHHHHH")],
     4:[(11,"HHHHHHHH")],
     5:[(10,"HHHHHHHHHH")],
     6:[(8,"hHHHHHHHHHHHHH")],
     7:[(2,"hhHHHHHHHHHHHHHHHHHHHHHHHH")],
     8:[(1,"hHHHHHHHHHHHHHHHHHHHHHHHHHHH")],
     9:[(2,"qqqqqqqqqqqqqqqqqqqqqqqqqq")],
     10:[(10,"qffFFFFffq")],
     11:[(10,"fFFFFFFFFf")],
     12:[(10,"fFkEFFkEFf")],
     13:[(10,"fFkkFFkkFf")],
     14:[(10,"fFfFFFFfFf")],
     15:[(11,"FFfkkfFF")],
     16:[(11,"FFFFFFFF")],
     17:[(11,"FkkkkkkF")],
     18:[(12,"fFFFFf")],
     19:[(12,"ffff")],
     20:[(9,"cPPPPPPPPPPc")],
     21:[(8,"cPPPPPPPPPPPPc")],
     22:[(6,"ApPPPPPPPPPPPPPPPA")],
     23:[(4,"ApppPPPPPPPPPPPPPPPPpA")],
     24:[(3,"AppppPPPPPPPPPPPPPPPPPpA")],
     25:[(3,"ApppPPPPPPPPPPPPPPPPPPpA")],
     26:[(3,"AppPPPPPPPPPPPPPPPPPPPpA")],
    }
    torsoB=(4,"AppPpPPPPPKKPPPPPPPPpA")
    torsoN=(4,"AppPpPPPPPPPPPPPPPPPpA")
    for y in range(27,43):
        seg[y]=[torsoB if y%3==0 else torsoN]
    lower=(3,"ApppPpPPPPPPPPPPPPPPPPpA")
    for y in range(43,57):
        seg[y]=[lower]
    sh=fr
    seg[57]=[(3+sh,"Ap"),(6,"pP"),(9,"PPP"),(13,"PPPP"),(18,"PP"),(21-sh,"Pp"),(24,"pA")]
    seg[58]=[(5,"P"),(9+sh,"P"),(14,"PP"),(19,"P"),(23-sh,"P")]
    for y,parts in seg.items():
        for (x0,st) in parts:
            for i,ch in enumerate(st):
                if ch!='.':g.p(x0+i,y,ch)
    # pale bony hands at the sleeve openings
    for (x0,rows) in [(5,range(32,36)),(23,range(32,36))]:
        for y in rows:g.p(x0,y,'f');g.p(x0+1,y,'F')
    g.p(5,36,'f');g.p(24,36,'f')
    # silver clasp at the collar
    g.p(14,21,'K');g.p(15,21,'K')
    # eye flicker on frame 2
    if fr:
        g.p(13,12,'w');g.p(17,12,'w')
        g.p(13,14,'E');g.p(17,14,'E')
    g.outline();return g.rows()

def cherrufe2(fr):
    import math
    g=G(46,56)
    rows={}
    rows[10]=(14,"hbbbbbbbbbbbbbbbbh")
    rows[11]=(10,"hbbbbbbbbbbbbbbbbbbbbbbbh")
    rows[12]=(7,"hhbbbbbbbbbbbbbbbbbbbbbbbbbbbh")
    rows[13]=(5,"hhbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbBh")
    rows[14]=(4,"hbbbbbbbbBBbbbbbbbbbbbbbbbbbbBBbbbBh")
    rows[15]=(3,"hbbbbbbbbbBBbbbbbbbbbbbbbbbbbbBBbbbbBBh")
    rows[16]=(3,"hbbbbbbbbbbBbbbbbbbbbbbbbbbbbbbBbbbbBBBh")
    rows[17]=(2,"hbbbbbbhhbbbBbbbbbbbbbbbbbbbbbbbBbbbBBBBBh")
    rows[18]=(2,"hbbbbbhhbbbbBbbbbbbbbbbbbbbbbbbbbBbbbBBBBh")
    # torso rows with plate seams
    torso=[
     (2,"hbbbbbhh.bbbBbbbbbbbbbbbbbbbbbbbB.bbBBBBBh"),
     (2,"hbbbbbh..bbbbBBbbbbbbbbbbbbbbbbB..bbbBBBBh"),
     (2,"hbbbbbh..bBBBBbbbbbbbbbbbbbbbbbb..bBBBBBBh"),
     (2,"hbbbbbh..bbbbbbbbbbbbbbbbbbbbbbb..bBBBBBBh"),
     (2,"hbbbbhh..bbbbbbbbbbBBbbbbbbbbbbb..bbBBBBBh"),
     (2,"hbbbbh...bbbbbbbbbBBBBbbbbbbbbb...bBBBBBBh"),
     (2,"hbbbbh...bbbbbbbbbBBBBbbbbbbbbb...bBBBBBBh"),
     (2,"hbbbbh...bbbbBBbbbbBBbbbbBBbbbb...bBBBBBBh"),
     (2,"hbbbbh...bbbbbBbbbbBBbbbbBbbbbb...bBBBBBBh"),
     (2,"hbbbhh...bbbbbbbbbbBBbbbbbbbbbb...bbBBBBBh"),
     (2,"hbbbbh...bbbbbbbbbbBBbbbbbbbbbb...bBBBBBBh"),
     (2,"hbbbbh...bbbbBBbbbbBBbbbbBBbbbb...bBBBBBBh"),
     (2,"hbbbbh...bbbbbBbbbbBBbbbbBbbbbb...bBBBBBBh"),
     (2,"hbbbbhh..bbbbbbbbbbBBbbbbbbbbbb..bbBBBBBBh"),
     (2,"hbbbbbh..bbbbbbbbbbbbbbbbbbbbbb..bBBBBBBBh"),
     (2,"hbbbbbhh.bbbbbbbbbbbbbbbbbbbbbb.bbBBBBBBh"),
    ]
    for i,t in enumerate(torso):rows[19+i]=t
    # fists and legs
    rows[35]=(1,"hbbbbbbh..bbbbbbbbbbbbbbbbbbbbbb..bBBBBBBBBh")
    rows[36]=(1,"hbbbbbbh...bbbbbbbbbbbbbbbbbbbb...bBBBBBBBBh")
    rows[37]=(1,"hbbbbbbbh..bbbbbbbbbbbbbbbbbbbb..bBBBBBBBBBh")
    rows[38]=(0,"hbbbbbbbbh..bbbbbbbbbbbbbbbbbb..bBBBBBBBBBBBh")
    rows[39]=(0,"hbbhbbbbbh..bbbbbbbbbbbbbbbbbb..bBBBBBBBbBBBh")
    rows[40]=(0,"hbhhbbbbbh..bbbbbbbbbbbbbbbbbb..bBBBBBBhBBBBh")
    rows[41]=(0,"hbhbbbbbbh..bbbbbBbbbbbbBbbbbb..bBBBBBBBhBBBh")
    rows[42]=(0,"hbbbbbbbbh..bbbbbBbbbbbbBbbbbb..bBBBBBBBBBBBh")
    rows[43]=(0,"hbbbbbbbh..bbbbbbBbbbbbbBbbbbbb..bBBBBBBBBBBh")
    rows[44]=(0,"hhbbbbbh..bbbbbbbBbbbbbbBbbbbbbb..bBBBBBBBBh")
    rows[45]=(1,"hbbbbh...bbbbbbbBbbbbbbBbbbbbbb...bBBBBBBh")
    rows[46]=(2,"hbbbh...bbbbbbbbBbbbbbbBbbbbbbbb...bBBBBh")
    rows[47]=(10,"bbbbbbbBbbbbbbBbbbbbbb")
    rows[48]=(9,"bbbbbbbbBbbbbbbBbbbbbbbb")
    rows[49]=(8,"hbbbbbbbbBbbbbbbBbbbbbbbbB")
    rows[50]=(7,"hbbbbbbbbbBbbbbbbBbbbbbbbbbB")
    rows[51]=(6,"hbbbbbbbbbbBbbbbbbBbbbbbbbbbbB")
    rows[52]=(6,"hhbbbbbbbbbBbbbbbbBbbbbbbbbbBB")
    for y,(x0,st) in rows.items():
        for i,ch in enumerate(st):
            if ch!='.':g.p(x0+i,y,ch)
    # head sunk between the shoulders
    for (x0,y,st) in [(18,4,"bbbbbbbbbb"),(17,5,"bbbbbbbbbbbb"),(17,6,"bbbbbbbbbbbb"),
                      (17,7,"bb"),(27,7,"bb"),(17,8,"bbbbbbbbbbbb"),(17,9,"bbbbbbbbbbbb")]:
        for i,ch in enumerate(st):g.p(x0+i,y,ch)
    g.r(18,6,3,2,'O');g.r(24,6,3,2,'O');g.r(19,6,2,1,'y');g.r(25,6,2,1,'y')
    g.r(18,5,3,1,'B');g.r(24,5,3,1,'B')
    for i,ch in enumerate("lrOOrl"):g.p(19+i,9,ch)
    g.p(21,10,'r');g.p(23,10,'r')
    # lava crack veins down the chest and arms
    vein=[(23,12),(23,13),(22,14),(22,15),(23,16),(23,17),(22,18),(22,19),(23,20),(23,21),(22,22),
          (23,23),(23,24),(22,25),(22,26),(23,27),(23,28),(22,29),(23,30),(23,31),(22,32),(23,33),(23,34)]
    for n,(x,y) in enumerate(vein):
        g.p(x,y,'r' if (n+fr)%3 else 'O')
        if n%5==2:g.p(x-1,y,'l');g.p(x+1,y,'r')
    for (x,y) in [(18,22),(27,25),(16,28),(29,30),(19,31),(26,21)]:
        g.p(x,y,'r');g.p(x+1,y,'l')
    for (x,y) in [(5,24),(40,26),(4,33),(41,35),(6,40),(39,41)]:
        g.p(x,y,'O');g.p(x,y+1,'r')
    # fire mane
    import math as _m
    for k in range(16):
        x=13+k*1.3;h0=3+int(2.5*_m.sin(k*1.7+fr*2.6))+2
        for i in range(h0):
            ch='y' if i>h0-2 else ('O' if i>h0-4 else 'r')
            g.p(int(x),3-i+ (1 if (k+fr)%2 else 0),ch)
    # magma pools at the feet
    for x in range(8,38):
        if (x*7+fr*3)%9<4:g.p(x,53,'O');g.p(x,54,'r')
    g.outline();return g.rows()

def trelke(fr):
    import math
    g=G(54,42)
    R_={}
    R_[1]=(8,"rrr")
    R_[2]=(6,"rRRr")
    R_[3]=(5,"rRRr")
    R_[4]=(4,"rRRr..rr")
    R_[5]=(3,"rRRr..rRr")
    R_[6]=(3,"rRr...rRr")
    R_[7]=(2,"rRr....rRr")
    R_[8]=(2,"rr......rr")
    rows=[
     (16,0, "uhhhh"),
     (13,1, "uhhhhhhhh"),
     (11,2, "uhhhhhhhhhhhhu"),
     (9,3,  "uhhhhhhhhhhhhhhhhhuu"),
     (8,4,  "uhhhhhhhhhhhhhhhhhhhhhuuu"),
     (7,5,  "uhhhhhhhhhhhhhhhhhhhhhhhhhuuuu"),
     (6,6,  "uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhuuuu"),
     (5,7,  "uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhuuuu"),
     (4,8,  "uhhhhhhhhhhHHhhhhhhhhhhhhhhhhhhhhhhhhhuuuu"),
     (4,9,  "hhhhhhhhhhHHHHhhhhhhhhhhhhhhhhhhhhhhhhhhuuuu"),
     (3,10, "hhhhhhhhhhhHHHHhhhhhhhhhhhhhMmhhhhhhhhhhhhuuuu"),
     (3,11, "hhhhhhhhhhhhHHhhhhhhhhhhhhhMMmmhhhhhhhhhhhhuuu"),
     (2,12, "hhhhhhhhhhhhhhhhhhhhhhhhhhhMMmmhhhhhhhhhhhhhhuu"),
     (2,13, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhMmhhhhhhhhhhhhhhhhu"),
     (1,14, "hhhhHHhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhHHhhhhhhhhu"),
     (1,15, "hhhhHHhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhHHHHhhhhhhhhu"),
     (1,16, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhHHHHhhhhhhhhhu"),
     (0,17, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhHHhhhhhhhhhhhu"),
     (0,18, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhu"),
     (0,19, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhu"),
     (0,20, "hHhhhhhhhhhhhhhhhhhhhhhhhhhMmhhhhhhhhhhhhhhhhhhhhhhhu"),
     (0,21, "hHhhhhhhhhhhhhhhhhhhhhhhhhMMmmhhhhhhhhhhhhhhhhhhhhhu"),
     (0,22, "hhhhhhhhhhhhhhhhhhhhhhhhhhMMmmhhhhhhhhhhhhhhhhhhhhu"),
     (1,23, "hhhhhhhhhhhhhhhhhhhhhhhhhhMmhhhhhhhhhhhhhhhhhhhhhu"),
     (1,24, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhu"),
     (2,25, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"),
    ]
    for (x0,y,st) in rows:
        for i,ch in enumerate(st):
            if ch!='.':g.p(x0+i,y,ch)
    # ragged scalloped hem of the hide
    for x in range(2,52):
        d=3+int(2.2*math.sin(x*0.7+fr*1.2))
        top=26
        for y in range(top,top+d):
            g.p(x,y,'H' if y>top+d-2 else 'h')
    # face: heavy low-slung head at the left edge
    for (x0,y,st) in [(3,11,"HHHHH"),(2,12,"HHHHHHH"),(1,13,"HHHHHHHH"),(0,14,"HHHHHHHHH"),(0,15,"HHHHHHHHH"),
                      (0,16,"HHHHHHHHHH"),(0,17,"HHHHHHHHH"),(1,18,"HHHHHHHH"),(2,19,"HHHHHHH")]:
        for i,ch in enumerate(st):g.p(x0+i,y,ch)
    g.r(3,14,3,2,'e');g.p(3,14,'w')
    if fr:g.r(3,14,3,2,'w')
    g.p(1,16,'M');g.p(2,17,'m')
    for i,ch in enumerate("wHwHwHw"):g.p(1+i,19,ch)
    g.p(0,18,'w');g.p(8,19,'w')
    # legs with bone claws
    for (x0,top) in [(8,29),(18,30),(32,30),(44,29)]:
        for y in range(top,36):
            g.p(x0,y,'H');g.p(x0+1,y,'h');g.p(x0+2,y,'H')
        g.p(x0-1,36,'R');g.p(x0,36,'w');g.p(x0+1,37,'w');g.p(x0+2,36,'w');g.p(x0+3,36,'R')
    # raw flesh patches and matted streaks
    for (x,y) in [(22,6),(23,7),(36,12),(37,13),(12,19),(13,20),(44,20),(45,21)]:
        g.p(x,y,'m');g.p(x+1,y,'M')
    for k in range(16):
        x=6+k*3;y=9+(k*5)%12
        g.p(x,y,'H');g.p(x,y+1,'H')
    # horn pair curling over the head
    for y,(x0,st) in R_.items():
        for i,ch in enumerate(st):
            if ch!='.':g.p(x0+i,y,ch)
    g.outline();return g.rows()

# ---------- ngen: hand-drawn humanoid master, skinned per element ----------

def luan(fr):
    g=G(22,20)
    g.e(12,11,6,3.6,'b')
    g.r(6,4,3,3,'b');g.r(6,7,2,4,'b')
    g.p(6,3,'b');g.p(5,4,'w');g.p(8,3,'n');g.p(5,3,'e')
    g.p(7,2,'n');g.p(6,2,'n')
    for x,ph in [(8,0),(11,1),(14,0),(17,1)]:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,13,2,6-dy,'B')
    g.r(17,9,2,2,'b');g.p(18,8,'b')
    g.e(12,9,5,2,'w')
    g.outline();return g.rows()
def choyke(fr):
    g=G(20,22)
    g.e(10,10,5.5,4.5,'b');g.e(10,9,4.5,3.4,'B')
    g.r(6,3,2,5,'b');g.p(6,2,'b');g.p(7,2,'b')
    g.p(5,2,'n');g.p(6,1,'e')
    for i in range(5):g.p(12+i,7-i//2,'B')
    for x,ph in [(8,0),(12,1)]:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,14,1,6-dy,'n');g.r(x-1,19-dy,2,1,'n')
    g.e(10,10,3,2.4,'w')
    g.outline();return g.rows()
def mewlen(fr):
    g=G(20,22);import math
    for i in range(16):
        yy=20-i
        rr=1.5+i*0.32
        off=math.sin(i*0.9+fr*3.14)*1.6
        for xx in range(20):
            dx=xx+.5-(10+off)
            if abs(dx)<=rr:
                c='y' if (xx+i+fr)%3==0 else 's'
                if abs(abs(dx)-rr)<0.7:c='S'
                g.p(xx,yy,c)
    g.p(7+fr,8,'k');g.p(12-fr,8,'k')
    g.p(7+fr,7,'e');g.p(12-fr,7,'e')
    for (x,y) in [(4,6+fr),(15,10-fr),(6,14),(14,16),(3,17)]:g.p(x,y,'d')
    g.outline();return g.rows()
def kurutrewa(fr):
    g=G(24,18)
    g.e(13,11,6.5,4,'h');g.e(13,10,5.5,3,'H')
    g.e(5,7,3,2.6,'h');g.r(2,7,3,2,'h')
    g.p(4,4,'h');g.p(5,4,'h');g.p(7,4,'h')
    g.p(3,7,'e');g.p(2,8,'w');g.r(2,9,2,1,'w')
    for x,ph in [(9,0),(12,1),(15,0),(17,1)]:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,13,2,5-dy,'H')
    for i in range(4):g.p(19+i,9-i,'h')
    g.e(13,9,4,1.6,'u')
    g.outline();return g.rows()
def fmewlen(fr):
    g=G(30,30);import math
    for i in range(24):
        yy=28-i
        rr=2.2+i*0.42
        off=math.sin(i*0.7+fr*3.14)*2.4
        for xx in range(30):
            dx=xx+.5-(15+off)
            if abs(dx)<=rr:
                c='y' if (xx+i+fr)%3==0 else 's'
                if abs(abs(dx)-rr)<0.8:c='S'
                g.p(xx,yy,c)
    g.r(10+fr,10,3,2,'k');g.r(18-fr,10,3,2,'k')
    g.p(11+fr,9,'e');g.p(19-fr,9,'e')
    for i in range(7):
        a=i/7*6.28+fr*.8
        g.p(int(15+math.cos(a)*9),int(14+math.sin(a)*7),'d')
        g.p(int(15+math.cos(a+2)*11),int(16+math.sin(a+2)*9),'D')
    g.r(12,20,6,1,'k')
    g.outline();return g.rows()
def kurutoro(fr):
    g=G(32,26)
    g.e(18,15,9,5.5,'h');g.e(18,13,8,4,'H')
    g.e(7,10,4,3.6,'h')
    g.r(3,9,4,4,'h')
    g.p(4,6,'w');g.p(5,6,'w');g.p(3,7,'w');g.p(6,5,'w')
    g.p(10,6,'w');g.p(9,6,'w');g.p(11,5,'w')
    g.p(4,9,'e');g.p(8,9,'e')
    g.r(4,12,3,2,'n');g.p(4,13,'r');g.p(6,13,'r')
    for x,ph in [(12,0),(16,1),(21,0),(25,1)]:
        dy=1 if (ph+fr)%2 else 0
        g.r(x,19,3,6-dy,'H');g.r(x,24-dy,3,1,'k')
    for i in range(5):g.p(27+i//2,11-i,'h')
    g.e(18,12,5,2,'u')
    g.outline();return g.rows()
def walichu(fr):
    g=G(44,58);import math
    # tattered hide cloak, widening to the ground
    for y in range(18,54):
        t=(y-18)/36.0
        rr=5+t*13
        off=math.sin(y*0.25+fr*0.9)*1.2
        x0=int(22-rr+off);x1=int(22+rr+off)
        for x in range(x0,x1+1):
            c='m'
            if x<=x0+1 or x>=x1-1:c='M'
            elif (x*3+y*2)%11==0:c='M'
            elif (x*5+y)%13==0:c='u'
            g.p(x,y,c)
    # ragged hem
    for x in range(5,40):
        if (x*7)%5<2:
            for k in range(1,3):g.p(x,53+k,'M')
    # shoulders
    g.e(22,19,8,3,'m')
    # guanaco-skull head
    g.e(22,8,5.5,5,'f');g.e(22,7,4.5,4,'F')
    g.r(19,11,7,3,'f');g.r(20,14,5,3,'f');g.r(21,17,3,2,'F')
    g.p(21,18,'k');g.p(23,18,'k')
    g.r(18,7,3,3,'k');g.r(24,7,3,3,'k')
    g.p(19,8,'E');g.p(25,8,'E')
    if fr:
        g.p(19,7,'E');g.p(25,7,'E')
    g.p(15,3,'f');g.p(16,4,'f');g.p(16,5,'F');g.p(28,3,'f');g.p(27,4,'f');g.p(27,5,'F')
    # bone-bead necklace
    for i in range(7):g.p(16+i*2,21,'w')
    # long bone arms with claws
    sw=fr
    for (sx,dx) in [(13,-1),(31,1)]:
        for i in range(10):
            y=22+i
            x=sx+dx*int(i*0.8)
            g.p(x,y,'f');g.p(x-dx,y,'F')
        hx=sx+dx*8
        hy=32-sw*2 if dx<0 else 32
        for k in range(3):
            g.p(hx+dx*k,hy+k,'f');g.p(hx+dx*(k+1),hy+k+1,'F')
    # dust swirl at the base
    for i in range(10):
        a=i/10*6.28+fr*.8
        g.p(int(22+math.cos(a)*16),int(53+math.sin(a)*2.5),'d')
        if i%2:g.p(int(22+math.cos(a+1)*12),int(55+math.sin(a+1)*1.5),'d')
    g.outline();return g.rows()
def epunamun(fr):
    g=G(42,52);import math
    # legs braced wide
    for (x0,dx) in [(15,-1),(24,1)]:
        for i in range(10):
            y=40+i
            g.r(x0+dx*int(i*0.3),y,3,1,'s')
        g.r(x0+dx*3-(1 if dx<0 else -1),50,5,2,'n')
    # chiripa loincloth
    g.r(13,36,16,5,'c');g.r(13,36,16,1,'C')
    for x in range(14,28,3):g.p(x,38,'C')
    # massive torso
    g.e(21,28,9,8,'s');g.e(21,26,8,6,'S')
    # leather chest plate
    g.r(15,24,13,6,'c')
    for y in range(24,30,2):
        for x in range(15,28,3):g.p(x,y,'C')
    # two heads, back to back
    for (hx,dx) in [(16,-1),(26,1)]:
        g.e(hx,15,4,4.5,'s')
        g.p(hx+dx*2,14,'e');g.p(hx+dx*2,16,'k')
        g.p(hx+dx*3,17,'r')
        g.r(hx-1,19,3,1,'k')
    g.r(19,13,4,6,'h')
    # feather crown spanning both heads
    for i in range(11):
        x=11+i*2
        h0=4+(i%3)+(1 if (i+fr)%2 else 0)
        for k in range(h0):
            g.p(x,10-k,'r' if k<h0-1 else 'w')
    g.r(11,10,21,1,'n')
    # war paint
    for (hx,dx) in [(16,-1),(26,1)]:
        g.p(hx+dx,13,'k');g.p(hx,13,'k')
    # two spears, one per outer arm
    sw=1 if fr else 0
    for (ax,dx) in [(9,-1),(33,1)]:
        g.r(ax,22,2,8,'s')
        spx=ax+dx
        for y in range(6+sw,46):g.p(spx,y,'a')
        g.p(spx,5+sw,'A');g.p(spx,4+sw,'A');g.p(spx+dx,6+sw,'A')
        g.p(spx,3+sw,'w')
    g.outline();return g.rows()


def chadikura(fr):
    g=G(44,50);import math
    def prism(cx,base,top,w,shade=0):
        h=base-top
        for i in range(h+1):
            y=base-i
            ww=max(1,int(w*(1-i/float(h+1))))
            x0=cx-ww//2
            for x in range(x0,x0+ww):
                if shade and x>=x0+max(1,ww*2//3):c='s'
                elif x==x0:c='W'
                else:c='w'
                g.p(x,y,c)
        g.p(cx-w//2+ (0 if w%2 else 0),top-1,'w')
    # salt mound base
    g.e(22,46,15,3.5,'s');g.e(21,45,12,2.6,'W')
    for (x,y) in [(8,47),(35,46),(15,48),(29,48)]:g.p(x,y,'w')
    # legs: two thick crystal columns
    prism(16,45,34,7,1);prism(28,45,33,7,1)
    # torso: big central prism cluster
    prism(22,36,12,15,1)
    prism(14,34,18,8,1);prism(30,34,17,8,1)
    # shoulders / arm shard clusters
    sw=fr
    prism(8,30,20-sw,6,1);prism(7,34,26,4)
    prism(36,30,21+sw,6,1);prism(37,34,27,4)
    # head: jagged crown
    prism(22,14,4,8)
    prism(17,13,7,4);prism(27,13,6,4)
    # face: glowing core eyes and crack mouth
    gl='g' if fr else 'G'
    g.p(19,10,gl);g.p(20,10,gl);g.p(24,10,gl);g.p(25,10,gl)
    g.r(20,13,5,1,'S')
    # glowing fissures through torso
    for (x0,y0,n,dx) in [(22,18,9,0),(18,24,6,-1),(26,25,6,1),(22,30,5,0)]:
        for i in range(n):
            g.p(x0+dx*(i//3),y0+i,gl if (i+fr)%2 else 'G')
    # pink sheen patches
    for (x,y) in [(13,30),(31,28),(20,33),(25,20),(16,40),(29,41)]:
        g.p(x,y,'p');g.p(x+1,y,'p')
    # floating shards
    for i,(x,y) in enumerate([(4,16),(40,14),(2,28),(42,30)]):
        yy=y+((i+fr)%2)
        g.p(x,yy,'w');g.p(x,yy+1,'W')
    g.outline();return g.rows()


def ngoyam(fr):
    g=G(18,22);import math
    for y in range(3,20):
        t=(y-3)/17.0
        rr=5.5*(1-t*0.75)+math.sin(y*0.8+fr*3.14)*0.8
        off=math.sin(y*0.5+fr*1.5)*1.5*t
        x0=int(9-rr+off);x1=int(9+rr+off)
        for x in range(x0,x1+1):
            c='w' if (x+y+fr)%4 else 's'
            if x==x0 or x==x1:c='s'
            g.p(x,y,c)
    g.r(6,7,2,2,'k');g.r(11,7,2,2,'k')
    g.p(6+fr,8,'e');g.p(11+fr,8,'e')
    g.r(8,11,3,1,'k')
    for (x,y) in [(2,5+fr),(16,9-fr),(3,14),(15,16),(8,21)]:g.p(x,y,'s')
    g.outline();return g.rows()
def yewen(fr):
    # Yewen, shame: a tall hunched figure in a city hoodie, face sunk in the hood, hands clamped over the mouth
    g=G(40,56);import math
    sh=fr  # shiver
    # long shadow pooled at the feet
    g.e(20,53,13,2.5,'K')
    # sneakers
    g.r(13,49,6,3,'w');g.r(21+sh,49,6,3,'w');g.r(13,51,6,1,'W');g.r(21+sh,51,6,1,'W')
    # legs: baggy dark trousers
    g.r(13,34,6,15,'d');g.r(21,34,6,15,'d');g.r(13,34,2,15,'D');g.r(21,34,2,15,'D')
    # hoodie body, hunched: narrow shoulders drawn forward
    g.e(20,30,10,10,'h');g.r(10,22,20,12,'h')
    g.r(10,22,3,14,'H');g.r(26,24,4,10,'H')
    # kangaroo pocket
    g.r(14,31,12,4,'H');g.r(14,31,12,1,'D')
    # hood, oversized, pulled low
    g.e(20,14,9,8,'h');g.r(11,12,18,8,'h');g.e(20,12,8,6,'H')
    # the void inside the hood
    g.e(20,15,5.5,4.5,'k');g.r(14,14,12,4,'k')
    # downcast pale eyes, half-lidded
    g.r(16,15+sh,2,1,'e');g.r(22,15+sh,2,1,'e');g.p(16,14+sh,'E');g.p(23,14+sh,'E')
    # hands up over the mouth
    g.e(16,19.5,3.6,3,'p');g.e(24,19.5,3.6,3,'p');g.r(13,19,14,3,'p');g.r(14,21,12,1,'P')
    for x in (14,16,18,22,24,26):g.p(x,18,'P')
    g.r(19,19,2,3,'P')
    # thin arms rising to the hands
    for y in range(22,33):
        g.p(10-((y-22)//5),y,'h');g.p(11-((y-22)//5),y,'H')
        g.p(29+((y-22)//5),y,'h');g.p(30+((y-22)//5),y,'H')
    g.r(8,20,3,3,'h');g.r(29,20,3,3,'h')
    # grey whispers leaking from the hood
    for k in range(3):
        x=int(20+math.sin(k*2.1+fr)*7);y=6-k*2-(fr%2)
        g.p(x,y,'s');g.p(x+1,y-1,'S')
    g.p(4,26+fr,'s');g.p(35,24-fr,'s');g.p(6,40,'S');g.p(33,42,'S')
    g.outline();return g.rows()
def wenangkun(fr):
    # Weñangkün, sorrow: a small hooded figure curled around its knees under its own rain cloud
    g=G(34,40);import math
    g.e(17,37,12,2.2,'K')
    # cloud
    g.e(12,6,6,3.5,'c');g.e(19,5,7,4,'c');g.e(24,7,5,3,'c');g.r(8,6,20,4,'c')
    g.e(16,4,4,2,'w');g.r(8,9,20,1,'C')
    for k,x in enumerate((10,14,18,22,26)):
        y0=11+((k*3+fr*2)%6)
        g.p(x,y0,'t');g.p(x,y0+1,'t');g.p(x-1+(k%2),y0+5,'T')
    # body hunched, knees drawn up
    g.e(17,29,9,8,'b');g.r(9,28,17,8,'b')
    g.e(13,31,4,5,'B');g.e(22,31,4,5,'B')   # knees
    g.r(8,34,19,3,'B')
    # hood
    g.e(17,22,7,7,'h');g.r(11,21,13,6,'h');g.e(17,22,4.5,4.5,'k')
    # tired eyes, tears running
    g.p(15,22+fr,'e');g.p(19,22+fr,'e')
    for y in range(23,28):g.p(15,y+fr,'t')
    for y in range(24,29):g.p(19,y,'T')
    # hands hugging the knees
    g.e(17,30,3,1.6,'p');g.p(15,30,'P');g.p(19,30,'P')
    g.outline();return g.rows()

def illkun(fr):
    # Illkun, anger: a hunched crimson brute, head lowered between massive shoulders, eyes burning, fists clenched low, fire on its back
    g=G(40,44);import math
    g.e(20,41,14,2.4,'K')
    # fire rising behind the shoulders
    for (x0,ph,n) in [(9,0,14),(31,1.7,14),(20,3.1,10)]:
        for i in range(n):
            x=int(round(x0+math.sin(i*.7+ph+fr*1.3)*2.2));y=22-i
            c='y' if i<5 else 'Y'
            g.p(x,y,c);g.p(x+1,y,c) if i<9 else None;g.p(x-1,y,'Y') if i<4 else None
    # legs, bowed and heavy
    g.r(11,31,7,9,'R');g.r(23,31,7,9,'R');g.r(10,38,9,2,'k');g.r(22,38,9,2,'k')
    # torso and huge shoulders
    g.e(20,24,12,9,'r');g.r(8,19,24,11,'r');g.e(9,20,5,5,'r');g.e(31,20,5,5,'r')
    g.e(12,19,3,2,'s');g.e(28,19,3,2,'s')                  # lit shoulder caps
    for y in (24,27):g.r(15,y,10,1,'R')                    # abdominal ridges
    g.r(19,20,2,9,'R')
    # head sunk low, jutting brow
    g.e(20,17,6,5,'r');g.r(14,13,12,3,'R')
    g.r(15,16,3,1,'e');g.r(22,16,3,1,'e');g.p(15,16,'w');g.p(24,16,'w')
    g.r(16,19,8,2,'k');g.p(17,19,'w');g.p(22,19,'w');g.p(17,20,'w');g.p(22,20,'w')  # snarl with fangs
    for k in range(3):g.p(19+k-1,9-k-fr,'v')               # steam
    # arms hanging, fists clenched at the knees
    for (sx,d) in [(7,-1),(33,1)]:
        g.r(sx-2,21,5,10,'r');g.r(sx-2 if d<0 else sx-2,21,1 if d<0 else 0,10,'R')
        g.e(sx,33,3.6,3.2,'r');for_=None
        for k in range(3):g.p(sx-2+k*2,31,'s')
        g.r(sx-3,34,7,1,'R')
    g.outline();return g.rows()

def llukalfe(fr):
    # Llükalfe, the one who frightens: a towering thin shadow that leans over you, long arms, huge pale eyes, a jagged grin
    g=G(36,60);import math
    g.e(18,58,11,1.8,'K')
    # long robe-like body narrowing to tattered wisps
    for y in range(18,57):
        t=(y-18)/39;w=int(6+t*5)
        for x in range(18-w,18+w+1):
            g.p(x,y,'S' if x<18-w+2 or x>18+w-2 else 's')
    for x in range(8,30,3):g.p(x,57,'S');g.p(x+1,56,'s')
    # long arms hanging forward, claws spread
    for (sx,d) in [(11,-1),(25,1)]:
        for i in range(22):
            g.p(sx+d*int(i*.35),18+i,'s');g.p(sx+d*int(i*.35)+d,18+i,'S')
        hx=sx+d*8;hy=40
        for k in range(4):
            for j in range(4):g.p(hx+d*j,hy+k*2+j,'S')
            g.p(hx+d*4,hy+k*2+4,'m')
    # head: long skull leaning forward
    g.e(18,11,8,9,'s');g.e(18,13,6,7,'S')
    # huge pale eyes, pinprick pupils
    for ex,dx in ((14,-1),(22,1)):
        for k in range(5):g.p(ex-2+k,10+(k*dx-2*dx)//3,'e')
        g.p(ex,10,'k') if fr else None
    # jagged grin
    for x in range(12,25):
        g.p(x,16+(x%2),'m')
        if x%2==0:g.p(x,17,'k')
    g.r(12,15,13,1,'k')
    # faint purple glow edges
    for y in range(8,16):g.p(14+(y%2),y+2,'g') if y>12 else None
    g.outline();return g.rows()

def ayentufe(fr):
    # Ayentufe, the mocker (bullying): a hunched kid-shaped shadow in a school jacket behind a grinning mask, pointing and laughing
    g=G(34,46);import math
    g.e(17,44,11,2,'K')
    # legs, sneakers
    g.r(12,34,4,9,'d');g.r(19,34,4,9,'d');g.r(11,42,6,2,'w');g.r(18,42,6,2,'w')
    # school jacket (dark blue) with a stripe
    g.e(17,28,9,8,'j');g.r(9,22,17,12,'j');g.r(9,29,17,1,'J');g.r(16,22,2,12,'J')
    # pointing arm (toward the hero, our left)
    for i in range(6):g.p(8-i,24-i//3,'j');g.p(8-i,25-i//3,'J')
    g.e(3,22,2,2,'p');g.r(0,21,3,1,'p');g.p(0,21,'P')
    # other arm holding the belly, laughing
    g.e(24,30,3,2.5,'p')
    # head: grey shadow behind a cracked porcelain mask with empty eyes and a thin, too-wide grin
    g.e(17,13,8,8,'d')
    g.e(17,13,6.5,7.5,'m')
    for (ex,dy) in ((14,0),(20,0)):g.e(ex,10+dy,1.8,2.4,'k');g.p(ex,10,'M') if fr else None
    for x in range(11,24):
        y=16+int(round(-((x-17)/6.0)**2*2+1))
        g.p(x,y,'k')
        if x%2 and 12<x<23:g.p(x,y+1,'w')           # small sharp teeth
    g.p(11,15,'k');g.p(23,15,'k')
    for (x,y) in [(18,6),(19,7),(19,8),(20,9)]:g.p(x,y,'P')   # crack
    # laughter marks
    for k,(x,y) in enumerate([(26,6),(29,9),(27,3)]):
        if (k+fr)%2==0:g.p(x,y,'M');g.p(x+1,y-1,'M')
    g.outline();return g.rows()

def profe(fr):
    # The teacher who forbade Mapudungun: grey suit, hair in a tight bun, glasses flashing, raised ruler, a chalkboard with the word crossed out
    g=G(40,56);import math
    g.e(20,54,12,2,'K')
    # chalkboard behind, on an easel
    g.r(22,14,16,13,'F');g.r(23,15,14,11,'b')
    for x in range(24,36,2):g.p(x,19,'c')            # chalk scrawl (the forbidden word)
    for x in range(24,35):g.p(x,18+((x-24)//4)%2,'c')
    for i in range(12):g.p(24+i,23-i//2,'x');g.p(24+i,16+i//2,'x')  # crossed out in red
    g.r(24,27,1,24,'F');g.r(35,27,1,24,'F')
    # skirt/trousers and shoes
    g.r(14,38,12,13,'S');g.r(13,50,6,2,'k');g.r(21,50,6,2,'k')
    # suit jacket
    g.e(20,30,9,9,'s');g.r(11,24,18,14,'s');g.r(19,24,2,14,'S');g.r(16,24,8,3,'w')   # shirt collar
    # tie
    g.r(19,26,2,6,'x')
    # head, bun, glasses flashing
    g.e(20,15,6,7,'p');g.e(20,10,6.5,4,'h');g.e(20,6,3.2,2.6,'h');g.r(14,11,12,2,'h')
    g.r(16,15,3,2,'G');g.r(21,15,3,2,'G');g.p(19,15,'k');g.p(20,15,'k')
    if fr:g.p(16,15,'W');g.p(21,15,'W')
    g.r(17,20,6,1,'k')                                 # thin, stern mouth
    g.p(16,19,'P');g.p(23,19,'P')
    # arm raised with the ruler
    for i in range(8):g.p(10-i//3,26-i,'s');g.p(11-i//3,26-i,'S')
    g.e(8,17,2.2,2.2,'p')
    for i in range(16):
        g.p(7-i//4,16-i,'u');g.p(8-i//4,16-i,'U')
    for i in range(0,16,3):g.p(7-i//4,16-i,'k')       # ruler marks
    # other hand on the hip
    g.e(29,34,2.4,2.2,'p')
    g.outline();return g.rows()
def kalku(fr):
    g=G(40,56);import math
    # feather cloak, widening, layered rows
    for y in range(16,52):
        t=(y-16)/36.0
        rr=5+t*11
        x0=int(20-rr);x1=int(20+rr)
        for x in range(x0,x1+1):
            band=(y//4+((x+y)//3))%2
            c='F' if band else 'f'
            if x<=x0+1 or x>=x1-1:c='F'
            g.p(x,y,c)
    # feather fringe rows
    for y in range(20,52,4):
        t=(y-16)/36.0;rr=5+t*11
        for k in range(int(rr)):
            x=int(20-rr)+k*2
            g.p(x,y,'k');g.p(x+1,y+1,'F')
    # ragged hem
    for x in range(6,35):
        if (x*5)%4<2:
            g.p(x,52,'F');g.p(x,53,'k')
    # wild grey hair
    g.e(20,8,6.5,6,'h')
    for k in range(9):
        x=13+k*1.8
        g.p(int(x),3-(k%2),'h');g.p(int(x)+(1 if k%3 else 0),2-(k%2),'H')
    for sd in (-1,1):
        for k in range(4):g.p(int(20+sd*(6+k*0.6)),7+k*2,'H')
    # gaunt pale face, violet eyes
    g.e(20,10,3.6,4,'p')
    g.r(17,9,2,1,'k');g.r(21,9,2,1,'k')
    g.p(17+fr,9,'e');g.p(21+fr,9,'e')
    g.p(19,12,'k');g.p(20,12,'k');g.p(19,13,'P');g.p(20,13,'P')
    # bone staff with tuft
    sx=31+fr
    for y in range(6,50):g.p(sx,y,'b')
    g.e(sx,5,2,2,'B');g.p(sx-1,3,'h');g.p(sx+1,3,'h');g.p(sx,2,'H')
    g.p(sx,5,'e')
    # pale bony hand on staff
    g.r(sx-2,28,2,3,'p')
    # shadow shreds drifting
    for i,(x,y) in enumerate([(2,20),(37,26),(3,36),(38,40)]):
        g.p(x,y+((i+fr)%2),'k');g.p(x+1,y+1+((i+fr)%2),'F')
    g.outline();return g.rows()
def ngoyman1(fr):
    # the veil: a vaporous shadow-demon - horned dark head with burning eyes,
    # hunched mass, smoke-wing plumes, ember-cracked chest, claws, fog skirt
    g=G(64,48);import math
    CX=32
    for y in range(30,46):                                     # fog skirt
        t=(y-30)/16.0
        rr=14+t*16+math.sin(y*0.5+fr*3.14)*2
        off=math.sin(y*0.3+fr*0.9)*2
        x0=int(CX-rr+off);x1=int(CX+rr+off)
        for x in range(x0,x1+1):
            n=math.sin(x*0.5+y*0.8)+math.sin(x*0.23-y*0.4+fr*2)
            c='w' if n>1.35 else ('d' if n<-0.6 else 's')
            if x<=x0+1 or x>=x1-1:c='d'
            g.p(x,y,c)
    # broad smoke-wing plumes sweeping up and out from the shoulders
    for sgn in (-1,1):
        for i in range(16):
            t=i/15.0
            wx=CX+sgn*(9+int(t*20));wy=17-int((t**1.4)*14)+int(math.sin(i+fr*3)*1)
            rw=5.5-t*3.4
            g.e(wx,wy,max(1.0,rw),max(1.0,rw*.9),'d')
        for i in range(16):
            t=i/15.0
            wx=CX+sgn*(9+int(t*20));wy=17-int((t**1.4)*14)
            rw=3.6-t*2.6
            g.e(wx-sgn,wy+1,max(.8,rw),max(.8,rw*.8),'s')
        for i in range(5):
            t=i/4.0
            wx=CX+sgn*(12+int(t*14));wy=20-int((t**1.4)*10)
            g.p(wx,wy+4,'d');g.p(wx,wy+5,'d' if i%2 else 's')  # ragged trailing edge
    # hunched torso, dark core
    g.e(CX,22,12,9,'s');g.e(CX,23,10,7,'d');g.e(CX,24,7,5,'k')
    for sgn in (-1,1):                                         # massive shoulders
        g.e(CX+sgn*10,15,6,4,'s');g.e(CX+sgn*11,16,5,3,'d')
    # ember cracks across the chest, flickering
    for i,(ex2,ey2) in enumerate([(CX-4,20),(CX-2,23),(CX+1,21),(CX+3,24),(CX-1,26),(CX+5,22)]):
        if (i+fr)%2:
            g.p(ex2,ey2,'r');g.p(ex2+1,ey2,'r')
        else:
            g.p(ex2,ey2,'r')
    if fr:g.p(CX-3,22,'E')
    else:g.p(CX+2,25,'E')
    # long arms ending in claws
    for sgn in (-1,1):
        for i in range(11):
            x=CX+sgn*(13+int(i*0.9));y=18+i
            g.p(x,y,'s');g.p(x+sgn,y,'d')
        hx,hy=CX+sgn*24,31+(fr%2)
        g.e(hx,hy,2.6,2,'d')
        for j in (-1,0,1):
            g.p(hx+j,hy+2,'w');g.p(hx+j,hy+3,'w')
        g.p(hx,hy+4,'w')
    # dark horned head
    g.e(CX,9,7.5,6,'d');g.e(CX,10,5.5,4.2,'k')
    for sgn in (-1,1):                                         # great horns, thick, curving up-back
        px,py=CX+sgn*5,7
        for i in range(12):
            px+=sgn*(1 if i%3==2 else 2);py-=1
            for (ax,ay) in ((0,0),(sgn,0),(0,1),(sgn,1)):
                g.p(px+ax,py+ay,'d')
            g.p(px-sgn,py+2,'s')
        g.p(px+sgn,py-1,'w');g.p(px+sgn*2,py,'w')
    for sgn in (-1,1):                                         # burning slit eyes, angled down-in
        g.p(CX+sgn*2,9,'E');g.p(CX+sgn*3,8,'E');g.p(CX+sgn*3,9,'E');g.p(CX+sgn*4,8,'E')
        g.p(CX+sgn*1,7,'k');g.p(CX+sgn*2,7,'k');g.p(CX+sgn*3,6,'k')
    g.e(CX,13,3.6,1.8,'k')                                     # roaring maw, fire inside
    g.p(CX-1,13,'r');g.p(CX,13,'E');g.p(CX+1,13,'r')
    g.p(CX-3,12,'w');g.p(CX,11,'w');g.p(CX+3,12,'w')           # fangs
    # mane of smoke-flame between the horns
    for i in range(5):
        mx2=CX-4+i*2
        g.p(mx2,4-(i%2),'d')
        if (i+fr)%2:g.p(mx2,3-(i%2),'r')
    # texture pass
    for y in range(4,32):
        for x in range(CX-24,CX+25):
            if g.get(x,y)=='s' and (x*3+y*5)%11<2:g.p(x,y,'d')
    for i in range(8):                                         # trailing wisps
        x=8+i*7
        g.p(x+fr,46,'s');g.p(x+1+fr,47,'d')
    for (x,y) in ([(12,34),(52,35)] if fr==0 else [(12,34),(52,35),(26,38)]):
        g.r(x,y,2,1,'k');g.p(x,y,'E')                          # lesser eyes in the skirt
    g.outline();return g.rows()
def ngoyman2(fr):
    g=G(40,50);import math
    # heart silhouette: two lobes + tapering point
    for y in range(6,16):
        for cx in (13,27):
            rr=7.5-abs(y-10)*0.7
            g.e(cx,y,rr,4.5,'s')
    for y in range(14,44):
        t=(y-14)/30.0
        rr=13*(1-t*0.92)
        x0=int(20-rr);x1=int(20+rr)
        for x in range(x0,x1+1):g.p(x,y,'s')
    # crust plates
    for y in range(7,42):
        for x in range(7,34):
            if g.get(x,y)=='s' and ((x*3+y*5)%9==0 or (x+y)%7==0):g.p(x,y,'S')
    # glowing fissures, pulsing
    gl='g' if fr else 'G'
    for (x0,y0,n,dx) in [(20,8,8,0),(14,14,7,-1),(26,15,7,1),(20,24,9,0),(17,34,5,0)]:
        for i in range(n):
            g.p(x0+dx*(i//3),y0+i,gl if (i+fr)%2 else 'G')
    # vessels / stumps on top
    g.r(18,4,4,3,'S');g.e(12,5,2.5,2,'S');g.e(28,5,2.5,2,'S')
    # mist base
    for i in range(7):
        x=8+i*4
        g.p(x+fr,45,'d');g.p(x+1,46,'d')
    g.e(20,45,10,2,'d')
    g.outline();return g.rows()
def ngoyman3(fr):
    g=G(48,62);import math
    # towering mist body
    for y in range(4,58):
        t=(y-4)/54.0
        if y<14:rr=7+ (y-4)*0.4
        elif y<24:rr=10+(y-14)*0.55
        else:rr=15-(abs(y-44))*0.08
        rr+=math.sin(y*0.5+fr*3.14)*1.4
        off=math.sin(y*0.22+fr*0.8)*1.6
        x0=int(24-rr+off);x1=int(24+rr+off)
        for x in range(x0,x1+1):
            n=math.sin(x*0.45+y*0.7)+math.sin(x*0.2-y*0.33+fr*2)
            c='w' if n>0.9 else ('d' if n<-0.9 else 's')
            if x<=x0+1 or x>=x1-1:c='d'
            g.p(x,y,c)
    # darker core column
    for y in range(16,54):
        rr=4+math.sin(y*0.3)*1.2
        for x in range(int(24-rr),int(24+rr)+1):
            if (x+y)%3:g.p(x,y,'d')
    # two burnt-moon eyes under brows slanting down in anger
    for (x,y) in [(18,12),(28,12)]:
        g.e(x,y,2.6,2.2,'k');g.e(x,y,1.6,1.2,'E')
        if fr:g.p(x,y-3,'E')
    for i in range(5):
        g.p(20-i,8+ (4-i)//2,'k');g.p(21-i,9+(4-i)//2,'k')
        g.p(26+i,8+(4-i)//2,'k');g.p(25+i,9+(4-i)//2,'k')
    # snarling maw, corners pulled down, fangs bared
    g.e(23,20,5,2.6,'k')
    for k in range(5):g.p(19+k*2,18,'w')
    g.p(18,22,'k');g.p(28,22,'k')
    g.p(19,21,'w');g.p(27,21,'w')
    # shoulders and heavy arms ending in clawed hands
    for sgn in (-1,1):
        g.e(24+sgn*15,24,5,3.5,'s');g.e(24+sgn*16,25,4,2.5,'d')
        for i in range(12):
            x=24+sgn*(17+int(i*0.45));y=26+i
            g.p(x,y,'s');g.p(x+sgn,y,'d');g.p(x-sgn,y,'d')
        hx,hy=24+sgn*22,39+(fr%2)
        g.e(hx,hy,2.2,1.8,'d')
        for j in (-1,0,1):g.p(hx+j,hy+2,'w')
        g.p(hx,hy+3,'w')
    # drifting shreds
    for i,(x,y) in enumerate([(2,10),(45,8),(1,30),(46,34),(4,50),(44,52)]):
        g.p(x,y+((i+fr)%2),'s');g.p(x+1,y+1,'d')
    g.outline();return g.rows()


def ngoyman4(fr):
    # Ngoyman ni pun: the night itself. A gaunt floating specter, body of
    # starless dark rimmed in pale vapor, full of dying stars; crescent
    # horns, six ember eyes in an arc, a screaming rift, overlong claws.
    g=G(56,72);import math
    CX=28
    for i in range(7):                                         # detached wisps: it floats
        x=8+i*6+(fr%2)
        g.p(x,66,'d');g.p(x+1,67,'s');g.p(x,68,'d')
    # tall gaunt body: black core with a pale spectral rim
    for y in range(14,64):
        if y<22:rr=6+(y-14)*0.5
        elif y<50:rr=9+math.sin(y*0.25)*1.2
        else:rr=9+(y-50)*0.55
        rr+=math.sin(y*0.6+fr*3.14)*1.1
        off=math.sin(y*0.15+fr*0.8)*1.4
        x0=int(CX-rr+off);x1=int(CX+rr+off)
        for x in range(x0,x1+1):
            if x==x0 or x==x1:c='s'
            elif x==x0+1 or x==x1-1:c='d'
            else:c='k'
            g.p(x,y,c)
    for i in range(9):                                         # ragged hem
        hx=CX-14+i*3+(1 if (i+fr)%2 else 0);hy=62+(i%3)
        g.p(hx,hy,'d');g.p(hx,hy+1,'k')
    # dying stars inside the night
    for (sx2,sy2) in [(22,26),(33,30),(25,36),(31,42),(21,47),(34,52),(27,57),(24,31),(30,24),(29,49)]:
        on=((sx2+sy2+fr)%2==0)
        g.p(sx2,sy2,'w' if on else 's')
        if on and (sx2+sy2)%3==0:g.p(sx2+1,sy2,'s')
    if fr:g.p(23,40,'E')
    else:g.p(32,34,'E')
    # thin shoulders; long arms spread wide, four overlong claw fingers
    for sgn in (-1,1):
        g.e(CX+sgn*8,21,4,2.5,'d');g.e(CX+sgn*8,20,3,1.5,'s')
        for i in range(10):
            x=CX+sgn*(10+int(i*1.5));y=22+int(i*0.7)
            g.p(x,y,'d');g.p(x,y+1,'k');g.p(x,y-1,'s')
        hx=CX+sgn*25
        for j in range(4):
            fl=3+(j%2)
            for L in range(fl):
                g.p(hx+sgn*(j-1),30+j+L,'w' if L<fl-1 else 's')
    # void face
    g.e(CX,12,7,6,'d');g.e(CX,13,5.5,4.8,'k')
    # crescent horns curving inward like a dark moon
    for sgn in (-1,1):
        px,py=CX+sgn*6,8
        for i in range(8):
            px+=sgn*(1 if i<5 else 0);py-=1
            g.p(px,py,'d');g.p(px+sgn,py+1,'d')
            if i>4:g.p(px-sgn,py,'s')
    # six ember eyes in an arc; the two central ones large, under angry brows
    for (dx2,dy2) in [(-5,12),(-4,12),(4,12),(5,12)]:
        g.p(CX+dx2,dy2,'E')
    g.p(CX-6,14,'E');g.p(CX+6,14,'E')
    for sgn in (-1,1):
        g.p(CX+sgn,9,'E');g.p(CX+sgn*2,9,'E');g.p(CX+sgn,10,'E');g.p(CX+sgn*2,10,'E')
        g.p(CX,7,'k');g.p(CX+sgn,7,'k');g.p(CX+sgn*2,8,'k');g.p(CX+sgn*3,8,'k')
    # tall screaming rift
    for yy in range(13,19):
        g.p(CX,yy,'o')
        g.p(CX-1,yy+1,'o') if False else None
    for yy in range(14,18):
        g.p(CX-1,yy,'o');g.p(CX+1,yy,'o')
    g.p(CX-2,14,'w');g.p(CX+2,14,'w');g.p(CX,18,'w')
    g.outline();return g.rows()
def ngoyman5(fr):
    # Ruf Futra Ngoyman: a tower of everything swallowed. Hulking rotten base,
    # two braided fog columns, and in them the five lands and their people
    # struggling to escape; crowned by the antlered head with the great eye.
    g=G(72,104);import math
    CX=36
    # ---------------- base: hulking colossus gripping the ground
    for (ex,ey,rx,ry,col) in [(CX,88,26,15,'d'),(CX,84,22,11,'s'),(CX,92,28,10,'d'),
                               (CX-16,78,9,7,'s'),(CX+16,78,9,7,'s')]:
        g.e(ex,ey,rx,ry,col)
    for y in range(72,100):      # rot shading
        for x in range(CX-28,CX+29):
            if g.get(x,y) in 'sd' and (x*3+y*7)%13<2:g.p(x,y,'k')
            if g.get(x,y)=='s' and (x*5+y*3)%13<2:g.p(x,y,'v')
    # ribs of the base
    for k in range(4):
        g.e(CX,78+k*4,16-k*2,1.2,'B' if 0 else 'k')
    # claw hands
    for sgn in (-1,1):
        hx=CX+sgn*27
        g.e(hx,96,5,4,'d')
        for j in range(3):
            g.p(hx+sgn*(2+j),93-j,'w');g.p(hx+sgn*(3+j),94-j,'s')
    # shoulder horns curling out
    for sgn in (-1,1):
        px,py=CX+sgn*20,72
        for i in range(9):
            px+=sgn*(2 if i<5 else 1);py-=2 if i<5 else 1
            g.p(px,py,'d');g.p(px,py+1,'d');g.p(px-sgn,py+1,'s')
    # decay drip from the base rim
    for i,xx in enumerate(range(CX-24,CX+25,6)):
        ln=2+((i+fr)%3)
        for j in range(ln):g.p(xx,99+j-ln,'v')
    # ---------------- two braided fog columns
    def column(phase,amp,wid):
        for y in range(24,76):
            t=(y-24)/52.0
            off=math.sin(y*0.13+phase+fr*0.5)*amp*(1-t*0.2)
            w=wid-t*1.4
            x0=int(CX+off-w);x1=int(CX+off+w)
            for x in range(x0,x1+1):
                cur=g.get(x,y)
                if cur!='.' and cur not in 'sdw':continue
                col='s'
                if x<=x0 or x>=x1:col='d'
                elif (x==x0+2 or x==x1-3) and ((y+fr)%3==0):col='w'
                elif (x+y*2)%9<2:col='d'
                g.p(x,y,col)
            if (y*7)%17<2:g.p(x0,y,'v')
    column(1.57,3,4.0)          # central strand first, behind
    column(0,6,6.0);column(3.14,6,6.0)
    # ---------------- smoke-wing plumes behind the shoulders
    for sgn in (-1,1):
        for i in range(18):
            t=i/17.0
            wx=CX+sgn*(12+int(t*21));wy=30-int((t**1.4)*22)+int(math.sin(i+fr*3)*1)
            rw=6.0-t*4.0
            g.e(wx,wy,max(1.0,rw),max(1.0,rw*.9),'d')
        for i in range(18):
            t=i/17.0
            wx=CX+sgn*(12+int(t*21));wy=30-int((t**1.4)*22)
            rw=4.0-t*3.0
            g.e(wx-sgn,wy+1,max(.8,rw),max(.8,rw*.8),'s')
        for i in range(6):
            t=i/5.0
            wx=CX+sgn*(15+int(t*15));wy=33-int((t**1.4)*16)
            g.p(wx,wy+4,'d');g.p(wx,wy+5,'d' if i%2 else 's')
    # ---------------- shoulders and raised clawed arms (demon stance)
    for sgn in (-1,1):
        g.e(CX+sgn*13,30,8,5,'s');g.e(CX+sgn*15,31,6,4,'d')
        for j in range(3):g.p(CX+sgn*(10+j*3),25-(j%2),'d')
    for sgn in (-1,1):
        for i in range(13):
            x=CX+sgn*(17+int(i*0.75));y=32+i
            g.p(x,y,'s');g.p(x+sgn,y,'d');g.p(x-sgn,y,'d')
        ex2,ey2=CX+sgn*27,45
        for i in range(10):
            x=ex2+sgn*int(i*0.3);y=ey2-i
            g.p(x,y,'s');g.p(x+sgn,y,'d')
        hx2,hy2=CX+sgn*30,34+(fr%2)
        g.e(hx2,hy2,2.6,2.2,'d')
        g.p(hx2-1,hy2-3,'w');g.p(hx2-1,hy2-4,'w')
        g.p(hx2,hy2-4,'w');g.p(hx2,hy2-5,'w')
        g.p(hx2+1,hy2-3,'w');g.p(hx2+1,hy2-4,'w')
    # ribcage arcs over the torso
    for k in range(3):
        g.e(CX,40+k*7,8-k,1.2,'k')
    # ---------------- the five lands and their people, half-swallowed
    def persona(x,y,torso,sgn):
        # a person buried to the waist: 2px head, 2x2 torso, both arms straining
        g.e(x,y+2,4.2,3,'k')                                   # the hollow
        g.p(x,y-1,'f');g.p(x+1,y-1,'f')                        # head
        for (tx2,ty2) in [(x,y),(x+1,y),(x,y+1),(x+1,y+1)]:g.p(tx2,ty2,torso)
        up=(fr%2)
        g.p(x-1,y-up,'f');g.p(x-2,y-1-up,'f');g.p(x-2,y-2-up,'f')   # arm straining out
        g.p(x+2,y+1,'f')                                       # bracing hand
    # lafkenche: a person and a kultrung being dragged under
    ky=63;kx=CX-7
    persona(kx,ky,'c',-1)
    g.e(kx-6,ky+1,2.6,2.6,'y')                                 # kultrung skin
    g.p(kx-6,ky,'k');g.p(kx-6,ky+1,'k');g.p(kx-6,ky+2,'k')     # painted cross
    g.p(kx-7,ky+1,'k');g.p(kx-5,ky+1,'k')
    g.p(kx-7,ky,'r');g.p(kx-5,ky+2,'r')
    # nagche: a person and a trutruka
    ty=55;tx=CX+7
    persona(tx,ty,'g',1)
    for i in range(7):g.p(tx+3+i,ty+1-i//3,'y')                # the long cane
    g.p(tx+10,ty-1,'y');g.p(tx+10,ty,'y');g.p(tx+11,ty-1,'w')  # the flared horn
    # pewenche: a person and a metawe (clay vessel)
    my=47;mx=CX-7
    persona(mx,my,'r',-1)
    g.e(mx-5,my+1,2,2.2,'r')                                   # vessel body
    g.p(mx-5,my-1,'k');g.p(mx-6,my,'k')                        # mouth and handle
    g.p(mx-5,my+1,'k')
    # williche: a person and a chemamull (carved ancestor post)
    cy2=39;cx2=CX+7
    persona(cx2,cy2,'w',1)
    for j in range(6):g.p(cx2+4,cy2-2+j,'y')                   # the post
    g.p(cx2+5,cy2-2,'y');g.p(cx2+5,cy2-1,'y')
    g.p(cx2+4,cy2-1,'k');g.p(cx2+5,cy2,'k')                    # carved face
    # puelmapu: a person and a woven trariwe
    wy2=31;wx2=CX-7
    persona(wx2,wy2,'y',-1)
    for i in range(6):g.p(wx2-7+i,wy2+1,'r')                   # the sash
    for i in range(6):g.p(wx2-7+i,wy2+2,'r')
    g.p(wx2-6,wy2+1,'y');g.p(wx2-4,wy2+2,'y');g.p(wx2-2,wy2+1,'y')  # woven diamonds
    # ---------------- the furious demon head
    g.e(CX,15,13,10,'s');g.e(CX,16,11,8,'d')
    for sgn in (-1,1):                                            # brow ledges slanting down-in
        for i in range(7):
            bx2=CX+sgn*(2+i);byy=13-i//2
            g.p(bx2,byy,'k');g.p(bx2,byy+1,'k');g.p(bx2,byy-1,'d')
    g.e(CX,17,6,2.6,'k');g.e(CX,17,3.6,1.5,'E');g.p(CX-1,17,'w') # eye narrowed in fury
    g.e(CX,23,7,3,'k');g.e(CX,24,5,1.8,'o')                       # open snarl
    for k in range(5):g.p(CX-4+k*2,21,'w')
    for k in range(4):g.p(CX-3+k*2,25,'w')
    g.p(CX-6,22,'w');g.p(CX-6,23,'w');g.p(CX+6,22,'w');g.p(CX+6,23,'w')
    for sgn in (-1,1):                                            # gaunt cheeks
        g.p(CX+sgn*9,20,'k');g.p(CX+sgn*10,19,'k')
    for sgn in (-1,1):                                            # forward demon horns
        hx3,hy3=CX+sgn*9,8
        for i in range(6):
            hx3+=(0 if i%2 else sgn);hy3-=1
            g.p(hx3,hy3,'d');g.p(hx3-sgn,hy3,'s')
        g.p(hx3,hy3-1,'w')
    # antlers: thick beams with tines
    for sgn in (-1,1):
        px,py=CX+sgn*11,7
        for i in range(13):
            px+=sgn*(1 if i%3 else 2);py-=1
            b=fr if i%6==0 else 0
            g.p(px,py+b,'d');g.p(px,py+1+b,'d');g.p(px-sgn,py+1,'s')
            if i in (4,8,11):
                for j in range(1,5):
                    g.p(px,py-j-1,'d')
                    if j>2:g.p(px+sgn,py-j-1,'d')
                g.p(px+sgn,py-6,'s')
    # neck joining head to columns
    for y in range(24,30):
        for x in range(CX-6,CX+7):
            if g.get(x,y)=='.':g.p(x,y,'s' if abs(x-CX)<4 else 'd')
    # drifting shreds and carrion flies
    for i,(x,y) in enumerate([(4,20),(67,18),(2,50),(69,54),(6,80),(66,84),(CX,2)]):
        g.p(x,y+((i+fr)%2),'s');g.p(x+1,y+1,'d')
    for i,(x,y) in enumerate([(12,70),(60,66),(18,40),(54,44),(30,88)]):
        g.p(x+((i+fr)%2),y+((i*3+fr)%2),'k')
    g.outline();return g.rows()
def _sresample(pts,step=1.1):
    import math
    P=[]
    for i in range(len(pts)-1):
        x0,y0=pts[i];x1,y1=pts[i+1]
        d=math.hypot(x1-x0,y1-y0);n=max(1,int(d/step))
        for k in range(n):
            t=k/n;P.append((x0+(x1-x0)*t,y0+(y1-y0)*t))
    P.append((float(pts[-1][0]),float(pts[-1][1])))
    out=[]
    for i,(x,y) in enumerate(P):
        xa,ya=P[max(i-1,0)];xb,yb=P[min(i+1,len(P)-1)]
        tx,ty=xb-xa,yb-ya;d=math.hypot(tx,ty) or 1.0
        out.append((x,y,tx/d,ty/d))
    return out
def _serp(g,pts,r0,r1,fr,fin=1,belly=1,band=1):
    P=_sresample(pts)
    n=max(1,len(P)-1)
    for i,(x,y,tx,ty) in enumerate(P):
        t=i/float(n);r=r0+(r1-r0)*t
        g.e(x,y,max(1.1,r),max(1.0,r*.92),'b')
    for i,(x,y,tx,ty) in enumerate(P):
        t=i/float(n);r=r0+(r1-r0)*t
        nx,ny=-ty,tx
        if ny<0:nx,ny=-nx,-ny
        g.p(int(x-nx*r*.5),int(y-ny*r*.5),'s')
        if belly and i%2==0 and r>1.5:g.p(int(x+nx*r*.55),int(y+ny*r*.55),'w')
        if band and i%6==3:
            g.p(int(x),int(y),'B');g.p(int(x+tx),int(y+ty),'B');g.p(int(x-tx),int(y-ty),'B')
        if fin and i%3==(fr%2) and r>1.6:
            h=2+(1 if (i//3+fr)%2 else 0)
            g.p(int(x-nx*(r+1)),int(y-ny*(r+1)),'f')
            g.p(int(x-nx*(r+h)),int(y-ny*(r+h)),'F')
    return P
def _scoil(g,cx,cy,R,fr,turns=2.2,r0=4.0,r1=1.6,squash=.5):
    import math
    pts=[];N=int(22*turns)
    for i in range(N):
        a=i/float(N)*turns*6.283+3.6+fr*.22
        rad=R*(1-.78*i/float(N))
        pts.append((cx+math.cos(a)*rad,cy+math.sin(a)*rad*squash))
    _serp(g,pts,r0,r1,fr,fin=0)
    return pts
def _serp_head(g,hx,hy,fr,openjaw=0):
    # sea-serpent head facing left: long snout, stone-plate brow and jaw, swept crest
    g.e(hx+2,hy-1,5,3.8,'b')
    g.r(hx-8,hy-2,10,3,'b')
    g.e(hx-6,hy-1,2.4,1.4,'s')
    for k in range(5):
        g.p(hx-8+k*2,hy-3,'r');g.p(hx-7+k*2,hy-3+(k%2),'R')
    g.p(hx-9,hy-1,'R')
    for k in range(4):
        g.p(hx+4+k,hy-4-k,'f');g.p(hx+5+k,hy-4-k,'F')
        if k<2:g.p(hx+6+k,hy-2-k,'f')
    g.p(hx+1,hy-2,'e');g.p(hx+2,hy-2,'e');g.p(hx+2,hy-3,'k')
    g.p(hx-7,hy-2,'k')
    if openjaw:
        g.r(hx-9,hy+3,10,2,'B')
        g.r(hx-9,hy+5,8,1,'R')
        for k in range(4):g.p(hx-8+k*2,hy+1,'t')
        for k in range(4):g.p(hx-7+k*2,hy+3,'t')
        g.e(hx-4,hy+2,3.4,1.4,'g')
        g.p(hx-10,hy+5,'f');g.p(hx-11,hy+6,'F')
    else:
        g.r(hx-8,hy+1,9,1,'B')
        g.p(hx-9,hy+2,'f');g.p(hx-10,hy+3,'F')
def llufu1(fr):
    # the waters stir: a coiled pile at the surface, head resting on top
    g=G(52,40);import math
    g.e(26,33,23,6,'k')
    _scoil(g,26,27,17,fr,turns=2.6,r0=4.4,r1=2.0,squash=.52)
    g.e(26,25,4,2.6,'b');g.p(25,24,'s')
    _serp_head(g,25,17+ (fr%2),fr,openjaw=0)
    for y in range(31,40):
        for x in range(2,50):
            if g.get(x,y)!='.' and ((x*3+y*5)%7)<4:g.p(x,y,'k')
    for (x,y) in [(6,31),(12,33),(40,31),(46,33),(30,35)]:g.p(x,y+(fr%2),'w')
    for (x,y) in [(4,28),(48,27)]:g.p(x,y,'g')
    g.outline();return g.rows()
def llufu2(fr):
    # the head rises: submerged base, neck in an S up to an open jaw
    g=G(52,48);import math
    g.e(26,43,22,5,'k')
    base=[(6,42),(14,44),(24,45),(34,44),(44,41)]
    _serp(g,base,4.2,3.6,fr,fin=0)
    neck=[(40,42),(42,34),(38,26),(30,20),(27,15)]
    _serp(g,neck,3.8,2.6,fr,fin=1)
    _serp_head(g,27,12,fr,openjaw=1)
    for y in range(41,48):
        for x in range(2,50):
            if g.get(x,y)!='.' and ((x*3+y*5)%7)<4:g.p(x,y,'k')
    for (x,y) in [(5,40),(16,42),(34,42),(47,39)]:g.p(x,y+(fr%2),'w')
    g.outline();return g.rows()
def llufu3(fr):
    # the long body: humps crossing the water, head raised at the right
    g=G(60,42);import math
    pts=[]
    for i in range(40):
        x=2+i*1.35
        pts.append((x,27+math.sin(i*.42+fr*.8)*7))
    _serp(g,pts,2.6,3.8,fr,fin=1)
    neck=[(54,26),(56,20),(54,15)]
    _serp(g,neck,3.6,3.0,fr,fin=1)
    _serp_head(g,53,12,fr,openjaw=0)
    g.r(0,33,60,5,'k')
    for x in range(0,60,3):
        if g.get(x,32)=='b' or g.get(x+1,32)=='b':g.p(x,32,'w');g.p(x+1,33,'w')
    for (x,y) in [(4,34),(20,35),(36,34),(50,35)]:g.p(x,y+(fr%2),'w')
    g.outline();return g.rows()
def llufu4(fr):
    # the knot: the serpent winds a figure-eight around the glowing ül
    g=G(50,54);import math
    pts=[]
    for i in range(52):
        t=i/51.0*6.283
        a=t+fr*.25
        pts.append((25+math.sin(2*a)*15,27+math.sin(a)*21*.8))
    _serp(g,pts,3.6,2.0,fr,fin=0)
    gl='g' if fr else 'G'
    g.e(25,27,6.5,7,'G');g.e(25,26,5,5.5,gl);g.e(24,24,2.2,2.6,'w')
    _serp_head(g,20,6,fr,openjaw=0)
    for k in range(6):
        a=k/6.0*6.28+fr*.8
        g.p(int(25+math.cos(a)*11),int(27+math.sin(a)*10),'w')
    g.outline();return g.rows()
def llufu5(fr):
    # the full rise: coiled base, towering S-curve, stone-plated jaw open
    g=G(56,64);import math
    g.e(28,58,25,5,'k')
    _scoil(g,28,53,19,fr,turns=1.9,r0=4.6,r1=3.4,squash=.42)
    spine=[]
    for i in range(30):
        t=i/29.0
        spine.append((28+math.sin(t*5.0+fr*.4)*9*(1-.55*t),50-t*36))
    _serp(g,spine,4.4,2.6,fr,fin=1)
    _serp_head(g,27,11,fr,openjaw=1)
    for y in range(56,64):
        for x in range(2,54):
            if g.get(x,y)!='.' and ((x*3+y*5)%7)<4:g.p(x,y,'k')
    for (x,y) in [(5,55),(14,58),(42,57),(50,55)]:g.p(x,y+(fr%2),'w')
    for (x,y) in [(6,20),(48,24),(4,40),(50,44)]:g.p(x,y+(fr%2),'g')
    g.outline();return g.rows()
NGEN_BODY={
 1:[(11,"444443")],
 2:[(10,"44555443")],
 3:[(10,"45555443")],
 4:[(10,"45555432")],
 5:[(10,"42252232")],
 6:[(10,"3kE4Ek32")],
 7:[(10,"32434232")],
 8:[(11,"344432")],
 9:[(11,"311132")],
 10:[(12,"3332")],
 11:[(12,"2332")],
 12:[(9,"2344443332")],
 13:[(6,"3445544444433332")],
 14:[(4,"34455444444444333322")],
 15:[(4,"34454444444444333332")],
 16:[(4,"454"),(9,"3455224332"),(21,"432")],
 17:[(4,"454"),(9,"3455224332"),(21,"432")],
 18:[(4,"454"),(9,"2344223322"),(21,"432")],
 19:[(4,"454"),(10,"34322332"),(21,"432")],
 20:[(4,"453"),(10,"34322332"),(21,"432")],
 21:[(4,"453"),(10,"32322322"),(21,"432")],
 22:[(4,"443"),(10,"34322332"),(21,"332")],
 23:[(4,"443"),(10,"32322322"),(21,"332")],
 24:[(5,"443"),(10,"23422322"),(20,"332")],
 25:[(5,"443"),(10,"34322332"),(20,"332")],
 26:[(5,"443"),(9,"3443223322"),(20,"332")],
 27:[(5,"443"),(9,"3443223322"),(20,"332")],
 28:[(5,"43"),(8,"344432233322"),(20,"32")],
 29:[(6,"43"),(8,"344432233322"),(20,"32")],
 30:[(7,"34444322333322")],
 31:[(7,"34444322333322")],
 32:[(6,"3444443223333322")],
 33:[(6,"3444443223333322")],
 34:[(6,"3444443223333322")],
 35:[(6,"3444443223333322")],
 36:[(5,"344444432233333322")],
 37:[(5,"344444432233333322")],
 38:[(5,"344444432233333322")],
 39:[(5,"344444432233333322")],
 40:[(4,"34444444322333333322")],
 41:[(4,"34444444322333333322")],
 42:[(4,"34444444322333333322")],
 43:[(4,"34444444322333333322")],
 44:[(4,"23333333222233333222")],
 45:[(3,"2233333322222333332222")],
 46:[(4,"222"),(10,"2222"),(18,"222")],
}
NGEN_HANDS={
 30:[(6,"43"),(20,"32")],
 31:[(6,"443"),(19,"332")],
 32:[(6,"443"),(19,"332")],
 33:[(6,"432"),(19,"232")],
}
def ngen_body(fr,ramp,head,eye='k',glow='E',emblem=None):
    import math
    W,H=28,48;g=G(W,H);c=W/2
    dk=eye
    mp={'1':dk,'2':ramp[0],'3':ramp[1],'4':ramp[2],'5':ramp[3],'k':eye,'E':glow}
    def paint(d):
        for y,segs in d.items():
            for (x0,st) in segs:
                for i,ch in enumerate(st):
                    if ch=='.':continue
                    g.p(x0+i,y,mp[ch])
    paint(NGEN_BODY)
    # elemental strand shimmer on the lower flow (hand-drawn base, animated weave)
    for y in range(30,46):
        for x in range(3,26):
            cur=g.get(x,y)
            if cur==ramp[1] or cur==ramp[2]:
                t=math.sin(x*1.8+y*0.25+fr*3.14)
                if t>0.75 and cur==ramp[1]:g.p(x,y,ramp[2])
                elif t<-0.75 and cur==ramp[2]:g.p(x,y,ramp[1])
    # subtle muscle-strand striping on the torso
    for y in range(16,28):
        for x in range(9,19):
            cur=g.get(x,y)
            if cur==ramp[1] and (x*3+y)%7==0:g.p(x,y,ramp[0])
    paint(NGEN_HANDS)
    if emblem:
        ex,ey=13,19
        g.p(ex,ey,emblem);g.p(ex+1,ey,emblem);g.p(ex,ey+1,emblem);g.p(ex+1,ey+1,emblem)
        g.p(ex,ey-1,glow);g.p(ex+1,ey-1,glow)
    return g,c
def ngen_lafken(fr):
    import math
    g,c=ngen_body(fr,['d','m','l','w'],'w',eye='k',glow='E',emblem='l')
    for t in range(17):
        x=int(c-2+t*0.8);y=int(2-math.sin(t*0.35+fr*.8)*1.8+t*0.18)
        if y<3 or x>int(c+3):
            g.p(x,y,'f');g.p(x,y+1,'w')
            if y+2<3 or x-1>int(c+3):g.p(x-1,y+2,'l')
    for t in range(10):
        x=int(c+5+t*0.5);y=7+int(t*0.9)
        g.p(x,y,'w');g.p(x+1,y,'l')
    for (x,y) in [(6,21),(24,25),(5,34),(25,37),(8,43),(21,44)]:g.p(x,y,'f')
    for x in range(5,26):
        y=45+int(math.sin(x*0.8+fr)*1.1)
        g.p(x,y,'f');g.p(x,y+1,'w')
    g.p(3,44,'f');g.p(27,43,'f')
    g.outline();return g.rows()
def ngen_mawida(fr):
    import math
    g,c=ngen_body(fr,['B','b','h','m'],'h',eye='k',glow='E',emblem='y')
    for (x,y,rx,ry,col) in [(c,1.5,7,2.6,'G'),(c-4.5,3,3.6,2.3,'L'),(c+4.5,3,3.6,2.3,'L'),(c,0.5,3.6,1.7,'l'),(c-7,4.5,2.1,1.7,'G'),(c+7,4.5,2.1,1.7,'G')]:
        g.e(x,y,rx,ry,col)
    for (x,y) in [(int(c)-5,2),(int(c),0),(int(c)+5,2),(int(c)-2,3),(int(c)+3,1)]:g.p(x,y+fr,'y')
    for (x,y) in [(int(c)-3,23),(int(c)-2,24),(int(c)+2,30),(int(c)+3,31),(int(c)-4,38),(int(c)+1,41)]:g.p(x,y,'m')
    for (x0,dx) in [(int(c)-8,-1),(int(c)-3,0),(int(c)+3,0),(int(c)+8,1)]:
        for i in range(3):g.p(x0+dx*i,44+i,'B')
    g.outline();return g.rows()
def ngen_pewen(fr):
    import math
    g,c=ngen_body(fr,['U','u','F','g'],'F',eye='k',glow='E',emblem='s')
    for k in range(10):
        x=int(c-6.5+k*1.5);h0=3+(k%3)+(1 if (k+fr)%2 else 0)
        for i in range(h0):g.p(x,4-i,'n' if i<h0-1 else 'N')
    for k in range(7):g.p(int(c-6+k*2),4,'N')
    for sd in (-1,1):
        for k in range(4):
            x=int(c+sd*(7+k));y=13-(k%2)
            g.p(x,y,'n');g.p(x,y+1,'N')
    for (x,y) in [(int(c)-2,25),(int(c)+2,28),(int(c)-1,32),(int(c)+1,36)]:
        g.p(x,y,'g');g.p(x,y-1,'s')
    for (x0,dx) in [(int(c)-7,-1),(int(c),0),(int(c)+7,1)]:
        for i in range(3):g.p(x0+dx*i,44+i,'U')
    g.outline();return g.rows()
def ngen_kuruf(fr):
    import math
    g,c=ngen_body(fr,['B','b','w','R'],'w',eye='k',glow='E',emblem='r')
    for (sy,ln,ph) in [(4,13,0),(15,15,1.2),(18,11,2.4)]:
        for t in range(ln):
            x=int(c-6-t*0.9);y=int(sy+math.sin(t*0.5+fr*.9+ph)*1.8+t*0.22)
            g.p(x,y,'w' if t%3 else 'R');g.p(x,y+1,'b')
    for t in range(20):
        a=t/20*6.28+fr*.6;x=int(c+math.cos(a)*4.5);y=int(28+math.sin(a)*6)
        if t%2:g.p(x,y,'r')
    for y in range(42,48):
        for x in range(2,28):
            if g.get(x,y)!='.' and ((x*7+y*13+fr*5)%11)<3:g.a[y][x]='.'
    for (x,y) in [(4,43),(26,41),(2,46),(27,46),(7,47)]:
        g.p(x,y,'b');g.p(x+1,y,'w')
    g.outline();return g.rows()


def ngen_lelfun(fr):
    import math
    g,c=ngen_body(fr,['L','l','g','w'],'g',eye='k',glow='E',emblem='Y')
    # crown of tall grass blades, waving
    for k in range(11):
        x=int(c-7+k*1.4)
        h0=3+(k%4)+(1 if (k+fr)%2 else 0)
        bend=1 if (k+fr)%3==0 else 0
        for i in range(h0):
            g.p(x+(bend if i>h0-3 else 0),4-i,'l' if i<h0-1 else 'Y')
    # drifting seeds around the lower flow
    for t in range(9):
        a=t/9*6.28+fr*.7
        x=int(c+math.cos(a)*(8+t%3));y=int(30+math.sin(a)*9)
        if t%2:g.p(x,y,'Y')
        else:g.p(x,y,'w')
    # grass tufts where the body meets the ground
    for (x0,dx) in [(int(c)-8,-1),(int(c)-3,0),(int(c)+3,0),(int(c)+8,1)]:
        for i in range(3):g.p(x0+dx*i,44+i,'L')
        g.p(x0,43,'l')
    for (x,y) in [(5,42),(25,40),(3,46),(27,45)]:
        g.p(x,y,'l');g.p(x+1,y,'Y')
    g.outline();return g.rows()

PAL={
 'kawellu':{'b':'#9a5a2a','B':'#6e3a18','h':'#c27c40','m':'#2a1a10','e':'#000000','w':'#f2e6d0','n':'#4a2a14','k':'#2a2020','o':'#1a1008'},
 'waka':{'w':'#f6f4ee','W':'#c8c4bc','k':'#26221e','u':'#e6a0a0','n':'#8a4a4a','e':'#000000','c':'#e8dcc0','K':'#3a3430','o':'#1a1612'},
 'ofisa':{'w':'#f4f0e4','W':'#ffffff','s':'#d4ccb8','f':'#3a3434','e':'#e8e0d0','n':'#1a1414','o':'#1a1614'},
 'chonchon':{'s':'#d6a27a','S':'#a06a48','h':'#1c1418','W':'#f4f0e6','r':'#ff2a2a','k':'#5a0a0a','q':'#c87860','m':'#3a0e0e','w':'#5a3a5c','v':'#82587c','b':'#24142a','c':'#e8e0d0','o':'#0e060e'},
 'kutral':{'r':'#d82818','O':'#f87818','y':'#f8d040','w':'#fff8d0','k':'#3a0808','o':'#2a0806'},
 'pire':{'w':'#f4faff','b':'#a8c8f0','c':'#60e0ff','k':'#1a3a7a','o':'#203060'},
 'kura':{'g':'#8a8a90','G':'#5a5a64','k':'#2a2a30','e':'#ff8a20','h':'#c0c0c8','o':'#16161c'},
 'fkura':{'g':'#6a5a56','G':'#43322e','k':'#20140e','e':'#ffb020','h':'#ff7a30','o':'#120a06'},
 'nirivilu':{'o':'#200c08','b':'#d8742a','B':'#a04a14','g':'#f09a40','y':'#ffe040','w':'#f4e0b8','W':'#d0b080','k':'#241018','K':'#50242e','e':'#ffd040','n':'#180808','r':'#a82818'},
 'nguruvilu':{'o':'#1c1208','b':'#b06a28','B':'#774416','g':'#d89040','y':'#ffe9a0','w':'#ecd9a8','W':'#c0a468','k':'#17121c','K':'#363046','e':'#ffb830','n':'#0a0808','r':'#8a3420'},
 'cherrufe':{'b':'#3a2c2c','B':'#241a1c','h':'#6a5450','r':'#e83018','O':'#f89020','y':'#ffe880','l':'#e8401c','L':'#ffa030','o':'#0e0608'},
 'ngen_lafken':{'d':'#1d4c84','m':'#3a7ab8','l':'#6ab4e8','w':'#d8f2ff','f':'#ffffff','k':'#06182e','E':'#aef4ff','o':'#071a30'},
 'ngen_mawida':{'B':'#4a3418','b':'#6e5228','h':'#9c7c46','m':'#5a8a3c','G':'#2c5424','L':'#4a8a38','l':'#7ab858','y':'#ffd84a','k':'#1c1208','E':'#ffe878','o':'#120c04'},
 'ngen_pewen':{'U':'#5a4020','u':'#8a6434','F':'#c49a5c','g':'#e0a83c','s':'#ffd878','n':'#245232','N':'#3e7e4e','k':'#160e04','E':'#ffe9a0','o':'#120c04'},
 'kowek':{'b':'#3a8ad8','B':'#2a5aa8','l':'#9ad8ff','w':'#ffffff','k':'#0a1a40','o':'#0a1a3a'},
 'mawek':{'c':'#8a8a9a','C':'#5a5a6a','k':'#1a1a24','y':'#f8f080','d':'#7ab8f0','o':'#14141c'},
 'kamawetu':{'b':'#b0783a','B':'#7a5226','m':'#e0a890','k':'#1a1008','e':'#ffffff','y':'#ffe050','Y':'#c8a020','f':'#e8f6ff','o':'#140c06'},
 'basilisko':{'s':'#4a7a3a','S':'#2a4a22','w':'#f0e8d8','r':'#d82828','y':'#f0c020','e':'#ffe040','k':'#000000','o':'#0e140a'},
 'kaleuche':{'h':'#352c26','H':'#1d1814','k':'#120d0a','m':'#443a2c','s':'#c4dcca','S':'#7e9e88','y':'#8affb6','e':'#d6ffe4','b':'#cfc8ae','Q':'#3e7a52','q':'#101713','f':'#b9c8bd','F':'#89a090','o':'#070807'},
 'ngen_kuruf':{'B':'#8fb4c8','b':'#bedcec','w':'#e4f4fc','R':'#ffffff','r':'#58c8e0','k':'#17384a','E':'#d8fbff','o':'#2a4a5e'},
 'chinifilu':{'h':'#7a6a46','H':'#52452c','b':'#a89468','m':'#4a4034','M':'#2b2518','e':'#ffe060','w':'#f0e8d8','t':'#d84040','k':'#161208','o':'#0d0a06'},
 'piwuchen':{'w':'#6a4a66','W':'#9a6a8e','s':'#7a3a3a','S':'#521f24','b':'#a85a50','t':'#f0e8d8','M':'#2e0a12','e':'#ff4040','k':'#180a10','o':'#140810'},
 'wallipen':{'w':'#cfcfc2','W':'#9f9f92','d':'#6a6a5e','h':'#8a7458','H':'#5e4c38','e':'#90c8ff','n':'#39302a','k':'#201c16','o':'#16120e'},
 'trawko':{'h':'#a08448','H':'#6a5430','f':'#a88a5c','F':'#7a6238','b':'#5a7a3a','B':'#3a5424','c':'#6a5a3c','C':'#463a22','a':'#d0ccc4','A':'#8a8882','s':'#6a4a28','r':'#8e2a2a','N':'#86704a','e':'#ff3838','t':'#f4f0e4','n':'#1a1612','k':'#120e0a','o':'#0c0a06'},
 'luan':{'b':'#c89a5a','B':'#a0763c','w':'#f0e4cc','n':'#4a3418','e':'#201408','o':'#241a0c'},
 'choyke':{'b':'#8a7a56','B':'#6a5c3e','w':'#c8bc9c','n':'#3a3020','e':'#180f06','o':'#1c160c'},
 'mewlen':{'s':'#d8bc6a','S':'#a8883e','y':'#f0dc94','d':'#8a6e30','k':'#3a2c10','e':'#ffe860','o':'#2a2008'},
 'kurutrewa':{'h':'#262028','H':'#141016','w':'#e8e0d0','u':'#3a3038','e':'#ff3828','o':'#080608'},
 'fmewlen':{'s':'#d0b25c','S':'#9a7a34','y':'#eed488','d':'#7a6028','D':'#5a4618','k':'#2e2208','e':'#ffdf50','o':'#241c06'},
 'kurutoro':{'h':'#2a2226','H':'#161014','w':'#e8ddc8','u':'#3e343a','n':'#584048','r':'#c83020','e':'#ff4a28','k':'#0a0608','o':'#060406'},
 'walichu':{'m':'#565042','M':'#332f26','u':'#6e6856','f':'#e8e0ca','F':'#b6ae96','w':'#d8d0b8','k':'#16120c','E':'#ffd548','d':'#c0a868','o':'#0d0b07'},
 'llufu1':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu2':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu3':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu4':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu5':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'ngoyam':{'w':'#cfd4da','s':'#9aa2ac','d':'#5e6670','k':'#1a1e26','e':'#9ad8ff','o':'#141820'},
 'yewen':{'h':'#6e6888','H':'#4c4766','d':'#3a3846','D':'#262430','k':'#0c0a12','e':'#e0d8f0','E':'#a098b0','p':'#c0b4b8','P':'#8e8288','w':'#e6e6ea','W':'#9a9aa2','s':'#8a8498','S':'#5e5868','K':'#0a0810','o':'#060608'},
 'wenangkun':{'b':'#5a6a8a','B':'#3a4560','h':'#4a5470','k':'#10121c','e':'#d8ecff','t':'#9ad0ff','T':'#5a90c8','c':'#8a94a8','C':'#5e687c','w':'#b4bccb','p':'#8a8ea8','P':'#5e6480','K':'#0a0c14','o':'#080a10'},
 'illkun':{'r':'#8e2018','R':'#4e0e0a','s':'#c8503a','k':'#120404','w':'#f0e0c8','e':'#ffd040','v':'#b8a8a8','y':'#ffb040','Y':'#e8461a','K':'#100404','o':'#0c0303'},
 'llukalfe':{'s':'#2c2640','S':'#16121f','e':'#f0f0ff','k':'#000000','m':'#c8c4d8','g':'#7a4ac0','K':'#06040a','o':'#05030a'},
 'ayentufe':{'j':'#1e2a50','J':'#101834','d':'#2e2e3a','w':'#e8e8ec','p':'#a89080','P':'#6a5a50','m':'#e6dfd0','M':'#e02838','k':'#0a080e','r':'#a01828','y':'#ffe060','K':'#08080c','o':'#060608'},
 'profe':{'F':'#6a4a2a','b':'#2e4a38','c':'#e8ecdc','x':'#c02828','S':'#3a3a44','s':'#5c5c68','w':'#e8e4dc','k':'#141418','p':'#e0b898','P':'#a8806a','h':'#4a3a30','G':'#c8e0f0','W':'#ffffff','u':'#d0a860','U':'#8a6a38','K':'#0a0a0c','o':'#08080a'},
 'kalku':{'f':'#23262e','F':'#111318','h':'#b8bcc2','H':'#8a8e96','p':'#d8cfc0','P':'#a89c8a','b':'#d8d0ba','B':'#a89e86','k':'#07080c','e':'#c080ff','o':'#060608'},
 'ngoyman1':{'w':'#b8c0cc','s':'#7e8896','d':'#363e4c','k':'#0a0c12','E':'#ffb24a','o':'#080a0e','r':'#b4420f'},
 'ngoyman2':{'s':'#8a909c','S':'#5a606c','d':'#aeb6c2','g':'#7affd0','G':'#2a9a74','k':'#14161c','o':'#0e1016'},
 'ngoyman3':{'w':'#c6ccd8','s':'#848e9c','d':'#3a4250','k':'#090b10','E':'#ffe9a0','o':'#080a0e'},
 'ngoyman4':{'w':'#aab4c8','s':'#707a92','d':'#2a3146','k':'#06080d','E':'#ff9c80','o':'#050710'},
 'ngoyman5':{'w':'#d8dde6','s':'#8e98a8','d':'#333b4c','k':'#07090e','E':'#ffe9a0','o':'#060810','v':'#5c6b48','c':'#4e86a0','g':'#3f6b3a','r':'#c2561e','y':'#c8b060','f':'#c89a72','B':'#1c222e'},
 'chadikura':{'w':'#fdfbf2','W':'#d8d2c0','s':'#b0a89a','S':'#6e685c','p':'#ecc4ba','g':'#7affd0','G':'#2a9a74','k':'#141210','o':'#262420'},
 'epunamun':{'s':'#b87848','S':'#965c32','c':'#6e4c26','C':'#4a3218','h':'#241a10','n':'#1c140c','r':'#d83030','w':'#f0ead2','a':'#7a5a2e','A':'#a0a0aa','e':'#ffd040','k':'#160e08','o':'#0f0905'},
 'ngen_lelfun':{'L':'#4c4414','l':'#8a7a28','g':'#d0b44c','w':'#f4ecc8','Y':'#ffd848','k':'#1a1404','E':'#fff2b0','o':'#141004'},
 'trelke':{'h':'#6a5a34','H':'#463a20','u':'#8a7a4c','m':'#9a4a48','M':'#6a2a2e','W':'#e8c8c0','w':'#f4f0e0','r':'#a8503a','R':'#7a3424','e':'#ffd040','o':'#140e08'},
 'witranalwe':{'H':'#16161e','h':'#4a4a3a','q':'#0e0e14','F':'#c8ccc0','f':'#7a8274','k':'#0a0a0a','E':'#7aff9a','w':'#e8e8d8','P':'#24242c','p':'#34343e','A':'#3a3a46','K':'#9a9a90','c':'#d8d8c8','g':'#b8b8ac','G':'#808078','L':'#101014','o':'#040406'}}

# ---------- hi-res battle versions of the bosses ----------
def scale2x(rows):
    h=len(rows);w=len(rows[0]);out=[['.']*(w*2) for _ in range(h*2)]
    g=lambda x,y:rows[y][x] if 0<=x<w and 0<=y<h else '.'
    for y in range(h):
        for x in range(w):
            P=g(x,y);A=g(x,y-1);B=g(x+1,y);C=g(x-1,y);Dd=g(x,y+1)
            e0=A if (C==A and C!=Dd and A!=B) else P
            e1=B if (A==B and A!=C and B!=Dd) else P
            e2=C if (Dd==C and Dd!=B and C!=A) else P
            e3=Dd if (B==Dd and B!=A and Dd!=C) else P
            out[2*y][2*x]=e0;out[2*y][2*x+1]=e1;out[2*y+1][2*x]=e2;out[2*y+1][2*x+1]=e3
    return out
def hexrgb(h):return tuple(int(h[i:i+2],16) for i in (1,3,5))
def mix(a,b,t):return tuple(int(round(a[i]+(b[i]-a[i])*t)) for i in range(3))
def hhash(x,y,k):
    import math;v=math.sin(x*12.9898+y*78.233+k*37.7)*43758.5453;return v-math.floor(v)
HI={
 'nguruvilu':{'glow':'yne','tex':{'k':'strand','K':'strand','b':'speck','w':'speck'}},
 'nirivilu':{'glow':'yne','tex':{'k':'strand','K':'strand','b':'speck','w':'speck'}},
 'witranalwe':{'glow':'EwFc','tex':{'P':'streak','q':'streak','A':'streak','g':'strand','G':'strand','H':'speck'}},
 'ngen_lafken':{'glow':'fE','tex':{'d':'streak','m':'streak','l':'streak','w':'speck'}},
 'ngen_mawida':{'glow':'yE','tex':{'b':'strand','B':'strand','h':'strand','m':'speck','L':'speck','G':'speck','l':'speck'}},
 'ngen_pewen':{'glow':'sE','tex':{'u':'strand','U':'strand','F':'pore','n':'speck','N':'speck','g':'streak'}},
 'ngen_kuruf':{'glow':'RE','tex':{'b':'streak','B':'streak','w':'streak','r':'speck'}},
 'luan':{'b':'#c89a5a','B':'#a0763c','w':'#f0e4cc','n':'#4a3418','e':'#201408','o':'#241a0c'},
 'choyke':{'b':'#8a7a56','B':'#6a5c3e','w':'#c8bc9c','n':'#3a3020','e':'#180f06','o':'#1c160c'},
 'mewlen':{'s':'#d8bc6a','S':'#a8883e','y':'#f0dc94','d':'#8a6e30','k':'#3a2c10','e':'#ffe860','o':'#2a2008'},
 'kurutrewa':{'h':'#262028','H':'#141016','w':'#e8e0d0','u':'#3a3038','e':'#ff3828','o':'#080608'},
 'fmewlen':{'s':'#d0b25c','S':'#9a7a34','y':'#eed488','d':'#7a6028','D':'#5a4618','k':'#2e2208','e':'#ffdf50','o':'#241c06'},
 'kurutoro':{'h':'#2a2226','H':'#161014','w':'#e8ddc8','u':'#3e343a','n':'#584048','r':'#c83020','e':'#ff4a28','k':'#0a0608','o':'#060406'},
 'walichu':{'m':'#565042','M':'#332f26','u':'#6e6856','f':'#e8e0ca','F':'#b6ae96','w':'#d8d0b8','k':'#16120c','E':'#ffd548','d':'#c0a868','o':'#0d0b07'},
 'llufu1':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu2':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu3':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu4':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu5':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'ngoyam':{'w':'#cfd4da','s':'#9aa2ac','d':'#5e6670','k':'#1a1e26','e':'#9ad8ff','o':'#141820'},
 'kalku':{'f':'#23262e','F':'#111318','h':'#b8bcc2','H':'#8a8e96','p':'#d8cfc0','P':'#a89c8a','b':'#d8d0ba','B':'#a89e86','k':'#07080c','e':'#c080ff','o':'#060608'},
 'ngoyman1':{'w':'#b8c0cc','s':'#7e8896','d':'#363e4c','k':'#0a0c12','E':'#ffb24a','o':'#080a0e','r':'#b4420f'},
 'ngoyman2':{'s':'#8a909c','S':'#5a606c','d':'#aeb6c2','g':'#7affd0','G':'#2a9a74','k':'#14161c','o':'#0e1016'},
 'ngoyman3':{'w':'#c6ccd8','s':'#848e9c','d':'#3a4250','k':'#090b10','E':'#ffe9a0','o':'#080a0e'},
 'ngoyman4':{'w':'#aab4c8','s':'#707a92','d':'#2a3146','k':'#06080d','E':'#ff9c80','o':'#050710'},
 'ngoyman5':{'w':'#d8dde6','s':'#8e98a8','d':'#333b4c','k':'#07090e','E':'#ffe9a0','o':'#060810','v':'#5c6b48','c':'#4e86a0','g':'#3f6b3a','r':'#c2561e','y':'#c8b060','f':'#c89a72','B':'#1c222e'},
 'chadikura':{'w':'#fdfbf2','W':'#d8d2c0','s':'#b0a89a','S':'#6e685c','p':'#ecc4ba','g':'#7affd0','G':'#2a9a74','k':'#141210','o':'#262420'},
 'epunamun':{'s':'#b87848','S':'#965c32','c':'#6e4c26','C':'#4a3218','h':'#241a10','n':'#1c140c','r':'#d83030','w':'#f0ead2','a':'#7a5a2e','A':'#a0a0aa','e':'#ffd040','k':'#160e08','o':'#0f0905'},
 'ngen_lelfun':{'L':'#4c4414','l':'#8a7a28','g':'#d0b44c','w':'#f4ecc8','Y':'#ffd848','k':'#1a1404','E':'#fff2b0','o':'#141004'},
 'trelke':{'glow':'ewW','tex':{'h':'pore','H':'pore','u':'pore','m':'speck','M':'speck','r':'speck'}},
 'cherrufe':{'glow':'lLyOr','tex':{'b':'crack','B':'crack','h':'speck'}},
 'kaleuche':{'glow':'ye','tex':{'h':'streak','H':'streak','s':'speck','S':'speck','f':'speck','F':'speck','b':'pore','q':'speck'}},
 'chinifilu':{'glow':'e','tex':{'h':'strand','H':'strand','b':'pore','m':'strand','M':'strand'}},
 'piwuchen':{'glow':'e','tex':{'w':'streak','W':'streak','s':'pore','S':'pore'}},
 'wallipen':{'glow':'e','tex':{'w':'pore','W':'pore','h':'pore'}},
 'trawko':{'glow':'e','tex':{'c':'strand','C':'strand','h':'pore','b':'speck'}},
 'walichu':{'glow':'E','tex':{'m':'strand','M':'strand','u':'strand','f':'pore','F':'pore'}},
 'llufu1':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu2':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu3':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu4':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu5':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'ngoyam':{'w':'#cfd4da','s':'#9aa2ac','d':'#5e6670','k':'#1a1e26','e':'#9ad8ff','o':'#141820'},
 'kalku':{'f':'#23262e','F':'#111318','h':'#b8bcc2','H':'#8a8e96','p':'#d8cfc0','P':'#a89c8a','b':'#d8d0ba','B':'#a89e86','k':'#07080c','e':'#c080ff','o':'#060608'},
 'ngoyman1':{'w':'#b8c0cc','s':'#7e8896','d':'#363e4c','k':'#0a0c12','E':'#ffb24a','o':'#080a0e','r':'#b4420f'},
 'ngoyman2':{'s':'#8a909c','S':'#5a606c','d':'#aeb6c2','g':'#7affd0','G':'#2a9a74','k':'#14161c','o':'#0e1016'},
 'ngoyman3':{'w':'#c6ccd8','s':'#848e9c','d':'#3a4250','k':'#090b10','E':'#ffe9a0','o':'#080a0e'},
 'ngoyman4':{'w':'#aab4c8','s':'#707a92','d':'#2a3146','k':'#06080d','E':'#ff9c80','o':'#050710'},
 'ngoyman5':{'w':'#d8dde6','s':'#8e98a8','d':'#333b4c','k':'#07090e','E':'#ffe9a0','o':'#060810','v':'#5c6b48','c':'#4e86a0','g':'#3f6b3a','r':'#c2561e','y':'#c8b060','f':'#c89a72','B':'#1c222e'},
 'chadikura':{'w':'#fdfbf2','W':'#d8d2c0','s':'#b0a89a','S':'#6e685c','p':'#ecc4ba','g':'#7affd0','G':'#2a9a74','k':'#141210','o':'#262420'},
 'epunamun':{'glow':'e','tex':{'s':'pore','S':'pore','c':'strand','C':'strand','r':'strand'}},
 'llufu1':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu2':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu3':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu4':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'llufu5':{'b':'#1e5a66','B':'#0e3440','s':'#3a8a96','w':'#bfe8ee','f':'#2aa8b8','F':'#116874','e':'#ffd84a','t':'#e8f4f0','g':'#64ffd8','G':'#1a8a70','k':'#061418','o':'#04100f','r':'#a0a8ae','R':'#636b73'},
 'ngoyam':{'w':'#cfd4da','s':'#9aa2ac','d':'#5e6670','k':'#1a1e26','e':'#9ad8ff','o':'#141820'},
 'kalku':{'f':'#23262e','F':'#111318','h':'#b8bcc2','H':'#8a8e96','p':'#d8cfc0','P':'#a89c8a','b':'#d8d0ba','B':'#a89e86','k':'#07080c','e':'#c080ff','o':'#060608'},
 'ngoyman1':{'w':'#b8c0cc','s':'#7e8896','d':'#363e4c','k':'#0a0c12','E':'#ffb24a','o':'#080a0e','r':'#b4420f'},
 'ngoyman2':{'s':'#8a909c','S':'#5a606c','d':'#aeb6c2','g':'#7affd0','G':'#2a9a74','k':'#14161c','o':'#0e1016'},
 'ngoyman3':{'w':'#c6ccd8','s':'#848e9c','d':'#3a4250','k':'#090b10','E':'#ffe9a0','o':'#080a0e'},
 'ngoyman4':{'w':'#aab4c8','s':'#707a92','d':'#2a3146','k':'#06080d','E':'#ff9c80','o':'#050710'},
 'ngoyman5':{'w':'#d8dde6','s':'#8e98a8','d':'#333b4c','k':'#07090e','E':'#ffe9a0','o':'#060810','v':'#5c6b48','c':'#4e86a0','g':'#3f6b3a','r':'#c2561e','y':'#c8b060','f':'#c89a72','B':'#1c222e'},
 'chadikura':{'glow':'gG','tex':{'w':'crack','W':'crack','s':'speck'}},
 'llufu1':{'glow':'egG','tex':{'b':'pore','B':'pore','s':'speck','f':'streak','F':'streak'}},
 'llufu2':{'glow':'egG','tex':{'b':'pore','B':'pore','s':'speck','f':'streak','F':'streak'}},
 'llufu3':{'glow':'egG','tex':{'b':'pore','B':'pore','s':'speck','f':'streak','F':'streak'}},
 'llufu4':{'glow':'egG','tex':{'b':'pore','B':'pore','s':'speck','f':'streak','F':'streak'}},
 'llufu5':{'glow':'egG','tex':{'b':'pore','B':'pore','s':'speck','f':'streak','F':'streak'}},
 'yewen':{'glow':'e','tex':{'h':'streak','H':'streak','s':'strand','S':'strand'}},
 'wenangkun':{'glow':'et','tex':{'b':'streak','B':'streak','h':'strand','c':'speck'}},
 'illkun':{'glow':'eyY','tex':{'r':'pore','R':'pore'}},
 'llukalfe':{'glow':'eg','tex':{'s':'strand','S':'strand'}},
 'ayentufe':{'glow':'My','tex':{'j':'streak','J':'streak','d':'speck'}},
 'profe':{'glow':'GW','tex':{'s':'streak','S':'streak','b':'speck'}},
 'kalku':{'glow':'e','tex':{'f':'strand','F':'strand','h':'strand','H':'strand'}},
 'ngoyman1':{'glow':'E','tex':{'s':'streak','w':'streak','d':'streak'}},
 'ngoyman2':{'glow':'gG','tex':{'s':'crack','S':'crack','d':'streak'}},
 'ngoyman3':{'glow':'E','tex':{'s':'streak','w':'streak','d':'streak'}},
 'ngoyman4':{'glow':'E','tex':{'s':'streak','w':'streak','d':'streak'}},
 'ngoyman5':{'glow':'E','tex':{'s':'streak','w':'streak','d':'streak'}},
 'ngen_lelfun':{'glow':'YE','tex':{'L':'strand','l':'strand','g':'pore','w':'speck'}}}
def hires(name,rows,pal):
    big=scale2x(rows);h=len(big);w=len(big[0]);cfg=HI[name]
    px=[[None]*w for _ in range(h)]
    solid=lambda x,y:0<=x<w and 0<=y<h and big[y][x] not in '.'
    same=lambda x,y,ch:0<=x<w and 0<=y<h and big[y][x]==ch
    for y in range(h):
        for x in range(w):
            ch=big[y][x]
            if ch=='.':continue
            base=hexrgb(pal[ch])
            if ch=='o' or ch in cfg['glow']:px[y][x]=base;continue
            dark=mix(base,(0,0,0),.42);lite=mix(base,(255,255,255),.22);hl=mix(base,(255,255,255),.42)
            col=base
            # bevel: light from upper-left
            ul=sum(1 for d in (1,2) if not same(x-d,y,ch))+sum(1 for d in (1,2) if not same(x,y-d,ch))
            dr=sum(1 for d in (1,2) if not same(x+d,y,ch))+sum(1 for d in (1,2) if not same(x,y+d,ch))
            if ul>=2 and dr==0:col=lite
            if not same(x-1,y,ch) and not same(x,y-1,ch):col=hl
            if dr>=2 and ul==0:col=dark
            elif dr>=1 and ul==0 and (x+y)%2==0:col=mix(base,dark,.5)
            t=cfg['tex'].get(ch)
            n=hhash(x,y,ord(ch))
            if t=='speck' and n<.08:col=mix(col,dark,.6)
            elif t=='speck' and n>.95:col=mix(col,hl,.6)
            elif t=='streak' and (x*7+int(hhash(x,0,3)*5))%9==0 and n<.85:col=mix(col,lite if x%2 else dark,.55)
            elif t=='strand' and x%2==0:col=mix(col,dark,.35)
            elif t=='pore' and n<.06:col=mix(col,dark,.7)
            elif t=='pore' and n>.97:col=mix(col,hl,.5)
            elif t=='crack' and n<.05:col=mix(col,(255,90,30),.55)
            px[y][x]=col
    # glow halos around glowing pixels
    for y in range(h):
        for x in range(w):
            ch=big[y][x]
            if ch in cfg['glow'] and ch!='o':
                gc=hexrgb(pal[ch])
                for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
                    X,Y=x+dx,y+dy
                    if 0<=X<w and 0<=Y<h and px[Y][X] and big[Y][X] not in cfg['glow'] and big[Y][X]!='o':
                        px[Y][X]=mix(px[Y][X],gc,.35)
    # encode with an auto palette
    cols={};CH='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+,-/:;<=>?@[]^_{|}~'
    out=[]
    for y in range(h):
        r=''
        for x in range(w):
            c=px[y][x]
            if c is None:r+='.';continue
            hx='#%02x%02x%02x'%c
            if hx not in cols:
                if len(cols)>=len(CH):
                    best=min(cols,key=lambda k:sum((int(k[i:i+2],16)-int(hx[i:i+2],16))**2 for i in (1,3,5)));r+=cols[best];continue
                cols[hx]=CH[len(cols)]
            r+=cols[hx]
        out.append(r)
    return {v:k for k,v in cols.items()},out
D={}
BIG={'llufu1':2,'llufu2':2,'llufu3':2,'llufu4':2,'llufu5':2,'walichu':2,'epunamun':2,'chadikura':2,'ngoyam':2,'kalku':2,'yewen':2,'wenangkun':2,'illkun':2,'llukalfe':2,'ayentufe':2,'profe':2,'ngoyman1':2,'ngoyman2':2,'ngoyman3':2,'ngoyman4':2,'ngoyman5':2,'mewlen':2,'kurutrewa':2,'fmewlen':2,'kurutoro':2,'chinifilu':2,'piwuchen':2,'wallipen':2,'trawko':2,'kowek':2,'mawek':2,'kamawetu':2,'basilisko':2,'kaleuche':2,'trelke':2,'witranalwe':2,'chonchon':2,'kutral':2,'pire':2,'kura':2,'fkura':2,'nirivilu':2,'nguruvilu':2,'cherrufe':2}
for name,fn in [('kawellu',horse),('waka',cow),('ofisa',sheep),('witranalwe',witranalwe2),('chonchon',chonchon),('kutral',kutral),('pire',pire),('kura',kura),('fkura',kura),('nirivilu',ngurufilu),('nguruvilu',ngurufilu),('cherrufe',cherrufe2),('trelke',trelke),('ngen_lafken',ngen_lafken),('ngen_mawida',ngen_mawida),('ngen_pewen',ngen_pewen),('kowek',kowek),('mawek',mawek),('kamawetu',kamawetu),('basilisko',basilisko),('kaleuche',kaleuche),('ngen_kuruf',ngen_kuruf),('chinifilu',chinifilu),('piwuchen',piwuchen),('wallipen',wallipen),('trawko',trawko),('luan',luan),('choyke',choyke),('mewlen',mewlen),('kurutrewa',kurutrewa),('fmewlen',fmewlen),('kurutoro',kurutoro),('walichu',walichu),('epunamun',epunamun),('chadikura',chadikura),('ngoyam',ngoyam),('kalku',kalku),('yewen',yewen),('wenangkun',wenangkun),('illkun',illkun),('llukalfe',llukalfe),('ayentufe',ayentufe),('profe',profe),('ngoyman1',ngoyman1),('ngoyman2',ngoyman2),('ngoyman3',ngoyman3),('ngoyman4',ngoyman4),('ngoyman5',ngoyman5),('llufu1',llufu1),('llufu2',llufu2),('llufu3',llufu3),('llufu4',llufu4),('llufu5',llufu5),('ngen_lelfun',ngen_lelfun)]:
    D[name]={'pal':PAL[name],'f':[fn(0),fn(1)],'big':BIG.get(name,1),'aura':{'witranalwe':'150,230,170','cherrufe':'255,130,50','trelke':'150,200,120','kaleuche':'190,220,200','chinifilu':'170,180,130','piwuchen':'230,120,140','wallipen':'60,70,100','trawko':'190,220,140','walichu':'210,200,160','epunamun':'255,170,90','chadikura':'150,255,210','kalku':'170,110,230','yewen':'110,100,130','wenangkun':'90,130,200','illkun':'255,90,40','llukalfe':'110,70,170','ayentufe':'200,60,80','profe':'150,150,160','fkura':'255,120,50','mewlen':'70,55,25','fmewlen':'60,46,20','pire':'70,100,170','ngoyman1':'110,150,90','ngoyman2':'100,160,100','ngoyman3':'110,150,90','ngoyman4':'90,130,70','ngoyman5':'130,170,100','llufu1':'80,200,190','llufu2':'80,200,190','llufu3':'80,200,190','llufu4':'120,255,215','llufu5':'110,230,210'}.get(name,0)}
for name in ['nguruvilu','nirivilu','witranalwe','trelke','cherrufe','kaleuche','ngen_lafken','ngen_mawida','ngen_pewen','ngen_kuruf','chinifilu','piwuchen','wallipen','trawko','walichu','epunamun','chadikura','kalku','yewen','wenangkun','illkun','llukalfe','ayentufe','profe','ngoyman1','ngoyman2','ngoyman3','ngoyman4','ngoyman5','llufu1','llufu2','llufu3','llufu4','llufu5','ngen_lelfun']:
    fr=[];pal=None
    for f in D[name]['f']:
        p,rows=hires(name,f,PAL[name]);fr.append((p,rows))
    merged={};
    # unify palettes across frames
    allc={}
    for p,rows in fr:
        for k,v in p.items():allc.setdefault(v,None)
    CH='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+,-/:;<=>?@[]^_{|}~'
    keys=list(allc)[:len(CH)];cmap={c:CH[i] for i,c in enumerate(keys)}
    def near(hx):
        if hx in cmap:return cmap[hx]
        best=min(cmap,key=lambda k:sum((int(k[i:i+2],16)-int(hx[i:i+2],16))**2 for i in (1,3,5)));return cmap[best]
    frames=[[''.join('.' if ch=='.' else near(p[ch]) for ch in r) for r in rows] for p,rows in fr]
    D[name+'@b']={'pal':{v:k for k,v in cmap.items()},'f':frames,'big':1,'aura':D[name]['aura']}
# Yewen is hand-painted at native resolution (tools/yewen_paint.py): use it as is, no upscaler, no auto-shading
_yp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'yewen.json')
if os.path.exists(_yp):
    _y=json.load(open(_yp))
    D['yewen']={'pal':_y['small']['pal'],'f':_y['small']['f'],'big':1,'aura':'150,40,130','hand':1}
    D['yewen@b']={'pal':_y['big']['pal'],'f':_y['big']['f'],'big':1,'aura':'150,40,130','hand':1}
_kp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'kin.json')
if os.path.exists(_kp):
    for _n,_k in json.load(open(_kp)).items():
        _a=D[_n]['aura'] if _n in D else 0
        D[_n]={'pal':_k['small']['pal'],'f':_k['small']['f'],'big':1,'aura':_a,'hand':1}
        D[_n+'@b']={'pal':_k['big']['pal'],'f':_k['big']['f'],'big':1,'aura':_a,'hand':1}
_wp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'waria.json')
if os.path.exists(_wp):
    for _n,_k in json.load(open(_wp)).items():
        _a='120,170,220' if _n in ('ngoyngoyun','ngamlef','fillantu') else 0
        D[_n]={'pal':_k['small']['pal'],'f':_k['small']['f'],'big':1,'aura':_a,'hand':1}
        D[_n+'@b']={'pal':_k['big']['pal'],'f':_k['big']['f'],'big':1,'aura':_a,'hand':1}
_hp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'heroes.json')
if os.path.exists(_hp):
    for _n,_h in json.load(open(_hp)).items():D['hero_'+_n]={'pal':_h['pal'],'f':_h['f'],'big':1,'aura':0,'hand':1}
_sp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'stgopeople.json')
if os.path.exists(_sp):
    for _n,_h in json.load(open(_sp)).items():D['hero_stg_'+_n]={'pal':_h['pal'],'f':_h['f'],'big':1,'aura':0,'hand':1}
_lp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'lofpeople.json')
if os.path.exists(_lp):
    for _n,_h in json.load(open(_lp)).items():D['hero_lof_'+_n]={'pal':_h['pal'],'f':_h['f'],'big':1,'aura':0,'hand':1}
# every boss and every form of the final boss: repainted with the Yewen's 3D method (tools/repaint.py)
import repaint as _rp, yewen_paint as _yp
_BOSSES=['trelke','cherrufe','kaleuche','witranalwe','chinifilu','piwuchen','wallipen','trawko','walichu','chadikura','epunamun','kalku',
         'ngoyman1','ngoyman2','ngoyman3','ngoyman4','ngoyman5','llufu1','llufu2','llufu3','llufu4','llufu5']
_SKIP={'kawellu','waka','ofisa','luan','choyke','yewen','wenangkun','illkun','llukalfe','ayentufe','profe','ngen_lafken','ngen_mawida','ngen_pewen','ngen_kuruf','ngen_lelfun'}
_ALL=_BOSSES+[n for n in list(D) if '@' not in n and n not in _BOSSES and n not in _SKIP and n in PAL]
_HANDB=set(json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'boss.json')))) if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),'boss.json')) else set()
for _n in _ALL:
    if _n not in D or _n not in PAL or _n in _HANDB:continue
    if _n not in _BOSSES:
        _g=HI.get(_n,{}).get('glow','')
        _src=(lambda f:scale2x(f)) if D[_n].get('big',1)==2 else (lambda f:f)
        _fr=[_rp.repaint(_src(f),PAL[_n],_g,D[_n].get('aura') or None) for f in D[_n]['f']]
        _p,_f=_yp.encode(_fr);D[_n+'@b']={'pal':_p,'f':_f,'big':1,'aura':D[_n].get('aura',0),'hand':1};continue
    _g=HI.get(_n,{}).get('glow','')
    _fr=[_rp.repaint(scale2x(f),PAL[_n],_g,D[_n].get('aura') or None) for f in D[_n]['f']]
    _p,_f=_yp.encode(_fr)
    D[_n+'@b']={'pal':_p,'f':_f,'big':1,'aura':D[_n].get('aura',0),'hand':1}
# the bosses, hand-painted one by one with the Yewen's method (tools/boss_paint.py): they replace the automatic repaint above
_bp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'boss.json')
if os.path.exists(_bp):
    for _n,_k in json.load(open(_bp)).items():
        _a=D[_n].get('aura',0) if _n in D else 0
        D[_n]={'pal':_k['small']['pal'],'f':_k['small']['f'],'big':1,'aura':_a,'hand':1}
        D[_n+'@b']={'pal':_k['big']['pal'],'f':_k['big']['f'],'big':1,'aura':_a,'hand':1}
open(OUT,'w').write('const SPR2='+json.dumps(D,ensure_ascii=False)+';\n')
if __name__=='__main__':
    for n in D:
        print(n);print('\n'.join(D[n]['f'][0]))
