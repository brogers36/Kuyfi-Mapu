import numpy as np,wave
SR=44100;D=10.0;n=int(SR*D);t=np.arange(n)/SR;rng=np.random.default_rng(3)
def lp(x,a):   # one-pole low-pass
    y=np.empty_like(x);acc=0.
    for i in range(len(x)):acc+=a*(x[i]-acc);y[i]=acc
    return y
env=lambda a,b,c,d:np.interp(t,[0,a,b,c,d,D],[0,0,1,1,0,0])
rain=lp(rng.standard_normal(n),.25)*.12*np.interp(t,[0,1.0,2.4,7.6,9.9,10],[0,0,1,1,0,0])
drone=(np.sin(2*np.pi*55*t)+.5*np.sin(2*np.pi*82.4*t+.3)+.35*np.sin(2*np.pi*110.6*t))*.12*np.interp(t,[0,1.2,2.6,4.4,6.3,9.8,10],[0,0,.6,1,1.2,0,0])
wob=1+.3*np.sin(2*np.pi*.5*t);drone*=wob
sw=np.zeros(n);m=(t>2.6)&(t<6.3);f=np.interp(t,[2.6,6.3],[120,900]);ph=np.cumsum(2*np.pi*f/SR)
sw[m]=(np.sin(ph[m])*.05+lp(rng.standard_normal(n),.08)[m]*.25)*np.interp(t[m],[2.6,5.8,6.3],[0,1,0])
boom=np.zeros(n);k=t>=6.3;tt=t[k]-6.3;boom[k]=(np.sin(2*np.pi*(48-20*tt)*tt)*np.exp(-tt*1.4)*.55+lp(rng.standard_normal(k.sum()),.05)*np.exp(-tt*2)*.6)
x=rain+drone+sw+boom
x*=np.interp(t,[0,7.6,9.9,10],[1,1,0,0])+ (t<7.6)*0
x=x/np.max(np.abs(x))*.7
L=x;R=np.concatenate([[0]*40,x[:-40]])
st=(np.stack([L,R],1)*32767).astype(np.int16)
w=wave.open('/home/claude/film/sting/sting.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(st.tobytes());w.close();print('wav ok')
