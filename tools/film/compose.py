"""Rebuild the credits film: stream the original, replace the outdated shots, keep the music.
usage: python3 compose.py out.mp4 [preview_frame ...]"""
import numpy as np, cv2, subprocess, sys, os, math, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = '/home/claude/kewun/www/ending.mp4'
CAP = '/home/claude/film/cap/'
W, H, FPS = 1280, 720, 30
GEL = '/usr/share/fonts/truetype/google-fonts/ofl/gelasio/Gelasio[wght].ttf'
FIRA = [p for p in os.popen("fc-list | grep -i 'FiraSans-Regular' | cut -d: -f1").read().split() if p]
FIRA = FIRA[0] if FIRA else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def gel(size, wt='Medium'):
    f = ImageFont.truetype(GEL, size)
    try: f.set_variation_by_name(wt)
    except Exception: pass
    return f
def fit(fontfn, text, width, lo=10, hi=200):
    while hi - lo > 1:
        m = (lo + hi) // 2
        if fontfn(m).getlength(text) > width: hi = m
        else: lo = m
    return fontfn(lo)
F_BOSS = fit(lambda s: gel(s, 'Medium'), 'Trelke-wekufü', 368)
F_NAME = fit(lambda s: gel(s, 'Regular'), 'Millaray', 170)
F_LAB = fit(lambda s: ImageFont.truetype(FIRA, s), 'Wariache', 104)
F_SONG = gel(40, 'Regular')
F_TITLE = gel(92, 'Bold'); F_SUB = gel(30, 'Regular'); F_COPY = ImageFont.truetype(FIRA, 18)

def fr(t): return int(round(t * FPS))
def ease(x): x = max(0., min(1., x)); return x * x * (3 - 2 * x)

_cache = {}
def capframe(name, i):
    fs = sorted(os.listdir(CAP + name)); i = max(0, min(len(fs) - 1, i)); k = (name, i)
    if k not in _cache:
        if len(_cache) > 400: _cache.clear()
        _cache[k] = np.asarray(Image.open(CAP + name + '/' + fs[i]).convert('RGB'))
    return _cache[k]
def crop_scale(img, x0, y0, w, h, interp=cv2.INTER_LINEAR):
    M = np.float32([[W / w, 0, -x0 * W / w], [0, H / h, -y0 * H / h]])
    return cv2.warpAffine(img, M, (W, H), flags=interp, borderMode=cv2.BORDER_REPLICATE)
def flash(img, a, col=(255, 255, 255)):
    if a <= 0: return img
    return (img * (1 - a) + np.array(col) * a).astype(np.uint8)
def fadeblack(img, a):
    return (img * max(0., min(1., a))).astype(np.uint8)
def draw_text(img, items):
    """items: (xy, text, font, rgb, alpha, anchor)"""
    if not items: return img
    base = Image.fromarray(img).convert('RGBA'); lay = Image.new('RGBA', base.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for (xy, text, font, rgb, al, anc) in items:
        if al <= 0: continue
        sh = Image.new('RGBA', base.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
        ds.text((xy[0] + 2, xy[1] + 3), text, font=font, fill=(0, 0, 0, int(170 * al)), anchor=anc)
        lay = Image.alpha_composite(lay, sh.filter(ImageFilter.GaussianBlur(3)))
        d = ImageDraw.Draw(lay); d.text(xy, text, font=font, fill=tuple(rgb) + (int(255 * al),), anchor=anc)
    return np.asarray(Image.alpha_composite(base, lay).convert('RGB'))
def draw_line(img, x0, x1, y, rgb, al, th=3):
    if al <= 0: return img
    img = img.copy(); seg = img[y:y + th, x0:x1].astype(float)
    img[y:y + th, x0:x1] = (seg * (1 - al) + np.array(rgb) * al).astype(np.uint8); return img

# ---------------------------------------------------------------- shot makers (i: local frame, n: shot length)
def cutshot(name, off=0, z0=1.0, z1=1.035, fin=0, fout=0, text=None):
    def f(i, n):
        fcap = capframe(name, off + i); h_, w_ = fcap.shape[:2]
        z = z0 + (z1 - z0) * i / max(1, n - 1); cw, ch = w_ / z, h_ / z
        img = crop_scale(fcap, (w_ - cw) / 2, (h_ - ch) / 2, cw, ch)
        if fin: img = fadeblack(img, i / fin)
        if fout and i > n - fout: img = fadeblack(img, (n - i) / fout)
        if text: img = text(img, i, n)
        return img
    return f
def bossshot(name, label, dy=0):
    def f(i, n):
        fcap = capframe('b_' + name, i); h_, w_ = fcap.shape[:2]
        s = w_ / 1000 * 1.45; cw, ch = W / s, H / s
        t = i / max(1, n - 1)
        x0 = (30 + 26 * t + 6 * math.sin(i * .9) * max(0, 1 - i / 6)) * w_ / 1000; y0 = (36 + dy + 8 * t) * w_ / 1000
        img = crop_scale(fcap, x0, y0, cw, ch, cv2.INTER_NEAREST)
        img = flash(img, .8 * max(0, 1 - i / 5))
        a_in = ease((i - 2) / 7); a_out = ease((n - 1 - i) / 7); al = min(a_in, a_out)
        x = 76 - 50 * (1 - a_in)
        tw = F_BOSS.getlength(label)
        img = draw_line(img, int(x - 16), int(x + tw + 24), 638, (214, 108, 66), al)
        return draw_text(img, [((x, 606), label, F_BOSS, (242, 234, 214), al, 'ls')])
    return f

SPR = '/home/claude/film/spr/'
def sprite(name, fi=0): return Image.open(SPR + '%s_%d.png' % (name, fi))
def scaled(name, h, fi=0, mirror=False):
    im = sprite(name, fi); k = h / im.height; im = im.resize((max(1, int(im.width * k)), int(h)), Image.NEAREST)
    return im.transpose(Image.FLIP_LEFT_RIGHT) if mirror else im
def glow_of(im, col, rad=18, k=1.6):
    a = np.asarray(im.split()[-1]).astype(float) / 255
    g = cv2.GaussianBlur(a, (0, 0), rad) * k
    out = np.zeros((im.height, im.width, 4), np.uint8); out[..., :3] = col; out[..., 3] = np.clip(g * 255, 0, 255)
    return Image.fromarray(out, 'RGBA')
def paste_glow(base, im, x, y, col, rad=18, k=1.6, pad=60):
    big = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0)); big.paste(im, (pad, pad))
    base.alpha_composite(glow_of(big, col, rad, k), (int(x - pad), int(y - pad))); base.alpha_composite(im, (int(x), int(y)))
def radial_bg(c_in, c_out, cx=W * .62, cy=H * .5):
    yy, xx = np.mgrid[0:H, 0:W]; d = np.clip(np.hypot((xx - cx) / W, (yy - cy) / H) * 1.6, 0, 1)[..., None]
    return (np.array(c_in) * (1 - d) + np.array(c_out) * d).astype(np.uint8)
def streaks(img, i, kind, col=(255, 255, 255), n=70, seed=1, al=.22):
    rs = np.random.RandomState(seed); lay = img.copy()
    for k in range(n):
        if kind == 'h':
            y = rs.randint(0, H); L = rs.randint(80, 420); x = (rs.randint(0, W + L) - i * rs.randint(40, 90)) % (W + L) - L
            cv2.line(lay, (int(x), y), (int(x + L), y), col, rs.randint(1, 3))
        else:
            a = rs.rand() * 6.283; r0 = 260 + rs.rand() * 120 + (i * 13 + k * 7) % 60; r1 = r0 + 160 + rs.rand() * 400
            cx, cy = W / 2, H / 2
            cv2.line(lay, (int(cx + math.cos(a) * r0), int(cy + math.sin(a) * r0)), (int(cx + math.cos(a) * r1), int(cy + math.sin(a) * r1)), col, rs.randint(1, 4))
    return (img * (1 - al) + lay * al).astype(np.uint8)
def closeup(names, c_in, c_out, glowc, kind='h', hgt=640, xs=None, mirror=False):
    def f(i, n):
        bg = radial_bg(c_in, c_out); bg = streaks(bg, i, kind, seed=len(names[0]))
        base = Image.fromarray(bg).convert('RGBA')
        for k, nm in enumerate(names):
            im = scaled(nm, hgt, (i // 8) % 2 if nm.startswith('ngoy') else 0, mirror)
            x = (xs[k] if xs else W * .62) - im.width / 2 + (i * .6 if kind == 'h' else 0)
            y = H - im.height + (40 if kind == 'h' else 0) if kind == 'h' else (H - im.height) / 2
            paste_glow(base, im, x, y, glowc)
        img = np.asarray(base.convert('RGB'))
        return flash(img, .65 * max(0, 1 - i / 8))
    return f

def colorize_red(im, k=1.0):
    a = np.asarray(im).astype(float); l = (a[..., :3] @ np.array([.3, .55, .15])) / 255
    out = a.copy(); out[..., 0] = np.clip(36 + l * 230 * k, 0, 255); out[..., 1] = np.clip(l * 92 * k, 0, 255); out[..., 2] = np.clip(8 + l * 80 * k, 0, 255)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')
_bdbg = None
def breakdown_bg():
    global _bdbg
    if _bdbg is None:
        g = np.asarray(Image.open('/tmp/bs/cut_grey.png').convert('RGB').resize((W, H), Image.BILINEAR)).astype(float)
        l = g @ np.array([.3, .55, .15]) / 255
        out = np.zeros((H, W, 3)); out[..., 0] = 14 + l * 120; out[..., 1] = 4 + l * 26; out[..., 2] = 6 + l * 24
        yy = np.mgrid[0:H, 0:W][0]; out *= (1 - (yy / H) * .45)[..., None]
        _bdbg = out.astype(np.uint8)
    return _bdbg
NG_NAMES = {'ngoyman1': 'Ti Fütra Ngoymatulfe', 'ngoyman2': 'Fütra Ngoymatulfe', 'ngoyman3': 'Ngoymatulfe ñi piwke', 'ngoyman4': 'Füta Dumiñ', 'ngoyman5': 'Rüf Fütra Ngoymatulfe'}
def ngshot(form, big=1.0, dim=False):
    def f(i, n):
        base = Image.fromarray(breakdown_bg()).convert('RGBA')
        hgt = {'ngoyman1': 300, 'ngoyman2': 380, 'ngoyman3': 360, 'ngoyman4': 470, 'ngoyman5': 640}[form] * big
        im = colorize_red(scaled(form, hgt, (i // 6) % 2), .55 if dim else 1.0)
        cx = 330 if form != 'ngoyman5' else W * .5 + (big - 1) * 120
        x = cx - im.width / 2; y = 560 - im.height if form != 'ngoyman5' else (H - im.height) / 2 + 40 * big
        paste_glow(base, im, x, y, (200, 40, 40), 22, 1.2)
        img = np.asarray(base.convert('RGB'))
        if form != 'ngoyman5': img = draw_line(img, int(cx - 90), int(cx + 90), 572, (220, 96, 70), .9)
        if form == 'ngoyman5': img = streaks(img, i, 'h', (255, 120, 110), 40, 5, .18)
        img = flash(img, .55 * max(0, 1 - i / 3), (255, 200, 190))
        return draw_text(img, [((76, 606), NG_NAMES[form], F_BOSS, (236, 120, 110), .95 if not dim else .6, 'ls')])
    return f

def rise(i, n):
    t = ease(i / (n * .6))
    bg = radial_bg((60, 48, 30), (8, 6, 14), W / 2, H * .55)
    if i > n * .45: bg = streaks(bg, i, 'r', (255, 236, 190), 60, 9, .25 * ease((i - n * .45) / 8))
    base = Image.fromarray(bg).convert('RGBA')
    for k, (nm, x, mir) in enumerate([('hero_llanka', 215, True), ('hero_kallfurungi', 470, True), ('hero_ayelen', 810, False), ('hero_millaray', 1065, False)]):
        im = scaled(nm, 480, 0, mir)
        y = H - im.height + 30 + (1 - ease(i / (n * .55) - k * .06)) * 260
        paste_glow(base, im, x - im.width / 2, y, (255, 214, 140), 16, .6 + .9 * t)
    return np.asarray(base.convert('RGB'))

def title(i, n):
    bg = np.asarray(Image.open('/tmp/bs/cut_dusk.png').convert('RGB'))
    z = 1 + .04 * i / n; cw, ch = 400 / z, 224 / z
    img = crop_scale(bg, (400 - cw) / 2, (224 - ch) / 2 - 6 * i / n, cw, ch, cv2.INTER_NEAREST)
    img = (img * .78).astype(np.uint8)
    a = ease(i / 18); ac = ease((i - 40) / 20) * .65
    img = draw_text(img, [((W / 2, 314), 'Kewün Newen', F_TITLE, (246, 240, 226), a, 'mm'), ((W / 2, 392), 'la fuerza de la lengua', F_SUB, (226, 212, 190), a * .9, 'mm'),
                          ((W / 2, 688), '© 2026 Brandon M. A. Rogers', F_COPY, (220, 214, 204), ac, 'mm')])
    if i > n - 45: img = fadeblack(img, (n - i) / 45)
    return img

def song_text(img, i, n):
    a = min(ease((i - 70) / 20), ease((n - 4 - i) / 14))
    return draw_text(img, [((80, 622), '♪', ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 34), (242, 236, 220), a, 'ls'), ((118, 622), 'Kelluaeyu', F_SONG, (242, 236, 220), a, 'ls')])

# ---------------------------------------------------------------- the Wariache credit: inpaint the old names, write all four
_wmask = None
def wariache_patch(img, i, n, orig_peak):
    global _wmask
    if _wmask is None:
        g = cv2.cvtColor(orig_peak, cv2.COLOR_RGB2GRAY).astype(int)
        roi = np.zeros_like(g, bool); roi[282:445, 840:1100] = True
        m = roi & (g > np.median(g[roi]) + 38)
        _wmask = cv2.dilate(m.astype(np.uint8) * 255, np.ones((7, 7), np.uint8))
    gm = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY).astype(float)
    m = _wmask > 0
    clean = cv2.inpaint(img, _wmask, 6, cv2.INPAINT_TELEA)
    pk = cv2.cvtColor(orig_peak, cv2.COLOR_RGB2GRAY).astype(float)
    cl0 = cv2.cvtColor(cv2.inpaint(orig_peak, _wmask, 6, cv2.INPAINT_TELEA), cv2.COLOR_RGB2GRAY).astype(float)
    al = np.clip((gm[m].mean() - cv2.cvtColor(clean, cv2.COLOR_RGB2GRAY)[m].mean()) / max(1, pk[m].mean() - cl0[m].mean()), 0, 1)
    # a soft dark wash behind the longer list so it reads over the map
    yy, xx = np.mgrid[0:H, 0:W]
    wash = np.exp(-(((xx - 960) / 230) ** 2 + ((yy - 420) / 150) ** 2)) * .45 * al
    clean = (clean * (1 - wash[..., None])).astype(np.uint8)
    items = [((848, 307), 'Wariache', F_LAB, (214, 190, 142), al, 'ls')]
    for k, nm in enumerate(['Millaray', 'Ayelen', 'Llanka', 'Kallfürüngi']):
        items.append(((848, 378 + k * 55), nm, F_NAME, (240, 236, 226), al, 'ls'))
    return draw_text(clean, items)

# ---------------------------------------------------------------- the timeline
SEG = []
def add(t0, t1, fn): SEG.append((fr(t0), fr(t1), fn))
add(0, 6.4, cutshot('c_e0', 0, fin=40, text=song_text))
add(6.4, 8.0, closeup(['hero_millaray', 'hero_ayelen'], (120, 24, 34), (26, 4, 8), (255, 110, 110), xs=[760, 1060]))
add(8.0, 9.6333, closeup(['hero_llanka', 'hero_kallfurungi'], (24, 44, 130), (4, 8, 30), (120, 160, 255), xs=[760, 1060]))
add(11.2333, 12.8, closeup(['ngoyman5'], (130, 26, 30), (24, 4, 6), (255, 90, 80), kind='r', hgt=660, xs=[W / 2]))
add(25.6, 28.8, cutshot('c_i1', 0))
add(28.8, 30.4333, cutshot('c_i2', 0, 1.06, 1.0))
add(30.4333, 32.0, cutshot('c_i3', 0))
for (t0, t1, b, lab) in [(32, 33.6, 'trelke', 'Trelke-wekufü'), (33.6, 35.2, 'witranalwe', 'Witranalwe'), (35.2, 36.8333, 'cherrufe', 'Cherufe'), (36.8333, 38.4333, 'kaleuche', 'Kaleuche'),
                         (38.4333, 40, 'walichu', 'Walichu'), (40, 41.6, 'chadikura', 'Elëngasëm'), (41.6, 43.2, 'chinifilu', 'Chiñifilu'), (43.2, 44.8333, 'piwuchen', 'Piwüchen'),
                         (64, 65.6, 'wallipen', 'Wallepeñ'), (65.6, 67.2, 'trawko', 'Trawko'), (67.2, 68.8, 'epunamun', 'Epunamun'), (68.8, 70.4, 'kalku', 'Fütra Kalku'), (70.4, 72, 'llufu5', 'Millalobo')]:
    add(t0, t1, bossshot(b, lab, -34 if b == 'llufu5' else 0))   # the Rüf Millalobo's crown rises above the usual frame
add(57.6, 60.8333, cutshot('c_e1', 0))
add(60.8333, 64, cutshot('c_e2', 0))
# the breakdown: the original cut points, five forms instead of three
bd = [76.8, 77.1333, 77.4, 77.8333, 78.0333, 78.4, 78.7333, 79.0333, 79.2333, 80, 80.3, 80.6, 81, 81.2, 81.6, 81.9, 82.2, 82.4, 83.2, 83.5, 83.8, 84.2, 84.4, 84.8, 85.1333, 85.4, 85.6333, 86.4]
for k, (a, b) in enumerate(zip(bd, bd[1:])):
    if a < 79.2: form, big, dim = ('ngoyman1' if k % 2 == 0 else 'ngoyman2'), 1, k % 4 == 3
    elif a < 80.6: form, big, dim = ('ngoyman2' if k % 2 == 0 else 'ngoyman3'), 1, False
    elif a < 83.2: form, big, dim = ('ngoyman3' if k % 2 == 0 else 'ngoyman4'), 1, k % 4 == 1
    else: form, big, dim = 'ngoyman5', (1.0 if k % 2 == 0 else 1.18), False
    add(a, b, ngshot(form, big, dim))
add(88, 89.6333, rise)
add(96, 99.2, cutshot('c_e1', 100))
add(99.2, 108.8333, cutshot('c_e3', 0, 1.0, 1.05))
add(108.8333, 113.9, title)
SEG.sort()
WAR = (fr(12.8), fr(14.9667))

def frames_of_original():
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3: break
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)

def render(fi, orig, peak):
    for (a, b, fn) in SEG:
        if a <= fi < b: return fn(fi - a, b - a)
    if WAR[0] <= fi < WAR[1]: return wariache_patch(orig, fi - WAR[0], WAR[1] - WAR[0], peak)
    return orig

if __name__ == '__main__':
    out = sys.argv[1]; prev = [int(x) for x in sys.argv[2:]]
    peak = None
    if prev:
        allf = {}
        for fi, f in enumerate(frames_of_original()):
            if fi == fr(14.0): peak = f.copy()
            if fi in prev: allf[fi] = f.copy()
            if fi > max(prev) and peak is not None: break
        for fi in prev:
            Image.fromarray(render(fi, allf[fi], peak)).save('/tmp/ef/pv_%04d.png' % fi)
        print('previews', prev); sys.exit()
    for fi, f in enumerate(frames_of_original()):
        if fi == fr(14.0): peak = f.copy(); break
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(FPS), '-i', '-', '-i', SRC,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    n = 0
    for fi, f in enumerate(frames_of_original()):
        enc.stdin.write(np.ascontiguousarray(render(fi, f, peak)).tobytes()); n += 1
    enc.stdin.close(); enc.wait(); print('frames', n)
