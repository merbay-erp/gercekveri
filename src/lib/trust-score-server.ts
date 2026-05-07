/**
 * Server-side helper that fetches the inputs needed to compute a
 * TrustScore for a given scope (any Prisma `Submission` where clause).
 */
import { db } from "@/lib/db";
import {
  computeTrustScore,
  type TrustScore,
  type TrustScoreInput,
} from "./trust-score";

interface ScopeWhere {
  type?:
    | "SALARY"
    | "RENT"
    | "AIDAT"
    | "INTERNET"
    | "UTILITY"
    | "TEXTILE";
  cityId?: number;
  // For data-payload-aware scopes (utility, tekstil), callers can layer
  // their own where via the optional `extra` blob; we merge it.
  extraWhere?: Record<string, unknown>;
}

export async function fetchTrustScoreInputs(
  scope: ScopeWhere,
): Promise<TrustScoreInput> {
  const baseWhere = {
    status: "APPROVED" as const,
    ...(scope.type ? { type: scope.type } : {}),
    ...(scope.cityId ? { cityId: scope.cityId } : {}),
    ...(scope.extraWhere ?? {}),
  };

  const [count, distinctRows, latest, lowQualityCount] = await Promise.all([
    db.submission.count({ where: baseWhere }),
    db.submission.groupBy({
      by: ["ipHash"],
      where: { ...baseWhere, ipHash: { not: null } },
    }),
    db.submission.findFirst({
      where: baseWhere,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    db.submission.count({
      where: { ...baseWhere, qualityScore: { lt: 30 } },
    }),
  ]);

  const outlierRatio = count > 0 ? lowQualityCount / count : 0;

  return {
    count,
    distinctIpHashes: distinctRows.length,
    latestSubmissionAt: latest?.createdAt ?? null,
    outlierRatio,
  };
}

/** Convenience wrapper — fetch + compute in one call. */
export async function getScopeTrustScore(scope: ScopeWhere): Promise<TrustScore> {
  const inputs = await fetchTrustScoreInputs(scope);
  return computeTrustScore(inputs);
}
