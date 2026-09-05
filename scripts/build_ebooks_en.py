#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build English covers and PDFs for La Bibliotheque.

Outputs:
- public/covers-en/<number>.jpg for every catalogue guide
- storage/pdf-en/<same filename as FR> when src/data/reader-en/<number>.json exists
"""
from __future__ import annotations

import html as _html
import json
import os
import re
import subprocess
import sys
import tempfile
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import pymupdf


SITE = Path(__file__).resolve().parents[1]
READER_EN = SITE / "src" / "data" / "reader-en"
COVERS_FR = SITE / "public" / "covers"
COVERS_EN = SITE / "public" / "covers-en"
OUT = SITE / "storage" / "pdf-en"

PW_PT, PH_PT = 612.0, 918.0
CREAM = "#f6ede8"
BURGUNDY = "#6e1226"
GOLD = "#a9743b"
INK = "#201a17"
TAUPE = "#4a3f39"

COLLECTIONS_EN = {
    "ACHETEURS": "Buyers",
    "VENDEURS": "Sellers",
    "INVESTISSEURS": "Investors",
    "QUEBEC_LEGAL": "Quebec & Legal",
    "SITUATIONS": "Life Situations",
    "NICHE": "Special Topics",
}


def chrome_path() -> str:
    candidates = [
        os.environ.get("CHROME"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "/opt/pw-browsers/chromium-*/chrome-linux/chrome",
        "chromium",
        "google-chrome",
        "chrome",
        "msedge",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        if "*" in candidate:
            import glob

            matches = glob.glob(candidate)
            if matches:
                return matches[0]
        elif Path(candidate).exists() or candidate in {"chromium", "google-chrome", "chrome", "msedge"}:
            return candidate
    raise RuntimeError("Chrome/Edge not found for PDF rendering")


CHROME = chrome_path()


def export_books_en() -> dict:
    code = "import { BOOKS_EN } from './src/data/booksEn.ts'; console.log(JSON.stringify(BOOKS_EN));"
    npx = shutil.which("npx") or shutil.which("npx.cmd") or "npx.cmd"
    raw = subprocess.check_output([npx, "tsx", "-e", code], cwd=SITE, text=True, encoding="utf-8")
    return json.loads(raw)


def load_books():
    bt = (SITE / "src" / "data" / "books.ts").read_text(encoding="utf-8")
    objs = re.findall(
        r'"number":\s*(\d+),\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",'
        r'\s*"subtitle":\s*"([^"]*)",\s*"collection":\s*"([^"]+)".*?"pdf":\s*"([^"]+)"',
        bt,
        re.S,
    )
    en = export_books_en()
    books = {}
    for n, slug, title, subtitle, collection, pdf in objs:
        localized = en.get(slug, {})
        books[int(n)] = {
            "number": int(n),
            "slug": slug,
            "title": localized.get("title", title),
            "subtitle": localized.get("subtitle", subtitle),
            "collection": collection,
            "pdf": pdf,
        }
    return books


def esc(value) -> str:
    return _html.escape(str(value), quote=False)


CSS = f"""
@page {{ size: 8.5in 12.75in; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ background: {CREAM}; margin: 0; padding: 0;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Newsreader', Georgia, serif; color: {INK};
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
.page.compact .q .opt {{ margin: 2px 0 2px 12pt; font-size: 10.5pt; }}
.page.compact .answers .a {{ margin: 2.5pt 0; font-size: 10.5pt; }}
.dochead {{ border-bottom: 2px solid {BURGUNDY}; padding-bottom: 18pt; margin-bottom: 30pt; }}
.dochead .kicker {{ font-family: 'Inter', sans-serif; font-size: 9pt; letter-spacing: .22em;
  text-transform: uppercase; color: {GOLD}; }}
.dochead h1 {{ font-family: 'Fraunces', Georgia, serif; color: {BURGUNDY};
  font-size: 34pt; line-height: 1.06; margin: 12pt 0 10pt; font-weight: 600; }}
.dochead .sub {{ font-family: 'Newsreader', serif; font-style: italic; color: {TAUPE}; font-size: 15pt; }}
h2.part {{ font-family: 'Fraunces', Georgia, serif; color: {BURGUNDY}; font-size: 25pt;
  margin: 0 0 8pt; font-weight: 600; line-height: 1.12; break-after: avoid; }}
h2.part .no {{ font-family: 'Inter', sans-serif; font-size: 9.5pt; color: {GOLD};
  letter-spacing: .2em; text-transform: uppercase; display: block; margin-bottom: 8pt; }}
p {{ margin: 0 0 12pt; }}
.lede {{ font-size: 15pt; line-height: 1.55; color: {TAUPE}; font-style: italic;
  border-left: 3px solid {GOLD}; padding-left: 15pt; margin: 12pt 0 18pt; break-after: avoid; }}
ul, ol {{ margin: 0 0 14pt 18pt; padding: 0; }}
li {{ margin-bottom: 7pt; padding-left: 4pt; }}
ul li::marker {{ color: {GOLD}; }}
ol li::marker {{ color: {BURGUNDY}; font-family: 'Inter', sans-serif; }}
h3 {{ font-family: 'Fraunces', serif; color: {BURGUNDY}; font-size: 14.5pt; margin: 18pt 0 6pt; break-after: avoid; }}
.tip {{ background: transparent; border: 0; border-left: 4px solid {GOLD};
  padding: 4pt 0 4pt 16pt; margin: 22pt 0 0; break-inside: avoid; }}
.tip__label {{ display: block; font-family: 'Inter', sans-serif; font-size: 8.5pt;
  letter-spacing: .2em; text-transform: uppercase; color: {GOLD}; margin-bottom: 6pt; }}
.tip p {{ margin: 0; font-style: italic; color: {TAUPE}; }}
.corrige-h {{ margin-top: 22pt; }}
.legal-wrap {{ max-width: 5.2in; margin: 1.4in auto 0; text-align: center; }}
.legal-kicker {{ font-family: 'Inter', sans-serif; font-size: 9pt; letter-spacing: .24em;
  text-transform: uppercase; color: {GOLD}; margin-bottom: 14pt; }}
.legal-title {{ font-family: 'Fraunces', Georgia, serif; color: {BURGUNDY}; font-size: 30pt;
  font-weight: 600; margin: 0 0 22pt; }}
.legal-notice {{ font-family: 'Newsreader', serif; font-size: 13.5pt; line-height: 1.75;
  color: #2f2621; text-align: left; margin: 0; }}
.legal-rule {{ width: 64pt; height: 2px; background: {GOLD}; margin: 30pt auto; }}
.legal-copyright {{ font-family: 'Inter', sans-serif; font-size: 9.5pt; line-height: 1.65;
  color: #6b5d52; text-align: left; margin: 0; }}
.legal-ref {{ font-family: 'Inter', sans-serif; font-size: 8.5pt; letter-spacing: .04em;
  color: #9a8b7d; margin-top: 24pt; }}
.q {{ margin: 0 0 15pt; break-inside: avoid; }}
.q .qq {{ font-weight: 600; margin-bottom: 5pt; }}
.q .opt {{ font-family: 'Inter', sans-serif; font-size: 11.5pt; margin: 3pt 0 3pt 12pt; color: #333; }}
.answers .a {{ font-family: 'Inter', sans-serif; font-size: 11.5pt; margin: 4pt 0; color: {TAUPE}; }}
p, li {{ orphans: 2; widows: 2; }}
"""

NOTICE = (
    "This guide is provided for informational and educational purposes only. It presents general information "
    "about real estate in Quebec and does not constitute personalized real estate, legal, tax or financial advice. "
    "Every real estate situation is different, and you should consult the appropriate professionals before making "
    "a decision about a transaction."
)

COPYRIGHT = (
    "© 2026 Emilie Cauvier - La Bibliotheque. All rights reserved. Any reproduction, distribution, sharing or resale, "
    "in whole or in part, by any means, is strictly prohibited without prior written authorization. This guide is for "
    "the purchaser's personal use."
)


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), test, font=font)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def font(name, size):
    base = Path("C:/Windows/Fonts")
    candidates = {
        "serif": ["georgia.ttf", "times.ttf"],
        "serif-bold": ["georgiab.ttf", "timesbd.ttf"],
        "sans": ["arial.ttf"],
        "sans-bold": ["arialbd.ttf"],
    }[name]
    for candidate in candidates:
        p = base / candidate
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def make_cover(num, meta):
    COVERS_EN.mkdir(parents=True, exist_ok=True)
    src = Image.open(COVERS_FR / f"{num}.jpg").convert("RGB")
    W, H = src.size
    img = Image.new("RGB", (W, H), (246, 237, 232))
    draw = ImageDraw.Draw(img)

    # Soft visual memory from the French cover, very faded so old French text
    # never dominates the English preview.
    bg = src.resize((W, H), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(7))
    img = Image.blend(img, bg, 0.04)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, H), fill=(246, 237, 232,)) if False else None

    logo = Image.open(SITE / "public" / "logo-signe-em.png").convert("RGBA")
    logo.thumbnail((165, 120), Image.Resampling.LANCZOS)
    img.paste(logo, (78, 72), logo)

    draw.text((W - 150, 85), f"No. {num:02d}", font=font("sans-bold", 24), fill=(105, 29, 43))
    draw.line((W - 92, 135, W - 92, 245), fill=(105, 29, 43), width=2)
    draw.text((82, 310), "COLLECTION", font=font("sans-bold", 18), fill=(105, 29, 43))
    draw.text((82, 342), COLLECTIONS_EN.get(meta["collection"], meta["collection"]).upper(), font=font("sans", 17), fill=(68, 55, 49))

    title_font = font("serif-bold", 58 if len(meta["title"]) < 34 else 50)
    y = 455
    for line in wrap_text(draw, meta["title"], title_font, 560)[:5]:
        draw.text((82, y), line, font=title_font, fill=(105, 29, 43))
        y += int(title_font.size * 1.03)
    draw.line((82, y + 22, 160, y + 22), fill=(169, 116, 59), width=3)

    sub_font = font("serif", 25)
    y += 58
    for line in wrap_text(draw, meta["subtitle"], sub_font, 520)[:4]:
        draw.text((82, y), line, font=sub_font, fill=(46, 38, 34))
        y += 34

    # Large rounded image-like window from the original cover texture.
    crop = src.crop((int(W * 0.55), int(H * 0.30), W, int(H * 0.90))).filter(ImageFilter.GaussianBlur(0.4))
    crop = crop.resize((int(W * 0.70), int(H * 0.42)), Image.Resampling.LANCZOS)
    crop = Image.blend(Image.new("RGB", crop.size, (246, 237, 232)), crop, 0.62)
    mask = Image.new("L", crop.size, 0)
    md = ImageDraw.Draw(mask)
    md.pieslice((-crop.width, -crop.height // 5, crop.width * 2, crop.height * 2), 205, 360, fill=255)
    img.paste(crop, (W - crop.width, H - crop.height - 150), mask)

    draw.text((82, H - 110), "2026 EDITION", font=font("sans-bold", 18), fill=(96, 75, 64))
    img.save(COVERS_EN / f"{num}.jpg", quality=92)


def make_backcover(num, meta) -> Path:
    path = OUT / f"backcover-{num:02d}.jpg"
    W, H = 1023, 1537
    img = Image.new("RGB", (W, H), (246, 237, 232))
    d = ImageDraw.Draw(img)
    logo = Image.open(SITE / "public" / "logo-bibliotheque.png").convert("RGBA")
    logo.thumbnail((240, 240), Image.Resampling.LANCZOS)
    img.paste(logo, ((W - logo.width) // 2, 220), logo)
    d.text((W // 2, 520), "Make informed decisions.", font=font("serif-bold", 56), fill=(105, 29, 43), anchor="mm")
    d.text((W // 2, 600), "Choose with confidence.", font=font("serif-bold", 56), fill=(105, 29, 43), anchor="mm")
    d.text((W // 2, 680), "Move forward without regret.", font=font("serif-bold", 56), fill=(105, 29, 43), anchor="mm")
    d.text((W // 2, 850), "La Bibliotheque - Guides immo Quebec", font=font("sans-bold", 28), fill=(32, 26, 22), anchor="mm")
    d.text((W // 2, 905), "guidesimmoquebec.com", font=font("sans", 25), fill=(105, 29, 43), anchor="mm")
    d.text((W // 2, H - 165), f"Guide No. {num:02d} - {meta['title']}", font=font("sans", 18), fill=(95, 82, 72), anchor="mm")
    img.save(path, quality=92)
    return path


def legal_block(num, meta):
    return (
        "<div class='legal-wrap'>"
        "<div class='legal-kicker'>Before you begin</div>"
        "<h2 class='legal-title'>Important notice</h2>"
        f"<p class='legal-notice'>{esc(NOTICE)}</p>"
        "<div class='legal-rule'></div>"
        f"<p class='legal-copyright'>{esc(COPYRIGHT)}</p>"
        f"<p class='legal-ref'>{esc(meta['title'])} &middot; Collection {esc(COLLECTIONS_EN.get(meta['collection'], meta['collection']))} &middot; Guide No. {num:02d} &middot; 2026 Edition</p>"
        "</div>"
    )


def build_html(num, meta, data, compact=frozenset()):
    chapters = data["chapters"]
    intro = chapters[0]
    plan = chapters[-2]
    glossary = chapters[-1]
    core = chapters[1:-2]
    qcm = data.get("qcm", [])
    pages = []
    section_index = [0]

    def sec(inner):
        idx = section_index[0]
        section_index[0] += 1
        cls = "page first" if idx == 0 else "page"
        if idx in compact:
            cls += " compact"
        return f"<section class='{cls}'><span class='secmark'>&sect;{idx}&sect;</span>{inner}</section>"

    pages.append(sec(legal_block(num, meta)))
    pages.append(
        sec(
            f"<div class='dochead'><div class='kicker'>Collection {esc(COLLECTIONS_EN.get(meta['collection'], meta['collection']))} &middot; Guide No. {num:02d}</div>"
            f"<h1>{esc(meta['title'])}</h1><div class='sub'>{esc(meta.get('subtitle',''))}</div></div>{intro['html']}"
        )
    )
    for c in core:
        pages.append(sec(f"<h2 class='part'><span class='no'>Chapter</span>{esc(c['title'])}</h2>{c['html']}"))
    pages.append(sec(f"<h2 class='part'><span class='no'>In practice</span>{esc(plan['title'])}</h2>{plan['html']}"))
    pages.append(sec(f"<h2 class='part'><span class='no'>References</span>{esc(glossary['title'])}</h2>{glossary['html']}"))
    if qcm:
        qs = []
        for i, q in enumerate(qcm):
            opts = "".join(f"<div class='opt'>{esc(o)}</div>" for o in q["options"])
            qs.append(f"<div class='q'><div class='qq'>{i+1}. {esc(q['q'])}</div>{opts}</div>")
        ans = []
        for i, q in enumerate(qcm):
            letter = "ABCD"[q["answer"]] if 0 <= q["answer"] < 4 else "?"
            ans.append(f"<div class='a'><b>{i+1}. {letter}</b> - {esc(q.get('explanation',''))}</div>")
        pages.append(sec(f"<h2 class='part'><span class='no'>Go further</span>Quiz - test yourself</h2>{''.join(qs)}<h3 class='corrige-h'>Answers</h3><div class='answers'>{''.join(ans)}</div>"))

    return (
        "<!doctype html><html lang='en'><head><meta charset='utf-8'>"
        "<link href='https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet'>"
        f"<style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
    )


def html_to_pdf(html_str, out_pdf):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html_str)
        html_path = f.name
    prof = tempfile.mkdtemp()
    cmd = [
        CHROME,
        "--headless",
        "--no-sandbox",
        "--disable-gpu",
        f"--user-data-dir={prof}",
        "--no-pdf-header-footer",
        f"--print-to-pdf={out_pdf}",
        f"file:///{html_path.replace(os.sep, '/')}",
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    os.remove(html_path)


def image_page(doc, img_path):
    page = doc.new_page(width=PW_PT, height=PH_PT)
    page.insert_image(pymupdf.Rect(0, 0, PW_PT, PH_PT), filename=str(img_path), keep_proportion=False)


def assemble(num, meta, content_pdf, final_path):
    out = pymupdf.open()
    image_page(out, COVERS_EN / f"{num}.jpg")
    out.insert_pdf(pymupdf.open(content_pdf))
    image_page(out, make_backcover(num, meta))
    out.save(final_path, deflate=True, garbage=4)
    count = out.page_count
    out.close()
    return count


def orphan_sections(pdf_path):
    doc = pymupdf.open(pdf_path)
    start = {}
    for pno in range(doc.page_count):
        for marker in re.findall(r"§(\d+)§", doc[pno].get_text()):
            start.setdefault(int(marker), pno)
    fills = []
    for pno in range(doc.page_count):
        page = doc[pno]
        height = page.rect.height
        ymax = max((block[3] for block in page.get_text("blocks") if block[4].strip()), default=0)
        fills.append(ymax / height)
    doc.close()
    bad = set()
    order = sorted(start)
    for pos, section in enumerate(order):
        first = start[section]
        last = start[order[pos + 1]] - 1 if pos + 1 < len(order) else len(fills) - 1
        if last > first and fills[last] < 0.45:
            bad.add(section)
    return bad


def main():
    books = load_books()
    COVERS_EN.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    nums = [int(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else sorted(books)
    built, skipped = 0, []
    for num in nums:
        meta = books[num]
        make_cover(num, meta)
        src = READER_EN / f"{num}.json"
        if not src.exists():
            skipped.append(num)
            continue
        data = json.loads(src.read_text(encoding="utf-8"))
        tmp = Path(tempfile.gettempdir()) / f"content_en_{num}.pdf"
        compact = set()
        for _ in range(3):
            html_to_pdf(build_html(num, meta, data, compact), tmp)
            bad = orphan_sections(tmp)
            new = bad - compact
            if not new:
                break
            compact |= new
        final = OUT / meta["pdf"]
        pages = assemble(num, meta, tmp, final)
        built += 1
        print(f"EN #{num:02d} {meta['title'][:34]:34s} -> {pages:2d} p, {final.stat().st_size//1024} Ko")
    print(f"Built {built} English PDFs. Covers ready: {len(nums)}. Missing reader-en: {skipped}")


if __name__ == "__main__":
    main()
