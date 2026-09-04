# La Bibliothèque — Boutique d'ebooks d'Emilie Cauvier

Boutique e-commerce complète pour les 50 guides immobiliers d'Emilie Cauvier :
lecture en ligne (avec menu de chapitres) **+** téléchargement PDF, achat à l'unité **et**
abonnement mensuel, comptes utilisateurs, et back-office (catalogue, utilisateurs,
**stats & compta**).

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Prisma** + PostgreSQL (modèle complet dans `prisma/schema.prisma`)
- **Auth.js v5** (email + mot de passe, sessions JWT, bcrypt)
- **Stripe** — achat à l'unité (Checkout `payment`) + abonnement (Checkout `subscription`)
- **Resend** — email automatique après achat avec liens PDF sécurisés
- Lecteur en ligne gated + téléchargement PDF par lien signé

## Modèle de données (résumé)

| Modèle | Rôle |
|---|---|
| `User` | comptes, rôle, abonnement Stripe, provenance marketing |
| `Ebook` | catalogue des 50 guides (prix, collection, fichiers PDF, aperçu) |
| `Purchase` | achats à l'unité / coffret / accès abonnement |
| `DownloadEvent` | journal des téléchargements (liens signés) |
| `AnalyticsEvent` | page views, checkout, achats (stats) |
| `DailyRevenue` | agrégat quotidien pour le tableau de bord **compta** |
| `NewsletterSubscriber` | aimant à prospects (1 chapitre gratuit) |

## Démarrage local

```bash
npm install
cp .env.example .env         # remplir DATABASE_URL, AUTH_SECRET, clés Stripe
npx prisma migrate dev --name init
npm run seed                 # charge les 50 guides
npm run dev                  # http://localhost:3000
```

## Déploiement (GitHub → Vercel)

1. Pousser ce dépôt sur GitHub.
2. Importer le repo dans **Vercel**.
3. Ajouter une base **Postgres** (Vercel Postgres / Neon / Supabase) → `DATABASE_URL`.
4. Renseigner les variables d'environnement (voir `.env.example`).
5. Configurer le **webhook Stripe** vers `/api/stripe/webhook`.
6. Configurer `RESEND_API_KEY` et `PURCHASE_EMAIL_FROM` pour envoyer les PDF achetés par email.

## Structure

```
prisma/schema.prisma      Modèle de données complet
prisma/seed.ts            Import des 50 guides + compte admin
src/data/books.ts         Catalogue (source des guides)
src/data/reader/*.json    Contenu du lecteur en ligne (chapitres + QCM)
scripts/gen_reader_content.py  Génère src/data/reader depuis les contenus source
storage/pdf/*.pdf         PDF privés — servis UNIQUEMENT via /api/download (gated)
src/app/                  Pages : landing, catalogue, fiche, lecteur, compte, admin
src/app/api/              Auth, Stripe (checkout + webhook + portal), download gated
src/lib/                  db, auth, stripe, entitlements, reader, format
```

> 🔒 Les PDF sont dans `storage/` (hors `public/`) : ils ne sont jamais servis en
> statique. Le lecteur en ligne ne transmet au navigateur que les chapitres
> débloqués (le 1ᵉʳ en aperçu). Achat/abonnement contrôlés à chaque accès.

## Comptes de démo (après `npm run seed`)

- **Admin** : `emilie@labibliotheque.ca` / `ChangeMoi2026!` (→ `/admin`)

## Prix (configurables)

- **À l'unité** : 14 $ CAD / guide
- **Abonnement** : 19 $ CAD / mois — accès aux 50 guides + nouvelles éditions

> ⚠️ Contenu éducatif. Les montants immobiliers cités dans les guides (taxe de
> bienvenue, RAP/CELIAPP…) sont datés « édition 2026 » et à valider.
