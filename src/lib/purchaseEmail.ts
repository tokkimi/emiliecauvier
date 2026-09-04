import { APP_URL } from '@/lib/stripe';
import { createPurchaseDownloadToken } from '@/lib/purchaseDownloadToken';

type PurchasedGuide = {
  purchaseId: string;
  ebookId: string;
  slug: string;
  title: string;
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
}: {
  to: string | null | undefined;
  guides: PurchasedGuide[];
  stripeSessionId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to || guides.length === 0) return { sent: false, reason: 'missing_config_or_recipient' };

  const items = guides
    .map((guide) => {
      const token = createPurchaseDownloadToken(guide.purchaseId, guide.ebookId);
      const downloadUrl = `${APP_URL}/api/download?slug=${encodeURIComponent(guide.slug)}&purchase=${encodeURIComponent(guide.purchaseId)}&token=${encodeURIComponent(token)}`;
      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #eadfd4;">
            <p style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#6f1828;font-weight:700;">${escapeHtml(guide.title)}</p>
            <a href="${downloadUrl}" style="display:inline-block;margin-bottom:8px;padding:10px 16px;border-radius:999px;background:#6f1828;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">Télécharger le PDF</a>
          </td>
        </tr>`;
    })
    .join('');

  const subject = guides.length > 1 ? 'Vos guides immobiliers sont prêts' : 'Votre guide immobilier est prêt';
  const html = `
    <div style="margin:0;padding:0;background:#f7f2ec;font-family:Arial,Helvetica,sans-serif;color:#241f1d;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f2ec;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffaf4;border:1px solid #eadfd4;border-radius:18px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 18px;background:#6f1828;color:#fffaf4;">
                  <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d6b16a;">Guides Immo Québec</p>
                  <h1 style="margin:0;font-size:28px;line-height:1.15;">Merci pour votre achat</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:26px 28px;">
                  <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#4b4545;">Vos PDF sont disponibles ci-dessous. Gardez cet email: il vous permet de retrouver vos guides même si vous avez continué sans créer de compte.</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${items}</table>
                  <p style="margin:22px 0 0;font-size:13px;line-height:1.5;color:#6f625d;">Les liens sont sécurisés et réservés à votre achat. Vous pouvez aussi créer un profil plus tard pour retrouver vos guides dans votre espace lecteur.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `purchase-email-${stripeSessionId}`,
      },
      body: JSON.stringify({
        from: process.env.PURCHASE_EMAIL_FROM || DEFAULT_FROM,
        to,
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error('Purchase email failed', err);
    return { sent: false, reason: 'network_error' };
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('Purchase email failed', response.status, body);
    return { sent: false, reason: 'provider_error' };
  }

  return { sent: true };
}
