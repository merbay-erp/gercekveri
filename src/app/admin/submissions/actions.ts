"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type ActionResult = { ok: true } | { ok: false; error: string };

async function logModeration(
  submissionId: string,
  action: string,
  reason: string | null,
  adminId: string,
) {
  await db.moderationLog.create({
    data: {
      submissionId,
      action,
      reason,
      actor: `admin:${adminId}`,
    },
  });
}

export async function approveSubmission(publicId: string): Promise<ActionResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  const sub = await db.submission.findUnique({
    where: { publicId },
    select: { id: true, status: true },
  });
  if (!sub) return { ok: false, error: "Paylaşım bulunamadı." };

  await db.submission.update({
    where: { id: sub.id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });
  await logModeration(sub.id, "manual-approve", null, admin.id);

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${publicId}`);
  return { ok: true };
}

export async function rejectSubmission(
  publicId: string,
  reason: string | null,
): Promise<ActionResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  const sub = await db.submission.findUnique({
    where: { publicId },
    select: { id: true },
  });
  if (!sub) return { ok: false, error: "Paylaşım bulunamadı." };

  await db.submission.update({
    where: { id: sub.id },
    data: { status: "REJECTED" },
  });
  await logModeration(sub.id, "manual-reject", reason, admin.id);

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${publicId}`);
  return { ok: true };
}

export interface BulkFilter {
  type?: string;
  status?: string;
  lowQuality?: boolean;
}

export type BulkResult = { ok: true; count: number } | { ok: false; error: string };

const VALID_TARGET_STATUSES = new Set(["APPROVED", "REJECTED", "FLAGGED"]);

export async function bulkUpdateSubmissions(
  filter: BulkFilter,
  targetStatus: "APPROVED" | "REJECTED" | "FLAGGED",
): Promise<BulkResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }
  if (!VALID_TARGET_STATUSES.has(targetStatus)) {
    return { ok: false, error: "Geçersiz hedef durum." };
  }

  const where = {
    ...(filter.type ? { type: filter.type as "SALARY" } : {}),
    ...(filter.status ? { status: filter.status as "APPROVED" } : {}),
    ...(filter.lowQuality ? { qualityScore: { lt: 30 } } : {}),
    // Defensive guard: never let bulk touch already-target rows.
    NOT: { status: targetStatus as "APPROVED" },
  };

  const rows = await db.submission.findMany({ where, select: { id: true } });
  if (rows.length === 0) return { ok: true, count: 0 };
  // Cap to prevent runaway operations — admin can repeat if needed.
  const ids = rows.slice(0, 500).map((r) => r.id);

  await db.$transaction([
    db.submission.updateMany({
      where: { id: { in: ids } },
      data: {
        status: targetStatus,
        ...(targetStatus === "APPROVED" ? { approvedAt: new Date() } : {}),
      },
    }),
    db.moderationLog.createMany({
      data: ids.map((id) => ({
        submissionId: id,
        action: `bulk-${targetStatus.toLowerCase()}`,
        reason: `filter: ${JSON.stringify(filter)}`,
        actor: `admin:${admin.id}`,
      })),
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  return { ok: true, count: ids.length };
}

export async function flagSubmission(
  publicId: string,
  reason: string | null,
): Promise<ActionResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  const sub = await db.submission.findUnique({
    where: { publicId },
    select: { id: true },
  });
  if (!sub) return { ok: false, error: "Paylaşım bulunamadı." };

  await db.submission.update({
    where: { id: sub.id },
    data: { status: "FLAGGED" },
  });
  await logModeration(sub.id, "manual-flag", reason, admin.id);

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${publicId}`);
  return { ok: true };
}
