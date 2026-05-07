"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cities } from "@/lib/cities";
import { siteTypeLabels } from "@/modules/aidat/config";

const SITE_TYPES = ["BLOCK", "VILLA", "INDEPENDENT", "RESIDENCE"] as const;

export function AidatComparisonForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [city, setCity] = React.useState(params.get("city") ?? "");
  const [district, setDistrict] = React.useState(params.get("district") ?? "");
  const [siteType, setSiteType] = React.useState(params.get("siteType") ?? "");
  const [amount, setAmount] = React.useState(params.get("amount") ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const next = new URLSearchParams();
    if (city) next.set("city", city);
    if (district) next.set("district", district.trim());
    if (siteType) next.set("siteType", siteType);
    next.set("amount", amount);
    router.push(`/karsilastir/aidat?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Şehir</Label>
        <Select onValueChange={(v) => setCity(v ?? "")} value={city || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Şehir seç">
              {(value: unknown) =>
                value ? cities.find((c) => c.slug === value)?.name ?? null : null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cmp-district">İlçe (opsiyonel)</Label>
        <Input
          id="cmp-district"
          placeholder="Örn. Kadıköy"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label>Yapı tipi (opsiyonel — eşleşme keskinleşir)</Label>
        <Select onValueChange={(v) => setSiteType(v ?? "")} value={siteType || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tüm yapı tipleri">
              {(value: unknown) =>
                value
                  ? siteTypeLabels[value as keyof typeof siteTypeLabels] ?? null
                  : null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SITE_TYPES.map((s) => (
              <SelectItem key={s} value={s}>
                {siteTypeLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="cmp-aidat">Aylık aidat (TL)</Label>
        <Input
          id="cmp-aidat"
          type="number"
          inputMode="numeric"
          min={100}
          placeholder="Örn. 3500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" className="w-full sm:w-auto">
          Karşılaştır
        </Button>
      </div>
    </form>
  );
}
