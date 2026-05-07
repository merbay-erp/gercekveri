import type { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailySubmissionsChart } from "@/components/data-display/daily-submissions-chart";
import {
  getPublicStatsOverview,
  getDailySubmissionSeries,
} from "@/lib/public-stats";
import { formatNumber } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Türkiye Anonim Veri İstatistikleri — ${siteConfig.name}`,
  description:
    "GerçekVeri'de toplanan anonim paylaşımların gerçek zamanlı istatistikleri. Toplam veri, kategori dağılımı, en aktif şehirler ve büyüme hızı.",
  alternates: { canonical: "/istatistikler" },
};

const TYPE_META: Record<string, { label: string; href: string }> = {
  SALARY: { label: "Maaş", href: "/maaslar" },
  RENT: { label: "Kira", href: "/kira" },
  AIDAT: { label: "Aidat", href: "/aidat" },
  INTERNET: { label: "İnternet", href: "/internet" },
  UTILITY: { label: "Fatura", href: "/fatura" },
  TEXTILE: { label: "Tekstil", href: "/tekstil" },
};

export default async function StatsPage() {
  const [stats, daily] = await Promise.all([
    getPublicStatsOverview(),
    getDailySubmissionSeries(30),
  ]);

  const totalShown =
    stats.totalApproved > 0 ? formatNumber(stats.totalApproved) : "—";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 max-w-3xl space-y-3">
        <Badge variant="secondary" className="font-normal">
          Canlı sayaçlar
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Türkiye'nin gerçek verisi rakamlarda
        </h1>
        <p className="text-muted-foreground">
          {siteConfig.name} platformunda anonim paylaşılan{" "}
          <span className="font-medium text-foreground">{totalShown}</span> gerçek veri
          noktası. Demo verisi sayılmaz; sadece anonim kullanıcı katkıları.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam paylaşım" value={formatNumber(stats.totalApproved)} />
        <StatCard
          label="Son 24 saat"
          value={formatNumber(stats.totalLast24h)}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard label="Son 7 gün" value={formatNumber(stats.totalLast7d)} />
        <StatCard
          label="30 gün büyüme"
          value={
            stats.growthRatePct === null
              ? "—"
              : stats.growthRatePct > 0
                ? `+%${stats.growthRatePct}`
                : `%${stats.growthRatePct}`
          }
          icon={
            stats.growthRatePct === null
              ? Minus
              : stats.growthRatePct > 0
                ? TrendingUp
                : stats.growthRatePct < 0
                  ? TrendingDown
                  : Activity
          }
          accent={
            stats.growthRatePct && stats.growthRatePct > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : stats.growthRatePct && stats.growthRatePct < 0
                ? "text-rose-600 dark:text-rose-400"
                : undefined
          }
        />
      </div>

      <Card className="mt-8 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-base font-medium">Son 30 günde günlük paylaşım</h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatNumber(stats.totalLast30d)} toplam
          </span>
        </div>
        {stats.totalLast30d > 0 ? (
          <DailySubmissionsChart data={daily} />
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Henüz veri yok. İlk gerçek paylaşımı sen yap.
          </p>
        )}
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-base font-medium">Kategori dağılımı</h2>
          {stats.byType.length === 0 ? (
            <p className="text-sm text-muted-foreground">Veri yok.</p>
          ) : (
            <ul className="space-y-1.5">
              {stats.byType.map((row) => {
                const meta = TYPE_META[row.type];
                if (!meta) return null;
                const pct =
                  stats.totalApproved > 0
                    ? Math.round((row.count / stats.totalApproved) * 100)
                    : 0;
                return (
                  <li key={row.type}>
                    <Link
                      href={meta.href}
                      className="block rounded-md border px-3 py-2 transition hover:border-foreground/30 hover:bg-muted/30"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{meta.label}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {formatNumber(row.count)} ({pct}%)
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-foreground/70"
                          style={{ width: `${Math.max(2, pct)}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-base font-medium">En aktif şehirler</h2>
          {stats.topCities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz şehir verisi yok.</p>
          ) : (
            <ul className="space-y-1">
              {stats.topCities.map((c, idx) => (
                <li
                  key={c.slug}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-5 w-5 place-items-center rounded bg-muted text-[10px] font-medium tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <span className="text-muted-foreground tabular-nums">
                    {formatNumber(c.count)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {stats.topPositions.length > 0 ? (
        <Card className="mt-8 p-5">
          <h2 className="mb-3 text-base font-medium">En çok paylaşılan pozisyonlar</h2>
          <ul className="grid gap-1 sm:grid-cols-2">
            {stats.topPositions.map((p, idx) => (
              <li
                key={p.slug}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded bg-muted text-[10px] font-medium tabular-nums">
                    {idx + 1}
                  </span>
                  <Link
                    href={`/maaslar/${p.slug}`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                </div>
                <span className="text-muted-foreground tabular-nums">
                  {formatNumber(p.count)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {stats.lastSubmissionAt ? (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Son paylaşım{" "}
          {formatDistanceToNow(stats.lastSubmissionAt, {
            addSuffix: true,
            locale: tr,
          })}
          .
        </p>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon?: typeof Activity;
  accent?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p
            className={`mt-1 text-2xl font-semibold tabular-nums ${
              accent ?? "text-foreground"
            }`}
          >
            {value}
          </p>
        </div>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </div>
    </Card>
  );
}
