import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { generateVerdict } from "@/services/risk/ai-verdict";
import { bandForScore, reportSignal, scoreFromSignals } from "@/services/risk/score";
import type { Signal } from "@/services/risk/types";
import {
  REGISTRY,
  kindFromEntity,
  kindFromSlug,
  type KindDef,
  type LookupKind,
} from "@/services/risk/registry";
import type { EntityView, FraudFeedItem } from "../types";

const SCAN_TTL_MS = 24 * 60 * 60 * 1000;

function readSignals(json: Prisma.JsonValue | null): Signal[] {
  return Array.isArray(json) ? (json as unknown as Signal[]) : [];
}

function buildView(
  def: KindDef,
  e: { key: string; display: string; signals: Prisma.JsonValue | null; aiSummary: string | null; reportCount: number; lastScanAt: Date | null },
): EntityView {
  const tech = readSignals(e.signals);
  const rep = reportSignal(e.reportCount);
  const signals = rep ? [...tech, rep] : tech;
  const score = scoreFromSignals(signals);
  // İtibar-yalnız tiplerde (IBAN/telefon) ihbar yoksa "Doğrulanmadı" — biçim doğru ≠ güvenli.
  const band =
    def.reputationOnly && e.reportCount === 0 ? "UNKNOWN" : bandForScore(score, signals.length > 0);
  return {
    kind: def.kind,
    key: e.key,
    display: e.display,
    signals,
    score,
    band,
    aiSummary: e.aiSummary ?? "",
    reportCount: e.reportCount,
    lastScanAt: e.lastScanAt?.toISOString() ?? null,
  };
}

/** Bir değeri (kind'e göre) bulur/tarar, önbelleğe yazar, güncel görünümü döner. */
export async function getOrScanEntity(kindSlug: string, raw: string): Promise<EntityView | null> {
  const def = kindFromSlug(kindSlug);
  if (!def) return null;
  const key = def.normalize(raw);
  if (!key) return null;

  let entity = await db.fraudEntity
    .findUnique({ where: { kind_key: { kind: def.entityKind, key } } })
    .catch(() => null);

  const stale = !entity || !entity.lastScanAt || Date.now() - entity.lastScanAt.getTime() > SCAN_TTL_MS;

  if (stale) {
    const scan = await def.scan(key);
    const display = def.display(key);
    const aiSummary = await generateVerdict({
      display,
      band: scan.band,
      score: scan.score,
      signals: scan.signals,
      subject: def.label.toLowerCase(),
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
        where: { kind_key: { kind: def.entityKind, key } },
        create: { kind: def.entityKind, key, display, ...data },
        update: data,
      })
      .catch(() => entity);
  }

  if (!entity) return null;
  db.fraudEntity.update({ where: { id: entity.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
  return buildView(def, entity);
}

/** Son bildirilen riskli varlıklar — tüm tipler ya da tek tip. */
export async function listRecentFraud(opts: { kind?: LookupKind; limit?: number } = {}): Promise<FraudFeedItem[]> {
  const where: Prisma.FraudEntityWhereInput = { reportCount: { gt: 0 } };
  if (opts.kind) where.kind = REGISTRY[opts.kind].entityKind;

  const rows = await db.fraudEntity
    .findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      take: opts.limit ?? 8,
      include: { reports: { orderBy: { createdAt: "desc" }, take: 1, select: { category: true } } },
    })
    .catch(() => []);

  return rows.map((r) => ({
    kind: kindFromEntity(r.kind).kind,
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
