import { BOOKS } from '@/data/books';

export type ProjectAnswers = {
  stage: 'acheter' | 'vendre' | 'investir' | 'proprietaire' | 'marche';
  area: 'montreal' | 'laval-rive-nord' | 'ailleurs';
  propertyType: 'condo' | 'maison' | 'plex' | 'indecis';
  budget: 'moins-500' | '500-700' | '700-plus' | 'indecis';
};

const BASE: Record<ProjectAnswers['stage'], string[]> = {
  acheter: [
    'devenir-proprietaire-au-quebec',
    'la-preapprobation-hypothecaire-decodee',
    'les-vrais-frais-de-l-achat',
    'checklist-visite-inspection',
    'promesse-achat-gagnante',
    'la-taxe-de-bienvenue-expliquee',
  ],
  vendre: [
    'vendre-au-meilleur-prix-7-etapes',
    'fixer-le-bon-prix-analyse-comparative',
    'home-staging-express',
    'photos-video-marketing',
    'declaration-du-vendeur-vices-caches',
    'gerer-les-offres-multiples-vendeur',
  ],
  investir: [
    'premier-immeuble-a-revenus',
    'calculer-la-rentabilite',
    'financer-immeuble-a-revenus',
    'fiscalite-investisseur-immobilier',
    'locataires-et-tal',
    'batir-un-portefeuille-immobilier',
  ],
  proprietaire: [
    'renover-pour-creer-de-la-valeur-flip',
    'assurance-habitation-et-titres',
    'evaluation-municipale-vs-valeur-marchande',
    'aider-son-enfant-a-acheter',
    'retraite-et-immobilier-downsizing',
    'vendre-au-meilleur-prix-7-etapes',
  ],
  marche: [
    'marche-grand-montreal-cycles',
    'evaluation-municipale-vs-valeur-marchande',
    'comprendre-la-loi-sur-le-courtage',
    'hypotheque-fixe-vs-variable',
    'acheter-vendre-en-hiver',
    'le-role-du-notaire',
  ],
};

export function recommendBooks(answers: ProjectAnswers) {
  const slugs = [...BASE[answers.stage]];

  const prioritize = (slug: string) => {
    const index = slugs.indexOf(slug);
    if (index >= 0) slugs.splice(index, 1);
    slugs.splice(Math.min(3, slugs.length), 0, slug);
  };

  if (answers.area === 'montreal') prioritize('acheter-a-montreal-arrondissements');
  if (answers.area === 'laval-rive-nord') prioritize('choisir-son-quartier-laval-rive-nord');
  if (answers.propertyType === 'condo') prioritize('acheter-en-copropriete-condo');
  if (answers.propertyType === 'plex') prioritize('duplex-triplex-habiter-louer');

  return [...new Set(slugs)]
    .slice(0, 6)
    .map((slug) => BOOKS.find((book) => book.slug === slug))
    .filter((book): book is NonNullable<typeof book> => Boolean(book));
}

