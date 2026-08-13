#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère les PDF des guides : couverture pleine page + contenu enrichi
(flux continu, zéro page à moitié vide) + page de fin « Signé par Em ».

Sortie : storage/pdf/NN_slug.pdf  (mappé sur books.ts).
Rendu du contenu via Chromium --print-to-pdf ; assemblage via PyMuPDF.
"""
import os, re, json, html as _html, subprocess, sys, tempfile
import pymupdf

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READER = os.path.join(SITE, 'src', 'data', 'reader')
COVERS = os.path.join(SITE, 'public', 'covers')
OUT = os.path.join(SITE, 'storage', 'pdf')
CLOSING = os.environ.get('CLOSING_PDF')  # PDF 1 page « Signé par Em »
CHROME = subprocess.check_output(
    "ls /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1", shell=True
).decode().strip()

# Page : 8.5 x 12.75 po (ratio 2:3, comme les couvertures 640x960).
PW_PT, PH_PT = 612.0, 918.0

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


CSS = """
@page { size: 8.5in 12.75in; margin: 0.95in 0.85in 0.9in; }
* { box-sizing: border-box; }
html, body { background: #fbfaf8; margin: 0; padding: 0;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Newsreader', Georgia, serif; color: #161311;
  font-size: 11.6pt; line-height: 1.62; }
.dochead { border-bottom: 2px solid #6e1226; padding-bottom: 14pt; margin-bottom: 20pt; }
.dochead .kicker { font-family: 'Inter', sans-serif; font-size: 8pt; letter-spacing: .22em;
  text-transform: uppercase; color: #a9743b; }
.dochead h1 { font-family: 'Fraunces', Georgia, serif; color: #6e1226;
  font-size: 27pt; line-height: 1.08; margin: 8pt 0 6pt; font-weight: 600; }
.dochead .sub { font-family: 'Newsreader', serif; font-style: italic;
  color: #4a3f39; font-size: 12pt; }
h2.chap { font-family: 'Fraunces', Georgia, serif; color: #6e1226; font-size: 17pt;
  margin: 22pt 0 4pt; font-weight: 600; break-after: avoid; }
h2.chap .no { font-family: 'Inter', sans-serif; font-size: 9pt; color: #a9743b;
  letter-spacing: .18em; display: block; margin-bottom: 2pt; }
p { margin: 0 0 8pt; }
.lede { font-size: 12.6pt; line-height: 1.5; color: #4a3f39; font-style: italic;
  border-left: 3px solid #a9743b; padding-left: 12pt; margin: 4pt 0 12pt; break-after: avoid; }
ul, ol { margin: 0 0 10pt 16pt; padding: 0; }
li { margin-bottom: 4pt; padding-left: 3pt; }
ul li::marker { color: #a9743b; }
ol li::marker { color: #6e1226; font-family: 'Inter', sans-serif; }
h3 { font-family: 'Fraunces', serif; color: #6e1226; font-size: 12.5pt; margin: 12pt 0 4pt; break-after: avoid; }
.tip { background: #fff; border: 1px solid #f2ede6; border-left: 4px solid #a9743b;
  border-radius: 0 8px 8px 0; padding: 12pt 14pt; margin: 12pt 0; break-inside: avoid; }
.tip__label { display: block; font-family: 'Inter', sans-serif; font-size: 7.5pt;
  letter-spacing: .18em; text-transform: uppercase; color: #a9743b; margin-bottom: 4pt; }
.tip p { margin: 0; font-style: italic; }
section.chap { break-inside: auto; }
.quiz { border-top: 2px solid #f2ede6; margin-top: 24pt; padding-top: 8pt; }
.q { margin: 0 0 10pt; break-inside: avoid; }
.q .qq { font-weight: 600; margin-bottom: 3pt; }
.q .opt { font-family: 'Inter', sans-serif; font-size: 10pt; margin: 1.5pt 0 1.5pt 8pt; color: #333; }
.answers { break-inside: avoid; background: #f7f3ee; border-radius: 8px; padding: 12pt 14pt; margin-top: 12pt; }
.answers h3 { margin-top: 0; }
.answers .a { font-family: 'Inter', sans-serif; font-size: 9.5pt; margin: 2pt 0; color: #4a3f39; }
p, li { orphans: 2; widows: 2; }
.notes { margin-top: 20pt; }
.notes.newpage { break-before: page; margin-top: 0; }
.notes h2 { font-family: 'Fraunces', serif; color: #6e1226; font-size: 15pt; margin: 0 0 10pt;
  font-weight: 600; break-after: avoid; }
.notes h2 .no { font-family: 'Inter', sans-serif; font-size: 8pt; color: #a9743b;
  letter-spacing: .18em; display: block; margin-bottom: 2pt; }
.noteline { border-bottom: 1px solid #e4dccf; height: 25pt; }
"""

# Hauteurs (pt) pour calculer le remplissage de la dernière page.
LINE_H = 25.0
NOTES_HEADER = 40.0
PAGE_TOP, PAGE_BOT = 0.95 * 72, 0.9 * 72   # marges @page haut/bas
USABLE_H = PH_PT - PAGE_TOP - PAGE_BOT     # hauteur utile d'une page de contenu


def esc(s):
    return _html.escape(str(s), quote=False)


def build_html(num, meta, data, notes_lines=0, notes_newpage=False):
    coll = COLLECTIONS.get(meta['collection'], meta['collection'])
    parts = [f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
<div class="dochead">
  <div class="kicker">Collection {esc(coll)} &middot; Guide N&deg; {num:02d}</div>
  <h1>{esc(meta['title'])}</h1>
  <div class="sub">{esc(meta.get('subtitle',''))}</div>
</div>"""]
    chapters = data['chapters']
    for i, c in enumerate(chapters):
        # L'intro n'a pas de numéro ; les autres oui.
        label = ('' if c['title'] in ('Introduction',) else
                 f"<span class='no'>Chapitre</span>")
        parts.append(f"<section class='chap'><h2 class='chap'>{label}{esc(c['title'])}</h2>{c['html']}</section>")
    # QCM : questions puis corrigé.
    qcm = data.get('qcm', [])
    if qcm:
        parts.append("<section class='quiz'><h2 class='chap'><span class='no'>Pour aller plus loin</span>Quiz — testez-vos connaissances</h2>")
        for i, q in enumerate(qcm):
            opts = ''.join(f"<div class='opt'>{esc(o)}</div>" for o in q['options'])
            parts.append(f"<div class='q'><div class='qq'>{i+1}. {esc(q['q'])}</div>{opts}</div>")
        parts.append("<div class='answers'><h3>Corrigé</h3>")
        for i, q in enumerate(qcm):
            letter = "ABCD"[q['answer']] if 0 <= q['answer'] < 4 else '?'
            parts.append(f"<div class='a'><b>{i+1}. {letter}</b> — {esc(q.get('explanation',''))}</div>")
        parts.append("</div></section>")
    if notes_lines > 0:
        cls = 'notes newpage' if notes_newpage else 'notes'
        lines = ''.join("<div class='noteline'></div>" for _ in range(notes_lines))
        parts.append(f"<section class='{cls}'><h2><span class='no'>À vous de jouer</span>Mes notes</h2>{lines}</section>")
    parts.append("</body></html>")
    return '\n'.join(parts)


def last_page_free_pt(pdf_path):
    """Espace vertical libre (pt) sur la dernière page d'un PDF de contenu."""
    d = pymupdf.open(pdf_path)
    pg = d[d.page_count - 1]
    blocks = [b for b in pg.get_text('blocks') if b[4].strip()]
    ymax = max((b[3] for b in blocks), default=PAGE_TOP)
    d.close()
    return (PH_PT - PAGE_BOT) - ymax


def plan_notes(free_pt):
    """Nombre de lignes de notes (et page neuve ou non) pour remplir le bas
    SANS déborder. On sous-estime (LINE_H majoré + marge d'1 ligne)."""
    est = LINE_H + 0.8           # hauteur réelle d'une ligne, légèrement majorée
    min_inline = NOTES_HEADER + LINE_H + 12   # place min pour header + 1 ligne
    if free_pt >= min_inline:    # remplir la page en cours dès qu'il y a la place
        usable = free_pt - NOTES_HEADER - 12   # 12 = margin-top de .notes
        return max(int(usable // est) - 1, 1), False
    # trop peu de place ici : page « Mes notes » pleine et dédiée
    usable = USABLE_H - NOTES_HEADER
    return max(int(usable // est) - 1, 1), True


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
    img = os.path.join(COVERS, f'{num}.jpg')
    page = doc.new_page(width=PW_PT, height=PH_PT)
    page.insert_image(pymupdf.Rect(0, 0, PW_PT, PH_PT), filename=img, keep_proportion=False)


def assemble(num, meta, content_pdf, final_path):
    out = pymupdf.open()
    cover_page(out, num)                      # 1. couverture pleine page
    content = pymupdf.open(content_pdf)
    out.insert_pdf(content)                   # 2. contenu enrichi
    if CLOSING and os.path.exists(CLOSING):
        clo = pymupdf.open(CLOSING)
        out.insert_pdf(clo)                   # 3. page de fin
    out.save(final_path, deflate=True, garbage=4)
    n = out.page_count; out.close()
    return n


def main(nums, books):
    os.makedirs(OUT, exist_ok=True)
    for num in nums:
        meta = books.get(num)
        data = json.load(open(os.path.join(READER, f'{num}.json'), encoding='utf-8'))
        if not meta:   # ex. 48/49 anglais absents de books.ts
            continue
        tmp_pdf = os.path.join(tempfile.gettempdir(), f'content_{num}.pdf')
        # Passe 1 : contenu sans notes -> mesurer l'espace libre en bas.
        html_to_pdf(build_html(num, meta, data), tmp_pdf)
        n_lines, newpage = plan_notes(last_page_free_pt(tmp_pdf))
        # Passe 2 : contenu + « Mes notes » calibré pour remplir la page.
        html_to_pdf(build_html(num, meta, data, notes_lines=n_lines, notes_newpage=newpage), tmp_pdf)
        final = os.path.join(OUT, f"{num:02d}_{meta['slug']}.pdf")
        pages = assemble(num, meta, tmp_pdf, final)
        size = os.path.getsize(final) // 1024
        tag = f"notes {n_lines}l{'/page' if newpage else ''}"
        print(f"#{num:02d} {meta['title'][:32]:32s} -> {pages:2d} p, {size} Ko, {tag}")


if __name__ == '__main__':
    books = load_books()
    args = sys.argv[1:]
    if args:
        nums = [int(a) for a in args]
    else:
        nums = [n for n in range(1, 51) if n not in (48, 49)]
    main(nums, books)
