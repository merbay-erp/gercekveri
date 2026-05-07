import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, MapPin, Layers, Palette, User2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTRY } from "@/lib/money";
import {
  subTypeLabels,
  unitLabels,
  fabricTypeLabels,
  customerTypeLabels,
} from "../config";
import type { TekstilSubmissionView } from "../types";

interface Props {
  submission: TekstilSubmissionView;
}

export function TekstilCard({ submission }: Props) {
  const { data, amount, createdAt, cityName, districtName } = submission;
  const ageLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: tr });

  return (
    <Card className="relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight">
            {subTypeLabels[data.subType]}
            {data.fabricType ? ` · ${fabricTypeLabels[data.fabricType]}` : ""}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName ?? "—"}
              {districtName ? ` · ${districtName}` : ""}
            </span>
            {data.colorCount ? (
              <span className="flex items-center gap-1">
                <Palette className="h-3 w-3" />
                {data.colorCount} renk
              </span>
            ) : null}
            {data.customerType ? (
              <span className="flex items-center gap-1">
                <User2 className="h-3 w-3" />
                {customerTypeLabels[data.customerType]}
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ageLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <div className="text-right">
            <p className="text-xl font-semibold tabular-nums">{formatTRY(amount)}</p>
            <p className="text-xs text-muted-foreground">
              / {unitLabels[data.unit]}
            </p>
          </div>
          {data.minOrderQuantity ? (
            <Badge variant="secondary" className="font-normal">
              <Layers className="mr-1 h-3 w-3" />
              MOQ {data.minOrderQuantity.toLocaleString("tr-TR")}
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
