export default function ChapterLeadsAdmin() {
  return <section className="space-y-4 font-ui">
    <h1 className="font-display text-3xl">Accès aux chapitres gratuits</h1>
    <p>L’export marketing contient uniquement les personnes ayant donné leur accord à l’infolettre.</p>
    <p><a className="underline" href="/api/admin/chapter-leads?marketing=1">Exporter les contacts avec consentement marketing</a></p>
    <p><a className="underline" href="/api/admin/chapter-leads">Exporter le registre des accès</a></p>
  </section>;
}
