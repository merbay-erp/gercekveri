/**
 * Shared post-create hook for submission server actions.
 *
 * After a submission row exists, this:
 *  1. Runs auto-flag heuristics (volume / quality)
 *  2. If flagged: updates status, writes ModerationLog, sends admin email
 *
 * The function is fire-and-forget from the caller's perspective — it
 * NEVER throws into the user-facing flow, even if email or DB writes
 * fail. The user's submission is already persisted by the time this runs.
 */
import { db } from "@/lib/db";
import { evaluateAutoFlag, notifyAdminFlag } from "./notifications";

interface PostprocessArgs {
  submissionId: string;
  publicId: string;
  type: string;
  ipHash: string | null;
  qualityScore: number | null;
  amount?: number | null;
  currency?: string | null;
  cityName?: string | null;
}

export async function postprocessSubmission(args: PostprocessArgs): Promise<void> {
  try {
    const decision = await evaluateAutoFlag({
      ipHash: args.ipHash,
      qualityScore: args.qualityScore,
    });
    if (!decision.shouldFlag || !decision.reason) return;

    await db.submission.update({
      where: { id: args.submissionId },
      data: { status: "FLAGGED" },
    });

    await db.moderationLog.create({
      data: {
        submissionId: args.submissionId,
        action: "auto-flag",
        reason: decision.reason,
        actor: "system",
      },
    });

    await notifyAdminFlag({
      publicId: args.publicId,
      type: args.type,
      reason: decision.reason,
      amount: args.amount,
      currency: args.currency,
      cityName: args.cityName,
      ipHash: args.ipHash,
      qualityScore: args.qualityScore,
    });
  } catch (err) {
    console.warn("[submission-postprocess] failed:", err);
  }
}
