import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{const base="https://emiliecauvier.com";return ["","/proprietes","/outils","/demandes-sur-mesure","/partenaires","/confidentialite"].map(url=>({url:base+url,lastModified:new Date(),changeFrequency:url===""||url==="/proprietes"?"weekly":"monthly",priority:url===""?1:.7}))}
