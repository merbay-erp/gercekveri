import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MaasCard } from "./maas-card";
import { maasModule } from "../config";
import type { SalarySubmissionView } from "../types";

interface Props {
  submissions: SalarySubmissionView[];
}

export function MaasList({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <h3 className="text-base font-medium">Henüz veri yok</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          İlk paylaşan sen ol — pozisyonunu ve maaşını anonim olarak ekle.
        </p>
        <Link href={maasModule.newPath} className={`mt-4 inline-flex ${buttonVariants()}`}>
          Maaşımı paylaş
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {submissions.map((s) => (
        <li key={s.publicId}>
          <MaasCard submission={s} />
        </li>
      ))}
    </ul>
  );
}
