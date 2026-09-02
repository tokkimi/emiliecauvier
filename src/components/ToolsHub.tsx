'use client';

import { useEffect, useState } from 'react';

const money = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const input = 'mt-2 w-full rounded-xl border border-[var(--color-sand)] bg-[var(--color-cream)] px-3 py-2.5 font-ui text-sm outline-none focus:border-[var(--color-gold)]';

function mortgagePayment(principal: number, annualRate: number, years: number) {
  const rate = annualRate / 100 / 12;
  const periods = years * 12;
  return rate ? principal * rate * (1 + rate) ** periods / ((1 + rate) ** periods - 1) : principal / periods;
}

export function ToolsHub({ compact = false }: { compact?: boolean }) {
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
    ? [['hypotheque', 'Mensualités'], ['mise', 'Mise de fonds'], ['mutation', 'Taxe de bienvenue']]
    : [['capacite', 'Capacité'], ['mise', 'Mise de fonds'], ['hypotheque', 'Mensualités'], ['mutation', 'Taxe de bienvenue'], ['rentabilite', 'Rentabilité'], ['frais', 'Frais'], ['checklist', 'Checklist']];

  const numberField = (label: string, value: number, setter: (value: number) => void, suffix = '$') => (
    <label className="font-ui text-xs text-[var(--color-ink)]/60">{label}
      <div className="relative"><input type="number" value={value} min="0" step="any" onChange={(event) => setter(Number(event.target.value))} className={input} /><span className="absolute right-3 top-[19px] font-ui text-xs text-[var(--color-ink)]/35">{suffix}</span></div>
    </label>
  );

  const commonFields = <div className="grid grid-cols-2 gap-3">{numberField('Prix de la propriété', price, setPrice)}{numberField('Mise de fonds', down, setDown, '%')}{numberField('Taux', rate, setRate, '%')}{numberField('Amortissement', years, setYears, 'ans')}</div>;
  let content;
  if (tool === 'capacite') content = <>{<div className="grid grid-cols-2 gap-3">{numberField('Revenu brut annuel', income, setIncome)}{numberField('Dettes mensuelles', debts, setDebts)}</div>}<Result label="Capacité indicative" value={money.format(capacityPrice)} detail={`${money.format(capacityPayment)} disponibles par mois, ratio indicatif de 39 %.`} /></>;
  else if (tool === 'mise') content = <>{<div className="grid grid-cols-2 gap-3">{numberField('Prix de la propriété', price, setPrice)}{numberField('Pourcentage', down, setDown, '%')}</div>}<Result label="Mise de fonds" value={money.format(price * down / 100)} detail={`Emprunt estimé : ${money.format(loan)}.`} /></>;
  else if (tool === 'hypotheque') content = <>{commonFields}<Result label="Mensualité estimée" value={money.format(monthly)} detail="Capital et intérêts seulement; taxes, assurances et frais de condo exclus." /></>;
  else if (tool === 'mutation') content = <>{numberField('Base d’imposition', price, setPrice)}<Result label="Droit de mutation indicatif" value={money.format(mutation)} detail="Barème général Québec 2026. Certaines municipalités, dont Montréal, peuvent appliquer des tranches supérieures." /></>;
  else if (tool === 'rentabilite') content = <>{commonFields}<div className="mt-3 grid grid-cols-2 gap-3">{numberField('Loyers mensuels', rent, setRent)}{numberField('Dépenses mensuelles', expenses, setExpenses)}</div><Result label="Cash-flow mensuel" value={money.format(cashflow)} detail={`Taux de capitalisation indicatif : ${capRate.toFixed(2)} %.`} /></>;
  else if (tool === 'frais') content = <>{<div className="grid grid-cols-2 gap-3">{numberField('Prix', price, setPrice)}{numberField('Commission vendeur', commission, setCommission, '%')}</div>}<div className="mt-4 grid grid-cols-2 gap-3"><Result label="Budget frais acheteur" value={money.format(price * 0.025 + mutation)} detail="Approx. 2,5 % + droit de mutation." /><Result label="Frais vendeur" value={money.format(price * commission / 100 * 1.14975)} detail="Commission saisie + taxes; autres frais exclus." /></div></>;
  else content = <Checklist checks={checks} onChange={(next) => { setChecks(next); try { localStorage.setItem('emilie-checklist', JSON.stringify(next)); } catch { /* ignore */ } }} />;

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white p-5 shadow-[0_12px_40px_rgba(46,31,24,0.06)] sm:p-8">
      <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Calculateurs immobiliers">
        {tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={tool === id} onClick={() => setTool(id)} className={`min-h-11 shrink-0 rounded-full border px-4 font-ui text-xs ${tool === id ? 'border-[var(--color-bordeaux)] bg-[var(--color-bordeaux)] text-white' : 'border-[var(--color-sand)] bg-[var(--color-cream)]'}`}>{label}</button>)}
      </div>
      <div className="mt-4">{content}</div>
      <p className="mt-5 font-ui text-[0.65rem] leading-relaxed text-[var(--color-ink)]/40">Estimations éducatives, sans valeur de préapprobation ni de conseil financier, fiscal ou juridique.</p>
    </div>
  );
}

function Result({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="mt-4 rounded-2xl bg-[#f3ece5] p-4"><p className="font-ui text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">{label}</p><p className="mt-1 font-display text-3xl text-[var(--color-bordeaux)]">{value}</p><p className="mt-1 font-body text-xs text-[var(--color-ink)]/55">{detail}</p></div>;
}

function Checklist({ checks, onChange }: { checks: boolean[]; onChange: (value: boolean[]) => void }) {
  const items = ['Établir mon budget complet', 'Obtenir ma préapprobation', 'Choisir mes secteurs', 'Préparer ma grille de visite', 'Planifier l’inspection', 'Prévoir notaire et frais de clôture'];
  return <div><div className="mb-3 flex justify-between font-ui text-xs text-[var(--color-ink)]/50"><span>Checklist premier achat</span><span>{checks.filter(Boolean).length} / {items.length}</span></div>{items.map((item, index) => <label key={item} className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-[var(--color-sand)] py-2 font-body"><input type="checkbox" checked={checks[index]} onChange={(event) => onChange(checks.map((value, i) => i === index ? event.target.checked : value))} className="h-5 w-5 accent-[var(--color-bordeaux)]" /><span className={checks[index] ? 'text-[var(--color-ink)]/40 line-through' : ''}>{item}</span></label>)}</div>;
}
