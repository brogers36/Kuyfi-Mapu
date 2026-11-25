"""The other battle backdrops, built with the same method as the coast (tools/bg_paint.py):
heightfield shading under a low sun from the right, ordered dithering, a perspective ground with a pool
of light where the fighters stand, and framing pieces kept inside the middle 256 px."""
import math, numpy as np
from bg_paint import (W, H, Pic, P, hx, bay, B4, YY, XX, BAYF, fbm, ridged, vnoise, shade, paint,
                      SKY, CLOUD, MNT, SNOW, ROCK, WOOD, SAND, FOAM, CREST)

# ---------------------------------------------------------------- shared pieces
def sky(s, hz, ramp, sun=None, warm='#ffeec4', stars=0, seed=1):
    t = (YY / max(1, hz)) ** 1.1
    paint(s, YY < hz, t, ramp)
    if sun:
        sx, sy, rad = sun
        d = np.hypot((XX - sx) * .6, YY - sy); lvl = np.floor((1 - d / rad) * 4 + BAYF)
        m = (YY < hz) & (lvl > 0); k = (lvl[m] * .13)[:, None]
        s.p[m] = (s.p[m] * (1 - k) + hx(warm) * k).astype(np.uint8)
    if stars:
        r = np.random.RandomState(seed)
        for _ in range(stars):
            x, y = r.randint(0, W), r.randint(0, int(hz * .8))
            s.px(x, y, '#ffffff' if r.rand() < .3 else '#c8d0f0')

def clouds(s, lst, ramp, hz):
    for cx, cy, w, h, sd in lst:
        r = np.random.RandomState(sd)
        lobes = [(cx + r.randint(-w // 2, w // 2), cy - r.randint(0, h), r.randint(h, h * 2)) for _ in range(7)]
        lobes += [(cx - w // 2 + 6, cy - 2, h), (cx + w // 2 - 6, cy - 2, h)]
        m = np.zeros((H, W), bool); L = np.zeros((H, W))
        for lx, ly, lr in lobes:
            e = ((XX - lx) / (lr * 1.35)) ** 2 + ((YY - ly) / lr) ** 2
            inside = (e <= 1) & (YY <= cy + 1)
            lit = .55 + .45 * (((XX - lx) / (lr * 1.35)) * .6 - ((YY - ly) / lr) * .8)
            L = np.where(inside & (~m | (lit > L)), lit, L); m |= inside
        L = L - (YY >= cy - 1) * .4
        paint(s, m & (YY < hz), L, ramp)

def ridge1(seed, base, amp, x):
    r = np.random.RandomState(seed); ph = r.rand(4) * 6
    return base - amp * (abs(np.sin(x / 41 + ph[0])) * .6 + abs(np.sin(x / 17 + ph[1])) * .3 + abs(np.sin(x / 7 + ph[2])) * .1)

def range_layer(s, seed, base, amp, hz, ramp, ridge_w=5, lo=.05, gain=1.0, snow=None, fade=None, fade_from=.45, round_=False):
    xs = np.arange(W, dtype=float)
    top = ridge1(seed, base, amp, xs)
    if round_: top = base - amp * (.55 + .45 * np.sin(xs / 53 + seed)) - amp * .25 * np.sin(xs / 19 + seed * 2)
    T = top[None, :]; below = (YY >= T) & (YY < hz)
    rid = ridged(XX / 15 + seed, YY / 7, 20 + seed, 4)
    z = (hz - YY) * .35 + rid * ridge_w
    L = shade(z, 1.0); dist = (YY - T) / np.maximum(1, hz - T)
    paint(s, below, lo + L * gain - dist * .15, ramp)
    if snow is not None:
        sm = below & (T < snow[0]) & ((YY - T) < 2 + (rid > .55) * snow[1])
        paint(s, sm, .1 + L * 1.1, SNOW)
    if fade is not None:
        f = below & (dist > fade_from); k = np.clip((dist - fade_from) * .9, 0, .5)[f][:, None]
        s.p[f] = (s.p[f] * (1 - k) + hx(fade) * k).astype(np.uint8)
    g = np.gradient(top)
    for x in range(W):
        ty = int(top[x])
        if 0 <= ty < hz: s.px(x, ty, ramp[-1] if g[x] > 0 else ramp[max(0, len(ramp) // 2 - 1)])
    return top

def ground(s, y0, ramp, cx=.52, cy=140, spread=46, base=.32, pool=.55, depth=.14, tex=.28, seed=0):
    m = YY >= y0
    pl = np.exp(-(((XX - W * cx) / (W * .42)) ** 2 + ((YY - cy) / spread) ** 2))
    # patches stretched by perspective: wide and flat far away, bigger near the viewer
    sc = 1 + (YY - y0) / 30
    pat = fbm(XX / (8 * sc), (YY - y0) / (2.2 * sc) + seed, 200 + seed, 3) - .5
    paint(s, m, base + pl * pool - (YY - y0) / (H - y0) * depth + pat * tex * 2, ramp)
    r = np.random.RandomState(300 + seed)
    for _ in range(260):   # pebbles / clods with a lit top and a dark underside
        x, y = r.randint(0, W), r.randint(y0 + 2, H - 2); w = 1 + int((y - y0) / 40)
        for i in range(w): s.px(x + i, y, ramp[min(len(ramp) - 1, 5)]); s.px(x + i, y + 1, ramp[0])

def rows(s, y0, fn, start=3.0, grow=1.15):
    """call fn(y, k) for perspective rows: spacing grows toward the viewer"""
    yy, k = y0 + start, 0
    while yy < H:
        fn(int(yy), k); yy += 3 + k * grow; k += 1

def darken(s, mask, k):
    s.p[mask] = (s.p[mask] * k).astype(np.uint8)

def boulder(s, cx, cy, rx, ry, seed, ramp, cast=True, wet=None, snowcap=False, rim=None):
    nx, ny = (XX - cx) / rx, (YY - cy) / ry; ang = np.arctan2(ny, nx)
    edge = 1 + .12 * np.sin(ang * 4 + seed) + .03 * np.sin(ang * 9 + seed * 2)
    r2 = np.sqrt(nx * nx + ny * ny); m = (r2 <= edge) & (YY < H)
    dome = np.sqrt(np.clip(1 - (r2 / edge) ** 2, 0, 1)) * min(rx, ry)
    z = dome + np.floor(fbm(XX / 7 + seed, YY / 7, 80 + seed, 2) * 5) * 2.2 + fbm(XX / 3.5, YY / 3.5, 90 + seed) * .7
    L = shade(z, .9)
    if cast:
        sh = (np.sqrt(((XX - cx + rx * .45) / (rx * 1.1)) ** 2 + ((YY - cy - ry * .55) / (ry * .45)) ** 2) <= 1) & ~m & (YY < H)
        darken(s, sh, .62)
    ao = np.clip((YY - (cy + ry * .35)) / (ry * .7), 0, 1)
    paint(s, m, .14 + L * .95 - ao * .3, ramp)
    cr = m & (abs(fbm(XX / 4, YY / 9, 99 + seed) - .5) < .018); s.p[cr] = ramp[0]
    if wet: w_ = m & (fbm(XX / 4, YY / 4, 95 + seed) > .7) & (L > .6); s.p[w_] = hx(wet)
    if snowcap:
        sc = m & (ny < -.25 + (fbm(XX / 3, YY / 3, 97 + seed) - .5) * .5); paint(s, sc, .2 + L * .9, SNOW)
    if rim:
        rm = m & (r2 / edge > .7) & (nx > .3) & (BAYF < (nx - .3) * 1.4); s.p[rm] = (s.p[rm] * .4 + hx(rim) * .6).astype(np.uint8)
    return m

def grass_tuft(s, x, y, h, ramp, seed, lean=0):
    r = np.random.RandomState(seed)
    for k in range(int(h * .9)):
        bx = x + r.randint(-h // 2, h // 2 + 1); bh = int(h * (.5 + r.rand() * .5)); bl = (r.rand() - .5) * 1.2 + lean
        for i in range(bh):
            px_ = int(bx + bl * i * i / max(1, bh)); c = ramp[min(len(ramp) - 1, int((i / bh) * (len(ramp) - 1) * .9 + (1 if px_ > x else 0)))]
            s.px(px_, y - i, c)

def broadleaf(s, cx, base_y, h, seed, leaf, trunk, dark=None):
    """a round-crowned tree (coigüe, roble): trunk, then clusters shaded as spheres lit from the right"""
    r = np.random.RandomState(seed)
    tw = max(2, h // 12)
    for y in range(base_y - int(h * .5), base_y):
        for x in range(cx - tw, cx + tw + 1): s.px(x, y, trunk[min(len(trunk) - 1, 1 + (x - cx + tw) * (len(trunk) - 2) // (2 * tw + 1))])
    cl = [(cx + r.randint(-h // 3, h // 3), base_y - int(h * .55) - r.randint(0, int(h * .4)), r.randint(h // 6, h // 4 + 1)) for _ in range(9)]
    for (x0, y0, rr) in sorted(cl, key=lambda c: c[1]):
        m = (((XX - x0) / (rr * 1.15)) ** 2 + ((YY - y0) / rr) ** 2 <= 1)
        nxx = (XX - x0) / (rr * 1.15); nyy = (YY - y0) / rr
        L = np.clip(.5 + nxx * .45 - nyy * .4, 0, 1) + (fbm(XX / 2, YY / 2, seed + x0) - .5) * .5
        paint(s, m, L, leaf)
    if dark is not None:
        sh = (((XX - cx + h * .3) / (h * .5)) ** 2 + ((YY - base_y) / 3.5) ** 2 <= 1); darken(s, sh & (YY < H), dark)

def pewen(s, cx, base_y, h, seed, leaf, trunk):
    """araucaria: a tall straight trunk and a flat umbrella crown of upturned branch tufts"""
    r = np.random.RandomState(seed)
    for y in range(base_y - h, base_y):
        for x in range(cx - 1, cx + 2): s.px(x, y, trunk[1 + (x - cx + 1)])
        if (y * 3) % 7 == 0: s.px(cx - 1, y, trunk[0])
    crown_top = base_y - h; layers = 4
    for l in range(layers):
        yy = crown_top + l * 4; span = 6 + l * 4 + r.randint(0, 3)
        for side in (-1, 1):
            for i in range(span):
                x = cx + side * i; y = yy + int(i * i / (span * 3.5)) - (1 if i > span - 3 else 0)
                for d in range(-1, 2):
                    c = leaf[min(len(leaf) - 1, max(0, 2 + d + (1 if side > 0 else -1) - (l == layers - 1)))]
                    s.px(x, y + d, c)
                if i > span - 3: s.px(x, y - 2, leaf[-1] if side > 0 else leaf[2])   # upturned tips

def conifer(s, cx, base_y, h, seed, leaf, trunk):
    """alerce / tall evergreen: a straight trunk with ragged drooping boughs, clumps lit from the right"""
    r = np.random.RandomState(seed)
    for y in range(base_y - h, base_y):
        for x in range(cx - 1, cx + 2): s.px(x, y, trunk[1 + (x - cx + 1)])
    y = base_y - h
    while y < base_y - h * .12:
        t = (y - (base_y - h)) / h; span = int(2 + t * h * .26 + r.randint(0, 3))
        for side in (-1, 1):
            for i in range(span):
                x = cx + side * i; yy = y + int(i * i / (span * 2.2 + 1))
                for d in range(-1, 2):
                    L = .45 + side * .25 - d * .15 + (r.rand() - .5) * .3
                    if r.rand() < .85: s.px(x, yy + d, leaf[int(np.clip(L, 0, .999) * len(leaf))])
        y += 3 + int(t * 2)

def vignette(s, k=.35):
    d = np.hypot((XX - W / 2) / (W * .62), (YY - H * .48) / (H * .75)); lvl = np.floor(np.clip(d - .75, 0, 1) * 4 * k * 4 + BAYF) / 4 * .5
    m = lvl > 0; s.p[m] = (s.p[m] * (1 - np.clip(lvl[m], 0, .6))[:, None]).astype(np.uint8)

# ---------------------------------------------------------------- palettes
GRASS = P('#1f3a1a', '#2c4f20', '#3b6626', '#4d7e2e', '#62953a', '#7aad48', '#98c65a', '#b8dc78')
WHEAT = P('#6a4e18', '#8a6a22', '#aa8a30', '#c8a840', '#dcc25a', '#eedb84')
LEAF = P('#0f2414', '#173420', '#22472a', '#2f5d33', '#3f7540', '#558e4c', '#72a95a')
DLEAF = P('#08140c', '#0f2016', '#16301f', '#1f4229', '#2a5534', '#386a40')
BARK = P('#1a120c', '#2e2016', '#463222', '#5e4630', '#7a5e42')
PEWL = P('#0e1e14', '#16301e', '#20442a', '#2c5a36', '#3a7044', '#4e8a54')
SNOWG = P('#7c8cac', '#96a6c4', '#b2c0da', '#cad6ea', '#dfe8f4', '#eef4fb', '#fbfdff')
LAVA = P('#3a0804', '#6a1208', '#a2220c', '#d8401a', '#f6742a', '#ffb04a', '#ffe08a')
BASALT = P('#0c0a0e', '#17131a', '#221c26', '#2e2632', '#3c3240', '#4c4050')
ASHSKY = P('#1a0a0e', '#2a0f12', '#3e1614', '#561e16', '#702a18', '#8e3a1c', '#b0522a')
RAINSKY = P('#3e4a52', '#4a5760', '#57656e', '#64737c', '#73828a', '#839299', '#95a3a8')
MOSS = P('#15200f', '#1f2f16', '#2b411d', '#385426', '#476a30', '#5a803c', '#73984c')
FJSKY = P('#1c222e', '#262e3c', '#313a4a', '#3d4858', '#4b5768', '#5c6878', '#707c8a')
FJROCK = P('#0c0e12', '#15181e', '#1f232b', '#2a2f38', '#363c46', '#444b56', '#565e6a')
PEBBLE = P('#1a1a1e', '#26262c', '#33333a', '#41414a', '#52525a', '#66666e')
DARKSEA = P('#0c1620', '#122030', '#182a3c', '#203648', '#2a4456', '#365466')
PSKY = P('#2c4a8a', '#3a5c9e', '#4c72b2', '#6a8cc4', '#8ea8d2', '#b6c6dc', '#dcd8c8', '#f0e4c8')
COIRON = P('#5a4418', '#76582020'[:7], '#927028', '#ae8a36', '#c8a446', '#dcbe62', '#ecd68a')
DUST = P('#6a4e30', '#82623c', '#9a7848', '#b28e58', '#c6a46a', '#d8ba82', '#e8d0a0')
SHRUB = P('#1e2414', '#2c3418', '#3c461e', '#4e5a26', '#647030')
NIGHT = P('#060818', '#0a0e26', '#101636', '#18204a', '#22305e', '#344676', '#4a5e8e')
LAGOON = P('#0a1424', '#0e1c32', '#142640', '#1a3250', '#223e60', '#2e4e72')
REED = P('#141a0c', '#1e2812', '#2a3818', '#3a4a20', '#4e602a', '#667a38')
DEEP = P('#04121c', '#071c2a', '#0a2638', '#0e3246', '#143e54', '#1c4c62', '#285e74', '#3a7486')
KELPG = P('#0c1a0c', '#142812', '#1e3a18', '#2a4c1e', '#386226', '#4a7a30')
SEAFLOOR = P('#3a3a2c', '#4a4a36', '#5c5a42', '#706c50', '#86805e', '#9c946e')
CAVE = P('#0c0a0a', '#181412', '#241e1a', '#322a24', '#42382e', '#544838', '#685a46')
CAVEW = P('#07141a', '#0c1e26', '#122a34', '#1a3842', '#244852', '#305a64')
CHENKE = P('#140e08', '#22180e', '#322414', '#44321c', '#584226', '#6e5432', '#866a42')
CITYSKY = P('#120c18', '#1e1222', '#2c182a', '#3e1f30', '#552834', '#6e3434', '#8a4434')
ASPH = P('#0e0e12', '#16161c', '#1e1e26', '#282832', '#34343e', '#42424c', '#54545e')
BRICK = P('#1c1214', '#2c1a1c', '#3e2426', '#523032', '#683e3e', '#7e4e4a')

# ---------------------------------------------------------------- the backdrops
def field():   # Nagche: rolling valley, wheat, fence, coigüe, a far volcano
    s = Pic(); HZ = 84
    sky(s, HZ, SKY, sun=(300, 76, 50))
    clouds(s, [(70, 26, 30, 6, 21), (190, 16, 22, 5, 22), (330, 30, 28, 6, 23), (260, 50, 14, 3, 24)], CLOUD, HZ)
    range_layer(s, 31, 74, 14, 104, MNT, ridge_w=4, lo=.25, gain=.9, fade=SKY[7], snow=(64, 3))
    # rolling green hills shaded as a heightfield
    xs = np.arange(W, dtype=float); top = 80 - 7 * np.sin(xs / 47 + 1) - 4 * np.sin(xs / 19); T = top[None, :]
    m = (YY >= T) & (YY < 108); z = (108 - YY) * .4 + fbm(XX / 18, YY / 6, 32) * 7
    paint(s, m, .2 + shade(z, 1.0) * .7 - (YY - T) / 40 * .1, GRASS)
    for x in range(W): s.px(x, int(top[x]), GRASS[6])
    # wheat field band with furrows
    wm = (YY >= 100) & (YY < 116) & (XX > 120) & (XX < 330)
    paint(s, wm, .35 + fbm(XX / 3, YY / 1.2, 33) * .45 + (YY % 3 == 0) * .1, WHEAT)
    # meadow floor
    ground(s, 108, GRASS, base=.38, pool=.45)
    def gr(y, k):
        for x in range(0, W, 3 + k // 3):
            if math.sin(x * .7 + k * 2.1) > .2: s.px(x, y, GRASS[6] if (x // 5) % 2 else GRASS[2]); s.px(x, y - 1, GRASS[7] if k > 6 else GRASS[5])
    rows(s, 110, gr)
    # fence across the mid-ground
    for x in range(86, 340):
        y = 112 + int((x - 86) * .02)
        if (x - 86) % 22 == 0:
            for d in range(0, 11): s.px(x, y - d, WOOD[3]); s.px(x + 1, y - d, WOOD[5])
        s.px(x, y - 8, WOOD[4]); s.px(x, y - 4, WOOD[4]); s.px(x, y - 7, WOOD[2])
    broadleaf(s, 80, 118, 46, 41, LEAF, BARK, dark=.75); broadleaf(s, 338, 116, 40, 42, LEAF, BARK, dark=.75)
    for x, y, h, sd in [(84, 222, 14, 1), (106, 224, 10, 2), (300, 223, 13, 3), (326, 224, 9, 4), (96, 214, 8, 5)]:
        grass_tuft(s, x, y, h, GRASS, sd)
    r = np.random.RandomState(5)
    for _ in range(40):
        x, y = r.randint(0, W), r.randint(124, H)
        s.px(x, y, ['#f4e070', '#f4f4f4', '#e88ab0'][r.randint(3)])
    return s, {'hz': HZ}

def forest():  # Ngen-mawida: a clearing in the deep forest, shafts of light, ferns
    s = Pic()
    paint(s, YY < H, .15 + (1 - YY / H) * .35, DLEAF)
    r = np.random.RandomState(7)
    for layer, (n, wmin, wmax, lit) in enumerate([(14, 3, 6, .15), (9, 6, 10, .35), (6, 10, 16, .55)]):
        for _ in range(n):
            x0 = r.randint(-10, W + 10); w = r.randint(wmin, wmax)
            for y in range(0, 128 + layer * 6):
                for x in range(x0 - w, x0 + w):
                    L = lit + (x - x0) / w * .3 + (fbm(x / 2.0, y / 9.0, 70 + layer) - .5) * .3
                    s.px(x, y, s.ramp_at(x, y, BARK if layer == 2 else DLEAF, L))
    # canopy framing the top
    cm = YY < 26 + fbm(XX / 9, YY / 9, 71) * 26
    paint(s, cm, .15 + fbm(XX / 3, YY / 3, 72) * .6, LEAF)
    # mossy clearing floor
    ground(s, 120, MOSS, base=.3, pool=.6, cy=142)
    rows(s, 122, lambda y, k: [s.px(x, y, MOSS[6]) for x in range(k % 4, W, 5 + k // 2) if math.sin(x + k) > 0])
    # light shafts (banded, additive)
    for k, bx in enumerate([150, 210, 270]):
        for y in range(20, 160):
            x0 = bx + (y - 20) * .45; wdt = 7 + k * 2
            for x in range(int(x0), int(x0 + wdt)):
                if 0 <= x < W and BAYF[y, x] < .5 - abs(x - x0 - wdt / 2) / wdt:
                    s.p[y, x] = np.minimum(255, s.p[y, x].astype(int) + 34).astype(np.uint8)
    # ferns (nalca-like fronds) at the foreground corners
    for cx, cy, sd in [(70, 214, 1), (100, 222, 2), (318, 218, 3), (346, 212, 4)]:
        for a in range(7):
            ang = -math.pi / 2 + (a - 3) * .38
            for i in range(26):
                x = cx + math.cos(ang) * i * 1.2 + (a - 3) * i * .05; y = cy + math.sin(ang) * i * .9 + i * i * .02
                s.px(x, y, LEAF[4 + (a > 3)]); s.px(x + 1, y, LEAF[2])
                if i % 3 == 0:
                    for j in (1, 2, 3): s.px(x - j, y + j * .3, LEAF[3]); s.px(x + j + 1, y + j * .3, LEAF[5])
    vignette(s, .4)
    return s, {}

def mount():   # Pewenche: cordillera, araucarias, snowfield
    s = Pic(); HZ = 92
    sky(s, HZ, SKY, sun=(310, 60, 46))
    clouds(s, [(80, 22, 26, 5, 31), (240, 14, 20, 4, 32)], CLOUD, HZ)
    range_layer(s, 41, 72, 34, HZ, MNT, ridge_w=3.5, lo=.2, gain=.9, snow=(66, 4), fade=SKY[7])
    range_layer(s, 43, 88, 14, HZ, MNT, ridge_w=2.5, lo=.05, gain=.6, snow=(80, 2))
    ground(s, HZ, SNOWG, base=.3, pool=.45, depth=.2, cy=138, tex=.4)
    def sw(y, k):   # wind-carved snow furrows
        for x in range(W):
            yy = int(y + 1.6 * math.sin(x / (20 + k * 3) + k))
            if HZ < yy < H - 1 and math.sin(x / 4.0 + k) > -.4:
                s.p[yy, x] = np.clip(s.p[yy, x].astype(int) - 22, 0, 255); s.p[yy - 1, x] = np.clip(s.p[yy - 1, x].astype(int) + 10, 0, 255)
    rows(s, HZ, sw, grow=1.3)
    for x, h, sd in [(62, 60, 1), (96, 44, 2), (124, 30, 3), (290, 34, 4), (322, 52, 5), (354, 64, 6)]:
        pewen(s, x, HZ + 4 + h // 3, h, sd, PEWL, BARK)
        darken(s, (((XX - x + 10) / 14) ** 2 + ((YY - (HZ + 4 + h // 3)) / 2.5) ** 2 <= 1), .8)
    for cx, cy, rx, ry, sd in [(70, 214, 34, 20, 51), (108, 222, 18, 10, 52), (340, 212, 32, 20, 53)]:
        boulder(s, cx, cy, rx, ry, sd, ROCK, snowcap=True)
    return s, {'hz': HZ}

def crater():  # Pillañ: inside the volcano, lava rivers, cracked basalt
    s = Pic(); HZ = 70
    sky(s, HZ, ASHSKY, sun=(200, 64, 70), warm='#ff8a3a')
    r = np.random.RandomState(3)
    for _ in range(60): s.px(r.randint(0, W), r.randint(0, HZ), '#ffb050' if r.rand() < .3 else '#6a3020')
    # crater walls rising on both sides
    xs = np.arange(W, dtype=float); top = 64 - (abs(xs - W / 2) / (W / 2)) ** 1.6 * 40 + 6 * np.sin(xs / 13) + (np.array([fbm(np.array([x / 6.0]), np.array([0.0]), 84)[0] for x in xs]) - .5) * 22
    T = top[None, :]; m = (YY >= T) & (YY < 112)
    z = ridged(XX / 7, YY / 5, 81, 4) * 7 + (112 - YY) * .3
    L = shade(z, 1.0); paint(s, m, .05 + L * .75, BASALT)
    glow = m & (YY > 90) & (BAYF < (YY - 90) / 30)     # lava glow lighting the foot of the walls
    s.p[glow] = (s.p[glow] * .6 + hx('#b0361a') * .4).astype(np.uint8)
    # lava lake across the middle
    lm = (YY >= 104) & (YY < 118)
    paint(s, lm, .45 + fbm(XX / 6, YY / 2, 82) * .5, LAVA)
    # cracked basalt floor with glowing seams
    ground(s, 116, BASALT, base=.25, pool=.45, cy=140)
    cr = (YY >= 118) & (abs(fbm(XX / 22, YY / 9, 83) - .5) < .008 + (YY - 118) / 9000)
    paint(s, cr, .55 + BAYF * .3, LAVA)
    for cx, cy, rx, ry, sd in [(64, 212, 36, 22, 61), (346, 210, 34, 22, 62)]:
        boulder(s, cx, cy, rx, ry, sd, BASALT, rim='#e0582a')
    vignette(s, .45)
    return s, {'hz': HZ}

def rainforest():  # Williche: overcast, alerce trunks, lake mist, mossy ground
    s = Pic(); HZ = 90
    sky(s, HZ, RAINSKY)
    range_layer(s, 51, 80, 18, HZ, P('#3a4a50', '#46565c', '#536369', '#617076', '#707e82'), ridge_w=4, lo=.2, gain=.6, fade='#8c9aa0', fade_from=.2)
    # far forest band
    fm = (YY >= 82 + fbm(XX / 4, YY, 52) * 6) & (YY < 104); paint(s, fm, .2 + fbm(XX / 2, YY / 2, 53) * .4, DLEAF)
    mist = (YY > 88) & (YY < 104) & (BAYF < .5 - abs(YY - 96) / 16); s.p[mist] = hx('#9aa8ac')
    for x, h, sd in [(40, 110, 1), (74, 96, 2), (330, 104, 3), (362, 116, 4), (120, 60, 5), (290, 64, 6)]:
        conifer(s, x, 104 + h // 8, h, sd, DLEAF, BARK)
    ground(s, 104, MOSS, base=.3, pool=.5, cy=140)
    rows(s, 106, lambda y, k: [s.px(x, y, MOSS[6] if k % 2 else MOSS[1]) for x in range(k % 3, W, 4 + k // 3) if math.sin(x * .5 + k) > .1])
    # puddles reflecting the grey sky
    for cx, cy, rx in [(180, 160, 26), (250, 176, 18)]:
        pm = (((XX - cx) / rx) ** 2 + ((YY - cy) / (rx * .18)) ** 2 <= 1); paint(s, pm, .5 + BAYF * .4, RAINSKY)
    # nalca leaves framing the bottom corners
    for cx, cy, sd in [(76, 210, 1), (330, 208, 2)]:
        for a in range(5):
            ang = -2.3 + a * .55; lx_, ly_ = cx + math.cos(ang) * 22, cy + math.sin(ang) * 16
            lm2 = (((XX - lx_) / 13) ** 2 + ((YY - ly_) / 8) ** 2 <= 1)
            paint(s, lm2, .3 + ((XX - lx_) / 13) * .3 + fbm(XX / 2, YY / 2, sd + a) * .3, LEAF)
            for i in range(20): s.px(cx + math.cos(ang) * i, cy + math.sin(ang) * i * .75, LEAF[6])
    return s, {'hz': HZ}

def fjord():   # Ngen-kürüf / Ngoyman threshold: steep cliffs, dark water, low cloud
    s = Pic(); HZ = 96
    sky(s, HZ, FJSKY)
    clouds(s, [(120, 40, 60, 8, 71), (300, 30, 50, 7, 72)], P('#3a4454', '#4a5464', '#5a6474', '#6c7684', '#808a96'), HZ)
    xs = np.arange(W, dtype=float)
    for side in (0, 1):
        if side == 0: edge = 6 + (xs / 165) ** 1.6 * 100 + 6 * np.sin(xs / 9) + 3 * np.sin(xs / 3.1)
        else: edge = 6 + ((W - xs) / 165) ** 1.6 * 100 + 6 * np.sin(xs / 11 + 2) + 3 * np.sin(xs / 2.9)
        top = np.clip(edge, 4, 120); T = top[None, :]
        m = (YY >= T) & (YY < 118) & (((XX < 175) if side == 0 else (XX > 225)))
        z = ridged(XX / 6, YY / 10, 91 + side, 4) * 8 + (XX if side == 0 else W - XX) * -.12
        paint(s, m, .05 + shade(z, 1.0) * .8, FJROCK)
    far = (YY >= 70 + 6 * np.sin(XX / 17)) & (YY < HZ) & ~s.a.astype(bool)
    paint(s, far, .45, FJSKY)
    wm = (YY >= HZ) & (YY < 118); paint(s, wm, .3 + (YY - HZ) / 40 + (np.sin(XX / 5 + YY * 1.3) > .8) * .2, DARKSEA)
    ground(s, 116, PEBBLE, base=.3, pool=.45, cy=142)
    r = np.random.RandomState(9)
    for _ in range(500):
        x, y = r.randint(0, W), r.randint(118, H); s.px(x, y, PEBBLE[5] if r.rand() < .4 else PEBBLE[1])
    fog = (YY > 60) & (YY < 116) & (BAYF < .3 - abs(YY - 100) / 60); s.p[fog] = hx('#7a8492')
    for cx, cy, rx, ry, sd in [(66, 212, 34, 22, 81), (340, 210, 32, 22, 82)]:
        boulder(s, cx, cy, rx, ry, sd, FJROCK, wet='#7a8898')
    vignette(s, .4)
    return s, {'hz': HZ}

def pampa():   # Puelmapu: huge sky, flat horizon, a far meseta, coirón grass, thorny shrubs
    s = Pic(); HZ = 98
    sky(s, HZ, PSKY, sun=(320, 88, 70), warm='#ffe0a8')
    clouds(s, [(60, 30, 40, 4, 91), (200, 22, 50, 4, 92), (330, 40, 30, 3, 93)], CLOUD, HZ)
    xs = np.arange(W, dtype=float); top = np.where((xs > 40) & (xs < 160), 84 + np.maximum(0, abs(xs - 100) - 44) * .6, 94) - 1.2 * np.sin(xs / 7)
    T = top[None, :]; m = (YY >= T) & (YY < HZ)
    paint(s, m, .35 + shade((HZ - YY) * .5 + fbm(XX / 4, YY / 2, 94) * 4, 1.0) * .4, P('#7a6a62', '#8e7c70', '#a28e80', '#b8a492'))
    ground(s, HZ, COIRON, base=.3, pool=.55, cy=144, depth=.18)
    def tuft(y, k):
        for x in range(k % 5, W, 5 + k):
            if math.sin(x * 1.3 + k) > 0:
                h = 1 + k // 3
                for i in range(h): s.px(x - i // 2, y - i, COIRON[6] if i == h - 1 else COIRON[4]); s.px(x + i // 2 + 1, y - i, COIRON[3])
    rows(s, HZ, tuft, grow=1.25)
    # a dusty track toward the horizon
    cxp = W * .5 + (YY - HZ) * .55; tm = (YY > HZ + 4) & (abs(XX - cxp) < (YY - HZ) * .45)
    paint(s, tm, .3 + fbm(XX / 3, YY / 3, 95) * .5, DUST)
    rut = tm & (abs(abs(XX - cxp) - (YY - HZ) * .25) < .6 + (YY - HZ) / 90); paint(s, rut, .15 + BAYF * .2, DUST)
    grass_mid = tm & (abs(XX - cxp) < (YY - HZ) * .06) & (BAYF < .5); s.p[grass_mid] = COIRON[3]
    for cx, cy, sd in [(72, 216, 1), (108, 222, 2), (318, 214, 3), (348, 220, 4)]:
        r = np.random.RandomState(sd)
        for _ in range(140):
            a = r.rand() * math.pi; d = r.rand() ** .6 * 20
            x, y = cx + math.cos(a) * d * 1.2, cy - math.sin(a) * d * .8
            s.px(x, y, SHRUB[r.randint(1, 5)])
        for _ in range(12): s.px(cx + r.randint(-20, 20), cy - r.randint(0, 14), '#f0e4a0')   # neneo flowers
    return s, {'hz': HZ}

def lagoon():  # Ngen-lafken: the sacred lagoon at dusk, totora reeds, the moon on the water
    s = Pic(); HZ = 92
    sky(s, HZ, NIGHT, stars=90, seed=4)
    mx, my = 280, 30
    moon = (((XX - mx) / 9) ** 2 + ((YY - my) / 9) ** 2 <= 1); paint(s, moon, .5 + (XX - mx) / 18 + .2, P('#a8b0c8', '#ccd4e6', '#eef2fa'))
    halo = (np.hypot(XX - mx, YY - my) < 26) & ~moon & (BAYF < .5 - np.hypot(XX - mx, YY - my) / 52); s.p[halo] = hx('#3a4e7e')
    range_layer(s, 61, 86, 14, HZ, NIGHT, ridge_w=3, lo=.25, gain=.4, round_=True)
    wm = (YY >= HZ) & (YY < 124); paint(s, wm, .2 + (YY - HZ) / 60, LAGOON)
    for y in range(HZ + 1, 124):     # moon path
        for x in range(mx - 2 - (y - HZ) // 3, mx + 3 + (y - HZ) // 3):
            if (x * 5 + y * 3) % 7 == 0: s.px(x, y, '#c8d4ee' if y % 2 else '#8ea4cc')
    ground(s, 122, P('#141a12', '#1c2418', '#26301e', '#323e26', '#404e30'), base=.3, pool=.5, cy=146)
    for cx, n in [(60, 30), (100, 16), (330, 26), (366, 18)]:
        r = np.random.RandomState(cx)
        for _ in range(n):
            x = cx + r.randint(-18, 18); h = r.randint(20, 44); b = 128 + r.randint(0, 60)
            for i in range(h): s.px(x + int(i * i * .004 * (1 if x > cx else -1)), b - i, REED[1 + (i > h * .3) + (i > h * .7)])
            for i in range(4): s.px(x, b - h - i, REED[5]); s.px(x + 1, b - h - i, REED[3])
    return s, {'hz': HZ, 'moon': [mx, my]}

def deep():    # Münche lafken: under the lake, rays of light, kelp, a sandy floor
    s = Pic()
    paint(s, YY < H, .85 - YY / H * .8, DEEP)
    for k, bx in enumerate([100, 180, 260, 330]):
        for y in range(0, 170):
            x0 = bx + y * .25; w = 10 + k * 2
            for x in range(int(x0), int(x0 + w)):
                if 0 <= x < W and BAYF[y, x] < .35 - y / 600 - abs(x - x0 - w / 2) / w * .5:
                    s.p[y, x] = np.minimum(255, s.p[y, x].astype(int) + 26).astype(np.uint8)
    ground(s, 118, SEAFLOOR, base=.2, pool=.5, cy=142)
    rows(s, 120, lambda y, k: [s.px(x, y, SEAFLOOR[4]) for x in range(k % 4, W, 6 + k) if math.sin(x * .3 + k) > .3])
    r = np.random.RandomState(12)
    for cx in [30, 52, 76, 330, 356, 380, 150, 250]:
        h = r.randint(60, 120) if cx < 100 or cx > 300 else r.randint(30, 50); base_y = 120 + r.randint(0, 20)
        for i in range(h):
            x = cx + 4 * math.sin(i / 9 + cx); y = base_y - i
            s.px(x, y, KELPG[3]); s.px(x + 1, y, KELPG[2]); s.px(x - 1, y, KELPG[4] if i % 3 else KELPG[5])
            if i % 7 == 0:
                for j in range(5): s.px(x + 2 + j, y - j * .5, KELPG[4]); s.px(x - 2 - j, y - j * .3, KELPG[3])
    for cx, cy, rx, ry, sd in [(70, 214, 34, 22, 101), (340, 212, 32, 22, 102)]:
        boulder(s, cx, cy, rx, ry, sd, P('#10181a', '#18262a', '#22363a', '#2e4648', '#3c5858', '#4c6a68'), wet='#6a9aa0')
    for _ in range(40): s.px(r.randint(0, W), r.randint(10, 110), '#8ec8d8')
    vignette(s, .45)
    return s, {}

def cave_base(rock, floor, light='#ffb060', seed=0, lava=False, water=False, bones=False):
    s = Pic()
    jt = 120 + (fbm(XX / 10, YY * 0, 115 + seed, 3) - .5) * 14            # wall/floor junction, uneven
    z = ridged(XX / 14 + seed, YY / 18, 110 + seed, 4) * 9 + fbm(XX / 4, YY / 4, 111 + seed) * 2
    wall = YY < jt
    t = .12 + shade(z, 1.0) * .7 + (1 - abs(XX - W / 2) / (W / 2)) * .12 - np.clip((40 - YY) / 40, 0, 1) * .3 - np.clip((YY - (jt - 14)) / 14, 0, 1) * .2
    paint(s, wall, t, rock)
    # a dark passage opening in the middle back
    d2 = ((XX - W / 2) / 44) ** 2 + ((YY - 104) / 32) ** 2; om = (d2 <= 1) & wall
    paint(s, om, np.clip(1 - d2, 0, 1) * .3, P('#000000', '#06050a', '#0c0a10', '#14101a'))
    rimm = (d2 > 1) & (d2 < 1.25) & wall & (XX > W / 2); s.p[rimm] = rock[-2]
    ground(s, 112, floor, base=.22, pool=.5, cy=142, seed=seed)
    s.p[wall] = s.p[wall]   # keep the wall over the ground
    paint(s, wall & ~om, t, rock); paint(s, om, np.clip(1 - d2, 0, 1) * .3, P('#000000', '#06050a', '#0c0a10', '#14101a'))
    jm = (YY >= jt) & (YY < jt + 5); darken(s, jm, .6)                   # contact shadow at the foot of the wall
    r = np.random.RandomState(seed + 5)
    for _ in range(70):                                                  # rubble along the foot of the wall
        x = r.randint(0, W); y = int(jt[0, x]) + r.randint(-1, 4); w = r.randint(2, 6)
        for dx in range(w):
            for dy in range(max(1, w // 2)): s.px(x + dx, y - dy, rock[min(len(rock) - 1, 2 + (dx > w // 2) * 2 - (dy == 0))])
    # stalactites, outlined and lit from the right
    for _ in range(24):
        x = r.randint(0, W); L = r.randint(8, 34); w = r.randint(2, 5)
        for i in range(L):
            ww = max(0, int(w * (1 - i / L)))
            for d in range(-ww, ww + 1): s.px(x + d, i, rock[int(np.clip(.25 + (d / max(1, ww)) * .35 + .15, 0, .99) * len(rock))])
            s.px(x - ww - 1, i, rock[0]); s.px(x + ww + 1, i, rock[0])
        s.px(x, L, rock[-1])
    # stalagmites rising from the floor at the sides
    for x0 in [26, 48, 352, 374]:
        L = r.randint(14, 26); base_y = 130 + r.randint(0, 8)
        for i in range(L):
            ww = int(4 * (1 - i / L)) + 1
            for d in range(-ww, ww + 1): s.px(x0 + d, base_y - i, rock[int(np.clip(.3 + d / ww * .35, 0, .99) * len(rock))])
    if lava:
        rv = (YY > 124) & (abs(XX - (W * .5 + 30 * np.sin(YY / 18))) < 3 + (YY - 124) * .07)
        paint(s, rv, .45 + BAYF * .4 + (np.sin(YY / 3 + XX) > .8) * .2, LAVA)
        gl = (YY > 120) & (abs(XX - (W * .5 + 30 * np.sin(YY / 18))) < 10 + (YY - 124) * .2) & ~rv & (BAYF < .35)
        s.p[gl] = (s.p[gl] * .6 + hx('#c0401a') * .4).astype(np.uint8)
    if water:
        pm = (((XX - 200) / 74) ** 2 + ((YY - 138) / 9) ** 2 <= 1)
        paint(s, pm, .3 + ((YY - 129) / 18) * .4 + (np.sin(XX / 3 + YY * 2) > .85) * .35, CAVEW)
        edge = pm & ~((((XX - 200) / 70) ** 2 + ((YY - 138) / 7.6) ** 2) <= 1); s.p[edge] = CAVEW[-1]
    if bones:
        for x, y in [(150, 170), (262, 184), (212, 160)]:
            for i in range(10): s.px(x + i, y + i // 4, '#d8d0bc'); s.px(x + i, y + i // 4 + 1, '#6a6250')
            for k in (0, 10): s.px(x + k - 1, y + k // 4 - 1, '#efe8d6'); s.px(x + k - 1, y + k // 4 + 1, '#efe8d6')
        for i in range(6):   # a skull
            for j in range(5):
                if (i - 2.5) ** 2 / 9 + (j - 2) ** 2 / 6 <= 1: s.px(300 + i, 160 + j, '#e2dac6' if i > 2 else '#b8b09c')
        s.px(301, 162, '#1a140c'); s.px(304, 162, '#1a140c')
    # torch-light pools on the walls
    for tx in (70, 330):
        d = np.hypot(XX - tx, (YY - 70) * 1.2); lvl = np.floor(np.clip(1 - d / 64, 0, 1) * 4 + BAYF)
        m = lvl > 0; k = (lvl[m] * .07)[:, None]; s.p[m] = (s.p[m] * (1 - k) + hx(light) * k).astype(np.uint8)
        for y in range(60, 76): s.px(tx, y, WOOD[2]); s.px(tx + 1, y, WOOD[3])
        for i, c in enumerate(['#ffe08a', '#ffb04a', '#f6742a', '#d8401a']): s.px(tx, 58 - i, c); s.px(tx + 1, 59 - i, c)
    for cx, cy, rx, ry, sd in [(66, 214, 34, 22, 121 + seed), (342, 212, 32, 22, 122 + seed)]:
        boulder(s, cx, cy, rx, ry, sd, rock, rim=light if lava else None)
    vignette(s, .5)
    return s

def cave():  return cave_base(CAVE, P('#1a1612', '#26201a', '#332a22', '#40362c', '#4e4436', '#5e5242'), seed=1), {}
def cave3(): return cave_base(BASALT, P('#140e0e', '#201616', '#2c1e1c', '#3a2824', '#4a322c'), light='#ff7a30', seed=3, lava=True), {}
def cave4(): return cave_base(P('#06100e', '#0c1a18', '#122624', '#1a3432', '#244442', '#305652'), P('#0c1614', '#14201e', '#1c2c28', '#263834', '#324642'), light='#9ae0d0', seed=4, water=True), {}
def cave5(): return cave_base(CHENKE, P('#1c140c', '#2a1e12', '#3a2a1a', '#4a3822', '#5c482c'), light='#ffc070', seed=5, bones=True), {}

def waria(tod=None):   # Santiago: a street at dusk. Shopfronts and flats, a wide pavement, wet asphalt where the fight is
    s = Pic(); HZ = 84; SW = 96; CURB = 118
    sky(s, HZ, CITYSKY, sun=(220, 70, 90), warm='#ff8a50'); sky_ref = s.p.copy(); s.a[:] = False
    r = np.random.RandomState(14)
    x = -10                                               # the far city: hazy blocks with a few lights
    while x < W + 10:
        bw = r.randint(18, 40); bh = r.randint(14, 46)
        m = (XX >= x) & (XX < x + bw) & (YY >= HZ - bh) & (YY < SW)
        paint(s, m, .32 + (XX - x) / bw * .1, P('#2a1e30', '#33243a', '#3c2a44', '#46304c'))
        for wy in range(HZ - bh + 3, SW - 4, 5):
            for wx in range(x + 2, x + bw - 2, 4):
                if r.rand() < .18: s.px(wx, wy, '#c8a070')
        x += bw + r.randint(0, 4)
    for k, (y0, y1) in enumerate([(20, 34), (26, 44), (30, 40)]):    # cables strung across the street, sagging
        for x in range(W):
            t = x / W; y = int(y0 + (y1 - y0) * t + math.sin(math.pi * ((x % 200) / 200)) * 8)
            s.px(x, y, '#120c14')
    FAC = [P('#3a2a2a', '#4e3834', '#644a42', '#7c5e52', '#947464', '#ac8a78'),
           P('#2e3040', '#3c3e52', '#4c5066', '#5e647a', '#727a90', '#8890a6'),
           P('#3a3428', '#4c4434', '#605642', '#766a52', '#8c8064', '#a49678'),
           P('#2a3434', '#364444', '#465656', '#586a68', '#6c7e7a', '#84948e')]
    AWN = [('#b83a30', '#efe6d4'), ('#2e5a9a', '#e6ecf2'), ('#2e7a4a', '#e8f0e4'), ('#c8862a', '#f6ead0')]
    x = -6; bi = 0
    while x < W:                                          # the near buildings along the street
        bw = [96, 74, 104, 82, 90][bi % 5]; top = [18, 32, 10, 26, 22][bi % 5]; ramp = FAC[bi % 4]
        m = (XX >= x) & (XX < x + bw) & (YY >= top) & (YY < SW)
        paint(s, m, .28 + (XX - x) / bw * .28 + fbm(XX / 2.5, YY / 2.5, 20 + bi) * .1, ramp)
        for xx in range(max(0, x), min(W, x + bw)):       # a cornice along the roofline, and its shadow
            s.px(xx, top, ramp[5]); s.px(xx, top + 1, ramp[4]); s.px(xx, top + 2, ramp[0]); s.px(xx, top + 3, ramp[1])
        if bi % 2 == 0:                                   # a water tank and an aerial on the roof
            tx = x + bw // 3
            for yy in range(top - 9, top):
                for xx in range(tx, tx + 10): s.px(xx, yy, '#3a3a44' if xx < tx + 7 else '#24242c')
            for yy in range(top - 18, top - 9): s.px(tx + 14, yy, '#1a1a20')
            for xx in range(tx + 10, tx + 19): s.px(xx, top - 15, '#1a1a20')
        for fy in range(top + 6, 72, 14):                 # floors of flats: framed windows, a ledge under each row
            for wx in range(x + 6, x + bw - 10, 15):
                kind = (wx * 7 + fy * 3 + bi) % 7
                glass = '#f4cc78' if kind < 2 else '#8aa8d0' if kind == 2 else '#1a1c26'
                for dy in range(9):
                    for dx in range(8):
                        col = glass if 0 < dx < 7 and 0 < dy < 8 else ramp[1]
                        if kind == 3 and 0 < dy < 8 and 0 < dx < 4: col = '#a0504a'    # a red curtain half drawn
                        if kind < 2 and dy > 4 and 0 < dx < 7: col = '#d8a858'
                        s.px(wx + dx, fy + dy, col)
                if kind < 3: light_pool(s, wx + 4, fy + 4, 9, 7, '#ffd890' if kind < 2 else '#9ac0f0', k=.12, mask=m)
                for dx in range(-1, 9): s.px(wx + dx, fy + 9, ramp[5]); s.px(wx + dx, fy + 10, ramp[0])
        sy = 76                                           # the shop at street level
        c1, c2 = AWN[bi % 4]
        for yy in range(sy, SW):
            for xx in range(max(0, x + 4), min(W, x + bw - 4)):
                win = sy + 7 <= yy < SW - 2 and (xx - x) % 40 < 30
                s.px(xx, yy, ('#f6dc9a' if yy < sy + 14 else '#d8b070') if win and bi % 3 != 1 else ('#4a4a52' if (yy % 2) else '#3a3a42') if bi % 3 == 1 else ramp[1])
        for xx in range(max(0, x + 2), min(W, x + bw - 2)):   # a striped awning with its shadow
            for yy in range(sy - 6, sy + 1):
                s.px(xx, yy, c1 if ((xx - x) // 5) % 2 else c2)
                if yy == sy - 6: s.px(xx, yy, '#1a1418')
            s.px(xx, sy + 1, '#1a1418'); s.px(xx, sy + 2, '#2a2228')
        for xx in range(x + 10, x + 40):                  # a sign board above the awning
            for yy in range(sy - 14, sy - 8): s.px(xx, yy, ['#e8d8b0', '#c83a30', '#2e5a9a', '#e8c030'][bi % 4] if yy > sy - 14 else '#1a1418')
        for k in range(5): s.px(x + 13 + k * 5, sy - 11, '#1a1418'); s.px(x + 14 + k * 5, sy - 11, '#1a1418')
        if bi % 3 != 1: light_pool(s, x + bw // 2, SW + 4, bw * .5, 10, '#ffd890', k=.25)
        x += bw; bi += 1
    for x in range(150, 198):                             # a mural of stepped ñimin painted over a blank side wall
        for y in range(38, 72):
            if x in (150, 197) or y in (38, 71): s.px(x, y, '#1a1418'); continue
            u = (x - 151) % 16; v = (y - 39) % 12; stp = abs(u - 8) <= (v if v < 6 else 12 - v)
            band = ((x - 151) // 16 + (y - 39) // 12) % 3
            col = hx(['#a02a28', '#1c1414', '#d8d0bc'][band] if stp else ['#d8d0bc', '#a02a28', '#1c1414'][band])
            wear = .82 + .18 * fbm(np.array([[x / 3]]), np.array([[y / 3]]), 5)[0, 0]
            s.px(x, y, tuple(int(c_ * wear) for c_ in col))
        s.px(x, 72, '#2a2224')
    contact(s, SW, k=.5, h=4)
    PAVE = P('#3a3836', '#4a4744', '#5a5652', '#6c6762', '#7e7872', '#928b84')
    paint(s, (YY >= SW) & (YY < CURB), .4 + (YY - SW) / 22 * .12 + fbm(XX / 3, YY / 1.5, 61) * .12, PAVE)
    for y in (SW + 5, SW + 11, CURB - 1):                 # paving slabs in perspective
        for x in range(W): s.p[y, x] = (s.p[y, x] * .8).astype(np.uint8)
    for x0 in range(-200, W + 200, 20):
        for y in range(SW, CURB):
            x = int(W / 2 + (x0 - W / 2) * (1 + (y - SW) / 30))
            if 0 <= x < W: s.p[y, x] = (s.p[y, x] * .84).astype(np.uint8)
    for x in range(W):                                    # the curb: a lit top edge and its face
        s.px(x, CURB, '#a8a49c'); s.px(x, CURB + 1, '#6a6660'); s.px(x, CURB + 2, '#3a3834'); s.px(x, CURB + 3, '#1a1a1e')
    rm = YY >= CURB + 4                                   # the road: smooth worn asphalt, darker toward the curb, a pool of light where the fight is
    pl = np.exp(-(((XX - W * .52) / (W * .45)) ** 2 + ((YY - 146) / 34) ** 2))
    paint(s, rm, .24 + pl * .42 + (fbm(XX / 14, (YY - CURB) / 3, 66, 3) - .5) * .12 - np.clip(1 - (YY - CURB) / 10, 0, 1) * .12, ASPH)
    for k in range(5):                                    # patched seams
        y = CURB + 14 + k * k * 4 + k * 6
        if y < H:
            for x in range(W):
                if (x // 9 + k) % 5: s.p[y, x] = (s.p[y, x] * .88).astype(np.uint8)
    refl = s.p[:SW].astype(float)                         # wet asphalt mirrors the lit windows and lamps: soft, smeared downward
    refl = (refl + np.roll(refl, 1, 1) + np.roll(refl, -1, 1)) / 3
    for y in range(CURB + 4, H):
        src = 2 * CURB - y
        if 0 <= src < SW:
            row = (refl[src] + refl[max(0, src - 1)] + refl[max(0, src - 2)]) / 3
            w_ = np.clip((row.mean(-1) - 120) / 90, 0, 1)[:, None] * .34 * (1 - (y - CURB) / (H - CURB)) ** 1.3
            s.p[y] = np.clip(s.p[y] * (1 - w_) + row * w_, 0, 255).astype(np.uint8)
    for (mx, my) in [(150, 176)]:                         # a manhole cover and oil stains
        for y in range(my - 4, my + 5):
            for x in range(mx - 10, mx + 11):
                if ((x - mx) / 10) ** 2 + ((y - my) / 4) ** 2 < 1: s.px(x, y, '#26262e' if (x + y) % 3 else '#34343c')
    for (ox_, oy_, orx, ory) in [(260, 160, 16, 3), (90, 190, 20, 4)]:
        m_ = ((XX - ox_) / orx) ** 2 + ((YY - oy_) / ory) ** 2 < 1; s.p[m_] = (s.p[m_] * .78).astype(np.uint8)
    yy, k = CURB + 30, 0                                  # the lane line: dashes growing toward the viewer
    for x0 in range(-40, W + 40, 46):
        for y in range(CURB + 26, CURB + 32):
            x = int(W / 2 + (x0 - W / 2) * (1 + (y - CURB) / 50))
            for i2 in range(18 + (y - CURB) // 4):
                if 0 <= x + i2 < W: s.p[y, x + i2] = (s.p[y, x + i2] * .45 + np.array(hx('#d8c860')) * .55).astype(np.uint8)
    for lx in (64, 322):                                  # street lamps on the pavement
        for y in range(26, SW + 12): s.px(lx, y, '#1e1e24'); s.px(lx + 1, y, '#3a3a44')
        for i2 in range(10): s.px(lx + 1 + i2, 26 - i2 // 4, '#3a3a44')
        for dy in range(3):
            for dx in range(6): s.px(lx + 8 + dx, 24 + dy, '#fff0b0' if dy else '#2a2a30')
        m_ = (YY > 27) & (YY < SW + 30) & (abs(XX - lx - 11) < (YY - 27) * .5)
        lvl = np.floor(np.clip(1 - abs(XX - lx - 11) / np.maximum(1, (YY - 27) * .5), 0, 1) * 3 + BAYF) / 3
        kk = (lvl * .1)[m_][:, None]; s.p[m_] = np.clip(s.p[m_] * (1 - kk) + hx('#ffe0a0') * kk, 0, 255).astype(np.uint8)
        light_pool(s, lx + 11, SW + 14, 46, 14, '#ffd27a', k=.3)
        light_pool(s, lx + 4, SW + 13, 6, 2, '#000000', k=.5)
    broadleaf(s, 232, SW + 6, 40, 21, LEAF, P('#1a120c', '#2a1e14', '#3e2c1e', '#523a28'))   # a street tree in its square of earth
    for x in range(222, 244):
        for y in range(SW + 4, SW + 8): s.px(x, y, '#2a2018' if 223 < x < 243 and y < SW + 7 else '#5a5650')
    light_pool(s, 232, SW + 7, 18, 3, '#000000', k=.45)
    for (bx, by) in [(352, 104)]:                         # a green bin on the pavement
        for y in range(by - 14, by):
            for x in range(bx - 6, bx + 6): s.px(x, y, ['#1a3a24', '#24502e', '#30663a', '#3e7a46'][min(3, max(0, (bx + 5 - x) // 3))] if y > by - 13 else '#122a1a')
        light_pool(s, bx, by + 1, 9, 2, '#000000', k=.5)
    retime(s, tod, 'dusk', sky_ref, ['#f4cc78', '#d8a858', '#f6dc9a', '#d8b070', '#fff0b0', '#8aa8d0', '#c8a070'], HZ,
           lamps=[(75, SW + 14, 46, 14), (333, SW + 14, 46, 14), (40, SW + 4, 40, 8), (130, SW + 4, 40, 8), (240, SW + 4, 40, 8), (350, SW + 4, 40, 8)], seed=14)
    vignette(s, .4)
    finish_bg(s, cool='#241c3a' if tod != 'day' else '#3a4a6a', warm='#ffc890' if tod != 'night' else '#b8c4e8', k=.14, grain=.04, seed=14)
    return s, {'hz': HZ, 'colors': 200}

def _mix(a, b, t): return a * (1 - t) + b * t
def retime(s, tod, base, sky_ref, emit, hz, lamps=(), seed=3):
    """repaint a finished street scene for another time of day: a new sky, the light of that hour on everything,
    and the lamps, windows and bulbs either glowing (night, dusk) or just glass and metal (day)"""
    if tod is None or tod == base: return
    p = s.p.astype(float)
    sky = ~s.a & (YY < hz)                                  # whatever was never painted over after the sky
    E = np.zeros((H, W), bool)
    for col in emit: E |= np.abs(p - np.array(hx(col), float)).sum(-1) < 36
    E &= ~sky
    t = np.clip(YY / max(1, hz), 0, 1)[..., None]
    rs = np.random.RandomState(seed)
    if tod == 'night':
        top, mid, low = np.array([4, 5, 14.]), np.array([14, 14, 34.]), np.array([52, 36, 54.])
        sk = np.where(t < .7, _mix(top, mid, t / .7), _mix(mid, low, (t - .7) / .3))
        sk += (BAYF[..., None] - .5) * 4
        p[sky] = sk[sky]
        for _ in range(90):
            x, y = rs.randint(0, W), rs.randint(0, max(1, int(hz * .75)))
            if sky[y, x]: p[y, x] = (236, 240, 255) if rs.rand() < .25 else (150, 160, 200)
        non = ~E & ~sky
        lum = p[non].mean(-1, keepdims=True)
        p[non] = (p[non] * .55 + lum * .45) * np.array([.30, .34, .52]) + np.array([3, 4, 10.])
        p[E] = np.clip(p[E] * 1.08 + 8, 0, 255)
        halo = np.zeros((H, W), bool)
        for d in (1, 2):
            for dy, dx in ((-d, 0), (d, 0), (0, -d), (0, d)): halo |= np.roll(np.roll(E, dy, 0), dx, 1)
        halo &= ~E & ~sky
        p[halo] = _mix(p[halo], np.array([255, 196, 120.]), .22)
        s.p = np.clip(p, 0, 255).astype(np.uint8)
        for (lx, ly, rx, ry) in lamps: light_pool(s, lx, ly, rx, ry, '#ffcf80', k=.32)
        return
    if tod == 'day':
        top, low = np.array([70, 128, 204.]), np.array([196, 218, 236.])
        sk = _mix(top, low, t ** 1.4) + (BAYF[..., None] - .5) * 5
        p[sky] = sk[sky]
        for (cx, cy, rx, ry) in [(80, hz * .3, 40, 6), (250, hz * .18, 52, 7), (360, hz * .45, 30, 4)]:
            d = ((XX - cx) / rx) ** 2 + ((YY - cy) / ry) ** 2 + (fbm(XX / 6, YY / 3, int(cx)) - .5) * 1.4
            cm = sky & (d < 1)
            p[cm] = _mix(p[cm], np.array([250, 252, 255.]) - (YY[cm] - cy)[:, None] * 3, .85)
        non = ~E & ~sky
        lum = p[non].mean(-1, keepdims=True)
        p[non] = np.clip((p[non] * .62 + lum * .38) * np.array([1.36, 1.38, 1.40]) + 6, 0, 255)
        g = p[E]; p[E] = _mix(g, np.array([92, 112, 138.]) + (rs.rand(len(g), 1) * 26), .82)   # glass reflecting the day sky
        s.p = np.clip(p, 0, 255).astype(np.uint8); return
    if tod == 'dusk':
        top, mid, low = np.array([30, 28, 64.]), np.array([132, 70, 96.]), np.array([246, 168, 104.])
        sk = np.where(t < .6, _mix(top, mid, t / .6), _mix(mid, low, (t - .6) / .4)) + (BAYF[..., None] - .5) * 4
        p[sky] = sk[sky]
        non = ~E & ~sky
        p[non] = p[non] * np.array([.86, .66, .62]) + np.array([6, 0, 8.])
        p[E] = np.clip(p[E] * 1.1 + 10, 0, 255)
        s.p = np.clip(p, 0, 255).astype(np.uint8)
        for (lx, ly, rx, ry) in lamps: light_pool(s, lx, ly, rx, ry, '#ffcf80', k=.2)

def lift_scene(s, y_base, dy):
    """move everything painted above y_base up by dy rows, so the ground the fighters stand on starts higher
    and they no longer seem to stand on the foot of a wall"""
    s.p[0:y_base - dy] = s.p[dy:y_base].copy(); s.a[0:y_base - dy] = s.a[dy:y_base].copy()

def contact(s, y, k=.45, h=5, mask=None):
    """the darkening where a wall or stall meets the ground (ambient occlusion along a base line)"""
    for i in range(h):
        row = s.p[y + i].astype(float); kk = k * (1 - i / h) ** 1.5
        if mask is not None: kk = kk * mask
        s.p[y + i] = np.clip(row * (1 - (kk if np.isscalar(kk) else kk[:, None])), 0, 255).astype(np.uint8)

def light_pool(s, cx, cy, rx, ry, col, k=.22, mask=None):
    d = np.hypot((XX - cx) / rx, (YY - cy) / ry); lvl = np.floor(np.clip(1 - d, 0, 1) * 5 + BAYF) / 5
    m = lvl > 0
    if mask is not None: m &= mask
    kk = (lvl[m] * k)[:, None]; s.p[m] = np.clip(s.p[m] * (1 - kk) + hx(col) * kk, 0, 255).astype(np.uint8)

def finish_bg(s, cool='#2a3a5a', warm='#ffd8a0', k=.16, grain=.05, seed=1, bloom=235):
    """the last pass on a painted backdrop: a light colour grade (cool shadows, warm lights), fine grain, and a soft halo round the brightest lights"""
    p = s.p.astype(float); lum = p.mean(axis=2, keepdims=True) / 255.0
    p = p * (1 - k) + (np.array(hx(cool)) * (1 - lum) + np.array(hx(warm)) * lum) * k * (p / np.maximum(1, p.mean(axis=2, keepdims=True)) * .5 + .5)
    rs = np.random.RandomState(seed); p *= (1 + (rs.rand(H, W, 1) - .5) * grain * 2)
    br = (s.p.mean(axis=2) > bloom)
    halo = np.zeros((H, W), bool)
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1), (-2, 0), (2, 0), (0, -2), (0, 2)]: halo |= np.roll(np.roll(br, dy, 0), dx, 1)
    halo &= ~br; p[halo] = p[halo] * .7 + 255 * .3 * np.array([1, .96, .86])
    s.p = np.clip(p, 0, 255).astype(np.uint8)

def metro():   # Santiago: a Metro platform. The far wall across the tracks, the track pit, and the near platform the fighters stand on
    s = Pic(); HZ = 80                                   # foot of the far wall
    TILE = P('#6c6a62', '#7e7c72', '#918e84', '#a5a296', '#b8b5a8', '#cac7ba', '#dcd9cc')
    r = np.random.RandomState(31)
    jit = np.zeros((H, W))
    for ty in range(0, HZ, 7):                       # each tile its own faint tone
        for tx in range(-4, W, 11):
            ox = 5 if (ty // 7) % 2 else 0
            jit[ty:ty + 7, max(0, tx + ox):max(0, tx + ox + 11)] = r.rand() * .08
    paint(s, YY < HZ, .30 + YY / HZ * .22 + jit + fbm(XX / 5, YY / 5, 77) * .06, TILE)
    for y in range(0, HZ, 7):
        for x in range(W):
            if BAYF[y, x] < .9: s.p[y, x] = (s.p[y, x] * .78).astype(np.uint8)
    for y in range(HZ):
        ox = 5 if (y // 7) % 2 else 0
        for x in range(ox, W, 11): s.p[y, x] = (s.p[y, x] * .82).astype(np.uint8)
    for ty in range(0, HZ, 7):                       # each tile bevelled: a lit top-left edge, a dark lower-right
        ox = 5 if (ty // 7) % 2 else 0
        for tx in range(ox - 11, W, 11):
            for x in range(max(0, tx + 1), min(W, tx + 10)): s.p[ty + 1, x] = np.minimum(255, s.p[ty + 1, x].astype(int) + 14)
            for y in range(ty + 1, min(HZ, ty + 6)):
                if 0 <= tx + 1 < W: s.p[y, tx + 1] = np.minimum(255, s.p[y, tx + 1].astype(int) + 10)
                if 0 <= tx + 10 < W: s.p[y, tx + 10] = (s.p[y, tx + 10] * .9).astype(np.uint8)
    grime = (YY > 58) & (YY < HZ)
    k_ = ((YY - 58) / 22.0) ** 1.6 * .5 * (1 + fbm(XX / 6, YY / 2, 55) - .5)
    s.p[grime] = (s.p[grime] * (1 - k_[grime, None]) + hx('#3a3228') * k_[grime, None]).astype(np.uint8)
    for x in range(4, W, 37):                        # streaks where water has run down the tiles
        for y in range(48, HZ):
            if (x * 3 + y) % 5 and s.p[y, x].mean() > 60: s.p[y, x] = (s.p[y, x] * .9).astype(np.uint8)
    paint(s, YY < 11, .08 + YY / 11 * .2, P('#16171b', '#202228', '#2c2e36', '#3a3c46'))       # ceiling beam
    for x in range(W):                               # a conduit and cable tray under the beam
        s.px(x, 8, '#4a4e56'); s.px(x, 9, '#2a2c32'); s.px(x, 10, '#16171b') if x % 40 else None
        if x % 40 == 0:
            for y in range(6, 11): s.px(x, y, '#6a6e76')
    for y in range(47, 54):                          # the line colour, a red band
        for x in range(W): s.p[y, x] = hx('#b83a34') if y < 52 else hx('#7a2420')
    for x in range(W): s.p[47, x] = hx('#e06a5c')
    for (x0, x1, poster) in [(132, 268, None), (296, 344, 'cordillera'), (92, 124, 'trariwe')]:
        if poster is None:                               # the station-name panel, blank until the player names it
            for y in range(18, 40):
                for x in range(x0, x1): s.px(x, y, '#e6e8ec' if not (20 <= y < 38 and x0 + 2 <= x < x1 - 2) else ('#1e3c78' if y < 34 else '#16305e'))
            for x in range(x0 + 2, x1 - 2): s.px(x, 20, '#3a5a9a')
            for x in range(x0 + 1, x1 + 1): s.px(x, 40, '#4a4a44')            # its shadow on the tiles
        elif poster == 'trariwe':                        # a poster of a woven trariwe pattern
            for y in range(16, 44):
                for x in range(x0, x1):
                    edge = y in (16, 43) or x in (x0, x1 - 1)
                    band = ((y - 16) // 6) % 3; step = abs(((x - x0) % 10) - 5) < ((y - 16) % 6)
                    col = '#2a2a30' if edge else ['#b02a28', '#1c1414', '#e8e0cc'][band] if step else ['#e8e0cc', '#b02a28', '#1c1414'][band]
                    s.px(x, y, col)
        else:                                            # a framed poster: the cordillera at dawn
            for y in range(14, 44):
                for x in range(x0, x1):
                    edge = y in (14, 43) or x in (x0, x1 - 1)
                    col = '#2a2a30' if edge else ('#f0b070' if y < 23 else '#d07a5a' if y < 30 else '#5a4a6a')
                    if not edge and y >= 25 and abs(x - (x0 + 20)) < (y - 23) * 1.4: col = '#3a3450' if y > 29 else '#f4f0f0'
                    s.px(x, y, col)
    m = (((XX - 46) / 30.0) ** 2 + ((YY - HZ) / 60.0) ** 2 < 1) & (YY < HZ + 18)   # tunnel mouth: depth in rings
    d = np.sqrt(((XX - 46) / 30.0) ** 2 + ((YY - HZ) / 60.0) ** 2)
    paint(s, m, .02 + d * .32, P('#040508', '#090b10', '#10131a', '#181c24', '#22262f', '#2e333d'))
    for x in range(98, 116):                             # a green exit sign glowing on the wall
        for y in range(58, 65): s.px(x, y, '#1e8a4a' if 59 <= y <= 63 and 99 <= x <= 114 else '#e8ece8')
    for x in range(101, 112, 2): s.px(x, 61, '#d8f8e0')
    light_pool(s, 107, 61, 18, 9, '#60e090', k=.18, mask=YY < HZ)
    for (cx_, cy_) in [(280, 64)]:                       # a station clock
        for y in range(cy_ - 7, cy_ + 8):
            for x in range(cx_ - 7, cx_ + 8):
                d_ = math.hypot(x - cx_, y - cy_)
                if d_ <= 7: s.px(x, y, '#2a2c32' if d_ > 6 else '#f4f4ee')
        for t in range(5): s.px(cx_, cy_ - t, '#1a1a1e'); s.px(cx_ + t // 2, cy_ + t // 3, '#1a1a1e')
        for a_ in range(12): s.px(cx_ + int(round(math.cos(a_ * math.pi / 6) * 5)), cy_ + int(round(math.sin(a_ * math.pi / 6) * 5)), '#5a5a60')
    for (lx, ly) in [(38, 70), (54, 70)]:                # a train's lights far down the tunnel
        for dy in range(3):
            for dx in range(3): s.px(lx + dx, ly + dy, '#fffbe0' if dx == 1 or dy == 1 else '#c8a860')
        light_pool(s, lx + 1, ly + 1, 14, 8, '#ffe8a0', k=.35, mask=m)
    for k, x in enumerate(range(70, W, 64)):              # fluorescent tubes and the light they throw on the tiles
        for i2 in range(34):
            s.px(x + i2, 12, '#ffffff'); s.px(x + i2, 13, '#d8ecf4'); s.px(x + i2, 11, '#5a5e68')
        light_pool(s, x + 17, 18, 48, 38, '#f4fbff', k=.20, mask=(YY < HZ) & (YY > 13))
    PIT = HZ + 18                                         # the track pit: ballast, sleepers, rails
    pit = (YY >= HZ) & (YY < PIT) & ~m
    paint(s, pit, .06 + (YY - HZ) / 18 * .2 + fbm(XX / 1.6, YY / 1.4, 90) * .22, P('#0c0c0e', '#16161a', '#202026', '#2c2c32', '#3a3a40', '#48484e'))
    for x in range(3, W, 12):
        for y in range(HZ + 4, PIT - 1):
            if not m[y, x] and y not in (HZ + 6, HZ + 13): s.px(x, y, '#2e2418'); s.px(x + 1, y, '#3e3020'); s.px(x + 2, y, '#241c12')
    for ry in (HZ + 6, HZ + 13):
        for x in range(W):
            if not m[ry, x]: s.px(x, ry - 1, '#d2d6dc'); s.px(x, ry, '#8a9098'); s.px(x, ry + 1, '#3e4248')
    for x in range(W):                                    # the far side of the pit: a dark wall under the platform lip
        for y in range(HZ, HZ + 3):
            if not m[y, x]: s.p[y, x] = (s.p[y, x] * .5).astype(np.uint8)
    LIP = PIT                                             # the near platform: concrete lip, tactile strip and yellow line
    for x in range(W):
        s.px(x, LIP, '#0e0e12'); s.px(x, LIP + 1, '#c2c4c8'); s.px(x, LIP + 2, '#9a9ca2')
        for y in (LIP + 3, LIP + 4, LIP + 5): s.px(x, y, '#e8bc1c' if y < LIP + 5 else '#a68410')
        for y in range(LIP + 6, LIP + 10): s.px(x, y, '#8c8a80' if (x + y) % 3 else '#a8a698')
    FLOOR = P('#2c2c32', '#38383f', '#45454d', '#53535c', '#63636c', '#75757e', '#8a8a92')
    F0 = LIP + 10
    ground(s, F0, FLOOR, base=.32, pool=.6, cy=140, spread=34, tex=.08)
    yy, k = F0 + 4, 0                                     # granite tile joints, in perspective
    while yy < H:
        for x in range(W): s.p[int(yy), x] = (s.p[int(yy), x] * .8).astype(np.uint8)
        yy += 4 + k * 3; k += 1
    for x0 in range(-300, W + 300, 34):
        for y in range(F0, H):
            x = int(W / 2 + (x0 - W / 2) * (1 + (y - F0) / 40))
            if 0 <= x < W: s.p[y, x] = (s.p[y, x] * .84).astype(np.uint8)
    for y in range(F0, H):                                # a wet sheen: the wall and the line repeated faintly upside down
        src = 2 * LIP - y - 18
        if 0 <= src < HZ:
            row = (s.p[src].astype(int) + np.roll(s.p[src], 1, 0) + np.roll(s.p[src], -1, 0)) // 3; k_ = .08 * (1 - (y - F0) / (H - F0))
            s.p[y] = (s.p[y] * (1 - k_) + row * k_).astype(np.uint8)
    for k, x in enumerate(range(70, W, 64)):              # the tubes reflected softly in the polished floor
        light_pool(s, x + 17, F0 + 12, 26, 6, '#c8ccd6', k=.22, mask=YY > F0)
    for (cx, wdt) in ((338, 22),):                        # a round pillar standing on the near platform
        for y in range(0, 206):
            for x in range(cx, cx + wdt):
                t = (x - cx) / (wdt - 1); v = .15 + .75 * math.sin(math.pi * (t * .8 + .1)) ** 2 * (1 - t * .5)
                s.px(x, y, s.ramp_at(x, y, P('#2c2e34', '#3e4048', '#52545c', '#686a72', '#80828a', '#9a9ca2'), v))
        light_pool(s, cx + 11, 207, 28, 6, '#000000', k=.55)
    for (bx, by) in [(40, 200)]:                          # a steel bench in the foreground
        for x in range(bx - 30, bx + 30):
            for y in range(by - 4, by):
                s.px(x, y, '#9aa0a8' if y == by - 4 else '#6a7078' if y < by - 1 else '#3a3e46')
        for lx in (bx - 24, bx + 22):
            for y in range(by, by + 14): s.px(lx, y, '#2a2c32'); s.px(lx + 1, y, '#4a4e56')
        light_pool(s, bx, by + 15, 34, 4, '#000000', k=.5)
    r2 = np.random.RandomState(9)
    for _ in range(40):                                   # a few dropped tickets and gum spots on the granite
        x, y = r2.randint(0, W), r2.randint(F0 + 6, H - 3)
        if r2.rand() < .5: s.px(x, y, '#2a2a2e'); s.px(x + 1, y, '#2a2a2e')
        else: s.px(x, y, '#d8d4c4'); s.px(x + 1, y, '#b8b4a4')
    vignette(s, .45)
    finish_bg(s, cool='#24344c', warm='#fff0d0', k=.14, grain=.045, seed=11)
    return s, {'hz': HZ, 'colors': 200}

def feria(tod=None):   # Santiago: the street market under striped tarps, late afternoon
    s = Pic(); HZ = 96
    sky(s, HZ, P('#4a78b8', '#5a8cc8', '#6ea0d4', '#86b4de', '#a2c6e6', '#c2daee', '#e2ecf4'), sun=(330, 40, 90), warm='#ffe0a8'); sky_ref = s.p.copy(); s.a[:] = False
    clouds(s, [(90, 30, 70, 10, 3), (250, 20, 60, 8, 4)], CLOUD, HZ)
    r = np.random.RandomState(8); x = -6
    FAC = [P('#7a5a4a', '#94705c', '#ae8870', '#c6a084', '#dab898'), P('#5a6a7a', '#6e8090', '#8498a8', '#9cb0be', '#b8c8d4'), P('#7a6a4a', '#94845c', '#ae9c70', '#c6b484', '#dacb9c')]
    while x < W:                                       # low houses and shops behind the market
        bw = r.randint(40, 70); bh = r.randint(28, 46); ramp = FAC[r.randint(0, 3)]
        m = (XX >= x) & (XX < x + bw) & (YY >= HZ - bh) & (YY < HZ + 6)
        paint(s, m, .35 + (XX - x) / bw * .3, ramp)
        for wy in range(HZ - bh + 6, HZ - 2, 12):
            for wx in range(x + 5, x + bw - 8, 12):
                for dy in range(7):
                    for dx in range(6): s.px(wx + dx, wy + dy, '#2a3442' if dy < 6 else '#8a7a6a')
                s.px(wx + 1, wy + 1, '#7a92aa')
        x += bw + r.randint(0, 4)
    paint(s, (YY >= HZ) & (YY < 132), .25 + fbm(XX / 4, YY / 3, 41) * .25 + (YY - HZ) / 40 * .1, P('#2a201a', '#3a2c22', '#4c3a2c', '#5e4a38', '#725c46'))   # the shaded stalls behind
    for x in range(0, W, 9):
        for y in range(HZ + 4, 112):
            if (x // 9) % 3 == 0: s.px(x, y, '#6a5440') if y % 4 else None                 # sacks and boxes stacked in the back
    TARPS = [('#c83a30', '#f2ece0'), ('#2e64b0', '#eef2f6'), ('#3a9a58', '#eef4ec'), ('#e0a030', '#fff4dc'), ('#c83a30', '#f2ece0')]
    for k, (cx, w0) in enumerate([(40, 90), (128, 86), (212, 92), (300, 88), (384, 80)]):   # striped tarps sagging between poles
        c1, c2 = TARPS[k]
        for x in range(cx - w0 // 2, cx + w0 // 2):
            if not 0 <= x < W: continue
            t = (x - (cx - w0 // 2)) / w0; sag = int(math.sin(math.pi * t) * 6)
            for y in range(70 + sag, 86 + sag):
                col = hx(c1) if ((x - cx) // 6) % 2 == 0 else hx(c2)
                sh = (.62 + .38 * (1 - (y - 70 - sag) / 16)) * (.86 + .14 * math.sin((x - cx) / 3.2))
                s.p[y, x] = (np.array(col) * sh).astype(np.uint8); s.a[y, x] = True
            for y in range(86 + sag, 89 + sag): s.p[y, x] = (np.array(hx(c1)) * .45).astype(np.uint8)      # scalloped hem shadow
            sc_ = 89 + sag + int(abs(math.sin((x - cx) / 3.0 * math.pi / 2)) * 3)
            for y in range(89 + sag, sc_): s.p[y, x] = (np.array(hx(c1)) * .75).astype(np.uint8)          # the scalloped fringe
        for px_ in (cx - w0 // 2 + 2, cx + w0 // 2 - 2):
            for y in range(66, 132): s.px(px_, y, '#3a3a40'); s.px(px_ + 1, y, '#5a5a62')
    for y in range(89, 132): s.p[y] = (s.p[y] * .86).astype(np.uint8)                   # shade under the tarps
    for x in range(W):                                    # a string of bulbs looping across the market
        y = 64 + int(abs(math.sin(x / 44.0 * math.pi)) * 7); s.px(x, y, '#2a2420')
        if x % 22 == 11:
            for (dx, dy, cc) in [(0, 1, '#fff6c8'), (1, 1, '#ffe090'), (0, 2, '#ffd070'), (1, 2, '#e0a040')]: s.px(x + dx, y + dy, cc)
            light_pool(s, x, y + 3, 9, 6, '#ffe0a0', k=.25)
    for k, cx in enumerate([40, 128, 212, 300, 384]):    # the vendors behind their tables
        vx = cx + (10 if k % 2 else -12); col = [P('#5a2a2a', '#7a3a34', '#9a5040', '#b86a54'), P('#2a3a5a', '#3a4e74', '#506a92', '#6a86ac'), P('#2a4a2a', '#3a623a', '#50804e', '#6a9a62')][k % 3]
        m_ = ((XX - vx) / 9.0) ** 2 + ((YY - 110) / 16.0) ** 2 < 1
        paint(s, m_ & (YY < 114), .3 + (XX - vx) / 30 + .2, col)
        hm = ((XX - vx) / 5.0) ** 2 + ((YY - 90) / 5.5) ** 2 < 1
        paint(s, hm, .45 + (XX - vx) / 14, P('#3a2418', '#5a3a28', '#7a5038', '#9a6a4c', '#b8846a'))
        for x in range(vx - 6, vx + 7): s.px(x, 85, '#1a1210'); s.px(x, 86, '#2a1a14') if abs(x - vx) < 5 else None
    for k, cx in enumerate([40, 128, 212, 300, 384]):    # tables of produce
        for y in range(112, 126):
            for x in range(cx - 34, cx + 34):
                if 0 <= x < W: s.px(x, y, '#6a4628' if y > 113 else '#8a5e36')
        for j, (col, hi) in enumerate([('#c22a1e', '#ff7a5a'), ('#e8c020', '#fff08a'), ('#2e5a24', '#6aa04a'), ('#e0701e', '#ffb060'), ('#6a2a5a', '#b06aa0')]):
            bx = cx - 30 + j * 13
            if not 0 <= bx < W - 12: continue
            pc = (k + j) % 5; c0, ch = [('#c22a1e', '#ff7a5a'), ('#e8c020', '#fff08a'), ('#2e5a24', '#6aa04a'), ('#e0701e', '#ffb060'), ('#6a2a5a', '#b06aa0')][pc]
            dk = tuple(int(v * .5) for v in hx(c0))
            for row, n_ in enumerate((4, 3, 2, 1)):           # a heap: each fruit lit on its upper left, shadowed below
                for q in range(n_):
                    fx_, fy_ = bx + 1 + row * 1.5 + q * 3, 110 - row * 2.4
                    for (a, b) in [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1), (1, -1)]: s.px(int(fx_) + a, int(fy_) + b, c0)
                    s.px(int(fx_), int(fy_) - 1 + 1, ch); s.px(int(fx_) + 2, int(fy_) + 1, dk)
            for y in range(102, 107):                     # a price card
                for x in range(bx + 2, bx + 9): s.px(x, y, '#f4f0e4' if y > 102 else '#2a2a2a')
    lift_scene(s, 132, 24)                               # the market sits further back; the street in front is where the fight is
    sky_ref[0:132 - 24] = sky_ref[24:132].copy(); HZ -= 24
    G0 = 108
    ground(s, G0, P('#34302e', '#423d3a', '#524c48', '#645d58', '#766e68', '#8a827a', '#9e958c'), base=.34, pool=.55, cy=150, spread=40, tex=.16)
    contact(s, G0, k=.55, h=7)
    for k in range(9):                                   # the asphalt patched and cracked, seams in perspective
        y = int(G0 + 4 + k * k * 1.6 + k * 3)
        if y < H:
            for x in range(W):
                if (x * 7 + k * 13) % 23 < 15: s.p[y, x] = (s.p[y, x] * .86).astype(np.uint8)
    for x0 in range(-300, W + 300, 70):
        for y in range(G0, H):
            x = int(W / 2 + (x0 - W / 2) * (1 + (y - G0) / 26))
            if 0 <= x < W and (y // 3) % 4: s.p[y, x] = (s.p[y, x] * .9).astype(np.uint8)
    for k in range(5):                                   # crushed boxes and a hose near the stalls
        bx = 30 + k * 84
        for y in range(G0 + 2, G0 + 7):
            for x in range(bx, bx + 12): s.px(x, y, '#8a6a40' if y == G0 + 2 else '#6a4e2c' if y < G0 + 6 else '#2a2018')
    for k in range(40):                                 # leaves and dropped fruit on the asphalt
        x, y = r.randint(0, W), r.randint(G0 + 4, H - 4); col = ['#3a7a2a', '#c23a24', '#d8b030', '#7a5a3a'][k % 4]
        s.px(x, y, col); s.px(x + 1, y, col)
    for (cx, cy) in [(26, 200), (372, 196)]:              # crates framing the front
        for y in range(cy - 22, cy + 2):
            for x in range(cx - 16, cx + 16):
                if 0 <= x < W: s.px(x, y, '#8a6438' if (y - cy) % 6 else '#5a3e20')
        for x in range(cx - 16, cx + 16):
            for y in range(cy - 26, cy - 22):
                if 0 <= x < W: s.px(x, y, ['#c22a1e', '#e8c020', '#3a7a2a'][(x // 3) % 3] if y > cy - 26 else '#2a1a10')
    def crate(cx, cy, w=16, h=11, fruit=None):
        for y in range(cy - h, cy):
            for x in range(cx - w // 2, cx + w // 2):
                s.px(x, y, '#9a7244' if y == cy - h else '#7a5630' if (y - cy) % 4 else '#4a3218')
        for y in range(cy - h, cy): s.px(cx - w // 2, y, '#5a3e20'); s.px(cx + w // 2 - 1, y, '#3a2614')
        if fruit:
            for x in range(cx - w // 2 + 1, cx + w // 2 - 1):
                s.px(x, cy - h - 1, fruit[x % 2]); s.px(x, cy - h - 2, fruit[0]) if x % 3 else None
        light_pool(s, cx + 2, cy, w * .7, 2, '#000000', k=.5)
    crate(20, 122, fruit=('#c22a1e', '#ff7a5a')); crate(36, 122, fruit=('#e8c020', '#fff08a')); crate(28, 111, fruit=('#3a7a2a', '#6aa04a'))
    crate(360, 120, fruit=('#e0701e', '#ffb060')); crate(376, 120)
    for (sx_, sy_) in [(112, 120), (122, 121), (117, 114)]:           # sacks of potatoes
        for y in range(sy_ - 9, sy_):
            for x in range(sx_ - 5, sx_ + 6):
                if ((x - sx_) / 5.5) ** 2 + ((y - sy_ + 4.5) / 4.8) ** 2 < 1: s.px(x, y, '#b89a6a' if x < sx_ else '#8a7048')
        s.px(sx_ - 1, sy_ - 9, '#5a4428'); s.px(sx_, sy_ - 9, '#5a4428')
        light_pool(s, sx_ + 1, sy_, 7, 2, '#000000', k=.45)
    for (cx, cy) in [(250, 118)]:                         # a vendor's tricycle cart, the box painted blue
        for y in range(cy - 14, cy - 4):
            for x in range(cx - 14, cx + 6): s.px(x, y, '#2e5ab0' if y > cy - 13 else '#e8e0cc')
        for x in range(cx - 14, cx + 6): s.px(x, cy - 4, '#1a2a50')
        for (wx_, r_) in [(cx - 10, 4), (cx + 2, 4), (cx + 14, 4)]:
            for a_ in range(16): s.px(wx_ + int(round(math.cos(a_ * .39) * r_)), cy + int(round(math.sin(a_ * .39) * r_)), '#1a1a1e')
            s.px(wx_, cy, '#8a8a90')
        for y in range(cy - 10, cy): s.px(cx + 12, y, '#3a3a40')
        for x in range(cx + 6, cx + 14): s.px(x, cy - 2, '#3a3a40')
        for x in range(cx + 10, cx + 16): s.px(x, cy - 11, '#1a1a1e')
        light_pool(s, cx, cy + 4, 22, 3, '#000000', k=.45)
    for (dx_, dy_) in [(196, 126)]:                       # a street dog asleep in the sun
        for y in range(dy_ - 5, dy_):
            for x in range(dx_ - 9, dx_ + 7):
                if ((x - dx_) / 8.5) ** 2 + ((y - dy_ + 2.5) / 3) ** 2 < 1: s.px(x, y, '#c8a070' if y < dy_ - 3 else '#9a7448')
        for (x, y, c_) in [(dx_ + 7, dy_ - 4, '#c8a070'), (dx_ + 8, dy_ - 4, '#c8a070'), (dx_ + 9, dy_ - 3, '#9a7448'), (dx_ + 8, dy_ - 5, '#6a4a2a'), (dx_ + 9, dy_ - 2, '#2a1a10'), (dx_ - 10, dy_ - 2, '#9a7448'), (dx_ - 11, dy_ - 1, '#9a7448')]: s.px(x, y, c_)
        light_pool(s, dx_, dy_, 10, 2, '#000000', k=.45)
    for (chx, chy) in [(150, 116), (330, 128)]:            # red plastic chairs
        for y in range(chy - 12, chy):
            s.px(chx, y, '#b8282a'); s.px(chx + 7, y, '#8a1c1e') if y > chy - 6 else None
        for x in range(chx, chx + 8): s.px(x, chy - 6, '#d83a34'); s.px(x, chy - 5, '#8a1c1e')
        for y in range(chy - 6, chy): s.px(chx + 1, y, '#b8282a') if y > chy - 2 else None
        light_pool(s, chx + 4, chy, 6, 2, '#000000', k=.4)
    for (mx, my) in [(300, 150)]:                         # a manhole cover
        for y in range(my - 4, my + 5):
            for x in range(mx - 11, mx + 12):
                if ((x - mx) / 11) ** 2 + ((y - my) / 4) ** 2 < 1: s.px(x, y, '#3a3634' if (x + y) % 3 else '#4a4542')
    for (ox_, oy_, orx, ory) in [(80, 140, 18, 3), (230, 176, 24, 4)]:
        m_ = ((XX - ox_) / orx) ** 2 + ((YY - oy_) / ory) ** 2 < 1; s.p[m_] = (s.p[m_] * .8).astype(np.uint8)
    for k in range(60):                                   # cabbage leaves and onion skins
        x, y = (k * 97) % W, G0 + 8 + (k * 53) % (H - G0 - 10)
        c_ = ['#6aa04a', '#3a7a2a', '#d8c8a0', '#a04a30'][k % 4]
        s.px(x, y, c_); s.px(x + 1, y, c_); s.px(x + 1, y + 1, '#2a2420')
    light_pool(s, 210, 140, 170, 40, '#ffe8b8', k=.12)
    for (sx_, w_) in [(60, 26), (230, 34)]:              # dusty shafts of sun slanting between the tarps
        m_ = (YY > 64) & (YY < 200) & (abs(XX - sx_ - (YY - 64) * .45) < w_ / 2)
        lvl = np.floor((1 - abs(XX - sx_ - (YY - 64) * .45) / (w_ / 2)) * 3 + BAYF) / 3
        kk = (np.clip(lvl, 0, 1) * .10)[m_][:, None]; s.p[m_] = np.clip(s.p[m_] * (1 - kk) + hx('#fff2c8') * kk, 0, 255).astype(np.uint8)
    retime(s, tod, 'day', sky_ref, ['#fff6c8', '#ffe090', '#ffd070', '#e0a040'], HZ, lamps=[(x, 46 + int(abs(math.sin(x / 44.0 * math.pi)) * 7), 12, 8) for x in range(11, W, 22)], seed=12)
    vignette(s, .35)
    finish_bg(s, cool='#2a3450', warm='#ffe2a8' if tod != 'night' else '#b8c4e8', k=.14, grain=.04, seed=12)
    return s, {'hz': HZ, 'colors': 200}

def blocks(tod=None):   # Santiago: the apartment blocks at dusk, the cordillera behind, washing on the lines
    s = Pic(); HZ = 104
    sky(s, HZ, P('#1c1834', '#2a1e44', '#3e2650', '#5c3054', '#84405a', '#b45a5a', '#e08a5a', '#f6b86c'), sun=(200, 108, 120), warm='#ffc070'); sky_ref = s.p.copy(); s.a[:] = False
    def ridge2(x): return 86 - 18 * math.exp(-((x - 120) / 70.0) ** 2) - 24 * math.exp(-((x - 290) / 60.0) ** 2) + 3 * math.sin(x / 9.0) + 2 * math.sin(x / 4.1)
    for x in range(W):                                  # the Andes, snow catching the last light
        top = int(ridge2(x))
        for y in range(top, HZ):
            t = (y - top) / max(1, HZ - top)
            col = '#f4c8b0' if y - top < 4 and top < 70 else ('#5a3a5a' if t < .4 else '#3e2a48')
            if y - top < 4 and top < 70 and BAYF[y, x] > .7: col = '#c08a8a'
            s.px(x, y, col)
    r2 = np.random.RandomState(12); x = 100
    while x < 290:                                       # far blocks between the two near ones
        bw = r2.randint(30, 50); bh = r2.randint(20, 40)
        m = (XX >= x) & (XX < x + bw) & (YY >= HZ + 8 - bh) & (YY < 152)
        paint(s, m, .2 + (XX - x) / bw * .2, P('#1c1828', '#26203a', '#30284a', '#3a3258'))
        for wy in range(HZ + 12 - bh, 146, 8):
            for wx in range(x + 3, x + bw - 4, 7):
                if r2.rand() < .3: s.px(wx, wy, '#f0c878'); s.px(wx + 1, wy, '#f0c878')
        x += bw + r2.randint(0, 3)
    paint(s, (YY >= HZ) & (YY < 152) & ~s.a, .2 + (YY - HZ) / 48 * .3, P('#1c1828', '#241e32', '#2c243a', '#342a40'))
    BLK = [P('#3a2a2a', '#5a3e3a', '#7a564c', '#9a7060', '#b88a74', '#d0a488'), P('#2e2e3a', '#46465a', '#5e5e76', '#787892', '#9494ac', '#b0b0c4')]
    for k, (x0, w0, h0) in enumerate([(-10, 130, 84), (270, 140, 92)]):     # two blocks, four floors each
        ramp = BLK[k]; top = 150 - h0
        m = (XX >= x0) & (XX < x0 + w0) & (YY >= top) & (YY < 150)
        paint(s, m, .3 + ((XX - x0) / w0) * (.35 if k else -.15) + .25 * (k == 0) + fbm(XX / 3, YY / 3, 11 + k) * .08, ramp)
        for fl in range(4):
            fy = top + 6 + fl * (h0 // 4)
            for wx in range(x0 + 8, x0 + w0 - 12, 22):
                lit = r_ = (fl * 7 + wx) % 5 < 2
                for dy in range(10):
                    for dx in range(12): s.px(wx + dx, fy + dy, ('#f8d27a' if dy < 9 else '#a07a3a') if lit else ('#1e2030' if dy < 9 else '#4a4a5a'))
                if lit: light_pool(s, wx + 6, fy + 14, 12, 5, '#ffd27a', k=.25)
                for dx in range(-2, 16): s.px(wx + dx, fy + 11, '#2a2a30'); s.px(wx + dx, fy + 13, '#2a2a30') if dx % 3 == 0 else None   # balcony rail
            for x in range(x0, x0 + w0):
                s.px(x, fy + 15, '#2a2028')
                if 0 <= x < W:
                    for dy in (16, 17): s.p[min(H - 1, fy + dy), x] = (s.p[min(H - 1, fy + dy), x] * .72).astype(np.uint8)   # the balcony's shadow
            for wx in range(x0 + 8, x0 + w0 - 12, 44):     # potted plants and a dish here and there
                for (dx, dy, cc) in [(2, -3, '#3a7a3a'), (3, -4, '#5a9a4a'), (4, -3, '#3a7a3a'), (3, -2, '#2a5a2a'), (2, 0, '#8a4a2a'), (3, 0, '#8a4a2a'), (4, 0, '#6a3a1e')]: s.px(wx + dx, fy + 10 + dy, cc)
                if (wx + fl) % 3 == 0:
                    for a_ in range(8): s.px(wx + 16 + int(math.cos(a_ * .5) * 3), fy + 4 + int(math.sin(a_ * .5) * 3), '#c8ccd4')
    for (x0, x1) in [(-10, 120), (270, 410)]:              # a mural of stepped ñimin along the base of each block
        for x in range(max(0, x0), min(W, x1)):
            for y in range(136, 149):
                u = (x - x0) % 16; v = y - 136; stp = abs(u - 8) <= (v if v < 7 else 12 - v)
                band = ((x - x0) // 16) % 3
                s.px(x, y, ['#b02a28', '#1c1414', '#e8e0cc'][band] if stp else ['#e8e0cc', '#b02a28', '#1c1414'][band])
        for dx_ in (40, 96) if x0 < 0 else (36, 100):          # doorways
            for y in range(122, 150):
                for x in range(x0 + dx_, x0 + dx_ + 12): s.px(x, y, '#2a1e1a' if y > 124 else '#4a3a30')
            light_pool(s, x0 + dx_ + 6, 120, 8, 4, '#ffd890', k=.4)
    for (wx_, wy_) in [(30, 66), (318, 80), (362, 112), (74, 112)]:   # someone at a lit window
        for (dx, dy) in [(5, 2), (6, 2), (4, 3), (5, 3), (6, 3), (7, 3), (5, 4), (6, 4), (3, 5), (4, 5), (5, 5), (6, 5), (7, 5), (8, 5), (3, 6), (4, 6), (5, 6), (6, 6), (7, 6), (8, 6)]:
            s.px(wx_ + dx, wy_ + dy, '#3a2a20')
    for (y0, x0, x1) in [(82, 120, 270), (100, 120, 270)]:  # washing lines strung between the blocks
        for x in range(x0, x1):
            y = y0 + int(math.sin(math.pi * (x - x0) / (x1 - x0)) * 6); s.px(x, y, '#1a1418')
            if (x - x0) % 14 == 3:
                col = ['#d83a3a', '#3a7ad8', '#f0f0e8', '#e8c030', '#3aa05a'][(x // 14) % 5]
                for dy in range(1, 9 + (x % 3) * 2):
                    for dx in range(6): s.px(x + dx, y + dy, col if dx < 5 else '#2a2028')
    lift_scene(s, 150, 42)                               # the blocks stand back across the courtyard
    sky_ref[0:150 - 42] = sky_ref[42:150].copy()
    G0 = 108; HZ2 = HZ - 42
    ground(s, G0, P('#241e16', '#30281c', '#3e3424', '#4e422e', '#60523a', '#746446', '#887654'), base=.3, pool=.55, cy=148, spread=42, tex=.24)
    contact(s, G0, k=.6, h=8)
    for (x0, x1) in [(0, 120), (270, W)]:                  # a concrete apron along the foot of each block
        for y in range(G0, G0 + 6):
            for x in range(x0, x1): s.p[y, x] = (s.p[y, x] * .5 + np.array(hx('#6a6460' if y > G0 else '#2a2624')) * .5).astype(np.uint8)
    for k in range(7):                                   # a worn dirt path crossing the courtyard toward the viewer
        y0_ = G0 + 6 + k * 16
        w_ = 18 + k * 9; cx_ = 200 + k * 6
        m_ = (YY >= y0_) & (YY < y0_ + 16) & (abs(XX - cx_ - (YY - y0_) * .4) < w_)
        s.p[m_] = np.clip(s.p[m_] * 1.12 + 6, 0, 255).astype(np.uint8)
    for (px_, py_, pw, ph) in [(150, 134, 34, 4), (262, 160, 50, 6), (56, 190, 32, 5)]:   # puddles holding the dusk sky
        pm = ((XX - px_) / pw) ** 2 + ((YY - py_) / ph) ** 2 < 1
        src = np.clip((YY - (py_ - ph)) * 2, 0, 14).astype(int)
        s.p[pm] = (s.p[pm] * .35 + s.p[src[pm], XX[pm].astype(int)] * .65).astype(np.uint8)
        for x in range(int(px_ - pw * .7), int(px_ + pw * .7), 3): s.px(x, py_ - ph + 1, '#f0b890')
    for (gx, gw) in [(128, 34)]:                          # a battered goal for the neighbourhood pichanga
        for y in range(G0 - 14, G0 + 3): s.px(gx, y, '#d8d8d0'); s.px(gx + 1, y, '#8a8a84'); s.px(gx + gw, y, '#d8d8d0'); s.px(gx + gw + 1, y, '#8a8a84')
        for x in range(gx, gx + gw + 2): s.px(x, G0 - 14, '#d8d8d0'); s.px(x, G0 - 13, '#8a8a84')
        for x in range(gx + 2, gx + gw, 3):
            for y in range(G0 - 12, G0 + 2, 3): s.px(x, y, '#6a6a68')
        light_pool(s, gx + gw // 2, G0 + 3, gw * .6, 2, '#000000', k=.4)
    for (bx, by) in [(330, 170)]:                          # a concrete bench, chipped at the corners
        for y in range(by - 8, by):
            for x in range(bx - 22, bx + 22): s.px(x, y, '#a49c90' if y == by - 8 else '#7a7268' if y < by - 5 else '#4a443e')
        for lx in (bx - 18, bx + 12):
            for y in range(by, by + 8):
                for x in range(lx, lx + 6): s.px(x, y, '#5a544c' if x < lx + 4 else '#3a3630')
        light_pool(s, bx, by + 9, 30, 4, '#000000', k=.5)
    for k in range(9):                                    # half-buried tyres painted white and red, edging a little garden
        tx_ = 268 + k * 7; ty_ = G0 + 18
        for a_ in range(14):
            x = tx_ + int(round(math.cos(a_ * .45) * 3)); y = ty_ - abs(int(round(math.sin(a_ * .45) * 4)))
            s.px(x, y, '#e8e4dc' if k % 2 else '#c83a30'); s.px(x, y + 1, '#2a2622')
        light_pool(s, tx_, ty_ + 1, 4, 1, '#000000', k=.4)
    for k in range(6): s.px(270 + k * 10, G0 + 12, '#3a7a2a'); s.px(271 + k * 10, G0 + 11, '#5a9a4a'); s.px(272 + k * 10, G0 + 12, '#3a7a2a')
    for (gx_, gy_) in [(52, G0 + 6), (60, G0 + 6), (82, G0 + 6)]:   # gas cylinders by the doorway
        for y in range(gy_ - 12, gy_):
            for x in range(gx_ - 3, gx_ + 4): s.px(x, y, ['#c8b030', '#e8d04a', '#a08a20', '#6a5a14'][min(3, abs(x - gx_ + 1))] if y > gy_ - 10 else '#4a4a50')
        light_pool(s, gx_, gy_, 5, 1.5, '#000000', k=.5)
    for (cx_, cy_) in [(178, G0 + 20)]:                    # a shopping cart someone left behind
        for y in range(cy_ - 10, cy_ - 2):
            for x in range(cx_ - 8, cx_ + 8):
                if (x + y) % 3 == 0 or y in (cy_ - 10, cy_ - 3) or x in (cx_ - 8, cx_ + 7): s.px(x, y, '#9aa0a8')
        for x in range(cx_ + 7, cx_ + 12): s.px(x, cy_ - 11, '#5a5e66')
        for wx_ in (cx_ - 6, cx_ + 5): s.px(wx_, cy_, '#1a1a1e'); s.px(wx_, cy_ - 1, '#5a5e66')
        light_pool(s, cx_, cy_ + 1, 10, 2, '#000000', k=.45)
    for (dx_, dy_) in [(108, G0 + 30)]:                    # a quiltro curled up asleep
        for y in range(dy_ - 5, dy_):
            for x in range(dx_ - 7, dx_ + 7):
                if ((x - dx_) / 7) ** 2 + ((y - dy_ + 2.5) / 3) ** 2 < 1: s.px(x, y, '#2a2420' if y < dy_ - 3 else '#1a1410')
        s.px(dx_ - 6, dy_ - 5, '#2a2420'); s.px(dx_ - 5, dy_ - 6, '#2a2420')
        light_pool(s, dx_, dy_, 9, 2, '#000000', k=.45)
    for (bx_, by_) in [(30, G0 + 40)]:                     # a child's bike lying on its side
        for a_ in range(14):
            for (wx_) in (bx_ - 7, bx_ + 7): s.px(wx_ + int(round(math.cos(a_ * .45) * 4)), by_ - 4 + int(round(math.sin(a_ * .45) * 2)), '#1a1a1e')
        for x in range(bx_ - 6, bx_ + 7): s.px(x, by_ - 5 - (x - bx_) // 6, '#3a7ad8')
        light_pool(s, bx_, by_, 14, 2, '#000000', k=.4)
    for k in range(3):                                    # a football, scuffed white
        pass
    for (fx_, fy_) in [(150, G0 + 22)]:
        for y in range(fy_ - 3, fy_ + 1):
            for x in range(fx_ - 2, fx_ + 2): s.px(x, y, '#e8e4dc' if (x + y) % 3 else '#3a3634')
    broadleaf(s, 214, G0 + 2, 40, 17, LEAF, P('#1a120c', '#2a1e14', '#3e2c1e', '#523a28'))
    light_pool(s, 214, G0 + 3, 16, 3, '#000000', k=.5)
    for k in range(80):                                  # patchy grass, bigger toward the viewer
        x = (k * 67) % W; y = G0 + 6 + (k * 31) % (H - G0 - 8); n_ = 2 + (y - G0) // 30
        for i2 in range(n_): s.px(x + i2, y, '#3a5a2a'); s.px(x + i2, y - 1, '#5a7a3a') if i2 % 2 else None
    r3 = np.random.RandomState(5)
    for k in range(24):                                  # litter: a bottle cap, paper, a lost toy
        x, y = r3.randint(0, W), r3.randint(G0 + 8, H - 4); col = ['#c8ccd4', '#e8e0cc', '#c83a30', '#3a7ad8'][k % 4]
        s.px(x, y, col); s.px(x + 1, y + 1, '#1a1410')
    for lx in (96, 318):                                 # lampposts lighting the courtyard
        for y in range(34, G0 + 14): s.px(lx, y, '#1e1e24'); s.px(lx + 1, y, '#3a3a44')
        for dy in range(4):
            for dx in range(7): s.px(lx - 3 + dx, 30 + dy, '#fff0b8' if dy > 0 else '#2a2a30')
        light_pool(s, lx, G0 + 20, 64, 24, '#ffd890', k=.28)
        light_pool(s, lx + 5, G0 + 15, 10, 2, '#000000', k=.5)
    for x0 in (-10, 270):                                    # stucco texture on the near blocks
        m_ = (XX >= x0) & (XX < x0 + 140) & (YY > 14) & (YY < G0)
        s.p[m_] = np.clip(s.p[m_] * (1 + (fbm(XX / 1.3, YY / 1.3, 70)[m_, None] - .5) * .16), 0, 255).astype(np.uint8)
    for (x0, x1) in [(-10, 120), (270, 410)]:              # water stains running down from each balcony
        for x in range(max(0, x0 + 6), min(W, x1 - 6), 22):
            for y in range(20, G0 - 14):
                if (y + x) % 11 < 2 and s.p[y, x].mean() > 50: s.p[y, x] = (s.p[y, x] * .88).astype(np.uint8)
    retime(s, tod, 'dusk', sky_ref, ['#f8d27a', '#a07a3a', '#f0c878', '#fff0b8'], HZ - 42,
           lamps=[(96, G0 + 20, 64, 24), (318, G0 + 20, 64, 24), (46, 80, 10, 4), (102, 80, 10, 4), (306, 80, 10, 4), (370, 80, 10, 4)], seed=13)
    vignette(s, .4)
    finish_bg(s, cool='#2a2448' if tod != 'day' else '#3a4a6a', warm='#ffc890' if tod != 'night' else '#b8c4e8', k=.15, grain=.04, seed=13)
    return s, {'hz': HZ, 'colors': 200}

ALL = [('field', field), ('forest', forest), ('mount', mount), ('crater', crater), ('rainforest', rainforest), ('fjord', fjord),
       ('pampa', pampa), ('lagoon', lagoon), ('deep', deep), ('cave', cave), ('cave3', cave3), ('cave4', cave4), ('cave5', cave5), ('waria', waria), ('metro', metro), ('feria', feria), ('blocks', blocks),
       ('waria@day', lambda: waria('day')), ('waria@night', lambda: waria('night')), ('feria@dusk', lambda: feria('dusk')), ('feria@night', lambda: feria('night')),
       ('blocks@day', lambda: blocks('day')), ('blocks@night', lambda: blocks('night'))]
