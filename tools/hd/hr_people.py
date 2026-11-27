"""People with the paint-then-pixelate method (48x72, front view). Preview stage."""
import numpy as np
from hr import Hi, E, R, poly, U, I, hx

CX = 24
HS = 1.13   # head scale: bigger heads, closer to the reference proportions

def sc(fn, cy=20, k=HS):
    return lambda X, Y: fn(CX + (X - CX) / k, cy + (Y - cy) / k)
SKIN = '#dc9a68'; SKIN_OLD = '#c88a5e'

def head_shape(cy=20):
    return sc(U(E(CX, cy, 11, 11.6), E(CX, cy + 5, 8.6, 7.6)), cy)

def hair_back(h, col, cy=20, bottom=47, width=13.3):
    w = width * HS
    def fn(X, Y):
        wave = 1.1 * np.sin(Y * .55) + .6 * np.sin(Y * 1.3 + 1)
        body = (np.abs(X - CX) < w + wave * (Y > cy)) & (Y >= cy) & (Y < bottom)
        top = ((X - CX) / (w + .2)) ** 2 + ((Y - cy + 1) / (14 * HS)) ** 2 <= 1
        # lock ends: a zigzag hem
        k = ((X - CX + w) % 4.5) / 4.5
        tips = (np.abs(X - CX) < w) & (Y >= bottom) & (Y < bottom + 4 - 4 * np.abs(k - .5) * 2)
        return body | top | tips
    h.shape(fn, col, bulge=.7, tex='hair', ao=False)
    for x in np.arange(CX - w + 2, CX + w - 1, 4.5):
        h.line([(x, cy + 4), (x + .8, cy + 14), (x - .4, bottom + 1)], hx(col) * .55, w=.8, alpha=.6)

def front_locks(h, col, cy=20, to=40):
    """two locks falling in front of the shoulders"""
    for sd in (-1, 1):
        x0 = CX + sd * 12.4
        fn = poly([(x0 - 1.8, cy + 6), (x0 + 1.8, cy + 6), (x0 + sd * 1.5 + 1.6, to - 4), (x0 + sd * 1.2, to), (x0 + sd * 1.5 - 1.6, to - 4)])
        h.cast(fn, dx=.6, dy=.6, k=.3)
        h.shape(fn, col, bulge=.8, tex='hair', shine=.35, aok=0, dark=.9 if sd > 0 else 1)

def face(h, skin, cy=20):
    h.shape(sc(E(CX - 11, cy + 2, 2.2, 3.2), cy), skin, bulge=.8)
    h.shape(sc(E(CX + 11, cy + 2, 2.2, 3.2), cy), skin, bulge=.8, dark=.85)
    h.shape(head_shape(cy), skin, bulge=.55, tex='skin', amb=.62)
    h.darken(sc(lambda X, Y: (((X - CX) / 11) ** 2 + ((Y - cy - 2) / 13) ** 2 > .72) & (X > CX + 3), cy), .86)

def bangs(h, col, cy=20, shine=.5):
    tips = [(CX + 12, cy + 4), (CX + 10.5, cy - 3), (CX + 8, cy - 1), (CX + 6, cy - 6), (CX + 3, cy - 2.5), (CX + 1, cy - 7),
            (CX - 1.5, cy - 3), (CX - 4, cy - 7), (CX - 6, cy - 2), (CX - 8, cy - 6), (CX - 10, cy - 1), (CX - 12, cy + 4)]
    fn = sc(poly([(CX - 13, cy + 4), (CX - 12.5, cy - 8), (CX - 5, cy - 14.5), (CX + 5, cy - 14.5), (CX + 12.5, cy - 8), (CX + 13, cy + 4)][::-1] + tips[::-1]), cy)
    h.cast(fn, dx=.4, dy=1.2, k=.35, blur=.7)
    h.shape(fn, col, bulge=.9, tex='hair', shine=shine, aok=0)

def trarilonko(h, band, cy=20, metal='#c8ccd8'):
    h.shape(sc(I(R(CX - 14, cy - 8, CX + 14, cy - 5), E(CX, cy - 2, 13.8, 14.5)), cy), band, bulge=.4, tex='cloth', aok=.1)
    for x in range(CX - 12, CX + 13, 4):
        h.shape(sc(E(x, cy - 6.5, 1.1, 1.1), cy), metal, bulge=1.2, shine=1.2, ao=False, line=False)
    h.shape(sc(E(CX, cy - 6.5, 2.4, 2.2), cy), metal, bulge=1.4, shine=1.4, line=False)

def eyes(p, cy=20, old=False, iris=('#1e0e08', '#4a2412', '#7a4220', '#a8662e', '#c8884a')):
    ey = cy + 2
    for side, ex in ((-1, CX - 10), (1, CX + 4)):
        if old:
            for k in range(6): p.px(ex + k, ey + 1 - (1 if 1 <= k <= 4 else 0), '#1e1018')
            p.px(ex + (6 if side > 0 else -1), ey + 2, '#8a5a40'); p.px(ex + (6 if side > 0 else -1), ey + 3, '#8a5a40')
            continue
        Wt, Wd = '#f6eef0', '#d8cccc'
        rows = [[Wt, iris[1], iris[0], iris[0], iris[1], Wd],
                [Wt, iris[1], '#0a0406', '#0a0406', iris[1], Wd],
                [Wt, iris[1], '#0a0406', '#0a0406', iris[2], Wd],
                [Wd, iris[2], iris[3], iris[3], iris[2], Wd],
                [None, iris[3], iris[4], iris[4], iris[3], None]]
        for dy, row in enumerate(rows):
            for dx, c in enumerate(row):
                if c: p.px(ex + dx, ey - 1 + dy, c)
        p.px(ex + 1, ey, '#ffffff'); p.px(ex + 2, ey, '#ffffff'); p.px(ex + 1, ey + 1, '#fff2ea'); p.px(ex + 4, ey + 2, '#f0d8c0')
        for dx in range(-1, 7): p.px(ex + dx, ey - 2 - (1 if 1 <= dx <= 4 else 0), '#140810')   # arched upper lash line
        for dx in range(1, 5): p.px(ex + dx, ey - 2, iris[0])
        p.px(ex + (6 if side > 0 else -1), ey - 3, '#140810'); p.px(ex + (7 if side > 0 else -2), ey - 4, '#140810')
        for dx in range(6): p.px(ex + dx, ey + 4, '#b07050') if 0 < dx < 5 else None   # lower lid
        for dx in range(0, 6):                                                         # brow
            p.px(ex + dx, ey - 7 + (1 if (dx > 3 and side < 0) or (dx < 2 and side > 0) else 0), '#24161c')

def mouth_nose(p, cy=20, skin_dark='#9a5c40', old=False):
    ey = cy + 3
    p.px(CX - 1, ey + 3, skin_dark); p.px(CX - 1, ey + 4, skin_dark); p.px(CX, ey + 4, '#b87050')
    for x, y in ((CX - 3, ey + 7), (CX + 2, ey + 7)): p.px(x, y, '#8a3a2e')
    for x in range(CX - 2, CX + 2): p.px(x, ey + 8, '#6a2420')
    p.px(CX - 1, ey + 9, '#c86a5a'); p.px(CX, ey + 9, '#c86a5a')
    for bx in (CX - 12, CX + 8):
        p.px(bx + 1, ey + 4, '#e88878'); p.px(bx + 2, ey + 4, '#e88878'); p.px(bx + 3, ey + 4, '#dc9a80')
    if old:
        p.px(CX - 6, ey + 7, skin_dark); p.px(CX - 5, ey + 8, skin_dark); p.px(CX + 5, ey + 7, skin_dark); p.px(CX + 4, ey + 8, skin_dark)

def arms(h, col, skin, top=34, y=48, dx=14.2, tex='cloth'):
    """draped sleeves: a sloping shoulder, the cloth widening to a soft cuff, a fold line, the hand below"""
    for sd in (-1, 1):
        fn = poly([(CX + sd * 7, top - .5), (CX + sd * 11, top - 1.6), (CX + sd * 14.5, top + 2), (CX + sd * 17.6, y - 3), (CX + sd * 17, y - .8),
                   (CX + sd * 12.6, y - .6), (CX + sd * 11.6, y - 3), (CX + sd * 10, top + 5)])
        h.cast(fn, dx=-sd * .7, dy=1.0, k=.32)
        h.shape(fn, col, bulge=1.1, tex=tex, dark=.9 if sd > 0 else 1)
        h.line([(CX + sd * 13, top + 3), (CX + sd * 15.4, y - 2)], hx(col) * .5 if isinstance(col, str) else np.asarray(col) * .5, w=.8, alpha=.7)
        h.shape(E(CX + sd * (dx + .6), y + 1, 2.9, 3.1), skin, bulge=1.2, dark=.9 if sd > 0 else 1)

def arms(h, col, skin, top=34, y=48, dx=14.2, tex='cloth'):
    for sd in (-1, 1):
        fn = poly([(CX + sd * 8, top), (CX + sd * 13, top - .5), (CX + sd * 16.5, y - 2.5), (CX + sd * 12, y - 1.5)])
        h.cast(fn, dx=-sd * .6, dy=.8, k=.3)
        h.shape(fn, col, bulge=1.0, tex=tex, dark=.9 if sd > 0 else 1)
        h.shape(E(CX + sd * dx, y + .5, 2.9, 3), skin, bulge=1.2, dark=.9 if sd > 0 else 1)

def folds(h, xs, y0, y1, dark, light):
    for x in xs:
        h.line([(x, y0), (x + (x - CX) / 5, y1)], dark, w=1.1, alpha=.75)
        h.line([(x - 1.3, y0 + 2), (x - 1.3 + (x - CX) / 5, y1 - 1)], light, w=.8, alpha=.45)

def shoes(h, gap=6, col='#5a3a22'):
    for x in (CX - gap, CX + gap):
        h.shape(E(x, 68, 4.2, 2.8), col, bulge=1.1, tex='wood')

def band_motif(h, y, x0, x1, ground, a, b):
    h.shape(R(x0, y, x1, y + 5), ground, bulge=.4, tex='cloth', aok=.15)
    for i, x in enumerate(np.arange(x0 + 2, x1 - 1, 5)):
        h.shape(poly([(x, y + .6), (x + 2.2, y + 2.5), (x, y + 4.4), (x - 2.2, y + 2.5)]), a if i % 2 else b, bulge=.3, ao=False, line=False)

def finish_head(h, skin, hair, band, cy=20):
    face(h, skin, cy)
    bangs(h, hair, cy)
    trarilonko(h, band, cy)

# ---------- characters ----------
def weaver(seed=1):
    h = Hi(48, 72, seed=seed)
    hair_back(h, '#2a2236')
    shoes(h)
    h.shape(poly([(CX - 11, 42), (CX + 11, 42), (CX + 13.5, 67), (CX - 13.5, 67)]), '#2a2640', bulge=1.0, tex='cloth')
    folds(h, (CX - 7, CX - 2, CX + 4, CX + 9), 46, 66, '#0c0a16', '#5a5480')
    h.shape(R(CX - 12, 51, CX + 12, 55), '#2c4aa8', bulge=.5, tex='cloth')
    for x in range(CX - 11, CX + 12, 3): h.line([(x, 52), (x + 1.5, 53.5)], '#e85a3a', w=.9)
    ik = poly([(CX - 14.5, 51), (CX + 14.5, 51), (CX + 13.5, 36), (CX + 6, 31.5), (CX - 6, 31.5), (CX - 13.5, 36)])
    h.shape(ik, '#2a8a72', bulge=1.2, tex='cloth')
    h.line([(CX - 14, 49.5), (CX + 14, 49.5)], '#c23a26', w=1.4)
    for x in range(CX - 13, CX + 14, 3): h.line([(x, 49.2), (x + 1, 49.8)], '#f0c040', w=.8)
    h.shape(poly([(CX - 3.5, 31.5), (CX + 3.5, 31.5), (CX, 38)]), SKIN, bulge=.6, dark=.85, line=False)
    h.cast(head_shape(), dx=.3, dy=2.5, k=.5)
    h.shape(E(CX, 39.5, 2.8, 2.8), '#c8ccd8', bulge=1.5, shine=1.6, line=False)
    h.shape(R(CX - .7, 41.5, CX + .7, 48), '#b8bcc8', bulge=1, shine=1, line=False)
    arms(h, '#2a8a72', SKIN)
    front_locks(h, '#2a2236', to=44)
    finish_head(h, SKIN, '#2a2236', '#3048b0')
    for sd in (-1, 1): h.shape(E(CX + sd * 11.5, 26, 1.3, 1.8), '#d0d4e0', bulge=1.3, shine=1.5, line=False)
    p = h.reduce(colors=40); eyes(p); mouth_nose(p)
    return p.image()

def kuku(seed=2):
    h = Hi(48, 72, seed=seed)
    hair_back(h, '#c8c4cc', bottom=45)
    shoes(h)
    h.shape(poly([(CX - 11, 44), (CX + 11, 44), (CX + 12.5, 67), (CX - 12.5, 67)]), '#22202e', bulge=1.0, tex='cloth')
    folds(h, (CX - 6, CX, CX + 6), 56, 66, '#0a0812', '#4a4664')
    ik = poly([(CX - 16, 55), (CX + 16, 55), (CX + 14, 37), (CX + 6, 32), (CX - 6, 32), (CX - 14, 37)])
    h.shape(ik, '#7a3aa0', bulge=1.2, tex='cloth')
    folds(h, (CX - 9, CX + 9), 40, 53, '#3a1050', '#a870c8')
    band_motif(h, 49, CX - 15, CX + 15, '#4a1a64', '#f0c040', '#e8e0f0')
    for x in range(CX - 15, CX + 16, 2): h.line([(x, 55), (x, 56.5)], '#e0b040', w=.7)
    h.cast(head_shape(), dx=.3, dy=2.5, k=.5)
    sv = '#c8ccd8'   # trapelakucha: top bar, chains, lower bar, pendants
    h.shape(poly([(CX - 7, 36), (CX + 7, 36), (CX + 6, 39), (CX - 6, 39)]), sv, bulge=1.2, shine=1.4, line=False)
    for x in (CX - 4, CX - 1, CX + 2, CX + 5): h.shape(R(x - .5, 39, x + .4, 45), '#a8acb8', bulge=.6, shine=.8, line=False, ao=False)
    h.shape(poly([(CX - 6, 45), (CX + 6, 45), (CX + 5, 47), (CX - 5, 47)]), sv, bulge=1.2, shine=1.4, line=False)
    for x in (CX - 4, CX, CX + 4): h.shape(poly([(x - 1.6, 47.5), (x + 1.6, 47.5), (x, 50.5)]), sv, bulge=1, shine=1.2, line=False)
    h.shape(R(CX - 11.5, 55, CX + 11.5, 58.5), '#b02a22', bulge=.5, tex='cloth')
    arms(h, '#7a3aa0', SKIN_OLD, top=36, y=52, dx=15.2)
    front_locks(h, '#c8c4cc', to=42)
    finish_head(h, SKIN_OLD, '#c8c4cc', '#b8322a')
    p = h.reduce(colors=40); eyes(p, old=True); mouth_nose(p, old=True, skin_dark='#8a5038')
    for x in range(CX - 10, CX - 4): p.px(x, 17, '#e0dce4')
    for x in range(CX + 4, CX + 10): p.px(x, 17, '#e0dce4')
    return p.image()

def makun_man(poncho, band_ground, ma, mb, band='#b8322a', staff=False, seed=3, skin=SKIN):
    h = Hi(48, 72, seed=seed)
    hair_back(h, '#241e2e', bottom=35, width=12.6)
    for x0 in (CX - 9, CX + 1):
        h.shape(R(x0, 52, x0 + 8, 66), '#2e3350', bulge=.9, tex='cloth')
    shoes(h, gap=5)
    if staff:
        h.shape(R(CX + 15.6, 9, CX + 17.6, 70), '#6a4424', bulge=.8, tex='wood')
        h.shape(E(CX + 16.6, 8, 2.4, 3), '#c8ccd8', bulge=1.3, shine=1.5)
    mk = poly([(CX - 18, 56), (CX + 18, 56), (CX + 15, 36), (CX + 6, 31), (CX - 6, 31), (CX - 15, 36)])
    h.shape(mk, poncho, bulge=1.2, tex='cloth')
    folds(h, (CX - 11, CX - 4, CX + 5, CX + 12), 37, 54, hx(poncho) * .45, np.minimum(1, hx(poncho) * 1.25))
    band_motif(h, 45, CX - 17, CX + 17, band_ground, ma, mb)
    h.line([(CX - 18, 55.4), (CX + 18, 55.4)], hx(poncho) * .5, w=1)
    h.line([(CX - 6, 31), (CX, 35), (CX + 6, 31)], hx(poncho) * .4, w=.9)
    h.cast(head_shape(), dx=.3, dy=2.5, k=.5)
    arms(h, poncho, skin, top=35, y=54, dx=16)
    finish_head(h, skin, '#241e2e', band)
    p = h.reduce(colors=40); eyes(p); mouth_nose(p)
    return p.image()

def lonko(): return makun_man('#a8482a', '#1e1a2c', '#f0ece4', '#e8c048', staff=True, seed=4)
def llanka(): return makun_man('#2e5ac0', '#16245a', '#e04a34', '#f0ece4', seed=5)

def child(seed=6):
    h = Hi(48, 72, seed=seed)
    cy = 30
    h.shape(U(E(CX, cy - 1, 13.2, 13.4), R(CX - 12.8, cy, CX + 12.8, cy + 9)), '#2a2236', bulge=.7, tex='hair', ao=False)
    for x0 in (CX - 8, CX + 1): h.shape(R(x0, 56, x0 + 7, 66), '#3a5aa8', bulge=.9, tex='cloth')
    shoes(h, gap=4.5)
    tu = poly([(CX - 12, 58), (CX + 12, 58), (CX + 11, 45), (CX + 5, 42), (CX - 5, 42), (CX - 11, 45)])
    h.shape(tu, '#d8c49c', bulge=1.2, tex='cloth')
    band_motif(h, 51, CX - 11, CX + 11, '#8a2a20', '#f0c040', '#f4ecdc')
    h.cast(head_shape(cy), dx=.3, dy=2.2, k=.45)
    arms(h, '#d8c49c', SKIN, top=44, y=56, dx=12.4)
    finish_head(h, SKIN, '#2a2236', '#d0a030', cy=cy)
    p = h.reduce(colors=40); eyes(p, cy=cy); mouth_nose(p, cy=cy)
    return p.image()

ALL = {'kuku': kuku, 'weaver': weaver, 'lonko': lonko, 'child': child, 'llanka': llanka}

if __name__ == '__main__':
    import os
    from PIL import Image, ImageDraw
    os.makedirs('/home/claude/px/hr', exist_ok=True)
    ims = {n: f() for n, f in ALL.items()}
    for n, im in ims.items(): im.save(f'/home/claude/px/hr/{n}.png')
    elf = Image.open('/home/claude/px/elf_crop.png').convert('RGB')
    eh = 74; ew = round(elf.width * eh / elf.height)
    elf_s = elf.resize((ew, eh), Image.BOX).quantize(48).convert('RGBA')
    k = 4
    sheet = Image.new('RGBA', ((ew + 52 * 5) * k + 40, 80 * k + 40), (110, 140, 100, 255)); d = ImageDraw.Draw(sheet)
    sheet.alpha_composite(elf_s.resize((ew * k, eh * k), Image.NEAREST), (10, 30))
    for i, im in enumerate(ims.values()):
        sheet.alpha_composite(im.resize((im.width * k, im.height * k), Image.NEAREST), (ew * k + 30 + i * 52 * k, 38))
    d.text((10, 8), 'reference (your elf, ~74 px)      kuku, weaver, lonko, child, Llanka  (48x72, all shown 4x)', fill=(255, 255, 255))
    sheet.save('/home/claude/px/hr/cast.png'); print('ok')
