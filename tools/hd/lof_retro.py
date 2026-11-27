"""Retro test: the same cast drawn on the game's pixel grid, composited at 1x then scaled 3x like the game."""
import numpy as np
from PIL import Image, ImageDraw
import hr_cast as C
C.RETRO = True
S = 3
cur = Image.open('/home/claude/px/lof_with.png').convert('RGB')
W, H = cur.size
bg = np.array(Image.open('/home/claude/px/lof_empty.png').convert('RGB')).astype(float)
withc = np.array(cur).astype(float)
bg[82:122, 125:145] = bg[82:122, 101:121]
people = [('weaver', 'front', 0, 119, 72), ('kuku', 'front', 0, 71, 136), ('weaver', 'back', 0, 87, 40), ('teacher', 'front', 0, 199, 184),
          ('walker', 'left', 1, 87, 152), ('childf', 'front', 0, 263, 200), ('kona', 'right', 0, 151, 88), ('llanka', 'front', 0, 135, 120),
          ('palinA', 'left', 1, 169, 52), ('palinB', 'left', 2, 205, 52), ('palinA', 'left', 2, 168, 74), ('palinB', 'left', 1, 209, 74)]
yy, xx = np.mgrid[0:H, 0:W]
for n, v, f, x, y in people:
    m = ((xx - x) / 6) ** 2 + ((yy - y + 1) / 2) ** 2 <= 1; bg[m] *= .72
img = Image.fromarray(bg.astype(np.uint8)).convert('RGBA')
sprites = {}
for n, v, f, x, y in sorted(people, key=lambda p: p[4]):
    sp = C.sprite(n, v, f); sprites[(n, v, f)] = sp
    img.alpha_composite(sp, (x - sp.width // 2, y - sp.height + 1))
arr = np.array(img.convert('RGB')); hud = np.array(Image.open('/home/claude/px/lof_empty.png').convert('RGB'))
arr[4:32, 20:130] = hud[4:32, 20:130]; arr[3:21, 182:252] = hud[3:21, 182:252]
img = Image.fromarray(arr)
img.resize((W * S, H * S), Image.NEAREST).save('/home/claude/px/cast/lof_retro.png')
both = Image.new('RGB', (W * S * 2 + 20, H * S + 40), (255, 255, 255)); d = ImageDraw.Draw(both)
both.paste(cur.resize((W * S, H * S), Image.NEAREST), (0, 40)); both.paste(img.resize((W * S, H * S), Image.NEAREST), (W * S + 20, 40))
d.text((10, 12), 'Now', fill=(0, 0, 0)); d.text((W * S + 30, 12), 'Retro test: new people on the game\'s own pixel grid (mockup)', fill=(0, 0, 0))
both.save('/home/claude/px/cast/lof_retro_compare.png')
img.crop((40, 20, 240, 160)).resize((800, 560), Image.NEAREST).save('/home/claude/px/cast/lof_retro_zoom.png')
print({k: v.size for k, v in sprites.items()})
