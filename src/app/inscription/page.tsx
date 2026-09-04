import { Suspense } from 'react';
import { RegisterForm } from '@/components/AuthForms';
import { getLocale, getT } from '@/lib/i18n';

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: locale === 'en' ? 'Create an account' : 'Créer un compte' };
}

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = await getT();
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl text-[var(--color-ink)]">{t.auth_register_title}</h1>
      <p className="mt-2 font-body text-[var(--color-ink)]/70">
        {t.auth_register_desc}
      </p>
      <Suspense>
        <RegisterForm locale={locale} />
      </Suspense>
    </div>
  );
}
