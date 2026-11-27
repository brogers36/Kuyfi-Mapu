"""HD environment pieces (3x: 48 px tiles). Preview stage."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from hd import Sprite, PAL, E, R, poly, U, I, NOT, hx, ramp

G = ramp('#14301c', '#1e4426', '#2a5a2e', '#387236', '#4a8a3e', '#66a64a', '#8cc45e')
DIRT = ramp('#3a2814', '#5a3e20', '#7a5830', '#9a7442', '#b89258', '#d2ae74')
STRAW = ramp('#2c1a08', '#4a2e10', '#6c461a', '#8e6024', '#b07e32', '#cca048', '#e4c06a')
LEAF = ramp('#0a1e12', '#123020', '#1a442a', '#245a32', '#30723a', '#428c44', '#5ca852')
BARK = ramp('#1a0e08', '#2e1a0e', '#462816', '#5e3820', '#76482a')
STONE = ramp('#2a2a30', '#44444c', '#62626a', '#82828a', '#a4a4aa', '#c8c8cc')
rng = np.random.default_rng(7)

def grass(w, h, seed=1):
    r = np.random.default_rng(seed)
    n = gaussian_filter(r.standard_normal((h, w)), 14); n = (n - n.mean()) / n.std()
    lvl = np.where(n > 1.1, 5, np.where(n > -1.2, 4, 3))
    soft = {3: (G[3] + G[4]) / 2, 4: G[4], 5: (G[4] + G[5]) / 2}
    img = np.zeros((h, w, 3))
    for k, c in soft.items(): img[lvl == k] = c
    # small dark specks at patch edges for texture
    for _ in range(w * h // 330):
        x, y = r.integers(3, w - 4), r.integers(5, h - 2)
        b = lvl[y, x]
        dark, mid, tip = G[b - 1], G[min(6, b + 1)], G[min(6, b + 2)]
        # a tuft: three blades leaning out from a dark root
        img[y, x - 2:x + 3] = dark
        img[y - 1, x - 2] = mid; img[y - 2, x - 3] = tip
        img[y - 1, x] = mid; img[y - 2, x] = mid; img[y - 3, x] = tip
        img[y - 1, x + 2] = mid; img[y - 2, x + 3] = tip
        img[y - 1, x - 1] = dark; img[y - 1, x + 1] = dark
    return img

def flowers(img, n, seed=3):
    r = np.random.default_rng(seed)
    h, w = img.shape[:2]
    for _ in range(n):
        x, y = r.integers(3, w - 3), r.integers(3, h - 3)
        c = [hx('#fbf6ff'), hx('#f6e46a'), hx('#c49ae8')][r.integers(0, 3)]
        img[y + 2, x] = G[2]; img[y + 3, x] = G[2]
        for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)): img[y + dy, x + dx] = c * (.82 if dy > 0 else 1)
        img[y, x] = hx('#f2b830') if c[2] > 200 else hx('#fff8d0')
        img[y - 2, x] = c; img[y, x - 2] = c * .9; img[y, x + 2] = c * .9

def path_band(img, y0, y1, seed=5):
    r = np.random.default_rng(seed)
    h, w = img.shape[:2]
    edge_t = gaussian_filter(r.standard_normal(w), 4) * 4
    edge_b = gaussian_filter(r.standard_normal(w), 4) * 4
    n = gaussian_filter(r.standard_normal((h, w)), 5); n = (n - n.mean()) / n.std()
    for x in range(w):
        a, b = int(y0 + edge_t[x]), int(y1 + edge_b[x])
        for y in range(max(0, a), min(h, b)):
            img[y, x] = DIRT[3] if n[y, x] < .6 else DIRT[4]
            if y == a: img[y, x] = G[1]
            elif y == a + 1: img[y, x] = DIRT[2]
            elif y == b - 1: img[y, x] = DIRT[2]
        if 0 <= b < h: img[b, x] = G[1]
    for _ in range(w // 6):                                           # pebbles
        x, y = r.integers(2, w - 3), r.integers(y0 + 4, y1 - 3)
        img[y, x] = STONE[4]; img[y, x + 1] = STONE[3]; img[y + 1, x] = STONE[2]; img[y + 1, x + 1] = DIRT[1]
    for _ in range(w // 9):                                           # ruts
        x, y = r.integers(2, w - 8), r.integers(y0 + 5, y1 - 4)
        for k in range(r.integers(3, 7)): img[y, x + k] = DIRT[2]

def ruka(w=150, h=126):
    s = Sprite(w, h)
    cx = w / 2
    dome = U(I(E(cx, h * .66, w * .47, h * .64), R(0, 0, w, h * .93)), poly([(w * .02, h * .93), (w * .98, h * .93), (w * .93, h * .7), (w * .07, h * .7)]))
    m = s.shape(dome, STRAW, bulge=1.4, top=.3)
    yy, xx = np.mgrid[0:h, 0:w]
    # thatch rows: a darker line at the bottom of each layer, straw strokes in between
    base = s.rgb.copy()
    for k, y in enumerate(range(int(h * .12), int(h * .92), 9)):
        row = m & (yy >= y) & (yy < y + 9)
        for x in range(w):
            for yv in range(y, y + 9):
                if yv < h and m[yv, x] and ((x * 7 + k * 3 + (yv - y) // 4) % 5 == 0):
                    s.rgb[yv, x] = base[yv, x] * .78
                if yv < h and m[yv, x] and ((x * 3 + k) % 11 == 0) and yv - y < 6:
                    s.rgb[yv, x] = np.minimum(255, base[yv, x] * 1.18)
        for x in range(w):
            yb = y + 8 + int(1.5 * np.sin(x * .9 + k))
            if yb < h and m[yb, x]: s.rgb[yb, x] = STRAW[1]
            if yb + 1 < h and m[yb + 1, x]: s.rgb[yb + 1, x] = STRAW[2]
    # door: a dark opening with a warm glow inside
    dw, dh = w * .16, h * .3
    door = poly([(cx - dw / 2, h * .9), (cx + dw / 2, h * .9), (cx + dw / 2, h * .9 - dh), (cx, h * .9 - dh - 5), (cx - dw / 2, h * .9 - dh)])
    dm = s.mask(door)
    s.rgb[dm] = hx('#1a0c06')
    glow = dm & (yy > h * .9 - dh * .55)
    s.rgb[glow] = hx('#7a3410')
    s.rgb[glow & (np.abs(xx - cx) < dw * .25) & (yy > h * .9 - dh * .4)] = hx('#f0a030')
    s.rgb[glow & (np.abs(xx - cx) < dw * .12) & (yy > h * .9 - dh * .3)] = hx('#fff0a0')
    s.part[dm] = 99
    # smoke hole at the top
    s.shape(E(cx + 4, h * .06 + 2, 6, 3), [hx('#1a0c06')] * 3, tone=.5)
    # base: the low wall of wattle at the foot
    s.shape(I(R(w * .03, h * .86, w * .97, h * .99), NOT(R(0, 0, w, h), door)), BARK, bulge=.6)
    for x in range(int(w * .04), int(w * .96), 5):
        for y in range(int(h * .86), int(h * .99)):
            if s.a[y, x] and s.part[y, x] != 99: s.rgb[y, x] = BARK[1]
    return s.finish()

def tree(w=96, h=120, seed=0):
    r = np.random.default_rng(seed)
    s = Sprite(w, h)
    s.shape(poly([(w * .42, h), (w * .58, h), (w * .55, h * .6), (w * .45, h * .6)]), BARK, bulge=1)
    s.shape(poly([(w * .2, h - 4), (w * .8, h - 4), (w * .6, h * .78), (w * .4, h * .78)]), BARK, tone=.1, line=False) if False else None
    # leaf clusters, back to front: each a small sphere lit from the upper left, separated by darker lines
    pts = []
    for ring, (ry, rr, n) in enumerate(((.22, .26, 4), (.38, .38, 6), (.55, .40, 6), (.66, .3, 4))):
        for k in range(n):
            a = (k + .5) / n
            pts.append((w * (.5 + (a - .5) * 2 * rr) + r.normal(0, 2), h * ry + r.normal(0, 2), w * (.13 + .03 * r.random())))
    pts.sort(key=lambda p: p[1])
    for (x, y, rad) in pts:
        s.shape(E(x, y, rad, rad * .88), LEAF, bulge=1.3, light=(-.7, -.7))
    # sun-catching leaf speckles on the lit side of each cluster
    for (x, y, rad) in pts:
        for _ in range(3):
            xx, yy = int(x - rad * .45 + r.normal(0, 1.5)), int(y - rad * .45 + r.normal(0, 1.5))
            if 0 < xx < w - 1 and 0 < yy < h - 1 and s.a[yy, xx]:
                s.px(xx, yy, LEAF[6]); s.px(xx + 1, yy, LEAF[5])
    return s.finish()

def fire(w=36, h=36):
    s = Sprite(w, h)
    cx = w / 2
    for k, x in enumerate((cx - 9, cx + 9, cx - 5, cx + 5)):
        s.shape(E(x, h - 6, 4.5, 3.6), STONE, bulge=1.2)
    s.shape(poly([(cx - 10, h - 9), (cx + 10, h - 4), (cx + 9, h - 2), (cx - 11, h - 7)]), BARK, bulge=1)
    s.shape(poly([(cx + 10, h - 9), (cx - 10, h - 4), (cx - 9, h - 2), (cx + 11, h - 7)]), BARK, bulge=1)
    FL = ramp('#8a1a06', '#c83a0a', '#f06a10', '#fca22a', '#ffd660', '#fff6c0')
    s.shape(poly([(cx - 8, h - 8), (cx - 6, h - 18), (cx - 3, h - 14), (cx, h - 30), (cx + 3, h - 17), (cx + 6, h - 22), (cx + 8, h - 8)]), FL, tone=.4, line=False)
    s.shape(poly([(cx - 5, h - 8), (cx - 3, h - 15), (cx, h - 24), (cx + 3, h - 15), (cx + 5, h - 8)]), FL, tone=.7, line=False)
    s.shape(poly([(cx - 2.5, h - 8), (cx, h - 17), (cx + 2.5, h - 8)]), FL, tone=.95, line=False)
    return s.finish()

def shadow(img, cx, cy, rx, ry):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    m = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1
    img[m] = img[m] * .72

def atmosphere(img, sun=(820, -60), fires=(), shade_left=60, shade_bottom=600, seed=11):
    """Clean lighting: posterized warm sunlight from the upper right, dappled tree shade with hard edges, firelight."""
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.hypot(xx - sun[0], yy - sun[1])
    warm = np.array([1.10, 1.06, .90])
    for r, k in ((330, 1.0), (520, .6), (700, .3)):
        m = d < r
        img[m] = np.minimum(255, img[m] * (1 + (warm - 1) * k * .5))
    r = np.random.default_rng(seed)
    n = gaussian_filter(r.standard_normal((h, w)), 6); n = (n - n.mean()) / n.std()
    edge = np.minimum(xx - shade_left, (shade_bottom - yy)) / 60.0
    shade = (n * .7 - edge) > 0
    img[shade] = img[shade] * np.array([.74, .80, .86])
    for fx, fy in fires:
        df = np.hypot(xx - fx, (yy - fy) * 1.2)
        for rr, k in ((40, .22), (70, .12), (100, .06)):
            m = df < rr
            img[m] = np.minimum(255, img[m] * (1 + np.array([1, .6, .1]) * k))
    return img
