/**
 * Admin notifications — fires on suspicious or auto-flagged submissions.
 * Always wraps email I/O in try/catch so the user-facing submission flow
 * never fails because of notification trouble.
 */
import { sendEmail, getAdminNotifyEmail } from "@/lib/email";
import { db } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

interface NotifyFlagArgs {
  publicId: string;
  type: string;
  reason: string;
  amount?: number | null;
  currency?: string | null;
  cityName?: string | null;
  ipHash?: string | null;
  qualityScore?: number | null;
}

const TYPE_LABELS: Record<string, string> = {
  SALARY: "Maaş",
  RENT: "Kira",
  AIDAT: "Aidat",
  INTERNET: "İnternet",
  UTILITY: "Fatura",
  TEXTILE: "Tekstil",
};

export async function notifyAdminFlag(args: NotifyFlagArgs): Promise<void> {
  const to = getAdminNotifyEmail();
  if (!to) return;

  const typeLabel = TYPE_LABELS[args.type] ?? args.type;
  const subject = `[GerçekVeri] Yeni şüpheli paylaşım — ${typeLabel}`;
  const detailUrl = `${SITE_URL}/admin/submissions/${args.publicId}`;

  const lines = [
    "Yeni bir paylaşım otomatik flag'lendi.",
    "",
    `Tip:        ${typeLabel}`,
    `Sebep:      ${args.reason}`,
  ];
  if (args.amount && args.currency) {
    lines.push(`Tutar:      ${args.currency} ${args.amount}`);
  }
  if (args.cityName) lines.push(`Şehir:      ${args.cityName}`);
  if (typeof args.qualityScore === "number") {
    lines.push(`Quality:    ${args.qualityScore}`);
  }
  if (args.ipHash) lines.push(`IP hash:    ${args.ipHash.slice(0, 16)}…`);
  lines.push("");
  lines.push(`İncele:     ${detailUrl}`);

  try {
    await sendEmail({ to, subject, text: lines.join("\n") });
  } catch (err) {
    console.warn("[notify] flag email failed:", err);
  }
}

/**
 * Examine a freshly-created submission and decide whether to auto-flag it
 * (and notify the admin). Returns the resolved status — caller updates
 * the submission row + writes ModerationLog accordingly.
 *
 * Heuristics (any of these triggers FLAGGED):
 *  - qualityScore < 25 (very far from city mean)
 *  - 24h volume from same ipHash >= 5
 */
export interface AutoFlagDecision {
  shouldFlag: boolean;
  reason: string | null;
}

const VOLUME_FLAG_THRESHOLD = 5;

export async function evaluateAutoFlag(args: {
  ipHash: string | null;
  qualityScore: number | null;
}): Promise<AutoFlagDecision> {
  if (typeof args.qualityScore === "number" && args.qualityScore < 25) {
    return {
      shouldFlag: true,
      reason: `Düşük kalite skoru (Q${args.qualityScore}) — şehir ortalamasından ciddi sapma`,
    };
  }

  if (args.ipHash && !args.ipHash.startsWith("demo-")) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await db.submission.count({
      where: { ipHash: args.ipHash, createdAt: { gte: since } },
    });
    if (count >= VOLUME_FLAG_THRESHOLD) {
      return {
        shouldFlag: true,
        reason: `Aynı IP hash'inden 24 saatte ${count} paylaşım — yüksek volume`,
      };
    }
  }

  return { shouldFlag: false, reason: null };
}
