import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ispsBySlug, formatMbps, formatMs } from "../config";
import type { IspRollup } from "../server/queries";

interface Props {
  rollups: IspRollup[];
  citySlug?: string;
}

/**
 * ISP comparison table — gives users a one-glance ranking of providers
 * by real speed, ping, and satisfaction. Links each row to the ISP page.
 */
export function InternetIspTable({ rollups, citySlug }: Props) {
  if (rollups.length === 0) return null;

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b px-5 py-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Sağlayıcılar — kıyas
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2.5 font-medium">Sağlayıcı</th>
              <th className="px-3 py-2.5 font-medium">Veri</th>
              <th className="px-3 py-2.5 font-medium">Medyan hız</th>
              <th className="px-3 py-2.5 font-medium">Verim</th>
              <th className="px-3 py-2.5 font-medium">Ping</th>
              <th className="px-3 py-2.5 font-medium">Memnuniyet</th>
              <th className="px-5 py-2.5 font-medium">Stabilite</th>
            </tr>
          </thead>
          <tbody>
            {rollups.map((r) => {
              const isp = ispsBySlug.get(r.isp);
              const ispHref = citySlug
                ? `/internet/${r.isp}?city=${citySlug}`
                : `/internet/${r.isp}`;
              return (
                <tr key={r.isp} className="border-b transition hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <Link
                      href={`/internet/${r.isp}`}
                      className="font-medium hover:underline"
                    >
                      {isp?.name ?? r.isp}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground tabular-nums">{r.count}</td>
                  <td className="px-3 py-3 tabular-nums">
                    {formatMbps(r.medianRealSpeed)}
                  </td>
                  <td className="px-3 py-3 tabular-nums">
                    {r.speedEfficiency !== null
                      ? `%${Math.round(r.speedEfficiency * 100)}`
                      : "–"}
                  </td>
                  <td className="px-3 py-3 tabular-nums">{formatMs(r.medianPing)}</td>
                  <td className="px-3 py-3 tabular-nums">
                    {r.avgSatisfaction !== null
                      ? `${r.avgSatisfaction.toFixed(1)} / 5`
                      : "–"}
                  </td>
                  <td className="px-5 py-3">
                    {r.stabilityScore !== null ? (
                      <Badge
                        variant={
                          r.stabilityScore >= 0.7
                            ? "secondary"
                            : r.stabilityScore >= 0.4
                              ? "outline"
                              : "destructive"
                        }
                        className="font-normal"
                      >
                        %{Math.round(r.stabilityScore * 100)}
                      </Badge>
                    ) : (
                      "–"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
