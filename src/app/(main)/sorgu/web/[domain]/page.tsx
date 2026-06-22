import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrScanWebEntity, listRecentFraud } from "@/modules/web/server/queries";
import { RiskCard } from "@/components/risk/risk-card";
import { LookupHero } from "@/components/risk/lookup-hero";
import { RecentFraudFeed } from "@/components/risk/recent-fraud-feed";

export const dynamic = "force-dynamic";

type Params = Promise<{ domain: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { domain } = await params;
  const d = decodeURIComponent(domain);
  return {
    title: `${d} güvenli mi? Dolandırıcılık sorgusu`,
    description: `${d} gerçek mi, sahte mi? Domain yaşı, kara liste, halk ihbarı ve daha fazlasıyla anlık risk değerlendirmesi — GerçekVeri.`,
    alternates: { canonical: `/sorgu/web/${d}` },
    robots: { index: true, follow: true },
  };
}

export default async function WebLookupPage({ params }: { params: Params }) {
  const { domain } = await params;
  const entity = await getOrScanWebEntity(decodeURIComponent(domain));
  if (!entity) notFound();
  const recent = await listRecentFraud(6);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        Yeni sorgu
      </Link>

      <RiskCard entity={entity} />

      <div className="mt-10">
        <h2 className="mb-3 text-base font-medium">Başka bir adresi sorgula</h2>
        <LookupHero />
      </div>

      {recent.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-base font-medium">Son bildirilen dolandırıcılıklar</h2>
          <RecentFraudFeed items={recent} />
        </div>
      )}
    </div>
  );
}
