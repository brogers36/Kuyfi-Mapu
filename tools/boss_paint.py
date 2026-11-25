"""The bosses of the south and of the forgetting, hand-painted with the Yewen's method (tools/yewen_paint.py)
and the crisper shading of the Santiago wardens (tools/waria_paint.py): per-part masks with their own colour
ramps, height-field light from the upper left, hard bands, selective outlines, contact shadows, grain and
speculars. Every sprite keeps the size and the design of the pixel-art boss it replaces.
Output: tools/boss.json (battle sprite + half-size sprite, two frames each).
Usage: python3 boss_paint.py [name,name,...]  (no argument: all)"""
import json, math, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import yewen_paint as yp
import waria_paint as wp
from yewen_paint import Canvas, taper, hx
from waria_paint import R, setsize, blob, finish, arcs, cr, smooth_poly, glow, ribbed, facet, tooth3, rivets, plate_lines, texture, occlude, speculars

def ramp(*cs): return [hx(c) for c in cs]
def taper(c, pts, *a, **k):
    """yewen_paint.taper stamps six discs per segment: densify long straight segments so shafts stay solid"""
    P = [pts[0]]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / 6))
        P += [(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n) for i in range(1, n + 1)]
    return yp.taper(c, P, *a, **k)
R.update({k: [hx(c) for c in v] for k, v in {
    'hide':   ['#0c0e08', '#181c10', '#262c18', '#363e22', '#48522c', '#5c6838', '#748246', '#90a058'],
    'patch':  ['#3a3424', '#5a5038', '#7c7052', '#a09270', '#c2b490', '#e0d4b0'],
    'under':  ['#2a0c10', '#4a1a1c', '#6e2a2a', '#94403a', '#b85a4c', '#d87c66'],
    'water':  ['#020a10', '#06161e', '#0c242e', '#143642', '#1e4a58', '#2c6270', '#46808c', '#7ab0b6'],
    'claw':   ['#1a1610', '#3a3226', '#5e5440', '#8a7e64', '#b4aa8c', '#dcd4b8', '#f8f4e4'],
    'eyey':   ['#3a2a04', '#7a5a08', '#c49410', '#f0d030', '#fff080', '#fffbe0'],
    'basalt': ['#060404', '#100a0a', '#1c1312', '#2a1d1a', '#3a2924', '#4c3830', '#624a3e', '#7a5e4e'],
    'lava':   ['#3a0602', '#781004', '#b42208', '#e44a10', '#fa8420', '#ffbe50', '#fff0b0'],
    'wood':   ['#06080a', '#0e1214', '#161c1e', '#20282a', '#2c3638', '#3a4648', '#4c5a5a'],
    'sail':   ['#1a2a2a', '#2e4644', '#46645e', '#62847a', '#82a69a', '#a8c8ba', '#d4ece0'],
    'ghost':  ['#0a3a2a', '#14604a', '#22906a', '#40c08c', '#80e6b2', '#c8ffe0'],
    'fog':    ['#2a3a3a', '#3a4e4c', '#4c6260', '#607876', '#7a908c'],
    'coat':   ['#050508', '#0a0a10', '#121218', '#1a1a22', '#24242e', '#30303c', '#3e3e4c'],
    'hat':    ['#040406', '#0a0a0e', '#121218', '#1c1c24', '#282832', '#363642'],
    'skull':  ['#2a2c26', '#46483e', '#66685a', '#8a8c7a', '#aeae9a', '#d0ceb8', '#eeecd8'],
    'silver': ['#1a1c20', '#34383e', '#565a62', '#7e828a', '#a8acb2', '#d4d6da', '#ffffff'],
    'gglow':  ['#0a3a1a', '#147a34', '#28c058', '#60f090', '#b0ffc8', '#ffffff'],
}.items()})

def noise(seed, sc=1.5):
    from scipy.ndimage import gaussian_filter as gf
    rs = np.random.RandomState(seed); n = gf(rs.rand(yp.H, yp.W), sc); n = (n - n.min()) / max(1e-6, n.max() - n.min()); return n
def tint(c, m, k):
    c.rgb[m] = np.clip(c.rgb[m].astype(float) * k, 0, 255).astype(np.uint8)
def line(c, pts, col, part=None, w=1, n=None):
    P = cr(pts, 10) if len(pts) > 2 else pts
    out = []
    for (x0, y0), (x1, y1) in zip(P, P[1:]):
        k = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
        for t in np.linspace(0, 1, k + 1):
            X, Y = int(round(x0 + (x1 - x0) * t)), int(round(y0 + (y1 - y0) * t))
            for dx in range(w):
                if 0 <= X + dx < yp.W and 0 <= Y < yp.H and (part is None or c.part[Y, X + dx] in (part if isinstance(part, tuple) else (part,))):
                    c.px(X + dx, Y, col); out.append((X + dx, Y))
    return out
def eye(c, x, y, rw, rh, rmp, pupil=(8, 4, 2), slit=True, lid=None):
    """an almond eye: dark socket, glowing iris banded from the bottom up, a slit pupil, a catchlight"""
    for yy in range(y - rh - 1, y + rh + 2):
        for xx in range(x - rw - 1, x + rw + 2):
            d = ((xx - x) / (rw + 1)) ** 2 + ((yy - y) / (rh + 1)) ** 2
            if d <= 1: c.px(xx, yy, lid or (10, 6, 6))
    for yy in range(y - rh, y + rh + 1):
        for xx in range(x - rw, x + rw + 1):
            d = ((xx - x) / rw) ** 2 + ((yy - y) / max(1, rh)) ** 2
            if d <= 1:
                t = (yy - (y - rh)) / max(1, 2 * rh); c.px(xx, yy, rmp[min(len(rmp) - 1, int(1 + t * (len(rmp) - 2)))])
    if slit:
        for yy in range(y - rh, y + rh + 1): c.px(x, yy, pupil)
    c.px(x - max(1, rw // 2), y - max(0, rh // 2), (255, 255, 250))
def ripples(c, cx, cy, rx, ry, f, col_hi, col_lo, n=3):
    for k in range(n):
        r = 1 + k * .55 + f * .18
        for a in np.linspace(0, 2 * math.pi, int(160 * r)):
            X, Y = int(round(cx + math.cos(a) * rx * r)), int(round(cy + math.sin(a) * ry * r))
            if 0 <= X < yp.W and 0 <= Y < yp.H and c.part[Y, X] == 'water':
                c.px(X, Y, col_hi if math.sin(a) < 0 else col_lo)
def sea(c, y0, y1, x0, x1, f, rmp=None, name='water'):
    """a band of night water: dark ellipse, horizontal glints that shift with the frame"""
    rmp = rmp or R['water']
    m = c.mask(lambda d: d.ellipse([x0, y0, x1, y1], fill=1))
    ys, xs = np.nonzero(m)
    t = (ys - y0) / max(1, y1 - y0)
    idx = np.clip((2 + (1 - abs(t - .35) * 2.2) * 2.2 + (yp.BAYER[ys % 4, xs % 4] - .5) * .6).astype(int), 0, len(rmp) - 1)
    c.rgb[ys, xs] = np.array(rmp)[idx]; c.a[ys, xs] = True; c.part[ys, xs] = name
    rs = np.random.RandomState(9 + f)
    for _ in range(int((x1 - x0) * (y1 - y0) / 40)):
        x = rs.randint(x0 + 2, x1 - 2); y = rs.randint(y0 + 1, y1 - 1); L = rs.randint(2, 6)
        for k in range(L):
            if 0 <= x + k < yp.W and c.part[y, x + k] == name: c.px(x + k, y, rmp[-1] if k == L // 2 else rmp[-3])
    return m
def drip(c, x, y, L, rmp):
    for k in range(L): c.px(x, y + k, rmp[-2] if k < L - 1 else rmp[-1])
def scales(c, part, step, rmp, seed=0, k_dark=.55, k_lit=1.25, kd=None):
    """overlapping scales: a dark crescent under each, a lit lip on top, staggered rows"""
    ys, xs = np.nonzero(c.part == part)
    if not len(ys): return
    for y in range(ys.min(), ys.max() + 1, step):
        off = (step // 2) if ((y - ys.min()) // step) % 2 else 0
        for x in range(xs.min() + off, xs.max() + 1, step):
            for a in np.linspace(.15 * math.pi, .85 * math.pi, step * 2):
                X, Y = int(round(x + math.cos(a) * step * .55)), int(round(y + math.sin(a) * step * .5))
                if 0 <= X < yp.W and 0 <= Y < yp.H and c.part[Y, X] == part: c.rgb[Y, X] = (c.rgb[Y, X] * k_dark).astype(np.uint8)
            if 0 <= y - 1 < yp.H and 0 <= x < yp.W and c.part[y - 1, x] == part:
                c.rgb[y - 1, x] = np.minimum(255, c.rgb[y - 1, x] * k_lit).astype(np.uint8)

# =========================================================== trelke: a stretched hide rising from the water to wrap you
R.update({k: [hx(c) for c in v] for k, v in {
    'hide':  ['#0e0a08', '#1c1510', '#2c2218', '#3e3022', '#52402c', '#685238', '#806646', '#9a7c56'],
    'patch': ['#4a4436', '#6c6450', '#8e866c', '#b0a88a', '#d0c8a8', '#ece4c6']}.items()})
def trelke(f):
    setsize(108, 84); c = Canvas()
    sea(c, 62, 84, 0, 108, f)
    ripples(c, 54, 72, 34, 4, f, R['water'][6], R['water'][1], 3)
    fl = 2 if f else 0                                       # the flaps lean in toward you, then out
    # the hide stands up out of the water like a sail: neck flap on top, foreleg flaps reaching out and
    # curling forward, hind flaps trailing on the water
    pts = [(54, 2 - fl), (62, 6), (64, 14), (78, 12), (92, 6 + fl), (104, 4 + fl * 2), (100, 14), (90, 22), (88, 34), (94, 50), (104, 64 - fl),
           (90, 70), (74, 66), (54, 70), (34, 66), (18, 70), (4, 64 - fl), (14, 50), (20, 34), (18, 22), (8, 14), (4, 4 + fl * 2), (16, 6 + fl), (30, 12), (44, 14), (46, 6)]
    hide = smooth_poly(pts, 6)
    m = blob(c, R['hide'], lambda d: d.polygon(hide, fill=1), bulge=.55, lift=.36, name='hide')
    ys, xs = np.nonzero(m)                                   # soft creases where the skin is pulled toward the claws
    wave = np.sin((xs - 54) * .32 + (ys - 40) * .08 + f * .6) * np.exp(-((ys - 38) / 30.0) ** 2) * .5
    c.rgb[ys, xs] = np.clip(c.rgb[ys, xs] * (1 + wave * .16)[:, None], 0, 255).astype(np.uint8)
    # pale cowhide patches, irregular, with a soft brown edge
    n = noise(4, 3.6)
    for thr, k in ((.57, None),):
        pm = m & (n > thr)
        ys, xs = np.nonzero(pm)
        lum = c.rgb[ys, xs].mean(1) / 255
        idx = np.clip((lum * 9).astype(int), 0, len(R['patch']) - 1)
        c.rgb[ys, xs] = np.array(R['patch'])[idx]; c.part[pm] = 'patch'
    tint(c, m & (n > .53) & (n <= .57), .72)
    # the edges of the foreleg flaps curl over toward you, showing the raw red underside
    for path, w in [([(6, 6 + fl * 2), (14, 10), (22, 16), (30, 16)], 4), ([(102, 6 + fl * 2), (94, 10), (84, 16), (76, 16)], 4), ([(48, 8), (54, 5 - fl), (60, 8)], 3)]:
        taper(c, cr(path, 6), w, w - 1, R['under'], lift=.22, name='under', bulge=1.15)
        line(c, [(x, y + w // 2) for x, y in path], R['under'][1], 'under')
    # down the middle, the seam where it folds shut around its prey: a slit of teeth
    for y in range(26, 62):
        w = int(round(2.2 * math.sin(math.pi * (y - 26) / 36)))
        for x in range(54 - w, 55 + w):
            if c.part[y, x] in ('hide', 'patch'): c.px(x, y, (18, 4, 6)); c.part[y, x] = 'slit'
        if w >= 1:
            c.px(54 - w - 1, y, R['under'][3]); c.px(55 + w, y, R['under'][1])
            if y % 3 == 0: c.px(54 - w, y, R['claw'][6]); c.px(54 + w, y + 1, R['claw'][5])
    # hooked claws all round the rim
    for (x, y, dx, dy) in [(4, 4 + fl * 2, -1, -1), (104, 4 + fl * 2, 1, -1), (54, 2 - fl, 0, -1), (92, 6 + fl, 1, -1), (16, 6 + fl, -1, -1), (100, 14, 1, 0), (8, 14, -1, 0),
                           (104, 64 - fl, 1, 1), (4, 64 - fl, -1, 1), (90, 22, 1, 0), (18, 22, -1, 0), (88, 34, 1, 0), (20, 34, -1, 0), (94, 50, 1, 0), (14, 50, -1, 0)]:
        tip = (x + dx * 5, y + dy * 5); mid = (x + dx * 4 + dy * 2, y + dy * 3 - dx * 2)
        taper(c, cr([(x, y), mid, tip], 5), 3.5, 1, R['claw'], lift=.22, name='claw', bulge=1.2)
    # eyes: a cluster up on the neck flap, and single ones opening in the skin
    for (ex, ey, s) in [(54, 16, 3), (47, 20, 2), (61, 20, 2), (30, 28, 2), (78, 28, 2), (40, 46, 1), (70, 46, 1)]:
        eye(c, ex, ey, s + 1, s, R['eyey'], lid=R['hide'][0])
    # drips where it rises out of the water
    for x in range(12, 100, 8): drip(c, x + f * 2, 64 + (x % 4), 3 + (x % 3), R['water'])
    texture(c, ['hide', 'patch'], amt=.12, seed=3)
    occlude(c, ['under', 'claw'], ['hide', 'patch'], r=3, k=.62)
    occlude(c, ['hide', 'patch'], ['water'], r=3, k=.5)
    speculars(c, ['hide', 'patch', 'claw', 'under'], thr=.86)
    return finish(c, [('claw', 'hide'), ('claw', 'patch'), ('under', 'hide'), ('under', 'patch'), ('hide', 'water'), ('patch', 'water')], rim=(150, 200, 120), rimparts=('hide', 'patch', 'claw'))

# =========================================================== cherufe: a giant of basalt split by rivers of lava
def cherrufe(f):
    setsize(92, 112); c = Canvas()
    B, L = R['basalt'], R['lava']
    blob(c, L[:5], lambda d: d.ellipse([10, 100, 82, 111], fill=1), bulge=.4, lift=.2, name='pool')
    bob = f
    # legs: two pillars of stacked basalt
    for (x0, x1, lift) in [(26, 42, .12), (50, 66, -.04)]:
        blob(c, B, lambda d, x0=x0, x1=x1: d.polygon([(x0, 70), (x1, 70), (x1 + 2, 92), (x1 + 4, 104), (x0 - 4, 104), (x0 - 2, 92)], fill=1), bulge=1.1, lift=lift, name='leg')
        plate_lines(c, 'leg', [((x0 - 3, 86), (x1 + 3, 84)), ((x0 - 3, 96), (x1 + 3, 97))], .5)
    # torso: a hunched mass of plates, chest split open on a molten core
    torso = smooth_poly([(24, 34 + bob), (46, 28 + bob), (70, 34 + bob), (74, 52 + bob), (66, 72), (46, 76), (26, 72), (18, 52 + bob)], 6)
    blob(c, B, lambda d: d.polygon(torso, fill=1), bulge=1.2, lift=.14, name='torso')
    # the molten core showing through the cracked chest
    core = [(40, 40 + bob), (52, 40 + bob), (56, 50 + bob), (50, 62), (42, 62), (36, 50 + bob)]
    blob(c, L, lambda d: d.polygon(core, fill=1), bulge=1.0, lift=.35, name='core')
    glow(c, 46, 50 + bob, 5, L[3:])
    # lava rivers running across the plates, branching from the core
    cracks = [[(38, 46), (30, 44), (22, 50)], [(54, 46), (62, 42), (72, 46)], [(44, 62), (40, 70), (34, 76)], [(50, 62), (56, 70), (58, 78)],
              [(30, 44), (28, 36)], [(62, 42), (66, 36)], [(30, 88), (34, 96), (32, 104)], [(58, 86), (56, 94), (60, 104)]]
    for k, cr_ in enumerate(cracks):
        pts = [(x, y + (bob if y < 70 else 0)) for x, y in cr_]
        for (X, Y) in line(c, pts, L[4], ('torso', 'leg')):
            if 0 <= X + 1 < yp.W and c.part[Y, X + 1] in ('torso', 'leg'): c.px(X + 1, Y, L[2])
            if 0 <= Y - 1 and c.part[Y - 1, X] in ('torso', 'leg'): c.rgb[Y - 1, X] = np.minimum(255, c.rgb[Y - 1, X].astype(int) + np.array([70, 24, 6])).astype(np.uint8)
    # shoulders: great boulders
    for (cx, cy, lift) in [(22, 38, .2), (70, 38, 0)]:
        blob(c, B, lambda d, cx=cx, cy=cy: d.polygon(smooth_poly([(cx - 12, cy + 2 + bob), (cx - 6, cy - 9 + bob), (cx + 6, cy - 9 + bob), (cx + 12, cy + 1 + bob), (cx + 6, cy + 10 + bob), (cx - 6, cy + 10 + bob)], 5), fill=1), bulge=1.25, lift=lift, name='shoulder')
    # arms: the near one hangs, fist glowing; the far one lifts a burning stone overhead
    taper(c, cr([(16, 44 + bob), (10, 60), (12, 76)], 7), 13, 12, B, lift=.15, name='arm', bulge=1.2)
    blob(c, B, lambda d: d.polygon(smooth_poly([(4, 74), (20, 72), (22, 86), (12, 90), (4, 86)], 4), fill=1), bulge=1.25, lift=.12, name='fist')
    for (x, y) in [(8, 78), (14, 77), (18, 80)]: c.px(x, y, L[4]); c.px(x, y + 1, L[2])
    taper(c, cr([(74, 40 + bob), (84, 30), (82, 16)], 7), 12, 11, B, lift=-.05, name='arm2', bulge=1.2)
    blob(c, L, lambda d: d.ellipse([68, 0 + bob, 92, 20 + bob], fill=1), bulge=1.2, lift=.0, name='stone')
    n = noise(7, 1.4); sm = (c.part == 'stone') & (n < .45); tint(c, sm, .35)
    glow(c, 82, 9 + bob, 4, L[3:])
    # head: sunk between the shoulders, a jaw of rock, eyes and mouth of fire, a crown of flame
    hd = smooth_poly([(36, 14 + bob), (46, 10 + bob), (56, 14 + bob), (58, 26 + bob), (52, 34 + bob), (40, 34 + bob), (34, 26 + bob)], 5)
    blob(c, B, lambda d: d.polygon(hd, fill=1), bulge=1.3, lift=.18, name='head')
    for x in range(37, 56): c.px(x, 20 + bob, B[1])                      # the heavy brow
    for x in range(38, 46): c.px(x, 19 + bob, B[6])
    for ex in (41, 51):
        c.rect(ex - 2, 21 + bob, 5, 3, (20, 4, 2)); c.rect(ex - 1, 22 + bob, 3, 1, L[5]); c.px(ex, 22 + bob, L[6])
    for x in range(40, 54): c.px(x, 29 + bob, L[3] if x % 2 else L[4])
    for x in range(40, 54, 2): c.px(x, 28 + bob, (24, 6, 2)); c.px(x + 1, 30 + bob, (24, 6, 2))
    for k, x in enumerate(range(36, 58, 4)):                              # flames of the crown
        h = 8 + (k * 5 + f * 3) % 7
        yp.flame(c, x, 14 + bob, h, 1.5, k * 1.3 + f, 3, ramp=L)
    yp.flame(c, 82, 4 + bob, 10, 2, 1 + f, 4, ramp=L)
    texture(c, ['torso', 'leg', 'shoulder', 'arm', 'arm2', 'fist', 'head'], amt=.16, seed=5)
    occlude(c, ['shoulder', 'head', 'arm'], ['torso'], r=4, k=.55)
    occlude(c, ['torso'], ['leg'], r=5, k=.5)
    speculars(c, ['torso', 'shoulder', 'head', 'arm', 'fist', 'leg'], thr=.82, col=(255, 200, 150))
    return finish(c, [('shoulder', 'torso'), ('head', 'torso'), ('arm', 'torso'), ('arm', 'shoulder'), ('fist', 'arm'), ('arm2', 'shoulder'), ('leg', 'torso'), ('core', 'torso'), ('stone', 'arm2'), ('leg', 'leg')],
                  rim=(255, 110, 40), rimparts=('torso', 'shoulder', 'arm2', 'leg', 'head', 'arm'))

# =========================================================== kaleuche: the ghost ship, all lights and music in the fog
def kaleuche(f):
    setsize(124, 108); c = Canvas()
    W_, G = R['wood'], R['ghost']
    sea(c, 84, 108, 0, 124, f, name='water')
    # hull: a long dark galleon, planked, its gunwale picked out in sickly light
    hull = smooth_poly([(6, 66), (20, 70), (100, 70), (118, 58), (114, 72), (104, 88), (20, 90), (10, 80)], 5)
    blob(c, W_, lambda d: d.polygon(hull, fill=1), bulge=.9, lift=.12, name='hull')
    for y in (74, 79, 84):
        line(c, [(10, y), (60, y + 1), (110, y - 4)], W_[0], 'hull')
        line(c, [(10, y - 1), (60, y), (110, y - 5)], W_[5], 'hull')
    for x in range(14, 112, 9):                                              # plank butts, staggered
        y = 75 + (x // 9) % 3 * 4
        if c.part[y, x] == 'hull': c.px(x, y, W_[0]); c.px(x, y + 1, W_[0])
    blob(c, W_, lambda d: d.polygon([(80, 60), (116, 52), (118, 58), (100, 70), (80, 70)], fill=1), bulge=1.0, lift=.22, name='castle')
    blob(c, W_, lambda d: d.polygon([(6, 62), (24, 62), (24, 70), (6, 66)], fill=1), bulge=1.0, lift=.2, name='castle')
    for x in range(8, 116):
        y = 69 if x < 80 else 69 - (x - 80) * 16 // 36
        if c.part[y, x] in ('hull', 'castle'): c.px(x, y, G[3] if x % 4 else G[4])
    for (x, y) in [(22, 78), (36, 79), (50, 80), (64, 80), (78, 78), (92, 76), (104, 62), (94, 64)]:   # portholes full of light
        c.rect(x - 2, y - 2, 4, 4, W_[0]); c.rect(x - 1, y - 1, 2, 2, G[5] if (x + f) % 3 else G[4]); c.px(x - 1, y - 1, (255, 255, 255))
    # bowsprit and a pale figurehead
    taper(c, [(112, 60), (122, 50)], 3, 2, W_, lift=.2, name='spar', bulge=1.0)
    blob(c, R['skull'], lambda d: d.polygon([(110, 60), (116, 56), (118, 64), (113, 68)], fill=1), bulge=1.1, lift=.2, name='figure')
    # three masts, yards, and tattered sails that glow from within
    masts = [(32, 16, 1.0), (62, 6, 1.15), (92, 18, .95)]
    for (mx, top, s) in masts:
        taper(c, [(mx, 70), (mx, top)], 3, 2, W_, lift=.15, name='mast', bulge=1.0)
        for (yy, w) in [(top + 6, 13 * s), (top + 26 * s, 15 * s)]:
            taper(c, [(mx - w, yy), (mx + w, yy)], 2, 2, W_, lift=.25, name='yard', bulge=1.0)
        for (y0, y1, w0, w1) in [(top + 7, top + 25 * s, 12 * s, 14 * s), (top + 27 * s, top + 46 * s, 14 * s, 15 * s)]:
            rag = [(mx + w1 - k * (2 * w1) / 8, y1 + (3 if (k + f) % 2 else -1) + (k % 3)) for k in range(9)]
            poly = [(mx - w0, y0), (mx + w0, y0), (mx + w1 + 1, (y0 + y1) / 2)] + rag + [(mx - w1 - 1, (y0 + y1) / 2)]
            m = blob(c, R['sail'], lambda d, p=poly: d.polygon(p, fill=1), bulge=.7, lift=.08, name='sail')
            ys, xs = np.nonzero(m)                                           # billowing: brightest across the belly
            k = 1 + .18 * np.sin((ys - y0) / max(1, y1 - y0) * math.pi) - .1 * ((xs - mx) / max(1, w1))
            c.rgb[ys, xs] = np.clip(c.rgb[ys, xs] * k[:, None], 0, 255).astype(np.uint8)
            n = noise(11 + int(mx), 1.2)
            holes = m & (n < .18); c.a[holes] = False; c.part[holes] = ''      # rot holes in the canvas
            for x in range(int(mx - w0) + 2, int(mx + w0), 4): line(c, [(x, y0 + 1), (x + (x - mx) * .1, y1 - 2)], R['sail'][2], 'sail')
    # rigging
    for (a, b) in [((8, 64), (32, 16)), ((32, 16), (62, 6)), ((62, 6), (92, 18)), ((92, 18), (122, 50)), ((20, 68), (32, 40)), ((104, 66), (92, 42))]:
        for (X, Y) in line(c, [a, b], (70, 90, 86), part=('', 'water')): c.a[Y, X] = True; c.part[Y, X] = 'rope'
    # lanterns at the mastheads and stern, and the music it plays on the wind
    for (x, y) in [(32, 12), (62, 2), (92, 14), (10, 58)]:
        glow(c, x, y + 1, 3, G)
    for k, (x, y) in enumerate([(12, 40), (20, 30), (104, 34), (112, 26), (50, 52)]):
        y += (2 if (k + f) % 2 else -1)
        c.rect(x, y, 2, 2, G[5]); c.px(x + 1, y - 1, G[4]); c.px(x + 2, y - 1, G[4]); c.px(x + 2, y - 2, G[4]); c.px(x + 2, y - 3, G[4]); c.part[y, x] = 'note'
        if k % 2: c.px(x + 3, y - 3, G[4]); c.px(x + 4, y - 2, G[4])
    # fog rolling along the waterline
    rs = np.random.RandomState(2 + f)
    for _ in range(10):
        cx = rs.randint(0, 124); cy = rs.randint(84, 96); rx = rs.randint(8, 18); ry = rs.randint(2, 4)
        m = c.mask(lambda d, cx=cx, cy=cy, rx=rx, ry=ry: d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=1))
        ys, xs = np.nonzero(m)
        keep = (yp.BAYER[ys % 4, xs % 4] < .55)
        ys, xs = ys[keep], xs[keep]
        c.rgb[ys, xs] = np.clip(c.rgb[ys, xs] * .4 + np.array(R['fog'][4]) * .6, 0, 255).astype(np.uint8); c.a[ys, xs] = True
        c.part[ys, xs] = np.where(c.part[ys, xs] == '', 'fog', c.part[ys, xs])
    texture(c, ['hull', 'castle', 'mast', 'yard'], amt=.12, seed=8)
    texture(c, ['sail'], amt=.07, seed=9)
    occlude(c, ['castle'], ['hull'], r=3, k=.6)
    occlude(c, ['sail'], ['mast', 'sail'], r=2, k=.75)
    speculars(c, ['hull', 'castle', 'figure'], thr=.86, col=(200, 255, 220))
    return finish(c, [('castle', 'hull'), ('mast', 'sail'), ('yard', 'sail'), ('figure', 'hull'), ('spar', 'castle'), ('hull', 'water')],
                  rim=(120, 240, 180), rimparts=('hull', 'castle', 'sail', 'mast'))

# =========================================================== witranalwe: a tall bony horseman's ghost in a black poncho
def witranalwe(f):
    setsize(60, 120); c = Canvas()
    C_, S, G = R['coat'], R['skull'], R['gglow']
    sw = f
    # the long poncho, falling straight to the ground and fraying into mist
    hem = [(4 + k * 6.5, 112 + ((k + f) % 2) * 3 + (k % 3)) for k in range(9)]
    poncho = [(16, 38), (44, 38), (52, 60), (56, 90), (56, 110)] + hem[::-1] + [(4, 110), (4, 90), (8, 60)]
    m = blob(c, C_, lambda d: d.polygon(poncho, fill=1), bulge=.6, lift=.12, name='poncho')
    for (x0, x1) in [(14, 10), (22, 20), (30, 30), (38, 40), (46, 50)]:          # long vertical folds
        line(c, [(x0, 44), (x1, 110)], C_[0], 'poncho'); line(c, [(x0 - 1, 46), (x1 - 1, 110)], C_[4], 'poncho')
    for y in range(102, 120):                                               # the hem dissolves into green mist
        for x in range(0, 60):
            if c.part[y, x] == 'poncho' and yp.BAYER[y % 4, x % 4] < (y - 100) / 20: c.a[y, x] = False; c.part[y, x] = ''
    for k in range(4):                                                       # a woven border of trarilonko-like steps
        for x in range(6, 56):
            y = 96 + k * 2 + (x // 3) % 2
            if c.part[y, x] == 'poncho': c.px(x, y, (34, 60, 44) if k % 2 else (60, 64, 70))
    # silver buttons down the front (the original's pairs)
    for y in range(46, 96, 10):
        for x in (27, 33): c.rect(x, y, 2, 2, R['silver'][4]); c.px(x, y, R['silver'][6]); c.px(x + 1, y + 1, R['silver'][1])
    # bony arms: forearms out of the poncho, long jointed fingers, one holding a rawhide whip
    taper(c, [(10, 56), (6, 70), (8 + sw, 82)], 5, 4, S, lift=.15, name='arm', bulge=1.2)
    for k in range(4):
        line(c, [(8 + sw, 82), (6 + k * 2 + sw, 88), (5 + k * 2 + sw, 92)], S[5 - (k % 2)], ('', 'poncho'))
    taper(c, [(50, 56), (54, 70), (52 - sw, 82)], 5, 4, S, lift=-.05, name='arm', bulge=1.2)
    line(c, [(52 - sw, 82), (56, 90), (58, 100), (54, 112), (58, 118)], (110, 80, 50))
    for (X, Y) in line(c, [(52 - sw, 82), (56, 90), (58, 100), (54, 112), (58, 118)], (130, 96, 60)): c.part[Y, X] = 'whip'
    for k in range(3): line(c, [(50 - sw, 82), (49 + k * 2 - sw, 87)], S[4])
    # the head: a long horse-like skull under a wide hat, eyes of green fire
    blob(c, S, lambda d: d.polygon(smooth_poly([(22, 18), (38, 18), (40, 28), (36, 38), (30, 41), (24, 38), (20, 28)], 5), fill=1), bulge=1.2, lift=.2, name='skull')
    facet(c, [(21, 26), (26, 22), (26, 30), (22, 31)], S[6]); facet(c, [(34, 22), (39, 26), (38, 31), (34, 30)], S[3])
    for (ex, ey) in [(25, 26), (35, 26)]:
        c.rect(ex - 2, ey - 2, 5, 4, (8, 10, 6)); glow(c, ex, ey, 2, G); c.px(ex - 1, ey - 1, (255, 255, 255))
    c.rect(29, 30, 2, 3, (10, 10, 8))
    for x in range(25, 36): c.px(x, 35, (10, 10, 8))
    for x in range(25, 36, 2): c.px(x, 34, S[6]); c.px(x, 36, S[5])
    for y in range(37, 42): c.px(29, y, S[1])
    # wide flat hat with a band and a long crown
    blob(c, R['hat'], lambda d: d.polygon([(18, 4), (42, 4), (42, 18), (18, 18)], fill=1), bulge=1.0, lift=.15, name='crown')
    blob(c, R['hat'], lambda d: d.ellipse([0, 14, 60, 23], fill=1), bulge=.8, lift=.2, name='brim')
    for x in range(18, 43): c.px(x, 15, (40, 70, 50)); c.px(x, 16, (24, 44, 32))
    for x in range(3, 57): c.px(x, 23, (4, 4, 6)) if c.part[23, x] == 'brim' else None
    # a green haze clinging to the figure
    for k in range(18):
        x = (k * 13 + f * 5) % 58 + 1; y = 40 + (k * 29) % 70
        if not c.a[y, x]: c.px(x, y, G[2] if k % 3 else G[3]); c.part[y, x] = 'mist'
    texture(c, ['poncho', 'crown', 'brim'], amt=.08, seed=4)
    texture(c, ['skull', 'arm'], amt=.1, seed=6, scale=.6)
    occlude(c, ['brim'], ['skull'], r=4, k=.45)
    speculars(c, ['skull', 'arm', 'brim'], thr=.88)
    return finish(c, [('brim', 'skull'), ('crown', 'brim'), ('skull', 'poncho'), ('arm', 'poncho')], rim=(120, 230, 160), rimparts=('poncho', 'brim', 'crown', 'skull', 'arm'))

# =========================================================== shared: a serpent's body along a path
def serpent(c, path, w0, w1, rmp, belly, name, lift=.1, step=4, spikes=None, n=10, front=False, kd=.55):
    """a tapered scaled body; belly plates on the underside (the side facing down); optional dorsal spikes"""
    P = cr(path, n) if len(path) > 2 else path
    taper(c, P, w0, w1, rmp, lift=lift, name=name, bulge=1.25)
    scales(c, name, step, rmp, k_dark=kd, k_lit=1 + (1 - kd) * .5)
    N = len(P)
    for i in range(1, N - 1):
        (x0, y0), (x1, y1) = P[i - 1], P[i + 1]
        L = max(.01, math.hypot(x1 - x0, y1 - y0)); nx, ny = -(y1 - y0) / L, (x1 - x0) / L
        if ny < 0: nx, ny = -nx, -ny                                   # the normal that points down
        w = (w0 + (w1 - w0) * i / N) / 2
        x, y = P[i]
        if front:                                                       # seen from the front: plates down the middle
            for k in np.linspace(-w * .4, w * .4, max(2, int(w))):
                X, Y = int(round(x + nx * k)), int(round(y + ny * k))
                if 0 <= X < yp.W and 0 <= Y < yp.H and c.part[Y, X] == name:
                    c.px(X, Y, belly[max(0, min(len(belly) - 1, int((1 - abs(k) / (w * .4) * .6 - (.25 if i % 3 == 0 else 0)) * (len(belly) - 1))))]); c.part[Y, X] = name + 'b'
            continue
        for k in np.linspace(w * .35, w * .95, max(2, int(w))):
            X, Y = int(round(x + nx * k)), int(round(y + ny * k))
            if 0 <= X < yp.W and 0 <= Y < yp.H and c.part[Y, X] == name:
                t = (k - w * .35) / max(.01, w * .6)
                c.px(X, Y, belly[max(0, min(len(belly) - 1, int((1 - t) * (len(belly) - 1) * .9 + .5)))]); c.part[Y, X] = name + 'b'
        if i % 3 == 0:
            for k in np.linspace(w * .35, w * .95, max(2, int(w))):
                X, Y = int(round(x + nx * k)), int(round(y + ny * k))
                if 0 <= X < yp.W and 0 <= Y < yp.H and c.part[Y, X] == name + 'b': c.rgb[Y, X] = (c.rgb[Y, X] * .55).astype(np.uint8)
        if spikes and i % spikes[0] == 0:
            sx, sy = x - nx * w * .9, y - ny * w * .9; ln = spikes[1] * (1 - i / N * .6)
            taper(c, [(sx, sy), (sx - nx * ln, sy - ny * ln)], 3, 1, spikes[2], lift=lift + .1, name=name + 's', bulge=1.0)
    return P

# =========================================================== chiñifilu: the serpent of ash, coiled around what is forgotten
R.update({k: [hx(c) for c in v] for k, v in {
    'ashs':  ['#0c0b0a', '#1a1816', '#2a2724', '#3c3834', '#504b45', '#666058', '#7e776d', '#989085'],
    'ashb':  ['#3a2c22', '#5a4434', '#7c5e48', '#9e7c60', '#bea080'],
    'ember': ['#3a0a02', '#7a1a04', '#c43a08', '#f47a18', '#ffc048', '#fff0a0']}.items()})
def chinifilu(f):
    setsize(104, 76); c = Canvas()
    A, E = R['ashs'], R['ember']
    blob(c, A[:4], lambda d: d.ellipse([6, 62, 100, 75], fill=1), bulge=.4, lift=.1, name='ashbed')
    for k in range(40):                                               # a bed of cinders
        x, y = 10 + (k * 37) % 86, 64 + (k * 13) % 9
        if c.part[y, x] == 'ashbed': c.px(x, y, E[2 + k % 3]) if k % 3 else c.px(x, y, A[5])
    b = f * 1.5
    # back coil, then front coil, then the rising neck: drawn back to front
    serpent(c, [(88, 60), (98, 46), (86, 34), (64, 36), (52, 48)], 13, 13, A, R['ashb'], 'coil1', lift=-.04, spikes=(3, 5, A))
    serpent(c, [(14, 60), (34, 68), (66, 68), (90, 62), (96, 52)], 16, 12, A, R['ashb'], 'coil2', lift=.12, spikes=(4, 5, A))
    serpent(c, [(60, 64), (40, 58), (28, 44), (26, 28 - b), (34, 16 - b)], 15, 11, A, R['ashb'], 'neck', lift=.18, spikes=(3, 6, A))
    # embers glowing through the cracks between the scales
    for part in ('coil1', 'coil2', 'neck'):
        ys, xs = np.nonzero(c.part == part)
        rs = np.random.RandomState(len(part) + f)
        for i in rs.choice(len(ys), len(ys) // 26, replace=False):
            y, x = ys[i], xs[i]
            if (c.rgb[y, x].mean() < 60): c.px(x, y, E[3 + (i % 2)]); c.px(x + 1, y, E[2]) if c.part[y, min(yp.W - 1, x + 1)] == part else None
    # the head: a wedge of ash-grey plates, ember eye, a forked tongue
    hx0, hy0 = 34, 14 - b
    head = smooth_poly([(hx0 - 14, hy0 + 2), (hx0 - 6, hy0 - 7), (hx0 + 8, hy0 - 8), (hx0 + 14, hy0 - 2), (hx0 + 10, hy0 + 8), (hx0 - 4, hy0 + 9)], 5)
    blob(c, A, lambda d: d.polygon(head, fill=1), bulge=1.25, lift=.2, name='head')
    facet(c, [(hx0 - 6, hy0 - 7), (hx0 + 8, hy0 - 8), (hx0 + 4, hy0 - 3), (hx0 - 6, hy0 - 2)], A[6])
    for x in range(int(hx0 - 12), int(hx0 + 12)): c.px(x, int(hy0 + 3 + (x - hx0) * .1), (14, 6, 4))
    for x in range(int(hx0 - 10), int(hx0 + 10), 3): tooth3(c, x, int(hy0 + 4), int(hy0 + 7), R['claw'])
    eye(c, int(hx0 - 4), int(hy0 - 3), 3, 2, E)
    for (dx, dy) in [(-3, -5), (2, -5), (7, -5)]: c.px(int(hx0 + dx), int(hy0 + dy - 3), A[7])   # brow horns
    t0 = (int(hx0 - 15), int(hy0 + 3))
    for (X, Y) in line(c, [t0, (t0[0] - 6, t0[1] + 2 - f * 2), (t0[0] - 9, t0[1] - 1 - f * 2)], (200, 50, 60)): c.part[Y, X] = 'tongue'
    line(c, [(t0[0] - 6, t0[1] + 2 - f * 2), (t0[0] - 9, t0[1] + 4 - f * 2)], (200, 50, 60))
    # ash drifting up from it
    for k in range(26):
        x = (k * 41 + f * 7) % 100 + 2; y = (k * 17 + f * 5) % 50 + 2
        if not c.a[y, x]: c.px(x, y, A[6] if k % 3 else E[3]); c.part[y, x] = 'flake'
    texture(c, ['coil1', 'coil2', 'neck', 'head'], amt=.14, seed=12)
    occlude(c, ['neck', 'head'], ['coil1', 'coil2', 'coil1b', 'coil2b'], r=4, k=.55)
    occlude(c, ['coil2', 'coil2b'], ['coil1', 'coil1b', 'ashbed'], r=4, k=.55)
    speculars(c, ['coil1', 'coil2', 'neck', 'head'], thr=.88, col=(255, 230, 200))
    return finish(c, [('neck', 'coil2'), ('neckb', 'coil2'), ('coil2', 'coil1'), ('coil2b', 'coil1'), ('head', 'neck'), ('neck', 'coil1'), ('necks', 'neck'), ('coil1s', 'coil1'), ('coil2s', 'coil2')],
                  rim=(240, 120, 50), rimparts=('coil1', 'coil2', 'neck', 'head'))

# =========================================================== piwüchen: the great winged serpent of the rivers
R.update({k: [hx(c) for c in v] for k, v in {
    'pscale': ['#12040a', '#260812', '#3e0e1c', '#5a1626', '#7a2232', '#9c3240', '#be4a52', '#da6c68'],
    'pbelly': ['#5a3a1a', '#8a6028', '#b48a3a', '#d8b056', '#f2d886'],
    'pmemb':  ['#0c0612', '#180c22', '#261434', '#361e48', '#48285c', '#5c3472', '#74448a', '#8e58a2'],
    'feath':  ['#0a2a2a', '#124444', '#1c6260', '#2a8480', '#40a8a0', '#68ccc0']}.items()})
def piwuchen(f):
    setsize(112, 88); c = Canvas()
    fl = -4 if f else 2; O = 8
    # bat wings spread from the neck, ribbed and scalloped
    for side in (-1, 1):
        rx, ry = 56 + side * 6, 26 + O
        lead = [(rx, ry), (56 + side * 24, 8 + O + fl), (56 + side * 46, 6 + O + fl), (56 + side * 54, 20 + O + fl)]
        ribs = [(56 + side * 50, 40 + O + fl), (56 + side * 40, 48 + O + fl * .7), (56 + side * 26, 50 + O + fl * .4), (56 + side * 14, 44 + O)]
        wp.R['memb'] = R['pmemb']
        wp.ear_wing(c, (rx, ry), lead, ribs, 0, .12 if side < 0 else -.02, 'wingL' if side < 0 else 'wingR', side)
        for (x, y) in [lead[2], lead[3]]:
            taper(c, [(x, y), (x + side * 4, y - 4)], 3, 1, R['claw'], lift=.2, name='claw', bulge=1.0)
    # the body hangs below in a long S, tail tip curling
    serpent(c, [(56, 32), (58, 48), (51, 60), (56, 70), (65, 77), (62, 85)], 17, 4, R['pscale'], R['pbelly'], 'body', lift=.12, step=3, n=12, front=True)
    # head: a fanged snake head with a crest of river-green feathers
    hd = [(43, 12), (49, 4), (63, 4), (69, 12), (66, 20), (61, 27), (51, 27), (46, 20)]
    blob(c, R['throat'], lambda d: d.polygon([(48, 30), (64, 30), (60, 44), (52, 44)], fill=1), bulge=.8, lift=-.05, name='maw')
    blob(c, R['pscale'], lambda d: d.polygon([(49, 38), (63, 38), (60, 46), (52, 46)], fill=1), bulge=1.1, lift=.05, name='jaw')
    blob(c, R['pscale'], lambda d: d.polygon(hd, fill=1), bulge=1.3, lift=.22, name='head')
    P_ = R['pscale']
    facet(c, [(49, 13), (56, 12), (56, 20), (48, 21)], P_[7]); facet(c, [(56, 12), (63, 13), (64, 21), (56, 20)], P_[5])
    facet(c, [(48, 21), (56, 20), (56, 28), (50, 29)], P_[6]); facet(c, [(56, 20), (64, 21), (62, 29), (56, 28)], P_[4])
    for y in range(5, 34): c.px(56, y, P_[2])
    c.px(53, 24, (20, 4, 6)); c.px(59, 24, (20, 4, 6))
    tooth3(c, 50, 35, 42, R['claw']); tooth3(c, 61, 35, 42, R['claw'])
    for x in range(53, 60, 3): tooth3(c, x, 35, 38, R['claw'])
    for k in range(7):                                                   # the crest, fanned behind the head
        a = math.radians(-165 + k * 25); L = 10 + (k % 2) * 3
        taper(c, [(56, 13), (56 + math.cos(a) * L, 13 + math.sin(a) * L * .9 - fl * .2)], 4, 1.5, R['feath'], lift=.1, name='crest', bulge=1.1)
    eye(c, 47, 20, 3, 2, R['eyey']); eye(c, 65, 20, 3, 2, R['eyey'])
    # its whistle: rings rolling out from the open jaws
    arcs(c, 56, 42, [9 + 3 * f, 15 + 3 * f], math.pi * .3, math.pi * .7, (240, 220, 160), step=.08)
    texture(c, ['body', 'head'], amt=.12, seed=14)
    occlude(c, ['head', 'crest'], ['body', 'bodyb', 'wingL', 'wingR'], r=3, k=.55)
    speculars(c, ['body', 'head', 'wingLrim', 'wingRrim'], thr=.86)
    return finish(c, [('head', 'body'), ('jaw', 'maw'), ('head', 'maw'), ('body', 'wingL'), ('body', 'wingR'), ('crest', 'head'), ('wingLbowl', 'body'), ('wingRbowl', 'body')],
                  rim=(230, 120, 140), rimparts=('body', 'head', 'wingLrim', 'wingRrim'))

# =========================================================== wallepeñ: a calf's head on a sheep's body, on legs too long
R.update({k: [hx(c) for c in v] for k, v in {
    'wool':  ['#16161c', '#26262e', '#3a3a42', '#504e54', '#6a666a', '#868080', '#a49c96', '#c0b8ae'],
    'calf':  ['#120806', '#22120c', '#341c12', '#48281a', '#5e3622', '#76462c', '#8e5838'],
    'muzzle':['#2e1818', '#4a2828', '#683c3a', '#8a5652', '#a87068'],
    'hoof':  ['#060606', '#121214', '#202024', '#30303a', '#44444e'],
    'blue':  ['#06183a', '#0c3070', '#1a54b0', '#3a86e0', '#80c0ff', '#e0f4ff']}.items()})
def wallipen(f):
    setsize(92, 76); c = Canvas()
    W_, C_ = R['wool'], R['calf']
    st = 1 if f else 0
    # four long thin legs, knobbed knees, hooves; the far pair darker
    for (x, lift, ph) in [(40, -.12, 0), (74, -.12, 1), (30, .1, 1), (64, .1, 0)]:
        k = st if ph else -st
        taper(c, [(x, 44), (x + 2 + k, 58), (x + k, 70)], 5, 4, C_, lift=lift, name='leg', bulge=1.2)
        blob(c, C_, lambda d, x=x, k=k: d.ellipse([x - 1 + k, 55, x + 5 + k, 61], fill=1), bulge=1.2, lift=lift + .05, name='knee')
        blob(c, R['hoof'], lambda d, x=x, k=k: d.polygon([(x - 3 + k, 70), (x + 3 + k, 70), (x + 4 + k, 75), (x - 4 + k, 75)], fill=1), bulge=1.0, lift=lift, name='hoof')
    # the fleece: a lumpy cloud of curls, darker underneath
    lumps = [(50, 30, 18), (66, 26, 14), (36, 28, 14), (78, 34, 11), (58, 42, 16), (40, 42, 13), (24, 36, 10)]
    for (x, y, r) in lumps:
        blob(c, W_, lambda d, x=x, y=y, r=r: d.ellipse([x - r, y - r * .8 - st, x + r, y + r * .8 - st], fill=1), bulge=1.0, lift=.16, name='wool')
    ys, xs = np.nonzero(c.part == 'wool')                                # tight curls: small dark rings everywhere
    for y in range(ys.min(), ys.max() + 1, 3):
        for x in range(xs.min() + (y % 2) * 2, xs.max() + 1, 4):
            for (dx, dy) in [(0, 1), (1, 1), (2, 0)]:
                X, Y = x + dx, y + dy
                if 0 <= X < yp.W and 0 <= Y < yp.H and c.part[Y, X] == 'wool': c.rgb[Y, X] = (c.rgb[Y, X] * .72).astype(np.uint8)
            if c.part[y, x] == 'wool': c.rgb[y, x] = np.minimum(255, c.rgb[y, x].astype(int) + 22).astype(np.uint8)
    # the marks it leaves on the unborn: dark spots in the wool
    for (x, y, r) in [(56, 26, 4), (70, 36, 3), (44, 36, 3), (62, 44, 2)]:
        m = c.mask(lambda d, x=x, y=y, r=r: d.ellipse([x - r, y - r * .7 - st, x + r, y + r * .7 - st], fill=1)) & (c.part == 'wool')
        ys, xs = np.nonzero(m); c.rgb[ys, xs] = np.array(R['carap'])[np.clip((c.rgb[ys, xs].mean(1) / 255 * 9).astype(int), 0, 6)]
    # stubby tail
    blob(c, W_, lambda d: d.ellipse([84, 26 - st, 92, 36 - st], fill=1), bulge=1.1, lift=0, name='wool2')
    # the calf's head, set low and turned toward you, wet muzzle, nubs of horn, one pale blue eye too many
    hd = smooth_poly([(8, 22), (20, 16), (30, 20), (32, 32), (24, 44), (14, 46), (6, 38)], 5)
    for side, (ex, ey) in [(-1, (8, 20)), (1, (30, 18))]:                   # ears, flopped out sideways
        blob(c, C_, lambda d, ex=ex, ey=ey, side=side: d.polygon([(ex, ey + 4), (ex + side * 10, ey + 2), (ex + side * 8, ey + 7)], fill=1), bulge=1.0, lift=.1 if side < 0 else -.05, name='ear')
    blob(c, C_, lambda d: d.polygon(hd, fill=1), bulge=1.25, lift=.22, name='head')
    blob(c, R['muzzle'], lambda d: d.ellipse([9, 34, 27, 47], fill=1), bulge=1.2, lift=.2, name='muzzle')
    c.rect(13, 40, 2, 2, (20, 8, 8)); c.rect(21, 40, 2, 2, (20, 8, 8)); c.px(12, 39, R['muzzle'][4]); c.px(20, 39, R['muzzle'][4])
    for x in range(13, 24): c.px(x, 45, R['muzzle'][0])
    blob(c, W_, lambda d: d.ellipse([12, 12, 26, 22], fill=1), bulge=1.0, lift=.2, name='wool')    # a tuft of wool between the horns
    for (hx_, side) in [(12, -1), (26, 1)]:
        taper(c, [(hx_, 18), (hx_ + side * 3, 12)], 4, 2, R['claw'], lift=.18, name='horn', bulge=1.1)
    for (ex, ey) in [(13, 28), (26, 28)]:
        c.rect(ex - 3, ey - 2, 6, 4, (8, 4, 4)); glow(c, ex, ey, 2, R['blue'][2:]); c.px(ex - 1, ey - 1, (255, 255, 255))
    for k in range(3): c.px(10 + k * 6, 46 + k % 2, (190, 210, 230)); c.px(10 + k * 6, 47 + k % 2 + f, (140, 170, 200))   # drool
    texture(c, ['wool', 'wool2'], amt=.08, seed=15, scale=.6)
    texture(c, ['head', 'ear', 'leg', 'knee'], amt=.1, seed=16)
    occlude(c, ['head', 'muzzle'], ['wool', 'leg'], r=4, k=.55)
    occlude(c, ['wool'], ['leg', 'knee'], r=5, k=.5)
    speculars(c, ['head', 'muzzle', 'horn', 'hoof'], thr=.86)
    return finish(c, [('head', 'wool'), ('muzzle', 'head'), ('ear', 'head'), ('horn', 'wool'), ('leg', 'wool'), ('knee', 'leg'), ('hoof', 'leg'), ('wool2', 'wool')],
                  rim=(120, 140, 210), rimparts=('wool', 'head', 'leg', 'ear'))

# =========================================================== trawko: the little man of the southern forest, axe raised, eyes that enchant
R.update({k: [hx(c) for c in v] for k, v in {
    'bark':  ['#0c0806', '#1a120c', '#2a1e14', '#3c2c1e', '#503c28', '#685034', '#806642'],
    'moss':  ['#0a1206', '#14220c', '#203614', '#2e4c1c', '#3e6426', '#527e32', '#6a9a42'],
    'straw': ['#1e1608', '#3a2c12', '#5a461e', '#7c622c', '#a0823c', '#c4a454', '#e2c672'],
    'stone': ['#141418', '#24242a', '#36363e', '#4a4a54', '#62626c', '#7e7e88', '#a0a0aa'],
    'redg':  ['#3a0404', '#7a0808', '#c41414', '#f43a2a', '#ff8a70', '#ffffff']}.items()})
def trawko(f):
    setsize(96, 112); c = Canvas()
    Bk, M = R['bark'], R['moss']
    # a cloak of fern fronds and moss behind him, red lining glimpsed
    cloak = smooth_poly([(26, 46), (70, 44), (82, 74), (86, 102), (62, 98), (40, 100), (14, 104), (16, 74)], 5)
    blob(c, M, lambda d: d.polygon(cloak, fill=1), bulge=.7, lift=.06, name='cloak')
    for k in range(9):                                                   # fronds: a midrib and leaflets
        x0 = 18 + k * 8; y1 = 100 + (k % 2) * 4 + (f if k % 2 else -f)
        pts = [(x0 + 4, 50), (x0 + 2, 76), (x0 + (k - 4), y1)]
        for (X, Y) in line(c, pts, M[5], 'cloak'): pass
        for t in range(54, 100, 4):
            X = int(x0 + 2 + (t - 54) * (k - 4) / 50)
            for s_ in (-1, 1):
                for q in range(1, 4):
                    xx, yy = X + s_ * q, t + q // 2
                    if 0 <= xx < yp.W and c.part[yy, xx] == 'cloak': c.px(xx, yy, M[4 if s_ < 0 else 2])
    blob(c, R['carap'], lambda d: d.polygon([(70, 52), (84, 78), (88, 104), (80, 102), (74, 76)], fill=1), bulge=.8, lift=-.05, name='lining')
    # squat body of knotted bark, short bowed legs, root feet
    blob(c, Bk, lambda d: d.polygon(smooth_poly([(30, 50), (66, 50), (70, 70), (62, 86), (34, 86), (26, 70)], 5), fill=1), bulge=1.2, lift=.18, name='body')
    for (a, b) in [((34, 56), (40, 82)), ((48, 54), (46, 84)), ((60, 56), (58, 82))]:
        line(c, [a, ((a[0] + b[0]) / 2 + 2, (a[1] + b[1]) / 2), b], Bk[1], 'body')
    for (x, lift) in [(38, .15), (58, -.02)]:
        taper(c, [(x, 84), (x - 3 if x < 48 else x + 3, 96), (x, 104)], 9, 8, Bk, lift=lift, name='leg', bulge=1.2)
        for k in range(4):
            line(c, [(x, 103), (x - 6 + k * 4, 107), (x - 8 + k * 5, 110)], Bk[3 + (k % 2)], ('', 'leg', 'cloak'))
    # belt of braided fibre
    for x in range(28, 70):
        y = 72 + int(2 * math.sin(x / 7))
        if c.part[y, x] == 'body': c.px(x, y, R['straw'][4 if x % 3 else 2]); c.px(x, y + 1, R['straw'][1])
    # arms: one hanging, gnarled hand; one raising the stone axe overhead
    taper(c, cr([(30, 56), (20, 68), (18, 80)], 6), 8, 7, Bk, lift=.15, name='arm', bulge=1.2)
    for k in range(4): line(c, [(18, 80), (13 + k * 3, 87), (12 + k * 3, 90)], Bk[5 - (k % 2)], ('', 'cloak', 'leg'))
    taper(c, cr([(66, 54), (78, 44), (82, 30)], 6), 8, 7, Bk, lift=-.04, name='arm2', bulge=1.2)
    sw = 2 if f else 0
    taper(c, [(82, 34), (88 - sw, 6)], 4, 4, Bk, lift=.35, name='haft', bulge=1.0)
    blob(c, R['stone'], lambda d: d.polygon([(76 - sw, 2), (96 - sw, 4), (94 - sw, 18), (80 - sw, 16), (72 - sw, 10)], fill=1), bulge=1.2, lift=.18, name='axe')
    facet(c, [(76 - sw, 3), (90 - sw, 4), (84 - sw, 9), (74 - sw, 9)], R['stone'][6])
    for k in range(5): line(c, [(81 - sw + k, 12), (83 - sw + k, 20)], R['straw'][3 + k % 2], ('haft', 'axe'))   # lashing
    blob(c, Bk, lambda d: d.ellipse([78, 26, 88, 36], fill=1), bulge=1.2, lift=.0, name='fist')
    # the head: big, knotted, a beard of moss, eyes of red fire, a grin full of crooked teeth
    hd = smooth_poly([(28, 22), (46, 16), (66, 22), (70, 38), (60, 52), (36, 52), (26, 38)], 5)
    blob(c, Bk, lambda d: d.polygon(hd, fill=1), bulge=1.3, lift=.24, name='head')
    blob(c, M, lambda d: d.polygon(smooth_poly([(30, 42), (66, 42), (62, 60), (48, 66), (34, 60)], 5), fill=1), bulge=1.0, lift=.1, name='beard')
    for x in range(32, 64, 2): line(c, [(x, 46), (x + (x - 48) * .08, 60 - abs(x - 48) // 3)], M[2 if x % 4 else 5], 'beard')
    facet(c, [(30, 30), (40, 28), (40, 32), (30, 34)], Bk[1]); facet(c, [(54, 28), (66, 30), (66, 34), (54, 32)], Bk[1])
    for (ex, ey) in [(36, 34), (58, 34)]:
        c.rect(ex - 4, ey - 2, 9, 5, (12, 4, 4)); glow(c, ex, ey, 3, R['redg']); c.px(ex - 1, ey - 1, (255, 255, 255))
    blob(c, R['muzzle'], lambda d: d.polygon([(44, 32), (52, 32), (54, 40), (42, 40)], fill=1), bulge=1.2, lift=.25, name='nose')
    c.rect(36, 43, 24, 4, (16, 4, 4))
    for k, x in enumerate(range(37, 59, 3)): tooth3(c, x, 43, 46 + (k % 2), R['claw'])
    # the pointed straw hat
    blob(c, R['straw'], lambda d: d.polygon([(48, -2 + f), (20, 26), (76, 26)], fill=1), bulge=.9, lift=.18, name='hat')
    for y in range(4, 26, 4):
        for x in range(18, 78):
            if c.part[y, x] == 'hat': c.px(x, y, R['straw'][1]); c.px(x, y - 1, R['straw'][5]) if c.part[y - 1, x] == 'hat' else None
    for x in range(20, 77, 3):
        if c.part[25, x] == 'hat': c.px(x, 26, R['straw'][3]); c.px(x, 27, R['straw'][2])
    texture(c, ['body', 'leg', 'arm', 'arm2', 'head', 'fist'], amt=.16, seed=17)
    texture(c, ['cloak', 'beard'], amt=.1, seed=18)
    occlude(c, ['hat'], ['head'], r=4, k=.5)
    occlude(c, ['beard', 'head'], ['body'], r=4, k=.55)
    speculars(c, ['head', 'axe', 'hat', 'body'], thr=.86)
    return finish(c, [('head', 'beard'), ('beard', 'body'), ('hat', 'head'), ('arm', 'body'), ('arm2', 'body'), ('leg', 'body'), ('axe', 'haft'), ('fist', 'haft'), ('cloak', 'body'), ('lining', 'cloak'), ('nose', 'head')],
                  rim=(190, 220, 140), rimparts=('cloak', 'head', 'hat', 'body', 'arm2'))

# =========================================================== walichu: a gaunt spirit in a painted guanaco-hide cloak, horned skull for a face
R.update({k: [hx(c) for c in v] for k, v in {
    'quill': ['#140c08', '#24160e', '#382416', '#4e3420', '#66462c', '#80583a', '#9a6c4a'],
    'sick':  ['#2a3008', '#4a5410', '#728018', '#a0b028', '#cce050', '#f0ffa0'],
    'pale':  ['#2a2826', '#46423c', '#665e56', '#8a8076', '#ada298', '#cec4b8', '#ece4da']}.items()})
def walichu(f):
    setsize(88, 116); c = Canvas()
    Q, P = R['quill'], R['pale']
    sw = f
    # the cloak: a wide quillango falling from narrow shoulders to the ground, flaring out
    hem = [(4 + k * 10, 112 + ((k + f) % 2) * 2) for k in range(9)]
    cl = [(34, 34), (54, 34), (64, 50), (76, 80), (86, 110)] + hem[::-1] + [(2, 110), (12, 80), (24, 50)]
    blob(c, Q, lambda d: d.polygon(cl, fill=1), bulge=.65, lift=.12, name='cloak')
    # painted panels: red and black step-frets and zigzags, as on Puelche hide cloaks, following the folds
    for band, y0 in enumerate((58, 78, 98)):
        for x in range(0, 88):
            for k in range(4):
                y = y0 + k + (2 if (x // 4 + band) % 2 else 0) * (1 if k < 2 else -1) + int((x - 44) ** 2 / 600)
                if 0 <= y < yp.H and c.part[y, x] == 'cloak':
                    v = c.rgb[y, x].mean() / 255
                    c.px(x, y, (int(150 * v + 40), int(30 * v + 8), int(20 * v + 6)) if (k + x // 4) % 3 else (12, 6, 4))
    for x in range(10, 80, 6):                                                # seams between the stitched skins
        line(c, [(44 + (x - 44) * .45, 38), (x, 112)], Q[1], 'cloak')
        for y in range(44, 112, 4):
            X = int(round(44 + (x - 44) * (.45 + .55 * (y - 38) / 74)))
            if c.part[y, X] == 'cloak': c.px(X + 1, y, Q[5])
    # long white arms, too many joints, fingers like twigs
    for side in (-1, 1):
        lf = .15 if side < 0 else -.04
        e = (44 + side * 30, 62 + (sw if side < 0 else -sw)); h = (44 + side * 34, 84 + (sw if side < 0 else -sw))
        taper(c, cr([(44 + side * 12, 40), e, h], 6), 4, 3, P, lift=lf, name='arm', bulge=1.2)
        for k in range(5):
            a = math.radians(90 + side * (-30 + k * 15))
            line(c, [h, (h[0] + math.cos(a) * 5, h[1] + math.sin(a) * 5), (h[0] + math.cos(a) * 8 + side * 2, h[1] + math.sin(a) * 9)], P[5 - (k % 2) * 2])
    # a mantle of grey fur about the shoulders
    blob(c, R['wool'], lambda d: d.polygon(smooth_poly([(24, 36), (44, 28), (64, 36), (60, 46), (44, 50), (28, 46)], 5), fill=1), bulge=1.0, lift=.15, name='fur')
    for x in range(26, 64, 2):
        line(c, [(x, 40), (x + (x - 44) * .1, 48 - abs(x - 44) // 5)], R['wool'][2 if x % 4 else 5], 'fur')
    # the head: a long horned skull, jaw hanging open, yellow light in the sockets
    blob(c, P, lambda d: d.polygon(smooth_poly([(36, 10), (52, 10), (56, 20), (52, 34), (48, 40), (40, 40), (36, 34), (32, 20)], 5), fill=1), bulge=1.25, lift=.22, name='skull')
    facet(c, [(36, 12), (44, 10), (44, 20), (34, 22)], P[6]); facet(c, [(44, 10), (52, 12), (54, 22), (44, 20)], P[4])
    for side in (-1, 1):
        pts = [(44 + side * 9, 12), (44 + side * 20, 4), (44 + side * 26, 8), (44 + side * 24, 16)]
        taper(c, cr(pts, 6), 6, 2, R['claw'], lift=.15 if side < 0 else 0, name='horn', bulge=1.2)
        for (X, Y) in line(c, cr(pts, 6)[2::4], R['claw'][1], 'horn'): pass
    for (ex, ey) in [(39, 22), (49, 22)]:
        c.rect(ex - 3, ey - 3, 7, 6, (10, 8, 4)); glow(c, ex, ey, 2, R['sick']); c.px(ex - 1, ey - 1, (255, 255, 255))
    c.rect(43, 28, 2, 3, (10, 8, 4))
    c.rect(38, 34, 12, 3 + sw, (12, 8, 4))
    for x in range(38, 50, 2): c.px(x, 33, P[6]); c.px(x + 1, 37 + sw, P[5])
    # a cloud of sickness around it: motes and wisps
    rs = np.random.RandomState(3 + f)
    for _ in range(46):
        x, y = rs.randint(0, 88), rs.randint(20, 112)
        if not c.a[y, x]: c.px(x, y, R['sick'][rs.randint(2, 5)]); c.part[y, x] = 'mote'
    texture(c, ['cloak'], amt=.12, seed=21)
    texture(c, ['skull', 'arm', 'horn'], amt=.1, seed=22, scale=.6)
    occlude(c, ['fur', 'skull'], ['cloak'], r=4, k=.55)
    speculars(c, ['skull', 'horn', 'arm'], thr=.86)
    return finish(c, [('fur', 'cloak'), ('skull', 'fur'), ('horn', 'skull'), ('arm', 'cloak'), ('arm', 'fur')], rim=(210, 200, 160), rimparts=('cloak', 'skull', 'fur', 'arm', 'horn'))

# =========================================================== elëngasëm: a giant of stone and salt from the eastern plains
R.update({k: [hx(c) for c in v] for k, v in {
    'salt':  ['#2a3438', '#425056', '#5e6e74', '#7e9098', '#a2b4ba', '#c4d4d8', '#e2eef0', '#ffffff'],
    'rock':  ['#100e0e', '#1e1a1a', '#2e2828', '#403838', '#544a48', '#6a5e5a', '#84766e'],
    'teal':  ['#063a30', '#0c6a56', '#18a080', '#40d4b0', '#9cfce0', '#ffffff']}.items()})
def crystal(c, x, y, w, h, lean, rmp, name, lift=0.0):
    """a hexagonal salt crystal: a lit left face, a darker right face, a pointed top cut into two planes"""
    top = (x + lean, y - h)
    L = [(x - w, y), (x - w + lean * .8, y - h * .78), top, (x + lean * .9, y - h * .82), (x, y + 1)]
    Rr = [(x, y + 1), (x + lean * .9, y - h * .82), top, (x + w + lean * .8, y - h * .78), (x + w, y)]
    m1 = facet(c, L, rmp[min(len(rmp) - 1, 5 + int(lift * 4))], name); m2 = facet(c, Rr, rmp[max(0, 3 + int(lift * 4))], name)
    facet(c, [(x - w + lean * .8, y - h * .78), top, (x + lean * .9, y - h * .82)], rmp[-1], name)
    facet(c, [(x + lean * .9, y - h * .82), top, (x + w + lean * .8, y - h * .78)], rmp[-3], name)
    for (X, Y) in line(c, [(x + lean * .45, y - h * .4), (x - w * .4 + lean * .6, y - h * .6)], rmp[-2], name): pass
    return m1 | m2
def chadikura(f):
    setsize(88, 100); c = Canvas()
    S_, Rk, T = R['salt'], R['rock'], R['teal']
    bob = f
    # the salt flat it stands on, cracked into hexagons
    blob(c, S_[:6], lambda d: d.ellipse([4, 88, 84, 99], fill=1), bulge=.4, lift=.2, name='flat')
    for (a, b) in [((12, 93), (26, 91)), ((26, 91), (34, 96)), ((44, 90), (56, 94)), ((56, 94), (70, 92)), ((34, 96), (44, 90))]: line(c, [a, b], S_[1], 'flat')
    # legs: columns of rock crusted with salt
    for (x, lift) in [(30, .12), (56, -.04)]:
        blob(c, Rk, lambda d, x=x: d.polygon([(x - 8, 62), (x + 8, 62), (x + 10, 92), (x - 10, 92)], fill=1), bulge=1.1, lift=lift, name='leg')
        crystal(c, x - 6, 92, 3, 9, -2, S_, 'cry', .1); crystal(c, x + 6, 92, 2, 6, 2, S_, 'cry', 0)
    # the torso: a great block of rock split by salt veins, a teal glow in the cracks
    torso = smooth_poly([(20, 28 + bob), (68, 28 + bob), (74, 46 + bob), (66, 68), (22, 68), (14, 46 + bob)], 5)
    blob(c, Rk, lambda d: d.polygon(torso, fill=1), bulge=1.2, lift=.16, name='torso')
    for pts in ([(30, 30), (36, 44), (32, 56), (36, 66)], [(58, 30), (52, 46), (58, 60)], [(36, 44), (52, 46)]):
        for (X, Y) in line(c, [(x, y + (bob if y < 60 else 0)) for x, y in pts], T[3], 'torso'):
            if c.part[Y, X + 1] == 'torso': c.px(X + 1, Y, T[1])
            if c.part[Y, X - 1] == 'torso': c.px(X - 1, Y, S_[5])
    glow(c, 44, 46 + bob, 4, T)
    # salt crystals bursting from the shoulders and back like a mane
    for (x, y, w, h, lean) in [(16, 36, 4, 20, -6), (24, 30, 4, 26, -3), (32, 28, 3, 18, -1), (56, 28, 3, 18, 1), (64, 30, 4, 26, 3), (72, 36, 4, 20, 6), (44, 28, 3, 14, 0)]:
        crystal(c, x, y + bob, w, h, lean, S_, 'cry', .1 if x < 44 else -.1)
    # arms: boulders hung from the shoulders, fists of raw salt
    for side in (-1, 1):
        lf = .14 if side < 0 else -.04
        taper(c, cr([(44 + side * 26, 40 + bob), (44 + side * 34, 56), (44 + side * 32, 72)], 6), 13, 12, Rk, lift=lf, name='arm', bulge=1.2)
        crystal(c, 44 + side * 32, 84, 7, 14, side * 2, S_, 'fist', lf)
    # the head: a smaller block set low, a brow of salt, teal eyes, a slot of a mouth
    hd = smooth_poly([(34, 12 + bob), (54, 12 + bob), (58, 24 + bob), (52, 34 + bob), (36, 34 + bob), (30, 24 + bob)], 4)
    blob(c, Rk, lambda d: d.polygon(hd, fill=1), bulge=1.25, lift=.2, name='head')
    facet(c, [(32, 18 + bob), (56, 18 + bob), (54, 22 + bob), (34, 22 + bob)], S_[5], 'brow'); facet(c, [(34, 22 + bob), (54, 22 + bob), (53, 23 + bob), (35, 23 + bob)], S_[2], 'brow')
    for ex in (38, 50):
        c.rect(ex - 2, 24 + bob, 5, 3, (4, 10, 8)); glow(c, ex, 25 + bob, 2, T); c.px(ex - 1, 24 + bob, (255, 255, 255))
    c.rect(38, 30 + bob, 12, 2, (6, 8, 8)); c.rect(39, 30 + bob, 10, 1, T[1])
    crystal(c, 44, 13 + bob, 4, 10, 0, S_, 'cry', .1)
    # salt dust in the air
    for k in range(20):
        x, y = (k * 29 + f * 3) % 86 + 1, (k * 19 + f * 7) % 84 + 2
        if not c.a[y, x]: c.px(x, y, S_[6] if k % 2 else S_[4]); c.part[y, x] = 'dust'
    texture(c, ['torso', 'leg', 'arm', 'head'], amt=.16, seed=23)
    occlude(c, ['head', 'arm', 'cry'], ['torso'], r=4, k=.55)
    occlude(c, ['torso'], ['leg'], r=5, k=.5)
    speculars(c, ['torso', 'head', 'arm', 'leg'], thr=.84, col=(220, 255, 245))
    return finish(c, [('head', 'torso'), ('arm', 'torso'), ('leg', 'torso'), ('cry', 'torso'), ('fist', 'arm'), ('brow', 'head'), ('cry', 'head')],
                  rim=(150, 255, 210), rimparts=('torso', 'arm', 'leg', 'head', 'cry'))

# =========================================================== epunamun: the two-faced ngen of war, a lance in each hand
R.update({k: [hx(c) for c in v] for k, v in {
    'copper':['#1a0a04', '#36160a', '#562610', '#7a3a18', '#9e5224', '#c26e34', '#e08e4a', '#f6b070'],
    'redc':  ['#1a0204', '#3a060a', '#600c12', '#8c161a', '#b42622', '#d8402c'],
    'blk':   ['#040404', '#0c0a0a', '#161212', '#221c1c', '#2e2626'],
    'skinE': ['#1a0c08', '#341a10', '#52281a', '#703824', '#904a30', '#b0603e', '#cc7a52']}.items()})
def epunamun(f):
    setsize(84, 104); c = Canvas()
    Cu, Rd, Sk = R['copper'], R['redc'], R['skinE']
    st = f
    # two lances, planted upright, red tassels at the blade
    for (x, lift) in [(8, .2), (76, 0)]:
        taper(c, [(x, 100), (x, 8)], 4, 3, R['bark'], lift=lift + .3, name='haft', bulge=1.0)
        blob(c, R['silver'], lambda d, x=x: d.polygon([(x, -1), (x + 4, 8), (x, 12), (x - 4, 8)], fill=1), bulge=1.1, lift=.2, name='blade')
        for k in range(4): line(c, [(x - 1 + k, 13), (x - 3 + k * 2 + st, 22)], Rd[3 + k % 2])
    # legs in a wide stance, wrapped in a chiripa, leather bands at the shins
    for (x0, x1, lift) in [(30, 18, .14), (54, 66, -.04)]:
        taper(c, [(x0, 66), (x1, 82), (x1 + (2 if x1 < 40 else -2), 98)], 10, 8, Sk, lift=lift, name='leg', bulge=1.2)
        for y in (86, 90): line(c, [(x1 - 5, y), (x1 + 5, y)], R['blk'][3], 'leg')
        blob(c, R['blk'], lambda d, x1=x1: d.polygon([(x1 - 6, 97), (x1 + 6, 97), (x1 + 8, 103), (x1 - 8, 103)], fill=1), bulge=1.0, lift=lift, name='foot')
    blob(c, Rd, lambda d: d.polygon([(24, 60), (60, 60), (66, 76), (52, 78), (42, 72), (32, 78), (18, 76)], fill=1), bulge=1.0, lift=.12, name='chiripa')
    for x in range(22, 64, 4): line(c, [(x, 62), (x + (x - 42) * .15, 76)], Rd[1], 'chiripa')
    # torso, bare and painted with red and black war stripes; a copper breastplate shaped like a kultrun
    blob(c, Sk, lambda d: d.polygon(smooth_poly([(26, 30), (58, 30), (62, 44), (56, 62), (28, 62), (22, 44)], 5), fill=1), bulge=1.2, lift=.18, name='torso')
    blob(c, Cu, lambda d: d.ellipse([30, 34, 54, 56], fill=1), bulge=1.25, lift=.2, name='plate')
    for (a, b) in [((42, 35), (42, 55)), ((31, 45), (53, 45))]: line(c, [a, b], Cu[1], 'plate')
    for (x, y) in [(36, 39), (48, 39), (36, 51), (48, 51)]: c.rect(x - 1, y - 1, 3, 3, Rd[4]); c.px(x - 1, y - 1, Rd[5])
    for x in range(24, 60): c.px(x, 59, Cu[5]); c.px(x, 60, Cu[2])
    # arms out to the lances
    for side in (-1, 1):
        lf = .16 if side < 0 else -.04; x = 8 if side < 0 else 76
        taper(c, cr([(42 + side * 16, 34), (42 + side * 26, 44), (x + side * -2, 48 + st)], 6), 8, 7, Sk, lift=lf, name='arm', bulge=1.2)
        for k in range(3): line(c, [(42 + side * (19 + k * 2), 36 + k * 2), (42 + side * (21 + k * 2), 38 + k * 2)], Rd[4] if k % 2 else R['blk'][0], 'arm')
        blob(c, Sk, lambda d, x=x: d.ellipse([x - 5, 44 + st, x + 5, 53 + st], fill=1), bulge=1.25, lift=lf, name='fist')
        for k in range(3): c.px(x - 3 + k * 3 if side < 0 else x + 3 - k * 3, 46 + st + k, Sk[6])
    # the head with two faces, one looking each way, under a crown of red and black feathers
    for k in range(9):
        a = math.radians(-160 + k * 17.5); L = 15 + (k % 2) * 4
        taper(c, [(42, 16), (42 + math.cos(a) * L, 16 + math.sin(a) * L)], 4, 1.5, Rd if k % 2 else R['blk'], lift=.1, name='feather', bulge=1.1)
    blob(c, Sk, lambda d: d.polygon(smooth_poly([(32, 12), (52, 12), (58, 20), (54, 30), (30, 30), (26, 20)], 5), fill=1), bulge=1.25, lift=.2, name='head')
    for x in range(28, 57): c.px(x, 13, Rd[4]); c.px(x, 14, Rd[2])                # trarilonko band
    for x in range(30, 56, 4): c.px(x, 13, Cu[6])
    # face one, looking left (lit, calm); face two, looking right (shadowed, snarling)
    facet(c, [(26, 20), (30, 16), (34, 22), (30, 28)], Sk[6]); facet(c, [(58, 20), (54, 16), (50, 22), (54, 28)], Sk[2])
    c.px(25, 21, Sk[5]); c.px(24, 22, Sk[4])                                       # noses, in profile
    c.px(59, 21, Sk[3]); c.px(60, 22, Sk[2])
    for (ex, col) in [(30, (255, 230, 160)), (54, (255, 90, 60))]:
        c.rect(ex - 2, 19, 4, 2, (16, 6, 4)); c.px(ex - 1 if ex < 42 else ex, 19, col); c.px(ex - 1 if ex < 42 else ex, 20, col)
    for x in range(28, 33): c.px(x, 25, (40, 14, 10))
    for x in range(51, 57): c.px(x, 25, (20, 4, 4))
    for x in range(52, 57, 2): c.px(x, 24, (240, 230, 210))
    for x in range(36, 49): c.px(x, 21, Rd[4]); c.px(x, 23, R['blk'][0])          # war paint across the shared brow
    texture(c, ['torso', 'arm', 'leg', 'head', 'fist'], amt=.1, seed=24)
    texture(c, ['plate'], amt=.07, seed=25)
    occlude(c, ['plate', 'arm', 'head'], ['torso'], r=3, k=.6)
    occlude(c, ['chiripa'], ['leg'], r=4, k=.55)
    speculars(c, ['plate', 'blade', 'head', 'torso'], thr=.85)
    return finish(c, [('plate', 'torso'), ('arm', 'torso'), ('head', 'torso'), ('chiripa', 'torso'), ('leg', 'chiripa'), ('fist', 'haft'), ('feather', 'head'), ('foot', 'leg')],
                  rim=(255, 170, 90), rimparts=('torso', 'arm', 'leg', 'head', 'plate'))

# =========================================================== fütra kalku: the great sorcerer of the forgetting
R.update({k: [hx(c) for c in v] for k, v in {
    'robeK': ['#050308', '#0a0610', '#110a1a', '#1a1026', '#241834', '#302244', '#3e2c56'],
    'mask':  ['#2a2830', '#46424e', '#66606e', '#8a8292', '#aea6b4', '#d0cad4', '#eeeaf0'],
    'vglow': ['#2a0a4a', '#5a1a8a', '#8a34c8', '#b464f0', '#dcaaff', '#ffffff']}.items()})
def kalku(f):
    setsize(80, 112); c = Canvas()
    Rb, M, V = R['robeK'], R['mask'], R['vglow']
    # the robe: a tall cone, layered capes, a hem that frays into smoke
    hem = [(2 + k * 9.5, 108 + ((k + f) % 2) * 3) for k in range(8)]
    blob(c, Rb, lambda d: d.polygon([(32, 26), (48, 26), (60, 60), (70, 104)] + hem[::-1] + [(4, 104), (18, 60)], fill=1), bulge=.7, lift=.14, name='robe')
    for k, y in enumerate((44, 64, 84)):                                    # silver-stitched edges of each cape layer
        for x in range(0, 80):
            yy = y + int(abs(x - 38) * .35)
            if c.part[yy, x] == 'robe':
                c.px(x, yy, R['silver'][3] if x % 2 else R['silver'][1]); c.px(x, yy - 1, Rb[1])
                if x % 6 == 0: c.px(x, yy + 1, V[2])
    for x0 in (20, 30, 46, 56):
        line(c, [(38 + (x0 - 38) * .2, 30), (x0, 104)], Rb[0], 'robe'); line(c, [(38 + (x0 - 38) * .2 - 1, 32), (x0 - 1, 104)], Rb[4], 'robe')
    for y in range(100, 112):
        for x in range(80):
            if c.part[y, x] == 'robe' and yp.BAYER[y % 4, x % 4] < (y - 98) / 14: c.a[y, x] = False; c.part[y, x] = ''
    # the staff: crooked wood, a skull at the top cradling a violet flame
    taper(c, cr([(64, 108), (66, 70), (63, 40), (66, 16)], 6), 3, 3, R['bark'], lift=.15, name='staff', bulge=1.0)
    blob(c, M, lambda d: d.polygon(smooth_poly([(60, 6), (72, 6), (74, 14), (68, 20), (62, 20), (58, 14)], 4), fill=1), bulge=1.2, lift=.18, name='skullS')
    c.rect(61, 11, 3, 3, (8, 4, 12)); c.rect(68, 11, 3, 3, (8, 4, 12)); c.px(62, 12, V[4]); c.px(69, 12, V[4])
    yp.flame(c, 66, 6, 10, 2, 1 + f * 1.4, 4, ramp=V)
    # sleeves and hands: long grey fingers, nails like thorns
    taper(c, cr([(34, 36), (24, 52), (28, 62)], 6), 10, 12, Rb, lift=.2, name='sleeve', bulge=1.1)
    taper(c, cr([(46, 36), (56, 48), (62, 52)], 6), 10, 12, Rb, lift=0, name='sleeve', bulge=1.1)
    for (hx_, hy, side) in [(30, 62, -1), (64, 52, 1)]:
        blob(c, M, lambda d, hx_=hx_, hy=hy: d.ellipse([hx_ - 4, hy - 3, hx_ + 4, hy + 4], fill=1), bulge=1.2, lift=.1, name='hand')
        for k in range(4):
            tip = (hx_ - 4 + k * 3, hy + 9 + (k % 2))
            line(c, [(hx_ - 3 + k * 2, hy + 2), tip], M[4 - (k % 2)])
            c.px(tip[0], tip[1] + 1, (20, 10, 24))
    for k in range(5):                                                       # violet threads of forgetting from the open hand
        a = .6 + k * .5 + f * .3
        line(c, [(30, 70), (30 + math.cos(a) * 6 - 6, 76 + k * 2), (24 - k * 3, 86 + k * 4)], V[2 + k % 3])
    # the hood and the mask: a pale moon-face, no mouth, violet eyes
    blob(c, Rb, lambda d: d.polygon(smooth_poly([(26, 18), (38, 4), (52, 14), (56, 30), (48, 40), (32, 40), (24, 30)], 5), fill=1), bulge=1.2, lift=.18, name='hood')
    blob(c, M, lambda d: d.ellipse([30, 14, 50, 36], fill=1), bulge=1.3, lift=.15, name='mask')
    facet(c, [(31, 22), (38, 15), (40, 16), (36, 26)], M[6])
    for (ex, ey) in [(35, 23), (45, 23)]:
        c.rect(ex - 3, ey - 1, 6, 3, (8, 4, 12)); glow(c, ex, ey, 2, V); c.px(ex - 1, ey, (255, 255, 255))
    for y in range(26, 34): c.px(40, y, M[2])
    for x in range(35, 46): c.px(x, 31, M[1])                                # a stitched seam where a mouth should be
    for x in range(35, 46, 2): c.px(x, 30, M[0]); c.px(x, 32, M[0])
    for k in range(3): c.px(33 + k * 5, 17, V[3])                            # painted marks on the brow
    # violet sparks
    for k in range(22):
        x, y = (k * 31 + f * 5) % 78 + 1, (k * 23 + f * 3) % 100 + 4
        if not c.a[y, x]: c.px(x, y, V[3] if k % 2 else V[2]); c.part[y, x] = 'spark'
    texture(c, ['robe', 'hood', 'sleeve'], amt=.08, seed=26)
    texture(c, ['mask', 'skullS', 'hand'], amt=.07, seed=27, scale=.6)
    occlude(c, ['hood', 'mask'], ['robe'], r=4, k=.5)
    occlude(c, ['sleeve'], ['robe'], r=3, k=.6)
    speculars(c, ['mask', 'skullS', 'hand'], thr=.88)
    return finish(c, [('mask', 'hood'), ('hood', 'robe'), ('sleeve', 'robe'), ('hand', 'sleeve'), ('hand', 'staff'), ('skullS', 'staff')],
                  rim=(170, 110, 230), rimparts=('robe', 'hood', 'sleeve', 'mask', 'staff'))

# =========================================================== the Fütra Ngoymatulfe: five forms of the great forgetting
R.update({k: [hx(c) for c in v] for k, v in {
    'stn':   ['#0a0c0e', '#14181c', '#20262c', '#2e363e', '#3e4852', '#505c68', '#66727e', '#7e8a96', '#9aa6b0'],
    'void':  ['#020204', '#06060a', '#0c0c12', '#14141c'],
    'fgreen':['#0a1a0a', '#163a16', '#246024', '#3a8a34', '#62b450', '#a0e080', '#e0ffd0'],
    'shade': ['#020104', '#06040a', '#0c0812', '#140e1c', '#1e1628', '#2a2036', '#382c46']}.items()})
def cracks(c, part, paths, rmp, w=1):
    for pts in paths:
        for (X, Y) in line(c, pts, rmp[3], part):
            if c.part[Y, min(yp.W - 1, X + 1)] == part: c.px(X + 1, Y, rmp[1])
            if Y > 0 and c.part[Y - 1, X] == part: c.rgb[Y - 1, X] = np.minimum(255, c.rgb[Y - 1, X].astype(int) + 26).astype(np.uint8)
def holes(c, part, pts, r=2):
    """stopped mouths in the stone: a dark pit, a lit lower lip, a shadowed upper lip"""
    for (x, y) in pts:
        for yy in range(y - r, y + r + 1):
            for xx in range(x - r - 1, x + r + 2):
                if ((xx - x) / (r + 1)) ** 2 + ((yy - y) / r) ** 2 <= 1 and c.part[yy, xx] == part: c.px(xx, yy, (6, 6, 8))
        for xx in range(x - r, x + r + 1):
            if c.part[y + r + 1, xx] == part: c.rgb[y + r + 1, xx] = np.minimum(255, c.rgb[y + r + 1, xx].astype(int) + 40).astype(np.uint8)
def rubble(c, n, box, rmp, seed, f):
    rs = np.random.RandomState(seed)
    for _ in range(n):
        x = rs.randint(box[0], box[2]); y = rs.randint(box[1], box[3]) + (f if rs.rand() < .5 else -f); r = rs.randint(1, 3)
        blob(c, rmp, lambda d, x=x, y=y, r=r: d.polygon([(x - r, y), (x, y - r), (x + r, y + 1), (x, y + r)], fill=1), bulge=1.0, lift=.15, name='rubble')

def ngoyman1(f):
    """Ti Fütra Ngoymatulfe: a stone idol rising from a mound of stopped mouths, arms flung up, a void for a face"""
    setsize(128, 96); c = Canvas()
    S_, E = R['stn'], R['ember']
    bob = f
    mound = smooth_poly([(14, 94), (30, 72), (50, 64), (78, 64), (98, 72), (114, 94)], 5)
    blob(c, S_, lambda d: d.polygon(mound, fill=1), bulge=.9, lift=.12, name='mound')
    holes(c, 'mound', [(30, 86), (44, 78), (58, 88), (72, 76), (86, 86), (100, 88), (52, 70), (80, 70)], 2)
    # arms flung up and out in an X, three-fingered claws
    for side in (-1, 1):
        lf = .16 if side < 0 else -.02
        sh = (64 + side * 16, 34 + bob); el = (64 + side * 36, 22); hd = (64 + side * 54, 6 - bob)
        taper(c, cr([sh, el, hd], 8), 12, 8, S_, lift=lf, name='arm', bulge=1.25)
        plate_lines(c, 'arm', [((el[0] - 4, el[1] - 4), (el[0] + 4, el[1] + 4))], .55)
        for k in range(3):
            a = math.radians(-90 + side * (20 + k * 25))
            taper(c, [hd, (hd[0] + math.cos(a) * 9, hd[1] + math.sin(a) * 9)], 4, 1, S_, lift=lf + .1, name='claw', bulge=1.1)
        # the lower arms: pointing down and out, braced
        taper(c, cr([(64 + side * 14, 46 + bob), (64 + side * 32, 56), (64 + side * 46, 70)], 6), 8, 5, S_, lift=lf - .05, name='arm2', bulge=1.2)
    # body: a tapering trunk with a hollow chest where words smoulder
    trunk = smooth_poly([(46, 30 + bob), (82, 30 + bob), (78, 50), (70, 70), (58, 70), (50, 50)], 5)
    blob(c, S_, lambda d: d.polygon(trunk, fill=1), bulge=1.2, lift=.16, name='trunk')
    blob(c, R['void'], lambda d: d.ellipse([54, 38 + bob, 74, 56 + bob], fill=1), bulge=.6, lift=0, name='hollow')
    rs = np.random.RandomState(5 + f)
    for _ in range(22):
        x, y = rs.randint(56, 73), rs.randint(41, 55) + bob
        if c.part[y, x] == 'hollow': c.px(x, y, E[rs.randint(2, 6)])
    cracks(c, 'trunk', [[(52, 34 + bob), (56, 46), (54, 60)], [(76, 34 + bob), (72, 50), (74, 62)]], S_)
    # head: a smooth egg of stone, the face a void with two embers for eyes and a round dark mouth, four horns
    for (a, L) in [(-115, 18), (-65, 18), (-150, 14), (-30, 14)]:
        r = math.radians(a)
        taper(c, cr([(64, 14 + bob), (64 + math.cos(r) * L * .6, 14 + bob + math.sin(r) * L * .6 - 2), (64 + math.cos(r) * L, 14 + bob + math.sin(r) * L)], 5), 5, 1.5, S_, lift=.18, name='horn', bulge=1.2)
    blob(c, S_, lambda d: d.ellipse([50, 4 + bob, 78, 32 + bob], fill=1), bulge=1.3, lift=.2, name='head')
    blob(c, R['void'], lambda d: d.ellipse([54, 10 + bob, 74, 30 + bob], fill=1), bulge=.6, lift=0, name='face')
    for ex in (59, 69):
        glow(c, ex, 17 + bob, 2.4, E[1:]); c.px(ex - 1, 16 + bob, (255, 255, 255))
    for a in np.linspace(0, 2 * math.pi, 30):
        c.px(int(round(64 + math.cos(a) * 3)), int(round(25 + bob + math.sin(a) * 2)), E[2])
    rubble(c, 14, (4, 30, 124, 70), S_, 31, f)
    texture(c, ['mound', 'arm', 'arm2', 'trunk', 'head', 'horn'], amt=.14, seed=40)
    occlude(c, ['trunk', 'head'], ['mound', 'arm2'], r=4, k=.55)
    occlude(c, ['arm'], ['trunk'], r=3, k=.6)
    speculars(c, ['head', 'trunk', 'arm', 'mound'], thr=.86)
    return finish(c, [('head', 'trunk'), ('face', 'head'), ('hollow', 'trunk'), ('arm', 'trunk'), ('arm2', 'trunk'), ('trunk', 'mound'), ('horn', 'head'), ('claw', 'arm'), ('arm2', 'mound')],
                  rim=(140, 200, 120), rimparts=('head', 'trunk', 'arm', 'mound', 'horn'))

def ngoyman2(f):
    """Ngoymatulfe ñi piwke: its heart, a stone heart bound in roots, green veins of the forgotten words pulsing"""
    setsize(80, 100); c = Canvas()
    S_, G = R['oxblood'], R['fgreen']
    p = 1 if f else 0
    # the plinth and the roots that hold it
    blob(c, S_, lambda d: d.polygon([(24, 86), (56, 86), (62, 98), (18, 98)], fill=1), bulge=1.0, lift=.12, name='plinth')
    blob(c, S_, lambda d: d.polygon([(30, 78), (50, 78), (54, 88), (26, 88)], fill=1), bulge=1.0, lift=.2, name='plinth2')
    # the heart: two lobes and a point, armoured in plates
    heart = smooth_poly([(40, 22 - p), (50, 8 - p), (66, 6 - p), (76, 20), (72, 40), (58, 60), (40, 80), (22, 60), (8, 40), (4, 20), (14, 6 - p), (30, 8 - p)], 5)
    blob(c, S_, lambda d: d.polygon(heart, fill=1), bulge=1.25, lift=.18, name='heart')
    plate_lines(c, 'heart', [((40, 22), (40, 78)), ((10, 30), (70, 30)), ((18, 52), (62, 52))], .5)
    rivets(c, [(20, 28), (30, 28), (50, 28), (60, 28), (26, 50), (54, 50), (34, 62), (46, 62)], S_)
    # veins of green light branching across it, brighter on the beat
    veins = [[(40, 22), (34, 34), (24, 44), (16, 46)], [(40, 22), (48, 36), (58, 40), (68, 34)], [(34, 34), (36, 50), (40, 66), (40, 76)], [(48, 36), (50, 50), (46, 60)],
             [(24, 44), (26, 56)], [(58, 40), (60, 50)], [(30, 12), (34, 24)], [(52, 12), (48, 24)]]
    for v in veins:
        for (X, Y) in line(c, v, G[4 + p], 'heart'):
            if c.part[Y, X + 1] == 'heart': c.px(X + 1, Y, G[2 + p])
            if c.part[Y, X - 1] == 'heart' and p: c.px(X - 1, Y, G[3])
    glow(c, 40, 34, 4 + p, G)
    # roots wrapping it, from the plinth up over the lobes
    for pts in ([(28, 82), (14, 64), (8, 40), (14, 18), (28, 10)], [(52, 82), (66, 64), (72, 40), (66, 18), (52, 10)], [(36, 80), (30, 60), (34, 44)], [(44, 80), (50, 60), (46, 46)]):
        taper(c, cr(pts, 7), 5, 2, R['bark'], lift=.15, name='root', bulge=1.2)
    # drops of light falling from the point
    for k in range(3): c.px(40, 84 + k * 4 + p * 2, G[4]); c.px(40, 85 + k * 4 + p * 2, G[2])
    texture(c, ['heart', 'plinth', 'plinth2'], amt=.14, seed=41)
    texture(c, ['root'], amt=.12, seed=42)
    occlude(c, ['root'], ['heart'], r=2, k=.6)
    occlude(c, ['heart'], ['plinth2'], r=4, k=.55)
    speculars(c, ['heart', 'root', 'plinth'], thr=.86, col=(220, 255, 210))
    return finish(c, [('root', 'heart'), ('heart', 'plinth2'), ('plinth2', 'plinth'), ('root', 'plinth2')], rim=(130, 230, 120), rimparts=('heart', 'root', 'plinth'))

def rock(c, cx, cy, rx, ry, seed, rmp, lift=.1, name='rock', n=9, jag=.22):
    """a rough-hewn boulder: a jagged outline, a rounded mass, then chiselled planes cut into it from a ridge"""
    rs = np.random.RandomState(seed)
    pts = []
    for k in range(n):
        a = 2 * math.pi * k / n + rs.uniform(-.2, .2); r = 1 + rs.uniform(-jag, jag)
        pts.append((cx + math.cos(a) * rx * r, cy + math.sin(a) * ry * r))
    m = blob(c, rmp, lambda d: d.polygon(pts, fill=1), bulge=1.15, lift=lift, name=name)
    ridge = (cx - rx * .25, cy - ry * .3)                         # the planes all meet at a ridge up toward the light
    for (x, y) in pts[::2]:
        for (X, Y) in line(c, [ridge, ((ridge[0] + x) / 2, (ridge[1] + y) / 2)], rmp[1], name):
            if c.part[Y, min(yp.W - 1, X + 1)] == name: c.rgb[Y, X + 1] = np.minimum(255, c.rgb[Y, X + 1].astype(int) + 22).astype(np.uint8)
    ys, xs = np.nonzero(m)
    up = (ys - cy) < -ry * .35                                    # a flat-ish lit top face
    c.rgb[ys[up], xs[up]] = np.minimum(255, c.rgb[ys[up], xs[up]].astype(int) + 14).astype(np.uint8)
    return m, pts
def moss_on(c, part, rmp, seed, amount=.3):
    """moss only where a surface faces up: pixels of the part with empty space or another part above them"""
    from scipy.ndimage import gaussian_filter as gf
    rs = np.random.RandomState(seed); n = gf(rs.rand(yp.H, yp.W), 1.2)
    m = np.isin(c.part, part) & c.a
    top = m & ~np.roll(m, 3, 0)
    grow = np.zeros_like(m)
    for k in range(3): grow |= np.roll(top, k, 0)
    grow &= m & (n > np.percentile(n, 100 - amount * 100))
    ys, xs = np.nonzero(grow)
    c.rgb[ys, xs] = np.array(rmp)[np.clip((c.rgb[ys, xs].mean(1) / 255 * len(rmp) * 1.6).astype(int), 0, len(rmp) - 1)]
def ngoyman3(f):
    """Fütra Ngoymatulfe: a golem of rough-hewn sandstone, the blocks held together by the forgetting's own light"""
    setsize(96, 124); c = Canvas()
    S_, Y_ = R['sand'], R['yglow']
    bob = f
    J = []                                                         # joints: where the light shows between the blocks
    # legs: thigh block, shin block, a flat foot slab; the far leg first
    for (x, lift, sd) in [(62, -.06, 1), (34, .12, 2)]:
        rock(c, x + 2 * (1 if x > 48 else -1), 117, 13, 6, 30 + sd, S_, lift, 'foot', n=8, jag=.12)
        rock(c, x, 104, 10, 10, 32 + sd, S_, lift, 'shin')
        rock(c, x, 87, 11, 10, 34 + sd, S_, lift + .04, 'thigh')
        J += [(x, 96), (x, 112)]
    rock(c, 48, 76, 22, 10, 40, S_, .06, 'hip', n=10)
    # the trunk: a great chest block, a belly stone under it, slabs on the shoulders
    rock(c, 48, 64 + bob, 20, 10, 41, S_, .08, 'belly')
    rock(c, 48, 46 + bob, 30, 17, 42, S_, .16, 'chest', n=11, jag=.16)
    J += [(36, 70), (60, 70), (30, 56 + bob), (66, 56 + bob)]
    # arms: long, heavy, hanging to the knees, the fists big as boulders
    for side in (-1, 1):
        lf = .14 if side < 0 else -.04; sx = 48 + side * 34
        rock(c, sx + side * 4, 54 + bob, 9, 13, 50 + side, S_, lf, 'arm', n=8)
        rock(c, sx + side * 6, 78, 8, 12, 52 + side, S_, lf, 'arm', n=8)
        rock(c, sx + side * 5, 99, 11, 10, 54 + side, S_, lf + .05, 'fist', n=9)
        J += [(sx + side * 5, 66), (sx + side * 6, 89)]
    for side in (-1, 1):
        rock(c, 48 + side * 26, 33 + bob, 15, 10, 60 + side, S_, .2 if side < 0 else .04, 'shoulder', n=9)
    # the head: a small heavy stone sunk forward between the shoulders, no mouth, eyes as a slit of light in a crevice
    rock(c, 48, 26 + bob, 12, 10, 70, S_, .24, 'head', n=8, jag=.14)
    for x in range(38, 59):                                         # the brow ledge and the crevice under it
        y = 25 + bob + (1 if x in (47, 48, 49) else 0)
        if c.part[y, x] == 'head': c.px(x, y - 1, S_[7]); c.px(x, y, (8, 6, 2)); c.px(x, y + 1, (14, 10, 4)); c.px(x, y + 2, S_[1])
    for ex in (42, 54):
        c.px(ex - 1, 25 + bob, Y_[3]); c.px(ex, 25 + bob, Y_[5]); c.px(ex + 1, 25 + bob, Y_[3])
        glow(c, ex, 25 + bob, 1.6, Y_)
    # the light of the forgetting holding the blocks together: glowing gaps at every joint, and runes cut into the chest
    for (x, y) in J:
        glow(c, x, y, 2.2, Y_[:5])
    for pts in ([(40, 40 + bob), (44, 46 + bob), (40, 52 + bob)], [(56, 40 + bob), (52, 46 + bob), (56, 52 + bob)], [(44, 46 + bob), (52, 46 + bob)]):
        for (X, Y) in line(c, pts, Y_[4], 'chest'):
            if c.part[Y, X + 1] == 'chest': c.px(X + 1, Y, Y_[2])
    moss_on(c, ['shoulder', 'head', 'chest', 'fist', 'hip'], [hx(x) for x in ['#0e140a', '#1a2412', '#28361a', '#384a24', '#4a5e30']], 7, .28)
    rubble(c, 9, (2, 4, 94, 70), S_, 33, f)
    texture(c, ['foot', 'shin', 'thigh', 'hip', 'belly', 'chest', 'arm', 'fist', 'shoulder', 'head'], amt=.2, seed=43)
    occlude(c, ['head'], ['chest'], r=4, k=.5)
    occlude(c, ['shoulder'], ['chest', 'arm'], r=4, k=.55)
    occlude(c, ['chest'], ['belly', 'hip'], r=4, k=.55)
    occlude(c, ['hip'], ['thigh'], r=4, k=.5)
    occlude(c, ['thigh'], ['shin'], r=3, k=.55)
    speculars(c, ['head', 'shoulder', 'chest', 'fist'], thr=.88)
    parts = ['foot', 'shin', 'thigh', 'hip', 'belly', 'chest', 'arm', 'fist', 'shoulder', 'head']
    return finish(c, [(p_, q) for p_ in parts for q in parts if p_ != q], rim=(230, 190, 110), rimparts=tuple(parts))

R.update({k: [hx(c) for c in v] for k, v in {
    'dusk':  ['#030106', '#08040e', '#0f0918', '#181024', '#221832', '#2e2242', '#3c2e54', '#4c3c68'],
    'dfire': ['#1a0410', '#3a0820', '#6a1030', '#a0183e', '#d83a50', '#ff8a90']}.items()})
def ngoyman4(f):
    """Füta Dumiñ: the great darkness. A hooded shape of night painted like the Yewen (sculpted hood and shoulders,
    a high collar of shadow, horns of smoke, clawed hands, dark ghostfire behind it) that dissolves into fog below
    the chest and at every edge, so it never quite has a body."""
    setsize(112, 144)
    from scipy.ndimage import gaussian_filter as gf
    H_, W_ = 144, 112
    yy, xx = np.mgrid[0:H_, 0:W_].astype(float)
    bay = yp.BAYER[yy.astype(int) % 4, xx.astype(int) % 4]
    ph = f * .7
    # ---- the fog: a density field churned by noise; its edges dither away into nothing
    dens = np.zeros((H_, W_))
    def puff(x, y, r, k=1.0):
        dens[:] = np.maximum(dens, k * np.exp(-((xx - x) ** 2 + (yy - y) ** 2) / (2 * r * r)))
    for t in np.linspace(0, 1, 40):
        puff(56 + math.sin(t * 5 + ph) * 4 * t, 50 + t * 88, 18 - t * 9, 1.15 - t * .55)
    arm = {}
    for side in (-1, 1):
        P = []
        for t in np.linspace(0, 1, 34):
            x = 56 + side * (14 + t * 36); y = 46 - math.sin(t * 2.6) * 14 + t * t * 34 + math.sin(t * 7 + ph + side) * 2
            puff(x, y, 7.5 - t * 3.5, 1.0 - t * .3); P.append((x, y))
        arm[side] = P
    for k in range(9):
        x0 = 18 + k * 9.5; y0 = 50 + (k * 37) % 70
        for t in np.linspace(0, 1, 12): puff(x0 + math.sin(t * 4 + k + ph) * 5, y0 - t * 18, 3 - t * 2, .5 - t * .3)
    rs = np.random.RandomState(4)
    n1 = gf(rs.rand(H_ + 8, W_ + 8), 3.0); n2 = gf(rs.rand(H_ + 8, W_ + 8), 1.2); o = 2 + f * 3
    n = (n1[o:o + H_, 2:2 + W_] - n1.mean()) / n1.std() * .5 + (n2[2:2 + H_, o:o + W_] - n2.mean()) / n2.std() * .22
    D = dens * (1 + n * .45) - .04 * n
    fog = D > (.2 + (bay - .5) * .3)
    gy, gx = np.gradient(gf(D, 1.5)); lit = np.clip(-(gx + gy) * 4, -.5, .5)
    Dk = R['dusk']; DS = [hx(x) for x in ['#05020a', '#0c0716', '#160e24', '#221834', '#302446', '#40325a', '#52436e', '#685888', '#8270a4']]
    t = np.clip(1 - (D - .2) / .7, 0, 1) ** 1.3 * .85 + lit * .35 + n * .08
    fogc = np.array(Dk)[np.clip(np.floor(t * (len(Dk) - 1) + (bay - .5) * .5).astype(int), 0, len(Dk) - 1)]

    # ---- the figure, painted on its own canvas
    c = Canvas()
    # ghostfire of the dark behind it, as the Yewen's burns behind him
    for (x0, y0, L, amp, p0, w) in [(32, 50, 26, 4, .4, 3), (80, 50, 28, 4, 2.2, 3), (24, 58, 18, 3, 4.0, 2.2), (88, 58, 18, 3, 1.0, 2.2)]:
        yp.flame(c, x0, y0, L, amp, p0 + f * .8, w, ramp=R['dfire'])
    # horns of smoke: long, curling back, thinning to nothing
    for side in (-1, 1):
        pts = cr([(56 + side * 10, 18), (56 + side * 20, 8), (56 + side * 32, 4), (56 + side * 40, 10)], 8)
        taper(c, pts, 6, 1.2, DS, lift=.3 if side < 0 else .12, name='horn', bulge=1.2)
    # shoulders: a broad mass of solid dark, sculpted, sinking into the fog
    blob(c, DS, lambda d: d.polygon(smooth_poly([(24, 58), (34, 40), (56, 34), (78, 40), (88, 58), (78, 70), (56, 74), (34, 70)], 6), fill=1), bulge=1.15, lift=.34, name='shoulder')
    for (x0, x1) in [(40, 36), (48, 46), (64, 66), (72, 76)]:                 # folds of shadow-cloth running down
        line(c, [(x0, 44), (x1, 70)], DS[1], 'shoulder'); line(c, [(x0 - 1, 45), (x1 - 1, 70)], DS[5], 'shoulder')
    # a high collar of shadow round the hood, jagged like the Yewen's
    blob(c, DS, lambda d: d.polygon([(30, 52), (26, 30), (33, 34), (34, 18), (42, 32), (56, 36), (70, 32), (78, 18), (79, 34), (86, 30), (82, 52)], fill=1), bulge=.8, lift=.2, name='collar')
    # the hood: tall, pointed, deeply shaded; the face inside it is a hollow of night
    blob(c, DS, lambda d: d.polygon(smooth_poly([(56, 8), (66, 16), (72, 30), (70, 44), (56, 50), (42, 44), (40, 30), (46, 16)], 6), fill=1), bulge=1.3, lift=.38, name='hood')
    for y in range(12, 46):                                               # the hood's seam and a lit fold on its left
        if c.part[y, 56] == 'hood': c.px(56, y, DS[2])
        X = 47 + (y - 12) // 9
        if c.part[y, X] == 'hood': c.px(X, y, DS[7])
    blob(c, R['void'], lambda d: d.polygon(smooth_poly([(56, 20), (65, 26), (66, 38), (56, 46), (46, 38), (47, 26)], 5), fill=1), bulge=.5, lift=0, name='face')
    Rg = R['redg']
    for (ex, ey, r) in [(51, 31, 2.4), (61, 31, 2.4), (56, 26, 1.8), (48, 37, 1.5), (64, 37, 1.5), (56, 36, 1.3)]:
        glow(c, ex, ey + (1 if f else 0), r, Rg); c.px(int(ex) - 1, int(ey), (255, 236, 230))
    # hands at the end of the drifts of smoke: long fingers, red-black nails
    for side in (-1, 1):
        hx_, hy_ = arm[side][28]
        blob(c, DS, lambda d, hx_=hx_, hy_=hy_: d.ellipse([hx_ - 5, hy_ - 4, hx_ + 5, hy_ + 5], fill=1), bulge=1.25, lift=.28 if side < 0 else .1, name='hand')
        for k in range(4):
            bx = hx_ - 4 + k * 2.6; a = math.radians(90 + side * (-28 + k * 16))
            tip = (bx + math.cos(a) * 12, hy_ + 3 + math.sin(a) * 13)
            taper(c, cr([(bx, hy_ + 3), (bx + math.cos(a) * 6 + side * 1.5, hy_ + 3 + math.sin(a) * 7), tip], 5), 3, 1.2, DS, lift=.25 if side < 0 else .08, name='finger', bulge=1.2)
            c.px(int(tip[0]), int(tip[1]), R['dfire'][3]); c.px(int(tip[0]), int(tip[1]) - 1, R['dfire'][2])
    c.inner_lines({('hood', 'collar'), ('collar', 'shoulder'), ('face', 'hood'), ('horn', 'collar'), ('finger', 'hand'), ('hand', 'finger')})
    solid = c.a & (c.part != 'fire')
    c.outline()
    rim = np.array((200, 50, 80))                                        # a dark crimson rim light from the ghostfire, as on the Yewen
    for y in range(H_):
        for x in range(2, W_ - 2):
            if c.a[y, x] and c.a[y, x + 1] and not c.a[y, x + 2] and c.part[y, x] in ('hood', 'collar', 'shoulder', 'horn', 'hand', 'finger'):
                c.rgb[y, x] = (c.rgb[y, x] * .45 + rim * .55).astype(np.uint8)
    texture(c, ['hood', 'collar', 'shoulder', 'hand', 'finger'], amt=.08, seed=44)
    speculars(c, ['hood', 'collar', 'shoulder', 'horn'], thr=.9, col=(150, 120, 190))
    # ---- compose: fog first, then the figure; below the shoulders the fog veils the figure again, thinning upward
    out = np.zeros((H_, W_, 4), np.uint8)
    fire = c.a & (c.part == 'fire')
    out[fire, :3] = c.rgb[fire]; out[fire, 3] = 255
    thin = fog & fire & (D < .5) & (bay < .5)                            # where the fog is thin the fire shows through it
    out[fog & ~thin, :3] = fogc[fog & ~thin]; out[fog, 3] = 255
    fig = c.a.copy() & (c.part != 'fire')
    veil = fog & fig & (c.part == 'shoulder') & (bay < np.clip((yy - 60) / 14, 0, 1))
    take = fig & ~veil
    out[take, :3] = c.rgb[take]; out[take, 3] = 255
    for sd in (-1, 1):                                                     # the horns' tips fray into smoke
        hm = (c.part == 'horn') & (np.abs(xx - 56) > 30) & (bay < .45)
        out[hm, 3] = 0
    # swallowed words: faint red sparks drifting in the fog
    ys, xs = np.nonzero(fog & ~fig & (D > .45))
    rs2 = np.random.RandomState(7 + f)
    for i in rs2.choice(len(ys), 16, replace=False):
        out[ys[i], xs[i], :3] = Rg[2] if i % 2 else Rg[1]
    return out

def ngoyman5(f):
    """Rüf Fütra Ngoymatulfe: the true form, a colossus of the forgetting whose stone body is splitting open,
    the words it swallowed breaking out of it in gold"""
    setsize(144, 208); c = Canvas()
    S_, Y_, E = R['stn'], R['yglow'], R['ember']
    bob = f
    # base: a mound of stone pierced with mouths, the colossus rooted in it
    mound = smooth_poly([(8, 206), (20, 176), (48, 164), (96, 164), (124, 176), (136, 206)], 5)
    blob(c, S_, lambda d: d.polygon(mound, fill=1), bulge=.9, lift=.12, name='mound')
    holes(c, 'mound', [(28, 194), (42, 182), (56, 196), (72, 178), (88, 194), (102, 182), (116, 196), (64, 190), (80, 200), (36, 202), (108, 202)], 3)
    # the torso: a long twisting trunk, split by cracks of gold
    trunk = smooth_poly([(44, 70 + bob), (100, 70 + bob), (96, 100), (86, 128), (92, 156), (100, 172), (44, 172), (52, 156), (58, 128), (48, 100)], 6)
    blob(c, S_, lambda d: d.polygon(trunk, fill=1), bulge=1.25, lift=.14, name='trunk')
    for k, y in enumerate(range(84, 168, 14)):                             # twisting bands of the trunk
        line(c, [(40, y + bob * (y < 100)), (72, y + 6 - (k % 2) * 3), (104, y)], S_[1], 'trunk')
        line(c, [(40, y - 1 + bob * (y < 100)), (72, y + 5 - (k % 2) * 3), (104, y - 1)], S_[6], 'trunk')
    goldc = [[(60, 76 + bob), (66, 92), (60, 110), (70, 128), (64, 150), (72, 168)], [(88, 78 + bob), (80, 96), (86, 114), (78, 134)], [(66, 92), (78, 96)], [(60, 110), (50, 116)], [(70, 128), (84, 132)]]
    for v in goldc:
        for (X, Y) in line(c, v, Y_[5], 'trunk'):
            for dx in (-1, 1):
                if c.part[Y, X + dx] == 'trunk': c.px(X + dx, Y, Y_[3])
    for (x, y) in [(66, 92), (64, 118), (78, 134), (84, 100)]: glow(c, x, y + (bob if y < 100 else 0), 3.2, Y_)
    # golden letters breaking free from the cracks and rising: the words remembered
    glyphs = ['ñ', 'ü', 'tr', 'ng', 'll', 'ch']
    rs = np.random.RandomState(11 + f)
    for k in range(10):
        x = rs.randint(24, 120); y = rs.randint(60, 160) - f * 3
        if c.a[y, x]: continue
        w = rs.randint(2, 4)
        for i in range(w): c.px(x + i, y, Y_[4]); c.part[y, x + i] = 'glyph'
        c.px(x + w // 2, y - 2, Y_[5]); c.px(x, y + 1, Y_[3]); c.px(x + w - 1, y - 1, Y_[3])
    # shoulders and arms raised high, fists clenched over its head
    for side in (-1, 1):
        lf = .16 if side < 0 else -.02
        blob(c, S_, lambda d, side=side: d.ellipse([72 + side * 30 - 16, 60 + bob, 72 + side * 30 + 16, 88 + bob], fill=1), bulge=1.3, lift=lf + .04, name='shoulder')
        taper(c, cr([(72 + side * 34, 72 + bob), (72 + side * 56, 50), (72 + side * 58, 24), (72 + side * 50, 10)], 8), 18, 13, S_, lift=lf, name='arm', bulge=1.25)
        blob(c, S_, lambda d, side=side: d.polygon(smooth_poly([(72 + side * 40, 2 - bob), (72 + side * 58, 0 - bob), (72 + side * 62, 14 - bob), (72 + side * 44, 18 - bob)], 4), fill=1), bulge=1.3, lift=lf + .06, name='fist')
        for k in range(3): c.px(72 + side * (44 + k * 5), 13 - bob, S_[1]); c.px(72 + side * (44 + k * 5), 3 - bob, S_[7])
        cracks(c, 'arm', [[(72 + side * 52, 56), (72 + side * 58, 40), (72 + side * 54, 28)]], S_)
        for (X, Y) in line(c, [(72 + side * 52, 56), (72 + side * 58, 40)], Y_[4], 'arm'): pass
        # rubble and dust falling from the raised fists
        for k in range(4): c.px(72 + side * (46 + k * 4), 22 + k * 7 + f * 2, S_[6]); c.part[22 + k * 7 + f * 2, 72 + side * (46 + k * 4)] = 'rubble'
    # the head: a round helmed dome, a single visor-slit of white-hot light, four horns
    for (a, L) in [(-120, 26), (-60, 26), (-155, 18), (-25, 18)]:
        r = math.radians(a)
        taper(c, cr([(72, 46 + bob), (72 + math.cos(r) * L * .6, 46 + bob + math.sin(r) * L * .6 - 3), (72 + math.cos(r) * L, 46 + bob + math.sin(r) * L)], 6), 6, 2, S_, lift=.2, name='horn', bulge=1.2)
    blob(c, S_, lambda d: d.ellipse([52, 32 + bob, 92, 72 + bob], fill=1), bulge=1.35, lift=.22, name='head')
    blob(c, R['void'], lambda d: d.polygon([(56, 48 + bob), (88, 48 + bob), (86, 60 + bob), (58, 60 + bob)], fill=1), bulge=.5, lift=0, name='visor')
    for x in range(60, 85): c.px(x, 53 + bob, Y_[5] if x % 3 else Y_[6]); c.px(x, 54 + bob, Y_[3])
    glow(c, 72, 54 + bob, 3.5, Y_)
    for k, x in enumerate(range(60, 86, 4)): tooth3(c, x, 60 + bob, 64 + bob + (k % 2), S_[3:])
    plate_lines(c, 'head', [((54, 44 + bob), (90, 44 + bob)), ((72, 34 + bob), (72, 47 + bob))], .55)
    rivets(c, [(58, 42 + bob), (66, 38 + bob), (78, 38 + bob), (86, 42 + bob)], S_)
    rubble(c, 16, (4, 80, 140, 168), S_, 35, f)
    texture(c, ['mound', 'trunk', 'arm', 'fist', 'shoulder', 'head', 'horn'], amt=.15, seed=45)
    occlude(c, ['head', 'shoulder'], ['trunk'], r=5, k=.5)
    occlude(c, ['trunk'], ['mound'], r=5, k=.5)
    speculars(c, ['head', 'trunk', 'arm', 'fist', 'shoulder', 'mound'], thr=.86)
    return finish(c, [('head', 'trunk'), ('head', 'shoulder'), ('visor', 'head'), ('shoulder', 'trunk'), ('arm', 'shoulder'), ('fist', 'arm'), ('trunk', 'mound'), ('horn', 'head')],
                  rim=(150, 200, 120), rimparts=('head', 'trunk', 'arm', 'shoulder', 'mound', 'fist'))

# =========================================================== the Millalobo: king of the sea in the Williche tradition of Chiloé,
# half man and half sea lion, gold (milla) in his hair, his crown and his heart; five forms.
# Painted to the Yewen's level: sculpted muscle masses, a hand-placed face (brow, sockets, cheekbones, nose, beard strands),
# wet speculars, a fur pelt with directional strokes, leathery flippers with digit ridges and nails, foam where he meets the sea.
R.update({k: [hx(c) for c in v] for k, v in {
    'mfur':  ['#0c0804', '#1c140a', '#2e2212', '#44321a', '#5c4422', '#78582c', '#967038', '#b48a48', '#d0a65e'],
    'mbel':  ['#2a2010', '#4a3a1e', '#6e5830', '#927848', '#b49a66', '#d4bc8a'],
    'mskin': ['#160a06', '#2c160c', '#462414', '#62341e', '#80462a', '#9e5a38', '#ba724a', '#d08c62', '#e8aa80'],
    'mhair': ['#040404', '#0c0a08', '#16120e', '#221c16', '#30281e', '#403528', '#56483a'],
    'mgold': ['#2a1a02', '#523608', '#7e5610', '#ac7c1a', '#d4a42c', '#f0c848', '#fce47e', '#fff8d0'],
    'gglow2':['#3a2602', '#7a5206', '#c08a10', '#f0c030', '#ffe890', '#ffffff'],
    'kbone': ['#2a2a24', '#4a4a40', '#6e6c5e', '#94927e', '#bab8a2', '#dcdac6', '#f6f4e6'],
    'mflip': ['#0e0a08', '#1e1712', '#30261d', '#463728', '#5e4a36', '#7a6248', '#98805e'],
    'kelp':  ['#06100a', '#0e2214', '#18361e', '#26502a', '#386c34', '#528a42'],
    'ruby':  ['#2a0408', '#5a0a12', '#901420', '#c82a34', '#f0645a', '#ffc0b0'],
    'teal':  ['#022020', '#064440', '#0c6c64', '#1aa08e', '#5cd6c0', '#d0fff4']}.items()})

def kaywater(c, f, y0=None):
    y0 = y0 if y0 is not None else yp.H - 18
    sea(c, y0, yp.H, 0, yp.W, f)
    ripples(c, yp.W // 2, y0 + 8, yp.W // 3, 3, f, R['water'][6], R['water'][1], 2)
def foam(c, y0, x0, x1, f, seed=3):
    """white water where his body breaks the surface"""
    rs = np.random.RandomState(seed + f)
    for x in range(max(0, int(x0)), min(yp.W, int(x1))):
        col = c.part[:, x]
        ys = [y for y in range(yp.H - 1) if col[y] not in ('water', '', 'foam', 'spark', 'mray') and c.a[y, x] and c.part[y + 1, x] == 'water' and y >= y0 - 14]
        for y in ys[-1:]:
            for dy in (0, 1):
                if rs.rand() < .8: c.px(x, y + dy, (236, 246, 244) if dy == 0 else R['water'][7]); c.part[y + dy, x] = 'foam'
            if rs.rand() < .25 and y + 2 < yp.H: c.px(x + (1 if rs.rand() < .5 else -1), y + 2, (250, 255, 255))

def mhair_back(c, x, y, s=1.0, hairflow=1, f=0):
    """the long wet hair, falling behind the shoulders in heavy ropes, with gold threads through it"""
    Hh = R['mhair']; S = lambda v: v * s
    for k in range(9):
        dx = (k - 4) * S(2.0)
        pts = [(x + dx * .5, y - S(5)), (x + dx * 1.3 + hairflow * S(1.5), y + S(7)), (x + dx * 1.7 + hairflow * S(3) + (k % 2) * S(1), y + S(16)), (x + dx * 1.8 + hairflow * S(4), y + S(22) + (k % 3) * S(2.5))]
        taper(c, pts, S(5.5), S(1.6), Hh, lift=-.12 + (k < 4) * .1, name='mhairb', bulge=1.1)
        hl = [(px_ - S(.8), py_) for (px_, py_) in pts[1:3]]
        line(c, hl, Hh[6] if k < 5 else Hh[4], 'mhairb')                  # the wet sheen along each rope
    for k in (2, 6):                                                        # gold (milla) threaded through the hair
        dx = (k - 4) * S(2.0)
        line(c, [(x + dx * 1.3 + hairflow * S(1.5), y + S(7)), (x + dx * 1.7 + hairflow * S(3), y + S(16))], R['mgold'][5], 'mhairb')
        c.px(int(x + dx * 1.7 + hairflow * S(3)), int(y + S(16)), R['mgold'][7])

def mface_relief(c, x, y, s, angry=True):
    """the face shaded from a relief map, the way the fillantü's head is: an egg for the skull, then brow ridge, sockets,
    nose, cheekbones, hollows, folds, lips and chin added as soft bumps and dents, lit from the upper left with a fine ramp"""
    Sk = R['mskin']; u = s
    Y_, X_ = np.mgrid[0:yp.H, 0:yp.W].astype(float)
    DX = (X_ - x) / u; DY = (Y_ - y) / u
    def g(cx0, cy0, sx, sy, amp): return amp * u * np.exp(-(((DX - cx0) / sx) ** 2 + ((DY - cy0) / sy) ** 2))
    def gl(x0, y0, x1, y1, w, amp):
        L = max(.01, math.hypot(x1 - x0, y1 - y0)); ux, uy = (x1 - x0) / L, (y1 - y0) / L
        t = np.clip(((DX - x0) * ux + (DY - y0) * uy) / L, 0, 1)
        return amp * u * np.exp(-((DX - (x0 + ux * L * t)) ** 2 + (DY - (y0 + uy * L * t)) ** 2) / w ** 2)
    jaw = np.clip((DY - 4.5) / 6, 0, 1)
    rx = 8.3 - jaw ** 1.4 * 4.2                                            # the jaw narrows evenly to a broad chin
    e = 1 - (DX / rx) ** 2 - ((DY - 1.2) / 10.2) ** 2
    m = e > 0
    h = np.sqrt(np.clip(e, 0, 1)) * 5.6 * u
    h += gl(-6.8, -2.7, 6.8, -2.7, .8, 1.0)                                # brow ridge
    if angry: h += g(0, -3.2, 1.2, .9, .5)                                 # knotted between the brows
    h += gl(0, -2.2, 0, 2.2, .75, .8) + g(0, 2.5, .95, .8, .6)             # bridge and tip of the nose
    h += g(-1.45, 3.0, .7, .55, .35) + g(1.45, 3.0, .7, .55, .35)          # the wings of the nostrils
    h -= g(-3.6, -.5, 2.1, 1.5, 1.7) + g(3.6, -.5, 2.1, 1.5, 1.7)          # eye sockets
    h += g(-3.6, -.4, 1.4, .8, .5) + g(3.6, -.4, 1.4, .8, .5)              # the eyeballs inside them
    h += g(-5.4, 2.2, 1.9, 1.0, .9) + g(5.4, 2.2, 1.9, 1.0, .9)            # cheekbones
    h -= g(-5.0, 5.4, 1.6, 1.6, .8) + g(5.0, 5.4, 1.6, 1.6, .8)            # the hollows under them
    h -= g(-7.5, -3.4, 1.2, 2.0, .45) + g(7.5, -3.4, 1.2, 2.0, .45)        # temples
    h -= gl(-1.9, 3.3, -3.7, 6.3, .45, .55) + gl(1.9, 3.3, 3.7, 6.3, .45, .55)   # folds from nose to mouth
    h += gl(-2.4, 5.9, 2.4, 5.9, .55, .35) - gl(-2.6, 5.3, 2.6, 5.3, .3, .3)     # the lower lip, the line of the mouth
    h += g(0, 4.4, 1.6, .5, .2)                                            # the upper lip
    h += g(0, 9.0, 2.4, 1.3, .55)                                          # chin
    if angry: h -= gl(-2.6, -5.1, 2.6, -5.1, .3, .25) + gl(-2.4, -6.1, 2.4, -6.1, .3, .2)   # forehead furrows
    gx = np.roll(h, -1, 1) - np.roll(h, 1, 1); gy = np.roll(h, -1, 0) - np.roll(h, 1, 0)
    nz = 2.0; nl = np.sqrt(gx ** 2 + gy ** 2 + nz ** 2)
    sh = (-gx * -.55 - gy * -.62 + nz * .56) / nl
    ys, xs = np.nonzero(m)
    v = sh[ys, xs] * 1.25 + .06 - DX[ys, xs] / 16 * .14 - np.clip(DY[ys, xs] - 6, 0, 9) * .015
    idx = np.clip(np.floor(v * (len(Sk) - 1) + (yp.BAYER[ys % 4, xs % 4] - .5) * .7).astype(int), 0, len(Sk) - 1)
    c.rgb[ys, xs] = np.array(Sk)[idx]; c.a[ys, xs] = True; c.part[ys, xs] = 'mface'
    return m

def mhead(c, x, y, s=1.0, f=0, angry=True, crown=True, hairflow=1):
    """the head seen from the front, painted large: wet hair, heavy brow and brows, lidded gold eyes, broad nose, lips,
    sea-lion whiskers and fangs, ears with gold hoops, droplets running down, a beard to the collarbones, the gold crown"""
    Hh, Sk, G = R['mhair'], R['mskin'], R['mgold']
    s = s * 1.32
    S = lambda v: v * s
    P = lambda dx, dy: (int(round(x + dx * s)), int(round(y + dy * s)))
    def px(dx, dy, col):
        X, Y = P(dx, dy); c.px(X, Y, col)
    def dot(dx, dy, r, col, part=None):
        X, Y = P(dx, dy); rr = max(.6, r * s)
        for yy in range(int(Y - rr), int(Y + rr) + 1):
            for xx in range(int(X - rr), int(X + rr) + 1):
                if (xx - X) ** 2 + (yy - Y) ** 2 <= rr * rr:
                    c.px(xx, yy, col)
                    if part and 0 <= yy < yp.H and 0 <= xx < yp.W: c.part[yy, xx] = part
    blob(c, Hh, lambda d: d.polygon(smooth_poly([(x - S(9), y - S(1)), (x - S(7.4), y - S(10.6)), (x + S(7.4), y - S(10.6)), (x + S(9), y - S(1)), (x + S(9.6), y + S(5)), (x - S(9.6), y + S(5))], 4), fill=1), bulge=1.1, lift=.05, name='mhair')
    # ears, half hidden in the hair, with gold hoops
    for side in (-1, 1):
        blob(c, Sk, lambda d, side=side: d.ellipse([*P(side * 8.6 - 1.6, -1.2), *P(side * 8.6 + 1.6, 3.4)], fill=1), bulge=1.0, lift=.15 if side < 0 else -.05, name='mear')
        px(side * 8.6, .6, Sk[2]); px(side * 8.6, 1.4, Sk[1])
        X, Y = P(side * 8.8, 4.2)
        for a in range(0, 360, 30):
            c.px(int(X + math.cos(math.radians(a)) * S(1.1)), int(Y + math.sin(math.radians(a)) * S(1.1)), G[6] if a < 180 else G[3])
    mface_relief(c, x, y, s, angry)
    fm = c.part == 'mface'
    # warm flush over the cheeks and the nose, a cool shadow down the far side
    for (cx_, cy_, r, k, col) in [(-4.6, 3.4, 2.6, .25, (200, 96, 70)), (4.6, 3.4, 2.4, .2, (170, 80, 60)), (0, 2.6, 1.6, .18, (210, 110, 80)), (6.4, 2, 3, .22, (40, 30, 50))]:
        X, Y = P(cx_, cy_); rr = S(r)
        yy, xx = np.mgrid[0:yp.H, 0:yp.W]; m = fm & (((xx - X) ** 2 + (yy - Y) ** 2) < rr * rr)
        c.rgb[m] = np.clip(c.rgb[m] * (1 - k) + np.array(col) * k, 0, 255).astype(np.uint8)
    # hair parted over the brow: wet locks across the forehead, a strand falling over the face
    for side in (-1, 1):
        taper(c, [(x + side * S(4.4), y - S(9.4)), (x + side * S(7), y - S(7.4)), (x + side * S(8.4), y - S(2.4))], S(2.6), S(1.2), Hh, lift=.08 if side < 0 else -.05, name='mhair', bulge=1.0)
    for side in (-1, 1): line(c, [P(side * 4.8, -9.2), P(side * 7, -7.4), P(side * 8, -3.4)], Hh[6], 'mhair')
    # forehead: the brow ridge, furrows, the heavy brows
    if angry:
        for dy in (-4.6, -5.6): line(c, [P(-2.8, dy), P(-.6, dy + .5), P(1.4, dy)], Sk[3], 'mface')
        line(c, [P(-.4, -4.2), P(-.2, -2.8)], Sk[2], 'mface'); line(c, [P(.6, -4.2), P(.5, -2.8)], Sk[3], 'mface')
    for side in (-1, 1):
        tilt = (.9 if angry else -.3)
        bpts = [(x + side * S(1.1), y + S(-3.0 + tilt * .9)), (x + side * S(3.8), y + S(-3.7 + tilt * .35)), (x + side * S(6.8), y + S(-3.2))]
        taper(c, bpts, S(1.5), S(.7), R['mhair'], lift=.15 if side < 0 else 0, name='mbrow', bulge=1.0)   # each brow, thick at the nose
        line(c, [(px_, py_ - S(.45)) for px_, py_ in bpts], R['mhair'][6] if side < 0 else R['mhair'][4], 'mbrow')
        line(c, [P(side * 1.4, -2.3 + tilt * .7), P(side * 6.6, -2.6)], Sk[1], 'mface')   # the shadow under the ridge
    # the eyes: socket, upper lid, iris ring, slit pupil, two catchlights, lower lid, the lines at the corners
    for side in (-1, 1):
        ex, ey = x + side * S(3.6), y - S(.4)
        for yy in range(int(ey - S(1.5)), int(ey + S(1.4)) + 1):
            for xx in range(int(ex - S(2.6)), int(ex + S(2.6)) + 1):
                if ((xx - ex) / S(2.6)) ** 2 + ((yy - ey) / S(1.5)) ** 2 <= 1: c.px(xx, yy, Sk[1] if yy < ey else Sk[2])
        rw, rh = S(1.7), S(.95)
        for yy in range(int(ey - rh) - 1, int(ey + rh) + 2):
            for xx in range(int(ex - rw) - 1, int(ex + rw) + 2):
                d = ((xx - ex) / rw) ** 2 + ((yy - ey) / rh) ** 2
                if d <= 1:
                    ring = d > .55
                    c.px(xx, yy, R['gglow2'][2] if ring else (R['gglow2'][4] if yy < ey else R['gglow2'][3]))
        for yy in range(int(ey - rh), int(ey + rh) + 1): c.px(int(ex), yy, (18, 6, 2))       # slit pupil
        c.px(int(ex - S(.7)), int(ey - rh * .5), (255, 255, 255)); c.px(int(ex + S(.6)), int(ey + rh * .4), R['gglow2'][4])
        lid = int(ey - rh) - (0 if angry else 1)
        for xx in range(int(ex - rw) - 1, int(ex + rw) + 2):                # heavy upper lid, slanting down to the nose when angry
            yl = lid + (int((xx - ex) * -side * .25) if angry else 0)
            c.px(xx, yl, Sk[0]); c.px(xx, yl - 1, Sk[3])
        for xx in range(int(ex - rw), int(ex + rw) + 1): c.px(xx, int(ey + rh) + 1, Sk[5 if side < 0 else 4])
        for k in range(3): c.px(int(ex + side * (rw + 2 + k * .6)), int(ey - 1 + k), Sk[2])   # crow's feet
        for k in range(2): c.px(int(ex + side * (rw + 1.6 + k)), int(ey + rh + 1 + k), Sk[3])
    # cheekbones and hollows
    for (dx, dy, col) in [(-6.2, 2, 8), (-5.6, 2.5, 8), (-6.6, 2.9, 7), (-4.8, 3.1, 7), (-5.2, 2.2, 7), (5.6, 2.1, 6), (6.2, 2.7, 5)]: px(dx, dy, Sk[col])
    for k in range(4): px(-5.9 + k * .2, 4.4 + k * .45, Sk[2]); px(5.7 - k * .2, 4.4 + k * .45, Sk[1])
    # the nose: broad, lit down the left, nostril wings, a glint on the tip
    for k in range(int(S(3.6))):
        yy = y - S(1.6) + k
        c.px(int(x - S(.7)), int(yy), Sk[8] if k < S(2.4) else Sk[7]); c.px(int(x + S(.9)), int(yy), Sk[3]); c.px(int(x + S(1.3)), int(yy), Sk[4])
    for side in (-1, 1):
        px(side * 1.3, 3.1, Sk[0]); px(side * 1.6, 3.1, Sk[1])
    dot(-.2, 2.2, .45, Sk[8]); px(0, 3.4, Sk[2])
    for side in (-1, 1):                                                   # the folds from nose to mouth
        line(c, [P(side * 2.6, 2.6), P(side * 3.5, 4.6), P(side * 3.7, 6.2)], Sk[2 if side < 0 else 1], 'mface')
        line(c, [P(side * 2.9 - .5, 2.6), P(side * 3.8 - .5, 4.6)], Sk[6 if side < 0 else 4], 'mface')
    # lips and mouth
    if angry:
        mx0, mx1 = P(-2.6, 5.4)[0], P(2.6, 5.4)[0]; my = P(0, 5.4)[1]
        for xx in range(mx0, mx1 + 1):
            c.px(xx, my - 1, Sk[2]); c.px(xx, my, (26, 6, 4)); c.px(xx, my + 1, (60, 14, 10)); c.px(xx, my + 2, Sk[6] if xx < (mx0 + mx1) // 2 else Sk[4])
        for xx in range(mx0 + 1, mx1, 2): c.px(xx, my, (238, 230, 206))
        for xx in (mx0 + 1, mx1 - 1):                                      # sea-lion fangs
            c.px(xx, my + 1, (248, 244, 228)); c.px(xx, my + 2, (220, 212, 190))
    else:
        mx0, mx1 = P(-2.2, 5.4)[0], P(2.2, 5.4)[0]; my = P(0, 5.4)[1]
        for xx in range(mx0, mx1 + 1): c.px(xx, my - (1 if xx in (mx0, mx1) else 0), Sk[1])
        for xx in range(mx0 + 1, mx1): c.px(xx, my + 1, Sk[6] if xx < (mx0 + mx1) // 2 else Sk[5])
        c.px((mx0 + mx1) // 2, my + 1, Sk[8])
    # moustache sweeping down into the beard
    for side in (-1, 1):
        taper(c, [(x + side * S(.5), y + S(4.0)), (x + side * S(2.4), y + S(4.4)), (x + side * S(3.4), y + S(6.6))], S(1.6), S(.8), Hh, lift=.12 if side < 0 else -.04, name='mbeard', bulge=1.0)
        line(c, [P(side * 1, 4.1), P(side * 2.4, 4.6), P(side * 3.2, 6.2)], Hh[6] if side < 0 else Hh[4], 'mbeard')
    # the beard: below the lip, combed into strands with gold beads, a braided tip in a gold ring
    blob(c, Hh, lambda d: d.polygon(smooth_poly([P(-8.3, .6), P(-7.6, 5), P(-4.8, 7.4), P(-2.2, 7.0), P(0, 7.3), P(2.2, 7.0), P(4.8, 7.4), P(7.6, 5), P(8.3, .6), P(7.8, 9.4), P(3.4, 12.8), P(0, 14.8), P(-3.4, 12.8), P(-7.8, 9.4)], 4), fill=1), bulge=1.05, lift=.1, name='mbeard')
    for k in range(-5, 6):
        line(c, [P(k * 1.3, 7.8), P(k * 1.05, 10.4), P(k * .55, 13)], Hh[6] if k % 2 else Hh[1], 'mbeard')
    for (dx, dy) in [(-3.4, 9.6), (3, 10.4), (0, 8.6)]: dot(dx, dy, .45, G[6], 'mbead'); px(dx + .3, dy + .3, G[2])
    X, Y = P(0, 13.6); c.rect(X - int(S(.9)), Y, max(2, int(S(1.8))), max(2, int(S(1))), G[5]); c.px(X - int(S(.9)), Y, G[7])
    # droplets running down from the wet hair, glints on the brow and the nose
    for (dx, dy, n) in [(-5, -5.6, 3), (3.4, -5.4, 2), (-6.8, -1, 3)]:
        for j in range(n): px(dx, dy + j * .7, Sk[8] if j == n - 1 else Sk[6])
    for (dx, dy) in [(-3.2, -6), (-2.6, -5.6), (2.8, -5.2)]: px(dx, dy, Sk[8])
    if crown:                                                              # crown: a filigree band, five points, set with rubies and teal stones
        blob(c, G, lambda d: d.polygon([(x - S(8.4), y - S(2.4) - S(6)), (x + S(8.4), y - S(2.4) - S(6)), (x + S(8.8), y - S(2.4) - S(9.6)), (x - S(8.8), y - S(2.4) - S(9.6))], fill=1), bulge=1.1, lift=.3, name='mcrown')
        line(c, [P(-8, -11.6), P(8, -11.6)], G[7], 'mcrown'); line(c, [P(-8, -8.8), P(8, -8.8)], G[1], 'mcrown')
        for k in range(5):
            px_ = x - S(8) + k * S(4)
            hh = S(7) if k == 2 else S(4.6) if k in (1, 3) else S(3.6)
            blob(c, G, lambda d, px_=px_, hh=hh: d.polygon([(px_ - S(1.8), y - S(2.4) - S(9)), (px_ + S(1.8), y - S(2.4) - S(9)), (px_ + S(.3), y - S(2.4) - S(9) - hh), (px_, y - S(2.4) - S(9.4) - hh), (px_ - S(.3), y - S(2.4) - S(9) - hh)], fill=1), bulge=1.15, lift=.3, name='mcrown')
            X, Y = int(px_), int(y - S(2.4) - S(9.4) - hh); c.px(X, Y, G[7]); c.px(X, Y + 1, G[6])
        for k, gx in enumerate([-6, -3, 0, 3, 6]):                          # the stones in the band
            gr = R['ruby'] if k % 2 == 0 else R['teal']
            X, Y = P(gx, -10.2); r = max(1, int(S(.9)))
            for yy in range(Y - r, Y + r + 1):
                for xx in range(X - r, X + r + 1):
                    if (xx - X) ** 2 + (yy - Y) ** 2 <= r * r + .5: c.px(xx, yy, gr[2 + (yy < Y) + (xx < X)]); c.part[min(yp.H - 1, max(0, yy)), min(yp.W - 1, max(0, xx))] = 'mgem'
            c.px(X - r + 1, Y - r + 1, gr[5])
        glow(c, x, y - S(2.4) - S(14.5), max(1.0, S(1.2)), R['gglow2'])

def _mus(c, base, box, lift, name, ramp=None):
    m = c.mask(lambda d: d.ellipse(box, fill=1)) & base
    c.shade(m, ramp or R['mskin'][2:], bulge=.7, lift=lift, name=name); return m
def mfist(c, x, y, s, side, lift):
    """a big closed hand: a rounded block, four knuckles catching the light, the fingers creased, a thumb over them"""
    Sk = R['mskin']; S = lambda v: v * s
    blob(c, Sk, lambda d: d.ellipse([x - S(4.2), y - S(3.8), x + S(4.2), y + S(4)], fill=1), bulge=1.25, lift=lift, name='mfist')
    for k in range(4):
        kx = int(x - S(2.6) + k * S(1.75)); ky = int(y - S(3))
        c.px(kx, ky, Sk[7 if side < 0 else 6]); c.px(kx, ky + 1, Sk[5])
        if k: 
            for yy in range(int(y - S(2)), int(y + S(2.8))): c.px(int(x - S(3.4) + k * S(1.75)), yy, Sk[2])
    for xx in range(int(x - S(2.6)), int(x + S(1))): c.px(xx, int(y + S(.4)), Sk[6] if side < 0 else Sk[5])   # thumb over the fingers
    c.px(int(x + S(1)), int(y + S(.4)), Sk[2])
def mhand_open(c, x, y, s, lift):
    """an open hand reaching forward: palm, four spread fingers with dark nails, the thumb below"""
    Sk = R['mskin']; S = lambda v: v * s
    blob(c, Sk, lambda d: d.ellipse([x - S(3.2), y - S(3), x + S(3.2), y + S(3)], fill=1), bulge=1.2, lift=lift, name='mfist')
    for k, a in enumerate((-150, -168, 172, 156)):
        r = math.radians(a); L = S(5.4 - abs(k - 1.5) * .6)
        p0 = (x + math.cos(r) * S(2.4), y + math.sin(r) * S(2.4)); p1 = (x + math.cos(r) * (S(2.4) + L * .55), y + math.sin(r) * (S(2.4) + L * .55) + S(.6)); p2 = (x + math.cos(r) * (S(2.4) + L), y + math.sin(r) * (S(2.4) + L) + S(1.4))
        taper(c, [p0, p1, p2], S(1.8), S(1.2), Sk, lift=lift + .05, name='mfist', bulge=1.1)
        c.px(int(p2[0]), int(p2[1]), R['kbone'][2]); c.px(int(p1[0]), int(p1[1]) - 1, Sk[7])
    taper(c, [(x - S(1), y + S(2)), (x - S(3.4), y + S(4)), (x - S(5), y + S(4.4))], S(2), S(1.3), Sk, lift=lift, name='mfist', bulge=1.1)
def relief_light(c, m, h, ramp, name, DX, lift=0.0, tilt=16):
    gx = np.roll(h, -1, 1) - np.roll(h, 1, 1); gy = np.roll(h, -1, 0) - np.roll(h, 1, 0)
    nz = 2.0; nl = np.sqrt(gx ** 2 + gy ** 2 + nz ** 2)
    sh = (-gx * -.55 - gy * -.62 + nz * .56) / nl
    ys, xs = np.nonzero(m)
    v = sh[ys, xs] * 1.25 + lift - DX[ys, xs] / tilt * .14
    idx = np.clip(np.floor(v * (len(ramp) - 1) + (yp.BAYER[ys % 4, xs % 4] - .5) * .7).astype(int), 0, len(ramp) - 1)
    c.rgb[ys, xs] = np.array(ramp)[idx]; c.a[ys, xs] = True; c.part[ys, xs] = name

def mtorso_relief(c, x, y, s, arms='wide'):
    """the chest modelled like the fillantü's head: a relief of pecs, deltoids, the sternum, the abdominal blocks,
    obliques, serratus and collarbones over a broad dome, lit from the upper left with a fine ramp"""
    u = s
    Y_, X_ = np.mgrid[0:yp.H, 0:yp.W].astype(float)
    DX = (X_ - x) / u; DY = (Y_ - y) / u
    def g(cx0, cy0, sx, sy, amp): return amp * u * np.exp(-(((DX - cx0) / sx) ** 2 + ((DY - cy0) / sy) ** 2))
    def gl(x0, y0, x1, y1, w, amp):
        L = max(.01, math.hypot(x1 - x0, y1 - y0)); ux, uy = (x1 - x0) / L, (y1 - y0) / L
        t = np.clip(((DX - x0) * ux + (DY - y0) * uy) / L, 0, 1)
        return amp * u * np.exp(-((DX - (x0 + ux * L * t)) ** 2 + (DY - (y0 + uy * L * t)) ** 2) / w ** 2)
    P = lambda dx, dy: (x + dx * s, y + dy * s)
    m = c.mask(lambda d: [d.polygon(smooth_poly([P(-12, 0), P(12, 0), P(13, 8), P(10, 16), P(8.5, 24), P(-8.5, 24), P(-10, 16), P(-13, 8)], 5), fill=1),
                          d.ellipse([*P(-15.2, -1.4), *P(-7.4, 8.2)], fill=1), d.ellipse([*P(7.4, -1.4), *P(15.2, 8.2)], fill=1)])
    e = 1 - (DX / 15) ** 2 - ((DY - 10) / 18) ** 2
    h = np.sqrt(np.clip(e, 0, 1)) * 4.2 * u
    for sd in (-1, 1):
        h += g(sd * 5.2, 5.4, 4.6, 3.3, 1.7)                               # pecs
        h -= gl(sd * 1.2, 10.4, sd * 9.8, 8.6, .55, .7)                    # the crease under them
        h += g(sd * 11.4, 3.2, 2.9, 3.4, 2.0)                              # deltoids
        h -= gl(sd * 8.6, 1.2, sd * 9.4, 8.6, .5, .5)                      # between deltoid and pec
        h += gl(sd * 1.6, 1.4, sd * 10.2, .6, .45, .5)                     # collarbones
        for k in range(3): h += g(sd * (9.8 - k * .3), 9.4 + k * 2.2, .9, .6, .4)   # serratus
        h += g(sd * 8.4, 17, 1.7, 4.2, .9)                                 # obliques
        for yy in (12.8, 16.4, 20.0): h += g(sd * 2.4, yy, 1.9, 1.45, .95) # the abdominal blocks
    h -= gl(0, 1.6, 0, 11, .5, .55) + gl(0, 11, 0, 23.5, .4, .45)          # sternum and the line down the belly
    h -= g(0, .6, .9, .7, .6) + g(0, 22.6, .5, .45, .7)                    # the pit of the throat, the navel
    relief_light(c, m, h, R['mskin'], 'mtorso', DX, lift=.08, tilt=26)
    return m

def mtorso(c, x, y, s=1.0, arms='wide', f=0, bone=False, heart=False, glowfist=False):
    """a man's chest and arms rising from the sea lion's shoulders; y is the top of the chest"""
    Sk, G = R['mskin'], R['mgold']; S = lambda v: v * s
    P = lambda dx, dy: (x + dx * s, y + dy * s)
    # arms first where they go behind (raised arms sit behind the deltoids)
    def arm(side):
        lf = .2 if side < 0 else -.04
        if arms == 'wide':   up = [P(side * 10, 3), P(side * 18, 7), P(side * 22, 6)]; fo = [P(side * 22, 6), P(side * 26, 1 - f * 2), P(side * 28, -3 - f * 2)]
        elif arms == 'up':   up = [P(side * 10, 3), P(side * 15, -3), P(side * 17, -8)]; fo = [P(side * 17, -8), P(side * 19, -14), P(side * 19, -19 - f * 2)]
        elif arms == 'reach' and side < 0: up = [P(-10, 3), P(-17, 7), P(-22, 7)]; fo = [P(-22, 7), P(-28, 6), P(-33, 4)]
        elif arms == 'reach': up = [P(10, 3), P(16, 9), P(19, 14)]; fo = [P(19, 14), P(23, 19), P(26, 22)]
        else:                up = [P(side * 10, 3), P(side * 14, 11), P(side * 15, 15)]; fo = [P(side * 15, 15), P(side * 14, 20), P(side * 12, 24)]
        taper(c, cr(up, 6), S(8), S(6.4), Sk, lift=lf, name='marm', bulge=1.3)
        mb = c.part == 'marm'
        bx, by = up[1]
        _mus(c, mb, [bx - S(3.4), by - S(3), bx + S(3.4), by + S(3)], lf + .12, 'marm')     # biceps
        taper(c, cr(fo, 6), S(6.6), S(5), Sk, lift=lf - .02, name='mfore', bulge=1.25)
        (ax, ay), (bx2, by2) = fo[0], fo[-1]
        for t in (.35, .55, .75):                                         # tendons along the forearm
            c.px(int(ax + (bx2 - ax) * t - side * S(1)), int(ay + (by2 - ay) * t), Sk[7 if side < 0 else 5])
        # a gold band with a stone on the forearm
        cx_, cy_ = ax + (bx2 - ax) * .55, ay + (by2 - ay) * .55
        blob(c, G, lambda d: d.ellipse([cx_ - S(3.6), cy_ - S(2), cx_ + S(3.6), cy_ + S(2)], fill=1), bulge=1.1, lift=.25 if side < 0 else .05, name='mband')
        c.px(int(cx_), int(cy_), R['teal'][4]); c.px(int(cx_) - 1, int(cy_) - 1, R['teal'][5])
        # veins standing out along the forearm and over the biceps
        for (t0, t1, o) in [(.15, .5, .6), (.45, .85, -.4)]:
            a0 = (ax + (bx2 - ax) * t0, ay + (by2 - ay) * t0); a1 = (ax + (bx2 - ax) * t1, ay + (by2 - ay) * t1)
            nx_, ny_ = -(by2 - ay), (bx2 - ax); L_ = max(.01, math.hypot(nx_, ny_)); nx_, ny_ = nx_ / L_ * S(o), ny_ / L_ * S(o)
            mid = ((a0[0] + a1[0]) / 2 + nx_ + S(.5), (a0[1] + a1[1]) / 2 + ny_)
            line(c, [(a0[0] + nx_, a0[1] + ny_), mid, (a1[0] + nx_, a1[1] + ny_)], Sk[3], 'mfore')
            line(c, [(a0[0] + nx_ - 1, a0[1] + ny_ - 1), (mid[0] - 1, mid[1] - 1)], Sk[7] if side < 0 else Sk[5], 'mfore')
        line(c, [(up[0][0] + side * S(1), up[0][1] + S(2)), (bx - side * S(1), by + S(1.6)), (up[2][0], up[2][1] + S(1.4))], Sk[3], 'marm')
        if glowfist: mfistglow(c, bx2, by2, s, f, behind=True)
        if arms == 'reach' and side < 0: mhand_open(c, bx2, by2, s, lf + .04)
        else: mfist(c, bx2, by2, s, side, lf + .04)
        if glowfist: mfistglow(c, bx2, by2, s, f, behind=False)
        for k in range(3):                                                 # sea water dripping off the arm
            X, Y = int(ax + (bx2 - ax) * (.3 + k * .25)), int(max(ay, by2) + S(3.4) + k * S(1.4) + f * S(1.2))
            if 0 <= Y < yp.H and 0 <= X < yp.W and not c.a[Y, X]: c.px(X, Y, R['water'][7]); c.part[Y, X] = 'spark'
    for side in (-1, 1): arm(side)
    # neck and trapezius
    blob(c, Sk, lambda d: d.polygon([P(-4, -6), P(4, -6), P(5.5, 1), P(-5.5, 1)], fill=1), bulge=1.1, lift=.06, name='mneck')
    blob(c, Sk, lambda d: d.polygon(smooth_poly([P(-5, -2), P(5, -2), P(12, 2), P(10, 4), P(-10, 4), P(-12, 2)], 3), fill=1), bulge=1.0, lift=.08, name='mtrap')
    # the torso: broad shoulders, a deep chest, tapering into the waist where the fur begins
    m_t = mtorso_relief(c, x, y, s, arms)
    for side in (-1, 1):                                                   # obliques and the serratus at the flanks
        for k in range(3):
            X, Y = P(side * (9.6 - k * .4), 9 + k * 2.2)
            for j in range(max(2, int(S(2)))): c.px(int(X - side * j), int(Y + j // 2), Sk[2 if side < 0 else 1])
    for (dx, dy) in [(-7, 3.4), (-6.3, 3), (-8, 4.2), (-13, 1.6), (-12.4, 1.2), (-3.4, 12.2), (-3, 15.8)]:    # wet glints
        X, Y = P(dx, dy); c.px(int(X), int(Y), Sk[8])
    X, Y = P(0, 22.6); c.px(int(X), int(Y), Sk[1]); c.px(int(X), int(Y) + 1, Sk[3])                   # navel
    for (a, b) in [((8.4, 3.2), (11.4, 7.4)), ((-4.8, 14.6), (-1.6, 16.6))]:                      # old scars from sea battles
        line(c, [P(*a), P(*b)], Sk[6], ('mpec', 'mabs', 'mtorso', 'mdelt')); line(c, [P(a[0] + .4, a[1] + .5), P(b[0] + .4, b[1] + .5)], Sk[2], ('mpec', 'mabs', 'mtorso', 'mdelt'))
    if not bone:                                                           # a string of shells across the collarbones
        for k in range(9):
            t = k / 8; X, Y = P(-8 + t * 16, 1.4 + math.sin(t * math.pi) * 3.4)
            sh_ = [(244, 232, 214), (236, 196, 184), (220, 214, 200)][k % 3]
            c.px(int(X), int(Y), sh_); c.px(int(X) + 1, int(Y), sh_); c.px(int(X), int(Y) + 1, (150, 120, 104)); c.part[int(Y), int(X)] = 'mshell'
    if not bone:                                                           # a gold torque with a sun disc
        blob(c, G, lambda d: d.arc([*P(-6.5, -3.5), *P(6.5, 5)], 20, 160, fill=1, width=max(3, int(S(2)))), bulge=1.2, lift=.55, name='mtorque')
        if not heart:
            X, Y = P(0, 5.4); r = max(2, int(S(1.8)))
            blob(c, G, lambda d: d.ellipse([X - r, Y - r, X + r, Y + r], fill=1), bulge=1.2, lift=.3, name='mtorque')
            c.px(int(X), int(Y), R['ruby'][4]); c.px(int(X) - 1, int(Y) - 1, G[7])
    if bone:                                                               # a breastplate of whale ribs lashed with kelp, a vertebra at its heart
        for k in range(6):
            yy = 3 + k * 3.4
            w0 = 11.5 - abs(k - 2) * .8
            taper(c, cr([P(-w0, yy + 1.6), P(-w0 * .45, yy - .4), P(0, yy - 1), P(w0 * .45, yy - .4), P(w0, yy + 1.6)], 5), S(2.6), S(1.8), R['kbone'], lift=.28, name='mbone', bulge=1.25)
        blob(c, R['kbone'], lambda d: d.rounded_rectangle([*P(-2, 1), *P(2, 22)], max(1, int(S(1))), fill=1), bulge=1.2, lift=.2, name='mbone')
        for k in range(6): X, Y = P(0, 3 + k * 3.4); c.px(int(X), int(Y), R['kbone'][1]); c.px(int(X) - 1, int(Y) - 1, R['kbone'][6])
        for side in (-1, 1):                                               # kelp cords crossing the ribs and over the shoulders
            taper(c, cr([P(side * 12, -1), P(side * 7, 8), P(side * 3, 16), P(side * 6, 23)], 5), S(1.8), S(1.2), R['kelp'], lift=.1 if side < 0 else -.05, name='mkelp', bulge=1.0)
            for k in range(4):
                X, Y = P(side * (9 - k * 1.7), 3 + k * 4.6); c.px(int(X), int(Y), R['kelp'][5]); c.px(int(X) + 1, int(Y) + 1, R['kelp'][1])
        X, Y = P(0, 9); r = max(2, int(S(2.6)))
        blob(c, R['kbone'], lambda d: d.ellipse([X - r, Y - r, X + r, Y + r], fill=1), bulge=1.25, lift=.32, name='mbone')
        c.px(int(X), int(Y), R['kbone'][0]); c.px(int(X) - 1, int(Y) - 1, R['kbone'][6])
    # where the man ends and the sea lion begins: a fringe of fur tufts round the waist
    for k in range(-10, 11):
        bx_, by_ = P(k * .9, 23.4 + (k % 2) * .6)
        taper(c, [(bx_, by_ + S(1.6)), (bx_ + S(.4), by_ - S(1.8) - (k % 3) * S(.6))], S(2), S(.6), R['mfur'][2:], lift=.1 - k * .01, name='mtuft', bulge=1.0)

def mfurstrokes(c, parts, P, seed=7):
    """short strokes laid along the body, dark in the hollows and gold where the fur catches the light"""
    rs = np.random.RandomState(seed); m = np.isin(c.part, parts) & c.a
    ys, xs = np.nonzero(m); Fu = R['mfur']
    if not len(ys): return
    Pa = np.array(P)
    for i in rs.permutation(len(ys))[: len(ys) // 9]:
        y, x = ys[i], xs[i]
        j = int(np.argmin(((Pa - [x, y]) ** 2).sum(1))); j2 = min(len(Pa) - 1, j + 1); j1 = max(0, j2 - 1)
        dx, dy = Pa[j2] - Pa[j1]; L = max(.01, math.hypot(dx, dy)); dx, dy = dx / L, dy / L
        lum = c.rgb[y, x].mean()
        col = Fu[7] if lum > 120 else Fu[5] if lum > 80 else Fu[1]
        for t in range(3):
            X, Y = int(round(x + dx * t)), int(round(y + dy * t))
            if 0 <= X < yp.W and 0 <= Y < yp.H and m[Y, X]: c.rgb[Y, X] = col
    for i in rs.permutation(len(ys))[: len(ys) // 140]:                    # a few darker spots in the pelt
        y, x = ys[i], xs[i]
        for (ddx, ddy) in [(0, 0), (1, 0), (0, 1), (1, 1)]:
            if 0 <= x + ddx < yp.W and 0 <= y + ddy < yp.H and m[y + ddy, x + ddx] and c.part[y + ddy, x + ddx] != parts[0] + 'b': c.rgb[y + ddy, x + ddx] = Fu[2]

def mrear(c, xb, yb, ux, uy, s, name, lift):
    """the rear flippers: leathery, fanned, five digit ridges, small nails at the tips"""
    S = lambda v: v * s
    for a in (-.6, .6):
        ca, sa = math.cos(a), math.sin(a); vx, vy = ux * ca - uy * sa, ux * sa + uy * ca
        px_, py_ = -vy, vx
        tip = (xb + vx * S(17), yb + vy * S(17))
        blob(c, R['mflip'], lambda d, vx=vx, vy=vy, px_=px_, py_=py_: d.polygon(smooth_poly([(xb - px_ * S(3), yb - py_ * S(3)), (xb + vx * S(9) - px_ * S(4), yb + vy * S(9) - py_ * S(4)), (xb + vx * S(17) - px_ * S(6), yb + vy * S(17) - py_ * S(6)), (xb + vx * S(18), yb + vy * S(18)), (xb + vx * S(17) + px_ * S(6), yb + vy * S(17) + py_ * S(6)), (xb + vx * S(9) + px_ * S(4), yb + vy * S(9) + py_ * S(4)), (xb + px_ * S(3), yb + py_ * S(3))], 3), fill=1), bulge=1.0, lift=lift - .05, name=name + 'fl')
        for k in (-2, -1, 0, 1, 2):
            a0 = (xb + vx * S(4) + px_ * k * S(.8), yb + vy * S(4) + py_ * k * S(.8)); a1 = (xb + vx * S(16.5) + px_ * k * S(2.4), yb + vy * S(16.5) + py_ * k * S(2.4))
            line(c, [a0, a1], R['mflip'][5] if k < 0 else R['mflip'][4], name + 'fl')
            c.px(int(a1[0]), int(a1[1]), R['kbone'][5])

def mlower(c, path, w0, w1, name='mbody', lift=.1, n=10, s=1.0):
    """the sea lion's body: golden-brown pelt with strokes, a paler belly, rear flippers fanned at the end"""
    P = cr(path, n) if len(path) > 2 else path
    (xa, ya), (xb, yb) = P[-2], P[-1]
    L = max(.01, math.hypot(xb - xa, yb - ya)); ux, uy = (xb - xa) / L, (yb - ya) / L
    mrear(c, xb, yb, ux, uy, s, name, lift)
    taper(c, P, w0, w1, R['mfur'], lift=lift, name=name, bulge=1.3)
    m = c.part == name
    ys, xs = np.nonzero(m)
    if len(ys):
        top = np.zeros_like(m)
        for X in np.unique(xs):
            col = ys[xs == X]; lo, hi = col.min(), col.max(); h = hi - lo + 1
            sel = (xs == X) & (ys > lo + h * .64)
            top[ys[sel], xs[sel]] = True
        c.rgb[top] = np.clip(c.rgb[top].astype(float) * .5 + np.array(R['mbel'][3]) * .5, 0, 255).astype(np.uint8)
        c.part[top] = name + 'b'
        # a lit ridge along the back
        for X in np.unique(xs)[::1]:
            col = ys[xs == X]; lo = col.min()
            if c.part[lo + 1, X] == name and (X % 5): c.px(X, lo + 1, R['mfur'][8] if X % 3 else R['mfur'][7])
    mfurstrokes(c, [name], P, seed=len(P))
    return P

def mflipper(c, x, y, ang, L, name='mfore', lift=.1, s=1.0):
    """a fore-flipper: thick at the root, a leathery blade, digit ridges and nails"""
    a = math.radians(ang); S = lambda v: v * s
    pts = [(x, y), (x + math.cos(a) * L * .45, y + math.sin(a) * L * .45), (x + math.cos(a) * L, y + math.sin(a) * L)]
    taper(c, pts, S(8), S(5.5), R['mflip'], lift=lift, name=name, bulge=1.2)
    blob(c, R['mflip'], lambda d: d.polygon(smooth_poly([pts[0], (pts[1][0] - math.sin(a) * S(5), pts[1][1] + math.cos(a) * S(5)), (pts[2][0] - math.sin(a) * S(3.5), pts[2][1] + math.cos(a) * S(3.5)), pts[2], (pts[1][0] + math.sin(a) * S(2), pts[1][1] - math.cos(a) * S(2))], 3), fill=1), bulge=1.0, lift=lift - .04, name=name)
    nx_, ny_ = -math.sin(a), math.cos(a)
    for k in (-1, 0, 1):
        a0 = (x + math.cos(a) * L * .3 + nx_ * k * S(1.3), y + math.sin(a) * L * .3 + ny_ * k * S(1.3))
        a1 = (x + math.cos(a) * L * .95 + nx_ * k * S(1.5), y + math.sin(a) * L * .95 + ny_ * k * S(1.5))
        line(c, [a0, a1], R['mflip'][6] if k < 1 else R['mflip'][3], name)
        c.px(int(a1[0]), int(a1[1]), R['kbone'][5])

def mfistglow(c, x, y, s, f, behind):
    """the fists of the king of the sea burning with gold light: a halo behind, the hand lit from within, sparks flying off"""
    S = lambda v: v * s; Gl = R['gglow2']
    if behind:
        r = S(7.5 + f)
        for yy in range(int(y - r), int(y + r) + 1):
            for xx in range(int(x - r), int(x + r) + 1):
                if not (0 <= yy < yp.H and 0 <= xx < yp.W): continue
                d = math.hypot(xx - x, yy - y) / r
                if d < 1 and not c.a[yy, xx]:
                    if d < .78 or (xx + yy) % 2 == 0:
                        c.px(xx, yy, Gl[min(5, int((1 - d) ** 1.3 * 6))]); c.part[yy, xx] = 'mglow'
        for k in range(8):                                                 # short rays
            a = k * math.pi / 4 + f * .4; r0, r1 = S(8.5), S(11.5 + (k % 2) * 2)
            for t in np.linspace(0, 1, 8):
                X, Y = int(x + math.cos(a) * (r0 + (r1 - r0) * t)), int(y + math.sin(a) * (r0 + (r1 - r0) * t))
                if 0 <= Y < yp.H and 0 <= X < yp.W and not c.a[Y, X]: c.px(X, Y, Gl[4] if t < .5 else Gl[3]); c.part[Y, X] = 'mglow'
    else:
        m = (c.part == 'mfist')
        yy, xx = np.mgrid[0:yp.H, 0:yp.W]; m &= ((xx - x) ** 2 + (yy - y) ** 2) < S(6) ** 2
        c.rgb[m] = np.clip(c.rgb[m] * .55 + np.array(Gl[4]) * .45, 0, 255).astype(np.uint8)
        glow(c, x - S(.8), y - S(1), max(1.0, S(1.4)), Gl)

def mspikes(c, P, w0, w1, n, s):
    """a row of bone spikes down the back of the tail, raked back, tipped with gold"""
    S = lambda v: v * s; N = len(P)
    for i in range(n):
        t = .18 + .74 * i / max(1, n - 1); j = min(N - 2, int(t * (N - 1)))
        (xa, ya), (xb, yb) = P[j], P[j + 1]
        L = max(.01, math.hypot(xb - xa, yb - ya)); tx, ty = (xb - xa) / L, (yb - ya) / L
        nx_, ny_ = ty, -tx
        if ny_ > 0: nx_, ny_ = -nx_, -ny_
        hw = (w0 + (w1 - w0) * t) / 2
        bx, by = xa + nx_ * hw * .8, ya + ny_ * hw * .8
        ln = S(11 - 5 * t); bw = ln * .36
        tip = (bx + nx_ * ln + tx * ln * .45, by + ny_ * ln + ty * ln * .45)
        blob(c, R['mbel'], lambda d, bx=bx, by=by, tip=tip, bw=bw, tx=tx, ty=ty: d.polygon([(bx - tx * bw, by - ty * bw), tip, (bx + tx * bw, by + ty * bw)], fill=1), bulge=1.1, lift=.05, name='mspike')
        line(c, [(bx - tx * bw * .4, by - ty * bw * .4), tip], R['mbel'][5], 'mspike')
        for k in range(3):
            X, Y = int(round(tip[0] - (tip[0] - bx) * k / ln)), int(round(tip[1] - (tip[1] - by) * k / ln))
            c.px(X, Y, R['mgold'][7 - k * 2])

def mfinish(c, extra=()):
    texture(c, ['mbody', 'mbody2', 'mtorso', 'marm', 'mfore', 'mface', 'mhair', 'mpec', 'mabs', 'mdelt', 'mobl'], amt=.12, seed=52)
    texture(c, ['mbodyfl', 'mbody2fl', 'mfore_fl', 'mfore', 'mbone'], amt=.2, seed=53)
    occlude(c, ['mtorso', 'marm', 'mface', 'mbeard', 'mpec', 'mdelt'], ['mhairb'], r=3, k=.6)
    occlude(c, ['mbeard', 'mhair'], ['mtorso', 'mpec', 'mneck', 'mtrap', 'mtorque', 'mbone'], r=2, k=.78)
    occlude(c, ['mtuft', 'mtorso', 'mabs', 'mobl'], ['mbody', 'mbody2', 'mbodyb', 'mbody2b'], r=4, k=.55)
    occlude(c, ['mbody', 'mbody2', 'mfist', 'mfore'], ['water'], r=4, k=.55)
    occlude(c, ['mcrown'], ['mface', 'mhair'], r=2, k=.6)
    speculars(c, ['mcrown', 'mtorque', 'mband', 'mbone', 'mgem', 'mbody', 'mbody2', 'mspike'], thr=.86, col=(255, 248, 210))
    speculars(c, ['mtorso', 'marm', 'mfore'], thr=.93, col=(250, 214, 178))
    return finish(c, [('mface', 'mhair'), ('mbrow', 'mface'), ('mbeard', 'mface'), ('mcrown', 'mface'), ('mcrown', 'mhair'), ('mtorso', 'mbody'), ('marm', 'mtorso'), ('mfist', 'marm'), ('mfist', 'mfore'), ('mfore', 'marm'),
                      ('mpec', 'mabs'), ('mabs', 'mabs'), ('mpec', 'mpec'), ('mabs', 'mtorso'), ('mpec', 'mtorso'), ('mdelt', 'mpec'), ('mdelt', 'marm'), ('mobl', 'mabs'), ('mobl', 'mtorso'),
                      ('mneck', 'mtrap'), ('mbeard', 'mneck'), ('mbeard', 'mtorso'), ('mbeard', 'mpec'), ('mtorque', 'mtorso'), ('mtorque', 'mpec'), ('mband', 'mfore'),
                      ('mbody', 'water'), ('mbody2', 'water'), ('mbody', 'mbody2'), ('mbone', 'mtorso'), ('mbone', 'mpec'), ('mbone', 'mabs'), ('mkelp', 'mbone'), ('mfore', 'mbody'), ('mbodyfl', 'mbody'), ('mbody2fl', 'mbody2'), ('mtuft', 'mbody'), ('mspike', 'mbody')] + list(extra),
                  rim=(240, 200, 110), rimparts=('mbody', 'mbody2', 'mtorso', 'marm', 'mfore', 'mhair', 'mhairb', 'mpec', 'mdelt', 'mobl'))

def _K(K):
    """every form is laid out on its old grid and scaled up by K"""
    return (lambda v: v * K), (lambda pts: [(a * K, b * K) for a, b in pts])

def llufu1(f):
    """rising from the dark water: only his shoulders, his crowned head and the hump of his back show"""
    K = 1.4; k, sc = _K(K)
    setsize(int(104 * K), int(80 * K)); c = Canvas()
    mlower(c, sc([(40, 66), (60, 60), (80, 58), (96, 64)]), k(22), k(12), 'mbody2', lift=.0, s=K)
    mhair_back(c, k(38), k(30 + f), K, hairflow=1)
    mtorso(c, k(38), k(42 + f), K, arms='down', f=f)
    mhead(c, k(38), k(30 + f), K, f, angry=True, hairflow=1)
    return mfinish(c)

def llufu2(f):
    """Millalobo ñi foro: his bones: risen to the waist in a breastplate of whale bones"""
    K = 1.35; k, sc = _K(K)
    setsize(int(104 * K), int(96 * K)); c = Canvas()
    mlower(c, sc([(48, 82), (70, 84), (88, 80), (98, 70)]), k(26), k(14), 'mbody', lift=.1, s=K)
    mflipper(c, k(38), k(76), 128, k(17), s=K); mflipper(c, k(62), k(80), 58, k(15), lift=.0, s=K)
    mhair_back(c, k(50), k(32 - f), 1.15 * K, hairflow=-1)
    mtorso(c, k(50), k(46 - f), 1.15 * K, arms='wide', f=f, bone=True)
    mhead(c, k(50), k(32 - f), 1.15 * K, f, angry=True, hairflow=-1)
    return mfinish(c, [('mkelp', 'mtorso')])

def _paste_rot2(c, L, ang, px_, py_):
    """lay a layer painted at double resolution over c, rotated about (px_, py_) by ang degrees (positive leans the top
    toward the left): sampling the fine layer keeps the stair-steps of the rotation one pixel fine instead of doubled"""
    a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
    yy, xx = np.mgrid[0:yp.H, 0:yp.W]
    X = xx + .5 - px_; Y = yy + .5 - py_
    sx = np.floor((ca * X - sa * Y + px_) * 2).astype(int); sy = np.floor((sa * X + ca * Y + py_) * 2).astype(int)
    H2, W2 = L.a.shape
    ok = (sx >= 0) & (sx < W2) & (sy >= 0) & (sy < H2)
    src = np.zeros_like(ok); src[ok] = L.a[sy[ok], sx[ok]]
    c.rgb[src] = L.rgb[sy[src], sx[src]]; c.a[src] = True; c.part[src] = L.part[sy[src], sx[src]]

R['mwing'] = ramp('#06090c', '#0e1a20', '#172a34', '#223e4a', '#2f5462', '#42707e', '#5e909a', '#86b4b8')
def mwing(c, rx, ry, s, spread, lift=0.0, f=0, name='mwing'):
    """a great feathered wing raised from the shoulders and swept back: a strong leading edge, rows of coverts,
    long primaries fanned out with gold tips (the milla of the king)"""
    S = lambda v: v * s
    a0 = math.radians(-78 + spread - f * 6)
    lead = [(rx, ry), (rx + math.cos(a0) * S(14) + S(3), ry + math.sin(a0) * S(14)),
            (rx + math.cos(a0) * S(26) + S(12), ry + math.sin(a0) * S(26)), (rx + math.cos(a0) * S(28) + S(30), ry + math.sin(a0) * S(28) - S(2))]
    L = cr(lead, 8)
    n = 15
    for i in range(n - 1, -1, -1):                                         # primaries and secondaries, long at the tip
        t = i / (n - 1); j = min(len(L) - 1, int(t * (len(L) - 1))); bx, by = L[j]
        ang = math.radians(66 - 74 * t + spread * .3 - f * 4)
        ln = S(12 + 18 * t ** 1.2)
        tip = (bx + math.cos(ang) * ln, by + math.sin(ang) * ln)
        mid = (bx + math.cos(ang) * ln * .55 + S(.8), by + math.sin(ang) * ln * .55)
        taper(c, [(bx, by), mid, tip], S(4.2), S(1.2), R['mwing'], lift=lift + .04 * (i % 2) - .05, name=name, bulge=1.0)
        line(c, [(bx + math.cos(ang) * S(2), by + math.sin(ang) * S(2)), mid, (tip[0] - math.cos(ang) * S(1.5), tip[1] - math.sin(ang) * S(1.5))], R['mwing'][6] if i % 2 else R['mwing'][5], name)
        for k in range(3):                                                 # gold tip
            X, Y = int(tip[0] - math.cos(ang) * k), int(tip[1] - math.sin(ang) * k)
            c.px(X, Y, R['mgold'][6 - k * 2] if k < 3 else R['mgold'][2])
    for i in range(10):                                                    # coverts: shorter, rounder rows near the edge
        t = i / 9; j = min(len(L) - 1, int(t * (len(L) - 1) * .9)); bx, by = L[j]
        ang = math.radians(60 - 60 * t + spread * .3)
        ln = S(6 + 5 * t)
        taper(c, [(bx, by), (bx + math.cos(ang) * ln, by + math.sin(ang) * ln)], S(4.6), S(2), R['mwing'], lift=lift + .14, name=name + 'c', bulge=1.1)
        c.px(int(bx + math.cos(ang) * ln), int(by + math.sin(ang) * ln), R['mwing'][7])
    taper(c, L, S(5), S(2.4), R['mwing'], lift=lift + .22, name=name + 'e', bulge=1.2)      # the leading edge (the bones of the wing)
    for (X, Y) in L[2::4]: c.px(int(X), int(Y) - 1, R['mwing'][7])

def llufu3(f):
    """Müpükülechi Millalobo: the winged Millalobo bursts out of the sea in a great arc, leaning into the charge,
    one hand reaching for you, great wings raised from his shoulders, a fore-flipper paddling forward and the tail flung high"""
    K = 1.22; k, sc = _K(K); kx = lambda v: k(v + 16); ky = lambda v: k(v + 22); sc = lambda pts: [(k(a + 16), k(b + 22)) for a, b in pts]
    setsize(int(148 * K), int(110 * K)); c = Canvas()
    # the far wing, higher and darker, then the near wing: both behind the body
    mwing(c, kx(46), ky(36), K * 1.0, -22, lift=-.12, f=f, name='mwingf')
    mwing(c, kx(48), ky(40), K * 1.2, 6, lift=.05, f=f, name='mwing')
    # the far fore-flipper hanging down behind, over the water
    mflipper(c, kx(50), ky(62), 58 + f * 6, k(26), name='mfore_fl', lift=-.02, s=K)
    # the body: from the waist it dives under the surface and the tail bursts out again at the far end
    mlower(c, sc([(36, 50), (48, 62), (62, 74), (80, 80), (98, 72), (110, 54), (116, 40)]), k(30), k(10), 'mbody', lift=.12, n=10, s=K)
    # the man, painted upright on a double-resolution layer and leaned forward into the charge
    W0, H0 = yp.W, yp.H; setsize(W0 * 2, H0 * 2); Lr = Canvas(); k2 = lambda v: kx(v) * 2; j2 = lambda v: ky(v) * 2
    mhair_back(Lr, k2(36), j2(18 + f), K * 2, hairflow=3)
    mtorso(Lr, k2(36), j2(30 + f), K * 2, arms='reach', f=f)
    mhead(Lr, k2(36), j2(18 + f), K * 2, f, angry=True, hairflow=3)
    setsize(W0, H0)
    _paste_rot2(c, Lr, 16, kx(36), ky(54))
    # the near fore-flipper paddling forward under the reaching arm, in front of everything
    mflipper(c, kx(40), ky(60), 146 - f * 10, k(32), name='mfore_fl', lift=.5, s=K * 1.15)
    # droplets flung off the tail and the wings
    for kk in range(24):
        x, y = int(kx(96) + (kk * 11 % 34) - k(6)), int(ky(10) + (kk * 7 % 30) - f * 3)
        if 0 <= y < yp.H and 0 <= x < yp.W and not c.a[y, x]: c.px(x, y, R['water'][7] if kk % 2 else (240, 250, 250)); c.part[y, x] = 'spark'
    texture(c, ['mwing', 'mwingf', 'mwingc', 'mwingfc'], amt=.18, seed=54)
    return mfinish(c, [('mfore_fl', 'mbody'), ('mwingc', 'mwing'), ('mwinge', 'mwingc'), ('mwingfc', 'mwingf'), ('mwingfe', 'mwingfc'), ('mwing', 'mwingf'), ('mwingc', 'mwingf')])

def llufu4(f):
    """Millalobo ñi piwke: his heart: the chest opens on a heart of gold light that throws up barriers"""
    K = 1.3; k, sc = _K(K)
    setsize(int(100 * K), int(108 * K)); c = Canvas()
    mlower(c, sc([(50, 96), (72, 98), (90, 92), (96, 80)]), k(28), k(14), 'mbody', lift=.1, s=K)
    mflipper(c, k(38), k(92), 128, k(15), s=K); mflipper(c, k(64), k(96), 58, k(13), lift=.0, s=K)
    mhair_back(c, k(50), k(39), 1.2 * K, hairflow=0)
    mtorso(c, k(50), k(54), 1.2 * K, arms='up', f=f, heart=True)
    # the chest split open on a heart of gold light, cracks running out through the muscle
    hx_, hy = k(50), k(66)
    for (a, L) in [(-2.4, 16), (-.7, 15), (2.6, 12), (.5, 13), (1.6, 10), (-1.6, 12)]:
        pts = [(hx_ + math.cos(a) * k(4) * t / 3 + math.sin(t * 2.1 + a) * .8, hy + math.sin(a) * k(4) * t / 3) for t in range(0, 4)]
        pts = [(hx_ + math.cos(a) * k(L) * t / 4 + (t % 2) * 1.2, hy + math.sin(a) * k(L) * t / 4) for t in range(0, 5)]
        line(c, pts, R['gglow2'][3], ('mtorso', 'mpec', 'mabs', 'mobl'))
    blob(c, R['gglow2'], lambda d: d.polygon(smooth_poly([(hx_, hy - k(4) - f), (hx_ + k(6), hy - k(8) - f), (hx_ + k(11), hy - k(3)), (hx_ + k(8), hy + k(4)), (hx_, hy + k(11)), (hx_ - k(8), hy + k(4)), (hx_ - k(11), hy - k(3)), (hx_ - k(6), hy - k(8) - f)], 4), fill=1), bulge=1.35, lift=.3 + f * .1, name='mgem')
    for (a, b) in [((hx_ - k(4), hy - k(3)), (hx_, hy + k(7))), ((hx_ + k(4), hy - k(3)), (hx_, hy + k(7))), ((hx_ - k(8), hy - k(2)), (hx_ + k(8), hy - k(2)))]:
        line(c, [a, b], R['gglow2'][2], 'mgem')
    glow(c, hx_ - k(2), hy - k(3), k(2.6), R['gglow2']); c.px(int(hx_ - k(4)), int(hy - k(5)), (255, 255, 255))
    mhead(c, k(50), k(39), 1.2 * K, f, angry=True, hairflow=0)
    for kk in range(14):                                                   # light leaking from the heart
        a = kk * .45 + f * .5
        for r_ in (k(30), k(34)):
            x, y = int(hx_ + math.cos(a) * r_), int(hy + math.sin(a) * r_ * .7)
            if 0 <= y < yp.H and 0 <= x < yp.W and not c.a[y, x]: c.px(x, y, R['gglow2'][3 + (kk % 2)]); c.part[y, x] = 'spark'
    return mfinish(c, [('mgem', 'mtorso'), ('mgem', 'mpec'), ('mgem', 'mabs')])

def llufu5(f):
    """Rüf Millalobo: the king of the sea as he truly is, risen whole on a swell, crown blazing, hearing the song again"""
    K = 1.2; k, sc = _K(K); kx = lambda v: k(v + 9); sc = lambda pts: [(k(a + 9), k(b)) for a, b in pts]
    setsize(int(130 * K), int(128 * K)); c = Canvas()
    # a halo of gold rays behind the crown
    for kk in range(9):
        a = math.radians(-170 + kk * 20); L = 16 + (kk % 2) * 6
        x0, y0 = kx(44) + math.cos(a) * k(13), k(28 - f) + math.sin(a) * k(9)
        taper(c, [(x0, y0), (x0 + math.cos(a) * k(L), y0 + math.sin(a) * k(L))], k(2.6), k(.8), R['gglow2'][1:], lift=.2, name='mray', bulge=1.0)
    Pb = mlower(c, sc([(44, 100), (64, 110), (86, 112), (102, 104), (108, 90)]), k(34), k(14), 'mbody', lift=.1, n=12, s=K)
    mspikes(c, Pb, k(34), k(14), 9, K)
    mflipper(c, kx(32), k(102), 128, k(20), s=K); mflipper(c, kx(58), k(106), 58, k(17), lift=.0, s=K)
    mhair_back(c, kx(44), k(42 - f), 1.4 * K, hairflow=1)
    mtorso(c, kx(44), k(60 - f), 1.4 * K, arms='wide', f=f, glowfist=True)
    mhead(c, kx(44), k(42 - f), 1.4 * K, f, angry=False, hairflow=1)
    arcs(c, kx(84), k(44 - f), [k(6 + 3 * f), k(12 + 3 * f), k(18 + 3 * f)], -math.pi * .35, math.pi * .35, (255, 236, 170), step=.07)
    for kk in range(22):
        x, y = int((kk * 23 + f * 5) % k(124) + 2), int((kk * 37 + f * 3) % k(96) + 4)
        if 0 <= y < yp.H and 0 <= x < yp.W and not c.a[y, x]: c.px(x, y, R['gglow2'][3] if kk % 2 else R['gglow2'][4]); c.part[y, x] = 'spark'
    return mfinish(c, [('mray', 'mhair')])

# =========================================================== polishing straight from the pixel art (Ngoymatulfe forms 1 and 5):
# the original sprite is the drawing; every pixel keeps its place and its role, only the light, the form and the finish change
def _s2x(rows):
    h = len(rows); w = len(rows[0]); out = [['.'] * (w * 2) for _ in range(h * 2)]
    g = lambda x, y: rows[y][x] if 0 <= x < w and 0 <= y < h else '.'
    for y in range(h):
        for x in range(w):
            P = g(x, y); A = g(x, y - 1); B = g(x + 1, y); C = g(x - 1, y); Dd = g(x, y + 1)
            out[2 * y][2 * x] = A if (C == A and C != Dd and A != B) else P
            out[2 * y][2 * x + 1] = B if (A == B and A != C and B != Dd) else P
            out[2 * y + 1][2 * x] = C if (Dd == C and Dd != B and C != A) else P
            out[2 * y + 1][2 * x + 1] = Dd if (B == Dd and B != A and Dd != C) else P
    return out
PX = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ngoy_px.json')))
def pixpolish(name, f, stone, tones, special, rim, seed=60):
    """stone: colour ramp for the body; tones: char -> original tone 0..1 (its place in the old shading);
    special: char -> (ramp, mode) for voids, glows and accents, drawn by their own rules"""
    from scipy.ndimage import label, distance_transform_edt as edt, gaussian_filter as gf
    G = np.array(_s2x(PX[name]['f'][f])); H_, W_ = G.shape; setsize(W_, H_); c = Canvas()
    # the old 2-px outline: the outer layer goes (finish draws a fine one), the inner ones stay as seams between the masses
    inside = G != '.'
    outer = (G == 'o') & ~(np.roll(inside, 1, 0) & np.roll(inside, -1, 0) & np.roll(inside, 1, 1) & np.roll(inside, -1, 1))
    body = np.isin(G, list(tones))
    lab, n = label(body)
    K = len(stone)
    yy, xx = np.mgrid[0:H_, 0:W_]
    bay = yp.BAYER[yy % 4, xx % 4]
    tone = np.zeros((H_, W_))
    for ch, t in tones.items(): tone[G == ch] = t
    tone = gf(tone, .6)
    for i in range(1, n + 1):
        m = lab == i
        d = edt(m); Rr = max(2.0, d.max())
        h = gf((np.clip(d / Rr, 0, 1) ** .6) * Rr * 1.1, 1.0)
        gy, gx = np.gradient(h)
        nn = np.dstack([-gx, -gy, np.ones_like(h) * .8]); nn /= np.linalg.norm(nn, axis=2, keepdims=True)
        lum = (nn @ yp.LIGHT - .15) / .85
        lum = (lum - .45) * 1.3 + .45 - yy / H_ * .06
        t = .5 * lum + .5 * tone
        rimlit = (d <= 1.5) & ((gx > .05) | (gy > .05))           # reflected light along the shadow-side edge
        t = np.where(rimlit & (t < .35), t + .14, t)
        idx = np.clip(np.floor(t * (K - 1) + .35 + (bay - .5) * .3).astype(int), 0, K - 1)
        c.rgb[m] = np.array(stone)[idx[m]]; c.a[m] = True; c.part[m] = 'st%d' % (i % 7)
    # seams: the inner outline pixels, dark but not black, so the masses read as carved
    seam = (G == 'o') & ~outer
    c.rgb[seam] = np.array(stone[0]); c.a[seam] = True; c.part[seam] = 'seam'
    for ch, (rmp, mode) in special.items():
        m = G == ch
        if not m.any(): continue
        d = edt(m)
        if mode == 'void':                                         # a hollow: darkest at the heart, a faint lip of light
            k = np.clip(1 - d / 4, 0, 1)
            idx = np.clip((k * (len(rmp) - 1) * .8 + (bay - .5) * .4).astype(int), 0, len(rmp) - 1)
        elif mode == 'glow':                                       # light: hottest at the core
            k = np.clip(d / 2.5, 0, 1)
            idx = np.clip((1 + k * (len(rmp) - 2)).astype(int), 0, len(rmp) - 1)
        else:                                                      # flat accent, shaded top to bottom
            k = np.clip(1 - (yy - yy[m].min()) / max(1, np.ptp(yy[m]) + 1), 0, 1)
            idx = np.clip((1 + k * (len(rmp) - 2) + (bay - .5) * .5).astype(int), 0, len(rmp) - 1)
        c.rgb[m] = np.array(rmp)[idx[m]]; c.a[m] = True; c.part[m] = 'sp_' + mode
    for ch, (rmp, mode) in special.items():                        # light spills out of the glows onto the stone round them
        if mode != 'glow': continue
        m = G == ch
        near = (edt(~m) <= 3) & ~m & c.a & np.isin(c.part, ['st%d' % i for i in range(7)])
        c.rgb[near] = np.clip(c.rgb[near] * .6 + np.array(rmp[3]) * .4, 0, 255).astype(np.uint8)
    texture(c, ['st%d' % i for i in range(7)], amt=.12, seed=seed)
    speculars(c, ['st%d' % i for i in range(7)], thr=.9)
    return finish(c, [('st%d' % i, 'sp_void') for i in range(7)], rim=rim, rimparts=tuple('st%d' % i for i in range(7)))

R.update({k: [hx(c) for c in v] for k, v in {
    # five forms, five stones
    'slate':  ['#06080e', '#0e1220', '#182034', '#24304a', '#344462', '#4a5c7c', '#647896', '#8496b0', '#a8b8cc'],     # 1: cold blue slate
    'oxblood':['#0e0406', '#1e080c', '#320e14', '#48161c', '#602028', '#7a2e34', '#963e42', '#b05652', '#c87466'],     # 2: the heart, dark red stone
    'sand':   ['#100c06', '#20180c', '#342814', '#4a3a1e', '#62502a', '#7c6838', '#968048', '#b09a5e', '#cab47a'],     # 3: weathered sandstone
    'verd':   ['#040a08', '#0a1612', '#12241e', '#1c342c', '#284840', '#365e54', '#48766a', '#609082', '#80ac9c'],     # 5: dark verdigris bronze
    'vvoid':  ['#000000', '#020404', '#060a0a', '#0c1414', '#162222'],
    'svoid':  ['#000000', '#030408', '#080a12', '#10141e', '#1c2230'],
    'gold':   ['#3a2a04', '#6a4c08', '#a07418', '#d0a030', '#f0cc60', '#fff0b0'],
    'moss2':  ['#0c1a0a', '#1a3014', '#2a4a20', '#3c6430', '#527e44']}.items()})

def oldpolish(name, f, stone, rim, seed=60, gamma=1.0, accb=1.0):
    """start from the form as it was painted before (its old battle sprite) and only polish it: the stone is recoloured
    by its own light values into a new ramp with a touch more contrast, glows get a core and a halo, the shadow-side
    edges catch a rim light, the lit edges a highlight, and the surface a little grain. Nothing moves."""
    from scipy.ndimage import distance_transform_edt as edt
    d = PX[name]['b']; rows = d['f'][f]; H_, W_ = len(rows), len(rows[0]); setsize(W_, H_); c = Canvas()
    pal = {k: hx(v) for k, v in d['pal'].items()}
    img = np.zeros((H_, W_, 3), float); a = np.zeros((H_, W_), bool)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch != '.': img[y, x] = pal[ch]; a[y, x] = True
    mx, mn = img.max(2), img.min(2); sat = mx - mn; lum = img @ np.array([.3, .55, .15]) / 255
    line_ = a & (mx < 26)                                          # the old outline and seams
    warm = (img[..., 0] - img[..., 2]) > 28                     # the gold, the embers, the letters: never stone
    stone_m = a & ~line_ & (sat < 70) & ~warm
    accent = a & ~line_ & ~stone_m
    K = len(stone)
    lo, hi = np.percentile(lum[stone_m], 2), np.percentile(lum[stone_m], 99)
    t = np.clip((lum - lo) / max(.01, hi - lo), 0, 1) ** gamma
    yy, xx = np.mgrid[0:H_, 0:W_]
    idx = np.clip(np.floor(t * (K - 1) + .5 + (yp.BAYER[yy % 4, xx % 4] - .5) * .25).astype(int), 0, K - 1)
    c.rgb[stone_m] = np.array(stone)[idx[stone_m]]
    c.rgb[accent] = np.clip(img[accent] * accb, 0, 255).astype(np.uint8)
    c.rgb[line_] = (np.array(stone[0]) * .6).astype(np.uint8)
    c.a[:] = a; c.part[stone_m] = 'st'; c.part[accent] = 'acc'; c.part[line_] = 'line'
    # glows: the bright saturated accents get a white-hot core and a halo on the stone around them
    hot = accent & (mx > 200)
    if hot.any():
        dist = edt(~hot)
        halo = (dist <= 3) & (dist > 0) & stone_m
        c.rgb[halo] = np.clip(c.rgb[halo] * .55 + img[hot].mean(0) * .45 * (1 - (dist[halo] - 1)[:, None] / 3), 0, 255).astype(np.uint8)
        core = hot & (edt(hot) >= 1.5)
        c.rgb[core] = np.clip(img[core] * .5 + 128, 0, 255).astype(np.uint8)
    # lit edges: stone pixels whose upper-left neighbour is outline or empty catch a highlight
    out_ = ~a
    near_out = out_ | (np.roll(out_, 1, 0) & line_) | (np.roll(out_, 1, 1) & line_)
    ul = np.roll(near_out, 1, 0) | np.roll(near_out, 1, 1) | np.roll(np.roll(near_out, 1, 0), 1, 1)
    lit = stone_m & ul & (idx >= K // 3) & ~np.roll(stone_m, 1, 0)
    c.rgb[lit] = np.array(stone)[np.minimum(K - 1, idx[lit] + 2)]
    texture(c, ['st'], amt=.10, seed=seed)
    speculars(c, ['st'], thr=.93)
    # rim light on the shadow side, from the forgetting's own glow behind it
    for y in range(H_):
        for x in range(1, W_ - 2):
            if stone_m[y, x] and not stone_m[y, x + 1] and (not a[y, x + 1] or (x + 2 < W_ and not a[y, x + 2])) and idx[y, x] < K // 2:
                c.rgb[y, x] = (c.rgb[y, x] * .5 + np.array(rim) * .5).astype(np.uint8)
    out = np.zeros((H_, W_, 4), np.uint8); out[..., :3] = c.rgb; out[..., 3] = c.a * 255
    return out

R.update({k: [hx(c) for c in v] for k, v in {
    'ashen': ['#08060e', '#140f1e', '#221a30', '#342a44', '#4a405a', '#625a72', '#7e768c', '#9e98aa', '#c4c0cc', '#e8e4ec'],
    'bone2': ['#0a0806', '#18140f', '#2a231b', '#3e352a', '#564b3d', '#706454', '#8e816e', '#ae a18c'.replace(' ', ''), '#cec2ac', '#ece4d2']}.items()})

def ngoyman1(f):
    return oldpolish('ngoyman1', f, R['slate'], rim=(255, 150, 80), seed=61)

def ngoyman5(f):
    return oldpolish('ngoyman5', f, R['bone2'], rim=(240, 200, 100), seed=65, gamma=.85, accb=1.3)

SPRITES = {'trelke': trelke, 'cherrufe': cherrufe, 'kaleuche': kaleuche, 'witranalwe': witranalwe, 'chinifilu': chinifilu, 'piwuchen': piwuchen, 'wallipen': wallipen, 'trawko': trawko, 'walichu': walichu, 'chadikura': chadikura, 'epunamun': epunamun, 'kalku': kalku, 'ngoyman1': ngoyman1, 'ngoyman2': ngoyman3, 'ngoyman3': ngoyman2,   # in the game the golem is the second form and the heart the third
           'ngoyman4': ngoyman4, 'ngoyman5': ngoyman5,
           'llufu1': llufu1, 'llufu2': llufu2, 'llufu3': llufu3, 'llufu4': llufu4, 'llufu5': llufu5}

if __name__ == '__main__':
    from PIL import Image
    here = os.path.dirname(os.path.abspath(__file__)); jp = os.path.join(here, 'boss.json')
    out = json.load(open(jp)) if os.path.exists(jp) else {}
    names = sys.argv[1].split(',') if len(sys.argv) > 1 else list(SPRITES)
    strip = []
    for name in names:
        big = [SPRITES[name](0), SPRITES[name](1)]
        if name.startswith('llufu'):                                       # no water under him: trim the empty rows below his body
            bot = max(int(np.nonzero(b[..., 3].any(1))[0].max()) for b in big) + 1
            big = [b[:bot] for b in big]
        small = [yp.half(b) for b in big]
        pb, fb = wp.encode2(big); ps, fs = wp.encode2(small)
        out[name] = {'big': {'pal': pb, 'f': fb}, 'small': {'pal': ps, 'f': fs}}
        for b in big:
            im = Image.new('RGBA', (b.shape[1] + 8, 216), (34, 38, 52, 255)); b0 = Image.fromarray(b); im.paste(b0, (4, 212 - b0.height), b0); strip.append(im)
    Wt = sum(s.width for s in strip); sheet = Image.new('RGBA', (Wt, 216)); x = 0
    for s in strip: sheet.paste(s, (x, 0)); x += s.width
    sheet.resize((sheet.width * 2, 432), Image.NEAREST).save('/tmp/bs/boss_sheet.png')
    json.dump(out, open(jp, 'w'))
    print('ok', names)
