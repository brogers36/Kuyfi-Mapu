"""Full lof mockup: every NPC in view replaced (none removed), palin players included."""
import numpy as np
from PIL import Image, ImageDraw
import hr_cast as C

S = 3
cur = Image.open('/home/claude/px/lof_with.png').convert('RGB')
W, H = cur.width * S, cur.height * S
bg = np.array(Image.open('/home/claude/px/lof_empty.png').convert('RGB').resize((W, H), Image.NEAREST)).astype(float)
withc = np.array(cur.resize((W, H), Image.NEAREST)).astype(float)
# cover the old player sprite with grass from beside it; keep the original dog
bg[(120 - 38) * S:(120 + 2) * S, (135 - 10) * S:(135 + 10) * S] = bg[(120 - 38) * S:(120 + 2) * S, (135 - 34) * S:(135 - 14) * S]
dx0, dy0 = 119, 200
bg[(dy0 - 20) * S:(dy0 + 2) * S, (dx0 - 12) * S:(dx0 + 12) * S] = withc[(dy0 - 20) * S:(dy0 + 2) * S, (dx0 - 12) * S:(dx0 + 12) * S]
people = [('weaver', 'front', 0, 119, 72), ('kuku', 'front', 0, 71, 136), ('weaver', 'back', 0, 87, 40), ('teacher', 'front', 0, 199, 184),
          ('walker', 'left', 1, 87, 152),
          ('childf', 'front', 0, 263, 200), ('kona', 'right', 0, 151, 88), ('llanka', 'front', 0, 135, 120),
          ('palinA', 'left', 1, 169, 52), ('palinB', 'left', 2, 205, 52), ('palinA', 'left', 2, 168, 74), ('palinB', 'left', 1, 209, 74)]
yy, xx = np.mgrid[0:H, 0:W]
for n, v, f, x, y in people:
    m = ((xx - x * S) / 16) ** 2 + ((yy - y * S + 2) / 5) ** 2 <= 1; bg[m] *= .7
img = Image.fromarray(bg.astype(np.uint8)).convert('RGBA')
for n, v, f, x, y in sorted(people, key=lambda p: p[4]):
    sp = C.sprite(n, v, f)
    img.alpha_composite(sp, (x * S - sp.width // 2, y * S - sp.height + 3))
hud = np.array(Image.open('/home/claude/px/lof_empty.png').convert('RGB').resize((W, H), Image.NEAREST))
arr = np.array(img.convert('RGB'))
arr[12:96, 60:390] = hud[12:96, 60:390]; arr[10:62, 548:756] = hud[10:62, 548:756]   # HUD panels on top, as in the game
img = Image.fromarray(arr).convert('RGBA')
img.convert('RGB').save('/home/claude/px/cast/lof_full.png')
both = Image.new('RGB', (W * 2 + 20, H + 40), (255, 255, 255)); d = ImageDraw.Draw(both)
both.paste(cur.resize((W, H), Image.NEAREST), (0, 40)); both.paste(img.convert('RGB'), (W + 20, 40))
d.text((10, 12), 'Now', fill=(0, 0, 0)); d.text((W + 30, 12), 'Every NPC replaced, palin players included (mockup)', fill=(0, 0, 0))
both.save('/home/claude/px/cast/lof_compare.png')
img.convert('RGB').crop((150, 0, 720, 420)).resize((1140, 840), Image.NEAREST).save('/home/claude/px/cast/lof_zoom.png')
print('ok')
