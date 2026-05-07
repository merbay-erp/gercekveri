import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users, Zap, Flame, Droplet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTRY } from "@/lib/money";
import {
  utilityLabels,
  utilityUnits,
  householdSizeLabels,
  type UtilityType,
} from "../config";
import type { FaturaSubmissionView } from "../types";

interface Props {
  submission: FaturaSubmissionView;
}

const utilityIcon: Record<UtilityType, typeof Zap> = {
  ELEKTRIK: Zap,
  DOGALGAZ: Flame,
  SU: Droplet,
};

const utilityToneClass: Record<UtilityType, string> = {
  ELEKTRIK: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DOGALGAZ: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  SU: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
};

function formatBillingMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split("-");
  if (!y || !m) return yearMonth;
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  const idx = Number(m) - 1;
  if (idx < 0 || idx > 11) return yearMonth;
  return `${months[idx]} ${y}`;
}

export function FaturaCard({ submission }: Props) {
  const { data, amount, createdAt, cityName, districtName } = submission;
  const ageLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: tr });
  const Icon = utilityIcon[data.utilityType];
  const unit = utilityUnits[data.utilityType];
  const unitCost = data.consumption > 0 ? amount / data.consumption : null;

  return (
    <Card className="relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 place-items-center rounded-md ${utilityToneClass[data.utilityType]}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="font-medium leading-tight">
              {utilityLabels[data.utilityType]}
              {data.consumption > 0
                ? ` · ${formatNumber(data.consumption)} ${unit}`
                : ""}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName ?? "—"}
              {districtName ? ` · ${districtName}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {householdSizeLabels[data.householdSize]}
            </span>
            {data.billingMonth ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatBillingMonth(data.billingMonth)}
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ageLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-right">
            <p className="text-xl font-semibold tabular-nums">{formatTRY(amount)}</p>
            <p className="text-xs text-muted-foreground">aylık fatura</p>
          </div>
          {unitCost !== null ? (
            <Badge variant="secondary" className="font-normal tabular-nums">
              ~{formatTRY(Math.round(unitCost * 100) / 100)} / {unit}
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 1,
  }).format(n);
}
