import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{const base="https://emiliecauvier.com";return ["","/outils","/demandes-sur-mesure","/partenaires","/confidentialite"].map(url=>({url:base+url,lastModified:new Date(),changeFrequency:url===""?"weekly":"monthly",priority:url===""?1:.7}))}
