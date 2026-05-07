import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Bell, BellOff } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminNotifyEmail } from "@/lib/email";
import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const user = await db.adminUser.findUnique({
    where: { id: session.id },
    select: {
      email: true,
      name: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  if (!user) redirect("/admin/login");

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="text-sm text-muted-foreground">
          Hesap bilgisi ve şifre yönetimi.
        </p>
      </div>

      <Card className="mb-6 p-5">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <Field label="Email">{user.email}</Field>
          <Field label="İsim">{user.name ?? "—"}</Field>
          <Field label="Rol">
            <Badge variant="secondary" className="font-normal">
              {user.role}
            </Badge>
          </Field>
          <Field label="Son giriş">
            {user.lastLoginAt
              ? format(user.lastLoginAt, "yyyy-MM-dd HH:mm")
              : "—"}
          </Field>
          <Field label="Hesap oluşturma">
            {format(user.createdAt, "yyyy-MM-dd")}
          </Field>
        </div>
      </Card>

      <Card className="mb-6 p-5">
        <h2 className="mb-3 text-base font-medium">Bildirimler</h2>
        <NotificationStatus />
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-base font-medium">Şifre değiştir</h2>
        <PasswordForm />
      </Card>
    </div>
  );
}

function NotificationStatus() {
  const adminEmail = getAdminNotifyEmail();
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  if (!resendConfigured) {
    return (
      <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
        <BellOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <p className="font-medium">Email bildirimleri kapalı</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono">RESEND_API_KEY</span> ortam değişkeni
            ayarlanmamış. Auto-flag tetiklendiğinde email gönderilmez; sadece
            ModerationLog'a kayıt düşer.
          </p>
        </div>
      </div>
    );
  }

  if (!adminEmail) {
    return (
      <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
        <BellOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <p className="font-medium">Hedef email tanımlı değil</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono">ADMIN_NOTIFY_EMAIL</span> ortam değişkeni
            ayarlanmamış. Email bildirimleri inaktif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
      <Bell className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <div>
        <p className="font-medium">Email bildirimleri aktif</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Auto-flag tetiklendiğinde <span className="font-mono">{adminEmail}</span>{" "}
          adresine bildirim gönderilir. Tetikleyiciler: 24 saatte aynı IP'den 5+ paylaşım,
          quality skoru 25'in altında.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5">{children}</p>
    </div>
  );
}
