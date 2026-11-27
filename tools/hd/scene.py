"""Compose a preview of the lof screen at 3x (768x672) with the HD pieces."""
import numpy as np
from PIL import Image, ImageDraw
import env, people

W, H = 768, 672
bg = env.grass(W, H)
env.flowers(bg, 40)
env.path_band(bg, 366, 404)
# palin field chalk lines
for x in range(486, W):
    for y in (80, 81, 208, 209): bg[y, x] = env.hx('#e8f0dc')
for y in range(80, 210):
    for x in (486, 487, 690, 691): bg[y, x] = env.hx('#e8f0dc')
shadows = [(213, 402, 16, 5), (357, 210, 16, 5), (420, 354, 14, 5), (470, 470, 16, 5), (600, 560, 16, 5), (300, 560, 14, 5)]
for sh in shadows: env.shadow(bg, *sh)
for (x, y, w, h) in ((110, 330, 150, 126), (160, 520, 150, 126), (60, 40, 150, 126)):
    env.shadow(bg, x, y + h - 6, w * .5, 10)
for (x, y, w, h) in ((110, 160, 150, 126), (110, 456, 150, 126), (160, 646, 150, 126)):
    env.shadow(bg, x + 22, y - 10, w * .5, 16)                  # cast shadows to the lower right
img = Image.fromarray(bg.astype(np.uint8), 'RGB').convert('RGBA')

def put(sp, x, y):  # x,y = bottom centre
    img.alpha_composite(sp, (int(x - sp.width / 2), int(y - sp.height)))

R1 = env.ruka()
put(R1, 110, 160); put(R1, 110, 456); put(R1, 160, 646)
put(env.fire(), 712, 300)
P = {n: f() for n, f in people.ALL.items()}
put(P['kuku'], 213, 404); put(P['weaver'], 357, 212); put(P['child'], 420, 356); put(P['llanka'], 470, 472)
put(P['lonko'], 600, 562); put(P['weaver'], 300, 562)
# forest: a column on the left and the tree line along the bottom
for i, y in enumerate(range(-30, 640, 70)): put(env.tree(seed=i), 10, y + 120)
for i, x in enumerate(range(-20, W + 60, 62)): put(env.tree(seed=20 + i), x, H + 52)
arr = np.array(img.convert('RGB')).astype(float)
arr = env.atmosphere(arr, fires=[(712, 290)])
img = Image.fromarray(arr.astype(np.uint8), 'RGB').convert('RGBA')
img.convert('RGB').save('/home/claude/px/hd/scene_hd.png')

lo = Image.open('/home/claude/px/lo.png').convert('RGB').crop((0, 0, 256, 224)).resize((W, H), Image.NEAREST)
both = Image.new('RGB', (W * 2 + 20, H + 40), (255, 255, 255)); d = ImageDraw.Draw(both)
both.paste(lo, (0, 40)); both.paste(img.convert('RGB'), (W + 20, 40))
d.text((10, 12), 'Now (256x224, scaled 3x)', fill=(0, 0, 0)); d.text((W + 30, 12), 'HD preview (768x672, drawn at 3x)', fill=(0, 0, 0))
both.save('/home/claude/px/hd/compare.png')
print('ok')
