import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { TekstilCard } from "./tekstil-card";
import { tekstilModule } from "../config";
import type { TekstilSubmissionView } from "../types";

interface Props {
  submissions: TekstilSubmissionView[];
}

export function TekstilList({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <h3 className="text-base font-medium">Henüz fiyat verisi yok</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Sektördeki gerçek üretim fiyatlarını anonim paylaşan ilk kişi sen ol.
        </p>
        <Link href={tekstilModule.newPath} className={`mt-4 inline-flex ${buttonVariants()}`}>
          Fiyatımı paylaş
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {submissions.map((s) => (
        <li key={s.publicId}>
          <TekstilCard submission={s} />
        </li>
      ))}
    </ul>
  );
}
