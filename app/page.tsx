import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Check, Compass, Handshake, Home, KeyRound, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const services = [
  { title: "Acheter", text: "Cibler, visiter et négocier avec une vision claire.", icon: KeyRound },
  { title: "Vendre", text: "Positionner et présenter votre propriété avec précision.", icon: Home },
  { title: "Investir", text: "Comparer les occasions avec méthode et recul.", icon: Building2 }
];

export default function HomePage() {
  return <main id="contenu" className="immersive-site">
    <section className="scene hero-scene">
      <div className="scene-shade"/>
      <div className="wrap scene-content">
        <div className="hero-glass glass-deep">
          <div className="glass-toolbar"><span><i/> Disponible pour de nouveaux projets</span><span>Grand Montréal · Laval</span></div>
          <div className="hero-glass-body">
            <p className="eyebrow glass-label">Accompagnement immobilier résidentiel</p>
            <h1>Une stratégie claire.<br/><em>Une expérience plus légère.</em></h1>
            <p>Émilie transforme chaque transaction en un parcours structuré, humain et transparent — de la première réflexion jusqu’aux clés.</p>
            <div className="hero-actions"><Link className="button red" href="/demandes-sur-mesure">Obtenir une estimation <ArrowUpRight/></Link><a className="button frost" href="mailto:emilie@equipecauvier.com?subject=Planifier%20un%20appel">Planifier un appel <ArrowRight/></a></div>
          </div>
          <div className="glass-statusbar"><span><ShieldCheck/> Représentation rigoureuse</span><span><MessageCircle/> Communication directe</span><span><Compass/> Expertise locale</span></div>
        </div>
        <div className="profile-float glass-deep"><div className="profile-thumb"><Image src="/emilie.webp" alt="Émilie Cauvier" fill sizes="64px"/></div><div><strong>Émilie Cauvier</strong><small>Courtière immobilière résidentielle</small></div><span className="profile-dot"/></div>
      </div>
    </section>

    <section className="glass-section services-scene">
      <div className="wrap">
        <div className="section-title-row"><div><p className="eyebrow">Votre parcours</p><h2>Trois besoins. Une même exigence.</h2></div><p>Des outils modernes, mais surtout une présence réelle à chaque décision importante.</p></div>
        <div className="service-dashboard glass-light">
          <div className="dashboard-side"><span className="side-dot active"/><span className="side-dot"/><span className="side-dot"/><i/><Sparkles/></div>
          <div className="service-panels">{services.map(({title,text,icon:Icon},index)=><Link href="/demandes-sur-mesure" className="service-panel" key={title}><div className="panel-top"><span>0{index+1}</span><ArrowUpRight/></div><Icon/><h3>{title}</h3><p>{text}</p><span className="panel-link">Explorer <ArrowRight/></span></Link>)}</div>
        </div>
      </div>
    </section>

    <section className="property-experience scene">
      <div className="wrap property-shell glass-deep">
        <div className="property-image"><Image src="/property-card.webp" alt="Propriété présentée par Émilie Cauvier" fill sizes="(max-width:800px) 90vw, 52vw"/></div>
        <div className="property-panel"><div className="glass-toolbar"><span>Propriétés</span><span>Inscriptions actives</span></div><div><p className="eyebrow glass-label">Le marché en ce moment</p><h2>Explorez les propriétés avec les bonnes informations.</h2><p>Consultez les inscriptions actuelles et contactez Émilie pour obtenir le contexte qui ne se trouve pas dans une fiche.</p><Link className="button red" href="/proprietes">Voir les propriétés <ArrowUpRight/></Link></div></div>
      </div>
    </section>

    <section className="about-experience">
      <div className="wrap about-shell">
        <div className="about-portrait"><Image src="/emilie.webp" alt="Portrait d’Émilie Cauvier" fill sizes="(max-width:800px) 90vw, 38vw"/><div className="portrait-badge glass-deep">Plus de 10 ans<br/><strong>d’accompagnement</strong></div></div>
        <div className="about-glass glass-light"><p className="eyebrow">À propos</p><h2>La technologie simplifie. L’écoute fait la différence.</h2><p>Émilie rassemble les bonnes données, les bons professionnels et les bonnes questions pour protéger vos intérêts sans rendre le processus plus lourd.</p><ul><li><Check/> Une recommandation expliquée</li><li><Check/> Un suivi constant et accessible</li><li><Check/> Une stratégie adaptée à votre échéancier</li></ul><Link className="button outline-red" href="/demandes-sur-mesure">Présenter mon projet <ArrowRight/></Link></div>
      </div>
    </section>

    <section className="growth-scene scene">
      <div className="wrap growth-grid">
        <article className="growth-card glass-deep"><Compass/><p className="eyebrow glass-label">Studio immobilier</p><h2>Testez vos chiffres.</h2><p>Un calculateur plus lisible pour préparer vos prochaines questions.</p><Link href="/outils">Ouvrir les outils <ArrowRight/></Link></article>
        <article className="growth-card glass-deep"><Handshake/><p className="eyebrow glass-label">Partenariats</p><h2>Créons de la valeur locale.</h2><p>Contenu, événements et expériences utiles aux propriétaires.</p><Link href="/partenaires">Voir les formats <ArrowRight/></Link></article>
      </div>
    </section>
  </main>;
}
