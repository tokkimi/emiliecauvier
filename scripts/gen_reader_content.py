#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère le contenu du lecteur en ligne (façon Coursera) à partir des
contenus source des ebooks. Sortie : src/data/reader/<number>.json
avec { number, title, chapters:[{title, objective, html}], qcm:[...] }.
Le numéro (préfixe de fichier) sert de clé pour rejoindre books.ts."""
import os, glob, json, html, re

BASE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(BASE)
SRC = '/home/user/ebooks-emilie-cauvier/content'
OUT = os.path.join(SITE, 'src', 'data', 'reader')
os.makedirs(OUT, exist_ok=True)


def esc(s):
    return html.escape(str(s), quote=False)


def blocks_to_html(blocks):
    out = []
    for b in blocks:
        t = b.get('type', 'p')
        if t == 'h':
            out.append(f"<h3>{esc(b['text'])}</h3>")
        elif t == 'p':
            out.append(f"<p>{esc(b['text'])}</p>")
        elif t == 'ul':
            items = ''.join(f"<li>{esc(i)}</li>" for i in b['items'])
            out.append(f"<ul>{items}</ul>")
        elif t == 'num':
            items = ''.join(f"<li>{esc(i)}</li>" for i in b['items'])
            out.append(f"<ol>{items}</ol>")
    return '\n'.join(out)


def chapter_html(ch):
    parts = []
    if ch.get('objective'):
        parts.append(f"<p class=\"lede\">{esc(ch['objective'])}</p>")
    parts.append(blocks_to_html(ch.get('blocks', [])))
    if ch.get('conseil'):
        parts.append(
            f"<aside class=\"tip\"><span class=\"tip__label\">Le conseil d'Émilie</span>"
            f"<p>{esc(ch['conseil'])}</p></aside>"
        )
    return '\n'.join(parts)


def action_html(action):
    if not action:
        return None
    parts = ["<p class=\"lede\">Vos prochains pas, concrètement.</p>"]

    def phase(title, items):
        parts.append(f"<h3>{esc(title)}</h3>")
        parts.append('<ol>' + ''.join(f"<li>{esc(i)}</li>" for i in items) + '</ol>')

    if isinstance(action, dict):
        if action.get('semaine'):
            phase('Cette semaine', action['semaine'])
        if action.get('mois'):
            phase("D'ici 30 jours", action['mois'])
        if action.get('ensuite'):
            phase('Ensuite', action['ensuite'])
    else:
        phase('À faire', action)
    return '\n'.join(parts)


def main():
    files = sorted(glob.glob(os.path.join(SRC, '*.json')))
    count = 0
    for fp in files:
        base = os.path.basename(fp)
        m = re.match(r'^(\d+)_', base)
        if not m:
            continue
        num = int(m.group(1))
        d = json.load(open(fp, encoding='utf-8'))
        chapters = []
        intro = d.get('intro')
        if intro:
            if isinstance(intro, str):
                intro_html = f"<p class=\"lede\">{esc(intro)}</p>"
            elif isinstance(intro, list) and intro and isinstance(intro[0], str):
                intro_html = ''.join(f"<p>{esc(p)}</p>" for p in intro)
            elif isinstance(intro, list):
                intro_html = blocks_to_html(intro)
            else:
                intro_html = ''
            chapters.append({'title': 'Introduction', 'objective': '', 'html': intro_html})
        for ch in d.get('chapters', []):
            chapters.append({
                'title': ch['title'],
                'objective': ch.get('objective', ''),
                'html': chapter_html(ch),
            })
        ah = action_html(d.get('action'))
        if ah:
            chapters.append({'title': "Plan d'action", 'objective': '', 'html': ah})
        if d.get('resources'):
            items = ''.join(f"<li>{esc(i)}</li>" for i in d['resources'])
            chapters.append({
                'title': 'Ressources & lexique',
                'objective': '',
                'html': f"<ul>{items}</ul>",
            })

        qcm = []
        for q in d.get('qcm', []):
            ans = q.get('answer', q.get('correct', 0))
            # Convertit une lettre ("C") en index 0-based ; sinon garde l'entier.
            if isinstance(ans, str) and len(ans.strip()) == 1 and ans.strip().upper() in 'ABCDEFGH':
                ans = ord(ans.strip().upper()) - ord('A')
            qcm.append({
                'q': q.get('q', ''),
                'options': q.get('options', q.get('choices', [])),
                'answer': ans,
                'explanation': q.get('explain', q.get('explanation', q.get('why', ''))),
            })

        out = {'number': num, 'title': d.get('title', ''), 'chapters': chapters, 'qcm': qcm}
        json.dump(out, open(os.path.join(OUT, f'{num}.json'), 'w', encoding='utf-8'),
                  ensure_ascii=False)
        count += 1
    print(f'{count} contenus lecteur générés dans {OUT}')


if __name__ == '__main__':
    main()
