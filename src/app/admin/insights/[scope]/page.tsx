import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { InsightForm } from "./insight-form";

export const dynamic = "force-dynamic";

type Params = Promise<{ scope: string }>;

export default async function AdminInsightDetailPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { scope: encodedScope } = await params;
  const scope = decodeURIComponent(encodedScope);

  const insight = await db.aiSummary.findUnique({
    where: { scope_language: { scope, language: "tr" } },
  });
  if (!insight) notFound();

  const bullets = Array.isArray(insight.bullets) ? (insight.bullets as string[]) : [];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/admin/insights"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm insights
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Insight düzenle</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-mono">
            {scope}
          </Badge>
          <span>·</span>
          <span>{insight.modelName}</span>
          <span>·</span>
          <span>{insight.inputCount} veri</span>
          <span>·</span>
          <span>Güncelleme: {format(insight.updatedAt, "yyyy-MM-dd HH:mm")}</span>
          {insight.validUntil ? (
            <>
              <span>·</span>
              <span>
                Cache: {format(insight.validUntil, "yyyy-MM-dd HH:mm")}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <Card className="p-6">
        <InsightForm
          scope={scope}
          initialTitle={insight.title}
          initialBody={insight.body}
          initialBullets={bullets}
        />
      </Card>
    </div>
  );
}
