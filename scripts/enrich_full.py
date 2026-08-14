#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichissement « remplir la page » CALIBRÉ.

Chapitres (avec conseil en fin) : on ajoute ~300 c (un paragraphe) AVANT le
conseil -> texte + conseil ~= une page pleine, sans orpheliner le conseil.
Parties sans conseil (intro, plan, lexique) : on remplit plus généreusement.
Idempotent via un marqueur.
"""
import os, json, sys

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RDIR = os.path.join(SITE, 'src', 'data', 'reader')
MARK = '<!--enr-->'


def add_before_tip(html, block):
    if MARK in html:
        return html
    block = MARK + block
    i = html.find('<aside class="tip"')
    return (html[:i] + block + html[i:]) if i != -1 else html + block


def append(html, block):
    return html if MARK in html else html + MARK + block


def apply(num, chap_paras, intro_add='', plan_add='', lex_add=''):
    p = os.path.join(RDIR, f'{num}.json')
    d = json.load(open(p, encoding='utf-8'))
    ch = d['chapters']
    core = ch[1:-2]
    for idx, para in chap_paras.items():
        core[idx]['html'] = add_before_tip(core[idx]['html'], f'<p>{para}</p>')
    if intro_add:
        ch[0]['html'] = append(ch[0]['html'], intro_add)
    if plan_add:
        ch[-2]['html'] = append(ch[-2]['html'], plan_add)
    if lex_add:
        ch[-1]['html'] = append(ch[-1]['html'], lex_add)
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'#{num}:', [len(c['html']) for c in core], '| intro', len(ch[0]['html']), '| plan', len(ch[-2]['html']), '| lex', len(ch[-1]['html']))


# ============================ GUIDE 2 ============================
G2 = {
 0: "Concrètement, une préapprobation vérifie vos revenus, vos dettes et votre crédit, et garantit un taux pour une période (souvent 90 à 120 jours). C'est ce document — pas une estimation au téléphone — qui fait de vous un acheteur crédible et qui vous protège si les taux montent pendant votre recherche.",
 1: "Sur un achat à 450 000 $, additionnez taxe de bienvenue, notaire, inspection, ajustements et assurance : la note dépasse souvent 10 000 $, à sortir en plus de la mise de fonds. Prévoyez aussi un coussin pour les premiers mois (petites réparations, ameublement) et gardez une estimation écrite de vos frais avant d'offrir.",
 2: "Une bonne inspection couvre la structure, la toiture, l'enveloppe, la plomberie, l'électricité et les indices d'eau. Au Québec, restez attentif aux enjeux régionaux — pyrite, sols argileux, drain français, réservoir enfoui — selon le secteur et l'âge du bâtiment. Un défaut détecté devient aussi un levier de négociation, pas seulement un frein.",
 3: "La discipline bat l'adrénaline : décidez à l'avance de votre prix plafond ET des conditions que vous refusez d'abandonner (inspection, financement). Une offre propre et bien financée rassure souvent le vendeur autant qu'un dollar de plus — et vous évite le regret d'avoir surpayé sous le coup de l'émotion.",
 4: "Le coup de cœur passe, l'emplacement reste : un quartier bien desservi se revend mieux et protège votre mise. Pour un condo, la santé financière de la copropriété (fonds de prévoyance, budget, procès-verbaux) pèse autant que l'unité. Lisez tous les documents avant de lever vos conditions.",
}
G2_INTRO = ("<p>Ce guide se lit vite et se garde à portée de main : chaque erreur tient en une page, avec le réflexe qui l'évite. Parcourez-le une première fois en entier, puis revenez-y à chaque étape de votre achat — de la préapprobation à la signature chez le notaire.</p>"
            "<p>Les montants cités sont des ordres de grandeur (édition 2026) : validez toujours les chiffres exacts avec votre courtière, votre courtier hypothécaire et votre notaire, car ils varient selon la propriété, la municipalité et votre situation.</p>")
G2_PLAN = ("<h3>Avant de signer</h3><ol><li>Relire la promesse d'achat et confirmer par écrit que toutes mes conditions sont levées.</li><li>Confirmer le montant exact à apporter chez le notaire.</li></ol>"
           "<h3>Le jour J</h3><ol><li>Faire une dernière visite (pré-closing) pour vérifier l'état des lieux.</li><li>Prévoir mes pièces d'identité et ma preuve d'assurance habitation en vigueur.</li></ol>")
G2_LEX = ("<li>Taxe de bienvenue : droits de mutation facturés par la municipalité après l'achat.</li>"
          "<li>Ajustements : répartition au prorata des taxes et frais déjà payés par le vendeur.</li>"
          "<li>Offres multiples : plusieurs acheteurs soumettent en même temps ; fixez votre plafond d'avance.</li>"
          "<li>Vice caché : défaut non apparent rendant la propriété impropre à son usage.</li>"
          "<li>Contre-proposition : réponse du vendeur modifiant un terme de votre offre.</li>"
          "<li>Mise de fonds : part du prix payée comptant, hors financement hypothécaire.</li>"
          "<li>Préapprobation : montant confirmé et taux garanti, valables une période limitée.</li>")

TABLE = {2: (G2, G2_INTRO, G2_PLAN, G2_LEX)}

if __name__ == '__main__':
    nums = [int(a) for a in sys.argv[1:]] or list(TABLE.keys())
    for n in nums:
        if n in TABLE:
            apply(n, *TABLE[n])
