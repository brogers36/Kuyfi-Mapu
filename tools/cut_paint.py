"""Cutscene backdrops painted like the battle backdrops (tools/bg_paint.py): a lake shore under the volcano in four
moods (dawn, grey, dusk, gold) and Santiago's skyline (night, dawn). Same pixel grid, curated ramps, ordered
dithering, heightfield-shaded mountains, mirrored water. Layout matches the old flat layers of src/cutart.js
(sky above ~110, the volcano at 64% of the width, water 138-167, sand from 167, people standing at y=182).
Output: entries 'cut_<mood>' and 'cutcity_<kind>' merged into src/paintbg.js."""
import numpy as np, math, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bg_paint import W, H, Pic, P, hx, paint, shade, fbm, ridged, vnoise, YY, XX, BAYF, bay, encode
from PIL import Image

def lerp(a, b, t): return (np.asarray(a, float) * (1 - t) + np.asarray(b, float) * t).astype(np.uint8)
def ramp_between(c0, c1, n): return [lerp(hx(c0), hx(c1), i / (n - 1)) for i in range(n)]

MOODS = {
    'dawn': dict(sky=P('#141a48', '#1e2a66', '#2e3a84', '#4a4a9c', '#7a5aa6', '#b46a9c', '#e88a86', '#ffb488', '#ffd8a4'),
                 sun=(340, 128, '#ffe2b0', 1.0), mnt=P('#2a2c5c', '#383a72', '#4a4a88', '#5e5c9c', '#7a72ae', '#a088b8'), rim='#ffb898',
                 snow=P('#a89ac4', '#d2bcd8', '#ffe8ee'), hill=P('#0e2018', '#16301e', '#1e4226', '#2a5830', '#3c723c'), tree='#0a1810',
                 sea=P('#1c2a5a', '#263a72', '#34508a', '#4a68a0', '#7a7ab0', '#c08aa8'), sand=P('#6a5448', '#84684e', '#a08058', '#bc9862', '#d4b07a', '#e6c896', '#f2dcb4'),
                 cloud=P('#5a4a7a', '#8a6a92', '#c88aa0', '#f2b4a4', '#ffe0c4'), stars=0),
    'grey': dict(sky=P('#2a2a34', '#32323e', '#3a3a48', '#444452', '#4e4e5c', '#585866', '#626270', '#6e6e7c', '#7a7a88'),
                 sun=None, mnt=P('#30323c', '#3a3c48', '#464856', '#525564', '#606272', '#707282'), rim='#8a8c98',
                 snow=P('#80828e', '#9a9ca8', '#b4b6c0'), hill=P('#1a1e1c', '#222826', '#2c3230', '#363e3a', '#424a46'), tree='#141816',
                 sea=P('#262a34', '#2e3440', '#383e4c', '#424a58', '#4e5664', '#5c6472'), sand=P('#3e3c36', '#4a4740', '#56534a', '#625e54', '#6e6a5e', '#7a7668', '#868272'),
                 cloud=P('#3a3a46', '#44444f', '#4e4e5a', '#5a5a66', '#666672'), stars=0),
    'dusk': dict(sky=P('#0a0820', '#120e30', '#1c1440', '#2c1a50', '#46205a', '#6e2a5e', '#a43c5a', '#d85e4e', '#f8964a'),
                 sun=(350, 134, '#ffb870', .8), mnt=P('#140e2c', '#1e163c', '#2a1e4c', '#382860', '#4a3472', '#644684'), rim='#ff8a6a',
                 snow=P('#6a5a8a', '#a088b0', '#e8c8d8'), hill=P('#080e0c', '#0e1812', '#142218', '#1c2e1e', '#283e28'), tree='#060a08',
                 sea=P('#0e0c26', '#181436', '#241c4a', '#36265e', '#5a3466', '#a04a5a'), sand=P('#3a2a2a', '#4e3830', '#644836', '#7c5a3e', '#966c48', '#b08456', '#c89c68'),
                 cloud=P('#2a1a3a', '#4a2448', '#7a3452', '#c04e52', '#f08a5a'), stars=1),
    'gold': dict(sky=P('#2a4c96', '#3458a2', '#4066ae', '#5076ba', '#6488c4', '#7c9ccc', '#a0b6d2', '#d0cebc', '#f6dca6'),
                 sun=(330, 118, '#fff0c0', 1.0), mnt=P('#3a4c80', '#465a90', '#5468a0', '#6478b0', '#7a8ec0', '#98aad0'), rim='#ffe0a8',
                 snow=P('#b8c6e0', '#dce6f4', '#ffffff'), hill=P('#1a3a1e', '#24502a', '#306636', '#40803e', '#58984a'), tree='#122a16',
                 sea=P('#1c4a8a', '#24589a', '#2e68aa', '#3a78b8', '#5490c6', '#8ab8d8'), sand=P('#8a7050', '#a2845a', '#b69766', '#c8a973', '#d8bc86', '#e8d09e', '#f4e2bc'),
                 cloud=P('#8296bc', '#a8bad6', '#cad6ea', '#eaeff8', '#ffffff'), stars=0)}

def araucaria(s, x, base, h, col, lit, seed):
    """a pewen: straight trunk, an umbrella crown of drooping branch tiers at the top"""
    r = np.random.RandomState(seed)
    for y in range(base - h, base + 1): s.px(x, y, col)
    tiers = 4 + h // 10
    for k in range(tiers):
        y = base - h + k * 2; w = int(2 + k * 1.3 + r.rand())
        for dx in range(-w, w + 1):
            yy = y + int(abs(dx) ** 1.3 * .22)                         # branch tips droop
            s.px(x + dx, yy, col)
            if k == 0 or (dx > 0 and r.rand() < .35): s.px(x + dx, yy - 1, lit if dx > 0 else col)

def lake(mood):
    M = MOODS[mood]; s = Pic(); r = np.random.RandomState(3)
    HZ, SH = 138, 167
    # ---- sky
    t = (YY / HZ) ** 1.1
    if M['sun']:
        sx, sy, sc, k = M['sun']; d = np.hypot((XX - sx) * .6, YY - sy)
        t = t + np.exp(-(d / 70) ** 2) * .12 * k
    paint(s, YY < HZ, t, M['sky'])
    if M['stars']:
        for _ in range(90):
            x, y = r.randint(0, W), int(r.rand() ** 1.8 * 70)
            s.px(x, y, '#ffffff' if r.rand() < .3 else lerp(s.p[y, x], hx('#ffffff'), .6))
    if M['sun']:
        sx, sy, sc, k = M['sun']
        for y in range(int(sy - 60), HZ):
            for x in range(int(sx - 110), min(W, int(sx + 110))):
                if 0 <= y:
                    dd = math.hypot((x - sx) * .5, y - sy)
                    if dd < 56:
                        lv = int((1 - dd / 56) * 4 * k + bay(x, y))
                        if lv > 0: s.p[y, x] = lerp(s.p[y, x], hx(sc), .1 * lv)
        for y in range(int(sy - 9), int(sy + 10)):
            for x in range(int(sx - 10), int(sx + 11)):
                if (x - sx) ** 2 + (y - sy) ** 2 <= 81 and y < HZ: s.px(x, y, lerp(hx(sc), hx('#ffffff'), .5) if (x - sx) ** 2 + (y - sy) ** 2 < 40 else sc)
    # clouds: long stratus bands lit from the sun side
    for (cx, cy, w, hh, sd) in [(70, 34, 60, 4, 1), (200, 22, 46, 3, 2), (300, 52, 70, 4, 3), (130, 76, 50, 3, 4), (380, 30, 40, 3, 5)]:
        n = fbm(XX / 9 + sd, YY / 3, 10 + sd, 3)
        m = (np.abs(YY - cy) < hh * (1.2 - np.abs(XX - cx) / w)) & (n > .42) & (YY < HZ)
        lit = .3 + (n - .42) * 1.6 - (YY - cy) / (hh * 3) + (0 if not M['sun'] else -.0)
        paint(s, m, np.clip(lit, 0, 1), M['cloud'])
    # ---- mountains: a far range and the volcano, heightfield-shaded, snow on the cone
    xs = np.arange(W, dtype=float)
    VX, VTOP = W * .64, 48
    def rng(seed, base, amp):
        ph = np.random.RandomState(seed).rand(4) * 6
        return base - amp * (abs(np.sin(xs / 41 + ph[0])) * .6 + abs(np.sin(xs / 17 + ph[1])) * .3 + abs(np.sin(xs / 7 + ph[2])) * .1)
    for layer, (seed, base, amp) in enumerate([(3, 112, 34), (5, 124, 18)]):
        top = rng(seed, base, amp)
        if layer == 0:
            cone = VTOP + np.abs(xs - VX) * .62 + np.maximum(0, np.abs(xs - VX) - 30) * .35
            top = np.minimum(top, cone)
        T = top[None, :]; below = (YY >= T) & (YY < HZ)
        rid = ridged(XX / 9 + layer * 7, YY / 4.5, 20 + layer * 9, 4)
        z = (HZ - YY) * .35 + rid * (6 if layer == 0 else 4)
        if layer == 0:
            onv = below & (np.abs(XX - VX) < (YY - VTOP) / .62 + 2)
            gul = ridged((XX - VX) / np.maximum(4, (YY - VTOP) * .22) * 1.6, YY / 26, 33, 3)
            z = np.where(onv, (HZ - YY) * .35 + gul * 5 - ((XX - VX) / np.maximum(6, (YY - VTOP) * 1.8)) ** 2 * 6, z)
        L = shade(z, 1.0); dist = (YY - T) / np.maximum(1, HZ - T)
        paint(s, below, .05 + L * (1.0 if layer == 0 else .75) - dist * .25 - layer * .12, M['mnt'])
        if layer == 0:
            cap = 22 + (fbm(XX / 4, YY / 4, 41) - .5) * 10 + (gul > .6) * 9
            snow = onv & ((YY - VTOP) < cap)
            snow |= below & (T < 92) & ((YY - T) < 2 + (rid > .62) * 3)
            paint(s, snow, .1 + L * 1.1, M['snow'])
            if mood != 'grey':                                        # the sun side of the slopes catches the light
                rm = below & (L > .82) & (BAYF < .6)
                s.p[rm] = lerp(s.p[rm], hx(M['rim']), .35)
            fade = below & (dist > .4)                                # haze at the foot
            k = np.clip((dist - .4) * .9, 0, .5)[fade][:, None]
            s.p[fade] = (s.p[fade] * (1 - k) + np.asarray(M['sky'][7], float) * k).astype(np.uint8)
        for x in range(W):
            ty = int(top[x])
            if 0 <= ty < HZ: s.px(x, ty, M['snow'][2] if (layer == 0 and ty < 80) else M['mnt'][5] if np.gradient(top)[x] > 0 else M['mnt'][2])
    if mood == 'dusk' or mood == 'dawn':                              # smoke from the summit
        for k in range(30):
            a = k / 30; x = int(VX - 2 + a * 30 + math.sin(a * 6) * 4); y = int(VTOP - 2 - a * 26)
            for dx in range(-1 - int(a * 4), 2 + int(a * 4)):
                if bay(x + dx, y) < .55 - a * .4: s.px(x + dx, y, lerp(M['cloud'][1], M['cloud'][3], .3))
    # ---- forested hills with pewen along the shore
    hz2 = 132 - 8 * (np.sin(xs / 37 + 1) * .6 + np.sin(xs / 13) * .3) - 4 * fbm(xs / 6, np.zeros(W), 7, 2)
    T = hz2[None, :]; hill = (YY >= T) & (YY < HZ)
    zz = fbm(XX / 5, YY / 3, 51, 3) * 3 + (HZ - YY) * .2
    paint(s, hill, .15 + shade(zz, 1.4) * .7 - (YY - T) / 30, M['hill'])
    for k in range(0, W, 9):
        x = k + r.randint(0, 6); b = int(hz2[min(W - 1, x)]) + 2; h = 9 + r.randint(0, 9)
        araucaria(s, x, b, h, hx(M['tree']), M['hill'][3], k)
    # ---- water: mirrored landscape, darkened toward us, broken by ripples
    for y in range(HZ, SH):
        dd = (y - HZ) / (SH - HZ)
        for x in range(W):
            wob = int(round(math.sin(y * 1.7 + x * .09) * (1 + dd * 2)))
            sy_ = HZ - 1 - int((y - HZ) * 2.2) + wob
            src = s.p[max(0, sy_), min(W - 1, max(0, x + wob))] if sy_ >= 0 else s.p[0, x]
            base = s.ramp_at(x, y, M['sea'], .75 - dd * .6)
            s.p[y, x] = lerp(src, base, .45 + dd * .35); s.a[y, x] = True
    for _ in range(420):                                              # ripple glints
        y = int(HZ + 1 + r.rand() ** 1.4 * (SH - HZ - 3)); x = r.randint(0, W); L = int(2 + (y - HZ) * .3 + r.rand() * 3)
        for i in range(L): s.px(x + i, y, lerp(s.p[y, min(W - 1, x + i)], hx(M['sky'][-1]), .45))
    if M['sun']:
        sx = M['sun'][0]
        for y in range(HZ + 1, SH - 1):
            spread = 4 + (y - HZ) * 1.1
            for x in range(int(sx - spread), int(sx + spread)):
                if 0 <= x < W and (x * 7 + y * 13) % 9 == 0 and r.rand() < .7 * (1 - abs(x - sx) / spread):
                    s.px(x, y, lerp(hx(M['sun'][2]), hx('#ffffff'), .4))
    # ---- shore: a lace of foam, wet sand, then the beach in perspective
    for x in range(W):
        f1 = SH + int(1.6 * math.sin(x * .04) + math.sin(x * .14))
        for y in range(f1 - 1, f1 + 2): s.px(x, y, lerp(M['sea'][-1], hx('#ffffff'), .55 if y == f1 else .3))
        for y in range(f1 + 2, f1 + 6): s.px(x, y, s.ramp_at(x, y, M['sand'], .25 + (y - f1) * .04))
    for y in range(SH + 4, H):
        for x in range(W):
            if s.a[y, x] and y < SH + 6: continue
            depth = (y - SH) / (H - SH)
            pool = math.exp(-(((x - W * .5) / (W * .5)) ** 2 + ((y - 186) / 40) ** 2))
            s.px(x, y, s.ramp_at(x, y, M['sand'], .3 + pool * .55 - depth * .1))
    yy = SH + 8.0; k = 0
    while yy < H:                                                     # ripples in the sand
        gap = 3 + k * 1.2; k += 1
        for x in range(W):
            y = int(yy + 2 * math.sin(x / (22 + k * 4) + k * 1.7))
            if SH + 6 < y < H - 1 and math.sin(x / 5.0 + k) > -.5:
                s.p[y, x] = np.clip(s.p[y, x].astype(int) - 22, 0, 255).astype(np.uint8)
                s.p[y - 1, x] = np.clip(s.p[y - 1, x].astype(int) + 14, 0, 255).astype(np.uint8)
        yy += gap
    for _ in range(40):
        x, y = r.randint(0, W), r.randint(SH + 8, H - 3)
        s.px(x, y, M['sand'][-1]); s.px(x + 1, y + 1, M['sand'][1])
    if mood == 'grey':                                                # drained of colour: the whole land a shade flatter
        g = s.p.mean(2, keepdims=True); s.p[:] = (s.p * .55 + g * .45).astype(np.uint8)
    return s, {'hz': HZ, 'sh': SH}

def city(kind):
    s = Pic(); r = np.random.RandomState(11); night = kind == 'night'
    SKY = P('#04030c', '#080a1c', '#0c1028', '#121636', '#181c44', '#1e2450', '#262c5c') if night else P('#22204e', '#3a3270', '#5e4886', '#8a5a8c', '#c47484', '#f0967a', '#ffc08a', '#ffe0a8')
    GR = 184
    paint(s, YY < GR, (YY / 150) ** 1.05, SKY)
    if night:
        for _ in range(110):
            x, y = r.randint(0, W), int(r.rand() ** 1.6 * 100); s.px(x, y, '#ffffff' if r.rand() < .25 else '#8a90c0')
        for y in range(16, 48):                                       # the moon and its halo
            for x in range(300, 344):
                d = math.hypot(x - 322, y - 32)
                if d < 9: s.px(x, y, '#f4f0d8' if d < 7.5 or bay(x, y) < .5 else '#c8c4b0')
                elif d < 20 and bay(x, y) < (20 - d) / 30: s.p[y, x] = lerp(s.p[y, x], hx('#a8b0d8'), .3)
    else:
        for y in range(40, 140):
            for x in range(240, 400):
                d = math.hypot((x - 318) * .7, y - 92)
                if d < 50:
                    lv = int((1 - d / 50) * 5 + bay(x, y))
                    if lv > 0: s.p[y, x] = lerp(s.p[y, x], hx('#fff0c0'), .1 * lv)
                if d < 11: s.px(x, y, '#fff6d8' if d < 8 else '#ffe0a0')
    # the cordillera behind the city, snow-capped, shaded
    xs = np.arange(W, dtype=float)
    top = 112 - 44 * (.55 + .3 * np.sin(xs * .022 + 5.1) + .2 * np.sin(xs * .062 + 10.2) + .12 * np.sin(xs * .166 + 15.3))
    T = top[None, :]; mt = (YY >= T) & (YY < 150)
    rid = ridged(XX / 8, YY / 4, 91, 4); z = (150 - YY) * .3 + rid * 6
    L = shade(z, 1.0)
    MN = P('#0c0e20', '#121630', '#181e3c', '#202848', '#2a3256', '#343c62') if night else P('#4a3a64', '#5c4a76', '#705a86', '#866a94', '#9c7aa0', '#b48aa8')
    SN = P('#3a4064', '#5a6088', '#8088ae') if night else P('#d4b0c0', '#f0d0d4', '#fff0ec')
    paint(s, mt, .1 + L * .9, MN)
    snow = mt & ((YY - T) < 10 + (rid > .6) * 6 + (fbm(XX / 4, YY / 4, 9) - .5) * 6) & (T < 96)
    paint(s, snow, .1 + L * 1.1, SN)
    haze = mt & (YY > 120)
    k = np.clip((YY - 120) / 40, 0, .6)[haze][:, None]
    s.p[haze] = (s.p[haze] * (1 - k) + np.asarray(SKY[4], float) * k).astype(np.uint8)
    # far towers in the haze, then near blocks with lit windows
    def block(x, w, h, near, i):
        by = GR - h
        face = (P('#151830', '#1c2040', '#24284c') if not near else P('#1c1a34', '#26223e', '#2e2a4a')) if night else (P('#7a6278', '#8a6e80', '#9a7c88') if not near else P('#6a4e60', '#7c5c6c', '#8e6c78'))
        side = lerp(face[0], hx('#000000'), .3)
        for y in range(by, GR):
            for xx in range(x, x + w):
                s.px(xx, y, s.ramp_at(xx, y, face, .3 + (xx - x) / w * .5 - (y - by) / max(1, h) * .2))
            for xx in range(x + w, x + w + (4 if near else 2)): s.px(xx, y, side)
        for xx in range(x, x + w): s.px(xx, by, face[2] if not night else lerp(face[2], hx('#6a70a0'), .4))
        if near:
            for wy in range(by + 4, GR - 4, 6):
                for wx in range(x + 2, x + w - 3, 4):
                    on = r.rand() < (.5 if night else .18)
                    col = (hx('#ffe08a') if r.rand() < .6 else hx('#f0b860')) if on else (hx('#121026') if night else hx('#4a3a4c'))
                    for dy in range(3):
                        for dx in range(2): s.px(wx + dx, wy + dy, col if not (on and dy == 2) else lerp(col, hx('#000000'), .3))
                    if on and night:                                  # a little spill of light under lit windows
                        s.px(wx, wy + 3, lerp(face[1], col, .35)); s.px(wx + 1, wy + 3, lerp(face[1], col, .25))
            if i % 3 == 0:                                            # water tanks and antennas on the roofs
                for y in range(by - 6, by):
                    for xx in range(x + w - 8, x + w - 3): s.px(xx, y, side)
                for y in range(by - 12, by): s.px(x + 3, y, side)
                if night: s.px(x + 3, by - 12, '#ff4030')
        else:
            for wy in range(by + 3, GR - 3, 5):
                for wx in range(x + 2, x + w - 2, 3):
                    if r.rand() < (.3 if night else .1): s.px(wx, wy, '#c8a868' if night else '#a08890')
    x, i = -4, 0
    while x < W:
        bw = 10 + r.randint(0, 14); block(x, bw, 52 + r.randint(0, 60), False, i); x += bw + 1; i += 1
    hz = s.p.copy()
    x, i = -6, 0
    while x < W:
        bw = 18 + r.randint(0, 18); block(x, bw, 40 + r.randint(0, 52), True, i); x += bw + 6; i += 1
    # street level: sidewalk, kerb, road with lane marks, light pools under the lamps
    for y in range(GR, H):
        for x in range(W):
            if y < GR + 4: c = P('#3a3656', '#46426a')[1 if y == GR else 0] if night else P('#b4a4a4', '#c8b8b4')[1 if y == GR else 0]
            else:
                c = s.ramp_at(x, y, P('#14121e', '#1a1828', '#201e30', '#28263a') if night else P('#4a4050', '#544a5a', '#5e5464', '#6a6070'), .3 + (fbm(x / 6, y / 2, 5) - .5) * .5 + (y - GR) / 80)
            s.px(x, y, c)
    for x in range(0, W, 18):
        for dx in range(9): s.px(x + dx, 203, '#6a6040' if night else '#e8d070')
    if night:
        for lx in range(40, W, 110):
            for y in range(GR - 46, GR): s.px(lx, y, '#2a2838')
            for dx in range(-3, 4): s.px(lx + dx, GR - 46, '#3a3850')
            for y in range(GR - 46, H):
                for x in range(lx - 40, lx + 40):
                    if 0 <= x < W:
                        d = math.hypot((x - lx) * .8, (y - (GR + 10)) * 1.6)
                        if y > GR - 44 and d < 42 and bay(x, y) < (42 - d) / 60: s.p[y, x] = lerp(s.p[y, x], hx('#f0c070'), .28)
            for dx in range(-2, 3): s.px(lx + dx, GR - 45, '#fff0b0')
    return s, {'gr': GR}

ALL = [('cut_' + m, (lambda m=m: lake(m))) for m in MOODS] + [('cutcity_night', lambda: city('night')), ('cutcity_dawn', lambda: city('dawn'))]

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__)); pj = os.path.join(here, '..', 'src', 'paintbg.js')
    src = open(pj).read(); head = src[:src.index('const PAINTBG=')]
    out = json.loads(src[src.index('const PAINTBG=') + len('const PAINTBG='):].rstrip().rstrip(';'))
    only = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    sheet = []
    for name, fn in ALL:
        if only and name not in only: continue
        s, geo = fn(); out[name] = {'src': encode(s, 128), 'geo': geo}
        Image.fromarray(s.p).save('/tmp/bs/%s.png' % name); sheet.append(Image.fromarray(s.p))
    open(pj, 'w').write(head + 'const PAINTBG=' + json.dumps(out) + ';\n')
    if sheet:
        sh = Image.new('RGB', (W * 2, H * ((len(sheet) + 1) // 2)))
        for i, im in enumerate(sheet): sh.paste(im, ((i % 2) * W, (i // 2) * H))
        sh.save('/tmp/bs/cut_sheet.png')
    print('ok', [n for n, _ in ALL if not only or n in only])
