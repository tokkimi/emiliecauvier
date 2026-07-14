import type { Metadata } from "next";
import { Calculator } from "./calculator";

export const metadata: Metadata = { title: "Outils immobiliers", description: "Simulez vos paiements hypothécaires et préparez votre projet immobilier." };

export default function ToolsPage(){ return <main id="contenu">
  <section className="page-hero wrap"><p className="eyebrow">Le studio immobilier</p><h1>Comprendre les chiffres.<br/><em>Garder le contrôle.</em></h1><p>Des outils simples pour préparer une conversation plus éclairée avec votre courtier et vos professionnels financiers.</p></section>
  <Calculator/>
  <section className="section wrap note-grid"><div><span>01</span><h3>Préparez vos questions</h3><p>Notez ce qui change lorsque vous ajustez la mise de fonds, le taux ou l’amortissement.</p></div><div><span>02</span><h3>Gardez une marge</h3><p>Une propriété doit s’intégrer à votre vie, pas seulement satisfaire une formule.</p></div><div><span>03</span><h3>Validez avant d’agir</h3><p>Confirmez toujours votre financement et vos obligations auprès de professionnels autorisés.</p></div></section>
 </main> }
