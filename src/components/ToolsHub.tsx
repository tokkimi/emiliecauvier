'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

const money = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const input = 'mt-2 w-full rounded-xl border border-[var(--color-sand)] bg-[var(--color-cream)] px-3 py-2.5 font-ui text-sm outline-none focus:border-[var(--color-gold)]';

function mortgagePayment(principal: number, annualRate: number, years: number) {
  const rate = annualRate / 100 / 12;
  const periods = years * 12;
  return rate ? principal * rate * (1 + rate) ** periods / ((1 + rate) ** periods - 1) : principal / periods;
}

const tx = {
  fr: {
    tabs: {
      capacite: 'Capacité',
      mise: 'Mise de fonds',
      hypotheque: 'Mensualités',
      mutation: 'Taxe de bienvenue',
      rentabilite: 'Rentabilité',
      frais: 'Frais',
      checklist: 'Checklist',
    },
    fields: {
      price: 'Prix de la propriété',
      down: 'Mise de fonds',
      rate: 'Taux',
      amortization: 'Amortissement',
      years: 'ans',
      annualIncome: 'Revenu brut annuel',
      monthlyDebts: 'Dettes mensuelles',
      percent: 'Pourcentage',
      taxBase: 'Base d’imposition',
      monthlyRents: 'Loyers mensuels',
      monthlyExpenses: 'Dépenses mensuelles',
      sellerCommission: 'Commission vendeur',
    },
    results: {
      capacity: 'Capacité indicative',
      capacityDetail: (value: string) => `${value} disponibles par mois, ratio indicatif de 39 %.`,
      down: 'Mise de fonds',
      downDetail: (value: string) => `Emprunt estimé : ${value}.`,
      monthly: 'Mensualité estimée',
      monthlyDetail: 'Capital et intérêts seulement; taxes, assurances et frais de condo exclus.',
      mutation: 'Droit de mutation indicatif',
      mutationDetail: 'Barème général Québec 2026. Certaines municipalités, dont Montréal, peuvent appliquer des tranches supérieures.',
      cashflow: 'Cash-flow mensuel',
      cashflowDetail: (value: string) => `Taux de capitalisation indicatif : ${value} %.`,
      buyerFees: 'Budget frais acheteur',
      buyerFeesDetail: 'Approx. 2,5 % + droit de mutation.',
      sellerFees: 'Frais vendeur',
      sellerFeesDetail: 'Commission saisie + taxes; autres frais exclus.',
    },
    checklistTitle: 'Checklist premier achat',
    checklist: ['Établir mon budget complet', 'Obtenir ma préapprobation', 'Choisir mes secteurs', 'Préparer ma grille de visite', 'Planifier l’inspection', 'Prévoir notaire et frais de clôture'],
    disclaimer: 'Estimations éducatives, sans valeur de préapprobation ni de conseil financier, fiscal ou juridique.',
  },
  en: {
    tabs: {
      capacite: 'Capacity',
      mise: 'Down payment',
      hypotheque: 'Monthly payments',
      mutation: 'Welcome tax',
      rentabilite: 'Profitability',
      frais: 'Costs',
      checklist: 'Checklist',
    },
    fields: {
      price: 'Property price',
      down: 'Down payment',
      rate: 'Rate',
      amortization: 'Amortization',
      years: 'years',
      annualIncome: 'Gross annual income',
      monthlyDebts: 'Monthly debts',
      percent: 'Percentage',
      taxBase: 'Tax base',
      monthlyRents: 'Monthly rents',
      monthlyExpenses: 'Monthly expenses',
      sellerCommission: 'Seller commission',
    },
    results: {
      capacity: 'Indicative buying capacity',
      capacityDetail: (value: string) => `${value} available per month, based on an indicative 39% ratio.`,
      down: 'Down payment',
      downDetail: (value: string) => `Estimated loan: ${value}.`,
      monthly: 'Estimated monthly payment',
      monthlyDetail: 'Principal and interest only; taxes, insurance and condo fees excluded.',
      mutation: 'Indicative land transfer duty',
      mutationDetail: 'General Quebec 2026 scale. Some municipalities, including Montreal, may apply higher brackets.',
      cashflow: 'Monthly cash flow',
      cashflowDetail: (value: string) => `Indicative capitalization rate: ${value}%.`,
      buyerFees: 'Buyer closing-cost budget',
      buyerFeesDetail: 'Approx. 2.5% + land transfer duty.',
      sellerFees: 'Seller costs',
      sellerFeesDetail: 'Entered commission + taxes; other costs excluded.',
    },
    checklistTitle: 'First-time buyer checklist',
    checklist: ['Build my complete budget', 'Get pre-approved', 'Choose my target areas', 'Prepare my visit checklist', 'Plan the inspection', 'Budget for notary and closing costs'],
    disclaimer: 'Educational estimates only; not a pre-approval or financial, tax or legal advice.',
  },
};

export function ToolsHub({ compact = false, locale = 'fr' }: { compact?: boolean; locale?: Locale }) {
  const t = tx[locale];
  const [tool, setTool] = useState('hypotheque');
  const [price, setPrice] = useState(600000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(4.75);
  const [years, setYears] = useState(25);
  const [income, setIncome] = useState(120000);
  const [debts, setDebts] = useState(500);
  const [rent, setRent] = useState(4200);
  const [expenses, setExpenses] = useState(1200);
  const [commission, setCommission] = useState(4);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false, false]);

  useEffect(() => {
    try { setChecks(JSON.parse(localStorage.getItem('emilie-checklist') ?? 'null') ?? checks); } catch { /* ignore */ }
    // La checklist est chargée une seule fois depuis cet appareil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loan = Math.max(0, price * (1 - down / 100));
  const monthly = mortgagePayment(loan, rate, years);
  const capacityPayment = Math.max(0, income / 12 * 0.39 - debts);
  const monthlyRate = rate / 100 / 12;
  const periods = years * 12;
  const capacityLoan = monthlyRate ? capacityPayment * ((1 + monthlyRate) ** periods - 1) / (monthlyRate * (1 + monthlyRate) ** periods) : capacityPayment * periods;
  const capacityPrice = capacityLoan / 0.8;
  const mutation = Math.min(price, 62900) * 0.005 + Math.max(0, Math.min(price, 315000) - 62900) * 0.01 + Math.max(0, price - 315000) * 0.015;
  const annualNet = (rent - expenses) * 12;
  const cashflow = rent - expenses - monthly;
  const capRate = price ? annualNet / price * 100 : 0;

  const tabs = compact
    ? [['hypotheque', t.tabs.hypotheque], ['mise', t.tabs.mise], ['mutation', t.tabs.mutation]]
    : [['capacite', t.tabs.capacite], ['mise', t.tabs.mise], ['hypotheque', t.tabs.hypotheque], ['mutation', t.tabs.mutation], ['rentabilite', t.tabs.rentabilite], ['frais', t.tabs.frais], ['checklist', t.tabs.checklist]];

  const numberField = (label: string, value: number, setter: (value: number) => void, suffix = '$') => (
    <label className="font-ui text-xs text-[var(--color-ink)]/60">{label}
      <div className="relative"><input type="number" value={value} min="0" step="any" onChange={(event) => setter(Number(event.target.value))} className={input} /><span className="absolute right-3 top-[19px] font-ui text-xs text-[var(--color-ink)]/35">{suffix}</span></div>
    </label>
  );

  const commonFields = <div className="grid grid-cols-2 gap-3">{numberField(t.fields.price, price, setPrice)}{numberField(t.fields.down, down, setDown, '%')}{numberField(t.fields.rate, rate, setRate, '%')}{numberField(t.fields.amortization, years, setYears, t.fields.years)}</div>;
  let content;
  if (tool === 'capacite') content = <>{<div className="grid grid-cols-2 gap-3">{numberField(t.fields.annualIncome, income, setIncome)}{numberField(t.fields.monthlyDebts, debts, setDebts)}</div>}<Result label={t.results.capacity} value={money.format(capacityPrice)} detail={t.results.capacityDetail(money.format(capacityPayment))} /></>;
  else if (tool === 'mise') content = <>{<div className="grid grid-cols-2 gap-3">{numberField(t.fields.price, price, setPrice)}{numberField(t.fields.percent, down, setDown, '%')}</div>}<Result label={t.results.down} value={money.format(price * down / 100)} detail={t.results.downDetail(money.format(loan))} /></>;
  else if (tool === 'hypotheque') content = <>{commonFields}<Result label={t.results.monthly} value={money.format(monthly)} detail={t.results.monthlyDetail} /></>;
  else if (tool === 'mutation') content = <>{numberField(t.fields.taxBase, price, setPrice)}<Result label={t.results.mutation} value={money.format(mutation)} detail={t.results.mutationDetail} /></>;
  else if (tool === 'rentabilite') content = <>{commonFields}<div className="mt-3 grid grid-cols-2 gap-3">{numberField(t.fields.monthlyRents, rent, setRent)}{numberField(t.fields.monthlyExpenses, expenses, setExpenses)}</div><Result label={t.results.cashflow} value={money.format(cashflow)} detail={t.results.cashflowDetail(capRate.toFixed(2))} /></>;
  else if (tool === 'frais') content = <>{<div className="grid grid-cols-2 gap-3">{numberField(t.fields.price, price, setPrice)}{numberField(t.fields.sellerCommission, commission, setCommission, '%')}</div>}<div className="mt-4 grid grid-cols-2 gap-3"><Result label={t.results.buyerFees} value={money.format(price * 0.025 + mutation)} detail={t.results.buyerFeesDetail} /><Result label={t.results.sellerFees} value={money.format(price * commission / 100 * 1.14975)} detail={t.results.sellerFeesDetail} /></div></>;
  else content = <Checklist checks={checks} items={t.checklist} title={t.checklistTitle} onChange={(next) => { setChecks(next); try { localStorage.setItem('emilie-checklist', JSON.stringify(next)); } catch { /* ignore */ } }} />;

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white p-5 shadow-[0_12px_40px_rgba(46,31,24,0.06)] sm:p-8">
      <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label={locale === 'en' ? 'Real estate calculators' : 'Calculateurs immobiliers'}>
        {tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={tool === id} onClick={() => setTool(id)} className={`min-h-11 shrink-0 rounded-full border px-4 font-ui text-xs ${tool === id ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white' : 'border-[var(--color-sand)] bg-[var(--color-cream)]'}`}>{label}</button>)}
      </div>
      <div className="mt-4">{content}</div>
      <p className="mt-5 font-ui text-[0.65rem] leading-relaxed text-[var(--color-ink)]/40">{t.disclaimer}</p>
    </div>
  );
}

function Result({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="mt-4 rounded-2xl bg-[#f3ece5] p-4"><p className="font-ui text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">{label}</p><p className="mt-1 font-display text-3xl text-[var(--color-bordeaux)]">{value}</p><p className="mt-1 font-body text-xs text-[var(--color-ink)]/55">{detail}</p></div>;
}

function Checklist({ checks, items, title, onChange }: { checks: boolean[]; items: string[]; title: string; onChange: (value: boolean[]) => void }) {
  return <div><div className="mb-3 flex justify-between font-ui text-xs text-[var(--color-ink)]/50"><span>{title}</span><span>{checks.filter(Boolean).length} / {items.length}</span></div>{items.map((item, index) => <label key={item} className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-[var(--color-sand)] py-2 font-body"><input type="checkbox" checked={checks[index]} onChange={(event) => onChange(checks.map((value, i) => i === index ? event.target.checked : value))} className="h-5 w-5 accent-[var(--color-bordeaux)]" /><span className={checks[index] ? 'text-[var(--color-ink)]/40 line-through' : ''}>{item}</span></label>)}</div>;
}
