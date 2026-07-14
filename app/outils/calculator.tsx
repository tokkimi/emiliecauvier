"use client";
import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

function money(n:number){ return new Intl.NumberFormat("fr-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}).format(n) }
export function Calculator(){
 const [price,setPrice]=useState(625000), [down,setDown]=useState(125000), [rate,setRate]=useState(4.69), [years,setYears]=useState(25);
 const result=useMemo(()=>{ const principal=Math.max(0,price-down), r=Math.pow(1+rate/100/2,2/12)-1, n=years*12; const monthly=r===0?principal/n:principal*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1); return {principal,monthly,total:monthly*n-principal}; },[price,down,rate,years]);
 return <section className="calculator-wrap wrap">
   <div className="calc-panel">
    <div className="calc-title"><div><p className="eyebrow">Calculateur hypothécaire</p><h2>Testez votre scénario</h2></div><button onClick={()=>{setPrice(625000);setDown(125000);setRate(4.69);setYears(25)}}><RotateCcw size={16}/> Réinitialiser</button></div>
    <label>Prix de la propriété <output>{money(price)}</output><input type="range" min="200000" max="2000000" step="5000" value={price} onChange={e=>setPrice(+e.target.value)}/></label>
    <label>Mise de fonds <output>{money(down)}</output><input type="range" min="25000" max={Math.max(25000,price*.8)} step="5000" value={Math.min(down,price*.8)} onChange={e=>setDown(+e.target.value)}/></label>
    <div className="input-row"><label>Taux d’intérêt (%)<input type="number" min="0" max="20" step="0.05" value={rate} onChange={e=>setRate(+e.target.value)}/></label><label>Amortissement<select value={years} onChange={e=>setYears(+e.target.value)}><option value="20">20 ans</option><option value="25">25 ans</option><option value="30">30 ans</option></select></label></div>
   </div>
   <aside className="result-panel"><p>Votre estimation</p><div className="result-big">{money(result.monthly)}<small>/mois</small></div><dl><div><dt>Montant financé</dt><dd>{money(result.principal)}</dd></div><div><dt>Intérêts estimés</dt><dd>{money(result.total)}</dd></div><div><dt>Mise de fonds</dt><dd>{Math.round(down/price*100)} %</dd></div></dl><a className="button light" href={`mailto:emilie@equipecauvier.com?subject=${encodeURIComponent("Mon scénario immobilier")}&body=${encodeURIComponent(`Bonjour Émilie, j’aimerais discuter d’une propriété autour de ${money(price)} avec une mise de fonds de ${money(down)}.`)}`}>Parler de ce scénario <ArrowRight size={17}/></a><small>Estimation éducative seulement. N’inclut pas l’assurance prêt, les taxes, frais de copropriété ou autres coûts.</small></aside>
 </section>
}
