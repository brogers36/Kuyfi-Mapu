import numpy as np, subprocess, os, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
W,H,FPS=1280,720,30
GEL='/usr/share/fonts/truetype/google-fonts/ofl/gelasio/Gelasio[wght].ttf'
def gel(sz,wt='Medium'):
    f=ImageFont.truetype(GEL,sz)
    try:f.set_variation_by_name(wt)
    except Exception:pass
    return f
def ld(scene,i):
    fs=sorted(glob.glob(f'cap/{scene}/*.png'));i=max(0,min(len(fs)-1,i))
    return Image.open(fs[i]).convert('RGB')
def kb(im,t,z0=1.0,z1=1.08,cx=.5,cy=.5):
    z=z0+(z1-z0)*t;w,h=im.size;cw,ch=w/z,h/z;x0=(w-cw)*cx;y0=(h-ch)*cy
    return im.crop((int(x0),int(y0),int(x0+cw),int(y0+ch))).resize((W,H),Image.LANCZOS)
def sepia(im):
    g=ImageEnhance.Color(im).enhance(.55);w=Image.new('RGB',im.size,(170,128,84));g=Image.blend(g,w,.18)
    return ImageEnhance.Contrast(g).enhance(1.04)
def ease(x):x=max(0.,min(1.,x));return x*x*(3-2*x)
def text_block(img,lines,alpha,y=600):
    if alpha<=0:return img
    ov=Image.new('RGBA',img.size,(0,0,0,0));d=ImageDraw.Draw(ov)
    # soft band behind the subtitles
    band=Image.new('RGBA',img.size,(0,0,0,0));bd=ImageDraw.Draw(band)
    hsum=sum(f.size+10 for _,f,_ in lines);top=y-hsum//2-14
    bd.rectangle([0,top,W,top+hsum+28],fill=(0,0,0,int(215*alpha)));band=band.filter(ImageFilter.GaussianBlur(14))
    yy=top+14
    for txt,f,col in lines:
        tw=d.textlength(txt,font=f);d.text(((W-tw)/2+2,yy+2),txt,font=f,fill=(0,0,0,int(180*alpha)));d.text(((W-tw)/2,yy),txt,font=f,fill=col+(int(255*alpha),));yy+=f.size+10
    out=Image.alpha_composite(img.convert('RGBA'),band);return Image.alpha_composite(out,ov).convert('RGB')
def fade(img,k,col=(0,0,0)):
    if k<=0:return img
    return Image.blend(img,Image.new('RGB',img.size,col),min(1,k))
CREAM=(243,234,210);GOLD=(232,196,110);SOFT=(200,206,216)
F_M=gel(40,'Medium');F_E=gel(28,'Regular');F_N=gel(22,'Regular');F_I=gel(30,'Regular')
frames=[]
def seg(n,fn):
    for i in range(n):frames.append((fn,i,n))
# T1: title over black
def t1(i,n):
    img=Image.new('RGB',(W,H),(0,0,0));t=i/n;d=ImageDraw.Draw(img)
    a=ease((t-.05)/.3)*ease((1-t)/.15);f=gel(84,'Bold');g=gel(48,'Regular')
    s='Kewün Newen';tw=d.textlength(s,font=f);d.text(((W-tw)/2,260),s,font=f,fill=tuple(int(c*a) for c in CREAM))
    a2=ease((t-.45)/.25)*ease((1-t)/.15);tw=d.textlength('II',font=g);d.text(((W-tw)/2,380),'II',font=g,fill=tuple(int(c*a2) for c in GOLD))
    return img
seg(105,t1)
def a(i,n):
    t=i/n;img=kb(ld('a_night',i),t,1.05,1.18,.42,.45)
    img=ImageEnhance.Color(img).enhance(.7);img=Image.blend(img,Image.new('RGB',img.size,(10,16,48)),.42);img=ImageEnhance.Contrast(img).enhance(1.1)
    img=text_block(img,[('Ti Fütra Ngoyman cayó. Pero algunas palabras nunca volvieron.',F_E,CREAM),('Ti Fütra Ngoyman fell. But some words never came back.',F_N,SOFT)],ease(t/.15)*ease((1-t)/.12))
    return fade(img,1-ease(t/.12))
seg(180,a)
def b(i,n):
    t=i/n;img=kb(ld('b_fog',min(i,110)),t,1.1,1.25,.15,.35);img=Image.blend(img,Image.new('RGB',img.size,(18,24,52)),.25)
    lines=[('«amutu-mu... küpa-chi... -yu... -mu...»',F_I,GOLD),('Una voz en la niebla repite tus palabras... mal.',F_E,CREAM),('A voice in the fog repeats your words... wrong.',F_N,SOFT)]
    img=text_block(img,lines,ease((t-.08)/.15)*ease((1-t)/.12))
    return fade(img,ease((t-.82)/.18),(255,255,255))
seg(120,b)
def c(i,n):
    t=i/n;img=kb(ld('c_lof',i),t,1.0,1.12,.3,.45)
    if t<.5:lines=[('Al otro lado de la niebla: la juventud de tus abuelos.',F_E,CREAM),('Pukem, el invierno.',F_E,CREAM),('Beyond the fog: your grandparents\' youth. Pukem, winter.',F_N,SOFT)];al=ease(t/.12)*ease((.5-t)/.08)
    else:lines=[('Liwen: «Mari mari! Iney pingeymi?»',F_M,GOLD),('¡Hola! ¿Cómo te llamas? · Hello! What is your name?',F_N,SOFT)];al=ease((t-.52)/.08)*ease((1-t)/.1)
    img=text_block(img,lines,al)
    return fade(img,1-ease(t/.1),(255,255,255))
seg(210,c)
def d(i,n):
    t=i/n;img=kb(ld('d_battle',i),t,1.0,1.06,.6,.5)
    if t<.3:lines=[('«Amuyu!»',F_M,GOLD),('¡Vamos, tú y yo! · Let\'s go, you and I!',F_N,SOFT)];al=ease(t/.08)*ease((.3-t)/.06)
    elif t<.68:lines=[('ülkantu-yu!',gel(56,'Bold'),GOLD),('Juntos: cantemos, tú y yo · Together: let\'s sing, you and I',F_N,SOFT)];al=ease((t-.32)/.06)*ease((.68-t)/.06)
    else:lines=[('Ahora no hablas solo: hablas con otros.',F_E,CREAM),('Now you do not speak alone: you speak with others.',F_N,SOFT)];al=ease((t-.7)/.06)*ease((1-t)/.1)
    img=text_block(img,lines,al)
    return fade(img,ease((t-.9)/.1))
seg(210,d)
BG=kb(ld('c_lof',209),1,1.12,1.12,.3,.45).filter(ImageFilter.GaussianBlur(6));BG=ImageEnhance.Brightness(BG).enhance(.45)
def e(i,n):
    t=i/n;img=BG.copy();dd=ImageDraw.Draw(img)
    def ct(s,f,y,col,a):
        tw=dd.textlength(s,font=f);dd.text(((W-tw)/2+3,y+3),s,font=f,fill=(0,0,0));dd.text(((W-tw)/2,y),s,font=f,fill=tuple(int(cc*a+20*(1-a)) for cc in col))
    a1=ease(t/.2);ct('Kuyfi Mapu',gel(96,'Bold'),210,CREAM,a1)
    a2=ease((t-.15)/.2);ct('Kewün Newen II',gel(36,'Regular'),330,GOLD,a2)
    a3=ease((t-.35)/.2);ct('Ti kewün ta newen',gel(40,'Medium'),420,CREAM,a3);ct('La lengua es poder · Language is power',gel(24,'Regular'),474,SOFT,a3)
    a4=ease((t-.55)/.2);ct('© 2026 Brandon M. A. Rogers',gel(20,'Regular'),640,SOFT,a4)
    return fade(img,max(1-ease(t/.12),ease((t-.9)/.1)))
seg(195,e)
print('frames',len(frames),len(frames)/FPS,'s')
enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i','music.wav',
  '-filter_complex','[1:a]volume=2.0,afade=t=in:d=0.6,afade=t=out:st=%.2f:d=1.5[a]'%(len(frames)/FPS-1.5),'-map','0:v','-map','[a]',
  '-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart','intro.mp4'],stdin=subprocess.PIPE)
for k,(fn,i,n) in enumerate(frames):
    im=fn(i,n);enc.stdin.write(np.asarray(im,dtype=np.uint8).tobytes())
    if k in (60,250,360,520,700,950):im.save(f'/tmp/pv_{k}.png')
enc.stdin.close();enc.wait();print('ok')
