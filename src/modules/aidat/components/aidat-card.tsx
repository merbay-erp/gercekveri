import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Building2, Clock, MapPin, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTRY } from "@/lib/money";
import {
  amenityLabels,
  buildingAgeLabels,
  siteTypeLabels,
} from "../config";
import type { AidatSubmissionView } from "../types";

interface Props {
  submission: AidatSubmissionView;
}

export function AidatCard({ submission }: Props) {
  const { data, amount, createdAt, cityName, districtName } = submission;
  const ageLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: tr });

  return (
    <Card className="relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight">
            {siteTypeLabels[data.siteType]}
            {data.m2 > 0 ? ` · ${data.m2} m² daire` : ""}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName ?? "—"}
              {districtName ? ` · ${districtName}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {buildingAgeLabels[data.buildingAge]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ageLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-right">
            <p className="text-xl font-semibold tabular-nums">{formatTRY(amount)}</p>
            <p className="text-xs text-muted-foreground">aylık aidat</p>
          </div>
          {data.m2 > 0 ? (
            <Badge variant="secondary" className="font-normal">
              <Ruler className="mr-1 h-3 w-3" />
              ~{formatTRY(Math.round(amount / data.m2))} / m²
            </Badge>
          ) : null}
        </div>
      </div>

      {data.amenities.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {data.amenities.map((a) => (
            <Badge key={a} variant="outline" className="font-normal">
              {amenityLabels[a]}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
