import type { Metadata } from "next";
import { ArrowDown, ShieldCheck, Sparkles } from "lucide-react";
import p24067772 from "./data/24067772.json";
import p24799379 from "./data/24799379.json";
import p25439433 from "./data/25439433.json";
import p26560475 from "./data/26560475.json";
import p11756582 from "./data/11756582.json";
import p15203547 from "./data/15203547.json";
import p15382635 from "./data/15382635.json";
import p16307754 from "./data/16307754.json";
import p16452982 from "./data/16452982.json";
import p22292609 from "./data/22292609.json";
import soldData from "./data/sold.json";
import { PropertyBrowser, type ActiveProperty, type SoldProperty } from "./property-browser";

export const metadata: Metadata = {
  title: "Propriétés à vendre et à louer",
  description: "Recherchez les inscriptions d’Émilie Cauvier et consultez leurs galeries, caractéristiques, pièces et cartes détaillées.",
};

const overview: Record<string, { category:string; beds:number; baths:number; address:string }> = {
  "24067772": { category:"Appartement", beds:2, baths:2, address:"825, croissant du Ruisseau, app. E6, Montréal (Saint-Laurent), QC H4L 5E1" },
  "24799379": { category:"Maison à étages", beds:4, baths:1, address:"26, rue des Ardoises, Sainte-Agathe-des-Monts, QC J8C 3N2" },
  "25439433": { category:"Maison à étages", beds:3, baths:1, address:"16341, rue Marion, Montréal (RDP–PAT), QC H1A 1Y4" },
  "26560475": { category:"Appartement", beds:2, baths:1, address:"110, rue Sévigny, app. 1, Repentigny, QC J5Y 2E1" },
  "11756582": { category:"Maison à étages", beds:3, baths:1, address:"16341Z, rue Marion, Montréal (RDP–PAT), QC H1A 1Y4" },
  "15203547": { category:"Terrain", beds:0, baths:0, address:"Chemin St-Grégoire, Les Cèdres, QC J7T 1L4" },
  "15382635": { category:"Propriété à revenus", beds:0, baths:0, address:"49, avenue du Chalet, Montréal (Lachine), QC H8R 1M8" },
  "16307754": { category:"Appartement", beds:2, baths:1, address:"4191, rue de la Seine, app. 401, Laval (Chomedey), QC H7W 5E4" },
  "16452982": { category:"Triplex", beds:3, baths:1, address:"1336–1338B, rue Ethier, Laval (Chomedey), QC H7W 3X1" },
  "22292609": { category:"Terrain", beds:0, baths:0, address:"Chemin St-Grégoire, Les Cèdres, QC J7T 1L4" },
};

const sourceProperties = [p24067772,p24799379,p25439433,p26560475,p11756582,p15203547,p15382635,p16307754,p16452982,p22292609];
const active = sourceProperties.map((property) => ({
  ...property,
  ...overview[property.id],
  photos: property.photos.map((filename) => `https://storage.googleapis.com/cms-estatefunnel-bucket/production/listings/${property.id}/${filename}`),
})) as ActiveProperty[];
const sold = soldData as SoldProperty[];

export default function PropertiesPage() {
  return <main id="contenu" className="properties-page">
    <section className="properties-hero scene">
      <div className="scene-shade"/>
      <div className="wrap properties-hero-layout">
        <div className="properties-intro glass-deep">
          <div className="glass-toolbar"><span><i/> Portefeuille immobilier</span><span>Montréal · Laval · Laurentides</span></div>
          <div className="properties-intro-copy"><p className="eyebrow glass-label">Recherche immobilière</p><h1>Tout voir.<br/><em>Décider avec contexte.</em></h1><p>Critères complets, galeries intégrales, adresses, cartes, pièces, inclusions et détails techniques réunis dans une seule expérience.</p><a className="button red" href="#selection">Lancer ma recherche <ArrowDown/></a></div>
          <div className="glass-statusbar"><span><ShieldCheck/> Données publiques détaillées</span><span><Sparkles/> Navigation sans rupture</span></div>
        </div>
        <aside className="market-note glass-deep"><span>{String(active.length).padStart(2,"0")}</span><p>inscriptions détaillées</p><small>Mise à jour : 14 juillet 2026</small></aside>
      </div>
    </section>
    <div id="selection"><PropertyBrowser active={active} sold={sold}/></div>
  </main>;
}
