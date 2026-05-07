import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { AidatCard } from "./aidat-card";
import { aidatModule } from "../config";
import type { AidatSubmissionView } from "../types";

interface Props {
  submissions: AidatSubmissionView[];
}

export function AidatList({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <h3 className="text-base font-medium">Henüz aidat verisi yok</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Sitende ya da binanda ödenen aidatı anonim olarak paylaşan ilk kişi sen ol.
        </p>
        <Link href={aidatModule.newPath} className={`mt-4 inline-flex ${buttonVariants()}`}>
          Aidatımı paylaş
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {submissions.map((s) => (
        <li key={s.publicId}>
          <AidatCard submission={s} />
        </li>
      ))}
    </ul>
  );
}
