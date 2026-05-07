import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ComparisonResultCard } from "@/components/comparison-result";
import { ShareButtons } from "@/components/share-buttons";
import { MaasComparisonForm } from "./comparison-form";
import { listSalarySubmissions } from "@/modules/maas/server/queries";
import { positionSlugFor, positionNameFromSlug } from "@/modules/maas/position-resolver";
import { findCityBySlug } from "@/lib/cities";
import { computeComparison, buildComparisonUrl } from "@/lib/comparison";
import { formatTRY } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

const baseMeta: Metadata = {
  title: "Maaşını Türkiye ortalamasıyla karşılaştır",
  description:
    "Maaşın Türkiye ortalamasının üstünde mi altında mı? Şehir + pozisyon kırılımıyla anonim veriden gerçek karşılaştırma.",
  alternates: { canonical: "/karsilastir/maas" },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (!sp.amount) return baseMeta;
  const ogParams = new URLSearchParams({ kind: "maas", amount: sp.amount });
  if (sp.city) ogParams.set("city", sp.city);
  if (sp.position) ogParams.set("position", sp.position);
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

type SearchParams = Promise<{ city?: string; position?: string; amount?: string }>;

export default async function CompareMaasPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const amountNum = Number(sp.amount);
  const hasInput = sp.amount !== undefined && Number.isFinite(amountNum) && amountNum > 0;

  const positionSlug = sp.position ? positionSlugFor(sp.position) : undefined;
  const citySlug = sp.city || undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;
  const positionDisplay = sp.position
    ? sp.position.trim()
    : positionSlug
      ? positionNameFromSlug(positionSlug)
      : undefined;

  let result = null;
  let scopeLabel = "Türkiye geneli";
  let context: string | undefined;
  let exploreHref = "/maaslar";
  let shareUrl = "";
  let shareText = "";

  if (hasInput) {
    const submissions = await listSalarySubmissions({
      citySlug,
      positionSlug,
      limit: 1000,
    }).catch(() => []);
    const sorted = submissions.map((s) => s.amount).filter((n) => n > 0).sort((a, b) => a - b);

    const labelParts: string[] = [];
    if (positionDisplay) labelParts.push(positionDisplay);
    if (cityRecord) labelParts.push(cityRecord.name);
    scopeLabel = labelParts.length ? labelParts.join(" · ") : "Türkiye geneli";

    context = scopeLabel;
    if (positionSlug && citySlug) {
      exploreHref = `/maaslar/${positionSlug}/${citySlug}`;
    } else if (positionSlug) {
      exploreHref = `/maaslar/${positionSlug}`;
    } else if (citySlug) {
      exploreHref = `/maaslar/sehir/${citySlug}`;
    }

    result = computeComparison({
      value: amountNum,
      sortedPeers: sorted,
      subjectLabel: "Maaşın",
      scopeLabel,
      higherIsBetter: true,
      formatValue: (n) => formatTRY(n),
    });

    shareUrl = buildComparisonUrl(siteConfig.links.github ? "https://gercekveri.com" : "https://gercekveri.com", "maas", {
      city: citySlug,
      position: positionDisplay,
      amount: amountNum,
    });
    shareText = result
      ? `${result.headline} ${formatTRY(amountNum)} · ${siteConfig.name}`
      : `Maaşımı karşılaştırdım — ${siteConfig.name}`;
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
          Maaşını karşılaştır
        </h1>
        <p className="text-muted-foreground">
          Pozisyon ve şehir bazında anonim verilerden hesaplanmış medyan ile kıyasla. Bu
          hesaplama saklanmaz; sadece bu sayfa içindir.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <MaasComparisonForm />
      </Card>

      {hasInput ? (
        <div className="mt-8 space-y-6">
          {result ? (
            <>
              <ComparisonResultCard
                result={result}
                context={context}
                exploreHref={exploreHref}
                exploreLabel={`${scopeLabel} verilerine git`}
              />

              <Card className="space-y-3 p-5">
                <p className="text-sm font-medium">Sonuç sosyal medyada paylaşılabilir</p>
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
                Bu kapsam için yeterli paylaşım yok (en az 3 gerekli). Daha geniş bir
                kapsam dene — örneğin sadece pozisyon ya da sadece şehir.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
