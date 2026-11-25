"""The people of the five lof, painted with the same method, light and outline as the battle heroes
(tools/hero_paint.py), for the lan kewün scenes: an elder lonko, a weaver, a young wentru, a cook in
an ükülla shawl and a young ülcha with a trapelakucha. Side view facing left, one idle frame each.
Output: tools/lofpeople.json (merged into SPR2 as hero_lof_<name> by tools/sprites2.py)."""
import json, os
import numpy as np
import yewen_paint as yp
import hero_paint as hp
from hero_paint import R, blob, legs, head, arm, finish, raise_arm, W, H
from yewen_paint import Canvas, hx, taper

X = {
    'blackp': ['#040406', '#0a0a10', '#14141c', '#1e1e2a', '#2c2c3c', '#40405a', '#5e5e7c'],
    'brown':  ['#1a0c04', '#341a0a', '#4e2a12', '#6a3c1c', '#8a5228', '#ac6e3c', '#cc9058'],
    'green':  ['#04140c', '#0a2618', '#123a24', '#1c5034', '#2a6a46', '#42885e', '#68aa80'],
    'terra':  ['#200804', '#3e1208', '#5c1e0e', '#7c2e16', '#9c4222', '#ba5c34', '#d8804e'],
    'teal':   ['#021416', '#062628', '#0c3a3e', '#145256', '#1e6c70', '#32888a', '#58a8a8'],
    'ochre':  ['#2a1a04', '#4a300a', '#6a4812', '#8a6020', '#ac7c30', '#c89a48', '#e4bc70'],
    'oshawl': ['#0c0606', '#1c0e0c', '#2c1814', '#3e2420', '#54342e', '#6c4a42'],
}
X = {k: [hx(c) for c in v] for k, v in X.items()}

LINES = {('face', 'hair'), ('fore', 'arm'), ('hand', 'fore'), ('armf', 'arm'), ('armh', 'armf'), ('armh', 'face'), ('armf', 'face'), ('armh', 'hair'),
         ('farmf', 'farm'), ('farmh', 'farmf'), ('farmh', 'hair'), ('farmf', 'hair'), ('farm', 'hairB')}

def man(poncho, band_cols, hk='hair', old=False, cheer=None):
    yp.W, yp.H = W, H; c = Canvas(); fr = 0
    legs(c, fr, False)
    blob(c, poncho, lambda d: d.polygon([(19, 25), (31, 25), (35, 36), (34, 52), (16, 52), (15, 36)], fill=1), bulge=0.8, lift=0.08, name='poncho')
    for y in range(30, 52, 4): c.px(30, y, poncho[1]); c.px(29, y + 1, poncho[4])
    for x in range(15, 35):
        yb = 38 + (0 if (x // 3) % 2 else 1)
        for k, col in enumerate(band_cols):
            if c.part[yb + k, x] == 'poncho': c.px(x, yb + k, col)
    for x in range(16, 34): c.px(x, 51, band_cols[2]); c.px(x, 50, band_cols[1] if x % 2 else band_cols[0])
    if cheer is not None: raise_arm(c, poncho, cheer, far=True)
    head(c, fr, False, hk=hk, old=old)
    if cheer is not None: raise_arm(c, poncho, cheer)
    else: arm(c, fr, poncho)
    c.inner_lines(LINES | {('poncho', 'legF'), ('poncho', 'legB'), ('neck', 'poncho'), ('arm', 'poncho'), ('farm', 'poncho')})
    c.outline(); return finish(c)

def woman(dress, belt, shawl=None, pendant=False, folded=False, band=False, cheer=None):
    yp.W, yp.H = W, H; c = Canvas(); fr = 0
    legs(c, fr, True)
    blob(c, dress, lambda d: d.polygon([(19, 25), (31, 25), (33, 40), (36, 66), (17, 66), (16, 40)], fill=1), bulge=0.8, lift=0.08, name='kupam')
    for x0, x1 in [(22, 21), (28, 30)]:
        for y in range(44, 66):
            t = (y - 44) / 22; x = int(round(x0 + (x1 - x0) * t))
            if c.part[y, x] == 'kupam': c.px(x, y, dress[1]); c.px(x - 1, y, dress[4])
    for x in range(16, 34):
        for k, col in enumerate((belt[4], belt[3], belt[2])):
            if c.part[42 + k, x] == 'kupam': c.px(x, 42 + k, col)
        if x % 3 == 0: c.px(x, 43, R['white'][3])
    if cheer is not None: raise_arm(c, shawl or dress, cheer, far=True)
    head(c, fr, True, band=band)
    if shawl:
        blob(c, shawl, lambda d: d.polygon([(18, 25), (32, 25), (36, 31), (35, 40), (27, 38), (21, 36), (16, 34), (16, 29)], fill=1), bulge=0.9, lift=0.12, name='shawl')
        for x in range(17, 35, 2): c.px(x, 36 + (x > 26) * 2 - (x > 30), shawl[5])
        m = c.mask(lambda d: d.ellipse([18, 28, 22, 32], fill=1)); c.shade(m, R['silver'], bulge=1.1, lift=0.25, name='tupu')
    if pendant:
        for (x, y) in [(20, 28), (20, 30), (20, 32), (21, 34)]: c.px(x, y, R['silver'][3])
        m = c.mask(lambda d: d.polygon([(18, 35), (23, 35), (22, 40), (19, 40)], fill=1)); c.shade(m, R['silver'], bulge=1.0, lift=0.2, name='silver')
        c.px(19, 36, R['silver'][5])
    if not band:   # silver chaway at the ear and a red wool tie in the hair
        c.px(25, 17, R['silver'][4]); c.px(25, 18, R['silver'][2]); c.px(25, 19, R['silver'][4])
        for y in range(16, 19): c.px(31, y, R['red'][3])
    sl = shawl or dress
    if cheer is not None:
        raise_arm(c, sl, cheer)
    elif folded:
        taper(c, [(25, 30), (22, 37), (19, 41)], 6, 5, sl, lift=0.14, name='arm', bulge=1.0)
        blob(c, R['skin'], lambda d: d.ellipse([14, 38, 21, 44], fill=1), bulge=1.1, lift=0.25, name='hand')
        c.px(16, 40, R['skin'][2])
    else:
        arm(c, fr, sl)
    c.inner_lines(LINES | {('kupam', 'hairB'), ('face', 'hair'), ('farm', 'kupam'), ('farm', 'shawl'), ('neck', 'kupam'), ('neck', 'shawl'), ('shawl', 'kupam'), ('shawl', 'hairB'), ('arm', 'kupam'), ('arm', 'shawl'),
                   ('fore', 'arm'), ('hand', 'fore'), ('hand', 'arm'), ('silver', 'kupam'), ('tupu', 'shawl')})
    c.outline(); return finish(c)

PEOPLE = {   # three frames each: idle, fist high, fist pulled down (the pump)
    'lonko':  lambda ch: man(X['blackp'], (R['red'][3], R['white'][3], R['red'][2]), hk='grey', old=True, cheer=ch),
    'wentru': lambda ch: man(X['brown'], (R['yellow'][3], R['red'][3], R['yellow'][2]), cheer=ch),
    'weaver': lambda ch: woman(X['green'], R['red'], cheer=ch),
    'cook':   lambda ch: woman(X['terra'], X['ochre'], shawl=X['oshawl'], folded=True, cheer=ch),
    'ulcha':  lambda ch: woman(X['teal'], R['belt'], pendant=True, band=True, cheer=ch),
    'kuku':   lambda ch: hp.kuku(0, cheer=ch),
}

if __name__ == '__main__':
    from PIL import Image
    here = os.path.dirname(os.path.abspath(__file__)); out = {}; strip = []
    for n, fn in PEOPLE.items():
        imgs = [fn(None), fn(0), fn(1)]; p, f = yp.encode(imgs); out[n] = {'pal': p, 'f': f}; strip += imgs
    s = np.concatenate(strip, axis=1); Image.fromarray(s).resize((s.shape[1] * 4, s.shape[0] * 4), Image.NEAREST).save('/home/claude/lofpeople.png')
    json.dump(out, open(os.path.join(here, 'lofpeople.json'), 'w'))
    print('ok')
