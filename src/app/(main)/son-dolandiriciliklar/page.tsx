import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { listRecentFraud } from "@/modules/lookup/server/queries";
import { RecentFraudFeed } from "@/components/risk/recent-fraud-feed";
import { LookupHero } from "@/components/risk/lookup-hero";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Son bildirilen dolandırıcılıklar — GerçekVeri",
  description: "Topluluğun son bildirdiği sahte siteler ve dolandırıcılık adresleri.",
  alternates: { canonical: "/son-dolandiriciliklar" },
  robots: { index: false, follow: true },
};

export default async function RecentPage() {
  const items = await listRecentFraud({ limit: 50 });
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
          <Flame className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-xl font-medium">Son bildirilen dolandırıcılıklar</h1>
          <p className="text-sm text-muted-foreground">Topluluğun bildirdiği en güncel riskli adresler.</p>
        </div>
      </div>

      <RecentFraudFeed items={items} />

      <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
        Bu kayıtlar kullanıcı bildirimleridir; resmi suç tespiti değildir. Bir adres hakkında karar
        vermeden önce teknik sinyalleri incele ve ödeme alıcısını bağımsız kanaldan doğrula.{" "}
        <Link href="/rehber" className="font-medium text-foreground hover:underline">
          Korunma rehberlerini oku.
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-base font-medium">Bir adresi sorgula</h2>
        <LookupHero />
      </div>
    </div>
  );
}
