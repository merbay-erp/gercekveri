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
import { commonPositions } from "@/modules/maas/positions";

export function MaasComparisonForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [city, setCity] = React.useState(params.get("city") ?? "");
  const [position, setPosition] = React.useState(params.get("position") ?? "");
  const [amount, setAmount] = React.useState(params.get("amount") ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const next = new URLSearchParams();
    if (city) next.set("city", city);
    if (position) next.set("position", position.trim());
    next.set("amount", amount);
    router.push(`/karsilastir/maas?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="cmp-position">Pozisyon (opsiyonel)</Label>
        <Input
          id="cmp-position"
          list="cmp-positions"
          placeholder="Örn. Frontend Developer"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <datalist id="cmp-positions">
          {commonPositions.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </div>

      <div className="space-y-1.5">
        <Label>Şehir (opsiyonel)</Label>
        <Select onValueChange={(v) => setCity(v ?? "")} value={city || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tüm Türkiye">
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

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="cmp-amount">Net maaşın (TL / ay)</Label>
        <Input
          id="cmp-amount"
          type="number"
          inputMode="numeric"
          min={1000}
          placeholder="Örn. 85000"
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
