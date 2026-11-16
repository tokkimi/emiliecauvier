export type ReaderReview = { name: string; quote: string; rating: 1 | 2 | 3 | 4 | 5 };
export const guideReviews: Record<string, Partial<Record<'fr' | 'en', ReaderReview[]>>> = {};

// Avis Google publics transmis par Emilie le 8 novembre 2026.
// Les citations restent dans leur langue d'origine afin de ne pas modifier les témoignages.
const verifiedTestimonials: ReaderReview[] = [
  {
    name: 'Lorraine L. — Cliente, Montréal',
    quote: 'Absolument le meilleur service et le meilleur accompagnement qui existent.',
    rating: 5,
  },
  {
    name: 'Chloe L. — Acheteuse, Vaudreuil-Dorion',
    quote: "Emilie est une des courtières immobilières qui est vraiment attentionnée, professionnelle et à l'écoute de nos besoins ! Elle a démontrée une grande rigueur dans la gestion des dossiers entre les vendeurs et les acheteurs et a su au moment opportun utiliser son expertise et ses connaissances pour que nous ses clients recevions notre dû dans le processus. Nous avons toujours été en confiance avec elle et avons pu trouver notre maison de rêve qui convenait à nos besoins. N'hésitez pas à la choisir, vous ne le regretterez pas !",
    rating: 5,
  },
  {
    name: 'Audrey G. — Premiers acheteurs, Montréal',
    quote: "Emilie nous a accompagné dans notre projet d'achat de première propriété avec beaucoup d'écoute et de disponibilité. Nous avons trouvé la perle rare et Emilie nous a aidé dans ces démarches. Nous la recommandons avec enthousiasme!",
    rating: 5,
  },
  {
    name: 'Bruno C. — Client, Duhamel',
    quote: "Emilie Cauvier est une courtière d'expérience et compétente, très disponible et professionnelle ! Elle s'est toujours assuré de ma satisfaction, à l'écoute de mes besoins ! Je la recommande assurément ! Merci Emilie pour tous vos bons services ! Bruno Crégheur, client extrêmement satisfait !",
    rating: 5,
  },
  {
    name: 'Josée P. — Cliente',
    quote: "Excellent service, très professionnelle et à l'écoute ! Je vous la recommande à 100% pour vos futures transactions.",
    rating: 5,
  },
  {
    name: 'Bruno R. — Vendeur',
    quote: 'Emilie a toujours été là pour nous aider dans les démarche pour vendre notre maison. Je là recommande comme agent immobilier elle est professionnelle',
    rating: 5,
  },
];

export const testimonials: Record<'fr' | 'en', ReaderReview[]> = {
  fr: verifiedTestimonials,
  en: verifiedTestimonials,
};
