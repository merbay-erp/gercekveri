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
  utilityTypes,
  utilityLabels,
  utilityUnits,
  householdSizes,
  householdSizeLabels,
} from "@/modules/fatura/config";

const VALID_UTILITY = new Set(["ELEKTRIK", "DOGALGAZ", "SU"]);
const VALID_HH = new Set(["1", "2", "3", "4", "5+"]);

export function FaturaComparisonForm() {
  const router = useRouter();
  const params = useSearchParams();

  const initialUtility = params.get("utilityType") ?? "ELEKTRIK";
  const [utilityType, setUtilityType] = React.useState(
    VALID_UTILITY.has(initialUtility) ? initialUtility : "ELEKTRIK",
  );
  const [city, setCity] = React.useState(params.get("city") ?? "");
  const [householdSize, setHouseholdSize] = React.useState(
    VALID_HH.has(params.get("householdSize") ?? "") ? params.get("householdSize")! : "",
  );
  const [amount, setAmount] = React.useState(params.get("amount") ?? "");
  const [consumption, setConsumption] = React.useState(params.get("consumption") ?? "");

  const unit = utilityUnits[utilityType as keyof typeof utilityUnits] ?? "kWh";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const next = new URLSearchParams();
    next.set("utilityType", utilityType);
    if (city) next.set("city", city);
    if (householdSize) next.set("householdSize", householdSize);
    if (consumption) next.set("consumption", consumption);
    next.set("amount", amount);
    router.push(`/karsilastir/fatura?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Fatura türü</Label>
        <Select onValueChange={(v) => setUtilityType(v ?? "ELEKTRIK")} value={utilityType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seç">
              {(value: unknown) =>
                value
                  ? utilityLabels[value as keyof typeof utilityLabels] ?? null
                  : null
              }
            </SelectValue>
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
        <Label>Hane (opsiyonel)</Label>
        <Select
          onValueChange={(v) => setHouseholdSize(v ?? "")}
          value={householdSize || undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tüm haneler">
              {(value: unknown) =>
                value
                  ? householdSizeLabels[
                      value as keyof typeof householdSizeLabels
                    ] ?? null
                  : null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {householdSizes.map((s) => (
              <SelectItem key={s} value={s}>
                {householdSizeLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cmp-cons">Tüketim ({unit}, opsiyonel)</Label>
        <Input
          id="cmp-cons"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          placeholder={unit === "kWh" ? "Örn. 320" : "Örn. 18"}
          value={consumption}
          onChange={(e) => setConsumption(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cmp-bill">Fatura tutarı (TL)</Label>
        <Input
          id="cmp-bill"
          type="number"
          inputMode="numeric"
          min={50}
          placeholder="Örn. 1850"
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
