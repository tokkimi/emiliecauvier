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

# ============================ GUIDE 3 ============================
G3 = {
 0: "En pratique, la préapprobation vous donne un montant maximal ET un taux garanti pour une période (souvent 90 à 120 jours). Elle rassure le vendeur, accélère votre offre et vous évite de magasiner au-dessus de vos moyens. Refaites-la si votre recherche se prolonge au-delà de sa validité.",
 1: "Le prêteur additionne aussi vos autres dettes (auto, marges, cartes, prêts étudiants) : même un solde modeste remboursé chaque mois réduit votre capacité, car c'est le paiement minimum qui compte. Rembourser une dette de carte avant d'acheter augmente souvent votre pouvoir d'achat plus vite qu'épargner quelques milliers de dollars de plus.",
 2: "Le test de résistance explique pourquoi votre préapprobation peut sembler « prudente » : on vous qualifie à un taux supérieur au vôtre pour vérifier que vous tiendriez une hausse. Ce n'est pas une punition, mais une protection — et une bonne raison de garder une marge de confort sous votre maximum théorique.",
 3: "Un courtier hypothécaire compare plusieurs prêteurs d'un coup et connaît leurs critères ; votre institution, elle, ne propose que ses propres produits mais peut récompenser votre fidélité. Dans les deux cas, comparez le taux ET les conditions (pénalités, portabilité, remboursements accélérés), car le taux le plus bas n'est pas toujours le meilleur prêt.",
 4: "Un piège classique : modifier sa situation financière entre la préapprobation et la signature (changer d'emploi, acheter une voiture, ouvrir une nouvelle carte, faire un gros transfert non documenté). Toute variation peut faire réévaluer — voire refuser — votre dossier. Gardez vos finances stables jusque chez le notaire.",
}
G3_INTRO = ("<p>La préapprobation est la première pierre d'un achat serein : elle transforme un « je cherche une maison » flou en un budget clair et crédible. Ce guide démonte le jargon, explique ce que le prêteur regarde vraiment, et vous aide à présenter un dossier solide.</p>"
            "<p>Les taux et seuils évoluent constamment : les repères de ce guide (édition 2026) sont là pour comprendre la logique, pas pour remplacer une simulation à jour avec votre courtier hypothécaire.</p>")
G3_PLAN = ("<h3>Pour renforcer mon dossier</h3><ol><li>Rembourser ou réduire mes soldes de cartes avant de faire la demande.</li><li>Éviter tout nouvel emprunt et garder mon emploi stable jusqu'à la signature.</li></ol>")
G3_LEX = ("<li>ABD / ATD : ratios d'endettement (habitation seule / toutes dettes incluses).</li>"
          "<li>Taux admissible : taux (plus élevé) servant au test de résistance.</li>"
          "<li>Mise de fonds : part payée comptant ; sous 20 %, une assurance prêt s'ajoute.</li>"
          "<li>Portabilité : possibilité de transférer son prêt à une autre propriété.</li>"
          "<li>Pénalité de remboursement : coût pour rompre ou rembourser avant l'échéance du terme.</li>")

# ============================ GUIDE 4 ============================
G4 = {
 0: "Cette taxe n'est pas un « piège » : c'est une source de revenus importante pour les municipalités, prélevée une seule fois, à l'achat. La connaître à l'avance évite la mauvaise surprise, car elle peut représenter plusieurs milliers de dollars selon le prix de la propriété.",
 1: "Retenez la règle clé : on applique le taux sur la PLUS ÉLEVÉE des deux valeurs — prix payé ou évaluation municipale ajustée. Autrement dit, payer « sous l'évaluation » ne réduit pas la taxe en dessous de cette évaluation ajustée. C'est souvent ce qui explique un montant plus élevé qu'attendu.",
 2: "Comme le barème est progressif, seule la portion de valeur dans chaque tranche est taxée au taux correspondant — un peu comme l'impôt sur le revenu. Montréal ajoute des tranches supérieures pour les propriétés de grande valeur. Faites toujours estimer le montant AVANT d'offrir, pour l'intégrer à votre budget de clôture.",
 3: "Les exonérations les plus courantes visent des transferts entre personnes liées (conjoints, ascendants/descendants directs), sous conditions précises. Elles ne s'appliquent pas automatiquement : il faut souvent les réclamer et documenter le lien. Votre notaire est la bonne personne pour valider votre admissibilité.",
 4: "Concrètement, la facture arrive par la poste quelques semaines à quelques mois après l'achat, avec un délai de paiement. Mettez la somme de côté dès la transaction pour ne pas être pris au dépourvu — c'est l'une des surprises de trésorerie les plus fréquentes chez les nouveaux propriétaires.",
}
G4_INTRO = ("<p>« Taxe de bienvenue » : le surnom est ironique, mais la facture, elle, est bien réelle. Ce guide explique d'où vient cette taxe, sur quelle valeur elle se calcule, comment lire le barème progressif, et quand la payer — pour qu'elle n'ait rien d'une surprise.</p>"
            "<p>Les seuils et taux (édition 2026) sont indexés et varient selon la municipalité : utilisez ce guide pour comprendre le mécanisme, puis validez le montant exact avec votre notaire.</p>")
G4_PLAN = ("<h3>Avant l'achat</h3><ol><li>Faire estimer ma taxe de bienvenue et l'ajouter à mon budget de clôture.</li><li>Vérifier avec le notaire si une exonération s'applique à ma situation.</li></ol>")
G4_LEX = ("<li>Droits de mutation : nom officiel de la « taxe de bienvenue ».</li>"
          "<li>Facteur comparatif : coefficient qui ajuste l'évaluation municipale vers le marché.</li>"
          "<li>Base d'imposition : la plus élevée du prix payé ou de l'évaluation ajustée.</li>"
          "<li>Barème progressif : taux croissant par tranches de valeur.</li>"
          "<li>Exonération : cas (souvent entre proches) où la taxe est réduite ou annulée.</li>")

# ============================ GUIDE 5 ============================
G5 = {
 0: "Acheter un condo, c'est acheter deux choses à la fois : votre unité et une part d'une collectivité. Vous héritez donc de règles communes et d'une santé financière collective qui influencent directement votre confort et la valeur de revente. D'où l'importance d'examiner l'immeuble autant que l'appartement.",
 1: "Lisez particulièrement les règles qui touchent votre quotidien : animaux, bruit, location (surtout court terme), rénovations, usage des balcons et espaces communs. Une déclaration restrictive peut contrarier vos projets ; à l'inverse, des règles claires protègent la tranquillité et la valeur de l'immeuble.",
 2: "Depuis les réformes récentes, les copropriétés doivent mieux planifier leurs réserves via une étude du fonds de prévoyance. Un fonds bien garni signale une gestion saine ; un fonds faible annonce des cotisations spéciales. Demandez le montant du fonds, le budget et l'historique des cotisations avant d'offrir.",
 3: "Vérifiez aussi l'assurance du syndicat (montant, franchises) et vos propres besoins : en cas de sinistre, la franchise de l'immeuble peut vous être refacturée. Les procès-verbaux des dernières assemblées révèlent les tensions, les travaux à venir et les décisions importantes — une lecture qui vaut de l'or.",
 4: "Faites de l'examen des documents une CONDITION écrite de votre promesse d'achat, avec un délai suffisant. Un notaire ou un expert peut vous aider à décoder le carnet d'entretien, la déclaration et les finances. Mieux vaut renoncer à temps qu'hériter d'un immeuble mal géré.",
}
G5_INTRO = ("<p>Le condo séduit par son prix d'entrée et son faible entretien, mais il vient avec une vie collective et des règles qu'il faut comprendre avant de signer. Ce guide vous apprend à lire un immeuble : sa déclaration, son fonds de prévoyance, ses assurances et ses procès-verbaux.</p>"
            "<p>L'idée directrice : en copropriété, on n'achète pas seulement des murs, on achète une gestion. Ce guide vous donne la grille pour l'évaluer.</p>")
G5_PLAN = ("<h3>Documents à obtenir</h3><ol><li>Déclaration de copropriété, règlement, dernier budget et états financiers.</li><li>Étude du fonds de prévoyance et procès-verbaux des deux dernières années.</li></ol>")
G5_LEX = ("<li>Partie privative / commune : votre unité vs les espaces partagés.</li>"
          "<li>Quote-part : votre part des charges et des votes, selon la déclaration.</li>"
          "<li>Fonds de prévoyance : réserve collective pour les grosses réparations.</li>"
          "<li>Cotisation spéciale : contribution ponctuelle quand le fonds ne suffit pas.</li>"
          "<li>Carnet d'entretien : historique et planification des travaux de l'immeuble.</li>")

TABLE = {
    2: (G2, G2_INTRO, G2_PLAN, G2_LEX),
    3: (G3, G3_INTRO, G3_PLAN, G3_LEX),
    4: (G4, G4_INTRO, G4_PLAN, G4_LEX),
    5: (G5, G5_INTRO, G5_PLAN, G5_LEX),
}

if __name__ == '__main__':
    nums = [int(a) for a in sys.argv[1:]] or list(TABLE.keys())
    for n in nums:
        if n in TABLE:
            apply(n, *TABLE[n])
