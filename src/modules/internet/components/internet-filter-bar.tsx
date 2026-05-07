"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/cities";
import { isps } from "../config";

export function InternetFilterBar() {
  const router = useRouter();

  const onCityChange = (slug: string | null) => {
    if (!slug) return;
    router.push(`/internet/sehir/${slug}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sağlayıcılar
        </span>
        {isps.slice(0, 4).map((isp) => (
          <Link
            key={isp.slug}
            href={`/internet/${isp.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm shadow-xs ring-1 ring-border transition hover:ring-foreground/30"
          >
            {isp.name}
          </Link>
        ))}
      </div>

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
