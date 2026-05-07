/**
 * Admin auth — bcrypt-hashed passwords stored on AdminUser, session
 * encoded as a signed JWT in an httpOnly cookie. No password recovery
 * (single-admin scenario; reset via DB).
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

const COOKIE_NAME = "gv_admin";
const COOKIE_MAX_AGE_S = 60 * 60 * 12; // 12 hours
const ALG = "HS256";

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_SESSION_SECRET;
  if (!raw || raw.length < 32) {
    // Generate a stable runtime fallback so dev still works without env;
    // production deploys MUST set ADMIN_SESSION_SECRET.
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET must be set in production (32+ chars)");
    }
    return new TextEncoder().encode("dev-only-secret-please-set-in-prod-32chars");
  }
  return new TextEncoder().encode(raw);
}

export interface AdminSession {
  id: string;
  email: string;
  role: "ADMIN" | "MODERATOR";
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ ok: true; session: AdminSession } | { ok: false; error: string }> {
  const user = await db.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive) {
    return { ok: false, error: "Geçersiz kullanıcı veya şifre." };
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { ok: false, error: "Geçersiz kullanıcı veya şifre." };

  await db.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const session: AdminSession = {
    id: user.id,
    email: user.email,
    role: user.role as AdminSession["role"],
  };

  const token = await new SignJWT({ sub: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_S}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_S,
  });

  return { ok: true, session };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    const role = payload.role === "ADMIN" ? "ADMIN" : "MODERATOR";
    return { id: payload.sub, email: payload.email, role };
  } catch {
    return null;
  }
}

/** Throwing version for use in server components/actions that require auth. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
