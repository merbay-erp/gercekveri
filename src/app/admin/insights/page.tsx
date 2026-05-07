import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { formatNumber } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const insights = await db.aiSummary.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      scope: true,
      title: true,
      body: true,
      inputCount: true,
      modelName: true,
      validUntil: true,
      updatedAt: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">AI insights</h1>
        <p className="text-sm text-muted-foreground">
          {insights.length} cache'lenmiş özet · son üretim/güncelleme tarihine göre sıralı
        </p>
      </div>

      {insights.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Henüz AI insight üretilmemiş. Sayfa hit'leriyle oluşmaya başlar.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <Th>Scope</Th>
                <Th>Başlık</Th>
                <Th>Veri</Th>
                <Th>Model</Th>
                <Th>Cache</Th>
                <Th>Güncelleme</Th>
                <Th align="right">Aksiyon</Th>
              </tr>
            </thead>
            <tbody>
              {insights.map((i) => {
                const isNegative = !i.body || i.body.length === 0;
                const expired = !i.validUntil || i.validUntil.getTime() < Date.now();
                return (
                  <tr key={i.scope} className="border-b last:border-0 hover:bg-muted/20">
                    <Td>
                      <span className="font-mono text-[11px]">{i.scope}</span>
                    </Td>
                    <Td>
                      <span className="block max-w-[260px] truncate">
                        {isNegative ? (
                          <span className="text-rose-600">— (negatif cache)</span>
                        ) : (
                          (i.title ?? "—")
                        )}
                      </span>
                    </Td>
                    <Td>
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {formatNumber(i.inputCount)}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {i.modelName.replace("gemini-", "")}
                      </span>
                    </Td>
                    <Td>
                      <Badge
                        variant="outline"
                        className={`font-normal text-[10px] uppercase ${
                          expired
                            ? "text-amber-600"
                            : isNegative
                              ? "text-rose-600"
                              : "text-emerald-600"
                        }`}
                      >
                        {expired ? "süresi geçti" : isNegative ? "negatif" : "geçerli"}
                      </Badge>
                    </Td>
                    <Td>
                      <span className="text-xs text-muted-foreground">
                        {format(i.updatedAt, "yyyy-MM-dd HH:mm")}
                      </span>
                    </Td>
                    <Td align="right">
                      <Link
                        href={`/admin/insights/${encodeURIComponent(i.scope)}`}
                        className="text-xs font-medium hover:underline"
                      >
                        düzenle →
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </Card>
      )}
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
