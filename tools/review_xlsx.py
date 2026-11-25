"""Extract every Mapudungun line in Kewün Newen from src/*.js, grouped by stage of the game, into
docs/Kewun_revision_mapudungun.xlsx (Resumen + one tab per stage). Same layout as the Petu Mongeleiñ review book.
Run: python3 tools/review_xlsx.py
Each row: #, speaker, Mapudungun, Spanish gloss, context, Estado (OK / Corregir / Duda), Corrección, Nota.
What is collected:
  - every dialogue line L(who, mapudungun, es, en)
  - every menu or answer label written {m:'...', es/g:...}
  - the answer options of the quizzes (o:[...]), with the correct one marked ✓
  - the battle imperatives the game builds (root + -kil- + -nge/-mu/-mün), and the vocabulary tables
Code inside a line is shown as a placeholder: [nombre] for the player, peñi/lamngen for addr(), {code} otherwise."""
import sys, re, os, json, subprocess
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
def SRC(f): return open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()

# ---------------------------------------------------------------- a small JS reader
def read_str(s, i):
    q = s[i]; j = i + 1; out = ''
    while j < len(s) and s[j] != q:
        if s[j] == '\\' and j + 1 < len(s): out += s[j + 1]; j += 2; continue
        out += s[j]; j += 1
    return out, j + 1
def split_args(s, i):
    """s[i] is just after '(' or '[': return ([arg strings], index after the closing bracket)"""
    close = {'(': ')', '[': ']', '{': '}'}
    depth = 0; args = []; cur = ''; j = i
    while j < len(s):
        ch = s[j]
        if ch in '\'"`':
            k = j; _, j = read_str(s, j); cur += s[k:j]; continue
        if ch in '([{': depth += 1
        elif ch in ')]}':
            if depth == 0: args.append(cur); return args, j + 1
            depth -= 1
        elif ch == ',' and depth == 0: args.append(cur); cur = ''; j += 1; continue
        cur += ch; j += 1
    return args, j
SUBS = [(r"rh\('([^']*)'\)", r' (\1-)'), (r"nm\(\)", '[nombre]'), (r"S\.name", '[nombre]'), (r"addr\([^)]*\)", 'peñi/lamngen'), (r"GR\(([^)]*)\)", r'\1')]
def text(expr):
    """turn a JS string expression into readable text: literals kept, code shown as {code}"""
    expr = expr.strip(); out = ''; j = 0
    if not expr: return ''
    tern = re.match(r"^(?:en|S\.gloss==='en'|LANG==='en')\s*\?\s*('(?:[^'\\]|\\.)*')\s*:\s*('(?:[^'\\]|\\.)*')$", expr)
    if tern: return read_str(tern.group(2), 0)[0]
    while j < len(expr):
        ch = expr[j]
        if ch in '\'"`': lit, j = read_str(expr, j); out += lit; continue
        if ch in '+ \n\t': j += 1; continue
        k = j; depth = 0
        while k < len(expr):
            c = expr[k]
            if c in '\'"`' and depth == 0: break
            if c in '([{': depth += 1
            elif c in ')]}': depth -= 1
            elif c == '+' and depth == 0: break
            if c in '\'"`': _, k = read_str(expr, k); continue
            k += 1
        code = expr[j:k].strip(); j = k
        rep = None
        for pat, r in SUBS:
            if re.fullmatch(pat, code): rep = re.sub(pat, r, code); break
        out += rep if rep is not None else '{' + code + '}'
    return out
HAS_WORD = re.compile(r"[A-Za-zñüÑÜ]{2,}")
def scan(src, ctx=''):
    """rows (who, mapudungun, gloss, context) in source order"""
    rows = []
    for m in re.finditer(r"(?<![\w.$])L\(|[{,]\s*m:\s*|(?<=[,{])\s*o:\s*\[", src):
        tok = m.group(0)
        if tok.endswith('L('):
            args, end = split_args(src, m.end())
            if len(args) < 3: continue
            who, mm, es = text(args[0]), text(args[1]), text(args[2])
            if who == '@': who = '[nombre]'
            if not HAS_WORD.search(mm) or not mm.strip(' .!?…'): continue
            rows.append((who or '(narración)', mm, es, ctx))
        elif 'o:' in tok:
            args, end = split_args(src, m.end())
            opts = []; okset = set()
            for a in args:
                a = a.strip()
                if not a: continue
                if a.startswith('{'):                            # {m:'...', es:'...', ok:1}
                    mm_ = re.search(r"m:\s*(.+?),\s*(?:es|g|en)\s*:", a, re.S)
                    t_ = text(mm_.group(1)) if mm_ else ''
                    if re.search(r"\bok:\s*1", a): okset.add(t_)
                    opts.append(t_)
                else: opts.append(text(a))
            if not opts or not all(HAS_WORD.search(o) for o in opts): continue
            tail = src[end:end + 220]; am = re.match(r"\s*,\s*a:\s*('(?:[^'\\]|\\.)*'|\d+)", tail)
            ans = next(iter(okset)) if okset else None
            if am and ans is None: ans = read_str(am.group(1), 0)[0] if am.group(1)[0] == "'" else (opts[int(am.group(1))] if int(am.group(1)) < len(opts) else None)
            rows.append(('(opciones)', '  ·  '.join(('✓ ' if o == ans else '') + o for o in opts), 'opciones de respuesta; ✓ = la correcta', ctx))
        else:
            # {m:'...', es:'...'} or {m:'...', g: en?'..':'..'}
            j = m.end()
            if j >= len(src) or src[j] not in '\'"`': continue
            k = j; depth = 0
            while k < len(src):
                c = src[k]
                if c in '\'"`': _, k = read_str(src, k); continue
                if c in '([{': depth += 1
                elif c in ')]}':
                    if depth == 0: break
                    depth -= 1
                elif c == ',' and depth == 0: break
                k += 1
            mm = text(src[j:k])
            if not HAS_WORD.search(mm): continue
            rest = src[k:k + 400]
            gm = re.match(r"\s*,\s*(?:es|g)\s*:\s*", rest); gl = ''
            if gm:
                a2, _ = split_args('(' + rest[gm.end():] , 1) if False else (None, None)
                # read one expression up to the next top-level comma/brace
                q = gm.end(); d = 0; e = q
                while e < len(rest):
                    c = rest[e]
                    if c in '\'"`': _, e = read_str(rest, e); continue
                    if c in '([{': d += 1
                    elif c in ')]}':
                        if d == 0: break
                        d -= 1
                    elif c == ',' and d == 0: break
                    e += 1
                gl = text(rest[q:e])
            rows.append(('(menú / opción)', mm, gl, ctx))
    return rows

def blocks(src, pat):
    """split a source into named top-level blocks: function f(...)  /  const X=  /  key:{ (maps)"""
    out = []; ms = list(re.finditer(pat, src, re.M))
    for i, m in enumerate(ms):
        out.append((m.group(1), src[m.start():ms[i + 1].start() if i + 1 < len(ms) else len(src)]))
    return out

# ---------------------------------------------------------------- where each piece of text lives
FILES = {f: SRC(f) for f in os.listdir(os.path.join(ROOT, 'src')) if f.endswith('.js')}
REG_NAMES = {'lafkenche': '1 Lafkenche', 'nagche': '2 Nagche', 'pewenche': '3 Pewenche', 'williche': '4 Williche', 'puelmapu': '5 Puelmapu',
             'ngoyman': '6 Ngoyman y Chumpall', 'chumpall': '6 Ngoyman y Chumpall', 'santiago': '7 Santiago'}
STAGES = [('0 Apertura', 'La escena inicial, la kuku, el camino al lof'),
          ('1 Lafkenche', 'El lof lafkenche, la costa, el primer ngen'),
          ('2 Nagche', 'Tierra nagche: el lof, el río, Witranalwe'),
          ('3 Pewenche', 'Tierra pewenche: pewen, nieve, Cherufe'),
          ('4 Williche', 'Tierra williche: el mar del sur, Kaleuche'),
          ('5 Puelmapu', 'Al otro lado de la cordillera: Walichu'),
          ('6 Ngoyman y Chumpall', 'El gran olvido, el reino de Chumpall, el final, Upewtuwün mapu (el nivel secreto)'),
          ('7 Santiago', 'La waria: plaza, feria, radio, Metro, blocks, los tres guardianes'),
          ('8 Trawün y nütram', 'Lecciones de gramática (trawün) y conversaciones (nütram)'),
          ('9 Piedras y tablillas', 'Las piedras que preguntan, las tablillas de lectura, las preguntas de la machi'),
          ('10 Batalla', 'Sistema de batalla: órdenes, formas generadas, enemigos, diálogos de jefe'),
          ('11 Menús y aprendizaje', 'Pausa, menús, práctica, palin, cofres, tienda, textos comunes'),
          ('12 Vocabulario', 'Raíces, objetos, enemigos, lugares, palabras para nombrar, clima')]
BUCKET = {n: [] for n, _ in STAGES}

maps_src = FILES['maps.js']
mapblocks = blocks(maps_src, r"^([a-z_0-9]+):\{")
fn_region = {}
def refs(txt): return set(re.findall(r"\b([A-Za-z_]\w*)\(", txt))
region_of_map = {}
for name, body in mapblocks:
    rm = re.search(r"region:'([a-z]+)'", body); reg = rm.group(1) if rm else 'lafkenche'
    region_of_map[name] = reg
    BUCKET[REG_NAMES[reg]] += scan(body, 'mapa ' + name)
    for f in refs(body): fn_region.setdefault(f, set()).add(reg)
# Santiago act (waria.js): everything there belongs to Santiago
wsrc = FILES['waria.js']
for name, body in blocks(wsrc, r"^(?:function |const |addMap\(')([A-Za-z_0-9]+)"):
    BUCKET['7 Santiago'] += scan(body, name)
    for f in refs(body): fn_region.setdefault(f, set()).add('santiago')

# scripts.js: each function goes to the land whose maps call it (or whose functions call it)
ssrc = FILES['scripts.js']
sblocks = blocks(ssrc, r"^(?:function |const |let )([A-Za-z_0-9]+)")
calls = {n: refs(b) for n, b in sblocks}
OPEN = {'introScript', 'introAfterTut', 'kukuRupu', 'goTitle'}
LESSON = {'TRAWUN', 'TRAWUN2', 'NUTK', 'NUTK2', 'trawunTalk', 'nutkTalk', 'nutramTalk', 'nNutramTalk', 'pNutramTalk', 'wNutramTalk', 'eNutramTalk'}
for _ in range(4):                                        # let a land flow down to the helpers its functions call
    for n, cs in calls.items():
        if n in fn_region:
            for c in cs:
                if c not in fn_region and c in calls: fn_region[c] = set(fn_region[n])
for n, body in sblocks:
    if n in OPEN: BUCKET['0 Apertura'] += scan(body, n); continue
    if n in LESSON or n.startswith('TRAWUN') or n.startswith('NUTK'): BUCKET['8 Trawün y nütram'] += scan(body, n); continue
    if n in ('STONES', 'TABLETS', 'MACHIQ', 'stoneTalk', 'tabletTalk', 'machiTalk'): BUCKET['9 Piedras y tablillas'] += scan(body, n); continue
    regs = fn_region.get(n, set())
    if len(regs) == 1: BUCKET[REG_NAMES[list(regs)[0]]] += scan(body, n)
    else: BUCKET['11 Menús y aprendizaje'] += scan(body, n)
BUCKET['0 Apertura'] = scan(FILES['cutlogic.js'], 'cutlogic') + BUCKET['0 Apertura']
# the side quests of kompa.js (Nico, Seba, Carmen, Nacho) go to the land where each one lives; the secret level goes with the finale
if 'kompa.js' in FILES:
    for n, body in blocks(FILES['kompa.js'], r"^(?:function |const |MAPS\.)([A-Za-z_0-9]+)"):
        tab = '1 Lafkenche' if n.startswith('nico') else '2 Nagche' if n.startswith('seba') else '4 Williche' if n.startswith('carmen') or n == 'CARMEN' else '7 Santiago' if n.startswith('nacho') else None
        if tab: BUCKET[tab] += scan(body, n)
if 'ngoyun.js' in FILES: BUCKET['6 Ngoyman y Chumpall'] += scan(FILES['ngoyun.js'], 'upewtuwün (nivel secreto)')
BUCKET['10 Batalla'] += scan(FILES['battle.js'], 'battle')
for f in ('learn.js', 'pause.js', 'ui.js', 'maplogic.js', 'mapstate.js', 'boot.js', 'weather.js', 'cutart.js'):
    if f in FILES: BUCKET['11 Menús y aprendizaje'] += scan(FILES[f], f.replace('.js', ''))

# ---------------------------------------------------------------- data the game builds or keeps in tables (read from the built game)
probe = r"""
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage();await p.goto('file://'+process.argv[2]);await p.waitForTimeout(700);
const d=await p.evaluate(()=>{const o={roots:[],items:[],ets:[],maps:[],nw:[],wx:[]};
 for(const r in ROOTS){const R0=ROOTS[r],v=VG[r]||{};const st=R0.m.replace('-','');
   ['nge','mu','mün'].forEach((e,i)=>{o.roots.push([st+e,(v.es||[])[i]||R0.es,r]);o.roots.push([st+'kil'+e,(v.nes||[])[i]||('no: '+R0.es),r])});
   o.items.push(['raíz',R0.m,R0.es])}
 for(const k in ITEMS)o.items.push(['objeto',ITEMS[k].m,ITEMS[k].es]);
 for(const k in ET)if(ET[k].name)o.ets.push([ET[k].name,(typeof BEST!=='undefined'&&BEST[k])?BEST[k][0]:'',k]);
 for(const k in MAPS)o.maps.push([MAPS[k].name||k,MAPS[k].g?MAPS[k].g.es:'',k]);
 if(typeof NW!=='undefined')for(const k in NW)o.nw.push([k,NW[k].es,NW[k].k]);
 if(typeof WXL!=='undefined')for(const k in WXL)o.wx.push([WXL[k][0],WXL[k][1],k,(WXB[k]||[]).join(' · ')]);
 return o});console.log(JSON.stringify(d));await b.close()})();
"""
open('/tmp/_probe.js', 'w').write(probe)
D = json.loads(subprocess.run(['node', '/tmp/_probe.js', os.path.join(ROOT, 'www', 'index.html')], capture_output=True, text=True, cwd='/home/claude').stdout)
BUCKET['10 Batalla'] += [('(forma generada)', m, es, 'raíz ' + r) for m, es, r in D['roots']]
V = []
V += [('Raíz (batalla)', m, es, '') for k, m, es in D['items'] if k == 'raíz']
V += [('Objeto', m, es, '') for k, m, es in D['items'] if k == 'objeto']
V += [('Enemigo', n, (b or '')[:140], k) for n, b, k in D['ets']]
V += [('Lugar', n, g, k) for n, g, k in D['maps']]
V += [('Palabra para nombrar (' + {'mod': 'color/tamaño', 'n': 'sustantivo', 'v': 'verbo'}.get(k, k) + ')', w, es, 'Santiago, nombrar lugares') for w, es, k in D['nw']]
V += [('Clima', w, es, 'saludo: ' + b) for w, es, k, b in D['wx']]
BUCKET['12 Vocabulario'] = V

def norm(t, apertura=False):
    t = '' if t is None else str(t)
    t = re.sub(r'(^|[\s«"¡¿(])@(?=[\s.,!?»")]|$)', r'\1[nombre]', t)
    t = re.sub(r'(^|[\s✓·]\s?)0 (ping)', r'\1[nombre] \2', t)
    t = re.sub(r'(llamo|llamas|llama|name is) 0\b', r'\1 [nombre]', t)
    if apertura: t = t.replace('{n}', '[nombre]')
    return t
for name in BUCKET:
    BUCKET[name] = [(norm(w), norm(m, name.startswith('0')), norm(e, name.startswith('0')), norm(c)) for w, m, e, c in BUCKET[name]
                    if HAS_WORD.search(re.sub(r'\{[^{}]*\}', '', str(m)))]
# ---------------------------------------------------------------- de-duplicate: a line is listed once, under the first stage that has it
seen = set(); FINAL = []
for name, desc in STAGES:
    out = []
    for who, mm, es, ctx in BUCKET[name]:
        k = (mm.strip(), es.strip())
        if k in seen: continue
        seen.add(k); out.append((who, mm, es, ctx))
    FINAL.append((name, desc, out))

# ---------------------------------------------------------------- carry over a previous review: python3 tools/review_xlsx.py PREVIOUS.xlsx
# A row keeps its OK when its Mapudungun is unchanged; a line rewritten from a correction is marked OK with a note
# saying what it was; a line that was not in the previous book is marked as new. Unmarked rows stay unmarked.
import difflib
MARKS = {}
def _nr(t): return re.sub(r' \([^()]*-\)$', '', str(t or ''))          # a fill-in's hint without its root
def _k(t): return re.sub(r'[^a-zñüäëïöáéíóú\[\]]+', ' ', str(t or '').lower()).strip()
if len(sys.argv) > 1:
    from openpyxl import load_workbook
    old = load_workbook(sys.argv[1]); prev = {}; corr = []; done_tabs = set()
    for ws in old.worksheets[1:]:
        rows = [r for r in ws.iter_rows(min_row=5, values_only=True) if r[0] is not None]
        reviewed = any((r[5] or '').strip() for r in rows) or ws.title.startswith('0 ')   # tab 0 came back with nothing to correct
        if reviewed: done_tabs.add(ws.title)
        for r in rows:
            st, fix, note = (r[5] or '').strip(), (r[6] or ''), (r[7] or '')
            keys = ((_k(r[2]), _k(r[3])), _k(r[2])) if '___' not in str(r[2]) else ((_k(r[2]), _k(_nr(r[3]))), ('gap', _k(_nr(r[3]))))
            for key in keys:        # by line and gloss, and by line alone (fill-ins: by their hint); a reviewed tab wins over an unreviewed one
                if key not in prev or (reviewed and not prev[key][4]): prev[key] = (st, fix, note, ws.title, reviewed, r[2])
            if fix: corr.append((_k(fix), r[2], ws.title))
    for name, desc, rows in FINAL:
        for who, mm, es, ctx in rows:
            if any(w in str(mm) + str(es) for w in ('ngülliwtukeyngün', 'kawelltukeymi', 'Kawelltuken', '(ngülliwtu-)', '(kawelltu-)')) or str(mm).startswith('Chem am ta "'):
                MARKS[(name, mm)] = ('OK', '', 'Tu forma (24 nov).'); continue
            k = _k(mm); kk = (k, _k(es))
            if '___' in str(mm):
                kk = (k, _k(_nr(es)))
                if kk in prev: k = kk
                elif ('gap', _k(_nr(es))) in prev:
                    st, fix, note, tab, reviewed, oldl = prev[('gap', _k(_nr(es)))]
                    MARKS[(name, mm)] = (st if not fix else '', '', 'La palabra va entera; la raíz está en la pista (solo en modo normal). Antes: ' + str(oldl)); continue
                else: k = ('nogap', k)
            elif kk in prev: k = kk
            if str(mm).startswith('Feypienew fentreke che'): MARKS[(name, mm)] = ('OK', '', 'Tu línea; va sin traducción a propósito.'); continue
            if k in prev:
                st, fix, note, tab, reviewed, _ = prev[k]
                if reviewed and not fix: MARKS[(name, mm)] = ('OK' if (st == 'OK' or tab.startswith('0 ')) else st, '', note); continue
                if reviewed and fix: MARKS[(name, mm)] = ('', '', 'Tu corrección todavía no está aplicada aquí: ' + str(fix)); continue
                MARKS[(name, mm)] = ('', '', note); continue
            k = _k(mm); kn = k.replace('[nombre]', '').strip(' ')
            hit = next((c for c in corr if len(c[0]) >= 6 and c[0] in k), None)
            if hit and kn != k and hit[0] not in kn.replace(' ', ''):
                pass
            if hit and '[nombre]' in k and _k(hit[0]) != k:
                MARKS[(name, mm)] = ('', '', 'Tu corrección «' + str(hit[0]) + '», pero se mantuvo el nombre del personaje: revisa. Antes: ' + str(hit[1])); continue
            if hit:
                MARKS[(name, mm)] = ('OK', '', 'Corregido (24 nov), con tu forma «' + str(hit[0]) + '». Antes: ' + str(hit[1])); continue
            best = max(corr, key=lambda c: difflib.SequenceMatcher(None, k, c[0]).ratio(), default=None)
            if best and difflib.SequenceMatcher(None, k, best[0]).ratio() >= .86:
                MARKS[(name, mm)] = ('OK', '', 'Corregido (24 nov). Antes: ' + str(best[1])); continue
            MARKS[(name, mm)] = ('', '', 'Nuevo desde la versión anterior.')
# ---------------------------------------------------------------- the workbook (same layout as Petu Mongeleiñ)
HDR = ['#', 'Hablante', 'Mapudungun', 'Glosa (castellano)', 'Contexto', 'Estado', 'Corrección', 'Nota']
thin = Side(style='thin', color='BBBBBB'); BD = Border(left=thin, right=thin, top=thin, bottom=thin)
def sheet(wb, name, desc, rows):
    ws = wb.create_sheet(name[:31]); ws.sheet_properties.tabColor = '2F8D4A'
    ws['A1'] = name + ' · ' + desc; ws['A1'].font = Font(name='Arial', bold=True, size=12, color='1E5A32')
    ws['A2'] = 'Marca Estado en cada fila (OK / Corregir / Duda); escribe la forma correcta en Corrección. Solo las columnas F–H se rellenan; el resto viene del código.'
    ws['A2'].font = Font(name='Arial', italic=True, size=9, color='555555')
    for j, h in enumerate(HDR, 1):
        c = ws.cell(row=4, column=j, value=h); c.font = Font(name='Arial', bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='2F8D4A')
        c.alignment = Alignment(vertical='center', wrap_text=True); c.border = BD
    for i, (who, mm, es, ctx) in enumerate(rows, 1):
        r = 4 + i
        st, fx, nt = MARKS.get((name, mm), ('', '', ''))
        for j, v in enumerate([i, who, mm, es, ctx, st, fx, nt], 1):
            c = ws.cell(row=r, column=j, value=v); c.font = Font(name='Arial', size=10); c.alignment = Alignment(wrap_text=True, vertical='top'); c.border = BD
        for j in (6, 7, 8): ws.cell(row=r, column=j).fill = PatternFill('solid', fgColor='FFFFE0')
    n = len(rows)
    dv = DataValidation(type='list', formula1='"OK,Corregir,Duda"', allow_blank=True); ws.add_data_validation(dv); dv.add(f'F5:F{4 + max(1, n)}')
    for col, w in zip('ABCDEFGH', [5, 18, 52, 52, 22, 11, 40, 30]): ws.column_dimensions[col].width = w
    ws.freeze_panes = 'A5'
    return n
def build(path, stages):
    wb = Workbook(); ws = wb.active; ws.title = 'Resumen'
    ws['A1'] = 'Kewün Newen · revisión del mapudungun'; ws['A1'].font = Font(name='Arial', bold=True, size=14, color='1E5A32')
    ws['A2'] = 'Generado desde src/*.js por tools/review_xlsx.py. Cada línea aparece una vez, en la primera etapa que la usa. Las formas que arma la batalla están en 10 Batalla; las listas de palabras, en 12 Vocabulario.'
    ws['A2'].font = Font(name='Arial', italic=True, size=9)
    for j, h in enumerate(['Etapa', 'Líneas', 'OK', 'Corregir', 'Duda', 'Sin revisar'], 1):
        c = ws.cell(row=4, column=j, value=h); c.font = Font(name='Arial', bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='2F8D4A'); c.border = BD
    for i, (name, desc, rows) in enumerate(stages):
        n = sheet(wb, name, desc, rows); r = 5 + i; sn = "'" + name[:31] + "'"; last = 4 + max(1, n)
        ws.cell(row=r, column=1, value=name); ws.cell(row=r, column=2, value=f'=COUNTA({sn}!C5:C{last})')
        ws.cell(row=r, column=3, value=f'=COUNTIF({sn}!F5:F{last},"OK")'); ws.cell(row=r, column=4, value=f'=COUNTIF({sn}!F5:F{last},"Corregir")')
        ws.cell(row=r, column=5, value=f'=COUNTIF({sn}!F5:F{last},"Duda")'); ws.cell(row=r, column=6, value=f'=B{r}-C{r}-D{r}-E{r}')
        for j in range(1, 7): ws.cell(row=r, column=j).font = Font(name='Arial', size=10); ws.cell(row=r, column=j).border = BD
    R = 5 + len(stages); ws.cell(row=R, column=1, value='Total').font = Font(name='Arial', bold=True)
    for j, col in zip(range(2, 7), 'BCDEF'): ws.cell(row=R, column=j, value=f'=SUM({col}5:{col}{R - 1})').font = Font(name='Arial', bold=True)
    for col, w in zip('ABCDEF', [26, 10, 10, 12, 10, 12]): ws.column_dimensions[col].width = w
    wb.save(path)
os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
build(os.path.join(ROOT, 'docs', 'Kewun_revision_mapudungun.xlsx'), FINAL)
for name, desc, rows in FINAL: print(name, len(rows))
