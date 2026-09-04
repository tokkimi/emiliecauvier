import { Suspense } from 'react';
import { LoginForm } from '@/components/AuthForms';
import { getLocale, getT } from '@/lib/i18n';

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: locale === 'en' ? 'Log in' : 'Connexion' };
}

export default async function LoginPage() {
  const locale = await getLocale();
  const t = await getT();
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl text-[var(--color-ink)]">{t.auth_login_title}</h1>
      <p className="mt-2 font-body text-[var(--color-ink)]/70">{t.auth_login_desc}</p>
      <Suspense>
        <LoginForm locale={locale} />
      </Suspense>
    </div>
  );
}
