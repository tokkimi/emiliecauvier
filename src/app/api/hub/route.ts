import { NextResponse } from 'next/server';
import { isHubRequest } from '@/lib/hub/auth';
import { guidesAction, guidesSnapshot, HubError } from '@/lib/hub/snapshot';

export const dynamic = 'force-dynamic';

const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

// Connecteur de la console centrale (i-ateliers.com/console).
export async function GET(req: Request) {
  if (!isHubRequest(req)) return json({ error: 'Accès refusé' }, 401);
  try {
    return json(await guidesSnapshot());
  } catch (e) {
    console.error('Hub snapshot', e instanceof Error ? e.message : 'unknown');
    return json({ error: 'Données de la boutique indisponibles.' }, 503);
  }
}

export async function POST(req: Request) {
  if (!isHubRequest(req)) return json({ error: 'Accès refusé' }, 401);
  const body = (await req.json().catch(() => null)) as { action?: unknown; payload?: unknown } | null;
  if (!body || typeof body.action !== 'string') return json({ error: 'Action invalide' }, 400);
  const payload = body.payload && typeof body.payload === 'object' ? (body.payload as Record<string, unknown>) : {};
  try {
    return json(await guidesAction(body.action, payload));
  } catch (e) {
    if (e instanceof HubError) return json({ error: e.message }, 400);
    console.error('Hub action', e instanceof Error ? e.message : 'unknown');
    return json({ error: 'Action impossible : élément introuvable ou déjà modifié.' }, 400);
  }
}
