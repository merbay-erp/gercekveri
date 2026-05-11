/**
 * Schema.org JSON-LD yardimcilari.
 *
 * Hedef: Google Dataset Search + Knowledge Graph + zengin sonuclar.
 *
 * Kurallar:
 * - Founder/Author = Mustafa Erbay (Wikidata Q139679043 + ORCID 0009-0005-9624-4249)
 * - License = CC-BY-4.0 (anonim katki + agregat statlar)
 * - Spatial coverage = Turkiye (ISO 3166-1: TR)
 * - inLanguage = tr-TR
 *
 * Kullanim:
 *   import { organizationSchema, datasetSchema, ... } from "@/lib/schema-org";
 *   import { SchemaOrg } from "@/components/schema-org";
 *   <SchemaOrg data={organizationSchema()} />
 */

import { siteConfig } from "./site-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";
const ORG_ID = `${SITE_URL}#organization`;
const PERSON_ID = `${SITE_URL}#person-mustafa-erbay`;
const WEBSITE_ID = `${SITE_URL}#website`;

// ============ Person: Mustafa Erbay ============
// Knowledge graph icin EN guclu kanonik kisi tanimi.
// Wikidata + ORCID kanonik identifier'lar.
export function personMustafaErbay() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Mustafa Erbay",
    alternateName: ["Mustafa ERBAY", "merbay-erp"],
    url: "https://mustafaerbay.com.tr/",
    jobTitle: "System Architect & Infrastructure Engineer",
    description:
      "System Architect ve Infrastructure Engineer, 20+ yil production deneyimi. mustafaerbay.com.tr blog yazari. gercekveri.com kurucusu.",
    nationality: { "@type": "Country", name: "Türkiye" },
    homeLocation: { "@type": "Place", name: "Bursa, Türkiye" },
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "WD",
        value: "Q139679043",
        url: "https://www.wikidata.org/wiki/Q139679043",
      },
      {
        "@type": "PropertyValue",
        propertyID: "ORCID",
        value: "0009-0005-9624-4249",
        url: "https://orcid.org/0009-0005-9624-4249",
      },
    ],
    sameAs: [
      "https://www.wikidata.org/wiki/Q139679043",
      "https://orcid.org/0009-0005-9624-4249",
      "https://mustafaerbay.com.tr/",
      "https://github.com/merbay-erp",
      "https://www.linkedin.com/in/mustafa-e-6a891370/",
      "https://bsky.app/profile/mustafaerbay.bsky.social",
      "https://x.com/merbay86",
      "https://mastodon.social/@mustafaerbay",
      "https://dev.to/merbayerp",
      "https://mustafaerbay.hashnode.dev/",
    ],
  };
}

// ============ Organization ============
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: ["GerçekVeri", "gercekveri.com", "Gerçek Veri"],
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: "2026",
    founder: { "@id": PERSON_ID },
    knowsAbout: [
      "Maaş istatistikleri",
      "Kira fiyatları",
      "Internet maliyetleri",
      "Fatura giderleri",
      "Aidat oranları",
      "TCMB konut fiyat endeksi",
      "Türkiye ekonomik veri",
      "Anonim veri toplama",
      "K-anonymity",
    ],
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
      identifier: "TR",
    },
    sameAs: [
      "https://github.com/merbay-erp/gercekveri",
      "https://twitter.com/gercekveri",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@gercekveri.com",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  };
}

// ============ WebSite (with SearchAction) ============
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    alternateName: ["GerçekVeri", "gercekveri.com"],
    url: SITE_URL,
    description: siteConfig.description,
    inLanguage: "tr-TR",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/karsilastir?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ============ Dataset (kategori sayfalari icin) ============
export interface DatasetInput {
  name: string;
  description: string;
  url: string; // absolute or relative
  keywords: string[];
  variableMeasured?: string[]; // e.g. ["amount", "currency"]
  measurementTechnique?: string; // e.g. "Anonim katki + agregat"
  citation?: string;
  recordCount?: number;
  temporalCoverage?: string; // ISO 8601 e.g. "2024/2026"
}

export function datasetSchema(d: DatasetInput) {
  const url = d.url.startsWith("http") ? d.url : `${SITE_URL}${d.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: d.name,
    description: d.description,
    url,
    keywords: d.keywords.join(", "),
    inLanguage: "tr-TR",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    creator: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    spatialCoverage: {
      "@type": "Place",
      name: "Türkiye",
      geo: {
        "@type": "GeoShape",
        addressCountry: "TR",
      },
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/html",
      contentUrl: url,
    },
    ...(d.variableMeasured && {
      variableMeasured: d.variableMeasured.map((v) => ({
        "@type": "PropertyValue",
        name: v,
      })),
    }),
    ...(d.measurementTechnique && { measurementTechnique: d.measurementTechnique }),
    ...(d.citation && { citation: d.citation }),
    ...(d.recordCount && {
      size: { "@type": "QuantitativeValue", value: d.recordCount, unitText: "submissions" },
    }),
    ...(d.temporalCoverage && { temporalCoverage: d.temporalCoverage }),
  };
}

// ============ FAQPage ============
export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

// ============ BreadcrumbList ============
export interface BreadcrumbItem {
  name: string;
  url: string; // absolute or relative
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ============ AggregateRating (stats > threshold) ============
// Bir kategori sayfasinda yeterli sayida submission varsa,
// "ratingCount" olarak gosterilebilir (review sayisi).
export function aggregateRatingSchema(opts: {
  itemUrl: string;
  itemName: string;
  count: number;
  bestRating?: number;
}) {
  const url = opts.itemUrl.startsWith("http") ? opts.itemUrl : `${SITE_URL}${opts.itemUrl}`;
  return {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: opts.itemName,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: opts.bestRating ?? 5,
      ratingCount: opts.count,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

// ============ SiteNavigationElement ============
// Header menu items — AdSense Auto Ads icin sayfa anlamlandirmasi gucludur.
// Google bot icin "bu sayfa hangi alanin parcasi" sinyali.
export function siteNavigationSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Site navigation",
    itemListElement: items.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ============ Graph combiner (cok schema'yi tek script'te) ============
export function jsonLdGraph(...schemas: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map((s) => {
      // strip outer @context to avoid duplication
      const { ["@context"]: _ctx, ...rest } = s as Record<string, unknown>;
      return rest;
    }),
  };
}
