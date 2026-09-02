'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Feedback = { kind: 'success' | 'error'; message: string } | null;

function FeedbackMessage({ value }: { value: Feedback }) {
  return value ? (
    <p
      aria-live="polite"
      className={`mt-3 font-ui text-sm ${value.kind === 'success' ? 'text-green-700' : 'text-[var(--color-bordeaux)]'}`}
    >
      {value.message}
    </p>
  ) : null;
}

const inputClass =
  'mt-2 w-full rounded-xl border border-[var(--color-sand)] bg-[var(--color-cream)] px-4 py-3 font-ui text-sm outline-none transition focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/15';

export function AccountSettings({ name, email, locale }: { name: string; email: string; locale: string }) {
  const router = useRouter();
  const [profileBusy, setProfileBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileBusy(true);
    setProfileFeedback(null);
    const form = new FormData(event.currentTarget);
    const selectedLocale = String(form.get('locale') ?? 'fr');
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), locale: selectedLocale }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Mise à jour impossible.');
      document.cookie = `lang=${selectedLocale}; path=/; max-age=31536000; samesite=lax`;
      setProfileFeedback({ kind: 'success', message: 'Profil mis à jour.' });
      router.refresh();
    } catch (error) {
      setProfileFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'Mise à jour impossible.' });
    } finally {
      setProfileBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordBusy(true);
    setPasswordFeedback(null);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newPassword = String(form.get('newPassword') ?? '');
    if (newPassword !== String(form.get('confirmPassword') ?? '')) {
      setPasswordFeedback({ kind: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
      setPasswordBusy(false);
      return;
    }
    try {
      const response = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.get('currentPassword'), newPassword }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Modification impossible.');
      setPasswordFeedback({ kind: 'success', message: 'Mot de passe modifié avec succès.' });
      formElement.reset();
    } catch (error) {
      setPasswordFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'Modification impossible.' });
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 sm:p-7">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Informations</p>
        <h3 className="mt-2 font-display text-2xl">Votre profil</h3>
        <label className="mt-6 block font-ui text-sm font-medium">
          Nom affiché
          <input name="name" defaultValue={name} maxLength={80} autoComplete="name" className={inputClass} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          Courriel
          <input value={email} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          Langue préférée
          <select name="locale" defaultValue={locale} className={inputClass}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <button
          disabled={profileBusy}
          className="mt-6 rounded-full bg-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-50"
        >
          {profileBusy ? 'Enregistrement…' : 'Enregistrer le profil'}
        </button>
        <FeedbackMessage value={profileFeedback} />
      </form>

      <form onSubmit={changePassword} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 sm:p-7">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">Sécurité</p>
        <h3 className="mt-2 font-display text-2xl">Changer le mot de passe</h3>
        <p className="mt-2 font-body text-sm text-[var(--color-ink)]/60">Utilisez au moins 10 caractères.</p>
        <label className="mt-6 block font-ui text-sm font-medium">
          Mot de passe actuel
          <input name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          Nouveau mot de passe
          <input name="newPassword" type="password" required minLength={10} maxLength={72} autoComplete="new-password" className={inputClass} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          Confirmer le nouveau mot de passe
          <input name="confirmPassword" type="password" required minLength={10} maxLength={72} autoComplete="new-password" className={inputClass} />
        </label>
        <button
          disabled={passwordBusy}
          className="mt-6 rounded-full border border-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)] disabled:opacity-50"
        >
          {passwordBusy ? 'Modification…' : 'Modifier le mot de passe'}
        </button>
        <FeedbackMessage value={passwordFeedback} />
      </form>
    </div>
  );
}
