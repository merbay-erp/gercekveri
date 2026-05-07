import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ComparisonResultCard } from "@/components/comparison-result";
import { ShareButtons } from "@/components/share-buttons";
import { AidatComparisonForm } from "./comparison-form";
import { listAidatSubmissions } from "@/modules/aidat/server/queries";
import { siteTypeLabels } from "@/modules/aidat/config";
import { findCityBySlug } from "@/lib/cities";
import { computeComparison, buildComparisonUrl } from "@/lib/comparison";
import { formatTRY } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

type SearchParams = Promise<{
  city?: string;
  district?: string;
  siteType?: string;
  amount?: string;
}>;

const baseMeta: Metadata = {
  title: "Aidatını bölgesel ortalamayla karşılaştır",
  description:
    "Site / apartman aidatın çevre medyanının üstünde mi altında mı? Anonim sakin verisinden gerçek kıyas.",
  alternates: { canonical: "/karsilastir/aidat" },
};

const VALID_SITE_TYPES = new Set(["BLOCK", "VILLA", "INDEPENDENT", "RESIDENCE"]);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (!sp.amount) return baseMeta;
  const ogParams = new URLSearchParams({ kind: "aidat", amount: sp.amount });
  if (sp.city) ogParams.set("city", sp.city);
  if (sp.district) ogParams.set("district", sp.district);
  if (sp.siteType && VALID_SITE_TYPES.has(sp.siteType)) {
    ogParams.set("siteType", sp.siteType);
  }
  const ogUrl = `/api/og/comparison?${ogParams.toString()}`;
  return {
    ...baseMeta,
    openGraph: {
      ...(baseMeta.openGraph ?? {}),
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
  };
}

export default async function CompareAidatPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const amountNum = Number(sp.amount);
  const hasInput = sp.amount !== undefined && Number.isFinite(amountNum) && amountNum > 0;

  const citySlug = sp.city || undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;
  const districtName = sp.district?.trim() || undefined;
  const siteType =
    sp.siteType && VALID_SITE_TYPES.has(sp.siteType)
      ? (sp.siteType as keyof typeof siteTypeLabels)
      : undefined;

  let result = null;
  let scopeLabel = "Türkiye geneli — site aidatları";
  let exploreHref = "/aidat";
  let shareUrl = "";
  let shareText = "";

  if (hasInput) {
    const submissions = await listAidatSubmissions({ citySlug, limit: 1000 }).catch(() => []);

    const filtered = submissions.filter((s) => {
      if (siteType && s.data.siteType !== siteType) return false;
      if (
        districtName &&
        !(s.data.districtName ?? "").toLowerCase().includes(districtName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    const sorted = filtered
      .map((s) => s.amount)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);

    const labelParts: string[] = [];
    if (cityRecord) labelParts.push(cityRecord.name);
    if (districtName) labelParts.push(districtName);
    if (siteType) labelParts.push(siteTypeLabels[siteType]);
    if (labelParts.length) {
      scopeLabel = labelParts.join(" · ");
    }
    if (cityRecord) exploreHref = `/aidat/sehir/${cityRecord.slug}`;

    result = computeComparison({
      value: amountNum,
      sortedPeers: sorted,
      subjectLabel: "Aidatın",
      scopeLabel,
      higherIsBetter: false,
      formatValue: (n) => formatTRY(n),
    });

    shareUrl = buildComparisonUrl("https://gercekveri.com", "aidat", {
      city: citySlug,
      district: districtName,
      siteType,
      amount: amountNum,
    });
    shareText = result
      ? `${result.headline} ${formatTRY(amountNum)} · ${siteConfig.name}`
      : `Aidatımı karşılaştırdım — ${siteConfig.name}`;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <Link
          href="/karsilastir"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Karşılaştırma menüsü
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Aidatını karşılaştır
        </h1>
        <p className="text-muted-foreground">
          Anonim sakin verisinden hesaplanmış bölge medyanı ile kıyasla. Yapı tipini
          seçersen eşleşme keskinleşir — rezidans aidatı blok aidatından çok farklıdır.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <AidatComparisonForm />
      </Card>

      {hasInput ? (
        <div className="mt-8 space-y-6">
          {result ? (
            <>
              <ComparisonResultCard
                result={result}
                context={scopeLabel}
                exploreHref={exploreHref}
                exploreLabel={`${cityRecord?.name ?? "Türkiye"} aidat verilerine git`}
              />

              <Card className="space-y-3 p-5">
                <p className="text-sm font-medium">Sonucu paylaş</p>
                <p className="text-xs text-muted-foreground">
                  Bağlantıyı paylaştığında alıcı, senin yazdığın değerleri tekrar görür ama
                  hiçbir kişisel bilgi yer almaz.
                </p>
                <ShareButtons url={shareUrl} text={shareText} />
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                Bu kapsam için yeterli paylaşım yok (en az 3 gerekli). Yapı tipi filtresini
                kaldır ya da daha geniş bir bölge dene.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
