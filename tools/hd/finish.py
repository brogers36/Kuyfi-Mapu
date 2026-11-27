"""Experimental 'finishing pass' on existing painted sprites (preview only):
hue-shifted shading (cool shadows, warm lights), stray-pixel cleanup, a coloured outline, a rim light."""
import colorsys, sys
import numpy as np
from PIL import Image

def hue_shift(rgb, a):
    out = rgb.copy()
    h, w = a.shape
    for y in range(h):
        for x in range(w):
            if not a[y, x]: continue
            r, g, b = rgb[y, x] / 255.0
            H, L, S = colorsys.rgb_to_hls(r, g, b)
            if L < .45:   # shadows lean toward blue-violet and get a touch more saturated
                t = (.45 - L) / .45
                H = (H + (0.72 - H) * .28 * t) % 1 if abs(H - .72) < .5 else H
                S = min(1, S * (1 + .25 * t) + .04 * t); L = L * (1 - .08 * t)
            else:         # lights lean warm
                t = (L - .45) / .55
                tgt = .12
                H = H + (tgt - H) * .18 * t if abs(H - tgt) < .5 else H
                S = min(1, S * (1 + .12 * t)); L = min(1, L * (1 + .05 * t))
            out[y, x] = np.array(colorsys.hls_to_rgb(H % 1, L, S)) * 255
    return out

def cleanup(rgb, a):
    """Replace lone pixels that differ from all 4 neighbours with the neighbours' average: fewer speckles, cleaner clusters."""
    out = rgb.copy(); h, w = a.shape
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if not a[y, x]: continue
            nb = [rgb[y + dy, x + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if a[y + dy, x + dx]]
            if len(nb) < 4: continue
            if all(np.abs(rgb[y, x] - n).sum() > 60 for n in nb):
                out[y, x] = np.mean(nb, axis=0)
    return out

def quantize(rgb, a, n=40):
    im = Image.fromarray(rgb.astype(np.uint8)).quantize(n, method=Image.Quantize.MEDIANCUT)
    q = np.array(im.convert('RGB')).astype(float)
    out = rgb.copy(); out[a] = q[a]; return out

def outline_and_rim(rgb, a):
    h, w = a.shape
    A = np.pad(a, 1)
    out_rgb = np.pad(rgb, ((1, 1), (1, 1), (0, 0)))
    out_a = A.copy()
    # coloured outline: the darkened, cooled colour of the neighbour inside
    for y in range(h + 2):
        for x in range(w + 2):
            if A[y, x]: continue
            nb = [(y + dy, x + dx) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= y + dy < h + 2 and 0 <= x + dx < w + 2 and A[y + dy, x + dx]]
            if nb:
                c = np.mean([out_rgb[p] for p in nb], axis=0)
                out_rgb[y, x] = c * np.array([.22, .2, .3]) + np.array([10, 6, 18]); out_a[y, x] = True
    # rim light on the upper-left edge pixels of the sprite
    for y in range(1, h + 1):
        for x in range(1, w + 1):
            if A[y, x] and (not A[y - 1, x] or not A[y, x - 1]):
                out_rgb[y, x] = np.minimum(255, out_rgb[y, x] * 1.25 + 18)
    return out_rgb, out_a

def finish(path):
    im = Image.open(path).convert('RGBA'); arr = np.array(im).astype(float)
    a = arr[..., 3] > 128; rgb = arr[..., :3]
    rgb = cleanup(rgb, a)
    rgb = hue_shift(rgb, a)
    rgb = quantize(rgb, a, 48)
    rgb, a2 = outline_and_rim(rgb, a)
    out = np.zeros(a2.shape + (4,)); out[..., :3] = rgb; out[..., 3] = a2 * 255
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA')

if __name__ == '__main__':
    from PIL import ImageDraw
    names = sys.argv[1:]
    tiles = []
    for n in names:
        a = Image.open(f'/home/claude/px/gs/{n}.png').convert('RGBA'); b = finish(f'/home/claude/px/gs/{n}.png')
        b.save(f'/home/claude/px/gs/{n}_fin.png'); tiles.append((a, b))
    k = 3
    Wd = sum(max(a.width, b.width) * k + 20 for a, b in tiles) + 20; Hd = max(a.height + b.height for a, b in tiles) * k + 80
    sheet = Image.new('RGBA', (Wd, Hd), (70, 92, 120, 255)); d = ImageDraw.Draw(sheet); x = 20
    for a, b in tiles:
        sheet.alpha_composite(a.resize((a.width * k, a.height * k), Image.NEAREST), (x, 30))
        sheet.alpha_composite(b.resize((b.width * k, b.height * k), Image.NEAREST), (x, 50 + a.height * k))
        x += max(a.width, b.width) * k + 20
    d.text((8, 8), 'top: now   bottom: finishing pass', fill=(255, 255, 255))
    sheet.save('/home/claude/px/gs/finish_sheet.png'); print('ok')
