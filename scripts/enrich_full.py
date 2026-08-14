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

# ---- Guide 18 : Vendre seul ou avec un courtier ----
TABLE[18] = g({
 0: "Au-delà de l'affichage, un courtier fixe le juste prix, prépare la mise en marché, filtre les acheteurs, mène la négociation et sécurise les aspects juridiques jusqu'au notaire. La commission paie un travail complet — et une responsabilité professionnelle encadrée par l'OACIQ.",
 1: "Vendre seul n'est ni gratuit ni sans risque : forfaits de visibilité, temps, gestion des visites et surtout responsabilité juridique. Une erreur dans la promesse d'achat ou une omission dans la déclaration du vendeur peut coûter bien plus qu'une commission.",
 2: "Comparez le NET réellement encaissé dans chaque scénario, pas la commission en valeur absolue. Un courtier qui obtient un meilleur prix, plus vite et avec moins de risque, peut vous laisser autant — voire plus — en poche qu'une vente seule mal négociée.",
 3: "Vendre seul peut convenir si vous connaissez très bien le marché local, avez du temps, êtes à l'aise avec la paperasse et la négociation, et acceptez le risque. Dans le doute, ou pour une propriété complexe (copropriété, succession, séparation), l'accompagnement se rentabilise vite.",
 4: "Si vous vendez seul, blindez au moins l'essentiel : prix appuyé sur des comparables, déclaration du vendeur rigoureuse, documents conformes, sécurité lors des visites, et validation juridique par un notaire. Ce que vous économisez en commission, vous le payez en temps et en risque : évaluez-le honnêtement.",
}, "<p>Vendre seul ou avec un courtier ? La bonne réponse dépend de votre marché, de votre temps et de votre tolérance au risque. Ce guide compare honnêtement les deux voies — le vrai travail d'un courtier, les coûts et risques du « sans intermédiaire », et le calcul du net en poche.</p><p>Objectif : décider en connaissance de cause, chiffres et responsabilités en main.</p>",
   "<h3>Pour décider</h3><ol><li>Calculer mon net en poche estimé dans chaque scénario.</li><li>Évaluer mon temps disponible, mon aisance juridique et le risque acceptable.</li></ol>",
   "<li>Commission : rémunération du courtier, en échange d'un mandat complet.</li><li>OACIQ : organisme qui encadre les courtiers et protège le public.</li><li>Net en poche : montant réellement encaissé après tous les frais.</li><li>Déclaration du vendeur : formulaire consignant ce que le vendeur sait de la propriété.</li><li>Responsabilité juridique : risque assumé par le vendeur qui agit seul.</li>")

# ---- Guide 19 : La déclaration du vendeur ----
TABLE[19] = g({
 0: "Par défaut, une vente est assortie d'une garantie légale de qualité : vous répondez des vices cachés qui rendaient la propriété impropre à son usage. La comprendre, c'est saisir pourquoi la transparence protège autant le vendeur que l'acheteur.",
 1: "La déclaration du vendeur est votre outil de transparence : vous y consignez ce que vous savez (réparations, sinistres, infiltrations, litiges). Bien remplie, elle réduit fortement votre risque de poursuite, car l'acheteur achète en connaissance de cause.",
 2: "Réduisez votre risque en amont : rassemblez factures, permis, rapports et garanties ; déclarez tout problème connu ; conservez des preuves. Un dossier complet est votre meilleure défense si un différend survient après la vente.",
 3: "Si un acheteur invoque un vice caché après la vente, la marche à suivre compte : il doit généralement vous aviser rapidement et vous laisser constater avant de faire des travaux. Ne réagissez pas seul dans la panique — documentez et consultez avant de vous engager.",
 4: "La règle d'or : dans le doute, déclarez. Taire un problème connu pour « ne pas nuire à la vente » est exactement ce qui mène aux poursuites coûteuses. Une déclaration honnête et complète est la meilleure protection du vendeur.",
}, "<p>La déclaration du vendeur n'est pas une formalité : c'est votre bouclier contre les poursuites après la vente. Ce guide explique la garantie légale, comment remplir la déclaration à votre avantage, réduire votre risque et réagir si un problème surgit.</p><p>Le fil conducteur : la transparence protège le vendeur autant que l'acheteur.</p>",
   "<h3>Avant de vendre</h3><ol><li>Rassembler factures, permis et rapports des travaux effectués.</li><li>Remplir la déclaration honnêtement, en déclarant tout problème connu.</li></ol>",
   "<li>Garantie légale : responsabilité du vendeur pour les vices cachés, par défaut.</li><li>Vice caché : défaut non apparent rendant la propriété impropre à son usage.</li><li>Déclaration du vendeur : consignation écrite de ce que le vendeur sait.</li><li>Vente sans garantie légale : vente « aux risques de l'acheteur », à encadrer.</li><li>Preuve : factures et rapports conservés pour se protéger d'une réclamation.</li>")

# ---- Guide 20 : Vendre son condo ----
TABLE[20] = g({
 0: "Un acheteur de condo (et son notaire, son prêteur) exigeront le dossier de copropriété : déclaration, règlement, états financiers, fonds de prévoyance, procès-verbaux. Le réunir d'avance accélère la vente et projette une image de gestion saine.",
 1: "Les charges et la santé du fonds de prévoyance sont scrutées de près : présentez-les clairement plutôt que de les subir. Un fonds bien garni et un historique de gestion transparent deviennent des arguments de confiance — pas des points faibles.",
 2: "Pour un condo, valorisez ce qui lui est propre : emplacement, commodités de l'immeuble, faible entretien, sécurité, stationnement. Ciblez le mode de vie que votre unité permet — c'est souvent lui, plus que la superficie, qui déclenche le coup de cœur.",
 3: "Les pièges classiques : documents incomplets ou introuvables (retardent et inquiètent), fonds de prévoyance faible, litiges de copropriété non divulgués, règles restrictives ignorées. Anticipez-les : ce sont eux qui font dérailler une vente de condo à la dernière minute.",
 4: "Adaptez votre mise en marché à l'acheteur le plus probable : premier acheteur sensible au prix et aux charges, retraité en quête de tranquillité, ou investisseur attentif au rendement et à la location permise. Le même condo, deux discours différents selon la cible.",
}, "<p>Vendre un condo, ce n'est pas vendre une maison : la copropriété ajoute des documents, des chiffres collectifs et des acheteurs types. Ce guide vous montre comment préparer le dossier, présenter les finances de l'immeuble, mettre en marché et éviter les pièges propres au condo.</p><p>L'idée : transformer la vie de copropriété en argument de confiance.</p>",
   "<h3>Avant d'afficher</h3><ol><li>Réunir le dossier complet de copropriété (déclaration, finances, PV).</li><li>Identifier mon acheteur type et adapter mon argumentaire.</li></ol>",
   "<li>Dossier de copropriété : ensemble des documents exigés par l'acheteur.</li><li>Fonds de prévoyance : réserve collective ; sa santé rassure ou inquiète.</li><li>Charges de copropriété : frais mensuels de gestion et d'entretien.</li><li>Procès-verbaux : historique des décisions et des problèmes de l'immeuble.</li><li>Acheteur type : profil le plus probable, qui oriente la mise en marché.</li>")

# ---- Guide 21 : Photos, vidéo et marketing ----
TABLE[21] = g({
 0: "Les acheteurs jugent en quelques secondes, sur les photos, avant même de lire la description. Des photos professionnelles, lumineuses et bien cadrées font la différence entre « on visite » et « on passe ». C'est l'investissement marketing le plus rentable d'une vente.",
 1: "La vidéo et la visite virtuelle (3D, plans) permettent aux acheteurs de se projeter et de filtrer avant de se déplacer : vous recevez des visiteurs plus qualifiés. Pour les acheteurs hors secteur, c'est souvent ce qui déclenche la première visite en personne.",
 2: "Une bonne description ouvre sur l'atout n°1 (emplacement, lumière, rénovation, cour), décrit concrètement sans exagérer, et se termine par un appel à l'action. Elle vend sans tromper : promettre ce qu'on ne tient pas génère des visites déçues et des offres qui tombent.",
 3: "La diffusion doit viser large ET juste : Centris, portails, réseaux sociaux, réseau de contacts et d'acheteurs. Une belle propriété mal diffusée se vend mal ; l'exposition auprès du bon public est aussi importante que la qualité des visuels.",
 4: "Les meilleures photos ne rattrapent pas une propriété mal préparée : désencombrez, nettoyez à fond, maximisez la lumière et rangez les objets personnels AVANT la séance. Traitez la journée photo comme la visite d'un acheteur exigeant — c'est votre première impression en ligne, et il n'y en a qu'une.",
}, "<p>Aujourd'hui, une vente se gagne d'abord en ligne : photos, vidéo, description et diffusion décident si l'acheteur clique ou passe. Ce guide couvre chaque levier marketing, de la préparation des lieux à la diffusion auprès du bon public.</p><p>Le principe : soigner la vitrine numérique autant que la propriété elle-même.</p>",
   "<h3>Avant la mise en ligne</h3><ol><li>Préparer les lieux, puis planifier des photos (et vidéo) professionnelles.</li><li>Rédiger une description qui ouvre sur l'atout n°1 et planifier une diffusion large.</li></ol>",
   "<li>Centris : plateforme de référence des propriétés à vendre au Québec.</li><li>Visite virtuelle : parcours 3D permettant de visiter à distance.</li><li>Curb appeal numérique : qualité des photos qui donne envie de visiter.</li><li>Appel à l'action : invitation claire à visiter ou à faire une offre.</li><li>Diffusion : exposition de l'annonce auprès du bon public d'acheteurs.</li>")

# ---- Guide 22 : Gérer les offres multiples ----
TABLE[22] = g({
 0: "Les offres multiples naissent presque toujours de deux ingrédients : une propriété désirable et un prix bien calibré qui crée de l'émulation. Ce n'est pas un coup de chance mais le résultat d'une bonne stratégie de prix et de mise en marché.",
 1: "Comparez chaque offre dans son ensemble, pas seulement au prix : conditions (inspection, financement), dates, dépôt, solidité de l'acheteur (préapprobation). Une offre légèrement plus basse mais sans condition et bien financée peut être la plus sûre.",
 2: "La gestion des offres multiples est encadrée par des règles d'équité et de transparence : tous les acheteurs doivent être traités correctement et informés du processus. Un faux pas peut invalider une transaction ou exposer à une plainte — d'où l'intérêt d'un cadre professionnel.",
 3: "L'euphorie pousse aux décisions hâtives. Fixez vos critères à l'avance (prix, conditions, dates acceptables), évaluez froidement, et rappelez-vous que la meilleure offre est celle qui se rendra jusqu'au notaire — pas seulement la plus haute sur papier.",
 4: "Côté acheteur, on peut se démarquer sans surenchérir aveuglément : arriver préapprouvé, offrir des dates souples, faire une offre propre et fixer son plafond à l'avance. Une offre solide rassure souvent autant qu'un dollar de plus — et vous protège du regret d'avoir surpayé.",
}, "<p>Les offres multiples excitent autant qu'elles déstabilisent. Bien gérées, elles maximisent le résultat du vendeur ; mal gérées, elles mènent à des erreurs. Ce guide explique comment elles naissent, comment comparer les offres au-delà du prix, les règles à respecter et comment décider avec méthode — côté vendeur ET acheteur.</p>",
   "<h3>Pour bien gérer</h3><ol><li>Fixer d'avance mes critères (prix, conditions, dates) et le processus.</li><li>Évaluer chaque offre dans son ensemble, pas seulement au montant.</li></ol>",
   "<li>Offres multiples : plusieurs offres reçues en même temps sur une propriété.</li><li>Offre conditionnelle : offre soumise à inspection, financement, etc.</li><li>Solidité de l'acheteur : préapprobation et capacité réelle à conclure.</li><li>Équité et transparence : règles encadrant le traitement des offres.</li><li>Plafond : montant maximum fixé d'avance par l'acheteur.</li>")

# ---- Guide 23 : Vendre une propriété héritée ----
TABLE[23] = g({
 0: "Dans une succession, c'est généralement le liquidateur qui a le pouvoir de vendre, une fois certaines étapes franchies (acceptation de la charge, inventaire, parfois autorisations). Vérifiez qui est habilité et quels préalables sont requis AVANT de mettre en marché, pour éviter une vente contestable.",
 1: "Une propriété héritée est souvent ancienne, meublée ou inoccupée : un nettoyage, un désencombrement et quelques réparations ciblées peuvent améliorer nettement le prix. Fixez le prix sur une analyse comparative, pas sur la valeur sentimentale ou l'évaluation municipale.",
 2: "La fiscalité d'une succession peut être complexe : gain en capital, valeur au décès, délais. Une erreur peut coûter cher. Consultez un notaire et un comptable pour connaître les implications avant de vendre — c'est un investissement qui évite de mauvaises surprises fiscales.",
 3: "Quand plusieurs héritiers sont concernés, les décisions (vendre ou non, prix, calendrier) doivent être prises ensemble. Clarifiez tôt le mode de décision et le partage ; un intermédiaire neutre (notaire, courtière) aide à garder le cap sans que l'émotion ne bloque la vente.",
 4: "Vider la maison est une étape chargée en émotion autant qu'en logistique : triez (garder, donner, vendre, jeter), documentez les objets de valeur et, au besoin, faites-vous aider. Ne précipitez pas le tri, mais ne laissez pas non plus la vente traîner des mois.",
}, "<p>Vendre une propriété héritée mêle droit, fiscalité, logistique et émotions. Ce guide clarifie qui peut vendre et quand, comment préparer et prix la propriété, les enjeux fiscaux, la décision à plusieurs héritiers et l'étape délicate de vider la maison.</p><p>Objectif : mener la vente sereinement, dans les règles, sans que le conflit ou l'émotion ne fasse perdre de la valeur.</p>",
   "<h3>Premiers pas</h3><ol><li>Confirmer qui est le liquidateur et quels préalables sont requis.</li><li>Consulter notaire/comptable sur la fiscalité avant de vendre.</li></ol>",
   "<li>Liquidateur : personne habilitée à administrer et vendre les biens de la succession.</li><li>Gain en capital : profit imposable réalisé à la vente, selon la valeur au décès.</li><li>Indivision successorale : propriété détenue en commun par les héritiers.</li><li>Analyse comparative : base objective pour fixer le prix.</li><li>Vente de succession : liquidation du contenu avant la mise en marché.</li>")

# ---- Guide 24 : Vendre lors d'une séparation ----
TABLE[24] = g({
 0: "Vos droits sur la propriété dépendent de votre statut : mariés/unis civilement (patrimoine familial), ou conjoints de fait (l'écrit et le titre priment). Clarifier qui détient quoi est la première étape — elle conditionne le partage et les décisions à venir.",
 1: "Trois options : vendre et partager (souvent la plus neutre), qu'un conjoint rachète la part de l'autre, ou attendre (rarement idéal). Le bon choix dépend de vos moyens, de la faisabilité du rachat et de votre besoin de tourner la page. Décidez ensemble, par écrit si possible.",
 2: "Comme toute vente, on part d'une analyse comparative pour fixer un prix juste et on prépare la propriété. La difficulté est la coordination à deux dans un contexte tendu : confiez la logistique et la communication à une courtière neutre pour éviter que chaque décision ne devienne un affrontement.",
 3: "Le partage du produit net (après remboursement de l'hypothèque et des frais) dépend de votre statut et de vos ententes. Clarifiez-le à l'avance et, au besoin, faites-le encadrer juridiquement : un partage flou est une source majeure de conflits de dernière minute.",
 4: "Rester fonctionnel malgré le conflit protège votre argent : entendez-vous sur les décisions clés à l'avance, passez par des intermédiaires neutres et séparez les enjeux financiers des tensions personnelles. Une courtière comme canal unique de communication désamorce beaucoup de tensions.",
}, "<p>Vendre lors d'une séparation ajoute une charge émotive à un processus déjà exigeant. Ce guide aide à garder le cap : comprendre le statut de la propriété, choisir entre vendre, racheter ou attendre, fixer le prix à deux, partager le produit et rester fonctionnel malgré le conflit.</p><p>Le fil conducteur : structurer et déléguer pour que l'émotion ne coûte pas d'argent.</p>",
   "<h3>Pour avancer</h3><ol><li>Clarifier le statut de la propriété et le mode de partage.</li><li>Confier la vente à une courtière neutre servant de canal de communication.</li></ol>",
   "<li>Patrimoine familial : protections des couples mariés/unis civilement.</li><li>Conjoints de fait : sans protections automatiques ; le titre et l'écrit priment.</li><li>Rachat de part : un conjoint achète la part de l'autre pour garder la propriété.</li><li>Produit net : somme restante après hypothèque et frais, à partager.</li><li>Médiation : accompagnement neutre pour faciliter les décisions.</li>")

# ---- Guide 25 : Le certificat de localisation ----
TABLE[25] = g({
 0: "Le certificat de localisation est un document d'arpentage qui décrit l'état et la situation de la propriété (limites, bâtiments, servitudes, empiètements). Le prêteur et le notaire l'exigent : c'est une pièce clé qui doit refléter la réalité actuelle au moment de la vente.",
 1: "Un certificat devient insuffisant s'il est trop ancien ou s'il ne correspond plus à l'état des lieux (agrandissement, cabanon, piscine, clôture, servitude nouvelle). En cas de doute, faites-le vérifier tôt : produire un nouveau certificat prend du temps qu'il ne faut pas découvrir à la dernière minute.",
 2: "Le certificat peut révéler des irrégularités à régler : empiètement (un bâtiment qui dépasse une limite), non-conformité à la réglementation, servitude oubliée. Mieux vaut les découvrir — et les traiter — avant la vente que de les voir bloquer la transaction chez le notaire.",
 3: "Un nouveau certificat représente un coût (honoraires d'arpenteur) et surtout un délai. C'est un poste souvent oublié : anticipez-le dès la décision de vendre, et négociez dans la promesse d'achat qui le paie, pour éviter les tensions de dernière minute.",
 4: "Si le certificat est périmé ou inadéquat, plusieurs options : en faire produire un nouveau, ou parfois recourir à une assurance titres selon les cas. Abordez la question dès la promesse d'achat, jamais la veille de la signature — c'est là que ça coince le plus souvent.",
}, "<p>Le certificat de localisation est l'un des documents les plus mal compris — et les plus capables de retarder une vente. Ce guide explique son rôle, quand il faut le renouveler, les irrégularités qu'il révèle, et comment anticiper coûts et délais.</p><p>Le message clé : on s'en occupe tôt, jamais la veille de la signature.</p>",
   "<h3>À anticiper</h3><ol><li>Vérifier dès la décision de vendre si mon certificat est encore valable.</li><li>Régler d'avance toute irrégularité et convenir qui paie un nouveau certificat.</li></ol>",
   "<li>Certificat de localisation : document d'arpentage décrivant l'état et la situation du bien.</li><li>Arpenteur-géomètre : professionnel qui produit le certificat.</li><li>Empiètement : construction dépassant une limite de propriété.</li><li>Servitude : droit grevant un terrain au profit d'un autre.</li><li>Assurance titres : protection couvrant certains problèmes de titre ou de conformité.</li>")


# ---- Guide 26 : Premier immeuble à revenus ----
TABLE[26] = g({
 0: "Un immeuble à revenus n'est pas une résidence : il se juge sur ses chiffres, pas sur le coup de cœur. Revenus, dépenses, cashflow et rendement priment sur la déco. Adopter cette logique d'affaires dès la première visite est ce qui distingue l'investisseur du simple acheteur émotif.",
 1: "Avant d'offrir, vérifiez le concret : baux et loyers actuels vs marché, historique des dépenses (taxes, assurances, énergie, entretien), état du bâtiment et travaux à venir. Un loyer « sous le marché » n'est pas un cadeau automatique — les règles d'augmentation encadrent la hausse.",
 2: "Les erreurs classiques du débutant : surestimer les revenus, sous-estimer les dépenses, oublier la vacance et l'entretien, et négliger les règles locatives. Un budget réaliste, avec une réserve, vous évite de découvrir que votre « bon deal » perd de l'argent chaque mois.",
 3: "Une fois les chiffres validés, structurez une offre d'investisseur : conditions d'inspection et de financement, examen des baux et des états financiers, délais suffisants. Vous n'achetez pas un immeuble sur la foi du vendeur — vous l'achetez sur des documents vérifiés.",
 4: "Après l'achat, vous devenez gestionnaire : reprenez les baux, tenez une comptabilité dès le premier mois, constituez une réserve d'entretien et réagissez vite aux demandes. Une gestion rigoureuse fait la différence entre un investissement rentable et une source de stress.",
}, "<p>Acheter un premier immeuble à revenus, c'est passer d'acheteur à investisseur — puis à gestionnaire. Ce guide vous apprend à penser en chiffres, à vérifier un immeuble avant d'offrir, à éviter les erreurs classiques et à gérer une fois propriétaire.</p><p>Le fil conducteur : l'émotion choisit une maison, les chiffres choisissent un immeuble.</p>",
   "<h3>Avant d'offrir</h3><ol><li>Obtenir baux, loyers, et historique des dépenses de l'immeuble.</li><li>Bâtir mon budget réaliste (avec vacance et réserve) et valider mon financement.</li></ol>",
   "<li>Immeuble à revenus : propriété achetée pour générer des loyers.</li><li>Cashflow : ce qui reste après toutes les dépenses et l'hypothèque.</li><li>Vacance : période sans locataire, à budgéter.</li><li>Réserve d'entretien : somme mise de côté pour les réparations.</li><li>Bail : contrat de location qui suit l'immeuble à la vente.</li>")

# ---- Guide 27 : Calculer la rentabilité ----
TABLE[27] = g({
 0: "Le RNE (revenus moins dépenses d'exploitation, avant financement) est la mesure de base de la performance d'un immeuble. Il permet de comparer des immeubles entre eux sans être faussé par le mode de financement de chacun. Un RNE solide est le socle de tout bon investissement.",
 1: "Le cashflow, c'est le RNE moins les versements hypothécaires : l'argent réel qui reste (ou manque) chaque mois. Un cashflow négatif signifie que vous financez l'immeuble de votre poche. Visez au minimum l'équilibre, avec une marge pour les imprévus et la vacance.",
 2: "Le taux de capitalisation (RNE ÷ prix) permet de comparer des immeubles indépendamment du financement, comme un « rendement » de l'immeuble. Un cap rate plus élevé peut signaler un meilleur rendement… ou un risque plus élevé. Comparez toujours des immeubles semblables, dans des secteurs semblables.",
 3: "Le MRB (prix ÷ revenus bruts) est un repère rapide, mais grossier : il ignore les dépenses. Utilisez-le pour un premier tri, jamais pour décider. Les ratios sont des outils, pas des verdicts : croisez-les toujours avec les chiffres réels et l'état du bâtiment.",
 4: "Le rendement sur mise de fonds (cash-on-cash) mesure ce que rapporte VOTRE argent investi. C'est là qu'intervient l'effet de levier : financer une partie du prix amplifie le rendement… mais aussi le risque. Un cashflow négatif transforme le levier en fardeau : gardez toujours une marge.",
}, "<p>La rentabilité d'un immeuble se calcule, elle ne se devine pas. Ce guide décortique les indicateurs clés — RNE, cashflow, taux de capitalisation, MRB, rendement sur mise de fonds — et surtout leurs limites, pour décider sur des faits.</p><p>Le message clé : aucun ratio ne dit tout ; c'est leur ensemble, croisé avec l'état du bâtiment, qui éclaire la décision.</p>",
   "<h3>Pour analyser un immeuble</h3><ol><li>Calculer RNE, cashflow et rendement sur mise de fonds à partir des chiffres réels.</li><li>Tester une hausse de taux et une vacance pour vérifier ma marge.</li></ol>",
   "<li>RNE : revenus moins dépenses d'exploitation, avant financement.</li><li>Cashflow : RNE moins les versements hypothécaires.</li><li>Taux de capitalisation : RNE ÷ prix, pour comparer les immeubles.</li><li>MRB : prix ÷ revenus bruts, repère rapide et grossier.</li><li>Effet de levier : usage du financement qui amplifie rendement et risque.</li>")

# ---- Guide 28 : Financer un immeuble à revenus ----
TABLE[28] = g({
 0: "La ligne de partage clé : 1 à 4 logements (règles proches du résidentiel, mise de fonds plus basse si vous occupez) vs 5 logements et plus (financement commercial, mise de fonds plus élevée, analyse basée sur les revenus de l'immeuble). Cette distinction change tout votre montage.",
 1: "Optimisez votre apport selon votre projet : occuper un logement d'un 1-4 logements ouvre des règles avantageuses ; un immeuble purement locatif exige davantage. Le prêteur retient aussi une partie des loyers dans votre capacité — un levier à faire chiffrer précisément.",
 2: "Les assureurs de prêt (SCHL et autres) offrent des programmes qui peuvent réduire la mise de fonds ou améliorer les conditions, notamment pour le locatif. Ils prennent en compte les loyers selon des règles précises. Un courtier hypothécaire spécialisé connaît ces programmes et leurs critères.",
 3: "Un montage solide compare plusieurs prêteurs (taux ET conditions), prévoit une réserve, et ne mise pas tout sur un scénario optimiste. Le meilleur taux avec des conditions rigides peut coûter cher au mauvais moment : pensez pénalités, portabilité et remboursements accélérés.",
 4: "Le prêteur vous évalue via des ratios d'endettement, la prise en compte partielle des loyers, et un test de résistance (qualification à un taux supérieur). Connaître ces règles à l'avance évite les refus : rencontrez un courtier spécialisé en locatif AVANT de magasiner.",
}, "<p>Financer un immeuble à revenus n'obéit pas aux mêmes règles qu'une résidence. Ce guide clarifie la distinction 1-4 vs 5+ logements, la mise de fonds, le rôle des assureurs de prêt et la façon dont le prêteur qualifie votre dossier.</p><p>Objectif : monter un financement solide qui protège votre rentabilité, plutôt que de courir après le taux le plus bas.</p>",
   "<h3>Avant de magasiner</h3><ol><li>Rencontrer un courtier hypothécaire spécialisé en immobilier locatif.</li><li>Faire chiffrer ma capacité (loyers inclus) et comparer taux ET conditions.</li></ol>",
   "<li>1-4 logements : catégorie proche du résidentiel, financement plus souple.</li><li>5 logements et plus : financement commercial, basé sur les revenus.</li><li>Assurance prêt : programme réduisant la mise de fonds ou améliorant les conditions.</li><li>Test de résistance : qualification à un taux supérieur au taux réel.</li><li>Prise en compte des loyers : part des revenus retenue par le prêteur.</li>")

# ---- Guide 29 : Fiscalité de l'investisseur immobilier ----
TABLE[29] = g({
 0: "Les loyers sont imposables, mais de nombreuses dépenses se déduisent : intérêts hypothécaires, taxes, assurances, entretien, gestion, services publics payés. Distinguer une réparation (déductible) d'une amélioration (capitalisée) est essentiel — et une source fréquente d'erreurs.",
 1: "La déduction pour amortissement (DPA) permet de déduire une partie de la valeur du bâtiment chaque année, réduisant l'impôt sur les loyers. Mais attention : elle peut être « récupérée » et imposée à la revente. Puissante, la DPA se manie avec un comptable, pas à l'aveugle.",
 2: "À la revente avec profit, une partie du gain en capital est imposable (selon la valeur d'acquisition et les règles en vigueur). Anticipez cet impôt dans votre stratégie de sortie : le « profit » affiché n'est pas le montant net, une fois l'impôt et la récupération d'amortissement pris en compte.",
 3: "Détenir en nom personnel est simple ; détenir via une société offre d'autres possibilités fiscales et de responsabilité, mais avec des coûts et une complexité accrus. Le bon choix dépend de la taille de votre projet et de votre situation — une décision à valider avec un comptable et un notaire.",
 4: "La fiscalité immobilière ne pardonne pas l'improvisation : conservez tous les reçus, séparez les finances de l'immeuble de vos finances personnelles, et entourez-vous d'un comptable qui connaît l'immobilier. Des registres impeccables réduisent vos impôts légitimement et vous protègent en cas de vérification.",
}, "<p>La fiscalité peut faire ou défaire le rendement d'un immeuble. Ce guide couvre les revenus et dépenses déductibles, l'amortissement et ses pièges, le gain en capital à la revente, et le choix entre détention personnelle et société.</p><p>Contenu informatif : la fiscalité étant technique et évolutive, faites toujours valider votre situation par un comptable spécialisé.</p>",
   "<h3>Pour bien gérer ma fiscalité</h3><ol><li>Tenir des registres séparés et conserver tous les reçus dès le premier mois.</li><li>Consulter un comptable spécialisé (DPA, structure de détention, sortie).</li></ol>",
   "<li>Dépense déductible : coût soustrait des revenus locatifs imposables.</li><li>DPA : déduction pour amortissement, récupérable à la revente.</li><li>Gain en capital : profit imposable réalisé à la vente.</li><li>Réparation vs amélioration : déductible immédiatement vs capitalisée.</li><li>Détention par société : structure offrant d'autres options fiscales, plus complexe.</li>")

# ---- Guide 30 : Locataires et TAL ----
TABLE[30] = g({
 0: "Tout commence par le bail (souvent le formulaire officiel du TAL) et une sélection rigoureuse : vérification des revenus, des références et du dossier de crédit, dans le respect de la loi. Un bon locataire bien choisi au départ vaut mieux que dix démarches au tribunal ensuite.",
 1: "L'augmentation de loyer est encadrée : elle se fait à la reconduction du bail, avec un avis dans les délais, et le locataire peut l'accepter, la refuser ou quitter. Des critères (travaux, taxes, assurances) guident une hausse raisonnable. Improviser une hausse expose à un refus au TAL.",
 2: "Chacun a ses droits et obligations : le propriétaire fournit un logement en bon état et respecte la jouissance paisible ; le locataire paie à temps, entretient et respecte le bail. Connaître ce cadre évite la majorité des litiges — la plupart naissent d'un malentendu sur les règles.",
 3: "Le Tribunal administratif du logement (TAL) tranche les litiges entre locateurs et locataires (loyers impayés, reprises, réparations, hausses). Ses décisions s'imposent. Un dossier documenté (bail, avis, échanges écrits) est votre meilleur atout si vous devez y recourir.",
 4: "Face à un retard ou un conflit, réagissez tôt et dans les règles : communiquez par écrit dès le premier retard, documentez tout, connaissez vos recours et leurs délais. N'attendez pas trois mois d'impayés : un rappel écrit ferme mais courtois règle la majorité des situations avant qu'elles ne dégénèrent.",
}, "<p>Devenir propriétaire-bailleur, c'est entrer dans un cadre légal précis. Ce guide couvre le bail et la sélection des locataires, l'augmentation de loyer, les droits et obligations de chacun, le rôle du TAL et la façon de réagir aux retards et conflits.</p><p>Le fil conducteur : de bonnes pratiques au départ et des écrits rigoureux évitent la majorité des litiges.</p>",
   "<h3>Comme bailleur</h3><ol><li>Utiliser le bail officiel et sélectionner rigoureusement (revenus, références, crédit).</li><li>Documenter tous les échanges et connaître les délais d'avis et de recours.</li></ol>",
   "<li>Bail : contrat de location, souvent le formulaire officiel du TAL.</li><li>Reconduction : renouvellement du bail, moment de l'augmentation.</li><li>Jouissance paisible : droit du locataire à un usage tranquille du logement.</li><li>TAL : Tribunal administratif du logement, qui tranche les litiges.</li><li>Avis : notification écrite (hausse, reprise) dans des délais précis.</li>")

# ---- Guide 31 : Reprise de logement et éviction ----
TABLE[31] = g({
 0: "Reprise et éviction sont deux démarches distinctes : la reprise permet de reprendre un logement pour s'y loger (soi ou un proche admissible) ; l'éviction vise à récupérer le logement pour des travaux majeurs, une subdivision ou un changement d'affectation. Les règles et protections diffèrent.",
 1: "La reprise est généralement possible pour loger le propriétaire ou certains proches (conjoint, ascendants/descendants), sous conditions. Toutes les situations ne sont pas admissibles : vérifiez la recevabilité de votre projet AVANT d'acheter en comptant dessus.",
 2: "La procédure exige un avis écrit dans des délais précis, et parfois le versement d'indemnités au locataire. Le locataire peut accepter ou contester devant le TAL. Le moindre écart de procédure (délai, forme) peut faire échouer la démarche : la rigueur est essentielle.",
 3: "Si votre projet dépend de la libération d'un logement, intégrez ces règles à votre décision d'achat : délais, admissibilité, risque de contestation, coût des indemnités. Acheter en présumant qu'on « videra » facilement un logement est une erreur fréquente et coûteuse.",
 4: "Une reprise mal exécutée peut être contestée et refusée. Utilisez le bon motif et la bonne personne admissible, respectez les délais à la lettre, versez les indemnités prévues et agissez de bonne foi — une reprise de mauvaise foi expose à des sanctions. Au moindre doute, faites valider votre avis avant de l'envoyer.",
}, "<p>Reprise et éviction sont des démarches sensibles, très encadrées, où le moindre faux pas peut tout faire échouer. Ce guide distingue les deux, précise les motifs et personnes admissibles, la procédure (avis, délais, indemnités) et l'importance d'anticiper avant d'acheter.</p><p>Contenu informatif : ces règles étant strictes et évolutives, faites valider votre démarche avant d'agir.</p>",
   "<h3>Avant d'agir</h3><ol><li>Vérifier l'admissibilité de mon projet (motif, personne, délais).</li><li>Faire valider mon avis et respecter la procédure à la lettre.</li></ol>",
   "<li>Reprise de logement : reprendre un logement pour s'y loger (soi ou un proche admissible).</li><li>Éviction : récupérer le logement pour travaux majeurs, subdivision, changement d'affectation.</li><li>Avis : notification écrite dans des délais précis.</li><li>Indemnité : compensation parfois due au locataire.</li><li>Mauvaise foi : reprise non réelle, exposant à des sanctions.</li>")

# ---- Guide 32 : Rénover pour créer de la valeur ----
TABLE[32] = g({
 0: "Toutes les rénovations ne se valent pas : cuisine, salle de bain, sous-sol aménagé et efficacité énergétique offrent souvent le meilleur retour ; certaines dépenses (piscine, finitions très personnalisées) se récupèrent mal. Ciblez ce qui plaît au marché, pas seulement à vous.",
 1: "Un flip se gagne ou se perd sur le budget : établissez un budget détaillé, ajoutez une marge pour imprévus (souvent 10-20 %), et tenez l'échéancier — chaque mois de retard coûte en intérêts et en frais de portage. Le dépassement de coûts est l'ennemi n°1 du rénovateur.",
 2: "Rénovez dans les règles : vérifiez les permis requis, respectez les normes, et choisissez des entrepreneurs licenciés et assurés. Des travaux sans permis peuvent bloquer une revente ou coûter cher à régulariser. La conformité protège votre valeur autant que votre sécurité.",
 3: "La marge d'un flip se calcule AVANT d'acheter : prix de revente estimé − prix d'achat − travaux − frais (portage, notaire, taxes, commission) − marge de sécurité. Si le calcul est serré au départ, le moindre imprévu efface le profit. Achetez sur les chiffres, pas sur l'espoir.",
 4: "On ne rénove pas pareil pour habiter longtemps ou pour revendre : pour soi, privilégiez votre confort ; pour le marché, visez des choix neutres et populaires, sans sur-améliorer par rapport au quartier. Devenir la maison la plus chère de la rue, c'est investir un argent qu'on ne récupérera pas.",
}, "<p>La rénovation peut créer de la valeur… ou la détruire. Ce guide distingue les travaux rentables, la maîtrise du budget et de l'échéancier, la conformité (permis, normes, entrepreneurs) et le calcul de la marge réelle d'un flip.</p><p>Le message clé : rénovez selon l'objectif et le quartier, et faites les chiffres avant d'acheter.</p>",
   "<h3>Avant de rénover</h3><ol><li>Calculer la marge réelle AVANT d'acheter (revente − achat − travaux − frais − marge).</li><li>Vérifier permis et normes, et choisir des entrepreneurs licenciés et assurés.</li></ol>",
   "<li>Flip : achat-rénovation-revente à profit sur un horizon court.</li><li>Frais de portage : coûts (intérêts, taxes) pendant la détention/rénovation.</li><li>Dépassement de coûts : hausse du budget, ennemi n°1 du flip.</li><li>Sur-amélioration : rénovation au-delà de la valeur du secteur, mal récupérée.</li><li>Permis : autorisation municipale requise pour certains travaux.</li>")

# ---- Guide 33 : Location court terme (Airbnb) ----
TABLE[33] = g({
 0: "Au Québec, l'hébergement touristique court terme est encadré : enregistrement, numéro à afficher, et obligations fiscales. Opérer sans se conformer expose à des amendes importantes. La première étape n'est pas de décorer l'annonce, mais de vérifier que vous avez le droit d'opérer, et comment.",
 1: "Le zonage municipal est le facteur décisif : au-delà des règles provinciales, chaque ville (et souvent chaque secteur) autorise ou interdit le court terme. Une adresse peut être parfaite sur le papier et totalement interdite au court terme. Vérifiez le zonage AVANT d'acheter en comptant sur l'Airbnb.",
 2: "En copropriété, une couche s'ajoute : même si la ville et la province le permettent, la déclaration de copropriété peut interdire la location court terme. Beaucoup d'immeubles la bannissent. Lisez la déclaration et le règlement — passer outre expose à des poursuites du syndicat.",
 3: "Évaluez le court terme comme un vrai business : revenus variables (saisonnalité, taux d'occupation) vs charges élevées (ménage, gestion, meubles, plateformes, assurance spécifique). La rentabilité affichée fond vite si l'on néglige ces coûts et la gestion active qu'exige ce modèle.",
 4: "Une fois autorisé, opérez correctement : fiscalité (revenus imposables, taxes applicables), assurance adaptée au court terme (une police habitation classique ne couvre souvent pas), gestion (accueil, ménage, avis) et respect du voisinage. Un sinistre non couvert peut effacer des années de revenus.",
}, "<p>La location court terme séduit par ses revenus, mais elle est très encadrée et pleine de pièges. Ce guide couvre le cadre provincial, le zonage municipal (souvent décisif), les règles de copropriété, la rentabilité réelle et les bonnes pratiques d'opération.</p><p>Le fil conducteur : vérifier qu'on a le droit d'opérer AVANT de rêver aux revenus.</p>",
   "<h3>Avant de me lancer</h3><ol><li>Vérifier zonage municipal, règles provinciales et, en condo, la déclaration.</li><li>Bâtir un budget réaliste et souscrire une assurance adaptée au court terme.</li></ol>",
   "<li>Enregistrement : inscription et numéro obligatoires pour l'hébergement touristique.</li><li>Zonage : règle municipale déterminant si le court terme est permis à l'adresse.</li><li>Déclaration de copropriété : peut interdire la location court terme en condo.</li><li>Taux d'occupation : proportion de nuitées louées, clé de la rentabilité.</li><li>Assurance court terme : couverture spécifique, distincte de l'habitation classique.</li>")

# ---- Guide 34 : Bâtir un portefeuille ----
TABLE[34] = g({
 0: "Votre équité (valeur nette) croît de deux façons : le remboursement du capital (les loyers paient votre dette) et la prise de valeur des immeubles. Cette équité peut ensuite servir de mise de fonds au prochain immeuble : c'est ainsi qu'un immeuble en finance un autre, progressivement.",
 1: "Chaque nouvel immeuble doit tenir sur ses propres chiffres (cashflow positif, marge de sécurité) : ne comptez pas sur l'appréciation future pour justifier un achat qui perd de l'argent aujourd'hui. Croître sur des bases fragiles, c'est risquer de tout fragiliser au premier imprévu.",
 2: "Gérer une porte n'est pas gérer cinq : à mesure que le portefeuille grandit, structurez la gestion (comptabilité, entretien planifié, peut-être une gestion déléguée). Une gestion qui grandit avec vous évite que la croissance ne devienne ingérable et chronophage.",
 3: "L'immobilier est un jeu de patience : les cycles montent et descendent, mais la détention à long terme lisse les creux et laisse le temps au capital de se rembourser. Gardez le cap au-delà des fluctuations, plutôt que de réagir à chaque manchette.",
 4: "Bâtir un portefeuille, c'est aussi gérer le risque : diversifier (types, secteurs, locataires), garder une réserve de liquidités, surveiller son endettement global et sa capacité à absorber une hausse de taux. Un portefeuille qui traverse les cycles bat presque toujours celui qui vise le rendement maximal à tout prix.",
}, "<p>Passer d'un immeuble à un portefeuille demande une stratégie. Ce guide explique comment l'équité finance la croissance, pourquoi chaque immeuble doit tenir sur ses chiffres, comment faire évoluer sa gestion, et comment diversifier pour maîtriser le risque.</p><p>Le message clé : la croissance immobilière est un marathon — la marge et la patience battent la précipitation.</p>",
   "<h3>Pour croître sainement</h3><ol><li>N'acheter que des immeubles qui tiennent sur leurs propres chiffres.</li><li>Garder une réserve et surveiller mon endettement global.</li></ol>",
   "<li>Équité : valeur nette d'un immeuble (valeur − dette).</li><li>Refinancement : mobiliser l'équité pour financer un nouvel achat.</li><li>Cashflow positif : condition de base de chaque acquisition.</li><li>Diversification : répartir types, secteurs et locataires pour réduire le risque.</li><li>Détention long terme : stratégie qui lisse les cycles du marché.</li>")


DEF_PLAN_TAIL = ""
# ---- Guide 35 : Loi sur le courtage ----
TABLE[35] = g({
 0: "Concrètement, l'OACIQ délivre les permis, impose la formation, surveille les pratiques et traite les plaintes. Vérifier le permis de votre courtier au registre public prend trente secondes et confirme que vous êtes protégé par tout cet encadrement.",
 1: "Ces protections jouent que vous soyez acheteur ou vendeur, et couvrent tout le déroulement de la transaction — des sommes en fidéicommis jusqu'à l'indemnisation en cas de faute. Elles ne dépendent pas de votre habileté à négocier, mais du fait de passer par un courtier titulaire.",
 2: "Les formulaires normalisés (contrat de courtage, promesse d'achat, déclarations) sont conçus pour être équitables et clairs. Prenez le temps de les lire : c'est un droit, et un bon courtier vous les explique clause par clause plutôt que de vous faire signer à la hâte.",
 3: "Le devoir de conseil oblige le courtier à vous informer objectivement, à vérifier avant de diffuser, à divulguer tout conflit d'intérêts et à traiter équitablement les parties. Méfiez-vous d'un courtier qui pousse à décider vite ou minimise un défaut : c'est exactement l'inverse de son rôle.",
 4: "En cas de différend, les recours sont gradués : en parler d'abord au courtier et à son agence, puis l'assistance de l'OACIQ, une plainte au syndic, et l'indemnisation en cas de faute grave. Conservez tous vos documents et échanges écrits : ce sont eux qui font la preuve.",
}, "<p>Au Québec, le courtage immobilier est encadré par la loi et surveillé par l'OACIQ, dont la mission est de protéger le public. Ce guide explique vos droits : le rôle de l'OACIQ, vos protections, les contrats normalisés, les devoirs du courtier et vos recours.</p><p>Le fil conducteur : connaître ce cadre, c'est acheter et vendre en sachant que vous êtes protégé.</p>",
   "<h3>Réflexes utiles</h3><ol><li>Vérifier le permis de mon courtier au registre de l'OACIQ.</li><li>Lire chaque contrat avant de signer et conserver toutes mes copies.</li></ol>",
   "<li>OACIQ : organisme qui encadre le courtage et protège le public.</li><li>Fidéicommis : compte protégé où sont détenues les sommes de dépôt.</li><li>Devoir de conseil : obligation d'informer et de conseiller objectivement.</li><li>Syndic : instance recevant les plaintes déontologiques.</li><li>Fonds d'indemnisation : protection en cas de fraude ou faute grave.</li>")

# ---- Guide 36 : Le rôle du notaire ----
TABLE[36] = g({
 0: "Le notaire n'est pas « votre avocat » : il agit avec impartialité pour donner à la vente sa force officielle et sécuriser toutes les parties. Dans un achat, c'est habituellement l'acheteur qui le choisit, souvent parce qu'il en assume les frais.",
 1: "L'essentiel de son travail se fait avant la signature : examen des titres (le vendeur est-il bien propriétaire, sans charge cachée ?), analyse du certificat de localisation et des servitudes, rédaction des actes, puis réception et redistribution des fonds. Ce travail minutieux vous évite de mauvaises surprises après l'achat.",
 2: "Le jour J, le notaire explique l'acte, recueille les signatures et procède aux versements. Prévoyez ses honoraires et les débours (publication, copies) dans vos frais de clôture. Rappel : la taxe de bienvenue ne se paie pas chez le notaire, mais par facture municipale plus tard.",
 3: "Contactez le notaire dès la promesse acceptée, pas la veille : les bons notaires sont occupés et une signature se planifie. Préparez vos pièces d'identité, coordonnées bancaires et preuve d'assurance en vigueur — un dossier complet accélère tout.",
 4: "Après la signature, le notaire publie la vente au Registre foncier, radie l'ancienne hypothèque et envoie les copies. Conservez précieusement votre acte de vente : il vous servira pour vos taxes, une future revente ou toute question sur la propriété.",
}, "<p>Au Québec, aucune vente d'immeuble ne se conclut sans notaire. Ce professionnel du droit sécurise la transaction, protège les parties et rend la vente officielle. Ce guide explique son rôle, ce qu'il vérifie, le déroulement de la signature et les frais associés.</p><p>Le connaître, c'est aborder la signature l'esprit tranquille.</p>",
   "<h3>Pour une signature sereine</h3><ol><li>Choisir et contacter le notaire dès la promesse acceptée.</li><li>Préparer mes documents, mes fonds et ma preuve d'assurance à l'avance.</li></ol>",
   "<li>Notaire : officier public qui sécurise et authentifie la vente.</li><li>Examen des titres : vérification de la propriété et des charges.</li><li>Débours : frais de publication et copies, en plus des honoraires.</li><li>Registre foncier : registre public où la vente est publiée.</li><li>Radiation : effacement de l'ancienne hypothèque du vendeur.</li>")

# ---- Guide 37 : Hypothèque fixe ou variable ----
TABLE[37] = g({
 0: "Posez-vous une question simple : une hausse de versement vous ferait-elle mal dormir ? Le fixe achète la prévisibilité (au prix d'un taux de départ souvent un peu plus élevé) ; le variable parie sur le marché (économie possible, mais risque de hausse). Aucun n'est « meilleur » dans l'absolu.",
 1: "Ne confondez pas amortissement (durée totale du remboursement, souvent 25 ans) et terme (durée du contrat actuel, souvent 5 ans). À chaque fin de terme, vous renégociez : c'est un moment clé pour magasiner. Ne subissez pas votre renouvellement — faites jouer la concurrence deux à trois mois avant l'échéance.",
 2: "Le taux affiché n'est que la partie visible : pénalités de remboursement anticipé (parfois très élevées si votre vie change), remboursements accélérés, portabilité, prêt ouvert vs fermé. Avant de signer pour un taux « imbattable », demandez comment se calcule la pénalité.",
 3: "Deux voies pour financer : votre institution (simple si vous y êtes client, mais une seule gamme) ou un courtier hypothécaire (compare plusieurs prêteurs, souvent sans frais pour vous). Dans les deux cas, comparez le taux ET les conditions, et obtenez une préapprobation pour magasiner l'esprit tranquille.",
 4: "Le « bon » prêt dépend moins des manchettes que de VOTRE réalité : stabilité d'emploi, horizon de détention, coussin financier, projets de vie. Il n'y a aucune honte à choisir le fixe même quand « tout le monde » vante le variable : le meilleur prêt est celui qui vous laisse dormir tranquille.",
}, "<p>L'hypothèque est la plus grande dette de la plupart des ménages. Ce guide clarifie l'arbitrage fixe vs variable, la différence entre terme et amortissement, les clauses qui comptent, et comment adapter le prêt à votre vie.</p><p>Note (édition 2026) : les taux évoluent constamment ; validez toujours avec un courtier hypothécaire.</p>",
   "<h3>Pour bien choisir</h3><ol><li>Évaluer ma tolérance au risque et rencontrer un courtier hypothécaire.</li><li>Comparer taux ET conditions (pénalités, portabilité) et remagasiner à chaque renouvellement.</li></ol>",
   "<li>Taux fixe : inchangé durant le terme, prévisible.</li><li>Taux variable : suit le marché, potentiel d'économie et de risque.</li><li>Amortissement : durée totale de remboursement (souvent 25 ans).</li><li>Terme : durée du contrat actuel (souvent 5 ans).</li><li>Pénalité de remboursement : coût pour rompre ou rembourser avant l'échéance.</li>")

# ---- Guide 38 : Assurance habitation et titres ----
TABLE[38] = g({
 0: "L'assurance habitation couvre la propriété et vos biens (incendie, dégât d'eau, vol) et inclut une responsabilité civile. Elle doit être active dès la prise de possession — les prêteurs l'exigent. Vérifiez protections, exclusions et franchises, et signalez tout élément qui complique l'assurabilité (réservoir d'huile, toiture âgée, secteur inondable).",
 1: "L'assurance titres, elle, protège contre des problèmes juridiques du titre : vice de titre, empiètement, non-conformité, fraude. C'est une protection ponctuelle (prime unique), souvent proposée par le notaire, qui peut parfois compléter un certificat de localisation selon les cas.",
 2: "Les deux ne se remplacent pas : l'habitation couvre les sinistres (obligatoire pour le prêteur), les titres couvrent le juridique (optionnelle mais utile). L'objectif : qu'aucun risque important ne reste sans couverture. Réévaluez vos protections après des rénovations majeures.",
 3: "Les primes varient beaucoup pour une couverture semblable : comparez plusieurs soumissions, ajustez la franchise, profitez des rabais (regroupement, alarme) et déclarez honnêtement les risques (une omission peut annuler la couverture). La moins chère n'est utile que si elle couvre ce dont vous avez besoin.",
 4: "Après un sinistre : sécurisez les lieux, documentez (photos, vidéos, liste), avisez vite l'assureur et conservez les reçus. Un inventaire à jour de vos biens accélère grandement le règlement — filmez une fois par an le tour de votre logement, tiroirs ouverts, avant d'en avoir besoin.",
}, "<p>Deux assurances protègent votre achat sous des angles différents : l'habitation (contre les sinistres) et les titres (contre les problèmes juridiques). Ce guide explique les deux, comment bien magasiner et comment réagir après un sinistre.</p><p>Les comprendre, c'est éviter des trous de protection coûteux.</p>",
   "<h3>À faire</h3><ol><li>Obtenir une soumission d'assurance habitation dès la promesse acceptée.</li><li>Discuter de l'assurance titres avec le notaire et vérifier qu'aucun risque n'est laissé sans couverture.</li></ol>",
   "<li>Assurance habitation : couvre sinistres et responsabilité, exigée par le prêteur.</li><li>Assurance titres : couvre les problèmes juridiques liés à la propriété.</li><li>Franchise : montant à votre charge en cas de réclamation.</li><li>Assurabilité : facilité à assurer selon l'état et les risques.</li><li>Responsabilité civile : protection en cas de dommages causés à autrui.</li>")

# ---- Guide 39 : Le marché du Grand Montréal ----
TABLE[39] = g({
 0: "L'indice le plus parlant est le nombre de mois d'inventaire : bas, il signale un marché de vendeurs (ventes rapides, surenchères) ; élevé, un marché d'acheteurs (choix, négociation). Ne vous fiez pas aux manchettes nationales : un quartier peut favoriser les vendeurs pendant qu'un autre favorise les acheteurs.",
 1: "Aucun facteur isolé ne dit tout : taux d'intérêt (le levier n°1 sur la demande), économie et emploi, offre (mises en chantier, réglementation), démographie et attrait des secteurs. C'est leur combinaison qui façonne le marché. Quand les taux montent, la pression sur les prix se relâche souvent.",
 2: "Pour vous situer, quelques indicateurs publics valent mieux que des impressions : mois d'inventaire, délai de vente moyen, rapport prix vendu/demandé (au-dessus de 100 % = surenchères), prix médian par type et secteur. Suivis dans le temps, ils racontent la tendance mieux qu'une vente spectaculaire.",
 3: "Personne ne « time » parfaitement le marché — ni les experts, ni les banques. Pour la plupart des ménages, la bonne décision dépend surtout de leur situation (besoin, stabilité, capacité) et de leur horizon. La patience et la détention longue lissent les cycles.",
 4: "Le « marché de Montréal » n'existe pas vraiment : c'est une mosaïque de marchés locaux (type de propriété, secteur, segment de prix) aux dynamiques distinctes. Comparer votre projet aux bonnes données locales — les comparables récents de VOTRE secteur — évite les fausses conclusions.",
}, "<p>Le marché bouge par cycles : périodes favorables aux vendeurs, aux acheteurs, et transitions. Ce guide explique comment reconnaître le type de marché, les facteurs qui le font bouger, les indicateurs à suivre et comment agir sans tenter de deviner le sommet.</p><p>Le message : décider avec discernement, selon sa situation, plutôt que de suivre l'émotion collective.</p>",
   "<h3>Pour lire le marché</h3><ol><li>Identifier le type de marché de mon secteur (inventaire, délais, rapport prix).</li><li>Décider selon mes besoins et mon horizon, avec des comparables locaux récents.</li></ol>",
   "<li>Marché de vendeurs : demande > offre, ventes rapides.</li><li>Marché d'acheteurs : offre > demande, négociation à la baisse.</li><li>Mois d'inventaire : temps estimé pour écouler les propriétés à vendre.</li><li>Rapport prix vendu/demandé : au-dessus de 100 % = surenchères.</li><li>Comparables : ventes récentes semblables de votre secteur.</li>")

# ---- Guide 41 : Évaluation municipale vs valeur marchande ----
TABLE[41] = g({
 0: "L'évaluation municipale figure au rôle d'évaluation et sert à répartir les taxes. Établie en masse, à une date de référence, avec décalage, elle peut être supérieure ou inférieure au marché. « La ville l'évalue à tant, donc ça vaut tant » est le malentendu numéro un.",
 1: "La valeur marchande est le prix qu'un acheteur informé paie aujourd'hui, déterminé par une analyse comparative (ventes récentes semblables) — pas par le rôle. C'est ce chiffre, et lui seul, qui doit guider un prix de vente ou une offre d'achat.",
 2: "La municipalité applique un facteur comparatif pour rapprocher le rôle du marché (notamment pour la taxe de bienvenue), ce qui montre bien que l'évaluation seule n'est pas la valeur du marché. À chaque chiffre son usage : évaluation pour les taxes, valeur marchande pour fixer un prix.",
 3: "Si votre évaluation vous paraît nettement trop élevée par rapport au marché, vous pouvez la contester dans un délai précis suivant le dépôt d'un nouveau rôle : comparez avec des propriétés semblables, rassemblez des preuves et déposez une demande de révision. Une évaluation trop haute gonfle vos taxes des années durant.",
 4: "Gardez ce réflexe : je vends ou j'offre → valeur marchande ; je vérifie mes taxes → évaluation municipale ; j'estime ma taxe de bienvenue → le plus élevé du prix payé ou de l'évaluation ajustée. Les deux chiffres sont utiles ; c'est les mélanger qui mène aux erreurs de prix.",
}, "<p>« Ma maison est évaluée à tant à la ville » : cette phrase mène à bien des malentendus. Ce guide clarifie la différence entre évaluation municipale (outil fiscal) et valeur marchande (prix du marché), explique le facteur comparatif et comment contester une évaluation.</p><p>Le message clé : le bon chiffre au bon moment.</p>",
   "<h3>Bons réflexes</h3><ol><li>Utiliser la valeur marchande (analyse comparative) pour toute décision de prix.</li><li>Vérifier le délai de contestation si mon évaluation dépasse clairement le marché.</li></ol>",
   "<li>Rôle d'évaluation : registre municipal des valeurs, base des taxes.</li><li>Évaluation municipale : valeur fiscale, distincte du prix de vente.</li><li>Valeur marchande : prix qu'un acheteur informé paie aujourd'hui.</li><li>Facteur comparatif : coefficient rapprochant l'évaluation du marché.</li><li>Demande de révision : recours pour contester une évaluation.</li>")

# ---- Guide 42 : Copropriété divise ou indivise ----
TABLE[42] = g({
 0: "En copropriété divise (le condo classique), chaque unité a son propre titre distinct et son numéro de lot, avec un syndicat, une déclaration et un fonds de prévoyance. Vous la financez avec votre propre hypothèque : c'est plus simple à financer et à revendre.",
 1: "En copropriété indivise, plusieurs personnes possèdent ensemble UN seul immeuble, sans lots distincts : chacun détient une quote-part selon une convention d'indivision. Prix d'entrée parfois plus bas, mais financement plus complexe (parfois une hypothèque commune) et forte interdépendance entre copropriétaires.",
 2: "À prix comparable, la divise offre plus de tranquillité et se revend plus facilement ; l'indivise peut être intéressante mais entrez-y les yeux ouverts, pas seulement pour économiser. Dans les deux cas, vérifiez documents, finances et règles avant d'acheter.",
 3: "La santé financière vous concerne directement : charges mensuelles, fonds de prévoyance (réserve pour toiture, façade, ascenseur), étude du fonds. Des charges anormalement basses ne sont pas une aubaine : elles cachent souvent un fonds insuffisant, donc des cotisations spéciales à venir.",
 4: "Avant de signer, faites votre inspection documentaire : lisez la déclaration (divise) ou la convention (indivise), les procès-verbaux, le budget, l'état du fonds et les règlements (animaux, location, rénovations). Faites examiner ces documents par votre notaire — c'est le meilleur rempart contre les surprises.",
}, "<p>Au Québec, « copropriété » recouvre deux réalités distinctes : la divise (le condo classique) et l'indivise. Elles se ressemblent mais diffèrent profondément — juridiquement, financièrement, à la revente. Ce guide les compare pour un choix éclairé.</p><p>La différence a des conséquences réelles : ce guide vous donne la grille pour choisir.</p>",
   "<h3>Avant d'acheter</h3><ol><li>Confirmer le type de copropriété et rassembler déclaration/convention, finances et PV.</li><li>Faire examiner les documents par un notaire avant de lever mes conditions.</li></ol>",
   "<li>Copropriété divise : condo classique, titre distinct par unité.</li><li>Copropriété indivise : quote-part d'un seul immeuble, sans lots séparés.</li><li>Convention d'indivision : entente réglant droits et obligations en indivise.</li><li>Fonds de prévoyance : réserve collective pour les grosses réparations.</li><li>Cotisation spéciale : contribution ponctuelle quand le fonds ne suffit pas.</li>")

# ---- Guide 43 : Acheter à deux ----
TABLE[43] = g({
 0: "Au Québec, mariés et unis civilement bénéficient des protections du patrimoine familial ; les conjoints de fait, non — leurs droits dépendent surtout de l'écrit (titre, convention, testament). Beaucoup l'ignorent et le découvrent au pire moment : pour un couple non marié, tout se joue dans les documents.",
 1: "La façon d'inscrire la propriété au titre est structurante : en indivision, à parts égales ou selon l'apport de chacun. Si un seul conjoint est au titre, l'autre peut se retrouver sans droit — même après des années de paiements. Si vous payez la moitié, assurez-vous d'être au titre.",
 2: "Une convention (d'indivision ou de vie commune) précise à l'avance ce qui, autrement, se réglerait devant les tribunaux : répartition des parts, qui paie quoi, et ce qui arrive en cas de séparation ou de décès. Rédigez-la quand tout va bien, pas en pleine rupture.",
 3: "Pensez aussi au décès : sans testament, un conjoint de fait n'hérite pas automatiquement. Une assurance vie peut permettre au survivant de racheter la part ou de rembourser l'hypothèque, évitant une vente en catastrophe. Coordonnez convention, testament et assurance.",
 4: "Pour un achat à deux bien ficelé : clarifier votre statut, décider de la répartition, faire rédiger une convention par un notaire, mettre à jour vos testaments, et inscrire la propriété au titre conformément à l'entente. Ce n'est pas un manque de confiance, c'est du respect mutuel.",
}, "<p>Acheter en couple est une belle étape — et une décision juridique importante, surtout pour les conjoints de fait, dont les droits diffèrent de ceux des couples mariés. Ce guide couvre les façons de détenir à deux, l'importance d'une convention et les protections à prévoir.</p><p>Contenu informatif, non un avis juridique : consultez un notaire.</p>",
   "<h3>Pour bien structurer</h3><ol><li>Clarifier notre statut et décider de la répartition des parts.</li><li>Faire rédiger une convention et mettre nos testaments à jour.</li></ol>",
   "<li>Patrimoine familial : protections des couples mariés/unis civilement.</li><li>Conjoints de fait : sans protections automatiques ; l'écrit prime.</li><li>Indivision : détention à plusieurs, à parts égales ou selon l'apport.</li><li>Convention d'indivision : entente réglant parts, paiements et sorties.</li><li>Titre de propriété : doit refléter l'entente réelle du couple.</li>")

# ---- Guide 44 : Premier achat pour nouveaux arrivants ----
TABLE[44] = g({
 0: "Les prêteurs regardent votre crédit canadien, vos revenus et votre stabilité. Un historique local prend du temps à bâtir : ouvrez une carte dès votre arrivée et payez-la intégralement chaque mois. Certains programmes pour nouveaux arrivants offrent des conditions adaptées, via un courtier hypothécaire.",
 1: "Le système québécois a ses particularités : notaire obligatoire, courtier encadré par l'OACIQ, taxe de bienvenue, copropriété divise/indivise, baux si plex, et un bâti propre au climat (sols argileux, drain français, hiver). Apprendre le vocabulaire local, c'est déjà éviter la moitié des erreurs.",
 2: "Comme tout premier acheteur, posez les fondations : budget réaliste, préapprobation, critères et secteurs. En prime, entourez-vous de professionnels habitués à accompagner les nouveaux arrivants — une bonne courtière vous expliquera non seulement les maisons, mais tout le système autour.",
 3: "La mise de fonds minimale dépend du prix ; sous 20 %, une assurance prêt s'ajoute. Épargnez tôt, vérifiez votre admissibilité aux programmes d'aide, et sachez qu'un don familial est accepté avec une lettre de don. Un courtier hypothécaire vous aide à assembler le tout avantageusement.",
 4: "Le parcours suit une logique claire : visiter selon vos critères, faire une promesse d'achat avec les bonnes conditions (financement, inspection), lever les conditions après inspection, puis signer chez le notaire. À chaque étape, posez vos questions : personne n'attend d'un nouvel arrivant qu'il sache déjà tout.",
}, "<p>Acheter une première propriété au Québec en tant que nouvel arrivant comporte des défis particuliers : bâtir un crédit local, comprendre un système différent, apprendre un vocabulaire propre. Bien accompagné, c'est tout à fait accessible. Ce guide donne les repères clés.</p><p>Contenu informatif : validez votre situation avec les professionnels concernés.</p>",
   "<h3>Pour me préparer</h3><ol><li>Bâtir mon crédit canadien et rassembler mes preuves de revenus.</li><li>Rencontrer un courtier hypothécaire (programmes nouveaux arrivants) et obtenir une préapprobation.</li></ol>",
   "<li>Crédit canadien : historique local, clé du financement.</li><li>Programmes nouveaux arrivants : conditions de prêt adaptées, via un courtier.</li><li>OACIQ : organisme encadrant les courtiers immobiliers.</li><li>Taxe de bienvenue : droits de mutation municipaux.</li><li>Préapprobation : montant et taux confirmés avant de magasiner.</li>")

# ---- Guide 45 : Acheter et vendre en même temps ----
TABLE[45] = g({
 0: "Tout se joue sur l'ordre : vendre d'abord (budget exact connu, sans pression, mais risque de se reloger) ou acheter d'abord (prochaine maison sécurisée, mais risque de payer deux propriétés). La condition de vente (offrir conditionnellement à la vente de sa propriété) réduit ce risque.",
 1: "Si les dates ne coïncident pas, des outils comblent l'écart : le prêt-relais (financement temporaire jusqu'à l'encaissement de la vente), une marge de crédit, ou des dates de possession négociées. Parlez du prêt-relais à votre courtier hypothécaire AVANT de faire une offre.",
 2: "L'idéal est d'aligner les dates de possession pour un déménagement fluide ; à défaut, prévoyez entreposage, hébergement de transition et une marge dans le calendrier. Une courtière qui gère les deux transactions peut synchroniser les échéances et anticiper les frictions.",
 3: "Le pire scénario, c'est deux propriétés sur les bras. Garde-fous : bien prix votre propriété actuelle pour qu'elle se vende vite, utiliser une condition de vente, négocier des dates flexibles et garder un coussin. Ne surévaluez pas « au cas où » : c'est ce qui fait traîner les ventes.",
 4: "Un enchaînement réussi suit une trame : déterminer la séquence selon mon risque, valider le financement et le prêt-relais, mettre en marché ou magasiner en parallèle, coordonner les dates, puis synchroniser les deux clôtures. Écrivez votre plan sur une page avec les dates clés.",
}, "<p>Vendre sa propriété et en acheter une autre en même temps est un exercice d'équilibriste : finances, logistique et timing s'entremêlent. Ce guide couvre le choix de la séquence, les outils pour combler l'écart, la coordination des dates et comment éviter la double détention.</p><p>Bien planifié, l'exercice devient une simple suite d'étapes maîtrisées.</p>",
   "<h3>Mon plan de match</h3><ol><li>Déterminer ma séquence et explorer le prêt-relais avant d'offrir.</li><li>Coordonner les dates de possession et garder un coussin de sécurité.</li></ol>",
   "<li>Condition de vente : offrir conditionnellement à la vente de sa propriété.</li><li>Prêt-relais : financement temporaire couvrant l'écart achat/vente.</li><li>Date de possession : date de prise de possession, à coordonner.</li><li>Double détention : période où l'on détient deux propriétés, à minimiser.</li><li>Séquence : vendre d'abord ou acheter d'abord, selon le risque.</li>")

# ---- Guide 46 : La retraite et l'immobilier ----
TABLE[46] = g({
 0: "Vendre une grande maison pour une plus petite (condo, maison réduite) allège l'entretien, les taxes et l'énergie, libère des liquidités et simplifie la vie. C'est souvent un choix de qualité de vie autant que financier ; pesez les coûts de transaction et l'attachement à la maison.",
 1: "Votre propriété peut devenir un levier de revenus : downsizing + placement de la différence, immeuble à revenus (avec la gestion que cela implique), ou solutions de mise en valeur de l'équité (à examiner avec prudence). Chaque option a des implications fiscales et de risque : visez un revenu durable, pas un pari.",
 2: "Votre propriété fait partie du patrimoine à transmettre : réfléchir tôt à la transmission (testament, fiscalité de la succession, équité entre héritiers) évite des complications à vos proches. Parlez-en de votre vivant : une maison à partager entre plusieurs enfants est une source classique de conflits.",
 3: "Rester chez soi peut être un excellent choix, à condition d'adapter la propriété : réduire les obstacles (marches, seuils, baignoire), améliorer éclairage et sécurité, prévoir l'entretien délégué. Ces aménagements coûtent peu et changent tout pour vieillir chez soi en sécurité.",
 4: "Il n'y a pas de solution unique : la bonne stratégie correspond à VOTRE situation. Commencez par « comment je veux vivre ma retraite ? », puis faites suivre l'immobilier. Estimez votre valeur nette, comparez les options et coordonnez avec votre plan financier et successoral.",
}, "<p>À l'approche ou pendant la retraite, votre propriété devient souvent votre principal actif — et un levier de qualité de vie. Ce guide explore le downsizing, les façons de générer des revenus, la transmission et l'adaptation du logement pour vieillir chez soi.</p><p>Contenu informatif, non un avis financier : consultez les professionnels concernés.</p>",
   "<h3>Pour ma stratégie</h3><ol><li>Clarifier mes besoins de retraite et estimer la valeur nette de ma propriété.</li><li>Comparer downsizing, revenus et maintien à domicile avec un conseiller.</li></ol>",
   "<li>Downsizing : passage à une propriété plus petite, moins coûteuse.</li><li>Équité : valeur nette de la propriété, mobilisable avec prudence.</li><li>Planification successorale : intégration de l'immobilier au testament.</li><li>Maintien à domicile : adapter le logement pour vieillir chez soi.</li><li>Conseiller indépendant : professionnel neutre pour évaluer les options.</li>")

# ---- Guide 47 : Aider son enfant à acheter ----
TABLE[47] = g({
 0: "Le don pour la mise de fonds est courant et accepté des prêteurs, avec une lettre de don confirmant qu'il n'est pas remboursable. Simple, mais l'argent donné n'est plus le vôtre : considérez l'équité entre vos enfants et l'impact sur vos finances. Ne videz jamais votre coussin de retraite pour aider.",
 1: "Vous pouvez prêter plutôt que donner : mettez alors les modalités par écrit (montant, remboursement, intérêt éventuel). Attention, un prêt à rembourser peut réduire la capacité d'emprunt de l'enfant et doit être divulgué au prêteur. Un prêt familial mal documenté est une source classique de malentendus.",
 2: "En cosignant l'hypothèque, vous aidez l'enfant à se qualifier grâce à vos revenus et votre crédit — mais vous devenez responsable de la dette. S'il ne paie pas, le prêteur se tourne vers vous, et cela affecte votre propre capacité d'emprunt. Ne cosignez que si vous pouvez réellement l'assumer.",
 3: "Aider mérite d'être structuré pour protéger tout le monde : documentez systématiquement (lettre de don ou contrat de prêt), consultez un notaire et un comptable, et prévoyez le cas où le couple de l'enfant se sépare (surtout s'il achète à deux). Une convention peut protéger la somme donnée.",
 4: "Don, prêt, cosignature : chaque formule a sa logique. Pour choisir, clarifiez la forme envisagée et votre capacité réelle, évaluez l'impact sur vos finances, documentez, et consultez avant de vous engager. La bonne aide fait avancer l'enfant sans vous mettre en péril.",
}, "<p>De plus en plus de parents aident leur enfant à accéder à la propriété. Ce beau geste mérite d'être structuré. Ce guide compare les façons d'aider — don, prêt familial, cosignature — leurs avantages, leurs risques, et comment se protéger.</p><p>Contenu informatif, non un avis juridique ou fiscal : consultez un notaire et un comptable.</p>",
   "<h3>Avant d'aider</h3><ol><li>Clarifier la forme d'aide et évaluer l'impact sur mes propres finances.</li><li>Documenter (lettre de don ou contrat) et consulter notaire/comptable.</li></ol>",
   "<li>Lettre de don : document confirmant qu'un don n'est pas remboursable.</li><li>Prêt familial : aide remboursable, à documenter par écrit.</li><li>Cosignature : engagement légal du parent sur l'hypothèque de l'enfant.</li><li>Capacité d'emprunt : influencée par un prêt ou une cosignature.</li><li>Équité entre enfants : à considérer quand on aide un seul enfant.</li>")

# ---- Guide 50 : Acheter un chalet ----
TABLE[50] = g({
 0: "Une résidence secondaire ne se finance pas comme une résidence principale : la mise de fonds est souvent plus élevée et les conditions différentes, surtout pour un chalet 4 saisons vs 3 saisons, ou selon l'accès (route entretenue à l'année ?). Validez le financement AVANT de tomber amoureux d'un chalet.",
 1: "Le rural impose des vérifications qui n'existent pas en ville : eau (puits — débit, potabilité, analyses), égout (fosse septique et champ d'épuration, âge et conformité), accès et déneigement, électricité, et parfois servitudes de passage. Ces éléments coûtent cher à régler : inspectez-les sérieusement.",
 2: "En bord de lac ou en zone protégée, la réglementation est stricte : bandes riveraines, milieux humides, permis pour construire, rénover ou couper des arbres. Ce qui semble anodin peut être interdit. Renseignez-vous auprès de la municipalité et de la MRC avant d'acheter et de planifier des travaux.",
 3: "Un chalet, c'est une deuxième propriété à entretenir, souvent à distance : ouverture/fermeture saisonnière, surveillance, chauffage hors gel, assurances spécifiques, temps de trajet. Beaucoup de chalets sont utilisés moins souvent que prévu : évaluez honnêtement la charge réelle vs l'usage.",
 4: "Clarifiez le projet derrière l'achat : usage familial (emplacement, confort, distance), revenus de location (zonage, demande, règles du court terme), ou les deux (à équilibrer). Un chalet acheté « pour la famille » puis loué sans vérifier les règles peut vite tourner au casse-tête.",
}, "<p>Le chalet fait rêver, mais une résidence secondaire répond à des règles bien différentes de la résidence principale : financement, vérifications rurales, zonage riverain, entretien. Ce guide couvre tout, pour acheter les yeux ouverts.</p><p>L'idée : valider le financement, les vérifications et l'usage réel avant de se laisser séduire par la vue.</p>",
   "<h3>Avant d'acheter</h3><ol><li>Valider le financement d'une résidence secondaire et l'accès à l'année.</li><li>Vérifier eau, égout, zonage riverain et clarifier l'usage prévu.</li></ol>",
   "<li>Résidence secondaire : propriété de villégiature, au financement différent.</li><li>Fosse septique : système d'égout autonome, à vérifier (âge, conformité).</li><li>Bande riveraine : zone protégée en bord de lac, aux règles strictes.</li><li>Chalet 4 saisons : habitable toute l'année, vs 3 saisons.</li><li>Servitude de passage : droit d'accès traversant un autre terrain.</li>")


if __name__ == '__main__':
    nums = [int(a) for a in sys.argv[1:]] or list(TABLE.keys())
    for n in nums:
        if n in TABLE:
            apply(n, *TABLE[n])
