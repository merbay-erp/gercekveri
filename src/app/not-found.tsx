import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Sayfa bulunamadı</h1>
      <p className="max-w-md text-muted-foreground">
        Aradığın sayfa ya henüz yayında değil ya da kaldırılmış olabilir. Ana
        sayfaya dönüp keşfetmeye devam edebilirsin.
      </p>
      <Link href="/" className={buttonVariants()}>
        Ana sayfaya dön
      </Link>
    </div>
  );
}
