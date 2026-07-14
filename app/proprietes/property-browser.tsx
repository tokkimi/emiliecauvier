"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bath, BedDouble, Building2, Expand, MapPin, Search, X } from "lucide-react";

export type Property = {
  id: string;
  address: string;
  city: string;
  type: string;
  price: string;
  beds: number;
  baths: number;
  area?: string;
  image: string;
  badge?: string;
};

const types = ["Toutes", "Appartement", "Maison", "Revenus", "Terrain"];

export function PropertyBrowser({ properties }: { properties: Property[] }) {
  const [type, setType] = useState("Toutes");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Property | null>(null);

  const visible = useMemo(() => properties.filter((property) => {
    const category = property.type === "Maison à étages" ? "Maison" : property.type === "Propriété à revenus" || property.type === "Triplex" ? "Revenus" : property.type;
    const matchesType = type === "Toutes" || category === type;
    const haystack = `${property.address} ${property.city} ${property.type}`.toLocaleLowerCase("fr-CA");
    return matchesType && haystack.includes(query.toLocaleLowerCase("fr-CA"));
  }), [properties, query, type]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { window.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [selected]);

  return <>
    <section className="property-browser wrap" aria-labelledby="property-results-title">
      <div className="property-filter glass-light">
        <div className="filter-heading"><div><p className="eyebrow">Recherche guidée</p><h2 id="property-results-title">Trouvez le bon point de départ.</h2></div><span>{visible.length} propriété{visible.length === 1 ? "" : "s"}</span></div>
        <label className="property-search"><Search/><span className="sr-only">Rechercher une ville ou une adresse</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ville, quartier ou adresse"/></label>
        <div className="property-tabs" aria-label="Filtrer par type">{types.map((item) => <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>)}</div>
      </div>

      <div className="property-grid">
        {visible.map((property, index) => <article className={`listing-card ${index === 0 ? "featured" : ""}`} key={property.id}>
          <button className="listing-image" onClick={() => setSelected(property)} aria-label={`Voir ${property.address}`}>
            <Image src={property.image} alt={`Façade de la propriété au ${property.address}`} fill sizes={index === 0 ? "(max-width: 700px) 100vw, 58vw" : "(max-width: 700px) 100vw, 34vw"}/>
            {property.badge && <span className="listing-badge">{property.badge}</span>}
            <span className="listing-expand"><Expand/></span>
          </button>
          <div className="listing-body glass-light">
            <div className="listing-location"><MapPin/><span>{property.city}</span></div>
            <h3>{property.address}</h3>
            <div className="listing-price"><span>{property.type}</span><strong>{property.price}</strong></div>
            <div className="listing-facts">
              {property.type !== "Terrain" && <><span><BedDouble/>{property.beds} chambre{property.beds > 1 ? "s" : ""}</span><span><Bath/>{property.baths} salle{property.baths > 1 ? "s" : ""} de bain</span></>}
              {property.area && <span><Building2/>{property.area}</span>}
            </div>
            <button className="listing-open" onClick={() => setSelected(property)}>Voir l’aperçu <ArrowRight/></button>
          </div>
        </article>)}
      </div>
      {!visible.length && <div className="property-empty glass-light"><Search/><h3>Aucun résultat dans cette sélection.</h3><button onClick={() => { setType("Toutes"); setQuery(""); }}>Réinitialiser les filtres</button></div>}
      <p className="listing-disclaimer">Aperçu des inscriptions affichées par Émilie Cauvier le 14 juillet 2026. La disponibilité, les prix et les caractéristiques doivent être confirmés avant toute décision.</p>
    </section>

    {selected && <div className="listing-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
      <section className="listing-modal glass-deep" role="dialog" aria-modal="true" aria-labelledby="listing-modal-title">
        <button className="modal-close" onClick={() => setSelected(null)} aria-label="Fermer"><X/></button>
        <div className="modal-image"><Image src={selected.image} alt={`Façade de la propriété au ${selected.address}`} fill sizes="(max-width: 760px) 100vw, 54vw"/></div>
        <div className="modal-copy">
          <p className="eyebrow glass-label">{selected.type} · {selected.city}</p>
          <h2 id="listing-modal-title">{selected.address}</h2>
          <strong className="modal-price">{selected.price}</strong>
          <div className="modal-facts">{selected.type !== "Terrain" && <><span><BedDouble/>{selected.beds} chambres</span><span><Bath/>{selected.baths} salle de bain</span></>}{selected.area && <span><Building2/>{selected.area}</span>}</div>
          <p>Recevez la fiche complète, les déclarations disponibles et le contexte utile avant de planifier une visite.</p>
          <a className="button red" href={`mailto:emilie@equipecauvier.com?subject=${encodeURIComponent(`Fiche — ${selected.address}`)}&body=${encodeURIComponent(`Bonjour Émilie,\n\nJ’aimerais recevoir les informations à jour pour la propriété suivante :\n${selected.address}, ${selected.city}\nRéférence : ${selected.id}\n\nMerci!`)}`}>Demander la fiche complète <ArrowRight/></a>
        </div>
      </section>
    </div>}
  </>;
}
