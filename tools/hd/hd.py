"""HD pixel-art painter (preview stage, not wired into the game).

Everything is drawn at 3x the game's logical resolution (a 16 px tile becomes 48 px, a 16x24 sprite 48x72).
Shapes are filled with hard colour ramps (no noise, no dithering), lit from the upper left, then outlined:
a near-black line around the silhouette and a darker line where two parts meet."""
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt as edt
from matplotlib.path import Path

SS = 4

def hx(c): return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float)
def ramp(*cs): return [hx(c) for c in cs]

PAL = {
 'skin':   ramp('#3e2216', '#6a3c26', '#965836', '#bb784a', '#d89a68', '#eebc8e'),
 'skinO':  ramp('#341c12', '#5c3422', '#844c30', '#a86a42', '#c48a5c', '#dcaa7e'),
 'hair':   ramp('#08060c', '#120e18', '#1e1828', '#2c243c', '#40365a', '#5e5280'),
 'white':  ramp('#4e4a58', '#76717f', '#a09aa8', '#c8c2cc', '#e6e2e8', '#fdfbfd'),
 'kupam':  ramp('#050409', '#0c0a14', '#161424', '#221f36', '#322e4e', '#48446c'),
 'purple': ramp('#1e0a2c', '#36124c', '#52206e', '#702e92', '#9048b4', '#b276d2'),
 'teal':   ramp('#08201e', '#0e3a34', '#16564a', '#22745e', '#349476', '#5cba98'),
 'red':    ramp('#300606', '#5a0e0c', '#8c1a14', '#bc2a1e', '#e04630', '#fa7a58'),
 'blue':   ramp('#0a1430', '#122660', '#1c3c90', '#2a56bc', '#4478dc', '#76a2f0'),
 'yellow': ramp('#3e2806', '#6c4a0e', '#9c7016', '#c89826', '#eac04a', '#fce48a'),
 'silver': ramp('#30323c', '#545864', '#80848f', '#acb0ba', '#d6d9e0', '#fbfcff'),
 'makun':  ramp('#240a06', '#44160c', '#6a2614', '#923a1e', '#b8562c', '#d8784a'),
 'pants':  ramp('#0a0a12', '#141624', '#202338', '#2e3350', '#424a6e', '#5e6890'),
 'leather':ramp('#160a04', '#2e1a0c', '#4a2c14', '#6a4220', '#8a5c30', '#ac7c46'),
 'wool':   ramp('#2e261e', '#4e4234', '#74644e', '#9c8a6c', '#c0b08e', '#e0d4b6'),
 'wood':   ramp('#1a0e08', '#341e10', '#52301a', '#704424', '#8e5c32', '#ae7a48'),
}
OUTL = hx('#140c18')

def E(cx, cy, rx, ry): return lambda X, Y: ((X - cx) / rx) ** 2 + ((Y - cy) / ry) ** 2 <= 1
def R(x0, y0, x1, y1): return lambda X, Y: (X >= x0) & (X < x1) & (Y >= y0) & (Y < y1)
def poly(pts):
    p = Path(pts)
    return lambda X, Y: p.contains_points(np.c_[X.ravel(), Y.ravel()]).reshape(X.shape)
def U(*fs): return lambda X, Y: np.logical_or.reduce([f(X, Y) for f in fs])
def I(a, b): return lambda X, Y: a(X, Y) & b(X, Y)
def NOT(a, b): return lambda X, Y: a(X, Y) & ~b(X, Y)

class Sprite:
    def __init__(s, w, h, outline=True):
        s.w, s.h, s.outline = w, h, outline
        s.rgb = np.zeros((h, w, 3)); s.a = np.zeros((h, w), bool); s.part = np.full((h, w), -1); s.n = 0
        s.noline = np.zeros((h, w), bool)
        yy, xx = np.mgrid[0:h * SS, 0:w * SS]
        s.X = (xx + .5) / SS; s.Y = (yy + .5) / SS

    def mask(s, fn):
        return fn(s.X, s.Y).reshape(s.h, SS, s.w, SS).mean(axis=(1, 3)) >= .5

    def shape(s, fn, rp, bulge=1.0, tone=None, light=(-.6, -.7), under=False, keep=None, line=True, soft=0.0, top=None):
        """Fill with a hard ramp: a rounded form lit from the upper left. tone fixes one ramp level (0..1)."""
        mk = s.mask(fn)
        if under: mk &= ~s.a
        if keep is not None: mk &= keep
        if not mk.any(): return mk
        d = edt(np.pad(mk, 1))[1:-1, 1:-1]
        gy, gx = np.gradient(np.minimum(d, 6 + 6 * bulge))
        hgt = np.clip(d / max(d.max(), 1), 0, 1) ** .5
        lit = .5 + .28 * hgt * bulge + .55 * bulge * (-gx * light[0] - gy * light[1]) / (1 + np.hypot(gx, gy))
        if top is not None:  # vertical gradient term: lighter toward the top
            yy = np.mgrid[0:s.h, 0:s.w][0]
            ys = yy[mk]; lit = lit + top * (1 - (yy - ys.min()) / max(1, ys.max() - ys.min())) - top / 2
        if tone is not None: lit = np.full(mk.shape, float(tone))
        n = len(rp)
        idx = np.clip(np.floor(lit * n), 0, n - 1).astype(int)
        s.rgb[mk] = np.array(rp)[idx[mk]]
        s.a |= mk; s.part[mk] = s.n; s.n += 1
        if not line: s.noline |= mk
        return mk

    def px(s, x, y, c, part=None):
        x, y = int(x), int(y)
        if 0 <= x < s.w and 0 <= y < s.h:
            s.rgb[y, x] = hx(c) if isinstance(c, str) else np.asarray(c, float); s.a[y, x] = True
            if part is not None: s.part[y, x] = part

    def line(s, pts, c, w=1):
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
            for t in np.linspace(0, 1, n):
                x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                for k in range(w): s.px(round(x - .5) + k, round(y - .5), c)

    def recolor(s, m, rp, level):
        s.rgb[m & s.a] = rp[level]

    def finish(s):
        img = np.zeros((s.h, s.w, 4)); img[..., :3] = s.rgb; img[..., 3] = s.a * 255
        P = np.pad(s.part, 1, constant_values=-1)
        for dy, dx in ((-1, 0), (0, -1), (1, 0), (0, 1)):
            nb = P[1 + dy:1 + dy + s.h, 1 + dx:1 + dx + s.w]
            edge = s.a & (nb >= 0) & (nb != s.part) & ~s.noline
            # the part drawn later (on top) gets the line, darkened toward its own deepest tone
            on_top = s.part > nb
            m = edge & on_top
            img[m, :3] = img[m, :3] * .55
        if s.outline:
            A = np.pad(s.a, 1)
            out = (A[:-2, 1:-1] | A[2:, 1:-1] | A[1:-1, :-2] | A[1:-1, 2:]) & ~s.a
            img[out, :3] = OUTL; img[out, 3] = 255
        return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGBA')
