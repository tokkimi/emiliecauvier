import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

function csv(value: string) {
  const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') return new Response(null, { status: 403 });
  const marketingOnly = new URL(request.url).searchParams.get('marketing') === '1';
  const leads = await prisma.chapterLead.findMany({
    where: marketingOnly ? { marketingOptInAt: { not: null } } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  const lines = leads.map(lead => [
    lead.email, lead.guideSlug, lead.locale, lead.createdAt.toISOString(), lead.marketingOptInAt?.toISOString() ?? '',
  ].map(csv).join(','));
  return new Response(['email,guide,langue,acces_le,consentement_marketing_le', ...lines].join('\r\n'), {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="chapitres-gratuits.csv"', 'cache-control': 'no-store' },
  });
}
