import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ComparisonResultCard } from "@/components/comparison-result";
import { ShareButtons } from "@/components/share-buttons";
import { KiraComparisonForm } from "./comparison-form";
import { listRentSubmissions } from "@/modules/kira/server/queries";
import { findCityBySlug } from "@/lib/cities";
import { computeComparison, buildComparisonUrl } from "@/lib/comparison";
import { formatTRY } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

type SearchParams = Promise<{ city?: string; district?: string; amount?: string }>;

const baseMeta: Metadata = {
  title: "Kiranı bölgesel ortalamayla karşılaştır",
  description:
    "Kiran şehir ortalamasının üstünde mi altında mı? Anonim kiracı verisinden gerçek kıyas.",
  alternates: { canonical: "/karsilastir/kira" },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (!sp.amount) return baseMeta;
  const ogParams = new URLSearchParams({ kind: "kira", amount: sp.amount });
  if (sp.city) ogParams.set("city", sp.city);
  if (sp.district) ogParams.set("district", sp.district);
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

export default async function CompareKiraPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const amountNum = Number(sp.amount);
  const hasInput = sp.amount !== undefined && Number.isFinite(amountNum) && amountNum > 0;

  const citySlug = sp.city || undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;
  const districtName = sp.district?.trim() || undefined;

  let result = null;
  let scopeLabel = "Türkiye geneli";
  let exploreHref = "/kira";
  let shareUrl = "";
  let shareText = "";

  if (hasInput) {
    const submissions = await listRentSubmissions({ citySlug, limit: 1000 }).catch(() => []);

    // District filter happens in JS (free-text not normalized in DB query layer yet)
    const filtered = districtName
      ? submissions.filter((s) =>
          (s.data.districtName ?? "").toLowerCase().includes(districtName.toLowerCase()),
        )
      : submissions;

    const sorted = filtered.map((s) => s.amount).filter((n) => n > 0).sort((a, b) => a - b);

    if (cityRecord) scopeLabel = districtName ? `${cityRecord.name} · ${districtName}` : cityRecord.name;
    if (cityRecord) exploreHref = `/kira/sehir/${cityRecord.slug}`;

    result = computeComparison({
      value: amountNum,
      sortedPeers: sorted,
      subjectLabel: "Kiran",
      scopeLabel,
      higherIsBetter: false,
      formatValue: (n) => formatTRY(n),
    });

    shareUrl = buildComparisonUrl("https://gercekveri.com", "kira", {
      city: citySlug,
      district: districtName,
      amount: amountNum,
    });
    shareText = result
      ? `${result.headline} ${formatTRY(amountNum)} · ${siteConfig.name}`
      : `Kiramı karşılaştırdım — ${siteConfig.name}`;
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
          Kiranı karşılaştır
        </h1>
        <p className="text-muted-foreground">
          Anonim kiracı verisinden hesaplanmış bölge medyanı ile kıyasla. Hesap saklanmaz.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <KiraComparisonForm />
      </Card>

      {hasInput ? (
        <div className="mt-8 space-y-6">
          {result ? (
            <>
              <ComparisonResultCard
                result={result}
                context={scopeLabel}
                exploreHref={exploreHref}
                exploreLabel={`${scopeLabel} kira verilerine git`}
              />

              <Card className="space-y-3 p-5">
                <p className="text-sm font-medium">Sonucu paylaş</p>
                <ShareButtons url={shareUrl} text={shareText} />
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                Bu kapsam için yeterli paylaşım yok (en az 3 gerekli). Daha geniş bir
                kapsam dene — örneğin sadece şehir.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
