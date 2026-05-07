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
