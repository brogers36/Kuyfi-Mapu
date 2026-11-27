"""Retro but realistic: adult proportions (about 5 heads tall) on the game's own pixel grid, painted at 16x
with light, contact shadows and material texture, reduced to ~18 colours, then finished by hand-placed pixels
(eyes, trarilonko, silver, woven patterns). Designed directly in final game pixels (24x40). Preview stage."""
import numpy as np
from PIL import Image
from hr import Hi, E, R, poly, U, I, hx

W, H = 26, 42
CX = 13.0
SK = {'skin': '#e2a472', 'old': '#d09466', 'dark': '#c08654'}

def dk(c, k): return np.clip(hx(c) * k, 0, 1)

SPECS = {
 'weaver':  dict(sex='f', skin='skin', hair='#2a2234', band='#3048b0', dress='#2a2640', shawl='#2a8a72', belt='#2c4aa8', tupu=True),
 'teacher': dict(sex='f', skin='skin', hair='#2a2234', band='#c89a20', dress='#262238', shawl='#c8a030', belt='#3a5ab8', tupu=True),
 'cook':    dict(sex='f', skin='dark', hair='#241c2a', band='#b8322a', dress='#2a2236', shawl='#c46a1c', belt='#a82a20', tupu=True),
 'kuku':    dict(sex='f', skin='old', hair='#c4c0cc', band='#b8322a', dress='#22202e', shawl='#7a3aa0', belt='#b02a22', trapel=True, old=True),
 'childf':  dict(sex='f', skin='skin', hair='#2a2234', band='#c8322a', dress='#2a2640', shawl='#c84a6a', belt='#3a5ab8', child=True),
 'llanka':  dict(sex='m', skin='skin', hair='#221c2a', band='#b8322a', poncho='#2e5ac0', bandg='#16245a', ma='#e04a34', mb='#f0ece4', pants='#2a2e44'),
 'lonko':   dict(sex='m', skin='skin', hair='#221c2a', band='#b8322a', poncho='#a8482a', bandg='#1e1a2c', ma='#f0ece4', mb='#e8c048', pants='#2a2e44', staff=True),
 'walker':  dict(sex='m', skin='dark', hair='#221c2a', band='#2a6a3a', poncho='#5a6a3a', bandg='#2a2018', ma='#e8d8a8', mb='#b83a26', pants='#2e2a24'),
 'kona':    dict(sex='m', skin='dark', hair='#221c2a', band='#c8322a', poncho='#7a2a2a', bandg='#1a1420', ma='#f0ece4', mb='#d8a838', pants='#2a2e44'),
 'child':   dict(sex='m', skin='skin', hair='#2a2234', band='#d0a030', poncho='#c8b48c', bandg='#8a2a20', ma='#f0c040', mb='#f4ecdc', pants='#3a5aa8', child=True),
 'palinA':  dict(sex='m', skin='dark', hair='#1e1824', band='#f0ece4', shirt='#b8322a', pants='#2a2230', palin=True),
 'palinB':  dict(sex='m', skin='skin', hair='#1e1824', band='#f0ece4', shirt='#2e5ab8', pants='#2a2230', palin=True),
}

class Fig:
    """coordinates in final pixels; a child is the same figure scaled down about the feet"""
    def __init__(s, sp, seed):
        s.sp = sp; s.k = .7 if sp.get('child') else .86
        s.h = Hi(W, H, K=16, seed=seed)
    def T(s, fn):
        k = s.k
        return lambda X, Y: fn(CX + (X - CX) / k, 40 + (Y - 40) / k)
    def p(s, x, y):  # design point -> canvas point
        return CX + (x - CX) * s.k, 40 + (y - 40) * s.k
    def shape(s, fn, col, **kw): return s.h.shape(s.T(fn), col, **kw)
    def cast(s, fn, **kw): return s.h.cast(s.T(fn), **kw)
    def line(s, pts, col, **kw): return s.h.line([s.p(*q) for q in pts], col, **kw)
    def darken(s, fn, k): return s.h.darken(s.T(fn), k)

def head(f, side=False, back=False, bob=0):
    sp = f.sp; skin = SK[sp['skin']]; hair = sp['hair']; cy = 6.6 + bob
    if side:
        f.shape(U(E(CX + .6, cy, 3.4, 4.1), E(CX - 1.8, cy + 1.6, 2.2, 2.6), E(CX - 3.4, cy + .6, .9, 1.1)), skin, bulge=.35, tex='skin', amb=.8)
        f.shape(poly([(CX - 3.2, cy - 1.6), (CX - 2.2, cy - 3.8), (CX + .6, cy - 4.6), (CX + 3.6, cy - 3.4), (CX + 4.2, cy), (CX + 4.0, cy + 3.6 if sp['sex'] == 'm' else cy + 11),
                      (CX + 1.6, cy + (3.6 if sp['sex'] == 'm' else 11)), (CX + 1.4, cy + .2), (CX - .4, cy - 1.4), (CX - 2.2, cy - .8)]), hair, bulge=.8, tex='hair', shine=.4, aok=.2)
        return cy
    if back:
        f.shape(U(E(CX, cy - .2, 3.9, 4.4), R(CX - 3.8, cy, CX + 3.8, cy + (11.5 if sp['sex'] == 'f' else 3.6))), hair, bulge=.8, tex='hair', shine=.35)
        return cy
    f.shape(E(CX, cy, 3.5, 4.2), skin, bulge=.35, tex='skin', amb=.82)
    f.darken(lambda X, Y: (((X - CX) / 3.5) ** 2 + ((Y - cy) / 4.2) ** 2 <= 1) & (X > CX + 1.6), .88)
    f.shape(E(CX - 3.4, cy + .6, .7, 1.1), skin, bulge=.6); f.shape(E(CX + 3.4, cy + .6, .7, 1.1), skin, bulge=.6, dark=.85)
    # hair: parted, falling to the jaw (men) or the shoulders (women)
    cap = lambda X, Y: (((X - CX) / 3.95) ** 2 + ((Y - (cy - 1.6)) / 3.0) ** 2 <= 1) & (Y < cy - 1.1 + .35 * np.abs(X - CX))
    locks = U(poly([(CX - 4.0, cy - 1.8), (CX - 3.0, cy - 1.8), (CX - 3.1, cy + 2.6), (CX - 3.9, cy + 3.0)]),
              poly([(CX + 4.0, cy - 1.8), (CX + 3.0, cy - 1.8), (CX + 3.1, cy + 2.6), (CX + 3.9, cy + 3.0)]))
    f.shape(U(cap, locks), hair, bulge=.8, tex='hair', shine=.45, aok=.25)
    return cy

def body_f(f, fr=0, back=False, side=False):
    sp = f.sp; skin = SK[sp['skin']]
    step = [0, 1, -1][fr]
    # long hair behind (front and side views)
    if not back:
        if side: pass
        else: f.shape(U(E(CX, 5.2, 4.1, 3.6), R(CX - 4.1, 5.2, CX + 4.1, 17.2), E(CX, 17.2, 4.1, 1.4)), sp['hair'], bulge=.6, tex='hair', ao=False)
    # feet
    for x, dy in ((CX - 2 + (side and -1 or 0) * step, max(0, step) if not side else 0), (CX + 2 + (side and 1 or 0) * step, max(0, -step) if not side else 0)):
        f.shape(E(x, 38.8 - dy * .8, 1.6, .9), '#4a301c', bulge=.9, tex='wood')
    # küpam: long black dress, slightly flared
    w0, w1 = (3.4, 4.4) if side else (4.0, 5.0)
    f.shape(poly([(CX - w0, 20), (CX + w0, 20), (CX + w1 + (side and step * .4 or 0), 38.4), (CX - w1 + (side and step * .4 or 0), 38.4)]), sp['dress'], bulge=1.0, tex='cloth')
    for x in ((CX - 2, CX + 1.5) if not side else (CX,)):
        f.line([(x, 22), (x + (x - CX) * .25, 38)], dk(sp['dress'], .45), w=.5, alpha=.7)
    # trariwe
    f.shape(R(CX - w0 - .2, 19.4, CX + w0 + .2, 21.2), sp['belt'], bulge=.4, tex='cloth')
    # ikülla over the shoulders, pinned at the chest
    sw = 4.6 if side else 6.2
    f.shape(poly([(CX - sw, 19.6), (CX + sw, 19.6), (CX + sw - .4, 12.6), (CX + 2.4, 10.8), (CX - 2.4, 10.8), (CX - sw + .4, 12.6)]), sp['shawl'], bulge=1.1, tex='cloth')
    f.line([(CX - sw + .2, 19.2), (CX + sw - .2, 19.2)], '#c23a26', w=.6, alpha=.9)
    # arms and hands
    sw_ = [0, .6, -.6][fr]
    for sd in ((-1, 1) if not side else (1,)):
        hxp = CX + sd * (sw - .6) + (side and -2.5 or 0)
        f.shape(E(hxp, 20.6 + sd * sw_, .95, 1.1), skin, bulge=.9, dark=.9 if sd > 0 else 1)
    if not back and not side:
        f.cast(E(CX, 7, 3.5, 4.2), dx=0, dy=1.6, k=.4)
        f.shape(R(CX - .9, 10, CX + .9, 11.6), skin, bulge=.4, dark=.72)          # neck

def body_m(f, fr=0, back=False, side=False):
    sp = f.sp; skin = SK[sp['skin']]
    step = [0, 1, -1][fr]
    pc = sp['pants']
    if side:
        for k, d in ((0, -step), (1, step)):
            x = CX - .4 + d * 1.6
            f.shape(poly([(CX - 1.6, 25), (CX + 1.4, 25), (x + 1.2, 37.8), (x - 1.2, 37.8)]), pc, bulge=.8, tex='cloth', dark=.78 if k == 0 else 1)
            f.shape(E(x - .8, 38.8, 1.8, .9), '#4a301c', bulge=.9, tex='wood', dark=.85 if k == 0 else 1)
    else:
        for i, x in enumerate((CX - 2.1, CX + 2.1)):
            dy = [0, max(0, step), max(0, -step)][0] if fr == 0 else (1 if (i == 0) == (step > 0) else 0)
            f.shape(R(x - 1.5, 24, x + 1.5, 38 - dy * .6), pc, bulge=.8, tex='cloth')
            f.shape(E(x, 38.8 - dy * .6, 1.7, .9), '#4a301c', bulge=.9, tex='wood')
    if sp.get('staff') and not back and not side:
        f.shape(R(CX + 6.6, 4, CX + 7.4, 39.5), '#6a4424', bulge=.6, tex='wood')
        f.shape(E(CX + 7, 3.6, 1, 1.2), '#c8ccd8', bulge=1.2, shine=1.4, line=False)
    if sp.get('palin'):
        col = sp['shirt']; sw = 4.2 if side else 5.2
        f.shape(poly([(CX - sw, 24.5), (CX + sw, 24.5), (CX + sw - .3, 12.4), (CX + 2.2, 10.8), (CX - 2.2, 10.8), (CX - sw + .3, 12.4)]), col, bulge=1.1, tex='cloth')
        f.shape(R(CX - sw, 22.6, CX + sw, 24.6), '#ece6dc', bulge=.4, tex='cloth')          # white sash
        if side:   # arms forward holding the wiño low
            f.shape(poly([(CX - .5, 12.6), (CX + 1.8, 12.6), (CX - 2.8, 19.4), (CX - 4.4, 18.4)]), col, bulge=.9, tex='cloth')
            f.shape(E(CX - 4.2, 19.6, 1, 1), skin, bulge=.9)
        else:
            for sd in (-1, 1): f.shape(E(CX + sd * 5.6, 22.4, .95, 1.1), skin, bulge=.9)
    else:
        col = sp['poncho']; sw = 4.6 if side else 6.6
        f.shape(poly([(CX - sw, 26.2), (CX + sw, 26.2), (CX + sw - .6, 13), (CX + 2.4, 10.8), (CX - 2.4, 10.8), (CX - sw + .6, 13)]), col, bulge=1.1, tex='cloth')
        f.shape(R(CX - sw + .2, 21.6, CX + sw - .2, 23.8), sp['bandg'], bulge=.4, tex='cloth', aok=.1)
        for x in ((CX - 4, CX + 4) if not side else (CX - 2.5, CX + 2.5)):
            f.line([(x, 14), (x + (x - CX) * .12, 21)], dk(col, .5), w=.5, alpha=.7)
        f.line([(CX - sw, 25.9), (CX + sw, 25.9)], dk(col, .5), w=.5)
        for sd in ((-1, 1) if not side else (1,)):
            f.shape(E(CX + sd * (sw - .4) + (side and -2.6 or 0), 25.6 + sd * [0, .5, -.5][fr], .95, 1.1), skin, bulge=.9, dark=.9 if sd > 0 else 1)
    if not back and not side:
        f.cast(E(CX, 7, 3.5, 4.2), dx=0, dy=1.6, k=.4)
        f.shape(R(CX - .9, 10, CX + .9, 11.6), skin, bulge=.4, dark=.8)

def details(px, f, cy, view):
    """hand-placed pixels: eyes, brows, nose, mouth, trarilonko, silver, woven pattern"""
    sp = f.sp; k = f.k
    def P(x, y, c):
        X, Y = f.p(x, y); px.px(round(X - .5), round(Y - .5), c)
    band = sp['band']
    if view == 'front':
        for x in np.arange(CX - 3.5, CX + 3.6, 1): P(x, cy - 2.4, band)
        P(CX, cy - 2.4, '#e8ecf4'); P(CX - 2.5, cy - 2.4, '#c8ccd8'); P(CX + 2.5, cy - 2.4, '#c8ccd8')
        if sp.get('old'):
            P(CX - 1.6, cy + .6, '#3a2420'); P(CX + 1.6, cy + .6, '#3a2420')
        else:
            P(CX - 1.6, cy + .4, '#1a0e10'); P(CX + 1.6, cy + .4, '#1a0e10')
            P(CX - 2.6, cy + .4, '#f2e8e4'); P(CX + 2.6, cy + .4, '#e8dcd8')
            P(CX - 1.6, cy - .6, dk(sp['hair'], .6) * 255); P(CX + 1.6, cy - .6, dk(sp['hair'], .6) * 255)
        P(CX + .2, cy + 1.6, dk(SK[sp['skin']], .72) * 255)
        P(CX, cy + 2.8, '#a8503e')
        if sp.get('sex') == 'f' and not sp.get('palin'):
            if sp.get('tupu'): P(CX, 14.6, '#e8ecf4'); P(CX, 15.6, '#a8acb8')
            if sp.get('trapel'):
                for x in (CX - 1, CX, CX + 1): P(x, 13.4, '#d8dce6')
                for x in (CX - 1, CX + 1): P(x, 14.4, '#8a8e9a'); P(x, 15.4, '#8a8e9a')
                for x in (CX - 1, CX, CX + 1): P(x, 16.4, '#d8dce6')
                P(CX, 17.4, '#c8ccd8')
            for i, x in enumerate(np.arange(CX - 3.5, CX + 3.6, 1)): P(x, 20.2, '#f0c040' if i % 2 else '#e85a3a')
        elif not sp.get('palin'):
            for i, x in enumerate(np.arange(CX - 6, CX + 6.1, 1)):
                P(x, 22.7, sp['ma'] if i % 3 == 1 else (sp['mb'] if i % 3 == 0 else sp['bandg']))
    elif view == 'back':
        for x in np.arange(CX - 3.5, CX + 3.6, 1): P(x, cy - 2.4, band)
        P(CX - .5, cy - 1.4, band); P(CX + .5, cy - .4, band)
        if sp.get('sex') == 'm' and not sp.get('palin'):
            for i, x in enumerate(np.arange(CX - 6, CX + 6.1, 1)):
                P(x, 22.7, sp['ma'] if i % 3 == 1 else (sp['mb'] if i % 3 == 0 else sp['bandg']))
    else:   # side, facing left
        for x in np.arange(CX - 3, CX + 4.1, 1): P(x, cy - 2.6 + (x - CX) * .06, band)
        P(CX - 2.2, cy + .3, '#1a0e10') if not sp.get('old') else P(CX - 2.2, cy + .6, '#3a2420')
        P(CX - 3.2, cy + 2.6, '#7a3a2c')
        if sp.get('sex') == 'm' and not sp.get('palin'):
            for i, x in enumerate(np.arange(CX - 4, CX + 4.1, 1)):
                P(x, 22.7, sp['ma'] if i % 3 == 1 else (sp['mb'] if i % 3 == 0 else sp['bandg']))

def wino(img, fr, f):
    """the palin stick, drawn on the final grid in front of a side-view player (facing left)"""
    a = np.array(img).astype(int)
    pts = [f.p(CX - 4.2, 19.6), f.p(CX - 8.5, 38.6)]
    n = 30
    for t in np.linspace(0, 1, n):
        x = pts[0][0] + (pts[1][0] - pts[0][0]) * t; y = pts[0][1] + (pts[1][1] - pts[0][1]) * t
        X, Y = int(round(x)), int(round(y))
        if 0 <= X < a.shape[1] and 0 <= Y < a.shape[0]:
            a[Y, X] = (122, 80, 40, 255)
    ex, ey = pts[1]; ex, ey = int(round(ex)), int(round(ey))
    for X, Y, c in ((ex - 1, ey, (110, 72, 36)), (ex - 2, ey, (110, 72, 36)), (ex - 3, ey - 1, (96, 62, 30)), (ex, ey, (140, 96, 52))):
        if 0 <= X < a.shape[1]: a[Y, X] = c + (255,)
    return Image.fromarray(a.astype(np.uint8), 'RGBA')

def sprite(name, view='front', fr=0, seed=None):
    sp = SPECS[name]; seed = seed or (sum(map(ord, name)) % 97 + 1)
    f = Fig(sp, seed)
    side = view in ('left', 'right'); back = view == 'back'
    bob = [0, -.4, -.4][fr]
    if sp['sex'] == 'f': body_f(f, fr, back, side)
    else: body_m(f, fr, back, side)
    cy = head(f, side=side, back=back, bob=bob)
    px = f.h.reduce(colors=18)
    details(px, f, cy, 'side' if side else view)
    im = px.image()
    if sp.get('palin') and side: im = wino(im, fr, f)
    if view == 'right': im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return im

if __name__ == '__main__':
    import sys
    from PIL import ImageDraw
    names = sys.argv[1:] or ['kuku', 'weaver', 'llanka', 'lonko', 'child', 'palinA']
    ims = []
    for n in names:
        for v in ('front', 'back', 'left'):
            ims.append(sprite(n, v, 0))
    k = 4
    sheet = Image.new('RGBA', (len(ims) * (W + 4) * k + 20, (H + 4) * k + 20), (106, 150, 80, 255))
    for i, im in enumerate(ims): sheet.alpha_composite(im.resize((im.width * k, im.height * k), Image.NEAREST), (10 + i * (W + 4) * k, 10))
    sheet.save('/home/claude/px/cast/retro_sheet.png'); print('ok')
