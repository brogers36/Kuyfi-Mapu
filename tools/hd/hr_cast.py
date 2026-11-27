"""The cast, built from specs, with the paint-then-pixelate method.
Views: front, back, side (facing left; right is the mirror). Frames: 0 idle, 1 and 2 walking steps.
Figures are designed on a 48x72 grid and drawn 12.5% larger (54x81). Preview stage."""
import numpy as np
from PIL import Image
from hr import Hi, E, R, poly, U, I, hx

CX = 24; HS = 1.13; GS = 1.3
RETRO = False; RGS = 0.46   # retro: drawn on the game's own pixel grid (about 22x33), 16 colours, small eyes
SK = {'skin': '#dc9a68', 'old': '#c88a5e', 'dark': '#b87a50'}

def sc(fn, cx, cy, k=HS):
    return lambda X, Y: fn(cx + (X - cx) / k, cy + (Y - cy) / k)
def shift(fn, dx=0, dy=0):
    return lambda X, Y: fn(X - dx, Y - dy)
def mirror(fn):
    return lambda X, Y: fn(2 * CX - X, Y)

SPECS = {
 'weaver':  dict(skin='skin', hair='#2a2236', style='long', band='#3048b0', garb='kupam', dress='#2a2640', shawl='#2a8a72', belt='#2c4aa8', tupu=True, ear=True, locks=True),
 'cook':    dict(skin='dark', hair='#241c2a', style='long', band='#b8322a', garb='kupam', dress='#2a2236', shawl='#c46a1c', belt='#a82a20', tupu=True, ear=True, locks=True),
 'teacher': dict(skin='skin', hair='#2a2236', style='long', band='#c89a20', garb='kupam', dress='#262238', shawl='#d0a838', belt='#3a5ab8', tupu=True, ear=True, locks=True),
 'kuku':    dict(skin='old', hair='#c8c4cc', style='long', band='#b8322a', garb='kupam', dress='#22202e', shawl='#7a3aa0', belt='#b02a22', trapel=True, old=True, locks=True, hair_bottom=45),
 'lonko':   dict(skin='skin', hair='#241e2e', style='short', band='#b8322a', garb='makun', poncho='#a8482a', bandg='#1e1a2c', ma='#f0ece4', mb='#e8c048', staff=True),
 'walker':  dict(skin='dark', hair='#241e2e', style='short', band='#2a6a3a', garb='makun', poncho='#5a6a3a', bandg='#2a2018', ma='#e8d8a8', mb='#b83a26'),
 'llanka':  dict(skin='skin', hair='#241e2e', style='short', band='#b8322a', garb='makun', poncho='#2e5ac0', bandg='#16245a', ma='#e04a34', mb='#f0ece4'),
 'child':   dict(skin='skin', hair='#2a2236', style='short', band='#d0a030', garb='tunic', tunic='#d8c49c', pants='#3a5aa8', child=True),
 'childf':  dict(skin='skin', hair='#2a2236', style='long', band='#c8322a', garb='kupam', dress='#2a2640', shawl='#c84a6a', belt='#3a5ab8', child=True, hair_bottom=44),
 'kona':    dict(skin='dark', hair='#241e2e', style='short', band='#c8322a', garb='makun', poncho='#7a2a2a', bandg='#1a1420', ma='#f0ece4', mb='#d8a838'),
 'palinA':  dict(skin='dark', hair='#1e1824', style='short', band='#f0ece4', garb='shirt', shirt='#b8322a', pants='#2a2230', wino=True),
 'palinB':  dict(skin='skin', hair='#1e1824', style='short', band='#f0ece4', garb='shirt', shirt='#2e5ab8', pants='#2a2230', wino=True),
}

# ------------------------------------------------------------------ helpers
def folds(h, xs, y0, y1, dark, light, cx=CX):
    for x in xs:
        h.line([(x, y0), (x + (x - cx) / 5, y1)], dark, w=1.1, alpha=.75)
        h.line([(x - 1.3, y0 + 2), (x - 1.3 + (x - cx) / 5, y1 - 1)], light, w=.8, alpha=.45)

def band_motif(h, y, x0, x1, ground, a, b, step=5):
    h.shape(R(x0, y, x1, y + 5), ground, bulge=.4, tex='cloth', aok=.15)
    for i, x in enumerate(np.arange(x0 + 2, x1 - 1, step)):
        h.shape(poly([(x, y + .6), (x + 2.2, y + 2.5), (x, y + 4.4), (x - 2.2, y + 2.5)]), a if i % 2 else b, bulge=.3, ao=False, line=False)

def dk(c, k): return np.clip(hx(c) * k, 0, 1)

# ------------------------------------------------------------------ FRONT / BACK
def head_front(h, sp, cy, back=False):
    skin = SK[sp['skin']]; hair = sp['hair']
    hs = sc(U(E(CX, cy, 11, 11.6), E(CX, cy + 5, 8.6, 7.6)), CX, cy)
    if back:
        h.shape(sc(U(E(CX, cy - 1, 13, 13.8), E(CX, cy + 4, 11, 9)), CX, cy), hair, bulge=.9, tex='hair', shine=.4)
        for x in np.arange(CX - 11, CX + 12, 4.4):
            h.line([(x, cy - 10), (x + .6, cy + 12)], dk(hair, .55), w=.8, alpha=.55)
        band = sc(I(R(CX - 15, cy - 8, CX + 15, cy - 5), E(CX, cy - 2, 13.8, 14.5)), CX, cy)
        h.shape(band, sp['band'], bulge=.4, tex='cloth', aok=.1)
        for sd in (-1, 1):   # the knot and the hanging ends at the back
            h.shape(poly([(CX + sd * .5, cy - 6), (CX + sd * 3, cy + 6), (CX + sd * 4.6, cy + 6), (CX + sd * 2.2, cy - 6)]), sp['band'], bulge=.5, tex='cloth')
        return
    h.shape(sc(E(CX - 11, cy + 2, 2.2, 3.2), CX, cy), skin, bulge=.8)
    h.shape(sc(E(CX + 11, cy + 2, 2.2, 3.2), CX, cy), skin, bulge=.8, dark=.85)
    h.shape(hs, skin, bulge=.55, tex='skin', amb=.62)
    h.darken(sc(lambda X, Y: (((X - CX) / 11) ** 2 + ((Y - cy - 2) / 13) ** 2 > .72) & (X > CX + 3), CX, cy), .86)
    tips = [(CX + 12, cy + 4), (CX + 10.5, cy - 3), (CX + 8, cy - 1), (CX + 6, cy - 6), (CX + 3, cy - 2.5), (CX + 1, cy - 7),
            (CX - 1.5, cy - 3), (CX - 4, cy - 7), (CX - 6, cy - 2), (CX - 8, cy - 6), (CX - 10, cy - 1), (CX - 12, cy + 4)]
    fn = sc(poly([(CX - 13, cy + 4), (CX - 12.5, cy - 8), (CX - 5, cy - 14.5), (CX + 5, cy - 14.5), (CX + 12.5, cy - 8), (CX + 13, cy + 4)][::-1] + tips[::-1]), CX, cy)
    h.cast(fn, dx=.4, dy=1.2, k=.35, blur=.7)
    h.shape(fn, hair, bulge=.9, tex='hair', shine=.5, aok=0)
    h.shape(sc(I(R(CX - 14, cy - 8, CX + 14, cy - 5), E(CX, cy - 2, 13.8, 14.5)), CX, cy), sp['band'], bulge=.4, tex='cloth', aok=.1)
    for x in range(CX - 12, CX + 13, 4):
        h.shape(sc(E(x, cy - 6.5, 1.1, 1.1), CX, cy), '#c8ccd8', bulge=1.2, shine=1.2, ao=False, line=False)
    h.shape(sc(E(CX, cy - 6.5, 2.4, 2.2), CX, cy), '#c8ccd8', bulge=1.4, shine=1.4, line=False)
    if sp.get('ear'):
        for sd in (-1, 1): h.shape(sc(E(CX + sd * 11.5, cy + 6, 1.3, 1.8), CX, cy), '#d0d4e0', bulge=1.3, shine=1.5, line=False)

def hair_back_front(h, sp, cy, bottom):
    if sp['style'] != 'long':
        bottom = cy + 13
    w = 13.3 * HS
    col = sp['hair']
    def fn(X, Y):
        wave = 1.1 * np.sin(Y * .55) + .6 * np.sin(Y * 1.3 + 1)
        body = (np.abs(X - CX) < w + wave * (Y > cy)) & (Y >= cy) & (Y < bottom)
        top = ((X - CX) / (w + .2)) ** 2 + ((Y - cy + 1) / (14 * HS)) ** 2 <= 1
        k = ((X - CX + w) % 4.5) / 4.5
        tips = (np.abs(X - CX) < w) & (Y >= bottom) & (Y < bottom + 4 - 4 * np.abs(k - .5) * 2)
        return body | top | tips
    h.shape(fn, col, bulge=.7, tex='hair', ao=False)
    for x in np.arange(CX - w + 2, CX + w - 1, 4.5):
        h.line([(x, cy + 4), (x + .8, cy + 14), (x - .4, bottom + 1)], dk(col, .55), w=.8, alpha=.6)

def legs_front(h, sp, fr, top, col):
    off = [(0, 0), (1, -1.5), (-1.5, 1)][fr]       # (left foot dy, right foot dy)
    for i, x0 in enumerate((CX - 8.5, CX + .5)):
        dy = off[i]
        h.shape(R(x0, top, x0 + 8, 66 + dy), col, bulge=.9, tex='cloth')
        h.shape(E(x0 + 4, 68 + dy, 4.2, 2.8), '#5a3a22', bulge=1.1, tex='wood')

def feet_dress(h, fr, gap=6):
    off = [(0, 0), (1, -1.2), (-1.2, 1)][fr]
    for i, x in enumerate((CX - gap, CX + gap)):
        h.shape(E(x, 68 + off[i], 4.2, 2.8), '#5a3a22', bulge=1.1, tex='wood')

def arms_front(h, col, skin, top, y, dx, fr, back=False):
    sw = [0, 1.2, -1.2][fr]
    for sd in (-1, 1):
        yy = y + sw * sd
        fn = poly([(CX + sd * 7, top - .5), (CX + sd * 11, top - 1.6), (CX + sd * 14.5, top + 2), (CX + sd * 17.6, yy - 3), (CX + sd * 17, yy - .8),
                   (CX + sd * 12.6, yy - .6), (CX + sd * 11.6, yy - 3), (CX + sd * 10, top + 5)])
        h.cast(fn, dx=-sd * .7, dy=1.0, k=.32)
        h.shape(fn, col, bulge=1.1, tex='cloth', dark=.9 if sd > 0 else 1)
        h.line([(CX + sd * 13, top + 3), (CX + sd * 15.4, yy - 2)], dk(col, .5), w=.8, alpha=.7)
        h.shape(E(CX + sd * (dx + .6), yy + 1, 2.9, 3.1), skin, bulge=1.2, dark=.9 if sd > 0 else 1)

def front_locks(h, col, cy, to):
    for sd in (-1, 1):
        x0 = CX + sd * 12.4
        fn = poly([(x0 - 1.8, cy + 6), (x0 + 1.8, cy + 6), (x0 + sd * 1.5 + 1.6, to - 4), (x0 + sd * 1.2, to), (x0 + sd * 1.5 - 1.6, to - 4)])
        h.cast(fn, dx=.6, dy=.6, k=.3)
        h.shape(fn, col, bulge=.8, tex='hair', shine=.35, aok=0, dark=.9 if sd > 0 else 1)

def front_or_back(sp, fr, back=False, seed=1):
    h = Hi(48, 72, seed=seed, gs=RGS if RETRO else GS, K=16 if RETRO else 8)
    child = sp.get('child'); cy = 30 if child else 20
    bob = [0, -1, -1][fr]
    skin = SK[sp['skin']]
    g = sp['garb']
    if not back:
        hair_back_front(h, sp, cy + bob, sp.get('hair_bottom', 47 if not child else 46))
    if g == 'kupam':
        feet_dress(h, fr)
        top = (46 if child else 42) + bob
        h.shape(poly([(CX - 11, top), (CX + 11, top), (CX + 13.5, 67), (CX - 13.5, 67)]), sp['dress'], bulge=1.0, tex='cloth')
        folds(h, (CX - 7, CX - 2, CX + 4, CX + 9), top + 4, 66, dk(sp['dress'], .4), np.minimum(1, hx(sp['dress']) * 1.9))
        by = (54 if child else 51) + bob
        h.shape(R(CX - 12, by, CX + 12, by + 4), sp['belt'], bulge=.5, tex='cloth')
        for x in range(CX - 11, CX + 12, 3): h.line([(x, by + 1), (x + 1.5, by + 2.5)], '#e85a3a', w=.9)
        st = (42 if child else 31.5) + bob
        ik = poly([(CX - 14.5, by), (CX + 14.5, by), (CX + 13.5, st + 4.5), (CX + 6, st), (CX - 6, st), (CX - 13.5, st + 4.5)])
        h.shape(ik, sp['shawl'], bulge=1.2, tex='cloth')
        if sp.get('old'):
            band_motif(h, by - 6, CX - 14, CX + 14, dk(sp['shawl'], .55), '#f0c040', '#e8e0f0')
        h.line([(CX - 14, by - 1.5), (CX + 14, by - 1.5)], '#c23a26', w=1.4)
        for x in range(CX - 13, CX + 14, 3): h.line([(x, by - 1.8), (x + 1, by - 1.2)], '#f0c040', w=.8)
        if not back:
            h.shape(poly([(CX - 3.5, st), (CX + 3.5, st), (CX, st + 6.5)]), skin, bulge=.6, dark=.85, line=False)
            h.cast(sc(U(E(CX, cy + bob, 11, 11.6), E(CX, cy + 5 + bob, 8.6, 7.6)), CX, cy + bob), dx=.3, dy=2.5, k=.5)
            if sp.get('tupu'):
                h.shape(E(CX, st + 8, 2.8, 2.8), '#c8ccd8', bulge=1.5, shine=1.6, line=False)
                h.shape(R(CX - .7, st + 10, CX + .7, st + 16.5), '#b8bcc8', bulge=1, shine=1, line=False)
            if sp.get('trapel'):
                sv = '#c8ccd8'; y = st + 4
                h.shape(poly([(CX - 7, y), (CX + 7, y), (CX + 6, y + 3), (CX - 6, y + 3)]), sv, bulge=1.2, shine=1.4, line=False)
                for x in (CX - 4, CX - 1, CX + 2, CX + 5): h.shape(R(x - .5, y + 3, x + .4, y + 9), '#a8acb8', bulge=.6, shine=.8, line=False, ao=False)
                h.shape(poly([(CX - 6, y + 9), (CX + 6, y + 9), (CX + 5, y + 11), (CX - 5, y + 11)]), sv, bulge=1.2, shine=1.4, line=False)
                for x in (CX - 4, CX, CX + 4): h.shape(poly([(x - 1.6, y + 11.5), (x + 1.6, y + 11.5), (x, y + 14.5)]), sv, bulge=1, shine=1.2, line=False)
        arms_front(h, sp['shawl'], skin, st + 2.5, by - 3, 14.2, fr)
        if back: hair_back_front(h, sp, cy + bob, sp.get('hair_bottom', 47 if not child else 46))
        elif sp.get('locks'): front_locks(h, sp['hair'], cy + bob, by - 7)
    else:
        top = (56 if child else 52) + bob
        legs_front(h, sp, fr, top, sp.get('pants', '#2e3350'))
        if sp.get('staff') and not back:
            h.shape(R(CX + 15.6, 9 + bob, CX + 17.6, 70), '#6a4424', bulge=.8, tex='wood')
            h.shape(E(CX + 16.6, 8 + bob, 2.4, 3), '#c8ccd8', bulge=1.3, shine=1.5)
        if g == 'makun':
            col = sp['poncho']; st = 31 + bob
            h.shape(poly([(CX - 18, 56 + bob), (CX + 18, 56 + bob), (CX + 15, st + 5), (CX + 6, st), (CX - 6, st), (CX - 15, st + 5)]), col, bulge=1.2, tex='cloth')
            folds(h, (CX - 11, CX - 4, CX + 5, CX + 12), st + 6, 54 + bob, dk(col, .45), np.minimum(1, hx(col) * 1.25))
            band_motif(h, 45 + bob, CX - 17, CX + 17, sp['bandg'], sp['ma'], sp['mb'])
            h.line([(CX - 18, 55.4 + bob), (CX + 18, 55.4 + bob)], dk(col, .5), w=1)
            if not back: h.line([(CX - 6, st), (CX, st + 4), (CX + 6, st)], dk(col, .4), w=.9)
            arms_front(h, col, skin, st + 4, 54 + bob, 16, fr)
        else:   # tunic (child) or shirt (palin player)
            col = sp.get('tunic') or sp.get('shirt'); st = (42 if child else 31) + bob; bot = (58 if child else 54) + bob; hw = 12 if child else 15
            h.shape(poly([(CX - hw, bot), (CX + hw, bot), (CX + hw - 1, st + 3), (CX + 5, st), (CX - 5, st), (CX - hw + 1, st + 3)]), col, bulge=1.2, tex='cloth')
            if child: band_motif(h, 51 + bob, CX - 11, CX + 11, '#8a2a20', '#f0c040', '#f4ecdc')
            else:
                folds(h, (CX - 8, CX + 8), st + 6, bot - 1, dk(col, .45), np.minimum(1, hx(col) * 1.3))
                h.shape(R(CX - hw, bot - 3, CX + hw, bot), '#f0ece4', bulge=.4, tex='cloth')        # white waist sash
            arms_front(h, col, skin, st + 2, bot - 2, hw + .4 if child else 16, fr)
        if not back:
            h.cast(sc(U(E(CX, cy + bob, 11, 11.6), E(CX, cy + 5 + bob, 8.6, 7.6)), CX, cy + bob), dx=.3, dy=2.5, k=.5)
        if back: hair_back_front(h, sp, cy + bob, sp.get('hair_bottom', 47))
    head_front(h, sp, cy + bob, back=back)
    p = h.reduce(colors=16 if RETRO else 40)
    if not back: (face_retro if RETRO else face_front)(p, sp, cy + bob)
    return p.image()

def face_front(p, sp, cy):
    old = sp.get('old')
    iris = ('#1e0e08', '#4a2412', '#7a4220', '#a8662e', '#c8884a')
    ey = cy + 2
    for side, ex in ((-1, CX - 10), (1, CX + 4)):
        X, Y = p.at(ex, ey)
        P = lambda dx, dy, c: p.px(X + dx, Y + dy, c)
        if old:
            for k in range(6): P(k, 1 - (1 if 1 <= k <= 4 else 0), '#1e1018')
            P(6 if side > 0 else -1, 2, '#8a5a40'); P(6 if side > 0 else -1, 3, '#8a5a40')
            for k in range(6): P(k, -4, '#e0dce4')
            continue
        Wt, Wd = '#f6eef0', '#d8cccc'
        rows = [[Wt, iris[1], iris[0], iris[0], iris[1], Wd], [Wt, iris[1], '#0a0406', '#0a0406', iris[1], Wd],
                [Wt, iris[1], '#0a0406', '#0a0406', iris[2], Wd], [Wd, iris[2], iris[3], iris[3], iris[2], Wd], [None, iris[3], iris[4], iris[4], iris[3], None]]
        for dy, row in enumerate(rows):
            for dx, c in enumerate(row):
                if c: P(dx, dy - 1, c)
        P(1, 0, '#ffffff'); P(2, 0, '#ffffff'); P(1, 1, '#fff2ea'); P(4, 2, '#f0d8c0')
        for dx in range(-1, 7): P(dx, -2 - (1 if 1 <= dx <= 4 else 0), '#140810')
        for dx in range(1, 5): P(dx, -2, iris[0])
        P(6 if side > 0 else -1, -3, '#140810'); P(7 if side > 0 else -2, -4, '#140810')
        for dx in range(1, 5): P(dx, 4, '#b07050')
        for dx in range(0, 6): P(dx, -7 + (1 if (dx > 3 and side < 0) or (dx < 2 and side > 0) else 0), '#24161c')
    X, Y = p.at(CX, cy + 3)
    P = lambda dx, dy, c: p.px(X + dx, Y + dy, c)
    P(-1, 3, '#9a5c40'); P(-1, 4, '#9a5c40'); P(0, 4, '#b87050')
    P(-3, 7, '#8a3a2e'); P(2, 7, '#8a3a2e')
    for dx in range(-2, 2): P(dx, 8, '#6a2420')
    P(-1, 9, '#c86a5a'); P(0, 9, '#c86a5a')
    for bx in (-12, 8):
        P(bx + 1, 4, '#e88878'); P(bx + 2, 4, '#e88878'); P(bx + 3, 4, '#dc9a80')
    if old:
        P(-6, 7, '#8a5038'); P(-5, 8, '#8a5038'); P(5, 7, '#8a5038'); P(4, 8, '#8a5038')

def face_retro(p, sp, cy):
    """16-bit style face: two short dark eye strokes, a hint of a mouth"""
    for ex in (CX - 5, CX + 5):
        X, Y = p.at(ex, cy + 3)
        if sp.get('old'):
            p.px(X - 1, Y + 1, '#2a1418'); p.px(X, Y + 1, '#2a1418')
        else:
            p.px(X, Y, '#140a10'); p.px(X, Y + 1, '#140a10')
    X, Y = p.at(CX, cy + 11)
    p.px(X, Y, '#8a4a36')

# ------------------------------------------------------------------ SIDE (facing left)
def side(sp, fr, seed=1, pose=None):
    h = Hi(48, 72, seed=seed, gs=RGS if RETRO else GS, K=16 if RETRO else 8)
    child = sp.get('child'); cy = 30 if child else 20
    bob = [0, -1, -1][fr]; cy += bob
    skin = SK[sp['skin']]; hair = sp['hair']; g = sp['garb']
    hx0 = CX + 1
    # long hair down the back (right side)
    if sp['style'] == 'long':
        hb = sp.get('hair_bottom', 46 if not child else 44) + bob
        h.shape(U(sc(E(hx0 + 2, cy - 1, 12.5, 13.5), hx0, cy), poly([(hx0 + 2, cy), (hx0 + 14, cy), (hx0 + 13, hb), (hx0 + 3, hb + 2)])), hair, bulge=.8, tex='hair', ao=False)
    swing = [0, 1, -1][fr]
    # far arm (behind body) swings opposite
    def arm(near, sw):
        ax = CX + (1 if near else 3)
        y0 = (44 if child else 34) + bob; L = 14 if not child else 11
        tip = (ax - sw * 5, y0 + L)
        fn = poly([(ax - 3, y0), (ax + 3, y0), (tip[0] + 2.8, tip[1] - 1), (tip[0] - 2.8, tip[1] - 1)])
        col = sp.get('shawl') or sp.get('poncho') or sp.get('tunic') or sp.get('shirt')
        h.cast(fn, dx=.8, dy=.6, k=.25) if near else None
        h.shape(fn, col, bulge=1.0, tex='cloth', dark=1 if near else .72)
        h.shape(E(tip[0], tip[1] + 1.5, 2.8, 3), skin, bulge=1.2, dark=1 if near else .75)
    if not sp.get('wino'): arm(False, -swing)
    # legs / skirt
    if g == 'kupam':
        top = (46 if child else 42) + bob
        for k, d in ((0, -swing), (1, swing)):
            h.shape(E(CX - 2 + d * 4 - 2, 68 + (0 if d >= 0 else -1), 4.6, 2.6), '#5a3a22', bulge=1.1, tex='wood', dark=.85 if k == 0 else 1)
        h.shape(poly([(CX - 8, top), (CX + 8, top), (CX + 10 - swing, 67), (CX - 11 + swing, 67)]), sp['dress'], bulge=1.0, tex='cloth')
        folds(h, (CX - 4, CX + 2, CX + 6), top + 4, 66, dk(sp['dress'], .4), np.minimum(1, hx(sp['dress']) * 1.9))
        st = (42 if child else 31.5) + bob; by = (54 if child else 51) + bob
        h.shape(poly([(CX - 11, by), (CX + 10, by), (CX + 9, st + 4), (CX + 4, st), (CX - 5, st), (CX - 10, st + 4)]), sp['shawl'], bulge=1.2, tex='cloth')
        h.shape(R(CX - 9, by, CX + 9, by + 4), sp['belt'], bulge=.5, tex='cloth')
        h.line([(CX - 10, by - 1.5), (CX + 9, by - 1.5)], '#c23a26', w=1.4)
    else:
        top = (56 if child else 52) + bob
        pc = sp.get('pants', '#2e3350')
        for k, d in ((0, -swing), (1, swing)):
            fx = CX - 1 + d * 4
            h.shape(poly([(CX - 4, top), (CX + 3, top), (fx + 3, 66), (fx - 3, 66)]), pc, bulge=.9, tex='cloth', dark=.8 if k == 0 else 1)
            h.shape(E(fx - 2, 68, 4.8, 2.6), '#5a3a22', bulge=1.1, tex='wood', dark=.85 if k == 0 else 1)
        col = sp.get('poncho') or sp.get('tunic') or sp.get('shirt')
        st = (42 if child else 31) + bob; bot = (58 if child else (56 if g == 'makun' else 54)) + bob
        hw = 9 if child else (12 if g == 'makun' else 9.5)
        h.shape(poly([(CX - hw, bot), (CX + hw, bot), (CX + hw - 1.5, st + 4), (CX + 3, st), (CX - 5, st), (CX - hw + 1, st + 4)]), col, bulge=1.2, tex='cloth')
        if g == 'makun':
            band_motif(h, 45 + bob, CX - hw + .5, CX + hw - .5, sp['bandg'], sp['ma'], sp['mb'])
        elif child: band_motif(h, 51 + bob, CX - hw + .5, CX + hw - .5, '#8a2a20', '#f0c040', '#f4ecdc')
        else: h.shape(R(CX - hw, bot - 3, CX + hw, bot), '#f0ece4', bulge=.4, tex='cloth')
    # head in profile
    h.cast(sc(E(hx0, cy + 2, 10, 11), hx0, cy), dx=.4, dy=2.4, k=.45)
    h.shape(sc(U(E(hx0 + 1.5, cy, 10, 11.2), E(hx0 - 3.5, cy + 5, 6.6, 7), E(hx0 - 8.6, cy + 1, 2.6, 4.2), E(hx0 - 10.2, cy + 3.4, 2.4, 1.8)), hx0, cy), skin, bulge=.6, tex='skin', amb=.6)   # skull, jaw, brow, nose
    h.darken(sc(lambda X, Y: X > hx0 + 3, hx0, cy), .88)
    h.shape(sc(E(hx0 + 4.5, cy + 3, 2.2, 3.2), hx0, cy), skin, bulge=.9, dark=.9)                                         # ear
    # hair: top and back of the head, fringe at the brow
    hf = sc(poly([(hx0 - 10, cy - 2.5), (hx0 - 9, cy - 9), (hx0 - 2, cy - 14), (hx0 + 7, cy - 13.5), (hx0 + 12.5, cy - 6), (hx0 + 12.5, cy + 10), (hx0 + 7.5, cy + 12),
                  (hx0 + 6.5, cy + 1), (hx0 + 3, cy - 3), (hx0 - 2, cy - 5), (hx0 - 6, cy - 3)]), hx0, cy)
    h.cast(hf, dx=-.3, dy=1.2, k=.3, blur=.6)
    h.shape(hf, hair, bulge=.9, tex='hair', shine=.5, aok=0)
    h.shape(sc(poly([(hx0 - 10.5, cy - 7.5), (hx0 + 12.5, cy - 5), (hx0 + 12.5, cy - 2), (hx0 - 10.5, cy - 4.5)]), hx0, cy), sp['band'], bulge=.4, tex='cloth', aok=.1)
    h.shape(sc(E(hx0 - 8, cy - 5.6, 1.8, 1.8), hx0, cy), '#c8ccd8', bulge=1.3, shine=1.4, line=False)
    # near arm and the wiño
    if sp.get('wino'):
        # both hands forward and low, holding the stick that sweeps to the ground in front
        ys = 36 + bob
        # the wiño: a long stick from the hands down to the ground, ending in a curved head
        def stick(X, Y):
            x0, y0, x1, y1 = CX - 3, ys + 3, CX - 16, 66
            t = np.clip(((X - x0) * (x1 - x0) + (Y - y0) * (y1 - y0)) / ((x1 - x0) ** 2 + (y1 - y0) ** 2), 0, 1)
            d = np.hypot(X - (x0 + t * (x1 - x0)), Y - (y0 + t * (y1 - y0)))
            return d < .95
        hook = lambda X, Y: ((((X - (CX - 19.5)) / 4.2) ** 2 + ((Y - 66) / 3) ** 2) <= 1) & ((((X - (CX - 19)) / 2.4) ** 2 + ((Y - 64.6) / 1.6) ** 2) > 1) & (Y > 64)
        h.shape(U(stick, hook), '#8a5a2a', bulge=.8, tex='wood')
        h.shape(poly([(CX - 1, ys), (CX + 4, ys), (CX - 6, ys + 12), (CX - 10, ys + 10)]), sp['shirt'], bulge=1.0, tex='cloth')
        h.shape(E(CX - 8.5, ys + 11, 2.8, 2.8), skin, bulge=1.2)
    else:
        arm(True, swing)
    p = h.reduce(colors=16 if RETRO else 40)
    if RETRO:
        X, Y = p.at(hx0 - 6, cy + 3)
        if sp.get('old'): p.px(X, Y + 1, '#2a1418'); p.px(X + 1, Y + 1, '#2a1418')
        else: p.px(X, Y, '#140a10'); p.px(X, Y + 1, '#140a10')
        return p.image()
    # profile eye, mouth, cheek
    X, Y = p.at(hx0 - 5, cy + 2)
    P = lambda dx, dy, c: p.px(X + dx, Y + dy, c)
    if sp.get('old'):
        for k in range(4): P(k - 1, 1 - (1 if k in (1, 2) else 0), '#1e1018')
        for k in range(4): P(k - 1, -4, '#e0dce4')
    else:
        for dy, row in enumerate([['#4a2412', '#0a0406', '#7a4220'], ['#7a4220', '#0a0406', '#a8662e'], ['#a8662e', '#c8884a', '#e8dcdc'], ['#c8884a', '#d8cccc', None]]):
            for dx, c in enumerate(row):
                if c: P(dx - 1, dy - 1, c)
        P(0, -1, '#ffffff')
        for dx in range(-2, 3): P(dx, -2 - (1 if dx in (0, 1) else 0), '#140810')
        P(-2, -3, '#140810')
        for dx in range(-1, 3): P(dx, -6, '#24161c')
    X, Y = p.at(hx0 - 8, cy + 8.5)
    p.px(X, Y, '#6a2420'); p.px(X + 1, Y, '#7a3026'); p.px(X + 1, Y - 1, '#8a3a2e')
    X, Y = p.at(hx0 - 4, cy + 6)
    p.px(X, Y, '#e88878'); p.px(X + 1, Y, '#e88878')
    return p.image()

def sprite(name, view='front', fr=0, seed=None):
    sp = SPECS[name]; seed = seed or (abs(hash(name)) % 97 + 1)
    if view == 'front': return front_or_back(sp, fr, False, seed)
    if view == 'back': return front_or_back(sp, fr, True, seed)
    im = side(sp, fr, seed)
    return im if view == 'left' else im.transpose(Image.FLIP_LEFT_RIGHT)

if __name__ == '__main__':
    import os, sys
    from PIL import ImageDraw
    os.makedirs('/home/claude/px/cast', exist_ok=True)
    names = sys.argv[1:] or ['llanka', 'weaver']
    rows = []
    for n in names:
        row = []
        for view in ('front', 'back', 'left'):
            for fr in (0, 1, 2):
                im = sprite(n, view, fr); im.save(f'/home/claude/px/cast/{n}_{view}{fr}.png'); row.append(im)
        rows.append(row)
    k = 3; cw, ch = 66, 98
    sheet = Image.new('RGBA', (9 * cw * k + 20, len(rows) * ch * k + 20), (110, 140, 100, 255))
    for r, row in enumerate(rows):
        for i, im in enumerate(row):
            sheet.alpha_composite(im.resize((im.width * k, im.height * k), Image.NEAREST), (10 + i * cw * k, 10 + r * ch * k))
    sheet.save('/home/claude/px/cast/views.png'); print('ok')
