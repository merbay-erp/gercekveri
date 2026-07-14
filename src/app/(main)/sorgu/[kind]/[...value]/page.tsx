import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrScanEntity, listRecentFraud } from "@/modules/lookup/server/queries";
import { kindFromSlug } from "@/services/risk/registry";
import { RiskCard } from "@/components/risk/risk-card";
import { LookupHero } from "@/components/risk/lookup-hero";
import { RecentFraudFeed } from "@/components/risk/recent-fraud-feed";

export const dynamic = "force-dynamic";

type Params = Promise<{ kind: string; value: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { kind, value } = await params;
  const def = kindFromSlug(kind);
  const raw = (value ?? []).join("/");
  if (!def) return { title: "Sorgu — GerçekVeri" };
  const key = def.normalize(raw);
  const display = key ? def.display(key) : raw;
  return {
    title: def.metaTitle(display),
    description: def.metaDescription(display),
    alternates: { canonical: `/sorgu/${kind}/${key ?? raw}` },
    robots: { index: false, follow: true },
  };
}

export default async function LookupPage({ params }: { params: Params }) {
  const { kind, value } = await params;
  const def = kindFromSlug(kind);
  if (!def) notFound();

  const entity = await getOrScanEntity(kind, (value ?? []).join("/"));
  if (!entity) notFound();
  const recent = await listRecentFraud({ limit: 6 });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        Yeni sorgu
      </Link>

      <RiskCard entity={entity} />

      <section className="mt-6 rounded-xl border border-border bg-muted/25 p-5">
        <h2 className="text-base font-medium">Bu sonuç ne anlama gelmez?</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>• Düşük puan, ödeme veya kişisel bilgi paylaşımı için garanti değildir.</li>
          <li>• Yüksek puan, mahkeme kararı ya da kesin suç tespiti değildir.</li>
          <li>• Liste eşleşmesi olmaması, yeni bir tehdidin bulunmadığını kanıtlamaz.</li>
        </ul>
        <Link href="/rehber/risk-skoru-nasil-hesaplaniyor" className="mt-4 inline-flex text-sm font-medium hover:underline">
          Puanlama metodolojisini ve sınırları oku
        </Link>
      </section>

      <div className="mt-10">
        <h2 className="mb-3 text-base font-medium">Başka bir şey sorgula</h2>
        <LookupHero initialTab={kind} />
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
