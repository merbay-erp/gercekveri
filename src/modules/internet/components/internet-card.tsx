import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, MapPin, Star, Wifi, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ispsBySlug, formatMbps, formatMs, outageFrequencyLabels } from "../config";
import type { InternetSubmissionView } from "../types";

interface Props {
  submission: InternetSubmissionView;
}

export function InternetCard({ submission }: Props) {
  const { data, createdAt, cityName, districtName } = submission;
  const ageLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: tr });
  const isp = ispsBySlug.get(data.isp);

  const efficiency =
    data.packageSpeedMbps > 0 ? data.realSpeedMbps / data.packageSpeedMbps : null;

  return (
    <Card className="relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight">{isp?.name ?? data.isp}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName ?? "—"}
              {districtName ? ` · ${districtName}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              {formatMbps(data.packageSpeedMbps)} paket
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {formatMs(data.pingMs)} ping
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ageLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-right">
            <p className="text-xl font-semibold tabular-nums">
              {formatMbps(data.realSpeedMbps)}
            </p>
            <p className="text-xs text-muted-foreground">gerçek hız</p>
          </div>
          {efficiency !== null ? (
            <Badge
              variant={efficiency >= 0.8 ? "secondary" : "outline"}
              className="font-normal"
            >
              %{Math.round(efficiency * 100)} verim
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-500" />
          {data.satisfaction} / 5 memnuniyet
        </span>
        <span>·</span>
        <span>{outageFrequencyLabels[data.outageFrequency]}</span>
      </div>
    </Card>
  );
}
