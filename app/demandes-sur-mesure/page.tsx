import type { Metadata } from "next";
import { RequestBuilder } from "./request-builder";
export const metadata: Metadata={title:"Demandes immobilières sur mesure",description:"Présentez votre projet immobilier atypique à Émilie Cauvier."};
export default function SpecialRequests(){return <main id="contenu"><section className="page-hero request-hero wrap"><p className="eyebrow">Votre situation, votre parcours</p><h1>Les projets les plus intéressants<br/><em>ne rentrent pas dans une case.</em></h1><p>Quelques choix suffisent pour préparer un brief clair. Rien n’est enregistré : votre demande s’ouvre ensuite dans votre application courriel.</p></section><RequestBuilder/></main>}
