import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Briefcase, MapPin, Clock, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTRY } from "@/lib/money";
import { workModeLabels, companySizeLabels } from "../config";
import type { SalarySubmissionView } from "../types";

interface Props {
  submission: SalarySubmissionView;
}

export function MaasCard({ submission }: Props) {
  const { data, amount, createdAt, cityName, districtName } = submission;
  const ageLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: tr });

  return (
    <Card className="group relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight">{data.position}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName ?? "—"}
              {districtName ? ` · ${districtName}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {data.experienceYears} yıl
            </span>
            {data.companySize ? (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {companySizeLabels[data.companySize as keyof typeof companySizeLabels]}
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
            <p className="text-xs text-muted-foreground">net / ay</p>
          </div>
          <Badge variant="secondary" className="font-normal">
            {workModeLabels[data.workMode]}
          </Badge>
        </div>
      </div>

      {data.sector ? (
        <p className="mt-3 text-xs text-muted-foreground">Sektör: {data.sector}</p>
      ) : null}
    </Card>
  );
}
