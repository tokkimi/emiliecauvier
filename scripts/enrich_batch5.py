#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Enrichissement lot 5 : guides #23-34, 49, 50.
Ajoute un 5e chapitre de fond. #50 passe de 6 à 8 QCM."""
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
EXTRA_QCM = {}

NEW[23] = chap("Vider la maison : aspects pratiques et émotifs", "Gérer le contenu avant la vente.",
    "<p>Avant de vendre une propriété héritée, il faut souvent la <strong>vider</strong> — une étape chargée en émotions autant qu'en logistique.</p>"
    "<ul><li><strong>Trier</strong> : garder, donner, vendre, jeter.</li><li>Prévoir du <strong>temps</strong> et, si possible, se répartir la tâche entre héritiers.</li><li>Documenter les objets de <strong>valeur</strong> (succession).</li><li>Envisager une <strong>vente de succession</strong> ou des services spécialisés.</li></ul>"
    "<p>Une maison désencombrée et propre se présente mieux et se vend plus facilement.</p>"
    + tip("Ne précipitez pas le tri sous le coup de l'émotion, mais ne le laissez pas non plus retarder la vente pendant des mois. Fixez-vous un échéancier réaliste et, au besoin, faites-vous aider."))

NEW[24] = chap("Rester fonctionnel : accompagnement et communication", "Vendre sereinement malgré le conflit.",
    "<p>Vendre lors d'une séparation ajoute une dimension émotive à un processus déjà exigeant. Quelques repères aident à garder le cap :</p>"
    "<ul><li>S'entendre sur les <strong>décisions clés</strong> (prix, délais) à l'avance, par écrit si possible.</li><li>Passer par des <strong>intermédiaires neutres</strong> (courtière, médiateur) pour désamorcer.</li><li>Séparer les <strong>enjeux financiers</strong> des tensions personnelles.</li><li>Se faire accompagner (notaire, conseiller juridique).</li></ul>"
    "<p>L'objectif : une transaction qui se conclut proprement, sans que le conflit ne fasse perdre de l'argent aux deux parties.</p>"
    + tip("Confier la vente à une courtière neutre évite bien des affrontements directs. Elle devient le canal unique de communication sur la transaction, ce qui protège la vente — et souvent votre énergie."))

NEW[25] = chap("Quand le certificat ne suffit plus", "Réagir face à un certificat inadéquat.",
    "<p>Un certificat de localisation peut être <strong>périmé</strong> ou ne plus refléter la réalité (après des travaux, un agrandissement, une nouvelle clôture). Vos options :</p>"
    "<ul><li>Faire produire un <strong>nouveau certificat</strong> par un arpenteur-géomètre.</li><li>Envisager une <strong>assurance titres</strong>, qui peut parfois combler l'écart selon les cas.</li><li>Négocier <strong>qui paie</strong> le nouveau certificat dans la promesse d'achat.</li></ul>"
    "<p>Le prêteur et le notaire exigent généralement un certificat qui reflète l'état actuel : mieux vaut régler la question tôt.</p>"
    + tip("Abordez la question du certificat dès la promesse d'achat, pas la veille de la signature. Faire produire un nouveau certificat prend du temps, et c'est souvent négociable : qui le paie se décide au début."))

NEW[26] = chap("Après l'achat : gérer son premier immeuble", "Passer d'acheteur à propriétaire-bailleur.",
    "<p>Acheter un immeuble, c'est aussi devenir <strong>gestionnaire</strong>. Quelques fondations pour bien démarrer :</p>"
    "<ul><li>Reprendre les <strong>baux</strong> en cours et connaître ses locataires.</li><li>Tenir une <strong>comptabilité</strong> simple dès le premier mois.</li><li>Constituer une <strong>réserve</strong> pour l'entretien et les imprévus.</li><li>Réagir <strong>rapidement</strong> aux demandes (un bon service réduit le roulement).</li></ul>"
    "<p>Une gestion rigoureuse dès le départ fait la différence entre un investissement rentable et une source de stress.</p>"
    + tip("Traitez votre immeuble comme une petite entreprise dès le jour un : un compte dédié, des chiffres à jour et une réserve d'entretien. Ce sérieux vous facilitera aussi le financement du prochain."))

NEW[27] = chap("Rendement sur mise de fonds et effet de levier", "Mesurer ce que rapporte votre argent investi.",
    "<p>Au-delà des ratios classiques, un chiffre parle directement à l'investisseur : le <strong>rendement sur mise de fonds</strong> (cash-on-cash) — le cashflow annuel rapporté à l'argent réellement investi.</p>"
    "<p>C'est là qu'intervient l'<strong>effet de levier</strong> : en finançant une partie du prix, vous investissez moins de votre poche pour contrôler un actif plus gros.</p>"
    "<ul><li>Le levier <strong>amplifie</strong> le rendement… mais aussi le risque.</li><li>Un cashflow négatif transforme le levier en fardeau.</li></ul>"
    + tip("Le levier est une arme à double tranchant : il gonfle vos rendements quand tout va bien, mais amplifie les pertes si le cashflow devient négatif. Gardez toujours une marge pour absorber une mauvaise année."))

NEW[28] = chap("Qualification : ratios et test de résistance", "Comprendre comment le prêteur vous évalue.",
    "<p>Obtenir le financement dépend de la façon dont le prêteur <strong>évalue votre dossier</strong> :</p>"
    "<ul><li><strong>Ratios d'endettement</strong> : proportion de vos revenus consacrée aux dettes.</li><li><strong>Prise en compte des loyers</strong> : une partie seulement est souvent retenue.</li><li><strong>Test de résistance</strong> : votre capacité est calculée à un taux supérieur au taux réel, pour vérifier que vous tiendriez une hausse.</li></ul>"
    "<p>Connaître ces règles à l'avance évite les refus et vous aide à monter un dossier solide.</p>"
    + tip("Rencontrez un courtier hypothécaire spécialisé en immobilier locatif AVANT de magasiner. Il vous dira exactement combien vous pouvez emprunter et comment les loyers sont pris en compte — ça cible vos recherches."))

NEW[29] = chap("Registres, reçus et bon comptable", "Garder une comptabilité qui vous protège.",
    "<p>La fiscalité immobilière ne pardonne pas l'improvisation. Une <strong>tenue de livres</strong> rigoureuse est votre meilleure alliée :</p>"
    "<ul><li>Conserver <strong>tous les reçus</strong> et factures (dépenses, travaux).</li><li>Séparer les finances de l'immeuble de vos finances <strong>personnelles</strong>.</li><li>Distinguer <strong>réparation</strong> (déductible) et <strong>amélioration</strong> (capitalisée).</li><li>S'entourer d'un <strong>comptable</strong> qui connaît l'immobilier.</li></ul>"
    "<p>Des registres impeccables réduisent vos impôts légitimement et vous protègent en cas de vérification.</p>"
    + tip("Un bon comptable spécialisé en immobilier se paie souvent lui-même par les déductions qu'il déniche et les erreurs qu'il évite. Ne bricolez pas votre fiscalité locative : c'est un faux économie."))

NEW[30] = chap("Retards de loyer et conflits : bien réagir", "Agir correctement en cas de problème.",
    "<p>Même avec une bonne sélection, des difficultés peuvent survenir. La clé : réagir <strong>tôt et dans les règles</strong> :</p>"
    "<ul><li>Communiquer <strong>rapidement</strong> et par écrit dès un retard.</li><li>Documenter les <strong>échanges</strong> et les manquements.</li><li>Connaître les <strong>recours</strong> et délais prévus par la loi.</li><li>Passer par le <strong>Tribunal administratif du logement</strong> au besoin, avec un dossier solide.</li></ul>"
    "<p>Garder son calme, rester factuel et respecter la procédure protège vos droits comme ceux du locataire.</p>"
    + tip("N'attendez pas trois mois de loyers impayés pour agir. Un rappel écrit dès le premier retard, courtois mais ferme, règle la majorité des situations avant qu'elles ne dégénèrent."))

NEW[31] = chap("Respecter la procédure à la lettre", "Éviter les erreurs qui invalident une reprise.",
    "<p>Une reprise ou une éviction mal exécutée peut être <strong>contestée et refusée</strong>. La rigueur est essentielle :</p>"
    "<ul><li>Utiliser le <strong>bon motif</strong> et la bonne personne admissible.</li><li>Respecter les <strong>délais d'avis</strong> à la lettre.</li><li>Verser les <strong>indemnités</strong> prévues, le cas échéant.</li><li>Agir de <strong>bonne foi</strong> : une reprise de mauvaise foi expose à des sanctions.</li></ul>"
    "<p>Au moindre doute, faites valider votre démarche avant d'envoyer un avis.</p>"
    + tip("Une reprise de logement se joue sur les détails de procédure. Un avis envoyé en retard ou mal rédigé peut tout faire échouer. Faites vérifier votre avis avant de l'envoyer : on ne se rattrape pas facilement."))

NEW[32] = chap("Rénover pour soi ou pour le marché ?", "Adapter les travaux à l'objectif.",
    "<p>On ne rénove pas de la même façon pour <strong>habiter longtemps</strong> ou pour <strong>revendre</strong> :</p>"
    "<ul><li><strong>Pour soi</strong> : privilégier votre confort et vos goûts, sur un horizon long.</li><li><strong>Pour revendre</strong> : viser des choix neutres et populaires, contrôler les coûts, ne pas sur-améliorer par rapport au quartier.</li></ul>"
    "<p>Sur-rénover une propriété au-delà de la valeur du secteur, c'est investir un argent qu'on ne récupérera pas à la revente.</p>"
    + tip("Ne devenez pas la maison la plus chère de la rue. Au-delà d'un certain point, le quartier plafonne votre valeur : vos rénovations somptueuses ne se revendront jamais à leur coût. Rénovez en phase avec le secteur."))

NEW[33] = chap("Bien opérer : fiscalité, assurance, gestion", "Exploiter sans mauvaise surprise.",
    "<p>Une fois la location court terme autorisée, encore faut-il l'<strong>opérer correctement</strong> :</p>"
    "<ul><li><strong>Fiscalité</strong> : les revenus sont imposables et certaines taxes peuvent s'appliquer.</li><li><strong>Assurance</strong> : une police adaptée à la location court terme (une habitation classique peut ne pas couvrir).</li><li><strong>Gestion</strong> : accueil, ménage, entretien, gestion des avis.</li><li><strong>Voisinage</strong> : bruit et respect des règles pour éviter les plaintes.</li></ul>"
    "<p>La rentabilité affichée fond vite si l'on néglige ces coûts et obligations bien réels.</p>"
    + tip("Vérifiez que votre assurance couvre vraiment la location court terme : beaucoup de polices habitation ne le font pas. Un sinistre non couvert peut effacer des années de revenus en une seule fois."))

NEW[34] = chap("Diversifier et maîtriser le risque", "Croître sans se surexposer.",
    "<p>Bâtir un portefeuille, ce n'est pas seulement accumuler : c'est aussi <strong>gérer le risque</strong> pour durer :</p>"
    "<ul><li><strong>Diversifier</strong> : types de propriétés, secteurs, profils de locataires.</li><li>Garder une <strong>réserve</strong> de liquidités pour les imprévus.</li><li>Surveiller son <strong>endettement</strong> global et sa capacité à absorber une hausse de taux.</li><li>Éviter de tout miser sur un seul <strong>scénario</strong> optimiste.</li></ul>"
    "<p>Un portefeuille qui traverse les cycles bat presque toujours celui qui vise le rendement maximal à tout prix.</p>"
    + tip("La croissance immobilière est un marathon, pas un sprint. Garder de la marge et de la réserve vous permet de saisir les occasions quand d'autres sont coincés — et de survivre aux années difficiles."))

# ===== 49 (contenu anglais, style du fichier conservé) =====
NEW[49] = chap("Common seller mistakes to avoid", "Protect your sale from avoidable errors.",
    "<p>A few very common mistakes end up costing sellers real money. Knowing them is half the battle:</p>"
    "<ul><li><strong>Overpricing</strong> at launch: the property stalls and loses momentum.</li><li>Skipping <strong>preparation</strong> and quality photos.</li><li>Making <strong>showings</strong> hard to schedule.</li><li>Negotiating on <strong>emotion</strong> rather than facts.</li></ul>"
    "<p>The good news: every one of these is avoidable with a little method and perspective.</p>"
    + tip("The first weeks on the market are the most valuable — that's when interest peaks. An inflated starting price wastes that momentum, and a listing that lingers usually sells for less in the end."))

# ===== 50 (chalet) : +1 chapitre et +2 QCM =====
NEW[50] = chap("Usage familial, location ou les deux ?", "Clarifier le projet derrière l'achat.",
    "<p>Avant d'acheter un chalet, clarifiez ce que vous en attendez vraiment — cela oriente tout le reste :</p>"
    "<ul><li><strong>Usage familial</strong> : privilégier l'emplacement, le confort et la distance de la maison.</li><li><strong>Revenus de location</strong> : vérifier le zonage, la demande touristique et les règles (voir la location court terme).</li><li><strong>Les deux</strong> : un usage mixte, à équilibrer entre disponibilité familiale et calendrier de location.</li></ul>"
    "<p>Un chalet acheté « pour la famille » puis loué sans vérifier les règles peut vite tourner au casse-tête.</p>"
    + tip("Soyez honnête sur l'usage réel : beaucoup de chalets sont utilisés moins souvent que prévu. Si le budget dépend des revenus de location, validez le zonage et la demande AVANT d'acheter, pas après."))

EXTRA_QCM[50] = [
    {"q": "Avant d'acheter un chalet, il faut d'abord :", "options": ["A) Le louer aussitôt", "B) Clarifier l'usage prévu (famille, location, mixte)", "C) Ignorer le zonage", "D) Payer comptant"], "answer": 1, "explanation": "Clarifier le projet (chap. usage)."},
    {"q": "Compter sur les revenus de location d'un chalet exige de :", "options": ["A) Ne rien vérifier", "B) Valider le zonage et la demande avant d'acheter", "C) Acheter d'abord, vérifier ensuite", "D) Éviter l'assurance"], "answer": 1, "explanation": "Vérifier avant d'acheter (chap. usage)."},
]


def apply(num, chapter, add_qcm=None):
    path = os.path.join(DIR, f'{num}.json')
    d = json.load(open(path, encoding='utf-8'))
    ch = d['chapters']
    d['chapters'] = ch[:-2] + [chapter] + ch[-2:]
    if add_qcm:
        d['qcm'] = d['qcm'] + add_qcm
    json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    core = d['chapters'][1:-2]
    print(f'#{num}: {len(core)} chap de fond, {len(d["qcm"])} QCM')


for num, chapter in sorted(NEW.items()):
    apply(num, chapter, EXTRA_QCM.get(num))
print('Lot 5 (23-34, 49, 50) terminé.')
