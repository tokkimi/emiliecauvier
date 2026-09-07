/** Only local absolute paths may be used after login; never javascript: or //hosts. */
export function safeRedirect(value: string | null | undefined, fallback = '/compte'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\\\u0000-\u0020]/.test(value)) return fallback;
  try {
    const parsed = new URL(value, 'https://local.invalid');
    return parsed.origin === 'https://local.invalid' ? parsed.pathname + parsed.search + parsed.hash : fallback;
  } catch { return fallback; }
}
