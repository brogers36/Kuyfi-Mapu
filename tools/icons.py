"""Generate the app icons: a pixel-art kultrung on the game's dark palette.
Outputs: www/icon-192.png, www/icon-512.png, www/icon-maskable-512.png,
www/apple-touch-icon.png, assets/icon-only.png, assets/icon-foreground.png,
assets/icon-background.png, assets/splash.png, assets/splash-dark.png
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (13, 11, 16, 255)        # #0d0b10 game background
BG2 = (26, 20, 48, 255)       # deep violet vignette
RIM = (122, 58, 26, 255)      # #7a3a1a wood rim
RIMD = (74, 42, 20, 255)      # rim shadow
FACE = (232, 212, 168, 255)   # hide
FACED = (208, 184, 136, 255)  # hide shading
LINE = (74, 42, 20, 255)      # painted lines (dark brown)
RED = (176, 48, 48, 255)
BLUE = (42, 74, 154, 255)
GOLD = (255, 233, 176, 255)   # #ffe9b0 title gold


def kultrung(n=64, bg=None, pad=0.0):
    """Draw the drum on an n x n pixel grid. bg=None -> transparent."""
    im = Image.new('RGBA', (n, n), bg if bg else (0, 0, 0, 0))
    px = im.load()
    c = (n - 1) / 2.0
    R = (n / 2.0) * (1.0 - pad)          # outer rim radius
    rim_w = max(2, round(n * 0.06))
    rface = R - rim_w
    lw = max(1, round(n * 0.035))        # painted line half-width
    for y in range(n):
        for x in range(n):
            dx, dy = x - c, y - c
            d = (dx * dx + dy * dy) ** 0.5
            if d > R:
                continue
            if d > rface:
                px[x, y] = RIMD if (dy > abs(dx) * 0.6) else RIM
                continue
            # hide face with soft lower shading
            col = FACED if dy > rface * 0.45 else FACE
            # painted cross
            if abs(dx) <= lw or abs(dy) <= lw:
                col = LINE
            px[x, y] = col
    # quadrant symbols: paired dots (stepped star points)
    def blob(cx, cy, r, col):
        for y in range(n):
            for x in range(n):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                    dxx, dyy = x - c, y - c
                    if (dxx * dxx + dyy * dyy) ** 0.5 < rface - 1:
                        px[x, y] = col
    q = rface * 0.5
    r1 = max(1.6, n * 0.045)
    blob(c - q, c - q, r1, RED)
    blob(c + q, c + q, r1, RED)
    blob(c + q, c - q, r1, BLUE)
    blob(c - q, c + q, r1, BLUE)
    # small satellite dots around each symbol
    r2 = max(1.0, n * 0.022)
    off = r1 * 2.1
    for (sx, sy, col) in [(c - q, c - q, RED), (c + q, c + q, RED), (c + q, c - q, BLUE), (c - q, c + q, BLUE)]:
        for (ox, oy) in [(off, 0), (-off, 0), (0, off), (0, -off)]:
            blob(sx + ox, sy + oy, r2, col)
    return im


def on_bg(drum_frac, size, base=64):
    """Drum centered on the dark square background with a subtle vignette."""
    im = Image.new('RGBA', (base, base), BG)
    px = im.load()
    c = (base - 1) / 2.0
    for y in range(base):
        for x in range(base):
            d = ((x - c) ** 2 + (y - c) ** 2) ** 0.5
            if d < base * 0.46:
                px[x, y] = BG2
    d = kultrung(round(base * drum_frac))
    off = (base - d.size[0]) // 2
    im.alpha_composite(d, (off, off))
    return im.resize((size, size), Image.NEAREST)


os.makedirs(os.path.join(ROOT, 'assets'), exist_ok=True)
www = lambda f: os.path.join(ROOT, 'www', f)
ass = lambda f: os.path.join(ROOT, 'assets', f)

on_bg(0.84, 192).save(www('icon-192.png'))
on_bg(0.84, 512).save(www('icon-512.png'))
on_bg(0.60, 512).save(www('icon-maskable-512.png'))   # safe zone
on_bg(0.84, 180).save(www('apple-touch-icon.png'))
on_bg(0.84, 1024).save(ass('icon-only.png'))

fg = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
fg.alpha_composite(kultrung(38), (13, 13))            # adaptive foreground, ~60% safe
fg.resize((1024, 1024), Image.NEAREST).save(ass('icon-foreground.png'))
Image.new('RGBA', (1024, 1024), BG).save(ass('icon-background.png'))

# splash: drum centered on dark field
sp = Image.new('RGBA', (2732, 2732), BG)
d = kultrung(64).resize((640, 640), Image.NEAREST)
sp.alpha_composite(d, ((2732 - 640) // 2, (2732 - 640) // 2))
sp.save(ass('splash.png'))
sp.save(ass('splash-dark.png'))
print('icons written')
