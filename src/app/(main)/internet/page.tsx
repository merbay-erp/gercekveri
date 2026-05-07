import type { Metadata } from "next";
import { Wifi } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "İnternet Sağlayıcıları — Yakında",
  description:
    "Türk Telekom, Superonline, Vodafone, TurkNet ve diğer ISP'lerin gerçek hız, ping ve kesinti raporları.",
};

export default function InternetPage() {
  return (
    <ComingSoon
      icon={Wifi}
      title="İnternet sağlayıcıları yakında"
      description="Paket hızı yerine gerçekte ölçülen hız, ping ve kesinti sıklığı. Bölgenizdeki gerçek deneyimi anonim olarak öğrenin."
      bullets={[
        "ISP karşılaştırması (Türk Telekom, Superonline, Vodafone, TurkNet)",
        "Şehir/ilçe bazında gerçek hız",
        "Ping ve kesinti raporları",
        "Memnuniyet skoru",
      ]}
    />
  );
}
