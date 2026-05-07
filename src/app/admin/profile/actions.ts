"use server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export interface ChangePasswordResult {
  ok: boolean;
  error?: string;
}

export async function changePasswordAction(
  _prev: ChangePasswordResult | null,
  formData: FormData,
): Promise<ChangePasswordResult> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next) return { ok: false, error: "Tüm alanlar zorunlu." };
  if (next.length < 8) return { ok: false, error: "Yeni şifre en az 8 karakter olmalı." };
  if (next !== confirm) return { ok: false, error: "Yeni şifreler eşleşmiyor." };
  if (current === next) {
    return { ok: false, error: "Yeni şifre mevcut şifreyle aynı olamaz." };
  }

  const user = await db.adminUser.findUnique({ where: { id: admin.id } });
  if (!user) return { ok: false, error: "Kullanıcı bulunamadı." };

  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) return { ok: false, error: "Mevcut şifre hatalı." };

  const passwordHash = await bcrypt.hash(next, 10);
  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { ok: true };
}
