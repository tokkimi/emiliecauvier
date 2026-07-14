import type { Metadata } from "next";
import { ArrowDown, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyBrowser, type Property } from "./property-browser";

export const metadata: Metadata = {
  title: "Propriétés à vendre et à louer",
  description: "Explorez les propriétés présentées par Émilie Cauvier à Montréal, Laval et dans les Laurentides.",
};

const properties: Property[] = [
  { id:"24067772", address:"825, croissant du Ruisseau, app. E6", city:"Montréal · Saint-Laurent", type:"Appartement", price:"2 400 $ / mois", beds:2, baths:2, area:"1 361 pi²", image:"/listing-ruisseau.webp", badge:"Nouveauté" },
  { id:"24799379", address:"26, rue des Ardoises", city:"Sainte-Agathe-des-Monts", type:"Maison à étages", price:"559 000 $", beds:4, baths:1, image:"/listing-ardoises.webp", badge:"Nouveauté" },
  { id:"25439433", address:"16341, rue Marion", city:"Montréal · RDP–PAT", type:"Maison à étages", price:"675 000 $", beds:3, baths:1, image:"/listing-marion.webp" },
  { id:"26560475", address:"110, rue Sévigny, app. 1", city:"Repentigny", type:"Appartement", price:"329 900 $", beds:2, baths:1, area:"1 046 pi²", image:"/listing-sevigny.webp" },
  { id:"15203547", address:"Chemin St-Grégoire", city:"Les Cèdres", type:"Terrain", price:"149 000 $ + taxes", beds:0, baths:0, image:"/listing-terrain.webp" },
  { id:"15382635", address:"49, avenue du Chalet", city:"Montréal · Lachine", type:"Propriété à revenus", price:"1 599 000 $", beds:0, baths:0, image:"/listing-chalet.webp", badge:"Nouveauté" },
  { id:"16307754", address:"4191, rue de la Seine, app. 401", city:"Laval · Chomedey", type:"Appartement", price:"399 000 $", beds:2, baths:1, area:"1 144 pi²", image:"/listing-seine.webp" },
  { id:"16452982", address:"1336, rue Ethier", city:"Laval · Chomedey", type:"Triplex", price:"1 324 900 $", beds:3, baths:1, image:"/listing-ethier.webp" },
];

export default function PropertiesPage() {
  return <main id="contenu" className="properties-page">
    <section className="properties-hero scene">
      <div className="scene-shade"/>
      <div className="wrap properties-hero-layout">
        <div className="properties-intro glass-deep">
          <div className="glass-toolbar"><span><i/> Sélection actuelle</span><span>Montréal · Laval · Laurentides</span></div>
          <div className="properties-intro-copy"><p className="eyebrow glass-label">Propriétés</p><h1>Une recherche plus calme.<br/><em>Des choix plus éclairés.</em></h1><p>Filtrez les inscriptions, ouvrez un aperçu et demandez la fiche complète sans quitter l’expérience.</p><a className="button red" href="#selection">Explorer la sélection <ArrowDown/></a></div>
          <div className="glass-statusbar"><span><ShieldCheck/> Informations à confirmer</span><span><Sparkles/> Accompagnement humain</span></div>
        </div>
        <aside className="market-note glass-deep"><span>08</span><p>inscriptions présentées</p><small>Mise à jour : 14 juillet 2026</small></aside>
      </div>
    </section>
    <div id="selection"><PropertyBrowser properties={properties}/></div>
  </main>;
}
