"""The people of Santiago, painted with the same method, light and outline as the battle heroes
(tools/hero_paint.py), for the Yewen's defeat: city clothes (hoodies, jackets, jeans, a parka, a sweater),
short or long hair, some with a trarilonko. Side view facing left. Five frames each:
idle, two walking steps, fist thrust high, fist pulled down (the shout).
Output: tools/stgopeople.json (merged into SPR2 as hero_stg_<name> by tools/sprites2.py)."""
import json, os
import numpy as np
import yewen_paint as yp
import hero_paint as hp
from hero_paint import R, blob, legs, head, arm, finish, raise_arm, W, H
from yewen_paint import Canvas, hx, taper

X = {
    'hoodr':  ['#1e0606', '#3c0c0c', '#5c1414', '#7c1e1c', '#9c2c26', '#bc4434', '#d8644c'],
    'denim':  ['#06101e', '#0e1e36', '#18304e', '#22446a', '#2e5a86', '#4474a0', '#6892ba'],
    'jeans':  ['#060a14', '#0c1424', '#142036', '#1c2c48', '#263a5c'],
    'brownj': ['#140a04', '#2a160a', '#422412', '#5a341c', '#744628', '#8e5c38', '#aa784e'],
    'parka':  ['#06140a', '#0c2414', '#14361e', '#1e4a2a', '#2a6038', '#3c7a4a', '#58966a'],
    'wind':   ['#2a1a02', '#4a3006', '#6a480c', '#8c6216', '#ae7e22', '#cc9c38', '#e6bc5c'],
    'sweatp': ['#120818', '#24102e', '#381a46', '#4a2a5a', '#62407a', '#7e5c98', '#a088bc'],
    'greys':  ['#16161a', '#26262c', '#383840', '#4c4c56', '#62626e', '#7c7c88', '#9a9aa6'],
    'khaki':  ['#0c0a06', '#1a160e', '#2a2416', '#3a3220', '#4c422c'],
    'skin2':  ['#2a160c', '#4a2816', '#6c3e22', '#8e5630', '#ac6e40', '#c88a56', '#e0aa78'],
}
X = {k: [hx(c) for c in v] for k, v in X.items()}
LINES = {('face', 'hair'), ('fore', 'arm'), ('hand', 'fore'), ('armf', 'arm'), ('armh', 'armf'), ('armh', 'face'), ('armf', 'face'), ('armh', 'hair'),
         ('farmf', 'farm'), ('farmh', 'farmf'), ('farmh', 'hair'), ('farmf', 'hair'), ('farm', 'hairB'),
         ('top', 'legF'), ('top', 'legB'), ('neck', 'top'), ('arm', 'top'), ('farm', 'top'), ('top', 'hairB'), ('hood', 'top'), ('hood', 'hair'), ('hood', 'hairB'), ('strap', 'top')}

def person(top, pants=None, long_hair=False, hk='hair', old=False, band=False, hood=False, zip_=False, bag=False, skin=None, fr=0, cheer=None):
    """fr: 0 idle, 1 and 3 the two walking steps; cheer: None, 0 (fist high) or 1 (pulled down)"""
    yp.W, yp.H = W, H; c = Canvas()
    saved = {k: R[k] for k in ('pants', 'skin')}
    if pants: R['pants'] = pants
    if skin: R['skin'] = skin
    try:
        legs(c, fr if cheer is None else 0, False)
        # the far arm behind the body when shouting
        if cheer is not None: raise_arm(c, top, cheer, far=True)
        if hood:   # the hood lying on the back
            blob(c, top, lambda d: d.polygon([(27, 22), (33, 22), (36, 30), (33, 34), (28, 32)], fill=1), bulge=0.9, lift=-0.05, name='hood')
        if bag:    # a backpack on the far shoulder
            blob(c, X['khaki'], lambda d: d.rounded_rectangle([30, 28, 38, 44], 2, fill=1), bulge=1.0, lift=-0.05, name='bag')
        blob(c, top, lambda d: d.polygon([(19, 25), (31, 25), (33, 36), (33, 49), (17, 49), (16, 36)], fill=1), bulge=0.85, lift=0.08, name='top')
        for x in range(17, 33): c.px(x, 48, top[1])                                     # the hem
        if zip_:
            for y in range(27, 48): c.px(20, y, R['silver'][2] if y % 2 else top[1])
        else:
            for y in range(31, 47, 4): c.px(29, y, top[1]); c.px(28, y + 1, top[4])   # folds
        c.px(22, 42, top[1]); c.px(23, 42, top[1]); c.px(22, 43, top[4])                # a pocket
        if bag:
            for y in range(25, 40): c.px(25 - (y - 25) // 6, y, X['khaki'][1])
            c.part[25:40, 22:26] = np.where(c.part[25:40, 22:26] == 'top', 'top', c.part[25:40, 22:26])
        head(c, fr if cheer is None else 0, long_hair, hk=hk, old=old, band=band)
        if cheer is not None: raise_arm(c, top, cheer)
        else: arm(c, fr if fr in (0, 1, 3) else 0, top)
        c.inner_lines(LINES | {('bag', 'top'), ('hairB', 'top')})
        c.outline(); return finish(c)
    finally: R.update(saved)

PEOPLE = {
    'joven':   dict(top=X['hoodr'], pants=X['jeans'], hood=True, bag=True),                        # a young man in a red hoodie and jeans
    'mujer':   dict(top=X['denim'], long_hair=True, zip_=True, skin=X['skin2']),                   # a woman in a denim jacket, hair down
    'abuelo':  dict(top=X['brownj'], pants=X['khaki'], hk='grey', old=True, zip_=True),            # an older man in a brown jacket
    'estud':   dict(top=X['parka'], long_hair=True, bag=True, pants=X['jeans']),                   # a student in a green parka with a backpack
    'obrero':  dict(top=X['wind'], pants=X['jeans'], zip_=True, skin=X['skin2']),                  # a worker in a yellow windbreaker
    'lamngen': dict(top=X['sweatp'], long_hair=True, band=True),                                   # a woman in a purple sweater, with a trarilonko
    'persona': dict(top=X['greys'], pants=X['jeans']),                                             # the ordinary person the Yewen leaves behind
}

if __name__ == '__main__':
    from PIL import Image
    here = os.path.dirname(os.path.abspath(__file__)); out = {}; strip = []
    for n, kw in PEOPLE.items():
        imgs = [person(**kw, fr=0), person(**kw, fr=1), person(**kw, fr=3), person(**kw, cheer=0), person(**kw, cheer=1)]
        p, f = yp.encode(imgs); out[n] = {'pal': p, 'f': f}; strip += imgs
    s = np.concatenate(strip, axis=1); Image.fromarray(s).resize((s.shape[1] * 3, s.shape[0] * 3), Image.NEAREST).save('/tmp/ml/stgopeople.png')
    json.dump(out, open(os.path.join(here, 'stgopeople.json'), 'w'))
    print('ok')
