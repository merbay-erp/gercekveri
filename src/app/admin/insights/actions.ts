"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type Result = { ok: true } | { ok: false; error: string };

export async function updateInsight(
  scope: string,
  payload: { title: string | null; body: string; bullets: string[] },
): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  const existing = await db.aiSummary.findUnique({
    where: { scope_language: { scope, language: "tr" } },
  });
  if (!existing) return { ok: false, error: "Insight bulunamadı." };

  await db.aiSummary.update({
    where: { scope_language: { scope, language: "tr" } },
    data: {
      title: payload.title?.trim() || null,
      body: payload.body.trim(),
      bullets: payload.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
    },
  });

  revalidatePath("/admin/insights");
  return { ok: true };
}

export async function regenerateInsight(scope: string): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  // Setting promptHash to a fresh sentinel + clearing validUntil forces the
  // next page hit to call Gemini again on the updated prompt.
  await db.aiSummary.update({
    where: { scope_language: { scope, language: "tr" } },
    data: {
      promptHash: "force-regenerate-" + Date.now(),
      validUntil: null,
    },
  });

  revalidatePath("/admin/insights");
  return { ok: true };
}

export async function deleteInsight(scope: string): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  await db.aiSummary.delete({
    where: { scope_language: { scope, language: "tr" } },
  });

  revalidatePath("/admin/insights");
  return { ok: true };
}
