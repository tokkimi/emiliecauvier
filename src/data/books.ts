// Catalogue des 50 guides — généré depuis les contenus source.
export type Collection = 'ACHETEURS'|'VENDEURS'|'INVESTISSEURS'|'QUEBEC_LEGAL'|'SITUATIONS'|'NICHE';
export interface Book { number:number; slug:string; title:string; subtitle:string; collection:Collection; language:string; priceCents:number; pdf:string; chapters:string[]; }

export const COLLECTIONS: Record<Collection,string> = {
  ACHETEURS:'Acheteurs', VENDEURS:'Vendeurs', INVESTISSEURS:'Investisseurs',
  QUEBEC_LEGAL:'Québec & Légal', SITUATIONS:'Situations de vie', NICHE:'Niches',
};

export const BOOKS: Book[] = [
  {
    "number": 1,
    "slug": "devenir-proprietaire-au-quebec",
    "title": "Acheter à deux",
    "subtitle": "Conjoints de fait, indivision et convention.",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "01_devenir-proprietaire-au-quebec.pdf",
    "chapters": [
      "Êtes-vous prêt à acheter ?",
      "Financer la mise de fonds (RAP, CELIAPP, don)",
      "La préapprobation hypothécaire",
      "Trouver la bonne propriété",
      "La visite et l'inspection",
      "La promesse d'achat et la négociation",
      "Signer chez le notaire (et les frais de clôture)",
      "Emménager et bien démarrer"
    ]
  },
  {
    "number": 2,
    "slug": "cinq-erreurs-a-10000-de-l-acheteur",
    "title": "Les 5 erreurs à 10 000 $",
    "subtitle": "Les pièges coûteux du premier achat — et comment les éviter",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "02_cinq-erreurs-a-10000-de-l-acheteur.pdf",
    "chapters": [
      "Erreur n°1 — Magasiner sans vraie préapprobation",
      "Erreur n°2 — Sous-estimer les frais « invisibles »",
      "Erreur n°3 — Bâcler (ou sauter) l'inspection",
      "Erreur n°4 — Laisser l'émotion mener l'offre",
      "Erreur n°5 — Négliger le quartier, la revente et les documents"
    ]
  },
  {
    "number": 3,
    "slug": "la-preapprobation-hypothecaire-decodee",
    "title": "La préapprobation hypothécaire décodée",
    "subtitle": "Comprendre, préparer et obtenir un financement solide",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "03_la-preapprobation-hypothecaire-decodee.pdf",
    "chapters": [
      "Préqualification vs préapprobation",
      "Ce que le prêteur regarde vraiment",
      "Le test de résistance (stress test)",
      "Courtier hypothécaire ou institution ?",
      "Documents, validité et pièges à éviter"
    ]
  },
  {
    "number": 4,
    "slug": "la-taxe-de-bienvenue-expliquee",
    "title": "La taxe de bienvenue expliquée",
    "subtitle": "Droits de mutation immobilière au Québec — calcul, échéance et cas particuliers",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "04_la-taxe-de-bienvenue-expliquee.pdf",
    "chapters": [
      "D'où vient cette taxe ?",
      "Sur quelle valeur est-ce calculé ?",
      "Le calcul par tranches",
      "Exonérations et cas particuliers",
      "Quand et comment la payer (et la prévoir)"
    ]
  },
  {
    "number": 5,
    "slug": "acheter-en-copropriete-condo",
    "title": "Acheter en copropriété (condo)",
    "subtitle": "Déclaration, fonds de prévoyance et charges — acheter un condo sans mauvaise surprise",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "05_acheter-en-copropriete-condo.pdf",
    "chapters": [
      "Copropriété divise : comment ça fonctionne",
      "La déclaration de copropriété et le règlement",
      "Le fonds de prévoyance : le nerf de la guerre",
      "Assurances et procès-verbaux",
      "L'examen des documents avant de finaliser"
    ]
  },
  {
    "number": 6,
    "slug": "checklist-visite-inspection",
    "title": "La visite d'une propriété",
    "subtitle": "La checklist de l'inspecteur — voir au-delà de la décoration",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "06_checklist-visite-inspection.pdf",
    "chapters": [
      "Avant d'entrer : l'extérieur et le terrain",
      "Le sous-sol : là où tout se voit",
      "Les systèmes : électricité, plomberie, chauffage",
      "L'intérieur, pièce par pièce",
      "De la visite à l'inspection professionnelle"
    ]
  },
  {
    "number": 7,
    "slug": "promesse-achat-gagnante",
    "title": "Rédiger une promesse d'achat gagnante",
    "subtitle": "Prix, conditions, délais et stratégie d'offre — sans se piéger",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "07_promesse-achat-gagnante.pdf",
    "chapters": [
      "Ce qu'est (vraiment) une promesse d'achat",
      "Les conditions qui vous protègent",
      "Fixer le bon prix d'offre",
      "Délais, dépôt et contre-propositions",
      "Les offres multiples : garder la tête froide"
    ]
  },
  {
    "number": 8,
    "slug": "duplex-triplex-habiter-louer",
    "title": "Le duplex ou triplex pour habiter et louer",
    "subtitle": "Devenir propriétaire-occupant : se loger pendant que ses locataires paient l'hypothèque",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "08_duplex-triplex-habiter-louer.pdf",
    "chapters": [
      "Pourquoi le plex est un tremplin idéal",
      "Le financement du propriétaire-occupant",
      "Calculer le coût net réel",
      "Les locataires en place et les baux",
      "Devenir propriétaire-bailleur, concrètement"
    ]
  },
  {
    "number": 9,
    "slug": "acheter-neuf-vs-ancien-gcr",
    "title": "Acheter du neuf ou de l'ancien",
    "subtitle": "Construction neuve, garantie GCR et propriété existante — bien choisir",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "09_acheter-neuf-vs-ancien-gcr.pdf",
    "chapters": [
      "Neuf vs ancien : le vrai match",
      "La garantie de construction résidentielle (GCR)",
      "Acheter sur plan : délais, acomptes, choix",
      "Vérifier une propriété ancienne"
    ]
  },
  {
    "number": 10,
    "slug": "financer-mise-de-fonds-rap-celiapp-don",
    "title": "Financer sa mise de fonds",
    "subtitle": "RAP, CELIAPP et don familial — rassembler votre mise de fonds intelligemment",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "10_financer-mise-de-fonds-rap-celiapp-don.pdf",
    "chapters": [
      "De combien avez-vous besoin ?",
      "Le CELIAPP : souvent le meilleur point de départ",
      "Le RAP : mobiliser son REER",
      "Le don familial et l'ordre des retraits"
    ]
  },
  {
    "number": 11,
    "slug": "choisir-son-quartier-laval-rive-nord",
    "title": "Bien choisir son quartier",
    "subtitle": "Laval et la Rive-Nord — trouver le secteur qui vous ressemble",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "11_choisir-son-quartier-laval-rive-nord.pdf",
    "chapters": [
      "La méthode d'évaluation d'un quartier",
      "Laval : des visages très différents",
      "La Rive-Nord : espace et vie de banlieue",
      "Penser revente dès l'achat"
    ]
  },
  {
    "number": 12,
    "slug": "acheter-a-montreal-arrondissements",
    "title": "Acheter à Montréal",
    "subtitle": "Le guide des arrondissements — trouver son quartier dans la métropole",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "12_acheter-a-montreal-arrondissements.pdf",
    "chapters": [
      "Comprendre la logique montréalaise",
      "Les grandes familles d'arrondissements",
      "Prix, taxes et particularités montréalaises",
      "Choisir en pensant revente"
    ]
  },
  {
    "number": 13,
    "slug": "les-vrais-frais-de-l-achat",
    "title": "Les vrais frais de l'achat",
    "subtitle": "Notaire, inspection, ajustements et cie — le vrai coût, sans surprise",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "13_les-vrais-frais-de-l-achat.pdf",
    "chapters": [
      "Les frais payés autour de la transaction",
      "La taxe de bienvenue, à part",
      "Les dépenses de démarrage",
      "Bâtir son budget d'achat complet"
    ]
  },
  {
    "number": 14,
    "slug": "sols-argileux-pyrite-drain-francais",
    "title": "Sols argileux, pyrite et drain français",
    "subtitle": "Les vérifications terrain propres au Québec — acheter les yeux ouverts",
    "collection": "ACHETEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "14_sols-argileux-pyrite-drain-francais.pdf",
    "chapters": [
      "Les sols argileux et le mouvement des fondations",
      "La pyrite et la pyrrhotite",
      "Le drain français et la gestion de l'eau",
      "Réservoirs enfouis, vermiculite et amiante"
    ]
  },
  {
    "number": 15,
    "slug": "vendre-au-meilleur-prix-7-etapes",
    "title": "Vendre au meilleur prix",
    "subtitle": "Le plan de match en 7 étapes — du bon prix au closing",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "15_vendre-au-meilleur-prix-7-etapes.pdf",
    "chapters": [
      "Étapes 1-2 : le bon prix et la préparation",
      "Étapes 3-4 : la mise en marché et les visites",
      "Étapes 5-6 : les offres et la négociation",
      "Étape 7 : de l'acceptation au closing"
    ]
  },
  {
    "number": 16,
    "slug": "home-staging-express",
    "title": "Home staging express",
    "subtitle": "Préparer sa propriété à vendre en un week-end, pièce par pièce, à petit budget",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "16_home-staging-express.pdf",
    "chapters": [
      "Les 3 principes qui font vendre",
      "Extérieur et entrée : la première impression",
      "Pièces de vie et cuisine",
      "Chambres, salles de bain et touches finales"
    ]
  },
  {
    "number": 17,
    "slug": "fixer-le-bon-prix-analyse-comparative",
    "title": "Fixer le bon prix",
    "subtitle": "L'analyse comparative de marché expliquée — vendre à la juste valeur",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "17_fixer-le-bon-prix-analyse-comparative.pdf",
    "chapters": [
      "Ce qui détermine (vraiment) la valeur",
      "L'analyse comparative de marché (ACM)",
      "Évaluation municipale vs valeur marchande",
      "La stratégie de prix de départ"
    ]
  },
  {
    "number": 18,
    "slug": "vendre-seul-duproprio-vs-courtier",
    "title": "Vendre seul ou avec un courtier",
    "subtitle": "DuProprio vs courtier immobilier — le vrai calcul, sans mythe",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "18_vendre-seul-duproprio-vs-courtier.pdf",
    "chapters": [
      "Ce que fait vraiment un courtier",
      "Les coûts et risques du « sans intermédiaire »",
      "Le vrai calcul, chiffres en main",
      "Comment décider selon votre situation"
    ]
  },
  {
    "number": 19,
    "slug": "declaration-du-vendeur-vices-caches",
    "title": "La déclaration du vendeur",
    "subtitle": "Éviter les vices cachés et les poursuites — vendre l'esprit tranquille",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "19_declaration-du-vendeur-vices-caches.pdf",
    "chapters": [
      "La garantie légale de qualité",
      "La déclaration du vendeur",
      "Réduire son risque de poursuite",
      "Que faire si un problème surgit"
    ]
  },
  {
    "number": 20,
    "slug": "vendre-son-condo",
    "title": "Vendre son condo",
    "subtitle": "Documents, charges et pièges spécifiques à la copropriété",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "20_vendre-son-condo.pdf",
    "chapters": [
      "Préparer le dossier de copropriété",
      "Présenter charges et fonds de prévoyance",
      "Mettre en marché un condo",
      "Les pièges spécifiques à éviter"
    ]
  },
  {
    "number": 21,
    "slug": "photos-video-marketing",
    "title": "Photos, vidéo et marketing",
    "subtitle": "Vendre à l'ère numérique — la première visite se fait en ligne",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "21_photos-video-marketing.pdf",
    "chapters": [
      "Les photos : votre vitrine numérique",
      "La vidéo et la visite virtuelle",
      "La description qui donne envie",
      "La diffusion : être vu par les bons acheteurs"
    ]
  },
  {
    "number": 22,
    "slug": "gerer-les-offres-multiples-vendeur",
    "title": "Gérer les offres multiples",
    "subtitle": "Côté vendeur — transformer la compétition en meilleur résultat",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "22_gerer-les-offres-multiples-vendeur.pdf",
    "chapters": [
      "Comment naissent les offres multiples",
      "Comparer les offres au-delà du prix",
      "Les règles du jeu : équité et transparence",
      "Décider sans se laisser emporter"
    ]
  },
  {
    "number": 23,
    "slug": "vendre-propriete-heritee-succession",
    "title": "Vendre une propriété héritée",
    "subtitle": "Succession — vendre sereinement une propriété dont on hérite",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "23_vendre-propriete-heritee-succession.pdf",
    "chapters": [
      "Le rôle du liquidateur et les préalables",
      "Préparer la propriété et fixer le prix",
      "Les enjeux fiscaux à connaître",
      "Décider à plusieurs héritiers"
    ]
  },
  {
    "number": 24,
    "slug": "vendre-separation-divorce",
    "title": "Vendre lors d'une séparation",
    "subtitle": "Séparation ou divorce — vendre la propriété avec clarté et sérénité",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "24_vendre-separation-divorce.pdf",
    "chapters": [
      "Comprendre le statut de la propriété",
      "Décider : vendre, racheter ou attendre",
      "Fixer le prix et gérer la vente à deux",
      "Partager le produit de la vente"
    ]
  },
  {
    "number": 25,
    "slug": "certificat-de-localisation",
    "title": "Le certificat de localisation",
    "subtitle": "Quand, pourquoi et combien — le document qui peut bloquer une vente",
    "collection": "VENDEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "25_certificat-de-localisation.pdf",
    "chapters": [
      "Qu'est-ce qu'un certificat de localisation ?",
      "Quand faut-il un nouveau certificat ?",
      "Les irrégularités qu'il peut révéler",
      "Coûts, délais et bonne anticipation"
    ]
  },
  {
    "number": 26,
    "slug": "premier-immeuble-a-revenus",
    "title": "Premier immeuble à revenus",
    "subtitle": "Acheter son premier plex sans se tromper — rentabilité, financement, gestion",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "26_premier-immeuble-a-revenus.pdf",
    "chapters": [
      "Penser comme un investisseur",
      "Évaluer un immeuble avant d'offrir",
      "Les erreurs classiques du premier investisseur",
      "De l'analyse à l'offre"
    ]
  },
  {
    "number": 27,
    "slug": "calculer-la-rentabilite",
    "title": "Calculer la rentabilité",
    "subtitle": "Cashflow, taux de capitalisation et MRB — les chiffres qui décident",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "27_calculer-la-rentabilite.pdf",
    "chapters": [
      "Le revenu net d'exploitation (RNE)",
      "Le cashflow",
      "Le taux de capitalisation (cap rate)",
      "Le MRB et les limites des ratios"
    ]
  },
  {
    "number": 28,
    "slug": "financer-immeuble-a-revenus",
    "title": "Financer un immeuble à revenus",
    "subtitle": "Mise de fonds, SCHL et montage — obtenir le bon financement locatif",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "28_financer-immeuble-a-revenus.pdf",
    "chapters": [
      "1 à 4 logements vs 5 logements et plus",
      "La mise de fonds et l'occupation",
      "L'assurance prêt et la prise en compte des loyers",
      "Bâtir un montage solide"
    ]
  },
  {
    "number": 29,
    "slug": "fiscalite-investisseur-immobilier",
    "title": "Fiscalité de l'investisseur immobilier",
    "subtitle": "Revenus locatifs, dépenses, amortissement et gain en capital au Québec",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "29_fiscalite-investisseur-immobilier.pdf",
    "chapters": [
      "Revenus locatifs et dépenses déductibles",
      "L'amortissement (DPA)",
      "Le gain en capital à la revente",
      "Détention personnelle ou par société"
    ]
  },
  {
    "number": 30,
    "slug": "locataires-et-tal",
    "title": "Locataires et Tribunal administratif du logement",
    "subtitle": "Baux, augmentations et droits — gérer ses locataires au Québec",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "30_locataires-et-tal.pdf",
    "chapters": [
      "Le bail et la sélection des locataires",
      "L'augmentation de loyer",
      "Droits et obligations de chacun",
      "Le rôle du TAL"
    ]
  },
  {
    "number": 31,
    "slug": "reprise-de-logement-et-eviction",
    "title": "Reprise de logement et éviction",
    "subtitle": "Le cadre légal québécois — comprendre ses droits et ses limites",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "31_reprise-de-logement-et-eviction.pdf",
    "chapters": [
      "Reprise vs éviction : deux choses différentes",
      "Les motifs et les personnes admissibles",
      "Avis, délais et indemnités",
      "Anticiper avant d'acheter"
    ]
  },
  {
    "number": 32,
    "slug": "renover-pour-creer-de-la-valeur-flip",
    "title": "Rénover pour créer de la valeur",
    "subtitle": "Le flip et la plus-value — rénover intelligemment, pas à perte",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "32_renover-pour-creer-de-la-valeur-flip.pdf",
    "chapters": [
      "Quelles rénovations créent vraiment de la valeur",
      "Budget, échéancier et dépassements",
      "Permis, normes et entrepreneurs",
      "Calculer la marge réelle d'un flip"
    ]
  },
  {
    "number": 33,
    "slug": "location-court-terme-airbnb-legalite",
    "title": "Location court terme (Airbnb)",
    "subtitle": "Ce qui est légal au Québec — avant de se lancer dans le court terme",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "33_location-court-terme-airbnb-legalite.pdf",
    "chapters": [
      "Le cadre provincial : enregistrement et affichage",
      "Le zonage municipal : le facteur décisif",
      "Copropriété et règlements d'immeuble",
      "Rentabilité réelle et risques"
    ]
  },
  {
    "number": 34,
    "slug": "batir-un-portefeuille-immobilier",
    "title": "Bâtir un portefeuille",
    "subtitle": "De 1 à 5 portes — faire croître son patrimoine immobilier étape par étape",
    "collection": "INVESTISSEURS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "34_batir-un-portefeuille-immobilier.pdf",
    "chapters": [
      "L'équité, moteur de la croissance",
      "Garder des chiffres solides à chaque étape",
      "Une gestion qui grandit avec vous",
      "La vision long terme"
    ]
  },
  {
    "number": 35,
    "slug": "comprendre-la-loi-sur-le-courtage",
    "title": "Comprendre la Loi sur le courtage",
    "subtitle": "Vos droits de consommateur — l'encadrement du courtage immobilier au Québec",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "35_comprendre-la-loi-sur-le-courtage.pdf",
    "chapters": [
      "L'OACIQ et sa mission",
      "Vos protections en tant que consommateur",
      "Contrats et obligations dans une transaction"
    ]
  },
  {
    "number": 36,
    "slug": "le-role-du-notaire",
    "title": "Le rôle du notaire",
    "subtitle": "Ce que fait le notaire dans une transaction immobilière québécoise",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "36_le-role-du-notaire.pdf",
    "chapters": [
      "Un officier public impartial",
      "Ce que le notaire vérifie et prépare",
      "La signature et les frais"
    ]
  },
  {
    "number": 37,
    "slug": "hypotheque-fixe-vs-variable",
    "title": "Hypothèque : fixe ou variable ?",
    "subtitle": "Taux, terme et amortissement — comprendre et choisir son prêt",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "37_hypotheque-fixe-vs-variable.pdf",
    "chapters": [
      "Taux fixe vs taux variable",
      "Le terme et l'amortissement",
      "Les clauses qui comptent"
    ]
  },
  {
    "number": 38,
    "slug": "assurance-habitation-et-titres",
    "title": "Assurance habitation et assurance titres",
    "subtitle": "Bien se protéger — les assurances à connaître à l'achat",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "38_assurance-habitation-et-titres.pdf",
    "chapters": [
      "L'assurance habitation",
      "L'assurance titres",
      "Bien se couvrir sans trou de protection"
    ]
  },
  {
    "number": 39,
    "slug": "marche-grand-montreal-cycles",
    "title": "Le marché du Grand Montréal",
    "subtitle": "Lire les cycles pour acheter et vendre avec discernement",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "39_marche-grand-montreal-cycles.pdf",
    "chapters": [
      "Marché d'acheteurs, marché de vendeurs",
      "Les facteurs qui font bouger le marché",
      "Agir sans tenter de deviner le sommet"
    ]
  },
  {
    "number": 40,
    "slug": "acheter-vendre-en-hiver",
    "title": "Acheter ou vendre en hiver",
    "subtitle": "Mythes et réalités de l'immobilier hivernal au Québec",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "40_acheter-vendre-en-hiver.pdf",
    "chapters": [
      "Le mythe de la « mauvaise saison »",
      "Vendre en hiver : bien se présenter",
      "Acheter en hiver : des occasions"
    ]
  },
  {
    "number": 41,
    "slug": "evaluation-municipale-vs-valeur-marchande",
    "title": "Évaluation municipale vs valeur marchande",
    "subtitle": "Deux chiffres, deux usages — ne plus les confondre",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "41_evaluation-municipale-vs-valeur-marchande.pdf",
    "chapters": [
      "L'évaluation municipale : un outil fiscal",
      "La valeur marchande : le prix du marché",
      "Le facteur comparatif et les bons usages"
    ]
  },
  {
    "number": 42,
    "slug": "copropriete-divise-vs-indivise",
    "title": "Copropriété divise ou indivise ?",
    "subtitle": "Bien choisir — deux façons très différentes de posséder un condo",
    "collection": "QUEBEC_LEGAL",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "42_copropriete-divise-vs-indivise.pdf",
    "chapters": [
      "La copropriété divise (le condo classique)",
      "La copropriété indivise",
      "Bien choisir selon sa situation"
    ]
  },
  {
    "number": 43,
    "slug": "acheter-a-deux",
    "title": "Acheter à deux",
    "subtitle": "Conjoints de fait, indivision et convention — se protéger en couple",
    "collection": "SITUATIONS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "43_acheter-a-deux.pdf",
    "chapters": [
      "Mariés vs conjoints de fait",
      "Comment détenir la propriété",
      "La convention entre conjoints"
    ]
  },
  {
    "number": 44,
    "slug": "premier-achat-nouveaux-arrivants",
    "title": "Premier achat pour nouveaux arrivants",
    "subtitle": "Acheter au Québec quand on vient d'ailleurs — repères et démarches",
    "collection": "SITUATIONS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "44_premier-achat-nouveaux-arrivants.pdf",
    "chapters": [
      "Bâtir son dossier de crédit et de financement",
      "Comprendre les spécificités québécoises",
      "Se préparer et bien s'entourer"
    ]
  },
  {
    "number": 45,
    "slug": "acheter-et-vendre-en-meme-temps",
    "title": "Acheter et vendre en même temps",
    "subtitle": "Se reloger sans se retrouver coincé — coordonner les deux transactions",
    "collection": "SITUATIONS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "45_acheter-et-vendre-en-meme-temps.pdf",
    "chapters": [
      "Vendre d'abord ou acheter d'abord ?",
      "Combler l'écart financier",
      "Coordonner dates et logistique"
    ]
  },
  {
    "number": 46,
    "slug": "retraite-et-immobilier-downsizing",
    "title": "La retraite et l'immobilier",
    "subtitle": "Downsizing, revenus et transmission — l'immobilier au service de votre retraite",
    "collection": "SITUATIONS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "46_retraite-et-immobilier-downsizing.pdf",
    "chapters": [
      "Le downsizing : réduire pour mieux vivre",
      "Générer des revenus ou dégager des liquidités",
      "Penser transmission et long terme"
    ]
  },
  {
    "number": 47,
    "slug": "aider-son-enfant-a-acheter",
    "title": "Aider son enfant à acheter",
    "subtitle": "Don, prêt ou cosignature — soutenir sans se mettre en danger",
    "collection": "SITUATIONS",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "47_aider-son-enfant-a-acheter.pdf",
    "chapters": [
      "Le don pour la mise de fonds",
      "Le prêt familial",
      "La cosignature : aider sans donner d'argent"
    ]
  },
  {
    "number": 50,
    "slug": "acheter-un-chalet-residence-secondaire",
    "title": "Acheter un chalet",
    "subtitle": "Résidence secondaire au Québec — rêve, réalité et vérifications essentielles",
    "collection": "NICHE",
    "language": "fr",
    "priceCents": 1000,
    "pdf": "50_acheter-un-chalet-residence-secondaire.pdf",
    "chapters": [
      "Financer une résidence secondaire",
      "Les vérifications propres au rural",
      "Zonage riverain et réglementation",
      "La réalité de l'entretien et de l'usage"
    ]
  }
];

export const bySlug = (slug:string) => BOOKS.find(b=>b.slug===slug);
