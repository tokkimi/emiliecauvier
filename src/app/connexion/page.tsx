import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/AuthForms';

export const metadata: Metadata = { title: 'Connexion' };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl text-[var(--color-ink)]">Connexion</h1>
      <p className="mt-2 font-body text-[var(--color-ink)]/70">Accédez à vos guides et à vos téléchargements.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
