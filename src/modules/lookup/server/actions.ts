"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { hashFingerprint, hashIp } from "@/lib/fingerprint";
import { generateVerdict } from "@/services/risk/ai-verdict";
import { kindFromSlug } from "@/services/risk/registry";

const reportSchema = z.object({
  kind: z.enum(["web", "iban", "phone"]),
  value: z.string().min(3).max(253),
  category: z.string().min(2).max(40),
  note: z.string().max(500).optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot
});

export type ReportInput = z.infer<typeof reportSchema>;
export type ActionResult = { ok: true; kind: string; key: string } | { ok: false; error: string };

// PII maskeleme: not içindeki IBAN/telefon/e-posta benzeri dizileri kırpar.
function maskPii(s: string): string {
  return s
    .replace(/\bTR\d{2}[\s\d]{16,30}\b/gi, "[IBAN]")
    .replace(/\b(?:\+?90|0)?\s?5\d{2}[\s\d]{6,9}\b/g, "[telefon]")
    .replace(/\b[\w.+-]+@[\w.-]+\.\w{2,}\b/g, "[e-posta]")
    .trim();
}

export async function submitFraudReport(input: ReportInput): Promise<ActionResult> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz ihbar bilgisi." };
  const { website, category, note } = parsed.data;
  if (website) return { ok: true, kind: parsed.data.kind, key: "" }; // honeypot

  const def = kindFromSlug(parsed.data.kind);
  if (!def) return { ok: false, error: "Geçersiz sorgu türü." };
  if (!def.categories.some((c) => c.key === category)) {
    return { ok: false, error: "Geçersiz dolandırıcılık kategorisi." };
  }

  const key = def.normalize(parsed.data.value);
  if (!key) return { ok: false, error: `Geçerli bir ${def.label.toLowerCase()} gir.` };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ipHash = hashIp(ip);
  const fingerprint = hashFingerprint({ ua: h.get("user-agent"), lang: h.get("accept-language") });
  const country = h.get("x-vercel-ip-country") ?? null;

  // oran sınırı: aynı ipHash + varlık için 24 saatte tek ihbar
  if (ipHash) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dup = await db.fraudReport
      .findFirst({ where: { ipHash, entity: { kind: def.entityKind, key }, createdAt: { gt: since } } })
      .catch(() => null);
    if (dup) return { ok: false, error: "Bunu son 24 saatte zaten bildirdin." };
  }

  let entity = await db.fraudEntity
    .findUnique({ where: { kind_key: { kind: def.entityKind, key } } })
    .catch(() => null);
  if (!entity) {
    const scan = await def.scan(key);
    const display = def.display(key);
    const aiSummary = await generateVerdict({
      display,
      band: scan.band,
      score: scan.score,
      signals: scan.signals,
      subject: def.label.toLowerCase(),
    });
    entity = await db.fraudEntity
      .create({
        data: {
          kind: def.entityKind,
          key,
          display,
          riskScore: scan.score,
          band: scan.band,
          signals: scan.signals as unknown as Prisma.InputJsonValue,
          aiSummary,
          lastScanAt: new Date(),
        },
      })
      .catch(() => null);
  }
  if (!entity) return { ok: false, error: "İhbar kaydedilemedi, tekrar dene." };

  await db.fraudReport.create({
    data: { entityId: entity.id, category, note: note ? maskPii(note) : null, ipHash, fingerprint, country },
  });
  await db.fraudEntity.update({ where: { id: entity.id }, data: { reportCount: { increment: 1 } } });

  return { ok: true, kind: def.kind, key };
}
