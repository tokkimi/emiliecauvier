'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { canMeasure, CONSENT_EVENT, GA_ID, META_ID, track } from '@/lib/measurement';

export function Measurement() {
  const path = usePathname();
  useEffect(() => {
    if (!GA_ID && !META_ID) return;
    const page = () => {
      if (!canMeasure() || path.startsWith('/admin')) return;
      track('page_view');

    };
    page();
    window.addEventListener(CONSENT_EVENT, page);
    return () => window.removeEventListener(CONSENT_EVENT, page);
  }, [path]);
  return null;
}

export function ViewGuideMeasurement({ slug, title, priceCents }: { slug: string; title: string; priceCents: number }) {
  useEffect(() => {
    const view = () => track('view_item', { items: [{ item_id: slug, item_name: title, price: priceCents / 100, quantity: 1 }], value: priceCents / 100 });
    view();
    window.addEventListener(CONSENT_EVENT, view);
    return () => window.removeEventListener(CONSENT_EVENT, view);
  }, [slug, title, priceCents]);
  return null;
}

export function PurchaseMeasurement({ id, items, value }: {
  id: string;
  items: { item_id: string; item_name: string; price?: number; quantity: number }[];
  value: number;
}) {
  useEffect(() => {
    if ((!GA_ID && !META_ID) || !canMeasure()) return;
    try {
      const key = `guidimo-purchase:${id}`;
      if (localStorage.getItem(key)) return;
      track('purchase', { items, value, transactionId: id });
      localStorage.setItem(key, '1');
    } catch { /* measurement is optional */ }
  }, [id, items, value]);
  return null;
}
