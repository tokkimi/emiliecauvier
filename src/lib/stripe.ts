import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;

// On instancie paresseusement pour que le build fonctionne sans clé (ex. CI).
export const stripe = key
  ? new Stripe(key, { apiVersion: '2025-02-24.acacia' })
  : (null as unknown as Stripe);

export const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRICE_SUBSCRIPTION ?? '';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export function assertStripe(): Stripe {
  if (!stripe) throw new Error('Stripe non configuré (STRIPE_SECRET_KEY manquant).');
  return stripe;
}
