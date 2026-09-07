# Contrôle de lancement — 7 septembre 2026

## Livré

- Guide 50 français : nouvelle couverture chalet crème/bourgogne, catalogue et PDF. Les 12 autres pages du PDF français sont préservées.
- Les 48 rectos anglais déjà publiés restent inchangés. Le verso approuvé avec le portrait d'Emilie est intégré aux 48 PDF anglais ; toutes les autres pages ont été comparées avant/après (texte et pixels).
- Miniatures réelles dans le panier ; libellés de langue sélectionnables accessibles ; bulle compacte sur mobile ; pas de barre panier sur la page panier ; focus visible, navigation clavier, réduction des animations, formulaires mobiles sans zoom automatique, avis du lecteur défilable.

## Sécurité et fiabilité corrigées

- Suppression du secret de démonstration en production : configuration manquante = refus sécurisé.
- Rôle et existence du compte revalidés en base ; sessions versionnées par empreinte du mot de passe pour invalider les sessions après changement. Les anciennes sessions sont migrées à leur prochaine utilisation.
- Rejet des écritures provenant d'une autre origine sur les API de compte, inscription, paiement et quiz.
- Limites de saisie et limites de tentatives locales sur connexion/inscription/changement de mot de passe.
- Redirections après authentification limitées aux chemins internes ; erreurs réseau des formulaires gérées.
- En-têtes anti-framing, MIME sniffing, politique de référent et restrictions caméra/micro.
- Paiements différés : aucun accès accordé tant que non payé ; traitement de la réussite asynchrone.
- Déduplication transactionnelle des événements Stripe via verrou PostgreSQL et enregistrement persistant, sans nouvelle table ni migration.
- Échec du courriel : webhook non acquitté pour permettre les réessais Stripe. Jetons de téléchargement déterministes pour stabiliser les réessais d'email.
- Mise à jour corrective de qs 6.15.3 vers 6.16.0 ; audit production : zéro vulnérabilité signalée.

## Vérifications reproductibles

- `npx tsx scripts/launch-security-tests.ts` : jetons modifiés/expirés, secret obligatoire, origines, redirections, limites, absence de signature, paiement non payé, événement dupliqué, échec email. Stripe, email et base simulés : aucun débit ni donnée client modifiée.
- `npx tsx scripts/verify-cover-previews.tsx` : 48 couvertures FR et 48 EN.
- `npx next build --webpack` : compilation et TypeScript.
- `scripts/launch-browser-check.cjs` : 7 pages à 390 et 1440 px, absence de débordement, panier, choix invité, assistant et fermeture Échap, anglais.
- `scripts/launch-live-check.cjs` et `scripts/verify-deployed-covers.cjs --back` : contrôles non destructifs après publication.

## Limites à ne pas confondre avec une certification

Ce contrôle n'est pas un pentest exhaustif. Aucun achat réel ni livraison réelle dans une boîte email n'a été déclenché. Les parcours authentifiés admin/client et les droits réels d'un abonnement n'ont pas été validés avec des comptes de test en production ; leur code a été inspecté. Un dernier achat de recette avec réception effective de l'email reste nécessaire avant d'augmenter les dépenses publicitaires.

Points restant à traiter séparément : limitation distribuée au niveau du pare-feu (les limites actuelles sont par instance), réinitialisation autonome du mot de passe oublié, rattachement vérifié des achats invités à un futur compte, révocation des cookies d'achat invité après remboursement, politique complète de consentement des préférences. Le stockage externe PDF_BUCKET_URL comporte encore un ancien mode de redirection non signé : ne pas activer un bucket public pour des PDF payants. Les URL de téléchargement par email expirent après un an.

L'assistant est un moteur de recommandation documentaire par mots-clés, pas un système de réponses sourcées page par page. Les chapitres proposés sont génériques. Les outils immobiliers sont des estimations ; leurs hypothèses financières/fiscales n'ont pas été certifiées dans ce contrôle de lancement.

## Sources techniques

- https://docs.stripe.com/webhooks — signatures, doublons et réessais.
- https://github.com/stripe/ai/blob/main/skills/stripe-best-practices/references/payments.md — événements asynchrones et état payé.
- https://nextjs.org/docs/app/api-reference/config/next-config-js/headers — en-têtes de réponse.

## Visuels

Génération intégrée ImageGen, sans surimpression. Sources/prompts des rectos anglais : scripts/english-cover-artwork.json. Recto français 50 : traduction du visuel anglais existant avec les textes « Acheter un chalet », « Résidence secondaire au Québec — rêve, réalité et vérifications essentielles. », « NICHES », « COLLECTION », « ÉDITION 2026 » ; logo, photo, courbe crème et palette conservés. Master : ../english-cover-masters/50-fr.png ; asset publié : public/covers/50.jpg.
