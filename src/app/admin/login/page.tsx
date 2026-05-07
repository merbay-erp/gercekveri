import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Girişi",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-muted/20 px-4 py-12">
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Admin paneli</h1>
            <p className="text-xs text-muted-foreground">GerçekVeri yönetim girişi</p>
          </div>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
