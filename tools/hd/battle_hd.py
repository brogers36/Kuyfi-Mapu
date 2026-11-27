"""HD battle preview: the beach (Lafken rüpü) with two laftrache and Llanka, all at 3x (768x672)."""
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter
from hd import Sprite, PAL, E, R, poly, U, I, NOT, hx, ramp

W, H = 768, 672
SKY = ramp('#2a4c9a', '#3a62b4', '#4c7ccc', '#6496dc', '#82b0ea', '#a6caf4')
SNOW = ramp('#6a7898', '#8c9ab8', '#b4c0d8', '#d8e0f0', '#f4f8ff')
ROCKB = ramp('#1e2236', '#2e3450', '#424a6c', '#5a6488', '#7a84a6')
SEA = ramp('#0a2a5a', '#0e3c78', '#145298', '#1e6cb6', '#3a8ed0', '#68b2e4', '#a6d6f2')
SAND = ramp('#6a4a26', '#8c6636', '#ae8448', '#c8a060', '#dcba7c', '#ecd29c')
STONE = ramp('#16141c', '#26242e', '#3a3844', '#52505e', '#6e6c7a', '#8e8c9a')
DRIFT = ramp('#3a2a1c', '#5a4430', '#7a6046', '#9a7e60', '#b89c7c', '#d4bc9c')
GRN = ramp('#14261e', '#1e3a2c', '#2a4e3a', '#3a664a', '#4e805c', '#6a9c72')
BEARD = ramp('#7a7480', '#9a96a2', '#bcb8c4', '#d8d6de', '#f0eef4', '#ffffff')

def background():
    img = np.zeros((H, W, 3))
    yy, xx = np.mgrid[0:H, 0:W]
    # sky: clean horizontal bands
    B4 = (np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) + .5) / 16
    bay = np.tile(B4, (H // 4 + 1, W // 4 + 1))[:H, :W]
    t = np.clip(yy / 250, 0, 1) * (len(SKY) - 1)
    i0 = np.floor(t).astype(int); f = t - i0
    idx = np.clip(i0 + (f > bay), 0, len(SKY) - 1)
    img[:] = np.array(SKY)[idx]
    # clouds: flat-shaded puffs, lit from above
    def cloud(cx, cy, s):
        for (dx, dy, r) in ((0, 0, 1), (-1.1, .25, .75), (1.1, .25, .8), (-.5, -.35, .7), (.6, -.4, .65)):
            m = ((xx - cx - dx * 28 * s) / (28 * s * r)) ** 2 + ((yy - cy - dy * 22 * s) / (20 * s * r)) ** 2 <= 1
            img[m & (yy > cy + 6 * s)] = hx('#c8d8ee'); img[m & (yy <= cy + 6 * s)] = hx('#f4f8ff')
    cloud(90, 70, 1.3); cloud(510, 95, 1.1); cloud(330, 35, .8)
    # volcano with snow, ridges lit from the left
    vol = (np.abs(xx - 270) < (yy - 92) * 1.55 + 10) & (yy > 92) & (yy < 300)
    img[vol] = ROCKB[2]
    img[vol & (xx < 270 - (yy - 92) * .3)] = ROCKB[3]
    img[vol & (xx > 270 + (yy - 92) * .5)] = ROCKB[1]
    snowl = vol & (yy < 150 + 10 * np.sin(xx * .09) + 8 * np.sin(xx * .23))
    img[snowl] = SNOW[3]; img[snowl & (xx < 262)] = SNOW[4]; img[snowl & (xx > 285)] = SNOW[2]
    for k in range(-5, 6):                              # gullies
        x0 = 270 + k * 14
        for y in range(150, 290, 1):
            x = int(x0 + k * (y - 150) * .9)
            if 0 <= x < W and vol[y, x]: img[y, x] = ROCKB[0] if k > 0 else ROCKB[1]
    # far hills
    hill = yy > 232 + 18 * np.sin(xx * .012) + 10 * np.sin(xx * .045 + 1)
    img[hill & (yy < 300)] = ROCKB[1]
    img[hill & (yy < 300) & (yy < 240 + 18 * np.sin(xx * .012) + 10 * np.sin(xx * .045 + 1))] = ROCKB[2]
    # sea: bands toward the shore, crest strokes
    r = np.random.default_rng(4)
    sea = (yy >= 268) & (yy < 400)
    for i, (a, b) in enumerate(((268, 285), (285, 305), (305, 330), (330, 360), (360, 400))):
        img[(yy >= a) & (yy < b)] = SEA[1 + i]
    for _ in range(170):
        y = r.integers(272, 392); x = r.integers(0, W - 30); L = r.integers(6, 24) * (1 + (y - 270) / 120)
        img[y, x:int(x + L)] = SEA[6] if y > 330 else SEA[5]
        img[y + 1, x + 2:int(x + L - 2)] = SEA[min(6, 2 + (y - 268) // 30)] * .85
    # foam line
    fo = 398 + 6 * np.sin(np.arange(W) * .05) + 3 * np.sin(np.arange(W) * .17)
    for x in range(W):
        y = int(fo[x]); img[y - 3:y + 3, x] = hx('#f4fbff'); img[y + 3:y + 6, x] = hx('#bfe2ee')
    # sand
    sandm = yy >= (fo[None, :] + 6)
    n = gaussian_filter(r.standard_normal((H, W)), 10); n = (n - n.mean()) / n.std()
    ts = np.clip((yy - 420) / 260, 0, 1) * 1.6 + 2.6 + (n > 1.2) * .5
    i0 = np.floor(ts).astype(int); f = ts - i0
    sidx = np.clip(5 - (i0 + (f > bay)) + 2, 0, 5)
    img[sandm] = np.array(SAND)[sidx][sandm]
    img[sandm & (yy < fo[None, :] + 26)] = SAND[1]       # wet sand
    img[sandm & (yy < fo[None, :] + 12)] = SAND[0] * 1.1
    for _ in range(260):                                  # ripples and grains
        y = r.integers(440, H - 2); x = r.integers(0, W - 12)
        if r.random() < .5: img[y, x:x + r.integers(4, 12)] = SAND[2]; img[y - 1, x + 1:x + 8] = SAND[4]
        else: img[y, x] = SAND[1]; img[y, x + 1] = SAND[5]
    return img

def rock(w, h, seed=0):
    s = Sprite(w, h)
    r = np.random.default_rng(seed)
    pts = [(w * .5 + w * .48 * np.cos(a) * (0.85 + .15 * r.random()), h * .62 + h * .55 * np.sin(a) * (0.8 + .2 * r.random()))
           for a in np.linspace(np.pi, 2 * np.pi, 9)] + [(w * .98, h), (w * .02, h)]
    s.shape(poly(pts), STONE, bulge=1.4)
    for k in range(4):                                     # facets
        x = w * (.2 + .2 * k); s.line([(x, h * .3 + 6 * k), (x + 8, h * .9)], STONE[1])
    return s.finish()

def driftwood(w=240, h=40):
    s = Sprite(w, h)
    s.shape(poly([(4, h * .55), (w * .3, h * .35), (w * .7, h * .38), (w - 6, h * .2), (w - 2, h * .4), (w * .72, h * .7), (w * .3, h * .8), (6, h * .8)]), DRIFT, bulge=1.1)
    s.shape(poly([(w * .5, h * .4), (w * .56, 2), (w * .6, 4), (w * .56, h * .42)]), DRIFT, bulge=1)
    for x in range(10, w - 20, 14): s.line([(x, h * .55), (x + 10, h * .58)], DRIFT[1])
    return s.finish()

def laftrache():
    """A little lake man: mossy hat, white beard to the knees, glowing red eyes. Faces right (toward the hero)."""
    w, h = 132, 140
    s = Sprite(w, h)
    cx = 62
    for x in (cx - 18, cx + 12):                                                        # feet
        s.shape(E(x + 6, h - 8, 14, 7), PAL['leather'], bulge=1.2)
    s.shape(poly([(cx - 30, h - 12), (cx + 30, h - 12), (cx + 26, 62), (cx - 26, 62)]), GRN, bulge=1.2, top=.15)   # cloak
    for x in (cx - 18, cx - 6, cx + 8, cx + 20):
        s.line([(x, 78), (x + (x - cx) * .15, h - 14)], GRN[0]); s.line([(x - 2, 82), (x - 2 + (x - cx) * .15, h - 16)], GRN[4])
    s.shape(E(cx + 30, 104, 9, 8), PAL['skin'], bulge=1.1)                              # hand
    s.shape(E(cx + 4, 52, 28, 26), PAL['skin'], bulge=1.2)                              # face
    # beard: long, flowing to the knees, lit from the left
    bm = s.shape(poly([(cx - 22, 58), (cx + 30, 58), (cx + 28, 92), (cx + 18, 116), (cx + 6, 124), (cx - 6, 118), (cx - 18, 100), (cx - 24, 78)]), BEARD, bulge=1.3)
    for x in range(cx - 18, cx + 28, 5):
        s.line([(x, 66), (x + 2, 110 - abs(x - cx - 4) * .8)], BEARD[1] if x > cx else BEARD[2])
    s.shape(E(cx + 22, 60, 9, 8), PAL['skin'], bulge=1.2)                               # big nose
    s.px(cx + 25, 58, PAL['skin'][5]); s.px(cx + 26, 58, PAL['skin'][5])
    # hat: a huge mossy cap with a drooping brim
    s.shape(U(E(cx, 36, 44, 14), E(cx - 2, 22, 30, 22)), GRN, bulge=1.3, top=.3)
    s.shape(E(cx, 40, 44, 7), GRN, tone=.15)
    r = np.random.default_rng(9)
    for _ in range(60):                                                                  # moss tufts on the cap
        x, y = r.integers(cx - 36, cx + 36), r.integers(4, 40)
        if s.a[y, x] and s.part[y, x] == s.n - 2:
            s.px(x, y, GRN[5]); s.px(x + 1, y, GRN[4]); s.px(x, y + 1, GRN[3])
    # glowing red eyes under the brim
    for ex in (cx + 6, cx + 20):
        s.shape(E(ex, 48, 4.5, 3.5), ramp('#5a0808', '#a01010', '#e02a20', '#ff6a4a', '#ffd0b0'), bulge=1.5, line=False)
        s.px(ex - 1, 47, '#ffffff')
    s.line([(cx - 2, 44), (cx + 30, 44)], GRN[0])
    return s.finish()

def llanka_side():
    """Battle Llanka, facing left, 3x (about 132x216)."""
    w, h = 140, 220
    s = Sprite(w, h)
    cx = 74
    sk = PAL['skin']
    s.shape(U(E(cx + 8, 54, 34, 40), R(cx - 4, 54, cx + 40, 120), E(cx + 18, 122, 22, 8)), PAL['hair'], bulge=.9, top=.25)   # hair behind
    for x in range(cx, cx + 40, 6):
        s.line([(x, 70), (x + 2, 124)], PAL['hair'][0]); s.line([(x + 3, 72), (x + 5, 120)], PAL['hair'][3])
    for x in (cx - 16, cx + 8):                                                         # legs and boots
        s.shape(R(x, 150, x + 18, 200), PAL['pants'], bulge=.9)
        s.shape(E(x + 6, 204, 16, 9), PAL['leather'], bulge=1.2)
    s.shape(poly([(cx - 42, 160), (cx + 40, 160), (cx + 34, 92), (cx + 10, 82), (cx - 16, 84), (cx - 36, 96)]), PAL['blue'], bulge=1.2, top=.15)  # makuñ
    # woven band with stepped diamonds
    for x in range(cx - 40, cx + 39):
        for y in range(128, 146):
            if s.a[y, x]: s.rgb[y, x] = PAL['blue'][1]
        k = (x - cx) % 18; d = abs(k - 9)
        for y in range(128, 146):
            if abs(y - 137) + d <= 8 and s.a[y, x] and (abs(y - 137) + d) % 3 != 2: s.rgb[y, x] = PAL['red'][4] if (abs(y - 137) + d) < 4 else PAL['white'][4]
        if s.a[127, x]: s.rgb[127, x] = PAL['white'][5]
        if s.a[146, x]: s.rgb[146, x] = PAL['white'][3]
    for x in range(cx - 36, cx + 30, 12):
        s.line([(x, 100), (x - 4, 126)], PAL['blue'][0]); s.line([(x + 2, 102), (x - 2, 126)], PAL['blue'][4])
    s.shape(poly([(cx - 30, 108), (cx - 52, 128), (cx - 58, 122), (cx - 38, 98)]), PAL['blue'], bulge=1.1)   # arm reaching forward
    s.shape(E(cx - 58, 126, 9, 8), sk, bulge=1.2)
    # head in profile: forehead, nose, lips, chin
    face = poly([(cx + 26, 30), (cx - 8, 26), (cx - 22, 40), (cx - 24, 54), (cx - 30, 62), (cx - 24, 66), (cx - 26, 72), (cx - 22, 76), (cx - 20, 82),
                 (cx - 8, 90), (cx + 14, 86), (cx + 28, 70)])
    s.shape(face, sk, bulge=1.1, light=(-.8, -.5))
    s.shape(E(cx + 16, 62, 7, 9), sk, bulge=1.2)                                       # ear
    s.px(cx + 15, 62, sk[2]); s.px(cx + 16, 63, sk[2])
    ex, ey = cx - 12, 54                                                                # eye (profile)
    for dy in range(5):
        for dx in range(5): s.px(ex + dx, ey + dy - 2, '#1a1020' if dy in (0,) else ('#f4eef0' if dx == 0 else '#5a321e'))
    s.px(ex + 1, ey - 1, '#ffffff'); s.line([(ex - 1, ey - 3), (ex + 5, ey - 4)], '#140a10'); s.line([(ex, ey - 9), (ex + 7, ey - 9)], PAL['hair'][1])
    s.line([(cx - 25, 74), (cx - 19, 74)], '#6a2a22')                                   # mouth
    s.px(cx - 22, 62, sk[2]); s.px(cx - 21, 63, sk[2])
    # fringe and the trarilonko
    s.shape(poly([(cx + 34, 52), (cx + 30, 24), (cx + 4, 14), (cx - 18, 22), (cx - 26, 40), (cx - 14, 34), (cx - 6, 44), (cx + 2, 32), (cx + 12, 46), (cx + 22, 36)]), PAL['hair'], bulge=1, top=.35)
    yy, xx = np.mgrid[0:h, 0:w]
    sheen = s.a & (((xx - cx - 2) / 22) ** 2 + ((yy - 22) / 5) ** 2 < 1) & (((xx - cx - 2) / 17) ** 2 + ((yy - 23) / 2.4) ** 2 >= 1) & (s.part == s.n - 1)
    s.rgb[sheen] = PAL['hair'][4]
    s.shape(poly([(cx - 24, 36), (cx + 34, 40), (cx + 34, 46), (cx - 25, 42)]), PAL['red'], tone=.55)
    for x in range(cx - 22, cx + 32, 6): s.px(x, 40 + (x - cx + 24) * 6 // 58, PAL['silver'][5])
    s.shape(E(cx - 20, 39, 4, 4), PAL['silver'], bulge=1.3)
    return s.finish()

if __name__ == '__main__':
    bg = background()
    img = Image.fromarray(bg.astype(np.uint8), 'RGB').convert('RGBA')
    def put(sp, x, y): img.alpha_composite(sp, (int(x - sp.width / 2), int(y - sp.height)))
    # ground shadows
    sh = np.array(img.convert('RGB')).astype(float)
    yy, xx = np.mgrid[0:H, 0:W]
    for (x, y, rx) in ((190, 456, 46), (260, 540, 46), (620, 640, 50)):
        m = ((xx - x) / rx) ** 2 + ((yy - y) / 10) ** 2 <= 1; sh[m] *= .74
    img = Image.fromarray(sh.astype(np.uint8), 'RGB').convert('RGBA')
    put(rock(110, 90, 1), 560, 400); put(rock(170, 120, 2), 70, H + 20); put(driftwood(), 600, 640)
    L = laftrache()
    put(L, 190, 462); put(L, 260, 546)
    put(llanka_side(), 620, 646)
    img.convert('RGB').save('/home/claude/px/hd/battle_hd.png')
    cur = Image.open('/home/claude/px/b_laf.png').convert('RGB').crop((0, 0, 256, 224)).resize((W, H), Image.NEAREST)
    both = Image.new('RGB', (W * 2 + 20, H + 40), (255, 255, 255)); d = ImageDraw.Draw(both)
    both.paste(cur, (0, 40)); both.paste(img.convert('RGB'), (W + 20, 40))
    d.text((10, 12), 'Now (scaled 3x)', fill=(0, 0, 0)); d.text((W + 30, 12), 'HD preview (drawn at 3x)', fill=(0, 0, 0))
    both.save('/home/claude/px/hd/battle_compare.png'); print('ok')
