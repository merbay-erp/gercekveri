import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, MapPin, Ruler, Home as HomeIcon, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTRY } from "@/lib/money";
import {
  buildingAgeLabels,
  furnishedLabels,
  heatingLabels,
  roomCountLabels,
} from "../config";
import type { RentSubmissionView } from "../types";

interface Props {
  submission: RentSubmissionView;
}

export function KiraCard({ submission }: Props) {
  const { data, amount, createdAt, cityName, districtName } = submission;
  const ageLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: tr });

  return (
    <Card className="group relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight">
            {roomCountLabels[data.roomCount]} · {data.m2} m²
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName ?? "—"}
              {districtName ? ` · ${districtName}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <HomeIcon className="h-3 w-3" />
              {buildingAgeLabels[data.buildingAge]}
            </span>
            {data.heating ? (
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {heatingLabels[data.heating]}
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
            <p className="text-xs text-muted-foreground">aylık kira</p>
          </div>
          <Badge variant="secondary" className="font-normal">
            {furnishedLabels[data.furnished]}
          </Badge>
        </div>
      </div>

      {data.m2 > 0 ? (
        <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
          <Ruler className="h-3 w-3" />
          m² başına ~{formatTRY(Math.round(amount / data.m2))} / ay
        </p>
      ) : null}
    </Card>
  );
}
