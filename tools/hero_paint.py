"""Battle portraits of the two heroes, hand-built at native resolution with the same 3D method
as the Yewen (tools/yewen_paint.py): side view facing left (toward the enemies), four frames
(idle, step, lunge, step back). Llanka wears a blue makuñ with a stepped red-and-white band and
a trarilonko; Millaray a magenta küpam with a blue trariwe at the waist, a silver trapelakucha
on the chest and long black hair. Output: tools/heroes.json"""
import json, math, os
import numpy as np
import yewen_paint as yp
from yewen_paint import Canvas, taper, hx

R = {
    'skin':  ['#3a2014', '#5c3420', '#82502e', '#a46a40', '#c08654', '#d8a470', '#ecc496'],
    'hair':  ['#050408', '#0c0a12', '#16121e', '#221c2c', '#30283e', '#463a58'],
    'poncho':['#080e24', '#12204a', '#1c3070', '#284496', '#3a5cb8', '#5a7ed4', '#88a6ea'],
    'kupam': ['#1a040e', '#38081e', '#5a1030', '#7c1c46', '#9a2c5c', '#ba4a78', '#dc78a0'],
    'belt':  ['#0a1630', '#14285a', '#203e88', '#2e58b4', '#4a7ad8', '#80a8f0'],
    'red':   ['#3a0606', '#6a0e0c', '#9a1a14', '#c8281e', '#e84a34', '#ff7a5a'],
    'white': ['#6a6460', '#9a948c', '#c4beb4', '#e4ded2', '#f8f4ea'],
    'yellow':['#5a3a06', '#8a6010', '#c09020', '#e8b838', '#f8dc70'],
    'pants': ['#06060c', '#0e0e1a', '#181a2c', '#242842', '#343a5c'],
    'boot':  ['#0a0604', '#1c120a', '#2e1e12', '#44301e', '#5e442c'],
    'kpurple':['#120818', '#24102e', '#381a46', '#4a2a5a', '#62407a', '#7e5c98', '#a088bc'],
    'shawl': ['#06040c', '#0e0a1a', '#18122a', '#241c3c', '#342a52', '#4a3e6c'],
    'grey':  ['#4a4a56', '#6a6a78', '#8c8c9a', '#aeaebc', '#c8c8d2', '#e2e2ea', '#f6f6fc'],
    'silver':['#3a3c44', '#62646e', '#8e909a', '#b8bac4', '#e0e2ea', '#ffffff'],
}
R = {k: [hx(c) for c in v] for k, v in R.items()}
W, H = 48, 74

def blob(c, ramp, fn, bulge=1.0, lift=0.0, name=''):
    m = c.mask(fn); c.shade(m, ramp, bulge=bulge, lift=lift, name=name); return m

def pose(fr):
    # (front foot x offset, back foot x offset, torso lean, arm angle) for idle / step / lunge / step back
    return [(0, 0, 0, 0), (-3, 2, 1, 0.25), (-6, 4, 3, 1.0), (2, -2, 0, -0.1)][fr]

def legs(c, fr, dress):
    ff, bf, lean, _ = pose(fr)
    if not dress:
        # back leg (darker), then front leg
        taper(c, [(27, 50), (28 + bf * .5, 60), (29 + bf, 68)], 7, 6, R['pants'], lift=-0.15, name='legB', bulge=1.0)
        taper(c, [(22, 50), (21 + ff * .5, 60), (20 + ff, 68)], 7, 6, R['pants'], lift=0.10, name='legF', bulge=1.0)
        for y in (58, 63): c.px(20 + int(ff * .6), y, R['pants'][3])
    for (x, lift, nm) in [(29 + bf, -0.1, 'bootB'), (20 + ff, 0.12, 'bootF')]:
        blob(c, R['boot'], lambda d, x=x: d.polygon([(x - 2, 66), (x + 4, 66), (x + 4, 72), (x - 6, 72), (x - 6, 70)], fill=1), bulge=0.9, lift=lift, name=nm)
        c.px(x - 5, 70, R['boot'][4]); c.rect(x - 6, 72, 11, 1, R['boot'][0])

def head(c, fr, long_hair, hk='hair', old=False, band=True):
    _, _, lean, _ = pose(fr); lx = -lean
    # hair mass behind the head (and down the back for Millaray)
    if long_hair:
        blob(c, R[hk], lambda d: d.polygon([(24 + lx, 8), (33 + lx, 9), (35 + lx, 18), (36, 32), (37, 48), (31, 50), (29, 34), (26 + lx, 22)], fill=1), bulge=0.9, lift=0.1, name='hairB')
    blob(c, R['skin'], lambda d: d.rounded_rectangle([20 + lx, 18, 27 + lx, 27], 2, fill=1), bulge=0.9, lift=-0.1, name='neck')
    # profile: brow, nose, lips, chin, facing left
    face = [(18 + lx, 8), (26 + lx, 6), (31 + lx, 10), (31 + lx, 18), (27 + lx, 23), (21 + lx, 24), (18 + lx, 21), (17 + lx, 19), (16 + lx, 17), (17 + lx, 15), (16 + lx, 13), (18 + lx, 11)]
    blob(c, R['skin'], lambda d: d.polygon(face, fill=1), bulge=1.1, lift=0.12, name='face')
    c.px(16 + lx, 13, R['skin'][5]); c.px(15 + lx, 14, R['skin'][4])            # nose tip
    c.px(17 + lx, 18, R['skin'][1]); c.px(18 + lx, 18, R['skin'][2])            # lips
    c.px(18 + lx, 21, R['skin'][2])                                             # chin crease
    c.rect(19 + lx, 12, 3, 2, (250, 246, 236)); c.px(19 + lx, 12, (20, 14, 18)); c.px(19 + lx, 13, (20, 14, 18))   # eye looking forward
    c.rect(19 + lx, 11, 4, 1, R[hk][2] if not old else R[hk][1])                # brow
    c.px(25 + lx, 14, R['skin'][2]); c.px(26 + lx, 15, R['skin'][1]); c.px(25 + lx, 16, R['skin'][2])   # ear
    # hair cap, side lock
    blob(c, R[hk], lambda d: d.polygon([(17 + lx, 9), (20 + lx, 4), (27 + lx, 3), (33 + lx, 7), (33 + lx, 16), (29 + lx, 19), (28 + lx, 12), (23 + lx, 9)], fill=1), bulge=1.0, lift=0.18, name='hair')
    for x in range(22, 31, 3): c.px(x + lx, 5, R[hk][5])                        # sheen
    if old:   # the years in the face: crow's feet, a line from nose to mouth, a softer jaw, a strand of hair across the brow
        c.px(22 + lx, 12, R['skin'][2]); c.px(22 + lx, 14, R['skin'][2]); c.px(23 + lx, 13, R['skin'][3])
        c.px(18 + lx, 16, R['skin'][2]); c.px(19 + lx, 17, R['skin'][2]); c.px(20 + lx, 20, R['skin'][3]); c.px(22 + lx, 22, R['skin'][2])
        c.px(19 + lx, 7, R['skin'][3]); c.px(21 + lx, 7, R['skin'][3])
        for k in range(4): c.px(26 + k + lx, 10 + k, R[hk][4])
    # trarilonko: red band with yellow stepped pattern
    if not band: return
    for x in range(17, 33):
        y = 8 + (1 if x > 26 else 0)
        c.px(x + lx, y, R['red'][3]); c.px(x + lx, y + 1, R['red'][2])
        if x % 3 == 0: c.px(x + lx, y, R['yellow'][3])
    c.px(33 + lx, 9, R['red'][2]); c.px(34 + lx, 11, R['red'][2]); c.px(34 + lx, 12, R['red'][1])   # tie ends

def arm(c, fr, sleeve_ramp):
    _, _, lean, a = pose(fr); lx = -lean
    sx, sy = 24 + lx, 29
    ex, ey = sx - 3 - a * 6, sy + 9 - a * 4
    hx_, hy_ = ex - 3 - a * 9, ey + 7 - a * 7
    taper(c, [(sx, sy), (ex, ey)], 6, 5, sleeve_ramp, lift=0.15, name='arm', bulge=1.0)
    taper(c, [(ex, ey), (hx_, hy_)], 5, 4, R['skin'], lift=0.2, name='fore', bulge=1.0)
    m = c.mask(lambda d: d.ellipse([hx_ - 3, hy_ - 2, hx_ + 2, hy_ + 3], fill=1)); c.shade(m, R['skin'], bulge=1.1, lift=0.28, name='hand')
    if a > 0.5:                                                                 # open palm thrust forward
        for k in range(4): c.px(int(hx_) - 3 - (k % 2), int(hy_) - 2 + k, R['skin'][4])

def llanka(fr):
    yp.W, yp.H = W, H; c = Canvas(); _, _, lean, _ = pose(fr); lx = -lean
    legs(c, fr, False)
    # makuñ: blocky poncho from the shoulders to the hips, slight swing
    blob(c, R['poncho'], lambda d: d.polygon([(19 + lx, 25), (31 + lx, 25), (35, 36), (34, 52), (16, 52), (15 + lx, 36)], fill=1), bulge=0.8, lift=0.08, name='poncho')
    for y in range(30, 52, 4): c.px(30, y, R['poncho'][1]); c.px(29, y + 1, R['poncho'][4])   # wool fold
    # stepped band across the chest: red, white, red
    for x in range(15, 35):
        yb = 38 + (0 if (x // 3) % 2 else 1)
        for k, col in enumerate((R['red'][3], R['white'][3], R['red'][2])):
            if c.part[yb + k, x] == 'poncho': c.px(x, yb + k, col)
    for x in range(16, 34): c.px(x, 51, R['red'][2]); c.px(x, 50, R['white'][2] if x % 2 else R['red'][3])   # hem trim
    head(c, fr, False)
    arm(c, fr, R['poncho'])
    c.inner_lines({('poncho', 'legF'), ('poncho', 'legB'), ('face', 'hair'), ('neck', 'poncho'), ('arm', 'poncho'), ('fore', 'arm'), ('hand', 'fore')})
    c.outline(); return finish(c)

def millaray(fr):
    yp.W, yp.H = W, H; c = Canvas(); _, _, lean, _ = pose(fr); lx = -lean
    legs(c, fr, True)
    # küpam: wrapped dress from the shoulders to the ankles, flaring slightly
    ff, bf, _, _ = pose(fr)
    blob(c, R['kupam'], lambda d: d.polygon([(19 + lx, 25), (31 + lx, 25), (33, 40), (36 + bf, 66), (17 + ff, 66), (16 + lx, 40)], fill=1), bulge=0.8, lift=0.08, name='kupam')
    for x0, x1 in [(22, 21 + ff), (28, 30 + bf)]:                                 # long folds
        for y in range(44, 66):
            t = (y - 44) / 22; x = int(round(x0 + (x1 - x0) * t))
            if c.part[y, x] == 'kupam': c.px(x, y, R['kupam'][1]); c.px(x - 1, y, R['kupam'][4])
    # trariwe at the waist, woven pattern
    for x in range(16, 34):
        for k, col in enumerate((R['belt'][4], R['belt'][3], R['belt'][2])):
            if c.part[42 + k, x] == 'kupam': c.px(x, 42 + k, col)
        if x % 3 == 0: c.px(x, 43, R['white'][3])
    head(c, fr, True)
    # trapelakucha: silver chains and a pendant on the chest
    for (x, y) in [(20 + lx, 28), (20 + lx, 30), (20 + lx, 32), (21 + lx, 34)]: c.px(x, y, R['silver'][3])
    m = c.mask(lambda d: d.polygon([(18 + lx, 35), (23 + lx, 35), (22 + lx, 40), (19 + lx, 40)], fill=1)); c.shade(m, R['silver'], bulge=1.0, lift=0.2, name='silver')
    c.px(19 + lx, 36, R['silver'][5])
    arm(c, fr, R['kupam'])
    c.inner_lines({('kupam', 'hairB'), ('face', 'hair'), ('neck', 'kupam'), ('arm', 'kupam'), ('fore', 'arm'), ('hand', 'fore'), ('silver', 'kupam')})
    c.outline(); return finish(c)

# ---- the two new heroes: the same bodies as Millaray and Llanka, with their own skin and clothes ----
ALT = {
    'ayelen': {'skin': ['#2a160c', '#46261a', '#64381f', '#80492a', '#9c5c36', '#b47446', '#cc8e5c'],     # darker than Millaray
               'kupam': ['#040408', '#0c0b12', '#15131c', '#201d29', '#2c2838', '#3e394e', '#58526c'],    # a black küpam
               'belt': ['#3a0606', '#6a0e0c', '#9a1a14', '#c8281e', '#e84a34', '#ff7a5a']},              # a red trariwe
    'kallfurungi': {'skin': ['#1e1008', '#341c10', '#4c2a18', '#643820', '#7c4a2c', '#94603a', '#ac784c'],   # darker than Llanka
                    'poncho': ['#08080a', '#121216', '#1e1e24', '#2c2c34', '#3c3c46', '#54545e', '#74747e'],   # a charcoal makuñ
                    'red': ['#10062a', '#200c4c', '#321676', '#4626a0', '#6242c8', '#8a6ae6']},               # kallfü: the band and trarilonko in violet-blue
}
ALT = {n: {k: [hx(c) for c in v] for k, v in d.items()} for n, d in ALT.items()}
def dressed(name, base):
    def fn(fr):
        saved = {k: R[k] for k in ALT[name]}
        R.update(ALT[name])
        try: return base(fr)
        finally: R.update(saved)
    return fn
ayelen = dressed('ayelen', lambda fr: millaray(fr))
kallfurungi = dressed('kallfurungi', lambda fr: llanka(fr))

def kuku(fr, cheer=None):
    # the grandmother: a little shorter and stooped, silver-white braid, deep purple küpam under a dark
    # ükülla shawl pinned with a silver tupu, red trariwe, hands folded in front. Same light and outline as the heroes.
    yp.W, yp.H = W, H; c = Canvas(); lx = 0; nod = 1 if fr in (1, 3) else 0
    legs(c, 0, True)
    blob(c, R['kpurple'], lambda d: d.polygon([(19, 28), (31, 28), (34, 42), (35, 66), (17, 66), (16, 42)], fill=1), bulge=0.8, lift=0.06, name='kupam')
    for x0, x1 in [(22, 21), (29, 31)]:
        for y in range(46, 66):
            t = (y - 46) / 20; x = int(round(x0 + (x1 - x0) * t))
            if c.part[y, x] == 'kupam': c.px(x, y, R['kpurple'][1]); c.px(x - 1, y, R['kpurple'][4])
    for x in range(16, 35):                                            # red trariwe with a white stepped line
        for k, col in enumerate((R['red'][4], R['red'][3], R['red'][2])):
            if c.part[44 + k, x] == 'kupam': c.px(x, 44 + k, col)
        if (x // 2) % 2 and c.part[45, x] == 'kupam': c.px(x, 45, R['white'][3])
    # long silver braid down the back, tied with red wool at the end
    for y in range(12, 50):
        x = 31 + min(3, (y - 12) // 3) + (1 if 28 < y < 40 else 0)
        for dx in (-1, 0, 1, 2):
            ph = (y + dx * 2) % 4      # plaited: diagonal light and shadow
            col = R['grey'][5] if ph == 0 else R['grey'][4] if ph == 1 else R['grey'][3] if ph == 2 else R['grey'][1]
            if dx == 2: col = R['grey'][1]
            c.px(x + dx, y, col); c.part[y, x + dx] = 'braid'; c.a[y, x + dx] = 1
    for y in range(45, 50):
        for dx in (-1, 0, 1, 2): c.px(35 + dx, y, R['red'][4 - (dx > 0) - (dx > 1)])
    for dx in (0, 1): c.px(35 + dx, 50, R['grey'][3]); c.part[50, 35 + dx] = 'braid'; c.a[50, 35 + dx] = 1
    # shawl over the shoulders and back, falling to the waist
    blob(c, R['shawl'], lambda d: d.polygon([(18, 26), (32, 26), (36, 32), (35, 42), (27, 40), (21, 38), (16, 36), (16, 30)], fill=1), bulge=0.9, lift=0.12, name='shawl')
    for x in range(17, 35, 2): c.px(x, 38 + (x > 26) * 2 - (x > 30), R['shawl'][5])   # fringe glint
    head(c, (nod and 1) or 0, False, hk='grey', old=True)
    # tupu: the big silver pin that closes the shawl
    m = c.mask(lambda d: d.ellipse([18, 29, 23, 34], fill=1)); c.shade(m, R['silver'], bulge=1.1, lift=0.25, name='tupu')
    c.px(20, 30, R['silver'][5]); c.px(22, 28, R['silver'][3]); c.px(23, 27, R['silver'][2])
    for (x, y) in [(19, 35), (19, 37), (20, 39)]: c.px(x, y, R['silver'][3])
    # arms bent, hands folded together at the waist (or, cheering, a fist raised high)
    if cheer is not None: raise_arm(c, R['kpurple'], cheer)
    else:
        taper(c, [(25, 30), (22, 37), (19, 41)], 6, 5, R['kpurple'], lift=0.14, name='arm', bulge=1.0)
        blob(c, R['skin'], lambda d: d.ellipse([14, 38, 21, 44], fill=1), bulge=1.1, lift=0.25, name='hand')
        c.px(16, 40, R['skin'][2]); c.px(18, 41, R['skin'][2])
    c.inner_lines({('kupam', 'hairB'), ('face', 'hair'), ('neck', 'shawl'), ('shawl', 'kupam'), ('arm', 'shawl'), ('hand', 'arm'), ('tupu', 'shawl'), ('braid', 'shawl'), ('braid', 'kupam')})
    c.outline(); return finish(c)

def raise_arm(c, sleeve, lvl, far=False):
    """A fist raised in celebration: lvl 0 = arm thrust high, lvl 1 = pulled down (the pump).
    far=True draws the other arm behind the head, darker."""
    sx, sy = (28, 28) if far else (24, 29)
    if lvl == 0: ex, ey, fx, fy = (sx + 3, sy - 13, sx + 1, sy - 25) if far else (sx - 8, sy - 10, sx - 13, sy - 23)
    else:        ex, ey, fx, fy = (sx + 6, sy - 8, sx + 4, sy - 18) if far else (sx - 10, sy - 4, sx - 12, sy - 15)
    lf = -0.25 if far else 0.15; nm = 'farm' if far else 'arm'
    taper(c, [(sx, sy), (ex, ey)], 6, 5, sleeve, lift=lf, name=nm, bulge=1.0)
    taper(c, [(ex, ey), (fx, fy + 2)], 5, 4, R['skin'], lift=lf + 0.05, name=nm + 'f', bulge=1.0)
    m = c.mask(lambda d: d.ellipse([fx - 3, fy - 3, fx + 2, fy + 2], fill=1)); c.shade(m, R['skin'], bulge=1.15, lift=lf + 0.13, name=nm + 'h')
    if not far:
        for k in range(3): c.px(int(fx) - 3, int(fy) - 2 + k * 2 // 1 if k < 2 else int(fy) + 1, R['skin'][2])   # knuckles
        c.px(int(fx) - 1, int(fy) - 3, R['skin'][5])

def finish(c):
    rim = np.array((190, 210, 255))
    for y in range(H):
        for x in range(2, W - 2):
            if c.a[y, x] and c.a[y, x + 1] and not c.a[y, x + 2] and c.part[y, x] not in ('', 'hand'):
                c.rgb[y, x] = (c.rgb[y, x] * 0.6 + rim * 0.4).astype(np.uint8)
    img = np.zeros((H, W, 4), np.uint8); img[..., :3] = c.rgb; img[..., 3] = c.a * 255
    return img

if __name__ == '__main__':
    from PIL import Image
    here = os.path.dirname(os.path.abspath(__file__)); out = {}
    for name, fn in [('llanka', llanka), ('millaray', millaray), ('ayelen', ayelen), ('kallfurungi', kallfurungi), ('kuku', kuku)]:
        frames = [fn(f) for f in range(4)]
        p, f = yp.encode(frames); out[name] = {'pal': p, 'f': f}
        strip = np.concatenate(frames, axis=1); Image.fromarray(strip).resize((strip.shape[1] * 4, strip.shape[0] * 4), Image.NEAREST).save('/home/claude/hero_%s.png' % name)
    json.dump(out, open(os.path.join(here, 'heroes.json'), 'w'))
    print('ok')
