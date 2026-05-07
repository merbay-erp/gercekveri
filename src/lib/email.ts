/**
 * Email helper — Resend free tier (100/day, 3000/month).
 *
 * Behaviour intentionally degrades silently:
 *  - No RESEND_API_KEY → log to console, return ok:true (so callers don't
 *    treat a missing config as a failure)
 *  - Resend API error → log + return ok:false, but caller should never
 *    propagate the failure to the user-facing flow
 *
 * Production deploys MUST set:
 *   RESEND_API_KEY        — from resend.com/api-keys
 *   ADMIN_NOTIFY_EMAIL    — where flagged-submission alerts are sent
 *   EMAIL_FROM (optional) — default: "GerçekVeri <onboarding@resend.dev>"
 */
import { Resend } from "resend";

interface SendArgs {
  to: string;
  subject: string;
  /** Plain-text body. Will be converted to a minimal HTML wrapper. */
  text: string;
  /** Optional HTML override — if absent, text is wrapped in <pre>. */
  html?: string;
}

interface SendResult {
  ok: boolean;
  /** Resend message id when sent successfully */
  id?: string;
  error?: string;
  /** True when no API key was configured — operation was a no-op. */
  skipped?: boolean;
}

const FALLBACK_FROM = "GerçekVeri <onboarding@resend.dev>";

let _client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (_client) return _client;
  _client = new Resend(key);
  return _client;
}

export async function sendEmail({ to, subject, text, html }: SendArgs): Promise<SendResult> {
  const client = getClient();
  if (!client) {
    console.log(
      `[email] (skipped — no RESEND_API_KEY) to=${to} subject=${subject}\n${text}`,
    );
    return { ok: true, skipped: true };
  }

  const from = process.env.EMAIL_FROM || FALLBACK_FROM;
  const finalHtml =
    html ??
    `<pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(text)}</pre>`;

  try {
    const result = await client.emails.send({
      from,
      to,
      subject,
      text,
      html: finalHtml,
    });
    if (result.error) {
      console.warn("[email] resend error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.warn("[email] send threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Returns the configured admin notify email, or null if unset. */
export function getAdminNotifyEmail(): string | null {
  const email = process.env.ADMIN_NOTIFY_EMAIL;
  if (!email || !email.includes("@")) return null;
  return email;
}
