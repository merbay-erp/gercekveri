import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { KiraCard } from "./kira-card";
import { kiraModule } from "../config";
import type { RentSubmissionView } from "../types";

interface Props {
  submissions: RentSubmissionView[];
}

export function KiraList({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <h3 className="text-base font-medium">Henüz kira verisi yok</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          İlk paylaşan sen ol — semtindeki kira tutarını anonim olarak ekle.
        </p>
        <Link href={kiraModule.newPath} className={`mt-4 inline-flex ${buttonVariants()}`}>
          Kira ilanımı paylaş
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {submissions.map((s) => (
        <li key={s.publicId}>
          <KiraCard submission={s} />
        </li>
      ))}
    </ul>
  );
}
