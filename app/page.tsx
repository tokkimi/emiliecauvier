import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Compass, Handshake, Home, KeyRound, Sparkles } from "lucide-react";

const paths = [
  { n: "01", title: "Acheter", text: "Décoder le marché, visiter mieux et négocier avec confiance.", icon: KeyRound, tone: "lime" },
  { n: "02", title: "Vendre", text: "Positionner votre propriété et orchestrer une mise en marché mémorable.", icon: Home, tone: "coral" },
  { n: "03", title: "Investir", text: "Transformer les données en décisions claires et durables.", icon: Building2, tone: "blue" },
  { n: "04", title: "Projet atypique", text: "Relocalisation, intergénération, hors marché : on bâtit le bon plan.", icon: Sparkles, tone: "cream" }
];

export default function HomePage() {
  return <main id="contenu">
    <section className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow"><span className="live-dot"/> Montréal · Laval · Rive-Nord</p>
        <h1>L’immobilier,<br/><em>autrement.</em></h1>
        <p className="hero-lead">Une approche précise, humaine et franchement plus simple pour transformer votre prochain mouvement en bonne décision.</p>
        <div className="hero-actions"><Link className="button dark" href="/demandes-sur-mesure">Démarrer mon projet <ArrowUpRight size={18}/></Link><Link className="text-link" href="/outils">Explorer les outils <ArrowRight size={17}/></Link></div>
      </div>
      <div className="hero-visual">
        <div className="portrait-frame"><Image src="/emilie.webp" alt="Émilie Cauvier, courtière immobilière" fill priority sizes="(max-width: 800px) 90vw, 42vw"/></div>
        <div className="floating-card top"><Compass size={20}/><span>Stratégie locale<br/><strong>Vision à 360°</strong></span></div>
        <div className="floating-card bottom"><span className="mini-avatars">EC</span><span>Votre alliée<br/><strong>du premier café aux clés</strong></span></div>
      </div>
    </section>

    <section className="manifesto"><div className="wrap manifesto-grid"><p className="eyebrow">Plus qu’une transaction</p><h2>Votre projet mérite une stratégie qui vous ressemble — pas une formule toute faite.</h2><p>Émilie relie expertise terrain, réseau local et outils intelligents pour que chaque étape soit plus lisible, plus fluide et plus sereine.</p></div></section>

    <section className="section wrap">
      <div className="section-head"><div><p className="eyebrow">Choisissez votre trajectoire</p><h2>Un point de départ.<br/>Quatre façons d’avancer.</h2></div><p>Dites-nous où vous en êtes. Nous adaptons le parcours, les outils et le rythme à votre réalité.</p></div>
      <div className="path-grid">{paths.map(({n,title,text,icon:Icon,tone}) => <Link href="/demandes-sur-mesure" className={`path-card ${tone}`} key={title}><span className="card-number">{n}</span><Icon/><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="corner-arrow"/></Link>)}</div>
    </section>

    <section className="studio-section">
      <div className="wrap studio-grid">
        <div className="studio-intro"><p className="eyebrow">Le studio immobilier</p><h2>Des outils qui rendent les grandes décisions un peu plus légères.</h2><p>Simulez, clarifiez, comparez. Pas pour remplacer une conversation — pour la rendre beaucoup plus utile.</p><Link className="button light" href="/outils">Ouvrir le studio <ArrowUpRight size={18}/></Link></div>
        <div className="tool-preview">
          <div className="tool-top"><span>Capacité mensuelle</span><span className="status-pill">Simulation</span></div>
          <div className="big-number">2 840 <small>$/mois</small></div>
          <div className="signal-bars"><i/><i/><i/><i/><i/></div>
          <div className="tool-rows"><span>Hypothèque estimée <b>2 410 $</b></span><span>Taxes & frais <b>430 $</b></span></div>
          <p>Un aperçu éducatif. Les résultats doivent être validés avec un professionnel qualifié.</p>
        </div>
      </div>
    </section>

    <section className="section wrap split-feature">
      <div className="feature-card partner"><Handshake/><p className="eyebrow">Marques & partenaires</p><h2>Créer de la valeur, ensemble.</h2><p>Commandites locales, contenus éducatifs, événements de quartier et offres utiles aux propriétaires.</p><Link href="/partenaires">Découvrir les collaborations <ArrowRight size={17}/></Link></div>
      <div className="feature-card special"><Sparkles/><p className="eyebrow">Rien de standard?</p><h2>Parfait. On aime les projets singuliers.</h2><p>Recherche discrète, vente complexe, arrivée au Québec, propriété multigénérationnelle ou échéancier serré.</p><Link href="/demandes-sur-mesure">Décrire ma situation <ArrowRight size={17}/></Link></div>
    </section>

    <section className="quote-section wrap"><blockquote>« Le bon courtier ne vous pousse pas vers une décision. Il vous donne tout ce qu’il faut pour prendre la vôtre. »</blockquote><div><span className="signature">Émilie</span><p>Écoute. Clarté. Mouvement.</p></div></section>
  </main>;
}
