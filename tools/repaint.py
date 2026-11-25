"""Repaint an existing pixel template with the Yewen's 3D method.

The template is scaled up (scale2x), then every palette colour becomes a part with its own
7-step ramp (shadows cool, highlights warm). Lighting comes from the upper left through a
height field that mixes the whole silhouette (the body reads as one volume) with each part
(muscles, plates and folds bulge on their own). Bands are ordered-dithered, seams between
parts are darkened on their shadow side, the silhouette gets a selective outline (lit edges
lighter, shadow edges dark, plus a contour), and a coloured rim light runs down the back edge.
Glowing colours stay flat and bright with a soft halo; near-black details stay crisp."""
import numpy as np
from scipy.ndimage import distance_transform_edt, gaussian_filter, label

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
LIGHT = np.array([-0.62, -0.62, 0.48]); LIGHT /= np.linalg.norm(LIGHT)
STEPS = [-0.80, -0.58, -0.36, -0.16, 0.06, 0.28, 0.50]

def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)

def ramp(base):
    shadow = np.array([base[0] * 0.30 + 6, base[1] * 0.32 + 6, base[2] * 0.42 + 22])
    light = np.array([255, 244, 222.0])
    out = []
    for t in STEPS:
        c = base + (shadow - base) * (-t) if t < 0 else base + (light - base) * t
        out.append(np.clip(c, 0, 255))
    return np.array(out)

def heights(mask, cap_frac=0.5):
    d = distance_transform_edt(mask)
    R = max(2.0, min(d.max(), max(mask.shape) * cap_frac))
    return np.sqrt(np.clip(d / R, 0, 1)) * R

def repaint(rows, pal, glow='', aura=None):
    H, W = len(rows), len(rows[0])
    ch = np.array([list(r) for r in rows])
    solid = (ch != '.') & (ch != 'o')
    # global volume + per-part bulge
    hg = heights(solid, 0.35) * 0.62
    hp = np.zeros((H, W))
    for c in set(ch[solid].tolist()):
        m = (ch == c) & solid
        lab, n = label(m)
        for i in range(1, n + 1):
            mm = lab == i
            hp[mm] = heights(mm, 0.5)[mm]
    h = gaussian_filter(hg + hp * 0.55, 0.7)
    gy, gx = np.gradient(h)
    nrm = np.dstack([-gx, -gy, np.ones_like(h)]); nrm /= np.linalg.norm(nrm, axis=2, keepdims=True)
    lum = (nrm @ LIGHT - 0.15) / 0.85
    lum = lum - (np.arange(H)[:, None] / H) * 0.10 + 0.08
    bay = BAYER[np.arange(H)[:, None] % 4, np.arange(W)[None, :] % 4]
    rgb = np.zeros((H, W, 3)); alpha = solid.copy()
    ramps = {c: ramp(hexrgb(pal[c])) for c in pal if c in set(ch[solid].tolist())}
    for y in range(H):
        for x in range(W):
            if not solid[y, x]: continue
            c = ch[y, x]; base = hexrgb(pal[c])
            if c in glow or base.sum() < 70: rgb[y, x] = base; continue
            t = np.clip(lum[y, x], 0, 0.999) * 6
            i = int(np.clip(np.floor(t + (bay[y, x] - 0.5) * 0.55), 0, 6))
            rgb[y, x] = ramps[c][i]
    # seams between parts, on the shadow side (right / below)
    out = rgb.copy()
    for y in range(1, H):
        for x in range(1, W):
            if not solid[y, x]: continue
            c = ch[y, x]
            if c in glow: continue
            for X, Y in ((x - 1, y), (x, y - 1)):
                if solid[Y, X] and ch[Y, X] != c and ch[Y, X] not in glow:
                    out[y, x] = rgb[y, x] * 0.72; break
    rgb = out
    # glow halos
    for y in range(H):
        for x in range(W):
            if solid[y, x] and ch[y, x] in glow:
                g = hexrgb(pal[ch[y, x]])
                for X, Y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= X < W and 0 <= Y < H and solid[Y, X] and ch[Y, X] not in glow:
                        rgb[Y, X] = rgb[Y, X] * 0.65 + g * 0.35
    # selective outline + contour
    out = rgb.copy()
    for y in range(H):
        for x in range(W):
            if not solid[y, x]: continue
            nb = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
            edge = [(X, Y) for X, Y in nb if not (0 <= X < W and 0 <= Y < H and solid[Y, X])]
            if edge and ch[y, x] not in glow:
                lit = any(X < x or Y < y for X, Y in edge)
                out[y, x] = np.minimum(255, rgb[y, x] * 0.62 + 10) if lit else rgb[y, x] * 0.32
    ring = np.zeros_like(solid)
    for y in range(H):
        for x in range(W):
            if solid[y, x]: continue
            if any(0 <= X < W and 0 <= Y < H and solid[Y, X] for X, Y in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]):
                ring[y, x] = True
    out[ring] = (10, 6, 14); alpha = solid | ring
    # rim light down the back (right) edge, tinted with the creature's aura
    if aura:
        rc = np.array([float(v) for v in aura.split(',')])
        for y in range(H):
            for x in range(2, W - 2):
                if solid[y, x] and solid[y, x + 1] and not solid[y, x + 2] and ch[y, x] not in glow:
                    out[y, x] = out[y, x] * 0.55 + rc * 0.45
    img = np.zeros((H, W, 4), np.uint8); img[..., :3] = np.clip(out, 0, 255); img[..., 3] = alpha * 255
    return img
