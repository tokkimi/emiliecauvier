import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, HeartHandshake, Megaphone, Users } from "lucide-react";
export const metadata: Metadata = { title:"Partenaires et commandites", description:"Collaborer avec Émilie Cauvier pour créer des expériences immobilières et locales utiles." };
const formats=[
 {icon:Megaphone,title:"Contenu qui aide",text:"Capsules éducatives, guides de quartier, conseils rénovation et séries sociales co-signées."},
 {icon:CalendarDays,title:"Moments qui rassemblent",text:"Premiers acheteurs, portes ouvertes enrichies, rencontres de quartier et ateliers pratiques."},
 {icon:HeartHandshake,title:"Avantages clients",text:"Des offres simples, pertinentes et réellement utiles avant, pendant ou après une transaction."},
 {icon:Users,title:"Impact local",text:"Initiatives communautaires et commandites qui renforcent les quartiers où nous vivons."}
];
export default function Partners(){return <main id="contenu">
 <section className="subpage-scene partners-scene"><div className="wrap subpage-glass glass-deep"><div className="glass-toolbar"><span>Le cercle local</span><span>Marques · Médias · Événements</span></div><div className="subpage-copy"><p className="eyebrow glass-label">Partenariats</p><h1>De belles marques.<br/><em>De vraies idées.</em></h1><p>Des collaborations utiles aux propriétaires, ancrées dans la vie de quartier et conçues avec des objectifs clairs.</p><a className="button red" href="#proposer">Proposer une collaboration <ArrowUpRight size={18}/></a></div></div></section>
 <section className="section wrap"><div className="section-head"><div><p className="eyebrow">Terrains de collaboration</p><h2>Pas un logo posé.<br/>Une expérience partagée.</h2></div><p>Chaque partenariat part d’un besoin réel de la communauté et se construit avec des objectifs clairs.</p></div><div className="format-grid">{formats.map(({icon:Icon,title,text})=><article key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></section>
 <section className="partner-promise"><div className="wrap"><p className="eyebrow">Ce que nous protégeons</p><h2>Pertinence avant portée.<br/>Confiance avant volume.</h2><div className="promise-row"><span>Audience locale</span><span>Création sur mesure</span><span>Mesure transparente</span><span>Exclusivité raisonnée</span></div></div></section>
 <section id="proposer" className="section wrap proposal"><div><p className="eyebrow">Votre idée + notre terrain</p><h2>Racontez-nous ce que vous aimeriez créer.</h2><p>La demande est préparée dans votre application courriel. Aucune donnée n’est enregistrée sur ce site.</p></div><a className="button coral" href={`mailto:emilie@equipecauvier.com?subject=${encodeURIComponent("Proposition de partenariat")}&body=${encodeURIComponent("Bonjour Émilie,\n\nEntreprise :\nPersonne-ressource :\nIdée de collaboration :\nPublic visé :\nÉchéancier :\nBudget ou contribution envisagée :\n\nMerci!")}`}>Préparer ma proposition <ArrowUpRight size={18}/></a></section>
 </main>}
