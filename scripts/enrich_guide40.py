#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichit le guide #40 (exemple de rendu « page pleine »)."""
import os, json

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(SITE, 'src', 'data', 'reader', '40.json')


def tip(t):
    return (f'<aside class="tip"><span class="tip__label">Le conseil d\'Emilie</span><p>{t}</p></aside>')


def chap(title, obj, body):
    return {"title": title, "objective": obj, "html": f'<p class="lede">{obj}</p>\n{body}'}


d = json.load(open(P, encoding='utf-8'))

d['chapters'][0] = {
    "title": "Introduction", "objective": "",
    "html": "<p>« Il ne faut pas vendre en hiver. » Vraiment ? Au Québec, l'hiver a ses particularités — neige, froid, jours courts — mais il offre aussi de réelles occasions, à l'achat comme à la vente. Ce guide sépare les mythes de la réalité, saison par saison.</p>"
            "<p>Vous verrez pourquoi les acheteurs d'hiver sont souvent les plus sérieux, comment présenter une propriété quand tout est blanc, quels avantages l'hiver donne à l'acheteur, et comment gérer les aspects pratiques propres au climat québécois (déneigement, inspection sous la neige, déménagement par -20 °C).</p>"
            "<p>Chaque chapitre se termine par un conseil concret. À la fin, un plan d'action, un lexique et un quiz pour ancrer l'essentiel.</p>",
}

d['chapters'][1] = chap(
    "Le mythe de la « mauvaise saison »", "Nuancer une idée reçue tenace.",
    "<p>Il y a généralement moins de propriétés à vendre et moins d'acheteurs en hiver. Mais « moins nombreux » ne veut pas dire « mauvais » : c'est même souvent l'inverse pour qui sait lire le marché.</p>"
    "<p>Les acheteurs qui visitent en janvier par -15 °C ne sont pas des touristes du dimanche : ils ont un besoin réel (mutation, séparation, agrandissement de la famille, fin de bail) et un échéancier serré. En face, moins de vendeurs affichent, donc votre propriété subit <strong>moins de concurrence directe</strong> qu'au plus fort du printemps.</p>"
    "<p>Ce que change vraiment la saison :</p>"
    "<ul><li><strong>Volume</strong> : moins d'inscriptions et moins d'acheteurs actifs.</li><li><strong>Motivation</strong> : les acheteurs présents sont plus décidés.</li><li><strong>Concurrence</strong> : moins de propriétés comparables affichées en même temps que la vôtre.</li><li><strong>Délais</strong> : parfois un peu plus longs, mais avec des offres plus fermes.</li></ul>"
    "<p>Résultat : une bonne propriété, bien préparée et surtout <strong>bien prix</strong>, peut très bien se vendre en hiver — parfois plus vite qu'un bien surévalué noyé dans l'offre printanière.</p>"
    + tip("Ne reportez pas une vente juste « parce que c'est l'hiver ». Un acheteur qui se déplace en pleine tempête est un acheteur motivé. Moins de visiteurs, mais un bien meilleur taux de sérieux : c'est souvent un compromis gagnant pour le vendeur."))

d['chapters'][2] = chap(
    "Vendre en hiver : bien se présenter", "Compenser les défis de la saison, point par point.",
    "<p>L'hiver impose quelques ajustements de présentation, tous faciles à maîtriser une fois qu'on y pense. L'objectif : que l'acheteur oublie le froid dès qu'il franchit la porte.</p>"
    "<p><strong>À l'extérieur</strong>, la première impression se joue avant même l'entrée :</p>"
    "<ul><li>Déneiger et déglacer l'entrée, les marches et le trottoir avant chaque visite — c'est une question d'accueil <em>et</em> de sécurité (responsabilité).</li><li>Dégager la plaque d'adresse, le perron et l'accès au cabanon ou au garage.</li><li>Prévoir un tapis absorbant et un espace pour les bottes à l'entrée.</li></ul>"
    "<p><strong>À l'intérieur</strong>, on vend le confort et la chaleur :</p>"
    "<ul><li>Maximiser la lumière (jours courts) : rideaux ouverts, toutes les lampes allumées, ampoules à lumière chaude.</li><li>Chauffer à une température accueillante pendant les visites.</li><li>Mettre en valeur l'efficacité énergétique : fenêtres récentes, isolation, thermopompe, foyer.</li></ul>"
    "<p>Enfin, compensez l'absence de verdure : ajoutez au dossier quelques <strong>photos estivales</strong> du terrain, de la cour et de l'aménagement paysager, pour que l'acheteur voie le plein potentiel de la propriété.</p>"
    + tip("En hiver, vendez une sensation : une maison chaude, lumineuse et facile d'accès malgré la neige. Et montrez toujours à quoi ressemble le terrain l'été — c'est ce que l'acheteur n'arrive pas à imaginer sous 40 cm de neige."))

d['chapters'][3] = chap(
    "Acheter en hiver : des occasions", "Profiter des avantages, côté acheteur.",
    "<p>Pour l'acheteur, l'hiver est souvent la meilleure saison — à condition de savoir regarder. Deux avantages se combinent : moins de concurrence et une inspection « en conditions extrêmes ».</p>"
    "<p><strong>Moins de concurrence, plus de pouvoir.</strong> Avec peu d'acheteurs actifs, les surenchères sont plus rares et les vendeurs présents sont souvent pressés (déménagement déjà planifié, propriété déjà inoccupée, double hypothèque à éviter). Votre marge de négociation s'en trouve élargie.</p>"
    "<p><strong>La maison se montre sous son vrai jour.</strong> Le froid révèle ce que l'été cache. Profitez de la visite pour observer :</p>"
    "<ul><li>Courants d'air aux fenêtres et aux portes, sensation de « paroi froide ».</li><li>Efficacité et bruit du chauffage ; demandez les <strong>coûts réels</strong> des 12 derniers mois.</li><li>Présence de glace au sol, de barrages de glace sur la toiture ou de glaçons abondants (signe d'isolation ou de ventilation d'entretoit déficiente).</li><li>Qualité du déneigement et de l'accès ; comportement de l'entrée en pente.</li></ul>"
    "<p>Vous testez ainsi la propriété dans ses conditions les plus exigeantes — un avantage d'inspection que l'acheteur d'été n'aura jamais.</p>"
    + tip("Acheter en hiver, c'est voir la maison sous son pire jour : courants d'air, glace, vraie facture de chauffage. Ce que vous constatez en janvier ne vous surprendra pas l'hiver suivant — et ça vous donne des arguments concrets pour négocier."))

d['chapters'][4] = chap(
    "Chaque saison a sa logique", "Choisir le moment selon vos priorités, pas selon les préjugés.",
    "<p>Plutôt que « bonne » ou « mauvaise » saison, raisonnez en compromis. Chaque période a ses forces et ses faiblesses, pour l'acheteur comme pour le vendeur.</p>"
    "<ul><li><strong>Printemps</strong> : le marché le plus actif. Beaucoup de choix et d'acheteurs, terrains dégagés — mais forte concurrence et surenchères fréquentes.</li><li><strong>Été</strong> : marché soutenu, extérieurs et piscines à leur avantage ; ralentissement pendant les vacances de la construction.</li><li><strong>Automne</strong> : acheteurs sérieux qui veulent s'installer avant l'hiver ; fenêtre courte avant le ralentissement.</li><li><strong>Hiver</strong> : moins de volume, mais concurrence réduite et acheteurs très motivés.</li></ul>"
    "<p>Le « meilleur » moment dépend donc de votre objectif : <strong>maximiser le nombre d'acheteurs</strong> (printemps), <strong>réduire la concurrence</strong> (hiver), ou simplement <strong>suivre votre calendrier de vie</strong> (mutation, naissance, retraite). Un vendeur qui veut peu de concurrence et un acheteur qui veut négocier peuvent très bien, tous les deux, trouver leur compte en janvier.</p>"
    "<p>Dans tous les cas, le prix et la préparation pèsent bien plus lourd que la saison. Un bien juste prix et impeccable se vend en toute saison ; un bien surévalué traîne même au printemps.</p>"
    + tip("Ne laissez pas le calendrier décider à votre place. La vraie question n'est pas « est-ce la bonne saison ? » mais « est-ce le bon moment pour moi, et mon prix est-il juste ? ». Ces deux réponses-là comptent bien plus que la météo."))

d['chapters'][5] = chap(
    "Aspects pratiques de l'hiver québécois", "Anticiper la logistique propre au climat.",
    "<p>Au Québec, l'hiver ajoute des réalités concrètes à la transaction. Bien anticipées, elles deviennent de la simple organisation plutôt que des mauvaises surprises.</p>"
    "<p><strong>Inspection.</strong> La neige peut masquer la toiture, la pente du terrain, le drainage, la fissure d'une dalle ou l'état du revêtement. Demandez au vendeur des photos d'été, notez ces points à l'inspection et, au besoin, prévoyez une vérification complémentaire au dégel.</p>"
    "<p><strong>Déménagement.</strong> Routes glacées, journées courtes et températures négatives compliquent la logistique :</p>"
    "<ul><li>Réservez tôt : les bons déménageurs se raréfient et le 1er juillet n'est pas la seule date possible.</li><li>Protégez planchers et meubles de la calcium et de l'humidité (tapis, cartons renforcés).</li><li>Gardez une marge dans l'horaire en cas de tempête.</li></ul>"
    "<p><strong>Prise de possession.</strong> Dès la remise des clés, vérifiez que le chauffage fonctionne, que l'eau n'a pas été coupée (risque de gel des tuyaux dans un logement vacant) et que l'accès est déneigé. Assurez-vous enfin que votre <strong>assurance habitation est en vigueur</strong> avant le grand froid, y compris pour une propriété temporairement inoccupée.</p>"
    + tip("On n'achète pas ce qu'on ne peut pas voir. Si la neige cache le toit et le terrain, exigez des photos d'été et faites-le inscrire à l'inspection. Et pour tout logement laissé vide en hiver : chauffage maintenu et eau surveillée, sinon un tuyau gelé peut coûter une fortune."))

json.dump(d, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
core = d['chapters'][1:-2]
print('guide 40 enrichi. Chapitres de fond (car.):', [len(c['html']) for c in core])
