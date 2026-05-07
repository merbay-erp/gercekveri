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
import { subTypes, subTypeLabels, subTypeSlugs } from "../config";

export function TekstilFilterBar() {
  const router = useRouter();

  const onCityChange = (slug: string | null) => {
    if (!slug) return;
    router.push(`/tekstil/sehir/${slug}`);
  };

  const onSubTypeChange = (sub: string | null) => {
    if (!sub) return;
    const slug = subTypeSlugs[sub as keyof typeof subTypeSlugs];
    if (!slug) return;
    router.push(`/tekstil/${slug}`);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">İş tipine ya da şehre göre kır.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="w-full sm:w-48">
          <Select onValueChange={onSubTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="İş tipi" />
            </SelectTrigger>
            <SelectContent>
              {subTypes.map((s) => (
                <SelectItem key={s} value={s}>
                  {subTypeLabels[s]}
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
