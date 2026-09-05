#!/usr/bin/env python3
"""Replace approved English cover pages without reflowing any ebook content.

Usage: python scripts/replace_english_pdf_covers.py front|back
Requires the reviewed artwork in public/covers-en. Existing PDFs are backed up
outside the repository before replacement. All retained pages are checked both
by extracted text and by rendered pixels before each atomic file replacement.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import tempfile

import pymupdf

ROOT = Path(__file__).resolve().parents[1]


def fingerprint(page):
    return (
        tuple(page.rect),
        page.get_text(),
        hashlib.sha256(page.get_pixmap(matrix=pymupdf.Matrix(0.5, 0.5)).samples).hexdigest(),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('side', choices=['front', 'back'])
    parser.add_argument('--numbers', type=int, nargs='+', help='Optional pilot subset before the full batch.')
    args = parser.parse_args()
    pdfs = sorted((ROOT / 'storage/pdf-en').glob('*.pdf'))
    if len(pdfs) != 48:
        raise ValueError(f'Expected 48 PDFs, found {len(pdfs)}')
    if args.numbers:
        requested = set(args.numbers)
        pdfs = [pdf for pdf in pdfs if int(pdf.name.split('_', 1)[0]) in requested]
        if len(pdfs) != len(requested):
            raise ValueError('One or more requested guide numbers are missing.')
    artwork = ROOT / 'public/covers-en'
    for pdf in pdfs:
        number = int(pdf.name.split('_', 1)[0])
        image = artwork / (f'{number}.jpg' if args.side == 'front' else 'back.jpg')
        if not image.is_file():
            raise FileNotFoundError(image)
        pix = pymupdf.Pixmap(str(image))
        if pix.width < 1000 or abs(pix.width / pix.height - 2 / 3) > 0.01:
            raise ValueError(f'Cover must be high-resolution portrait 2:3: {image}')
    backup = Path(tempfile.mkdtemp(prefix=f'emilie-en-{args.side}-backup-'))
    print(f'Original PDFs backed up in {backup}', flush=True)
    report = []
    for pdf in pdfs:
        shutil.copy2(pdf, backup / pdf.name)
        number = int(pdf.name.split('_', 1)[0])
        image = artwork / (f'{number}.jpg' if args.side == 'front' else 'back.jpg')
        with pymupdf.open(pdf) as doc:
            target = 0 if args.side == 'front' else doc.page_count - 1
            count = doc.page_count
            retained = {i: fingerprint(doc[i]) for i in range(count) if i != target}
            # Current generated PDFs have no navigation. Fail safely if this changes.
            if doc.get_toc() or any(page.get_links() for page in doc):
                raise ValueError(f'PDF navigation requires explicit preservation: {pdf}')
            size = doc[target].rect
            doc.delete_page(target)
            page = doc.new_page(pno=target, width=size.width, height=size.height)
            page.insert_image(page.rect, filename=str(image), keep_proportion=True)
            staged = backup / f'updated-{pdf.name}'
            doc.save(staged, garbage=4, deflate=True)
        with pymupdf.open(staged) as check:
            assert check.page_count == count, f'Page count changed: {pdf}'
            embedded = check[target].get_images(full=True)
            assert len(embedded) == 1, f'Expected one complete cover image: {pdf}'
            actual_image = check.extract_image(embedded[0][0])['image']
            assert hashlib.sha256(actual_image).digest() == hashlib.sha256(image.read_bytes()).digest(), f'Cover artwork changed: {pdf}'
            for index, expected in retained.items():
                assert fingerprint(check[index]) == expected, f'Content changed: {pdf}, page {index + 1}'
            check[target].get_pixmap(matrix=pymupdf.Matrix(1, 1)).save(str(backup / f'{number}-{args.side}.png'))
        with tempfile.NamedTemporaryFile(dir=pdf.parent, prefix=f'.{pdf.stem}-', suffix='.tmp', delete=False) as temp:
            replacement = Path(temp.name)
        shutil.copy2(staged, replacement)
        replacement.replace(pdf)
        report.append({'number': number, 'pdf': pdf.name, 'pages': count, 'preserved_pages': len(retained), 'sha256': hashlib.sha256(pdf.read_bytes()).hexdigest()})
        print(f'{args.side.upper()} {number:02d}: {count} pages; {len(retained)} unchanged pages verified', flush=True)
    (backup / 'verification.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f'Verified {len(report)} PDFs. Report and renders: {backup}', flush=True)


if __name__ == '__main__':
    main()
