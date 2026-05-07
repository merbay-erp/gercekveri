import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { formatNumber } from "@/lib/money";
import { BulkToolbar } from "./bulk-toolbar";

export const dynamic = "force-dynamic";

const VALID_TYPES = new Set(["SALARY", "RENT", "AIDAT", "INTERNET", "UTILITY", "TEXTILE"]);
const VALID_STATUSES = new Set(["PENDING", "APPROVED", "REJECTED", "FLAGGED"]);
const TYPE_LABELS: Record<string, string> = {
  SALARY: "Maaş",
  RENT: "Kira",
  AIDAT: "Aidat",
  INTERNET: "İnternet",
  UTILITY: "Fatura",
  TEXTILE: "Tekstil",
};

type SearchParams = Promise<{
  type?: string;
  status?: string;
  lowQuality?: string;
  page?: string;
}>;

const PAGE_SIZE = 25;

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const type = sp.type && VALID_TYPES.has(sp.type) ? sp.type : undefined;
  const status = sp.status && VALID_STATUSES.has(sp.status) ? sp.status : undefined;
  const lowQuality = sp.lowQuality === "1";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const where = {
    ...(type ? { type: type as "SALARY" } : {}),
    ...(status ? { status: status as "APPROVED" } : {}),
    ...(lowQuality ? { qualityScore: { lt: 30 } } : {}),
  };

  const [total, rows] = await Promise.all([
    db.submission.count({ where }),
    db.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        publicId: true,
        type: true,
        status: true,
        amount: true,
        currency: true,
        qualityScore: true,
        trustScore: true,
        ipHash: true,
        createdAt: true,
        city: { select: { name: true } },
        district: { select: { name: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filterChip = (label: string, params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    return (
      <Link
        href={`/admin/submissions${qs ? `?${qs}` : ""}`}
        className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Paylaşımlar</h1>
          <p className="text-sm text-muted-foreground">
            {formatNumber(total)} paylaşım · sayfa {page}/{totalPages}
          </p>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Tip:</span>
          {filterChip("Tümü", {})}
          {Array.from(VALID_TYPES).map((t) => filterChip(TYPE_LABELS[t] ?? t, { type: t }))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Durum:</span>
          {filterChip("Tümü", type ? { type } : {})}
          {Array.from(VALID_STATUSES).map((s) =>
            filterChip(s, type ? { type, status: s } : { status: s }),
          )}
          {filterChip(
            "Düşük kalite",
            type ? { type, lowQuality: "1" } : { lowQuality: "1" },
          )}
        </div>
      </Card>

      {(type || status || lowQuality) && total > 0 ? (
        <div className="mb-6">
          <BulkToolbar
            filter={{ type, status, lowQuality }}
            matchingCount={total}
            currentStatus={status}
          />
        </div>
      ) : null}

      {rows.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-muted-foreground">Bu filtreye uyan paylaşım yok.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <Th>Tip</Th>
                <Th>Durum</Th>
                <Th>Tutar</Th>
                <Th>Lokasyon</Th>
                <Th>Skor</Th>
                <Th>IP hash</Th>
                <Th>Oluşturma</Th>
                <Th align="right">Aksiyon</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20">
                  <Td>
                    <Badge variant="outline" className="font-normal">
                      {TYPE_LABELS[s.type] ?? s.type}
                    </Badge>
                  </Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td>
                    {s.amount
                      ? `${s.currency} ${formatNumber(Number(s.amount))}`
                      : "—"}
                  </Td>
                  <Td>
                    {s.city?.name ?? "—"}
                    {s.district?.name ? ` · ${s.district.name}` : ""}
                  </Td>
                  <Td>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      Q{s.qualityScore ?? "—"} / T{s.trustScore ?? "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {s.ipHash?.slice(0, 12) ?? "—"}
                      {s.ipHash?.startsWith("demo-") ? "…" : ""}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(s.createdAt, { addSuffix: true, locale: tr })}
                    </span>
                  </Td>
                  <Td align="right">
                    <Link
                      href={`/admin/submissions/${s.publicId}`}
                      className="text-xs font-medium hover:underline"
                    >
                      detay →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link
              href={buildPageUrl(sp, page - 1)}
              className="rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              ← Önceki
            </Link>
          ) : null}
          <span className="text-muted-foreground">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={buildPageUrl(sp, page + 1)}
              className="rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              Sonraki →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function buildPageUrl(
  sp: { type?: string; status?: string; lowQuality?: string },
  page: number,
): string {
  const qs = new URLSearchParams();
  if (sp.type) qs.set("type", sp.type);
  if (sp.status) qs.set("status", sp.status);
  if (sp.lowQuality) qs.set("lowQuality", sp.lowQuality);
  qs.set("page", String(page));
  return `/admin/submissions?${qs.toString()}`;
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      className={`px-4 py-2.5 text-xs font-medium text-muted-foreground ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <td className={`px-4 py-2.5 ${align === "right" ? "text-right" : ""}`}>{children}</td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "APPROVED"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : status === "PENDING"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : status === "FLAGGED"
          ? "bg-rose-500/10 text-rose-700 dark:text-rose-400"
          : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}
