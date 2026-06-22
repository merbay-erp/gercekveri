import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { ReportForm } from "@/components/risk/report-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dolandırıcılık ihbarı — GerçekVeri",
  description: "Bir sahte site, IBAN veya numara mı gördün? Anonim bildir, başkalarını koru.",
  alternates: { canonical: "/ihbar" },
};

type SearchParams = Promise<{ kind?: string; value?: string }>;

export default async function IhbarPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const kind = typeof sp.kind === "string" ? sp.kind : "web";
  const value = typeof sp.value === "string" ? sp.value : "";

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
          <ShieldAlert className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-xl font-medium">Dolandırıcılık ihbarı</h1>
          <p className="text-sm text-muted-foreground">Bildirimin başkalarını ödeme yapmadan uyarır.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <ReportForm defaultKind={kind} defaultValue={value} />
      </div>
    </div>
  );
}
