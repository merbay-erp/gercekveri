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
import { utilityTypes, utilityLabels, utilitySlugs } from "../config";

export function FaturaFilterBar() {
  const router = useRouter();

  const onCityChange = (slug: string | null) => {
    if (!slug) return;
    router.push(`/fatura/sehir/${slug}`);
  };

  const onUtilityChange = (utility: string | null) => {
    if (!utility) return;
    const slug = utilitySlugs[utility as keyof typeof utilitySlugs];
    if (!slug) return;
    router.push(`/fatura/${slug}`);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Fatura türüne ya da şehre göre kır.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="w-full sm:w-44">
          <Select onValueChange={onUtilityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Fatura türü" />
            </SelectTrigger>
            <SelectContent>
              {utilityTypes.map((u) => (
                <SelectItem key={u} value={u}>
                  {utilityLabels[u]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-56">
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
    </div>
  );
}
