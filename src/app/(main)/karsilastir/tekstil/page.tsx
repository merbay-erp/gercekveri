import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ComparisonResultCard } from "@/components/comparison-result";
import { ShareButtons } from "@/components/share-buttons";
import { TekstilComparisonForm } from "./comparison-form";
import { listTekstilSubmissions } from "@/modules/tekstil/server/queries";
import {
  subTypes,
  units,
  subTypeLabels,
  unitLabels,
  type SubType,
  type Unit,
} from "@/modules/tekstil/config";
import { findCityBySlug } from "@/lib/cities";
import { computeComparison, buildComparisonUrl } from "@/lib/comparison";
import { formatTRY } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

type SearchParams = Promise<{
  subType?: string;
  unit?: string;
  city?: string;
  amount?: string;
}>;

const VALID_SUB = new Set<string>(subTypes);
const VALID_UNIT = new Set<string>(units);

const baseMeta: Metadata = {
  title: "Tekstil fiyatını piyasayla karşılaştır",
  description:
    "Kesim, dikim, boyahane, baskı vb. işlerde fiyatın piyasanın altında mı üstünde mi? Anonim üretici verisinden gerçek kıyas.",
  alternates: { canonical: "/karsilastir/tekstil" },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (!sp.amount) return baseMeta;
  const ogParams = new URLSearchParams({ kind: "tekstil", amount: sp.amount });
  if (sp.subType && VALID_SUB.has(sp.subType)) ogParams.set("subType", sp.subType);
  if (sp.unit && VALID_UNIT.has(sp.unit)) ogParams.set("unit", sp.unit);
  if (sp.city) ogParams.set("city", sp.city);
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

export default async function CompareTekstilPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const amountNum = Number(sp.amount);
  const hasInput = sp.amount !== undefined && Number.isFinite(amountNum) && amountNum > 0;

  const subType: SubType = VALID_SUB.has(sp.subType ?? "")
    ? (sp.subType as SubType)
    : "DIKIM";
  const unit: Unit = VALID_UNIT.has(sp.unit ?? "")
    ? (sp.unit as Unit)
    : "PIECE";
  const citySlug = sp.city || undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;

  let result = null;
  let scopeLabel = `${subTypeLabels[subType]} · ${unitLabels[unit]}`;
  let exploreHref = "/tekstil";
  let shareUrl = "";
  let shareText = "";

  if (hasInput) {
    const submissions = await listTekstilSubmissions({
      citySlug,
      subType,
      unit,
      limit: 1000,
    }).catch(() => []);

    const sorted = submissions
      .map((s) => s.amount)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);

    const labelParts: string[] = [subTypeLabels[subType]];
    if (cityRecord) labelParts.push(cityRecord.name);
    labelParts.push(`TL/${unitLabels[unit]}`);
    scopeLabel = labelParts.join(" · ");
    if (cityRecord) exploreHref = `/tekstil/sehir/${cityRecord.slug}`;

    result = computeComparison({
      value: amountNum,
      sortedPeers: sorted,
      // For B2B prices the framing is: "are you charging more or less than peers?"
      // Higher unit price = better for the producer. Treat as higherIsBetter:true.
      subjectLabel: "Fiyatın",
      scopeLabel,
      higherIsBetter: true,
      formatValue: (n) => formatTRY(n),
    });

    shareUrl = buildComparisonUrl("https://gercekveri.com", "tekstil", {
      subType,
      unit,
      city: citySlug,
      amount: amountNum,
    });
    shareText = result
      ? `${result.headline} ${formatTRY(amountNum)} · ${siteConfig.name}`
      : `Tekstil fiyatımı karşılaştırdım — ${siteConfig.name}`;
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
          Tekstil fiyatını karşılaştır
        </h1>
        <p className="text-muted-foreground">
          Anonim üretici verisinden hesaplanmış medyan ile kıyasla. İş tipi + birim
          eşleşmesi şart — kesim/parça ile boyahane/kg birbiriyle kıyaslanmaz.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <TekstilComparisonForm />
      </Card>

      {hasInput ? (
        <div className="mt-8 space-y-6">
          {result ? (
            <>
              <ComparisonResultCard
                result={result}
                context={scopeLabel}
                exploreHref={exploreHref}
                exploreLabel={`${cityRecord?.name ?? "Türkiye"} tekstil verilerine git`}
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
                Bu kapsam için yeterli paylaşım yok (en az 3 gerekli). Şehir filtresini
                kaldır ya da farklı iş tipi/birim dene.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
