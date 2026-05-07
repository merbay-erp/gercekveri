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
import {
  subTypes,
  subTypeLabels,
  units,
  unitLabels,
  defaultUnitFor,
  type SubType,
} from "@/modules/tekstil/config";

const VALID_SUB = new Set(subTypes);
const VALID_UNIT = new Set(units);

export function TekstilComparisonForm() {
  const router = useRouter();
  const params = useSearchParams();

  const initialSub = params.get("subType") ?? "DIKIM";
  const [subType, setSubType] = React.useState<SubType>(
    VALID_SUB.has(initialSub as SubType) ? (initialSub as SubType) : "DIKIM",
  );
  const initialUnit = params.get("unit") ?? defaultUnitFor[subType];
  const [unit, setUnit] = React.useState(
    VALID_UNIT.has(initialUnit as (typeof units)[number])
      ? initialUnit
      : defaultUnitFor[subType],
  );
  const [city, setCity] = React.useState(params.get("city") ?? "");
  const [amount, setAmount] = React.useState(params.get("amount") ?? "");

  // Update unit default when sub-type changes (only if user hasn't manually
  // changed it from the URL value).
  const lastAuto = React.useRef(subType);
  React.useEffect(() => {
    if (subType !== lastAuto.current) {
      setUnit(defaultUnitFor[subType]);
      lastAuto.current = subType;
    }
  }, [subType]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const next = new URLSearchParams();
    next.set("subType", subType);
    next.set("unit", unit);
    if (city) next.set("city", city);
    next.set("amount", amount);
    router.push(`/karsilastir/tekstil?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>İş tipi</Label>
        <Select onValueChange={(v) => setSubType(v as SubType)} value={subType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seç">
              {(value: unknown) =>
                value
                  ? subTypeLabels[value as keyof typeof subTypeLabels] ?? null
                  : null
              }
            </SelectValue>
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

      <div className="space-y-1.5">
        <Label>Birim</Label>
        <Select onValueChange={(v) => setUnit(v ?? defaultUnitFor[subType])} value={unit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seç">
              {(value: unknown) =>
                value ? unitLabels[value as keyof typeof unitLabels] ?? null : null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u} value={u}>
                {unitLabels[u]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label>Şehir (opsiyonel)</Label>
        <Select onValueChange={(v) => setCity(v ?? "")} value={city || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Türkiye geneli">
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
        <Label htmlFor="cmp-tx">Birim fiyat (TL)</Label>
        <Input
          id="cmp-tx"
          type="number"
          inputMode="decimal"
          step="0.01"
          min={0.01}
          placeholder="Örn. 18.50"
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
