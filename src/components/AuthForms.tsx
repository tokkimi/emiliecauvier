'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import type { Locale } from '@/lib/i18n';

const inputCls =
  'mt-1 w-full rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2.5 font-body text-[var(--color-ink)] outline-none focus:border-[var(--color-bordeaux)]';
const btnCls =
  'w-full rounded-full bg-[var(--color-bordeaux)] py-3 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-60';

const tx = {
  fr: {
    email: 'Email',
    password: 'Mot de passe',
    badCredentials: 'Email ou mot de passe incorrect.',
    loginLoading: 'Connexion…',
    login: 'Se connecter',
    noAccount: 'Pas encore de compte ?',
    signup: 'Créer un compte',
    subscriptionNotice: 'Vous créez un compte pour l’abonnement (19 $/mois). Le paiement suit la création du compte.',
    name: 'Nom (optionnel)',
    passwordMin: 'Mot de passe (8 caractères min.)',
    registerError: 'Inscription impossible.',
    registerLoading: 'Création…',
    register: 'Créer mon compte',
    alreadyMember: 'Déjà inscrit ?',
  },
  en: {
    email: 'Email',
    password: 'Password',
    badCredentials: 'Incorrect email or password.',
    loginLoading: 'Logging in…',
    login: 'Log in',
    noAccount: 'No account yet?',
    signup: 'Create an account',
    subscriptionNotice: 'You are creating an account for the subscription ($19/month). Payment follows account creation.',
    name: 'Name (optional)',
    passwordMin: 'Password (8 characters min.)',
    registerError: 'Sign-up unavailable.',
    registerLoading: 'Creating…',
    register: 'Create my account',
    alreadyMember: 'Already registered?',
  },
};

export function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/compte';
  const t = tx[locale];
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
    if (res?.error) setError(t.badCredentials);
    else router.push(next);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        {t.email}
        <input name="email" type="email" required className={inputCls} autoComplete="email" />
      </label>
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        {t.password}
        <input name="password" type="password" required className={inputCls} autoComplete="current-password" />
      </label>
      {error && <p className="font-ui text-sm text-red-600">{error}</p>}
      <button disabled={loading} className={btnCls}>
        {loading ? t.loginLoading : t.login}
      </button>
      <p className="text-center font-ui text-sm text-[var(--color-ink)]/60">
        {t.noAccount}{' '}
        <Link href="/inscription" className="text-[var(--color-bordeaux)] hover:underline">
          {t.signup}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get('plan');
  const next = params.get('next') ?? '/compte';
  const t = tx[locale];
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
      setError(data.error ?? t.registerError);
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
          {t.subscriptionNotice}
        </p>
      )}
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        {t.name}
        <input name="name" type="text" className={inputCls} autoComplete="name" />
      </label>
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        {t.email}
        <input name="email" type="email" required className={inputCls} autoComplete="email" />
      </label>
      <label className="block font-ui text-sm text-[var(--color-ink)]/80">
        {t.passwordMin}
        <input name="password" type="password" required minLength={8} className={inputCls} autoComplete="new-password" />
      </label>
      {error && <p className="font-ui text-sm text-red-600">{error}</p>}
      <button disabled={loading} className={btnCls}>
        {loading ? t.registerLoading : t.register}
      </button>
      <p className="text-center font-ui text-sm text-[var(--color-ink)]/60">
        {t.alreadyMember}{' '}
        <Link href={`/connexion?next=${encodeURIComponent(next)}`} className="text-[var(--color-bordeaux)] hover:underline">
          {t.login}
        </Link>
      </p>
    </form>
  );
}
