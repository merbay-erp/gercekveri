"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { hashFingerprint, hashIp } from "@/lib/fingerprint";
import { scanWeb } from "@/services/risk/web";
import { generateVerdict } from "@/services/risk/ai-verdict";
import { normalizeDomain } from "../normalize";
import { reportCategories } from "../config";

const reportSchema = z.object({
  domain: z.string().min(4).max(253),
  category: z.enum(reportCategories.map((c) => c.key) as [string, ...string[]]),
  note: z.string().max(500).optional().or(z.literal("")),
  // honeypot — bot doldurursa sessizce reddet
  website: z.string().max(0).optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
export type ActionResult = { ok: true; key: string } | { ok: false; error: string };

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
  if (website) return { ok: true, key: "" }; // honeypot

  const key = normalizeDomain(parsed.data.domain);
  if (!key) return { ok: false, error: "Geçerli bir web adresi gir (ör. site.com)." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ipHash = hashIp(ip);
  const fingerprint = hashFingerprint({ ua: h.get("user-agent"), lang: h.get("accept-language") });
  const country = h.get("x-vercel-ip-country") ?? null;

  // basit oran sınırı: aynı ipHash + domain için 24 saatte tek ihbar
  if (ipHash) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dup = await db.fraudReport
      .findFirst({ where: { ipHash, entity: { key }, createdAt: { gt: since } } })
      .catch(() => null);
    if (dup) return { ok: false, error: "Bu adresi son 24 saatte zaten bildirdin." };
  }

  // varlık yoksa tara ve oluştur
  let entity = await db.fraudEntity
    .findUnique({ where: { kind_key: { kind: "WEB", key } } })
    .catch(() => null);
  if (!entity) {
    const scan = await scanWeb(key);
    const aiSummary = await generateVerdict({ display: key, band: scan.band, score: scan.score, signals: scan.signals });
    entity = await db.fraudEntity
      .create({
        data: {
          kind: "WEB",
          key,
          display: key,
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
    data: {
      entityId: entity.id,
      category,
      note: note ? maskPii(note) : null,
      ipHash,
      fingerprint,
      country,
    },
  });
  await db.fraudEntity.update({
    where: { id: entity.id },
    data: { reportCount: { increment: 1 } },
  });

  return { ok: true, key };
}
