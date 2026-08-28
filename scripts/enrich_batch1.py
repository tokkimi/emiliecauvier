#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichissement lot 1 : guides #35-40.
Amène chaque guide au standard uniforme : Introduction + 5 chapitres de fond
étoffés (avec « Le conseil d'Emilie ») + Plan d'action + Ressources & lexique,
et 10 QCM. Préserve l'Introduction, le Plan d'action et le Lexique existants.
"""
import os, json

BASE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(BASE)
DIR = os.path.join(SITE, 'src', 'data', 'reader')


def tip(text):
    return (f'<aside class="tip"><span class="tip__label">Le conseil d\'Emilie</span>'
            f'<p>{text}</p></aside>')


def chap(title, objective, body):
    html = f'<p class="lede">{objective}</p>\n{body}'
    return {"title": title, "objective": objective, "html": html}


# ---------------------------------------------------------------------------
# Contenu authored par guide : les 5 chapitres de fond + 10 QCM.
# ---------------------------------------------------------------------------
DATA = {}

# ===== 35 — Comprendre la Loi sur le courtage =====
DATA[35] = {
    "chapters": [
        chap("L'OACIQ et sa mission", "Savoir qui protège le public.",
             "<p>L'Organisme d'autoréglementation du courtage immobilier du Québec (OACIQ) encadre l'ensemble des courtiers de la province : délivrance et renouvellement des permis, formation obligatoire, déontologie, inspection et traitement des plaintes.</p>"
             "<p>Sa mission première n'est pas de défendre les courtiers, mais de <strong>protéger le public</strong>. Faire affaire avec un courtier titulaire d'un permis valide, c'est bénéficier de tout cet encadrement — et de mécanismes de recours si quelque chose tourne mal.</p>"
             "<ul><li>Registre public : le permis de chaque courtier est vérifiable en ligne.</li><li>Formation continue obligatoire pour rester à jour.</li><li>Code de déontologie encadrant la conduite professionnelle.</li></ul>"
             + tip("Avant de signer quoi que ce soit, tapez le nom de votre courtier dans le registre de l'OACIQ. Trente secondes qui confirment que la personne est bel et bien autorisée à vous représenter.")),
        chap("Vos protections comme consommateur", "Connaître les mécanismes qui vous protègent.",
             "<p>La loi met en place plusieurs filets de sécurité, que vous soyez acheteur ou vendeur :</p>"
             "<ul><li><strong>Formulaires normalisés</strong> : contrats et déclarations encadrés, les mêmes pour tous.</li><li><strong>Devoir d'information et de vérification</strong> du courtier.</li><li><strong>Fidéicommis</strong> : les acomptes sont détenus dans un compte protégé, distinct des fonds du courtier.</li><li><strong>Fonds d'indemnisation et assurance</strong> en cas de faute professionnelle.</li></ul>"
             "<p>Ces protections encadrent le comportement du courtier tout au long de la transaction, du premier rendez-vous jusqu'à la signature chez le notaire.</p>"
             + tip("Vos protections ne dépendent pas de votre habileté à négocier : elles sont prévues par la loi. Mais elles ne jouent pleinement que si vous passez par un courtier titulaire d'un permis.")),
        chap("Les contrats normalisés d'une transaction", "Comprendre les documents encadrés.",
             "<p>Une transaction encadrée s'appuie sur des contrats normalisés, conçus pour être équitables et clairs :</p>"
             "<ul><li><strong>Contrat de courtage</strong> (vendeur ou acheteur) : définit le mandat et les honoraires.</li><li><strong>Promesse d'achat</strong> : l'offre et ses conditions.</li><li><strong>Déclarations du vendeur</strong> : ce qu'il sait de la propriété.</li></ul>"
             "<p>Le courtier doit vérifier certaines informations et vous conseiller avant que vous ne signiez. Lire et comprendre ces documents n'est pas une formalité : c'est un droit — et une bonne habitude.</p>"
             + tip("Un bon courtier ne vous fait jamais signer « en vitesse ». Il prend le temps de vous expliquer chaque clause. Si vous ne comprenez pas un passage, demandez — c'est exactement son rôle.")),
        chap("Les devoirs du courtier envers vous", "Savoir ce que la loi exige de lui.",
             "<p>Au-delà des formulaires, le courtier est tenu à des <strong>obligations professionnelles</strong> précises. Les connaître vous aide à reconnaître un bon accompagnement — et à réagir si quelque chose cloche.</p>"
             "<ul><li><strong>Devoir de conseil</strong> : vous informer objectivement, même quand la vérité déplaît.</li><li><strong>Vérification</strong> : valider les renseignements avant de les diffuser.</li><li><strong>Divulgation</strong> : révéler tout facteur pouvant affecter votre décision (y compris un conflit d'intérêts).</li><li><strong>Traitement équitable</strong> des parties à la transaction.</li></ul>"
             "<p>Ces devoirs existent que le courtier vous représente directement ou non : la loi protège l'ensemble du public.</p>"
             + tip("Méfiez-vous d'un courtier qui vous pousse à décider vite ou qui minimise un défaut. Le devoir de conseil, c'est justement de vous dire ce que vous avez besoin d'entendre, pas seulement ce qui fait plaisir.")),
        chap("En cas de problème : vos recours", "Connaître les voies de recours.",
             "<p>Si un différend survient, vous n'êtes pas seul. Plusieurs recours existent, gradués selon la gravité :</p>"
             "<ol><li><strong>En parler d'abord</strong> au courtier et à son agence : bien des malentendus se règlent là.</li><li><strong>Assistance de l'OACIQ</strong> : information et accompagnement pour le public.</li><li><strong>Plainte formelle</strong> au syndic en cas de manquement déontologique.</li><li><strong>Indemnisation</strong> possible via le fonds prévu en cas de fraude ou de faute grave.</li></ol>"
             "<p>Conservez tous vos documents et vos échanges écrits : ils sont précieux si vous devez faire valoir vos droits.</p>"
             + tip("Gardez une trace écrite de tout : courriels, formulaires signés, notes de rendez-vous. En cas de litige, ce sont ces documents qui font la différence, pas les souvenirs.")),
    ],
    "qcm": [
        {"q": "La mission première de l'OACIQ est de :", "options": ["A) Défendre les courtiers", "B) Protéger le public", "C) Fixer les prix", "D) Vendre des maisons"], "answer": 1, "explanation": "L'OACIQ protège le public (chap. 1)."},
        {"q": "Avant de signer, on devrait :", "options": ["A) Ignorer le permis", "B) Vérifier le permis du courtier au registre de l'OACIQ", "C) Signer sans lire", "D) Payer comptant"], "answer": 1, "explanation": "Le permis se vérifie en ligne (chap. 1)."},
        {"q": "Les acomptes sont détenus :", "options": ["A) Par le vendeur", "B) En fidéicommis, dans un compte protégé", "C) Par la ville", "D) Chez le courtier, mêlés à ses fonds"], "answer": 1, "explanation": "Le fidéicommis protège les sommes (chap. 2)."},
        {"q": "Les contrats de la transaction sont :", "options": ["A) Improvisés", "B) Normalisés et encadrés", "C) Secrets", "D) Facultatifs"], "answer": 1, "explanation": "Formulaires normalisés (chap. 3)."},
        {"q": "Lire les documents avant de signer est :", "options": ["A) Une perte de temps", "B) Un droit et une bonne habitude", "C) Interdit", "D) Réservé au notaire"], "answer": 1, "explanation": "C'est un droit (chap. 3)."},
        {"q": "Le devoir de conseil oblige le courtier à :", "options": ["A) Ne dire que ce qui plaît", "B) Vous informer objectivement, même quand ça déplaît", "C) Cacher les défauts", "D) Décider à votre place"], "answer": 1, "explanation": "Conseil objectif (chap. 4)."},
        {"q": "Un conflit d'intérêts doit être :", "options": ["A) Caché", "B) Divulgué", "C) Ignoré", "D) Facturé"], "answer": 1, "explanation": "Devoir de divulgation (chap. 4)."},
        {"q": "En cas de différend, la première étape est souvent :", "options": ["A) Poursuivre immédiatement", "B) En parler au courtier et à son agence", "C) Abandonner", "D) Changer de province"], "answer": 1, "explanation": "Beaucoup se règle par le dialogue (chap. 5)."},
        {"q": "Une plainte déontologique se dépose :", "options": ["A) À la banque", "B) Au syndic de l'OACIQ", "C) À la ville", "D) Au notaire"], "answer": 1, "explanation": "Le syndic traite les manquements (chap. 5)."},
        {"q": "Pour faire valoir ses droits, il faut surtout :", "options": ["A) Se fier à sa mémoire", "B) Conserver documents et échanges écrits", "C) Ne rien garder", "D) Attendre"], "answer": 1, "explanation": "Les écrits font la preuve (chap. 5)."},
    ],
}

# ===== 36 — Le rôle du notaire =====
DATA[36] = {
    "chapters": [
        chap("Un officier public impartial", "Comprendre sa position particulière.",
             "<p>Le notaire est un <strong>officier public</strong> : il agit avec impartialité pour donner à l'acte de vente sa force officielle. Il vérifie, rédige, authentifie et conserve les actes.</p>"
             "<p>Son rôle est de sécuriser la transaction pour <em>toutes</em> les parties, pas d'en défendre une seule. Dans un achat, c'est habituellement l'acheteur qui choisit le notaire — souvent parce que c'est lui (ou son prêteur) qui en assume les frais.</p>"
             "<ul><li>Impartialité : il ne prend pas parti.</li><li>Force authentique : l'acte qu'il reçoit fait preuve.</li><li>Conservation : il garde l'original (la minute).</li></ul>"
             + tip("Le notaire n'est pas « votre avocat ». Il protège la validité de la vente pour tout le monde. Si un enjeu vous oppose au vendeur, c'est un conseiller à vous qu'il vous faut, pas le notaire.")),
        chap("Ce que le notaire vérifie et prépare", "Connaître le travail derrière la signature.",
             "<p>L'essentiel du travail du notaire se fait <strong>avant</strong> le jour de la signature :</p>"
             "<ul><li><strong>Examen des titres</strong> : confirmer que le vendeur est bien propriétaire, sans charge cachée (hypothèque, saisie).</li><li>Analyse du <strong>certificat de localisation</strong> et des servitudes.</li><li>Rédaction de l'<strong>acte de vente</strong> et de l'acte hypothécaire.</li><li>Réception et redistribution des <strong>fonds</strong> (remboursement de l'ancienne hypothèque, versement au vendeur).</li><li><strong>Publication</strong> de la vente au Registre foncier.</li></ul>"
             "<p>C'est ce travail minutieux qui vous évite de mauvaises surprises après l'achat.</p>"
             + tip("Fournissez vos documents au notaire le plus tôt possible. Un dossier complet et transmis à temps, c'est une signature sans stress et parfois quelques jours gagnés.")),
        chap("La signature et les frais", "Savoir à quoi s'attendre le jour J.",
             "<p>Le jour de la signature, le notaire vous explique l'acte, répond à vos questions, recueille les signatures et procède aux versements. C'est aussi le moment où vous recevez les clés (selon la date de possession convenue).</p>"
             "<p>Côté budget, prévoyez dans vos frais de clôture :</p>"
             "<ul><li>Les <strong>honoraires</strong> du notaire.</li><li>Les <strong>débours</strong> : frais de publication, copies, recherches.</li></ul>"
             "<p>Rappel utile : la <strong>taxe de bienvenue</strong> ne se paie pas chez le notaire — elle fait l'objet d'une facture municipale envoyée quelques semaines ou mois plus tard.</p>"
             + tip("Demandez au notaire une estimation écrite des frais dès le départ. Vous éviterez la surprise du « combien je dois apporter » la veille de la signature.")),
        chap("Choisir et bien préparer son notaire", "Aborder la signature l'esprit tranquille.",
             "<p>Le choix du notaire est souvent laissé à l'acheteur. Quelques repères pour bien décider :</p>"
             "<ul><li>Une <strong>recommandation</strong> de votre courtière ou de votre prêteur est un bon point de départ.</li><li>Vérifiez sa <strong>disponibilité</strong> par rapport à votre date de clôture.</li><li>Assurez-vous qu'il <strong>répond à vos questions</strong> clairement.</li></ul>"
             "<p>Préparez de votre côté : pièces d'identité valides, coordonnées bancaires, preuve d'assurance habitation en vigueur pour la date de possession. Un dossier prêt accélère tout.</p>"
             + tip("Contactez le notaire dès que la promesse d'achat est acceptée, pas la semaine d'avant. Les bons notaires sont occupés, et une signature se planifie plusieurs semaines à l'avance.")),
        chap("Après la signature : ce qui reste", "Comprendre les suites de la vente.",
             "<p>La signature n'est pas tout à fait la fin. Le notaire complète encore quelques étapes :</p>"
             "<ul><li><strong>Publication</strong> officielle de la vente et de l'hypothèque au Registre foncier.</li><li><strong>Radiation</strong> de l'ancienne hypothèque du vendeur.</li><li>Envoi des <strong>copies</strong> de l'acte aux parties.</li></ul>"
             "<p>De votre côté, conservez précieusement votre copie de l'acte de vente : elle vous servira pour vos taxes, une future revente, ou toute question sur la propriété.</p>"
             + tip("Rangez votre acte de vente et votre certificat de localisation dans un endroit sûr. Le jour où vous revendrez, ces documents vous feront gagner un temps précieux.")),
    ],
    "qcm": [
        {"q": "Au Québec, une vente d'immeuble se conclut :", "options": ["A) Sans notaire", "B) Obligatoirement devant notaire", "C) À la banque seulement", "D) Par courriel"], "answer": 1, "explanation": "Le notaire est incontournable (intro)."},
        {"q": "Le notaire agit :", "options": ["A) Pour le vendeur seul", "B) Avec impartialité, pour toutes les parties", "C) Pour la ville", "D) Pour la banque seulement"], "answer": 1, "explanation": "Officier public impartial (chap. 1)."},
        {"q": "L'examen des titres sert à :", "options": ["A) Décorer l'acte", "B) Confirmer la propriété et détecter les charges cachées", "C) Fixer le prix", "D) Payer les taxes"], "answer": 1, "explanation": "Vérification de la propriété (chap. 2)."},
        {"q": "La vente est ensuite publiée :", "options": ["A) Au journal", "B) Au Registre foncier", "C) À l'OACIQ", "D) Nulle part"], "answer": 1, "explanation": "Publication au Registre foncier (chap. 2 et 5)."},
        {"q": "Les débours du notaire sont :", "options": ["A) Ses honoraires", "B) Les frais de publication, copies et recherches", "C) La taxe de bienvenue", "D) L'assurance"], "answer": 1, "explanation": "Débours distincts des honoraires (chap. 3)."},
        {"q": "La taxe de bienvenue se paie :", "options": ["A) Chez le notaire", "B) Plus tard, par facture municipale", "C) Jamais", "D) À la banque"], "answer": 1, "explanation": "Facture municipale ultérieure (chap. 3)."},
        {"q": "Le choix du notaire revient souvent :", "options": ["A) Au vendeur", "B) À l'acheteur", "C) À la ville", "D) Au voisin"], "answer": 1, "explanation": "L'acheteur choisit habituellement (chap. 1 et 4)."},
        {"q": "Pour une signature sans stress, il faut :", "options": ["A) Attendre la veille", "B) Contacter le notaire dès la promesse acceptée", "C) Ne rien préparer", "D) Choisir au hasard"], "answer": 1, "explanation": "Anticiper (chap. 4)."},
        {"q": "Après la vente, le notaire :", "options": ["A) Oublie le dossier", "B) Publie la vente et radie l'ancienne hypothèque", "C) Revend la maison", "D) Fixe les taxes"], "answer": 1, "explanation": "Suites de la vente (chap. 5)."},
        {"q": "Votre copie de l'acte de vente :", "options": ["A) Est inutile", "B) Se conserve précieusement pour l'avenir", "C) Se jette", "D) Appartient à la banque"], "answer": 1, "explanation": "À garder pour taxes et revente (chap. 5)."},
    ],
}

# ===== 37 — Hypothèque : fixe ou variable ? =====
DATA[37] = {
    "chapters": [
        chap("Taux fixe vs taux variable", "Comprendre le principal arbitrage.",
             "<p>C'est le grand choix de tout emprunteur, et il tient à votre tolérance au risque :</p>"
             "<ul><li><strong>Taux fixe</strong> : identique pour toute la durée du terme. Versements prévisibles, tranquillité d'esprit, mais souvent un taux de départ un peu plus élevé.</li><li><strong>Taux variable</strong> : suit les fluctuations du marché. Peut coûter moins cher si les taux baissent ou restent bas, mais expose à des hausses de versements ou d'intérêts.</li></ul>"
             "<p>En résumé : le fixe achète de la <em>prévisibilité</em>, le variable parie sur le <em>marché</em>. Aucun n'est « meilleur » dans l'absolu.</p>"
             + tip("Posez-vous une question simple : une hausse de versement de 150 à 300 $ par mois vous ferait-elle mal dormir ? Si oui, le fixe vaut souvent son léger surcoût pour la paix d'esprit.")),
        chap("Le terme et l'amortissement", "Distinguer deux notions souvent confondues.",
             "<p>Ces deux mots se ressemblent mais désignent des choses très différentes :</p>"
             "<ul><li><strong>Amortissement</strong> : la durée <em>totale</em> pour rembourser le prêt (souvent 25 ans).</li><li><strong>Terme</strong> : la durée du <em>contrat actuel</em> (souvent 5 ans), au bout duquel vous renouvelez à de nouvelles conditions.</li></ul>"
             "<p>Un amortissement plus long réduit le versement mensuel, mais augmente les intérêts payés au total. À chaque fin de terme, vous renégociez : c'est un moment clé pour ajuster votre stratégie.</p>"
             + tip("Ne subissez pas votre renouvellement de terme. Deux ou trois mois avant l'échéance, magasinez et faites jouer la concurrence : c'est souvent là qu'on économise le plus, sans changer de maison.")),
        chap("Les clauses qui comptent", "Regarder au-delà du taux.",
             "<p>Le taux affiché n'est que la partie visible. Ces clauses peuvent coûter — ou rapporter — gros :</p>"
             "<ul><li><strong>Pénalités de remboursement anticipé</strong> : parfois très élevées si votre vie change (déménagement, séparation).</li><li><strong>Remboursement accéléré</strong> : versements supplémentaires permis, pour payer plus vite.</li><li><strong>Portabilité</strong> : transférer le prêt à une autre propriété.</li><li><strong>Prêt ouvert vs fermé</strong> : flexibilité contre taux.</li></ul>"
             "<p>Le taux le plus bas n'est pas toujours le meilleur prêt : une clause rigide peut coûter cher au mauvais moment.</p>"
             + tip("Avant de signer pour un taux « imbattable », demandez comment se calcule la pénalité de remboursement. Chez certains prêteurs, elle peut représenter plusieurs milliers de dollars.")),
        chap("Bien s'entourer pour financer", "Choisir le bon interlocuteur.",
             "<p>Vous n'avez pas à magasiner seul. Deux grandes voies :</p>"
             "<ul><li><strong>Votre institution financière</strong> : simple si vous y êtes déjà client, mais une seule gamme de produits.</li><li><strong>Le courtier hypothécaire</strong> : compare plusieurs prêteurs pour vous, souvent sans frais pour l'emprunteur.</li></ul>"
             "<p>Dans les deux cas, comparez le taux <em>et</em> les conditions. Une préapprobation vous donne un montant confirmé et un taux garanti pour magasiner l'esprit tranquille.</p>"
             + tip("Un bon courtier hypothécaire ne vous coûte généralement rien et peut dénicher des conditions que votre banque ne vous offrira pas spontanément. Ça vaut au moins une conversation.")),
        chap("Adapter son prêt à sa vie", "Choisir selon sa situation réelle.",
             "<p>Le « bon » prêt dépend moins des manchettes économiques que de <strong>votre</strong> réalité :</p>"
             "<ul><li><strong>Stabilité d'emploi et de revenus</strong> : plus elle est solide, plus le variable est envisageable.</li><li><strong>Horizon</strong> : comptez-vous garder la propriété longtemps ?</li><li><strong>Coussin financier</strong> : pourriez-vous absorber une hausse de versement ?</li><li><strong>Projets</strong> : agrandissement de la famille, changement de carrière, revente probable.</li></ul>"
             "<p>Un choix aligné sur votre vie vaut mieux qu'un taux parfait sur papier mais inconfortable au quotidien.</p>"
             + tip("Il n'y a pas de honte à choisir le fixe même quand « tout le monde » dit que le variable est gagnant. Le meilleur prêt est celui qui vous laisse dormir tranquille.")),
    ],
    "qcm": [
        {"q": "Le taux fixe offre surtout :", "options": ["A) Le risque maximal", "B) La prévisibilité des versements", "C) Aucun intérêt", "D) Des taxes réduites"], "answer": 1, "explanation": "Prévisibilité et sécurité (chap. 1)."},
        {"q": "Le taux variable :", "options": ["A) Ne change jamais", "B) Suit le marché, avec potentiel d'économie et de risque", "C) Est interdit", "D) Est toujours plus cher"], "answer": 1, "explanation": "Il suit le marché (chap. 1)."},
        {"q": "L'amortissement est :", "options": ["A) La durée du contrat actuel", "B) La durée totale de remboursement", "C) Une pénalité", "D) Un taux"], "answer": 1, "explanation": "Durée totale, souvent 25 ans (chap. 2)."},
        {"q": "Le terme est :", "options": ["A) La durée totale du prêt", "B) La durée du contrat actuel (souvent 5 ans)", "C) L'assurance", "D) Le prix de la maison"], "answer": 1, "explanation": "Durée du contrat en cours (chap. 2)."},
        {"q": "La fin de terme est un bon moment pour :", "options": ["A) Ne rien faire", "B) Remagasiner et faire jouer la concurrence", "C) Vendre obligatoirement", "D) Payer une amende"], "answer": 1, "explanation": "On renégocie à chaque terme (chap. 2)."},
        {"q": "Une pénalité de remboursement anticipé peut être :", "options": ["A) Nulle en tout temps", "B) Élevée si votre vie change", "C) Un cadeau", "D) Interdite"], "answer": 1, "explanation": "Elle peut coûter cher (chap. 3)."},
        {"q": "Le taux le plus bas :", "options": ["A) Est toujours le meilleur prêt", "B) N'est pas toujours le meilleur prêt", "C) N'existe pas", "D) Est illégal"], "answer": 1, "explanation": "Les conditions comptent aussi (chap. 3)."},
        {"q": "Un courtier hypothécaire :", "options": ["A) Coûte toujours cher à l'emprunteur", "B) Compare plusieurs prêteurs, souvent sans frais pour l'emprunteur", "C) Vend des maisons", "D) Fixe les taxes"], "answer": 1, "explanation": "Il magasine pour vous (chap. 4)."},
        {"q": "La préapprobation donne :", "options": ["A) Une maison gratuite", "B) Un montant confirmé et un taux garanti pour magasiner", "C) Une pénalité", "D) Rien"], "answer": 1, "explanation": "Elle sécurise votre recherche (chap. 4)."},
        {"q": "Le meilleur prêt est surtout celui qui :", "options": ["A) Impressionne les voisins", "B) Est aligné sur votre situation réelle", "C) A le plus de clauses", "D) Dure le plus longtemps"], "answer": 1, "explanation": "Adapté à votre vie (chap. 5)."},
    ],
}


def apply(num, payload):
    path = os.path.join(DIR, f'{num}.json')
    d = json.load(open(path, encoding='utf-8'))
    old = d['chapters']
    intro = old[0]
    # Les deux derniers chapitres sont Plan d'action puis Ressources & lexique.
    plan, lex = old[-2], old[-1]
    d['chapters'] = [intro] + payload['chapters'] + [plan, lex]
    d['qcm'] = payload['qcm']
    json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    core = payload['chapters']
    avg = sum(len(c['html']) for c in core) // len(core)
    print(f'#{num}: {len(d["chapters"])} chap ({len(core)} fond, ~{avg} car./chap), {len(d["qcm"])} QCM')


for num, payload in DATA.items():
    apply(num, payload)
print('Lot 1 (35-37) terminé.')
