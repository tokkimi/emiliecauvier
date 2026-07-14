import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Check, Compass, Handshake, Home, KeyRound, MessageCircle, ShieldCheck } from "lucide-react";

const services = [
  { title: "Acheter", text: "Une recherche mieux ciblée, des visites plus utiles et une négociation menée avec méthode.", icon: KeyRound },
  { title: "Vendre", text: "Un positionnement juste, une mise en marché soignée et un suivi clair du début à la signature.", icon: Home },
  { title: "Investir", text: "Une lecture structurée des occasions pour décider avec des données, pas avec la pression.", icon: Building2 }
];

export default function HomePage() {
  return <main id="contenu">
    <section className="hero wrap">
      <div className="hero-copy glass-panel">
        <p className="eyebrow"><span className="live-dot"/> Grand Montréal · Laval</p>
        <h1>Votre projet immobilier.<br/><em>Notre stratégie.</em></h1>
        <p className="hero-lead">Émilie vous accompagne avec une approche humaine, précise et personnalisée — pour vendre, acheter ou investir avec confiance.</p>
        <div className="hero-actions">
          <Link className="button primary" href="/demandes-sur-mesure">Obtenir une estimation <ArrowUpRight size={17}/></Link>
          <a className="button secondary" href="mailto:emilie@equipecauvier.com?subject=Planifier%20un%20appel">Planifier un appel <ArrowRight size={17}/></a>
        </div>
        <div className="hero-trust"><span><Check/> Plus de 10 ans d’expérience</span><span><Check/> Accompagnement sur mesure</span></div>
      </div>
      <div className="hero-visual">
        <div className="portrait-frame"><Image src="/emilie.webp" alt="Émilie Cauvier, courtière immobilière" fill priority sizes="(max-width: 800px) 92vw, 42vw"/></div>
        <div className="floating-card"><span className="monogram">EC</span><span><strong>Émilie Cauvier</strong><small>Courtière immobilière résidentielle</small></span></div>
      </div>
    </section>

    <section className="trust-bar"><div className="wrap"><span><ShieldCheck/> Une représentation rigoureuse</span><span><Compass/> Une expertise locale</span><span><MessageCircle/> Une communication directe</span></div></section>

    <section className="section wrap">
      <div className="section-head compact"><div><p className="eyebrow">Votre projet, bien entouré</p><h2>Une approche adaptée à votre réalité.</h2></div><p>Chaque mandat commence par une écoute attentive, puis se transforme en plan d’action simple et concret.</p></div>
      <div className="service-grid">{services.map(({title,text,icon:Icon},index)=><Link href="/demandes-sur-mesure" className="service-card glass-card" key={title}><span className="service-index">0{index+1}</span><Icon/><h3>{title}</h3><p>{text}</p><span className="card-link">Découvrir le parcours <ArrowRight size={16}/></span></Link>)}</div>
    </section>

    <section className="listings-band">
      <div className="wrap listings-inner">
        <div><p className="eyebrow light">Propriétés</p><h2>Découvrez les occasions actuellement sur le marché.</h2><p>Consultez les inscriptions actives, les détails complets et les nouveautés dans les secteurs desservis par Émilie.</p></div>
        <a className="button white" href="https://www.emiliecauvier.com/fr/nos-proprietes">Voir les propriétés <ArrowUpRight size={17}/></a>
      </div>
    </section>

    <section className="section wrap about-grid" id="a-propos">
      <div className="about-photo"><Image src="/emilie.webp" alt="Portrait d’Émilie Cauvier" fill sizes="(max-width: 800px) 92vw, 38vw"/></div>
      <div className="about-copy"><p className="eyebrow">À propos</p><h2>Une présence rassurante. Une stratégie qui avance.</h2><p>Pour Émilie, une transaction immobilière est d’abord une décision de vie. Son rôle : rendre le processus compréhensible, protéger vos intérêts et coordonner chaque étape avec constance.</p><ul><li><Check/> Conseils clairs et sans pression</li><li><Check/> Disponibilité et suivi régulier</li><li><Check/> Réseau de professionnels de confiance</li></ul><Link className="text-link" href="/demandes-sur-mesure">Parler de votre projet <ArrowRight size={16}/></Link></div>
    </section>

    <section className="section surface-section">
      <div className="wrap dual-grid">
        <article className="feature-card glass-card"><div className="feature-icon"><Compass/></div><p className="eyebrow">Outils</p><h2>Préparez votre décision.</h2><p>Testez un scénario hypothécaire et arrivez à votre prochain échange avec de meilleures questions.</p><Link className="text-link" href="/outils">Accéder aux outils <ArrowRight size={16}/></Link></article>
        <article className="feature-card dark-card"><div className="feature-icon"><Handshake/></div><p className="eyebrow light">Partenariats</p><h2>Créons quelque chose d’utile.</h2><p>Marques locales, contenu, événements et collaborations qui apportent une vraie valeur aux propriétaires.</p><Link className="text-link light" href="/partenaires">Découvrir les partenariats <ArrowRight size={16}/></Link></article>
      </div>
    </section>

    <section className="final-cta wrap glass-card"><div><p className="eyebrow">Votre prochaine étape</p><h2>Parlons de ce que vous voulez accomplir.</h2></div><div><Link className="button primary" href="/demandes-sur-mesure">Décrire mon projet <ArrowUpRight size={17}/></Link><a href="tel:+15147749818">Ou appeler le 514 774-9818</a></div></section>
  </main>;
}
