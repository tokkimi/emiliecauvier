#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Reconstruit src/data/reader-en/<n>.json depuis le squelette et les chaînes
traduites (scripts/en_work/<n>.en.json).

Contrôles : nombre de chaînes identique à src, structure HTML identique (même
séquence de balises), index de réponse QCM inchangés.
"""
import os, re, json, sys

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READER = os.path.join(SITE, 'src', 'data', 'reader')
OUT = os.path.join(SITE, 'src', 'data', 'reader-en')
WORK = os.path.join(SITE, 'scripts', 'en_work')
TAG_RE = re.compile(r'(<[^>]*>)')


def tag_sequence(html):
    return [p for p in TAG_RE.split(html) if TAG_RE.fullmatch(p)]


def apply(n):
    skel = json.load(open(os.path.join(WORK, f'{n}.skel.json'), encoding='utf-8'))
    src = json.load(open(os.path.join(WORK, f'{n}.src.json'), encoding='utf-8'))
    en = json.load(open(os.path.join(WORK, f'{n}.en.json'), encoding='utf-8'))
    if len(en) != len(src):
        raise SystemExit(f"#{n}: ERREUR nb de chaînes EN={len(en)} != FR={len(src)}")
    if any((s is None or str(s).strip() == '') and str(src[i]).strip() != '' for i, s in enumerate(en)):
        missing = [i for i, s in enumerate(en) if (s is None or str(s).strip() == '') and str(src[i]).strip() != '']
        raise SystemExit(f"#{n}: ERREUR chaînes vides aux index {missing[:8]}...")

    def resolve(v):
        return en[v["$"]] if isinstance(v, dict) and "$" in v else v

    out = {"number": skel["number"], "title": resolve(skel["title"]), "chapters": [], "qcm": []}
    for c in skel["chapters"]:
        html = ''.join(resolve(p) if isinstance(p, dict) else p for p in c["html"])
        out["chapters"].append({
            "title": resolve(c["title"]),
            "objective": resolve(c["objective"]) if c["objective"] != "" else "",
            "html": html,
        })
    for q in skel["qcm"]:
        out["qcm"].append({
            "q": resolve(q["q"]),
            "options": [resolve(o) for o in q["options"]],
            "answer": q["answer"],
            "explanation": resolve(q["explanation"]) if q["explanation"] != "" else "",
        })

    # Contrôle structurel : la séquence de balises doit être identique au FR.
    fr = json.load(open(os.path.join(READER, f'{n}.json'), encoding='utf-8'))
    for i, (fc, ec) in enumerate(zip(fr["chapters"], out["chapters"])):
        if tag_sequence(fc["html"]) != tag_sequence(ec["html"]):
            raise SystemExit(f"#{n}: ERREUR structure HTML différente au chapitre {i}")
    if len(fr["chapters"]) != len(out["chapters"]) or len(fr.get("qcm", [])) != len(out["qcm"]):
        raise SystemExit(f"#{n}: ERREUR nombre de chapitres/QCM")

    os.makedirs(OUT, exist_ok=True)
    json.dump(out, open(os.path.join(OUT, f'{n}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"#{n}: OK -> reader-en/{n}.json ({len(out['chapters'])} chap, {len(out['qcm'])} QCM)")


if __name__ == '__main__':
    nums = [int(a) for a in sys.argv[1:]]
    if not nums:
        nums = sorted(int(f.split('.')[0]) for f in os.listdir(WORK) if f.endswith('.en.json'))
    for n in nums:
        apply(n)
