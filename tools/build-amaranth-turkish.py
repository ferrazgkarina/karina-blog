# Gera o subset turco da Amaranth (Ğ ğ Ş ş İ).
# Uso: python3 tools/build-amaranth-turkish.py <amaranth-latin-700-normal.woff2> <saida.woff2> <saida.ttf>
# Requer: pip install fonttools brotli. Amaranth: SIL OFL 1.1 (Amaranth Project Authors).
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

src, out_woff2, out_ttf = sys.argv[1:4]
f = TTFont(src)
gs = f.getGlyphSet()
glyf, hmtx = f['glyf'], f['hmtx']

def draw(pen, name, dx=0, dy=0, contour_filter=None):
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    # split recording into contours
    contours, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            contours.append(cur); cur = []
    for i, c in enumerate(contours):
        if contour_filter and not contour_filter(i, c): continue
        tp = TransformPen(pen, (1, 0, 0, 1, dx, dy))
        for op, args in c: getattr(tp, op)(*args)
    return contours

def ymax(c): return max(p[1] for op, a in c for p in a)
def ymin(c): return min(p[1] for op, a in c for p in a)
def xmin(c): return min(p[0] for op, a in c for p in a)
def xmax(c): return max(p[0] for op, a in c for p in a)

def contours_of(name):
    rec = DecomposingRecordingPen(gs); gs[name].draw(rec)
    out, cur = [], []
    for op, a in rec.value:
        cur.append((op, a))
        if op in ('closePath', 'endPath'): out.append(cur); cur = []
    return out

def bbox(name):
    g = glyf[name]; return g.xMin, g.yMin, g.xMax, g.yMax

new = {}  # name -> (unicode, glyph, advance)

# --- ş / Ş : cedilla sob s / S (mesma posição vertical usada em ç / Ç)
ced = bbox('cedilla'); ced_cx = (ced[0] + ced[2]) / 2
for base, name, uni in (('s', 'scedilla', 0x15F), ('S', 'Scedilla', 0x15E)):
    b = bbox(base); dx = (b[0] + b[2]) / 2 - ced_cx
    if base == 'S': dx += 0
    pen = TTGlyphPen(gs)
    draw(pen, base)
    draw(pen, 'cedilla', dx=dx, dy=0)
    new[name] = (uni, pen.glyph(), hmtx[base][0])

# --- İ : I + ponto copiado do "i"
i_conts = contours_of('i')
dot = max(i_conts, key=ymax)
dot_w, dot_h = xmax(dot) - xmin(dot), ymax(dot) - ymin(dot)
Ib = bbox('I'); I_cx = (Ib[0] + Ib[2]) / 2
dot_cx = (xmin(dot) + xmax(dot)) / 2
cap = f['OS/2'].sCapHeight
gap = 70
dot_dy = (cap + gap) - ymin(dot)
pen = TTGlyphPen(gs)
draw(pen, 'I')
tp = TransformPen(pen, (1, 0, 0, 1, I_cx - dot_cx, dot_dy))
for op, a in dot: getattr(tp, op)(*a)
new['Idotaccent'] = (0x130, pen.glyph(), hmtx['I'][0])

# --- ğ / Ğ : breve desenhado (U raso), espessura próxima à do traço do ponto do "i"
def breve_contour(cx, ybase, w=150, depth=105, tw=78, tv=62):
    yt = ybase + depth
    return [
        ('moveTo', ((cx - w, yt),)),
        ('qCurveTo', ((cx - w, ybase), (cx + w, ybase), (cx + w, yt))),
        ('lineTo', ((cx + w - tw, yt),)),
        ('qCurveTo', ((cx + w - tw, ybase + tv), (cx - w + tw, ybase + tv), (cx - w + tw, yt))),
        ('closePath', ()),
    ]
g_conts = contours_of('g')
bowl = max(g_conts, key=ymax)
for base, name, uni, ybase in (('g', 'gbreve', 0x11F, 560), ('G', 'Gbreve', 0x11E, 745)):
    b = bbox(base)
    cx = (b[0] + b[2]) / 2 if base == 'G' else (xmin(bowl) + xmax(bowl)) / 2
    pen = TTGlyphPen(gs)
    draw(pen, base)
    for op, a in breve_contour(cx, ybase):
        getattr(pen, op)(*a)
    new[name] = (uni, pen.glyph(), hmtx[base][0])

order = f.getGlyphOrder()
for name, (uni, glyph, adv) in new.items():
    glyph.recalcBounds(glyf)
    glyf[name] = glyph
    hmtx[name] = (adv, glyph.xMin)
order = list(glyf.glyphOrder)
f.setGlyphOrder(order)
f['maxp'].numGlyphs = len(order)
for t in f['cmap'].tables:
    if t.isUnicode():
        for name, (uni, _, _) in new.items():
            if uni <= 0xFFFF or t.format in (12, 13): t.cmap[uni] = name
f['post'].extraNames = []
f['post'].formatType = 2.0
f['post'].mapping = {}
f.save(out_ttf)
f.flavor = 'woff2'
f.save(out_woff2)
print('ok', list(new))
