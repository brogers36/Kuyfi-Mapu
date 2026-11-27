"""People with the paint-then-pixelate method (48x72). Preview stage."""
import numpy as np
from hr import Hi, E, R, poly, U, I, hx

CX = 24
SKIN = '#dc9a68'; HAIR = '#2a2236'; KUPAM = '#262238'

def head(h, skin=SKIN, hair=HAIR, cy=20, band='#b8322a', long_hair=True, white=False):
    hc = '#c8c4cc' if white else hair
    if long_hair:
        h.shape(U(E(CX, cy - 1, 13.5, 14), R(CX - 13.2, cy, CX + 13.2, 47), E(CX - 7, 47, 6.4, 3.2), E(CX + 7, 47, 6.4, 3.2)), hc, bulge=.7, tex='hair', ao=False)
    return hc

def face_and_bangs(h, skin=SKIN, hair='#2a2236', cy=20, band='#b8322a', bandmetal='#c8ccd8'):
    h.shape(U(E(CX, cy, 11, 11.6), E(CX, cy + 5, 8.6, 7.6)), skin, bulge=1.1, tex='skin')
    h.shape(E(CX - 11, cy + 2, 2.2, 3.2), skin, bulge=.8)                 # ears
    h.shape(E(CX + 11, cy + 2, 2.2, 3.2), skin, bulge=.8, dark=.88)
    tips = [(CX + 12, cy + 4), (CX + 10.5, cy - 3), (CX + 8, cy - 1), (CX + 6, cy - 6), (CX + 3, cy - 2.5), (CX + 1, cy - 7),
            (CX - 1.5, cy - 3), (CX - 4, cy - 7), (CX - 6, cy - 2), (CX - 8, cy - 6), (CX - 10, cy - 1), (CX - 12, cy + 4)]
    h.shape(poly([(CX - 13, cy + 4), (CX - 12.5, cy - 8), (CX - 5, cy - 14.5), (CX + 5, cy - 14.5), (CX + 12.5, cy - 8), (CX + 13, cy + 4)][::-1] + tips[::-1]),
            hair, bulge=.9, tex='hair', shine=.5, aok=.18)
    # trarilonko: woven band with silver pieces, across the forehead
    h.shape(I(R(CX - 14, cy - 8, CX + 14, cy - 5), E(CX, cy - 2, 13.8, 14.5)), band, bulge=.4, tex='cloth', aok=.12)
    for x in range(CX - 12, CX + 13, 4):
        h.shape(E(x, cy - 6.5, 1.1, 1.1), bandmetal, bulge=1.2, shine=1.2, ao=False, line=False)
    h.shape(E(CX, cy - 6.5, 2.4, 2.2), bandmetal, bulge=1.4, shine=1.4)

def eyes(p, cy=20, old=False, iris=('#2a140a', '#5a2e16', '#8a4e26', '#b07038')):
    ey = cy + 1
    for side, ex in ((-1, CX - 8), (1, CX + 3)):
        if old:
            for k in range(5): p.px(ex + k, ey + 1 - (1 if k in (1, 2, 3) else 0), '#1e1018')
            continue
        rows = [['#f4ecee', iris[0], iris[0], iris[0], '#e8dcdc'], ['#f4ecee', iris[1], '#0c0406', iris[1], '#e8dcdc'],
                ['#f0e6e8', iris[1], '#0c0406', iris[2], '#e0d0d0'], ['#e8dcdc', iris[2], iris[3], iris[2], '#dccccc'], [None, iris[3], iris[3], iris[3], None]]
        for dy, row in enumerate(rows):
            for dx, c in enumerate(row):
                if c: p.px(ex + dx, ey - 1 + dy, c)
        p.px(ex + 1, ey - 1, '#ffffff'); p.px(ex + 1, ey, '#fff6ee')
        for dx in range(-1, 6): p.px(ex + dx, ey - 2, '#160a12')
        p.px(ex + (5 if side > 0 else -1), ey - 3, '#160a12')
        for dx in range(0, 5): p.px(ex + dx, ey - 5 + (1 if (dx in (0,) and side < 0) or (dx == 4 and side > 0) else 0), '#24161c')

def mouth(p, cy=20, smile=True):
    ey = cy + 2
    for x, y in ((CX - 3, ey + 9), (CX - 2, ey + 10), (CX - 1, ey + 10), (CX, ey + 10), (CX + 1, ey + 9)):
        p.px(x, y, '#7a3026')

def weaver(seed=1):
    h = Hi(48, 72, seed=seed)
    head(h)
    for x in (CX - 6, CX + 6):
        h.shape(E(x, 68, 4.2, 2.8), '#5a3a22', bulge=1.1, tex='wood')                  # shoes
    h.shape(poly([(CX - 11, 42), (CX + 11, 42), (CX + 13.5, 67), (CX - 13.5, 67)]), KUPAM, bulge=1.0, tex='cloth')   # küpam
    for x in (CX - 7, CX - 2, CX + 4, CX + 9):
        h.line([(x, 46), (x + (x - CX) / 5, 66)], '#0c0a16', w=1.0, alpha=.7)
        h.line([(x - 1.2, 48), (x - 1.2 + (x - CX) / 5, 65)], '#4a4468', w=.7, alpha=.5)
    # ikülla (shawl), teal, with a woven red-yellow border
    h.shape(poly([(CX - 14.5, 51), (CX + 14.5, 51), (CX + 13.5, 36), (CX + 6, 31.5), (CX - 6, 31.5), (CX - 13.5, 36)]), '#2a8a72', bulge=1.2, tex='cloth')
    h.line([(CX - 14, 49.5), (CX + 14, 49.5)], '#c23a26', w=1.4)
    for x in range(CX - 13, CX + 14, 3): h.line([(x, 49.2), (x + 1, 49.8)], '#f0c040', w=.8)
    h.shape(poly([(CX - 3.5, 31.5), (CX + 3.5, 31.5), (CX, 38)]), SKIN, bulge=.6, dark=.9, line=False)
    # trariwe (belt) under the shawl
    h.shape(R(CX - 12, 51, CX + 12, 55), '#2c4aa8', bulge=.5, tex='cloth')
    for x in range(CX - 11, CX + 12, 3): h.line([(x, 52), (x + 1.5, 53.5)], '#e85a3a', w=.9)
    # tupu (shawl pin)
    h.shape(E(CX, 39.5, 2.8, 2.8), '#c8ccd8', bulge=1.5, shine=1.6, line=False)
    h.shape(R(CX - .7, 41.5, CX + .7, 48), '#b8bcc8', bulge=1, shine=1)
    # arms in sleeves of the shawl, hands
    for sd in (-1, 1):
        h.shape(poly([(CX + sd * 8, 34), (CX + sd * 13, 33.5), (CX + sd * 16.5, 46), (CX + sd * 12, 47)]), '#2a8a72', bulge=1.0, tex='cloth', dark=.92 if sd > 0 else 1)
        h.shape(E(CX + sd * 14.2, 48.5, 2.9, 3), SKIN, bulge=1.2, dark=.92 if sd > 0 else 1)
    face_and_bangs(h, band='#3048b0')
    for sd in (-1, 1):                                                                    # chaway (earrings)
        h.shape(E(CX + sd * 11.5, 26, 1.3, 1.8), '#d0d4e0', bulge=1.3, shine=1.5)
    p = h.reduce(colors=34)
    eyes(p); mouth(p)
    for bx in (CX - 10, CX + 6):
        p.px(bx + 1, 27, '#e48674'); p.px(bx + 2, 27, '#e48674')
    p.px(CX - 1, 27, '#a8684a'); p.px(CX - 1, 28, '#9a5c40')
    return p.image()

def laftrache(seed=3, scale=1.0):
    """little lake man, 64x72, facing right"""
    h = Hi(64, 72, seed=seed)
    cx = 30
    for x in (cx - 9, cx + 7):
        h.shape(E(x + 3, 68, 6.5, 3.2), '#3a2a1e', bulge=1.2, tex='wood')
    h.shape(poly([(cx - 15, 66), (cx + 15, 66), (cx + 13, 34), (cx - 13, 34)]), '#3e5e4c', bulge=1.2, tex='cloth')
    for x in (cx - 8, cx - 2, cx + 5, cx + 10):
        h.line([(x, 40), (x + (x - cx) * .15, 64)], '#1a2e24', w=.9, alpha=.7)
    h.shape(E(cx + 15, 52, 4, 3.6), '#b8805a', bulge=1.2)
    h.shape(E(cx + 2, 28, 13.5, 12.5), '#c08a62', bulge=1.2, tex='skin')
    h.shape(poly([(cx - 11, 30), (cx + 15, 30), (cx + 14, 46), (cx + 9, 58), (cx + 3, 62), (cx - 3, 59), (cx - 9, 50), (cx - 12, 39)]), '#e8e6ee', bulge=1.3, tex='hair')
    for x in range(cx - 8, cx + 14, 3):
        h.line([(x, 34), (x + 1, 56 - abs(x - cx - 2) * .7)], '#a8a4b4', w=.6, alpha=.55)
    h.shape(E(cx + 11, 30, 4.6, 4), '#d08e66', bulge=1.4, shine=.3)                       # nose
    h.shape(U(E(cx, 15, 19, 5.5), E(cx - 1, 9, 13, 9)), '#4a7a52', bulge=1.3, tex='moss')  # mossy cap
    h.shape(E(cx + 1, 17.5, 19, 2.6), '#2a4a30', bulge=.6, tex='moss', aok=.3)
    p = h.reduce(colors=30)
    for ex in (cx + 2, cx + 9):
        for dx, dy, c in ((0, 0, '#ff5a3a'), (1, 0, '#ff8a5a'), (0, 1, '#c01e18'), (1, 1, '#e0301e'), (-1, 0, '#801010'), (2, 1, '#801010')):
            p.px(ex + dx, 23 + dy, c)
        p.px(ex, 22, '#ffe0c8')
        p.px(ex - 1, 21, '#3a2418'); p.px(ex, 21, '#3a2418'); p.px(ex + 1, 21, '#3a2418')
    return p.image()

if __name__ == '__main__':
    import os
    from PIL import Image, ImageDraw
    os.makedirs('/home/claude/px/hr', exist_ok=True)
    w = weaver(); w.save('/home/claude/px/hr/weaver.png')
    l = laftrache(); l.save('/home/claude/px/hr/laftrache.png')
    elf = Image.open('/home/claude/px/elf_crop.png').convert('RGB')
    eh = 74; ew = round(elf.width * eh / elf.height)
    elf_s = elf.resize((ew, eh), Image.BOX).quantize(48).convert('RGBA')
    k = 4
    sheet = Image.new('RGBA', ((ew + 50 + 66) * k + 80, 80 * k + 40), (110, 140, 100, 255)); d = ImageDraw.Draw(sheet)
    sheet.alpha_composite(elf_s.resize((ew * k, eh * k), Image.NEAREST), (10, 30))
    sheet.alpha_composite(w.resize((w.width * k, w.height * k), Image.NEAREST), (ew * k + 40, 30 + 8))
    sheet.alpha_composite(l.resize((l.width * k, l.height * k), Image.NEAREST), (ew * k + 50 * k + 60, 30 + 8))
    d.text((10, 8), 'your elf shrunk to ~74 px (reference)        new method: weaver 48x72        laftrache 64x72   (all 4x)', fill=(255, 255, 255))
    sheet.save('/home/claude/px/hr/sheet.png'); print('ok')
