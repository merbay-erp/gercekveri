import type { Metadata } from "next";
import { Mail, Code2, MessageSquare } from "lucide-react";

import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `İletişim — ${siteConfig.name}`,
  description: `${siteConfig.name} ile iletişime geç. Veri kaldırma, hata bildirimi, iş birliği.`,
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          İletişim
        </h1>
        <p className="text-muted-foreground">
          {siteConfig.name} bağımsız bir hobi projesidir; tek bir kişi tarafından
          işletilir. Aşağıdaki kanallardan ulaşabilirsin — yanıt süresi 1-3 gün.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium">E-posta</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Veri kaldırma talebi, hata bildirimi, iş birliği
              </p>
              <a
                href="mailto:iletisim@gercekveri.com"
                className="mt-2 inline-block text-sm font-medium hover:underline"
              >
                iletisim@gercekveri.com
              </a>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
              <Code2 className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium">GitHub</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Bug raporu, özellik önerisi
              </p>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium hover:underline"
              >
                @merbay-erp/gercekveri
              </a>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
            <MessageSquare className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium">Veri kaldırma talebi</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Yanlışlıkla yapılmış ya da kaldırılmasını istediğin bir paylaşım varsa,
              e-posta gövdesine paylaşımın <code className="rounded bg-muted px-1 py-0.5">publicId</code>{" "}
              değerini yaz (kart üzerinde URL'de bulabilirsin: <code className="rounded bg-muted px-1 py-0.5">/maaslar/abc123def</code>{" "}
              gibi). Yanıt vermeden önce sahiplik doğrulaması yapmıyoruz çünkü
              platform anonim — talebin haklı olduğuna inanırsak hızlıca kaldırırız.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
