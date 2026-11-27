"""Post-credits stinger: Fütra Ngoymatulfe in a neon future city raises its arms and casts the lan kewün into a portal."""
import numpy as np, math, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
W,H,FPS=1280,720,30
DUR=10.0; N=int(DUR*FPS)
rng=random.Random(7)
FONT='/usr/share/fonts/truetype/google-fonts/ofl/gelasio/Gelasio[wght].ttf'
def ease(x):x=max(0.,min(1.,x));return x*x*(3-2*x)
# ---------- the city (static) ----------
def city():
    bg=Image.new('RGB',(W,H));d=ImageDraw.Draw(bg)
    for y in range(H):   # sky: deep violet to magenta haze at the horizon
        t=y/H;c=(int(14+60*t**2),int(6+10*t),int(34+70*t**1.5));d.line([(0,y),(W,y)],fill=c)
    # far, mid, near towers
    layers=[(0.58,(40,26,70),(150,120,220),46),(0.46,(24,15,48),(90,220,255),34),(0.34,(10,6,22),(255,70,200),26)]
    for li,(top,col,win,wmin) in enumerate(layers):
        x=-20
        while x<W+20:
            w=rng.randint(wmin,wmin*3);h=int(H*(1-top)+rng.randint(-60,140)*(1+li*.4))
            y0=H-h; d.rectangle([x,y0,x+w,H],fill=col);lit=rng.random()<.6
            d.line([(x,y0),(x+w,y0)],fill=tuple(min(255,v+30) for v in col))
            if rng.random()<.3: d.rectangle([x+w//2-2,y0-rng.randint(20,60),x+w//2+2,y0],fill=col)   # antenna
            for wy in range(y0+8,H-60,9 if li<2 else 7):
                for wx in range(x+4,x+w-4,7 if li<2 else 6):
                    if lit and rng.random()<(.10 if li==0 else .16):
                        k=rng.random();c=tuple(int(v*(.5+.5*k)) for v in win);d.rectangle([wx,wy,wx+2+li,wy+2+li//2],fill=c)
            x+=w+rng.randint(2,14)
        fog=Image.new('RGBA',(W,H));fd=ImageDraw.Draw(fog)
        for yy in range(H):fd.line([(0,yy),(W,yy)],fill=(70,30,90,int(70*max(0,(yy/H-.35))) ))
        bg=bg.convert('RGBA');bg.alpha_composite(fog);bg=bg.convert('RGB');d=ImageDraw.Draw(bg)
    # neon signs on the near towers (no words: glowing bars and the trarikan diamond in neon)
    glow=Image.new('RGB',(W,H));g=ImageDraw.Draw(glow)
    for (x,y,w,h,c) in [(90,330,26,120,(255,40,170)),(1150,300,30,140,(40,230,255)),(240,410,90,18,(120,255,140)),(980,380,110,16,(255,180,40)),(60,470,60,14,(40,230,255)),(1190,470,50,14,(255,40,170))]:
        g.rectangle([x,y,x+w,y+h],outline=c,width=3)
        for k in range(3): g.line([(x+5,y+8+k*(h//3)),(x+w-5,y+8+k*(h//3))],fill=c,width=2)
    for (cx,cy,s,c) in [(330,250,18,(255,60,200)),(950,230,16,(60,220,255))]:
        g.polygon([(cx,cy-s),(cx+s,cy),(cx,cy+s),(cx-s,cy)],outline=c,width=3);g.polygon([(cx,cy-s//2),(cx+s//2,cy),(cx,cy+s//2),(cx-s//2,cy)],outline=c)
    bg=Image.fromarray(np.clip(np.asarray(bg,float)+np.asarray(glow.filter(ImageFilter.GaussianBlur(9)),float)*1.6+np.asarray(glow,float),0,255).astype(np.uint8))
    # the rooftop Ngoymatulfe stands over
    d=ImageDraw.Draw(bg);d.polygon([(420,600),(860,600),(900,720),(380,720)],fill=(8,4,16));d.line([(420,600),(860,600)],fill=(255,60,200),width=2)
    return bg
BG=np.asarray(city(),float)
# ---------- the wraith, with its cloak-arms split off so they can rise ----------
src=Image.open('/home/claude/film/spr/ngoyman4_0.png').convert('RGBA')
S=3;big=src.resize((src.width*S,src.height*S),Image.NEAREST)
bw,bh=big.size
cxs=bw//2
PAD=160
def _mask(side):
    m=Image.new('L',(bw,bh),0);d=ImageDraw.Draw(m)
    if side=='L':d.polygon([(0,int(bh*.34)),(int(bw*.30),int(bh*.34)),(int(bw*.33),int(bh*.42)),(int(bw*.29),int(bh*.82)),(0,int(bh*.82))],fill=255)
    else:d.polygon([(bw,int(bh*.34)),(int(bw*.70),int(bh*.34)),(int(bw*.67),int(bh*.42)),(int(bw*.71),int(bh*.82)),(bw,int(bh*.82))],fill=255)
    return m
ML,MR=_mask('L'),_mask('R')
CORE=big.copy();_a=np.asarray(CORE).copy();_m=(np.asarray(ML)>0)|(np.asarray(MR)>0);_a[_m,3]=0;CORE=Image.fromarray(_a)
def _piece(m):
    p=Image.new('RGBA',(bw,bh));p.paste(big,(0,0),m);c=Image.new('RGBA',(bw+2*PAD,bh+2*PAD));c.paste(p,(PAD,PAD));return c
PL,PR=_piece(ML),_piece(MR)
def arms_img(a):   # a: 0 (rest) .. 1 (raised); the cloak-arms swing up around the shoulders
    ang=a*100;out=Image.new('RGBA',(bw+2*PAD,bh+2*PAD))
    out.alpha_composite(PL.rotate(-ang,resample=Image.NEAREST,center=(PAD+int(bw*.31),PAD+int(bh*.38))))
    out.alpha_composite(PR.rotate(ang,resample=Image.NEAREST,center=(PAD+int(bw*.69),PAD+int(bh*.38))))
    out.alpha_composite(CORE,(PAD,PAD))
    return out,(PAD,PAD)
WORDS=['mari mari','chaltu may','küme','mapu','kimün','newen','piwke','lof','ngen','kewün','lafken','kütral','ruka','wiño']
try: FNT=ImageFont.truetype(FONT,26);FNT.set_variation_by_name('Medium')
except Exception: FNT=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24)
RAIN=[(rng.uniform(0,W),rng.uniform(0,H),rng.uniform(14,26)) for _ in range(260)]
CARS=[(rng.uniform(0,W),rng.uniform(150,330),rng.choice([-1,1])*rng.uniform(5,11),rng.choice([(255,80,200),(80,220,255),(255,200,80)])) for _ in range(6)]
PX,PY=640,170   # the portal, above and behind the wraith
def frame(i):
    t=i/FPS
    img=Image.fromarray(BG.astype(np.uint8)).convert('RGBA');d=ImageDraw.Draw(img,'RGBA')
    # flying cars
    for (x0,y0,v,c) in CARS:
        x=(x0+v*i)%(W+200)-100;d.line([(x,y0),(x-v*6,y0)],fill=c+(120,),width=2);d.ellipse([x-3,y0-2,x+3,y0+2],fill=c+(230,))
    # timing
    rise=ease((t-2.6)/1.6); cast=ease((t-4.4)/1.2); portal=ease((t-3.6)/1.8)
    # portal
    if portal>0:
        pr=int(40+150*portal)
        lay=Image.new('RGBA',(W,H));ld=ImageDraw.Draw(lay)
        for k in range(14):
            a0=(t*120+k*26)%360;r=pr*(1-k/18)
            ld.arc([PX-r,PY-r*.55,PX+r,PY+r*.55],a0,a0+220,fill=(160+k*6,60,255,int(200*portal)),width=4)
        ld.ellipse([PX-pr*.55,PY-pr*.3,PX+pr*.55,PY+pr*.3],fill=(10,0,20,int(240*portal)))
        img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(2)));img.alpha_composite(lay)
        gl=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(gl);gd.ellipse([PX-pr*1.3,PY-pr*.8,PX+pr*1.3,PY+pr*.8],fill=(170,60,255,int(70*portal)));img.alpha_composite(gl.filter(ImageFilter.GaussianBlur(40)))
    # the wraith (hovers gently)
    wr,(ox,oy)=arms_img(rise);bob=int(math.sin(t*1.6)*6)
    wx=640-(ox+bw//2);wy=600-(oy+bh)+20+bob
    aura=Image.new('RGBA',(W,H));ad=ImageDraw.Draw(aura);ad.ellipse([640-190,wy+60,640+190,wy+oy+bh+40],fill=(120,40,200,int(60+80*rise)));img.alpha_composite(aura.filter(ImageFilter.GaussianBlur(50)))
    img.alpha_composite(wr,(wx,wy))
    # eyes flare as it casts
    if rise>0:
        ey=wy+oy+int(bh*.235);ew=Image.new('RGBA',(W,H));edr=ImageDraw.Draw(ew)
        for dx in (-13,13):edr.ellipse([640+dx-8,ey-5,640+dx+8,ey+5],fill=(255,80,200,int(220*rise)))
        img.alpha_composite(ew.filter(ImageFilter.GaussianBlur(6)))
    # the lan kewün: words rise from its hands, lose their colour and are swallowed by the portal
    if cast>0 or t>4.4:
        hands=[(640-150-int(40*rise),wy+oy+int(bh*.28)-int(160*rise)),(640+150+int(40*rise),wy+oy+int(bh*.28)-int(160*rise))]
        for k,wd in enumerate(WORDS*2):
            st=4.4+k*0.17; p=(t-st)/1.7
            if p<=0 or p>=1:continue
            hx,hy=hands[k%2];ang=p*3.2+k
            x=hx+(PX-hx)*ease(p)+math.cos(ang)*40*(1-p);y=hy+(PY-hy)*ease(p)+math.sin(ang)*24*(1-p)
            col=(int(255-180*p),int(230-200*p),int(150-80*p),int(255*(1-p**3)))
            sc=1-p*.7
            tl=Image.new('RGBA',(260,50));ImageDraw.Draw(tl).text((130,25),wd,font=FNT,fill=col,anchor='mm')
            tl=tl.resize((max(1,int(260*sc)),max(1,int(50*sc))))
            img.alpha_composite(tl,(int(x-tl.width/2),int(y-tl.height/2)))
        if 4.6<t<6.2:   # a stream of light from both hands into the portal
            ln=Image.new('RGBA',(W,H));lnd=ImageDraw.Draw(ln)
            for (hx,hy) in hands: lnd.line([(hx,hy),(PX,PY)],fill=(220,120,255,int(120*cast)),width=6)
            img.alpha_composite(ln.filter(ImageFilter.GaussianBlur(5)))
    # rain and a wet glow at the bottom
    for (x0,y0,v) in RAIN:
        y=(y0+v*i)%H;x=(x0-v*i*.25)%W;d.line([(x,y),(x-3,y+12)],fill=(150,170,255,70),width=1)
    a=np.asarray(img.convert('RGB'),float)
    # fades: in from black, flash when the portal swallows the words, slow fade out
    fin=ease((t-0.8)/1.6); fout=1-ease((t-7.4)/2.4)
    if 6.0<t<6.6: a=np.clip(a+(1-abs(t-6.3)/.3)*45*np.array([0.8,0.4,1.0]),0,255)
    a=a*min(fin,fout)
    return a.astype(np.uint8)
if __name__=='__main__':
    if len(sys.argv)>2:
        for f in sys.argv[2:]: Image.fromarray(frame(int(f))).save('/tmp/st_%s.png'%f)
        sys.exit()
    out=sys.argv[1]
    enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','%dx%d'%(W,H),'-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
    for i in range(N): enc.stdin.write(frame(i).tobytes())
    enc.stdin.close();enc.wait();print('ok',N)
