#!/usr/bin/env python3
"""Word breakdown (desglose) pipeline.

  python3 tools/desglose.py build    parser data -> docs/Kewun_desglose.xlsx (keeps Brandon's edits and approvals)
  python3 tools/desglose.py export   docs/Kewun_desglose.xlsx -> src/desglose.js

Parser data: tools/desglose_parser.json (Verb Parser v168, parse43 + labelES + MEANING.compose),
tools/desglose_roots.json (dictionary definition of each root). Only rows marked Aprobado = sí
reach the player build; the master build also shows the rest, marked with a warning sign.
"""
import json, os, re, sys
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XL = os.path.join(ROOT, 'docs', 'Kewun_desglose.xlsx')
JS = os.path.join(ROOT, 'src', 'desglose.js')
HEAD = ['Palabra', 'Segmentación', 'Raíz (ES)', 'Raíz (EN)', 'Sufijos (ES)', 'Sufijos (EN)',
        'Significado del parser', 'Diccionario (raíz)', 'Raíz en el diccionario', 'Aprobado', 'Notas']
SEP = ' · '
GREEN = '1E6B30'

def short(d):
    d = re.split(r'[.,;:(\']', d or '')[0].strip()
    d = re.sub(r'^(El|La|Los|Las|Un|Una|Lo)\s+', '', d)
    return d[:1].lower() + d[1:] if d else ''

def game_roots():
    s = open(os.path.join(ROOT, 'src', 'state.js'), encoding='utf-8').read()
    out = {}
    for m in re.finditer(r"(\w+):\{m:'([^']+)-?',es:'([^']+)',en:'([^']+)'\}", s):
        out[m.group(2).rstrip('-')] = (m.group(3), m.group(4))
    return out

def parser_rows():
    P = json.load(open(os.path.join(ROOT, 'tools', 'desglose_parser.json'), encoding='utf-8'))
    RD = json.load(open(os.path.join(ROOT, 'tools', 'desglose_roots.json'), encoding='utf-8'))
    GR = game_roots()
    rows = []
    for w, x in P.items():
        if len(x['p']) == 1 and not x['known']:
            continue  # nothing to break down and the parser does not know the word
        r = x['p'][0]
        res = short(RD.get(r, '')) or (x['g'][0] if x['g'] else '')
        ren = ''
        if r in GR:
            res, ren = GR[r]
        rows.append([w, '-'.join(x['p']), res, ren, SEP.join(x['le']), SEP.join(x['len']), x['s'],
                     (RD.get(r) or '')[:120], 'sí' if x['known'] else 'no', '', ''])
    return rows

def build():
    old = {}
    if os.path.exists(XL):
        ws = load_workbook(XL).active
        for row in ws.iter_rows(min_row=3, values_only=True):
            if row and row[0]:
                old[row[0]] = list(row)
    wb = Workbook(); ws = wb.active; ws.title = 'Desglose'
    f = Font(name='Arial', size=10, color=GREEN); fb = Font(name='Arial', size=10, bold=True, color=GREEN)
    ws.append(['Revisión del desglose de palabras. Edita Segmentación (guiones entre morfemas), las glosas '
               '(sufijos separados por " · ", uno por sufijo), y escribe "sí" en Aprobado. Solo las filas '
               'aprobadas aparecen en el juego para los jugadores. Las columnas G a I son del parser, solo de referencia.'])
    ws.merge_cells('A1:K1'); ws['A1'].font = fb; ws['A1'].alignment = Alignment(wrap_text=True); ws.row_dimensions[1].height = 42
    ws.append(HEAD)
    for c in ws[2]:
        c.font = fb; c.fill = PatternFill('solid', fgColor='E3F1E5')
    new = parser_rows()
    seen = set()
    edit = (1, 2, 3, 4, 5, 9, 10)  # columns Brandon may change
    for r in new:
        o = old.get(r[0])
        if o:
            for i in edit:
                if i < len(o) and o[i] not in (None, ''):
                    r[i] = o[i]
        seen.add(r[0]); ws.append(r)
    for w, o in old.items():  # rows the parser no longer produces stay, so no review is lost
        if w not in seen:
            ws.append((o + [''] * 11)[:11])
    unk = PatternFill('solid', fgColor='FFF4D6')
    for row in ws.iter_rows(min_row=3):
        for c in row:
            c.font = f
        if row[8].value == 'no':
            for c in row:
                c.fill = unk
    for col, wd in zip('ABCDEFGHIJK', (18, 22, 16, 16, 44, 40, 34, 40, 10, 10, 30)):
        ws.column_dimensions[col].width = wd
    dv = DataValidation(type='list', formula1='"sí,no"', allow_blank=True)
    ws.add_data_validation(dv); dv.add('J3:J%d' % ws.max_row)
    ws.freeze_panes = 'B3'; ws.auto_filter.ref = 'A2:K%d' % ws.max_row
    wb.save(XL)
    n = ws.max_row - 2; ap = sum(1 for r in ws.iter_rows(min_row=3, values_only=True) if str(r[9] or '').lower() in ('sí', 'si'))
    print('wrote', os.path.relpath(XL, ROOT), n, 'rows,', ap, 'approved')

def export():
    ws = load_workbook(XL).active
    out, bad = {}, []
    for row in ws.iter_rows(min_row=3, values_only=True):
        if not row or not row[0]:
            continue
        w, seg, res, ren, ses, sen = (str(v or '').strip() for v in row[:6])
        ok = str(row[9] or '').strip().lower() in ('sí', 'si', 'yes', 'x', '1')
        parts = [p for p in seg.split('-') if p]
        les = [s.strip() for s in ses.split('·')] if ses else []
        len_ = [s.strip() for s in sen.split('·')] if sen else []
        if len(parts) < 1 or len(les) != len(parts) - 1 or (len_ and len(len_) != len(les)):
            bad.append(w); continue
        out[w.lower()] = {'p': parts, 'r': [res, ren or res], 'm': [[a, (len_[i] if len_ else a)] for i, a in enumerate(les)], 'ok': 1 if ok else 0}
    js = ('/* generated by tools/desglose.py export from docs/Kewun_desglose.xlsx; do not edit by hand */\n'
          'const DESG=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(JS, 'w', encoding='utf-8').write(js)
    print('wrote', os.path.relpath(JS, ROOT), len(out), 'words,', sum(v['ok'] for v in out.values()), 'approved')
    if bad:
        print('skipped (segment and gloss counts differ):', ', '.join(bad))

if __name__ == '__main__':
    {'build': build, 'export': export}[sys.argv[1] if len(sys.argv) > 1 else 'build']()
