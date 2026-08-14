#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère les PDF des guides.

Règles de mise en page (demandées) :
- Couverture pleine page (page 1) + page de fin « Signé par Em » (dernière).
- CHAQUE partie démarre en haut d'une nouvelle page (titre en haut).
- Le « Conseil d'Emilie » est à la FIN de sa partie (même page, jamais orphelin).
- Le QCM démarre en haut d'une page ; le corrigé sur sa page ; Ressources à part.
- Fond crème chaud UNIFORME (#f6ede8, comme la page de fin) : aucun cadre blanc.
"""
import os, re, json, html as _html, subprocess, sys, tempfile
import pymupdf

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READER = os.path.join(SITE, 'src', 'data', 'reader')
COVERS = os.path.join(SITE, 'public', 'covers')
OUT = os.path.join(SITE, 'storage', 'pdf')
CLOSING = os.environ.get('CLOSING_PDF')
CHROME = subprocess.check_output(
    "ls /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1", shell=True
).decode().strip()

PW_PT, PH_PT = 612.0, 918.0          # 8.5 x 12.75 po (ratio des couvertures)
CREAM = '#f6ede8'                     # crème chaud = fond de la page de fin

COLLECTIONS = {
    'ACHETEURS': 'Acheteurs', 'VENDEURS': 'Vendeurs', 'INVESTISSEURS': 'Investisseurs',
    'QUEBEC_LEGAL': 'Québec & Légal', 'SITUATIONS': 'Situations de vie', 'NICHE': 'Niche',
}


def load_books():
    bt = open(os.path.join(SITE, 'src', 'data', 'books.ts'), encoding='utf-8').read()
    objs = re.findall(
        r'"number":\s*(\d+),\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",'
        r'\s*"subtitle":\s*"([^"]*)",\s*"collection":\s*"([^"]+)"', bt)
    return {int(n): dict(slug=s, title=t, subtitle=sub, collection=c)
            for n, s, t, sub, c in objs}


CSS = f"""
@page {{ size: 8.5in 12.75in; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ background: {CREAM}; margin: 0; padding: 0;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Newsreader', Georgia, serif; color: #201a17;
  font-size: 13.5pt; line-height: 1.78; }}

/* Une PARTIE = une page pleine, crème bord à bord, texte en retrait. */
.page {{ break-before: page; background: {CREAM}; min-height: 12.75in;
  padding: 1in 0.95in 0.95in; }}
.page.first {{ break-before: auto; }}
.secmark {{ font-size: 1px; color: {CREAM}; line-height: 0; }}
/* Compactage auto (anti-orphelin) : resserre une partie qui déborde d'un cheveu. */
.page.compact {{ font-size: 12.5pt; line-height: 1.62; }}
.page.compact p {{ margin: 0 0 8pt; }}
.page.compact .lede {{ margin: 8pt 0 10pt; font-size: 13.5pt; }}
.page.compact ul, .page.compact ol {{ margin: 0 0 9pt 18pt; }}
.page.compact li {{ margin-bottom: 4pt; }}
.page.compact h3 {{ margin: 11pt 0 4pt; }}
.page.compact .tip {{ margin-top: 14pt; }}
.page.compact .q {{ margin-bottom: 9pt; }}
.page.compact .q .opt {{ margin: 2pt 0 2pt 12pt; font-size: 10.5pt; }}
.page.compact .answers .a {{ margin: 2.5pt 0; font-size: 10.5pt; }}

.dochead {{ border-bottom: 2px solid #6e1226; padding-bottom: 18pt; margin-bottom: 30pt; }}
.dochead .kicker {{ font-family: 'Inter', sans-serif; font-size: 9pt; letter-spacing: .22em;
  text-transform: uppercase; color: #a9743b; }}
.dochead h1 {{ font-family: 'Fraunces', Georgia, serif; color: #6e1226;
  font-size: 34pt; line-height: 1.06; margin: 12pt 0 10pt; font-weight: 600; }}
.dochead .sub {{ font-family: 'Newsreader', serif; font-style: italic; color: #4a3f39; font-size: 15pt; }}

h2.part {{ font-family: 'Fraunces', Georgia, serif; color: #6e1226; font-size: 25pt;
  margin: 0 0 8pt; font-weight: 600; line-height: 1.12; break-after: avoid; }}
h2.part .no {{ font-family: 'Inter', sans-serif; font-size: 9.5pt; color: #a9743b;
  letter-spacing: .2em; text-transform: uppercase; display: block; margin-bottom: 8pt; }}

p {{ margin: 0 0 12pt; }}
.lede {{ font-size: 15pt; line-height: 1.55; color: #4a3f39; font-style: italic;
  border-left: 3px solid #a9743b; padding-left: 15pt; margin: 12pt 0 18pt; break-after: avoid; }}
ul, ol {{ margin: 0 0 14pt 18pt; padding: 0; }}
li {{ margin-bottom: 7pt; padding-left: 4pt; }}
ul li::marker {{ color: #a9743b; }}
ol li::marker {{ color: #6e1226; font-family: 'Inter', sans-serif; }}
h3 {{ font-family: 'Fraunces', serif; color: #6e1226; font-size: 14.5pt; margin: 18pt 0 6pt; break-after: avoid; }}

/* Conseil d'Emilie : intégré au crème (pas de boîte blanche), filet doré. */
.tip {{ background: transparent; border: 0; border-left: 4px solid #a9743b;
  padding: 4pt 0 4pt 16pt; margin: 22pt 0 0; break-inside: avoid; }}
.tip__label {{ display: block; font-family: 'Inter', sans-serif; font-size: 8.5pt;
  letter-spacing: .2em; text-transform: uppercase; color: #a9743b; margin-bottom: 6pt; }}
.tip p {{ margin: 0; font-style: italic; color: #4a3f39; }}
.corrige-h {{ margin-top: 22pt; }}

.q {{ margin: 0 0 15pt; break-inside: avoid; }}
.q .qq {{ font-weight: 600; margin-bottom: 5pt; }}
.q .opt {{ font-family: 'Inter', sans-serif; font-size: 11.5pt; margin: 3pt 0 3pt 12pt; color: #333; }}
.answers .a {{ font-family: 'Inter', sans-serif; font-size: 11.5pt; margin: 4pt 0; color: #4a3f39; }}
p, li {{ orphans: 2; widows: 2; }}
"""


def esc(s):
    return _html.escape(str(s), quote=False)


def build_html(num, meta, data, compact=frozenset()):
    coll = COLLECTIONS.get(meta['collection'], meta['collection'])
    chapters = data['chapters']
    intro = chapters[0]
    plan = chapters[-2]
    lexique = chapters[-1]
    core = chapters[1:-2]
    qcm = data.get('qcm', [])

    P = []
    _idx = [0]

    def sec(inner):
        i = _idx[0]; _idx[0] += 1
        cls = 'page first' if i == 0 else 'page'
        if i in compact:
            cls += ' compact'
        return f"<section class='{cls}'><span class='secmark'>&sect;{i}&sect;</span>{inner}</section>"

    # Page 1 de contenu : en-tête du guide + Introduction.
    P.append(sec(
        f"<div class='dochead'><div class='kicker'>Collection {esc(coll)} &middot; Guide N&deg; {num:02d}</div>"
        f"<h1>{esc(meta['title'])}</h1><div class='sub'>{esc(meta.get('subtitle',''))}</div></div>"
        f"{intro['html']}"))
    # Une page par chapitre de fond (conseil inclus en fin de son html).
    for c in core:
        P.append(sec(f"<h2 class='part'><span class='no'>Chapitre</span>{esc(c['title'])}</h2>{c['html']}"))
    # Plan d'action : page à part.
    P.append(sec(f"<h2 class='part'><span class='no'>En pratique</span>{esc(plan['title'])}</h2>{plan['html']}"))
    # Ressources & lexique : page à part.
    P.append(sec(f"<h2 class='part'><span class='no'>Références</span>{esc(lexique['title'])}</h2>{lexique['html']}"))
    # QCM : démarre en haut d'une page ; questions PUIS corrigé coulent en
    # continu (pas de page de quiz à moitié vide).
    if qcm:
        qs = []
        for i, q in enumerate(qcm):
            opts = ''.join(f"<div class='opt'>{esc(o)}</div>" for o in q['options'])
            qs.append(f"<div class='q'><div class='qq'>{i+1}. {esc(q['q'])}</div>{opts}</div>")
        ans = []
        for i, q in enumerate(qcm):
            letter = "ABCD"[q['answer']] if 0 <= q['answer'] < 4 else '?'
            ans.append(f"<div class='a'><b>{i+1}. {letter}</b> — {esc(q.get('explanation',''))}</div>")
        P.append(sec(
            f"<h2 class='part'><span class='no'>Pour aller plus loin</span>Quiz — testez-vos connaissances</h2>"
            f"{''.join(qs)}"
            f"<h3 class='corrige-h'>Corrigé</h3><div class='answers'>{''.join(ans)}</div>"))

    return (f"<!doctype html><html lang='fr'><head><meta charset='utf-8'>"
            f"<link href='https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet'>"
            f"<style>{CSS}</style></head><body>{''.join(P)}</body></html>")


def html_to_pdf(html_str, out_pdf):
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(html_str); html_path = f.name
    prof = tempfile.mkdtemp()
    cmd = [CHROME, '--headless', '--no-sandbox', '--disable-gpu',
           f'--user-data-dir={prof}', '--no-pdf-header-footer',
           f'--print-to-pdf={out_pdf}', f'file://{html_path}']
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    os.remove(html_path)


def cover_page(doc, num):
    page = doc.new_page(width=PW_PT, height=PH_PT)
    page.insert_image(pymupdf.Rect(0, 0, PW_PT, PH_PT), filename=os.path.join(COVERS, f'{num}.jpg'), keep_proportion=False)


def assemble(num, meta, content_pdf, final_path):
    out = pymupdf.open()
    cover_page(out, num)
    out.insert_pdf(pymupdf.open(content_pdf))
    if CLOSING and os.path.exists(CLOSING):
        out.insert_pdf(pymupdf.open(CLOSING))
    out.save(final_path, deflate=True, garbage=4)
    n = out.page_count; out.close()
    return n


def orphan_sections(pdf_path):
    """Sections dont le contenu déborde en laissant une page quasi vide
    (typiquement le conseil seul). Détecté via les marqueurs §i§."""
    import re as _re
    d = pymupdf.open(pdf_path)
    # page de début de chaque section
    start = {}
    for pno in range(d.page_count):
        for m in _re.findall(r'§(\d+)§', d[pno].get_text()):
            start.setdefault(int(m), pno)
    fills = []
    for pno in range(d.page_count):
        pg = d[pno]; H = pg.rect.height
        ymax = max((b[3] for b in pg.get_text('blocks') if b[4].strip()), default=0)
        fills.append(ymax / H)
    d.close()
    order = sorted(start)
    bad = set()
    for k, i in enumerate(order):
        p0 = start[i]
        p1 = start[order[k + 1]] - 1 if k + 1 < len(order) else len(fills) - 1
        if p1 > p0 and fills[p1] < 0.45:      # occupe >1 page et dernière quasi vide
            bad.add(i)
    return bad


def main(nums, books):
    os.makedirs(OUT, exist_ok=True)
    for num in nums:
        meta = books.get(num)
        if not meta:
            continue
        data = json.load(open(os.path.join(READER, f'{num}.json'), encoding='utf-8'))
        tmp = os.path.join(tempfile.gettempdir(), f'content_{num}.pdf')
        compact = set()
        for _ in range(3):                     # jusqu'à 3 passes de compactage
            html_to_pdf(build_html(num, meta, data, compact), tmp)
            bad = orphan_sections(tmp)
            new = bad - compact
            if not new:
                break
            compact |= new
        final = os.path.join(OUT, f"{num:02d}_{meta['slug']}.pdf")
        pages = assemble(num, meta, tmp, final)
        tag = f", compact {sorted(compact)}" if compact else ""
        print(f"#{num:02d} {meta['title'][:30]:30s} -> {pages:2d} p, {os.path.getsize(final)//1024} Ko{tag}")


if __name__ == '__main__':
    books = load_books()
    args = [int(a) for a in sys.argv[1:]]
    nums = args if args else [n for n in range(1, 51) if n not in (48, 49)]
    main(nums, books)
