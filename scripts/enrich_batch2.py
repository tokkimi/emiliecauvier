#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichissement lot 2 : guides #38-40 (standard uniforme, 5 chapitres + 10 QCM)."""
import os, json

BASE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(BASE)
DIR = os.path.join(SITE, 'src', 'data', 'reader')


def tip(text):
    return (f'<aside class="tip"><span class="tip__label">Le conseil d\'Emilie</span>'
            f'<p>{text}</p></aside>')


def chap(title, objective, body):
    return {"title": title, "objective": objective,
            "html": f'<p class="lede">{objective}</p>\n{body}'}


DATA = {}

# ===== 38 — Assurance habitation et assurance titres =====
DATA[38] = {
    "chapters": [
        chap("L'assurance habitation", "Protéger le bâtiment et vos biens.",
             "<p>L'assurance habitation couvre votre propriété et vos biens contre des risques comme l'incendie, le dégât d'eau ou le vol, et inclut une <strong>responsabilité civile</strong> (dommages causés à autrui).</p>"
             "<p>Elle doit être en vigueur <strong>dès la prise de possession</strong> — les prêteurs l'exigent avant de débourser l'hypothèque. Prenez le temps de vérifier :</p>"
             "<ul><li>Les <strong>protections</strong> incluses et les <strong>exclusions</strong>.</li><li>Le montant des <strong>franchises</strong>.</li><li>Les situations qui influencent l'assurabilité (réservoir d'huile, toiture âgée, secteur inondable).</li></ul>"
             + tip("Obtenez votre soumission d'assurance dès que la promesse d'achat est acceptée. Une propriété difficile à assurer, mieux vaut le découvrir avant la signature qu'après.")),
        chap("L'assurance titres", "Se protéger contre les problèmes juridiques.",
             "<p>L'assurance titres est différente : elle protège contre certains <strong>problèmes liés au titre de propriété</strong> plutôt que contre les sinistres matériels.</p>"
             "<ul><li>Vice de titre ou irrégularité non détectée.</li><li>Empiètement ou non-conformité.</li><li>Fraude immobilière.</li></ul>"
             "<p>Elle peut parfois remplacer ou compléter un certificat de localisation récent, selon les cas. C'est une protection ponctuelle (prime unique) souvent proposée par le notaire lors de la signature.</p>"
             + tip("L'assurance titres n'est pas obligatoire, mais pour quelques centaines de dollars une seule fois, elle peut vous éviter un litige coûteux. Demandez à votre notaire si elle est pertinente dans votre cas.")),
        chap("Deux protections complémentaires", "Combiner les couvertures intelligemment.",
             "<p>Les deux assurances ne se remplacent pas : elles couvrent des angles différents.</p>"
             "<ul><li><strong>Habitation</strong> : sinistres et responsabilité — obligatoire pour le prêteur.</li><li><strong>Titres</strong> : problèmes juridiques de propriété — optionnelle mais souvent utile.</li></ul>"
             "<p>L'objectif : qu'aucun risque important ne soit laissé sans couverture. Pensez aussi à réévaluer vos protections après des rénovations majeures qui augmentent la valeur de la propriété.</p>"
             + tip("Faites la liste de ce que couvre chaque assurance, côte à côte. Vous verrez immédiatement s'il reste un « trou » entre les deux — et c'est exactement là que se cachent les mauvaises surprises.")),
        chap("Bien magasiner son assurance habitation", "Payer le juste prix pour la bonne protection.",
             "<p>Les primes varient beaucoup d'un assureur à l'autre pour une couverture semblable. Quelques réflexes :</p>"
             "<ul><li>Comparer <strong>plusieurs soumissions</strong> pour une protection équivalente.</li><li>Ajuster la <strong>franchise</strong> : plus haute, elle réduit la prime (mais augmente votre part en cas de réclamation).</li><li>Profiter des <strong>rabais</strong> (regroupement auto-habitation, système d'alarme, non-fumeur).</li><li>Déclarer honnêtement les <strong>risques</strong> : une omission peut annuler la couverture.</li></ul>"
             "<p>La protection la moins chère n'est utile que si elle couvre ce dont vous avez réellement besoin.</p>"
             + tip("Ne choisissez pas votre assurance uniquement au prix. Une franchise trop élevée « pour économiser » peut vous coûter très cher le jour d'un dégât d'eau. Regardez la protection avant le tarif.")),
        chap("Après un sinistre : réagir sans stress", "Savoir quoi faire le moment venu.",
             "<p>Une bonne préparation rend un sinistre beaucoup moins pénible :</p>"
             "<ol><li><strong>Sécuriser</strong> les lieux et limiter les dégâts (couper l'eau, par exemple).</li><li><strong>Documenter</strong> : photos, vidéos, liste des biens touchés.</li><li><strong>Aviser</strong> rapidement votre assureur.</li><li>Conserver les <strong>reçus</strong> des dépenses engagées.</li></ol>"
             "<p>Un inventaire à jour de vos biens (photos, factures) accélère grandement le règlement. Faites-le une fois, à tête reposée, avant d'en avoir besoin.</p>"
             + tip("Filmez une fois par an le tour de votre logement, tiroirs et placards ouverts. En cas de sinistre, cette vidéo vaut mille formulaires pour prouver ce que vous possédiez.")),
    ],
    "qcm": [
        {"q": "L'assurance habitation couvre :", "options": ["A) Les problèmes de titre", "B) Sinistres et responsabilité civile", "C) La taxe de bienvenue", "D) Le notaire"], "answer": 1, "explanation": "Sinistres et responsabilité (chap. 1)."},
        {"q": "Elle doit être en vigueur :", "options": ["A) Un an après l'achat", "B) Dès la prise de possession", "C) Jamais", "D) Seulement pour les condos"], "answer": 1, "explanation": "Exigée par le prêteur dès la possession (chap. 1)."},
        {"q": "L'assurance titres protège contre :", "options": ["A) L'incendie", "B) Les problèmes juridiques liés à la propriété", "C) Le vol", "D) Les taxes"], "answer": 1, "explanation": "Vice de titre, fraude, empiètement (chap. 2)."},
        {"q": "L'assurance titres est :", "options": ["A) Obligatoire", "B) Optionnelle mais souvent utile", "C) Interdite", "D) Gratuite"], "answer": 1, "explanation": "Optionnelle, prime unique (chap. 2)."},
        {"q": "Les deux assurances :", "options": ["A) Se remplacent", "B) Couvrent des angles différents et se complètent", "C) Sont identiques", "D) Sont inutiles"], "answer": 1, "explanation": "Complémentaires (chap. 3)."},
        {"q": "Après des rénovations majeures, il faut :", "options": ["A) Ne rien faire", "B) Réévaluer ses assurances", "C) Résilier", "D) Payer une amende"], "answer": 1, "explanation": "La valeur change (chap. 3)."},
        {"q": "Une franchise plus élevée :", "options": ["A) Augmente la prime", "B) Réduit la prime mais augmente votre part en réclamation", "C) N'a aucun effet", "D) Est illégale"], "answer": 1, "explanation": "Arbitrage prime/franchise (chap. 4)."},
        {"q": "Omettre de déclarer un risque peut :", "options": ["A) Réduire la prime sans risque", "B) Annuler la couverture", "C) Doubler la protection", "D) Être exigé"], "answer": 1, "explanation": "Déclarer honnêtement (chap. 4)."},
        {"q": "Après un sinistre, on doit d'abord :", "options": ["A) Tout jeter", "B) Sécuriser les lieux et documenter les dégâts", "C) Attendre un an", "D) Vendre la maison"], "answer": 1, "explanation": "Sécuriser puis documenter (chap. 5)."},
        {"q": "Pour accélérer un règlement, il est utile d'avoir :", "options": ["A) Aucun document", "B) Un inventaire à jour (photos, factures)", "C) Un nouveau notaire", "D) Une hypothèque plus grande"], "answer": 1, "explanation": "Inventaire préalable (chap. 5)."},
    ],
}

# ===== 39 — Le marché du Grand Montréal =====
DATA[39] = {
    "chapters": [
        chap("Marché d'acheteurs, marché de vendeurs", "Reconnaître dans quel marché on se trouve.",
             "<p>Le marché oscille entre deux extrêmes, avec un équilibre au milieu :</p>"
             "<ul><li><strong>Marché de vendeurs</strong> : la demande dépasse l'offre. Peu de propriétés, ventes rapides, surenchères possibles.</li><li><strong>Marché d'acheteurs</strong> : l'offre dépasse la demande. Plus de choix, délais plus longs, négociation à la baisse.</li><li><strong>Marché équilibré</strong> : entre les deux.</li></ul>"
             "<p>L'indice clé est le <strong>nombre de mois d'inventaire</strong> : combien de temps il faudrait pour écouler toutes les propriétés à vendre au rythme actuel.</p>"
             + tip("Ne vous fiez pas aux manchettes nationales : le marché est local. Un quartier de Montréal peut favoriser les vendeurs pendant qu'un autre favorise les acheteurs. Regardez VOS chiffres de secteur.")),
        chap("Les facteurs qui font bouger le marché", "Comprendre les forces en jeu.",
             "<p>Aucun facteur isolé ne dit tout ; c'est leur combinaison qui façonne le marché :</p>"
             "<ul><li><strong>Taux d'intérêt</strong> : ils influencent fortement la capacité d'emprunt et donc la demande.</li><li><strong>Économie et emploi</strong> : confiance, revenus, migration.</li><li><strong>Offre</strong> : mises en chantier, disponibilité des terrains, réglementation.</li><li><strong>Démographie et secteurs</strong> : certains quartiers restent recherchés quel que soit le cycle.</li></ul>"
             "<p>Comprendre ces leviers vous aide à interpréter ce que vous voyez plutôt qu'à réagir à chaud.</p>"
             + tip("Quand les taux montent, la capacité d'emprunt baisse et la pression sur les prix se relâche souvent. Quand ils baissent, c'est l'inverse. Suivez les taux : c'est le facteur numéro un.")),
        chap("Les indicateurs à surveiller", "Lire le marché avec des chiffres.",
             "<p>Pour vous situer, quelques indicateurs simples et publics valent mieux que des impressions :</p>"
             "<ul><li><strong>Mois d'inventaire</strong> : bas = marché de vendeurs, élevé = marché d'acheteurs.</li><li><strong>Délai de vente moyen</strong> : combien de jours sur le marché.</li><li><strong>Rapport prix vendu / prix demandé</strong> : au-dessus de 100 % signale des surenchères.</li><li><strong>Prix médian</strong> par type de propriété et par secteur.</li></ul>"
             "<p>Suivis dans le temps, ces chiffres racontent la tendance mieux qu'une seule vente spectaculaire.</p>"
             + tip("Une seule maison vendue très cher (ou très bas) ne fait pas une tendance. Regardez le prix médian et le délai de vente sur plusieurs mois : c'est là qu'est la vraie histoire du marché.")),
        chap("Agir sans tenter de deviner le sommet", "Décider selon ses besoins, pas la spéculation.",
             "<p>Personne ne « time » parfaitement le marché — ni les experts, ni les banques. Pour la plupart des ménages, la bonne décision dépend surtout :</p>"
             "<ul><li>de leur <strong>situation personnelle</strong> (besoin, stabilité, capacité) ;</li><li>de leur <strong>horizon</strong> de détention.</li></ul>"
             "<p>L'immobilier récompense généralement la patience et la détention à long terme, qui lissent les cycles. Attendre « le creux parfait » fait souvent manquer de bonnes occasions.</p>"
             + tip("La meilleure question n'est pas « est-ce le bon moment pour le marché ? » mais « est-ce le bon moment pour MOI ? ». Un besoin réel et une détention longue battent presque toujours la spéculation.")),
        chap("Le Grand Montréal : des marchés dans le marché", "Nuancer selon le secteur.",
             "<p>Le « marché de Montréal » n'existe pas vraiment : c'est une mosaïque de marchés locaux aux dynamiques distinctes.</p>"
             "<ul><li><strong>Type de propriété</strong> : condos, plex et unifamiliales ne bougent pas au même rythme.</li><li><strong>Secteur</strong> : centre, couronnes, banlieues et régions ont chacun leur logique.</li><li><strong>Segment de prix</strong> : l'entrée de gamme et le haut de gamme réagissent différemment aux taux.</li></ul>"
             "<p>Comparer votre projet aux bonnes données locales évite les fausses conclusions tirées de statistiques trop larges.</p>"
             + tip("Demandez à votre courtière les ventes comparables des trois à six derniers mois dans VOTRE secteur et pour VOTRE type de propriété. C'est cent fois plus utile qu'une statistique provinciale.")),
    ],
    "qcm": [
        {"q": "En marché de vendeurs :", "options": ["A) L'offre dépasse la demande", "B) La demande dépasse l'offre, ventes rapides", "C) Rien ne se vend", "D) Les prix sont nuls"], "answer": 1, "explanation": "Demande > offre (chap. 1)."},
        {"q": "En marché d'acheteurs :", "options": ["A) Surenchères fréquentes", "B) Plus de choix, négociation à la baisse", "C) Aucune propriété", "D) Prix fixés par la ville"], "answer": 1, "explanation": "Offre > demande (chap. 1)."},
        {"q": "Les mois d'inventaire mesurent :", "options": ["A) L'âge des maisons", "B) Le temps pour écouler les propriétés à vendre", "C) Les taxes", "D) Le taux d'intérêt"], "answer": 1, "explanation": "Indicateur clé (chap. 1 et 3)."},
        {"q": "Le facteur numéro un sur la demande est souvent :", "options": ["A) La couleur des maisons", "B) Les taux d'intérêt", "C) La saison", "D) Le nom des rues"], "answer": 1, "explanation": "Les taux (chap. 2)."},
        {"q": "Un rapport prix vendu/demandé au-dessus de 100 % signale :", "options": ["A) Des rabais", "B) Des surenchères", "C) Un marché mort", "D) Une erreur"], "answer": 1, "explanation": "Surenchères (chap. 3)."},
        {"q": "Pour lire une tendance, on regarde :", "options": ["A) Une seule vente", "B) Prix médian et délais sur plusieurs mois", "C) Les rumeurs", "D) La météo"], "answer": 1, "explanation": "Données dans le temps (chap. 3)."},
        {"q": "« Timer » parfaitement le marché est :", "options": ["A) Facile", "B) Pratiquement impossible", "C) Garanti par les banques", "D) Obligatoire"], "answer": 1, "explanation": "Personne n'y arrive (chap. 4)."},
        {"q": "Pour la plupart des ménages, la décision dépend surtout :", "options": ["A) De la spéculation", "B) De leur situation et de leur horizon", "C) Des voisins", "D) Du hasard"], "answer": 1, "explanation": "Besoins et horizon (chap. 4)."},
        {"q": "Le « marché de Montréal » est en réalité :", "options": ["A) Un seul marché uniforme", "B) Une mosaïque de marchés locaux", "C) Inexistant", "D) Identique partout"], "answer": 1, "explanation": "Des marchés dans le marché (chap. 5)."},
        {"q": "Le plus utile pour situer votre projet, c'est :", "options": ["A) Une statistique provinciale", "B) Les comparables récents de votre secteur et type", "C) Une manchette nationale", "D) Aucune donnée"], "answer": 1, "explanation": "Données locales ciblées (chap. 5)."},
    ],
}

# ===== 40 — Acheter ou vendre en hiver =====
DATA[40] = {
    "chapters": [
        chap("Le mythe de la « mauvaise saison »", "Nuancer l'idée reçue.",
             "<p>Il y a généralement moins de propriétés à vendre et moins d'acheteurs en hiver. Mais « moins » ne veut pas dire « mauvais ».</p>"
             "<p>Les acheteurs d'hiver sont souvent plus <strong>sérieux et motivés</strong> — on ne visite pas par -15 °C sans raison — et la concurrence entre vendeurs est plus faible.</p>"
             "<p>Résultat : une bonne propriété, bien préparée et bien prix, peut très bien se vendre en hiver, parfois avec moins de concurrence qu'au printemps.</p>"
             + tip("Ne retardez pas une vente juste « parce que c'est l'hiver ». Un acheteur qui visite en janvier est rarement un touriste : il est motivé. Moins d'acheteurs, mais souvent plus sérieux.")),
        chap("Vendre en hiver : bien se présenter", "Compenser les défis de la saison.",
             "<p>L'hiver impose quelques ajustements de présentation, faciles à maîtriser :</p>"
             "<ul><li><strong>Déneiger et déglacer</strong> : un accès sécuritaire et accueillant.</li><li><strong>Maximiser la lumière</strong> (jours courts) : ouvrir les rideaux, allumer, ampoules chaudes.</li><li><strong>Chaleur et ambiance</strong> : une maison bien chauffée et cosy rassure.</li><li><strong>Photos</strong> : ajouter aussi des images estivales du terrain, si disponibles.</li></ul>"
             "<p>L'hiver met en valeur le confort et l'efficacité énergétique : ce sont justement des arguments à mettre en avant.</p>"
             + tip("En hiver, vendez le confort : une maison chaleureuse, bien éclairée et facile d'accès malgré la neige. Montrez aussi à quoi ressemble le terrain l'été avec quelques photos.")),
        chap("Acheter en hiver : des occasions", "Profiter des avantages côté acheteur.",
             "<p>Acheter en hiver, c'est souvent <strong>moins de concurrence</strong> entre acheteurs et des vendeurs motivés (parfois pressés).</p>"
             "<p>C'est aussi l'occasion de voir comment la propriété se comporte par grand froid :</p>"
             "<ul><li>Isolation et courants d'air.</li><li>Efficacité du chauffage et coûts réels.</li><li>Infiltrations, glace et déneigement.</li></ul>"
             "<p>Vous testez la maison dans ses conditions les plus exigeantes — un avantage d'inspection non négligeable.</p>"
             + tip("Acheter en hiver permet de voir la maison sous son pire jour : courants d'air, glace, coûts de chauffage réels. Ce que vous constatez en janvier ne vous surprendra pas l'hiver suivant.")),
        chap("Chaque saison a sa logique", "Choisir le moment selon ses priorités.",
             "<p>Plutôt que « bonne » ou « mauvaise » saison, pensez en termes de compromis :</p>"
             "<ul><li><strong>Printemps</strong> : beaucoup de choix et d'acheteurs, mais forte concurrence.</li><li><strong>Été</strong> : marché actif, terrains et extérieurs à leur avantage.</li><li><strong>Automne</strong> : acheteurs sérieux avant l'hiver, rythme qui ralentit.</li><li><strong>Hiver</strong> : moins de volume, mais motivation et concurrence réduite.</li></ul>"
             "<p>Le « meilleur » moment dépend de vos priorités : maximiser le choix, réduire la concurrence, ou simplement suivre votre calendrier de vie.</p>"
             + tip("Il n'existe pas de saison parfaite universelle. Un vendeur qui veut peu de concurrence et un acheteur qui veut négocier peuvent tous deux trouver leur compte en hiver.")),
        chap("Aspects pratiques de l'hiver québécois", "Anticiper la logistique de saison.",
             "<p>Au Québec, l'hiver ajoute quelques réalités concrètes à ne pas négliger :</p>"
             "<ul><li><strong>Déménagement</strong> : routes, verglas et délais ; prévoir de la marge.</li><li><strong>Inspection</strong> : la neige peut cacher la toiture, le terrain, le drainage — poser des questions et documenter.</li><li><strong>Prise de possession</strong> : vérifier chauffage et accès dès la remise des clés.</li><li><strong>Assurance</strong> : s'assurer que la couverture est active avant le grand froid.</li></ul>"
             "<p>Bien anticipés, ces points transforment les « inconvénients » de l'hiver en simple organisation.</p>"
             + tip("Si la neige cache le toit ou le terrain lors de la visite, demandez des photos prises l'été et notez-le à l'inspection. On n'achète pas ce qu'on ne peut pas voir sans se poser de questions.")),
    ],
    "qcm": [
        {"q": "En hiver, il y a généralement :", "options": ["A) Plus de propriétés et d'acheteurs", "B) Moins des deux, mais des acheteurs plus motivés", "C) Aucune transaction", "D) Des prix nuls"], "answer": 1, "explanation": "Moins nombreux, plus sérieux (chap. 1)."},
        {"q": "Un avantage de vendre en hiver est :", "options": ["A) Plus de concurrence", "B) Moins de concurrence entre vendeurs", "C) Aucun acheteur", "D) Des taxes plus hautes"], "answer": 1, "explanation": "Concurrence réduite (chap. 1)."},
        {"q": "Pour bien vendre en hiver, il faut :", "options": ["A) Laisser la glace", "B) Déneiger, maximiser lumière et chaleur", "C) Éteindre le chauffage", "D) Fermer les rideaux"], "answer": 1, "explanation": "Confort et accès (chap. 2)."},
        {"q": "Pour compenser les jours courts, on devrait :", "options": ["A) Baisser les stores", "B) Maximiser la lumière (rideaux ouverts, éclairage chaud)", "C) Visiter la nuit", "D) Rien changer"], "answer": 1, "explanation": "Maximiser la lumière (chap. 2)."},
        {"q": "Acheter en hiver permet de voir :", "options": ["A) Le jardin en fleurs", "B) Le comportement de la maison par grand froid", "C) Rien", "D) La piscine ouverte"], "answer": 1, "explanation": "Test en conditions exigeantes (chap. 3)."},
        {"q": "Les acheteurs d'hiver sont souvent :", "options": ["A) De simples curieux", "B) Plus motivés et sérieux", "C) Inexistants", "D) Des touristes"], "answer": 1, "explanation": "Motivation plus forte (chap. 1 et 3)."},
        {"q": "Le « meilleur » moment pour transiger :", "options": ["A) Est toujours le printemps", "B) Dépend de vos priorités et de votre situation", "C) N'existe jamais", "D) Est fixé par la loi"], "answer": 1, "explanation": "Chaque saison a sa logique (chap. 4)."},
        {"q": "Le printemps se caractérise par :", "options": ["A) Aucun acheteur", "B) Beaucoup de choix mais forte concurrence", "C) Des prix nuls", "D) Aucune propriété"], "answer": 1, "explanation": "Volume et concurrence élevés (chap. 4)."},
        {"q": "Si la neige cache la toiture à la visite, il faut :", "options": ["A) Ignorer", "B) Demander des photos d'été et le noter à l'inspection", "C) Acheter les yeux fermés", "D) Annuler l'achat"], "answer": 1, "explanation": "Documenter ce qu'on ne voit pas (chap. 5)."},
        {"q": "Un déménagement hivernal demande surtout :", "options": ["A) Aucune préparation", "B) De prévoir de la marge (routes, verglas, délais)", "C) De déménager la nuit", "D) D'attendre l'été"], "answer": 1, "explanation": "Anticiper la logistique (chap. 5)."},
    ],
}


def apply(num, payload):
    path = os.path.join(DIR, f'{num}.json')
    d = json.load(open(path, encoding='utf-8'))
    old = d['chapters']
    intro, plan, lex = old[0], old[-2], old[-1]
    d['chapters'] = [intro] + payload['chapters'] + [plan, lex]
    d['qcm'] = payload['qcm']
    json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    core = payload['chapters']
    avg = sum(len(c['html']) for c in core) // len(core)
    print(f'#{num}: {len(d["chapters"])} chap ({len(core)} fond, ~{avg} car./chap), {len(d["qcm"])} QCM')


for num, payload in DATA.items():
    apply(num, payload)
print('Lot 2 (38-40) terminé.')
