import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/AuthForms';

export const metadata: Metadata = { title: 'Créer un compte' };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl text-[var(--color-ink)]">Créer un compte</h1>
      <p className="mt-2 font-body text-[var(--color-ink)]/70">
        Un compte pour acheter, lire en ligne et télécharger vos guides.
      </p>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
