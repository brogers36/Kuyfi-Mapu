#!/usr/bin/env python3
"""PREVIEW ONLY (not wired into the game): a cleaner pixel-art style at double resolution.
Characters are 32x48 (twice the 16x24 map sprites), built from shapes that are each shaded with a
hard 4-5 tone ramp (light from the upper left, no noise, no dithering), then outlined: a dark
coloured line around the silhouette and a softer line where two parts meet.
Writes /home/claude/px/*.png"""
import os
import numpy as np
from PIL import Image

OUT = '/home/claude/px'; os.makedirs(OUT, exist_ok=True)
SS = 4  # supersampling for the shape masks

def hx(c): return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float)
def ramp(*cs): return [hx(c) for c in cs]

P = {
 'skin':  ramp('#4a2a1c', '#7a4a30', '#a8693f', '#c98a57', '#e2ad7c'),
 'skinO': ramp('#3a2016', '#6a3e28', '#93593a', '#b77a4c', '#d29c6c'),
 'hair':  ramp('#0b0910', '#17131f', '#262033', '#3a3150', '#574a74'),
 'white': ramp('#5f5a66', '#8f8996', '#bdb7c2', '#e2dde4', '#fbf8fb'),
 'kupam': ramp('#07060c', '#100e1a', '#1c1a2c', '#2b2944', '#3f3c60'),
 'ikulla':ramp('#2a0f3a', '#45185c', '#622684', '#8040a8', '#a46ccc'),
 'iku2':  ramp('#0f2a26', '#164a40', '#1f6a5a', '#2e8c74', '#58b496'),
 'red':   ramp('#3c0808', '#6e1210', '#a41f18', '#d23a26', '#f26a48'),
 'blue':  ramp('#0c1a3a', '#16306a', '#22489a', '#3466c4', '#5c8ce4'),
 'yellow':ramp('#4a3008', '#7c5410', '#b07e1c', '#dcaa34', '#f6d870'),
 'silver':ramp('#3c3e4a', '#666a78', '#9498a6', '#c4c8d2', '#f2f4fa'),
 'makun': ramp('#2a0c08', '#4e1a10', '#7a2c18', '#a44424', '#c8683c'),
 'pants': ramp('#0c0c14', '#181a28', '#26293e', '#363b58', '#4c5478'),
 'leather':ramp('#1c0e06', '#38200e', '#583418', '#7a4e26', '#9c6c3c'),
 'wool':  ramp('#3a3026', '#5e5040', '#887660', '#b09c80', '#d4c4a6'),
}
OUTL = hx('#120c16')

class Sprite:
    def __init__(s, w, h):
        s.w, s.h = w, h
        s.rgb = np.zeros((h, w, 3)); s.a = np.zeros((h, w), bool); s.part = np.full((h, w), -1)
        s.n = 0
        yy, xx = np.mgrid[0:h * SS, 0:w * SS]
        s.X = (xx + .5) / SS; s.Y = (yy + .5) / SS

    def shape(s, fn, rp, bulge=1.0, flat=False, tone=None, under=False):
        """fn(X,Y)->bool at supersampled coords. Shaded like a soft cylinder/dome lit from upper left."""
        m = fn(s.X, s.Y)
        cov = m.reshape(s.h, SS, s.w, SS).mean(axis=(1, 3))
        mk = cov >= .5
        if under: mk &= ~s.a
        if not mk.any(): return mk
        # pseudo-normal from the distance to the shape edge
        from scipy.ndimage import distance_transform_edt as edt
        d = edt(np.pad(mk, 1))[1:-1, 1:-1]
        gy, gx = np.gradient(d)
        dmax = max(d.max(), 1)
        hgt = np.sqrt(np.clip(d / dmax, 0, 1)) * bulge
        nx, ny = -gx * bulge, -gy * bulge
        L = (-.55, -.65)
        lit = .55 + .35 * hgt + .9 * (nx * L[0] + ny * L[1]) / (1 + np.abs(nx) + np.abs(ny))
        if flat: lit = np.full_like(lit, .6)
        if tone is not None: lit = np.full_like(lit, tone)
        idx = np.clip(np.round(lit * (len(rp) - 1) - .2), 0, len(rp) - 1).astype(int)
        for y, x in zip(*np.nonzero(mk)):
            s.rgb[y, x] = rp[idx[y, x]]
        s.a |= mk; s.part[mk] = s.n; s.n += 1
        return mk

    def px(s, x, y, c, part=None):
        x, y = int(x), int(y)
        if 0 <= x < s.w and 0 <= y < s.h:
            s.rgb[y, x] = hx(c) if isinstance(c, str) else c; s.a[y, x] = True
            if part is not None: s.part[y, x] = part

    def finish(s):
        img = np.zeros((s.h, s.w, 4))
        img[..., :3] = s.rgb; img[..., 3] = s.a * 255
        # inner lines where two parts meet: darken the lower/right pixel
        for y in range(s.h):
            for x in range(s.w):
                if not s.a[y, x]: continue
                for dx, dy in ((0, -1), (-1, 0)):
                    X, Y = x + dx, y + dy
                    if 0 <= X < s.w and 0 <= Y < s.h and s.a[Y, X] and s.part[Y, X] != s.part[y, x] and abs(s.part[Y, X] - s.part[y, x]) > 0:
                        if s.rgb[y, x].sum() < s.rgb[Y, X].sum(): img[y, x, :3] = s.rgb[y, x] * .62
                        else: img[Y, X, :3] = s.rgb[Y, X] * .62
        # silhouette outline outside the sprite
        A = np.pad(s.a, 1); out = (A[:-2, 1:-1] | A[2:, 1:-1] | A[1:-1, :-2] | A[1:-1, 2:]) & ~s.a
        img[out, :3] = OUTL; img[out, 3] = 255
        return Image.fromarray(img.astype(np.uint8), 'RGBA')

E = lambda cx, cy, rx, ry: (lambda X, Y: ((X - cx) / rx) ** 2 + ((Y - cy) / ry) ** 2 <= 1)
def R(x0, y0, x1, y1): return lambda X, Y: (X >= x0) & (X < x1) & (Y >= y0) & (Y < y1)
def poly(pts):
    from matplotlib.path import Path
    pth = Path(pts)
    def f(X, Y):
        return pth.contains_points(np.c_[X.ravel(), Y.ravel()]).reshape(X.shape)
    return f
def U(*fs): return lambda X, Y: np.logical_or.reduce([f(X, Y) for f in fs])

def face(s, cx, top, skin='skin', old=False, child=False):
    hr = 7.2 if not child else 7.6
    s.shape(E(cx, top + 8, hr, 8.2 if not child else 7.8), P[skin], bulge=1.1)
    ey = top + 9 if not child else top + 9.5
    for ex in (cx - 4, cx + 2):
        if old:
            s.px(ex, ey, '#1a1020'); s.px(ex + 1, ey, '#1a1020'); s.px(ex, ey - 1, P[skin][1]); s.px(ex + 1, ey - 1, P[skin][1])
        else:
            s.px(ex, ey, '#1a1020'); s.px(ex + 1, ey, '#2a1c30'); s.px(ex, ey - 1, '#1a1020'); s.px(ex + 1, ey - 1, '#ffffff')
            s.px(ex, ey - 2, P['hair'][1]); s.px(ex + 1, ey - 2, P['hair'][1])
    s.px(cx - 1, ey + 1, P[skin][2]); s.px(cx - 1, ey + 2, P[skin][1])   # nose shadow
    s.px(cx - 2, ey + 4, P[skin][0]); s.px(cx - 1, ey + 4, P[skin][0]); s.px(cx, ey + 4, P[skin][1])  # mouth
    s.px(cx - 5, ey + 2, '#d8705e'); s.px(cx + 3, ey + 2, '#d8705e')  # cheeks
    if old:
        s.px(int(cx) - 4, int(ey) - 2, P[skin][1]); s.px(int(cx) + 3, int(ey) - 2, P[skin][1])

def strands(s, x0, x1, y0, y1, rp, step=3):
    for x in range(int(x0), int(x1), step):
        for y in range(int(y0), int(y1)):
            if s.a[y, x] and (y + x) % 5 < 3: s.px(x, y, rp[3] if x < (x0 + x1) / 2 else rp[2])

def folds(s, xs, y0, y1, rp):
    for x in xs:
        for y in range(y0, y1):
            if s.a[y, x]: s.px(x, y, rp[0])
            if s.a[y, x + 1] and y % 3 == 0: s.px(x + 1, y, rp[3])

def trarilonko(s, cx, y, w, col='silver', band='red'):
    s.shape(R(cx - w, y, cx + w, y + 2), P[band], flat=True, tone=.55)
    for x in range(int(cx - w) + 1, int(cx + w), 3): s.px(x, y, P[col][4])
    s.shape(E(cx, y + 1, 1.6, 1.6), P[col], bulge=.8)

def kuku():
    s = Sprite(32, 48); cx = 16
    s.shape(poly([(9, 47), (23, 47), (22, 30), (10, 30)]), P['kupam'])                 # küpam (long black dress)
    folds(s, [12, 16, 20], 38, 45, P['kupam'])
    s.shape(R(11, 45, 15, 48), P['leather'], tone=.4); s.shape(R(17, 45, 21, 48), P['leather'], tone=.4)
    s.shape(poly([(6, 38), (26, 38), (25, 22), (16, 19), (7, 22)]), P['ikulla'], bulge=1.2)  # ikülla shawl
    for x in range(8, 25, 2): s.px(x, 37, P['yellow'][3])                                     # fringe
    s.shape(R(10, 30, 22, 32), P['red'], tone=.6)                                           # trariwe belt
    for x in range(11, 22, 3): s.px(x, 30, P['white'][4]); s.px(x + 1, 31, P['yellow'][4])
    s.shape(E(16, 26, 4.2, 3.6), P['silver'], bulge=1.3)                                    # trapelakucha
    for y in range(28, 35, 2): s.px(16, y, P['silver'][3 if y % 4 else 4])
    s.shape(E(16, 35, 2, 1.6), P['silver'], bulge=1)
    s.shape(E(7, 33, 2.2, 2.4), P['skinO']); s.shape(E(25, 33, 2.2, 2.4), P['skinO'])          # hands
    s.shape(U(E(cx, 9.5, 8.6, 8.2), R(7.4, 9, 24.6, 20)), P['white'], bulge=.9)             # white hair, long
    strands(s, 8, 25, 10, 20, P['white'])
    face(s, cx, 4, 'skinO', old=True)
    s.shape(R(9, 4, 23, 8.5), P['white'], bulge=.7, under=False)                           # fringe of hair
    trarilonko(s, cx, 6, 8)
    return s.finish()

def weaver():
    s = Sprite(32, 48); cx = 16
    s.shape(poly([(9, 47), (23, 47), (22, 29), (10, 29)]), P['kupam'])
    folds(s, [12, 16, 20], 32, 45, P['kupam'])
    s.shape(R(11, 45, 15, 48), P['leather'], tone=.4); s.shape(R(17, 45, 21, 48), P['leather'], tone=.4)
    s.shape(poly([(7, 33), (25, 33), (24, 21), (16, 19), (8, 21)]), P['iku2'], bulge=1.1)
    s.shape(R(10, 29, 22, 31), P['blue'], tone=.6)
    for x in range(10, 22, 2): s.px(x, 29 + (x // 2) % 2, P['red'][4])
    s.shape(E(16, 23, 1.8, 1.8), P['silver'], bulge=1)                                      # tupu pin
    s.shape(R(15.3, 24, 16.7, 28), P['silver'], tone=.7)
    s.shape(E(8, 31, 2.2, 2.4), P['skin']); s.shape(E(24, 31, 2.2, 2.4), P['skin'])
    s.shape(U(E(cx, 9.5, 8.6, 8.2), R(7.4, 9, 24.6, 23)), P['hair'], bulge=.9)
    strands(s, 8, 25, 10, 23, P['hair'])
    face(s, cx, 4)
    s.shape(R(9, 4, 23, 8), P['hair'], bulge=.7)
    trarilonko(s, cx, 6, 8, band='blue')
    for y in (21, 22): s.px(7, y, P['silver'][4]); s.px(24, y, P['silver'][4])              # chaway earrings
    return s.finish()

def lonko():
    s = Sprite(32, 48); cx = 16
    s.shape(R(10, 36, 15, 46), P['pants']); s.shape(R(17, 36, 22, 46), P['pants'])
    s.shape(R(9, 45, 15, 48), P['leather'], tone=.45); s.shape(R(17, 45, 23, 48), P['leather'], tone=.45)
    s.shape(poly([(5, 38), (27, 38), (25, 21), (16, 18), (7, 21)]), P['makun'], bulge=1.1)    # makuñ
    for i, x in enumerate(range(6, 27, 2)):                                                   # stepped band
        y = 33 + (i % 4 if i % 8 < 4 else 4 - i % 4) // 2
        s.px(x, y, P['white'][4]); s.px(x + 1, y, P['white'][3]); s.px(x, y + 1, P['yellow'][3])
    for x in range(6, 27): s.px(x, 37, P['makun'][1])
    s.shape(E(6, 36, 2.2, 2.4), P['skin']); s.shape(E(26, 36, 2.2, 2.4), P['skin'])
    s.shape(R(25.4, 8, 26.6, 47), P['leather'], tone=.6)                                    # wooden staff
    s.shape(E(26, 7, 1.6, 2), P['silver'], bulge=1)
    s.shape(U(E(cx, 9.5, 8.4, 8), R(7.6, 9, 24.4, 17)), P['hair'], bulge=.9)
    face(s, cx, 4)
    s.shape(R(9, 4, 23, 8), P['hair'], bulge=.7)
    trarilonko(s, cx, 6, 8.6, band='red')
    s.px(12, 17, P['skin'][1]); s.px(19, 17, P['skin'][1])
    return s.finish()

def child():
    s = Sprite(32, 48); cx = 16
    s.shape(poly([(11, 47), (21, 47), (21, 32), (11, 32)]), P['blue'])
    s.shape(R(12, 45, 15, 48), P['leather'], tone=.4); s.shape(R(17, 45, 20, 48), P['leather'], tone=.4)
    s.shape(poly([(9, 38), (23, 38), (22, 26), (16, 24), (10, 26)]), P['wool'], bulge=1.1)
    for x in range(10, 23, 2): s.px(x, 34, P['red'][3]); s.px(x + 1, 35, P['red'][2])
    s.shape(E(9.5, 35, 2, 2.2), P['skin']); s.shape(E(22.5, 35, 2, 2.2), P['skin'])
    s.shape(U(E(cx, 15, 8.4, 8.2), R(7.6, 15, 24.4, 22)), P['hair'], bulge=.9)
    face(s, cx, 9.5, child=True)
    s.shape(R(9, 9.5, 23, 13.5), P['hair'], bulge=.7)
    trarilonko(s, cx, 11.5, 8.4, band='yellow')
    return s.finish()

if __name__ == '__main__':
    for n, f in [('kuku', kuku), ('weaver', weaver), ('lonko', lonko), ('child', child)]:
        f().save(f'{OUT}/{n}.png')
    print('ok')
