'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

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

const tx = {
  fr: {
    info: 'Informations',
    profile: 'Votre profil',
    displayName: 'Nom affiché',
    email: 'Courriel',
    preferredLanguage: 'Langue préférée',
    updateImpossible: 'Mise à jour impossible.',
    profileUpdated: 'Profil mis à jour.',
    saveLoading: 'Enregistrement…',
    saveProfile: 'Enregistrer le profil',
    security: 'Sécurité',
    passwordTitle: 'Changer le mot de passe',
    passwordHelp: 'Utilisez au moins 10 caractères.',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le nouveau mot de passe',
    mismatch: 'Les nouveaux mots de passe ne correspondent pas.',
    changeImpossible: 'Modification impossible.',
    passwordUpdated: 'Mot de passe modifié avec succès.',
    changeLoading: 'Modification…',
    changePassword: 'Modifier le mot de passe',
  },
  en: {
    info: 'Information',
    profile: 'Your profile',
    displayName: 'Display name',
    email: 'Email',
    preferredLanguage: 'Preferred language',
    updateImpossible: 'Unable to update.',
    profileUpdated: 'Profile updated.',
    saveLoading: 'Saving…',
    saveProfile: 'Save profile',
    security: 'Security',
    passwordTitle: 'Change password',
    passwordHelp: 'Use at least 10 characters.',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    mismatch: 'The new passwords do not match.',
    changeImpossible: 'Unable to change password.',
    passwordUpdated: 'Password changed successfully.',
    changeLoading: 'Updating…',
    changePassword: 'Change password',
  },
};

export function AccountSettings({ name, email, locale, uiLocale }: { name: string; email: string; locale: string; uiLocale: Locale }) {
  const router = useRouter();
  const t = tx[uiLocale];
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
      if (!response.ok) throw new Error(data.error ?? t.updateImpossible);
      document.cookie = `lang=${selectedLocale}; path=/; max-age=31536000; samesite=lax`;
      setProfileFeedback({ kind: 'success', message: t.profileUpdated });
      router.refresh();
    } catch (error) {
      setProfileFeedback({ kind: 'error', message: error instanceof Error ? error.message : t.updateImpossible });
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
      setPasswordFeedback({ kind: 'error', message: t.mismatch });
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
      if (!response.ok) throw new Error(data.error ?? t.changeImpossible);
      setPasswordFeedback({ kind: 'success', message: t.passwordUpdated });
      formElement.reset();
    } catch (error) {
      setPasswordFeedback({ kind: 'error', message: error instanceof Error ? error.message : t.changeImpossible });
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 sm:p-7">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">{t.info}</p>
        <h3 className="mt-2 font-display text-2xl">{t.profile}</h3>
        <label className="mt-6 block font-ui text-sm font-medium">
          {t.displayName}
          <input name="name" defaultValue={name} maxLength={80} autoComplete="name" className={inputClass} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          {t.email}
          <input value={email} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          {t.preferredLanguage}
          <select name="locale" defaultValue={locale} className={inputClass}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <button
          disabled={profileBusy}
          className="mt-6 rounded-full bg-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm font-medium text-white transition hover:bg-[var(--color-bordeaux-dark)] disabled:opacity-50"
        >
          {profileBusy ? t.saveLoading : t.saveProfile}
        </button>
        <FeedbackMessage value={profileFeedback} />
      </form>

      <form onSubmit={changePassword} className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 sm:p-7">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">{t.security}</p>
        <h3 className="mt-2 font-display text-2xl">{t.passwordTitle}</h3>
        <p className="mt-2 font-body text-sm text-[var(--color-ink)]/60">{t.passwordHelp}</p>
        <label className="mt-6 block font-ui text-sm font-medium">
          {t.currentPassword}
          <input name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          {t.newPassword}
          <input name="newPassword" type="password" required minLength={10} maxLength={72} autoComplete="new-password" className={inputClass} />
        </label>
        <label className="mt-4 block font-ui text-sm font-medium">
          {t.confirmPassword}
          <input name="confirmPassword" type="password" required minLength={10} maxLength={72} autoComplete="new-password" className={inputClass} />
        </label>
        <button
          disabled={passwordBusy}
          className="mt-6 rounded-full border border-[var(--color-bordeaux)] px-5 py-2.5 font-ui text-sm font-medium text-[var(--color-bordeaux)] transition hover:bg-[var(--color-sand)] disabled:opacity-50"
        >
          {passwordBusy ? t.changeLoading : t.changePassword}
        </button>
        <FeedbackMessage value={passwordFeedback} />
      </form>
    </div>
  );
}
