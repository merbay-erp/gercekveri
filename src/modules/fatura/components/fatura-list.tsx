import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { FaturaCard } from "./fatura-card";
import { faturaModule } from "../config";
import type { FaturaSubmissionView } from "../types";

interface Props {
  submissions: FaturaSubmissionView[];
}

export function FaturaList({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <h3 className="text-base font-medium">Henüz fatura verisi yok</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Elektrik, doğalgaz ya da su faturanı anonim olarak paylaşan ilk kişi sen ol.
        </p>
        <Link href={faturaModule.newPath} className={`mt-4 inline-flex ${buttonVariants()}`}>
          Faturamı paylaş
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {submissions.map((s) => (
        <li key={s.publicId}>
          <FaturaCard submission={s} />
        </li>
      ))}
    </ul>
  );
}
