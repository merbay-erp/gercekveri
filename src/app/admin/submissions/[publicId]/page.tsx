import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { formatNumber } from "@/lib/money";
import { ModerationActions } from "./moderation-actions";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  SALARY: "Maaş",
  RENT: "Kira",
  AIDAT: "Aidat",
  INTERNET: "İnternet",
  UTILITY: "Fatura",
  TEXTILE: "Tekstil",
};

type Params = Promise<{ publicId: string }>;

export default async function AdminSubmissionDetailPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { publicId } = await params;
  const sub = await db.submission.findUnique({
    where: { publicId },
    include: {
      city: { select: { name: true, slug: true } },
      district: { select: { name: true } },
    },
  });
  if (!sub) notFound();

  const moderationLogs = await db.moderationLog.findMany({
    where: { submissionId: sub.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/admin/submissions"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm paylaşımlar
      </Link>

      <div className="mt-4 mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {TYPE_LABELS[sub.type] ?? sub.type} paylaşımı
        </h1>
        <Badge variant="outline" className="font-mono text-xs">
          {sub.publicId}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Durum">
          <Badge
            variant={sub.status === "APPROVED" ? "secondary" : "default"}
            className="font-normal uppercase tracking-wide"
          >
            {sub.status}
          </Badge>
        </Field>
        <Field label="Oluşturma">
          {format(sub.createdAt, "yyyy-MM-dd HH:mm")}
        </Field>
        <Field label="Tutar">
          {sub.amount ? `${sub.currency} ${formatNumber(Number(sub.amount))}` : "—"}
        </Field>
        <Field label="Lokasyon">
          {sub.city?.name ?? "—"}
          {sub.district?.name ? ` · ${sub.district.name}` : ""}
        </Field>
        <Field label="Quality skor">
          <span className="tabular-nums">{sub.qualityScore ?? "—"}</span>
        </Field>
        <Field label="Trust skor">
          <span className="tabular-nums">{sub.trustScore ?? "—"}</span>
        </Field>
        <Field label="IP hash">
          <span className="font-mono text-xs">
            {sub.ipHash ?? "—"}
            {sub.ipHash?.startsWith("demo-") ? (
              <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                seed
              </span>
            ) : null}
          </span>
        </Field>
        <Field label="Fingerprint">
          <span className="font-mono text-xs">{sub.fingerprint ?? "—"}</span>
        </Field>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="mb-2 text-sm font-medium">Payload</h2>
        <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs">
          {JSON.stringify(sub.data, null, 2)}
        </pre>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium">Moderation aksiyonu</h2>
        <ModerationActions publicId={sub.publicId} currentStatus={sub.status} />
      </div>

      {moderationLogs.length > 0 ? (
        <Card className="mt-6 p-5">
          <h2 className="mb-3 text-sm font-medium">Geçmiş ({moderationLogs.length})</h2>
          <ul className="space-y-2 text-sm">
            {moderationLogs.map((log) => (
              <li
                key={log.id}
                className="flex flex-col gap-0.5 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {log.action}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {log.actor}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {log.reason ? <span>"{log.reason}"</span> : null}
                  <span>{format(log.createdAt, "yyyy-MM-dd HH:mm")}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm">{children}</p>
    </div>
  );
}
