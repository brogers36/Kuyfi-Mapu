"""HD people, front view, 48x72 (3x the 16x24 map sprites). Preview stage."""
import numpy as np
from hd import Sprite, PAL, E, R, poly, U, I, NOT, hx

W, H = 48, 72
CX = 24

def hair_back(s, rp, bottom=46, width=13.5, top=6):
    m = s.shape(U(E(CX, 19, width, 14), R(CX - width + .4, 19, CX + width - .4, bottom - 2),
              E(CX - width / 2, bottom - 2, width / 2, 3.4), E(CX + width / 2, bottom - 2, width / 2, 3.4)), rp, tone=.35)
    yy, xx = np.mgrid[0:s.h, 0:s.w]
    # locks: a lit ridge and a dark seam every few pixels, the ends split into points
    for x0 in range(int(CX - width), int(CX + width) + 1, 4):
        for y in range(19, bottom + 2):
            for x, c in ((x0, rp[0]), (x0 + 2, rp[3] if x0 < CX else rp[2])):
                if 0 <= x < s.w and m[y, x]: s.rgb[y, x] = c
        if bottom + 1 < s.h and m[bottom, x0]: s.a[bottom + 1:, x0] = s.a[bottom + 1:, x0]
    s.rgb[m & (xx > CX + width * .4) & (yy > 22)] *= .8

def face(s, skin='skin', cy=20, old=False, child=False, kid_scale=1.0, fem=True, smile=True):
    sk = PAL[skin]
    m = s.shape(U(E(CX, cy, 11, 11.5), E(CX, cy + 5, 8.5, 7.5)), sk, tone=.72)
    yy, xx = np.mgrid[0:s.h, 0:s.w]
    s.rgb[m & (((xx - CX) / 11.0) ** 2 + ((yy - cy - 2) / 13.0) ** 2 > .62) & (xx > CX - 2)] = sk[3]
    s.rgb[m & (yy > cy + 9) & (np.abs(xx - CX) > 4)] = sk[3]
    s.rgb[m & (((xx - CX) / 11.0) ** 2 + ((yy - cy - 2) / 13.0) ** 2 > .9) & (xx > CX + 2)] = sk[2]
    s.rgb[m & (((xx - (CX - 5)) / 4.0) ** 2 + ((yy - (cy + 1)) / 5.0) ** 2 < 1) & (xx < CX - 2)] = sk[5]
    s.rgb[m & (yy >= cy + 14)] = sk[3]
    ey = cy + 1
    IR = [hx('#24120a'), hx('#4a2412'), hx('#6e3a1c'), hx('#94562a'), hx('#b8783e')]
    for side, ex in ((-1, CX - 9), (1, CX + 3)):
        if old:   # kind, smiling half-closed eyes
            s.line([(ex, ey + 2), (ex + 1, ey + 1), (ex + 4, ey + 1), (ex + 5, ey + 2)], '#1a1020')
            s.line([(ex + 1, ey + 3), (ex + 4, ey + 3)], sk[2])
            s.line([(ex, ey - 2), (ex + 5, ey - 3 if side < 0 else ey - 2)], PAL['white'][3])
            s.line([(ex + (5 if side > 0 else 0), ey + 4), (ex + (6 if side > 0 else -1), ey + 5)], sk[2])   # crow's feet
            continue
        # eye: thick upper lash, iris with pupil and catchlight, a sliver of white each side
        W_ = '#f4eef0'
        rows = [[W_, IR[0], IR[0], IR[0], W_], [W_, IR[1], '#100604', IR[1], W_], [W_, IR[2], IR[3], IR[2], W_], [None, IR[3], IR[4], IR[3], None]]
        for dy, row in enumerate(rows):
            for dx, c in enumerate(row):
                if c is not None: s.px(ex + dx, ey - 1 + dy, c)
        s.px(ex + 1, ey - 1, '#ffffff'); s.px(ex + 1, ey, '#fff8f0'); s.px(ex + 3, ey + 1, '#e8c8a8')
        s.line([(ex - 1, ey - 2), (ex + 5, ey - 2)], '#140a10'); s.line([(ex, ey - 3), (ex + 4, ey - 3)], '#140a10')
        s.px(ex + (5 if side > 0 else -1), ey - 3, '#140a10'); s.px(ex + (6 if side > 0 else -2), ey - 4 if fem else ey - 3, '#140a10')
        s.line([(ex, ey + 3), (ex + 4, ey + 3)], sk[3])
        by = ey - 5
        s.line([(ex, by + (1 if side < 0 else 0)), (ex + 2, by), (ex + 5, by + (0 if side < 0 else 1))], PAL['hair'][1])
    s.px(CX - 1, ey + 6, sk[3]); s.px(CX, ey + 6, sk[2]); s.px(CX - 1, ey + 7, sk[2])
    if smile:
        s.line([(CX - 3, ey + 9), (CX - 2, ey + 10), (CX + 1, ey + 10), (CX + 2, ey + 9)], '#6a2a22')
        s.px(CX - 1, ey + 11, sk[3]); s.px(CX, ey + 11, sk[3])
    else:
        s.line([(CX - 2, ey + 10), (CX + 1, ey + 10)], '#6a2a22')
    for bx in (CX - 10, CX + 6):
        for k in range(4): s.px(bx + k, ey + 6, '#e08070' if k in (1, 2) else '#d89478')
    if old:
        s.line([(CX - 5, ey + 9), (CX - 4, ey + 11)], sk[2]); s.line([(CX + 4, ey + 9), (CX + 3, ey + 11)], sk[2])
        s.line([(CX - 8, cy - 6), (CX - 3, cy - 6)], sk[3])
    s.line([(CX - 9, cy - 4), (CX + 9, cy - 4)], sk[2])

def bangs(s, rp, cy=20, part=True):
    pts = [(CX - 12.5, cy + 2), (CX - 12, cy - 8), (CX - 5, cy - 13.5), (CX + 5, cy - 13.5), (CX + 12, cy - 8), (CX + 12.5, cy + 2)]
    # the fringe edge: a row of pointed locks
    tips = [(CX + 11, cy - 1), (CX + 9, cy - 5), (CX + 7, cy - 2), (CX + 5, cy - 6), (CX + 3, cy - 3), (CX + 1, cy - 7),
            (CX - 1, cy - 4), (CX - 3, cy - 7), (CX - 5, cy - 3), (CX - 7, cy - 6), (CX - 9, cy - 2), (CX - 11, cy - 5)]
    m = s.shape(U(poly(pts + tips), R(CX - 13, cy - 4, CX - 10, cy + 10), R(CX + 10, cy - 4, CX + 13, cy + 10)), rp, tone=.42)
    yy, xx = np.mgrid[0:s.h, 0:s.w]
    s.rgb[m & (xx > CX + 4)] = rp[1]
    sheen = m & (((xx - (CX - 3)) / 9.5) ** 2 + ((yy - (cy - 9)) / 3.0) ** 2 < 1) & (((xx - (CX - 3)) / 7.5) ** 2 + ((yy - (cy - 9.6)) / 1.5) ** 2 >= 1)
    s.rgb[sheen] = rp[4]; s.rgb[sheen & (xx < CX - 3)] = rp[5]
    for (tx, ty) in tips[1::2]:   # a seam up from each notch between locks
        s.line([(tx, ty - 1), (tx + (1 if tx < CX else -1) * 1.5, ty - 5)], rp[0])
    for x in (CX - 12, CX + 11):
        s.line([(x + (1 if x < CX else 0), cy - 2), (x + (1 if x < CX else 0), cy + 9)], rp[0] if x > CX else rp[3])

def arms(s, sleeve, top=34, y=52, dx=14, skin='skin'):
    for side in (-1, 1):
        x = CX + side * dx
        s.shape(poly([(CX + side * (dx - 6), top), (CX + side * (dx - 1), top - 1), (x + side * 3.5, y - 3), (x - side * 2, y - 2)]), sleeve, bulge=1.0)
        s.shape(E(x + side * .5, y, 2.8, 3), PAL[skin], tone=.7 if side < 0 else .55)

def trarilonko(s, cy=20, band='red', metal='silver', y=None):
    y = y if y is not None else cy - 6
    s.shape(I(R(CX - 13, y, CX + 13, y + 3), E(CX, cy, 13.4, 14.5)), PAL[band], tone=.55)
    for x in range(CX - 12, CX + 12, 4):
        s.px(x, y + 1, PAL[metal][5]); s.px(x + 1, y + 1, PAL[metal][3])
    s.shape(E(CX, y + 1.5, 2.4, 2.4), PAL[metal], bulge=1.2)
    s.px(CX - 1, y, PAL[metal][5])

def hands(s, y, skin='skin', dx=13):
    for x in (CX - dx, CX + dx):
        s.shape(E(x, y, 2.8, 3), PAL[skin], bulge=1)

def feet(s, rp='leather', gap=3, y=67):
    s.shape(E(CX - gap - 2.5, y + 1.5, 4, 2.8), PAL[rp], bulge=1)
    s.shape(E(CX + gap + 2.5, y + 1.5, 4, 2.8), PAL[rp], bulge=1)

def dress(s, rp, top=40, bottom=67, w0=11, w1=13):
    s.shape(poly([(CX - w0, top), (CX + w0, top), (CX + w1, bottom), (CX - w1, bottom)]), rp, bulge=1.1, top=.2)
    for x in (CX - 7, CX - 2, CX + 4, CX + 9):           # folds: a dark crease with a lit edge beside it
        s.line([(x, top + 6), (x + (x - CX) / 5, bottom - 1)], rp[0])
        s.line([(x - 1, top + 9), (x - 1 + (x - CX) / 5, bottom - 2)], rp[4] if x < CX else rp[3])
    s.line([(CX - w1 + 1, bottom - 2), (CX + w1 - 1, bottom - 2)], rp[1])

def woven_belt(s, y, rp='red', w=12, motif='yellow', alt='white'):
    s.shape(R(CX - w, y, CX + w, y + 4), PAL[rp], tone=.55)
    for i, x in enumerate(range(int(CX - w + 1), int(CX + w - 1), 3)):
        c = PAL[motif][4] if i % 2 else PAL[alt][4]
        s.px(x, y + 1 + (i % 2), c); s.px(x + 1, y + 2 - (i % 2), c)
    s.line([(CX - w, y + 3), (CX + w - 1, y + 3)], PAL[rp][1])

def nimin_band(s, y, x0, x1, base, motif, edge):
    # a woven band: a dark ground with stepped diamonds (ñimin) and a light edge line above and below
    for x in range(int(x0), int(x1)):
        for yy in range(y, y + 7):
            if s.a[yy, x]: s.rgb[yy, x] = base[1]
        k = (x - int(x0)) % 8
        d = abs(k - 4)                      # diamond half-width at this column
        for yy in range(y + 1 + d // 2 * 0, y + 6):
            if abs((yy - (y + 3)) ) + d <= 3 and s.a[yy, x]: s.rgb[yy, x] = motif[4] if (yy + x) % 2 else motif[3]
        if s.a[y, x]: s.rgb[y, x] = edge[4]
        if s.a[y + 6, x]: s.rgb[y + 6, x] = edge[3]
        if k == 4 and s.a[y + 3, x]: s.rgb[y + 3, x] = base[0]

def trapelakucha(s, y=44):
    sv = PAL['silver']
    s.shape(poly([(CX - 7, y - 2), (CX + 7, y - 2), (CX + 6, y + 1), (CX - 6, y + 1)]), sv, bulge=1.2)          # top bar
    for x in (CX - 5, CX + 5): s.shape(E(x, y - .5, 1.6, 1.6), sv, tone=.95)
    for x in (CX - 4, CX - 1, CX + 2, CX + 5):                                                       # chains
        for yy in range(y + 2, y + 9): s.px(x - (1 if x > CX else 0), yy, sv[4] if yy % 2 else sv[2])
    s.shape(poly([(CX - 6, y + 9), (CX + 6, y + 9), (CX + 5, y + 11), (CX - 5, y + 11)]), sv, bulge=1.2)        # lower bar
    for x in (CX - 4, CX, CX + 4):                                                                   # pendants
        s.shape(poly([(x - 1.6, y + 12), (x + 1.6, y + 12), (x, y + 15)]), sv, bulge=1)

def kuku():
    s = Sprite(W, H)
    hair_back(s, PAL['white'], bottom=44)
    feet(s); dress(s, PAL['kupam'], top=44, bottom=67, w0=11, w1=12.5)
    s.shape(poly([(CX - 16, 54), (CX + 16, 54), (CX + 14, 37), (CX + 6, 32), (CX - 6, 32), (CX - 14, 37)]), PAL['purple'], bulge=1.2)  # ikülla
    nimin_band(s, 46, CX - 15, CX + 16, PAL['purple'], PAL['yellow'], PAL['purple'])
    for x in range(CX - 15, CX + 16, 2): s.px(x, 54, PAL['yellow'][4]); s.px(x, 55, PAL['yellow'][2])      # fringe
    s.line([(CX - 6, 32), (CX, 40), (CX + 6, 32)], PAL['purple'][1])
    woven_belt(s, 54, 'red', w=11.5)
    trapelakucha(s, 36)
    arms(s, PAL['purple'], top=36, y=52, dx=15, skin='skinO')
    face(s, 'skinO', old=True)
    bangs(s, PAL['white'])
    trarilonko(s, band='red')
    return s.finish()

def weaver():
    s = Sprite(W, H)
    hair_back(s, PAL['hair'], bottom=50)
    feet(s); dress(s, PAL['kupam'], top=42, bottom=67)
    s.shape(poly([(CX - 14, 50), (CX + 14, 50), (CX + 13, 36), (CX + 6, 32), (CX - 6, 32), (CX - 13, 36)]), PAL['teal'], bulge=1.1)
    s.shape(poly([(CX - 3, 32), (CX + 3, 32), (CX, 38)]), PAL['skin'], tone=.55)
    for x in range(CX - 13, CX + 14):
        if s.a[49, x]: s.rgb[49, x] = PAL['teal'][5] if x % 3 else PAL['red'][4]
    woven_belt(s, 48, 'blue', w=11.5, motif='red', alt='yellow')
    s.shape(E(CX, 39, 2.6, 2.6), PAL['silver'], bulge=1.2)                                  # tupu (shawl pin)
    s.shape(R(CX - .8, 41, CX + .8, 47), PAL['silver'], tone=.65)
    arms(s, PAL['kupam'], top=35, y=48, dx=14)
    face(s)
    bangs(s, PAL['hair'])
    trarilonko(s, band='blue')
    for y in (31, 32, 33): s.px(CX - 12, y, PAL['silver'][5 if y == 31 else 3]); s.px(CX + 11, y, PAL['silver'][5 if y == 31 else 3])
    return s.finish()

def lonko():
    s = Sprite(W, H)
    hair_back(s, PAL['hair'], bottom=34, width=12.5)
    s.shape(R(CX - 9, 52, CX - 1, 66), PAL['pants'], bulge=.8); s.shape(R(CX + 1, 52, CX + 9, 66), PAL['pants'], bulge=.8)
    feet(s, gap=4)
    s.shape(R(CX + 15.5, 10, CX + 17.5, 70), PAL['wood'], bulge=.6)                         # staff
    s.shape(E(CX + 16.5, 9, 2.4, 3), PAL['silver'], bulge=1.2)
    s.shape(poly([(CX - 18, 56), (CX + 18, 56), (CX + 15, 36), (CX + 6, 31), (CX - 6, 31), (CX - 15, 36)]), PAL['makun'], bulge=1.1)
    nimin_band(s, 45, CX - 17, CX + 18, PAL['kupam'], PAL['white'], PAL['yellow'])
    s.line([(CX - 18, 55), (CX + 17, 55)], PAL['makun'][1])
    for x in range(CX - 17, CX + 18, 2): s.px(x, 56, PAL['makun'][2])
    s.line([(CX - 6, 31), (CX, 35), (CX + 6, 31)], PAL['makun'][0])
    arms(s, PAL['makun'], top=35, y=54, dx=16)
    face(s)
    bangs(s, PAL['hair'])
    trarilonko(s, band='red')
    return s.finish()

def child():
    s = Sprite(W, H)
    cy = 30
    s.shape(U(E(CX, cy, 13, 13), R(CX - 12.6, cy, CX + 12.6, cy + 10)), PAL['hair'], bulge=.8, top=.25)
    s.shape(R(CX - 8, 56, CX - 1, 66), PAL['blue'], bulge=.8); s.shape(R(CX + 1, 56, CX + 8, 66), PAL['blue'], bulge=.8)
    feet(s, gap=3)
    s.shape(poly([(CX - 12, 58), (CX + 12, 58), (CX + 11, 45), (CX + 5, 42), (CX - 5, 42), (CX - 11, 45)]), PAL['wool'], bulge=1.1)
    for x in range(CX - 11, CX + 12, 2): s.px(x, 52, PAL['red'][4]); s.px(x + 1, 53, PAL['red'][2])
    hands(s, 56, dx=12)
    sk = PAL['skin']
    s.shape(U(E(CX, cy, 10.5, 10.5), E(CX, cy + 4, 8, 7)), sk, bulge=1.0, light=(-.5, -.5))
    ey = cy + 2
    for ex in (CX - 7, CX + 3):
        for dy in range(4):
            for dx in range(3): s.px(ex + dx, ey + dy - 1, '#1a1020')
        s.px(ex + 1, ey + 1, '#5e3624'); s.px(ex, ey - 1, '#ffffff'); s.px(ex + 1, ey - 1, '#d8d4e0')
    s.px(CX - 1, ey + 4, sk[2]); s.line([(CX - 2, ey + 7), (CX + 1, ey + 7)], sk[0])
    for bx in (CX - 9, CX + 6): s.px(bx, ey + 4, '#e07a68'); s.px(bx + 1, ey + 4, '#e07a68')
    bangs(s, PAL['hair'], cy=cy)
    trarilonko(s, cy=cy, band='yellow')
    return s.finish()

def llanka():
    s = Sprite(W, H)
    hair_back(s, PAL['hair'], bottom=36, width=12.5)
    s.shape(R(CX - 9, 52, CX - 1, 66), PAL['pants'], bulge=.8); s.shape(R(CX + 1, 52, CX + 9, 66), PAL['pants'], bulge=.8)
    feet(s, gap=4)
    s.shape(poly([(CX - 17, 55), (CX + 17, 55), (CX + 15, 36), (CX + 6, 31), (CX - 6, 31), (CX - 15, 36)]), PAL['blue'], bulge=1.1)
    nimin_band(s, 44, CX - 16, CX + 17, PAL['blue'], PAL['red'], PAL['white'])
    s.line([(CX - 17, 54), (CX + 16, 54)], PAL['blue'][1])
    s.line([(CX - 6, 31), (CX, 35), (CX + 6, 31)], PAL['blue'][0])
    arms(s, PAL['blue'], top=35, y=53, dx=15)
    face(s)
    bangs(s, PAL['hair'])
    trarilonko(s, band='red')
    return s.finish()

ALL = {'kuku': kuku, 'weaver': weaver, 'lonko': lonko, 'child': child, 'llanka': llanka}

if __name__ == '__main__':
    import os
    os.makedirs('/home/claude/px/hd', exist_ok=True)
    from PIL import Image
    ims = [f() for f in ALL.values()]
    sheet = Image.new('RGBA', (len(ims) * 56, 78), (120, 160, 96, 255))
    for i, im in enumerate(ims): sheet.alpha_composite(im, (i * 56 + 4, 3))
    sheet.resize((sheet.width * 3, sheet.height * 3), Image.NEAREST).save('/home/claude/px/hd/people.png')
    for n, im in zip(ALL, ims): im.save(f'/home/claude/px/hd/{n}.png')
    print('ok')
