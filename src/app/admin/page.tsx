import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Activity, AlertTriangle, ClipboardList, ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { formatNumber } from "@/lib/money";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  SALARY: "Maaş",
  RENT: "Kira",
  AIDAT: "Aidat",
  INTERNET: "İnternet",
  UTILITY: "Fatura",
  TEXTILE: "Tekstil",
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalCount,
    pendingCount,
    flaggedCount,
    last24h,
    byType,
    lowQuality,
    topIpHashes,
    recent,
  ] = await Promise.all([
    db.submission.count(),
    db.submission.count({ where: { status: "PENDING" } }),
    db.submission.count({ where: { status: "FLAGGED" } }),
    db.submission.count({ where: { createdAt: { gte: oneDayAgo } } }),
    db.submission.groupBy({
      by: ["type"],
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
    }),
    db.submission.count({
      where: { qualityScore: { lt: 30 }, status: "APPROVED" },
    }),
    db.submission.groupBy({
      by: ["ipHash"],
      where: {
        ipHash: { not: null },
        createdAt: { gte: sevenDaysAgo },
        // Skip seed/demo data — we know its prefix.
        NOT: { ipHash: { startsWith: "demo-" } },
      },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    db.submission.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        publicId: true,
        type: true,
        status: true,
        amount: true,
        currency: true,
        createdAt: true,
        qualityScore: true,
        city: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Hoş geldin {session.email.split("@")[0]} — son 7 gün özeti.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Toplam paylaşım"
          value={formatNumber(totalCount)}
          accent="text-foreground"
        />
        <StatCard
          icon={Activity}
          label="Son 24 saat"
          value={formatNumber(last24h)}
          accent="text-emerald-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending"
          value={formatNumber(pendingCount)}
          accent={pendingCount > 0 ? "text-amber-600" : "text-foreground"}
          href={pendingCount > 0 ? "/admin/submissions?status=PENDING" : undefined}
        />
        <StatCard
          icon={ShieldAlert}
          label="Flagged"
          value={formatNumber(flaggedCount)}
          accent={flaggedCount > 0 ? "text-rose-600" : "text-foreground"}
          href={flaggedCount > 0 ? "/admin/submissions?status=FLAGGED" : undefined}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-medium">Kategori dağılımı</h2>
          <div className="space-y-2">
            {byType.map((row) => (
              <div
                key={row.type}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span className="font-medium">{TYPE_LABELS[row.type] ?? row.type}</span>
                <Link
                  href={`/admin/submissions?type=${row.type}`}
                  className="text-muted-foreground tabular-nums hover:text-foreground"
                >
                  {formatNumber(row._count._all)} paylaşım
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium">
            En aktif IP hash'leri (son 7g)
            <Badge variant="secondary" className="font-normal">
              spam sinyali
            </Badge>
          </h2>
          {topIpHashes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Son 7 günde gerçek kullanıcı paylaşımı yok. Demo verileri sayılmaz.
            </p>
          ) : (
            <div className="space-y-1.5">
              {topIpHashes.map((row) => (
                <div
                  key={row.ipHash ?? "null"}
                  className="flex items-center justify-between rounded-md border px-3 py-2 font-mono text-xs"
                >
                  <span className="truncate">{row.ipHash}</span>
                  <span className="ml-2 shrink-0 text-muted-foreground tabular-nums">
                    {row._count._all}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {lowQuality > 0 ? (
        <Card className="mt-8 border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm">
            <span className="font-medium">{lowQuality}</span> düşük kalite skorlu (qualityScore &lt; 30)
            onaylanmış paylaşım var.{" "}
            <Link
              href="/admin/submissions?lowQuality=1"
              className="font-medium underline-offset-2 hover:underline"
            >
              İncele
            </Link>
          </p>
        </Card>
      ) : null}

      <Card className="mt-8 p-5">
        <h2 className="mb-3 text-sm font-medium">Son paylaşımlar</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz paylaşım yok.</p>
        ) : (
          <ul className="divide-y">
            {recent.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-1 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {TYPE_LABELS[s.type] ?? s.type}
                  </Badge>
                  <Badge
                    variant={s.status === "APPROVED" ? "secondary" : "default"}
                    className="font-normal text-[10px] uppercase"
                  >
                    {s.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {s.city?.name ?? "—"}
                    {s.amount ? ` · ${s.currency} ${formatNumber(Number(s.amount))}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {typeof s.qualityScore === "number" ? (
                    <span className="tabular-nums">Q{s.qualityScore}</span>
                  ) : null}
                  <span>{formatDistanceToNow(s.createdAt, { addSuffix: true, locale: tr })}</span>
                  <Link
                    href={`/admin/submissions/${s.publicId}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    detay →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  href,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  accent: string;
  href?: string;
}) {
  const inner = (
    <Card className="p-4 transition hover:border-foreground/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${accent}`}>{value}</p>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
