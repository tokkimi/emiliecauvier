import { APP_URL } from '@/lib/stripe';
import { createPurchaseDownloadToken } from '@/lib/purchaseDownloadToken';
import { bySlug } from '@/data/books';
import { localizeBook } from '@/data/booksEn';
import type { Locale } from '@/lib/i18n';
import { loadPurchaseAttachments } from '@/lib/purchaseAttachments';

type PurchasedGuide = {
  purchaseId: string;
  ebookId: string;
  slug: string;
  title: string;
  createdAt: Date;
};

const DEFAULT_FROM = 'Guides Immo Québec <noreply@guidesimmoquebec.com>';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendPurchaseEmail({
  to,
  guides,
  stripeSessionId,
  locale = 'fr',
}: {
  to: string | null | undefined;
  guides: PurchasedGuide[];
  stripeSessionId: string;
  locale?: Locale;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to || guides.length === 0) return { sent: false, reason: 'missing_config_or_recipient' };

  let batches;
  try { batches = await loadPurchaseAttachments(guides.map(guide => guide.slug), locale); }
  catch { console.error('Purchase PDF attachments unavailable'); return { sent: false, reason: 'attachment_error' }; }

  const items = [...guides].sort((a,b) => a.purchaseId.localeCompare(b.purchaseId))
    .map((guide) => {
      const token = createPurchaseDownloadToken(guide.purchaseId, guide.ebookId, guide.createdAt.getTime());
      const book = bySlug(guide.slug);
      const title = book ? localizeBook(book, locale).title : guide.title;
      const downloadUrl = `${APP_URL}/api/download?slug=${encodeURIComponent(guide.slug)}&purchase=${encodeURIComponent(guide.purchaseId)}&token=${encodeURIComponent(token)}&lang=${locale}`;
      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #eadfd4;">
            <p style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#6f1828;font-weight:700;">${escapeHtml(title)}</p>
            <a href="${downloadUrl}" style="display:inline-block;margin-bottom:8px;padding:10px 16px;border-radius:999px;background:#6f1828;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">${locale === 'en' ? 'Download the PDF' : 'Télécharger le PDF'}</a>
          </td>
        </tr>`;
    })
    .join('');

  const subject = locale === 'en'
    ? guides.length > 1 ? 'Your real estate guides are ready' : 'Your real estate guide is ready'
    : guides.length > 1 ? 'Vos guides immobiliers sont prêts' : 'Votre guide immobilier est prêt';
  const html = `
    <div style="margin:0;padding:0;background:#f7f2ec;font-family:Arial,Helvetica,sans-serif;color:#241f1d;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f2ec;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffaf4;border:1px solid #eadfd4;border-radius:18px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 18px;background:#6f1828;color:#fffaf4;">
                  <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d6b16a;">Guides Immo Québec</p>
                  <h1 style="margin:0;font-size:28px;line-height:1.15;">${locale === 'en' ? 'Thank you for your purchase' : 'Merci pour votre achat'}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:26px 28px;">
                  <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#4b4545;">${locale === 'en' ? 'Your purchased PDFs are attached to this email. Save them to your device to keep them, with or without an account. Secure download links are also provided below.' : 'Les PDF achetés sont joints à ce courriel. Enregistrez-les sur votre appareil pour les conserver, avec ou sans compte. Vous trouverez aussi les liens de téléchargement sécurisés ci-dessous.'}</p>
                  ${batches.length > 1 ? `<p style="font-size:14px;line-height:1.5;">${locale === 'en' ? `Your order is split into ${batches.length} emails to keep the attachments manageable. Each email contains different PDFs; keep all parts.` : `Votre commande est répartie dans ${batches.length} courriels pour limiter la taille des pièces jointes. Chaque courriel contient des PDF différents : conservez toutes les parties.`}</p>` : ''}
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${items}</table>
                  <p style="margin:22px 0 0;font-size:13px;line-height:1.5;color:#6f625d;">${locale === 'en' ? 'These personal download links are valid for one year from purchase. The PDF attachments can be kept without a time limit. If you purchased while logged in, your guides are also in your account.' : 'Ces liens personnels sont valables un an à partir de l’achat. Les PDF joints peuvent être conservés sans limite de durée. Si vous avez acheté en étant connecté, vos guides figurent aussi dans votre compte.'}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;

  const emailIds: string[] = [];
  for (const [index, attachments] of batches.entries()) {
  let response: Response;
  try {
    if (index > 0) await new Promise(resolve => setTimeout(resolve, 600));
    response = await fetch('https://api.resend.com/emails', {
      signal: AbortSignal.timeout(10000),
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `purchase-pdf-v2-${stripeSessionId}-${locale}-${index + 1}`,
      },
      body: JSON.stringify({
        from: process.env.PURCHASE_EMAIL_FROM || DEFAULT_FROM,
        to,
        subject: batches.length > 1 ? `${subject} (${index + 1}/${batches.length})` : subject,
        html,
        attachments,
      }),
    });
  } catch (err) {
    console.error('Purchase email failed', err);
    return { sent: false, reason: 'network_error' };
  }

  if (!response.ok) {
    console.error('Purchase email failed', response.status);
    return { sent: false, reason: 'provider_error' };
  }
  const result = await response.json().catch(() => null) as { id?: string } | null;
  if (!result?.id) return { sent: false, reason: 'invalid_provider_response' };
  emailIds.push(result.id);
  }

  // Accepted by the provider, not a claim of delivery to the recipient's inbox.
  return { sent: true, emailIds, attachmentCount: batches.reduce((count, batch) => count + batch.length, 0) };
}
