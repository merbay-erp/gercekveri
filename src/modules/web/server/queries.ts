import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { scanWeb } from "@/services/risk/web";
import { generateVerdict } from "@/services/risk/ai-verdict";
import { bandForScore, reportSignal, scoreFromSignals } from "@/services/risk/score";
import type { Signal } from "@/services/risk/types";
import { normalizeDomain } from "../normalize";
import type { FraudFeedItem, WebEntityView } from "../types";

const SCAN_TTL_MS = 24 * 60 * 60 * 1000; // taze tarama 24 saat geçerli

function readSignals(json: Prisma.JsonValue | null): Signal[] {
  if (!Array.isArray(json)) return [];
  return json as unknown as Signal[];
}

// Teknik sinyaller + halk ihbarı → güncel görünüm (her okumada taze).
function buildView(e: {
  key: string;
  display: string;
  signals: Prisma.JsonValue | null;
  aiSummary: string | null;
  reportCount: number;
  lastScanAt: Date | null;
}): WebEntityView {
  const tech = readSignals(e.signals);
  const rep = reportSignal(e.reportCount);
  const signals = rep ? [...tech, rep] : tech;
  const score = scoreFromSignals(signals);
  return {
    key: e.key,
    display: e.display,
    signals,
    score,
    band: bandForScore(score, signals.length > 0),
    aiSummary: e.aiSummary ?? "",
    reportCount: e.reportCount,
    lastScanAt: e.lastScanAt?.toISOString() ?? null,
  };
}

/** Domaini bulur/tarar (gerekirse), önbelleğe yazar ve güncel görünümü döner. */
export async function getOrScanWebEntity(raw: string): Promise<WebEntityView | null> {
  const key = normalizeDomain(raw);
  if (!key) return null;

  let entity = await db.fraudEntity
    .findUnique({ where: { kind_key: { kind: "WEB", key } } })
    .catch(() => null);

  const stale = !entity || !entity.lastScanAt || Date.now() - entity.lastScanAt.getTime() > SCAN_TTL_MS;

  if (stale) {
    const scan = await scanWeb(key);
    const aiSummary = await generateVerdict({
      display: key,
      band: scan.band,
      score: scan.score,
      signals: scan.signals,
    });
    const data = {
      riskScore: scan.score,
      band: scan.band,
      signals: scan.signals as unknown as Prisma.InputJsonValue,
      aiSummary,
      lastScanAt: new Date(),
    };
    entity = await db.fraudEntity
      .upsert({
        where: { kind_key: { kind: "WEB", key } },
        create: { kind: "WEB", key, display: key, ...data },
        update: data,
      })
      .catch(() => entity);
  }

  if (!entity) return null;

  db.fraudEntity
    .update({ where: { id: entity.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return buildView(entity);
}

/** Son bildirilen riskli varlıklar — ana sayfa ve /son-dolandiriciliklar feed'i. */
export async function listRecentFraud(limit = 8): Promise<FraudFeedItem[]> {
  const rows = await db.fraudEntity
    .findMany({
      where: { kind: "WEB", reportCount: { gt: 0 } },
      orderBy: [{ updatedAt: "desc" }],
      take: limit,
      include: {
        reports: { orderBy: { createdAt: "desc" }, take: 1, select: { category: true } },
      },
    })
    .catch(() => []);

  return rows.map((r) => ({
    key: r.key,
    display: r.display,
    band: r.band as FraudFeedItem["band"],
    reportCount: r.reportCount,
    topCategory: r.reports[0]?.category ?? null,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getFraudStats(): Promise<{ entities: number; reports: number; flagged: number }> {
  const [entities, reports, flagged] = await Promise.all([
    db.fraudEntity.count().catch(() => 0),
    db.fraudReport.count().catch(() => 0),
    db.fraudEntity.count({ where: { band: { in: ["DANGER", "SUSPICIOUS"] } } }).catch(() => 0),
  ]);
  return { entities, reports, flagged };
}
