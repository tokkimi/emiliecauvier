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

# ============================ GUIDE 6 ============================
G6 = {
 0: "Avant même de sonner, prenez trente secondes sur le trottoir : l'implantation, la pente du terrain et l'état général racontent déjà beaucoup. Une propriété bien entretenue à l'extérieur l'est souvent aussi à l'intérieur ; l'inverse est un signal à ne pas ignorer.",
 1: "Le sous-sol est l'endroit le plus honnête d'une maison : c'est là que l'eau, les fissures et les réparations bricolées se voient. Méfiez-vous d'un sous-sol fraîchement repeint juste avant la vente — il peut cacher des traces d'infiltration. Un déshumidificateur qui tourne en permanence est aussi un indice.",
 2: "Pour les systèmes, notez l'âge des grosses composantes (toiture, chauffage, chauffe-eau, fenêtres) : ce sont elles qui coûtent cher à remplacer. Un panneau électrique daté, une plomberie ancienne ou un système de chauffage en fin de vie doivent entrer dans votre calcul de budget après l'achat.",
 3: "À l'intérieur, regardez au-delà de la décoration : planchers de niveau, portes qui ferment bien, absence d'auréoles au plafond, fenêtres sans condensation entre les vitres. La déco se change facilement ; la structure et l'enveloppe, non. Ne tombez pas amoureux d'une cuisine au point d'oublier une fondation qui bouge.",
 4: "Votre visite ne remplace pas l'inspection : elle sert à filtrer et à cibler. Dès qu'une propriété vous intéresse sérieusement, faites une promesse d'achat conditionnelle à une inspection par un professionnel reconnu, et accompagnez-le pour poser vos questions et comprendre le rapport.",
}
G6_INTRO = ("<p>Une visite réussie, c'est une visite méthodique : on regarde dans le bon ordre, on note les bons indices, et on distingue ce qui se répare facilement de ce qui coûte cher. Ce guide vous donne une grille pièce par pièce, de l'extérieur jusqu'aux systèmes.</p>"
            "<p>Objectif : repérer les vrais enjeux derrière la mise en scène, et transformer vos observations en questions précises pour l'inspection.</p>")
G6_PLAN = ("<h3>Ma trousse de visite</h3><ol><li>Apporter une lampe de poche, un niveau (ou une bille) et de quoi prendre des notes et des photos.</li><li>Noter l'âge des composantes majeures et demander les factures des travaux récents.</li></ol>")
G6_LEX = ("<li>Enveloppe du bâtiment : toiture, murs, fenêtres et isolation — la barrière contre l'eau et le froid.</li>"
          "<li>Bris de scellant : condensation entre les vitres d'une fenêtre thermos.</li>"
          "<li>Drain français : drain périphérique évacuant l'eau autour de la fondation.</li>"
          "<li>Condition d'inspection : clause rendant l'achat dépendant d'un rapport satisfaisant.</li>"
          "<li>Vice apparent : défaut visible lors d'un examen normal, non couvert par la garantie légale.</li>")

# ============================ GUIDE 7 ============================
G7 = {
 0: "Ne rédigez jamais une promesse « pour voir » : dès que le vendeur l'accepte, vous êtes engagé. Chaque élément compte — prix, inclusions et exclusions, date de possession, conditions. Une promesse bien faite protège vos intérêts autant qu'elle formalise votre offre.",
 1: "Vos conditions sont vos portes de sortie légitimes : inspection satisfaisante, obtention du financement, examen des documents (surtout en copropriété). Résister à la tentation de les retirer « pour gagner » en marché tendu est ce qui vous protège d'un achat regretté. Une porte de sortie n'est pas une faiblesse.",
 2: "Fixez votre prix à partir d'une analyse comparative (ventes récentes semblables), pas d'un ressenti. C'est votre base rationnelle pour offrir sans surpayer ni vexer le vendeur. En marché équilibré, une offre trop basse peut simplement fermer la porte à la négociation.",
 3: "Maîtrisez la mécanique : durée de validité de l'offre, dépôt en fidéicommis (gage de sérieux), et jeu des contre-propositions. Chaque contre-proposition rouvre la négociation : gardez votre plafond en tête et répondez sur les faits, pas sous la pression du délai.",
 4: "En offres multiples, décidez d'avance de votre montant maximum ET des conditions que vous refusez d'abandonner. Une offre propre, préapprouvée et aux délais souples rassure souvent autant qu'un dollar de plus. Perdre une propriété se surmonte ; surpayer vous suit des années.",
}
G7_INTRO = ("<p>La promesse d'achat est le document qui transforme votre intérêt en engagement. Bien rédigée, elle vous protège ; bâclée, elle vous expose. Ce guide décortique sa portée juridique, les conditions qui vous protègent, la façon de fixer votre prix et de mener la négociation.</p>"
            "<p>Votre courtière rédige et valide ces documents encadrés : ce guide vous rend acteur et éclairé à chaque clause.</p>")
G7_PLAN = ("<h3>Avant de déposer mon offre</h3><ol><li>Obtenir une analyse comparative récente et fixer mon prix plafond par écrit.</li><li>Lister mes conditions incontournables (inspection, financement, documents).</li></ol>")
G7_LEX = ("<li>Promesse d'achat : offre qui devient un contrat dès l'acceptation du vendeur.</li>"
          "<li>Condition suspensive : clause dont dépend la validité de la vente (inspection, financement).</li>"
          "<li>Dépôt en fidéicommis : somme déposée en gage de sérieux, dans un compte protégé.</li>"
          "<li>Contre-proposition : réponse modifiant un terme de l'offre initiale.</li>"
          "<li>Date de possession : date convenue de remise des clés.</li>")

# ============================ GUIDE 8 ============================
G8 = {
 0: "Le plex propriétaire-occupant combine le meilleur des deux mondes : les règles de financement avantageuses du résidentiel (1 à 4 logements) et des loyers qui allègent votre hypothèque. C'est souvent la porte d'entrée la plus accessible vers l'investissement immobilier.",
 1: "Pour un immeuble de 1 à 4 logements que vous habitez, la mise de fonds minimale est nettement plus basse que pour un immeuble purement locatif (5 logements et plus). Le prêteur tient aussi compte d'une partie des loyers dans votre capacité d'emprunt — un levier puissant à valider avec un courtier hypothécaire.",
 2: "Calculez le coût net réel : additionnez toutes les dépenses (hypothèque, taxes, assurances, énergie des communs, entretien, réserve) puis soustrayez les loyers encaissés. C'est ce chiffre — pas le prix affiché — qui dit combien vous coûte VRAIMENT votre logement, souvent bien moins qu'une maison équivalente.",
 3: "Acheter un plex, c'est hériter de ses baux : au Québec, ils suivent l'immeuble. Vous reprenez les locataires en place et leurs conditions (loyer, durée) ; vous ne repartez pas « à neuf ». Examinez les baux, l'historique des loyers et des paiements AVANT d'offrir.",
 4: "Devenir propriétaire-bailleur, c'est un rôle : entretien réactif, communication claire, respect des règles d'augmentation et des droits des locataires. Bien joué, il fidélise de bons locataires et protège votre rendement. Mal joué, il génère vacance, conflits et frais imprévus.",
}
G8_INTRO = ("<p>Habiter un logement et louer les autres : le plex est un tremplin réputé vers la propriété et l'investissement. Ce guide explique pourquoi il est si accessible (financement occupant), comment calculer son coût net réel, et ce que signifie hériter de locataires et de baux.</p>"
            "<p>Objectif : acheter un plex en connaissant à la fois les avantages financiers et les responsabilités de bailleur qui viennent avec.</p>")
G8_PLAN = ("<h3>Avant d'acheter mon plex</h3><ol><li>Faire valider ma mise de fonds et ma capacité (loyers inclus) par un courtier hypothécaire.</li><li>Obtenir les baux, l'historique des loyers et le détail des dépenses de l'immeuble.</li></ol>")
G8_LEX = ("<li>Propriétaire-occupant : propriétaire qui habite l'un des logements de son immeuble.</li>"
          "<li>1 à 4 logements : catégorie résidentielle, financement plus avantageux.</li>"
          "<li>Coût net : dépenses totales de l'immeuble moins les loyers encaissés.</li>"
          "<li>Bail : contrat de location qui suit l'immeuble lors de la vente.</li>"
          "<li>Tribunal administratif du logement (TAL) : instance encadrant les rapports locateur-locataire.</li>")

# ============================ GUIDE 9 ============================
G9 = {
 0: "Au-delà des goûts, pensez revente et coût total : le neuf se paie plus cher au pied carré mais démarre sans surprise ; l'ancien s'achète souvent moins cher mais exige un budget travaux. Le bon choix dépend de votre tolérance aux imprévus et du temps que vous voulez consacrer à l'entretien.",
 1: "La GCR couvre par étapes : acompte et parachèvement à la réception, puis vices cachés et vices majeurs sur des périodes plus longues (généralement jusqu'à 5 ans pour les vices majeurs). Elle comporte des limites et des exclusions : lisez le contrat de garantie et conservez vos documents de réception.",
 2: "Acheter sur plan comporte des risques propres : délais de livraison, choix figés tôt, et écart possible entre le rendu et le résultat. Vérifiez la protection de vos acomptes, les pénalités de retard et la réputation du constructeur. Faites une inspection de pré-réception et notez toutes les déficiences par écrit.",
 3: "Sur l'ancien, ciblez les postes coûteux : toiture, fondation, drain, plomberie, électricité, fenêtres. Un charme d'époque peut cacher des mises aux normes onéreuses. L'inspection et, au besoin, des expertises ciblées transforment l'incertitude en budget clair — et en levier de négociation.",
 4: "Quel que soit l'âge, mettez de côté chaque année un petit pourcentage de la valeur pour l'entretien et les imprévus. Une maison « pas chère » avec une toiture en fin de vie peut coûter plus qu'un neuf bien fini. Le vrai prix, c'est le prix d'achat PLUS l'entretien à venir.",
}
G9_I = ("<p>Neuf ou ancien : ce n'est pas qu'une question de goût, mais de garantie, de budget et de tolérance aux imprévus. Ce guide compare les deux honnêtement — coûts, garanties, achat sur plan, vérifications — pour un choix éclairé.</p>"
        "<p>Les repères (édition 2026) servent à comprendre la logique ; validez les détails de garantie et de financement avec les professionnels concernés.</p>")
G9_P = "<h3>Selon mon choix</h3><ol><li>Neuf/sur plan : vérifier la garantie GCR, la protection des acomptes et la réputation du constructeur.</li><li>Ancien : prévoir l'inspection et un budget travaux réaliste.</li></ol>"
G9_L = ("<li>GCR : garantie de construction résidentielle des habitations neuves admissibles.</li>"
        "<li>Vice majeur : défaut compromettant la solidité de l'ouvrage, couvert plus longtemps.</li>"
        "<li>Achat sur plan : achat avant/pendant la construction, sur la foi des plans.</li>"
        "<li>Pré-réception : visite avant livraison pour consigner les déficiences.</li>"
        "<li>Réserve d'entretien : somme mise de côté chaque année pour les travaux.</li>")

# ============================ GUIDE 10 ============================
G10 = {
 0: "Le seuil clé est 20 % : en dessous, une assurance prêt (SCHL, Sagen, Canada Guaranty) s'ajoute à votre financement, ce qui augmente le coût mais permet d'acheter plus tôt. Visez un objectif réaliste plutôt que d'attendre des années pour éviter l'assurance — le marché peut monter plus vite que votre épargne.",
 1: "Le CELIAPP combine le meilleur du REER et du CELI : cotisations déductibles d'impôt ET retrait non imposable pour un premier achat, dans les limites annuelles et cumulatives. C'est souvent le tout premier compte à ouvrir quand on épargne pour une première propriété — dès aujourd'hui, pour lancer le compteur.",
 2: "Le RAP permet de retirer de votre REER sans impôt immédiat pour l'achat, à condition de rembourser sur plusieurs années. Un remboursement manqué s'ajoute à votre revenu imposable. CELIAPP et RAP peuvent parfois se combiner — un montage à valider avec un conseiller pour maximiser votre mise de fonds.",
 3: "Un don d'un proche parent est accepté par les prêteurs avec une lettre de don confirmant qu'il n'est pas remboursable. L'ordre des retraits (CELIAPP, RAP, dons, épargne) a un impact fiscal : planifiez-le pour ne pas déclencher d'impôt inutile ni fragiliser votre dossier de financement.",
 4: "Au-delà de la mise de fonds, prévoyez les frais de clôture (notaire, taxe de bienvenue, ajustements) et un coussin d'urgence. Vider ses comptes pour maximiser la mise de fonds, c'est risquer de se retrouver sans marge dès le premier mois de propriété.",
}
G10_I = ("<p>La mise de fonds est souvent le principal obstacle au premier achat — mais plusieurs outils, bien combinés, l'allègent : CELIAPP, RAP, dons familiaux. Ce guide explique combien il vous faut vraiment et comment assembler votre mise de fonds intelligemment.</p>"
         "<p>Les plafonds et seuils (édition 2026) évoluent : ce guide donne la logique, à confirmer avec votre institution ou votre courtier hypothécaire.</p>")
G10_P = "<h3>Pour bâtir ma mise de fonds</h3><ol><li>Ouvrir un CELIAPP dès maintenant pour lancer le compteur, même avec de petits montants.</li><li>Faire chiffrer par un conseiller la meilleure combinaison CELIAPP/RAP/don pour ma situation.</li></ol>"
G10_L = ("<li>CELIAPP : compte pour premier achat — cotisation déductible et retrait non imposable.</li>"
         "<li>RAP : retrait du REER sans impôt immédiat, à rembourser sur plusieurs années.</li>"
         "<li>Assurance prêt : exigée sous 20 % de mise de fonds ; s'ajoute au financement.</li>"
         "<li>Lettre de don : document confirmant qu'un don familial n'est pas remboursable.</li>"
         "<li>Frais de clôture : notaire, taxe de bienvenue, ajustements — en plus de la mise de fonds.</li>")

# ============================ GUIDE 11 ============================
G11 = {
 0: "Notez chaque secteur sur des critères concrets : proximité du travail et des transports, écoles, commerces, sécurité, bruit, projets de développement et potentiel de revente. Une grille objective vous évite de payer une prime pour une jolie rue dont le quotidien ne vous conviendra pas.",
 1: "À Laval, la réalité change d'un secteur à l'autre : proximité des stations de métro et des grands axes, quartiers matures vs développements récents, accès aux services. Le prix et le style de vie varient fortement — d'où l'importance de cibler le secteur, pas seulement la ville.",
 2: "La Rive-Nord (Terrebonne, Mascouche, Repentigny, Blainville, Boisbriand, Sainte-Thérèse, Mirabel) offre souvent plus d'espace pour son argent, au prix d'un navettage plus long. Pesez le temps de transport quotidien, l'accès aux services et l'offre scolaire selon votre étape de vie.",
 3: "Le quartier qui vous plaît doit aussi plaire à votre futur acheteur : les secteurs recherchés (transport, écoles réputées, services) se revendent mieux et résistent aux baisses. Acheter en pensant revente, c'est protéger votre mise même si vos plans changent.",
 4: "Rien ne remplace le terrain : visitez à différentes heures, testez le trajet maison-travail à l'heure de pointe, observez l'entretien du voisinage. Vingt minutes le dimanche peuvent devenir cinquante un mardi. On achète un quotidien, pas seulement une adresse.",
}
G11_I = ("<p>« L'emplacement, l'emplacement, l'emplacement » : le quartier pèse autant que la propriété sur votre qualité de vie et votre revente. Ce guide vous donne une méthode objective pour comparer les secteurs du Grand Montréal, de Laval à la Rive-Nord.</p>"
         "<p>L'idée : remplacer le coup de cœur par une grille de critères — puis valider sur le terrain avant de vous engager.</p>")
G11_P = "<h3>Pour choisir mon secteur</h3><ol><li>Bâtir ma grille de critères et noter chaque quartier visité.</li><li>Tester le trajet quotidien et visiter à différentes heures avant d'offrir.</li></ol>"
G11_L = ("<li>Mois d'inventaire : indicateur de tension du marché local.</li>"
         "<li>Navettage : temps de déplacement domicile-travail, à tester aux heures de pointe.</li>"
         "<li>Potentiel de revente : facilité à revendre selon l'attrait durable du secteur.</li>"
         "<li>Services de proximité : commerces, écoles, transport, santé, loisirs.</li>"
         "<li>Projet de développement : chantier ou plan pouvant changer la valeur d'un secteur.</li>")

TABLE = {
    2: (G2, G2_INTRO, G2_PLAN, G2_LEX),
    3: (G3, G3_INTRO, G3_PLAN, G3_LEX),
    4: (G4, G4_INTRO, G4_PLAN, G4_LEX),
    5: (G5, G5_INTRO, G5_PLAN, G5_LEX),
    6: (G6, G6_INTRO, G6_PLAN, G6_LEX),
    7: (G7, G7_INTRO, G7_PLAN, G7_LEX),
    8: (G8, G8_INTRO, G8_PLAN, G8_LEX),
    9: (G9, G9_I, G9_P, G9_L),
    10: (G10, G10_I, G10_P, G10_L),
    11: (G11, G11_I, G11_P, G11_L),
}

def g(paras, intro, plan, lex):
    return (paras, intro, plan, lex)

# ---- Guide 12 : Acheter à Montréal ----
TABLE[12] = g({
 0: "À Montréal, deux propriétés au même prix, à quelques rues d'écart, peuvent offrir une qualité de vie très différente : bruit, stationnement, sécurité, vie de quartier. C'est pourquoi on n'achète pas « à Montréal » mais dans un secteur précis, qu'il faut aller ressentir sur place.",
 1: "Chaque grande famille d'arrondissements a son public : centraux et animés pour la vie urbaine, secteurs familiaux pour l'espace et les écoles, quartiers en transformation pour le potentiel. Identifiez d'abord votre style de vie, puis ciblez les arrondissements qui y correspondent — cela réduit énormément la recherche.",
 2: "Montréal ajoute des tranches supérieures de taxe de bienvenue pour les propriétés de grande valeur : faites toujours estimer le montant avant d'offrir. Ajoutez le stationnement (vignette, rareté), la déneigement et les particularités de certains arrondissements à votre calcul de coût réel.",
 3: "À Montréal, la proximité du métro, des bonnes écoles et des artères vivantes soutient la valeur dans le temps. Un secteur recherché se revend mieux et résiste aux ralentissements : achetez en pensant déjà au prochain acheteur, même si vous comptez rester longtemps.",
 4: "Un plex peut être un formidable tremplin (vous habitez et les loyers allègent l'hypothèque), mais vous devenez propriétaire-bailleur, avec baux et obligations. Le condo, lui, offre une entrée de gamme plus accessible en ville, au prix de charges et d'une vie de copropriété à accepter.",
}, "<p>Montréal, c'est une mosaïque : la valeur, l'ambiance et le prix changent d'un arrondissement — et parfois d'une rue — à l'autre. Ce guide vous aide à décoder la logique montréalaise, à repérer la famille de secteurs qui vous convient et à acheter en pensant revente.</p><p>Prenez le temps d'aller vivre les quartiers ciblés à différentes heures : à Montréal plus qu'ailleurs, le terrain dit la vérité.</p>",
   "<h3>Pour cibler mon secteur</h3><ol><li>Définir mon style de vie prioritaire, puis 2-3 arrondissements cibles.</li><li>Visiter à différentes heures et estimer ma taxe de bienvenue avant d'offrir.</li></ol>",
   "<li>Arrondissement : division administrative de Montréal, aux règles et taxes propres.</li><li>Plex : duplex/triplex, courant à Montréal, à occuper et/ou louer.</li><li>Tranches supérieures : paliers de taxe de bienvenue propres à la métropole.</li><li>Vignette de stationnement : permis de stationnement de rue par secteur.</li><li>Potentiel de revente : attrait durable qui protège la valeur.</li>")

# ---- Guide 13 : Les vrais frais de l'achat ----
TABLE[13] = g({
 0: "Ces frais tombent tous à peu près au même moment, autour de la transaction : prévoyez-les en liquide, en plus de la mise de fonds. Une estimation écrite de votre notaire et de votre courtière, dès le départ, vous évite la question stressante du « combien dois-je apporter » la veille de la signature.",
 1: "La taxe de bienvenue mérite une ligne à part car elle arrive APRÈS l'achat, par facture municipale : beaucoup l'oublient dans leur budget et se font surprendre. Mettez la somme de côté dès la transaction — c'est l'une des surprises de trésorerie les plus fréquentes des nouveaux propriétaires.",
 2: "Les dépenses de démarrage (assurance, branchements, serrures, petits achats, premiers travaux) s'additionnent vite dans les premières semaines. Prévoyez une enveloppe dédiée pour ne pas financer votre emménagement à crédit, au pire moment.",
 3: "Assemblez tout en un seul chiffre : mise de fonds + frais de clôture + démarrage + coussin. C'est ce total — pas seulement le prix affiché ni l'hypothèque — qui détermine si vous achetez confortablement ou serré. Un budget complet, écrit, vous protège des mauvaises surprises.",
 4: "Posséder, c'est aussi des coûts récurrents : taxes municipales et scolaires, assurance, énergie, entretien, charges de copropriété le cas échéant. Un achat « abordable » à l'entrée peut devenir lourd si ces coûts mensuels sont sous-estimés : calculez-les avant de vous engager.",
}, "<p>Le prix affiché n'est jamais le coût réel d'un achat. Ce guide recense tous les frais — autour de la transaction, la taxe de bienvenue, le démarrage, puis les coûts récurrents — pour bâtir un budget complet et sans mauvaise surprise.</p><p>Les montants (édition 2026) sont des ordres de grandeur : faites chiffrer votre cas précis par votre notaire et votre courtière.</p>",
   "<h3>Pour un budget sans surprise</h3><ol><li>Obtenir une estimation écrite de tous mes frais de clôture avant d'offrir.</li><li>Réserver la taxe de bienvenue et un coussin dès la transaction.</li></ol>",
   "<li>Frais de clôture : notaire, taxe de bienvenue, ajustements, inspection, assurances.</li><li>Ajustements : taxes et frais payés d'avance par le vendeur, remboursés au prorata.</li><li>Coûts récurrents : taxes, assurance, énergie, entretien, charges de copropriété.</li><li>Coussin d'urgence : réserve pour les imprévus des premiers mois.</li><li>Prise de possession : moment où assurance et branchements doivent être actifs.</li>")

# ---- Guide 14 : Sols argileux, pyrite et drain français ----
TABLE[14] = g({
 0: "L'argile gonfle avec l'eau et se rétracte en période sèche, ce qui peut faire bouger les fondations (fissures, planchers qui penchent). Ce n'est pas une fatalité : une bonne gestion de l'eau autour de la maison (pentes, gouttières, arrosage stable des fondations en sécheresse) limite fortement les mouvements.",
 1: "La pyrite (sous les dalles) et la pyrrhotite (dans le béton de certaines régions) peuvent, en réagissant, fissurer et soulever le béton. Le risque varie selon le secteur et l'époque de construction. Des tests spécialisés existent : en cas de doute, faites-les avant d'acheter.",
 2: "Le drain français, enfoui au pied des fondations, évacue l'eau du sol ; obstrué ou effondré, il laisse l'eau s'infiltrer au sous-sol. Son remplacement coûte cher. Observez les indices (humidité, taches, odeur) et demandez l'âge et l'historique du drain.",
 3: "Restez attentif à d'autres points québécois : réservoir d'huile enfoui (contamination), vermiculite pouvant contenir de l'amiante, et anciens matériaux à risque. Ces éléments se gèrent, mais mieux vaut les connaître avant d'acheter que les découvrir en rénovant.",
 4: "Votre meilleure protection : une inspection par un professionnel attentif à ces enjeux régionaux, des tests ciblés au besoin, et une condition d'inspection dans votre promesse d'achat. Quelques centaines de dollars d'expertise peuvent éviter des dizaines de milliers en réparations.",
}, "<p>Le bâti québécois a ses particularités : sols argileux, pyrite et pyrrhotite, drains français, réservoirs enfouis. Bien connus, ces enjeux se gèrent ; ignorés, ils coûtent cher. Ce guide vous apprend à les repérer et à vous protéger avant d'acheter.</p><p>Objectif : transformer des mots qui font peur en points de vérification concrets pour votre inspection.</p>",
   "<h3>Pour me protéger</h3><ol><li>Ajouter une condition d'inspection et cibler les enjeux du secteur.</li><li>Prévoir des tests spécialisés (pyrite, sol) en cas de doute.</li></ol>",
   "<li>Sol argileux : sol qui gonfle et se rétracte selon l'humidité, pouvant bouger les fondations.</li><li>Pyrite / pyrrhotite : minéraux pouvant faire gonfler ou fissurer le béton.</li><li>Drain français : drain périphérique évacuant l'eau autour des fondations.</li><li>Réservoir enfoui : ancien réservoir de mazout, risque de contamination.</li><li>Vermiculite : isolant pouvant contenir de l'amiante.</li>")

# ---- Guide 15 : Vendre au meilleur prix ----
TABLE[15] = g({
 0: "Le prix de départ est la décision la plus lourde de conséquences : trop haut, la propriété stagne et se « brûle » ; juste, elle attire vite et peut créer de l'émulation. La préparation (ménage, désencombrement, petites réparations) démultiplie ensuite l'effet d'un bon prix.",
 1: "La mise en marché vise à exposer la propriété au maximum d'acheteurs qualifiés : photos professionnelles, description soignée, diffusion large, visites bien organisées. Les premières semaines concentrent l'essentiel de l'intérêt — soyez impeccable dès le premier jour en ligne.",
 2: "Une offre s'évalue dans son ensemble : prix, mais aussi conditions, dates de possession et solidité du financement. La meilleure offre n'est pas toujours la plus élevée si elle est fragile. Répondez sur les faits, gardez votre stratégie, et laissez votre courtière mener la négociation.",
 3: "Une offre acceptée n'est pas une vente conclue : il reste les conditions à lever (inspection, financement) et la route jusqu'au notaire. Restez disponible, fournissez vite les documents et anticipez les demandes de l'acheteur pour éviter qu'une condition ne fasse dérailler la vente.",
 4: "Les erreurs classiques coûtent cher : surévaluer, négliger la préparation et les photos, rendre les visites difficiles, ou négocier à l'émotion. Toutes sont évitables avec de la méthode. Un bien juste prix et bien présenté se vend souvent plus vite ET plus cher qu'un bien surévalué qui traîne.",
}, "<p>Vendre au meilleur prix, ce n'est pas espérer un miracle : c'est enchaîner sept étapes maîtrisées, du bon prix de départ jusqu'à la signature. Ce guide les déroule, avec les erreurs à éviter à chaque phase.</p><p>Le fil conducteur : le prix et la préparation pèsent bien plus que la chance. Ce que vous contrôlez au départ détermine le résultat final.</p>",
   "<h3>Avant de mettre en marché</h3><ol><li>Faire établir une analyse comparative et fixer un prix juste.</li><li>Préparer la propriété (désencombrer, réparer, nettoyer) et planifier des photos professionnelles.</li></ol>",
   "<li>Prix de départ : décision clé ; trop haut, il fait fuir et « brûle » la propriété.</li><li>Analyse comparative : ventes récentes semblables servant à fixer le prix.</li><li>Jours sur le marché : durée d'affichage ; s'allonge quand le prix est trop élevé.</li><li>Levée de conditions : étape où l'acheteur confirme inspection et financement.</li><li>Home staging : préparation de la propriété pour maximiser son attrait.</li>")

# ---- Guide 16 : Home staging express ----
TABLE[16] = g({
 0: "Ces trois principes — désencombrer, dépersonnaliser, mettre en lumière — expliquent la quasi-totalité de l'effet du home staging. L'acheteur doit pouvoir se projeter : moins il voit VOTRE vie, plus il imagine la sienne. Et tout cela coûte surtout du temps, pas de l'argent.",
 1: "La première impression se joue avant l'entrée : façade nette, allée dégagée, porte accueillante. Un extérieur soigné promet un intérieur bien entretenu ; un extérieur négligé installe le doute dès le trottoir. Quelques heures de ménage extérieur rapportent gros.",
 2: "Les pièces de vie et la cuisine sont les espaces qui vendent : dégagez les circulations, maximisez la lumière, neutralisez le décor et faites briller les surfaces. Une cuisine propre et épurée, même modeste, rassure bien plus qu'une cuisine encombrée, même haut de gamme.",
 3: "Les chambres et salles de bain se vendent par le calme et la propreté : literie neutre, surfaces dégagées, joints propres, aucune trace. Ce sont les détails (odeur, lumière, rangements dégagés) qui laissent l'impression d'une maison saine et bien tenue.",
 4: "Le plus rentable est souvent le moins cher : désencombrer, nettoyer à fond, rafraîchir la peinture en tons neutres, améliorer l'éclairage, réparer les petits défauts visibles. Si vous ne faites qu'une chose, désencombrez : une maison épurée paraît plus grande, plus lumineuse et mieux entretenue.",
}, "<p>Le home staging n'est pas de la décoration : c'est une stratégie de vente. Bien fait, il accélère la vente et améliore les offres — souvent pour quelques centaines de dollars. Ce guide va à l'essentiel, pièce par pièce.</p><p>La règle d'or : l'acheteur doit se projeter. On dépersonnalise, on épure, on met en lumière.</p>",
   "<h3>Mon plan staging</h3><ol><li>Désencombrer et dépersonnaliser chaque pièce, puis nettoyer à fond.</li><li>Rafraîchir la peinture en tons neutres et améliorer l'éclairage avant les photos.</li></ol>",
   "<li>Désencombrer : retirer le surplus d'objets pour agrandir visuellement l'espace.</li><li>Dépersonnaliser : neutraliser le décor pour que l'acheteur se projette.</li><li>Curb appeal : attrait de la façade et de l'entrée, la première impression.</li><li>Tons neutres : couleurs sobres qui plaisent au plus grand nombre.</li><li>Mise en lumière : maximiser la lumière naturelle et l'éclairage chaud.</li>")

# ---- Guide 17 : Fixer le bon prix ----
TABLE[17] = g({
 0: "La valeur marchande, c'est le prix qu'un acheteur informé paie aujourd'hui — pas votre évaluation municipale, ni ce que vous avez investi, ni ce dont vous « avez besoin ». Ces fausses références mènent au surprix. Seules les ventes récentes comparables disent la vérité du marché.",
 1: "L'ACM compare votre propriété à des ventes récentes semblables (secteur, taille, état), avec des ajustements pour les différences. C'est la base rationnelle d'un prix crédible. Une ACM solide vous protège autant contre le surprix (qui fait traîner) que le sous-prix (qui laisse de l'argent sur la table).",
 2: "L'évaluation municipale sert à calculer vos taxes : établie en masse et avec décalage, elle n'est pas le prix du marché. Ne l'utilisez jamais pour fixer un prix de vente ou faire une offre — c'est le malentendu numéro un, dans les deux sens.",
 3: "La stratégie de prix de départ dépend du marché : un prix juste, aligné sur l'ACM, attire vite et peut susciter plusieurs offres. Les premières semaines sont décisives ; un prix bien calibré au lancement rapporte presque toujours plus qu'un prix gonflé qu'on devra baisser.",
 4: "Surévaluer coûte cher : moins de visites, jours qui s'accumulent, signal de faiblesse, et baisses successives qui inquiètent. Pire, votre bien sert à « vendre » les propriétés mieux prix des voisins. Un prix juste dès le départ génère plus d'intérêt — et souvent un meilleur prix final.",
}, "<p>Fixer le bon prix est la décision la plus importante d'une vente. Ce guide explique ce qui détermine vraiment la valeur, comment se construit une analyse comparative, pourquoi l'évaluation municipale n'est pas le prix, et comment le surprix se retourne contre le vendeur.</p><p>Le message clé : le marché récompense un prix juste et punit un prix gonflé.</p>",
   "<h3>Pour fixer mon prix</h3><ol><li>Faire établir une analyse comparative récente et objective.</li><li>Ignorer l'évaluation municipale et mes coûts passés ; suivre le marché.</li></ol>",
   "<li>Valeur marchande : prix qu'un acheteur informé paie aujourd'hui.</li><li>ACM : analyse comparative de marché fondée sur des ventes récentes semblables.</li><li>Évaluation municipale : valeur fiscale, distincte du prix de vente.</li><li>Surévaluation : prix trop élevé qui fait traîner et baisser la propriété.</li><li>Jours sur le marché : indicateur clé ; s'allonge avec un prix mal calibré.</li>")

if __name__ == '__main__':
    nums = [int(a) for a in sys.argv[1:]] or list(TABLE.keys())
    for n in nums:
        if n in TABLE:
            apply(n, *TABLE[n])
