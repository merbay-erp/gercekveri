"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction, type ChangePasswordResult } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Değiştiriliyor..." : "Şifreyi değiştir"}
    </Button>
  );
}

export function PasswordForm() {
  const [state, formAction] = React.useActionState<
    ChangePasswordResult | null,
    FormData
  >(changePasswordAction, null);

  // Reset form on success — useRef on a form to call .reset()
  const formRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.ok ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Şifre başarıyla değiştirildi.</span>
        </div>
      ) : null}
      {state?.error ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="current">Mevcut şifre</Label>
        <Input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="next">Yeni şifre</Label>
        <Input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">En az 8 karakter.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Yeni şifre (tekrar)</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
}
