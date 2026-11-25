"""Hand-built battle backdrops in the style of 16-bit RPG battle scenes: a fixed pixel grid, curated
palette, ordered dithering for every gradient, a perspective ground the fighters stand on, and framing
foreground pieces. Painted at 400x224 (the widest screen); the game crops the middle for narrower ones.
Output: src/paintbg.js (PNG data URLs + a little geometry for the animation layer)."""
import numpy as np, base64, io, json, os, math
from PIL import Image

W, H = 400, 224
B4 = (np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) + .5) / 16
def hx(s):
    if not isinstance(s, str): return np.asarray(s, np.uint8)
    s = s.lstrip('#'); return np.array([int(s[i:i + 2], 16) for i in (0, 2, 4)], np.uint8)
def bay(x, y): return B4[y & 3, x & 3]

class Pic:
    def __init__(s): s.p = np.zeros((H, W, 3), np.uint8); s.a = np.zeros((H, W), bool)
    def px(s, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < W and 0 <= y < H: s.p[y, x] = hx(c) if isinstance(c, str) else c; s.a[y, x] = True
    def ramp_at(s, x, y, ramp, t):
        """pick a colour from a ramp at position t (0..1) with ordered dithering between neighbours"""
        t = min(.9999, max(0, t)) * (len(ramp) - 1); i = int(t); f = t - i
        return ramp[min(len(ramp) - 1, i + (1 if f > bay(x, y) else 0))]

def P(*c): return [hx(x) for x in c]

# ---- value noise + shading helpers (numpy, vectorised) ----
YY, XX = np.mgrid[0:H, 0:W].astype(float)
BAYF = np.tile(B4, (H // 4 + 1, W // 4 + 1))[:H, :W]
def vnoise(x, y, seed):
    r = np.random.RandomState(seed); g = r.rand(64, 64)
    xi, yi = np.floor(x).astype(int), np.floor(y).astype(int); fx, fy = x - xi, y - yi
    sx, sy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a = g[yi % 64, xi % 64]; b = g[yi % 64, (xi + 1) % 64]; c = g[(yi + 1) % 64, xi % 64]; d = g[(yi + 1) % 64, (xi + 1) % 64]
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy
def fbm(x, y, seed, oct=4):
    v, a, t = 0, .5, 0
    for o in range(oct): v = v + a * vnoise(x * 2 ** o, y * 2 ** o, seed + o); t += a; a *= .5
    return v / t
def ridged(x, y, seed, oct=4):
    v, a, t = 0, .5, 0
    for o in range(oct): v = v + a * (1 - abs(vnoise(x * 2 ** o, y * 2 ** o, seed + o) * 2 - 1)) ** 2; t += a; a *= .5
    return v / t
LIGHT = np.array([.72, -.42, .55]); LIGHT = LIGHT / np.linalg.norm(LIGHT)
def shade(z, k=1.0):
    dzx = np.gradient(z, axis=1) * k; dzy = np.gradient(z, axis=0) * k
    n = np.stack([-dzx, -dzy, np.ones_like(z)], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return np.clip((n * LIGHT).sum(-1), 0, 1)
def paint(s, mask, t, ramp):
    """write ramp colours where mask is set, t in 0..1, ordered-dithered between ramp steps"""
    t = np.clip(t, 0, .9999) * (len(ramp) - 1); i = np.floor(t).astype(int); f = t - i
    i = np.minimum(len(ramp) - 1, i + (f > BAYF)); R_ = np.array(ramp)
    s.p[mask] = R_[i[mask]]; s.a[mask] = True

SKY = P('#1c2f6e', '#25408a', '#3156a3', '#4470b8', '#5e8cca', '#7ea8d8', '#a3c4e4', '#c6dcef', '#e2ecf4')
CLOUD = P('#7f96bc', '#a7b9d6', '#c9d6ea', '#e6edf7', '#ffffff')
MNT = P('#3e5384', '#4a6194', '#566fa4', '#6680b4', '#7c96c6', '#98b0d6')
SNOW = P('#a9bbd8', '#cad8ec', '#eef4fb')
SEA = P('#1f4f8c', '#245c98', '#2a69a4', '#3077b0', '#3887bc', '#4398c8', '#58aad2')
CREST = P('#7cc0e2', '#a8daf0', '#e6f6ff')
FOAM = P('#9cc8de', '#c8e4f0', '#eef9ff', '#ffffff')
WET = P('#6e5f48', '#7d6c52', '#8f7c5e', '#a1906e', '#b4a684')
SAND = P('#8f7350', '#a2845a', '#b69766', '#c8a973', '#d6b882', '#e3c896', '#eed8ae', '#f6e7c8')
ROCK = P('#141219', '#221f2a', '#322e3c', '#46414f', '#5c5666', '#78717f', '#948c98')
KELP = P('#2a2410', '#40381a', '#5a4e22', '#76662c', '#94823a')
WOOD = P('#1e140e', '#33241a', '#4c3626', '#664a34', '#836248', '#a2826a', '#c2a68e', '#ddc8b2')

def coast():
    s = Pic(); rnd = np.random.RandomState(7)
    HZ = 76   # sea horizon
    # ---- sky: dithered bands, warmer and paler toward the horizon on the right (afternoon sun)
    for y in range(HZ):
        for x in range(W):
            t = (y / HZ) ** 1.15 * .92 + (x / W) * .06 * (y / HZ)
            s.px(x, y, s.ramp_at(x, y, SKY, t))
    # sun glow low on the right, banded
    sx, sy = 292, 70
    for y in range(20, HZ):
        for x in range(220, W):
            d = math.hypot((x - sx) * .55, y - sy)
            if d < 52:
                lvl = int((1 - d / 52) * 4 + bay(x, y))
                if lvl > 0: s.p[y, x] = (s.p[y, x] * (1 - .13 * lvl) + hx('#ffeec4') * .13 * lvl).astype(np.uint8)
    # ---- clouds: flat-bottomed cumulus, lit from the right-top, three tones + rim
    def cloud(cx, cy, w, h, seed):
        r = np.random.RandomState(seed); lobes = [(cx + r.randint(-w // 2, w // 2), cy - r.randint(0, h), r.randint(h, h * 2)) for _ in range(6)]
        lobes += [(cx - w // 2 + 6, cy - 2, h), (cx + w // 2 - 6, cy - 2, h)]
        for y in range(cy - h * 3, cy + 2):
            for x in range(cx - w, cx + w):
                if y > cy + 1: continue
                inside = [(x - lx_) ** 2 / (lr * 1.35) ** 2 + (y - ly) ** 2 / lr ** 2 for lx_, ly, lr in lobes]
                m = min(inside)
                if m <= 1:
                    # light from upper right
                    lx_, ly, lr = lobes[int(np.argmin(inside))]
                    nx, ny = (x - lx_) / (lr * 1.35), (y - ly) / lr
                    lit = .55 + .45 * (nx * .6 - ny * .8)
                    if y >= cy - 1: lit -= .45
                    if m > .82: lit += .15
                    s.px(x, y, s.ramp_at(x, y, CLOUD, lit))
    for cx, cy, w, h, sd in [(60, 30, 34, 7, 1), (150, 18, 22, 5, 2), (236, 36, 30, 6, 3), (352, 24, 26, 6, 4), (110, 56, 16, 3, 5), (290, 58, 14, 3, 6)]:
        cloud(cx, cy, w, h, sd)
    # ---- two coastal ranges, shaded from a heightfield (ridges, gullies, lit faces toward the low sun on the right)
    def ridge1(seed, base, amp, x):
        r = np.random.RandomState(seed); ph = r.rand(4) * 6
        return base - amp * (abs(np.sin(x / 41 + ph[0])) * .6 + abs(np.sin(x / 17 + ph[1])) * .3 + abs(np.sin(x / 7 + ph[2])) * .1)
    xs = np.arange(W, dtype=float)
    VX, VTOP = 150, 22                                   # the volcano: summit position
    for layer, (seed, base, amp) in enumerate([(3, 70, 20), (5, 77, 12)]):
        top = ridge1(seed, base, amp, xs)
        cone = VTOP + abs(xs - VX) * .56 + np.maximum(0, abs(xs - VX) - 40) * .3
        if layer == 0: top = np.minimum(top, cone)
        T = top[None, :]; below = (YY >= T) & (YY < HZ)
        # heightfield: the slope leans back as it rises; ridged noise cuts ridges and gullies running downhill
        rid = ridged(XX / 9 + layer * 7, YY / 4.5, 20 + layer * 9, 4)
        z = (HZ - YY) * .35 + rid * (6 if layer == 0 else 4)
        if layer == 0:
            onv = below & (abs(XX - VX) < (YY - VTOP) / .56 + 2)
            gul = ridged((XX - VX) / np.maximum(4, (YY - VTOP) * .22) * 1.6, YY / 26, 33, 3)   # gullies fanning out from the summit
            z = np.where(onv, (HZ - YY) * .35 - abs(XX - VX) * .55 * 0 + gul * 5, z)
            # the cone itself is rounded: its right flank faces the sun
            z = np.where(onv, z - ((XX - VX) / np.maximum(6, (YY - VTOP) * 1.8)) ** 2 * 6, z)
        L = shade(z, 1.0)
        dist = (YY - T) / np.maximum(1, HZ - T)
        if layer == 0:
            t = .05 + L * 1.05 - dist * .25 + .1
            paint(s, below, t, MNT)
            # snow: a ragged cap whose lower edge runs down the gullies, plus thin snow on the highest ridges
            cap = 16 + (fbm(XX / 4, YY / 4, 41) - .5) * 10 + (gul > .6) * 9
            snow = onv & ((YY - VTOP) < cap)
            snow |= below & (T < 50) & ((YY - T) < 2 + (rid > .62) * 3)
            paint(s, snow, .1 + L * 1.1, SNOW)
            # rocky outcrops poking through the snow
            out = snow & (fbm(XX / 2.5, YY / 2.5, 44) > .7)
            s.p[out] = MNT[2]
            # aerial perspective: the far range pales toward its foot (blend, not dots)
            fade = below & (dist > .45)
            k = np.clip((dist - .45) * .9, 0, .45)[fade][:, None]
            s.p[fade] = (s.p[fade] * (1 - k) + SKY[6] * k).astype(np.uint8)
        else:
            t = .05 + L * .7 - dist * .1
            paint(s, below, t, MNT)
        for x in range(W):
            ty = int(top[x])
            if 0 <= ty < HZ: s.px(x, ty, (MNT[5] if layer else SNOW[2] if ty < 50 else MNT[5]) if np.gradient(top)[x] > 0 else MNT[3])
    # ---- sea: a wave heightfield seen in perspective; rising faces mirror the pale sky, troughs go deep blue,
    #      turquoise in the shallows, broken glitter under the sun
    SH = 112
    d = np.clip((YY - HZ) / (SH - HZ), 0, 1); Z = 1 / (d * .92 + .08)        # distance into the scene
    Xw = (XX - W / 2) * Z / 46
    hw = (np.sin(Z * 1.9 + np.sin(Xw * .35) * 1.2) * .55 + np.sin(Z * 4.1 + Xw * .9) * .25 + fbm(Xw * .8, Z * 1.6, 60) * .6)
    slope = np.gradient(hw, axis=0)                                          # facing up the screen = rising toward us
    sea = (YY > HZ) & (YY < SH)
    fres = (1 - d) ** 2                                                      # far water reflects more sky
    t = .22 + d * .55 + np.clip(slope * 1.4, -.35, .35) - fres * .1
    paint(s, sea, t, SEA)
    sky_m = sea & (d < .25) & (BAYF < (.25 - d) * 2.2)                      # pale sky mirrored near the horizon
    s.p[sky_m] = SKY[6]
    shal = sea & (d > .8) & (BAYF < (d - .8) * 2.5)                           # turquoise shallows before the break
    s.p[shal] = hx('#4fb5c4')
    s.p[HZ, :] = hx('#9cc4e4')
    # wavelets: short strokes, lit on top and shadowed below, longer and farther apart toward the shore
    r = np.random.RandomState(31)
    for _ in range(620):
        y = int(HZ + 2 + (r.rand() ** 1.6) * (SH - HZ - 6)); dd = (y - HZ) / (SH - HZ)
        x = r.randint(0, W); L = int(2 + dd * 10 + r.rand() * 4)
        for i in range(L):
            if 0 <= x + i < W:
                s.px(x + i, y, CREST[0] if dd < .35 else CREST[1] if i not in (0, L - 1) else CREST[0])
                if dd > .2: s.px(x + i, y + 1, SEA[max(0, int(dd * 4) - 1)])
        if dd > .55 and r.rand() < .5:
            for i in range(1, L - 1): s.px(x + i, y - 1, CREST[2] if i % 3 == 1 else CREST[1])
    # glitter on the sun path: short bright dashes, denser toward the middle of the path
    for y in range(HZ + 1, SH - 3):
        dd = (y - HZ) / (SH - HZ); spread = 5 + (y - HZ) * 1.3
        for x in range(int(sx - spread), int(sx + spread)):
            if (x * 7 + y * 13) % 11 == 0 and r.rand() < .75 * (1 - abs(x - sx) / spread):
                for i in range(1 + int(dd * 4)): s.px(x + i, y, '#fff6dc' if i % 2 == 0 else CREST[2])
    # sea stack: a basalt island shaded like the foreground rocks, wet at the foot
    ss = (YY >= 78) & (YY < 104) & (abs(XX - 250) < 5 + (YY - 78) * .55 + (YY > 96) * 2)
    zr = fbm(XX / 5, YY / 5, 70) * 4 - abs(XX - 250) * .35
    paint(s, ss, .18 + shade(zr, 1.4) * .75, ROCK)
    for x in range(236, 266, 2): s.px(x, 104, FOAM[2]); s.px(x + 1, 103, FOAM[1])
    # ---- shore break: two foam lines, irregular
    for x in range(W):
        f1 = SH - 2 + int(2 * math.sin(x / 9.0) + 1.5 * math.sin(x / 3.7 + 1))
        for y in range(f1 - 2, f1 + 3): s.px(x, y, FOAM[min(3, max(0, 3 - abs(y - f1)))])
        if rnd.rand() < .5: s.px(x, f1 - 3, FOAM[1])
    # ---- wet sand: darker, mirrors the sky in streaks
    WS = 122
    for y in range(SH - 1, WS):
        for x in range(W):
            t = (y - SH) / (WS - SH)
            c = s.ramp_at(x, y, WET, .85 - t * .5)
            if (x + y * 7) % 23 < 6 and rnd.rand() < .5: c = hx('#9fb0bc')
            s.px(x, y, c)
    for x in range(W):   # a thin lace of foam left on the wet sand
        if math.sin(x / 6.0) + math.sin(x / 2.3) > .9: s.px(x, SH + 4 + int(math.sin(x / 11.0) * 1.5), FOAM[1])
    # ---- the beach floor in perspective: ripple rows widening toward the viewer, a light pool where the fighters stand
    for y in range(WS, H):
        for x in range(W):
            depth = (y - WS) / (H - WS)
            # light pool centred on the fighting ground, darker toward the edges and the bottom corners
            pool = math.exp(-(((x - W * .52) / (W * .42)) ** 2 + ((y - 140) / 46) ** 2))
            t = .32 + pool * .55 - depth * .12
            s.px(x, y, s.ramp_at(x, y, SAND, t))
    # ripples: curved rows, spacing grows with depth
    yy = WS + 3.0; k = 0
    while yy < H:
        gap = 3 + k * 1.15; k += 1
        for x in range(W):
            y = int(yy + 2.2 * math.sin(x / (22 + k * 4) + k * 1.7) + (x - W / 2) ** 2 / 9000)
            if WS < y < H - 1 and math.sin(x / 5.0 + k) > -.55:
                base = s.p[y, x].astype(int)
                s.p[y, x] = np.clip(base - 26, 0, 255).astype(np.uint8)          # shadow side
                s.p[y - 1, x] = np.clip(s.p[y - 1, x].astype(int) + 16, 0, 255).astype(np.uint8)   # lit crest
        yy += gap
    # shells and pebbles, a few
    for _ in range(26):
        x, y = rnd.randint(0, W), rnd.randint(WS + 6, H - 4)
        if rnd.rand() < .5: s.px(x, y, SAND[7]); s.px(x + 1, y, SAND[6]); s.px(x, y + 1, SAND[2])
        else: s.px(x, y, ROCK[3]); s.px(x + 1, y, ROCK[2]); s.px(x, y - 1, ROCK[5])
    # ---- foreground framing: faceted basalt boulders and a weathered driftwood log, shaded from heightfields
    def boulder(cx, cy, rx, ry, seed):
        nx, ny = (XX - cx) / rx, (YY - cy) / ry; ang = np.arctan2(ny, nx)
        edge = 1 + .12 * np.sin(ang * 4 + seed) + .03 * np.sin(ang * 9 + seed * 2)
        r2 = np.sqrt(nx * nx + ny * ny); m = (r2 <= edge) & (YY < H)
        dome = np.sqrt(np.clip(1 - (r2 / edge) ** 2, 0, 1)) * min(rx, ry)
        facets = np.floor(fbm(XX / 7 + seed, YY / 7, 80 + seed, 2) * 5) * 2.2     # flat fractured planes
        z = dome + facets + fbm(XX / 3.5, YY / 3.5, 90 + seed) * .7
        L = shade(z, .9)
        # cast shadow on the sand, thrown to the left and down by the low sun on the right
        sh = (np.sqrt(((XX - cx + rx * .45) / (rx * 1.1)) ** 2 + ((YY - cy - ry * .55) / (ry * .45)) ** 2) <= 1) & ~m & (YY < H)
        s.p[sh] = (s.p[sh] * .62).astype(np.uint8)
        ao = np.clip((YY - (cy + ry * .35)) / (ry * .7), 0, 1)                      # dark where it meets the ground
        paint(s, m, .14 + L * .95 - ao * .3, ROCK)
        wet = m & (fbm(XX / 4, YY / 4, 95 + seed) > .7) & (L > .6)                 # damp sheen
        s.p[wet] = hx('#a4b2c0')
        cr = m & (abs(fbm(XX / 4, YY / 9, 99 + seed) - .5) < .018)                 # cracks
        s.p[cr] = ROCK[0]
        bar = m & (YY > cy) & (np.random.RandomState(seed).rand(H, W) < .02)       # barnacles
        s.p[bar] = hx('#c8c2b4')
        return m
    rocks = [(60, 210, 40, 26, 11), (100, 218, 26, 16, 12), (130, 222, 12, 7, 13), (352, 210, 36, 24, 14), (322, 220, 18, 10, 15)]
    for r_ in rocks: boulder(*r_)
    # cochayuyo: thick leathery strands draped over the left rocks, shaded round
    for k in range(9):
        x0 = 34 + k * 6; y0 = 186 + (k % 3) * 4
        for i in range(28):
            x = x0 + int(4 * math.sin(i / 5 + k)); y = y0 + i
            for dx, c in ((-1, KELP[1]), (0, KELP[3] if i % 4 else KELP[4]), (1, KELP[2]), (2, KELP[0])): s.px(x + dx, y, c)
    # driftwood: a bent, bleached log; round shading across its thickness, bark grain along it, a branch stub
    x0, x1 = 236, 318
    for x in range(x0, x1):
        t = (x - x0) / (x1 - x0); yc = 198 + 6 * t + 1.6 * math.sin(x / 9); rad = 6.5 - t * 1.4
        for yy in range(int(yc - rad - 1), int(yc + rad + 2)):
            v = (yy - yc) / rad
            if abs(v) > 1: continue
            nz = math.sqrt(1 - v * v); ny = v
            L = max(0, .72 * .0 + -.42 * ny * -1 * -1 + .55 * nz)                 # light from above (y up) and front
            L = max(0, .42 * -ny + .55 * nz + .25)
            grain = .08 * math.sin(x * .9 + yy * 2.3) + (.12 if (int(x * .35 + yy * 1.7) % 9 == 0) else 0)
            c = s.ramp_at(x, yy, WOOD, .05 + L * .85 - grain - (.15 if int(yy * 1.3 + x * .05) % 3 == 0 else 0))
            if v > .75: c = WOOD[0]
            s.px(x, yy, c)
        s.px(x, int(yc + rad + 2), (s.p[min(H - 1, int(yc + rad + 2)), x] * .55).astype(np.uint8))   # shadow under the log
        s.px(x, int(yc + rad + 3), (s.p[min(H - 1, int(yc + rad + 3)), x] * .75).astype(np.uint8))
    for k, x in enumerate(range(244, 312, 13)):           # knots and splits
        yc = int(198 + 6 * (x - x0) / (x1 - x0) + 1.6 * math.sin(x / 9))
        s.px(x, yc - 1, WOOD[0]); s.px(x + 1, yc - 1, WOOD[1]); s.px(x, yc, WOOD[1])
        for i in range(4): s.px(x + 3 + i, yc - 2 + (k % 2), WOOD[1])
    for i in range(9):                                      # a broken branch stub rising from the log
        s.px(262 + i // 2, 193 - i, WOOD[3]); s.px(263 + i // 2, 193 - i, WOOD[4]); s.px(261 + i // 2, 193 - i, WOOD[1])
    for d in range(-5, 6):                                  # sawn end, growth rings
        for e in range(-4, 5):
            r2 = d * d + e * e * 1.4
            if r2 <= 22: s.px(x1 + e // 2, 205 + d, WOOD[5] if int(r2) % 7 < 3 else WOOD[3])
    return s, {'hz': HZ, 'sh': SH, 'ws': WS, 'sun': [sx, sy]}

def encode(s, colors=96):
    img = Image.fromarray(s.p, 'RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    b = io.BytesIO(); img.save(b, 'PNG', optimize=True); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = {}
    import bg_more
    for name, fn in [('coast', coast)] + bg_more.ALL:
        s, geo = fn(); out[name] = {'src': encode(s, geo.pop('colors', 96)), 'geo': geo}
        Image.fromarray(s.p).resize((W * 3, H * 3), Image.NEAREST).save('/home/claude/bg_%s.png' % name)
    open(os.path.join(here, '..', 'src', 'paintbg.js'), 'w').write('/* generated by tools/bg_paint.py: hand-built battle backdrops */\nconst PAINTBG=' + json.dumps(out) + ';\n')
    print({k: len(v['src']) for k, v in out.items()})
