#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichissement lot 3 : guides #41-47 (standard uniforme, 5 chapitres + 10 QCM)."""
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

# ===== 41 — Évaluation municipale vs valeur marchande =====
DATA[41] = {
    "chapters": [
        chap("L'évaluation municipale : un outil fiscal", "Comprendre à quoi elle sert vraiment.",
             "<p>L'évaluation municipale figure au <strong>rôle d'évaluation</strong>. Son but n'est pas de fixer un prix de vente : elle sert à <strong>répartir les taxes</strong> municipales et scolaires.</p>"
             "<p>Elle est établie « en masse », à une date de référence, pour l'ensemble d'un territoire — pas propriété par propriété au prix du jour. Conséquence :</p>"
             "<ul><li>Elle peut être supérieure ou inférieure à la valeur marchande réelle.</li><li>Elle accuse souvent un décalage dans le temps.</li></ul>"
             + tip("« La ville l'évalue à tant, donc ça vaut tant » : c'est le malentendu numéro un. L'évaluation municipale sert à calculer vos taxes, pas à fixer le prix de vente.")),
        chap("La valeur marchande : le prix du marché", "Comprendre ce que paie réellement un acheteur.",
             "<p>La valeur marchande est le prix qu'un <strong>acheteur informé</strong> est prêt à payer <em>aujourd'hui</em>, dans les conditions actuelles du marché.</p>"
             "<p>Elle se détermine par une <strong>analyse comparative de marché</strong> (ventes récentes de propriétés semblables), et non par le rôle d'évaluation.</p>"
             "<p>C'est ce chiffre — et lui seul — qui doit guider un prix de vente ou une offre d'achat.</p>"
             + tip("Pour connaître la vraie valeur de votre propriété, demandez une analyse comparative fondée sur des ventes récentes du secteur. C'est le seul chiffre qui compte quand vient le temps de vendre ou d'acheter.")),
        chap("Le facteur comparatif et les bons usages", "Relier les deux notions correctement.",
             "<p>La municipalité applique un <strong>facteur comparatif</strong> pour tenter de rapprocher le rôle d'évaluation de la valeur marchande — par exemple dans le calcul de la taxe de bienvenue.</p>"
             "<p>Cela montre bien que l'évaluation, seule, n'est pas la valeur du marché. À chaque chiffre son usage :</p>"
             "<ul><li><strong>Évaluation municipale</strong> : pour les taxes, et comme base (ajustée) de la taxe de bienvenue.</li><li><strong>Valeur marchande</strong> : pour fixer un prix, faire une offre, négocier.</li></ul>"
             + tip("Pour estimer votre taxe de bienvenue, souvenez-vous qu'on retient le plus élevé entre le prix payé et l'évaluation municipale ajustée du facteur comparatif. Ça évite les mauvaises surprises.")),
        chap("Contester son évaluation municipale", "Agir si le rôle vous semble erroné.",
             "<p>Si votre évaluation municipale vous paraît nettement trop élevée par rapport au marché, vous pouvez la <strong>contester</strong> — dans un délai précis suivant le dépôt d'un nouveau rôle.</p>"
             "<ol><li>Comparer votre évaluation à celle de propriétés semblables.</li><li>Rassembler des preuves (ventes comparables, état réel du bâtiment).</li><li>Déposer une <strong>demande de révision</strong> auprès de la municipalité dans le délai prévu.</li></ol>"
             "<p>Une évaluation trop haute peut gonfler vos taxes année après année : le jeu peut en valoir la chandelle.</p>"
             + tip("Ne laissez pas passer le délai de révision. Si votre évaluation dépasse clairement celle de maisons comparables, une contestation bien documentée peut réduire vos taxes pour des années.")),
        chap("Le bon chiffre au bon moment", "Ne plus jamais confondre les deux.",
             "<p>En pratique, gardez ce réflexe simple selon la situation :</p>"
             "<ul><li>Je <strong>vends</strong> ou je fais une <strong>offre</strong> → valeur marchande (analyse comparative).</li><li>Je vérifie mes <strong>taxes</strong> → évaluation municipale (rôle).</li><li>J'estime ma <strong>taxe de bienvenue</strong> → le plus élevé du prix payé ou de l'évaluation ajustée.</li></ul>"
             "<p>Les deux chiffres sont utiles ; c'est les mélanger qui mène aux erreurs de prix.</p>"
             + tip("Affichez-vous mentalement deux tiroirs : « taxes » pour l'évaluation municipale, « prix » pour la valeur marchande. Ne piochez jamais dans le mauvais tiroir au moment de négocier.")),
    ],
    "qcm": [
        {"q": "L'évaluation municipale sert surtout à :", "options": ["A) Fixer le prix de vente", "B) Répartir les taxes", "C) Payer le notaire", "D) Assurer la maison"], "answer": 1, "explanation": "Outil fiscal (chap. 1)."},
        {"q": "Elle est établie :", "options": ["A) Au prix du jour, propriété par propriété", "B) En masse, à une date de référence", "C) Par l'acheteur", "D) Chaque semaine"], "answer": 1, "explanation": "Évaluation de masse (chap. 1)."},
        {"q": "La valeur marchande est :", "options": ["A) Le chiffre du rôle", "B) Le prix qu'un acheteur informé paie aujourd'hui", "C) La taxe de bienvenue", "D) La franchise"], "answer": 1, "explanation": "Prix réel du marché (chap. 2)."},
        {"q": "Elle se détermine par :", "options": ["A) Le rôle d'évaluation", "B) Une analyse comparative de marché", "C) Le hasard", "D) La ville"], "answer": 1, "explanation": "Ventes comparables (chap. 2)."},
        {"q": "Le facteur comparatif sert à :", "options": ["A) Cacher les taxes", "B) Rapprocher l'évaluation du marché (ex. taxe de bienvenue)", "C) Fixer l'assurance", "D) Rien"], "answer": 1, "explanation": "Rapprochement évaluation/marché (chap. 3)."},
        {"q": "Pour fixer un prix de vente, on utilise :", "options": ["A) L'évaluation municipale", "B) La valeur marchande", "C) La taxe scolaire", "D) La franchise"], "answer": 1, "explanation": "Valeur marchande (chap. 3 et 5)."},
        {"q": "Une évaluation municipale trop élevée peut :", "options": ["A) Réduire vos taxes", "B) Gonfler vos taxes année après année", "C) Baisser le prix de vente", "D) Être ignorée sans effet"], "answer": 1, "explanation": "Impact fiscal (chap. 4)."},
        {"q": "Pour la contester, il faut :", "options": ["A) Attendre dix ans", "B) Déposer une demande de révision dans le délai prévu", "C) Appeler le notaire", "D) Vendre la maison"], "answer": 1, "explanation": "Demande de révision (chap. 4)."},
        {"q": "Pour vérifier vos taxes, le bon chiffre est :", "options": ["A) La valeur marchande", "B) L'évaluation municipale", "C) Le prix payé par le voisin", "D) L'assurance"], "answer": 1, "explanation": "Évaluation municipale (chap. 5)."},
        {"q": "La taxe de bienvenue se base sur :", "options": ["A) Le plus bas des deux chiffres", "B) Le plus élevé du prix payé ou de l'évaluation ajustée", "C) La franchise", "D) Rien"], "answer": 1, "explanation": "Le plus élevé des deux (chap. 3 et 5)."},
    ],
}

# ===== 42 — Copropriété divise ou indivise ? =====
DATA[42] = {
    "chapters": [
        chap("La copropriété divise (le condo classique)", "Comprendre le modèle le plus courant.",
             "<p>En copropriété divise, chaque unité a son <strong>propre titre de propriété</strong> distinct et son numéro de lot.</p>"
             "<ul><li>Un <strong>syndicat</strong> de copropriété gère l'immeuble.</li><li>Une <strong>déclaration de copropriété</strong> encadre les droits et obligations.</li><li>Des <strong>charges de copropriété</strong> et un <strong>fonds de prévoyance</strong> financent l'entretien.</li></ul>"
             "<p>Vous financez votre unité avec votre propre hypothèque : plus simple à financer et à revendre.</p>"
             + tip("En divise, lisez la déclaration de copropriété ET les derniers procès-verbaux d'assemblée. Ils révèlent les travaux à venir, les conflits et la santé réelle du fonds de prévoyance.")),
        chap("La copropriété indivise", "Comprendre ce modèle particulier.",
             "<p>En copropriété indivise, plusieurs personnes possèdent ensemble <strong>UN seul immeuble</strong>, sans division en lots distincts.</p>"
             "<p>Chacun détient une <strong>quote-part</strong> de l'ensemble et jouit d'une portion selon une <strong>convention d'indivision</strong>. Il n'y a pas de titres séparés par unité.</p>"
             "<ul><li>Souvent un prix d'entrée plus bas pour un secteur donné.</li><li>Financement plus complexe : parfois une hypothèque commune.</li><li>Forte interdépendance entre copropriétaires.</li></ul>"
             + tip("En indivise, vous êtes lié aux autres copropriétaires, parfois par une hypothèque commune. Assurez-vous de bien les connaître et de comprendre la convention avant de vous engager.")),
        chap("Divise ou indivise : bien choisir", "Peser les avantages et les risques.",
             "<p>Les deux modèles se ressemblent en apparence, mais diffèrent profondément :</p>"
             "<ul><li><strong>Divise</strong> : plus simple, plus liquide, mieux encadrée — souvent le choix par défaut.</li><li><strong>Indivise</strong> : parfois plus abordable, mais plus complexe à financer et à revendre, très dépendante de la convention et des autres copropriétaires.</li></ul>"
             "<p>Dans les deux cas : vérifier documents, finances et règles avant d'acheter. Le bon choix dépend de votre budget et de votre tolérance à la complexité.</p>"
             + tip("À prix comparable, la divise offre plus de tranquillité et se revend plus facilement. L'indivise peut être intéressante, mais entrez-y les yeux ouverts, pas seulement pour économiser.")),
        chap("Le fonds de prévoyance et les charges", "Évaluer la santé financière de la copropriété.",
             "<p>Une copropriété, c'est aussi une petite entreprise collective. Sa santé financière vous concerne directement :</p>"
             "<ul><li><strong>Charges mensuelles</strong> : couvrent l'entretien courant et les services.</li><li><strong>Fonds de prévoyance</strong> : réserve pour les grosses réparations (toiture, façade, ascenseur).</li><li><strong>Étude du fonds de prévoyance</strong> : évalue si la réserve est suffisante.</li></ul>"
             "<p>Un fonds sous-financé annonce des <strong>cotisations spéciales</strong> futures : c'est un signal à ne pas ignorer.</p>"
             + tip("Des charges anormalement basses ne sont pas une aubaine : elles cachent souvent un fonds de prévoyance insuffisant. Vous paierez tôt ou tard, sous forme de cotisation spéciale.")),
        chap("Les vérifications avant d'acheter", "Réduire les mauvaises surprises.",
             "<p>Avant de signer, quel que soit le modèle, faites votre inspection documentaire :</p>"
             "<ol><li>Lire la <strong>déclaration</strong> (divise) ou la <strong>convention</strong> (indivise).</li><li>Consulter les <strong>procès-verbaux</strong> et le <strong>budget</strong>.</li><li>Vérifier l'état du <strong>fonds de prévoyance</strong> et les travaux prévus.</li><li>Confirmer les <strong>règlements</strong> (animaux, location, rénovations).</li></ol>"
             "<p>Faites examiner ces documents par votre notaire : c'est le meilleur rempart contre les surprises coûteuses.</p>"
             + tip("Achetez toujours un condo « documents en main ». Une déclaration mal lue peut cacher une interdiction de louer, des travaux imminents ou un litige en cours. Le notaire est votre allié ici.")),
    ],
    "qcm": [
        {"q": "En copropriété divise, chaque unité a :", "options": ["A) Une quote-part", "B) Son propre titre de propriété distinct", "C) Aucun titre", "D) Un bail"], "answer": 1, "explanation": "Titre distinct par unité (chap. 1)."},
        {"q": "En copropriété indivise, on détient :", "options": ["A) Un lot séparé", "B) Une quote-part d'un seul immeuble", "C) Un bail", "D) Rien"], "answer": 1, "explanation": "Quote-part de l'ensemble (chap. 2)."},
        {"q": "L'indivise est encadrée par :", "options": ["A) Une déclaration de copropriété", "B) Une convention d'indivision", "C) Un bail", "D) Aucun document"], "answer": 1, "explanation": "Convention d'indivision (chap. 2)."},
        {"q": "La divise est généralement :", "options": ["A) Moins liquide", "B) Plus simple à financer et à revendre", "C) Interdite", "D) Sans syndicat"], "answer": 1, "explanation": "Plus liquide (chap. 1 et 3)."},
        {"q": "L'indivise est souvent :", "options": ["A) Plus simple à financer", "B) Plus abordable mais plus complexe à financer et revendre", "C) Sans copropriétaires", "D) Sans convention"], "answer": 1, "explanation": "Plus complexe (chap. 3)."},
        {"q": "Le fonds de prévoyance sert à :", "options": ["A) Payer l'épicerie", "B) Financer les grosses réparations", "C) Réduire le prix", "D) Payer le notaire"], "answer": 1, "explanation": "Réserve pour réparations (chap. 4)."},
        {"q": "Des charges anormalement basses peuvent cacher :", "options": ["A) Un fonds de prévoyance insuffisant", "B) Une aubaine sans risque", "C) Une baisse de taxes", "D) Rien"], "answer": 0, "explanation": "Signal d'un fonds sous-financé (chap. 4)."},
        {"q": "Un fonds sous-financé annonce souvent :", "options": ["A) Une baisse de charges", "B) Des cotisations spéciales futures", "C) Un remboursement", "D) Aucun effet"], "answer": 1, "explanation": "Cotisations spéciales (chap. 4)."},
        {"q": "Avant d'acheter, il faut lire :", "options": ["A) Rien", "B) Déclaration/convention, PV et budget", "C) Le journal", "D) Le bail du voisin"], "answer": 1, "explanation": "Inspection documentaire (chap. 5)."},
        {"q": "Pour examiner les documents, le meilleur allié est :", "options": ["A) Le voisin", "B) Le notaire", "C) L'assureur", "D) La ville"], "answer": 1, "explanation": "Le notaire (chap. 5)."},
    ],
}

# ===== 43 — Acheter à deux =====
DATA[43] = {
    "chapters": [
        chap("Mariés vs conjoints de fait", "Comprendre pourquoi le statut change tout.",
             "<p>Au Québec, les couples mariés ou unis civilement bénéficient de règles de protection (<strong>patrimoine familial</strong>) qui encadrent la résidence familiale.</p>"
             "<p>Les <strong>conjoints de fait</strong>, eux, n'ont <em>pas</em> ces protections automatiques : en cas de séparation ou de décès, leurs droits dépendent surtout de ce qui est <strong>écrit</strong> (titre, convention, testament).</p>"
             "<p>Beaucoup de conjoints de fait ignorent cette réalité — et le découvrent au pire moment.</p>"
             + tip("« On est ensemble depuis 15 ans, c'est comme un mariage. » Non : au Québec, l'union de fait ne crée pas les mêmes droits. Pour un couple non marié, tout se joue dans les documents.")),
        chap("Comment détenir la propriété", "Choisir la structure de détention.",
             "<p>La façon d'inscrire la propriété au titre est une décision <strong>structurante</strong> :</p>"
             "<ul><li>En <strong>indivision</strong>, à parts égales (50/50) ou selon l'apport de chacun.</li><li>Le <strong>titre</strong> doit refléter clairement qui possède quoi.</li></ul>"
             "<p>Si un seul conjoint est au titre, l'autre peut se retrouver sans droit sur la propriété — même après des années et de nombreux paiements. Faites ce choix en connaissance de cause.</p>"
             + tip("Si vous payez la moitié de l'hypothèque, assurez-vous d'être au titre. Contribuer financièrement sans figurer sur le titre, c'est le scénario classique où l'on perd tout à la séparation.")),
        chap("La convention entre conjoints", "Prévoir l'imprévu par écrit.",
             "<p>Une convention (souvent une <strong>convention d'indivision</strong> ou un contrat de vie commune) précise à l'avance ce qui pourrait autrement se régler devant les tribunaux :</p>"
             "<ul><li>La <strong>répartition des parts</strong>.</li><li>Qui paie quoi (hypothèque, taxes, entretien).</li><li>Ce qui arrive en cas de <strong>séparation</strong> (rachat, vente, délais).</li><li>Ce qui arrive en cas de <strong>décès</strong> (avec le testament).</li></ul>"
             "<p>C'est un peu comme une assurance : on espère ne jamais s'en servir, mais elle évite des conflits douloureux.</p>"
             + tip("Rédigez la convention QUAND tout va bien, pas quand ça va mal. Discuter calmement du « et si un jour… » à l'achat est infiniment plus simple qu'en pleine rupture.")),
        chap("Protéger le survivant : testament et assurance", "Penser aussi au décès, pas seulement à la rupture.",
             "<p>Pour les conjoints de fait surtout, le décès d'un partenaire peut laisser l'autre dans une situation précaire s'il n'y a rien de prévu.</p>"
             "<ul><li><strong>Testament</strong> : sans lui, un conjoint de fait n'hérite pas automatiquement.</li><li><strong>Assurance vie</strong> : peut permettre au survivant de racheter la part ou de rembourser l'hypothèque.</li><li><strong>Clause dans la convention</strong> : coordonner avec le testament.</li></ul>"
             "<p>Ces outils, mis en place ensemble, forment un vrai filet de sécurité.</p>"
             + tip("Une assurance vie qui couvre le solde de l'hypothèque évite au survivant de devoir vendre en catastrophe. C'est souvent l'un des meilleurs achats de tranquillité d'esprit d'un couple.")),
        chap("Acheter à deux, étape par étape", "Structurer l'achat sereinement.",
             "<p>Pour un achat à deux bien ficelé, suivez cet ordre logique :</p>"
             "<ol><li><strong>Clarifier</strong> votre statut et vos protections réelles.</li><li>Décider de la <strong>répartition des parts</strong>.</li><li>Faire rédiger une <strong>convention</strong> par un notaire.</li><li>Mettre à jour vos <strong>testaments</strong> en conséquence.</li><li>Inscrire la propriété au <strong>titre</strong> conformément à l'entente.</li></ol>"
             "<p>Un peu de rigueur au départ protège votre couple — et votre patrimoine — pour longtemps.</p>"
             + tip("Traitez l'achat à deux comme un petit projet commun : une entente écrite, des rôles clairs, des documents à jour. Ce n'est pas un manque de confiance, c'est du respect mutuel.")),
    ],
    "qcm": [
        {"q": "Les couples mariés bénéficient :", "options": ["A) D'aucune protection", "B) Des protections du patrimoine familial", "C) De taxes réduites", "D) D'une hypothèque gratuite"], "answer": 1, "explanation": "Patrimoine familial (chap. 1)."},
        {"q": "Les conjoints de fait :", "options": ["A) Ont les mêmes protections que les mariés", "B) N'ont pas de protections automatiques ; l'écrit prime", "C) Ne peuvent pas acheter", "D) Héritent automatiquement"], "answer": 1, "explanation": "L'écrit prime (chap. 1)."},
        {"q": "Si un seul conjoint est au titre :", "options": ["A) L'autre est protégé d'office", "B) L'autre peut se retrouver sans droit sur la propriété", "C) La ville tranche", "D) Rien ne change"], "answer": 1, "explanation": "Le titre est structurant (chap. 2)."},
        {"q": "En indivision, les parts peuvent être :", "options": ["A) Toujours 50/50 obligatoirement", "B) Égales ou selon l'apport de chacun", "C) Fixées par la ville", "D) Inexistantes"], "answer": 1, "explanation": "Égales ou selon l'apport (chap. 2)."},
        {"q": "La convention entre conjoints précise :", "options": ["A) La couleur des murs", "B) Parts, paiements, séparation et décès", "C) Les taxes municipales", "D) Le taux d'intérêt"], "answer": 1, "explanation": "Elle règle les scénarios (chap. 3)."},
        {"q": "Le meilleur moment pour rédiger la convention est :", "options": ["A) En pleine rupture", "B) Quand tout va bien, à l'achat", "C) Jamais", "D) Après dix ans"], "answer": 1, "explanation": "Anticiper (chap. 3)."},
        {"q": "Sans testament, un conjoint de fait :", "options": ["A) Hérite automatiquement", "B) N'hérite pas automatiquement", "C) Paie moins de taxes", "D) Devient marié"], "answer": 1, "explanation": "Le testament est essentiel (chap. 4)."},
        {"q": "Une assurance vie peut permettre au survivant de :", "options": ["A) Éviter le notaire", "B) Racheter la part ou rembourser l'hypothèque", "C) Doubler ses taxes", "D) Rien"], "answer": 1, "explanation": "Filet de sécurité (chap. 4)."},
        {"q": "Le titre de propriété doit :", "options": ["A) Ignorer l'entente", "B) Refléter l'entente réelle du couple", "C) Être au nom de la banque", "D) Rester vide"], "answer": 1, "explanation": "Cohérence titre/entente (chap. 2 et 5)."},
        {"q": "Structurer l'achat à deux, c'est surtout :", "options": ["A) Un manque de confiance", "B) Du respect mutuel et de la prévoyance", "C) Une perte de temps", "D) Illégal"], "answer": 1, "explanation": "Prévoyance et respect (chap. 5)."},
    ],
}

# ===== 44 — Premier achat pour nouveaux arrivants =====
DATA[44] = {
    "chapters": [
        chap("Bâtir son dossier de crédit et de financement", "Se rendre finançable dans le système local.",
             "<p>Les prêteurs regardent votre <strong>crédit canadien</strong>, vos revenus et votre stabilité. Un historique de crédit local peut prendre du temps à bâtir.</p>"
             "<ul><li>Commencer tôt à bâtir un crédit (carte, paiements à temps).</li><li>Rassembler preuves de revenus et d'emploi.</li><li>Explorer les <strong>programmes pour nouveaux arrivants</strong>, aux conditions particulières.</li></ul>"
             "<p>Plus votre dossier est solide et documenté, plus le financement sera simple et avantageux.</p>"
             + tip("Ouvrez une carte de crédit dès votre arrivée et payez-la intégralement chaque mois. Bâtir un historique canadien prend des mois : commencez bien avant de penser à acheter.")),
        chap("Comprendre les spécificités québécoises", "Apprendre les règles du jeu local.",
             "<p>Le système québécois a ses particularités, souvent différentes de ce qui existe ailleurs :</p>"
             "<ul><li>Rôle du <strong>notaire</strong> (obligatoire) et du <strong>courtier</strong> (encadré par l'OACIQ).</li><li><strong>Taxe de bienvenue</strong>, taxes municipales et scolaires.</li><li>Copropriété <strong>divise/indivise</strong>, baux et règles locatives si plex.</li><li>Particularités du bâti (sols argileux, drain français, chauffage, hiver).</li></ul>"
             "<p>Les comprendre à l'avance évite bien des surprises coûteuses.</p>"
             + tip("Prenez le temps d'apprendre le vocabulaire local : « taxe de bienvenue », « certificat de localisation », « conditions de la promesse d'achat ». Comprendre les mots, c'est déjà éviter la moitié des erreurs.")),
        chap("Se préparer et bien s'entourer", "Avancer avec confiance.",
             "<p>Comme tout premier acheteur, préparez les fondations :</p>"
             "<ul><li>Établir un <strong>budget</strong> réaliste.</li><li>Obtenir une <strong>préapprobation</strong> hypothécaire.</li><li>Définir vos <strong>critères</strong> et vos secteurs.</li></ul>"
             "<p>En prime, entourez-vous de professionnels qui comprennent votre parcours (courtière, courtier hypothécaire, notaire). Apprendre le marché local avant d'acheter est un investissement qui rapporte.</p>"
             + tip("Choisissez des professionnels habitués à accompagner les nouveaux arrivants. Une bonne courtière vous expliquera non seulement les maisons, mais tout le système autour — c'est inestimable.")),
        chap("La mise de fonds et les aides disponibles", "Rassembler et optimiser votre apport.",
             "<p>La <strong>mise de fonds</strong> minimale dépend du prix de la propriété ; en dessous d'un certain seuil, une <strong>assurance prêt</strong> s'ajoute au financement.</p>"
             "<ul><li>Épargner tôt et automatiser vos versements.</li><li>Vérifier votre admissibilité à des <strong>programmes d'aide</strong> et incitatifs (selon votre statut et votre situation).</li><li>Un <strong>don</strong> familial est accepté avec une lettre de don.</li></ul>"
             "<p>Un courtier hypothécaire peut vous aider à assembler le tout de la façon la plus avantageuse.</p>"
             + tip("Renseignez-vous sur les programmes destinés aux premiers acheteurs et aux nouveaux arrivants : certains offrent des conditions avantageuses. Un courtier hypothécaire connaît ceux auxquels vous avez droit.")),
        chap("De la recherche à la prise de possession", "Suivre le parcours étape par étape.",
             "<p>Une fois financé et bien entouré, le parcours d'achat suit une logique claire :</p>"
             "<ol><li><strong>Visiter</strong> selon vos critères et secteurs.</li><li>Faire une <strong>promesse d'achat</strong> avec les bonnes conditions (financement, inspection).</li><li>Réaliser l'<strong>inspection</strong> et lever les conditions.</li><li>Signer chez le <strong>notaire</strong> et prendre possession.</li></ol>"
             "<p>À chaque étape, posez vos questions : personne n'attend d'un nouvel arrivant qu'il connaisse déjà tout le système.</p>"
             + tip("N'ayez pas peur de poser « trop » de questions. Un bon professionnel préfère mille fois répondre à vos interrogations que de vous voir signer sans comprendre. C'est votre plus gros achat.")),
    ],
    "qcm": [
        {"q": "Les prêteurs regardent surtout :", "options": ["A) Votre crédit d'un autre pays", "B) Votre crédit canadien, vos revenus et votre stabilité", "C) Votre âge", "D) Vos loisirs"], "answer": 1, "explanation": "Crédit canadien (chap. 1)."},
        {"q": "Pour bâtir un crédit local, il faut :", "options": ["A) Attendre dix ans", "B) Commencer tôt (carte, paiements à temps)", "C) Éviter tout crédit", "D) Payer comptant"], "answer": 1, "explanation": "Commencer tôt (chap. 1)."},
        {"q": "Au Québec, le notaire est :", "options": ["A) Facultatif", "B) Obligatoire pour la vente", "C) Interdit", "D) Le vendeur"], "answer": 1, "explanation": "Notaire obligatoire (chap. 2)."},
        {"q": "La taxe de bienvenue est :", "options": ["A) Un cadeau", "B) Des droits de mutation municipaux", "C) Une assurance", "D) Un loyer"], "answer": 1, "explanation": "Droits de mutation (chap. 2)."},
        {"q": "Avant de magasiner, il est sage d'avoir :", "options": ["A) Aucune préparation", "B) Un budget et une préapprobation", "C) Une seule visite", "D) Un déménageur"], "answer": 1, "explanation": "Budget + préapprobation (chap. 3)."},
        {"q": "Bien s'entourer signifie choisir des pros qui :", "options": ["A) Ignorent votre parcours", "B) Comprennent le parcours des nouveaux arrivants", "C) Parlent vite", "D) Ne répondent pas"], "answer": 1, "explanation": "Accompagnement adapté (chap. 3)."},
        {"q": "Sous un certain seuil de mise de fonds :", "options": ["A) L'achat est interdit", "B) Une assurance prêt s'ajoute au financement", "C) Les taxes disparaissent", "D) Le notaire est gratuit"], "answer": 1, "explanation": "Assurance prêt (chap. 4)."},
        {"q": "Un don familial pour la mise de fonds :", "options": ["A) Est refusé", "B) Est accepté avec une lettre de don", "C) Double les taxes", "D) Est illégal"], "answer": 1, "explanation": "Lettre de don (chap. 4)."},
        {"q": "Une promesse d'achat prudente inclut :", "options": ["A) Aucune condition", "B) Des conditions (financement, inspection)", "C) Un prix secret", "D) Rien"], "answer": 1, "explanation": "Conditions protectrices (chap. 5)."},
        {"q": "Pour un nouvel arrivant, poser des questions est :", "options": ["A) Gênant", "B) Normal et encouragé", "C) Interdit", "D) Inutile"], "answer": 1, "explanation": "Personne n'attend qu'il sache tout (chap. 5)."},
    ],
}

# ===== 45 — Acheter et vendre en même temps =====
DATA[45] = {
    "chapters": [
        chap("Vendre d'abord ou acheter d'abord ?", "Choisir la séquence adaptée à votre risque.",
             "<p>Tout se joue sur l'ordre des opérations, et chacun a son revers :</p>"
             "<ul><li><strong>Vendre d'abord</strong> : vous connaissez votre budget exact et vendez sans pression, mais risquez de devoir vous reloger temporairement.</li><li><strong>Acheter d'abord</strong> : vous sécurisez votre prochaine maison, mais risquez de payer deux propriétés si l'ancienne tarde à se vendre.</li></ul>"
             "<p>La <strong>condition de vente</strong> (offrir conditionnellement à la vente de votre propriété) est un outil pour réduire ce risque.</p>"
             + tip("Si votre budget ne peut pas absorber deux hypothèques, penchez vers « vendre d'abord » ou utilisez une condition de vente. Le confort d'esprit vaut souvent plus que la maison parfaite trouvée trop tôt.")),
        chap("Combler l'écart financier", "Gérer le décalage entre les deux transactions.",
             "<p>Si les dates ne coïncident pas, ou si vous achetez avant d'encaisser votre vente, des outils existent :</p>"
             "<ul><li><strong>Prêt-relais</strong> : financement temporaire jusqu'à l'encaissement de la vente.</li><li><strong>Marge de crédit</strong> : pour couvrir un court décalage.</li><li>Négociation de <strong>dates de possession</strong> compatibles.</li></ul>"
             "<p>Le prêt-relais est l'outil le plus courant : il couvre précisément l'écart entre l'achat et la vente.</p>"
             + tip("Parlez du prêt-relais à votre courtier hypothécaire AVANT de faire une offre. Savoir que le pont financier est possible (et à quel coût) change complètement votre marge de manœuvre.")),
        chap("Coordonner dates et logistique", "Orchestrer les deux clôtures et le déménagement.",
             "<p>L'idéal est d'aligner autant que possible les <strong>dates de possession</strong> (vente et achat) pour un déménagement fluide.</p>"
             "<p>À défaut, prévoyez :</p>"
             "<ul><li>De l'<strong>entreposage</strong> temporaire.</li><li>Un <strong>hébergement</strong> de transition.</li><li>Une <strong>marge</strong> dans le calendrier.</li></ul>"
             "<p>Une courtière qui gère les deux transactions peut synchroniser les échéances et anticiper les points de friction.</p>"
             + tip("Confiez idéalement l'achat ET la vente à la même courtière. Elle voit les deux calendriers en même temps et peut caler les dates pour vous éviter un double déménagement.")),
        chap("Éviter la double détention coûteuse", "Limiter le risque de payer deux propriétés.",
             "<p>Le pire scénario, c'est de se retrouver avec <strong>deux propriétés sur les bras</strong>. Quelques garde-fous :</p>"
             "<ul><li>Bien <strong>prix</strong> votre propriété actuelle pour qu'elle se vende vite.</li><li>Utiliser une <strong>condition de vente</strong> à l'achat quand c'est possible.</li><li>Négocier des <strong>dates flexibles</strong> côté vendeur.</li><li>Garder un <strong>coussin financier</strong> pour absorber quelques semaines de chevauchement.</li></ul>"
             "<p>Anticiper le pire scénario, c'est justement ce qui vous évite de le vivre.</p>"
             + tip("Une propriété bien évaluée et bien présentée se vend plus vite — et c'est votre meilleure protection contre la double détention. Ne surévaluez pas « au cas où » : c'est ce qui fait traîner les ventes.")),
        chap("Le plan de match, étape par étape", "Enchaîner les deux transactions sereinement.",
             "<p>Un enchaînement réussi suit une trame claire :</p>"
             "<ol><li><strong>Déterminer la séquence</strong> (vendre ou acheter d'abord) selon votre risque.</li><li><strong>Valider le financement</strong> et explorer le prêt-relais.</li><li><strong>Mettre en marché</strong> ou magasiner en parallèle, selon la séquence.</li><li><strong>Coordonner les dates</strong> de possession.</li><li><strong>Synchroniser</strong> les deux clôtures chez le notaire.</li></ol>"
             "<p>Bien planifié, l'exercice d'équilibriste devient une simple suite d'étapes maîtrisées.</p>"
             + tip("Écrivez votre plan de match sur une seule page avec les dates clés. Vue d'ensemble en main, les décisions deviennent évidentes et le stress redescend.")),
    ],
    "qcm": [
        {"q": "Vendre d'abord permet surtout de :", "options": ["A) Payer deux maisons", "B) Connaître son budget exact et vendre sans pression", "C) Éviter le notaire", "D) Doubler les taxes"], "answer": 1, "explanation": "Budget connu (chap. 1)."},
        {"q": "Acheter d'abord risque de :", "options": ["A) Réduire le choix", "B) Faire payer deux propriétés si l'ancienne tarde", "C) Annuler la vente", "D) Baisser les taxes"], "answer": 1, "explanation": "Risque de double détention (chap. 1)."},
        {"q": "La condition de vente permet :", "options": ["A) D'acheter sans conditions", "B) D'offrir conditionnellement à la vente de sa propriété", "C) De payer moins", "D) D'éviter le notaire"], "answer": 1, "explanation": "Outil de réduction du risque (chap. 1)."},
        {"q": "Le prêt-relais sert à :", "options": ["A) Rénover", "B) Couvrir l'écart entre l'achat et l'encaissement de la vente", "C) Payer les taxes", "D) Assurer la maison"], "answer": 1, "explanation": "Financement temporaire (chap. 2)."},
        {"q": "Il faut parler du prêt-relais :", "options": ["A) Après la clôture", "B) Avant de faire une offre", "C) Jamais", "D) À la ville"], "answer": 1, "explanation": "Anticiper le financement (chap. 2)."},
        {"q": "L'idéal, côté dates, est de :", "options": ["A) Les ignorer", "B) Aligner les dates de possession", "C) Déménager deux fois", "D) Fixer au hasard"], "answer": 1, "explanation": "Aligner les possessions (chap. 3)."},
        {"q": "Confier les deux transactions à la même courtière permet de :", "options": ["A) Payer plus", "B) Synchroniser les échéances", "C) Compliquer le tout", "D) Éviter la vente"], "answer": 1, "explanation": "Coordination (chap. 3)."},
        {"q": "La double détention, c'est :", "options": ["A) Un avantage fiscal", "B) Détenir deux propriétés à la fois, à minimiser", "C) Une assurance", "D) Une condition"], "answer": 1, "explanation": "À limiter (chap. 4)."},
        {"q": "La meilleure protection contre la double détention est :", "options": ["A) Surévaluer sa propriété", "B) Bien la prix pour qu'elle se vende vite", "C) Ne pas la vendre", "D) Attendre l'hiver"], "answer": 1, "explanation": "Bon prix = vente rapide (chap. 4)."},
        {"q": "Un bon plan de match tient idéalement :", "options": ["A) Dans dix classeurs", "B) Sur une page avec les dates clés", "C) Dans la tête seulement", "D) Chez le notaire"], "answer": 1, "explanation": "Vue d'ensemble (chap. 5)."},
    ],
}

# ===== 46 — La retraite et l'immobilier =====
DATA[46] = {
    "chapters": [
        chap("Le downsizing : réduire pour mieux vivre", "Peser l'intérêt de réduire la taille.",
             "<p>Vendre une grande maison pour une propriété plus petite (condo, plus petite maison) peut transformer votre quotidien.</p>"
             "<ul><li>Moins d'entretien, de taxes et de coûts d'énergie.</li><li>Des liquidités potentielles dégagées par la différence de prix.</li><li>Une vie simplifiée, souvent mieux adaptée.</li></ul>"
             "<p>C'est souvent un choix de <strong>qualité de vie</strong> autant que financier. À évaluer tout de même : coûts de transaction et de déménagement, et attachement à la maison.</p>"
             + tip("Le downsizing n'est pas qu'une question d'argent. Beaucoup de retraités me disent surtout avoir gagné du temps et de la tranquillité. Pesez le confort de vie autant que le calcul financier.")),
        chap("Générer des revenus ou dégager des liquidités", "Faire travailler son patrimoine immobilier.",
             "<p>Votre propriété peut devenir un levier de revenus à la retraite :</p>"
             "<ul><li><strong>Downsizing + placement</strong> : investir la différence pour un revenu.</li><li><strong>Immeuble à revenus</strong> : générer des loyers (avec la gestion que cela implique).</li><li><strong>Mise en valeur de l'équité</strong> de la résidence (certains prêts adaptés aux aînés) : à examiner avec prudence.</li></ul>"
             "<p>Chaque option a des implications fiscales et de risque : l'objectif est un revenu <em>durable</em>, pas un pari.</p>"
             + tip("Méfiez-vous des solutions « miracle » pour transformer votre maison en argent comptant. Certaines coûtent cher en intérêts à long terme. Faites toujours valider par un conseiller indépendant.")),
        chap("Penser transmission et long terme", "Intégrer l'immobilier à sa planification successorale.",
             "<p>Votre propriété fait partie du <strong>patrimoine</strong> que vous transmettrez. Y réfléchir tôt évite bien des complications à vos proches :</p>"
             "<ul><li><strong>Testament</strong> à jour.</li><li><strong>Fiscalité</strong> de la succession.</li><li><strong>Équité</strong> entre héritiers.</li></ul>"
             "<p>Coordonnez vos décisions immobilières avec votre planification financière et successorale globale, idéalement avec un notaire et un planificateur.</p>"
             + tip("Parlez de vos intentions à vos proches de votre vivant. Une maison qui doit être partagée entre plusieurs enfants est une source classique de conflits — que la clarté prévient facilement.")),
        chap("Rester chez soi : adapter la propriété", "Vieillir à domicile en sécurité.",
             "<p>Tout le monde ne souhaite pas déménager. Rester dans sa propriété peut être un excellent choix, à condition de l'<strong>adapter</strong> :</p>"
             "<ul><li>Réduire les <strong>obstacles</strong> (marches, seuils, baignoire).</li><li>Améliorer <strong>éclairage</strong> et <strong>sécurité</strong> (barres d'appui, antidérapant).</li><li>Prévoir l'<strong>entretien</strong> confié à des services si nécessaire.</li></ul>"
             "<p>Anticiper ces aménagements, c'est prolonger sereinement le plaisir de vivre chez soi.</p>"
             + tip("Les petits aménagements de sécurité coûtent peu et changent tout pour vieillir chez soi. Pensez-y avant d'en avoir besoin : une salle de bain adaptée vaut mieux qu'une chute évitable.")),
        chap("Bâtir sa stratégie de retraite immobilière", "Décider selon sa qualité de vie et sa sécurité.",
             "<p>Il n'y a pas de solution unique : la bonne stratégie est celle qui correspond à VOTRE situation. Une démarche simple :</p>"
             "<ol><li><strong>Clarifier</strong> vos besoins (espace, coûts, revenus, autonomie).</li><li><strong>Estimer</strong> la valeur nette de votre propriété.</li><li><strong>Comparer</strong> les options (downsizing, revenus, rester chez soi).</li><li><strong>Coordonner</strong> avec votre plan financier et successoral.</li></ol>"
             "<p>Décidez avec l'éclairage de professionnels, mais toujours selon vos priorités de vie.</p>"
             + tip("Commencez par la question « comment je veux vivre ma retraite ? », puis faites suivre l'immobilier. La maison est un moyen au service de votre projet de vie, pas l'inverse.")),
    ],
    "qcm": [
        {"q": "Le downsizing consiste à :", "options": ["A) Agrandir sa maison", "B) Passer à une propriété plus petite et moins coûteuse", "C) Acheter un immeuble", "D) Louer un chalet"], "answer": 1, "explanation": "Réduire la taille (chap. 1)."},
        {"q": "Le downsizing peut apporter :", "options": ["A) Plus d'entretien", "B) Moins de coûts et des liquidités", "C) Plus de taxes", "D) Aucun changement"], "answer": 1, "explanation": "Moins de coûts, liquidités (chap. 1)."},
        {"q": "Un immeuble à revenus génère :", "options": ["A) Aucun revenu", "B) Des loyers, avec la gestion que cela implique", "C) Des taxes uniquement", "D) Une assurance"], "answer": 1, "explanation": "Loyers et gestion (chap. 2)."},
        {"q": "Les solutions de mise en valeur de l'équité doivent être :", "options": ["A) Signées sans réfléchir", "B) Examinées avec prudence et conseil", "C) Évitées toujours", "D) Gratuites"], "answer": 1, "explanation": "Prudence et conseil indépendant (chap. 2)."},
        {"q": "La propriété fait partie :", "options": ["A) D'aucun patrimoine", "B) Du patrimoine à transmettre", "C) Des taxes seulement", "D) De l'assurance"], "answer": 1, "explanation": "Patrimoine successoral (chap. 3)."},
        {"q": "Pour éviter les conflits d'héritage, il faut :", "options": ["A) Ne rien dire", "B) Clarifier ses intentions (testament, discussion)", "C) Tout vendre en secret", "D) Attendre"], "answer": 1, "explanation": "Clarté et testament (chap. 3)."},
        {"q": "Rester chez soi demande souvent d'/de :", "options": ["A) Ne rien changer", "B) Adapter la propriété (sécurité, obstacles)", "C) Déménager", "D) Louer"], "answer": 1, "explanation": "Adapter le logement (chap. 4)."},
        {"q": "Les aménagements de sécurité :", "options": ["A) Coûtent une fortune", "B) Coûtent peu et changent beaucoup", "C) Sont inutiles", "D) Sont interdits"], "answer": 1, "explanation": "Peu coûteux, très utiles (chap. 4)."},
        {"q": "La bonne stratégie de retraite immobilière est :", "options": ["A) La même pour tous", "B) Celle alignée sur votre situation et vos priorités", "C) Toujours de vendre", "D) Toujours de garder"], "answer": 1, "explanation": "Adaptée à chacun (chap. 5)."},
        {"q": "L'immobilier, à la retraite, devrait être :", "options": ["A) Le but ultime", "B) Un moyen au service de votre projet de vie", "C) Ignoré", "D) Décidé par les enfants"], "answer": 1, "explanation": "Un moyen, pas une fin (chap. 5)."},
    ],
}

# ===== 47 — Aider son enfant à acheter =====
DATA[47] = {
    "chapters": [
        chap("Le don pour la mise de fonds", "Comprendre la formule la plus simple.",
             "<p>Le don d'une somme pour la mise de fonds est courant et <strong>accepté par les prêteurs</strong>, à condition de fournir une <strong>lettre de don</strong> confirmant qu'il ne s'agit pas d'un prêt remboursable.</p>"
             "<p>C'est simple, mais l'argent donné n'est plus le vôtre. Deux points de vigilance :</p>"
             "<ul><li>Considérer l'<strong>équité</strong> entre vos enfants (si vous en avez plusieurs).</li><li>Réfléchir à l'impact sur vos propres finances de retraite.</li></ul>"
             + tip("Ne videz jamais votre coussin de retraite pour aider un enfant. Un don généreux qui vous fragilise n'aide personne à long terme : aidez à hauteur de ce que vous pouvez vraiment vous permettre.")),
        chap("Le prêt familial", "Prêter plutôt que donner, proprement.",
             "<p>Vous pouvez <strong>prêter</strong> plutôt que donner à votre enfant. Dans ce cas, mettez les modalités <strong>par écrit</strong> : montant, remboursement, intérêt éventuel.</p>"
             "<p>Attention : un prêt à rembourser peut <strong>affecter la capacité d'emprunt</strong> de l'enfant et doit être divulgué au prêteur.</p>"
             "<p>Un prêt familial mal documenté est une source classique de malentendus : la clarté protège la relation.</p>"
             + tip("Mettez le prêt familial sur papier, même entre parent et enfant. Un simple document qui précise « qui doit combien, remboursé comment » évite des années de non-dits et de rancœur.")),
        chap("La cosignature : aider sans donner d'argent", "Comprendre l'engagement réel d'un cosignataire.",
             "<p>En <strong>cosignant</strong> l'hypothèque, vous aidez votre enfant à se qualifier grâce à vos revenus et à votre crédit. Mais l'engagement est réel :</p>"
             "<ul><li>Vous devenez <strong>responsable de la dette</strong>.</li><li>Si l'enfant ne paie pas, le prêteur peut se tourner vers vous.</li><li>Cela apparaît dans votre dossier de crédit et affecte votre propre capacité d'emprunt.</li></ul>"
             "<p>La cosignature n'est pas une simple signature de courtoisie : c'est un engagement financier de plein droit.</p>"
             + tip("Ne cosignez jamais « juste pour aider » sans comprendre que vous vous engagez sur toute la dette. Si l'enfant cesse de payer, c'est vous que la banque appellera. Signez seulement si vous pouvez l'assumer.")),
        chap("Se protéger tout en aidant", "Aider d'une façon qui protège tout le monde.",
             "<p>Aider son enfant est un beau geste — qui mérite d'être <strong>structuré</strong>. Quelques réflexes protègent l'enfant <em>et</em> vous :</p>"
             "<ul><li><strong>Documenter</strong> systématiquement (lettre de don ou contrat de prêt).</li><li>Consulter un <strong>notaire</strong> et un <strong>comptable</strong> sur les implications juridiques et fiscales.</li><li>Prévoir le cas où le couple de l'enfant se sépare (surtout s'il achète à deux).</li></ul>"
             "<p>Ce n'est pas un manque de confiance : c'est protéger la relation familiale.</p>"
             + tip("Si votre enfant achète en couple, pensez à ce qui arrive à votre don en cas de séparation. Une convention entre conjoints peut protéger la somme que vous avez offerte. Le notaire saura vous guider.")),
        chap("Choisir la bonne forme d'aide", "Décider en connaissance de cause.",
             "<p>Don, prêt, cosignature : chaque formule a sa logique. Pour choisir :</p>"
             "<ol><li><strong>Clarifier</strong> la forme d'aide envisagée et votre capacité réelle.</li><li>Évaluer l'<strong>impact</strong> sur vos propres finances.</li><li><strong>Documenter</strong> le tout (lettre de don ou contrat de prêt).</li><li><strong>Consulter</strong> un notaire/comptable avant de vous engager.</li></ol>"
             "<p>La bonne aide, c'est celle qui fait avancer l'enfant sans vous mettre en péril.</p>"
             + tip("Il n'y a pas de « meilleure » formule universelle : tout dépend de votre situation. L'important est de choisir en connaissance de cause, par écrit, plutôt que sur un coup de cœur.")),
    ],
    "qcm": [
        {"q": "Le don pour la mise de fonds exige :", "options": ["A) Rien", "B) Une lettre de don confirmant qu'il n'est pas remboursable", "C) Un notaire uniquement", "D) Un remboursement"], "answer": 1, "explanation": "Lettre de don (chap. 1)."},
        {"q": "En aidant un enfant, il ne faut pas :", "options": ["A) Documenter l'aide", "B) Vider son coussin de retraite", "C) Consulter un pro", "D) Réfléchir à l'équité"], "answer": 1, "explanation": "Aider sans se fragiliser (chap. 1)."},
        {"q": "Un prêt familial doit être :", "options": ["A) Verbal", "B) Mis par écrit (montant, remboursement, intérêt)", "C) Secret", "D) Ignoré du prêteur"], "answer": 1, "explanation": "À documenter (chap. 2)."},
        {"q": "Un prêt à rembourser peut :", "options": ["A) Augmenter la capacité d'emprunt", "B) Affecter la capacité d'emprunt de l'enfant", "C) Réduire les taxes", "D) N'avoir aucun effet"], "answer": 1, "explanation": "Impact sur le financement (chap. 2)."},
        {"q": "Cosigner une hypothèque signifie :", "options": ["A) Une simple courtoisie", "B) Devenir responsable de la dette", "C) Donner de l'argent", "D) Louer"], "answer": 1, "explanation": "Engagement réel (chap. 3)."},
        {"q": "La cosignature apparaît :", "options": ["A) Nulle part", "B) Dans votre dossier de crédit", "C) Sur la maison", "D) À la ville"], "answer": 1, "explanation": "Elle affecte votre crédit (chap. 3)."},
        {"q": "Pour se protéger en aidant, il faut :", "options": ["A) Ne rien écrire", "B) Documenter et consulter notaire/comptable", "C) Payer comptant", "D) Se fier à la parole"], "answer": 1, "explanation": "Structurer l'aide (chap. 4)."},
        {"q": "Si l'enfant achète en couple, penser à :", "options": ["A) Rien", "B) Ce qui arrive au don en cas de séparation", "C) Doubler le don", "D) Cacher l'aide"], "answer": 1, "explanation": "Protéger la somme donnée (chap. 4)."},
        {"q": "Structurer l'aide, c'est :", "options": ["A) Un manque de confiance", "B) Protéger la relation familiale", "C) Inutile", "D) Illégal"], "answer": 1, "explanation": "Protège la famille (chap. 4)."},
        {"q": "La meilleure forme d'aide est :", "options": ["A) Toujours le don", "B) Celle choisie en connaissance de cause, par écrit", "C) Toujours la cosignature", "D) Sur un coup de cœur"], "answer": 1, "explanation": "Décider en connaissance de cause (chap. 5)."},
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


for num, payload in sorted(DATA.items()):
    apply(num, payload)
print('Lot 3 (41-47) terminé.')
