'use client';

import { useEffect } from 'react';
import { clearCartSlugs } from '@/lib/cart';

export function ClearCartOnSuccess() {
  useEffect(() => {
    clearCartSlugs();
  }, []);
  return null;
}
