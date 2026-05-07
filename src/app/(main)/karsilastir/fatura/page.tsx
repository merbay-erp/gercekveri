import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ComparisonResultCard } from "@/components/comparison-result";
import { ShareButtons } from "@/components/share-buttons";
import { FaturaComparisonForm } from "./comparison-form";
import { listFaturaSubmissions } from "@/modules/fatura/server/queries";
import {
  utilityLabels,
  householdSizeLabels,
  type UtilityType,
  type HouseholdSize,
} from "@/modules/fatura/config";
import { findCityBySlug } from "@/lib/cities";
import { computeComparison, buildComparisonUrl } from "@/lib/comparison";
import { formatTRY } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

type SearchParams = Promise<{
  utilityType?: string;
  city?: string;
  householdSize?: string;
  consumption?: string;
  amount?: string;
}>;

const VALID_UTILITY = new Set(["ELEKTRIK", "DOGALGAZ", "SU"]);
const VALID_HH = new Set(["1", "2", "3", "4", "5+"]);

const baseMeta: Metadata = {
  title: "Faturanı bölgesel ortalamayla karşılaştır",
  description:
    "Elektrik, doğalgaz ya da su faturan çevre medyanının üstünde mi altında mı? Anonim hane verisinden gerçek kıyas.",
  alternates: { canonical: "/karsilastir/fatura" },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (!sp.amount) return baseMeta;
  const ogParams = new URLSearchParams({ kind: "fatura", amount: sp.amount });
  if (sp.utilityType && VALID_UTILITY.has(sp.utilityType)) {
    ogParams.set("utilityType", sp.utilityType);
  }
  if (sp.city) ogParams.set("city", sp.city);
  if (sp.householdSize && VALID_HH.has(sp.householdSize)) {
    ogParams.set("householdSize", sp.householdSize);
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

export default async function CompareFaturaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const amountNum = Number(sp.amount);
  const hasInput = sp.amount !== undefined && Number.isFinite(amountNum) && amountNum > 0;

  const utilityType: UtilityType = VALID_UTILITY.has(sp.utilityType ?? "")
    ? (sp.utilityType as UtilityType)
    : "ELEKTRIK";
  const citySlug = sp.city || undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;
  const householdSize: HouseholdSize | undefined = VALID_HH.has(sp.householdSize ?? "")
    ? (sp.householdSize as HouseholdSize)
    : undefined;

  let result = null;
  let scopeLabel = `Türkiye geneli — ${utilityLabels[utilityType].toLowerCase()} faturaları`;
  let exploreHref = "/fatura";
  let shareUrl = "";
  let shareText = "";

  if (hasInput) {
    const submissions = await listFaturaSubmissions({
      citySlug,
      utilityType,
      limit: 1000,
    }).catch(() => []);

    const filtered = householdSize
      ? submissions.filter((s) => s.data.householdSize === householdSize)
      : submissions;

    const sorted = filtered
      .map((s) => s.amount)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);

    const labelParts: string[] = [utilityLabels[utilityType]];
    if (cityRecord) labelParts.push(cityRecord.name);
    if (householdSize) labelParts.push(householdSizeLabels[householdSize]);
    scopeLabel = labelParts.join(" · ");
    if (cityRecord) exploreHref = `/fatura/sehir/${cityRecord.slug}`;

    result = computeComparison({
      value: amountNum,
      sortedPeers: sorted,
      subjectLabel: "Faturan",
      scopeLabel,
      higherIsBetter: false,
      formatValue: (n) => formatTRY(n),
    });

    shareUrl = buildComparisonUrl("https://gercekveri.com", "fatura", {
      utilityType,
      city: citySlug,
      householdSize,
      amount: amountNum,
    });
    shareText = result
      ? `${result.headline} ${formatTRY(amountNum)} · ${siteConfig.name}`
      : `Faturamı karşılaştırdım — ${siteConfig.name}`;
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
          Faturanı karşılaştır
        </h1>
        <p className="text-muted-foreground">
          Anonim hane verisinden hesaplanmış medyan ile kıyasla. Hane büyüklüğü
          seçersen eşleşme keskinleşir — 1 kişilik fatura 5 kişilik haneyle
          kıyaslanmaz.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <FaturaComparisonForm />
      </Card>

      {hasInput ? (
        <div className="mt-8 space-y-6">
          {result ? (
            <>
              <ComparisonResultCard
                result={result}
                context={scopeLabel}
                exploreHref={exploreHref}
                exploreLabel={`${cityRecord?.name ?? "Türkiye"} fatura verilerine git`}
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
                Bu kapsam için yeterli paylaşım yok (en az 3 gerekli). Hane filtresini
                kaldır ya da daha geniş bir bölge dene.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
