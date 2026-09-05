#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère les PDF ANGLAIS des guides (éditions téléchargeables en anglais).

Le contenu vient de src/data/reader-en/<n>.json et les métadonnées de
scripts/en_meta.json (titre, sous-titre, collection en anglais).

Les couvertures photo (public/covers) portent un titre FRANÇAIS gravé dans
l'image : on génère donc ici une couverture TYPOGRAPHIQUE anglaise, dans la
même identité visuelle que l'intérieur (crème, bordeaux, or, Fraunces).

Sortie : storage/pdf/en/<NN>_<slug>.pdf
Prérequis : pymupdf + Chromium (déjà présent dans l'environnement).
"""
import os, re, json, html as _html, subprocess, sys, tempfile
import pymupdf

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READER = os.path.join(SITE, 'src', 'data', 'reader-en')
META = os.path.join(SITE, 'scripts', 'en_meta.json')
OUT = os.path.join(SITE, 'storage', 'pdf', 'en')
CHROME = subprocess.check_output(
    "ls /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1", shell=True
).decode().strip()

PW_PT, PH_PT = 612.0, 918.0          # 8.5 x 12.75 po (ratio des couvertures)
CREAM = '#f6ede8'


def load_meta():
    data = json.load(open(META, encoding='utf-8'))
    return {int(m['number']): m for m in data}


CSS = f"""
@page {{ size: 8.5in 12.75in; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ background: {CREAM}; margin: 0; padding: 0;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Newsreader', Georgia, serif; color: #201a17;
  font-size: 13.5pt; line-height: 1.78; }}

.page {{ break-before: page; background: {CREAM}; min-height: 12.75in;
  padding: 1in 0.95in 0.95in; }}
.page.first {{ break-before: auto; }}
.secmark {{ font-size: 1px; color: {CREAM}; line-height: 0; }}
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

/* ---- Couverture typographique anglaise ---- */
.cover {{ break-after: page; background: {CREAM}; min-height: 12.75in;
  padding: 1.15in 0.95in 0.9in; display: flex; flex-direction: column; }}
.cover-top {{ display: flex; justify-content: space-between; align-items: flex-start; }}
.wordmark {{ font-family: 'Parisienne', cursive; color: #6e1226; font-size: 40pt; line-height: 0.9; }}
.wordmark .par {{ font-family: 'Inter', sans-serif; font-size: 9pt; letter-spacing: .22em;
  text-transform: uppercase; color: #a9743b; display: block; margin: 2pt 0 0 6pt; }}
.cover-no {{ font-family: 'Inter', sans-serif; font-size: 13pt; letter-spacing: .12em;
  color: #6e1226; padding-left: 16pt; border-left: 2px solid #6e1226; }}
.cover-collection {{ margin-top: 1.05in; font-family: 'Inter', sans-serif; font-size: 11pt;
  letter-spacing: .26em; text-transform: uppercase; color: #a9743b; }}
.cover-title {{ font-family: 'Fraunces', Georgia, serif; color: #201a17; font-size: 50pt;
  line-height: 1.02; margin: .26in 0 0; font-weight: 600; }}
.cover-rule {{ width: 66pt; height: 2px; background: #a9743b; margin: .32in 0 0; }}
.cover-sub {{ font-family: 'Newsreader', serif; font-style: italic; color: #4a3f39;
  font-size: 18pt; line-height: 1.4; margin-top: .28in; max-width: 5in; }}
.cover-spacer {{ flex: 1; }}
.cover-edition {{ font-family: 'Inter', sans-serif; font-size: 11pt; letter-spacing: .22em;
  text-transform: uppercase; color: #6e1226; }}

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

.tip {{ background: transparent; border: 0; border-left: 4px solid #a9743b;
  padding: 4pt 0 4pt 16pt; margin: 22pt 0 0; break-inside: avoid; }}
.tip__label {{ display: block; font-family: 'Inter', sans-serif; font-size: 8.5pt;
  letter-spacing: .2em; text-transform: uppercase; color: #a9743b; margin-bottom: 6pt; }}
.tip p {{ margin: 0; font-style: italic; color: #4a3f39; }}
.corrige-h {{ margin-top: 22pt; }}

.legal-wrap {{ max-width: 5.2in; margin: 1.4in auto 0; text-align: center; }}
.legal-kicker {{ font-family: 'Inter', sans-serif; font-size: 9pt; letter-spacing: .24em;
  text-transform: uppercase; color: #a9743b; margin-bottom: 14pt; }}
.legal-title {{ font-family: 'Fraunces', Georgia, serif; color: #6e1226; font-size: 30pt;
  font-weight: 600; margin: 0 0 22pt; }}
.legal-notice {{ font-family: 'Newsreader', serif; font-size: 13.5pt; line-height: 1.75;
  color: #2f2621; text-align: left; margin: 0; }}
.legal-rule {{ width: 64pt; height: 2px; background: #a9743b; margin: 30pt auto; }}
.legal-copyright {{ font-family: 'Inter', sans-serif; font-size: 9.5pt; line-height: 1.65;
  color: #6b5d52; text-align: left; margin: 0; }}
.legal-ref {{ font-family: 'Inter', sans-serif; font-size: 8.5pt; letter-spacing: .04em;
  color: #9a8b7d; margin-top: 24pt; }}

/* Page de clôture */
.closing {{ break-before: page; background: {CREAM}; min-height: 12.75in;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 1in; }}
.closing .wordmark {{ font-size: 52pt; }}
.closing .thanks {{ font-family: 'Newsreader', serif; font-style: italic; font-size: 16pt;
  color: #4a3f39; margin-top: 26pt; max-width: 4.4in; }}
.closing .cref {{ font-family: 'Inter', sans-serif; font-size: 8.5pt; letter-spacing: .06em;
  color: #9a8b7d; margin-top: 34pt; }}

.q {{ margin: 0 0 15pt; break-inside: avoid; }}
.q .qq {{ font-weight: 600; margin-bottom: 5pt; }}
.q .opt {{ font-family: 'Inter', sans-serif; font-size: 11.5pt; margin: 3pt 0 3pt 12pt; color: #333; }}
.answers .a {{ font-family: 'Inter', sans-serif; font-size: 11.5pt; margin: 4pt 0; color: #4a3f39; }}
p, li {{ orphans: 2; widows: 2; }}
"""

LABELS = dict(
    chapter='Chapter', practice='In practice', references='References',
    further='Going further', quiz='Quiz — test your knowledge', answers='Answer key',
    legal_kicker='Read before you begin', legal_title='Important notice',
    guide_no='Guide No.', edition='2026 Edition',
)

AVIS = ("This guide is provided for informational and educational purposes only. It offers "
        "general information about real estate in Quebec and does not constitute personalized "
        "real estate, legal, tax or financial advice. As every real estate situation is "
        "different, it is recommended that you consult the appropriate professionals before "
        "making any decision regarding a real estate transaction.")

COPYRIGHT = ("© 2026 Émilie Cauvier — La Bibliothèque. All rights reserved. "
             "Any reproduction, distribution, sharing or resale, in whole or in part, by any "
             "means whatsoever, is strictly prohibited without prior written authorization. "
             "This guide is intended for the personal use of the purchaser.")

THANKS = ("Thank you for reading. May this guide help you decide with confidence, "
          "with all the information in hand.")


def esc(s):
    return _html.escape(str(s), quote=False)


def cover_block(num, meta):
    return (
        "<section class='cover'>"
        "<div class='cover-top'>"
        "<div class='wordmark'>Signé<span class='par'>par</span>Em</div>"
        f"<div class='cover-no'>N&deg; {num:02d}</div>"
        "</div>"
        f"<div class='cover-collection'>Collection &middot; {esc(meta['collection'])}</div>"
        f"<h1 class='cover-title'>{esc(meta['title'])}</h1>"
        "<div class='cover-rule'></div>"
        f"<div class='cover-sub'>{esc(meta.get('subtitle',''))}</div>"
        "<div class='cover-spacer'></div>"
        f"<div class='cover-edition'>{LABELS['edition']}</div>"
        "</section>")


def legal_block(num, meta):
    return (
        "<div class='legal-wrap'>"
        f"<div class='legal-kicker'>{LABELS['legal_kicker']}</div>"
        f"<h2 class='legal-title'>{LABELS['legal_title']}</h2>"
        f"<p class='legal-notice'>{esc(AVIS)}</p>"
        "<div class='legal-rule'></div>"
        f"<p class='legal-copyright'>{esc(COPYRIGHT)}</p>"
        f"<p class='legal-ref'>{esc(meta['title'])} &middot; Collection {esc(meta['collection'])} "
        f"&middot; {LABELS['guide_no']} {num:02d} &middot; {LABELS['edition']}</p>"
        "</div>")


def closing_block():
    return (
        "<section class='closing'>"
        "<div class='wordmark'>Signé<span class='par'>par</span>Em</div>"
        f"<p class='thanks'>{esc(THANKS)}</p>"
        f"<p class='cref'>{esc(COPYRIGHT)}</p>"
        "</section>")


def build_html(num, meta, data, compact=frozenset()):
    chapters = data['chapters']
    intro = chapters[0]
    plan = chapters[-2] if len(chapters) >= 2 else None
    lexique = chapters[-1] if len(chapters) >= 3 else None
    core = chapters[1:-2] if len(chapters) >= 3 else chapters[1:]
    qcm = data.get('qcm', [])

    P = [cover_block(num, meta)]
    _idx = [0]

    def sec(inner):
        i = _idx[0]; _idx[0] += 1
        cls = 'page first' if i == 0 else 'page'
        if i in compact:
            cls += ' compact'
        return f"<section class='{cls}'><span class='secmark'>&sect;{i}&sect;</span>{inner}</section>"

    # Avis important + copyright (juste après la couverture).
    P.append(sec(legal_block(num, meta)))
    # En-tête + introduction.
    P.append(sec(
        f"<div class='dochead'><div class='kicker'>Collection {esc(meta['collection'])} &middot; {LABELS['guide_no']} {num:02d}</div>"
        f"<h1>{esc(meta['title'])}</h1><div class='sub'>{esc(meta.get('subtitle',''))}</div></div>"
        f"{intro['html']}"))
    # Chapitres de fond.
    for c in core:
        P.append(sec(f"<h2 class='part'><span class='no'>{LABELS['chapter']}</span>{esc(c['title'])}</h2>{c['html']}"))
    # Plan d'action.
    if plan is not None:
        P.append(sec(f"<h2 class='part'><span class='no'>{LABELS['practice']}</span>{esc(plan['title'])}</h2>{plan['html']}"))
    # Ressources & lexique.
    if lexique is not None:
        P.append(sec(f"<h2 class='part'><span class='no'>{LABELS['references']}</span>{esc(lexique['title'])}</h2>{lexique['html']}"))
    # QCM.
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
            f"<h2 class='part'><span class='no'>{LABELS['further']}</span>{LABELS['quiz']}</h2>"
            f"{''.join(qs)}"
            f"<h3 class='corrige-h'>{LABELS['answers']}</h3><div class='answers'>{''.join(ans)}</div>"))

    P.append(closing_block())

    return (f"<!doctype html><html lang='en'><head><meta charset='utf-8'>"
            f"<link href='https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Inter:wght@400;500;600;700&family=Parisienne&display=swap' rel='stylesheet'>"
            f"<style>{CSS}</style></head><body>{''.join(P)}</body></html>")


def html_to_pdf(html_str, out_pdf):
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(html_str); html_path = f.name
    prof = tempfile.mkdtemp()
    cmd = [CHROME, '--headless', '--no-sandbox', '--disable-gpu',
           f'--user-data-dir={prof}', '--no-pdf-header-footer',
           f'--print-to-pdf={out_pdf}', f'file://{html_path}']
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
    os.remove(html_path)


def orphan_sections(pdf_path):
    d = pymupdf.open(pdf_path)
    start = {}
    for pno in range(d.page_count):
        for m in re.findall(r'§(\d+)§', d[pno].get_text()):
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
        if p1 > p0 and fills[p1] < 0.45:
            bad.add(i)
    return bad


def main(nums, meta_by_num):
    os.makedirs(OUT, exist_ok=True)
    for num in nums:
        meta = meta_by_num.get(num)
        path_json = os.path.join(READER, f'{num}.json')
        if not meta or not os.path.exists(path_json):
            print(f"#{num:02d} SKIP (no meta or no reader-en/{num}.json)")
            continue
        data = json.load(open(path_json, encoding='utf-8'))
        tmp = os.path.join(tempfile.gettempdir(), f'content_en_{num}.pdf')
        compact = set()
        for _ in range(3):
            html_to_pdf(build_html(num, meta, data, compact), tmp)
            bad = orphan_sections(tmp)
            new = bad - compact
            if not new:
                break
            compact |= new
        final = os.path.join(OUT, f"{num:02d}_{meta['slug']}.pdf")
        doc = pymupdf.open(tmp)
        doc.save(final, deflate=True, garbage=4)
        pages = doc.page_count
        doc.close()
        print(f"#{num:02d} {meta['title'][:30]:30s} -> {pages:2d} p, {os.path.getsize(final)//1024} Ko")


if __name__ == '__main__':
    meta_by_num = load_meta()
    args = [int(a) for a in sys.argv[1:]]
    nums = args if args else sorted(meta_by_num)
    main(nums, meta_by_num)
