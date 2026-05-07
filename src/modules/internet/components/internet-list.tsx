import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { InternetCard } from "./internet-card";
import { internetModule } from "../config";
import type { InternetSubmissionView } from "../types";

interface Props {
  submissions: InternetSubmissionView[];
}

export function InternetList({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <h3 className="text-base font-medium">Henüz ölçüm yok</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          İnternetinin gerçek hızını ve ping'ini anonim olarak paylaşan ilk kişi sen ol.
        </p>
        <Link
          href={internetModule.newPath}
          className={`mt-4 inline-flex ${buttonVariants()}`}
        >
          Ölçümümü paylaş
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {submissions.map((s) => (
        <li key={s.publicId}>
          <InternetCard submission={s} />
        </li>
      ))}
    </ul>
  );
}
