"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/cities";

interface PositionLink {
  slug: string;
  name: string;
  count: number;
}

interface Props {
  topPositions: PositionLink[];
}

export function MaasFilterBar({ topPositions }: Props) {
  const router = useRouter();

  const onCityChange = (slug: string | null) => {
    if (!slug) return;
    router.push(`/maaslar/sehir/${slug}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
      {topPositions.length > 0 ? (
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Popüler
          </span>
          {topPositions.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={`/maaslar/${p.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm shadow-xs ring-1 ring-border transition hover:ring-foreground/30"
            >
              {p.name}
              <span className="text-xs text-muted-foreground">{p.count}</span>
            </Link>
          ))}
          <Link
            href="/maaslar/yeni"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            Yeni ekle <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Henüz pozisyon kırılımı için yeterli veri yok. İlk paylaşan sen ol.
        </p>
      )}

      <div className="w-full sm:w-56 sm:shrink-0">
        <Select onValueChange={onCityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Şehre göre filtrele" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.slug} value={city.slug}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
