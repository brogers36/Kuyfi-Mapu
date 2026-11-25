"""Yewen (shame): hand-built pixel painting at native battle resolution.
Each body part is a mask with its own colour ramp; shading comes from a height
field (light from the upper left, the side the figure faces), banded into the
ramp with an ordered dither, then selectively outlined. Facial features,
stitches, nails, fingers, the padlock staff and the ghostfire are placed pixel
by pixel on top. Output: tools/yewen.json with a 96x112 battle sprite and a
48x56 map sprite, two frames each.
"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import distance_transform_edt, gaussian_filter

W, H = 96, 112
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
LIGHT = np.array([-0.62, -0.62, 0.48]); LIGHT = LIGHT / np.linalg.norm(LIGHT)

def hx(c): return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))
RAMP = {
    'skin':  ['#120c1c', '#2a2040', '#463862', '#685486', '#8e7aae', '#b8a6d2', '#e4d8f4'],
    'cloak': ['#12040c', '#2c0816', '#4c0e22', '#701830', '#982642', '#c03c56', '#e86c7c'],
    'lining':['#06040a', '#100a1a', '#1c1430', '#2a2046', '#3a2e5e'],
    'cloth': ['#0a0812', '#16122a', '#241e40', '#342c58', '#463c72', '#5e548e'],
    'gold':  ['#2a1806', '#54340a', '#875810', '#b8841c', '#e2b23a', '#fbe486'],
    'metal': ['#0c0c10', '#24242c', '#40404c', '#64646f', '#8e8e98', '#c4c4ca', '#f2f2ec'],
    'wood':  ['#140a06', '#2c180c', '#482812', '#68401c', '#8c5a2a'],
    'boot':  ['#08060a', '#161018', '#261c28', '#3a2c3c', '#524052'],
    'fire':  ['#3c0a3a', '#7e1270', '#c0289c', '#ee5cd0', '#ffb4f2', '#fff0fc'],
}
RAMP = {k: [hx(c) for c in v] for k, v in RAMP.items()}

class Canvas:
    def __init__(s):
        s.rgb = np.zeros((H, W, 3), np.uint8); s.a = np.zeros((H, W), bool)
        s.part = np.full((H, W), '', object)
    def mask(s, fn):
        im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im); fn(d); return np.array(im) > 0
    def shade(s, m, ramp, bulge=1.0, lift=0.0, flat=0.0, name=''):
        """Paint mask m with a ramp. Height field from the distance to the mask edge."""
        if not m.any(): return
        d = distance_transform_edt(m)
        R = max(2.0, d.max())
        h = np.sqrt(np.clip(d / R, 0, 1)) * R * 0.9 * bulge
        h = gaussian_filter(h, 0.8)
        gy, gx = np.gradient(h)
        n = np.dstack([-gx, -gy, np.ones_like(h) * 1.0])
        n /= np.linalg.norm(n, axis=2, keepdims=True)
        lum = n @ LIGHT
        lum = (lum - 0.15) / 0.85
        # soft vertical falloff: lower parts slightly darker (ground bounce absent)
        yy = np.arange(H)[:, None] / H
        lum = lum * (1 - flat) + flat * 0.55 - yy * 0.10 + lift
        k = len(ramp)
        t = np.clip(lum, 0, 0.999) * (k - 1)
        bay = BAYER[np.arange(H)[:, None] % 4, np.arange(W)[None, :] % 4]
        idx = np.floor(t + (bay - 0.5) * 0.55).astype(int)
        idx = np.clip(idx, 0, k - 1)
        cols = np.array(ramp)[idx]
        s.rgb[m] = cols[m]; s.a[m] = True; s.part[m] = name
    def px(s, x, y, c):
        if 0 <= x < W and 0 <= y < H:
            s.rgb[y, x] = c if isinstance(c, tuple) else hx(c); s.a[y, x] = True
    def rect(s, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w): s.px(xx, yy, c)
    def outline(s):
        """Selective outline: edge pixels become a darkened version of themselves;
        the silhouette gets a coloured (not black) rim on the shadow side."""
        a = s.a.copy(); out = s.rgb.copy()
        for y in range(H):
            for x in range(W):
                if not a[y, x]: continue
                nb = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
                edge = [(X, Y) for X, Y in nb if not (0 <= X < W and 0 <= Y < H and a[Y, X])]
                if edge:
                    lit = any(X < x or Y < y for X, Y in edge)  # upper-left edges catch light
                    c = s.rgb[y, x].astype(float)
                    out[y, x] = (c * (0.55 if lit else 0.30)).astype(np.uint8) if not lit else np.minimum(255, c * 0.62 + 10).astype(np.uint8)
        # one-pixel dark contour outside the silhouette
        ring = np.zeros_like(a)
        for y in range(H):
            for x in range(W):
                if a[y, x]: continue
                if any(0 <= X < W and 0 <= Y < H and a[Y, X] for X, Y in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]):
                    ring[y, x] = True
        out[ring] = (10, 6, 14); s.a = a | ring; s.rgb = out
    def inner_lines(s, pairs):
        """Darken the boundary between two named parts (on the first part's side)."""
        for y in range(1, H - 1):
            for x in range(1, W - 1):
                p = s.part[y, x]
                for q in [s.part[y, x + 1], s.part[y + 1, x], s.part[y, x - 1], s.part[y - 1, x]]:
                    if (p, q) in pairs:
                        k = 0.72 if p in ('abs', 'pec') and q in ('abs', 'pec', 'torso') else 0.62 if p[:1] == 'f' and len(p) == 2 else 0.45
                        s.rgb[y, x] = (s.rgb[y, x] * k).astype(np.uint8); break

def taper(c, pts, w0, w1, ramp, lift=0.0, name='', bulge=0.9, prof=False):
    """A tapered ribbon along a polyline (fingers, flames, cloth tails)."""
    n = len(pts) - 1
    def fn(d):
        for i in range(n):
            (x0, y0), (x1, y1) = pts[i], pts[i + 1]
            for k in range(6):
                t = (i + k / 6) / n; w = w0 + (w1 - w0) * t
                if prof: w = w0 * math.sin(math.pi * (0.25 + 0.75 * t)) + 0.8
                x = x0 + (x1 - x0) * k / 6; y = y0 + (y1 - y0) * k / 6
                d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=1)
    m = c.mask(fn); c.shade(m, ramp, bulge=bulge, lift=lift, name=name); return m

def flame(c, x0, y0, length, amp, phase, w, lift=0.2, ramp=None):
    FR = ramp or RAMP['fire']
    """A tongue of ghostfire: smooth S-curve, widest low, curling to a point; banded core-to-edge."""
    best = {}
    for k in range(length * 2):
        t = k / (length * 2); y = y0 - t * length
        x = x0 + math.sin(t * 4.2 + phase) * amp * (0.35 + t) + (t ** 2) * amp * 0.8 * (1 if math.sin(phase) > 0 else -1)
        ww = w * math.sin(math.pi * (0.18 + 0.82 * t)) ** 0.8 * (1 - t * 0.35) + 0.5
        for yy in range(int(y - ww), int(y + ww) + 1):
            for xx in range(int(x - ww), int(x + ww) + 1):
                dd = math.hypot(xx - x, (yy - y) * 1.3) / ww
                if dd <= 1 and (best.get((xx, yy), 9) > dd): best[(xx, yy)] = dd
    for (xx, yy), dd in best.items():
        if 0 <= xx < W and 0 <= yy < H:
            col = FR[4] if dd < .28 else FR[3] if dd < .55 else FR[2] if dd < .82 else FR[1]
            if .5 < dd < .6 and (xx + yy) % 2: col = FR[2]
            c.px(xx, yy, col); c.part[yy, xx] = 'fire'

def muscle(c, box, lift, name, base_mask=None):
    m = c.mask(lambda d: d.ellipse(box, fill=1))
    if base_mask is not None: m &= base_mask
    c.shade(m, RAMP['skin'], bulge=1.25, lift=lift, name=name)

def paint(fr):
    c = Canvas(); f = fr
    sway = 1 if f else 0

    # ghostfire ribbons behind the figure
    flame(c, 10, 108, 56, 10, 0.4 + f * 0.8, 6)
    flame(c, 91, 108, 60, 9, 2.2 + f * 0.8, 6)
    flame(c, 6, 76, 26, 5, 4.0 + f, 4)

    # cloak
    def cloak(d):
        hem = [(6 + i * 5.3, 104 + (3 if (i + f) % 2 else -2) + (i % 3)) for i in range(17)]
        d.polygon([(30, 30), (22, 46), (14, 66), (8, 88), (4, 104)] + hem + [(94, 98), (92, 74), (88 + sway, 54), (80, 40), (66, 30)], fill=1)
    m_cloak = c.mask(cloak)
    c.shade(m_cloak, RAMP['cloak'], bulge=0.55, lift=0.05, name='cloak')
    for x0, x1, y0 in [(20, 12, 52), (27, 22, 58), (72, 80, 50), (82, 90, 62), (66, 68, 72)]:
        for y in range(y0, 104):
            t = (y - y0) / (104 - y0); x = int(round(x0 + (x1 - x0) * t))
            if m_cloak[y, x]: c.px(x, y, RAMP['cloak'][1]); c.px(x - 1, y, RAMP['cloak'][4] if y % 3 else RAMP['cloak'][3])
    m_lin = c.mask(lambda d: d.polygon([(30, 34), (24, 50), (20, 72), (18, 100), (26, 100), (28, 76), (32, 54), (36, 38)], fill=1)) & m_cloak
    c.shade(m_lin, RAMP['lining'], bulge=0.4, name='lining')
    m_lin2 = c.mask(lambda d: d.polygon([(64, 34), (70, 50), (74, 76), (76, 100), (68, 100), (66, 74), (62, 52), (60, 38)], fill=1)) & m_cloak
    c.shade(m_lin2, RAMP['lining'], bulge=0.4, lift=-0.1, name='lining')

    # baggy trousers gathered at the ankle
    m_legL = c.mask(lambda d: d.polygon([(37, 66), (48, 66), (48, 78), (47, 92), (44, 100), (38, 100), (34, 90), (33, 78)], fill=1))
    m_legR = c.mask(lambda d: d.polygon([(48, 66), (59, 66), (63, 78), (62, 90), (58, 100), (52, 100), (49, 92), (48, 78)], fill=1))
    c.shade(m_legL, RAMP['cloth'], bulge=1.0, lift=0.10, name='legL')
    c.shade(m_legR, RAMP['cloth'], bulge=1.0, lift=-0.04, name='legR')
    for (x0, y0, x1, y1) in [(36, 72, 40, 88), (44, 70, 45, 90), (52, 70, 51, 90), (58, 72, 56, 88)]:  # cloth folds
        for k in range(0, 17):
            t = k / 16; x = int(round(x0 + (x1 - x0) * t)); y = int(round(y0 + (y1 - y0) * t))
            if c.part[y, x] in ('legL', 'legR'): c.px(x, y, RAMP['cloth'][1]); c.px(x - 1, y, RAMP['cloth'][4])
    m_cuff = c.mask(lambda d: [d.rectangle([38, 97, 45, 100], fill=1), d.rectangle([51, 97, 58, 100], fill=1)])
    c.shade(m_cuff, RAMP['gold'], bulge=0.8, lift=0.05, name='cuff')
    m_boot = c.mask(lambda d: [d.polygon([(38, 100), (46, 100), (46, 106), (30, 107), (32, 103)], fill=1),
                               d.polygon([(51, 100), (59, 100), (61, 107), (47, 107), (49, 103)], fill=1)])
    c.shade(m_boot, RAMP['boot'], bulge=0.8, lift=0.1, name='boot')
    c.px(30, 106, RAMP['metal'][5]); c.px(47, 106, RAMP['metal'][5])

    # back shoulder (our right); the arm itself is drawn later, over the staff
    muscle(c, [58, 28, 70, 40], -0.05, 'armB')

    # torso: V-shaped, gaunt, with sculpted muscle masses
    m_torso = c.mask(lambda d: d.polygon([(30, 32), (66, 32), (63, 42), (58, 54), (57, 67), (39, 67), (38, 54), (33, 42)], fill=1))
    c.shade(m_torso, RAMP['skin'], bulge=0.9, lift=0.16, name='torso')
    muscle(c, [33, 32, 48, 44], 0.32, 'pec', m_torso)
    muscle(c, [48, 32, 63, 44], 0.10, 'pec', m_torso)
    for i, y in enumerate((45, 51, 57)):
        muscle(c, [40, y, 48, y + 6], 0.30 - i * 0.05, 'abs', m_torso)
        muscle(c, [48, y, 56, y + 6], 0.10 - i * 0.05, 'abs', m_torso)
    for k, y in enumerate((44, 47, 50)):  # serratus / ribs at the flanks
        for x in range(35 + k, 39 + k): c.px(x, y - (x - 35 - k) // 2, RAMP['skin'][1])
        for x in range(58 - k, 62 - k): c.px(x, y - (61 - k - x) // 2, RAMP['skin'][0])
    for x, y in [(36, 36), (37, 35), (38, 35)]: c.px(x, y, RAMP['skin'][6])  # specular on the lit pec
    c.px(48, 63, RAMP['skin'][0])

    # sash, tails, buckle
    m_sash = c.mask(lambda d: d.polygon([(37, 62), (59, 62), (60, 69), (36, 69)], fill=1))
    c.shade(m_sash, RAMP['cloak'], bulge=0.9, lift=0.05, name='sash')
    for x in range(37, 60): c.px(x, 62, RAMP['gold'][4]); c.px(x, 69, RAMP['gold'][2])
    taper(c, [(43, 69), (42 + sway, 78), (40 + sway, 88)], 5, 3, RAMP['cloak'], lift=0.1, name='tail')
    taper(c, [(48, 69), (49 + sway, 77), (48 + sway, 84)], 4, 3, RAMP['cloak'], lift=-0.05, name='tail')
    c.rect(44, 63, 6, 6, RAMP['gold'][4]); c.rect(45, 64, 4, 4, RAMP['gold'][1]); c.rect(46, 65, 2, 2, RAMP['fire'][3]); c.px(44, 63, RAMP['gold'][5])

    # high collar behind the head
    m_col = c.mask(lambda d: d.polygon([(28, 36), (24, 18), (30, 21), (30, 8), (37, 20), (41, 26), (55, 26), (59, 20), (66, 8), (66, 21), (72, 18), (68, 36)], fill=1))
    c.shade(m_col, RAMP['cloak'], bulge=0.7, lift=0.15, name='collar')
    m_colin = c.mask(lambda d: d.polygon([(35, 33), (33, 20), (40, 26), (56, 26), (63, 20), (61, 33)], fill=1)) & m_col
    c.shade(m_colin, RAMP['lining'], bulge=0.5, name='collarin')

    # staff, held upright in front of the right shoulder with both hands, padlock head
    sx = 70
    m_staff = c.mask(lambda d: d.rectangle([sx - 1, 16, sx + 1, 108], fill=1))
    c.shade(m_staff, RAMP['wood'], bulge=0.8, lift=0.15, name='staff')
    for y in (24, 70, 84, 98):
        c.rect(sx - 2, y, 5, 2, RAMP['metal'][2]); c.rect(sx - 2, y, 5, 1, RAMP['metal'][5]); c.px(sx - 2, y + 1, RAMP['metal'][1])
    m_shk = c.mask(lambda d: d.arc([sx - 5, 1, sx + 5, 13], 180, 360, fill=1, width=3))
    c.shade(m_shk, RAMP['metal'], bulge=0.8, lift=0.2, name='lock')
    m_lock = c.mask(lambda d: d.rounded_rectangle([sx - 7, 6, sx + 7, 18], 2, fill=1))
    c.shade(m_lock, RAMP['metal'], bulge=1.0, lift=0.0, name='lock')
    c.rect(sx - 3, 9, 7, 7, RAMP['gold'][3]); c.rect(sx - 3, 9, 7, 1, RAMP['gold'][5]); c.rect(sx - 3, 15, 7, 1, RAMP['gold'][1])
    kg = RAMP['fire'][5 if f else 4]
    c.rect(sx - 1, 10, 3, 2, RAMP['fire'][1]); c.px(sx, 10, kg); c.px(sx, 11, kg); c.rect(sx, 12, 1, 3, RAMP['fire'][2]); c.px(sx, 13, kg)
    for x, y in [(sx - 6, 7), (sx + 6, 7), (sx - 6, 17), (sx + 6, 17)]: c.px(x, y, RAMP['metal'][6])
    for i in range(8):  # ghostfire leaking from the keyhole
        a2 = i * 0.9 + f * 1.6
        c.px(int(round(sx + math.cos(a2) * 2)), int(round(4 - i * 0.6 + math.sin(a2))), RAMP['fire'][min(5, 2 + (i % 4))])


    # neck and head (bigger, gaunt, jaw jutting toward the front)
    m_neck = c.mask(lambda d: d.polygon([(42, 24), (54, 24), (56, 34), (40, 34)], fill=1))
    c.shade(m_neck, RAMP['skin'], bulge=0.9, lift=0.02, name='neck')
    for y in range(26, 33): c.px(44 + (y - 26) // 3, y, RAMP['skin'][1])  # neck tendon
    m_head = c.mask(lambda d: d.polygon([(40, 7), (47, 2), (55, 5), (58, 13), (57, 21), (53, 28), (47, 31), (41, 29), (37, 23), (37, 13)], fill=1))
    c.shade(m_head, RAMP['skin'], bulge=1.15, lift=0.06, name='head')
    for pts, lift in [([(37, 13), (29, 8), (36, 19)], 0.1), ([(58, 13), (65, 7), (57, 19)], -0.12)]:
        m_ear = c.mask(lambda d, p=pts: d.polygon(p, fill=1)); c.shade(m_ear, RAMP['skin'], bulge=0.7, lift=lift, name='ear')
    K0, K1 = RAMP['skin'][0], RAMP['skin'][1]
    for x in range(38, 56): c.px(x, 14, K1)                           # brow shadow
    for x in range(39, 45): c.px(x, 13, RAMP['skin'][5])               # lit brow
    for x in range(49, 54): c.px(x, 13, RAMP['skin'][4])
    for x, y in [(39, 20), (40, 21), (41, 21)]: c.px(x, y, RAMP['skin'][5])  # cheekbone
    for x, y in [(52, 20), (53, 21)]: c.px(x, y, RAMP['skin'][3])
    for x, y in [(40, 23), (41, 24), (53, 23), (52, 24)]: c.px(x, y, K1)     # hollow cheeks
    eye = (255, 246, 178) if f else (250, 230, 140)
    for x0 in (40, 49):
        c.rect(x0 - 1, 15, 6, 3, K0)
        c.rect(x0, 16, 4, 1, eye); c.px(x0 + (0 if x0 < 45 else 3), 16, (255, 255, 236)); c.px(x0 + 1, 15, (90, 70, 40))
    c.px(45, 17, K1); c.px(45, 18, K1); c.px(45, 19, RAMP['skin'][5]); c.px(46, 20, K0); c.px(44, 20, RAMP['skin'][4])  # nose
    for x in range(40, 53): c.px(x, 24, K0)                            # sewn mouth
    for x in range(40, 53, 2):
        c.px(x, 23, (200, 40, 64)); c.px(x + 1, 25, (200, 40, 64)); c.px(x + 1, 24, (110, 14, 30))
    c.px(46, 27, RAMP['skin'][4]); c.px(45, 28, RAMP['skin'][3]); c.px(47, 29, K1)
    for (bx, by, dx, dy, n) in [(40, 6, -3, -4, 6), (43, 4, -1, -4, 6), (47, 2, 0, -3, 4), (51, 3, 1, -4, 6), (55, 5, 3, -4, 6)]:
        for i in range(n):
            xi = int(round(bx + dx * i / 4 * (1 + i * .12))); yi = int(round(by + dy * i / 4))
            c.px(xi, yi, RAMP['metal'][6 if i == n - 1 else 4 if i > n // 2 else 3]); c.px(xi + 1, yi, RAMP['metal'][1])
        c.px(bx, by + 1, K0)

    def fist(name, cx, cy, lift, knuckles_left=True):
        """A fist wrapped around the staff: rounded block, four knuckle bumps toward us, a thumb over the fingers."""
        m = c.mask(lambda d: d.rounded_rectangle([cx - 5, cy - 4, cx + 5, cy + 4], 3, fill=1))
        c.shade(m, RAMP['skin'], bulge=1.2, lift=lift, name=name)
        kx = cx - 4 if knuckles_left else cx + 4
        for k in range(4):                                   # finger segments wrapped round the shaft
            y = cy - 3 + k * 2
            c.px(kx, y, RAMP['skin'][5]); c.px(kx + (1 if knuckles_left else -1), y, RAMP['skin'][4])
            for x in range(cx - 3, cx + 4): c.px(x, y + 1, RAMP['skin'][1]) if k < 3 else None
        for x in range(cx - 2, cx + 3): c.px(x, cy - 4, RAMP['skin'][5])       # thumb over the top
        c.px(cx + 2, cy - 5, RAMP['skin'][4]); c.px(cx + 3, cy - 4, RAMP['metal'][5])  # thumbnail
        c.px(kx - (1 if knuckles_left else -1), cy + 3, RAMP['metal'][6])          # a claw tip curling past the shaft
        c.px(kx - (1 if knuckles_left else -1), cy + 2, RAMP['metal'][4])

    # back arm: elbow out to the right, the upper hand high on the staff
    taper(c, [(64, 34), (73, 42), (76, 48)], 8, 7, RAMP['skin'], lift=-0.10, name='armB', bulge=1.1)
    taper(c, [(76, 48), (74, 42), (71, 38)], 7, 6, RAMP['skin'], lift=-0.02, name='armB2', bulge=1.1)
    m_brcB = c.mask(lambda d: d.polygon([(77, 44), (74, 47), (72, 43), (75, 40)], fill=1))
    c.shade(m_brcB, RAMP['gold'], bulge=0.9, lift=0.0, name='bracerB')
    fist('handB', sx, 36, 0.05, knuckles_left=True)

    # front arm: down from the shoulder, forearm crossing the belly to grip the staff lower down
    muscle(c, [26, 30, 40, 44], 0.30, 'armF')
    taper(c, [(33, 38), (34, 47), (38, 55)], 9, 8, RAMP['skin'], lift=0.22, name='armF', bulge=1.1)
    taper(c, [(38, 55), (50, 56), (63, 55)], 8, 7, RAMP['skin'], lift=0.26, name='fore', bulge=1.1)
    m_brc = c.mask(lambda d: d.polygon([(44, 52), (49, 52), (49, 59), (44, 59)], fill=1))
    c.shade(m_brc, RAMP['gold'], bulge=0.9, lift=0.12, name='bracer')
    c.px(45, 53, RAMP['gold'][5]); c.px(45, 54, RAMP['gold'][5])
    for x in range(52, 62, 3): c.px(x, 53, RAMP['skin'][5])            # tendons along the forearm
    fist('hand', sx, 55, 0.24, knuckles_left=True)


    # foreground flame licks at the hem
    flame(c, 24, 112, 14, 2, 0.5 + f, 7, lift=0.3)
    flame(c, 68, 112, 16, 2, 2.0 + f, 7, lift=0.3)

    c.inner_lines({('torso', 'sash'), ('pec', 'abs'), ('armF', 'pec'), ('armF', 'torso'), ('head', 'neck'), ('neck', 'collarin'),
                   ('legL', 'legR'), ('armB', 'cloak'), ('cloak', 'lining'), ('collar', 'head'), ('hand', 'fore'), ('fore', 'hand'), ('bracer', 'fore'), ('fore', 'abs'), ('fore', 'torso'), ('fore', 'sash'), ('handB', 'armB2'), ('armB2', 'handB'), ('bracerB', 'armB'), ('armB', 'armB2'), ('armB2', 'collar'), ('abs', 'abs'), ('pec', 'pec'), ('abs', 'torso'), ('pec', 'abs'), ('armB', 'pec')})
    c.outline()
    # magenta rim light on the shadow (right) side, cast by the ghostfire behind
    for y in range(H):
        for x in range(1, W - 1):
            if c.a[y, x] and not c.a[y, x + 1] if x + 1 < W else False: pass
    rim = (238, 92, 208)
    for y in range(H):
        for x in range(2, W - 1):
            if c.a[y, x + 1] and c.a[y, x] and not (x + 2 < W and c.a[y, x + 2]) and c.part[y, x] in ('torso', 'pec', 'abs', 'armB', 'head', 'ear', 'neck', 'cloak', 'collar', 'legR', 'handB', 'armB2', 'staff', 'lock'):
                v = c.rgb[y, x].astype(float); c.rgb[y, x] = (v * 0.5 + np.array(rim) * 0.5).astype(np.uint8)
    img = np.zeros((H, W, 4), np.uint8); img[..., :3] = c.rgb; img[..., 3] = c.a * 255
    return img

def encode(frames):
    CH = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+,-/:;<=>?@[]^_{|}~'
    # reduce colours: median-cut over both frames to <= len(CH)
    allpx = np.concatenate([f[f[..., 3] > 0][:, :3] for f in frames])
    im = Image.fromarray(allpx.reshape(1, -1, 3).astype(np.uint8))
    q = im.quantize(colors=len(CH), method=Image.Quantize.MEDIANCUT)
    pal = np.array(q.getpalette()[:len(CH) * 3]).reshape(-1, 3)
    out = []
    for f in frames:
        rows = []
        for y in range(f.shape[0]):
            r = ''
            for x in range(f.shape[1]):
                if f[y, x, 3] == 0: r += '.'; continue
                d = ((pal - f[y, x, :3].astype(int)) ** 2).sum(1); r += CH[int(d.argmin())]
            rows.append(r)
        out.append(rows)
    used = sorted({ch for rows in out for r in rows for ch in r if ch != '.'})
    return {ch: '#%02x%02x%02x' % tuple(pal[CH.index(ch)]) for ch in used}, out

def half(img):
    """Map sprite: 2x downsample keeping the outline crisp (alpha by majority, colour by the brightest-but-not-highlight pixel)."""
    h, w = img.shape[0] // 2, img.shape[1] // 2
    out = np.zeros((h, w, 4), np.uint8)
    for y in range(h):
        for x in range(w):
            blk = img[y * 2:y * 2 + 2, x * 2:x * 2 + 2].reshape(-1, 4)
            on = blk[blk[:, 3] > 0]
            if len(on) >= 2:
                lum = on[:, :3].sum(1); out[y, x] = on[np.argsort(lum)[len(on) // 2]]
    return out

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    big = [paint(0), paint(1)]
    small = [half(b) for b in big]
    pb, fb = encode(big); ps, fs = encode(small)
    json.dump({'big': {'pal': pb, 'f': fb}, 'small': {'pal': ps, 'f': fs}}, open(os.path.join(here, 'yewen.json'), 'w'))
    for i, b in enumerate(big):
        Image.fromarray(b).resize((W * 5, H * 5), Image.NEAREST).save('/home/claude/yewen_paint_%d.png' % i)
    print('ok', len(pb), 'colours')
