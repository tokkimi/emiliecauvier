'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LangToggle } from './LangToggle';
import { CartLink } from './CartLink';

type Item = { href: string; label: string; cta?: boolean; admin?: boolean };

/** Menu déroulant (hamburger) affiché uniquement sur mobile. */
export function MobileMenu({ items, showCart = false }: { items: Item[]; showCart?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-sand)] text-[var(--color-bordeaux)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
        </svg>
      </button>

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[64px] z-30 cursor-default bg-black/10"
          />
          <div className="absolute left-0 right-0 top-full z-40 border-b border-[var(--color-sand)] bg-[var(--color-cream)] shadow-lg">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 font-ui text-base">
              {showCart && <CartLink mobile />}
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={
                    it.cta
                      ? 'mt-1 rounded-full bg-[var(--color-bordeaux)] px-4 py-2.5 text-center font-medium text-white'
                      : `rounded-lg px-2 py-2.5 ${it.admin ? 'text-[var(--color-gold)]' : 'text-[var(--color-ink)]'} hover:bg-white`
                  }
                >
                  {it.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-[var(--color-sand)] pt-3">
                <LangToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
