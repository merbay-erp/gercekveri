"use server";

import { redirect } from "next/navigation";

import { loginWithPassword, logout } from "@/lib/admin-auth";

export interface LoginActionResult {
  ok: boolean;
  error?: string;
}

export async function loginAction(
  _prev: LoginActionResult | null,
  formData: FormData,
): Promise<LoginActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email ve şifre zorunlu." };
  }

  const result = await loginWithPassword(email, password);
  if (!result.ok) return { ok: false, error: result.error };

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}
