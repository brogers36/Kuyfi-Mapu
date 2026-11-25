"""Build the game from src/.
  python3 build.py           -> www/index.html  (the player version, Chrono Trigger-style)
  python3 build.py --master  -> master/index.html (testing copy: start at any region; not committed)
"""
import os,sys,subprocess,time
ROOT=os.path.dirname(os.path.abspath(__file__))
ORDER=['core1','audio','ui','state','spr','spr2','paintbg','retro','urban','polish','maprows','maps','mapstate','weather','maplogic','cutlogic','scripts','pause','learn','waria','battle','kuyfi','ngoyun','kompa','render','cutart','kuyrows','kuyworld','boot']
MASTER='--master' in sys.argv
src=lambda f:open(os.path.join(ROOT,'src',f),encoding='utf-8').read()
try:BUILD=subprocess.run(['git','rev-parse','--short','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip() or time.strftime('%Y%m%d%H%M%S')
except Exception:BUILD=time.strftime('%Y%m%d%H%M%S')
BUILD+='-'+time.strftime('%Y%m%d%H%M')
js='\n'.join(src(f+'.js') for f in ORDER).replace('</script>\n</body>\n</html>\n','')
head=src('head.html').replace('KEWUN_BUILD_ID',BUILD)
if MASTER:
    js='window.KEWUN_MASTER=1;\n'+js+'\n'+src('master.js')
    head=head.replace('<title>Kewün Newen','<title>MAESTRO · Kewün Newen',1)
    i0=head.find('<!--PWA-->');i1=head.find('<!--/PWA-->')
    if i0>=0 and i1>=0:head=head[:i0]+head[i1+len('<!--/PWA-->'):]
out=os.path.join(ROOT,'master' if MASTER else 'www')
os.makedirs(out,exist_ok=True)
open(os.path.join(out,'index.html'),'w',encoding='utf-8').write(head+js+'\n</script>\n</body>\n</html>\n')
if not MASTER:open(os.path.join(out,'version.txt'),'w',encoding='utf-8').write(BUILD+'\n')
print('built',os.path.relpath(os.path.join(out,'index.html'),ROOT),BUILD)
