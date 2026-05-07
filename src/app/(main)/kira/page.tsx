import type { Metadata } from "next";
import { Home } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Kira Fiyatları — Yakında",
  description:
    "Şehir ve ilçe bazında Türkiye'deki gerçek kira fiyatları. m², oda, bina yaşı bazında anonim kullanıcı verisi.",
};

export default function KiraPage() {
  return (
    <ComingSoon
      icon={Home}
      title="Kira fiyatları yakında"
      description="Emlakçı bekleyen fiyatları değil, kiracıların gerçekten ödediği tutarları göreceksin. Anonim, doğrulanmış, ücretsiz."
      bullets={[
        "Şehir ve ilçe kırılımı",
        "m², oda sayısı, bina yaşı filtresi",
        "Eşyalı / eşyasız ayrımı",
        "AI ile bölgesel ortalama özetleri",
      ]}
    />
  );
}
