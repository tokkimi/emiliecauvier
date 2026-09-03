'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const inputCls =
  'mt-1 w-full rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2.5 font-body text-[var(--color-ink)] outline-none focus:border-[var(--color-bordeaux)]';
const btnCls =
  'w-full rounded-full bg-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/compte';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError('Email ou mot de passe incorrect.');
    else router.push(next);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        Email
        <input name="email" type="email" required className={inputCls} autoComplete="email" />
      </label>
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        Mot de passe
        <input name="password" type="password" required className={inputCls} autoComplete="current-password" />
      </label>
      {error && <p className="font-ui text-sm text-red-600">{error}</p>}
      <button disabled={loading} className={btnCls}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
      <p className="text-center font-ui text-sm text-[var(--color-ink)]/60">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-[var(--color-bordeaux)] hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get('plan');
  const next = params.get('next') ?? '/compte';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: form.get('name'), source: plan ? `plan:${plan}` : 'site' }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? 'Inscription impossible.');
      return;
    }

    // Connexion automatique.
    await signIn('credentials', { email, password, redirect: false });

    // Si l'utilisateur venait pour l'abonnement, on lance directement le checkout.
    if (plan === 'abonnement') {
      const co = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'subscription' }),
      });
      const cd = await co.json();
      if (cd.url) {
        window.location.href = cd.url;
        return;
      }
    }
    setLoading(false);
    router.push(next);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {plan === 'abonnement' && (
        <p className="rounded-lg bg-[var(--color-sand)] px-4 py-3 font-ui text-sm text-[var(--color-bordeaux)]">
          Vous créez un compte pour l&apos;abonnement (19 $/mois). Le paiement suit la création du compte.
        </p>
      )}
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        Nom (optionnel)
        <input name="name" type="text" className={inputCls} autoComplete="name" />
      </label>
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        Email
        <input name="email" type="email" required className={inputCls} autoComplete="email" />
      </label>
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        Mot de passe (8 caractères min.)
        <input name="password" type="password" required minLength={8} className={inputCls} autoComplete="new-password" />
      </label>
      {error && <p className="font-ui text-sm text-red-600">{error}</p>}
      <button disabled={loading} className={btnCls}>
        {loading ? 'Création…' : 'Créer mon compte'}
      </button>
      <p className="text-center font-ui text-sm text-[var(--color-ink)]/60">
        Déjà inscrit ?{' '}
        <Link href={`/connexion?next=${encodeURIComponent(next)}`} className="text-[var(--color-bordeaux)] hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
