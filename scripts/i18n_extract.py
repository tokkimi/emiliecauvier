#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrait les chaînes traduisibles d'un guide (reader/<n>.json) en séparant
le TEXTE (à traduire) de la STRUCTURE HTML (préservée telle quelle).

Produit, dans scripts/en_work/ :
  <n>.skel.json  -> squelette (tags + placeholders {"$": idx})  [ne pas éditer]
  <n>.src.json   -> tableau ORDONNÉ des chaînes FR              [référence]
  <n>.en.json    -> copie de src, À TRADUIRE en anglais (même ordre, même nb)

Rebuild ensuite avec scripts/i18n_apply.py.
"""
import os, re, json, sys

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READER = os.path.join(SITE, 'src', 'data', 'reader')
WORK = os.path.join(SITE, 'scripts', 'en_work')

TAG_RE = re.compile(r'(<[^>]*>)')


def extract(n):
    data = json.load(open(os.path.join(READER, f'{n}.json'), encoding='utf-8'))
    strings = []

    def push(text):
        strings.append(text)
        return {"$": len(strings) - 1}

    def split_html(html):
        parts = TAG_RE.split(html)
        seq = []
        for part in parts:
            if part == '':
                continue
            if TAG_RE.fullmatch(part):
                seq.append(part)                 # tag / commentaire : verbatim
            elif part.strip() == '':
                seq.append(part)                 # espaces : verbatim
            else:
                seq.append(push(part))           # texte : traduisible
        return seq

    skel = {"number": data["number"], "title": push(data["title"])}
    skel_chapters = []
    for c in data["chapters"]:
        skel_chapters.append({
            "title": push(c["title"]),
            "objective": push(c["objective"]) if c.get("objective") else "",
            "html": split_html(c["html"]),
        })
    skel["chapters"] = skel_chapters
    skel_qcm = []
    for q in data.get("qcm", []):
        skel_qcm.append({
            "q": push(q["q"]),
            "options": [push(o) for o in q["options"]],
            "answer": q["answer"],
            "explanation": push(q.get("explanation", "")) if q.get("explanation", "") else "",
        })
    skel["qcm"] = skel_qcm

    os.makedirs(WORK, exist_ok=True)
    json.dump(skel, open(os.path.join(WORK, f'{n}.skel.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(strings, open(os.path.join(WORK, f'{n}.src.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if not os.path.exists(os.path.join(WORK, f'{n}.en.json')):
        json.dump(strings, open(os.path.join(WORK, f'{n}.en.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"#{n}: {len(strings)} chaînes, {len(skel_chapters)} chapitres, {len(skel_qcm)} QCM")


if __name__ == '__main__':
    nums = [int(a) for a in sys.argv[1:]] or [n for n in range(1, 51) if n not in (48, 49)]
    for n in nums:
        if os.path.exists(os.path.join(READER, f'{n}.json')):
            extract(n)
