"""Paint-then-pixelate: shapes are painted at 8x with soft light, contact shadows, hue-shifted shading and
material texture (cloth weave, hair strands, metal shine), then box-reduced to the target grid, cut to a
limited palette, cleaned of stray pixels and outlined. Fine features (eyes, sparkles) are placed after, pixel by pixel."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, distance_transform_edt as edt
from matplotlib.path import Path

def hx(c): return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float) / 255
def E(cx, cy, rx, ry): return lambda X, Y: ((X - cx) / rx) ** 2 + ((Y - cy) / ry) ** 2 <= 1
def R(x0, y0, x1, y1): return lambda X, Y: (X >= x0) & (X < x1) & (Y >= y0) & (Y < y1)
def poly(pts):
    p = Path(pts)
    return lambda X, Y: p.contains_points(np.c_[X.ravel(), Y.ravel()]).reshape(X.shape)
def U(*fs): return lambda X, Y: np.logical_or.reduce([f(X, Y) for f in fs])
def I(a, b): return lambda X, Y: a(X, Y) & b(X, Y)

COOL = np.array([.80, .84, 1.06]); WARM = np.array([1.06, 1.0, .88])

class Hi:
    def __init__(s, w, h, K=8, seed=1, gs=1.0):
        s.gs = gs
        w, h = int(round(w * gs)), int(round(h * gs))
        s.w, s.h, s.K = w, h, K
        s.H, s.W = h * K, w * K
        s.rgb = np.zeros((s.H, s.W, 3)); s.a = np.zeros((s.H, s.W)); s.part = np.full((s.H, s.W), -1); s.n = 0
        yy, xx = np.mgrid[0:s.H, 0:s.W]
        s.X = (xx + .5) / K / gs; s.Y = (yy + .5) / K / gs
        s.r = np.random.default_rng(seed)
        s.light = np.array([-.55, -.65, .52]); s.light /= np.linalg.norm(s.light)

    def _tex(s, kind, m):
        H, W, K = s.H, s.W, s.K
        if kind == 'cloth':
            n = s.r.standard_normal((H, W))
            t = gaussian_filter(n, (K * .25, K * 1.2)) * 1.4 + gaussian_filter(n, K * 2) * 1.5
            return t * .10
        if kind == 'hair':
            n = s.r.standard_normal((H, W // max(1, K // 3) + 1))
            t = gaussian_filter(n, (K * 3.5, .6))
            t = np.repeat(t, max(1, K // 3), axis=1)[:, :W]
            return t / (t.std() + 1e-6) * .16
        if kind == 'fur':
            n = s.r.standard_normal((H, W)); return gaussian_filter(n, (K * 1.5, K * .3)) * .55
        if kind == 'skin':
            return gaussian_filter(s.r.standard_normal((H, W)), K * 2) * .25
        if kind == 'moss':
            n = s.r.standard_normal((H, W)); return (gaussian_filter(n, K * .5) * 2.2 + gaussian_filter(n, K * 2) * 3)
        if kind == 'wood':
            n = s.r.standard_normal((H, W)); return gaussian_filter(n, (K * 4, K * .4)) * 1.2
        return 0

    def shape(s, fn, col, bulge=1.0, tex=None, shine=0.0, ao=True, dark=1.0, flat=False, tint=None, aok=.38, line=True, amb=.26):
        m = fn(s.X, s.Y).astype(float)
        if m.sum() == 0: return m > 0
        K = s.K
        # height from a blurred distance field -> normals -> diffuse light
        d = edt(np.pad(m, 1))[1:-1, 1:-1]
        hgt = np.sqrt(np.clip(d / (K * 5.5), 0, 1)) * K * 3.2 * bulge
        hgt = gaussian_filter(hgt, K * .6)
        gy, gx = np.gradient(hgt)
        nz = np.ones_like(hgt) * 1.2
        nrm = np.sqrt(gx ** 2 + gy ** 2 + nz ** 2)
        dif = (-gx * s.light[0] - gy * s.light[1] + nz * s.light[2]) / nrm
        lam = np.clip(dif, 0, 1)
        sh = amb + (1.26 - amb) * lam ** 1.15
        # bounce light on the shadow side near the edge, so forms read round
        rim = np.clip(1 - d / (K * 1.6), 0, 1) * np.clip(-(-gx * s.light[0] - gy * s.light[1]) / (nrm + 1e-6) * 3, 0, 1)
        sh = sh + .16 * rim
        if flat: sh = np.full_like(sh, .9)
        t = s._tex(tex, m) if tex else 0
        sh = sh * (1 + t)
        base = hx(col) if isinstance(col, str) else np.asarray(col)
        c = base[None, None, :] * sh[..., None] * dark
        # hue shift: cool in shadow, warm in light
        w_ = np.clip((sh - .7) / .5, -1, 1)[..., None]
        c = np.where(w_ < 0, c * (1 + (COOL - 1) * -w_), c * (1 + (WARM - 1) * w_))
        if shine:
            spec = np.clip(dif, 0, 1) ** 14 * shine
            c = c + spec[..., None] * np.array([1, .98, .92])
        if tint is not None: c = c * np.asarray(tint)
        # contact shadow on what is already there, just below/right of the new part
        if ao:
            sm = np.roll(np.roll(m, int(K * .6), 0), int(K * .4), 1)
            sm = gaussian_filter(sm, K * .9)
            under = (s.a > 0) & (m == 0)
            s.rgb[under] *= (1 - aok * np.clip(sm[under], 0, 1))[:, None]
        mm = m > 0
        s.rgb[mm] = np.clip(c[mm], 0, 1.2); s.a[mm] = 1
        if line: s.part[mm] = s.n; s.n += 1
        return mm

    def line(s, pts, col, w=1.0, alpha=1.0):
        """a soft painted stroke at 8x (for folds, seams, strands)"""
        K = s.K * s.gs; c = hx(col) if isinstance(col, str) else np.asarray(col)
        w = w * s.gs
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = int(max(abs(x1 - x0), abs(y1 - y0)) * K) + 1
            for tt in np.linspace(0, 1, n):
                X, Y = (x0 + (x1 - x0) * tt) * K, (y0 + (y1 - y0) * tt) * K
                r = w * s.K / 2
                ys, xs = slice(max(0, int(Y - r)), int(Y + r) + 1), slice(max(0, int(X - r)), int(X + r) + 1)
                sel = s.a[ys, xs] > 0
                s.rgb[ys, xs][sel] = s.rgb[ys, xs][sel] * (1 - alpha) + c * alpha

    def cast(s, fn, dx=.6, dy=1.6, k=.42, blur=.9):
        """a soft cast shadow of an occluder shape (e.g. the head on the chest) onto what is drawn below it"""
        K = s.K
        m = fn(s.X - dx, s.Y - dy).astype(float)
        m = gaussian_filter(m, K * blur) * (1 - fn(s.X, s.Y))
        sel = s.a > 0
        s.rgb[sel] *= (1 - k * np.clip(m[sel], 0, 1))[:, None]

    def darken(s, fn, k):
        m = fn(s.X, s.Y) & (s.a > 0); s.rgb[m] *= k

    def reduce(s, colors=30, outline=True):
        K = s.K
        a = s.a.reshape(s.h, K, s.w, K).mean(axis=(1, 3))
        rgbw = (s.rgb * s.a[..., None]).reshape(s.h, K, s.w, K, 3).sum(axis=(1, 3))
        cnt = s.a.reshape(s.h, K, s.w, K).sum(axis=(1, 3))
        rgb = np.where(cnt[..., None] > 0, rgbw / np.maximum(cnt, 1)[..., None], 0)
        A = a >= .45
        # majority part per pixel, for the lines between parts
        P = s.part.reshape(s.h, K, s.w, K).transpose(0, 2, 1, 3).reshape(s.h, s.w, K * K)
        part = np.array([[np.bincount(v[v >= 0]).argmax() if (v >= 0).any() else -1 for v in row] for row in P])
        px = Px(np.clip(rgb, 0, 1) * 255, A, colors, outline); px.gs = s.gs
        Pp = np.pad(part, 1, constant_values=-1)
        edge = np.zeros_like(A)
        for dy, dx in ((-1, 0), (0, -1), (1, 0), (0, 1)):
            nb = Pp[1 + dy:1 + dy + s.h, 1 + dx:1 + dx + s.w]
            edge |= A & (nb >= 0) & (part >= 0) & (nb != part) & (part > nb)
        px.rgb[edge] = px.rgb[edge] * np.array([.5, .45, .58])
        return px

class Px:
    def __init__(s, rgb, A, colors, outline):
        s.rgb, s.A = rgb, A
        s.quantize(colors); s.clean()
        s.outline = outline

    def quantize(s, n):
        pts = s.rgb[s.A]
        im = Image.fromarray(pts[None].astype(np.uint8), 'RGB').quantize(n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        q = np.array(im.convert('RGB'))[0].astype(float)
        s.rgb[s.A] = q

    def clean(s):
        h, w = s.A.shape; out = s.rgb.copy()
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if not s.A[y, x]: continue
                nb = [s.rgb[y + dy, x + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if s.A[y + dy, x + dx]]
                if len(nb) == 4 and all(np.abs(s.rgb[y, x] - n).sum() > 45 for n in nb):
                    # keep it only if it is very bright or very dark (a deliberate highlight or seam)
                    L = s.rgb[y, x].mean(); Ln = np.mean([n.mean() for n in nb])
                    if abs(L - Ln) < 70: out[y, x] = min(nb, key=lambda n: np.abs(n - s.rgb[y, x]).sum())
        s.rgb = out

    def at(s, x, y):
        """design coordinates -> pixel coordinates (when the figure was drawn scaled)"""
        g = getattr(s, 'gs', 1.0)
        return int(round(x * g)), int(round(y * g))

    def px(s, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < s.rgb.shape[1] and 0 <= y < s.rgb.shape[0]:
            s.rgb[y, x] = hx(c) * 255 if isinstance(c, str) else c; s.A[y, x] = True

    def image(s):
        h, w = s.A.shape
        img = np.zeros((h, w, 4)); img[..., :3] = s.rgb; img[..., 3] = s.A * 255
        if s.outline:
            A = np.pad(s.A, 1)
            out = (A[:-2, 1:-1] | A[2:, 1:-1] | A[1:-1, :-2] | A[1:-1, 2:]) & ~s.A
            P = np.pad(s.rgb, ((1, 1), (1, 1), (0, 0)))
            for y, x in zip(*np.nonzero(out)):
                nb = [P[y + 1 + dy, x + 1 + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if A[y + 1 + dy, x + 1 + dx]]
                c = np.mean(nb, axis=0)
                lit_side = (A[y + 2, x + 1] or A[y + 1, x + 2])   # sprite is below/right: top-left edge, a softer line
                k = np.array([.42, .36, .48]) if lit_side else np.array([.2, .16, .26])
                img[y, x, :3] = c * k + np.array([8, 4, 16]); img[y, x, 3] = 255
        return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGBA')
