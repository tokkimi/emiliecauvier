import type { Book } from './books';
import type { Locale } from '@/lib/i18n';

/** Traductions anglaises (titre + sous-titre) par slug. */
export const BOOKS_EN: Record<string, { title: string; subtitle: string }> = {
  'devenir-proprietaire-au-quebec': { title: 'Buying together', subtitle: 'Common-law partners, undivided co-ownership and an agreement.' },
  'cinq-erreurs-a-10000-de-l-acheteur': { title: 'The 5 mistakes that cost $10,000', subtitle: 'The costly traps of a first purchase — and how to avoid them' },
  'la-preapprobation-hypothecaire-decodee': { title: 'Mortgage pre-approval decoded', subtitle: 'Understand, prepare and secure solid financing' },
  'la-taxe-de-bienvenue-expliquee': { title: 'The Welcome Tax explained', subtitle: 'Québec land transfer duties — calculation, deadline and special cases' },
  'acheter-en-copropriete-condo': { title: 'Buying a condo (co-ownership)', subtitle: 'Declaration, contingency fund and fees — buying a condo with no bad surprises' },
  'checklist-visite-inspection': { title: 'Viewing a property', subtitle: "The inspector's checklist — seeing past the décor" },
  'promesse-achat-gagnante': { title: 'Writing a winning purchase offer', subtitle: 'Price, conditions, deadlines and offer strategy — without trapping yourself' },
  'duplex-triplex-habiter-louer': { title: 'The duplex or triplex to live in and rent out', subtitle: 'Becoming an owner-occupant: housing yourself while tenants pay the mortgage' },
  'acheter-neuf-vs-ancien-gcr': { title: 'Buying new or existing', subtitle: 'New construction, GCR warranty and existing property — choosing well' },
  'financer-mise-de-fonds-rap-celiapp-don': { title: 'Funding your down payment', subtitle: 'HBP, FHSA and a family gift — putting your down payment together wisely' },
  'choisir-son-quartier-laval-rive-nord': { title: 'Choosing the right neighbourhood', subtitle: 'Laval and the North Shore — finding the area that fits you' },
  'acheter-a-montreal-arrondissements': { title: 'Buying in Montréal', subtitle: 'The borough guide — finding your neighbourhood in the city' },
  'les-vrais-frais-de-l-achat': { title: 'The real costs of buying', subtitle: 'Notary, inspection, adjustments and more — the true cost, no surprises' },
  'sols-argileux-pyrite-drain-francais': { title: 'Clay soils, pyrite and French drains', subtitle: 'The Québec-specific field checks — buying with your eyes open' },
  'vendre-au-meilleur-prix-7-etapes': { title: 'Selling at the best price', subtitle: 'The 7-step game plan — from the right price to closing' },
  'home-staging-express': { title: 'Express home staging', subtitle: 'Getting your property sale-ready in a weekend, room by room, on a budget' },
  'fixer-le-bon-prix-analyse-comparative': { title: 'Setting the right price', subtitle: 'The comparative market analysis explained — selling at fair value' },
  'vendre-seul-duproprio-vs-courtier': { title: 'Selling on your own or with a broker', subtitle: 'DuProprio vs a real-estate broker — the real math, no myths' },
  'declaration-du-vendeur-vices-caches': { title: "The seller's declaration", subtitle: 'Avoiding latent defects and lawsuits — selling with peace of mind' },
  'vendre-son-condo': { title: 'Selling your condo', subtitle: 'Documents, fees and co-ownership-specific pitfalls' },
  'photos-video-marketing': { title: 'Photos, video and marketing', subtitle: 'Selling in the digital age — the first showing happens online' },
  'gerer-les-offres-multiples-vendeur': { title: 'Handling multiple offers', subtitle: 'Seller side — turning competition into a better outcome' },
  'vendre-propriete-heritee-succession': { title: 'Selling an inherited property', subtitle: 'Estate — selling an inherited property with peace of mind' },
  'vendre-separation-divorce': { title: 'Selling during a separation', subtitle: 'Separation or divorce — selling the property with clarity and calm' },
  'certificat-de-localisation': { title: 'The location certificate', subtitle: 'When, why and how much — the document that can block a sale' },
  'premier-immeuble-a-revenus': { title: 'Your first income property', subtitle: 'Buying your first plex without mistakes — profitability, financing, management' },
  'calculer-la-rentabilite': { title: 'Calculating profitability', subtitle: 'Cash flow, cap rate and GRM — the numbers that decide' },
  'financer-immeuble-a-revenus': { title: 'Financing an income property', subtitle: 'Down payment, CMHC and structure — getting the right rental financing' },
  'fiscalite-investisseur-immobilier': { title: 'Taxation for the real-estate investor', subtitle: 'Rental income, expenses, depreciation and capital gains in Québec' },
  'locataires-et-tal': { title: 'Tenants and the Rental Tribunal', subtitle: 'Leases, increases and rights — managing your tenants in Québec' },
  'reprise-de-logement-et-eviction': { title: 'Repossession and eviction', subtitle: 'The Québec legal framework — understanding your rights and their limits' },
  'renover-pour-creer-de-la-valeur-flip': { title: 'Renovating to create value', subtitle: 'The flip and added value — renovating smartly, not at a loss' },
  'location-court-terme-airbnb-legalite': { title: 'Short-term rental (Airbnb)', subtitle: "What's legal in Québec — before diving into short-term rentals" },
  'batir-un-portefeuille-immobilier': { title: 'Building a portfolio', subtitle: 'From 1 to 5 doors — growing your real-estate wealth step by step' },
  'comprendre-la-loi-sur-le-courtage': { title: 'Understanding the Brokerage Act', subtitle: 'Your consumer rights — how real-estate brokerage is regulated in Québec' },
  'le-role-du-notaire': { title: "The notary's role", subtitle: 'What the notary does in a Québec real-estate transaction' },
  'hypotheque-fixe-vs-variable': { title: 'Mortgage: fixed or variable?', subtitle: 'Rate, term and amortization — understanding and choosing your loan' },
  'assurance-habitation-et-titres': { title: 'Home and title insurance', subtitle: 'Protecting yourself well — the insurance to know when buying' },
  'marche-grand-montreal-cycles': { title: 'The Greater Montréal market', subtitle: 'Reading the cycles to buy and sell with discernment' },
  'acheter-vendre-en-hiver': { title: 'Buying or selling in winter', subtitle: 'Myths and realities of winter real estate in Québec' },
  'evaluation-municipale-vs-valeur-marchande': { title: 'Municipal assessment vs market value', subtitle: 'Two numbers, two uses — stop confusing them' },
  'copropriete-divise-vs-indivise': { title: 'Divided or undivided co-ownership?', subtitle: 'Choosing well — two very different ways to own a condo' },
  'acheter-a-deux': { title: 'Buying together', subtitle: 'Common-law partners, undivided co-ownership and an agreement — protecting yourselves as a couple' },
  'premier-achat-nouveaux-arrivants': { title: 'First purchase for newcomers', subtitle: 'Buying in Québec when you come from elsewhere — bearings and steps' },
  'acheter-et-vendre-en-meme-temps': { title: 'Buying and selling at the same time', subtitle: 'Moving without getting stuck — coordinating both transactions' },
  'retraite-et-immobilier-downsizing': { title: 'Retirement and real estate', subtitle: 'Downsizing, income and transfer — real estate working for your retirement' },
  'aider-son-enfant-a-acheter': { title: 'Helping your child buy', subtitle: 'Gift, loan or co-signing — supporting without putting yourself at risk' },
  'acheter-un-chalet-residence-secondaire': { title: 'Buying a cottage', subtitle: 'A second home in Québec — dream, reality and essential checks' },
};

/** Libellés de collection en anglais. */
export const COLLECTIONS_EN: Record<string, string> = {
  ACHETEURS: 'Buyers',
  VENDEURS: 'Sellers',
  INVESTISSEURS: 'Investors',
  QUEBEC_LEGAL: 'Québec & Legal',
  SITUATIONS: 'Life situations',
  NICHE: 'Niches',
};

/** Renvoie le titre/sous-titre d'un livre dans la langue demandée (repli FR). */
export function localizeBook(book: Book, locale: Locale): { title: string; subtitle: string } {
  if (locale === 'en') {
    const en = BOOKS_EN[book.slug];
    if (en) return en;
  }
  return { title: book.title, subtitle: book.subtitle };
}
