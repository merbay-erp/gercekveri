"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/cities";

export function AidatFilterBar() {
  const router = useRouter();

  const onCityChange = (slug: string | null) => {
    if (!slug) return;
    router.push(`/aidat/sehir/${slug}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Şehir seçerek bölgesel aidat ortalamalarını gör.
      </p>
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
