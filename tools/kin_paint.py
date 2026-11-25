"""The Yewen's five summoned creatures, hand-built at native battle resolution with the same
method as tools/yewen_paint.py: per-part masks with their own colour ramps, height-field
lighting from the upper left, ordered-dither banding, selective outlines, and details placed
pixel by pixel. Output: tools/kin.json (battle sprite + half-size sprite, two frames each)."""
import json, math, os
import numpy as np
import yewen_paint as yp
from yewen_paint import Canvas, taper, hx

R = {
    'mourn':  ['#0c1018', '#1a2232', '#2a3650', '#3c4c6c', '#566a8c', '#7a90b0', '#a8bcd6'],
    'mournk': ['#06080e', '#0e1420', '#182236'],
    'cloud':  ['#2a3040', '#444c60', '#626c82', '#8a94a8', '#b4bccb', '#dfe4ec'],
    'tear':   ['#2a5a8c', '#4a8ac8', '#8ac4f4', '#d0ecff', '#ffffff'],
    'pale':   ['#3a3c4a', '#5a5e70', '#7e8296', '#a6aabc', '#ccd0de'],
    'rage':   ['#1c0404', '#3c0a08', '#62140e', '#8a2216', '#b23a22', '#d85c36', '#f48c5a'],
    'fire':   ['#4a0c04', '#8a1e06', '#d0460e', '#f8822a', '#ffc860', '#fff4c0'],
    'shadow': ['#05040a', '#0c0a16', '#161226', '#221c38', '#30284c', '#443a64'],
    'navy':   ['#06080e', '#0e1426', '#18223e', '#243256', '#344670', '#4a5e8e'],
    'denim':  ['#0a0c12', '#181c26', '#262c3a', '#363e50', '#4a5468'],
    'mask':   ['#4a4440', '#7a726a', '#a8a094', '#cec6b8', '#ebe4d6', '#fbf8f0'],
    'suit':   ['#08080a', '#141418', '#212128', '#30303a', '#42424e', '#585866'],
    'shirt':  ['#5a5a5e', '#8a8a90', '#b4b4ba', '#d8d8dc', '#f0f0f2'],
    'tskin':  ['#3a2218', '#5e3a28', '#86563c', '#a8745a', '#c89478', '#e4b89c'],
    'hair':   ['#0e0a08', '#1e1610', '#2e2218', '#423024', '#5a4434'],
    'slate':  ['#08090a', '#121416', '#1c1f22', '#272b2f', '#33383d'],
    'wood':   ['#140a06', '#2c180c', '#482812', '#68401c', '#8c5a2a', '#b07a40'],
    'ruler':  ['#3a2810', '#6a4a20', '#9a7034', '#c49a52', '#e2c07a'],
    'boot':   ['#06050a', '#121016', '#1e1a22', '#2c2832', '#3e3846'],
    'sneak':  ['#4a4a52', '#7a7a84', '#a8a8b2', '#d4d4dc', '#f2f2f6'],
}
R = {k: [hx(c) for c in v] for k, v in R.items()}

def setsize(w, h): yp.W, yp.H = w, h

def blob(c, ramp, fn, bulge=1.0, lift=0.0, name=''):
    m = c.mask(fn); c.shade(m, ramp, bulge=bulge, lift=lift, name=name); return m

def finish(c, seams, rim=None, rimparts=()):
    c.inner_lines(set(seams)); c.outline()
    if rim:
        for y in range(yp.H):
            for x in range(2, yp.W - 2):
                if c.a[y, x] and c.a[y, x + 1] and not c.a[y, x + 2] and c.part[y, x] in rimparts:
                    v = c.rgb[y, x].astype(float); c.rgb[y, x] = (v * 0.55 + np.array(rim) * 0.45).astype(np.uint8)
    img = np.zeros((yp.H, yp.W, 4), np.uint8); img[..., :3] = c.rgb; img[..., 3] = c.a * 255
    return img

# ------------------------------------------------------------------ weñangkün (sorrow)
def wenangkun(f):
    setsize(56, 72); c = Canvas()
    # its own rain cloud
    blob(c, R['cloud'], lambda d: [d.ellipse([8, 2, 26, 16], fill=1), d.ellipse([20, 0, 40, 15], fill=1), d.ellipse([34, 4, 50, 16], fill=1), d.rectangle([12, 9, 46, 16], fill=1)], bulge=0.7, lift=0.1, name='cloud')
    for k, x in enumerate(range(13, 47, 5)):            # rain, offset per frame
        y0 = 18 + ((k * 7 + f * 5) % 14)
        for i in range(4): c.px(x - i // 3, y0 + i, R['tear'][2 if i < 2 else 1])
        c.px(x, y0, R['tear'][3])
    # long mourning cloak, kneeling, spreading on the ground
    blob(c, R['mourn'], lambda d: d.polygon([(28, 26), (19, 32), (13, 48), (6, 66), (12, 70), (44, 70), (50, 66), (43, 48), (37, 32)], fill=1), bulge=0.8, lift=0.05, name='cloak')
    for x0, x1 in [(22, 14), (27, 24), (33, 36), (38, 44)]:  # long folds
        for y in range(40, 69):
            t = (y - 40) / 29; x = int(round(x0 + (x1 - x0) * t))
            if c.part[y, x] == 'cloak': c.px(x, y, R['mourn'][1]); c.px(x - 1, y, R['mourn'][4] if y % 3 else R['mourn'][3])
    # hood bowed forward, the face buried in the hands
    blob(c, R['mourn'], lambda d: d.polygon([(28, 20), (20, 24), (17, 34), (20, 42), (36, 42), (39, 34), (36, 24)], fill=1), bulge=1.0, lift=0.12, name='hood')
    blob(c, R['mournk'], lambda d: d.ellipse([21, 29, 35, 43], fill=1), bulge=0.6, lift=0.0, name='void')
    # two pale hands pressed over the face
    for (x0, lift) in [(22, 0.25), (29, 0.08)]:
        blob(c, R['pale'], lambda d, x0=x0: d.rounded_rectangle([x0, 32, x0 + 6, 41], 2, fill=1), bulge=1.1, lift=lift, name='hand')
        for k in range(3): c.px(x0 + 1 + k * 2, 33, R['pale'][1])     # finger gaps
    # tears leaking between the fingers
    for (x, y0) in [(28, 41), (24, 42)]:
        for i in range(6 + f * 2): c.px(x, y0 + i, R['tear'][3 if i < 2 else 2])
    c.px(28, 47 + f * 2, R['tear'][4])
    return finish(c, [('hood', 'cloak'), ('hand', 'void'), ('hand', 'hand'), ('void', 'hood')], rim=(150, 200, 255), rimparts=('cloak', 'hood', 'cloud'))

# ------------------------------------------------------------------ illkun (anger)
def illkun(f):
    setsize(64, 70); c = Canvas()
    for (x0, ph, w) in [(14, 0.2, 7), (50, 1.9, 7), (32, 3.3, 9)]:    # fire pouring off its back
        yp.flame(c, x0, 40, 34, 4, ph + f * 0.9, w, ramp=R['fire'])
    blob(c, R['rage'], lambda d: [d.polygon([(18, 50), (28, 50), (27, 64), (16, 64)], fill=1), d.polygon([(36, 50), (46, 50), (48, 64), (37, 64)], fill=1)], bulge=1.0, lift=-0.05, name='legs')
    blob(c, R['boot'], lambda d: [d.rectangle([14, 63, 29, 68], fill=1), d.rectangle([35, 63, 50, 68], fill=1)], bulge=0.8, lift=0.1, name='feet')
    # barrel torso and huge shoulders
    blob(c, R['rage'], lambda d: d.polygon([(10, 26), (54, 26), (50, 40), (44, 52), (20, 52), (14, 40)], fill=1), bulge=1.0, lift=0.10, name='torso')
    for (bx, lift) in [((8, 20, 26, 36), 0.28), ((38, 20, 56, 36), 0.02)]:
        blob(c, R['rage'], lambda d, b=bx: d.ellipse(b, fill=1), bulge=1.3, lift=lift, name='delt')
    for (bx, lift) in [((18, 28, 32, 40), 0.30), ((32, 28, 46, 40), 0.08)]:
        blob(c, R['rage'], lambda d, b=bx: d.ellipse(b, fill=1), bulge=1.3, lift=lift, name='pec')
    for i, y in enumerate((41, 46)):
        blob(c, R['rage'], lambda d, y=y: d.ellipse([22, y, 32, y + 5], fill=1), bulge=1.2, lift=0.22 - i * .06, name='abs')
        blob(c, R['rage'], lambda d, y=y: d.ellipse([32, y, 42, y + 5], fill=1), bulge=1.2, lift=0.04 - i * .06, name='abs')
    # head low between the shoulders, heavy brow, burning eyes, a snarl
    blob(c, R['rage'], lambda d: d.polygon([(25, 14), (39, 14), (41, 24), (36, 30), (28, 30), (23, 24)], fill=1), bulge=1.1, lift=0.12, name='head')
    for x in range(24, 41): c.px(x, 18, R['rage'][1])
    for x in range(25, 31): c.px(x, 17, R['rage'][5])
    for x0 in (26, 34):
        c.rect(x0, 19, 4, 2, R['rage'][0]); c.rect(x0, 19, 4, 1, R['fire'][4]); c.px(x0 + (0 if x0 < 30 else 3), 19, R['fire'][5])
    for x in range(27, 37): c.px(x, 25 + (1 if 29 < x < 34 else 0), R['rage'][0])   # snarl, corners pulled down
    for x in range(28, 36): c.px(x, 26 + (1 if 29 < x < 34 else 0), (60, 10, 8))
    for (x, y) in [(28, 26), (35, 26)]: c.px(x, y, (240, 226, 200)); c.px(x, y + 1, (200, 186, 160))     # two fangs
    for (x, y) in [(26, 27), (37, 27)]: c.px(x, y, R['rage'][2])
    for k in range(4):                                  # steam off the scalp
        c.px(31 + (k % 2) - (1 if f else 0), 12 - k * 2, (190, 176, 176)); c.px(33 - (k % 2), 11 - k * 2, (150, 136, 136))
    # arms down, fists clenched at the thighs
    taper(c, [(12, 30), (9, 40), (10, 50)], 9, 8, R['rage'], lift=0.18, name='armL', bulge=1.1)
    taper(c, [(52, 30), (55, 40), (54, 50)], 9, 8, R['rage'], lift=-0.04, name='armR', bulge=1.1)
    for (cx, lift) in [(10, 0.22), (54, 0.0)]:
        blob(c, R['rage'], lambda d, cx=cx: d.rounded_rectangle([cx - 6, 48, cx + 6, 58], 3, fill=1), bulge=1.2, lift=lift, name='fist')
        for k in range(4): c.px(cx - 5 + k * 3, 50, R['rage'][5]); c.px(cx - 5 + k * 3, 51, R['rage'][2])
    return finish(c, [('pec', 'abs'), ('abs', 'abs'), ('pec', 'pec'), ('delt', 'pec'), ('head', 'pec'), ('armL', 'fist'), ('armR', 'fist'), ('torso', 'legs'), ('delt', 'armL'), ('delt', 'armR')],
                  rim=(255, 150, 60), rimparts=('torso', 'delt', 'armR', 'fist', 'head', 'legs'))

# ------------------------------------------------------------------ llükalfe (intimidation)
def llukalfe(f):
    setsize(60, 96); c = Canvas()
    # robe, widening, ragged hem dissolving
    def robe(d):
        hem = [(10 + i * 4, 92 + (3 if (i + f) % 2 else 0)) for i in range(11)]
        d.polygon([(30, 18), (20, 26), (16, 50), (10, 92)] + hem + [(50, 92), (44, 50), (40, 26)], fill=1)
    blob(c, R['shadow'], robe, bulge=0.7, lift=0.05, name='robe')
    for x0, x1 in [(24, 18), (30, 30), (36, 42)]:
        for y in range(40, 92):
            t = (y - 40) / 52; x = int(round(x0 + (x1 - x0) * t))
            if c.part[y, x] == 'robe': c.px(x, y, R['shadow'][0]); c.px(x - 1, y, R['shadow'][3])
    # long arms hanging past the knees, claws open
    taper(c, [(20, 26), (12, 44), (8, 64)], 6, 5, R['shadow'], lift=0.15, name='armL', bulge=1.0)
    taper(c, [(40, 26), (48, 44), (52, 64)], 6, 5, R['shadow'], lift=-0.05, name='armR', bulge=1.0)
    for (hx0, d) in [(8, -1), (52, 1)]:
        for k in range(4):
            pts = [(hx0, 64), (hx0 + d * (1 + k), 70 + k), (hx0 + d * (k - 1), 76 + k)]
            taper(c, pts, 2.6, 1.6, R['shadow'], lift=0.1, name='claw', bulge=0.8)
            c.px(hx0 + d * (k - 1), 76 + k, R['pale'][4])
    # long skull, leaning forward, two narrow white slits, a jagged grin
    blob(c, R['shadow'], lambda d: d.polygon([(30, 2), (39, 6), (42, 16), (38, 26), (30, 29), (22, 26), (18, 16), (21, 6)], fill=1), bulge=1.1, lift=0.18, name='head')
    for (x0, d) in [(22, 1), (33, -1)]:
        for k in range(6):
            y = 13 + (k * d + (0 if d > 0 else 5)) // 3
            c.px(x0 + k, y, (244, 244, 255)); c.px(x0 + k, y + 1, (150, 150, 180)) if k in (2, 3) else None
        c.px(x0 + 3, 13 + (2 if d < 0 else 1), (0, 0, 0)) if f else None
    for x in range(22, 39):
        y = 21 + (x % 2); c.px(x, y, (210, 206, 226)); c.px(x, 20, (0, 0, 0))
        if x % 2 == 0: c.px(x, 22, (0, 0, 0))
    for y in range(4, 24, 3): c.px(19 + (y % 2), y, (122, 74, 192))   # faint violet seep at the edge
    return finish(c, [('head', 'robe'), ('armL', 'robe'), ('armR', 'robe'), ('claw', 'armL'), ('claw', 'armR')], rim=(140, 90, 220), rimparts=('robe', 'head', 'armR'))

# ------------------------------------------------------------------ ayentufe (mockery, the bully)
def ayentufe(f):
    setsize(56, 74); c = Canvas()
    blob(c, R['denim'], lambda d: [d.polygon([(22, 46), (28, 46), (27, 66), (21, 66)], fill=1), d.polygon([(30, 46), (36, 46), (38, 66), (31, 66)], fill=1)], bulge=1.0, lift=0.0, name='legs')
    blob(c, R['sneak'], lambda d: [d.polygon([(19, 65), (28, 65), (28, 70), (16, 71)], fill=1), d.polygon([(30, 65), (39, 65), (41, 71), (30, 70)], fill=1)], bulge=0.8, lift=0.05, name='shoe')
    # school jacket, hunched, hands-on-hip swagger on one side
    blob(c, R['navy'], lambda d: d.polygon([(18, 24), (40, 24), (42, 38), (40, 48), (18, 48), (16, 38)], fill=1), bulge=1.0, lift=0.10, name='jacket')
    for y in range(26, 48): c.px(29, y, R['navy'][0]); c.px(30, y, R['navy'][4]) if y % 4 == 0 else None   # zip
    for x in range(18, 41): c.px(x, 40, R['navy'][1]); c.px(x, 39, (200, 170, 60) if 22 < x < 37 else R['navy'][4])  # school stripe
    # pointing arm, toward the hero (our left), finger out
    taper(c, [(19, 28), (12, 30), (6, 28)], 6, 5, R['navy'], lift=0.20, name='armL', bulge=1.0)
    blob(c, R['tskin'], lambda d: d.ellipse([1, 25, 8, 31], fill=1), bulge=1.1, lift=0.25, name='hand')
    for x in range(-2, 2): c.px(x + 1, 27, R['tskin'][4]); c.px(x + 1, 28, R['tskin'][2])
    # other arm hugging its belly with laughter
    taper(c, [(39, 28), (44, 36), (36, 40)], 6, 5, R['navy'], lift=-0.05, name='armR', bulge=1.0)
    blob(c, R['tskin'], lambda d: d.ellipse([32, 37, 38, 42], fill=1), bulge=1.1, lift=0.0, name='hand2')
    # hoodie hood behind the head
    blob(c, R['navy'], lambda d: d.ellipse([16, 4, 42, 30], fill=1), bulge=0.9, lift=0.05, name='hood')
    # cracked porcelain mask: empty eyes, a grin too wide, small sharp teeth
    blob(c, R['mask'], lambda d: d.ellipse([19, 6, 39, 28], fill=1), bulge=1.2, lift=0.20, name='mask')
    for ex in (24, 32):
        blob(c, [(6, 4, 8), (14, 10, 16), (22, 18, 26)], lambda d, ex=ex: d.ellipse([ex - 2, 12, ex + 2, 17], fill=1), bulge=0.5, name='eye')
        if f: c.px(ex, 14, (230, 40, 56))
    for x in range(21, 38):
        y = 22 - int(round(((x - 29) / 8.0) ** 2 * -2.2)) - 2
        c.px(x, y, (10, 8, 14)); c.px(x, y + 1, (120, 20, 30)) if 22 < x < 36 else None
        if x % 2 and 22 < x < 36: c.px(x, y + 1, (236, 230, 220))
    for (x, y) in [(31, 6), (31, 7), (32, 8), (32, 9), (33, 10), (34, 10)]: c.px(x, y, R['mask'][1])   # crack
    # "ja, ja" sparks of red laughter
    for k, (x, y) in enumerate([(44, 8), (48, 4), (46, 14)]):
        if (k + f) % 2 == 0: c.px(x, y, (230, 40, 56)); c.px(x + 1, y - 1, (230, 40, 56)); c.px(x + 2, y, (150, 20, 30))
    return finish(c, [('mask', 'hood'), ('eye', 'mask'), ('armL', 'jacket'), ('armR', 'jacket'), ('hand', 'armL'), ('legs', 'jacket'), ('hood', 'jacket')],
                  rim=(220, 60, 80), rimparts=('jacket', 'hood', 'armR', 'legs'))

# ------------------------------------------------------------------ illamtufe kimeltulelu (the teacher who banned the language)
def profe(f):
    setsize(64, 96); c = Canvas()
    # slate chalkboard on a dark easel, the forbidden word scrawled and struck through in chalk
    blob(c, R['wood'], lambda d: [d.rectangle([36, 24, 63, 46], fill=1), d.line([(39, 46), (37, 92)], fill=1, width=2), d.line([(60, 46), (62, 92)], fill=1, width=2)], bulge=0.7, lift=0.05, name='easel')
    blob(c, R['slate'], lambda d: d.rectangle([38, 26, 61, 44], fill=1), bulge=0.4, lift=0.15, name='board')
    chalk = (226, 228, 216)
    word = [(40, 32), (41, 31), (42, 32), (43, 31), (44, 32), (46, 32), (47, 31), (48, 32), (50, 31), (50, 32), (51, 31), (53, 32), (54, 31), (55, 32), (57, 31), (58, 32), (59, 31)]
    for x, y in word: c.px(x, y, chalk); c.px(x, y + 1, (150, 152, 144))
    for x in range(39, 61): c.px(x, 34 - (x - 39) // 7, chalk)      # one hard chalk line through it
    c.rect(41, 38, 6, 1, (170, 172, 164)); c.rect(49, 39, 8, 1, (150, 152, 144))   # smudge
    c.rect(44, 44, 8, 1, R['wood'][4]); c.rect(45, 43, 2, 1, chalk)  # ledge with chalk
    # long dark skirt suit, tall narrow proportions
    blob(c, R['suit'], lambda d: d.polygon([(18, 56), (36, 56), (38, 88), (16, 88)], fill=1), bulge=0.8, lift=0.0, name='skirt')
    for x0 in (22, 27, 32):
        for y in range(60, 88): c.px(x0 + (y - 60) // 14, y, R['suit'][1])
    blob(c, R['boot'], lambda d: [d.polygon([(19, 88), (25, 88), (25, 93), (16, 93)], fill=1), d.polygon([(29, 88), (35, 88), (37, 93), (29, 93)], fill=1)], bulge=0.8, lift=0.1, name='shoe')
    blob(c, R['suit'], lambda d: d.polygon([(17, 30), (37, 30), (38, 46), (36, 58), (18, 58), (16, 46)], fill=1), bulge=1.0, lift=0.12, name='jacket')
    blob(c, R['shirt'], lambda d: d.polygon([(24, 30), (30, 30), (28, 40), (26, 40)], fill=1), bulge=0.8, lift=0.15, name='shirt')
    for y in range(31, 38): c.px(27, y, R['suit'][1])                # dark tie, narrow
    for (x, y) in [(22, 34), (23, 37), (31, 34), (30, 37)]: c.px(x, y, R['suit'][4])   # lapels
    c.px(23, 46, R['suit'][5]); c.px(23, 50, R['suit'][5])           # buttons
    # neck and a long, narrow head: stern, thin-lipped, hair pulled into a tight bun, glasses catching the light
    blob(c, R['tskin'], lambda d: d.rectangle([24, 24, 30, 31], fill=1), bulge=0.9, lift=-0.1, name='neck')
    blob(c, R['tskin'], lambda d: d.polygon([(27, 8), (32, 10), (33, 18), (31, 25), (27, 27), (23, 25), (21, 18), (22, 10)], fill=1), bulge=1.1, lift=0.10, name='face')
    blob(c, R['hair'], lambda d: [d.polygon([(21, 14), (21, 9), (25, 6), (30, 6), (33, 9), (33, 13), (30, 10), (24, 10)], fill=1), d.ellipse([28, 2, 36, 9], fill=1)], bulge=1.0, lift=0.15, name='hair')
    for x in (23, 24, 25, 30, 31, 32): c.px(x, 15, (40, 40, 46))     # glasses frames
    c.rect(23, 16, 3, 2, (196, 220, 236) if f else (150, 176, 196)); c.rect(30, 16, 3, 2, (196, 220, 236) if f else (150, 176, 196))
    c.px(23, 16, (255, 255, 255)); c.px(30, 16, (255, 255, 255)); c.rect(26, 16, 4, 1, (40, 40, 46))
    for x in range(24, 31): c.px(x, 14, R['hair'][1])                # brows drawn tight
    c.px(27, 19, R['tskin'][1]); c.px(27, 20, R['tskin'][4])         # nose
    for x in range(25, 30): c.px(x, 22, R['tskin'][0])               # thin lips, pressed flat
    c.px(24, 23, R['tskin'][1]); c.px(30, 23, R['tskin'][1])
    # arms folded hard across the chest; the ruler tucked under one arm, pointing down
    taper(c, [(22, 43), (14, 50), (8, 56)], 3.2, 3.0, R['ruler'], lift=0.15, name='ruler', bulge=0.8)
    for k in range(3): c.px(19 - k * 4, 46 + k * 3, R['ruler'][0])
    taper(c, [(18, 32), (15, 38), (17, 44)], 6, 6, R['suit'], lift=0.10, name='armL', bulge=1.0)
    taper(c, [(36, 32), (39, 38), (37, 44)], 6, 6, R['suit'], lift=-0.05, name='armR', bulge=1.0)
    # back forearm (right) runs under, front forearm (left) lies on top
    taper(c, [(37, 43), (29, 41), (21, 39)], 5.5, 5, R['suit'], lift=-0.02, name='armR', bulge=1.0)
    blob(c, R['tskin'], lambda d: d.ellipse([18, 37, 23, 41], fill=1), bulge=1.1, lift=0.05, name='hand2')
    taper(c, [(17, 44), (25, 43), (33, 41)], 6, 5.5, R['suit'], lift=0.14, name='armL', bulge=1.05)
    blob(c, R['tskin'], lambda d: d.ellipse([32, 38, 37, 42], fill=1), bulge=1.1, lift=0.12, name='hand')
    for x in range(19, 34): c.px(x, 46 - (x - 19) // 6, R['suit'][1])   # crease where the arms cross
    c.rect(16, 44, 2, 1, R['shirt'][3]); c.rect(36, 42, 2, 1, R['shirt'][3])  # cuffs
    return finish(c, [('face', 'hair'), ('face', 'neck'), ('neck', 'jacket'), ('jacket', 'skirt'), ('armL', 'jacket'), ('armR', 'jacket'), ('hand', 'ruler'), ('shirt', 'jacket'), ('board', 'easel')],
                  rim=(200, 200, 215), rimparts=('jacket', 'skirt', 'armR'))

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__)); out = {}
    from PIL import Image
    for name, fn in [('wenangkun', wenangkun), ('illkun', illkun), ('llukalfe', llukalfe), ('ayentufe', ayentufe), ('profe', profe)]:
        big = [fn(0), fn(1)]; small = [yp.half(b) for b in big]
        pb, fb = yp.encode(big); ps, fs = yp.encode(small)
        out[name] = {'big': {'pal': pb, 'f': fb}, 'small': {'pal': ps, 'f': fs}}
        Image.fromarray(big[0]).save('/home/claude/kin_%s.png' % name)
    json.dump(out, open(os.path.join(here, 'kin.json'), 'w'))
    print('ok')
