"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Building2, Car, ChevronDown, ChevronLeft, ChevronRight, Expand, Grid2X2, Map, MapPin, Search, SlidersHorizontal, Sparkles, Waves, X } from "lucide-react";

type DetailSection = { title:string; rows:string[][]; tokens:string[] };
export type ActiveProperty = {
  id:string; address:string; city:string; status:string; price:string; description:string;
  summary:Record<string,string>; photos:string[]; sections:DetailSection[]; category:string; beds:number; baths:number;
};
export type SoldProperty = { id:string; image:string; city:string; type:string; beds:string; baths:string };

const priceValue = (value:string) => Number(value.replace(/[^0-9]/g,"")) || 0;
const hasText = (property:ActiveProperty, needle:string) => JSON.stringify(property).toLocaleLowerCase("fr-CA").includes(needle.toLocaleLowerCase("fr-CA"));
const cities = ["Toutes les villes", "Montréal", "Laval", "Repentigny", "Sainte-Agathe-des-Monts", "Les Cèdres"];
const categories = ["Tous les types", "Appartement", "Maison à étages", "Propriété à revenus", "Triplex", "Terrain"];

export function PropertyBrowser({ active, sold }: { active:ActiveProperty[]; sold:SoldProperty[] }) {
  const [query,setQuery]=useState("");
  const [city,setCity]=useState(cities[0]);
  const [category,setCategory]=useState(categories[0]);
  const [status,setStatus]=useState("Tous");
  const [minPrice,setMinPrice]=useState("");
  const [maxPrice,setMaxPrice]=useState("");
  const [beds,setBeds]=useState("0");
  const [baths,setBaths]=useState("0");
  const [garage,setGarage]=useState(false);
  const [pool,setPool]=useState(false);
  const [sort,setSort]=useState("Pertinence");
  const [selected,setSelected]=useState<ActiveProperty|null>(null);
  const [photo,setPhoto]=useState(0);
  const [mapVisible,setMapVisible]=useState(false);

  const visible=useMemo(()=>{
    const result=active.filter((property)=>{
      const searchable=`${property.id} ${property.address} ${property.city} ${property.category}`.toLocaleLowerCase("fr-CA");
      return (!query || searchable.includes(query.toLocaleLowerCase("fr-CA")))
        && (city===cities[0] || property.city.includes(city))
        && (category===categories[0] || property.category===category)
        && (status==="Tous" || property.status.toLocaleLowerCase("fr-CA").includes(status.toLocaleLowerCase("fr-CA")))
        && (!minPrice || priceValue(property.price)>=Number(minPrice))
        && (!maxPrice || priceValue(property.price)<=Number(maxPrice))
        && property.beds>=Number(beds)
        && property.baths>=Number(baths)
        && (!garage || hasText(property,"garage"))
        && (!pool || hasText(property,"piscine"));
    });
    return [...result].sort((a,b)=>sort==="Prix croissant"?priceValue(a.price)-priceValue(b.price):sort==="Prix décroissant"?priceValue(b.price)-priceValue(a.price):a.id.localeCompare(b.id));
  },[active,baths,beds,category,city,garage,maxPrice,minPrice,pool,query,sort,status]);

  const open=(property:ActiveProperty)=>{setSelected(property);setPhoto(0);setMapVisible(false);history.replaceState(null,"",`#property-${property.id}`)};
  const closeDetail=()=>{setSelected(null);history.replaceState(null,"",location.pathname)};
  useEffect(()=>{
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape"){setSelected(null);history.replaceState(null,"",location.pathname)}};
    window.addEventListener("keydown",close); document.body.style.overflow=selected?"hidden":"";
    return()=>{window.removeEventListener("keydown",close);document.body.style.overflow=""};
  },[selected]);
  useEffect(()=>{
    const id=location.hash.replace("#property-","");
    const property=active.find((item)=>item.id===id);
    if(property){setSelected(property);setPhoto(0);setMapVisible(false)}
  },[active]);
  const reset=()=>{setQuery("");setCity(cities[0]);setCategory(categories[0]);setStatus("Tous");setMinPrice("");setMaxPrice("");setBeds("0");setBaths("0");setGarage(false);setPool(false);setSort("Pertinence")};

  return <>
    <section className="property-search-studio">
      <div className="wrap property-search-layout">
        <div className="search-intro"><p className="eyebrow">Studio de recherche</p><h2>Tous les critères.<br/>Aucune friction.</h2><p>Affinez la sélection par secteur, prix, chambres, type et équipements. Les résultats se mettent à jour immédiatement.</p></div>
        <div className="advanced-filter glass-light">
          <div className="filter-window"><span><i/> Critères actifs</span><button onClick={reset}>Réinitialiser</button></div>
          <div className="filter-primary">
            <label className="search-wide"><Search/><span>Adresse, secteur ou MLS</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Ex. Chomedey, 24067772…"/></label>
            <label><MapPin/><span>Ville</span><select value={city} onChange={(event)=>setCity(event.target.value)}>{cities.map((item)=><option key={item}>{item}</option>)}</select></label>
            <label><Building2/><span>Type</span><select value={category} onChange={(event)=>setCategory(event.target.value)}>{categories.map((item)=><option key={item}>{item}</option>)}</select></label>
            <label><Sparkles/><span>Transaction</span><select value={status} onChange={(event)=>setStatus(event.target.value)}><option>Tous</option><option>À VENDRE</option><option>À LOUER</option></select></label>
          </div>
          <div className="filter-secondary">
            <label><span>Prix minimum</span><input type="number" min="0" value={minPrice} onChange={(event)=>setMinPrice(event.target.value)} placeholder="0 $"/></label>
            <label><span>Prix maximum</span><input type="number" min="0" value={maxPrice} onChange={(event)=>setMaxPrice(event.target.value)} placeholder="Aucun maximum"/></label>
            <label><BedDouble/><span>Chambres</span><select value={beds} onChange={(event)=>setBeds(event.target.value)}>{[0,1,2,3,4].map((item)=><option value={item} key={item}>{item?`${item}+`:"Toutes"}</option>)}</select></label>
            <label><Bath/><span>Salles de bain</span><select value={baths} onChange={(event)=>setBaths(event.target.value)}>{[0,1,2].map((item)=><option value={item} key={item}>{item?`${item}+`:"Toutes"}</option>)}</select></label>
            <button className={garage?"toggle active":"toggle"} onClick={()=>setGarage(!garage)}><Car/> Garage</button>
            <button className={pool?"toggle active":"toggle"} onClick={()=>setPool(!pool)}><Waves/> Piscine</button>
          </div>
        </div>
      </div>
    </section>

    <section className="property-results wrap" aria-live="polite">
      <div className="results-bar"><div><p className="eyebrow">Sélection actuelle</p><h2>{visible.length} inscription{visible.length===1?"":"s"}</h2></div><label><SlidersHorizontal/><span className="sr-only">Trier les résultats</span><select value={sort} onChange={(event)=>setSort(event.target.value)}><option>Pertinence</option><option>Prix croissant</option><option>Prix décroissant</option></select></label></div>
      <div className="advanced-property-grid">{visible.map((property,index)=><article className={index===0?"advanced-card lead":"advanced-card"} key={property.id}>
        <button className="advanced-card-image" onClick={()=>open(property)} aria-label={`Ouvrir la fiche de ${property.address}`}><Image src={property.photos[0]} alt={`Propriété ${property.address}`} fill sizes={index===0?"(max-width:700px) 100vw, 58vw":"(max-width:700px) 100vw, 40vw"}/><span className="advanced-badge">{property.status}</span><span className="photo-count"><Grid2X2/>{property.photos.length} photo{property.photos.length>1?"s":""}</span><span className="open-orb"><Expand/></span></button>
        <div className="advanced-card-copy glass-light"><div className="card-code">MLS {property.id}</div><h3>{property.address}</h3><p><MapPin/>{property.city}</p><div className="advanced-price"><span>{property.category}</span><strong>{property.price}</strong></div><div className="advanced-facts">{property.beds>0&&<span><BedDouble/>{property.beds}</span>}{property.baths>0&&<span><Bath/>{property.baths}</span>}{property.summary.Superficie&&<span><Building2/>{property.summary.Superficie}</span>}</div><button onClick={()=>open(property)}>Voir toutes les informations <ArrowRight/></button></div>
      </article>)}</div>
      {!visible.length&&<div className="property-empty glass-light"><Search/><h3>Aucune propriété ne correspond exactement à ces critères.</h3><button onClick={reset}>Afficher toute la sélection</button></div>}
      <p className="listing-disclaimer">Les renseignements sont reproduits depuis les fiches publiques disponibles le 14 juillet 2026. Ils doivent être vérifiés avant toute décision ou promesse.</p>
    </section>

    <section className="sold-section" id="vendues">
      <div className="wrap sold-heading"><div><p className="eyebrow glass-label">Réalisations</p><h2>Propriétés vendues.</h2></div><p>Faites défiler horizontalement pour parcourir les transactions représentées.</p></div>
      <div className="sold-rail" aria-label="Propriétés vendues">{sold.map((property)=><article className="sold-card" key={property.id}><div className="sold-image"><Image src={property.image} alt={`Propriété vendue à ${property.city}`} fill sizes="(max-width:640px) 34vw, 25vw"/><span>Vendu</span></div><div><small>MLS {property.id}</small><h3>{property.city}</h3><p>{property.type}</p><div>{property.beds&&<span><BedDouble/>{property.beds}</span>}{property.baths&&<span><Bath/>{property.baths}</span>}</div></div></article>)}</div>
      <div className="sold-hint"><ArrowLeft/> Glisser pour explorer <ArrowRight/></div>
    </section>

    {selected&&<div className="property-detail-backdrop" onMouseDown={(event)=>event.target===event.currentTarget&&closeDetail()}>
      <article className="property-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="detail-close" onClick={closeDetail} aria-label="Fermer"><X/></button>
        <div className="detail-gallery">
          <button className="detail-main-photo" aria-label="Photo suivante" onClick={()=>setPhoto((photo+1)%selected.photos.length)}><Image src={selected.photos[photo]} alt={`${selected.address} — photo ${photo+1}`} fill sizes="(max-width:900px) 100vw, 62vw"/><span>{photo+1} / {selected.photos.length}</span></button>
          {selected.photos.length>1&&<><button className="gallery-arrow previous" onClick={()=>setPhoto((photo-1+selected.photos.length)%selected.photos.length)} aria-label="Photo précédente"><ChevronLeft/></button><button className="gallery-arrow next" onClick={()=>setPhoto((photo+1)%selected.photos.length)} aria-label="Photo suivante"><ChevronRight/></button></>}
          <div className="thumbnail-rail">{selected.photos.map((src,index)=><button className={index===photo?"active":""} onClick={()=>setPhoto(index)} key={`${src}-${index}`} aria-label={`Afficher la photo ${index+1}`}><Image src={src} alt="" fill sizes="90px"/></button>)}</div>
        </div>
        <div className="detail-content">
          <header className="detail-header"><div><p className="eyebrow">{selected.status} · MLS {selected.id}</p><h2 id="detail-title">{selected.address}</h2><p className="detail-location"><MapPin/>{selected.city}</p></div><strong>{selected.price}</strong></header>
          <div className="detail-stat-grid">{selected.beds>0&&<span><BedDouble/><small>Chambres</small><strong>{selected.beds}</strong></span>}{selected.baths>0&&<span><Bath/><small>Salles de bain</small><strong>{selected.baths}</strong></span>}{selected.summary.Superficie&&<span><Building2/><small>Superficie</small><strong>{selected.summary.Superficie}</strong></span>}{selected.summary.Garage&&<span><Car/><small>Garage</small><strong>{selected.summary.Garage}</strong></span>}{selected.summary.Terrain&&selected.summary.Terrain!=="Année"&&<span><Map/><small>Terrain</small><strong>{selected.summary.Terrain}</strong></span>}</div>
          <section className="detail-description"><p className="eyebrow">Description</p><p>{selected.description}</p></section>
          <section className="detail-map glass-light"><div><MapPin/><div><p className="eyebrow">Adresse et carte</p><h3>{selected.address}</h3></div></div>{mapVisible?<iframe title={`Carte de ${selected.address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(selected.address)}&output=embed`}/>:<button className="button outline-red" onClick={()=>setMapVisible(true)}>Afficher la carte <Map/></button>}<small>La carte Google est chargée uniquement après votre action et peut traiter des données techniques selon ses propres conditions.</small></section>
          <section className="detail-sections"><p className="eyebrow">Fiche complète</p>{selected.sections.map((section,index)=><details key={`${selected.id}-${section.title}`} open={index<2}><summary><span>{String(index+1).padStart(2,"0")} · {section.title}</span><ChevronDown/></summary><div className="detail-section-body">{section.rows.length>0?<div className="detail-rows">{section.rows.map((row,rowIndex)=><div key={rowIndex}><strong>{row[0]}</strong><span>{row.slice(1).join(" · ")}</span></div>)}</div>:section.title.includes("Addenda")?<div className="detail-prose">{section.tokens.map((token,tokenIndex)=><p key={tokenIndex}>{token}</p>)}</div>:<div className="detail-token-grid">{section.tokens.map((token,tokenIndex)=><span key={tokenIndex}>{token}</span>)}</div>}</div></details>)}</section>
          <div className="detail-actions"><a className="button red" href={`mailto:emilie@equipecauvier.com?subject=${encodeURIComponent(`Visite — ${selected.address}`)}&body=${encodeURIComponent(`Bonjour Émilie,\n\nJ’aimerais discuter de la propriété ${selected.address}.\nMLS : ${selected.id}\n\nMerci!`)}`}>Planifier une visite <ArrowRight/></a><a className="button outline-red" href={`mailto:emilie@equipecauvier.com?subject=${encodeURIComponent(`Documents — ${selected.address}`)}`}>Recevoir les documents</a></div>
        </div>
      </article>
    </div>}
  </>;
}
