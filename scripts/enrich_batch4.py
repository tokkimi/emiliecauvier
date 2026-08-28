#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichissement lot 4 : guides #9-22.
Ajoute un 5e chapitre de fond (complémentaire) avant le Plan d'action, pour
atteindre le standard de 5 chapitres. Les QCM sont déjà à 8 (dans la norme)."""
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


NEW = {}

NEW[9] = chap("Anticiper l'entretien selon l'âge", "Budgéter au-delà du prix d'achat.",
    "<p>Neuf ou ancien, chaque propriété a son profil de dépenses. Le prix d'achat n'est que le début :</p>"
    "<ul><li><strong>Neuf</strong> : peu d'entretien les premières années, mais parfois des frais de finition (aménagement, clôture, terrassement).</li><li><strong>Ancien</strong> : du charme et un prix souvent plus bas, mais des composantes à surveiller (toiture, fenêtres, plomberie, électricité).</li></ul>"
    "<p>Prévoyez un <strong>fonds d'entretien</strong> annuel : une règle courante consiste à mettre de côté un petit pourcentage de la valeur chaque année pour les imprévus.</p>"
    + tip("Demandez toujours l'âge des composantes majeures : toiture, chauffage, fenêtres. Une maison « pas chère » avec une toiture en fin de vie peut coûter plus qu'un neuf bien fini. Le vrai prix, c'est prix + entretien."))

NEW[10] = chap("Au-delà de la mise de fonds : le comptant nécessaire", "Prévoir tout l'argent requis à l'achat.",
    "<p>La mise de fonds n'est pas la seule somme à réunir. Le jour de la transaction, d'autres montants sont exigés :</p>"
    "<ul><li><strong>Frais de notaire</strong> et débours.</li><li><strong>Taxe de bienvenue</strong> (facturée peu après l'achat).</li><li><strong>Ajustements</strong> (taxes payées d'avance par le vendeur).</li><li><strong>Frais de démarrage</strong> et petit coussin d'urgence.</li></ul>"
    "<p>Vider ses comptes pour maximiser la mise de fonds, c'est risquer de se retrouver sans marge dès le premier mois.</p>"
    + tip("Gardez toujours un coussin après l'achat. Une propriété réserve son lot de petites surprises les premiers mois : mieux vaut une mise de fonds un peu plus modeste et un compte qui respire."))

NEW[11] = chap("Tester un quartier avant de s'engager", "Valider sur le terrain, pas juste sur papier.",
    "<p>Un quartier ne se juge pas seulement aux statistiques. Avant d'acheter, allez le <strong>vivre</strong> un peu :</p>"
    "<ul><li>Visiter à <strong>différentes heures</strong> (matin, soir, fin de semaine).</li><li>Tester le <strong>trajet</strong> vers le travail ou l'école aux heures de pointe.</li><li>Repérer <strong>commerces, transport, parcs</strong> et services du quotidien.</li><li>Observer l'<strong>ambiance</strong> et l'entretien des propriétés voisines.</li></ul>"
    "<p>Ces vérifications concrètes révèlent ce qu'aucune fiche descriptive ne dit.</p>"
    + tip("Faites le trajet maison-travail à l'heure de pointe avant d'acheter, pas le dimanche à midi. Vingt minutes le dimanche peuvent devenir cinquante un mardi. On achète aussi un quotidien, pas juste une adresse."))

NEW[12] = chap("Le parc immobilier montréalais : plex et condos", "Comprendre les types de propriétés typiques.",
    "<p>Montréal a un parc immobilier particulier, marqué par les <strong>plex</strong> (duplex, triplex) et les <strong>condos</strong>, plus que par la maison unifamiliale.</p>"
    "<ul><li><strong>Plex</strong> : possibilité d'habiter un logement et d'en louer d'autres, mais gestion de locataires et règles locatives à connaître.</li><li><strong>Condo</strong> : entrée de gamme plus accessible en ville, mais charges et vie de copropriété.</li><li><strong>Unifamiliale</strong> : plus rare et plus chère dans les secteurs centraux.</li></ul>"
    "<p>Le bon choix dépend de votre budget, de votre tolérance à la gestion et de votre mode de vie.</p>"
    + tip("À Montréal, un plex peut être un formidable tremplin : vous habitez sur place et les loyers allègent votre hypothèque. Mais vous devenez propriétaire-bailleur : renseignez-vous sur vos obligations avant de vous lancer."))

NEW[13] = chap("Après l'achat : les coûts récurrents", "Prévoir le coût réel de la propriété.",
    "<p>Les frais d'achat sont ponctuels ; posséder une propriété, c'est aussi des <strong>coûts récurrents</strong> à intégrer à son budget mensuel :</p>"
    "<ul><li><strong>Taxes</strong> municipales et scolaires.</li><li><strong>Assurance habitation</strong>.</li><li><strong>Énergie</strong> (chauffage, électricité).</li><li><strong>Entretien</strong> courant et charges de copropriété, le cas échéant.</li></ul>"
    "<p>Un achat « abordable » à l'entrée peut devenir lourd si ces coûts récurrents sont sous-estimés.</p>"
    + tip("Additionnez tous les coûts mensuels réels, pas seulement l'hypothèque, avant de vous engager. C'est ce total-là qui déterminera si vous vivez confortablement ou serré dans votre nouvelle propriété."))

NEW[14] = chap("Détecter ces risques et se protéger", "Vérifier avant d'acheter.",
    "<p>Ces problèmes de sol et de bâti se gèrent bien… quand on les détecte à temps. Vos protections à l'achat :</p>"
    "<ul><li><strong>Inspection préachat</strong> par un professionnel attentif à ces enjeux régionaux.</li><li><strong>Tests spécialisés</strong> au besoin (pyrite, pyrrhotite, sol).</li><li><strong>Questions au vendeur</strong> et lecture attentive de sa déclaration.</li><li><strong>Historique</strong> des travaux et réparations.</li></ul>"
    "<p>Une condition d'inspection dans votre promesse d'achat vous laisse le temps de valider tout cela.</p>"
    + tip("Ajoutez toujours une condition d'inspection à votre offre, surtout dans les secteurs connus pour ces enjeux. Quelques centaines de dollars d'expertise peuvent vous éviter des dizaines de milliers en réparations."))

NEW[15] = chap("Les erreurs de vente à éviter", "Ne pas saboter sa propre vente.",
    "<p>Certaines erreurs, très courantes, coûtent cher au vendeur :</p>"
    "<ul><li><strong>Surévaluer</strong> le prix de départ : la propriété stagne et se « brûle ».</li><li>Négliger la <strong>préparation</strong> et les photos.</li><li>Rendre les <strong>visites</strong> difficiles à organiser.</li><li>Réagir à l'<strong>émotion</strong> plutôt qu'aux faits en négociation.</li></ul>"
    "<p>La bonne nouvelle : ces erreurs sont toutes évitables avec un peu de méthode et de recul.</p>"
    + tip("Les premières semaines sur le marché sont les plus précieuses : c'est là que l'intérêt est maximal. Un prix trop haut au départ gaspille ce momentum, et une propriété qui traîne finit souvent par se vendre moins cher."))

NEW[16] = chap("Grand effet, petit budget", "Maximiser l'impact sans se ruiner.",
    "<p>Le home staging n'exige pas de gros travaux. Les gestes les plus rentables sont souvent les moins coûteux :</p>"
    "<ul><li><strong>Désencombrer</strong> et dépersonnaliser : gratuit, et transformateur.</li><li><strong>Nettoyer</strong> en profondeur : une maison impeccable paraît mieux entretenue.</li><li><strong>Peinture</strong> fraîche dans des tons neutres.</li><li><strong>Lumière</strong> : ampoules plus vives, rideaux ouverts.</li><li>Réparer les <strong>petits défauts</strong> visibles (poignées, joints, robinets).</li></ul>"
    "<p>Quelques centaines de dollars bien placés peuvent accélérer la vente et améliorer les offres.</p>"
    + tip("Si vous ne faites qu'une chose, désencombrez. Une maison épurée paraît plus grande, plus lumineuse et mieux entretenue — et ça ne coûte rien d'autre que du temps."))

NEW[17] = chap("Pourquoi surévaluer coûte cher", "Comprendre le risque d'un prix trop élevé.",
    "<p>On croit souvent qu'un prix de départ élevé « laisse de la marge pour négocier ». En réalité, c'est risqué :</p>"
    "<ul><li>La propriété attire moins de visites dès le départ.</li><li>Elle accumule des <strong>jours sur le marché</strong>, ce qui inquiète les acheteurs.</li><li>Elle sert à <strong>vendre les autres</strong> (la vôtre fait bien paraître la voisine mieux prix).</li><li>Les baisses successives envoient un signal de faiblesse.</li></ul>"
    "<p>Un prix juste dès le départ génère plus d'intérêt — et souvent un meilleur prix final.</p>"
    + tip("Le marché « répond » surtout dans les deux ou trois premières semaines. Mieux vaut un prix juste qui crée de l'engouement qu'un prix gonflé qui fait fuir et qu'on devra baisser plus tard."))

NEW[18] = chap("Vendre seul : les précautions essentielles", "Réduire les risques si vous vous passez de courtier.",
    "<p>Vendre soi-même est possible, mais certaines étapes demandent de la rigueur pour éviter les ennuis :</p>"
    "<ul><li>Fixer un <strong>prix réaliste</strong> à partir de vraies ventes comparables.</li><li>Rédiger correctement la <strong>déclaration du vendeur</strong>.</li><li>Utiliser des <strong>documents conformes</strong> pour la promesse d'achat.</li><li>Filtrer les visiteurs et penser à votre <strong>sécurité</strong>.</li><li>Faire valider l'aspect juridique par un <strong>notaire</strong>.</li></ul>"
    "<p>Ce que vous économisez en commission, vous le payez en temps, en risque et en responsabilité : à évaluer honnêtement.</p>"
    + tip("Si vous vendez seul, faites au minimum encadrer la promesse d'achat et la déclaration du vendeur par un professionnel. Une clause mal rédigée ou une omission peut coûter bien plus cher qu'une commission."))

NEW[19] = chap("Remplir sa déclaration honnêtement", "Déclarer ce qu'on sait, correctement.",
    "<p>La déclaration du vendeur est un document clé : elle consigne ce que vous <strong>savez</strong> de la propriété. La règle d'or : la <strong>transparence</strong>.</p>"
    "<ul><li>Mentionner les <strong>problèmes connus</strong>, passés et présents (infiltrations, réparations, sinistres).</li><li>Ne pas <strong>dissimuler</strong> un vice connu : c'est la source numéro un de poursuites.</li><li>En cas de doute, l'<strong>écrire</strong> plutôt que le taire.</li><li>Conserver les <strong>preuves</strong> des travaux effectués.</li></ul>"
    "<p>Une déclaration honnête et complète est votre meilleure protection contre un litige après la vente.</p>"
    + tip("Dans le doute, déclarez. Taire un problème que vous connaissez pour « ne pas nuire à la vente » est exactement ce qui mène aux poursuites coûteuses. La transparence protège le vendeur autant que l'acheteur."))

NEW[20] = chap("À qui s'adresse votre condo ?", "Adapter la vente à l'acheteur type.",
    "<p>Un condo ne se vend pas à « tout le monde ». Identifier votre <strong>acheteur type</strong> aide à mieux le présenter :</p>"
    "<ul><li><strong>Premier acheteur</strong> : sensible au prix, aux charges et à la proximité des services.</li><li><strong>Downsizer</strong> (retraité) : cherche confort, tranquillité et peu d'entretien.</li><li><strong>Investisseur</strong> : regarde le rendement, la location permise et les charges.</li></ul>"
    "<p>Mettez en avant les arguments qui parlent à votre acheteur le plus probable : localisation, mode de vie, ou rentabilité.</p>"
    + tip("Adaptez votre mise en marché à l'acheteur le plus probable de VOTRE condo. Un 3½ près du métro se vend à un premier acheteur ; un grand condo tranquille séduit un retraité. Le même bien, deux discours."))

NEW[21] = chap("Avant la caméra : préparer les lieux", "Des photos réussies commencent par la préparation.",
    "<p>Les meilleures photos ne rattrapent pas une propriété mal préparée. Avant la séance :</p>"
    "<ul><li><strong>Désencombrer</strong> et ranger chaque pièce.</li><li><strong>Nettoyer</strong> à fond (surfaces, vitres, planchers).</li><li>Maximiser la <strong>lumière</strong> : rideaux ouverts, ampoules allumées.</li><li>Ranger objets <strong>personnels</strong> et signes du quotidien (vaisselle, produits).</li><li>Soigner l'<strong>extérieur</strong> et l'entrée pour la première photo.</li></ul>"
    "<p>Une propriété impeccable donne des images qui donnent envie de visiter — et c'est tout l'objectif.</p>"
    + tip("Traitez la journée photo comme une visite d'acheteur exigeant : tout doit être rangé, propre et lumineux. Les photos sont votre première impression en ligne, et il n'y en a qu'une."))

NEW[22] = chap("Côté acheteur : sortir du lot sans surpayer", "Faire une offre gagnante et raisonnable.",
    "<p>Face à des offres multiples, l'acheteur peut se démarquer sans nécessairement offrir le plus gros montant :</p>"
    "<ul><li>Arriver <strong>préapprouvé</strong> et prêt à agir.</li><li>Proposer des <strong>conditions et délais</strong> attrayants pour le vendeur (dates flexibles).</li><li>Offrir un <strong>prix réfléchi</strong>, fondé sur les comparables, pas sur l'émotion.</li><li>Se fixer une <strong>limite</strong> ferme à l'avance.</li></ul>"
    "<p>Une offre solide et sérieuse rassure souvent autant qu'un dollar de plus — et vous protège du regret d'avoir surpayé.</p>"
    + tip("Fixez votre prix maximum AVANT d'entrer en surenchère, et tenez-vous-y. Perdre une propriété fait mal une semaine ; surpayer de 30 000 $ fait mal pendant des années. La discipline paie."))


def apply(num, chapter, add_qcm=None):
    path = os.path.join(DIR, f'{num}.json')
    d = json.load(open(path, encoding='utf-8'))
    ch = d['chapters']
    # Insérer avant les deux derniers (Plan d'action, Ressources & lexique).
    d['chapters'] = ch[:-2] + [chapter] + ch[-2:]
    if add_qcm:
        d['qcm'] = d['qcm'] + add_qcm
    json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    core = d['chapters'][1:-2]
    print(f'#{num}: {len(core)} chap de fond, {len(d["qcm"])} QCM')


for num, chapter in sorted(NEW.items()):
    apply(num, chapter)
print('Lot 4 (9-22) terminé.')
