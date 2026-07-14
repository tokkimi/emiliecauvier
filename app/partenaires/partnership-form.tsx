"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Building2, Check, FileText, Link2, Mail, Paperclip, Plus, Trash2, UserRound, X } from "lucide-react";

type Contact = { name: string; role: string; email: string; phone: string };
const emptyContact = (): Contact => ({ name:"", role:"", email:"", phone:"" });
const partnershipTypes = ["Contenu commandité", "Vidéo ou série", "Réseaux sociaux", "Événement", "Concours", "Infolettre", "Programme de recommandation", "Initiative locale", "Média ou entrevue", "Autre"];
const budgets = ["Moins de 1 000 $", "1 000–2 500 $", "2 500–5 000 $", "5 000–10 000 $", "10 000 $ et plus", "À déterminer"];

export function PartnershipForm() {
  const [contacts, setContacts] = useState<Contact[]>([emptyContact()]);
  const [links, setLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");

  const fileSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const updateContact = (index: number, key: keyof Contact, value: string) => setContacts((items) => items.map((item, itemIndex) => itemIndex === index ? {...item, [key]:value} : item));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const contactText = contacts.map((contact, index) => `Contact ${index + 1} : ${contact.name} — ${contact.role || "rôle à préciser"}\n${contact.email}${contact.phone ? ` · ${contact.phone}` : ""}`).join("\n\n");
    const linkText = links.filter(Boolean).join("\n") || "Aucun lien fourni";
    const fileText = files.length ? files.map((file) => file.name).join(", ") : "Aucune pièce jointe";
    const body = `Bonjour Émilie,\n\nENTREPRISE\n${data.get("company")}\n${data.get("website") || "Site à préciser"}\n\nTYPE DE PARTENARIAT\n${data.get("partnershipType")}\n\nOBJECTIF\n${data.get("objective")}\n\nBUDGET ET ÉCHÉANCIER\n${data.get("budget")} · ${data.get("timing") || "À déterminer"}\n\nBRIEF\n${data.get("brief")}\n\nCONTACTS\n${contactText}\n\nLIENS\n${linkText}\n\nPIÈCES JOINTES SÉLECTIONNÉES\n${fileText}\n\nConsentement de contact : oui`;

    try {
      if (files.length && navigator.canShare?.({ files })) {
        await navigator.share({ title:"Proposition de partenariat", text:body, files });
        setNotice("Votre dossier et ses pièces jointes ont été transmis à l’application choisie.");
      } else {
        window.location.href = `mailto:emilie@equipecauvier.com?subject=${encodeURIComponent(`Partenariat — ${String(data.get("company"))}`)}&body=${encodeURIComponent(body)}`;
        setNotice(files.length ? "Votre messagerie va s’ouvrir. Ajoutez les PDF indiqués avant l’envoi." : "Votre proposition est prête dans votre messagerie.");
      }
    } catch {
      setNotice("L’envoi a été annulé. Vos informations sont toujours présentes dans le formulaire.");
    }
  };

  return <section id="proposer" className="partnership-form-section">
    <div className="wrap partnership-form-layout">
      <aside className="partnership-form-intro">
        <p className="eyebrow">Dossier de collaboration</p>
        <h2>Une bonne idée mérite un brief solide.</h2>
        <p>Présentez le projet, les personnes impliquées et les documents utiles. Rien n’est téléversé ni conservé par ce site.</p>
        <div className="form-trust glass-deep"><span><Check/> Plusieurs contacts</span><span><Check/> Liens et références</span><span><Check/> PDF jusqu’à 10 Mo</span><span><Check/> Partage privé</span></div>
      </aside>

      <form className="partnership-form glass-light" onSubmit={submit}>
        <div className="form-window-bar"><span><i/> Nouveau partenariat</span><span>Privé · Non enregistré</span></div>
        <div className="form-block">
          <div className="form-block-title"><Building2/><div><span>01</span><h3>L’organisation et le projet</h3></div></div>
          <div className="partner-field-grid">
            <label>Entreprise ou organisation<input name="company" required placeholder="Nom de l’entreprise"/></label>
            <label>Site Web<input name="website" type="url" placeholder="https://"/></label>
            <label>Type de partenariat<select name="partnershipType" required defaultValue=""><option value="" disabled>Sélectionner</option>{partnershipTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Budget envisagé<select name="budget" required defaultValue=""><option value="" disabled>Sélectionner</option>{budgets.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="wide">Objectif principal<input name="objective" required placeholder="Notoriété, acquisition, événement, contenu éducatif…"/></label>
            <label className="wide">Date ou période souhaitée<input name="timing" placeholder="Ex. automne 2026 ou date précise"/></label>
          </div>
        </div>

        <div className="form-block">
          <div className="form-block-title"><FileText/><div><span>02</span><h3>Le brief</h3></div></div>
          <label className="partner-textarea">Décrivez le concept, le public visé et les livrables<textarea name="brief" required minLength={30} placeholder="Contexte, idée, audience, plateformes, résultats recherchés, contraintes de marque…"/></label>
          <div className="partner-upload">
            <input id="partner-files" type="file" accept="application/pdf" multiple onChange={(event) => {
              const nextFiles = Array.from(event.target.files || []);
              if (nextFiles.some((file) => file.size > 10 * 1024 * 1024) || nextFiles.reduce((sum, file) => sum + file.size, 0) > 10 * 1024 * 1024) { setNotice("Les PDF doivent totaliser au maximum 10 Mo."); event.target.value = ""; setFiles([]); return; }
              setFiles(nextFiles); setNotice("");
            }}/>
            <label htmlFor="partner-files"><Paperclip/><span><strong>Ajouter un brief PDF</strong><small>Un ou plusieurs PDF · 10 Mo maximum au total</small></span></label>
            {files.length > 0 && <div className="selected-files">{files.map((file) => <span key={`${file.name}-${file.size}`}><FileText/>{file.name}<small>{(file.size / 1024 / 1024).toFixed(1)} Mo</small></span>)}<button type="button" onClick={() => setFiles([])}><X/> Retirer</button><em>{(fileSize / 1024 / 1024).toFixed(1)} Mo au total</em></div>}
          </div>
          <div className="repeater">
            <div className="repeater-title"><span><Link2/> Liens utiles</span><button type="button" onClick={() => setLinks((items) => [...items, ""])}><Plus/> Ajouter un lien</button></div>
            {links.map((link, index) => <div className="repeat-row" key={index}><input aria-label={`Lien ${index + 1}`} type="url" value={link} onChange={(event) => setLinks((items) => items.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="Présentation, campagne, dossier de marque…"/>{links.length > 1 && <button type="button" aria-label="Retirer ce lien" onClick={() => setLinks((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2/></button>}</div>)}
          </div>
        </div>

        <div className="form-block">
          <div className="form-block-title"><UserRound/><div><span>03</span><h3>Les personnes-ressources</h3></div></div>
          <div className="contact-repeater">{contacts.map((contact, index) => <fieldset key={index}><legend>Contact {index + 1}</legend><div className="partner-field-grid"><label>Nom<input required value={contact.name} onChange={(event) => updateContact(index,"name",event.target.value)} placeholder="Prénom et nom"/></label><label>Rôle<input value={contact.role} onChange={(event) => updateContact(index,"role",event.target.value)} placeholder="Direction marketing…"/></label><label>Courriel<input required type="email" value={contact.email} onChange={(event) => updateContact(index,"email",event.target.value)} placeholder="nom@entreprise.com"/></label><label>Téléphone<input type="tel" value={contact.phone} onChange={(event) => updateContact(index,"phone",event.target.value)} placeholder="514 000-0000"/></label></div>{contacts.length > 1 && <button className="remove-contact" type="button" onClick={() => setContacts((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2/> Retirer ce contact</button>}</fieldset>)}</div>
          <button className="add-contact" type="button" onClick={() => setContacts((items) => [...items, emptyContact()])}><Plus/> Ajouter une personne-ressource</button>
        </div>

        <label className="consent-line"><input type="checkbox" required/><span>J’autorise Émilie Cauvier à utiliser ces renseignements uniquement pour analyser cette proposition et communiquer avec les personnes indiquées.</span></label>
        {notice && <p className="form-notice" role="status"><Mail/>{notice}</p>}
        <button className="button red partnership-submit" type="submit">Préparer et partager le dossier <ArrowRight/></button>
        <small className="form-privacy">Les champs et PDF demeurent dans votre navigateur. Lorsque le partage de fichiers est pris en charge, votre appareil vous laisse choisir l’application destinataire. Sinon, votre messagerie s’ouvre et vous devrez joindre les PDF manuellement.</small>
      </form>
    </div>
  </section>;
}
