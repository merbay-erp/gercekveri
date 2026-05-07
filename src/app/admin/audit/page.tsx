import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { formatNumber } from "@/lib/money";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ kind?: string; page?: string }>;

const PAGE_SIZE = 50;

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const kind = sp.kind === "audit" ? "audit" : "moderation";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  let total = 0;
  let rows: Array<{
    id: string;
    actor: string;
    action: string;
    entity: string | null;
    reason: string | null;
    metadata: unknown;
    createdAt: Date;
    submissionPublicId: string | null;
  }> = [];

  if (kind === "moderation") {
    const [count, raw] = await Promise.all([
      db.moderationLog.count(),
      db.moderationLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
    ]);
    total = count;
    const submissionIds = raw.map((r) => r.submissionId).filter(Boolean) as string[];
    const submissions = submissionIds.length
      ? await db.submission.findMany({
          where: { id: { in: submissionIds } },
          select: { id: true, publicId: true },
        })
      : [];
    const pubById = new Map(submissions.map((s) => [s.id, s.publicId]));
    rows = raw.map((r) => ({
      id: r.id,
      actor: r.actor,
      action: r.action,
      entity: r.submissionId ? "submission" : null,
      reason: r.reason,
      metadata: r.metadata,
      createdAt: r.createdAt,
      submissionPublicId: r.submissionId ? (pubById.get(r.submissionId) ?? null) : null,
    }));
  } else {
    const [count, raw] = await Promise.all([
      db.auditLog.count(),
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
    ]);
    total = count;
    rows = raw.map((r) => ({
      id: r.id,
      actor: r.actor,
      action: r.action,
      entity: r.entity ?? null,
      reason: null,
      metadata: r.metadata,
      createdAt: r.createdAt,
      submissionPublicId: null,
    }));
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
          <p className="text-sm text-muted-foreground">
            {formatNumber(total)} kayıt · sayfa {page}/{totalPages}
          </p>
        </div>

        <div className="flex gap-1 text-sm">
          <Link
            href="/admin/audit?kind=moderation"
            className={`rounded-md border px-3 py-1.5 transition ${
              kind === "moderation"
                ? "border-foreground bg-foreground text-background"
                : "hover:bg-muted"
            }`}
          >
            Moderation
          </Link>
          <Link
            href="/admin/audit?kind=audit"
            className={`rounded-md border px-3 py-1.5 transition ${
              kind === "audit"
                ? "border-foreground bg-foreground text-background"
                : "hover:bg-muted"
            }`}
          >
            Genel audit
          </Link>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-muted-foreground">Bu kategoride kayıt yok.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <Th>Tarih</Th>
                <Th>Actor</Th>
                <Th>Action</Th>
                <Th>Entity</Th>
                <Th>Sebep / detay</Th>
                <Th align="right">Bağlantı</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                  <Td>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {format(r.createdAt, "yyyy-MM-dd HH:mm:ss")}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-xs">{r.actor}</span>
                  </Td>
                  <Td>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {r.action}
                    </Badge>
                  </Td>
                  <Td>
                    <span className="text-xs text-muted-foreground">
                      {r.entity ?? "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="block max-w-[300px] truncate text-xs text-muted-foreground">
                      {r.reason ??
                        (r.metadata
                          ? JSON.stringify(r.metadata).slice(0, 80)
                          : "—")}
                    </span>
                  </Td>
                  <Td align="right">
                    {r.submissionPublicId ? (
                      <Link
                        href={`/admin/submissions/${r.submissionPublicId}`}
                        className="text-xs font-medium hover:underline"
                      >
                        görüntüle →
                      </Link>
                    ) : null}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      )}

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/audit?kind=${kind}&page=${page - 1}`}
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
              href={`/admin/audit?kind=${kind}&page=${page + 1}`}
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
